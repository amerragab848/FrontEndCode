import React, { Component, Fragment } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import dataservice from "../../Dataservice";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import UploadAttachment from "../../Componants/OptionsPanels/UploadAttachment";
import ViewAttachment from "../../Componants/OptionsPanels/ViewAttachmments";
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import Resources from "../../resources.json";
import ModernDatepicker from "../../Componants/OptionsPanels/DatePicker";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Config from "../../Services/Config.js";
import CryptoJS from "crypto-js";
import moment from "moment";
import SkyLight from "react-skylight";
import * as communicationActions from "../../store/actions/communication";
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument'
import DocumentActions from '../../Componants/OptionsPanels/DocumentActions'
import CompanyDropdown from '../../Componants/publicComponants/CompanyDropdown'
import ContactDropdown from '../../Componants/publicComponants/ContactDropdown'
import { toast } from "react-toastify";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const validationSchema = Yup.object().shape({
  subject: Yup.string().required(Resources["subjectRequired"][currentLanguage]),
  fromContactId: Yup.string().required(Resources["fromContactRequired"][currentLanguage]),
  bicContactId: Yup.string().required(Resources["toContactRequired"][currentLanguage])
});

const validationSchemaForCycle = Yup.object().shape({
  subject: Yup.string().required(Resources["subjectRequired"][currentLanguage]),
  bicContactId: Yup.string().required(Resources["toContactRequired"][currentLanguage]).nullable(true)
});

const cycleDocument = {
  // fieldCycle
  projectId: projectId,
  parentId: "",
  arrange: "1",
  fromCompanyId: null,
  fromContactId: null,
  bicCompanyId: null,
  bicContactId: null,
  subject: "",
  description: null,
  docDate: moment(),
  startDate: moment(),
  finishDate: moment(),
  priorityId: null,
  status: "true",
  estimatedTime: "1",
  originalEstimatedTime: "",
  parentEstimateTime: null,
  suspeneded: "true",
  isTransfer: "false",
  taskId: null,
  id: 0
}

let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let perviousRoute = '';
let arrange = 0;

const _ = require("lodash");

class ProjectTaskAddEdit extends Component {
  constructor(props) {

    super(props);

    const query = new URLSearchParams(this.props.location.search);

    let index = 0;

    for (let param of query.entries()) {
      if (index == 0) {
        try {
          let obj = JSON.parse(CryptoJS.enc.Base64.parse(param[1]).toString(CryptoJS.enc.Utf8));

          docId = obj.docId;
          projectId = obj.projectId;
          projectName = obj.projectName;
          isApproveMode = obj.isApproveMode;
          docApprovalId = obj.docApprovalId;
          perviousRoute = obj.perviousRoute;
          arrange = obj.arrange;
        } catch {
          this.props.history.goBack();
        }
      }
      index++;
    }

    this.state = {
      isViewMode: false,
      isApproveMode: isApproveMode,
      isView: false,
      docId: docId,
      docTypeId: 17,
      projectId: projectId,
      docApprovalId: docApprovalId,
      perviousRoute: perviousRoute,
      arrange: arrange,
      document: this.props.document ? Object.assign({}, this.props.document) : {},
      cycleDocument: null,
      companies: [],
      ToContacts: [],
      fromContacts: [],
      priority: [],
      permission: [
        { name: "sendByEmail", code: 363 },
        { name: "sendByInbox", code: 362 },
        { name: "sendTask", code: 1 },
        { name: "distributionList", code: 953 },
        { name: "createTransmittal", code: 3039 },
        { name: "sendToWorkFlow", code: 705 },
        { name: "viewAttachments", code: 3292 },
        { name: "deleteAttachments", code: 868 }
      ],
      selectedFromCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
      selectedBicCompany: { label: Resources.toCompanyRequired[currentLanguage], value: "0" },
      selectedFromContact: { label: Resources.fromContactRequired[currentLanguage], value: "0" },
      selectedToContact: { label: Resources.toContactRequired[currentLanguage], value: "0" },
      selectedPriority: { label: Resources.prioritySelect[currentLanguage], value: "0" },
      selectedBicCompanyCycle: { label: Resources.toCompanyRequired[currentLanguage], value: "0" },
      selectedToContactCycle: { label: Resources.toContactRequired[currentLanguage], value: "0" },
      selectedPriorityCycle: { label: Resources.prioritySelect[currentLanguage], value: "0" },
      viewModal: false,
      isLoading: false
    };

    if (!Config.IsAllow(357) && !Config.IsAllow(358) && !Config.IsAllow(360)) {
      toast.warn(Resources["missingPermissions"][currentLanguage]);
      this.props.history.push(
        this.state.perviousRoute
      );
    }
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
    this.checkDocumentIsView();
  }

  componentWillReceiveProps(nextProps, prevProps) {

    if (nextProps.document.id) {
      let doc = nextProps.document
      doc.docDate = doc.docDate === null ? moment().format('YYYY-MM-DD') : moment(doc.docDate).format('YYYY-MM-DD')
      doc.startDate = doc.startDate === null ? moment().format('YYYY-MM-DD') : moment(doc.startDate).format('YYYY-MM-DD')
      doc.finishDate = doc.finishDate === null ? moment().format('YYYY-MM-DD') : moment(doc.finishDate).format('YYYY-MM-DD')

      this.setState({
        document: doc,
        hasWorkflow: nextProps.hasWorkflow
      });

      this.fillDropDowns(nextProps.document.id > 0 ? true : false);

      this.checkDocumentIsView();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.hasWorkflow !== prevProps.hasWorkflow) {
      this.checkDocumentIsView();
    }
  }

  checkDocumentIsView() {
    if (this.props.changeStatus === true) {
      if (!Config.IsAllow(358)) {
        this.setState({ isViewMode: true });
      }
      if (this.state.isApproveMode != true && Config.IsAllow(358)) {
        if (this.props.hasWorkflow == false && Config.IsAllow(358)) {
          if (this.props.document.status == true && Config.IsAllow(358)) {
            this.setState({ isViewMode: false });
          } else {
            this.setState({ isViewMode: true });
          }
        } else {
          this.setState({ isViewMode: true });
        }
      }
    } else {
      this.setState({ isViewMode: false });
    }
  }

  componentWillMount() {

    if (this.state.docId > 0) {

      let url = "GetTaskForEdit?id=" + this.state.docId;

      this.props.actions.documentForEdit(url);

      this.setState({
        cycleDocument: cycleDocument
      });

    } else {
      const taskDocument = {
        //field
        projectId: projectId,
        parentId: "",
        arrange: "1",
        fromCompanyId: null,
        fromContactId: null,
        bicCompanyId: null,
        bicContactId: null,
        subject: "",
        description: null,
        docDate: moment(),
        startDate: moment(),
        finishDate: moment(),
        priorityId: null,
        status: "true",
        estimatedTime: "1",
        originalEstimatedTime: "",
        parentEstimateTime: null,
        suspeneded: "true",
        isTransfer: "false",
        taskId: null,
        id: 0
      };

      this.setState({ document: taskDocument });
      this.fillDropDowns(false);
    }
    this.props.actions.documentForAdding();
  }

  fillSubDropDownInEdit(url, param, value, subField, subSelectedValue, subDatasource) {

    let action = url + "?" + param + "=" + value;

    dataservice.GetDataList(action, "contactName", "id").then(result => {

      if (this.props.changeStatus === true) {

        let toSubField = this.state.document[subField];

        let targetFieldSelected = _.find(result, function (i) {
          return i.value == toSubField;
        });

        this.setState({
          [subSelectedValue]: targetFieldSelected,
          [subDatasource]: result
        });
      }
    });
  }

  fillDropDowns(isEdit) {
    //maxArrange
    dataservice.GetNextArrangeMainDocument("GetNextArrangeMainDoc?projectId=" + this.state.projectId + "&docType=" + this.state.docTypeId + "&companyId=undefined&contactId=undefined").then(res => {
      if (!isEdit) {

        let updated_document = this.state.document;

        updated_document.arrange = res;

        this.setState({
          document: updated_document
        });
      }
    });

    //from Companies
    dataservice.GetDataList("GetProjectProjectsCompaniesForList?projectId=" + projectId, "companyName", "companyId").then(result => {
      if (isEdit) {

        let companyId = this.props.document.fromCompanyId;

        if (companyId) {
          this.setState({
            selectedFromCompany: { label: this.props.document.fromCompanyName, value: companyId }
          });
          this.fillSubDropDownInEdit("GetContactsByCompanyId", "companyId", companyId, "fromContactId", "selectedFromContact", "fromContacts");
        }

        let bicCompanyId = this.props.document.bicCompanyId;

        if (bicCompanyId) {
          this.setState({
            selectedBicCompany: { label: this.props.document.bicCompanyName, value: bicCompanyId }
          });

          this.fillSubDropDownInEdit("GetContactsByCompanyId", "companyId", bicCompanyId, "bicContactId", "selectedToContact", "ToContacts");
        }
      }
      this.setState({
        companies: [...result]
      });
    });

    //Priority
    dataservice.GetDataList("GetaccountsDefaultListForList?listType=priority", "title", "id").then(result => {

      if (isEdit) {

        let priority = this.props.document.priorityId;

        if (priority) {

          let priorityName = result.find(i => i.value === parseInt(priority));

          this.setState({
            selectedPriority: { label: priorityName.label, value: this.props.document.priorityId }
          });
        }
      }
      this.setState({
        priority: [...result]
      });
    });
  }

  handleChange(e, field) {

    let original_document = { ...this.state.document };

    if (field === "estimatedTime") {
      original_document.originalEstimatedTime = e.target.value;
    }

    original_document[field] = e.target.value;

    this.setState({
      document: original_document
    });
  }

  handleChangeCycle(e, field) {

    let original_document = { ...this.state.cycleDocument };

    if (field === "estimatedTime") {
      original_document.originalEstimatedTime = e.target.value;
    }

    original_document[field] = e.target.value;

    this.setState({
      cycleDocument: original_document
    });
  }

  handleChangeDate(e, field) {

    let original_document = { ...this.state.document };

    let updated_document = {};

    updated_document[field] = e;

    updated_document = Object.assign(original_document, updated_document);

    this.setState({
      document: updated_document
    });
  }

  handleChangeDateCycle(e, field) {

    let original_document = { ...this.state.cycleDocument };

    let updated_document = {};

    updated_document[field] = e;

    updated_document = Object.assign(original_document, updated_document);

    this.setState({
      cycleDocument: updated_document
    });
  }

  handleChangeDropDown(event, field, isSubscrib, targetState, url, param, selectedValue, subDatasource) {

    if (event == null) return;

    let original_document = { ...this.state.document };

    let updated_document = {};

    updated_document[field] = event.value;

    updated_document = Object.assign(original_document, updated_document);

    this.setState({
      document: updated_document,
      [selectedValue]: event
    });

    if (isSubscrib) {
      let action = url + "?" + param + "=" + event.value;
      dataservice.GetDataList(action, "contactName", "id").then(result => {
        this.setState({
          [targetState]: result
        });
      });
    }
  }

  handleChangeDropDownCycle(event, field, isSubscrib, targetState, url, param, selectedValue, subDatasource) {

    if (event == null) return;

    let original_document = { ...this.state.cycleDocument };

    let updated_document = {};

    updated_document[field] = event.value;

    updated_document = Object.assign(original_document, updated_document);

    this.setState({
      cycleDocument: updated_document,
      [selectedValue]: event
    });

    if (isSubscrib) {
      let action = url + "?" + param + "=" + event.value;
      dataservice.GetDataList(action, "contactName", "id").then(result => {
        this.setState({
          [targetState]: result
        });
      });
    }
  }

