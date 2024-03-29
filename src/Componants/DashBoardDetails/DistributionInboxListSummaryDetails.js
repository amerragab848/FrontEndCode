import React, { Component, Fragment } from "react";
import Api from "../../api";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import Export from "../OptionsPanels/Export";
import Resources from "../../resources.json";
import CryptoJS from 'crypto-js';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as communicationActions from "../../store/actions/communication";
import GridCustom from "../../Componants/Templates/Grid/CustomGrid";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const find = require("lodash/find");

class DistributionInboxListSummaryDetails extends Component {
  constructor(props) {
    super(props);
    let id = null;
    let isDistribution = false;
    const query = new URLSearchParams(this.props.location.search);
    for (let param of query.entries()) {
      if (param[0] === "id") {
        id = param[1];
      }
    }

    if (id === "1") {
      isDistribution = true;
    }

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
        isCustom: true,
      },
      {
        field: "creationDate",
        name: "sendDate",
        type: "date",
        isCustom: true
      },
      {
        field: "sendFor",
        name: "sendFor",
        type: "string",
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
      apiFilter: "",
      pageSize: 500,
      pageNumber: 0,
      totalRows: 0,
      action: null, showPopup: false,
      isDistribution: isDistribution
    };

    this.actions = [
      {
        title: 'Update',
        handleClick: values => {
          this.setState({
            isLoading: true
          });
          values.forEach((row) => {
            let item = find(this.state.rows, function (x) {
              return x.id == row;
            });
            if (item.status !== true) {
              Api.get("UpdateStatusInbox?id=" + row);
            }
            this.setState({
              isLoading: false
            });
          });
        },
        classes: '',
      }
    ];

