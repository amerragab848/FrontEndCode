import React, { Component } from "react";
import Api from "../../../../api";
import LoadingSection from "../../../../Componants/publicComponants/LoadingSection";
import Export from "../../../OptionsPanels/Export"; 
import ConfirmationModal from "../../../publicComponants/ConfirmationModal";
import GridSetup from "../../../../Pages/Communication/GridSetup"; 
import config from "../../../../Services/Config";
import Resources from "../../../../resources.json";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang"); 

class permissionsGroups extends Component {
    constructor(props) {
        super(props);
        const columnsGrid = [
            {
                key: "userName",
                name: Resources["UserName"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true
            },  {
                key: "contactName",
                name: Resources["ContactName"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true
            },  {
                key: "empCode",
                name: Resources["employeeCode"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true
            },  {
                key: "SupervisorCompanyName",
                name: Resources["SupervisorCompany"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true
            },  {
                key: "supervisorName",
                name: Resources["SupervisorName"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true
            },  {
                key: "groupName",
                name: Resources["GroupName"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true
            }
        ];
        this.state = {
            columns: columnsGrid,
            isLoading: true,
            groupId:props.match.params.groupId,
            currentTitle: 'add',
            rows: [],
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
        if (this.state.rowId[0] != null) {
            this.setState({ isLoading: true , showDeleteModal: false })
            Api.get('DeleteAccountsGroup?id=' + this.state.rowId[0]).then(() => {
                toast.success(Resources["operationSuccess"][currentLanguage]);
                let rows = []
                this.state.rows.forEach(element => {
                    if (element.id != this.state.rowId[0]) {
                        rows.push(element)
                    }
                })
                this.setState({ rows, isLoading: false})
            }).catch(() => {
                toast.error(Resources["operationCanceled"][currentLanguage]);
                this.setState({ isLoading: false })
            })
        }
    }

    componentWillMount = () => {
        Api.get('AccountsGroupGetByGroupId?groupId='+this.state.groupId+'&pageNumber=0&pageSize=200').then(result => {
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

    onRowClick(value, index, column) {
        this.setState({
            selectedRow: value,
            isLoading: true
        })
        if (column.key != 'select-row') {
            this.props.history.push({
                pathname: "/EditAccount",
                search: "?id=" + value.id
            });
        }

    } 

    render() {
        const dataGrid =
            this.state.isLoading === false ? (
                <GridSetup rows={this.state.rows}
                    columns={this.state.columns}
                    clickHandlerDeleteRows={selectedRows=>this.deleteGroupName(selectedRows)}
                    single={true}
                    onRowClick={(value, index, column) => this.onRowClick(value, index, column)}
                />
            ) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.state.columns} fileName={'accountsGroup'} />
            : null;
  
        return (
            <div className='mainContainer main__withouttabs' >
                <div className="submittalFilter">
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
                        title={Resources['smartDeleteMessage'][currentLanguage].content}
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