import React, { Component, Fragment } from "react";
import { Formik, Form } from "formik";
import ReactTable from "react-table";
import * as Yup from "yup";
import dataservice from "../../Dataservice";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import UploadAttachment from "../../Componants/OptionsPanels/UploadAttachment";
import ViewAttachment from "../../Componants/OptionsPanels/ViewAttachmments";
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import Resources from "../../resources.json";
import ModernDatepicker from '../../Componants/OptionsPanels/DatePicker'
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Config from "../../Services/Config.js";
import moment from "moment";
import SkyLight from "react-skylight";
import * as communicationActions from "../../store/actions/communication";
import DocumentActions from '../../Componants/OptionsPanels/DocumentActions'
import { toast } from "react-toastify";
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument'
import AddDocAttachment from "../../Componants/publicComponants/AddDocAttachment";
import Steps from "../../Componants/publicComponants/Steps";
import CompanyDropdown from '../../Componants/publicComponants/CompanyDropdown';
import ContactDropdown from '../../Componants/publicComponants/ContactDropdown';

const find = require("lodash/find");
const maxBy = require("lodash/maxBy");

let selectedRows = [];

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const validationSchema = Yup.object().shape({
  subject: Yup.string().required(Resources["subjectRequired"][currentLanguage]).max(450, Resources["maxLength"][currentLanguage]),
  arrange: Yup.number().required(Resources["arrange"][currentLanguage]),
  refNo: Yup.string().max(100, Resources["maxLength"][currentLanguage]),
  bicContactId: Yup.string().required(Resources["actionByContactRequired"][currentLanguage]).nullable(true),
  disciplineId: Yup.string().required(Resources["disciplineRequired"][currentLanguage]).nullable(true),
  contractId: Yup.string().required(Resources["contractPoSelection"][currentLanguage]),
});

const validationCycleSubmital = Yup.object().shape({
  subject: Yup.string().required(Resources["subjectRequired"][currentLanguage]).max(450, Resources["maxLength"][currentLanguage]),
  arrange: Yup.number().required(Resources["arrange"][currentLanguage]),
  flowContactId: Yup.string().required(Resources["toContactRequired"][currentLanguage]).nullable(true),
  approvalStatusId: Yup.string().required(Resources["approvalStatusSelection"][currentLanguage]).nullable(true)
});

const validationSchemaForItem = Yup.object().shape({
  description: Yup.string().required(Resources["description"][currentLanguage]),
  arrange: Yup.number().required(Resources["onlyNumbers"][currentLanguage]),
  refDoc: Yup.string().max(100, (Resources["maxLength"][currentLanguage] + " 100")),
  reviewResult: Yup.string().required(Resources["selectResult"][currentLanguage]).nullable(true)
});

const validationSchemaForItemPopUp = Yup.object().shape({
  description: Yup.string().required(Resources["description"][currentLanguage]),
  arrange: Yup.number().required(Resources["onlyNumbers"][currentLanguage]),
  refDoc: Yup.string().max(100, (Resources["maxLength"][currentLanguage] + " 100")),
  reviewResult: Yup.string().required(Resources["selectResult"][currentLanguage]).nullable(true)
});

const validationSchemaForCyclePopUp = Yup.object().shape({
  subject: Yup.string().required(Resources["description"][currentLanguage]),
  arrange: Yup.number().required(Resources["onlyNumbers"][currentLanguage]),
  approvalStatusId: Yup.string().required(Resources["selectResult"][currentLanguage]).nullable(true)
});

let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let docAlertId = 0;

let perviousRoute = '';
let arrange = 0;
var steps_defination = []
class SubmittalAddEdit extends Component {
  constructor(props) {
    super(props);

    const query = new URLSearchParams(this.props.location.search);

    let obj = Config.extractDataFromParamas(query);

    if (Object.entries(obj).length === 0) {
      this.props.history.goBack();
    } else {
      docId = obj.docId;
      projectId = obj.projectId;
      projectName = obj.projectName;
      isApproveMode = obj.isApproveMode;
      docApprovalId = obj.docApprovalId;
      docAlertId = obj.docAlertId;
      perviousRoute = obj.perviousRoute
      arrange = obj.arrange;

    }

    let index = 0;

    this.state = {
      isCompany: Config.getPayload().uty === "company" ? true : false,
      submittalCycleId: 0,
      currentStep: 0,
      cycleId: "",
      showDeleteModal: false,
      isLoading: false,
      isEdit: false,
      showModal: false,
      isViewMode: false,
      isApproveMode: isApproveMode,
      perviousRoute: perviousRoute,
      isView: false,
      docId: docId,
      docTypeId: 42,
      projectId: projectId,
      docApprovalId: docApprovalId,
      docAlertId: docAlertId,
      docAlertId: 0,
      arrange: arrange,
      SecondStepComplate: false,
      ThirdStepComplate: false,
      FourthStepComplate: false,
      FivethStepComplate: false,
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
        { name: "deleteAttachments", code: 884 },
        { name: "previousVersions", code: 8080800 }
      ],
      SubmittalTypes: [],
      selectedFromCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
      selectedFromContact: { label: Resources.fromContactRequired[currentLanguage], value: "0" },
      selectedFromCompanyCycles: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
      selectedFromContactCycles: { label: Resources.toContactRequired[currentLanguage], value: "0" },
      selectedSpecsSection: { label: Resources.specsSectionSelection[currentLanguage], value: "0" },
      selectedDiscpline: { label: Resources.disciplineRequired[currentLanguage], value: "0" },
      selectedContract: { label: Resources.contractPoSelection[currentLanguage], value: "0" },
      selectedReasonForIssue: { label: Resources.SelectReasonForIssueId[currentLanguage], value: "0" },
      selectedArea: { label: Resources.area[currentLanguage], value: "0" },
      selectedLocation: { label: Resources.locationRequired[currentLanguage], value: "0" },
      selectedSubmittalType: { label: Resources.submittalType[currentLanguage], value: "0" },
      selectedApprovalStatus: { label: Resources.approvalStatusSelection[currentLanguage], value: "0" },
      selectedReviewResult: { label: Resources.selectResult[currentLanguage], value: "0" },
      selectedCycleAprrovalStatus: { label: Resources.selectResult[currentLanguage], value: "0" },
      selectedNewFromContactCycles: { label: Resources.fromContactRequired[currentLanguage], value: "0" },
      selectedNewFromCompanyCycles: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
      type: "",
      viewCycle: false
    };

    if ((!Config.IsAllow(220)) && (!Config.IsAllow(221)) && !Config.IsAllow(223)) {
      toast.warn(Resources["missingPermissions"][currentLanguage]);
      this.props.history.push("/submittal/" + this.state.projectId);
    }
    steps_defination = [
      {
        name: "Submittal",
        callBackFn: null
      },
      {
        name: "cyclesCount",
        callBackFn: () => this.getMaxArrange()
      },
      {
        name: "items",
        callBackFn: () => this.getLogsSubmittalItems()
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

    let submittalDocumentCycles = {
      //field
      id: 0,
      submittalId: "",
      docDate: moment(),
      approvedDate: moment(),
      CycleStatus: "true",
      flowCompanyName: "",
      flowContactName: "",
      status: "true",
      subject: "Cycle No. R " + 0,
      approvalStatusId: "",
      arrange: "0",
      flowCompanyId: "",
      flowContactId: "",
      fromContactId: "",
      approvalAction: "1"
    };

    if (this.state.docId > 0) {

      let url = "GetLogsSubmittalForEdit?id=" + this.state.docId;
      this.props.actions.documentForEdit(url, this.state.docTypeId, 'Submittal');

      dataservice.GetDataGrid("GetLogsSubmittalsCyclessBySubmittalId?submittalId=" + this.state.docId).then(res => {
        let data = { items: res }
        this.setState({
          submittalItemData: res
        });
        this.props.actions.ExportingData(data);

      });
      dataservice.GetDataGrid("GetLogsSubmittalItemsBySubmittalId?submittalId=" + this.state.docId).then(data => {
        this.setState({
          itemData: data
        });

        this.props.actions.SetCyclesExportingData({
          items: data,
          cyclesFields: ["arrange", "description", "submitalDate", "refDoc", "reviewResultName"],
          cyclesfriendlyNames: ["numberAbb", "subject", "submitalDate", "refDoc", "reviewResult"]
        });
      }).catch(ex => toast.error(Resources["failError"][currentLanguage]));

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
        submittalTypeId: "",
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
        subjectCycle: ""
      };

      this.setState({
        document: submittalDocument,
        documentCycle: submittalDocumentCycles,
        addCycleSubmital: submittalDocumentCycles
      });

      this.fillDropDowns(false);
      this.props.actions.documentForAdding();
    }
    this.checkDocumentIsView();
  }

