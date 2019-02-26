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
            SaveMSG: false

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
        this.setState({ CompanyId: e.value })
        this.GetData('GetContactsNotUsersByCompanyId?companyId=' + e.value + '', 'contactName', 'id', 'ContactData')
    }

    SupervisorCompanyhandleChange = (e) => {
        this.setState({ SupervisorCompanyId: e.value })
        this.GetData('GetContactsByCompanyIdForOnlyUsers?companyId=' + e.value + '', 'contactName', 'id', 'SupervisorNameData')
    }

    SupervisorNamehandleChange = (e) => {
        this.setState({ SupervisorId: e.value })
    }

    ContactNamehandleChange = (e) => {
        this.setState({ ContactId: e.value })
    }

    GroupNameData = (e) => {
        this.setState({ GroupNameId: e.value })
    }

    UserNameChangeHandler = (e) => {
        this.setState({ LoadingVaildation: true })
        let username = e.target.value.toLowerCase();
        username.replace(/&/g, '%26%')
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

    employeeCodeChangeHandler = (e) => {
        this.setState({ LoadingVaildation: true })
        let empcode = e.target.value;
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

    render() {
        return (

            <div className="mainContainer">

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

                {this.state.ErrorSameUserName ?
                    <InPut title='UserName' placeholderText='UserName' value='' onBlurEvent={this.UserNameChangeHandler} />
                    : <InPut title='UserName' placeholderText='UserName' onBlurEvent={this.UserNameChangeHandler} />}


                <InPut title='password'
                    placeholderText='password'
                    inputChangeHandler={this.passwordChangeHandler} />

                <DropdownMelcous title='CompanyName'
                    data={this.state.CompanyData}
                    handleChange={this.CompanyNamehandleChange}
                    placeholder='selectCompany' />

                <DropdownMelcous title='ContactName'
                    data={this.state.ContactData}
                    handleChange={this.ContactNamehandleChange}
                    placeholder='ContactName' />

                <InPut title='workHours'
                    placeholderText='workHours'
                    inputChangeHandler={this.workHoursChangeHandler} />

                <InPut title='hoursRate'
                    placeholderText='hoursRate'
                    inputChangeHandler={this.hoursRateChangeHandler} />


                <DropdownMelcous title='SupervisorCompany'
                    data={this.state.CompanyData}
                    handleChange={this.SupervisorCompanyhandleChange}
                    placeholder='SupervisorCompany' />

                <DropdownMelcous title='SupervisorName'
                    data={this.state.SupervisorNameData}
                    handleChange={this.SupervisorNamehandleChange}
                    placeholder='SupervisorName' />

                <DropdownMelcous title='GroupName'
                    data={this.state.GroupNameData}
                    handleChange={this.GroupNamehandleChange}
                    placeholder='GroupName' />

                {this.state.ErrorSameEmpCode ?
                    <InPut title='employeeCode' placeholderText='employeeCode' value='' onBlurEvent={this.employeeCodeChangeHandler} />
                    : <InPut title='employeeCode' placeholderText='employeeCode' onBlurEvent={this.employeeCodeChangeHandler} />}


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

                <label> HR Vacation Days</label>

                <br />   <br />

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

                <div className="dropBtn">
                    <button className="primaryBtn-1 btn" onClick={this.AddAccount}>
                        {Resources['save'][currentLanguage]}</button>
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