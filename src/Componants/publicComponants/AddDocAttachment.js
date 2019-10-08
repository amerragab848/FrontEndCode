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
import SkyLight from "react-skylight";
import * as communicationActions from '../../store/actions/communication';

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");


class AddDocAttachment extends Component {

  constructor(props) {
    super(props);
    this.state = {
      projectId: this.props.projectId,
      docId: this.props.docId,
      docType: this.props.docTypeId,
      viewModel: false,
      selectModule: { label: Resources.selectModule[currentLanguage], value: "0" },
      selectDocument: { label: Resources.selectModule[currentLanguage], value: "0" },
      moduls: [],
      documents: [],
      documentData: [],
      selected: {},
      showDeleteModal: false,
      currentId: null,
      storedDocuments: [],
      isViewMode: this.props.isViewMode,
      relatedLink: this.props.title === "SiteInstruction" || "VariationOrder" ? true : false,
      relatedLinkData: [],
      selectedRows: []
    };
  }

  componentWillMount = () => {
    if (this.state.docId > 0) {
      dataservice.GetDataList("GetModuleList", "modulType", "id").then(result => {
        this.setState({
          moduls: [...result]
        });
      });

      this.props.actions.ViewDocsAttachment([]);

      let currentData = this.props.attachDocuments;

      if (currentData.length === 0 && this.props.changeStatus) {

        dataservice.GetDataGrid("GetCommunicationDocsAttachDoc?projectId=" + this.state.projectId + "&docTypeId=" + this.state.docType + "&docId=" + this.state.docId).then(result => {

          let document = result || [];

          this.setState({
            storedDocuments: document
          });
          this.props.actions.ViewDocsAttachment(document);
        });
      }

      if (this.state.relatedLink && this.props.changeStatus) {
        dataservice.GetDataGrid("GetCommunicationDocsAttachDocByDocIdandDocType?docTypeId=" + this.state.docType + "&docId=" + this.state.docId).then(result => {

          let document = result || [];

          this.setState({
            relatedLinkData: document
          });
        });
      }
    }
  };

  componentWillReceiveProps(nextProps) {
    this.setState({ isViewMode: nextProps.isViewMode });
  }

  componentWillUnmount() {
    this.props.actions.ViewDocsAttachment([]);
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
    dataservice.GetDataGrid("GetAccountsDocAlertDocs?projectId=" + this.props.projectId + "&docType=" + event.value).then(result => {

      this.setState({
        documentData: [...result],
        selectDocument: { label: event.label, value: event.value }
      });
    });
  }

  toggleRow(obj) {

    const newSelected = Object.assign({}, this.state.selected);

    let originalData = this.state.selectedRows;

    newSelected[obj.id] = !this.state.selected[obj.id];

    let setIndex = originalData.findIndex(x => x.id === obj.id);

    if (setIndex > -1) {
      originalData.splice(setIndex, 1);
    } else {
      originalData.push(obj);
    }

    this.setState({
      selected: newSelected,
      selectedRows: originalData
    });
  }

  saveDocument() {
    if (this.state.selectedRows.length > 0) {

      let count = 0;

      this.state.selectedRows.forEach(item => {

        let listDocs = this.state.storedDocuments;

        let isExist = listDocs.findIndex(x => x.docId === item.docId);

        if (isExist === -1) {
          let obj = {};

          obj.docId = this.state.docId;
          obj.parentDocId = item.docId;
          obj.parentDocTypeId = item.docType;
          obj.docTypeId = this.state.docType;
          obj.projectId = this.state.projectId;

          dataservice.addObject("AddCommunicationDocsAttachDoc", obj).then(document => {
            let oldStoredData = [...this.state.storedDocuments];
            oldStoredData.push(document);
            this.setState({
              storedDocuments: [...oldStoredData]
            })
            this.props.actions.ViewDocsAttachment(oldStoredData);
          });

        }
        count++;
        if (count === this.state.selectedRows.length) {

          toast.success(Resources["operationSuccess"][currentLanguage]);

          this.setState({
            viewModel: false
          });
        }
      });
    }
    else {
      toast.warning(Resources["arrayEmpty"][currentLanguage]);
    }
  }

  DeleteDocumentAttachment(id) {
    this.setState({
      showDeleteModal: true,
      currentId: id
    });
  }

  onCloseModal = () => {
    this.setState({ showDeleteModal: false });
  };

  clickHandlerCancelMain = () => {
    this.setState({ showDeleteModal: false });
  };

