import React, { Component, Fragment } from 'react';
import { withRouter } from "react-router-dom";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import Config from "../../Services/Config";
import { toast } from "react-toastify";
import Resources from "../../resources.json";
import Api from '../../api';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import dataservice from "../../Dataservice"
import * as communicationActions from '../../store/actions/communication';
import DropdownMelcous from '../../Componants/OptionsPanels/DropdownMelcous';
import DatePicker from '../../Componants/OptionsPanels/DatePicker';
import SkyLight from 'react-skylight';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CryptoJS from 'crypto-js';
import moment from 'moment';
import Distribution from '../../Componants/OptionsPanels/DistributionList'
import SendToWorkflow from '../../Componants/OptionsPanels/SendWorkFlow'
import DocumentApproval from '../../Componants/OptionsPanels/wfApproval'
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import OptionContainer from "../../Componants/OptionsPanels/OptionContainer";
import Recycle from '../../Styles/images/attacheRecycle.png'
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument';
import Steps from "../../Componants/publicComponants/Steps";
import DocumentActions from '../../Componants/OptionsPanels/DocumentActions';
import GridCustom from "../../Componants/Templates/Grid/CustomCommonLogGrid";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
//const _ = require('lodash')
let MaxArrange = 1

const ValidtionSchemaForTaskGroups = Yup.object().shape({
    ArrangeTaskGroups: Yup.string()
        .required(Resources['isRequiredField'][currentLanguage]),
    Subject: Yup.string()
        .required(Resources['subjectRequired'][currentLanguage]),
})

const ValidtionSchemaForContact = Yup.object().shape({
    ArrangeContact: Yup.string()
        .required(Resources['isRequiredField'][currentLanguage]),
    Company: Yup.string()
        .required(Resources['toCompanyRequired'][currentLanguage])
        .nullable(true),
    ContactName: Yup.string()
        .required(Resources['toContactRequired'][currentLanguage])
        .nullable(false),
});

var steps_defination = [];
steps_defination = [
    { name: "projectTaskGroups", callBackFn: null },
    { name: "ContactsLog", callBackFn: null }
];

let docId = 0;
let projectId = 0;
let projectName = "";
let isApproveMode = 0;
let docApprovalId = 0;
let arrange = 0;
let perviousRoute = 0;
let actions = []

