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
class workFlowAlerts extends Component {

  constructor(props) {
    super(props);

    const columnGrid = [
      {
        field: 'arrange',
        title: Resources['arrange'][currentLanguage],
        width: 6,
        groupable: true,
        fixed: true,
        type: "number",
        sortable: true,
      },
      {
        field: 'subject',
        title: Resources['subject'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true,
        classes: 'bold',
        href: 'link'
      },
      {
        field: 'projectName',
        title: Resources['projectName'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      }, {
        field: 'actionByContactName',
        title: Resources['actionByContact'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'docTypeName',
        title: Resources['docType'][currentLanguage],
        width: 6,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'delayDuration',
        title: Resources['delay'][currentLanguage],
        width: 5,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'duration2',
        title: Resources['durationDays'][currentLanguage],
        width: 5,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'sendDate',
        title: Resources['sendDate'][currentLanguage],
        width: 8,
        groupable: true,
        fixed: false,
        type: "date",
        sortable: true
      },
      {
        field: 'lastApprovalDate',
        title: Resources['lastApproveDate'][currentLanguage],
        width: 8,
        groupable: true,
        fixed: false,
        type: "date",
        sortable: true
      }
    ];

    this.state = {
      pageTitle: Resources["workFlowAlert"][currentLanguage],
      viewfilter: false,
      columns: columnGrid,
      isLoading: true,
      rows: [],
      isCustom: true
    };
  }

  componentDidMount() {

    this.props.actions.RouteToTemplate();

    Api.get("GetWorkFlowAlertDetails").then(result => {
      result.forEach(row => {
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

  cellClick = (rowId, colID) => {

    if (colID != 0 && colID != 1) {
      let rowData = this.state.rows[rowId];
      if (this.state.columns[colID].key !== "subject") {
        let obj = {
          docId: rowData.docId,
          projectId: rowData.projectId,
          projectName: rowData.projectName,
          arrange: 0,
          docApprovalId: 0,
          isApproveMode: false,
          perviousRoute: window.location.pathname + window.location.search
        };

        if (rowData.docType === 37 || rowData.docType === 114) {
          obj.isModification = rowData.docTyp === 114 ? true : false;
        }

        let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj));

        let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);

        this.props.history.push({ pathname: "/" + rowData.docLink, search: "?id=" + encodedPaylod });
      }
    }
  };

  onRowClick = (obj) => {
    if (this.state.RouteEdit !== '') {
      let objRout = {
        docId: obj.docId,
        projectId: obj.projectId,
        projectName: obj.projectName,
        arrange: 0,
        docApprovalId: 0,
        isApproveMode: false,
        perviousRoute: window.location.pathname + window.location.search
      }
      let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(objRout));
      let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);
      this.props.history.push({
        pathname: "/" + obj.docLink,
        search: "?id=" + encodedPaylod
      });
    }
  }

  render() {
    const dataGrid = this.state.isLoading === false ? (
      <GridCustom
        ref='custom-data-grid'
        gridKey="WorkFlowAlert"
        data={this.state.rows}
        groups={[]}
        actions={[]}
        rowActions={[]}
        cells={this.state.columns}
        rowClick={(cell) => { this.onRowClick(cell) }}
      />
    ) : <LoadingSection />;

    const btnExport = this.state.isLoading === false ?
      <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.state.columns} fileName={this.state.pageTitle} />
      : <LoadingSection />;
    return (
      <div className="mainContainer">
        <div className="submittalFilter readOnly__disabled">
          <div className="subFilter">
            <h3 className="zero">{this.state.pageTitle}</h3>
            <span>{this.state.rows.length}</span>
          </div>
          <div className="filterBTNS">
            {btnExport}
          </div>
        </div>
        <div className="filterHidden" style={{ maxHeight: this.state.viewfilter ? "" : "0px", overflow: this.state.viewfilter ? "" : "hidden" }}>
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
    showLeftMenu: state.communication.showLeftMenu
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(communicationActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(workFlowAlerts);
