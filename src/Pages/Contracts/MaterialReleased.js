import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import Resources from "../../resources.json";
import ReactTable from "react-table";
import dataservice from "../../Dataservice";
import Config from "../../Services/Config.js";
import Export from "../../Componants/OptionsPanels/Export";
import GridCustom from "../../Componants/Templates/Grid/CustomGrid";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import Api from '../../api';
import config from "../../Services/Config";
import { Formik, Form } from "formik";



let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

let selectedRows = [];

class MaterialReleased extends Component {
    constructor(props) {
        super(props)
        this.columnsGrid = [
            {
                field: "id",
                title: Resources["select"][currentLanguage],
                groupable: true,
                fixed: true,
                width: 16,
                sortable: true,
                type: "text"
            },
            {
                field: "arrange",
                title: Resources["arrange"][currentLanguage],
                groupable: true,
                width: 16,
                sortable: true,
                type: "text"
            }, {
                field: "description",
                title: Resources["description"][currentLanguage],
                groupable: true,
                width: 16,
                sortable: true,
                type: "text"
            },
            {
                field: "quantity",
                title: Resources["quantity"][currentLanguage],
                groupable: true,
                width: 16,
                sortable: true,
                type: "text"
            },
            {
                field: "unitPrice",
                title: Resources["unitPrice"][currentLanguage],
                groupable: true,
                width: 16,
                sortable: true,
                type: "number"
            },
            {
                field: "resourceCode",
                title: Resources["resourceCode"][currentLanguage],
                groupable: true,
                width: 16,
                sortable: true,
                type: "number"
            },
            {
                field: "materialReleaseName",
                title: Resources["materialReleasedsubject"][currentLanguage],
                groupable: true,
                width: 16,
                sortable: true,
                type: "text"
            },
            {
                field: "materialReleaseArrange",
                title: Resources["materialReleasedarrange"][currentLanguage],
                groupable: true,
                width: 16,
                sortable: true,
                type: "text"
            },
            {
                field: "materialReleaseDate",
                title: Resources["materialReleasedDate"][currentLanguage],
                groupable: true,
                width: 16,
                sortable: true,
                type: "date"
            },
            {
                field: "areaName",
                title: Resources["area"][currentLanguage],
                groupable: true,
                width: 16,
                sortable: true,
                type: "text"
            },
            {
                field: "locationName",
                title: Resources["location"][currentLanguage],
                groupable: true,
                width: 16,
                sortable: true,
                type: "text"

            },
            {
                field: "remarks",
                title: Resources["remarks"][currentLanguage],
                groupable: true,
                width: 16,
                sortable: true,
                type: "number"
            },
            {
                field: "total",
                title: Resources["total"][currentLanguage],
                groupable: true,
                width: 16,
                sortable: true,
                type: "number"
            },
            {
                field: "materialType",
                title: Resources["materialType"][currentLanguage],
                groupable: true,
                width: 16,
                sortable: true,
                type: "text"
            },
        ]

        this.groups = [];

        this.actions = [
            {
                title: 'Delete',
                handleClick: selectedRows => {
                    this.setState({
                        showDeleteModal: true,
                        selectedRow: selectedRows
                    });
                },
                classes: '',
            }
        ];

        this.rowActions = [];

        this.state = {
            Items: [],
            contractId: this.props.contractId,
            selected: {},
            columns: this.columnsGrid,
            isLoading: true,
            gridLoading: true,
            rows: this.props.items,
            selectedRows: [],
            totalRows: this.props.totalRows,
            pageSize: 50,
            pageNumber: 0,
            filterMode: false,
            api: 'GetMaterialReleaseTicketsByContractId?',
            pageTitle: Resources['contractsItems'][currentLanguage],
            totalvalues: this.props.totalVals,
            totalRturnedvalues: this.props.totalRturnedvals
        }
    }
    GetNextData = () => {
        let pageNumber = this.state.pageNumber + 1;

        let maxRows = this.state.totalRows;

        if (this.state.pageSize * this.state.pageNumber <= maxRows) {
            this.setState({
                isLoading: true,
                gridLoading: true,
                pageNumber: pageNumber
            });
        }

        let url = this.state.api + "contractId=" + this.state.contractId + "&pageNumber=" + pageNumber + "&pageSize=" + this.state.pageSize
        Api.get(url).then(result => {
            let oldRows = result; //this.state.rows;
            const newRows = oldRows; //[...oldRows, ...result]; // arr3 ==> [1,2,3,3,4,5]
            if (result) {
                this.state.totalRows = this.state.totalRows + result.length;

            }
            const totalList = result.map(item => {
                if (item.materialType == "Released")
                    return item.total;
                else {
                    return 0;
                }
            });

            const totalRteurnedList = result.map(item => {
                if (item.materialType == "Returned")
                    return item.total;
                else {
                    return 0;
                }
            });

            const totalvalues = totalList.reduce(
                (previousTotal, currentTotal, index) => previousTotal + currentTotal,
                0);

            const totalRturnedvalues = totalRteurnedList.reduce(
                (previousTotal, currentTotal, index) => previousTotal + currentTotal,
                0);
            this.setState({
                rows: newRows,
                totalvalues: totalvalues,
                totalRturnedvalues: totalRturnedvalues,
                isLoading: false,
                gridLoading: false,

            });
        }).catch(ex => {
            let oldRows = this.state.rows;
            this.setState({
                rows: oldRows,
                isLoading: false,
                gridLoading: false
            });
        });
    };

