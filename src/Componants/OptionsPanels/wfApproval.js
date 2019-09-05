import React, { Component } from "react";
import { Formik, Form } from "formik";
import Api from "../../api";
import eyeShow from "../../Styles/images/eyepw.svg";
import Dropdown from "./DropdownMelcous";
import Resources from "../../resources.json";
import { toast } from "react-toastify";
import dataservice from "../../Dataservice";
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
    dataservice.GetDataList("GetWorkFlowItemsByWorkFlowIdLevelType?docApprovalId=" + docApprovalId + "&approvalStatus=" + approvalStatus, 'contactName', 'contactId').then(result => {
      this.setState({
        approveData: result
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

  // componentWillReceiveProps(nextProps) {

  //   if (nextProps.approvalStatus != this.props.approvalStatus) {

  //     let original_updateWorkFlow = { ...this.state.updateWorkFlow };
  //     let updateWorkFlow_new = {};
  //     updateWorkFlow_new.approvalStatus = nextProps.approvalStatus;
  //     updateWorkFlow_new = Object.assign(original_updateWorkFlow, updateWorkFlow_new);
  //     this.setState({
  //       updateWorkFlow: updateWorkFlow_new
  //     });

  //     this.fillContacts(this.props.docApprovalId, nextProps.approvalStatus);
  //   }
  // };

  commentOnBlurHandler = e => {
    this.setState({
      updateWorkFlow: { ...this.state.updateWorkFlow, comment: e.target.value }
    });
  };

  selectHandleChange = e => {
    let contactId = [];
    e.forEach(element => {
      contactId.push(element.value);
    });
    this.setState({
      updateWorkFlow: { ...this.state.updateWorkFlow, contacts: contactId }
    });
  };

  render() {
    return (
      <div className="dropWrapper">
        <Formik
          initialValues={{
            password: ""
          }}
          validate={values => {
            const errors = {};
            if (values.password.length == 0) {
              errors.password = Resources["passwordRequired"][currentLanguage];
            }
            return errors;
          }}
          onSubmit={values => {
            Api.getPassword("GetPassWordEncrypt", values.password).then(result => {
              if (result === true) {
                this.setState({ submitLoading: true });
                Api.post("SendWorkFlowApproval", this.state.updateWorkFlow).then(e => {
                  this.setState({ submitLoading: true });
                  console.log('this.props.perviousRoute', this.props.perviousRoute)
                  this.props.history.push(
                    this.props.previousRoute
                  );

                });

              } else {
                toast.error(Resources["invalidPassword"][currentLanguage]);
              }
            }).catch(ex => {
              toast.error(ex);
            });
          }}>
          {({ errors, touched, handleBlur, handleChange }) => (
            <Form id="signupForm1" className="proForm customProform" noValidate="novalidate" >

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
                      <input name="password" type={this.state.type ? "text" : "password"}
                        className="form-control" id="password" placeholder="password" autoComplete="off"
                        onBlur={e => {
                          handleBlur(e);
                        }}
                        onChange={handleChange} />

                      {errors.password && touched.password ? (
                        <span className="glyphicon glyphicon-remove form-control-feedback spanError" />
                      ) : !errors.password && touched.password ? (
                        <span className="glyphicon form-control-feedback glyphicon-ok" />
                      ) : null}
                      {errors.password && touched.password ? (
                        <em className="pError">{errors.password}</em>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>


              <Dropdown title="approveTo" data={this.state.approveData} handleChange={this.selectHandleChange} index="approve" isMulti="true" />
              <div className="textarea-group fullWidthWrapper textLeft">
                <label>Comment</label>
                <textarea
                  className="form-control"
                  onBlur={e => this.commentOnBlurHandler(e)}
                />
              </div>

              {!this.state.submitLoading ? (
                <div className="fullWidthWrapper">
                  <button className="primaryBtn-1 btn" type="submit">Save</button>
                </div>
              ) : (
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
      </div>
    );
  }
}
export default withRouter(wfApproval);