    this.columnsGrid = [
      { field: 'id', title: '', type: 'check-box', fixed: true, hidden: false },
      {
        field: 'statusText',
        title: Resources['statusName'][currentLanguage],
        width: 10,
        groupable: true,
        sortable: true,
        fixed: true,
        type: "text",
        classes: 'gridBtns status ',
        conditionalClasses: obj => {
          return obj.status == true ? ' Read' : 'UnRead';
        }
      }, {
        field: 'subject',
        title: Resources['subject'][currentLanguage],
        width: 20,
        fixed: false,
        groupable: true,
        type: "text",
        sortable: true, 
        classes: ' bold elipsisPadd',
        onRightClick: cell => { this.cellClick(cell) },
        href: 'link',
      }, {
        field: 'projectName',
        title: Resources['projectName'][currentLanguage],
        width: 10,
        groupable: true, 
        fixed: false,
        type: "text",
        sortable: true,
      }, {
        field: 'fromAccountName',
        title: Resources['from'][currentLanguage],
        width: 15,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true 
      }, {
        field: 'comment',
        title: Resources['comment'][currentLanguage],
        width: 15,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true,
        classes: 'bold elipsisPadd fa fa-comments',
        href: 'link',
        onClick: cell => { this.showPopup(cell) }
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
    if (isDistribution == false) {
      this.columnsGrid.push({
        field: 'sendFor',
        title: Resources['sendFor'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true 
      });
      console.log(this.columnsGrid);
    }
  }

  GetNextData() {
    let pageNumber = this.state.pageNumber + 1;

    this.setState({
      isLoading: true,
      pageNumber: pageNumber
    });
    let url = "GetDocApprovalDetailsDistributionList?action=" + this.state.action + "&pageNumber=" + pageNumber + "&pageSize=" + this.state.pageSize
    Api.get(url).then(result => {
      let oldRows = this.state.rows;
      const newRows = [...oldRows, ...result.data]; // arr3 ==> [1,2,3,3,4,5]
      this.setState({
        rows: newRows,
        totalRows: newRows.length,
        pageSize: this.state.pageSize,
        isLoading: false
      });
    }).catch(ex => {
      let oldRows = this.state.rows;
      this.setState({
        rows: oldRows,
        isLoading: false
      });
    });;
  }

  GetPrevoiusData() {
    let pageNumber = this.state.pageNumber - 1;
    let pageSize = this.state.pageSize;

    this.setState({
      isLoading: true,
      pageNumber: pageNumber
    });

    let url = "GetDocApprovalDetailsDistributionList?action=" + this.state.action + "&pageNumber=" + pageNumber + "&pageSize=" + this.state.pageSize

    Api.get(url).then(result => {
      let oldRows = [];// this.state.rows;
      const newRows = [...oldRows, ...result.data];

      this.setState({
        rows: newRows,
        totalRows: newRows.length,
        pageSize: pageSize,
        isLoading: false
      });
    }).catch(ex => {
      let oldRows = this.state.rows;
      this.setState({
        rows: oldRows,
        isLoading: false
      });
    });;
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
        pageTitle: Resources["inboxSummary"][currentLanguage],
        action: action
      });
 
      if (action) {
        Api.get("GetDocApprovalDetailsInbox?action=" + action).then(result => {
          if (result) {
            result.data.forEach((row, index) => {

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
            });
          }
          this.setState({
            rows: result.data,
            totalRows: result.total,
            isLoading: false
          });
        })
      }
    } else {
      this.setState({
        pageTitle: Resources["distributionSummary"][currentLanguage],
        action: action
      }); 
      if (action) {
        Api.get("GetDocApprovalDetailsDistributionList?action=" + action + "&pageNumber=" + 0 + "&pageSize=" + this.state.pageSize).then(result => {
          if (result) {
            result.data.forEach((row, index) => {
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
              
            });
          }
          this.setState({
            rows: result != null ? result.data : [],
            totalRows: result.total,
            isLoading: false
          });
        });
      }
    }
  }
  showPopup(e) {
    if (e.comment != null) {
      this.setState({
        showPopup: true,
        comment: e.comment
      });
    } else {
      this.setState({
        showPopup: true,
        comment: "No Comment"
      });
    }
  }

  closePopup(e) {
    this.setState({
      showPopup: false
    });
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
          gridKey="ClosedSummaryDetails"
          data={this.state.rows}
          groups={[]}
          actions={this.actions}
          rowActions={[]}
          cells={this.columnsGrid}
          rowClick={(cell) => { this.onRowClick(cell) }}
        />
      ) : <LoadingSection />;

    const btnExport = this.state.isLoading === false ?
      <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.state.columns} fileName={this.state.pageTitle} />
      : <LoadingSection />;

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
            <div className="rowsPagiRange">
              <span>{this.state.pageSize * this.state.pageNumber + 1}</span> -
                <span>
                {this.state.pageSize * this.state.pageNumber + this.state.pageSize}
              </span>
              {Resources['jqxGridLanguagePagerrangestring'][currentLanguage]}
              <span> {this.state.totalRows}</span>
            </div>
            <button className={this.state.pageNumber == 0 ? "rowunActive" : ""} onClick={() => this.GetPrevoiusData()}><i className="angle left icon" /></button>
            <button className={this.state.totalRows !== this.state.pageSize * this.state.pageNumber + this.state.pageSize ? "rowunActive" : ""} onClick={() => this.GetNextData()}>
              <i className="angle right icon" />
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', paddingLeft: '24px' }}>
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
        <div>{dataGrid}</div>
        <Fragment>
          <div className={this.state.showPopup === true ? "popupMedium active" : "popupMedium"}>
            <button onClick={(e) => this.closePopup()} className="workflowComment__closeBtn" type="button" >x</button>
            <div className={this.state.showPopup === true ? "ui modal smallModal active workflowComment" : "ui modal smallModal workflowComment"} id="smallModal2">
              <h2 className="header zero">Comment</h2>
              <p className="zero">{this.state.comment}</p>
              <button onClick={(e) => this.closePopup()} type="button" className="smallBtn primaryBtn-1 btn approve">Close</button>
            </div>
          </div>
        </Fragment>
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