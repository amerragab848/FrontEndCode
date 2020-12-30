import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import LoadingSection from '../../publicComponants/LoadingSection';
import config from '../../../Services/Config';
import Resources from '../../../resources.json';
import Api from '../../../api';
import { toast } from 'react-toastify';
import { Formik, Form } from 'formik';
import ReactTable from 'react-table';

let currentLanguage =
    localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

let CurrProject = localStorage.getItem('lastSelectedprojectName');

class DocumentEdit extends Component {
    constructor(props) {
        super(props);

        if (!config.IsAllow(10141)) {
            toast.warn(Resources['missingPermissions'][currentLanguage]);
            this.props.history.goBack();
        }

        this.columns = [
            {
                Header: Resources['documentTitle'][currentLanguage],
                accessor: 'docTypeEn',
                width: 350,
            },
            {
                Header: Resources['ArabicName'][currentLanguage],
                accessor: 'docTypeAr',
                sortabel: true,
                width: 350,
            },
            {
                Header: Resources['DocumentRefCode'][currentLanguage],
                accessor: 'refCode',
                sortabel: true,
                width: 350,
            },
            {
                Header: Resources['docName'][currentLanguage],
                accessor: 'name',
                sortabel: true,
                width: 350,
            },
        ];

        this.state = {
            isLoading: false,
            rows: [],
            documentObj: {
                id: "",
                docTypeEn: "",
                docTypeAr: ""
            },
            selectedRow: {},
            pageNumber: 0,
            pageSize: 50,
            filterPageNumber: 0,
            isFilter: false,
            totalRows: 0,
            query: {}
        };
    }

    componentDidMount = () => {
        this.setState({ isLoading: true });
        Api.get(`GetDocTypesByPagination?pageNumber=${this.state.pageNumber}&pageSize=${this.state.pageSize}`).then(result => {
            this.setState({
                rows: result.data || [],
                totalRows: result.totalRows || 0,
                isLoading: false
            });
        });
    };

    handleChange(e, name) {
        let originalDoc = { ...this.state.documentObj }
        let newDoc = {};
        newDoc[name] = e;
        Object.assign(originalDoc, newDoc);
        this.setState({ documentObj: originalDoc });
    }

    handleAdd = () => {
        let serverObj = { ...this.state.documentObj };
        if (serverObj.docTypeEn != "" && serverObj.docTypeAr != "") {
            this.setState({ isLoading: true });
            let emptyObj = { id: "", docTypeEn: "", docTypeAr: "" }
            Api.post("AddDocType", serverObj).then(result => {
                if (result) {
                    toast.success(Resources.operationSuccess[currentLanguage]);
                    let rows = this.state.rows;
                    rows.unshift(result);
                    this.setState({
                         rows: rows,
                         documentObj:emptyObj,
                          isLoading: false })
                }
            })
        } else {
            toast.error("Please Fill ModuleTitle and Arabic Name Fields");
        }
    }

    handleUpdate = () => {
        let serverObj = { ...this.state.documentObj };
        if (serverObj.id > 0 && serverObj.docTypeEn != "" && serverObj.docTypeAr != "") {
            this.setState({ isLoading: true });
            Api.post("EditDocType", serverObj).then(result => {
                if (result) {
                    toast.success(Resources.operationSuccess[currentLanguage]);
                    let rows = this.state.rows;
                    let rowIndex = rows.findIndex(x => x.id == result.id);
                    rows[rowIndex].docTypeEn = result.docTypeEn;
                    rows[rowIndex].docTypeAr = result.docTypeAr;
                    let emptyObj = { id: "", docTypeEn: "", docTypeAr: "" }
                    this.setState({
                        rows: rows,
                        documentObj: emptyObj,
                        selectedRow: {},
                        isLoading: false
                    })
                }
            })
        } else {
            toast.error("Please Fill ModuleTitle and Arabic Name Fields");
        }
    }

