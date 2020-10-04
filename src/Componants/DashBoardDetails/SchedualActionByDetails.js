import React, { Component } from "react";
import Api from "../../api";
import LoadingSection from "../publicComponants/LoadingSection";
import Export from "../OptionsPanels/Export";
import Resources from "../../resources.json";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as communicationActions from "../../store/actions/communication";
import GridCustom from "../../Componants/Templates/Grid/CustomGrid";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

let action = null;

class SchedualActionByDetails extends Component {
  constructor(props) {
    super(props);

    const query = new URLSearchParams(this.props.location.search);

    for (let param of query.entries()) {
      action = param[1];
    }

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
        field: 'subject',
        title: Resources['subject'][currentLanguage],
        width: 20,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true,
      },
      {
        field: 'docDelay',
        title: Resources['delay'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true,
      },
      {
        field: 'requiredDate',
        title: Resources['requiredDate'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "date",
        sortable: true,
      },
      {
        field: 'statusText',
        title: Resources['dateType'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true,
      },
      {
        field: 'companyName',
        title: Resources['CompanyName'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true,
      }
    ];
    const filtersColumns = [
      {
        field: "docNo",
        name: "docNo",
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
        field: "docDelay",
        name: "delay",
        type: "string",
        isCustom: true
      },
      {
        key: "requiredDate",
        name: "requiredDate",
        type: "date",
        isCustom: true
      },
      {
        field: "statusText",
        name: "dateType",
        type: "string",
        isCustom: true
      },
      {
        field: "companyName",
        name: "CompanyName",
        type: "string",
        isCustom: true
      }
    ];
    this.state = {
      pageTitle: Resources["schedualActionBy"][currentLanguage],
      viewfilter: false,
      columns: columnGrid,
      isLoading: true,
      rows: [],
      filtersColumns: filtersColumns,
      isCustom: true,
      pageNumber:0,
      pageSize:100,
      totalRows:0
    };
  }
  componentDidMount() {

    this.props.actions.RouteToTemplate();

    if (action) {
      Api.get("GetActionsByScheduleSummaryDetails?action=" + action+"&pageNumber=" + this.state.pageNumber + "&pageSize=" + this.state.pageSize).then(
        result => {
          this.setState({
            rows: result != null ? result.data : [],
            totalRows:result !=null?result.total:0,
            isLoading: false
          });
        }
      ).catch(ex => {
        alert(ex);
        this.setState({
          rows: [],
          isLoading: false
        });
      });
    }
  }

  GetPrevoiusData() {
    let pageNumber = this.state.pageNumber - 1;
    if (pageNumber >= 0) {
      this.setState({
        isLoading: true,
        pageNumber: pageNumber
      });
      if (action) {
        Api.get("GetScheduleAlertSummary?action=" + action + "&pageNumber=" + pageNumber + "&pageSize=" + this.state.pageSize).then(result => {
          let oldRows = [];
          const newRows = [...oldRows, ...result.data];
          this.setState({
            rows: newRows,
            totalRows: result.total,
            isLoading: false
          });
        }).catch(ex => {
          let oldRows = this.state.rows;
          this.setState({
            rows: oldRows,
            isLoading: false
          });
        });
      }
    }
  };

  GetNextData() {
    let pageNumber = this.state.pageNumber + 1;
    let maxRows = this.state.totalRows;
    if (this.state.pageSize * this.state.pageNumber <= maxRows) {
      this.setState({
        isLoading: true,
        pageNumber: pageNumber
      });
      if (action) {
        Api.get("GetScheduleAlertSummary?action=" + action + "&pageNumber=" + pageNumber + "&pageSize=" + this.state.pageSize).then(result => {
          let oldRows = [];
          const newRows = [...oldRows, ...result.data];
          this.setState({
            rows: newRows,
            totalRows: result.total,
            isLoading: false
          });

        }).catch(ex => {
          let oldRows = this.state.rows;
          this.setState({
            rows: oldRows,
            isLoading: false
          });
        });
      }
    }
  };

  render() {
    const dataGrid =
      this.state.isLoading === false ? (
        <GridCustom
          ref='custom-data-grid'
          key="SchedualActionByDetails"
          data={this.state.rows}
          pageSize={this.state.rows.length}
          groups={[]}
          actions={[]}
          rowActions={[]}
          cells={this.state.columns}
          rowClick={(cell) => { this.rowClick(cell) }}
        />
      ) : <LoadingSection />;

    const btnExport = this.state.isLoading === false ?
      <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.state.columns} fileName={this.state.pageTitle} />
      : <LoadingSection />;
    return (
      <div className="mainContainer">
        <div className="submittalFilter readOnly__disabled">
          <div className="subFilter">
            <h3 className="zero"> {this.state.pageTitle}</h3>
            <span>{this.state.totalRows}</span>
          </div>
          <div className="filterBTNS">
            {btnExport}
          </div>
          <div className="rowsPaginations readOnly__disabled">
              <div className="rowsPagiRange">
                <span>{this.state.pageSize * this.state.pageNumber + 1}</span> -
                <span>
                  {/* {this.state.filterMode ? this.state.totalRows : this.state.pageSize * this.state.pageNumber + this.state.pageSize} */}
                  {this.state.filterMode ? this.state.totalRows : this.state.rows.length+(this.state.pageSize * this.state.pageNumber)}
                </span>
                {Resources['jqxGridLanguage'][currentLanguage].localizationobj.pagerrangestring}
                <span> {this.state.totalRows}</span>
              </div>
              <button className={this.state.pageNumber == 0 ? "rowunActive" : ""} onClick={() => this.GetPrevoiusData()}><i className="angle left icon" /></button>
              <button className={this.state.totalRows !== this.state.pageSize * this.state.pageNumber + this.state.pageSize ? "rowunActive" : ""} onClick={() => this.GetNextData()}>
                <i className="angle right icon" />
              </button>
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
    showModal: state.communication.showModal
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(communicationActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SchedualActionByDetails));
