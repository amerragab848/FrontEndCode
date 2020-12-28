import React, { Component, Fragment } from "react";

import OptionContainer from "../../Componants/OptionsPanels/OptionContainer";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import ReactTable from "react-table";
import dataservice from "../../Dataservice";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import UploadAttachment from '../../Componants/OptionsPanels/UploadAttachment'
import ViewAttachment from '../../Componants/OptionsPanels/ViewAttachmments'
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import Resources from "../../resources.json";
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument'
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as communicationActions from '../../store/actions/communication';
import Config from "../../Services/Config.js";
import CryptoJS from 'crypto-js';
import moment from "moment";
import SkyLight, { SkyLightStateless } from 'react-skylight';
import DocumentActions from '../../Componants/OptionsPanels/DocumentActions';
import DatePicker from '../../Componants/OptionsPanels/DatePicker'
import { toast } from "react-toastify";
import CompanyDropdown from '../../Componants/publicComponants/CompanyDropdown'
import ContactDropdown from '../../Componants/publicComponants/ContactDropdown'
import Steps from "../../Componants/publicComponants/Steps";
import TextEditor from '../../Componants/OptionsPanels/TextEditor'
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
let permissions = localStorage.getItem('permissions');
const validationSchema = Yup.object().shape({
    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),
    bicContactId: Yup.string().required(Resources['fromContactRequired'][currentLanguage]),
    refNo: Yup.string().required(Resources['selectRefNo'][currentLanguage]),
    disciplineId: Yup.string().required(Resources['disciplineRequired'][currentLanguage]),
})

const validationSchemaNewCycle = Yup.object().shape({
    flowContactId: Yup.string().required(Resources['fromContactRequired'][currentLanguage]),
    approvalStatusId: Yup.string().required(Resources['approvalStatusSelection'][currentLanguage]),
})

var steps_defination = [];
let selectedRows = [];

let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let perviousRoute = '';
let arrange = 0;
let isModification = true;//edited
let havePermission = true;

