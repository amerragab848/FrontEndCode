import React, { Component, Fragment } from "react";
import Resources from "../../resources.json";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { toast } from "react-toastify";
import Config from "../../Services/Config.js";
import * as communicationActions from "../../store/actions/communication";
import Tree from "../../Componants/OptionsPanels/Tree";
import Api from '../../api'

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
class rptCostCodingTree extends Component {
  constructor(props) {
    super(props);
    if (!Config.IsAllow(400)) {
      toast.warn(Resources['missingPermissions'][currentLanguage])
      this.props.history.goBack()
    }
    this.state = {
      projectId: '',
      NodeData: {}
    }
  }


  componentWillReceiveProps(props) {
    console.log('props', props.projectId)
    this.setState({
      projectId: props.projectId
    })
  }

  componentWillMount = () => {

  }


  GetNodeData = (id) => {
    Api.get('GetSummaryOfCostCoding?id=' + id + '').then(
      res => {
        this.setState({
          NodeData: res
        })
      }
    )
  }

  render() {


    return (
      <div className="mainContainer">

        <div className="documents-stepper noTabs__document">
          <div className="submittalHead">
            <h2 className="zero">  {Resources.costCodingTreeReport[currentLanguage]} </h2>
            <div className="SubmittalHeadClose">
              <svg width="56px" height="56px" viewBox="0 0 56 56" version="1.1"
                xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                  <g id="Components/Sections/Doc-page/Title/Base" transform="translate(-1286.000000, -24.000000)" >
                    <g id="Group-2"> <g id="Action-icons/Close/Circulated/56px/Light-grey_Normal" transform="translate(1286.000000, 24.000000)">
                      <g id="Action-icons/Close/Circulated/20pt/Grey_Normal">
                        <g id="Group">
                          <circle id="Oval" fill="#E9ECF0" cx="28" cy="28" r="28" />
                          <path id="Combined-Shape" fill="#858D9E" fillRule="nonzero"
                            d="M36.5221303,34.2147712 C37.1592899,34.8519308 37.1592899,35.8849707 36.5221303,36.5221303 C35.8849707,37.1592899 34.8519308,37.1592899 34.2147712,36.5221303 L28,30.3073591 L21.7852288,36.5221303 C21.1480692,37.1592899 20.1150293,37.1592899 19.4778697,36.5221303 C18.8407101,35.8849707 18.8407101,34.8519308 19.4778697,34.2147712 L25.6926409,28 L19.4778697,21.7852288 C18.8407101,21.1480692 18.8407101,20.1150293 19.4778697,19.4778697 C20.1150293,18.8407101 21.1480692,18.8407101 21.7852288,19.4778697 L28,25.6926409 L34.2147712,19.4778697 C34.8519308,18.8407101 35.8849707,18.8407101 36.5221303,19.4778697 C37.1592899,20.1150293 37.1592899,21.1480692 36.5221303,21.7852288 L30.3073591,28 L36.5221303,34.2147712 Z" />
                        </g>
                      </g>
                    </g>
                    </g>
                  </g>
                </g>
              </svg>
            </div>

          </div>
          <Tree projectId={this.state.projectId} GetNodeData={this.GetNodeData} />
        </div>

        <div className="doc-pre-cycle">
          <div className='document-fields'>
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

      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    document: state.communication.document,
    isLoading: state.communication.isLoading,
    projectId: state.communication.projectId
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(communicationActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(rptCostCodingTree));