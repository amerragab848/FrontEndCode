import React, { Component, Fragment } from 'react'
import Api from '../../api';
import Resources from '../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../Componants/publicComponants/LoadingSection';
import Filter from '../../Componants/FilterComponent/filterComponent'
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import GridSetup from "../Communication/GridSetup"
import { SkyLightStateless } from 'react-skylight';
// import config from "../../Services/Config";
// import CryptoJS from 'crypto-js';
import { withRouter } from "react-router-dom";
import Export from '../../Componants/OptionsPanels/Export';
import dataservice from "../../Dataservice";
import * as communicationActions from '../../store/actions/communication';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from "moment";
import DatePicker from '../../Componants/OptionsPanels/DatePicker'
let docId = 0;
const _ = require('lodash')

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
const dateFormate = ({ value }) => {
    return value ? moment(value).format("DD/MM/YYYY") : "No Date";
};
let cashFlowTable2 = []

class budgetCashFlow extends Component {

    constructor(props) {
        super(props)

        const columnsGrid = [
            {
                key: "projectName",
                name: Resources.projectName[currentLanguage],
                width: 400,
                frozen: true,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "date",
                name: Resources.docDate[currentLanguage],
                width: 200,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate
            },
            {
                key: "cashIn",
                name: Resources.estimatedCashIn[currentLanguage],
                width: 400,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "cashOut",
                name: Resources.estimatedCashOut[currentLanguage],
                width: 400,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
        ];

        const filtersColumns = [
            {
                field: "projectName",
                name: "projectName",
                type: "string",
                isCustom: true
            },
            {
                field: "date",
                name: "date",
                type: "date",
                isCustom: true
            },
            {
                field: "cashIn",
                name: "estimatedCashIn",
                type: "string",
                isCustom: true
            },
            {
                field: "cashOut",
                name: "estimatedCashOut",
                type: "string",
                isCustom: true
            },

        ];

        this.state = {
            isLoading: true,
            rows: [],
            columns: columnsGrid.filter(column => column.visible !== false),
            selectedRows: [],
            filtersColumns: filtersColumns,
            viewfilter: false,
            totalRows: 0,
            pageSize: 50,
            pageNumber: 0,
            projectId: this.props.projectId,
            docId: docId,
            pageTitle: Resources['cashFlow'][currentLanguage],
            // api: 'GetAllBudgetCashFlowForGrid?',
            IsActiveShow: false,
            rowSelectedId: '',
            showPopup: false,
            showDeleteModal: false,
            NewPassword: '',
            showResetPasswordModal: false,
            showCheckbox: true,
            startDate: moment(),
            finishDate: moment(),
            showTable: false,
            cashFlowTable: [],
        }
    }

    componentWillMount() { 
        this.props.actions.FillGridLeftMenu(); 
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.projectId !== this.props.projectId) {
            this.setState({
                isLoading: true
            })
            dataservice.GetDataGrid('GetAllBudgetCashFlowForGrid?projectId=' + nextProps.projectId).then(data => {
                this.setState({
                    rows: data,
                    projectId: nextProps.projectId,
                    isLoading: false,
                    totalRows: data.length,
                })
            })
        }
    }

    GetNextData() {
        let pageNumber = this.state.pageNumber + 1;

        this.setState({
            isLoading: true,
            pageNumber: pageNumber
        });
        let url = 'GetAllBudgetCashFlowForGrid?projectId=' + this.state.projectId + "&pageNumber=" + pageNumber + "&pageSize=" + this.state.pageSize
        Api.get(url).then(result => {
            let oldRows = this.state.rows;
            const newRows = [...oldRows, ...result];
            this.setState({
                rows: newRows,
                totalRows: newRows.length,
                isLoading: false
            });
        }).catch(ex => {
            let oldRows = this.state.rows;
            this.setState({
                rows: oldRows,
                isLoading: false
            });
        });;
    }

