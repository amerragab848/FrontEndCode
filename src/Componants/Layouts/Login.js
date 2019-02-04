import React, { Component } from "react";
import Api from "../../api";
import tokenStore from '../../tokenStore'
import language from "../../resources.json";
import config from "../../IP_Configrations.json";
import CryptoJS from 'crypto-js';
import cookie from 'react-cookies'
import platform from 'platform'
import eyeShow from "../../Styles/images/eyepw.svg"
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

let currentLanguage =
    localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const validationSchema = Yup.object().shape({
    userName: Yup.string().required(language['userNameRequired'][currentLanguage]),
    password: Yup.string().required(language['passwordRequired'][currentLanguage]),
})



class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: false
        }
    }

    loginHandler = (input) => {
        let companyId = config["accountCompanyId"]
        let loginServer = config["loginServer"]
        let url = '/token'
        let param = 'grant_type=password&username=' + input.userName + '&password=' + input.password + '&companyId=' + companyId
        Api.Login(loginServer, url, param).then(Response => {
            if (Response === 400)
                alert("invalid_clientEmail")
            else {
                let token = Response.access_token
                tokenStore.setItem('userToken', 'Bearer ' + token)
                let payLoad = {}
                Api.get('LoginSuccess').then(result => {
                    if (result) {
                        payLoad.acn = result.acn

                        payLoad.aoi = result.aoi
                        payLoad.cmi = result.cmi
                        payLoad.cni = result.cni
                        payLoad.emp = result.emp
                        payLoad.gri = result.gri
                        payLoad.ihr = result.ihr
                        payLoad.iss = result.iss
                        payLoad.spi = result.spi
                        payLoad.sub = result.sub
                        payLoad.ulp = result.ulp
                        payLoad.uty = result.uty

                    }
                    let _payLoad = CryptoJS.enc.Utf8.parse(JSON.stringify(payLoad))
                    let encodedPaylod = CryptoJS.enc.Base64.stringify(_payLoad)
                    tokenStore.setItem('claims', encodedPaylod)
                    let cookieName = cookie.loadAll()
                    let size = {}

                    if (config.canSendAlert) {
                        size.height = window.innerHeight + 'px'
                        size.width = window.innerWidth + 'px'
                        console.log("browserName", platform.name)
                        console.log("browserversion", platform.version)
                        console.log("browserproduct", size)
                        console.log("os", platform.os)

                        console.log("description", platform.description)

                    }

                })
            }
        })

    }



    toggle = () => {
        const currentType = this.state.type;
        this.setState({ type: !currentType })


    }
    render() {
        return (
            <div className=" loginWrapper">
                <div className="loginForm">
                    <h3>login</h3>

                    <Formik
                        initialValues={{
                            password: '',
                            userName: ''

                        }}
                        validationSchema={validationSchema}
                        onSubmit={values => {
                            this.loginHandler(values)
                        }}

                    >
                        {({ errors, touched, handleBlur, handleChange }) => (
                            <Form id="signupForm1" className="proForm" noValidate="novalidate">
                                <div className="form-group ">
                                    <div className="inputDev ui input">
                                        <div className={errors.userName && touched.userName ? (
                                            "ui input inputDev has-error"
                                        ) : !errors.userName && touched.userName ? (
                                            "ui input inputDev has-success"
                                        ) : "ui input inputDev"}
                                        >
                                            <input autoComplete="off" type="text" className="form-control" id="userName"
                                                name="userName" placeholder="Username"
                                                onBlur={handleBlur} onChange={handleChange} />
                                            {errors.userName && touched.userName ? (
                                                <span className="glyphicon glyphicon-remove form-control-feedback spanError"></span>
                                            ) : !errors.userName && touched.userName ? (
                                                <span className="glyphicon form-control-feedback glyphicon-ok"></span>
                                            ) : null}
                                            {errors.userName && touched.userName ? (
                                                <em className="pError">{errors.userName}</em>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group passwordInputs showPasswordArea">
                                    <div className="inputPassContainer">
                                        <div className="inputDev ui input">
                                            <span className={this.state.type ? "inputsideNote togglePW active-pw" : "inputsideNote togglePW "} onClick={this.toggle}>
                                                <img src={eyeShow} />
                                                <span className="show"> Show</span>
                                                <span className="hide"> Hide</span>
                                            </span>
                                            <div className="inputDev ui input">
                                                <div className={errors.password && touched.password ? (
                                                    "ui input inputDev has-error"
                                                ) : !errors.password && touched.password ? (
                                                    "ui input inputDev has-success"
                                                ) : "ui input inputDev"}
                                                >
                                                    <input autoComplete="off" type={this.state.type ? 'text' : 'password'} className="form-control" name="password"
                                                        onBlur={handleBlur} onChange={handleChange} placeholder="Password" />
                                                    {errors.password && touched.password ? (
                                                        <span className="glyphicon glyphicon-remove form-control-feedback spanError"></span>
                                                    ) : !errors.password && touched.password ? (
                                                        <span className="glyphicon form-control-feedback glyphicon-ok"></span>
                                                    ) : null}
                                                    {errors.password && touched.password ? (
                                                        <em className="pError">{errors.password}</em>
                                                    ) : null}
                                                </div>
                                            </div>


                                        </div>
                                    </div>
                                </div>





                                <button className="primaryBtn-1 btn" type='submit'>{language['logIn'][currentLanguage]}</button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>


        );
    }
}
export default Login