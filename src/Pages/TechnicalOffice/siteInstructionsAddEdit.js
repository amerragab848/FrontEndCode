import React, { Component, Fragment } from "react";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import dataservice from "../../Dataservice";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import UploadAttachment from '../../Componants/OptionsPanels/UploadAttachment';
import ViewAttachment from '../../Componants/OptionsPanels/ViewAttachmments';
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import Resources from "../../resources.json";
import { withRouter } from "react-router-dom";
import TextEditor from '../../Componants/OptionsPanels/TextEditor';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as communicationActions from '../../store/actions/communication';
import Config from "../../Services/Config.js";
import CryptoJS from 'crypto-js';
import moment from "moment";
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument';
import DocumentActions from '../../Componants/OptionsPanels/DocumentActions';
import DatePicker from '../../Componants/OptionsPanels/DatePicker';
import { toast } from "react-toastify";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import CompanyDropdown from '../../Componants/publicComponants/CompanyDropdown';
import ContactDropdown from '../../Componants/publicComponants/ContactDropdown';
import AddDocAttachment from "../../Componants/publicComponants/AddDocAttachment";

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const validationSchema = Yup.object().shape({

    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),

    fromContactId: Yup.string().required(Resources['fromContactRequired'][currentLanguage])
        .nullable(true),

    toContactId: Yup.string()
        .required(Resources['toContactRequired'][currentLanguage]),


})

let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let perviousRoute = '';
let arrange = 0;
const find = require('lodash/find')
class siteInstructionsAddEdit extends Component {

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

        this.state = {
            loadingPage: false,
            isViewMode: false,
            isLoading: false,
            isApproveMode: isApproveMode,
            isView: false,
            docId: docId,
            docTypeId: 90,
            projectId: projectId,
            docApprovalId: docApprovalId,
            perviousRoute: perviousRoute,
            arrange: arrange,
            document: this.props.document ? Object.assign({}, this.props.document) : {},
            companies: [],
            ToContacts: [],
            fromContacts: [],
            contracts: [],
            inspectionRequests: [],
            permission: [{ name: 'sendByEmail', code: 641 }, { name: 'sendByInbox', code: 640 },
            { name: 'sendTask', code: 0 }, { name: 'distributionList', code: 995 },
            { name: 'createTransmittal', code: 3081 }, { name: 'sendToWorkFlow', code: 741 },
            { name: 'viewAttachments', code: 3314 }, { name: 'deleteAttachments', code: 864 }],
            selectedFromCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
            selectedToCompany: { label: Resources.toCompanyRequired[currentLanguage], value: "0" },
            selectedFromContact: { label: Resources.fromContactRequired[currentLanguage], value: "0" },
            selectedToContact: { label: Resources.toContactRequired[currentLanguage], value: "0" },
            selectedContract: { label: Resources.selectContract[currentLanguage], value: "0" },
            selecetedinspectionRequest: { label: Resources.inspectionRequest[currentLanguage], value: "0" },
            message: '',
            replayMsg: ''
        }

