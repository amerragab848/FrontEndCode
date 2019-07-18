import React, { Component } from 'react';
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
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument'

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const validationSchema = Yup.object().shape({
    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),
    callTime: Yup.number().required(Resources['callTime'][currentLanguage]).min(0),
    fromContact: Yup.string().required(Resources['fromContactRequired'][currentLanguage]),
    toContact: Yup.string().required(Resources['toContactRequired'][currentLanguage])
});

let docId = 0;
let projectId = 0;
let projectName = "";
let isApproveMode = 0;
let docApprovalId = 0;
let arrange = 0;
let actions = [];
let perviousRoute = 0;
class phoneAddEdit extends Component {
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

        this.state = {
            currentTitle: "sendToWorkFlow",
            showModal: false,
            isViewMode: false,
            isApproveMode: isApproveMode,
            perviousRoute: perviousRoute,
            isView: false,
            docId: docId,
            docTypeId: 29,
            projectId: projectId,
            docApprovalId: docApprovalId,
            arrange: arrange,
            CompanyData: [],
            fromContactNameData: [],
            toContactNameData: [],
            selectedFromCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
            selectedToCompany: { label: Resources.toCompanyRequired[currentLanguage], value: "0" },
            selectedFromContact: { label: Resources.fromContactRequired[currentLanguage], value: "0" },
            selectedToContact: { label: Resources.toContactRequired[currentLanguage], value: "0" },
            isLoading: true,
            permission: [{ name: 'sendByEmail', code: 0 }, { name: 'sendByInbox', code: 94 },
            { name: 'sendTask', code: 1 }, { name: 'distributionList', code: 965 },
            { name: 'createTransmittal', code: 3051 }, { name: 'sendToWorkFlow', code: 715 },
            { name: 'viewAttachments', code: 3320 }, { name: 'deleteAttachments', code: 834 }],
            phone: {}
        }

