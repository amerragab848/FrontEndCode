import React, { Component } from "react";
import dataservice from "../../Dataservice";
import ReactTable from "react-table";
import "react-table/react-table.css";
import Resources from "../../resources.json";
import moment from "moment";
import { toast } from "react-toastify";
import CryptoJS from "crypto-js";
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as communicationActions from '../../store/actions/communication';
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
let selectedRows = [];

class postitNotificationsDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postitData: [],
      selected: {},
      showDeleteModal: false
    };
  }

  componentWillMount = () => {
    dataservice.GetDataGrid("GetNotificationPostitDetail").then(result => {
      this.setState({
        postitData: result
      });
    });
  };
  componentDidMount() {
    this.props.actions.RouteToTemplate();
  }

  toggleRow(obj) {

    const newSelected = Object.assign({}, this.state.selected);

    newSelected[obj.id] = !this.state.selected[obj.id];

    let setIndex = selectedRows.findIndex(x => x.id === obj.id);

    if (setIndex > -1) {
      selectedRows.splice(setIndex, 1);
    } else {
      selectedRows.push(obj);
    }

    this.setState({
      selected: newSelected
    });
  }

  DeletePostit() {
    this.setState({
      showDeleteModal: true
    });
  }

  clickHandlerContinueMain = () => {

    if (selectedRows.length > 0) {

      let listIds = selectedRows.map(rows => rows.id);

      dataservice.addObject("DeleteNotificationPostitMultiple", listIds).then(result => {

        let originalData = this.state.postitData;

        selectedRows.forEach(item => {
          let getIndex = originalData.findIndex(x => x.id === item.id);

          originalData.splice(getIndex, 1);
        });

        selectedRows = [];

        this.setState({
          postitData: originalData,
          showDeleteModal: false
        });

        toast.success(Resources["operationSuccess"][currentLanguage]);

      }).catch(ex => {
        toast.error(Resources["operationSuccess"][currentLanguage]);
      });
    }
  };

  routeToView(docView, projectId, projectName, arrange, docId) {
    dataservice.GetDataGrid("GetAccountsProjectsByIdForList").then(result => {
      result.forEach(item => {
        if (item.projectId === projectId) {
          if (docView.includes("expensesUserAddEdit")) {
            this.props.history.push(docView);
          } else {
            let obj = {
              docId,
              projectId: projectId,
              projectName: projectName,
              arrange: arrange,
              docApprovalId: 0,
              isApproveMode: false
            };

            let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj));
            let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);

            this.props.history.push({
              pathname: "/" + docView.split("/")[0],
              search: "?id=" + encodedPaylod
            });
          }
        }
      });
    });
  }

  updateStatus(obj) {
    dataservice.addObject(`UpdateStatusPostit?id=${obj.id}`, null).then(result => {
      if (obj.description) {
        let id = obj.description.split("/")[1];
        console.log(obj.description)
        switch (obj.description.split("/")[0]) {
          case "workspace":
            this.props.history.push(obj.description);
            break;

          case "expensesUserAddEdit":
            dataservice.GetDataGrid("GetExpensesUserForEdit?id=" + id).then(data => {
              this.routeToView(obj.description, data["projectId"], data["projectName"], data["arrange"] != null ? data["arrange"] : undefined, id);
            });
            break;

          case "transmittalAddEdit":
            dataservice.GetDataGrid("GetCommunicationTransmittalForEdit?id=" + id).then(data => {
              this.routeToView(obj.description, data["projectId"], data["projectName"], data["arrange"] != null ? data["arrange"] : undefined, id);
            });
            break;

          case "lettersAddEdit":
            dataservice.GetDataGrid("GetLettersById?id=" + id).then(data => {
              this.routeToView(obj.description, data["projectId"], data["projectName"], data["arrange"] != null ? data["arrange"] : undefined, id);
            });
            break;

          case "rfiAddEdit":
            dataservice
              .GetDataGrid("GetCommunicationRfiForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "correspondenceReceivedAddEdit":
            dataservice
              .GetDataGrid(
                "GetCommunicationCorrespondenceReceivedForEdit?id=" + id
              )
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "correspondenceSentAddEdit":
            dataservice
              .GetDataGrid("GetCommunicationCorrespondenceSentForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "emailAddEdit":
            dataservice
              .GetDataGrid("GetCommunicationEmailsForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "internalMemoAddEdit":
            dataservice
              .GetDataGrid("GetCommunicationInternalMemoForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "meetingAgendaAddEdit":
            dataservice
              .GetDataGrid("GetCommunicationMeetingAgendaForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "meetingMinutesAddEdit":
            dataservice
              .GetDataGrid("GetCommunicationMeetingMinutesForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "NCRAddEdit":
            dataservice
              .GetDataGrid("GetCommunicationNCRsForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "phoneAddEdit":
            dataservice.GetDataGrid("GetPhoneById?id=" + id).then(data => {
              this.routeToView(
                obj.description,
                data["projectId"],
                data["projectName"],
                data["arrange"] != null ? data["arrange"] : undefined, id
              );
            });
            break;

          case "proposalAddEdit":
            dataservice
              .GetDataGrid("GetCommunicationProposalForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "reportsAddEdit":
            dataservice
              .GetDataGrid("GetCommunicationReportForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "requestProposalAddEdit":
            dataservice
              .GetDataGrid("GetRequestProposalById?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "boqAddEdit":
            dataservice
              .GetDataGrid("GetContractsBoqForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "changeOrderAddEdit":
            dataservice
              .GetDataGrid("GetContractsChangeOrderForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "clientModificationAddEdit":
            dataservice
              .GetDataGrid("GetContractsClientModificationsForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "contractInfoAddEdit":
            dataservice
              .GetDataGrid("GetContractsForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "costCodingTreeAddEdit":
            dataservice
              .GetDataGrid("GetCostCodingTreeForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "invoicesForPoAddEdit":
            dataservice
              .GetDataGrid("GetContractsInvoicesForPoForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "pcoAddEdit":
            dataservice
              .GetDataGrid("GetContractsPcoForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "procurementAddEdit":
            dataservice
              .GetDataGrid("GetContractsProcurementForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "projectIssuesAddEdit":
            dataservice
              .GetDataGrid("GetContractsProjectIssuesForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "purchaseOrderAddEdit":
            dataservice
              .GetDataGrid("GetContractsPurchaseOrdersForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "qsAddEdit":
            dataservice
              .GetDataGrid("GetContractsQsForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "requestPaymentsAddEdit":
            dataservice
              .GetDataGrid("GetContractsRequestPaymentsForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "siteRequestAddEdit":
            dataservice
              .GetDataGrid("GetContractsSiteRequestForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "variationRequestAddEdit":
            dataservice
              .GetDataGrid("GetContractsVariationRequestForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "addEditDrawing":
            dataservice
              .GetDataGrid("GetLogsDrawingsForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "drawingListAddEdit":
            dataservice
              .GetDataGrid("GetDesignDrawingListForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "drawingPhasesAddEdit":
            dataservice
              .GetDataGrid("GetDesignDrawingPhasesForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "drawingSetsAddEdit":
            dataservice
              .GetDataGrid("GetLogsDrawingsSetsForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "resourcesTreeEdit":
            dataservice
              .GetDataGrid("GetResourcesTreeForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "baseAddEdit":
            dataservice
              .GetDataGrid("GetEstimationBaseForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "budgetFileAddEdit":
            dataservice
              .GetDataGrid("GetEstimationBudgetfileForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "projectEstimateAddEdit":
            dataservice
              .GetDataGrid("GetProjectEstimateForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "tenderAnalysisAddEdit":
            dataservice
              .GetDataGrid("GetTenderAnalysisForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "clientSelectionAddEdit":
            dataservice
              .GetDataGrid("GetLogsClientSelectionForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "dailyReportsAddEdit":
            dataservice
              .GetDataGrid("GetLogsDailyReportsForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "equipmentDeliveryAddEdit":
            dataservice
              .GetDataGrid("GetCommunicationRfiForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "inspectionRequestAddEdit":
            dataservice
              .GetDataGrid("GetInspectionRequestForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "materialDeliveryAddEdit":
            dataservice
              .GetDataGrid("GetMaterialDeliveryForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "materialInspectionRequestAddEdit":
            dataservice
              .GetDataGrid("GetMaterialInspectionRequestForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "materialInventoryAddEdit":
            dataservice
              .GetDataGrid("GetLogsMaterialInventoriesForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "materialReleaseAddEdit":
            dataservice
              .GetDataGrid("GetLogsMaterialReleaseForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "punchListAddEdit":
            dataservice
              .GetDataGrid("GetLogsPunchListsForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "qualityControlAddEdit":
            dataservice
              .GetDataGrid("GetLogsQualityControlForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "siteInstructionsAddEdit":
            dataservice
              .GetDataGrid("GetLogsSiteInstructionsForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "submittalAddEdit":
            dataservice
              .GetDataGrid("GetLogsSubmittalForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "submittalSetsAddEdit":
            dataservice
              .GetDataGrid("GetLogsSubmittalSetsForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "weeklyReportsAddEdit":
            dataservice
              .GetDataGrid("GetLogsWeeklyReportsForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "projectWorkFlowAddEdit":
            dataservice
              .GetDataGrid("GetWorkFlowForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "projectCompaniesAddEdit":
            dataservice
              .GetDataGrid("GetProjectCompaniesForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined, id
                );
              });
            break;

          case "projectTaskGroupAddEdit":
            dataservice.GetDataGrid("GetProjectTaskGroupForEdit?id=" + id).then(data => {
              this.routeToView(obj.description, data["projectId"], data["projectName"], data["arrange"] != null ? data["arrange"] : undefined, id);
            });
            break;

          case "projectScheduleAddEdit":
            dataservice.GetDataGrid("GetProjectScheduleForEdit?id=" + id).then(data => {
              this.routeToView(obj.description, data["projectId"], data["projectName"], data["arrange"] != null ? data["arrange"] : undefined, id);
            });
            break;

          case "projectDistributionListAddEdit":
            dataservice.GetDataGrid("GetProjectDistributionListForEdit?id=" + id).then(data => {
              this.routeToView(obj.description, data["projectId"], data["projectName"], data["arrange"] != null ? data["arrange"] : undefined, id);
            });
            break;

          case "projectPrimaveraScheduleAddEdit":
            dataservice.GetDataGrid("GetPrimaveraScheduleForEdit?id=" + id).then(data => {
              this.routeToView(obj.description, data["projectId"], data["projectName"], data["arrange"] != null ? data["arrange"] : undefined, id);
            });
            break;

          case "projectCheckListAddEdit":
            dataservice.GetDataGrid("GetProjectCheckListForEdit?id=" + id).then(data => {
              this.routeToView(obj.description, data["projectId"], data["projectName"], data["arrange"] != null ? data["arrange"] : undefined, id);
            });
            break;
        }
      }
    });
  }

  render() {
    const columns = [
      {
        Header: Resources["checkList"][currentLanguage],
        id: "id",
        accessor: "id",
        Cell: ({ row }) => {
          return (
            <div className="ui checked checkbox  checkBoxGray300 ">
              <input type="checkbox" className="checkbox" checked={this.state.selected[row._original.id] === true}
                onChange={() => this.toggleRow(row._original)} />
              <label />
            </div>
          );
        },
        width: 50
      },
      {
        Header: Resources["status"][currentLanguage],
        id: "readUnread",
        accessor: "readUnread",
        Cell: ({ row }) => {
          if (row._original.viewStatus === false) {
            return (
              <div onClick={() => this.updateStatus(row._original)} style={{ cursor: "pointer", padding: "4px 8px", margin: "4px auto", borderRadius: "100px", backgroundColor: "#E74C3C", width: "auto", color: "#FFF", minWidth: ' 61px', height: '24px', fontFamily: 'Muli', fontSize: '11px', fontWeight: 'bold', fontStyle: 'normal', fontStretch: 'normal', lineHeight: '1.45', letterSpacing: '-0.2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {Resources["unRead"][currentLanguage]}
              </div>
            );
          } else {
            return (
              <div style={{ margin: "4px auto", padding: "4px 8px", borderRadius: '100px', backgroundColor: "#e9ecf0", width: "auto", minWidth: ' 43px', height: '24px', fontFamily: 'Muli', fontSize: '11px', fontWeight: 'bold', fontStyle: 'normal', fontStretch: 'normal', lineHeight: '1.45', letterSpacing: '-0.2px', color: '#858d9e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {Resources["read"][currentLanguage]}
              </div>
            );
          }
        },
        width: 150
      },
      {
        Header: Resources["title"][currentLanguage],
        accessor: "title",
        sortabel: true,
        width: 400
      },
      {
        Header: Resources["fromContact"][currentLanguage],
        accessor: "fromContactName",
        width: 200,
        sortabel: true
      },
      {
        Header: Resources["status"][currentLanguage],
        accessor: "statusName",
        width: 200,
        sortabel: true
      },
      {
        Header: Resources["sentDate"][currentLanguage],
        accessor: "sentDate",
        width: 200,
        sortabel: true,
        Cell: row => (
          <span>
            <span>{moment(row.value).format("DD/MM/YYYY")}</span>
          </span>
        )
      },
      {
        Header: Resources["sendMethod"][currentLanguage],
        accessor: "sendMethod",
        width: 200,
        sortabel: true
      },
    ];

    return (
      <div>
        <div className="mainContainer main__withouttabs">
          <div class="submittalFilter">
            <div class="subFilter">
              <h3 class="zero">{Resources["Postit"][currentLanguage]}</h3>
            </div>
          </div>
          <div style={{ position: "relative" }}>
            {selectedRows.length > 0 ? (
              <div className={"gridSystemSelected " + (selectedRows.length > 0 ? " active" : "")} style={{ top: '0px' }}>
                <div className="tableselcted-items">
                  <span id="count-checked-checkboxes">{selectedRows.length}</span>
                  <span>Selected</span>
                </div>
                <div className="tableSelctedBTNs">
                  <button className="defaultBtn btn smallBtn" onClick={this.DeletePostit.bind(this)}>
                    {Resources["delete"][currentLanguage]}
                  </button>
                </div>
              </div>
            ) : null}
            <ReactTable
              data={this.state.postitData}
              columns={columns}
              defaultPageSize={10}
              noDataText={Resources["noData"][currentLanguage]}
              className="-striped -highlight"
            />
          </div>
        </div>
        {this.state.showDeleteModal == true ? (
          <ConfirmationModal title={Resources["smartDeleteMessage"][currentLanguage].content} buttonName="delete" closed={this.onCloseModal}
            showDeleteModal={this.state.showDeleteModal} clickHandlerCancel={this.clickHandlerCancelMain}
            clickHandlerContinue={this.clickHandlerContinueMain.bind(this)} />) : null}
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

export default connect(mapStateToProps, mapDispatchToProps)(postitNotificationsDetail);
