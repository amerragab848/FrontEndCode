import React, { Component } from "react";
import Api from "../../api";
import Dropdown from "./DropdownMelcous";
import "react-table/react-table.css";
import Resources from "../../resources.json";
import dataservice from "../../Dataservice";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as communicationActions from '../../store/actions/communication';
import { object, string } from 'yup';
import { Formik, Form } from 'formik';
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const validationSchema = object().shape({
  priorityId: string().required(Resources['prioritySelect'][currentLanguage]).nullable(true),
  submittedFor: string().required(Resources['submittedForSelect'][currentLanguage]).nullable(true),
  attention: string().required(Resources['selectContact'][currentLanguage]).nullable(true),
  toCompany: string().required(Resources['selectCompany'][currentLanguage]).nullable(true),
})


class SendByEmails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailObj: {
        projectId: this.props.projectId,
        docType: this.props.docTypeId,
        docId: Number(this.props.docId),
        priorityId: null,
        submittFor: null,
        toCompanyId: null,
        toContactId: null,
        ccCompanyId: null,
        cc: [],
        arrange: 200,
        documentTitle: "Letter Document",
        documentDetail: []
      },
      Priorities: [],
      Submitted: [],
      ToCompanies: [],
      ToContacts: [],
      CCCompanies: [],
      CCContact: [],
      isLoading: false
    };
  }
  resetState = () => {
    this.setState({ isLoading: false });
  }

  componentDidMount = () => {
    Api.get("GetaccountsDefaultList?listType=priority&pageNumber=0&pageSize=200").then(result => {
      var data = [];

      result.map(item => {
        var obj = {};
        obj.label = item["title"];
        obj.value = item["id"];

        data.push(obj);
      });

      this.setState({
        Priorities: data
      });
    });

    Api.get("GetaccountsDefaultList?listType=transmittalsubmittedfor&pageNumber=0&pageSize=200").then(result => {
      var data = [];

      result.map(item => {
        var obj = {};
        obj.label = item["title"];
        obj.value = item["id"];

        data.push(obj);
      });
      this.setState({
        Submitted: data
      });
    });

    Api.get("GetProjectProjectsCompaniesForList?projectId=" + this.state.emailObj.projectId).then(result => {
      var data = [];

      result.map(item => {
        var obj = {};

        obj.label = item["companyName"];
        obj.value = item["companyId"];

        data.push(obj);
      });
      this.setState({
        ToCompanies: data,
        CCCompanies: data
      });
    });

  };

  componentWillReceiveProps = (props) => {
    if (props.showModal == false)
      this.resetState();
  }

  SendEmailHandler = (values, { resetForm }) => {
    var emailObj = { ...this.state.emailObj };
    this.setState({
      isLoading: true
    })
    this.props.actions.SendByEmail_Inbox("SendByEmail", emailObj);
    resetForm();
  }

  handleChange = (state, event, isSubscribe, targetState, calledApi) => {
    if (isSubscribe == true) {
      dataservice.GetDataList(calledApi, "contactName", "id").then(result => {
        this.setState({ [targetState]: result });
      });
    }
    let emailObj = this.state.emailObj;
    emailObj[state] = event.value;
    this.setState({ [state]: event, emailObj });
  }

  handleChangeCC = (values) => {
    let cc = values.map(item => {
      return item.value;
    })
    let emailObj = this.state.emailObj;
    emailObj.cc = cc;
    this.setState({ cc, emailObj });
  }

  render() {
    return (
      <div className="dropWrapper proForm">
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            priorityId: null,
            submittFor: null,
            toCompany: null,
            attention: null,
          }}
          enableReinitialize={true}
          onSubmit={(values, { resetForm }) => {
            this.SendEmailHandler(values, { resetForm });
          }} >
          {({ errors, touched, setFieldValue, setFieldTouched, handleChange, }) => (
            <Form id="SendToEmailForm" className="proForm customProform" noValidate="novalidate">
              <Dropdown title="priority"
                data={this.state.Priorities}
                handleChange={event => this.handleChange('priorityId', event, false, null, null)}
                index='priorityId'
                name="priorityId"
                id="priorityId"
                onChange={setFieldValue}
                onBlur={setFieldTouched}
                error={errors.priorityId}
                touched={touched.priorityId}
                selectedValue={this.state.priorityId} />
              <Dropdown title="submittedFor"
                data={this.state.Submitted}
                handleChange={event => this.handleChange('submittFor', event, false, null, null)}
                index='submittedFor'
                name="submittedFor"
                id="submittedFor"
                onChange={setFieldValue}
                onBlur={setFieldTouched}
                error={errors.submittedFor}
                touched={touched.submittedFor}
                selectedValue={this.state.submittFor} />
              <Dropdown title="toCompany"
                data={this.state.ToCompanies}
                handleChange={event => this.handleChange('toCompanyId', event, true, "ToContacts", "GetContactsByCompanyId?companyId=" + event.value)}
                index='toCompany'
                name="toCompany"
                id="toCompany"
                onChange={setFieldValue}
                onBlur={setFieldTouched}
                error={errors.toCompany}
                touched={touched.toCompany}
                selectedValue={this.state.toCompanyId} />
              <Dropdown title="attention"
                data={this.state.ToContacts}
                handleChange={event => this.handleChange('toContactId', event, false, null, null)}
                index='attention'
                name="attention"
                id="attention"
                onChange={setFieldValue}
                onBlur={setFieldTouched}
                error={errors.attention}
                touched={touched.attention}
                selectedValue={this.state.toContactId} />
              <Dropdown
                title="ccCompany"
                data={this.state.CCCompanies}
                handleChange={event => this.handleChange('ccCompanyId', event, true, "CCContact", "GetContactsByCompanyId?companyId=" + event.value)}
                index="ccCompany"
                selectedValue={this.state.ccCompanyId}

              />

              <div className="fullWidthWrapper">
                <Dropdown
                  title="ccContact"
                  data={this.state.CCContact}
                  handleChange={event => this.handleChangeCC(event)}
                  index="ccContact"
                  isMulti="true"
                  defaultValue={this.state.cc}

                />
              </div>

              <div className="fullWidthWrapper">
                {!this.state.isLoading ?
                  <button className="primaryBtn-1 btn" type="submit" >{Resources['send'][currentLanguage]}</button>
                  : (
                    <button className="primaryBtn-1 btn disabled">
                      <div className="spinner">
                        <div className="bounce1" />
                        <div className="bounce2" />
                        <div className="bounce3" />
                      </div>
                    </button>
                  )}
              </div>
            </Form>
          )}
        </Formik>

      </div>
    );
  }
}

function mapStateToProps(state) {

  return {
    showModal: state.communication.showModal
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(communicationActions, dispatch)
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SendByEmails);
