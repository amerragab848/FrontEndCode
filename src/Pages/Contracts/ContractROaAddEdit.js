import React, { Component, Fragment } from "react";
import DatePicker from "../../Componants/OptionsPanels/DatePicker";
import moment from "moment";
import "react-table/react-table.css";
import Resources from "../../resources.json";
import find from "lodash/find";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { withRouter } from "react-router-dom";
import dataService from "../../Dataservice";
import CryptoJS from "crypto-js";
import { toast } from "react-toastify";
import UploadAttachment from "../../Componants/OptionsPanels/UploadAttachmentWithProgress";
import ViewAttachment from "../../Componants/OptionsPanels/ViewAttachmments";
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import Config from "../../Services/Config.js";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as communicationActions from "../../store/actions/communication";
import HeaderDocument from "../../Componants/OptionsPanels/HeaderDocument";
import Steps from "../../Componants/publicComponants/Steps";
import DocumentActions from '../../Componants/OptionsPanels/DocumentActions'
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import CompanyDropdown from '../../Componants/publicComponants/CompanyDropdown'
import ContactDropdown from '../../Componants/publicComponants/ContactDropdown'


var steps_defination = [];

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const validationSchema = Yup.object().shape({
    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]).max(450, Resources['maxLength'][currentLanguage]),
    requestByCompanyId: Yup.string().required(Resources['RequiredrequestByCompany'][currentLanguage]).nullable(true),
    requestByContactId: Yup.string().required(Resources['requestByContaact'][currentLanguage]).nullable(true)
});

let docId = 0;
let projectId = 0;
let projectName = "";
let isApproveMode = 0;
let docApprovalId = 0;
let arrange = 0;
let perviousRoute = '';
let voColumns = [];
let selectedRow = [];
let indexx = 0;

