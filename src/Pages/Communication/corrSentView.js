import React, { Component, Fragment } from "react";
import Resources from "../../resources.json";
import { withRouter } from "react-router-dom";
import LoadingSection from '../../Componants/publicComponants/LoadingSection';
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument'
import Api from '../../api'
import Export from "../../Componants/OptionsPanels/Export";
import { connect } from 'react-redux';
import ConfirmationModal from '../../Componants/publicComponants/ConfirmationModal'
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { toast } from "react-toastify";
import Filter from "../../Componants/FilterComponent/filterComponent";
import GridCustom from "../../Componants/Templates/Grid/CustomCommonLogGrid";
import Config from "../../Services/Config";
import { Formik, Form } from "formik";
import moment from "moment";
import DatePicker from "../../Componants/OptionsPanels/DatePicker";
import DocumentActions from '../../Componants/OptionsPanels/DocumentActions'

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const _ = require('lodash')


let docId = 0;
let projectId = 0;
let projectName = "";
let isApproveMode = 0;
let docApprovalId = 0;
let arrange = 0;
let perviousRoute = 0;

class corrSentView extends Component {

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
            arrange = obj.arrange;
            perviousRoute = obj.perviousRoute;
        }
       var sendColumns = [
            {
                field: 'arrange',
                title: Resources['arrange'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: true,
                type: "text",
                sortable: true,
            },
            {
                field: 'statusName',
                title: Resources['status'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: 'subject',
                title: Resources['subject'][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: 'fromCompanyName',
                title: Resources['fromCompany'][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: 'fromContactName',
                title: Resources['fromContact'][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: 'toCompanyName',
                title: Resources['toCompany'][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: 'toContactName',
                title: Resources['ToContact'][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: 'docDate',
                title: Resources['docDate'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "date",
                sortable: true,
            }, {
                field: 'sendDate',
                title: Resources['sendDate'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "date",
                sortable: true,
            }, {
                field: 'docCloseDate',
                title: Resources['docClosedate'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "date",
                sortable: true,
            }, {
                field: 'docType',
                title: Resources['docType'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: 'sendingMethod',
                title: Resources['sendingMethod'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: 'refDoc',
                title: Resources['refDoc'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: 'lastSendTime',
                title: Resources['lastSendTime'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: 'lastApproveTime',
                title: Resources['lastApprovedTime'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }]
        this.state = {
            projectId: projectId,
            docApprovalId: docApprovalId,
            perviousRoute: perviousRoute,
            initObj: {
                arrange: '',
                statusName: '',
                subject: '',
                fromCompanyName: '',
                fromContactName: '',
                toCompanyName: '',
                toContactName: '',
                docDate: moment().format("YYYY-MM-DD"),
                sendDate: moment().format("YYYY-MM-DD"),
                docCloseDate: moment().format("YYYY-MM-DD"),
                docType: '',
                sendingMethod: '',
                refDoc: '',
                lastSendTime: '',
                lastApproveTime: '',
                rows:[]

            },
            columns:sendColumns,
            pageTitle: Resources["communicationCorrespondenceSent"][currentLanguage],
        }
        if (!Config.IsAllow(42)) {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push(
                this.state.perviousRoute
            );
        }
    }
    handleChangeDate(e, field) {
        let obj = { ...this.state.initObj };

        let updated = {};

        updated[field] = e;

        updated = Object.assign(obj, updated);

        this.setState({
            initObj: updated
        });
    }
    showOptionPanel = () => {
        this.props.actions.showOptionPanel(true);
    }
    componentDidMount() {
        this.setState({
            isLoading: true
        });

        Api.get("GetCommunicationCorrespondenceSentForEdit?id=" + docId).then(
            res => {
                this.setState({
                    initObj: res,
                    rows:res||[],
                    isLoading: false
                });
            }
        );
    };



    render() {

        return (


            <div className="mainContainer">
                <div className="documents-stepper noTabs__document readOnly_inputs" >
                    <HeaderDocument projectName={projectName} isViewMode={this.state.isViewMode} perviousRoute={this.state.perviousRoute} docTitle={Resources.communicationCorrespondenceSent[currentLanguage]} moduleTitle={Resources['communication'][currentLanguage]} />
                    <div className="doc-container">
                        <div className="step-content">
                            <div id="step1" className="step-content-body">
                                <div className="subiTabsContent">
                                    <div className="document-fields">
                                        {this.state.isLoading === false ? (
                                            <Formik
                                                enableReinitialize={true}
                                                initialValues={{
                                                    ...this.state.initObj
                                                }}
                                                // validationSchema={attendeesValidationSchema}
                                                onSubmit={values => {
                                                    this.addEditAttendees();
                                                }}>
                                                {({
                                                    errors,
                                                    touched,
                                                    setFieldTouched,
                                                    setFieldValue,
                                                    handleBlur,
                                                    handleChange,
                                                    values
                                                }) => (
                                                        <Form className="proForm datepickerContainer customProform" noValidate="novalidate">
                                                            <div className="linebylineInput valid-input">
                                                                <label className="control-label">
                                                                    {Resources["arrange"][currentLanguage]}
                                                                </label>
                                                                <div className={"inputDev ui input "}>
                                                                    <input name="arrange" value={values.arrange} className="form-control" id="arrange"
                                                                        placeholder={Resources["arrange"][currentLanguage]}
                                                                        autoComplete="off"
                                                                        onBlur={handleBlur}
                                                                        onChange={e => { handleChange(e); this.handleChange("subject", e.target.value); }}
                                                                    />

                                                                </div>
                                                            </div>
                                                            <div className="linebylineInput valid-input">
                                                                <label className="control-label">
                                                                    {Resources["subject"][currentLanguage]}
                                                                </label>
                                                                <div className={"inputDev ui input "}>
                                                                    <input name="subject" value={values.subject} className="form-control" id="subject"
                                                                        placeholder={Resources["subject"][currentLanguage]}
                                                                        autoComplete="off"
                                                                        onBlur={handleBlur}
                                                                        onChange={e => { handleChange(e); this.handleChange("subject", e.target.value); }}
                                                                    />

                                                                </div>
                                                            </div>
                                                            <div className="linebylineInput valid-input">
                                                                <label className="control-label">
                                                                    {Resources["status"][currentLanguage]}
                                                                </label>
                                                                <div className={"inputDev ui input "}>
                                                                    <input name="status" value={values.statusName} className="form-control" id="status"
                                                                        placeholder={Resources["status"][currentLanguage]}
                                                                        autoComplete="off"
                                                                        onBlur={handleBlur}
                                                                        onChange={e => { handleChange(e); this.handleChange("subject", e.target.value); }}
                                                                    />

                                                                </div>
                                                            </div>
                                                            <div className="linebylineInput valid-input">
                                                                <label className="control-label">
                                                                    {Resources["fromCompany"][currentLanguage]}
                                                                </label>
                                                                <div className={"inputDev ui input "}>
                                                                    <input name="fromCompany" value={values.fromCompanyName} className="form-control" id="fromCompany"
                                                                        placeholder={Resources["fromCompany"][currentLanguage]}
                                                                        autoComplete="off"
                                                                        onBlur={handleBlur}
                                                                        onChange={e => { handleChange(e); this.handleChange("subject", e.target.value); }}
                                                                    />

                                                                </div>
                                                            </div>
                                                            <div className="linebylineInput valid-input">
                                                                <label className="control-label">
                                                                    {Resources["fromContact"][currentLanguage]}
                                                                </label>
                                                                <div className={"inputDev ui input "}>
                                                                    <input name="fromContact" value={values.fromContactName} className="form-control" id="fromContact"
                                                                        placeholder={Resources["fromContact"][currentLanguage]}
                                                                        autoComplete="off"
                                                                        onBlur={handleBlur}
                                                                        onChange={e => { handleChange(e); this.handleChange("subject", e.target.value); }}
                                                                    />

                                                                </div>
                                                            </div>
                                                            <div className="linebylineInput valid-input">
                                                                <label className="control-label">
                                                                    {Resources["toCompany"][currentLanguage]}
                                                                </label>
                                                                <div className={"inputDev ui input "}>
                                                                    <input name="toCompany" value={values.toCompanyName} className="form-control" id="toCompany"
                                                                        placeholder={Resources["toCompany"][currentLanguage]}
                                                                        autoComplete="off"
                                                                        onBlur={handleBlur}
                                                                        onChange={e => { handleChange(e); this.handleChange("subject", e.target.value); }}
                                                                    />

                                                                </div>
                                                            </div>

                                                            <div className="linebylineInput valid-input">
                                                                <label className="control-label">
                                                                    {Resources["ToContact"][currentLanguage]}
                                                                </label>
                                                                <div className={"inputDev ui input "}>
                                                                    <input name="ToContact" value={values.ToContact} className="form-control" id="ToContact"
                                                                        placeholder={Resources["ToContact"][currentLanguage]}
                                                                        autoComplete="off"
                                                                        onBlur={handleBlur}

                                                                    />

                                                                </div>
                                                            </div>
                                                            <div className="linebylineInput valid-input alternativeDate">
                                                                <DatePicker title="docDate"
                                                                    startDate={values.docDate}
                                                                    handleChange={e => this.handleChangeDate(e, "docDate")} />
                                                            </div>
                                                            <div className="linebylineInput valid-input alternativeDate">
                                                                <DatePicker title="sendDate"
                                                                    startDate={values.sendDate}
                                                                    handleChange={e => this.handleChangeDate(e, "sendDate")} />
                                                            </div>
                                                            <div className="linebylineInput valid-input alternativeDate">
                                                                <DatePicker title="docClosedate"
                                                                    startDate={values.docCloseDate}
                                                                    handleChange={e => this.handleChangeDate(e, "docClosedate")} />
                                                            </div>
                                                            <div className="linebylineInput valid-input">
                                                                <label className="control-label">
                                                                    {Resources["docType"][currentLanguage]}
                                                                </label>
                                                                <div className={"inputDev ui input "}>
                                                                    <input name="docType" value={values.docType} className="form-control" id="docType"
                                                                        placeholder={Resources["docType"][currentLanguage]}
                                                                        autoComplete="off"
                                                                        onBlur={handleBlur}

                                                                    />

                                                                </div>
                                                            </div>
                                                            <div className="linebylineInput valid-input">
                                                                <label className="control-label">
                                                                    {Resources["sendingMethod"][currentLanguage]}
                                                                </label>
                                                                <div className={"inputDev ui input "}>
                                                                    <input name="sendingMethod" value={values.sendingMethod} className="form-control" id="sendingMethod"
                                                                        placeholder={Resources["sendingMethod"][currentLanguage]}
                                                                        autoComplete="off"
                                                                        onBlur={handleBlur}

                                                                    />

                                                                </div>
                                                            </div>

                                                            <div className="linebylineInput valid-input">
                                                                <label className="control-label">
                                                                    {Resources["refDoc"][currentLanguage]}
                                                                </label>
                                                                <div className={"inputDev ui input "}>
                                                                    <input name="refDoc" value={values.refDoc} className="form-control" id="refDoc"
                                                                        placeholder={Resources["refDoc"][currentLanguage]}
                                                                        autoComplete="off"
                                                                        onBlur={handleBlur}

                                                                    />

                                                                </div>
                                                            </div>

                                                            {/* <div className="linebylineInput valid-input">
                                                            <label className="control-label">
                                                                {Resources["lastSendTime"][currentLanguage]}
                                                            </label>
                                                            <div className={"inputDev ui input "}>
                                                                <input name="lastSendTime" value={values.lastSendTime} className="form-control" id="lastSendTime"
                                                                    placeholder={Resources["lastSendTime"][currentLanguage]}
                                                                    autoComplete="off"
                                                                    onBlur={handleBlur}

                                                                />

                                                            </div>
                                                        </div> */}
                                                            {/* <div className="linebylineInput valid-input">
                                                            <label className="control-label">
                                                                {Resources["lastSendTime"][currentLanguage]}
                                                            </label>
                                                            <div className={"inputDev ui input "}>
                                                                <input name="lastSendTime" value={values.lastSendTime} className="form-control" id="lastSendTime"
                                                                    placeholder={Resources["lastSendTime"][currentLanguage]}
                                                                    autoComplete="off"
                                                                    onBlur={handleBlur}

                                                                />

                                                            </div>
                                                        </div> */}

                                                            {/* <div className="linebylineInput valid-input">
                                                            <label className="control-label">
                                                                {Resources["lastApprovedTime"][currentLanguage]}
                                                            </label>
                                                            <div className={"inputDev ui input "}>
                                                                <input name="lastApprovedTime" value={values.lastApproveTime} className="form-control" id="lastApprovedTime"
                                                                    placeholder={Resources["lastApprovedTime"][currentLanguage]}
                                                                    autoComplete="off"
                                                                    onBlur={handleBlur}

                                                                />

                                                            </div>
                                                        </div> */}

                                                            <div className="approveDocument">
                                                                <div className="approveDocumentBTNS">

                                                                     <Export rows={this.state.isLoading === false ? [this.state.rows] : []} columns={this.state.columns} fileName={this.state.pageTitle} />
                                                                </div>
                                                            </div>
                                                        </Form>
                                                    )}
                                            </Formik>
                                        ) : (
                                                <LoadingSection />
                                            )
                                        }

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
        projectId: state.communication.projectId,
        projectName: state.communication.projectName,
        // isLoading: state.communication.isLoading,
    }
}
export default connect(
    mapStateToProps
)(withRouter(corrSentView))