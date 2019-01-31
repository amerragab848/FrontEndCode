import React, { Component } from 'react';
import { Formik, Form } from 'formik';
import Api from '../../api';
import eyeShow from "../../Styles/images/eyepw.svg"
import Dropdown from "./DropdownMelcous";
import Resources from '../../resources.json';
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

class wfApproval extends Component {
    constructor(props) {

        super(props)
        this.state = {
            docApprovalId: 431,
            data: [],
            type: false,
            approveData: [],
            password: '',
            passwordStatus: false,

            sendingData: {
                approvalStatus: true,
                docId: 1114,
                contacts: [],
                comment: '',
                currentArrange: 2,
                accountDocId: 431,
                docTypeId: 28
            }
        }

    }
    toggle = () => {
        const currentType = this.state.type;
        this.setState({ type: !currentType })


    }
    componentDidMount = () => {
        let url = "GetWorkFlowItemsByWorkFlowIdLevelType?docApprovalId=" + this.state.docApprovalId + '&approvalStatus=' + this.state.sendingData.approvalStatus
        let tempData = []
        Api.get(url).then(result => {
            result.forEach(element => {
                tempData.push({ label: element['contactName'], value: element['contactId'] })
            });
            this.setState({
                data: result,
                approveData: tempData
            });
        }).catch(ex => {
        });
    }

    passwordHandleChange = (e) => {
        Api.getPassword('GetPassWordEncrypt', e.target.value).then(result => {
            this.setState({
                passwordStatus: result
            });
        }).catch(ex => {
            throw ex
        });
    }
    commentOnBlurHandler = (e) => {

        this.setState({
            sendingData: { ...this.state.sendingData, comment: e.target.value }
        })
    }
    selectHandleChange = (e) => {
        let contactId = []
        e.forEach(element => {
            contactId.push(element.value)
        })
        this.setState({
            sendingData: { ...this.state.sendingData, contacts: contactId },
        })
    }

    validatePassword(value) {
        let error;
        if (!value) {
            error = 'Required';
        }
        return error;
    }

    render() {
        return (
            <div>
                <Formik
                    initialValues={{
                        password: '',

                    }}
                    validate={values => {
                        const errors = {};
                        if (values.password.length == 0) {
                            errors.password = Resources['passwordRequired'][currentLanguage];

                        }
                        return errors;
                    }}
                    onSubmit={values => {
                        if (this.state.passwordStatus) {
                            Api.post("SendWorkFlowApproval", this.state.sendingData);
                        }
                        else
                            alert("invalid Password")
                    }}

                >
                    {({ errors, touched, handleBlur, handleChange }) => (
                        <Form id="signupForm1" className="proForm" noValidate="novalidate">
                            <div className="approvalDocument">
                                <div className="approvalWrapper">
                                    <div className="approvalTitle">
                                        <h3>Document Approval</h3>
                                    </div>
                                    <div className="inputPassContainer">

                                        <div className="form-group passwordInputs showPasswordArea">
                                            <label className="control-label">Password *</label>
                                            <div className="inputPassContainer">
                                                <div className={errors.password && touched.password ? (
                                                    "ui input inputDev has-error"
                                                ) : !errors.password && touched.password ? (
                                                    "ui input inputDev has-success"
                                                ) : "ui input inputDev"}
                                                >
                                                    <input name="password" type="text"
                                                        className="form-control" id="password" placeholder='password' autoComplete='off'
                                                        onBlur={(e) => {
                                                            this.passwordHandleChange(e)
                                                            handleBlur(e)
                                                        }} onChange={handleChange} />

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

                                    <div className="textarea-group">
                                        <label>Comment</label>
                                        <textarea className="form-control" onBlur={e => this.commentOnBlurHandler(e)}></textarea>
                                    </div>

                                    <div className="fullWidthWrapper textLeft">
                                        <Dropdown title="approveTo" data={this.state.approveData}
                                            handleChange={this.selectHandleChange}
                                            index='approve' isMulti='true' />

                                    </div>
                                    <div className="fullWidthWrapper">
                                        <button className="primaryBtn-1 btn largeBtn" type="submit">Save</button>
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
export default wfApproval