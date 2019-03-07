import React, { Component } from "react";
import Api from "../../api";
import Dropdown from "./DropdownMelcous";
import "react-table/react-table.css";
import Resources from "../../resources.json";
let currentLanguage =
  localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class SendByEmails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailObj: {
        projectId: this.props.projectId,
        docType:  this.props.docTypeId,
        docId:  this.props.docId,
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
      CCContact: []
    };
  }

  componentWillMount = () => {
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

    Api.get( "GetProjectProjectsCompaniesForList?projectId=" +  this.state.emailObj.projectId ).then(result => {
      var data = [];

      result.map(item => {
        var obj = {};

        obj.label = item["companyName"];
        obj.value = item["companyId"];

        data.push(obj);
      });
      this.setState({
        ToCompanies: data
      });
    });

    Api.get("GetProjectProjectsCompaniesForList?projectId=" +this.state.emailObj.projectId).then(result => {
      var data = [];

      result.map(item => {
        var obj = {};

        obj.label = item["companyName"];
        obj.value = item["companyId"];

        data.push(obj);
      });
      this.setState({
        CCCompanies: data
      });
    });
  };

  PrioritiesHanleChange = event => {
    var emailObj = { ...this.state.emailObj };
    emailObj.priorityId = event.value;
    this.setState(state => {
      return { emailObj: emailObj };
    });
  };

  SubmittedHandelChange = event => {
    var emailObj = { ...this.state.emailObj };
    emailObj.submittedFor = event.value;
    this.setState(state => {
      return { emailObj: emailObj };
    });
  };

  ToCompanyHandleChangeHandler = event => {
    var emailObj = { ...this.state.emailObj };
    emailObj.toCompanyId = event.value;
    this.setState(state => {
      return { emailObj: emailObj };
    });

    if (emailObj.toCompanyId) {
      Api.get("GetContactsByCompanyId?companyId=" + emailObj.toCompanyId).then(
        result => {
          var data = [];

          result.map(item => {
            var obj = {};
            obj.label = item["contactName"];
            obj.value = item["id"];

            data.push(obj);
          });

          this.setState({
            ToContacts: data
          });
        }
      );
    }
  };

  AttentionHandleChange = event => {
    var emailObj = { ...this.state.emailObj };
    emailObj.ToContactId = event.value;
    this.setState(state => {
      return { emailObj: emailObj };
    });
  };

  CCCompanyHandleChange = event => {
    var emailObj = { ...this.state.emailObj };
    emailObj.ccCompanyId = event.value;
    this.setState(state => {
      return { emailObj: emailObj };
    });

    if (emailObj.ccCompanyId) {
      Api.get("GetContactsByCompanyId?companyId=" + emailObj.ccCompanyId).then(
        result => {
          var emailCC = { ...this.state.emailObj };

          emailCC.cc = [];

          this.setState(state => {
            return { emailObj: emailCC };
          });

          var data = [];

          result.map(item => {
            var obj = {};
            obj.label = item["contactName"];
            obj.value = item["id"];

            data.push(obj);
          });

          this.setState({
            CCContact: data
          });
        }
      );
    }
  };

  CCContactHandleChange = constacts => {
    var emailObj = { ...this.state.emailObj };

    emailObj.cc = [];

    constacts.map(constact => {
      emailObj.cc.push(constact.value);
    });

    this.setState(state => {
      return { emailObj: emailObj };
    });
  };

  SendEmailHandler() {
    var emailObj = { ...this.state.emailObj };
    console.log("this.state.emailObj : " + emailObj);
    Api.post("SendByEmail", emailObj).then(result => {
      console.log("Done");
    });
  }

  render() {
    return (
      <div className="dropWrapper">
 
        <Dropdown
          name="color"
          title="priority"
          data={this.state.Priorities} 
          handleChange={event => this.PrioritiesHanleChange(event)}
          index="priority"
        />
        <Dropdown
          title="submittedFor"
          data={this.state.Submitted} 
          handleChange={this.SubmittedHandelChange}
          index="submittedFor"
        />

        <Dropdown
          title="toCompany"
          data={this.state.ToCompanies} 
          handleChange={event => this.ToCompanyHandleChangeHandler(event)}
          index="toCompany"
        />

        <Dropdown
          title="attention"
          data={this.state.ToContacts} 
          handleChange={event => this.AttentionHandleChange(event)}
          index="attention"
        />

        <Dropdown
          title="ccCompany"
          data={this.state.CCCompanies} 
          handleChange={event => this.CCCompanyHandleChange(event)}
          index="ccCompany"
        />

        <div className="fullWidthWrapper">
          <Dropdown
            title="ccContact"
            data={this.state.CCContact} 
            handleChange={event => this.CCContactHandleChange(event)}
            index="ccContact"
            isMulti="true"
          />
        </div>

        <div className="fullWidthWrapper">
          <button
            className="primaryBtn-1 btn"
            onClick={() => this.SendEmailHandler()}
          >
            {Resources["send"][currentLanguage]}
          </button>
        </div>
      </div>
    );
  }
}

export default SendByEmails;
