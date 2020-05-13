import React, { Component } from "react";
import Api from "../../api";
import moment from "moment";
import LoadingSection from "../publicComponants/LoadingSection";
import Export from "../OptionsPanels/Export";
import GridCustom from "../../Componants/Templates/Grid/CustomGrid";
import { Filters } from "react-data-grid-addons";
import Resources from "../../resources.json";
import CryptoJS from "crypto-js";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as communicationActions from "../../store/actions/communication";


let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const {
  NumericFilter,
  AutoCompleteFilter,
  MultiSelectFilter,
  SingleSelectFilter
} = Filters;

const dateFormate = ({ value }) => {
  return value ? moment(value).format("DD/MM/YYYY") : "No Date";
};

const subjectLink = ({ value, row }) => {
  let doc_view = "";
  let subject = "";
  if (row) {

    let obj = {
      docId: row.docId,
      projectId: row.projectId,
      projectName: row.projectName,
      arrange: row.arrange,
      docApprovalId: row.accountDocWorkFlowId,
      isApproveMode: true,
      perviousRoute: window.location.pathname + window.location.search
    };

    let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj))
    let encodedPaylod = CryptoJS.enc.Base64.stringify(parms)
    doc_view = "/" + (row.docLink !== null ? row.docLink.replace('/', '') : row.docLink) + "?id=" + encodedPaylod
    subject = row.subject;

    return <a href={doc_view}> {subject} </a>;
  }
  return null;
};
class OpenedSummaryDetails extends Component {
  constructor(props) {

    super(props);
 var columnGrid = [
      {
        field: 'docNo',
        title: Resources['docNo'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: true,
        type: "text",
        sortable: true,
      },
      {
        field: 'projectName',
        title: Resources['projectName'][currentLanguage],
        width: 15,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true,
      },
      {
        field: 'subject',
        title: Resources['subject'][currentLanguage],
        width: 20,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true,
        classes:'bold',
        href:'link'
      },
      {
        field: 'openedBy',
        title: Resources['openedBy'][currentLanguage],
        width: 15,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'docType',
        title: Resources['docType'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'oppenedDate',
        title: Resources['openedDate'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "date",
        sortable: true
      }
    ];
  this.state = {
      pageTitle: Resources["openedSummary"][currentLanguage],
      viewfilter: false,
      columns: columnGrid,
      isLoading: true,
      rows: [],
      isCustom: true
    };
  }
  componentDidMount() {
    this.props.actions.RouteToTemplate();
    const query = new URLSearchParams(this.props.location.search);
    let action = null;
    for (let param of query.entries()) {
      action = param[1];
    }
    if (action) {
      Api.get("SelectDocTypeByProjectIdOpenedByAction?action=" + action + "&pageNumber=" + 0).then(result => {
         result.forEach(row=>{
          if (row) {
           let obj = {
              docId: row.docId,
              projectId: row.projectId,
              projectName: row.projectName,
              arrange: row.arrange,
              docApprovalId: row.accountDocWorkFlowId,
              isApproveMode: true,
              perviousRoute: window.location.pathname + window.location.search
            };
        
            let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj))
            let encodedPaylod = CryptoJS.enc.Base64.stringify(parms)
            row.link = "/" + (row.docLink !== null ? row.docLink.replace('/', '') : row.docLink) + "?id=" + encodedPaylod
          }
          })
        
        this.setState({
          rows: result != null ? result : [],
          isLoading: false
        });
      });
    }
  }
  rowClick = (row) => {
    if (row) {
        let obj = {
          docId: row.docId,
          projectId: row.projectId,
          projectName: row.projectName,
          arrange: 0,
          docApprovalId: 0,
          isApproveMode: false,
          perviousRoute: window.location.pathname + window.location.search
        };
        let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj));
        let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);
        this.props.history.push({ pathname: "/" + row.docLink, search: "?id=" + encodedPaylod });
      }
  };
  render() {
    const dataGrid =
      this.state.isLoading === false ? (
        <GridCustom
        ref='custom-data-grid'
        key="OpenedSummaryDetails"
        data={this.state.rows}
        pageSize={this.state.rows.length}
        groups={[]}
        actions={[]}
        rowActions={[]}
        cells={this.state.columns}
        rowClick={(cell) => {this.rowClick(cell)}}
      />
      ) : <LoadingSection />;

    const btnExport = this.state.isLoading === false ?
      <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.state.columns} fileName={this.state.pageTitle} />
      : <LoadingSection />;
   return (
      <div className="mainContainer">
        <div className="submittalFilter readOnly__disabled">
          <div className="subFilter">
            <h3 className="zero">
              {this.state.pageTitle}
            </h3>
            <span>{this.state.rows.length}</span>
             </div>
          <div className="filterBTNS">
            {btnExport}
          </div>
        </div>
        <div
          className="filterHidden"
          style={{
            maxHeight: this.state.viewfilter ? "" : "0px",
            overflow: this.state.viewfilter ? "" : "hidden"
          }}
        >
          <div className="gridfillter-container">
          </div>
        </div>

        <div>{dataGrid}</div>
      </div>
    );
  }
}
function mapStateToProps(state, ownProps) {
  return {
    showModal: state.communication.showModal
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
)(withRouter(OpenedSummaryDetails));
