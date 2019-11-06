import React, { Component } from "react";
import Api from "../../api";
import Dropdown from "./DropdownMelcous";
import Resources from "../../resources.json";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as communicationActions from '../../store/actions/communication';
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class CopyTo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      objCopyTo: {
        projectId: this.props.projectId,
        docId: this.props.docId,
        docType: this.props.docTypeId,
      },
      isLoading: false,
      selectedValue: { label: Resources['projectSelection'][currentLanguage], value: "0" },
      Projects: []
    };
  }
  componentWillReceiveProps = (props) => {
    if (props.showModal == false)
      this.setState({ isLoading: false })
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

      let selectedProject = data.find(x => x.value === parseInt(this.props.projectId));

      this.setState({
        Projects: data,
        selectedValue: this.props.projectId != null ? { label: selectedProject.label, value: selectedProject.value } : { label: Resources['projectSelection'][currentLanguage], value: "0" }
      });
    });
  };

  selectValue(value) {

    var objCopy = { ...this.state.objCopyTo };

    objCopy.projectId = value["value"];

    this.setState(state => {
      return {
        objCopyTo: objCopy,
        selectedValue: { label: value.label, value: value.value }
      };
    });
  }

  saveCopyTo() {
    if (this.state.selectedValue.value != "0") {
      this.props.actions.copyTo("CopyDocument", this.state.objCopyTo);
    }
  }

  render() {
    return (
      <div className="proForm">
        <Dropdown title="Projects" data={this.state.Projects} selectedValue={this.state.selectedValue} handleChange={value => this.selectValue(value)} placeholder="Projects" />
        <div className="fullWidthWrapper">
          {this.state.isLoading === false ? (
            <button className="primaryBtn-1 btn" onClick={() => this.saveCopyTo()}>
              {Resources["save"][currentLanguage]}
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
export default connect(mapStateToProps, mapDispatchToProps)(CopyTo); 
