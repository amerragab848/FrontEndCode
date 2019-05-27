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
import AddItemDescription from '../../Componants/OptionsPanels/addItemDescription';
import { toast } from "react-toastify";
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import Rodal from "../../Styles/js/rodal";
import "../../Styles/css/rodal.css";
import { MapsTransferWithinAStation } from "material-ui/svg-icons";
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument'
const _ = require("lodash");

let selectedRows = [];

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const validationSchema = Yup.object().shape({
  subject: Yup.string().required(Resources["subjectRequired"][currentLanguage]).max(450, Resources["maxLength"][currentLanguage]),
  arrange: Yup.number().required(Resources["arrange"][currentLanguage]),
  companyId: Yup.string().required(Resources["fromCompanyRequired"][currentLanguage]).nullable(true),
  disciplineId: Yup.string().required(Resources["disciplineRequired"][currentLanguage]).nullable(true)
});

const validationSchemaItems = Yup.object().shape({
  details: Yup.string().required(Resources["descriptionRequired"][currentLanguage]).max(450, Resources["maxLength"][currentLanguage]),
  quantity: Yup.number().required(Resources["quantityRequired"][currentLanguage]),
  arrange: Yup.number().required(Resources["arrange"][currentLanguage]),
  unit: Yup.string().required(Resources["selecApartNumber"][currentLanguage]),
  unitPrice: Yup.number().required(Resources["unitPriceRequired"][currentLanguage]),
  revQuantity: Yup.number().required(Resources["revQuantityRequired"][currentLanguage]),
  itemCode: Yup.string().required(Resources["itemCodeRequired"][currentLanguage]),
  resourceCode: Yup.string().required(Resources["resourceCodeRequired"][currentLanguage]),
});

let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let arrange = 0;

