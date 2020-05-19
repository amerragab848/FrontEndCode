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

class SchedualActionByDetails extends Component {
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
      Api.get("GetActionsByScheduleSummaryDetails?action=" + action).then(
        result => {
          this.setState({
            rows: result != null ? result : [],
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
    showModal: state.communication.showModal
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(communicationActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SchedualActionByDetails));
