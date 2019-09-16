import React, { Component, Fragment } from 'react'
import Api from '../../api'
import config from "../../Services/Config";
import { toast } from "react-toastify";
import LoadingSection from "../publicComponants/LoadingSection";
import Resources from '../../resources.json';
import eyepw from '../../Styles/images/eyepw.svg';
import { Formik, Form } from "formik";
import * as Yup from "yup";
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required(Resources['currentPasswordRequired'][currentLanguage]),
    newPassword: Yup.string().required(Resources['newPasswordRequired'][currentLanguage]),
    confirmPassword: Yup.string().required('Please enter the same value again.')
        .oneOf([Yup.ref('newPassword'), null], 'Please enter the same value again.')
})

class PrivacySetting extends Component {

    constructor(props) {
        super(props)

        if (Api.IsAuthorized() === false) {
            this.props.history.push({ pathname: "/" });
        }
        this.state = {
            userName: '',
            companyId: config.getPublicConfiguartion().accountCompanyId,
            typeConfimPassword: false,
            typeCurrentPassword: false,
            typeNewPassword: false,
            isLoading: false,
            btnLoading: false,
        }
    }

    toggletypeCurrentPassword = () => {
        this.setState({ typeCurrentPassword: !this.state.typeCurrentPassword });
    }

    toggleNewPassword = () => {
        this.setState({ typeNewPassword: !this.state.typeNewPassword });
    }

    toggleConfimPassword = () => {
        this.setState({ typeConfimPassword: !this.state.typeConfimPassword })
    }

    currentPasswordHandleBlur = (e) => {
        this.setState({ isLoading: true });
        Api.getPassword('GetPassWordEncrypt', e.target.value).then(result => {
            if (result === true) {
                this.setState({ currentPassword: e.target.value });
            }
            else {
                this.setState({ currentPassword: '' });
                toast.success(Resources["invalidPassword"][currentLanguage]);
            }
            this.setState({ isLoading: false });
        }).catch(ex => {
            this.setState({ isLoading: false });
        });
    }

    componentDidMount = () => {
        Api.get('GetAccountInfo').then(result => {
            this.setState({ userName: result.userName });
        })
    }

    update(values) {
        this.setState({ isLoading: true, btnLoading: true });
        Api.authorizationApi('ProcoorAuthorization?username=' + this.state.userName + '&emailOrPassword='
            + values.confirmPassword + '&companyId=' + this.state.companyId
            + '&changePassword=' + true, null, 'PUT').then(
                result => { 
                    if (result.msg === "Successfuly created account.")
                        Api.getPassword('EditAccountUserPassword', values.confirmPassword).then(
                            result => {
                                values.newPassword = '';
                                values.confirmPassword = '';
                                values.newPassword = '';
                                this.setState({
                                    currentPassword: '',
                                    isLoading: false,
                                    btnLoading: false,
                                });
                                toast.success(Resources["operationSuccess"][currentLanguage]);
                            });
                });
    }

