import React, { Component, Fragment } from "react";
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
import DatePicker from '../../Componants/OptionsPanels/DatePicker'
import { toast } from "react-toastify";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import ReactTable from "react-table";
import "react-table/react-table.css";
import Select from 'react-select';
import Api from "../../api";
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument'
import Steps from "../../Componants/publicComponants/Steps";
import DocumentActions from '../../Componants/OptionsPanels/DocumentActions'

var steps_defination = [];
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let perviousRoute = '';
let arrange = 0;
const find = require('lodash/find')

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
                    perviousRoute = obj.perviousRoute;
                }
                catch{
                    this.props.history.goBack();
                }
            }
            index++;
        }

        this.state = {
            rows: [],
            isLoading: true,
            CurrentStep: 0,
            isViewMode: false,
            isApproveMode: isApproveMode,
            perviousRoute: perviousRoute,
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
        if (!Config.IsAllow(583) && !Config.IsAllow(582) && !Config.IsAllow(585)) {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push(
                this.state.perviousRoute
            );
        }

        steps_defination = [
            {
                name: "primaveraLog",
                callBackFn: null
            },
            {
                name: "primaveraShceduleItems",
                callBackFn: null
            }
        ];
    }

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!(Config.IsAllow(583))) {
                this.setState({ isViewMode: true });
            }
            if (Config.getUserTypeIsAdmin() === true) {
                this.setState({ isViewMode: false });
            } else {
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
        }
        else {
            this.setState({ isViewMode: false });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.document.id) {
            let doc = nextProps.document
            doc.docDate = doc.docDate === null ? moment().format('YYYY-MM-DD') : moment(doc.docDate).format('YYYY-MM-DD')
            this.setState({
                document: doc,
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

    changeCurrentStep = stepNo => {
        this.setState({ CurrentStep: stepNo });
    };

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
        dataservice.GetDataListCached('GetProjectProjectsCompaniesForList?projectId= ' + projectId + '', 'companyName', 'companyId', 'companies', this.state.projectId, "projectId").then(
            data => {
                this.setState({
                    ActionByCompanyData: data,
                })
            })

    }

    componentWillUnmount() {
        this.props.actions.clearCashDocument();
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

    showOptionPanel = () => {
        this.props.actions.showOptionPanel(true);
    }

    viewAttachments() {
        return (
            this.state.docId !== 0 ? (
                Config.IsAllow(3291) === true ?
                    <ViewAttachment isApproveMode={this.state.isViewMode} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} deleteAttachments={840} />
                    : null)
                : null
        )
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
            this.changeCurrentStep(1);
        }
        else {
            this.setState({
                isLoading: true
            })

            let Doc = { ...this.state.document }
            Doc.docDate = moment(Doc.docDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS')
            this.changeCurrentStep(1);

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
                let data = { items: res };

                this.props.actions.ExportingData(data);

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
                                    defaultValue={find(this.state.ActionByCompanyData, function (i) { return i.value == row.value })}
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


        return (

            <div className="mainContainer">

                {this.state.isLoading ? <LoadingSection /> : null}

                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document one__tab one_step readOnly_inputs" : "documents-stepper noTabs__document one__tab one_step"}>




                    <HeaderDocument projectName={projectName} isViewMode={this.state.isViewMode} perviousRoute={this.state.perviousRoute} docTitle={Resources.primaveraLog[currentLanguage]}
                        moduleTitle={Resources['timeCoordination'][currentLanguage]} />


                    <div className="doc-container">

                        <div className="step-content">
                            {this.state.CurrentStep == 0 ?
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
                                                        : null
                                                    }
                                                </Form>
                                            )}
                                        </Formik>


                                    </div>


                                    <div className="doc-pre-cycle letterFullWidth">
                                        <div>
                                            {this.state.docId > 0 && this.state.isViewMode === false ? (<UploadAttachment changeStatus={this.props.changeStatus} AddAttachments={871} EditAttachments={3250} ShowDropBox={3557} ShowGoogleDrive={3558} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />) : null}
                                            {this.viewAttachments()}
                                            {this.props.changeStatus === true ?
                                                <ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                                : null}
                                        </div>
                                    </div>
                                </div>
                                :
                                <Fragment>

                                    <XSLfile CustomAccept={true} key='gen_primavera_schedule_items' docId={this.state.docId}
                                        docType='gen_primavera_schedule_items' CantDownload={true} CustomUpload={true} projectId={this.state.projectId}
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
                        <Steps
                            steps_defination={steps_defination}
                            exist_link="/projectPrimaveraSchedule/"
                            docId={this.state.docId}
                            changeCurrentStep={stepNo =>
                                this.changeCurrentStep(stepNo)
                            }
                            stepNo={this.state.CurrentStep} changeStatus={docId === 0 ? false : true}
                        />
                    </div>

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
)(withRouter(projectPrimaveraScheduleAddEdit))

