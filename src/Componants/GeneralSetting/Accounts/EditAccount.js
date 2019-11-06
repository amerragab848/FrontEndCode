import React, { Component, Fragment } from 'react';
import Dropdown from '../../OptionsPanels/DropdownMelcous';
import DatePicker from '../../OptionsPanels/DatePicker';
import moment from 'moment';
import Resources from '../../../resources.json';
import config from "../../../Services/Config";
import find from "lodash/find";
import dataservice from "../../../Dataservice";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import LoadingSection from '../../publicComponants/LoadingSection';
import CompanyDropdown from '../../publicComponants/CompanyDropdown';
import ContactDropdown from '../../publicComponants/ContactDropdown';
import { toast } from "react-toastify";
import api from "../../../api";

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const validationSchema = Yup.object().shape({
    userName: Yup.string().required(Resources['isRequiredField'][currentLanguage]),
    defaultHours: Yup.number().typeError(Resources['onlyNumbers'][currentLanguage]).required(Resources['isRequiredField'][currentLanguage]),
    contactSupervisorId: Yup.string().required(Resources['isRequiredField'][currentLanguage]),
    empCode: Yup.number().required(Resources['isRequiredField'][currentLanguage])
});

class EditAccount extends Component {

    constructor(props) {
        super(props);

        let id = '';

        const query = new URLSearchParams(this.props.location.search);
        for (let param of query.entries()) {
            id = param[1];
        }

        const payload = config.getPayload();

        this.state = {
            accountOwnerId: payload.aoi,
            docId: id,
            supervisorCompany: [],
            groupData: [],
            accountData: [],
            loading: true,
            accountDocument: {},
            selectedSupervisorCompany: { label: Resources.supervisorCompanyRequired[currentLanguage], value: "0" },
            selectedSupervisorContact: { label: Resources.selectContact[currentLanguage], value: "0" },
            selectedGroup: { label: Resources.groupSelection[currentLanguage], value: "0" },
            selectedAlternative: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
            alternativeAccounts: [],
            supervisorContact: [],
            isExist: false,
            alternativeDate: moment(),
            isLoading: false
        }

        if (!config.IsAllow(797)) {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.goBack();
        }
    }

    componentDidMount = () => {

        if (this.state.docId > 0) {

            let id = this.state.docId;

            let accountOwnerId = null;
            let companyName = null;
            let companyId = null;
            let contactName = null;
            let contactId = null;
            let groupId = null;
            let groupName = null;
            let alternativAccountId = null;
            let contactSupervisorId = null;
            dataservice.GetRowById('GetAccountById?id=' + id).then(result => {
                let document = {
                    userName: result.userName,
                    oldUserName: result.userName,
                    email: result.email,
                    userPassword: result.userPassword,
                    accountCompanyId: result.accountCompanyId,
                    companyId: result.companyId,
                    contactId: result.contactId,
                    defaultHours: result.defaultHours,
                    userRate: result.userRate,
                    companySupervisorId: result.companySupervisorId,
                    contactSupervisorId: result.contactSupervisorId,
                    supervisorAccountId: result.supervisorAccountId,
                    empCode: result.empCode,
                    accountOwnerId: result.accountOwnerId,
                    designTeam: result.designTeam,
                    isTaskAdmin: result.isTaskAdmin,
                    active: result.active,
                    passwordEdit: result.passwordEdit,
                    isHrManager: result.isHrManager,
                    usePermissionsOnLogs: result.usePermissionsOnLogs,
                    alternativAccountId: result.alternativAccountId,
                    alternativDate: result.alternativDate,
                    isAlternativeWorkFlow: result.isAlternativeWorkFlow,
                    groupId: result.groupId
                }

                accountOwnerId = result.accountOwnerId;
                companyName = result.supervisorCompanyName;
                contactName = result.supervisorName;
                companyId = result.companySupervisorId;
                contactId = result.supervisorAccountId;
                groupId = result.groupId;
                groupName = result.groupName;
                alternativAccountId = result.alternativAccountId;
                contactSupervisorId = result.contactSupervisorId

                dataservice.GetDataList('SelectAllAccountsActive?id=' + id, 'userName', 'id').then(result => {
                    if (result) {
                        let alternativAccount = {};

                        if (alternativAccountId) {
                            alternativAccount = find(result, function (i) { return i.value === alternativAccountId });
                            if (alternativAccount) {
                                this.setState({ selectedAlternative: alternativAccount });
                            }

                        }
                        this.setState({ alternativeAccounts: result });
                    }
                });

                dataservice.GetDataList('GetGroup?accountOwnerId=' + accountOwnerId, 'groupName', 'id').then(result => {

                    if (result) {

                        let group = {};
                        if (groupId) {
                            group = find(result, function (i) { return i.value === groupId; });
                            this.setState({ selectedGroup: group });
                        }
                        this.setState({ groupData: result });

                    }
                });

                dataservice.GetDataList('GetCompanies?accountOwnerId=' + accountOwnerId, 'companyName', 'id').then(result => {
                    if (result) {
                        if (companyId != null) {
                            const doc = {
                                label: contactName,
                                value: contactSupervisorId
                            }
                            this.handleDropDown('selectedSupervisorContact', companyId, true, doc);
                        }

                        this.setState({ supervisorCompany: result, selectedSupervisorCompany: { label: companyName, value: companyId } });
                    }
                });

                this.setState({
                    accountDocument: document,
                    alternativeDate: result.alternativDate !== null ? moment(result.alternativDate).format('YYYY-MM-DD') : moment()
                });
            });
        }
    }