  static getDerivedStateFromProps(nextProps, state) {
    if (nextProps.document.id != state.document.id && nextProps.changeStatus === true) {
      let doc = nextProps.document
      doc.docDate = doc.docDate !== null ? moment(doc.docDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
      doc.forwardToDate !== null ? moment(doc.forwardToDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
      return {
        document: doc,
        hasWorkflow: nextProps.hasWorkflow
      };
    }
    return null
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.document.id !== this.props.document.id && this.props.changeStatus === true) {
      if (prevState.document.id !== this.props.document.id) {

        let submittalDocumentCycles = {
          id: 0,
          submittalId: "",
          docDate: moment(),
          approvedDate: moment(),
          CycleStatus: "true",
          flowCompanyName: "",
          flowContactName: "",
          status: "true",
          subject: "Cycle No. R " + 0,
          approvalStatusId: "",
          arrange: "0",
          flowCompanyId: "",
          flowContactId: "",
          fromContactId: "",
          approvalAction: "1"
        };

        dataservice.GetRowById("GetLogSubmittalCyclesForEdit?id=" + this.props.document.id).then(result => {
          if (result) {
            let cycle = result

            cycle.docDate = result.docDate != null ? moment(result.docDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
            cycle.approvedDate = result.approvedDate != null ? moment(result.approvedDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
            cycle.arrange = result.arrange;
            
            this.fillCycleDropDown(true);

            this.setState({
              documentCycle: cycle,
              addCycleSubmital: cycle,
              selectedFromContactCycles: { label: cycle.flowContactName, value: cycle.flowContactId }
            });
          } else {
            this.setState({
              documentCycle: submittalDocumentCycles,
              addCycleSubmital: submittalDocumentCycles
            });
          }

        });
      }
      this.fillDropDowns(this.props.document.id > 0 ? true : false);

      this.checkDocumentIsView();
    }

    if (this.props.hasWorkflow !== prevProps.hasWorkflow || this.props.changeStatus !== prevProps.changeStatus) {
      this.checkDocumentIsView();
    }

  }

  checkDocumentIsView() {
    if (this.state.isCompany == true) {
      this.setState({ isViewMode: false });
    } else {
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

  fillCycleDropDown(isEdit) {

    //approvalStatus
    dataservice.GetDataListCached("GetaccountsDefaultListForList?listType=approvalstatus", "title", "id", 'defaultLists', "approvalstatus", "listType").then(result => {

      if (isEdit) {

        let approval = this.state.documentCycle.approvalStatusId;

        if (approval) {

          let approvalName = result.find(i => i.value === parseInt(approval));

          if (approvalName) {
            this.setState({
              selectedApprovalStatus: { label: approvalName.label, value: approval }
            });
          }
        }
      }
      this.setState({
        approvales: [...result]
      });
    });

    dataservice.GetDataListCached("GetProjectProjectsCompaniesForList?projectId=" + projectId, "companyName", "companyId", 'companies', this.state.projectId, "projectId").then(result => {

      if (isEdit) {
        let flowCompanyId = this.state.documentCycle.flowCompanyId;

        if (flowCompanyId) {

          this.setState({
            selectedFromCompanyCycles: { label: this.state.documentCycle.flowCompanyName, value: flowCompanyId }
          });

          this.fillSubDropDownInEdit("GetContactsByCompanyId", "companyId", flowCompanyId, "flowContactId", "selectedFromContactCycles", "fromContactsCycles");
        }
      }
      this.setState({
        companies: [...result]
      });
    });
  }

  fillDropDowns(isEdit) {
    //from Companies
    dataservice.GetDataListCached("GetProjectProjectsCompaniesForList?projectId=" + projectId, "companyName", "companyId", 'companies', this.state.projectId, "projectId").then(result => {
      if (isEdit) {

        let companyId = this.props.document.bicCompanyId;

        if (companyId) {

          this.setState({
            selectedFromCompany: { label: this.props.document.bicCompanyName, value: companyId }
          });

          this.fillSubDropDownInEdit("GetContactsByCompanyId", "companyId", companyId, "bicContactId", "selectedFromContact", "fromContacts");
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

          if (disciplineName) {
            this.setState({
              selectedDiscpline: { label: disciplineName.label, value: disciplineId }
            });
          } else {
            this.setState({
              selectedDiscpline: { label: Resources.disciplineRequired[currentLanguage], value: "0" }
            });
          }
        }
      }
      this.setState({
        disciplines: [...result]
      });
    });

    //discplines
    dataservice.GetDataListCached("GetaccountsDefaultListForList?listType=SubmittalTypes", "title", "id", 'defaultLists', "SubmittalTypes", "listType").then(result => {

      if (isEdit) {

        let submittalTypeId = this.props.document.submittalTypeId;

        if (submittalTypeId) {

          let submittalType = result.find(i => i.value === submittalTypeId);

          if (submittalType) {
            this.setState({
              selectedSubmittalType: { label: submittalType.label, value: submittalTypeId }
            });
          } else {
            this.setState({
              selectedSubmittalType: { label: Resources.disciplineRequired[currentLanguage], value: "0" }
            });
          }
        }
      }
      this.setState({
        SubmittalTypes: [...result]
      });
    });

    //location
    dataservice.GetDataListCached("GetaccountsDefaultListForList?listType=location", "title", "id", 'defaultLists', "location", "listType").then(result => {

      if (isEdit) {

        let locationId = this.props.document.location;

        if (locationId) {

          let locationName = result.find(i => i.label === locationId);

          if (locationName) {

            this.setState({
              selectedLocation: { label: locationName.label, value: locationId }
            });

          }
        }
      }

      this.setState({
        locations: [...result]
      });
    });

    //area
    dataservice.GetDataListCached("GetaccountsDefaultListForList?listType=area", "title", "id", 'defaultLists', "area", "listType").then(result => {

      if (isEdit) {

        let areaId = this.props.document.area;

        let areaIdName = {};

        if (areaId) {

          areaIdName = result.find(i => i.label === areaId);

          if (areaIdName) {

            this.setState({
              selectedArea: { label: areaIdName.label, value: areaId }
            });

          }
        }
      }
      this.setState({
        areas: [...result]
      });
    });

    //reasonForIssue
    dataservice.GetDataListCached("GetaccountsDefaultListForList?listType=reasonForIssue", "title", "id", 'defaultLists', "reasonForIssue", "listType").then(result => {

      if (isEdit) {

        let reasonFor = this.props.document.reasonForIssueId;

        let reasonForName = {};

        if (reasonFor) {

          reasonForName = result.find(i => i.value === parseInt(reasonFor));

          if (reasonForName) {

            this.setState({
              selectedReasonForIssue: { label: reasonForName.label, value: this.props.document.reasonForIssueId }
            });
          }
        }
      }
      this.setState({
        reasonForIssue: [...result]
      });
    });

    //reviewResult
    dataservice.GetDataListCached("GetaccountsDefaultListForList?listType=reviewresult", "title", "id", 'defaultLists', "reviewResult", "listType").then(result => {

      this.setState({
        reviewResult: [...result]
      });
    });

    //specsSection
    dataservice.GetDataListCached("GetaccountsDefaultListForList?listType=specssection", "title", "id", 'defaultLists', "specssection", "listType").then(result => {

      if (isEdit) {

        let specsSectionId = this.props.document.specsSectionId;

        if (specsSectionId) {

          let specsSectionName = result.find(i => i.value === parseInt(specsSectionId));

          if (specsSectionName) {
            this.setState({
              selectedSpecsSection: { label: specsSectionName.label, value: specsSectionId }
            });
          }
        }
      }

      this.setState({
        specsSection: [...result]
      });
    });

    //contractList
    dataservice.GetDataList("GetPoContractForList?projectId=" + projectId, "subject", "id").then(result => {

      if (isEdit) {

        let contactId = this.props.document.contractId;

        let contact = {};

        if (contactId) {

          let contact = result.find(i => i.value === contactId);

          if (contact) {
            this.setState({
              selectedContract: { ...contact }
            });
          }
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
  handleBlur(e) {
    if (e.target.value && e.target.value.trim()) // if the input is contains only spaces or null 
    {
      if (Config.getPublicConfiguartion().refCodeValidation == true) {
        dataservice.checkSubmittalRefCode(this.state.projectId, e.target.value).then(result => {
          if (result == true) {
            toast.error("sorry this code is not valid please try again !");
            this.setState({ document: { ...document, refNo: "" } })
          }
        }).catch(ex => toast.error(Resources["failError"][currentLanguage]));
      }
    }
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

  handleChangeDropDownCycles(event, field, isSubscrib, targetState, url, param, selectedValue, subDatasource) {

    if (event == null) return;

    let original_document = { ...this.state.documentCycle };

    let updated_document = {};

    updated_document[field] = event.value;

    updated_document = Object.assign(original_document, updated_document);

    this.setState({
      documentCycle: updated_document,
      [selectedValue]: event
    });

    // if (field == "flowCompanyId") {
    //   let url = "GetNextArrangeMainDoc?projectId=" + this.state.projectId + "&docType=" + this.state.docTypeId + "&companyId=" + event.value + "&contactId=" + null;

    //   dataservice.GetNextArrangeMainDocument(url).then(res => {

    //     updated_document.arrange = res;

    //     updated_document = Object.assign(original_document, updated_document);

    //     this.setState({
    //       documentCycle: updated_document
    //     });
    //   });
    // }


    if (isSubscrib) {

      let action = url + "?" + param + "=" + event.value;

      dataservice.GetDataList(action, "contactName", "id").then(result => {
        this.setState({
          [targetState]: result
        });
      });
    }
  }

  handleChangeDropDownCyclesPopUp(event, field, isSubscrib, targetState, url, param, selectedValue, subDatasource) {

    if (event == null) return;

    let original_document = { ...this.state.addCycleSubmital };

    let updated_document = {};

    updated_document[field] = event.value;

    updated_document = Object.assign(original_document, updated_document);

    this.setState({
      addCycleSubmital: updated_document,
      [selectedValue]: event
    });

    if (field == "flowCompanyId") {
      let url = "GetNextArrangeMainDoc?projectId=" + this.state.projectId + "&docType=" + this.state.docTypeId + "&companyId=" + event.value + "&contactId=" + null;

      dataservice.GetNextArrangeMainDocument(url).then(res => {

        updated_document.arrange = res;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
          addCycleSubmital: updated_document
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
      isLoading: true,
      CurrentStep: 1
    });

    let saveDocument = this.state.document;
    saveDocument.docDate = moment(saveDocument.docDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");
    saveDocument.forwardToDate = moment(saveDocument.forwardToDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");
    saveDocument.area = this.state.selectedArea.value === "0" ? "" : this.state.selectedArea.label;
    saveDocument.location = this.state.selectedLocation.value === "0" ? "" : this.state.selectedLocation.label;

    this.changeCurrentStep(1);

    dataservice.addObject("EditLogSubmittal", saveDocument).then(result => {

      this.setState({
        isLoading: false
      });

      toast.success(Resources["operationSuccess"][currentLanguage]);
    }).catch(ex => toast.error(Resources["failError"][currentLanguage]));
  }

  editSubmittalCycle() {
    let saveDocumentCycle = this.state.documentCycle;
    saveDocumentCycle.docDate = moment(saveDocumentCycle.docDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");
    saveDocumentCycle.approvedDate = moment(saveDocumentCycle.approvedDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss");

    saveDocumentCycle.submittalId = this.state.docId;
    this.setState({ isLoading: true });
    dataservice.addObject("EditLogSubmittalCycle", saveDocumentCycle).then(data => {
      dataservice.GetDataGrid("GetLogsSubmittalItemsBySubmittalId?submittalId=" + this.state.docId).then(data => {

        let submittalItem = {};
        submittalItem.description = "";
        submittalItem.reviewResult = "";
        submittalItem.submitalDate = moment();
        submittalItem.refDoc = "";
        submittalItem.arrange = 1;
        submittalItem.submittalId = docId;

        this.setState({
          isLoading: false,
          itemData: data,
          CurrentStep: 2,
          itemsDocumentSubmital: submittalItem,
        });
      }).catch(ex => toast.error(Resources["failError"][currentLanguage]));

      toast.success(Resources["operationSuccess"][currentLanguage]);
    }).catch(ex => toast.error(Resources["failError"][currentLanguage]));
  }

  addSubmittalCycle() {

    this.setState({
      isLoading: true,
      CurrentStep: 2
    });

    let saveDocumentCycle = this.state.documentCycle;

    saveDocumentCycle.docDate = moment(saveDocumentCycle.docDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");
    saveDocumentCycle.approvedDate = moment(saveDocumentCycle.approvedDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");
    saveDocumentCycle.submittalId = this.state.docId;
    saveDocumentCycle.id = this.state.submittalCycleId;

    dataservice.addObject("AddLogSubmittalCycles", saveDocumentCycle).then(data => {

      let submittalItem = {};
      submittalItem.description = "";
      submittalItem.reviewResult = "";
      submittalItem.submitalDate = moment();
      submittalItem.refDoc = "";
      submittalItem.arrange = 1;
      submittalItem.submittalId = docId;

      this.setState({
        isLoading: false,
        itemsDocumentSubmital: submittalItem
      });

      this.changeCurrentStep(2);

      toast.success(Resources["operationSuccess"][currentLanguage]);

    }).catch(ex => {
      this.setState({
        isLoading: false
      });
      toast.error(Resources["failError"][currentLanguage]);
    });
  }

  saveSubmittal(event) {
    if (this.props.changeStatus === false) {

      this.setState({
        isLoading: true
      });

      let saveDocument = { ...this.state.document };
      saveDocument.area = this.state.selectedArea.value === "0" ? "" : this.state.selectedArea.label;
      saveDocument.location = this.state.selectedLocation.value === "0" ? "" : this.state.selectedLocation.label;
      saveDocument.docDate = moment(saveDocument.docDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");
      saveDocument.forwardToDate = moment(saveDocument.forwardToDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");

      dataservice.addObject("AddLogsSubmittal", saveDocument).then(result => {
        toast.success(Resources["operationSuccess"][currentLanguage]);
        this.fillCycleDropDown(false);

        this.setState({
          docId: result.id,
          submittalCycleId: result.submittalCycleId,
          isLoading: false
        });

      }).catch(ex => {
        this.setState({
          isLoading: false
        });

        toast.error(Resources["failError"][currentLanguage]);
      });
    }
  }

  saveAndExit(event) {

    if (this.state.currentStep === 0) {

      if (this.props.changeStatus) {
        this.changeCurrentStep(1);
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
            itemsDocumentSubmital: submittalItem
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
        this.changeCurrentStep(1);
        this.setState({
          itemsDocumentSubmital: submittalItem,
        });
      }
    }
  }

  viewAttachments() {
    return this.state.docId > 0 ? (Config.IsAllow(3302) === true ? (<ViewAttachment isApproveMode={this.state.isViewMode} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} deleteAttachments={884} />) : null) : null;
  }

  getLogsSubmittalItems = () => {
    dataservice.GetDataGrid("GetLogsSubmittalItemsBySubmittalId?submittalId=" + this.state.docId).then(data => {
      let maxArrange = maxBy(data, "arrange");
      let submittalItem = {};
      submittalItem.description = "";
      submittalItem.reviewResult = "";
      submittalItem.submitalDate = moment();
      submittalItem.arrange = data.length > 0 ? maxArrange.arrange + 1 : 1;
      submittalItem.refDoc = "";
      submittalItem.submittalId = this.state.docId;
      this.setState({
        itemData: data,
        itemsDocumentSubmital: submittalItem
      });
    }).catch(ex => toast.error(Resources["failError"][currentLanguage]));
  }

  addSubmittalItems() {

    this.setState({
      isLoading: true
    });

    let saveDocument = { ...this.state.itemsDocumentSubmital };

    saveDocument.submitalDate = moment(saveDocument.submitalDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");
    saveDocument.submittalId = this.state.docId;

    dataservice.addObject("AddLogSubmittalItems", saveDocument).then(data => {

      let setNewData = this.state.itemData;

      setNewData.push(data);

      let submittalItem = {};
      submittalItem.description = "";
      submittalItem.reviewResult = "";
      submittalItem.submitalDate = moment();
      submittalItem.refDoc = "";
      submittalItem.arrange = data != null ? (data.arrange + 1) : (saveDocument.arrange + 1);

      this.setState({
        selectedReviewResult: { label: Resources.selectResult[currentLanguage], value: "0" },
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

    if (this.state.isViewMode === false) {

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

        let listIds = selectedRows.map(rows => rows.id);

        dataservice.addObject("DeleteMultipleLogsSubmittalsItemsById", listIds).then(result => {

          let originalData = this.state.itemData;

          selectedRows.forEach(item => {
            let getIndex = originalData.findIndex(x => x.id === item.id);

            originalData.splice(getIndex, 1);
          });

          selectedRows = [];

          this.setState({
            itemData: originalData,
            showDeleteModal: false
          });

          toast.success(Resources["operationSuccess"][currentLanguage]);

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

  _executeBeforeModalClose = () => {

    let maxArrange = maxBy(this.state.itemData, "arrange");

    let submittalItem = {};

    submittalItem.description = "";
    submittalItem.reviewResult = "";
    submittalItem.submitalDate = moment();
    submittalItem.arrange = maxArrange.arrange != null ? maxArrange.arrange + 1 : 1;
    submittalItem.refDoc = "";
    submittalItem.submittalId = this.state.docId;

    this.setState({
      selectedReviewResult: { label: Resources.selectResult[currentLanguage], value: "0" },
      itemsDocumentSubmital: submittalItem,
      viewForEdit: false
    });
  }

  viewModelToEdit(id, type) {

    if (this.state.isViewMode === false) {

      if (type != "checkbox") {

        if (id) {

          dataservice.GetDataGrid("GetLogSubmittalItemsForEdit?id=" + id).then(data => {

            let submittalItem = {};

            submittalItem.description = data.description;
            submittalItem.reviewResult = data.reviewResult;
            submittalItem.submitalDate = moment(data.submitalDate).format('YYYY-MM-DD');
            submittalItem.arrange = data.arrange;
            submittalItem.refDoc = data.refDoc;
            submittalItem.id = data.id;

            this.setState({
              selectedReviewResult: { label: data.reviewResultName, value: data.reviewResult },
              itemsDocumentSubmital: submittalItem,
              viewForEdit: true
            });
            this.simpleDialog1.show();
          }).catch(ex => {
            toast.error(Resources["failError"][currentLanguage]);
          });
        }
      }
    }
  }

  editItems() {

    this.setState({
      isLoading: true
    });

    let EditData = this.state.itemsDocumentSubmital;

    EditData.submitalDate = moment(EditData.submitalDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");

    dataservice.addObject("EditLogSubmittalItems", EditData).then(data => {

      let originalData = this.state.itemData;

      let getIndex = originalData.findIndex(x => x.id === EditData.id);

      originalData.splice(getIndex, 1);

      originalData.push(data);

      let maxArrange = maxBy(this.state.itemData, "arrange");

      let submittalItem = {};
      submittalItem.description = "";
      submittalItem.reviewResult = "";
      submittalItem.submitalDate = moment();
      submittalItem.refDoc = "";
      submittalItem.arrange = maxArrange.arrange != null ? maxArrange.arrange + 1 : 1;

      this.setState({
        itemsDocumentSubmital: submittalItem,
        itemData: originalData,
        viewForEdit: false,
        isLoading: false,
        selectedReviewResult: { label: Resources.selectResult[currentLanguage], value: "0" }
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

    let maxArrange = (maxBy(this.state.submittalItemData, "arrange"))["arrange"] || 0;

    let arrangeCycle = this.state.documentCycle.arrange;

    let submittalCycle = {};

    submittalCycle.subject = "Cycle No. R " + (this.state.documentCycle.arrange + 1);
    submittalCycle.CycleStatus = "true";
    submittalCycle.docDate = moment();
    submittalCycle.approvedDate = moment();
    submittalCycle.approvalStatusId = "";
    submittalCycle.flowContactId = "";
    submittalCycle.fromCompanyId = "";
    submittalCycle.submittalId = docId;
    submittalCycle.arrange = arrangeCycle ? arrangeCycle + 1 : maxArrange + 1;
    submittalCycle.id = 0;

    this.setState({
      selectedCycleAprrovalStatus: { label: Resources.selectResult[currentLanguage], value: "0" },
      selectedNewFromContactCycles: { label: Resources.fromContactRequired[currentLanguage], value: "0" },
      selectedNewFromCompanyCycles: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
      addCycleSubmital: submittalCycle,
      addNewCycle: true,
      viewCycle: true
    });
    this.simpleDialog2.show();
  }

  saveNewCycle() {

    this.setState({ isLoading: true });

    let saveCycle = this.state.addCycleSubmital;

    let arrangeCycle = this.state.documentCycle.arrange;

    saveCycle.arrange = arrangeCycle ? arrangeCycle + 1 : saveCycle + 1

    saveCycle.docDate = moment(saveCycle.docDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");

    dataservice.addObject("AddLogSubmittalCycles", saveCycle).then(result => {

      let originalData = this.state.submittalItemData;

      originalData.push(result);

      this.setState({
        submittalItemData: originalData,
        addNewCycle: false,
        isLoading: false,
        viewCycle: false
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
    this.props.actions.clearCashDocument();
    this.setState({
      docId: 0
    });
  }

  changeCurrentStep = stepNo => {

    this.setState({ currentStep: stepNo });
  };

  getMaxArrange = () => {
    if (docId !== 0) {
      let maxArrange = maxBy(this.state.itemData, "arrange");

      let submittalItem = {};
      submittalItem.description = "";
      submittalItem.reviewResult = "";
      submittalItem.submitalDate = moment();
      submittalItem.refDoc = "";
      submittalItem.arrange = maxArrange != undefined ? (maxArrange.arrange != null ? maxArrange.arrange + 1 : 1) : 1;
      this.setState({
        itemsDocumentSubmital: submittalItem
      })
    }
  }

  showOptionPanel = () => {
    this.props.actions.showOptionPanel(true);
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
      },
      {
        Header: Resources["approvalStatus"][currentLanguage],
        accessor: "approvalStatusName",
        width: 200,
        sortabel: true
      },
      {
        Header: Resources["approvedDate"][currentLanguage],
        accessor: "docCloseDate",
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
              <input type="checkbox" className="checkbox" checked={this.state.selected[row._original.id] === true} onChange={() => this.toggleRow(row._original)} />
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
        width: 350,
        sortabel: true
      },
      {
        Header: Resources["reviewResult"][currentLanguage],
        accessor: "reviewResultName",
        width: 150,
        sortabel: true
      },
      {
        Header: Resources["refDoc"][currentLanguage],
        accessor: "refDoc",
        width: 150,
        sortabel: true
      },
      {
        Header: Resources["submitalDate"][currentLanguage],
        accessor: "submitalDate",
        width: 150,
        sortabel: true,
        Cell: row => (
          <span>
            <span>{moment(row.value).format("DD/MM/YYYY")}</span>
          </span>
        )
      }
    ];

    return (
      <div className="mainContainer">
        <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document one_step one__tab readOnly_inputs" : "documents-stepper noTabs__document one_step one__tab noTabs__document"}>
          <HeaderDocument projectName={projectName} isViewMode={this.state.isViewMode} perviousRoute={this.state.perviousRoute} docTitle={Resources.Submittal[currentLanguage]} moduleTitle={Resources['technicalOffice'][currentLanguage]} />
          <div className="doc-container">
            <div className="step-content">
              <div id="step1" className="step-content-body">
                <div className="subiTabsContent">
                  {this.state.currentStep === 0 ?
                    <div className="document-fields">
                      <Formik initialValues={this.state.document}
                        validationSchema={validationSchema}
                        enableReinitialize={true}
                        onSubmit={values => {
                          if (this.props.showModal) { return; }
                          if (this.props.changeStatus === true && this.state.docId > 0) {
                            this.editSubmittal();
                          } else if (this.props.changeStatus === false && this.state.docId === 0) {

                            this.saveSubmittal();
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
                                  <textarea name="subject" className="form-control fsadfsadsa" placeholder={Resources.subject[currentLanguage]}
                                    autoComplete="off"
                                    value={this.state.document.subject || ''}
                                    onBlur={e => { handleBlur(e); handleChange(e); }}
                                    onChange={e => this.handleChange(e, "subject")} >
                                    {errors.subject && touched.subject ? (<em className="pError">{errors.subject}</em>) : null}

                                  </textarea>

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
                                    handleChange={e => this.handleChangeDate(e, "docDate")} />
                                </div>
                              </div>
                              <div className="linebylineInput">
                                <div className="inputDev ui input input-group date NormalInputDate">
                                  <ModernDatepicker startDate={this.state.document.forwardToDate} title="forwardToDate"
                                    handleChange={e => this.handleChangeDate(e, "forwardToDate")} />
                                </div>
                              </div>
                              <div className="linebylineInput valid-input">
                                <label className="control-label">
                                  {Resources.arrange[currentLanguage]}
                                </label>
                                <div className={"ui input inputDev fillter-item-c " + (errors.arrange && touched.arrange ? "has-error" : !errors.arrange && touched.arrange ? "has-success" : "")} >
                                  <input type="text" className="form-control" readOnly value={this.state.document.arrange || ''} name="arrange" placeholder={Resources.arrange[currentLanguage]}
                                    onBlur={e => { handleChange(e); handleBlur(e); }}
                                    onChange={e => this.handleChange(e, "arrange")} />
                                  {errors.arrange && touched.arrange ? (<em className="pError">{errors.arrange}</em>) : null}
                                </div>
                              </div>
                              <div className="linebylineInput fullInputWidth">
                                <label className="control-label">
                                  {Resources.refDoc[currentLanguage]}
                                </label>
                                <div className={"ui input inputDev" + (errors.refNo && touched.refNo ? " has-error" : "ui input inputDev")}>
                                  <input type="text" className="form-control" id="refNo" value={this.state.document.refNo || ''} name="refNo"
                                    placeholder={Resources.refDoc[currentLanguage]}
                                    onBlur={e => { handleChange(e); this.handleBlur(e); }}
                                    onChange={e => this.handleChange(e, "refNo")} />
                                  {errors.refNo && touched.refNo ? (<em className="pError">{errors.refNo}</em>) : null}
                                </div>
                              </div>
                              <div className="linebylineInput valid-input mix_dropdown">
                                <label className="control-label">
                                  {Resources.fromCompany[currentLanguage]}
                                </label>
                                <div className="supervisor__company">
                                  <div className="super_name">
                                    <Dropdown data={this.state.companies} isMulti={false} selectedValue={this.state.selectedFromCompany}
                                      styles={CompanyDropdown}
                                      classDrop="companyName1"
                                      handleChange={event => { this.handleChangeDropDown(event, "bicCompanyId", true, "fromContacts", "GetContactsByCompanyId", "companyId", "selectedFromCompany", "selectedFromContact"); }}
                                      name="fromCompanyId" id="fromCompanyId" />
                                  </div>
                                  <div className="super_company">
                                    <Dropdown isMulti={false}
                                      data={this.state.fromContacts}
                                      selectedValue={this.state.selectedFromContact}
                                      handleChange={event => this.handleChangeDropDown(event, "bicContactId", false, "", "", "", "selectedFromContact")}
                                      onChange={setFieldValue}
                                      onBlur={setFieldTouched}
                                      error={errors.bicContactId}
                                      touched={touched.bicContactId}
                                      classDrop="contactName1"
                                      styles={ContactDropdown}
                                      name="bicContactId" id="bicContactId" />
                                  </div>
                                </div>
                              </div>
                              <div className="linebylineInput valid-input">
                                <Dropdown title="specsSection" data={this.state.specsSection} selectedValue={this.state.selectedSpecsSection}
                                  handleChange={event => this.handleChangeDropDown(event, "specsSectionId", false, "", "", "", "selectedSpecsSection")} />
                              </div>
                              <div className="linebylineInput valid-input">
                                <Dropdown title="disciplineTitle"
                                  data={this.state.disciplines} isMulti={false}
                                  selectedValue={this.state.selectedDiscpline}
                                  handleChange={event => this.handleChangeDropDown(event, "disciplineId", false, "", "", "", "selectedDiscpline")}
                                  onChange={setFieldValue}
                                  onBlur={setFieldTouched}
                                  error={errors.disciplineId}
                                  touched={touched.disciplineId}
                                  name="disciplineId" id="disciplineId" />
                              </div>
                              <div className="linebylineInput valid-input fullInputWidth">
                                {this.props.changeStatus === true ? (
                                  <Fragment>
                                    <label className="control-label">
                                      {Resources.contractPo[currentLanguage]}
                                    </label>
                                    <div className="ui input inputDev fillter-item-c ">
                                      <input type="text" className="form-control" readOnly value={this.state.selectedContract.label}
                                        name="contractPo" placeholder={Resources.contractPo[currentLanguage]} />
                                    </div>
                                  </Fragment>
                                ) : (
                                    <Dropdown title="contractPo" isMulti={false}
                                      data={this.state.contracts}
                                      selectedValue={this.state.selectedContract}
                                      handleChange={event => this.handleChangeDropDown(event, "contractId", false, "", "", "", "selectedContract")}
                                      onChange={setFieldValue}
                                      onBlur={setFieldTouched}
                                      error={errors.contractId}
                                      touched={touched.contractId}
                                      name="contractId" id="contractId" index="contractId" />
                                  )}
                              </div>
                              <div className="linebylineInput valid-input">
                                <Dropdown title="reasonForIssue" data={this.state.reasonForIssue} selectedValue={this.state.selectedReasonForIssue}
                                  handleChange={event => this.handleChangeDropDown(event, "reasonForIssueId", false, "", "", "", "selectedReasonForIssue")} />
                              </div>
                              <div className="linebylineInput valid-input">
                                <label className="control-label">
                                  {Resources.fileNumber[currentLanguage]}
                                </label>
                                <div className="inputDev ui input">
                                  <input name="fileNumber" className="form-control fsadfsadsa" id="fileNumber" placeholder={Resources.fileNumber[currentLanguage]}
                                    autoComplete="off" value={this.state.document.fileNumber || ''}
                                    onBlur={e => { handleBlur(e); handleChange(e); }}
                                    onChange={e => this.handleChange(e, "fileNumber")} />
                                </div>
                              </div>
                              <div className="linebylineInput valid-input">
                                <Dropdown title="area" data={this.state.areas} selectedValue={this.state.selectedArea}
                                  handleChange={event => this.handleChangeDropDown(event, "area", false, "", "", "", "selectedArea")} />
                              </div>
                              <div className="linebylineInput valid-input">
                                <Dropdown title="location" data={this.state.locations} selectedValue={this.state.selectedLocation}
                                  handleChange={event => this.handleChangeDropDown(event, "location", false, "", "", "", "selectedLocation")} />
                              </div>
                              <div className="linebylineInput valid-input">
                                <label className="control-label">                                  {Resources.Building[currentLanguage]}                                </label>
                                <div className={"inputDev ui input" + (errors.Building && touched.Building ? " has-error" : !errors.Building && touched.Building ? " has-success" : " ")}>
                                  <input name="Building" className="form-control fsadfsadsa" id="Building"
                                    placeholder={Resources.Building[currentLanguage]}
                                    autoComplete="off" value={this.state.document.building || ''}
                                    onBlur={e => { handleBlur(e); handleChange(e); }}
                                    onChange={e => this.handleChange(e, "building")} />
                                  {errors.Building && touched.Building ? (<em className="pError"> {errors.Building} </em>) : null}
                                </div>
                              </div>
                              <div className="linebylineInput valid-input">
                                <label className="control-label">
                                  {Resources.apartmentNumber[currentLanguage]}
                                </label>
                                <div className={"inputDev ui input" + (errors.apartmentNumber && touched.apartmentNumber ? " has-error" : !errors.apartmentNumber && touched.apartmentNumber ? " has-success" : " ")}>
                                  <input name="apartment" className="form-control fsadfsadsa" id="apartment"
                                    placeholder={Resources.apartmentNumber[currentLanguage]}
                                    autoComplete="off" value={this.state.document.apartment || ''}
                                    onBlur={e => { handleBlur(e); handleChange(e); }}
                                    onChange={e => this.handleChange(e, "apartment")} />
                                  {errors.apartmentNumber && touched.apartmentNumber ? (<em className="pError"> {errors.apartmentNumber} </em>) : null}
                                </div>
                              </div>
                              <div className="linebylineInput valid-input">
                                <Dropdown title="submittalType" data={this.state.SubmittalTypes} selectedValue={this.state.selectedSubmittalType}
                                  handleChange={event => this.handleChangeDropDown(event, "submittalTypeId", false, "", "", "", "selectedSubmittalType")} />
                              </div>
                              <div className="linebylineInput fullInputWidth">
                                <label className="control-label">
                                  {Resources.sharedSettings[currentLanguage]}
                                </label>
                                <div className="shareLinks">
                                  <div className="inputDev ui input">
                                    <input type="text" className="form-control" id="sharedSettings" onChange={e => this.handleChange(e, "sharedSettings")}
                                      value={this.state.document.sharedSettings || ''} name="sharedSettings" placeholder={Resources.sharedSettings[currentLanguage]} />
                                  </div>
                                  {this.state.document.sharedSettings === '' ||
                                    this.state.document.sharedSettings === null ||
                                    this.state.document.sharedSettings === undefined ?
                                    null
                                    :
                                    < a target="_blank" href={this.state.document.sharedSettings}>
                                      <span>
                                        {Resources.openFolder[currentLanguage]}
                                      </span>
                                    </a>
                                  }
                                </div>
                              </div>
                            </div>
                            <div className="slider-Btns">
                              {
                                this.state.isViewMode === false ?
                                  (this.state.isLoading === false ?
                                    (<button className={this.state.isViewMode === true ? "primaryBtn-1 btn middle__btn disNone" : "primaryBtn-1 btn middle__btn"} type="submit">
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
                                    )) : null
                              }
                            </div>
                          </Form>
                        )}
                      </Formik>
                      <br />
                    </div>
                    :
                    (<Fragment>
                      {this.state.currentStep === 1 ?
                        <Fragment>
                          <div className="document-fields">
                            <Formik initialValues={this.state.documentCycle} validationSchema={validationCycleSubmital} enableReinitialize={this.props.changeStatus}
                              onSubmit={values => {
                                if (this.props.changeStatus === true) {
                                  this.editSubmittalCycle();
                                } else {
                                  this.addSubmittalCycle();
                                }
                              }}>
                              {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                                <Form id="submittalForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>
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
                                      <div className={"ui input inputDev fillter-item-c " + (errors.subject && touched.subject ? "has-error" : !errors.subject && touched.subject ? "has-success" : "")} >
                                        <input name="subject" className="form-control fsadfsadsa"
                                          placeholder={Resources.subject[currentLanguage]} autoComplete="off"
                                          value={this.state.documentCycle.subject}
                                          onBlur={e => { handleBlur(e); handleChange(e); }}
                                          onChange={e => this.handleChangeCycles(e, "subject")} />
                                        {errors.subject && touched.subject ? (<em className="pError"> {errors.subject} </em>) : null}
                                      </div>
                                    </div>
                                    <div className="linebylineInput valid-input">
                                      <label className="control-label">
                                        {Resources.status[currentLanguage]}
                                      </label>
                                      <div className="ui checkbox radio radioBoxBlue">
                                        <input type="radio" name="cycleStatus" defaultChecked={this.state.documentCycle.CycleStatus === false ? null : "checked"}
                                          value="true" onChange={e => this.handleChangeCycles(e, "CycleStatus")} />
                                        <label>
                                          {Resources.oppened[currentLanguage]}
                                        </label>
                                      </div>
                                      <div className="ui checkbox radio radioBoxBlue">
                                        <input type="radio" name="cycleStatus" defaultChecked={this.state.documentCycle.CycleStatus === false ? "checked" : null}
                                          value="false" onChange={e => this.handleChangeCycles(e, "CycleStatus")} />
                                        <label>
                                          {Resources.closed[currentLanguage]}
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="proForm datepickerContainer">
                                    <div className="linebylineInput">
                                      <div className="inputDev ui input input-group date NormalInputDate">
                                        <ModernDatepicker startDate={this.state.documentCycle.docDate} title="cycleDate"
                                          handleChange={e => this.handleChangeDateCycles(e, "docDate")} />
                                      </div>
                                    </div>
                                    <div className="linebylineInput valid-input">
                                      <label className="control-label">
                                        {Resources.arrange[currentLanguage]}
                                      </label>
                                      <div className={"ui input inputDev fillter-item-c " + (errors.arrangeCycle && touched.arrangeCycle ? "has-error" : !errors.arrangeCycle && touched.arrangeCycle ? "has-success" : "")}>
                                        <input type="text" className="form-control" readOnly value={this.state.documentCycle.arrange} name="arrangeCycle"
                                          placeholder={Resources.arrange[currentLanguage]}
                                          onBlur={e => { handleChange(e); handleBlur(e); }}
                                          onChange={e => this.handleChangeCycles(e, "arrange")} />

                                        {errors.arrangeCycle && touched.arrangeCycle ? (<em className="pError"> {errors.arrangeCycle} </em>) : null}
                                      </div>
                                    </div>
                                    <div className="linebylineInput valid-input">
                                      <Dropdown title="approvalStatus" data={this.state.approvales}
                                        selectedValue={this.state.selectedApprovalStatus}
                                        handleChange={event => this.handleChangeDropDownCycles(event, "approvalStatusId", false, "", "", "", "selectedApprovalStatus")}
                                        onChange={setFieldValue}
                                        onBlur={setFieldTouched}
                                        error={errors.approvalStatusId}
                                        touched={touched.approvalStatusId}
                                        name="approvalStatusId"
                                        id="approvalStatusId" />
                                    </div>
                                    <div className="linebylineInput valid-input mix_dropdown">
                                      <label className="control-label">
                                        {Resources.toCompany[currentLanguage]}
                                      </label>
                                      <div className="supervisor__company">
                                        <div className="super_name">
                                          <Dropdown data={this.state.companies} isMulti={false} selectedValue={this.state.selectedFromCompanyCycles}
                                            handleChange={event => { this.handleChangeDropDownCycles(event, "flowCompanyId", true, "fromContactsCycles", "GetContactsByCompanyId", "companyId", "selectedFromCompanyCycles", "selectedFromContact"); }}
                                            styles={CompanyDropdown}
                                            classDrop="companyName1"
                                            id="fromCompanyIdCycle" />
                                        </div>
                                        <div className="super_company">
                                          <Dropdown data={this.state.fromContactsCycles}
                                            selectedValue={this.state.selectedFromContactCycles}
                                            handleChange={event => this.handleChangeDropDownCycles(event, "flowContactId", false, "", "", "", "selectedFromContactCycles")}
                                            onChange={setFieldValue}
                                            onBlur={setFieldTouched}
                                            error={errors.flowContactId}
                                            touched={touched.flowContactId}
                                            classDrop="contactName1"
                                            styles={ContactDropdown}
                                            name="flowContactId"
                                            id="flowContactId" />
                                        </div>
                                      </div>
                                    </div>
                                    <div className="linebylineInput">
                                      <div className="inputDev ui input input-group date NormalInputDate">
                                        <ModernDatepicker startDate={this.state.documentCycle.approvedDate} title="dateApproved"
                                          handleChange={e => this.handleChangeDateCycles(e, "approvedDate")} />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="slider-Btns">
                                    {this.state.isViewMode === false ?
                                      (this.state.isLoading === false ?
                                        <Fragment>
                                          <button className="primaryBtn-1 btn meduimBtn" type="submit">{Resources["save"][currentLanguage]}</button>
                                          {this.props.changeStatus === true ? <button className="primaryBtn-1 btn meduimBtn" type="button" onClick={this.addCycle.bind(this)}>{Resources["addNewCycle"][currentLanguage]}</button> : null}
                                        </Fragment>
                                        :
                                        <button className="primaryBtn-1 btn disabled">
                                          <div className="spinner">
                                            <div className="bounce1" />
                                            <div className="bounce2" />
                                            <div className="bounce3" />
                                          </div>
                                        </button>) : null}
                                  </div>
                                </Form>
                              )}
                            </Formik>
                            <header className="main__header">
                              <div className="main__header--div">
                                <h2 className="zero">
                                  {Resources["previousCycle"][currentLanguage]}
                                </h2>
                              </div>
                            </header>
                            <ReactTable data={this.state.submittalItemData}
                              columns={columnsCycles}
                              defaultPageSize={5}
                              noDataText={Resources["noData"][currentLanguage]}
                              className="-striped -highlight" />
                          </div>
                        </Fragment> :
                        <Fragment>
                          {
                            this.state.currentStep === 2 ?
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
                                    validationSchema={validationSchemaForItem}
                                    enableReinitialize={true}
                                    onSubmit={values => { this.addSubmittalItems(); }}>
                                    {({ errors, touched, handleBlur, handleChange, values, handleSubmit, setFieldTouched, setFieldValue }) => (
                                      <Form onSubmit={handleSubmit}>
                                        <div className="proForm datepickerContainer">
                                          <div className="letterFullWidth fullInputWidth">
                                            <label className="control-label">
                                              {Resources["description"][currentLanguage]}
                                            </label>
                                            <div className={"ui input inputDev fillter-item-c " + (errors.description && touched.description ? "has-error" : !errors.description && touched.description ? "has-success" : "")}>
                                              <input name="description" className="form-control fsadfsadsa" id="description"
                                                placeholder={Resources.description[currentLanguage]} autoComplete="off"
                                                value={this.state.itemsDocumentSubmital.description}
                                                onBlur={e => { handleBlur(e); handleChange(e); }}
                                                onChange={e => this.handleChangeItems(e, "description")} />

                                              {errors.description && touched.description ? (<em className="pError"> {errors.description} </em>) : null}
                                            </div>
                                          </div>
                                          <div className="linebylineInput valid-input">
                                            <Dropdown isMulti={false} title="reviewResult" data={this.state.reviewResult} selectedValue={this.state.selectedReviewResult}
                                              onChange={setFieldValue} onBlur={setFieldTouched}
                                              error={errors.reviewResult}
                                              touched={touched.reviewResult}
                                              name="reviewResult" id="reviewResult"
                                              handleChange={event => this.handleChangeDropDownItems(event, "reviewResult", false, "", "", "", "selectedReviewResult")} />
                                          </div>
                                          <div className="linebylineInput">
                                            <div className="inputDev ui input input-group date NormalInputDate">
                                              <ModernDatepicker startDate={this.state.itemsDocumentSubmital.submitalDate} title="submitalDate"
                                                handleChange={e => this.handleChangeDateItems(e, "submitalDate")}
                                              />
                                            </div>
                                          </div>
                                          <div className="linebylineInput valid-input">
                                            <label className="control-label">
                                              {Resources.arrange[currentLanguage]}
                                            </label>
                                            <div className={"ui input inputDev " + (errors.arrange && touched.arrange ? " has-error" : " ")}>
                                              <input type="text" className="form-control" id="arrange" readOnly value={this.state.itemsDocumentSubmital.arrange}
                                                name="arrange" placeholder={Resources.arrange[currentLanguage]}
                                                onBlur={e => { handleChange(e); handleBlur(e); }}
                                                onChange={e => this.handleChangeDateItems(e, "arrange")} />

                                              {errors.arrange && touched.arrange ? (<em className="pError"> {errors.arrange} </em>) : null}
                                            </div>
                                          </div>
                                          <div className="linebylineInput valid-input">
                                            <label className="control-label">
                                              {Resources.refDoc[currentLanguage]}
                                            </label>
                                            <div className={"ui input inputDev" + (errors.refDoc && touched.refDoc ? " has-error" : "ui input inputDev")}>
                                              <input type="text" className="form-control" id="refNo" value={this.state.itemsDocumentSubmital.refDoc}
                                                name="refDoc" placeholder={Resources.refDoc[currentLanguage]}
                                                onBlur={e => { handleChange(e); handleBlur(e); }}
                                                onChange={e => this.handleChangeItems(e, "refDoc")} />

                                              {errors.refDoc && touched.refDoc ? (<em className="pError"> {errors.refDoc} </em>) : null}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="slider-Btns">
                                          {
                                            this.state.isViewMode === false ?
                                              (this.state.isLoading === false ?
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
                                                )) : null}
                                        </div>
                                      </Form>
                                    )}
                                  </Formik>
                                </div>
                                <div className="precycle-grid">
                                  <header className="main__header">
                                    <div className="main__header--div">
                                      <h2 className="zero">
                                        {Resources["listDetails"][currentLanguage]}
                                      </h2>
                                    </div>
                                  </header>
                                  <div className="reactTableActions">
                                    {selectedRows.length > 0 ? (
                                      <div className={"gridSystemSelected " + (selectedRows.length > 0 ? " active" : "")} >
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
                                    <ReactTable data={this.state.itemData} columns={columns} defaultPageSize={5} noDataText={Resources["noData"][currentLanguage]}
                                      className="-striped -highlight"
                                      getTrProps={(state, rowInfo, column, instance) => {
                                        return { onClick: e => { this.viewModelToEdit(rowInfo.original.id, e.target.type); } };
                                      }} />
                                  </div>
                                </div>
                              </Fragment> : null
                          }
                        </Fragment>
                      }
                    </Fragment>
                    )}
                  <div className="doc-pre-cycle letterFullWidth">
                    <div>
                      {this.state.docId > 0 && this.state.isViewMode === false && this.state.currentStep === 0 ?
                        (<UploadAttachment changeStatus={this.props.changeStatus}
                          AddAttachments={883}
                          EditAttachments={3261}
                          ShowDropBox={3581}
                          ShowGoogleDrive={3582}
                          docTypeId={this.state.docTypeId}
                          docId={this.state.docId} projectId={this.state.projectId} />) : null
                      }
                      {this.state.docId > 0 && this.state.currentStep === 0 ? (
                        <Fragment>
                          <div className="document-fields tableBTnabs">
                            <AddDocAttachment projectId={projectId} isViewMode={this.state.isViewMode} docTypeId={this.state.docTypeId} docId={this.state.docId} />
                          </div>
                        </Fragment>
                      ) : null}
                      {this.state.currentStep === 0 ? this.viewAttachments() : null}
                      {this.props.changeStatus === true ? (<ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {this.props.changeStatus === true && this.state.currentStep === 0 ? (
              <div className="approveDocument">
                <div className="approveDocumentBTNS">
                  <DocumentActions
                    isApproveMode={this.state.isApproveMode}
                    docTypeId={this.state.docTypeId}
                    docId={this.state.docId}
                    projectId={this.state.projectId}
                    subject={this.props.document.subject}
                    previousRoute={this.state.previousRoute}
                    docApprovalId={this.state.docApprovalId}
                    docAlertId={this.state.docAlertId}
                    currentArrange={this.state.arrange}
                    showModal={this.props.showModal}
                    showOptionPanel={this.showOptionPanel}
                    permission={this.state.permission}
                    documentName={Resources.Submittal[currentLanguage]}
                  />
                </div>
              </div>
            ) : null}
            <Steps
              steps_defination={steps_defination}
              exist_link="/submittal/" docId={this.state.docId}
              changeCurrentStep={stepNo => this.changeCurrentStep(stepNo)}
              stepNo={this.state.currentStep}
              changeStatus={docId === 0 ? false : true} />
          </div>
        </div>
        <div>

          {this.state.showDeleteModal == true ? (
            <ConfirmationModal title={Resources["smartDeleteMessage"][currentLanguage].content} buttonName="delete" closed={this.onCloseModal}
              showDeleteModal={this.state.showDeleteModal} clickHandlerCancel={this.clickHandlerCancelMain}
              clickHandlerContinue={this.clickHandlerContinueMain.bind(this)} />) : null}

          {this.state.viewForEdit === true ? <SkyLight ref={ref => (this.simpleDialog1 = ref)} beforeClose={this._executeBeforeModalClose}>
            <div className="ui modal largeModal">
              <Formik initialValues={{ ...this.state.itemsDocumentSubmital }}
                validationSchema={validationSchemaForItemPopUp}
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
                          <input name="description" className="form-control fsadfsadsa" id="description" placeholder={Resources.description[currentLanguage]}
                            autoComplete="off" value={this.state.itemsDocumentSubmital.description}
                            onBlur={e => { handleBlur(e); handleChange(e); }}
                            onChange={e => this.handleChangeItems(e, "description")} />
                          {errors.description && touched.description ? (<em className="pError">{errors.description}</em>) : null}
                        </div>
                      </div>
                      <Dropdown title="reviewResult" data={this.state.reviewResult} selectedValue={this.state.selectedReviewResult}
                        handleChange={event => this.handleChangeDropDownItems(event, "reviewResult", false, "", "", "", "selectedReviewResult")}
                        onChange={setFieldValue} onBlur={setFieldTouched} error={errors.reviewResult}
                        touched={touched.reviewResult} name="reviewResult" id="reviewResult" />
                      <ModernDatepicker startDate={this.state.itemsDocumentSubmital.submitalDate} title="submitalDate"
                        handleChange={e => this.handleChangeDateItems(e, "submitalDate")} />
                      <div className="fillter-status fillter-item-c">
                        <label className="control-label">
                          {Resources.arrange[currentLanguage]}
                        </label>
                        <div className={"ui input inputDev " + (errors.arrange && touched.arrange ? " has-error" : " ")}>
                          <input type="text" className="form-control"
                            id="arrange" readOnly
                            value={this.state.itemsDocumentSubmital.arrange}
                            name="arrange"
                            placeholder={Resources.arrange[currentLanguage]}
                            onBlur={e => { handleChange(e); handleBlur(e); }}
                            onChange={e => this.handleChangeDateItems(e, "arrange")} />
                          {errors.arrange && touched.arrange ? (<em className="pError">{errors.arrange}</em>) : null}
                        </div>
                      </div>
                      <div className="fillter-status fillter-item-c">
                        <label className="control-label">
                          {Resources.refDoc[currentLanguage]}
                        </label>
                        <div className={"ui input inputDev" + (errors.refDoc && touched.refDoc ? " has-error" : "ui input inputDev")}>
                          <input type="text" className="form-control" id="refDoc"
                            value={this.state.itemsDocumentSubmital.refDoc}
                            name="refDoc" placeholder={Resources.refDoc[currentLanguage]} onBlur={e => { handleChange(e); handleBlur(e); }}
                            onChange={e => this.handleChangeItems(e, "refDoc")} />
                          {errors.refDoc && touched.refDoc ? (<em className="pError">{errors.refDoc}</em>) : null}
                        </div>
                      </div>
                      <div className="slider-Btns fullWidthWrapper">
                        {this.state.isLoading === false ? (
                          <button className="primaryBtn-1 btn meduimBtn" type="submit">
                            {Resources["goEdit"][currentLanguage]}
                          </button>
                        ) :
                          (<button className="primaryBtn-1 btn disabled">
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
          </SkyLight> : null}

          <SkyLight ref={ref => (this.simpleDialog2 = ref)}>
            <div className="ui modal largeModal proForm ">
              <Formik initialValues={{ ...this.state.addCycleSubmital }}
                validationSchema={validationSchemaForCyclePopUp}
                enableReinitialize={true}
                onSubmit={values => { this.saveNewCycle(); }}>
                {({ errors, touched, handleBlur, handleChange, values, handleSubmit, setFieldTouched, setFieldValue }) => (
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
                      <div className={"ui input inputDev " + (errors.subject && touched.subject ? "has-error" : !errors.subject && touched.subject ? "has-success" : "")}>
                        <input name="subject" className="form-control fsadfsadsa"
                          placeholder={Resources.subject[currentLanguage]} autoComplete="off"
                          value={this.state.addCycleSubmital.subject || ''} onBlur={e => { handleBlur(e); handleChange(e); }}
                          onChange={e => this.handleChangeCyclesPopUp(e, "subject")} />
                        {errors.subject && touched.subject ? (<em className="pError">{errors.subject}</em>) : null}
                      </div>
                    </div>
                    <div className="fillter-status fillter-item-c radioBtnDrop">
                      <label className="control-label">
                        {Resources.status[currentLanguage]}
                      </label>
                      <div className="ui checkbox radio radioBoxBlue">
                        <input type="radio" name="cycleStatus" defaultChecked={this.state.addCycleSubmital.CycleStatus === false ? null : "checked"}
                          value="true" onChange={e => this.handleChangeCyclesPopUp(e, "CycleStatus")} />
                        <label>{Resources.oppened[currentLanguage]}</label>
                      </div>
                      <div className="ui checkbox radio radioBoxBlue">
                        <input type="radio" name="cycleStatus" defaultChecked={this.state.addCycleSubmital.CycleStatus === false ? "checked" : null}
                          value="false" onChange={e => this.handleChangeCyclesPopUp(e, "CycleStatus")} />
                        <label>{Resources.closed[currentLanguage]}</label>
                      </div>
                    </div>
                    <ModernDatepicker title="cycleDate" startDate={this.state.addCycleSubmital.docDate}
                      handleChange={e => this.handleChangeDateCyclesPopUp(e, "docDate")} />
                    <div className="fillter-status fillter-item-c">
                      <label className="control-label">
                        {Resources.arrange[currentLanguage]}
                      </label>
                      <div className={"ui input inputDev fillter-item-c " + (errors.arrange && touched.arrange ? "has-error" : !errors.arrange && touched.arrange ? "has-success" : "")} >
                        <input type="text" className="form-control" readOnly
                          value={this.state.addCycleSubmital.arrange || ''}
                          name="arrange" placeholder={Resources.arrange[currentLanguage]} onBlur={e => { handleChange(e); handleBlur(e); }}
                          onChange={e => this.handleChangeCyclesPopUp(e, "arrange")} />
                        {errors.arrange && touched.arrange ? (<em className="pError">{errors.arrange}</em>) : null}
                      </div>
                    </div>
                    <Dropdown title="approvalStatus"
                      data={this.state.approvales}
                      selectedValue={this.state.selectedCycleAprrovalStatus}
                      handleChange={event => this.handleChangeDropDownCyclesPopUp(event, "approvalStatusId", false, "", "", "", "selectedCycleAprrovalStatus")}
                      onChange={setFieldValue}
                      onBlur={setFieldTouched}
                      error={errors.approvalStatusId} touched={touched.approvalStatusId}
                      name="approvalStatusId" id="approvalStatusId" />

                    <div className="linebylineInput valid-input mix_dropdown">
                      <label className="control-label">
                        {Resources.fromCompany[currentLanguage]}
                      </label>
                      <div className="supervisor__company">
                        <div className="super_name">
                          <Dropdown data={this.state.companies}
                            isMulti={false}
                            selectedValue={this.state.selectedNewFromCompanyCycles}
                            styles={CompanyDropdown}
                            classDrop="companyName1"
                            handleChange={event => { this.handleChangeDropDownCyclesPopUp(event, "flowCompanyId", true, "fromContactsCycles", "GetContactsByCompanyId", "companyId", "selectedNewFromCompanyCycles", "selectedFromContact"); }}
                            id="fromCompanyIdCycle" />
                        </div>
                        <div className="super_company">
                          <Dropdown name="fromContactId"
                            data={this.state.fromContactsCycles}
                            handleChange={event => this.handleChangeDropDownCyclesPopUp(event, "flowContactId", false, "", "", "", "selectedNewFromContactCycles")}
                            selectedValue={this.state.selectedNewFromContactCycles}
                            onChange={setFieldValue}
                            onBlur={setFieldTouched}
                            error={errors.flowContactId}
                            touched={touched.flowContactId}
                            id="flowContactId"
                            classDrop="contactName1"
                            styles={ContactDropdown}
                            name="flowContactId" />
                        </div>
                      </div>
                    </div>
                    <div className="fullWidthWrapper">
                      {this.state.isLoading === false ?
                        (<button className="primaryBtn-1 btn middle__btn" type="submit">
                          {Resources["save"][currentLanguage]}
                        </button>) :
                        (<button className="primaryBtn-1 btn disabled">
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
    documentCycle: state.communication.documentCycle,
    showModal: state.communication.showModal
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(communicationActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SubmittalAddEdit));