    render() {

        return (

            <div className="mainContainer white-bg">

                <div className="noTabs__document">
                    <div className="doc-container  ">
                        <div className="step-content">
                            <div className="document-fields ">


                                {this.state.isLoading === false ? null : <LoadingSection />}
                                <Formik
                                    enableReinitialize={true}
                                    initialValues={{
                                        currentPassword: this.state.currentPassword,
                                        newPassword: '',
                                        confirmPassword: ''
                                    }}
                                    validationSchema={validationSchema}
                                    onSubmit={(values) => { this.update(values); }}>
                                    {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
                                        <Form id="signupForm1" className="proForm datepickerContainer" noValidate="novalidate" onSubmit={handleSubmit}>

                                            <div className="approvalTitle" style={{ width: ' 100 %', justifyContent: 'flex-start' }}>
                                                <h3>{Resources['security'][currentLanguage] + '- ' + Resources['profile'][currentLanguage]}</h3>
                                            </div>
                                            <div className="loadingWrapper" style={{ width: '100%' }}>
                                                <div className="inputPassContainer" style={{ margin: '25px 0' }}>
                                                    <div className=" passwordInputs showPasswordArea flexForm">
                                                        <label className="control-label" style={{ marginLeft: '0' }}>{Resources['accountUserName'][currentLanguage]} </label>
                                                        <div className="inputPassContainer">
                                                            <label className="control-label">{this.state.userName}</label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="linebylineInput fullInputWidth letterFullWidth showPasswordArea">
                                                    <label className="control-label">{Resources['currentPassword'][currentLanguage]}</label>
                                                    <div className={'ui input inputDev ' + (errors.currentPassword && touched.currentPassword ? 'has-error' : ' ') + ' '}>
                                                        <span className={this.state.typeCurrentPassword ? "inputsideNote togglePW activePW" : "inputsideNote togglePW"} onClick={this.toggletypeCurrentPassword}>
                                                            <img src={eyepw} />
                                                            <span className="show"> Show</span>
                                                            <span className="hide"> Hide</span>
                                                        </span>

                                                        <input name="currentPassword" type={this.state.typeCurrentPassword ? 'text' : 'password'}
                                                            value={this.state.currentPassword} className="form-control" id="currentPassword"
                                                            placeholder={Resources['currentPassword'][currentLanguage]} autoComplete='off'
                                                            value={this.state.currentPassword}
                                                            onBlur={(e) => {
                                                                handleBlur(e)
                                                                this.currentPasswordHandleBlur(e)

                                                            }} onChange={(e) => {
                                                                handleChange(e)
                                                                this.setState({ currentPassword: e.target.value })

                                                            }} />
                                                        {errors.currentPassword && touched.currentPassword ? (
                                                            <span className="glyphicon glyphicon-remove form-control-feedback spanError"></span>
                                                        ) : null}
                                                        {errors.currentPassword && touched.currentPassword ? (
                                                            <em className="pError">{errors.currentPassword}</em>
                                                        ) : null}
                                                    </div>
                                                </div>

                                                <div className="linebylineInput fullInputWidth letterFullWidth showPasswordArea">
                                                    <label className="control-label">{Resources['newPassword'][currentLanguage]}</label>
                                                    <div className={errors.newPassword && touched.newPassword ? ("ui input inputDev has-error") : "ui input inputDev"}>
                                                        <span className={this.state.typeNewPassword ? "inputsideNote togglePW activePW" : "inputsideNote togglePW"} onClick={this.toggleNewPassword}>
                                                            <img src={eyepw} />
                                                            <span className="show"> Show</span>
                                                            <span className="hide"> Hide</span>
                                                        </span>
                                                        <input name="newPassword" type={this.state.typeNewPassword ? 'text' : 'password'}
                                                            className="form-control" id="newPassword" placeholder={Resources['newPassword'][currentLanguage]}
                                                            autoComplete='off' value={values.newPassword}
                                                            onBlur={handleBlur} onChange={handleChange} />

                                                        {errors.newPassword && touched.newPassword ? (
                                                            <span className="glyphicon glyphicon-remove form-control-feedback spanError"></span>
                                                        ) : null}
                                                        {errors.newPassword && touched.newPassword ? (
                                                            <em className="pError">{errors.newPassword}</em>
                                                        ) : null}
                                                    </div>
                                                </div>


                                                <div className="linebylineInput fullInputWidth letterFullWidth showPasswordArea">
                                                    <label className="control-label">{Resources['confirmPassword'][currentLanguage]}</label>
                                                    <div className={errors.confirmPassword && touched.confirmPassword ? ("ui input inputDev has-error") : "ui input inputDev"}>
                                                        <span className={this.state.typeConfimPassword ? "inputsideNote togglePW activePW" : "inputsideNote togglePW"} onClick={this.toggleconfirmPassword}>
                                                            <img src={eyepw} />
                                                            <span className="show"> Show</span>
                                                            <span className="hide"> Hide</span>
                                                        </span>
                                                        <input name="confirmPassword" type={this.state.typeConfimPassword ? 'text' : 'password'}
                                                            className="form-control" id="confirmPassword" placeholder={Resources['confirmPassword'][currentLanguage]}
                                                            autoComplete='off' value={values.confirmPassword}
                                                            onBlur={handleBlur} onChange={handleChange} />

                                                        {errors.confirmPassword && touched.confirmPassword ? (
                                                            <span className="glyphicon glyphicon-remove form-control-feedback spanError"></span>
                                                        ) : null}
                                                        {errors.confirmPassword && touched.confirmPassword ? (
                                                            <em className="pError">{errors.confirmPassword}</em>
                                                        ) : null}
                                                    </div>
                                                </div>


                                                <div className="fullWidthWrapper">
                                                    {this.state.btnLoading === false ? (
                                                        <button className="primaryBtn-1 btn largeBtn" type="submit">{Resources["update"][currentLanguage]} </button>
                                                    ) :
                                                        (
                                                            <button className="primaryBtn-1 btn largeBtn disabled">
                                                                <div className="spinner">
                                                                    <div className="bounce1" />
                                                                    <div className="bounce2" />
                                                                    <div className="bounce3" />
                                                                </div>
                                                            </button>
                                                        )}

                                                </div>

                                            </div>
                                        </Form>
                                    )}
                                </Formik>


                            </div>
                        </div>
                    </div>
                </div>

            </div >
        )
    }
}
export default PrivacySetting;