class TaskGroupsAddEdit extends Component {

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
                index++;
            }
        }
        const columnsGrid = [
            {
                field: 'arrange',
                title: Resources['numberAbb'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: true,
                type: "text",
                sortable: true,
            },
            {
                field: 'companyName',
                title: Resources['CompanyName'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: 'contactName',
                title: Resources['ContactName'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }
        ]


        this.state = {
            currentTitle: "sendToWorkFlow",
            IsEditMode: false,
            isViewMode: false,
            isApproveMode: isApproveMode,
            perviousRoute: perviousRoute,
            isView: false,
            docId: docId,
            docTypeId: 99,
            projectId: projectId,
            docApprovalId: docApprovalId,
            DocumentDate: moment(),
            Status: 'true',
            CompanyData: [],
            ContactData: [],
            isLoading: true,
            CurrStep: 0,
            SelectedCompany: '',
            SelectedContact: '',
            selectedRows: [],
            showDeleteModal: false,
            rows: [],
            selectedRows: [],
            showCheckbox: false,
            columns: columnsGrid.filter(column => column.visible !== false),
            ContactsTable: [],
            rowId: 0,
            index: 0,
            DeleteFromLog: false,
            DocTaskGroupsData: {},
            permission: [{ name: 'sendByEmail', code: 780 }, { name: 'sendByInbox', code: 779 },
            { name: 'sendTask', code: 1 }, { name: 'distributionList', code: 951 },
            { name: 'createTransmittal', code: 3037 }, { name: 'sendToWorkFlow', code: 783 }]
        }
        this.rowActions = [
            {
                title: "Delete",
                handleClick: value => {
                    this.DeleteContact(value.id)
                }
            }
        ]
        if (!Config.IsAllow(774) && !Config.IsAllow(775) && !Config.IsAllow(777)) {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: '/TaskGroups/' + projectId + '',
            });
        }
    }

    FillCompanyDrop = () => {
        dataservice.GetDataListCached('GetProjectProjectsCompaniesForList?projectId=' + projectId + '', 'companyName', 'companyId', 'companies', this.state.projectId, "projectId").then(
            res => {
                this.setState({
                    CompanyData: res,
                })
            }
        )
    }

    FillContactsList = () => {
        Api.get('GetProjectTaskGroupItemsByTaskId?taskId=' + docId + '').then(
            res => {

                this.setState({
                    rows: res,
                    isLoading: false
                })
                let data = { items: res };
                this.props.actions.ExportingData(data);
            }
        )
    }

    componentWillUnmount() {
        this.props.actions.clearCashDocument();
        this.setState({
            docId: 0
        });
    }

    componentWillMount = () => {
        if (docId > 0) {
            let url = 'GetProjectTaskGroupsForEdit?taskId=' + docId + ''
            this.props.actions.documentForEdit(url, this.state.docTypeId, 'projectTaskGroups');
        }
        else {
            Api.get('GetNextArrangeMainDoc?projectId=' + projectId + '&docType=99&companyId=undefined&contactId=undefined').then(
                res => {
                    MaxArrange = res
                })
            this.props.actions.documentForAdding();
        }
        this.FillCompanyDrop();
        this.FillContactsList()
        if (Config.IsAllow(776)) {
            this.setState({
                showCheckbox: true
            })
        }
    }
    showOptionPanel = () => {
        this.props.actions.showOptionPanel(true);
    }
    handleChangeDrops = (SelectedItem, DropName) => {
        switch (DropName) {
            case 'Company':
              this.setState({ SelectedCompany: SelectedItem })
                if (SelectedItem !== null) {
                    dataservice.GetDataList('GetContactsByCompanyIdForOnlyUsers?companyId=' + SelectedItem.value + '', 'contactName', 'id')
                        .then(res => {
                            this.setState({
                                ContactData: res,
                            })
                        })
                }else{
                    this.setState({ 
                        ContactData:[], 
                        SelectedContact:null
                    })
                  
                }
                break;
            case 'ContactName':
                    this.setState({
                        SelectedContact:SelectedItem
                    })
                break;
            default:
                break;
        }
    }

    DocumentDatehandleChange = (date) => {
        this.setState({
            DocumentDate: date
        })
    }

    componentWillReceiveProps(props, state) {
        if (props.document.id) {
            let date = props.document.docDate = props.document.docDate === null ? moment().format('YYYY-MM-DD') : moment(props.document.docDate).format('YYYY-MM-DD')
            this.setState({
                IsEditMode: true,
                DocTaskGroupsData: props.document,
                DocumentDate: date,
                isLoading: false
            });
            this.checkDocumentIsView();
        }

    }

    DeleteContact = (rowId) => {
        // if (index === undefined) {
        this.setState({
            showDeleteModal: true,
            rowId: rowId,
            DeleteFromLog: true
        })
        // }
        // else {
        //     this.setState({
        //         showDeleteModal: true,
        //         rowId: rowId,
        //         index: index
        //     })
        // }
    }

    ConfirmationDelete = () => {

        this.setState({ isLoading: true })
        let IdRow = this.state.rowId
        let Data = this.state.rows;
        let NewData = []

        if (this.state.DeleteFromLog) {
            NewData = Data.filter(s => s.id !== IdRow)
            this.setState({ rows: NewData })
            let data = { items: NewData };
            this.props.actions.ExportingData(data);
        }
        else {
            Data.splice(this.state.index, 1);
            this.setState({ rows: Data });
            let data = { items: Data };
            this.props.actions.ExportingData(data);
        }

        Api.post("ProjectTaskGroupsItemDelete?id=" + this.state.rowId).then(
            res => {
                this.setState({
                    showDeleteModal: false,
                    isLoading: false,
                    DeleteFromLog: false
                })
                toast.success(Resources['smartSentAccountingMessageSuccessTitle'][currentLanguage])
            }
        ).catch(ex => {
            this.setState({
                showDeleteModal: false,
                isLoading: false,
                DeleteFromLog: false
            });
            toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
        });

    }

    onCloseModal = () => {
        this.setState({ showDeleteModal: false });
    }

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });
    }

    AddContact = (values, actions) => {
        console.log(docId)
        this.setState({
            isLoading: true
        })
        Api.post('AddTaskGroupItem', {
            id: undefined,
            arrange: values.ArrangeContact,
            companyId: values.Company.value,
            contactId: values.ContactName.value,
            taskGroupsId: docId,
            Action: undefined,
            multiApproval: undefined
        }).then(
            res => {
                let NewRows = this.state.rows;
                NewRows.unshift(res)
                this.setState({
                    rows: NewRows,
                    isLoading: false
                })
                let data = { items: NewRows };
                this.props.actions.ExportingData(data);
                toast.success(Resources['smartSentAccountingMessageSuccessTitle'][currentLanguage])
            }
        ).catch(ex => {
            this.setState({
                isLoading: false
            });
            toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
        });
        values.Company = ''
        values.ContactName = ''
        values.ArrangeContact = Math.max.apply(Math, this.state.rows.map(function (o) { return o.arrange + 1 }))
    }

    AddEditTaskGroups = (values, actions) => {

        let Date = moment(this.state.DocumentDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');

        if (this.state.IsEditMode) {

            let saveDocument = {
                account: this.state.DocTaskGroupsData.account, arrange: values.ArrangeTaskGroups,
                deleteDate: this.state.DocTaskGroupsData.deleteDate, docDate: Date, id: docId,
                deletedBy: this.state.DocTaskGroupsData.deletedBy, status: this.state.Status,
                docCloseDate: this.state.DocTaskGroupsData.docCloseDate, projectId: projectId,
                isDeleted: this.state.DocTaskGroupsData.isDeleted, subject: values.Subject,
                project_projects: this.state.DocTaskGroupsData.project_projects, project_task_groups_items: [],
            }

            dataservice.addObject('EditProjectTaskGroups', saveDocument).then(
                res => {
                    this.setState({
                        DocTaskGroupsData: res
                    })
                    toast.success(Resources['smartSentAccountingMessageSuccessTitle'][currentLanguage])
                }).catch(ex => {
                    toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
                });
        }
        else {

            let saveDocument = {
                id: undefined, projectId: this.state.projectId,
                arrange: values.ArrangeTaskGroups, subject: values.Subject,
                docDate: Date, status: this.state.Status, docCloseDate: moment().format(),
            }

            dataservice.addObject('AddTaskGroup', saveDocument).then(
                res => {
                    docId = res.id
                    this.setState({
                        DocTaskGroupsData: res
                    })
                    toast.success(Resources['smartSentAccountingMessageSuccessTitle'][currentLanguage])
                }).catch(ex => {
                    toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
                });

        }
        this.changeCurrentStep(1);
    }

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!(Config.IsAllow(775))) {
                this.setState({ isViewMode: true });
            }
            if (Config.getUserTypeIsAdmin() === true) {
                this.setState({ isViewMode: false });
            } else {
                if (this.state.isApproveMode != true && Config.IsAllow(775)) {
                    if (this.props.hasWorkflow == false && Config.IsAllow(775)) {
                        if (this.props.document.status != false && Config.IsAllow(775)) {
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

    componentDidMount = () => {
        this.checkDocumentIsView();
    }

    saveAndExit = () => {
        this.props.history.push({
            pathname: '/TaskGroups/' + projectId + '',
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

    componentDidUpdate(prevProps) {

        if (this.props.hasWorkflow !== prevProps.hasWorkflow || this.props.changeStatus !== prevProps.changeStatus) {
            this.checkDocumentIsView();
        }

        if (prevProps.showModal != this.props.showModal) {
            this.setState({ showModal: this.props.showModal });
        }
    }

    showBtnsSaving() {
        let btn = null;

        if (this.state.docId === 0) {
            btn = <button className="primaryBtn-1 btn meduimBtn" type="submit" >{this.state.IsAddModel ? Resources.next[currentLanguage] : Resources.save[currentLanguage]}</button>;
        } else if (this.state.docId > 0) {
            btn = this.state.isViewMode === false ?
                <button className="primaryBtn-1 btn mediumBtn" >{Resources.next[currentLanguage]}</button> : null
        }
        return btn;
    }

    changeCurrentStep = stepNo => {
        this.setState({ CurrStep: stepNo });
    };


    render() {

        let actions = [
            { title: "distributionList", value: <Distribution docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />, label: Resources["distributionList"][currentLanguage] },
            { title: "sendToWorkFlow", value: <SendToWorkflow docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />, label: Resources["sendToWorkFlow"][currentLanguage] },
            {
                title: "documentApproval", value: <DocumentApproval docTypeId={this.state.docTypeId} docId={this.state.docId} previousRoute={this.state.perviousRoute} approvalStatus={true}
                    projectId={this.state.projectId} docApprovalId={this.state.docApprovalId} currentArrange={this.state.arrange} />, label: Resources["documentApproval"][currentLanguage]
            }, {
                title: "documentApproval", value: <DocumentApproval docTypeId={this.state.docTypeId} docId={this.state.docId} previousRoute={this.state.perviousRoute} approvalStatus={false}
                    projectId={this.state.projectId} docApprovalId={this.state.docApprovalId} currentArrange={this.state.arrange} />, label: Resources["documentApproval"][currentLanguage]
            }]

        let Data = this.state.rows

        let RenderContactsTable = Data.map((item, index) => {
            return (
                this.state.isLoading === false ?
                    <tr key={item.id}>
                        <td className="removeTr">
                            <div className="contentCell tableCell-1">
                                <span className="pdfImage" onClick={() => this.DeleteContact(item.id, index)}>
                                    <img src={Recycle} alt="pdf" />
                                </span>
                            </div>
                        </td>
                        <td>
                            <div className="contentCell tableCell-1">
                                {item.arrange}
                            </div>
                        </td>
                        <td>
                            <div className="contentCell tableCell-2">
                                {item.companyName}
                            </div>
                        </td>
                        <td>
                            <div className="contentCell tableCell-3">
                                {item.contactName}
                            </div>
                        </td>
                    </tr>
                    : <LoadingSection />
            )
        })

        const dataGrid =
            this.state.isLoading === false ? (
                <GridCustom
                    ref='custom-data-grid'
                    gridKey='TaskGroupAddEdit'
                    data={this.state.rows}
                    pageSize={this.state.rows.length}
                    groups={[]}
                    actions={[]}
                    rowActions={this.rowActions}
                    cells={this.state.columns}
                    rowClick={() => { }}
                />
            ) : <LoadingSection />

        const RenderAddContact = () => {
            return (
                <Fragment>

                    <Formik
                        initialValues={{
                            ArrangeContact: this.state.rows.length === 0 ? 1 : Math.max.apply(Math, this.state.rows.map(function (o) { return o.arrange + 1 })),
                            Company: '',
                            ContactName: '',
                        }}

                        enableReinitialize={true}

                        validationSchema={ValidtionSchemaForContact}

                        onSubmit={(values, actions) => {
                            this.AddContact(values, actions)
                        }}>

                        {({ errors, touched, handleBlur, handleChange, values, handleSubmit, setFieldTouched, setFieldValue }) => (
                            <Form onSubmit={handleSubmit}>
                                <header className="main__header">
                                    <div className="main__header--div">
                                        <h2 className="zero">{Resources['addContact'][currentLanguage]}</h2>
                                    </div>
                                </header>

                                <div className='document-fields'>
                                    <div className="proForm datepickerContainer">


                                        <div className="linebylineInput valid-input">
                                            <DropdownMelcous 
                                                isClear={true}
                                                title="company" data={this.state.CompanyData} name="Company"
                                                selectedValue={/*this.state.IsEditExpensesWorkFlowItem ?*/ this.state.SelectedCompany /*: values.Company*/} 
                                                onChange={setFieldValue}
                                                handleChange={(e) => this.handleChangeDrops(e, "Company")}
                                                onBlur={setFieldTouched}
                                                error={errors.Company}
                                                touched={touched.Company}
                                                //value={values.Company} 
                                                 />
                                        </div>


                                        <div className="linebylineInput valid-input">
                                            <DropdownMelcous 
                                                isClear={true}
                                                title="ContactName" 
                                                data={this.state.ContactData} 
                                                name="ContactName"
                                                selectedValue={/*this.state.IsEditExpensesWorkFlowItem ?*/ this.state.SelectedContact /*: values.ContactName*/} 
                                                onChange={setFieldValue}
                                                handleChange={(e) => this.handleChangeDrops(e, "ContactName")}
                                                onBlur={setFieldTouched}
                                                error={errors.ContactName}
                                                touched={touched.ContactName}
                                                //value={values.ContactName}
                                                 />
                                        </div>

                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">{Resources['numberAbb'][currentLanguage]}</label>
                                            <div className={'ui input inputDev ' + (errors.ArrangeContact && touched.ArrangeContact ? 'has-error' : null) + ' '}>
                                                <input disabled autoComplete="off" value={values.ArrangeContact} className="form-control" name="ArrangeContact"
                                                    onBlur={(e) => { handleBlur(e) }}
                                                    onChange={(e) => {
                                                        handleChange(e)
                                                    }}
                                                    placeholder={Resources['numberAbb'][currentLanguage]} />
                                                {errors.ArrangeContact && touched.ArrangeContact ? (<em className="pError">{errors.ArrangeContact}</em>) : null}
                                            </div>
                                        </div>



                                    </div>
                                    <div className="slider-Btns">
                                        <button className="primaryBtn-1 btn meduimBtn" type='submit' >ADD</button>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </Fragment>
            )
        }

        return (
            <div className="mainContainer" >
                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document one__tab one_step readOnly_inputs" : "documents-stepper noTabs__document one__tab one_step"}>
                    <HeaderDocument projectName={projectName} isViewMode={this.state.isViewMode} perviousRoute={this.state.perviousRoute} docTitle={Resources.projectTaskGroups[currentLanguage]}
                        moduleTitle={Resources['generalCoordination'][currentLanguage]} />
                    <div className="doc-container">
                        <div className="step-content">
                            {this.state.CurrStep === 0 ?
                                <Fragment>
                                    <Formik
                                        initialValues={{
                                            ArrangeTaskGroups: this.state.IsEditMode ? this.state.DocTaskGroupsData.arrange : MaxArrange,
                                            Subject: this.state.IsEditMode ? this.state.DocTaskGroupsData.subject : '',

                                        }}
                                        enableReinitialize={true}
                                        validationSchema={ValidtionSchemaForTaskGroups}

                                        onSubmit={(values, actions) => {
                                            this.AddEditTaskGroups(values, actions)
                                        }}
                                    >

                                        {({ errors, touched, handleBlur, handleChange, values, handleSubmit }) => (
                                            <Form onSubmit={handleSubmit}>

                                                <div className="document-fields">

                                                    <div className="proForm first-proform">
                                                        <div className=' linebylineInput ' >
                                                            <label className="control-label">{Resources['subject'][currentLanguage]}</label>
                                                            <div className={"inputDev ui input " + (errors.Subject && touched.Subject ? 'has-error' : null) + ' '}>
                                                                <input autoComplete="off" className="form-control" name="Subject"
                                                                    value={this.state.IsEditMode ? this.state.DocTaskGroupsData.subject : values.Subject}
                                                                    onBlur={(e) => { handleBlur(e) }}
                                                                    onChange={(e) => {
                                                                        handleChange(e)
                                                                        if (this.state.IsEditMode) {
                                                                            this.setState({ DocTaskGroupsData: { ...this.state.DocTaskGroupsData, subject: e.target.value } })
                                                                        }
                                                                    }}
                                                                    placeholder={Resources['subject'][currentLanguage]} />
                                                                {errors.Subject && touched.Subject ? (<em className="pError">{errors.Subject}</em>) : null}
                                                            </div>
                                                        </div>
                                                        <div className="linebylineInput">
                                                            <label className="control-label"> {Resources['status'][currentLanguage]} </label>
                                                            <div className="ui checkbox radio radioBoxBlue checked">
                                                                <input type="radio" defaultChecked={this.state.IsEditMode ? this.state.DocTaskGroupsData.status ? 'checked' : null : 'checked'}
                                                                    name="Status" value="true" onChange={(e) => this.setState({ Status: e.target.value })} />
                                                                <label>{Resources['oppened'][currentLanguage]}</label>
                                                            </div>

                                                            <div className="ui checkbox radio radioBoxBlue ">
                                                                <input type="radio" defaultChecked={this.state.IsEditMode ? this.state.DocTaskGroupsData.status ? null : 'checked' : null}
                                                                    name="Status" value="false"
                                                                    onChange={(e) => this.setState({ Status: e.target.value })} />
                                                                <label> {Resources['closed'][currentLanguage]}</label>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="proForm datepickerContainer">
                                                        <div className="linebylineInput valid-input">
                                                            <div className="inputDev ui input">
                                                                <DatePicker title='docDate' handleChange={this.DocumentDatehandleChange}
                                                                    startDate={this.state.DocumentDate} Customformat={true}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className='linebylineInput'>
                                                            <label className="control-label">{Resources['numberAbb'][currentLanguage]}</label>
                                                            <div className={"inputDev ui input " + (errors.ArrangeTaskGroups && touched.ArrangeTaskGroups ? 'has-error' : '') + ' '}>
                                                                <input disabled autoComplete="off" className="form-control" name="ArrangeTaskGroups"
                                                                    value={this.state.IsEditMode ? this.state.DocTaskGroupsData.arrange : values.ArrangeTaskGroups}
                                                                    onBlur={(e) => { handleBlur(e) }}
                                                                    onChange={(e) => {
                                                                        handleChange(e)
                                                                        if (this.state.IsEditMode) {
                                                                            this.setState({ DocTaskGroupsData: { ...this.state.DocTaskGroupsData, arrange: e.target.value } })
                                                                        }
                                                                    }}
                                                                    placeholder={Resources['numberAbb'][currentLanguage]} />
                                                                {errors.ArrangeTaskGroups && touched.ArrangeTaskGroups ? (<em className="pError">{errors.ArrangeTaskGroups}</em>) : null}
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className="doc-pre-cycle">
                                                    <div className="slider-Btns">
                                                        {this.showBtnsSaving()}
                                                    </div>
                                                </div>

                                            </Form>
                                        )}
                                    </Formik>
                                    {/* Table List Of Contacts */}
                                    {this.state.IsEditMode ?
                                        <Fragment>
                                            <div className='document-fields'>
                                                <header>
                                                    <h2 className="zero">{Resources['contactList'][currentLanguage]}</h2>
                                                </header>
                                                <table className="attachmentTable attachmentTableAuto">
                                                    <thead>
                                                        <tr>
                                                            <th>
                                                                <div className="headCell tableCell-1">
                                                                    {Resources['delete'][currentLanguage]}
                                                                </div>
                                                            </th>
                                                            <th>
                                                                <div className="headCell tableCell-1">
                                                                    {Resources['arrange'][currentLanguage]}
                                                                </div>
                                                            </th>
                                                            <th>
                                                                <div className="headCell tableCell-2">
                                                                    {Resources['CompanyName'][currentLanguage]}
                                                                </div>
                                                            </th>
                                                            <th>
                                                                <div className="headCell tableCell-3">
                                                                    {Resources['ContactName'][currentLanguage]}
                                                                </div>
                                                            </th>
                                                            <th></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {RenderContactsTable}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </Fragment>
                                        : null
                                    }
                                    <div className="doc-pre-cycle letterFullWidth">
                                        <div>
                                            {this.props.changeStatus === true ?
                                                <ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                                : null
                                            }
                                        </div>
                                    </div>
                                </Fragment>
                                :

                                /* SecoundStep */
                                < div className="subiTabsContent feilds__top">

                                    {RenderAddContact()}

                                    <div className="doc-pre-cycle">
                                        <header>
                                            <h2 className="zero">{Resources['contactList'][currentLanguage]}</h2>
                                        </header>
                                        {dataGrid}
                                    </div>

                                    <div className="doc-pre-cycle">
                                        <div className="slider-Btns">
                                            <button className="primaryBtn-1 btn meduimBtn" onClick={this.saveAndExit}>{Resources['next'][currentLanguage]}</button>
                                        </div>
                                    </div>
                                </div>
                            }

                        </div>


                        <Fragment>
                            <Steps
                                steps_defination={steps_defination}
                                exist_link="/DistributionList/"
                                docId={this.state.docId}
                                changeCurrentStep={stepNo =>
                                    this.changeCurrentStep(stepNo)
                                }
                                stepNo={this.state.CurrStep} changeStatus={docId === 0 ? false : true}
                            />
                        </Fragment>


                    </div>
                    {this.state.showDeleteModal == true ? (
                        <ConfirmationModal
                            title={Resources['smartDeleteMessageContent'][currentLanguage]}
                            closed={this.onCloseModal}
                            showDeleteModal={this.state.showDeleteModal}
                            clickHandlerCancel={this.clickHandlerCancelMain}
                            buttonName='delete' clickHandlerContinue={this.ConfirmationDelete}
                        />
                    ) : null}


                    {/* {
                        this.props.changeStatus === true && this.state.IsEditMode ?
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
                    } */}
                    {this.props.changeStatus === true ? (
                        <div className="approveDocument">
                            <div className="approveDocumentBTNS">
                                {this.state.isLoading ? (
                                    <button className="primaryBtn-1 btn disabled">
                                        <div className="spinner">
                                            <div className="bounce1" />
                                            <div className="bounce2" />
                                            <div className="bounce3" />
                                        </div>
                                    </button>
                                ) : (
                                        <button
                                            className={this.state.isViewMode === true
                                                ? "primaryBtn-1 btn middle__btn disNone"
                                                : "primaryBtn-1 btn middle__btn"
                                            }>
                                            {
                                                Resources.save[currentLanguage]
                                            }
                                        </button>
                                    )}
                                <DocumentActions
                                    isApproveMode={this.state.isApproveMode}
                                    docTypeId={this.state.docTypeId}
                                    docId={this.state.docId}
                                    projectId={this.state.projectId}
                                    previousRoute={this.state.previousRoute}
                                    docApprovalId={this.state.docApprovalId}
                                    currentArrange={this.state.arrange}
                                    //showModal={this.props.showModal}
                                    showModal={true}
                                    showOptionPanel={this.showOptionPanel}
                                    permission={this.state.permission}
                                    documentName="TaskGroup"
                                />
                            </div>
                        </div>
                    ) : null}

                    <div className="largePopup largeModal " style={{ display: this.state.showModal ? 'block' : 'none' }}>
                        <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref} title={Resources[this.state.currentTitle][currentLanguage]}>
                            {this.state.currentComponent}
                        </SkyLight>
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
        file: state.communication.file,
        files: state.communication.files,
        hasWorkflow: state.communication.hasWorkflow
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
)(withRouter(TaskGroupsAddEdit))
