import React, { Component, Fragment } from "react";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import dataservice from "../../Dataservice";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import UploadAttachment from '../../Componants/OptionsPanels/UploadAttachment'
import ViewAttachment from '../../Componants/OptionsPanels/ViewAttachmments'
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import Resources from "../../resources.json";
import ReactTable from "react-table";
import { withRouter } from "react-router-dom";
import TextEditor from '../../Componants/OptionsPanels/TextEditor'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as communicationActions from '../../store/actions/communication';
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument'
import Config from "../../Services/Config.js";
import CryptoJS from 'crypto-js';
import moment from "moment";
import DocumentActions from '../../Componants/OptionsPanels/DocumentActions';
import DatePicker from '../../Componants/OptionsPanels/DatePicker'
import { toast } from "react-toastify";
import AddDocAttachment from "../../Componants/publicComponants/AddDocAttachment";
import Steps from "../../Componants/publicComponants/Steps";
import CompanyDropdown from '../../Componants/publicComponants/CompanyDropdown'
import ContactDropdown from '../../Componants/publicComponants/ContactDropdown'

import find from "lodash/find";

var steps_defination = [];

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const validationSchema = Yup.object().shape({
    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),
    fromContactId: Yup.string().required(Resources['fromContactRequired'][currentLanguage]).nullable(true),
    toContactId: Yup.string().required(Resources['toContactRequired'][currentLanguage]),
    bicContactId: Yup.string().required(Resources['actionByContactRequired'][currentLanguage]),
    disciplineId: Yup.string().required(Resources['disciplineRequired'][currentLanguage])
})

const documentCycleValidationSchema = Yup.object().shape({
    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]).nullable(true),
    approvalStatusId: Yup.string().required(Resources['approvalStatusSelection'][currentLanguage]).nullable(true),
})

let columns = [
    {
        Header: 'arrange',
        accessor: 'arrange',
        width: 60
    }, {
        Header: Resources['subject'][currentLanguage],
        accessor: 'subject',
        width: 350
    }, {
        Header: Resources['statusName'][currentLanguage],
        accessor: 'statusName',
        width: 120
    }, {
        Header: Resources['CompanyName'][currentLanguage],
        accessor: 'flowCompanyName',
        width: 180
    }, {
        Header: Resources['ContactName'][currentLanguage],
        accessor: 'flowContactName',
        width: 180
    }, {
        Header: Resources['docDate'][currentLanguage],
        accessor: 'docDate',
        format: 'date',
        width: 150,
        Cell: row => (
            <span>
                <span>{moment(row.value).format("DD/MM/YYYY")}</span>
            </span>
        )
    }, {
        Header: Resources['approvalStatus'][currentLanguage],
        accessor: 'approvalStatusName',
        width: 120
    }, {
        Header: Resources['progressPercent'][currentLanguage],
        accessor: 'progressPercent',
        width: 120
    }, {
        Header: Resources['comment'][currentLanguage],
        accessor: 'cycleComment',
        width: 120
    }
]

