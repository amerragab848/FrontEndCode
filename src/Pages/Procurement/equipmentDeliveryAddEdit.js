import React, { Component, Fragment } from "react";

import OptionContainer from "../../Componants/OptionsPanels/OptionContainer";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import dataservice from "../../Dataservice";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import UploadAttachment from '../../Componants/OptionsPanels/UploadAttachment'
import ViewAttachment from '../../Componants/OptionsPanels/ViewAttachmments'
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import XSLfile from "../../Componants/OptionsPanels/XSLfiel";
import IPConfig from '../../IP_Configrations'
import Resources from "../../resources.json";
import { withRouter } from "react-router-dom";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as communicationActions from '../../store/actions/communication';
import Config from "../../Services/Config.js";
import CryptoJS from 'crypto-js';
import moment from "moment";
import SkyLight from 'react-skylight';
import Distribution from '../../Componants/OptionsPanels/DistributionList'
import SendToWorkflow from '../../Componants/OptionsPanels/SendWorkFlow'
import DocumentApproval from '../../Componants/OptionsPanels/wfApproval'
import DatePicker from '../../Componants/OptionsPanels/DatePicker'
import { toast } from "react-toastify";
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument'
import Api from "../../api";
import ReactTable from "react-table";
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import { SkyLightStateless } from 'react-skylight';

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let arrange = 0;
const _ = require('lodash')

let selectedRows = [];

const validationSchema = Yup.object().shape({
    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),
    docId: Yup.string().required(Resources['contractPoSelection'][currentLanguage]),
    orderFromCompanyId: Yup.string().required(Resources['selectCompany'][currentLanguage]),
    equipmentCodeId: Yup.string().required(Resources['equipmentCodeSelection'][currentLanguage]),
    selectedProjects: Yup.string().required(Resources['projectSelection'][currentLanguage]),
})

const documentItemValidationSchema = Yup.object().shape({

    quantity: Yup.number().required(Resources['quantity'][currentLanguage])
        .typeError(Resources['onlyNumbers'][currentLanguage]),

    arrangeItem: Yup.number().typeError(Resources['onlyNumbers'][currentLanguage]),

    resourceCode: Yup.string().required(Resources['resourceCodeRequired'][currentLanguage]),
})

let ApproveOrRejectData = [
    { label: Resources.approved[currentLanguage], value: 'true' },
    { label: Resources.rejected[currentLanguage], value: 'false' }
]

class equipmentDeliveryAddEdit extends Component {

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
                } catch { this.props.history.goBack(); }
            }
            index++;
        }
        this.state = {
            selectedRows: [],
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
            docTypeId: 57,
            projectId: projectId,
            docApprovalId: docApprovalId,
            arrange: arrange,
            document: this.props.document ? Object.assign({}, this.props.document) : {},
            selected: {},
            AllItems: [],
            companiesData: [],
            projectsData: [],
            contractPoData: [],
            EquipmentCodesData: [],
            Items: [],
            permission: [
                { name: "sendByEmail", code: 262 },
                { name: "sendByInbox", code: 261 },
                { name: "sendTask", code: 0 },
                { name: "distributionList", code: 989 },
                { name: "createTransmittal", code: 3075 },
                { name: "sendToWorkFlow", code: 736 },
                { name: "viewAttachments", code: 3285 },
                { name: "deleteAttachments", code: 894 }
            ],
            selectedContractId: { label: Resources.contractPoSelection[currentLanguage], value: "0" },
            selectedCompany: { label: Resources.selectCompany[currentLanguage], value: "0" },
            selectedProject: [],
            selectedEquipmentId: { label: Resources.equipmentCodeSelection[currentLanguage], value: "0" },
            unitPrice: 0,
            approvedQuantity: 0,
            rejectedQuantity: 0,
            pendingQuantity: 0,
            remarks: '',
            arrangeItem: 1,
            receivedDate: moment(),
            nextDeliveryDate: moment(),
            ItemDescriptionInfo: {},
            BtnLoading: false,
            ShowPopup: false,
            objItem: {},
            seletedItem: {},
            receivedDateItem: moment(),
            dueBackItem: moment(),
        }

        if (!Config.IsAllow(256) && !Config.IsAllow(257) && !Config.IsAllow(259)) {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push("/materialDelivery/" + this.state.projectId);
        }
    }

    componentDidMount() {
        var links = document.querySelectorAll(".noTabs__document .doc-container .linebylineInput");
        for (var i = 0; i < links.length; i++) {
            if ((i + 1) % 2 == 0) { links[i].classList.add("even") }
            else { links[i].classList.add("odd") }
        }
        this.checkDocumentIsView()

        dataservice.GetDataList('GetAccountsDefaultList?listType=materialcode&pageNumber=0&pageSize=10000', 'title', 'id').then(
            res => {
                this.setState({ MaterialCodeData: res })
            }
        )
        if (this.state.docId !== 0) {
            dataservice.GetDataGrid('GetLogsEquipmentsDeliveryTickets?projectId=' + this.state.docId).then(
                res => {
                    this.setState({ Items: res })
                }
            )
        }
        Api.get('GetNextArrangeItems?docId=' + this.state.docId + '&docType=' + this.state.docTypeId).then(
            res => {
                this.setState({
                    arrangeItem: res
                })
            }
        )

    }

    componentWillReceiveProps(nextProps, prevProps) {
        if (nextProps.document.id) {
            let doc = nextProps.document
            doc.docDate = doc.docDate != null ? moment(doc.docDate).format("DD/MM/YYYY") : moment();
            doc.ticketDate = doc.ticketDate != null ? moment(doc.ticketDate).format("DD/MM/YYYY") : moment();
            doc.deliveryDate = doc.deliveryDate != null ? moment(doc.deliveryDate).format("DD/MM/YYYY") : moment();
            this.setState({ isEdit: true, document: doc, hasWorkflow: this.props.hasWorkflow })
            let isEdit = nextProps.document.id > 0 ? true : false
            this.fillDropDowns(isEdit);
            this.checkDocumentIsView();
            dataservice.GetDataGrid('GetPoContractItemMaterial?id=' + doc.id).then(
                res => {
                    let Data = res
                    let ListData = []
                    Data.map(i => {
                        let obj = {}
                        obj.value = i.id
                        obj.label = i.details
                        ListData.push(obj)
                    })
                    this.setState({ descriptionDropData: ListData, descriptionList: res })
                }
            )
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

    componentWillMount() {
        if (this.state.docId > 0) {
            let url = "GetLogsEquipmentsDeliverysById?id=" + this.state.docId;
            this.props.actions.documentForEdit(url, this.state.docTypeId, 'equipmentDelivery')
        }
        else {
            dataservice.GetNextArrangeMainDocument('GetNextArrangeMainDoc?projectId=' + projectId + '&docType=' + this.state.docTypeId + '&companyId=undefined&contactId=undefined').then(
                res => {
                    let Document = {

                        projectId: projectId,
                        orderFromCompanyId: '',
                        arrange: res,
                        equipmentCodeId: '',
                        docId: '',
                        orderType: '',
                        deliveryDate: moment(),
                        docDate: moment(),
                        status: true,
                        subject: '',
                        docCloseDate: moment(),
                        ticketDate: moment(),
                        selectedProjects: []
                    }
                    this.setState({ document: Document })
                }
            )
            this.fillDropDowns(false);
            this.props.actions.documentForAdding();
        }
    }

    fillDropDowns(isEdit) {

        dataservice.GetDataList('GetPoContractForList?projectId= ' + this.state.projectId, 'subject', 'id').then(result => {
            if (isEdit) {
                let id = this.props.document.orderId;
                let selectedValue = {};
                if (id) {
                    selectedValue = _.find(result, function (i) { return i.value === id });
                    this.setState({ selectedContractId: selectedValue })
                }
            }
            this.setState({ contractPoData: [...result] })
        })

        dataservice.GetDataList('GetAccountsDefaultList?listType=equipmentcode&pageNumber=0&pageSize=10000', 'title', 'id').then(result => {
            if (isEdit) {
                let id = this.props.document.equipmentCodeId;
                let selectedValue = {};
                if (id) {
                    selectedValue = _.find(result, function (i) { return i.value == id });
                    this.setState({ selectedEquipmentId: selectedValue })
                }
            }
            this.setState({ EquipmentCodesData: [...result] })
        })

        dataservice.GetDataList('GetAccountsProjects', 'projectName', 'id').then(result => {
            if (isEdit) {
                let id = this.props.document.selectedProjects;
                let selectedValue = [];

                if (id) {
                    id.map(w => {
                        let element = _.find(result, function (i) { return i.value === w });
                        selectedValue.push(element)
                    })
                    this.setState({
                        selectedProject: selectedValue
                    });
                }
            }
            this.setState({
                projectsData: [...result]
            });
        })

        dataservice.GetDataList('GetProjectProjectsCompaniesForList?projectId= ' + this.state.projectId, 'companyName', 'companyId').then(result => {
            if (isEdit) {
                let id = this.props.document.orderFromCompanyId;
                let selectedValue = {};
                if (id) {
                    selectedValue = _.find(result, function (i) { return i.value == id });

                    this.setState({
                        selectedCompany: selectedValue
                    });
                }
            }
            this.setState({
                companiesData: [...result]
            });
        })

    }

    handleShowAction = (item) => {
        if (item.title == "sendToWorkFlow") { this.props.actions.SendingWorkFlow(true); }
        if (item.value != "0") {
            this.props.actions.showOptionPanel(false);
            this.setState({
                currentComponent: item.value,
                currentTitle: item.title,
                showModal: true
            })
            this.simpleDialog.show()
        }
    }

    handleChangeDropDown(event, field, isSubscrib, targetState, url, param, selectedValue, subDatasource) {
        if (field == 'selectedProject') {

            this.setState({
                selectedProject: event
            })
            // console.log(this.state.selectedProject)
            // if (event == null) return
            // let original_document = { ...this.state.document }
            // let updated_document = {};
            // updated_document[field] = event.value;
            // updated_document = Object.assign(original_document, updated_document);
            // this.setState({ document: updated_document, [selectedValue]: event })
        }
        else {

            if (event == null) return
            let original_document = { ...this.state.document }
            let updated_document = {};
            updated_document[field] = event.value;
            updated_document = Object.assign(original_document, updated_document);
            this.setState({ document: updated_document, [selectedValue]: event })
        }
    }

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!Config.IsAllow(257)) {
                this.setState({ isViewMode: true })
            }
            if (this.state.isApproveMode != true && Config.IsAllow(257)) {
                if (this.props.hasWorkflow == false && Config.IsAllow(257)) {
                    if (this.props.document.status !== false && Config.IsAllow(257)) {
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

    saveAndExit(event) {
        if (this.state.CurrentStep === 1) { this.setState({ CurrentStep: this.state.CurrentStep + 1 }) }
        else { this.props.history.push("/materialDelivery/" + this.state.projectId) }
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
            Config.IsAllow(3285) === true ?
                (<ViewAttachment docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} deleteAttachments={854} />) : null) : null;
    }

    NextStep() {
        if (this.state.CurrentStep === 1) {

            this.setState({
                CurrentStep: this.state.CurrentStep + 1, FirstStep: false,
                SecondStep: true, SecondStepComplate: true,
            })
        }
        else { this.props.history.push("/equipmentDelivery/" + this.state.projectId) }
    }

    PreviousStep() {
        if (this.state.CurrentStep === 2) {
            this.setState({ CurrentStep: this.state.CurrentStep - 1, FirstStep: true, SecondStep: false, SecondStepComplate: false })
        }
    }

    componentWillUnmount() {
        this.props.actions.clearCashDocument();
        this.setState({ docId: 0 })
    }

    StepOneLink = () => {
        if (docId !== 0) { this.setState({ FirstStep: true, SecondStepComplate: false, CurrentStep: 1 }) }
    }

    StepTwoLink = () => {
        if (docId !== 0) { this.setState({ FirstStep: true, SecondStepComplate: true, CurrentStep: 2 }) }
    }

    handleChangeDate(e, field) {
        let original_document = { ...this.state.document }
        let updated_document = {};
        updated_document[field] = e;
        updated_document = Object.assign(original_document, updated_document);
        this.setState({ document: updated_document })
    }

    SaveDoc = (Mood) => {

        this.setState({ isLoading: true })
        let ProjectIds = []
        this.state.selectedProject.forEach(function (item) {
            ProjectIds.push(item.value)
        })
        console.log(ProjectIds)
        if (Mood === 'EditMood') {
            // let projectIds = []
            // this.state.selectedProjects.map(i =>
            //     projectIds.push[i.value]
            // )
            // console.log(projectIds)
            let doc = { ...this.state.document };
            doc.selectedProjects = ProjectIds
            doc.docDate = moment(doc.docDate, "DD/MM/YYYY").format("YYYY-MM-DD[T]HH:mm:ss.SSS");
            doc.ticketDate = moment(doc.ticketDate, "DD/MM/YYYY").format("YYYY-MM-DD[T]HH:mm:ss.SSS");
            doc.deliveryDate = moment(doc.deliveryDate, "DD/MM/YYYY").format("YYYY-MM-DD[T]HH:mm:ss.SSS");
            dataservice.addObject('EditLogsEquipmentsDelivery', doc).then(result => {

                this.setState({ isLoading: false })
                toast.success(Resources["operationSuccess"][currentLanguage])

            }).catch(ex => {
                this.setState({ Loading: false })
                toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
            })

        } else {

            let doc = { ...this.state.document };
            doc.docDate = moment(doc.docDate, "DD/MM/YYYY").format("YYYY-MM-DD[T]HH:mm:ss.SSS");
            doc.ticketDate = moment(doc.ticketDate, "DD/MM/YYYY").format("YYYY-MM-DD[T]HH:mm:ss.SSS");
            doc.deliveryDate = moment(doc.deliveryDate, "DD/MM/YYYY").format("YYYY-MM-DD[T]HH:mm:ss.SSS");
            doc.selectedProjects = ProjectIds
            //doc.docId =this.state.
            dataservice.addObject('AddLogsEquipmentsDelivery', doc).then(result => {

                this.setState({ isLoading: false, docId: result.id })
                toast.success(Resources["operationSuccess"][currentLanguage])
            }).catch(ex => {
                this.setState({ Loading: false })
                toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
            })

        }
        dataservice.GetDataGrid('GetPoContractItemForEquipment?projectId=1004-2').then(
            res => {
                this.setState({
                    AllItems: res
                })
            }
        )
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
            selected: newSelected,
        })
    }

    ConfirmationDeleteItem = () => {
        this.setState({ isLoading: true })
        let ids = []
        selectedRows.map(s => {
            ids.push(s.id)
        })
        Api.post('DeleteMultipleLogsEquipmentsDeliveryTicketsById', ids).then(
            res => {
                let originalRows = this.state.Items

                ids.map(i => {
                    originalRows = originalRows.filter(r => r.id !== i);
                })
                selectedRows = []
                let data = { items: originalRows };
                this.props.actions.ExportingData(data);
                this.setState({
                    Items: originalRows,
                    showDeleteModal: false,
                    isLoading: false,
                })
            },
            toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)
        ).catch(ex => {
            this.setState({
                showDeleteModal: false,
                isLoading: false,
            });
            toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
        });
    }

    SaveItem = (values) => {
        this.setState({ isLoading: true })
        let obj = {
            equipmentDeliveryId: this.state.docId,
            receivedDate: moment(this.state.receivedDateItem, "DD/MM/YYYY").format("YYYY-MM-DD[T]HH:mm:ss.SSS"),
            deliveryTime: '',
            quantity: this.state.seletedItem.quantity,
            description: this.state.seletedItem.details,
            remarks: this.state.remarks,
            nextDeliveryDate: moment(this.state.dueBackItem, "DD/MM/YYYY").format("YYYY-MM-DD[T]HH:mm:ss.SSS"),
            resourceCode: this.state.seletedItem.resourceCode,
            itemId: this.state.seletedItem.id,
            arrange: this.state.arrangeItem,
        }
        dataservice.addObject('AddLogsEquipmentsDeliveryTickets', obj).then(result => {
            let Items = this.state.Items
            Items.push(result)
            this.setState({
                seletedItem: {}, Items, isLoading: false,
            })
            Api.get('GetNextArrangeItems?docId=' + this.state.docId + '&docType=' + this.state.docTypeId).then(
                res => {
                    this.setState({
                        arrangeItem: res
                    })
                }
            )
            toast.success(Resources["operationSuccess"][currentLanguage])

        }).catch(ex => {
            this.setState({ Loading: false })
            toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
        })

    }

    handleChangeItemId = (e) => {
        let data = []
        data = this.state.descriptionList.filter(i => i.id === e.value)
        let obj = data[0]
        console.log(obj)
        this.setState({
            selectedItemId: e,
            unitPrice: obj.unitPrice,
            ItemDescriptionInfo: obj,

        })
    }

    HandelChangeItems = (e, name) => {
        if (name === 'arrangeItem') {
            this.setState({ arrangeItem: e.target.value })
        }
        else {
            let original_document = { ...this.state.seletedItem }
            let updated_document = {};
            updated_document[name] = e.target.value;
            updated_document = Object.assign(original_document, updated_document);
            this.setState({ seletedItem: updated_document })
        }
    }

    executeBeforeModalClose = (e) => {
        this.setState({ showModal: false });
    }

    ChooesItem = (row, type) => {
        if (type != "checkbox") {
            console.log(row)
            this.setState({
                ShowPopup: false,
                seletedItem: row,
                arrangeItem: this.state.Items.length ? this.state.Items.length + 1 : 1
            })
        }
    }

    render() {

        let actions = [
            { title: "distributionList", value: <Distribution docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />, label: Resources["distributionList"][currentLanguage] },
            { title: "sendToWorkFlow", value: <SendToWorkflow docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />, label: Resources["sendToWorkFlow"][currentLanguage] },
            {
                title: "documentApproval", value: <DocumentApproval docTypeId={this.state.docTypeId} docId={this.state.docId} approvalStatus={true}
                    projectId={this.state.projectId} docApprovalId={this.state.docApprovalId} currentArrange={this.state.arrange} />, label: Resources["documentApproval"][currentLanguage]
            },
            {
                title: "documentApproval", value: <DocumentApproval docTypeId={this.state.docTypeId} docId={this.state.docId} approvalStatus={false}
                    projectId={this.state.projectId} docApprovalId={this.state.docApprovalId} currentArrange={this.state.arrange} />, label: Resources["documentApproval"][currentLanguage]
            }
        ]

        let StepOne = () => {
            return (
                <div className="document-fields">
                    <Formik initialValues={this.state.document}
                        validationSchema={validationSchema}
                        enableReinitialize={true}
                        onSubmit={values => {
                            if (this.props.showModal) { return; }
                            if (this.props.changeStatus === true && this.state.docId > 0) {
                                this.SaveDoc('EditMood');
                                //this.NextStep();
                            } else if (this.props.changeStatus === false && this.state.docId === 0) {
                                this.SaveDoc('AddMood');
                            } else {

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
                                        <DatePicker title='recievedDate' startDate={this.state.document.deliveryDate}
                                            handleChange={e => this.handleChangeDate(e, 'deliveryDate')} />
                                    </div>

                                    <div className="linebylineInput valid-input alternativeDate">
                                        <DatePicker title='dueBack' startDate={this.state.document.ticketDate}
                                            handleChange={e => this.handleChangeDate(e, 'ticketDate')} />
                                    </div>

                                    <div className="linebylineInput valid-input">
                                        <label className="control-label">{Resources.arrange[currentLanguage]}</label>
                                        <div className="ui input inputDev">
                                            <input type="text" className="form-control" readOnly value={this.state.document.arrange}
                                                onChange={(e) => this.handleChange(e, 'arrange')} />
                                        </div>
                                    </div>

                                    <div className="linebylineInput valid-input">
                                        <Dropdown title="equipmentCode" data={this.state.EquipmentCodesData} selectedValue={this.state.selectedEquipmentId}
                                            handleChange={event => this.handleChangeDropDown(event, "equipmentCodeId", false, "", "", "", "selectedEquipmentId")}
                                            onChange={setFieldValue} onBlur={setFieldTouched} error={errors.equipmentCodeId}
                                            touched={touched.equipmentCodeId} name="equipmentCodeId" id="equipmentCodeId" />
                                    </div>

                                    <div className="linebylineInput valid-input">
                                        <Dropdown title="orderFrom" data={this.state.companiesData} selectedValue={this.state.selectedCompany}
                                            handleChange={event => this.handleChangeDropDown(event, "orderFromCompanyId", false, "", "", "", "selectedCompany")}
                                            onChange={setFieldValue} onBlur={setFieldTouched} error={errors.orderFromCompanyId}
                                            touched={touched.orderFromCompanyId} name="orderFromCompanyId" id="orderFromCompanyId" />
                                    </div>

                                    <div className="linebylineInput valid-input letterFullWidth">
                                        <Dropdown title="contractPo" data={this.state.contractPoData} selectedValue={this.state.selectedContractId}
                                            handleChange={event => this.handleChangeDropDown(event, "docId", false, "", "", "", "selectedContractId")}
                                            onChange={setFieldValue} onBlur={setFieldTouched} error={errors.docId} isDisabled={this.props.changeStatus}
                                            touched={touched.docId} name="docId" id="docId" />
                                    </div>


                                    <div className="linebylineInput letterFullWidth dropdownMulti">
                                        <Dropdown title="otherProjects" data={this.state.projectsData} value={this.state.selectedProject}
                                            handleChange={event => this.handleChangeDropDown(event, "selectedProject", false, "", "", "", "selectedProjects")}
                                            onChange={setFieldValue} onBlur={setFieldTouched} error={errors.selectedProjects}
                                            touched={touched.selectedProjects} name="selectedProjects" id="selectedProjects" isMulti={true} />
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
                                            <UploadAttachment changeStatus={this.props.changeStatus} AddAttachments={893} EditAttachments={3244} ShowDropBox={3543}
                                                ShowGoogleDrive={3544} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
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

        let StepTwo = () => {

            let columnsItem = [
                {
                    Header: Resources["select"][currentLanguage],
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
                    width: 70
                },
                {
                    Header: Resources['arrange'][currentLanguage],
                    accessor: 'arrange',
                    width: 50,
                }, {
                    Header: Resources['description'][currentLanguage],
                    accessor: 'description',
                    width: 300,
                },
                {
                    Header: Resources['quantity'][currentLanguage],
                    accessor: 'quantity',
                    width: 100,
                },
                {
                    Header: Resources['dueBack'][currentLanguage],
                    accessor: 'nextDeliveryDate',
                    width: 100,
                    Cell: row => (
                        <span>
                            <span>{moment(row.value).format("DD/MM/YYYY")}</span>
                        </span>
                    )
                }, {
                    Header: Resources['recievedDate'][currentLanguage],
                    accessor: 'receivedDate',
                    width: 100,
                    Cell: row => (
                        <span>
                            <span>{moment(row.value).format("DD/MM/YYYY")}</span>
                        </span>
                    )
                }, {
                    Header: Resources['resourceCode'][currentLanguage],
                    accessor: 'resourceCode',
                    width: 100,
                }, {
                    Header: Resources['remarks'][currentLanguage],
                    accessor: 'remarks',
                    width: 100,
                }
            ]

            return (
                <div className="step-content">
                    <div className={"subiTabsContent feilds__top " + (this.props.isViewMode ? "readOnly_inputs" : " ")}>
                        <Formik
                            initialValues={{
                                quantity: 0,
                                resourceCode: 0
                            }}
                            validationSchema={documentItemValidationSchema}
                            enableReinitialize={true}
                            onSubmit={() => {
                                this.SaveItem()
                            }}                >
                            {({ errors, touched, setFieldTouched, setFieldValue, handleBlur, handleChange }) => (
                                <Form id="voItemForm" className="proForm datepickerContainer customProform" noValidate="novalidate" >
                                    <header className="main__header">
                                        <div className="main__header--div">
                                            <h2 className="zero">{Resources['addItems'][currentLanguage]}</h2>
                                        </div>
                                    </header>
                                    <div className="slider-Btns fullWidthWrapper textLeft ">
                                        <button className="primaryBtn-1 btn" type='button' onClick={e => this.setState({ ShowPopup: true })}>{Resources["items"][currentLanguage]}</button>
                                    </div>

                                    <div className='document-fields'>
                                        <div className="proForm first-proform">
                                            <div className="linebylineInput valid-input">
                                                <label className="control-label">{Resources.description[currentLanguage]}</label>
                                                <div className="inputDev ui input" >
                                                    <input className="form-control fsadfsadsa" placeholder={Resources.description[currentLanguage]}
                                                        value={this.state.seletedItem.details} autoComplete='off' onChange={(e) => this.HandelChangeItems(e, 'details')}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="proForm datepickerContainer">
                                            <div className="linebylineInput valid-input alternativeDate">
                                                <DatePicker title='receivedDate' startDate={this.state.receivedDateItem}
                                                    handleChange={e => this.setState({ receivedDateItem: e })} />
                                            </div>

                                            <div className="linebylineInput valid-input alternativeDate">
                                                <DatePicker title='dueBack' startDate={this.state.dueBackItem}
                                                    handleChange={e => this.setState({ dueBackItem: e })} />
                                            </div>

                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources['no'][currentLanguage]} </label>
                                                <div className={"inputDev ui input " + (errors.arrangeItem ? 'has-error' : !errors.arrangeItem && touched.arrangeItem ? (" has-success") : " ")}>
                                                    <input className="form-control" name='arrangeItem'
                                                        placeholder={Resources['no'][currentLanguage]}
                                                        value={this.state.arrangeItem} onChange={e => this.HandelChangeItems(e, 'arrangeItem')}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} />
                                                    {errors.arrangeItem ? (<em className="pError">{errors.arrangeItem}</em>) : null}
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources['resourceCode'][currentLanguage]} </label>
                                                <div className={"inputDev ui input " + (errors.resourceCode ? 'has-error' : !errors.resourceCode && touched.resourceCode ? (" has-success") : " ")}>
                                                    <input className="form-control" name='resourceCode'
                                                        placeholder={Resources['resourceCode'][currentLanguage]}
                                                        value={this.state.seletedItem.resourceCode} onChange={e => this.HandelChangeItems(e, 'resourceCode')}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} />
                                                    {errors.resourceCode ? (<em className="pError">{errors.resourceCode}</em>) : null}
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources['quantity'][currentLanguage]} </label>
                                                <div className={"inputDev ui input " + (errors.quantity ? 'has-error' : !errors.quantity && touched.quantity ? (" has-success") : " ")}>
                                                    <input name='quantity' className="form-control" autoComplete='off' placeholder={Resources['quantity'][currentLanguage]}
                                                        value={this.state.seletedItem.quantity} onChange={e => this.HandelChangeItems(e, 'quantity')}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }}
                                                    />
                                                    {errors.quantity ? (<em className="pError">{errors.quantity}</em>) : null}
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources.remarks[currentLanguage]}</label>
                                                <div className="ui input inputDev"  >
                                                    <input type="text" className="form-control"
                                                        value={this.state.remarks} placeholder={Resources.remarks[currentLanguage]}
                                                        onBlur={(e) => {
                                                            handleChange(e)
                                                            handleBlur(e)
                                                        }}
                                                        onChange={(e) => this.setState({ remarks: e.target.value })} />
                                                </div>
                                            </div>

                                            <div className="slider-Btns fullWidthWrapper textLeft ">
                                                {this.state.BtnLoading === false ?
                                                    <button className={"primaryBtn-1 btn " + (this.props.isViewMode === true ? ' disNone' : '')} type="submit" disabled={this.props.isViewMode} >{Resources["save"][currentLanguage]}</button>
                                                    : <button className="primaryBtn-1 btn  disabled" disabled="disabled">
                                                        <div className="spinner">
                                                            <div className="bounce1" />
                                                            <div className="bounce2" />
                                                            <div className="bounce3" />
                                                        </div>
                                                    </button>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>

                        <div className="doc-pre-cycle">
                            <header>
                                <h2 className="zero">{Resources['AddedItems'][currentLanguage]}</h2>
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
                                            <button className="defaultBtn btn smallBtn" onClick={e => this.setState({ showDeleteModal: true })}>DELETE</button>
                                        </div>
                                    </div>
                                ) : null}
                                <ReactTable
                                    filterable
                                    ref={(r) => {
                                        this.selectTable = r;
                                    }}
                                    data={this.state.Items}
                                    columns={columnsItem}
                                    defaultPageSize={10}
                                    minRows={2}
                                    noDataText={Resources['noData'][currentLanguage]}
                                />
                            </div>

                        </div>

                    </div>

                </div>
            )
        }

        let ShowAllItems = () => {

            let columnsIte = [
                {
                    Header: Resources['arrange'][currentLanguage],
                    accessor: 'arrange',
                    width: 50,
                },
                {
                    Header: Resources['description'][currentLanguage],
                    accessor: 'details',
                    width: 300,
                },
                {
                    Header: Resources['quantity'][currentLanguage],
                    accessor: 'quantity',
                    width: 100,
                },
                {
                    Header: Resources['unit'][currentLanguage],
                    accessor: 'unit',
                    width: 100,
                }, {
                    Header: Resources['unitPrice'][currentLanguage],
                    accessor: 'unitPrice',
                    width: 100,
                },
                {
                    Header: Resources['total'][currentLanguage],
                    accessor: 'total',
                    width: 100,
                },
                {
                    Header: Resources['resourceCode'][currentLanguage],
                    accessor: 'resourceCode',
                    width: 100,
                }
            ]

            return (
                <div className="precycle-grid">
                    <div className="reactTableActions">
                        <ReactTable
                            filterable
                            ref={(r) => {
                                this.selectTable = r;
                            }}
                            getTrProps={(state, rowInfo, column, instance) => {
                                return { onClick: e => { this.ChooesItem(rowInfo.original, e.target.type); } };
                            }}
                            data={this.state.AllItems}
                            columns={columnsIte}
                            defaultPageSize={5}
                            minRows={2}
                            noDataText={Resources['noData'][currentLanguage]}
                        />
                    </div>
                </div>
            )
        }

        return (
            <div className="mainContainer">

                <div className="skyLight__form">
                    <SkyLightStateless onOverlayClicked={e => this.setState({ ShowPopup: false })}
                        title={Resources['editTitle'][currentLanguage]}
                        onCloseClicked={e => this.setState({ ShowPopup: false })} isVisible={this.state.ShowPopup}>
                        {ShowAllItems()}
                    </SkyLightStateless>
                </div>


                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document one__tab one_step readOnly_inputs" : "documents-stepper noTabs__document one__tab one_step"}>
                    <HeaderDocument projectName={projectName} isViewMode={this.state.isViewMode} docTitle={Resources.equipmentDelivery[currentLanguage]} moduleTitle={Resources['procurement'][currentLanguage]} />
                    <div className="doc-container">

                        <div className="step-content">

                            {this.props.changeStatus == true ?
                                <header className="main__header">
                                    <div className="main__header--div">
                                        <h2 className="zero"> {Resources.goEdit[currentLanguage]} </h2>
                                        <p className="doc-infohead"><span> {this.state.document.refDoc}</span> - <span> {this.state.document.arrange}</span> - <span>{moment(this.state.document.docDate).format('DD/MM/YYYY')}</span></p>
                                    </div>
                                </header> : null}
                            {this.state.isLoading ? <LoadingSection /> : null}
                            {this.state.CurrentStep === 1 ?
                                <Fragment>
                                    {StepOne()}

                                </Fragment> : StepTwo()}

                        </div>

                        {/* Right Menu */}
                        <div className="docstepper-levels">
                            <div className="step-content-foot">
                                <span onClick={this.PreviousStep.bind(this)}
                                    className={this.state.CurrentStep !== 1 && this.state.isEdit === true ? "step-content-btn-prev " : "step-content-btn-prev disabled"}>
                                    <i className="fa fa-caret-left" aria-hidden="true" /> Previous</span>
                                <span onClick={this.NextStep.bind(this)} className={this.state.isEdit === true ? "step-content-btn-prev " : "step-content-btn-prev disabled"}>
                                    Next<i className="fa fa-caret-right" aria-hidden="true" /></span>
                            </div>

                            <div className="workflow-sliderSteps">
                                <div className="step-slider">
                                    <div onClick={this.StepOneLink} data-id="step1" className={'step-slider-item ' + (this.state.SecondStepComplate ? "active" : 'current__step')} >
                                        <div className="steps-timeline">
                                            <span>1</span>
                                        </div>
                                        <div className="steps-info">
                                            <h6>{Resources["equipmentDelivery"][currentLanguage]}</h6>
                                        </div>
                                    </div>
                                    <div onClick={this.StepTwoLink} data-id="step2 " className={'step-slider-item ' + (this.state.ThirdStepComplate ? 'active' : this.state.SecondStepComplate ? "current__step" : "")} >
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

                <div className="largePopup largeModal " style={{ display: this.state.showModal ? 'block' : 'none' }}>
                    <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref} title={Resources[this.state.currentTitle][currentLanguage]}>
                        beforeClose={() => { this.executeBeforeModalClose() }}  {this.state.currentComponent}
                    </SkyLight>
                </div>

                {this.state.showDeleteModal == true ? (
                    <ConfirmationModal
                        title={Resources['smartDeleteMessage'][currentLanguage].content}
                        closed={e => this.setState({ showDeleteModal: false })}
                        showDeleteModal={this.state.showDeleteModal}
                        clickHandlerCancel={e => this.setState({ showDeleteModal: false })}
                        buttonName='delete' clickHandlerContinue={this.ConfirmationDeleteItem} />
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
)(withRouter(equipmentDeliveryAddEdit))