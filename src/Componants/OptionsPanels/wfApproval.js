import React, { Component } from "react";
import { Formik, Form } from "formik";
import Api from "../../api";
import ConfirmationModal from "../publicComponants/ConfirmationModal";
import eyeShow from "../../Styles/images/eyepw.svg";
import Dropdown from "./DropdownMelcous";
import Resources from "../../resources.json";
import CryptoJS from 'crypto-js';
import { toast } from "react-toastify";
import dataservice from "../../Dataservice";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as communicationActions from "../../store/actions/communication";
import { withRouter } from "react-router-dom";
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class wfApproval extends Component {

  constructor(props) {
    super(props);
    this.state = {
      docApprovalId: this.props.docApprovalId,
      data: [],
      type: false,
      approveData: [],
      password: "",
      submitLoading: false,
      updateWorkFlow: {
        approvalStatus: this.props.approvalStatus,
        projectId: this.props.projectId,
        docId: this.props.docId,
        docTypeId: this.props.docTypeId,
        contacts: [],
        comment: "",
        currentArrange: this.props.currentArrange,
        accountDocId: this.props.docApprovalId
      }
    };
  }

  toggle = () => {
    const currentType = this.state.type;
    this.setState({ type: !currentType });
  };

  componentDidMount = () => {
    this.fillContacts(this.props.docApprovalId, this.props.approvalStatus);
  };

  fillContacts(docApprovalId, approvalStatus) {
    dataservice.GetDataListWithAdditionalParam("GetWorkFlowItemsByWorkFlowIdLevelType?docApprovalId=" + docApprovalId + "&approvalStatus=" + approvalStatus, 'contactName', 'contactId', 'arrange').then(result => {

      this.setState({
        approveData: result,
        nextArrange: result ? result[0].arrange : this.state.currentArrange
      });
    }).catch(ex => {
      toast.error(ex);
    });
  }

  static getDerivedStateFromProps(nextProps, state) {

    if (nextProps.approvalStatus != state.approvalStatus) {
      let original_updateWorkFlow = state.updateWorkFlow;
      let updateWorkFlow_new = {};
      updateWorkFlow_new.approvalStatus = nextProps.approvalStatus;
      updateWorkFlow_new = Object.assign(original_updateWorkFlow, updateWorkFlow_new);
      return {
        updateWorkFlow: updateWorkFlow_new
      };
    }
    return null
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.approvalStatus !== this.props.approvalStatus) {
      this.fillContacts(this.props.docApprovalId, this.props.approvalStatus);
    }
  }

  commentOnBlurHandler = e => {
    this.setState({
      updateWorkFlow: { ...this.state.updateWorkFlow, comment: e.target.value }
    });
  };

  selectHandleChange = e => {
    let contactId = [];
    let arrange = 0;
    e.forEach(element => {
      contactId.push(element.value);
      arrange = element.arrange;
    });

    this.setState({
      updateWorkFlow: { ...this.state.updateWorkFlow, contacts: contactId },
      nextArrange: arrange
    });
  };

  sendToWorkFlow(values, fromConfirm) {

    if (values) {
      let selectedContacts = this.state.updateWorkFlow.contacts;
      let approvalStatus = this.state.updateWorkFlow.approvalStatus;
      //
      if ((selectedContacts.length == 0 && fromConfirm == false) && approvalStatus == false) {
        this.setState({ showConfirm: true, values: values });
      }
      else {
        this.setState({ showConfirm: false, values: values });

        Api.getPassword("GetPassWordEncrypt", values.password).then(result => {
          if (result === true) {
            this.setState({ submitLoading: true });

            let objApproval = this.state.updateWorkFlow;
            // let nextArrange = selectedContacts.length == 0 ? this.state.approveData.length > 0 ? this.state.approveData[0].arrange : objApproval.currentArrange
            //   : this.state.nextArrange;
            let obj = {
              docId: objApproval.docId,
              projectId: this.props.projectId,
              projectName: this.props.projectName,
              arrange: this.state.nextArrange,
              docApprovalId: objApproval.accountDocId,
              isApproveMode: true
            };

            let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj));
            let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);

            objApproval.docLink = window.location.pathname.replace('/', '') + "?id=" + encodedPaylod;

            Api.post("SendWorkFlowApproval", objApproval).then(e => {

              this.setState({ submitLoading: false });

              this.props.actions.showOptionPanel(false);

              const previousRoute = localStorage.getItem('lastRoute');

              this.props.history.push(previousRoute);

            });
          } else {
            toast.error(Resources["invalidPassword"][currentLanguage]);
          }
        }).catch(ex => {
          toast.error(ex);
        });
      }
    }
  }

  onCloseModal = () => {
    this.setState({ showConfirm: false });
  };

  confirmHandler() {

    this.setState({ showConfirm: false });

    this.sendToWorkFlow(this.state.values, true);
  }

  render() {
    return (
      <div className="dropWrapper">
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
            this.sendToWorkFlow(values, false);
          }}>
          {({ errors, touched, handleBlur, handleChange }) => (
            <Form id="signupForm1" className="proForm customProform" noValidate="novalidate">
              <div className="fillter-status fillter-item-c ">
                <div className="passwordInputs showPasswordArea">
                  <label className="control-label">Password *</label>
                  <div className="inputPassContainer">
                    <div className={"ui input inputDev" + (errors.password && touched.password ? " has-error" : !errors.password && touched.password ? " has-success" : " ")}>
                      <span className={this.state.type ? "inputsideNote togglePW active-pw" : "inputsideNote togglePW "} onClick={this.toggle}>
                        <img src={eyeShow} />
                        <span className="show"> Show</span>
                        <span className="hide"> Hide</span>
                      </span>
                      <input
                        name="password"
                        type={this.state.type ? "text" : "password"}
                        className="form-control"
                        id="password"
                        placeholder="password"
                        autoComplete="off"
                        onBlur={e => { handleBlur(e); }}
                        onChange={handleChange} />
                      {errors.password && touched.password ? (<span className="glyphicon glyphicon-remove form-control-feedback spanError" />) : !errors.password && touched.password ? (<span className="glyphicon form-control-feedback glyphicon-ok" />) : null}
                      {errors.password && touched.password ? (<em className="pError">{errors.password}</em>) : null}
                    </div>
                  </div>
                </div>
              </div>
              <Dropdown title={this.props.approvalStatus === true ? "approveTo" : "rejectedTo"} data={this.state.approveData} handleChange={this.selectHandleChange} index="approve" isMulti="true" />
              <div className="textarea-group fullWidthWrapper textLeft">
                <label>Comment</label>
                <textarea className="form-control" onBlur={e => this.commentOnBlurHandler(e)} />
              </div>
              {!this.state.submitLoading ? (<div className="fullWidthWrapper"> <button className="primaryBtn-1 btn" type="submit">Save</button> </div>) :
                (
                  <span className="primaryBtn-1 btn largeBtn disabled">
                    <div className="spinner">
                      <div className="bounce1" />
                      <div className="bounce2" />
                      <div className="bounce3" />
                    </div>
                  </span>
                )}
            </Form>
          )}
        </Formik>
        {
          this.state.showConfirm ?
            <ConfirmationModal
              closed={this.onCloseModal}
              showDeleteModal={false}
              clickHandlerCancel={this.onCloseModal}
              clickHandlerContinue={() => this.confirmHandler()}
              title="You must select a user to reject this document to, otherwise, this document will be frozen."
              buttonName='continue'
              cancel="no" />
            : null}
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(wfApproval));