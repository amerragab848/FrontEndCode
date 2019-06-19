import React, { Component, Fragment } from "react";
import GridSetup from "./GridSetup";
import Filter from "../../Componants/FilterComponent/filterComponent";
import Api from "../../api";
import moment from "moment";
import Export from "../../Componants/OptionsPanels/Export";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";

import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import documentDefenition from "../../documentDefenition.json";
import Resources from "../../resources.json";

import { withRouter } from "react-router-dom";
import MinimizeV from "../../Styles/images/table1.png";
import MinimizeVBlue from "../../Styles/images/table1.png";
import CryptoJS from "crypto-js";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as communicationActions from "../../store/actions/communication";
import { toast } from "react-toastify";

import Config from "../../Services/Config.js";
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
let documentObj = {};
const dateFormate = ({ value }) => {
  return value ? moment(value).format("DD/MM/YYYY") : "No Date";
};

class CommonLog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projectName: localStorage.getItem("lastSelectedprojectName"),
      isLoading: true,
      pageTitle: "",
      viewfilter: false,
      projectId: this.props.projectId,
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
      minimizeClick: false,
      documentObj: {},
      columnsModal: false
    };

    this.filterMethodMain = this.filterMethodMain.bind(this);
    this.clickHandlerDeleteRowsMain = this.clickHandlerDeleteRowsMain.bind(this);
  }

  componentDidMount() {
    this.props.actions.FillGridLeftMenu();
    this.renderComponent(
      this.state.documentName,
      this.props.projectId,
      !this.state.minimizeClick
    );
  }

  componentWillUnmount() {
    this.props.actions.clearCashDocument();

    this.setState({
      isLoading: true,
      isCustom: true
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match !== this.props.match) {
      this.setState({
        isLoading: true,
        isCustom: true,
        documentName: nextProps.match.params.document,
        projectId: nextProps.projectId
      });

      this.renderComponent(
        nextProps.match.params.document,
        nextProps.projectId,
        true
      );
    }

    if (nextProps.projectId !== this.props.projectId) {
      if (!this.state.documentObj.documentApi) {
        this.renderComponent(
          nextProps.match.params.document,
          nextProps.projectId,
          true
        );
      } else {
        this.GetRecordOfLog(this.state.isCustom === true ? this.state.documentObj.documentApi.getCustom : this.state.documentObj.documentApi.get, nextProps.projectId);
      }

      this.setState({
        isLoading: true,
        projectId: nextProps.projectId
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    let shouldUpdate = this.state.isCustom !== nextProps.isCustom;
    return shouldUpdate;
  }

  componentWillUpdate() { }

  hideFilter(value) {
    this.setState({ viewfilter: !this.state.viewfilter });
    return this.state.viewfilter;
  }

  addRecord() {
    if (Config.IsAllow(this.state.documentObj.documentAddPermission)) {
      let addView = this.state.routeAddEdit;

      let obj = {
        docId: 0,
        projectId: this.props.projectId,
        projectName: this.state.projectName,
        arrange: 0,
        docApprovalId: 0,
        isApproveMode: false,
        perviousRoute: window.location.pathname + window.location.search
      };

      if (
        this.state.documentObj.docTyp === 37 || this.state.documentObj.docTyp === 114) {
        obj.isModification = this.state.documentObj.docTyp === 114 ? true : false;
      }

      let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj));
      let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);

      this.props.history.push({
        pathname: "/" + addView,
        search: "?id=" + encodedPaylod
      });
    } else {
      toast.warning(Resources["missingPermissions"][currentLanguage]);
    }
  }

  editHandler(row) {
    if (Config.IsAllow(this.state.documentObj.documentEditPermission)) {
      let editView = this.state.routeAddEdit;

      let obj = {
        docId: row.id,
        projectId: row.projectId,
        projectName: this.state.projectName,
        arrange: 0,
        docApprovalId: 0,
        isApproveMode: false,
        perviousRoute: window.location.pathname + window.location.search
      };

      if (
        this.state.documentObj.docTyp === 37 ||
        this.state.documentObj.docTyp === 114
      ) {
        obj.isModification =
          this.state.documentObj.docTyp === 114 ? true : false;
      }

      let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj));
      let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);

      this.props.history.push({
        pathname: "/" + editView,
        search: "?id=" + encodedPaylod
      });

    } else {
      toast.warning(Resources["missingPermissions"][currentLanguage]);
    }
  }

  GetPrevoiusData() {
    let pageNumber = this.state.pageNumber - 1;
    if (pageNumber >= 0) {
      this.setState({
        isLoading: true,
        pageNumber: pageNumber
      });

      let url = (this.state.query == "" ? this.state.api : this.state.apiFilter) + "?projectId=" + this.state.projectId + "&pageNumber=" + pageNumber + "&pageSize=" + this.state.pageSize + (this.state.query == "" ? "" : "&query=" + this.state.query);

      Api.get(url).then(result => {
        let oldRows = []; // this.state.rows;
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

    if (this.state.pageSize * this.state.pageNumber <= maxRows) {
      this.setState({
        isLoading: true,
        pageNumber: pageNumber
      });

      let url = (this.state.query == "" ? this.state.api : this.state.apiFilter) + "?projectId=" + this.state.projectId + "&pageNumber=" + pageNumber + "&pageSize=" + this.state.pageSize + (this.state.query == "" ? "" : "&query=" + this.state.query);
      Api.get(url).then(result => {
        let oldRows = []; // this.state.rows;
        const newRows = [...oldRows, ...result.data]; // arr3 ==> [1,2,3,3,4,5]

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

    Api.get(apiFilter + "?projectId=" + this.state.projectId + "&pageNumber=" + this.state.pageNumber + "&pageSize=" + this.state.pageSize + "&query=" + stringifiedQuery).then(result => {
      this.setState({
        rows: [...result.data],
        totalRows: result.total,
        isLoading: false
      });

      this.setState({
        isLoading: false
      });
    }).catch(ex => {
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

    Api.post(this.state.apiDelete, this.state.selectedRows).then(result => {
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
    }).catch(ex => {
      this.setState({
        isLoading: false,
        showDeleteModal: false
      });
    });
  };

  clickHandlerDeleteRowsMain = selectedRows => {
    if (Config.IsAllow(this.state.documentObj.documentDeletePermission)) {
      this.setState({
        showDeleteModal: true,
        selectedRows: selectedRows
      });
    } else {
      toast.warning(Resources["missingPermissions"][currentLanguage]);
    }
  };

  renderComponent(documentName, projectId, isCustom) {
    var projectId = projectId;
    var documents = documentName;
    documentObj = documentDefenition[documentName];

    let subjectLink = ({ value, row }) => {
      let subject = "";
      if (row) {
        let obj = {
          docId: row.id,
          projectId: row.projectId,
          projectName: row.projectName,
          arrange: 0,
          docApprovalId: 0,
          isApproveMode: false,
          perviousRoute: window.location.pathname + window.location.search
        };

        let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj));
        let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);
        let doc_view = "/" + documentObj.documentAddEditLink.replace("/", "") + "?id=" + encodedPaylod;
        subject = row.subject;

        return <a href={doc_view}> {subject} </a>;
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
        formatter: item.field === "subject" ? subjectLink : item.dataType === "date" ? dateFormate : ""
      };

      if (isCustom !== true) {
        cNames.push(obj);
      } else {
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
      filtersColumns: filtersColumns,
      documentObj: documentObj,
      projectId: projectId
    });

    this.GetRecordOfLog(isCustom === true ? documentObj.documentApi.getCustom : documentObj.documentApi.get, projectId);
  }

  GetRecordOfLog(api, projectId) {
    if (projectId !== 0) {
      let url = api + (documentObj.docTyp == 33 ? "projectId=" + projectId : "?projectId=" + projectId) + "&pageNumber=" + this.state.pageNumber + "&pageSize=" + this.state.pageSize;
      this.GetLogData(url);
    } else {
      this.setState({ isLoading: false });
    }
  }

  GetLogData(url) {
    Api.get(url).then(result => {
      this.setState({
        rows: result.data,
        totalRows: result.total,
        isLoading: false
      });
    }).catch(ex => {
      this.setState({ isLoading: false });
    });
  }

  handleMinimize = () => {
    const currentClass = this.state.minimizeClick;
    const isCustom = this.state.isCustom;

    this.setState({
      minimizeClick: !currentClass,
      isCustom: !isCustom,
      isLoading: true
    });
    this.renderComponent(
      this.state.documentName,
      this.state.projectId,
      !this.state.isCustom
    );
  };

  openModalColumn = () => {
    this.setState({columnsModal : true})
  }

  closeModalColumn = () => {
    this.setState({columnsModal : false})
  }

  cellClick = (rowId, colID) => {
    if (colID != 0 && colID != 1) {
      if (Config.IsAllow(this.state.documentObj.documentViewPermission) || Config.IsAllow(this.state.documentObj.documentEditPermission)) {
        let rowData = this.state.rows[rowId];

        let addView = this.state.routeAddEdit;

        if (this.state.columns[colID - 1].key !== "subject") {
          let obj = {
            docId: rowData.id,
            projectId: this.state.projectId,
            projectName: this.state.projectName,
            arrange: 0,
            docApprovalId: 0,
            isApproveMode: false,
            perviousRoute: window.location.pathname + window.location.search
          };

          if (
            this.state.documentObj.docTyp === 37 ||
            this.state.documentObj.docTyp === 114
          ) {
            obj.isModification =
              this.state.documentObj.docTyp === 114 ? true : false;
          }

          let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj));
          let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);

          this.props.history.push({
            pathname: "/" + addView,
            search: "?id=" + encodedPaylod
          });
        }
      } else {
        toast.warning(Resources["missingPermissions"][currentLanguage]);
      }
    }
  };

  render() {
    const showCheckbox = Config.IsAllow(this.state.documentObj.documentDeletePermission);

    const dataGrid =
      this.state.isLoading === false ? (
        <GridSetup
          rows={this.state.rows}
          clickHandlerDeleteRows={this.clickHandlerDeleteRowsMain}
          showCheckbox={showCheckbox}
          pageSize={this.state.pageSize}
          cellClick={this.cellClick}
          columns={this.state.columns}
        />
      ) : (
          <LoadingSection />
        );

    const btnExport =
      this.state.isLoading === false ? (
        <Export
          rows={this.state.isLoading === false ? this.state.rows : []}
          columns={this.state.columns}
          fileName={this.state.pageTitle}
        />
      ) : null;

    const ComponantFilter =
      this.state.isLoading === false ? (
        <Filter
          filtersColumns={this.state.filtersColumns}
          apiFilter={this.state.apiFilter}
          filterMethod={this.filterMethodMain}
          key={this.state.docType}
        />
      ) : null;

    return (
      <Fragment>
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

              {this.state.viewfilter === false ? (
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
            <button
              className="primaryBtn-1 btn mediumBtn"
              onClick={() => this.addRecord()}
            >
              NEW
            </button>
          </div>
          <div className="rowsPaginations">
            <div className="rowsPagiRange">
              <span>{this.state.pageSize * this.state.pageNumber + 1}</span> -{" "}
              <span>
                {this.state.pageSize * this.state.pageNumber +
                  this.state.pageSize}
              </span>{" "}
              of
              <span> {this.state.totalRows}</span>
            </div>
            <button
              className={this.state.pageNumber == 0 ? "rowunActive" : ""}
              onClick={() => this.GetPrevoiusData()}
            >
              <i className="angle left icon" />
            </button>
            <button
              className={
                this.state.totalRows !==
                  this.state.pageSize * this.state.pageNumber +
                  this.state.pageSize
                  ? "rowunActive"
                  : ""
              }
              onClick={() => this.GetNextData()}
            >
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
          <div className="gridfillter-container">{ComponantFilter}</div>
        </div>

        <div>
          <div
            className={
              this.state.minimizeClick
                ? "minimizeRelative miniRows"
                : "minimizeRelative"
            }
          >
            <div className="minimizeSpan">
              <div className="H-tableSize" onClick={this.handleMinimize}>
                <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24">
                  <g fill="none" fill-rule="evenodd" transform="translate(5 5)">
                    <g fill="#CCD2DB" mask="url(#b)">
                      <path id="a" d="M0 1.007C0 .45.45 0 1.008 0h1.225c.556 0 1.008.45 1.008 1.007v11.986C3.24 13.55 2.79 14 2.233 14H1.008C.45 14 0 13.55 0 12.993V1.007zm5.38 0C5.38.45 5.83 0 6.387 0h1.226C8.169 0 8.62.45 8.62 1.007v11.986C8.62 13.55 8.17 14 7.613 14H6.387c-.556 0-1.007-.45-1.007-1.007V1.007zm5.38 0C10.76.45 11.21 0 11.766 0h1.225C13.55 0 14 .45 14 1.007v11.986C14 13.55 13.55 14 12.992 14h-1.225c-.556 0-1.008-.45-1.008-1.007V1.007z" />
                    </g>
                  </g>
                </svg>
              </div>
              <div className="V-tableSize" onClick={this.openModalColumn}>
                <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24">
                  <g fill="none" fill-rule="evenodd" transform="translate(5 5)">
                    <g fill="#CCD2DB" mask="url(#b)">
                      <path id="a" d="M0 1.007C0 .45.45 0 1.008 0h1.225c.556 0 1.008.45 1.008 1.007v11.986C3.24 13.55 2.79 14 2.233 14H1.008C.45 14 0 13.55 0 12.993V1.007zm5.38 0C5.38.45 5.83 0 6.387 0h1.226C8.169 0 8.62.45 8.62 1.007v11.986C8.62 13.55 8.17 14 7.613 14H6.387c-.556 0-1.007-.45-1.007-1.007V1.007zm5.38 0C10.76.45 11.21 0 11.766 0h1.225C13.55 0 14 .45 14 1.007v11.986C14 13.55 13.55 14 12.992 14h-1.225c-.556 0-1.008-.45-1.008-1.007V1.007z" />
                    </g>
                  </g>
                </svg>
              </div>
            </div>
            <div
              className={
                "grid-container " +
                (this.state.rows.length === 0 ? "griddata__load" : " ")
              }
            >
              {dataGrid}
            </div>
          </div>
        </div>
        <div>
          {this.state.showDeleteModal == true ? (
            <ConfirmationModal
              title={Resources["smartDeleteMessage"][currentLanguage].content}
              buttonName="delete"
              closed={this.onCloseModal}
              showDeleteModal={this.state.showDeleteModal}
              clickHandlerCancel={this.clickHandlerCancelMain}
              clickHandlerContinue={this.clickHandlerContinueMain}
            />
          ) : null}
        </div>
      </div>
      <div className={this.state.columnsModal ? "grid__column active " : "grid__column " }>
        <div className="grid__column--container">
        <button className="closeColumn" onClick={this.closeModalColumn}>X</button>

          <div className="grid__column--title">
            <h2>Grid Columns</h2>
          </div>
          <div className="grid__column--content">
            <div className="grid__content">
              <div className="ui checkbox checkBoxGray300 count">
                <input name="CheckBox" type="checkbox" id="terms" tabindex="0" className="hidden" />
                <label>Terms of purchase orders 11</label>
              </div>
            </div>
            <div className="grid__content">
              <div className="ui checkbox checkBoxGray300 count">
                <input name="CheckBox" type="checkbox" id="terms" tabindex="0" className="hidden" />
                <label>Terms of purchase orders 11</label>
              </div>
            </div>
            <div className="grid__content">
              <div className="ui checkbox checkBoxGray300 count">
                <input name="CheckBox" type="checkbox" id="terms" tabindex="0" className="hidden" />
                <label>Terms of purchase orders 11</label>
              </div>
            </div>
            <div className="grid__content">
              <div className="ui checkbox checkBoxGray300 count">
                <input name="CheckBox" type="checkbox" id="terms" tabindex="0" className="hidden" />
                <label>Terms of purchase orders 11</label>
              </div>
            </div>
            <div className="grid__content">
              <div className="ui checkbox checkBoxGray300 count">
                <input name="CheckBox" type="checkbox" id="terms" tabindex="0" className="hidden" />
                <label>Terms of purchase orders 11</label>
              </div>
            </div>
            <div className="grid__content">
              <div className="ui checkbox checkBoxGray300 count">
                <input name="CheckBox" type="checkbox" id="terms" tabindex="0" className="hidden" />
                <label>Terms of purchase orders 11</label>
              </div>
            </div>

          </div>
        </div>
      </div>
      </Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    projectId: state.communication.projectId,
    showLeftMenu: state.communication.showLeftMenu,
    showSelectProject: state.communication.showSelectProject,
    projectName: state.communication.projectName,
    moduleName: state.communication.moduleName
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(communicationActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CommonLog));
