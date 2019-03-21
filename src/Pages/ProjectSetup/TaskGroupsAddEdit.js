import React, { Component, Fragment } from 'react';
import { withRouter } from "react-router-dom";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import GridSetup from "../Communication/GridSetup";
import Export from "../../Componants/OptionsPanels/Export";
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

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
let CurrProjectId = localStorage.getItem('lastSelectedProject')
let CurrProjectName = localStorage.getItem('lastSelectedprojectName')
const _ = require('lodash')
let MaxArrange = 1
let idEdit = 2

const ValidtionSchemaForTaskGroups = Yup.object().shape({
    ArrangeTaskGroups: Yup.string()
        .required(Resources['isRequiredField'][currentLanguage]),
    Subject: Yup.string()
        .required(Resources['isRequiredField'][currentLanguage]),
})

const ValidtionSchemaForContact = Yup.object().shape({
    ArrangeContact: Yup.string()
        .required(Resources['isRequiredField'][currentLanguage]),
    Company: Yup.string()
        .required(Resources['isRequiredField'][currentLanguage])
        .nullable(true),
    ContactName: Yup.string()
        .required(Resources['isRequiredField'][currentLanguage])
        .nullable(false),
});

let docId = 0;
let projectId = 0;
let projectName = "";
let isApproveMode = 0;
let docApprovalId = 0;
let arrange = 0;
let actions = []