    GetPreviousData = () => {
        let pageNumber = this.state.pageNumber - 1;

        if (pageNumber >= 0) {

            this.setState({
                isLoading: true,
                gridLoading: true,
                pageNumber: pageNumber
            });
        }
        let url = this.state.api + "contractId=" + this.state.contractId + "&pageNumber=" + pageNumber + "&pageSize=" + this.state.pageSize
        Api.get(url).then(result => {
            let oldRows = result; //[];// this.state.rows;
            const newRows = oldRows;//[...oldRows, ...result];
            const totalList = result.map(item => {
                if (item.materialType == "Released")
                    return item.total;
                else {
                    return 0;
                }
            });

            const totalRteurnedList = result.map(item => {
                if (item.materialType == "Returned")
                    return item.total;
                else {
                    return 0;
                }
            });

            const totalvalues = totalList.reduce(
                (previousTotal, currentTotal, index) => previousTotal + currentTotal,
                0);

            const totalRturnedvalues = totalRteurnedList.reduce(
                (previousTotal, currentTotal, index) => previousTotal + currentTotal,
                0);

            this.setState({
                rows: newRows,
                totalRows: result.length,
                totalvalues: totalvalues,
                totalRturnedvalues: totalRturnedvalues,
                isLoading: false,
                gridLoading: false,

            });
        }).catch(ex => {
            let oldRows = this.state.rows;
            this.setState({
                rows: oldRows,
                isLoading: false,
                gridLoading: false
            });
        });
    };

