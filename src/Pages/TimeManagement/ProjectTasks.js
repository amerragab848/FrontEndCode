import React, { Component } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'; 
import { withRouter } from "react-router-dom"; 
import * as communicationActions from '../../store/actions/communication'; 
import Api from "../../api"; 
import CryptoJS from 'crypto-js';
import Filter from "../../Componants/FilterComponent/filterComponent";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import Export from "../../Componants/OptionsPanels/Export";
import GridSetup from "../../Pages/Communication/GridSetup";
import { Filters } from "react-data-grid-addons";
import Resources from "../../resources.json";
import Config from "../../Services/Config.js";
import moment from "moment";
import { toast } from "react-toastify";
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import MinimizeV from '../../Styles/images/table1.png';
import MinimizeH from '../../Styles/images/table2.png';
import MinimizeVBlue from '../../Styles/images/table1.png';

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const { NumericFilter, AutoCompleteFilter, MultiSelectFilter, SingleSelectFilter } = Filters;

const dateFormate = ({ value }) => {
  return value ? moment(value).format("DD/MM/YYYY") : "No Date";
};

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
      perviousRoute:window.location.pathname+window.location.search
    };

    let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj))
    let encodedPaylod = CryptoJS.enc.Base64.stringify(parms)
    let doc_view = "/ProjectTaskAddEdit" + "?id=" + encodedPaylod
    subject = row.subject;

    return <a href={doc_view}> {subject} </a>;

  }
  return null;
};

class ProjectTasks extends Component {