    GetPrevoiusData() {
        let pageNumber = this.state.pageNumber - 1;
        this.setState({
            isLoading: true,
            pageNumber: pageNumber
        });
        let url = 'GetAllBudgetCashFlowForGrid?projectId=' + this.state.projectId + "&pageNumber=" + this.state.pageNumber + "&pageSize=" + this.state.pageSize
        Api.get(url).then(result => {
            let oldRows = [];// this.state.rows;
            const newRows = [...oldRows, ...result];

            this.setState({
                rows: newRows,
                totalRows: newRows.length,
                isLoading: false
            });
        }).catch(ex => {
            let oldRows = this.state.rows;
            this.setState({
                rows: oldRows,
                isLoading: false
            });
        });;
    }

    onCloseModal() {
        this.setState({
            showDeleteModal: false, showResetPasswordModal: false
        });
    }

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false, showResetPasswordModal: false });
    }

    showPopupAdd = () => {
        this.setState({
            showPopup: true
        })
    }

    ConfirmDeleteAccount = () => {
        let id = '';
        this.setState({ showDeleteModal: true })
        let rowsData = this.state.rows;
        this.state.rowSelectedId.map(i => {
            id = i
        })
        let userName = _.find(rowsData, { 'id': id })
        console.log(userName.userName)
        Api.authorizationApi('ProcoorAuthorization?username=' + userName.userName, null, 'DElETE').then(
            Api.post('accountDeleteById?id=' + id)
                .then(result => {
                    let originalRows = this.state.rows;
                    this.state.rowSelectedId.map(i => {
                        originalRows = originalRows.filter(r => r.id !== i);
                    });
                    this.setState({
                        rows: originalRows,
                        totalRows: originalRows.length,
                        isLoading: false,
                        showDeleteModal: false,
                        IsActiveShow: false
                    });
                })
                .catch(ex => {
                    this.setState({
                        showDeleteModal: false,
                        IsActiveShow: false
                    })
                })
        ).catch(ex => { })
        this.setState({
            isLoading: true,
        })
    }

    filterMethodMain = (event, query, apiFilter) => {
        var stringifiedQuery = JSON.stringify(query);
        this.setState({
            isLoading: true,
            query: stringifiedQuery
        });
        if (stringifiedQuery !== '{"isCustom":true}') {
            this.setState({ isLoading: true, search: true })
            let _query = stringifiedQuery.split(',"isCustom"')
            let url = "ProjectCashFlowFilter?projectId=" + this.state.projectId + "&pageNumber=" + this.state.pageNumber + "&pageSize=" + this.state.pageSize + '&query=' + _query[0] + '}'
            Api.get(url).then(result => {
                if (result) {
                    this.setState({
                        rows: result,
                        isLoading: false,
                        pageNumber: 1,
                        totalRows: result.length
                    });
                } else {
                    this.setState({
                        isLoading: false,
                    });
                }
            })
        }
        else {
            this.setState({ isLoading: true })
            let pageNumber = this.state.pageNumber + 1
            Api.get('GetAllBudgetCashFlowForGrid?projectId=' + this.state.projectId + "&pageNumber=" + this.state.pageNumber + "&pageSize=" + this.state.pageSize).then(result => {
                if (result) {
                    this.setState({
                        rows: result,
                        isLoading: false,
                        pageNumber: pageNumber,
                        totalRows: result.length,
                        search: false
                    });
                } else {
                    this.setState({
                        isLoading: false,
                    });
                }
            });
        }

    };

    DeleteItem = (selectedRows) => {

        this.setState({
            showDeleteModal: true,
            selectedRows
        })
    }

    hideFilter(value) {
        this.setState({ viewfilter: !this.state.viewfilter });
        return this.state.viewfilter;
    }

    startDatehandleChange = (date) => {
        this.setState({ startDate: date });
    }

    finishDatehandleChange = (date) => {
        this.setState({ finishDate: date });
    }

    cashFlowDiff = (obj, e) => {

        var finishDate1 = moment(this.state.finishDate, ["MM-DD-YYYY", "YYYY-MM-DD"]).format('YYYY-MM-DD')
        var startDate1 = moment(this.state.startDate, ["MM-DD-YYYY", "YYYY-MM-DD"]).format('YYYY-MM-DD')
        var end = finishDate1;

        var start = startDate1;

        var noOfMonths = moment(end).diff(start, 'month', true);

        var months = noOfMonths + 1 | 0;

        for (var i = 0; i < months; i++) {

            var get = moment(start).get('month');

            var set = moment(start).set('month', get + i);

            let monthData = {
                date: moment(set).format('YYYY-MM-DD'),
                cashIn: 0,
                cashOut: 0,
            }

            cashFlowTable2.push(monthData)
        }
        this.setState({
            cashFlowTable: cashFlowTable2
        })
        cashFlowTable2 = []
    }

    cashFlowAdd = () => {
        this.setState({
            isLoading: true,
            showPopup: false
        })
        let cashAdd = this.state.cashFlowTable
        dataservice.addObject('AddCashFlow?projectId=' + this.props.projectId + '', cashAdd).then(result => {
            this.setState({
                rows: result,
                totalRows: result.length,
                isLoading: false,
            })
            toast.success(Resources["operationSuccess"][currentLanguage]);
        }).catch(ex => {
            toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
        })
    }

    generateDateFun = () => {
        this.setState({ showTable: true });
        this.cashFlowDiff()
    }

    handleChange(e, field, index) {
        let or_Data = []
        or_Data = this.state.cashFlowTable
        if (field === 'cashIn') {
            or_Data[index].cashIn = parseInt(e.target.value)
        }
        else if (field === 'cashOut') {
            or_Data[index].cashOut = parseInt(e.target.value)
        }
        this.setState({
            cashFlowTable: or_Data
        })
    }

    render() {

        const dataGrid =
            this.state.isLoading === false ? (
                <GridSetup rows={this.state.rows} columns={this.state.columns}
                    showCheckbox={this.state.showCheckbox}
                    clickHandlerDeleteRows={this.DeleteItem}
                    single={false}
                />
            ) : <LoadingSection />
        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.columns} fileName={'workFlowActivity'} />
            : null;

        const ComponantFilter = this.state.isLoading === false ?
            <Filter
                filtersColumns={this.state.filtersColumns}
                filterMethod={this.filterMethodMain}
            /> : null;
        return (

            <div className='mainContainer'>
                <div>
                    <div className="submittalFilter">

                        <div className="subFilter">
                            <h3 className="zero">{this.state.pageTitle}</h3>
                            <span>{this.state.totalRows}</span>
                            <div
                                className="ui labeled icon top right pointing dropdown fillter-button"
                                tabIndex="0"
                                onClick={() => this.hideFilter(this.state.viewfilter)}>
                                <span>
                                    <svg width="16px" height="18px" viewBox="0 0 16 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" >
                                        <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"  >
                                            <g id="Action-icons/Filters/Hide+text/24px/Grey_Base" transform="translate(-4.000000, -3.000000)"  >
                                                <g id="Group-4">
                                                    <g id="Group-7">
                                                        <g id="filter">
                                                            <rect id="bg" fill="#80CBC4" opacity="0" x="0" y="0" width="24" height="24" />
                                                            <path d="M15.5116598,15.1012559 C14.1738351,15.1012559 13.0012477,14.2345362 12.586259,12.9819466 L4.97668038,12.9819466 C4.43781225,12.9819466 4,12.5415758 4,12 C4,11.4584242 4.43781225,11.0180534 4.97668038,11.0180534 L12.586259,11.0180534 C13.0012477,9.76546385 14.1738351,8.89874411 15.5116598,8.89874411 C16.8494845,8.89874411 18.0220719,9.76546385 18.4370606,11.0180534 L19.0233196,11.0180534 C19.5621878,11.0180534 20,11.4584242 20,12 C20,12.5415758 19.5621878,12.9819466 19.0233196,12.9819466 L18.4370606,12.9819466 C18.0220719,14.2345362 16.8494845,15.1012559 15.5116598,15.1012559 Z M15.5116598,10.8626374 C14.8886602,10.8626374 14.3813443,11.372918 14.3813443,12 C14.3813443,12.627082 14.8886602,13.1373626 15.5116598,13.1373626 C16.1346594,13.1373626 16.6419753,12.627082 16.6419753,12 C16.6419753,11.372918 16.1346594,10.8626374 15.5116598,10.8626374 Z M7.78600823,9.20251177 C6.44547873,9.20251177 5.27202225,8.33246659 4.8586039,7.07576209 C4.37264206,7.01672011 4,6.60191943 4,6.10125589 C4,5.60059914 4.37263163,5.1858019 4.85858244,5.12675203 C5.27168513,3.86979791 6.44573643,3 7.78600823,3 C9.1238329,3 10.2964204,3.86671974 10.711409,5.11930926 L19.0233196,5.11930926 C19.5621878,5.11930926 20,5.5596801 20,6.10125589 C20,6.64283167 19.5621878,7.08320251 19.0233196,7.08320251 L10.711409,7.08320251 C10.2964204,8.33579204 9.1238329,9.20251177 7.78600823,9.20251177 Z M7.78600823,4.96389325 C7.1630086,4.96389325 6.65569273,5.4741739 6.65569273,6.10125589 C6.65569273,6.72833787 7.1630086,7.23861852 7.78600823,7.23861852 C8.40900786,7.23861852 8.91632373,6.72833787 8.91632373,6.10125589 C8.91632373,5.4741739 8.40900786,4.96389325 7.78600823,4.96389325 Z M13.1695709,18.8806907 C12.7545822,20.1332803 11.5819948,21 10.2441701,21 C8.90634542,21 7.73375797,20.1332803 7.3187693,18.8806907 L4.97668038,18.8806907 C4.43781225,18.8806907 4,18.4403199 4,17.8987441 C4,17.3571683 4.43781225,16.9167975 4.97668038,16.9167975 L7.3187693,16.9167975 C7.73375797,15.664208 8.90634542,14.7974882 10.2441701,14.7974882 C11.5819948,14.7974882 12.7545822,15.664208 13.1695709,16.9167975 L19.0233196,16.9167975 C19.5621878,16.9167975 20,17.3571683 20,17.8987441 C20,18.4403199 19.5621878,18.8806907 19.0233196,18.8806907 L13.1695709,18.8806907 Z M10.2441701,16.7613815 C9.62117047,16.7613815 9.1138546,17.2716621 9.1138546,17.8987441 C9.1138546,18.5258261 9.62117047,19.0361068 10.2441701,19.0361068 C10.8671697,19.0361068 11.3744856,18.5258261 11.3744856,17.8987441 C11.3744856,17.2716621 10.8671697,16.7613815 10.2441701,16.7613815 Z"
                                                                id="Shape"
                                                                fill="#a8b0bf"
                                                                fillRule="nonzero"
                                                            />
                                                        </g>
                                                    </g>
                                                </g>
                                            </g>
                                        </g>
                                    </svg>
                                </span>

                                {this.state.viewfilter === false
                                    ? (
                                        <span className="text active">
                                            <span className="show-fillter">Show Fillter</span>
                                            <span className="hide-fillter">Hide Fillter</span>
                                        </span>
                                    ) : (
                                        <span className="text">
                                            <span className="show-fillter">Show Fillter</span>
                                            <span className="hide-fillter">Hide Fillter</span>
                                        </span>
                                    )}
                            </div>
                        </div>

                        <div className="filterBTNS">
                            {this.state.IsActiveShow ?
                                <button className="primaryBtn-1 btn mediumBtn activeBtnCheck" onClick={this.IsActiveFun}><i className="fa fa-user"></i></button> : null}
                            {btnExport}
                            <button className="primaryBtn-1 btn mediumBtn" onClick={this.showPopupAdd.bind(this)}>NEW</button>
                        </div>

                        <div className="rowsPaginations">
                            <div className="rowsPagiRange">
                                <span>0</span> - <span>{this.state.pageSize}</span> of <span> {this.state.totalRows}</span>
                            </div>

                            <button className={this.state.pageNumber === 0 ? "rowunActive" : ""} onClick={() => this.GetPrevoiusData()}>
                                <i className="angle left icon" />
                            </button>
                            <button onClick={() => this.GetNextData()}>
                                <i className="angle right icon" />
                            </button>

                        </div>

                    </div>

                    <div className="filterHidden"
                        style={{ maxHeight: this.state.viewfilter ? "" : "0px", overflow: this.state.viewfilter ? "" : "hidden" }}>
                        <div className="gridfillter-container">
                            {ComponantFilter}
                        </div>
                    </div>

                    <div className="grid-container">
                        {dataGrid}
                    </div>

                    {this.state.showDeleteModal == true ? (
                        <ConfirmationModal
                            title={Resources['smartDeleteMessage'][currentLanguage].content}
                            closed={this.onCloseModal}
                            showDeleteModal={this.state.showDeleteModal}
                            clickHandlerCancel={this.clickHandlerCancelMain}
                            buttonName='delete' clickHandlerContinue={this.ConfirmDeleteAccount}
                        />
                    ) : null}


                    <SkyLightStateless onOverlayClicked={() => this.setState({ showPopup: false })}
                        title={Resources['cashFlow'][currentLanguage]}
                        onCloseClicked={() => this.setState({ showPopup: false })} isVisible={this.state.showPopup}>

                        <div className="dropWrapper">
                            <div className="proForm customProform">
                                <div className="fillter-status fillter-item-c alternativeDate">
                                    <DatePicker title='startDate'
                                        startDate={this.state.startDate}
                                        handleChange={this.startDatehandleChange} />
                                </div>

                                <div className="fillter-status fillter-item-c alternativeDate">
                                    <DatePicker title='finishDate'
                                        startDate={this.state.finishDate}
                                        handleChange={this.finishDatehandleChange} />
                                </div>

                                <div className="fullWidthWrapper">
                                    <button className="primaryBtn-1 btn mediumBtn" onClick={this.generateDateFun.bind(this)}>{Resources.generate[currentLanguage]}</button>
                                </div>

                                <div className="letterFullWidth">
                                    <table className="attachmentTable">
                                        <thead>
                                            <tr>
                                                <th>
                                                    <div className="headCell tableCell-1" style={{ maxWidth: '250px' }}>
                                                        <span>{Resources.docDate[currentLanguage]}</span>
                                                    </div>
                                                </th>
                                                <th>
                                                    <div className="headCell tableCell-2" style={{ maxWidth: '250px' }}>
                                                        <span>{Resources.estimatedCashIn[currentLanguage]}</span>
                                                    </div>
                                                </th>
                                                <th>
                                                    <div className="headCell tableCell-3" style={{ maxWidth: '250px' }}>
                                                        <span>{Resources.estimatedCashOut[currentLanguage]}</span>
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.showTable === true ?
                                                <Fragment>
                                                    {
                                                        this.state.cashFlowTable.map((i, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>
                                                                        <div className="contentCell tableCell-3">
                                                                            <p className="pdfPopup various zero">{i.date}</p>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div className="contentCell tableCell-3">
                                                                            <div className="form-group">
                                                                                <div className="ui left labeled input">
                                                                                    <input
                                                                                        type="number"
                                                                                        defaultValue={i.cashIn}
                                                                                        onChange={(e) => this.handleChange(e, 'cashIn', index)}
                                                                                        onBlur={e => { this.handleChange(e, 'cashIn', index) }}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div className="contentCell tableCell-4">
                                                                            <div className="form-group">
                                                                                <div className="ui left labeled input">
                                                                                    <input autoComplete="off"
                                                                                        type="number"
                                                                                        placeholder="Enter CashIn.."
                                                                                        defaultValue={i.cashOut}
                                                                                        onChange={(e) => this.handleChange(e, 'cashOut', index)}
                                                                                        onBlur={e => { this.handleChange(e, 'cashOut', index) }}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </Fragment>
                                                : null}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="fullWidthWrapper">
                                    <button className="primaryBtn-1 btn mediumBtn" onClick={this.cashFlowAdd}>{Resources.save[currentLanguage]}</button>
                                </div>
                            </div>
                        </div>
                    </SkyLightStateless>
                </div>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

function mapStateToProps(state) {
    return {
        document: state.communication.document,
        isLoading: state.communication.isLoading,
        changeStatus: state.communication.changeStatus,
        file: state.communication.file,
        files: state.communication.files,
        hasWorkflow: state.communication.hasWorkflow,
        projectId: state.communication.projectId
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(budgetCashFlow))

