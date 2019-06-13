import React, { Component, Fragment } from "react";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import dataservice from "../../Dataservice";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import Resources from "../../resources.json";
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as communicationActions from '../../store/actions/communication';
import Config from "../../Services/Config.js";
import CryptoJS from 'crypto-js';
import moment from "moment";
import SkyLight from 'react-skylight';
import SendToWorkflow from '../../Componants/OptionsPanels/SendWorkFlow'
import { toast } from "react-toastify";
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument'


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
    toProjectName: Yup.string().required(Resources['itemDescription'][currentLanguage]),

    approvedQuantity: Yup.number().required(Resources['approvedQuantity'][currentLanguage])
        .typeError(Resources['onlyNumbers'][currentLanguage]),

    rejectedQuantity: Yup.number().required(Resources['rejectedQuantity'][currentLanguage])
        .typeError(Resources['onlyNumbers'][currentLanguage]),

    pendingQuantity: Yup.number().required(Resources['pendingQuantity'][currentLanguage])
        .typeError(Resources['onlyNumbers'][currentLanguage]),

})
class TransferInventory extends Component {

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
                    perviousRoute = obj.perviousRoute;
                    arrange = obj.arrange;
                } catch { this.props.history.goBack(); }
            }
            index++;
        }
        this.state = {
            isLoading: false,
            isEdit: false,
            currentTitle: "sendToWorkFlow",
            showModal: false,
            isViewMode: false,
            isApproveMode: isApproveMode,
            perviousRoute: perviousRoute,
            isView: false,
            docId: docId,
            docTypeId: 113,
            projectId: this.props.projectId === 0 ? localStorage.getItem('lastSelectedProject') : this.props.projectId,
            docApprovalId: docApprovalId,
            document: this.props.document ? Object.assign({}, this.props.document) : {},
            selectedProject: { label: Resources.contractPoSelection[currentLanguage], value: "0" },
            ProjectsData: [],
            permission: [
                { name: "sendToWorkFlow", code: 3775 },
            ],
            approvedQuantity: 0,
            rejectedQuantity: 0,
            pendingQuantity: 0,
        }

        if (!Config.IsAllow(3773) && !Config.IsAllow(3774)) {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push(
                this.state.perviousRoute
            );
        }
    }

    componentDidMount() {
        var links = document.querySelectorAll(".noTabs__document .doc-container .linebylineInput");
        for (var i = 0; i < links.length; i++) {
            if ((i + 1) % 2 == 0) { links[i].classList.add("even") }
            else { links[i].classList.add("odd") }
        }
        //        this.checkDocumentIsView()
    }

    componentWillReceiveProps(nextProps, prevProps) {
        if (nextProps.document.id) {
            let doc = nextProps.document
            this.setState({ isEdit: true, document: doc, hasWorkflow: this.props.hasWorkflow })
            let isEdit = nextProps.document.id > 0 ? true : false
            this.fillDropDowns(isEdit);
            //            this.checkDocumentIsView();
        }
        if (nextProps.projectId !== this.props.projectId) {
          
            this.setState({ projectId: nextProps.projectId, })
        }
        //alert('recieve....' + this.state.showModal + '.....' + nextProps.showModal);
        if (this.state.showModal != nextProps.showModal) {
            this.setState({ showModal: nextProps.showModal });
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.hasWorkflow !== prevProps.hasWorkflow || this.props.changeStatus !== prevProps.changeStatus) {
            //            this.checkDocumentIsView();
        }
    }

    componentWillMount() {
        let url = "GetRequestTransferItemEdit?id=" + this.state.docId;
        this.props.actions.documentForEdit(url, this.state.docTypeId, 'materialDelivery')
    }

    fillDropDowns(isEdit) {

        dataservice.GetDataList('ProjectProjectsGetAllExceptprojectId?projectId=' + this.state.projectId, 'projectName', 'projectId').then(result => {
            if (isEdit) {
                let id = this.props.document.toProjectId;
                let selectedValue = {};
                if (id) {
                    selectedValue = _.find(result, function (i) { return i.value === id });
                    this.setState({ selectedProject: selectedValue })
                }
            }
            this.setState({ ProjectsData: [...result] })
        })
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

    handleChangeDropDown = (event) => {
        if (event == null) return
        let original_document = { ...this.state.document }
        let updated_document = {};
        updated_document['fromProjectId'] = this.state.document.toProjectId;
        updated_document = Object.assign(original_document, updated_document);
        this.setState({ document: updated_document, selectedProject: event })
    }

    HandelChangeInputs = (e, field) => {
        let original_document = { ...this.state.document };
        let updated_document = {}
        updated_document[field] = e.target.value;
        updated_document = Object.assign(original_document, updated_document);
        this.setState({ document: updated_document })
    }

    componentWillUnmount() {
        this.props.actions.clearCashDocument();
        this.setState({ docId: 0 })
    }

    executeBeforeModalClose = (e) => {
        this.setState({ showModal: false });
    }

    showBtnsSaving() {
        let btn = null;

        if (this.state.docId === 0) {
            btn = (
                <button className="primaryBtn-1 btn meduimBtn" type="submit">
                    {Resources.save[currentLanguage]}
                </button>
            );
        } else if (this.state.docId > 0 && this.props.changeStatus === false) {
            btn = (
                <button className="primaryBtn-1 btn mediumBtn" type="submit">
                    {Resources.save[currentLanguage]}
                </button>
            );
        }
        return btn;
    }

    saveDoc = () => {
        let obj = {
            id: this.state.document.id,
            fromProjectId: this.state.document.fromProjectId,
            toProjectId: this.state.selectedProject.value,
            approvedQuantity: this.state.document.approvedQuantity,
            rejectedQuantity: this.state.document.rejectedQuantity,
            pendingQuantity: this.state.document.pendingQuantity,
            inventoryId: this.state.document.inventoryId
        }
        dataservice.addObject('saveTransferMaterialInventory', obj).then(
            res => {
                toast.success(Resources["operationSuccess"][currentLanguage]);

                this.props.history.push("/materialInventory/" + this.state.projectId);
            }
        ).catch(ex => {
            toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
        })
    }

    render() {

        let actions = [
            { title: "sendToWorkFlow", value: <SendToWorkflow docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />, label: Resources["sendToWorkFlow"][currentLanguage] },
        ]


        let StepOne = () => {
            return (
                <div className="document-fields">
                    <Formik
                        initialValues={{
                            toProjectName: this.state.document.toProjectName,
                            approvedQuantity: this.state.document.approvedQuantity,
                            pendingQuantity: this.state.document.pendingQuantity,
                            rejectedQuantity: this.state.document.rejectedQuantity,
                        }}
                        validationSchema={validationSchema}
                        enableReinitialize={true}
                        onSubmit={values => {
                            if (this.props.showModal) { return; }
                            this.saveDoc()
                        }}>
                        {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                            <Form id="QsForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>
                                <div className="proForm datepickerContainer">

                                    <div className="linebylineInput valid-input">
                                        <Dropdown title="contractPo" data={this.state.ProjectsData} selectedValue={this.state.selectedProject}
                                            handleChange={e => this.handleChangeDropDown(e)}
                                            onChange={setFieldValue} onBlur={setFieldTouched} error={errors.toProjectName}
                                            touched={touched.toProjectName} name="toProjectName" id="toProjectName" />
                                    </div>

                                    <div className="linebylineInput valid-input">
                                        <label className="control-label">{Resources['approvedQuantity'][currentLanguage]} </label>
                                        <div className={"inputDev ui input " + (errors.approvedQuantity ? 'has-error' : !errors.approvedQuantity && touched.approvedQuantity ? (" has-success") : " ")}>
                                            <input name='approvedQuantity' className="form-control" autoComplete='off' placeholder={Resources['approvedQuantity'][currentLanguage]}
                                                value={this.state.document.approvedQuantity} onChange={e => this.HandelChangeInputs(e, 'approvedQuantity')}
                                                onBlur={(e) => {
                                                    handleBlur(e)
                                                    handleChange(e)
                                                }}
                                            />
                                            {errors.approvedQuantity ? (<em className="pError">{errors.approvedQuantity}</em>) : null}
                                        </div>
                                    </div>

                                    <div className="linebylineInput valid-input">
                                        <label className="control-label">{Resources['pendingQuantity'][currentLanguage]} </label>
                                        <div className={"inputDev ui input " + (errors.pendingQuantity ? 'has-error' : !errors.pendingQuantity && touched.pendingQuantity ? (" has-success") : " ")}>
                                            <input name='pendingQuantity' className="form-control" autoComplete='off' placeholder={Resources['pendingQuantity'][currentLanguage]}
                                                value={this.state.document.pendingQuantity} onChange={e => this.HandelChangeInputs(e, 'pendingQuantity')}
                                                onBlur={(e) => {
                                                    handleBlur(e)
                                                    handleChange(e)
                                                }}
                                            />
                                            {errors.pendingQuantity ? (<em className="pError">{errors.pendingQuantity}</em>) : null}
                                        </div>
                                    </div>

                                    <div className="linebylineInput valid-input">
                                        <label className="control-label">{Resources['rejectedQuantity'][currentLanguage]} </label>
                                        <div className={"inputDev ui input " + (errors.rejectedQuantity ? 'has-error' : !errors.rejectedQuantity && touched.rejectedQuantity ? (" has-success") : " ")}>
                                            <input name='rejectedQuantity' className="form-control" autoComplete='off' placeholder={Resources['rejectedQuantity'][currentLanguage]}
                                                value={this.state.document.rejectedQuantity} onChange={e => this.HandelChangeInputs(e, 'rejectedQuantity')}
                                                onBlur={(e) => {
                                                    handleBlur(e)
                                                    handleChange(e)
                                                }} />
                                            {errors.rejectedQuantity ? (<em className="pError">{errors.rejectedQuantity}</em>) : null}
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
                                                <button className={this.state.isViewMode === true ? "primaryBtn-1 btn middle__btn disNone" : "primaryBtn-1 btn middle__btn"} >{Resources.save[currentLanguage]}</button>
                                            }

                                            <button type="button" className="primaryBtn-2 btn middle__btn" onClick={(e) => this.handleShowAction(actions[0])}>{Resources.sendToWorkFlow[currentLanguage]}</button>

                                            <span className="border"></span>

                                        </div>
                                    </div>
                                    : null}

                                <div className="doc-pre-cycle letterFullWidth">
                                    <div>
                                        {this.props.changeStatus === true ?
                                            <ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                            : null}
                                    </div>
                                </div>

                                <div className="slider-Btns">
                                    {/* {this.showBtnsSaving()} */}
                                    <button className="primaryBtn-1 btn meduimBtn" type="submit">
                                        {Resources.save[currentLanguage]}
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>

            )
        }

        return (
            <div className="mainContainer">
                <div className="documents-stepper noTabs__document">
                    <HeaderDocument projectName={projectName} isViewMode={false} docTitle={Resources.transferToProject[currentLanguage]} moduleTitle={Resources["procurement"][currentLanguage]} />
                    <div className="doc-container">

                        <div className="step-content">

                            {this.props.changeStatus == true ?
                                <header className="main__header">
                                    <div className="main__header--div">
                                        <h2 className="zero"> {Resources.goEdit[currentLanguage]} </h2>
                                        <p className="doc-infohead"><span> {this.state.document.refDoc}</span> - <span> {this.state.document.arrange}</span> - <span>{moment(this.state.document.docDate).format('DD/MM/YYYY')}</span></p>
                                    </div>
                                </header> : null}
                            {StepOne()}

                        </div>
                        <div className="largePopup largeModal " style={{ display: this.state.showModal ? 'block' : 'none' }}>
                            <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref} title={Resources[this.state.currentTitle][currentLanguage]}
                                beforeClose={() => { this.executeBeforeModalClose() }}>  {this.state.currentComponent}
                            </SkyLight>
                        </div>
                    </div>
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
        hasWorkflow: state.communication.hasWorkflow,
        projectId: state.communication.projectId,
        showModal: state.communication.showModal
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(TransferInventory))