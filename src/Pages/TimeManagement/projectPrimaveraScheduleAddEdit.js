import React, { Component, Fragment } from "react";
import OptionContainer from "../../Componants/OptionsPanels/OptionContainer";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import dataservice from "../../Dataservice";
import UploadAttachment from '../../Componants/OptionsPanels/UploadAttachment'
import ViewAttachment from '../../Componants/OptionsPanels/ViewAttachmments'
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import Resources from "../../resources.json";
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as communicationActions from '../../store/actions/communication';
import Config from "../../Services/Config.js";
import XSLfile from '../../Componants/OptionsPanels/XSLfiel'
import CryptoJS from 'crypto-js';
import moment from "moment";
import SkyLight from 'react-skylight';
import Distribution from '../../Componants/OptionsPanels/DistributionList'
import SendToWorkflow from '../../Componants/OptionsPanels/SendWorkFlow'
import DocumentApproval from '../../Componants/OptionsPanels/wfApproval'
import DatePicker from '../../Componants/OptionsPanels/DatePicker'
import { toast } from "react-toastify";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import ReactTable from "react-table";
import "react-table/react-table.css";
import Select from 'react-select';
import Api from "../../api";
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument'
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let arrange = 0;
const _ = require('lodash')

let StatusDataDrop = [{ label: 'Opended', value: true }, { label: 'Closed', value: false }]

const validationSchema = Yup.object().shape({
    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),
})

