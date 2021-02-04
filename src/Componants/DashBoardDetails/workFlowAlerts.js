import React, { Component } from "react";
import Api from "../../api";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import Export from "../OptionsPanels/Export";
import Resources from "../../resources.json";
import CryptoJS from 'crypto-js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as communicationActions from '../../store/actions/communication';
import Grid from "../../Componants/Templates/Grid/CustomGrid";
import Config from '../../Services/Config.js';

let moduleId = Config.getPublicConfiguartion().dashboardApi;

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class workFlowAlerts extends Component {

  constructor(props) {
    super(props);

    this.columnGrid = [
      {
        field: 'arrange',
        title: Resources['arrange'][currentLanguage],
        width: 4,
        groupable: true,
        fixed: true,
        type: "number",
        sortable: true,
        hidden: false
      },
      {
        field: 'subject',
        title: Resources['subject'][currentLanguage],
        width: 25,
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
      }, {
        field: 'epsName',
        title: Resources['epsName'][currentLanguage],
        width: 6,
        groupable: true,
        fixed: false,
        sortable: true,
        type: 'text',
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
        width: 7,
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
      isLoading: true,
      rows: [],
      isCustom: true,
      filteredRows: [],
      pageNumber: 0,
      pageSize: 500,
      totalRows:0
    };
  }

  componentDidMount() {

    this.props.actions.RouteToTemplate();

    Api.get(`GetWorkFlowAlertDetails?pageNumber=${this.state.pageNumber}&pageSize=${this.state.pageSize}`,undefined,moduleId).then(result => {
      if (result != null && result.data != null && result.data.length > 0) {
        result.data.forEach(row => {
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

        this.getFilteredRows(result.data);

        this.setState({
          rows: result != null ? result.data : [],
          totalRows:result !=null?result.total :0,
          isLoading: false
        });
      } else {
        this.setState({
          rows: [],
          isLoading: false
        });
      }
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

  changeValueOfProps = () => {
    this.setState({ isFilter: false });
  };

  getFilteredRows = (data) => {
    if (data != null && data != undefined)
      this.setState({ filteredRows: data || [] });
  }

  GetPrevoiusData() {
    let pageNumber = this.state.pageNumber - 1;

    if (pageNumber >= 0) {
      this.setState({
        isLoading: true,
        pageNumber: pageNumber,
      });
      let oldRows = this.state.rows;
      Api.get(`GetWorkFlowAlertDetails?pageNumber=${pageNumber}&pageSize=${this.state.pageSize}`,undefined,moduleId).then(result => {
        if (result != null && result.data != null && result.data.length > 0) {
          result.data.forEach(row => {
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

          this.getFilteredRows(result.data);

          this.setState({
            rows: result != null ? result.data : [],
            totalRows:result !=null?result.total :0,
            isLoading: false
          });
        } else {
          this.setState({
            rows: oldRows,
            isLoading: false
          });
        }
      }).catch(ex => {
        this.setState({
          rows: oldRows,
          isLoading: false,
        });
      });

    }
  }

  GetNextData() {
    let pageNumber = this.state.pageNumber + 1;

    let maxRows = this.state.totalRows;

    if (this.state.pageSize * pageNumber <= maxRows) {
      this.setState({
        isLoading: true,
        pageNumber: pageNumber,
      });

      let oldRows = this.state.rows;
      Api.get(`GetWorkFlowAlertDetails?pageNumber=${pageNumber}&pageSize=${this.state.pageSize}`,undefined,moduleId).then(result => {
        if (result != null && result.data != null && result.data.length > 0) {
          result.data.forEach(row => {
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

          this.getFilteredRows(result.data);

          this.setState({
            rows: result != null ? result.data : [],
            totalRows:result !=null?result.total :0,
            isLoading: false
          });
        } else {
          this.setState({
            rows: oldRows,
            isLoading: false
          });
        }
      }).catch(ex => {
        this.setState({
          rows: oldRows,
          isLoading: false,
        });
      });
    }
  }

  render() {

    const btnExport = this.state.isLoading === false ?
      <Export rows={this.state.isLoading === false ? this.state.filteredRows : []}
        columns={this.columnGrid}
        fileName={this.state.pageTitle} />
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
          <div className="rowsPaginations readOnly__disabled">
                            <div className="rowsPagiRange">
                               
                            <span> {this.state.pageSize * this.state.pageNumber + 1} </span>{' '}   -
                                
                            <span> {this.state.pageSize * this.state.pageNumber + this.state.pageSize}</span>
                                
                                { Resources['jqxGridLanguagePagerrangestring'][currentLanguage]  }
                                  
                                <span> {this.state.totalRows}</span>
                            </div>
                            <button className={ this.state.pageNumber == 0 ? 'rowunActive' : ''} onClick={() => this.GetPrevoiusData()}>
                                <i className="angle left icon" />
                            </button>
                            <button className={this.state.totalRows !== this.state.pageSize * this.state.pageNumber + this.state.pageSize ? 'rowunActive' : '' } onClick={() => this.GetNextData()}>
                                <i className="angle right icon" />
                            </button>
                        </div>
                   
        </div>
        <div className="filterHidden" style={{ maxHeight: this.state.viewfilter ? "" : "0px", overflow: this.state.viewfilter ? "" : "hidden" }}>
          <div className="gridfillter-container">
          </div>
        </div>

        <div>
          {this.state.isLoading === false ? (
            <Grid
              gridKey="WorkFlowAlert"
              data={this.state.rows}
              cells={this.columnGrid}
              changeValueOfProps={this.changeValueOfProps.bind(this)}
              isFilter={this.state.isFilter}
              groups={[]}
              actions={[]}
              rowActions={[]}
              rowClick={(cell) => { this.onRowClick(cell) }}
              afterFilter={this.getFilteredRows}
            />
          ) : <LoadingSection />}</div>
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
