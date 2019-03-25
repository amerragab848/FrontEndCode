import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import SkyLight from 'react-skylight';
import Rodal from "../../Styles/js/rodal";
import "../../Styles/css/rodal.css";
import CryptoJS from 'crypto-js';
import Resources from "../../resources.json";
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import ReactTable from "react-table";
import "react-table/react-table.css";
import moment from "moment";
import dataservice from "../../Dataservice";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import { toast } from "react-toastify";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
let selectedRows=[];
let  listDocs= [];

class AddDocAttachment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectId: this.props.projectId,
      docId: this.props.docId,
      docType: this.props.docTypeId, 
      viewModel: false,
      selectModule: {label: Resources.selectModule[currentLanguage], value: "0"},
      selectDocument: {label: Resources.selectModule[currentLanguage],value: "0"},
      moduls: [],
      documents: [],
      documentData: [],
      selected: {},
      showDeleteModal:false,
      currentId:null
    }; 
  }

  componentDidMount = () => {
    if (this.state.docId > 0) {
      dataservice.GetDataList("GetModuleList", "modulType", "id").then(result => {
          this.setState({
            moduls: [...result]
          });
        });

      dataservice.GetDataGrid("GetCommunicationDocsAttachDoc?projectId=" +this.state.projectId +"&docTypeId=" +this.state.docType +"&docId=" +this.state.docId).then(result => {
        listDocs = result != null ? result : []
        });
     }
  };

  componentWillReceiveProps(nextProps) {

    if (nextProps.match !== this.props.match) {
 
    }

    if (nextProps.projectId !== this.props.projectId) {
    
    }
  }

  fillDropDowns(event, url, label, id) {
    dataservice.GetDataList(url + event.value, label, id).then(result => {
      this.setState({
        documents: [...result],
        selectModule: { label: event.label, value: event.value }
      });
    });
  }

  getDocuments(event) {
    dataservice.GetDataGrid("GetAccountsDocAlertDocs?projectId=" +this.props.projectId +"&docType=" +event.value).then(result => {
      this.setState({
        documentData: result,
        selectDocument: { label: event.label, value: event.value }
      });
    });
  }

  toggleRow(obj) {
  
    const newSelected = Object.assign({}, this.state.selected);

    newSelected[obj.id] = !this.state.selected[obj.id];

    let setIndex = selectedRows.findIndex(x => x === obj.id);

    if (setIndex > -1) {
      selectedRows.splice(setIndex, 1);
    } else {
       selectedRows.push(obj);
    }

    this.setState({
      selected: newSelected
    });
  }

  saveDocument() {

   selectedRows.forEach(item => {

      let isExist = listDocs.findIndex(x=> x.docId === item.docId); 
     
        if (isExist === -1) {
          let obj = {};

          obj.docId = this.state.docId;
          obj.parentDocId = item.docId;
          obj.parentDocTypeId = item.docType;
          obj.docTypeId = this.state.docType;
          obj.projectId = this.state.projectId;

          dataservice.addObject("AddCommunicationDocsAttachDoc", obj);
        } 
    });

    dataservice.GetDataGrid("GetCommunicationDocsAttachDoc?projectId=" +this.state.projectId +"&docTypeId=" +this.state.docType +"&docId=" +this.state.docId).then(result => {
     
      listDocs = result != null ? result : []
      
      toast.success(Resources["operationSuccess"][currentLanguage]);

      this.setState({
        viewModel:false
      });

    });
  }  

  NavigateToDocument(currentRow){

   let obj = {
    docId: currentRow.docId,
    projectId: currentRow.projectId,
    projectName: currentRow.projectName,
    arrange: 0,
    docApprovalId: 0,
    isApproveMode: false
  };

  let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj))
  let encodedPaylod = CryptoJS.enc.Base64.stringify(parms)
  let doc_view = "/" + currentRow.docLink.replace('/', '') + "?id=" + encodedPaylod
    
    this.props.history.push(doc_view);
  }

  DeleteDocumentAttachment(id){
    this.setState({
      showDeleteModal:true,
      currentId:id
    });
  }

  onCloseModal = () => {
    this.setState({ showDeleteModal: false });
  };

  clickHandlerCancelMain = () => {
    this.setState({ showDeleteModal: false });
  };

  clickHandlerContinueMain = () => {
    this.setState({
      isLoading: true
    });

    dataservice.addObject("CommunicationDocsAttachDocDelete?id="+this.state.currentId).then(result => {

      let getIndex = listDocs.findIndex(x=>x.id ===this.state.currentId);

      listDocs.splice(getIndex,1);
 
      this.setState({showDeleteModal : false});
      toast.success(Resources["operationSuccess"][currentLanguage]);
    });
  };

  renderLink(row){

  let obj = {
    docId: row.docId,
    projectId: row.projectId,
    projectName: row.projectName,
    arrange: 0,
    docApprovalId: 0,
    isApproveMode: false
  };

      let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj))
      let encodedPaylod = CryptoJS.enc.Base64.stringify(parms)
      let doc_view = "/" + row.docLink.replace('/', '') + "?id=" + encodedPaylod
    
    return <a href={doc_view}>{row.subject}</a>;
  }

  viewAttach(){ 
    this.setState({
      viewModel:true
    }); 
  }

  closeModal(){
    this.setState({
      viewModel:false
    }); 
  }

  render() {
 
    const columnsDocument = [
      {
        Header: Resources["delete"][currentLanguage], 
        accessor: "id",
        Cell: ({ row }) => {
          return (
            <div className="btn table-btn-tooltip" style={{marginLeft:"5px"}} onClick={() => this.DeleteDocumentAttachment(row.id)}>
             <i style={{fontSize: "1.6em"}} className="fa fa-trash-o"></i>
            </div>
          );
        },
        width: 70
      },
      // {
      //   Header: Resources["goEdit"][currentLanguage], 
      //   accessor: "id",
      //   Cell: ({ row }) => {
      //     return (
      //       <div className="btn table-btn-tooltip" style={{marginLeft:"5px"}} onClick={() => this.NavigateToDocument(row._original)}>
      //        <i style={{fontSize: "1.6em"}} className="fa fa-pencil-square"></i>
      //       </div>
      //     );
      //   },
      //   width: 70
      // },
      {
        Header: Resources["subject"][currentLanguage],
        accessor: "subject",
        Cell: ({ row }) => {
          return (
            <div className="btn table-btn-tooltip" style={{marginLeft:"5px"}}>
             {this.renderLink(row._original)}
            </div>
          );
        },
        width: 200
      },
      {
        Header: Resources["docType"][currentLanguage],
        accessor: "docTypeName",
        width: 200 
      },
      {
        Header: Resources["docDate"][currentLanguage],
        accessor: "docDate",
        Cell: row => (
          <span>
            <span>{moment(row.value).format("DD/MM/YYYY")}</span>
          </span>
        )
      }
    ];

    const columns = [
      {
        Header: Resources["checkList"][currentLanguage],
        id: "checkbox",
        accessor: "id",
        Cell: ({ row }) => {
          return (
            <div className="ui checked checkbox  checkBoxGray300 ">
              <input type="checkbox" className="checkbox" checked={this.state.selected[row._original.id] === true}
                     onChange={() => this.toggleRow(row._original)}/>
              <label />
            </div>
          );
        },
        width: 50
      },
      {
        Header: Resources["subject"][currentLanguage],
        accessor: "subject",
        sortabel: true,
        width: 200
      },
      {
        Header: Resources["docStatus"][currentLanguage],
        accessor: "statusText",
        width: 200,
        sortabel: true
      },
      {
        Header: Resources["docDate"][currentLanguage],
        accessor: "docDate",
        Cell: row => (
          <span>
            <span>{moment(row.value).format("DD/MM/YYYY")}</span>
          </span>
        )
      }
    ];

    return (
      <Fragment>
        <button className="primaryBtn-2 btn meduimBtn" type="button" onClick={this.viewAttach.bind(this)}>
          {Resources["addDocAttachment"][currentLanguage]}
        </button>
          <br/>
          <br/>
        <div className="precycle-grid modalTable">
        {
          listDocs.length > 0 ?<ReactTable data={listDocs} columns={columnsDocument} defaultPageSize={10}
                               noDataText={Resources["noData"][currentLanguage]} className="-striped -highlight" />:null
        }
        </div> 
        <div>
          {this.state.showDeleteModal == true ? (
            <ConfirmationModal
              title={Resources["smartDeleteMessage"][currentLanguage].content}
              buttonName="delete"
              closed={this.onCloseModal}
              showDeleteModal={this.state.showDeleteModal}
              clickHandlerCancel={this.clickHandlerCancelMain}
              clickHandlerContinue={this.clickHandlerContinueMain.bind(this)}
            />
          ) : null}
        </div> 
        {this.state.viewModel ? (
          <div>
          <Rodal visible={this.state.viewModel} onClose={this.closeModal.bind(this)}>
          <div className="ui modal largeModal" id="largeModal">
              <div className="dropWrapper">
                <Dropdown name="Module" title="selectModule" data={this.state.moduls} selectedValue={this.state.selectModule}
                  handleChange={event => this.fillDropDowns(event, "GetDocsTypeByModuleId?moduleId=", "docType", "id" ) } />
                <Dropdown title="docType" data={this.state.documents} selectedValue={this.state.selectDocument} handleChange={event => this.getDocuments(event)}/>
                {this.state.documentData.length > 0 ? (
                  <Fragment>
                    <div className="fullWidthWrapper">
                      <button className="primaryBtn-1 btn meduimBtn" onClick={this.saveDocument.bind(this)}>
                        {Resources["save"][currentLanguage]}
                      </button>
                    </div>
                    <div className="precycle-grid modalTable">
                      <ReactTable data={this.state.documentData} columns={columns} defaultPageSize={10}
                                  noDataText={Resources["noData"][currentLanguage]} className="-striped -highlight" />
                    </div>
                  </Fragment>
                ) : null}
              </div>
              </div>
            </Rodal>
          </div>
          ) : null}
      </Fragment>
    );
  }
}

export default withRouter(AddDocAttachment);
