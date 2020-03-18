import React, { Component } from "react";
import Resources from "../../../resources.json";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import GridCustom from 'react-customized-grid';
import { toast } from "react-toastify";
import dataservice from "../../../Dataservice";
import Config from "../../../Services/Config.js";
import * as communicationActions from "../../../store/actions/communication";
import Tree from "../../../Pages/Contracts/CostControlTree";
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import Api from '../../../api'
//import Export from "../../../Componants/OptionsPanels/Export";
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
                "field": "projectName",
                "title": Resources.projectName[currentLanguage],
                "type": "text",
                "width": 15,
                "fixed": true,
                "groupable": true,
                "sortable": true
            }, {
                "field": "description",
                "title": Resources.description[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "unit",
                "title": Resources.unit[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "purchased",
                "title": Resources.purchased[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "tranfare",
                "title": Resources.transfare[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "returned",
                "title": Resources.returned[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "consumption",
                "title": Resources.consumption[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "exchanges",
                "title": Resources.exchanges[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "drawingContractors",
                "title": Resources.drawingContractors[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "totalPurchased",
                "title": Resources.totalPurchased[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "totalTranfare",
                "title": Resources.totalTranfare[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "totalReturned",
                "title": Resources.totalReturned[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "totalConsumption",
                "title": Resources.totalConsumption[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "totalExchanges",
                "title": Resources.totalExchanges[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "totalDrawingContractors",
                "title": Resources.totalDrawingContractors[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "startQuantity",
                "title": Resources.startQuantity[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "finishQuantity",
                "title": Resources.finishQuantity[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "total",
                "title": Resources.total[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "avgUnitPrice",
                "title": Resources.avgUnitPrice[currentLanguage],
                "type": "text",
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
        Api.get('GetSummaryOfCostCoding?id=' + item.id + '').then(
            res => {
                if (res != null) {
                    this.setState({
                        NodeData: res,
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
            rows={rows || []}
            fields={[]} fileName={Resources.CostCodingReport[currentLanguage]} /> : null
        // let ExportColumns = [
        //     { field: 'projectName', title: Resources['projectName'][currentLanguage] },
        //     { field: 'costCodingTitle', title: Resources['costCoding'][currentLanguage] },
        //     { field: 'totalCostCode', title: Resources['totalCost'][currentLanguage] },
        //     { field: 'invoicesTotal', title: Resources['invoicesTotal'][currentLanguage] },
        //     { field: 'paymentTotal', title: Resources['paymentTotal'][currentLanguage] },
        //     { field: 'totalMaterialRelease', title: Resources['materialRequestcount'][currentLanguage] },
        //     { field: 'expenses', title: Resources['expensesTotal'][currentLanguage] },
        // ]
        let rows = []
        rows.push(this.state.NodeData)
        return (
            <div className="reports__content reports__multiDrop">
                <header>
                    <h2 className="zero">Cos Coding Report</h2>
                    {exportBtn}
                </header>
                <div className='proForm reports__proForm'>
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
                        <GridCustom ref='custom-data-grid' groups={[]} data={rows || []} cells={this.columns}
                            pageSize={this.state.NodeData.length} actions={[]} rowActions={[]} rowClick={() => { }}
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