import React, { Component } from "react";

import OptionContainer from "../../Componants/OptionsPanels/OptionContainer";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import dataservice from "../../Dataservice";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import UploadAttachment from '../../Componants/OptionsPanels/UploadAttachment'
import ViewAttachment from '../../Componants/OptionsPanels/ViewAttachmments'
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import Resources from "../../resources.json";
import ModernDatepicker from 'react-modern-datepicker';
import { withRouter } from "react-router-dom";
import RichTextEditor from 'react-rte';
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
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const validationSchema = Yup.object().shape({
    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),
    refDoc: Yup.string().required(Resources['refDoc'][currentLanguage]),
    fromContact: Yup.string().required(Resources['fromContactRequired'][currentLanguage]),
    toContact: Yup.string().required(Resources['toContactRequired'][currentLanguage])

})

let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
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
            isView: false,
            docId: docId,
            docTypeId: 19,
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
            selectedReportType: { label: Resources.disciplineRequired[currentLanguage], value: "0" },
            message: RichTextEditor.createEmptyValue()
        }

        if (!Config.IsAllow(423) || !Config.IsAllow(424) || !Config.IsAllow(426)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/Report/" + projectId
            });
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
        console.log('props', nextProps)
        if (nextProps.document && nextProps.document.id) {
            this.setState({
                document: { ...nextProps.document },
                hasWorkflow: nextProps.hasWorkflow,
                selectedReportType: { label: nextProps.document.reportTypeName, value: nextProps.document.reportTypeId }
            });
            this.fillDropDowns(nextProps.document.id > 0 ? true : false);
            this.checkDocumentIsView();
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


    componentWillMount() {
        if (this.state.docId > 0) {
            let url = "GetCommunicationReportForEdit?id=" + this.state.docId
            this.props.actions.documentForEdit(url).then(() => {
                this.setState({ isLoading: false })
            })

            if (!Config.IsAllow(423) || !Config.IsAllow(424) || !Config.IsAllow(426)) {

            }
        } else {
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

        dataservice.addObject('EditCommunicationReport', this.state.document).then(result => {
            this.setState({
                isLoading: true
            });

            toast.success(Resources["operationSuccess"][currentLanguage]);

            this.props.history.push({
                pathname: "/Report/" + this.state.projectId
            });
        });
    }

    saveReport() {
        let reportTypeId = this.state.document.reportType.value
        let report = Object.assign({ ...this.state.document }, { reportTypeId: reportTypeId })
        report.docDate = moment(report.docDate).format('MM/DD/YYYY');
        dataservice.addObject('AddCommunicationReport', report).then(result => {
            this.setState({
                docId: result.id
            });
            toast.success(Resources["operationSuccess"][currentLanguage]);
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
    saveAndExit(event) {
        this.props.history.push({
            pathname: "/Report/" + this.state.projectId
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
        return (
            <div className="mainContainer">

                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document readOnly_inputs" : "documents-stepper noTabs__document"}>

                    <div className="submittalHead">
                        <h2 className="zero">{Resources.Reports[currentLanguage]}
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
                                                refDoc: this.state.document.refDoc
                                            }}

                                            validationSchema={validationSchema}
                                            onSubmit={(values) => {
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
                                                                handleChange={event => this.handleChange('reportType', event)}
                                                                index="letter-discipline"
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

                                                            <div className="supervisor__company">
                                                                <div className="super_name">
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
                                                                <div className="super_company">
                                                                    <Dropdown
                                                                        data={this.state.companies}
                                                                        isMulti={false}
                                                                        selectedValue={this.state.selectedFromCompany}
                                                                        handleChange={event => this.handleChange('fromCompany', event)}
                                                                        index="fromCompanyId"
                                                                        name="fromCompanyId"
                                                                        id="fromCompanyId" />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="linebylineInput valid-input mix_dropdown">

                                                            <div className="supervisor__company">
                                                                <div className="super_name">
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
                                                                <div className="super_company">
                                                                    <Dropdown
                                                                        data={this.state.companies}
                                                                        selectedValue={this.state.selectedToCompany}
                                                                        handleChange={event => this.handleChange('toCompany', event)}
                                                                        name="toCompanyId"
                                                                        id="toCompanyId" />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="fullWidthWrapper textLeft">
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
                                                        {this.showBtnsSaving()}
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
                                </div>
                            </div>
                        </div>
                        {
                            this.props.changeStatus === true ?
                                <div className="approveDocument">
                                    {/* <h2 className="zero">ACTIONS</h2> */}
                                    <div className="approveDocumentBTNS">
                                        <button className={this.state.isViewMode === true ? "primaryBtn-1 btn middle__btn disNone" : "primaryBtn-1 btn middle__btn"} onClick={e => this.editReport(e)}>{Resources.save[currentLanguage]}</button>

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
        hasWorkflow: state.communication.hasWorkflow
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