  clickHandlerContinueMain = () => {
    let id = this.state.currentId;
    dataservice.addObject("CommunicationDocsAttachDocDelete?id=" + id).then(result => {
      let currentDosuments = this.props.attachDocuments;
      let rowIndex = currentDosuments.findIndex(x => x.id === id);

      currentDosuments.splice(rowIndex, 1);
      this.props.actions.ViewDocsAttachment(currentDosuments);

      this.setState({ showDeleteModal: false });

      toast.success(Resources["operationSuccess"][currentLanguage]);

    }).catch(res => {

      toast.error(Resources["operationCanceled"][currentLanguage]);
    });

  };

  renderLink(row) {

    let obj = {
      docId: row.docId,
      projectId: row.projectId ? row.projectId : this.props.projectId,
      projectName: row.projectName ? row.projectName : this.props.projectName,
      arrange: 0,
      docApprovalId: 0,
      isApproveMode: false
    };

    let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj))
    let encodedPaylod = CryptoJS.enc.Base64.stringify(parms)
    let doc_view = "/" + row.docLink.replace('/', '') + "?id=" + encodedPaylod

    return <a href={doc_view}>{row.subject}</a>;
  }

  closeModal() {
    this.setState({
      viewModel: false
    });
  }

  render() {

    let columnsDocument = [];

    if (this.state.isViewMode === false) {
      columnsDocument.push({
        Header: Resources["delete"][currentLanguage],
        accessor: "id",
        Cell: ({ row }) => {
          return (
            <div className="btn table-btn-tooltip" style={{ marginLeft: "5px" }} onClick={() => this.DeleteDocumentAttachment(row.id)}>
              <i style={{ fontSize: "1.6em" }} className="fa fa-trash-o"></i>
            </div>
          );
        },
        width: 70
      })
    }

    columnsDocument.push(
      {
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
    );

    const columns = [
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

    const relatedColumns = [
      {
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
        {this.state.isViewMode === false ?
          <button className="primaryBtn-2 btn meduimBtn" type="button" onClick={() => this.simpleDialog.show()}>
            {Resources["addDocAttachment"][currentLanguage]}
          </button> : null}
        <br />
        <br />
        <div className="precycle-grid modalTable">
          {
            this.props.attachDocuments.length > 0 ?
              <ReactTable data={this.props.attachDocuments} id="attachDocuments"
                columns={columnsDocument} defaultPageSize={5}
                noDataText={Resources["noData"][currentLanguage]}
                className="-striped -highlight" /> : null
          }
        </div>
        <div className="precycle-grid modalTable">
          {
            this.state.relatedLink ?
              (this.state.relatedLinkData.length > 0 ?
                <Fragment>
                  <div class="workflow-header">
                    <h4>
                      <p class="zero">
                        <span>{Resources.relatedLink[currentLanguage]}</span>
                      </p>
                    </h4>
                  </div>
                  <ReactTable id="relatedLink" data={this.state.relatedLinkData}
                    columns={relatedColumns} defaultPageSize={5}
                    noDataText={Resources["noData"][currentLanguage]}
                    className="-striped -highlight" /> </Fragment> : null) : null
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
        <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref}>
          <div className="dropWrapper">
            <Dropdown name="Module" title="selectModule" data={this.state.moduls} selectedValue={this.state.selectModule}
              handleChange={event => this.fillDropDowns(event, "GetDocsTypeByModuleId?moduleId=", "docType", "id")} />
            <Dropdown title="docType" data={this.state.documents} selectedValue={this.state.selectDocument} handleChange={event => this.getDocuments(event)} />
            {this.state.documentData.length > 0 ? (
              <Fragment>
                {this.state.selectedRows.length > 0 ?
                  <div className="fullWidthWrapper">
                    <button className="primaryBtn-1 btn meduimBtn" type="button" onClick={this.saveDocument.bind(this)}>
                      {Resources["save"][currentLanguage]}
                    </button>
                  </div>
                  : null
                }
                <div className="precycle-grid modalTable">
                  <ReactTable data={this.state.documentData}
                    columns={columns}
                    defaultPageSize={10}
                    noDataText={Resources["noData"][currentLanguage]}
                    className="-striped -highlight" />
                </div>
              </Fragment>
            ) : null}
          </div>
        </SkyLight>
      </Fragment >
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    attachDocuments: state.communication.attachDocuments
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(communicationActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddDocAttachment));