const find = require('lodash/find')
class addEditModificationDrawing extends Component {

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
                    isModification = obj.isModification;
                }
                catch{
                    this.props.history.goBack();
                }
            }
            index++;
        }
        this.state = {
            CurrentStep: 0,
            isModification: isModification,
            isViewMode: false,
            isApproveMode: isApproveMode,
            perviousRoute: perviousRoute,
            isView: false,
            isLoading: false,
            docId: docId,
            docTypeId: isModification === true ? 114 : 37,
            projectId: projectId,
            docApprovalId: docApprovalId,
            arrange: arrange,
            document: this.props.document ? Object.assign({}, this.props.document) : {},
            companies: [],
            discplines: [],
            fromContacts: [],
            flowContacts: [],
            flowContactsAddCycle: [],
            reasonForIssues: [],
            specsSections: [],
            approvalstatusList: [],
            permission: [{ name: 'sendByEmail', code: 3522 }, { name: 'sendByInbox', code: 3521 },
            { name: 'sendTask', code: 1 }, { name: 'distributionList', code: 3530 },
            { name: 'createTransmittal', code: 3531 }, { name: 'sendToWorkFlow', code: 3525 },
            { name: 'viewAttachments', code: 3528 }, { name: 'deleteAttachments', code: 3144 },
            { name: 'addAttachments', code: 3526 }, { name: 'EditAttachments', code: 3527 }],
            permissionModification: [{ name: 'sendByEmail', code: 208 }, { name: 'sendByInbox', code: 207 },
            { name: 'sendTask', code: 1 }, { name: 'distributionList', code: 982 },
            { name: 'createTransmittal', code: 3068 }, { name: 'sendToWorkFlow', code: 730 },
            { name: 'viewAttachments', code: 3330 }, { name: 'deleteAttachments', code: 898 },
            { name: 'addAttachments', code: 897 }, { name: 'EditAttachments', code: 3236 }],
            selectedFromCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
            selectedFlowCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
            selectedFromContact: { label: Resources.fromContactRequired[currentLanguage], value: "0" },
            selectedFlowContact: { label: Resources.fromContactRequired[currentLanguage], value: "0" },
            selectedReasonForIssue: { label: Resources.reasonForIssue[currentLanguage], value: "0" },
            selectedspecsSection: { label: Resources.specsSection[currentLanguage], value: "0" },
            selectedDiscpline: { label: Resources.discplinesRequired[currentLanguage], value: "0" },
            selectedApprovalStatusId: { label: Resources.approvalStatusSelection[currentLanguage], value: "0" },
            selectedFlowCompanyAdd: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
            selectedFlowContactAdd: { label: Resources.fromContactRequired[currentLanguage], value: "0" },
            selectedApprovalStatusIdAdd: { label: Resources.approvalStatusSelection[currentLanguage], value: "0" },
            drawingCycleAdd: {},
            cyclesData: [],
            showPopup: false,
            EditModeForCycles: false,
            editId: 0,
            ItemForEdit: {},
            selectedRow: [],
            selected: [],
            showDeleteModal: false,
            message:""
        }
        steps_defination = [
            { name: isModification === false ? "drawing" : 'drawingModification', callBackFn: null },
            { name: "cyclesCount", callBackFn: null }
        ];

        if (isModification === false) {
            if (!Config.IsAllow(3516) && !Config.IsAllow(3517) && !Config.IsAllow(3519)) {
                havePermission = false;
                toast.error(Resources["missingPermissions"][currentLanguage]);
                this.props.history.push(
                    this.state.perviousRoute
                );
            }
        } else {
            if (!Config.IsAllow(3133) && !Config.IsAllow(3134) && !Config.IsAllow(3136)) {
                havePermission = false;
                toast.error(Resources["missingPermissions"][currentLanguage]);
                return this.props.history.push(this.state.perviousRoute);
            }
        }
    }

    showBtnNewCycle() {
        let show = false;
        if (Config.IsAllow(3532)) { show = true; }
        return show;
    }

    GetNExtArrange() {
        let original_document = { ...this.state.document };
        let updated_document = {};
        let url = "GetNextArrangeMainDoc?projectId=" + this.state.projectId + "&docType=" + isModification === true ? 114 : 37 + "&companyId=" + this.state.document.fromCompanyId + "&contactId=" + this.state.document.fromContactId;
        let url2 = "GetNextArrangeMainDoc?projectId=" + projectId + "&docType=" + this.state.docTypeId + "&companyId=undefined&contactId=undefined";
        dataservice.GetNextArrangeMainDocument(url2).then(res => {
            updated_document.arrange = res;
            updated_document = Object.assign(original_document, updated_document);
            this.setState({
                document: updated_document
            });
        })
    }

    componentWillUnmount() {
        this.props.actions.clearCashDocument();
        this.setState({
            docId: 0
        });
    }

    componentDidMount() {
        if (havePermission == true) {
            let classObj = this;
            let drawingCycle = {
                drawingId: null,
                subject: 'Cycle No. R ',
                status: 'true',
                approvalStatusId: '',
                docDate: moment(),
                approvedDate: moment(),
                flowCompanyId: '',
                flowContactId: '',
                progressPercent: 0,
                arrange: 0,
                serial: 0
            };
            this.setState({
                drawingCycle: drawingCycle
            });
            if (this.state.docId > 0) {
                let url = "GetLogsDrawingsForEdit?id=" + this.state.docId
                let PageName = isModification === false ? 'drawing' : 'drawingModification'
                this.props.actions.documentForEdit(url, isModification === true ? 114 : 37, PageName);
                dataservice.GetDataGrid('GetLogsDrawingsCyclesByDrawingId?drawingId=' + this.state.docId).then(
                    res => {
                        this.setState({ cyclesData: res });
                    }
                )
            } else {
                let drawing = {
                    subject: '',
                    id: 0,
                    projectId: projectId,
                    arrange: '',
                    bicCompanyId: '',
                    bicContactId: '',
                    specsSectionId: '',
                    reasonForIssueId: '',
                    docDate: moment(),
                    status: true,
                    refNo: '',
                    disciplineId: '',
                    fileNumber: '',
                    area: '',
                    drawingNo: '',
                    isModification: isModification,
                    progressPercent: 0,
                    approvalStatusId: '',
                    serial: '',
                    message:''
                };

                this.setState({
                    document: drawing,
                    drawingCycle: drawingCycle
                }, function () {
                    classObj.GetNExtArrange();
                });

                // this.setState({
                //     document: drawing,
                //     drawingCycle: drawingCycle
                // });
                // let url = "GetNextArrangeMainDoc?projectId=" + this.state.projectId + "&docType=" + isModification === true ? 114 : 37 + "&companyId=" + this.state.document.fromCompanyId + "&contactId=" + this.state.document.fromContactId;
                // let url2="GetNextArrangeMainDoc?projectId=" + projectId + "&docType=" + this.state.docTypeId + "&companyId=undefined&contactId=undefined";
                //     dataservice.GetNextArrangeMainDocument(url2).then(
                //         res => {
                //             const Document = {
                //                 projectId: projectId, arrange: res, status: "true", subject: "",
                //                 docDate: moment(), companyId: '', companyId: '',
                //             }
                //             this.setState({ document: Document })
                //         }
                //     )

                this.fillDropDowns(false);
                this.props.actions.documentForAdding();
            }

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
    };
    componentDidUpdate(prevProps) {
        if (this.props.hasWorkflow !== prevProps.hasWorkflow) {
            this.checkDocumentIsView();
        }

        if (this.props.document.id !== prevProps.document.id) {
            let doc = this.props.document
            doc.docDate = doc.docDate === null ? moment().format('YYYY-MM-DD') : moment(doc.docDate).format('YYYY-MM-DD')

            this.setState({
                document: doc,
                hasWorkflow: this.props.hasWorkflow,
                message:doc?doc.message:''
            });

            dataservice.GetRowById("getLogsDrawingsCyclesForEdit?id=" + this.props.document.id).then(result => {
                let data = { items: result };
                ///this.props.actions.ExportingData(data);
                this.setState({
                    drawingCycle: { ...result }
                });
                this.fillDropDowns(this.props.document.id > 0 ? true : false);
            });
            this.checkDocumentIsView();
        }
    }

    checkDocumentIsView() {
        if (isModification === true) {
            if (this.props.changeStatus === true) {
                if (!(Config.IsAllow(3517))) {
                    this.setState({ isViewMode: true });
                }
                if (Config.getUserTypeIsAdmin() === true) {
                    this.setState({ isViewMode: false });
                } else {
                    if (this.state.isApproveMode != true && Config.IsAllow(3517)) {
                        if (this.props.hasWorkflow == false && Config.IsAllow(3517)) {
                            if (this.props.document.status !== false && Config.IsAllow(3517)) {
                                this.setState({ isViewMode: false });
                            } else {
                                this.setState({ isViewMode: true });
                            }
                        } else {
                            this.setState({ isViewMode: true });
                        }
                    }
                }
            }
            else {
                this.setState({ isViewMode: false });
            }
        } else {
            if (this.props.changeStatus === true) {
                if (!(Config.IsAllow(3134))) {
                    this.setState({ isViewMode: true });
                }
                if (this.state.isApproveMode != true && Config.IsAllow(3134)) {
                    if (this.props.hasWorkflow == false && Config.IsAllow(3134)) {
                        if (this.props.document.status !== false && Config.IsAllow(3134)) {
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

    fillSubDropDownInEditCycle(url, param, value, subField, subSelectedValue, subDatasource) {
        let action = url + "?" + param + "=" + value
        dataservice.GetDataList(action, 'contactName', 'id').then(result => {
            if (this.props.changeStatus === true) {
                let toSubField = this.state.drawingCycle[subField];
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
                let companyId = this.props.document.bicCompanyId;
                if (companyId) {

                    let company = find(result, function (i) { return i.value == companyId; });
                    this.setState({ selectedFromCompany: company });
                    this.fillSubDropDownInEdit('GetContactsByCompanyId', 'companyId', companyId, 'bicContactId', 'selectedFromContact', 'fromContacts');
                }

                let flowCompanyId = this.state.drawingCycle.flowCompanyId;
                if (flowCompanyId) {
                    this.setState({
                        selectedFlowCompany: { label: this.state.drawingCycle.flowCompanyName, value: flowCompanyId }
                    });

                    this.fillSubDropDownInEditCycle('GetContactsByCompanyId', 'companyId', flowCompanyId, 'flowContactId', 'selectedFlowContact', 'flowContacts');
                }
            }
            this.setState({
                companies: [...result]
            });
        });

        dataservice.GetDataListCached("GetaccountsDefaultListForList?listType=approvalstatus", 'title', 'id', 'defaultLists', "approvalstatus", "listType").then(result => {
            if (isEdit) {
                let approvalStatusId = this.state.drawingCycle.approvalStatusId;
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

        dataservice.GetDataListCached("GetaccountsDefaultListForList?listType=specssection", 'title', 'id', 'defaultLists', "specssection", "listType").then(result => {
            if (isEdit) {
                let specsSectionId = this.props.document.specsSectionId;
                let specsSection = {};
                if (specsSectionId) {
                    specsSection = find(result, function (i) { return i.value == specsSectionId; });
                    this.setState({
                        selectedspecsSection: specsSection
                    });
                }
            }
            this.setState({
                specsSections: [...result]
            });
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

    onChangeComment = (value, field) => {

        if (value != null) {
            let original_document = { ...this.state.document };

            let updated_document = {};

            updated_document[field] = value;

            updated_document = Object.assign(original_document, updated_document);

            this.setState({
                document: updated_document,
                [field]: value
            });
        }
    };

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

    handleChangeDateCycle(e, field) {

        let original_document = { ...this.state.drawingCycle };

        let updated_document = {};

        updated_document[field] = e;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            drawingCycle: updated_document
        });
    }

    handleChangeCycle(e, field) {
        let original_document = { ...this.state.drawingCycle };

        let updated_document = {};

        updated_document[field] = e.target.value;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            drawingCycle: updated_document
        });
    }

    handleChangeCycleAdd(e, field) {
        let original_document = { ...this.state.drawingCycleAdd };

        let updated_document = {};

        updated_document[field] = e.target.value;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            drawingCycleAdd: updated_document
        });
    }

    handleChangeDateCycleAdd(e, field) {

        let original_document = { ...this.state.drawingCycleAdd };

        let updated_document = {};

        updated_document[field] = e;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            drawingCycleAdd: updated_document
        });
    }

    handleChangeDropDownCycle(event, field, isSubscrib, targetState, url, param, selectedValue, subDatasource) {
        if (event == null) return;
        let original_document = { ...this.state.drawingCycle };
        let updated_document = {};
        updated_document[field] = event.value;
        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            drawingCycle: updated_document,
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

    editDrawing(event) {
        this.setState({
            isLoading: true
        });
        let canEdit = isModification === false ? 3517 : 3134;
        let saveDocument = { ...this.state.document };
        saveDocument.docDate = moment(saveDocument.docDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");
        saveDocument.message = this.state.message;
        if (Config.IsAllow(canEdit)) {
            dataservice.addObject('EditLogDrawing', saveDocument).then(result => {
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
        } else {
            toast.success(Resources["missingPermissions"][currentLanguage]);
        }
    }

    saveDrawing(event) {
        let saveDocument = { ...this.state.document };
        saveDocument.docDate = moment(saveDocument.docDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");
        saveDocument.projectId = this.state.projectId;
        saveDocument.message = this.state.message;
        let canAdd = isModification === false ? 3516 : 3133;
        if (Config.IsAllow(canAdd)) {
            dataservice.addObject('AddLogsDrawings', saveDocument).then(result => {
                this.setState({
                    docId: result.id,
                    message:''
                });

                let saveDocumentCycle = { ...this.state.drawingCycle };
                saveDocumentCycle.drawingId = result.id;
                saveDocumentCycle.docDate = moment(saveDocumentCycle.docDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");
                saveDocumentCycle.approvedDate = moment(saveDocumentCycle.approvedDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");
                // dataservice.addObject('AddLogsDrawingsCycles', saveDocumentCycle).then(result => {
                //     toast.success(Resources["operationSuccess"][currentLanguage]);
                // });
            });
        } else {
            toast.success(Resources["missingPermissions"][currentLanguage]);
        }
    }

    saveAndExit(event) {

        this.props.history.push(this.state.perviousRoute);

    }

    showNEwCycle() {
        alert('showing....');
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

    showBtnsNewCycle() {
        let btn = null;
        if (this.props.changeStatus === true) {
            if (this.showBtnNewCycle() === true) {
                btn = <button className={this.state.isViewMode === true ? "primaryBtn-1 btn middle__btn disNone" : "primaryBtn-1 btn middle__btn"} onClick={e => this.showNEwCycle(e)}>{Resources.addNewCycle[currentLanguage]}</button>
            }
        }
        return btn;
    }

    viewAttachments() {
        return (
            this.state.docId > 0 ? (
                Config.IsAllow(3317) === true ?
                    <ViewAttachment isApproveMode={this.state.isViewMode} docTypeId={isModification === true ? 114 : 37} docId={this.state.docId} projectId={this.state.projectId} deleteAttachments={840} />
                    : null)
                : null
        )
    }

    changeCurrentStep = stepNo => {
        this.setState({ CurrentStep: stepNo });
    };

    FirePopup = () => {
        this.setState({ showPopup: true, EditModeForCycles: false })
        this.clearCyclingAdd()
    }

    saveDrawingNewCycles(event) {
        let saveDocument = { ...this.state.document };
        saveDocument.docDate = moment(saveDocument.docDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");
        saveDocument.projectId = this.state.projectId;

        dataservice.addObject('AddLogsDrawings', saveDocument).then(result => {
            this.setState({
                docId: result.id
            });

            let saveDocumentCycle = { ...this.state.drawingCycle };
            saveDocumentCycle.drawingId = result.id;
            saveDocumentCycle.docDate = moment(saveDocumentCycle.docDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");
            saveDocumentCycle.approvedDate = moment(saveDocumentCycle.approvedDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");
            // dataservice.addObject('AddLogsDrawingsCycles', saveDocumentCycle).then(result => {

            //     toast.success(Resources["operationSuccess"][currentLanguage]);
            // });
        });
    }

    AddNewCycle = (id) => {

        let addDrawing = { ...this.state.drawingCycleAdd }
        addDrawing.docDate = moment(addDrawing.docDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");
        addDrawing.projectId = this.state.projectId;
        addDrawing.progressPercent = addDrawing.progressPercent;
        addDrawing.arrange = addDrawing.arrange;
        addDrawing.drawingId = this.state.docId;
        addDrawing.approvalStatusId = this.state.selectedApprovalStatusIdAdd.value
        addDrawing.flowCompanyId = this.state.selectedFlowCompanyAdd.value
        addDrawing.flowContactId = this.state.selectedFlowContactAdd.value

        this.setState({
            isLoading: true,
            showPopup: false
        })

        if (this.state.EditModeForCycles === true) {
            dataservice.addObject("EditLogDrawingCycle", addDrawing).then(res => {
                this.setState({
                    cyclesData: res,
                    isLoading: false,
                });
            }).catch(ex => {
                toast.error(Resources["failError"][currentLanguage]);
            });
        }
        else {
            dataservice.addObject('AddLogsDrawingsCycles', addDrawing).then(result => {
                let cyclesData = this.state.cyclesData
                cyclesData.push(result);
                this.setState({
                    cyclesData,
                    isLoading: false,
                });
            })
        }
    }

    handleChangeCycleAddDrops = (value, field, selectedValue) => {
        let original_document = { ...this.state.drawingCycleAdd };

        let updated_document = {};

        updated_document[field] = value.value;

        updated_document = Object.assign(original_document, updated_document);
        if (selectedValue === 'selectedFlowCompanyAdd') {
            dataservice.GetDataList('GetContactsByCompanyId?companyId=' + value.value, 'contactName', 'id').then(result => {
                this.setState({
                    flowContactsAddCycle: result
                });
            });
        }

        this.setState({
            [selectedValue]: value,
            drawingCycleAdd: updated_document
        });

    }

    showOptionPanel = () => {
        this.props.actions.showOptionPanel(true);
    }

    viewModelToEdit(obj, type) {
        // console.log(type)
        if (type === 'rt-td') {
            if (obj) {
                if (this.state.isViewMode === false) {
                    this.fillCycleDropdownInEdit(obj);
                    this.setState({ EditModeForCycles: true, isLoading: false, drawingCycleAdd: obj, showPopup: true });
                }
            }
        }
    }

    clearCyclingAdd = () => {
        let drawingCycleAddObj = {
            drawingId: this.state.docId,
            subject: this.state.cyclesData.length ? 'Cycle No. R ' + Math.max.apply(Math, this.state.cyclesData.map(function (o) { return o.arrange + 1 })) : 'Cycle No. R 1',
            status: 'true',
            approvalStatusId: '',
            docDate: moment(),
            flowCompanyId: '',
            flowContactId: '',
            progressPercent: 0,
            arrange: this.state.cyclesData.length ? Math.max.apply(Math, this.state.cyclesData.map(function (o) { return o.arrange + 1 })) : 1,
        }

        this.setState({
            drawingCycleAdd: drawingCycleAddObj,
            selectedFlowCompanyAdd: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
            selectedFlowContactAdd: { label: Resources.fromContactRequired[currentLanguage], value: "0" },
            selectedApprovalStatusIdAdd: { label: Resources.approvalStatusSelection[currentLanguage], value: "0" },
        });
    }

    fillCycleDropdownInEdit = (obj) => {
        let companyId = obj.flowCompanyId
        let flowContactId = obj.flowContactId
        let approvalStatusId = obj.approvalStatusId
        if (companyId) {
            let company = this.state.companies.find(i => i.value === companyId);
            this.setState({ selectedFlowCompanyAdd: company });

            dataservice.GetDataList('GetContactsByCompanyId?companyId=' + companyId, 'contactName', 'id').then(
                result => {
                    if (result) {
                        let contact = result.find(i => i.value === flowContactId);
                        this.setState({ flowContactsAddCycle: result, selectedFlowContactAdd: contact });
                    }
                }
            )
        }

        let approvalStatus = this.state.approvalstatusList.find(i => i.value === approvalStatusId);
        if (approvalStatus)
            this.setState({ selectedApprovalStatusIdAdd: approvalStatus });

    }

    ConfirmDeletetion = () => {
        if (selectedRows.length > 0) {
            this.setState({ isLoading: true });
            let listIds = selectedRows.map(rows => rows.id);

            dataservice.addObject("DeleteMultipleLogsDrawingsCyclesById", listIds).then(result => {
                let originalData = this.state.cyclesData;
                selectedRows.forEach(item => {
                    let getIndex = originalData.findIndex(x => x.id === item.id);
                    originalData.splice(getIndex, 1);
                });
                selectedRows = [];
                this.setState({
                    cyclesData: originalData,
                    showDeleteModal: false,
                    isLoading: false
                });
                toast.success(Resources["operationSuccess"][currentLanguage]);
            }).catch(ex => {
                toast.success(Resources["operationSuccess"][currentLanguage]);
            });
        }
    }

    viewConfirmDeleteCycle() {
        this.setState({
            showDeleteModal: true,
            type: "Items"
        });
        console.log(this.state.selected)
    }

    toggleRow(obj) {

        if (this.state.isViewMode === false) {
            const newSelected = Object.assign({}, this.state.selected);
            newSelected[obj.id] = !this.state.selected[obj.id];
            let setIndex = selectedRows.findIndex(x => x.id === obj.id);
            if (setIndex > -1) {
                selectedRows.splice(setIndex, 1);
            } else {
                selectedRows.push(obj);
            }
            this.setState({
                selected: newSelected
            });
        }
    }

    render() {

        let Drawing = () => {
            return (
                <div className="document-fields">
                    <Formik
                        initialValues={{ ...this.state.document }}
                        validationSchema={validationSchema}
                        enableReinitialize={true}
                        onSubmit={(values) => {
                            if (this.props.showModal) { return; }

                            if (this.props.changeStatus === true && this.state.docId > 0) {
                                this.editDrawing();
                            } else if (this.props.changeStatus === false && this.state.docId === 0) {
                                this.saveDrawing();
                            } else {
                                this.saveAndExit();
                            }
                        }}  >

                        {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched, values }) => (
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
                                            <input type="radio" name="drawing-status" defaultChecked={this.state.document.status === false ? null : 'checked'} value="true" onChange={e => this.handleChange(e, 'status')} />
                                            <label>{Resources.oppened[currentLanguage]}</label>
                                        </div>
                                        <div className="ui checkbox radio radioBoxBlue">
                                            <input type="radio" name="drawing-status" defaultChecked={this.state.document.status === false ? 'checked' : null} value="false" onChange={e => this.handleChange(e, 'status')} />
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
                                                value={isModification == true ? this.state.document.serial : this.state.document.arrange}
                                                name="arrange"
                                                placeholder={Resources.arrange[currentLanguage]}
                                                onBlur={(e) => {
                                                    handleChange(e)
                                                    handleBlur(e)
                                                }}
                                                onChange={(e) => this.handleChange(e, 'arrange')} />
                                        </div>
                                    </div>

                                    <div className="linebylineInput fullInputWidth">
                                        <label className="control-label">{Resources.refDoc[currentLanguage]}</label>
                                        <div className={"inputDev ui input" + (errors.refNo && touched.refNo ? (" has-error") : !errors.refNo && touched.refNo ? (" has-success") : " ")} >
                                            <input name='refNo' className="form-control fsadfsadsa"
                                                id="refNo"
                                                placeholder={Resources.refDoc[currentLanguage]}
                                                autoComplete='off'
                                                value={this.state.document.refNo}
                                                onBlur={(e) => {
                                                    handleBlur(e)
                                                    handleChange(e)
                                                }}
                                                onChange={(e) => this.handleChange(e, 'refNo')} />
                                            {touched.refNo ? (<em className="pError">{errors.refNo}</em>) : null}
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
                                                    handleChange={event => {
                                                        this.handleChangeDropDown(event, 'bicCompanyId', true, 'fromContacts', 'GetContactsByCompanyId', 'companyId', 'selectedFromCompany', 'selectedFromContact')
                                                    }}
                                                    onChange={setFieldValue}
                                                    onBlur={setFieldTouched}
                                                    //error={errors.fromCompanyId}
                                                    // touched={touched.fromCompanyId}
                                                    index="fromCompanyId"
                                                    name="fromCompanyId"
                                                    id="fromCompanyId" styles={CompanyDropdown} classDrop="companyName1 " />
                                            </div>
                                            <div className="super_company">

                                                <Dropdown
                                                    data={this.state.fromContacts}
                                                    selectedValue={this.state.selectedFromContact}
                                                    handleChange={event => this.handleChangeDropDown(event, 'bicContactId', false, '', '', '', 'selectedFromContact')}
                                                    index="drawingModification-bicContactId"
                                                    onChange={setFieldValue}
                                                    onBlur={setFieldTouched}
                                                    error={errors.bicContactId}
                                                    touched={touched.bicContactId}
                                                    name="bicContactId"
                                                    id="bicContactId" classDrop=" contactName1" styles={ContactDropdown} />

                                            </div>
                                        </div>
                                    </div>

                                    <div className="linebylineInput valid-input">
                                        <Dropdown
                                            title="discipline"
                                            data={this.state.discplines}
                                            selectedValue={this.state.selectedDiscpline}
                                            handleChange={event => this.handleChangeDropDown(event, 'disciplineId', false, '', '', '', 'selectedDiscpline')}
                                            index="drawingModification-disciplineId"
                                            onChange={setFieldValue}
                                            onBlur={setFieldTouched}
                                            error={errors.disciplineId}
                                            touched={touched.disciplineId}
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
                                            title="specsSection"
                                            data={this.state.specsSections}
                                            selectedValue={this.state.selectedspecsSection}
                                            handleChange={event => this.handleChangeDropDown(event, 'specsSectionId', false, '', '', '', 'selectedspecsSection')}
                                            index="specsSectionId" />
                                    </div>

                                    <div className="linebylineInput valid-input">
                                        <label className="control-label">{Resources.area[currentLanguage]}</label>
                                        <div className="ui input inputDev"  >
                                            <input type="text" className="form-control" id="area"
                                                value={this.state.document.area}
                                                name="area"
                                                placeholder={Resources.area[currentLanguage]}
                                                onChange={(e) => this.handleChange(e, 'area')} />
                                        </div>
                                    </div>

                                    <div className="linebylineInput valid-input">
                                        <label className="control-label">{Resources.drawingNo[currentLanguage]}</label>
                                        <div className="ui input inputDev"  >
                                            <input type="text" className="form-control" id="drawingNo"
                                                value={this.state.document.drawingNo}
                                                name="drawingNo"
                                                placeholder={Resources.drawingNo[currentLanguage]}
                                                onChange={(e) => this.handleChange(e, 'drawingNo')} />
                                        </div>
                                    </div>

                                    <div className="linebylineInput valid-input">
                                        <label className="control-label">{Resources.fileNumber[currentLanguage]}</label>
                                        <div className="ui input inputDev"  >
                                            <input type="text" className="form-control" id="fileNumber"
                                                value={this.state.document.fileNumber}
                                                name="fileNumber"
                                                placeholder={Resources.fileNumber[currentLanguage]}
                                                onChange={(e) => this.handleChange(e, 'fileNumber')} />
                                        </div>
                                    </div>

                                    <div className="letterFullWidth fullInputWidth linebylineInput">
                                        <label className="control-label">{Resources.message[currentLanguage]}</label>
                                        <div className="inputDev ui input">
                                            <TextEditor
                                                value={this.state.message || ''}
                                                onChange={event => this.onChangeComment(event, "message")}
                                            />
                                        </div>
                                    </div>

                                </div>
                                {this.props.changeStatus === true ?
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
                                                docTypeId={isModification === true ? 114 : 37}
                                                docId={this.state.docId}
                                                projectId={this.state.projectId}
                                                previousRoute={this.state.previousRoute}
                                                docApprovalId={this.state.docApprovalId}
                                                currentArrange={this.state.arrange}
                                                showModal={this.props.showModal}
                                                showOptionPanel={this.showOptionPanel}
                                                permission={this.state.permission}
                                            />

                                        </div>
                                    </div>
                                    : null}

                                <div className="doc-pre-cycle letterFullWidth">
                                    <div>
                                        {this.state.docId > 0 && this.state.isViewMode === false ?
                                            (<UploadAttachment changeStatus={this.props.changeStatus}
                                                AddAttachments={isModification === true ? this.state.permissionModification.find(x => x.name == "addAttachments").code : this.state.permission.find(x => x.name == "addAttachments").code}
                                                EditAttachments={isModification === true ? this.state.permissionModification.find(x => x.name == "EditAttachments").code : this.state.permission.find(x => x.name == "EditAttachments").code}
                                                ShowDropBox={isModification === true ? 3633 : 3635}
                                                ShowGoogleDrive={isModification === true ? 3634 : 3636}
                                                docTypeId={isModification === true ? 114 : 37}
                                                docId={this.state.docId}
                                                projectId={this.state.projectId} />) : null}

                                        {this.viewAttachments()}

                                        {this.props.changeStatus === true ?
                                            <ViewWorkFlow docType={isModification === true ? 114 : 37} docId={this.state.docId} projectId={this.state.projectId} />
                                            : null
                                        }
                                    </div>
                                </div>
                                <div className="slider-Btns">
                                    {this.showBtnsSaving()}
                                    {this.props.changeStatus === true ?
                                        <button type='submit' className={this.state.isViewMode === true ? "primaryBtn-1 btn middle__btn disNone" : "primaryBtn-1 btn middle__btn"} >{Resources.save[currentLanguage]}</button>
                                        : null
                                    }
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            )
        }

        let LastCycle = () => {
            return (
                <div className="document-fields">
                    <Formik
                        initialValues={{ ...this.state.document }}
                        //  validationSchema={validationSchema}
                        enableReinitialize={true}
                        onSubmit={(values) => {
                            if (this.props.showModal) { return; }

                            if (this.props.changeStatus === true && this.state.docId > 0) {
                                this.editDrawing();
                            } else if (this.props.changeStatus === false && this.state.docId === 0) {
                                this.saveDrawing();
                            } else {
                                this.saveAndExit();
                            }
                        }}  >

                        {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                            <Form id="ClientSelectionForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>
                                <div className="workingHours__cycle">

                                    <div className="proForm first-proform">

                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">{Resources.subject[currentLanguage]}</label>
                                            <div className={"inputDev ui input" + (errors.subjectCycle && touched.subjectCycle ? (" has-error") : !errors.subjectCycle && touched.subjectCycle ? (" has-success") : " ")} >
                                                <input name='subjectCycle' className="form-control fsadfsadsa"
                                                    id="subjectCycle" name='subjectCycle'
                                                    placeholder={Resources.subject[currentLanguage]}
                                                    autoComplete='off'
                                                    value={this.state.drawingCycle.subject}
                                                    onBlur={(e) => {
                                                        handleBlur(e)
                                                        handleChange(e)
                                                    }}
                                                    onChange={(e) => this.handleChangeCycle(e, 'subject')} />
                                                {touched.subjectCycle ? (<em className="pError">{errors.subjectCycle}</em>) : null}

                                            </div>
                                        </div>

                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">{Resources.status[currentLanguage]}</label>
                                            <div className="ui checkbox radio radioBoxBlue">
                                                <input type="radio" name="drawing-cycle-status" defaultChecked={this.state.drawingCycle.status === false ? null : 'checked'} value="true" onChange={e => this.handleChangeCycle(e, 'status')} />
                                                <label>{Resources.oppened[currentLanguage]}</label>
                                            </div>
                                            <div className="ui checkbox radio radioBoxBlue">
                                                <input type="radio" name="drawing-cycle-status" defaultChecked={this.state.drawingCycle.status === false ? 'checked' : null} value="false" onChange={e => this.handleChangeCycle(e, 'status')} />
                                                <label>{Resources.closed[currentLanguage]}</label>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="proForm datepickerContainer">

                                        <div className="linebylineInput valid-input alternativeDate">
                                            <DatePicker
                                                title='docDate'
                                                onChange={e => setFieldValue('docDate', e)}
                                                name="docDateCycle"
                                                startDate={this.state.drawingCycle.docDate}
                                                handleChange={e => this.handleChangeDateCycle(e, 'docDate')} />
                                        </div>

                                        <div className="linebylineInput valid-input alternativeDate">
                                            <DatePicker
                                                title='dateApproved'
                                                onChange={e => setFieldValue('approvedDate', e)}
                                                name="approvedDate"
                                                startDate={this.state.drawingCycle.approvedDate}
                                                handleChange={e => this.handleChangeDateCycle(e, 'approvedDate')} />
                                        </div>

                                        <div className="linebylineInput valid-input mix_dropdown">

                                            <label className="control-label">{Resources.CompanyName[currentLanguage]}</label>
                                            <div className="supervisor__company">
                                                <div className="super_name">
                                                    <Dropdown
                                                        data={this.state.companies}
                                                        isMulti={false}
                                                        selectedValue={this.state.selectedFlowCompany}
                                                        handleChange={event => {
                                                            this.handleChangeDropDownCycle(event, 'flowCompanyId', true, 'flowContacts', 'GetContactsByCompanyId', 'companyId', 'selectedFlowCompany', 'selectedFlowContact')
                                                        }}
                                                        index="flowCompanyId"
                                                        name="flowCompanyId"
                                                        id="flowCompanyId" styles={CompanyDropdown} classDrop="companyName1 " />
                                                </div>
                                                <div className="super_company">
                                                    <Dropdown
                                                        isMulti={false}
                                                        data={this.state.flowContacts}
                                                        selectedValue={this.state.selectedFlowContact}
                                                        handleChange={event => this.handleChangeDropDownCycle(event, 'flowContactId', false, '', '', '', 'selectedFlowContact')}
                                                        isClear={false}
                                                        index="drawing-flowContactId"
                                                        name="flowContactId"
                                                        id="flowContactId" classDrop=" contactName1" styles={ContactDropdown} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="linebylineInput valid-input">
                                            <Dropdown title="approvalStatus"
                                                isMulti={false}
                                                data={this.state.approvalstatusList}
                                                selectedValue={this.state.selectedApprovalStatusId}
                                                handleChange={(e) => this.handleChangeDropDownCycle(e, "approvalStatusId", false, '', '', '', 'selectedApprovalStatusId')}

                                                onChange={setFieldValue}
                                                onBlur={setFieldTouched}
                                                error={errors.approvalStatusId}
                                                touched={touched.approvalStatusId}
                                                index="approvalStatusId"
                                                name="approvalStatusId"
                                                id="approvalStatusId" />
                                        </div>

                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">{Resources.progressPercent[currentLanguage]}</label>
                                            <div className={"ui input inputDev" + (errors.progressPercent && touched.progressPercent ? (" has-error") : "ui input inputDev")} >
                                                <input type="text" className="form-control" id="progressPercent" value={this.state.drawingCycle.progressPercent} name="progressPercent"
                                                    placeholder={Resources.progressPercent[currentLanguage]}
                                                    onBlur={(e) => {
                                                        handleChange(e)
                                                        handleBlur(e)
                                                    }}
                                                    onChange={(e) => this.handleChangeCycle(e, 'progressPercent')} />
                                                {touched.progressPercent ? (<em className="pError">{errors.progressPercent}</em>) : null}

                                            </div>
                                        </div>
                                        <div className="slider-Btns">
                                            <button className="primaryBtn-1 btn meduimBtn" type="submit" >   {Resources["addTitle"][currentLanguage]} </button>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            )
        }

        let Cycles = () => {

            const columnsCycles = [
                {
                    Header: Resources["delete"][currentLanguage],
                    accessor: "id",
                    id: "button",
                    Cell: ({ row }) => {
                        return (
                            <div className="ui checked checkbox  checkBoxGray300 ">
                                <input type="checkbox" className="checkbox" checked={this.state.selected[row._original.id] === true} onChange={() => this.toggleRow(row._original)} />
                                <label />
                            </div>
                        );
                    },
                    width: 70
                },
                {
                    Header: Resources["subject"][currentLanguage],
                    accessor: "subject",
                    width: 200,
                    sortabel: true
                },
                {
                    Header: Resources["docDate"][currentLanguage],
                    accessor: "docDate",
                    width: 130,
                    sortabel: true,
                    Cell: row => (
                        <span>
                            <span>{moment(row.value).format("DD/MM/YYYY")}</span>
                        </span>
                    )
                },
                {
                    Header: Resources["status"][currentLanguage],
                    accessor: "approvalStatusName",
                    width: 200,
                    sortabel: true
                },
                {
                    Header: Resources["progressPercent"][currentLanguage],
                    accessor: "progressPercent",
                    width: 100,
                    sortabel: true
                },
                {
                    Header: Resources["CompanyName"][currentLanguage],
                    accessor: "flowCompanyName",
                    width: 200,
                    sortabel: true
                },
                {
                    Header: Resources["ContactName"][currentLanguage],
                    accessor: "flowContactName",
                    width: 200,
                    sortabel: true
                }
            ];

            return (
                <Fragment>
                    {LastCycle()}
                    <header className="main__header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '40px' }}>
                        <div className="main__header--div">
                            <h2 className="zero">
                                {Resources["previousCycle"][currentLanguage]}
                            </h2>
                        </div>
                        <button className="primaryBtn-1 btn meduimBtn" onClick={() => this.FirePopup()} >   {Resources["addTitle"][currentLanguage]} </button>
                    </header>
                    {this.state.isLoading ? <LoadingSection /> :
                        <div className="reactTableActions">
                            {selectedRows.length > 0 ? (
                                <div className={"gridSystemSelected " + (selectedRows.length > 0 ? " active" : "")} style={{ top: '0', width: '100% !important', left: '0 !important' }}>
                                    <div className="tableselcted-items">
                                        <span id="count-checked-checkboxes">
                                            {selectedRows.length}
                                        </span>
                                        <span>Selected</span>
                                    </div>
                                    <div className="tableSelctedBTNs">
                                        <button className="defaultBtn btn smallBtn" onClick={this.viewConfirmDeleteCycle.bind(this)}>
                                            {Resources["delete"][currentLanguage]}
                                        </button>
                                    </div>
                                </div>
                            ) : null}

                            <ReactTable data={this.state.cyclesData}
                                columns={columnsCycles}
                                defaultPageSize={10}
                                minRows={2}
                                noDataText={Resources["noData"][currentLanguage]}
                                className="-striped -highlight"
                                getTrProps={(state, rowInfo, column, instance) => {
                                    return { onClick: e => { this.viewModelToEdit(rowInfo.original, e.target.className); } };
                                }}
                            />
                        </div>
                    }
                </Fragment>
            )
        }

        let AddEditcycle = () => {
            return (
                <div className="document-fields">
                    <Formik
                        initialValues={{ ...this.state.drawingCycleAdd }}
                        validationSchema={validationSchemaNewCycle}
                        enableReinitialize={true}
                        onSubmit={(values) => {
                            this.AddNewCycle(values);
                        }}>

                        {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                            <Form id="ClientSelectionForm" className="proForm" noValidate="novalidate" onSubmit={handleSubmit}>
                                <div className="dropWrapper">

                                    <div className="fillter-status fillter-item-c ">
                                        <label className="control-label">{Resources.subject[currentLanguage]}</label>
                                        <div className={"inputDev ui input" + (errors.subject && touched.subject ? (" has-error") : !errors.subject && touched.subject ? (" has-success") : " ")} >
                                            <input name='subject' className="form-control "
                                                id="subject" name='subject'
                                                placeholder={Resources.subject[currentLanguage]}
                                                autoComplete='off'
                                                value={this.state.drawingCycleAdd.subject}
                                                onBlur={(e) => {
                                                    handleBlur(e)
                                                    handleChange(e)
                                                }}
                                                onChange={(e) => this.handleChangeCycleAdd(e, 'subject')} />
                                            {touched.subject ? (<em className="pError">{errors.subject}</em>) : null}

                                        </div>
                                    </div>

                                    <div className="fillter-status fillter-item-c linebylineInput__checkbox">
                                        <label className="control-label">{Resources.status[currentLanguage]}</label>
                                        <div className="ui checkbox radio radioBoxBlue">
                                            <input type="radio" name="drawing-cycle-status" defaultChecked={this.state.drawingCycleAdd.status === false ? null : 'checked'} value="true" onChange={e => this.handleChangeCycleAdd(e, 'status')} />
                                            <label>{Resources.oppened[currentLanguage]}</label>
                                        </div>
                                        <div className="ui checkbox radio radioBoxBlue">
                                            <input type="radio" name="drawing-cycle-status" defaultChecked={this.state.drawingCycleAdd.status === false ? 'checked' : null} value="false" onChange={e => this.handleChangeCycleAdd(e, 'status')} />
                                            <label>{Resources.closed[currentLanguage]}</label>
                                        </div>
                                    </div>

                                    <div className="fillter-status fillter-item-c ">
                                        <label className="control-label">{Resources.arrange[currentLanguage]}</label>
                                        <div className="ui input inputDev"  >
                                            <input type="text" className="form-control" id="arrange" readOnly
                                                value={this.state.drawingCycleAdd.arrange}
                                                name="arrange"
                                                placeholder={Resources.arrange[currentLanguage]}
                                                onBlur={(e) => {
                                                    handleChange(e)
                                                    handleBlur(e)
                                                }}
                                                onChange={(e) => this.handleChangeCycleAdd(e, 'arrange')} />
                                        </div>
                                    </div>

                                    <div className="fillter-status fillter-item-c alternativeDate">
                                        <DatePicker
                                            title='docDate'
                                            onChange={e => setFieldValue('docDate', e)}
                                            name="docDateCycle"
                                            startDate={this.state.drawingCycleAdd.docDate}
                                            handleChange={e => this.handleChangeDateCycleAdd(e, 'docDate')} />
                                    </div>

                                    <div className="fillter-status fillter-item-c mix_dropdown">
                                        <label className="control-label">{Resources.CompanyName[currentLanguage]}</label>
                                        <div className="supervisor__company">
                                            <div className="super_name">
                                                <Dropdown
                                                    data={this.state.companies}

                                                    selectedValue={this.state.selectedFlowCompanyAdd}
                                                    handleChange={event => {
                                                        this.handleChangeCycleAddDrops(event, 'flowCompanyId', 'selectedFlowCompanyAdd')
                                                    }}
                                                    index="flowCompanyId"
                                                    name="flowCompanyId"
                                                    id="flowCompanyId" styles={CompanyDropdown} classDrop="companyName1 " />
                                            </div>
                                            <div className="super_company">
                                                <Dropdown
                                                    data={this.state.flowContactsAddCycle}
                                                    selectedValue={this.state.selectedFlowContactAdd}
                                                    handleChange={event => {
                                                        this.handleChangeCycleAddDrops(event, "flowContactId", 'selectedFlowContactAdd')
                                                    }}
                                                    onChange={setFieldValue}
                                                    onBlur={setFieldTouched}
                                                    error={errors.flowContactId}
                                                    touched={touched.flowContactId}
                                                    index="drawing-flowContactId"
                                                    name="flowContactId"
                                                    id="flowContactId" classDrop=" contactName1" styles={ContactDropdown} />
                                            </div>
                                        </div>
                                    </div>

                                    <Dropdown title="approvalStatus"
                                        data={this.state.approvalstatusList}
                                        selectedValue={this.state.selectedApprovalStatusIdAdd}
                                        handleChange={event => {
                                            this.handleChangeCycleAddDrops(event, 'approvalStatusId', 'selectedApprovalStatusIdAdd')
                                        }}
                                        onChange={setFieldValue}
                                        onBlur={setFieldTouched}
                                        error={errors.approvalStatusId}
                                        touched={touched.approvalStatusId}
                                        index="approvalStatusId"
                                        name="approvalStatusId"
                                        id="approvalStatusId" />

                                    <div className="fillter-status fillter-item-c ">
                                        <label className="control-label">{Resources.progressPercent[currentLanguage]}</label>
                                        <div className={"ui input inputDev" + (errors.progressPercent && touched.progressPercent ? (" has-error") : "ui input inputDev")} >
                                            <input type="text" className="form-control" id="progressPercent" value={this.state.drawingCycleAdd.progressPercent} name="progressPercent"
                                                placeholder={Resources.progressPercent[currentLanguage]}
                                                onBlur={(e) => {
                                                    handleChange(e)
                                                    handleBlur(e)
                                                }}
                                                onChange={(e) => this.handleChangeCycleAdd(e, 'progressPercent')} />

                                        </div>
                                    </div>
                                    <div className=" fullWidthWrapper">
                                        {this.state.EditModeForCycles ?
                                            <button className="primaryBtn-1 btn meduimBtn" type="submit" >{Resources["editTitle"][currentLanguage]} </button>
                                            : <button className="primaryBtn-1 btn meduimBtn" type="submit" >{Resources["addTitle"][currentLanguage]} </button>}
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            )
        }

        return (
            <div className="mainContainer">

                <div className="skyLight__form">
                    <SkyLightStateless onOverlayClicked={e => this.setState({ showPopup: false })}
                        title={Resources['add'][currentLanguage]}
                        onCloseClicked={e => this.setState({ showPopup: false })} isVisible={this.state.showPopup}>
                        {AddEditcycle()}
                    </SkyLightStateless>
                </div>

                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document one__tab one_step readOnly_inputs" : "documents-stepper noTabs__document one__tab one_step"}>
                    <HeaderDocument projectName={projectName} isViewMode={this.state.isViewMode} docTitle={isModification != true ? Resources.drawingModification[currentLanguage] : Resources.drawing[currentLanguage]} moduleTitle={Resources['designCoordination'][currentLanguage]} perviousRoute={this.state.perviousRoute} />
                    <div className="doc-container">

                        <div className="step-content">
                            {this.state.isLoading ? <LoadingSection /> : null}

                            {this.state.CurrentStep === 0 ? <Fragment>{Drawing()}</Fragment> : Cycles()}

                        </div>

                        <Fragment>
                            <Steps steps_defination={steps_defination}
                                exist_link={isModification === false ? "/drawing/" : "/drawingModification/"}
                                docId={this.state.docId}
                                changeCurrentStep={stepNo =>
                                    this.changeCurrentStep(stepNo)
                                }
                                stepNo={this.state.CurrentStep} changeStatus={docId === 0 ? false : true}
                            />
                        </Fragment>

                    </div>
                </div>
                {this.state.showDeleteModal == true ? (
                    <ConfirmationModal showDeleteModal={this.state.showDeleteModal}
                        title={Resources["smartDeleteMessageContent"][currentLanguage]}
                        closed={() => this.setState({ showDeleteModal: false })}
                        clickHandlerCancel={() => this.setState({ showDeleteModal: false })}
                        buttonName='delete' clickHandlerContinue={this.ConfirmDeletetion} />
                ) : null}
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(addEditModificationDrawing))