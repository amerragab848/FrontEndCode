import React, { Component, Fragment } from 'react';
import DropdownMelcous from '../../Componants/OptionsPanels/DropdownMelcous';
import Api from '../../api'
import DatePicker from '../../Componants/OptionsPanels/DatePicker'
import moment from 'moment'
import Resources from '../../resources.json';
import _ from "lodash";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { withRouter } from "react-router-dom";
import LoadingSection from '../../Componants/publicComponants/LoadingSection';
import DataService from '../../Dataservice'
import CryptoJS from 'crypto-js';
import { toast } from "react-toastify";
import Distribution from '../../Componants/OptionsPanels/DistributionList'
import SendToWorkflow from '../../Componants/OptionsPanels/SendWorkFlow'
import DocumentApproval from '../../Componants/OptionsPanels/wfApproval'
import UploadAttachment from '../../Componants/OptionsPanels/UploadAttachment'
import ViewAttachment from '../../Componants/OptionsPanels/ViewAttachmments'
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import OptionContainer from "../../Componants/OptionsPanels/OptionContainer";
import Config from "../../Services/Config.js";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SkyLight from 'react-skylight';
import * as communicationActions from '../../store/actions/communication';
import 'react-table/react-table.css'
import ConfirmationModal from '../../Componants/publicComponants/ConfirmationModal'
import GridSetup from "./GridSetup";
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument'

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const meetingAgendaValidation = Yup.object().shape({
    meetingAgenda: Yup.string().required(Resources['subjectRequired'][currentLanguage])
});

const validationSchema = Yup.object().shape({
    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),
    calledByContact: Yup.string().required(Resources['calledByContactRequired'][currentLanguage]),
    facilitatorContact: Yup.string().required(Resources['facilitatorContactReuired'][currentLanguage]),
    noteTakerContact: Yup.string().required(Resources['noteTakerContactRequired'][currentLanguage])
});

const attendeesValidationSchema = Yup.object().shape({
    attendeesContact: Yup.string().required(Resources['fromContactRequired'][currentLanguage])
});

const topicsValidationSchema = Yup.object().shape({
    itemDescription: Yup.string().required(Resources['descriptionRequired'][currentLanguage]),
    actionByContact: Yup.string().required(Resources['actionByContactRequired'][currentLanguage])
});

let docId = 0;
let projectId = 0;
let projectName = "";
let isApproveMode = 0;
let docApprovalId = 0;
let arrange = 0;
let perviousRoute = 0;

