import React, { Component } from "react";
import Resources from "../../resources.json";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { toast } from "react-toastify";
import Config from "../../Services/Config.js";
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument'
import * as communicationActions from "../../store/actions/communication";
import Tree from "../../Pages/Contracts/costCodingTreeAddEdit";
import Api from '../../api'
import Export from "../../Componants/OptionsPanels/Export";
import LoadingSection from '../../Componants/publicComponants/LoadingSection';
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class rptCostCodingTree extends Component {
  constructor(props) {
    super(props);


    if (!Config.IsAllow(400)) {
      toast.warn(Resources['missingPermissions'][currentLanguage])
      this.props.history.goBack()
    }

    this.state = {
      projectId: props.match.params.projectId,
      NodeData: {},
      isLoading: false
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      projectId: props.projectId
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
        }else{
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
      { key: 'projectName', name: Resources['projectName'][currentLanguage] },
      { key: 'costCodingTitle', name: Resources['costCoding'][currentLanguage] },
      { key: 'totalCostCode', name: Resources['totalCost'][currentLanguage] },
      { key: 'invoicesTotal', name: Resources['invoicesTotal'][currentLanguage] },
      { key: 'paymentTotal', name: Resources['paymentTotal'][currentLanguage] },
      { key: 'totalMaterialRelease', name: Resources['materialRequestcount'][currentLanguage] },
      { key: 'expenses', name: Resources['expensesTotal'][currentLanguage] },
    ]

    let rows = []
    rows.push(this.state.NodeData)
    return (
      <div className="mainContainer">
        <div className="white-bg">
          <div className="documents-stepper noTabs__document">
            <HeaderDocument projectName={this.props.projectName} perviousRoute={"/"} docTitle={Resources.costCodingTreeReport[currentLanguage]} moduleTitle={Resources['costControl'][currentLanguage]} />

            <Tree projectId={this.props.projectId} GetNodeData={this.GetNodeData} showActions={false} />
            {this.state.isLoading ?
              <div className="fixedLoading">
                <LoadingSection />
              </div> :

              <div className="doc-pre-cycle">
                <div className='document-fields'>
                  <div className="slider-Btns" style={{ margin: '30px 0', display: 'flex', justifyContent: 'flex-end' }}>
                    <div className="filterBTNS exbortBtn">
                      <Export rows={rows}
                        columns={ExportColumns} fileName={Resources['costCodingTreeReport'][currentLanguage]} />
                    </div>
                  </div>
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
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    document: state.communication.document,
    isLoading: state.communication.isLoading,
    projectId: state.communication.projectId,
    projectName: state.communication.projectName
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(communicationActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(rptCostCodingTree));