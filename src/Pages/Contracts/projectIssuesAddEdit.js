import React, { Component } from "react";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import dataservice from "../../Dataservice";
import UploadAttachment from '../../Componants/OptionsPanels/UploadAttachment'
import ViewAttachment from '../../Componants/OptionsPanels/ViewAttachmments'
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import Resources from "../../resources.json";
import DatePicker from '../../Componants/OptionsPanels/DatePicker';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Config from "../../Services/Config.js";
import CryptoJS from 'crypto-js';
import moment from "moment";
import * as communicationActions from '../../store/actions/communication';
import { toast } from "react-toastify";
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument'
import DocumentActions from '../../Componants/OptionsPanels/DocumentActions'

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const validationSchema = Yup.object().shape({
    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),
    description: Yup.string().required(Resources['descriptionRequired'][currentLanguage])
});

let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let perviousRoute = '';
let arrange = 0;

const _ = require('lodash');

class ProjectIssuesAddEdit extends Component {

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
            isLoading: false,
            isViewMode: false,
            viewModel: false,
            isApproveMode: isApproveMode,
            docId: docId,
            docTypeId: 18,
            projectId: projectId,
            docApprovalId: docApprovalId,
            perviousRoute: perviousRoute,
            arrange: arrange,
            document: this.props.document ? Object.assign({}, this.props.document) : {},
            permission: [{ name: 'sendByEmail', code: 26 },
            { name: 'sendByInbox', code: 25 },
            { name: 'sendTask', code: 0 },
            { name: 'distributionList', code: 947 },
            { name: 'createTransmittal', code: 3033 },
            { name: 'sendToWorkFlow', code: 700 },
            { name: 'viewAttachments', code: 3798 },
            { name: 'deleteAttachments', code: 3799 }]
        }

        if (!Config.IsAllow(20) && !Config.IsAllow(21) && !Config.IsAllow(23)) {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push(
                this.state.perviousRoute
            );
        }
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

    componentWillUnmount() {
        this.props.actions.clearCashDocument();
        this.setState({
            docId: 0
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.document.id) {
            nextProps.document.docDate = nextProps.document.docDate != null ? moment(nextProps.document.docDate).format('YYYY-MM-DD') : moment();
            nextProps.document.openDate = nextProps.document.openDate != null ? moment(nextProps.document.openDate).format('YYYY-MM-DD') : moment();
            nextProps.document.dueDate = nextProps.document.dueDate != null ? moment(nextProps.document.dueDate).format('YYYY-MM-DD') : moment();

            this.setState({
                document: nextProps.document,
                hasWorkflow: nextProps.hasWorkflow
            });

            this.checkDocumentIsView();
        }
    };

    componentDidUpdate(prevProps) {
        if (this.props.hasWorkflow !== prevProps.hasWorkflow || this.props.changeStatus !== prevProps.changeStatus) {
            this.checkDocumentIsView();
        }
    }

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!(Config.IsAllow(21))) {
                this.setState({ isViewMode: true });
            }
            if (this.state.isApproveMode != true && Config.IsAllow(21)) {
                if (this.props.hasWorkflow == false && Config.IsAllow(21)) {
                    if (this.props.document.status !== false && Config.IsAllow(21)) {
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
            let url = "GetContractsProjectIssuesForEdit?id=" + this.state.docId;
            this.props.actions.documentForEdit(url, this.state.docTypeId, 'projectIssuesLog');
        } else {
            const projectIssuesDocument = {
                id: 0,
                projectId: projectId,
                arrange: "1",
                subject: "",
                status: "true",
                docDate: moment(),
                openDate: moment(),
                dueDate: moment(),
                description: ""
            };

            this.setState({
                document: projectIssuesDocument
            });
            this.props.actions.documentForAdding();
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

    editProjectIssues(event) {
        this.setState({
            isLoading: true
        });

        let saveDocument = this.state.document;

        saveDocument.docDate = moment(saveDocument.docDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
        saveDocument.openDate = moment(saveDocument.openDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
        saveDocument.dueDate = moment(saveDocument.dueDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');

        dataservice.addObject('EditContractsProjectIssues', saveDocument).then(result => {
            this.setState({
                isLoading: true
            });

            toast.success(Resources["operationSuccess"][currentLanguage]);
            if (this.state.isApproveMode === false) {
                this.props.history.push(
                    this.state.perviousRoute
                );
            }
        }).catch(ex => toast.error(Resources["failError"][currentLanguage]));
    }

    saveProjectIssues(event) {
        let saveDocument = { ...this.state.document };

        saveDocument.docDate = moment(saveDocument.docDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
        saveDocument.openDate = moment(saveDocument.openDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
        saveDocument.dueDate = moment(saveDocument.dueDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');

        dataservice.addObject('AddContractsProjectIssues', saveDocument).then(result => {

            this.setState({
                docId: result.id
            });

            toast.success(Resources["operationSuccess"][currentLanguage]);
        }).catch(ex => toast.error(Resources["failError"][currentLanguage]));
    }

    saveAndExit(event) {
        this.props.history.push("/projectIssues/" + this.state.projectId);
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
        return this.state.docId > 0 ? (
            Config.IsAllow(3300) === true ? (
                <ViewAttachment isApproveMode={this.state.isViewMode} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} deleteAttachments={866} />
            ) : null
        ) : null;
    }

    showOptionPanel = () => {
        this.props.actions.showOptionPanel(true);
    }

    render() {

        return (
            <div className="mainContainer">
                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document readOnly_inputs" : "documents-stepper noTabs__document"}>
                    <HeaderDocument projectName={projectName} isViewMode={this.state.isViewMode} perviousRoute={this.state.perviousRoute} docTitle={Resources.projectIssuesLog[currentLanguage]} moduleTitle={Resources['contracts'][currentLanguage]} />
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
                                </header> : null
                        }
                        <div className="step-content">
                            <div id="step1" className="step-content-body">
                                <div className="subiTabsContent">
                                    <div className="document-fields">
                                        <Formik initialValues={{ ...this.state.document }}
                                            validationSchema={validationSchema}
                                            enableReinitialize={this.props.changeStatus}
                                            onSubmit={(values) => {

                                                if (this.props.showModal) { return; }

                                                if (this.props.changeStatus === true && this.state.docId > 0) {
                                                    this.editProjectIssues();
                                                } else if (this.props.changeStatus === false && this.state.docId === 0) {
                                                    this.saveProjectIssues();
                                                } else {
                                                    this.saveAndExit();
                                                }
                                            }}>
                                            {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                                                <Form id="projectIssueForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>
                                                    <div className="proForm first-proform">
                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.subject[currentLanguage]}</label>
                                                            <div className={"inputDev ui input" + (errors.subject && touched.subject ? (" has-error") : !errors.subject && touched.subject ? (" has-success") : " ")} >
                                                                <input name='subject' className="form-control fsadfsadsa" id="subject"
                                                                    placeholder={Resources.subject[currentLanguage]}
                                                                    autoComplete='off' value={this.state.document.subject}
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
                                                                handleChange={e => this.handleChangeDate(e, 'docDate')}
                                                                name="docDate"
                                                                startDate={this.state.document.docDate}
                                                            />
                                                        </div>

                                                        <div className="linebylineInput valid-input alternativeDate">
                                                            <DatePicker title='openDate'
                                                                handleChange={e => this.handleChangeDate(e, 'openDate')}
                                                                name="openDate"
                                                                startDate={this.state.document.openDate} />
                                                        </div>

                                                        <div className="linebylineInput valid-input alternativeDate">
                                                            <DatePicker title='dueDate'
                                                                handleChange={e => this.handleChangeDate(e, 'dueDate')}
                                                                name="dueDate"
                                                                startDate={this.state.document.dueDate} />
                                                        </div>

                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.description[currentLanguage]}</label>
                                                            <div className={"ui input inputDev" + (errors.description && touched.description ? (" has-error") : "ui input inputDev")} >
                                                                <input type="text" className="form-control" id="description"
                                                                    value={this.state.document.description}
                                                                    name="description"
                                                                    placeholder={Resources.description[currentLanguage]}
                                                                    onBlur={(e) => { handleChange(e); handleBlur(e) }}
                                                                    onChange={(e) => this.handleChange(e, 'description')} />
                                                                {errors.description && touched.description ? (<em className="pError">{errors.description}</em>) : null}
                                                            </div>
                                                        </div>
                                                        {this.props.changeStatus == true ?
                                                            < div className="linebylineInput valid-input">
                                                                <label className="control-label">{Resources.arrange[currentLanguage]}</label>
                                                                <div className={"ui input inputDev " + (errors.arrange && touched.arrange ? (" has-error") : " ")}>
                                                                    <input type="text" className="form-control" id="arrange" readOnly
                                                                        value={this.state.document.arrange}
                                                                        name="arrange"
                                                                        placeholder={Resources.arrange[currentLanguage]}
                                                                        onBlur={(e) => { handleChange(e); handleBlur(e) }}
                                                                        onChange={(e) => this.handleChange(e, 'arrange')} />
                                                                </div>
                                                            </div>
                                                            : null
                                                        }
                                                    </div>
                                                    <div className="slider-Btns">
                                                        {
                                                            this.state.isLoading === false ? this.showBtnsSaving() :
                                                                (<button className="primaryBtn-1 btn disabled">
                                                                    <div className="spinner">
                                                                        <div className="bounce1" />
                                                                        <div className="bounce2" />
                                                                        <div className="bounce3" />
                                                                    </div>
                                                                </button>)
                                                        }
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
                                                                        previousRoute={this.state.previousRoute}
                                                                        docApprovalId={this.state.docApprovalId}
                                                                        currentArrange={this.state.arrange}
                                                                        showModal={this.props.showModal}
                                                                        showOptionPanel={this.showOptionPanel}
                                                                        permission={this.state.permission}
                                                                    />
                                                                </div>
                                                            </div> : null
                                                    }
                                                </Form>
                                            )}
                                        </Formik>
                                    </div>
                                    <div className="doc-pre-cycle letterFullWidth">
                                        <div>
                                            {this.state.docId > 0 && this.state.isViewMode === false ? (<UploadAttachment changeStatus={this.props.changeStatus} AddAttachments={865} EditAttachments={3259} ShowDropBox={3577} ShowGoogleDrive={3578} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />) : null}
                                            {this.viewAttachments()}
                                            {this.props.changeStatus === true ? <ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} /> : null}
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
        file: state.communication.file,
        files: state.communication.files,
        hasWorkflow: state.communication.hasWorkflow,
        showModal: state.communication.showModal,
        viewModel: state.communication.viewModel
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProjectIssuesAddEdit))