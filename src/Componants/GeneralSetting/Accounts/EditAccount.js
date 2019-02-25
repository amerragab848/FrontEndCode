import React, { Component, Fragment } from 'react';
import DropdownMelcous from '../../OptionsPanels/DropdownMelcous';
import DatePicker from '../../OptionsPanels/DatePicker';
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
import LoadingSection from '../../publicComponants/LoadingSection';
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
const publicConfiguarion = config.getPayload();
const getPublicConfiguartion = config.getPublicConfiguartion();
let id = null;
let DefaultUserName = '';
let DefaultEmpCode = '';
let DefaultSupervisorid = '';
class EditAccount extends Component {
    constructor(props) {
        super(props)
        this.state = {
            UserName: '',
            Password: '',
            CompanyId: '',
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
            checked: false,
            AccountId: '',
            ErrorSameUserName: false,
            ErrorSameEmpCode: false,
            statusClass: "disNone",
            LoadingVaildation: false,
            AccountData: [],
            ActiveCheck: '',
            UsePermissionsOnLogCheck: '',
            TaskAdminCheck: '',
            DesignTeamCheck: '',
            DefaultSupervisorCompanyData: {},
            DefaultGroupName:{},
            render: false,
            DefaultSupervisorName: {},
            AlternativAccountId:'',
            AlternativeDate: moment(),
        }
    }

    componentWillMount = () => {
        const query = new URLSearchParams(this.props.location.search);
        for (let param of query.entries()) {
            id = param[1];
        }
        Api.get('GetAccountById?id=' + id + '').then(
            res => {
                DefaultUserName = res.userName
                DefaultEmpCode = res.empCode
                DefaultSupervisorid = res.companySupervisorId  
                this.setState({
                    AccountData: res,
                    UserName: res.userName,
                    EmpCode: res.empCode,
                    WorkingHours: res.defaultHours,
                    HoursRate: res.userRate,
                    ActiveCheck: res.active,
                    UsePermissionsOnLogCheck: res.usePermissionsOnLogs,
                    TaskAdminCheck: res.isTaskAdmin,
                    DesignTeamCheck: res.designTeam,
                    DefaultSupervisorCompanyData: { 'label': res.supervisorCompanyName, 'value': res.companySupervisorId },
                     GroupNameId:res.groupId,
                    DefaultSupervisorName: { 'label': res.supervisorName, 'value': res.contactSupervisorId },
                    SupervisorCompanyId: res.companySupervisorId,
              
                })
            }
        )
      
    }

    componentDidMount = () => {

        this.GetData('SelectAllAccountsActive?id=' + id + '', 'userName', 'id', 'AlternativeAccount')
        this.GetData('GetGroup?accountOwnerId=' + publicConfiguarion.aoi + '', 'groupName', 'id', 'GroupNameData');

        let Data = []
        Api.get('GetCompanies?accountOwnerId=' + publicConfiguarion.aoi + '').then(result => {
            (result).forEach(item => {
                var obj = {};
                obj.label = item['companyName'];
                obj.value = item['id'];
                Data.push(obj);
            });
            this.GetData('GetContactsByCompanyIdForOnlyUsers?companyId=' + DefaultSupervisorid + '', 'contactName', 'id', 'SupervisorNameData')
            let userName = _.find([...Data], { 'id': 20 })
            console.log(userName)
            this.setState({
                CompanyData: [...Data],
                render: true
            });
        }).catch(ex => {
        });
    }

