import React, { Component } from "react";
import Api from "../../api";
import Filter from "../FilterComponent/filterComponent";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import Export from "../OptionsPanels/Export";
import { Filters } from "react-data-grid-addons";
import Resources from "../../resources.json";
import moment from "moment";
import CryptoJS from 'crypto-js';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as communicationActions from "../../store/actions/communication";
import GridCustom from "../../Componants/Templates/Grid/CustomGrid";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
  
class DistributionInboxListSummaryDetails extends Component {
  constructor(props) {
    super(props);

    const filtersColumns = [
      {
        field: "statusText",
        name: "statusName",
        type: "toggle",
        trueLabel: "oppened",
        falseLabel: "closed",
        isCustom: true
      },
      {
        field: "subject",
        name: "subject",
        type: "string",
        isCustom: true
      },
      {
        field: "projectName",
        name: "projectName",
        type: "string",
        isCustom: true
      },
      {
        field: "fromAccountName",
        name: "from",
        type: "string",
        isCustom: true
      },
      {
        field: "comment",
        name: "comment",
        type: "string",
        isCustom: true
      },
      {
        field: "creationDate",
        name: "sendDate",
        type: "date",
        isCustom: true
      }
    ];

    this.state = {
      viewfilter: false, 
      isLoading: true,
      rows: [],
      filtersColumns: filtersColumns,
      isCustom: true,
      pageTitle: "",
      apiFilter: ""
    };

    this.columnsGrid = [
      {
        title: Resources['statusName'][currentLanguage],
        width: 10,
        groupable: true,
        sortable: true,
        fixed: true,
        type: "text",
        classes: 'gridBtns status '
      }, {
        field: 'subject',
        title: Resources['subject'][currentLanguage],
        width: 20,
        fixed: true,
        groupable: true,
        type: "text",
        sortable: true,
        showTip: true,
        classes: ' bold elipsisPadd',
        onRightClick: cell => { this.cellClick(cell) },
        href: 'link',
      }, {
        field: 'projectName',
        title: Resources['projectName'][currentLanguage],
        width: 20,
        groupable: true,
        showTip: true,
        fixed: false,
        type: "text",
        sortable: true,
      }, {
        field: 'fromAccountName',
        title: Resources['from'][currentLanguage],
        width: 20,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true,
        showTip: true,
      }, {
        field: 'comment',
        title: Resources['comment'][currentLanguage],
        width: 20,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true, href: 'link',
      }, {
        field: 'creationDate',
        title: Resources['sendDate'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        sortable: true,
        type: "date",
      }
    ];
  }

  componentDidMount() {
    let id = null;
    let action = null;

    this.props.actions.RouteToTemplate();

    const query = new URLSearchParams(this.props.location.search);

    for (let param of query.entries()) {
      if (param[0] === "id") {
        id = param[1];
      }
      if (param[0] === "action") {
        action = param[1];
      }
    }

    if (id === "0") {
      this.setState({
        pageTitle: Resources["inboxSummary"][currentLanguage]
      });

      this.columnsGrid[0].field = 'readUnread';
      if (action) {
        Api.get("GetDocApprovalDetailsInbox?action=" + action).then(result => {
          if (result) {
            result.forEach((row, index) => {
              let doc_view = "";
              let subject = "";
              let spliteLink = row.docView.split('/');

              let obj = {
                docId: spliteLink[1],
                projectId: row.projectId,
                projectName: row.projectName,
                arrange: row.arrange,
                docApprovalId: 0,
                isApproveMode: false,
                perviousRoute: window.location.pathname + window.location.search
              };

              let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj))
              let encodedPaylod = CryptoJS.enc.Base64.stringify(parms)
              row.link = "/" + spliteLink[0] + "?id=" + encodedPaylod
              subject = row.subject;
              setTimeout(() => {
                var tableRow = document.querySelectorAll('.grid-body  tr');
                for (let x = 0; x < tableRow.length; x++) {
                  if (x === index) tableRow[x].querySelector('.gridBtns.status ').classList.add(row.status === true ? 'Read' : 'UnRead')
                }
              }, 500);
            });
          }
          this.setState({
            rows: result,
            isLoading: false
          });
        })
      }
    } else {
      this.setState({
        pageTitle: Resources["distributionSummary"][currentLanguage]
      });
      this.columnsGrid[0].field = 'statusText';
      if (action) {
        Api.get("GetDocApprovalDetailsDistributionList?action=" + action + "&pageNumber=" + 0 + "&pageSize=" + 1000).then(result => {
          if (result) {
            result.forEach((row, index) => {
              let spliteLink = row.docView.split('/');

              let obj = {
                docId: spliteLink[1],
                projectId: row.projectId,
                projectName: row.projectName,
                arrange: row.arrange,
                docApprovalId: 0,
                isApproveMode: false,
                perviousRoute: window.location.pathname + window.location.search
              };

              let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj));
              let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);
              row.link = "/" + spliteLink[0] + "?id=" + encodedPaylod;
              setTimeout(() => {
                var tableRow = document.querySelectorAll('.grid-body  tr');
                for (let x = 0; x < tableRow.length; x++) {
                  if (x === index) tableRow[x].querySelector('.gridBtns.status ').classList.add(row.status === true ? 'Read' : 'UnRead')
                }
              }, 500);
            });
          }
          this.setState({
            rows: result != null ? result : [],
            isLoading: false
          });
        });
      }
    }
  }
 
  hideFilter(value) {
    this.setState({ viewfilter: !this.state.viewfilter });

    return this.state.viewfilter;
  }

  filterMethodMain = (event, query, apiFilter) => {
    var stringifiedQuery = JSON.stringify(query);

    this.setState({
      isLoading: true,
      query: stringifiedQuery
    });

    Api.get("").then(result => {
      if (result.length > 0) {
        this.setState({
          rows: result != null ? result : [],
          isLoading: false
        });
      } else {
        this.setState({
          isLoading: false
        });
      }
    })
      .catch(ex => {
        alert(ex);
        this.setState({
          rows: [],
          isLoading: false
        });
      });
  };

  onRowClick = (obj) => {
    if (obj) {

      if (obj.status !== true) {
        Api.get("UpdateStatusInbox?id=" + obj.id);
      }
      let spliteLink = obj.docView.split('/');

      let objRout = {
        docId: spliteLink[1],
        projectId: obj.projectId,
        projectName: obj.projectName,
        arrange: obj.arrange,
        docApprovalId: 0,
        isApproveMode: false,
        perviousRoute: window.location.pathname + window.location.search
      }
      let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(objRout));
      let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);
      this.props.history.push({
        pathname: "/" + spliteLink[0],
        search: "?id=" + encodedPaylod
      });
    }
  }

  cellClick = (cell) => {
    if (cell.status !== true) Api.get("UpdateStatusInbox?id=" + cell.id);
  }

  render() {
    const dataGrid =
      this.state.isLoading === false ? (
        <GridCustom
          ref='custom-data-grid'
          key="ClosedSummaryDetails"
          data={this.state.rows}
          pageSize={this.state.rows.length}
          groups={[]}
          actions={[]}
          rowActions={[]}
          cells={this.columnsGrid}
          rowClick={(cell) => { this.onRowClick(cell) }}
        />
      ) : <LoadingSection />;

    const btnExport = this.state.isLoading === false ?
      <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.state.columns} fileName={this.state.pageTitle} />
      : <LoadingSection />;

    // const ComponantFilter = this.state.isLoading === false ?
    //   <Filter
    //     filtersColumns={this.state.filtersColumns}
    //     apiFilter={this.state.apiFilter}
    //     filterMethod={this.filterMethodMain}
    //   /> : <LoadingSection />;


    return (
      <div className="mainContainer main__withouttabs">
        <div className="submittalFilter readOnly__disabled">
          <div className="subFilter">
            <h3 className="zero">{this.state.pageTitle}</h3>
            <span>{this.state.rows.length}</span>
          </div>
          <div className="filterBTNS">
            {btnExport}
          </div>
          <div className="rowsPaginations readOnly__disabled">
            <div className="linebylineInput valid-input">
              <label className="control-label"> {Resources.totalDocs[currentLanguage]} </label>
              <div className="ui input inputDev" style={{ width: "100px", margin: " 10px " }}>
                <input type="text" className="form-control" id="totalDocs" value={this.state.rows.length} readOnly name="totalDocs"
                  placeholder={Resources.totalDocs[currentLanguage]} />
              </div>
            </div>
            <div className="linebylineInput valid-input">
              <label className="control-label"> {Resources.readedDocs[currentLanguage]} </label>
              <div className="ui input inputDev" style={{ width: "100px", margin: " 10px " }}>
                <input type="text" className="form-control" id="readedDocs" value={this.state.rows.filter(x => x.status === true).length}
                  readOnly name="readedDocs" placeholder={Resources.readedDocs[currentLanguage]} />
              </div>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DistributionInboxListSummaryDetails));