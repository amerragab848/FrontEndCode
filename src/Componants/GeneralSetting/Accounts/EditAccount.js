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
import dataservice from "../../../Dataservice";
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
            GroupNameId: {},
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
            DefaultGroupName: {},
            render: false,
            DefaultSupervisorName: {},
            AlternativeData: [],
            AlternativeAccountId: {},
            AlternativeDate: moment(),
            groupRender: false,
            Loading: true
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
                    SupervisorCompanyId: res.companySupervisorId,
                })
            }
        )
    }


    componentDidMount = () => {

        this.GetData('SelectAllAccountsActive?id=' + id + '', 'userName', 'id', 'AlternativeAccount')


        dataservice.GetDataList('GetGroup?accountOwnerId=' + publicConfiguarion.aoi + '', 'groupName', 'id').then(
            result => {
                let DefaultGroupId = this.state.AccountData.groupId
                let selectGroup = _.find(result, function (i) { return i.value == DefaultGroupId });
                console.log(selectGroup);
                this.setState({
                    GroupNameData: result,
                    GroupNameId: selectGroup,
                });
            }
        )

        dataservice.GetDataList('GetCompanies?accountOwnerId=' + publicConfiguarion.aoi + '', 'companyName', 'id').then(
            result => {
                let selectId = this.state.AccountData.companySupervisorId
                let selectGroup = _.find(result, function (i) { return i.value == selectId });

                this.setState({
                    CompanyData: result,
                    DefaultSupervisorCompanyData: selectGroup,
                });

                dataservice.GetDataList('GetContactsByCompanyIdForOnlyUsers?companyId=' + selectId + '', 'contactName', 'id').then(
                    result => {
                        let selectId = this.state.AccountData.contactSupervisorId
                        let selectGroup = _.find(result, function (i) { return i.value == selectId });
                        this.setState({
                            SupervisorNameData: result,
                            DefaultSupervisorName: selectGroup
                        })
                    }
                )

                dataservice.GetDataList('SelectAllAccountsActive?id=' + id + '', 'userName', 'id').then(
                    result => {
                        let selectId = this.state.AccountData.alternativAccountId
                        let selectGroup = _.find(result, function (i) { return i.value == selectId });
                        this.setState({
                            AlternativeData: result,
                            AlternativeAccountId: selectGroup,
                            Loading: false
                        })
                    }
                )
            }
        )
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
        this.setState({ AlternativeAccountId: e })

    }

    SupervisorCompanyhandleChange = (e) => {
        this.setState({ DefaultSupervisorCompanyData: e })
        this.GetData('GetContactsByCompanyIdForOnlyUsers?companyId=' + e.value + '', 'contactName', 'id', 'SupervisorNameData')
    }

    SupervisorNamehandleChange = (e) => {

        this.setState({ DefaultSupervisorName: e })
    }

    GroupNameData = (e) => {
        this.setState({ GroupNameId: e })
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
                    }, 1000);
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
                    }, 1000);
                }
            )
        }

    }

    EditAccount = () => {

        Api.post('EditAccount',
            {
                'id': id,
                'userName': this.state.UserName,
                'oldUserName': this.state.AccountData.userName,
                'email': this.state.AccountData.email,
                'userPassword': this.state.AccountData.userPassword,
                'accountOwnerId': this.state.AccountData.accountOwnerId,
                'accountCompanyId': getPublicConfiguartion.accountCompanyId,
                'companyId': this.state.AccountData.CompanyId,
                'contactId': this.state.AccountData.contactId,
                'contactSupervisorId': this.state.DefaultSupervisorName.value,
                'companySupervisorId': this.state.DefaultSupervisorCompanyData.value,
                'defaultHours': this.state.WorkingHours,
                'userRate': this.state.HoursRate,
                'groupId': this.state.GroupNameId.value,
                'empCode': this.state.EmpCode,
                'designTeam': this.state.DesignTeam,
                'isTaskAdmin': this.state.TaskAdmin,
                'active': this.state.Active,
                'passwordEdit': false,
                'isHrManager': false,
                'usePermissionsOnLogs': this.state.UserPermissiononLogsCreatedbyOthers,
                'alternativAccountId': this.state.AlternativeAccountId.value,
                'alternativDate': this.state.AlternativeDate !== null ? moment().format() : '',
                'isAlternativeWorkFlow': this.state.checked,
                'supervisorAccountId': this.state.DefaultSupervisorName.value,
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
        this.setState({ AlternativeDate: date });
    }

    ReplacmenthandleCheck = (e) => {
        this.setState({ checked: !this.state.checked });
    }


    render() {

        return (
            <div className="mainContainer">
                <div className="documents-stepper cutome__inputs">
                    <div className="submittalHead">
                        <h2 className="zero">Edit Account</h2>
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
                    {this.state.Loading ? <LoadingSection /> : null}
                    <div className="doc-container">
                        <div className="step-content">
                            <div className="subiTabsContent">
                                
                                <div className="document-fields">
                                    {
                                        this.state.ErrorSameUserName ?
                                            <NotifiMsg statusClass={this.state.statusClass} IsSuccess="false" Msg={Resources['userNameAlreadyExisted'][currentLanguage]} />
                                            : null
                                    }


                                    {
                                        this.state.ErrorSameEmpCode ?
                                            <NotifiMsg statusClass={this.state.statusClass} IsSuccess="false" Msg={Resources['smartDeleteMessage'][currentLanguage].refCodeExist} />
                                            : null
                                    }

                                    {this.state.LoadingVaildation ? <LoadingSection /> : null}
                                    <form className="proForm datepickerContainer">
                                        <div className="linebylineInput valid-input">
                                            {
                                                this.state.ErrorSameUserName ?
                                                    <InPut title='UserName' placeholderText='UserName' onBlurEvent={this.UserNameChangeHandler} />
                                                    : <InPut title='UserName' placeholderText='UserName' value={this.state.UserName} inputChangeHandler={this.changeUserName}
                                                        onBlurEvent={this.UserNameChangeHandler} />
                                            }
                                        </div>
                                        <div className="linebylineInput valid-input">

                                            <InPut title='workHours'
                                                placeholderText='workHours' value={this.state.WorkingHours}
                                                inputChangeHandler={this.workHoursChangeHandler} />
                                        </div>
                                        <div className="linebylineInput valid-input">

                                            <DropdownMelcous title='SupervisorCompany'
                                                selectedValue={this.state.DefaultSupervisorCompanyData}
                                                data={this.state.CompanyData}
                                                handleChange={this.SupervisorCompanyhandleChange}
                                                placeholder='SupervisorCompany' />
                                        </div>
                                        <div className="linebylineInput valid-input">

                                            <DropdownMelcous title='SupervisorName'
                                                data={this.state.SupervisorNameData}
                                                handleChange={this.SupervisorNamehandleChange}
                                                placeholder='SupervisorName'
                                                selectedValue={this.state.DefaultSupervisorName} />
                                        </div>
                                        <div className="linebylineInput valid-input">

                                            {
                                                this.state.ErrorSameEmpCode ?
                                                    <InPut title='employeeCode' placeholderText='employeeCode' onBlurEvent={this.employeeCodeChangeHandler} />
                                                    : <InPut title='employeeCode' placeholderText='employeeCode' value={this.state.EmpCode} inputChangeHandler={this.changeEmpCode}
                                                        onBlurEvent={this.employeeCodeChangeHandler} />
                                            }
                                        </div>
                                        <div className="linebylineInput valid-input">


                                            <DropdownMelcous title='GroupName'
                                                data={this.state.GroupNameData}
                                                handleChange={this.GroupNameData.bind(this)}
                                                placeholder='GroupName'
                                                selectedValue={this.state.GroupNameId} />
                                        </div>
                                        <div className="linebylineInput valid-input">
                                            <DropdownMelcous title='alternativeAccount'
                                                data={this.state.AlternativeAccount}
                                                handleChange={this.AlternativeAccounthandleChange}
                                                placeholder='alternativeAccount'
                                                selectedValue={this.state.AlternativeAccountId} />
                                        </div>
                                        <div className="linebylineInput valid-input alternativeDate">
                                            

                                                {
                                                    this.state.AlternativAccountId === '' ? null
                                                        : <Fragment>
                                                            <DatePicker title='alternativeDate'
                                                                startDate={this.state.AccountData.alternativDate === null ? this.state.AlternativeDate : moment(this.state.AccountData.alternativDate).format("DD-MM-YYYY")}
                                                                handleChange={this.AlternativeDatehandleChange} />

                                                            <div className="ui checkbox checkBoxGray300 checked">
                                                                <input type="checkbox" value='1' onChange={this.ReplacmenthandleCheck} defaultChecked={this.state.AccountData.isAlternativeWorkFlow === null ? this.state.checked : this.state.AccountData.isAlternativeWorkFlow} />
                                                                <label> {Resources['replacment'][currentLanguage]}</label>
                                                            </div>
                                                        </Fragment>
                                                }
                                        </div>
                                        <div className="linebylineInput valid-input">

                                            <InPut title='hoursRate'
                                                placeholderText='hoursRate' value={this.state.HoursRate}
                                                inputChangeHandler={this.hoursRateChangeHandler} />
                                        </div>
                                    </form>

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
                            </div >
                        </div>
                    </div>
                </div>
            </div >
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
