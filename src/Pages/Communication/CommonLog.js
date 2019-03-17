import React, { Component } from "react";
import GridSetup from "./GridSetup";
import Filter from "../../Componants/FilterComponent/filterComponent";
import Api from "../../api";
import moment from "moment";
import { Toolbar, Data, Filters } from "react-data-grid-addons";
import Export from "../../Componants/OptionsPanels/Export";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";

import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import documentDefenition from "../../documentDefenition.json";
import Resources from "../../resources.json";

import { withRouter } from "react-router-dom";

import MinimizeV from '../../Styles/images/table1.png'
import MinimizeH from '../../Styles/images/table2.png'

import MinimizeVBlue from '../../Styles/images/table1.png'
import MinimizeHBlue from '../../Styles/images/table2.png'

import CryptoJS from 'crypto-js';
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

class CommonLog extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      projectName: localStorage.getItem('lastSelectedprojectName'),
      isLoading: true,
      pageTitle: "",
      viewfilter: false,
      projectId: props.match.params.projectId,
      documentName: props.match.params.document,
      filtersColumns: [],
      docType: "",
      rows: [],
      totalRows: 0,
      columns: [],
      pageSize: 50,
      pageNumber: 0,
      apiFilter: "",
      api: "",
      apiDelete: "",
      query: "",
      isCustom: true,
      showDeleteModal: false,
      selectedRows: [],
      minimizeClick: false
    };

    this.filterMethodMain = this.filterMethodMain.bind(this);
    this.clickHandlerDeleteRowsMain = this.clickHandlerDeleteRowsMain.bind(this);
  }

  componentDidMount() {


    this.renderComponent(this.state.documentName, this.state.projectId, !this.state.minimizeClick);

  }

  componentWillUnmount() {
    console.log('componentWillUnmount in Letter Componants 0000');
    this._isMounted = false;
    this.setState({
      isLoading: true,
      isCustom: true
    });
  }

  componentWillReceiveProps(nextProps, prevState) {

    if (nextProps.match !== this.props.match) {

      this._isMounted = false;

      this.setState({
        isLoading: true,
        isCustom: true,
        documentName: nextProps.match.params.document,
        projectId: nextProps.match.params.projectId
      });

      this.renderComponent(nextProps.match.params.document, nextProps.match.params.projectId, true);
      console.log(nextProps.match.params.document);
      //this.renderComponent(this.state.documentName,this.state.projectId,nextState.isCustom);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // alert(nextProps.isCustom);
    // alert(this.state.isCustom);
    let shouldUpdate = this.state.isCustom !== nextProps.isCustom;
    return shouldUpdate;
  }

  componentWillUpdate() {
    //alert('isCustom')
  }

  hideFilter(value) {
    this.setState({ viewfilter: !this.state.viewfilter });
    return this.state.viewfilter;
  }

  addRecord() {

    let addView = this.state.routeAddEdit;//.split("/")[0];

    let obj = {
        docId: 0,
        projectId: this.state.projectId, 
        projectName: this.state.projectName,
        arrange: 0,
        docApprovalId: 0,
        isApproveMode: false
    };

    let parms=  CryptoJS.enc.Utf8.parse(JSON.stringify(obj))
    let encodedPaylod = CryptoJS.enc.Base64.stringify(parms)

    this.props.history.push({
      pathname:"/" + addView,
      search: "?id=" + encodedPaylod
    });

    // this.props.history.push({
    //   pathname: `/v4/Document/${this.state.documentName}/Action/Add`,
    //   state: {
    //     data: {
    //       'src': `${window.location.origin}/old_app/#${addView}0/${this.state.projectId}/undefined/undefined/undefined/${this.state.projectName}`
    //     }
    //   }
    // });
  }
  editHandler(row) {

    let editView = this.state.routeAddEdit;

    let obj = {
      docId: row.id,
      projectId: row.projectId, 
      projectName: this.state.projectName,
      arrange: 0,
      docApprovalId: 0,
      isApproveMode: false
  };

  let parms=  CryptoJS.enc.Utf8.parse(JSON.stringify(obj))
  let encodedPaylod = CryptoJS.enc.Base64.stringify(parms)

  this.props.history.push({
    pathname:"/" + editView,
    search: "?id=" + encodedPaylod
  });

    // this.props.history.push({
    //   pathname: `/v4/Document/${this.state.documentName}/Action/Edit`,
    //   state: {
    //     data: {
    //       'src': `${window.location.origin}/old_app/#${editView}${row.id}/${row.projectId}/undefined/undefined/undefined/${row.projectName}`
    //     }
    //   }
    // });
  }

  GetPrevoiusData() {
    let pageNumber = this.state.pageNumber - 1;
    if (pageNumber >= 0) {
      this.setState({
        isLoading: true,
        pageNumber: pageNumber
      });

      let url = (this.state.query == "" ? this.state.api : this.state.apiFilter) + "?projectId=" + this.state.projectId + "&pageNumber=" + pageNumber +
        "&pageSize=" + this.state.pageSize + (this.state.query == "" ? "" : "&query=" + this.state.query);

      Api.get(url).then(result => {
        let oldRows = [];// this.state.rows;
        const newRows = [...oldRows, ...result];

        this.setState({
          rows: newRows,
          totalRows: newRows.length,
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

  GetNextData() {
    let pageNumber = this.state.pageNumber + 1;
    let maxRows = this.state.totalRows;

    if (((this.state.pageSize * this.state.pageNumber)) <= maxRows) {
      this.setState({
        isLoading: true,
        pageNumber: pageNumber
      });

      let url =
        (this.state.query == "" ? this.state.api : this.state.apiFilter) +
        "?projectId=" +
        this.state.projectId +
        "&pageNumber=" +
        pageNumber +
        "&pageSize=" +
        this.state.pageSize +
        (this.state.query == "" ? "" : "&query=" + this.state.query);

      Api.get(url).then(result => {
        let oldRows = [];// this.state.rows;
        const newRows = [...oldRows, ...result]; // arr3 ==> [1,2,3,3,4,5]

        this.setState({
          rows: newRows,
          totalRows: newRows.length,
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

  filterMethodMain = (event, query, apiFilter) => {
    var stringifiedQuery = JSON.stringify(query);

    this.setState({
      isLoading: true,
      query: stringifiedQuery
    });

    Api.get(
      apiFilter +
      "?projectId=" +
      this.state.projectId +
      "&pageNumber=" +
      this.state.pageNumber +
      "&pageSize=" +
      this.state.pageSize +
      "&query=" +
      stringifiedQuery
    )
      .then(result => {
        if (result.length > 0) {
          this.setState({
            rows: result,
            totalRows: result.length,
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

  onCloseModal = () => {
    this.setState({ showDeleteModal: false });
  };

  clickHandlerCancelMain = () => {
    this.setState({ showDeleteModal: false });
  };

  clickHandlerContinueMain = () => {
    this.setState({
      isLoading: true
    });

    Api.post(this.state.apiDelete, this.state.selectedRows)
      .then(result => {
        let originalRows = this.state.rows;
        this.state.selectedRows.map(i => {
          originalRows = originalRows.filter(r => r.id !== i);
        });

        this.setState({
          rows: originalRows,
          totalRows: originalRows.length,
          isLoading: false,
          showDeleteModal: false
        });
      })
      .catch(ex => {

        this.setState({
          isLoading: false,
          showDeleteModal: false
        });

      });
  };

  clickHandlerDeleteRowsMain = selectedRows => {
    console.log("001");
    this.setState({
      showDeleteModal: true,
      selectedRows: selectedRows
    });
    console.log("000001");
  };

  renderComponent(documentName, projectId, isCustom) {
    console.log('renderComponent', isCustom);
    var projectId = projectId;

    var documents = documentName;

    var documentObj = documentDefenition[documentName];

    let subjectLink = ({ value, row }) => {
      let doc_view = "";
      let subject = "";
      if (row) {

        let obj = {
          docId: row.id,
          projectId: row.projectId,
          projectName: row.projectName,
          arrange: 0,
          docApprovalId: 0,
          isApproveMode: false
        };

        let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj))
        let encodedPaylod = CryptoJS.enc.Base64.stringify(parms)
        doc_view = "/" + documentObj.documentAddEditLink.replace('/', '') + "?id=" + encodedPaylod
        subject = row.subject;

        // return <a  href={doc_view}> {subject} </a>;

        return <a onClick={() => this.editHandler(row)} href="javascript:void(0);"> {subject} </a>;
      }
      return null;
    };

    var cNames = [];

    var filtersColumns = [];

    documentObj.documentColumns.map((item, index) => {

      var obj = {
        key: item.field,
        frozen: index < 2 ? true : false,
        name: Resources[item.friendlyName][currentLanguage],
        width: item.minWidth,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: false,
        sortDescendingFirst: true,
        formatter:
          item.field === "subject"
            ? subjectLink
            : item.dataType === "date"
              ? dateFormate
              : ""
      };
      if (isCustom !== true) {
        cNames.push(obj);
      }
      else {
        if (item.isCustom === true) {
          cNames.push(obj);
        }

      }

    });

    filtersColumns = documentObj.filters;

    this.setState({
      pageTitle: Resources[documentObj.documentTitle][currentLanguage],
      docType: documents,
      routeAddEdit: documentObj.documentAddEditLink,
      apiFilter: documentObj.filterApi,
      api: documentObj.documentApi.get,
      apiDelete: documentObj.documentApi.delete,
      columns: cNames,
      filtersColumns: filtersColumns
    });

    this.GetRecordOfLog(isCustom === true ? documentObj.documentApi.getCustom : documentObj.documentApi.get);
  }

  GetRecordOfLog(api) {
    let url = api + "?projectId=" + this.state.projectId + "&pageNumber=" + this.state.pageNumber + "&pageSize=" + this.state.pageSize;
    this.GetLogData(url);
  }

  GetLogData(url) {
    Api.get(url).then(result => {

      let b1 = result.data;
      let b3 = result.data;
      let b2 = result.data;
      result.data = [...b1, ...b2, ...b3, ...result.data];
      this.setState({
        rows: result.data,
        totalRows: result.total,
        isLoading: false
      });

      this._isMounted = true;

    })
      .catch(ex => {
        this.setState({ isLoading: false });
      });
  };

  handleMinimize = () => {
    const currentClass = this.state.minimizeClick;
    const isCustom = this.state.isCustom;

    this.setState({
      minimizeClick: !currentClass,
      isCustom: !isCustom,
      isLoading: true
    });
    this.renderComponent(this.state.documentName, this.state.projectId, !this.state.isCustom);
  }

  render() {

    const showCheckbox = true;

    const dataGrid = this.state.isLoading === false ? (
      <GridSetup
        rows={this.state.rows}
        clickHandlerDeleteRows={this.clickHandlerDeleteRowsMain}
        showCheckbox={showCheckbox}
        pageSize={this.state.pageSize}
        columns={this.state.columns}
      />) : <LoadingSection />;

    const btnExport = this.state.isLoading === false ?
      <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.state.columns} fileName={this.state.pageTitle} />
      : null;

    const ComponantFilter = this.state.isLoading === false ?
      <Filter
        filtersColumns={this.state.filtersColumns}
        apiFilter={this.state.apiFilter}
        filterMethod={this.filterMethodMain}
        key={this.state.docType}
      /> : null;

    return (
      <div className="mainContainer">
        <div className="submittalFilter">
          <div className="subFilter">
            <h3 className="zero">{this.state.pageTitle}</h3>
            <span>{this.state.rows.length}</span>
            <div
              className="ui labeled icon top right pointing dropdown fillter-button"
              tabIndex="0"
              onClick={() => this.hideFilter(this.state.viewfilter)}
            >
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

              {this.state.viewfilter === false
                ? (
                  <span className="text active">
                    <span className="show-fillter">Show Fillter</span>
                    <span className="hide-fillter">Hide Fillter</span>
                  </span>
                ) : (
                  <span className="text">
                    <span className="show-fillter">Show Fillter</span>
                    <span className="hide-fillter">Hide Fillter</span>
                  </span>
                )}
            </div>
          </div>
          <div className="filterBTNS">
            {btnExport}
            <button className="primaryBtn-1 btn mediumBtn" onClick={() => this.addRecord()}>NEW</button>
          </div>
          <div className="rowsPaginations">
            <div className="rowsPagiRange">
              <span>{(this.state.pageSize * this.state.pageNumber) + 1}</span> - <span>{(this.state.pageSize * this.state.pageNumber) + this.state.pageSize}</span> of
              <span> {this.state.totalRows}</span>
            </div>

            <button className={this.state.pageNumber == 0 ? "rowunActive" : ""} onClick={() => this.GetPrevoiusData()}>
              <i className="angle left icon" />
            </button>

            <button className={this.state.totalRows !== (this.state.pageSize * this.state.pageNumber) + this.state.pageSize ? "rowunActive" : ""} onClick={() => this.GetNextData()}>
              <i className="angle right icon" />
            </button>
          </div>
        </div>
        <div
          className="filterHidden"
          style={{
            maxHeight: this.state.viewfilter ? "" : "0px",
            overflow: this.state.viewfilter ? "" : "hidden"
          }}
        >
          <div className="gridfillter-container">
            {ComponantFilter}
          </div>
        </div>

        <div>
          <div className={this.state.minimizeClick ? "minimizeRelative miniRows" : "minimizeRelative"}>
            <div className="minimizeSpan">
              <div className="H-tableSize" onClick={this.handleMinimize}>
                {this.state.minimizeClick ? <img src={MinimizeVBlue} alt="" /> : <img src={MinimizeV} alt="" />}
              </div>
              <div className="V-tableSize">
                <img src={MinimizeH} alt="" />
              </div>
            </div>
            <div className="grid-container">
              {dataGrid}
            </div>
          </div>
        </div>
        <div>
          {this.state.showDeleteModal == true ? (
            <ConfirmationModal
              closed={this.onCloseModal}
              showDeleteModal={this.state.showDeleteModal}
              clickHandlerCancel={this.clickHandlerCancelMain}
              clickHandlerContinue={this.clickHandlerContinueMain}
            />
          ) : null
          }
        </div>
      </div>
    );
  }
}

export default withRouter(CommonLog);