    workHoursChangeHandler = (e) => {
        let workHour = e.target.value;
        this.setState({ WorkingHours: workHour })
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

    AlternativeAccounthandleChange = (e) => {
        this.setState({ AlternativAccountId: e.value })

    }

    SupervisorCompanyhandleChange = (e) => {
        this.setState({ SupervisorCompanyId: e.value ,SupervisorNameData:[] })
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
        let username = e.target.value.toLowerCase();
        username.replace(/&/g, '%26%')
        if (DefaultUserName !== username) {
            this.setState({ LoadingVaildation: true })
            Api.get('CheckUserNameAccount?userName=' + username + '').then(
                res => {
                    if (res === true) {
                        this.setState({
                            LoadingVaildation: false,
                            statusClass: "animationBlock",
                            ErrorSameUserName: true,
                            UserName: ''
                        })
                    }
                    else {
                        this.setState({ LoadingVaildation: false, UserName: username })
                    }
                    setTimeout(() => {
                        this.setState({ ErrorSameUserName: false, statusClass: "disNone" })
                    }, 500);
                }
            )
        }
    }

    employeeCodeChangeHandler = (e) => {
        let empcode = parseInt(e.target.value)
        if (DefaultEmpCode !== empcode) {
            Api.get('CheckRefCodeEmployee?code=' + empcode + '').then(
                res => {
                    if (res === true) {
                        this.setState({
                            LoadingVaildation: false,
                            statusClass: "animationBlock",
                            ErrorSameEmpCode: true,
                            EmpCode: ''
                        })
                    }
                    else {
                        this.setState({ LoadingVaildation: false, EmpCode: empcode })
                    }
                    setTimeout(() => {
                        this.setState({ ErrorSameEmpCode: false, statusClass: "disNone" })
                    }, 500);
                }
            )
        }

    }

    EditAccount = () => {

            Api.post('EditAccount',
                {

                    'id':id,
                    'userName': this.state.UserName,
                    'oldUserName':this.state.AccountData.userName,
                    'email':this.state.AccountData.email,
                    'userPassword': this.state.AccountData.userPassword,
                    'accountOwnerId':this.state.AccountData.accountOwnerId,
                    'accountCompanyId': getPublicConfiguartion.accountCompanyId,
                    'companyId': this.state.AccountData.CompanyId,
                    'contactId': this.state.AccountData.contactId,
                    'contactSupervisorId': this.state.SupervisorId,
                    'companySupervisorId': this.state.SupervisorCompanyId,
                    'supervisorAccountId':this.state.SupervisorId,
                    'defaultHours': this.state.WorkingHours,
                    'userRate': this.state.HoursRate,
                    'groupId': this.state.GroupNameId,
                    'empCode': this.state.EmpCode,
                    'designTeam': this.state.DesignTeam,
                    'isTaskAdmin': this.state.TaskAdmin,
                    'active': this.state.Active,
                    'passwordEdit': false,
                    'isHrManager': false,
                    'usePermissionsOnLogs': this.state.UserPermissiononLogsCreatedbyOthers,
                    'alternativAccountId': this.state.alternativAccountId ,
                    'alternativDate':this.state.alternativAccountId !== null ? moment().format():'',
                    'isAlternativeWorkFlow':this.state.checked
                }).then(
                    res => {   
                        this.setState({                  
                        })
                    }
                )
        
        this.props.history.push({
            pathname: '/Accounts',
        })
    }

    changeUserName = (e) => {
        this.setState({ UserName: e.target.value })
    }

    changeEmpCode = (e) => {
        this.setState({ EmpCode: e.target.value })
    }

    AlternativeDatehandleChange = (date) => {
        this.setState({AlternativeDate:date  });
    }

    ReplacmenthandleCheck = (e) => {
        this.setState({ checked: !this.state.checked });
    }


    render() {
    
        return (
            <div className="mainContainer">

                {this.state.ErrorSameUserName ?
                    <NotifiMsg statusClass={this.state.statusClass} IsSuccess="false" Msg={Resources['userNameAlreadyExisted'][currentLanguage]} />
                    : null}

                {this.state.SaveMSG ?
                    <NotifiMsg statusClass={this.state.statusClass} IsSuccess="false" Msg={Resources['userNameAlreadyExisted'][currentLanguage]} />
                    : null}

                {this.state.ErrorSameEmpCode ?
                    <NotifiMsg statusClass={this.state.statusClass} IsSuccess="false" Msg={Resources['smartDeleteMessage'][currentLanguage].refCodeExist} />
                    : null}

                {this.state.LoadingVaildation ? <LoadingSection /> : null}

                {this.state.ErrorSameUserName ?
                    <InPut title='UserName' placeholderText='UserName' onBlurEvent={this.UserNameChangeHandler} />
                    : <InPut title='UserName' placeholderText='UserName' value={this.state.UserName} inputChangeHandler={this.changeUserName}
                        onBlurEvent={this.UserNameChangeHandler} />}

                <InPut title='workHours'
                    placeholderText='workHours' value={this.state.WorkingHours}
                    inputChangeHandler={this.workHoursChangeHandler} />
{this.state.render?
<Fragment>
<DropdownMelcous title='SupervisorCompany'
                            selectedValue={this.state.DefaultSupervisorCompanyData}
                            data={this.state.CompanyData}
                            handleChange={this.SupervisorCompanyhandleChange}
                            placeholder='SupervisorCompany' />

<DropdownMelcous title='SupervisorName'
                            data={this.state.SupervisorNameData}
                            handleChange={this.SupervisorNamehandleChange}
                            placeholder='SupervisorName'
                            selectedValue={this.state.DefaultSupervisorName}/>

                {this.state.ErrorSameEmpCode ?
                    <InPut title='employeeCode' placeholderText='employeeCode' onBlurEvent={this.employeeCodeChangeHandler} />
                    : <InPut title='employeeCode' placeholderText='employeeCode' value={this.state.EmpCode} inputChangeHandler={this.changeEmpCode}
                        onBlurEvent={this.employeeCodeChangeHandler} />}

             
                  <DropdownMelcous title='GroupName'
                            data={this.state.GroupNameData}
                            handleChange={this.GroupNameData.bind(this)}
                            placeholder='GroupName'
                            //selectedValue={this.state.GroupNameId}
                             />
  </Fragment>   :null               }           
             
                <DropdownMelcous title='alternativeAccount'
                    data={this.state.AlternativeAccount}
                    handleChange={this.AlternativeAccounthandleChange}
                    placeholder='alternativeAccount' />

               {this.state.AlternativAccountId === '' ?null
                 :   <Fragment>
                 <DatePicker title='alternativeDate'
                       startDate={this.state.AlternativeDate}
                       handleChange={this.AlternativeDatehandleChange} />
   
                    <div className="ui checkbox checkBoxGray300 checked">
                       <input type="checkbox" value='1' onChange={this.ReplacmenthandleCheck} defaultChecked={this.state.checked} />
                       <label> {Resources['replacment'][currentLanguage]}</label>
                   </div>
                   </Fragment> }

                <InPut title='hoursRate'
                    placeholderText='hoursRate' value={this.state.HoursRate}
                    inputChangeHandler={this.hoursRateChangeHandler} />

  

                <form className="proForm">
                    <div className="linebylineInput">
                        <label className="control-label"> {Resources['designTeam'][currentLanguage]} </label>
                        <div className="ui checkbox radio radioBoxBlue">
                            <input type="radio" name="designTeam" defaultChecked={this.state.DesignTeamCheck ? 'checked' : null} value="true" onChange={this.DesignTeamChange} />
                            <label>{Resources['yes'][currentLanguage]}</label>
                        </div>
                        <div className="ui checkbox radio radioBoxBlue checked">
                            <input type="radio" defaultChecked={this.state.DesignTeamCheck ? null : 'checked'} name="designTeam" value="false" onChange={this.DesignTeamChange} />
                            <label> {Resources['no'][currentLanguage]}</label>
                        </div>

                    </div>
                </form>

                <form className="proForm">
                    <div className="linebylineInput">
                        <label className="control-label"> {Resources['isTaskAdmin'][currentLanguage]} </label>
                        <div className="ui checkbox radio radioBoxBlue">
                            <input type="radio" name="TaskAdmin" defaultChecked={this.state.TaskAdminCheck ? 'checked' : null} value="true" onChange={this.TaskAdminChange} />
                            <label>{Resources['yes'][currentLanguage]}</label>
                        </div>
                        <div className="ui checkbox radio radioBoxBlue checked">
                            <input type="radio" defaultChecked name="TaskAdmin" defaultChecked={this.state.TaskAdminCheck ? null : 'checked'} value="false" onChange={this.TaskAdminChange} />
                            <label> {Resources['no'][currentLanguage]}</label>
                        </div>

                    </div>
                </form>

                <form className="proForm">
                    <div className="linebylineInput">
                        <label className="control-label"> {Resources['active'][currentLanguage]} </label>
                        <div className="ui checkbox radio radioBoxBlue">
                            <input type="radio" defaultChecked name="active" defaultChecked={this.state.ActiveCheck ? 'checked' : null} value="true" onChange={this.ActiveChange} />
                            <label>{Resources['yes'][currentLanguage]}</label>
                        </div>
                        <div className="ui checkbox radio radioBoxBlue checked">
                            <input type="radio" name="active" value="false" defaultChecked={this.state.ActiveCheck ? null : 'checked'} onChange={this.ActiveChange} />
                            <label> {Resources['no'][currentLanguage]}</label>
                        </div>

                    </div>
                </form>

                <form className="proForm">
                    <div className="linebylineInput">
                        <label className="control-label"> {Resources['usePermissionsOnLogs'][currentLanguage]} </label>
                        <div className="ui checkbox radio radioBoxBlue">
                            <input type="radio" name="usePermissionsOnLogs" defaultChecked={this.state.UsePermissionsOnLogCheck ? 'checked' : null} value="true" onChange={this.UserPermissiononLogsChange} />
                            <label>{Resources['yes'][currentLanguage]}</label>
                        </div>
                        <div className="ui checkbox radio radioBoxBlue ">
                            <input type="radio" defaultChecked name="usePermissionsOnLogs" defaultChecked={this.state.UsePermissionsOnLogCheck ? null : 'checked'} value="false" onChange={this.UserPermissiononLogsChange} />
                            <label> {Resources['no'][currentLanguage]}</label>
                        </div>

                    </div>
                </form>
                <div className="dropBtn">
                    <button className="primaryBtn-1 btn" onClick={this.EditAccount}>
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
            this.setState({ [currState]: [...Data] });
        }).catch(ex => {
        });

    }
}
export default withRouter(EditAccount)