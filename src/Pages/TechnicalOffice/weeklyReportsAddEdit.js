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
import { withRouter } from "react-router-dom";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as communicationActions from "../../store/actions/communication";
import Config from "../../Services/Config.js";
import CryptoJS from "crypto-js";
import moment from "moment";
import SkyLight from "react-skylight";
import DocumentActions from '../../Componants/OptionsPanels/DocumentActions';
import DatePicker from "../../Componants/OptionsPanels/DatePicker";
import { toast } from "react-toastify";
import HeaderDocument from "../../Componants/OptionsPanels/HeaderDocument";
import Api from "../../api";
import ReactTable from "react-table";
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import { SkyLightStateless } from "react-skylight";
import Steps from "../../Componants/publicComponants/Steps";

let currentLanguage =
    localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let perviousRoute = "";
let arrange = 0;
const _ = require("lodash");

const validationSchema = Yup.object().shape({
    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),
    companyIdManager: Yup.string().required(Resources['pleaseSelectProjectManagerCompany'][currentLanguage]),
    contactIdManager: Yup.string().required(Resources['fromContactRequired'][currentLanguage]),
    contactIdEngineer: Yup.string().required(Resources['fromContactRequired'][currentLanguage]),
    companyIdEngineer: Yup.string().required(Resources['selectCompany'][currentLanguage]),
    weekNumber: Yup.number().typeError(Resources['onlyNumbers'][currentLanguage]),
    arrange: Yup.number().required(Resources['selectNumber'][currentLanguage]).typeError(Resources['onlyNumbers'][currentLanguage]),
});

const ConstraintsSchema = Yup.object().shape({
    constraints: Yup.string().required(Resources['constraints'][currentLanguage]),
    no: Yup.number().required(Resources['selectNumber'][currentLanguage]).typeError(Resources['onlyNumbers'][currentLanguage]),
});

const DeliverySchema = Yup.object().shape({
    constraints: Yup.string().required(Resources['constraints'][currentLanguage]),
    disciplineId: Yup.string().required(Resources['disciplineRequired'][currentLanguage]),
    prevDelivery: Yup.number().typeError(Resources['onlyNumbers'][currentLanguage]),
    deliveried: Yup.number().typeError(Resources['onlyNumbers'][currentLanguage]),
    no: Yup.number().required(Resources['selectNumber'][currentLanguage]).typeError(Resources['onlyNumbers'][currentLanguage]),
    totalInSite: Yup.number().required(Resources['totalInSiteRequired'][currentLanguage]).typeError(Resources['onlyNumbers'][currentLanguage]),
});

const NeedsSchema = Yup.object().shape({
    constraints: Yup.string().required(Resources['constraints'][currentLanguage]),
    disciplineId: Yup.string().required(Resources['disciplineRequired'][currentLanguage]),
    no: Yup.number().required(Resources['selectNumber'][currentLanguage]).typeError(Resources['onlyNumbers'][currentLanguage]),
    totalInSite: Yup.number().required(Resources['totalInSiteRequired'][currentLanguage]).typeError(Resources['onlyNumbers'][currentLanguage]),
});

const ImplementationSchema = Yup.object().shape({
    constraints: Yup.string().required(Resources['constraints'][currentLanguage]),
    constraintsCode: Yup.string().required(Resources['constraintsCode'][currentLanguage]),
    disciplineId: Yup.string().required(Resources['disciplineRequired'][currentLanguage]),
    no: Yup.number().required(Resources['selectNumber'][currentLanguage]).typeError(Resources['onlyNumbers'][currentLanguage]),
    quantityIndexation: Yup.number().required(Resources['calculatedQuantityRequired'][currentLanguage]).typeError(Resources['onlyNumbers'][currentLanguage]),
    quantityStart: Yup.number().required(Resources['firstQuantityRequired'][currentLanguage]).typeError(Resources['onlyNumbers'][currentLanguage]),
    quantityDone: Yup.number().required(Resources['doneQuantityRequired'][currentLanguage]).typeError(Resources['onlyNumbers'][currentLanguage]),
    completionRate: Yup.number().required(Resources['percintageOfWork'][currentLanguage]).typeError(Resources['onlyNumbers'][currentLanguage]),
});

const NextSchema = Yup.object().shape({
    constraints: Yup.string().required(Resources['constraints'][currentLanguage]),
    constraintsCode: Yup.string().required(Resources['constraintsCode'][currentLanguage]),
    disciplineId: Yup.string().required(Resources['disciplineRequired'][currentLanguage]),
    no: Yup.number().required(Resources['selectNumber'][currentLanguage]).typeError(Resources['onlyNumbers'][currentLanguage]),
    quantityIndexation: Yup.number().required(Resources['doneQuantityRequired'][currentLanguage]).typeError(Resources['onlyNumbers'][currentLanguage]),
    quantityStart: Yup.number().required(Resources['firstQuantityRequired'][currentLanguage]).typeError(Resources['onlyNumbers'][currentLanguage]),
    quantityPredictedDone: Yup.number().required(Resources['predictedQuantityRequired'][currentLanguage]).typeError(Resources['onlyNumbers'][currentLanguage]),
});

const MeetingSchema = Yup.object().shape({
    companyId: Yup.string().required(Resources['fromCompanyRequired'][currentLanguage]),
    contactId: Yup.string().required(Resources['fromContactRequired'][currentLanguage]),
    no: Yup.number().required(Resources['selectNumber'][currentLanguage]).typeError(Resources['onlyNumbers'][currentLanguage]),
});

const ModificationSchema = Yup.object().shape({
    constraints: Yup.string().required(Resources['constraints'][currentLanguage]),
    companyId: Yup.string().required(Resources['fromCompanyRequired'][currentLanguage]),
    contactId: Yup.string().required(Resources['fromContactRequired'][currentLanguage]),
    no: Yup.number().required(Resources['selectNumber'][currentLanguage]).typeError(Resources['onlyNumbers'][currentLanguage]),
});

var steps_defination = [];
steps_defination = [
    { name: "weeklyReport", callBackFn: null },
    { name: "technicalOffice", callBackFn: null },
    { name: "constraints", callBackFn: null },
    { name: "delivery", callBackFn: null },
    { name: "needs", callBackFn: null },
    { name: "implementationWork", callBackFn: null },
    { name: "nextWeek", callBackFn: null },
    { name: "coordination", callBackFn: null },
    { name: "meetings", callBackFn: null },
    { name: "modifications", callBackFn: null }
];

class weeklyReportsAddEdit extends Component {