    handleDropDown(selectedValue, event, isNew, fillDrop) {

        this.setState({ [selectedValue]: event });

        const selected = isNew === true ? "selectedSupervisorCompany" : "";

        if (selected === "selectedSupervisorCompany") {

            const companyId = isNew === true ? event : companyId.value;

            dataservice.GetDataList('GetContactsByCompanyIdForOnlyUsers?companyId=' + companyId, 'contactName', 'id').then(result => {
                let obj = { label: fillDrop.label, value: fillDrop.value };
                let defaultObj = { label: Resources.selectContact[currentLanguage], value: "0" }
                let setObj = isNew === true ? obj : defaultObj;
                this.setState({ supervisorContact: result, selectedSupervisorContact: setObj });
            });
        }
    }

    editAccount = (value) => {

        let accountCompanyId = config.getPublicConfiguartion().accountCompanyId;

        this.setState({
            isLoading: true
        })
        let alternativeDate = moment(this.state.alternativeDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");

        let document = {
            id: this.state.docId,
            userName: value.userName,
            oldUserName: value.userName,
            email: value.email,
            userPassword: value.userPassword,
            accountCompanyId: accountCompanyId,
            defaultHours: value.defaultHours,
            userRate: value.userRate,
            supervisorAccountId: value.supervisorAccountId,
            empCode: value.empCode,
            accountOwnerId: value.accountOwnerId,
            designTeam: value.designTeam,
            isTaskAdmin: value.isTaskAdmin,
            active: value.active,
            passwordEdit: value.passwordEdit,
            isHrManager: value.isHrManager,
            usePermissionsOnLogs: value.usePermissionsOnLogs,
            alternativAccountId: this.state.selectedAlternative.value,
            alternativDate: alternativeDate,
            isAlternativeWorkFlow: value.isAlternativeWorkFlow,
            groupId: this.state.selectedGroup.value,
            companyId: value.companyId,
            contactSupervisorId: this.state.selectedSupervisorContact.value,
            companySupervisorId: this.state.selectedSupervisorCompany.value
        }
        if (document.userName === document.oldUserName) {
            dataservice.addObject('EditAccount', document).then(res => {
                this.setState({ isLoading: false });
                toast.success(Resources["operationSuccess"][currentLanguage]);
                this.props.history.push({ pathname: '/TemplatesSettings' });
            }
            ).catch(ex => {
                this.props.history.push({ pathname: '/TemplatesSettings' });
            })
        } else {
            api.authorizationApi('ProcoorAuthorization?username=' + document.oldUserName + '&emailOrpassword=' + document.userName + '&companyId=' + accountCompanyId + '&changePassword=false', null, 'PUT').then(res => {
                dataservice.addObject('EditAccount', document).then(res => {
                    this.setState({ isLoading: false });
                    toast.success(Resources["operationSuccess"][currentLanguage]);
                    this.props.history.push({ pathname: '/TemplatesSettings' })
                }
                ).catch(ex => {
                    this.props.history.push({ pathname: '/TemplatesSettings' });
                })
            });
        }
    }

    checkUserNameExist = (userName) => {
        dataservice.GetDataGrid("CheckUserNameForAccount?userName=" + userName + "&id=" + this.state.docId).then(result => {
            if (result === true) {
                toast.warn(Resources.userNameAlreadyExisted[currentLanguage]);
                this.setState({
                    isExist: true
                });
            }
        });
    }

    handleDate = (value) => {
        this.setState({
            alternativeDate: value
        });
    }

    render() {
        return (
            <div className="mainContainer main__fulldash">
                <div className="documents-stepper cutome__inputs noTabs__document">
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
                        <div className="step-content noBtn__footer">
                            <div className="subiTabsContent">
                                <div className="document-fields">
                                    <Formik
                                        initialValues={{
                                            userName: this.state.isExist === false ? this.state.accountDocument.userName : '',
                                            oldUserName: this.state.accountDocument.userName,
                                            email: this.state.accountDocument.email,
                                            userPassword: this.state.accountDocument.userPassword,
                                            accountCompanyId: this.state.accountDocument.accountCompanyId,
                                            companyId: this.state.accountDocument.companyId,
                                            contactSupervisorId: this.state.accountDocument.contactSupervisorId,
                                            contactId: this.state.accountDocument.contactId,
                                            defaultHours: this.state.accountDocument.defaultHours,
                                            userRate: this.state.accountDocument.userRate,
                                            companySupervisorId: this.state.accountDocument.companySupervisorId,
                                            supervisorAccountId: this.state.accountDocument.supervisorAccountId,
                                            empCode: this.state.accountDocument.empCode,
                                            accountOwnerId: this.state.accountDocument.accountOwnerId,
                                            designTeam: this.state.accountDocument.designTeam,
                                            isTaskAdmin: this.state.accountDocument.isTaskAdmin,
                                            active: this.state.accountDocument.active,
                                            passwordEdit: this.state.accountDocument.passwordEdit,
                                            isHrManager: this.state.accountDocument.isHrManager,
                                            usePermissionsOnLogs: this.state.accountDocument.usePermissionsOnLogs,
                                            alternativAccountId: this.state.accountDocument.alternativAccountId,
                                            alternativDate: this.state.alternativeDate,
                                            isAlternativeWorkFlow: this.state.accountDocument.isAlternativeWorkFlow,
                                            groupId: this.state.accountDocument.groupId
                                        }}
                                        enableReinitialize={true}
                                        validationSchema={validationSchema}
                                        onSubmit={(values) => { this.editAccount(values) }}>
                                        {({ values, errors, touched, handleBlur, handleChange, setFieldValue, handleSubmit }) => (
                                            <Form id="signupForm1" className="proForm datepickerContainer" noValidate="novalidate" onSubmit={handleSubmit}>
                                                <div className="proForm first-proform fullProformWrapper">
                                                    <div className="linebylineInput valid-input">
                                                        <label className="control-label">{Resources['UserName'][currentLanguage]} </label>
                                                        <div className={'ui input inputDev ' + (errors.userName && touched.userName ? 'has-error' : null) + ' '}>
                                                            <input name='userName' className="form-control" id="userName"
                                                                placeholder={Resources['UserName'][currentLanguage]} autoComplete='off'
                                                                value={values.userName}
                                                                onChange={handleChange}
                                                                onBlur={() => { this.checkUserNameExist(values.userName) }} />
                                                            {touched.userName ? (<em className="pError">{errors.userName}</em>) : null}
                                                        </div>
                                                    </div>
                                                    <div className="linebylineInput">
                                                        <label data-toggle="tooltip" title={Resources['active'][currentLanguage]} className="control-label"> {Resources['active'][currentLanguage]} </label>
                                                        <div className="ui checkbox radio radioBoxBlue">
                                                            <input type="radio" defaultChecked name="active" defaultChecked={values.active ? 'checked' : null} value="true" onChange={(e) => { setFieldValue('active', e.target.value) }} />
                                                            <label>{Resources['yes'][currentLanguage]}</label>
                                                        </div>
                                                        <div className="ui checkbox radio radioBoxBlue checked">
                                                            <input type="radio" name="active" value="false" defaultChecked={values.active ? null : 'checked'} onChange={(e) => { setFieldValue('active', e.target.value) }} />
                                                            <label> {Resources['no'][currentLanguage]}</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="linebylineInput valid-input">
                                                    <label className="control-label">{Resources['employeeCode'][currentLanguage]} </label>
                                                    <div className={'ui input inputDev ' + (errors.empCode && touched.empCode ? 'has-error' : null)}>
                                                        <input name='empCode' className="form-control" id="userName"
                                                            placeholder={Resources['employeeCode'][currentLanguage]} autoComplete='off'
                                                            value={values.empCode}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur} />
                                                        {errors.empCode && touched.empCode ? (<em className="pError">{errors.empCode}</em>) : null}
                                                    </div>
                                                </div>
                                                <div className="linebylineInput valid-input">
                                                    <Dropdown title='GroupName'
                                                        data={this.state.groupData}
                                                        handleChange={(e) => this.handleDropDown('selectedGroup', e, false)}
                                                        placeholder={Resources['GroupName'][currentLanguage]}
                                                        value={values.groupId}
                                                        selectedValue={this.state.selectedGroup} />
                                                </div>
                                                <div className="linebylineInput valid-input mix_dropdown">
                                                    <label className="control-label">{Resources['SupervisorCompany'][currentLanguage]}</label>
                                                    <div className="supervisor__company">
                                                        <div className="super_name">
                                                            <Dropdown
                                                                data={this.state.supervisorCompany}
                                                                handleChange={(e) => this.handleDropDown('selectedSupervisorCompany', e, false)}
                                                                placeholder={Resources['supervisorCompanyRequired'][currentLanguage]}
                                                                selectedValue={this.state.selectedSupervisorCompany}
                                                                styles={CompanyDropdown} classDrop="contactName1 " />
                                                        </div>
                                                        <div className={"super_company" + (errors.contactSupervisorId && touched.contactSupervisorId ? ' has-error' : !errors.contactSupervisorId && touched.contactSupervisorId ? ' has-success' : ' ')}>
                                                            <Dropdown
                                                                placeholder={Resources['selectContact'][currentLanguage]}
                                                                selectedValue={this.state.selectedSupervisorContact}
                                                                data={this.state.supervisorContact}
                                                                handleChange={(e) => this.handleDropDown('selectedSupervisorContact', e, false)}
                                                                placeholder='SupervisorCompany' classDrop=" companyName1"
                                                                styles={ContactDropdown} />
                                                            {touched.contactSupervisorId ? (<em className="pError"> {errors.contactSupervisorId} </em>) : null}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="linebylineInput valid-input">
                                                    <Dropdown title='alternativeAccount'
                                                        data={this.state.alternativeAccounts}
                                                        handleChange={(e) => this.handleDropDown('selectedAlternative', e, false)}
                                                        placeholder='alternativeAccount'
                                                        selectedValue={this.state.selectedAlternative} />
                                                </div>

                                                <Fragment>
                                                    {this.state.selectedAlternative.value === "0" ? null :
                                                        <div className="linebylineInput valid-input alternativeDate alternativeDate_replacement">
                                                            <DatePicker title='alternativeDate'
                                                                startDate={this.state.alternativeDate}
                                                                handleChange={(e) => this.handleDate(e)} />
                                                            <div className="ui checkbox checkBoxGray300 checked">
                                                                <input type="checkbox" onChange={(e) => { setFieldValue('isAlternativeWorkFlow', e.target.checked) }}
                                                                    defaultChecked={values.isAlternativeWorkFlow} />
                                                                <label> {Resources['replacment'][currentLanguage]}</label>
                                                            </div>
                                                        </div>
                                                    }
                                                </Fragment>
                                                <div className="fullWidthWrapper account__checkbox">
                                                    <div className="proForm fullLinearInput">
                                                        <div className="linebylineInput">
                                                            <label data-toggle="tooltip" title={Resources['designTeam'][currentLanguage]} className="control-label"> {Resources['designTeam'][currentLanguage]} </label>
                                                            <div className="ui checkbox radio radioBoxBlue">
                                                                <input type="radio" name="designTeam" checked={values.designTeam === true} value={values.designTeam} onChange={(e) => { setFieldValue('designTeam', true) }} />
                                                                <label>{Resources['yes'][currentLanguage]}</label>
                                                            </div>
                                                            <div className="ui checkbox radio radioBoxBlue checked">
                                                                <input type="radio" checked={values.designTeam === false} name="designTeam" value={values.designTeam} onChange={(e) => { setFieldValue('designTeam', false) }} />
                                                                <label> {Resources['no'][currentLanguage]}</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="proForm fullLinearInput">
                                                        <div className="linebylineInput">
                                                            <label data-toggle="tooltip" title={Resources['isTaskAdmin'][currentLanguage]} className="control-label"> {Resources['isTaskAdmin'][currentLanguage]} </label>
                                                            <div className="ui checkbox radio radioBoxBlue">
                                                                <input type="radio" name="TaskAdmin" checked={values.isTaskAdmin === true} value={values.isTaskAdmin} onChange={(e) => { setFieldValue('isTaskAdmin', true) }} />
                                                                <label>{Resources['yes'][currentLanguage]}</label>
                                                            </div>
                                                            <div className="ui checkbox radio radioBoxBlue checked">
                                                                <input type="radio" name="TaskAdmin" checked={values.isTaskAdmin === false} value={values.isTaskAdmin} onChange={(e) => { setFieldValue('isTaskAdmin', false) }} />
                                                                <label> {Resources['no'][currentLanguage]}</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="proForm fullLinearInput">
                                                        <div className="linebylineInput">
                                                            <label data-toggle="tooltip" title={Resources['usePermissionsOnLogs'][currentLanguage]} className="control-label"> {Resources['usePermissionsOnLogs'][currentLanguage]} </label>
                                                            <div className="ui checkbox radio radioBoxBlue">
                                                                <input type="radio" name="usePermissionsOnLogs" checked={values.usePermissionsOnLogs === true} value={values.usePermissionsOnLogs} onChange={(e) => { setFieldValue('usePermissionsOnLogs', true) }} />
                                                                <label>{Resources['yes'][currentLanguage]}</label>
                                                            </div>
                                                            <div className="ui checkbox radio radioBoxBlue ">
                                                                <input type="radio" name="usePermissionsOnLogs" checked={values.usePermissionsOnLogs === false} value={values.usePermissionsOnLogs} onChange={(e) => { setFieldValue('usePermissionsOnLogs', false) }} />
                                                                <label> {Resources['no'][currentLanguage]}</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="workingHours__cycle fullWidthWrapper textLeft">
                                                    <header>
                                                        <h3 className="zero">Working hours & days</h3>
                                                    </header>
                                                    <div className="workingHours__cycle--inputs">
                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources['workHours'][currentLanguage]} </label>
                                                            <div className={'ui input inputDev ' + (errors.defaultHours && touched.defaultHours ? 'has-error' : null) + ' '}>
                                                                <input name='defaultHours'
                                                                    className="form-control"
                                                                    id="defaultHours"
                                                                    placeholder={Resources['workHours'][currentLanguage]} autoComplete='off'
                                                                    value={values.defaultHours}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur} />
                                                                {errors.defaultHours && touched.defaultHours ? (<em className="pError">{errors.defaultHours}</em>) : null}
                                                            </div>
                                                        </div>
                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources['hoursRate'][currentLanguage]} </label>
                                                            <div className='ui input inputDev '>
                                                                <input name='userRate'
                                                                    className="form-control"
                                                                    id="userRate"
                                                                    placeholder={Resources['hoursRate'][currentLanguage]} autoComplete='off'
                                                                    value={values.userRate}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {this.state.isLoading === false ?
                                                    <div className="dropBtn dropBtnLeft fullWidthWrapper">
                                                        <button className="primaryBtn-1 btn" type="submit">
                                                            {Resources['save'][currentLanguage]}</button>
                                                    </div> : <button className="primaryBtn-1 btn disabled">
                                                        <div className="spinner">
                                                            <div className="bounce1" />
                                                            <div className="bounce2" />
                                                            <div className="bounce3" />
                                                        </div>
                                                    </button>}
                                            </Form>
                                        )}
                                    </Formik>
                                </div>
                            </div >
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}
export default EditAccount;
