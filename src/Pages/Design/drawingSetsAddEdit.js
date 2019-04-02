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

const _ = require("lodash");

let selectedRows = [];

let currentLanguage =
  localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const validationSchema = Yup.object().shape({
  subject: Yup.string().required(Resources["subjectRequired"][currentLanguage]).max(450, Resources["maxLength"][currentLanguage]),
  subjectCycle: Yup.string().required(Resources["subjectRequired"][currentLanguage]).max(450, Resources["maxLength"][currentLanguage]),
  arrange: Yup.number().required(Resources["arrange"][currentLanguage]),
  arrangeCycle: Yup.number().required(Resources["arrange"][currentLanguage]),
  refNo: Yup.string().max(100, Resources["maxLength"][currentLanguage]),
  fromContactId: Yup.string().required(Resources["fromContactRequired"][currentLanguage]).nullable(true),
  fromContactIdCycle: Yup.string().required(Resources["fromContactRequired"][currentLanguage]).nullable(true),
  disciplineId: Yup.string().required(Resources["disciplineRequired"][currentLanguage]).nullable(true),
  contract: Yup.string().required(Resources["contractPoSelection"][currentLanguage]),
  approvalStatus: Yup.string().required(Resources["approvalStatusSelection"][currentLanguage]).nullable(true)
});

const validationSchemaEdit = Yup.object().shape({
  subject: Yup.string().required(Resources["subjectRequired"][currentLanguage]).max(450, Resources["maxLength"][currentLanguage]),
  arrange: Yup.number().required(Resources["arrange"][currentLanguage]),
  refNo: Yup.string().max(100, Resources["maxLength"][currentLanguage]),
  fromContactId: Yup.string().required(Resources["fromContactRequired"][currentLanguage]).nullable(true),
  disciplineId: Yup.string().required(Resources["disciplineRequired"][currentLanguage]).nullable(true)
});

const validationSchemaForCycle = Yup.object().shape({
  description: Yup.string().required(Resources["description"][currentLanguage]),
  refDoc: Yup.string().max(450, Resources["selectRefNo"][currentLanguage]),
  reviewResult: Yup.string().required(Resources["selectResult"][currentLanguage]).nullable(true)
});

