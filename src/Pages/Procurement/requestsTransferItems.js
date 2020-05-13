import React, { Component, Fragment } from 'react'
import Resources from '../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../Componants/publicComponants/LoadingSection';
import Config from "../../Services/Config";
import CryptoJS from 'crypto-js';
import { withRouter } from "react-router-dom";
import Export from '../../Componants/OptionsPanels/Export';
import dataservice from "../../Dataservice";
import * as communicationActions from '../../store/actions/communication';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import GridCustom from "../../Componants/Templates/Grid/CustomGrid";

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

class requestsTransferItems extends Component {

    constructor(props) {
        super(props)
  const columnsGrid = [
            {
                field: 'fromProjectName',
                title: Resources['fromProject'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: true,
                type: "text",
                sortable: true,
            },
            {
                field: 'toProjectName',
                title: Resources['projectName'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: true,
                type: "text",
                sortable: true,
            },
            {
                field: 'approvedQuantity',
                title: Resources['approvedQuantity'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: true,
                type: "text",
                sortable: true,
            },
            {
                field: 'rejectedQuantity',
                title: Resources['rejectedQuantity'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: true,
                type: "text",
                sortable: true,
            },
            {
                field: 'pendingQuantity',
                title: Resources['pendingQuantity'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: true,
                type: "text",
                sortable: true,
            },{
                field: 'sendDate',
                title: Resources['sendDate'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: true,
                type: "date",
                sortable: true,
            }, {
                field: 'transactionDate',
                title: Resources['transactionDate'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: true,
                type: "date",
                sortable: true,
            },
            {
                field: 'lastWorkFlow',
                title: Resources['lastWorkFlow'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: true,
                type: "text",
                sortable: true,
            },
        ];

        this.state = {
            isLoading: true,
            rows: [],
            columns: columnsGrid.filter(column => column.visible !== false),
            totalRows: 0,
            projectId: this.props.projectId,
            pageTitle: Resources['transferToProject'][currentLanguage],
        }
        if (!Config.IsAllow(3772)) {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push("/DashboardProject/" + this.state.projectId);
        }
    }

    componentWillMount() {
        this.setState({
            isLoading: true
        })
        dataservice.GetDataGrid('GetAllRequestsTransferItems').then(res => {
            this.setState({
                rows: res,
                totalRows: res.length,
                isLoading: false
            })
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.projectId !== this.props.projectId) {
            this.setState({
                isLoading: true
            })
            dataservice.GetDataGrid('GetAllBudgetCashFlowForGrid?projectId=' + this.props.projectId + '').then(data => {
                this.setState({
                    rows: data,
                    projectId: nextProps.projectId,
                    isLoading: false,
                    totalRows: data.length,
                })
            })
        }
    }

    GoEdit = (obj) => {
        if (Config.IsAllow(3774)) {
            let objRout = {
                docId: obj.id,
                projectId: obj.projectId,
                projectName: localStorage.getItem("lastSelectedprojectName"),
                arrange: 0,
                docApprovalId: 0,
                isApproveMode: false
            }
            let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(objRout));
            let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);
            this.props.history.push({
                pathname: "/" + 'TransferInventory',
                search: "?id=" + encodedPaylod
            });
        }
    }
    
    render() {

        const dataGrid =
            this.state.isLoading === false ? (
                <GridCustom
                ref='custom-data-grid'
                key="RequestTransferItems"
                data={this.state.rows}
                pageSize={this.state.rows.length}
                groups={[]}
                actions={[]}
                rowActions={[]}
                cells={this.state.columns}
                rowClick={(cell) => { this.GoEdit(cell) }}
            />
                ) : <LoadingSection />
        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.columns} fileName={'transferToProject'} />
            : null;

        return (

            <div className='mainContainer'>
                <div>
                    <div className="submittalFilter readOnly__disabled">

                        <div className="subFilter">
                            <h3 className="zero">{this.state.pageTitle}</h3>
                            <span>{this.state.totalRows}</span>
                        </div>

                        <div className="filterBTNS">
                            {btnExport}
                        </div>
                    </div>

                    <div className="grid-container">
                        {dataGrid}
                    </div>
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
)(withRouter(requestsTransferItems))