class ContractROaAddEdit extends Component {

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
                    perviousRoute = obj.perviousRoute;
                    arrange = obj.arrange;
                } catch {
                    this.props.history.goBack();
                }
            }
            index++;
        }

        this.state = {
            ownerContacts: [],
            contractorContacts: [],
            docApprovalId: docApprovalId,
            btnTxt: "save",
            rankingCompanies: [],
            contractorCompanies: [],
            ownerCompanies: [],
            currentStep: 0,
            isViewMode: false,
            isApproveMode: isApproveMode,
            perviousRoute: perviousRoute,
            isView: false,
            docId: docId,
            companies: [],
            contacts: [],
            projectId: projectId,
            docTypeId: 122,
            document: this.props.document ? Object.assign({}, this.props.document) : {},

            permission: [{ name: 'sendByEmail', code: 10102 },
            { name: 'sendByInbox', code: 10101 },
            { name: 'sendTask', code: 1 },
            { name: 'distributionList', code: 10110 },
            { name: 'createTransmittal', code: 10111 },
            { name: 'sendToWorkFlow', code: 10105 },
            { name: 'viewAttachments', code: 10107 },
            { name: 'deleteAttachments', code: 10109 }],
            contractROASummaryObj: {
                id: 0,
                ROAId: "",
                contractRef: "",
                qty: "",
                ownerId: "",
                contractorId: "",
                contractScope: "",
                contractorDuration: "",
                advPayment: "",
                specialCases: "",
                workFlowId: "",
                contractPrice: "",
                ownerContactId: "",
                contractorContactId: "",
                contractorName: "",
                ownerName: "",
                contractorContactName: "",
                ownerContactName: ""
            },
            ROArankingObj: {
                ROAId: "",
                qty: "",
                advPayment: "",
                firstPrice: "",
                finalPrice: "",
                companyId: "",
                duration: "",
                notes: "",
                docDate: moment().format('YYYY-MM-DD')
            },
            selectedRequestByCompany: { label: Resources.requestByCompany[currentLanguage], value: "0" },
            selectedRequestByContact: { label: Resources.requestByContact[currentLanguage], value: "0" },
            selectedOwnerCompany: { label: Resources.owner[currentLanguage], value: "0" },
            selectedContractorCompany: { label: Resources.contractor[currentLanguage], value: "0" },
            selectedRankingCompanyId: { label: Resources.company[currentLanguage], value: "0" },
            selectedownerContactId: { label: Resources.ownerContact[currentLanguage], value: "0" },
            selectedcontractorContactId: { label: Resources.contractorContact[currentLanguage], value: "0" },

        };
        steps_defination = [
            {
                name: 'contractROA',
                callBackFn: null,
            },
            {
                name: 'contractSummmary',
                callBackFn: null,
            },
            {
                name: 'items',
                callBackFn: null,
            }
        ];
        this.groups = [];

        this.actions = [];

        this.documentColumns = [
            {
                "field": "refNumber",
                "friendlyName": "refNumber",
                "minWidth": 65,
                "width": "10%",
                "dataType": "string",
                "exportDataType": "n"
            },
            {
                "field": "tenderNumber",
                "friendlyName": "tenderNumber",
                "minWidth": 65,
                "width": "10%",
                "dataType": "string",
                "exportDataType": "n"
            },
            {
                "field": "statusName",
                "friendlyName": "status",
                "minWidth": 155,
                "width": "7%",
                "dataType": "status",
                "exportDataType": "s"
            },
            {
                "field": "subject",
                "friendlyName": "subject",
                "minWidth": 200,
                "width": "20%",
                "dataType": "string",
                "exportDataType": "s"
            },
            {
                "field": "tenderScope",
                "friendlyName": "tenderScope",
                "minWidth": 150,
                "width": "15%",
                "dataType": "string",
                "exportDataType": "s"
            },
            {
                "field": "budget",
                "friendlyName": "budget",
                "minWidth": 150,
                "width": "15%",
                "dataType": "number",
                "exportDataType": "s"
            },
            {
                "field": "totalValue",
                "friendlyName": "totalValue",
                "minWidth": 150,
                "width": "15%",
                "dataType": "number",
                "exportDataType": "s"
            },
            {
                "field": "awardedJustification",
                "friendlyName": "awardedJustification",
                "minWidth": 150,
                "width": "15%",
                "dataType": "string",
                "exportDataType": "s"
            },
            {
                "field": "createdBy",
                "friendlyName": "createdBy",
                "minWidth": 85,
                "width": "15%",
                "dataType": "string",
                "exportDataType": "d"
            },
            {
                "field": "deletedBy",
                "friendlyName": "deletedBy",
                "minWidth": 85,
                "width": "15%",
                "dataType": "string",
                "exportDataType": "s"
            },


            {
                "field": "projectName",
                "friendlyName": "projectName",
                "minWidth": 85,
                "width": "15%",
                "dataType": "string",
                "exportDataType": "s"
            },
            {
                "field": "docDate",
                "friendlyName": "docDate",
                "minWidth": 85,
                "width": "15%",
                "dataType": "date",
                "exportDataType": "s"
            },
            {
                "field": "requestByContact",
                "friendlyName": "requestByContact",
                "minWidth": 85,
                "width": "15%",
                "dataType": "string",
                "exportDataType": "s"
            },
            {
                "field": "requestByCompany",
                "friendlyName": "requestByCompany",
                "minWidth": 85,
                "width": "15%",
                "dataType": "string",
                "exportDataType": "s"
            }
        ]
    }
    showOptionPanel = () => {
        this.props.actions.showOptionPanel(true);
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
    handleChangeRankingDate(e, field) {

        let original_document = { ...this.state.ROArankingObj };

        let updated_document = {};

        updated_document[field] = e;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            ROArankingObj: updated_document
        });
    }
    componentWillUnmount() {
        this.props.actions.clearCashDocument();
        this.props.actions.documentForAdding();
    }

    viewAttachments() {
        return (
            this.state.docId > 0 ? (Config.IsAllow(10107) === true ? <ViewAttachment isApproveMode={this.state.isViewMode} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} deleteAttachments={10109} /> : null) : null
        )
    }
    handleChangeDropDown(event, field, isSubscrib, targetState, url, param, selectedValue, subDatasource,subDatasourceId) {
        
        let original_document = { ...this.state.document };
        let updated_document = {};
       
        if (event == null) {
            updated_document[field] = event;
            updated_document[subDatasourceId] = event;

            this.setState({
               
                [subDatasource]: event
            });
        }
        else
        {
            updated_document[field] = event.value;
        }
        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            document: updated_document,
            [selectedValue]: event
        });

        if (isSubscrib) {

            if(event==null){
                this.setState({
                    [targetState]: []
                });
               
            }
            else{
                let action = url + "?" + param + "=" + event.value
                dataService.GetDataList(action, 'contactName', 'id').then(result => {
                    this.setState({
                        [targetState]: result
                    });
                });
            }
        }

    }
    handleChangeDropDSummary(event, field, selectedValue, isSubscrib, targetState, url, param,subDatasource,subDatasourceId) {
        
        let obj = { ...this.state.contractROASummaryObj };
        let updated_document = {};
        if (event == null) {
            updated_document[field] = event;
            updated_document[subDatasourceId] = event;
            this.setState({
               
                [subDatasource]: event
            });

         }else{
             updated_document[field] = event.value;
         }
        updated_document = Object.assign(obj, updated_document);

        this.setState({
            contractROASummaryObj: updated_document,
            [selectedValue]: event
        });
        if (isSubscrib) {

            if(event==null){
                this.setState({
                    [targetState]: []
                });
               
            }
            else{
                let action = url + "?" + param + "=" + event.value
                dataService.GetDataList(action, 'contactName', 'id').then(result => {
                    this.setState({
                        [targetState]: result
                    });
                });
            }
        }
    }
    handleChangeSummary(e, field) {

        let obj = { ...this.state.contractROASummaryObj };

        let updated_document = {};

        updated_document[field] = e.target.value;

        updated_document = Object.assign(obj, updated_document);

        this.setState({
            contractROASummaryObj: updated_document
        });
    }
    handleChangeDropDRanking(event, field, selectedValue,subDatasourceId) {
       
        let obj = { ...this.state.ROArankingObj };
        let updated_document = {};
        if (event == null) {
            updated_document[field] = event;
            updated_document[subDatasourceId] = event;

         }else{
             updated_document[field] = event.value;
         }
        updated_document = Object.assign(obj, updated_document);

        this.setState({
            ROArankingObj: updated_document,
            [selectedValue]: event
        });

    }
    handleChangeRanking(e, field) {

        let obj = { ...this.state.ROArankingObj };

        let updated_document = {};

        updated_document[field] = e.target.value;

        updated_document = Object.assign(obj, updated_document);

        this.setState({
            ROArankingObj: updated_document
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
    checkDocumentIsView() {
        if (this.props.changeStatus === true) {

            if (!Config.IsAllow(10097)) {
                this.setState({ isViewMode: true });
            }
            if (Config.getUserTypeIsAdmin() === true) {
                this.setState({ isViewMode: false });
            }
            else {
                if (this.state.isApproveMode != true && Config.IsAllow(10097)) {
                    if (this.props.document.hasWorkflow == false && Config.IsAllow(10097)) {
                        if (this.props.document.status != false && Config.IsAllow(10097)) {
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
    componentDidMount() {
        if (this.state.docId > 0) {
            this.setState({ isLoading: true, LoadingPage: true });

            this.props.actions.documentForEdit("GetContractROAById?id=" + this.state.docId, this.state.docTypeId, "ContractROA").then(() => {

                let data = { items: this.props.document }
                this.props.actions.ExportingData(data);
                console.log(this.props.document);
                this.setState({
                    isLoading: false,
                    btnTxt: steps_defination.length == 2 ? "Finish" : "next",
                    LoadingPage: false
                });
                this.checkDocumentIsView();
            });



            let url = "GetContractROASummaryByROAId?ROAId=" + this.state.docId;
            dataService.GetDataGrid(url).then(
                result => {
                    this.setState({
                        contractROASummaryObj: result,
                        selectedOwnerCompany: { label: result ? result.ownerName : Resources.owner[currentLanguage], value: result ? result.ownerId : "0" },
                        selectedContractorCompany: { label: result ? result.contractorName : Resources.contractor[currentLanguage], value: result ? result.contractorId : "0" },
                    });
                }
            )

            let urlRank = "GetContractROARankinByROAId?ROAId=" + this.state.docId;
            dataService.GetDataGrid(urlRank).then(
                result => {
                    this.setState({
                        ROArankingObj: result,
                        selectedRankingCompanyId: { label: result ? result.companyName : Resources.company[currentLanguage], value: result ? result.companyId : "0" }

                    });
                }
            )
        }
        else {
            const contractROADocument = {

                id: 0,
                projectId: this.state.projectId,
                subject: "",
                docDate: moment().format('YYYY-MM-DD'),
                status: "true",
                refNumber: '',
                tenderNumber: '',
                subject: '',
                tenderScope: '',
                budget: '',
                totalValue: '',
                awardedJustification: '',
                requestByContactId: null,
                requestByCompanyId: null,
                lastWorkFlowCycleId: null
            };

            this.setState({ document: contractROADocument });
            this.fillDropDowns(false);
            this.props.actions.documentForAdding();
        }

    }
    editContractROA(event) {
        this.setState({
            isLoading: true
        });

        let saveDocument = this.state.document;

        saveDocument.docDate = moment(saveDocument.docDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');

        dataService.addObject('EditContractROA', saveDocument).then(result => {
            this.setState({
                isLoading: false
            });

            toast.success(Resources["operationSuccess"][currentLanguage]);
            this.changeCurrentStep(1);
        }).catch(ex => toast.error(Resources["failError"][currentLanguage]));
    }

    saveContractROA(event) {

        let saveDocument = this.state.document;

        saveDocument.docDate = moment(saveDocument.docDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
        this.setState({
            isLoading: true
        });

        dataService.addObject('AddContractROA', saveDocument).then(result => {
            this.setState({
                docId: result,
                btnTxt: "next",
                isLoading: false

            });
            toast.success(Resources["operationSuccess"][currentLanguage]);
            this.changeCurrentStep(1);
        }).catch(ex => toast.error(Resources["failError"][currentLanguage]));
    }

    addEditContractROARanking(values) {
        this.setState({
            isLoading: true
        });

        let saveDocument = { ...values };

        saveDocument.docDate = moment(saveDocument.docDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
        saveDocument.ROAId = this.state.docId
        dataService.addObject('AddEditContractROARanking', saveDocument).then(result => {
            this.setState({
                isLoading: false
            });

            toast.success(Resources["operationSuccess"][currentLanguage]);
            this.saveAndExit()
            // if (this.state.isApproveMode === false) {
            //     this.props.history.push(
            //         this.state.perviousRoute
            //     );
            // }
        }).catch(ex => toast.error(Resources["failError"][currentLanguage]));
    }
    saveAndExit(event) {
        this.props.history.push("/ContractROA/" + this.state.projectId);
    }
    changeCurrentStep = stepNo => {
        if (stepNo == 2 && this.state.docId > 0) {

        }
        this.setState({ currentStep: stepNo });
    };
    fillDropDowns(isEdit) {

        dataService.GetDataListCached("GetProjectProjectsCompaniesForList?projectId=" + this.state.projectId, "companyName", "companyId", 'companies', this.state.projectId, "projectId").then(
            result => {

                if (isEdit) {

                    let companyId = this.props.document.requestByCompanyId;
                    let contactId = this.props.document.requestByContactId;
                    if (companyId) {
                        this.setState({
                            selectedRequestByCompany: { label: this.props.document.requestByCompany, value: companyId },
                            selectedRequestByContact: { label: this.props.document.requestByContact, value: contactId }

                        });
                        this.fillSubDropDownInEdit('GetContactsByCompanyId', 'companyId', companyId, 'requestByContactId', 'selectedRequestByContact', 'contacts');

                    }
                    let ownerContactId = this.state.contractROASummaryObj ? this.state.contractROASummaryObj.ownerContactId : "";
                    let companyOwnerId = this.state.contractROASummaryObj ? this.state.contractROASummaryObj.ownerId : "";
                    if (companyOwnerId) {
                        this.setState({
                            selectedOwnerCompany: { label: this.state.contractROASummaryObj.ownerName, value: companyOwnerId },
                            selectedownerContactId: { label: this.state.contractROASummaryObj.ownerContactName, value: ownerContactId }

                        });
                        this.fillSubDropDownInEditSummary('GetContactsByCompanyId', 'companyId', companyOwnerId, 'ownerContactId', 'selectedownerContactId', 'ownerContacts');

                    }
                    let companyContractorId = this.state.contractROASummaryObj ? this.state.contractROASummaryObj.contractorId : "";
                    let contractorContactId = this.state.contractROASummaryObj ? this.state.contractROASummaryObj.contractorContactId : "";
                    if (companyContractorId) {
                        this.setState({
                            selectedContractorCompany: { label: this.state.contractROASummaryObj.contractorName, value: companyContractorId },
                            selectedcontractorContactId: { label: this.state.contractROASummaryObj.contractorContactName, value: contractorContactId }

                        });
                        this.fillSubDropDownInEditSummary('GetContactsByCompanyId', 'companyId', companyContractorId, 'contractorContactId', 'selectedcontractorContactId', 'contractorContacts');

                    }



                }
                this.setState({
                    companies: [...result],
                    contractorCompanies: [...result],
                    ownerCompanies: [...result],
                    rankingCompanies: [...result]
                });

            }).catch(ex => toast.error(Resources["failError"][currentLanguage]));
    }
    fillSubDropDownInEdit(url, param, value, subField, subSelectedValue, subDatasource) {
        let action = url + "?" + param + "=" + value
        dataService.GetDataList(action, 'contactName', 'id').then(result => {
            if (this.props.changeStatus === true) {
                let toSubField = this.state.document[subField];
                let targetFieldSelected = find(result, function (i) { return i.value == toSubField; });
                this.setState({
                    [subSelectedValue]: targetFieldSelected,
                    [subDatasource]: result
                });
            }
        }).catch(ex => toast.error(Resources["failError"][currentLanguage]));
    }
    fillSubDropDownInEditSummary(url, param, value, subField, subSelectedValue, subDatasource) {
        let action = url + "?" + param + "=" + value
        dataService.GetDataList(action, 'contactName', 'id').then(result => {
            if (this.props.changeStatus === true) {
                let toSubField = this.state.contractROASummaryObj[subField];
                let targetFieldSelected = find(result, function (i) { return i.value == toSubField; });
                this.setState({
                    [subSelectedValue]: targetFieldSelected,
                    [subDatasource]: result
                });
            }
        }).catch(ex => toast.error(Resources["failError"][currentLanguage]));
    }
    static getDerivedStateFromProps(nextProps, state) {
        if (nextProps.document.id != state.document.id && nextProps.changeStatus === true) {
            let contractROA = { ...nextProps.document };

            contractROA.docDate = contractROA.docDate != null ? moment(contractROA.docDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');

            return {
                document: contractROA,
                hasWorkflow: nextProps.hasWorkflow
            };
        }

        return null;
    };
    showBtnsSaving = (step) => {

        let btn = null;

        //if (this.state.docId === 0) { onClick={() => this.changeCurrentStep(step)}
        btn = <button className="primaryBtn-1 btn meduimBtn" type="submit" >{Resources.finish[currentLanguage]}</button>;
        // }

        return btn;
    }

    addEditROASummary(values) {
        this.setState({
            isLoading: true
        });

        let saveDocument = { ...values };
        saveDocument.projectId = this.state.projectId
        saveDocument.ROAId = this.state.docId;
        dataService.addObject("AddEditContractROASummary", saveDocument).then(
            result => {
                if (result !== "invalid recommendation of award") {
                    this.setState({
                        //  docId: result,
                        isLoading: false
                    });
                    toast.success(Resources["operationSuccess"][currentLanguage]);
                    this.changeCurrentStep(2);
                }
                else {
                    toast.error(result);
                }
            });
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

    render() {
        return (
            <div className="mainContainer">
                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document readOnly_inputs" : "documents-stepper noTabs__document"}>
                    <HeaderDocument projectName={projectName} isViewMode={this.state.isViewMode} perviousRoute={this.state.perviousRoute} docTitle={Resources.contractROA[currentLanguage]} moduleTitle={Resources['contract'][currentLanguage]} />
                    <div className="doc-container">
                        <Steps
                            steps_defination={steps_defination}
                            exist_link="/ContractROA/"
                            docId={this.state.docId}
                            changeCurrentStep={stepNo =>
                                this.changeCurrentStep(stepNo)
                            }
                            stepNo={this.state.currentStep}
                            changeStatus={docId === 0 ? false : true}
                        />
                        <div className="step-content">
                            {this.state.currentStep == 0 ? (
                                <div id="step1" className="step-content-body">
                                    <div className="subiTabsContent">
                                        <div className="document-fields">
                                            <Formik initialValues={{ ...this.state.document }}
                                                validationSchema={validationSchema}
                                                enableReinitialize={true}
                                                onSubmit={(values) => {
                                                    if (this.props.showModal) { return; }
                                                    if (this.props.changeStatus === true && this.state.docId > 0) {
                                                        this.editContractROA();
                                                    } else if (this.props.changeStatus === false && this.state.docId === 0) {
                                                        this.saveContractROA();
                                                    }

                                                }}>
                                                {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched, values }) => (
                                                    <Form id="rfiForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>
                                                        <div className="proForm first-proform">
                                                            <div className="linebylineInput valid-input">
                                                                <label className="control-label">{Resources.subject[currentLanguage]}</label>
                                                                <div className={"inputDev ui input" + (errors.subject && touched.subject ? (" has-error") : !errors.subject && touched.subject ? (" has-success") : " ")} >
                                                                    <input name='subject' className="form-control fsadfsadsa" id="subject"
                                                                        placeholder={Resources.subject[currentLanguage]}
                                                                        autoComplete='off' value={this.state.document.subject || ''}
                                                                        onBlur={(e) => { handleBlur(e); handleChange(e) }}
                                                                        onChange={(e) => this.handleChange(e, 'subject')} />
                                                                    {errors.subject && touched.subject ? (<em className="pError">{errors.subject}</em>) : null}
                                                                </div>
                                                            </div>
                                                            <div className="linebylineInput valid-input">
                                                                <label className="control-label">{Resources.status[currentLanguage]}</label>
                                                                <div className="ui checkbox radio radioBoxBlue">
                                                                    <input type="radio" name="status" defaultChecked={this.state.document.status === false ? null : 'checked'} value="true" onChange={e => this.handleChange(e, 'status')} />
                                                                    <label>{Resources.oppened[currentLanguage]}</label>
                                                                </div>
                                                                <div className="ui checkbox radio radioBoxBlue">
                                                                    <input type="radio" name="status" defaultChecked={this.state.document.status === false ? 'checked' : null} value="false" onChange={e => this.handleChange(e, 'status')} />
                                                                    <label>{Resources.closed[currentLanguage]}</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="proForm datepickerContainer">
                                                            <div className="linebylineInput valid-input alternativeDate">
                                                                <DatePicker title='docDate'
                                                                    startDate={this.state.document.docDate}
                                                                    handleChange={e => this.handleChangeDate(e, 'docDate')} />
                                                            </div>

                                                            <div className="linebylineInput fullInputWidth">
                                                                <label className="control-label">{Resources.refNumber[currentLanguage]}</label>
                                                                <div className={"ui input inputDev "}>
                                                                    <input type="text" className="form-control" id="refNumber"
                                                                        value={this.state.document.refNumber || ''}
                                                                        name="refNumber"
                                                                        placeholder={Resources.refNumber[currentLanguage]}
                                                                        onBlur={(e) => { handleChange(e); handleBlur(e) }}
                                                                        onChange={(e) => this.handleChange(e, 'refNumber')} />
                                                                </div>
                                                            </div>
                                                            <div className="linebylineInput fullInputWidth">
                                                                <label className="control-label">{Resources.tenderNumber[currentLanguage]}</label>
                                                                <div className={"ui input inputDev "}>
                                                                    <input type="text" className="form-control" id="tenderNumber"
                                                                        value={this.state.document.tenderNumber || ''}
                                                                        name="tenderNumber"
                                                                        placeholder={Resources.tenderNumber[currentLanguage]}
                                                                        onBlur={(e) => { handleChange(e); handleBlur(e) }}
                                                                        onChange={(e) => this.handleChange(e, 'tenderNumber')} />
                                                                </div>
                                                            </div>
                                                            <div className="linebylineInput fullInputWidth">
                                                                <label className="control-label">{Resources.tenderScope[currentLanguage]}</label>
                                                                <div className={"ui input inputDev "}>
                                                                    <input type="text" className="form-control" id="tenderScope"
                                                                        value={this.state.document.tenderScope || ''}
                                                                        name="tenderScope"
                                                                        placeholder={Resources.tenderScope[currentLanguage]}
                                                                        onBlur={(e) => { handleChange(e); handleBlur(e) }}
                                                                        onChange={(e) => this.handleChange(e, 'tenderScope')} />
                                                                </div>
                                                            </div>

                                                            <div className="linebylineInput fullInputWidth">
                                                                <label className="control-label">{Resources.awardedJustification[currentLanguage]}</label>
                                                                <div className={"ui input inputDev "}>
                                                                    <input type="text" className="form-control" id="awardedJustification"
                                                                        value={this.state.document.awardedJustification || ''}
                                                                        name="awardedJustification"
                                                                        placeholder={Resources.awardedJustification[currentLanguage]}
                                                                        onBlur={(e) => { handleChange(e); handleBlur(e) }}
                                                                        onChange={(e) => this.handleChange(e, 'awardedJustification')} />
                                                                </div>
                                                            </div>
                                                            <div className="linebylineInput fullInputWidth">
                                                                <label className="control-label">{Resources.budget[currentLanguage]}</label>
                                                                <div className={"ui input inputDev "}>
                                                                    <input type="text" className="form-control" id="budget"
                                                                        value={this.state.document.budget || ''}
                                                                        name="budget"
                                                                        placeholder={Resources.budget[currentLanguage]}
                                                                        onBlur={(e) => { handleChange(e); handleBlur(e) }}
                                                                        onChange={(e) => this.handleChange(e, 'budget')} />
                                                                </div>
                                                            </div>
                                                            <div className="linebylineInput fullInputWidth">
                                                                <label className="control-label">{Resources.totalValue[currentLanguage]}</label>
                                                                <div className={"ui input inputDev"} >
                                                                    <input type="text" className="form-control" id="totalValue"
                                                                        value={this.state.document.totalValue || ''}
                                                                        name="totalValue"
                                                                        placeholder={Resources.totalValue[currentLanguage]}
                                                                        onBlur={(e) => { handleChange(e); handleBlur(e) }}
                                                                        onChange={(e) => this.handleChange(e, 'totalValue')} />

                                                                </div>
                                                            </div>

                                                            <div className="linebylineInput valid-input mix_dropdown">
                                                                <label className="control-label">{Resources.requestByCompany[currentLanguage]}</label>
                                                                <div className="supervisor__company">
                                                                    <div className="super_name">
                                                                        <Dropdown 
                                                                            isClear={true}
                                                                            isMulti={false} data={this.state.companies}
                                                                            selectedValue={this.state.selectedRequestByCompany}
                                                                            handleChange={event => this.handleChangeDropDown(event, "requestByCompanyId", true, "contacts", "GetContactsByCompanyId", "companyId", "selectedRequestByCompany", "selectedRequestByContact","requestByContactId")}
                                                                            onChange={setFieldValue}
                                                                            onBlur={setFieldTouched}
                                                                            error={errors.requestByCompanyId}
                                                                            touched={touched.requestByCompanyId}
                                                                            name="requestByCompanyId"
                                                                            id="requestByCompanyId" styles={CompanyDropdown} classDrop="companyName1 " />
                                                                    </div>
                                                                    <div className="super_company">
                                                                        <Dropdown
                                                                            isClear={true}
                                                                            isMulti={false} data={this.state.contacts}
                                                                            selectedValue={this.state.selectedRequestByContact}
                                                                            handleChange={event =>
                                                                                this.handleChangeDropDown(event, "requestByContactId", false, "", "", "", "selectedRequestByContact")
                                                                            }
                                                                            onChange={setFieldValue}
                                                                            onBlur={setFieldTouched}
                                                                            error={errors.requestByContactId}
                                                                            touched={touched.requestByContactId}
                                                                            name="requestByContactId"
                                                                            id="requestByContactId" classDrop=" contactName1" styles={ContactDropdown} />
                                                                    </div>
                                                                </div>
                                                            </div>


                                                        </div>
                                                        <div className="slider-Btns">
                                                            {/* {
                                                                this.state.isLoading && this.props.changeStatus === false ?
                                                                    <button className="primaryBtn-1 btn disabled">
                                                                        <div className="spinner">
                                                                            <div className="bounce1" />
                                                                            <div className="bounce2" />
                                                                            <div className="bounce3" />
                                                                        </div>
                                                                    </button> :
                                                                    this.showBtnsSaving(1)
                                                            } */}
                                                            {this.state.isLoading && this.props.changeStatus === false ?
                                                                (
                                                                    <button
                                                                        className="primaryBtn-1 btn  disabled"
                                                                        disabled="disabled">
                                                                        <div className="spinner">
                                                                            <div className="bounce1" />
                                                                            <div className="bounce2" />
                                                                            <div className="bounce3" />
                                                                        </div>
                                                                    </button>
                                                                ) : (
                                                                    <div>
                                                                        <button className={"primaryBtn-1 btn " + (this.state.isViewMode === true ? "disNone" : "")} type="submit" disabled={this.state.isViewMode}>{Resources.next[currentLanguage]}</button>;
                                                                    </div>
                                                                )}
                                                        </div>

                                                    </Form>
                                                )}
                                            </Formik>
                                        </div>
                                        <div className="doc-pre-cycle letterFullWidth">
                                            <div>
                                                {this.state.docId > 0 && this.state.isViewMode === false ? (<UploadAttachment changeStatus={this.props.changeStatus} AddAttachments={10106} EditAttachments={10108} ShowDropBox={10115} ShowGoogleDrive={10116} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />) : null}
                                                {this.viewAttachments()}
                                                {this.props.changeStatus === true ? <ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} /> : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                            {this.state.currentStep == 1 ? (
                                <div id="step1" className="step-content-body">
                                    <div className="subiTabsContent">
                                        <div className="document-fields">
                                            <Formik

                                                initialValues={{ ...this.state.contractROASummaryObj }}
                                                //validationSchema={validationSchema}
                                                enableReinitialize={true}
                                                onSubmit={values => {

                                                    this.addEditROASummary(values);

                                                }}
                                            >
                                                {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched, values }) => (
                                                    <Form id="summaryForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>

                                                        <div className="proForm datepickerContainer">
                                                            <div className="linebylineInput fullInputWidth">
                                                                <label className="control-label">
                                                                    {Resources.contractRef[currentLanguage]}
                                                                </label>
                                                                <div className="ui input inputDev">
                                                                    <input type="text" className="form-control" id="contractRef"
                                                                        value={values.contractRef}
                                                                        name="refDoc"
                                                                        placeholder={Resources.contractRef[currentLanguage]}
                                                                        onBlur={(e) => { handleChange(e); handleBlur(e) }}
                                                                        onChange={e => this.handleChangeSummary(e, "contractRef")}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="linebylineInput fullInputWidth">
                                                                <label className="control-label">{Resources.quantity[currentLanguage]}</label>
                                                                <div className="shareLinks">
                                                                    <div className={"inputDev ui input"} >
                                                                        <input type="number" className="form-control" id="quantity"
                                                                            onBlur={(e) => { handleChange(e); handleBlur(e) }}
                                                                            onChange={e => this.handleChangeSummary(e, "qty")}
                                                                            value={values.qty}
                                                                            name="quantity" placeholder={Resources.quantity[currentLanguage]}
                                                                        />
                                                                    </div>

                                                                </div>
                                                            </div>

                                                            <div className="linebylineInput valid-input mix_dropdown">
                                                                <label className="control-label">{Resources.owner[currentLanguage]}</label>
                                                                <div className="supervisor__company">
                                                                    <div className="super_name">
                                                                        <Dropdown
                                                                            isClear={true} 
                                                                            isMulti={false} data={this.state.ownerCompanies}
                                                                            selectedValue={this.state.selectedOwnerCompany}
                                                                            handleChange={event =>
                                                                                this.handleChangeDropDSummary(event, "ownerId", "selectedOwnerCompany", true, "ownerContacts", "GetContactsByCompanyId", "companyId","selectedownerContactId","ownerContactId")
                                                                            }
                                                                            onChange={setFieldValue}
                                                                            onBlur={setFieldTouched}

                                                                            name="ownerId"
                                                                            id="ownerId" styles={CompanyDropdown} classDrop="companyName1 " />
                                                                    </div>
                                                                    <div className="super_company">
                                                                        <Dropdown 

                                                                            isClear={true}
                                                                            isMulti={false} data={this.state.ownerContacts}
                                                                            selectedValue={this.state.selectedownerContactId}
                                                                            handleChange={event =>
                                                                                this.handleChangeDropDSummary(event, "ownerContactId", "selectedownerContactId", false, "", "", "","")
                                                                            }
                                                                            onChange={setFieldValue}
                                                                            onBlur={setFieldTouched}

                                                                            name="ownerContactId"
                                                                            id="ownerContactId" classDrop=" contactName1" styles={ContactDropdown} />
                                                                    </div>
                                                                </div>
                                                            </div>


                                                            <div className="linebylineInput valid-input mix_dropdown">
                                                                <label className="control-label">{Resources.contractor[currentLanguage]}</label>
                                                                <div className="supervisor__company">
                                                                    <div className="super_name">
                                                                        <Dropdown 
                                                                            isClear={true}
                                                                            isMulti={false} data={this.state.contractorCompanies}
                                                                            selectedValue={this.state.selectedContractorCompany}
                                                                            handleChange={event =>
                                                                                this.handleChangeDropDSummary(event, "contractorId", "selectedContractorCompany", true, "contractorContacts", "GetContactsByCompanyId", "companyId","selectedcontractorContactId","contractorContactId")
                                                                            }
                                                                            onChange={setFieldValue}
                                                                            onBlur={setFieldTouched}

                                                                            name="contractorId"
                                                                            id="contractorId" styles={CompanyDropdown} classDrop="companyName1 " />
                                                                    </div>
                                                                    <div className="super_company">
                                                                        <Dropdown 
                                                                            isClear={true}
                                                                            isMulti={false} data={this.state.contractorContacts}
                                                                            selectedValue={this.state.selectedcontractorContactId}
                                                                            handleChange={event =>
                                                                                this.handleChangeDropDSummary(event, "contractorContactId", "selectedcontractorContactId")
                                                                            }
                                                                            onChange={setFieldValue}
                                                                            onBlur={setFieldTouched}

                                                                            name="contractorContactId"
                                                                            id="contractorContactId" classDrop=" contactName1" styles={ContactDropdown} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="linebylineInput fullInputWidth">
                                                                <label className="control-label">
                                                                    {Resources.contractScope[currentLanguage]}
                                                                </label>
                                                                <div className="ui input inputDev">
                                                                    <input type="text" className="form-control" id="contractScope"
                                                                        value={values.contractScope}
                                                                        name="contractScope"
                                                                        placeholder={Resources.contractScope[currentLanguage]}
                                                                        onBlur={(e) => { handleChange(e); handleBlur(e) }}
                                                                        onChange={e => this.handleChangeSummary(e, "contractScope")}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="linebylineInput fullInputWidth">
                                                                <label className="control-label">
                                                                    {Resources.contractorDuration[currentLanguage]}
                                                                </label>
                                                                <div className="ui input inputDev">
                                                                    <input type="number" className="form-control" id="contractorDuration"
                                                                        value={values.contractorDuration}
                                                                        name="contractorDuration"
                                                                        placeholder={Resources.contractorDuration[currentLanguage]}
                                                                        onBlur={(e) => { handleChange(e); handleBlur(e) }}
                                                                        onChange={e => this.handleChangeSummary(e, "contractorDuration")}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="linebylineInput fullInputWidth">
                                                                <label className="control-label">
                                                                    {Resources.advancedPayment[currentLanguage]}
                                                                </label>
                                                                <div className="ui input inputDev">
                                                                    <input type="number" className="form-control" id="advancedPayment"
                                                                        value={values.advPayment}
                                                                        name="advancedPayment"
                                                                        placeholder={Resources.advancedPayment[currentLanguage]}
                                                                        onBlur={(e) => { handleChange(e); handleBlur(e) }}
                                                                        onChange={e => this.handleChangeSummary(e, "advPayment")}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="linebylineInput fullInputWidth">
                                                                <label className="control-label">
                                                                    {Resources.specialCases[currentLanguage]}
                                                                </label>
                                                                <div className="ui input inputDev">
                                                                    <input type="text" className="form-control" id="specialCases"
                                                                        value={values.specialCases}
                                                                        name="specialCases"
                                                                        placeholder={Resources.specialCases[currentLanguage]}
                                                                        onBlur={(e) => { handleChange(e); handleBlur(e) }}

                                                                        onChange={e => this.handleChangeSummary(e, "specialCases")}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="linebylineInput fullInputWidth">
                                                                <label className="control-label">
                                                                    {Resources.contractPrice[currentLanguage]}
                                                                </label>
                                                                <div className="ui input inputDev">
                                                                    <input type="number" className="form-control" id="contractPrice"
                                                                        value={values.contractPrice}
                                                                        name="contractPrice"
                                                                        placeholder={Resources.contractPrice[currentLanguage]}
                                                                        onBlur={(e) => { handleChange(e); handleBlur(e) }}

                                                                        onChange={e => this.handleChangeSummary(e, "contractPrice")}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="slider-Btns">
                                                            {this.state.isLoading && this.props.changeStatus === false ?
                                                                <button className="primaryBtn-1 btn disabled">
                                                                    <div className="spinner">
                                                                        <div className="bounce1" />
                                                                        <div className="bounce2" />
                                                                        <div className="bounce3" />
                                                                    </div>
                                                                </button>
                                                                :
                                                                <div className="slider-Btns">
                                                                    <button className="primaryBtn-1 btn meduimBtn" type="submit" >{Resources.next[currentLanguage]}</button>;

                                                                </div>}
                                                        </div>
                                                    </Form>
                                                )}
                                            </Formik>
                                        </div>
                                    </div>
                                </div>
                            ) : null}

                            {this.state.currentStep == 2 ? (
                                <div id="step1" className="step-content-body">
                                    <div className="subiTabsContent">
                                        <div className="document-fields">
                                            <Formik initialValues={{ ...this.state.ROArankingObj }}
                                                // validationSchema={validationSchema}
                                                enableReinitialize={true}
                                                onSubmit={(values) => {
                                                    this.addEditContractROARanking(values)
                                                }}>
                                                {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched, values }) => (
                                                    <Form id="rfiForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>
                                                        <div className="proForm datepickerContainer">
                                                            <div className="linebylineInput valid-input">
                                                                <Dropdown
                                                                    isClear={true}
                                                                    title="company"
                                                                    data={this.state.rankingCompanies}
                                                                    selectedValue={this.state.selectedRankingCompanyId}
                                                                    handleChange={event =>
                                                                        this.handleChangeDropDRanking(event, "companyId", "selectedRankingCompanyId","")
                                                                    }
                                                                    index="company" />
                                                            </div>
                                                            <div className="linebylineInput fullInputWidth">
                                                                <label className="control-label">{Resources.quantity[currentLanguage]}</label>
                                                                <div className="shareLinks">
                                                                    <div className={"inputDev ui input"} >
                                                                        <input type="number" className="form-control" id="quantity"
                                                                            onChange={e => this.handleChangeRanking(e, "qty")}
                                                                            value={values.qty}
                                                                            name="quantity" placeholder={Resources.quantity[currentLanguage]}
                                                                        />
                                                                    </div>

                                                                </div>
                                                            </div>
                                                            <div className="linebylineInput fullInputWidth">
                                                                <label className="control-label">{Resources.advancedPayment[currentLanguage]}</label>
                                                                <div className="shareLinks">
                                                                    <div className={"inputDev ui input"} >
                                                                        <input type="number" className="form-control" id="advPayment"
                                                                            onChange={e => this.handleChangeRanking(e, "advPayment")}
                                                                            value={values.advPayment}
                                                                            name="advPayment" placeholder={Resources.advancedPayment[currentLanguage]}
                                                                        />
                                                                    </div>

                                                                </div>
                                                            </div>

                                                            <div className="linebylineInput fullInputWidth">
                                                                <label className="control-label">{Resources.firstPrice[currentLanguage]}</label>
                                                                <div className="shareLinks">
                                                                    <div className={"inputDev ui input"} >
                                                                        <input type="number" className="form-control" id="firstPrice"
                                                                            onChange={e => this.handleChangeRanking(e, "firstPrice")}
                                                                            value={values.firstPrice}
                                                                            name="firstPrice" placeholder={Resources.firstPrice[currentLanguage]}
                                                                        />
                                                                    </div>

                                                                </div>
                                                            </div>

                                                            <div className="linebylineInput fullInputWidth">
                                                                <label className="control-label">{Resources.finalPrice[currentLanguage]}</label>
                                                                <div className="shareLinks">
                                                                    <div className={"inputDev ui input"} >
                                                                        <input type="number" className="form-control" id="finalPrice"
                                                                            onChange={e => this.handleChangeRanking(e, "finalPrice")}
                                                                            value={values.finalPrice}
                                                                            name="finalPrice" placeholder={Resources.finalPrice[currentLanguage]}
                                                                        />
                                                                    </div>

                                                                </div>
                                                            </div>



                                                            <div className="linebylineInput fullInputWidth">
                                                                <label className="control-label">{Resources.duration[currentLanguage]}</label>
                                                                <div className="shareLinks">
                                                                    <div className={"inputDev ui input"} >
                                                                        <input type="number" className="form-control" id="duration"
                                                                            onChange={e => this.handleChangeRanking(e, "duration")}
                                                                            value={values.duration}
                                                                            name="duration" placeholder={Resources.duration[currentLanguage]}
                                                                        />
                                                                    </div>

                                                                </div>
                                                            </div>

                                                            <div className="linebylineInput fullInputWidth">
                                                                <label className="control-label">{Resources.Notes[currentLanguage]}</label>
                                                                <div className="shareLinks">
                                                                    <div className={"inputDev ui input"} >
                                                                        <input type="text" className="form-control" id="notes"
                                                                            onChange={e => this.handleChangeRanking(e, "notes")}
                                                                            value={values.notes}
                                                                            name="Notes" placeholder={Resources.Notes[currentLanguage]}
                                                                        />
                                                                    </div>

                                                                </div>
                                                            </div>

                                                            <div className="linebylineInput valid-input alternativeDate">
                                                                <DatePicker title='docDate'
                                                                    startDate={values.docDate}
                                                                    handleChange={e => this.handleChangeRankingDate(e, 'docDate')} />
                                                            </div>

                                                        </div>
                                                        <div className="slider-Btns">
                                                            {
                                                                this.state.isLoading && this.props.changeStatus === false ?
                                                                    <button className="primaryBtn-1 btn disabled">
                                                                        <div className="spinner">
                                                                            <div className="bounce1" />
                                                                            <div className="bounce2" />
                                                                            <div className="bounce3" />
                                                                        </div>
                                                                    </button> :
                                                                    this.showBtnsSaving()
                                                            }
                                                        </div>
                                                    </Form>)}
                                            </Formik>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </div>

                        {
                            this.props.changeStatus === true ?
                                <div className="approveDocument">
                                    <div className="approveDocumentBTNS">

                                        <DocumentActions
                                            isApproveMode={this.state.isApproveMode}
                                            docTypeId={this.state.docTypeId}
                                            docId={this.state.docId}
                                            projectId={this.state.projectId}
                                            previousRoute={this.state.perviousRoute}
                                            docApprovalId={this.state.docApprovalId}
                                            currentArrange={this.state.arrange}
                                            showModal={this.props.showModal}
                                            showOptionPanel={this.showOptionPanel}
                                            permission={this.state.permission}
                                            documentName={Resources.contractROA[currentLanguage]}
                                        />
                                    </div>
                                </div> : null
                        }
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
        file: state.communication.file,
        files: state.communication.files,
        hasWorkflow: state.communication.hasWorkflow,
        items: state.communication.items,
        projectId: state.communication.projectId,
        showModal: state.communication.showModal
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ContractROaAddEdit));
