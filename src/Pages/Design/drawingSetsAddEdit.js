import React, { Component, Fragment } from "react";
import OptionContainer from "../../Componants/OptionsPanels/OptionContainer";
import { Formik, Form } from "formik";
import ReactTable from "react-table";
import "react-table/react-table.css";
import * as Yup from "yup";
import dataservice from "../../Dataservice";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import UploadAttachment from "../../Componants/OptionsPanels/UploadAttachmentWithProgress";
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
import DocumentActions from '../../Componants/OptionsPanels/DocumentActions';
import * as communicationActions from "../../store/actions/communication";
import AddDocAttachment from "../../Componants/publicComponants/AddDocAttachment";

import { toast } from "react-toastify";
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument'
import Steps from "../../Componants/publicComponants/Steps";
import CompanyDropdown from '../../Componants/publicComponants/CompanyDropdown'
import ContactDropdown from '../../Componants/publicComponants/ContactDropdown'
var steps_defination = [];
const find = require("lodash/find");

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const validationSchema = Yup.object().shape({
  subject: Yup.string().required(Resources["subjectRequired"][currentLanguage]).max(450, Resources["maxLength"][currentLanguage]),
  fileNumberId: Yup.string().required(Resources["selectFileNumber"][currentLanguage]),
  arrange: Yup.number().required(Resources["arrange"][currentLanguage]),
  progressPercent: Yup.number().required(Resources["selectprogressPercent"][currentLanguage]),
  bicContactId: Yup.string().required(Resources["fromContactRequired"][currentLanguage]).nullable(true),
  disciplineId: Yup.string().required(Resources["disciplineRequired"][currentLanguage]).nullable(true),
  reasonForIssueId: Yup.string().required(Resources["SelectReasonForIssueId"][currentLanguage]).nullable(true),
  specsSectionId: Yup.string().required(Resources["specsSectionSelection"][currentLanguage]).nullable(true),
});

const validationSchemaItems = Yup.object().shape({
  drawing: Yup.string().required(Resources["dwgNoRequired"][currentLanguage]).nullable(true)
});

let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let perviousRoute = '';
let arrange = 0;

