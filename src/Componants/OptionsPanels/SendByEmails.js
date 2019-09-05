import React, { Component } from "react";
import Api from "../../api";
import Dropdown from "./DropdownMelcous";
import "react-table/react-table.css";
import Resources from "../../resources.json";
import dataservice from "../../Dataservice";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as communicationActions from '../../store/actions/communication';

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class SendByEmails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailObj: {
        projectId: this.props.projectId,
        docType: this.props.docTypeId,
        docId: this.props.docId,
        priorityId: null,
        submittedFor: null,
        toCompanyId: null,
        ToContactId: null,
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

  SendEmailHandler() {
    var emailObj = { ...this.state.emailObj };
    this.setState({ isLoading: true })
    this.props.actions.SendByEmail_Inbox("SendByEmail", emailObj);

  }

  handleChange = (state, event, isSubscribe, targetState, calledApi) => {
    if (isSubscribe == true) {
      dataservice.GetDataList(calledApi, "contactName", "id").then(result => {
        this.setState({ [targetState]: result });
      });
    }
    let emailObj = this.state.emailObj;
    emailObj[state] = event.value;
    this.setState({ [state]: event.value, emailObj });
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

        <Dropdown
          name="priority"
          title="priority"
          data={this.state.Priorities}
          handleChange={event => this.handleChange('priorityId', event, false, null, null)}
          index="priority"
          defaultValue={this.state.priorityId}
        />
        <Dropdown
          title="submittedFor"
          data={this.state.Submitted}
          handleChange={event => this.handleChange('submittedFor', event, false, null, null)}
          index="submittedFor"
          defaultValue={this.state.submittedFor}
        />

        <Dropdown
          title="toCompany"
          data={this.state.ToCompanies}
          handleChange={event => this.handleChange('toCompanyId', event, true, "ToContacts", "GetContactsByCompanyId?companyId=" + event.value)}
          index="toCompany"
          defaultValue={this.state.toCompanyId}

        />

        <Dropdown
          title="attention"
          data={this.state.ToContacts}
          handleChange={event => this.handleChange('ToContactId', event, false, null, null)}
          index="attention"
          defaultValue={this.state.ToContactId}

        />

        <Dropdown
          title="ccCompany"
          data={this.state.CCCompanies}
          handleChange={event => this.handleChange('ccCompanyId', event, true, "CCContact", "GetContactsByCompanyId?companyId=" + event.value)}
          index="ccCompany"
          defaultValue={this.state.ccCompanyId}

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
          {this.state.isLoading === false ? (
            <button
              className="primaryBtn-1 btn "
              type="submit"
              onClick={() => this.SendEmailHandler()}
            >  {Resources['send'][currentLanguage]}
            </button>
          ) :
            (
              <button className="primaryBtn-1 btn mediumBtn disabled" disabled="disabled">
                <div className="spinner">
                  <div className="bounce1" />
                  <div className="bounce2" />
                  <div className="bounce3" />
                </div>
              </button>
            )}

        </div>
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