    constructor(props) {
        super(props)
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
                } catch { this.props.history.goBack(); }
            }
            index++;
        }
        this.state = {
            selectedRows: [],
            CurrentStep: 0,
            showDeleteModal: false,
            isLoading: false,
            isEdit: false,
            isViewMode: false,
            isApproveMode: isApproveMode,
            perviousRoute: perviousRoute,
            isView: false,
            docId: docId,
            docTypeId: 97,
            projectId: projectId,
            docApprovalId: docApprovalId,
            arrange: arrange,
            document: this.props.document ? Object.assign({}, this.props.document) : {},
            permission: [
                { name: "sendByEmail", code: 790 }, { name: "sendByInbox", code: 789 },
                { name: "sendTask", code: 0 }, { name: "distributionList", code: 991 },
                { name: "createTransmittal", code: 3077 }, { name: "sendToWorkFlow", code: 793 },
                { name: "viewAttachments", code: 3310 }, { name: "deleteAttachments", code: 880 }
            ],
            selectedProjectManager: { label: Resources.pleaseSelectProjectManagerCompany[currentLanguage], value: "0" },
            selectedProjectContact: { label: Resources.fromContactRequired[currentLanguage], value: "0" },
            selectedSiteEngineer: { label: Resources.fromContactRequired[currentLanguage], value: "0" },
            selectedSiteCompany: { label: Resources.selectCompany[currentLanguage], value: "0" },
            selectedConsultatnt: { label: Resources.selectCompany[currentLanguage], value: "0" },
            CompaniesData: [],
            contactProjectData: [],
            contactSiteData: [],
            BtnLoading: false,
            technicalOfficeObj: {},
            EditMood: false,
            apperanceDate: moment(),
            constraintsRows: [],
            ConstraintId: '',
            disciplineData: [],
            selectedDiscplineDelivery: { label: Resources.disciplineRequired[currentLanguage], value: "0" },
            deliveryRows: [],
            deliveryId: '',
            functionDeleteName: '',
            selectedDiscplineNeeds: { label: Resources.disciplineRequired[currentLanguage], value: "0" },
            arraivalDate: moment(),
            needsRows: [],
            needsId: '',
            ImplementationRows: [],
            selectedDiscplineImplementation: { label: Resources.disciplineRequired[currentLanguage], value: "0" },
            ImplementationSDate: moment(),
            ImplementationEDate: moment(),
            ImplementationId: '',
            NextRows: [],
            selectedDiscplineNext: { label: Resources.disciplineRequired[currentLanguage], value: "0" },
            NextSDate: moment(),
            NextEDate: moment(),
            NextId: '',
            Coordination: [],
            tblCoordination: [],
            Coordinationobj: {},
            today: moment(),
            selectedMeetingCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
            selectedMeetingContact: { label: Resources.fromContactRequired[currentLanguage], value: "0" },
            meetingId: '',
            meetingRows: [],
            contactsMeeting: [],
            modificationId: '',
            ModificationRows: [],
            contactsModification: [],
            selectedModificationCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
            selectedModificationContact: { label: Resources.fromContactRequired[currentLanguage], value: "0" },
            modificationDate: moment()
        };

        if (!Config.IsAllow(784) && !Config.IsAllow(785) && !Config.IsAllow(787)) {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push(this.state.perviousRoute);
        }
    }

    saveAndExit(event) {
        if (this.state.CurrentStep === 1) { this.setState({ CurrentStep: this.state.CurrentStep + 1 }) }
        else { this.props.history.push("/weeklyReport/" + this.state.projectId) }
    }

    showBtnsSaving() {
        let btn = null;
        if (this.state.docId === 0) {
            btn = <button className="primaryBtn-1 btn meduimBtn" type="submit" >{Resources.save[currentLanguage]}</button>;
        } else if (this.state.docId > 0) {
            btn = <button type="submit" className={"primaryBtn-1 btn meduimBtn " + (this.state.isViewMode === true ? " disNone" : " ")} >{Resources.next[currentLanguage]}</button>
        }
        return btn;
    }

    viewAttachments() {
        return this.state.docId > 0 ? (
            Config.IsAllow(3310) === true ?
                (<ViewAttachment docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} deleteAttachments={854} />) : null) : null;
    }

    fillDropDowns(isEdit) {
        dataservice.GetDataList('GetProjectProjectsCompaniesForList?projectId= ' + this.state.projectId, 'companyName', 'companyId').then(result => {
            if (isEdit) {
                let id = this.props.document.companyId;
                let companyIdEngineer = this.props.document.companyIdEngineer;
                let companyIdManager = this.props.document.companyIdManager;
                let selectedValue = {};

                if (companyIdEngineer) {
                    selectedValue = _.find(result, function (i) { return i.value === companyIdEngineer });
                    this.setState({ selectedSiteCompany: selectedValue })
                    this.fillSubDropDown(companyIdEngineer, isEdit, 'companyIdEngineer')
                }
                if (companyIdManager) {
                    selectedValue = _.find(result, function (i) { return i.value === companyIdManager });
                    this.setState({ selectedProjectManager: selectedValue })
                    this.fillSubDropDown(companyIdManager, isEdit, 'companyIdManager')
                }
                if (id) {
                    selectedValue = _.find(result, function (i) { return i.value === id });
                    this.setState({ selectedConsultatnt: selectedValue })
                }
            }
            this.setState({ CompaniesData: [...result] })
        })
    }

    fillSubDropDown = (value, isEdit, companyIdName) => {
        let action = 'GetContactsByCompanyId?companyId=' + value
        dataservice.GetDataList(action, 'contactName', 'id').then(result => {


            if (companyIdName === 'companyIdManager') {
                if (isEdit) {
                    let selectedSiteEngineer = this.state.document.contactIdManager;
                    let targetFieldSelected = _.find(result, function (i) { return i.value == selectedSiteEngineer });
                    this.setState({ selectedProjectContact: targetFieldSelected });
                }
                this.setState({ contactProjectData: result });

            }
            else if (companyIdName === 'companyIdEngineer') {
                if (isEdit) {
                    let selectedSiteEngineer = this.state.document.contactIdEngineer;
                    let targetFieldSelected = _.find(result, function (i) { return i.value == selectedSiteEngineer });
                    this.setState({ selectedSiteEngineer: targetFieldSelected });
                }
                this.setState({ contactSiteData: result });
            }

        });
    }

    componentWillMount() {
        if (this.state.docId > 0) {
            let url = "GetLogsWeeklyReportsForEdit?id=" + this.state.docId;
            this.props.actions.documentForEdit(url, this.state.docTypeId, 'weeklyReport')
        }
        else {
            dataservice.GetNextArrangeMainDocument('GetNextArrangeMainDoc?projectId=' + projectId + '&docType=' + this.state.docTypeId + '&companyId=undefined&contactId=undefined').then(
                res => {
                    const Document = {
                        projectId: projectId, arrange: res, status: "true", subject: "",
                        docDate: moment(), companyId: '', weekNumber: 0, companyIdManager: '', contactIdManager: '',
                        companyIdEngineer: '', contactIdEngineer: '', startDate: moment(), endDate: moment(),
                    }
                    this.setState({ document: Document })
                }
            )
            this.fillDropDowns(false);
            this.props.actions.documentForAdding();
        }
    }

    componentWillReceiveProps(nextProps, prevProps) {
        if (nextProps.document.id) {
            let doc = nextProps.document
            doc.docDate = doc.docDate === null ? moment().format('YYYY-MM-DD') : moment(doc.docDate).format('YYYY-MM-DD')
            this.setState({ isEdit: true, document: doc, hasWorkflow: this.props.hasWorkflow })
            let isEdit = nextProps.document.id > 0 ? true : false
            this.fillDropDowns(isEdit);
            this.checkDocumentIsView();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.hasWorkflow !== prevProps.hasWorkflow || this.props.changeStatus !== prevProps.changeStatus) {
            this.checkDocumentIsView();
        }
    }

    getCoordinationData = () => {
        dataservice.GetDataGrid('GetLogsWeeklyReportsCoordination?parentId=' + this.state.docId).then(
            result => {
                let obj = [
                    {
                        key: Resources.totalInventoryRecived[currentLanguage],
                        CustodyCurrent: result[0].totalCustodyCurrent,
                        CustodyPre: result[0].totalCustodyPre,
                        CustodyTotal: result[0].totalCustodyTotal,
                        name: 'total'
                    },
                    {
                        key: Resources.consumed[currentLanguage],
                        CustodyCurrent: result[0].doneCustodyCurrent,
                        CustodyPre: result[0].doneCustodyPre,
                        CustodyTotal: result[0].doneCustodyTotal,
                        name: 'done'
                    },

                    {
                        key: Resources.remainder[currentLanguage],
                        CustodyCurrent: result[0].remainderCustodyCurrent,
                        CustodyPre: result[0].remainderCustodyPre,
                        CustodyTotal: result[0].remainderCustodyTotal,
                        name: 'remainder'
                    },
                    {
                        key: Resources.required[currentLanguage],
                        CustodyCurrent: result[0].requiredCustodyCurrent,
                        CustodyPre: result[0].requiredCustodyPre,
                        CustodyTotal: result[0].requiredCustodyTotal,
                        name: 'required'
                    },
                ]
                this.setState({ Coordinationobj: result[0], tblCoordination: obj })
            });

    }

    componentDidMount() {
        var links = document.querySelectorAll(".noTabs__document .doc-container .linebylineInput");
        for (var i = 0; i < links.length; i++) {
            if ((i + 1) % 2 == 0) { links[i].classList.add("even") }
            else { links[i].classList.add("odd") }
        }
        this.checkDocumentIsView();

        if (this.state.docId !== 0) {
            this.getCoordinationData();
            let technicalOfficeObj = {
                arrange: '', workshopDrawingsRecived: '', workshopDrawingsRequired: '',
                architicturalContractors: '', electricityContractors: '', weeklyReportsId: this.state.docId
            }
            dataservice.GetRowById('GetLogsWeeklyReportsTechnicalOfficesForEdit?id=' + this.state.docId).then(result => { this.setState({ technicalOfficeObj: result ? result : technicalOfficeObj, EditMood: true }) });

            dataservice.GetDataGrid('GetLogsWeeklyReportsConstraints?parentId=' + this.state.docId).then(result => { this.setState({ constraintsRows: result }) });

            dataservice.GetDataGrid('GetLogsWeeklyReportsDeliverys?parentId=' + this.state.docId).then(result => { this.setState({ deliveryRows: result }) });

            dataservice.GetDataGrid('GetLogsWeeklyReportsNeeds?parentId=' + this.state.docId).then(result => { this.setState({ needsRows: result }) });

            dataservice.GetDataGrid('GetLogsWeeklyReportsWork?parentId=' + this.state.docId).then(result => { this.setState({ ImplementationRows: result }) });

            dataservice.GetDataGrid('GetLogsWeeklyReportsNextWeek?parentId=' + this.state.docId).then(result => { this.setState({ NextRows: result }) });


            dataservice.GetDataGrid('GetLogsWeeklyReportsMeetings?parentId=' + this.state.docId).then(result => { this.setState({ meetingRows: result }) });

            dataservice.GetDataGrid('GetLogsWeeklyReportsModifications?parentId=' + this.state.docId).then(result => { this.setState({ ModificationRows: result }) });
        }
        else {
            let technicalOfficeObj = {
                arrange: '', workshopDrawingsRecived: '', workshopDrawingsRequired: '',
                architicturalContractors: '', electricityContractors: '', weeklyReportsId: this.state.docId
            }
            this.setState({ EditMood: false, technicalOfficeObj })
        }

        dataservice.GetDataList('GetAccountsDefaultList?listType=discipline&pageNumber=0&pageSize=10000', 'title', 'id').then(result => {
            this.setState({ disciplineData: result });
        });
    }

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!Config.IsAllow(785)) {
                this.setState({ isViewMode: true })
            }
            if (this.state.isApproveMode != true && Config.IsAllow(785)) {
                if (this.props.hasWorkflow == false && Config.IsAllow(785)) {
                    if (this.props.document.status !== false && Config.IsAllow(785)) {
                        this.setState({ isViewMode: false })
                    }
                    else { this.setState({ isViewMode: true }) }
                }
                else { this.setState({ isViewMode: true }) }
            }
        }
        else { this.setState({ isViewMode: false }) }
    }

    handleChange(e, field) {
        let original_document = { ...this.state.document };
        let updated_document = {}
        updated_document[field] = e.target.value;
        updated_document = Object.assign(original_document, updated_document);
        this.setState({ document: updated_document })
    }

    componentWillUnmount() {
        this.props.actions.clearCashDocument();
        this.setState({ docId: 0 })
    }

    handleChangeDate(e, field) {
        let original_document = { ...this.state.document }
        let updated_document = {};
        updated_document[field] = e;
        updated_document = Object.assign(original_document, updated_document);
        this.setState({ document: updated_document })
    }

    handleChangeDropDown(event, field, isSubscrib, selectedValue) {
        if (event == null) return
        let original_document = { ...this.state.document }
        let updated_document = {};
        updated_document[field] = event.value;
        updated_document = Object.assign(original_document, updated_document);
        this.setState({ document: updated_document, [selectedValue]: event })
        if (isSubscrib) {
            this.fillSubDropDown(event.value, false, field)
        }
    }

    SaveDoc = (Mood) => {
        this.setState({ isLoading: true, IsAddMood: false })
        if (Mood === 'EditMood') {
            let doc = { ...this.state.document };
            doc.docDate = moment(doc.docDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");
            doc.startDate = moment(doc.startDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");
            doc.endDate = moment(doc.endDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");
            dataservice.addObject('EditLogsWeeklyReports', doc).then(result => {
                this.setState({ isLoading: false, IsAddMood: true })
                toast.success(Resources["operationSuccess"][currentLanguage])

            }).catch(ex => {
                this.setState({ Loading: false })
                toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
            })
        } else {
            let doc = { ...this.state.document };
            doc.docDate = moment(doc.docDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");
            doc.startDate = moment(doc.startDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");
            doc.endDate = moment(doc.endDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");
            dataservice.addObject('AddLogsWeeklyReports', doc).then(result => {
                this.setState({ isLoading: false, docId: result.id, IsAddMood: true });
                toast.success(Resources["operationSuccess"][currentLanguage]);
                this.getCoordinationData();
            }).catch(ex => {
                this.setState({ Loading: false })
                toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
            })
        }

    }

    handleChangeStepTwo(e, field) {
        let original_document = { ...this.state.technicalOfficeObj };
        let updated_document = {}
        updated_document[field] = e.target.value;
        updated_document = Object.assign(original_document, updated_document);
        this.setState({ technicalOfficeObj: updated_document })
    }

    saveTechnicalOffice = () => {
        this.setState({ isLoading: true })
        if (this.state.EditMood) {
            let doc = { ...this.state.technicalOfficeObj };
            dataservice.addObject('EditLogsWeeklyReportsTechnicalOffices', doc).then(result => {
                this.setState({ isLoading: false })
                toast.success(Resources["operationSuccess"][currentLanguage])

            }).catch(ex => {
                this.setState({ Loading: false })
                toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
            })
        } else {
            let doc = { ...this.state.technicalOfficeObj };
            doc.weeklyReportsId = this.state.docId
            dataservice.addObject('AddLogsWeeklyReportsTechnicalOffices', doc).then(result => {
                this.setState({ isLoading: false })
                toast.success(Resources["operationSuccess"][currentLanguage])
            }).catch(ex => {
                this.setState({ Loading: false })
                toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
            })
        }
    }

    saveConstraints = (values) => {
        this.setState({ isLoading: true })
        let obj = {
            weeklyReportsId: this.state.docId, arrange: values.no, constraints: values.constraints,
            appearanceDate: moment(this.state.apperanceDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS")
        };
        dataservice.addObject('AddLogsWeeklyReportsConstraints', obj).then(result => {
            this.setState({ isLoading: false, constraintsRows: result });
            toast.success(Resources["operationSuccess"][currentLanguage]);

            dataservice.GetNextArrangeMainDocument('GetNextArrangeWeeklyItems?weeklyDocId=' + this.state.docId + '&docType=' + this.state.docTypeId + '&tabId=2').then(
                res => {
                    values.no = res;
                    values.constraints = '';
                    this.setState({ isLoading: false });
                }).catch(ex => {
                    this.setState({ isLoading: false });
                    toast.error(Resources['operationCanceled'][currentLanguage].successTitle);
                });
        });
    }

    DeleteConstraints = (id) => {
        this.setState({ ConstraintId: id, showDeleteModal: true, functionDeleteName: 'DeleteConstraints' });
    }

    ConfirmationDeleteConstraints = () => {
        this.setState({ isLoading: true });
        dataservice.GetRowById('LogsWeeklyReportsConstraintsDelete?id=' + this.state.ConstraintId).then(
            result => {
                this.setState({ constraintsRows: result, showDeleteModal: false, isLoading: false });
                toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle);
            }).catch(ex => {
                this.setState({ showDeleteModal: false, isLoading: false, });
                toast.error(Resources['operationCanceled'][currentLanguage].successTitle);
            });
    }

    saveDelivery = (values) => {
        this.setState({ isLoading: true })
        let obj = {
            weeklyReportsId: this.state.docId, constraints: values.constraints, disciplineId: this.state.selectedDiscplineDelivery.value,
            prevDelivery: values.prevDelivery, deliveried: values.deliveried, totalInSite: values.totalInSite, arrange: values.no,
        };
        dataservice.addObject('AddLogsWeeklyReportsDeliverys', obj).then(result => {
            this.setState({ isLoading: false, deliveryRows: result });
            toast.success(Resources["operationSuccess"][currentLanguage]);

            dataservice.GetNextArrangeMainDocument('GetNextArrangeWeeklyItems?weeklyDocId=' + this.state.docId + '&docType=' + this.state.docTypeId + '&tabId=4').then(
                res => {
                    values.no = res;
                    values.constraints = '';
                    values.prevDelivery = '';
                    values.deliveried = '';
                    values.totalInSite = '';
                    this.setState({ isLoading: false, selectedDiscplineDelivery: { label: Resources.disciplineRequired[currentLanguage], value: "0" } });
                }).catch(ex => {
                    this.setState({ isLoading: false });
                    toast.error(Resources['operationCanceled'][currentLanguage].successTitle);
                });
        });
    }

    DeleteDelivery = (id) => {
        this.setState({ deliveryId: id, showDeleteModal: true, functionDeleteName: 'DeleteDelivery' });
    }

    ConfirmationDeleteDelivery = () => {
        this.setState({ isLoading: true });
        dataservice.GetRowById('LogsWeeklyReportsDeliveryDelete?id=' + this.state.deliveryId).then(
            result => {
                this.setState({ deliveryRows: result, showDeleteModal: false, isLoading: false });
                toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)
            }).catch(ex => {
                this.setState({ showDeleteModal: false, isLoading: false, });
                toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
            });
    }

    ConfirmationDelete = () => {
        switch (this.state.functionDeleteName) {
            case 'DeleteConstraints':
                this.ConfirmationDeleteConstraints();
                break;

            case 'DeleteDelivery':
                this.ConfirmationDeleteDelivery();
                break;

            case 'DeleteNeed':
                this.ConfirmationDeleteNeed();
                break;

            case 'DeleteImplementation':
                this.ConfirmationDeleteImplementation();
                break;

            case 'DeleteNext':
                this.ConfirmationDeleteNext();
                break;
            case 'DeleteMeeting':
                this.ConfirmationDeleteMeeting();
                break;
            case 'DeleteModification':
                this.ConfirmationDeleteModification();
                break;
            default:
                break;
        }
    }

    saveNeed = (values) => {
        this.setState({ isLoading: true });
        let obj = {
            weeklyReportsId: this.state.docId, constraints: values.constraints, disciplineId: this.state.selectedDiscplineNeeds.value,
            totalInSite: values.totalInSite, arrange: values.no,
            arraivalDate: moment(this.state.arraivalDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS")
        };
        dataservice.addObject('AddLogsWeeklyReportsNeeds', obj).then(result => {
            this.setState({ isLoading: false, needsRows: result });
            toast.success(Resources["operationSuccess"][currentLanguage]);

            dataservice.GetNextArrangeMainDocument('GetNextArrangeWeeklyItems?weeklyDocId=' + this.state.docId + '&docType=' + this.state.docTypeId + '&tabId=6').then(
                res => {
                    values.no = res;
                    values.constraints = '';
                    values.totalInSite = '';
                    this.setState({
                        isLoading: false, arraivalDate: moment(),
                        selectedDiscplineNeeds: { label: Resources.disciplineRequired[currentLanguage], value: "0" }
                    });
                }).catch(ex => {
                    this.setState({ isLoading: false });
                    toast.error(Resources['operationCanceled'][currentLanguage].successTitle);
                });
        });
    }

    DeleteNeed = (id) => {
        this.setState({ needsId: id, showDeleteModal: true, functionDeleteName: 'DeleteNeed' });
    }

    ConfirmationDeleteNeed = () => {
        this.setState({ isLoading: true });
        dataservice.GetRowById('LogsWeeklyReportsNeedsDelete?id=' + this.state.needsId).then(
            result => {
                this.setState({ needsRows: result, showDeleteModal: false, isLoading: false });
                toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle);
            }).catch(ex => {
                this.setState({ showDeleteModal: false, isLoading: false, });
                toast.error(Resources['operationCanceled'][currentLanguage].successTitle);
            });
    }

    saveImplementation = (values) => {
        this.setState({ isLoading: true })
        let obj = {
            weeklyReportsId: this.state.docId,
            constraints: values.constraints,
            disciplineId: this.state.selectedDiscplineImplementation.value,
            quantityIndexation: values.quantityIndexation,
            arrange: values.no,
            startDate: moment(this.state.ImplementationSDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS"),
            endDate: moment(this.state.ImplementationEDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS"),
            constraintsCode: values.constraintsCode,
            quantityStart: values.quantityStart,
            quantityDone: values.quantityDone,
            completionRate: values.completionRate,
        };
        dataservice.addObject('AddLogsWeeklyReportsWorks', obj).then(result => {
            this.setState({ isLoading: false, ImplementationRows: result });
            toast.success(Resources["operationSuccess"][currentLanguage]);

            dataservice.GetNextArrangeMainDocument('GetNextArrangeWeeklyItems?weeklyDocId=' + this.state.docId + '&docType=' + this.state.docTypeId + '&tabId=8').then(
                res => {
                    values.no = res;
                    values.constraints = '';
                    values.quantityStart = '';
                    values.constraintsCode = '';
                    values.quantityIndexation = '';
                    values.quantityDone = '';
                    values.completionRate = '';
                    this.setState({
                        isLoading: false, ImplementationSDate: moment(), ImplementationEDate: moment(),
                        selectedDiscplineImplementation: { label: Resources.disciplineRequired[currentLanguage], value: "0" }
                    });
                }).catch(ex => {
                    this.setState({ isLoading: false });
                    toast.error(Resources['operationCanceled'][currentLanguage].successTitle);
                });
        });
    }

    DeleteImplementation = (id) => {
        this.setState({ ImplementationId: id, showDeleteModal: true, functionDeleteName: 'DeleteImplementation' });
    }

    ConfirmationDeleteImplementation = () => {
        this.setState({ isLoading: true });
        dataservice.GetRowById('LogsWeeklyReportsWorkDelete?id=' + this.state.ImplementationId).then(
            result => {
                this.setState({ ImplementationRows: result, showDeleteModal: false, isLoading: false });
                toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)
            }).catch(ex => {
                this.setState({ showDeleteModal: false, isLoading: false, });
                toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
            });
    }

    saveNext = (values) => {
        this.setState({ isLoading: true })
        let obj = {
            weeklyReportsId: this.state.docId,
            constraints: values.constraints,
            disciplineId: this.state.selectedDiscplineNext.value,
            quantityIndexation: values.quantityIndexation,
            arrange: values.no,
            startDate: moment(this.state.ImplementationSDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS"),
            endDate: moment(this.state.ImplementationEDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS"),
            constraintsCode: values.constraintsCode,
            quantityStart: values.quantityStart,
            quantityPredictedDone: values.quantityPredictedDone,
        };
        dataservice.addObject('AddLogsWeeklyReportsNextWeeks', obj).then(result => {
            this.setState({ isLoading: false, NextRows: result });
            toast.success(Resources["operationSuccess"][currentLanguage]);

            dataservice.GetNextArrangeMainDocument('GetNextArrangeWeeklyItems?weeklyDocId=' + this.state.docId + '&docType=' + this.state.docTypeId + '&tabId=7').then(
                res => {
                    values.no = res;
                    values.constraints = '';
                    values.quantityStart = '';
                    values.constraintsCode = '';
                    values.quantityIndexation = '';
                    values.quantityPredictedDone = '';

                    this.setState({
                        isLoading: false, NextSDate: moment(), NextEDate: moment(),
                        selectedDiscplineNext: { label: Resources.disciplineRequired[currentLanguage], value: "0" }
                    });
                }).catch(ex => {
                    this.setState({ isLoading: false });
                    toast.error(Resources['operationCanceled'][currentLanguage].successTitle);
                });
        });
    }

    DeleteNext = (id) => {
        this.setState({ NextId: id, showDeleteModal: true, functionDeleteName: 'DeleteNext' });
    }

    ConfirmationDeleteNext = () => {
        this.setState({ isLoading: true });
        dataservice.GetRowById('LogsWeeklyReportsNextWeekDelete?id=' + this.state.NextId).then(
            result => {
                this.setState({ NextRows: result, showDeleteModal: false, isLoading: false });
                toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle);
            }).catch(ex => {
                this.setState({ showDeleteModal: false, isLoading: false, });
                toast.error(Resources['operationCanceled'][currentLanguage].successTitle);
            });
    }

    handleChangeTable = (value, name, colName) => {
        if (value) {
            let col = colName + name
            let element = this.state.Coordinationobj
            element[col] = value
            this.setState({ Coordinationobj: element });
        }
    }

    saveCoordination = () => {
        this.setState({ isLoading: true });
        dataservice.addObject('EditLogsWeeklyReportsCoordination', this.state.Coordinationobj).then(result => {
            this.setState({ isLoading: false });
            toast.success(Resources["operationSuccess"][currentLanguage]);
        }).catch(ex => {
            this.setState({ isLoading: false });
            toast.error(Resources['operationCanceled'][currentLanguage].successTitle);
        });
    }

    handleChangeMeetingCompany = (value) => {
        if (value) {
            this.setState({ selectedMeetingCompany: value });
            let action = 'GetContactsByCompanyId?companyId=' + value.value
            dataservice.GetDataList(action, 'contactName', 'id').then(result => {
                this.setState({ contactsMeeting: result });
            });
        }
    }

    saveMeeting = (values) => {
        this.setState({ isLoading: true });
        let obj = {
            weeklyReportsId: this.state.docId,
            arrange: values.no,
            day: moment(this.state.today, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS"),
            hour: values.hours,
            companyId: this.state.selectedMeetingCompany.value,
            contactId: this.state.selectedMeetingContact.value,
        };
        dataservice.addObject('AddLogsWeeklyReportsMeetings', obj).then(result => {
            this.setState({ isLoading: false, meetingRows: result });
            toast.success(Resources["operationSuccess"][currentLanguage]);

            dataservice.GetNextArrangeMainDocument('GetNextArrangeWeeklyItems?weeklyDocId=' + this.state.docId + '&docType=' + this.state.docTypeId + '&tabId=5').then(
                res => {
                    values.no = res;
                    values.hours = '00:00';
                    this.setState({
                        isLoading: false, today: moment(),
                        selectedMeetingCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
                        selectedMeetingContact: { label: Resources.fromContactRequired[currentLanguage], value: "0" },
                    });
                }).catch(ex => {
                    this.setState({ isLoading: false });
                    toast.error(Resources['operationCanceled'][currentLanguage].successTitle);
                });
        });
    }

    DeleteMeeting = (id) => {
        this.setState({ meetingId: id, showDeleteModal: true, functionDeleteName: 'DeleteMeeting' });
    }

    ConfirmationDeleteMeeting = () => {
        this.setState({ isLoading: true });
        dataservice.GetRowById('LogsWeeklyReportsMeetingsDelete?id=' + this.state.meetingId).then(
            result => {
                this.setState({ meetingRows: result, showDeleteModal: false, isLoading: false });
                toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle);
            }).catch(ex => {
                this.setState({ showDeleteModal: false, isLoading: false, });
                toast.error(Resources['operationCanceled'][currentLanguage].successTitle);
            });
    }

    handleChangeModificationCompany = (value) => {
        if (value) {
            this.setState({ selectedModificationCompany: value });
            let action = 'GetContactsByCompanyId?companyId=' + value.value
            dataservice.GetDataList(action, 'contactName', 'id').then(result => {
                this.setState({ contactsModification: result });
            });
        }
    }

    DeleteModification = (id) => {
        this.setState({ modificationId: id, showDeleteModal: true, functionDeleteName: 'DeleteModification' });
    }

    ConfirmationDeleteModification = () => {
        this.setState({ isLoading: true });
        dataservice.GetRowById('LogsWeeklyReportsModificationsDelete?id=' + this.state.modificationId).then(
            result => {
                this.setState({ ModificationRows: result, showDeleteModal: false, isLoading: false });
                toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)
            }).catch(ex => {
                this.setState({ showDeleteModal: false, isLoading: false, });
                toast.error(Resources['operationCanceled'][currentLanguage].successTitle);
            });
    }

    saveModification = (values) => {
        this.setState({ isLoading: true })
        let obj = {
            weeklyReportsId: this.state.docId,
            arrange: values.no,
            docDate: moment(this.state.modificationDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS"),
            modificationsMethod: values.constraints,
            companyId: this.state.selectedModificationCompany.value,
            contactId: this.state.selectedModificationContact.value,
            modifications: values.modifications
        };
        dataservice.addObject('AddLogsWeeklyReportsModifications', obj).then(result => {
            this.setState({ isLoading: false, ModificationRows: result });
            toast.success(Resources["operationSuccess"][currentLanguage]);

            dataservice.GetNextArrangeMainDocument('GetNextArrangeWeeklyItems?weeklyDocId=' + this.state.docId + '&docType=' + this.state.docTypeId + '&tabId=5').then(
                res => {
                    values.no = res;
                    values.modifications = '';
                    values.constraints = '';
                    this.setState({
                        isLoading: false, modificationDate: moment(),
                        selectedModificationCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
                        selectedModificationContact: { label: Resources.fromContactRequired[currentLanguage], value: "0" },
                    });
                }).catch(ex => {
                    this.setState({ isLoading: false });
                    toast.error(Resources['operationCanceled'][currentLanguage].successTitle);
                });
        });
    }

    changeCurrentStep = stepNo => {
        this.setState({ CurrentStep: stepNo });
    };

    showOptionPanel = () => {
        this.props.actions.showOptionPanel(true);
    }

    render() {

        let stepOne = () => {
            return (
                <div className="document-fields">
                    <Formik initialValues={{ ...this.state.document }}
                        enableReinitialize={true}
                        validationSchema={validationSchema}
                        onSubmit={values => {
                            if (this.props.showModal) { return; }

                            if (this.state.IsAddMood) {
                                this.changeCurrentStep(1);
                            }
                            else {
                                if (this.props.changeStatus === true && this.state.docId > 0) {
                                    this.SaveDoc('EditMood');
                                    this.changeCurrentStep(1);
                                } else if (this.props.changeStatus === false && this.state.docId === 0) {
                                    this.SaveDoc('AddMood');
                                }
                            }
                        }}>
                        {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                            <Form id="QsForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>
                                <div className="proForm first-proform">

                                    <div className="linebylineInput valid-input">
                                        <label className="control-label">{Resources.subject[currentLanguage]}</label>
                                        <div className={"inputDev ui input" + (errors.subject && touched.subject ? (" has-error") : !errors.subject && touched.subject ? (" has-success") : " ")} >
                                            <input name='subject' className="form-control fsadfsadsa" id="subject"
                                                placeholder={Resources.subject[currentLanguage]} value={this.state.document.subject}
                                                autoComplete='off' onChange={(e) => this.handleChange(e, 'subject')}
                                                onBlur={(e) => {
                                                    handleBlur(e)
                                                    handleChange(e)
                                                }} /> {touched.subject ? (<em className="pError">{errors.subject}</em>) : null}
                                        </div>
                                    </div>

                                    <div className="linebylineInput valid-input">
                                        <label className="control-label">{Resources.status[currentLanguage]}</label>
                                        <div className="ui checkbox radio radioBoxBlue">
                                            <input type="radio" name="letter-status" defaultChecked={this.state.document.status === false ? null : 'checked'} value="true" onChange={e => this.handleChange(e, 'status')} />
                                            <label>{Resources.oppened[currentLanguage]}</label>
                                        </div>
                                        <div className="ui checkbox radio radioBoxBlue">
                                            <input type="radio" name="letter-status" defaultChecked={this.state.document.status === false ? 'checked' : null} value="false" onChange={e => this.handleChange(e, 'status')} />
                                            <label>{Resources.closed[currentLanguage]}</label>
                                        </div>
                                    </div>

                                </div>

                                <div className="proForm datepickerContainer">

                                    <div className="linebylineInput valid-input alternativeDate">
                                        <DatePicker title='docDate' startDate={this.state.document.docDate}
                                            handleChange={e => this.handleChangeDate(e, 'docDate')} />
                                    </div>

                                    <div className="linebylineInput valid-input alternativeDate">
                                        <DatePicker title='startDate' startDate={this.state.document.startDate}
                                            handleChange={e => this.handleChangeDate(e, 'startDate')} />
                                    </div>

                                    <div className="linebylineInput valid-input alternativeDate">
                                        <DatePicker title='finishDate' startDate={this.state.document.endDate}
                                            handleChange={e => this.handleChangeDate(e, 'endDate')} />
                                    </div>

                                    <div className="linebylineInput valid-input">
                                        <label className="control-label">{Resources['no'][currentLanguage]} </label>
                                        <div className={"inputDev ui input " + (errors.arrange ? 'has-error' : !errors.arrange && touched.arrange ? (" has-success") : " ")}>
                                            <input className="form-control" name='arrange' readOnly
                                                placeholder={Resources['no'][currentLanguage]}
                                                value={this.state.document.arrange} onChange={(e) => this.handleChange(e, 'arrange')}
                                                onBlur={(e) => {
                                                    handleBlur(e)
                                                    handleChange(e)
                                                }} />
                                            {errors.arrange ? (<em className="pError">{errors.arrange}</em>) : null}
                                        </div>
                                    </div>

                                    <div className="linebylineInput valid-input">
                                        <label className="control-label">{Resources['weekNumber'][currentLanguage]} </label>
                                        <div className={"inputDev ui input " + (errors.weekNumber ? 'has-error' : !errors.weekNumber && touched.weekNumber ? (" has-success") : " ")}>
                                            <input className="form-control" name='weekNumber'
                                                placeholder={Resources['weekNumber'][currentLanguage]}
                                                value={this.state.document.weekNumber} onChange={(e) => this.handleChange(e, 'weekNumber')}
                                                onBlur={(e) => {
                                                    handleBlur(e)
                                                    handleChange(e)
                                                }} />
                                            {touched.weekNumber ? (<em className="pError">{errors.weekNumber}</em>) : null}
                                        </div>
                                    </div>

                                    <div className="linebylineInput valid-input">
                                        <Dropdown title="consultatnt" data={this.state.CompaniesData} selectedValue={this.state.selectedConsultatnt}
                                            handleChange={event => this.handleChangeDropDown(event, 'companyId', false, 'selectedConsultatnt')} />
                                    </div>

                                    <div className="linebylineInput valid-input">
                                        <Dropdown title="projectManager" data={this.state.CompaniesData} selectedValue={this.state.selectedProjectManager}
                                            handleChange={event => this.handleChangeDropDown(event, "companyIdManager", true, "selectedProjectManager")}
                                            onChange={setFieldValue} onBlur={setFieldTouched} error={errors.companyIdManager}
                                            touched={touched.companyIdManager} index="companyIdManager" name="companyIdManager" id="companyIdManager" />
                                    </div>

                                    <div className="linebylineInput valid-input">
                                        <Dropdown title="projectContact" data={this.state.contactProjectData} selectedValue={this.state.selectedProjectContact}
                                            handleChange={event => this.handleChangeDropDown(event, "contactIdManager", false, "selectedProjectContact")}
                                            onChange={setFieldValue} onBlur={setFieldTouched} error={errors.contactIdManager}
                                            touched={touched.contactIdManager} index="contactIdManager" name="contactIdManager" id="contactIdManager" />
                                    </div>

                                    <div className="linebylineInput valid-input">
                                        <Dropdown title="siteCompany" data={this.state.CompaniesData} selectedValue={this.state.selectedSiteCompany}
                                            handleChange={event => this.handleChangeDropDown(event, "companyIdEngineer", true, "selectedSiteCompany")}
                                            onChange={setFieldValue} onBlur={setFieldTouched} error={errors.companyIdEngineer}
                                            touched={touched.companyIdEngineer} name="companyIdEngineer" id="companyIdEngineer" />
                                    </div>

                                    <div className="linebylineInput valid-input">
                                        <Dropdown title="siteEngineer" data={this.state.contactSiteData} selectedValue={this.state.selectedSiteEngineer}
                                            handleChange={event => this.handleChangeDropDown(event, "contactIdEngineer", false, "selectedSiteEngineer")}
                                            onChange={setFieldValue} onBlur={setFieldTouched} error={errors.contactIdEngineer}
                                            touched={touched.contactIdEngineer} name="contactIdEngineer" id="contactIdEngineer" />
                                    </div>

                                </div>

                                {this.props.changeStatus === true ?
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
                                    : null}

                                <div className="doc-pre-cycle letterFullWidth">
                                    <div>
                                        {this.state.docId > 0 ?
                                            <UploadAttachment changeStatus={this.props.changeStatus} AddAttachments={879} EditAttachments={3265} ShowDropBox={3589}
                                                ShowGoogleDrive={3590} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                            : null}
                                        {this.viewAttachments()}
                                        {this.props.changeStatus === true ?
                                            <ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                            : null}
                                    </div>
                                </div>

                                <div className="slider-Btns">
                                    {this.state.isLoading ?
                                        <button className="primaryBtn-1 btn disabled">
                                            <div className="spinner">
                                                <div className="bounce1" />
                                                <div className="bounce2" />
                                                <div className="bounce3" />
                                            </div>
                                        </button>
                                        :
                                        this.showBtnsSaving()}
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            )
        }

        let stepTwo = () => {
            return (
                <div className="step-content">

                    <div className={"subiTabsContent feilds__top " + (this.props.isViewMode ? "readOnly_inputs" : " ")}>

                        <div className='document-fields'>

                            <div className="proForm datepickerContainer">

                                <div className="linebylineInput valid-input fullInputWidth">
                                    <label className="control-label">{Resources.deliveredWorkShopDrawings[currentLanguage]}</label>
                                    <div className="ui input inputDev"  >
                                        <input type="text" className="form-control" placeholder={Resources.deliveredWorkShopDrawings[currentLanguage]}
                                            value={this.state.technicalOfficeObj.didi}
                                            onChange={(e) => this.handleChangeStepTwo(e, 'didi')} />
                                    </div>
                                </div>

                                <div className="linebylineInput valid-input fullInputWidth">
                                    <label className="control-label">{Resources.requiredWorkShopDrawings[currentLanguage]}</label>
                                    <div className="ui input inputDev"  >
                                        <input type="text" className="form-control" placeholder={Resources.requiredWorkShopDrawings[currentLanguage]}
                                            value={this.state.technicalOfficeObj.workshopDrawingsRequired}
                                            onChange={(e) => this.handleChangeStepTwo(e, 'workshopDrawingsRequired')} />
                                    </div>
                                </div>

                                <div className="linebylineInput valid-input fullInputWidth">
                                    <label className="control-label">{Resources.architicturalContractorsSituations[currentLanguage]}</label>
                                    <div className="ui input inputDev"  >
                                        <input type="text" className="form-control" placeholder={Resources.architicturalContractorsSituations[currentLanguage]}
                                            value={this.state.technicalOfficeObj.architicturalContractors}
                                            onChange={(e) => this.handleChangeStepTwo(e, 'architicturalContractors')} />
                                    </div>
                                </div>

                                <div className="linebylineInput valid-input fullInputWidth">
                                    <label className="control-label">{Resources.electricianAndMechanicContractorsSituations[currentLanguage]}</label>
                                    <div className="ui input inputDev"  >
                                        <input type="text" className="form-control" placeholder={Resources.electricianAndMechanicContractorsSituations[currentLanguage]}
                                            value={this.state.technicalOfficeObj.electricityContractors}
                                            onChange={(e) => this.handleChangeStepTwo(e, 'electricityContractors')} />
                                    </div>
                                </div>

                                <div className="linebylineInput valid-input fullInputWidth">
                                    <label className="control-label">{Resources.no[currentLanguage]}</label>
                                    <div className="ui input inputDev"  >
                                        <input type="number" className="form-control" placeholder={Resources.no[currentLanguage]}
                                            value={this.state.technicalOfficeObj.arrange}
                                            onChange={(e) => this.handleChangeStepTwo(e, 'arrange')} />
                                    </div>
                                </div>

                                <div className="slider-Btns letterFullWidth">
                                    <button className={"primaryBtn-1 btn " + (this.props.isViewMode === true ? ' disNone' : '')} onClick={() => this.saveTechnicalOffice()} disabled={this.props.isViewMode} >{Resources["save"][currentLanguage]}</button>
                                </div>
                            </div>
                            <div className="slider-Btns letterFullWidth">
                                <button type="button" className="primaryBtn-1 btn " onClick={() => this.changeCurrentStep(2)} disabled={this.props.isViewMode} >{Resources["next"][currentLanguage]}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        let stepThree = () => {

            let columnsConstraints = [
                {
                    Header: Resources['no'][currentLanguage],
                    accessor: 'arrange',
                    width: 50,
                },
                {
                    Header: Resources["action"][currentLanguage],
                    accessor: "id",
                    Cell: ({ row }) => {
                        return (
                            <Fragment>
                                <div className="btn table-btn-tooltip" style={{ marginLeft: "5px" }} onClick={() => this.DeleteConstraints(row._original.id)}>
                                    <i style={{ fontSize: "1.6em" }} className="fa fa-trash-o" />
                                </div>
                            </Fragment>
                        )
                    },
                    width: 120
                },
                {
                    Header: Resources['constraints'][currentLanguage],
                    accessor: 'constraints',
                    width: 250,
                },
                {
                    Header: Resources["apperanceDate"][currentLanguage],
                    accessor: "appearanceDate",
                    width: 200,
                    sortabel: true,
                    Cell: row => (
                        <span>
                            <span>{moment(row.value).format("DD/MM/YYYY")}</span>
                        </span>
                    )
                }
            ]

            return (
                <div className="step-content">

                    <div className={"subiTabsContent feilds__top " + (this.props.isViewMode ? "readOnly_inputs" : " ")}>
                        <Formik
                            initialValues={{
                                constraints: '',
                                no: this.state.constraintsRows.length + 1,
                            }}
                            validationSchema={ConstraintsSchema}
                            enableReinitialize={true}
                            onSubmit={(values) => {
                                this.saveConstraints(values)
                            }}                >
                            {({ errors, touched, setFieldTouched, setFieldValue, handleBlur, handleChange, values }) => (
                                <Form id="voItemForm" className="proForm datepickerContainer customProform" noValidate="novalidate" >
                                    <div className='document-fields'>

                                        <div className="proForm first-proform">
                                            <div className="linebylineInput valid-input">
                                                <label className="control-label">{Resources.constraints[currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.constraints && touched.constraints ? (" has-error") : !errors.constraints && touched.constraints ? (" has-success") : " ")} >
                                                    <input name='constraints' className="form-control fsadfsadsa" id="constraints"
                                                        placeholder={Resources.constraints[currentLanguage]} value={values.constraints}
                                                        autoComplete='off' onChange={handleChange}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} /> {touched.constraints ? (<em className="pError">{errors.constraints}</em>) : null}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="proForm datepickerContainer">

                                            <div className="linebylineInput valid-input alternativeDate">
                                                <DatePicker title='apperanceDate' startDate={this.state.apperanceDate}
                                                    handleChange={e => this.setState({ apperanceDate: e })} />
                                            </div>

                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources.no[currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.no && touched.no ? (" has-error") : !errors.no && touched.no ? (" has-success") : " ")} >
                                                    <input name='no' className="form-control fsadfsadsa" id="no"
                                                        placeholder={Resources.no[currentLanguage]} value={values.no}
                                                        autoComplete='off' onChange={handleChange}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} /> {touched.no ? (<em className="pError">{errors.no}</em>) : null}
                                                </div>
                                            </div>

                                            <div className="slider-Btns fullWidthWrapper textLeft ">
                                                <button className={"primaryBtn-1 btn " + (this.props.isViewMode === true ? ' disNone' : '')} type="submit" disabled={this.props.isViewMode} >{Resources["save"][currentLanguage]}</button>
                                            </div>

                                        </div>

                                        <div className="doc-pre-cycle">
                                            <header>
                                                <h2 className="zero">{Resources['constraints'][currentLanguage]}</h2>
                                            </header>

                                            <ReactTable
                                                // filterable
                                                ref={(r) => { this.selectTable = r }}
                                                data={this.state.constraintsRows} noDataText={Resources['noData'][currentLanguage]}
                                                columns={columnsConstraints} defaultPageSize={10} minRows={2} />
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                        <div className="slider-Btns letterFullWidth">
                            <button type="button" className="primaryBtn-1 btn " onClick={() => this.changeCurrentStep(3)} disabled={this.props.isViewMode} >{Resources["next"][currentLanguage]}</button>
                        </div>
                    </div>
                </div>
            )
        }

        let stepFour = () => {

            let columnsDevlivery = [
                {
                    Header: Resources['no'][currentLanguage],
                    accessor: 'arrange',
                    width: 50,
                },
                {
                    Header: Resources["action"][currentLanguage],
                    accessor: "id",
                    Cell: ({ row }) => {
                        return (
                            <Fragment>
                                <div className="btn table-btn-tooltip" style={{ marginLeft: "5px" }} onClick={() => this.DeleteDelivery(row._original.id)}>
                                    <i style={{ fontSize: "1.6em" }} className="fa fa-trash-o" />
                                </div>
                            </Fragment>
                        )
                    },
                    width: 80
                },
                {
                    Header: Resources['disciplineName'][currentLanguage],
                    accessor: 'disciplineName',
                    width: 150,
                },

                {
                    Header: Resources['constraints'][currentLanguage],
                    accessor: 'constraints',
                    width: 150,
                },

                {
                    Header: Resources['previousDelivery'][currentLanguage],
                    accessor: 'prevDelivery',
                    width: 150,
                }
                , {
                    Header: Resources['deliveried'][currentLanguage],
                    accessor: 'deliveried',
                    width: 100,
                },
                {
                    Header: Resources['totalInSite'][currentLanguage],
                    accessor: 'totalInSite',
                    width: 100,
                },
            ]

            return (
                <div className="step-content">

                    <div className={"subiTabsContent feilds__top " + (this.props.isViewMode ? "readOnly_inputs" : " ")}>
                        <Formik
                            initialValues={{
                                no: this.state.deliveryRows.length + 1,
                                constraints: '',
                                prevDelivery: '',
                                deliveried: '',
                                totalInSite: '',
                                disciplineId: ''
                            }}
                            validationSchema={DeliverySchema}
                            enableReinitialize={true}
                            onSubmit={(values) => { this.saveDelivery(values) }}>
                            {({ errors, values, touched, setFieldTouched, setFieldValue, handleBlur, handleChange }) => (
                                <Form id="voItemForm" className="proForm datepickerContainer customProform" noValidate="novalidate" >
                                    <div className='document-fields'>

                                        <div className="proForm datepickerContainer">

                                            <div className="linebylineInput valid-input">
                                                <Dropdown title="discipline" data={this.state.disciplineData} selectedValue={this.state.selectedDiscplineDelivery}
                                                    handleChange={event => this.setState({ selectedDiscplineDelivery: event })}
                                                    onChange={setFieldValue} onBlur={setFieldTouched} error={errors.disciplineId}
                                                    touched={touched.disciplineId} index="disciplineId" name="disciplineId" id="disciplineId" />
                                            </div>



                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources.no[currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.no && touched.no ? (" has-error") : !errors.no && touched.no ? (" has-success") : " ")} >
                                                    <input name='no' className="form-control fsadfsadsa" id="no"
                                                        placeholder={Resources.no[currentLanguage]} value={values.no}
                                                        autoComplete='off' onChange={handleChange}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} /> {touched.no ? (<em className="pError">{errors.no}</em>) : null}
                                                </div>
                                            </div>




                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources.constraints[currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.constraints && touched.constraints ? (" has-error") : !errors.constraints && touched.constraints ? (" has-success") : " ")} >
                                                    <input name='constraints' className="form-control fsadfsadsa" id="constraints"
                                                        placeholder={Resources.constraints[currentLanguage]} value={values.constraints}
                                                        autoComplete='off' onChange={handleChange}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} /> {touched.constraints ? (<em className="pError">{errors.constraints}</em>) : null}
                                                </div>
                                            </div>



                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources.previousDelivery[currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.prevDelivery && touched.prevDelivery ? (" has-error") : !errors.prevDelivery && touched.prevDelivery ? (" has-success") : " ")} >
                                                    <input name='prevDelivery' className="form-control fsadfsadsa" id="prevDelivery"
                                                        placeholder={Resources.previousDelivery[currentLanguage]} value={values.prevDelivery}
                                                        autoComplete='off' onChange={handleChange}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} /> {touched.prevDelivery ? (<em className="pError">{errors.prevDelivery}</em>) : null}
                                                </div>
                                            </div>


                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources.deliveried[currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.deliveried && touched.deliveried ? (" has-error") : !errors.deliveried && touched.deliveried ? (" has-success") : " ")} >
                                                    <input name='deliveried' className="form-control fsadfsadsa" id="deliveried"
                                                        placeholder={Resources.deliveried[currentLanguage]} value={values.deliveried}
                                                        autoComplete='off' onChange={handleChange}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} /> {touched.deliveried ? (<em className="pError">{errors.deliveried}</em>) : null}
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources.totalInSite[currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.totalInSite && touched.totalInSite ? (" has-error") : !errors.totalInSite && touched.totalInSite ? (" has-success") : " ")} >
                                                    <input name='totalInSite' className="form-control fsadfsadsa" id="totalInSite"
                                                        placeholder={Resources.totalInSite[currentLanguage]} value={values.totalInSite}
                                                        autoComplete='off' onChange={handleChange}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} /> {touched.totalInSite ? (<em className="pError">{errors.totalInSite}</em>) : null}
                                                </div>
                                            </div>


                                            <div className="slider-Btns fullWidthWrapper textLeft ">
                                                <button className={"primaryBtn-1 btn " + (this.props.isViewMode === true ? ' disNone' : '')} type="submit" disabled={this.props.isViewMode} >{Resources["save"][currentLanguage]}</button>
                                            </div>
                                        </div>
                                        <div className="doc-pre-cycle">
                                            <header>
                                                <h2 className="zero">{Resources['delivery'][currentLanguage]}</h2>
                                            </header>

                                            <ReactTable
                                                // filterable
                                                ref={(r) => { this.selectTable = r }}
                                                data={this.state.deliveryRows} noDataText={Resources['noData'][currentLanguage]}
                                                columns={columnsDevlivery} defaultPageSize={10} minRows={2} />
                                        </div>

                                    </div>
                                </Form>
                            )}
                        </Formik>
                        <div className="slider-Btns letterFullWidth">
                            <button type="button" className="primaryBtn-1 btn " onClick={() => this.changeCurrentStep(4)} disabled={this.props.isViewMode} >{Resources["next"][currentLanguage]}</button>
                        </div>
                    </div>
                </div>
            )
        }

        let stepFive = () => {

            let columnsNeeds = [
                {
                    Header: Resources['no'][currentLanguage],
                    accessor: 'arrange',
                    width: 50,
                },
                {
                    Header: Resources["action"][currentLanguage],
                    accessor: "id",
                    Cell: ({ row }) => {
                        return (
                            <Fragment>
                                <div className="btn table-btn-tooltip" style={{ marginLeft: "5px" }} onClick={() => this.DeleteNeed(row._original.id)}>
                                    <i style={{ fontSize: "1.6em" }} className="fa fa-trash-o" />
                                </div>
                            </Fragment>
                        )
                    },
                    width: 80
                },
                {
                    Header: Resources['disciplineName'][currentLanguage],
                    accessor: 'disciplineName',
                    width: 150,
                },

                {
                    Header: Resources['constraints'][currentLanguage],
                    accessor: 'constraints',
                    width: 150,
                },

                {
                    Header: Resources["arraivalDate"][currentLanguage],
                    accessor: "arraivalDate",
                    width: 200,
                    sortabel: true,
                    Cell: row => (
                        <span>
                            <span>{moment(row.value).format("DD/MM/YYYY")}</span>
                        </span>
                    )
                },
                {
                    Header: Resources['totalInSite'][currentLanguage],
                    accessor: 'totalInSite',
                    width: 100,
                },
            ]

            return (
                <div className="step-content">

                    <div className={"subiTabsContent feilds__top " + (this.props.isViewMode ? "readOnly_inputs" : " ")}>
                        <Formik
                            initialValues={{
                                no: this.state.needsRows.length + 1,
                                constraints: '',
                                totalInSite: '',
                                disciplineId: ''
                            }}
                            validationSchema={NeedsSchema}
                            enableReinitialize={true}
                            onSubmit={(values) => { this.saveNeed(values) }}                >
                            {({ errors, touched, values, setFieldTouched, setFieldValue, handleBlur, handleChange }) => (
                                <Form id="voItemForm" className="proForm datepickerContainer customProform" noValidate="novalidate" >
                                    <div className='document-fields'>

                                        <div className="proForm first-proform">
                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources.constraints[currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.constraints && touched.constraints ? (" has-error") : !errors.constraints && touched.constraints ? (" has-success") : " ")} >
                                                    <input name='constraints' className="form-control fsadfsadsa" id="constraints"
                                                        placeholder={Resources.constraints[currentLanguage]} value={values.constraints}
                                                        autoComplete='off' onChange={handleChange}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} /> {touched.constraints ? (<em className="pError">{errors.constraints}</em>) : null}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="proForm datepickerContainer">

                                            <div className="linebylineInput valid-input">
                                                <Dropdown title="discipline" data={this.state.disciplineData} selectedValue={this.state.selectedDiscplineNeeds}
                                                    handleChange={event => this.setState({ selectedDiscplineNeeds: event })}
                                                    onChange={setFieldValue} onBlur={setFieldTouched} error={errors.disciplineId}
                                                    touched={touched.disciplineId} index="disciplineId" name="disciplineId" id="disciplineId" />
                                            </div>

                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources.no[currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.no && touched.no ? (" has-error") : !errors.no && touched.no ? (" has-success") : " ")} >
                                                    <input name='no' className="form-control fsadfsadsa" id="no"
                                                        placeholder={Resources.no[currentLanguage]} value={values.no}
                                                        autoComplete='off' onChange={handleChange}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} /> {touched.no ? (<em className="pError">{errors.no}</em>) : null}
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input alternativeDate">
                                                <DatePicker title='arraivalDate' startDate={this.state.arraivalDate}
                                                    handleChange={e => this.setState({ arraivalDate: e })} />
                                            </div>

                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources.totalInSite[currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.totalInSite && touched.totalInSite ? (" has-error") : !errors.totalInSite && touched.totalInSite ? (" has-success") : " ")} >
                                                    <input name='totalInSite' className="form-control fsadfsadsa" id="totalInSite"
                                                        placeholder={Resources.totalInSite[currentLanguage]} value={values.totalInSite}
                                                        autoComplete='off' onChange={handleChange}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} /> {touched.totalInSite ? (<em className="pError">{errors.totalInSite}</em>) : null}
                                                </div>
                                            </div>

                                            <div className="slider-Btns fullWidthWrapper textLeft ">
                                                <button className={"primaryBtn-1 btn " + (this.props.isViewMode === true ? ' disNone' : '')} type="submit" disabled={this.props.isViewMode} >{Resources["save"][currentLanguage]}</button>
                                            </div>

                                        </div>

                                        <div className="doc-pre-cycle">
                                            <header>
                                                <h2 className="zero">{Resources['needs'][currentLanguage]}</h2>
                                            </header>

                                            <ReactTable ref={(r) => { this.selectTable = r }} defaultPageSize={10} minRows={2} columns={columnsNeeds}
                                                data={this.state.needsRows} noDataText={Resources['noData'][currentLanguage]} />
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                        <div className="slider-Btns letterFullWidth">
                            <button type="button" className="primaryBtn-1 btn " onClick={() => this.changeCurrentStep(5)} disabled={this.props.isViewMode} >{Resources["next"][currentLanguage]}</button>
                        </div>
                    </div>
                </div>
            )
        }

        let stepSex = () => {

            let ImplementationColumns = [
                {
                    Header: Resources['no'][currentLanguage],
                    accessor: 'arrange',
                    width: 50,
                },
                {
                    Header: Resources["action"][currentLanguage],
                    accessor: "id",
                    Cell: ({ row }) => {
                        return (
                            <Fragment>
                                <div className="btn table-btn-tooltip" style={{ marginLeft: "5px" }} onClick={() => this.DeleteImplementation(row._original.id)}>
                                    <i style={{ fontSize: "1.6em" }} className="fa fa-trash-o" />
                                </div>
                            </Fragment>
                        )
                    },
                    width: 80
                },
                {
                    Header: Resources['disciplineName'][currentLanguage],
                    accessor: 'disciplineName',
                    width: 150,
                },

                {
                    Header: Resources['constraints'][currentLanguage],
                    accessor: 'constraints',
                    width: 150,
                },
                {
                    Header: Resources['constraintsCode'][currentLanguage],
                    accessor: 'constraintsCode',
                    width: 150,
                },
                {
                    Header: Resources['firstQuantity'][currentLanguage],
                    accessor: 'quantityStart',
                    width: 150,
                },
                {
                    Header: Resources['doneQuantity'][currentLanguage],
                    accessor: 'quantityDone',
                    width: 150,
                },
                {
                    Header: Resources['calculatedQuantity'][currentLanguage],
                    accessor: 'quantityIndexation',
                    width: 150,
                },
                {
                    Header: Resources['percintageOfWork'][currentLanguage],
                    accessor: 'completionRate',
                    width: 150,
                },
                {
                    Header: Resources["startDate"][currentLanguage],
                    accessor: "startDate",
                    width: 100,
                    sortabel: true,
                    Cell: row => (
                        <span>
                            <span>{moment(row.value).format("DD/MM/YYYY")}</span>
                        </span>
                    )
                },
                {
                    Header: Resources["finishDate"][currentLanguage],
                    accessor: "endDate",
                    width: 100,
                    sortabel: true,
                    Cell: row => (
                        <span>
                            <span>{moment(row.value).format("DD/MM/YYYY")}</span>
                        </span>
                    )
                },
            ]

            return (
                <div className="step-content">

                    <div className={"subiTabsContent feilds__top " + (this.props.isViewMode ? "readOnly_inputs" : " ")}>
                        <Formik
                            initialValues={{
                                no: this.state.ImplementationRows.length + 1,
                                constraints: '',
                                disciplineId: '',
                                constraintsCode: '',
                                quantityIndexation: '',
                                quantityStart: '',
                                quantityDone: '',
                                completionRate: ''
                            }}
                            validationSchema={ImplementationSchema}
                            enableReinitialize={true}
                            onSubmit={(values) => { this.saveImplementation(values) }}                >
                            {({ errors, touched, values, setFieldTouched, setFieldValue, handleBlur, handleChange }) => (
                                <Form id="voItemForm" className="proForm datepickerContainer customProform" noValidate="novalidate" >
                                    <div className='document-fields'>

                                        <div className="proForm datepickerContainer">

                                            <div className="linebylineInput valid-input">
                                                <Dropdown title="discipline" data={this.state.disciplineData} selectedValue={this.state.selectedDiscplineImplementation}
                                                    handleChange={event => this.setState({ selectedDiscplineImplementation: event })}
                                                    onChange={setFieldValue} onBlur={setFieldTouched} error={errors.disciplineId}
                                                    touched={touched.disciplineId} index="disciplineId" name="disciplineId" id="disciplineId" />
                                            </div>

                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources.no[currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.no && touched.no ? (" has-error") : !errors.no && touched.no ? (" has-success") : " ")} >
                                                    <input name='no' className="form-control fsadfsadsa" id="no"
                                                        placeholder={Resources.no[currentLanguage]} value={values.no}
                                                        autoComplete='off' onChange={handleChange}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} /> {touched.no ? (<em className="pError">{errors.no}</em>) : null}
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources.constraints[currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.constraints && touched.constraints ? (" has-error") : !errors.constraints && touched.constraints ? (" has-success") : " ")} >
                                                    <input name='constraints' className="form-control fsadfsadsa" id="constraints"
                                                        placeholder={Resources.constraints[currentLanguage]} value={values.constraints}
                                                        autoComplete='off' onChange={handleChange}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} /> {touched.constraints ? (<em className="pError">{errors.constraints}</em>) : null}
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources.constraintsCode[currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.constraintsCode && touched.constraintsCode ? (" has-error") : !errors.constraintsCode && touched.constraintsCode ? (" has-success") : " ")} >
                                                    <input name='constraintsCode' className="form-control fsadfsadsa" id="constraintsCode"
                                                        placeholder={Resources.constraintsCode[currentLanguage]} value={values.constraintsCode}
                                                        autoComplete='off' onChange={handleChange}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} /> {touched.constraintsCode ? (<em className="pError">{errors.constraintsCode}</em>) : null}
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input alternativeDate">
                                                <DatePicker title='startDate' startDate={this.state.ImplementationSDate}
                                                    handleChange={e => this.setState({ ImplementationSDate: e })} />
                                            </div>

                                            <div className="linebylineInput valid-input alternativeDate">
                                                <DatePicker title='finishDate' startDate={this.state.ImplementationEDate}
                                                    handleChange={e => this.setState({ ImplementationEDate: e })} />
                                            </div>

                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources.firstQuantity[currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.quantityStart && touched.quantityStart ? (" has-error") : !errors.quantityStart && touched.quantityStart ? (" has-success") : " ")} >
                                                    <input name='quantityStart' className="form-control fsadfsadsa" id="quantityStart"
                                                        placeholder={Resources.firstQuantity[currentLanguage]} value={values.quantityStart}
                                                        autoComplete='off' onChange={handleChange}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} /> {touched.quantityStart ? (<em className="pError">{errors.quantityStart}</em>) : null}
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources.doneQuantity[currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.quantityDone && touched.quantityDone ? (" has-error") : !errors.quantityDone && touched.quantityDone ? (" has-success") : " ")} >
                                                    <input name='quantityDone' className="form-control fsadfsadsa" id="quantityDone"
                                                        placeholder={Resources.doneQuantity[currentLanguage]} value={values.quantityDone}
                                                        autoComplete='off' onChange={handleChange}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} /> {touched.quantityDone ? (<em className="pError">{errors.quantityDone}</em>) : null}
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources.calculatedQuantity[currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.quantityIndexation && touched.quantityIndexation ? (" has-error") : !errors.quantityIndexation && touched.quantityIndexation ? (" has-success") : " ")} >
                                                    <input name='quantityIndexation' className="form-control fsadfsadsa" id="quantityIndexation"
                                                        placeholder={Resources.calculatedQuantity[currentLanguage]} value={values.quantityIndexation}
                                                        autoComplete='off' onChange={handleChange}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} /> {touched.quantityIndexation ? (<em className="pError">{errors.quantityIndexation}</em>) : null}
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources.percintageOfWork[currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.completionRate && touched.completionRate ? (" has-error") : !errors.completionRate && touched.completionRate ? (" has-success") : " ")} >
                                                    <input name='completionRate' className="form-control fsadfsadsa" id="completionRate"
                                                        placeholder={Resources.percintageOfWork[currentLanguage]} value={values.completionRate}
                                                        autoComplete='off' onChange={handleChange}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} /> {touched.completionRate ? (<em className="pError">{errors.completionRate}</em>) : null}
                                                </div>
                                            </div>

                                            <div className="slider-Btns fullWidthWrapper textLeft ">
                                                <button className={"primaryBtn-1 btn " + (this.props.isViewMode === true ? ' disNone' : '')} type="submit" disabled={this.props.isViewMode} >{Resources["save"][currentLanguage]}</button>
                                            </div>

                                        </div>

                                        <div className="doc-pre-cycle">
                                            <header>
                                                <h2 className="zero">{Resources['implementationWork'][currentLanguage]}</h2>
                                            </header>

                                            <ReactTable
                                                // filterable
                                                ref={(r) => { this.selectTable = r }}
                                                data={this.state.ImplementationRows} noDataText={Resources['noData'][currentLanguage]}
                                                columns={ImplementationColumns} defaultPageSize={10} minRows={2} />
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                        <div className="slider-Btns letterFullWidth">
                            <button type="button" className="primaryBtn-1 btn " onClick={() => this.changeCurrentStep(6)} disabled={this.props.isViewMode} >{Resources["next"][currentLanguage]}</button>
                        </div>
                    </div>
                </div>
            )
        }

        let stepSeven = () => {

            let NextColumns = [
                {
                    Header: Resources['no'][currentLanguage],
                    accessor: 'arrange',
                    width: 50,
                },
                {
                    Header: Resources["action"][currentLanguage],
                    accessor: "id",
                    Cell: ({ row }) => {
                        return (
                            <Fragment>
                                <div className="btn table-btn-tooltip" style={{ marginLeft: "5px" }} onClick={() => this.DeleteNext(row._original.id)}>
                                    <i style={{ fontSize: "1.6em" }} className="fa fa-trash-o" />
                                </div>
                            </Fragment>
                        )
                    },
                    width: 80
                },
                {
                    Header: Resources['disciplineName'][currentLanguage],
                    accessor: 'disciplineName',
                    width: 150,
                },

                {
                    Header: Resources['constraints'][currentLanguage],
                    accessor: 'constraints',
                    width: 150,
                },
                {
                    Header: Resources['constraintsCode'][currentLanguage],
                    accessor: 'constraintsCode',
                    width: 150,
                },
                {
                    Header: Resources['firstQuantity'][currentLanguage],
                    accessor: 'quantityStart',
                    width: 150,
                },
                {
                    Header: Resources['calculatedQuantity'][currentLanguage],
                    accessor: 'quantityIndexation',
                    width: 150,
                },
                {
                    Header: Resources['predictedQuantity'][currentLanguage],
                    accessor: 'quantityPredictedDone',
                    width: 150,
                },
                {
                    Header: Resources["startDate"][currentLanguage],
                    accessor: "startDate",
                    width: 100,
                    sortabel: true,
                    Cell: row => (
                        <span>
                            <span>{moment(row.value).format("DD/MM/YYYY")}</span>
                        </span>
                    )
                },
                {
                    Header: Resources["finishDate"][currentLanguage],
                    accessor: "endDate",
                    width: 100,
                    sortabel: true,
                    Cell: row => (
                        <span>
                            <span>{moment(row.value).format("DD/MM/YYYY")}</span>
                        </span>
                    )
                },
            ]

            return (
                <div className="step-content">

                    <div className={"subiTabsContent feilds__top " + (this.props.isViewMode ? "readOnly_inputs" : " ")}>
                        <Formik
                            initialValues={{
                                no: this.state.NextRows.length + 1,
                                constraints: '',
                                disciplineId: '',
                                constraintsCode: '',
                                quantityIndexation: '',
                                quantityStart: '',
                                quantityPredictedDone: '',
                            }}
                            validationSchema={NextSchema}
                            enableReinitialize={true}
                            onSubmit={(values) => { this.saveNext(values) }}                >
                            {({ errors, touched, values, setFieldTouched, setFieldValue, handleBlur, handleChange }) => (
                                <Form id="voItemForm" className="proForm datepickerContainer customProform" noValidate="novalidate" >
                                    <div className='document-fields'>

                                        <div className="proForm first-proform">
                                            <div className="linebylineInput valid-input">
                                                <label className="control-label">{Resources.constraints[currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.constraints && touched.constraints ? (" has-error") : !errors.constraints && touched.constraints ? (" has-success") : " ")} >
                                                    <input name='constraints' className="form-control fsadfsadsa" id="constraints"
                                                        placeholder={Resources.constraints[currentLanguage]} value={values.constraints}
                                                        autoComplete='off' onChange={handleChange}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} /> {touched.constraints ? (<em className="pError">{errors.constraints}</em>) : null}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="proForm datepickerContainer">

                                            <div className="linebylineInput valid-input">
                                                <Dropdown title="discipline" data={this.state.disciplineData} selectedValue={this.state.selectedDiscplineNext}
                                                    handleChange={event => this.setState({ selectedDiscplineNext: event })}
                                                    onChange={setFieldValue} onBlur={setFieldTouched} error={errors.disciplineId}
                                                    touched={touched.disciplineId} index="disciplineId" name="disciplineId" id="disciplineId" />
                                            </div>

                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources.no[currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.no && touched.no ? (" has-error") : !errors.no && touched.no ? (" has-success") : " ")} >
                                                    <input name='no' className="form-control fsadfsadsa" id="no"
                                                        placeholder={Resources.no[currentLanguage]} value={values.no}
                                                        autoComplete='off' onChange={handleChange}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} /> {touched.no ? (<em className="pError">{errors.no}</em>) : null}
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources.constraintsCode[currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.constraintsCode && touched.constraintsCode ? (" has-error") : !errors.constraintsCode && touched.constraintsCode ? (" has-success") : " ")} >
                                                    <input name='constraintsCode' className="form-control fsadfsadsa" id="constraintsCode"
                                                        placeholder={Resources.constraintsCode[currentLanguage]} value={values.constraintsCode}
                                                        autoComplete='off' onChange={handleChange}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} /> {touched.constraintsCode ? (<em className="pError">{errors.constraintsCode}</em>) : null}
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input alternativeDate">
                                                <DatePicker title='startDate' startDate={this.state.ImplementationSDate}
                                                    handleChange={e => this.setState({ ImplementationSDate: e })} />
                                            </div>

                                            <div className="linebylineInput valid-input alternativeDate">
                                                <DatePicker title='finishDate' startDate={this.state.ImplementationEDate}
                                                    handleChange={e => this.setState({ ImplementationEDate: e })} />
                                            </div>

                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources.firstQuantity[currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.quantityStart && touched.quantityStart ? (" has-error") : !errors.quantityStart && touched.quantityStart ? (" has-success") : " ")} >
                                                    <input name='quantityStart' className="form-control fsadfsadsa" id="quantityStart"
                                                        placeholder={Resources.firstQuantity[currentLanguage]} value={values.quantityStart}
                                                        autoComplete='off' onChange={handleChange}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} /> {touched.quantityStart ? (<em className="pError">{errors.quantityStart}</em>) : null}
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources.doneQuantity[currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.quantityIndexation && touched.quantityIndexation ? (" has-error") : !errors.quantityIndexation && touched.quantityIndexation ? (" has-success") : " ")} >
                                                    <input name='quantityIndexation' className="form-control fsadfsadsa" id="quantityIndexation"
                                                        placeholder={Resources.doneQuantity[currentLanguage]} value={values.quantityIndexation}
                                                        autoComplete='off' onChange={handleChange}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} /> {touched.quantityIndexation ? (<em className="pError">{errors.quantityIndexation}</em>) : null}
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources.predictedQuantity[currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.quantityPredictedDone && touched.quantityPredictedDone ? (" has-error") : !errors.quantityPredictedDone && touched.quantityPredictedDone ? (" has-success") : " ")} >
                                                    <input name='quantityPredictedDone' className="form-control fsadfsadsa" id="quantityPredictedDone"
                                                        placeholder={Resources.predictedQuantity[currentLanguage]} value={values.quantityPredictedDone}
                                                        autoComplete='off' onChange={handleChange}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} /> {touched.quantityPredictedDone ? (<em className="pError">{errors.quantityPredictedDone}</em>) : null}
                                                </div>
                                            </div>


                                            <div className="slider-Btns fullWidthWrapper textLeft ">
                                                <button className={"primaryBtn-1 btn " + (this.props.isViewMode === true ? ' disNone' : '')} type="submit" disabled={this.props.isViewMode} >{Resources["save"][currentLanguage]}</button>
                                            </div>

                                        </div>

                                        <div className="doc-pre-cycle">
                                            <header>
                                                <h2 className="zero">{Resources['nextWeek'][currentLanguage]}</h2>
                                            </header>

                                            <ReactTable
                                                // filterable
                                                ref={(r) => { this.selectTable = r }}
                                                data={this.state.NextRows} noDataText={Resources['noData'][currentLanguage]}
                                                columns={NextColumns} defaultPageSize={10} minRows={2} />
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                        <div className="slider-Btns letterFullWidth">
                            <button type="button" className="primaryBtn-1 btn " onClick={() => this.changeCurrentStep(7)} disabled={this.props.isViewMode} >{Resources["next"][currentLanguage]}</button>
                        </div>
                    </div>
                </div>
            )
        }

        let stepEight = () => {

            let CoordinationTable =
                this.state.tblCoordination.map((item, index) => {
                    return (
                        <tr key={item.key}>

                            <td>
                                <div className="contentCell tableCell-2">
                                    <p>{item.key}</p>
                                </div>
                            </td>

                            <td>
                                <div className="contentCell tableCell-2">
                                    <div className="ui input inputDev " style={{ padding: '7px' }}>
                                        <input type='number' defaultValue={item.CustodyPre} className="form-control "
                                            onChange={(e) => this.handleChangeTable(e.target.value, 'CustodyPre', item.name)} />
                                    </div>
                                </div>
                            </td>

                            <td>
                                <div className="contentCell tableCell-2">
                                    <div className="ui input inputDev " style={{ padding: '7px' }}>
                                        <input type='number' defaultValue={item.CustodyCurrent} className="form-control "
                                            onChange={(e) => this.handleChangeTable(e.target.value, 'CustodyCurrent', item.name)} />
                                    </div>
                                </div>
                            </td>

                            <td>
                                <div className="contentCell tableCell-2">
                                    <div className="ui input inputDev " style={{ padding: '7px' }}>
                                        <input type='number' className="form-control " defaultValue={item.CustodyTotal}
                                            onChange={(e) => this.handleChangeTable(e.target.value, 'CustodyTotal', item.name)} />
                                    </div>
                                </div>
                            </td>

                        </tr>
                    )
                })
            return (
                <div className="step-content">

                    <div className={"subiTabsContent feilds__top " + (this.props.isViewMode ? "readOnly_inputs" : " ")}>

                        <div className='document-fields'>
                            <div className="doc-pre-cycle">
                                <table className="attachmentTable attachmentTableAuto">
                                    <thead>
                                        <tr>

                                            <th>
                                                <div className="headCell tableCell-1">
                                                    <span>  </span>
                                                </div>
                                            </th>

                                            <th>
                                                <div className="headCell tableCell-2">
                                                    <span>{Resources.previous[currentLanguage]} </span>
                                                </div>
                                            </th>

                                            <th>
                                                <div className="headCell tableCell-3">
                                                    <span>{Resources.current[currentLanguage]}</span>
                                                </div>
                                            </th>

                                            <th>
                                                <div className="headCell tableCell-4">
                                                    <span>{Resources.total[currentLanguage]}</span>
                                                </div>
                                            </th>

                                            <th>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {CoordinationTable}
                                    </tbody>
                                </table>
                            </div>
                            <div className="slider-Btns letterFullWidth" style={{ flexFlow: 'row' }}>
                                <button className={"primaryBtn-1 btn " + (this.props.isViewMode === true ? ' disNone' : '')} onClick={() => this.saveCoordination()} disabled={this.props.isViewMode} >{Resources["save"][currentLanguage]}</button>
                            </div>
                            <div className="slider-Btns fullWidthWrapper textLeft ">
                                <button type="button" className="primaryBtn-1 btn " onClick={() => this.changeCurrentStep(8)} disabled={this.props.isViewMode} >{Resources["next"][currentLanguage]}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        let stepNine = () => {

            let MeetingColumns = [
                {
                    Header: Resources['no'][currentLanguage],
                    accessor: 'arrange',
                    width: 50,
                },
                {
                    Header: Resources["action"][currentLanguage],
                    accessor: "id",
                    Cell: ({ row }) => {
                        return (
                            <Fragment>
                                <div className="btn table-btn-tooltip" style={{ marginLeft: "5px" }} onClick={() => this.DeleteMeeting(row._original.id)}>
                                    <i style={{ fontSize: "1.6em" }} className="fa fa-trash-o" />
                                </div>
                            </Fragment>
                        )
                    },
                    width: 80
                },
                {
                    Header: Resources['CompanyName'][currentLanguage],
                    accessor: 'companyName',
                    width: 250,
                },

                {
                    Header: Resources['ContactName'][currentLanguage],
                    accessor: 'contactName',
                    width: 200,
                },

                {
                    Header: Resources["today"][currentLanguage],
                    accessor: "day",
                    width: 120,
                    sortabel: true,
                    Cell: row => (
                        <span>
                            <span>{moment(row.value).format("DD/MM/YYYY")}</span>
                        </span>
                    )
                },
                {
                    Header: Resources['hours'][currentLanguage],
                    accessor: 'hour',
                    width: 100,
                },
            ]

            return (
                <div className="step-content">

                    <div className={"subiTabsContent feilds__top " + (this.props.isViewMode ? "readOnly_inputs" : " ")}>
                        <Formik
                            initialValues={{
                                no: this.state.meetingRows.length + 1,
                                companyId: '',
                                contactId: '',
                                hours: '00:00',
                            }}
                            validationSchema={MeetingSchema}
                            enableReinitialize={true}
                            onSubmit={(values) => { this.saveMeeting(values) }}                >
                            {({ errors, touched, values, setFieldTouched, setFieldValue, handleBlur, handleChange }) => (
                                <Form id="voItemForm" className="proForm datepickerContainer customProform" noValidate="novalidate" >
                                    <div className='document-fields'>

                                        <div className="proForm first-proform">

                                            <div className="linebylineInput valid-input">
                                                <Dropdown title="fromCompany" data={this.state.CompaniesData} selectedValue={this.state.selectedMeetingCompany}
                                                    handleChange={event => this.handleChangeMeetingCompany(event)}
                                                    onChange={setFieldValue} onBlur={setFieldTouched} error={errors.companyId}
                                                    touched={touched.companyId} index="companyId" name="companyId" id="companyId" />
                                            </div>
                                        </div>

                                        <div className="proForm datepickerContainer">

                                            <div className="linebylineInput valid-input">
                                                <Dropdown title="ContactName" data={this.state.contactsMeeting} selectedValue={this.state.selectedMeetingContact}
                                                    handleChange={event => this.setState({ selectedMeetingContact: event })}
                                                    onChange={setFieldValue} onBlur={setFieldTouched} error={errors.contactId}
                                                    touched={touched.contactId} index="contactId" name="contactId" id="contactId" />
                                            </div>

                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources.hours[currentLanguage]}</label>
                                                <div className="inputDev ui input has-success">
                                                    <input name='hours' defaultValue='00:00' className="form-control fsadfsadsa" id="hours"
                                                        placeholder={Resources.hours[currentLanguage]} value={values.hours} autoComplete='off' onChange={handleChange}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} />
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input alternativeDate">
                                                <DatePicker title='today' startDate={this.state.today}
                                                    handleChange={e => this.setState({ today: e })} />
                                            </div>

                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources.no[currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.no && touched.no ? (" has-error") : !errors.no && touched.no ? (" has-success") : " ")} >
                                                    <input name='no' className="form-control fsadfsadsa" id="no"
                                                        placeholder={Resources.no[currentLanguage]} value={values.no}
                                                        autoComplete='off' onChange={handleChange}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} /> {touched.no ? (<em className="pError">{errors.no}</em>) : null}
                                                </div>
                                            </div>

                                            <div className="slider-Btns fullWidthWrapper textLeft ">
                                                <button className={"primaryBtn-1 btn " + (this.props.isViewMode === true ? ' disNone' : '')} type="submit" disabled={this.props.isViewMode} >{Resources["save"][currentLanguage]}</button>
                                            </div>

                                        </div>

                                        <div className="doc-pre-cycle">
                                            <header>
                                                <h2 className="zero">{Resources['meetings'][currentLanguage]}</h2>
                                            </header>

                                            <ReactTable
                                                // filterable
                                                ref={(r) => { this.selectTable = r }}
                                                data={this.state.meetingRows} noDataText={Resources['noData'][currentLanguage]}
                                                columns={MeetingColumns} defaultPageSize={10} minRows={2} />
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                        <div className="slider-Btns letterFullWidth">
                            <button type="button" className="primaryBtn-1 btn " onClick={() => this.changeCurrentStep(9)} disabled={this.props.isViewMode} >{Resources["next"][currentLanguage]}</button>
                        </div>
                    </div>
                </div>
            )
        }

        let stepTen = () => {

            let modificationColumns = [
                {
                    Header: Resources['no'][currentLanguage],
                    accessor: 'arrange',
                    width: 50,
                },
                {
                    Header: Resources["action"][currentLanguage],
                    accessor: "id",
                    Cell: ({ row }) => {
                        return (
                            <Fragment>
                                <div className="btn table-btn-tooltip" style={{ marginLeft: "5px" }} onClick={() => this.DeleteModification(row._original.id)}>
                                    <i style={{ fontSize: "1.6em" }} className="fa fa-trash-o" />
                                </div>
                            </Fragment>
                        )
                    },
                    width: 80
                },
                {
                    Header: Resources['constraints'][currentLanguage],
                    accessor: 'modificationsMethod',
                    width: 150,
                },
                {
                    Header: Resources['CompanyName'][currentLanguage],
                    accessor: 'companyName',
                    width: 250,
                },

                {
                    Header: Resources['ContactName'][currentLanguage],
                    accessor: 'contactName',
                    width: 200,
                },

                {
                    Header: Resources["docDate"][currentLanguage],
                    accessor: "docDate",
                    width: 120,
                    sortabel: true,
                    Cell: row => (
                        <span>
                            <span>{moment(row.value).format("DD/MM/YYYY")}</span>
                        </span>
                    )
                },
                {
                    Header: Resources['constraints'][currentLanguage],
                    accessor: 'modifications',
                    width: 100,
                },
            ]

            return (
                <div className="step-content">

                    <div className={"subiTabsContent feilds__top " + (this.props.isViewMode ? "readOnly_inputs" : " ")}>
                        <Formik
                            initialValues={{
                                no: this.state.ModificationRows.length + 1,
                                companyId: '',
                                contactId: '',
                                constraints: '',
                                modifications: ''
                            }}
                            validationSchema={ModificationSchema}
                            enableReinitialize={true}
                            onSubmit={(values) => { this.saveModification(values) }}                >
                            {({ errors, touched, values, setFieldTouched, setFieldValue, handleBlur, handleChange }) => (
                                <Form id="voItemForm" className="proForm datepickerContainer customProform" noValidate="novalidate" >
                                    <div className='document-fields'>
                                        <div className="proForm datepickerContainer">

                                            <div className="linebylineInput valid-input">
                                                <Dropdown title="fromCompany" data={this.state.CompaniesData} selectedValue={this.state.selectedModificationCompany}
                                                    handleChange={event => this.handleChangeModificationCompany(event)}
                                                    onChange={setFieldValue} onBlur={setFieldTouched} error={errors.companyId}
                                                    touched={touched.companyId} index="companyId" name="companyId" id="companyId" />
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <Dropdown title="ContactName" data={this.state.contactsModification} selectedValue={this.state.selectedModificationContact}
                                                    handleChange={event => this.setState({ selectedModificationContact: event })}
                                                    onChange={setFieldValue} onBlur={setFieldTouched} error={errors.contactId}
                                                    touched={touched.contactId} index="contactId" name="contactId" id="contactId" />
                                            </div>

                                            <div className="linebylineInput valid-input alternativeDate">
                                                <DatePicker title='docDate' startDate={this.state.modificationDate}
                                                    handleChange={e => this.setState({ modificationDate: e })} />
                                            </div>

                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources.no[currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.no && touched.no ? (" has-error") : !errors.no && touched.no ? (" has-success") : " ")} >
                                                    <input name='no' className="form-control fsadfsadsa" id="no"
                                                        placeholder={Resources.no[currentLanguage]} value={values.no}
                                                        autoComplete='off' onChange={handleChange}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} /> {touched.no ? (<em className="pError">{errors.no}</em>) : null}
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources.constraints[currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.constraints && touched.constraints ? (" has-error") : !errors.constraints && touched.constraints ? (" has-success") : " ")} >
                                                    <input name='constraints' className="form-control fsadfsadsa" id="constraints"
                                                        placeholder={Resources.constraints[currentLanguage]} value={values.constraints}
                                                        autoComplete='off' onChange={handleChange}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} /> {touched.constraints ? (<em className="pError">{errors.constraints}</em>) : null}
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources.constraints[currentLanguage]}</label>
                                                <div className="inputDev ui input has-success">
                                                    <input name='modifications' className="form-control fsadfsadsa" id="modifications"
                                                        placeholder={Resources.constraints[currentLanguage]} value={values.modifications} autoComplete='off' onChange={handleChange}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} />
                                                </div>
                                            </div>

                                            <div className="slider-Btns fullWidthWrapper textLeft ">
                                                <button className={"primaryBtn-1 btn " + (this.props.isViewMode === true ? ' disNone' : '')} type="submit" disabled={this.props.isViewMode} >{Resources["save"][currentLanguage]}</button>
                                            </div>

                                        </div>

                                        <div className="doc-pre-cycle">
                                            <header>
                                                <h2 className="zero">{Resources['modifications'][currentLanguage]}</h2>
                                            </header>

                                            <ReactTable
                                                ref={(r) => { this.selectTable = r }}
                                                data={this.state.ModificationRows} noDataText={Resources['noData'][currentLanguage]}
                                                columns={modificationColumns} defaultPageSize={10} minRows={2} />
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                        <div className="slider-Btns letterFullWidth">
                            <button type="button" className="primaryBtn-1 btn " onClick={() => this.changeCurrentStep(10)} disabled={this.props.isViewMode} >{Resources["next"][currentLanguage]}</button>
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div className="mainContainer">

                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document one__tab one_step readOnly_inputs" : "documents-stepper noTabs__document one__tab one_step"}>
                    <HeaderDocument projectName={projectName} isViewMode={this.state.isViewMode} perviousRoute={this.state.perviousRoute}
                        docTitle={Resources.weeklyReport[currentLanguage]} moduleTitle={Resources["technicalOffice"][currentLanguage]} />
                    <div className="doc-container">
                        <div className="step-content">
                            {this.props.changeStatus == true ? (
                                <header className="main__header">
                                    <div className="main__header--div">
                                        <h2 className="zero"> {" "}  {Resources.goEdit[currentLanguage]}{" "}</h2>
                                        <p className="doc-infohead">
                                            <span>{" "}{this.state.document.refDoc}</span>{" "} -{" "}<span>{" "}{this.state.document.arrange} </span>{" "}-{" "}
                                            <span> {moment(this.state.document.docDate).format("DD/MM/YYYY")} </span>
                                        </p>
                                    </div>
                                </header>
                            ) : null}
                            {this.state.isLoading ? <LoadingSection /> : null}
                            {this.state.CurrentStep === 0 ? <Fragment>{stepOne()}</Fragment> :
                                this.state.CurrentStep === 1 ? <Fragment> {stepTwo()}</Fragment> :
                                    this.state.CurrentStep === 2 ? <Fragment> {stepThree()}</Fragment> :
                                        this.state.CurrentStep === 3 ? <Fragment> {stepFour()}</Fragment> :
                                            this.state.CurrentStep === 4 ? <Fragment> {stepFive()}</Fragment> :
                                                this.state.CurrentStep === 5 ? <Fragment> {stepSex()}</Fragment> :
                                                    this.state.CurrentStep === 6 ? <Fragment> {stepSeven()}</Fragment> :
                                                        this.state.CurrentStep === 7 ? <Fragment> {stepEight()}</Fragment> :
                                                            this.state.CurrentStep === 8 ? <Fragment> {stepNine()}</Fragment> :
                                                                <Fragment> {stepTen()}</Fragment>}
                        </div>

                        <Fragment>
                            <Steps
                                steps_defination={steps_defination}
                                exist_link="/weeklyReport/"
                                docId={this.state.docId}
                                changeCurrentStep={stepNo =>
                                    this.changeCurrentStep(stepNo)
                                }
                                stepNo={this.state.CurrentStep}
                            />
                        </Fragment>

                    </div>
                </div>


                {this.state.showDeleteModal == true ? (
                    <ConfirmationModal
                        title={Resources["smartDeleteMessage"][currentLanguage].content}
                        closed={e => this.setState({ showDeleteModal: false })}
                        showDeleteModal={this.state.showDeleteModal}
                        clickHandlerCancel={e => this.setState({ showDeleteModal: false })}
                        buttonName="delete"
                        clickHandlerContinue={this.ConfirmationDelete}
                    />
                ) : null}
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        document: state.communication.document,
        isLoading: state.communication.isLoading,
        changeStatus: state.communication.changeStatus,
        hasWorkflow: state.communication.hasWorkflow,
        projectId: state.communication.projectId,
        showModal: state.communication.showModal
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(weeklyReportsAddEdit))