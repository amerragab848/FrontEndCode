import React, { Component, Fragment } from 'react'
import Api from '../../api' 
import config from "../../Services/Config";

import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import Resources from '../../resources.json';
import { Formik, Form } from 'formik';
import { AlertError } from 'material-ui/svg-icons';
import eyepw from '../../Styles/images/eyepw.svg';
import NotifiMsg from '../publicComponants/NotifiMsg'
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

let showDeiv = "popUp basic-popUp disNone";

class PrivacySetting extends Component {
    constructor(props) {

        super(props)
        console.log(config);
        this.state = {
            ConfimPassword: '',
            currentPassword: '',
            passwordStatus: false,
            newPassword: '',
            userName: '',
            emailOrPassword: '',
            companyId: '2',
            changePassword: false,
            typeConfimPassword: false,
            typeCurrentPassword: false,
            typeNewPassword: false,
            isChechingPassword: false,
            statusClass: "disNone",
            statusClassSuccess:'disNone',
            confirmPasswordSpan: "",
            confirmPasswordError: "pError disNone",
            boxError: "ui input inputDev",
            isLoading: false
        }
    }

    toggletypeCurrentPassword = () => {
        const typeCurrentPassword = this.state.typeCurrentPassword
        this.setState({
            typeCurrentPassword: !typeCurrentPassword
        })

    }

    toggleNewPassword = () => {
        const typeNewPassword = this.state.typeNewPassword

        this.setState({
            typeNewPassword: !typeNewPassword
        })

    }
    toggleConfimPassword = () => {
        const typeConfimPassword = this.state.typeConfimPassword
        this.setState({
            typeConfimPassword: !typeConfimPassword
        })

    }

    confirmPasswordHandleBlur = (e) => {

        this.setState({
            ConfimPassword: e.target.value
        })


        if (this.state.newPassword !== e.target.value) {
            this.setState({
                confirmPasswordSpan: "glyphicon glyphicon-remove form-control-feedback spanError",
                confirmPasswordError: "pError",
                boxError: "ui input inputDev has-error"
            })

        } else {
            this.setState({
                confirmPasswordSpan: "glyphicon form-control-feedback glyphicon-ok",
                confirmPasswordError: "pError disNone",
                boxError: "ui input inputDev"
            })
        }
    }

    newPasswordHandleChange = (e) => {
        this.setState({
            newPassword: (e.target.value)
        });
    }


    currentPasswordHandleBlur = (e) => {

        this.setState({
            isChechingPassword: true
        });
        Api.getPassword('GetPassWordEncrypt', e.target.value).then(result => {


            if (result === false) {
                setTimeout(() => {
                    this.setState({
                        changePassword: result,
                        isChechingPassword: false,
                        statusClass: "animationBlock"
                    })
                }, 1000);
                setTimeout(() => {
                    this.setState({ 
                        statusClass: "disNone"
                    })
                }, 5000);
 
            }
            else if (result === true) {

                this.setState({
                    changePassword: result,
                    isChechingPassword: false,
                    statusClass: "disNone"
                });

            }

        }).catch(ex => {
            this.setState({
                isChechingPassword: false
            });
        });


    }

    componentDidMount = () => {
        Api.get('GetAccountInfo').then(result => {
            this.setState({
                userName: result.userName
            })
        })

    }

