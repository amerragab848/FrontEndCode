import React, { Component, Fragment } from "react";

import OptionContainer from "../../Componants/OptionsPanels/OptionContainer";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import dataservice from "../../Dataservice";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import UploadAttachment from '../../Componants/OptionsPanels/UploadAttachment'
import ViewAttachment from '../../Componants/OptionsPanels/ViewAttachmments'
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import Resources from "../../resources.json";
import Api from '../../api';
import { withRouter } from "react-router-dom";

import TextEditor from '../../Componants/OptionsPanels/TextEditor'

import { connect } from 'react-redux';
import {
    bindActionCreators
} from 'redux';
import * as communicationActions from '../../store/actions/communication';
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument'
import Config from "../../Services/Config.js";
import CryptoJS from 'crypto-js';
import moment from "moment";
import SkyLight, { SkyLightStateless } from 'react-skylight';
import DocumentActions from '../../Componants/OptionsPanels/DocumentActions';
import DatePicker from '../../Componants/OptionsPanels/DatePicker'
import { toast } from "react-toastify";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";

import CompanyDropdown from '../../Componants/publicComponants/CompanyDropdown'
import ContactDropdown from '../../Componants/publicComponants/ContactDropdown'

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let perviousRoute = '';
let arrange = 0;
const _ = require('lodash')

const validationSchema = Yup.object().shape({

    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),

    toContactId: Yup.string().required(Resources['selectContact'][currentLanguage])
        .nullable(true),

    bicContactId: Yup.string()
        .required(Resources['toContactRequired'][currentLanguage]),

    contractId: Yup.string()
        .required(Resources['contractPoSelection'][currentLanguage]),

    disciplineId: Yup.string()
        .required(Resources['disciplineRequired'][currentLanguage])
})

const validationSchemaForAddCycle = Yup.object().shape({

    Subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),

    ApprovalStatusCycle: Yup.string()
        .required(Resources['approvalStatusSelection'][currentLanguage]),

    Progress: Yup.number()
        .required(Resources['isRequiredField'][currentLanguage])
        .typeError(Resources['onlyNumbers'][currentLanguage]),
})

