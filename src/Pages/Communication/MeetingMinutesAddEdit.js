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
import Recycle from '../../Styles/images/attacheRecycle.png'
import 'react-table/react-table.css'
import ConfirmationModal from '../../Componants/publicComponants/ConfirmationModal'
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
const validationSchema = Yup.object().shape({
    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),
    fromContact: Yup.string().required(Resources['fromContactRequired'][currentLanguage]),
    calledByContact: Yup.string().required(Resources['calledByContactRequired'][currentLanguage]),
    facilitatorContact: Yup.string().required(Resources['facilitatorContactReuired'][currentLanguage]),
    noteTakerContact: Yup.string().required(Resources['noteTakerContactRequired'][currentLanguage]),
});
const attendeesValidationSchema = Yup.object().shape({
    attendeesContact: Yup.string().required(Resources['fromContactRequired'][currentLanguage]),
});
const topicsValidationSchema = Yup.object().shape({
    description: Yup.string().required(Resources['descriptionRequired'][currentLanguage]),
    topicContact: Yup.string().required(Resources['calledByContactRequired'][currentLanguage])

});
let docId = 0;
let projectId = 0;
let projectName = "";
let isApproveMode = 0;
let docApprovalId = 0;
let arrange = 0;
class MeetingMinutesAddEdit extends Component {
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
                }
                catch{
                    this.props.history.goBack();
                }
            }
            index++;
        }

        this.state = {
            btnTxt: 'save',
            CurrStep: 1,
            firstComplete: false,
            secondComplete: false,
            thirdComplete: false,
            IsEditMode: false,
            attendenceId: 0,
            validStep: false,
            currentTitle: "sendToWorkFlow",
            showModal: false,
            isViewMode: false,
            isApproveMode: isApproveMode,
            isView: false,
            docId: docId,
            docTypeId: 33,
            projectId: projectId,
            docApprovalId: docApprovalId,
            arrange: arrange,
            meetingId: 0,
            Companies: [],
            fromContacts: [],
            calledContacts: [],
            facilitatorContacts: [],
            noteTakerContacts: [],
            topics: [],
            topicsContacts: [],
            topicContacts: [],
            selectedTopicContact: { label: Resources.calledByContactRequired[currentLanguage], value: "0" },
            selectedTopicCompany: { label: Resources.calledByContactRequired[currentLanguage], value: "0" },

            attendees: [],
            attendencesContacts: [],
            selectedAttendencesContact: { label: Resources.calledByContactRequired[currentLanguage], value: "0" },
            selectedAttendencesCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },

            selectedFromCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
            selectedFromContact: { label: Resources.fromContactRequired[currentLanguage], value: "0" },
            selectedCalledByCompany: { label: Resources.calledByCompanyRequired[currentLanguage], value: "0" },
            selectedCalledByContact: { label: Resources.calledByContactRequired[currentLanguage], value: "0" },
            selectedFacilitatorCompany: { label: Resources.facilitatorCompanyRequired[currentLanguage], value: "0" },
            selectedFacilitatorContact: { label: Resources.facilitatorContactReuired[currentLanguage], value: "0" },
            selectedNoteTakerCompany: { label: Resources.noteTakerCompanyReuired[currentLanguage], value: "0" },
            selectedNoteTakerContact: { label: Resources.noteTakerContactRequired[currentLanguage], value: "0" },
            requiredDate: moment(),

            isLoading: true,
            permission: [{ name: 'sendByEmail', code: 113 }, { name: 'sendByInbox', code: 112 },
            { name: 'sendTask', code: 0 }, { name: 'distributionList', code: 967 },
            { name: 'createTransmittal', code: 3053 }, { name: 'sendToWorkFlow', code: 717 },
            { name: 'viewAttachments', code: 3325 }, { name: 'deleteAttachments', code: 838364 }],

            document: {},
            attendence: {},
            topics: [],
        }
        if (!Config.IsAllow(504) || !Config.IsAllow(505) || !Config.IsAllow(507)) {
            toast.warning(Resources['missingPermissions'][currentLanguage])
            this.props.history.push({ pathname: "/InternalMeetingMinutes/" + projectId });
        }
    }

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!(Config.IsAllow(507))) {
                this.setState({ isViewMode: true });
            }
            if (this.state.isApproveMode != true && Config.IsAllow(507)) {
                if (this.props.hasWorkflow == false && Config.IsAllow(507)) {
                    if (this.props.document.status == true && Config.IsAllow(507)) {
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
                let companyId = this.state.document.fromCompanyId;
                if (companyId) {
                    this.setState({
                        selectedFromCompany: { label: this.props.document.fromCompanyName, value: companyId }
                    });

                    this.fillSubDropDownInEdit('GetContactsByCompanyId', 'companyId', companyId, 'fromContactId', 'fromContactName', 'selectedFromContact', 'fromContacts');
                }
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
            this.props.actions.documentForEdit('GetCommunicationMeetingMinutesForEdit?id=' + this.state.docId).then(() => {
                this.setState({ meetingId: this.state.docId, isLoading: false })
                this.getTabelData()
                this.checkDocumentIsView();
            })

        } else {
            this.fillDropDowns(false);
            let document = {
                projectId: projectId,
                fromCompanyId: '',
                fromContactId: '',
                calledByCompanyId: '',
                calledByContactId: '',
                facilitatorCompanyId: '',
                facilitatorContactId: '',
                noteTakerContactId: '',
                noteTakerCompanyId: '',
                docDate: moment(),
                handouts: '',
                subject: '',
                refDoc: '',
                docCloseDate: '',
                docLocationId: '',
                requiredDate: ''
            };
            this.setState({ document });
        }
        this.setState({ isLoading: false })
        DataService.GetDataList('GetProjectProjectsCompaniesForList?projectId=' + this.state.projectId, 'companyName', 'companyId').then(res => {
            this.setState({ Companies: res, isLoading: false })
        })
    }

    getTabelData() {
        let attendeesTable = []
        this.props.actions.GetAttendeesTable('GetCommunicationMeetingMinutesAttendees?meetingId=' + this.state.docId).then(res => {
            this.props.attendees.forEach((element, index) => {
                attendeesTable.push(
                    < tr id={'att_' + index}>
                        <td><span onClick={e => this.deleteRowTable(element.Id, e)}><img src={Recycle} alt="DEL" style={{ maxWidth: '20px' }} /></span></td>
                        <td className="disNone">{element.Id}</td>
                        <td className="disNone">{element.companyId}</td>
                        <td>{element.companyName}</td>
                        <td>{element.contactName}</td>
                        <td className="disNone">{element.contactId}</td>
                    </ tr>
                )
            })
            this.setState({ attendees: attendeesTable })
        })
        let topicstable = []
        this.props.actions.GetTopicsTable('GetCommunicationMeetingMinutesTopics?meetingId=' + this.state.docId).then(res => {
            this.props.topics.forEach((element, index) => {
                //    let compnayname = _.find(this.state.Companies, function (i) { return i.value == element.calledByCompanyId; })
                //  let conatctname= _.find(this.state.Companies, function (i) { return i.value == element.calledByContactId; })
                //  element.calledByCompany = compnayname.label
                // element.calledByContcat = conatctname.label
                topicstable.push(
                    < tr id={'top_' + index} >
                        <td>{element.description}</td>
                        <td className="disNone">{element.calledByCompanyId}</td>
                        <td className="disNone">{element.calledByContactId}</td>
                        <td >{'element.calledByCompanyId'}</td>
                        <td >{'element.calledByContactId'}</td>
                        <td>{element.decision}</td>
                        <td>{element.action}</td>
                    </ tr>
                )
            })
            this.setState({ topics: topicstable })
        })
    }

    componentDidUpdate(prevProps) {
        if (this.props.hasWorkflow !== prevProps.hasWorkflow) {
            this.checkDocumentIsView();
        }
    }

    componentWillReceiveProps(props, state) {
        if (props.document && props.document.id > 0) {
            this.setState({
                document: { ...props.document }
            });
            this.fillDropDowns(true);
            this.checkDocumentIsView();
        }
    }
    //#region  editting
    editMeeting = () => {
        this.setState({
            isLoading: true,
            firstComplete:true
        });
        Api.post('EditCommunicationMeetingMinutes', this.state.document).then(result => {
            this.setState({
                isLoading: false,
                CurrStep: this.state.CurrStep + 1
            });
            toast.success(Resources["operationSuccess"][currentLanguage]);
        });
    }
    //#endregion
    viewAttachments() {
        return (
            this.state.docId > 0 ? (
                Config.IsAllow(3325) === true ?
                    <ViewAttachment docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={projectId} deleteAttachments={836} />
                    : null)
                : null
        )
    }
    //#region    adding
    addMeeting = () => {
        this.setState({ isLoading: true })
        let documentObj = { ...this.state.document };
        documentObj.docDate = moment(documentObj.docDate).format('MM/DD/YYYY');
        documentObj.docLocationId = 0
        DataService.addObject('AddCommunicationMeetingMinutes', documentObj).then(result => {
            this.setState({
                meetingId: result.id,
                docId: result.id,
                isLoading: false,
                selectedFromCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
                selectedFromContact: { label: Resources.fromContactRequired[currentLanguage], value: "0" },
                selectedCalledByCompany: { label: Resources.calledByCompanyRequired[currentLanguage], value: "0" },
                selectedCalledByContact: { label: Resources.calledByContactRequired[currentLanguage], value: "0" },
                calledContacts: [],
                btnTxt: 'next'
            })
            toast.success(Resources["operationSuccess"][currentLanguage]);
        })
    }

    addAttendences = (values) => {
        this.setState({ isLoading: true })
        let attendence = {
            meetingId: this.state.meetingId,
            contactId: this.state.selectedAttendencesContact.value,
            companyId: this.state.selectedAttendencesContact.value,
            companyName: this.state.selectedAttendencesCompany.label,
            contactName: this.state.selectedAttendencesCompany.label,
        }
        Api.post('AddCommunicationMeetingMinutesAttendees', attendence).then((res) => {
            toast.success(Resources["operationSuccess"][currentLanguage]);
            let data = [...this.state.attendees];
            data.push(< tr >
                <td><span onClick={e => this.deleteRowTable(res.id, e)}><img src={Recycle} alt="DEL" style={{ maxWidth: '20px' }} /></span></td>
                <td className='disNone'>{res.id}</td>
                <td className='disNone'>{this.state.selectedAttendencesCompany.value}</td>
                <td>{this.state.selectedAttendencesCompany.label}</td>
                <td>{this.state.selectedAttendencesContact.label}</td>
                <td className='disNone'>{this.state.selectedAttendencesContact.value}</td>
            </ tr>);
            this.setState({
                isLoading: false,
                attendees: data,
                selectedAttendencesCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
                selectedAttendencesContact: { label: Resources.fromContactRequired[currentLanguage], value: "0" }
            });
        })
    }
    addTopics = (values) => {
        this.setState({ isLoading: true })
        let topic = {
            meetingId: this.state.docId,
            requiredDate: moment(this.state.requiredDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
            itemDescription: values.description,
            action: values.action,
            arrange: values.arrange,
            status: values.status == true ? 1 : 0,
            byWhomContactId: this.state.selectedTopicContact.value,
            byWhomCompanyId: this.state.selectedTopicCompany.value,
            comment: '',
            decisions: values.decision
        }
        Api.post('AddCommunicationMeetingMinutesTopics', topic).then((res) => {
            toast.success(Resources["operationSuccess"][currentLanguage]);
            let data = [...this.state.topics];
            data.push(< tr >
                <td>{values.description}</td>
                <td>{this.state.selectedTopicCompany.label}</td>
                <td>{this.state.selectedTopicContact.label}</td>
                <td>{values.decision}</td>
                <td>{values.action}</td>
            </tr >
            );
            this.setState({
                topics: data,
                selectedTopicCompany: { label: Resources.calledByCompanyRequired[currentLanguage], value: "0" },
                selectedTopicContact: { label: Resources.calledByContactRequired[currentLanguage], value: "0" },
                isLoading: false
            });
        })
    }
    //#endregion

    deleteRowTable = (id, e) => {
        e.preventDefault();
        this.setState({ attendenceId: id, showDeleteModal: true })
    }

    onCloseModal() {
        this.setState({ showDeleteModal: false });
    }

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });
    }

    ConfirmDeleteAttendence = () => {
        this.setState({ isLoading: true })
        Api.post('CommunicationMeetingMinutesAttendeesDelete?id=' + this.state.attendenceId).then((res) => {
            toast.success(Resources["operationSuccess"][currentLanguage]);
            let data = this.state.attendees.filter(item => item.props.children[1].props.children !== this.state.attendenceId);
            this.setState({ attendees: data, showDeleteModal: false, isLoading: false });
        })
    }

    //#region General Methods
    fillSubDropDownInEdit(url, param, value, subFieldId, subFieldName, subSelectedValue, subDatasource) {
        let action = url + "?" + param + "=" + value
        DataService.GetDataList(action, 'contactName', 'id').then(result => {
            if (this.props.changeStatus === true) {
                let _SubFieldId = this.state.document[subFieldId];
                let _SubFieldName = this.state.document[subFieldName];
                let targetFieldSelected = { label: _SubFieldName, value: _SubFieldId };
                this.setState({
                    [subSelectedValue]: targetFieldSelected,
                    [subDatasource]: result
                });
            }
        });
    }

    updateSelectedValue = (selected, label, value, targetSelected) => {
        if (label == 'fromContactName' && this.props.changeStatus === false && this.state.CurrStep == 1) {
            this.setState({ isLoading: true })
            Api.get('GetNextArrangeMainDoc?projectId=' + this.state.projectId + '&docType=' + this.state.docTypeId + '&companyId=' + this.state.selectedFromCompany.value + '&contactId=' + this.state.selectedFromContact.value).then(res => {
                this.setState({ document: { ...this.state.document, arrange: res }, isLoading: false, validStep: true })
            })
            let original_document = { ...this.state.document };
            let updated_document = {};
            updated_document[value] = selected.value;
            updated_document = Object.assign(original_document, updated_document);
            this.setState({
                document: updated_document,
                [targetSelected]: selected
            });
        }

    }

    handleChangeDropDowns = (item, lbl, val, selected, listData, selected_subScripe) => {
        this.setState({ isLoading: true })
        DataService.GetDataList('GetContactsByCompanyId?companyId=' + item.value, 'contactName', 'id').then(res => {
            this.setState({
                [listData]: res, isLoading: false, [selected]: item,
                [selected_subScripe]: this.state[selected_subScripe]
            })
        })
        this.updateSelectedValue(item, lbl, val)
    }

    handleChange = (key, value) => {
        this.setState({ document: { ...this.state.document, [key]: value } })
    }
    NextStep = () => {
        window.scrollTo(0, 0)
        switch (this.state.CurrStep) {
            case 1:
                this.setState({
                    selectedFromCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
                    selectedFromContact: { label: Resources.fromContactRequired[currentLanguage], value: "0" },
                    fromContacts: [],
                    selectedCalledByCompany: { label: Resources.calledByCompanyRequired[currentLanguage], value: "0" },
                    selectedCalledByContact: { label: Resources.calledByContactRequired[currentLanguage], value: "0" },
                    calledByContact: [],
                    CurrStep: this.state.CurrStep + 1,
                    firstComplete: true
                })
                break;
            case 2:
                this.setState({ CurrStep: this.state.CurrStep + 1, secondComplete: true })
                break;
            case 3:
                this.props.history.push({ pathname: '/InternalMeetingMinutes/' + this.state.projectId })
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

    //#endregion
    handleShowAction = (item) => {
        console.log(item);
        if (item.value != "0") {

            this.setState({
                currentComponent: item.value,
                currentTitle: item.title,
                showModal: true
            })

            this.simpleDialog.show()
        }
    }

    render() {
        let actions = [
            { title: "distributionList", value: <Distribution docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />, label: Resources["distributionList"][currentLanguage] },
            { title: "sendToWorkFlow", value: <SendToWorkflow docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />, label: Resources["sendToWorkFlow"][currentLanguage] },
            {
                title: "documentApproval", value: <DocumentApproval docTypeId={this.state.docTypeId} docId={this.state.docId} approvalStatus={true}
                    projectId={this.state.projectId} docApprovalId={this.state.docApprovalId} currentArrange={this.state.arrange} />, label: Resources["documentApproval"][currentLanguage]
            }, {
                title: "documentApproval", value: <DocumentApproval docTypeId={this.state.docTypeId} docId={this.state.docId} approvalStatus={false}
                    projectId={this.state.projectId} docApprovalId={this.state.docApprovalId} currentArrange={this.state.arrange} />, label: Resources["documentApproval"][currentLanguage]
            }

        ];
        let Step_1 = <React.Fragment>
            <div className="document-fields">
                {this.state.isLoading ? <LoadingSection /> : null}
                <Formik
                    validationSchema={validationSchema}
                    initialValues={{
                        subject: this.state.document.subject,
                        fromContact: this.state.document.fromContactName,
                        calledByContact: this.state.document.calledByContactName,
                        facilitatorContact: this.state.document.facilitatorContactName,
                        noteTakerContact: this.state.document.noteTakerContactName
                    }}
                    enableReinitialize={true}
                    onSubmit={(values) => {
                        if (this.props.changeStatus === true && this.state.docId > 0) {
                            this.editMeeting();
                        } else if (this.props.changeStatus === false && this.state.docId === 0) {
                            this.addMeeting()
                        } else {
                            this.NextStep()
                        }
                    }} >
                    {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldTouched, setFieldValue }) => (
                        <Form id="MinutesOfMeeting" className="proForm datepickerContainer" noValidate="novalidate" onSubmit={handleSubmit}>
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
                            <div className="linebylineInput valid-input alternativeDate">
                                <DatePicker title='docDate'
                                    startDate={this.state.document.docDate}
                                    handleChange={e => this.handleChange('docDate', e)} />
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
                                <label className="control-label">{Resources['CompanyName'][currentLanguage]}</label>
                                <div className="supervisor__company">
                                    <div className="super_name">
                                        <DropdownMelcous
                                            name="fromContact"
                                            data={this.state.fromContacts}
                                            handleChange={e => this.updateSelectedValue(e, 'fromContactName', 'fromContactId', 'selectedFromContact')}
                                            placeholder='ContactName'
                                            selectedValue={this.state.selectedFromContact}
                                            onChange={setFieldValue}
                                            onBlur={setFieldTouched}
                                            error={errors.fromContact}
                                            touched={touched.fromContact}
                                            index="fromContact"
                                            id="fromContact" />
                                    </div>
                                    <div className="super_company">
                                        <DropdownMelcous
                                            name="fromCompany"
                                            data={this.state.Companies}
                                            handleChange={e => this.handleChangeDropDowns(e, 'fromCompanyName', 'fromCompanyId', 'selectedFromCompany', 'fromContacts', 'selectedFromContact')}
                                            placeholder='fromCompany'
                                            selectedValue={this.state.selectedFromCompany}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="linebylineInput valid-input mix_dropdown">
                                <label className="control-label">{Resources['calledByCompany'][currentLanguage]}</label>
                                <div className="supervisor__company">
                                    <div className="super_name">
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
                                    <div className="super_company">
                                        <DropdownMelcous
                                            name='calledCompany'
                                            data={this.state.Companies}
                                            handleChange={(e) => this.handleChangeDropDowns(e, 'calledByCompanyName', 'calledByCompanyId', 'selectedCalledByCompany', 'calledContacts', 'selectedCalledByContact')}
                                            placeholder='calledByCompany'
                                            selectedValue={this.state.selectedCalledByCompany} />
                                    </div>
                                </div>
                            </div>
                            <div className="linebylineInput valid-input mix_dropdown">
                                <label className="control-label">{Resources['facilitatorContact'][currentLanguage]}</label>
                                <div className="supervisor__company">
                                    <div className="super_name">
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
                                    <div className="super_company">
                                        <DropdownMelcous
                                            name='facilitatorCompany'
                                            data={this.state.Companies}
                                            handleChange={(e) => this.handleChangeDropDowns(e, 'facilitatorCompanyName', 'facilitatorCompanyId', 'selectedFacilitatorCompany', 'facilitatorContacts', 'selectedFacilitatorContact')}
                                            placeholder='facilitatorCompany'
                                            selectedValue={this.state.selectedFacilitatorCompany} />
                                    </div>
                                </div>
                            </div>
                            <div className="linebylineInput valid-input mix_dropdown">
                                <label className="control-label">{Resources['noteTakerCompany'][currentLanguage]}</label>
                                <div className="supervisor__company">
                                    <div className="super_name">
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
                                    <div className="super_company">
                                        <DropdownMelcous
                                            name='noteTakerCompany'
                                            data={this.state.Companies}
                                            handleChange={(e) => this.handleChangeDropDowns(e, 'noteTakerCompanyName', 'noteTakerCompanyId', 'selectedNoteTakerCompany', 'noteTakerContacts', 'selectedNoteTakerContact')}
                                            placeholder='noteTakerCompany'
                                            selectedValue={this.state.selectedNoteTakerCompany} />
                                    </div>
                                </div>
                            </div>
                            <div className="slider-Btns">
                                <button className={"primaryBtn-1 btn meduimBtn  "} type='submit'>
                                    {Resources[this.state.btnTxt][currentLanguage]}</button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>

            <div className="doc-pre-cycle">
                <div>
                    {this.state.docId > 0 ?
                        <UploadAttachment docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                        : null
                    }
                    {this.viewAttachments()}

                    {this.props.changeStatus === true ?
                        <ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                        : null
                    }
                </div>
            </div>
            {
                this.props.changeStatus === true ?
                    <div className="approveDocument">
                        <div className="approveDocumentBTNS">
                            <button className={this.state.isViewMode === true ? "primaryBtn-1 btn middle__btn disNone" : "primaryBtn-1 btn middle__btn"} onClick={e => this.editLetter(e)}>{Resources.save[currentLanguage]}</button>
                            {this.state.isApproveMode === true ?
                                <div >
                                    <button className="primaryBtn-1 btn " onClick={(e) => this.handleShowAction(actions[2])} >{Resources.approvalModalApprove[currentLanguage]}</button>
                                    <button className="primaryBtn-2 btn middle__btn" onClick={(e) => this.handleShowAction(actions[3])} >{Resources.approvalModalReject[currentLanguage]}</button>
                                </div>
                                : null
                            }
                            <button className="primaryBtn-2 btn middle__btn" onClick={(e) => this.handleShowAction(actions[1])}>{Resources.sendToWorkFlow[currentLanguage]}</button>
                            <button className="primaryBtn-2 btn" onClick={(e) => this.handleShowAction(actions[0])}>{Resources.distributionList[currentLanguage]}</button>
                            <span className="border"></span>
                            <div className="document__action--menu">
                                <OptionContainer permission={this.state.permission} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                            </div>
                        </div>
                    </div>
                    : null
            }
        </React.Fragment>
        let Step_2 = <React.Fragment>
            <div className="document-fields">
                {this.state.isLoading ? <LoadingSection /> : null}
                <Formik
                    initialValues={{
                        attendeesContact: ''
                    }}
                    validationSchema={attendeesValidationSchema}
                    onSubmit={(values) => {
                        this.addAttendences(values)
                    }}
                >
                    {({ errors, touched, setFieldTouched, setFieldValue }) => (
                        <Form id="signupForm1" className="proForm customProform" noValidate="novalidate" >
                            <div className="proForm customProform">
                                <br />
                                <div className="linebylineInput valid-input mix_dropdown">
                                    <label className="control-label">{Resources['CompanyName'][currentLanguage]}</label>
                                    <div className="supervisor__company">
                                        <div className="super_name">
                                            <DropdownMelcous
                                                name="attendeesContact"
                                                data={this.state.attendencesContacts}
                                                handleChange={e => this.setState({ selectedAttendencesContact: e })}
                                                placeholder='ContactName'
                                                selectedValue={this.state.selectedAttendencesContact}
                                                onChange={setFieldValue}
                                                onBlur={setFieldTouched}
                                                error={errors.attendeesContact}
                                                touched={touched.attendeesContact}
                                                id="attendeesContact"
                                            />
                                        </div>
                                        <div className="super_company">
                                            <DropdownMelcous
                                                name="fromCompany"
                                                data={this.state.Companies}
                                                handleChange={e => this.handleChangeDropDowns(e, 'fromCompanyName', 'fromCompanyId', 'selectedAttendencesCompany', 'attendencesContacts', 'selectedAttendencesContact')}
                                                placeholder='fromCompany'
                                                selectedValue={this.state.selectedAttendencesCompany}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="slider-Btns">
                                    <button className="primaryBtn-1 btn" type="submit"
                                    >{Resources['add'][currentLanguage]}</button>
                                </div>
                            </div>


                        </Form>
                    )}
                </Formik>
            </div>
            <div className="doc-pre-cycle">
                <header><h3 className="zero">{Resources['contactList'][currentLanguage]}</h3></header>
                <div className='precycle-grid'>
                    <table className="ui table">
                        <thead>
                            <tr>
                                <th ></th>
                                <th className="disNone">id</th>
                                <th className="disNone">{Resources['company'][currentLanguage]}</th>
                                <th>{Resources['company'][currentLanguage]}</th>
                                <th>{Resources['contact'][currentLanguage]}</th>
                                <th className="disNone">{Resources['contact'][currentLanguage]}</th>

                            </tr>
                        </thead>
                        <tbody>
                            {this.state.attendees}
                        </tbody>
                    </table>
                </div>
                <div className="slider-Btns">
                    <button className={"primaryBtn-1 btn meduimBtn  "} onClick={this.NextStep} type='button'>
                        {Resources.next[currentLanguage]}</button>
                </div>
            </div>
        </React.Fragment >
        let Step_3 = <React.Fragment>
            <div className="document-fields">
                {this.state.isLoading ? <LoadingSection /> : null}
                <Formik
                    initialValues={{
                        description: '',
                        requiredDate: this.state.requiredDate,
                        topicContact: ''
                    }}
                    validationSchema={topicsValidationSchema}
                    onSubmit={(values) => {
                        this.addTopics(values)
                    }} >
                    {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldTouched, setFieldValue, values }) => (
                        <Form id=" MinutesOfMeeting" className="proForm datepickerContainer" noValidate="novalidate" onSubmit={handleSubmit}>
                            <div className="proForm first-proform fullWidth_form">
                                <div className="linebylineInput valid-input">
                                    <label className="control-label">{Resources['description'][currentLanguage]} </label>
                                    <div className={"inputDev ui input " + (errors.description ? 'has-error' : !errors.description && touched.description ? (" has-success") : " ")}>
                                        <input name='description'
                                            className="form-control"
                                            id="description" placeholder={Resources['description'][currentLanguage]} autoComplete='off'
                                            onBlur={handleBlur} defaultValue={values.description}
                                            onChange={handleChange} />
                                        {errors.description ? (<em className="pError">{errors.description}</em>) : null}
                                    </div>
                                </div>
                                <div className="linebylineInput">
                                    <label data-toggle="tooltip" title={Resources['status'][currentLanguage]} className="control-label"> {Resources['status'][currentLanguage]} </label>
                                    <div className="ui checkbox radio radioBoxBlue">
                                        <input type="radio" name="status" checked value="true" onChange={handleChange} />
                                        <label>{Resources['oppened'][currentLanguage]}</label>
                                    </div>
                                    <div className="ui checkbox radio radioBoxBlue checked">
                                        <input type="radio" name="status" value="false" onChange={handleChange} />
                                        <label> {Resources['closed'][currentLanguage]}</label>
                                    </div>
                                </div>
                            </div>
                            <div className="linebylineInput valid-input alternativeDate">
                                <DatePicker
                                    name='requiredDate'
                                    title='requiredDate'
                                    startDate={this.state.requiredDate}
                                    handleChange={(e) => {
                                        handleChange(e)
                                        this.setState({ requiredDate: e })
                                    }} />
                            </div>
                            <div className="linebylineInput valid-input">
                                <label className="control-label">{Resources['arrange'][currentLanguage]} </label>
                                <div className={'ui input inputDev '}>
                                    <input name='arrange' className="form-control" id="arrange" placeholder={Resources['arrange'][currentLanguage]} autoComplete='off'
                                        onChange={handleChange} />
                                </div>
                            </div>
                            <div className="linebylineInput valid-input mix_dropdown">
                                <label className="control-label">{Resources['calledByCompany'][currentLanguage]}</label>
                                <div className="supervisor__company">
                                    <div className="super_name">
                                        <DropdownMelcous
                                            name='topicContact'
                                            data={this.state.topicsContacts}
                                            handleChange={e => this.setState({ selectedTopicContact: e })}
                                            placeholder='topicContact'
                                            selectedValue={this.state.selectedTopicContact}
                                            onChange={setFieldValue}
                                            onBlur={setFieldTouched}
                                            error={errors.topicContact}
                                            touched={touched.topicContact}
                                        />
                                    </div>
                                    <div className="super_company">
                                        <DropdownMelcous
                                            name='topicCompany'
                                            data={this.state.Companies}
                                            handleChange={(e) => this.handleChangeDropDowns(e, 'calledByCompanyName', 'calledByCompanyId', 'selectedTopicCompany', 'topicsContacts', 'selectedTopicContact')}
                                            placeholder='topicCompany'
                                            selectedValue={this.state.selectedTopicCompany} />
                                    </div>
                                </div>
                            </div>
                            <div className="linebylineInput valid-input linebylineInput__name">
                                <label className="control-label">{Resources['decision'][currentLanguage]} </label>
                                <div className={'ui input inputDev '}>
                                    <input name='decision' onChange={handleChange} className="form-control" id="decision" placeholder={Resources['decision'][currentLanguage]} autoComplete='off'
                                    />
                                </div>
                            </div>
                            <div className="linebylineInput valid-input ">
                                <label className="control-label">{Resources['action'][currentLanguage]} </label>
                                <div className={'ui input inputDev '}>
                                    <input name='action' className="form-control" id="action" placeholder={Resources['action'][currentLanguage]} autoComplete='off' onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="slider-Btns fullWidthWrapper textLeft">
                                <button className={"primaryBtn-1 btn"} type="submit"  >{Resources['add'][currentLanguage]}</button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
            <div className="doc-pre-cycle">

                <header>
                    <h3 className="zero">{Resources['contactList'][currentLanguage]}</h3>
                </header>
                <div className='precycle-grid'>
                    <table className="ui table">
                        <thead>
                            <tr>
                                <th>{Resources['description'][currentLanguage]}</th>
                                <th className="disNone">{Resources['calledByCompany'][currentLanguage]}</th>
                                <th className="disNone">{Resources['calledByContact'][currentLanguage]}</th>
                                <th>{Resources['calledByCompany'][currentLanguage]}</th>
                                <th>{Resources['calledByContact'][currentLanguage]}</th>
                                <th>{Resources['decisions'][currentLanguage]}</th>
                                <th>{Resources['action'][currentLanguage]}</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.topics}
                        </tbody>
                    </table>
                </div>
                <div className="slider-Btns">
                    <button className={"primaryBtn-1 btn meduimBtn  "} onClick={this.NextStep} type='button'>
                        {Resources.next[currentLanguage]}</button>
                </div>
            </div>
        </React.Fragment>
        return (
            <React.Fragment>
                <div className="mainContainer">
                    <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document one__tab one_step" : "documents-stepper noTabs__document one__tab one_step"}>
                        <div className="submittalHead">
                            <h2 className="zero">{Resources.meetingMinutesLog[currentLanguage]}
                                <span>{projectName.replace(/_/gi, ' ')} · Communication</span>
                            </h2>
                            <div className="SubmittalHeadClose">
                                <svg width="56px" height="56px" viewBox="0 0 56 56" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                    <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                        <g id="Components/Sections/Doc-page/Title/Base" transform="translate(-1286.000000, -24.000000)">
                                            <g id="Group-2">
                                                <g id="Action-icons/Close/Circulated/56px/Light-grey_Normal" transform="translate(1286.000000, 24.000000)">
                                                    <g id="Action-icons/Close/Circulated/20pt/Grey_Normal">
                                                        <g id="Group">
                                                            <circle id="Oval" fill="#E9ECF0" cx="28" cy="28" r="28"></circle>
                                                            <path d="M36.5221303,34.2147712 C37.1592899,34.8519308 37.1592899,35.8849707 36.5221303,36.5221303 C35.8849707,37.1592899 34.8519308,37.1592899 34.2147712,36.5221303 L28,30.3073591 L21.7852288,36.5221303 C21.1480692,37.1592899 20.1150293,37.1592899 19.4778697,36.5221303 C18.8407101,35.8849707 18.8407101,34.8519308 19.4778697,34.2147712 L25.6926409,28 L19.4778697,21.7852288 C18.8407101,21.1480692 18.8407101,20.1150293 19.4778697,19.4778697 C20.1150293,18.8407101 21.1480692,18.8407101 21.7852288,19.4778697 L28,25.6926409 L34.2147712,19.4778697 C34.8519308,18.8407101 35.8849707,18.8407101 36.5221303,19.4778697 C37.1592899,20.1150293 37.1592899,21.1480692 36.5221303,21.7852288 L30.3073591,28 L36.5221303,34.2147712 Z" id="Combined-Shape" fill="#858D9E" fillRule="nonzero"></path>
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
                            <div className="step-content">
                                <Fragment>
                                    {this.state.CurrStep == 1 ? Step_1 : (this.state.CurrStep == 2 ? Step_2 : Step_3)}
                                </Fragment>
                            </div>
                            <div>
                                <div className="docstepper-levels">
                                    <div className="step-content-foot">
                                        <span onClick={this.PreviousStep} className={(this.props.changeStatus == true && this.state.CurrStep > 1) ? "step-content-btn-prev " :
                                            "step-content-btn-prev disabled"}><i className="fa fa-caret-left" aria-hidden="true"></i>Previous</span>
                                        <span onClick={this.NextStep} className={this.state.CurrStep < 3 && this.state.meetingId > 0 ? "step-content-btn-prev "
                                            : "step-content-btn-prev disabled"}>Next<i className="fa fa-caret-right" aria-hidden="true"></i>
                                        </span>
                                    </div>
                                    <div className="workflow-sliderSteps">
                                        <div className="step-slider">
                                            <div data-id="step1" className={'step-slider-item ' + (this.state.CurrStep == 1 ? 'current__step' : this.state.firstComplete ? "active" : "")} >
                                                <div className="steps-timeline">
                                                    <span>1</span>
                                                </div>
                                                <div className="steps-info">
                                                    <h6>{Resources.addMeetingMinutes[currentLanguage]}</h6>
                                                </div>
                                            </div>
                                            <div data-id="step2 " className={'step-slider-item ' + (this.state.CurrStep == 2 ? 'current__step' : this.state.secondComplete ? "active" : "")} >
                                                <div className="steps-timeline">
                                                    <span>2</span>
                                                </div>
                                                <div className="steps-info">
                                                    <h6 >{Resources.attendenceAdttion[currentLanguage]}</h6>
                                                </div>
                                            </div>
                                            <div data-id="step3" className={this.state.CurrStep == 3 ? "step-slider-item  current__step" : "step-slider-item"}>
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
                            buttonName='delete' clickHandlerContinue={this.ConfirmDeleteAttendence}
                        />
                    ) : null}
                    <div className="largePopup largeModal " style={{ display: this.state.showModal ? 'block' : 'none' }}>
                        <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref} title={Resources[this.state.currentTitle][currentLanguage]}>
                            {this.state.currentComponent}
                        </SkyLight>
                    </div>
                </div>
            </React.Fragment>
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
        topics: state.communication.topics
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(MeetingMinutesAddEdit))