const validationCycleSubmital = Yup.object().shape({
  subject: Yup.string().required(Resources["subjectRequired"][currentLanguage]).max(450, Resources["maxLength"][currentLanguage]),
  arrange: Yup.number().required(Resources["arrange"][currentLanguage]),
  fromContactId: Yup.string().required(Resources["fromContactRequired"][currentLanguage]).nullable(true),
  approvalStatusId: Yup.string().required(Resources["approvalStatusSelection"][currentLanguage]).nullable(true)
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
      cycleId: "",
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
      addNewCycle: false,
      document: this.props.document ? Object.assign({}, this.props.document) : {},
      documentCycle: this.props.documentCycle ? Object.assign({}, this.props.documentCycle) : {},
      itemsDocumentSubmital: {},
      addCycleSubmital: {},
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
      submittalItemData: [],
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
      selectedFromCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0"},
      selectedFromContact: { label: Resources.fromContactRequired[currentLanguage], value: "0"},
      selectedFromCompanyCycles: { label: Resources.fromCompanyRequired[currentLanguage], value: "0"},
      selectedFromContactCycles: { label: Resources.fromContactRequired[currentLanguage], value: "0"},
      selectedSpecsSection: { label: Resources.specsSectionSelection[currentLanguage], value: "0"},
      selectedDiscpline: { label: Resources.disciplineRequired[currentLanguage], value: "0" },
      selectedContract: { label: Resources.contractPoSelection[currentLanguage], value: "0" },
      selectedReasonForIssue: { label: Resources.SelectReasonForIssueId[currentLanguage], value: "0" },
      selectedArea: { label: Resources.area[currentLanguage], value: "0" },
      selectedLocation: { label: Resources.locationRequired[currentLanguage], value: "0" },
      selectedSubmittalType: { label: Resources.submittalType[currentLanguage], value: "0" },
      selectedApprovalStatus: { label: Resources.approvalStatusSelection[currentLanguage], value: "0"},
      selectedReviewResult: { label: Resources.selectResult[currentLanguage], value: "0" },
      selectedCycleAprrovalStatus: { label: Resources.selectResult[currentLanguage], value: "0" },
      selectedNewFromContactCycles: { label: Resources.fromContactRequired[currentLanguage], value: "0" },
      selectedNewFromCompanyCycles: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
      type: ""
    };

    if (!Config.IsAllow(220) || !Config.IsAllow(221) || !Config.IsAllow(223)) {
      toast.success(Resources["missingPermissions"][currentLanguage]);

      this.props.history.push("/submittal/" + this.state.projectId);
    }
  }

  componentDidMount() {
    var links = document.querySelectorAll( ".noTabs__document .doc-container .linebylineInput" );

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
      dataservice.GetRowById("GetLogSubmittalCyclesForEdit?id=" + nextProps.document.id).then(result => {

          this.props.document.docDate = this.props.document.docDate != null ? moment(this.props.document.docDate).format("DD/MM/YYYY") : moment();
          this.props.document.forwardToDate = this.props.document.forwardToDate != null ? moment(this.props.document.forwardToDate).format("DD/MM/YYYY") : moment();

          result.docDate = result.docDate != null ? moment(result.docDate).format("DD/MM/YYYY") : moment();
          result.approvedDate = result.approvedDate != null ? moment(result.approvedDate).format("DD/MM/YYYY") : moment();

          this.setState({
            isEdit: true,
            document: this.props.document,
            documentCycle: { ...result },
            addCycleSubmital: { ...result },
            hasWorkflow: this.props.hasWorkflow
          });

          dataservice.GetDataGrid("GetLogsSubmittalItemsBySubmittalId?submittalId=" +this.state.docId).then(data => {
              this.setState({
                itemData: data
              });
            }).catch(ex => toast.error(Resources["failError"][currentLanguage]));

          dataservice.GetDataGrid("GetLogsSubmittalsCyclessBySubmittalId?submittalId=" +this.state.docId).then(result => {
              this.setState({
                submittalItemData: result
              });
            }).catch(ex => toast.error(Resources["failError"][currentLanguage]));

          this.fillDropDowns(nextProps.document.id > 0 ? true : false);
        });

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
      subject: "Cycle No. R " + 1,
      approvalStatusId: "",
      arrange: "1",
      flowCompanyId: "",
      fromContactId: "",
      approvalAction: "1"
    };

    if (this.state.docId > 0) {
      let url = "GetLogsSubmittalForEdit?id=" + this.state.docId;

      this.props.actions.documentForEdit(url);

      this.setState({
        addCycleSubmital: submittalDocumentCycles
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
        cyclesCount: "1",
        subjectCycle:""
      };

      this.setState({
        document: submittalDocument,
        documentCycle: submittalDocumentCycles,
        addCycleSubmital: submittalDocumentCycles
      });

      this.fillDropDowns(false);
    }
    this.props.actions.documentForAdding();
  }

  fillSubDropDownInEdit(url,param,value,subField,subSelectedValue,subDatasource) {

    let action = url + "?" + param + "=" + value;

    dataservice.GetDataList(action, "contactName", "id").then(result => {
      if (this.props.changeStatus === true) {
        if (subField != "flowContactId") {
          let toSubField = this.state.document[subField];

          let targetFieldSelected = _.find(result, function(i) {
            return i.value == toSubField;
          });

          this.setState({
            [subSelectedValue]: targetFieldSelected,
            [subDatasource]: result
          });
        } else {
          let toSubField = this.state.documentCycle[subField];

          let targetFieldSelected = _.find(result, function(i) {
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
    dataservice.GetDataList("GetProjectProjectsCompaniesForList?projectId=" + projectId,"companyName","companyId").then(result => {

        if (isEdit) {
      
          let companyId = this.props.document.bicCompanyId;

          let flowCompanyId = this.state.documentCycle.flowCompanyId;

          if (companyId) {
            this.setState({
              selectedFromCompany: {
                label: this.props.document.bicCompanyName,
                value: companyId
              }
            });

            this.fillSubDropDownInEdit("GetContactsByCompanyId","companyId",companyId,"bicContactId","selectedFromContact","fromContacts");
          }
          if (flowCompanyId) {

            this.setState({
              selectedFromCompanyCycles: {label: this.state.documentCycle.flowCompanyName,value: flowCompanyId}
            });

            this.fillSubDropDownInEdit("GetContactsByCompanyId","companyId",flowCompanyId,"flowContactId","selectedFromContactCycles","fromContactsCycles");
          }
        }
        this.setState({
          companies: [...result]
        });
      });

    //discplines
    dataservice.GetDataList("GetaccountsDefaultListForList?listType=discipline","title","id").then(result => {

        if (isEdit) {
      
          let disciplineId = this.props.document.disciplineId;

          if (disciplineId) {
      
            let disciplineName = result.find(i => i.value === disciplineId);

            this.setState({
              selectedDiscpline: { label: disciplineName.label, value: disciplineId}
            });
          }
        }
        this.setState({
          disciplines: [...result]
        });
      });

    //location
    dataservice.GetDataList("GetaccountsDefaultListForList?listType=location","title","id").then(result => {
        
      if (isEdit) {
      
        let locationId = this.props.document.location;

          if (locationId) {
            let locationName = result.find(i => i.value === parseInt(locationId));

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
    dataservice.GetDataList("GetaccountsDefaultListForList?listType=area", "title", "id").then(result => {

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
    dataservice.GetDataList("GetaccountsDefaultListForList?listType=reasonForIssue","title","id").then(result => {

        if (isEdit) {
      
          let reasonFor = this.props.document.reasonForIssueId;

          if (reasonFor) {
            this.setState({
              selectedReasonForIssue: {label: this.props.document.reasonForIssueName,value: this.props.document.reasonForIssueId}
            });
          }
        }
        this.setState({
          reasonForIssue: [...result]
        });
      });

    //reviewResult
    dataservice.GetDataList("GetaccountsDefaultListForList?listType=reviewresult","title","id").then(result => {

        this.setState({
          reviewResult: [...result]
        });
      });

    //specsSection
    dataservice.GetDataList("GetaccountsDefaultListForList?listType=specssection","title","id").then(result => {

        if (isEdit) {
      
          let specsSectionId = this.props.document.specsSectionId;

          if (specsSectionId) {
            let specsSectionName = result.find(i => i.value === parseInt(specsSectionId));

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
    dataservice.GetDataList("GetaccountsDefaultListForList?listType=approvalstatus","title","id").then(result => {

        if (isEdit) {
      
          let approval = this.props.document.approvalStatusId;

          if (approval) {
      
            let approvalName = result.find(i => i.value === parseInt(approval));

            this.setState({
              selectedApprovalStatus: {label: approvalName.label,value: approval}
            });
          }
        }
        this.setState({
          approvales: [...result]
        });
      });

    //contractList
    dataservice.GetDataList("GetPoContractForList?projectId=" + projectId,"subject","id").then(result => {

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

  handleChangeCycles(e, field) {
    
    let original_document = { ...this.state.documentCycle };

    let updated_document = {};

    updated_document[field] = e.target.value;

    updated_document = Object.assign(original_document, updated_document);

    this.setState({
      documentCycle: updated_document
    });
  }

  handleChangeCyclesPopUp(e, field) {
    
    let original_document = { ...this.state.addCycleSubmital };

    let updated_document = {};

    updated_document[field] = e.target.value;

    updated_document = Object.assign(original_document, updated_document);

    this.setState({
      addCycleSubmital: updated_document
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

  handleChangeDateCyclesPopUp(e, field) {
    
    let original_document = { ...this.state.addCycleSubmital };

    let updated_document = {};

    updated_document[field] = e;

    updated_document = Object.assign(original_document, updated_document);

    this.setState({
      addCycleSubmital: updated_document
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

  handleChangeDropDown(event,field,isSubscrib,targetState,url,param,selectedValue,subDatasource) {

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

  handleChangeDropDownCycles( event, field, isSubscrib, targetState, url, param, selectedValue, subDatasource ) {

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

  handleChangeDropDownCyclesPopUp(event, field, isSubscrib, targetState, url, param, selectedValue, subDatasource ) {

    if (event == null) return;

    let original_document = { ...this.state.addCycleSubmital };

    let updated_document = {};

    updated_document[field] = event.value;

    updated_document = Object.assign(original_document, updated_document);

    this.setState({
      addCycleSubmital: updated_document,
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

  handleChangeDropDownItems(event, field, isSubscrib, targetState, url, param, selectedValue, subDatasource ) {

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
    
    let saveDocumentCycle = this.state.documentCycle;

    saveDocument.docDate = moment(saveDocument.docDate, "DD/MM/YYYY").format("YYYY-MM-DD[T]HH:mm:ss.SSS");
    saveDocument.forwardToDate = moment(saveDocument.forwardToDate,"DD/MM/YYYY").format("YYYY-MM-DD[T]HH:mm:ss.SSS");

    saveDocumentCycle.docDate = moment(saveDocumentCycle.docDate,"DD/MM/YYYY").format("YYYY-MM-DD[T]HH:mm:ss.SSS");
    saveDocumentCycle.approvedDate = moment(saveDocumentCycle.approvedDate,"DD/MM/YYYY").format("YYYY-MM-DD[T]HH:mm:ss.SSS");

    dataservice.addObject("EditLogSubmittal", saveDocument).then(result => {
      dataservice.addObject("EditLogSubmittalCycle", saveDocumentCycle).then(data => {
          dataservice.GetDataGrid("GetLogsSubmittalItemsBySubmittalId?submittalId=" +this.state.docId).then(data => {

              let submittalItem = {};
              submittalItem.description = "";
              submittalItem.reviewResult = "";
              submittalItem.submitalDate = moment();
              submittalItem.refDoc = "";
              submittalItem.arrange = 1;
              submittalItem.id = "";
              submittalItem.submittalId = docId;

              this.setState({
                isLoading: false,
                itemData: data,
                itemsDocumentSubmital: submittalItem,
                Stepes: this.state.Stepes + 1
              });
            }).catch(ex => toast.error(Resources["failError"][currentLanguage]));

          toast.success(Resources["operationSuccess"][currentLanguage]);
        });
    });
  }

  saveSubmittal(event) {
    if (this.props.changeStatus === false) {

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
    } else {
      this.setState({
        Stepes: this.state.Stepes + 1
      });
    }
  }

  saveAndExit(event) {
    
    if (this.state.Stepes === 1) {

      if (this.props.changeStatus) {
      
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
      } else {
        
        let submittalItem = {};
        submittalItem.description = "";
        submittalItem.reviewResult = "";
        submittalItem.submitalDate = moment();
        submittalItem.refDoc = "";
        submittalItem.arrange = 1;
        submittalItem.id = "";

        this.setState({
          itemsDocumentSubmital: submittalItem,
          Stepes: this.state.Stepes + 1
        });
      }
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
    
    return this.state.docId > 0 ? (Config.IsAllow(3317) === true ? (<ViewAttachment docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} deleteAttachments={840} />) : null ) : null;
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

          let maxArrange = _.maxBy(data, "arrange");

          let submittalItem = {};

          submittalItem.description = "";
          submittalItem.reviewResult = "";
          submittalItem.submitalDate = moment();
          submittalItem.arrange = data.length > 0 ? maxArrange.arrange + 1 : 1;
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

    saveDocument.submitalDate = moment(saveDocument.submitalDate,"DD/MM/YYYY").format("YYYY-MM-DD[T]HH:mm:ss.SSS");

    dataservice.addObject("AddLogSubmittalItems", saveDocument).then(data => {

        let setNewData = this.state.itemData;

        setNewData.push(data);

        let submittalItem = {};
        submittalItem.description = "";
        submittalItem.reviewResult = "";
        submittalItem.submitalDate = moment();
        submittalItem.refDoc = "";
        submittalItem.arrange = data.arrange + 1;

        this.setState({
          selectedReviewResult: { label: Resources.selectResult[currentLanguage],value: "0"},
          itemsDocumentSubmital: submittalItem,
          itemData: setNewData,
          isLoading: false
        });

        toast.success(Resources["operationSuccess"][currentLanguage]);
      }).catch(ex => {
        
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

    if (this.state.type === "Items") {

      if (selectedRows.length > 0) {
      
        dataservice.addObject("DeleteMultipleLogsSubmittalsItemsById", selectedRows).then(result => {

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
          }).catch(ex => {
            toast.success(Resources["operationSuccess"][currentLanguage]);
          });
      }
    } else {
      dataservice.GetDataGrid("DeleteLogsSubmittalsCyclesById?id=" + this.state.cycleId).then(result => {

          let originalData = this.state.submittalItemData;

          let getIndex = originalData.findIndex(x => x.id === this.state.cycleId);

          originalData.splice(getIndex, 1);

          this.setState({
            submittalItemData: originalData,
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
      showDeleteModal: true,
      type: "Items"
    });
  }

  closeModal() {

    let maxArrange = _.maxBy(this.state.itemData, "arrange");

    let submittalItem = {};

    submittalItem.description = "";
    submittalItem.reviewResult = "";
    submittalItem.submitalDate = moment();
    submittalItem.arrange = maxArrange.arrange != null ? maxArrange.arrange + 1 : 1;
    submittalItem.refDoc = "";
    submittalItem.submittalId = this.state.docId;

    this.setState({
      selectedReviewResult: {label: Resources.selectResult[currentLanguage],value: "0"},
      itemsDocumentSubmital: submittalItem,
      viewForEdit: false
    });
  }

  viewModelToEdit(id, type) {
  
    if (type != "checkbox") {

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

    EditData.submitalDate = moment(EditData.submitalDate, "DD/MM/YYYY").format("YYYY-MM-DD[T]HH:mm:ss.SSS");

    dataservice.addObject("EditLogSubmittalItems", EditData).then(data => {

        let originalData = this.state.itemData;

        let getIndex = originalData.findIndex(x => x.id === EditData.id);

        originalData.splice(getIndex, 1);

        originalData.push(data);

        let maxArrange = _.maxBy(this.state.itemData, "arrange");

        let submittalItem = {};
        submittalItem.description = "";
        submittalItem.reviewResult = "";
        submittalItem.submitalDate = moment();
        submittalItem.refDoc = "";
        submittalItem.arrange =maxArrange.arrange != null ? maxArrange.arrange + 1 : 1;
        //submittalItem.id = data.id;

        this.setState({
          itemsDocumentSubmital: submittalItem,
          itemData: originalData,
          viewForEdit: false,
          isLoading: false,
          selectedReviewResult: {label: Resources.selectResult[currentLanguage],value: "0"}
        });

        toast.success(Resources["operationSuccess"][currentLanguage]);
      }).catch(ex => {
        toast.error(Resources["failError"][currentLanguage]);
      });
  }

  viewConfirmDeleteCycle(id) {
    this.setState({
      cycleId: id,
      showDeleteModal: true,
      type: "Cycles"
    });
  }

  closeModalCycle() {
    this.setState({
      addNewCycle: false
    });
  }

  addCycle() {

    let maxArrange = _.maxBy(this.state.submittalItemData, "arrange");

    let submittalCycle = {};

    submittalCycle.subject ="Cycle No. R " + (this.state.documentCycle.arrange + 1);
    submittalCycle.CycleStatus = "true";
    submittalCycle.docDate = moment();
    submittalCycle.approvedDate = moment();
    submittalCycle.approvalStatusId = "";
    submittalCycle.flowContactId = "";
    submittalCycle.fromCompanyId = "";
    submittalCycle.submittalId = docId;
    submittalCycle.arrange = this.state.documentCycle.arrange != null ? maxArrange.arrange + 1 : this.state.documentCycle.arrange + 1;

    this.setState({
      selectedCycleAprrovalStatus: { label: Resources.selectResult[currentLanguage], value: "0"},
      selectedNewFromContactCycles: {label: Resources.fromContactRequired[currentLanguage],value: "0"},
      selectedNewFromCompanyCycles: {label: Resources.selectedNewFromCompanyCycles[currentLanguage],value: "0"},
      addCycleSubmital: submittalCycle,
      addNewCycle: true
    });
  }

  saveNewCycle() {

    this.setState({ isLoading: true });

    let saveCycle = this.state.addCycleSubmital;

    saveCycle.docDate = moment(saveCycle.docDate, "DD/MM/YYYY").format("YYYY-MM-DD[T]HH:mm:ss.SSS");

    dataservice.addObject("AddLogSubmittalCycles", saveCycle).then(result => {

        let originalData = this.state.submittalItemData;

        originalData.push(result);

        this.setState({
          submittalItemData: originalData,
          addNewCycle: false,
          isLoading: false
        });

        toast.success(Resources["operationSuccess"][currentLanguage]);
      }).catch(ex => {
        toast.error(Resources["failError"][currentLanguage]);
        this.setState({
          isLoading: false
        });
      });
  }

  componentWillUnmount() {
    this.setState({
        docId: 0
    });
}

  render() {
    const columnsCycles = [
      {
        Header: Resources["delete"][currentLanguage],
        accessor: "id",
        Cell: ({ row }) => {
          return (
            <div className="btn table-btn-tooltip" style={{ marginLeft: "5px" }} onClick={() => this.viewConfirmDeleteCycle(row.id)}>
              <i style={{ fontSize: "1.6em" }} className="fa fa-trash-o" />
            </div>
          );
        },
        width: 70
      },
      {
        Header: Resources["numberAbb"][currentLanguage],
        accessor: "arrange",
        sortabel: true,
        width: 80
      },
      {
        Header: Resources["subject"][currentLanguage],
        accessor: "subject",
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
        accessor: "statusName",
        width: 200,
        sortabel: true
      },
      {
        Header: Resources["CompanyName"][currentLanguage],
        accessor: "flowCompanyName",
        width: 200,
        sortabel: true
      },
      {
        Header: Resources["ContactName"][currentLanguage],
        accessor: "flowContactName",
        width: 200,
        sortabel: true
      }
    ];

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
              <input type="checkbox" className="checkbox" checked={this.state.selected[row._original.id] === true} onChange={() => this.toggleRow(row._original)}/>
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
      { title: "distributionList",
        value: (<Distribution docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId}/>),
        label: Resources["distributionList"][currentLanguage]
      },
      {
        title: "sendToWorkFlow",
        value: (<SendToWorkflow docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId}/>),
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
          <div className="submittalHead">
            <h2 className="zero">
              {Resources.drawingSets[currentLanguage]}
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
                      <Formik initialValues={ this.state.document }
                        validationSchema={validationSchema}
                        enableReinitialize={this.props.changeStatus}
                        onSubmit={values => {
                          if (this.props.changeStatus === true && this.state.docId > 0 ) {
                            this.editSubmittal();
                          } else if (this.props.changeStatus === false && this.state.docId === 0) {
                            this.saveSubmittal();
                          } else {
                            this.saveAndExit();
                          }}}>
                        {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                          <Form id="submittalForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>
                            <div className="proForm first-proform">
                              <div className="linebylineInput valid-input">
                                <label className="control-label">
                                  {Resources.subject[currentLanguage]}
                                </label>
                                <div className={ "ui input inputDev fillter-item-c " + (errors.subject && touched.subject ? "has-error" : !errors.subject && touched.subject ? "has-success" : "") }>
                                  <input name="subject" className="form-control fsadfsadsa" placeholder={Resources.subject[currentLanguage]}
                                    autoComplete="off"
                                    value={this.state.document.subject}
                                    onBlur={e => { handleBlur(e); handleChange(e); }}
                                    onChange={e => this.handleChange(e, "subject") }/>
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
                                  <input type="radio" name="status" defaultChecked={ this.state.document.status === false ? null : "checked" }
                                    value="true" onChange={e => this.handleChange(e, "status") } />
                                  <label>
                                    {Resources.oppened[currentLanguage]}
                                  </label>
                                </div>
                                <div className="ui checkbox radio radioBoxBlue">
                                  <input type="radio" name="status" defaultChecked={ this.state.document.status === false ? "checked" : null }
                                    value="false"
                                    onChange={e => this.handleChange(e, "status") } />
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
                                           onChange={e => this.handleChangeDate( e, "docDate" )} placeholder={"Select a date"} />
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
                                <div className={ "ui input inputDev fillter-item-c " + (errors.arrange && touched.arrange ? "has-error" : !errors.arrange && touched.arrange ? "has-success" : "") } >
                                  <input type="text" className="form-control" readOnly value={this.state.document.arrange} name="arrange" placeholder={ Resources.arrange[currentLanguage] }
                                         onBlur={e => { handleChange(e); handleBlur(e); }}
                                         onChange={e => this.handleChange(e, "arrange") } />
                                  {errors.arrange && touched.arrange ? (<span className="glyphicon glyphicon-remove form-control-feedback spanError" /> ) : 
                                  !errors.arrange && touched.arrange ? (<span className="glyphicon form-control-feedback glyphicon-ok" /> ) : null}
                                  {errors.arrange && touched.arrange ? (<em className="pError">{errors.arrange}</em>) : null}
                                </div>
                              </div>
                              <div className="linebylineInput valid-input">
                                <label className="control-label">
                                  {Resources.refDoc[currentLanguage]}
                                </label>
                                <div className={"ui input inputDev" + (errors.refNo && touched.refNo ? " has-error" : "ui input inputDev")}>
                                  <input type="text" className="form-control" id="refNo" value={this.state.document.refNo} name="refNo" 
                                         placeholder={ Resources.refDoc[currentLanguage] }
                                         onBlur={e => { handleChange(e); handleBlur(e); }}
                                         onChange={e => this.handleChange(e, "refNo") }/>
                                  {errors.refNo && touched.refNo ? ( <em className="pError">{errors.refNo}</em> ) : null}
                                </div>
                              </div>
                              <div className="linebylineInput valid-input mix_dropdown">
                                <label className="control-label">
                                  {Resources.actionByCompany[currentLanguage]}
                                </label>
                                <div className="supervisor__company">
                                  <div className="super_name">
                                    <Dropdown isMulti={false} data={this.state.fromContacts} selectedValue={ this.state.selectedFromContact }
                                              handleChange={event => this.handleChangeDropDown(event,"bicContactId",false,"","","","selectedFromContact")}
                                              onChange={setFieldValue} onBlur={setFieldTouched} error={errors.fromContactId} touched={touched.fromContactId} 
                                              name="fromContactId" id="fromContactId" />
                                  </div>
                                  <div className="super_company">
                                    <Dropdown data={this.state.companies} isMulti={false} selectedValue={ this.state.selectedFromCompany }
                                              handleChange={event => { this.handleChangeDropDown(event,"bicCompanyId",true,"fromContacts","GetContactsByCompanyId","companyId","selectedFromCompany","selectedFromContact");}}
                                              onChange={setFieldValue} onBlur={setFieldTouched} error={errors.fromCompanyId} touched={touched.fromCompanyId} name="fromCompanyId" id="fromCompanyId" />
                                  </div>
                                </div>
                              </div>
                              <div className="linebylineInput valid-input">
                                <Dropdown title="specsSection" data={this.state.specsSection} selectedValue={ this.state.selectedSpecsSection }
                                          handleChange={event => this.handleChangeDropDown(event,"specsSectionId",false,"","","","selectedSpecsSection")}/>
                              </div>
                              <div className="linebylineInput valid-input">
                                <Dropdown title="disciplineTitle" data={this.state.disciplines} isMulti={false} selectedValue={this.state.selectedDiscpline}
                                          handleChange={event => this.handleChangeDropDown( event, "disciplineId", false, "", "", "", "selectedDiscpline")}
                                          onChange={setFieldValue} onBlur={setFieldTouched} error={errors.disciplineId}
                                          touched={touched.disciplineId} name="disciplineId" id="disciplineId" />
                              </div> 
                              <div className="linebylineInput valid-input fullInputWidth">
                                {this.props.changeStatus === true ? (
                                  <Fragment>
                                    <label className="control-label">
                                      {Resources.contractPo[currentLanguage]}
                                    </label>
                                    <div className="ui input inputDev fillter-item-c ">
                                      <input type="text" className="form-control" readOnly value={ this.state.selectedContract.label }
                                             name="contractPo" placeholder={ Resources.contractPo[currentLanguage]}/>
                                    </div>
                                  </Fragment>
                                ) : (
                                  <Dropdown title="contractPo" isMulti={false} data={this.state.contracts} selectedValue={this.state.selectedContract}
                                            handleChange={event => this.handleChangeDropDown(event,"contractId",false,"","","", "selectedContract")}
                                            onChange={setFieldValue} onBlur={setFieldTouched} error={errors.contract} touched={touched.contract}
                                            name="contract" id="contract" index="contract" />
                                )}
                              </div>
                              <div className="linebylineInput valid-input">
                                <Dropdown title="reasonForIssue" data={this.state.reasonForIssue} selectedValue={ this.state.selectedReasonForIssue}
                                          handleChange={event => this.handleChangeDropDown( event, "reasonForIssueId", false, "", "", "", "selectedReasonForIssue")}/>
                              </div>
                              <div className="linebylineInput valid-input">
                                <label className="control-label">
                                  {Resources.fileNumber[currentLanguage]}
                                </label>
                                <div className="inputDev ui input">
                                  <input name="fileNumber" className="form-control fsadfsadsa" id="fileNumber" placeholder={ Resources.fileNumber[currentLanguage] }
                                         autoComplete="off" value={this.state.document.fileNumber} 
                                         onBlur={e => { handleBlur(e); handleChange(e); }}
                                         onChange={e => this.handleChange(e, "fileNumber") } />
                                </div>
                              </div>
                              <div className="linebylineInput valid-input">
                                <Dropdown title="area" data={this.state.areas} selectedValue={this.state.selectedArea}
                                          handleChange={event => this.handleChangeDropDown(event,"area",false,"","","","selectedArea")}/>
                              </div>
                              <div className="linebylineInput valid-input">
                                <Dropdown title="location" data={this.state.locations} selectedValue={this.state.selectedLocation} 
                                          handleChange={event =>this.handleChangeDropDown(event,"location",false,"","","","selectedLocation")}/>
                              </div>
                              <div className="linebylineInput valid-input">
                                <label className="control-label">
                                  {Resources.Building[currentLanguage]}
                                </label>
                                <div className={ "inputDev ui input" + (errors.Building && touched.Building ? " has-error" : !errors.Building && touched.Building ? " has-success": " ")}>
                                  <input name="Building" className="form-control fsadfsadsa" id="Building"
                                         placeholder={ Resources.Building[currentLanguage] }
                                         autoComplete="off" value={this.state.document.building}
                                         onBlur={e => { handleBlur(e); handleChange(e); }}
                                         onChange={e => this.handleChange(e, "building") }/>
                                  {errors.Building && touched.Building ? ( <em className="pError"> {errors.Building} </em> ) : null}
                                </div>
                              </div>
                              <div className="linebylineInput valid-input">
                                <label className="control-label">
                                  {Resources.apartmentNumber[currentLanguage]}
                                </label>
                                <div className={ "inputDev ui input" + (errors.apartmentNumber && touched.apartmentNumber ? " has-error" : !errors.apartmentNumber && touched.apartmentNumber ? " has-success" : " ") }>
                                  <input name="apartment" className="form-control fsadfsadsa" id="apartment"
                                         placeholder={ Resources.apartmentNumber[currentLanguage] }
                                         autoComplete="off" value={this.state.document.apartment} 
                                         onBlur={e => { handleBlur(e); handleChange(e); }}
                                         onChange={e => this.handleChange(e, "apartment") } />
                                  {errors.apartmentNumber && touched.apartmentNumber ? ( <em className="pError"> {errors.apartmentNumber} </em> ) : null}
                                </div>
                              </div>
                              <div className="linebylineInput valid-input">
                                <Dropdown title="submittalType" data={this.state.SubmittalTypes} selectedValue={ this.state.selectedSubmittalType }
                                          handleChange={event => this.handleChangeDropDown(event,"submittalType",false,"","","","selectedSubmittalType")}/>
                              </div>
                              <div className="linebylineInput valid-input">
                                <label className="control-label">
                                  {Resources.sharedSettings[currentLanguage]}
                                </label>
                                <div className="shareLinks">
                                  <div className="inputDev ui input">
                                    <input type="text" className="form-control" id="sharedSettings" onChange={e => this.handleChange(e, "sharedSettings")}
                                           value={this.state.document.sharedSettings} name="sharedSettings" placeholder={ Resources.sharedSettings[currentLanguage]}/>
                                  </div>
                                  <a target="_blank" href={this.state.document.sharedSettings}>
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
                                <div className={ "ui input inputDev fillter-item-c " + (errors.subjectCycle && touched.subjectCycle ? "has-error" : !errors.subjectCycle && touched.subjectCycle ? "has-success" : "") } >
                                  <input name="subjectCycle" className="form-control fsadfsadsa" placeholder={ Resources.subject[currentLanguage] } autoComplete="off" value={this.state.documentCycle.subject}
                                         onBlur={e => { handleBlur(e); handleChange(e); }}
                                         onChange={e => this.handleChangeCycles(e, "subject") } />
                                  {errors.subjectCycle && touched.subjectCycle ? 
                                  (<span className="glyphicon glyphicon-remove form-control-feedback spanError" /> ) :
                                   !errors.subjectCycle && touched.subjectCycle ? 
                                  (<span className="glyphicon form-control-feedback glyphicon-ok" /> ) : null}
                                  {errors.subjectCycle && touched.subjectCycle ? ( <em className="pError"> {errors.subjectCycle} </em> ) : null}
                                </div>
                              </div>
                              <div className="linebylineInput valid-input">
                                <label className="control-label">
                                  {Resources.status[currentLanguage]}
                                </label>
                                <div className="ui checkbox radio radioBoxBlue">
                                  <input type="radio" name="cycleStatus" defaultChecked={ this.state.documentCycle.CycleStatus === false ? null : "checked" }
                                         value="true" onChange={e => this.handleChangeCycles(e, "CycleStatus") } />
                                  <label>
                                    {Resources.oppened[currentLanguage]}
                                  </label>
                                </div>
                                <div className="ui checkbox radio radioBoxBlue">
                                  <input type="radio" name="cycleStatus" defaultChecked={ this.state.documentCycle.CycleStatus === false ? "checked" : null }
                                         value="false" onChange={e => this.handleChangeCycles(e, "CycleStatus") } />
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
                                          <ModernDatepicker date={ this.state.documentCycle.docDate } format={"DD/MM/YYYY"} showBorder
                                                            onChange={e => this.handleChangeDateCycles(e,"docDate")} placeholder={"Select a date"} />
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
                                <div className={ "ui input inputDev fillter-item-c " + (errors.arrangeCycle && touched.arrangeCycle ? "has-error" : !errors.arrangeCycle && touched.arrangeCycle ? "has-success" : "") }>
                                  <input type="text" className="form-control" readOnly value={this.state.documentCycle.arrange} name="arrangeCycle"
                                         placeholder={ Resources.arrange[currentLanguage]}
                                         onBlur={e => { handleChange(e); handleBlur(e); }}
                                         onChange={e => this.handleChangeCycles(e, "arrange") }/>
                                  {errors.arrangeCycle && touched.arrangeCycle ? 
                                  (<span className="glyphicon glyphicon-remove form-control-feedback spanError" />) : !errors.arrangeCycle &&
                                    touched.arrangeCycle ? ( <span className="glyphicon form-control-feedback glyphicon-ok" /> ) : null}
                                  {errors.arrangeCycle && touched.arrangeCycle ? ( <em className="pError"> {errors.arrangeCycle} </em> ) : null}
                                </div>
                              </div>
                              <div className="linebylineInput valid-input">
                                <Dropdown title="approvalStatus" data={this.state.approvales} selectedValue={ this.state.selectedApprovalStatus }
                                          handleChange={event => this.handleChangeDropDownCycles( event, "approvalStatusId", false, "", "", "", "selectedApprovalStatus" )}
                                          onChange={setFieldValue} onBlur={setFieldTouched} error={errors.approvalStatus} touched={touched.approvalStatus} 
                                          name="approvalStatus" id="approvalStatus" />
                              </div>
                              <div className="linebylineInput valid-input mix_dropdown">
                                <label className="control-label">
                                  {Resources.fromCompany[currentLanguage]}
                                </label>
                                <div className="supervisor__company">
                                  <div className="super_name">
                                    <Dropdown isMulti={false} data={this.state.fromContactsCycles} selectedValue={ this.state.selectedFromContactCycles }
                                              handleChange={event => this.handleChangeDropDownCycles( event, "flowContactId", false, "", "", "", "selectedFromContactCycles" )}
                                              onChange={setFieldValue} onBlur={setFieldTouched} error={errors.fromContactIdCycle} touched={touched.fromContactIdCycle}
                                              name="fromContactIdCycle" id="fromContactIdCycle" />
                                  </div>
                                  <div className="super_company">
                                    <Dropdown data={this.state.companies} isMulti={false} selectedValue={ this.state.selectedFromCompanyCycles }
                                              handleChange={event => { this.handleChangeDropDownCycles( event, "flowCompanyId",true, "fromContactsCycles", "GetContactsByCompanyId", "companyId", "selectedFromCompanyCycles", "selectedFromContact");}}
                                              onChange={setFieldValue} onBlur={setFieldTouched} error={errors.fromCompanyId} touched={touched.fromCompanyId}
                                              name="fromCompanyIdCycle" id="fromCompanyIdCycle" />
                                  </div>
                                </div>
                              </div>
                              <div className="linebylineInput valid-input">
                                <div className="inputDev ui input input-group date NormalInputDate">
                                  <div className="customDatepicker fillter-status fillter-item-c ">
                                    <div className="proForm datepickerContainer">
                                      <label className="control-label">
                                        { Resources.dateApproved[currentLanguage]}
                                      </label>
                                      <div className="linebylineInput">
                                        <div className="inputDev ui input input-group date NormalInputDate">
                                          <ModernDatepicker date={ this.state.documentCycle.approvedDate } format={"DD/MM/YYYY"} showBorder
                                                            onChange={e => this.handleChangeDateCycles(e,"approvedDate")} placeholder={"Select a date"} />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="slider-Btns">
                              {this.state.isLoading === false ? 
                              (<button className="primaryBtn-1 btn meduimBtn" type="submit">
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
                      {this.props.changeStatus ? 
                      (<Fragment>
                          <button className="primaryBtn-1 btn meduimBtn" type="button" onClick={this.addCycle.bind(this)}>
                            {Resources["addNewCycle"][currentLanguage]}
                          </button>
                          <header className="main__header">
                            <div className="main__header--div">
                              <h2 className="zero">
                                {Resources["previousCycle"][currentLanguage]}
                              </h2>
                            </div>
                          </header>
                          <ReactTable data={this.state.submittalItemData} columns={columnsCycles} defaultPageSize={10} noDataText={Resources["noData"][currentLanguage]} className="-striped -highlight"/>
                        </Fragment>
                      ) : null}
                      {this.state.itemData.length > 0 ? (
                        <Fragment>
                          <header className="main__header">
                            <div className="main__header--div">
                              <h2 className="zero">
                                {Resources["listDetails"][currentLanguage]}
                              </h2>
                            </div>
                          </header>
                          <ReactTable data={this.state.itemData} columns={columnsItems} defaultPageSize={10} noDataText={Resources["noData"][currentLanguage]} className="-striped -highlight"/>
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
                        <Formik initialValues={{...this.state.itemsDocumentSubmital}}
                                validationSchema={validationSchemaForCycle}
                                onSubmit={values => { this.addSubmittalItems(); }}>
                          {({ errors, touched, handleBlur, handleChange, values, handleSubmit, setFieldTouched, setFieldValue }) => (
                            <Form onSubmit={handleSubmit}>
                              <div className="proForm datepickerContainer">
                                <div className="linebylineInput valid-input">
                                  <label className="control-label">
                                    {Resources["description"][currentLanguage]}
                                  </label>
                                  <div className={ "ui input inputDev fillter-item-c " + (errors.description && touched.description ? "has-error" : !errors.description && touched.description ? "has-success" : "")}>
                                    <input name="description" className="form-control fsadfsadsa" id="description"
                                           placeholder={ Resources.description[currentLanguage]} autoComplete="off"
                                           value={ this.state.itemsDocumentSubmital.description}
                                           onBlur={e => { handleBlur(e); handleChange(e);}}
                                           onChange={e => this.handleChangeItems(e, "description")}/>
                                    {errors.description && touched.description ? 
                                    (<span className="glyphicon glyphicon-remove form-control-feedback spanError" />) :
                                     !errors.description && touched.description ? 
                                    (<span className="glyphicon form-control-feedback glyphicon-ok" />) : null}
                                    {errors.description && touched.description ? ( <em className="pError"> {errors.description} </em> ) : null}
                                  </div>
                                </div>
                                <div className="linebylineInput valid-input">
                                  <div className="inputDev ui input">
                                    <Dropdown isMulti={false} title="reviewResult" data={this.state.reviewResult} selectedValue={ this.state.selectedReviewResult }
                                              onChange={setFieldValue} onBlur={setFieldTouched} error={errors.reviewResult} touched={touched.reviewResult}
                                              name="reviewResult" id="reviewResult"
                                              handleChange={event => this.handleChangeDropDownItems( event, "reviewResult", false, "", "", "", "selectedReviewResult" )}/>
                                  </div>
                                </div>
                                <div className="linebylineInput valid-input">
                                  <div className="inputDev ui input input-group date NormalInputDate">
                                    <div className="customDatepicker fillter-status fillter-item-c ">
                                      <div className="proForm datepickerContainer">
                                        <label className="control-label">
                                          { Resources.submitalDate[currentLanguage]}
                                        </label>
                                        <div className="linebylineInput">
                                          <div className="inputDev ui input input-group date NormalInputDate">
                                            <ModernDatepicker date={ this.state.itemsDocumentSubmital.submitalDate} format={"DD/MM/YYYY"} showBorder 
                                                              onChange={e => this.handleChangeDateItems(e,"submitalDate")} placeholder={"Select a date"}/>
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
                                  <div className={ "ui input inputDev " + (errors.arrange && touched.arrange ? " has-error" : " ") }>
                                    <input type="text" className="form-control" id="arrange" readOnly value={ this.state.itemsDocumentSubmital.arrange }
                                           name="arrange" placeholder={ Resources.arrange[currentLanguage] }
                                           onBlur={e => { handleChange(e); handleBlur(e); }}
                                           onChange={e => this.handleChangeDateItems(e, "arrange") }/>
                                    {errors.arrange && touched.arrange ? 
                                    (<span className="glyphicon glyphicon-remove form-control-feedback spanError" /> ) :
                                     !errors.arrange && touched.arrange ? ( <span className="glyphicon form-control-feedback glyphicon-ok" /> ) : null}
                                    {errors.arrange && touched.arrange ? ( <em className="pError"> {errors.arrange} </em> ) : null}
                                  </div>
                                </div>
                                <div className="linebylineInput valid-input">
                                  <label className="control-label">
                                    {Resources.refDoc[currentLanguage]}
                                  </label>
                                  <div className={ "ui input inputDev" + (errors.refDoc && touched.refDoc ? " has-error" : "ui input inputDev") }>
                                    <input type="text" className="form-control" id="refNo" value={ this.state.itemsDocumentSubmital.refDoc }
                                           name="refDoc" placeholder={ Resources.refDoc[currentLanguage] }
                                           onBlur={e => { handleChange(e); handleBlur(e); }}
                                           onChange={e => this.handleChangeItems(e, "refDoc") }/>
                                    {errors.refDoc && touched.refDoc ? 
                                    (<span className="glyphicon glyphicon-remove form-control-feedback spanError" /> ) :
                                     !errors.refDoc && touched.refDoc ? ( <span className="glyphicon form-control-feedback glyphicon-ok" /> ) : null}
                                    {errors.refDoc && touched.refDoc ? ( <em className="pError"> {errors.refDoc} </em> ) : null}
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
                          {selectedRows.length > 0 ? (
                            <div className={ "gridSystemSelected " + (selectedRows.length > 0 ? " active" : "") } >
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
                          <ReactTable data={this.state.itemData} columns={columns} defaultPageSize={10} noDataText={Resources["noData"][currentLanguage]}
                                      className="-striped -highlight"
                                      getTrProps={(state, rowInfo, column, instance) => {
                                      return {
                                      onClick: e => {
                                        this.viewModelToEdit(
                                          rowInfo.original.id,
                                          e.target.type
                                        );
                                      }
                                    };
                                  }}/>
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
                      {this.state.docId > 0 && this.state.Stepes === 1 ? ( <UploadAttachment docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} /> ) : null}
                      {this.state.Stepes === 1 ? this.viewAttachments() : null}
                      {this.props.changeStatus === true ? ( <ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />) : null}
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
                    <OptionContainer permission={this.state.permission} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId}/>
                  </div>
                </div>
              </div>
            ) : null}
            {/* step document */}
            <div className="docstepper-levels">
              <div className="step-content-foot">
                <span onClick={this.PreviousStep.bind(this)}
                      className={ this.state.Stepes != 1 && this.state.isEdit === true ? "step-content-btn-prev " : "step-content-btn-prev disabled" }>
                  <i className="fa fa-caret-left" aria-hidden="true" />
                  Previous
                </span>
                <span onClick={this.NextStep.bind(this)}
                      className={ this.state.Stepes != 2 && this.state.isEdit === true ? "step-content-btn-prev " : "step-content-btn-prev disabled"}>
                  Next
                  <i className="fa fa-caret-right" aria-hidden="true" />
                </span>
              </div>
              <div className="workflow-sliderSteps">
                <div className="step-slider">
                  <div data-id="step1" className={ "step-slider-item " + (this.state.Stepes === 1 ? "active" : "current__step") }>
                    <div className="steps-timeline">
                      <span>1</span>
                    </div>
                    <div className="steps-info">
                      <h6>{Resources["Submittal"][currentLanguage]}</h6>
                    </div>
                  </div>
                  <div data-id="step2 " className={ "step-slider-item " + (this.state.Stepes === 2 ? "active" : this.state.SecondStepComplate ? "current__step" : "") }>
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
                              clickHandlerContinue={this.clickHandlerContinueMain.bind(this)} /> ) : null}
          {this.state.viewForEdit ? 
          (<Fragment>
              <Rodal visible={this.state.viewForEdit} onClose={this.closeModal.bind(this)} >
                <div className="ui modal largeModal ">
                  <Formik initialValues={{ ...this.state.itemsDocumentSubmital }} validationSchema={validationSchemaForCycle} 
                          onSubmit={values => { this.editItems(); }} >
                    {({ errors, touched, handleBlur, handleChange, values, handleSubmit, setFieldTouched, setFieldValue}) => (
                      <Form className="dropWrapper" onSubmit={handleSubmit}>
                        <div className=" proForm customProform">
                          <div className="fillter-status fillter-item-c">
                            <label className="control-label">
                              {Resources["description"][currentLanguage]}
                            </label>
                            <div className="inputDev ui input">
                              <input name="description" className="form-control fsadfsadsa" id="description"
                                     placeholder={Resources.description[currentLanguage]} autoComplete="off"
                                     value={ this.state.itemsDocumentSubmital.description }
                                     onBlur={e => { handleBlur(e); handleChange(e); }}
                                     onChange={e => this.handleChangeItems(e, "description") } />
                              {errors.description && touched.description ? ( <em className="pError">{errors.description}</em> ) : null}
                            </div>
                          </div>
                          <div className="fillter-status fillter-item-c">
                            <div className="inputDev ui input">
                              <Dropdown title="reviewResult" data={this.state.reviewResult} selectedValue={this.state.selectedReviewResult}
                                        handleChange={event => this.handleChangeDropDownItems(event,"reviewResult",false,"","","","selectedReviewResult")}/>
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
                                      <ModernDatepicker date={this.state.itemsDocumentSubmital.submitalDate} format={"DD/MM/YYYY"}
                                                        showBorder
                                                        onChange={e => this.handleChangeDateItems(e,"submitalDate")} placeholder={"Select a date"}/>
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
                            <div className={ "ui input inputDev " + (errors.arrange && touched.arrange ? " has-error" : " ") }>
                              <input type="text" className="form-control" id="arrange" readOnly value={this.state.itemsDocumentSubmital.arrange}
                                     name="arrange" placeholder={Resources.arrange[currentLanguage]} onBlur={e => { handleChange(e); handleBlur(e); }}
                                     onChange={e => this.handleChangeDateItems(e, "arrange")}/>
                              {errors.arrange && touched.arrange ? ( <em className="pError">{errors.arrange}</em> ) : null}
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
          {this.state.addNewCycle ? (
            <Fragment>
              <Rodal visible={this.state.addNewCycle} onClose={this.closeModalCycle.bind(this)}>
                <div className="ui modal largeModal ">
                  <Formik initialValues={{ ...this.state.addCycleSubmital }} validationSchema={validationCycleSubmital}
                          onSubmit={values => { this.saveNewCycle(); }}>
                    {({ errors, touched, handleBlur, handleChange, values, handleSubmit,setFieldTouched, setFieldValue }) => (
                      <Form className="dropWrapper" onSubmit={handleSubmit}>
                        <div className="fullWidthWrapper textLeft">
                          <header>
                            <h2 className="zero">
                              {Resources["CycleDetails"][currentLanguage]}
                            </h2>
                          </header>
                        </div>
                        <div className="fillter-status fillter-item-c">
                          <label className="control-label">
                            {Resources.subject[currentLanguage]}
                          </label>
                          <div className={ "ui input inputDev fillter-item-c " + (errors.subject && touched.subject ? "has-error" : !errors.subject && touched.subject ? "has-success" : "") }>
                            <input name="subject" className="form-control fsadfsadsa" placeholder={Resources.subject[currentLanguage]} autoComplete="off"
                                   value={this.state.addCycleSubmital.subject} onBlur={e => { handleBlur(e); handleChange(e); }}
                                   onChange={e => this.handleChangeCyclesPopUp(e, "subject") }/>
                            {errors.subject && touched.subject ? 
                            (<span className="glyphicon glyphicon-remove form-control-feedback spanError" />) :
                             !errors.subject && touched.subject ? 
                            (<span className="glyphicon form-control-feedback glyphicon-ok" /> ) : null}
                            {errors.subject && touched.subject ? ( <em className="pError">{errors.subject}</em> ) : null}
                          </div>
                        </div>
                        <div className="fillter-status fillter-item-c radioBtnDrop">
                          <label className="control-label">
                            {Resources.status[currentLanguage]}
                          </label>
                          <div className="ui checkbox radio radioBoxBlue">
                            <input type="radio" name="cycleStatus" defaultChecked={ this.state.addCycleSubmital.CycleStatus === false ? null : "checked" }
                                   value="true" onChange={e => this.handleChangeCyclesPopUp(e, "CycleStatus") }/>
                            <label>{Resources.oppened[currentLanguage]}</label>
                          </div>
                          <div className="ui checkbox radio radioBoxBlue">
                            <input type="radio" name="cycleStatus" defaultChecked={ this.state.addCycleSubmital.CycleStatus === false ? "checked" : null }
                                   value="false" onChange={e => this.handleChangeCyclesPopUp(e, "CycleStatus") }/>
                            <label>{Resources.closed[currentLanguage]}</label>
                          </div>
                        </div>
                        <div className="customDatepicker fillter-status fillter-item-c ">
                          <div className="proForm datepickerContainer">
                            <label className="control-label">
                              {Resources.cycleDate[currentLanguage]}
                            </label>
                            <div className="linebylineInput">
                              <div className="inputDev ui input input-group date NormalInputDate">
                                <ModernDatepicker date={this.state.addCycleSubmital.docDate} format={"DD/MM/YYYY"} showBorder
                                                  onChange={e => this.handleChangeDateCyclesPopUp( e, "docDate" )} placeholder={"Select a date"}/>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="fillter-status fillter-item-c">
                          <label className="control-label">
                            {Resources.arrange[currentLanguage]}
                          </label>
                          <div className={ "ui input inputDev fillter-item-c " + (errors.arrange && touched.arrange ? "has-error" : !errors.arrange && touched.arrange ? "has-success" : "") } >
                            <input type="text" className="form-control" readOnly value={this.state.addCycleSubmital.arrange}
                                   name="arrange" placeholder={Resources.arrange[currentLanguage]} onBlur={e => { handleChange(e); handleBlur(e); }}
                                   onChange={e => this.handleChangeCyclesPopUp(e, "arrange") }/>
                            {errors.arrange && touched.arrange ? 
                            (<span className="glyphicon glyphicon-remove form-control-feedback spanError" /> ) : 
                            !errors.arrange && touched.arrange ? 
                            (<span className="glyphicon form-control-feedback glyphicon-ok" />) : null}
                            {errors.arrange && touched.arrange ? (<em className="pError">{errors.arrange}</em>) : null}
                          </div>
                        </div>
                        <div className="fillter-status fillter-item-c">
                          <Dropdown title="approvalStatus" data={this.state.approvales} selectedValue={ this.state.selectedCycleAprrovalStatus }
                                    handleChange={event => this.handleChangeDropDownCyclesPopUp(event,"approvalStatusId",false,"","","","selectedCycleAprrovalStatus")}
                                    onChange={setFieldValue} onBlur={setFieldTouched} error={errors.approvalStatusId} touched={touched.approvalStatusId}
                                    name="approvalStatusId" id="approvalStatusId"/>
                        </div>
                        <div className="linebylineInput valid-input mix_dropdown">
                          <label className="control-label">
                            {Resources.fromCompany[currentLanguage]}
                          </label>
                          <div className="supervisor__company">
                            <div className="super_name">
                              <Dropdown name="fromContactId" data={this.state.fromContactsCycles} 
                                        handleChange={event => this.handleChangeDropDownCyclesPopUp(event,"flowContactId",false,"","","","selectedNewFromContactCycles")}
                                        selectedValue={ this.state.selectedNewFromContactCycles}
                                        onChange={setFieldValue} onBlur={setFieldTouched} error={errors.fromContactId} touched={touched.approvalStatusId} id="fromContactId"/>
                            </div>
                            <div className="super_company">
                              <Dropdown data={this.state.companies} isMulti={false} selectedValue={ this.state.selectedNewFromCompanyCycles }
                                        handleChange={event => { this.handleChangeDropDownCyclesPopUp(event,"flowCompanyId",true,"fromContactsCycles","GetContactsByCompanyId","companyId","selectedNewFromCompanyCycles","selectedFromContact");}}
                                        onChange={setFieldValue} onBlur={setFieldTouched} error={errors.fromCompanyId} touched={touched.fromCompanyId}
                                        name="fromCompanyIdCycle" id="fromCompanyIdCycle" />
                            </div>
                          </div>
                        </div>
                        <div className="fullWidthWrapper">
                          {this.state.isLoading === false ? (
                            <button className="primaryBtn-1 btn middle__btn" type="submit">
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

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(DrawingSetsAddEdit));
