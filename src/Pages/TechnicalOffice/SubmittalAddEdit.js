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
import * as communicationActions from "../../store/actions/communication";
import Distribution from "../../Componants/OptionsPanels/DistributionList";
import SendToWorkflow from "../../Componants/OptionsPanels/SendWorkFlow";
import DocumentApproval from "../../Componants/OptionsPanels/wfApproval";
import { toast } from "react-toastify";
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import Rodal from "../../Styles/js/rodal";
import "../../Styles/css/rodal.css";
import { MapsTransferWithinAStation } from "material-ui/svg-icons";

const _ = require("lodash");

let selectedRows = [];

let currentLanguage =
  localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

// const validationSchema = Yup.object().shape({
//         subject: Yup.string().required(Resources["subjectRequired"][currentLanguage]).max(450, Resources["maxLength"][currentLanguage]),
//         arrange:Yup.number().required(Resources["arrange"][currentLanguage]),
//         refNo: Yup.string().max(100, Resources["maxLength"][currentLanguage]),
//         fromContactId: Yup.string().required(Resources["fromContactRequired"][currentLanguage]).nullable(true),
//         fromContactIdCycle: Yup.string().required(Resources["fromContactRequired"][currentLanguage]).nullable(true),
//         toContactId: Yup.string().required(Resources["toContactRequired"][currentLanguage]).nullable(true),
//         fileNumber:Yup.string().max(50, Resources["maxLength"][currentLanguage]),
//         sharedSettings :Yup.string().max(450, Resources["maxLength"][currentLanguage])
// });

// const validationSchemaForCycle = Yup.object().shape({
//         subject: Yup.string().required(Resources["subjectRequired"][currentLanguage]),
//         refDoc: Yup.string().max(450, Resources["maxLength"][currentLanguage]),
//         fromContactId: Yup.string().required(Resources["fromContactRequired"][currentLanguage]).nullable(true),
//         toContactId: Yup.string().required(Resources["toContactRequired"][currentLanguage]).nullable(true)
// });

let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let arrange = 0;

