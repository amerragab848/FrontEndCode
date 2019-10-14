import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import "../../Styles/css/rodal.css";
import CryptoJS from 'crypto-js';
import Resources from "../../resources.json";
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import ReactTable from "react-table";
import "react-table/react-table.css";
import moment from "moment";
import dataservice from "../../Dataservice";
import Dropdown from "../OptionsPanels/DropdownMelcous";
import { toast } from "react-toastify";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { SkyLightStateless } from "react-skylight";
import * as communicationActions from '../../store/actions/communication';

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
class AddDocAttachment extends Component {

  constructor(props) {
    super(props);
    this.state = {
      viewModel: false,
      initialSelectModule: { label: Resources.selectModule[currentLanguage], value: "0" },
      initialSelectDocument: { label: Resources.selectModule[currentLanguage], value: "0" },
      moduls: [],
      selectModule: { label: Resources.selectModule[currentLanguage], value: "0" },
      selectDocument: { label: Resources.selectModule[currentLanguage], value: "0" },
      documents: [],
      selected: {},
      showDeleteModal: false,
      currentId: null, 
      selectedRows: [],
      modalAdd: false,
      isRelatedLink: this.props.docTypeId === 108 || this.props.docTypeId === 90 ? true : false,
    };
  }
 
  componentDidMount() {
    if (this.state.docId > 0) {
      dataservice.GetDataList("GetModuleList", "modulType", "id").then(result => {
        this.setState({
          moduls: [...result]
        });
      });
    }
    this.props.actions.ViewDocsAttachment([]);
    // Get Drop Down Models Data When Open Modal To Add Attachment
    dataservice.GetDataList("GetModuleList", "modulType", "id").then(result => { this.setState({ moduls: result }) });
    //Get Data For Doc Attachment Table By DocId & ProjectId & DocType
    //if (!this.props.docsAttachData.length) {
    this.props.actions.getCommunicationDocsAttach(this.props.projectId, this.props.docTypeId, this.props.docId);
    // }
    //In This Case In Two Documnets Only[ SiteInstruction & VariationRequest] You Must Show Related Links Section 
    if (this.state.isRelatedLink) {
      this.props.actions.getCommunicationRelatedLinks(this.props.docTypeId, this.props.docId);
    }
  }

  dropDownsEvent(value, name) {

    if (name === "Module") {
      this.setState({ selectModule: value });
      //In Handel Change Drop Down Module Fill Document Type Drop Down
      dataservice.GetDataList('GetDocsTypeByModuleId?moduleId=' + value.value, 'docType', 'id').then(result => {
        this.setState({ documents: result, selectDocument: this.state.initialSelectDocument });
      });
    }

    else if (name === "docType") {
      this.setState({ selectDocument: value });
      //In Handel Change Drop Down Document Fill Documnet Table
      this.props.actions.getCommunicationDocument(this.props.projectId, value.value);
    }

  }

  toggleRow(obj) {

    const newSelected = Object.assign({}, this.state.selected);

    let originalData = this.state.selectedRows;
    newSelected[obj.id] = !this.state.selected[obj.id];
    let setIndex = originalData.findIndex(x => x.id === obj.id);

    if (setIndex > -1)
      originalData.splice(setIndex, 1);
    else
      originalData.push(obj);

    this.setState({ selected: newSelected, selectedRows: originalData });
  }

  save() {
    if (this.state.selectedRows.length > 0) { 
      this.props.actions.addCommunicationDocsAttach(this.state.selectedRows, this.props.projectId, this.props.docTypeId, this.props.docId);
      this.setState({ selectDocument: this.state.initialSelectDocument, selectedRows: [], selected: {} });
    }
    else {
      toast.warning(Resources["arrayEmpty"][currentLanguage]);
    }
  }

  delete(id) {
    this.setState({ showDeleteModal: true, currentId: id });
  }

  confirmDelete() {
    let id = this.state.currentId;
    this.props.actions.deleteCommunicationDocsAttach(id)
    this.setState({ showDeleteModal: false });
  };

  renderLink(row) {

    let obj = {
      docId: row.docId,
      projectId: row.projectId ? row.projectId : this.props.projectId,
      projectName: row.projectName ? row.projectName : this.props.projectName,
      arrange: 0, docApprovalId: 0, isApproveMode: false
    };

    let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj))
    let encodedPaylod = CryptoJS.enc.Base64.stringify(parms)
    let doc_view = "/" + row.docLink.replace('/', '') + "?id=" + encodedPaylod
    return <a href={doc_view}>{row.subject}</a>;
  }

  render() {

    let columnsDocument =
      [
        this.props.isViewMode ?
          {
            Header: '',
            width: 0,
            headerClassName: 'disNone',
            getProps: (state, rowInfo, column) => {
              return {
                style: { display: 'none' },
              };
            },
          } :
          {
            Header: Resources["delete"][currentLanguage],
            accessor: "id",
            Cell: ({ row }) => {
              return (
                <div className="btn table-btn-tooltip" style={{ marginLeft: "5px" }} onClick={() => this.delete(row.id)}>
                  <i style={{ fontSize: "1.6em" }} className="fa fa-trash-o"></i>
                </div>
              );
            },
            width: 70
          }
        , {
          Header: Resources["subject"][currentLanguage],
          accessor: "subject",
          Cell: ({ row }) => {
            return (
              <div className="btn table-btn-tooltip" style={{ marginLeft: "5px" }}>
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
      ]

    let newAttach = () => {

      let columns = [
        {
          Header: Resources["checkList"][currentLanguage],
          id: "checkbox",
          accessor: "id",
          Cell: ({ row }) => {
            return (
              <div className="ui checked checkbox  checkBoxGray300 ">
                <input type="checkbox" className="checkbox" checked={this.state.selected[row._original.id] === true}
                  onChange={() => this.toggleRow(row._original)} />
                <label />
              </div>
            );
          },
          width: 50
        },
        {
          Header: Resources["subject"][currentLanguage],
          accessor: "subject",
          width: 200
        },
        {
          Header: Resources["docStatus"][currentLanguage],
          accessor: "statusText",
          width: 200,
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
        <div className="dropWrapper">

          <Dropdown name="Module" title="selectModule"
            data={this.state.moduls} selectedValue={this.state.selectModule}
            handleChange={event => this.dropDownsEvent(event, "Module")} />

          <Dropdown title="docType" data={this.state.documents}
            selectedValue={this.state.selectDocument} handleChange={event => this.dropDownsEvent(event, "docType")} />

          {this.props.documentData.length ?
            <Fragment>

              {this.state.selectedRows.length ?
                <div className="fullWidthWrapper">
                  <button className="primaryBtn-1 btn meduimBtn" type="button" onClick={e => this.save()}>{Resources["save"][currentLanguage]} </button>
                </div> : null}

              <div className="precycle-grid modalTable">
                <ReactTable columns={columns} data={this.props.documentData} className="-striped -highlight"
                  defaultPageSize={10} noDataText={Resources["noData"][currentLanguage]} />
              </div>

            </Fragment>
            : null}
        </div>
      )
    }

    let relatedLink = () => {

      let relatedColumns = [
        {
          Header: Resources["subject"][currentLanguage],
          accessor: "subject",
          Cell: ({ row }) => {
            return (
              <div className="btn table-btn-tooltip" style={{ marginLeft: "5px" }}>  {e => this.renderLink(row._original)} </div>
            );
          },
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
            <span> <span>{moment(row.value).format("DD/MM/YYYY")}</span> </span>
          )
        }
      ];

      return (
        this.props.relatedLinkData.length ?

          <div className="precycle-grid modalTable doc-pre-cycle">
            <header>
              <h2 className="zero">{Resources.relatedLink[currentLanguage]}</h2>
            </header>

            <ReactTable
              id="relatedLink"
              data={this.props.relatedLinkData}
              columns={relatedColumns}
              defaultPageSize={5}
              noDataText={Resources["noData"][currentLanguage]}
              className="-striped -highlight" />

          </div>
          : null
      )
    }

    return (
      <Fragment>
        {this.props.isViewMode === false ?
          <button className="primaryBtn-2 btn meduimBtn" type="button"
            onClick={() => this.setState({ modalAdd: true })}>
            {Resources["addDocAttachment"][currentLanguage]} </button> : null}

        {this.props.docsAttachData.length > 0 ?

          <div className="precycle-grid modalTable doc-pre-cycle">
            <header>
              <h2 className="zero">{Resources.docAttachment[currentLanguage]}</h2>
            </header>

            <ReactTable
              data={this.props.docsAttachData}
              id="attachDocuments"
              columns={columnsDocument}
              defaultPageSize={5}
              noDataText={Resources["noData"][currentLanguage]}
              className="-striped -highlight" />
          </div>
          : null}
        {this.state.isRelatedLink ? relatedLink() : null}


        <SkyLightStateless onCloseClicked={e => this.setState({ modalAdd: false })}
          isVisible={this.state.modalAdd} onOverlayClicked={e => this.setState({ modalAdd: false })}>
          {newAttach()}
        </SkyLightStateless>

        {this.state.showDeleteModal == true ? (
          <ConfirmationModal
            title={Resources["smartDeleteMessage"][currentLanguage].content}
            buttonName="delete"
            closed={e => this.setState({ showDeleteModal: false })}
            showDeleteModal={this.state.showDeleteModal}
            clickHandlerCancel={e => this.setState({ showDeleteModal: false })}
            clickHandlerContinue={e => this.confirmDelete()}
          />
        ) : null}

      </Fragment >
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    //docsAttachData: state.communication.docsAttachData, 
    docsAttachData: state.communication.docsAttachData,
    relatedLinkData: state.communication.relatedLinkData,
    documentData: state.communication.documentData,
    changeStatus: state.communication.changeStatus
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(communicationActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddDocAttachment));
