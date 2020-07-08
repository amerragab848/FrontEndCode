import React, { Component, Fragment } from "react";
import dataservice from "../../Dataservice";
import Resources from "../../resources.json";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux"; 
import * as communicationActions from "../../store/actions/communication";
import LoadingSection from '../../Componants/publicComponants/LoadingSection';
import { toast } from "react-toastify";
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

var treeContainer = []
class CostControlTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      costCodingTreeId: 0,
      mode: 'add',
      projectId: this.props.projectId,
      trees: [],
      childerns: [],
      rowIndex: null,
      viewPopUp: false,
      objDocument: {},
      isEdit: false,
      parentId: "",
      isLoading: false,
      drawChilderns: false,
      showDeleteModal: false,
      docId: "",
      showActions: this.props.showActions === false ? false : true,
      IsFirstParent: false,
      finish: false,
      document: {
        codeTreeTitle: "",
        budgetThisPeriod: "",
        budgetAtComplete: "",
        originalBudget: "",
        costForcast: ""
      },
      selectedValue: {
        label: Resources.selectProjects[currentLanguage],
        value: "0"
      }
    };

    // if (!Config.IsAllow(134) || !Config.IsAllow(135) || !Config.IsAllow(137)) {
    //   toast.success(Resources["missingPermissions"][currentLanguage]);

    //   this.props.history.push("/DashBoard/" + this.state.projectId);
    // }

    this.printChild = this.printChild.bind(this);
  }

  componentDidMount() {
    var links = document.querySelectorAll(".noTabs__document .doc-container .linebylineInput");

    for (var i = 0; i < links.length; i++) {
      if ((i + 1) % 2 == 0) {
        links[i].classList.add("even");
      } else {
        links[i].classList.add("odd");
      }
    }

    this.getTree(null);

    dataservice.GetDataList("GetAccountsProjectsByIdForList", "projectName", "projectId").then(result => {
      this.setState({
        projects: result
      });
    });
  }

  getTree = () => {
    this.setState({ isLoading: true })
    dataservice.GetDataGrid(this.state.showActions ? "GetNewAllCostCodingTree" : "GetNewCostCodingTreeByProjectId?projectId=" + this.state.projectId).then(result => {
      let state = this.state
      this.clear();
      if (result) {
        result.forEach(item => {
          state[item.id] = item;
          state['_' + item.id] = false
        })
        this.setState({
          trees: result,
          state,
          isLoading: false,
        });
      }
      this.setState({ isLoading: false })
    });
  }

  GetNodeData = (item) => {
    this.props.GetNodeData(item)
  }

  search(id, trees, updateTrees, parentId) {

    trees.map(item => {
      updateTrees.push(item);
      if (item.trees.length > 0) {
        let state = this.state;
        state['_' + item.id] = state['_' + item.id] ? state['_' + item.id] : false;
        this.setState({ state });
        this.search(id, item.trees, updateTrees, parentId);
      }
    });
    return updateTrees;
  };

  printChild(children) {
    return (
      children.map((item, i) => {
        if (treeContainer != null)
          treeContainer[item.id] = item
        return (
          <Fragment key={i}>
            <div className={this.state[item.id] === -1 ? ' epsTitle' : this.state['_' + item.id] === true ? 'epsTitle active' : 'epsTitle'} key={item.id} onClick={() => this.viewChild(item)}
              style={{ display: this.state[item.id] === -1 ? 'none' : '' }} >
              <div className="listTitle">
                <span className="dropArrow" style={{ visibility: (item.trees.length > 0 ? '' : 'hidden') }}>
                  <i className="dropdown icon" />
                </span>
                <span className="accordionTitle" onClick={this.props.GetNodeData ? () => this.GetNodeData(item) : null}>
                  {this.state[item.id] ? this.state[item.id].codeTreeTitle || item.costCodingTreeName : item.codeTreeTitle || item.costCodingTreeName}
                </span>
              </div>

            </div>
            <div className="epsContent">
              {item.trees.length > 0 ? this.printChild(item.trees) : null}
            </div>
          </Fragment>
        )
      })
    )
  }

  viewChild(item) {
    let trees = [...this.state.trees];
    let state = this.state;
    state['_' + item.id] = !state['_' + item.id];
    this.search(item.id, trees, [], item.parentId);
    this.setState({
      trees, state
    });
  }

  handleChange(e, field) {
    let original_document = { ...this.state.document };

    let updated_document = {};

    updated_document[field] = e.target.value;

    updated_document = Object.assign(original_document, updated_document);

    this.setState({
      document: updated_document
    });
  }
  clear = () => {

    let treeDocument = {
      codeTreeTitle: "",
      budgetThisPeriod: "",
      budgetAtComplete: "",
      originalBudget: "",
      costForcast: "",
      parentId: ""
    };

    this.setState({
      document: treeDocument,
      selectedValue: {
        label: Resources.selectProjects[currentLanguage],
        value: "0"
      }
    })
  }

  clickHandlerContinueMain() {
    let state = this.state
    if (treeContainer != null) {
      treeContainer.forEach(item => {
        state[item.id] = item
      })
      this.setState({ state, isLoading: true })
    }
    dataservice.addObject("DeleteNewCostCodeTree?id=" + this.state.docId).then(result => {
      let state = this.state
      state[this.state.docId] = -1
      if (result != null)
        this.setState({ trees: result, showDeleteModal: false, state, isLoading: false })
      else
        this.setState({ showDeleteModal: false, state, isLoading: false });
      treeContainer = null;
      toast.success(Resources["operationSuccess"][currentLanguage]);

    }).catch(ex => {
      toast.success(Resources["operationSuccess"][currentLanguage]);
      this.setState({ showDeleteModal: false, isLoading: false });
    });
  }

  clickHandlerCancelMain = () => {
    this.setState({ showDeleteModal: false });
  }

  render() {
    return (
      <div>
        <div className="documents-stepper noTabs__document">
          {this.state.isLoading == true ? <LoadingSection /> :
            <div className="Eps__list">
              {
                this.state.trees.map((item, i) => {
                  if (treeContainer != null)
                    treeContainer[item.id] = item
                  return (
                    <Fragment key={i}>
                      <div className={this.state[item.id] === -1 ? ' epsTitle' : this.state['_' + item.id] === true ? 'epsTitle active' : 'epsTitle'} key={item.id}
                        style={{ display: this.state[item.id] === -1 ? 'none' : '' }} onClick={() => this.viewChild(item)} >
                        <div className="listTitle">
                          <span className="dropArrow" style={{ visibility: (item.trees.length > 0 ? '' : 'hidden') }}>
                            <i className="dropdown icon" />
                          </span>
                          <span className="accordionTitle" onClick={this.props.GetNodeData ? () => this.GetNodeData(item) : null}>{this.state[item.id] ? this.state[item.id].codeTreeTitle || item.costCodingTreeName : item.codeTreeTitle || item.costCodingTreeName}
                          </span>
                        </div>
                      </div>
                      <div className="epsContent" id={item.id}>
                        {item.trees.length > 0 ? this.printChild(item.trees) : null}
                      </div>
                    </Fragment>
                  )
                })
              }
            </div>
          }
        </div>

      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    document: state.communication.document,
    isLoading: state.communication.isLoading
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
)(withRouter(CostControlTree));
