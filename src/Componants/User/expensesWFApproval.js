import React, { Component } from "react";
import { Formik, Form } from "formik";
import Api from "../../api";
import eyeShow from "../../Styles/images/eyepw.svg";
import Dropdown from "../OptionsPanels/DropdownMelcous";
import Resources from '../../resources.json';
import { toast } from "react-toastify";
import dataservice from "../../Dataservice";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as communicationActions from "../../store/actions/communication";
import { withRouter } from "react-router-dom";
import { SkyLightStateless } from "react-skylight";
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class expensesWFApproval extends Component {
    constructor(props) {
        super(props);
        this.state = {
            docApprovalId: this.props.docApprovalId,
            data: [],
            type: false,
            approveData: [],
            password: "",
            submitLoading: false,
            selectedContacts: [],
            comment: ''
        };
    }

    toggle = () => {
        this.setState({ type: !this.state.type });
    };

    componentDidMount = () => {
        this.fillContacts(this.props.approvalData);
    };

    fillContacts(approvalData) {
        dataservice.GetDataList('GetExpensesWorkFlowItemsByWorkFlowIdLevelTypeForApproval?transactionId=' + approvalData.transactionId + '&cycleId=' + approvalData.cycleId + '&approvalStatus=true&levelArrange=' + approvalData.currentArrange, 'contactName', 'contactId').then(result => {
            this.setState({ approveData: result });
        }).catch(ex => {
            toast.error(ex);
        });
    }

    commentOnBlurHandler = e => {
        this.setState({ comment: e.target.value });
    };

    selectHandleChange = e => {
        this.setState({ selectedContacts: e })
    };

    sendToWorkFlow(values) {
        if (values) {
            Api.getPassword("GetPassWordEncrypt", values.password).then(result => {
                if (result === true) {
                    this.setState({ submitLoading: true });
                    let contacts = []
                    this.state.selectedContacts.forEach(element => { contacts.push(element.value) });
                    let obj = {
                        'contacts': contacts, 'comment': this.state.comment,
                        'approvalStatus': this.props.approvalStatus,
                        'currentArrange': this.props.approvalData.currentArrange,
                        'transactionId': this.props.approvalData.transactionId,
                        'expenseId': this.props.approvalData.id,
                        'workFlowItemId': this.props.approvalData.workFlowItemId,
                        'cycleId': this.props.approvalData.cycleId,
                        'workFlowId': this.props.approvalData.workFlowId,
                    };

                    Api.post("SendWorkFlowApprovalExpenses", obj).then(e => {
                        this.setState({ submitLoading: false });
                        this.props.history.push("/PendingExpensesDetails?key=0-1-3");
                    });
                } else {
                    toast.error(Resources["invalidPassword"][currentLanguage]);
                }
            }).catch(ex => {
                toast.error(ex);
            });
        }
    }

    render() {
        return (
            <div className="skyLight__form">
                <SkyLightStateless onOverlayClicked={e => this.props.closeModal()}
                    title={Resources['workFlow'][currentLanguage]}
                    onCloseClicked={e => this.props.closeModal()} isVisible={this.props.showApproval}>

                    <Formik
                        initialValues={{ password: "" }}
                        validate={values => {
                            const errors = {};
                            if (values.password.length == 0) {
                                errors.password = Resources["passwordRequired"][currentLanguage];
                            }
                            return errors;
                        }}
                        onSubmit={values => {
                            this.sendToWorkFlow(values);
                        }}>
                        {({ errors, touched, handleBlur, handleChange }) => (
                            <Form id="signupForm1" className="proForm customProform" noValidate="novalidate">
                                <div className="dropWrapper">

                                    <div className="fillter-status fillter-item-c passwordInputs showPasswordArea">
                                        <label className="control-label">Password *</label>
                                        <div className={"ui input inputDev" + (errors.password && touched.password ? " has-error" : !errors.password && touched.password ? " has-success" : " ")}>
                                            <span className={this.state.type ? "inputsideNote togglePW active-pw" : "inputsideNote togglePW "} onClick={this.toggle} style={{ top: '-8px' }}>
                                                <img src={eyeShow} />
                                                <span className="show"> Show</span>
                                                <span className="hide"> Hide</span>
                                            </span>
                                            <input name="password" type={this.state.type ? "text" : "password"}
                                                className="form-control" id="password" placeholder="password" autoComplete="off"
                                                onBlur={e => { handleBlur(e); }}
                                                onChange={handleChange} />
                                            {errors.password && touched.password ? (<span className="glyphicon glyphicon-remove form-control-feedback spanError" />) : !errors.password && touched.password ? (<span className="glyphicon form-control-feedback glyphicon-ok" />) : null}
                                            {errors.password && touched.password ? (<em className="pError">{errors.password}</em>) : null}
                                        </div>
                                    </div>

                                    <Dropdown title="approveTo" data={this.state.approveData} selectedValue={this.state.selectedContacts}
                                        handleChange={this.selectHandleChange} index="approve" isMulti="true" />

                                    <div className="textarea-group fullWidthWrapper textLeft">
                                        <label>Comment</label>
                                        <textarea className="form-control" value={this.state.comment} onChange={e => this.commentOnBlurHandler(e)} />
                                    </div>
                                    <div className="fullWidthWrapper">
                                        {!this.state.submitLoading ? (
                                            <button className="primaryBtn-1 btn" type="submit">Save</button>
                                        ) :
                                            (
                                                <button className="primaryBtn-1 btn disabled">
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
                </SkyLightStateless>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        showModal: state.communication.showModal
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(expensesWFApproval));