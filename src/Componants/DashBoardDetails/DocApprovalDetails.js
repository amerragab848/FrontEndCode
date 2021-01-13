import React, { Component } from "react";
import Api from "../../api";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import Export from "../OptionsPanels/Export";
import Resources from "../../resources.json";
import CryptoJS from 'crypto-js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as communicationActions from '../../store/actions/communication';
import GridCustom from "../../Componants/Templates/Grid/CustomGrid";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
let action = null;
class DocApprovalDetails extends Component {

  constructor(props) {
    super(props);
    const query = new URLSearchParams(props.location.search);

    for (let param of query.entries()) {
      action = param[1];
    }
    const columnsGrid = [
      { title: '', type: 'check-box', fixed: true, field: 'id' },
      {
        field: "readStatusText",
        title: Resources["statusName"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 6,
        sortable: true,
        type: "text",
        hidden: false,
        conditionalClasses: obj => {
          return obj.readStatusText == "Read" ? ' gridBtns status Read' : ' gridBtns status UnRead';
        }
      },
      {
        field: "subject",
        title: Resources["subject"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 16,
        sortable: true,
        type: "text",
        hidden: false,
        href: 'link',
        onRightClick: (e, cell) => {
          if (e.readStatus != true) {
            Api.post("UpdateStatusWorkFlow?id=" + e.id);
          }
        },
        classes: 'bold'
      },
      {
        field: "creationDate",
        title: Resources["docDate"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 8,
        sortable: true,
        hidden: false,
        type: "date"
      },
      {
        field: "duration2",
        title: Resources["durationDays"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 8,
        sortable: true,
        hidden: false,
        type: "number"
      },
      {
        field: "arrange",
        title: Resources["levelNo"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 6,
        sortable: true,
        hidden: false,
        type: "text"
      },
      {
        field: "actionBy",
        title: Resources["actionByContact"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 10,
        sortable: true,
        hidden: false,
        type: "text"
      },
      {
        field: "fileNumber",
        title: Resources["fileNumber"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 10,
        sortable: true,
        hidden: false,
        type: "text"
      },
      {
        field: "companyType",
        title: Resources["companyType"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 10,
        sortable: true,
        hidden: false,
        type: "text"
      },
      {
        field: "openedBy",
        title: Resources["openedBy"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 10,
        sortable: true,
        hidden: false,
        type: "text"

      },
      {
        field: "description",
        title: Resources["description"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 8,
        sortable: true,
        hidden: false,
        type: "text"
      },
      {
        field: "projectName",
        title: Resources["projectName"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 8,
        sortable: true,
        hidden: false,
        type: "text"
      },
      {
        field: "docType",
        title: Resources["docType"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 8,
        sortable: true,
        hidden: false,
        type: "text"
      },
      {
        field: "refDoc",
        title: Resources["docNo"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 6,
        sortable: true,
        hidden: false,
        type: "text"
      },
      {
        field: "docReferance",
        title: Resources["refDoc"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 6,
        sortable: true,
        hidden: false,
        type: "text"
      },
      {
        field: "lastApprovalDate",
        title: Resources["lastApproveDate"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 10,
        sortable: true,
        hidden: false,
        type: "date"
      },
      {
        field: "delayDuration",
        title: Resources["delay"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 6,
        sortable: true,
        hidden: false,
        type: "text"
      },
      {
        field: "dueDate",
        title: Resources["dueDate"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 10,
        sortable: true,
        hidden: false,
        type: "date"
      },
      {
        field: "lastSendDate",
        title: Resources["lastSendDate"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 10,
        sortable: true,
        hidden: false,
        type: "date"
      },
      {
        field: "lastSendTime",
        title: Resources["lastSendTime"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 8,
        sortable: true,
        hidden: false,
        type: "text"
      },
      {
        field: "lastApproveTime",
        title: Resources["lastApprovedTime"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 8,
        sortable: true,
        hidden: false,
        type: "text"
      }
    ];

    const filtersColumns = [
      {
        field: "readStatusText",
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
        field: "creationDate",
        name: "docDate",
        type: "date",
        isCustom: true
      },
      {
        field: "duration2",
        name: "durationDays",
        type: "string",
        isCustom: true
      },
      {
        field: "arrange",
        name: "levelNo",
        type: "string",
        isCustom: true
      },
      {
        field: "actionBy",
        name: "actionByContact",
        type: "string",
        isCustom: true
      },
      {
        field: "companyType",
        name: "companyType",
        type: "string",
        isCustom: true
      },
      {
        field: "fileNumber",
        name: "fileNumber",
        type: "string",
        isCustom: true
      },
      {
        field: "openedBy",
        name: "openedBy",
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
        field: "docType",
        name: "docType",
        type: "string",
        isCustom: true
      },
      {
        field: "delayDuration",
        name: "delay",
        type: "date",
        isCustom: true
      }
    ];

    let gridName = 'Doc_' + (action == "1" ? "RejectList" : "ApproveList");

    this.state = {
      action: action,
      pageTitle: "",
      viewfilter: false,
      isFilter: false,
      isCustom: true,
      gridLoader: false,
      isLoading: true,
      columns: columnsGrid,
      rows: [],
      filtersColumns: filtersColumns,
      apiFilter: "",
      groups: [],
      gridName: gridName
    };
  }

  componentDidMount() {

    this.props.actions.RouteToTemplate();

    var currentGP = [];

    let gridName = 'Doc_' + (action == "1" ? "RejectList" : "ApproveList");

    this.setState({
      gridName: gridName
    });

    var selectedCols = JSON.parse(localStorage.getItem(gridName)) || [];
    let itemsColumns = this.state.columns;
    if (selectedCols.length === 0) {
      var gridLocalStor = { columnsList: [], groups: [] };
      gridLocalStor.columnsList = JSON.stringify(itemsColumns);
      gridLocalStor.groups = JSON.stringify(currentGP);
      localStorage.setItem(this.state.gridName, JSON.stringify(gridLocalStor));
    }
    else {
      var parsingList = JSON.parse(selectedCols.columnsList);
      for (var item in parsingList) {
        for (var i in itemsColumns) {
          if (itemsColumns[i].field === parsingList[item].field) {
            let status = parsingList[item].hidden
            itemsColumns[i].hidden = status
            break;
          }
        }
      };
      currentGP = JSON.parse(selectedCols.groups);
    }

    this.setState({
      groups: currentGP
    });

    if (this.state.action === "1") {
      this.setState({
        pageTitle: Resources["docRejected"][currentLanguage]
      });

      localStorage.setItem("lastRoute", "/DocApprovalDetails?action=1");

      Api.get("GetRejectedRequestsDocApprove").then(result => {
        const newRows = [...result];

        newRows.forEach((row, index) => {
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

            if (row.docLink == "addEditModificationDrawing") {
              obj.isModification = true;
            }
            let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj));

            let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);

            let doc_view = "/" + row.docLink.replace("/", "") + "?id=" + encodedPaylod;

            subject = doc_view;
          }
          row.link = subject;
        });
        this.setState({
          rows: newRows != null ? newRows : [],
          isLoading: false
        });
      });

    } else {
      this.setState({
        pageTitle: Resources["docApproval"][currentLanguage]
      });

      localStorage.setItem("lastRoute", "/DocApprovalDetails?action=2");

      Api.get("GetApprovalRequestsDocApprove").then(result => {
        const newRows = [...result];
        newRows.forEach((row, index) => {
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

            if (row.docLink == "addEditModificationDrawing") {
              obj.isModification = true;
            }

            let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj)); 
            let encodedPaylod = CryptoJS.enc.Base64.stringify(parms); 
            let doc_view = "/" + row.docLink.replace("/", "") + "?id=" + encodedPaylod;
            subject = doc_view;
          }
          row.link = subject;
        });

        this.setState({
          rows: newRows != null ? newRows : [],
          isLoading: false
        });

      });
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

    this.setState({
      isLoading: false
    });

  };

  onRowClick = (obj) => {
    if (obj) {

      if (obj.readStatus != true) {
        Api.post("UpdateStatusWorkFlow?id=" + obj.id);
      }
      let objRout = {
        docId: obj.docId,
        projectId: obj.projectId,
        projectName: obj.projectName,
        arrange: obj.arrange,
        docApprovalId: obj.accountDocWorkFlowId,
        isApproveMode: true,
        perviousRoute: window.location.pathname + window.location.search
      }
      if (obj.docLink == "addEditModificationDrawing") {
        objRout.isModification = true;
      }
      let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(objRout));
      let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);
      this.props.history.push({
        pathname: "/" + obj.docLink,
        search: "?id=" + encodedPaylod
      });
    }
  }

  changeValueOfProps = () => {
    this.setState({ isFilter: false });
  };

  render() {
    const dataGrid = this.state.isLoading === false ? (
      < GridCustom
        gridKey={this.state.gridName}
        data={this.state.rows}
        cells={this.state.columns}
        actions={[]}
        rowActions={[]}
        rowClick={cell => {
          if (cell) {
            if (cell.readStatus != true) {
              Api.post("UpdateStatusWorkFlow?id=" + cell.id);
            }
            let objRout = {
              docId: cell.docId,
              projectId: cell.projectId,
              projectName: cell.projectName,
              arrange: cell.arrange,
              docApprovalId: cell.accountDocWorkFlowId,
              isApproveMode: true,
              perviousRoute: window.location.pathname + window.location.search
            }
            if (cell.docLink == "addEditModificationDrawing") {
              objRout.isModification = true;
            }
            let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(objRout));
            let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);
            this.props.history.push({
              pathname: "/" + cell.docLink,
              search: "?id=" + encodedPaylod
            });
          }
        }
        }
        groups={this.state.groups}
        isFilter={this.state.isFilter}
        changeValueOfProps={this.changeValueOfProps.bind(this)} />
    ) : <LoadingSection />;



    const btnExport = this.state.isLoading === false ? <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.state.columns} fileName={this.state.pageTitle} /> : <LoadingSection />;

    return (
      <div className="mainContainer main__withouttabs">
        <div className="submittalFilter readOnly__disabled">
          <div className="subFilter">
            <h3 className="zero">{this.state.pageTitle}</h3>
            <span>{this.state.rows.length}</span>
            <div
              className="ui labeled icon top right pointing dropdown fillter-button"
              tabIndex="0"
              onClick={() => this.hideFilter(this.state.viewfilter)} >

            </div>
          </div>
          <div className="rowsPaginations readOnly__disabled">

            <div className="linebylineInput valid-input">
              <label className="control-label">
                {Resources.readedDocs[currentLanguage]}
              </label>
              <div className="ui input inputDev" style={{ width: "100px", margin: " 10px " }}>
                <input type="text" className="form-control" id="readedDocs" value={this.state.rows.filter(x => x.readStatus === true).length}
                  readOnly name="readedDocs" placeholder={Resources.readedDocs[currentLanguage]} />
              </div>
            </div>
          </div>
          <div className="filterBTNS">
            {btnExport}
          </div>
        </div>

        <div>{dataGrid}</div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    showLeftMenu: state.communication.showLeftMenu
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(communicationActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DocApprovalDetails);
