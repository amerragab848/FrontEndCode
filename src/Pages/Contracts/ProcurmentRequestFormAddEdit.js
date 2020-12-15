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
});

let docId = 0;
let projectId = 0;
let projectName = "";
let isApproveMode = false;
let docApprovalId = 0;
let docAlertId = 0;
let perviousRoute = "";
let arrange = 0;

class ProcurmentRequestFormAddEdit extends Component {
    constructor(props) {
        super(props);
        
        const query = new URLSearchParams(this.props.location.search);
 
        let obj = Config.extractDataFromParamas(query);
        if (Object.entries(obj).length === 0) {
            this.props.history.goBack();
        } else {
            docId = obj.docId;
            projectId = obj.projectId;
            projectName = obj.projectName;
            isApproveMode = obj.isApproveMode;
            docApprovalId = obj.docApprovalId;
            docAlertId = obj.docAlertId;
            arrange = obj.arrange;
            perviousRoute = obj.perviousRoute;
        }
        this.state = {

            frmCompanyId: 0,
            frmContactId: 0,
            isViewMode: false,
            isApproveMode: isApproveMode,
            perviousRoute: perviousRoute,
            isView: false,
            docId: docId,
            docTypeId: 123,
            projectId: projectId,
            docApprovalId: docApprovalId,
            docAlertId: docAlertId,
            arrange: arrange,
            docAlertId: 0,
            document: { id: 0 },
            companies: [],
            fromContacts: [],
            budgetContacts:[],
            contracts:[],
            departments:[],
            discplines: [],
            permission: [
                { name: "sendByEmail", code: 10125 },
                { name: "sendByInbox", code: 10124 },
                { name: "sendTask", code: 1 },
                { name: "distributionList", code: 10133 },
                { name: "createTransmittal", code: 10134 },
                { name: "sendToWorkFlow", code: 10128 },
                { name: "viewAttachments", code: 10131 },
                { name: "deleteAttachments", code: 10132 },
                { name: "previousVersions", code: 8080800 }
            ],
            selectedBidderCompany: {
                label: Resources.BidderCompanyRequired[currentLanguage],
                value: "0"
            },
            selectedBudgetCompany: {
                label: Resources.BudgetCompanyRequired[currentLanguage],
                value: "0"
            },
            selectedBudgetContact: {
                label: Resources.BudgetContactRequired[currentLanguage],
                value: "0"
            },
            selectedContract: {
                label: Resources.contractRequired[currentLanguage],
                value: "0"
            },
            selectedDepartment: {
                label: Resources.departmentRequired[currentLanguage],
                value: "0"
            },
            selectedVendorCompany: {
                label: Resources.vendorCompanyRequired[currentLanguage],
                value: "0"
            },
            selectedFromCompany: {
                label: Resources.fromCompanyRequired[currentLanguage],
                value: "0"
            },
            selectedFromContact: {
                label: Resources.fromContactRequired[currentLanguage],
                value: "0"
            },
            selectedWorkFlow: { label: "select WorkFlow", value: 0 },
            selectedApproveId: { label: "select To Contact", value: 0 },
            submitLoading: false,
            WorkFlowData: [],
            WorkFlowContactData: []
        };
        if (!Config.IsAllow(10119) && !Config.IsAllow(10120) && !Config.IsAllow(10122)) {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push(this.state.perviousRoute);
        }
    }
    workFlowhandelChangeLetter = (item) => {

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
    toAccounthandelChangeLetter = (item) => {
        let original_document = { ...this.state.document };
        let updated_document = {};
        updated_document.toAccountId = item.value;
        updated_document = Object.assign(original_document, updated_document);
        this.setState({
            document: updated_document,
            selectedApproveId: item
        });
    }
    componentDidMount() {

        var links = document.querySelectorAll(".noTabs__document .doc-container .linebylineInput");

        for (var i = 0; i < links.length; i++) {
            if ((i + 1) % 2 == 0) {
                links[i].classList.add("even");
            } else {
                links[i].classList.add("odd");
            }
        }
        if (this.state.docId > 0) {
            let url = "GetContractRocurmentRequestFormById?id=" + this.state.docId;
            this.props.actions.documentForEdit(url, this.state.docTypeId, "contractProcurmentRequestForm");
        } else {
            let ProcurmentRequestFormObj = {
                id: 0,
                subject: "",
                description:"",
                docDate: moment().format("YYYY-MM-DD"),
                arrange: "",
                BidderCompanyId:"",
                budgetComments:"",
                budgetCompanyId:"",
                budgetContactId:"",
                budgetDate:moment().format("YYYY-MM-DD"),
                contractId:"",
                criticalFactor:"",
                departmentId:"",
                fromCompanyId: "",
                fromContactId:  "",
                projectId: this.props.projectId,
                justification:"",
                progressToDate:"",
                refNo:"",
                specialInstruction:"",
                vendorCompanyId:"",
                workFlowId: "",
                toAccountId: ""
            };

            this.setState({
                document: ProcurmentRequestFormObj
            });

            this.fillDropDowns(false);

            this.props.actions.documentForAdding();
        }

        this.checkDocumentIsView();

       
    }
    fillDropDowns(isEdit) {
        if (!isEdit) {
            dataservice.GetDataList("ProjectWorkFlowGetList?projectId=" + this.state.projectId, "subject", "id").then(result => {
                this.setState({
                    WorkFlowData: [...result]
                });
            });
        }
        dataservice.GetDataListCached("GetProjectProjectsCompaniesForList?projectId=" + this.state.projectId, "companyName", "companyId", 'companies', this.state.projectId, "projectId").then(result => {
             //contractList
             dataservice.GetDataList(
                "GetContractForDropDown?projectId=" +this.state.projectId, "subject", "id"
            ).then(result => {
            this.setState({
                contracts: [...result]
            });
          });
           //departments
        dataservice.GetDataListCached("GetaccountsDefaultListForList?listType=departments", "title", "id", 'defaultLists', "approvalstatus", "listType").then(result => {
        this.setState({
          departments: [...result]
           });
         });
            if (isEdit) {
                let companyId = this.props.document.fromCompanyId;
                if (companyId) {
                    this.setState({
                        selectedFromCompany: {
                            label: this.props.document.fromCompanyName,
                            value: companyId
                        }
                    });
                    this.fillSubDropDownInEdit("GetContactsByCompanyId", "companyId", companyId, "fromContactId", "selectedFromContact", "fromContacts");
                }
                let vendorCompanyId = this.props.document.vendorCompanyId;
                if (vendorCompanyId) {
                    this.setState({
                        selectedVendorCompany: {
                            label: this.props.document.vendorCompanyName,
                            value: vendorCompanyId
                        }
                    });
                }
               let departmentId= this.props.document.departmentId
               if(departmentId){
                this.setState({
                    selectedDepartment: {
                        label: this.props.document.departmentName,
                        value: departmentId
                    }
                });
                }
                let budgetCompanyId=this.props.document.budgetCompanyId
                if(budgetCompanyId){
                    this.setState({
                        selectedBudgetCompany:{
                            label:this.props.document.budgetCompanyName,
                            value:budgetCompanyId
                        }
                    })
                    this.fillSubDropDownInEdit("GetContactsByCompanyId", "companyId", budgetCompanyId, "budgetContactId", "selectedBudgetContact", "budgetContacts");
                }
                let BidderCompanyId= this.props.document.bidderCompanyId
                if(BidderCompanyId){
                    this.setState({
                        selectedBidderCompany: {
                            label: this.props.document.bidderCompanyName,
                            value: BidderCompanyId
                        }
                    });
                }
                let contractId= this.props.document.contractId
                if(contractId){
                    this.setState({
                        selectedContract:{
                            label:this.props.document.contractSubject,
                            value:contractId
                        }
                    })
                }
                
            }
            this.setState({
                companies: [...result]
            });
        });
       
    }
    fillSubDropDownInEdit(url, param, value, subField, subSelectedValue, subDatasource, toProps) {
        let action = url + "?" + param + "=" + value;
        dataservice.GetDataList(action, "contactName", "id").then(result => {
            if (this.props.changeStatus === true) {
                let toSubField = this.state.document[subField];
                let targetFieldSelected = result.filter(function (i) {
                    return i.value == toSubField;
                });
                this.setState({
                    [subSelectedValue]: targetFieldSelected,
                    [subDatasource]: result
                });
            
            }
        });
    }
    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!Config.IsAllow(10120)) {
                this.setState({ isViewMode: true });
            }
            if (Config.getUserTypeIsAdmin() === true) {
                this.setState({ isViewMode: false });
            } else {
                if (this.state.isApproveMode != true && Config.IsAllow(10120)) {
                    if (this.props.hasWorkflow == false && Config.IsAllow(10120)) {
                        if (
                            this.props.document.status !== false &&
                            Config.IsAllow(10120)
                        ) {
                            this.setState({ isViewMode: false });
                        } else {
                            this.setState({ isViewMode: true });
                        }
                    } else {
                        this.setState({ isViewMode: true });
                    }
                }
            }
        } else {
            this.setState({ isViewMode: false });
        }
    }

    static getDerivedStateFromProps(nextProps, state) {
        if (nextProps.document.id !== state.document.id && nextProps.changeStatus === true) {

            return {
                document: nextProps.document,
                hasWorkflow: nextProps.hasWorkflow,
                message: nextProps.document.message
            };
        }
        return null
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.document.id !== this.props.document.id && this.props.changeStatus === true) {
            this.fillDropDowns(this.props.document.id > 0 ? true : false);
            this.checkDocumentIsView();
        }

        if (this.props.hasWorkflow !== prevProps.hasWorkflow || this.props.changeStatus !== prevProps.changeStatus) {
            this.checkDocumentIsView();
        }
    }
    componentWillUnmount() {
        this.props.actions.clearCashDocument();
        this.setState({
            docId: 0
        });
    }
    handleChange(e, field) {
        let original_document = { ...this.state.document };

        let updated_document = {};

        updated_document[field] = e.target.value;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            document: updated_document
        });
    }
    handleChangeDate(e, field) {
        let original_document = { ...this.state.document };

        let updated_document = {};

        updated_document[field] = e;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            document: updated_document
        });
    }
    handleChangeDropDown(event, field, isSubscrib, targetState, url, param, selectedValue, subDatasource) {
        if (event == null) return;
        let original_document = { ...this.state.document };
        let updated_document = {};
        updated_document[field] = event.value;
        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            document: updated_document,
            [selectedValue]: event
        });

        
        if (isSubscrib) {
            let action = url + "?" + param + "=" + event.value;
            dataservice.GetDataList(action, "contactName", "id").then(result => {
                this.setState({
                    [targetState]: result
                });
            });
        }
    }
    showBtnsSaving() {
        let btn = null;
        if (this.state.docId === 0) {
            btn = <button className="primaryBtn-1 btn meduimBtn" type="submit" >{ Resources.save[currentLanguage]}</button>;
        }
        return btn;
    }
    viewAttachments() {
        return this.state.docId > 0 ? (
            Config.IsAllow(10131) === true ? (
                <ViewAttachment isApproveMode={this.state.isViewMode}
                    docTypeId={this.state.docTypeId}
                    docId={this.state.docId}
                    projectId={this.state.projectId}
                    deleteAttachments={10132}
                />
            ) : null
        ) : null;
    }
    editContractProcurmentRequest()
    {
        this.setState({
            isLoading: true
        });

        let saveDocument = { ...this.state.document };
        saveDocument.projectId = projectId

        saveDocument.docDate = moment(saveDocument.docDate).format("MM/DD/YYYY");
        saveDocument.budgetDate=moment(saveDocument.budgetDate).format("MM/DD/YYYY");
        dataservice.addObject("EditContractProcurementRequestForm", saveDocument).then(result => {
            this.setState({
                docId: result,
                isLoading: false
            });
            toast.success(Resources["operationSuccess"][currentLanguage]);
            this.props.history.push(this.state.perviousRoute);

        });
    }
    saveContractProcurmentRequest() {

        this.setState({
            isLoading: true
        });

        let saveDocument = { ...this.state.document };
        saveDocument.projectId = this.props.projectId

        saveDocument.docDate = moment(saveDocument.docDate).format("MM/DD/YYYY");
        saveDocument.budgetDate=moment(saveDocument.budgetDate).format("MM/DD/YYYY");
        dataservice.addObject("AddContractProcurementRequestForm", saveDocument).then(result => {
            this.setState({
                docId: result,
                isLoading: false
            });
            toast.success(Resources["operationSuccess"][currentLanguage]);
            this.props.history.push(this.state.perviousRoute);

        });
    }
    showOptionPanel = () => {
        this.props.actions.showOptionPanel(true);
    }
    onChangeMessage = (value,MessageType) => {
        if (value != null) {
            let original_document = { ...this.state.document };
            let updated_document = {};
            updated_document[MessageType] = value;
            Object.assign(original_document, updated_document);
            this.setState({
                document: original_document
            });
        }
    };
   
    render() {
        return (
        <div className="mainContainer" id={"mainContainer"}>
            <div className={this.state.isViewMode === true? "documents-stepper noTabs__document readOnly_inputs": "documents-stepper noTabs__document"}>
            <HeaderDocument
                        projectName={projectName}
                        isViewMode={this.state.isViewMode}
                        perviousRoute={this.state.perviousRoute}
                        docTitle={Resources.contractProcurmentRequestForm[currentLanguage]}
                        moduleTitle={Resources["contracts"][currentLanguage]}/>
             <div className="doc-container">
                 <div className="step-content">
                     <div id="step1" className="step-content-body">
                         <div className="subiTabsContent">
                              <div className="document-fields">
                              <Formik
                              initialValues={{ ...this.state.document }}
                              validationSchema={validationSchema}
                              enableReinitialize={true}
                              onSubmit={values => {
                                if (this.state.docId > 0) {
                                    this.editContractProcurmentRequest();
                                } else 
                                    this.saveContractProcurmentRequest();
                            }}
                              >
                              {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                                <Form id="letterForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>
                                    <div className="proForm first-proform">
                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">
                                                                {Resources.subject[currentLanguage]}
                                                            </label>
                                                            <div className={"inputDev ui input" + (errors.subject ? (" has-error") : !errors.subject && touched.subject ? (" has-success") : " ")} >
                                                                <textarea name="subject" id="subject" className="form-control fsadfsadsa"
                                                                    placeholder={Resources.subject[currentLanguage]}
                                                                    autoComplete="off"
                                                                    value={this.state.document.subject}
                                                                    onBlur={e => { handleBlur(e); handleChange(e); }}
                                                                    onChange={e => this.handleChange(e, "subject")} >
                                                                        {touched.subject ? (<em className="pError">{errors.subject}</em>) : null}
                                                                    </textarea>
                                                                
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
                                                <label className="control-label">
                                                     {Resources.arrange[currentLanguage]}
                                                 </label>
                                                <div className="ui input inputDev">
                                                    <input type="text" className="form-control" id="arrange"
                                                            readOnly value={this.state.document.arrange}
                                                            name="arrange"
                                                            placeholder={Resources.arrange[currentLanguage]}
                                                            onBlur={e => { handleChange(e); handleBlur(e); }}
                                                            onChange={e => this.handleChange(e, "arrange")}
                                                     />
                                                </div>
                                         </div>
                                        <div className="linebylineInput fullInputWidth">
                                            <label className="control-label">
                                                {Resources.refNo[currentLanguage]}
                                            </label>
                                            <div className="ui input inputDev">
                                                    <input type="number" className="form-control" id="refNo"
                                                           value={this.state.document.refNo}
                                                            name="refNo"
                                                            placeholder={Resources.refNo[currentLanguage]}
                                                            onChange={e => this.handleChange(e, "refNo")} />
                                            </div>
                                        </div>
                                        <div className="linebylineInput fullInputWidth">
                                            <label className="control-label">
                                                {Resources.criticalFactor[currentLanguage]}
                                            </label>
                                            <div className="ui input inputDev">
                                                    <input type="text" className="form-control" id="criticalFactor"
                                                           value={this.state.document.criticalFactor}
                                                            name="criticalFactor"
                                                            placeholder={Resources.criticalFactor[currentLanguage]}
                                                            onChange={e => this.handleChange(e, "criticalFactor")} />
                                            </div>
                                        </div>
                                        <div className="linebylineInput fullInputWidth">
                                            <label className="control-label">
                                                {Resources.justification[currentLanguage]}
                                            </label>
                                            <div className="ui input inputDev">
                                                    <input type="text" className="form-control" id="justification"
                                                           value={this.state.document.justification}
                                                            name="justification"
                                                            placeholder={Resources.justification[currentLanguage]}
                                                            onChange={e => this.handleChange(e, "justification")} />
                                            </div>
                                        </div>
                                        <div className="linebylineInput fullInputWidth">
                                            <label className="control-label">
                                                {Resources.specialInstruction[currentLanguage]}
                                            </label>
                                            <div className="ui input inputDev">
                                                    <input type="text" className="form-control" id="specialInstruction"
                                                           value={this.state.document.specialInstruction}
                                                            name="specialInstruction"
                                                            placeholder={Resources.specialInstruction[currentLanguage]}
                                                            onChange={e => this.handleChange(e, "specialInstruction")} />
                                            </div>
                                        </div>
                                        <div className="linebylineInput fullInputWidth">
                                            <label className="control-label">
                                                {Resources.budgetComments[currentLanguage]}
                                            </label>
                                            <div className="ui input inputDev">
                                                    <input type="text" className="form-control" id="budgetComments"
                                                           value={this.state.document.budgetComments}
                                                            name="budgetComments"
                                                            placeholder={Resources.budgetComments[currentLanguage]}
                                                            onChange={e => this.handleChange(e, "budgetComments")} />
                                            </div>
                                        </div>
                                        <div className="linebylineInput valid-input alternativeDate">
                                            <DatePicker title="budgetDate"
                                             startDate={this.state.document.budgetDate}
                                             handleChange={e => this.handleChangeDate(e, "budgetDate")} />
                                        </div>
                                        <div className="linebylineInput valid-input mix_dropdown">
                                            <label className="control-label">
                                                 {
                                                    Resources.fromCompany[currentLanguage]
                                                 }
                                            </label>
                                                    <div className="supervisor__company">
                                                                <div className="super_name">
                                                                    <Dropdown data={this.state.companies}
                                                                        isMulti={false}
                                                                        selectedValue={this.state.selectedFromCompany}
                                                                        handleChange={event => {
                                                                            this.handleChangeDropDown(event, "fromCompanyId", true, "fromContacts", "GetContactsByCompanyId", "companyId", "selectedFromCompany", "selectedFromContact");
                                                                        }}
                                                                        onChange={setFieldValue}
                                                                        onBlur={setFieldTouched}
                                                                        error={errors.fromCompanyId}
                                                                        touched={touched.fromCompanyId}
                                                                        index="fromCompanyId"
                                                                        name="fromCompanyId"
                                                                        id="fromCompanyId"
                                                                        styles={CompanyDropdown}
                                                                        classDrop="companyName1"
                                                                    />
                                                        </div>
                                                        <div className="super_company">
                                                                    <Dropdown isMulti={false}
                                                                        data={this.state.fromContacts}
                                                                        selectedValue={this.state.selectedFromContact}
                                                                        handleChange={event =>
                                                                            this.handleChangeDropDown(event, "fromContactId", false, "", "", "", "selectedFromContact")}
                                                                        onChange={setFieldValue}
                                                                        onBlur={setFieldTouched}
                                                                        error={errors.fromContactId}
                                                                        touched={true}
                                                                        isClear={false}
                                                                        index="letter-fromContactId"
                                                                        name="fromContactId"
                                                                        id="fromContactId"
                                                                        classDrop="contactName1"
                                                                        styles={ContactDropdown}
                                                                    />
                                                            </div>
                                                            </div>
                                        </div>
                                        <div className="linebylineInput valid-input mix_dropdown">
                                            <label className="control-label">
                                                 {
                                                    Resources.budgetCompany[currentLanguage]
                                                 }
                                            </label>
                                                    <div className="supervisor__company">
                                                                <div className="super_name">
                                                                    <Dropdown data={this.state.companies}
                                                                        isMulti={false}
                                                                        selectedValue={this.state.selectedBudgetCompany}
                                                                        handleChange={event => this.handleChangeDropDown(event, "budgetCompanyId", true, "budgetContacts", "GetContactsByCompanyId", "companyId", "selectedBudgetCompany", "selectedBudgetContact")}
                                                                        onChange={setFieldValue}
                                                                        onBlur={setFieldTouched}
                                                                        error={errors.budgetCompanyId}
                                                                        touched={touched.budgetCompanyId}
                                                                        index="budgetCompanyId"
                                                                        name="budgetCompanyId"
                                                                        id="budgetCompanyId"
                                                                        styles={CompanyDropdown}
                                                                        classDrop="companyName1"
                                                                    />
                                                        </div>
                                                        <div className="super_company">
                                                                    <Dropdown isMulti={false}
                                                                        data={this.state.budgetContacts}
                                                                        selectedValue={this.state.selectedBudgetContact}
                                                                        handleChange={event =>
                                                                            this.handleChangeDropDown(event, "budgetContactId", false, "", "", "", "selectedBudgetContact")}
                                                                        onChange={setFieldValue}
                                                                        onBlur={setFieldTouched}
                                                                        error={errors.budgetContactId}
                                                                        touched={true}
                                                                        isClear={false}
                                                                        index="letter-fromContactId"
                                                                        name="budgetContactId"
                                                                        id="budgetContactId"
                                                                        classDrop="contactName1"
                                                                        styles={ContactDropdown}
                                                                    />
                                                            </div>
                                                            </div>
                                                    </div>
                                        <div className="linebylineInput valid-input ">
                                            <label className="control-label">
                                                 {
                                                    Resources.bidderCompany[currentLanguage]
                                                 }
                                            </label>
                                            <div className="supervisor__company">
                                                     <div className="super_name">
                                                                    <Dropdown data={this.state.companies}
                                                                        isMulti={false}
                                                                        selectedValue={this.state.selectedBidderCompany}
                                                                        handleChange={event => this.handleChangeDropDown(event, "bidderCompanyId", false, "", "", "companyId", "selectedBidderCompany", "")}
                                                                        onChange={setFieldValue}
                                                                        onBlur={setFieldTouched}
                                                                        error={errors.bidderCompanyId}
                                                                        touched={touched.bidderCompanyId}
                                                                        index="bidderCompanyId"
                                                                        name="bidderCompanyId"
                                                                        id="bidderCompanyId"
                                                                        styles={CompanyDropdown}
                                                                        classDrop="companyName1"
                                                                    />
                                                    </div>
                                                </div>
                                        </div>
                                        <div className="linebylineInput valid-input">
                                                            <Dropdown title="department"
                                                                data={this.state.departments}
                                                                selectedValue={this.state.selectedDepartment}
                                                                handleChange={event =>
                                                                    this.handleChangeDropDown(event, "departmentId", false, "", "", "", "selectedDepartment")
                                                                } index="letter-discipline" />
                                        </div>
                                        <div className="linebylineInput valid-input ">
                                            <label className="control-label">
                                                 {
                                                    Resources.vendorCompany[currentLanguage]
                                                 }
                                            </label>
                                            <div className="supervisor__company">
                                                     <div className="super_name">
                                                                    <Dropdown data={this.state.companies}
                                                                        isMulti={false}
                                                                        selectedValue={this.state.selectedVendorCompany}
                                                                        handleChange={event => this.handleChangeDropDown(event, "vendorCompanyId", false, "", "", "companyId", "selectedVendorCompany", "")}
                                                                        onChange={setFieldValue}
                                                                        onBlur={setFieldTouched}
                                                                        error={errors.vendorCompanyId}
                                                                        touched={touched.vendorCompanyId}
                                                                        index="vendorCompanyId"
                                                                        name="vendorCompanyId"
                                                                        id="vendorCompanyId"
                                                                        styles={CompanyDropdown}
                                                                        classDrop="companyName1"
                                                                    />
                                                    </div>
                                                </div>
                                        </div>
                                        <div className="linebylineInput valid-input">
                                                            <Dropdown title="contract"
                                                                data={this.state.contracts}
                                                                selectedValue={this.state.selectedContract}
                                                                handleChange={event =>
                                                                    this.handleChangeDropDown(event, "contractId", false, "", "", "", "selectedContract")
                                                                } index="letter-discipline" />
                                        </div>
                                        <div className="letterFullWidth">
                                                <label className="control-label">
                                                    {Resources.progressToDate[currentLanguage]}
                                                </label>
                                                <div className="inputDev ui input">
                                                        <TextEditor value={this.state.document.progressToDate}
                                                           onChange={value=>this.onChangeMessage(value,"progressToDate")}

                                                          />
                                                 </div>
                                         </div>
                                        <div className="letterFullWidth">
                                                <label className="control-label">
                                                    {Resources.description[currentLanguage]}
                                                </label>
                                                <div className="inputDev ui input">
                                                        <TextEditor value={this.state.document.description}
                                                            onChange={value=>this.onChangeMessage(value,"description")}
                                                          />
                                                 </div>
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
                                                <div className="slider-Btns">
                                                  {this.showBtnsSaving()}
                                                </div>}
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
                                                                        <button className={this.state.isViewMode === true ? "primaryBtn-1 btn middle__btn disNone" : "primaryBtn-1 btn middle__btn"}>{Resources.save[currentLanguage]}</button>
                                                                    )}
                                                                <DocumentActions
                                                                    isApproveMode={this.state.isApproveMode}
                                                                    docTypeId={this.state.docTypeId}
                                                                    docId={this.state.docId}
                                                                    projectId={this.state.projectId}
                                                                    docAlertId={this.state.docAlertId}
                                                                    previousRoute={this.state.previousRoute}
                                                                    docApprovalId={this.state.docApprovalId}
                                                                    currentArrange={this.state.arrange}
                                                                    showModal={this.props.showModal}
                                                                    showOptionPanel={this.showOptionPanel}
                                                                    permission={this.state.permission}
                                                                    documentName="contractProcurmentRequestForm"

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
                                            {this.state.docId > 0 && this.state.isViewMode === false ? (<UploadAttachment changeStatus={this.props.changeStatus} AddAttachments={10129} EditAttachments={10130} ShowDropBox={10135} ShowGoogleDrive={10136} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />) : null}
                                            {this.viewAttachments()}
                                            {this.props.changeStatus === true ? (<ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />) : null}
                                        </div>
                              </div>  
                         </div>
                     </div>    
                 </div>
             </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProcurmentRequestFormAddEdit));
