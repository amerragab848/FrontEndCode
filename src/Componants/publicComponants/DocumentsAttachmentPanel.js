import React, { Component, Fragment } from "react";
import Api from "../../api";
import Dropdown from "../OptionsPanels/DropdownMelcous";
import "react-table/react-table.css";
import Resources from "../../resources.json";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import dataservice from "../../Dataservice"; 
import ReactTable from "react-table";
import 'react-table/react-table.css'
import moment from "moment";
import * as communicationActions from "../../store/actions/communication";
import { toast } from "react-toastify";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
 
let selectedRows = []; 

let docAttach=[];
let docId=null;
let parentDocTypeId=null;
let projectId=null;
let changeStatus = null;

class DocumentsAttachmentPanel extends Component {
  constructor(props) {
    super(props);

 
    this.state = { 
      selectModule: {label: Resources.selectModule[currentLanguage], value: "0"},
      selectDocument: {label: Resources.selectModule[currentLanguage],value: "0"},
      moduls: [],
      documents: [],
      documentData: [], 
      selected: {} 
    };  

    docAttach=this.props.objAttach.docAttach ;
    docId=this.props.objAttach.docId;
    parentDocTypeId=this.props.objAttach.docTypeId;
    projectId=this.props.objAttach.projectId;
    changeStatus=this.props.objAttach.changeStatus;
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
    Api.get("GetAccountsDocAlertDocs?projectId=" +this.props.objAttach.projectId +"&docType=" +this.props.objAttach.docTypeId).then(result => {
   
      this.setState({
        documentData: result,
        selectDocument: { label: event.label, value: event.value }
      });
    });
  } 

  toggleRow(obj) {
  
		const newSelected = Object.assign({}, this.state.selected);

    newSelected[obj.id] = !this.state.selected[obj.id]; 
        
    let setIndex =selectedRows.findIndex(x=>x === obj.id);

    if(setIndex > -1){
        selectedRows.splice(setIndex,1); 
      }else{
        selectedRows.push(obj);
      }

		this.setState({
			selected: newSelected 
		});
  }
  
  saveDocument()
  {
    selectedRows.forEach(item => { 
 
      let isExist = docAttach.indexOf(item.docId);

        if(changeStatus){

          if(isExist){

            let obj={};
            
            obj.docId = this.statedocId;
            obj.parentDocId = item.docId;
            obj.parentDocTypeId = this.statedocTypeId;
            obj.projectId = this.state.projectId;

            Api.post("AddCommunicationDocsAttachDoc",obj).then(result => {

              toast.success(Resources["operationSuccess"][currentLanguage]);
            });
          }
        }else{

        }
      
      });
  }

  render() { 

    const columns =
    [{ 
          Header: Resources["checkList"][currentLanguage],
          id: "checkbox",
          accessor: 'id', 
          Cell: ({ row }) => {
            return (
              <div className="ui checked checkbox  checkBoxGray300 ">
                     <input  type="checkbox"
                      className="checkbox"
                      checked={this.state.selected[row._original.id] === true}
                      onChange={() => this.toggleRow(row._original)} />
                    <label></label>
                  </div>  
            );
          },
          width: 50
      },{
          Header:  Resources['subject'][currentLanguage],
          accessor: 'subject',
          sortabel: true, 
          width: 200   
      },{
          Header: Resources['docStatus'][currentLanguage],
          accessor: 'statusText',
          width: 200,
          sortabel: true 
      }, 
      {
        Header: Resources['docDate'][currentLanguage],
        accessor: 'docDate',
        Cell: row => (
          <span>
            <span>{moment(row.value).format("DD/MM/YYYY")}</span>
          </span>
        )
      }] 

    return (
      <div className="dropWrapper">
        <Dropdown name="Module" title="selectModule" data={this.state.moduls} selectedValue={this.state.selectModule}
          handleChange={event => this.fillDropDowns(event,"GetDocsTypeByModuleId?moduleId=","docType","id")}/>
        <Dropdown title="docType" data={this.state.documents} selectedValue={this.state.selectDocument} handleChange={event => this.getDocuments(event)}/>
         
        {this.state.documentData.length > 0 ? 
         (<Fragment>
         <div className="fullWidthWrapper">
            <button className="primaryBtn-1 btn meduimBtn" onClick={this.saveDocument}>{Resources['save'][currentLanguage]}</button>
          </div> 
        <div className="precycle-grid modalTable"> 
                <ReactTable data={this.state.documentData} columns={columns} defaultPageSize={10}
                            noDataText={Resources['noData'][currentLanguage]}
                            className="-striped -highlight" 
                        /> 
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
export default connect(mapStateToProps, mapDispatchToProps)(DocumentsAttachmentPanel);
