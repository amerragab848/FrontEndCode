import React, { Component, Fragment } from 'react';
import DropdownMelcous from '../../OptionsPanels/DropdownMelcous';
import Api from '../../../api';
import Resources from '../../../resources.json';
import Config from "../../../Services/Config";
import dataservice from "../../../Dataservice";
//import _ from "lodash";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux'
import * as AdminstrationActions from '../../../store/actions/Adminstration'
import { bindActionCreators } from 'redux';
import { withRouter } from "react-router-dom";
import LoadingSection from '../../publicComponants/LoadingSection';
import { toast } from "react-toastify";
import CompanyDropdown from '../../publicComponants/CompanyDropdown'
import ContactDropdown from '../../publicComponants/ContactDropdown'

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
const publicConfiguarion = Config.getPayload();
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

        if (Config.IsAllow(801)) {
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
                LoadingVaildation: false,
                togglePass: false,
                showHide: false,
                saveLoading: false
            }
        }
        else { this.props.history.goBack() }
    }

    componentDidMount = () => {
        dataservice.GetDataList('GetCompanies?accountOwnerId=' + publicConfiguarion.aoi + '', 'companyName', 'id').then(
            result => {
                this.setState({ CompanyData: result });
            }
        );

        dataservice.GetDataList('GetGroup?accountOwnerId=' + publicConfiguarion.aoi + '', 'groupName', 'id').then(
            result => {
                this.setState({ GroupNameData: result });
            }
        );
        this.designTeamChecked = this.designTeamChecked.bind(this);
    }

    //#region  handle change functions of inputs and dropdown and checkbox

    passwordChangeHandler = (e) => {
        let password = e.target.value.replace(/&/g, '%26%')
        this.setState({ Password: password });
    }

    designTeamChecked = (e) => {
        this.setState({ DesignTeam: e.target.value });
    }

    taskAdminChecked = (e) => {
        this.setState({ TaskAdmin: e.target.value });
    }

    activeChecked = (e) => {
        this.setState({ Active: e.target.value });
    }

    userPermissiononChecked = (e) => {
        this.setState({ UserPermissiononLogsCreatedbyOthers: e.target.value });
    }

    companyNamehandleChange = (e) => {
        
        this.setState({ CompanyId: e });
        dataservice.GetDataList('GetContactsNotUsersByCompanyId?companyId=' + e.value + '', 'contactName', 'id').then(
            result => {
                this.setState({ ContactData: result });
            }
        );
    }

    supervisorCompanyhandleChange = (e) => {
        this.setState({ SupervisorCompanyId: e });
        dataservice.GetDataList('GetContactsByCompanyIdForOnlyUsers?companyId=' + e.value + '', 'contactName', 'id').then(
            result => {
                this.setState({ SupervisorNameData: result });
            }
        );
    }

    //check id username is already exists or no 
    checkUserName = (e) => {
        let username = e.target.value.toLowerCase();
        username.replace(/&/g, '%26%')
        if (username !== "") {
            this.setState({ LoadingVaildation: true });
            Api.get('CheckUserNameAccount?userName=' + username + '').then(
                res => {
                    if (res === true) {
                        this.setState({ LoadingVaildation: false, UserName: '' });
                        toast.error(Resources['smartDeleteMessage'][currentLanguage].refCodeExist);
                    }
                    else {
                        this.setState({ LoadingVaildation: false, UserName: username });
                    }
                }
            )
        }
    }

    //check id empcode is already exists or no 
    checkEmpCode = (e) => {

        let empcode = e.target.value;
        if (empcode !== "") {
            this.setState({ LoadingVaildation: true });
            Api.get('CheckRefCodeEmployee?code=' + empcode + '').then(
                res => {
                    if (res === true) {
                        this.setState({ LoadingVaildation: false, EmpCode: '' });
                        toast.error(Resources['userNameAlreadyExisted'][currentLanguage]);
                    }
                    else {
                        this.setState({ LoadingVaildation: false, EmpCode: empcode });
                    }
                }
            )
        } else {
            this.setState({ LoadingVaildation: false })
        }
    }

    //week days checked
    daysHandleChange = (e) => {
        let dayId = e.target.value;
        let dayIsInlist = ListOfDays.filter(s => s === dayId).length;
        if (dayIsInlist > 0) {
            var index = ListOfDays.indexOf(dayId);
            ListOfDays.splice(index, 1);
        }
        else {
            ListOfDays.push(dayId);
        }
        this.setState({ checked: !this.state.checked });
    }

    //#endregion

    // in save account calling api authorizationApi 'to check this account userName and password already exists or no'
    // when result return 'Successfuly created account.' calling api addccount and save account and route to accounts log
    save = () => {
        this.setState({ saveLoading: true });
        let accountCompanyId = Config.getPublicConfiguartion().accountCompanyId;
        Api.authorizationApi('ProcoorAuthorization?username=' + this.state.UserName + '&password=' + this.state.Password + '&companyId=' + accountCompanyId +'&isActive=true&isNewVersion=true', null, 'POST',  false).then(res => {
            //Successfuly created account.
            if (res.status === 200 && res.msg !== "Email already exists.") {
                let obj = {
                    userName: this.state.UserName, userPassword: this.state.Password,
                    accountCompanyId: Config.getPublicConfiguartion().accountCompanyId, companyId: this.state.CompanyId.value,
                    contactId: this.state.ContactId.value, contactSupervisorId: this.state.SupervisorId.value,
                    companySupervisorId: this.state.SupervisorCompanyId.value, defaultHours: this.state.WorkingHours,
                    userRate: this.state.HoursRate, groupId: this.state.GroupNameId.value, empCode: this.state.EmpCode,
                    designTeam: this.state.DesignTeam, deletable: true,
                    isTaskAdmin: this.state.TaskAdmin, active: this.state.Active, passwordEdit: false,
                    isHrManager: false, usePermissionsOnLogs: this.state.UserPermissiononLogsCreatedbyOthers
                };
                Api.post('AddAccount', obj).then(res => {

                    try {
                        //this code from adding account vacation
                        ListOfDays.forEach(function (item) {
                            var dayId = '';
                            dayId = item;
                            Api.post('UpdateVacations?accountId=' + res + '&dayId=' + dayId );
                        });
                    } catch { }
                    this.props.actions.routeToTabIndex(0);
                    this.props.history.push({ pathname: '/TemplatesSettings' });
                    toast.success(Resources["operationSuccess"][currentLanguage]);
                    this.setState({ saveLoading: false });
                }).catch(ex => {
                    toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
                    this.setState({ saveLoading: false });
                });
            } 
            else {
                toast.warn(res.msg );
                this.setState({ saveLoading: false });
            }
        }).catch(ex => {
            toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
            this.setState({ saveLoading: false });
        })

    }

    //show password
    handlePasswordtype = () => {
        this.setState({ togglePass: !this.state.togglePass, showHide: !this.state.showHide });
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

                                    {this.state.LoadingVaildation ? <LoadingSection /> : null}

                                    <Formik
                                        initialValues={{
                                            UserName: '', Password: '', WorkHours: '', EmpCode: '',
                                            RateHours: '', SupervisorName: '', ContactName: '',
                                        }}
                                        enableReinitialize={true}
                                        validationSchema={validationSchema}
                                        onSubmit={() => { this.save() }} >

                                        {({ errors, touched, handleBlur, values, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                                            <Form id="signupForm1" className="proForm datepickerContainer" noValidate="novalidate" onSubmit={handleSubmit}>

                                                <div className="proForm first-proform fullProformWrapper">

                                                    <div className="linebylineInput valid-input">
                                                        <label className="control-label">{Resources['UserName'][currentLanguage]} </label>
                                                        <div className={'ui input inputDev ' + (errors.UserName && touched.UserName ? 'has-error' : null) + ' '}>
                                                            <input name='UserName' value={this.state.UserName}
                                                                className="form-control" id="UserName" placeholder={Resources['UserName'][currentLanguage]} autoComplete='off'
                                                                onBlur={(e) => {
                                                                    this.checkUserName(e)
                                                                    
                                                                    handleBlur(e)
                                                                }} onChange={(e) => {
                                                                    handleChange(e)
                                                                    this.setState({ UserName: e.target.value })
                                                                }} />
                                                            {errors.UserName && touched.UserName ? (<em className="pError">{errors.UserName}</em>) : null}
                                                        </div>
                                                    </div>

                                                    <div className="linebylineInput">
                                                        <label data-toggle="tooltip" title={Resources['active'][currentLanguage]} className="control-label"> {Resources['active'][currentLanguage]} </label>
                                                        <div className="ui checkbox radio radioBoxBlue">
                                                            <input type="radio" defaultChecked name="active" value="true" onChange={this.activeChecked} />
                                                            <label>{Resources['yes'][currentLanguage]}</label>
                                                        </div>
                                                        <div className="ui checkbox radio radioBoxBlue checked">
                                                            <input type="radio" name="active" value="false" onChange={this.activeChecked} />
                                                            <label> {Resources['no'][currentLanguage]}</label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="linebylineInput passwordInputs showPasswordArea fullInputWidth">
                                                    <label className="control-label">{Resources['password'][currentLanguage]} </label>
                                                    <div className={'ui input inputDev ' + (errors.Password && touched.Password ? 'has-error' : ' ') + ' '} style={{ maxWidth: '360px' }}>
                                                        <span className={"inputsideNote togglePW " + (this.state.showHide ? 'active-pw' : ' ')} onClick={this.handlePasswordtype}>
                                                            <svg class="show" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                                                <path fill="#BCC4D1" fill-rule="evenodd" d="M8 6.406c.288 0 .558.073.81.218.253.145.454.341.602.589.148.247.222.512.222.793 0 .282-.074.547-.222.794a1.64 1.64 0 0 1-.602.589 1.602 1.602 0 0 1-.81.217c-.288 0-.558-.072-.81-.217a1.64 1.64 0 0 1-.602-.589 1.52 1.52 0 0 1-.222-.794c0-.281.074-.546.222-.793a1.64 1.64 0 0 1 .602-.589c.252-.145.522-.218.81-.218zm0 4.276c.497 0 .954-.12 1.373-.359.418-.239.749-.563.993-.973.244-.41.366-.857.366-1.344 0-.486-.122-.934-.366-1.344a2.688 2.688 0 0 0-.993-.972A2.72 2.72 0 0 0 8 5.33c-.497 0-.954.12-1.373.359-.418.239-.749.563-.993.972-.244.41-.366.858-.366 1.344 0 .487.122.935.366 1.344.244.41.575.734.993.973A2.72 2.72 0 0 0 8 10.682zM8 4c.898 0 1.752.17 2.562.512a6.378 6.378 0 0 1 2.072 1.408A6.249 6.249 0 0 1 14 8.006a6.18 6.18 0 0 1-1.366 2.08 6.428 6.428 0 0 1-2.072 1.402A6.534 6.534 0 0 1 8 12c-.898 0-1.752-.17-2.562-.512a6.428 6.428 0 0 1-2.072-1.402A6.18 6.18 0 0 1 2 8.006c.314-.785.77-1.48 1.366-2.086a6.378 6.378 0 0 1 2.072-1.408A6.534 6.534 0 0 1 8 4z"
                                                                />
                                                            </svg>

                                                            <svg class="hide" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                                                <path fill="#BCC4D1" fill-rule="evenodd" d="M7.934 6.16h.08c.287 0 .558.072.811.215.254.144.454.338.603.582.148.244.223.506.223.784v.101L7.934 6.161zm-2.344.418c-.21.387-.315.775-.315 1.163 0 .48.122.923.367 1.327a2.756 2.756 0 0 0 2.371 1.315 2.66 2.66 0 0 0 1.205-.303l-.851-.81a1.33 1.33 0 0 1-.354.051c-.288 0-.559-.072-.812-.215a1.633 1.633 0 0 1-.603-.581 1.484 1.484 0 0 1-.222-.784c0-.11.017-.224.052-.342l-.838-.821zM2.563 3.67L3.258 3l9.668 9.33-.695.67a129.295 129.295 0 0 1-1.834-1.757 6.267 6.267 0 0 1-2.384.442c-.9 0-1.755-.168-2.568-.505A6.447 6.447 0 0 1 3.37 9.795 6.097 6.097 0 0 1 2 7.741c.42-1.012 1.1-1.884 2.044-2.617L2.564 3.67zm5.45 1.429c-.34 0-.672.067-.996.202L5.838 4.163a6.13 6.13 0 0 1 2.175-.38c.9 0 1.751.17 2.555.507A6.324 6.324 0 0 1 14 7.74a6.335 6.335 0 0 1-1.86 2.491l-1.599-1.53c.14-.311.21-.631.21-.96 0-.48-.122-.923-.367-1.328a2.756 2.756 0 0 0-2.371-1.315z"
                                                                />
                                                            </svg>
                                                            <span class="show"> Show</span>
                                                            <span class="hide"> Hide</span>
                                                        </span>

                                                        <input style={{ width: '100%' }} autoComplete='new-password' name='Password' className="form-control"
                                                            id="Password" placeholder={Resources['password'][currentLanguage]}
                                                            onBlur={(e) => {
                                                                this.passwordChangeHandler(e)
                                                                handleBlur(e)
                                                            }} onChange={handleChange} type={this.state.togglePass ? 'text' : 'password'} />
                                                        {/* {errors.Password && touched.Password ? (<em className="pError">{errors.Password}</em>) : null} */}
                                                        <em style={{ display: 'block' }} class="formInputP">Password must include:
                                                            <span class="charsNumber">8 characters </span>|
                                                            <span class="capsSpan">Capital letter</span>
                                                        </em>
                                                    </div>
                                                </div>

                                                <div className="linebylineInput valid-input">
                                                    <label className="control-label">{Resources['employeeCode'][currentLanguage]} </label>
                                                    <div className={'ui input inputDev ' + (errors.EmpCode && touched.EmpCode ? 'has-error' : null) + ' '}>
                                                        <input name='EmpCode' value={this.state.EmpCode}
                                                            className="form-control" id="EmpCode" placeholder={Resources['employeeCode'][currentLanguage]} autoComplete='off'
                                                            onBlur={(e) => {
                                                                this.checkEmpCode(e)
                                                                handleBlur(e)
                                                            }} onChange={(e) => {
                                                                handleChange(e)
                                                                this.setState({ EmpCode: e.target.value })
                                                            }} />
                                                        {errors.EmpCode && touched.EmpCode ? (<em className="pError">{errors.EmpCode}</em>) : null}
                                                    </div>
                                                </div>

                                                <div className="linebylineInput valid-input mix_dropdown">
                                                    <label className="control-label">{Resources.fromCompany[currentLanguage]}</label>
                                                    <div className="supervisor__company">
                                                        <div className="super_name">
                                                            <DropdownMelcous data={this.state.ContactData} onChange={setFieldValue} name="ContactName"
                                                                onBlur={setFieldTouched} error={errors.ContactName} id="ContactName" index="IR-ContactName"
                                                                handleChange={e => this.setState({ ContactId: e })} touched={touched.ContactName}
                                                                selectedValue={this.state.ContactId} styles={CompanyDropdown} classDrop="contactName1 " />
                                                        </div>

                                                        <div className="super_company">
                                                            <DropdownMelcous data={this.state.CompanyData} name="CompanyName"
                                                                selectedValue={this.state.selectedFromCompany}
                                                                handleChange={this.companyNamehandleChange} selectedValue={this.state.CompanyId} classDrop="companyName1" styles={ContactDropdown} />
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
                                                                handleChange={(e) => this.setState({ SupervisorId: e })}
                                                                selectedValue={this.state.SupervisorId} styles={CompanyDropdown} classDrop="contactName1 "
                                                            />
                                                        </div>

                                                        <div className="super_company">
                                                            <DropdownMelcous data={this.state.CompanyData} name="SupervisorCompany" selectedValue={this.state.SupervisorCompanyId}
                                                                handleChange={this.supervisorCompanyhandleChange} classDrop=" companyName1" styles={ContactDropdown} />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="linebylineInput valid-input">
                                                    <DropdownMelcous title='GroupName'
                                                        data={this.state.GroupNameData}
                                                        handleChange={e => this.setState({ GroupNameId: e })}
                                                        placeholder='GroupName' />
                                                </div>

                                                <div className="fullWidthWrapper account__checkbox">

                                                    <div className="proForm fullLinearInput">
                                                        <div className="linebylineInput">
                                                            <label data-toggle="tooltip" title={Resources['designTeam'][currentLanguage]} className="control-label"> {Resources['designTeam'][currentLanguage]} </label>
                                                            <div className="ui checkbox radio radioBoxBlue">
                                                                <input type="radio" name="designTeam" value="true" onChange={this.designTeamChecked} />
                                                                <label>{Resources['yes'][currentLanguage]}</label>
                                                            </div>
                                                            <div className="ui checkbox radio radioBoxBlue checked">
                                                                <input type="radio" defaultChecked name="designTeam" value="false" onChange={this.designTeamChecked} />
                                                                <label> {Resources['no'][currentLanguage]}</label>
                                                            </div>

                                                        </div>
                                                    </div>

                                                    <div className="proForm fullLinearInput">
                                                        <div className="linebylineInput">
                                                            <label data-toggle="tooltip" title={Resources['isTaskAdmin'][currentLanguage]} className="control-label"> {Resources['isTaskAdmin'][currentLanguage]} </label>
                                                            <div className="ui checkbox radio radioBoxBlue">
                                                                <input type="radio" name="TaskAdmin" value="true" onChange={this.taskAdminChecked} />
                                                                <label>{Resources['yes'][currentLanguage]}</label>
                                                            </div>
                                                            <div className="ui checkbox radio radioBoxBlue checked">
                                                                <input type="radio" defaultChecked name="TaskAdmin" value="false" onChange={this.taskAdminChecked} />
                                                                <label> {Resources['no'][currentLanguage]}</label>
                                                            </div>

                                                        </div>
                                                    </div>

                                                    <div className="proForm fullLinearInput">
                                                        <div className="linebylineInput">
                                                            <label data-toggle="tooltip" title={Resources['usePermissionsOnLogs'][currentLanguage]} className="control-label"> {Resources['usePermissionsOnLogs'][currentLanguage]} </label>
                                                            <div className="ui checkbox radio radioBoxBlue">
                                                                <input type="radio" name="usePermissionsOnLogs" value="true" onChange={this.userPermissiononChecked} />
                                                                <label>{Resources['yes'][currentLanguage]}</label>
                                                            </div>
                                                            <div className="ui checkbox radio radioBoxBlue ">
                                                                <input type="radio" defaultChecked name="usePermissionsOnLogs" value="false" onChange={this.userPermissiononChecked} />
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
                                                                    autoComplete='off' onBlur={handleBlur} onChange={
                                                                        e => {
                                                                            handleChange(e)
                                                                            this.setState({ WorkingHours: e.target.value })
                                                                        }} />
                                                                {errors.WorkHours && touched.WorkHours ? (<em className="pError">{errors.WorkHours}</em>) : null}
                                                            </div>
                                                        </div>

                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources['hoursRate'][currentLanguage]} </label>
                                                            <div className={'ui input inputDev ' + (errors.RateHours && touched.RateHours ? 'has-error' : null) + ' '}>
                                                                <span className="inputsideNote">Optional</span>
                                                                <input name='RateHours' className="form-control" id="RateHours" placeholder={Resources['hoursRate'][currentLanguage]}
                                                                    autoComplete='off' onBlur={handleBlur}
                                                                    onChange={(e) => {
                                                                        handleChange(e)
                                                                        this.setState({ HoursRate: e.target.value });
                                                                    }} />
                                                                {errors.RateHours && touched.RateHours ? (<em className="pError">{errors.RateHours}</em>) : null}
                                                            </div>
                                                        </div>

                                                        <div className="linebylineInput daysCheckbox">
                                                            <label> HR Vacation Days</label>
                                                            <div className="three__daysCheck--flex">
                                                                <div className="three__daysCheck">
                                                                    <div className="ui checkbox checkBoxGray300 checked">
                                                                        <input type="checkbox" value='1' onChange={this.daysHandleChange} defaultChecked={this.state.checked} />
                                                                        <label>Saturday</label>
                                                                    </div>
                                                                    <div className="ui checkbox checkBoxGray300 checked">
                                                                        <input type="checkbox" value='2' onChange={this.daysHandleChange} defaultChecked={this.state.checked} />
                                                                        <label>Sunday</label>
                                                                    </div>
                                                                    <div className="ui checkbox checkBoxGray300 checked">
                                                                        <input type="checkbox" value='3' onChange={this.daysHandleChange} defaultChecked={this.state.checked} />
                                                                        <label>Monday</label>
                                                                    </div>
                                                                </div>
                                                                <div className="three__daysCheck">
                                                                    <div className="ui checkbox checkBoxGray300 checked">
                                                                        <input type="checkbox" value='4' onChange={this.daysHandleChange} defaultChecked={this.state.checked} />
                                                                        <label>Tuesday</label>
                                                                    </div>
                                                                    <div className="ui checkbox checkBoxGray300 checked">
                                                                        <input type="checkbox" value='5' onChange={this.daysHandleChange} defaultChecked={this.state.checked} />
                                                                        <label>Wednesday</label>
                                                                    </div>
                                                                    <div className="ui checkbox checkBoxGray300 checked">
                                                                        <input type="checkbox" value='6' onChange={this.daysHandleChange} defaultChecked={this.state.checked} />
                                                                        <label>Thursday</label>
                                                                    </div>
                                                                </div>
                                                                <div className="three__daysCheck">
                                                                    <div className="ui checkbox checkBoxGray300 checked">
                                                                        <input type="checkbox" value='7' onChange={this.daysHandleChange} defaultChecked={this.state.checked} />
                                                                        <label>Friday</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="dropBtn dropBtnLeft fullWidthWrapper">

                                                    {this.state.saveLoading ?
                                                        <button className="primaryBtn-1 btn disabled">
                                                            <div className="spinner">
                                                                <div className="bounce1" />
                                                                <div className="bounce2" />
                                                                <div className="bounce3" />
                                                            </div>
                                                        </button> :
                                                        <button className="primaryBtn-1 btn" type='submit'  >
                                                            {Resources['save'][currentLanguage]}</button>
                                                    }
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
