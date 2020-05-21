import CryptoJS from 'crypto-js';
import moment from "moment";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import Api from "../../api";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import GridCustom from "../../Componants/Templates/Grid/CustomGrid";
import Resources from "../../resources.json";
import * as communicationActions from "../../store/actions/communication";
import Filter from "../FilterComponent/filterComponent";
import Export from "../OptionsPanels/Export";


let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const dateFormate = ({ value }) => {
  return value ? moment(value).format("DD/MM/YYYY") : "No Date";
};
 

class ClosedSummaryDetails extends Component {
  constructor(props) {
    super(props);

    var columnsGrid = [
      {
        field: 'docNo',
        title: Resources['docNo'][currentLanguage],
        width: 20,
        groupable: true,
        fixed: true,
        type: "text",
        sortable: true,
      },
      {
        field: 'projectName',
        title: Resources['projectName'][currentLanguage],
        width: 20,
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
        sortable: true, href: "link", classes: 'bold'
      },
      {
        field: 'closedBy',
        title: Resources['closedBy'][currentLanguage],
        width: 20,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true,
      },
      {
        field: 'docType',
        title: Resources['docType'][currentLanguage],
        width: 20,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true,
      },
      {
        field: 'oppenedDate',
        title: Resources['openedDate'][currentLanguage],
        width: 20,
        groupable: true,
        fixed: false,
        type: "date",
        sortable: true,
      }

    ];


    const filtersColumns = [
      {
        field: "docNo",
        name: "docNo",
        type: "number",
        isCustom: true
      },
      {
        field: "projectName",
        name: "projectName",
        type: "string",
        isCustom: true
      },
      {
        field: "subject",
        name: "subject",
        type: "string",
        isCustom: true
      },
      {
        field: "closedBy",
        name: "closedBy",
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
        field: "oppenedDate",
        name: "openedDate",
        type: "date",
        isCustom: true
      }
    ];

    this.state = {
      pageTitle: Resources["closedSummary"][currentLanguage],
      viewfilter: false,
      columns: columnsGrid,
      isLoading: true,
      rows: [],
      filtersColumns: filtersColumns,
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
      Api.get("SelectDocTypeByProjectIdClosedByAction?action=" + action + "&pageNumber=" + 0).then(result => {
        result.forEach((row) => { 

          let obj = {
            docId: row.docId,
            projectId: row.projectId,
            projectName: row.projectName,
            arrange: row.arrange,
            docApprovalId: 0,
            isApproveMode: false,
            perviousRoute: window.location.pathname + window.location.search
          };

          let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj));
          let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);
          row.link = "/" + row.docLink + "?id=" + encodedPaylod
        });
        this.setState({
          rows: result != null ? result : [],
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

  rowClick = (rowData) => {
    if (rowData) {
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
          cells={this.state.columns}
          rowClick={(cell) => this.rowClick(cell)}
        />
      ) : <LoadingSection />;

    const btnExport = this.state.isLoading === false ?
      <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.state.columns} fileName={this.state.pageTitle} />
      : <LoadingSection />;

    const ComponantFilter = this.state.isLoading === false ?
      <Filter
        filtersColumns={this.state.filtersColumns}
        apiFilter={this.state.apiFilter}
        filterMethod={this.filterMethodMain}
      /> : <LoadingSection />;

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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ClosedSummaryDetails));