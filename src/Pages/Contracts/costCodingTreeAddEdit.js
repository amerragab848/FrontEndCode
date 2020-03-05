import React, { Component, Fragment } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import dataservice from "../../Dataservice";
import Resources from "../../resources.json";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Config from "../../Services/Config.js";
import * as communicationActions from "../../store/actions/communication";
import Delete from "../../Styles/images/epsActions/delete.png";
import Assigne from "../../Styles/images/epsActions/assigne.svg";
import Edit from "../../Styles/images/epsActions/edit.png";
import Plus from "../../Styles/images/epsActions/plus.png";
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import LoadingSection from '../../Componants/publicComponants/LoadingSection';
import { toast } from "react-toastify";
import SkyLight from "react-skylight";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const validationSchema = Yup.object().shape({
  codeTreeTitle: Yup.string().required(Resources["subjectRequired"][currentLanguage]).max(450, Resources["maxLength"][currentLanguage]),
  budgetThisPeriod: Yup.number().required(Resources["budgetThisPeriodSelection"][currentLanguage]),
  budgetAtComplete: Yup.number().required(Resources["budgetAtCompleteSelection"][currentLanguage]),
  originalBudget: Yup.number().required(Resources["originalBudgetRequire"][currentLanguage]),
  costForcast: Yup.number().required(Resources["costForcastSelection"][currentLanguage])
});

const validationSchemaAssignProject = Yup.object().shape({
  projectId: Yup.string().required(Resources["selectProjects"][currentLanguage]).nullable(true)
});


var treeContainer = []

