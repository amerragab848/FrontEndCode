import React, { Component } from "react";
import Api from "../../api";
import LoadingSection from "../publicComponants/LoadingSection";
import Export from "../OptionsPanels/Export";
import GridCustom from "../Templates/Grid/CustomGrid";
import Resources from "../../resources.json";
import CryptoJS from "crypto-js";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as communicationActions from "../../store/actions/communication";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class levelDurationAlertDetails extends Component {

  constructor(props) {
    super(props);

    var columnsGrid = [
      {
        field: "serialNo",
        title: Resources["arrange"][currentLanguage],
        width: 7,
        groupable: true,
        fixed: true,
        sortable: true,
        type: "text",
        hidden: false
      },
      {
        field: "subject",
        title: Resources["subject"][currentLanguage],
        width: 25,
        groupable: true,
        fixed: false,
        sortable: true,
        type: "text",
        href: 'link',
        onClick: () => { },
        classes: 'bold',
        showTip: true
      },
      {
        field: "projectName",
        title: Resources["projectName"][currentLanguage],
        width: 15,
        groupable: true,
        fixed: false,
        sortable: true,
        type: "text"
      },
      {
        field: "approvalStatusName",
        title: Resources["approvalStatus"][currentLanguage],
        width: 12,
        groupable: true,
        fixed: false,
        sortable: true,
        type: "text"
      },
      {
        field: "arrange",
        title: Resources["arrangeLevel"][currentLanguage],
        width: 7,
        groupable: true,
        fixed: true,
        sortable: true,
        type: "text",
        hidden: false
      },
      {
        field: "docTypeName",
        title: Resources["docType"][currentLanguage],
        width: 12,
        groupable: true,
        fixed: false,
        sortable: true,
        type: "text"
      }, {
        field: "docDurationDays",
        title: Resources["delay"][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        sortable: true,
        type: "text"
      },
      {
        field: "contactName",
        title: Resources["contact"][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        sortable: true,
        type: "text",
        hidden: false
      }
    ];

    var groups = [];

    const filtersColumns = [
      {
        field: "projectName",
        name: "projectName",
        type: "string",
        isCustom: true
      },
      {
        field: "serialNo",
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
        field: "approvalStatusName",
        name: "approvalStatus",
        type: "string",
        isCustom: true
      },
      {
        field: "arrange",
        name: "arrangeLevel",
        type: "number",
        isCustom: true
      },
      {
        field: "docTypeName",
        name: "docType",
        type: "string",
        isCustom: true
      },
      {
        field: "docDurationDays",
        name: "delay",
        type: "number",
        isCustom: true
      }
    ];

    this.state = {
      pageTitle: Resources["levelDurationAlertDetails"][currentLanguage],
      columns: columnsGrid,
      isLoading: true,
      rows: [],
      filtersColumns: filtersColumns,
      groups: groups,
      isCustom: true,
      pageSize: 50,
      pageNumber: 0,
      api: 'GetLevelDurationDelay?',
    };
  }
  
  componentDidMount() {

    this.props.actions.RouteToTemplate();

    Api.get(this.state.api + "pageNumber=" + this.state.pageNumber + "&pageSize=" + this.state.pageSize).then(result => {

      result.forEach(row => {
        let obj = {
          docId: row.docId,
          projectId: row.projectId,
          projectName: row.projectName,
          arrange: 0,
          docApprovalId: 0,
          isApproveMode: false,
          perviousRoute: window.location.pathname + window.location.search
        };

        let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj));

        let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);

        row.link = '/' + row.docLink + '?id=' + encodedPaylod;
      });

      this.setState({
        rows: result != null ? result : [],
        isLoading: false
      });
    });
  }
  GetNextData() {
    let pageNumber = this.state.pageNumber + 1;

    this.setState({
      isLoading: true,
      pageNumber: pageNumber
    });
    let url = this.state.api + "pageNumber=" + pageNumber + "&pageSize=50"
    Api.get(url).then(result => {
      let oldRows = this.state.rows;
      const newRows = [...oldRows, ...result];
      this.setState({
        rows: newRows,
        totalRows: newRows.length,
        pageSize: this.state.pageSize + 50,
        isLoading: false
      });
    }).catch(ex => {
      let oldRows = this.state.rows;
      this.setState({
        rows: oldRows,
        isLoading: false
      });
    });;
  }

  GetPrevoiusData() {
    let pageNumber = this.state.pageNumber - 1;
    let pageSize = this.state.pageSize - 50;

    this.setState({
      isLoading: true,
      pageNumber: pageNumber
    });

    let url = this.state.api + "pageNumber=" + pageNumber + "&pageSize=" + pageSize;

    Api.get(url).then(result => {
      let oldRows = [];
      const newRows = [...oldRows, ...result];

      this.setState({
        rows: newRows,
        totalRows: newRows.length,
        pageSize: pageSize,
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

  render() {

    const dataGrid = this.state.isLoading === false ? (
      <GridCustom
        gridKey='levelDurationAlert'
        cells={this.state.columns}
        data={this.state.rows}
        groups={this.state.groups}
        pageSize={this.state.rows ? this.state.rows.length : 0}
        actions={[]}
        rowActions={[]}
        rowClick={obj => {
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
        }}
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
          <div className="rowsPaginations readOnly__disabled">
            <div className="rowsPagiRange">
              <span>0</span> - <span>{this.state.pageSize}</span> of
                           <span> {this.state.totalRows}</span>
            </div>
            <button className={this.state.pageNumber == 0 ? "rowunActive" : ""} onClick={() => this.GetPrevoiusData()}>
              <i className="angle left icon" />
            </button>
            <button onClick={() => this.GetNextData()}>
              <i className="angle right icon" />
            </button>
          </div>
        </div>
        <div>
          <div className="doc-pre-cycle letterFullWidth">
            <div className="precycle-grid">
              <div className="grid-container">
                <div className="submittalFilter readOnly__disabled">
                  <div className="subFilter">
                    <h3 className="zero">
                    </h3>
                  </div>
                  <div className="rowsPaginations readOnly__disabled">
                    <button className="rowunActive" >
                      <i className="angle left icon" />
                    </button>
                    <button className="rowunActive">
                      <i className="angle right icon" />
                    </button>
                  </div>
                </div>
                {dataGrid}
              </div>

            </div>
          </div>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(levelDurationAlertDetails);
