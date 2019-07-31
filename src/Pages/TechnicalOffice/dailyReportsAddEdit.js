import React, { Component, Fragment } from "react";

import OptionContainer from "../../Componants/OptionsPanels/OptionContainer";
import { Formik, Form, Field } from "formik";
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
import Distribution from "../../Componants/OptionsPanels/DistributionList";
import SendToWorkflow from "../../Componants/OptionsPanels/SendWorkFlow";
import DocumentApproval from "../../Componants/OptionsPanels/wfApproval";
import DatePicker from "../../Componants/OptionsPanels/DatePicker";
import { toast } from "react-toastify";
import HeaderDocument from "../../Componants/OptionsPanels/HeaderDocument";
import Api from "../../api";
import ReactTable from "react-table";
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
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

var steps_defination = [];
steps_defination = [
    { name: "dailyReports", callBackFn: null },
    { name: "items", callBackFn: null }
];

const validationSchema = Yup.object().shape({
    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),
    companyId: Yup.string().required(Resources['selectCompany'][currentLanguage]),
    arrange: Yup.number().required(Resources['selectNumber'][currentLanguage]).typeError(Resources['onlyNumbers'][currentLanguage]),
});

const WorkActivitySchema = Yup.object().shape({
    details: Yup.string().required(Resources['descriptionRequired'][currentLanguage]),
    arrange: Yup.number().required(Resources['selectNumber'][currentLanguage]).typeError(Resources['onlyNumbers'][currentLanguage]),
});

const FieldForceSchema = Yup.object().shape({
    fieldForceId: Yup.string().required(Resources['selectFieldForce'][currentLanguage]),
    disciplineId: Yup.string().required(Resources['disciplineRequired'][currentLanguage]),
    area: Yup.string().required(Resources['areaRequired'][currentLanguage]),
    arrange: Yup.number().required(Resources['selectNumber'][currentLanguage]).typeError(Resources['onlyNumbers'][currentLanguage]),
    amount: Yup.number().typeError(Resources['onlyNumbers'][currentLanguage]),
});

const MaterialSchema = Yup.object().shape({
    description: Yup.string().required(Resources['descriptionRequired'][currentLanguage]),
    companyId: Yup.string().required(Resources['selectCompany'][currentLanguage]),
    arrange: Yup.number().required(Resources['selectNumber'][currentLanguage]).typeError(Resources['onlyNumbers'][currentLanguage]),
    areaId: Yup.string().required(Resources['areaRequired'][currentLanguage]),
    unitId: Yup.string().required(Resources['unitSelection'][currentLanguage]),
    quantity: Yup.number().required(Resources['quantityRequired'][currentLanguage]).typeError(Resources['onlyNumbers'][currentLanguage]),
});

const EquipmentSchema = Yup.object().shape({
    description: Yup.string().required(Resources['descriptionRequired'][currentLanguage]),
    companyId: Yup.string().required(Resources['selectCompany'][currentLanguage]),
    arrange: Yup.number().required(Resources['selectNumber'][currentLanguage]).typeError(Resources['onlyNumbers'][currentLanguage]),
    areaId: Yup.string().required(Resources['areaRequired'][currentLanguage]),
    equipmentunitId: Yup.string().required(Resources['unitSelection'][currentLanguage]),
    equipmenttypeId: Yup.string().required(Resources['equipmentTypeSelection'][currentLanguage]),
    quantity: Yup.number().required(Resources['quantityRequired'][currentLanguage]).typeError(Resources['onlyNumbers'][currentLanguage]),
});

const VisitorsSchema = Yup.object().shape({
    companyId: Yup.string().required(Resources['selectCompany'][currentLanguage]),
    contactId: Yup.string().required(Resources['fromContactRequired'][currentLanguage]),
    arrange: Yup.number().required(Resources['selectNumber'][currentLanguage]).typeError(Resources['onlyNumbers'][currentLanguage]),
});

const WeatherSchema = Yup.object().shape({
    weatherId: Yup.string().required(Resources['fromToRequired'][currentLanguage]),
    fromToId: Yup.string().required(Resources['selectWeather'][currentLanguage]),
    arrange: Yup.number().required(Resources['selectNumber'][currentLanguage]).typeError(Resources['onlyNumbers'][currentLanguage]),
});


