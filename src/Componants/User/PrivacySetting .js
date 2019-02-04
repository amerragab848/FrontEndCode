import React, { Component } from 'react'
import Api from '../../api'
//import Dropdown from "./DropdownMelcous";
//import InputMelcous from './InputMelcous'
import Resources from '../../resources.json';
import { Formik, Form } from 'formik';
import { AlertError } from 'material-ui/svg-icons';
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');



class PrivacySetting extends Component {
    constructor(props) {

        super(props)
        this.state = {
            passwordStatus: false,
            newPassword:'' ,
             userName:'', 
             emailOrPassword:'',
             companyId:'',
             changePassword:false,
        }
    }

    confirmPasswordHandleBlur = (e) => {
       
        if(this.state.newPassword !==e.target.value)   
        {
            alert("password not reight")
        }
      
    }

    newPasswordHandleChange = (e) => {
        this.setState({
            newPassword:( e.target.value)
        });
    }

    currentPasswordHandleBlur = (e) => {
        Api.getPassword('GetPassWordEncrypt', e.target.value).then(result => {
            this.setState({
                changePassword: result
            });
            
        }).catch(ex => {
            throw ex
        });

        if(this.state.passwordStatus === false) 
        {
            alert("invalid Password")
        }         
    }

    componentDidMount = () => {
        Api.get('GetAccountInfo').then(result => {
            this.setState({
                userName: result.userName , companyId: result.companyId
            })
        })
    
    }


    render() {
        return (

            <div className="mainContainer">
                <Formik
                    initialValues={{
                        currentPassword: '',
                        newPassword : '',
                        confirmPassword : '',
                    }}
                    validate={values => {
                        const errors = {};
                        if (values.currentPassword.length == 0) {
                            errors.currentPassword = Resources['currentPasswordRequired'][currentLanguage];
                        }
                        if (values.newPassword.length == 0) {
                            errors.newPassword = Resources['newPasswordRequired'][currentLanguage];
                        }
                        if (values.confirmPassword.length == 0) {
                            errors.confirmPassword = Resources['ConfirmpasswordRequired'][currentLanguage];
                        }

                        return errors;
                    }}
              
                    onSubmit={values => {
                        if (this.state.passwordStatus) {
                         Api.post("ProcoorAuthorization?userName=`${this.state.userName}`&emailOrPassword=`${this.state.newPassword}`&companyId=`${this.state.companyId}`&changePassword=`${this.state.changePassword}` ",);
                        }
                        else
                            alert("invalid Password11")
                    }}

                >
                    {({ errors, touched, handleBlur, handleChange }) => (
                        <Form id="signupForm1" className="proForm" noValidate="novalidate">
                            <div className="resetPassword">
                                <div className="approvalTitle">
                                    <h3>{Resources['security'][currentLanguage]+'- '+Resources['profile'][currentLanguage]}</h3>
                                </div>

                                <div className="inputPassContainer">
                                    <div className="form-group passwordInputs showPasswordArea flexForm">
                                        <label className="control-label">{Resources['accountUserName'][currentLanguage]} </label>
                                        <div className="inputPassContainer">
                                        <label className="control-label">{this.state.userName}</label>
                                         </div>
                                    </div>

                                </div>




                                <div className="inputPassContainer">
                                    <div className="form-group passwordInputs showPasswordArea flexForm">
                                        <label className="control-label">{Resources['currentPassword'][currentLanguage]} </label>
                                        <div className="inputPassContainer">
                                            <div className={errors.currentPassword && touched.currentPassword ? (
                                                "ui input inputDev has-error"
                                            ) : !errors.currentPassword && touched.currentPassword ? (
                                                "ui input inputDev has-success"
                                            ) : "ui input inputDev"}
                                            >
                                                <input name="currentPassword" type="text"
                                                    className="form-control" id="currentPassword" placeholder={Resources['currentPassword'][currentLanguage]} autoComplete='off'
                                                    onBlur={(e) => {
                                                        //this.currentPasswordHandleChange(e)
                                                        this.currentPasswordHandleBlur(e)
                                                    }} onChange={handleChange} />

                                                {errors.currentPassword && touched.currentPassword ? (
                                                    <span className="glyphicon glyphicon-remove form-control-feedback spanError"></span>
                                                ) : !errors.currentPassword && touched.currentPassword ? (
                                                    <span className="glyphicon form-control-feedback glyphicon-ok"></span>
                                                ) : null}
                                                {errors.currentPassword && touched.currentPassword ? (
                                                    <em className="pError">{errors.currentPassword}</em>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>

                                </div>


                                <div className="inputPassContainer">
                                    <div className="form-group passwordInputs showPasswordArea flexForm">
                                        <label className="control-label">{Resources['newPassword'][currentLanguage]} </label>
                                        <div className="inputPassContainer">
                                            <div className={errors.newPassword && touched.newPassword ? (
                                                "ui input inputDev has-error"
                                            ) : !errors.newPassword && touched.newPassword ? (
                                                "ui input inputDev has-success"
                                            ) : "ui input inputDev"}
                                            >
                                                <input name="newPassword" type="text"
                                                    className="form-control" id="newPassword" placeholder={Resources['newPassword'][currentLanguage]} autoComplete='off'
                                                    onBlur={(e) => {
                                                        this.newPasswordHandleChange(e)
                                                        //this.newPasswordHandleBlur(e)
                                                    }} onChange={handleChange} />

                                                {errors.newPassword && touched.newPassword ? (
                                                    <span className="glyphicon glyphicon-remove form-control-feedback spanError"></span>
                                                ) : !errors.newPassword && touched.newPassword ? (
                                                    <span className="glyphicon form-control-feedback glyphicon-ok"></span>
                                                ) : null}
                                                {errors.newPassword && touched.newPassword ? (
                                                    <em className="pError">{errors.newPassword}</em>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>

                                </div>


                                <div className="inputPassContainer">
                                    <div className="form-group passwordInputs showPasswordArea flexForm">
                                        <label className="control-label">{Resources['confirmPassword'][currentLanguage]} </label>
                                        <div className="inputPassContainer">
                                            <div className={errors.confirmPassword && touched.confirmPassword ? (
                                                "ui input inputDev has-error"
                                            ) : !errors.confirmPassword && touched.confirmPassword ? (
                                                "ui input inputDev has-success"
                                            ) : "ui input inputDev"}
                                            >
                                                <input name="confirmPassword" type="text"
                                                    className="form-control" id="confirmPassword" placeholder={Resources['confirmPassword'][currentLanguage]} autoComplete='off'
                                                    onBlur={(e) => {
                                                        //this.confirmPasswordHandleChange(e)
                                                        this.confirmPasswordHandleBlur(e)
                                                    }} onChange={handleChange} />

                                                {errors.confirmPassword && touched.confirmPassword ? (
                                                    <span className="glyphicon glyphicon-remove form-control-feedback spanError"></span>
                                                ) : !errors.confirmPassword && touched.confirmPassword ? (
                                                    <span className="glyphicon form-control-feedback glyphicon-ok"></span>
                                                ) : null}
                                                {errors.confirmPassword && touched.confirmPassword ? (
                                                    <em className="pError">{errors.confirmPassword}</em>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                               <div className="fullWidthWrapper">
                                    <button className="primaryBtn-1 btn largeBtn" type="submit">{Resources['update'][currentLanguage]}</button>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>


        )
    }
}
export default PrivacySetting;