class TaskGroupsAddEdit extends Component {
    constructor(props) {
        super(props)
        console.log('Render222')
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

                index++;
            }
        }

        const columnsGrid = [
            {
                key: "id",
                visible: false,
                width: 50,
                frozen: true
            },
            {
                key: "arrange",
                name: Resources["numberAbb"][currentLanguage],
                width: 50,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "companyName",
                name: Resources["CompanyName"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "contactName",
                name: Resources["ContactName"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }
        ]

        this.state = {
            currentTitle: "sendToWorkFlow",
            IsEditMode: false,
            isViewMode: false,
            isApproveMode: isApproveMode,
            isView: false,
            docId: docId,
            docTypeId: 99,
            projectId: projectId,
            docApprovalId: docApprovalId,
            DocumentDate: moment().format("DD:MM:YYYY"),
            Status: 'true',
            CompanyData: [],
            ContactData: [],
            FirstStep: true,
            SecondStep: false,
            SecondStepComplate: false,
            isLoading: true,
            CurrStep: 1,
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
    }

    FillCompanyDrop = () => {
        dataservice.GetDataList('GetProjectProjectsCompaniesForList?projectId=' + projectId + '', 'companyName', 'companyId').then(
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
                console.log(res)
                this.setState({
                    rows: res,
                    isLoading: false
                })
            }
        )
    }

    componentWillMount = () => {
        this.FillCompanyDrop();
        this.FillContactsList()
        if (Config.IsAllow(776)) {
            this.setState({
                showCheckbox: true
            })
        }
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
        else {
            if (this.state.CurrStep === 2) {
                window.scrollTo(0, 0)
                this.setState({
                    FirstStep: false,
                    SecondStep: false,
                    CurrStep: this.state.CurrStep + 1,
                })
            }
        }
    }
 

    PreviousStep = () => {
        if (idEdit !== 0) {
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
                }
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
        if (props.document && props.document.id > 0) {
            let date = moment(props.document.docDate).format("DD:MM:YYYY")
            this.setState({
                IsEditMode: true,
                DocTaskGroupsData: { ...props.document },
                DocumentDate:date,
                isLoading: false
            });
            this.checkDocumentIsView();
        }

    }


    DeleteContact = (rowId, index) => {
        if (index === undefined) {
            this.setState({
                showDeleteModal: true,
                rowId: rowId,
                DeleteFromLog: true
            })
        }
        else {
            this.setState({
                showDeleteModal: true,
                rowId: rowId,
                index: index
            })
        }
    }

    ConfirmationDelete = () => {

        this.setState({ isLoading: true })
        let IdRow = this.state.rowId[0]
        let Data = this.state.rows;
        let NewData = []

        if (this.state.DeleteFromLog) {
            NewData = Data.filter(s => s.id !== IdRow)
            this.setState({ rows: NewData })
        }
        else {
            Data.splice(this.state.index, 1);
            this.setState({ rows: Data });
        }

        Api.post("ProjectTaskGroupsItemDelete?id=" + this.state.rowId).then(
            res => {
                this.setState({
                    showDeleteModal: false,
                    isLoading: false,
                    DeleteFromLog: false
                })
            }

        ).catch(ex => {
            this.setState({
                showDeleteModal: false,
                isLoading: false,
                DeleteFromLog: false
            });
        });
        toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)
    }

    onCloseModal = () => {
        this.setState({ showDeleteModal: false });
    }

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });
    }

    AddContact = (values, actions) => {
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
            }
        )
        toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)
        values.Company = ''
        values.ContactName = ''
        values.ArrangeContact = Math.max.apply(Math, this.state.rows.map(function (o) { return o.arrange + 1 }))


    }

    AddEditTaskGroups = (values, actions) => {

        if (this.state.IsEditMode) {
            Api.post('EditProjectTaskGroups', {
                account: this.state.DocTaskGroupsData.account,
                arrange: values.ArrangeTaskGroups,
                deleteDate: this.state.DocTaskGroupsData.deleteDate,
                deletedBy: this.state.DocTaskGroupsData.deletedBy,
                docCloseDate: this.state.DocTaskGroupsData.docCloseDate,
                docDate: this.state.DocumentDate,
                id: docId,
                isDeleted: this.state.DocTaskGroupsData.isDeleted,
                projectId: projectId,
                project_projects: this.state.DocTaskGroupsData.project_projects,
                project_task_groups_items: [],
                status: this.state.Status,
                subject: values.Subject,
            }).then(
                res => {
                    this.setState({
                        DocTaskGroupsData: res
                    })
                })
        }
        else {
            Api.post('AddTaskGroup', {
                id: undefined,
                projectId: this.state.projectId,
                arrange: values.ArrangeTaskGroups,
                subject: values.Subject,
                docDate: this.state.DocumentDate,
                status: this.state.Status,
                docCloseDate: moment().format(),
            }).then(
                res => {
                    this.setState({
                        DocTaskGroupsData: res
                    })
                })
        }
        toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)
        this.NextStep()

    }

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!(Config.IsAllow(775))) {
                this.setState({ isViewMode: true });
            }
            if (this.state.isApproveMode != true && Config.IsAllow(775)) {
                if (this.props.hasWorkflow == false && Config.IsAllow(775)) {
                    if (this.props.document.status == true && Config.IsAllow(775)) {
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

    componentDidMount = () => {
        if (docId > 0) {
            this.props.actions.documentForEdit('GetProjectTaskGroupsForEdit?taskId=' + docId)
            this.checkDocumentIsView();
        }
        else {
            Api.get('GetNextArrangeMainDoc?projectId=' + projectId + '&docType=99&companyId=undefined&contactId=undefined').then(
                res => {
                    MaxArrange = res
                }
            )
        }
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

    saveAndExit=()=> {
        this.props.history.push({
            pathname: '/TaskGroups/'+projectId+'',
        })
    }

    handleShowAction = (item) => {
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
            }];

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
                        <td>{item.arrange}</td>
                        <td>{item.companyName}</td>
                        <td>{item.contactName}</td>
                    </tr>
                    : <LoadingSection />
            )
        })
        const dataGrid =
            this.state.isLoading === false ? (
                <GridSetup rows={this.state.rows} columns={this.state.columns}
                    showCheckbox={this.state.showCheckbox}
                    minHeight={350}
                    clickHandlerDeleteRows={this.DeleteContact}
                />
            ) : <LoadingSection />

        const RenderAddContact = () => {
            return (
                <Fragment>

                    <Formik
                        initialValues={{
                            ArrangeContact: this.state.rows.length === 0 ? 1 : Math.max.apply(Math, this.state.rows.map(function (o) { return o.arrange + 1 })) ,
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
                                            <div className="inputDev ui input">
                                                <DropdownMelcous title="company" data={this.state.CompanyData} name="Company"
                                                    selectedValue={this.state.IsEditExpensesWorkFlowItem ? this.state.SelectedCompany : values.Company} onChange={setFieldValue}
                                                    handleChange={(e) => this.handleChangeDrops(e, "Company")}
                                                    onBlur={setFieldTouched}
                                                    error={errors.Company}
                                                    touched={touched.Company}
                                                    value={values.Company} isClear={true} />
                                            </div>
                                        </div>


                                        <div className="linebylineInput valid-input">
                                            <div className="inputDev ui input">
                                                <DropdownMelcous title="ContactName" data={this.state.ContactData} name="ContactName"
                                                    selectedValue={this.state.IsEditExpensesWorkFlowItem ? this.state.SelectedContact : values.ContactName} onChange={setFieldValue}
                                                    handleChange={(e) => this.handleChangeDrops(e, "ContactName")}
                                                    onBlur={setFieldTouched}
                                                    error={errors.ContactName}
                                                    touched={touched.ContactName}
                                                    value={values.ContactName} />
                                            </div>
                                        </div>

                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">{Resources['numberAbb'][currentLanguage]}</label>
                                            <div className={'ui input inputDev ' + (errors.ArrangeContact && touched.ArrangeContact ? 'has-error' : null) + ' '}>
                                                <input autoComplete="off" value={values.ArrangeContact} className="form-control" name="ArrangeContact"
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
                <div className="documents-stepper noTabs__document one__tab one_step">
                    {/* Header */}
                    <div className="submittalHead">
                        <h2 className="zero">{CurrProjectName + ' - ' + Resources['projectTaskGroups'][currentLanguage]}</h2>
                        <div className="SubmittalHeadClose">
                            <svg width="56px" height="56px" viewBox="0 0 56 56" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                    <g id="Components/Sections/Doc-page/Title/Base" transform="translate(-1286.000000, -24.000000)">
                                        <g id="Group-2">
                                            <g id="Action-icons/Close/Circulated/56px/Light-grey_Normal" transform="translate(1286.000000, 24.000000)">
                                                <g id="Action-icons/Close/Circulated/20pt/Grey_Normal">
                                                    <g id="Group">
                                                        <circle id="Oval" fill="#E9ECF0" cx="28" cy="28" r="28"></circle>
                                                        <path d="M36.5221303,34.2147712 C37.1592899,34.8519308 37.1592899,35.8849707 36.5221303,36.5221303 C35.8849707,37.1592899 34.8519308,37.1592899 34.2147712,36.5221303 L28,30.3073591 L21.7852288,36.5221303 C21.1480692,37.1592899 20.1150293,37.1592899 19.4778697,36.5221303 C18.8407101,35.8849707 18.8407101,34.8519308 19.4778697,34.2147712 L25.6926409,28 L19.4778697,21.7852288 C18.8407101,21.1480692 18.8407101,20.1150293 19.4778697,19.4778697 C20.1150293,18.8407101 21.1480692,18.8407101 21.7852288,19.4778697 L28,25.6926409 L34.2147712,19.4778697 C34.8519308,18.8407101 35.8849707,18.8407101 36.5221303,19.4778697 C37.1592899,20.1150293 37.1592899,21.1480692 36.5221303,21.7852288 L30.3073591,28 L36.5221303,34.2147712 Z"
                                                            id="Combined-Shape" fill="#858D9E" fillRule="nonzero"></path>
                                                    </g>
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </div>
                    </div>

                    <div className="doc-container">
                        <div className="step-content">
                            {this.state.FirstStep ?

                                // FirstStep
                                <Fragment>
                                    <Formik
                                        initialValues={{
                                            ArrangeTaskGroups: this.state.IsEditMode ? ' ' : MaxArrange,
                                            Subject: this.state.IsEditMode ? ' ' : '',
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
                                                        <div className={'ui input inputDev linebylineInput ' + (errors.Subject && touched.Subject ? 'has-error' : null) + ' '}>
                                                            <label className="control-label">{Resources['subject'][currentLanguage]}</label>
                                                            <div className="inputDev ui input">
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
                                                                <input type="radio" defaultChecked
                                                                    ={this.state.DocTaskGroupsData.status ? 'checked' : null}
                                                                    name="Status" value="true" onChange={(e) => this.setState({ Status: e.target.value })} />
                                                                <label>{Resources['oppened'][currentLanguage]}</label>
                                                            </div>
                                                            <div className="ui checkbox radio radioBoxBlue ">
                                                                <input type="radio" name="Status" value="false"
                                                                    defaultChecked
                                                                    ={this.state.DocTaskGroupsData.status ? null : 'checked'}
                                                                    onChange={(e) => this.setState({ Status: e.target.value })} />
                                                                <label> {Resources['closed'][currentLanguage]}</label>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="proForm datepickerContainer">
                                                        <div className="linebylineInput valid-input">
                                                            <div className="inputDev ui input">
                                                                <DatePicker title='docDate' handleChange={this.DocumentDatehandleChange}
                                                                  startDate={this.state.DocumentDate}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className={'ui input inputDev linebylineInput  ' + (errors.ArrangeTaskGroups && touched.ArrangeTaskGroups ? 'has-error' : null) + ' '}>
                                                            <label className="control-label">{Resources['numberAbb'][currentLanguage]}</label>
                                                            <div className="inputDev ui input">
                                                                <input autoComplete="off" className="form-control" name="ArrangeTaskGroups"
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
                                                        <button className="primaryBtn-1 btn meduimBtn" type='submit'>NEXT</button>
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
                                                <table className="ui table">
                                                    <thead>
                                                        <tr>
                                                            <th>{Resources['delete'][currentLanguage]}</th>
                                                            <th>{Resources['arrange'][currentLanguage]}</th>
                                                            <th>{Resources['CompanyName'][currentLanguage]}</th>
                                                            <th>{Resources['ContactName'][currentLanguage]}</th>

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


                        {/* Right Menu */}
                        <div className="docstepper-levels">
                            {/* Next & Previous */}
                            <div className="step-content-foot">
                                <span onClick={this.PreviousStep} className={!this.state.FirstStep && this.state.IsEditMode ? "step-content-btn-prev " :
                                    "step-content-btn-prev disabled"}>{Resources['previous'][currentLanguage]}<i className="fa fa-caret-left" aria-hidden="true"></i></span>

                                <span onClick={this.NextStep} className={!this.state.ThirdStepComplate && this.state.IsEditMode ? "step-content-btn-prev "
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
                                            <h6>{Resources['projectTaskGroups'][currentLanguage]}</h6>
                                        </div>
                                    </div>

                                    <div data-id="step2 " className={'step-slider-item ' + (this.state.ThirdStepComplate ? 'active' : this.state.SecondStepComplate ? "current__step" : "")} >
                                        <div className="steps-timeline">
                                            <span>2</span>
                                        </div>
                                        <div className="steps-info">
                                            <h6 >{Resources['ContactsLog'][currentLanguage]}</h6>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    {this.state.showDeleteModal == true ? (
                        <ConfirmationModal
                            title={Resources['smartDeleteMessage'][currentLanguage].content}
                            closed={this.onCloseModal}
                            showDeleteModal={this.state.showDeleteModal}
                            clickHandlerCancel={this.clickHandlerCancelMain}
                            buttonName='delete' clickHandlerContinue={this.ConfirmationDelete}
                        />
                    ) : null}
                    {
                        this.props.changeStatus === true ?
                            <div className="approveDocument">
                                <div className="approveDocumentBTNS">
                                    <button className={this.state.isViewMode === true ? "primaryBtn-1 btn middle__btn disNone" : "primaryBtn-1 btn middle__btn"} onClick={e => this.editPhone(e)}>{Resources.save[currentLanguage]}</button>
                                    {this.state.isApproveMode === true ?
                                        <div >
                                            <button className="primaryBtn-1 btn " onClick={(e) => this.handleShowAction(actions[2])} >{Resources.approvalModalApprove[currentLanguage]}</button>
                                            <button className="primaryBtn-2 btn middle__btn" onClick={(e) => this.handleShowAction(actions[3])} >{Resources.approvalModalReject[currentLanguage]}</button>
                                        </div>
                                        : null
                                    }
                                    <button className="primaryBtn-2 btn middle__btn" onClick={(e) => this.handleShowAction(actions[1])}>{Resources.sendToWorkFlow[currentLanguage]}</button>
                                    <button className="primaryBtn-2 btn" onClick={(e) => this.handleShowAction(actions[0])}>{Resources.distributionList[currentLanguage]}</button>
                                    <span className="border"></span>
                                    <div className="document__action--menu">
                                        <OptionContainer permission={this.state.permission} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                    </div>
                                </div>
                            </div>
                            : null
                    }

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