        if (!Config.IsAllow(89) && !Config.IsAllow(90) && !Config.IsAllow(92)) {
            toast.warning(Resources['missingPermissions'][currentLanguage])
            this.props.history.push(this.state.perviousRoute);
        }
    }

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!Config.IsAllow(90)) {
                this.setState({ isViewMode: true });
            }
            else if (this.state.isApproveMode != true && Config.IsAllow(90)) {
                if (this.props.hasWorkflow == false && Config.IsAllow(90)) {
                    if (this.props.document.status != false && Config.IsAllow(90)) {
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

    fillSubDropDownInEdit(url, param, value, subFieldId, subFieldName, subSelectedValue, subDatasource) {
        let action = url + "?" + param + "=" + value
        DataService.GetDataList(action, 'contactName', 'id').then(result => {
            if (this.props.changeStatus === true) {
                let _SubFieldId = this.state.phone[subFieldId];
                let _SubFieldName = this.state.phone[subFieldName];
                let targetFieldSelected = { label: _SubFieldName, value: _SubFieldId };
                this.setState({
                    [subSelectedValue]: targetFieldSelected,
                    [subDatasource]: result
                });
            }
        });
    }

    updateSelectedValue = (selected, label, value, targetState) => {
        let original_document = { ...this.state.phone };
        let updated_document = {};
        updated_document[label] = selected.label;
        updated_document[value] = selected.value;
        updated_document = Object.assign(original_document, updated_document);
        this.setState({
            phone: updated_document,
            [targetState]: selected
        });
    }

    handleChange = (key, value) => {

        switch (key) {
            case 'fromCompany':
                this.setState({ isLoading: true })
                DataService.GetDataList('GetContactsByCompanyId?companyId=' + value.value, 'contactName', 'id').then(res => {
                    this.setState({ fromContactNameData: res, isLoading: false, fromCompany: value, selectedFromContact: { label: Resources.fromContactRequired[currentLanguage], value: "0" } })
                })
                this.fillSubDropDownInEdit('GetContactsByCompanyId', 'companyId', value.value, 'fromCompanyName', 'fromCompanyId', 'selectedFromCompany', 'fromContactNameData');
                this.updateSelectedValue(value, 'fromCompanyName', 'fromCompanyId', 'selectedFromCompany')
                break;
            case 'toCompany':
                this.setState({ isLoading: true })
                DataService.GetDataList('GetContactsByCompanyId?companyId=' + value.value, 'contactName', 'id').then(res => {
                    this.setState({ toContactNameData: res, toCompany: value, isLoading: false, selectedToContact: { label: Resources.toContactRequired[currentLanguage], value: "0" } })
                })
                this.fillSubDropDownInEdit('GetContactsByCompanyId', 'companyId', value.value, 'toCompanyName', 'toCompanyId', 'selectedToCompany', 'toContactNameData');
                this.updateSelectedValue(value, 'toCompanyName', 'toCompanyId', 'selectedToCompany')
                break;
            case 'fromContact':
                this.setState({ isLoading: true })
                this.updateSelectedValue(value, 'fromContactName', 'fromContactId', 'selectedFromContact')
                Api.get('GetNextArrangeMainDoc?projectId=' + this.state.projectId + '&docType=' + this.state.docTypeId + '&companyId=' + this.state.selectedFromCompany.value + '&contactId=' + this.state.selectedFromContact.value).then(res => {
                    this.setState({ phone: { ...this.state.phone, arrange: res }, isLoading: false })
                })
                break;
            case 'toContact':
                this.updateSelectedValue(value, 'toContactName', 'toContactId', 'selectedToContact')
                break;
            default:
                this.setState({ phone: { ...this.state.phone, [key]: value } })
        }
    }

    componentWillUnmount() {
        this.props.actions.clearCashDocument();
        this.setState({
            docId: 0
        });
    }

    fillDropDowns(isEdit) {
        DataService.GetDataList('GetProjectProjectsCompaniesForList?projectId=' + projectId, 'companyName', 'companyId').then(res => {
            this.setState({ CompanyData: [...res], isLoading: false })
            if (isEdit) {
                let companyId = this.state.phone.fromCompanyId;
                if (companyId) {
                    this.setState({
                        selectedFromCompany: { label: this.props.document.fromCompanyName, value: companyId }
                    });
                    this.fillSubDropDownInEdit('GetContactsByCompanyId', 'companyId', companyId, 'fromContactId', 'fromContactName', 'selectedFromContact', 'fromContactNameData');
                }
                let toCompanyId = this.state.phone.toCompanyId;
                if (toCompanyId) {
                    let selectedTocCompany = { label: this.state.phone.toCompanyName, value: toCompanyId };
                    this.setState({
                        selectedToCompany: { ...selectedTocCompany }
                    });
                    this.fillSubDropDownInEdit('GetContactsByCompanyId', 'companyId', toCompanyId, 'toContactId', 'toContactName', 'selectedToContact', 'toContactNameData');
                }
            }
        })
    }

    componentWillMount() {
        if (this.state.docId > 0) {

            this.props.actions.documentForEdit('GetPhoneById?id=' + this.state.docId, this.state.docTypeId, "phoneTitle")

            this.checkDocumentIsView();

        } else {

            this.fillDropDowns(false);

            let phone = {
                projectId: projectId,
                subject: '',
                arrange: 0,
                status: true,
                docDate: moment(),
                refDoc: '',
                fromCompanyId: '',
                fromContactId: '',
                toCompanyId: '',
                toContatId: '',
                details: '',
                enteredBy: '',
                callTime: '',
                toPhone: ''
            };
            this.setState({ phone });
            this.props.actions.documentForAdding()
        }
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

    componentDidUpdate(prevProps) {

        if (this.props.hasWorkflow !== prevProps.hasWorkflow || this.props.changeStatus !== prevProps.changeStatus) {
            this.checkDocumentIsView();
        }
        if (prevProps.showModal != this.props.showModal) {
            this.setState({ showModal: this.props.showModal });
        }
    }

    componentWillReceiveProps(props, state) {

        if (props.document && props.document.id > 0) {

            let document = props.document;

            document.docDate = document.docDate != null ? moment(document.docDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');

            this.setState({
                phone: { ...document },
                isLoading: false
            }, function () {
                this.checkDocumentIsView();
            });

            this.fillDropDowns(true);
        }

        if (this.state.showModal != props.showModal) {
            this.setState({ showModal: props.showModal });
        }
    }

    editPhone = () => {

        this.setState({
            isLoading: true
        });

        let phoneObj = { ...this.state.phone };

        phoneObj.docDate = moment(phoneObj.docDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');

        Api.post('EditPhoneById', phoneObj).then(result => {
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

    save = () => {

        this.setState({ isLoading: true })

        let phoneObj = { ...this.state.phone };

        phoneObj.docDate = moment(phoneObj.docDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');

        DataService.addObject('AddPhone', phoneObj).then(result => {
            this.setState({
                docId: result.id,
                isLoading: false
            })
            toast.success(Resources["operationSuccess"][currentLanguage]);
        })
    }

    saveAndExit(event) {
        this.props.history.push({ pathname: "/Phone/" + this.state.projectId });
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

    viewAttachments() {
        return (this.state.docId > 0 ? (Config.IsAllow(3320) === true ?<ViewAttachment isApproveMode={this.state.isViewMode} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={projectId} deleteAttachments={834} /> : null) : null)
    }

    render() {
        let actions = [
            { title: "distributionList", value: <Distribution docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />, label: Resources["distributionList"][currentLanguage] },
            { title: "sendToWorkFlow", value: <SendToWorkflow docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />, label: Resources["sendToWorkFlow"][currentLanguage] },
            { title: "documentApproval", value: <DocumentApproval docTypeId={this.state.docTypeId} docId={this.state.docId} previousRoute={this.state.perviousRoute} approvalStatus={true} projectId={this.state.projectId} docApprovalId={this.state.docApprovalId} currentArrange={this.state.arrange} />, label: Resources["documentApproval"][currentLanguage] },
            { title: "documentApproval", value: <DocumentApproval docTypeId={this.state.docTypeId} docId={this.state.docId} previousRoute={this.state.perviousRoute} approvalStatus={false} projectId={this.state.projectId} docApprovalId={this.state.docApprovalId} currentArrange={this.state.arrange} />, label: Resources["documentApproval"][currentLanguage] }
        ];
        return (
            <div className="mainContainer">
                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document readOnly_inputs" : "documents-stepper noTabs__document"}>
                    <HeaderDocument projectName={projectName} isViewMode={this.state.isViewMode} perviousRoute={this.state.perviousRoute} docTitle={Resources.phoneTitle[currentLanguage]} moduleTitle={Resources['communication'][currentLanguage]} />
                    <div className="doc-container">
                        {
                            this.props.changeStatus == true ?
                                <header className="main__header">
                                    <div className="main__header--div">
                                        <h2 className="zero">
                                            {Resources.goEdit[currentLanguage]}
                                        </h2>
                                        <p className="doc-infohead"><span> {this.state.phone.refDoc}</span> - <span> {this.state.phone.arrange}</span> - <span>{moment(this.state.phone.docDate).format('DD/MM/YYYY')}</span></p>
                                    </div>
                                </header>
                                : null
                        }
                        <div className="step-content">
                            <div className="subiTabsContent">
                                <div className="document-fields">
                                    {this.state.isLoading ? <LoadingSection /> : null}
                                    <Formik
                                        initialValues={{
                                            subject: this.state.phone.subject,
                                            fromContact: this.state.selectedFromContact.value > 0 ? this.state.selectedFromContact : '',
                                            toContact: this.state.selectedToContact.value > 0 ? this.state.selectedToContact : '',
                                            callTime: this.state.phone.callTime
                                        }}
                                        enableReinitialize={true}
                                        validationSchema={validationSchema}
                                        onSubmit={(values) => {
                                            if (this.props.showModal) { return; }

                                            if (this.props.changeStatus === true && this.state.docId > 0) {
                                                this.editPhone();
                                            } else if (this.props.changeStatus === false && this.state.docId === 0) {
                                                this.save();
                                            } else {
                                                this.saveAndExit();
                                            }
                                        }}>
                                        {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldTouched, setFieldValue }) => (
                                            <Form id="signupForm1" className="proForm datepickerContainer" noValidate="novalidate" onSubmit={handleSubmit}>
                                                <div className="proForm first-proform fullWidth_form">
                                                    <div className="linebylineInput valid-input">
                                                        <label className="control-label">{Resources['subject'][currentLanguage]} </label>
                                                        <div className={"inputDev ui input " + (errors.subject && touched.subject ? 'has-error' : !errors.subject && touched.subject ? (" has-success") : " ")}>
                                                            <input name='subject' defaultValue={this.state.phone.subject}
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
                                                            <input type="radio" defaultChecked name="status" defaultChecked={this.state.phone.status === false ? null : 'checked'} value="true" onChange={e => this.handleChange('status', "true")} />
                                                            <label>{Resources['oppened'][currentLanguage]}</label>
                                                        </div>
                                                        <div className="ui checkbox radio radioBoxBlue checked">
                                                            <input type="radio" name="status" defaultChecked={this.state.phone.status === false ? 'checked' : null} value="false" onChange={e => this.handleChange('status', "false")} />
                                                            <label> {Resources['closed'][currentLanguage]}</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="linebylineInput valid-input alternativeDate">
                                                    <DatePicker title='docDate'
                                                        startDate={this.state.phone.docDate}
                                                        handleChange={e => this.handleChange('docDate', e)} />
                                                </div>
                                                <div className="linebylineInput valid-input">
                                                    <label className="control-label">{Resources['arrange'][currentLanguage]} </label>
                                                    <div className={'ui input inputDev '}>
                                                        <input name='arrange' className="form-control" id="arrange" placeholder={Resources['arrange'][currentLanguage]} autoComplete='off'
                                                            readOnly defaultValue={this.state.phone.arrange} onChange={e => this.handleChange('arrange', e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="linebylineInput valid-input linebylineInput__name">
                                                    <label className="control-label">{Resources['enteredBy'][currentLanguage]} </label>
                                                    <div className={'ui input inputDev '}>
                                                        <input name='enteredBy' className="form-control" id="enteredby" placeholder={Resources['enteredBy'][currentLanguage]} autoComplete='off'
                                                            defaultValue={this.state.phone.enteredby} onChange={e => this.handleChange('enteredBy', e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="linebylineInput valid-input ">
                                                    <label className="control-label">{Resources['reference'][currentLanguage]} </label>
                                                    <div className={'ui input inputDev '}>
                                                        <input name='refDoc' className="form-control" id="refDoc" placeholder={Resources['reference'][currentLanguage]} autoComplete='off'
                                                            defaultValue={this.state.phone.refDoc} onChange={e => this.handleChange('refDoc', e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="linebylineInput valid-input mix_dropdown">
                                                    <label className="control-label">{Resources['ContactName'][currentLanguage]}</label>
                                                    <div className="supervisor__company">
                                                        <div className="super_name">
                                                            <DropdownMelcous
                                                                name="fromCompany"
                                                                data={this.state.CompanyData}
                                                                handleChange={e => this.handleChange('fromCompany', e)}
                                                                placeholder='fromCompany'
                                                                selectedValue={this.state.selectedFromCompany} />
                                                        </div>
                                                        <div className="super_company">
                                                            <DropdownMelcous
                                                                name="fromContact"
                                                                data={this.state.fromContactNameData}
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
                                                    <label className="control-label">{Resources['ContactName'][currentLanguage]}</label>
                                                    <div className="supervisor__company">
                                                        <div className="super_name">
                                                            <DropdownMelcous
                                                                name='toCompany'
                                                                data={this.state.CompanyData}
                                                                handleChange={(e) => this.handleChange("toCompany", e)}
                                                                placeholder='toCompany'
                                                                selectedValue={this.state.selectedToCompany} />
                                                        </div>
                                                        <div className="super_company">
                                                            <DropdownMelcous
                                                                name='toContact'
                                                                data={this.state.toContactNameData}
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
                                                <div className="linebylineInput valid-input">
                                                    <label className="control-label">{Resources['descriptionCall'][currentLanguage]} </label>
                                                    <div className={'ui input inputDev '}>
                                                        <input name='details' className="form-control" placeholder={Resources['descriptionCall'][currentLanguage]} autoComplete='off'
                                                            defaultValue={this.state.phone.details}
                                                            onChange={e => this.handleChange('details', e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className={"linebylineInput valid-input "}  >
                                                    <label className="control-label">{Resources['callTime'][currentLanguage]} (Minutes)</label>
                                                    <div className={'inputDev ui input ' + (errors.callTime && touched.callTime ? 'has-error' : !errors.callTime && touched.callTime ? (" has-success") : " ")} >
                                                        <input name='callTime' className="form-control" id="callTime" placeholder={Resources['callTime'][currentLanguage]} autoComplete='off'
                                                            defaultValue={this.state.phone.callTime} onBlur={handleBlur}
                                                            onChange={e => { handleChange(e); this.handleChange('callTime', e.target.value) }} />
                                                        {touched.callTime ? (<em className="pError">{errors.callTime}</em>) : null}
                                                    </div>
                                                </div>
                                                <div className="linebylineInput valid-input">
                                                    <label className="control-label">{Resources['numberCall'][currentLanguage]} </label>
                                                    <div className={'ui input inputDev '}>
                                                        <input name='toPhone' className="form-control" id="toPhone" placeholder={Resources['numberCall'][currentLanguage]} autoComplete='off'
                                                            defaultValue={this.state.phone.toPhone} onChange={e => this.handleChange('toPhone', e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="slider-Btns fullWidthWrapper textLeft" style={{ margin: 0 }}>
                                                    {this.showBtnsSaving()}
                                                </div>
                                                {
                                                    this.props.changeStatus === true ?
                                                        <div className="approveDocument">
                                                            <div className="approveDocumentBTNS">
                                                                <button type="submit" className={this.state.isViewMode === true ? "primaryBtn-1 btn middle__btn disNone" : "primaryBtn-1 btn middle__btn"} >{Resources.save[currentLanguage]}</button>
                                                                {this.state.isApproveMode === true ?
                                                                    <div>
                                                                        <button type="button" className="primaryBtn-1 btn " onClick={(e) => this.handleShowAction(actions[2])} >{Resources.approvalModalApprove[currentLanguage]}</button>
                                                                        <button type="button" className="primaryBtn-2 btn middle__btn" onClick={(e) => this.handleShowAction(actions[3])} >{Resources.approvalModalReject[currentLanguage]}</button>
                                                                    </div>
                                                                    : null
                                                                }
                                                                <button type="button" className="primaryBtn-2 btn middle__btn" onClick={(e) => this.handleShowAction(actions[1])}>{Resources.sendToWorkFlow[currentLanguage]}</button>
                                                                <button type="button" className="primaryBtn-2 btn" onClick={(e) => this.handleShowAction(actions[0])}>{Resources.distributionList[currentLanguage]}</button>
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
                                <div className="doc-pre-cycle">
                                    <div>
                                        {this.state.docId > 0 && this.state.isViewMode === false ? (<UploadAttachment changeStatus={this.props.changeStatus} AddAttachments={833} EditAttachments={3226} ShowDropBox={3613} ShowGoogleDrive={3614} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />) : null}
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
                <div className="largePopup largeModal " style={{ display: this.state.showModal ? 'block' : 'none' }}>
                    <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref} title={Resources[this.state.currentTitle][currentLanguage]}>
                        {this.state.currentComponent}
                    </SkyLight>
                </div>
            </div>

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
        showModal: state.communication.showModal
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(phoneAddEdit))