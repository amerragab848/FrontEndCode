import React, { Component, Fragment } from 'react';
import DropdownMelcous from '../../OptionsPanels/DropdownMelcous';
import Api from '../../../api';
import NotifiMsg from '../../publicComponants/NotifiMsg'
import Resources from '../../../resources.json';
import config from "../../../Services/Config";
import _ from "lodash";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux'
import * as AdminstrationActions from '../../../store/actions/Adminstration'
import { bindActionCreators } from 'redux';
import { withRouter } from "react-router-dom";
import LoadingSection from '../../publicComponants/LoadingSection';
import Eyepw from '../../../Styles/images/eyepw.svg';
import { toast } from "react-toastify";

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
        .typeError(Resources['onlyNumbers'][currentLanguage]),
    UserName: Yup.string()
        .required(Resources['userNameRequired'][currentLanguage]),
    Password: Yup.string()
        .required(Resources['passwordRequired'][currentLanguage])
        .min(5, Resources['numbersGreaterThanOrEqualHalf'][currentLanguage]),
    EmpCode: Yup.number()
        .required(Resources['employeeCodeRequired'][currentLanguage]),
    ContactName: Yup.string()
        .required(Resources['toContactRequired'][currentLanguage])
        .nullable(false),
    SupervisorName: Yup.string()
        .required(Resources['supervisorNameRequired'][currentLanguage])
        .nullable(false),
});


class AddAccount extends Component {

