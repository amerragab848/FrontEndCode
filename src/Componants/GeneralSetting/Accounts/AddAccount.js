import React, { Component, Fragment } from 'react';
import DropdownMelcous from '../../OptionsPanels/DropdownMelcous';
import InPut from '../../OptionsPanels/InputMelcous';
import moment from 'moment';
import Api from '../../../api';
import NotifiMsg from '../../publicComponants/NotifiMsg'
import Recycle from '../../../Styles/images/attacheRecycle.png'
import Resources from '../../../resources.json';
import ConfirmationModal from "../../../Componants/publicComponants/ConfirmationModal";
import config from "../../../Services/Config";
import _ from "lodash";
import { Formik, Form, withFormik } from 'formik';
import * as Yup from 'yup';
import { withRouter } from "react-router-dom";
import { AvPauseCircleOutline } from 'material-ui/svg-icons';
import LoadingSection from '../../publicComponants/LoadingSection';
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
const publicConfiguarion = config.getPayload();
const getPublicConfiguartion = config.getPublicConfiguartion();
let ListOfDays = [];
const validationSchema = Yup.object().shape({
    WorkHours: Yup.number()
        .min(.5, Resources['numbersGreaterThanOrEqualHalf'][currentLanguage])
        .typeError(Resources['onlyNumbers'][currentLanguage]),
    RateHours: Yup.number()
        .min(.5, Resources['numbersGreaterThanOrEqualHalf'][currentLanguage])
        .typeError(Resources['onlyNumbers'][currentLanguage])
});
// const RateHoursValid = Yup.object().shape({


class AddAccount extends Component {
    constructor(props) {
        super(props)
        this.state = {
            UserName: '',
            Password: '',
            CompanyData: [],
            CompanyId: '',
            ContactData: [],
            ContactId: '',
            WorkingHours: '',
            HoursRate: '',
            SupervisorCompanyData: [],
            SupervisorCompanyId: '',
            SupervisorNameData: [],
            SupervisorId: '',
            GroupNameData: [],
            GroupNameId: '',
            EmpCode: '',
            DesignTeam: 'false',
            TaskAdmin: false,
            Active: true,
            UserPermissiononLogsCreatedbyOthers: false,
            HRVacationDays: [],
            checked: false,
            AccountId: '6',
            ErrorSameUserName: false,
            ErrorSameEmpCode: false,
            statusClass: "disNone",
            LoadingVaildation: false,
            SaveMSG: false,
            SupervisorCompanyValidation: true,
            SupervisorNameValidation: true,
            CompanyValidation: true,
            ContactValidation: true,
        }
    }

    componentDidMount = () => {
        this.GetData('GetCompanies?accountOwnerId=' + publicConfiguarion.aoi + '', 'companyName', 'id', 'CompanyData');
        this.GetData('GetGroup?accountOwnerId=' + publicConfiguarion.aoi + '', 'groupName', 'id', 'GroupNameData');
        this.DesignTeamChange = this.DesignTeamChange.bind(this);
    }

    workHoursChangeHandler = (e) => {
        let workHour = e.target.value;
        this.setState({ WorkingHours: workHour })
    }

    passwordChangeHandler = (e) => {
        let password = e.target.value.replace(/&/g, '%26%')
        this.setState({ Password: password })
    }

    hoursRateChangeHandler = (e) => {
        let hoursRate = e.target.value;
        this.setState({ HoursRate: hoursRate })
    }

    DesignTeamChange = (e) => {
        this.setState({
            DesignTeam: e.target.value
        })
    }

    TaskAdminChange = (e) => {
        this.setState({
            TaskAdmin: e.target.value
        })
    }

    ActiveChange = (e) => {
        this.setState({
            Active: e.target.value
        })
    }

    UserPermissiononLogsChange = (e) => {
        this.setState({
            UserPermissiononLogsCreatedbyOthers: e.target.value
        })
    }

    CompanyNamehandleChange = (e) => {
        this.setState({ CompanyId: e.value, CompanyValidation: false })
        this.GetData('GetContactsNotUsersByCompanyId?companyId=' + e.value + '', 'contactName', 'id', 'ContactData')
    }

    SupervisorCompanyhandleChange = (e) => {
        this.setState({ SupervisorCompanyId: e.value, SupervisorCompanyValidation: false })
        this.GetData('GetContactsByCompanyIdForOnlyUsers?companyId=' + e.value + '', 'contactName', 'id', 'SupervisorNameData')
    }

