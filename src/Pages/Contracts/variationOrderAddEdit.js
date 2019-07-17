import React, { Component, Fragment } from "react";
import OptionContainer from "../../Componants/OptionsPanels/OptionContainer";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import dataservice from "../../Dataservice";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import UploadAttachment from "../../Componants/OptionsPanels/UploadAttachment";
import ViewAttachment from "../../Componants/OptionsPanels/ViewAttachmments";
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import Resources from "../../resources.json";
import GridSetupWithFilter from "../Communication/GridSetupWithFilter";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as communicationActions from "../../store/actions/communication";
import Config from "../../Services/Config.js";
import CryptoJS from "crypto-js";
import moment from "moment";
import HeaderDocument from "../../Componants/OptionsPanels/HeaderDocument";
import SkyLight from "react-skylight";
import Distribution from "../../Componants/OptionsPanels/DistributionList";
import SendToWorkflow from "../../Componants/OptionsPanels/SendWorkFlow";
import DocumentApproval from "../../Componants/OptionsPanels/wfApproval";
import AddItemDescription from "../../Componants/OptionsPanels/addItemDescription";
import DatePicker from "../../Componants/OptionsPanels/DatePicker";
import { toast } from "react-toastify";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const validationSchema = Yup.object().shape({
  subject: Yup.string().required(Resources["subjectRequired"][currentLanguage]),
  contractId: Yup.string().required(Resources["selectContract"][currentLanguage]).nullable(true),
  total: Yup.string().matches(/(^[0-9]+$)/, Resources["onlyNumbers"][currentLanguage]),
  timeExtension: Yup.string().matches(/(^[0-9]+$)/, Resources["onlyNumbers"][currentLanguage])
});

