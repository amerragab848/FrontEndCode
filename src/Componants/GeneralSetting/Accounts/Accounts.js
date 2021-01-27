import React, { Component } from "react";
import Api from "../../../api";
import TaskAdmin from './TaskAdmin'
import LoadingSection from "../../../Componants/publicComponants/LoadingSection";
import Export from "../../OptionsPanels/Export";
import Filter from "../../FilterComponent/filterComponent";
import ConfirmationModal from "../../publicComponants/ConfirmationModal";
import GridCustom from "../../../Componants/Templates/Grid/CustomCommonLogGrid";
import CryptoJS from 'crypto-js';
import config from "../../../Services/Config";
import Resources from "../../../resources.json";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { __esModule } from "react-modern-datepicker/build/components/ModernDatepicker";


let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
const find = require('lodash/find');

class Accounts extends Component {

    constructor(props) {
        super(props);

        this.columnsGrid = [
            { title: '', type: 'check-box', fixed: true, field: 'id' },
            {
                field: "userName",
                title: Resources["UserName"][currentLanguage],
                groupable: true,
                fixed: true,
                width: 16,
                sortable: true,
                type: "text"
            },
            {
                field: "empCode",
                title: Resources["employeeCode"][currentLanguage],
                width: 18,
                groupable: true,
                fixed: true,
                sortable: true,
                type: "text",
            },
            {
                field: "companyName",
                title: Resources["CompanyName"][currentLanguage],
                width: 16,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: "contactName",
                title: Resources["ContactName"][currentLanguage],
                width: 16,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "text"
            },
            {
                field: "position",
                title: Resources["position"][currentLanguage],
                width: 16,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "text"
            },
            {
                field: "supervisorCompanyName",
                title: Resources["SupervisorCompany"][currentLanguage],
                width: 16,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "text"
            },
            {
                field: "activationStatus",
                title: Resources["activationStatus"][currentLanguage],
                width: 16,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "text"
            },
            {
                field: "supervisorName",
                title: Resources["SupervisorName"][currentLanguage],
                width: 16,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "text"
            },
            {
                field: "groupName",
                title: Resources["GroupName"][currentLanguage],
                width: 16,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "text"
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
                field: "groupName",
                name: "GroupName",
                type: "string",
                isCustom: true
            },
            {
                field: "active",
                name: "activationStatus",
                type: "toggle",
                trueLabel: "active",
                falseLabel: "inActive",
                isCustom: true
            },
            {
                field: "empCode",
                name: "employeeCode",
                type: "number",
                isCustom: true
            }
        ];

        this.actions = [
            {
                title: 'Delete',
                handleClick: values => {
                    console.log(values);
                    this.setState({
                        showDeleteModal: true,
                        IsActiveShow: true,
                        selectedRow: values
                    });
                },
                classes: '',
            }
        ];

        this.rowActions = [
            {
                title: Resources['isTaskAdmin'][currentLanguage],
                handleClick: value => {
                    if (config.IsAllow(1001102)) {
                        this.props.history.push({
                            pathname: '/TaskAdmin',
                            search: "?id=" + value.id
                        })
                    }
                }
            },
            {
                title: 'inActive',
                handleClick: value => {
                    this.IsActive(value.id)
                }
            },
            {
                title: 'EPS',
                handleClick: value => {
                    if (config.IsAllow(1001103)) {
                        this.props.history.push({
                            pathname: '/AccountsEPSPermissions',
                            search: "?id=" + value.id
                        })
                    }
                }
            },
            {
                title: Resources['Projects'][currentLanguage],
                handleClick: value => {
                    if (config.IsAllow(1001104)) {
                        this.props.history.push({
                            pathname: '/UserProjects',
                            search: "?id=" + value.id
                        })
                    }
                }
            },
            {
                title: Resources['Companies'][currentLanguage],
                handleClick: value => {
                    if (config.IsAllow(1001105)) {
                        this.props.history.push({
                            pathname: '/AccountsCompaniesPermissions',
                            search: "?id=" + value.id
                        })
                    }
                }
            },
            {
                title: "Reset Password",
                handleClick: value => {
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
                            rowSelectedId: value.id,
                        })
                    }
                }
            }
        ];

        this.state = {
            columns: this.columnsGrid,
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
            showCheckbox: false,
            showDocTemplateModal: false,
            docTemplateModalComponent: null
        }
        this.GetCellActions = this.GetCellActions.bind(this);
    }

    DeleteAccount = (rowId) => {
        let rows = this.state.rows
        let Id = rowId[0]
        let IsCanDeleted = rows.filter(s => s.id === Id)
        if (IsCanDeleted[0].deletable === 1) {

            this.setState({
                showDeleteModal: true,

                rowSelectedId: rowId,
            })
        }
        else {
            toast.error(Resources['smartDeleteMessageCannotDelete'][currentLanguage])
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
        this.setState({
            showDeleteModal: false, showResetPasswordModal: false,
            IsActiveShow: false
        });
    };

    addRecord = () => {
        Api.get('CheckLimitAccount').then(result => {
            if (result === 'Done') {
                this.props.history.push({ pathname: "AddAccount" });
            }
            else {
                toast.error('You have exceeded accounts users number please contact the administartor !!!')
            }
        })
    }

    ConfirmDeleteAccount = () => {
        let id = '';
        this.setState({
            showDeleteModal: true,

            isLoading: true
        })
        let rowsData = this.state.rows;
        this.state.rowSelectedId.map(i => {
            id = i
        })
        let userName = find(rowsData, { 'id': id })
        Api.authorizationApi('ProcoorAuthorization?username=' + userName.userName, null, 'Delete').then(
            res => {
                if (res.status === 200) {
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
                            toast.success(Resources["operationSuccess"][currentLanguage]);
                        }).catch(ex => {
                            this.setState({
                                showDeleteModal: false,
                                IsActiveShow: false,
                                isLoading: false,
                            });
                            toast.error(Resources["operationCanceled"][currentLanguage]);
                        })
                }
                else {
                    toast.error(Resources["operationCanceled"][currentLanguage]);
                    this.setState({
                        showDeleteModal: false,
                        IsActiveShow: false,
                        isLoading: false,
                    });
                }

            }).catch(ex => {
                this.setState({
                    showDeleteModal: false,
                    IsActiveShow: false,
                    isLoading: false,
                });
                toast.error(Resources["operationCanceled"][currentLanguage]);
            })

    }
    updateAccountActivation = () => {
        let id = this.state.rowSelectedId;
        let rowsData = this.state.rows;
        let userName = find(rowsData, { 'id': id })
        let isActive = '';
        let companyId = config.getPublicConfiguartion().accountCompanyId;

        Api.authorizationApi("ProcoorAuthorization?username=" + userName + "&companyId=" + companyId + "&isActive=" + isActive, null, 'PUT').then(
            res => {
                Api.get("/UpdateAccountActivation", { id: id }).then(
                    result => {
                        toast.success(Resources["operationSuccess"][currentLanguage]);
                    });
            });
    }
    refreshGrid = () => {


        if (config.IsAllow(794)) {
            this.setState({ isLoading: true, rows: [] });
            // let pageNumber = this.state.pageNumber + 1
            Api.get(this.state.api + "pageNumber=" + this.state.pageNumber + "&pageSize=" + this.state.pageSize).then(result => {
                this.setState({

                    rows: result,
                    isLoading: false,
                    totalRows: result.length,
                    search: false,
                });
            });

            this.setState({

                rowSelectedId: {}
            });
        }
        else {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.goBack()
        }
        if (config.IsAllow(798))
            this.setState({ showCheckbox: true })
        else
            this.setState({ showCheckbox: false })
    }

    componentDidMount = () => {
        if (config.IsAllow(794)) {
            // let pageNumber = this.state.pageNumber + 1
            Api.get(this.state.api + "pageNumber=" + this.state.pageNumber + "&pageSize=" + this.state.pageSize).then(result => {
                this.setState({
                    rows: result,
                    isLoading: false,
                    //pageNumber: pageNumber,
                    totalRows: result.length,
                    search: false,
                });
            });
        }
        else {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.goBack()
        }
        if (config.IsAllow(798))
            this.setState({ showCheckbox: true })
        else
            this.setState({ showCheckbox: false })
    }

    ConfirmResetPassword = () => {

        this.setState({ isLoading: true, showResetPasswordModal: false })

        let id = this.state.rowSelectedId;
        let rowsData = this.state.rows;

        let userName = find(rowsData, { 'id': id })

        let companyId = config.getPublicConfiguartion().accountCompanyId;

        Api.authorizationApi('ProcoorAuthorization?username=' + userName.userName + '&emailOrPassword=' + this.state.NewPassword + '&companyId=' + companyId + '&changePassword=true', null, 'PUT').then(data => {
            if (data.status == 200) {
                Api.post('ResetPassword?accountId=' + id + '&password=' + this.state.NewPassword).then(result => {
                    this.setState({ isLoading: false })
                })
            } else {
                toast.warn(data.msg);
                this.setState({ isLoading: false }) 
            } 
        })
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
        let url = this.state.api + "pageNumber=" + pageNumber + "&pageSize=50"
        Api.get(url).then(result => {
            let oldRows = this.state.rows;
            const newRows = [...oldRows, ...result]; // arr3 ==> [1,2,3,3,4,5]
            this.setState({
                rows: newRows,
                totalRows: newRows.length,
                pageSize: this.state.pageSize + 50,
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
        let pageSize = this.state.pageSize - 50;

        this.setState({
            isLoading: true,
            pageNumber: pageNumber
        });

        let url = this.state.api + "pageNumber=" + pageNumber + "&pageSize=" + pageSize;

        Api.get(url).then(result => {
            let oldRows = [];// this.state.rows;
            const newRows = [...oldRows, ...result];

            this.setState({
                rows: newRows,
                totalRows: newRows.length,
                pageSize: pageSize,
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

        delete query["isCustom"];

        console.log("query", query);

        var stringifiedQuery = JSON.stringify(query);

        this.setState({
            isLoading: true,
            query: stringifiedQuery
        });

        if (stringifiedQuery !== '{}') {
            this.setState({ isLoading: true, search: true })
            // let _query = stringifiedQuery.split(',"isCustom"')
            let url = 'GetAccountsFilter?pageNumber=' + this.state.pageNumber + "&pageSize=" + this.state.pageSize + '&query=' + stringifiedQuery;
            Api.get(url).then(result => {
                if (result != null) {
                    this.setState({
                        rows: result || [],
                        isLoading: false,
                        totalRows: result.length || 0
                    });
                }
            }).catch(res => {
                this.setState({
                    isLoading: false
                });
            })
        }
        else {
            this.setState({ isLoading: true })

            Api.get(this.state.api + "pageNumber=" + this.state.pageNumber + "&pageSize=" + this.state.pageSize).then(result => {
                if (result != null) {
                    this.setState({
                        rows: result || [],
                        isLoading: false,
                        totalRows: result.length || 0,
                        search: false
                    });
                }
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
        id = this.state.rowSelectedId;
        userName = rowsData.filter(s => s.id === id)
        let userNameParam = userName[0].userName;
        let companyId = config.getPublicConfiguartion().accountCompanyId;
        let active = userName[0].active;
        setTimeout(() => {
            Api.authorizationApi('ProcoorAuthorization?username=' + userNameParam + '&companyId=' + companyId + '&isActive=' + active + '', null, 'PUT').then(
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

    documentTemplateShowModalHandler = () => {
        import('../../Templates/DocumentTemplateAttachment/GeneralSettingsDocTemplateAttachment').then(module => {
            this.setState({ docTemplateModalComponent: module.default, showDocTemplateModal: true })
        });
    };

    closeDocTemplateModalHandler = () => {
        this.setState({ showDocTemplateModal: false })
    };
    afterUpload = () => {
        Api.get(this.state.api + "pageNumber=" + this.state.pageNumber + "&pageSize=" + this.state.pageSize).then(result => {
            this.setState({
                rows: result,
                isLoading: false,
                //pageNumber: pageNumber,
                totalRows: result.length,
                search: false,
            });
        });
    }

    render() {
        let DocTemplateModalComponent = this.state.docTemplateModalComponent
        const dataGrid =
            this.state.isLoading === false ? (
                <GridCustom
                    gridKey="Accounts"
                    cells={this.columnsGrid}
                    data={this.state.rows}
                    pageSize={this.state.pageSize}
                    actions={this.actions}
                    rowActions={this.rowActions}
                    rowClick={cell => {
                        let id = cell.id;
                        if (config.IsAllow(797)) {
                            if (cell) {
                                console.log(this.props);
                                this.props.history.push({
                                    pathname: "/EditAccount",
                                    search: "?id=" + id
                                });
                            }
                        }
                    }}
                    groups={[]}
                />
            ) : <LoadingSection />

        let Exportcolumns = this.state.columns.filter(s => s.key !== 'BtnActions')

        const btnExport = this.state.isLoading === false ? <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={Exportcolumns} fileName={this.state.pageTitle} /> : null;

        const ComponantFilter = <Filter filtersColumns={this.state.filtersColumns} filterMethod={this.filterMethodMain} />;

        const btnDocumentTemplate = config.IsAllow(801) ? (<button
            className="primaryBtn-2 btn mediumBtn"
            onClick={() => this.documentTemplateShowModalHandler()}>
            {Resources['DocTemplate'][currentLanguage]}
        </button>) : null;

        return (
            <div>
                <div className="submittalFilter readOnly__disabled">
                    <div className="subFilter">
                        <h3 className="zero">{this.state.pageTitle}</h3>
                        <span>{this.state.totalRows}</span>
                        <div className="ui labeled icon top right pointing dropdown fillter-button" tabIndex="0" onClick={() => this.hideFilter(this.state.viewfilter)}>
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
                            <span className={this.state.viewfilter === false ? "text active " : " text"}>
                                <span className="show-fillter">{Resources['hideFillter'][currentLanguage]}</span>
                                <span className="hide-fillter">{Resources['showFillter'][currentLanguage]}</span>
                            </span>
                        </div>
                    </div>
                    <div className="filterBTNS">
                        {<button className="primaryBtn-1 btn mediumBtn " onClick={this.refreshGrid}><i className="fa fa-refresh"></i></button>}
                        {btnDocumentTemplate}
                        {btnExport}
                        {config.IsAllow(801) ? <button className="primaryBtn-1 btn mediumBtn" onClick={this.addRecord.bind(this)}>NEW</button> : null}
                    </div>
                    <div className="rowsPaginations readOnly__disabled">
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
                <div className="filterHidden" style={{ maxHeight: this.state.viewfilter ? "" : "0px", overflow: this.state.viewfilter ? "" : "hidden" }}>
                    <div className="gridfillter-container">
                        {ComponantFilter}
                    </div>
                </div>

                <div className="grid-container fixed__loading">
                    {dataGrid}
                </div>
                {this.state.showPopupTaskAdmin ? <TaskAdmin /> : null}
                {this.state.showDeleteModal == true ? (
                    <ConfirmationModal
                        title={Resources['smartDeleteMessageContent'][currentLanguage]}
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
                        buttonName='reset' clickHandlerContinue={this.ConfirmResetPassword}
                    />
                ) : null}
                {this.state.IsActiveShow == true ? (
                    <ConfirmationModal
                        title='Are you sure you want to inActive Account?'
                        closed={this.onCloseModal}
                        showDeleteModal={this.state.IsActiveShow}
                        clickHandlerCancel={this.clickHandlerCancelMain}
                        buttonName='save' clickHandlerContinue={this.IsActiveFun}
                    />
                ) : null}
                {DocTemplateModalComponent != null && this.state.showDocTemplateModal == true ? (
                    <DocTemplateModalComponent
                        afterUpload={this.afterUpload}
                        onClose={this.closeDocTemplateModalHandler}
                        docTempLink={config.getPublicConfiguartion().downloads + '/Downloads/Excel/AccountsTemplate.xlsx'}
                    />
                ) : null}
            </div>
        );
    }
}

export default withRouter(Accounts)