    handleSearch = (e) => {
        this.setState({
            isFilter: true,
            isLoading: true,
            filterPageNumber: 0,
            pageSize: 50
        })

        let documentObj = this.state.documentObj;
        let query = {}
        if (documentObj.docTypeEn != "")
            query["docTypeEn"] = documentObj.docTypeEn;
        if (documentObj.docTypeAr != "")
            query["docTypeAr"] = documentObj.docTypeAr;

        if (query != {}) {
            this.setState({ query: query })
            Api.get(`FilterDocTypes?pageNumber=${this.state.filterPageNumber}&pageSize=${this.state.pageSize}&query=${JSON.stringify(query)}`).then(result => {
                this.setState({
                    rows: result || [],
                    isLoading: false
                })
            })
        } else {
            Api.get('GetDocTypesByPagination').then(result => {
                this.setState({
                    rows: result.data || [],
                    totalRows: result.totalRows || 0,
                    isLoading: false
                });
            });
        }
    };

    handleReset = () => {

        this.setState({
            isLoading: true,
            rows: [],
            documentObj: {
                id: "",
                docTypeEn: "",
                docTypeAr: ""
            },
            selectedRow: {},
            pageNumber: 0,
            pageSize: 50,
            filterPageNumber: 0,
            isFilter: false
        });
        Api.get('GetDocTypesByPagination').then(result => {
            this.setState({
                rows: result.data || [],
                totalRows: result.totalRows || 0,
                isLoading: false
            });
        });
    }

    GetPrevoiusData() {
        let isFilter = this.state.isFilter;
        let PaginatioName = isFilter != true ? "pageNumber" : "filterPageNumber";
        let pageNumber = this.state[PaginatioName] - 1;

        if (pageNumber >= 0) {

            this.setState({
                isLoading: true,
                [PaginatioName]: pageNumber
            });
            let url = this.state.query == "{}" || isFilter != true ?
                `GetDocTypesByPagination?pageNumber=${pageNumber}&pageSize=${this.state.pageSize}`
                : `FilterDocTypes?pageNumber=${pageNumber}&pageSize=${this.state.pageSize}&query=${JSON.stringify(this.state.query)}`
            Api.get(url).then(result => {
                this.setState({
                    rows: isFilter != true ? result.data : result,
                    isLoading: false
                });
            }).catch(ex => {
                let oldRows = this.state.rows;
                this.setState({
                    rows: oldRows,
                    isLoading: false
                });
            });
        }
    };

    GetNextData() {
        let isFilter = this.state.isFilter;
        let PaginatioName = isFilter != true ? "pageNumber" : "filterPageNumber";
        let pageNumber = this.state[PaginatioName] + 1;
        let maxRows = this.state.totalRows;

        if (this.state.pageSize * pageNumber <= maxRows) {
            this.setState({
                isLoading: true,
                [PaginatioName]: pageNumber
            });
            let url = this.state.query == "{}" || isFilter != true ?
                `GetDocTypesByPagination?pageNumber=${pageNumber}&pageSize=${this.state.pageSize}`
                : `FilterDocTypes?pageNumber=${pageNumber}&pageSize=${this.state.pageSize}&query=${JSON.stringify(this.state.query)}`
            Api.get(url).then(result => {
                this.setState({
                    rows: isFilter != true ? result.data : result,
                    isLoading: false
                });

            }).catch(ex => {
                let oldRows = this.state.rows;
                this.setState({
                    rows: oldRows,
                    isLoading: false
                });
            });
        }
    };