  constructor(props) {

    super(props);

    const columnsGrid = [
      {
        key: "arrange",
        name: Resources["arrange"][currentLanguage],
        width: 100,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: SingleSelectFilter
      },
      {
        //key: "status",
        key: "BtnActions",
        width: 150
      },
      {
        key: "actualProgress",
        name: Resources["actualProgress"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: SingleSelectFilter
      },
      {
        key: "id",
        name: Resources["transferTask"][currentLanguage],
        width: 150,
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
        formatter: subjectLink
      },
      {
        key: "suspendedText",
        name: Resources["suspeneded"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: SingleSelectFilter
      },
      {
        key: "fromCompanyName",
        name: Resources["fromCompany"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: SingleSelectFilter
      },
      {
        key: "bicCompanyName",
        name: Resources["actionByCompany"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: SingleSelectFilter
      },
      {
        key: "bicContactName",
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
        key: "docCloseDate",
        name: Resources["docClosedate"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: SingleSelectFilter,
        formatter: dateFormate
      },
      {
        key: "originalEstimatedTime",
        name: Resources["originalEstimatedTime"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: SingleSelectFilter
      },
      {
        key: "estimatedTime",
        name: Resources["estimatedTaskTime"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: SingleSelectFilter
      },
      {
        key: "actualTotal",
        name: Resources["actualTotal"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: SingleSelectFilter
      },
      {
        key: "userProgress",
        name: Resources["userProgress"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: SingleSelectFilter
      },
      {
        key: "remaining",
        name: Resources["remaining"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: SingleSelectFilter
      },
      {
        key: "startDate",
        name: Resources["startDate"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: SingleSelectFilter,
        formatter: dateFormate
      },
      {
        key: "finishDate",
        name: Resources["finishDate"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: SingleSelectFilter,
        formatter: dateFormate
      },
      {
        key: "docDelay",
        name: Resources["delay"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: SingleSelectFilter
      },
      {
        key: "oppenedBy",
        name: Resources["openedBy"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: SingleSelectFilter
      },
      {
        key: "closedBy",
        name: Resources["closedBy"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: SingleSelectFilter
      },
      {
        key: "lastEditBy",
        name: Resources["lastEdit"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: SingleSelectFilter
      },
      {
        key: "lastEditDate",
        name: Resources["lastEditDate"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: SingleSelectFilter,
        formatter: dateFormate
      },
      {
        key: "lastSendTime",
        name: Resources["lastSendTime"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: SingleSelectFilter
      },
      {
        key: "lastApproveDate",
        name: Resources["lastApproveDate"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: SingleSelectFilter,
        formatter: dateFormate
      },
      {
        key: "lastApproveTime",
        name: Resources["lastApprovedTime"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: SingleSelectFilter
      },
      {
        key: "lastSendDate",
        name: Resources["lastSendDate"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: SingleSelectFilter,
        formatter: dateFormate
      }
    ];

    const filtersColumns = [
      {
        field: "arrange",
        name: "arrange",
        type: "number",
        isCustom: true
      },
      {
        field: "status",
        name: "status",
        type: "toggle",
        trueLabel: "oppened",
        falseLabel: "closed",
        isCustom: true
      },
      {
        field: "actualProgress",
        name: "actualProgress",
        type: "number",
        isCustom: false
      },
      {
        field: "subject",
        name: "subject",
        type: "string",
        isCustom: true
      },
      {
        field: "fromCompanyName",
        name: "fromCompany",
        type: "string",
        isCustom: true
      },
      {
        field: "bicCompanyName",
        name: "actionByCompany",
        type: "string",
        isCustom: false
      },
      {
        field: "bicContactName",
        name: "actionByContact",
        type: "string",
        isCustom: false
      },
      {
        field: "docCloseDate",
        name: "docClosedate",
        type: "date",
        isCustom: false
      },
      {
        field: "originalEstimatedTime",
        name: "originalEstimatedTime",
        type: "number",
        isCustom: false
      },
      {
        field: "estimatedTime",
        name: "estimatedTaskTime",
        type: "number",
        isCustom: false
      },
      {
        field: "actualTotal",
        name: "actualTotal",
        type: "number",
        isCustom: false
      },
      {
        field: "remaining",
        name: "remaining",
        type: "number",
        isCustom: false
      },
      {
        field: "startDate",
        name: "startDate",
        type: "date",
        isCustom: false
      },
      {
        field: "finishDate",
        name: "finishDate",
        type: "date",
        isCustom: false
      },
      {
        field: "docDelay",
        name: "delay",
        type: "string",
        isCustom: false
      },
      {
        field: "openedBy",
        name: "openedBy",
        type: "string",
        isCustom: false
      },
      {
        field: "closedBy",
        name: "closedBy",
        type: "string",
        isCustom: false
      },
      {
        field: "lastEditBy",
        name: "lastEdit",
        type: "string",
        isCustom: false
      },
      {
        field: "lastEditDate",
        name: "lastEditDate",
        type: "date",
        isCustom: false
      }
    ];

    this.state = {
      projectName: localStorage.getItem('lastSelectedprojectName'),
      pageTitle: Resources["projectTaskGroups"][currentLanguage],
      viewfilter: false,
      columns: columnsGrid,
      isLoading: true,
      rows: [],
      filtersColumns: filtersColumns,
      isCustom: true,
      apiFilter: "",
      api: "",
      viewModal: false,
      projectId: props.match.params.projectId,
      totalRows: 0,
      pageSize: 50,
      pageNumber: 0,
      query: "",
      showCheckbox: true,
      showDeleteModal: false,
      selectedRows: [],
      minimizeClick: false,
    };
    
  }

  componentWillUnmount() {   
    this.props.actions.clearCashDocument();
    this.setState({
      docId: 0
    });
  }

  componentWillMount() {

    let url = this.state.isCustom === true ? "GetTasksByProjectIdCustom?projectId=" + this.state.projectId + "&pageNumber=" + this.state.pageNumber + "&pageSize=" + this.state.pageSize :
      "GetTasksByProjectId?projectId=" + this.state.projectId + "&pageNumber=" + this.state.pageNumber + "&pageSize=" + this.state.pageSize

    Api.get(url).then(
      result => {
        this.setState({
          rows: result != null ? result.data : [],
          isLoading: false,
          api: "GetTasksByProjectIdCustom",
          totalRows: result.total
        });
      }
    ).catch(ex => toast.error(Resources["failError"][currentLanguage]));

    this.props.actions.documentForAdding();
  }

  hideFilter(value) {
    this.setState({ viewfilter: !this.state.viewfilter });

    return this.state.viewfilter;
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
        let oldRows = [];
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

      let url = (this.state.query == "" ? this.state.api : this.state.apiFilter) + "?projectId=" + this.state.projectId + "&pageNumber=" + pageNumber + "&pageSize=" +
        this.state.pageSize + (this.state.query == "" ? "" : "&query=" + this.state.query);

      Api.get(url).then(result => {
        let oldRows = [];
        const newRows = [...oldRows, ...result.data];

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

  handleMinimize = () => {
    const currentClass = this.state.minimizeClick;
    const isCustom = this.state.isCustom;

    this.setState({
      minimizeClick: !currentClass,
      isCustom: !isCustom,
      isLoading: true
    });
  }

  //filter
  filterMethodMain = (event, query, apiFilter) => {
    var stringifiedQuery = JSON.stringify(query);

    stringifiedQuery = stringifiedQuery.replace(/#/g, '%23');

    this.setState({
      isLoading: true,
      query: stringifiedQuery
    });

    Api.get("ProjectTackFilter?projectId=" + this.state.projectId + "&pageNumber=" + this.state.pageNumber + "&pageSize=" + this.state.pageSize + "&query=" + stringifiedQuery).then(result => {
      if (result.length > 0) {

        this.setState({
          rows: [...result.data],
          totalRows: result.total,
          isLoading: false,
          apiFilter: "ProjectTackFilter"
        });
      } else {
        this.setState({
          isLoading: false,
          apiFilter: "ProjectTackFilter"
        });
      }
    })
      .catch(ex => {
        this.setState({
          rows: [],
          isLoading: false
        });
      });
  };
 
  addRecord() {
    if (Config.IsAllow(357)) {

      let obj = {
        docId: 0,
        projectId: this.state.projectId,
        projectName: this.state.projectName,
        arrange: 0,
        docApprovalId: 0,
        isApproveMode: false
      };

      let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj))
      let encodedPaylod = CryptoJS.enc.Base64.stringify(parms)

      this.props.history.push({
        pathname: "/ProjectTaskAddEdit",
        search: "?id=" + encodedPaylod
      });
    }
  }

  GetCellActions(column, row) {
    if (column.key === 'BtnActions') {
      return [{
        icon: "fa fa-pencil",
        actions: [
          {
            text: Resources['isTaskAdmin'][currentLanguage],
            callback: (e) => {
              if (Config.IsAllow(1001102)) {
                this.props.history.push({
                  pathname: '/TaskAdmin',
                  search: "?id=" + row.id
                })
              }
            }
          },
          {
            text: 'EPS',
            callback: () => {
              if (Config.IsAllow(1001103)) {
                this.props.history.push({
                  pathname: '/AccountsEPSPermissions',
                  search: "?id=" + row.id
                })
              }
            }
          },
          {
            text: Resources['Projects'][currentLanguage],
            callback: () => {
              if (Config.IsAllow(1001104)) {
                this.props.history.push({
                  pathname: '/UserProjects',
                  search: "?id=" + row.id
                })
              }
            }
          },
          {
            text: Resources['Companies'][currentLanguage],
            callback: () => {
              if (Config.IsAllow(1001105)) {
                this.props.history.push({
                  pathname: '/AccountsCompaniesPermissions',
                  search: "?id=" + row.id
                })
              }
            }
          },
          {
            text: "Reset Password",
            callback: () => {
              if (Config.IsAllow(1001106)) {
                let text = "";
                let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                for (var i = 0; i < 7; i++) {
                  text += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                let _newPassEncode = CryptoJS.enc.Utf8.parse(JSON.stringify(text))
                let newPassEncode = CryptoJS.enc.Base64.stringify(_newPassEncode)

                this.setState({
                  NewPassword: newPassEncode,
                  showResetPasswordModal: true,
                  rowSelectedId: row.id,
                })
              }
            }
          }
        ]
      }];
    }
  }

  clickHandlerDeleteRowsMain = selectedRows => {
    if (Config.IsAllow(359)) {

      this.setState({
        showDeleteModal: true,
        selectedRows: selectedRows
      });
    } else {
      toast.warning(Resources["missingPermissions"][currentLanguage]);
    }
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

    Api.post("DeleteTaskMultiple", this.state.selectedRows)
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

        toast.success(Resources["operationSuccess"][currentLanguage]);

      }).catch(ex => {
        this.setState({
          isLoading: false,
          showDeleteModal: false
        });

        toast.warning(Resources["operationSuccess"][currentLanguage]);
      });
  };

  render() {
    const dataGrid =
      this.state.isLoading === false ? (
        <GridSetup rows={this.state.rows}
          columns={this.state.columns}
          showCheckbox={this.state.showCheckbox}
          IsActiv={this.IsActive}
          cellClick={this.cellClick}
          clickHandlerDeleteRows={this.clickHandlerDeleteRowsMain}
          getCellActions={this.GetCellActions}
          UnSelectIsActiv={this.UnSelectIsActiv}
          pageSize={this.state.pageSize}
        />
      ) : <LoadingSection />;

    const btnExport = this.state.isLoading === false ?
      <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.state.columns} fileName={this.state.pageTitle} />
      : null;

    const ComponantFilter = this.state.isLoading === false ?
      <Filter filtersColumns={this.state.filtersColumns} apiFilter={this.state.apiFilter} filterMethod={this.filterMethodMain} /> : null;

    return (
      <div className="mainContainer">
        <div className="submittalFilter">
          <div className="subFilter">
            <h3 className="zero">{this.state.pageTitle}</h3>
            <span>{this.state.rows.length}</span>
            <div className="ui labeled icon top right pointing dropdown fillter-button" tabIndex="0" onClick={() => this.hideFilter(this.state.viewfilter)}>
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
        <div className="filterHidden" style={{ maxHeight: this.state.viewfilter ? "" : "0px", overflow: this.state.viewfilter ? "" : "hidden" }}>
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
                 {/* <div className="V-tableSize">
                <img src={MinimizeH} alt="" />
              </div> */}
            </div>
            <div className={"grid-container " + (this.state.rows.length === 0 ? "griddata__load" : " ")}>
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
          ) : null
          }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
      document: state.communication.document,
      isLoading: state.communication.isLoading,
      changeStatus: state.communication.changeStatus,
      file: state.communication.file,
      files: state.communication.files,
      hasWorkflow: state.communication.hasWorkflow
  }
}

function mapDispatchToProps(dispatch) {
  return {
      actions: bindActionCreators(communicationActions, dispatch)
  };
}
  
export default  connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ProjectTasks));