class dailyReportsAddEdit extends Component {

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
            currentTitle: "sendToWorkFlow",
            showModal: false,
            isViewMode: false,
            isApproveMode: isApproveMode,
            perviousRoute: perviousRoute,
            isView: false,
            docId: docId,
            docTypeId: 60,
            projectId: projectId,
            docApprovalId: docApprovalId,
            arrange: arrange,
            document: this.props.document ? Object.assign({}, this.props.document) : {},
            permission: [
                { name: "sendByEmail", code: 271 }, { name: "sendByInbox", code: 270 },
                { name: "sendTask", code: 0 }, { name: "distributionList", code: 990 },
                { name: "createTransmittal", code: 3076 }, { name: "sendToWorkFlow", code: 737 },
                { name: "viewAttachments", code: 3309 }, { name: "deleteAttachments", code: 900 }
            ],
            disciplineData: [],
            areaData: [],
            fieldForceData: [],
            selectedCompany: { label: Resources.selectCompany[currentLanguage], value: "0" },
            CompaniesData: [],
            unitData: [],
            BtnLoading: false,
            EditMood: false,
            activeTab: "workActivity",
            workActivityObj: {},
            WorkActivityRows: [],
            workActivityId: '',
            functionDeleteName: '',
            selectedAreaForce: { label: Resources.areaRequired[currentLanguage], value: "0" },
            selectedDiscplineForce: { label: Resources.disciplineRequired[currentLanguage], value: "0" },
            selectedFieldForce: { label: Resources.selectFieldForce[currentLanguage], value: "0" },
            fieldForceRows: [],
            fieldForceId: '',
            fieldForceArrange: '1',
            selectedCompanyMaterial: { label: Resources.selectCompany[currentLanguage], value: "0" },
            selectedAreaMaterial: { label: Resources.areaRequired[currentLanguage], value: "0" },
            selectedUnitMaterial: { label: Resources.unitSelection[currentLanguage], value: "0" },
            materialRows: [],
            materialId: '',
            materialArrange: '1',
            selectedCompanyEquipment: { label: Resources.selectCompany[currentLanguage], value: "0" },
            selectedAreaEquipment: { label: Resources.areaRequired[currentLanguage], value: "0" },
            selectedUnitEquipment: { label: Resources.unitSelection[currentLanguage], value: "0" },
            selectedEquipment: { label: Resources.equipmentTypeSelection[currentLanguage], value: "0" },
            equipmentRows: [],
            equipmentData: [],
            equipmentId: '',
            equipmentArrange: '1',
            dueBack: moment(),
            visitorsRows: [],
            visitorsId: '',
            visitorsArrange: '1',
            contactsVisitors: [],
            selectedVisitorsCompany: { label: Resources.selectCompany[currentLanguage], value: "0" },
            selectedVisitorsContact: { label: Resources.fromContactRequired[currentLanguage], value: "0" },
            selectedWeather: { label: Resources.selectWeather[currentLanguage], value: "0" },
            selectedFromTo: { label: Resources.fromToRequired[currentLanguage], value: "0" },
            weatherRows: [],
            weatherId: '',
            weatherArrange: '1',
            weatherData: [],
            fromToData: [],
        };

        if (!Config.IsAllow(265) && !Config.IsAllow(266) && !Config.IsAllow(268)) {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push(this.state.perviousRoute);
        }
    }

    saveAndExit(event) {
        if (this.state.CurrentStep === 1) { this.setState({ CurrentStep: this.state.CurrentStep + 1 }) }
        else { this.props.history.push("/dailyReports/" + this.state.projectId) }
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
            Config.IsAllow(3309) === true ?
                (<ViewAttachment docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} deleteAttachments={854} />) : null) : null;
    }

    componentWillMount() {
        if (this.state.docId > 0) {
            let url = "GetLogsDailyReportsForEdit?id=" + this.state.docId;
            this.props.actions.documentForEdit(url, this.state.docTypeId, 'dailyReports')
        }
        else {
            dataservice.GetNextArrangeMainDocument('GetNextArrangeMainDoc?projectId=' + projectId + '&docType=' + this.state.docTypeId + '&companyId=undefined&contactId=undefined').then(
                res => {
                    const Document = {
                        projectId: projectId, arrange: res, status: "true", subject: "",
                        docDate: moment(), companyId: '', companyId: '',
                    }
                    this.setState({ document: Document })
                }
            )
            this.fillDropDowns(false);
            this.props.actions.documentForAdding();
        }
    }

    fillDropDowns(isEdit) {
        dataservice.GetDataList('GetProjectProjectsCompaniesForList?projectId= ' + this.state.projectId, 'companyName', 'companyId').then(result => {
            if (isEdit) {
                let id = this.props.document.companyId;
                let selectedValue = {};
                if (id) {
                    selectedValue = _.find(result, function (i) { return i.value === id });
                    this.setState({ selectedCompany: selectedValue })
                }
            }
            this.setState({ CompaniesData: [...result] })
        })
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
        //alert('recieve....' + this.state.showModal + '.....' + nextProps.showModal);
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
            if (!Config.IsAllow(266)) {
                this.setState({ isViewMode: true })
            }
            if (this.state.isApproveMode != true && Config.IsAllow(266)) {
                if (this.props.hasWorkflow == false && Config.IsAllow(266)) {
                    if (this.props.document.status !== false && Config.IsAllow(266)) {
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

    executeBeforeModalClose = (e) => {
        this.setState({ showModal: false });
    }

    handleChangeDropDown(event, field, selectedValue) {
        if (event == null) return
        let original_document = { ...this.state.document }
        let updated_document = {};
        updated_document[field] = event.value;
        updated_document = Object.assign(original_document, updated_document);
        this.setState({ document: updated_document, [selectedValue]: event })
    }

    componentDidMount() {
        this.checkDocumentIsView();

        if (this.state.docId !== 0) {

            dataservice.GetDataGrid('GetLogsDailyReportsWorkActivity?reportId=' + this.state.docId).then(result => {
                result.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
                this.GetNextArrangeWorkActivity();
                this.setState({ WorkActivityRows: result });
            });

            dataservice.GetDataGrid('GetLogsDailyReportsFieldForce?reportId=' + this.state.docId).then(result => {
                result.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
                this.GetNextArrangeFieldForce();
                this.setState({ fieldForceRows: result });
            });

            dataservice.GetDataGrid('GetLogsDailyReportsMaterial?reportId=' + this.state.docId).then(result => {
                result.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
                this.GetNextArrangeMaterial();
                this.setState({ materialRows: result });
            });
            dataservice.GetDataGrid('GetLogsDailyReportsEquipment?reportId=' + this.state.docId).then(result => {
                result.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
                this.GetNextArrangeEquipment();
                this.setState({ equipmentRows: result });
            });

            dataservice.GetDataGrid('GetLogsDailyReportsVisitors?reportId=' + this.state.docId).then(result => {
                result.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
                this.GetNextArrangeVisitors();
                this.setState({ visitorsRows: result });
            });

            dataservice.GetDataGrid('GetLogsDailyReportsWeather?reportId=' + this.state.docId).then(result => {
                result.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
                this.GetNextArrangeWeather();
                this.setState({ weatherRows: result });
            });
        }
        else {
            this.setState({ EditMood: false });
        }

        dataservice.GetDataList('GetAccountsDefaultList?listType=discipline&pageNumber=0&pageSize=10000', 'title', 'id').then(result => {
            this.setState({ disciplineData: result });
        });
        dataservice.GetDataList('GetAccountsDefaultList?listType=area&pageNumber=0&pageSize=10000', 'title', 'id').then(result => {
            this.setState({ areaData: result });
        });
        dataservice.GetDataList('GetAccountsDefaultList?listType=fieldforce&pageNumber=0&pageSize=10000', 'title', 'id').then(result => {
            this.setState({ fieldForceData: result });
        });
        dataservice.GetDataList('GetAccountsDefaultList?listType=unit&pageNumber=0&pageSize=10000', 'title', 'id').then(result => {
            this.setState({ unitData: result });
        });
        dataservice.GetDataList('GetAccountsDefaultList?listType=equipmenttype&pageNumber=0&pageSize=10000', 'title', 'id').then(result => {
            this.setState({ equipmentData: result });
        });
        dataservice.GetDataList('GetAccountsDefaultList?listType=weather&pageNumber=0&pageSize=10000', 'title', 'id').then(result => {
            this.setState({ weatherData: result });
        });
        dataservice.GetDataList('GetAccountsDefaultList?listType=weatherfromto&pageNumber=0&pageSize=10000', 'title', 'id').then(result => {
            this.setState({ fromToData: result });
        });
    }

    SaveDoc = (Mood) => {
        this.setState({ isLoading: true, IsAddMood: false })
        if (Mood === 'EditMood') {
            let doc = { ...this.state.document };
            doc.docDate = moment(doc.docDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");
            dataservice.addObject('EditLogsDailyReports', doc).then(result => {
                this.setState({ isLoading: false, IsAddMood: true })
                toast.success(Resources["operationSuccess"][currentLanguage])

            }).catch(ex => {
                this.setState({ Loading: false })
                toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
            })
        } else {
            let doc = { ...this.state.document };
            doc.docDate = moment(doc.docDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");
            dataservice.addObject('AddLogsDailyReports', doc).then(result => {
                this.setState({ isLoading: false, docId: result.id, IsAddMood: true });
                toast.success(Resources["operationSuccess"][currentLanguage]);
                this.GetNextArrangeWorkActivity();
            }).catch(ex => {
                this.setState({ Loading: false })
                toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
            })
        }

    }

    changeTab = tabName => {
        this.setState({ activeTab: tabName });
    };

    handleChangeworkActivity = (e, field) => {
        let original_document = { ...this.state.workActivityObj };
        let updated_document = {}
        updated_document[field] = e.target.value;
        updated_document = Object.assign(original_document, updated_document);
        this.setState({ workActivityObj: updated_document })
    }

    GetNextArrangeWorkActivity = () => {
        dataservice.GetNextArrangeMainDocument('GetNextArrangeDailyItems?dailyDocId=' + this.state.docId + '&docType=' + this.state.docTypeId + '&tabId=1').then(result => {
            let workActivityObj = { details: '', status: true, arrange: result, dailyReportId: this.state.docId };
            this.setState({ workActivityObj });
        });
    }

    GetNextArrangeFieldForce = () => {
        dataservice.GetNextArrangeMainDocument('GetNextArrangeDailyItems?dailyDocId=' + this.state.docId + '&docType=' + this.state.docTypeId + '&tabId=2').then(result => {
            this.setState({ fieldForceArrange: result });
        });
    }

    GetNextArrangeMaterial = () => {
        dataservice.GetNextArrangeMainDocument('GetNextArrangeDailyItems?dailyDocId=' + this.state.docId + '&docType=' + this.state.docTypeId + '&tabId=3').then(result => {
            this.setState({ materialArrange: result });
        });
    }

    GetNextArrangeEquipment = () => {
        dataservice.GetNextArrangeMainDocument('GetNextArrangeDailyItems?dailyDocId=' + this.state.docId + '&docType=' + this.state.docTypeId + '&tabId=4').then(result => {
            this.setState({ equipmentArrange: result });
        });
    }

    GetNextArrangeVisitors = () => {
        dataservice.GetNextArrangeMainDocument('GetNextArrangeDailyItems?dailyDocId=' + this.state.docId + '&docType=' + this.state.docTypeId + '&tabId=5').then(result => {
            this.setState({ visitorsArrange: result });
        });
    }

    GetNextArrangeWeather = () => {
        dataservice.GetNextArrangeMainDocument('GetNextArrangeDailyItems?dailyDocId=' + this.state.docId + '&docType=' + this.state.docTypeId + '&tabId=6').then(result => {
            this.setState({ weatherArrange: result });
        });
    }

    saveWorkActivity = (values) => {
        this.setState({ isLoading: true })
        dataservice.addObject('AddLogsDailyReportsWorkActivity', this.state.workActivityObj).then(result => {
            let WorkActivityRows = this.state.WorkActivityRows;
            WorkActivityRows.push(result);
            this.setState({ isLoading: false, WorkActivityRows });
            toast.success(Resources["operationSuccess"][currentLanguage]);
            this.GetNextArrangeWorkActivity();
        }).catch(ex => {
            this.setState({ isLoading: false });
            toast.error(Resources['operationCanceled'][currentLanguage].successTitle);
        });
    }

    ConfirmationDelete = () => {
        switch (this.state.functionDeleteName) {
            case 'DeleteWorkActivity':
                this.ConfirmationDeleteWorkActivity();
                break;

            case 'DeleteFieldForce':
                this.ConfirmationDeleteFieldForce();
                break;

            case 'DeleteMaterial':
                this.ConfirmationDeleteMaterial();
                break;

            case 'DeleteEquipment':
                this.ConfirmationDeleteEquipment();
                break;

            case 'DeleteVisitors':
                this.ConfirmationDeleteVisitors();
                break;
            case 'DeleteWeather':
                this.ConfirmationDeleteWeather();
                break;
            default:
                break;
        }
    }

    DeleteWorkActivity = (id) => {
        this.setState({ workActivityId: id, showDeleteModal: true, functionDeleteName: 'DeleteWorkActivity' });
    }

    ConfirmationDeleteWorkActivity = () => {
        this.setState({ isLoading: true });
        dataservice.GetDataGridPost('DeleteLogsDailyReportsWorkActivity?id=' + this.state.workActivityId).then(
            result => {
                let WorkActivityRows = this.state.WorkActivityRows.filter(i => i.id !== this.state.workActivityId);
                WorkActivityRows.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
                this.setState({ WorkActivityRows, showDeleteModal: false, isLoading: false });
                toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)
            }).catch(ex => {
                this.setState({ showDeleteModal: false, isLoading: false, });
                toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
            });
    }

    saveFieldForce = (values) => {
        this.setState({ isLoading: true })
        let obj = {
            dailyReportId: this.state.docId,
            fieldForceId: this.state.selectedFieldForce.value,
            disciplineId: this.state.selectedDiscplineForce.value,
            area: this.state.selectedAreaForce.value,
            arrange: values.arrange, amount: values.amount
        }
        dataservice.addObject('AddLogsDailyReportsFieldForce', obj).then(result => {
            let fieldForceRows = this.state.fieldForceRows;
            fieldForceRows.push(result);
            values.amount = ''
            this.setState({
                isLoading: false,
                fieldForceRows,
                selectedAreaForce: { label: Resources.areaRequired[currentLanguage], value: "0" },
                selectedDiscplineForce: { label: Resources.disciplineRequired[currentLanguage], value: "0" },
                selectedFieldForce: { label: Resources.selectFieldForce[currentLanguage], value: "0" },
            });
            toast.success(Resources["operationSuccess"][currentLanguage]);
            this.GetNextArrangeFieldForce();
        }).catch(ex => {
            this.setState({ isLoading: false });
            toast.error(Resources['operationCanceled'][currentLanguage].successTitle);
        });
    }

    DeleteFieldForce = (id) => {
        this.setState({ fieldForceId: id, showDeleteModal: true, functionDeleteName: 'DeleteFieldForce' });
    }

    ConfirmationDeleteFieldForce = () => {
        this.setState({ isLoading: true });
        dataservice.GetDataGridPost('DeleteLogsDailyReportsFieldForce?id=' + this.state.fieldForceId).then(
            result => {
                let fieldForceRows = this.state.fieldForceRows.filter(i => i.id !== this.state.fieldForceId);
                fieldForceRows.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
                this.setState({ fieldForceRows, showDeleteModal: false, isLoading: false });
                toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)
            }).catch(ex => {
                this.setState({ showDeleteModal: false, isLoading: false, });
                toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
            });
    }

    DeleteMaterial = (id) => {
        this.setState({ materialId: id, showDeleteModal: true, functionDeleteName: 'DeleteMaterial' });
    }

    ConfirmationDeleteMaterial = () => {
        this.setState({ isLoading: true });
        dataservice.GetDataGridPost('DeleteLogsDailyReportsMaterial?id=' + this.state.materialId).then(
            result => {
                let materialRows = this.state.materialRows.filter(i => i.id !== this.state.materialId);
                materialRows.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
                this.setState({ materialRows, showDeleteModal: false, isLoading: false });
                toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)
            }).catch(ex => {
                this.setState({ showDeleteModal: false, isLoading: false, });
                toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
            });
    }

    saveMaterial = (values) => {
        this.setState({ isLoading: true })
        let obj = {
            dailyReportId: this.state.docId,
            companyId: this.state.selectedCompanyMaterial.value,
            areaId: this.state.selectedAreaMaterial.value,
            unitId: this.state.selectedUnitMaterial.value,
            arrange: values.arrange, quantity: values.quantity,
            remarks: values.remarks, description: values.description,
            deliveryTime: values.deliveryTime
        };
        dataservice.addObject('AddLogsDailyReportsMaterial', obj).then(result => {
            let materialRows = this.state.materialRows;
            materialRows.push(result);
            values.amount = ''
            this.setState({
                isLoading: false,
                materialRows,
                selectedCompanyMaterial: { label: Resources.selectCompany[currentLanguage], value: "0" },
                selectedAreaMaterial: { label: Resources.areaRequired[currentLanguage], value: "0" },
                selectedUnitMaterial: { label: Resources.unitSelection[currentLanguage], value: "0" },
            });
            toast.success(Resources["operationSuccess"][currentLanguage]);
            this.GetNextArrangeMaterial();
        }).catch(ex => {
            this.setState({ isLoading: false });
            toast.error(Resources['operationCanceled'][currentLanguage].successTitle);
        });
    }

    saveEquipment = (values) => {
        this.setState({ isLoading: true })
        let obj = {
            dailyReportId: this.state.docId,
            companyId: this.state.selectedCompanyEquipment.value,
            areaId: this.state.selectedAreaEquipment.value,
            equipmentunitId: this.state.selectedUnitEquipment.value,
            equipmenttypeId: this.state.selectedEquipment.value,
            arrange: values.arrange, quantity: values.quantity,
            description: values.description,
            dueBack: moment(this.state.dueBack, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS"),
        };
        dataservice.addObject('AddLogsDailyReportsEquipment', obj).then(result => {
            let equipmentRows = this.state.equipmentRows;
            equipmentRows.push(result);
            values.description = ''
            values.quantity = ''

            this.setState({
                isLoading: false,
                dueBack: moment(),
                equipmentRows,
                selectedCompanyEquipment: { label: Resources.selectCompany[currentLanguage], value: "0" },
                selectedAreaEquipment: { label: Resources.areaRequired[currentLanguage], value: "0" },
                selectedUnitEquipment: { label: Resources.unitSelection[currentLanguage], value: "0" },
                selectedEquipment: { label: Resources.equipmentTypeSelection[currentLanguage], value: "0" },
            });
            toast.success(Resources["operationSuccess"][currentLanguage]);
            this.GetNextArrangeEquipment();
        }).catch(ex => {
            this.setState({ isLoading: false });
            toast.error(Resources['operationCanceled'][currentLanguage].successTitle);
        });
    }

    DeleteEquipment = (id) => {
        this.setState({ equipmentId: id, showDeleteModal: true, functionDeleteName: 'DeleteEquipment' });
    }

    ConfirmationDeleteEquipment = () => {
        this.setState({ isLoading: true });
        dataservice.GetDataGridPost('DeleteLogsDailyReportsEquipment?id=' + this.state.equipmentId).then(
            result => {
                let equipmentRows = this.state.equipmentRows.filter(i => i.id !== this.state.equipmentId);
                equipmentRows.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
                this.setState({ equipmentRows, showDeleteModal: false, isLoading: false });
                toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)
            }).catch(ex => {
                this.setState({ showDeleteModal: false, isLoading: false, });
                toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
            });
    }

    selectedVisitorsCompany = (value) => {
        if (value) {
            this.setState({ selectedVisitorsCompany: value });
            let action = 'GetContactsByCompanyId?companyId=' + value.value
            dataservice.GetDataList(action, 'contactName', 'id').then(result => {
                this.setState({ contactsVisitors: result });
            });
        }
    }

    saveVisitors = (values) => {
        this.setState({ isLoading: true })
        let obj = {
            dailyReportId: this.state.docId,
            companyId: this.state.selectedVisitorsCompany.value,
            contactId: this.state.selectedVisitorsContact.value,
            arrange: values.arrange,
            time: values.time,
            remarks: values.remarks,
        };
        dataservice.addObject('AddLogsDailyReportsVisitors', obj).then(result => {
            let visitorsRows = this.state.visitorsRows;
            visitorsRows.push(result);
            values.time = ''
            values.remarks = ''

            this.setState({
                isLoading: false,
                visitorsRows,
                selectedVisitorsCompany: { label: Resources.selectCompany[currentLanguage], value: "0" },
                selectedVisitorsContact: { label: Resources.fromContactRequired[currentLanguage], value: "0" },
            });
            toast.success(Resources["operationSuccess"][currentLanguage]);
            this.GetNextArrangeVisitors();
        }).catch(ex => {
            this.setState({ isLoading: false });
            toast.error(Resources['operationCanceled'][currentLanguage].successTitle);
        });
    }

    DeleteVisitors = (id) => {
        this.setState({ visitorsId: id, showDeleteModal: true, functionDeleteName: 'DeleteVisitors' });
    }

    ConfirmationDeleteVisitors = () => {
        this.setState({ isLoading: true });
        dataservice.GetDataGridPost('DeleteLogsDailyReportsVisitors?id=' + this.state.visitorsId).then(
            result => {
                let visitorsRows = this.state.visitorsRows.filter(i => i.id !== this.state.visitorsId);
                visitorsRows.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
                this.setState({ visitorsRows, showDeleteModal: false, isLoading: false });
                toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)
            }).catch(ex => {
                this.setState({ showDeleteModal: false, isLoading: false, });
                toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
            });
    }

    DeleteWeather = (id) => {
        this.setState({ weatherId: id, showDeleteModal: true, functionDeleteName: 'DeleteWeather' });
    }

    ConfirmationDeleteWeather = () => {
        this.setState({ isLoading: true });
        dataservice.GetDataGridPost('DeleteLogsDailyReportsWeather?id=' + this.state.weatherId).then(
            result => {
                let weatherRows = this.state.weatherRows.filter(i => i.id !== this.state.weatherId);
                weatherRows.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
                this.setState({ weatherRows, showDeleteModal: false, isLoading: false });
                toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle);
            }).catch(ex => {
                this.setState({ showDeleteModal: false, isLoading: false, });
                toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
            });
    }

    saveWeather = (values) => {
        this.setState({ isLoading: true });
        let obj = {
            dailyReportId: this.state.docId,
            weatherId: this.state.selectedWeather.value,
            fromToId: this.state.selectedFromTo.value,
            arrange: values.arrange,
        };
        dataservice.addObject('AddLogsDailyReportsWeather', obj).then(result => {
            let weatherRows = this.state.weatherRows;
            weatherRows.push(result);
            this.setState({
                isLoading: false,
                weatherRows,
                selectedWeather: { label: Resources.selectWeather[currentLanguage], value: "0" },
                selectedFromTo: { label: Resources.fromToRequired[currentLanguage], value: "0" },
            });
            toast.success(Resources["operationSuccess"][currentLanguage]);
            this.GetNextArrangeWeather();
        }).catch(ex => {
            this.setState({ isLoading: false });
            toast.error(Resources['operationCanceled'][currentLanguage].successTitle);
        });
    }

    changeCurrentStep = stepNo => {
        this.setState({ CurrentStep: stepNo });
    };
    render() {

        let actions = [
            { title: "distributionList", value: (<Distribution docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />), label: Resources["distributionList"][currentLanguage] },
            { title: "sendToWorkFlow", value: (<SendToWorkflow docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />), label: Resources["sendToWorkFlow"][currentLanguage] },
            { title: "documentApproval", value: (<DocumentApproval docTypeId={this.state.docTypeId} docId={this.state.docId} previousRoute={this.state.perviousRoute} approvalStatus={true} projectId={this.state.projectId} docApprovalId={this.state.docApprovalId} currentArrange={this.state.arrange} />), label: Resources["documentApproval"][currentLanguage] },
            { title: "documentApproval", value: (<DocumentApproval docTypeId={this.state.docTypeId} docId={this.state.docId} previousRoute={this.state.perviousRoute} approvalStatus={false} projectId={this.state.projectId} docApprovalId={this.state.docApprovalId} currentArrange={this.state.arrange} />), label: Resources["documentApproval"][currentLanguage] }
        ];

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

                                    <div className="linebylineInput valid-input">
                                        <Dropdown title="CompanyName" data={this.state.CompaniesData} selectedValue={this.state.selectedCompany}
                                            handleChange={event => this.handleChangeDropDown(event, "companyId", "selectedCompany")}
                                            onChange={setFieldValue} onBlur={setFieldTouched} error={errors.companyId}
                                            touched={touched.companyId} index="companyId" name="companyId" id="companyId" />
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
                                                <button className={this.state.isViewMode === true ? "primaryBtn-1 btn middle__btn disNone" : "primaryBtn-1 btn middle__btn"} >{Resources.save[currentLanguage]}</button>
                                            }
                                            {this.state.isApproveMode === true ?
                                                <div >
                                                    <button className="primaryBtn-1 btn " type="button" onClick={(e) => this.handleShowAction(actions[2])} >{Resources.approvalModalApprove[currentLanguage]}</button>
                                                    <button className="primaryBtn-2 btn middle__btn" type="button" onClick={(e) => this.handleShowAction(actions[3])} >{Resources.approvalModalReject[currentLanguage]}</button>
                                                </div>
                                                : null}
                                            <button type="button" className="primaryBtn-2 btn middle__btn" onClick={(e) => this.handleShowAction(actions[1])}>{Resources.sendToWorkFlow[currentLanguage]}</button>
                                            <button type="button" className="primaryBtn-2 btn" onClick={(e) => this.handleShowAction(actions[0])}>{Resources.distributionList[currentLanguage]}</button>
                                            <span className="border"></span>
                                            <div className="document__action--menu">
                                                <OptionContainer permission={this.state.permission} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                            </div>
                                        </div>
                                    </div>
                                    : null}

                                <div className="doc-pre-cycle letterFullWidth">
                                    <div>
                                        {this.state.docId > 0 ?
                                            <UploadAttachment changeStatus={this.props.changeStatus} AddAttachments={899} EditAttachments={3264} ShowDropBox={3587}
                                                ShowGoogleDrive={3588} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
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
                <Fragment>
                    <div className="company__total proForm">
                        <ul id="stepper__tabs" className="data__tabs">
                            <li className={" data__tabs--list " + (this.state.activeTab == "workActivity" ? "active" : "")} onClick={() => this.changeTab("workActivity")}>
                                {Resources.workActivity[currentLanguage]}
                            </li>
                            <li className={"data__tabs--list " + (this.state.activeTab == "fieldForce" ? "active" : "")} onClick={() => this.changeTab("fieldForce")}>
                                {Resources.fieldForce[currentLanguage]}
                            </li>
                            <li className={" data__tabs--list " + (this.state.activeTab == "material" ? "active" : "")} onClick={() => this.changeTab("material")}>
                                {Resources.material[currentLanguage]}
                            </li>
                            <li className={"data__tabs--list " + (this.state.activeTab == "equipment" ? "active" : "")} onClick={() => this.changeTab("equipment")}>
                                {Resources.equipment[currentLanguage]}
                            </li>
                            <li className={" data__tabs--list " + (this.state.activeTab == "visitors" ? "active" : "")} onClick={() => this.changeTab("visitors")}>
                                {Resources.visitors[currentLanguage]}
                            </li>
                            <li className={"data__tabs--list " + (this.state.activeTab == "weather" ? "active" : "")} onClick={() => this.changeTab("weather")}>
                                {Resources.weather[currentLanguage]}
                            </li>
                        </ul>
                    </div>
                    <Fragment>
                        {this.state.activeTab == "workActivity" ? (<Fragment>{workActivityTab()}</Fragment>) : null}
                        {this.state.activeTab == "fieldForce" ? (<Fragment>{fieldForceTab()}</Fragment>) : null}
                        {this.state.activeTab == "material" ? (<Fragment>{materialTab()}</Fragment>) : null}
                        {this.state.activeTab == "equipment" ? (<Fragment>{equipmentTab()}</Fragment>) : null}
                        {this.state.activeTab == "visitors" ? (<Fragment>{visitorsTab()}</Fragment>) : null}
                        {this.state.activeTab == "weather" ? (<Fragment>{weatherTab()}</Fragment>) : null}

                    </Fragment>
                    <div className="doc-pre-cycle letterFullWidth">
                        <div className="precycle-grid">
                            <div className="slider-Btns">
                                <button className="primaryBtn-1 btn meduimBtn " type="button" onClick={() =>  this.changeCurrentStep(2)}>
                                    {Resources.next[currentLanguage]}
                                </button>
                            </div>
                        </div>
                    </div>
                </Fragment>
            )
        }

        let workActivityTab = () => {

            let columns = [
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
                                <div className="btn table-btn-tooltip" style={{ marginLeft: "5px" }} onClick={() => this.DeleteWorkActivity(row._original.id)}>
                                    <i style={{ fontSize: "1.6em" }} className="fa fa-trash-o" />
                                </div>
                            </Fragment>
                        )
                    },
                    width: 120
                },
                {
                    Header: Resources['description'][currentLanguage],
                    accessor: 'details',
                    width: 250,
                },

            ]

            return (
                <div className="step-content">

                    <div className={"subiTabsContent feilds__top " + (this.props.isViewMode ? "readOnly_inputs" : " ")}>
                        <Formik
                            initialValues={{
                                details: this.state.workActivityObj.details,
                                arrange: this.state.workActivityObj.arrange,
                                status: this.state.workActivityObj.status
                            }}
                            validationSchema={WorkActivitySchema}
                            enableReinitialize={true}
                            onSubmit={(values) => {
                                this.saveWorkActivity(values);
                            }}                >
                            {({ errors, touched, setFieldTouched, setFieldValue, handleBlur, handleChange, values }) => (
                                <Form id="voItemForm" className="proForm datepickerContainer customProform" noValidate="novalidate" >
                                    <div className='document-fields'>

                                        <div className="proForm first-proform">

                                            <div className="linebylineInput valid-input">
                                                <label className="control-label">{Resources.description[currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.details && touched.details ? (" has-error") : !errors.details && touched.details ? (" has-success") : " ")} >
                                                    <input name='details' className="form-control fsadfsadsa" id="details"
                                                        placeholder={Resources.description[currentLanguage]} value={this.state.workActivityObj.details}
                                                        autoComplete='off' onChange={(e) => this.handleChangeworkActivity(e, 'details')}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} /> {touched.details ? (<em className="pError">{errors.details}</em>) : null}
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <label className="control-label">{Resources.status[currentLanguage]}</label>
                                                <div className="ui checkbox radio radioBoxBlue">
                                                    <input type="radio" name="letter-status" defaultChecked={this.state.workActivityObj.status === false ? null : 'checked'} value="true" onChange={e => this.handleChangeworkActivity(e, 'status')} />
                                                    <label>{Resources.oppened[currentLanguage]}</label>
                                                </div>
                                                <div className="ui checkbox radio radioBoxBlue">
                                                    <input type="radio" name="letter-status" defaultChecked={this.state.workActivityObj.status === false ? 'checked' : null} value="false" onChange={e => this.handleChangeworkActivity(e, 'status')} />
                                                    <label>{Resources.closed[currentLanguage]}</label>
                                                </div>
                                            </div>

                                        </div>

                                        <div className="proForm datepickerContainer">
                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources.no[currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.arrange && touched.arrange ? (" has-error") : !errors.arrange && touched.arrange ? (" has-success") : " ")} >
                                                    <input name='arrange' className="form-control fsadfsadsa" id="arrange" readOnly
                                                        placeholder={Resources.arrange[currentLanguage]} value={this.state.workActivityObj.arrange}
                                                        autoComplete='off' onChange={handleChange}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} /> {touched.arrange ? (<em className="pError">{errors.arrange}</em>) : null}
                                                </div>
                                            </div>

                                            <div className="slider-Btns fullWidthWrapper textLeft ">
                                                <button className={"primaryBtn-1 btn " + (this.props.isViewMode === true ? ' disNone' : '')} type="submit" disabled={this.props.isViewMode} >{Resources["save"][currentLanguage]}</button>
                                            </div>

                                        </div>

                                        <div className="doc-pre-cycle">
                                            <header>
                                                <h2 className="zero">{Resources['workActivity'][currentLanguage]}</h2>
                                            </header>

                                            <ReactTable
                                                // filterable
                                                ref={(r) => { this.selectTable = r }}
                                                data={this.state.WorkActivityRows} noDataText={Resources['noData'][currentLanguage]}
                                                columns={columns} defaultPageSize={10} minRows={2} />
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            )
        }

        let fieldForceTab = () => {

            let columns = [
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
                                <div className="btn table-btn-tooltip" style={{ marginLeft: "5px" }} onClick={() => this.DeleteFieldForce(row._original.id)}>
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
                    Header: Resources['fieldForce'][currentLanguage],
                    accessor: 'fieldForceName',
                    width: 150,
                },

                {
                    Header: Resources['area'][currentLanguage],
                    accessor: 'areaName',
                    width: 150,
                }
                , {
                    Header: Resources['amount'][currentLanguage],
                    accessor: 'amount',
                    width: 100,
                },
            ]

            return (
                <div className="step-content">

                    <div className={"subiTabsContent feilds__top " + (this.props.isViewMode ? "readOnly_inputs" : " ")}>
                        <Formik
                            initialValues={{
                                fieldForceId: '',
                                area: '',
                                disciplineId: '',
                                amount: '',
                                arrange: this.state.fieldForceArrange
                            }}
                            validationSchema={FieldForceSchema}
                            enableReinitialize={true}
                            onSubmit={(values) => { this.saveFieldForce(values) }}>
                            {({ errors, values, touched, setFieldTouched, setFieldValue, handleBlur, handleChange }) => (
                                <Form id="voItemForm" className="proForm datepickerContainer customProform" noValidate="novalidate" >
                                    <div className='document-fields'>

                                        <div className="proForm first-proform">
                                            <div className="linebylineInput valid-input">
                                                <Dropdown title="discipline" data={this.state.disciplineData} selectedValue={this.state.selectedDiscplineForce}
                                                    handleChange={event => this.setState({ selectedDiscplineForce: event })}
                                                    onChange={setFieldValue} onBlur={setFieldTouched} error={errors.disciplineId}
                                                    touched={touched.disciplineId} index="disciplineId" name="disciplineId" id="disciplineId" />
                                            </div>
                                        </div>

                                        <div className="proForm datepickerContainer">

                                            <div className="linebylineInput valid-input">
                                                <Dropdown title="fieldForce" data={this.state.fieldForceData} selectedValue={this.state.selectedFieldForce}
                                                    handleChange={event => this.setState({ selectedFieldForce: event })}
                                                    onChange={setFieldValue} onBlur={setFieldTouched} error={errors.fieldForceId}
                                                    touched={touched.fieldForceId} index="fieldForceId" name="fieldForceId" id="fieldForceId" />
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <Dropdown title="area" data={this.state.areaData} selectedValue={this.state.selectedAreaForce}
                                                    handleChange={event => this.setState({ selectedAreaForce: event })}
                                                    onChange={setFieldValue} onBlur={setFieldTouched} error={errors.area}
                                                    touched={touched.area} index="area" name="area" id="area" />
                                            </div>

                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources.quantity[currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.amount && touched.amount ? (" has-error") : !errors.amount && touched.amount ? (" has-success") : " ")} >
                                                    <input name='amount' className="form-control fsadfsadsa" id="amount"
                                                        placeholder={Resources.quantity[currentLanguage]} value={values.amount}
                                                        autoComplete='off' onChange={handleChange}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} /> {touched.amount ? (<em className="pError">{errors.amount}</em>) : null}
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources.no[currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.arrange && touched.arrange ? (" has-error") : !errors.arrange && touched.arrange ? (" has-success") : " ")} >
                                                    <input name='arrange' className="form-control fsadfsadsa" id="arrange" readOnly
                                                        placeholder={Resources.no[currentLanguage]} value={values.arrange}
                                                        autoComplete='off' onChange={handleChange}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} /> {touched.arrange ? (<em className="pError">{errors.arrange}</em>) : null}
                                                </div>
                                            </div>

                                            <div className="slider-Btns fullWidthWrapper textLeft ">
                                                <button className={"primaryBtn-1 btn " + (this.props.isViewMode === true ? ' disNone' : '')} type="submit" disabled={this.props.isViewMode} >{Resources["save"][currentLanguage]}</button>
                                            </div>
                                        </div>
                                        <div className="doc-pre-cycle">
                                            <header>
                                                <h2 className="zero">{Resources['fieldForce'][currentLanguage]}</h2>
                                            </header>

                                            <ReactTable
                                                ref={(r) => { this.selectTable = r }}
                                                data={this.state.fieldForceRows} noDataText={Resources['noData'][currentLanguage]}
                                                columns={columns} defaultPageSize={10} minRows={2} />
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            )
        }

        let materialTab = () => {

            let columns = [
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
                                <div className="btn table-btn-tooltip" style={{ marginLeft: "5px" }} onClick={() => this.DeleteMaterial(row._original.id)}>
                                    <i style={{ fontSize: "1.6em" }} className="fa fa-trash-o" />
                                </div>
                            </Fragment>
                        )
                    },
                    width: 80
                },
                {
                    Header: Resources['description'][currentLanguage],
                    accessor: 'description',
                    width: 150,
                },
                {
                    Header: Resources['CompanyName'][currentLanguage],
                    accessor: 'companyName',
                    width: 150,
                },
                {
                    Header: Resources['area'][currentLanguage],
                    accessor: 'areaName',
                    width: 150,
                }
                , {
                    Header: Resources['quantity'][currentLanguage],
                    accessor: 'quantity',
                    width: 100,
                },
                {
                    Header: Resources['unit'][currentLanguage],
                    accessor: 'unitName',
                    width: 100,
                },
                {
                    Header: Resources['time'][currentLanguage],
                    accessor: 'deliveryTime',
                    width: 100,
                },
                {
                    Header: Resources['remarks'][currentLanguage],
                    accessor: 'remarks',
                    width: 100,
                },

            ]

            return (
                <div className="step-content">

                    <div className={"subiTabsContent feilds__top " + (this.props.isViewMode ? "readOnly_inputs" : " ")}>
                        <Formik
                            initialValues={{
                                unitId: '',
                                areaId: '',
                                companyId: '',
                                deliveryTime: '',
                                arrange: this.state.materialArrange,
                                description: '',
                                quantity: '',
                                remarks: '',
                            }}
                            validationSchema={MaterialSchema}
                            enableReinitialize={true}
                            onSubmit={(values) => { this.saveMaterial(values) }}>
                            {({ errors, values, touched, setFieldTouched, setFieldValue, handleBlur, handleChange }) => (
                                <Form id="voItemForm" className="proForm datepickerContainer customProform" noValidate="novalidate" >
                                    <div className='document-fields'>

                                        <div className="proForm first-proform">
                                            <div className="linebylineInput valid-input">
                                                <label className="control-label">{Resources.description[currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.description && touched.description ? (" has-error") : !errors.description && touched.description ? (" has-success") : " ")} >
                                                    <input name='description' className="form-control fsadfsadsa" id="description"
                                                        placeholder={Resources.description[currentLanguage]} value={values.description} onChange={handleChange}
                                                        autoComplete='off'
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} /> {touched.description ? (<em className="pError">{errors.description}</em>) : null}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="proForm datepickerContainer">

                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources.no[currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.arrange && touched.arrange ? (" has-error") : !errors.arrange && touched.arrange ? (" has-success") : " ")} >
                                                    <input name='arrange' className="form-control fsadfsadsa" id="arrange" readOnly
                                                        placeholder={Resources.no[currentLanguage]} value={values.arrange}
                                                        autoComplete='off' onChange={handleChange}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} /> {touched.arrange ? (<em className="pError">{errors.arrange}</em>) : null}
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources.time[currentLanguage]}</label>
                                                <div className="inputDev ui input has-success">
                                                    <input name='deliveryTime' className="form-control fsadfsadsa" id="deliveryTime"
                                                        placeholder={Resources.time[currentLanguage]} value={values.deliveryTime}
                                                        autoComplete='off' onChange={handleChange}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} />
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <Dropdown title="CompanyName" data={this.state.CompaniesData} selectedValue={this.state.selectedCompanyMaterial}
                                                    handleChange={event => this.setState({ selectedCompanyMaterial: event })}
                                                    onChange={setFieldValue} onBlur={setFieldTouched} error={errors.companyId}
                                                    touched={touched.companyId} index="companyId" name="companyId" id="companyId" />
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <Dropdown title="area" data={this.state.areaData} selectedValue={this.state.selectedAreaMaterial}
                                                    handleChange={event => this.setState({ selectedAreaMaterial: event })}
                                                    onChange={setFieldValue} onBlur={setFieldTouched} error={errors.areaId}
                                                    touched={touched.areaId} index="areaId" name="areaId" id="areaId" />
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <Dropdown title="unit" data={this.state.unitData} selectedValue={this.state.selectedUnitMaterial}
                                                    handleChange={event => this.setState({ selectedUnitMaterial: event })}
                                                    onChange={setFieldValue} onBlur={setFieldTouched} error={errors.unitId}
                                                    touched={touched.unitId} index="unitId" name="unitId" id="unitId" />
                                            </div>

                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources.deliveredQuantity[currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.quantity && touched.quantity ? (" has-error") : !errors.quantity && touched.quantity ? (" has-success") : " ")} >
                                                    <input name='quantity' className="form-control fsadfsadsa" id="quantity"
                                                        placeholder={Resources.deliveredQuantity[currentLanguage]} value={values.quantity}
                                                        autoComplete='off' onChange={handleChange}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} /> {touched.quantity ? (<em className="pError">{errors.quantity}</em>) : null}
                                                </div>
                                            </div>

                                            <div className="letterFullWidth fullInputWidth">
                                                <label className="control-label">{Resources.remarks[currentLanguage]}</label>
                                                <div className="inputDev ui input has-success">
                                                    <input name='remarks' className="form-control fsadfsadsa" id="remarks"
                                                        placeholder={Resources.remarks[currentLanguage]} value={values.remarks}
                                                        autoComplete='off' onChange={handleChange}
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
                                                <h2 className="zero">{Resources['material'][currentLanguage]}</h2>
                                            </header>

                                            <ReactTable
                                                ref={(r) => { this.selectTable = r }}
                                                data={this.state.materialRows} noDataText={Resources['noData'][currentLanguage]}
                                                columns={columns} defaultPageSize={10} minRows={2} />
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            )
        }

        let equipmentTab = () => {

            let columns = [
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
                                <div className="btn table-btn-tooltip" style={{ marginLeft: "5px" }} onClick={() => this.DeleteEquipment(row._original.id)}>
                                    <i style={{ fontSize: "1.6em" }} className="fa fa-trash-o" />
                                </div>
                            </Fragment>
                        )
                    },
                    width: 80
                },
                {
                    Header: Resources['description'][currentLanguage],
                    accessor: 'description',
                    width: 150,
                },
                {
                    Header: Resources['CompanyName'][currentLanguage],
                    accessor: 'companyName',
                    width: 150,
                },
                {
                    Header: Resources['area'][currentLanguage],
                    accessor: 'areaName',
                    width: 150,
                }
                , {
                    Header: Resources['quantity'][currentLanguage],
                    accessor: 'quantity',
                    width: 100,
                },
                {
                    Header: Resources['unit'][currentLanguage],
                    accessor: 'equipmentunitName',
                    width: 100,
                },
                {
                    Header: Resources['type'][currentLanguage],
                    accessor: 'equipmenttypeName',
                    width: 100,
                },
                {
                    Header: Resources['dueBack'][currentLanguage],
                    accessor: 'dueBack',
                    width: 200,
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
                                areaId: '',
                                equipmentunitId: '',
                                companyId: '',
                                equipmenttypeId: '',
                                arrange: this.state.equipmentArrange,
                                description: '',
                                quantity: '',
                            }}
                            validationSchema={EquipmentSchema}
                            enableReinitialize={true}
                            onSubmit={(values) => { this.saveEquipment(values) }}>
                            {({ errors, values, touched, setFieldTouched, setFieldValue, handleBlur, handleChange }) => (
                                <Form id="voItemForm" className="proForm datepickerContainer customProform" noValidate="novalidate" >
                                    <div className='document-fields'>

                                        <div className="proForm datepickerContainer">

                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources.description[currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.description && touched.description ? (" has-error") : !errors.description && touched.description ? (" has-success") : " ")} >
                                                    <input name='description' className="form-control fsadfsadsa" id="description"
                                                        placeholder={Resources.description[currentLanguage]} value={values.description} onChange={handleChange}
                                                        autoComplete='off'
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} /> {touched.description ? (<em className="pError">{errors.description}</em>) : null}
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources.no[currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.arrange && touched.arrange ? (" has-error") : !errors.arrange && touched.arrange ? (" has-success") : " ")} >
                                                    <input name='arrange' className="form-control fsadfsadsa" id="arrange" readOnly
                                                        placeholder={Resources.no[currentLanguage]} value={values.arrange}
                                                        autoComplete='off' onChange={handleChange}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} /> {touched.arrange ? (<em className="pError">{errors.arrange}</em>) : null}
                                                </div>
                                            </div>


                                            <div className="linebylineInput valid-input">
                                                <Dropdown title="CompanyName" data={this.state.CompaniesData} selectedValue={this.state.selectedCompanyEquipment}
                                                    handleChange={event => this.setState({ selectedCompanyEquipment: event })}
                                                    onChange={setFieldValue} onBlur={setFieldTouched} error={errors.companyId}
                                                    touched={touched.companyId} index="companyId" name="companyId" id="companyId" />
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <Dropdown title="area" data={this.state.areaData} selectedValue={this.state.selectedAreaEquipment}
                                                    handleChange={event => this.setState({ selectedAreaEquipment: event })}
                                                    onChange={setFieldValue} onBlur={setFieldTouched} error={errors.areaId}
                                                    touched={touched.areaId} index="areaId" name="areaId" id="areaId" />
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <Dropdown title="unit" data={this.state.unitData} selectedValue={this.state.selectedUnitEquipment}
                                                    handleChange={event => this.setState({ selectedUnitEquipment: event })}
                                                    onChange={setFieldValue} onBlur={setFieldTouched} error={errors.equipmentunitId}
                                                    touched={touched.equipmentunitId} index="equipmentunitId" name="equipmentunitId" id="equipmentunitId" />
                                            </div>

                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources.deliveredQuantity[currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.quantity && touched.quantity ? (" has-error") : !errors.quantity && touched.quantity ? (" has-success") : " ")} >
                                                    <input name='quantity' className="form-control fsadfsadsa" id="quantity"
                                                        placeholder={Resources.deliveredQuantity[currentLanguage]} value={values.quantity}
                                                        autoComplete='off' onChange={handleChange}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} /> {touched.quantity ? (<em className="pError">{errors.quantity}</em>) : null}
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <Dropdown title="equipmentType" data={this.state.equipmentData} selectedValue={this.state.selectedEquipment}
                                                    handleChange={event => this.setState({ selectedEquipment: event })}
                                                    onChange={setFieldValue} onBlur={setFieldTouched} error={errors.equipmenttypeId}
                                                    touched={touched.equipmenttypeId} index="equipmenttypeId" name="equipmenttypeId" id="equipmenttypeId" />
                                            </div>

                                            <div className="linebylineInput valid-input alternativeDate">
                                                <DatePicker title='dueBack' startDate={this.state.dueBack}
                                                    handleChange={e => this.setState({ dueBack: e })} />
                                            </div>

                                            <div className="slider-Btns fullWidthWrapper textLeft ">
                                                <button className={"primaryBtn-1 btn " + (this.props.isViewMode === true ? ' disNone' : '')} type="submit" disabled={this.props.isViewMode} >{Resources["save"][currentLanguage]}</button>
                                            </div>

                                        </div>

                                        <div className="doc-pre-cycle">
                                            <header>
                                                <h2 className="zero">{Resources['equipment'][currentLanguage]}</h2>
                                            </header>

                                            <ReactTable
                                                ref={(r) => { this.selectTable = r }}
                                                data={this.state.equipmentRows} noDataText={Resources['noData'][currentLanguage]}
                                                columns={columns} defaultPageSize={10} minRows={2} />
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            )
        }

        let visitorsTab = () => {

            let Columns = [
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
                                <div className="btn table-btn-tooltip" style={{ marginLeft: "5px" }} onClick={() => this.DeleteVisitors(row._original.id)}>
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
                    Header: Resources['time'][currentLanguage],
                    accessor: 'time',
                    width: 150,
                },
                {
                    Header: Resources['remarks'][currentLanguage],
                    accessor: 'remarks',
                    width: 100,
                },
            ]

            return (
                <div className="step-content">

                    <div className={"subiTabsContent feilds__top " + (this.props.isViewMode ? "readOnly_inputs" : " ")}>
                        <Formik
                            initialValues={{
                                arrange: this.state.visitorsArrange,
                                companyId: '',
                                contactId: '',
                                time: '',
                                remarks: '',
                            }}
                            validationSchema={VisitorsSchema}
                            enableReinitialize={true}
                            onSubmit={(values) => { this.saveVisitors(values) }}                >
                            {({ errors, touched, values, setFieldTouched, setFieldValue, handleBlur, handleChange }) => (
                                <Form id="voItemForm" className="proForm datepickerContainer customProform" noValidate="novalidate" >
                                    <div className='document-fields'>
                                        <div className="proForm datepickerContainer">

                                            <div className="linebylineInput valid-input">
                                                <Dropdown title="CompanyName" data={this.state.CompaniesData} selectedValue={this.state.selectedVisitorsCompany}
                                                    handleChange={event => this.selectedVisitorsCompany(event)}
                                                    onChange={setFieldValue} onBlur={setFieldTouched} error={errors.companyId}
                                                    touched={touched.companyId} index="companyId" name="companyId" id="companyId" />
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <Dropdown title="ContactName" data={this.state.contactsVisitors} selectedValue={this.state.selectedVisitorsContact}
                                                    handleChange={event => this.setState({ selectedVisitorsContact: event })}
                                                    onChange={setFieldValue} onBlur={setFieldTouched} error={errors.contactId}
                                                    touched={touched.contactId} index="contactId" name="contactId" id="contactId" />
                                            </div>

                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources.no[currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.arrange && touched.arrange ? (" has-error") : !errors.arrange && touched.arrange ? (" has-success") : " ")} >
                                                    <input name='arrange' className="form-control fsadfsadsa" id="arrange"
                                                        placeholder={Resources.no[currentLanguage]} value={values.arrange} readOnly
                                                        autoComplete='off' onChange={handleChange}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} /> {touched.arrange ? (<em className="pError">{errors.arrange}</em>) : null}
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources.time[currentLanguage]}</label>
                                                <div className="inputDev ui input has-success">
                                                    <input name='time' className="form-control fsadfsadsa" id="time"
                                                        placeholder={Resources.time[currentLanguage]} value={values.time}
                                                        autoComplete='off' onChange={handleChange}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} />
                                                </div>
                                            </div>

                                            <div className="letterFullWidth fullInputWidth">
                                                <label className="control-label">{Resources.remarks[currentLanguage]}</label>
                                                <div className="inputDev ui input has-success">
                                                    <input name='remarks' className="form-control fsadfsadsa" id="remarks"
                                                        placeholder={Resources.remarks[currentLanguage]} value={values.remarks}
                                                        autoComplete='off' onChange={handleChange}
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
                                                <h2 className="zero">{Resources['visitors'][currentLanguage]}</h2>
                                            </header>

                                            <ReactTable
                                                ref={(r) => { this.selectTable = r }}
                                                data={this.state.visitorsRows} noDataText={Resources['noData'][currentLanguage]}
                                                columns={Columns} defaultPageSize={10} minRows={2} />
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            )
        }

        let weatherTab = () => {

            let Columns = [
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
                                <div className="btn table-btn-tooltip" style={{ marginLeft: "5px" }} onClick={() => this.DeleteWeather(row._original.id)}>
                                    <i style={{ fontSize: "1.6em" }} className="fa fa-trash-o" />
                                </div>
                            </Fragment>
                        )
                    },
                    width: 80
                },
                {
                    Header: Resources['weather'][currentLanguage],
                    accessor: 'weatherName',
                    width: 250,
                },
                {
                    Header: Resources['fromTo'][currentLanguage],
                    accessor: 'fromToName',
                    width: 200,
                },
            ]

            return (
                <div className="step-content">

                    <div className={"subiTabsContent feilds__top " + (this.props.isViewMode ? "readOnly_inputs" : " ")}>
                        <Formik
                            initialValues={{
                                arrange: this.state.weatherArrange,
                                fromToId: '',
                                weatherId: '',
                            }}
                            validationSchema={WeatherSchema}
                            enableReinitialize={true}
                            onSubmit={(values) => { this.saveWeather(values) }}                >
                            {({ errors, touched, values, setFieldTouched, setFieldValue, handleBlur, handleChange }) => (
                                <Form id="voItemForm" className="proForm datepickerContainer customProform" noValidate="novalidate" >
                                    <div className='document-fields'>
                                        <div className="proForm datepickerContainer">

                                            <div className="linebylineInput valid-input">
                                                <Dropdown title="weather" data={this.state.weatherData} selectedValue={this.state.selectedWeather}
                                                    handleChange={event => this.setState({ selectedWeather: event })}
                                                    onChange={setFieldValue} onBlur={setFieldTouched} error={errors.weatherId}
                                                    touched={touched.weatherId} index="weatherId" name="weatherId" id="weatherId" />
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <Dropdown title="weatherFromTo" data={this.state.fromToData} selectedValue={this.state.selectedFromTo}
                                                    handleChange={event => this.setState({ selectedFromTo: event })}
                                                    onChange={setFieldValue} onBlur={setFieldTouched} error={errors.fromToId}
                                                    touched={touched.fromToId}
                                                    index="fromToId" name="fromToId" id="fromToId" />
                                            </div>

                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources.no[currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.arrange && touched.arrange ? (" has-error") : !errors.arrange && touched.arrange ? (" has-success") : " ")} >
                                                    <input name='arrange' className="form-control fsadfsadsa" id="arrange"
                                                        placeholder={Resources.no[currentLanguage]} value={values.arrange} readOnly
                                                        autoComplete='off' onChange={handleChange}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} /> {touched.arrange ? (<em className="pError">{errors.arrange}</em>) : null}
                                                </div>
                                            </div>

                                            <div className="slider-Btns fullWidthWrapper textLeft ">
                                                <button className={"primaryBtn-1 btn " + (this.props.isViewMode === true ? ' disNone' : '')} type="submit" disabled={this.props.isViewMode} >{Resources["save"][currentLanguage]}</button>
                                            </div>

                                        </div>

                                        <div className="doc-pre-cycle">
                                            <header>
                                                <h2 className="zero">{Resources['weather'][currentLanguage]}</h2>
                                            </header>

                                            <ReactTable
                                                ref={(r) => { this.selectTable = r }}
                                                data={this.state.weatherRows} noDataText={Resources['noData'][currentLanguage]}
                                                columns={Columns} defaultPageSize={10} minRows={2} />
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            )
        }

        return (
            <div className="mainContainer">

                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document one__tab one_step readOnly_inputs" : "documents-stepper noTabs__document one__tab one_step"}>
                    <HeaderDocument projectName={projectName} isViewMode={this.state.isViewMode} perviousRoute={this.state.perviousRoute}
                        docTitle={Resources.dailyReports[currentLanguage]} moduleTitle={Resources["technicalOffice"][currentLanguage]} />
                    <div className="doc-container">
                        <div className="step-content withManyTabs">
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
                            {this.state.CurrentStep === 0 ? <Fragment>{stepOne()}</Fragment> : <Fragment> {stepTwo()}</Fragment>}
                        </div>

                        <Fragment>
                            <Steps
                                steps_defination={steps_defination}
                                exist_link="/dailyReports/"
                                docId={this.state.docId}
                                changeCurrentStep={stepNo =>
                                    this.changeCurrentStep(stepNo)
                                }
                                stepNo={this.state.CurrentStep}
                            />
                        </Fragment>

                    </div>
                </div>

                <div
                    className="largePopup largeModal "
                    style={{
                        display: this.state.showModal ? "block" : "none"
                    }}>
                    <SkyLight
                        hideOnOverlayClicked
                        ref={ref => (this.simpleDialog = ref)}
                        title={
                            Resources[this.state.currentTitle][currentLanguage]
                        }
                        beforeClose={() => {
                            this.executeBeforeModalClose();
                        }}>
                        {" "}
                        {this.state.currentComponent}
                    </SkyLight>
                </div>

                {this.state.showDeleteModal == true ? (
                    <ConfirmationModal
                        title={
                            Resources["smartDeleteMessage"][currentLanguage]
                                .content
                        }
                        closed={e => this.setState({ showDeleteModal: false })}
                        showDeleteModal={this.state.showDeleteModal}
                        clickHandlerCancel={e =>
                            this.setState({ showDeleteModal: false })
                        }
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
)(withRouter(dailyReportsAddEdit))