    constructor(props) {
        super(props)

        this.state = {
            UserName: '',
            Password: '',
            CompanyData: [],
            CompanyId: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
            ContactData: [],
            ContactId: { label: Resources.fromContactRequired[currentLanguage], value: "0" },
            WorkingHours: '',
            HoursRate: '',
            SupervisorCompanyData: [],
            SupervisorCompanyId: { label: Resources.supervisorCompanyRequired[currentLanguage], value: "0" },
            SupervisorNameData: [],
            SupervisorId: { label: Resources.supervisorNameRequired[currentLanguage], value: "0" },
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
        if (config.IsAllow(801)) {
            this.GetData('GetCompanies?accountOwnerId=' + publicConfiguarion.aoi + '', 'companyName', 'id', 'CompanyData');
            this.GetData('GetGroup?accountOwnerId=' + publicConfiguarion.aoi + '', 'groupName', 'id', 'GroupNameData');
            this.DesignTeamChange = this.DesignTeamChange.bind(this);
        }
        else {
            this.props.history.goBack()
        }
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
        this.setState({ CompanyId: e })
        this.GetData('GetContactsNotUsersByCompanyId?companyId=' + e.value + '', 'contactName', 'id', 'ContactData')
    }

    SupervisorCompanyhandleChange = (e) => {
        this.setState({ SupervisorCompanyId: e })
        this.GetData('GetContactsByCompanyIdForOnlyUsers?companyId=' + e.value + '', 'contactName', 'id', 'SupervisorNameData')
    }

    SupervisorNamehandleChange = (e) => {
        this.setState({ SupervisorId: e })
    }

    ContactNamehandleChange = (e) => {
        this.setState({ ContactId: e })
    }

    GroupNameData = (e) => {
        this.setState({ GroupNameId: e })
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
                            UserName: '',
                            ErrorSameInputs: true,
                        })
                    }
                    else {
                        this.setState({ LoadingVaildation: false, UserName: username, ErrorSameInputs: false })
                    }
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
                            ErrorSameEmpCode: true,
                            ErrorSameInputs: true,
                            EmpCode: ''
                        })
                    }
                    else {
                        this.setState({ LoadingVaildation: false, EmpCode: empcode, ErrorSameInputs: false })
                    }
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

    AddAccount = () => {
        Api.authorizationApi('ProcoorAuthorization?username=' + this.state.UserName + '&password=' + this.state.Password + '&companyId=' + this.state.CompanyId.value + '', null, 'POST').then(res => {
            if (res !== "Email already exists.") {
                Api.post('AddAccount',
                    {
                        'userName': this.state.UserName,
                        'userPassword': this.state.Password,
                        'accountCompanyId': getPublicConfiguartion.accountCompanyId,
                        'companyId': this.state.CompanyId.value,
                        'contactId': this.state.ContactId.value,
                        'contactSupervisorId': this.state.SupervisorId.value,
                        'companySupervisorId': this.state.SupervisorCompanyId.value,
                        'defaultHours': this.state.WorkingHours,
                        'userRate': this.state.HoursRate,
                        'groupId': this.state.GroupNameId.value,
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
                            })
                        },
                        ListOfDays.forEach(function (item) {
                            var dayId = '';
                            dayId = item
                            // Api.post('UpdateVacations?accountId='+this.state.AccountId+'&dayId='+dayId+'').catch(ex => { })
                        }),
                        this.props.actions.routeToTabIndex(0),
                        this.props.history.push({
                            pathname: '/TemplatesSettings',
                        })
                    )
            }
            else
                toast.warn(res)
        }


        ).catch(ex => {
            this.props.history.push({
                pathname: '/TemplatesSettings',
            })
        })

    }

    render() {

        return (
            <div className="mainContainer main__fulldash">
                <div className="documents-stepper cutome__inputs noTabs__document">
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
                        <div className="step-content noBtn__footer">
                            <div className="subiTabsContent">
                                <div className="document-fields">

                                    <NotifiMsg showNotify={this.state.ErrorSameInputs} IsSuccess={false} Msg={this.state.ErrorSameEmpCode ? Resources['smartDeleteMessage'][currentLanguage].refCodeExist : Resources['userNameAlreadyExisted'][currentLanguage]} />

                                    {this.state.LoadingVaildation ? <LoadingSection /> : null}

                                    <Formik

                                        initialValues={{
                                            UserName: '',
                                            Password: '',
                                            WorkHours: '',
                                            EmpCode: '',
                                            RateHours: '',
                                            SupervisorName: '',
                                            ContactName: '',
                                        }}

                                        validationSchema={validationSchema}

                                        onSubmit={() => {
                                            this.AddAccount()

                                        }} >

                                        {({ errors, touched, handleBlur, values, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                                            <Form id="signupForm1" className="proForm datepickerContainer" noValidate="novalidate" onSubmit={handleSubmit}>
                                                <div className="proForm first-proform fullProformWrapper">
                                                    <div className="linebylineInput valid-input">
                                                        <Fragment>
                                                            <label className="control-label">{Resources['UserName'][currentLanguage]} </label>
                                                            <div className={'ui input inputDev ' + (errors.UserName && touched.UserName ? 'has-error' : null) + ' '}>
                                                                <input name='UserName' value={this.state.UserName}
                                                                    className="form-control" id="UserName" placeholder={Resources['UserName'][currentLanguage]} autoComplete='off'
                                                                    onBlur={(e) => {
                                                                        this.UserNameChangeHandler(e)
                                                                        handleBlur(e)
                                                                    }} onChange={(e) => {
                                                                        handleChange(e)
                                                                        this.setState({ UserName: e.target.value, ErrorSameInputs: false, ErrorSameEmpCode: false })
                                                                    }} />
                                                                {errors.UserName && touched.UserName ? (<em className="pError">{errors.UserName}</em>) : null}
                                                            </div>
                                                        </Fragment>
                                                    </div>
                                                    <div className="linebylineInput">
                                                        <label data-toggle="tooltip" title={Resources['active'][currentLanguage]} className="control-label"> {Resources['active'][currentLanguage]} </label>
                                                        <div className="ui checkbox radio radioBoxBlue">
                                                            <input type="radio" defaultChecked name="active" value="true" onChange={this.ActiveChange} />
                                                            <label>{Resources['yes'][currentLanguage]}</label>
                                                        </div>
                                                        <div className="ui checkbox radio radioBoxBlue checked">
                                                            <input type="radio" name="active" value="false" onChange={this.ActiveChange} />
                                                            <label> {Resources['no'][currentLanguage]}</label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="linebylineInput valid-input passWrapperInput">
                                                    <label className="control-label">{Resources['password'][currentLanguage]} </label>
                                                    <div className={'ui input inputDev ' + (errors.Password && touched.Password ? 'has-error' : null) + ' '}>
                                                        <span className="inputsideNote togglePW">
                                                            <img src={Eyepw} alt="" />
                                                            <span className="show"> Show</span>
                                                            <span className="hide"> Hide</span>
                                                        </span>
                                                        <input name='Password' className="form-control" id="Password" placeholder={Resources['password'][currentLanguage]} autoComplete='off'
                                                            onBlur={(e) => {
                                                                this.passwordChangeHandler(e)
                                                                handleBlur(e)
                                                            }} onChange={handleChange} />
                                                        {/* {errors.Password && touched.Password ? (<em className="pError">{errors.Password}</em>) : null} */}
                                                        <em class="formInputP">Password must include:
                                                            <span class="charsNumber">8 characters </span>|
                                                            <span class="capsSpan">Capital letter</span>
                                                        </em>
                                                    </div>
                                                </div>

                                                <div className="linebylineInput valid-input">
                                                    <Fragment>
                                                        <label className="control-label">{Resources['employeeCode'][currentLanguage]} </label>
                                                        <div className={'ui input inputDev ' + (errors.EmpCode && touched.EmpCode ? 'has-error' : null) + ' '}>
                                                            <input name='EmpCode' value={this.state.EmpCode}
                                                                className="form-control" id="EmpCode" placeholder={Resources['employeeCode'][currentLanguage]} autoComplete='off'
                                                                onBlur={(e) => {
                                                                    this.employeeCodeChangeHandler(e)
                                                                    handleBlur(e)
                                                                }} onChange={(e) => {
                                                                    handleChange(e)
                                                                    this.setState({ EmpCode: e.target.value, ErrorSameInputs: false, ErrorSameEmpCode: false })
                                                                }} />
                                                            {errors.EmpCode && touched.EmpCode ? (<em className="pError">{errors.EmpCode}</em>) : null}
                                                        </div>
                                                    </Fragment>
                                                </div>



                                                <div className="linebylineInput valid-input mix_dropdown">
                                                    <label className="control-label">{Resources.fromCompany[currentLanguage]}</label>
                                                    <div className="supervisor__company">
                                                        <div className="super_name">
                                                            <DropdownMelcous data={this.state.ContactData} onChange={setFieldValue} name="ContactName"
                                                                onBlur={setFieldTouched} error={errors.ContactName} id="ContactName"
                                                                touched={touched.ContactName} index="IR-ContactName"
                                                                handleChange={this.ContactNamehandleChange}
                                                                selectedValue={this.state.ContactId}
                                                            />
                                                        </div>

                                                        <div className="super_company">
                                                            <DropdownMelcous data={this.state.CompanyData} name="CompanyName"
                                                                selectedValue={this.state.selectedFromCompany}
                                                                handleChange={this.CompanyNamehandleChange} selectedValue={this.state.CompanyId} />
                                                        </div>
                                                    </div>
                                                </div>


                                                <div className="linebylineInput valid-input mix_dropdown">
                                                    <label className="control-label">{Resources.SupervisorCompany[currentLanguage]}</label>
                                                    <div className="supervisor__company">
                                                        <div className="super_name">
                                                            <DropdownMelcous data={this.state.SupervisorNameData} onChange={setFieldValue} name="SupervisorName"
                                                                onBlur={setFieldTouched} error={errors.SupervisorName} id="SupervisorName"
                                                                touched={touched.SupervisorName} index="IR-SupervisorName"
                                                                handleChange={this.SupervisorNamehandleChange}
                                                                selectedValue={this.state.SupervisorId}
                                                            />
                                                        </div>

                                                        <div className="super_company">
                                                            <DropdownMelcous data={this.state.CompanyData} name="SupervisorCompany"
                                                                selectedValue={this.state.selectedFromCompany}
                                                                handleChange={this.SupervisorCompanyhandleChange} selectedValue={this.state.SupervisorCompanyId} />
                                                        </div>
                                                    </div>
                                                </div>


                                                <div className="linebylineInput valid-input">
                                                    <DropdownMelcous title='GroupName'
                                                        data={this.state.GroupNameData}
                                                        handleChange={this.GroupNameData}
                                                        placeholder='GroupName' />
                                                </div>


                                                <div className="fullWidthWrapper account__checkbox">

                                                    <div className="proForm fullLinearInput">
                                                        <div className="linebylineInput">
                                                            <label data-toggle="tooltip" title={Resources['designTeam'][currentLanguage]} className="control-label"> {Resources['designTeam'][currentLanguage]} </label>
                                                            <div className="ui checkbox radio radioBoxBlue">
                                                                <input type="radio" name="designTeam" value="true" onChange={this.DesignTeamChange} />
                                                                <label>{Resources['yes'][currentLanguage]}</label>
                                                            </div>
                                                            <div className="ui checkbox radio radioBoxBlue checked">
                                                                <input type="radio" defaultChecked name="designTeam" value="false" onChange={this.DesignTeamChange} />
                                                                <label> {Resources['no'][currentLanguage]}</label>
                                                            </div>

                                                        </div>
                                                    </div>

                                                    <div className="proForm fullLinearInput">
                                                        <div className="linebylineInput">
                                                            <label data-toggle="tooltip" title={Resources['isTaskAdmin'][currentLanguage]} className="control-label"> {Resources['isTaskAdmin'][currentLanguage]} </label>
                                                            <div className="ui checkbox radio radioBoxBlue">
                                                                <input type="radio" name="TaskAdmin" value="true" onChange={this.TaskAdminChange} />
                                                                <label>{Resources['yes'][currentLanguage]}</label>
                                                            </div>
                                                            <div className="ui checkbox radio radioBoxBlue checked">
                                                                <input type="radio" defaultChecked name="TaskAdmin" value="false" onChange={this.TaskAdminChange} />
                                                                <label> {Resources['no'][currentLanguage]}</label>
                                                            </div>

                                                        </div>
                                                    </div>

                                                    <div className="proForm fullLinearInput">
                                                        <div className="linebylineInput">
                                                            <label data-toggle="tooltip" title={Resources['usePermissionsOnLogs'][currentLanguage]} className="control-label"> {Resources['usePermissionsOnLogs'][currentLanguage]} </label>
                                                            <div className="ui checkbox radio radioBoxBlue">
                                                                <input type="radio" name="usePermissionsOnLogs" value="true" onChange={this.UserPermissiononLogsChange} />
                                                                <label>{Resources['yes'][currentLanguage]}</label>
                                                            </div>
                                                            <div className="ui checkbox radio radioBoxBlue ">
                                                                <input type="radio" defaultChecked name="usePermissionsOnLogs" value="false" onChange={this.UserPermissiononLogsChange} />
                                                                <label> {Resources['no'][currentLanguage]}</label>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="workingHours__cycle">
                                                    <header>
                                                        <h3 className="zero">Working hours & days</h3>
                                                    </header>
                                                    <div className="workingHours__cycle--inputs">


                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources['workHours'][currentLanguage]} </label>
                                                            <div className={'ui input inputDev ' + (errors.WorkHours && touched.WorkHours ? 'has-error' : null) + ' '}>
                                                                <input name='WorkHours' className="form-control" id="WorkHours" placeholder={Resources['workHours'][currentLanguage]}
                                                                    autoComplete='off' onBlur={(e) => {
                                                                        this.workHoursChangeHandler(e)
                                                                        handleBlur(e)
                                                                    }} onChange={handleChange} />
                                                                {errors.WorkHours && touched.WorkHours ? (<em className="pError">{errors.WorkHours}</em>) : null}
                                                            </div>
                                                        </div>
                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources['hoursRate'][currentLanguage]} </label>
                                                            <div className={'ui input inputDev ' + (errors.RateHours && touched.RateHours ? 'has-error' : null) + ' '}>
                                                                <span className="inputsideNote">Optional</span>
                                                                <input name='RateHours' className="form-control" id="RateHours" placeholder={Resources['hoursRate'][currentLanguage]}
                                                                    autoComplete='off' onBlur={(e) => {
                                                                        this.hoursRateChangeHandler(e)
                                                                        handleBlur(e)
                                                                    }} onChange={handleChange} />
                                                                {errors.RateHours && touched.RateHours ? (<em className="pError">{errors.RateHours}</em>) : null}
                                                            </div>
                                                        </div>
                                                        <div className="linebylineInput fullWidthWrapper daysCheckbox">
                                                            <label> HR Vacation Days</label>
                                                            <div className="three__daysCheck--flex">
                                                                <div className="three__daysCheck">
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
                                                                </div>
                                                                <div className="three__daysCheck">
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
                                                                </div>
                                                                <div className="three__daysCheck">
                                                                    <div className="ui checkbox checkBoxGray300 checked">
                                                                        <input type="checkbox" value='7' onChange={this.DayVacationhandleCheck} defaultChecked={this.state.checked} />
                                                                        <label>Friday</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="dropBtn dropBtnLeft fullWidthWrapper">
                                                    <button className="primaryBtn-1 btn" type='submit'  >
                                                        {Resources['save'][currentLanguage]}</button>
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>

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

const mapStateToProps = (state) => {
    let sState = state;
    return sState;
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(AdminstrationActions, dispatch)
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddAccount));
