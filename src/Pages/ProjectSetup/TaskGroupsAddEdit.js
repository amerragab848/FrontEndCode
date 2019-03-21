import React, { Component, Fragment } from 'react';
import { withRouter } from "react-router-dom";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import GridSetup from "../Communication/GridSetup";
import Export from "../../Componants/OptionsPanels/Export";
import config from "../../Services/Config";
import Resources from "../../resources.json";
import Api from '../../api';
import { SelectedProjectEps } from './ProjectEPSData'
import { toast } from "react-toastify";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import dataservice from "../../Dataservice"
import Filter from "../../Componants/FilterComponent/filterComponent";
import DropdownMelcous from '../../Componants/OptionsPanels/DropdownMelcous';
import DatePicker from '../../Componants/OptionsPanels/DatePicker';
import { SkyLightStateless } from 'react-skylight';
import moment from 'moment';

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
let CurrProjectId = localStorage.getItem('lastSelectedProject')
let CurrProjectName = localStorage.getItem('lastSelectedprojectName')
const _ = require('lodash')
let MaxArrange = 1
let idEdit = 1

const ValidtionSchemaExpensesWorkFlow = Yup.object().shape({
    ArrangeExpensesWorkFlow: Yup.string()
        .required(Resources['isRequiredField'][currentLanguage]),
    Subject: Yup.string()
        .required(Resources['isRequiredField'][currentLanguage]),
    ProjectName: Yup.string()
        .required(Resources['isRequiredField'][currentLanguage])
        .nullable(true),
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


class TaskGroupsAddEdit extends Component {
    constructor(props) {
        super(props)

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
            DocumentDate: moment().format('DD:MM:YYYY'),
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

        }
    }

    FillCompanyDrop = () => {
        dataservice.GetDataList('GetProjectProjectsCompaniesForList?projectId=' + CurrProjectId + '', 'companyName', 'companyId').then(
            res => {
                this.setState({
                    CompanyData: res,
                })
            }
        )
    }

    FillContactsList=()=>{
        Api.get('GetProjectTaskGroupItemsByTaskId?taskId='+idEdit+'').then(
            res=>{
                this.setState({
                    
                })
            }
        )
    }

    componentWillMount = () => {
        this.FillCompanyDrop();
    }

    componentDidMount = () => {

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

    render() {
        const AddContact = () => {
            return (
                <Fragment>

                    <Formik
                        initialValues={{
                            ArrangeContact: idEdit !== 0 ? Math.max.apply(Math, this.state.rows.map(function (o) { return o.arrange + 1 })) : 1,
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
                                            ArrangeExpensesWorkFlow: this.state.IsEditMode ? this.state.ExpensesWorkFlowDataForEdit.arrange : MaxArrange,
                                            Subject: this.state.IsEditMode ? this.state.ExpensesWorkFlowDataForEdit.subject : '',
                                            ProjectName: this.state.IsEditMode ? this.state.selectedProject : '',
                                        }}
                                        enableReinitialize={true}
                                        validationSchema={ValidtionSchemaExpensesWorkFlow}

                                        onSubmit={(values, actions) => {
                                            this.AddEditWorkFlow(values, actions)
                                        }}
                                    >

                                        {({ errors, touched, handleBlur, handleChange, values, handleSubmit, setFieldValue, setFieldTouched }) => (
                                            <Form onSubmit={handleSubmit}>

                                                <div className="document-fields">

                                                    <div className="proForm first-proform">
                                                        <div className={'ui input inputDev linebylineInput ' + (errors.Subject && touched.Subject ? 'has-error' : null) + ' '}>
                                                            <label className="control-label">{Resources['subject'][currentLanguage]}</label>
                                                            <div className="inputDev ui input">
                                                                <input autoComplete="off" className="form-control" name="Subject"
                                                                    value={this.state.IsEditMode ? this.state.ExpensesWorkFlowDataForEdit.subject : values.Subject}
                                                                    onBlur={(e) => { handleBlur(e) }}
                                                                    onChange={(e) => {
                                                                        handleChange(e)
                                                                        if (this.state.IsEditMode) {
                                                                            this.setState({ ExpensesWorkFlowDataForEdit: { ...this.state.ExpensesWorkFlowDataForEdit, subject: e.target.value } })
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
                                                                    // ={this.state.ExpensesWorkFlowDataForEdit.status ? 'checked' : null} 
                                                                    name="Status" value="true" onChange={(e) => this.setState({ Status: e.target.value })} />
                                                                <label>{Resources['oppened'][currentLanguage]}</label>
                                                            </div>
                                                            <div className="ui checkbox radio radioBoxBlue ">
                                                                <input type="radio" name="Status" value="false"
                                                                    defaultChecked
                                                                    //  ={this.state.ExpensesWorkFlowDataForEdit.status ? null : 'checked'}
                                                                    onChange={(e) => this.setState({ Status: e.target.value })} />
                                                                <label> {Resources['closed'][currentLanguage]}</label>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="proForm datepickerContainer">
                                                        <div className="linebylineInput valid-input">
                                                            <div className="inputDev ui input">
                                                                <DatePicker title='docDate' handleChange={this.DocumentDatehandleChange}
                                                                    startDate={this.state.IsEditMode ? this.state.ExpensesWorkFlowDataForEdit.creationDate === null ?
                                                                        this.state.DocumentDate : this.state.ExpensesWorkFlowDataForEdit.creationDate
                                                                        : this.state.DocumentDate} />
                                                            </div>
                                                        </div>
                                                        <div className={'ui input inputDev linebylineInput  ' + (errors.ArrangeExpensesWorkFlow && touched.ArrangeExpensesWorkFlow ? 'has-error' : null) + ' '}>
                                                            <label className="control-label">{Resources['numberAbb'][currentLanguage]}</label>
                                                            <div className="inputDev ui input">
                                                                <input autoComplete="off" className="form-control" name="ArrangeExpensesWorkFlow"
                                                                    value={this.state.IsEditMode ? this.state.ExpensesWorkFlowDataForEdit.arrange : values.ArrangeExpensesWorkFlow}
                                                                    onBlur={(e) => { handleBlur(e) }}
                                                                    onChange={(e) => {
                                                                        handleChange(e)
                                                                        if (this.state.IsEditMode) {
                                                                            this.setState({ ExpensesWorkFlowDataForEdit: { ...this.state.ExpensesWorkFlowDataForEdit, arrange: e.target.value } })
                                                                        }
                                                                    }}
                                                                    placeholder={Resources['numberAbb'][currentLanguage]} />
                                                                {errors.ArrangeExpensesWorkFlow && touched.ArrangeExpensesWorkFlow ? (<em className="pError">{errors.ArrangeExpensesWorkFlow}</em>) : null}
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
                                    {idEdit !== 0 ?
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

                                                        {/* {renderMultiApprovalTable} */}

                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="doc-pre-cycle">
                                                <div className="slider-Btns">
                                                    <button className="primaryBtn-1 btn meduimBtn" onClick={this.SaveMultiApproval} >{Resources['next'][currentLanguage]}</button>
                                                </div>
                                            </div>
                                        </Fragment>
                                        : null
                                    }
                                </Fragment>
                                :

                                /* SecoundStep */
                                < div className="subiTabsContent feilds__top">

                                    {AddContact()}

                                    <div className="doc-pre-cycle">
                                        <header>
                                            <h2 className="zero">{Resources['contactList'][currentLanguage]}</h2>
                                        </header>
                                        {/* {dataGrid} */}
                                    </div>

                                    <div className="doc-pre-cycle">
                                        <div className="slider-Btns">
                                            <button className="primaryBtn-1 btn meduimBtn" onClick={this.NextStep}>{Resources['next'][currentLanguage]}</button>
                                        </div>
                                    </div>
                                </div>
                            }

                        </div>


                        {/* Right Menu */}
                        <div className="docstepper-levels">
                            {/* Next & Previous */}
                            <div className="step-content-foot">
                                <span onClick={this.PreviousStep} className={!this.state.FirstStep && idEdit !== 0 ? "step-content-btn-prev " :
                                    "step-content-btn-prev disabled"}>{Resources['previous'][currentLanguage]}<i className="fa fa-caret-left" aria-hidden="true"></i></span>

                                <span onClick={this.NextStep} className={!this.state.ThirdStepComplate && idEdit !== 0 ? "step-content-btn-prev "
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
                </div>
            </div >
        )
    }
}
export default withRouter(TaskGroupsAddEdit)