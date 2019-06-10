import React, { Component } from "react";

import OptionContainer from "../../Componants/OptionsPanels/OptionContainer";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import dataservice from "../../Dataservice";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import UploadAttachment from '../../Componants/OptionsPanels/UploadAttachment'
import ViewAttachment from '../../Componants/OptionsPanels/ViewAttachmments'
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import Resources from "../../resources.json";
import ModernDatepicker from 'react-modern-datepicker';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Config from "../../Services/Config.js";
import CryptoJS from 'crypto-js';
import moment from "moment";
import SkyLight from 'react-skylight';
import * as communicationActions from '../../store/actions/communication';
import LoadingSection from '../../Componants/publicComponants/LoadingSection';
import Distribution from '../../Componants/OptionsPanels/DistributionList'
import SendToWorkflow from '../../Componants/OptionsPanels/SendWorkFlow'
import DocumentApproval from '../../Componants/OptionsPanels/wfApproval'
import { toast } from "react-toastify";
import Api from '../../api'
import TextEditor from '../../Componants/OptionsPanels/TextEditor'

import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument'

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const validationSchema = Yup.object().shape({
    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),
    refDoc: Yup.string().required(Resources['refDoc'][currentLanguage]),
    fromContact: Yup.string().required(Resources['fromContactRequired'][currentLanguage]),
    toContact: Yup.string().required(Resources['toContactRequired'][currentLanguage]),
    reportType: Yup.string().required(Resources['reportTypeRequired'][currentLanguage]),



})

