import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import LoadingSection from '../../publicComponants/LoadingSection';
import config from '../../../Services/Config';
import Resources from '../../../resources.json';
import Api from '../../../api';
import { toast } from 'react-toastify';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import ReactTable from 'react-table';

let currentLanguage =
    localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
let CurrProject = localStorage.getItem('lastSelectedprojectName');
class ModulesEdit extends Component {
    constructor(props) {
        super(props);

        if (!config.IsAllow(10140)) {
            toast.warn(Resources['missingPermissions'][currentLanguage]);
            this.props.history.goBack();
        }

        this.columns = [
            {
                Header: Resources['ModuleTitle'][currentLanguage],
                accessor: 'moduleEn',
                width: 550,
            },
            {
                Header: Resources['ArabicName'][currentLanguage],
                accessor: 'moduleAr',
                sortabel: true,
                width: 550,
            },
        ];

        this.state = {
            isLoading: false,
            rows: [],
            moduleObj: {
                id: "",
                moduleEn: "",
                moduleAr: ""
            },
            selectedRow: {},
            pageNumber: 0,
            pageSize: 500,
            filterPageNumber: 0,
            filterPageSize: 500,
            isFilter: false,
            query:{},
            totalRows:0
        };

    }

    componentDidMount = () => {
        this.setState({ isLoading: true });
        Api.get('GetDocModulesByPagination').then(result => {
            this.setState({
                rows: result.data || [],
                totalRows:result.totalRows || 0,
                isLoading: false
            });
        });
    };

    handleChange(e, name) {
        let originalDoc = { ...this.state.moduleObj }
        let newDoc = {};
        newDoc[name] = e;
        Object.assign(originalDoc, newDoc);
        this.setState({ moduleObj: originalDoc });
    }

    handleAdd = () => {
        let serverObj = { ...this.state.moduleObj };
        if (serverObj.moduleEn != "" && serverObj.moduleAr != "") {
            this.setState({ isLoading: true });
            Api.post("AddDocModule", serverObj).then(result => {
                if (result) {
                    toast.success(Resources.operationSuccess[currentLanguage]);
                    let rows = this.state.rows;
                    rows.unshift(result);
                    this.setState({ rows: rows, isLoading: false })
                }
            })
        } else {
            toast.error("Please Fill ModuleTitle and Arabic Name Fields");
        }
    }

