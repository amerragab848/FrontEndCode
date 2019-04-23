import React, { Component, Fragment } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import dataservice from "../../Dataservice";
import Resources from "../../resources.json";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Config from "../../Services/Config.js";
import * as communicationActions from "../../store/actions/communication";
import Edit from "../../Styles/images/epsActions/edit.png";
import Plus from "../../Styles/images/epsActions/plus.png";
import Delete from "../../Styles/images/epsActions/delete.png";
import Rodal from "../../Styles/js/rodal";
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import LoadingSection from '../../Componants/publicComponants/LoadingSection';
import _ from "lodash";
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument'

import { toast } from "react-toastify";
import visibility from "material-ui/svg-icons/action/visibility";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const validationSchema = Yup.object().shape({
  codeTreeTitle: Yup.string()
    .required(Resources["subjectRequired"][currentLanguage])
    .max(450, Resources["maxLength"][currentLanguage]),
  budgetThisPeriod: Yup.number().required(
    Resources["budgetThisPeriodSelection"][currentLanguage]
  ),
  budgetAtComplete: Yup.number().required(
    Resources["budgetAtCompleteSelection"][currentLanguage]
  ),
  originalBudget: Yup.number().required(
    Resources["originalBudgetRequire"][currentLanguage]
  ),
  costForcast: Yup.number().required(
    Resources["costForcastSelection"][currentLanguage]
  )
});

class CostCodingTreeAddEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
      docId: ""
    };

    if (!Config.IsAllow(134) || !Config.IsAllow(135) || !Config.IsAllow(137)) {
      toast.success(Resources["missingPermissions"][currentLanguage]);

      this.props.history.push("/DashBoard/" + this.state.projectId);
    }

    this.printChild = this.printChild.bind(this);
  }

  componentDidMount() {
    var links = document.querySelectorAll(
      ".noTabs__document .doc-container .linebylineInput"
    );

    for (var i = 0; i < links.length; i++) {
      if ((i + 1) % 2 == 0) {
        links[i].classList.add("even");
      } else {
        links[i].classList.add("odd");
      }
    }
  }

  componentWillReceiveProps(nextProps) {

    if (nextProps.projectId !== this.props.projectId) {

      dataservice.GetDataGrid("GetCostTreeByProjectId?projectId=" + nextProps.projectId).then(result => {
        this.setState({
          trees: result
        });

      });

    }
  }

  componentWillMount() {
    let treeDocument = {
      codeTreeTitle: "",
      budgetThisPeriod: "",
      budgetAtComplete: "",
      originalBudget: "",
      costForcast: "",
      parentId: ""
    };
    this.props.actions.documentForAdding();

    dataservice.GetDataGrid("GetCostTreeByProjectId?projectId=" + this.state.projectId).then(result => {
      this.setState({
        trees: result,
        document: treeDocument
      });
    });
  }

  AddDocument(item) {
    this.setState({
      parentId: item.id,
      isEdit: true,
      viewPopUp: true,
      objDocument: item
    });
  }

  EditDocument(item) {
    this.setState({
      isEdit: false,
      viewPopUp: true,
      document: item
    });
  }

  search(id, trees, updateTrees, parentId) {

    trees.map(item => {
      if (id == item.id) {
        item.collapse = !item.collapse;
      } else {
        //item.collapse = item.id != parentId ? true : item.collapse; 
      }
      updateTrees.push(item);
      if (item.trees.length > 0) {
        this.search(id, item.trees, updateTrees, parentId);
      }
    });
    return updateTrees;
  };

  printChild(children) {
    return (
      children.map((item, i) => {
        return (
          <Fragment>
            <div className={"epsTitle" + (item.collapse === false ? ' active' : ' ')} key={item.id} onClick={() => this.viewChild(item)} >
              <div className="listTitle">

                <span className="dropArrow" style={{ visibility: (item.trees.length > 0 ? '' : 'hidden') }}>
                  <i className="dropdown icon" />
                </span>

                <span className="accordionTitle">{item.codeTreeTitle}</span>
              </div>
              <div className="Project__num">
                <div className="eps__actions">
                  <a className="editIcon" onClick={() => this.EditDocument(item)}>
                    <img src={Edit} alt="Edit" />
                  </a>
                  <a className="plusIcon" onClick={() => this.AddDocument(item)}>
                    <img src={Plus} alt="Add" />
                  </a>
                  <a className="deleteIcon" onClick={() => this.DeleteDocument(item.id)}>
                    <img
                      src={Delete}
                      alt="Delete"
                    />
                  </a>
                </div>
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

    this.setState({
      isLoading: true
    });

    let trees = [...this.state.trees];

    this.search(item.id, trees, [], item.parentId);
    this.setState({
      trees,
      isLoading: false
    });
    console.log(item.trees);
  }

  closePopUp() {
    this.state({
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
    saveDocument.parentId = this.state.parentId;
    saveDocument.projectId = this.state.projectId;

    dataservice.addObject("AddcostCodeTree", saveDocument).then(result => {
      toast.success(Resources["operationSuccess"][currentLanguage]);

      let treeDocument = {
        codeTreeTitle: "",
        budgetThisPeriod: "",
        budgetAtComplete: "",
        originalBudget: "",
        costForcast: "",
        parentId: ""
      };

      this.setState({
        viewPopUp: false,
        document: treeDocument,
        isLoading: false
      });
    }).catch(ex => {
      this.setState({ viewPopUp: false });

      toast.error(Resources["failError"][currentLanguage]);
    });
  }

  editTree() {
    this.setState({
      isLoading: true
    });
    let saveDocument = { ...this.state.document };
    saveDocument.projectId = this.state.projectId;

    dataservice
      .addObject("EditCostCodeTree", saveDocument)
      .then(result => {
        toast.success(Resources["operationSuccess"][currentLanguage]);

        let treeDocument = {
          codeTreeTitle: "",
          budgetThisPeriod: "",
          budgetAtComplete: "",
          originalBudget: "",
          costForcast: "",
          parentId: ""
        };

        this.setState({
          viewPopUp: false,
          document: treeDocument,
          isLoading: false
        });
      })
      .catch(ex => {
        this.setState({ viewPopUp: false });

        toast.error(Resources["failError"][currentLanguage]);
      });
  }

  DeleteDocument(id) {
    this.setState({
      docId: id,
      showDeleteModal: true
    });
  }

  clickHandlerContinueMain() {
    dataservice.addObject("DeleteCostCodeTree", this.state.docId).then(result => {

      this.setState({
        showDeleteModal: false
      });

      toast.success(Resources["operationSuccess"][currentLanguage]);

    }).catch(ex => {
      toast.success(Resources["operationSuccess"][currentLanguage]);
    });
  }

  render() {

    return (
      <div className="mainContainer">
        <div className="documents-stepper noTabs__document">
        <HeaderDocument projectName={''} docTitle={Resources.costCodingTree[currentLanguage]} moduleTitle={Resources['contracts'][currentLanguage]} />
          <div className="Eps__list">
            {
              this.state.trees.map((item, i) => {
                return (
                  <Fragment>
                    <div className="epsTitle active" key={item.id}>
                      <div className="listTitle">
                        <span className="dropArrow">
                          <i className="dropdown icon" />
                        </span>
                        <span className="accordionTitle">{item.codeTreeTitle}</span>
                      </div>
                      <div className="Project__num">
                        <div className="eps__actions">
                          <a className="editIcon" onClick={() => this.EditDocument(item)}>
                            <img src={Edit} alt="Edit" />
                          </a>
                          <a className="plusIcon" onClick={() => this.AddDocument(item)}>
                            <img src={Plus} alt="Add" />
                          </a>
                          <a className="deleteIcon" onClick={() => this.DeleteDocument(item.id)}>
                            <img src={Delete} alt="Delete" />
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="epsContent">
                      {item.trees.length > 0 ? this.printChild(item.trees) : null}
                    </div>
                  </Fragment>
                )
              })
            }
          </div>
        </div>
        {this.state.viewPopUp ? (
          <Fragment>
            <Rodal
              visible={this.state.viewPopUp}
              onClose={this.closePopUp.bind(this)}
            >
              <div className="ui modal largeModal ">
                <Formik
                  initialValues={{ ...this.state.document }}
                  validationSchema={validationSchema}
                  onSubmit={values => {
                    if (this.state.isEdit === false) {
                      this.editTree();
                    } else if (this.state.isEdit) {
                      this.saveTree();
                    }
                  }}
                >
                  {({
                    errors,
                    touched,
                    handleBlur,
                    handleChange,
                    values,
                    handleSubmit,
                    setFieldTouched,
                    setFieldValue
                  }) => (
                      <Form className="dropWrapper" onSubmit={handleSubmit}>
                        <div className="fullWidthWrapper textLeft">
                          <header>
                            <h2 className="zero">
                              {Resources["costCodingTree"][currentLanguage]}
                            </h2>
                          </header>
                        </div>
                        <div className="fillter-status fillter-item-c">
                          <label className="control-label">
                            {Resources.codeTitle[currentLanguage]}
                          </label>
                          <div
                            className={
                              "ui input inputDev fillter-item-c " +
                              (errors.codeTreeTitle && touched.codeTreeTitle
                                ? "has-error"
                                : !errors.codeTreeTitle && touched.codeTreeTitle
                                  ? "has-success"
                                  : "")
                            }
                          >
                            <input
                              name="codeTreeTitle"
                              className="form-control fsadfsadsa"
                              placeholder={Resources.codeTitle[currentLanguage]}
                              autoComplete="off"
                              value={this.state.document.codeTreeTitle}
                              onBlur={e => {
                                handleBlur(e);
                                handleChange(e);
                              }}
                              onChange={e =>
                                this.handleChange(e, "codeTreeTitle")
                              }
                            />
                            {errors.codeTreeTitle && touched.codeTreeTitle ? (
                              <span className="glyphicon glyphicon-remove form-control-feedback spanError" />
                            ) : !errors.codeTreeTitle && touched.codeTreeTitle ? (
                              <span className="glyphicon form-control-feedback glyphicon-ok" />
                            ) : null}
                            {errors.codeTreeTitle && touched.codeTreeTitle ? (
                              <em className="pError">{errors.codeTreeTitle}</em>
                            ) : null}
                          </div>
                        </div>
                        <div className="fillter-status fillter-item-c">
                          <label className="control-label">
                            {Resources.budgetThisPeriod[currentLanguage]}
                          </label>
                          <div
                            className={
                              "ui input inputDev fillter-item-c " +
                              (errors.budgetThisPeriod && touched.budgetThisPeriod
                                ? "has-error"
                                : !errors.budgetThisPeriod &&
                                  touched.budgetThisPeriod
                                  ? "has-success"
                                  : "")
                            }
                          >
                            <input
                              name="budgetThisPeriod"
                              className="form-control fsadfsadsa"
                              placeholder={
                                Resources.budgetThisPeriod[currentLanguage]
                              }
                              autoComplete="off"
                              value={this.state.document.budgetThisPeriod}
                              onBlur={e => {
                                handleBlur(e);
                                handleChange(e);
                              }}
                              onChange={e =>
                                this.handleChange(e, "budgetThisPeriod")
                              }
                            />
                            {errors.budgetThisPeriod &&
                              touched.budgetThisPeriod ? (
                                <span className="glyphicon glyphicon-remove form-control-feedback spanError" />
                              ) : !errors.budgetThisPeriod &&
                                touched.budgetThisPeriod ? (
                                  <span className="glyphicon form-control-feedback glyphicon-ok" />
                                ) : null}
                            {errors.budgetThisPeriod &&
                              touched.budgetThisPeriod ? (
                                <em className="pError">
                                  {errors.budgetThisPeriod}
                                </em>
                              ) : null}
                          </div>
                        </div>
                        <div className="fillter-status fillter-item-c">
                          <label className="control-label">
                            {Resources.budgetAtComplete[currentLanguage]}
                          </label>
                          <div
                            className={
                              "ui input inputDev fillter-item-c " +
                              (errors.budgetAtComplete && touched.budgetAtComplete
                                ? "has-error"
                                : !errors.budgetAtComplete &&
                                  touched.budgetAtComplete
                                  ? "has-success"
                                  : "")
                            }
                          >
                            <input
                              name="budgetAtComplete"
                              className="form-control fsadfsadsa"
                              placeholder={
                                Resources.budgetAtComplete[currentLanguage]
                              }
                              autoComplete="off"
                              value={this.state.document.budgetAtComplete}
                              onBlur={e => {
                                handleBlur(e);
                                handleChange(e);
                              }}
                              onChange={e =>
                                this.handleChange(e, "budgetAtComplete")
                              }
                            />
                            {errors.budgetAtComplete &&
                              touched.budgetAtComplete ? (
                                <span className="glyphicon glyphicon-remove form-control-feedback spanError" />
                              ) : !errors.budgetAtComplete &&
                                touched.budgetAtComplete ? (
                                  <span className="glyphicon form-control-feedback glyphicon-ok" />
                                ) : null}
                            {errors.budgetAtComplete &&
                              touched.budgetAtComplete ? (
                                <em className="pError">
                                  {errors.budgetAtComplete}
                                </em>
                              ) : null}
                          </div>
                        </div>
                        <div className="fillter-status fillter-item-c">
                          <label className="control-label">
                            {Resources.originalBudget[currentLanguage]}
                          </label>
                          <div
                            className={
                              "ui input inputDev fillter-item-c " +
                              (errors.originalBudget && touched.originalBudget
                                ? "has-error"
                                : !errors.originalBudget && touched.originalBudget
                                  ? "has-success"
                                  : "")
                            }
                          >
                            <input
                              name="originalBudget"
                              className="form-control fsadfsadsa"
                              placeholder={
                                Resources.originalBudget[currentLanguage]
                              }
                              autoComplete="off"
                              value={this.state.document.originalBudget}
                              onBlur={e => {
                                handleBlur(e);
                                handleChange(e);
                              }}
                              onChange={e =>
                                this.handleChange(e, "originalBudget")
                              }
                            />
                            {errors.originalBudget && touched.originalBudget ? (
                              <span className="glyphicon glyphicon-remove form-control-feedback spanError" />
                            ) : !errors.originalBudget &&
                              touched.originalBudget ? (
                                  <span className="glyphicon form-control-feedback glyphicon-ok" />
                                ) : null}
                            {errors.originalBudget && touched.originalBudget ? (
                              <em className="pError">{errors.originalBudget}</em>
                            ) : null}
                          </div>
                        </div>
                        <div className="fillter-status fillter-item-c">
                          <label className="control-label">
                            {Resources.costForcast[currentLanguage]}
                          </label>
                          <div
                            className={
                              "ui input inputDev fillter-item-c " +
                              (errors.costForcast && touched.costForcast
                                ? "has-error"
                                : !errors.costForcast && touched.costForcast
                                  ? "has-success"
                                  : "")
                            }
                          >
                            <input
                              name="costForcast"
                              className="form-control fsadfsadsa"
                              placeholder={Resources.costForcast[currentLanguage]}
                              autoComplete="off"
                              value={this.state.document.costForcast}
                              onBlur={e => {
                                handleBlur(e);
                                handleChange(e);
                              }}
                              onChange={e => this.handleChange(e, "costForcast")}
                            />
                            {errors.costForcast && touched.costForcast ? (
                              <span className="glyphicon glyphicon-remove form-control-feedback spanError" />
                            ) : !errors.costForcast && touched.costForcast ? (
                              <span className="glyphicon form-control-feedback glyphicon-ok" />
                            ) : null}
                            {errors.costForcast && touched.costForcast ? (
                              <em className="pError">{errors.costForcast}</em>
                            ) : null}
                          </div>
                        </div>
                        <div className="fullWidthWrapper">
                          {this.state.isLoading === false ? (
                            <button
                              className="primaryBtn-1 btn middle__btn"
                              type="submit"
                            >
                              {Resources["save"][currentLanguage]}
                            </button>
                          ) : (
                              <button className="primaryBtn-1 btn disabled">
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
            </Rodal>
          </Fragment>
        ) : null}

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