class SubmittalAddEdit extends Component {
  constructor(props) {
    super(props);

    const query = new URLSearchParams(this.props.location.search);

    let index = 0;

    for (let param of query.entries()) {
      if (index == 0) {
        try {
          let obj = JSON.parse(
            CryptoJS.enc.Base64.parse(param[1]).toString(CryptoJS.enc.Utf8)
          );

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
      docTypeId: 42,
      projectId: projectId,
      docApprovalId: docApprovalId,
      arrange: arrange,
      document: this.props.document ? Object.assign({}, this.props.document) : {},
      documentCycle: this.props.documentCycle ? Object.assign({}, this.props.documentCycle) : {},
      itemsDocumentSubmital: {},
      selected: {},
      companies: [],
      fromContacts: [],
      fromContactsCycles: [],
      specsSection: [],
      reasonForIssue: [],
      disciplines: [],
      contracts: [],
      areas: [],
      locations: [],
      submittalType: [],
      approvales: [],
      reviewResult: [],
      itemData: [],
      submittalItem: {},
      permission: [
        { name: "sendByEmail", code: 226 },
        { name: "sendByInbox", code: 225 },
        { name: "sendTask", code: 1 },
        { name: "distributionList", code: 984 },
        { name: "createTransmittal", code: 3070 },
        { name: "sendToWorkFlow", code: 732 },
        { name: "viewAttachments", code: 3302 },
        { name: "deleteAttachments", code: 884 }
      ],
      SubmittalTypes: [
        { label: "As Build", value: "As Build" },
        { label: "Method Statment", value: "Method Statment" },
        { label: "Quality Plan", value: "Quality Plan" },
        { label: "IPP", value: "IPP" },
        { label: "Material", value: "Material" },
        { label: "Quantity Surevy", value: "Quantity Surevy" },
        { label: "Schedule", value: "Schedule" },
        { label: "Shop drawing", value: "Shop drawing" },
        { label: "IIP", value: "IIP" },
        { label: "ITP", value: "ITP" },
        { label: "Safty Plan", value: "Safty Plan" },
        { label: "Release Submittal", value: "Release Submittal" }
      ],
      selectedFromCompany: {label: Resources.fromCompanyRequired[currentLanguage], value: "0"},
      selectedFromContact: {label: Resources.fromContactRequired[currentLanguage],value: "0"},
      selectedFromCompanyCycles: {label: Resources.fromCompanyRequired[currentLanguage],value: "0"},
      selectedFromContactCycles: {label: Resources.fromContactRequired[currentLanguage],value: "0"},
      selectedSpecsSection: {label: Resources.specsSectionSelection[currentLanguage],value: "0"},
      selectedDiscpline: {label: Resources.disciplineRequired[currentLanguage],value: "0"},
      selectedContract: {label: Resources.contractPoSelection[currentLanguage],value: "0"},
      selectedReasonForIssue: {label: Resources.SelectReasonForIssueId[currentLanguage],value: "0"},
      selectedArea: { label: Resources.area[currentLanguage], value: "0" },
      selectedLocation: {label: Resources.locationRequired[currentLanguage],value: "0"},
      selectedSubmittalType: {label: Resources.submittalType[currentLanguage],value: "0"},
      selectedApprovalStatus: {label: Resources.approvalStatusSelection[currentLanguage],value: "0"},
      selectedReviewResult: {label: Resources.selectResult[currentLanguage],value: "0"}
    };

    if (!Config.IsAllow(220) || !Config.IsAllow(221) || !Config.IsAllow(223)) {

      toast.success(Resources["missingPermissions"][currentLanguage]);

      this.props.history.push("/submittal/" + this.state.projectId);
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
    if (nextProps.document && nextProps.document.id) {
      this.fillDropDowns(nextProps.document.id > 0 ? true : false);

      this.checkDocumentIsView();
    } else if (nextProps.documentCycle && nextProps.documentCycle.id) {
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
      if (!Config.IsAllow(221)) {
        this.setState({ isViewMode: true });
      }
      if (this.state.isApproveMode != true && Config.IsAllow(221)) {
        if (this.props.hasWorkflow == false && Config.IsAllow(221)) {
          if (this.props.document.status == true && Config.IsAllow(221)) {
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

      let url = "GetLogsSubmittalForEdit?id=" + this.state.docId;

      let urlCycle = "GetLogSubmittalCyclesForEdit?id=" + this.state.docId;

      this.props.actions.documentForEdit(url).then(() => {

        this.props.actions.GetDocumentCycle(urlCycle).then(result => {

          if(this.props.document != null){ 
          this.props.document.docDate = moment(this.props.document.docDate).format("DD/MM/YYYY");
          this.props.document.forwardToDate = moment(this.props.document.forwardToDate).format("DD/MM/YYYY");
        }
          if (this.props.documentCycle != null) {
            this.props.documentCycle.docDate = moment(this.props.documentCycle.docDate).format("DD/MM/YYYY");
            this.props.documentCycle.approvedDate = moment(this.props.documentCycle.approvedDate).format("DD/MM/YYYY");
          }

          dataservice.GetDataGrid("GetLogsSubmittalItemsBySubmittalId?submittalId=" + this.state.docId).then(data => {
              this.setState({
                isEdit: true,
                itemData: data,
                document: this.props.document,
                documentCycle: this.props.documentCycle,
                hasWorkflow: this.props.hasWorkflow
              });
            })
            .catch(ex => toast.error(Resources["failError"][currentLanguage]));
        });
      });
    } else {
      const submittalDocument = {
        //field
        id: 0,
        projectId: projectId,
        sharedSettings: "",
        area: "",
        arrange: "1",
        fileNumber: "",
        status: "true",
        reasonForIssueId: "",
        refNo: "",
        location: "",
        building: "",
        contractId: "",
        apartment: "",
        specsSectionId: "",
        companyId: "",
        subject: "",
        submittalType: "",
        disciplineId: "",
        bicContactId: "",
        bicCompanyId: "",
        receivedFromCompanyId: "",
        approvalStatusId: "",
        returnedByCompanyId: "",
        returnedByStatus: "",
        receivedStatus: "",
        sentStatus: "",
        docDate: moment(),
        receivedDate: moment(),
        returnedByDate: moment(),
        sentDate: moment(),
        forwardToDate: moment(),
        forwardToCompantId: "",
        forwardToStatus: "",
        orderType: "",
        cyclesCount: "1"
      };

      const submittalDocumentCycles = {
        //field
        id: 0,
        submittalId: "",
        docDate: moment(),
        approvedDate: moment(),
        CycleStatus: "true",
        flowCompanyName: "",
        flowContactName: "",
        status: "true",
        subject: "Cycle No. R 1",
        approvalStatusId: "",
        arrange: "1",
        flowCompanyId: "",
        flowContactId: "",
        approvalAction: "1"
      };

      this.setState({
        document: submittalDocument,
        documentCycle: submittalDocumentCycles
      });

      this.fillDropDowns(false);
    }
    this.props.actions.documentForAdding();
  }

  fillSubDropDownInEdit(url,param,value,subField,subSelectedValue,subDatasource) {

    let action = url + "?" + param + "=" + value;

    dataservice.GetDataList(action, "contactName", "id").then(result => {
      
      if (this.props.changeStatus === true) {

        let toSubField = this.state.document[subField];

        let targetFieldSelected = _.find(result, function(i) {
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
    //from Companies
    dataservice.GetDataList("GetProjectProjectsCompaniesForList?projectId=" + projectId,"companyName","companyId").then(result => {
        
      if (isEdit) {

          let companyId = this.props.document.bicCompanyId;

          if (companyId) {
            this.setState({
              selectedFromCompany: {label: this.props.document.bicCompanyName,value: companyId}
            });

            this.fillSubDropDownInEdit("GetContactsByCompanyId","companyId",companyId,"fromContactId","selectedFromContact","fromContacts");
          }

          let toCompanyId = this.props.document.toCompanyId;

          if (toCompanyId) {
            this.setState({
              selectedToCompany: {
                label: this.props.document.bicCompanyName,
                value: toCompanyId
              }
            });

            this.fillSubDropDownInEdit("GetContactsByCompanyId","companyId",toCompanyId,"toContactId","selectedToContact","ToContacts");
          }
        }
        this.setState({
          companies: [...result]
        });
      });

    //discplines
    dataservice
      .GetDataList(
        "GetaccountsDefaultListForList?listType=discipline",
        "title",
        "id"
      )
      .then(result => {
        if (isEdit) {
          let disciplineId = this.props.document.disciplineId;

          if (disciplineId) {
            let disciplineName = result.find(i => i.value === disciplineId);

            this.setState({
              selectedDiscpline: {
                label: disciplineName.label,
                value: disciplineId
              }
            });
          }
        }
        this.setState({
          disciplines: [...result]
        });
      });

    //location
    dataservice
      .GetDataList(
        "GetaccountsDefaultListForList?listType=location",
        "title",
        "id"
      )
      .then(result => {
        if (isEdit) {
          let locationId = this.props.document.location;

          if (locationId) {
            let locationName = result.find(
              i => i.value === parseInt(locationId)
            );

            this.setState({
              selectedLocation: { label: locationName.label, value: locationId }
            });
          }
        }
        this.setState({
          locations: [...result]
        });
      });

    //area
    dataservice
      .GetDataList("GetaccountsDefaultListForList?listType=area", "title", "id")
      .then(result => {
        if (isEdit) {
          let areaId = this.props.document.area;

          if (areaId) {
            let areaIdName = result.find(i => i.value === parseInt(areaId));

            this.setState({
              selectedArea: { label: areaIdName.label, value: areaId }
            });
          }
        }
        this.setState({
          areas: [...result]
        });
      });

    //reasonForIssue
    dataservice
      .GetDataList(
        "GetaccountsDefaultListForList?listType=reasonForIssue",
        "title",
        "id"
      )
      .then(result => {
        if (isEdit) {
          let reasonFor = this.props.document.reasonForIssueId;

          if (reasonFor) {
            this.setState({
              selectedReasonForIssue: {
                label: this.props.document.reasonForIssueName,
                value: this.props.document.reasonForIssueId
              }
            });
          }
        }
        this.setState({
          reasonForIssue: [...result]
        });
      });

    //reviewResult
    dataservice
      .GetDataList(
        "GetaccountsDefaultListForList?listType=reviewresult",
        "title",
        "id"
      )
      .then(result => {
        this.setState({
          reviewResult: [...result]
        });
      });

    //specsSection
    dataservice
      .GetDataList(
        "GetaccountsDefaultListForList?listType=specssection",
        "title",
        "id"
      )
      .then(result => {
        if (isEdit) {
          let specsSectionId = this.props.document.specsSectionId;

          if (specsSectionId) {
            let specsSectionName = result.find(
              i => i.value === parseInt(specsSectionId)
            );

            this.setState({
              selectedSpecsSection: {
                label: specsSectionName.label,
                value: specsSectionId
              }
            });
          }
        }

        this.setState({
          specsSection: [...result]
        });
      });

    //approvalStatus
    dataservice
      .GetDataList(
        "GetaccountsDefaultListForList?listType=approvalstatus",
        "title",
        "id"
      )
      .then(result => {
        if (isEdit) {
          let approval = this.props.document.approvalStatusId;

          if (approval) {
            let approvalName = result.find(i => i.value === parseInt(approval));

            this.setState({
              selectedApprovalStatus: {
                label: approvalName.label,
                value: approval
              }
            });
          }
        }
        this.setState({
          approvales: [...result]
        });
      });

    //contractList
    dataservice
      .GetDataList(
        "GetPoContractForList?projectId=" + projectId,
        "subject",
        "id"
      )
      .then(result => {
        if (isEdit) {
          let contactId = this.props.document.contactId;

          if (contactId) {
            let contactName = result.find(i => i.value === parseInt(contactId));

            this.setState({
              selectedContract: { label: contactName.label, value: contactId }
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

  handleChangeCycles(e, field) {
    let original_document = { ...this.state.documentCycle };

    let updated_document = {};

    updated_document[field] = e.target.value;

    updated_document = Object.assign(original_document, updated_document);

    this.setState({
      documentCycle: updated_document
    });
  }

  handleChangeItems(e, field) {
    let original_document = { ...this.state.itemsDocumentSubmital };

    let updated_document = {};

    updated_document[field] = e.target.value;

    updated_document = Object.assign(original_document, updated_document);

    this.setState({
      itemsDocumentSubmital: updated_document
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

  handleChangeDateCycles(e, field) {
    let original_document = { ...this.state.documentCycle };

    let updated_document = {};

    updated_document[field] = e;

    updated_document = Object.assign(original_document, updated_document);

    this.setState({
      documentCycle: updated_document
    });
  }

  handleChangeDateItems(e, field) {
    let original_document = { ...this.state.itemsDocumentSubmital };

    let updated_document = {};

    updated_document[field] = e;

    updated_document = Object.assign(original_document, updated_document);

    this.setState({
      itemsDocumentSubmital: updated_document
    });
  }

  handleChangeDropDown(
    event,
    field,
    isSubscrib,
    targetState,
    url,
    param,
    selectedValue,
    subDatasource
  ) {
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
      let url =
        "GetNextArrangeMainDoc?projectId=" +
        this.state.projectId +
        "&docType=" +
        this.state.docTypeId +
        "&companyId=" +
        event.value +
        "&contactId=" +
        null;

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

  handleChangeDropDownCycles(
    event,
    field,
    isSubscrib,
    targetState,
    url,
    param,
    selectedValue,
    subDatasource
  ) {
    if (event == null) return;

    let original_document = { ...this.state.documentCycle };

    let updated_document = {};

    updated_document[field] = event.value;

    updated_document = Object.assign(original_document, updated_document);

    this.setState({
      documentCycle: updated_document,
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

  handleChangeDropDownItems(
    event,
    field,
    isSubscrib,
    targetState,
    url,
    param,
    selectedValue,
    subDatasource
  ) {
    if (event == null) return;

    let original_document = { ...this.state.itemsDocumentSubmital };

    let updated_document = {};

    updated_document[field] = event.value;

    updated_document = Object.assign(original_document, updated_document);

    this.setState({
      itemsDocumentSubmital: updated_document,
      [selectedValue]: event
    });
  }

  editSubmittal(event) {
    this.setState({
      isLoading: true
    });

    let saveDocument = this.state.document;

    saveDocument.docDate = moment(saveDocument.docDate, "DD/MM/YYYY").format(
      "YYYY-MM-DD[T]HH:mm:ss.SSS"
    );

    saveDocument.requiredDate = moment(
      saveDocument.requiredDate,
      "DD/MM/YYYY"
    ).format("YYYY-MM-DD[T]HH:mm:ss.SSS");

    dataservice.addObject("EditCommunicationRfi", saveDocument).then(result => {
      this.setState({
        isLoading: false
      });

      toast.success(Resources["operationSuccess"][currentLanguage]);

      this.props.history.push("/submittal/" + this.state.projectId);
    });
  }

  saveSubmittal(event) {
    this.setState({
      isLoading: true
    });

    let saveDocument = { ...this.state.document };

    let saveDocumentCycle = { ...this.state.documentCycle };

    saveDocument.docDate = moment(saveDocument.docDate, "DD/MM/YYYY").format("YYYY-MM-DD[T]HH:mm:ss.SSS");
    saveDocument.forwardToDate = moment(saveDocument.forwardToDate,"DD/MM/YYYY").format("YYYY-MM-DD[T]HH:mm:ss.SSS");

    saveDocumentCycle.docDate = moment(saveDocumentCycle.docDate,"DD/MM/YYYY").format("YYYY-MM-DD[T]HH:mm:ss.SSS");
    saveDocumentCycle.approvedDate = moment(saveDocumentCycle.approvedDate,"DD/MM/YYYY").format("YYYY-MM-DD[T]HH:mm:ss.SSS");

    dataservice.addObject("AddLogsSubmittal", saveDocument).then(result => {

        saveDocumentCycle.submittalId = result.id;
      
        dataservice.addObject("AddLogSubmittalCycles", saveDocumentCycle).then(data => {

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
      }).catch(ex => {
        this.setState({
          isLoading: false
        });

        toast.error(Resources["failError"][currentLanguage]);
      });
  }

  saveAndExit(event) {
 
    if(this.state.Stepes === 1){
 
    dataservice.GetDataGrid("GetLogsSubmittalItemsBySubmittalId?submittalId=" + this.state.docId).then(data => {
      
      let submittalItem = {};
      submittalItem.description = "";
      submittalItem.reviewResult = "";
      submittalItem.submitalDate = moment();
      submittalItem.refDoc = "";
      submittalItem.arrange = 1;
      submittalItem.id = "";

      this.setState({ 
        itemData: data,
        itemsDocumentSubmital: submittalItem,
        Stepes: this.state.Stepes + 1
      });
    }).catch(ex => toast.error(Resources["failError"][currentLanguage])); 
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
      Config.IsAllow(3317) === true ? (
        <ViewAttachment
          docTypeId={this.state.docTypeId}
          docId={this.state.docId}
          projectId={this.state.projectId}
          deleteAttachments={840}
        />
      ) : null
    ) : null;
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
      
      let maxArrange = _.maxBy(data, 'arrange');

      let submittalItem ={};

      submittalItem.description = "";
      submittalItem.reviewResult = "";
      submittalItem.submitalDate = moment();
      submittalItem.arrange = (maxArrange.arrange + 1);
      submittalItem.refDoc = "";
      submittalItem.submittalId = this.state.docId;
  
        this.setState({ 
          itemData: data,
          itemsDocumentSubmital: submittalItem,
          Stepes: this.state.Stepes + 1
        });
      }).catch(ex => toast.error(Resources["failError"][currentLanguage]));   
    } else {
      this.props.history.push("/submittal/" + this.state.projectId);
    }
  }

  PreviousStep() {
    if (this.state.Stepes === 2) {
      this.setState({
        Stepes: this.state.Stepes - 1
      });
    }
  }

  addSubmittalItems() {
    this.setState({
      isLoading: true
    });

    let saveDocument = { ...this.state.itemsDocumentSubmital };

    saveDocument.submitalDate = moment(
      saveDocument.submitalDate,
      "DD/MM/YYYY"
    ).format("YYYY-MM-DD[T]HH:mm:ss.SSS");

    dataservice
      .addObject("AddLogSubmittalItems", saveDocument)
      .then(data => {
        let setNewData = this.state.itemData;

        setNewData.push(data);
        let submittalItem = {};
        submittalItem.description = "";
        submittalItem.reviewResult = "";
        submittalItem.submitalDate = moment();
        submittalItem.refDoc = "";
        submittalItem.arrange = data.arrange + 1;

        this.setState({
          selectedReviewResult: {
            label: Resources.selectResult[currentLanguage],
            value: "0"
          },
          itemsDocumentSubmital: submittalItem,
          itemData: setNewData,
          isLoading: false
        });

        toast.success(Resources["operationSuccess"][currentLanguage]);
      })
      .catch(ex => {
        this.setState({
          isLoading: false
        });
        toast.error(Resources["failError"][currentLanguage]);
      });
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

  // componentWillUnmount(){
  //   alert("Leaving");
  // }
  finishDocument() {
    this.props.history.push("/submittal/" + this.state.projectId);
  }

  onCloseModal = () => {
    this.setState({ showDeleteModal: false });
  };

  clickHandlerCancelMain = () => {
    this.setState({ showDeleteModal: false });
  };

  clickHandlerContinueMain = () => {
    if (selectedRows.length > 0) {
      dataservice
        .addObject("DeleteMultipleLogsSubmittalsItemsById", selectedRows)
        .then(result => {
          let originalData = this.state.itemData;

          selectedRows.forEach(item => {
            let getIndex = originalData.findIndex(x => x.id === item.id);

            originalData.splice(getIndex, 1);
          });

          this.setState({
            itemData: originalData,
            showDeleteModal: false
          });

          toast.success(Resources["operationSuccess"][currentLanguage]);

          selectedRows = [];
        })
        .catch(ex => {
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

    let maxArrange = _.maxBy(this.state.itemData,'arrange')

    let submittalItem = {};

    submittalItem.description = "";
    submittalItem.reviewResult = "";
    submittalItem.submitalDate = moment();
    submittalItem.arrange = maxArrange.arrange + 1;
    submittalItem.refDoc = "";
    submittalItem.submittalId = this.state.docId;

    this.setState({
      selectedReviewResult: {
        label: Resources.selectResult[currentLanguage],
        value: "0"
      },
      itemsDocumentSubmital: submittalItem,
      viewForEdit: false
    });
  }

  viewModelToEdit(id,type) {
    if(type != "checkbox"){
      if (id) {
      dataservice.GetDataGrid("GetLogSubmittalItemsForEdit?id=" + id).then(data => {
          
        let submittalItem = {};

          submittalItem.description = data.description;
          submittalItem.reviewResult = data.reviewResult;
          submittalItem.submitalDate = moment(data.submitalDate).format("DD/MM/YYYY");
          submittalItem.arrange = data.arrange;
          submittalItem.refDoc = data.refDoc;
          submittalItem.id = data.id;
          
          this.setState({
            selectedReviewResult: {label: data.reviewResultName,value: data.reviewResult},
            itemsDocumentSubmital: submittalItem,
            viewForEdit: true
          });
        }).catch(ex => {
          toast.error(Resources["failError"][currentLanguage]);
        });
     }
    } 
  }

  editItems() { 

    this.setState({
      isLoading: true
    });

    let EditData = this.state.itemsDocumentSubmital;

    EditData.submitalDate = moment(EditData.submitalDate,"DD/MM/YYYY").format("YYYY-MM-DD[T]HH:mm:ss.SSS");

    dataservice.addObject("EditLogSubmittalItems", EditData).then(data => {

        let originalData = this.state.itemData;

        let getIndex = originalData.findIndex(x => x.id === EditData.id);

        originalData.splice(getIndex, 1);

        originalData.push(data);

        let maxArrange = _.maxBy(this.state.itemData,'arrange');
       
        let submittalItem = {};
        submittalItem.description = "";
        submittalItem.reviewResult = "";
        submittalItem.submitalDate = moment();
        submittalItem.refDoc = "";
        submittalItem.arrange = (maxArrange.arrange +1);
        //submittalItem.id = data.id;

        this.setState({
          itemsDocumentSubmital: submittalItem,
          itemData: originalData,
          viewForEdit: false,
          isLoading: false,
          selectedReviewResult: {label: Resources.selectResult[currentLanguage],value: "0"}
        });

        toast.success(Resources["operationSuccess"][currentLanguage]);
      })
      .catch(ex => {
        toast.error(Resources["failError"][currentLanguage]);
      });
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
        Header: Resources["description"][currentLanguage],
        accessor: "description",
        width: 200,
        sortabel: true
      },
      {
        Header: Resources["reviewResult"][currentLanguage],
        accessor: "reviewResultName",
        width: 200,
        sortabel: true
      },
      {
        Header: Resources["refDoc"][currentLanguage],
        accessor: "refDoc",
        width: 200,
        sortabel: true
      },
      {
        Header: Resources["submitalDate"][currentLanguage],
        accessor: "submitalDate",
        width: 200,
        sortabel: true,
        Cell: row => (
          <span>
            <span>{moment(row.value).format("DD/MM/YYYY")}</span>
          </span>
        )
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
        Header: Resources["description"][currentLanguage],
        accessor: "description",
        width: 200,
        sortabel: true
      },
      {
        Header: Resources["reviewResult"][currentLanguage],
        accessor: "reviewResultName",
        width: 200,
        sortabel: true
      },
      {
        Header: Resources["refDoc"][currentLanguage],
        accessor: "refDoc",
        width: 200,
        sortabel: true
      },
      {
        Header: Resources["submitalDate"][currentLanguage],
        accessor: "submitalDate",
        width: 200,
        sortabel: true,
        Cell: row => (
          <span>
            <span>{moment(row.value).format("DD/MM/YYYY")}</span>
          </span>
        )
      }
    ];

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
        <div className="documents-stepper noTabs__document one__tab one_step">
          <div className="submittalHead">
            <h2 className="zero">
              {Resources.Submittal[currentLanguage]}
              <span>{projectName.replace(/_/gi, " ")} · Communication</span>
            </h2>
            <div className="SubmittalHeadClose">
              <svg
                width="56px"
                height="56px"
                viewBox="0 0 56 56"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <g
                  id="Symbols"
                  stroke="none"
                  strokeWidth="1"
                  fill="none"
                  fillRule="evenodd"
                >
                  <g
                    id="Components/Sections/Doc-page/Title/Base"
                    transform="translate(-1286.000000, -24.000000)"
                  >
                    <g id="Group-2">
                      <g
                        id="Action-icons/Close/Circulated/56px/Light-grey_Normal"
                        transform="translate(1286.000000, 24.000000)"
                      >
                        <g id="Action-icons/Close/Circulated/20pt/Grey_Normal">
                          <g id="Group">
                            <circle
                              id="Oval"
                              fill="#E9ECF0"
                              cx="28"
                              cy="28"
                              r="28"
                            />
                            <path
                              d="M36.5221303,34.2147712 C37.1592899,34.8519308 37.1592899,35.8849707 36.5221303,36.5221303 C35.8849707,37.1592899 34.8519308,37.1592899 34.2147712,36.5221303 L28,30.3073591 L21.7852288,36.5221303 C21.1480692,37.1592899 20.1150293,37.1592899 19.4778697,36.5221303 C18.8407101,35.8849707 18.8407101,34.8519308 19.4778697,34.2147712 L25.6926409,28 L19.4778697,21.7852288 C18.8407101,21.1480692 18.8407101,20.1150293 19.4778697,19.4778697 C20.1150293,18.8407101 21.1480692,18.8407101 21.7852288,19.4778697 L28,25.6926409 L34.2147712,19.4778697 C34.8519308,18.8407101 35.8849707,18.8407101 36.5221303,19.4778697 C37.1592899,20.1150293 37.1592899,21.1480692 36.5221303,21.7852288 L30.3073591,28 L36.5221303,34.2147712 Z"
                              id="Combined-Shape"
                              fill="#858D9E"
                              fillRule="nonzero"
                            />
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            </div>
          </div>
          <div className="doc-container">
            {/* Right Menu */}

            <div className="step-content">
              <div id="step1" className="step-content-body">
                <div className="subiTabsContent">
                  {this.state.Stepes === 1 ? (
                    <div className="document-fields">
                      <Formik
                        //initialValues={{ ...this.state.document && this.state.documentCycle }}
                        //validationSchema={validationSchema}
                        onSubmit={values => {
                          if (
                            this.props.changeStatus === true &&
                            this.state.docId > 0
                          ) {
                            this.editSubmittal();
                          } else if (
                            this.props.changeStatus === false &&
                            this.state.docId === 0
                          ) {
                            this.saveSubmittal();
                          } else {
                            this.saveAndExit();
                          }
                        }}
                      >
                        {({errors,touched,handleBlur,handleChange,handleSubmit,setFieldValue,setFieldTouched}) => (
                          <Form
                            id="submittalForm"
                            className="customProform"
                            noValidate="novalidate"
                            onSubmit={handleSubmit}
                          >
                            <div className="proForm first-proform">
                              <div className="linebylineInput valid-input">
                                <label className="control-label">
                                  {Resources.subject[currentLanguage]}
                                </label>
                                <div
                                  className={
                                    "inputDev ui input" +
                                    (errors.subject && touched.subject
                                      ? " has-error"
                                      : !errors.subject && touched.subject
                                      ? " has-success"
                                      : " ")
                                  }
                                >
                                  <input
                                    name="subject"
                                    className="form-control fsadfsadsa"
                                    id="subject"
                                    placeholder={
                                      Resources.subject[currentLanguage]
                                    }
                                    autoComplete="off"
                                    value={this.state.document.subject}
                                    onBlur={e => {
                                      handleBlur(e);
                                      handleChange(e);
                                    }}
                                    onChange={e =>
                                      this.handleChange(e, "subject")
                                    }
                                  />
                                  {errors.subject && touched.subject ? (
                                    <em className="pError">{errors.subject}</em>
                                  ) : null}
                                </div>
                              </div>
                              <div className="linebylineInput valid-input">
                                <label className="control-label">
                                  {Resources.status[currentLanguage]}
                                </label>
                                <div className="ui checkbox radio radioBoxBlue">
                                  <input
                                    type="radio"
                                    name="status"
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
                                    name="status"
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
                              <div className="linebylineInput valid-input">
                                <div className="inputDev ui input input-group date NormalInputDate">
                                  <div className="customDatepicker fillter-status fillter-item-c ">
                                    <div className="proForm datepickerContainer">
                                      <label className="control-label">
                                        {Resources.docDate[currentLanguage]}
                                      </label>
                                      <div className="linebylineInput">
                                        <div className="inputDev ui input input-group date NormalInputDate">
                                          <ModernDatepicker
                                            date={this.state.document.docDate}
                                            format={"DD/MM/YYYY"}
                                            showBorder
                                            onChange={e =>
                                              this.handleChangeDate(
                                                e,
                                                "docDate"
                                              )
                                            }
                                            placeholder={"Select a date"}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="linebylineInput valid-input">
                                <div className="inputDev ui input input-group date NormalInputDate">
                                  <div className="customDatepicker fillter-status fillter-item-c ">
                                    <div className="proForm datepickerContainer">
                                      <label className="control-label">
                                        {
                                          Resources.forwardToDate[
                                            currentLanguage
                                          ]
                                        }
                                      </label>
                                      <div className="linebylineInput">
                                        <div className="inputDev ui input input-group date NormalInputDate">
                                          <ModernDatepicker
                                            date={
                                              this.state.document.forwardToDate
                                            }
                                            format={"DD/MM/YYYY"}
                                            showBorder
                                            onChange={e =>
                                              this.handleChangeDate(
                                                e,
                                                "forwardToDate"
                                              )
                                            }
                                            placeholder={"Select a date"}
                                          />
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
                                <div
                                  className={
                                    "ui input inputDev " +
                                    (errors.arrange && touched.arrange
                                      ? " has-error"
                                      : " ")
                                  }
                                >
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
                                  {errors.arrange && touched.arrange ? (
                                    <em className="pError">{errors.arrange}</em>
                                  ) : null}
                                </div>
                              </div>
                              <div className="linebylineInput valid-input">
                                <label className="control-label">
                                  {Resources.refDoc[currentLanguage]}
                                </label>
                                <div
                                  className={
                                    "ui input inputDev" +
                                    (errors.refNo && touched.refNo
                                      ? " has-error"
                                      : "ui input inputDev")
                                  }
                                >
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="refNo"
                                    value={this.state.document.refNo}
                                    name="refNo"
                                    placeholder={
                                      Resources.refDoc[currentLanguage]
                                    }
                                    onBlur={e => {
                                      handleChange(e);
                                      handleBlur(e);
                                    }}
                                    onChange={e =>
                                      this.handleChange(e, "refNo")
                                    }
                                  />
                                  {errors.refNo && touched.refNo ? (
                                    <em className="pError">{errors.refNo}</em>
                                  ) : null}
                                </div>
                              </div>
                              <div className="linebylineInput valid-input mix_dropdown">
                                <label className="control-label">
                                  {Resources.fromCompany[currentLanguage]}
                                </label>
                                <div className="supervisor__company">
                                  <div className="super_name">
                                    <Dropdown
                                      isMulti={false}
                                      data={this.state.fromContacts}
                                      selectedValue={
                                        this.state.selectedFromContact
                                      }
                                      handleChange={event =>
                                        this.handleChangeDropDown(
                                          event,
                                          "bicContactId",
                                          false,
                                          "",
                                          "",
                                          "",
                                          "selectedFromContact"
                                        )
                                      }
                                      onChange={setFieldValue}
                                      onBlur={setFieldTouched}
                                      error={errors.fromContactId}
                                      touched={touched.fromContactId}
                                      name="fromContactId"
                                      id="fromContactId"
                                    />
                                  </div>
                                  <div className="super_company">
                                    <Dropdown
                                      data={this.state.companies}
                                      isMulti={false}
                                      selectedValue={
                                        this.state.selectedFromCompany
                                      }
                                      handleChange={event => {
                                        this.handleChangeDropDown(
                                          event,
                                          "bicCompanyId",
                                          true,
                                          "fromContacts",
                                          "GetContactsByCompanyId",
                                          "companyId",
                                          "selectedFromCompany",
                                          "selectedFromContact"
                                        );
                                      }}
                                      onChange={setFieldValue}
                                      onBlur={setFieldTouched}
                                      error={errors.fromCompanyId}
                                      touched={touched.fromCompanyId}
                                      name="fromCompanyId"
                                      id="fromCompanyId"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="linebylineInput valid-input">
                                <Dropdown
                                  title="specsSection"
                                  data={this.state.specsSection}
                                  selectedValue={
                                    this.state.selectedSpecsSection
                                  }
                                  handleChange={event =>
                                    this.handleChangeDropDown(
                                      event,
                                      "specsSectionId",
                                      false,
                                      "",
                                      "",
                                      "",
                                      "selectedSpecsSection"
                                    )
                                  }
                                />
                              </div>
                              <div className="linebylineInput valid-input">
                                <Dropdown
                                  title="disciplineTitle"
                                  data={this.state.disciplines}
                                  selectedValue={this.state.selectedDiscpline}
                                  handleChange={event =>
                                    this.handleChangeDropDown(
                                      event,
                                      "disciplineId",
                                      false,
                                      "",
                                      "",
                                      "",
                                      "selectedDiscpline"
                                    )
                                  }
                                />
                              </div>
                              <div className="linebylineInput valid-input">
                                <Dropdown
                                  title="contractPo"
                                  data={this.state.contracts}
                                  selectedValue={this.state.selectedContract}
                                  handleChange={event =>
                                    this.handleChangeDropDown(
                                      event,
                                      "contractId",
                                      false,
                                      "",
                                      "",
                                      "",
                                      "selectedContract"
                                    )
                                  }
                                />
                              </div>
                              <div className="linebylineInput valid-input">
                                <Dropdown
                                  title="reasonForIssue"
                                  data={this.state.reasonForIssue}
                                  selectedValue={
                                    this.state.selectedReasonForIssue
                                  }
                                  handleChange={event =>
                                    this.handleChangeDropDown(
                                      event,
                                      "reasonForIssueId",
                                      false,
                                      "",
                                      "",
                                      "",
                                      "selectedReasonForIssue"
                                    )
                                  }
                                />
                              </div>
                              <div className="linebylineInput valid-input">
                                <label className="control-label">
                                  {Resources.fileNumber[currentLanguage]}
                                </label>
                                <div className="inputDev ui input">
                                  <input
                                    name="fileNumber"
                                    className="form-control fsadfsadsa"
                                    id="fileNumber"
                                    placeholder={
                                      Resources.fileNumber[currentLanguage]
                                    }
                                    autoComplete="off"
                                    value={this.state.document.fileNumber}
                                    onBlur={e => {
                                      handleBlur(e);
                                      handleChange(e);
                                    }}
                                    onChange={e =>
                                      this.handleChange(e, "fileNumber")
                                    }
                                  />
                                </div>
                              </div>
                              <div className="linebylineInput valid-input">
                                <Dropdown
                                  title="area"
                                  data={this.state.areas}
                                  selectedValue={this.state.selectedArea}
                                  handleChange={event =>
                                    this.handleChangeDropDown(
                                      event,
                                      "area",
                                      false,
                                      "",
                                      "",
                                      "",
                                      "selectedArea"
                                    )
                                  }
                                />
                              </div>
                              <div className="linebylineInput valid-input">
                                <Dropdown
                                  title="location"
                                  data={this.state.locations}
                                  selectedValue={this.state.selectedLocation}
                                  handleChange={event =>
                                    this.handleChangeDropDown(
                                      event,
                                      "location",
                                      false,
                                      "",
                                      "",
                                      "",
                                      "selectedLocation"
                                    )
                                  }
                                />
                              </div>
                              <div className="linebylineInput valid-input">
                                <label className="control-label">
                                  {Resources.Building[currentLanguage]}
                                </label>
                                <div
                                  className={
                                    "inputDev ui input" +
                                    (errors.Building && touched.Building
                                      ? " has-error"
                                      : !errors.Building && touched.Building
                                      ? " has-success"
                                      : " ")
                                  }
                                >
                                  <input
                                    name="Building"
                                    className="form-control fsadfsadsa"
                                    id="Building"
                                    placeholder={
                                      Resources.Building[currentLanguage]
                                    }
                                    autoComplete="off"
                                    value={this.state.document.building}
                                    onBlur={e => {
                                      handleBlur(e);
                                      handleChange(e);
                                    }}
                                    onChange={e =>
                                      this.handleChange(e, "building")
                                    }
                                  />
                                  {errors.Building && touched.Building ? (
                                    <em className="pError">
                                      {errors.Building}
                                    </em>
                                  ) : null}
                                </div>
                              </div>
                              <div className="linebylineInput valid-input">
                                <label className="control-label">
                                  {Resources.apartmentNumber[currentLanguage]}
                                </label>
                                <div
                                  className={
                                    "inputDev ui input" +
                                    (errors.apartmentNumber &&
                                    touched.apartmentNumber
                                      ? " has-error"
                                      : !errors.apartmentNumber &&
                                        touched.apartmentNumber
                                      ? " has-success"
                                      : " ")
                                  }
                                >
                                  <input
                                    name="apartment"
                                    className="form-control fsadfsadsa"
                                    id="apartment"
                                    placeholder={
                                      Resources.apartmentNumber[currentLanguage]
                                    }
                                    autoComplete="off"
                                    value={this.state.document.apartment}
                                    onBlur={e => {
                                      handleBlur(e);
                                      handleChange(e);
                                    }}
                                    onChange={e =>
                                      this.handleChange(e, "apartment")
                                    }
                                  />
                                  {errors.apartmentNumber &&
                                  touched.apartmentNumber ? (
                                    <em className="pError">
                                      {" "}
                                      {errors.apartmentNumber}{" "}
                                    </em>
                                  ) : null}
                                </div>
                              </div>
                              <div className="linebylineInput valid-input">
                                <Dropdown
                                  title="submittalType"
                                  data={this.state.SubmittalTypes}
                                  selectedValue={
                                    this.state.selectedSubmittalType
                                  }
                                  handleChange={event =>
                                    this.handleChangeDropDown(
                                      event,
                                      "submittalType",
                                      false,
                                      "",
                                      "",
                                      "",
                                      "selectedSubmittalType"
                                    )
                                  }
                                />
                              </div>
                              <div className="linebylineInput valid-input">
                                <label className="control-label">
                                  {Resources.sharedSettings[currentLanguage]}
                                </label>
                                <div className="shareLinks">
                                  <div className="inputDev ui input">
                                    <input
                                      type="text"
                                      className="form-control"
                                      id="sharedSettings"
                                      onChange={e =>
                                        this.handleChange(e, "sharedSettings")
                                      }
                                      value={this.state.document.sharedSettings}
                                      name="sharedSettings"
                                      placeholder={
                                        Resources.sharedSettings[
                                          currentLanguage
                                        ]
                                      }
                                    />
                                  </div>
                                  <a
                                    target="_blank"
                                    href={this.state.document.sharedSettings}
                                  >
                                    <span>
                                      {Resources.openFolder[currentLanguage]}
                                    </span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="doc-pre-cycle fullWidthWrappertextLeft cycleInsideForm">
                              <header>
                                <h2 className="zero">
                                  {Resources["CycleDetails"][currentLanguage]}
                                </h2>
                              </header>
                            </div>
                            <div className="proForm first-proform">
                              <div className="linebylineInput valid-input">
                                <label className="control-label">
                                  {Resources.subject[currentLanguage]}
                                </label>
                                <div
                                  className={
                                    "inputDev ui input" +
                                    (errors.subject && touched.subject
                                      ? " has-error"
                                      : !errors.subject && touched.subject
                                      ? " has-success"
                                      : " ")
                                  }
                                >
                                  <input
                                    name="subjectCycle"
                                    className="form-control fsadfsadsa"
                                    id="subjectCycle"
                                    placeholder={
                                      Resources.subject[currentLanguage]
                                    }
                                    autoComplete="off"
                                    value={this.state.documentCycle.subject}
                                    onBlur={e => {
                                      handleBlur(e);
                                      handleChange(e);
                                    }}
                                    onChange={e =>
                                      this.handleChangeCycles(e, "subject")
                                    }
                                  />
                                  {errors.subject && touched.subject ? (
                                    <em className="pError">{errors.subject}</em>
                                  ) : null}
                                </div>
                              </div>
                              <div className="linebylineInput valid-input">
                                <label className="control-label">
                                  {Resources.status[currentLanguage]}
                                </label>
                                <div className="ui checkbox radio radioBoxBlue">
                                  <input
                                    type="radio"
                                    name="cycleStatus"
                                    defaultChecked={
                                      this.state.documentCycle.CycleStatus ===
                                      false
                                        ? null
                                        : "checked"
                                    }
                                    value="true"
                                    onChange={e =>
                                      this.handleChangeCycles(e, "CycleStatus")
                                    }
                                  />
                                  <label>
                                    {Resources.oppened[currentLanguage]}
                                  </label>
                                </div>
                                <div className="ui checkbox radio radioBoxBlue">
                                  <input
                                    type="radio"
                                    name="cycleStatus"
                                    defaultChecked={
                                      this.state.documentCycle.CycleStatus ===
                                      false
                                        ? "checked"
                                        : null
                                    }
                                    value="false"
                                    onChange={e =>
                                      this.handleChangeCycles(e, "CycleStatus")
                                    }
                                  />
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
                                        {Resources.cycleDate[currentLanguage]}
                                      </label>
                                      <div className="linebylineInput">
                                        <div className="inputDev ui input input-group date NormalInputDate">
                                          <ModernDatepicker
                                            date={
                                              this.state.documentCycle.docDate
                                            }
                                            format={"DD/MM/YYYY"}
                                            showBorder
                                            onChange={e =>
                                              this.handleChangeDateCycles(
                                                e,
                                                "docDate"
                                              )
                                            }
                                            placeholder={"Select a date"}
                                          />
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
                                <div
                                  className={
                                    "ui input inputDev " +
                                    (errors.arrange && touched.arrange
                                      ? " has-error"
                                      : " ")
                                  }
                                >
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="arrangeCycle"
                                    readOnly
                                    value={this.state.documentCycle.arrange}
                                    name="arrangeCycle"
                                    placeholder={
                                      Resources.arrange[currentLanguage]
                                    }
                                    onBlur={e => {
                                      handleChange(e);
                                      handleBlur(e);
                                    }}
                                    onChange={e =>
                                      this.handleChangeCycles(e, "arrange")
                                    }
                                  />
                                </div>
                              </div>
                              <div className="linebylineInput valid-input">
                                <Dropdown
                                  title="approvalStatus"
                                  data={this.state.approvales}
                                  selectedValue={
                                    this.state.selectedApprovalStatus
                                  }
                                  handleChange={event =>
                                    this.handleChangeDropDownCycles(
                                      event,
                                      "approvalStatusId",
                                      false,
                                      "",
                                      "",
                                      "",
                                      "selectedApprovalStatus"
                                    )
                                  }
                                />
                              </div>
                              <div className="linebylineInput valid-input mix_dropdown">
                                <label className="control-label">
                                  {Resources.fromCompany[currentLanguage]}
                                </label>
                                <div className="supervisor__company">
                                  <div className="super_name">
                                    <Dropdown
                                      isMulti={false}
                                      data={this.state.fromContactsCycles}
                                      selectedValue={
                                        this.state.selectedFromContactCycles
                                      }
                                      handleChange={event =>
                                        this.handleChangeDropDownCycles(
                                          event,
                                          "flowContactId",
                                          false,
                                          "",
                                          "",
                                          "",
                                          "selectedFromContactCycles"
                                        )
                                      }
                                      onChange={setFieldValue}
                                      onBlur={setFieldTouched}
                                      error={errors.fromContactIdCycle}
                                      touched={touched.fromContactIdCycle}
                                      name="fromContactIdCycle"
                                      id="fromContactIdCycle"
                                    />
                                  </div>
                                  <div className="super_company">
                                    <Dropdown
                                      data={this.state.companies}
                                      isMulti={false}
                                      selectedValue={
                                        this.state.selectedFromCompanyCycles
                                      }
                                      handleChange={event => {
                                        this.handleChangeDropDownCycles(
                                          event,
                                          "flowCompanyId",
                                          true,
                                          "fromContactsCycles",
                                          "GetContactsByCompanyId",
                                          "companyId",
                                          "selectedFromCompanyCycles",
                                          "selectedFromContact"
                                        );
                                      }}
                                      onChange={setFieldValue}
                                      onBlur={setFieldTouched}
                                      error={errors.fromCompanyId}
                                      touched={touched.fromCompanyId}
                                      name="fromCompanyIdCycle"
                                      id="fromCompanyIdCycle"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="linebylineInput valid-input">
                                <div className="inputDev ui input input-group date NormalInputDate">
                                  <div className="customDatepicker fillter-status fillter-item-c ">
                                    <div className="proForm datepickerContainer">
                                      <label className="control-label">
                                        {
                                          Resources.dateApproved[
                                            currentLanguage
                                          ]
                                        }
                                      </label>
                                      <div className="linebylineInput">
                                        <div className="inputDev ui input input-group date NormalInputDate">
                                          <ModernDatepicker
                                            date={
                                              this.state.documentCycle
                                                .approvedDate
                                            }
                                            format={"DD/MM/YYYY"}
                                            showBorder
                                            onChange={e =>
                                              this.handleChangeDateCycles(
                                                e,
                                                "approvedDate"
                                              )
                                            }
                                            placeholder={"Select a date"}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="slider-Btns">
                              {this.state.isLoading === false ? (
                                <button
                                  className="primaryBtn-1 btn meduimBtn"
                                  type="submit"
                                >
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
                      {this.state.itemData.length > 0 ? (
                        <ReactTable
                          data={this.state.itemData}
                          columns={columnsItems}
                          defaultPageSize={10}
                          noDataText={Resources["noData"][currentLanguage]}
                          className="-striped -highlight"
                        />
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
                        <Formik
                          initialValues={{
                            ...this.state.itemsDocumentSubmital
                          }}
                          // validationSchema={ValidtionSchemaForEdit}
                          onSubmit={values => {
                            this.addSubmittalItems();
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
                            <Form onSubmit={handleSubmit}>
                              <div className="proForm datepickerContainer">
                                <div className="linebylineInput valid-input">
                                  <label className="control-label">
                                    {Resources["description"][currentLanguage]}
                                  </label>
                                  <div className="inputDev ui input">
                                    <input
                                      name="description"
                                      className="form-control fsadfsadsa"
                                      id="description"
                                      placeholder={
                                        Resources.description[currentLanguage]
                                      }
                                      autoComplete="off"
                                      value={
                                        this.state.itemsDocumentSubmital
                                          .description
                                      }
                                      onBlur={e => {
                                        handleBlur(e);
                                        handleChange(e);
                                      }}
                                      onChange={e =>
                                        this.handleChangeItems(e, "description")
                                      }
                                    />
                                    {errors.description &&
                                    touched.description ? (
                                      <em className="pError">
                                        {" "}
                                        {errors.description}
                                      </em>
                                    ) : null}
                                  </div>
                                </div>
                                <div className="linebylineInput valid-input">
                                  <div className="inputDev ui input">
                                    <Dropdown
                                      title="reviewResult"
                                      data={this.state.reviewResult}
                                      selectedValue={
                                        this.state.selectedReviewResult
                                      }
                                      handleChange={event =>
                                        this.handleChangeDropDownItems(
                                          event,
                                          "reviewResult",
                                          false,
                                          "",
                                          "",
                                          "",
                                          "selectedReviewResult"
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="linebylineInput valid-input">
                                  <div className="inputDev ui input input-group date NormalInputDate">
                                    <div className="customDatepicker fillter-status fillter-item-c ">
                                      <div className="proForm datepickerContainer">
                                        <label className="control-label">
                                          {
                                            Resources.submitalDate[
                                              currentLanguage
                                            ]
                                          }
                                        </label>
                                        <div className="linebylineInput">
                                          <div className="inputDev ui input input-group date NormalInputDate">
                                            <ModernDatepicker
                                              date={
                                                this.state.itemsDocumentSubmital
                                                  .submitalDate
                                              }
                                              format={"DD/MM/YYYY"}
                                              showBorder
                                              onChange={e =>
                                                this.handleChangeDateItems(
                                                  e,
                                                  "submitalDate"
                                                )
                                              }
                                              placeholder={"Select a date"}
                                            />
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
                                  <div
                                    className={
                                      "ui input inputDev " +
                                      (errors.arrange && touched.arrange
                                        ? " has-error"
                                        : " ")
                                    }
                                  >
                                    <input
                                      type="text"
                                      className="form-control"
                                      id="arrange"
                                      readOnly
                                      value={
                                        this.state.itemsDocumentSubmital.arrange
                                      }
                                      name="arrange"
                                      placeholder={
                                        Resources.arrange[currentLanguage]
                                      }
                                      onBlur={e => {
                                        handleChange(e);
                                        handleBlur(e);
                                      }}
                                      onChange={e =>
                                        this.handleChangeDateItems(e, "arrange")
                                      }
                                    />
                                    {errors.arrange && touched.arrange ? (
                                      <em className="pError">
                                        {" "}
                                        {errors.arrange}{" "}
                                      </em>
                                    ) : null}
                                  </div>
                                </div>
                                <div className="linebylineInput valid-input">
                                  <label className="control-label">
                                    {Resources.refDoc[currentLanguage]}
                                  </label>
                                  <div
                                    className={
                                      "ui input inputDev" +
                                      (errors.refDoc && touched.refDoc
                                        ? " has-error"
                                        : "ui input inputDev")
                                    }
                                  >
                                    <input
                                      type="text"
                                      className="form-control"
                                      id="refNo"
                                      value={
                                        this.state.itemsDocumentSubmital.refDoc
                                      }
                                      name="refDoc"
                                      placeholder={
                                        Resources.refDoc[currentLanguage]
                                      }
                                      onBlur={e => {
                                        handleChange(e);
                                        handleBlur(e);
                                      }}
                                      onChange={e =>
                                        this.handleChangeItems(e, "refDoc")
                                      }
                                    />
                                    {errors.refDoc && touched.refDoc ? (
                                      <em className="pError">
                                        {" "}
                                        {errors.refDoc}{" "}
                                      </em>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                              <div className="slider-Btns">
                                {this.state.isLoading === false ? (
                                  <button
                                    className="primaryBtn-1 btn meduimBtn"
                                    type="submit"
                                  >
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
                          {selectedRows.length > 0 ? (
                            <div
                              className={
                                "gridSystemSelected " +
                                (selectedRows.length > 0 ? " active" : "")
                              }
                            >
                              <div className="tableselcted-items">
                                <span id="count-checked-checkboxes">
                                  {selectedRows.length}
                                </span>
                                <span>Selected</span>
                              </div>
                              <div className="tableSelctedBTNs">
                                <button
                                  className="defaultBtn btn smallBtn"
                                  onClick={this.DeleteDocumentAttachment.bind(this)}>
                                  {Resources["delete"][currentLanguage]}
                                </button>
                              </div>
                            </div>
                          ) : null}
                          <ReactTable
                            data={this.state.itemData}
                            columns={columns}
                            defaultPageSize={10}
                            noDataText={Resources["noData"][currentLanguage]}
                            className="-striped -highlight"
                            getTrProps={(state, rowInfo, column, instance) => {
                              return {
                                onClick: e => {
                                    this.viewModelToEdit(rowInfo.original.id,e.target.type);
                                }
                              };
                            }}
                          />
                        </div>
                      </div>
                    </Fragment>
                  )}
                  <div className="slider-Btns">
                    {this.state.Stepes === 2 ? (
                      <button
                        className="primaryBtn-1 btn meduimBtn"
                        onClick={this.finishDocument.bind(this)}
                      >
                        {Resources["finish"][currentLanguage]}
                      </button>
                    ) : null}
                  </div>
                  <div className="doc-pre-cycle letterFullWidth">
                    <div>
                      {this.state.docId > 0 && this.state.Stepes === 1 ? (
                        <UploadAttachment
                          docTypeId={this.state.docTypeId}
                          docId={this.state.docId}
                          projectId={this.state.projectId}
                        />
                      ) : null}
                      {this.state.Stepes === 1 ? this.viewAttachments() : null}
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
            </div>
            {/* step document */}
            <div className="docstepper-levels">
              <div className="step-content-foot">
                <span
                  onClick={this.PreviousStep.bind(this)}
                  className={
                    this.state.Stepes != 1 && this.state.isEdit === true
                      ? "step-content-btn-prev "
                      : "step-content-btn-prev disabled"
                  }
                >
                  <i className="fa fa-caret-left" aria-hidden="true" />
                  Previous
                </span>
                <span
                  onClick={this.NextStep.bind(this)}
                  className={
                    this.state.Stepes != 2 && this.state.isEdit === true
                      ? "step-content-btn-prev "
                      : "step-content-btn-prev disabled"
                  }
                >
                  Next
                  <i className="fa fa-caret-right" aria-hidden="true" />
                </span>
              </div>
              <div className="workflow-sliderSteps">
                <div className="step-slider">
                  <div
                    data-id="step1"
                    className={
                      "step-slider-item " +
                      (this.state.Stepes === 1 ? "active" : "current__step")
                    }
                  >
                    <div className="steps-timeline">
                      <span>1</span>
                    </div>
                    <div className="steps-info">
                      <h6>{Resources["Submittal"][currentLanguage]}</h6>
                    </div>
                  </div>
                  <div
                    data-id="step2 "
                    className={
                      "step-slider-item " +
                      (this.state.Stepes === 2
                        ? "active"
                        : this.state.SecondStepComplate
                        ? "current__step"
                        : "")
                    }
                  >
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
          {this.state.showDeleteModal == true ? (
            <ConfirmationModal
              title={Resources["smartDeleteMessage"][currentLanguage].content}
              buttonName="delete"
              closed={this.onCloseModal}
              showDeleteModal={this.state.showDeleteModal}
              clickHandlerCancel={this.clickHandlerCancelMain}
              clickHandlerContinue={this.clickHandlerContinueMain.bind(this)}
            />
          ) : null}
          {this.state.viewForEdit ? (
            <Fragment>
              <Rodal
                visible={this.state.viewForEdit}
                onClose={this.closeModal.bind(this)}
              >
                <div className="ui modal largeModal ">
                  <Formik
                    initialValues={{ ...this.state.itemsDocumentSubmital }}
                    // validationSchema={ValidtionSchemaForEdit}
                    onSubmit={values => {
                      this.editItems();
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
                        <div className=" proForm customProform">
                          <div className="fillter-status fillter-item-c">
                            <label className="control-label">
                              {Resources["description"][currentLanguage]}
                            </label>
                            <div className="inputDev ui input">
                              <input
                                name="description"
                                className="form-control fsadfsadsa"
                                id="description"
                                placeholder={
                                  Resources.description[currentLanguage]
                                }
                                autoComplete="off"
                                value={
                                  this.state.itemsDocumentSubmital.description
                                }
                                onBlur={e => {
                                  handleBlur(e);
                                  handleChange(e);
                                }}
                                onChange={e =>
                                  this.handleChangeItems(e, "description")
                                }
                              />
                              {errors.description && touched.description ? (
                                <em className="pError">{errors.description}</em>
                              ) : null}
                            </div>
                          </div>
                          <div className="fillter-status fillter-item-c">
                            <div className="inputDev ui input">
                              <Dropdown
                                title="reviewResult"
                                data={this.state.reviewResult}
                                selectedValue={this.state.selectedReviewResult}
                                handleChange={event =>
                                  this.handleChangeDropDownItems(
                                    event,
                                    "reviewResult",
                                    false,
                                    "",
                                    "",
                                    "",
                                    "selectedReviewResult"
                                  )
                                }
                              />
                            </div>
                          </div>
                          <div className="fillter-status fillter-item-c">
                            <div className="inputDev ui input input-group date NormalInputDate">
                              <div className="customDatepicker fillter-status fillter-item-c ">
                                <div className="proForm datepickerContainer">
                                  <label className="control-label">
                                    {Resources.submitalDate[currentLanguage]}
                                  </label>
                                  <div className="linebylineInput">
                                    <div className="inputDev ui input input-group date NormalInputDate">
                                      <ModernDatepicker
                                        date={
                                          this.state.itemsDocumentSubmital
                                            .submitalDate
                                        }
                                        format={"DD/MM/YYYY"}
                                        showBorder
                                        onChange={e =>
                                          this.handleChangeDateItems(
                                            e,
                                            "submitalDate"
                                          )
                                        }
                                        placeholder={"Select a date"}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="fillter-status fillter-item-c">
                            <label className="control-label">
                              {Resources.arrange[currentLanguage]}
                            </label>
                            <div
                              className={
                                "ui input inputDev " +
                                (errors.arrange && touched.arrange
                                  ? " has-error"
                                  : " ")
                              }
                            >
                              <input
                                type="text"
                                className="form-control"
                                id="arrange"
                                readOnly
                                value={this.state.itemsDocumentSubmital.arrange}
                                name="arrange"
                                placeholder={Resources.arrange[currentLanguage]}
                                onBlur={e => {
                                  handleChange(e);
                                  handleBlur(e);
                                }}
                                onChange={e =>
                                  this.handleChangeDateItems(e, "arrange")
                                }
                              />
                              {errors.arrange && touched.arrange ? (
                                <em className="pError">{errors.arrange}</em>
                              ) : null}
                            </div>
                          </div>
                          <div className="fillter-status fillter-item-c">
                            <label className="control-label">
                              {Resources.refDoc[currentLanguage]}
                            </label>
                            <div className={ "ui input inputDev" + (errors.refDoc && touched.refDoc ? " has-error" : "ui input inputDev")}>
                              <input type="text" className="form-control" id="refNo" value={this.state.itemsDocumentSubmital.refDoc}
                                     name="refDoc" placeholder={Resources.refDoc[currentLanguage]} onBlur={e => { handleChange(e); handleBlur(e); }}
                                     onChange={e => this.handleChangeItems(e, "refDoc") } />
                              {errors.refDoc && touched.refDoc ? ( <em className="pError">{errors.refDoc}</em> ) : null}
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
    documentCycle: state.communication.documentCycle
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
)(withRouter(SubmittalAddEdit));