class NCRAddEdit extends Component {

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
            isLoading: false,
            isViewMode: false,
            isApproveMode: isApproveMode,
            perviousRoute: perviousRoute,
            isView: false,
            docId: docId,
            docTypeId: 101,
            projectId: projectId,
            docApprovalId: docApprovalId,
            arrange: arrange,
            document: this.props.document ? Object.assign({}, this.props.document) : {},
            companies: [],
            ToContacts: [],
            fromContacts: [],
            approvalstatusList: [],
            discplines: [],
            letters: [],
            permission: [{ name: 'sendByEmail', code: 923 }, { name: 'sendByInbox', code: 922 },
            { name: 'sendTask', code: 1 }, { name: 'distributionList', code: 970 },
            { name: 'createTransmittal', code: 3056 }, { name: 'sendToWorkFlow', code: 926 },
            { name: 'viewAttachments', code: 3308 }, { name: 'deleteAttachments', code: 927 }],
            selectedFromCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
            selectedToCompany: { label: Resources.toCompanyRequired[currentLanguage], value: "0" },
            selectedFromContact: { label: Resources.fromContactRequired[currentLanguage], value: "0" },
            selectedToContact: { label: Resources.toContactRequired[currentLanguage], value: "0" },
            selectedDiscpline: { label: Resources.disciplineRequired[currentLanguage], value: "0" },
            selectedActionByContactId: { label: Resources.actionByContact[currentLanguage], value: "0" },
            selectedActionByCompanyId: { label: Resources.actionByCompany[currentLanguage], value: "0" },
            selectedContract: { label: Resources.contractPoSelection[currentLanguage], value: "0" },
            selectedApprovalStatusId: { label: Resources.approvalStatusSelection[currentLanguage], value: "0" },
            selectedSpecsSectionId: { label: Resources.specsSectionSelection[currentLanguage], value: "0" },
            selectedReviewResult: { label: Resources.selectResult[currentLanguage], value: "0" },
            selectedInspectionRequestId: { label: Resources.inspectionRequest[currentLanguage], value: "0" },
            selectedFileNumberId: { label: Resources.selectFileNumber[currentLanguage], value: "0" },
            selectedReasonForIssue: { label: Resources.SelectReasonForIssueId[currentLanguage], value: "0" },
            selecetedArea: { label: Resources.selectArea[currentLanguage], value: "0" },
            selectedbuildingno: { label: Resources.buildingNumberSelection[currentLanguage], value: "0" },
            selectedApartmentNoId: { label: Resources.apartmentNumberSelection[currentLanguage], value: "0" },
            bicContacts: [],
            contractsPos: [],
            reasonForIssues: [],
            areas: [],
            buildings: [],
            answer: '',
            rfi: '',
            specificationSectionList: [],
            reviewResultList: [],
            activityIRList: [],
            fileNumberList: [],
            apartmentNumbersList: [],
            GetMaxArrange: 1,
            IsEditMode: false,
            NCRCycle: [],
            NCRCycleDocDate: moment(),
            showPopUp: false,
            Status: true,
            SelectedApprovalStatusCycle: '',
            IsAddModel: false,
            Loading: true
        }

        if (!Config.IsAllow(917) && !Config.IsAllow(918) && !Config.IsAllow(920)) {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push(
                this.state.perviousRoute
            );
        }

    }

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!(Config.IsAllow(918))) {
                this.setState({ isViewMode: true });
            }
            if (this.state.isApproveMode != true && Config.IsAllow(918)) {
                if (this.props.hasWorkflow == false && Config.IsAllow(918)) {
                    if (this.props.document.status !== false && Config.IsAllow(918)) {
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

    componentWillReceiveProps(nextProps) {
        if (nextProps.document.id) {
            let NCRDoc = nextProps.document
            NCRDoc.docDate = NCRDoc.docDate === null ? moment().format('YYYY-MM-DD') : moment(NCRDoc.docDate).format('YYYY-MM-DD')
            NCRDoc.requiredDate = NCRDoc.requiredDate === null ? moment().format('YYYY-MM-DD') : moment(NCRDoc.requiredDate).format('YYYY-MM-DD')
            NCRDoc.resultDate = NCRDoc.resultDate === null ? moment().format('YYYY-MM-DD') : moment(NCRDoc.resultDate).format('YYYY-MM-DD')

            this.setState({
                document: NCRDoc,
                hasWorkflow: nextProps.hasWorkflow,
                answer: nextProps.document.answer
            });

            this.checkDocumentIsView();
        }
    }

    componentWillMount() {
        if (docId > 0) {
            let url = "GetCommunicationNCRsForEdit?id=" + this.state.docId
            this.props.actions.documentForEdit(url, this.state.docTypeId, 'NCRLog');
            this.setState({
                IsEditMode: true
            })

            Api.get('GetCommunicationNCRCyclessByParentId?projectId=' + docId + '').then(
                res => {
                    this.setState({
                        NCRCycle: res
                    })
                    this.FillDropDowns()
                }
            )

        } else {
            ///Is Add Mode 
            let cmi = Config.getPayload().cmi
            let cni = Config.getPayload().cni
            Api.get('GetNextArrangeMainDoc?projectId=' + projectId + '&docType=101&companyId=' + cmi + '&contactId=' + cni + '').then(
                res => {
                    let NCRDoc = {
                        id: undefined,
                        projectId: projectId,
                        arrange: res,
                        docDate: moment(),
                        status: true,
                        requiredDate: moment(),
                        resultDate: moment(),
                        fromCompanyId: '',
                        toCompanyId: '',
                        fromContactId: '',
                        toContactId: '',
                        reviewResultId: '',
                        bicCompanyId: '',
                        bicContactId: '',
                        inspectionRequestId: '',
                        fileNumberId: '',
                        disciplineId: '',
                        revisions: '',
                        areaId: '',
                        reasonForIssueId: '',
                        buildingNumberId: '',
                        apartmentNumberId: '',
                        specsSectionId: '',
                        orderId: '',
                        orderType: '',
                        contractId: '',
                        subject: '',
                        progressPercent: '',
                        approvalStatusId: '',
                        rfi: '',
                        refDoc: '',
                        answer: '',
                    }
                    this.setState({
                        document: NCRDoc
                    })
                    this.FillDropDowns()
                }
            )
        }

    }

    componentDidMount = () => {

    }

    componentWillUnmount() {
        this.props.actions.clearCashDocument();
        this.setState({
            docId: 0
        });
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.hasWorkflow !== prevProps.hasWorkflow) {
            this.checkDocumentIsView();
        }
    }

    FillDropDowns = () => {
        let DropDownsData = [
            { Api: 'GetAccountsDefaultList?listType=approvalstatus&pageNumber=0&pageSize=10000', DropDataName: 'approvalstatusList', Label: 'title', Value: 'id', Name: 'approvalStatusId', selectedValue: 'selectedApprovalStatusId' },
            { Api: 'GetAccountsDefaultList?listType=discipline&pageNumber=0&pageSize=10000', DropDataName: 'discplines', Label: 'title', Value: 'id', Name: 'disciplineId', selectedValue: 'selectedDiscpline' },
            { Api: 'GetAccountsDefaultList?listType=specssection&pageNumber=0&pageSize=10000', DropDataName: 'specificationSectionList', Label: 'title', Value: 'id', Name: 'specsSectionId', selectedValue: 'selectedSpecsSectionId' },
            { Api: 'GetAccountsDefaultList?listType=reviewresult&pageNumber=0&pageSize=10000', DropDataName: 'reviewResultList', Label: 'title', Value: 'id', Name: 'reviewResultId', selectedValue: 'selectedReviewResult' },
            { Api: 'GetInspectionRequest?projectId=' + projectId + '', DropDataName: 'activityIRList', Label: 'subject', Value: 'id', Name: 'inspectionRequestId', selectedValue: 'selectedInspectionRequestId' },
            { Api: 'GetAccountsDefaultList?listType=reasonforissue&pageNumber=0&pageSize=10000', DropDataName: 'reasonForIssues', Label: 'title', Value: 'id', Name: 'reasonForIssueId', selectedValue: 'selectedReasonForIssue' },
            { Api: 'GetAccountsDefaultList?listType=drawingfilenumber&pageNumber=0&pageSize=10000', DropDataName: 'fileNumberList', Label: 'title', Value: 'id', Name: 'fileNumberId', selectedValue: 'selectedFileNumberId' },
            { Api: 'GetAccountsDefaultList?listType=area&pageNumber=0&pageSize=10000', DropDataName: 'areas', Label: 'title', Value: 'id', Name: 'areaId', selectedValue: 'selecetedArea' },
            { Api: 'GetAccountsDefaultList?listType=buildingno&pageNumber=0&pageSize=10000', DropDataName: 'buildings', Label: 'title', Value: 'id', Name: 'buildingNumberId', selectedValue: 'selectedbuildingno' },
            { Api: 'GetAccountsDefaultList?listType=apartmentno&pageNumber=0&pageSize=10000', DropDataName: 'apartmentNumbers', Label: 'title', Value: 'id', Name: 'apartmentNumberId', selectedValue: 'selectedApartmentNoId' },
            { Api: 'GetProjectProjectsCompaniesForList?projectId=' + projectId + '', DropDataName: 'companies', Label: 'companyName', Value: 'companyId', Name: 'toCompanyId', selectedValue: 'selectedFromCompany' },
            { Api: 'GetPoContractForList?projectId=' + projectId + '', DropDataName: 'contractsPos', Label: 'subject', Value: 'id', Name: 'contractId', selectedValue: 'selectedContract' },
        ]
        let CompaniesDropDownsData = [
            { Name: 'fromCompanyId', SelectedValueCompany: 'selectedFromCompany', ContactName: 'fromContactId', DropDataContactName: 'fromContacts', SelectedValueContact: 'selectedFromContact' },
            { Name: 'toCompanyId', SelectedValueCompany: 'selectedToCompany', ContactName: 'toContactId', DropDataContactName: 'toContacts', SelectedValueContact: 'selectedToContact' },
            { Name: 'bicCompanyId', SelectedValueCompany: 'selectedActionByCompanyId', ContactName: 'bicContactId', DropDataContactName: 'bicContacts', SelectedValueContact: 'selectedActionByContactId' },
        ]
        DropDownsData.map(element => {
            return dataservice.GetDataList(element.Api, element.Label, element.Value).then(
                result => {
                    this.setState({
                        [element.DropDataName]: result,
                    })

                    if (docId > 0) {

                        if (element.DropDataName === 'companies') {
                            CompaniesDropDownsData.map(company => {
                                let elementID = this.state.document[company.Name];
                                let SelectedValue = _.find(result, function (i) { return i.value == elementID; });
                                this.setState({
                                    [company.SelectedValueCompany]: SelectedValue,
                                })

                                dataservice.GetDataList('GetContactsByCompanyId?companyId=' + elementID + '', 'contactName', 'id').then(
                                    res => {
                                        let ContactId = this.state.document[company.ContactName];
                                        let SelectedValueContact = _.find(res, function (i) { return i.value == ContactId; });
                                        this.setState({
                                            [company.DropDataContactName]: res,
                                            [company.SelectedValueContact]: SelectedValueContact,
                                            Loading: false
                                        })
                                    }
                                )
                            })
                        }

                        else {
                            let elementID = this.state.document[element.Name];
                            let SelectedValue = _.find(result, function (i) { return i.value == elementID; });
                            this.setState({
                                [element.selectedValue]: SelectedValue,

                            });
                        }

                    }
                    else {
                        this.setState({
                            Loading: false
                        })

                    }
                }
            )
        })
    }

    onChangeMessage = (value) => {
        if (value != null) {
            let original_document = { ...this.state.document };

            let updated_document = {};
            updated_document.answer = value;
            updated_document = Object.assign(original_document, updated_document);

            this.setState({
                document: updated_document,
                answer: value
            });
        }
    };

    handleChange(e, field) {
        console.log(field, e);
        let original_document = { ...this.state.document };

        let updated_document = {};

        updated_document[field] = e.target.value;

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

        if (field == "fromContactId") {
            let url = "GetNextArrangeMainDoc?projectId=" + this.state.projectId + "&docType=" + this.state.docTypeId + "&companyId=" + this.state.document.fromCompanyId + "&contactId=" + event.value;
            // this.props.actions.GetNextArrange(url);
            dataservice.GetNextArrangeMainDocument(url).then(res => {
                updated_document.arrange = res;
                updated_document = Object.assign(original_document, updated_document);

                this.setState({
                    document: updated_document
                });
            })
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

    saveAndExit = () => {
        this.props.history.push({
            pathname: '/Ncr/' + projectId + '',
        })
    }

    showBtnsSaving() {
        let btn = <button
            className={this.props.changeStatus == false ? 'primaryBtn-1 btn meduimBtn ' : ' primaryBtn-1 btn meduimBtn  disNone'}
            type="submit">
            {this.state.docId > 0 && this.props.changeStatus === false ? Resources.saveAndExit[currentLanguage] :
                Resources.save[currentLanguage]}
        </button>


        return btn;
    }

    handleChangeDate(e, field) {
        console.log(field, e);
        let original_document = { ...this.state.document };

        let updated_document = {};

        updated_document[field] = e;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            document: updated_document
        });
    }

    saveNCR = () => {

        if (this.state.IsAddModel) {
            this.saveAndExit()
        }
        else {
            this.setState({ isLoading: true })

            let saveDocument = this.state.document;
            saveDocument.docDate = moment(saveDocument.docDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
            saveDocument.requiredDate = moment(saveDocument.requiredDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
            saveDocument.resultDate = moment(saveDocument.resultDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');

            if (this.state.docId > 0) {
                dataservice.addObject('EditCommunicationNCRs', saveDocument).then(
                    res => {
                        this.setState({
                            isLoading: false,
                        })
                        toast.success(Resources["operationSuccess"][currentLanguage]);

                        this.saveAndExit();

                    }).catch(ex => {
                        this.setState({
                            isLoading: false
                        })
                        toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
                    });
            }
            else {
                dataservice.addObject('AddCommunicationNCRs', saveDocument).then(
                    res => {
                        this.setState({
                            docId: res.id,
                            isLoading: false,
                            IsAddModel: true
                        })
                        toast.success(Resources["operationSuccess"][currentLanguage]);
                    }).catch(ex => {
                        this.setState({
                            isLoading: false
                        })
                        toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
                    });
            }
        }
    }

    viewAttachments() {
        return (
            this.state.docId !== 0 ? (
                Config.IsAllow(3308) === true ?
                    <ViewAttachment isApproveMode={this.state.isViewMode} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} deleteAttachments={840} />
                    : null)
                : null
        )
    }

    handleChangeDrops = (SelectedItem, Name) => {
        switch (Name) {
            case 'SelectedApprovalStatusCycle':
                this.setState({ SelectedApprovalStatusCycle: SelectedItem })
                break;
            case 'NCRCycleDocDate':
                this.setState({ NCRCycleDocDate: SelectedItem })
                break;
            default:
                break;
        }
    }

    SaveNewCycle = (values) => {
        this.setState({ isLoading: true })
        let Date = moment(this.state.NCRCycleDocDate, 'DD-MM-YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS')
        let SaveObj = {
            id: undefined, NCRId: docId, arrange: values.ArrangeNCRCycle,
            progressPercent: values.Progress, subject: values.Subject, flowCompanyId: undefined,
            flowContactId: undefined, approvalStatusId: values.ApprovalStatusCycle.value,
            status: this.state.Status, docDate: Date, cycleComment: values.Comment
        }
        dataservice.addObject('AddCommunicationNCRCycless', SaveObj).then(
            res => {
                this.setState({
                    NCRCycle: res,
                    showPopUp: false,
                    isLoading: false
                })
                toast.success(Resources["operationSuccess"][currentLanguage]);
            }).catch(ex => {
                this.setState({
                    isLoading: false
                })
                toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
            });
    }

    showOptionPanel = () => {
        this.props.actions.showOptionPanel(true);
    }

    
    render() {

        let AddNewCycle = () => {
            return (
                <Formik
                    initialValues={{
                        Subject: '',
                        ArrangeNCRCycle: this.state.NCRCycle.length ? Math.max.apply(Math, this.state.NCRCycle.map(function (o) { return o.arrange + 1 })) : 1,
                        ApprovalStatusCycle: '',
                        Progress: '',
                        Comment: '',
                    }}

                    enableReinitialize={true}

                    validationSchema={validationSchemaForAddCycle}

                    onSubmit={(values, actions) => {
                        console.log(values)
                        this.SaveNewCycle(values, actions)
                    }}>

                    {({ errors, touched, handleBlur, handleChange, values, handleSubmit, setFieldTouched, setFieldValue }) => (
                        <Form onSubmit={handleSubmit}>


                            <div className="documents-stepper noTabs__document">
                                <div className="doc-container">
                                    <div className="step-content">
                                        <div className='document-fields'>
                                            <div className="proForm datepickerContainer">
                                                <div className="proForm first-proform fullWidthWrapper textLeft">



                                                    <div className={'ui input inputDev linebylineInput ' + (errors.Subject && touched.Subject ? 'has-error' : null) + ' '}>
                                                        <label className="control-label">{Resources['subject'][currentLanguage]}</label>
                                                        <div className="inputDev ui input">
                                                            <input autoComplete="off" className="form-control" name="Subject"
                                                                value={values.Subject}
                                                                onBlur={(e) => { handleBlur(e) }}
                                                                onChange={(e) => {
                                                                    handleChange(e)
                                                                    if (this.state.IsEditMode) {
                                                                        this.setState({ ExpensesWorkFlowDataForEdit: { ...this.state.ExpensesWorkFlowDataForEdit, subject: e.target.value } })
                                                                    }
                                                                }}
                                                                placeholder={Resources['subject'][currentLanguage]} />
                                                            {errors.Subject && touched.Subject ? (<em className="pError">{errors.Subject}</em>) : null}
                                                        </div>
                                                    </div>

                                                    <div className="linebylineInput valid-input">
                                                        <label className="control-label"> {Resources['status'][currentLanguage]} </label>
                                                        <div className="ui checkbox radio radioBoxBlue checked">
                                                            <input type="radio"
                                                                defaultChecked={this.state.Status ? 'checked' : null}
                                                                name="Status" value="true" onChange={(e) => this.setState({ Status: e.target.value })} />
                                                            <label>{Resources['oppened'][currentLanguage]}</label>
                                                        </div>
                                                        <div className="ui checkbox radio radioBoxBlue ">
                                                            <input type="radio" name="Status" value="false"
                                                                defaultChecked={this.state.Status ? null : 'checked'}
                                                                onChange={(e) => this.setState({ Status: e.target.value })} />
                                                            <label> {Resources['closed'][currentLanguage]}</label>
                                                        </div>

                                                    </div>


                                                </div>

                                                <div className="linebylineInput valid-input">
                                                    <div className="inputDev ui input">
                                                        <DatePicker title='docDate'
                                                            handleChange={(e) => this.handleChangeDrops(e, "NCRCycleDocDate")}
                                                            startDate={this.state.NCRCycleDocDate}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="linebylineInput valid-input">
                                                    <label className="control-label">{Resources['numberAbb'][currentLanguage]}</label>
                                                    <div className="inputDev ui input">
                                                        <input autoComplete="off" className="form-control"
                                                            onChange={(e) => {
                                                                handleChange(e)
                                                            }} value={values.ArrangeNCRCycle} name="ArrangeNCRCycle" placeholder={Resources['numberAbb'][currentLanguage]} />
                                                    </div>
                                                </div>

                                                <div className={'ui input inputDev ' + (errors.Progress && touched.Progress ? 'has-error' : null) + ' '}>
                                                    <label className="control-label">{Resources['progressPercent'][currentLanguage]}</label>
                                                    <div className="inputDev ui input">
                                                        <input autoComplete="off" className="form-control" name="Progress"
                                                            value={values.Progress}
                                                            onBlur={(e) => { handleBlur(e) }}
                                                            onChange={(e) => { handleChange(e) }}
                                                            placeholder={Resources['progressPercent'][currentLanguage]} />
                                                        {errors.Progress && touched.Progress ? (<em className="pError">{errors.Progress}</em>) : null}
                                                    </div>
                                                </div>

                                                <div className="linebylineInput valid-input">
                                                    <div className="inputDev ui input">
                                                        <Dropdown title="approvalStatusName" data={this.state.approvalstatusList} name="ApprovalStatusCycle"
                                                            selectedValue={values.ApprovalStatusCycle}
                                                            onChange={setFieldValue}
                                                            handleChange={(e) => this.handleChangeDrops(e, "SelectedApprovalStatusCycle")}

                                                            onBlur={setFieldTouched}
                                                            error={errors.ApprovalStatusCycle}
                                                            touched={touched.ApprovalStatusCycle}
                                                            value={values.ApprovalStatusCycle} />
                                                    </div>
                                                </div>

                                                <div className="linebylineInput valid-input">
                                                    <label className="control-label">{Resources['comment'][currentLanguage]}</label>
                                                    <div className="inputDev ui input">
                                                        <input autoComplete="off" className="form-control"
                                                            onChange={(e) => {
                                                                handleChange(e)
                                                            }} value={values.Comment} name="Comment" placeholder={Resources['comment'][currentLanguage]} />
                                                    </div>
                                                </div>

                                            </div>

                                            <div className="slider-Btns">
                                                <button className="primaryBtn-1 btn meduimBtn" type='submit' >{Resources['addTitle'][currentLanguage]}</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            )
        }

        let RenderNCRCycleTable = this.state.NCRCycle.map((item) => {
            let DateFormat = moment(item.docDate).format('DD-MM-YYYY')
            return (
                <tr key={item.id}>
                    <td>{item.arrange}</td>
                    <td>{item.subject}</td>
                    <td>{item.statusName}</td>
                    <td>{item.flowCompanyName}</td>
                    <td>{item.flowContactName}</td>
                    <td>{DateFormat}</td>
                    <td>{item.approvalStatusName}</td>
                    <td>{item.progressPercent}</td>
                </tr>
            )
        })

        return (
            <div className="mainContainer">
                {this.state.Loading ? <LoadingSection /> : null}
                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document one__tab one_step readOnly_inputs" : "documents-stepper noTabs__document one__tab one_step"}>

                    <HeaderDocument projectName={projectName} isViewMode={this.state.isViewMode} perviousRoute={this.state.perviousRoute} docTitle={Resources.NCRLog[currentLanguage]}
                        moduleTitle={Resources['qualityControl'][currentLanguage]} />

                    <div className="doc-container">
                        <div className="step-content">
                            <div className="subiTabsContent">
                                <div className="document-fields">
                                    <Formik
                                        initialValues={{ ...this.state.document }}
                                        validationSchema={validationSchema}
                                        enableReinitialize={true}
                                        onSubmit={(values) => {
                                            if (this.props.showModal) { return; }

                                            this.saveNCR();
                                        }}  >

                                        {({ errors, touched, handleBlur, values, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                                            <Form id="InspectionRequestForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>

                                                <div className="proForm first-proform">

                                                    <div className="linebylineInput valid-input">
                                                        <label className="control-label">{Resources.subject[currentLanguage]}</label>
                                                        <div className={"inputDev ui input" + (errors.subject && touched.subject ? (" has-error") : !errors.subject && touched.subject ? (" has-success") : " ")} >
                                                            <input name='subject' className="form-control fsadfsadsa" id="subject"
                                                                placeholder={Resources.subject[currentLanguage]} autoComplete='off'
                                                                value={this.state.document.subject}
                                                                onChange={(e) => this.handleChange(e, 'subject')}
                                                                onBlur={(e) => {
                                                                    handleBlur(e)
                                                                    handleChange(e)
                                                                }}
                                                            />
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

                                                    <div className="linebylineInput valid-input alternativeDate">
                                                        <DatePicker title='docDate' startDate={this.state.document.docDate}
                                                            handleChange={e => this.handleChangeDate(e, 'docDate')} />
                                                    </div>

                                                    <div className="linebylineInput valid-input">
                                                        <label className="control-label">{Resources.arrange[currentLanguage]}</label>
                                                        <div className="ui input inputDev"  >
                                                            <input type="text" className="form-control" id="arrange" readOnly
                                                                value={this.state.document.arrange} name="arrange"
                                                                placeholder={Resources.arrange[currentLanguage]}
                                                                onBlur={(e) => {
                                                                    handleChange(e)
                                                                    handleBlur(e)
                                                                }}
                                                                onChange={(e) => this.handleChange(e, 'arrange')} />
                                                        </div>
                                                    </div>

                                                    <div className="linebylineInput valid-input">
                                                        <label className="control-label">{Resources.refDoc[currentLanguage]}</label>
                                                        <div className={"ui input inputDev" + (errors.refDoc && touched.refDoc ? (" has-error") : "ui input inputDev")} >
                                                            <input type="text" className="form-control" id="refDoc"
                                                                value={this.state.document.refDoc}
                                                                name="refDoc"
                                                                placeholder={Resources.refDoc[currentLanguage]}
                                                                onBlur={(e) => {
                                                                    handleChange(e)
                                                                    handleBlur(e)
                                                                }}
                                                                onChange={(e) => this.handleChange(e, 'refDoc')} />
                                                            {touched.refDoc ? (<em className="pError">{errors.refDoc}</em>) : null}

                                                        </div>
                                                    </div>

                                                    <div className="linebylineInput valid-input alternativeDate">
                                                        <DatePicker title='requiredDateLog' startDate={this.state.document.requiredDate}
                                                            handleChange={e => this.handleChangeDate(e, 'requiredDate')} />
                                                    </div>

                                                    <div className="linebylineInput valid-input alternativeDate">
                                                        <DatePicker title='resultDate' startDate={this.state.document.resultDate}
                                                            handleChange={e => this.handleChangeDate(e, 'resultDate')} />
                                                    </div>

                                                    <div className="linebylineInput valid-input mix_dropdown">
                                                        <label className="control-label">{Resources.fromCompany[currentLanguage]}</label>
                                                        <div className="supervisor__company">
                                                            <div className="super_name">
                                                                <Dropdown data={this.state.companies} name="fromCompanyId"
                                                                    selectedValue={this.state.selectedFromCompany}
                                                                    handleChange={event => {
                                                                        this.handleChangeDropDown(event, 'fromCompanyId', true, 'fromContacts', 'GetContactsByCompanyId', 'companyId', 'selectedFromCompany', 'selectedFromContact')
                                                                    }} styles={CompanyDropdown} classDrop="companyName1 " />
                                                            </div>

                                                            <div className="super_company">
                                                                <Dropdown data={this.state.fromContacts} name="fromContactId"
                                                                    selectedValue={this.state.selectedFromContact}
                                                                    handleChange={event => this.handleChangeDropDown(event, 'fromContactId', false, '', '', '', 'selectedFromContact')}
                                                                    classDrop=" contactName1" styles={ContactDropdown} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="linebylineInput valid-input mix_dropdown">
                                                        <label className="control-label">{Resources.toCompany[currentLanguage]}</label>
                                                        <div className="supervisor__company">
                                                            <div className="super_name">
                                                                <Dropdown data={this.state.companies} name="bicCompanyId"
                                                                    selectedValue={this.state.selectedActionByCompanyId}
                                                                    handleChange={event =>
                                                                        this.handleChangeDropDown(event, 'bicCompanyId', true, 'bicContacts', 'GetContactsByCompanyId', 'companyId', 'selectedActionByCompanyId', 'selectedActionByContactId')}
                                                                    styles={CompanyDropdown} classDrop="companyName1 " />
                                                            </div>
                                                            <div className="super_company">
                                                                <Dropdown data={this.state.bicContacts} onChange={setFieldValue} name="bicContactId"
                                                                    onBlur={setFieldTouched} error={errors.bicContactId} id="bicContactId"
                                                                    touched={touched.bicContactId} index="IR-bicContactId"
                                                                    selectedValue={this.state.selectedActionByContactId}
                                                                    handleChange={event => this.handleChangeDropDown(event, 'bicContactId', false, '', '', '', 'selectedActionByContactId')}
                                                                    classDrop=" contactName1" styles={ContactDropdown} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="linebylineInput valid-input mix_dropdown">
                                                        <label className="control-label">{Resources.actionByCompany[currentLanguage]}</label>
                                                        <div className="supervisor__company">
                                                            <div className="super_name">
                                                                <Dropdown data={this.state.companies} selectedValue={this.state.selectedToCompany}
                                                                    onChange={setFieldValue} onBlur={setFieldTouched} error={errors.toCompanyId}
                                                                    touched={touched.toCompanyId} name="toCompanyId"
                                                                    handleChange={event =>
                                                                        this.handleChangeDropDown(event, 'toCompanyId', true, 'ToContacts', 'GetContactsByCompanyId', 'companyId', 'selectedToCompany', 'selectedToContact')}
                                                                    styles={CompanyDropdown} classDrop="companyName1 " />
                                                            </div>

                                                            <div className="super_company">
                                                                <Dropdown data={this.state.ToContacts} selectedValue={this.state.selectedToContact}
                                                                    handleChange={event => this.handleChangeDropDown(event, 'toContactId', false, '', '', '', 'selectedToContact')}
                                                                    onChange={setFieldValue} onBlur={setFieldTouched}
                                                                    error={errors.toContactId} touched={touched.toContactId}
                                                                    index="IR-toContactId" name="toContactId" id="toContactId" classDrop=" contactName1" styles={ContactDropdown} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="linebylineInput valid-input">
                                                        <Dropdown data={this.state.contractsPos} selectedValue={this.state.selectedContract}
                                                            handleChange={event => this.handleChangeDropDown(event, 'contractId', false, '', '', '', 'selectedContract')}
                                                            onChange={setFieldValue} onBlur={setFieldTouched} title="contractPo"
                                                            error={errors.contractId} touched={touched.contractId}
                                                            index="IR-contractId" name="contractId" id="contractId" />
                                                    </div>

                                                    <div className="linebylineInput valid-input">
                                                        <Dropdown title="approvalStatus" data={this.state.approvalstatusList}
                                                            selectedValue={this.state.selectedApprovalStatusId} index="approvalStatusId"
                                                            handleChange={event => this.handleChangeDropDown(event, "approvalStatusId", false, '', '', '', 'selectedApprovalStatusId')}
                                                        />
                                                    </div>

                                                    <div className="linebylineInput valid-input">
                                                        <Dropdown title="discipline" data={this.state.discplines}
                                                            selectedValue={this.state.selectedDiscpline} touched={touched.disciplineId}
                                                            onChange={setFieldValue} onBlur={setFieldTouched} error={errors.disciplineId}
                                                            handleChange={event => this.handleChangeDropDown(event, 'disciplineId', false, '', '', '', 'selectedDiscpline')}
                                                            index="IR-disciplineId" name="disciplineId" id="disciplineId"
                                                        />
                                                    </div>


                                                    <div className="linebylineInput valid-input">
                                                        <Dropdown title="specsSection" name="specsSectionId"
                                                            data={this.state.specificationSectionList} selectedValue={this.state.selectedSpecsSectionId}
                                                            handleChange={event => this.handleChangeDropDown(event, 'specsSectionId', false, '', '', '', 'selectedSpecsSectionId')}
                                                        />
                                                    </div>

                                                    <div className="linebylineInput valid-input">
                                                        <Dropdown title="reviewResult" data={this.state.reviewResultList}
                                                            selectedValue={this.state.selectedReviewResult} index="reviewResultId"
                                                            handleChange={event => this.handleChangeDropDown(event, "reviewResultId", false, '', '', '', 'selectedReviewResult')}
                                                        />
                                                    </div>

                                                    <div className="linebylineInput valid-input">
                                                        <Dropdown title="inspectionRequest" data={this.state.activityIRList}
                                                            selectedValue={this.state.selectedInspectionRequestId} index="inspectionRequestId"
                                                            handleChange={event => this.handleChangeDropDown(event, "inspectionRequestId", false, '', '', '', 'selectedInspectionRequestId')}
                                                        />
                                                    </div>

                                                    <div className="linebylineInput valid-input">
                                                        <Dropdown
                                                            title="reasonForIssue"
                                                            data={this.state.reasonForIssues}
                                                            selectedValue={this.state.selectedReasonForIssue}
                                                            handleChange={event => this.handleChangeDropDown(event, 'reasonForIssueId', false, '', '', '', 'selectedReasonForIssue')}
                                                            index="reasonForIssueId" />
                                                    </div>

                                                    <div className="linebylineInput valid-input">
                                                        <Dropdown title="fileNumber" data={this.state.fileNumberList}
                                                            selectedValue={this.state.selectedFileNumberId} index="fileNumberId"
                                                            handleChange={event => this.handleChangeDropDown(event, 'fileNumberId', false, '', '', '', 'selectedFileNumberId')}
                                                        />
                                                    </div>

                                                    <div className="linebylineInput valid-input">
                                                        <Dropdown title="areaName" data={this.state.areas}
                                                            selectedValue={this.state.selecetedArea} index="areaId"
                                                            handleChange={event => this.handleChangeDropDown(event, 'areaId', false, '', '', '', 'selecetedArea')}
                                                        />
                                                    </div>

                                                    <div className="linebylineInput valid-input">
                                                        <label className="control-label">{Resources['revisionNo'][currentLanguage]}</label>
                                                        <div className="inputDev ui input">
                                                            <input autoComplete="off" className="form-control"
                                                                onChange={(e) => this.handleChange(e, 'revisions')}
                                                                value={this.state.document.revisions}
                                                                name="revisions" placeholder={Resources['revisionNo'][currentLanguage]} />
                                                        </div>
                                                    </div>

                                                    <div className="linebylineInput valid-input">
                                                        <Dropdown title="Building" data={this.state.buildings}
                                                            selectedValue={this.state.selectedbuildingno} index="buildingNumberId"
                                                            handleChange={event => this.handleChangeDropDown(event, 'buildingNumberId', false, '', '', '', 'selectedbuildingno')}
                                                        />
                                                    </div>

                                                    <div className="linebylineInput valid-input">
                                                        <Dropdown title="apartmentNumber" index="apartmentNumberId"
                                                            data={this.state.apartmentNumbers} selectedValue={this.state.selectedApartmentNoId}
                                                            handleChange={event => this.handleChangeDropDown(event, 'apartmentNumberId', false, '', '', '', 'selectedApartmentNoId')}
                                                        />
                                                    </div>

                                                    <div className="letterFullWidth">
                                                        <label className="control-label">{Resources.message[currentLanguage]}</label>
                                                        <div className="inputDev ui input">
                                                            <TextEditor value={this.state.answer}
                                                                onChange={this.onChangeMessage}
                                                            />
                                                        </div>
                                                    </div>

                                                </div>

                                                <div className="doc-pre-cycle letterFullWidth">
                                                    <div>
                                                        {this.state.docId > 0 && this.state.isViewMode === false ? (<UploadAttachment changeStatus={this.props.changeStatus} AddAttachments={927} EditAttachments={3263} ShowDropBox={3585} ShowGoogleDrive={3586} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />) : null}
                                                        {this.viewAttachments()}
                                                        {this.props.changeStatus === true ?
                                                            <ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                                            : null}
                                                    </div>
                                                </div>

                                                <div className="slider-Btns">
                                                    {this.state.isLoading ?
                                                        this.state.IsEditMode === false ?
                                                            <button className="primaryBtn-1 btn disabled">
                                                                <div className="spinner">
                                                                    <div className="bounce1" />
                                                                    <div className="bounce2" />
                                                                    <div className="bounce3" />
                                                                </div>
                                                            </button> : null
                                                        : this.showBtnsSaving()}
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                                </div>

                            </div>


                            {this.state.IsEditMode ?
                                <Fragment>
                                    <div className='document-fields'>
                                        <table className="ui table">
                                            <thead>
                                                <tr>
                                                    <th>{Resources.RfiNo[currentLanguage]}</th>
                                                    <th>{Resources.subject[currentLanguage]}</th>
                                                    <th>{Resources.status[currentLanguage]}</th>
                                                    <th>{Resources.CompanyName[currentLanguage]}</th>
                                                    <th>{Resources.ContactName[currentLanguage]}</th>
                                                    <th>{Resources.docDate[currentLanguage]}</th>
                                                    <th>{Resources.approvalStatus[currentLanguage]}</th>
                                                    <th>{Resources.progressPercent[currentLanguage]}</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {RenderNCRCycleTable}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="doc-pre-cycle">
                                        <div className="slider-Btns">
                                            <button className="primaryBtn-1 btn meduimBtn" onClick={() => this.setState({ showPopUp: true })} >{Resources.addNewCycle[currentLanguage]}</button>
                                        </div>
                                    </div>
                                </Fragment>
                                : null}
                        </div>

                        {this.state.IsEditMode ?
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
                                        <button className={this.state.isViewMode === true ? "primaryBtn-1 btn middle__btn disNone" : "primaryBtn-1 btn middle__btn"} onClick={this.saveNCR} type="submit">{Resources.save[currentLanguage]}</button>
                                    }
                                    <DocumentActions
                                        isApproveMode={this.state.isApproveMode}
                                        docTypeId={this.state.docTypeId}
                                        docId={this.state.docId}
                                        projectId={this.state.projectId}
                                        previousRoute={this.state.previousRoute}
                                        docApprovalId={this.state.docApprovalId}
                                        currentArrange={this.state.currentArrange}
                                        showModal={this.props.showModal}
                                        showOptionPanel={this.showOptionPanel}
                                        permission={this.state.permission}
                                    />
                                </div>
                            </div>
                            : null
                        }
                    </div>
                </div>
        
                <div className="skyLight__form">
                    <SkyLightStateless onOverlayClicked={() => this.setState({ showPopUp: false })}
                        title={Resources.addNewCycle[currentLanguage]}
                        onCloseClicked={() => this.setState({ showPopUp: false })} isVisible={this.state.showPopUp}>
                        {AddNewCycle()}
                    </SkyLightStateless>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(NCRAddEdit))