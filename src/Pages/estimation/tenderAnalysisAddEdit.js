import React, { Component, Fragment } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import dataservice from "../../Dataservice";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import UploadAttachment from "../../Componants/OptionsPanels/UploadAttachment";
import TextEditor from "../../Componants/OptionsPanels/TextEditor";
import ViewAttachment from "../../Componants/OptionsPanels/ViewAttachmments";
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import Resources from "../../resources.json";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as communicationActions from "../../store/actions/communication";
import Config from "../../Services/Config.js";
import CryptoJS from "crypto-js";
import moment from "moment";
import DatePicker from "../../Componants/OptionsPanels/DatePicker";
import { toast } from "react-toastify";
import HeaderDocument from "../../Componants/OptionsPanels/HeaderDocument";
import CompanyDropdown from '../../Componants/publicComponants/CompanyDropdown';
import ContactDropdown from '../../Componants/publicComponants/ContactDropdown';
import DocumentActions from '../../Componants/OptionsPanels/DocumentActions';
import find from "lodash/find";
import Api from "../../api";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const validationSchema = Yup.object().shape({
    subject: Yup.string().required(Resources["subjectRequired"][currentLanguage]),
    fromContactId: Yup.string().required(Resources["fromContactRequired"][currentLanguage]).nullable(true),
    toContactId: Yup.string().required(Resources["toContactRequired"][currentLanguage]).nullable(true)
});

let docId = 0;
let projectId = 0;
let projectName = "";
let isApproveMode = false;
let docApprovalId = 0;
let perviousRoute = "";
let arrange = 0;
let prevLetterId = 0;

let toCompanyId = 0;
let fromCompanyId = 0;
let toContactId = 0;
let fromContactId = 0;
let replyFromCompId = 0;
let replyFromContId = 0;
let replyToCompId = 0;
let replyToContId = 0;