class QsAddEdit extends Component {

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
      CurrentStep: 1,
      FirstStep: true,
      SecondStep: false,
      SecondStepComplate: false,
      showDeleteModal: false,
      isLoading: false,
      isEdit: false,
      currentTitle: "sendToWorkFlow",
      showModal: false,
      isViewMode: false,
      isApproveMode: isApproveMode,
      isView: false,
      docId: docId,
      docTypeId: 98,
      projectId: projectId,
      docApprovalId: docApprovalId,
      arrange: arrange,
      document: this.props.document ? Object.assign({}, this.props.document) : {},
      itemDocument: {},
      addItemDocument: {},
      selected: {},
      companies: [],
      disciplines: [],
      contracts: [],
      itemData: [],
      descriptionList: [],
      permission: [
        { name: "sendByEmail", code: 771 },
        { name: "sendByInbox", code: 770 },
        { name: "sendTask", code: 0 },
        { name: "distributionList", code: 972 },
        { name: "createTransmittal", code: 3058 },
        { name: "sendToWorkFlow", code: 774 },
        { name: "viewAttachments", code: 3296 },
        { name: "deleteAttachments", code: 854 }
      ],
      selectedFromCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
      selectedFromContact: { label: Resources.fromContactRequired[currentLanguage], value: "0" },
      selectedFromCompanyCycles: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
      selectedFromContactCycles: { label: Resources.fromContactRequired[currentLanguage], value: "0" },
      selectedContract: { label: Resources.specsSectionSelection[currentLanguage], value: "0" }
    };

    if (!Config.IsAllow(765) && !Config.IsAllow(766) && !Config.IsAllow(768)) {

      toast.warn(Resources["missingPermissions"][currentLanguage]);
      this.props.history.push("/qs/" + this.state.projectId);
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

      nextProps.document.docDate = nextProps.document.docDate != null ? moment(nextProps.document.docDate).format("DD/MM/YYYY") : moment();

      this.setState({
        isEdit: true,
        document: this.props.document,
        hasWorkflow: this.props.hasWorkflow
      });

      this.fillDropDowns(nextProps.document.id > 0 ? true : false);


      this.checkDocumentIsView();
    }
    if (this.state.showModal != nextProps.showModal) {
      this.setState({ showModal: nextProps.showModal });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.hasWorkflow !== prevProps.hasWorkflow || this.props.changeStatus !== prevProps.changeStatus) {
      this.checkDocumentIsView();
    }
  }

  checkDocumentIsView() {
    if (this.props.changeStatus === true) {
      if (!Config.IsAllow(766)) {
        this.setState({ isViewMode: true });
      }
      if (this.state.isApproveMode != true && Config.IsAllow(766)) {
        if (this.props.hasWorkflow == false && Config.IsAllow(766)) {
          if (this.props.document.status !== false && Config.IsAllow(766)) {
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
    //field
    const itemDocument = {
      id: 0,
      qsId: "",
      details: "",
      quantity: "",
      arrange: "",
      unit: "",
      unitPrice: "",
      revQuantity: "",
      itemCode: "",
      resourceCode: "",
      itemType: ""
    };

    if (this.state.docId > 0) {
      let url = "GetContractsQsForEdit?id=" + this.state.docId;

      this.props.actions.documentForEdit(url, this.state.docTypeId, 'contractsQs');


      dataservice.GetDataGrid("GetContractsQsItems?qsId=" + docId).then(result => {
        this.props.actions.addItemDescription(result);
      });

      this.setState({
        addItemDocument: itemDocument
      });
    } else {
      //field
      const qsDocument = {
        id: 0,
        projectId: projectId,
        arrange: "1",
        status: "true",
        contractId: "",
        companyId: "",
        subject: "",
        disciplineId: "",
        contactId: "",
        docDate: moment()
      };

      this.setState({
        document: qsDocument,
        addItemDocument: itemDocument
      });

      this.fillDropDowns(false);
      this.props.actions.documentForAdding();
    }
  }

  fillDropDowns(isEdit) {
    //from Companies
    dataservice.GetDataList("GetProjectProjectsCompaniesForList?projectId=" + projectId, "companyName", "companyId").then(result => {

      if (isEdit) {

        let companyId = this.props.document.companyId;

        if (companyId) {
          this.setState({
            selectedFromCompany: { label: this.props.document.companyName, value: companyId }
          });
        }
      }

      this.setState({
        companies: [...result]
      });
    });

    //discplines
    dataservice.GetDataList("GetaccountsDefaultListForList?listType=discipline", "title", "id").then(result => {

      if (isEdit) {

        let disciplineId = this.props.document.disciplineId;

        if (disciplineId) {
          let disciplineName = result.find(i => i.value === disciplineId);

          this.setState({
            selectedDiscpline: { ...disciplineName }
          });
        }
      }

      this.setState({
        disciplines: [...result]
      });
    });

    //contractList
    dataservice.GetDataList("GetContractsForList?projectId=" + projectId, "subject", "id").then(result => {

      if (isEdit) {

        let contactId = this.props.document.contractId;

        let contact = {};

        if (contactId) {
          let contact = result.find(i => i.value === contactId);

          this.setState({
            selectedContract: { ...contact }
          });
        }
      }
      this.setState({
        contracts: [...result]
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

  handleChangeItems(e, field) {

    let original_document = { ...this.state.addItemDocument };

    let updated_document = {};

    updated_document[field] = e.target.value;

    updated_document = Object.assign(original_document, updated_document);

    this.setState({
      addItemDocument: updated_document
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

    if (field == "companyId") {

      let url = "GetNextArrangeMainDoc?projectId=" + this.state.projectId + "&docType=" + this.state.docTypeId + "&companyId=" + event.value + "&contactId=" + null;

      dataservice.GetNextArrangeMainDocument(url).then(res => {

        updated_document.arrange = res;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
          document: updated_document
        });
      });
    }

    this.setState({
      document: updated_document,
      [selectedValue]: event
    });
  }

  handleChangeDropDownItems(event, field, isSubscrib, targetState, url, param, selectedValue, subDatasource) {

    if (event == null) return;

    let original_document = { ...this.state.addItemDocument };

    let updated_document = {};

    updated_document[field] = event.value;

    updated_document = Object.assign(original_document, updated_document);

    if (field === "contractId") {

      let url = "GetContractOrderByContractId?contractId=" + event.value;

      dataservice.GetDataList(url, "details", "id").then(result => {
        this.setState({
          descriptionList: [...result]
        });
      });
    }

    this.setState({
      addItemDocument: updated_document,
      [selectedValue]: event
    });
  }

  editQs(event) {
    this.setState({
      isLoading: true
    });

    let saveDocument = this.state.document;

    saveDocument.docDate = moment(saveDocument.docDate, "DD/MM/YYYY").format("YYYY-MM-DD[T]HH:mm:ss.SSS");

    dataservice.addObject("EditContractsQs", saveDocument).then(result => {
      this.setState({
        isLoading: false,
        CurrentStep: this.state.CurrentStep + 1
      });
      toast.success(Resources["operationSuccess"][currentLanguage]);
    });
  }

  saveQs(event) {

    if (this.props.changeStatus === false) {

      this.setState({
        isLoading: true
      });

      let saveDocument = { ...this.state.document };

      saveDocument.docDate = moment(saveDocument.docDate, "DD/MM/YYYY").format("YYYY-MM-DD[T]HH:mm:ss.SSS");

      dataservice.addObject("AddContractsQs", saveDocument).then(result => {

        this.setState({
          docId: result.id,
          isLoading: false
        });

        toast.success(Resources["operationSuccess"][currentLanguage]);
      }).catch(ex => {
        this.setState({
          isLoading: false
        });

        toast.error(Resources["failError"][currentLanguage]);
      });
    } else {
      this.setState({
        CurrentStep: this.state.CurrentStep + 1
      });
    }
  }

  saveAndExit(event) {
    if (this.state.CurrentStep === 1) {
      this.setState({
        CurrentStep: this.state.CurrentStep + 1
      });
    } else {
      this.props.history.push("/qs/" + this.state.projectId);
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
      Config.IsAllow(3296) === true ?
        (<ViewAttachment docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} deleteAttachments={854} />) : null) : null;
  }

  handleShowAction = item => {
    if (item.value != "0") { this.props.actions.showOptionPanel(false); 
      this.setState({
        currentComponent: item.value,
        currentTitle: item.title,
        showModal: true
      });

      this.simpleDialog.show();
    }
  };

  NextStep() {
    if (this.state.CurrentStep === 1) {

      //field
      const itemDocument = {
        id: 0,
        qsId: "",
        details: "",
        quantity: "",
        arrange: "",
        unit: "",
        unitPrice: "",
        revQuantity: "",
        itemCode: "",
        resourceCode: "",
        itemType: ""
      };

      this.setState({
        addItemDocument: itemDocument,
        CurrentStep: this.state.CurrentStep + 1,
        FirstStep: false,
        SecondStep: true,
        SecondStepComplate: true,
      });

    } else {
      this.props.history.push("/qs/" + this.state.projectId);
    }
  }

  PreviousStep() {
    if (this.state.CurrentStep === 2) {
      this.setState({
        CurrentStep: this.state.CurrentStep - 1,
        FirstStep: true,
        SecondStep: false,
        SecondStepComplate: false,
      });
    }
  }

  toggleRow(obj) {

    const newSelected = Object.assign({}, this.state.selected);

    newSelected[obj.id] = !this.state.selected[obj.id];

    let setIndex = selectedRows.findIndex(x => x.id === obj.id);

    if (setIndex > -1) {
      selectedRows.splice(setIndex, 1);
    } else {
      selectedRows.push(obj);
    }

    this.setState({
      selected: newSelected
    });
  }

  finishDocument() {
    this.props.history.push("/qs/" + this.state.projectId);
  }

  onCloseModal = () => {
    this.setState({ showDeleteModal: false });
  };

  clickHandlerCancelMain = () => {
    this.setState({ showDeleteModal: false });
  };

  clickHandlerContinueMain = () => {
    if (selectedRows.length > 0) {

      let listIds = selectedRows.map(rows => rows.id);
      this.props.actions.deleteItemDescription(selectedRows)
      dataservice.addObject("DeleteMultipleContractsQsItems", listIds).then(result => {

        selectedRows = [];

        this.setState({
          showDeleteModal: false
        });

        toast.success(Resources["operationSuccess"][currentLanguage]);
      }).catch(ex => {
        toast.success(Resources["operationSuccess"][currentLanguage]);
      });
    }
  };

  DeleteDocumentAttachment() {
    this.setState({
      showDeleteModal: true
    });
  }

  closeModal() {
    this.setState({
      viewForEdit: false
    });
  }

  viewModelToEdit(rows, type) {

    if (type != "checkbox") {
      this.setState({
        addItemDocument: rows,
        viewForEdit: true
      });
    }
  }

  editItems() {
    this.setState({
      isLoading: true
    });

    let EditData = this.state.addItemDocument;
    let editData = []
    editData.push(EditData)
    dataservice.addObject("EditContractsQsItems", EditData).then(data => {

      this.props.actions.deleteItemDescription(editData)
      this.props.actions.addItemDescription(editData)

      this.setState({
        viewForEdit: false,
        isLoading: false
      });

      toast.success(Resources["operationSuccess"][currentLanguage]);
    }).catch(ex => {
      toast.error(Resources["failError"][currentLanguage]);
    });
  }

  viewConfirmDeleteCycle(id) {
    this.setState({
      showDeleteModal: true,
    });
  }

  componentWillUnmount() {
    this.props.actions.clearCashDocument();
    this.setState({
      docId: 0
    });
  }


  StepOneLink = () => {
    if (docId !== 0) {
      this.setState({
        FirstStep: true,
        SecondStepComplate: false,
        CurrentStep: 1,
      })
    }
  }

  StepTwoLink = () => {
    if (docId !== 0) {
      this.setState({
        FirstStep: true,
        SecondStepComplate: true,
        CurrentStep: 2,
      })
    }
  }


  render() {

    const columnsItems = [
      {
        Header: Resources["arrange"][currentLanguage],
        accessor: "arrange",
        sortabel: true,
        width: 80
      },
      {
        Header: Resources["details"][currentLanguage],
        accessor: "details",
        width: 200,
        sortabel: true
      },
      {
        Header: Resources["quantity"][currentLanguage],
        accessor: "quantity",
        width: 200,
        sortabel: true
      },
      {
        Header: Resources["revQuantity"][currentLanguage],
        accessor: "revQuantity",
        width: 200,
        sortabel: true
      },
      {
        Header: Resources["unit"][currentLanguage],
        accessor: "unit",
        width: 200,
        sortabel: true
      },
      {
        Header: Resources["unitPrice"][currentLanguage],
        accessor: "unitPrice",
        width: 200,
        sortabel: true
      },
      {
        Header: Resources["total"][currentLanguage],
        accessor: "total",
        width: 200,
        sortabel: true
      },
      {
        Header: Resources["resourceCode"][currentLanguage],
        accessor: "resourceCode",
        width: 200,
        sortabel: true
      }
    ];

    const columns = [
      {
        Header: Resources["checkList"][currentLanguage],
        id: "checkbox",
        accessor: "id",
        Cell: ({ row }) => {
          return (
            <div className="ui checked checkbox  checkBoxGray300 ">
              <input
                type="checkbox"
                className="checkbox"
                checked={this.state.selected[row._original.id] === true}
                onChange={() => this.toggleRow(row._original)}
              />
              <label />
            </div>
          );
        },
        width: 50
      },
      {
        Header: Resources["arrange"][currentLanguage],
        accessor: "arrange",
        sortabel: true,
        width: 80
      },
      {
        Header: Resources["details"][currentLanguage],
        accessor: "details",
        width: 200,
        sortabel: true
      },
      {
        Header: Resources["quantity"][currentLanguage],
        accessor: "quantity",
        width: 200,
        sortabel: true
      },
      {
        Header: Resources["revQuantity"][currentLanguage],
        accessor: "revQuantity",
        width: 200,
        sortabel: true
      },
      {
        Header: Resources["unit"][currentLanguage],
        accessor: "unit",
        width: 200,
        sortabel: true
      },
      {
        Header: Resources["unitPrice"][currentLanguage],
        accessor: "unitPrice",
        width: 200,
        sortabel: true
      },
      {
        Header: Resources["total"][currentLanguage],
        accessor: "total",
        width: 200,
        sortabel: true
      },
      {
        Header: Resources["resourceCode"][currentLanguage],
        accessor: "resourceCode",
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
        <HeaderDocument projectName={projectName}  isViewMode={this.state.isViewMode} docTitle={Resources.contractsQs[currentLanguage]} moduleTitle={Resources['contracts'][currentLanguage]} />
          <div className="doc-container">
            {/* Right Menu */}
            <div className="step-content">
              <div id="step1" className="step-content-body">
                <div className="subiTabsContent">
                  {this.state.CurrentStep === 1 ? (
                    <div className="document-fields">
                      <Formik initialValues={this.state.document}
                        validationSchema={validationSchema}
                        enableReinitialize={this.props.changeStatus}
                        onSubmit={values => {
                          if (this.props.changeStatus === true && this.state.docId > 0) {
                            this.editQs();
                          } else if (this.props.changeStatus === false && this.state.docId === 0) {
                            this.saveQs();
                          } else {
                            this.saveAndExit();
                          }
                        }}>
                        {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                          <Form id="QsForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>
                            <div className="proForm first-proform">
                              <div className="linebylineInput valid-input">
                                <label className="control-label">
                                  {Resources.subject[currentLanguage]}
                                </label>
                                <div className={"ui input inputDev fillter-item-c " + (errors.subject && touched.subject ? "has-error" : !errors.subject && touched.subject ? "has-success" : "")}>
                                  <input name="subject" className="form-control fsadfsadsa" placeholder={Resources.subject[currentLanguage]}
                                    autoComplete="off" value={this.state.document.subject} onBlur={e => { handleBlur(e); handleChange(e); }}
                                    onChange={e => this.handleChange(e, "subject")} />
                                  {errors.subject && touched.subject ? (<span className="glyphicon glyphicon-remove form-control-feedback spanError" />) :
                                    !errors.subject && touched.subject ? (<span className="glyphicon form-control-feedback glyphicon-ok" />) : null}
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
                                    value="false" onChange={e => this.handleChange(e, "status")} />
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
                                <div className={"ui input inputDev fillter-item-c " + (errors.arrange && touched.arrange ? "has-error" : !errors.arrange && touched.arrange ? "has-success" : "")}>
                                  <input type="text" className="form-control" readOnly value={this.state.document.arrange} name="arrange"
                                    placeholder={Resources.arrange[currentLanguage]}
                                    onBlur={e => { handleChange(e); handleBlur(e); }} onChange={e => this.handleChange(e, "arrange")} />
                                  {errors.arrange && touched.arrange ? (<span className="glyphicon glyphicon-remove form-control-feedback spanError" />)
                                    : !errors.arrange && touched.arrange ? (<span className="glyphicon form-control-feedback glyphicon-ok" />) : null}
                                  {errors.arrange && touched.arrange ? (<em className="pError">{errors.arrange}</em>) : null}
                                </div>
                              </div>
                              <div className="linebylineInput valid-input">
                                <Dropdown title="fromCompany" data={this.state.companies} isMulti={false} selectedValue={this.state.selectedFromCompany}
                                  handleChange={event => this.handleChangeDropDown(event, "companyId", false, "", "", "", "selectedFromCompany")}
                                  onChange={setFieldValue} onBlur={setFieldTouched} error={errors.companyId}
                                  touched={touched.companyId} name="companyId" id="companyId" />
                              </div>

                              <div className="linebylineInput valid-input">
                                <Dropdown title="disciplineTitle" data={this.state.disciplines} isMulti={false}
                                  selectedValue={this.state.selectedDiscpline}
                                  handleChange={event => this.handleChangeDropDown(event, "disciplineId", false, "", "", "", "selectedDiscpline")}
                                  onChange={setFieldValue} onBlur={setFieldTouched} error={errors.disciplineId}
                                  touched={touched.disciplineId} name="disciplineId" id="disciplineId" />
                              </div>
                              <div className="linebylineInput valid-input fullInputWidth">

                                <Dropdown title="contract" isMulti={false}
                                  data={this.state.contracts} selectedValue={this.state.selectedContract}
                                  handleChange={event => this.handleChangeDropDown(event, "contractId", false, "", "", "", "selectedContract")}
                                  onChange={setFieldValue} onBlur={setFieldTouched} error={errors.contract}
                                  touched={touched.contract} name="contract" id="contract" index="contract" />
                              </div>
                            </div>
                            <div className="slider-Btns">
                              {this.state.isViewMode === false ?
                                this.state.isLoading === false ?
                                  (<button className="primaryBtn-1 btn meduimBtn" type="submit">
                                    {this.state.docId > 0 ? Resources["next"][currentLanguage] : Resources["save"][currentLanguage]}
                                  </button>
                                  ) : (
                                    <button className="primaryBtn-1 btn disabled">
                                      <div className="spinner">
                                        <div className="bounce1" />
                                        <div className="bounce2" />
                                        <div className="bounce3" />
                                      </div>
                                    </button>
                                  ) : null}
                            </div>
                          </Form>
                        )}
                      </Formik>
                      <br />
                      <br />
                      {this.props.changeStatus ? (
                        <Fragment>
                          <header className="main__header">
                            <div className="main__header--div">
                              <h2 className="zero">
                                {Resources["items"][currentLanguage]}
                              </h2>
                            </div>
                          </header>
                          <div className="precycle-grid">
                            <ReactTable data={this.props.items} columns={columnsItems} defaultPageSize={5} minRows={2}
                              noDataText={Resources["noData"][currentLanguage]} className="-striped -highlight" />
                          </div>
                        </Fragment>
                      ) : null}
                    </div>
                  ) : (
                      <Fragment>
                        <div className="document-fields">
                          <AddItemDescription docLink="/Downloads/Excel/QS.xlsx" showImportExcel={true} docType="qs"
                            isViewMode={this.state.isViewMode} mainColumn="qsId" addItemApi="AddContractsQsItems"
                            projectId={this.state.projectId} showItemType={true} />
                        </div>

                        {/* فاضل جزء عمل popup for createPaymentRequisitions */}
                        <div className="letterFullWidth" style={{ textAlign: 'right', marginBottom: '20px' }}>
                          <button className="primaryBtn-1 btn meduimBtn" type="submit">
                            {Resources["createPaymentRequisitions"][currentLanguage]}
                          </button>
                        </div>
                        <div className="precycle-grid">
                          <div className="reactTableActions">
                            {selectedRows.length > 0 ? (
                              <div className={"gridSystemSelected " + (selectedRows.length > 0 ? " active" : "")}>
                                <div className="tableselcted-items">
                                  <span id="count-checked-checkboxes">
                                    {selectedRows.length}
                                  </span>
                                  <span>Selected</span>
                                </div>
                                <div className="tableSelctedBTNs">
                                  <button className="defaultBtn btn smallBtn" onClick={this.DeleteDocumentAttachment.bind(this)}>
                                    {Resources["delete"][currentLanguage]}
                                  </button>
                                </div>
                              </div>
                            ) : null}
                            <ReactTable data={this.props.items} columns={columns} defaultPageSize={5} minRows={2}
                              noDataText={Resources["noData"][currentLanguage]} className="-striped -highlight"
                              getTrProps={(state, rowInfo, column, instance) => {
                                return { onClick: e => { this.viewModelToEdit(rowInfo.original, e.target.type); } };
                              }} />
                          </div>
                        </div>
                      </Fragment>
                    )}
                  <div className="slider-Btns">
                    {this.state.CurrentStep === 2 && this.state.isViewMode === false ? (
                      <button className="primaryBtn-1 btn meduimBtn" onClick={this.finishDocument.bind(this)}>
                        {Resources["finish"][currentLanguage]}
                      </button>
                    ) : null}
                  </div>
                  <div className="doc-pre-cycle letterFullWidth">
                    <div>
                      {this.state.docId > 0 && this.state.isViewMode === false && this.state.CurrentStep === 1 ? (<UploadAttachment changeStatus={this.props.changeStatus} AddAttachments={853} EditAttachments={3255} ShowDropBox={3567} ShowGoogleDrive={3568} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId}/>) : null}
                      {this.state.CurrentStep === 1 ? this.viewAttachments() : null}
                      {this.props.changeStatus === true ? (<ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {this.props.changeStatus === true && this.state.CurrentStep === 1 ? (
              <div className="approveDocument">
                <div className="approveDocumentBTNS">
                  {this.state.isApproveMode === true ? (
                    <div>
                      <button type="button" className="primaryBtn-1 btn " onClick={e => this.handleShowAction(actions[2])}>
                        {Resources.approvalModalApprove[currentLanguage]}
                      </button>
                      <button type="button" className="primaryBtn-2 btn middle__btn" onClick={e => this.handleShowAction(actions[3])}>
                        {Resources.approvalModalReject[currentLanguage]}
                      </button>
                    </div>
                  ) : null}
                  <button type="button" className="primaryBtn-2 btn middle__btn" onClick={e => this.handleShowAction(actions[1])}>
                    {Resources.sendToWorkFlow[currentLanguage]}
                  </button>
                  <button type="button" className="primaryBtn-2 btn" onClick={e => this.handleShowAction(actions[0])}>
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
                  className={this.state.CurrentStep !== 1 && this.state.isEdit === true ? "step-content-btn-prev " : "step-content-btn-prev disabled"}>
                  <i className="fa fa-caret-left" aria-hidden="true" />
                  Previous
                </span>
                <span
                  onClick={this.NextStep.bind(this)}
                  className={ this.state.isEdit === true ? "step-content-btn-prev " : "step-content-btn-prev disabled"}>
                  Next
                  <i className="fa fa-caret-right" aria-hidden="true" />
                </span>
              </div>
              <div className="workflow-sliderSteps">
                <div className="step-slider">
                <div onClick={this.StepOneLink} data-id="step1" className={'step-slider-item ' + (this.state.SecondStepComplate ? "active" : 'current__step')} >
                    <div className="steps-timeline">
                      <span>1</span>
                    </div>
                    <div className="steps-info">
                      <h6>{Resources["quantitySurvey"][currentLanguage]}</h6>
                    </div>
                  </div>
                  <div onClick={this.StepTwoLink} data-id="step2 " className={'step-slider-item ' + (this.state.ThirdStepComplate ? 'active' : this.state.SecondStepComplate ? "current__step" : "")} >
                    <div className="steps-timeline">
                      <span>2</span>
                    </div>
                    <div className="steps-info">
                      <h6>
                        {Resources["quantitySurveyItems"][currentLanguage]}
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
         
          </div>
        </div>
        <div>
          <div className="largePopup largeModal " style={{ display: this.state.showModal ? "block" : "none" }} >
            <SkyLight hideOnOverlayClicked ref={ref => (this.simpleDialog = ref)} title={Resources[this.state.currentTitle][currentLanguage]}>
              {this.state.currentComponent}
            </SkyLight>
          </div>
          {this.state.showDeleteModal == true ? (
            <ConfirmationModal title={Resources["smartDeleteMessage"][currentLanguage].content} buttonName="delete" closed={this.onCloseModal}
              showDeleteModal={this.state.showDeleteModal}
              clickHandlerCancel={this.clickHandlerCancelMain}
              clickHandlerContinue={this.clickHandlerContinueMain.bind(this)} />
          ) : null}
          {this.state.viewForEdit ? (
            /* AddItems */
            <Fragment>
              <Rodal visible={this.state.viewForEdit} onClose={this.closeModal.bind(this)}>
                <div className="ui modal largeModal ">
                  <Formik initialValues={{ ...this.state.addItemDocument }}
                    validationSchema={validationSchemaItems}
                    enableReinitialize={true}
                    onSubmit={values => { this.editItems(); }}>
                    {({ errors, touched, handleBlur, handleChange, values, handleSubmit, setFieldTouched, setFieldValue }) => (
                      <Form className="dropWrapper" onSubmit={handleSubmit}>
                        <div className=" proForm customProform">
                          <div className="fillter-status fillter-item-c">
                            <label className="control-label">
                              {Resources["description"][currentLanguage]}
                            </label>
                            <div className="inputDev ui input">
                              <input name="details" className="form-control fsadfsadsa" id="details"
                                placeholder={Resources.details[currentLanguage]} autoComplete="off"
                                value={this.state.addItemDocument.details}
                                onBlur={e => { handleBlur(e); handleChange(e); }}
                                onChange={e => this.handleChangeItems(e, "details")} />
                              {errors.details && touched.details ? (<em className="pError">{errors.details}</em>) : null}
                            </div>
                          </div>
                          <div className="fillter-status fillter-item-c">
                            <label className="control-label">
                              {Resources["quantity"][currentLanguage]}
                            </label>
                            <div className="inputDev ui input">
                              <input name="quantity" className="form-control fsadfsadsa" id="quantity"
                                placeholder={Resources.quantity[currentLanguage]} autoComplete="off"
                                value={this.state.addItemDocument.quantity}
                                onBlur={e => { handleBlur(e); handleChange(e); }}
                                onChange={e => this.handleChangeItems(e, "quantity")} />
                              {errors.Quantity && touched.Quantity ? (<em className="pError">{errors.Quantity}</em>) : null}
                            </div>
                          </div>
                          <div className="fillter-status fillter-item-c">
                            <label className="control-label">
                              {Resources["arrange"][currentLanguage]}
                            </label>
                            <div className="inputDev ui input">
                              <input name="arrange" className="form-control fsadfsadsa" id="arrange"
                                placeholder={Resources.arrange[currentLanguage]} autoComplete="off"
                                value={this.state.addItemDocument.arrange}
                                onBlur={e => { handleBlur(e); handleChange(e); }}
                                onChange={e => this.handleChangeItems(e, "arrange")} />
                              {errors.arrange && touched.arrange ? (<em className="pError">{errors.arrange}</em>) : null}
                            </div>
                          </div>
                          <div className="fillter-status fillter-item-c">
                            <label className="control-label">
                              {Resources["unit"][currentLanguage]}
                            </label>
                            <div className="inputDev ui input">
                              <input name="unit" className="form-control fsadfsadsa" id="unit"
                                placeholder={Resources.unit[currentLanguage]} autoComplete="off"
                                value={this.state.addItemDocument.unit}
                                onBlur={e => { handleBlur(e); handleChange(e); }}
                                onChange={e => this.handleChangeItems(e, "unit")} />
                              {errors.unit && touched.unit ? (<em className="pError">{errors.unit}</em>) : null}
                            </div>
                          </div>
                          <div className="fillter-status fillter-item-c">
                            <label className="control-label">
                              {Resources["unitPrice"][currentLanguage]}
                            </label>
                            <div className="inputDev ui input">
                              <input name="unitPrice" className="form-control fsadfsadsa" id="unitPrice"
                                placeholder={Resources.unitPrice[currentLanguage]} autoComplete="off"
                                value={this.state.addItemDocument.unitPrice}
                                onBlur={e => { handleBlur(e); handleChange(e); }}
                                onChange={e => this.handleChangeItems(e, "unitPrice")} />
                              {errors.unitPrice && touched.unitPrice ? (<em className="pError">{errors.unitPrice}</em>) : null}
                            </div>
                          </div>
                          <div className="fillter-status fillter-item-c">
                            <label className="control-label">
                              {Resources["revQuantity"][currentLanguage]}
                            </label>
                            <div className="inputDev ui input">
                              <input name="revQuantity" className="form-control fsadfsadsa" id="revQuantity"
                                placeholder={Resources.revQuantity[currentLanguage]} autoComplete="off"
                                value={this.state.addItemDocument.revQuantity}
                                onBlur={e => { handleBlur(e); handleChange(e); }}
                                onChange={e => this.handleChangeItems(e, "revQuantity")} />
                              {errors.revQuantity && touched.revQuantity ? (<em className="pError">{errors.revQuantity}</em>) : null}
                            </div>
                          </div>
                          <div className="fillter-status fillter-item-c">
                            <label className="control-label">
                              {Resources["itemCode"][currentLanguage]}
                            </label>
                            <div className="inputDev ui input">
                              <input name="itemCode" className="form-control fsadfsadsa" id="itemCode"
                                placeholder={Resources.itemCode[currentLanguage]} autoComplete="off"
                                value={this.state.addItemDocument.itemCode}
                                onBlur={e => { handleBlur(e); handleChange(e); }}
                                onChange={e => this.handleChangeItems(e, "itemCode")} />
                              {errors.itemCode && touched.itemCode ? (<em className="pError">{errors.itemCode}</em>) : null}
                            </div>
                          </div>
                          <div className="fillter-status fillter-item-c">
                            <label className="control-label">
                              {Resources["resourceCode"][currentLanguage]}
                            </label>
                            <div className="inputDev ui input">
                              <input name="resourceCode" className="form-control fsadfsadsa" id="resourceCode"
                                placeholder={Resources.resourceCode[currentLanguage]} autoComplete="off"
                                value={this.state.addItemDocument.resourceCode}
                                onBlur={e => { handleBlur(e); handleChange(e); }}
                                onChange={e => this.handleChangeItems(e, "resourceCode")} />
                              {errors.resourceCode && touched.resourceCode ? (<em className="pError">{errors.resourceCode}</em>) : null}
                            </div>
                          </div>
                          <div className="slider-Btns fullWidthWrapper">
                            {this.state.isLoading === false ? (
                              <button className="primaryBtn-1 btn meduimBtn" type="submit">
                                {Resources["goEdit"][currentLanguage]}
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
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </Rodal>
            </Fragment>
          ) : null}
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
    items: state.communication.items,
    docId: state.communication.docId
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(communicationActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(QsAddEdit));
