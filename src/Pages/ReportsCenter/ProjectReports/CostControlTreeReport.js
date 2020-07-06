import React, { Component } from "react";
import Resources from "../../../resources.json";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { toast } from "react-toastify";
import dataservice from "../../../Dataservice";
import Config from "../../../Services/Config.js";
import * as communicationActions from "../../../store/actions/communication";
import Tree from "../../../Pages/Contracts/CostControlTree";
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import Api from '../../../api'
import Export from "../../../Componants/OptionsPanels/Export";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class CostControlTreeReport extends Component {
    constructor(props) {
        super(props);
        if (!Config.IsAllow(10072)) {
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
            renderTree: true

        }
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
            renderTree: renderTre
        })
    }

    GetNodeData = (item) => {
        this.setState({ isLoading: true })
        Api.get('GetSummaryOfCostControl?treeId=' + item.id + '&projectId=' + this.state.projectId + '').then(
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

        let ExportColumns = [
            { field: 'projectName', title: Resources['projectName'][currentLanguage] },
            { field: 'costCodingTitle', title: Resources['costCoding'][currentLanguage] },
            { field: 'totalCostCode', title: Resources['totalCost'][currentLanguage] },
            { field: 'invoicesTotal', title: Resources['invoicesTotal'][currentLanguage] },
            { field: 'paymentTotal', title: Resources['paymentTotal'][currentLanguage] },
            { field: 'totalMaterialRelease', title: Resources['materialRequestcount'][currentLanguage] },
            { field: 'expenses', title: Resources['expensesTotal'][currentLanguage] },
        ]
        let rows = []
        rows.push(this.state.NodeData)
        return (
            <div className="reports__content reports__multiDrop">
                <header>
                    <h2 className="zero">Cos Control Tree Report</h2>
                    <Export rows={rows}
                        columns={ExportColumns} fileName={Resources['CostControlTreeReport'][currentLanguage]} />

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
                        <table className="ui table">
                            <tbody>
                                <tr>
                                    <td>{Resources['projectName'][currentLanguage]}</td>
                                    <td>{this.state.NodeData.projectName}</td>
                                </tr>

                                <tr>
                                    <td>{Resources['costCoding'][currentLanguage]}</td>
                                    <td>{this.state.NodeData.costCodingTitle}</td>
                                </tr>

                                <tr>
                                    <td>{Resources['totalCost'][currentLanguage]}</td>
                                    <td>{this.state.NodeData.totalCostCode}</td>
                                </tr>
                                <tr>
                                    <td>{Resources['estimatedCost'][currentLanguage]}</td>
                                    <td>{this.state.NodeData.originalBudget}</td>
                                </tr>
                                <tr>
                                    <td>{Resources['invoicesTotal'][currentLanguage]}</td>
                                    <td>{this.state.NodeData.invoicesTotal}</td>
                                </tr>

                                <tr>
                                    <td>{Resources['paymentTotal'][currentLanguage]}</td>
                                    <td>{this.state.NodeData.paymentTotal}</td>
                                </tr>

                                <tr>
                                    <td>{Resources['materialRequestcount'][currentLanguage]}</td>
                                    <td>{this.state.NodeData.totalMaterialRelease}</td>
                                </tr>

                                <tr>
                                    <td>{Resources['expensesTotal'][currentLanguage]}</td>
                                    <td>{this.state.NodeData.expenses}</td>
                                </tr>

                            </tbody>
                        </table>
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