import React, { Component } from "react";
import Api from "../../api";
import Dropdown from "./DropdownMelcous";
import Resources from "../../resources.json";
let currentLanguage =
  localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

//const _ = require('lodash')

class CopyTo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      objCopyTo: {
        projectId: this.props.projectId,
        docId: this.props.docId,
        docType: this.props.docTypeId,
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
      <div className="dropWrapper ui modal mediumModal">
        <div className="fullWidthWrapper">
          <h2 className="headCustom">{Resources["copyTo"][currentLanguage]}</h2>
        </div>
        <Dropdown
          title="Projects"
          data={this.state.Projects}
          handleChange={value => this.selectValue(value)}
          placeholder="Projects"
        />

        <div className="fullWidthWrapper">
          <button
            className="primaryBtn-1 btn"
            onClick={() => this.saveCopyTo()}
          >
            {Resources["save"][currentLanguage]}
          </button>
        </div>
      </div>
    );
  }
}

export default CopyTo;
