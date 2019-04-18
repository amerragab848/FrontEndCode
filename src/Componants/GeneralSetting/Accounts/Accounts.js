import React, { Component } from "react";
import Api from "../../../api";
import SkyLight from 'react-skylight';
import TaskAdmin from './TaskAdmin'
import LoadingSection from "../../../Componants/publicComponants/LoadingSection";
import Export from "../../OptionsPanels/Export";
import Filter from "../../FilterComponent/filterComponent";
import "../../../Styles/css/semantic.min.css";
import "../../../Styles/scss/en-us/layout.css";
import ConfirmationModal from "../../publicComponants/ConfirmationModal";
import GridSetup from "../../../Pages/Communication/GridSetup";
import NotifiMsg from '../../publicComponants/NotifiMsg'
import moment from "moment";
import CryptoJS from 'crypto-js';
import config from "../../../Services/Config";
import Resources from "../../../resources.json";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { __esModule } from "react-modern-datepicker/build/components/ModernDatepicker";
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
const _ = require('lodash')
const dateFormate = ({ value }) => {
    return value ? moment(value).format("DD/MM/YYYY") : "No Date";
};
const publicConfiguarion = config.getPayload();

let rwIdse = '';

class Accounts extends Component {

    constructor(props) {
        super(props);

        const columnsGrid = [
            {
                key: 'BtnActions',
                width: 150
            },
            {
                key: "id",
                visible: false,
                width: 50,
                frozen: true
            },
            {
                key: "userName",
                name: Resources["UserName"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "empCode",
                name: Resources["employeeCode"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "companyName",
                name: Resources["CompanyName"][currentLanguage],
                width: 200,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "contactName",
                name: Resources["ContactName"][currentLanguage],
                width: 200,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "position",
                name: Resources["position"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "supervisorCompanyName",
                name: Resources["SupervisorCompany"][currentLanguage],
                width: 200,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "activationStatus",
                name: Resources["activationStatus"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "supervisorName",
                name: Resources["SupervisorName"][currentLanguage],
                width: 200,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "groupName",
                name: Resources["GroupName"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }
        ];

        const filtersColumns = [
            {
                field: "userName",
                name: "UserName",
                type: "string",
                isCustom: true
            },
            {
                field: "contactName",
                name: "position",
                type: "string",
                isCustom: true
            },
            {
                field: "empCode",
                name: "employeeCode",
                type: "string",
                isCustom: true
            },
            {
                field: "supervisorName",
                name: "SupervisorName",
                type: "string",
                isCustom: true
            },
            {
                field: "companyName",
                name: "CompanyName",
                type: "string",
                isCustom: true
            },
            {
                field: "userType",
                name: "userType",
                type: "string",
                isCustom: true
            }
            ,
            {
                field: "groupName",
                name: "GroupName",
                type: "string",
                isCustom: true
            }
            ,
            {
                field: "active",
                name: "activationStatus",
                type: "toggle",
                trueLabel: "active",
                falseLabel: "inActive",
                isCustom: true
            }
        ];

        this.state = {
            columns: columnsGrid.filter(column => column.visible !== false),
            isLoading: true,
            rows: [],
            selectedRows: [],
            filtersColumns: filtersColumns,
            viewfilter: false,
            totalRows: 0,
            pageSize: 50,
            pageNumber: 0,
            pageTitle: Resources['accounts'][currentLanguage],
            api: 'GetAccountsChunk?',
            IsActiveShow: false,
            rowSelectedId: '',
            showPopupTaskAdmin: false,
            showDeleteModal: false,
            NewPassword: '',
            showResetPasswordModal: false,
            showCheckbox: false
        }
        this.GetCellActions = this.GetCellActions.bind(this);
    }

    DeleteAccount = (rowId) => {
        let rows = this.state.rows
        let Id = rowId[0]
        let IsCanDeleted = rows.filter(s => s.id === Id)
        if (IsCanDeleted[0].deletable === 1) {
            rwIdse = rowId;
            this.setState({
                showDeleteModal: true,
                rowSelectedId: rowId,
            })
        }
        else {
            toast.error(Resources['smartDeleteMessage'][currentLanguage].cannotDelete)
            setTimeout(() => {
                this.setState({
                    isLoading: false
                })
            }, 100);
            this.setState({
                isLoading: true
            })
        }
    }

    onCloseModal() {
        this.setState({
            showDeleteModal: false, showResetPasswordModal: false
        });
    }

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false, showResetPasswordModal: false });
    };

    addRecord = () => {
        this.props.history.push({
            pathname: "AddAccount"
        });
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
                        isLoading: false,
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

    componentDidMount = () => {
        if (config.IsAllow(794)) {
            let pageNumber = this.state.pageNumber + 1
            Api.get(this.state.api + "pageNumber=" + this.state.pageNumber + "&pageSize=" + this.state.pageSize).then(result => {
                this.setState({
                    rows: result,
                    isLoading: false,
                    pageNumber: pageNumber,
                    totalRows: result.length,
                    search: false,
                });
            });
        }
        else {
            alert('You Don`t Have Permissions')
            this.props.history.goBack()
        }
        if (config.IsAllow(798))
            this.setState({ showCheckbox: true })
        else
            this.setState({ showCheckbox: false })
    }

    ConfirmResetPassword = () => {
        let id = this.state.rowSelectedId;
        console.log(id)
        this.setState({ showDeleteModal: true })
        let rowsData = this.state.rows;
        let userName = _.find(rowsData, { 'id': id })

        Api.authorizationApi('ProcoorAuthorization?username=' + userName.userName +
            '&emailOrPassword=' + this.state.NewPassword +
            '&companyId=' + publicConfiguarion.cmi +
            '&changePassword=true', null, 'PUT').then(
                Api.post('ResetPassword?accountId=' + id + '&password=' + this.state.NewPassword + '').then(
                    this.setState({ showResetPasswordModal: false }))

            )
    }

    cellClick = (rowID, colID) => {
        if (config.IsAllow(797)) {
            if (colID != 0 && colID != 1) {
                this.AccountsEdit(this.state.rows[rowID])
            }
        }
    }

    GetNextData() {
        let pageNumber = this.state.pageNumber + 1;

        this.setState({
            isLoading: true,
            pageNumber: pageNumber
        });
        let url = this.state.api + "pageNumber=" + pageNumber + "&pageSize=" + this.state.pageSize
        Api.get(url).then(result => {
            let oldRows = this.state.rows;
            const newRows = [...oldRows, ...result]; // arr3 ==> [1,2,3,3,4,5]
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
        let url = this.state.api + "pageNumber=" + this.state.pageNumber + "&pageSize=" + this.state.pageSize
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

    hideFilter(value) {
        this.setState({ viewfilter: !this.state.viewfilter });
        return this.state.viewfilter;
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
            let url = 'GetAccountsFilter?' + this.state.pageNumber + "&pageSize=" + this.state.pageSize + '&query=' + _query[0] + '}'
            Api.get(url).then(result => {
                this.setState({
                    rows: result,
                    isLoading: false,
                    pageNumber: 1,
                    totalRows: result.length
                });
            })
        }
        else {
            this.setState({ isLoading: true })
            let pageNumber = this.state.pageNumber + 1
            Api.get(this.state.api + "pageNumber=" + this.state.pageNumber + "&pageSize=" + this.state.pageSize).then(result => {
                this.setState({
                    rows: result,
                    isLoading: false,
                    pageNumber: pageNumber,
                    totalRows: result.length,
                    search: false
                });
            });
        }

    };

    AccountsEdit(obj) {
        if (config.IsAllow(797)) {
            if (obj) {
                this.props.history.push({
                    pathname: "/EditAccount",
                    search: "?id=" + obj.id
                });
            }
        }
    }

    IsActive = (rows) => {
        if (config.IsAllow(798)) {
            this.setState({
                IsActiveShow: true,
                rowSelectedId: rows
            })
        }
    }

    IsActiveFun = () => {
        let id = 0;
        let userName = ''
        let rowsData = this.state.rows;
        let s = this.state.rowSelectedId.map(i => {
            id = i
        })
        userName = rowsData.filter(s => s.id === id)
        // let pageNumber = this.state.pageNumber 
        setTimeout(() => {
            Api.authorizationApi('ProcoorAuthorization?username=' + userName.userName + '&companyId=2&isActive=' + userName.active + '', null, 'PUT').then(
                Api.get('UpdateAccountActivation?id=' + id)
                    .then(
                        this.setState({ isLoading: false }),
                        Api.get(this.state.api + "pageNumber=" + this.state.pageNumber + "&pageSize=" + this.state.pageSize).then(result => {
                            this.setState({
                                rows: result,
                                isLoading: false,
                                totalRows: result.length,
                                search: false,
                            })
                        })
                    )
                    .catch(ex => { })
            ).catch(ex => { })
        }, 500);
        this.setState({
            isLoading: true,
            IsActiveShow: false,
        })
    }

    GetCellActions(column, row) {
        if (column.key === 'BtnActions') {
            return [{
                icon: "fa fa-pencil",
                actions: [
                    {
                        text: Resources['isTaskAdmin'][currentLanguage],
                        callback: (e) => {
                            if (config.IsAllow(1001102)) {
                                this.props.history.push({
                                    pathname: '/TaskAdmin',
                                    search: "?id=" + row.id
                                })
                            }
                        }
                    },
                    {
                        text: 'EPS',
                        callback: () => {
                            if (config.IsAllow(1001103)) {
                                this.props.history.push({
                                    pathname: '/AccountsEPSPermissions',
                                    search: "?id=" + row.id
                                })
                            }
                        }
                    },
                    {
                        text: Resources['Projects'][currentLanguage],
                        callback: () => {
                            if (config.IsAllow(1001104)) {
                                this.props.history.push({
                                    pathname: '/UserProjects',
                                    search: "?id=" + row.id
                                })
                            }
                        }
                    },
                    {
                        text: Resources['Companies'][currentLanguage],
                        callback: () => {
                            if (config.IsAllow(1001105)) {
                                this.props.history.push({
                                    pathname: '/AccountsCompaniesPermissions',
                                    search: "?id=" + row.id
                                })
                            }
                        }
                    },
                    {
                        text: "Reset Password",
                        callback: () => {
                            if (config.IsAllow(1001106)) {
                                let text = "";
                                let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                                for (var i = 0; i < 7; i++) {
                                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                                }
                                let _newPassEncode = CryptoJS.enc.Utf8.parse(JSON.stringify(text))
                                let newPassEncode = CryptoJS.enc.Base64.stringify(_newPassEncode)

                                this.setState({
                                    NewPassword: newPassEncode,
                                    showResetPasswordModal: true,
                                    rowSelectedId: row.id,
                                })
                            }
                        }
                    }
                ]
            }];
        }
    }

    UnSelectIsActiv = () => {
        this.setState({
            IsActiveShow: false,
        })
    }

    render() {
        const dataGrid =
            this.state.isLoading === false ? (
                <GridSetup rows={this.state.rows}
                    columns={this.state.columns}
                    showCheckbox={this.state.showCheckbox}
                    IsActiv={this.IsActive}
                    cellClick={this.cellClick}
                    clickHandlerDeleteRows={this.DeleteAccount}
                    getCellActions={this.GetCellActions}
                    UnSelectIsActiv={this.UnSelectIsActiv}
                    pageSize={this.state.pageSize}
                />
            ) : <LoadingSection />

        let Exportcolumns = this.state.columns.filter(s => s.key !== 'BtnActions')

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={Exportcolumns} fileName={this.state.pageTitle} />
            : null;

        const ComponantFilter = this.state.isLoading === false ?
            <Filter
                filtersColumns={this.state.filtersColumns}
                filterMethod={this.filterMethodMain}
            /> : null;

        return (
            <div >
                <div className="submittalFilter">

                    <div className="subFilter">
                        <h3 className="zero">{this.state.pageTitle}</h3>
                        <span>{this.state.totalRows}</span>
                        <div
                            className="ui labeled icon top right pointing dropdown fillter-button"
                            tabIndex="0"
                            onClick={() => this.hideFilter(this.state.viewfilter)}
                        >
                            <span>
                                <svg
                                    width="16px"
                                    height="18px"
                                    viewBox="0 0 16 18"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                >
                                    <g
                                        id="Symbols"
                                        stroke="none"
                                        strokeWidth="1"
                                        fill="none"
                                        fillRule="evenodd"
                                    >
                                        <g
                                            id="Action-icons/Filters/Hide+text/24px/Grey_Base"
                                            transform="translate(-4.000000, -3.000000)"
                                        >
                                            <g id="Group-4">
                                                <g id="Group-7">
                                                    <g id="filter">
                                                        <rect
                                                            id="bg"
                                                            fill="#80CBC4"
                                                            opacity="0"
                                                            x="0"
                                                            y="0"
                                                            width="24"
                                                            height="24"
                                                        />
                                                        <path
                                                            d="M15.5116598,15.1012559 C14.1738351,15.1012559 13.0012477,14.2345362 12.586259,12.9819466 L4.97668038,12.9819466 C4.43781225,12.9819466 4,12.5415758 4,12 C4,11.4584242 4.43781225,11.0180534 4.97668038,11.0180534 L12.586259,11.0180534 C13.0012477,9.76546385 14.1738351,8.89874411 15.5116598,8.89874411 C16.8494845,8.89874411 18.0220719,9.76546385 18.4370606,11.0180534 L19.0233196,11.0180534 C19.5621878,11.0180534 20,11.4584242 20,12 C20,12.5415758 19.5621878,12.9819466 19.0233196,12.9819466 L18.4370606,12.9819466 C18.0220719,14.2345362 16.8494845,15.1012559 15.5116598,15.1012559 Z M15.5116598,10.8626374 C14.8886602,10.8626374 14.3813443,11.372918 14.3813443,12 C14.3813443,12.627082 14.8886602,13.1373626 15.5116598,13.1373626 C16.1346594,13.1373626 16.6419753,12.627082 16.6419753,12 C16.6419753,11.372918 16.1346594,10.8626374 15.5116598,10.8626374 Z M7.78600823,9.20251177 C6.44547873,9.20251177 5.27202225,8.33246659 4.8586039,7.07576209 C4.37264206,7.01672011 4,6.60191943 4,6.10125589 C4,5.60059914 4.37263163,5.1858019 4.85858244,5.12675203 C5.27168513,3.86979791 6.44573643,3 7.78600823,3 C9.1238329,3 10.2964204,3.86671974 10.711409,5.11930926 L19.0233196,5.11930926 C19.5621878,5.11930926 20,5.5596801 20,6.10125589 C20,6.64283167 19.5621878,7.08320251 19.0233196,7.08320251 L10.711409,7.08320251 C10.2964204,8.33579204 9.1238329,9.20251177 7.78600823,9.20251177 Z M7.78600823,4.96389325 C7.1630086,4.96389325 6.65569273,5.4741739 6.65569273,6.10125589 C6.65569273,6.72833787 7.1630086,7.23861852 7.78600823,7.23861852 C8.40900786,7.23861852 8.91632373,6.72833787 8.91632373,6.10125589 C8.91632373,5.4741739 8.40900786,4.96389325 7.78600823,4.96389325 Z M13.1695709,18.8806907 C12.7545822,20.1332803 11.5819948,21 10.2441701,21 C8.90634542,21 7.73375797,20.1332803 7.3187693,18.8806907 L4.97668038,18.8806907 C4.43781225,18.8806907 4,18.4403199 4,17.8987441 C4,17.3571683 4.43781225,16.9167975 4.97668038,16.9167975 L7.3187693,16.9167975 C7.73375797,15.664208 8.90634542,14.7974882 10.2441701,14.7974882 C11.5819948,14.7974882 12.7545822,15.664208 13.1695709,16.9167975 L19.0233196,16.9167975 C19.5621878,16.9167975 20,17.3571683 20,17.8987441 C20,18.4403199 19.5621878,18.8806907 19.0233196,18.8806907 L13.1695709,18.8806907 Z M10.2441701,16.7613815 C9.62117047,16.7613815 9.1138546,17.2716621 9.1138546,17.8987441 C9.1138546,18.5258261 9.62117047,19.0361068 10.2441701,19.0361068 C10.8671697,19.0361068 11.3744856,18.5258261 11.3744856,17.8987441 C11.3744856,17.2716621 10.8671697,16.7613815 10.2441701,16.7613815 Z"
                                                            id="Shape"
                                                            fill="#5E6475"
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
                        {config.IsAllow(801) ?
                            <button className="primaryBtn-1 btn mediumBtn" onClick={this.addRecord.bind(this)}>NEW</button>
                            : null}
                    </div>

                    <div className="rowsPaginations">
                        <div className="rowsPagiRange">
                            <span>0</span> - <span>{this.state.pageSize}</span> of
                           <span> {this.state.totalRows}</span>
                        </div>

                        <button className={this.state.pageNumber == 0 ? "rowunActive" : ""} onClick={() => this.GetPrevoiusData()}>
                            <i className="angle left icon" />
                        </button>
                        <button onClick={() => this.GetNextData()}>
                            <i className="angle right icon" />
                        </button>

                    </div>

                </div>

                <div className="filterHidden"
                    style={{
                        maxHeight: this.state.viewfilter ? "" : "0px",
                        overflow: this.state.viewfilter ? "" : "hidden"
                    }}>
                    <div className="gridfillter-container">
                        {ComponantFilter}
                    </div>
                </div>

                <div className="grid-container">
                    {dataGrid}
                </div>

                {this.state.showPopupTaskAdmin ? <TaskAdmin /> : null}
                {this.state.showDeleteModal == true ? (
                    <ConfirmationModal
                        title={Resources['smartDeleteMessage'][currentLanguage].content}
                        closed={this.onCloseModal}
                        showDeleteModal={this.state.showDeleteModal}
                        clickHandlerCancel={this.clickHandlerCancelMain}
                        buttonName='delete' clickHandlerContinue={this.ConfirmDeleteAccount}
                    />
                ) : null}

                {this.state.showResetPasswordModal == true ? (
                    <ConfirmationModal
                        title='Are you sure you want to Reset Your Password ?'
                        closed={this.onCloseModal}
                        showDeleteModal={this.state.showResetPasswordModal}
                        clickHandlerCancel={this.clickHandlerCancelMain}
                        buttonName='save' clickHandlerContinue={this.ConfirmResetPassword}
                    />
                ) : null}
            </div>
        );
    }
}

export default withRouter(Accounts)