class meetingAgendaAddEdit extends Component {

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
                }
                catch{
                    this.props.history.goBack();
                }
            }
            index++;
        }

        this.topicColumns = [
            {
                key: "no",
                name: Resources["no"][currentLanguage],
                visible: true,
                width: 50,
            },
            {
                key: "description",
                name: Resources["itemDescription"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "decision",
                name: Resources["decisions"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "action",
                name: Resources["action"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "comment",
                name: Resources["comment"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }
        ];

        this.atteneesColumns = [
            {
                key: "companyName",
                name: Resources["company"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "contactName",
                name: Resources["contact"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }
        ];

        this.state = {
            topics: [],
            showForm: false,
            step_1_Validation: meetingAgendaValidation,
            docTypeId: 35,
            topic: {
                topics: [],
                itemDescription: '',
                decision: '',
                comment: '',
                requiredDate: moment(),
                id: 0
            },
            actionByContacts: [],
            selectedActionByContact: { label: Resources.toContactRequired[currentLanguage], value: 0 },
            selectedActionByCompany: { label: Resources.toCompanyRequired[currentLanguage], value: 0 },
            selectedRow: '',
            attendees: [],
            attendeesId: 0,
            attendencesContacts: [],
            currentComponent_2: 'attendeesContact',
            pageSize: 50,
            agendaId: 0,
            btnTxt: 'save',
            CurrStep: 1,
            firstComplete: false,
            secondComplete: false,
            thirdComplete: false,
            currentTitle: "sendToWorkFlow",
            showModal: false,
            isViewMode: false,
            isApproveMode: isApproveMode,
            perviousRoute: perviousRoute,
            isView: false,
            docId: docId,
            projectId: projectId,
            docApprovalId: docApprovalId,
            arrange: arrange,
            showPopUp: false,
            btnText: 'add',
            meetingAgenda: [],
            selectedMeetingAgenda: { label: Resources.meetingMinutesSelect[currentLanguage], value: "0" },
            Companies: [],
            fromContacts: [],
            calledContacts: [],
            facilitatorContacts: [],
            noteTakerContacts: [],
            selectedTopicContact: { label: Resources.calledByContactRequired[currentLanguage], value: "0" },
            selectedTopicCompany: { label: Resources.calledByContactRequired[currentLanguage], value: "0" },
            selectedCalledByCompany: { label: Resources.calledByCompanyRequired[currentLanguage], value: "0" },
            selectedCalledByContact: { label: Resources.calledByContactRequired[currentLanguage], value: "0" },
            selectedFacilitatorCompany: { label: Resources.facilitatorCompanyRequired[currentLanguage], value: "0" },
            selectedFacilitatorContact: { label: Resources.facilitatorContactReuired[currentLanguage], value: "0" },
            selectedNoteTakerCompany: { label: Resources.noteTakerCompanyReuired[currentLanguage], value: "0" },
            selectedNoteTakerContact: { label: Resources.noteTakerContactRequired[currentLanguage], value: "0" },
            isLoading: true,
            permission: [{ name: 'sendByEmail', code: 458 }, { name: 'sendByInbox', code: 457 },
            { name: 'sendTask', code: 0 }, { name: 'distributionList', code: 967 },
            { name: 'createTransmittal', code: 3055 }, { name: 'sendToWorkFlow', code: 719 },
            { name: 'viewAttachments', code: 3324 }, { name: 'deleteAttachments', code: 838 }],
            document: {},
        }
        if (!Config.IsAllow(452) && !Config.IsAllow(453) && !Config.IsAllow(455)) {
            toast.warning(Resources['missingPermissions'][currentLanguage])
            this.props.history.push(this.state.perviousRoute);
        }
    }

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!Config.IsAllow(453)) {
                this.setState({ isViewMode: true });
            }
            if (this.state.isApproveMode != true && Config.IsAllow(453)) {
                if (this.props.hasWorkflow == false && Config.IsAllow(453)) {
                    if (this.props.document.status !== false && Config.IsAllow(453)) {
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

    fillDropDowns(isEdit) {

        DataService.GetDataList('GetProjectProjectsCompaniesForList?projectId=' + projectId, 'companyName', 'companyId').then(res => {

            if (isEdit) {

                let calledByCompanyId = this.state.document.calledByCompanyId;

                if (calledByCompanyId) {
                    this.setState({
                        selectedCalledByCompany: { label: this.props.document.calledByCompanyName, value: calledByCompanyId }
                    });
                    this.fillSubDropDownInEdit('GetContactsByCompanyId', 'companyId', calledByCompanyId, 'calledByContactId', 'calledByContactName', 'selectedCalledByContact', 'calledContacts');
                }

                let facilitatorCompanyId = this.state.document.facilitatorCompanyId;

                if (facilitatorCompanyId) {
                    this.setState({
                        selectedFacilitatorCompany: { label: this.props.document.facilitatorCompanyName, value: facilitatorCompanyId }
                    });
                    this.fillSubDropDownInEdit('GetContactsByCompanyId', 'companyId', facilitatorCompanyId, 'facilitatorContactId', 'facilitatorContactName', 'selectedFacilitatorContact', 'facilitatorContacts');
                }

                let noteTakerCompanyId = this.state.document.noteTakerCompanyId;

                if (noteTakerCompanyId) {
                    this.setState({
                        selectedNoteTakerCompany: { label: this.props.document.noteTakerCompanyName, value: noteTakerCompanyId }
                    });
                    this.fillSubDropDownInEdit('GetContactsByCompanyId', 'companyId', noteTakerCompanyId, 'noteTakerContactId', 'noteTakerContactName', 'selectedNoteTakerContact', 'noteTakerContacts');
                }
            }
            this.setState({ CompanyData: [...res], isLoading: false })
        })
    }

    componentDidMount() {
        if (this.state.docId > 0) {
            this.setState({ isLoading: true })
            this.props.actions.documentForEdit('GetCommunicationMeetingAgendaForEdit?id=' + this.state.docId, this.state.docTypeId, 'meetingAganda').then(() => {
                this.setState({ agendaId: this.state.docId, isLoading: false, showForm: true })
                this.checkDocumentIsView();
                this.getTabelData()
            })
        } else {
            this.props.actions.documentForAdding()
            DataService.GetDataList('GetCommunicationMeetingMinutesForAgenda?projectId=' + this.state.projectId, 'subject', 'id').then(res => {
                this.setState({ meetingAgenda: res })
            })
            let cmi = Config.getPayload().cmi
            let cni = Config.getPayload().cni
            Api.get('GetNextArrangeMainDoc?projectId=' + this.state.projectId + '&docType=' + this.state.docTypeId + '&companyId=' + cmi + '&contactId=' + cni).then(res => {
                this.setState({ document: { ...this.state.document, arrange: res }, isLoading: false })
            })
            this.fillDropDowns(false);
            let document = {
                arrange: '',
                projectId: this.state.projectId,
                subject: '',
                docDate: moment(),
                meetingMinutesId: '',
                status: true,
                calledByCompanyId: '',
                calledByContactId: '',
                facilitatorCompanyId: '',
                facilitatorContactId: '',
                noteTakerCompanyId: '',
                noteTakerContactId: '',
                statusName: '',
                calledByContactName: '',
                facilitatorContactName: '',
                facilitatorCompanyName: '',
                noteTakerCompanyName: '',
                noteTakerContactName: '',
            };
            this.setState({ document });
        }
        DataService.GetDataList('GetProjectProjectsCompaniesForList?projectId=' + this.state.projectId, 'companyName', 'companyId').then(res => {
            this.setState({ Companies: res, isLoading: false })
        })
    }

    getTabelData() {

        let attendeesTable = []

        this.setState({ isLoading: true })

        this.props.actions.GetAttendeesTable('GetCommunicationMeetingAgendaAttendees?agendaId=' + this.state.agendaId).then(res => {

            this.props.attendees.forEach((element, index) => {

                attendeesTable.push({
                    id: element.Id,
                    companyId: element.companyId,
                    contactId: element.contactId,
                    companyName: element.companyName,
                    contactName: element.contactName
                })
            })

            this.setState({ attendees: attendeesTable })

            setTimeout(() => { this.setState({ isLoading: false }) }, 500)
        })

        let topicstable = []

        this.setState({ isLoading: true })

        this.props.actions.GetTopicsTable('GetCommunicationMeetingAgendaTopics?agendaId=' + this.state.agendaId).then(res => {

            let data = { items: this.props.topics };

            this.props.actions.ExportingData(data);

            this.props.topics.forEach((element, index) => {

                topicstable.push({
                    id: element.Id,
                    no: index + 1,
                    description: element.description,
                    decision: element.decisions,
                    action: element.action,
                    comment: element.comment,
                    byWhomCompanyId: element.calledByCompanyId,
                    byWhomContactId: element.calledByContactId,
                    requiredDate: element.requiredDate
                })
            })

            this.setState({ topics: topicstable })

            setTimeout(() => { this.setState({ isLoading: false }) }, 500)
        })
    }

    componentDidUpdate(prevProps) {
        if (this.props.hasWorkflow !== prevProps.hasWorkflow) {
            this.checkDocumentIsView();
        }
        if (prevProps.showModal != this.props.showModal) {
            this.setState({ showModal: this.props.showModal });
        }
    }

    componentWillReceiveProps(props, state) {
        if (props.document && props.document.id > 0) {
            this.setState({
                document: { ...props.document },
                step_1_Validation: validationSchema
            }, function () {
                let docDate = this.state.document.docDate != null ? moment(this.state.document.docDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
                this.setState({ document: { ...this.state.document, docDate: docDate } });
            });
            this.fillDropDowns(true);
            this.checkDocumentIsView();
        }
        if (this.state.showModal != props.showModal) {
            this.setState({ showModal: props.showModal });
        }
    }

    componentWillUnmount() {
        this.props.actions.clearCashDocument();
        this.props.actions.documentForAdding()
    }

    viewAttachments() {
        return (this.state.docId > 0 ? (Config.IsAllow(3324) === true ? <ViewAttachment docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={projectId} deleteAttachments={838} /> : null) : null)
    }

    addMeetingAgenda = () => {

        this.setState({ isLoading: true })

        let documentObj = { ...this.state.document };

        documentObj.docDate = moment(documentObj.docDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');

        documentObj.docLocationId = 0

        DataService.addObject('AddMeetingAgendaWithMeetingMinutes', documentObj).then(result => {

            this.setState({
                agendaId: result.id,
                docId: result.id,
                isLoading: false,
                calledContacts: [],
                btnTxt: 'next'
            });

            toast.success(Resources["operationSuccess"][currentLanguage]);
        })
    }

    editMeeting = () => {
        this.setState({
            isLoading: true,
            firstComplete: true
        });
        let docDate = moment(this.state.document.docDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS')

        let document = Object.assign(this.state.document, { docDate: docDate })

        Api.post('EditCommunicationMeetingAgenda', document).then(result => {
            this.setState({
                isLoading: false,
                CurrStep: this.state.CurrStep + 1
            });
            toast.success(Resources["operationSuccess"][currentLanguage]);
        });
    }

    addEditTopics = (edit) => {
        this.setState({ isLoading: true })

        let topic = {
            requiredDate: moment(this.state.topic.requiredDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
            itemDescription: this.state.topic.itemDescription,
            agendaId: this.state.agendaId,
            decisions: this.state.topic.decision,
            action: this.state.topic.action,
            byWhomCompanyId: this.state.selectedActionByCompany.value,
            byWhomContactId: this.state.selectedActionByContact.value,
            comment: this.state.topic.comment,
            id: this.state.topic.id
        }

        let url = edit ? 'EditCommunicationMeetingAgendaTopics' : 'AddCommunicationMeetingAgendaTopics'

        Api.post(url, topic).then((res) => {

            toast.success(Resources["operationSuccess"][currentLanguage]);

            if (edit) {

                let id = this.state.topic.id

                let topics = _.filter(this.state.topics, function (x) { return x.id != id; });

                topics.push({
                    id: res.id,
                    no: this.state.topics.length + 1,
                    description: res.itemDescription,
                    decision: res.decisions,
                    action: res.action,
                    comment: res.comment,
                    byWhomCompanyId: res.byWhomCompanyId,
                    byWhomContactId: res.byWhomContactId,
                    requiredDate: res.requiredDate
                })
                this.setState({ showPopUp: false, topics: topics })
            }
            else {

                let data = [];

                data.push({
                    id: res.id,
                    no: this.state.topics.length + 1,
                    description: res.itemDescription,
                    decision: res.decisions,
                    action: res.action,
                    comment: res.comment,
                    byWhomCompanyId: res.byWhomCompanyId,
                    byWhomContactId: res.byWhomContactId,
                    requiredDate: res.requiredDate
                })

                data = [...data, ...this.state.topics];

                this.setState({ topics: data })
            }

            this.setState({
                topic: { itemDescription: '', action: '', comment: '', decision: '', requiredDate: moment() },
                selectedActionByContact: { label: Resources.toContactRequired[currentLanguage], value: "0" },
                selectedActionByCompany: { label: Resources.toCompanyRequired[currentLanguage], value: "0" },
                isLoading: false,
                showPopUp: false,
                btnText: 'add'
            });
        })
    }

    addEditAttendees = () => {

        this.setState({ isLoading: true })

        let attendees = {
            companyId: this.state.selectedActionByCompany.value,
            contactId: this.state.selectedActionByContact.value,
            id: this.state.attendeesId,
            agendaId: this.state.agendaId
        }

        let url = this.state.showPopUp ? 'EditCommunicationMeetingAgendaAttendees' : 'AddCommunicationMeetingAgendaAttendees'

        Api.post(url, attendees).then((res) => {

            let id = this.state.attendeesId

            if (this.state.showPopUp) {

                let attendess = _.filter(this.state.attendees, function (x) { return x.id != id; });

                this.setState({ showPopUp: false, attendees: attendess }, function () {

                    let data = [...this.state.attendees];

                    data.push({
                        id: id,
                        companyId: this.state.selectedActionByCompany.value,
                        contactId: this.state.selectedActionByContact.values,
                        companyName: this.state.selectedActionByCompany.label,
                        contactName: this.state.selectedActionByContact.label
                    })

                    this.setState({ attendees: data })
                })
            }
            else {
                let data = [...this.state.attendees];

                data.push({
                    id: id,
                    companyId: this.state.selectedActionByCompany.value,
                    contactId: this.state.selectedActionByContact.values,
                    companyName: this.state.selectedActionByCompany.label,
                    contactName: this.state.selectedActionByContact.label
                })
                this.setState({ attendees: data })

            }

            toast.success(Resources["operationSuccess"][currentLanguage]);

            this.setState({
                attendencesContacts: [],
                selectedActionByContact: { label: Resources.toContactRequired[currentLanguage], value: "0" },
                selectedActionByCompany: { label: Resources.toCompanyRequired[currentLanguage], value: "0" },
                isLoading: false,
                showPopUp: false,
                btnText: 'add'
            });
        })
    }

    onCloseModal() {
        this.setState({ showDeleteModal: false });
    }

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });
    }

    ConfirmDelete = () => {

        this.setState({ isLoading: true })

        if (this.state.CurrStep == 2) {
            Api.get('CommunicationMeetingAgendaAttendeesDelete?id=' + this.state.selectedRow[0]).then((res) => {
                toast.success(Resources["operationSuccess"][currentLanguage]);
                let data = this.state.attendees.filter(item => item.id != this.state.selectedRow[0]);
                this.setState({ attendees: data, showDeleteModal: false, isLoading: false });
            }).catch(() => {
                toast.error(Resources["operationCanceled"][currentLanguage]);
            })
        }

        if (this.state.CurrStep == 3) {
            Api.post('CommunicationMeetingAgendaTopicsDelete?id=' + this.state.selectedRow[0]).then((res) => {
                toast.success(Resources["operationSuccess"][currentLanguage]);
                let data = this.state.topics.filter(item => item.id != this.state.selectedRow[0]);
                this.setState({ topics: data, showDeleteModal: false, isLoading: false });
            })
        }
    }

    fillSubDropDownInEdit(url, param, value, subFieldId, subFieldName, subSelectedValue, subDatasource) {
        this.setState({ isLoading: true })
        let action = url + "?" + param + "=" + value
        DataService.GetDataList(action, 'contactName', 'id').then(result => {
            if (this.props.changeStatus === true) {
                let _SubFieldId = this.state.document[subFieldId];
                let _SubFieldName = this.state.document[subFieldName];
                let targetFieldSelected = { label: _SubFieldName, value: _SubFieldId };
                this.setState({
                    [subSelectedValue]: targetFieldSelected,
                    [subDatasource]: result,
                    isLoading: false
                });
            }
        });
    }

    updateSelectedValue = (selected, label, value, targetSelected) => {
        this.setState({ isLoading: true })
        let original_document = { ...this.state.document };
        let updated_document = {};
        updated_document[value] = selected.value;
        updated_document[label] = selected.label;
        updated_document = Object.assign(original_document, updated_document);
        this.setState({
            document: updated_document,
            [targetSelected]: selected,
            isLoading: false
        });
    }

    handleChangeDropDowns = (item, lbl, val, selected, listData, selected_subScripe, initialState) => {
        this.setState({ isLoading: true })
        DataService.GetDataList('GetContactsByCompanyId?companyId=' + item.value, 'contactName', 'id').then(res => {
            this.setState({
                [listData]: res, isLoading: false, [selected]: item,
                [selected_subScripe]: { label: Resources[initialState][currentLanguage], value: "0" },
            })
        })
        this.updateSelectedValue(item, lbl, val)
    }

    handleChange = (key, value) => {
        this.setState({ document: { ...this.state.document, [key]: value } })
    }

    NextStep = (next) => {

        window.scrollTo(0, 0);

        switch (this.state.CurrStep) {
            case 1:
                if (next == true) {
                    this.editMeeting();
                }
                else if (this.state.docId > 0) {
                    let CurrStep = this.state.CurrStep + 1
                    this.setState({ firstComplete: true, CurrStep })
                }
                this.setState({
                    fromContacts: [],
                    selectedCalledByCompany: { label: Resources.calledByCompanyRequired[currentLanguage], value: "0" },
                    selectedCalledByContact: { label: Resources.calledByContactRequired[currentLanguage], value: "0" },
                    calledByContact: []
                })
                break;
            case 2:
                this.setState({
                    CurrStep: this.state.CurrStep + 1, secondComplete: true,
                    actionByContacts: [],
                    selectedActionByContact: { label: Resources.toContactRequired[currentLanguage], value: 0 },
                    selectedActionByCompany: { label: Resources.toCompanyRequired[currentLanguage], value: 0 },
                    isLoading: false
                })
                break;
            case 3:
                this.props.history.push({ pathname: 'CommunicationMeetingAgenda/' + this.state.projectId })
                break;
        }
    }

    PreviousStep = () => {
        window.scrollTo(0, 0)
        switch (this.state.CurrStep) {
            case 2:
                this.setState({ CurrStep: this.state.CurrStep - 1, secondComplete: false })
                break;
            case 3:
                this.setState({ CurrStep: this.state.CurrStep - 1, thirdComplete: false })
                break;
        }
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

    onRowClick = (value, index, column) => {
        console.log('selected', value)
        let id = value['id']
        if (!Config.IsAllow(11)) {
            toast.warning("you don't have permission");
        }
        else if (column.key != 0) {
            this.setState({ showPopUp: true, btnText: 'save' })
            if (this.state.CurrStep == 3) {
                let actionByCompany = _.find(this.state.Companies, function (company) { return company.value == value.byWhomCompanyId })
                this.setState({ isLoading: true })
                DataService.GetDataList('GetContactsByCompanyId?companyId=' + value.byWhomCompanyId, 'contactName', 'id').then(res => {
                    let actionByContact = _.find(res, function (x) { return x.value == value.byWhomContactId })
                    this.setState({
                        topic: { itemDescription: value.description, action: value.action, decision: value.decision, comment: value.comment, id: value.id, requiredDate: moment(value.requiredDate) },
                        selectedActionByCompany: actionByCompany, selectedActionByContact: actionByContact, actionByContacts: res, isLoading: false
                    })
                })
            }
            else if (this.state.CurrStep == 2) {
                let actionByCompany = { label: value.companyName, value: value.companyId }
                this.setState({ isLoading: true })
                DataService.GetDataList('GetContactsByCompanyId?companyId=' + value.companyId, 'contactName', 'id').then(res => {
                    let actionByContact = { label: value.contactName, value: value.companyId }
                    this.setState({
                        attendeesId: value.id,
                        selectedActionByCompany: actionByCompany, selectedActionByContact: actionByContact, attendencesContacts: res, isLoading: false
                    })
                })
            }
            this.simpleDialog1.show()
        }
    }

    clickHandlerDeleteRowsMain = selectedRows => {
        this.setState({
            showDeleteModal: true,
            selectedRow: selectedRows
        });
    };

    _executeBeforeModalClose = () => {
        this.setState({
            showPopUp: false, btnText: 'add', topic: { requiredDate: moment() },
            selectedActionByContact: { label: Resources.toContactRequired[currentLanguage], value: "0" },
            selectedActionByCompany: { label: Resources.toCompanyRequired[currentLanguage], value: "0" }
        })
    }

    showBtnsSaving() {
        let btn = null;
        if (this.state.docId === 0) {
            btn = <button className="primaryBtn-1 btn meduimBtn" type="submit" >{Resources.save[currentLanguage]}</button>;
        } else if (this.state.docId > 0) {
            btn = <button className={this.state.isViewMode === true ? "primaryBtn-1 btn meduimBtn disNone" : "primaryBtn-1 btn meduimBtn"} type='submit'>{Resources.next[currentLanguage]}</button>
        }
        return btn;
    }

    StepOneLink = () => {
        if (docId !== 0) {
            this.setState({
                firstComplete: true,
                secondComplete: false,
                CurrStep: 1,
                thirdComplete: false,
            })
        }
    }

    StepTwoLink = () => {
        if (docId !== 0) {
            this.setState({
                firstComplete: true,
                secondComplete: true,
                CurrStep: 2,
                thirdComplete: false,

            })
        }
    }

    StepThreeLink = () => {
        if (docId !== 0) {
            this.setState({
                thirdComplete: true,
                CurrStep: 3,
                firstComplete: true,
                secondComplete: true,
            })
        }
    }

    render() {
        const dataGridTopic = this.state.isLoading === false ? (
            <GridSetup rows={this.state.topics}
                showCheckbox={true}
                pageSize={this.state.pageSize}
                onRowClick={this.onRowClick}
                columns={this.topicColumns}
                clickHandlerDeleteRows={this.clickHandlerDeleteRowsMain}
                single={true}
                key='topic'
            />) : <LoadingSection />;

        const dataGridAttendees = this.state.isLoading === false ? (
            <GridSetup
                rows={this.state.attendees}
                showCheckbox={true}
                pageSize={this.state.pageSize}
                onRowClick={this.onRowClick}
                columns={this.atteneesColumns}
                clickHandlerDeleteRows={this.clickHandlerDeleteRowsMain}
                single={true}
                key='attendess'
            />) : <LoadingSection />;


        const topicContent = <div className="document-fields">
            {this.state.isLoading ? <LoadingSection /> : null}
            <Formik
                initialValues={{
                    itemDescription: this.state.topic.itemDescription,
                    actionByContact: this.state.selectedActionByContact.value > 0 ? this.state.selectedActionByContact : ''
                }}
                enableReinitialize={true}
                validationSchema={topicsValidationSchema}
                onSubmit={(values) => {
                    if (this.state.showPopUp)
                        this.addEditTopics(true)
                    else
                        this.addEditTopics(false)
                }}>
                {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldTouched, setFieldValue, values }) => (
                    <Form id=" MinutesOfMeeting" className="proForm datepickerContainer" noValidate="novalidate" onSubmit={handleSubmit}>
                        <div className="linebylineInput valid-input firstBigInput">
                            <label className="control-label">{Resources['itemDescription'][currentLanguage]} </label>
                            <div className={"inputDev ui input " + (errors.itemDescription ? 'has-error' : !errors.itemDescription && touched.itemDescription ? (" has-success") : " ")}>
                                <input name='itemDescription'
                                    className="form-control"
                                    id="itemDescription" placeholder={Resources['itemDescription'][currentLanguage]} autoComplete='off'
                                    onBlur={handleBlur} value={this.state.topic.itemDescription}
                                    onChange={e => { handleChange(e); this.setState({ topic: { ...this.state.topic, itemDescription: e.target.value } }) }} />
                                {errors.itemDescription ? (<em className="pError">{errors.itemDescription}</em>) : null}
                            </div>
                        </div>
                        <div className="linebylineInput valid-input alternativeDate">
                            <DatePicker title='requiredDate'
                                startDate={this.state.topic.requiredDate}
                                handleChange={(e) => {
                                    handleChange(e)
                                    this.setState({ topic: { ...this.state.topic, requiredDate: e } })
                                }} />
                        </div>
                        <div className="linebylineInput valid-input">
                            <label className="control-label">{Resources['action'][currentLanguage]} </label>
                            <div className={'ui input inputDev '}>
                                <input name='action' className="form-control" id="action" placeholder={Resources['action'][currentLanguage]} autoComplete='off'
                                    value={this.state.topic.action}
                                    onChange={e => { handleChange(e); this.setState({ topic: { ...this.state.topic, action: e.target.value } }) }} />
                            </div>
                        </div>
                        <div className="linebylineInput valid-input mix_dropdown">
                            <label className="control-label">{Resources['actionByCompany'][currentLanguage]}</label>
                            <div className="supervisor__company">
                                <div className="super_name">
                                    <DropdownMelcous
                                        name="actionByompany"
                                        data={this.state.Companies}
                                        handleChange={e => this.handleChangeDropDowns(e, 'fromCompanyName', 'fromCompanyId', 'selectedActionByCompany', 'actionByContacts', 'selectedActionByContact', 'toContactRequired')}
                                        placeholder='actionByCompany'
                                        selectedValue={this.state.selectedActionByCompany}
                                    />
                                </div>
                                <div className="super_company">
                                    <DropdownMelcous
                                        name="actionByContact"
                                        data={this.state.actionByContacts}
                                        handleChange={e => this.setState({ selectedActionByContact: e })}
                                        placeholder='ContactName'
                                        selectedValue={this.state.selectedActionByContact}
                                        onChange={setFieldValue}
                                        onBlur={setFieldTouched}
                                        error={errors.actionByContact}
                                        touched={touched.actionByContact}
                                        id="actionByContact"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="linebylineInput valid-input linebylineInput__name">
                            <label className="control-label">{Resources['decision'][currentLanguage]} </label>
                            <div className={'ui input inputDev '}>
                                <input name='decision' onChange={e => { handleChange(e); this.setState({ topic: { ...this.state.topic, decision: e.target.value } }) }} className="form-control" id="decision"
                                    placeholder={Resources['decision'][currentLanguage]} autoComplete='off' value={this.state.topic.decision}
                                />
                            </div>
                        </div>
                        <div className="linebylineInput valid-input ">
                            <label className="control-label">{Resources['comment'][currentLanguage]} </label>
                            <div className={'ui input inputDev '}>
                                <input name='comment' className="form-control" id='comment' placeholder={Resources['comment'][currentLanguage]} autoComplete='off'
                                    onChange={e => { handleChange(e); this.setState({ topic: { ...this.state.topic, comment: e.target.value } }) }} value={this.state.topic.comment}
                                />
                            </div>
                        </div>
                        <div className="slider-Btns fullWidthWrapper textLeft">
                            <button className={"primaryBtn-1 btn"} type="submit"  >{Resources[this.state.btnText][currentLanguage]}</button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
        const attendeesContent = <Fragment>
            <div className="document-fields">
                {this.state.isLoading ? <LoadingSection /> : null}
                <Formik enableReinitialize={true}
                    initialValues={{
                        attendeesContact: this.state.selectedActionByContact.value > 0 ? this.state.selectedActionByContact.value : ''
                    }}
                    validationSchema={attendeesValidationSchema}
                    onSubmit={(values) => {
                        this.addEditAttendees()
                    }}>
                    {({ errors, touched, setFieldTouched, setFieldValue, handleBlur, handleChange }) => (
                        <Form id="signupForm1" className="proForm datepickerContainer customProform" noValidate="novalidate">
                            <div className="linebylineInput valid-input mix_dropdown">
                                <label className="control-label">{Resources['actionByCompany'][currentLanguage]}</label>
                                <div className="supervisor__company">
                                    <div className="super_name">
                                        <DropdownMelcous
                                            name="actionBycompany"
                                            data={this.state.Companies}
                                            handleChange={e => this.handleChangeDropDowns(e, 'fromCompanyName', 'fromCompanyId', 'selectedActionByCompany', 'attendencesContacts', 'selectedActionByContact', 'toContactRequired')}
                                            placeholder='actionByCompany'
                                            selectedValue={this.state.selectedActionByCompany}
                                        />
                                    </div>
                                    <div className="super_company">
                                        <DropdownMelcous
                                            name="attendeesContact"
                                            data={this.state.attendencesContacts}
                                            handleChange={e => this.setState({ selectedActionByContact: e })}
                                            placeholder='ContactName'
                                            selectedValue={this.state.selectedActionByContact}
                                            onChange={setFieldValue}
                                            onBlur={setFieldTouched}
                                            error={errors.attendeesContact}
                                            touched={touched.attendeesContact}
                                            id="attendeesContact"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="slider-Btns">
                                <button className={"primaryBtn-1 btn meduimBtn  "} type='submit'>
                                    {Resources[this.state.btnText][currentLanguage]}</button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>

        </Fragment>

        let actions = [
            { title: "distributionList", value: <Distribution docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />, label: Resources["distributionList"][currentLanguage] },
            { title: "sendToWorkFlow", value: <SendToWorkflow docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />, label: Resources["sendToWorkFlow"][currentLanguage] },
            { title: "documentApproval", value: <DocumentApproval docTypeId={this.state.docTypeId} docId={this.state.docId} previousRoute={this.state.perviousRoute} approvalStatus={true} projectId={this.state.projectId} docApprovalId={this.state.docApprovalId} currentArrange={this.state.arrange} />, label: Resources["documentApproval"][currentLanguage] },
            { title: "documentApproval", value: <DocumentApproval docTypeId={this.state.docTypeId} docId={this.state.docId} previousRoute={this.state.perviousRoute} approvalStatus={false} projectId={this.state.projectId} docApprovalId={this.state.docApprovalId} currentArrange={this.state.arrange} />, label: Resources["documentApproval"][currentLanguage] }
        ];

        let Step_1 = <Fragment>
            <div className="document-fields">
                {this.state.isLoading ? <LoadingSection /> : null}
                <Formik validationSchema={this.state.step_1_Validation}
                    initialValues={{
                        meetingAgenda: '',
                        subject: this.state.document.subject,
                        calledByContact: this.state.document.calledByContactName,
                        facilitatorContact: this.state.document.facilitatorContactName,
                        noteTakerContact: this.state.document.noteTakerContactName
                    }}
                    enableReinitialize={true}
                    onSubmit={(values) => {
                        if (this.props.showModal) { return; }
                        if (this.props.changeStatus === false && this.state.docId === 0) {
                            this.addMeetingAgenda()
                        } else {
                            this.NextStep(this.props.changeStatus);
                        }
                    }}>
                    {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldTouched, setFieldValue }) => (
                        <Form id="MinutesOfMeeting" className="proForm datepickerContainer" noValidate="novalidate" onSubmit={handleSubmit}>
                            {this.state.docId == 0 ?
                                <div className="linebylineInput valid-input">
                                    <label className="control-label">{Resources['meetingMinutes'][currentLanguage]}</label>
                                    <DropdownMelcous
                                        name="meetingAgenda"
                                        data={this.state.meetingAgenda}
                                        handleChange={e => {
                                            this.setState({
                                                showForm: true, step_1_Validation: validationSchema, selectedMeetingAgenda: e,
                                                document: { ...this.state.document, meetingMinutesId: e.value }
                                            })
                                        }}
                                        placeholder='meetingAgenda'
                                        selectedValue={this.state.selectedMeetingAgenda}
                                        onChange={setFieldValue}
                                        onBlur={setFieldTouched}
                                        error={errors.meetingAgenda}
                                        touched={touched.meetingAgenda}
                                        index="meetingAgenda"
                                        id="meetingAgenda" />
                                </div> : null}
                            <div className="linebylineInput valid-input alternativeDate">
                                <DatePicker title='docDate'
                                    startDate={this.state.document.docDate}
                                    handleChange={e => this.handleChange('docDate', e)} />
                            </div>
                            {!this.state.showForm ?
                                <div className="slider-Btns fullWidthWrapper textLeft">
                                    <button className="primaryBtn-1 btn"
                                    >{Resources['add'][currentLanguage]}</button>
                                </div> : null
                            }
                            {this.state.showForm ?
                                <Fragment>
                                    <div className="proForm first-proform fullWidth_form">
                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">{Resources['subject'][currentLanguage]} </label>
                                            <div className={"inputDev ui input " + (errors.subject && touched.subject ? 'has-error' : !errors.subject && touched.subject ? (" has-success") : " ")}>
                                                <input name='subject' defaultValue={this.state.document.subject}
                                                    className="form-control"
                                                    id="subject" placeholder={Resources['subject'][currentLanguage]} autoComplete='off'
                                                    onBlur={handleBlur}
                                                    onChange={e => {
                                                        handleChange(e)
                                                        this.handleChange('subject', e.target.value)
                                                    }} />
                                                {touched.subject ? (<em className="pError">{errors.subject}</em>) : null}
                                            </div>
                                        </div>
                                        <div className="linebylineInput">
                                            <label data-toggle="tooltip" title={Resources['status'][currentLanguage]} className="control-label"> {Resources['status'][currentLanguage]} </label>
                                            <div className="ui checkbox radio radioBoxBlue">
                                                <input type="radio" defaultChecked name="status" defaultChecked={this.state.document.status === false ? null : 'checked'} value="true" onChange={e => this.handleChange('status', "true")} />
                                                <label>{Resources['oppened'][currentLanguage]}</label>
                                            </div>
                                            <div className="ui checkbox radio radioBoxBlue checked">
                                                <input type="radio" name="status" defaultChecked={this.state.document.status === false ? 'checked' : null} value="false" onChange={e => this.handleChange('status', "false")} />
                                                <label> {Resources['closed'][currentLanguage]}</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="linebylineInput valid-input">
                                        <label className="control-label">{Resources['arrange'][currentLanguage]} </label>
                                        <div className={'ui input inputDev '}>
                                            <input name='arrange' className="form-control" id="arrange" placeholder={Resources['arrange'][currentLanguage]} autoComplete='off'
                                                readOnly defaultValue={this.state.document.arrange} onChange={e => this.handleChange('arrange', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="linebylineInput valid-input linebylineInput__name">
                                        <label className="control-label">{Resources['handouts'][currentLanguage]} </label>
                                        <div className={'ui input inputDev '}>
                                            <input name='handouts' className="form-control" id="handouts" placeholder={Resources['handouts'][currentLanguage]} autoComplete='off'
                                                defaultValue={this.state.document.handouts} onChange={e => this.handleChange('handouts', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="linebylineInput valid-input ">
                                        <label className="control-label">{Resources['reference'][currentLanguage]} </label>
                                        <div className={'ui input inputDev '}>
                                            <input name='refDoc' className="form-control" id="refDoc" placeholder={Resources['reference'][currentLanguage]} autoComplete='off'
                                                defaultValue={this.state.document.refDoc} onChange={e => this.handleChange('refDoc', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="linebylineInput valid-input mix_dropdown">
                                        <label className="control-label">{Resources['calledByCompany'][currentLanguage]}</label>
                                        <div className="supervisor__company">
                                            <div className="super_name">
                                                <DropdownMelcous
                                                    name='calledCompany'
                                                    data={this.state.Companies}
                                                    handleChange={(e) => this.handleChangeDropDowns(e, 'calledByCompanyName', 'calledByCompanyId', 'selectedCalledByCompany', 'calledContacts', 'selectedCalledByContact', 'calledByContactRequired')}
                                                    placeholder='calledByCompany'
                                                    selectedValue={this.state.selectedCalledByCompany} />
                                            </div>
                                            <div className="super_company">
                                                <DropdownMelcous
                                                    name='calledByContact'
                                                    data={this.state.calledContacts}
                                                    handleChange={e => this.updateSelectedValue(e, 'calledByContactName', 'calledByContactId', 'selectedCalledByContact')}
                                                    placeholder='calledByContact'
                                                    selectedValue={this.state.selectedCalledByContact}
                                                    onChange={setFieldValue}
                                                    onBlur={setFieldTouched}
                                                    error={errors.calledByContact}
                                                    touched={touched.calledByContact} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="linebylineInput valid-input mix_dropdown">
                                        <label className="control-label">{Resources['facilitatorContact'][currentLanguage]}</label>
                                        <div className="supervisor__company">
                                            <div className="super_name">
                                                <DropdownMelcous
                                                    name='facilitatorCompany'
                                                    data={this.state.Companies}
                                                    handleChange={(e) => this.handleChangeDropDowns(e, 'facilitatorCompanyName', 'facilitatorCompanyId', 'selectedFacilitatorCompany', 'facilitatorContacts', 'selectedFacilitatorContact', 'facilitatorContactReuired')}
                                                    placeholder='facilitatorCompany'
                                                    selectedValue={this.state.selectedFacilitatorCompany} />
                                            </div>
                                            <div className="super_company">
                                                <DropdownMelcous
                                                    name='facilitatorContact'
                                                    data={this.state.facilitatorContacts}
                                                    handleChange={e => this.updateSelectedValue(e, 'facilitatorContactName', 'facilitatorContactId', 'selectedFacilitatorContact')}
                                                    placeholder='facilitatorContact'
                                                    selectedValue={this.state.selectedFacilitatorContact}
                                                    onChange={setFieldValue}
                                                    onBlur={setFieldTouched}
                                                    error={errors.facilitatorContact}
                                                    touched={touched.facilitatorContact} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="linebylineInput valid-input mix_dropdown">
                                        <label className="control-label">{Resources['noteTakerCompany'][currentLanguage]}</label>
                                        <div className="supervisor__company">
                                            <div className="super_name">
                                                <DropdownMelcous
                                                    name='noteTakerCompany'
                                                    data={this.state.Companies}
                                                    handleChange={(e) => this.handleChangeDropDowns(e, 'noteTakerCompanyName', 'noteTakerCompanyId', 'selectedNoteTakerCompany', 'noteTakerContacts', 'selectedNoteTakerContact', 'noteTakerContactRequired')}
                                                    placeholder='noteTakerCompany'
                                                    selectedValue={this.state.selectedNoteTakerCompany} />
                                            </div>
                                            <div className="super_company">
                                                <DropdownMelcous
                                                    name='noteTakerContact'
                                                    data={this.state.noteTakerContacts}
                                                    handleChange={e => this.updateSelectedValue(e, 'noteTakerContactName', 'noteTakerContactId', 'selectedNoteTakerContact')}
                                                    placeholder='noteTakerContact'
                                                    selectedValue={this.state.selectedNoteTakerContact}
                                                    onChange={setFieldValue}
                                                    onBlur={setFieldTouched}
                                                    error={errors.noteTakerContact}
                                                    touched={touched.noteTakerContact} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="slider-Btns">
                                        {this.showBtnsSaving()}
                                    </div>
                                </Fragment>
                                : null}
                        </Form>
                    )}
                </Formik>
            </div>
            <div className="doc-pre-cycle">
                <div>
                    {this.state.docId > 0 && this.state.isViewMode === false ? (<UploadAttachment changeStatus={this.props.changeStatus} AddAttachments={837} EditAttachments={3230} ShowDropBox={3621} ShowGoogleDrive={3622} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />) : null}
                    {this.viewAttachments()}
                    {this.props.changeStatus === true ? <ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} /> : null}
                </div>
            </div>
        </Fragment>
        let Step_2 = <Fragment>
            {attendeesContent}
            <div className="doc-pre-cycle letterFullWidth">
                <div className='precycle-grid'>
                    {dataGridAttendees}
                    <div className="slider-Btns">
                        <button className="primaryBtn-1 btn meduimBtn  " type="submit" onClick={this.NextStep}>{Resources.next[currentLanguage]}</button>
                    </div>
                </div>
            </div>
        </Fragment>
        let Step_3 = <Fragment>
            {topicContent}
            <div className="doc-pre-cycle letterFullWidth">
                <div className='precycle-grid'>
                    {dataGridTopic}
                    <div className="slider-Btns">
                        <button className="primaryBtn-1 btn meduimBtn  " type="submit" onClick={this.NextStep}>{Resources.next[currentLanguage]}</button>
                    </div>
                </div>
            </div>
        </Fragment>
        return (
            <Fragment>
                <div className="mainContainer">
                    <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document one__tab one_step readOnly_inputs" : "documents-stepper noTabs__document one__tab one_step"}>
                        <HeaderDocument projectName={projectName} isViewMode={this.state.isViewMode} perviousRoute={this.state.perviousRoute} docTitle={Resources.meetingAgendaLog[currentLanguage]} moduleTitle={Resources['communication'][currentLanguage]} />
                        <div className="doc-container">
                            <div className="step-content">
                                <Fragment>
                                    {this.state.CurrStep == 1 ? Step_1 : (this.state.CurrStep == 2 ? Step_2 : Step_3)}
                                    <div className="largePopup largeModal " style={{ display: this.state.showPopUp ? 'block' : 'none' }}>
                                        <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog1 = ref}
                                            title={Resources.editTitle[currentLanguage] + ' - ' + Resources.meetingAgendaLog[currentLanguage]}
                                            beforeClose={this._executeBeforeModalClose}>
                                            {this.state.CurrStep == 2 ? attendeesContent : topicContent}
                                        </SkyLight>
                                    </div>
                                    {
                                        this.props.changeStatus === true ?
                                            <div className="approveDocument">
                                                <div className="approveDocumentBTNS">
                                                    {this.state.isApproveMode === true ?
                                                        <div>
                                                            <button type='button' className="primaryBtn-1 btn " onClick={(e) => this.handleShowAction(actions[2])} >{Resources.approvalModalApprove[currentLanguage]}</button>
                                                            <button type='button' className="primaryBtn-2 btn middle__btn" onClick={(e) => this.handleShowAction(actions[3])} >{Resources.approvalModalReject[currentLanguage]}</button>
                                                        </div>
                                                        : null
                                                    }
                                                    <button type='button' className="primaryBtn-2 btn middle__btn" onClick={(e) => this.handleShowAction(actions[1])}>{Resources.sendToWorkFlow[currentLanguage]}</button>
                                                    <button type='button' className="primaryBtn-2 btn" onClick={(e) => this.handleShowAction(actions[0])}>{Resources.distributionList[currentLanguage]}</button>
                                                    <span className="border"></span>
                                                    <div className="document__action--menu">
                                                        <OptionContainer permission={this.state.permission} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                                    </div>
                                                </div>
                                            </div>
                                            : null
                                    }
                                </Fragment>
                            </div>
                            <div>
                                <div className="docstepper-levels">
                                    <div className="step-content-foot">
                                        <span onClick={this.PreviousStep} className={(this.props.changeStatus == true && this.state.CurrStep > 1) ? "step-content-btn-prev " :
                                            "step-content-btn-prev disabled"}><i className="fa fa-caret-left" aria-hidden="true"></i>{Resources.previous[currentLanguage]}</span>
                                        <span onClick={this.NextStep} className={this.state.docId > 0 ? "step-content-btn-prev "
                                            : "step-content-btn-prev disabled"}>{Resources.next[currentLanguage]}<i className="fa fa-caret-right" aria-hidden="true"></i>
                                        </span>
                                    </div>
                                    <div className="workflow-sliderSteps">
                                        <div className="step-slider">
                                            <div onClick={this.StepOneLink} data-id="step1" className={'step-slider-item ' + (this.state.CurrStep == 1 ? 'current__step' : this.state.firstComplete ? "active" : "")} >
                                                <div className="steps-timeline">
                                                    <span>1</span>
                                                </div>
                                                <div className="steps-info">
                                                    <h6>{Resources.addMeetingMinutes[currentLanguage]}</h6>
                                                </div>
                                            </div>
                                            <div onClick={this.StepTwoLink} data-id="step2 " className={'step-slider-item ' + (this.state.CurrStep == 2 ? 'current__step' : this.state.secondComplete ? "active" : "")} >
                                                <div className="steps-timeline">
                                                    <span>2</span>
                                                </div>
                                                <div className="steps-info">
                                                    <h6 >{Resources.attendenceAdttion[currentLanguage]}</h6>
                                                </div>
                                            </div>
                                            <div onClick={this.StepThreeLink} data-id="step3" className={this.state.CurrStep == 3 ? "step-slider-item  current__step" : "step-slider-item"}>
                                                <div className="steps-timeline">
                                                    <span>3</span>
                                                </div>
                                                <div className="steps-info">
                                                    <h6>{Resources.topicsAddition[currentLanguage]}</h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {this.state.showDeleteModal == true ? (
                        <ConfirmationModal
                            title={Resources['smartDeleteMessage'][currentLanguage].content}
                            closed={this.onCloseModal}
                            showDeleteModal={this.state.showDeleteModal}
                            clickHandlerCancel={this.clickHandlerCancelMain}
                            buttonName='delete' clickHandlerContinue={this.ConfirmDelete}
                        />
                    ) : null}
                    <div className="largePopup largeModal " style={{ display: this.state.showModal ? 'block' : 'none' }}>
                        <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref} title={Resources[this.state.currentTitle][currentLanguage]}>
                            {this.state.currentComponent}
                        </SkyLight>
                    </div>
                </div>
            </Fragment>
        )
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
        attendees: state.communication.attendees,
        topics: state.communication.topics,
        showModal: state.communication.showModal
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(meetingAgendaAddEdit))