    handleUpdate = () => {
        let serverObj = { ...this.state.moduleObj };
        if (serverObj.id > 0 && serverObj.moduleEn != "" && serverObj.moduleAr != "") {
            this.setState({ isLoading: true });
            Api.post("EditDocModule", serverObj).then(result => {
                if (result) {
                    toast.success(Resources.operationSuccess[currentLanguage]);
                    let rows = this.state.rows;
                    let rowIndex = rows.findIndex(x => x.id == result.id);
                    rows[rowIndex].moduleEn = result.moduleEn;
                    rows[rowIndex].moduleAr = result.moduleAr;
                    let emptyObj = { id: "", moduleEn: "", moduleAr: "" }
                    this.setState({
                        rows: rows,
                        moduleObj: emptyObj,
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
            filterPageSize: 50
        })

        let moduleObj = this.state.moduleObj;
        let query = {}
        if (moduleObj.moduleEn != "")
            query["moduleEn"] = moduleObj.moduleEn;
        if (moduleObj.moduleAr != "")
            query["moduleAr"] = moduleObj.moduleAr;

        if (query != {}) {
            this.setState({query:query})
            Api.get(`FilterDocModules?pageNumber=${this.state.filterPageNumber}&pageSize=${this.state.filterPageSize}&query=${JSON.stringify(query)}`).then(result => {
                this.setState({
                    rows: result || [],
                    isLoading: false
                })
            })
        } else {
            Api.get('GetDocModulesByPagination').then(result => {
                this.setState({
                    rows: result.data || [],
                    totalRows:result.totalRows || 0,
                    isLoading: false
                });
            });
        }
    };

    handleReset=()=>{

        this.setState({ 
            isLoading: true,
            rows: [],
            moduleObj: {
                id: "",
                moduleEn: "",
                moduleAr: ""
            },
            selectedRow: {},
            pageNumber: 0,
            pageSize: 50,
            filterPageNumber: 0,
            filterPageSize: 50,
            isFilter: false,
            totalRows:0,
            query:{}
         });
        Api.get('GetDocModulesByPagination').then(result => {
            this.setState({
                rows: result.data || [],
                totalRows:result.totalRows || 0,
                isLoading: false
            });
        });
    }

    GetPrevoiusData() {
        let isfilter=this.state.isFilter;
        let pageName=isfilter !=true?"pageNumber":"filterPageNumber";
        let pageNumber = (isfilter !=true? this.state.pageNumber:this.state.filterPageNumber) - 1;

        if (pageNumber >= 0) {
            this.setState({
                isLoading: true,
                [pageName]: pageNumber,
            });

            let url=isfilter !=true?`GetDocModulesByPagination?pageNumber=${pageNumber}&pageSize=${this.state.pageSize}`
            :`FilterDocModules?pageNumber=${pageNumber}&pageSize=${this.state.pageSize}&query=${this.state.query}`
      
            Api.get(url)
                .then(result => {
                    let oldRows = []; // this.state.rows;

                    const newRows = [...oldRows, ...result.data];


                    this.setState({
                        rows: newRows,
                        totalRows: result.total,
                        isLoading: false,
                    });
                })
                .catch(ex => {
                    let oldRows = this.state.rows;
                    this.setState({
                        rows: oldRows,
                        isLoading: false,
                    });
                });
        }
    }

    GetNextData() {

        let isfilter=this.state.isFilter;
        let pageName=isfilter !=true?"pageNumber":"filterPageNumber";
        let pageNumber = (isfilter !=true? this.state.pageNumber:this.state.filterPageNumber) + 1;

        let maxRows = this.state.totalRows;

        if (this.state.pageSize * this.state[pageName] <= maxRows) {
            this.setState({
                isLoading: true,
                [pageName]: pageNumber,
            });

            let url=isfilter !=true?`GetDocModulesByPagination?pageNumber=${pageNumber}&pageSize=${this.state.pageSize}`
            :`FilterDocModules?pageNumber=${pageNumber}&pageSize=${this.state.pageSize}&query=${this.state.query}`

            Api.get(url)
                .then(result => {
                    let oldRows = [];

                    const newRows = [...oldRows, ...result.data];

                    this.setState({
                        rows: newRows,
                        totalRows: result.total,
                        isLoading: false,
                    });
                })
                .catch(ex => {
                    let oldRows = this.state.rows;
                    this.setState({
                        rows: oldRows,
                        isLoading: false,
                    });
                });
        }
    }

    render() {
        return (
            <Fragment>
                <div className="submittalFilter readOnly__disabled">
                    <div className="subFilter">
                        <h3 className="zero">
                            {CurrProject +
                                ' - ' +
                                Resources['Modules'][currentLanguage]}
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
                        {/* <div className="filterBTNS">
                         
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
                                    Resources['jqxGridLanguage'][
                                        currentLanguage
                                    ].localizationobj.pagerrangestring
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
                */}
                    </div>

                </div>
                <div className="document-fields ">
                    {this.state.isLoading === false ? null : <LoadingSection />}
                    <Formik
                        enableReinitialize={true}
                        initialValues={{ ...this.state.moduleObj }}
                        //validationSchema={this.validationSchema || ''}
                        onSubmit={() => { }}
                    >
                        {({ values, errors, handleBlur, handleSubmit }) => (
                            <Form
                                id="resourceForm"
                                className="proForm datepickerContainer"
                                noValidate="novalidate"
                                onSubmit={handleSubmit}>
                                <div className="submittalFilter resources">
                                    <div className="resources__inputs">
                                        <div className="linebylineInput fullInputWidth">
                                            <label className="control-label">{Resources['ModuleTitle'][currentLanguage]}</label>
                                            <div className="ui input inputDev ">
                                                <input name="moduleEn" id="moduleEn" type="text" value={this.state.moduleObj.moduleEn}
                                                    placeholder={Resources['ModuleTitle'][currentLanguage]} autoComplete="on"
                                                    onBlur={e => { handleBlur(e); }} className="form-control"
                                                    onChange={e => this.handleChange(e.target.value, "moduleEn")} />
                                            </div>
                                        </div>

                                        <div className="linebylineInput fullInputWidth">
                                            <label className="control-label">{Resources['ArabicName'][currentLanguage]}</label>
                                            <div className="ui input inputDev">
                                                <input name="moduleAr" type="text" className="form-control" id="moduleAr"
                                                    placeholder={Resources['ArabicName'][currentLanguage]} autoComplete="on"
                                                    value={this.state.moduleObj.moduleAr} onBlur={handleBlur}
                                                    onChange={e => this.handleChange(e.target.value, "moduleAr")} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="filterBTNS">
                                        <button className={(this.state.selectedRow != {} && this.state.selectedRow.id > 0) ? 'primaryBtn-1 btn largeBtn' : 'primaryBtn-1 btn largeBtn disabled'}
                                            onClick={() => { this.handleUpdate() }} type="submit">{Resources['update'][currentLanguage]}{' '} </button>


                                        <button className={(this.state.selectedRow == {} || !this.state.selectedRow.id > 0) ? 'primaryBtn-1 btn largeBtn' : 'primaryBtn-1 btn largeBtn disabled'} type="submit"
                                            onClick={e => this.handleAdd(e)}>
                                            {Resources['add'][currentLanguage]} {' '}</button>

                                        <button className="primaryBtn-1 btn largeBtn " type="submit" onClick={e => this.handleSearch(e)}>
                                            {Resources['search'][currentLanguage]} {' '}</button>

                                        <button className="primaryBtn-1 btn largeBtn " type="submit" onClick={e => this.handleReset(e)}>
                                            {Resources['reset'][currentLanguage]} {' '}</button>

                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>

                    {this.state.isLoading ==true?null:<ReactTable
                        data={this.state.rows || []}
                        columns={this.columns}
                        defaultPageSize={50}
                        minRows={10}
                        noDataText={Resources['noData'][currentLanguage]}
                        getTrProps={(state, rowInfo) => {
                            if (rowInfo && rowInfo.row) {
                                return {
                                    onClick: e => { this.setState({ selectedRow: rowInfo.row._original, moduleObj: rowInfo.row._original }) }
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

export default withRouter(ModulesEdit);
