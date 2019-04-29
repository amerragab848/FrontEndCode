import React, { Component } from "react";
import Api from "../../api";
import Filter from "../FilterComponent/filterComponent";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import Export from "../OptionsPanels/Export"; 
import GridSetup from "../../Pages/Communication/GridSetup";
import { Filters } from "react-data-grid-addons"; 
import Resources from "../../resources.json";
import moment from "moment"; 
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

const statusButton = ({ value, row }) => {
  let doc_view = "";
    if(row){
      if (row.status === true) {
        doc_view = <div style={{textAlign:'center',margin:'4px auto',padding:'4px 10px',borderRadius:'26px',backgroundColor:'#5FD45F',width:'100%',color:'#fff', fontSize: '12px'}}>{Resources["read"][currentLanguage]}</div>
      }else{
        doc_view = <div style={{textAlign:'center',padding:'4px 10px',margin:'4px auto',borderRadius:'26px',backgroundColor:'#E74C3C',width:'100%',color:'#FFF',fontSize: '12px'}}>{Resources["unRead"][currentLanguage]}</div>
      } 
        return doc_view; 
    }
    return null;
};

class DistributionInboxListSummaryDetails extends Component {
  constructor(props) {
    super(props);

    var columnsGrid = [
      {
        key: "statusText",
        name: Resources["statusName"][currentLanguage],
        width: 90,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: SingleSelectFilter,
        formatter:statusButton
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
        filterRenderer: SingleSelectFilter
      },
      {
        key: "projectName",
        name: Resources["projectName"][currentLanguage],
        width: 155,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: SingleSelectFilter
      },
      {
        key: "fromAccountName",
        name: Resources["from"][currentLanguage],
        width: 155,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: SingleSelectFilter
      },
      {
        key: "comment",
        name: Resources["comment"][currentLanguage],
        width: 155,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: SingleSelectFilter
      },
      {
        key: "creationDate",
        name: Resources["sendDate"][currentLanguage],
        width: 155,
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
      columns: columnsGrid,
      isLoading: true,
      rows: [],
      filtersColumns: filtersColumns,
      isCustom: true,
      pageTitle: "",
      apiFilter:""
    };
  }
 
  componentWillMount() {
    let id = null;
    let action = null;

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
      if (action) {
        Api.get("GetDocApprovalDetailsInbox?action=" + action).then(result => {
         
          this.setState({
            rows: result,
            isLoading: false
          });
        });
      }
    } else {
      this.setState({
        pageTitle: Resources["distributionSummary"][currentLanguage]
      });
      if (action) {
        Api.get(
          "GetDocApprovalDetailsDistributionList?action=" +
            action +
            "&pageNumber=" +
            0 +
            "&pageSize=" +
            200
        ).then(result => {
        
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

  render() {

    const dataGrid =
      this.state.isLoading === false ? (
        <GridSetup rows={this.state.rows} columns={this.state.columns} showCheckbox={false}/>
      ) : <LoadingSection/>;

      const btnExport = this.state.isLoading === false ? 
      <Export rows={ this.state.isLoading === false ?  this.state.rows : [] }  columns={this.state.columns} fileName={this.state.pageTitle} /> 
      : <LoadingSection /> ;

      const ComponantFilter= this.state.isLoading === false ?   
      <Filter
        filtersColumns={this.state.filtersColumns}
        apiFilter={this.state.apiFilter}
        filterMethod={this.filterMethodMain} 
      /> : <LoadingSection />;


    return (
      <div className="mainContainer">
        <div className="submittalFilter">
          <div className="subFilter">
            <h3 className="zero">{this.state.pageTitle}</h3>
            <span>{this.state.rows.length}</span>
            <div  className="ui labeled icon top right pointing dropdown fillter-button" tabIndex="0" onClick={() => this.hideFilter(this.state.viewfilter)}>
              <span>
                <svg
                  width="16px"
                  height="18px"
                  viewBox="0 0 16 18"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                >
                  <g
                    id="Symbols"
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                  >
                    <g
                      id="Action-icons/Filters/Hide+text/24px/Grey_Base"
                      transform="translate(-4.000000, -3.000000)"
                    >
                      <g id="Group-4">
                        <g id="Group-7">
                          <g id="filter">
                            <rect
                              id="bg"
                              fill="#80CBC4"
                              opacity="0"
                              x="0"
                              y="0"
                              width="24"
                              height="24"
                            />
                            <path
                              d="M15.5116598,15.1012559 C14.1738351,15.1012559 13.0012477,14.2345362 12.586259,12.9819466 L4.97668038,12.9819466 C4.43781225,12.9819466 4,12.5415758 4,12 C4,11.4584242 4.43781225,11.0180534 4.97668038,11.0180534 L12.586259,11.0180534 C13.0012477,9.76546385 14.1738351,8.89874411 15.5116598,8.89874411 C16.8494845,8.89874411 18.0220719,9.76546385 18.4370606,11.0180534 L19.0233196,11.0180534 C19.5621878,11.0180534 20,11.4584242 20,12 C20,12.5415758 19.5621878,12.9819466 19.0233196,12.9819466 L18.4370606,12.9819466 C18.0220719,14.2345362 16.8494845,15.1012559 15.5116598,15.1012559 Z M15.5116598,10.8626374 C14.8886602,10.8626374 14.3813443,11.372918 14.3813443,12 C14.3813443,12.627082 14.8886602,13.1373626 15.5116598,13.1373626 C16.1346594,13.1373626 16.6419753,12.627082 16.6419753,12 C16.6419753,11.372918 16.1346594,10.8626374 15.5116598,10.8626374 Z M7.78600823,9.20251177 C6.44547873,9.20251177 5.27202225,8.33246659 4.8586039,7.07576209 C4.37264206,7.01672011 4,6.60191943 4,6.10125589 C4,5.60059914 4.37263163,5.1858019 4.85858244,5.12675203 C5.27168513,3.86979791 6.44573643,3 7.78600823,3 C9.1238329,3 10.2964204,3.86671974 10.711409,5.11930926 L19.0233196,5.11930926 C19.5621878,5.11930926 20,5.5596801 20,6.10125589 C20,6.64283167 19.5621878,7.08320251 19.0233196,7.08320251 L10.711409,7.08320251 C10.2964204,8.33579204 9.1238329,9.20251177 7.78600823,9.20251177 Z M7.78600823,4.96389325 C7.1630086,4.96389325 6.65569273,5.4741739 6.65569273,6.10125589 C6.65569273,6.72833787 7.1630086,7.23861852 7.78600823,7.23861852 C8.40900786,7.23861852 8.91632373,6.72833787 8.91632373,6.10125589 C8.91632373,5.4741739 8.40900786,4.96389325 7.78600823,4.96389325 Z M13.1695709,18.8806907 C12.7545822,20.1332803 11.5819948,21 10.2441701,21 C8.90634542,21 7.73375797,20.1332803 7.3187693,18.8806907 L4.97668038,18.8806907 C4.43781225,18.8806907 4,18.4403199 4,17.8987441 C4,17.3571683 4.43781225,16.9167975 4.97668038,16.9167975 L7.3187693,16.9167975 C7.73375797,15.664208 8.90634542,14.7974882 10.2441701,14.7974882 C11.5819948,14.7974882 12.7545822,15.664208 13.1695709,16.9167975 L19.0233196,16.9167975 C19.5621878,16.9167975 20,17.3571683 20,17.8987441 C20,18.4403199 19.5621878,18.8806907 19.0233196,18.8806907 L13.1695709,18.8806907 Z M10.2441701,16.7613815 C9.62117047,16.7613815 9.1138546,17.2716621 9.1138546,17.8987441 C9.1138546,18.5258261 9.62117047,19.0361068 10.2441701,19.0361068 C10.8671697,19.0361068 11.3744856,18.5258261 11.3744856,17.8987441 C11.3744856,17.2716621 10.8671697,16.7613815 10.2441701,16.7613815 Z"
                              id="Shape"
                              fill="#5E6475"
                              fillRule="nonzero"
                            />
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              </span>

              {this.state.viewfilter === false ? (
                <span className="text active">
                  <span className="show-fillter">
                    {Resources["showFillter"][currentLanguage]}
                  </span>
                  <span className="hide-fillter">
                    {Resources["hideFillter"][currentLanguage]}
                  </span>
                </span>
              ) : (
                <span className="text">
                  <span className="show-fillter">
                    {Resources["showFillter"][currentLanguage]}
                  </span>
                  <span className="hide-fillter">
                    {Resources["hideFillter"][currentLanguage]}
                  </span>
                </span>
              )}
            </div>
          </div>
          <div className="filterBTNS">
            {btnExport}
          </div> 
        </div>
        <div
          className="filterHidden"
          style={{ maxHeight: this.state.viewfilter ? "" : "0px", overflow: this.state.viewfilter ? "" : "hidden"}} >
          <div className="gridfillter-container">
          {ComponantFilter}
          </div>
        </div>

        <div>{dataGrid}</div>
      </div>
    );
  }
}

export default DistributionInboxListSummaryDetails;