class tenderAnalysisAddEdit extends Component {

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
                    //prevLetterId = obj.prevLetterId;
                    fromCompanyId = obj.replyToCompId;
                    fromContactId = obj.replyToContactId;
                    toCompanyId = obj.replyFromCompId;
                    toContactId = obj.replyFromContId;
                } catch {
                    this.props.history.goBack();
                }
            }
            index++;
        }

        this.state = {
            tCompanyId: toCompanyId,
            frmCompanyId: fromCompanyId,
            tContactId: toContactId,
            frmContactId: fromContactId,
            isViewMode: false,
            isApproveMode: isApproveMode,
            perviousRoute: perviousRoute,
            isView: false,
            docId: docId,
            docTypeId: 83,
            projectId: projectId,
            docApprovalId: docApprovalId,
            arrange: arrange,
            document: { id: 0 },
            companies: [],
            ToContacts: [],
            fromContacts: [],
            discplines: [],
            letters: [],
            description: '',
            permission: [
                { name: "sendByEmail", code: 575 },
                { name: "sendByInbox", code: 574 },
                { name: "distributionList", code: 3015 },
                { name: "createTransmittal", code: 3101 },
                { name: "sendToWorkFlow", code: 761 },

                // { name: "sendTask", code: 1 }, { name: "viewAttachments", code: 3317 },
                // { name: "deleteAttachments", code: 840 }
            ],
            selectedFromCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
            selectedToCompany: { label: Resources.toCompanyRequired[currentLanguage], value: "0" },
            selectedFromContact: { label: Resources.fromContactRequired[currentLanguage], value: "0" },
            selectedToContact: { label: Resources.toContactRequired[currentLanguage], value: "0" },
            selectedDiscpline: { label: Resources.disciplineRequired[currentLanguage], value: "0" },
            message: "",
            selectedWorkFlow: { label: "select WorkFlow", value: 0 },
            selectedApproveId: { label: "select To Contact", value: 0 },
            submitLoading: false,
            WorkFlowData: [],
            WorkFlowContactData: []
        };

        if (!Config.IsAllow(569) && !Config.IsAllow(570) && !Config.IsAllow(572)) {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push(this.state.perviousRoute);
        }
    }

    workFlowhandelChangeTender = (item) => {

        let original_document = { ...this.state.document };
        let updated_document = {};
        updated_document.workFlowId = item.value;
        updated_document = Object.assign(original_document, updated_document);

        let url = "GetProjectWorkFlowContactsFirstLevelForList?workFlow=" + item.value;
        dataservice.GetDataList(url, "contactName", "id").then(result => {
            this.setState({
                document: updated_document,
                WorkFlowContactData: [...result],
                selectedWorkFlow: item
            });
        });

    }

    toAccounthandelChangeTender = (item) => {
        let original_document = { ...this.state.document };
        let updated_document = {};
        updated_document.toAccountId = item.value;
        updated_document = Object.assign(original_document, updated_document);
        this.setState({ document: updated_document, selectedApproveId: item });
    }

    componentDidMount() {
        if (this.state.docId > 0) {
            let url = "GetTenderAnalysisForEdit?id=" + this.state.docId;
            this.props.actions.documentForEdit(url, this.state.docTypeId, "tenderAnalysis");
        } else {
            let tender = {
                subject: "",
                id: 0,
                projectId: this.props.projectId,
                arrange: this.state.arrange,
                fromCompanyId: "",
                fromContactId: "",
                toCompanyId: "",
                toContactId: "",
                docDate: moment().format("YYYY-MM-DD"),
                status: "true",
                disciplineId: "",
                decisionId: '',
                refDoc: "",
                sharedSettings: '',
                message: "",
                workFlowId: "",
                toAccountId: ""
            };

            this.setState({ document: tender });
            this.fillDropDowns(false);
            this.props.actions.documentForAdding();

            this.getNextArrangeInAdd()

        }
        //        this.checkDocumentIsView(); 
    }

    getNextArrangeInAdd = () => {
        Api.get(`GetNextArrangeMainDoc?projectId=${this.state.projectId}&docType=${this.state.docTypeId}&companyId=undefined=&contactId=undefined`).then(res => {
            this.setState({ arrange: res, isLoading: false });
        });
    }

    static getDerivedStateFromProps(nextProps, state) {
        if (nextProps.document.id !== state.document.id && nextProps.changeStatus === true) {

            return {
                document: nextProps.document,
                hasWorkflow: nextProps.hasWorkflow,
                description: nextProps.document.description,
                arrange: nextProps.document.arrange,
            };
        }
        return null
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.document.id !== this.props.document.id && this.props.changeStatus === true) {
            //         // und 976 --1
            //         //976 976 fire modal
            //         //976 976 close modal
            //         //alert('recieve....'); 
            //         //alert('recieve....' + this.state.showModal + '.....' + nextProps.showModal);

            this.fillDropDowns(this.props.document.id > 0 ? true : false);
            this.checkDocumentIsView();
        }

        if (this.props.hasWorkflow !== prevProps.hasWorkflow || this.props.changeStatus !== prevProps.changeStatus) {
            this.checkDocumentIsView();
        }
    }

    componentWillUnmount() {
        this.props.actions.clearCashDocument();
        this.setState({ docId: 0 });
    }

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!Config.IsAllow(570)) this.setState({ isViewMode: true });
            if (this.state.isApproveMode != true && Config.IsAllow(570)) {
                if (this.props.hasWorkflow == false && Config.IsAllow(570)) {
                    if (this.props.document.status !== false && Config.IsAllow(570)) this.setState({ isViewMode: false });
                    else this.setState({ isViewMode: true });
                } else this.setState({ isViewMode: true });
            }
        } else this.setState({ isViewMode: false });
    }

    fillSubDropDownInEdit(url, param, value, subField, subSelectedValue, subDatasource, toProps) {
        let action = url + "?" + param + "=" + value;

        dataservice.GetDataList(action, "contactName", "id").then(result => {
            if (this.props.changeStatus === true) {
                let toSubField = this.state.document[subField];
                let targetFieldSelected = result.filter(function (i) { return i.value == toSubField; });
                this.setState({ [subSelectedValue]: targetFieldSelected, [subDatasource]: result });
            } else {
                if (prevLetterId) {
                    let state = { ...this.state };
                    console.log(state[toProps], toProps, result);
                    let toSubField = state[toProps];
                    let targetFieldSelected = find(result, function (item) { return item.value == state[toProps]; });

                    console.log(state[toProps], toProps, targetFieldSelected);
                    let original_document = { ...this.state.document };
                    let updated_document = {};
                    updated_document[subField] = state[toProps];
                    updated_document = Object.assign(original_document, updated_document);

                    this.setState({
                        document: updated_document,
                        [subSelectedValue]: targetFieldSelected,
                        [subDatasource]: result
                    });
                }
            }
        });
    }

    fillDropDowns(isEdit, cb) {
        if (!isEdit) {
            dataservice.GetDataList("ProjectWorkFlowGetList?projectId=" + this.state.projectId, "subject", "id").then(result => {
                this.setState({ WorkFlowData: [...result] });
            });
        }

        dataservice.GetDataListCached("GetProjectProjectsCompaniesForList?projectId=" + this.state.projectId, "companyName", "companyId", 'companies', this.state.projectId, "projectId").then(result => {
            if (isEdit) {

                let companyId = this.props.document.fromCompanyId;
                let fromCompanyName = find(result, function (item) { return item.value == companyId });
                console.log('fromCompanyName', fromCompanyName)
                if (companyId) {
                    this.setState({ selectedFromCompany: { label: fromCompanyName.label, value: companyId } });
                    this.fillSubDropDownInEdit("GetContactsByCompanyId", "companyId", companyId, "fromContactId", "selectedFromContact", "fromContacts");
                }

                let toCompanyId = this.props.document.toCompanyId;
                let toCompanyName = find(result, function (item) { return item.value == toCompanyId });
                console.log('toCompanyName', toCompanyName)
                if (toCompanyId) {
                    this.setState({ selectedToCompany: { label: toCompanyName.label, value: toCompanyId } });
                    this.fillSubDropDownInEdit("GetContactsByCompanyId", "companyId", toCompanyId, "toContactId", "selectedToContact", "ToContacts");
                }
            } else {
                if (fromCompanyId && toCompanyId) {
                    let fromCompany = find(result, function (item) { return item.value == fromCompanyId });
                    let toCompany = find(result, function (item) { return item.value == toCompanyId });

                    this.fillSubDropDownInEdit("GetContactsByCompanyId", "companyId", fromCompanyId, "fromContactId", "selectedFromContact", "fromContacts", "frmContactId");

                    this.fillSubDropDownInEdit("GetContactsByCompanyId", "companyId", toCompanyId, "toContactId", "selectedToContact", "ToContacts", "tContactId");

                    this.setState({
                        selectedFromCompany: { label: fromCompany.label, value: fromCompanyId },
                        selectedToCompany: { label: toCompany.label, value: toCompanyId }
                    }, () => { cb(); });
                }
            }

            this.setState({ companies: [...result] });
        });

        dataservice.GetDataListCached("GetAccountsDefaultList?listType=discipline&pageNumber=0&pageSize=10000", "title", "id", 'defaultLists', "discipline", "listType").then(result => {
            if (isEdit) {
                let decisionId = this.props.document.decisionId;
                let discpline = {};
                if (decisionId) {
                    discpline = result.filter(function (i) { return i.value == decisionId; });
                    this.setState({ selectedDiscpline: discpline });
                }
            }
            this.setState({ discplines: [...result] });
        });
    }

    onChangeMessage = value => {
        if (value != null) {
            this.setState({ description: value });
            let original_document = { ...this.state.document };
            let updated_document = {};
            updated_document.description = value;
            updated_document = Object.assign(original_document, updated_document);
            this.setState({ document: updated_document });
        }
    };

    handleChange(e, field) {
        let original_document = { ...this.state.document };
        let updated_document = {};
        updated_document[field] = e.target.value;
        updated_document = Object.assign(original_document, updated_document);
        this.setState({ document: updated_document });
    }

    handleChangeDate(e, field) {
        let original_document = { ...this.state.document };
        let updated_document = {};
        updated_document[field] = e;
        updated_document = Object.assign(original_document, updated_document);
        this.setState({ document: updated_document });
    }

    handleChangeDropDown(event, field, isSubscrib, targetState, url, param, selectedValue, subDatasource) {
        if (event == null) return;
        let original_document = { ...this.state.document };
        let updated_document = {};
        updated_document[field] = event.value;
        updated_document = Object.assign(original_document, updated_document);

        this.setState({ document: updated_document, [selectedValue]: event });

        if (field == "toContactId") {
            let url = "GetRefCodeArrangeMainDoc?projectId=" + this.state.projectId + "&docType=" + this.state.docTypeId + "&fromCompanyId=" + this.state.document.fromCompanyId + "&fromContactId=" + this.state.document.fromContactId + "&toCompanyId=" + this.state.document.toCompanyId + "&toContactId=" + event.value;

            dataservice.GetRefCodeArrangeMainDoc(url).then(res => {
                updated_document.arrange = res.arrange;

                if (Config.getPublicConfiguartion().refAutomatic === true) updated_document.refDoc = res.refCode;

                updated_document = Object.assign(original_document, updated_document);

                this.setState({ document: updated_document });
            });
        }
        if (isSubscrib) {
            let action = url + "?" + param + "=" + event.value;
            dataservice.GetDataList(action, "contactName", "id").then(result => {
                this.setState({ [targetState]: result });
            });
        }
    }

    editTender(event) {
        this.setState({ isLoading: true });

        dataservice.addObject("EditTenderAnalysis", this.state.document).then(result => {
            this.setState({ isLoading: false });
            toast.success(Resources["operationSuccess"][currentLanguage]);
            if (this.state.isApproveMode === false) this.props.history.push(this.state.perviousRoute);
        });
    }

    saveTender(event) {
        this.setState({ isLoading: true });
        let saveDocument = { ...this.state.document };
        saveDocument.projectId = this.props.projectId
        saveDocument.arrange = this.state.arrange
        saveDocument.docDate = moment(saveDocument.docDate).format("MM/DD/YYYY");

        dataservice.addObject("AddTenderAnalysis", saveDocument).then(result => {
            this.setState({ docId: result, isLoading: false });
            toast.success(Resources["operationSuccess"][currentLanguage]);
        });
        this.props.history.push(this.state.perviousRoute);
    }

    saveAndExit(event) {
        this.props.history.push(this.state.perviousRoute);
    }

    showBtnsSaving() {
        let btn = null;

        if (this.state.docId === 0) {
            btn = <button className="primaryBtn-1 btn meduimBtn" type="submit" >{this.state.docId > 0 && this.props.changeStatus === false ? Resources.saveAndExit[currentLanguage] : Resources.save[currentLanguage]}</button>;
        } else if (this.state.docId > 0 && this.props.changeStatus === false) {
            btn = <button className="primaryBtn-1 btn mediumBtn" type="submit" >{Resources.saveAndExit[currentLanguage]}</button>
        }
        return btn;
    }

    viewAttachments() {
        return this.state.docId > 0 ? (
            Config.IsAllow(3317) === true ? (
                <ViewAttachment isApproveMode={this.state.isViewMode}
                    docTypeId={this.state.docTypeId}
                    docId={this.state.docId}
                    projectId={this.state.projectId}
                    deleteAttachments={840}
                />
            ) : null
        ) : null;
    }

    showOptionPanel = () => {
        this.props.actions.showOptionPanel(true);
    }

    render() {
        return (
            <div className="mainContainer" id={"mainContainer"}>
                <div
                    className={
                        this.state.isViewMode === true
                            ? "documents-stepper noTabs__document readOnly_inputs"
                            : "documents-stepper noTabs__document"
                    }>
                    <HeaderDocument
                        projectName={projectName}
                        isViewMode={this.state.isViewMode}
                        perviousRoute={this.state.perviousRoute}
                        docTitle={Resources.tenderAnalysis[currentLanguage]}
                        moduleTitle={Resources["communication"][currentLanguage]}
                    />
                    <div className="doc-container">
                        <div className="step-content">
                            <div id="step1" className="step-content-body">
                                <div className="subiTabsContent">
                                    <div className="document-fields">
                                        <Formik initialValues={{ ...this.state.document }}
                                            validationSchema={validationSchema}
                                            enableReinitialize={true}
                                            onSubmit={values => {
                                                if (this.props.showModal) return;
                                                if (this.props.changeStatus === true && this.state.docId > 0) this.editTender();
                                                else if (this.props.changeStatus === false && this.state.docId === 0) this.saveTender();
                                                else this.saveAndExit();
                                            }}>
                                            {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                                                <Form id="tenderForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>
                                                    <div className="proForm first-proform">
                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">
                                                                {Resources.subject[currentLanguage]}
                                                            </label>
                                                            <div className={"inputDev ui input" + (errors.subject ? (" has-error") : !errors.subject && touched.subject ? (" has-success") : " ")} >
                                                                <input name="subject" id="subject" className="form-control fsadfsadsa" autoComplete="off"
                                                                    placeholder={Resources.subject[currentLanguage]} value={this.state.document.subject}
                                                                    onBlur={e => { handleBlur(e); handleChange(e); }} onChange={e => this.handleChange(e, "subject")} />
                                                                {touched.subject ? (<em className="pError">{errors.subject}</em>) : null}
                                                            </div>
                                                        </div>

                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.status[currentLanguage]}</label>
                                                            <div className="ui checkbox radio radioBoxBlue">
                                                                <input type="radio" name="tender-status" onChange={e => this.handleChange(e, "status")}
                                                                    defaultChecked={this.state.document.status === false ? null : "checked"} value="true" />
                                                                <label>{Resources.oppened[currentLanguage]}</label>
                                                            </div>
                                                            <div className="ui checkbox radio radioBoxBlue">
                                                                <input type="radio" name="tender-status" onChange={e => this.handleChange(e, "status")}
                                                                    defaultChecked={this.state.document.status === false ? "checked" : null} value="false" />
                                                                <label> {Resources.closed[currentLanguage]} </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="proForm datepickerContainer">
                                                        <div className="linebylineInput valid-input alternativeDate">
                                                            <DatePicker title="docDate"
                                                                startDate={this.state.document.docDate}
                                                                handleChange={e => this.handleChangeDate(e, "docDate")} />
                                                        </div>
                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.arrange[currentLanguage]}</label>
                                                            <div className="ui input inputDev">
                                                                <input type="text" className="form-control" id="arrange"
                                                                    readOnly value={this.state.arrange} name="arrange"
                                                                    placeholder={Resources.arrange[currentLanguage]}
                                                                    onBlur={e => { handleChange(e); handleBlur(e); }}
                                                                    onChange={e => this.handleChange(e, "arrange")}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="linebylineInput fullInputWidth">
                                                            <label className="control-label">{Resources.refDoc[currentLanguage]}</label>
                                                            <div className="ui input inputDev">
                                                                <input type="text" className="form-control" id="refDoc" value={this.state.document.refDoc}
                                                                    name="refDoc" placeholder={Resources.refDoc[currentLanguage]} onChange={e => this.handleChange(e, "refDoc")} />
                                                            </div>
                                                        </div>
                                                        <div className="linebylineInput fullInputWidth">
                                                            <label className="control-label">{Resources.sharedSettings[currentLanguage]}</label>
                                                            <div className="shareLinks">
                                                                <div className={"inputDev ui input" + (errors.location ? (" has-error") : !errors.location && touched.location ? (" has-success") : " ")} >
                                                                    <input type="text" className="form-control" id="location" name="location"
                                                                        onChange={e => this.handleChange(e, "location")} value={this.state.document.location}
                                                                        placeholder={Resources.location[currentLanguage]}
                                                                    />
                                                                    {errors.location ? (<em className="pError">{errors.location}</em>) : null}
                                                                </div>
                                                                {this.state.document.sharedSettings === '' ||
                                                                    this.state.document.sharedSettings === null ||
                                                                    this.state.document.sharedSettings === undefined ?
                                                                    null
                                                                    : <a target="_blank" href={this.state.document.sharedSettings}>
                                                                        <span> {Resources.openFolder[currentLanguage]}  </span>
                                                                    </a>}
                                                            </div>
                                                        </div>
                                                        <div className="linebylineInput valid-input mix_dropdown">
                                                            <label className="control-label">  {Resources.fromCompany[currentLanguage]} </label>
                                                            <div className="supervisor__company">
                                                                <div className="super_name">
                                                                    <Dropdown data={this.state.companies} isMulti={false}
                                                                        selectedValue={this.state.selectedFromCompany}
                                                                        handleChange={event => {
                                                                            this.handleChangeDropDown(event, "fromCompanyId", true, "fromContacts", "GetContactsByCompanyId", "companyId", "selectedFromCompany", "selectedFromContact");
                                                                        }}
                                                                        onChange={setFieldValue} onBlur={setFieldTouched}
                                                                        error={errors.fromCompanyId} touched={touched.fromCompanyId}
                                                                        index="fromCompanyId" name="fromCompanyId" id="fromCompanyId"
                                                                        styles={CompanyDropdown} classDrop="companyName1"
                                                                    />
                                                                </div>
                                                                <div className="super_company">
                                                                    <Dropdown isMulti={false}
                                                                        data={this.state.fromContacts}
                                                                        selectedValue={this.state.selectedFromContact}
                                                                        handleChange={event =>
                                                                            this.handleChangeDropDown(event, "fromContactId", false, "", "", "", "selectedFromContact")}
                                                                        onChange={setFieldValue} onBlur={setFieldTouched} error={errors.fromContactId}
                                                                        touched={true} isClear={false} classDrop="contactName1" styles={ContactDropdown}
                                                                        index="tender-fromContactId" name="fromContactId" id="fromContactId"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="linebylineInput valid-input mix_dropdown">
                                                            <label className="control-label">{Resources.toCompany[currentLanguage]}</label>
                                                            <div className="supervisor__company">
                                                                <div className="super_name">
                                                                    <Dropdown isMulti={false}
                                                                        data={this.state.companies}
                                                                        selectedValue={this.state.selectedToCompany}
                                                                        handleChange={event => this.handleChangeDropDown(event, "toCompanyId", true, "ToContacts", "GetContactsByCompanyId", "companyId", "selectedToCompany", "selectedToContact")}
                                                                        onChange={setFieldValue} onBlur={setFieldTouched}
                                                                        error={errors.toCompanyId} touched={touched.toCompanyId}
                                                                        index="tender-toCompany" name="toCompanyId" id="toCompanyId"
                                                                        styles={CompanyDropdown} classDrop="companyName1"
                                                                    />
                                                                </div>
                                                                <div className="super_company">
                                                                    <Dropdown isMulti={false}
                                                                        data={this.state.ToContacts}
                                                                        selectedValue={this.state.selectedToContact}
                                                                        handleChange={event =>
                                                                            this.handleChangeDropDown(event, "toContactId", false, "", "", "", "selectedToContact")}
                                                                        onChange={setFieldValue} onBlur={setFieldTouched}
                                                                        error={errors.toContactId} touched={true}
                                                                        index="tender-toContactId" name="toContactId" id="toContactId"
                                                                        classDrop="contactName1" styles={ContactDropdown} />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="linebylineInput valid-input">
                                                            <Dropdown title="discipline"
                                                                data={this.state.discplines} selectedValue={this.state.selectedDiscpline}
                                                                handleChange={event => this.handleChangeDropDown(event, "decisionId", false, "", "", "", "selectedDiscpline")}
                                                                index="tender-discipline" />
                                                        </div>

                                                        <div className="letterFullWidth">
                                                            <label className="control-label"> {Resources.message[currentLanguage]} </label>
                                                            <div className="inputDev ui input">
                                                                <TextEditor value={this.state.description} onChange={this.onChangeMessage} />
                                                            </div>
                                                        </div>

                                                        {this.props.changeStatus === false ?
                                                            <Fragment>
                                                                <div className="linebylineInput valid-input">
                                                                    <Dropdown title="workFlow"
                                                                        data={this.state.WorkFlowData}
                                                                        handleChange={this.workFlowhandelChangeTender}
                                                                        selectedValue={this.state.selectedWorkFlow}
                                                                        index='ddlworkFlowId' />
                                                                </div>
                                                                <div className="linebylineInput valid-input">
                                                                    <Dropdown title="contact"
                                                                        data={this.state.WorkFlowContactData}
                                                                        name="ddlApproveTo"
                                                                        selectedValue={this.state.selectedApproveId}
                                                                        index='ddlApproveTo'
                                                                        handleChange={this.toAccounthandelChangeTender}
                                                                        className={this.state.toCompanyClass} />
                                                                </div>
                                                            </Fragment>
                                                            : null
                                                        }
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
                                                            this.showBtnsSaving()
                                                        }
                                                    </div>


                                                    {this.props.changeStatus === true ? (
                                                        <div className="approveDocument">
                                                            <div className="approveDocumentBTNS">
                                                                {this.state.isLoading ? (
                                                                    <button className="primaryBtn-1 btn disabled">
                                                                        <div className="spinner">
                                                                            <div className="bounce1" />
                                                                            <div className="bounce2" />
                                                                            <div className="bounce3" />
                                                                        </div>
                                                                    </button>
                                                                ) : (
                                                                        <button className={"primaryBtn-1 btn middle__btn" + (this.state.isViewMode === true ? " disNone" : "")}>
                                                                            {Resources.save[currentLanguage]}
                                                                        </button>
                                                                    )}
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
                                                                    documentName="tenderAnalysis"
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : null}
                                                </Form>
                                            )}
                                        </Formik>
                                    </div>
                                    <div className="doc-pre-cycle letterFullWidth">
                                        <div>
                                            {this.state.docId > 0 && this.state.isViewMode === false ? (<UploadAttachment changeStatus={this.props.changeStatus} AddAttachments={839} EditAttachments={3223} ShowDropBox={3607} ShowGoogleDrive={3608} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />) : null}
                                            {this.viewAttachments()}
                                            {this.props.changeStatus === true ? (<ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />) : null}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
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
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(tenderAnalysisAddEdit));
