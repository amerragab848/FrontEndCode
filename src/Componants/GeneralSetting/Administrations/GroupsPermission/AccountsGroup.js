import React, { Component } from "react";
import Api from "../../../../api";
import LoadingSection from "../../../../Componants/publicComponants/LoadingSection";
import Export from "../../../OptionsPanels/Export";
import ConfirmationModal from "../../../publicComponants/ConfirmationModal";
import config from "../../../../Services/Config";
import Resources from "../../../../resources.json";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import GridCustom from "../../../../Componants/Templates/Grid/CustomGrid";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class permissionsGroups extends Component {
    constructor(props) {
        super(props);
        const columnGrid = [
            {
                field: 'userName',
                title: Resources['UserName'][currentLanguage],
                width: 15,
                groupable: true,
                fixed: true,
                type: "text",
                sortable: true,
            },
            {
                field: 'contactName',
                title: Resources['ContactName'][currentLanguage],
                width: 15,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: 'empCode',
                title: Resources['employeeCode'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: 'SupervisorCompanyName',
                title: Resources['SupervisorCompany'][currentLanguage],
                width: 15,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: 'supervisorName',
                title: Resources['SupervisorName'][currentLanguage],
                width: 15,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: 'groupName',
                title: Resources['GroupName'][currentLanguage],
                width: 15,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }
        ];
        this.rowActions = [
            {
                title: 'Delete',
                handleClick: values => {
                    this.setState({ showDeleteModal: true, row: values })
                },
                classes: ''
            }
        ]

        this.state = {
            columns: columnGrid,
            isLoading: true,
            groupId: props.match.params.groupId,
            currentTitle: 'add',
            rows: [],
            row: {},
            selectedRows: [],
            groupList: [],
            totalRows: 0
        }
        if (config.getPayload().uty != 'company') {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            })
        }
    }
    deleteGroupName = (rowId) => {
        this.setState({ showDeleteModal: true, rowId: rowId })
    }

    onCloseModal() {
        this.setState({
            showDeleteModal: false, showResetPasswordModal: false
        });
    }

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false, showResetPasswordModal: false });
    };

    ConfirmdeleteAccount = () => {
        if (this.state.row.id != null) {
            this.setState({ isLoading: true, showDeleteModal: false })
            Api.get('DeleteAccountsGroup?id=' + this.state.row.id).then(() => {
                toast.success(Resources["operationSuccess"][currentLanguage]);
                let rows = []
                this.state.rows.forEach(element => {
                    if (element.id != this.state.row.id) {
                        rows.push(element)
                    }
                })
                this.setState({ rows, isLoading: false })
            }).catch(() => {
                toast.error(Resources["operationCanceled"][currentLanguage]);
                this.setState({ isLoading: false })
            })
        }
    }

    componentDidMount = () => {
        Api.get('AccountsGroupGetByGroupId?groupId=' + this.state.groupId + '&pageNumber=0&pageSize=200').then(result => {
            if (result != null) {
                this.setState({
                    rows: result,
                    isLoading: false,
                    totalRows: result.length,
                });
            }
        }).catch(() => {
            toast.error(Resources["operationCanceled"][currentLanguage]);
            this.setState({ isLoading: false })
        })

    }

    onRowClick(value) {
        this.setState({
            selectedRow: value,
            isLoading: true
        })
        // if (column.key != 'select-row') {
        this.props.history.push({
            pathname: "/EditAccount",
            search: "?id=" + value.id
        });
        // }
    }
    render() {
        const dataGrid =
            this.state.isLoading === false ? (
                <GridCustom
                    ref='custom-data-grid'
                    gridKey="AccountsGroup"
                    data={this.state.rows}
                    pageSize={this.state.rows.length}
                    groups={[]}
                    actions={[]}
                    rowActions={this.rowActions}
                    cells={this.state.columns}
                    rowClick={(cell) => { this.onRowClick(cell) }}
                />
            ) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.state.columns} fileName={'accountsGroup'} />
            : null;

        return (
            <div className='mainContainer main__withouttabs' >
                <div className="submittalFilter readOnly__disabled">
                    <div className="subFilter">
                        <h3 className="zero">{Resources.accountsGroup[currentLanguage]}</h3>
                        <span>{this.state.totalRows}</span>
                    </div>
                    <div className="filterBTNS">
                        {btnExport}
                    </div>
                </div>
                <div className="grid-container">
                    {dataGrid}
                </div>
                {this.state.showDeleteModal == true ? (
                    <ConfirmationModal
                        title={Resources["smartDeleteMessageContent"][currentLanguage]}
                        closed={this.onCloseModal}
                        showDeleteModal={this.state.showDeleteModal}
                        clickHandlerCancel={this.clickHandlerCancelMain}
                        buttonName='delete' clickHandlerContinue={this.ConfirmdeleteAccount}
                    />
                ) : null}

            </div>
        );
    }
}

export default withRouter(permissionsGroups)