import React, { Component } from "react";
import Resources from "../../../resources.json";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import GridCustom from "../../../Componants/Templates/Grid/CustomGrid";
import { toast } from "react-toastify";
import dataservice from "../../../Dataservice";
import Config from "../../../Services/Config.js";
import * as communicationActions from "../../../store/actions/communication";
import Tree from "../../../Pages/Contracts/CostControlTree";
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import Api from '../../../api'
import ExportDetails from "../ExportReportCenterDetails";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class CostControlTreeReport extends Component {
    constructor(props) {
        super(props);
        if (!Config.IsAllow(10073)) {
            toast.warn(Resources['missingPermissions'][currentLanguage])
            this.props.history.goBack()
        }

        this.state = {
            projectId: null,
            selectedProject: { label: Resources['selectProjects'][currentLanguage], value: "0" },
            projects: [],
            NodeData: {},
            isLoading: false,
            showActions: true,
            renderTree: true,
            gridRows: []

        }
        this.columns = [
            {
                "field": "costCodingTitle",
                "title": Resources.costCoding[currentLanguage],
                "type": "text",
                "width": 15,
                "fixed": true,
                "groupable": true,
                "sortable": true
            }, {
                "field": "originalBudget",
                "title": Resources.estimatedBudget[currentLanguage],
                "type": "number",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "paymentTotal",
                "title": Resources.paymentRequisitionCost[currentLanguage],
                "type": "number",
                "width": 20,
                "groupable": true,
                "sortable": true
            }, {
                "field": "expenses",
                "title": Resources.expensesCost[currentLanguage],
                "type": "number",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "totalMaterialRelease",
                "title": Resources.materialRelease[currentLanguage],
                "type": "number",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "invoicesTotal",
                "title": Resources.invoicesForPoCost[currentLanguage],
                "type": "number",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "actualCost",
                "title": Resources.actualCost[currentLanguage],
                "type": "number",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "actualPercentage",
                "title": Resources.actualPercentage[currentLanguage],
                "type": "text",
                "width": 20,
                "groupable": true,
                "sortable": true
            }, {
                "field": "balance",
                "title": Resources.balance[currentLanguage],
                "type": "number",
                "width": 15,
                "groupable": true,
                "sortable": true
            }
        ];

    }
    componentDidMount() {
        dataservice.GetDataList("GetAccountsProjectsByIdForList", "projectName", "id").then(result => {
            this.setState({
                projects: result
            });
        });
    }
    handleChangeDrop = (e) => {
        let renderTre = this.state.renderTree ? false : true;
        this.setState({
            projectId: e.value,
            selectedProject: e,
            showActions: false,
            renderTree: renderTre,

        })
    }

    GetNodeData = (item) => {
        this.setState({ isLoading: true })
        Api.get('GetCostcodingReport?treeId=' + item.id + '&projectId=' + this.state.projectId + '').then(
            res => {


                if (res != null) {
                    let estimatedBudgetTotal = 0;
                    let paymentRequisitionsCost = 0;
                    let expensesCost = 0;
                    let materialRelease = 0;
                    let invoicesForPOCost = 0;
                    let actualCostTotal = 0;
                    let balanceTotal = 0;
                    res.forEach(row => {
                        row.actualPercentage = row.actualPercentage + " %";
                        estimatedBudgetTotal = estimatedBudgetTotal + row.originalBudget;
                        paymentRequisitionsCost = paymentRequisitionsCost + row.paymentTotal;
                        expensesCost = expensesCost + row.expenses;
                        materialRelease = materialRelease + row.totalMaterialRelease;
                        invoicesForPOCost = invoicesForPOCost + row.invoicesTotal;
                        actualCostTotal = actualCostTotal + row.actualCost;
                        balanceTotal = balanceTotal + row.balance;
                    })
                    let actualPercentageTotal = estimatedBudgetTotal == 0 ? "0 %" : Math.round((actualCostTotal / estimatedBudgetTotal) * 100) + " %";
                    res.push({
                        costCodingTitle: "Total",
                        originalBudget: estimatedBudgetTotal,
                        paymentTotal: paymentRequisitionsCost,
                        expenses: expensesCost,
                        totalMaterialRelease: materialRelease,
                        invoicesTotal: invoicesForPOCost,
                        actualCost: actualCostTotal,
                        actualPercentage: actualPercentageTotal,
                        balance: balanceTotal
                    })
                    this.setState({
                        gridRows: res,
                        isLoading: false
                    });
                } else {
                    this.setState({
                        isLoading: false
                    });
                }
            }
        ).catch(res => {
            this.setState({
                isLoading: false
            });
        })
    }
    render() {
        let exportBtn = this.state.isLoading == false ? <ExportDetails fieldsItems={this.columns}
            rows={this.state.gridRows}
            fields={[]} fileName={Resources.CostCodingReport[currentLanguage]} /> : null
        return (
            <div className="reports__content reports__multiDrop">
                <header>
                    <h2 className="zero">Cos Coding Report</h2>
                    {exportBtn}
                </header>
                <div className='proForm reports__proForm datepickerContainer'>
                    <div className="linebylineInput multiChoice">
                        <Dropdown title='projectName' data={this.state.projects} name='projectName'
                            selectedValue={this.state.selectedProject} handleChange={e => { this.handleChangeDrop(e); }} />
                    </div>
                </div>
                {this.state.renderTree ?
                    <Tree projectId={this.state.projectId} GetNodeData={this.GetNodeData} showActions={this.state.showActions} /> : null}
                {this.state.renderTree == false ?
                    <Tree projectId={this.state.projectId} GetNodeData={this.GetNodeData} showActions={this.state.showActions} /> : null}
                {this.state.isLoading ?
                    <div className="fixedLoading">
                        <LoadingSection />
                    </div> :
                    <>
                        <GridCustom ref='custom-data-grid' gridKey="CostCodingReport" groups={[]} data={this.state.gridRows} cells={this.columns}
                            pageSize={this.state.gridRows.length} actions={[]} rowActions={[]} rowClick={() => { }}
                        />
                    </>
                }
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        document: state.communication.document,
        isLoading: state.communication.isLoading,
        //  projectId: state.communication.projectId,
        projectName: state.communication.projectName
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CostControlTreeReport));