    toggleRow(obj) {

        const newSelected = Object.assign({}, this.state.selected);

        newSelected[obj.id] = !this.state.selected[obj.id];

        let setIndex = selectedRows.findIndex(x => x === obj.id);

        if (setIndex > -1) {
            selectedRows.splice(setIndex, 1);
        } else {
            selectedRows.push(obj);
        }

        this.setState({
            selected: newSelected
        });
    }
    componentDidMount = () => {

        if (config.IsAllow(1181)) {
            this.setState({ showCheckbox: true, isLoading: false })

        }
    }
    formSubmitHandler = (e) => {
        e.preventDefault();
    }
    componentDidUpdate(prevProps) {

        if (this.props.items !== prevProps.items) {
            this.setState({
                rows: this.props.items,
                totalvalues: this.props.totalVals,
                totalRturnedvalues: this.props.totalRturnedvals,
                gridLoading: false,
                totalRows: this.props.totalRows,
            });
        }

    }
    render() {
        let columnsItem = [
            {
                Header: Resources["select"][currentLanguage],
                id: "checkbox",
                accessor: "id",
                Cell: ({ row }) => {
                    return (
                        <div className="ui checked checkbox  checkBoxGray300 ">
                            <input type="checkbox" className="checkbox" checked={this.state.selected[row._original.id] === true} onChange={() => this.toggleRow(row._original)} />
                            <label />
                        </div>
                    );
                },
                width: 70
            },
            {
                Header: Resources['arrange'][currentLanguage],
                accessor: 'arrange',
                width: 50,
            }, {
                Header: Resources['description'][currentLanguage],
                accessor: 'description',
                width: 250,
            },
            {
                Header: Resources['quantity'][currentLanguage],
                accessor: 'quantity',
                width: 100,
            },
            {
                Header: Resources['unitPrice'][currentLanguage],
                accessor: 'unitPrice',
                width: 100,
            },
            {
                Header: Resources['resourceCode'][currentLanguage],
                accessor: 'resourceCode',
                width: 180,
            },
            {
                Header: Resources['materialReleasedsubject'][currentLanguage],
                accessor: 'materialReleaseName',
                width: 150,
            },
            {
                Header: Resources['materialReleasedarrange'][currentLanguage],
                accessor: 'materialReleaseArrange',
                width: 150,
            },
            {
                Header: Resources['materialReleasedDate'][currentLanguage],
                accessor: 'materialReleaseDate',
                width: 150,
            },
            {
                Header: Resources['area'][currentLanguage],
                accessor: 'areaName',
                width: 150,
            },
            {
                Header: Resources['location'][currentLanguage],
                accessor: 'locationName',
                width: 150,
            },
            {
                Header: Resources['remarks'][currentLanguage],
                accessor: 'remarks',
                width: 150,
            },

            {
                Header: Resources['total'][currentLanguage],
                accessor: 'total',
                width: 150,
            }
        ]
        let ExportColumns = [
            { field: 'arrange', title: Resources['arrange'][currentLanguage], },
            { field: 'description', title: Resources['description'][currentLanguage] },

            { field: 'quantity', title: Resources['quantity'][currentLanguage] },
            { field: 'deductionValue', title: Resources['deductions'][currentLanguage] },

            { field: 'unitPrice', title: Resources['unitPrice'][currentLanguage] },
            { field: 'resourceCode', title: Resources['resourceCode'][currentLanguage] },

            { field: 'materialReleaseName', title: Resources['materialReleasedsubject'][currentLanguage] },
            { field: 'materialReleaseArrange', title: Resources['materialReleasedarrange'][currentLanguage] },

            { field: 'materialReleaseDate', title: Resources['materialReleasedDate'][currentLanguage] },
            { field: 'areaName', title: Resources['area'][currentLanguage] },

            { field: 'locationName', title: Resources['location'][currentLanguage] },
            { field: 'remarks', title: Resources['remarks'][currentLanguage] },

            { field: 'title', title: Resources['title'][currentLanguage] },
            { field: 'total', title: Resources['total'][currentLanguage] },
        ]
        const btnExport = this.state.gridLoading === false ? <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={ExportColumns} fileName={this.state.pageTitle} /> : null;

        const dataGrid =
            this.state.gridLoading === false ? (

                <GridCustom
                    gridKey="items"
                    data={this.state.rows}
                    pageSize={this.state.pageSize}
                    groups={[]}
                    actions={this.actions}
                    cells={this.columnsGrid}
                    rowActions={this.rowActions}
                    rowClick={cell => this.props.rowClick(cell)}
                    showPicker={false}
                    rowClick={this.formSubmitHandler}
                />
            ) : <LoadingSection />
        return (
            <Fragment >
                <div className="submittalFilter readOnly__disabled">
                    <div className="subFilter">
                        <h3 className="zero"> {Resources['contractsItems'][currentLanguage]}</h3>
                        <span>
                            <svg width="16px" height="18px" viewBox="0 0 16 18" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" >
                                <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" >
                                    <g id="Action-icons/Filters/Hide+text/24px/Grey_Base"
                                        transform="translate(-4.000000, -3.000000)" >
                                    </g>
                                </g>
                            </svg>
                        </span>
                    </div>
                    <div className="filterBTNS">
                        {btnExport}

                    </div>
                    <div className="rowsPaginations readOnly__disabled">
                        <div className="rowsPagiRange">
                            <span>{(this.state.pageSize * this.state.pageNumber) + 1}
                                {/* </span> - <span>{(this.state.pageSize * this.state.pageNumber) + this.state.pageSize}</span> of */}
                            </span> - <span>{this.state.totalRows}</span> of
                            <span>{this.state.totalRows}</span>
                        </div>
                        <button className={this.state.pageNumber <= 0 ? "rowunActive" : ""} onClick={this.GetPreviousData}>
                            <i className="angle left icon" />
                        </button>
                        <button onClick={this.GetNextData}>
                            <i className="angle right icon" />
                        </button>
                    </div>

                </div>
                {this.state.gridLoading === false ? (

                    <div className="document-fields">

                        <Form id="signupForm1" className="proForm datepickerContainer customProform" noValidate="novalidate">
                            <div className="proForm datepickerContainer">

                                <div className="linebylineInput valid-input" >
                                    <label className="control-label">{Resources.totalRelease[currentLanguage]}</label>
                                    <div className="ui input inputDev" >
                                        <input name='total' className="form-control fsadfsadsa" id="total"

                                            autoComplete='off'
                                            value={this.state.totalvalues}
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <div className="linebylineInput valid-input" >
                                    <label className="control-label">{Resources.totalRturned[currentLanguage]}</label>
                                    <div className="ui input inputDev" >
                                        <input name='total' className="form-control fsadfsadsa" id="total"

                                            autoComplete='off'
                                            value={this.state.totalRturnedvalues}
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>
                        </Form>
                        <div className="grid-container">
                            {dataGrid}
                        </div>
                    </div>
                ) : <LoadingSection />}

            </Fragment>
        )


    }
}
export default withRouter(MaterialReleased)

