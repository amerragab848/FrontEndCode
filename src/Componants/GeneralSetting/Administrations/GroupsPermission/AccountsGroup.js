import React, { Component } from "react";
import Api from "../../../../api";
import SkyLight from 'react-skylight';
import LoadingSection from "../../../../Componants/publicComponants/LoadingSection";
import Export from "../../../OptionsPanels/Export";
import Filter from "../../../FilterComponent/filterComponent";
import "../../../../Styles/css/semantic.min.css";
import "../../../../Styles/scss/en-us/layout.css";
import ConfirmationModal from "../../../publicComponants/ConfirmationModal";
import GridSetup from "../../../../Pages/Communication/GridSetup";
import moment from "moment";
import CryptoJS from 'crypto-js';
import config from "../../../../Services/Config";
import Resources from "../../../../resources.json";
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

class AccountsGroup extends Component {
    constructor(props) {
        super(props);
        const columnsGrid = [
            {
                key: 'BtnActions',
                width: 150
            },
            {
                key: "groupName",
                name: Resources["GroupName"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true
            },
        ];

        this.state = {
            columns: columnsGrid,
            isLoading: true,
            rows: [],
            selectedRows: [],
            totalRows: 0,
            pageSize: 50,
            pageNumber: 0,
            pageTitle: Resources['accounts'][currentLanguage],
        }
        this.GetCellActions = this.GetCellActions.bind(this);
    }

    GetCellActions(column, row) {
        if (column.key === 'BtnActions') {
            return [{
                icon: "fa fa-pencil",
                actions: [
                    {
                        text: Resources['copyTo'][currentLanguage],
                        callback: (e) => {
                            if (config.IsAllow(1001102)) {
                                this.copyTo()
                            }
                        }
                    },
                    {
                        text: Resources['groupsPermissions'][currentLanguage],
                        callback: () => {
                            if (config.IsAllow(1001103)) {
                                // this.props.history.push({
                                //     pathname: '/AccountsEPSPermissions',
                                //     search: "?id=" + row.id
                                // })
                            }
                        }
                    },
                    {
                        text: Resources['contacts'][currentLanguage],
                        callback: () => {
                            if (config.IsAllow(1001104)) {
                                // this.props.history.push({
                                //     pathname: '/UserProjects',
                                //     search: "?id=" + row.id
                                // })
                            }
                        }
                    }
                ]
            }];
        }
    }

    copyTo = () => {
        console.log('selected', this.state.selectedRow)
        this.setState({ isLoading: true })
        let Group = {
            id: this.state.selectedRow.id,
            groupName: this.state.selectedRow.groupName
        }
        Api.post('AddAccountsPermissionsGroupsCopy', Group).then(() => {
            toast.success(Resources["operationSuccess"][currentLanguage]);
            this.setState({ isLoading: false })
        }).catch(() => {
            toast.error(Resources["operationCanceled"][currentLanguage]);
            this.setState({ isLoading: false })
        })
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

    componentWillMount = () => {
        if (config.IsAllow(794)) {
            let pageNumber = this.state.pageNumber + 1
            Api.get('GetPermissionsGroupsGrid?pageNumber=0&pageSize=200').then(result => {
                this.setState({
                    rows: result,
                    isLoading: false,
                    totalRows: result.length,
                });
            });
        }
        else {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            })
        }

    }

    cellClick = (rowID, colID) => {
        if (config.IsAllow(797)) {
            if (colID != 0 && colID != 1) {
                this.AccountsEdit(this.state.rows[rowID])
            }
        }
    }

    onRowClick(value, index, column) {
        console.log('value', value)
        this.setState({ selectedRow: value })
    }


   
    render() {
        const dataGrid =
            this.state.isLoading === false ? (
                <GridSetup rows={this.state.rows}
                    columns={this.state.columns}
                    cellClick={this.cellClick}
                    clickHandlerDeleteRows={this.DeleteAccount}
                    getCellActions={this.GetCellActions}
                    onRowClick={(value, index, column) => this.onRowClick(value, index, column)}
                />
            ) : <LoadingSection />

        let Exportcolumns = this.state.columns.filter(s => s.key !== 'BtnActions')

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={Exportcolumns} fileName={this.state.pageTitle} />
            : null;


        return (
            <div >
                <div className="submittalFilter">

                    <div className="subFilter">
                        <h3 className="zero">{Resources.groupsPermissions[currentLanguage]}</h3>
                        <span>{this.state.totalRows}</span>
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

export default withRouter(AccountsGroup)