let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let perviousRoute = '';
let arrange = 0;
const _ = require('lodash')
class reportsAddEdit extends Component {

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
            currentTitle: "sendToWorkFlow",
            isLoading: true,
            showModal: false,
            isViewMode: false,
            isApproveMode: isApproveMode,
            perviousRoute: perviousRoute,
            isView: false,
            docId: docId,
            docTypeId: 20,
            projectId: projectId,
            docApprovalId: docApprovalId,
            arrange: arrange,
            document: this.props.document ? Object.assign({}, this.props.document) : {},
            companies: [],
            toContacts: [],
            fromContacts: [],
            reportType: [],
            permission: [{ name: 'sendByEmail', code: 429 }, { name: 'sendByInbox', code: 428 },
            { name: 'sendTask', code: 1 }, { name: 'distributionList', code: 957 },
            { name: 'createTransmittal', code: 3043 }, { name: 'sendToWorkFlow', code: 708 },
            { name: 'viewAttachments', code: 3326 }, { name: 'deleteAttachments', code: 822 }],
            selectedFromCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
            selectedToCompany: { label: Resources.toCompanyRequired[currentLanguage], value: "0" },
            selectedFromContact: { label: Resources.fromContactRequired[currentLanguage], value: "0" },
            selectedToContact: { label: Resources.toContactRequired[currentLanguage], value: "0" },
            selectedReportType: { label: Resources.pleaseSelectReportType[currentLanguage], value: "0" },
            message: ''
        }

        if (!Config.IsAllow(423) && !Config.IsAllow(424) && !Config.IsAllow(426)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push(
                this.state.perviousRoute
            );
        }
    }



    componentDidMount() {
        this.checkDocumentIsView();
    };

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.hasWorkflow !== prevProps.hasWorkflow) {
            this.checkDocumentIsView();
        }

    }
    componentWillReceiveProps(nextProps, prevProps) {
        if (nextProps.document && nextProps.document.id > 0) {
            this.setState({
                document: { ...nextProps.document },
                hasWorkflow: nextProps.hasWorkflow,
                selectedReportType: { label: nextProps.document.reportTypeName, value: nextProps.document.reportTypeId },
                message: nextProps.document.message
            }, function () {
                let docDate = moment(this.state.document.docDate).format('DD/MM/YYYY')
                this.setState({ document: { ...this.state.document, docDate: docDate } })
            });
            this.fillDropDowns(nextProps.document.id > 0 ? true : false);
            this.checkDocumentIsView();
        }
        if (this.state.showModal != nextProps.showModal) {
            this.setState({ showModal: nextProps.showModal });
        }
    };

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.hasWorkflow !== prevProps.hasWorkflow) {
            this.checkDocumentIsView();
        }
    }

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!(Config.IsAllow(426))) {
                this.setState({ isViewMode: true });
            }
            if (this.state.isApproveMode != true && Config.IsAllow(426)) {
                if (this.props.hasWorkflow == false && Config.IsAllow(426)) {
                    if (this.props.document.status == true && Config.IsAllow(426)) {
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

    componentWillUnmount() {
        this.props.actions.clearCashDocument();
        this.props.actions.documentForAdding()
    }
    componentWillMount() {
        if (this.state.docId > 0) {
            let url = "GetCommunicationReportForEdit?id=" + this.state.docId
            this.props.actions.documentForEdit(url, this.state.docTypeId, 'Reports').then(() => {
                this.setState({ isLoading: false })
            })

            if (!Config.IsAllow(423) || !Config.IsAllow(424) || !Config.IsAllow(426)) {

            }
        } else {
            this.props.actions.documentForAdding()
            let report = {
                projectId: this.state.projectId,
                fromCompanyId: '',
                fromContactId: '',
                toCompanyId: '',
                toContactId: '',
                subject: '',
                message: '',
                docDate: moment().format('DD/MM/YYYY'),
                arrange: '',
                status: 'true',
                refDoc: '',
                reportTypeId: ''
            };
            this.setState({ document: report });
            this.fillDropDowns(false);
        }
    };

    onChangeMessage = (value) => {
        if (value != null) {
            this.setState({ message: value });
            let original_document = { ...this.state.document };
            let updated_document = {};

            updated_document.message = value;

            updated_document = Object.assign(original_document, updated_document);

            this.setState({
                document: updated_document
            });
        }
    };

    fillDropDowns(isEdit) {
        dataservice.GetDataList("GetProjectProjectsCompaniesForList?projectId=" + this.state.projectId, 'companyName', 'companyId').then(result => {
            if (isEdit) {
                let companyId = this.props.document.fromCompanyId;
                if (companyId) {
                    this.setState({
                        selectedFromCompany: { label: this.props.document.fromCompanyName, value: companyId }
                    });
                    this.fillSubDropDownInEdit('GetContactsByCompanyId', 'companyId', companyId, 'fromContactId', 'fromContactName', 'selectedFromContact', 'fromContacts');
                }

                let toCompanyId = this.props.document.toCompanyId;
                if (toCompanyId) {
                    this.setState({
                        selectedToCompany: { label: this.props.document.toCompanyName, value: toCompanyId }
                    });

                    this.fillSubDropDownInEdit('GetContactsByCompanyId', 'companyId', toCompanyId, 'toContactId', 'toContactName', 'selectedToContact', 'ToContacts');
                }

            }
            this.setState({
                companies: [...result]
            });
        });

        dataservice.GetDataList("GetAccountsDefaultList?listType=dailyreporttype&pageNumber=0&pageSize=10000", 'title', 'id').then(result => {
            this.setState({
                reportType: [...result],
                isLoading: false
            });
        });


    }

    fillSubDropDownInEdit(url, param, value, subFieldId, subFieldName, subSelectedValue, subDatasource) {
        let action = url + "?" + param + "=" + value
        dataservice.GetDataList(action, 'contactName', 'id').then(result => {
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
    updateSelectedValue = (selected, label, value, targetState) => {
        let original_document = { ...this.state.document };
        let updated_document = {};
        updated_document[label] = selected.label;
        updated_document[value] = selected.value;
        updated_document = Object.assign(original_document, updated_document);
        this.setState({
            document: updated_document,
            [targetState]: selected
        });
    }
    handleChange = (key, value) => {

        switch (key) {
            case 'fromCompany':
                this.setState({ isLoading: true })
                dataservice.GetDataList('GetContactsByCompanyId?companyId=' + value.value, 'contactName', 'id').then(res => {
                    this.setState({ fromContacts: res, isLoading: false, selectedFromContact: { label: Resources.fromContactRequired[currentLanguage], value: "0" } })
                })
                this.fillSubDropDownInEdit('GetContactsByCompanyId', 'companyId', value.value, 'fromCompanyName', 'fromCompanyId', 'selectedFromCompany', 'fromContacts');
                this.updateSelectedValue(value, 'fromCompanyName', 'fromCompanyId', 'selectedFromCompany')
                break;
            case 'toCompany':
                this.setState({ isLoading: true })
                dataservice.GetDataList('GetContactsByCompanyId?companyId=' + value.value, 'contactName', 'id').then(res => {
                    this.setState({ toContacts: res, isLoading: false, selectedToContact: { label: Resources.toContactRequired[currentLanguage], value: "0" } })
                })
                this.fillSubDropDownInEdit('GetContactsByCompanyId', 'companyId', value.value, 'toCompanyName', 'toCompanyId', 'selectedToCompany', 'toContacts');
                this.updateSelectedValue(value, 'toCompanyName', 'toCompanyId', 'selectedToCompany')
                break;
            case 'fromContact':
                this.setState({ isLoading: true })
                this.updateSelectedValue(value, 'fromContactName', 'fromContactId', 'selectedFromContact')
                Api.get('GetNextArrangeMainDoc?projectId=' + this.state.projectId + '&docType=' + this.state.docTypeId + '&companyId=' + this.state.selectedFromCompany.value + '&contactId=' + this.state.selectedFromContact.value).then(res => {
                    this.setState({ document: { ...this.state.document, arrange: res }, isLoading: false })
                })
                break;
            case 'toContact':
                this.updateSelectedValue(value, 'toContactName', 'toContactId', 'selectedToContact')
                break;
            default:
                this.setState({ document: { ...this.state.document, [key]: value } })
        }
    }

    editReport(event) {
        this.setState({
            isLoading: true
        });
        let docDate = moment(this.state.document.docDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS')
        let document = Object.assign(this.state.document, { docDate: docDate })
        dataservice.addObject('EditCommunicationReport', document).then(result => {
            this.setState({
                isLoading: true
            });

            toast.success(Resources["operationSuccess"][currentLanguage]);
            if (this.state.isApproveMode === false) {
                this.props.history.push( 
                    this.state.perviousRoute
                  );
            }
        });
    }

    saveReport() {
        let reportTypeId = this.state.document.reportType.value
        let report = Object.assign({ ...this.state.document }, { reportTypeId: reportTypeId })
        report.docDate = moment(report.docDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS')
        dataservice.addObject('AddCommunicationReport', report).then(result => {
            this.setState({
                docId: result.id
            });
            toast.success(Resources["operationSuccess"][currentLanguage]);
        });
    }

    saveAndExit(event) {
        this.props.history.push({
            pathname: "/Reports/" + this.state.projectId
        });
    }

    showBtnsSaving() {
        let btn = null;

        if (this.state.docId === 0) {
            btn = <button className="primaryBtn-1 btn meduimBtn" type="submit" >{Resources.save[currentLanguage]}</button>;
        } else if (this.state.docId > 0 && this.props.changeStatus === false) {
            btn = <button className="primaryBtn-1 btn mediumBtn" type="submit" >{Resources.saveAndExit[currentLanguage]}</button>
        }
        return btn;
    }
    viewAttachments() {
        return (
            this.state.docId > 0 ? (
                Config.IsAllow(3326) === true ?
                    <ViewAttachment docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} deleteAttachments={822} />
                    : null)
                : null
        )
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
    render() {
        let actions = [
            { title: "distributionList", value: <Distribution docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />, label: Resources["distributionList"][currentLanguage] },
            { title: "sendToWorkFlow", value: <SendToWorkflow docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />, label: Resources["sendToWorkFlow"][currentLanguage] },
            {
                title: "documentApproval", value: <DocumentApproval docTypeId={this.state.docTypeId} docId={this.state.docId} previousRoute={this.state.perviousRoute} approvalStatus={true}
                    projectId={this.state.projectId} docApprovalId={this.state.docApprovalId} currentArrange={this.state.arrange} />, label: Resources["documentApproval"][currentLanguage]
            }, {
                title: "documentApproval", value: <DocumentApproval docTypeId={this.state.docTypeId} docId={this.state.docId} previousRoute={this.state.perviousRoute} approvalStatus={false}
                    projectId={this.state.projectId} docApprovalId={this.state.docApprovalId} currentArrange={this.state.arrange} />, label: Resources["documentApproval"][currentLanguage]
            }

        ];
        return (
            <div className="mainContainer">
                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document readOnly_inputs" : "documents-stepper noTabs__document"}>
                    <HeaderDocument projectName={projectName} isViewMode={this.state.isViewMode} perviousRoute={this.state.perviousRoute} docTitle={Resources.Reports[currentLanguage]} moduleTitle={Resources['communication'][currentLanguage]} />
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
                                        {this.state.isLoading ? <LoadingSection /> : null}
                                        <Formik
                                            initialValues={{
                                                subject: this.state.document.subject,
                                                fromContact: this.state.selectedFromContact.value > 0 ? this.state.selectedFromContact : '',
                                                toContact: this.state.selectedToContact.value > 0 ? this.state.selectedToContact : '',
                                                refDoc: this.state.document.refDoc,
                                                reportType: this.state.selectedReportType.value > 0 ? this.state.selectedReportType : ''
                                            }}
                                            enableReinitialize={true}
                                            validationSchema={validationSchema}
                                            onSubmit={(values) => {
                                                if (this.props.showModal) { return; }

                                                if (this.props.changeStatus === true && this.state.docId > 0) {
                                                    this.editReport();
                                                } else if (this.props.changeStatus === false && this.state.docId === 0) {
                                                    this.saveReport();
                                                } else {
                                                    this.saveAndExit();
                                                }
                                            }}  >

                                            {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                                                <Form id="letterForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>

                                                    <div className="proForm first-proform">

                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.subject[currentLanguage]}</label>
                                                            <div className={"inputDev ui input " + (errors.subject && touched.subject ? 'has-error' : !errors.subject && touched.subject ? (" has-success") : " ")} >
                                                                <input name='subject' className="form-control fsadfsadsa" id="subject"
                                                                    placeholder={Resources.subject[currentLanguage]}
                                                                    autoComplete='off'
                                                                    defaultValue={this.state.document.subject}
                                                                    onBlur={(e) => {
                                                                        handleBlur(e)
                                                                        handleChange(e)
                                                                    }}
                                                                    onChange={(e) =>
                                                                        this.handleChange('subject', e.target.value)} />
                                                                {touched.subject ? (<em className="pError">{errors.subject}</em>) : null}

                                                            </div>
                                                        </div>

                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.status[currentLanguage]}</label>
                                                            <div className="ui checkbox radio radioBoxBlue">
                                                                <input type="radio" name="letter-status" defaultChecked={this.state.document.status === false ? null : 'checked'} value="true" onChange={e => this.handleChange('statue', true)} />
                                                                <label>{Resources.oppened[currentLanguage]}</label>
                                                            </div>
                                                            <div className="ui checkbox radio radioBoxBlue">
                                                                <input type="radio" name="letter-status" defaultChecked={this.state.document.status === false ? 'checked' : null} value="false" onChange={e => this.handleChange('statue', false)} />
                                                                <label>{Resources.closed[currentLanguage]}</label>
                                                            </div>
                                                        </div>

                                                    </div>

                                                    <div className="proForm datepickerContainer">

                                                        <div className="linebylineInput valid-input">
                                                            <div className="inputDev ui input input-group date NormalInputDate">
                                                                <div className="customDatepicker fillter-status fillter-item-c ">
                                                                    <div className="proForm datepickerContainer">
                                                                        <label className="control-label">{Resources.docDate[currentLanguage]}</label>
                                                                        <div className="linebylineInput" >
                                                                            <div className="inputDev ui input input-group date NormalInputDate">
                                                                                <ModernDatepicker
                                                                                    date={this.state.document.docDate}
                                                                                    format={'DD-MM-YYYY'}
                                                                                    showBorder
                                                                                    onChange={e => this.handleChange('docDate', e)}
                                                                                    placeholder={'Select a date'}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="linebylineInput valid-input">
                                                            <Dropdown
                                                                title="reportType"
                                                                data={this.state.reportType}
                                                                selectedValue={this.state.selectedReportType}
                                                                handleChange={event => {
                                                                    this.handleChange('reportType', event)
                                                                    this.setState({ selectedReportType: event })
                                                                }}
                                                                index="letter-discipline"
                                                                onChange={setFieldValue}
                                                                onBlur={setFieldTouched}
                                                                error={errors.reportType}
                                                                touched={touched.reportType}
                                                            />
                                                        </div>

                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.arrange[currentLanguage]}</label>
                                                            <div className={"ui input inputDev "} >
                                                                <input type="text" className="form-control" id="arrange" readOnly
                                                                    defaultValue={this.state.document.arrange}
                                                                    name="arrange"
                                                                    placeholder={Resources.arrange[currentLanguage]}
                                                                    onBlur={(e) => {
                                                                        handleChange(e)
                                                                        handleBlur(e)
                                                                    }}
                                                                    onChange={(e) => this.handleChange('arrange', e.target.value)} />

                                                            </div>
                                                        </div>

                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.refDoc[currentLanguage]}</label>
                                                            <div className={"inputDev ui input " + (errors.refDoc && touched.refDoc ? 'has-error' : !errors.refDoc && touched.refDoc ? (" has-success") : " ")} >
                                                                <input type="text" className="form-control" id="refDoc"
                                                                    defaultValue={this.state.document.refDoc}
                                                                    name="refDoc"
                                                                    placeholder={Resources.refDoc[currentLanguage]}
                                                                    onBlur={(e) => {
                                                                        handleChange(e)
                                                                        handleBlur(e)
                                                                    }}
                                                                    onChange={(e) => this.handleChange('refDoc', e.target.value)} />

                                                                {touched.refDoc ? (<em className="pError">{errors.refDoc}</em>) : null}

                                                            </div>
                                                        </div>

                                                        <div className="linebylineInput valid-input mix_dropdown">
                                                            <label className="control-label">{Resources.fromCompany[currentLanguage]}</label>
                                                            <div className="supervisor__company">
                                                                <div className="super_name">
                                                                    <Dropdown
                                                                        data={this.state.companies}
                                                                        isMulti={false}
                                                                        selectedValue={this.state.selectedFromCompany}
                                                                        handleChange={event => this.handleChange('fromCompany', event)}
                                                                        index="fromCompanyId"
                                                                        name="fromCompanyId"
                                                                        id="fromCompanyId" />
                                                                </div>
                                                                <div className="super_company">
                                                                    <Dropdown
                                                                        name="fromContact"
                                                                        data={this.state.fromContacts}
                                                                        handleChange={e => this.handleChange('fromContact', e)}
                                                                        placeholder='ContactName'
                                                                        selectedValue={this.state.selectedFromContact}
                                                                        onChange={setFieldValue}
                                                                        onBlur={setFieldTouched}
                                                                        error={errors.fromContact}
                                                                        touched={touched.fromContact}
                                                                        index="fromContact"
                                                                        id="fromContact" />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="linebylineInput valid-input mix_dropdown">
                                                            <label className="control-label">{Resources.toCompany[currentLanguage]}</label>
                                                            <div className="supervisor__company">
                                                                <div className="super_name">
                                                                    <Dropdown
                                                                        data={this.state.companies}
                                                                        selectedValue={this.state.selectedToCompany}
                                                                        handleChange={event => this.handleChange('toCompany', event)}
                                                                        name="toCompanyId"
                                                                        id="toCompanyId" />
                                                                </div>
                                                                <div className="super_company">
                                                                    <Dropdown
                                                                        name='toContact'
                                                                        data={this.state.toContacts}
                                                                        handleChange={(e) => this.handleChange("toContact", e)}
                                                                        placeholder='ContactName'
                                                                        selectedValue={this.state.selectedToContact}
                                                                        onChange={setFieldValue}
                                                                        onBlur={setFieldTouched}
                                                                        error={errors.toContact}
                                                                        touched={touched.toContact} />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="fullWidthWrapper textLeft">
                                                            <label className="control-label">{Resources.message[currentLanguage]}</label>

                                                            <div className="inputDev ui input">
                                                                <TextEditor
                                                                    value={this.state.message}
                                                                    onChange={this.onChangeMessage} />
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div className="slider-Btns">
                                                        {this.showBtnsSaving()}
                                                    </div>
                                                    {
                                                        this.props.changeStatus === true ?
                                                            <div className="approveDocument">
                                                                {/* <h2 className="zero">ACTIONS</h2> */}
                                                                <div className="approveDocumentBTNS">
                                                                    <button className={this.state.isViewMode === true ? "primaryBtn-1 btn middle__btn disNone" : "primaryBtn-1 btn middle__btn"} type='submit'>{Resources.save[currentLanguage]}</button>

                                                                    {this.state.isApproveMode === true ?
                                                                        <div >
                                                                            <button className="primaryBtn-1 btn " type="button" onClick={(e) => this.handleShowAction(actions[2])} >{Resources.approvalModalApprove[currentLanguage]}</button>
                                                                            <button className="primaryBtn-2 btn middle__btn" type="button" onClick={(e) => this.handleShowAction(actions[3])} >{Resources.approvalModalReject[currentLanguage]}</button>

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
                                            {this.state.docId > 0 && this.state.isViewMode === false ? (<UploadAttachment changeStatus={this.props.changeStatus} AddAttachments={821} EditAttachments={3232} ShowDropBox={3625} ShowGoogleDrive={3626} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />) : null}
                                            {this.viewAttachments()}
                                            {this.props.changeStatus === true ?
                                                <ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                                : null}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
        changeStatus: state.communication.changeStatus,
        file: state.communication.file,
        files: state.communication.files,
        hasWorkflow: state.communication.hasWorkflow,
        showModal: state.communication.showModal
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
)(withRouter(reportsAddEdit))