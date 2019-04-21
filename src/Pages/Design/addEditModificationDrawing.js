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
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument'

import { withRouter } from "react-router-dom";

import { connect } from 'react-redux';
import {
    bindActionCreators
} from 'redux';
import * as communicationActions from '../../store/actions/communication';


import Config from "../../Services/Config.js";
import CryptoJS from 'crypto-js';
import moment from "moment";

import SkyLight from 'react-skylight';
import Distribution from '../../Componants/OptionsPanels/DistributionList'
import SendToWorkflow from '../../Componants/OptionsPanels/SendWorkFlow'
import DocumentApproval from '../../Componants/OptionsPanels/wfApproval'

import DatePicker from '../../Componants/OptionsPanels/DatePicker'
import { toast } from "react-toastify";

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const validationSchema = Yup.object().shape({

    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),

    subjectCycle: Yup.string().required(Resources['subjectRequired'][currentLanguage]),

    fromContactId: Yup.string().required(Resources['fromContactRequired'][currentLanguage])
        .nullable(true),

    disciplineId: Yup.string()
        .required(Resources['disciplineRequired'][currentLanguage]),

    approvalStatusId: Yup.string()
        .required(Resources['approvalStatusSelection'][currentLanguage]).nullable(true)

})

let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let arrange = 0;
let isModification = true;
const _ = require('lodash')
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
                    isModification = obj.isModification;
                }
                catch{
                    this.props.history.goBack();
                }
            }
            index++;
        }

        this.state = {
            isModification: isModification,
            currentTitle: "sendToWorkFlow",
            showModal: false,
            isViewMode: false,
            isApproveMode: isApproveMode,
            isView: false,
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
            reasonForIssues: [],
            specsSections: [],
            approvalstatusList: [],
            permission: [{ name: 'sendByEmail', code: 3522 }, { name: 'sendByInbox', code: 3521 },
            { name: 'sendTask', code: 1 }, { name: 'distributionList', code: 3530 },
            { name: 'createTransmittal', code: 3531 }, { name: 'sendToWorkFlow', code: 3525 },
            { name: 'viewAttachments', code: 3528 }, { name: 'deleteAttachments', code: 3144 }, { name: 'addAttachments', code: 3526 }],
            selectedFromCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
            selectedFlowCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
            selectedFromContact: { label: Resources.fromContactRequired[currentLanguage], value: "0" },
            selectedFlowContact: { label: Resources.fromContactRequired[currentLanguage], value: "0" },
            selectedReasonForIssue: { label: Resources.reasonForIssue[currentLanguage], value: "0" },
            selectedspecsSection: { label: Resources.specsSection[currentLanguage], value: "0" },
            selectedDiscpline: { label: Resources.discplinesRequired[currentLanguage], value: "0" },
            selectedApprovalStatusId: { label: Resources.approvalStatusSelection[currentLanguage], value: "0" }
        }
        if (isModification === true) {
            if (!Config.IsAllow(3516) || !Config.IsAllow(3517) || !Config.IsAllow(3519)) {
                toast.success(Resources["missingPermissions"][currentLanguage]);
                this.props.history.push({
                    pathname: "/drawing/" + projectId
                });
            }

        } else {
            if (!Config.IsAllow(3133) || !Config.IsAllow(3134) || !Config.IsAllow(3136)) {
                toast.success(Resources["missingPermissions"][currentLanguage]);
                this.props.history.push({
                    pathname: "/drawingModification/" + projectId
                });
            }

        }
    }
    showBtnNewCycle() {
        let show = false;
        if (Config.IsAllow(3532)) {
            show = true;
        }
        return show;
    }

    GetNExtArrange() {
        let original_document = { ...this.state.document };
        let updated_document = {};
        let url = "GetNextArrangeMainDoc?projectId=" + this.state.projectId + "&docType=" + this.state.docTypeId + "&companyId=" + this.state.document.fromCompanyId + "&contactId=" + this.state.document.fromContactId;
        this.props.actions.GetNextArrange(url);
        dataservice.GetNextArrangeMainDocument(url).then(res => {
            updated_document.arrange = res;
            updated_document = Object.assign(original_document, updated_document);

            this.setState({
                document: updated_document
            });
        })
    }

    componentWillUnmount() {
        this.setState({
            docId: 0
        });
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
        this.checkDocumentIsView();
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.document && nextProps.document.id) {
            this.setState({
                document: nextProps.document,
                hasWorkflow: nextProps.hasWorkflow
            });

            dataservice.GetRowById("getLogsDrawingsCyclesForEdit?id=" + nextProps.document.id).then(result => {
                let data = { items: result };
                this.props.actions.ExportingData(data);
                this.setState({
                    drawingCycle: { ...result }
                });



                this.fillDropDowns(nextProps.document.id > 0 ? true : false);
            });
            this.checkDocumentIsView();
        }
    };

    componentDidUpdate(prevProps) {
        if (this.props.hasWorkflow !== prevProps.hasWorkflow) {
            this.checkDocumentIsView();
        }
    }

    checkDocumentIsView() {
        if (isModification === true) {
            if (this.props.changeStatus === true) {
                if (!(Config.IsAllow(3517))) {
                    this.setState({ isViewMode: true });
                }
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

    componentWillMount() {

        let drawingCycle = {
            drawingId: null,
            subject: 'Cycle No. R ',
            status: 'true',
            approvalStatusId: '',
            docDate: moment(),
            approvedDate: moment(),
            flowCompanyId: '',
            flowContactId: '',
            progressPercent: 0
        };

        this.setState({
            drawingCycle: drawingCycle
        });

        if (this.state.docId > 0) {
            let url = "GetLogsDrawingsForEdit?id=" + this.state.docId
            let PageName = isModification === true ? 'drawing' : 'drawingModification'
            this.props.actions.documentForEdit(url, this.state.docTypeId, PageName);
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
                isModification: true,
                progressPercent: 0,
                approvalStatusId: ''
            };

            this.setState({
                document: drawing,
                drawingCycle: drawingCycle
            }, function () {
                this.GetNExtArrange();
            });
            this.fillDropDowns(false);
            this.props.actions.documentForAdding();
        }
    };

    fillSubDropDownInEdit(url, param, value, subField, subSelectedValue, subDatasource) {
        let action = url + "?" + param + "=" + value
        dataservice.GetDataList(action, 'contactName', 'id').then(result => {
            if (this.props.changeStatus === true) {
                let toSubField = this.state.document[subField];
                let targetFieldSelected = _.find(result, function (i) { return i.value == toSubField; });
                console.log(targetFieldSelected);
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
                let targetFieldSelected = _.find(result, function (i) { return i.value == toSubField; });
                console.log(targetFieldSelected);
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
                let companyId = this.props.document.bicCompanyId;
                if (companyId) {
                    this.setState({
                        selectedFromCompany: { label: this.props.document.bicCompanyName, value: companyId }
                    });
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

        dataservice.GetDataList("GetaccountsDefaultListForList?listType=approvalstatus", 'title', 'id').then(result => {
            if (isEdit) {
                let approvalStatusId = this.state.drawingCycle.approvalStatusId;
                let approvalStatus = {};
                if (approvalStatusId) {
                    approvalStatus = _.find(result, function (i) { return i.value == approvalStatusId; });
                    this.setState({
                        selectedApprovalStatusId: approvalStatus
                    });
                }
            }
            this.setState({
                approvalstatusList: [...result]
            });
        });

        dataservice.GetDataList("GetaccountsDefaultListForList?listType=discipline", 'title', 'id').then(result => {
            if (isEdit) {
                let disciplineId = this.props.document.disciplineId;
                let discpline = {};
                if (disciplineId) {
                    discpline = _.find(result, function (i) { return i.value == disciplineId; });

                    this.setState({
                        selectedDiscpline: discpline
                    });
                }
            }
            this.setState({
                discplines: [...result]
            });
        });

        dataservice.GetDataList("GetaccountsDefaultListForList?listType=reasonforissue", 'title', 'id').then(result => {
            if (isEdit) {
                let reasonForIssueId = this.props.document.reasonForIssueId;
                let reasonForIssue = {};
                if (reasonForIssueId) {
                    reasonForIssue = _.find(result, function (i) { return i.value == reasonForIssueId; });
                    this.setState({
                        selectedReasonForIssue: reasonForIssue
                    });
                }
            }
            this.setState({
                reasonForIssues: [...result]
            });
        });

        dataservice.GetDataList("GetaccountsDefaultListForList?listType=specssection", 'title', 'id').then(result => {
            if (isEdit) {
                let specsSectionId = this.props.document.specsSectionId;
                let specsSection = {};
                if (specsSectionId) {
                    specsSection = _.find(result, function (i) { return i.value == specsSectionId; });
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
        console.log(e.target.value, field)
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
        console.log(e.target.value, field)
        let original_document = { ...this.state.drawingCycle };

        let updated_document = {};

        updated_document[field] = e.target.value;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            drawingCycle: updated_document
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

        dataservice.addObject('EditLogDrawing', this.state.document).then(result => {
            this.setState({
                isLoading: true
            });

            toast.success(Resources["operationSuccess"][currentLanguage]);

            if (isModification === true) {
                this.props.history.push({
                    pathname: "/drawing/" + this.state.projectId
                });
            } else {
                this.props.history.push({
                    pathname: "/drawingModification/" + this.state.projectId
                });
            }
        });
    }

    //EditLogDrawingCycle
    saveDrawing(event) {
        let saveDocument = { ...this.state.document };

        saveDocument.docDate = moment(saveDocument.docDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
        saveDocument.projectId = this.state.projectId;

        dataservice.addObject('AddLogsDrawings', saveDocument).then(result => {
            this.setState({
                docId: result.id
            });

            let saveDocumentCycle = { ...this.state.drawingCycle };
            saveDocumentCycle.drawingId = result.id;
            saveDocumentCycle.docDate = moment(saveDocumentCycle.docDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS');

            dataservice.addObject('AddLogsDrawingsCycles', saveDocumentCycle).then(result => {

                toast.success(Resources["operationSuccess"][currentLanguage]);
            });
        });
    }

    saveAndExit(event) {
        if (isModification === true) {
            this.props.history.push({
                pathname: "/drawing/" + this.state.projectId
            });
        } else {
            this.props.history.push({
                pathname: "/drawingModification/" + this.state.projectId
            });
        }
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
                <HeaderDocument projectName={projectName} docTitle={isModification === true ? Resources.drawing[currentLanguage] : Resources.drawingModification[currentLanguage]} moduleTitle={Resources['designCoordination'][currentLanguage]} />
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
                                                    this.editDrawing();
                                                } else if (this.props.changeStatus === false && this.state.docId === 0) {
                                                    this.saveDrawing();
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
                                                                format={'DD/MM/YYYY'}
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
                                                            <div className={"ui input inputDev" + (errors.refDoc && touched.refDoc ? (" has-error") : "ui input inputDev")} >
                                                                <input type="text" className="form-control"
                                                                    id="refDoc"
                                                                    value={this.state.document.refDoc}
                                                                    name="refDoc"
                                                                    placeholder={Resources.refDoc[currentLanguage]}
                                                                    onBlur={(e) => {
                                                                        handleChange(e)
                                                                        handleBlur(e)
                                                                    }}
                                                                    onChange={(e) => this.handleChange(e, 'refNo')} />
                                                                {touched.refDoc ? (<em className="pError">{errors.refDoc}</em>) : null}

                                                            </div>
                                                        </div>

                                                        <div className="linebylineInput valid-input mix_dropdown">

                                                            <label className="control-label">{Resources.fromCompany[currentLanguage]}</label>
                                                            <div className="supervisor__company">
                                                                <div className="super_name">
                                                                    <Dropdown
                                                                        isMulti={false}
                                                                        data={this.state.fromContacts}
                                                                        selectedValue={this.state.selectedFromContact}
                                                                        handleChange={event => this.handleChangeDropDown(event, 'bicContactId', false, '', '', '', 'selectedFromContact')}

                                                                        onChange={setFieldValue}
                                                                        onBlur={setFieldTouched}
                                                                        error={errors.fromContactId}
                                                                        touched={touched.fromContactId}
                                                                        isClear={false}
                                                                        index="clientSelection-fromContactId"
                                                                        name="fromContactId"
                                                                        id="fromContactId" />
                                                                </div>
                                                                <div className="super_company">
                                                                    <Dropdown
                                                                        data={this.state.companies}
                                                                        isMulti={false}
                                                                        selectedValue={this.state.selectedFromCompany}
                                                                        handleChange={event => {
                                                                            this.handleChangeDropDown(event, 'bicCompanyId', true, 'fromContacts', 'GetContactsByCompanyId', 'companyId', 'selectedFromCompany', 'selectedFromContact')
                                                                        }}
                                                                        onChange={setFieldValue}
                                                                        onBlur={setFieldTouched}
                                                                        error={errors.fromCompanyId}
                                                                        touched={touched.fromCompanyId}

                                                                        index="fromCompanyId"
                                                                        name="fromCompanyId"
                                                                        id="fromCompanyId" />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="linebylineInput valid-input">
                                                            <Dropdown
                                                                title="discipline"
                                                                data={this.state.discplines}
                                                                selectedValue={this.state.selectedDiscpline}
                                                                handleChange={event => this.handleChangeDropDown(event, 'disciplineId', false, '', '', '', 'selectedDiscpline')}
                                                                index="drawingModification-discipline"
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
                                                                    value={this.state.document.apartment}
                                                                    name="fileNumber"
                                                                    placeholder={Resources.fileNumber[currentLanguage]}
                                                                    onChange={(e) => this.handleChange(e, 'fileNumber')} />
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div className="workingHours__cycle">
                                                        <header>
                                                            <h3 className="zero">{Resources["CycleDetails"][currentLanguage]}</h3>
                                                        </header>
                                                        <div className="proForm first-proform">

                                                            <div className="linebylineInput valid-input">
                                                                <label className="control-label">{Resources.subject[currentLanguage]}</label>
                                                                <div className={"inputDev ui input" + (errors.subjectCycle && touched.subjectCycle ? (" has-error") : !errors.subjectCycle && touched.subjectCycle ? (" has-success") : " ")} >
                                                                    <input name='subjectCycle' className="form-control fsadfsadsa"
                                                                        id="subjectCycle"
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
                                                                    format={'DD/MM/YYYY'}
                                                                    onChange={e => setFieldValue('docDate', e)}
                                                                    name="docDateCycle"
                                                                    startDate={this.state.drawingCycle.docDate}
                                                                    handleChange={e => this.handleChangeDateCycle(e, 'docDate')} />
                                                            </div>

                                                            <div className="linebylineInput valid-input alternativeDate">
                                                                <DatePicker
                                                                    title='dateApproved'
                                                                    format={'DD/MM/YYYY'}
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
                                                                            isMulti={false}
                                                                            data={this.state.flowContacts}
                                                                            selectedValue={this.state.selectedFlowContact}
                                                                            handleChange={event => this.handleChangeDropDownCycle(event, 'flowContactId', false, '', '', '', 'selectedFlowContact')}
                                                                            isClear={false}
                                                                            index="drawing-flowContactId"
                                                                            name="flowContactId"
                                                                            id="flowContactId" />
                                                                    </div>
                                                                    <div className="super_company">
                                                                        <Dropdown
                                                                            data={this.state.companies}
                                                                            isMulti={false}
                                                                            selectedValue={this.state.selectedFlowCompany}
                                                                            handleChange={event => {
                                                                                this.handleChangeDropDownCycle(event, 'flowCompanyId', true, 'flowContacts', 'GetContactsByCompanyId', 'companyId', 'selectedFlowCompany', 'selectedFlowContact')
                                                                            }}
                                                                            index="flowCompanyId"
                                                                            name="flowCompanyId"
                                                                            id="flowCompanyId" />
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

                                                                    isClear={false}
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
                                    {this.showBtnsNewCycle()}

                                </div>
                            </div>
                        </div>
                        {
                            this.props.changeStatus === true ?
                                <div className="approveDocument">
                                    <div className="approveDocumentBTNS">

                                        {this.state.isApproveMode === true ?
                                            <div >
                                                <button className="primaryBtn-1 btn " type="button" onClick={(e) => this.handleShowAction(actions[2])} >{Resources.approvalModalApprove[currentLanguage]}</button>
                                                <button className="primaryBtn-2 btn middle__btn" type="button" onClick={(e) => this.handleShowAction(actions[3])} >{Resources.approvalModalReject[currentLanguage]}</button>


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
)(withRouter(addEditModificationDrawing))