class CostCodingTreeAddEdit extends Component {
  constructor(props) {

    super(props);

    this.state = {
      costCodingTreeId: 0,
      mode: 'add',
      projectId: props.match.params.projectId,
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

    if (!Config.IsAllow(134) || !Config.IsAllow(135) || !Config.IsAllow(137)) {
      toast.success(Resources["missingPermissions"][currentLanguage]);

      this.props.history.push("/DashBoard/" + this.state.projectId);
    }

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

  AddDocument(item) {
    this.setState({
      parentId: item.id,
      isEdit: true,
      viewPopUp: true,
      objDocument: item,
      mode: 'add'
    });
    this.simpleDialog.show();
    this.clear();
  }

  EditDocument(item) {
    this.setState({
      isEdit: false,
      viewPopUp: true,
      document: item,
      mode: 'goEdit'
    });
    this.simpleDialog.show();
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
              {this.state.showActions == false ? null :
                <div className="Project__num">
                  <div className="eps__actions">
                    <a className="editIcon" data-toggle="tooltip" title="Edit" onClick={() => this.EditDocument(item)}>
                      <img src={Edit} alt="Edit" />
                    </a>
                    <a className="plusIcon" data-toggle="tooltip" title="Add" onClick={() => this.AddDocument(item)}>
                      <img src={Plus} alt="Add" />
                    </a>
                    <a className="deleteIcon" data-toggle="tooltip" title="Delete" onClick={() => this.DeleteDocument(item.id)}>
                      <img src={Delete} alt="Delete" />
                    </a>
                    <a className="" data-toggle="tooltip" title="Assign" onClick={() => this.assignProject(item.id)}>
                      <img src={Assigne} alt="Assign" />
                    </a>
                  </div>
                </div>}
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

  closePopUp() {
    this.setState({
      viewPopUp: false
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

  saveTree() {
    this.setState({
      isLoading: true
    });
    let saveDocument = { ...this.state.document };
    saveDocument.parentId = this.state.IsFirstParent ? '' : this.state.parentId;
    dataservice.addObject("AddNewCostCodeTree", saveDocument).then(result => {
      toast.success(Resources["operationSuccess"][currentLanguage]);
      this.clear();
      let data = result
      let state = this.state;
      state['_' + saveDocument.id] = true;
      this.setState({
        trees: data,
        state,
        viewPopUp: false,
        isLoading: false,
        IsFirstParent: false,
      });
      this.simpleDialog.hide();
    }).catch(ex => {
      this.simpleDialog.hide();
      this.setState({ viewPopUp: false, isLoading: false, trees: this.state.trees });
      this.clear();
      toast.error(Resources["failError"][currentLanguage]);
    });
  }

  editTree = () => {
    this.setState({ isLoading: true });
    let saveDocument = { ...this.state.document };
    saveDocument.projectId = this.state.projectId;
    let state = this.state
    if (treeContainer != null) {
      treeContainer.forEach(item => {
        state[item.id] = item
      })
      this.setState({ state })
    }
    this.clear();
    dataservice.addObject("EditCostCodeTree", saveDocument).then(result => {
      toast.success(Resources["operationSuccess"][currentLanguage]);
      this.clear();
      let itemId = saveDocument.id
      let state = this.state
      state[itemId] = saveDocument
      this.setState({
        viewPopUp: false,
        state,
        isLoading: false
      });
      treeContainer = null
      this.simpleDialog.hide();
    }).catch(ex => {
      this.simpleDialog.hide();
      this.setState({ viewPopUp: false, isLoading: false, trees: this.state.trees });
      toast.error(Resources["failError"][currentLanguage]);
      this.clear();
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

  DeleteDocument(id) {
    this.setState({
      docId: id,
      showDeleteModal: true
    });
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

  viewModalForFirst = () => {
    this.setState({ mode: 'goAdd', viewPopUp: true, isEdit: true, IsFirstParent: true });
    this.clear();
    this.simpleDialog.show();
  }

  assignProject = (id) => {
    this.setState({
      costCodingTreeId: id
    });
    this.simpleAssignDialog.show();
  }

  assignCostCodingTreeByProject = () => {

    this.setState({
      isLoading: true
    });

    let obj = {
      projectId: this.state.selectedValue.value,
      costCodingTreeId: this.state.costCodingTreeId
    }

    dataservice.addObject("AddContractsCostCodingTreeProject", obj).then(result => {
      toast.success(Resources["operationSuccess"][currentLanguage]);
      this.setState({
        isLoading: false
      });
      this.simpleAssignDialog.hide();
    });
  }

  render() {
    return (
      <div>
        <div className="documents-stepper noTabs__document">
          {this.state.showActions == false ? null :
            <div className="tree__header">
              <h2 className="zero">{Resources.costCodingTree[currentLanguage]}</h2>
              <button className="primaryBtn-1 btn" onClick={this.viewModalForFirst.bind(this)}>
                {Resources["goAdd"][currentLanguage]}
              </button>
            </div>
          }
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
                        {this.state.showActions == false ? null :
                          <div className="Project__num">
                            <div className="eps__actions">
                              <a className="editIcon" data-toggle="tooltip" title="edit" onClick={() => this.EditDocument(item)}>
                                <img src={Edit} alt="Edit" />
                              </a>
                              <a className="plusIcon" data-toggle="tooltip" title="Add" onClick={() => this.AddDocument(item)}>
                                <img src={Plus} alt="Add" />
                              </a>
                              <a className="deleteIcon" data-toggle="tooltip" title="Delete" onClick={() => this.DeleteDocument(item.id)}>
                                <img src={Delete} alt="Delete" />
                              </a>
                              <a className="" data-toggle="tooltip" title="Assign" onClick={() => this.assignProject(item.id)}>
                                <img src={Assigne} alt="Assigne" />
                              </a>
                            </div>
                          </div>
                        }
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

        <SkyLight ref={ref => (this.simpleDialog = ref)} >
          <div className="ui modal largeModal ">
            <header className="costHeader">
              <h2 className="zero">
                {Resources[this.state.mode][currentLanguage]}
              </h2>
            </header>
            <Formik initialValues={{ ...this.state.document }} validationSchema={validationSchema}
              onSubmit={values => {
                if (this.state.isEdit === false) {
                  this.editTree();
                } else if (this.state.isEdit) {
                  this.saveTree();
                }
              }}>
              {({ errors, touched, handleBlur, handleChange, handleSubmit }) => (
                <Form className="dropWrapper proForm" onSubmit={handleSubmit}>
                  <div className="fillter-status fillter-item-c fullInputWidth ">
                    <label className="control-label">
                      {Resources.codeTitle[currentLanguage]}
                    </label>
                    <div className={"ui input inputDev fullInputWidth " + (errors.codeTreeTitle && touched.codeTreeTitle ? "has-error" : !errors.codeTreeTitle && touched.codeTreeTitle ? "has-success" : "")}>
                      <input name="codeTreeTitle" className="form-control fsadfsadsa" placeholder={Resources.codeTitle[currentLanguage]}
                        autoComplete="off" value={this.state.document.codeTreeTitle} onBlur={e => { handleBlur(e); handleChange(e); }} onChange={e => this.handleChange(e, "codeTreeTitle")} />
                      {errors.codeTreeTitle && touched.codeTreeTitle ? (<span className="glyphicon glyphicon-remove form-control-feedback spanError" />) : !errors.codeTreeTitle && touched.codeTreeTitle ? (<span className="glyphicon form-control-feedback glyphicon-ok" />) : null}
                      {errors.codeTreeTitle && touched.codeTreeTitle ? (<em className="pError">{errors.codeTreeTitle}</em>) : null}
                    </div>
                  </div>
                  <div className="fillter-status fillter-item-c fullInputWidth">
                    <label className="control-label">
                      {Resources.budgetThisPeriod[currentLanguage]}
                    </label>
                    <div className={"ui input inputDev " + (errors.budgetThisPeriod && touched.budgetThisPeriod ? "has-error" : !errors.budgetThisPeriod && touched.budgetThisPeriod ? "has-success" : "")}>
                      <input name="budgetThisPeriod" className="form-control fsadfsadsa"
                        placeholder={Resources.budgetThisPeriod[currentLanguage]}
                        autoComplete="off" value={this.state.document.budgetThisPeriod}
                        onBlur={e => { handleBlur(e); handleChange(e); }}
                        onChange={e => this.handleChange(e, "budgetThisPeriod")} />
                      {errors.budgetThisPeriod && touched.budgetThisPeriod ? (<span className="glyphicon glyphicon-remove form-control-feedback spanError" />) : !errors.budgetThisPeriod && touched.budgetThisPeriod ? (<span className="glyphicon form-control-feedback glyphicon-ok" />) : null}
                      {errors.budgetThisPeriod && touched.budgetThisPeriod ? (<em className="pError">{errors.budgetThisPeriod}</em>) : null}
                    </div>
                  </div>
                  <div className="fillter-status fillter-item-c fullInputWidth">
                    <label className="control-label">
                      {Resources.budgetAtComplete[currentLanguage]}
                    </label>
                    <div className={"ui input inputDev " + (errors.budgetAtComplete && touched.budgetAtComplete ? "has-error" : !errors.budgetAtComplete && touched.budgetAtComplete ? "has-success" : "")}>
                      <input name="budgetAtComplete" className="form-control fsadfsadsa"
                        placeholder={Resources.budgetAtComplete[currentLanguage]}
                        autoComplete="off" value={this.state.document.budgetAtComplete}
                        onBlur={e => { handleBlur(e); handleChange(e); }}
                        onChange={e => this.handleChange(e, "budgetAtComplete")} />
                      {errors.budgetAtComplete && touched.budgetAtComplete ? (<span className="glyphicon glyphicon-remove form-control-feedback spanError" />) : !errors.budgetAtComplete && touched.budgetAtComplete ? (<span className="glyphicon form-control-feedback glyphicon-ok" />) : null}
                      {errors.budgetAtComplete && touched.budgetAtComplete ? (<em className="pError"> {errors.budgetAtComplete} </em>) : null}
                    </div>
                  </div>
                  <div className="fillter-status fillter-item-c fullInputWidth">
                    <label className="control-label">
                      {Resources.originalBudget[currentLanguage]}
                    </label>
                    <div className={"ui input inputDev " + (errors.originalBudget && touched.originalBudget ? "has-error" : !errors.originalBudget && touched.originalBudget ? "has-success" : "")}>
                      <input name="originalBudget" className="form-control fsadfsadsa"
                        placeholder={Resources.originalBudget[currentLanguage]}
                        autoComplete="off" value={this.state.document.originalBudget}
                        onBlur={e => { handleBlur(e); handleChange(e); }}
                        onChange={e => this.handleChange(e, "originalBudget")} />
                      {errors.originalBudget && touched.originalBudget ? (<span className="glyphicon glyphicon-remove form-control-feedback spanError" />) : !errors.originalBudget && touched.originalBudget ? (<span className="glyphicon form-control-feedback glyphicon-ok" />) : null}
                      {errors.originalBudget && touched.originalBudget ? (<em className="pError">{errors.originalBudget}</em>) : null}
                    </div>
                  </div>
                  <div className="fillter-status fillter-item-c fullInputWidth">
                    <label className="control-label">
                      {Resources.costForcast[currentLanguage]}
                    </label>
                    <div className={"ui input inputDev " + (errors.costForcast && touched.costForcast ? "has-error" : !errors.costForcast && touched.costForcast ? "has-success" : "")}>
                      <input name="costForcast" className="form-control fsadfsadsa" placeholder={Resources.costForcast[currentLanguage]}
                        autoComplete="off" value={this.state.document.costForcast}
                        onBlur={e => { handleBlur(e); handleChange(e); }}
                        onChange={e => this.handleChange(e, "costForcast")}
                      />
                      {errors.costForcast && touched.costForcast ? (<span className="glyphicon glyphicon-remove form-control-feedback spanError" />) : !errors.costForcast && touched.costForcast ? (<span className="glyphicon form-control-feedback glyphicon-ok" />) : null}
                      {errors.costForcast && touched.costForcast ? (<em className="pError">{errors.costForcast}</em>) : null}
                    </div>
                  </div>
                  <div className="fullWidthWrapper">
                    {this.state.isLoading === false ? (
                      <button className="primaryBtn-1 btn middle__btn" type="submit">
                        {Resources["save"][currentLanguage]}
                      </button>
                    ) : (
                        <button className="primaryBtn-1 btn middle__btn disabled">
                          <div className="spinner">
                            <div className="bounce1" />
                            <div className="bounce2" />
                            <div className="bounce3" />
                          </div>
                        </button>
                      )}
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </SkyLight>

        <SkyLight ref={ref => (this.simpleAssignDialog = ref)}>
          <div className="ui modal largeModal ">
            <header className="costHeader">
              <h2 className="zero">
                {Resources[this.state.mode][currentLanguage]}
              </h2>
            </header>
            <Formik initialValues={{ projectId: '' }}
              validationSchema={validationSchemaAssignProject}
              onSubmit={values => {
                this.assignCostCodingTreeByProject()
              }}>
              {({ handleSubmit, setFieldValue, setFieldTouched, errors, touched }) => (
                <Form className="dropWrapper proForm" onSubmit={handleSubmit}>
                  <div className="letterFullWidth ">
                    <Dropdown title="projectName"
                      data={this.state.projects}
                      selectedValue={this.state.selectedValue}
                      handleChange={event =>
                        this.setState({ selectedValue: event })
                      }
                      onChange={setFieldValue}
                      onBlur={setFieldTouched}
                      error={errors.projectId}
                      touched={touched.projectId}
                      name="projectId" id="projectId" />
                  </div>
                  <div className="fullWidthWrapper">
                    {this.state.isLoading === false ? (
                      <button className="primaryBtn-1 btn middle__btn" type="submit">
                        {Resources["save"][currentLanguage]}
                      </button>
                    ) : (
                        <button className="primaryBtn-1 btn middle__btn disabled">
                          <div className="spinner">
                            <div className="bounce1" />
                            <div className="bounce2" />
                            <div className="bounce3" />
                          </div>
                        </button>
                      )}
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </SkyLight>

        {this.state.showDeleteModal == true ? (
          <ConfirmationModal
            title={Resources["smartDeleteMessage"][currentLanguage].content}
            buttonName="delete"
            closed={this.onCloseModal}
            showDeleteModal={this.state.showDeleteModal}
            clickHandlerCancel={this.clickHandlerCancelMain}
            clickHandlerContinue={this.clickHandlerContinueMain.bind(this)} />
        ) : null}
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
)(withRouter(CostCodingTreeAddEdit));