    render() {
   
        return (

            <div className="mainContainer">
                <Formik
                    initialValues={{
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''}}
                    
                    validate={values => {
                        let errors = {};
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

                    onSubmit={(values, actions ) => {
                        if (this.state.changePassword === true) {
                            this.setState({
                                isLoading: true
                            })
                            setTimeout((e) => {
                                Api.authorizationApi('ProcoorAuthorization?username=' + this.state.userName + '&emailOrPassword=' + this.state.newPassword + '&companyId='+ this.state.companyId +'&changePassword=' + this.state.changePassword + '').then(
                                    Api.getPassword('EditAccountUserPassword', this.state.newPassword)
                                    , 
                                    this.setState({
                                        isLoading: false,
                                        statusClassSuccess:"animationBlock"
                                    }), actions.setSubmitting(false)
                                )
                            }, 2000)
                            this.setState({
                                statusClassSuccess:"disNone"
                            })
                        }
                        else
                            alert("invalid Password")
                      }
                    }
                >
                    {({ errors, touched, handleBlur, handleChange , handleSubmit }) => (
                        <Form id="signupForm1" className="proForm" noValidate="novalidate" onSubmit={handleSubmit} >

                            <div className="resetPassword">

                           
                                
                                    <NotifiMsg statusClass={this.state.statusClass} IsSuccess="false" Msg={Resources['currentPasswordRequired'][currentLanguage]} />
                                    <NotifiMsg statusClass={this.state.statusClassSuccess} IsSuccess="true" Msg={Resources['successAlert'][currentLanguage]} />


                                <div className="approvalTitle">
                                    <h3>{Resources['security'][currentLanguage] + '- ' + Resources['profile'][currentLanguage]}</h3>
                                </div>
                                <div className="loadingWrapper">

                                    {this.state.isChechingPassword ?
                                       <LoadingSection />
                                        : null
                                    }

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
                                                ) : "ui input inputDev"}
                                                >
                                                    <span className={this.state.typeCurrentPassword ? "inputsideNote togglePW activePW" : "inputsideNote togglePW"} onClick={this.toggletypeCurrentPassword}>
                                                        <img src={eyepw} />
                                                        <span className="show"> Show</span>
                                                        <span className="hide"> Hide</span>
                                                    </span>
                                                    <input name="currentPassword" type={this.state.typeCurrentPassword ? 'text' : 'password'}
                                                        className="form-control" id="currentPassword" placeholder={Resources['currentPassword'][currentLanguage]} autoComplete='off'
                                                        onBlur={(e) => {
                                                            this.currentPasswordHandleBlur(e)
                                                            handleBlur(e)
                                                        }} onChange={handleChange} />

                                                    {errors.currentPassword && touched.currentPassword ? (
                                                        <span className="glyphicon glyphicon-remove form-control-feedback spanError"></span>
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
                                                ) : "ui input inputDev"}
                                                >
                                                    <span className={this.state.typeNewPassword ? "inputsideNote togglePW activePW" : "inputsideNote togglePW"} onClick={this.toggleNewPassword}>
                                                        <img src={eyepw} />
                                                        <span className="show"> Show</span>
                                                        <span className="hide"> Hide</span>
                                                    </span>
                                                    <input name="newPassword" type={this.state.typeNewPassword ? 'text' : 'password'}
                                                        className="form-control" id="newPassword" placeholder={Resources['newPassword'][currentLanguage]} autoComplete='off'
                                                        onBlur={(e) => {
                                                            this.newPasswordHandleChange(e)
                                                            handleBlur(e)
                                                        }} onChange={handleChange} />

                                                    {errors.newPassword && touched.newPassword ? (
                                                        <span className="glyphicon glyphicon-remove form-control-feedback spanError"></span>
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
                                                ) : this.state.boxError}
                                                >
                                                    <span className={this.state.typeConfimPassword ? "inputsideNote togglePW activePW" : "inputsideNote togglePW"} onClick={this.toggleConfimPassword}>
                                                        <img src={eyepw} />
                                                        <span className="show"> Show</span>
                                                        <span className="hide"> Hide</span>
                                                    </span>
                                                    <input name="confirmPassword" type={this.state.typeConfimPassword ? 'text' : 'password'}
                                                        className="form-control" id="confirmPassword" placeholder={Resources['confirmPassword'][currentLanguage]} autoComplete='off'
                                                        onBlur={(e) => {

                                                            handleBlur(e)
                                                            this.confirmPasswordHandleBlur(e)
                                                        }} onChange={handleChange} />
                                                    <span className={this.state.confirmPasswordSpan}></span>
                                                    <em className={this.state.confirmPasswordError}>{Resources['ConfirmpasswordRequired'][currentLanguage]}</em>
                                                </div>
                                            </div>
                                        </div>

                                    </div>


                                    <div className="fullWidthWrapper">
                                        {this.state.isLoading === false ? (
                                          
                                            <button 
                                                className="primaryBtn-1 btn largeBtn"
                                                type="submit"   >
                                              
                                                 {Resources["update"][currentLanguage]}
                                            </button>
                                            
                                        ) : 
                                            (
                                                <button className="primaryBtn-1 btn largeBtn" 
                                                // type="reset"
                                                // value="Reset"
                                                // onChange={this.handleReset}
                                                >

                                                    <div className="spinner">
                                                        <div className="bounce1" />
                                                        <div className="bounce2" />
                                                        <div className="bounce3" />
                                                    </div>
                                                </button>
                                            )}

                                    </div>
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