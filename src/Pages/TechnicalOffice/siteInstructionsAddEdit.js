import React, { Component } from "react";

import OptionContainer from "../../Componants/OptionsPanels/OptionContainer";
import { Formik, Form, FastField } from 'formik';
import * as Yup from 'yup';
import dataservice from "../../Dataservice";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import UploadAttachment from '../../Componants/OptionsPanels/UploadAttachment'
import ViewAttachment from '../../Componants/OptionsPanels/ViewAttachmments'
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import Resources from "../../resources.json";

import { withRouter } from "react-router-dom";

import RichTextEditor from 'react-rte';

import { connect } from 'react-redux';
import {
    bindActionCreators
} from 'redux';
import * as communicationActions from '../../store/actions/communication';


import Config from "../../Services/Config.js";
import CryptoJS from 'crypto-js';
import moment from "moment";
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument'
import SkyLight from 'react-skylight';
import Distribution from '../../Componants/OptionsPanels/DistributionList'
import SendToWorkflow from '../../Componants/OptionsPanels/SendWorkFlow'
import DocumentApproval from '../../Componants/OptionsPanels/wfApproval'

import DatePicker from '../../Componants/OptionsPanels/DatePicker'
import { toast } from "react-toastify";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";

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
let arrange = 0;
const _ = require('lodash')
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
                }
                catch{
                    this.props.history.goBack();
                }
            }
            index++;
        }

        this.state = {
            currentTitle: "sendToWorkFlow",
            loadingPage: false,
            showModal: false,
            isViewMode: false,
            isLoading: false,
            isApproveMode: isApproveMode,
            isView: false,
            docId: docId,
            docTypeId: 90,
            projectId: projectId,
            docApprovalId: docApprovalId,
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
            selecetedinspectionRequest: { label: Resources.location[currentLanguage], value: "0" },
            message: RichTextEditor.createEmptyValue(),
        }

        if (!Config.IsAllow(635) || !Config.IsAllow(636) || !Config.IsAllow(638)) {
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
        this.setState({
            docId: 0
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.document && nextProps.document.id) {
            this.setState({
                document: nextProps.document,
                hasWorkflow: nextProps.hasWorkflow,
                message: RichTextEditor.createValueFromString(nextProps.document.message, 'html')
            }, function () {
                let docDate = moment(this.state.document.docDate).format('DD/MM/YYYY')
                let requiredDate = moment(this.state.document.requiredDate).format('DD/MM/YYYY')
                this.setState({ document: { ...this.state.document, docDate: docDate, requiredDate: requiredDate } })
            });
            this.fillDropDowns(nextProps.document.id > 0 ? true : false);
            this.checkDocumentIsView();
        }
    };

    componentDidUpdate(prevProps) {
        if (this.props.hasWorkflow !== prevProps.hasWorkflow) {
            this.checkDocumentIsView();
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
            this.setState({ loadingPage: true })
            let url = "GetLogsSiteInstructionsForEdit?id=" + this.state.docId
            this.setState({ loadingPage: true })
            this.props.actions.documentForEdit(url ,this.state.docTypeId ,'siteInstructions').then(() => {
                this.checkDocumentIsView()
                setTimeout(() => {
                    this.setState({ loadingPage: false })
                }, 500)
            });

        } else {

            let siteInstruction = {
                arrange: arrange,
                projectId: projectId,
                fromCompanyId: '',
                fromContactId: '',
                toCompanyId: '',
                toContactId: '',
                subject: '',
                refDoc: '',
                docDate: moment(),
                status: true,
                docType: this.state.docTypeId,
                requiredDate: moment(),
                replayDate: moment(),
                contractId: '',
                receivedFor: '',
                replayMsg: '',
                message: '',
                inspectionRequestId: '',
                orderId: 0,
                orderType: ''
            };
            this.setState({ document: siteInstruction });
            // , function () {
            //     this.GetNExtArrange();
            // }
            this.fillDropDowns(false);
            //  this.checkDocumentIsView();
            this.props.actions.documentForAdding()
        }
    };

    GetNExtArrange() {
        let original_document = this.state.document;
        let updated_document = {};
        this.setState({ loadingPage: true })
        let url = "GetNextArrangeMainDoc?projectId=" + this.state.projectId + "&docType=" + this.state.docTypeId + "&companyId=" + this.state.document.fromCompanyId + "&contactId=" + this.state.document.fromContactId;
        this.props.actions.GetNextArrange(url);
        dataservice.GetNextArrangeMainDocument(url).then(res => {
            updated_document.arrange = res;
            updated_document = Object.assign(original_document, updated_document);
            this.setState({
                document: updated_document, loadingPage: false
            });
        })
    }

    fillSubDropDownInEdit(url, param, value, subField, subSelectedValue, subDatasource) {
        let action = url + "?" + param + "=" + value
        dataservice.GetDataList(action, 'contactName', 'id').then(result => {
            if (this.props.changeStatus === true) {
                let toSubField = this.state.document[subField];
                let targetFieldSelected = _.find(result, function (i) { return i.value == toSubField; });
                this.setState({
                    [subSelectedValue]: targetFieldSelected,
                    [subDatasource]: result
                });
            }
        });
    }

    fillDropDowns(isEdit) {
        dataservice.GetDataList("GetProjectProjectsCompaniesForList?projectId=" + this.state.projectId, 'companyName', 'companyId').then(result => {
            if (isEdit) {
                let companyId = this.props.document.fromCompanyId;
                if (companyId) {
                    this.setState({
                        selectedFromCompany: { label: this.props.document.fromCompanyName, value: companyId }
                    });
                    this.fillSubDropDownInEdit('GetContactsByCompanyId', 'companyId', companyId, 'fromContactId', 'selectedFromContact', 'fromContacts');
                }

                let toCompanyId = this.props.document.toCompanyId;
                if (toCompanyId) {
                    this.setState({
                        selectedToCompany: { label: this.props.document.toCompanyName, value: toCompanyId }
                    });

                    this.fillSubDropDownInEdit('GetContactsByCompanyId', 'companyId', toCompanyId, 'toContactId', 'selectedToContact', 'ToContacts');
                }
            }
            this.setState({
                companies: [...result]
            });
        });

        dataservice.GetDataList("GetPoContractForList?projectId=" + this.state.projectId, 'subject', 'id').then(result => {
            if (isEdit) {
                let contractId = this.state.document.contractId;
                let contract = {};
                if (contractId) {
                    contract = _.find(result, function (i) { return i.value == contractId; });

                    this.setState({
                        selectedContract: contract
                    });
                }
            }
            this.setState({
                contracts: [...result]
            });
        });

        dataservice.GetDataList("GetInspectionRequest?projectId=" + this.state.projectId, 'subject', 'id').then(result => {

            this.setState({
                inspectionRequests: [...result]
            });

            if (isEdit) {
                let inspectionRequestId = this.props.document.inspectionRequestId;
                let inspectionRequest = {};
                if (inspectionRequestId) {
                    inspectionRequest = _.find(result, function (i) { return i.value == inspectionRequestId; });
                    this.setState({
                        selecetedinspectionRequest: inspectionRequest
                    });
                }
            }
        });


    }

    onChangeMessage = (value) => {
        let isEmpty = !value.getEditorState().getCurrentContent().hasText();
        if (isEmpty === false) {

            this.setState({ message: value });
            if (value.toString('markdown').length > 1) {
                let original_document = { ...this.state.document };

                let updated_document = {};

                updated_document.message = value.toString('markdown');

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
            document: { ...updated_document }
        });
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
        saveDocument.docDate = moment(saveDocument.docDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
        saveDocument.requiredDate = moment(saveDocument.requiredDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
        dataservice.addObject('EditLogsSiteInstructions', saveDocument).then(result => {
            this.setState({
                isLoading: false
            });

            toast.success(Resources["operationSuccess"][currentLanguage]);

            this.props.history.push({
                pathname: "/siteInstructions/" + this.state.projectId
            });
        });
    }

    saveSiteInstruction(event) {
        let saveDocument = { ...this.state.document };
        saveDocument.docDate = moment(saveDocument.docDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
        saveDocument.requiredDate = moment(saveDocument.requiredDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
        saveDocument.replayDate = moment(saveDocument.replayDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS');

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
                Config.IsAllow(3317) === true ?
                    <ViewAttachment docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} deleteAttachments={840} />
                    : null)
                : null
        )
    }

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

    render() {
        console.log(this.state)
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
        return (
            <div className="mainContainer">

                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document readOnly_inputs" : "documents-stepper noTabs__document"}>

                <HeaderDocument projectName={projectName} docTitle={Resources.siteInstructions[currentLanguage]}
                        moduleTitle={Resources['technicalOffice'][currentLanguage]} />

                    {this.state.loadingPage ? <LoadingSection /> :
                        <div className="doc-container">
                            {
                                this.props.changeStatus == true ?
                                    <header className="main__header">
                                        <div className="main__header--div">
                                            <h2 className="zero">
                                                {Resources.goEdit[currentLanguage]}
                                            </h2>
                                            <p className="doc-infohead"><span> {this.state.document.refDoc}</span> - <span> {this.state.document.arrange}</span> - <span>{moment(this.state.document.docDate).format('DD/MM/YYYY')}</span></p>
                                        </div>
                                    </header>
                                    : null
                            }
                            <div className="step-content">
                                <div id="step1" className="step-content-body">
                                    <div className="subiTabsContent">
                                        <div className="document-fields">
                                            <Formik
                                                initialValues={{ ...this.state.document }}
                                                validationSchema={validationSchema}
                                                enableReinitialize={this.props.changeStatus}
                                                onSubmit={(values) => {
                                                    if (this.props.changeStatus === true && this.state.docId > 0) {
                                                        this.editSiteInstruction();
                                                    } else if (this.props.changeStatus === false && this.state.docId === 0) {
                                                        this.saveSiteInstruction();
                                                    } else {
                                                        this.saveAndExit();
                                                    }
                                                }}  >

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
                                                                    onChange={e => setFieldValue('docDate', e)}
                                                                    format={'DD/MM/YYYY'}
                                                                    name="docDate"
                                                                    startDate={this.state.document.docDate}
                                                                    handleChange={e => this.handleChangeDate(e, 'docDate')} />
                                                            </div>
                                                            <div className="linebylineInput valid-input alternativeDate">
                                                                <DatePicker title='requiredDate'
                                                                    format={'DD/MM/YYYY'}
                                                                    onChange={e => setFieldValue('requiredDate', e)}
                                                                    name="requiredDate"
                                                                    startDate={this.state.document.requiredDate}
                                                                    handleChange={e => this.handleChangeDate(e, 'requiredDate')} />
                                                            </div>
                                                            <div className="linebylineInput valid-input mix_dropdown">
                                                                <label className="control-label">{Resources.fromCompany[currentLanguage]}</label>
                                                                <div className="supervisor__company">
                                                                    <div className="super_name">
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
                                                                            id="fromContactId" />
                                                                    </div>
                                                                    <div className="super_company">
                                                                        <Dropdown
                                                                            data={this.state.companies}
                                                                            isMulti={false}
                                                                            selectedValue={this.state.selectedFromCompany}
                                                                            handleChange={event => {
                                                                                this.handleChangeDropDown(event, 'fromCompanyId', true, 'fromContacts', 'GetContactsByCompanyId', 'companyId', 'selectedFromCompany', 'selectedFromContact', { label: Resources.fromContactRequired[currentLanguage], value: "0" })
                                                                            }}

                                                                            index="fromCompanyId"
                                                                            name="fromCompanyId"
                                                                            id="fromCompanyId" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="linebylineInput valid-input mix_dropdown">

                                                                <label className="control-label">{Resources.toCompany[currentLanguage]}</label>
                                                                <div className="supervisor__company">
                                                                    <div className="super_name">
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
                                                                        />
                                                                    </div>
                                                                    <div className="super_company">
                                                                        <Dropdown
                                                                            isMulti={false}
                                                                            data={this.state.companies}
                                                                            selectedValue={this.state.selectedToCompany}
                                                                            handleChange={event =>
                                                                                this.handleChangeDropDown(event, 'toCompanyId', true, 'ToContacts', 'GetContactsByCompanyId', 'companyId', 'selectedToCompany', 'selectedToContact', { label: Resources.toContactRequired[currentLanguage], value: "0" })}
                                                                            name="toCompanyId" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="linebylineInput valid-input">
                                                                <Dropdown
                                                                    title="contractPo"
                                                                    data={this.state.contracts}
                                                                    selectedValue={this.state.selectedContract}
                                                                    handleChange={event => {
                                                                        this.handleChangeDropDown(event, 'contractId', false, '', '', '', 'selectedContract');
                                                                    }}
                                                                    index="contractId" />
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
                                                                    title="areaName"
                                                                    isMulti={false}
                                                                    data={this.state.inspectionRequests}
                                                                    selectedValue={this.state.selecetedinspectionRequest}
                                                                    handleChange={event => this.handleChangeDropDown(event, 'inspectionRequestId', false, '', '', '', 'selecetedinspectionRequest')}
                                                                    index="areaId" />
                                                            </div>
                                                            <div className="letterFullWidth">
                                                                <label className="control-label">{Resources.message[currentLanguage]}</label>
                                                                <div className="inputDev ui input">
                                                                    <RichTextEditor
                                                                        value={this.state.message}
                                                                        onChange={this.onChangeMessage.bind(this)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="slider-Btns">
                                                            <React.Fragment>
                                                                {this.state.isLoading === false ? (
                                                                    <button
                                                                        className={this.props.changeStatus == false ? 'primaryBtn-1 btn meduimBtn ' : ' primaryBtn-1 btn meduimBtn  disNone'}
                                                                        type="submit"
                                                                    >  {this.state.docId > 0 && this.props.changeStatus === false ? Resources.saveAndExit[currentLanguage] : Resources.save[currentLanguage]}
                                                                    </button>
                                                                ) :
                                                                    (
                                                                        <button className="primaryBtn-1 btn meduimBtn disabled" disabled="disabled">
                                                                            <div className="spinner">
                                                                                <div className="bounce1" />
                                                                                <div className="bounce2" />
                                                                                <div className="bounce3" />
                                                                            </div>
                                                                        </button>
                                                                    )}
                                                            </React.Fragment>
                                                        </div>
                                                        {
                                                            this.props.changeStatus === true ?
                                                                <div className="approveDocument">
                                                                    <div className="approveDocumentBTNS">
                                                                        {this.state.isLoading === false ? (
                                                                            <button type='submit' className={this.state.isViewMode === true ? "primaryBtn-1 btn middle__btn disNone" : "primaryBtn-1 btn middle__btn"} >{Resources.save[currentLanguage]}</button>

                                                                        ) :
                                                                            (
                                                                                <button className="primaryBtn-1 btn meduimBtn disabled" disabled="disabled">
                                                                                    <div className="spinner">
                                                                                        <div className="bounce1" />
                                                                                        <div className="bounce2" />
                                                                                        <div className="bounce3" />
                                                                                    </div>
                                                                                </button>
                                                                            )}

                                                                        {this.state.isApproveMode === true ?
                                                                            <div >
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
                                                    </Form>
                                                )}
                                            </Formik>
                                        </div>
                                        <div className="doc-pre-cycle letterFullWidth">
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
                                    </div>
                                </div>
                            </div>

                        </div>
                    }
                </div>
                <div className="largePopup largeModal " style={{ display: this.state.showModal ? 'block' : 'none' }}>
                    <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref} title={Resources[this.state.currentTitle][currentLanguage]}>
                        {this.state.currentComponent}
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
        projectId: state.communication.projectId
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
)(withRouter(siteInstructionsAddEdit))