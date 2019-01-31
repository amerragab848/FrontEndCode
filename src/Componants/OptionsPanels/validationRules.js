import React, { Component, Fragment } from "react";
import { FormValidation } from "calidation";
import Api from '../../api';
import eyeShow from "../../Styles/images/eyepw.svg"
import Dropdown from "./DropdownMelcous";
import { Formik, Form,Field } from 'formik';
import * as Yup from 'yup';
const SignupSchema = Yup.object().shape({
    password: Yup.string().min(8, 'Incorrect user, please choose another one').max(50, 'Incorrect user, please choose another one').required('Required'),

});


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
            sendingData: { ...this.state.sendingData, contacts: contactId }
        })
    }


    onSubmit = () => {

        // This is where we'd handle our submission...
        // `fields` is an object, { field: value }

        //   e.preventDefault();
        //   console.log(this.state.sendingData)
        //   console.log(this.state.passwordStatus)
        //   if (this.state.passwordStatus) {
        //       Api.post("SendWorkFlowApproval", this.state.sendingData);
        //   }

    };

    render() {



        return (
            <div>
            <Formik
                initialValues={{
                    password: ''
                }}
                validationSchema={SignupSchema}
                onSubmit={values => {
                    // same shape as initial values
                    console.log(values);
                }}
            >
                {({ errors, touched }) => (
                    <Form id="signupForm1" method="post" className="proForm" action="" noValidate="novalidate">

                        <div className="approvalDocument">
                            <div className="approvalWrapper">
                                <div className="approvalTitle">
                                    <h3>Document Approval</h3>
                                </div>
                                    <div className="form-group passwordInputs showPasswordArea">
                                        <label className="control-label">Password *</label>
                                        <div className="inputPassContainer">
                                            
                                            
                                            
                                            
                                            
                                            
                                            
                                            
                                            
                                            
                                            <div className={errors.password && touched.password ? (
                                                "ui input inputDev has-error"
                                            ) : !errors.password && touched.password ? (
                                                "ui input inputDev has-success"
                                            ) : "ui input inputDev"}>

                                                <span className={this.state.type ? "inputsideNote togglePW activePW" : "inputsideNote togglePW "}>
                                                    <img src={eyeShow} />
                                                    <span className="show" onClick={this.toggle}> Show</span>
                                                    <span className="hide" onClick={this.toggle}> Hide</span>
                                                </span>
                                             
                                             
                                                <Field autoComplete="off" type= 'text' className="form-control"
                                                 name="password" onBlur={e => this.passwordHandleChange(e)} />

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
                                    <div className="textarea-group">
                                        <label>Comment</label>
                                        <textarea className="form-control" onBlur={e => this.commentOnBlurHandler(e)}></textarea>
                                    </div>
                                    <div className="fullWidthWrapper textLeft">
                                        <Dropdown title="approveTo" data={this.state.approveData} handleChange={this.ApprovehandleChange}
                                            index='approve' isMulti='true' handleChange={e => this.selectHandleChange(e)} />

                                    </div>
                                    <div className="fullWidthWrapper">
                                        <button className="primaryBtn-1 btn largeBtn" onClick={e => this.onSubmit(e)}>Save</button>
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
export default wfApproval;