    SupervisorNamehandleChange = (e) => {
        this.setState({ SupervisorId: e.value, SupervisorNameValidation: false })
    }

    ContactNamehandleChange = (e) => {
        this.setState({ ContactId: e.value, ContactValidation: false })
    }

    GroupNameData = (e) => {
        this.setState({ GroupNameId: e.value })
    }

    UserNameChangeHandler = (e) => {
        this.setState({ LoadingVaildation: true })
        let username = e.target.value.toLowerCase();
        username.replace(/&/g, '%26%')
        if (username !== "") {
            Api.get('CheckUserNameAccount?userName=' + username + '').then(
                res => {
                    if (res === true) {

                        this.setState({
                            LoadingVaildation: false,
                            statusClass: "animationBlock",
                            ErrorSameUserName: true
                        })
                    }
                    else {
                        this.setState({ LoadingVaildation: false, UserName: username })
                    }
                    setTimeout(() => {
                        this.setState({ ErrorSameUserName: false, statusClass: "disNone" })
                    }, 1000);

                }
            )
        }
        else {
            this.setState({ LoadingVaildation: false })

        }
    }

    employeeCodeChangeHandler = (e) => {
        this.setState({ LoadingVaildation: true })
        let empcode = e.target.value;
        if (empcode !== "") {
            Api.get('CheckRefCodeEmployee?code=' + empcode + '').then(
                res => {
                    if (res === true) {
                        this.setState({
                            LoadingVaildation: false,
                            statusClass: "animationBlock",
                            ErrorSameEmpCode: true
                        })
                    }
                    else {
                        this.setState({ LoadingVaildation: false, EmpCode: empcode })
                    }
                    setTimeout(() => {
                        this.setState({ ErrorSameEmpCode: false, statusClass: "disNone" })
                    }, 1000);
                }
            )
        } else {
            this.setState({ LoadingVaildation: false })
        }
    }

    DayVacationhandleCheck = (e) => {
        let dayId = e.target.value
        let dayIsInlist = ListOfDays.filter(s => s === dayId).length
        if (dayIsInlist > 0) {
            var index = ListOfDays.indexOf(dayId)
            ListOfDays.splice(index, 1)
        }
        else {
            ListOfDays.push(dayId)
        }
        this.setState({ checked: !this.state.checked });
    }

