import React, { Component } from "react";
import Api from "../../../api";
import SkyLight from 'react-skylight';
import TaskAdmin from './TaskAdmin'
import LoadingSection from "../../../Componants/publicComponants/LoadingSection";
import Export from "../../../Componants/OptionsPanels/Export";
import Filter from "../../FilterComponent/filterComponent";
import "../../../Styles/css/semantic.min.css";
import "../../../Styles/scss/en-us/layout.css";
import ConfirmationModal from "../../publicComponants/ConfirmationModal";
import GridSetup from "../../../Pages/Communication/GridSetup";

import moment from "moment";
import CryptoJS from 'crypto-js';
import config from "../../../Services/Config";
import Resources from "../../../resources.json";
import { withRouter } from "react-router-dom";
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
                formatter: this.BtnTaskAdmin,
                key: 'BtnTaskAdmin'
            },
            {
                formatter: this.BtnEPS,
                key: 'BtnEPS'
            },
            {
                formatter: this.BtnProjects,
                key: 'BtnProjects'
            },
            {
                formatter: this.BtnCompanies,
                key: 'BtnCompanies'
            },
            {
                formatter: this.BtnResetPassword,
                key: 'BtnResetPassword'

            },
            {
                key: "id",
                visible: false,
                width: '140%',
                frozen: true
            },
            {
                key: "userName",
                name: Resources["UserName"][currentLanguage],
                width: "50%",
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "empCode",
                name: Resources["employeeCode"][currentLanguage],
                width: "50%",
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "companyName",
                name: Resources["CompanyName"][currentLanguage],
                width: "50%",
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "contactName",
                name: Resources["ContactName"][currentLanguage],
                width: "50%",
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "position",
                name: Resources["position"][currentLanguage],
                width: "50%",
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "supervisorCompanyName",
                name: Resources["SupervisorCompany"][currentLanguage],
                width: "50%",
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "activationStatus",
                name: Resources["activationStatus"][currentLanguage],
                width: "50%",
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "supervisorName",
                name: Resources["SupervisorName"][currentLanguage],
                width: "50%",
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "groupName",
                name: Resources["GroupName"][currentLanguage],
                width: "50%",
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
            viewfilter: true,
            totalRows: 0,
            pageSize: 50,
            pageNumber: 0,
            pageTitle: Resources['accounts'][currentLanguage],
            api: 'GetAccountsChunk?',
            IsActiveShow: false,
            rowSelectedId: '',
            showPopupTaskAdmin: false,
            showDeleteModal: false , 
            NewPassword:'',
            showResetPasswordModal:false
        }
    }

    DeleteAccount = (rowId) => {
        rwIdse = rowId;
        this.setState({
            showDeleteModal: true,
            rowSelectedId: rowId,
        })
    }

    onCloseModal = () => {
        this.setState({ showDeleteModal: false,showResetPasswordModal: false });
    };

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false, showResetPasswordModal: false  });
    };

    // onCloseModalResetPassword = () => {
    //     this.setState({ showResetPasswordModal: false });
    // };

    // clickHandlerCancelMainResetPassword = () => {
    //     this.setState({ showResetPasswordModal: false });
    // };

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
        let   userName = _.find(rowsData, { 'id': id })
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
                    });
                })
                .catch(ex => {
                    this.setState({
                        showDeleteModal: false
                    })
                })
        ).catch(ex => { })
        this.setState({
            isLoading: true,
        })
    }

    BtnTaskAdmin = () => {
        return <button className="icon__btn"><i className="fa fa-tasks"></i></button>
    }

    BtnCompanies = () => {
        return <button className="icon__btn"><i className="fa fa-building"></i></button>
    }

    BtnEPS = () => {
        return <button className="icon__btn"><i className="fa fa-briefcase"></i></button>
    }

    BtnProjects = () => {
        return <button className="icon__btn"><i className="fa fa-file-powerpoint-o"></i>
        </button>
    }

    BtnResetPassword = () => {
        return <button className="icon__btn"><i className="fa fa-key"></i> </button>
    }

    componentDidMount() {
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

    ClickTaskAdmin = (rowSelected) => {
        this.props.history.push({
            pathname: '/TaskAdmin',
            search: "?id=" + rowSelected.id
        })
    }

    ClickBtnCompanies = (rowSelected) => {
        this.props.history.push({
            pathname: '/AccountsCompaniesPermissions',
            search: "?id=" + rowSelected.id
        })
    }

    ClickBtnEPS = (rowSelected) => {
        this.props.history.push({
            pathname: '/AccountsEPSPermissions',
            search: "?id=" + rowSelected.id
        })
    }

    ClickBtnProjects = (rowSelected) => {
        this.props.history.push({
            pathname: '/UserProjects',
            search: "?id=" + rowSelected.id
        })
    }

    ClickBtnResetPassword = (rowSelected) => {
        let text="";
        let possible= "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 7; i++)
        {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        let _newPassEncode = CryptoJS.enc.Utf8.parse(JSON.stringify(text))
        let newPassEncode = CryptoJS.enc.Base64.stringify(_newPassEncode)
      // console.log(newPassEncode)
       let q = rowSelected.id
     //  console.log(q)
       this.setState({
           NewPassword:newPassEncode,
           showResetPasswordModal:true ,
           rowSelectedId:q ,
       })
    }

   ConfirmResetPassword=()=>{
    let id =this.state.rowSelectedId;
    console.log(id)
    this.setState({ showDeleteModal: true })
    let rowsData = this.state.rows;
    let   userName = _.find(rowsData, { 'id': id })

    Api.authorizationApi('ProcoorAuthorization?username='+userName.userName+'&emailOrPassword='+this.state.NewPassword+'&companyId='+publicConfiguarion.cmi+'&changePassword=true', null, 'PUT').then(
   Api.post('ResetPassword?accountId='+id+'&password='+this.state.NewPassword+'').then(
        this.setState({ showResetPasswordModal:false}))

           )
   }

    cellClick = (rowID, colID) => {
        if (colID == 1) {
            this.ClickTaskAdmin(this.state.rows[rowID])
            this.setState({
                showPopupTaskAdmin: false
            })
        }
        else if (colID == 2)
            this.ClickBtnEPS(this.state.rows[rowID])

        else if (colID == 3)
            this.ClickBtnProjects(this.state.rows[rowID])

        else if (colID == 4)
            this.ClickBtnCompanies(this.state.rows[rowID])


        else if (colID == 5) {
            this.ClickBtnResetPassword(this.state.rows[rowID])
        }
        else if (colID != 0) {
            this.AccountsEdit(this.state.rows[rowID])
        }
    }

    GetNextData = () => {
      //  if (!this.state.search) {
            let pageNumber = this.state.pageNumber + 1
            this.setState({ isLoading: true })
            let url = this.state.api + "pageNumber=" + this.state.pageNumber + "&pageSize=" + this.state.pageSize
            Api.get(url).then(result => {
                this.setState({
                    rows: result,
                    isLoading: false,
                    pageNumber: pageNumber
                });
            });
        // }
        // else {
        //     alert("de bta3t search")
        // }
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
        if (stringifiedQuery.includes("userName") || stringifiedQuery.includes("contactName") || stringifiedQuery.includes("empCode") ||
            stringifiedQuery.includes("supervisorName") || stringifiedQuery.includes("companyName") || stringifiedQuery.includes("userType") ||
            stringifiedQuery.includes("groupName") || stringifiedQuery.includes("active")) {
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
        if (obj) {
            this.props.history.push({
                pathname: "/EditAccount",
                search: "?id=" + obj.id
            });
        }
    }


    IsActive = (rows) => {

        this.setState({
            IsActiveShow: true,
            rowSelectedId: rows
        })
        console.log('IsActive', rows[0])
    }

    IsActiveFun = () => {
        let id = '';
        let rowsData = this.state.rows;
        let s = this.state.rowSelectedId.map(i => {
            id = i
        })
        let userName = _.find(rowsData, { 'id': id })
        let pageNumber = this.state.pageNumber + 1
        console.log(userName.userName)
        setTimeout(() => {
            Api.authorizationApi('ProcoorAuthorization?username=' + userName.userName + '&companyId=2&isActive=' + userName.active + '', null, 'PUT').then(
                Api.get('UpdateAccountActivation?id=' + id)
                    .then(
                        this.setState({ isLoading: false }),
                        Api.get(this.state.api + "pageNumber=" + this.state.pageNumber + "&pageSize=" + this.state.pageSize).then(result => {
                            this.setState({
                                rows: result,
                                isLoading: false,
                                pageNumber: pageNumber,
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
        })
    }

    render() {
        const dataGrid =
            this.state.isLoading === false ? (
                <GridSetup rows={this.state.rows} columns={this.state.columns}
                    showCheckbox={true}
                    clickHandlerDeleteRows={this.clickHandlerDeleteRowsMain}
                    IsActiv={this.IsActive}
                    cellClick={this.cellClick} clickHandlerDeleteRows={this.DeleteAccount} />

            ) : <LoadingSection />;


        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.state.columns} fileName={this.state.pageTitle} />
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
                        <button className="primaryBtn-1 btn mediumBtn" onClick={this.addRecord.bind(this)}>NEW</button>
                    </div>
                    <div className="rowsPaginations">
                        <div className="rowsPagiRange">
                            <span>{((this.state.pageNumber - 1) * this.state.pageSize) + 1}</span> - <span>{(this.state.pageNumber) * this.state.pageSize}</span> of
                            <span>{this.state.totalRows}</span>
                        </div>
                        <button className="rowunActive">
                            <i className="angle left icon" />
                        </button>
                        <button onClick={() => this.GetNextData()}>
                            <i className="angle right icon" />
                        </button>
                    </div>

                </div>
                <div
                    className="filterHidden"
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