let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let perviousRoute = '';
let arrange = 0;
const _ = require('lodash')
class variationOrderAddEdit extends Component {
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
          perviousRoute = obj.perviousRoute;
        }
        catch{
          this.props.history.goBack();
        }
      }
      index++;
    }

    let itemsColumns = [
      {
        key: "arrange",
        name: Resources["arrange"][currentLanguage],
        width: 50,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        type: "number"
      }, {
        key: "description",
        name: Resources["description"][currentLanguage],
        width: 100,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        type: "string"
      }, {
        key: "quantity",
        name: Resources["quantity"][currentLanguage],
        width: 120,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        type: "number"
      }, {
        key: "unitPrice",
        name: Resources["unitPrice"][currentLanguage],
        width: 100,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        type: "number"
      }, {
        key: "resourceCode",
        name: Resources["resourceCode"][currentLanguage],
        width: 100,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        type: "string"
      }, {
        key: "itemCode",
        name: Resources["itemCode"][currentLanguage],
        width: 100,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        type: "string"
      }, {
        key: "boqType",
        name: Resources["boqType"][currentLanguage],
        width: 100,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        type: "string"
      }, {
        key: "boqSubType",
        name: Resources["boqSubType"][currentLanguage],
        width: 100,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        type: "string"
      }, {
        key: "boqTypeChild",
        name: Resources["boqTypeChild"][currentLanguage],
        width: 100,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        type: "string"
      }
    ];


    this.state = {
      items: this.props.items,
      pageNumber: 0,
      pageSize: 500,
      itemsColumns: itemsColumns,
      FirstStep: true,
      SecondStep: false,
      SecondStepComplate: false,
      currentTitle: "sendToWorkFlow",
      showModal: false,
      isViewMode: false,
      isApproveMode: isApproveMode,
      perviousRoute: perviousRoute,
      isView: false,
      docId: docId,
      docTypeId: 66,
      projectId: projectId,
      docApprovalId: docApprovalId,
      arrange: arrange,
      document: this.props.document ? Object.assign({}, this.props.document) : {},
      voItem: {},
      permission: [{ name: 'sendByEmail', code: 54 }, { name: 'sendByInbox', code: 53 },
      { name: 'sendTask', code: 1 }, { name: 'distributionList', code: 956 },
      { name: 'createTransmittal', code: 3042 }, { name: 'sendToWorkFlow', code: 707 },
      { name: 'viewAttachments', code: 3298 }, { name: 'deleteAttachments', code: 3280 }],
      selectContract: { label: Resources.selectContract[currentLanguage], value: "0" },
      selectPco: { label: Resources.pco[currentLanguage], value: "0" },
      pcos: [],
      contractsPos: [],
      voItems: [],
      CurrentStep: 1
    }

    if (!Config.IsAllow(159) && !Config.IsAllow(158) && !Config.IsAllow(160)) {
      toast.warn(Resources["missingPermissions"][currentLanguage]);
      this.props.history.push({
        pathname: "/changeOrder/" + projectId
      });
    }
    index++;
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
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.document.id) {
      let serverChangeOrder = { ...nextProps.document };
      serverChangeOrder.docDate = serverChangeOrder.docDate != null ? moment(serverChangeOrder.docDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
      serverChangeOrder.dateApproved = serverChangeOrder.dateApproved != null ? moment(serverChangeOrder.dateApproved).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
      serverChangeOrder.timeExtensionRequired = serverChangeOrder.timeExtensionRequired ? parseFloat(serverChangeOrder.timeExtensionRequired) : 0;

      this.setState({
        document: { ...serverChangeOrder },
        hasWorkflow: nextProps.hasWorkflow
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
      if (!Config.IsAllow(158)) {
        this.setState({ isViewMode: true });
      }

      if (this.state.isApproveMode != true && Config.IsAllow(158)) {
        if (this.props.hasWorkflow == false && Config.IsAllow(158)) {
          //close => false
          if (this.props.document.status !== false && Config.IsAllow(158)) {
            this.setState({ isViewMode: false });
          } else {
            this.setState({ isViewMode: true });
          }
        } else {
          alert("not have edit and hasWorkflow = " + this.props.hasWorkflow);
          this.setState({ isViewMode: true });
        }
      }
    } else {
      this.setState({ isViewMode: false });
    }
    console.log("checkDocumentIsView...", this.props, this.state);
  }

  fillVoItems() {
    dataservice.GetDataGrid("GetChangeOrderItemsByChangeOrderId?changeOrderId=" + this.state.docId).then(result => {

      let data = { items: result };

      this.props.actions.ExportingData(data);

      this.setState({
        voItems: [...result]
      });
    });
  }

  componentWillMount() {
    if (this.state.docId > 0) {
      this.props.actions.documentForEdit("GetContractsChangeOrderForEdit?id=" + this.state.docId, this.state.docTypeId, "changeOrder");

      this.fillVoItems();

    } else {
      let changeOrder = {
        subject: "",
        id: 0,
        projectId: this.state.projectId,
        arrange: "",
        docDate: moment(),
        status: "true",
        isRaisedPrices: "false",
        executed: "yes",
        pcoId: "",
        refDoc: "",
        total: 0,
        timeExtensionRequired: 0,
        contractId: "",
        pcoId: "",
        dateApproved: moment()
      };

      this.setState({ document: changeOrder }, function () {
        this.GetNExtArrange();
      });
      this.fillDropDowns(false);
      this.props.actions.documentForAdding();
    }
  }

  GetNExtArrange() {
    let original_document = { ...this.state.document };

    let updated_document = {};

    let url = "GetNextArrangeMainDoc?projectId=" + this.state.projectId + "&docType=" + this.state.docTypeId + "&companyId=" + this.state.document.fromCompanyId + "&contactId=" + this.state.document.fromContactId;

    dataservice.GetNextArrangeMainDocument(url).then(res => {

      updated_document.arrange = res;

      updated_document = Object.assign(original_document, updated_document);

      this.setState({
        document: updated_document
      });
    });
  }

  fillDropDowns(isEdit) {
    if (isEdit === false) {
      dataservice.GetDataList("GetPoContractForList?projectId=" + this.state.projectId, "subject", "id").then(result => {
        this.setState({
          contractsPos: [...result]
        });
      });
      dataservice.GetDataList("GetContractsPcoByProjectIdForList?projectId=" + this.state.projectId, "subject", "id").then(result => {
        this.setState({
          pcos: [...result]
        });
      });
    }
  }

  componentWillUnmount() {
    this.props.actions.clearCashDocument();
    this.setState({
      docId: 0
    });
  }

  onChangeMessage = (value, field) => {

    let isEmpty = !value.getEditorState().getCurrentContent().hasText();

    if (isEmpty === false) {

      this.setState({ [field]: value });

      if (value.toString("markdown").length > 1) {

        let original_document = { ...this.state.document };

        let updated_document = {};

        updated_document[field] = value.toString("markdown");

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
          document: updated_document
        });
      }
    }
  };

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

  handleChangeDropDown(event, field, selectedValue, isPCO) {

    if (event == null) return;

    let original_document = { ...this.state.document };

    let updated_document = {};

    updated_document[field] = event.value;

    updated_document = Object.assign(original_document, updated_document);

    this.setState({
      document: updated_document,
      [selectedValue]: event
    });

    if (isPCO === true) {
      if (this.props.changeStatus === false) {
        dataservice.GetRowById("GetContractsPcoForEdit?id=" + event.value).then(result => {

          updated_document.total = result.total;
          updated_document.timeExtensionRequired = result.timeExtensionRequired;
          updated_document.contractId = result.contractId;
          updated_document.arrange = result.arrange;
          updated_document.subject = result.subject;

          this.setState({
            document: updated_document
          });
        });
      }
    }
  }

  editVariationOrder(event) {
    this.setState({
      isLoading: true
    });

    let saveDocument = this.state.document;

    saveDocument.docDate = moment(saveDocument.docDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");
    saveDocument.dateApproved = moment(saveDocument.dateApproved, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");

    dataservice.addObject("EditContractsChangeOrder", saveDocument).then(result => {
      this.setState({
        isLoading: true,
        items: this.props.items
      });

      toast.success(Resources["operationSuccess"][currentLanguage]);
    }).catch(res => {
      this.setState({
        isLoading: true
      });
      toast.error(Resources["operationCanceled"][currentLanguage]);
    });
  }

  saveVariationOrder(event) {
    let saveDocument = { ...this.state.document };

    saveDocument.docDate = moment(saveDocument.docDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");
    saveDocument.dateApproved = moment(saveDocument.dateApproved, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");

    saveDocument.projectId = this.state.projectId;

    dataservice.addObject("AddContractsChangeOrder", saveDocument).then(result => {
      if (result.id) {
        this.props.actions.setDocId(result.id)
        this.setState({
          docId: result.id
        });

        toast.success(Resources["operationSuccess"][currentLanguage]);
      }
    }).catch(res => {
      toast.error(Resources["operationCanceled"][currentLanguage]);
    });
  }

  showBtnsSaving() {
    let btn = null;
    if (this.state.docId === 0) {
      btn = (
        <button className="primaryBtn-1 btn meduimBtn" type="submit">
          {Resources.save[currentLanguage]}
        </button>
      );
    } else if (this.state.docId > 0) {
      btn = (
        <button className={this.state.isViewMode === true ? "primaryBtn-1 btn meduimBtn disNone" : "primaryBtn-1 btn meduimBtn"} type="submit">
          {Resources.next[currentLanguage]}
        </button>
      );
    }
    return btn;
  }

  viewAttachments() {
    return this.state.docId > 0 ? (
      Config.IsAllow(3298) === true ? (
        <ViewAttachment
          docTypeId={this.state.docTypeId}
          docId={this.state.docId}
          projectId={this.state.projectId}
          deleteAttachments={3280}
        />
      ) : null
    ) : null;
  }

  handleShowAction = item => {
    if (item.title == "sendToWorkFlow") {
      this.props.actions.SendingWorkFlow(true);
    }

    if (item.value != "0") {
      this.props.actions.showOptionPanel(false);

      this.setState({
        currentComponent: item.value,
        currentTitle: item.title,
        showModal: true
      });

      this.simpleDialog.show();
    }
  };

  NextStep = () => {
    if (this.state.CurrentStep === 1) {
      if (this.props.changeStatus == true) {
        this.editVariationOrder();
      }
      window.scrollTo(0, 0);
      this.setState({
        FirstStep: false,
        SecondStep: true,
        SecondStepComplate: true,
        ThirdStepComplate: false,
        CurrentStep: this.state.CurrentStep + 1,
        ThirdStep: false,
        items: this.props.items,
      });
    } else if (this.state.CurrentStep === 2) {
      window.scrollTo(0, 0);
      this.setState({
        FirstStep: false,
        SecondStep: false,
        ThirdStep: true,
        CurrentStep: this.state.CurrentStep + 1,
        ThirdStepComplate: true
      });
    } else {
      this.props.history.push({
        pathname: "/changeOrder/" + projectId
      });
    }
  };

  NextTopStep = () => {
    if (this.state.CurrentStep === 1) {
      window.scrollTo(0, 0);
      this.setState({
        FirstStep: false,
        SecondStep: true,
        SecondStepComplate: true,
        CurrentStep: this.state.CurrentStep + 1,
        ThirdStep: false,
        items: this.props.items
      });
    } else if (this.state.CurrentStep === 2) {
      this.props.history.push({
        pathname: "/changeOrder/" + projectId
      });
    }
  };

  PreviousStep = () => {
    if (this.state.docId !== 0) {
      if (this.state.CurrentStep === 3) {
        window.scrollTo(0, 0);
        this.setState({
          FirstStep: false,
          SecondStep: true,
          CurrentStep: this.state.CurrentStep - 1,
          SecondStepComplate: true
        });
      } else {
        if (this.state.CurrentStep === 2) {
          window.scrollTo(0, 0);
          this.setState({
            FirstStep: true,
            SecondStep: false,
            SecondStepComplate: false,
            CurrentStep: this.state.CurrentStep - 1
          });
        }
      }
    }
  };

  saveVariationOrderItem(event) {
    let saveDocument = { ...this.state.voItem };

    saveDocument.changeOrderId = this.state.docId;

    dataservice.addObject("AddVOItems", saveDocument).then(result => {
      if (result) {
        let oldItems = [...this.state.voItems];
        oldItems.push(result);
        this.setState({
          voItems: [...oldItems]
        });
        toast.success(Resources["operationSuccess"][currentLanguage]);
      }
    })
      .catch(res => {
        toast.error(Resources["operationCanceled"][currentLanguage]);
      });
  }

  handleChangeItem(e, field) {
    let original_document = { ...this.state.voItem };

    let updated_document = {};

    updated_document[field] = e.target.value;

    updated_document = Object.assign(original_document, updated_document);

    this.setState({
      voItem: updated_document
    });
  }

  handleChangeItemDropDown(event, field, selectedValue, isSubscribe, url, param, nextTragetState) {
    if (event == null) return;
    let original_document = { ...this.state.voItem };
    let updated_document = {};
    updated_document[field] = event.value;
    updated_document = Object.assign(original_document, updated_document);

    this.setState({
      voItem: updated_document,
      [selectedValue]: event
    });

    if (isSubscribe) {
      let action = url + "?" + param + "=" + event.value;
      dataservice.GetDataList(action, "title", "id").then(result => {
        this.setState({
          [nextTragetState]: result
        });
      });
    }
  }

  StepOneLink = () => {
    if (docId !== 0) {
      this.setState({
        FirstStep: true,
        SecondStep: false,
        SecondStepComplate: false,
        CurrentStep: 1
      });
    }
  };

  StepTwoLink = () => {
    if (docId !== 0) {
      this.setState({
        FirstStep: false,
        SecondStep: true,
        SecondStepComplate: true,
        CurrentStep: 2,
        items: this.props.items
      });
    }
  };

  GetPrevoiusData() {

    let pageNumber = this.state.pageNumber - 1;

    if (pageNumber > 0) {
      this.setState({
        isLoading: true,
        pageNumber: pageNumber
      });

      let oldRows = [...this.state.paymentsItems];

      dataservice.GetDataGrid("GetRequestItemsOrderByContractId?contractId=" + this.state.document.contractId + "&isAdd=true&requestId=" + this.state.docId + "&pageNumber=" + pageNumber + "&pageSize=" + this.state.pageSize).then(result => {

        const newRows = [...this.state.paymentsItems, ...result];

        this.setState({
          paymentsItems: newRows,
          isLoading: false
        });
      }).catch(ex => {
        this.setState({
          paymentsItems: oldRows,
          isLoading: false
        });
      });
    }
  }

  GetNextData() {
    let pageNumber = this.state.pageNumber + 1;

    this.setState({
      isLoading: true,
      pageNumber: pageNumber
    });

    let oldRows = [...this.state.paymentsItems];

    dataservice.GetDataGrid("GetRequestItemsOrderByContractId?contractId=" + this.state.document.contractId + "&isAdd=true&requestId=" + this.state.docId + "&pageNumber=" + pageNumber + "&pageSize=" + this.state.pageSize).then(result => {

      const newRows = [...this.state.paymentsItems, ...result];

      this.setState({
        paymentsItems: newRows,
        isLoading: false
      });
    }).catch(ex => {
      this.setState({
        paymentsItems: oldRows,
        isLoading: false
      });
    });
  }

  render() {
    let actions = [
      {
        title: "distributionList",
        value: (
          <Distribution
            docTypeId={this.state.docTypeId}
            docId={this.state.docId}
            projectId={this.state.projectId}
          />
        ),
        label: Resources["distributionList"][currentLanguage]
      },
      {
        title: "sendToWorkFlow",
        value: (
          <SendToWorkflow
            docTypeId={this.state.docTypeId}
            docId={this.state.docId}
            projectId={this.state.projectId}
          />
        ),
        label: Resources["sendToWorkFlow"][currentLanguage]
      },
      {
        title: "documentApproval",
        value: (
          <DocumentApproval
            docTypeId={this.state.docTypeId}
            docId={this.state.docId}
            approvalStatus={true}
            projectId={this.state.projectId}
            docApprovalId={this.state.docApprovalId}
            currentArrange={this.state.arrange}
          />
        ),
        label: Resources["documentApproval"][currentLanguage]
      },
      {
        title: "documentApproval",
        value: (
          <DocumentApproval
            docTypeId={this.state.docTypeId}
            docId={this.state.docId}
            approvalStatus={false}
            projectId={this.state.projectId}
            docApprovalId={this.state.docApprovalId}
            currentArrange={this.state.arrange}
          />
        ),
        label: Resources["documentApproval"][currentLanguage]
      }
    ];

    return (
      <div className="mainContainer">
        <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document one__tab one_step readOnly_inputs" : "documents-stepper noTabs__document one__tab one_step"}>
          <HeaderDocument projectName={projectName} isViewMode={this.state.isViewMode} docTitle={Resources.changeOrder[currentLanguage]} moduleTitle={Resources["contracts"][currentLanguage]} />
          <div className="doc-container">
            <div className="step-content">
              {this.state.FirstStep ?
                <Fragment>
                  <div id="step1" className="step-content-body">
                    <div className="subiTabsContent">
                      <div className="document-fields">
                        <Formik
                          initialValues={{ ...this.state.document }}
                          validationSchema={validationSchema}
                          enableReinitialize={this.props.changeStatus}
                          onSubmit={values => {
                            if (this.props.changeStatus === false && this.state.docId === 0) {
                              this.saveVariationOrder();
                            } else {
                              this.NextStep();
                            }
                          }}>
                          {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                            <Form id="InspectionRequestForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>
                              <div className="proForm first-proform">
                                <div className="linebylineInput valid-input">
                                  <label className="control-label">
                                    {Resources.subject[currentLanguage]}
                                  </label>
                                  <div className={"inputDev ui input" + (errors.subject && touched.subject ? " has-error" : !errors.subject && touched.subject ? " has-success" : " ")}>
                                    <input name="subject" className="form-control fsadfsadsa" id="subject" placeholder={Resources.subject[currentLanguage]}
                                      autoComplete="off" value={this.state.document.subject}
                                      onBlur={e => {
                                        handleBlur(e);
                                        handleChange(e);
                                      }}
                                      onChange={e => this.handleChange(e, "subject")} />
                                    {touched.subject ? (<em className="pError"> {errors.subject} </em>) : null}
                                  </div>
                                </div>

                                <div className="linebylineInput valid-input">
                                  <label className="control-label">
                                    {Resources.status[currentLanguage]}
                                  </label>
                                  <div className="ui checkbox radio radioBoxBlue">
                                    <input
                                      type="radio"
                                      name="letter-status"
                                      defaultChecked={
                                        this.state.document.status === false
                                          ? null
                                          : "checked"
                                      }
                                      value="true"
                                      onChange={e =>
                                        this.handleChange(e, "status")
                                      }
                                    />
                                    <label>
                                      {Resources.oppened[currentLanguage]}
                                    </label>
                                  </div>
                                  <div className="ui checkbox radio radioBoxBlue">
                                    <input
                                      type="radio"
                                      name="letter-status"
                                      defaultChecked={
                                        this.state.document.status === false
                                          ? "checked"
                                          : null
                                      }
                                      value="false"
                                      onChange={e =>
                                        this.handleChange(e, "status")
                                      }
                                    />
                                    <label>
                                      {Resources.closed[currentLanguage]}
                                    </label>
                                  </div>
                                </div>
                              </div>

                              <div className="proForm datepickerContainer">
                                <div className="linebylineInput valid-input alternativeDate">
                                  <DatePicker
                                    title="docDate"
                                    onChange={e => setFieldValue("docDate", e)}
                                    onBlur={setFieldTouched}
                                    error={errors.docDate}
                                    touched={touched.docDate}
                                    name="docDate"
                                    startDate={this.state.document.docDate}
                                    handleChange={e =>
                                      this.handleChangeDate(e, "docDate")
                                    }
                                  />
                                </div>

                                <div className="linebylineInput valid-input alternativeDate">
                                  <DatePicker
                                    title="dateApproved"
                                    onChange={e =>
                                      setFieldValue("dateApproved", e)
                                    }
                                    name="dateApproved"
                                    startDate={this.state.document.dateApproved}
                                    handleChange={e =>
                                      this.handleChangeDate(e, "dateApproved")
                                    }
                                  />
                                </div>

                                <div className="linebylineInput  account__checkbox">
                                  <div className="linebylineInput valid-input">
                                    <label className="control-label">
                                      {Resources.raisedPrices[currentLanguage]}
                                    </label>
                                    <div className="ui checkbox radio radioBoxBlue">
                                      <input
                                        type="radio"
                                        name="vo-isRaisedPrices"
                                        defaultChecked={
                                          this.state.document.isRaisedPrices ===
                                            false
                                            ? null
                                            : "checked"
                                        }
                                        value="true"
                                        onChange={e =>
                                          this.handleChange(e, "isRaisedPrices")
                                        }
                                      />
                                      <label>
                                        {Resources.yes[currentLanguage]}
                                      </label>
                                    </div>
                                    <div className="ui checkbox radio radioBoxBlue">
                                      <input
                                        type="radio"
                                        name="vo-isRaisedPrices"
                                        defaultChecked={
                                          this.state.document.isRaisedPrices ===
                                            false
                                            ? "checked"
                                            : null
                                        }
                                        value="false"
                                        onChange={e =>
                                          this.handleChange(e, "isRaisedPrices")
                                        }
                                      />
                                      <label>
                                        {Resources.no[currentLanguage]}
                                      </label>
                                    </div>
                                  </div>

                                  <div className="linebylineInput valid-input">
                                    <label className="control-label">
                                      {Resources.executed[currentLanguage]}
                                    </label>
                                    <div className="ui checkbox radio radioBoxBlue">
                                      <input
                                        type="radio"
                                        name="vo-executed"
                                        defaultChecked={
                                          this.state.document.executed === "yes"
                                            ? null
                                            : "checked"
                                        }
                                        value="yes"
                                        onChange={e =>
                                          this.handleChange(e, "executed")
                                        }
                                      />
                                      <label>
                                        {Resources.yes[currentLanguage]}
                                      </label>
                                    </div>
                                    <div className="ui checkbox radio radioBoxBlue">
                                      <input
                                        type="radio"
                                        name="vo-executed"
                                        defaultChecked={
                                          this.state.document.executed === "no"
                                            ? "checked"
                                            : null
                                        }
                                        value="no"
                                        onChange={e =>
                                          this.handleChange(e, "executed")
                                        }
                                      />
                                      <label>
                                        {Resources.no[currentLanguage]}
                                      </label>
                                    </div>
                                  </div>
                                </div>

                                <div className="linebylineInput valid-input">
                                  <label className="control-label">
                                    {Resources.arrange[currentLanguage]}
                                  </label>

                                  <div className="ui input inputDev">
                                    <input
                                      type="text"
                                      className="form-control"
                                      id="arrange"
                                      readOnly
                                      value={this.state.document.arrange}
                                      name="arrange"
                                      placeholder={
                                        Resources.arrange[currentLanguage]
                                      }
                                      onBlur={e => {
                                        handleChange(e);
                                        handleBlur(e);
                                      }}
                                      onChange={e =>
                                        this.handleChange(e, "arrange")
                                      }
                                    />
                                  </div>
                                </div>

                                {this.props.changeStatus === true ? (
                                  <div className="proForm first-proform letterFullWidth proform__twoInput">
                                    <div className="linebylineInput valid-input">
                                      <label className="control-label">
                                        {Resources.pco[currentLanguage]}
                                      </label>
                                      <div className="ui input inputDev">
                                        <input
                                          type="text"
                                          className="form-control"
                                          id="pcoSubject"
                                          readOnly
                                          value={this.state.document.pcoSubject}
                                          name="pcoSubject"
                                        />
                                      </div>
                                    </div>

                                    <div className="linebylineInput valid-input">
                                      <label className="control-label">
                                        {Resources.contractPo[currentLanguage]}
                                      </label>
                                      <div className="ui input inputDev">
                                        <input
                                          type="text"
                                          className="form-control"
                                          id="contractSubject"
                                          readOnly
                                          value={
                                            this.state.document.contractSubject
                                          }
                                          name="contractSubject"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                    <Fragment>
                                      <div className="linebylineInput valid-input">
                                        <Dropdown
                                          title="pco"
                                          isMulti={false}
                                          data={this.state.pcos}
                                          selectedValue={this.state.selectPco}
                                          handleChange={event =>
                                            this.handleChangeDropDown(
                                              event,
                                              "pcoId",
                                              "selectPco",
                                              true
                                            )
                                          }
                                          id="pcoId"
                                        />
                                      </div>

                                      <div className="linebylineInput valid-input">
                                        <Dropdown
                                          title="contractPo"
                                          data={this.state.contractsPos}
                                          selectedValue={
                                            this.state.selectContract
                                          }
                                          handleChange={event =>
                                            this.handleChangeDropDown(
                                              event,
                                              "contractId",
                                              "selectContract",
                                              false
                                            )
                                          }
                                          index="contractId"
                                          onChange={setFieldValue}
                                          onBlur={setFieldTouched}
                                          error={errors.contractId}
                                          touched={touched.contractId}
                                          isClear={false}
                                          name="contractId"
                                        />
                                      </div>
                                    </Fragment>
                                  )}
                                <div className="linebylineInput valid-input">
                                  <label className="control-label">
                                    {Resources.total[currentLanguage]}
                                  </label>
                                  <div
                                    className={
                                      "ui input inputDev" +
                                      (errors.total && touched.total
                                        ? " has-error"
                                        : "ui input inputDev")
                                    }
                                  >
                                    <input
                                      type="text"
                                      className="form-control"
                                      id="total"
                                      value={this.state.document.total}
                                      name="total"
                                      placeholder={
                                        Resources.total[currentLanguage]
                                      }
                                      onBlur={e => {
                                        handleChange(e);
                                        handleBlur(e);
                                      }}
                                      onChange={e =>
                                        this.handleChange(e, "total")
                                      }
                                    />
                                    {touched.total ? (
                                      <em className="pError">{errors.total}</em>
                                    ) : null}
                                  </div>
                                </div>
                                <div className="linebylineInput valid-input">
                                  <label className="control-label">
                                    {Resources.timeExtension[currentLanguage]}
                                  </label>
                                  <div
                                    className={
                                      "ui input inputDev" +
                                      (errors.timeExtension &&
                                        touched.timeExtension
                                        ? " has-error"
                                        : "ui input inputDev")
                                    }
                                  >
                                    <input
                                      type="text"
                                      className="form-control"
                                      id="timeExtension"
                                      value={
                                        this.state.document
                                          .timeExtensionRequired
                                      }
                                      name="timeExtension"
                                      placeholder={
                                        Resources.timeExtension[currentLanguage]
                                      }
                                      onBlur={e => {
                                        handleChange(e);
                                        handleBlur(e);
                                      }}
                                      onChange={e =>
                                        this.handleChange(
                                          e,
                                          "timeExtensionRequired"
                                        )
                                      }
                                    />
                                    {touched.timeExtension ? (
                                      <em className="pError">
                                        {errors.timeExtension}
                                      </em>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                              <div className="slider-Btns">
                                {this.showBtnsSaving()}
                              </div>
                            </Form>
                          )}
                        </Formik>
                      </div>
                      <div className="doc-pre-cycle letterFullWidth">
                        <div>
                          {this.state.docId > 0 &&
                            this.state.isViewMode === false ? (
                              <UploadAttachment
                                changeStatus={this.props.changeStatus}
                                AddAttachments={3278}
                                EditAttachments={3279}
                                ShowDropBox={3573}
                                ShowGoogleDrive={3574}
                                docTypeId={this.state.docTypeId}
                                docId={this.state.docId}
                                projectId={this.state.projectId}
                              />
                            ) : null}
                          {this.viewAttachments()}
                          {this.props.changeStatus === true ? (
                            <ViewWorkFlow
                              docType={this.state.docTypeId}
                              docId={this.state.docId}
                              projectId={this.state.projectId}
                            />
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </Fragment>
                :
                <Fragment>
                  <div className="subiTabsContent feilds__top">
                    <AddItemDescription
                      docLink="/Downloads/Excel/BOQ.xlsx"
                      showImportExcel={this.state.document.isRaisedPrices}
                      docType="vo"
                      isViewMode={this.state.isViewMode}
                      docId={this.state.docId}
                      mainColumn="changeOrderId"
                      addItemApi="AddVOItems"
                      projectId={this.state.projectId}
                      showItemType={false}
                    />
                    <div className="doc-pre-cycle">
                      <GridSetupWithFilter
                        rows={this.state.items}
                        pageSize={10}
                        columns={this.state.itemsColumns}
                        key='items'
                      />
                    </div>
                    <div className="doc-pre-cycle">
                      <div className="slider-Btns">
                        <button className="primaryBtn-1 btn meduimBtn" onClick={this.NextStep}>
                          {Resources["next"][currentLanguage]}
                        </button>
                      </div>
                    </div>
                  </div>
                </Fragment>
              }
            </div>
            <div className="docstepper-levels">
              {/* Next & Previous */}
              <div className="step-content-foot">
                <span
                  onClick={this.PreviousStep}
                  className={!this.state.FirstStep && this.state.docId !== 0 ? "step-content-btn-prev " : "step-content-btn-prev disabled"}>
                  <i className="fa fa-caret-left" aria-hidden="true" />
                  {Resources.previous[currentLanguage]}
                </span>

                <span
                  onClick={this.NextTopStep}
                  className={
                    !this.state.ThirdStepComplate && this.state.docId !== 0
                      ? "step-content-btn-prev "
                      : "step-content-btn-prev disabled"
                  }
                >
                  {Resources.next[currentLanguage]}
                  <i className="fa fa-caret-right" aria-hidden="true" />
                </span>
              </div>
              {/* Steps Active  */}
              <div className="workflow-sliderSteps">
                <div className="step-slider">
                  <div
                    onClick={this.StepOneLink}
                    data-id="step1"
                    className={
                      "step-slider-item " +
                      (this.state.SecondStepComplate
                        ? "active"
                        : "current__step")
                    }
                  >
                    <div className="steps-timeline">
                      <span>1</span>
                    </div>
                    <div className="steps-info">
                      <h6>{Resources.changeOrder[currentLanguage]}</h6>
                    </div>
                  </div>

                  <div onClick={this.StepTwoLink} data-id="step2 " className={"step-slider-item " + (this.state.ThirdStepComplate ? "active" : this.state.SecondStepComplate ? "current__step" : "")}>
                    <div className="steps-timeline">
                      <span>2</span>
                    </div>
                    <div className="steps-info">
                      <h6>{Resources.items[currentLanguage]}</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {this.props.changeStatus === true ? (
              <div className="approveDocument">
                <div className="approveDocumentBTNS">
                  {this.state.isApproveMode === true ? (
                    <div>
                      <button
                        className="primaryBtn-1 btn "
                        type="button"
                        onClick={e => this.handleShowAction(actions[2])}
                      >
                        {Resources.approvalModalApprove[currentLanguage]}
                      </button>
                      <button
                        className="primaryBtn-2 btn middle__btn"
                        type="button"
                        onClick={e => this.handleShowAction(actions[3])}
                      >
                        {Resources.approvalModalReject[currentLanguage]}
                      </button>
                    </div>
                  ) : null}
                  <button
                    type="button"
                    className="primaryBtn-2 btn middle__btn"
                    onClick={e => this.handleShowAction(actions[1])}
                  >
                    {Resources.sendToWorkFlow[currentLanguage]}
                  </button>
                  <button
                    type="button"
                    className="primaryBtn-2 btn"
                    onClick={e => this.handleShowAction(actions[0])}
                  >
                    {Resources.distributionList[currentLanguage]}
                  </button>
                  <span className="border" />
                  <div className="document__action--menu">
                    <OptionContainer
                      permission={this.state.permission}
                      docTypeId={this.state.docTypeId}
                      docId={this.state.docId}
                      projectId={this.state.projectId}
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <div
          className="largePopup largeModal "
          style={{ display: this.state.showModal ? "block" : "none" }}
        >
          <SkyLight
            hideOnOverlayClicked
            ref={ref => (this.simpleDialog = ref)}
            title={Resources[this.state.currentTitle][currentLanguage]}
          >
            {this.state.currentComponent}
          </SkyLight>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    document: state.communication.document,
    isLoading: state.communication.isLoading,
    changeStatus: state.communication.changeStatus,
    file: state.communication.file,
    files: state.communication.files,
    hasWorkflow: state.communication.hasWorkflow,
    projectId: state.communication.projectId,
    items: state.communication.items
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(communicationActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(variationOrderAddEdit));
