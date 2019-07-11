import React, { Component } from "react";
import Api from "../../api";
import moment from "moment";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import Export from "../OptionsPanels/Export"; 
import Filter from "../FilterComponent/filterComponent";
import GridSetup from "../../Pages/Communication/GridSetupWithFilter";
import { Toolbar, Data, Filters } from "react-data-grid-addons";
import Resources from "../../resources.json";
import CryptoJS from "crypto-js";

let currentLanguage =
  localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const {
  NumericFilter,
  AutoCompleteFilter,
  MultiSelectFilter,
  SingleSelectFilter
} = Filters;

const dateFormate = ({ value }) => {
  return value ? moment(value).format("DD/MM/YYYY") : "No Date";
};

let  subjectLink = ({ value, row }) => {
    let doc_view = "";
    let subject = "";
    if (row) {
      doc_view ="/"+ row.docLink + row.id + "/" + row.projectId + "/" + row.projectName;
      subject = row.subject;
      return <a href={doc_view}> {subject} </a>;
    }
    return null;
  };

class FollowUpsSummaryDetails extends Component {
  constructor(props) {
    super(props);

    var columnsGrid = [
      {
        key: "projectName",
        name:  Resources["projectName"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: SingleSelectFilter
      },
      {
        key: "fromCompany",
        name:  Resources["fromCompany"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: SingleSelectFilter
      },
      {
        key: "arrange",
        name:  Resources["arrange"][currentLanguage],
        width: 100,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: SingleSelectFilter
      },
      {
        key: "subject",
        name: Resources["subject"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: SingleSelectFilter,
        formatter:subjectLink
      },
      {
        key: "actionByContactName",
        name: Resources["actionByContact"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: SingleSelectFilter
      },
      {
        key: "approvalStatusName",
        name: Resources["approvalStatus"][currentLanguage],
        width:150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: SingleSelectFilter 
      },
      {
        key: "docTypeName",
        name: Resources["docType"][currentLanguage],
        width:150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: SingleSelectFilter 
      },
      {
        key: "delayDuration",
        name: Resources["delay"][currentLanguage],
        width:150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: SingleSelectFilter 
      },
      {
        key: "duration2",
        name: Resources["durationDays"][currentLanguage],
        width:150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: SingleSelectFilter 
      },
      {
        key: "sendDate",
        name: Resources["sendDate"][currentLanguage],
        width:150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: SingleSelectFilter,
        formatter:dateFormate
      },
      {
        key: "lastApprovalDate",
        name: Resources["lastApprovalDate"][currentLanguage],
        width:150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: SingleSelectFilter,
        formatter:dateFormate
      }
    ];

    const filtersColumns = [
      {
        field: "projectName",
        name: "projectName",
        type: "string",
        isCustom: true
      },
      {
        field: "fromCompany",
        name: "fromCompany",
        type: "string",
        isCustom: true
      },
      {
        field: "arrange",
        name: "arrange",
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
        field: "actionByContactName",
        name: "actionByContact",
        type: "string",
        isCustom: true
      },
      {
        field: "approvalStatusName",
        name: "approvalStatus",
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
        field: "delayDuration",
        name: "delay",
        type: "string",
        isCustom: true
      },
      {
        field: "duration2",
        name: "durationDays",
        type: "string",
        isCustom: true
      },
      {
        field: "sendDate",
        name: "sendDate",
        type: "date",
        isCustom: true
      },
      {
        field: "lastApprovalDate",
        name: "lastApprovalDate",
        type: "date",
        isCustom: true
      }
    ];

    this.state = {
      pageTitle:Resources["followUpsSummaryDetails"][currentLanguage],
      columns: columnsGrid,
      isLoading: true,
      rows: [],
      filtersColumns: filtersColumns,
      isCustom: true
    };
  }

  componentDidMount() { 
      Api.get("GetFollowing").then(result => { 
        this.setState({
          rows: result != null ? result : [],
          isLoading: false
        });
      }); 
  }

 
 
  onRowClick = (obj) => {
    if (this.state.RouteEdit !== '') {
      let objRout = {
        docId: obj.id,
        projectId: obj.projectId,
        projectName: obj.projectName,
        arrange: 0,
        docApprovalId: 0,
        isApproveMode: false,
        perviousRoute:window.location.pathname+window.location.search
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
    const dataGrid = this.state.isLoading === false ?(
    <GridSetup rows={this.state.rows}
     onRowClick={this.onRowClick} 
     columns={this.state.columns} 
     showCheckbox={false}/>) : <LoadingSection/>;

    const btnExport = this.state.isLoading === false ? 
    <Export rows={ this.state.isLoading === false ?  this.state.rows : [] }  columns={this.state.columns} fileName={this.state.pageTitle} /> 
    : <LoadingSection /> ;

   
    return (
      <div className="mainContainer">
        <div className="submittalFilter">
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

export default FollowUpsSummaryDetails;