class projectPrimaveraScheduleAddEdit extends Component {

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
                }
                catch{
                    this.props.history.goBack();
                }
            }
            index++;
        }

        this.state = {
            rows: [],
            FirstStep: true,
            SecondStep: false,
            SecondStepComplate: false,
            isLoading: true,
            CurrStep: 1,
            currentTitle: "sendToWorkFlow",
            showModal: false,
            isViewMode: false,
            isApproveMode: isApproveMode,
            isView: false,
            docId: docId,
            docTypeId: 13,
            projectId: projectId,
            docApprovalId: docApprovalId,
            arrange: arrange,
            document: this.props.document ? Object.assign({}, this.props.document) : {},
            permission: [{ name: 'sendByEmail', code: 588 }, { name: 'sendByInbox', code: 587 },
            { name: 'sendTask', code: 1 }, { name: 'distributionList', code: 952 },
            { name: 'createTransmittal', code: 3034 }, { name: 'sendToWorkFlow', code: 704 },
            { name: 'viewAttachments', code: 3291 }, { name: 'deleteAttachments', code: 872 }],
            IsEditMode: false,
            SelectedBOQDrop: { label: Resources.selectBoq[currentLanguage], value: "0" },
            TotalFactors: 0,
            IsAddModel: false,
            SelectedCurrency: { label: Resources.pleaseSelectCurrency[currentLanguage], value: "0" },
            ActionByCompanyData: [],
            TotalPages: 0,
        }
    }

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!(Config.IsAllow(583))) {
                this.setState({ isViewMode: true });
            }
            if (this.state.isApproveMode != true && Config.IsAllow(583)) {
                if (this.props.hasWorkflow == false && Config.IsAllow(583)) {
                    if (this.props.document.status !== false && Config.IsAllow(583)) {
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
            let ProjectEstiDoc = nextProps.document
            ProjectEstiDoc.docDate = moment(ProjectEstiDoc.docDate).format('DD/MM/YYYY')
            this.setState({
                document: ProjectEstiDoc,
                hasWorkflow: nextProps.hasWorkflow,
            });
            this.checkDocumentIsView();
        }
    }

    handleChange(e, field) {

        let original_document = { ...this.state.document };
        let updated_document = {};
        updated_document[field] = e.target.value;
        updated_document = Object.assign(original_document, updated_document);
        this.setState({
            document: updated_document
        })

    }

    NextStep = () => {

        if (this.state.CurrStep === 1) {

            window.scrollTo(0, 0)
            this.setState({
                FirstStep: false,
                SecondStep: true,
                SecondStepComplate: true,
                CurrStep: this.state.CurrStep + 1,
            })
        }
        else if (this.state.CurrStep === 2) {
            this.saveAndExit()
        }

    }

    PreviousStep = () => {

        if (this.state.IsEditMode) {
            if (this.state.CurrStep === 2) {
                window.scrollTo(0, 0)
                this.setState({
                    FirstStep: true,
                    SecondStep: false,
                    SecondStepComplate: false,
                    CurrStep: this.state.CurrStep - 1
                })
            }
        }

    }

    componentWillMount() {
        if (docId > 0) {

            let url = "GetPrimaveraScheduleForEdit?id=" + this.state.docId
            this.props.actions.documentForEdit(url);
            this.setState({
                IsEditMode: true,
                isLoading: false
            })
            this.getTabelData()

        } else {
            ///Is Add Mode
            dataservice.GetNextArrangeMainDocument('GetNextArrangeMainDoc?projectId=' + projectId + '&docType=' + this.state.docTypeId + '&companyId=undefined&contactId=undefined').then
                (
                    res => {
                        let Doc = {
                            id: -1, projectId: projectId, subject: '', alertStatus: true,
                            arrange: res, docDate: moment(), status: true,
                        }
                        this.setState({
                            document: Doc,
                            isLoading: false
                        })
                    }
                )
        }
        dataservice.GetDataList('GetProjectProjectsCompaniesForList?projectId= ' + projectId + '', 'companyName', 'companyId').then(
            data => {
                this.setState({
                    ActionByCompanyData: data,
                })
            })

    }

    componentWillUnmount() {   this.props.actions.clearCashDocument();
        this.setState({
            docId: 0
        });
    }

    componentDidMount = () => {
    }

    componentDidUpdate(prevProps) {
        if (this.props.hasWorkflow !== prevProps.hasWorkflow) {
            this.checkDocumentIsView();
        }
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

    handleShowAction = (item) => { 
        if (item.title == "sendToWorkFlow") { this.props.actions.SendingWorkFlow(true); }

        if (item.value != "0") {
            this.setState({
                currentComponent: item.value,
                currentTitle: item.title,
                showModal: true
            })
            this.simpleDialog.show()
        }
    }

    viewAttachments() {
        return (
            this.state.docId !== 0 ? (
                Config.IsAllow(3291) === true ?
                    <ViewAttachment docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} deleteAttachments={840} />
                    : null)
                : null
        )
    }

    saveAndExit = () => {
        this.props.history.push({
            pathname: '/projectPrimaveraSchedule/' + projectId + '',
        })
    }

    showBtnsSaving() {
        let btn = null;

        if (this.state.docId === 0) {
            btn = <button className="primaryBtn-1 btn meduimBtn" type="submit" >{this.state.IsAddModel ? Resources.next[currentLanguage] : Resources.save[currentLanguage]}</button>;
        } else if (this.state.docId > 0) {
            btn = <button className="primaryBtn-1 btn mediumBtn" >{Resources.next[currentLanguage]}</button>
        }
        return btn;
    }

    AddEditDoc = () => {
        if (this.state.IsAddModel) {
            this.NextStep()
        }
        else {
            this.setState({
                isLoading: true
            })

            let Doc = { ...this.state.document }
            Doc.docDate = moment(Doc.docDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS')

            if (this.state.docId > 0) {
                dataservice.addObject('EditPrimaveraSchedule', Doc).then(
                    res => {
                        this.setState({
                            isLoading: false
                        })
                        toast.success(Resources["operationSuccess"][currentLanguage]);
                    }).catch(ex => {
                        toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
                    })
                this.NextStep()

            }
            else {

                dataservice.addObject('AddPrimaveraSchedule', Doc).then(
                    res => {
                        this.setState({
                            docId: res.id,
                            isLoading: false,
                            IsAddModel: true
                        })

                        dataservice.GetDataGrid('GetProjectEstimateItemsByProjectEstimateId?projectEstimateId=' + res.id + '').then(
                            Data => {
                                this.setState({
                                    rows: Data,
                                })
                            })

                        toast.success(Resources["operationSuccess"][currentLanguage]);
                    }).catch(ex => {
                        toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
                    })
            }
        }
    }

    getTabelData = () => {
        this.setState({
            isLoading: true
        })
        Api.get('GetPrimaveraScheduleItems?scheduleId=' + this.state.docId + '').then(
            res => {
                this.setState({
                    rows: res,
                    isLoading: false,
                })
            }

        )
    }

    HandlerChangeTableDrop = (key, e, Name) => {
        console.log(key, e, Name)

        if (Name === 'Status') {
            let companyId = key.bic_company_id === null ? 0 : key.bic_company_id
            Api.post('UpdatePrimaveraScheduleItems?id=' + key.id + '&action_by_company=' + companyId + '&isStatus=true&status=' + e.value + '').then(
                res => {
                    toast.success(Resources["operationSuccess"][currentLanguage]);
                }).catch(ex => {
                    toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
                })
        }
        else {
            Api.post('UpdatePrimaveraScheduleItems?id=' + key.id + '&action_by_company=' + e.value + '&isStatus=false&status=false').then(
                res => {
                    toast.success(Resources["operationSuccess"][currentLanguage]);
                }).catch(ex => {
                    toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
                })
        }
    }


    render() {

        console.log(this.state.ActionByCompanyData)
        const columnsCycles = [
            {
                Header: Resources["numberAbb"][currentLanguage],
                accessor: "arrange",
                sortabel: true,
                width: 80
            },
            {
                Header: Resources["statusName"][currentLanguage],
                accessor: "status",
                width: 200,
                sortabel: true,
                Cell: (row) => {
                    return (
                        <div className="fillter-status fillter-item-c">
                            <div className="customD_Menu">
                                <Select options={StatusDataDrop}
                                    defaultValue={row.value === true ? { label: 'Opended', value: true } : { label: 'Closed', value: false }}
                                    onChange={e => this.HandlerChangeTableDrop(row.original, e, "Status")}
                                />
                            </div>
                        </div>
                    )
                }
            },
            {
                Header: Resources["taskId"][currentLanguage],
                accessor: "task_id",
                width: 100,
                sortabel: true
            },
            {
                Header: Resources["taskCode"][currentLanguage],
                accessor: "task_code",
                width: 100,
                sortabel: true
            },
            {
                Header: Resources["activityDescription"][currentLanguage],
                accessor: "description",
                width: 300,
                sortabel: true
            },
            {
                Header: Resources["actualFinishDate"][currentLanguage],
                accessor: "actualFinishDate",
                width: 200,
                sortabel: true,
                Cell: row => (
                    <span>
                        <span>{row.value === null ? 'No Date' : moment(row.value).format("DD/MM/YYYY")}</span>
                    </span>
                )
            },
            {
                Header: Resources["actionByCompany"][currentLanguage],
                accessor: "bic_company_id",
                width: 200,
                sortabel: true,
                Cell: row => {
                    return (
                        <div className="fillter-status fillter-item-c">
                            <div className="customD_Menu">
                                <Select options={this.state.ActionByCompanyData}
                                    defaultValue={_.find(this.state.ActionByCompanyData, function (i) { return i.value == row.value })}
                                    onChange={e => this.HandlerChangeTableDrop(row.original, e, "ABCompany")}
                                />
                            </div>
                        </div>)
                },
            },
            {
                Header: Resources["actualDuration"][currentLanguage],
                accessor: "actualDuration",
                width: 200,
                sortabel: true
            },
            {
                Header: Resources["percentageWorkComplete"][currentLanguage],
                accessor: "percentageWorkComplete",
                width: 200,
                sortabel: true
            },
            {
                Header: Resources["earnedValue"][currentLanguage],
                accessor: "earnedValue",
                width: 200,
                sortabel: true
            },
        ];

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

        ]

        return (

            <div className="mainContainer">

                {this.state.isLoading ? <LoadingSection /> : null}

                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document one__tab one_step readOnly_inputs" : "documents-stepper noTabs__document one__tab one_step"}>




                    <HeaderDocument projectName={projectName} docTitle={Resources.primaveraLog[currentLanguage]}
                        moduleTitle={Resources['timeCoordination'][currentLanguage]} />


                    <div className="doc-container">

                        <div className="step-content">
                            {this.state.FirstStep ?
                                <div className="subiTabsContent">
                                    <div className="document-fields">
                                        <Formik
                                            initialValues={
                                                { ...this.state.document }
                                            }
                                            validationSchema={validationSchema}
                                            enableReinitialize={true}
                                            onSubmit={(values) => {
                                                this.AddEditDoc();
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
                                                            <label className="control-label">{Resources['numberAbb'][currentLanguage]}</label>
                                                            <div className="inputDev ui input" >
                                                                <input autoComplete="off" className="form-control" readOnly
                                                                    onChange={(e) => this.handleChange(e, 'arrange')}
                                                                    value={this.state.document.arrange} name="arrange" placeholder={Resources['numberAbb'][currentLanguage]} />
                                                            </div>
                                                        </div>

                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.alertStatus[currentLanguage]}</label>
                                                            <div className="ui checkbox radio radioBoxBlue">
                                                                <input type="radio" name="alertStatus" defaultChecked={this.state.document.alertStatus === false ? null : 'checked'} value="true" onChange={e => this.handleChange(e, 'alertStatus')} />
                                                                <label>{Resources.on[currentLanguage]}</label>
                                                            </div>
                                                            <div className="ui checkbox radio radioBoxBlue">
                                                                <input type="radio" name="alertStatus" defaultChecked={this.state.document.alertStatus === false ? 'checked' : null} value="false" onChange={e => this.handleChange(e, 'alertStatus')} />
                                                                <label>{Resources.off[currentLanguage]}</label>
                                                            </div>
                                                        </div>


                                                    </div>

                                                    <div className="slider-Btns">
                                                        {this.showBtnsSaving()}
                                                    </div>
                                                    {this.state.IsEditMode === true && docId !== 0 ?
                                                        <div className="approveDocument">
                                                            <div className="approveDocumentBTNS">
                                                                <button className={this.state.isViewMode === true ? "primaryBtn-1 btn middle__btn disNone" : "primaryBtn-1 btn middle__btn"} onClick={this.saveNCR}>{Resources.save[currentLanguage]}</button>

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
                                                </Form>
                                            )}
                                        </Formik>


                                    </div>


                                    <div className="doc-pre-cycle letterFullWidth">
                                        <div>
                                            {this.state.docId !== 0 ?
                                                <UploadAttachment docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                                : null
                                            }
                                            {this.viewAttachments()}

                                            {this.props.changeStatus === true && docId !== 0 ?
                                                <ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                                : null
                                            }
                                        </div>
                                    </div>
                                </div>
                                :
                                <Fragment>

                                    <XSLfile CustomAccept={true} key='gen_primavera_schedule_items' docId={this.state.docId}
                                        docType='gen_primavera_schedule_items' CantDownload={true} CustomUpload={true} projectId={projectId}
                                        afterUpload={() => this.getTabelData()}
                                    />

                                    <ReactTable data={this.state.rows}
                                        columns={columnsCycles}
                                        defaultPageSize={5}
                                        noDataText={Resources["noData"][currentLanguage]}
                                        className="-striped -highlight" />
                                </Fragment>
                            }
                        </div>
                        {/* Right Menu */}
                        <div className="docstepper-levels">
                            {/* Next & Previous */}
                            <div className="step-content-foot">
                                <span onClick={this.PreviousStep} className={!this.state.FirstStep && this.state.IsEditMode ? "step-content-btn-prev " :
                                    "step-content-btn-prev disabled"}>{Resources['previous'][currentLanguage]}<i className="fa fa-caret-left" aria-hidden="true"></i></span>

                                <span onClick={this.NextStep} className={this.state.IsEditMode ? "step-content-btn-prev "
                                    : "step-content-btn-prev disabled"}>{Resources['next'][currentLanguage]} <i className="fa fa-caret-right" aria-hidden="true"></i>
                                </span>
                            </div>
                            {/* Steps Active  */}
                            <div className="workflow-sliderSteps">
                                <div className="step-slider">
                                    <div data-id="step1" className={'step-slider-item ' + (this.state.SecondStepComplate ? "active" : 'current__step')} >
                                        <div className="steps-timeline">
                                            <span>1</span>
                                        </div>
                                        <div className="steps-info">
                                            <h6>{Resources['primaveraLog'][currentLanguage]}</h6>
                                        </div>
                                    </div>

                                    <div data-id="step2 " className={'step-slider-item ' + (this.state.ThirdStepComplate ? 'active' : this.state.SecondStepComplate ? "current__step" : "")} >
                                        <div className="steps-timeline">
                                            <span>2</span>
                                        </div>
                                        <div className="steps-info">
                                            <h6 >{Resources['primaveraShceduleItems'][currentLanguage]}</h6>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>

                    </div>

                </div>

                <div className="largePopup largeModal " style={{ display: this.state.showModal ? 'block' : 'none' }}>
                    <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref} title={Resources[this.state.currentTitle][currentLanguage]}>
                        {this.state.currentComponent}
                    </SkyLight>
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
)(withRouter(projectPrimaveraScheduleAddEdit))

