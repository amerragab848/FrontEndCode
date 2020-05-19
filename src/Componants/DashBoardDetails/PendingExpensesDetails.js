import React, { Component } from "react";
import Api from "../../api";
import LoadingSection from "../publicComponants/LoadingSection";
import Export from "../OptionsPanels/Export";
import GridCustom from "../../Componants/Templates/Grid/CustomGrid";
import { Filters } from "react-data-grid-addons";
import Resources from "../../resources.json";
import CryptoJS from "crypto-js";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
const { NumericFilter, AutoCompleteFilter, MultiSelectFilter, SingleSelectFilter } = Filters;
class PendingExpensesDetails extends Component {
  constructor(props) {
    super(props);
    const columnGrid = [
      {
        field: 'arrangeLevel',
        title: Resources['levelNo'][currentLanguage],
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
        classes:'bold',
        href:'link'
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
        field: 'contactName',
        title: Resources['ContactName'][currentLanguage],
        width: 15,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true,
      },
      {
        field: 'total',
        title: Resources['total'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "number",
        sortable: true,
      },
      {
        field: 'requestDate',
        title: Resources['requestDate'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "date",
        sortable: true,
      },
      {
        field: 'number',
        title: Resources['arrange'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "number",
        sortable: true,
      },
      {
        field: 'expensesTypeName',
        title: Resources['expensesType'][currentLanguage],
        width: 10,
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
        field: 'Attachments',
        title: Resources['attachments'][currentLanguage],
        width: 15,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true,
      }
    ];
    const filtersColumns = [
      {
        field: "arrangeLevel",
        name: "levelNo",
        type: "number",
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
        field: "contactName",
        name: "ContactName",
        type: "string",
        isCustom: true
      },
      {
        field: "total",
        name: "total",
        type: "number",
        isCustom: true
      },
      {
        field: "requestDate",
        name: "requestDate",
        type: "date",
        isCustom: true
      },
      {
        field: "number",
        name: "arrange",
        type: "number",
        isCustom: true
      },
      {
        field: "expensesTypeName",
        name: "expensesType",
        type: "string",
        isCustom: true
      },
      {
        field: "actionBy",
        name: "actionByContact",
        type: "string",
        isCustom: true
      }
    ];
    this.state = {
      pageTitle: Resources["pendingExpenses"][currentLanguage],
      viewfilter: false,
      columns: columnGrid,
      isLoading: true,
      rows: [],
      isCustom: true
    };
  }
  componentDidMount() {
    Api.get("GetExpensesWorkFlowTransactionByContactId").then(result => {
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
          row.link = "/expensesUserAddEdit" + "?id=" + encodedPaylod
        }
       })
      this.setState({
        rows: result != null ? result : [],
        isLoading: false
      });
    });
  }
   onRowClick = (obj) => {
    if (this.state.RouteEdit !== '') {
      console.log(obj)
      let objRout = {
        id: obj.expenseId,
        workFlowId: obj.workFlowId,
        workFlowItemId: obj.workFlowItemId,
        arrangeLevel: obj.arrangeLevel,
        cycleId: obj.cycleId,
        currentArrange: obj.currentArrange,
        transactionId: obj.transactionId,
      }
      let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(objRout));
      let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);
      this.props.history.push({
        pathname: "/expensesUserAddEdit",
        search: "?id=" + encodedPaylod
      });
    }
  }
  render() {
    const dataGrid =
      this.state.isLoading === false ? (
        <GridCustom
        ref='custom-data-grid'
        key="PendingExpensesDetails"
        data={this.state.rows}
        pageSize={this.state.rows.length}
        groups={[]}
        actions={[]}
        rowActions={[]}
        cells={this.state.columns}
        rowClick={(cell) => {this.onRowClick(cell)}}
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
          <div className="filterBTNS"> {btnExport} </div>
           <div className="rowsPaginations readOnly__disabled">
            <div className="rowsPagiRange">
              <span>0</span> - <span>30</span> of<span> 156</span>
            </div>
            <button className="rowunActive"> <i className="angle left icon" /></button>
            <button><i className="angle right icon" /></button>
          </div>
        </div>
        <div className="filterHidden" style={{ maxHeight: this.state.viewfilter ? "" : "0px", overflow: this.state.viewfilter ? "" : "hidden" }}>
          <div className="gridfillter-container">  </div>
        </div>
        <div>{dataGrid}</div>
      </div>
    );
  }
}
export default PendingExpensesDetails;
