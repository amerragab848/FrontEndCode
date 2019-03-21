import React, { Component, Fragment } from "react";
import Api from "../../api";
import Dropdown from "../OptionsPanels/DropdownMelcous";
import "react-table/react-table.css";
import Resources from "../../resources.json";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import dataservice from "../../Dataservice";
import Recycle from '../../Styles/images/attacheRecycle.png';
import ReactTable from "react-table";
import 'react-table/react-table.css'
import moment from "moment";
import * as communicationActions from "../../store/actions/communication";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const columns = [
  // {
  //     Cell: props => {
  //         return (
  //             <a onClick={e => this.onDelete(props.original.contactId, e)} href="#">
  //                 <img className="deleteImg" src={Recycle} alt="Del" />
  //             </a>
  //         )
  //     }, width: 30
  // },
   {
      Header:  Resources['subject'][currentLanguage],
      accessor: 'subject',
      sortabel: true,
      filterable: true,
      width: 50, show: false
  }, {
      Header: Resources['docStatus'][currentLanguage],
      accessor: 'docStatus',
      width: 200,
      sortabel: true,
      filterable: true
  } , {
      Header: Resources['docDate'][currentLanguage],
      accessor: 'docDate',
      width: 200,
      sortabel: true,
      filterable: true
  } 
]
   

class DocumentsAttachmentPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Obj: {
        projectId: this.props.projectId,
        docType: this.props.docTypeId,
        docId: this.props.docId
      },
      selectModule: {label: Resources.selectModule[currentLanguage], value: "0"},
      selectDocument: {label: Resources.selectModule[currentLanguage],value: "0"},
      moduls: [],
      documents: [],
      documentData: [],
      columns:columns
    };

      }

  componentWillMount = () => {
    //GetModuleList
    dataservice.GetDataList("GetModuleList", "modulType", "id").then(result => {
      this.setState({
        moduls: [...result]
      });
    });
  };

  fillDropDowns(event, url, label, id) {
    dataservice.GetDataList(url + event.value, label, id).then(result => {
      this.setState({
        documents: [...result],
        selectModule: { label: event.label, value: event.value }
      });
    });
  }

  getDocuments(event) {
    Api.get("GetAccountsDocAlertDocs?projectId=" +this.props.projectId +"&docType=" +this.props.docType).then(result => {
      console.log(result);
      this.setState({
        documentData: result,
        selectDocument: { label: event.label, value: event.value }
      });
    });
  }
 
  render() { 

    return (
      <div className="dropWrapper">
        <Dropdown name="Module" title="selectModule" data={this.state.moduls} selectedValue={this.state.selectModule}
          handleChange={event => this.fillDropDowns(event,"GetDocsTypeByModuleId?moduleId=","docType","id")}/>
        <Dropdown title="docType" data={this.state.documents} selectedValue={this.state.selectDocument} handleChange={event => this.getDocuments(event)}/>
         
        {this.state.documentData.length > 0 ? 
         (<Fragment>
         <div className="fullWidthWrapper">
            <button className="primaryBtn-1 btn meduimBtn">ADD</button>
          </div> 
        <div className="precycle-grid modalTable">
                <ReactTable
                        ref={(r) => {
                            this.selectTable = r;
                        }}
                        filterable={false}
                        data={this.state.documentData}
                        columns={this.state.columns}
                        defaultPageSize={10}
                        minRows={2}
                        noDataText={Resources['noData'][currentLanguage]}
                    />

            {/* <table className="ui table">
              <thead>
                <tr>
                  <th>{Resources["subject"][currentLanguage]}</th>
                  <th>{Resources["docStatus"][currentLanguage]}</th>
                  <th>{Resources["docDate"][currentLanguage]}</th> 
                </tr>
              </thead>
              <tbody>
                {renderTable}
              </tbody>
            </table> */}
          </div>
        </Fragment>):null}  
        </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    viewModel: false
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(communicationActions, dispatch)
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentsAttachmentPanel);
