import CryptoJS from "crypto-js";
import { Form, Formik } from "formik";
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { bindActionCreators } from "redux";
import DatePicker from "../../Componants/OptionsPanels/DatePicker";
import DocumentActions from '../../Componants/OptionsPanels/DocumentActions';
import HeaderDocument from "../../Componants/OptionsPanels/HeaderDocument";
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import { default as dataservice } from "../../Dataservice";
import Resources from "../../resources.json";
import Config from "../../Services/Config.js";
import * as communicationActions from "../../store/actions/communication";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

let docId = 0;
let projectId = 0;
let projectName = "";
let isApproveMode = 0;
let docApprovalId = 0;
let perviousRoute = 0;
let arrange = 0;

class PaymentCertificationAddEdit extends Component {

    constructor(props) {

        super(props);

        const query = new URLSearchParams(this.props.location.search);

        let index = 0;

        for (let param of query.entries()) {
            if (index === 0) {
                try {
                    let obj = JSON.parse(CryptoJS.enc.Base64.parse(param[1]).toString(CryptoJS.enc.Utf8));

                    docId = obj.docId;
                    projectId = obj.projectId;
                    projectName = obj.projectName;
                    isApproveMode = obj.isApproveMode;
                    docApprovalId = obj.docApprovalId;
                    arrange = obj.arrange;
                    perviousRoute = obj.perviousRoute;
                } catch {
                    this.props.history.goBack();
                }
            }
            index++;
        }

        this.state = {
            LoadingPage: false,
            docTypeId: 120,
            selectedRow: {},
            pageNumber: 0,
            pageSize: 2000,
            isViewMode: false,
            isApproveMode: isApproveMode,
            perviousRoute: perviousRoute,
            docId: docId,
            projectId: projectId,
            docApprovalId: docApprovalId,
            arrange: arrange,
            rows: [],
            document: {
                id: 0,
                contractId: "",
                contractSubject: "",
                requestId: "",
                requestSubject: "",
                contractRefNumber: "",
                contractName: "",
                projectId: "",
                projectName: "",
                clientName: "",
                percentageOfWorkDone: 0,
                contractAmount: 0,
                creationDate: "",
                invoiceSubmissionDate: "",
                consultantApproalDate: "",
                hasWorkflow: false
            },
            isLoading: true,
            rowsDocument: [3, 4, 5, 9, 13],
            permission: [{ name: "sendByEmail", code: 54 },
            { name: "sendToWorkFlow", code: 10071 }
            ]
        };

        if (!Config.IsAllow(10069)) {
            toast.warning(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push(this.state.perviousRoute);
        }
    }

    checkDocumentIsView() {

        if (!Config.IsAllow(10069)) {
            this.setState({ isViewMode: true });
        } else if (this.state.isApproveMode !== true && Config.IsAllow(10069)) {
            if (this.props.hasWorkflow === false && Config.IsAllow(10069)) {
                if (this.props.document.status !== false && Config.IsAllow(10069)) {
                    this.setState({ isViewMode: false });
                } else {
                    this.setState({ isViewMode: true });
                }
            } else {
                this.setState({ isViewMode: true });
            }
        }
    }

    componentWillUnmount() {
        this.props.actions.clearCashDocument();
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

        this.checkDocumentIsView();

        this.props.actions.documentForEdit("GetPaymentCertificationById?id=" + this.state.docId, "Payment Certification");

        this.props.actions.getItems("GetPaymentCertificationDetails?id=" + this.state.docId, "Payment Certification");

    }

    static getDerivedStateFromProps(nextProps, state) {
        if (nextProps.items.length !== state.rows.length && nextProps.document.id !== state.document.id && nextProps.changeStatus === true) {

            return {
                document: nextProps.document,
                rows: nextProps.items
            };
        }
        return null
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

    showOptionPanel = () => {
        this.props.actions.showOptionPanel(true);
    }

    updateDocument() {
        let objDocument = this.state.document;

        dataservice.addObject("UpdateContractsPaymentsCertification", objDocument).then(res => {
            this.props.history.push('/paymentCertification/' + this.state.projectId);
            toast.success(Resources["operationSuccess"][currentLanguage]);
        })
    }

    render() {

        let interimTable = this.state.rows.length > 0 ?
            this.state.rows.map(i => (
                <tr key={i.id}>
                    <td colSpan="3">
                        <div className="contentCell tableCell-2">
                            <p style={{ fontWeight: this.state.rowsDocument.indexOf(i.refCode) > -1 ? 'bold' : '' }}>{i.description}</p>
                        </div>
                    </td>
                    <td colSpan="3">
                        <div className="contentCell tableCell-2">
                            <p style={{ fontWeight: this.state.rowsDocument.indexOf(i.refCode) > -1 ? 'bold' : '' }}>{i.contractAmount}</p>
                        </div>
                    </td>
                    <td colSpan="1">
                        <div className="contentCell">
                            <p style={{ fontWeight: this.state.rowsDocument.indexOf(i.refCode) > -1 ? 'bold' : '' }}>{i.contractorPrevoiuse}</p>
                        </div>
                    </td>
                    <td colSpan="1">
                        <div className="contentCell">
                            <p style={{ fontWeight: this.state.rowsDocument.indexOf(i.refCode) > -1 ? 'bold' : '' }}>{i.contractorCurrentValue}</p>
                        </div>
                    </td>
                    <td colSpan="1">
                        <div className="contentCell">
                            <p style={{ fontWeight: this.state.rowsDocument.indexOf(i.refCode) > -1 ? 'bold' : '' }}>{i.contractorTotal}</p>
                        </div>
                    </td>
                    <td colSpan="1">
                        <div className="contentCell">
                            <p style={{ fontWeight: this.state.rowsDocument.indexOf(i.refCode) > -1 ? 'bold' : '' }}>{i.prevoiuse}</p>
                        </div>
                    </td>
                    <td colSpan="1">
                        <div className="contentCell">
                            <p style={{ fontWeight: this.state.rowsDocument.indexOf(i.refCode) > -1 ? 'bold' : '' }}>{i.currentValue}</p>
                        </div>
                    </td>
                    <td colSpan="1">
                        <div className="contentCell">
                            <p style={{ fontWeight: this.state.rowsDocument.indexOf(i.refCode) > -1 ? 'bold' : '' }}>{i.total}</p>
                        </div>
                    </td>
                    <td colSpan="3">
                        <div className="contentCell">
                            <p style={{ fontWeight: this.state.rowsDocument.indexOf(i.refCode) > -1 ? 'bold' : '' }}>{i.totalDeduction}</p>
                        </div>
                    </td>
                    <td colSpan="3">
                        <div className="contentCell">
                            {i.remarks}
                        </div>
                    </td>

                </tr>
            )) : ""
        return (
            <Fragment>
                <div className="mainContainer">
                    <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document one__tab one_step readOnly_inputs" : "documents-stepper noTabs__document one__tab one_step"}>
                        <HeaderDocument
                            projectName={projectName}
                            isViewMode={this.state.isViewMode}
                            perviousRoute={this.state.perviousRoute}
                            docTitle={Resources.paymentCertificationLog[currentLanguage]}
                            moduleTitle={
                                Resources["contracts"][currentLanguage]
                            }
                        />
                        <div className="doc-container">
                            <div className="step-content">
                                {this.state.LoadingPage ? (<LoadingSection />) : (
                                    <Fragment>
                                        <div className="subiTabsContent">
                                            <div className="document-fields">
                                                <Formik
                                                    enableReinitialize={true}
                                                    onSubmit={values => {
                                                        this.updateDocument();
                                                    }}>
                                                    {({ handleBlur, handleSubmit, values }) => (
                                                        <Form
                                                            id="ClientSelectionForm"
                                                            className="customProform"
                                                            noValidate="novalidate"
                                                            onSubmit={handleSubmit}>
                                                            <div className="proForm datepickerContainer">
                                                                <div className="linebylineInput  fullInputWidth">
                                                                    <label className="control-label">
                                                                        {Resources["contractSubject"][currentLanguage]}
                                                                    </label>
                                                                    <div className="inputDev ui input ">
                                                                        <input name="contractSubject" className="form-control" id="contractSubject"
                                                                            placeholder={Resources["contractSubject"][currentLanguage]}
                                                                            autoComplete="off"
                                                                            value={this.state.document.contractSubject}
                                                                            readOnly
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="linebylineInput  fullInputWidth">
                                                                    <label className="control-label">
                                                                        {Resources["contractorName"][currentLanguage]}
                                                                    </label>
                                                                    <div className="inputDev ui input ">
                                                                        <input name="contractorName" className="form-control" id="contractorName"
                                                                            placeholder={Resources["contractorName"][currentLanguage]}
                                                                            autoComplete="off"
                                                                            value={this.state.document.contractName}
                                                                            readOnly
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="linebylineInput  fullInputWidth">
                                                                    <label className="control-label">
                                                                        {Resources["contractorRefNumber"][currentLanguage]}
                                                                    </label>
                                                                    <div className="inputDev ui input ">
                                                                        <input name="contractorRefNumber" className="form-control" id="contractorRefNumber"
                                                                            placeholder={Resources["contractorRefNumber"][currentLanguage]}
                                                                            autoComplete="off"
                                                                            value={this.state.document.contractRefNumber}
                                                                            readOnly
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="linebylineInput  fullInputWidth">
                                                                    <label className="control-label">
                                                                        {Resources["projectName"][currentLanguage]}
                                                                    </label>
                                                                    <div className="inputDev ui input ">
                                                                        <input name="projectName" className="form-control" id="projectName"
                                                                            placeholder={Resources["projectName"][currentLanguage]}
                                                                            autoComplete="off"
                                                                            value={this.state.document.projectName}
                                                                            readOnly
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="linebylineInput  fullInputWidth">
                                                                    <label className="control-label">
                                                                        {Resources["requestSubject"][currentLanguage]}
                                                                    </label>
                                                                    <div className="inputDev ui input ">
                                                                        <input name="requestSubject" className="form-control" id="requestSubject"
                                                                            placeholder={Resources["requestSubject"][currentLanguage]}
                                                                            autoComplete="off"
                                                                            value={this.state.document.requestSubject}
                                                                            readOnly
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="linebylineInput  fullInputWidth">
                                                                    <label className="control-label">
                                                                        {Resources["clientName"][currentLanguage]}
                                                                    </label>
                                                                    <div className="inputDev ui input ">
                                                                        <input name="clientName" className="form-control" id="clientName"
                                                                            placeholder={Resources["clientName"][currentLanguage]}
                                                                            autoComplete="off"
                                                                            value={this.state.document.clientName}
                                                                            readOnly
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="linebylineInput  fullInputWidth">
                                                                    <label className="control-label">
                                                                        {Resources["percentageOfWorkDone"][currentLanguage]}
                                                                    </label>
                                                                    <div className="inputDev ui input ">
                                                                        <input name="percentageOfWorkDone" className="form-control" id="percentageOfWorkDone"
                                                                            placeholder={Resources["percentageOfWorkDone"][currentLanguage]}
                                                                            autoComplete="off"
                                                                            value={this.state.document.percentageOfWorkDone}
                                                                            readOnly
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="linebylineInput fullInputWidth">
                                                                    <label className="control-label">
                                                                        {Resources["contractAmount"][currentLanguage]}
                                                                    </label>
                                                                    <div className="inputDev ui input ">
                                                                        <input name="contractAmount" className="form-control" id="contractAmount"
                                                                            placeholder={Resources["contractAmount"][currentLanguage]}
                                                                            autoComplete="off"
                                                                            onBlur={handleBlur}
                                                                            value={this.state.document.contractAmount}
                                                                            readOnly
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="linebylineInput readOnly_inputs valid-input alternativeDate">
                                                                    <DatePicker title="invoiceCutOff"
                                                                        startDate={this.state.document.invoiceCut}
                                                                    />
                                                                </div>
                                                                <div className="linebylineInput valid-input alternativeDate">
                                                                    <DatePicker title="phdApproval"
                                                                        startDate={this.state.document.creationDate}
                                                                        handleChange={e => this.handleChangeDate(e, "creationDate")} />
                                                                </div>
                                                                <div className="linebylineInput valid-input alternativeDate">
                                                                    <DatePicker title="invoiceSubmissionDate"
                                                                        startDate={this.state.document.invoiceSubmissionDate}
                                                                        handleChange={e => this.handleChangeDate(e, "invoiceSubmissionDate")} />
                                                                </div>
                                                                <div className="linebylineInput valid-input alternativeDate">
                                                                    <DatePicker title="consultantApproalDate"
                                                                        startDate={this.state.document.consultantApproalDate}
                                                                        handleChange={e => this.handleChangeDate(e, "consultantApproalDate")} />
                                                                </div>
                                                            </div>
                                                            <div className="approveDocument">
                                                                <div className="approveDocumentBTNS">
                                                                    <button className={this.state.isViewMode === true ? "primaryBtn-1 btn middle__btn disNone" : "primaryBtn-1 btn middle__btn"}>
                                                                        {
                                                                            Resources.save[currentLanguage]
                                                                        }
                                                                    </button>
                                                                    <DocumentActions
                                                                        isApproveMode={this.state.isApproveMode}
                                                                        docTypeId={this.state.docTypeId}
                                                                        docId={this.state.docId}
                                                                        projectId={this.state.projectId}
                                                                        previousRoute={this.state.previousRoute}
                                                                        docApprovalId={this.state.docApprovalId}
                                                                        currentArrange={this.state.arrange}
                                                                        showModal={true}
                                                                        showOptionPanel={this.showOptionPanel}
                                                                        permission={this.state.permission}
                                                                        documentName="PAYMENT CERTTIFICATE "
                                                                    />
                                                                </div>
                                                            </div>
                                                        </Form>
                                                    )}
                                                </Formik>
                                            </div>
                                        </div>
                                        <table className="attachmentTable attachmentTableAuto specialTable specialTable__certifiy" key="interimPaymentCertificate">
                                            <thead>
                                                <tr>
                                                    <th colSpan="3">
                                                        <div className="headCell">
                                                            {Resources["description"][currentLanguage]}
                                                        </div>
                                                    </th>
                                                    <th colSpan="3">
                                                        <div className="headCell">
                                                            {Resources["contractAmount"][currentLanguage]}
                                                        </div>
                                                    </th>
                                                    <th colSpan="3">
                                                        <div className="headCell">
                                                            {Resources["submitted"][currentLanguage]}
                                                        </div>
                                                    </th>
                                                    <th colSpan="3">
                                                        <div className="headCell">
                                                            {Resources["approved"][currentLanguage]}
                                                        </div>
                                                    </th>
                                                    <th colSpan="3">
                                                        <div className="headCell">
                                                            {Resources["totalDeductions"][currentLanguage]}
                                                        </div>
                                                    </th>
                                                    <th colSpan="3">
                                                        <div className="headCell">
                                                            {Resources["remarks"][currentLanguage]}
                                                        </div>
                                                    </th>
                                                </tr>
                                                <tr>
                                                    <th colSpan="3"></th>
                                                    <th colSpan="3"></th>
                                                    <th colSpan="1">
                                                        <div className="headCell">
                                                            {Resources["previous"][currentLanguage]}
                                                        </div>
                                                    </th>
                                                    <th colSpan="1">
                                                        <div className="headCell">
                                                            {Resources["current"][currentLanguage]}
                                                        </div>
                                                    </th>
                                                    <th colSpan="1">
                                                        <div className="headCell">
                                                            {Resources["total"][currentLanguage]}
                                                        </div>
                                                    </th>
                                                    <th colSpan="1">
                                                        <div className="headCell">
                                                            {Resources["previous"][currentLanguage]}
                                                        </div>
                                                    </th>
                                                    <th colSpan="1">
                                                        <div className="headCell">
                                                            {Resources["current"][currentLanguage]}
                                                        </div>
                                                    </th>
                                                    <th colSpan="1">
                                                        <div className="headCell">
                                                            {Resources["total"][currentLanguage]}
                                                        </div>
                                                    </th>
                                                    <th colSpan="3"></th>
                                                    <th colSpan="3"></th>
                                                </tr>
                                            </thead>
                                            <tbody>{interimTable}</tbody>
                                        </table>
                                    </Fragment>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="doc-pre-cycle letterFullWidth">
                        <div>
                            <ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                        </div>
                    </div>
                </div>
            </Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PaymentCertificationAddEdit));
