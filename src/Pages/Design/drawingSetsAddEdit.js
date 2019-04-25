import React, { Component, Fragment } from "react";
import OptionContainer from "../../Componants/OptionsPanels/OptionContainer";
import { Formik, Form } from "formik";
import ReactTable from "react-table";
import "react-table/react-table.css";
import * as Yup from "yup";
import dataservice from "../../Dataservice";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import UploadAttachment from "../../Componants/OptionsPanels/UploadAttachment";
import ViewAttachment from "../../Componants/OptionsPanels/ViewAttachmments";
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import Resources from "../../resources.json";
import ModernDatepicker from "react-modern-datepicker";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Config from "../../Services/Config.js";
import CryptoJS from "crypto-js";
import moment from "moment";
import SkyLight from "react-skylight";
import * as communicationActions from "../../store/actions/communication";
import Distribution from "../../Componants/OptionsPanels/DistributionList";
import SendToWorkflow from "../../Componants/OptionsPanels/SendWorkFlow";
import DocumentApproval from "../../Componants/OptionsPanels/wfApproval";
import { toast } from "react-toastify";
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import Rodal from "../../Styles/js/rodal";
import "../../Styles/css/rodal.css";
import { MapsTransferWithinAStation } from "material-ui/svg-icons";
import save from "material-ui/svg-icons/content/save";
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument'

