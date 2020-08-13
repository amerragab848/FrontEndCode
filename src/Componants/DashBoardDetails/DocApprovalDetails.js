import React, { Component } from "react";
import Api from "../../api";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import Export from "../OptionsPanels/Export";
import Filter from "../FilterComponent/filterComponent";
import Resources from "../../resources.json";
import CryptoJS from 'crypto-js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as communicationActions from '../../store/actions/communication';
import GridCustom from "../../Componants/Templates/Grid/CustomGrid";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class DocApprovalDetails extends Component {
  
  constructor(props) {
    super(props);

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
        classes: 'gridBtns status '
      },
      {
        field: "subject",
        title: Resources["subject"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 16,
        sortable: true,
        type: "text",
        href: 'link', 
        onRightClick: (e, cell) => {
          if (e.readStatus != true) {
            Api.post("UpdateStatusWorkFlow?id=" + e.id);
          }
        },
        classes: 'bold',
        showTip: true
      },
      {
        field: "creationDate",
        title: Resources["docDate"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 8,
        sortable: true,
        type: "date"
      },
      {
        field: "duration2",
        title: Resources["durationDays"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 8,
        sortable: true,
        type: "number"
      },
      {
        field: "arrange",
        title: Resources["levelNo"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 6,
        sortable: true,
        type: "text"
      },
      {
        field: "actionBy",
        title: Resources["actionByContact"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 10,
        sortable: true,
        type: "text"
      },
      {
        field: "companyType",
        title: Resources["companyType"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 10,
        sortable: true,
        type: "text"
      },
      {
        field: "openedBy",
        title: Resources["openedBy"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 10,
        sortable: true,
        type: "text"

      },
      {
        field: "description",
        title: Resources["description"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 8,
        sortable: true,
        type: "text"
      },
      {
        field: "projectName",
        title: Resources["projectName"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 8,
        sortable: true,
        type: "text"
      },
      {
        field: "docType",
        title: Resources["docType"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 8,
        sortable: true,
        type: "text"
      },
      {
        field: "refDoc",
        title: Resources["docNo"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 6,
        sortable: true,
        type: "text"
      },
      {
        field: "lastApprovalDate",
        title: Resources["lastApproveDate"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 10,
        sortable: true,
        type: "date"
      },
      {
        field: "delayDuration",
        title: Resources["delay"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 6,
        sortable: true,
        type: "text"
      },
      {
        field: "dueDate",
        title: Resources["dueDate"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 10,
        sortable: true,
        type: "date"
      },
      {
        field: "lastSendDate",
        title: Resources["lastSendDate"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 10,
        sortable: true,
        type: "date"
      },
      {
        field: "lastSendTime",
        title: Resources["lastSendTime"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 8,
        sortable: true,
        type: "text"
      },
      {
        field: "lastApproveTime",
        title: Resources["lastApprovedTime"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 8,
        sortable: true,
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

    this.state = {
      pageTitle: "",
      viewfilter: false,
      columns: columnsGrid,
      isLoading: true,
      rows: [],
      filtersColumns: filtersColumns,
      isCustom: true,
      apiFilter: ""
    };
  }

  componentDidMount() {

    this.props.actions.RouteToTemplate();

    const query = new URLSearchParams(this.props.location.search);

    let action = null;

    for (let param of query.entries()) {
      action = param[1];
    }

    if (action === "1") {
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

            let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj));

            let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);

            let doc_view = "/" + row.docLink.replace("/", "") + "?id=" + encodedPaylod;

            subject = doc_view;
          }
          row.link = subject;

          setTimeout(() => {
            var tableRow = document.querySelectorAll('.grid-body  tr');
            for (let x = 0; x < tableRow.length; x++) {
              if (x === index){ tableRow[x].querySelector('.gridBtns.status ').classList.add(row.status === true ? 'Read' : 'UnRead');}
            }
          }, 500);
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

            let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj));

            let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);

            let doc_view = "/" + row.docLink.replace("/", "") + "?id=" + encodedPaylod;

            subject = doc_view;
          }
          row.link = subject;

          setTimeout(() => {
            var tableRow = document.querySelectorAll('.grid-body  tr');
            for (let x = 0; x < tableRow.length; x++) {
              if (x === index) {tableRow[x].querySelector('.gridBtns.status ').classList.add(row.readStatus === true ? 'Read' : 'UnRead');}
            }
          }, 500);
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
      let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(objRout));
      let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);
      this.props.history.push({
        pathname: "/" + obj.docLink,
        search: "?id=" + encodedPaylod
      });
    }
  }

  render() {
    const dataGrid =
      this.state.isLoading === false ? (
        < GridCustom
          key="DocApproval"
          cells={this.state.columns}
          data={this.state.rows}
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
              let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(objRout));
              let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);
              this.props.history.push({
                pathname: "/" + cell.docLink,
                search: "?id=" + encodedPaylod
              });
            }
          }
          }
          groups={[]}
        />
      ) : <LoadingSection />



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
            <div
              className="ui labeled icon top right pointing dropdown fillter-button"
              tabIndex="0"
              onClick={() => this.hideFilter(this.state.viewfilter)} >
              {/* <span>
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
              </span> */}

              {/* <span className={"text " + (this.state.viewfilter === false ? " " : " active")}>
                <span className="show-fillter">Show Fillter</span>
                <span className="hide-fillter">Hide Fillter</span>
              </span> */}
            </div>
          </div>
          <div className="rowsPaginations readOnly__disabled">
            <div className="linebylineInput valid-input">
              <label className="control-label">
                {Resources.totalDocs[currentLanguage]}
              </label>
              <div className="ui input inputDev" style={{ width: "100px", margin: " 10px " }}>
                <input type="text" className="form-control" id="totalDocs" value={this.state.rows.length} readOnly name="totalDocs"
                  placeholder={Resources.totalDocs[currentLanguage]} />
              </div>
            </div>
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
        {/* <div className="filterHidden" style={{ maxHeight: this.state.viewfilter ? "" : "0px", overflow: this.state.viewfilter ? "" : "hidden" }}>
          <div className="gridfillter-container">
            {ComponantFilter}
          </div>
        </div> */}
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
