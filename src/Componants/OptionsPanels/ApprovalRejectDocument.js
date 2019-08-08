import React, { Component } from "react";
import Api from "../../api";
import Resources from "../../resources.json";
let currentLanguage =  localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
 
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

    var objCopy = { ...this.state.objCopyTo };

    objCopy.projectId = value["value"];

    this.setState(state => {
      return { objCopyTo: objCopy };
    });
  }

  saveCopyTo() {
    if (this.state.objCopyTo.projectId != undefined) {
      Api.post("CopyDocument", this.state.objCopyTo).then(result => {
        console.log(result);
      });
    }
  }

  render() {
    return (

      <div className="without__navigation noTabs__document">
        <div className="approveDocument">
          <h2 className="zero">Approve Document</h2>
          <div className="approveDocumentBTNS">
            <button className="primaryBtn-2 btn" onClick={() => this.props.ApproveHandler(false)}>{Resources["reject"][currentLanguage]}</button>
            <span className="border"></span>
            <button type="button" className="primaryBtn-1 btn middle__btn" onClick={() => this.props.ApproveHandler(true)}>{Resources["approvalModalApprove"][currentLanguage]}</button>
          </div>
        </div>
      </div>
    )
  }
}

export default ApprovalRejectDocument;