const _ = require("lodash");

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
          arrange = obj.arrange;

        } catch {
          this.props.history.goBack();
        }
      }
      index++;
    }

    this.state = {
      Stepes: 1,
      showDeleteModal: false,
      isLoading: false,
      isEdit: false,
      currentTitle: "sendToWorkFlow",
      showModal: false,
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

      this.props.history.push("/drawingSets/" + this.state.projectId);
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

      nextProps.document.docDate = moment(nextProps.document.docDate).format('DD/MM/YYYY');

      dataservice.GetRowById("GetLogsDrawingsSetsDocsByProjectId?drawingSetId=" + docId).then(result => {

        this.setState({
          listDrawing: [...result],
          isEdit: true,
          document: this.props.document,
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

  // checkDocumentIsView() {
  //   if (this.props.changeStatus === true) {
  //     if (!Config.IsAllow(212)) {
  //       this.setState({ isViewMode: true });
  //     }

  //     if (this.state.isApproveMode != true && Config.IsAllow(212)) {
  //       if (this.props.hasWorkflow == false && Config.IsAllow(212)) {
  //         if (this.props.document.status !== false && Config.IsAllow(212)) {
  //           this.setState({ isViewMode: false });
  //         } else {
  //           this.setState({ isViewMode: true });
  //         }
  //       } else {
  //         this.setState({ isViewMode: true });
  //       }
  //     }
  //   } else {
  //     this.setState({ isViewMode: false });
  //   }
  // }

  checkDocumentIsView() {
    if (this.props.changeStatus === true) {
        if (!(Config.IsAllow(212))) {
            this.setState({ isViewMode: true });
        }
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
    else {
        this.setState({ isViewMode: false });
    }
}

  componentWillMount() {

    if (this.state.docId > 0) {

      let url = "GetLogsDrawingsSetsForEdit?id=" + this.state.docId;

      this.props.actions.documentForEdit(url, this.state.docTypeId ,'drawingSets');

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

          let targetFieldSelected = _.find(result, function (i) {
            return i.value == toSubField;
          });

          this.setState({
            [subSelectedValue]: targetFieldSelected,
            [subDatasource]: result
          });
        } else {
          let toSubField = this.state.documentCycle[subField];

          let targetFieldSelected = _.find(result, function (i) {
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
    dataservice.GetDataList("GetProjectProjectsCompaniesForList?projectId=" + projectId, "companyName", "companyId").then(result => {
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
    dataservice.GetDataList("GetaccountsDefaultListForList?listType=area", "title", "id").then(result => {

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
    dataservice.GetDataList("GetaccountsDefaultListForList?listType=specssection", "title", "id").then(result => {

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
    dataservice.GetDataList("GetaccountsDefaultListForList?listType=discipline", "title", "id").then(result => {

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
    dataservice.GetDataList("GetaccountsDefaultListForList?listType=reasonForIssue", "title", "id").then(result => {

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

  handleChangeDropDownItems(event, field, isSubscrib, targetState, url, param, selectedValue, subDatasource) {

    if (event == null) return;

    this.setState({
      drawingId: event.value,
      [selectedValue]: event
    });
  }

  editDrawing(event) {

    this.setState({
      isLoading: true
    });

    let saveDocument = this.state.document;

    saveDocument.docDate = moment(saveDocument.docDate, "DD/MM/YYYY").format("YYYY-MM-DD[T]HH:mm:ss.SSS");

    dataservice.addObject("EditLogsDrawingsSets", saveDocument).then(result => {

      this.setState({
        isLoading: false,
        Stepes: this.state.Stepes + 1
      });
    });
  }

  saveDrawing(event) {

    if (this.props.changeStatus === false) {

      this.setState({
        isLoading: true
      });

      let saveDocument = { ...this.state.document };

      saveDocument.docDate = moment(saveDocument.docDate, "DD/MM/YYYY").format("YYYY-MM-DD[T]HH:mm:ss.SSS");

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
      this.setState({
        Stepes: this.state.Stepes + 1
      });
    }
  }

  saveAndExit(event) {

    if (this.state.Stepes === 1) {
      this.setState({
        Stepes: this.state.Stepes + 1
      });
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

    return this.state.docId > 0 ? (Config.IsAllow(3331) === true ? (<ViewAttachment docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} deleteAttachments={896} />) : null) : null;
  }

  handleShowAction = item => {

    if (item.value != "0") {

      this.setState({
        currentComponent: item.value,
        currentTitle: item.title,
        showModal: true
      });

      this.simpleDialog.show();
    }
  };

  NextStep() {

    if (this.state.Stepes === 1) {

      dataservice.GetDataGrid("GetLogsSubmittalItemsBySubmittalId?submittalId=" + this.state.docId).then(data => {

        this.setState({

          itemData: data,
          Stepes: this.state.Stepes + 1
        });
      }).catch(ex => toast.error(Resources["failError"][currentLanguage]));
    } else {
      this.props.history.push("/drawingSets/" + this.state.projectId);
    }
  }

  PreviousStep() {
    if (this.state.Stepes === 2) {
      this.setState({
        Stepes: this.state.Stepes - 1
      });
    }
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

  componentWillUnmount() {   this.props.actions.clearCashDocument();
    this.setState({
      docId: 0
    });
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

    let actions = [
      {
        title: "distributionList",
        value: (<Distribution docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />),
        label: Resources["distributionList"][currentLanguage]
      },
      {
        title: "sendToWorkFlow",
        value: (<SendToWorkflow docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />),
        label: Resources["sendToWorkFlow"][currentLanguage]
      },
      {
        title: "documentApproval",
        value: (<DocumentApproval docTypeId={this.state.docTypeId} docId={this.state.docId} approvalStatus={true} projectId={this.state.projectId} docApprovalId={this.state.docApprovalId} currentArrange={this.state.arrange} />),
        label: Resources["documentApproval"][currentLanguage]
      },
      {
        title: "documentApproval",
        value: (<DocumentApproval docTypeId={this.state.docTypeId} docId={this.state.docId} approvalStatus={false} projectId={this.state.projectId} docApprovalId={this.state.docApprovalId} currentArrange={this.state.arrange} />),
        label: Resources["documentApproval"][currentLanguage]
      }
    ];

    return (
      <div className="mainContainer">
        <div className="documents-stepper noTabs__document one__tab one_step">
        <HeaderDocument projectName={projectName} docTitle={Resources.drawingSets[currentLanguage]} moduleTitle={Resources['communication'][currentLanguage]} />

          <div className="doc-container">
            {/* Right Menu */}
            <div className="step-content">
              <div id="step1" className="step-content-body">
                <div className="subiTabsContent">
                  {this.state.Stepes === 1 ? (
                    <div className="document-fields">
                      <Formik initialValues={this.state.document}
                        validationSchema={validationSchema}
                        enableReinitialize={this.props.changeStatus}
                        onSubmit={values => {
                          if (this.props.changeStatus === true && this.state.docId > 0) {
                            this.editDrawing();
                          } else if (this.props.changeStatus === false && this.state.docId === 0) {
                            this.saveDrawing();
                          } else {
                            this.saveAndExit();
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
                              <div className="linebylineInput valid-input">
                                <div className="inputDev ui input input-group date NormalInputDate">
                                  <div className="customDatepicker fillter-status fillter-item-c ">
                                    <div className="proForm datepickerContainer">
                                      <label className="control-label">
                                        {Resources.docDate[currentLanguage]}
                                      </label>
                                      <div className="linebylineInput">
                                        <div className="inputDev ui input input-group date NormalInputDate">
                                          <ModernDatepicker date={this.state.document.docDate} format={"DD/MM/YYYY"} showBorder
                                            onChange={e => this.handleChangeDate(e, "docDate")} placeholder={"Select a date"} />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
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
                                <Dropdown title="area" data={this.state.areas} selectedValue={this.state.selectedArea}
                                  handleChange={event => this.handleChangeDropDown(event, "area", false, "", "", "", "selectedArea")}
                                  onChange={setFieldValue} onBlur={setFieldTouched} error={errors.area} touched={touched.area}
                                  name="area" id="area" />
                              </div>
                              <div className="linebylineInput valid-input mix_dropdown">
                                <label className="control-label">
                                  {Resources.actionByCompany[currentLanguage]}
                                </label>
                                <div className="supervisor__company">
                                  <div className="super_name">
                                    <Dropdown isMulti={false} data={this.state.fromContacts} selectedValue={this.state.selectedFromContact}
                                      handleChange={event => this.handleChangeDropDown(event, "bicContactId", false, "", "", "", "selectedFromContact")}
                                      onChange={setFieldValue} onBlur={setFieldTouched} error={errors.bicContactId} touched={touched.bicContactId}
                                      name="bicContactId" id="bicContactId" />
                                  </div>
                                  <div className="super_company">
                                    <Dropdown data={this.state.companies} isMulti={false} selectedValue={this.state.selectedFromCompany}
                                      handleChange={event => { this.handleChangeDropDown(event, "bicCompanyId", true, "fromContacts", "GetContactsByCompanyId", "companyId", "selectedFromCompany", "selectedFromContact"); }}
                                      onChange={setFieldValue} onBlur={setFieldTouched} error={errors.fromCompanyId} touched={touched.fromCompanyId} name="fromCompanyId" id="fromCompanyId" />
                                  </div>
                                </div>
                              </div>
                              <div className="linebylineInput valid-input">
                                <Dropdown title="specsSection" data={this.state.specsSection} selectedValue={this.state.selectedSpecsSection}
                                  handleChange={event => this.handleChangeDropDown(event, "specsSectionId", false, "", "", "", "selectedSpecsSection")}
                                  onChange={setFieldValue} onBlur={setFieldTouched} error={errors.specsSectionId}
                                  touched={touched.specsSectionId} name="specsSectionId" id="specsSectionId" />
                              </div>
                              <div className="linebylineInput valid-input">
                                <Dropdown title="disciplineTitle" data={this.state.disciplines} isMulti={false} selectedValue={this.state.selectedDiscpline}
                                  handleChange={event => this.handleChangeDropDown(event, "disciplineId", false, "", "", "", "selectedDiscpline")}
                                  onChange={setFieldValue} onBlur={setFieldTouched} error={errors.disciplineId}
                                  touched={touched.disciplineId} name="disciplineId" id="disciplineId" />
                              </div>
                              <div className="linebylineInput valid-input">
                                <Dropdown title="reasonForIssue"
                                  data={this.state.reasonForIssue}
                                  selectedValue={this.state.selectedReasonForIssue}
                                  handleChange={event => this.handleChangeDropDown(event, "reasonForIssueId", false, "", "", "", "selectedReasonForIssue")}
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
                            onSubmit={values => { this.addDrawingItems(); }}>
                            {({ errors, touched, handleBlur, handleChange, values, handleSubmit, setFieldTouched, setFieldValue }) => (
                              <Form onSubmit={handleSubmit}>
                                <div className="proForm datepickerContainer">
                                  <div className="linebylineInput valid-input">
                                    <div className="inputDev ui input">
                                      <Dropdown isMulti={false} title="drawing" data={this.state.drawing}
                                        selectedValue={this.state.selectedDrawing}
                                        onChange={setFieldValue} onBlur={setFieldTouched}
                                        error={errors.drawing} touched={touched.drawing}
                                        name="drawing" id="drawing"
                                        handleChange={event => this.handleChangeDropDownItems(event, "drawingId", false, "", "", "", "selectedDrawing")} />
                                    </div>
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
                    {this.state.Stepes === 2 ? (
                      <button className="primaryBtn-1 btn meduimBtn" onClick={this.finishDocument.bind(this)}>
                        {Resources["finish"][currentLanguage]}
                      </button>
                    ) : null}
                  </div>
                  <div className="doc-pre-cycle letterFullWidth">
                    <div>
                      {this.state.docId > 0 && this.state.Stepes === 1 ? (<UploadAttachment docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />) : null}
                      {this.state.Stepes === 1 ? this.viewAttachments() : null}
                      {this.props.changeStatus === true ? (<ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {this.props.changeStatus === true && this.state.Stepes === 1 ? (
              <div className="approveDocument">
                <div className="approveDocumentBTNS">
                  {this.state.isApproveMode === true ? (
                    <div>
                      <button className="primaryBtn-1 btn " onClick={e => this.handleShowAction(actions[2])}>
                        {Resources.approvalModalApprove[currentLanguage]}
                      </button>
                      <button className="primaryBtn-2 btn middle__btn" onClick={e => this.handleShowAction(actions[3])}>
                        {Resources.approvalModalReject[currentLanguage]}
                      </button>
                    </div>
                  ) : null}
                  <button className="primaryBtn-2 btn middle__btn" onClick={e => this.handleShowAction(actions[1])}>
                    {Resources.sendToWorkFlow[currentLanguage]}
                  </button>
                  <button className="primaryBtn-2 btn" onClick={e => this.handleShowAction(actions[0])}>
                    {Resources.distributionList[currentLanguage]}
                  </button>
                  <span className="border" />
                  <div className="document__action--menu">
                    <OptionContainer permission={this.state.permission} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                  </div>
                </div>
              </div>
            ) : null}
            {/* step document */}
            <div className="docstepper-levels">
              <div className="step-content-foot">
                <span onClick={this.PreviousStep.bind(this)}
                  className={this.state.Stepes != 1 && this.state.isEdit === true ? "step-content-btn-prev " : "step-content-btn-prev disabled"}>
                  <i className="fa fa-caret-left" aria-hidden="true" />
                  Previous
                </span>
                <span onClick={this.NextStep.bind(this)}
                  className={this.state.Stepes != 2 && this.state.isEdit === true ? "step-content-btn-prev " : "step-content-btn-prev disabled"}>
                  Next
                  <i className="fa fa-caret-right" aria-hidden="true" />
                </span>
              </div>
              <div className="workflow-sliderSteps">
                <div className="step-slider">
                  <div data-id="step1" className={"step-slider-item " + (this.state.Stepes === 1 ? "active" : "current__step")}>
                    <div className="steps-timeline">
                      <span>1</span>
                    </div>
                    <div className="steps-info">
                      <h6>{Resources["Submittal"][currentLanguage]}</h6>
                    </div>
                  </div>
                  <div data-id="step2 " className={"step-slider-item " + (this.state.Stepes === 2 ? "active" : this.state.SecondStepComplate ? "current__step" : "")}>
                    <div className="steps-timeline">
                      <span>2</span>
                    </div>
                    <div className="steps-info">
                      <h6>{Resources["items"][currentLanguage]}</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="largePopup largeModal " style={{ display: this.state.showModal ? "block" : "none" }}>
            <SkyLight hideOnOverlayClicked ref={ref => (this.simpleDialog = ref)} title={Resources[this.state.currentTitle][currentLanguage]}>
              {this.state.currentComponent}
            </SkyLight>
          </div>
          {this.state.showDeleteModal == true ? (
            <ConfirmationModal title={Resources["smartDeleteMessage"][currentLanguage].content} buttonName="delete" closed={this.onCloseModal}
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
    hasWorkflow: state.communication.hasWorkflow
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(communicationActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DrawingSetsAddEdit));
