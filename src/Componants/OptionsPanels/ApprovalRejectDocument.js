import React, { Component } from "react";
import Api from "../../api";
import Dropdown from "./DropdownMelcous";
import Resources from "../../resources.json";
import  Approval from '../../Styles/images/approval.png'
import  Reject from '../../Styles/images/declined.png'
let currentLanguage =
  localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
 

class ApprovalRejectDocument extends Component {
  constructor(props) {
    super(props);
    this.state = {
      objCopyTo: {
        projectId: null,
        docId: "992",
        docType: "19"
      },
      Projects: []
    };
  }

  componentDidMount = () => {
    Api.get("GetAccountsProjects").then(result => {
      var data = [];

      result.map(item => {
        var obj = {};
        obj.label = item["projectName"];
        obj.value = item["projectId"];

        data.push(obj);
      });

      this.setState({
        Projects: data
      });
    });
  };

  selectValue(value) {

    var objCopy={...this.state.objCopyTo};

    objCopy.projectId =value["value"] ;

    this.setState(state => {
      return { objCopyTo: objCopy };
    });
  }

  saveCopyTo() {
    if (this.state.objCopyTo.projectId != undefined) {
      Api.post("CopyDocument",this.state.objCopyTo).then(result => {
          console.log(result);
      });
    }
  }

  render() {
    return (
      <div>
        <div className="approveReject">
            <h3>Approve Document</h3>
            <div className="reject_approve"> 
                <button className="primaryBtn-2 btn firstBtnApprov" onClick={this.props.ApproveHandler}>{Resources["reject"][currentLanguage]}</button>
                <button className="primaryBtn-1 btn" onClick={this.props.ApproveHandler}>{Resources["approvalModalApprove"][currentLanguage]}</button>
            </div>
        </div>
      </div>
    );
  }
}

export default ApprovalRejectDocument;