let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = false;
let docApprovalId = 0;
let perviousRoute = '';
let arrange = 0;
class inspectionRequestAddEdit extends Component {

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
            isViewMode: false,
            isApproveMode: isApproveMode,
            perviousRoute: perviousRoute,
            isView: false,
            docId: docId,
            docTypeId: 25,
            projectId: projectId,
            docApprovalId: docApprovalId,
            arrange: arrange,
            document: this.props.document ? Object.assign({}, this.props.document) : {},
            documentCycle: {},
            companies: [],
            ToContacts: [],
            fromContacts: [],
            approvalstatusList: [],
            discplines: [],
            letters: [],
            permission: [{ name: 'sendByEmail', code: 372 }, { name: 'sendByInbox', code: 371 },
            { name: 'sendTask', code: 1 }, { name: 'distributionList', code: 959 },
            { name: 'createTransmittal', code: 3045 }, { name: 'sendToWorkFlow', code: 710 },
            { name: 'viewAttachments', code: 3312 }, { name: 'deleteAttachments', code: 850 }],
            selectedFromCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
            selectedToCompany: { label: Resources.toCompanyRequired[currentLanguage], value: "0" },
            selectedFromContact: { label: Resources.fromContactRequired[currentLanguage], value: "0" },
            selectedToContact: { label: Resources.toContactRequired[currentLanguage], value: "0" },
            selectedDiscpline: { label: Resources.disciplineRequired[currentLanguage], value: "0" },
            selectedActionByContactId: { label: Resources.actionByContact[currentLanguage], value: "0" },
            selectedActionByCompanyId: { label: Resources.actionByCompany[currentLanguage], value: "0" },
            selectedContract: { label: Resources.contractPoSelection[currentLanguage], value: "0" },
            selectedApprovalStatusId: { label: Resources.approvalStatus[currentLanguage], value: "0" },
            bicContacts: [],
            contractsPos: [],
            reasonForIssues: [],
            areas: [],
            buildings: [],
            IRCycles: [],
            answer: '',
            rfi: '',
            CurrentStep: 0,
            CycleEditLoading: false,
            CycleAddLoading: false,
            DocLoading: false,
            isEdit: docId === 0 ? false : true
        }

        if (!Config.IsAllow(366) && !Config.IsAllow(367) && !Config.IsAllow(369)) {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push(
                this.state.perviousRoute
            );
        }
        this.newCycle = this.newCycle.bind(this);
        this.editCycle = this.editCycle.bind(this);
        steps_defination = [
            {
                name: "inspectionRequest",
                callBackFn: null
            },
            {
                name: "newCycle",
                callBackFn: null
            }
        ];
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
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.document.id !== this.props.document.id) {
            let serverInspectionRequest = { ...nextProps.document };
            serverInspectionRequest.docDate = serverInspectionRequest.docDate === null ? moment().format('YYYY-MM-DD') : moment(serverInspectionRequest.docDate).format('YYYY-MM-DD')
            serverInspectionRequest.requiredDate = serverInspectionRequest.requiredDate === null ? moment().format('YYYY-MM-DD') : moment(serverInspectionRequest.requiredDate).format('YYYY-MM-DD')
            serverInspectionRequest.resultDate = serverInspectionRequest.resultDate === null ? moment().format('YYYY-MM-DD') : moment(serverInspectionRequest.resultDate).format('YYYY-MM-DD')

            this.setState({
                document: { ...serverInspectionRequest },
                hasWorkflow: nextProps.hasWorkflow,
                answer: nextProps.document.answer,
                rfi: nextProps.document.rfi
            });

            this.fillDropDowns(nextProps.document.id > 0 ? true : false);
            this.checkDocumentIsView();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.hasWorkflow !== prevProps.hasWorkflow || this.props.changeStatus !== prevProps.changeStatus) {
            this.checkDocumentIsView();
        }
    }

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!Config.IsAllow(367)) {
                this.setState({ isViewMode: true });
            }

            if (this.state.isApproveMode != true && Config.IsAllow(367)) {
                if (this.props.hasWorkflow == false && Config.IsAllow(367)) {
                    //close => false
                    if (this.props.document.status !== false && Config.IsAllow(367)) {
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
            this.props.actions.documentForEdit("GetInspectionRequestForEdit?id=" + this.state.docId, this.state.docTypeId, 'inspectionRequest');

            dataservice.GetDataGrid("GetInspectionRequestCycles?inspectionId=" + this.state.docId).then(result => {
                this.setState({
                    IRCycles: [...result]
                });
                let data = { items: result };
                this.props.actions.ExportingData(data);
            });

            dataservice.GetDataGrid("GetInspectionRequestLastCycle?id=" + this.state.docId).then(result => {
                this.setState({
                    documentCycle: { ...result }
                });
            });

        } else {
            let inspectionRequest = {
                subject: '',
                id: 0,
                projectId: this.state.projectId,
                arrange: '',
                fromCompanyId: '',
                fromContactId: '',
                toCompanyId: '',
                toContactId: '',
                replayId: '',
                docDate: moment(),
                status: 'true ',
                disciplineId: '',
                refDoc: '',
                sharedSettings: '',
                answer: '',
                rfi: '',
                orderId: null,
                orderType: null,
                bicCompanyId: '',
                bicContactId: '',
                fileNumberId: '',
                areaId: '',
                buildingNoId: '',
                apartmentNoId: '',
                specsSectionId: '',
                contractId: '',
                requiredDate: moment(),
                resultDate: moment(),
                reasonForIssueId: ''
            };

            this.setState({ document: inspectionRequest }, function () {
                this.GetNExtArrange();
            });
            this.fillDropDowns(false);
            this.props.actions.documentForAdding();
        }
    }

    GetNExtArrange() {
        let original_document = { ...this.state.document };
        let updated_document = {};
        let url = "GetNextArrangeMainDoc?projectId=" + this.state.projectId + "&docType=" + this.state.docTypeId + "&companyId=" + this.state.document.fromCompanyId + "&contactId=" + this.state.document.fromContactId;
        // this.props.actions.GetNextArrange(url);
        dataservice.GetNextArrangeMainDocument(url).then(res => {
            updated_document.arrange = res;
            updated_document = Object.assign(original_document, updated_document);

            this.setState({
                document: updated_document
            });
        })
    }

    fillSubDropDownInEdit(url, param, value, subField, subSelectedValue, subDatasource) {
        let action = url + "?" + param + "=" + value
        dataservice.GetDataList(action, 'contactName', 'id').then(result => {
            if (this.props.changeStatus === true) {
                let toSubField = this.state.document[subField];
                let targetFieldSelected = find(result, function (i) { return i.value == toSubField; });
                this.setState({
                    [subSelectedValue]: targetFieldSelected,
                    [subDatasource]: result
                });
            }
        });
    }

    fillDropDowns(isEdit) {

        dataservice.GetDataListCached("GetProjectProjectsCompaniesForList?projectId=" + this.state.projectId, 'companyName', 'companyId', 'companies', this.state.projectId, "projectId").then(result => {

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

                let bicCompanyId = this.props.document.bicCompanyId;
                if (bicCompanyId) {
                    this.setState({
                        selectedActionByCompanyId: { label: this.props.document.bicCompanyName, value: bicCompanyId }
                    });

                    this.fillSubDropDownInEdit('GetContactsByCompanyId', 'companyId', bicCompanyId, 'bicContactId', 'selectedActionByContactId', 'bicContacts');
                }
            }
            this.setState({
                companies: [...result]
            });
        });

        dataservice.GetDataListCached("GetaccountsDefaultListForList?listType=discipline", 'title', 'id', 'defaultLists', "discipline", "listType").then(result => {
            if (isEdit) {
                let disciplineId = this.props.document.disciplineId;
                let discpline = {};
                if (disciplineId) {
                    discpline = find(result, function (i) { return i.value == disciplineId; });

                    this.setState({
                        selectedDiscpline: discpline
                    });
                }
            }
            this.setState({
                discplines: [...result]
            });
        });

        dataservice.GetDataListCached("GetaccountsDefaultListForList?listType=approvalstatus", 'title', 'id', 'defaultLists', "approvalstatus", "listType").then(result => {
            if (isEdit) {
                let approvalStatusId = this.state.documentCycle.approvalStatusId;
                let approvalStatus = {};
                if (approvalStatusId) {
                    approvalStatus = find(result, function (i) { return i.value == approvalStatusId; });

                    this.setState({
                        selectedApprovalStatusId: approvalStatus
                    });
                }
            }
            this.setState({
                approvalstatusList: [...result]
            });
        });

        dataservice.GetDataListCached("GetaccountsDefaultListForList?listType=area", 'title', 'id', 'defaultLists', "area", "listType").then(result => {
            if (isEdit) {
                let areaId = this.props.document.areaId;
                let area = {};
                if (areaId) {
                    area = find(result, function (i) { return i.value == areaId; });

                    this.setState({
                        selecetedArea: area
                    });
                }
            }
            this.setState({
                areas: [...result]
            });
        });

        dataservice.GetDataListCached("GetaccountsDefaultListForList?listType=buildingno", 'title', 'id', 'defaultLists', "buildingno", "listType").then(result => {
            if (isEdit) {
                let buildingno = this.props.document.buildingNoId;
                let building = {};
                if (buildingno) {
                    building = find(result, function (i) { return i.value == buildingno; });
                    this.setState({
                        selectedbuildingno: building
                    });
                }
            }
            this.setState({
                buildings: [...result]
            });
        });

        dataservice.GetDataListCached("GetaccountsDefaultListForList?listType=reasonforissue", 'title', 'id', 'defaultLists', "reasonforissue", "listType").then(result => {
            if (isEdit) {
                let reasonForIssueId = this.props.document.reasonForIssueId;
                let reasonForIssue = {};
                if (reasonForIssueId) {
                    reasonForIssue = find(result, function (i) { return i.value == reasonForIssueId; });
                    this.setState({
                        selectedReasonForIssue: reasonForIssue
                    });
                }
            }
            this.setState({
                reasonForIssues: [...result]
            });
        });

        dataservice.GetDataListCached("GetaccountsDefaultListForList?listType=apartmentNumber", 'title', 'id', 'defaultLists', "apartmentNumber", "listType").then(result => {
            if (isEdit) {
                let apartmentNoId = this.props.document.apartmentNoId;
                let apartmentNo = {};
                if (apartmentNoId) {
                    apartmentNo = find(result, function (i) { return i.value == apartmentNoId; });
                    this.setState({
                        selectedApartmentNoId: apartmentNo
                    });
                }
            }
            this.setState({
                apartmentNumbers: [...result]
            });
        });

        if (isEdit === false) {
            dataservice.GetDataList("GetPoContractForList?projectId=" + this.state.projectId, 'subject', 'id').then(result => {
                this.setState({
                    contractsPos: [...result]
                });
            });
        }

    }

    componentWillUnmount() {
        this.props.actions.clearCashDocument();
        this.setState({
            docId: 0
        });
    }

    onChangeAnswer = (value) => {
        if (value != null) {
            this.setState({ answer: value });
            let original_document = { ...this.state.document };
            let updated_document = {};
            updated_document['answer'] = value;
            updated_document = Object.assign(original_document, updated_document);
            this.setState({
                document: updated_document
            });
        }
    }

    onChangeRfi = (value) => {
        if (value != null) {
            this.setState({ rfi: value });
            let original_document = { ...this.state.document };
            let updated_document = {};
            updated_document['rfi'] = value;
            updated_document = Object.assign(original_document, updated_document);
            this.setState({
                document: updated_document
            });
        }
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
            let action = url + "?" + param + "=" + event.value
            dataservice.GetDataList(action, 'contactName', 'id').then(result => {
                this.setState({
                    [targetState]: result
                });
            });
        }
    }

    editInspectionRequest(event) {
        this.setState({
            isLoading: true,
            DocLoading: true
        });

        let saveDocument = this.state.document;
        saveDocument.docDate = moment(saveDocument.docDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
        saveDocument.requiredDate = moment(saveDocument.requiredDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
        saveDocument.resultDate = moment(saveDocument.resultDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');

        dataservice.addObject('EditInspectionRequestOnly', saveDocument).then(result => {
            this.setState({
                isLoading: true,
                DocLoading: false
            });
            this.changeCurrentStep(1);
            toast.success(Resources["operationSuccess"][currentLanguage]);
        });
    }

    saveInspectionRequest(event) {
        let saveDocument = { ...this.state.document };
        this.setState({
            DocLoading: true
        });

        saveDocument.docDate = moment(saveDocument.docDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
        saveDocument.requiredDate = moment(saveDocument.requiredDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
        saveDocument.resultDate = moment(saveDocument.resultDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
        saveDocument.projectId = this.state.projectId;
        if (saveDocument.contractId == "")
            saveDocument.contractId = null;
        dataservice.addObject('AddInspectionRequestOnly', saveDocument).then(result => {
            if (result.id) {
                let cycle = {
                    requestForInspectionId: result.id,
                    subject: this.state.document.subject,
                    docDate: this.state.document.docDate,
                    progressPercent: 0,
                    status: 'false',
                    approvalStatusId: null,
                    cycleComment: '',
                    arrange: 1
                };
                this.setState({
                    docId: result.id,
                    documentCycle: cycle,
                    DocLoading: false
                });

                toast.success(Resources["operationSuccess"][currentLanguage]);
            }
        }).catch(res => {
            this.setState({
                DocLoading: false
            });
            toast.error(Resources["operationCanceled"][currentLanguage]);
        });
    }

    showBtnsSaving() {
        let btn = null;
        if (this.state.docId === 0) {
            btn = <button className="primaryBtn-1 btn meduimBtn" type="submit" >{Resources.save[currentLanguage]}</button>;
        } else if (this.state.docId > 0) {
            btn = <button className={this.state.isViewMode === true ? "primaryBtn-1 btn meduimBtn disNone" : "primaryBtn-1 btn meduimBtn"} type='submit'>{Resources.next[currentLanguage]}</button>
        }
        return btn;
    }

    viewAttachments() {
        return (
            this.state.docId > 0 ? (
                Config.IsAllow(3312) === true ?
                    <ViewAttachment isApproveMode={this.state.isViewMode} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} deleteAttachments={850} />
                    : null)
                : null
        )
    }

    changeCurrentStep = stepNo => {
        this.setState({ CurrentStep: stepNo });
    };


    saveInspectionRequestCycle(values) {
        let saveDocument = { ...this.state.documentCycle };

        saveDocument.projectId = this.state.projectId;
        saveDocument.requestForInspectionId = this.state.docId;
        saveDocument.disciplineId = this.state.document.disciplineId;
        saveDocument.flowCompanyId = this.state.document.bicCompanyId;
        saveDocument.flowContactId = this.state.document.bicContactId;
        saveDocument.cycleStatus = saveDocument.status == null ? true : saveDocument.status;
        saveDocument.subject = values.subject;

        let api = saveDocument.typeAddOrEdit === "Edit" ? 'EditInspectionRequestCycle' : 'AddInspectionRequestCycleOnly';

        if (saveDocument.typeAddOrEdit === "Edit") {
            this.setState({ CycleEditLoading: true })
        } else {
            this.setState({ CycleAddLoading: true })
        }

        dataservice.addObject(api, saveDocument).then(result => {

            if (result) {
                let cycle = {
                    subject: result.subject,
                    docDate: result.docDate,
                    progressPercent: result.progressPercent,
                    status: result.cycleStatus,
                    requestForInspectionId: this.state.docId,
                    approvalStatusId: result.approvalStatusId,
                    cycleComment: result.cycleComment,
                    arrange: 0,
                    id: result.id
                };

                let IRCycles = this.state.IRCycles;

                if (saveDocument.typeAddOrEdit === "Edit") {
                    let index = IRCycles.findIndex(x => x.id === saveDocument.id);

                    IRCycles.splice(index, 1);
                    if (this.props.changeStatus === false ) {
                        IRCycles = [];
                        IRCycles.push(result);
                    } else {
                        IRCycles.push(result);
                    }
                } else {
                    IRCycles.push(result);
                }

                this.setState({
                    IRCycles,
                    documentCycle: cycle,
                    CycleEditLoading: false,
                    CycleAddLoading: false,
                });
                toast.success(Resources["operationSuccess"][currentLanguage]);
                if (this.props.changeStatus == false)
                    this.props.history.push(this.state.perviousRoute)
            }
        }).catch(res => {
            this.setState({
                CycleEditLoading: false,
                CycleAddLoading: false,
            });
            toast.error(Resources["operationCanceled"][currentLanguage]);
        });
    }

    handleChangeCycle(e, field) {

        let original_document = { ...this.state.documentCycle };

        let updated_document = {};

        updated_document[field] = e.target.value;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            documentCycle: updated_document
        });
    }

    handleChangeCycleDropDown(event, field, selectedValue) {
        if (event == null) return;
        let original_document = { ...this.state.documentCycle };
        let updated_document = {};
        updated_document[field] = event.value;
        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            documentCycle: updated_document,
            [selectedValue]: event
        });
    }

    newCycle(e) {

        let cycleObj = { ...this.state.documentCycle };
        cycleObj.typeAddOrEdit = "Add";
        this.setState({
            documentCycle: { ...cycleObj }
        });
    }

    editCycle(e) {

        let cycleObj = { ...this.state.documentCycle };
        cycleObj.typeAddOrEdit = "Edit";
        this.setState({
            documentCycle: { ...cycleObj }
        });
    }

    AddNewCycle() {
        return (
            <Fragment>
                <Formik
                    initialValues={{ ...this.state.documentCycle }}
                    validationSchema={documentCycleValidationSchema}
                    enableReinitialize={true}
                    onSubmit={(values) => {
                        this.saveInspectionRequestCycle(values)
                    }}>
                    {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                        <Form id="InspectionRequestCycleForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>
                            <header className="main__header">
                                <div className="main__header--div">
                                    <h2 className="zero">{Resources['newCycle'][currentLanguage]}</h2>
                                </div>
                            </header>
                            <div className='document-fields'>
                                <div className="proForm first-proform">
                                    <div className="linebylineInput valid-input">
                                        <label className="control-label">{Resources.subject[currentLanguage]}</label>
                                        <div className={"inputDev ui input" + (errors.subject && touched.subject ? (" has-error") : !errors.subject && touched.subject ? (" has-success") : " ")} >
                                            <input name='subject'
                                                id="subject"
                                                className="form-control fsadfsadsa"
                                                placeholder={Resources.subject[currentLanguage]}
                                                autoComplete='off'
                                                defaultValue={this.state.documentCycle.subject + (this.props.changeStatus ? "" : "   cycle of (" + this.state.documentCycle.arrange + ')')}
                                                onBlur={(e) => {
                                                    handleBlur(e)
                                                    handleChange(e)
                                                }}
                                                onChange={(e) => this.handleChangeCycle(e, 'subject')} />
                                            {touched.subject ? (<em className="pError">{errors.subject}</em>) : null}
                                        </div>
                                    </div>
                                    <div className="linebylineInput valid-input">
                                        <label className="control-label">{Resources.status[currentLanguage]}</label>
                                        <div className="ui checkbox radio radioBoxBlue">
                                            <input type="radio" name="IR-cycle-status" defaultChecked={this.state.documentCycle.cycleStatus === false ? null : 'checked'} value="true" onChange={e => this.handleChangeCycle(e, 'status')} />
                                            <label>{Resources.oppened[currentLanguage]}</label>
                                        </div>
                                        <div className="ui checkbox radio radioBoxBlue">
                                            <input type="radio" name="IR-cycle-status" defaultChecked={this.state.documentCycle.cycleStatus === false ? 'checked' : null} value="false" onChange={e => this.handleChangeCycle(e, 'status')} />
                                            <label>{Resources.closed[currentLanguage]}</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="proForm datepickerContainer">
                                    <div className="linebylineInput valid-input">
                                        <Dropdown title="approvalStatus"
                                            isMulti={false}
                                            data={this.state.approvalstatusList}
                                            selectedValue={this.state.selectedApprovalStatusId}
                                            handleChange={(e) => this.handleChangeCycleDropDown(e, "approvalStatusId", 'selectedApprovalStatusId')}
                                            onChange={setFieldValue}
                                            onBlur={setFieldTouched}
                                            error={errors.approvalStatusId}
                                            touched={touched.approvalStatusId}
                                            isClear={false}
                                            index="IR-approvalStatusId"
                                            name="approvalStatusId"
                                            id="approvalStatusId" />
                                    </div>
                                    <div className="linebylineInput valid-input">
                                        <label className="control-label">{Resources['comment'][currentLanguage]}</label>
                                        <div className='ui input inputDev '>
                                            <input autoComplete="off"
                                                value={this.state.documentCycle.cycleComment}
                                                className="form-control" name="comment"
                                                onBlur={(e) => { handleBlur(e) }}
                                                onChange={(e) => { this.handleChangeCycle(e, 'cycleComment') }}
                                                placeholder={Resources['comment'][currentLanguage]} />
                                        </div>
                                    </div>
                                    <div className="linebylineInput valid-input">
                                        <label className="control-label">{Resources['progressPercent'][currentLanguage]}</label>
                                        <div className='ui input inputDev '>
                                            <input autoComplete="off"
                                                value={this.state.documentCycle.progressPercent}
                                                className="form-control" name="progressPercent"
                                                onBlur={(e) => { handleBlur(e) }}
                                                onChange={(e) => { this.handleChangeCycle(e, 'progressPercent') }}
                                                placeholder={Resources['progressPercent'][currentLanguage]} />
                                        </div>
                                    </div>
                                </div>
                                {this.props.changeStatus == false ?
                                    <button className="primaryBtn-1 btn meduimBtn" type='submit' onClick={this.newCycle}>{Resources['saveAndExit'][currentLanguage]}</button>
                                    :
                                    <div className="slider-Btns">
                                        {this.state.CycleEditLoading ?
                                            <button className="primaryBtn-1 btn disabled">
                                                <div className="spinner">
                                                    <div className="bounce1" />
                                                    <div className="bounce2" />
                                                    <div className="bounce3" />
                                                </div>
                                            </button>
                                            : <button className={this.state.isViewMode === true ? "primaryBtn-1 btn meduimBtn disNone" : "primaryBtn-1 btn meduimBtn"} type='submit' onClick={this.editCycle}>{Resources['editCycle'][currentLanguage]}</button>}
                                        {this.state.CycleAddLoading ?
                                            <button className="primaryBtn-1 btn disabled">
                                                <div className="spinner">
                                                    <div className="bounce1" />
                                                    <div className="bounce2" />
                                                    <div className="bounce3" />
                                                </div>
                                            </button>
                                            : <button className={this.state.isViewMode === true ? "primaryBtn-1 btn meduimBtn disNone" : "primaryBtn-1 btn meduimBtn"} type='submit' onClick={this.newCycle}>{Resources['newCycle'][currentLanguage]}</button>}
                                    </div>
                                }
                            </div>
                        </Form>
                    )}
                </Formik>
            </Fragment>
        )
    }

    showOptionPanel = () => {
        this.props.actions.showOptionPanel(true);
    }

    render() {

        return (
            <div className="mainContainer">
                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document one__tab one_step readOnly_inputs" : "documents-stepper noTabs__document one__tab one_step"}>
                    <HeaderDocument projectName={projectName} isViewMode={this.state.isViewMode} perviousRoute={this.state.perviousRoute}
                        docTitle={Resources.inspectionRequest[currentLanguage]} moduleTitle={Resources['qualityControl'][currentLanguage]} />
                    <div className="doc-container">
                        <div className="step-content">
                            {this.state.CurrentStep == 0 ?
                                <Fragment>
                                    <div id="step1" className="step-content-body">
                                        <div className="subiTabsContent">
                                            <div className="document-fields">
                                                <Formik
                                                    initialValues={{ ...this.state.document }}
                                                    validationSchema={validationSchema}
                                                    enableReinitialize={this.props.changeStatus}
                                                    onSubmit={(values) => {
                                                        if (this.props.showModal) { return; }

                                                        if (this.props.changeStatus === false && this.state.docId === 0) {
                                                            this.saveInspectionRequest();
                                                        } else if (this.props.changeStatus == true) {
                                                            this.editInspectionRequest();
                                                        }
                                                        else if (this.props.changeStatus === false && this.state.docId > 0)
                                                            this.changeCurrentStep(1);
                                                    }}>

                                                    {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                                                        <Form id="InspectionRequestForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>
                                                            <div className="proForm first-proform">
                                                                <div className="linebylineInput valid-input">
                                                                    <label className="control-label">{Resources.subject[currentLanguage]}</label>
                                                                    <div className={"inputDev ui input" + (errors.subject && touched.subject ? (" has-error") : !errors.subject && touched.subject ? (" has-success") : " ")} >
                                                                        <input name='subject' className="form-control fsadfsadsa" id="subject"
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
                                                                <div className="linebylineInput valid-input alternativeDate">
                                                                    <DatePicker title='docDate'
                                                                        onChange={e => setFieldValue('docDate', e)}
                                                                        onBlur={setFieldTouched}
                                                                        error={errors.docDate}
                                                                        touched={touched.docDate}
                                                                        name="docDate"
                                                                        startDate={this.state.document.docDate}
                                                                        handleChange={e => this.handleChangeDate(e, 'docDate')} />
                                                                </div>
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
                                                                <div className="linebylineInput valid-input">
                                                                    <label className="control-label">{Resources.refDoc[currentLanguage]}</label>
                                                                    <div className="ui input inputDev">
                                                                        <input type="text" className="form-control" id="refDoc"
                                                                            value={this.state.document.refDoc}
                                                                            name="refDoc"
                                                                            placeholder={Resources.refDoc[currentLanguage]}
                                                                            onBlur={(e) => {
                                                                                handleChange(e)
                                                                                handleBlur(e)
                                                                            }}
                                                                            onChange={(e) => this.handleChange(e, 'refDoc')} />
                                                                    </div>
                                                                </div>
                                                                <div className="linebylineInput valid-input alternativeDate">
                                                                    <DatePicker title='requiredDateLog'
                                                                        onChange={e => setFieldValue('requiredDate', e)}
                                                                        onBlur={setFieldTouched}
                                                                        error={errors.requiredDate}
                                                                        touched={touched.requiredDate}
                                                                        name="requiredDate"
                                                                        startDate={this.state.document.requiredDate}
                                                                        handleChange={e => this.handleChangeDate(e, 'requiredDate')} />
                                                                </div>
                                                                <div className="linebylineInput valid-input alternativeDate">
                                                                    <DatePicker title='resultDate'
                                                                        onChange={e => setFieldValue('resultDate', e)}
                                                                        onBlur={setFieldTouched}
                                                                        error={errors.resultDate}
                                                                        touched={touched.resultDate}
                                                                        name="resultDate"
                                                                        startDate={this.state.document.resultDate}
                                                                        handleChange={e => this.handleChangeDate(e, 'resultDate')} />
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
                                                                                    this.handleChangeDropDown(event, 'fromCompanyId', true, 'fromContacts', 'GetContactsByCompanyId', 'companyId', 'selectedFromCompany', 'selectedFromContact')
                                                                                }}
                                                                                onChange={setFieldValue}
                                                                                onBlur={setFieldTouched}
                                                                                error={errors.fromCompanyId}
                                                                                touched={touched.fromCompanyId}
                                                                                index="fromCompanyId"
                                                                                name="fromCompanyId"
                                                                                id="fromCompanyId" styles={CompanyDropdown} classDrop="companyName1 " />
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
                                                                                id="fromContactId" classDrop=" contactName1" styles={ContactDropdown} />
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
                                                                                    this.handleChangeDropDown(event, 'toCompanyId', true, 'ToContacts', 'GetContactsByCompanyId', 'companyId', 'selectedToCompany', 'selectedToContact')}
                                                                                onChange={setFieldValue}
                                                                                onBlur={setFieldTouched}
                                                                                error={errors.toCompanyId}
                                                                                touched={touched.toCompanyId}
                                                                                name="toCompanyId" styles={CompanyDropdown} classDrop="companyName1 " />
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
                                                                                classDrop=" contactName1" styles={ContactDropdown}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="linebylineInput valid-input mix_dropdown">
                                                                    <label className="control-label">{Resources.actionByCompany[currentLanguage]}</label>
                                                                    <div className="supervisor__company">
                                                                        <div className="super_name">
                                                                            <Dropdown
                                                                                isMulti={false}
                                                                                data={this.state.companies}
                                                                                selectedValue={this.state.selectedActionByCompanyId}
                                                                                handleChange={event =>
                                                                                    this.handleChangeDropDown(event, 'bicCompanyId', true, 'bicContacts', 'GetContactsByCompanyId', 'companyId', 'selectedActionByCompanyId', 'selectedActionByContactId')}
                                                                                name="bicCompanyId" styles={CompanyDropdown} classDrop="companyName1 " />
                                                                        </div>
                                                                        <div className="super_company">
                                                                            <Dropdown
                                                                                isMulti={false}
                                                                                data={this.state.bicContacts}
                                                                                selectedValue={this.state.selectedActionByContactId}
                                                                                handleChange={event => this.handleChangeDropDown(event, 'bicContactId', false, '', '', '', 'selectedActionByContactId')}
                                                                                onChange={setFieldValue}
                                                                                onBlur={setFieldTouched}
                                                                                error={errors.bicContactId}
                                                                                touched={touched.bicContactId}
                                                                                isClear={false}
                                                                                index="IR-bicContactId"
                                                                                name="bicContactId"
                                                                                id="bicContactId" classDrop=" contactName1" styles={ContactDropdown} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {this.props.changeStatus === false ?
                                                                    <div className="linebylineInput valid-input">
                                                                        <Dropdown
                                                                            title="contractPo"
                                                                            data={this.state.contractsPos}
                                                                            selectedValue={this.state.selectedContract}
                                                                            handleChange={event => this.handleChangeDropDown(event, 'contractId', false, '', '', '', 'selectedContract')}
                                                                            index="contractId" />
                                                                    </div> :
                                                                    <div className="linebylineInput valid-input fullInputWidth">
                                                                        <label className="control-label">{Resources.contractPo[currentLanguage]}</label>
                                                                        <div className="ui input inputDev">
                                                                            <input type="text" className="form-control" id="contractId"
                                                                                value={this.state.document.orderSubject}
                                                                                name="contractId" />
                                                                        </div>
                                                                    </div>
                                                                }
                                                                <div className="linebylineInput valid-input">
                                                                    <Dropdown
                                                                        title="discipline"
                                                                        isMulti={false}
                                                                        data={this.state.discplines}
                                                                        selectedValue={this.state.selectedDiscpline}
                                                                        handleChange={event => this.handleChangeDropDown(event, 'disciplineId', false, '', '', '', 'selectedDiscpline')}
                                                                        onChange={setFieldValue}
                                                                        onBlur={setFieldTouched}
                                                                        error={errors.disciplineId}
                                                                        touched={touched.disciplineId}
                                                                        isClear={false}
                                                                        index="IR-disciplineId"
                                                                        name="disciplineId"
                                                                        id="disciplineId" />
                                                                </div>
                                                                <div className="linebylineInput valid-input">
                                                                    <Dropdown
                                                                        title="reasonForIssue"
                                                                        data={this.state.reasonForIssues}
                                                                        selectedValue={this.state.selectedReasonForIssue}
                                                                        handleChange={event => this.handleChangeDropDown(event, 'reasonForIssueId', false, '', '', '', 'selectedReasonForIssue')}
                                                                        index="reasonForIssue" />
                                                                </div>
                                                                <div className="linebylineInput valid-input">
                                                                    <Dropdown
                                                                        title="areaName"
                                                                        data={this.state.areas}
                                                                        selectedValue={this.state.selecetedArea}
                                                                        handleChange={event => this.handleChangeDropDown(event, 'areaId', false, '', '', '', 'selecetedArea')}
                                                                        index="areaId" />
                                                                </div>
                                                                <div className="linebylineInput valid-input">
                                                                    <Dropdown
                                                                        title="Buildings"
                                                                        data={this.state.buildings}
                                                                        selectedValue={this.state.selectedbuildingno}
                                                                        handleChange={event => this.handleChangeDropDown(event, 'buildingNoId', false, '', '', '', 'selectedbuildingno')}
                                                                        index="buildingNoId" />
                                                                </div>
                                                                <div className="linebylineInput valid-input">
                                                                    <Dropdown
                                                                        title="apartmentNumber"
                                                                        data={this.state.apartmentNumbers}
                                                                        selectedValue={this.state.selectedApartmentNoId}
                                                                        handleChange={event => this.handleChangeDropDown(event, 'apartmentNoId', false, '', '', '', 'selectedApartmentNoId')}
                                                                        index="apartmentNoId" />
                                                                </div>
                                                                <div className="letterFullWidth">
                                                                    <label className="control-label">{Resources.message[currentLanguage]}</label>
                                                                    <div className="inputDev ui input">
                                                                        <TextEditor
                                                                            value={this.state.rfi}
                                                                            onChange={this.onChangeRfi} />
                                                                    </div>
                                                                </div>
                                                                <div className="letterFullWidth">
                                                                    <label className="control-label">{Resources.replyMessage[currentLanguage]}</label>
                                                                    <div className="inputDev ui input">
                                                                        <div className="inputDev ui input">
                                                                            <TextEditor
                                                                                value={this.state.answer}
                                                                                onChange={this.onChangeAnswer} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="doc-pre-cycle letterFullWidth">
                                                                <div>
                                                                    {this.state.docId > 0 && this.state.isViewMode === false ? (<UploadAttachment changeStatus={this.props.changeStatus} AddAttachments={849}
                                                                        EditAttachments={3267} ShowDropBox={3593} ShowGoogleDrive={3594}
                                                                        docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />) : null}
                                                                    {this.viewAttachments()}
                                                                    <div className="document-fields tableBTnabs">
                                                                        {this.state.docId > 0 ? <AddDocAttachment projectId={projectId} isViewMode={this.state.isViewMode} docTypeId={this.state.docTypeId} docId={this.state.docId} changeStatus={this.props.changeStatus} /> : null}
                                                                    </div>
                                                                    {this.props.changeStatus === true ? (<ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />) : null}
                                                                </div>
                                                            </div>
                                                            {this.props.changeStatus === true ?
                                                                <Fragment>
                                                                    <div className="slider-Btns">
                                                                        {this.state.isViewMode === false ?
                                                                            <div className="doc-pre-cycle">
                                                                                <div className="slider-Btns">
                                                                                    {this.state.DocLoading ?
                                                                                        <button className="primaryBtn-1 btn disabled">
                                                                                            <div className="spinner">
                                                                                                <div className="bounce1" />
                                                                                                <div className="bounce2" />
                                                                                                <div className="bounce3" />
                                                                                            </div>
                                                                                        </button> :
                                                                                        <button className="primaryBtn-1 btn meduimBtn" >{Resources['next'][currentLanguage]}</button>
                                                                                    }
                                                                                </div>
                                                                            </div> : null}
                                                                    </div>
                                                                    <div className="approveDocument">
                                                                        <div className="approveDocumentBTNS">
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
                                                                                documentName={Resources.inspectionRequest[currentLanguage]}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </Fragment>
                                                                :
                                                                <div className="slider-Btns">
                                                                    {this.state.DocLoading ?
                                                                        <button className="primaryBtn-1 btn disabled">
                                                                            <div className="spinner">
                                                                                <div className="bounce1" />
                                                                                <div className="bounce2" />
                                                                                <div className="bounce3" />
                                                                            </div>
                                                                        </button> :
                                                                        this.showBtnsSaving()}
                                                                </div>
                                                            }
                                                        </Form>
                                                    )}
                                                </Formik>
                                            </div>
                                        </div>
                                    </div>
                                </Fragment>
                                :
                                <div className="subiTabsContent feilds__top">
                                    {this.AddNewCycle()}
                                    <div className="doc-pre-cycle">
                                        <header>
                                            <h2 className="zero">{Resources['cyclesCount'][currentLanguage]}</h2>
                                        </header>
                                        {this.state.CycleEditLoading === false && this.state.CycleAddLoading === false ?
                                            <ReactTable ref={(r) => { this.selectTable = r; }} data={this.state.IRCycles}
                                                columns={columns} defaultPageSize={5} noDataText={Resources['noData'][currentLanguage]} /> : null}
                                    </div>
                                </div>
                            }
                        </div>
                        <Steps steps_defination={steps_defination} exist_link="/inspectionRequest/" docId={this.state.docId}
                            changeCurrentStep={stepNo => this.changeCurrentStep(stepNo)}
                            stepNo={this.state.CurrentStep}
                            changeStatus={docId === 0 ? false : true} />
                    </div>
                </div>
            </div>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(inspectionRequestAddEdit))