        if (!Config.IsAllow(635) && !Config.IsAllow(636) && !Config.IsAllow(638)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/siteInstructions/" + projectId
            });
        }
    }

    componentDidMount() {
        var links = document.querySelectorAll(".noTabs__document .doc-container .linebylineInput");
        for (var i = 0; i < links.length; i++) {
            if ((i + 1) % 2 == 0) {
                links[i].classList.add('even');
            }
            else {
                links[i].classList.add('odd');
            }
        }
    };

    componentWillUnmount() {
        this.props.actions.clearCashDocument();
        this.setState({
            docId: 0
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.document.id !== this.props.document.id) {
            let doc = nextProps.document
            doc.docDate === null ? moment().format('YYYY-MM-DD') : moment(doc.docDate).format('YYYY-MM-DD')
            doc.requiredDate === null ? moment().format('YYYY-MM-DD') : moment(doc.requiredDate).format('YYYY-MM-DD')
            doc.replayDate === null ? moment().format('YYYY-MM-DD') : moment(doc.replayDate).format('YYYY-MM-DD')
            this.setState({
                document: doc,
                hasWorkflow: nextProps.hasWorkflow,
                message: nextProps.document.message,
                replayMsg: nextProps.document.replayMsg,
                loadingPage: false
            });
            this.fillDropDowns(nextProps.document.id > 0 ? true : false);
            this.checkDocumentIsView();
        }
    };

    componentDidUpdate(prevProps) {
        if (this.props.hasWorkflow !== prevProps.hasWorkflow) {
            this.checkDocumentIsView();
        }
        if (prevProps.showModal != this.props.showModal) {
            this.setState({ showModal: this.props.showModal });
        }
    }

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!(Config.IsAllow(638))) {
                this.setState({ isViewMode: true });
            }
            if (this.state.isApproveMode != true && Config.IsAllow(638)) {
                if (this.props.hasWorkflow == false && Config.IsAllow(638)) {
                    if (this.props.document.status !== false && Config.IsAllow(638)) {
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

    componentWillMount() {
        if (this.state.docId > 0) {
            //this.setState({ loadingPage: true })
            let url = "GetLogsSiteInstructionsForEdit?id=" + this.state.docId
            // this.setState({ loadingPage: true })
            this.props.actions.documentForEdit(url, this.state.docTypeId, 'siteInstructions');

        } else {

            let document = {
                arrange: arrange,
                projectId: projectId,
                fromCompanyId: '',
                fromContactId: '',
                toCompanyId: '',
                toContactId: '',
                subject: '',
                refDoc: '',
                docDate: moment().format('YYYY-MM-DD'),
                status: true,
                docType: this.state.docTypeId,
                requiredDate: moment().format('YYYY-MM-DD'),
                replayDate: moment().format('YYYY-MM-DD'),
                contractId: '',
                receivedFor: '',
                replayMsg: '',
                message: '',
                inspectionRequestId: '',
                orderId: 0,
                orderType: ''
            };
            this.setState({ document });
            this.fillDropDowns(false);
            this.props.actions.documentForAdding()
            this.GetNExtArrange();
        }
    };

    GetNExtArrange() {
        this.setState({ loadingPage: true })
        let url = "GetNextArrangeMainDoc?projectId=" + this.state.projectId + "&docType=" + this.state.docTypeId + "&companyId=" + this.state.document.fromCompanyId + "&contactId=" + this.state.document.fromContactId;
        dataservice.GetNextArrangeMainDocument(url).then(res => {
            let document = this.state.document
            document.arrange = res;
            this.setState({ document, loadingPage: false });
        })
    }

    fillSubDropDownInEdit(url, param, value, subField, subSelectedValue, subDatasource) {
        let action = url + "?" + param + "=" + value
        dataservice.GetDataList(action, 'contactName', 'id').then(result => {
            if (this.props.changeStatus === true) {
                let toSubField = this.state.document[subField];
                let targetFieldSelected = find(result, function (i) { return i.value == toSubField; });
                this.setState({ [subSelectedValue]: targetFieldSelected, [subDatasource]: result });
            }
        });
    }

    fillDropDowns(isEdit) {
        dataservice.GetDataListCached("GetProjectProjectsCompaniesForList?projectId=" + this.state.projectId, 'companyName', 'companyId', 'companies', this.state.projectId, "projectId").then(result => {
            if (isEdit) {
                let companyId = this.props.document.fromCompanyId;
                if (companyId) {
                    this.setState({ selectedFromCompany: { label: this.props.document.fromCompanyName, value: companyId } });
                    this.fillSubDropDownInEdit('GetContactsByCompanyId', 'companyId', companyId, 'fromContactId', 'selectedFromContact', 'fromContacts');
                }
                let toCompanyId = this.props.document.toCompanyId;
                if (toCompanyId) {
                    this.setState({ selectedToCompany: { label: this.props.document.toCompanyName, value: toCompanyId } });
                    this.fillSubDropDownInEdit('GetContactsByCompanyId', 'companyId', toCompanyId, 'toContactId', 'selectedToContact', 'ToContacts');
                }
            }
            this.setState({ companies: [...result] });
        });

        if (!isEdit) {
            dataservice.GetDataList("GetPoContractForList?projectId=" + this.state.projectId, 'subject', 'id').then(result => {
                this.setState({ contracts: [...result] });
            });
        }

        dataservice.GetDataList("GetInspectionRequest?projectId=" + this.state.projectId, 'subject', 'id').then(result => {

            if (isEdit) {
                let inspectionRequestId = this.props.document.inspectionRequestId;
                let inspectionRequest = {};
                if (inspectionRequestId) {
                    inspectionRequest = find(result, function (i) { return i.value == inspectionRequestId; });
                    this.setState({ selecetedinspectionRequest: inspectionRequest });
                }
            }
            this.setState({ inspectionRequests: [...result] });
        });


    }

    onChangeMessage = (value, name) => {
        if (value != null) {
            this.setState({ [name]: value });
            let updated_document = { ...this.state.document };
            updated_document[name] = value;
            this.setState({ document: updated_document });
        }
    };

    handleChange(e, field) {
        let updated_document = { ...this.state.document };
        updated_document[field] = e.target.value;
        this.setState({ document: updated_document });
    }

    handleChangeDate(e, field) {

        let original_document = { ...this.state.document };

        let updated_document = {};

        updated_document[field] = e;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            document: { ...updated_document }
        });
    }

    handleChangeDropDown(event, field, isSubscrib, targetState, url, param, selectedValue, subscribeState, initalState) {
        if (event == null) return;
        let original_document = { ...this.state.document };
        let updated_document = {};
        updated_document[field] = event.value;
        updated_document = Object.assign(original_document, updated_document);
        this.setState({
            document: updated_document,
            [selectedValue]: event
        }, function () {
            if (field === 'contractId')
                this.setOrder(event)
        });
        if (subscribeState) {
            this.setState({ [subscribeState]: initalState })
        }
        if (isSubscrib) {
            let action = url + "?" + param + "=" + event.value
            dataservice.GetDataList(action, 'contactName', 'id').then(result => {
                this.setState({
                    [targetState]: result
                });
            });
        }
    }

    editSiteInstruction(event) {
        this.setState({
            isLoading: true
        });
        let saveDocument = { ...this.state.document };
        saveDocument.docDate = moment(saveDocument.docDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");
        saveDocument.requiredDate = moment(saveDocument.requiredDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");
        dataservice.addObject('EditLogsSiteInstructions', saveDocument).then(result => {
            this.setState({
                isLoading: false
            });

            toast.success(Resources["operationSuccess"][currentLanguage]);
            if (this.state.isApproveMode === false) {
                this.props.history.push(
                    this.state.perviousRoute
                );
            }
        });
    }

    saveSiteInstruction(event) {
        let saveDocument = { ...this.state.document };
        saveDocument.docDate = moment(saveDocument.docDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");
        saveDocument.requiredDate = moment(saveDocument.requiredDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");
        saveDocument.replayDate = moment(saveDocument.replayDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");

        saveDocument.projectId = this.state.projectId;
        this.setState({ isLoading: true })
        dataservice.addObject('AddLogsSiteInstructions', saveDocument).then(result => {
            this.setState({
                docId: result.id,
                isLoading: false
            });
            toast.success(Resources["operationSuccess"][currentLanguage]);
        });
    }

    saveAndExit(event) {
        this.props.history.push({
            pathname: "/siteInstructions/" + this.state.projectId
        });
    }

    viewAttachments() {
        return (
            this.state.docId > 0 ? (
                Config.IsAllow(3314) === true ?
                    <ViewAttachment isApproveMode={this.state.isViewMode} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} deleteAttachments={864} />
                    : null)
                : null
        )
    }

    setOrder = (event) => {
        let data = event.value.split('-')
        let orderId = data[0]
        let orderType = ''
        if (data[1] === '1')
            orderType = 'Contract'
        else
            orderType = 'purchaseOrder'
        let siteInstruction = { ...this.state.document }
        siteInstruction.orderId = orderId
        siteInstruction.orderType = orderType
        this.setState({ document: { ...siteInstruction } })
    }

    showOptionPanel = () => {
        this.props.actions.showOptionPanel(true);
    }

    render() {

        return (
            <div className="mainContainer">
                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document readOnly_inputs" : "documents-stepper noTabs__document"}>
                    <HeaderDocument projectName={projectName} isViewMode={this.state.isViewMode} perviousRoute={this.state.perviousRoute} docTitle={Resources.siteInstructions[currentLanguage]}
                        moduleTitle={Resources['technicalOffice'][currentLanguage]} />
                    {this.state.loadingPage ? <LoadingSection /> :
                        <div className="doc-container">
                            <div className="step-content">
                                <div id="step1" className="step-content-body">
                                    <div className="subiTabsContent">
                                        <div className="document-fields">
                                            <Formik
                                                initialValues={{ ...this.state.document }}
                                                validationSchema={validationSchema}
                                                enableReinitialize={true}
                                                onSubmit={(values) => {
                                                    if (this.props.showModal) { return; }

                                                    if (this.props.changeStatus === true && this.state.docId > 0) {
                                                        this.editSiteInstruction();
                                                    } else if (this.props.changeStatus === false && this.state.docId === 0) {
                                                        this.saveSiteInstruction();
                                                    } else {
                                                        this.saveAndExit();
                                                    }
                                                }}>
                                                {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                                                    <Form id="ClientSelectionForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>
                                                        <div className="proForm first-proform">
                                                            <div className="linebylineInput valid-input">
                                                                <label className="control-label">{Resources.subject[currentLanguage]}</label>
                                                                <div className={"inputDev ui input" + (errors.subject && touched.subject ? (" has-error") : !errors.subject && touched.subject ? (" has-success") : " ")} >
                                                                    <input name='subject' className="form-control fsadfsadsa"
                                                                        id="subject"
                                                                        placeholder={Resources.subject[currentLanguage]}
                                                                        autoComplete='off'
                                                                        value={this.state.document.subject}
                                                                        onBlur={(e) => {
                                                                            handleBlur(e)
                                                                            handleChange(e)
                                                                        }}
                                                                        onChange={(e) => this.handleChange(e, 'subject')} />
                                                                    {touched.subject ? (<em className="pError">{errors.subject}</em>) : null}
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
                                                            <div className="linebylineInput valid-input">
                                                                <label className="control-label">{Resources.arrange[currentLanguage]}</label>
                                                                <div className="ui input inputDev"  >
                                                                    <input type="text" className="form-control" id="arrange" readOnly
                                                                        value={this.state.document.arrange}
                                                                        name="arrange"
                                                                        placeholder={Resources.arrange[currentLanguage]}
                                                                        onBlur={(e) => {
                                                                            handleChange(e)
                                                                            handleBlur(e)
                                                                        }}
                                                                        onChange={(e) => this.handleChange(e, 'arrange')} />
                                                                </div>
                                                            </div>
                                                            <div className="linebylineInput valid-input alternativeDate">
                                                                <DatePicker title='docDate'
                                                                    name="docDate"
                                                                    startDate={this.state.document.docDate}
                                                                    handleChange={e => this.handleChangeDate(e, 'docDate')} />
                                                            </div>
                                                            <div className="linebylineInput valid-input alternativeDate">
                                                                <DatePicker title='requiredDate'
                                                                    name="requiredDate"
                                                                    startDate={this.state.document.requiredDate}
                                                                    handleChange={e => this.handleChangeDate(e, 'requiredDate')} />
                                                            </div>
                                                            <div className="linebylineInput valid-input mix_dropdown">
                                                                <label className="control-label">{Resources.fromCompany[currentLanguage]}</label>
                                                                <div className="supervisor__company">
                                                                    <div className="super_name">
                                                                        <Dropdown
                                                                            data={this.state.companies}
                                                                            isMulti={false}
                                                                            selectedValue={this.state.selectedFromCompany}
                                                                            handleChange={event => {
                                                                                this.handleChangeDropDown(event, 'fromCompanyId', true, 'fromContacts', 'GetContactsByCompanyId', 'companyId', 'selectedFromCompany', 'selectedFromContact', { label: Resources.fromContactRequired[currentLanguage], value: "0" })
                                                                            }}
                                                                            styles={CompanyDropdown}
                                                                            classDrop="companyName1"
                                                                            index="fromCompanyId"
                                                                            name="fromCompanyId"
                                                                            id="fromCompanyId" />
                                                                    </div>
                                                                    <div className="super_company">
                                                                        <Dropdown
                                                                            isMulti={false}
                                                                            data={this.state.fromContacts}
                                                                            selectedValue={this.state.selectedFromContact}
                                                                            handleChange={event => this.handleChangeDropDown(event, 'fromContactId', false, '', '', '', 'selectedFromContact')}
                                                                            onChange={setFieldValue}
                                                                            onBlur={setFieldTouched}
                                                                            error={errors.fromContactId}
                                                                            touched={touched.fromContactId}
                                                                            isClear={false}
                                                                            index="IR-fromContactId"
                                                                            name="fromContactId"
                                                                            id="fromContactId"
                                                                            classDrop="contactName1"
                                                                            styles={ContactDropdown} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="linebylineInput valid-input mix_dropdown">
                                                                <label className="control-label">{Resources.toCompany[currentLanguage]}</label>
                                                                <div className="supervisor__company">
                                                                    <div className="super_name">
                                                                        <Dropdown
                                                                            isMulti={false}
                                                                            data={this.state.companies}
                                                                            selectedValue={this.state.selectedToCompany}
                                                                            handleChange={event =>
                                                                                this.handleChangeDropDown(event, 'toCompanyId', true, 'ToContacts', 'GetContactsByCompanyId', 'companyId', 'selectedToCompany', 'selectedToContact', { label: Resources.toContactRequired[currentLanguage], value: "0" })}
                                                                            name="toCompanyId"
                                                                            styles={CompanyDropdown}
                                                                            classDrop="companyName1" />
                                                                    </div>
                                                                    <div className="super_company">
                                                                        <Dropdown
                                                                            isMulti={false}
                                                                            data={this.state.ToContacts}
                                                                            selectedValue={this.state.selectedToContact}
                                                                            handleChange={event => this.handleChangeDropDown(event, 'toContactId', false, '', '', '', 'selectedToContact')}
                                                                            onChange={setFieldValue}
                                                                            onBlur={setFieldTouched}
                                                                            error={errors.toContactId}
                                                                            touched={touched.toContactId}
                                                                            isClear={false}
                                                                            index="IR-toContactId"
                                                                            name="toContactId"
                                                                            id="toContactId"
                                                                            classDrop="contactName1"
                                                                            styles={ContactDropdown}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="linebylineInput valid-input fullInputWidth">
                                                                {this.props.changeStatus ?
                                                                    <React.Fragment>
                                                                        <label className="control-label">{Resources.contractPo[currentLanguage]}</label>
                                                                        <div className="ui input inputDev "  >
                                                                            <input type="text" className="form-control" id="contractPo" readOnly
                                                                                value={this.state.document.contractName}
                                                                                name="contractPo"
                                                                                placeholder={Resources.contractPo[currentLanguage]} />
                                                                        </div>
                                                                    </React.Fragment> :
                                                                    <Dropdown
                                                                        title="contractPo"
                                                                        data={this.state.contracts}
                                                                        selectedValue={this.state.selectedContract}
                                                                        handleChange={event => {
                                                                            this.handleChangeDropDown(event, 'contractId', false, '', '', '', 'selectedContract');
                                                                        }}
                                                                        index="contractId" />
                                                                }
                                                            </div>
                                                            <div className="linebylineInput valid-input">
                                                                <label className="control-label">{Resources.receivedFor[currentLanguage]}</label>
                                                                <div className="ui input inputDev"  >
                                                                    <input type="text" className="form-control" id="receivedFor"
                                                                        value={this.state.document.receivedFor}
                                                                        name="receivedFor"
                                                                        placeholder={Resources.receivedFor[currentLanguage]}
                                                                        onChange={(e) => this.handleChange(e, 'receivedFor')} />
                                                                </div>
                                                            </div>
                                                            <div className="linebylineInput valid-input">
                                                                <Dropdown
                                                                    title="inspectionRequest"
                                                                    isMulti={false}
                                                                    data={this.state.inspectionRequests}
                                                                    selectedValue={this.state.selecetedinspectionRequest}
                                                                    handleChange={event => this.handleChangeDropDown(event, 'inspectionRequestId', false, '', '', '', 'selecetedinspectionRequest')}
                                                                    index="areaId" />
                                                            </div>
                                                            <div className="letterFullWidth">
                                                                <label className="control-label">{Resources.message[currentLanguage]}</label>
                                                                <div className="inputDev ui input">
                                                                    <TextEditor
                                                                        value={this.state.message}
                                                                        onChange={event => this.onChangeMessage(event, "message")} />
                                                                </div>
                                                            </div>

                                                            {this.props.changeStatus ?
                                                                <Fragment>
                                                                    <div className="linebylineInput valid-input">
                                                                        <label className="control-label">{Resources.answer[currentLanguage]}</label>
                                                                        <div className="inputDev ui input">
                                                                            <TextEditor
                                                                                value={this.state.replayMsg}
                                                                                onChange={event => this.onChangeMessage(event, "replayMsg")} />
                                                                        </div>
                                                                    </div>

                                                                    <div className="linebylineInput valid-input alternativeDate" style={{ alignItems: 'flex-start' }}>
                                                                        <DatePicker title='replyDate'
                                                                            name="requiredDate"
                                                                            startDate={this.state.document.replayDate}
                                                                            handleChange={e => this.handleChangeDate(e, 'replayDate')} />
                                                                    </div>
                                                                </Fragment>
                                                                : null}

                                                        </div>
                                                        <div className="slider-Btns">
                                                            {this.props.changeStatus === false ?
                                                                <React.Fragment>
                                                                    {this.state.isLoading === false ? (
                                                                        <button className={this.props.changeStatus == false ? 'primaryBtn-1 btn meduimBtn ' : ' primaryBtn-1 btn meduimBtn  disNone'} type="submit">
                                                                            {this.state.docId > 0 && this.props.changeStatus === false ? Resources.saveAndExit[currentLanguage] : Resources.save[currentLanguage]}
                                                                        </button>
                                                                    ) : (
                                                                            <button className="primaryBtn-1 btn meduimBtn disabled" disabled="disabled">
                                                                                <div className="spinner">
                                                                                    <div className="bounce1" />
                                                                                    <div className="bounce2" />
                                                                                    <div className="bounce3" />
                                                                                </div>
                                                                            </button>
                                                                        )}
                                                                </React.Fragment> : null}
                                                        </div>
                                                        {
                                                            this.props.changeStatus === true ?
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
                                                                            documentName={Resources.siteInstructions[currentLanguage]}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                : null
                                                        }
                                                    </Form>
                                                )}
                                            </Formik>
                                        </div>
                                        <div className="doc-pre-cycle letterFullWidth">
                                            <div>
                                                {this.state.docId > 0 && this.state.isViewMode === false ? (
                                                    <UploadAttachment changeStatus={this.props.changeStatus}
                                                        AddAttachments={863} EditAttachments={3269} ShowDropBox={3601}
                                                        ShowGoogleDrive={3602} docTypeId={this.state.docTypeId}
                                                        docId={this.state.docId}
                                                        projectId={this.state.projectId} />) : null}
                                                {this.viewAttachments()}
                                                <Fragment>
                                                    <div className="document-fields tableBTnabs">
                                                        {this.state.docId > 0 ? <AddDocAttachment isViewMode={this.state.isViewMode} projectId={projectId} docTypeId={this.state.docTypeId} docId={this.state.docId} /> : null}
                                                    </div>
                                                </Fragment>
                                                {this.props.changeStatus === true ? <ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} /> : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
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
        projectId: state.communication.projectId,
        showModal: state.communication.showModal
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(siteInstructionsAddEdit))