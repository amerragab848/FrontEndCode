import React, { Component } from "react";
import Api from "../../api";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import Export from "../OptionsPanels/Export";
import Resources from "../../resources.json";
import GridCustom from 'react-customized-grid';

let currentLanguage =
  localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
class ActionBySummaryDetails extends Component {
  constructor(props) {
    super(props);
    var columnsGrid = [
      {
        field: 'docNo',
        title: Resources['numberAbb'][currentLanguage],
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
        field: 'actionBy',
        title: Resources['actionByContact'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true,
      },
      {
        field: 'docTypeName',
        title: Resources['docType'][currentLanguage],
        width: 10,
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
      }
    ];
    const filtersColumns = [
      {
        field: "docNo",
        name: "numberAbb",
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
        field: "actionBy",
        name: "actionByContact",
        type: "string",
        isCustom: true
      },
      {
        field: "docTypeName",
        name: "docType",
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
        field: "requiredDate",
        name: "requiredDate",
        type: "date",
        isCustom: true
      }
    ];
    this.state = {
      pageTitle: Resources["actionBySummary"][currentLanguage],
      viewfilter: false,
      columns: columnsGrid,
      isLoading: true,
      rows: [],
      filtersColumns: filtersColumns,
      isCustom: true
    };
  }
  componentDidMount() {
    const query = new URLSearchParams(this.props.location.search);
    let action = null;
    for (let param of query.entries()) {
      action = param[1];
    }
    if (action) {
      Api.get("GetActionsBySummaryDetails?action=" + action).then(result => {
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
  render() {
    const dataGrid =
      this.state.isLoading === false ? (
        <GridCustom ref='custom-data-grid' groups={[]} data={this.state.rows || []} cells={this.state.columns}
          pageSize={this.state.rows.length} actions={[]} rowActions={[]} rowClick={() => { }}
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

export default ActionBySummaryDetails;