    render() {
        return (

            <div className="mainContainer">
                <div className="documents-stepper cutome__inputs">
                    <div className="submittalHead">
                        <h2 className="zero">Add Account</h2>
                        <div className="SubmittalHeadClose">
                            <svg width="56px" height="56px" viewBox="0 0 56 56" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                    <g id="Components/Sections/Doc-page/Title/Base" transform="translate(-1286.000000, -24.000000)">
                                        <g id="Group-2">
                                            <g id="Action-icons/Close/Circulated/56px/Light-grey_Normal" transform="translate(1286.000000, 24.000000)">
                                                <g id="Action-icons/Close/Circulated/20pt/Grey_Normal">
                                                    <g id="Group">
                                                        <circle id="Oval" fill="#E9ECF0" cx="28" cy="28" r="28"></circle>
                                                        <path d="M36.5221303,34.2147712 C37.1592899,34.8519308 37.1592899,35.8849707 36.5221303,36.5221303 C35.8849707,37.1592899 34.8519308,37.1592899 34.2147712,36.5221303 L28,30.3073591 L21.7852288,36.5221303 C21.1480692,37.1592899 20.1150293,37.1592899 19.4778697,36.5221303 C18.8407101,35.8849707 18.8407101,34.8519308 19.4778697,34.2147712 L25.6926409,28 L19.4778697,21.7852288 C18.8407101,21.1480692 18.8407101,20.1150293 19.4778697,19.4778697 C20.1150293,18.8407101 21.1480692,18.8407101 21.7852288,19.4778697 L28,25.6926409 L34.2147712,19.4778697 C34.8519308,18.8407101 35.8849707,18.8407101 36.5221303,19.4778697 C37.1592899,20.1150293 37.1592899,21.1480692 36.5221303,21.7852288 L30.3073591,28 L36.5221303,34.2147712 Z" id="Combined-Shape" fill="#858D9E" fillRule="nonzero"></path>
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
                            <div className="subiTabsContent">

                                <div className="document-fields">

                                    {this.state.ErrorSameUserName ?
                                        <NotifiMsg statusClass={this.state.statusClass} IsSuccess="false" Msg={Resources['userNameAlreadyExisted'][currentLanguage]} />
                                        : null}

                                    {this.state.ErrorSameEmpCode ?
                                        <NotifiMsg statusClass={this.state.statusClass} IsSuccess="false" Msg={Resources['smartDeleteMessage'][currentLanguage].refCodeExist} />
                                        : null}

                                    {this.state.SaveMSG ?
                                        <NotifiMsg statusClass={this.state.statusClass} IsSuccess="true" Msg={Resources['smartSentAccountingMessage'][currentLanguage].successTitle} />
                                        : null}

                                    {this.state.LoadingVaildation ? <LoadingSection /> : null}
                                    <Form className="proForm datepickerContainer">
                                        <Formik
                                            initialValues={{
                                                UserName: '',
                                                Password: '',
                                                WorkHours: '',
                                                SupervisorCompanyValidation: '',
                                                EmpCode: '',
                                                RateHours: '',
                                                SupervisorNameValidation: '',
                                                CompanyValidation: '',
                                                ContactValidation: '',
                                            }}
                                            validationSchema={validationSchema}
                                            validate={values => {
                                                let errors = {};
                                                if (values.WorkHours.length == 0) {
                                                    errors.WorkHours = Resources['isRequiredField'][currentLanguage];
                                                }
                                                if (values.RateHours.length == 0) {
                                                    errors.RateHours = Resources['isRequiredField'][currentLanguage];
                                                }
                                                if (values.UserName.length == 0) {
                                                    errors.UserName = Resources['isRequiredField'][currentLanguage];
                                                }
                                                if (values.Password.length == 0) {
                                                    errors.Password = Resources['isRequiredField'][currentLanguage];
                                                }
                                                if (values.EmpCode.length == 0) {
                                                    errors.EmpCode = Resources['isRequiredField'][currentLanguage];
                                                }

                                                return errors;
                                            }}
                                            onSubmit={(values, actions) => {
                                                if (!this.state.CompanyValidation && !this.state.SupervisorNameValidation && !this.state.SupervisorCompanyValidation && !this.state.ContactValidation) {
                                                    Api.authorizationApi('ProcoorAuthorization?username=' + this.state.UserName + '&password=' + this.state.Password + '&companyId=' + this.state.CompanyId + '', null, 'POST').then(
                                                        Api.post('AddAccount',
                                                            {
                                                                'userName': this.state.UserName,
                                                                'userPassword': this.state.Password,
                                                                'accountCompanyId': getPublicConfiguartion.accountCompanyId,
                                                                'companyId': this.state.CompanyId,
                                                                'contactId': this.state.ContactId,
                                                                'contactSupervisorId': this.state.SupervisorId,
                                                                'companySupervisorId': this.state.SupervisorCompanyId,
                                                                'defaultHours': this.state.WorkingHours,
                                                                'userRate': this.state.HoursRate,
                                                                'groupId': this.state.GroupNameId,
                                                                'empCode': this.state.EmpCode,
                                                                'designTeam': this.state.DesignTeam,
                                                                'isTaskAdmin': this.state.TaskAdmin,
                                                                'active': this.state.Active,
                                                                'passwordEdit': false,
                                                                'isHrManager': false,
                                                                'usePermissionsOnLogs': this.state.UserPermissiononLogsCreatedbyOthers
                                                            }).then(
                                                                res => {
                                                                    //return AccountId  to save Vacations
                                                                    this.setState({
                                                                        // AccountId:res.id
                                                                        SaveMSG: true
                                                                    })
                                                                },
                                                                ListOfDays.forEach(function (item) {
                                                                    var dayId = '';
                                                                    dayId = item
                                                                    // Api.post('UpdateVacations?accountId='+this.state.AccountId+'&dayId='+dayId+'').catch(ex => { })
                                                                })
                                                            )
                                                    )
                                                    setTimeout(() => {
                                                        this.setState({
                                                            SaveMSG: false
                                                        })
                                                    }, 1000)
                                                    this.props.history.push({
                                                        pathname: '/Accounts',
                                                    })
                                                }
                                            }}
                                            onReset={(values) => { }}
                                        >
                                            {({ errors, touched, handleBlur, handleChange, handleReset, handleSubmit, isSubmitting }) => (
                                                <Form id="signupForm1" className="proForm" noValidate="novalidate" onSubmit={handleSubmit}>

                                                    <div className="linebylineInput valid-input">
                                                        {this.state.ErrorSameUserName ?
                                                            <InPut title='UserName' placeholderText='UserName' value='' onBlurEvent={this.UserNameChangeHandler} />
                                                            :
                                                            <Fragment>
                                                                <label className="control-label">{Resources['UserName'][currentLanguage]} </label>
                                                                <div className={errors.UserName && touched.UserName ?
                                                                    ("ui input inputDev has-error") : "ui input inputDev"} >
                                                                    <input name='UserName'
                                                                        className="form-control" id="UserName" placeholder={Resources['UserName'][currentLanguage]} autoComplete='off'
                                                                        onBlur={(e) => {
                                                                            this.UserNameChangeHandler(e)
                                                                            handleBlur(e)
                                                                        }} onChange={handleChange} />
                                                                    {errors.UserName && touched.UserName ? (
                                                                        <em className="pError">{errors.UserName}</em>
                                                                    ) : null}
                                                                </div>
                                                            </Fragment>
                                                        }
                                                    </div>

                                                    <div className="linebylineInput valid-input">
                                                        <label className="control-label">{Resources['password'][currentLanguage]} </label>
                                                        <div className={errors.Password && touched.Password ?
                                                            ("ui input inputDev has-error") : "ui input inputDev"} >
                                                            <input name='Password'
                                                                className="form-control" id="Password" placeholder={Resources['password'][currentLanguage]} autoComplete='off'
                                                                onBlur={(e) => {
                                                                    this.passwordChangeHandler(e)
                                                                    handleBlur(e)
                                                                }} onChange={handleChange} />
                                                            {errors.Password && touched.Password ? (
                                                                <em className="pError">{errors.Password}</em>
                                                            ) : null}
                                                        </div>
                                                    </div>

                                                    <div className="linebylineInput valid-input">
                                                        <div className={this.state.CompanyValidation && touched.CompanyValidation ? ("has-error") :
                                                            !this.state.CompanyValidation && touched.CompanyValidation ? "" : ""} >
                                                            <DropdownMelcous title='CompanyName' data={this.state.CompanyData}
                                                                handleChange={this.CompanyNamehandleChange} placeholder='selectCompany' name="CompanyName" />
                                                            {this.state.CompanyValidation && touched.CompanyValidation ? (
                                                                <em className="pError">{Resources['isRequiredField'][currentLanguage]}</em>) : null}
                                                        </div>
                                                    </div>

                                                    <div className="linebylineInput valid-input">
                                                        <div className={this.state.ContactValidation && touched.ContactValidation ? ("has-error") :
                                                            !this.state.ContactValidation && touched.ContactValidation ? "" : ""} >
                                                            <DropdownMelcous title='ContactName' data={this.state.ContactData}
                                                                handleChange={this.ContactNamehandleChange} placeholder='ContactName' name="ContactName" />
                                                            {this.state.ContactValidation && touched.ContactValidation ? (
                                                                <em className="pError">{Resources['isRequiredField'][currentLanguage]}</em>) : null}
                                                        </div>
                                                    </div>

                                                    <div className="linebylineInput valid-input">
                                                        <label className="control-label">{Resources['workHours'][currentLanguage]} </label>
                                                        <div className={errors.WorkHours && touched.WorkHours ?
                                                            ("ui input inputDev has-error") : "ui input inputDev"} >
                                                            <input name='WorkHours'
                                                                className="form-control" id="WorkHours" placeholder={Resources['workHours'][currentLanguage]} autoComplete='off'
                                                                onBlur={(e) => {
                                                                    this.workHoursChangeHandler(e)
                                                                    handleBlur(e)
                                                                }} onChange={handleChange} />
                                                            {errors.WorkHours && touched.WorkHours ? (
                                                                <em className="pError">{errors.WorkHours}</em>
                                                            ) : null}
                                                        </div>
                                                    </div>

                                                    <div className="linebylineInput valid-input">
                                                        <label className="control-label">{Resources['hoursRate'][currentLanguage]} </label>
                                                        <div className={errors.RateHours && touched.RateHours ?
                                                            ("ui input inputDev has-error") : "ui input inputDev"} >
                                                            <input name='RateHours'
                                                                className="form-control" id="RateHours" placeholder={Resources['hoursRate'][currentLanguage]} autoComplete='off'
                                                                onBlur={(e) => {
                                                                    this.hoursRateChangeHandler(e)
                                                                    handleBlur(e)
                                                                }} onChange={handleChange} />
                                                            {errors.RateHours && touched.RateHours ? (
                                                                <em className="pError">{errors.RateHours}</em>
                                                            ) : null}
                                                        </div>
                                                    </div>

                                                    <div className="linebylineInput valid-input">
                                                        <div className={this.state.SupervisorCompanyValidation && touched.SupervisorCompanyValidation ? ("has-error") :
                                                            !this.state.SupervisorCompanyValidation && touched.SupervisorCompanyValidation ? "" : ""} >
                                                            <DropdownMelcous title='SupervisorCompany' data={this.state.CompanyData}
                                                                handleChange={this.SupervisorCompanyhandleChange} placeholder='SupervisorCompany' name="SupervisorCompany" />
                                                            {this.state.SupervisorCompanyValidation && touched.SupervisorCompanyValidation ? (
                                                                <em className="pError">{Resources['isRequiredField'][currentLanguage]}</em>) : null}
                                                        </div>
                                                    </div>

                                                    <div className="linebylineInput valid-input">
                                                        <div className={this.state.SupervisorNameValidation && touched.SupervisorNameValidation ? ("has-error") :
                                                            !this.state.SupervisorNameValidation && touched.SupervisorNameValidation ? "" : ""} >
                                                            <DropdownMelcous title='SupervisorName' data={this.state.SupervisorNameData}
                                                                handleChange={this.SupervisorNamehandleChange} placeholder='SupervisorName' name="SupervisorName" />
                                                            {this.state.SupervisorNameValidation && touched.SupervisorNameValidation ? (
                                                                <em className="pError">{Resources['isRequiredField'][currentLanguage]}</em>) : null}
                                                        </div>
                                                    </div>

                                                    <div className="linebylineInput valid-input">
                                                        <DropdownMelcous title='GroupName'
                                                            data={this.state.GroupNameData}
                                                            handleChange={this.GroupNamehandleChange}
                                                            placeholder='GroupName' />
                                                    </div>

                                                    <div className="linebylineInput valid-input">
                                                        {this.state.ErrorSameEmpCode ?
                                                            <InPut title='employeeCode' placeholderText='employeeCode' value='' onBlurEvent={this.employeeCodeChangeHandler} />
                                                            :
                                                            <Fragment>
                                                                <label className="control-label">{Resources['employeeCode'][currentLanguage]} </label>
                                                                <div className={errors.EmpCode && touched.EmpCode ?
                                                                    ("ui input inputDev has-error") : "ui input inputDev"} >
                                                                    <input name='EmpCode'
                                                                        className="form-control" id="EmpCode" placeholder={Resources['employeeCode'][currentLanguage]} autoComplete='off'
                                                                        onBlur={(e) => {
                                                                            this.employeeCodeChangeHandler(e)
                                                                            handleBlur(e)
                                                                        }} onChange={handleChange} />
                                                                    {errors.EmpCode && touched.EmpCode ? (
                                                                        <em className="pError">{errors.EmpCode}</em>
                                                                    ) : null}
                                                                </div>
                                                            </Fragment>
                                                        }
                                                    </div>

                                                    <form className="proForm">
                                                        <div className="linebylineInput">
                                                            <label className="control-label"> {Resources['designTeam'][currentLanguage]} </label>
                                                            <div className="ui checkbox radio radioBoxBlue">
                                                                <input type="radio" name="designTeam" value="true" onChange={this.DesignTeamChange} />
                                                                <label>{Resources['yes'][currentLanguage]}</label>
                                                            </div>
                                                            <div className="ui checkbox radio radioBoxBlue checked">
                                                                <input type="radio" defaultChecked name="designTeam" value="false" onChange={this.DesignTeamChange} />
                                                                <label> {Resources['no'][currentLanguage]}</label>
                                                            </div>

                                                        </div>
                                                    </form>

                                                    <form className="proForm">
                                                        <div className="linebylineInput">
                                                            <label className="control-label"> {Resources['isTaskAdmin'][currentLanguage]} </label>
                                                            <div className="ui checkbox radio radioBoxBlue">
                                                                <input type="radio" name="TaskAdmin" value="true" onChange={this.TaskAdminChange} />
                                                                <label>{Resources['yes'][currentLanguage]}</label>
                                                            </div>
                                                            <div className="ui checkbox radio radioBoxBlue checked">
                                                                <input type="radio" defaultChecked name="TaskAdmin" value="false" onChange={this.TaskAdminChange} />
                                                                <label> {Resources['no'][currentLanguage]}</label>
                                                            </div>

                                                        </div>
                                                    </form>

                                                    <form className="proForm">
                                                        <div className="linebylineInput">
                                                            <label className="control-label"> {Resources['active'][currentLanguage]} </label>
                                                            <div className="ui checkbox radio radioBoxBlue">
                                                                <input type="radio" defaultChecked name="active" value="true" onChange={this.ActiveChange} />
                                                                <label>{Resources['yes'][currentLanguage]}</label>
                                                            </div>
                                                            <div className="ui checkbox radio radioBoxBlue checked">
                                                                <input type="radio" name="active" value="false" onChange={this.ActiveChange} />
                                                                <label> {Resources['no'][currentLanguage]}</label>
                                                            </div>

                                                        </div>
                                                    </form>

                                                    <form className="proForm">
                                                        <div className="linebylineInput">
                                                            <label className="control-label"> {Resources['usePermissionsOnLogs'][currentLanguage]} </label>
                                                            <div className="ui checkbox radio radioBoxBlue">
                                                                <input type="radio" name="usePermissionsOnLogs" value="true" onChange={this.UserPermissiononLogsChange} />
                                                                <label>{Resources['yes'][currentLanguage]}</label>
                                                            </div>
                                                            <div className="ui checkbox radio radioBoxBlue ">
                                                                <input type="radio" defaultChecked name="usePermissionsOnLogs" value="false" onChange={this.UserPermissiononLogsChange} />
                                                                <label> {Resources['no'][currentLanguage]}</label>
                                                            </div>

                                                        </div>
                                                    </form>
                                                  
                                                  <div className="linebylineInput daysCheckbox">
                                                        <label> HR Vacation Days</label>
                                                        <div className="ui checkbox checkBoxGray300 checked">
                                                            <input type="checkbox" value='1' onChange={this.DayVacationhandleCheck} defaultChecked={this.state.checked} />
                                                            <label>Saturday</label>
                                                        </div>
                                                        <div className="ui checkbox checkBoxGray300 checked">
                                                            <input type="checkbox" value='2' onChange={this.DayVacationhandleCheck} defaultChecked={this.state.checked} />
                                                            <label>Sunday</label>
                                                        </div>
                                                        <div className="ui checkbox checkBoxGray300 checked">
                                                            <input type="checkbox" value='3' onChange={this.DayVacationhandleCheck} defaultChecked={this.state.checked} />
                                                            <label>Monday</label>
                                                        </div>
                                                        <div className="ui checkbox checkBoxGray300 checked">
                                                            <input type="checkbox" value='4' onChange={this.DayVacationhandleCheck} defaultChecked={this.state.checked} />
                                                            <label>Tuesday</label>
                                                        </div>
                                                        <div className="ui checkbox checkBoxGray300 checked">
                                                            <input type="checkbox" value='5' onChange={this.DayVacationhandleCheck} defaultChecked={this.state.checked} />
                                                            <label>Wednesday</label>
                                                        </div>
                                                        <div className="ui checkbox checkBoxGray300 checked">
                                                            <input type="checkbox" value='6' onChange={this.DayVacationhandleCheck} defaultChecked={this.state.checked} />
                                                            <label>Thursday</label>
                                                        </div>
                                                        <div className="ui checkbox checkBoxGray300 checked">
                                                            <input type="checkbox" value='7' onChange={this.DayVacationhandleCheck} defaultChecked={this.state.checked} />
                                                            <label>Friday</label>
                                                        </div>
                                                    </div>
                                                 
                                                 <div className="dropBtn">
                                                        <button className="primaryBtn-1 btn" type='submit'  >
                                                            {Resources['save'][currentLanguage]}</button>
                                                    </div>
                                                </Form>
                                            )}
                                        </Formik>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }

    GetData = (url, label, value, currState) => {
        let Data = []
        Api.get(url).then(result => {
            (result).forEach(item => {
                var obj = {};
                obj.label = item[label];
                obj.value = item[value];

                Data.push(obj);

            });

            this.setState({
                [currState]: [...Data]
            });
        }).catch(ex => {
        });

    }
}
export default withRouter(AddAccount)