    render() {
        return (
            <Fragment>
                <div className="submittalFilter readOnly__disabled">
                    <div className="subFilter pagination">
                        <h3 className="zero">
                            {Resources['document'][currentLanguage]}
                        </h3>
                        <span>
                            <svg
                                width="16px"
                                height="18px"
                                viewBox="0 0 16 18"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink">
                                <g
                                    id="Symbols"
                                    stroke="none"
                                    strokeWidth="1"
                                    fill="none"
                                    fillRule="evenodd">
                                    <g
                                        id="Action-icons/Filters/Hide+text/24px/Grey_Base"
                                        transform="translate(-4.000000, -3.000000)"></g>
                                </g>
                            </svg>
                        </span>
                        <div className="filterBTNS">

                        </div>
                        <div className="rowsPaginations readOnly__disabled">
                            <div className="rowsPagiRange">
                                <span>
                                    {this.state.pageSize *
                                        this.state.pageNumber +
                                        1}
                                </span>{' '}
                                -
        <span>
                                    {this.state.filterMode
                                        ? this.state.totalRows
                                        : this.state.pageSize *
                                        this.state.pageNumber +
                                        this.state.pageSize}
                                </span>
                                {
                                    Resources['jqxGridLanguagePagerrangestring'][
                                        currentLanguage
                                    ]
                                }
                                <span> {this.state.totalRows}</span>
                            </div>
                            <button
                                className={
                                    this.state.pageNumber == 0
                                        ? 'rowunActive'
                                        : ''
                                }
                                onClick={() => this.GetPrevoiusData()}>
                                <i className="angle left icon" />
                            </button>
                            <button
                                className={
                                    this.state.totalRows !==
                                        this.state.pageSize *
                                        this.state.pageNumber +
                                        this.state.pageSize
                                        ? 'rowunActive'
                                        : ''
                                }
                                onClick={() => this.GetNextData()}>
                                <i className="angle right icon" />
                            </button>
                        </div>

                    </div>

                </div>
                <div className="document-fields ">
                    {this.state.isLoading === false ? null : <LoadingSection />}
                    <Formik
                        enableReinitialize={true}
                        initialValues={{ ...this.state.documentObj }}
                        onSubmit={() => { }}
                    >
                        {({handleBlur, handleSubmit }) => (
                            <Form
                                id="resourceForm"
                                className="proForm datepickerContainer"
                                noValidate="novalidate"
                                onSubmit={handleSubmit}>
                                <div className="submittalFilter resources">
                                    <div className="resources__inputs">
                                        <div className="linebylineInput fullInputWidth">
                                            <label className="control-label">{Resources['EnglishName'][currentLanguage]}</label>
                                            <div className="ui input inputDev ">
                                                <input name="docTypeEn" id="docTypeEn" type="text" value={this.state.documentObj.docTypeEn}
                                                    placeholder={Resources['EnglishName'][currentLanguage]} autoComplete="on"
                                                    onBlur={e => { handleBlur(e); }} className="form-control"
                                                    onChange={e => this.handleChange(e.target.value, "docTypeEn")} />
                                            </div>
                                        </div>

                                        <div className="linebylineInput fullInputWidth">
                                            <label className="control-label">{Resources['ArabicName'][currentLanguage]}</label>
                                            <div className="ui input inputDev">
                                                <input name="docTypeAr" type="text" className="form-control" id="docTypeAr"
                                                    placeholder={Resources['ArabicName'][currentLanguage]} autoComplete="on"
                                                    value={this.state.documentObj.docTypeAr} onBlur={handleBlur}
                                                    onChange={e => this.handleChange(e.target.value, "docTypeAr")} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="filterBTNS">
                                        <button className={(this.state.selectedRow != {} && this.state.selectedRow.id > 0) ? 'primaryBtn-1 btn largeBtn' : 'primaryBtn-1 btn largeBtn disabled'}
                                            onClick={() => { this.handleUpdate() }} type="submit">{Resources['update'][currentLanguage]}{' '} </button>


                                        <button className={(this.state.selectedRow == {} || !this.state.selectedRow.id > 0) ? 'primaryBtn-1 btn largeBtn' : 'primaryBtn-1 btn largeBtn disabled'} type="submit"
                                            onClick={e => this.handleAdd(e)}>
                                            {Resources['add'][currentLanguage]} {' '}</button>

                                        <button className={(this.state.documentObj.docTypeEn != "" || this.state.documentObj.docTypeAr !="") ? 'primaryBtn-1 btn largeBtn' : 'primaryBtn-1 btn largeBtn disabled'} type="submit" onClick={e => this.handleSearch(e)}>
                                            {Resources['search'][currentLanguage]} {' '}</button>

                                        <button className={(this.state.documentObj.docTypeEn != "" || this.state.documentObj.docTypeAr !="") ? 'primaryBtn-1 btn largeBtn' : 'primaryBtn-1 btn largeBtn disabled'} type="submit" onClick={e => this.handleReset(e)}>
                                            {Resources['reset'][currentLanguage]} {' '}</button>

                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>

                    {this.state.isLoading == true ? null : <ReactTable
                        data={this.state.rows || []}
                        columns={this.columns}
                        defaultPageSize={50}
                        minRows={20}
                        noDataText={Resources['noData'][currentLanguage]}
                        getTrProps={(state, rowInfo) => {
                            if (rowInfo && rowInfo.row) {
                                return {
                                    onClick: e => { this.setState({ selectedRow: rowInfo.row._original, documentObj: rowInfo.row._original }) }
                                };
                            } else {
                                return {};
                            }
                        }}
                    />}
                </div>
            </Fragment>
        );
    }
}

export default withRouter(DocumentEdit);
