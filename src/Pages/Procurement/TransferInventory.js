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
import DocumentActions from '../../Componants/OptionsPanels/DocumentActions';

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
let docId = 0;
let isTransferAdd = false;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let perviousRoute = '';
let arrange = 0;
const find = require('lodash/find')

const validationSchema = Yup.object().shape({
    fromProjectId: Yup.string().required(Resources['projectSelection'][currentLanguage]).nullable(true),

    approvedQuantity: Yup.number().required(Resources['approvedQuantity'][currentLanguage])
        .typeError(Resources['onlyNumbers'][currentLanguage])

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
                    isTransferAdd = obj.isTransferAdd;
                } catch { this.props.history.goBack(); }
            }
            index++;
        }
        this.state = {
            isLoading: false,
            isEdit: false,
            isViewMode: false,
            isApproveMode: isApproveMode,
            perviousRoute: perviousRoute,
            isView: false,
            docId: docId,
            docTypeId: 113,
            projectId: this.props.projectId === 0 ? localStorage.getItem('lastSelectedProject') : this.props.projectId,
            docApprovalId: docApprovalId,
            document: this.props.document ? Object.assign({}, this.props.document) : {},
            selectedProject: { label: Resources.projectName[currentLanguage], value: "0" },
            ProjectsData: [],
            permission: [
                { name: 'sendByEmail', code: '0' },
                { name: 'sendByInbox', code: '0' },
                { name: 'sendTask', code: '0' },
                { name: 'distributionList', code: '0' },
                { name: 'createTransmittal', code: '0' },
                { name: 'sendToWorkFlow', code: 3775 },
                { name: 'viewAttachments', code: '0' },
                { name: 'deleteAttachments', code: '0' }],
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
        if (isTransferAdd != true) {
            let url = "GetRequestTransferItemEdit?id=" + this.state.docId;

            dataservice.GetDataGrid(url).then(result => {

                this.setState({
                    document: result
                });
                let selectedValue = { value: result.toProjectId, label: result.toProjectName };
                this.setState({ selectedProject: selectedValue });
            })

        }
        this.fillDropDowns(true);
    }

    fillDropDowns(isEdit) {

        dataservice.GetDataList('ProjectProjectsGetAllExceptprojectId?projectId=' + this.state.projectId, 'projectName', 'projectId').then(result => {
            if (isEdit) {
                let id = this.state.document.toProjectId;
                // let selectedValue = {};
                //if (id) {
                //selectedValue = find(result, function (i) { return i.id === id });
                // this.setState({ selectedProject: selectedValue })
                // }
            }
            this.setState({ ProjectsData: [...result] })
        })
    }

    handleChangeDropDown = (event) => {
        if (event == null) return

        let original_document = { ...this.state.document }
        let updated_document = {};

        updated_document['fromProjectId'] = event.value;
        updated_document = Object.assign(original_document, updated_document);

        this.setState({ document: updated_document, selectedProject: event })
    }

    HandelChangeInputs = (e, field) => {
        let original_document = { ...this.state.document };
        let updated_document = {}
        updated_document[field] = e.target.value;
        //updated_document['fromProjectId'] = original_document.fromProjectId;
        updated_document = Object.assign(original_document, updated_document);
        this.setState({ document: updated_document })
    }

    componentWillUnmount() {
        this.props.actions.clearCashDocument();
        this.setState({ docId: 0 })
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
            id: 0,
            fromProjectId: this.state.document.projectId,
            toProjectId: this.state.selectedProject.value,
            approvedQuantity: this.state.document.approvedQuantity,
            rejectedQuantity: this.state.document.rejectedQuantity,
            pendingQuantity: this.state.document.pendingQuantity,
            inventoryId: this.state.document.id
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

    showOptionPanel = () => {
        this.props.actions.showOptionPanel(true);
    }

    render() {

        let StepOne = () => {
            return (
                <div className="document-fields">
                    <Formik
                        initialValues={{
                            fromProjectId: this.state.document.fromProjectId,
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
                                        <Dropdown
                                            onChange={setFieldValue}
                                            onBlur={setFieldTouched}
                                            error={errors.fromProjectId}
                                            touched={touched.fromProjectId}

                                            name="fromProjectId"
                                            id="fromProjectId"
                                            index="fromProjectId"

                                            title="Project"
                                            data={this.state.ProjectsData}
                                            selectedValue={this.state.selectedProject}
                                            handleChange={e => this.handleChangeDropDown(e)}
                                        //em={touched.project}
                                        />
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

                                    {isTransferAdd != true ?
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
                                        </div>
                                        : null}
                                </div>
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
                    <HeaderDocument projectName={projectName} isViewMode={false} docTitle={Resources.transferToProject[currentLanguage]} perviousRoute={this.state.perviousRoute} moduleTitle={Resources["procurement"][currentLanguage]} />
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