class DrawingSetsAddEdit extends Component {

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
      arrange: arrange,
      CurrentStep: 0,
      showDeleteModal: false,
      isLoading: false,
      isEdit: false,
      perviousRoute: perviousRoute,
      isViewMode: false,
      isApproveMode: isApproveMode,
      isView: false,
      docId: docId,
      docTypeId: 38,
      projectId: projectId,
      docApprovalId: docApprovalId,
      document: this.props.document ? Object.assign({}, this.props.document) : {},
      drawingId: "",
      drawingSetId: docId,
      currentId: "",
      drawing: [],
      listDrawing: [],
      companies: [],
      fromContacts: [],
      specsSection: [],
      reasonForIssue: [],
      disciplines: [],
      contracts: [],
      areas: [],
      approvales: [],
      itemData: [],
      permission: [
        { name: "sendByEmail", code: 217 },
        { name: "sendByInbox", code: 216 },
        { name: "sendTask", code: 0 },
        { name: "distributionList", code: 983 },
        { name: "createTransmittal", code: 3069 },
        { name: "sendToWorkFlow", code: 731 },
        { name: "viewAttachments", code: 3331 },
        { name: "deleteAttachments", code: 896 }
      ],
      selectedFromCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
      selectedFromContact: { label: Resources.fromContactRequired[currentLanguage], value: "0" },
      selectedSpecsSection: { label: Resources.specsSectionSelection[currentLanguage], value: "0" },
      selectedDiscpline: { label: Resources.disciplineRequired[currentLanguage], value: "0" },
      selectedReasonForIssue: { label: Resources.SelectReasonForIssueId[currentLanguage], value: "0" },
      selectedArea: { label: Resources.area[currentLanguage], value: "0" },
      selectedDrawing: { label: Resources.dwgNoRequired[currentLanguage], value: "0" },
    };

    if (!Config.IsAllow(211) || !Config.IsAllow(212) || !Config.IsAllow(214)) {

      toast.success(Resources["missingPermissions"][currentLanguage]);

      this.props.history.push(
        this.state.perviousRoute
      );
    }
    steps_defination = [
      {
        name: "Submittal",
        callBackFn: () => this.getLogsSubmittalItems
      },
      {
        name: "items",
        callBackFn: null
      }
    ];
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

      dataservice.GetRowById("GetLogsDrawingsSetsDocsByProjectId?drawingSetId=" + docId).then(result => {

        this.setState({
          listDrawing: [...result],
          isEdit: true,
          document: doc,
          hasWorkflow: this.props.hasWorkflow
        });
        let data = { items: result };
        this.props.actions.ExportingData(data);

        this.fillDropDowns(nextProps.document.id > 0 ? true : false);
      });

      this.checkDocumentIsView();
    }

  }

  componentDidUpdate(prevProps) {
    if (this.props.hasWorkflow !== prevProps.hasWorkflow || this.props.changeStatus !== prevProps.changeStatus) {
      this.checkDocumentIsView();
    }
  }

  checkDocumentIsView() {
    if (this.props.changeStatus === true) {
      if (!(Config.IsAllow(212))) {
        this.setState({ isViewMode: true });
      }
      if (Config.getUserTypeIsAdmin() === true) {
        this.setState({ isViewMode: false });
      } else {
        if (this.state.isApproveMode != true && Config.IsAllow(212)) {
          if (this.props.hasWorkflow == false && Config.IsAllow(212)) {
            if (this.props.document.status !== false && Config.IsAllow(212)) {
              this.setState({ isViewMode: false });
            } else {
              this.setState({ isViewMode: true });
            }
          } else {
            this.setState({ isViewMode: true });
          }
        }
      }
    }
    else {
      this.setState({ isViewMode: false });
    }
  }

  componentWillMount() {

    if (this.state.docId > 0) {

      let url = "GetLogsDrawingsSetsForEdit?id=" + this.state.docId;

      this.props.actions.documentForEdit(url, this.state.docTypeId, 'drawingSets');

    } else {
      //field
      const drawingDocument = {
        id: 0,
        projectId: projectId,
        disciplineId: "",
        area: "",
        fileNumberId: "",
        arrange: "1",
        docDate: moment(),
        status: "true",
        subject: "",
        specsSectionId: "",
        reasonForIssueId: "",
        bicCompanyId: "",
        bicContactId: "",
        progressPercent: ""
      };

      this.setState({ document: drawingDocument });

      this.fillDropDowns(false);
    }
    this.props.actions.documentForAdding();
  }

  fillSubDropDownInEdit(url, param, value, subField, subSelectedValue, subDatasource) {

    let action = url + "?" + param + "=" + value;

    dataservice.GetDataList(action, "contactName", "id").then(result => {
      if (this.props.changeStatus === true) {
        if (subField != "flowContactId") {
          let toSubField = this.state.document[subField];

          let targetFieldSelected = find(result, function (i) {
            return i.value == toSubField;
          });

          this.setState({
            [subSelectedValue]: targetFieldSelected,
            [subDatasource]: result
          });
        } else {
          let toSubField = this.state.documentCycle[subField];

          let targetFieldSelected = find(result, function (i) {
            return i.value == toSubField;
          });

          this.setState({
            [subSelectedValue]: targetFieldSelected,
            [subDatasource]: result
          });
        }
      }
    });
  }

  fillDropDowns(isEdit) {

    //from Companies
    dataservice.GetDataListCached("GetProjectProjectsCompaniesForList?projectId=" + projectId, "companyName", "companyId", 'companies', this.state.projectId, "projectId").then(result => {
      if (isEdit) {
        let companyId = this.props.document.bicCompanyId;
        if (companyId) {
          this.setState({
            selectedFromCompany: {
              label: this.props.document.bicCompanyName,
              value: companyId
            }
          });

          this.fillSubDropDownInEdit("GetContactsByCompanyId", "companyId", companyId, "bicContactId", "selectedFromContact", "fromContacts");
        }
      }

      this.setState({
        companies: [...result]
      });
    });

    //area
    dataservice.GetDataListCached("GetaccountsDefaultListForList?listType=area", "title", "id", 'defaultLists', "area", "listType").then(result => {

      if (isEdit) {

        let areaId = this.props.document.area;

        if (areaId) {

          let areaIdName = result.find(i => i.value === parseInt(areaId));

          this.setState({
            selectedArea: areaIdName
          });
        }
      }
      this.setState({
        areas: [...result]
      });
    });

    //specsSection
    dataservice.GetDataListCached("GetaccountsDefaultListForList?listType=specssection", "title", "id", 'defaultLists', "specssection", "listType").then(result => {

      if (isEdit) {
        let specsSectionId = this.props.document.specsSectionId;
        if (specsSectionId) {
          let specsSection = result.find(i => i.value === parseInt(specsSectionId));

          this.setState({
            selectedSpecsSection: specsSection
          });
        }
      }

      this.setState({
        specsSection: [...result]
      });
    });

    //discplines
    dataservice.GetDataListCached("GetaccountsDefaultListForList?listType=discipline", "title", "id", 'defaultLists', "discipline", "listType").then(result => {

      if (isEdit) {

        let disciplineId = this.props.document.disciplineId;

        if (disciplineId) {

          let discipline = result.find(i => i.value === disciplineId);

          this.setState({
            selectedDiscpline: discipline
          });
        }
      }
      this.setState({
        disciplines: [...result]
      });
    });

    //reasonForIssue
    dataservice.GetDataListCached("GetaccountsDefaultListForList?listType=reasonForIssue", "title", "id", 'defaultLists', "reasonForIssue", "listType").then(result => {

      if (isEdit) {

        let reasonFor = this.props.document.reasonForIssueId;

        if (reasonFor) {
          this.setState({
            selectedReasonForIssue: { label: this.props.document.reasonForIssueName, value: this.props.document.reasonForIssueId }
          });
        }
      }
      this.setState({
        reasonForIssue: [...result]
      });
    });

    //drawing
    dataservice.GetDataListWithNewVersion("GetLogsDrawingsByProjectId?projectId=" + projectId + "&pageNumber=0&pageSize=100000", "subject", "id").then(result => {

      this.setState({
        drawing: [...result]
      });
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

  handleChangeDate(e, field) {

    let original_document = { ...this.state.document };

    let updated_document = {};

    updated_document[field] = e;

    updated_document = Object.assign(original_document, updated_document);

    this.setState({
      document: updated_document
    });
  }

  handleChangeDropDown(event, field,sub_field, isSubscrib, targetState, url, param, selectedValue, subDatasource) {
    let original_document = { ...this.state.document };
    let updated_document = {};
    updated_document = Object.assign(original_document, updated_document);

    if (event == null) {
      this.setState({
          [selectedValue]: event,
          [subDatasource]:null,
          [targetState]:[]
      });
      updated_document[field] = event;
      updated_document[sub_field]=null;
      updated_document["arrange"]=null;
      this.setState({
          document: updated_document,
      });
  }else{
      updated_document[field] = event.value;
    
    this.setState({
      document: updated_document,
      [selectedValue]: event
    });

    if (field == "bicCompanyId") {
      let url = "GetNextArrangeMainDoc?projectId=" + this.state.projectId + "&docType=" + this.state.docTypeId + "&companyId=" + event.value + "&contactId=" + null;

      dataservice.GetNextArrangeMainDocument(url).then(res => {

        updated_document.arrange = res;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
          document: updated_document
        });
      });
    }
    if (isSubscrib) {
      let action = url + "?" + param + "=" + event.value;
      dataservice.GetDataList(action, "contactName", "id").then(result => {
        this.setState({
          [targetState]: result
        });
      });
    }
  }

  }

  handleChangeDropDownItems(event, selectedValue) {

    if (event == null) {
      this.setState({
      drawingId: event,
      [selectedValue]: event
    });
    }else{
    this.setState({
      drawingId: event.value,
      [selectedValue]: event
    });
  }
}

  editDrawing(event) {

    this.setState({
      isLoading: true
    });

    let saveDocument = this.state.document;

    saveDocument.docDate = moment(saveDocument.docDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");

    dataservice.addObject("EditLogsDrawingsSets", saveDocument).then(result => {

      this.setState({
        isLoading: false,
        CurrentStep: this.state.CurrentStep + 1
      });
    });
  }

  saveDrawing(event) {

    if (this.props.changeStatus === false) {

      this.setState({
        isLoading: true
      });

      let saveDocument = { ...this.state.document };

      saveDocument.docDate = moment(saveDocument.docDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");

      dataservice.addObject("AddLogsDrawingsSets", saveDocument).then(result => {

        this.setState({
          docId: result.id,
          drawingSetId: result.id,
          isLoading: false
        });

      }).catch(ex => {
        this.setState({
          isLoading: false
        });

        toast.error(Resources["failError"][currentLanguage]);
      });
    } else {
      this.changeCurrentStep(1);
    }
  }

  showBtnsSaving() {

    let btn = null;

    if (this.state.docId === 0) {
      btn = (
        <button className="primaryBtn-1 btn meduimBtn" type="submit">
          {Resources.save[currentLanguage]}
        </button>
      );
    } else if (this.state.docId > 0 && this.props.changeStatus === false) {
      btn = (
        <button className="primaryBtn-1 btn mediumBtn" type="submit">
          {Resources.saveAndExit[currentLanguage]}
        </button>
      );
    }

    return btn;
  }

  viewAttachments() {
    return this.state.docId > 0 ? (
      Config.IsAllow(3331) === true ?
        (<ViewAttachment isApproveMode={this.state.isApproveMode} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} deleteAttachments={896} />) : null) : null;
  }


  changeCurrentStep = stepNo => {
    this.setState({ CurrentStep: stepNo });
  };

  getLogsSubmittalItems = () => {
    dataservice.GetDataGrid("GetLogsSubmittalItemsBySubmittalId?submittalId=" + this.state.docId).then(data => {
      this.setState({ itemData: data });
    }).catch(ex => toast.error(Resources["failError"][currentLanguage]));
  }

  finishDocument() {
    this.props.history.push("/drawingSets/" + this.state.projectId);
  }

  onCloseModal = () => {
    this.setState({ showDeleteModal: false });
  };

  clickHandlerCancelMain = () => {
    this.setState({ showDeleteModal: false });
  };

  clickHandlerContinueMain = () => {

    dataservice.addObject("DeleteLogsDrawingsSetsDocById?id=" + this.state.currentId + "&drawingSetId=" + docId).then(result => {

      let originalData = this.state.listDrawing;

      let getIndex = originalData.findIndex(x => x.id === this.state.currentId);

      originalData.splice(getIndex, 1);

      this.setState({
        listDrawing: originalData,
        showDeleteModal: false
      });

      toast.success(Resources["operationSuccess"][currentLanguage]);

    }).catch(ex => {
      toast.success(Resources["operationSuccess"][currentLanguage]);
    });
  };

  addDrawingItems() {

    this.setState({
      isLoading: true
    });

    let saveDrawingItems = {};

    saveDrawingItems.drawingId = this.state.drawingId;
    saveDrawingItems.drawingSetId = this.state.drawingSetId;

    dataservice.addObject("AddLogsDrawingsSetsDoc", saveDrawingItems).then(result => {

      this.setState({
        isLoading: false,
        listDrawing: [...result],
        selectedDrawing: { label: Resources.dwgNoRequired[currentLanguage], value: "0" }
      });
      toast.success(Resources["operationSuccess"][currentLanguage]);

    });
  }

  viewConfirmDelete(id) {
    this.setState({
      showDeleteModal: true,
      currentId: id
    });
  }

  componentWillUnmount() {
    this.props.actions.clearCashDocument();
    this.setState({
      docId: 0
    });
  }

  showOptionPanel = () => {
    this.props.actions.showOptionPanel(true);
  }

  render() {
    const columns = [
      {
        Header: Resources["LogControls"][currentLanguage],
        accessor: "id",
        Cell: ({ row }) => {
          return (
            <div className="btn table-btn-tooltip" style={{ marginLeft: "5px" }} onClick={() => this.viewConfirmDelete(row.id)}>
              <i style={{ fontSize: "1.6em" }} className="fa fa-trash-o" />
            </div>
          );
        },
        width: 70
      },
      {
        Header: Resources["subject"][currentLanguage],
        accessor: "drawingName",
        sortabel: true,
        width: 200
      },
      {
        Header: Resources["actionByCompany"][currentLanguage],
        accessor: "bicCompanyName",
        width: 200,
        sortabel: true
      },
      {
        Header: Resources["actionByContact"][currentLanguage],
        accessor: "bicContactName",
        width: 200,
        sortabel: true
      },
      {
        Header: Resources["docDate"][currentLanguage],
        accessor: "docDate",
        width: 200,
        sortabel: true,
        Cell: row => (
          <span>
            <span>{moment(row.value).format("DD/MM/YYYY")}</span>
          </span>
        )
      },
      {
        Header: Resources["status"][currentLanguage],
        accessor: "status",
        width: 200,
        sortabel: true
      }
    ];

    return (
      <div className="mainContainer">
        <div className="documents-stepper noTabs__document one__tab one_step">
          <HeaderDocument projectName={projectName} isViewMode={this.state.isViewMode} perviousRoute={this.state.perviousRoute} docTitle={Resources.drawingSets[currentLanguage]} moduleTitle={Resources['communication'][currentLanguage]} />

          <div className="doc-container">
            {/* Right Menu */}
            <div className="step-content">
              <div id="step1" className="step-content-body">
                <div className="subiTabsContent">
                  {this.state.CurrentStep === 0 ? (
                    <div className="document-fields">
                      <Formik initialValues={this.state.document}
                        validationSchema={validationSchema}
                        enableReinitialize={this.props.changeStatus}
                        onSubmit={values => {

                          if (this.props.showModal) { return; }

                          if (this.props.changeStatus === true && this.state.docId > 0) {
                            this.editDrawing();
                          } else if (this.props.changeStatus === false && this.state.docId === 0) {
                            this.saveDrawing();
                          } else {
                            this.changeCurrentStep(1);
                          }
                        }}>
                        {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                          <Form id="submittalForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>
                            <div className="proForm first-proform">
                              <div className="linebylineInput valid-input">
                                <label className="control-label">
                                  {Resources.subject[currentLanguage]}
                                </label>
                                <div className={"ui input inputDev fillter-item-c " + (errors.subject && touched.subject ? "has-error" : !errors.subject && touched.subject ? "has-success" : "")}>
                                  <input name="subject" className="form-control fsadfsadsa" placeholder={Resources.subject[currentLanguage]}
                                    autoComplete="off"
                                    value={this.state.document.subject}
                                    onBlur={e => { handleBlur(e); handleChange(e); }}
                                    onChange={e => this.handleChange(e, "subject")} />
                                  {errors.subject && touched.subject ? (
                                    <span className="glyphicon glyphicon-remove form-control-feedback spanError" />)
                                    : !errors.subject && touched.subject ?
                                      (<span className="glyphicon form-control-feedback glyphicon-ok" />) : null}
                                  {errors.subject && touched.subject ? (<em className="pError">{errors.subject}</em>) : null}
                                </div>
                              </div>
                              <div className="linebylineInput valid-input">
                                <label className="control-label">
                                  {Resources.status[currentLanguage]}
                                </label>
                                <div className="ui checkbox radio radioBoxBlue">
                                  <input type="radio" name="status" defaultChecked={this.state.document.status === false ? null : "checked"}
                                    value="true" onChange={e => this.handleChange(e, "status")} />
                                  <label>
                                    {Resources.oppened[currentLanguage]}
                                  </label>
                                </div>
                                <div className="ui checkbox radio radioBoxBlue">
                                  <input type="radio" name="status" defaultChecked={this.state.document.status === false ? "checked" : null}
                                    value="false"
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
                                    handleChange={e => this.handleChangeDate(e, 'docDate')} />
                                </div>
                              </div>
                              <div className="linebylineInput valid-input">
                                <label className="control-label">
                                  {Resources.arrange[currentLanguage]}
                                </label>
                                <div className={"ui input inputDev fillter-item-c " + (errors.arrange && touched.arrange ? "has-error" : !errors.arrange && touched.arrange ? "has-success" : "")} >
                                  <input type="text" className="form-control" readOnly value={this.state.document.arrange} name="arrange" placeholder={Resources.arrange[currentLanguage]}
                                    onBlur={e => { handleChange(e); handleBlur(e); }}
                                    onChange={e => this.handleChange(e, "arrange")} />
                                  {errors.arrange && touched.arrange ? (<span className="glyphicon glyphicon-remove form-control-feedback spanError" />) :
                                    !errors.arrange && touched.arrange ? (<span className="glyphicon form-control-feedback glyphicon-ok" />) : null}
                                  {errors.arrange && touched.arrange ? (<em className="pError">{errors.arrange}</em>) : null}
                                </div>
                              </div>
                              <div className="linebylineInput valid-input">
                                <label className="control-label">
                                  {Resources.progressPercent[currentLanguage]}
                                </label>
                                <div className={"ui input inputDev" + (errors.progressPercent && touched.progressPercent ? " has-error" : "ui input inputDev")}>
                                  <input type="text" className="form-control" id="progressPercent" value={this.state.document.progressPercent}
                                    name="progressPercent" placeholder={Resources.progressPercent[currentLanguage]}
                                    onBlur={e => { handleChange(e); handleBlur(e); }}
                                    onChange={e => this.handleChange(e, "progressPercent")} />
                                  {errors.progressPercent && touched.progressPercent ? (<span className="glyphicon glyphicon-remove form-control-feedback spanError" />) :
                                    !errors.progressPercent && touched.progressPercent ? (<span className="glyphicon form-control-feedback glyphicon-ok" />) : null}
                                  {errors.progressPercent && touched.progressPercent ? (<em className="pError">{errors.progressPercent}</em>) : null}
                                </div>
                              </div>
                              <div className="linebylineInput valid-input">
                                <label className="control-label">
                                  {Resources.fileNumber[currentLanguage]}
                                </label>
                                <div className="inputDev ui input">
                                  <input name="fileNumberId" className="form-control fsadfsadsa" id="fileNumberId" placeholder={Resources.fileNumber[currentLanguage]}
                                    autoComplete="off" value={this.state.document.fileNumberId}
                                    onBlur={e => { handleBlur(e); handleChange(e); }}
                                    onChange={e => this.handleChange(e, "fileNumberId")} />
                                  {errors.fileNumberId && touched.fileNumberId ? (<span className="glyphicon glyphicon-remove form-control-feedback spanError" />) :
                                    !errors.fileNumberId && touched.fileNumberId ? (<span className="glyphicon form-control-feedback glyphicon-ok" />) : null}
                                  {errors.fileNumberId && touched.fileNumberId ? (<em className="pError">{errors.fileNumberId}</em>) : null}
                                </div>
                              </div>
                              <div className="linebylineInput valid-input">
                                <Dropdown 
                                  isClear={true} 
                                  title="area" data={this.state.areas} selectedValue={this.state.selectedArea}
                                  handleChange={event => this.handleChangeDropDown(event, "area",null, false, "", "", "", "selectedArea")}
                                  onChange={setFieldValue} onBlur={setFieldTouched} error={errors.area} touched={touched.area}
                                  name="area" id="area" />
                              </div>
                              <div className="linebylineInput valid-input mix_dropdown">
                                <label className="control-label">
                                  {Resources.actionByCompany[currentLanguage]}
                                </label>
                                <div className="supervisor__company">
                                  <div className="super_name">
                                    <Dropdown 
                                      isClear={true} data={this.state.companies} isMulti={false} selectedValue={this.state.selectedFromCompany}
                                      handleChange={event => { this.handleChangeDropDown(event, "bicCompanyId","bicContactId", true, "fromContacts", "GetContactsByCompanyId", "companyId", "selectedFromCompany", "selectedFromContact"); }}
                                      onChange={setFieldValue} onBlur={setFieldTouched} error={errors.fromCompanyId} touched={touched.fromCompanyId} name="fromCompanyId" id="fromCompanyId"
                                      styles={CompanyDropdown} classDrop="companyName1 " />
                                  </div>
                                  <div className="super_company">
                                    <Dropdown 
                                      isClear={true}
                                      isMulti={false} data={this.state.fromContacts} selectedValue={this.state.selectedFromContact}
                                      handleChange={event => this.handleChangeDropDown(event, "bicContactId",null, false, "", "", "", "selectedFromContact")}
                                      onChange={setFieldValue} onBlur={setFieldTouched} error={errors.bicContactId} touched={touched.bicContactId}
                                      name="bicContactId" id="bicContactId" classDrop=" contactName1" styles={ContactDropdown} />
                                  </div>
                                </div>
                              </div>
                              <div className="linebylineInput valid-input">
                                <Dropdown 
                                  isClear={true}
                                  title="specsSection" data={this.state.specsSection} selectedValue={this.state.selectedSpecsSection}
                                  handleChange={event => this.handleChangeDropDown(event, "specsSectionId",null, false, "", "", "", "selectedSpecsSection")}
                                  onChange={setFieldValue} onBlur={setFieldTouched} error={errors.specsSectionId}
                                  touched={touched.specsSectionId} name="specsSectionId" id="specsSectionId" />
                              </div>
                              <div className="linebylineInput valid-input">
                                <Dropdown 
                                  isClear={true}
                                  title="disciplineTitle" data={this.state.disciplines} isMulti={false} selectedValue={this.state.selectedDiscpline}
                                  handleChange={event => this.handleChangeDropDown(event, "disciplineId",null, false, "", "", "", "selectedDiscpline")}
                                  onChange={setFieldValue} onBlur={setFieldTouched} error={errors.disciplineId}
                                  touched={touched.disciplineId} name="disciplineId" id="disciplineId" />
                              </div>
                              <div className="linebylineInput valid-input">
                                <Dropdown 
                                  isClear={true} 
                                  title="reasonForIssue"
                                  data={this.state.reasonForIssue}
                                  selectedValue={this.state.selectedReasonForIssue}
                                  handleChange={event => this.handleChangeDropDown(event, "reasonForIssueId",null, false, "", "", "", "selectedReasonForIssue")}
                                  onChange={setFieldValue} onBlur={setFieldTouched}
                                  error={errors.reasonForIssueId}
                                  touched={touched.reasonForIssueId}
                                  name="reasonForIssueId" id="reasonForIssueId" />
                              </div>
                            </div>
                            <div className="slider-Btns">
                              {this.state.isLoading === false ?
                                (
                                  <button className={this.state.isViewMode === true ? "primaryBtn-1 btn meduimBtn disNone" : "primaryBtn-1 btn meduimBtn"} type="submit">
                                    {this.state.docId > 0
                                      ? Resources["next"][currentLanguage]
                                      : Resources["save"][currentLanguage]}
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
                      <br />
                      <br />
                      {this.state.listDrawing.length > 0 ? (
                        <Fragment>
                          <header className="main__header">
                            <div className="main__header--div">
                              <h2 className="zero">
                                {Resources["listDetails"][currentLanguage]}
                              </h2>
                            </div>
                          </header>
                          <ReactTable
                            data={this.state.listDrawing}
                            columns={columns}
                            defaultPageSize={5}
                            noDataText={Resources["noData"][currentLanguage]}
                            className="-striped -highlight" />
                        </Fragment>
                      ) : null}
                    </div>
                  ) : (
                      <Fragment>
                        <header className="main__header">
                          <div className="main__header--div">
                            <h2 className="zero">
                              {Resources["items"][currentLanguage]}
                            </h2>
                          </div>
                        </header>
                        <div className="document-fields">
                          <Formik initialValues={{ ...this.state.itemsDocumentSubmital }}
                            validationSchema={validationSchemaItems}
                            onSubmit={() => { this.addDrawingItems(); }}>
                            {({ errors, touched, handleSubmit, setFieldTouched, setFieldValue }) => (
                              <Form onSubmit={handleSubmit}>
                                <div className="proForm datepickerContainer">
                                  <div className="linebylineInput valid-input">
                                    <Dropdown 
                                    isClear={true}
                                    isMulti={false} title="drawing" data={this.state.drawing}
                                      
                                      selectedValue={this.state.selectedDrawing}
                                      onChange={setFieldValue} onBlur={setFieldTouched}
                                      error={errors.drawing} touched={touched.drawing}
                                      name="drawing" id="drawing"
                                      handleChange={event => this.handleChangeDropDownItems(event, "selectedDrawing")} />
                                  </div>
                                </div>
                                <div className="slider-Btns">
                                  {this.state.isLoading === false ?
                                    (<button className="primaryBtn-1 btn meduimBtn" type="submit" >
                                      {Resources["addTitle"][currentLanguage]}
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
                        <div className="precycle-grid">
                          <div className="reactTableActions">
                            <ReactTable data={this.state.listDrawing} columns={columns}
                              defaultPageSize={5}
                              noDataText={Resources["noData"][currentLanguage]}
                              className="-striped -highlight" />
                          </div>
                        </div>
                      </Fragment>
                    )}
                  <div className="slider-Btns">
                    {this.state.CurrentStep === 1 ? (
                      <button className="primaryBtn-1 btn meduimBtn" onClick={this.finishDocument.bind(this)}>
                        {Resources["finish"][currentLanguage]}
                      </button>
                    ) : null}
                  </div>
                  <div className="doc-pre-cycle letterFullWidth">
                    <div>
                      {this.state.docId > 0 && this.state.isViewMode === false ? (<UploadAttachment changeStatus={this.props.changeStatus} AddAttachments={895} EditAttachments={3237} ShowDropBox={3637} ShowGoogleDrive={3638} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />) : null}
                      {this.state.docId > 0 && this.state.CurrentStep === 0 ? (
                              <Fragment>
                                   <div className="document-fields tableBTnabs">
                                         <AddDocAttachment projectId={projectId} isViewMode={this.state.isViewMode} docTypeId={this.state.docTypeId} docId={this.state.docId} />
                                     </div>
                              </Fragment>
                      ) : null}
                      {this.state.CurrentStep === 0 ? this.viewAttachments() : null}
                      {this.props.changeStatus === true ? (<ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {this.props.changeStatus === true && this.state.CurrentStep === 0 ? (
              <div className="approveDocument">
                <div className="approveDocumentBTNS">

                  {this.state.isLoading ?
                    <button className="primaryBtn-1 btn disabled">
                      <div className="spinner">
                        <div className="bounce1" />
                        <div className="bounce2" />
                        <div className="bounce3" />
                      </div>
                    </button> :
                    <button className={this.state.isViewMode === true ? "primaryBtn-1 btn middle__btn disNone" : "primaryBtn-1 btn middle__btn"} type="submit">{Resources.save[currentLanguage]}</button>
                  }
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
            <Steps
              steps_defination={steps_defination}
              exist_link="/drawingSets/"
              docId={this.state.docId}
              changeCurrentStep={stepNo =>
                this.changeCurrentStep(stepNo)
              }
              stepNo={this.state.CurrentStep} changeStatus={docId === 0 ? false : true}
            />
          </div>
        </div>
        <div>

          {this.state.showDeleteModal == true ? (
            <ConfirmationModal title={Resources["smartDeleteMessageContent"][currentLanguage]} buttonName="delete" closed={this.onCloseModal}
              showDeleteModal={this.state.showDeleteModal} clickHandlerCancel={this.clickHandlerCancelMain}
              clickHandlerContinue={this.clickHandlerContinueMain.bind(this)} />) : null}
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DrawingSetsAddEdit));
