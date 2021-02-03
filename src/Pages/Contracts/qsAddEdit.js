import React, { Component, Fragment } from "react";
import { Formik, Form } from "formik";
import ReactTable from "react-table";
import * as Yup from "yup";
import dataservice from "../../Dataservice";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import UploadAttachment from "../../Componants/OptionsPanels/UploadAttachmentWithProgress";
import ViewAttachment from "../../Componants/OptionsPanels/ViewAttachmments";
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import Resources from "../../resources.json";
import DatePicker from '../../Componants/OptionsPanels/DatePicker'
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Config from "../../Services/Config.js";
import CryptoJS from "crypto-js";
import moment from "moment";
import SkyLight from "react-skylight";
import * as communicationActions from "../../store/actions/communication";
//import AddItemDescription from '../../Componants/OptionsPanels/AddItemDescription';
import { toast } from "react-toastify";
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument'
import DocumentActions from '../../Componants/OptionsPanels/DocumentActions'
import Steps from "../../Componants/publicComponants/Steps";


var steps_defination = [];
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
});

let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let perviousRoute = '';
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
          perviousRoute = obj.perviousRoute;
          arrange = obj.arrange;

        } catch {
          this.props.history.goBack();
        }
      }
      index++;
    }

    this.state = {
      CurrentStep: 0,
      showDeleteModal: false,
      isLoading: false,
      isEdit: false,
      isViewMode: false,
      isApproveMode: isApproveMode,
      isView: false,
      docId: docId,
      docTypeId: 98,
      projectId: projectId,
      docApprovalId: docApprovalId,
      perviousRoute: perviousRoute,
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
      this.props.history.push(
        this.state.perviousRoute
      );
    }
    steps_defination = [
      {
        name: "quantitySurvey",
        callBackFn: null
      },
      {
        name: "quantitySurveyItems",
        callBackFn: null
      }
    ];
  }
 
  componentWillReceiveProps(nextProps, prevProps) {
    if (nextProps.document.id) {

      nextProps.document.docDate = nextProps.document.docDate != null ? moment(nextProps.document.docDate).format('YYYY-MM-DD') : moment();

      this.setState({
        isEdit: true,
        document: nextProps.document,
        hasWorkflow: this.props.hasWorkflow
      });

      this.fillDropDowns(nextProps.document.id > 0 ? true : false);


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
      if (!Config.IsAllow(766)) {
        this.setState({ isViewMode: true });
      }
      if (Config.getUserTypeIsAdmin() === true) {
        this.setState({ isViewMode: false });
      } else {
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
      }
    } else {
      this.setState({ isViewMode: false });
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

      this.GetQsItems();

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
    dataservice.GetDataListCached("GetProjectProjectsCompaniesForList?projectId=" + projectId, "companyName", "companyId", 'companies', this.state.projectId, "projectId").then(result => {

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
    dataservice.GetDataListCached("GetaccountsDefaultListForList?listType=discipline", "title", "id", 'defaultLists', "discipline", "listType").then(result => {

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



    let original_document = { ...this.state.document };

    let updated_document = {};

      if (event == null) {
        updated_document[field] = event;
    }
    else{
        updated_document[field] = event.value;
    }

    updated_document = Object.assign(original_document, updated_document);

    if (field == "companyId") {
       if(event ===null){
        updated_document.arrange = "";
  
        updated_document = Object.assign(original_document, updated_document);

        this.setState({
          document: updated_document
        });
       }
       else{
        let url = "GetNextArrangeMainDoc?projectId=" + this.state.projectId + "&docType=" + this.state.docTypeId + "&companyId=" + event.value + "&contactId=" + null;

        dataservice.GetNextArrangeMainDocument(url).then(res => {
  
          updated_document.arrange = res;
  
          updated_document = Object.assign(original_document, updated_document);
  
          this.setState({
            document: updated_document
          });
        });
       }
     
    }

    this.setState({
      document: updated_document,
      [selectedValue]: event
    });
  }

  handleChangeDropDownItems(event, field, isSubscrib, targetState, url, param, selectedValue, subDatasource) {

    

    let original_document = { ...this.state.addItemDocument };

    let updated_document = {};

    if (event == null) {
        updated_document[field] = event;
    }
    else{
        updated_document[field] = event.value;
    };

    updated_document = Object.assign(original_document, updated_document);

    if (field === "contractId") {
       if(event===null){
        this.setState({
          descriptionList: []
        });
       }else{
        let url = "GetContractOrderByContractId?contractId=" + event.value;

        dataservice.GetDataList(url, "details", "id").then(result => {
          this.setState({
            descriptionList: [...result]
          });
        });
       }
   
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

    saveDocument.docDate = moment(saveDocument.docDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");
    this.changeCurrentStep(1);
    dataservice.addObject("EditContractsQs", saveDocument).then(result => {
      this.setState({
        isLoading: false,
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

      saveDocument.docDate = moment(saveDocument.docDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");

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
      this.changeCurrentStep(1);
    }
  }

  saveAndExit(event) {
    this.changeCurrentStep(this.state.CurrentStep + 1);
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
        (<ViewAttachment isApproveMode={this.state.isApproveMode} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} deleteAttachments={854} />) : null) : null;
  }

  showOptionPanel = () => {
    this.props.actions.showOptionPanel(true);
  }

  changeCurrentStep = stepNo => {
    if (stepNo == 1) {
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
      this.setState({ CurrentStep: stepNo, addItemDocument: itemDocument })
      import(`../../Componants/OptionsPanels/AddItemDescription`).then(module => {
        this.setState({ AddItemDescription: module.default })
      });
    }
    else
      this.setState({ CurrentStep: stepNo });
  };

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
      this.simpleDialogForEdit.show();
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

  GetQsItems = () => {
    dataservice.GetDataGrid("GetContractsQsItems?qsId=" + docId).then(result => {
      this.props.actions.addExcelItems(result);
    });
  }

  render() {
    const AddItemDescription = this.state.AddItemDescription
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
    return (
      <div className="mainContainer">
        <div className="documents-stepper noTabs__document one__tab one_step">
          <HeaderDocument projectName={projectName} perviousRoute={this.state.perviousRoute} isViewMode={this.state.isViewMode} docTitle={Resources.contractsQs[currentLanguage]} moduleTitle={Resources['contracts'][currentLanguage]} />
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
                                  <input type="text" name="subject" className="form-control fsadfsadsa" placeholder={Resources.subject[currentLanguage]}
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
                                      <div className="linebylineInput valid-input alternativeDate">
                                        <DatePicker title='docDate'
                                          startDate={this.state.document.docDate}
                                          handleChange={e => this.handleChangeDate(e, 'docDate')} />
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
                                <Dropdown isClear={true}  title="fromCompany" data={this.state.companies} isMulti={false} selectedValue={this.state.selectedFromCompany}
                                  handleChange={event => this.handleChangeDropDown(event, "companyId", false, "", "", "", "selectedFromCompany")}
                                  onChange={setFieldValue} onBlur={setFieldTouched} error={errors.companyId}
                                  touched={touched.companyId} name="companyId" id="companyId" />
                              </div>

                              <div className="linebylineInput valid-input">
                                <Dropdown isClear={true} title="disciplineTitle" data={this.state.disciplines} isMulti={false}
                                  selectedValue={this.state.selectedDiscpline}
                                  handleChange={event => this.handleChangeDropDown(event, "disciplineId", false, "", "", "", "selectedDiscpline")}
                                  onChange={setFieldValue} onBlur={setFieldTouched} error={errors.disciplineId}
                                  touched={touched.disciplineId} name="disciplineId" id="disciplineId" />
                              </div>
                              <div className="linebylineInput valid-input fullInputWidth">

                                <Dropdown isClear={true}  title="contract" isMulti={false}
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
                          {this.state.CurrentStep === 1 && this.state.AddItemDescription != null ?
                            <AddItemDescription docLink="/Downloads/Excel/QS.xlsx"
                              showImportExcel={true} docType="qs"
                              isViewMode={this.state.isViewMode}
                              mainColumn="qsId" docId={this.state.docId}
                              isUnitPrice={false} addItemApi="AddContractsQsItems"
                              projectId={this.state.projectId} showItemType={true}
                              afterUpload={()=>{this.GetQsItems();}} />
                            : null}
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
                    {this.state.CurrentStep === 1 && this.state.isViewMode === false ? (
                      <button className="primaryBtn-1 btn meduimBtn" onClick={this.finishDocument.bind(this)}>
                        {Resources["finish"][currentLanguage]}
                      </button>
                    ) : null}
                  </div>
                  <div className="doc-pre-cycle letterFullWidth">
                    <div>
                      {this.state.docId > 0 && this.state.isViewMode === false && this.state.CurrentStep === 0 ? (<UploadAttachment changeStatus={this.props.changeStatus} AddAttachments={853} EditAttachments={3255} ShowDropBox={3567} ShowGoogleDrive={3568} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />) : null}
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
                    documentName={Resources.contractsQs[currentLanguage]}
                  />
                </div>
              </div>
            ) : null}
            <div>
              <Steps
                steps_defination={steps_defination}
                exist_link="/qs/"
                docId={this.state.docId}
                changeCurrentStep={stepNo => this.changeCurrentStep(stepNo)}
                stepNo={this.state.CurrentStep}
                changeStatus={docId === 0 ? false : true}
              />
            </div>
          </div>
        </div>
        <div>
          {this.state.showDeleteModal == true ? (
            <ConfirmationModal title={Resources["smartDeleteMessageContent"][currentLanguage]} buttonName="delete" closed={this.onCloseModal}
              showDeleteModal={this.state.showDeleteModal}
              clickHandlerCancel={this.clickHandlerCancelMain}
              clickHandlerContinue={this.clickHandlerContinueMain.bind(this)} />
          ) : null}

          <SkyLight ref={ref => (this.simpleDialogForEdit = ref)}>
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
          </SkyLight>

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
    docId: state.communication.docId,
    showModal: state.communication.showModal
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(communicationActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(QsAddEdit));