  editTask(event) {
    this.setState({ isLoading: true });

    let saveDocument = { ...this.state.document };

    saveDocument.docDate = moment(saveDocument.docDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");

    saveDocument.startDate = moment(saveDocument.startDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");

    saveDocument.finishDate = moment(saveDocument.finishDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");

    dataservice.addObject("EditTask", saveDocument).then(result => {
      this.setState({
        isLoading: true
      });

      toast.success(Resources["operationSuccess"][currentLanguage]);
      if (this.state.isApproveMode === false) {
        this.props.history.push(
          this.state.perviousRoute
        );
      }
    });
  }

  saveTask(event) {

    let saveDocument = { ...this.state.document };

    saveDocument.docDate = moment(saveDocument.docDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");

    saveDocument.startDate = moment(saveDocument.startDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");

    saveDocument.finishDate = moment(saveDocument.finishDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");

    if (saveDocument.finishDate >= saveDocument.startDate) {

      dataservice.addObject("addTask", saveDocument).then(result => {
        this.setState({
          docId: result
        });

        toast.success(Resources["operationSuccess"][currentLanguage]);

      }).catch(ex => {
        this.setState({
          isLoading: false
        });
        toast.warning(Resources["failError"][currentLanguage]);
      });
    } else {
      toast.warning("Finish Date Must Be Greater Than Start Date");
    }
  }

  saveAndExit(event) {
    this.props.history.push("/ProjectTasks/" + this.state.projectId);
  }

  showBtnsSaving() {

    let btn = null;

    if (this.state.docId === 0) {
      btn = (<button className="primaryBtn-1 btn meduimBtn" type="submit">
        {Resources.save[currentLanguage]}
      </button>);
    } else if (this.state.docId > 0 && this.props.changeStatus === false) {
      btn = (<button className="primaryBtn-1 btn mediumBtn" type="submit">
        {Resources.saveAndExit[currentLanguage]}
      </button>);
    }

    return btn;
  }

  viewAttachments() {
    return this.state.docId > 0 ? (
      Config.IsAllow(3292) === true ? (
        <ViewAttachment isApproveMode={this.state.isViewMode} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} deleteAttachments={868} />
      ) : null
    ) : null;
  }

  showOptionPanel = () => {
    this.props.actions.showOptionPanel(true);
  }

  viewCycle() {

    //maxArrange
    dataservice.GetNextArrangeMainDocument("GetNextArrangeMainDoc?projectId=" + this.state.projectId + "&docType=" + this.state.docTypeId + "&companyId=undefined&contactId=undefined").then(res => {

      let updated_document = cycleDocument;

      updated_document.arrange = res;

      this.setState({
        cycleDocument: updated_document,
        viewModal: true,
        showModal: false,
        selectedBicCompanyCycle: { label: Resources.toCompanyRequired[currentLanguage], value: "0" },
        selectedToContactCycle: { label: Resources.toContactRequired[currentLanguage], value: "0" },
        selectedPriorityCycle: { label: Resources.prioritySelect[currentLanguage], value: "0" }
      });

      this.simpleDialog.show();
    });
  }

  addNewCycle(event) {

    let saveDocument = { ...this.state.cycleDocument };

    saveDocument.docDate = moment(saveDocument.docDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");

    saveDocument.startDate = moment(saveDocument.startDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");

    saveDocument.finishDate = moment(saveDocument.finishDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");

    if (saveDocument.finishDate >= saveDocument.startDate) {

      this.setState({
        isLoading: true
      });

      dataservice.addObject("AddTaskCycles", saveDocument).then(result => {
        this.setState({
          viewModal: false,
          isLoading: false
        });

        toast.success(Resources["operationSuccess"][currentLanguage]);

      }).catch(ex => {
        this.setState({
          isLoading: false,
          viewModal: false
        });
        toast.warning(Resources["failError"][currentLanguage]);
      });
    } else {
      toast.warning("Finish Date Must Be Greater Than Start Date");
    }
  }

  componentWillUnmount() {
    this.props.actions.clearCashDocument();
    this.setState({
      docId: 0
    });
  }

  render() {


    return (
      <div className="mainContainer">
        <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document readOnly_inputs" : "documents-stepper noTabs__document"}>
          <HeaderDocument projectName={projectName} isViewMode={this.state.isViewMode} perviousRoute={this.state.perviousRoute} docTitle={Resources.projectTask[currentLanguage]}
            moduleTitle={Resources['timeCoordination'][currentLanguage]} />



          <div className="doc-container">
            {this.props.changeStatus == true ? (
              <header className="main__header">
                <div className="main__header--div">
                  <h2 className="zero">{Resources.goEdit[currentLanguage]}</h2>
                  <p className="doc-infohead">
                    <span> {this.state.document.refDoc}</span> -{" "}
                    <span> {this.state.document.arrange}</span> -{" "}
                    <span>
                      {moment(this.state.document.docDate).format("DD/MM/YYYY")}
                    </span>
                  </p>
                </div>
              </header>
            ) : null}
            <div className="step-content">
              <div id="step1" className="step-content-body">
                <div className="subiTabsContent">
                  <div className="document-fields">
                    <Formik initialValues={{ ...this.state.document }}
                      validationSchema={validationSchema}
                      enableReinitialize={true}
                      onSubmit={values => {
                        if (this.props.showModal) {
                          return;
                        }
                        if (this.props.changeStatus === true && this.state.docId > 0) {
                          this.editTask();
                        } else if (this.props.changeStatus === false && this.state.docId === 0) {
                          this.saveTask();
                        } else {
                          this.saveAndExit();
                        }
                      }}>
                      {({ errors, touched, handleBlur, handleChange, values, handleSubmit, setFieldValue, setFieldTouched }) => (
                        <Form id="rfiForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>
                          <div className="proForm first-proform">
                            <div className="linebylineInput valid-input">
                              <label className="control-label">
                                {Resources.subject[currentLanguage]}
                              </label>
                              <div className={"inputDev ui input" + (errors.subject && touched.subject ? " has-error" : !errors.subject && touched.subject ? " has-success" : " ")}>
                                <input name="subject" className="form-control fsadfsadsa" id="subject" placeholder={Resources.subject[currentLanguage]}
                                  autoComplete="off" value={this.state.document.subject} onBlur={e => { handleBlur(e); handleChange(e); }}
                                  onChange={e => this.handleChange(e, "subject")} />
                                {errors.subject && touched.subject ? (
                                  <Fragment>
                                    <span className="glyphicon glyphicon-remove form-control-feedback spanError" />
                                    <em className="pError">{errors.subject}</em>
                                  </Fragment>
                                ) : values.subject !== "" ? (
                                  <span className="glyphicon form-control-feedback glyphicon-ok"></span>
                                ) : null}
                              </div>
                            </div>
                            <div className="linebylineInput valid-input">
                              <label className="control-label">
                                {Resources.status[currentLanguage]}
                              </label>
                              <div className="ui checkbox radio radioBoxBlue">
                                <input type="radio" name="status" defaultChecked={this.state.document.status === false ? null : "checked"} value="true"
                                  onChange={e => this.handleChange(e, "status")} />
                                <label>
                                  {Resources.oppened[currentLanguage]}
                                </label>
                              </div>
                              <div className="ui checkbox radio radioBoxBlue">
                                <input type="radio" name="status" defaultChecked={this.state.document.status === false ? "checked" : null} value="false"
                                  onChange={e => this.handleChange(e, "status")} />
                                <label>
                                  {Resources.closed[currentLanguage]}
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="proForm datepickerContainer">
                            <div className="linebylineInput">
                              <div className="inputDev ui input input-group date NormalInputDate">
                                <ModernDatepicker startDate={this.state.document.docDate} title='docDate'
                                  handleChange={e => this.handleChangeDate(e, "docDate")} />
                              </div>
                            </div>

                            <div className="linebylineInput valid-input">
                              <label className="control-label">
                                {Resources.arrange[currentLanguage]}
                              </label>
                              <div className={"ui input inputDev " + (errors.arrange && touched.arrange ? " has-error" : " ")}>
                                <input type="text" className="form-control" id="arrange" readOnly value={this.state.document.arrange} name="arrange"
                                  placeholder={Resources.arrange[currentLanguage]}
                                  onBlur={e => { handleChange(e); handleBlur(e); }}
                                  onChange={e => this.handleChange(e, "arrange")} />
                              </div>
                            </div>
                            <div className="linebylineInput valid-input mix_dropdown">
                              <label className="control-label">
                                {Resources.fromCompany[currentLanguage]}
                              </label>
                              <div className="supervisor__company">
                                <div className="super_name">
                                  <Dropdown data={this.state.companies} isMulti={false}
                                    selectedValue={this.state.selectedFromCompany}
                                    handleChange={event => { this.handleChangeDropDown(event, "fromCompanyId", true, "fromContacts", "GetContactsByCompanyId", "companyId", "selectedFromCompany", "selectedFromContact"); }}
                                    onChange={setFieldValue} onBlur={setFieldTouched}
                                    error={errors.fromCompanyId} touched={touched.fromCompanyId}
                                    name="fromCompanyId" id="fromCompanyId" styles={CompanyDropdown} classDrop="companyName1 " />
                                </div>
                                <div className="super_company">
                                  <Dropdown isMulti={false} data={this.state.fromContacts}
                                    selectedValue={this.state.selectedFromContact}
                                    handleChange={event => this.handleChangeDropDown(event, "fromContactId", false, "", "", "", "selectedFromContact")}
                                    onChange={setFieldValue} onBlur={setFieldTouched} error={errors.fromContactId} touched={touched.fromContactId}
                                    name="fromContactId" id="fromContactId" classDrop=" contactName1" styles={ContactDropdown}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="linebylineInput valid-input mix_dropdown">
                              <label className="control-label">
                                {Resources.toCompany[currentLanguage]}
                              </label>
                              <div className="supervisor__company">
                                <div className="super_name">
                                  <Dropdown isMulti={false} data={this.state.companies}
                                    selectedValue={this.state.selectedBicCompany}
                                    handleChange={event => this.handleChangeDropDown(event, "bicCompanyId", true, "ToContacts", "GetContactsByCompanyId", "companyId", "selectedBicCompany", "selectedToContact")}
                                    onChange={setFieldValue} onBlur={setFieldTouched} error={errors.bicCompanyId}
                                    touched={touched.bicCompanyId} name="bicCompanyId" id="bicCompanyId" styles={CompanyDropdown} classDrop="companyName1 " />
                                </div>
                                <div className="super_company">
                                  <Dropdown isMulti={false} data={this.state.ToContacts} selectedValue={this.state.selectedToContact}
                                    handleChange={event => this.handleChangeDropDown(event, "bicContactId", false, "", "", "", "selectedToContact")}
                                    onChange={setFieldValue} onBlur={setFieldTouched} error={errors.bicContactId} touched={touched.bicContactId}
                                    name="bicContactId" id="bicContactId" classDrop=" contactName1" styles={ContactDropdown} />
                                </div>
                              </div>
                            </div>

                            <div className="linebylineInput">
                              <div className="inputDev ui input input-group date NormalInputDate">
                                <ModernDatepicker title='startDate' startDate={this.state.document.startDate}
                                  handleChange={e => this.handleChangeDate(e, "startDate")}
                                />
                              </div>
                            </div>
                            <div className="linebylineInput">
                              <div className="inputDev ui input input-group date NormalInputDate">
                                <ModernDatepicker title='finishDate' startDate={this.state.document.finishDate}
                                  handleChange={e => this.handleChangeDate(e, "finishDate")} />
                              </div>
                            </div>

                            <div className="linebylineInput valid-input">
                              <label className="control-label">
                                {Resources.estimateTime[currentLanguage]}
                              </label>
                              <div className="inputDev ui input">
                                <input name="estimateTime" className="form-control fsadfsadsa" id="estimateTime"
                                  placeholder={Resources.estimateTime[currentLanguage]}
                                  autoComplete="off"
                                  value={this.state.document.estimatedTime}
                                  onBlur={e => { handleBlur(e); handleChange(e); }}
                                  onChange={e => this.handleChange(e, "estimatedTime")} />
                              </div>
                            </div>
                            <div className="linebylineInput valid-input">
                              <Dropdown title="priority" data={this.state.priority} selectedValue={this.state.selectedPriority}
                                handleChange={event => this.handleChangeDropDown(event, "priorityId", false, "", "", "", "selectedPriority")} />
                            </div>
                            <div className="linebylineInput valid-input">
                              <label className="control-label">
                                {Resources.description[currentLanguage]}
                              </label>
                              <div className="shareLinks">
                                <div className="inputDev ui input">
                                  <input type="text" className="form-control" id="description"
                                    onChange={e => this.handleChange(e, "description")}
                                    value={this.state.document.description}
                                    name="description"
                                    placeholder={Resources.description[currentLanguage]} />
                                </div>
                              </div>
                            </div>
                            <div className="linebylineInput valid-input">
                              <label className="control-label">
                                {Resources.taskActivity[currentLanguage]}
                              </label>
                              <div className="ui checkbox radio radioBoxBlue">
                                <input type="radio" name="taskActivity" defaultChecked={this.state.document.suspeneded === false ? null : "checked"}
                                  value="true" onChange={e => this.handleChange(e, "status")} />
                                <label>
                                  {Resources.suspeneded[currentLanguage]}
                                </label>
                              </div>
                              <div className="ui checkbox radio radioBoxBlue">
                                <input type="radio" name="taskActivity" defaultChecked={this.state.document.suspeneded === false ? "checked" : null}
                                  value="false" onChange={e => this.handleChange(e, "status")} />
                                <label>
                                  {Resources.resumed[currentLanguage]}
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="slider-Btns">
                            {this.showBtnsSaving()}
                            {this.props.changeStatus === true ? (
                              <button className={this.state.isViewMode === true ? "primaryBtn-1 btn middle__btn disNone" : "primaryBtn-1 btn middle__btn"}
                                type="button" onClick={this.viewCycle.bind(this)}>
                                {Resources.addNewCycle[currentLanguage]}
                              </button>
                            ) : null}
                          </div>
                          {this.props.changeStatus === true ? (
                            <div className="approveDocument">
                              <div className="approveDocumentBTNS">
                                <DocumentActions
                                  isApproveMode={this.state.isApproveMode}
                                  docTypeId={this.state.docTypeId}
                                  docId={this.state.docId}
                                  projectId={this.state.projectId}
                                  previousRoute={this.state.previousRoute}
                                  docApprovalId={this.state.docApprovalId}
                                  currentArrange={this.state.arrange}
                                  showModal={this.props.showModal}
                                  showOptionPanel={this.showOptionPanel}
                                  permission={this.state.permission}
                                />
                              </div>
                            </div>
                          ) : null}
                        </Form>
                      )}
                    </Formik>
                  </div>
                  <div className="doc-pre-cycle letterFullWidth">
                    <div>
                      {this.state.docId > 0 && this.state.isViewMode === false ? (<UploadAttachment changeStatus={this.props.changeStatus} AddAttachments={867} EditAttachments={3251} ShowDropBox={3559} ShowGoogleDrive={3560} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />) : null}
                      {this.viewAttachments()}
                      {this.props.changeStatus === true ? (
                        <ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
        {this.state.viewModal === true ? (
          <div className="largePopup largeModal " style={{ display: this.state.viewModal ? "block" : "none" }}>
            <SkyLight hideOnOverlayClicked ref={ref => (this.simpleDialog = ref)} title={Resources["addNewCycle"][currentLanguage]}>
              <Formik initialValues={{ ...this.state.cycleDocument }} validationSchema={validationSchemaForCycle} onSubmit={values => { this.addNewCycle(); }}>
                {({ errors, touched, handleBlur, handleChange, values, handleSubmit, setFieldValue, setFieldTouched }) => (
                  <Form id="rfiForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>
                    <div className="dropWrapper">
                      <form id="signupForm1" className="proForm customProform ">

                        <div className="fillter-status fillter-item-c">
                          <label className="control-label">
                            {Resources.subject[currentLanguage]}
                          </label>
                          <div className={"inputDev ui input" + (errors.subject && touched.subject ? " has-error" : !errors.subject && touched.subject ? " has-success" : " ")}>
                            <input name="subject" className="form-control" id="subject" placeholder={Resources.subject[currentLanguage]}
                              autoComplete="off" value={this.state.cycleDocument.subject}
                              onBlur={e => { handleBlur(e); }}
                              onChange={e => {
                                handleChange(e);
                                this.handleChangeCycle(e, "subject")
                              }} />
                            {errors.subject && touched.subject ? (
                              <Fragment>
                                <span className="glyphicon glyphicon-remove form-control-feedback spanError" />
                                <em className="pError">{errors.subject}</em>
                              </Fragment>
                            ) : values.subject !== "" ? (
                              <span className="glyphicon form-control-feedback glyphicon-ok"></span>
                            ) : null}
                          </div>
                        </div>

                        <div className="fillter-status fillter-item-c">
                          <label className="control-label">
                            {Resources.status[currentLanguage]}
                          </label>
                          <div className="ui checkbox radio radioBoxBlue">
                            <input type="radio" name="cycleStatus" defaultChecked={this.state.cycleDocument.status === false ? null : "checked"} value="true"
                              onChange={e => this.handleChangeCycle(e, "status")} />
                            <label>
                              {Resources.oppened[currentLanguage]}
                            </label>
                          </div>
                          <div className="ui checkbox radio radioBoxBlue">
                            <input type="radio" name="cycleStatus" defaultChecked={this.state.cycleDocument.status === false ? "checked" : null} value="false"
                              onChange={e => this.handleChangeCycle(e, "status")} />
                            <label>
                              {Resources.closed[currentLanguage]}
                            </label>
                          </div>
                        </div>

                        <div className="fillter-status fillter-item-c">
                          <div className="inputDev ui input input-group date NormalInputDate">
                            <ModernDatepicker startDate={this.state.cycleDocument.docDate} handleChange={e => this.handleChangeDateCycle(e, "docDate")} title='docDate' />
                          </div>
                        </div>

                        <div className="fillter-status fillter-item-c">
                          <label className="control-label">
                            {Resources.arrange[currentLanguage]}
                          </label>
                          <div className="ui input inputDev">
                            <input type="text" className="form-control" id="arrange" readOnly value={this.state.cycleDocument.arrange}
                              name="arrange"
                              placeholder={Resources.arrange[currentLanguage]}
                              onBlur={e => { handleBlur(e); }}
                              onChange={e => { handleChange(e); this.handleChangeCycle(e, "arrange") }} />
                          </div>
                        </div>

                        <div className="mix_dropdown">
                          <label className="control-label">
                            {Resources.ContactName[currentLanguage]}
                          </label>
                          <div className="supervisor__company">
                            <div className="super_name">
                              <Dropdown data={this.state.companies} isMulti={false}
                                selectedValue={this.state.selectedBicCompanyCycle}
                                handleChange={event => { this.handleChangeDropDownCycle(event, "bicCompanyId", true, "ToContacts", "GetContactsByCompanyId", "companyId", "selectedBicCompanyCycle", "selectedFromContact"); }}
                                name="bicCompanyId" id="bicCompanyId" styles={CompanyDropdown} classDrop="companyName1 " />
                            </div>
                            <div className="super_company">
                              <Dropdown isMulti={false} data={this.state.ToContacts}
                                selectedValue={this.state.selectedToContactCycle}
                                handleChange={event => this.handleChangeDropDownCycle(event, "bicContactId", false, "", "", "", "selectedToContactCycle")}
                                onChange={setFieldValue} onBlur={setFieldTouched} error={errors.bicContactId}
                                touched={touched.bicContactId}
                                name="bicContactId" id="bicContactId" classDrop=" contactName1" styles={ContactDropdown}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="fillter-status fillter-item-c">
                          <div className="inputDev ui input input-group date NormalInputDate">
                            <ModernDatepicker startDate={this.state.cycleDocument.startDate} handleChange={e => this.handleChangeDateCycle(e, "startDate")} title='startDate' />
                          </div>
                        </div>

                        <div className="fillter-status fillter-item-c">
                          <div className="inputDev ui input input-group date NormalInputDate">
                            <ModernDatepicker startDate={this.state.cycleDocument.finishDate} handleChange={e => this.handleChangeDateCycle(e, "finishDate")} title='finishDate' />
                          </div>
                        </div>

                        <div className="fillter-status fillter-item-c">
                          <label className="control-label">
                            {Resources.estimateTime[currentLanguage]}
                          </label>
                          <div className="inputDev ui input">
                            <input name="estimateTime" className="form-control fsadfsadsa" id="estimateTime"
                              placeholder={Resources.estimateTime[currentLanguage]}
                              autoComplete="off"
                              value={this.state.cycleDocument.estimatedTime}
                              onChange={e => this.handleChangeCycle(e, "estimatedTime")} />
                          </div>
                        </div>

                        <Dropdown title="priority" data={this.state.priority} selectedValue={this.state.selectedPriorityCycle}
                          handleChange={event => this.handleChangeDropDownCycle(event, "priorityId", false, "", "", "", "selectedPriorityCycle", "")} />

                        <div className="fillter-status fillter-item-c">
                          <label className="control-label">
                            {Resources.description[currentLanguage]}
                          </label>
                          <div className="shareLinks">
                            <div className="inputDev ui input">
                              <input type="text" className="form-control" id="description"
                                onChange={e => this.handleChangeCycle(e, "description")}
                                value={this.state.cycleDocument.description}
                                name="description"
                                placeholder={Resources.description[currentLanguage]} />
                            </div>
                          </div>
                        </div>

                        <div className="fillter-status fillter-item-c">
                          <label className="control-label">
                            {Resources.taskActivity[currentLanguage]}
                          </label>
                          <div className="ui checkbox radio radioBoxBlue">
                            <input type="radio" name="taskActivity" defaultChecked={this.state.cycleDocument.suspeneded === false ? null : "checked"}
                              value="true" onChange={e => this.handleChangeCycle(e, "suspeneded")} />
                            <label>
                              {Resources.suspeneded[currentLanguage]}
                            </label>
                          </div>
                          <div className="ui checkbox radio radioBoxBlue">
                            <input type="radio" name="taskActivity" defaultChecked={this.state.cycleDocument.suspeneded === false ? "checked" : null}
                              value="false" onChange={e => this.handleChangeCycle(e, "suspeneded")} />
                            <label>
                              {Resources.resumed[currentLanguage]}
                            </label>
                          </div>
                        </div>

                        <div className="fullWidthWrapper">
                          {
                            this.state.isLoading === false ?
                              (<button className="primaryBtn-1 btn meduimBtn">Save</button>) :
                              (<button className="primaryBtn-1 btn largeBtn disabled" disabled="disabled">
                                <div className="spinner">
                                  <div className="bounce1" />
                                  <div className="bounce2" />
                                  <div className="bounce3" />
                                </div>
                              </button>)
                          }
                        </div>

                      </form>
                    </div>
                  </Form>
                )}
              </Formik>
            </SkyLight>
          </div>
        ) : null}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    document: state.communication.document,
    isLoading: state.communication.isLoading,
    changeStatus: state.communication.changeStatus,
    file: state.communication.file,
    files: state.communication.files,
    hasWorkflow: state.communication.hasWorkflow,
    showModal: state.communication.showModal
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
)(withRouter(ProjectTaskAddEdit));
