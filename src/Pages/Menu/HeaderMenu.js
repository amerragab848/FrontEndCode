import React, { Component, Fragment } from "react";
import { Link, withRouter, NavLink } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Notif from "../../Styles/images/notif-icon.png";
import Img from "../../Styles/images/avatar.png";
import Chart from "../../Styles/images/icons/chart-nav.svg";
import Setting from "../../Styles/images/icons/setting-nav.svg";
// import Message from "../../Styles/images/icons/message-nav.svg";
import CryptoJS from "crypto-js";
import config from "../../Services/Config";
import dataservice from "../../Dataservice";
import Select from "react-select";
import Resources from "../../resources.json";
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import Logo from "../../Styles/images/logo.svg";
import iconActive from "../../Styles/images/notif-iconActive.png";
import notifIcon from "../../Styles/images/notif-icon.png";
import baseActive from "../../Styles/images/grey-baseActive.png";
import greyBase from "../../Styles/images/grey-base.png";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as dashboardComponantActions from "../../store/actions/communication";
import moment from "moment";
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class HeaderMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabIndex: 0,
      projects: [],
      contactName: this.props.contactName,
      profilePath: this.props.profilePath ? this.props.profilePath : Img,
      activeClass: false,
      logOut: false,
      languageSelected: currentLanguage == "en" ? "en" : "ar",
      classRadio: currentLanguage == "en" ? true : false,
      selectedValue: {
        label: Resources.selectProjects[currentLanguage],
        value: "0"
      },
      viewNotification: false,
      notifications: [],
      taskes: [],
      totalNotification: 0,
      tabNotifi: true,
      tabTask: false
    };
    config.contactName = this.props.contactName;
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeTemplate = this.handleChangeTemplate.bind(this);
    this.handleChangeSelectProject = this.handleChangeSelectProject.bind(this);
    this.ReportCenterMenu = this.ReportCenterMenu.bind(this);
  }

  componentWillMount = () => {
    dataservice.GetDataList("GetAccountsProjectsByIdForList", "projectName", "projectId").then(result => {
      this.setState({
        projects: result
      });
    });

    dataservice.GetDataGrid("GetNotificationPostit").then(result => {
      this.setState({
        notifications: result
      });
    });

    dataservice.GetDataGrid("GetMyNotifcations").then(result => {
      this.setState({
        taskes: result
      });
    });
    this.windowonload()
  };

  windowonload(e) {
    //var notiClicked = document.getElementById('notiClicked');
    // document.onclick = function(e){
    //    if(e.target.id !== 'notiClicked'){
    //     console.log('this.state.viewNotification' )
    //    } else {
    //     console.log('this.state.notiClicked' )

    //    }
    // };
      window.addEventListener('click', function (e) {
        if (document.getElementById('notiClicked').contains(e.target)) {
          console.log('this.state.viewNotification')
        } else {
          console.log('this.state.notiClicked')
          
        }
      });
  
  };

  componentDidMount() {
    this.windowonload()
  }

  openProfile = () => {
    this.setState({
      activeClass: !this.state.activeClass
    });
  };

  userLogOut = () => {
    this.setState({
      logOut: true
    });
  };

  handleChange(event) {
    localStorage.setItem("lang", event.target.value);

    this.setState({
      languageSelected: event.target.value,
      classRadio: !this.state.classRadio
    });

    window.location.reload();
  }

  logOutHandler() {
    this.props.history.push("/");
    localStorage.clear();
    window.location.reload();
  }

  onCloseModal = () => {
    this.setState({ logOut: false });
  };

  handleChangeSelectProject(e) {
    localStorage.setItem("lastSelectedProject", e.value);
    localStorage.setItem("lastSelectedprojectName", e.label);
    this.props.actions.RouteToDashboardProject(e);
    this.props.history.push({ pathname: "/DashboardProject" });
  }

  handleChangeTemplate(e) {
    this.props.actions.RouteToTemplate();
  }

  ReportCenterMenu(e) {
    this.props.history.push({
      pathname: "/LeftReportMenu"
    });
  }

  onClickTabItem(tabIndex) {
    this.setState({
      tabIndex: tabIndex,
      tabNotifi: tabIndex === 0 ? true : false,
      tabTask: tabIndex === 1 ? true : false
    });
  }

  viewNotifications() {
    this.setState({
      viewNotification: !this.state.viewNotification
    });
  }

  navigateLink(link, param) {
    this.props.history.push({ pathname: "/" + link, search: "?id=" + param });
  }

  routeToView(docView, projectId, projectName, arrange) {
    dataservice.GetDataGrid("GetAccountsProjectsByIdForList").then(result => {
      result.forEach(item => {
        if (item.projectId === projectId) {
          if (docView.includes("expensesUserAddEdit")) {
            this.props.history.push(docView);
          } else {
            let obj = {
              docId: item.id,
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
    dataservice.addObject("UpdateStatusPostit", obj.id).then(result => {
      if (obj.description) {
        let id = obj.description.split("/")[1];

        switch (obj.description.split("/")[0]) {
          case "workspace":
            this.props.history.push(obj.description);
            break;

          case "expensesUserAddEdit":
            dataservice.GetDataGrid("GetExpensesUserForEdit?id=" + id).then(data => {
              this.routeToView(obj.description, data["projectId"], data["projectName"], data["arrange"] != null ? data["arrange"] : undefined);
            });
            break;

          case "transmittalAddEdit":
            dataservice.GetDataGrid("GetCommunicationTransmittalForEdit?id=" + id).then(data => {
              this.routeToView(obj.description, data["projectId"], data["projectName"], data["arrange"] != null ? data["arrange"] : undefined);
            });
            break;

          case "lettersAddEdit":
            dataservice.GetDataGrid("GetLettersById?id=" + id).then(data => {
              this.routeToView(obj.description, data["projectId"], data["projectName"], data["arrange"] != null ? data["arrange"] : undefined);
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
                );
              });
            break;

          case "phoneAddEdit":
            dataservice.GetDataGrid("GetPhoneById?id=" + id).then(data => {
              this.routeToView(
                obj.description,
                data["projectId"],
                data["projectName"],
                data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
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
                  data["arrange"] != null ? data["arrange"] : undefined
                );
              });
            break;

          case "projectTaskGroupAddEdit":
            dataservice
              .GetDataGrid("GetProjectTaskGroupForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined
                );
              });
            break;

          case "projectScheduleAddEdit":
            dataservice
              .GetDataGrid("GetProjectScheduleForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined
                );
              });
            break;

          case "projectDistributionListAddEdit":
            dataservice
              .GetDataGrid("GetProjectDistributionListForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined
                );
              });
            break;

          case "projectPrimaveraScheduleAddEdit":
            dataservice
              .GetDataGrid("GetPrimaveraScheduleForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined
                );
              });
            break;

          case "projectCheckListAddEdit":
            dataservice
              .GetDataGrid("GetProjectCheckListForEdit?id=" + id)
              .then(data => {
                this.routeToView(
                  obj.description,
                  data["projectId"],
                  data["projectName"],
                  data["arrange"] != null ? data["arrange"] : undefined
                );
              });
            break;
        }
      }
    });
  }

  showDetails() {
    this.setState({
      viewNotification: false
    });

    this.props.history.push({ pathname: "/postitNotificationsDetail" });
  }

  navigateMyTasks() {
    this.setState({
      viewNotification: false
    });
    this.props.history.push("/myTasks");
  }

  render() {
    let totalNotification = this.state.notifications.length + this.state.taskes.length;

    return (
      <div>
        <div className="wrapper">
          <header className={"main-header " + (this.props.showLeftMenu === false ? " dashboard__header" : " ")}>
            <div className="header-content">
              <ul className="nav-left">
                {this.props.showSelectProject === true ? (
                  <Fragment>
                    <li className="procoor__logo">
                      <NavLink to="/">
                        <img src={Logo} alt="logo" />
                      </NavLink>
                    </li>
                    <li className="dashboard__selectMenu">
                      <Select key="dash-selectproject" ref="dash-selectproject" options={this.state.projects}
                        isSearchable="true" defaultValue={this.state.value} value={this.state.selectedValue}
                        isMulti={false} onChange={this.handleChangeSelectProject} />
                    </li>
                  </Fragment>
                ) : null}

                {this.props.showLeftMenu === true ? (
                  <Fragment>
                    <li className="titleproject1">
                      <a href="">{this.props.moduleName} ·</a>
                    </li>
                    <li className="titleproject2">{this.props.projectName}</li>
                  </Fragment>
                ) : null}
              </ul>
              <ul className="nav-right">
                <li>
                  <a data-modal="modal1" className="notfiUI" onClick={this.ReportCenterMenu}>
                    <img alt="" title="" src={Chart} />
                  </a>
                </li>
                <li>
                  <NavLink to="/TemplatesSettings" onClick={this.handleChangeTemplate}>
                    <img alt="" title="" src={Setting} />
                  </NavLink>
                </li>
                <li className="notifi-icon">
                  <a id="notiClicked" onClick={this.viewNotifications.bind(this)}>
                    <img alt="" title="" src={Notif} />
                    <div className="inboxNotif smallSquare">
                      {totalNotification}
                    </div>
                  </a>
                  {this.state.viewNotification ? (
                    <div id="notiClosed" className="notifiBar">
                      <div className="smallNotifiBar">
                        <div className="notifi__tabs">
                          <Tabs selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.onClickTabItem(tabIndex)}>
                            <TabList className="zero">
                              <Tab className={this.state.tabNotifi ? "active" : ""}>
                                <span className="imgWrapper not__icon">
                                  <img className="activeImg" src={iconActive} />
                                  <img className="normalImg" src={notifIcon} />
                                </span>
                                <span className="tabNAme">
                                  {Resources["general"][currentLanguage]}
                                </span>
                              </Tab>
                              <Tab className={this.state.tabTask ? "active" : ""}>
                                <span className="imgWrapper base__icon">
                                  <img className="activeImg" src={baseActive} />
                                  <img className="normalImg" src={greyBase} />
                                </span>
                                <span className="tabNAme">
                                  {Resources["myTasks"][currentLanguage]}
                                </span>
                              </Tab>
                            </TabList>
                            <TabPanel>
                              <Fragment>
                                {this.state.notifications.map(item => {
                                  let now = moment(new Date());
                                  let sentDate = moment(item.sentDate);
                                  let duration = moment.duration(now.diff(sentDate));
                                  let diffDays = duration.asDays();

                                  let obj = {
                                    docId: item.id,
                                    projectId: window.localStorage.getItem("lastSelectedProject"),
                                    projectName: window.localStorage.getItem("lastSelectedprojectName"),
                                    arrange: 0,
                                    docApprovalId: 0,
                                    isApproveMode: false
                                  };

                                  let currentLink = item.description.split("/");

                                  let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj));
                                  let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);
                                  let link = currentLink[0] + "?id=" + encodedPaylod;

                                  return (
                                    <div className="notifiContent" key={item.id} onClick={() => this.updateStatus(item)}>
                                      <div className="notfiText">
                                        <div className="notifiName">
                                          <h3>{item.fromContactName}</h3>
                                          <p>{diffDays.toFixed(0) + " Days"}</p>
                                        </div>
                                        <p className="notofoWorkflow">
                                          <span>{item.documentName}</span>
                                          <a data-toggle="tooltip" title={item.title} href={link}
                                            onClick={() => this.navigateLink(currentLink[0], encodedPaylod).bind(this)}>
                                            “{item.title}”
                                          </a>
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })}
                                <div className="fullWidthWrapper">
                                  <button className="primaryBtn-1 btn smallBtn" onClick={this.showDetails.bind(this)}>
                                    {Resources["showMore"][currentLanguage]}
                                  </button>
                                </div>
                              </Fragment>
                            </TabPanel>
                            <TabPanel>
                              {this.state.taskes.map(item => {
                                let now = moment(new Date());
                                let docDate = moment(item.docDate);
                                let duration = moment.duration(now.diff(docDate));
                                let diffDays = duration.asDays();

                                let link = "/taskDetails?id=" + item.id;

                                return (
                                  <div className="notifiContent" key={item.id} onClick={this.navigateMyTasks.bind(this)}>
                                    <figure className="avatarProfile smallAvatarSize">
                                      <img src={item.userImage} />
                                    </figure>
                                    <div className="notfiText">
                                      <div className="notifiName">
                                        <h3>{item.fromContactName}</h3>
                                        <p>{diffDays.toFixed(0) + " Days"}</p>
                                      </div>
                                      <p className="notofoWorkflow">
                                        {item.projectName + " - " + item.statusName}
                                        <a href={link}>“{item.subject}”</a>
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </TabPanel>
                          </Tabs>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </li>
                {/* <li>
                  <a>
                    <img alt="" title="" src={Message} />
                  </a>
                </li> */}
                <li className="UserImg ">
                  <div className={this.state.activeClass === false ? "dropdownContent" : "dropdownContent active"} onClick={this.openProfile} >
                    <figure className="zero avatarProfile onlineAvatar">
                      <img alt="" title="" src={this.state.profilePath} />
                      <span className="avatarStatusCircle" />
                    </figure>
                    <span className="profileName">
                      {this.state.contactName}
                    </span>
                    <div className="ui dropdown classico basic">
                      <i className="dropdown icon" />
                      <div className="menu center left">
                        <div className="item">
                          <Link to="/ProfileSetting" className="item-content">
                            {Resources["profile"][currentLanguage]}
                          </Link>
                        </div>
                        <div className="item">
                          <Link to="/PrivacySetting" className="item-content">
                            {Resources["privacySettings"][currentLanguage]}
                          </Link>
                        </div>
                        <div className="item">
                          <div className="item-content">
                            {Resources["clearSettings"][currentLanguage]}
                          </div>
                        </div>
                        <div className="item">
                          <div className="item-content">
                            {Resources["clearCach"][currentLanguage]}
                          </div>
                        </div>
                        <div className="item">
                          <div className="ui checkbox radio radioBoxBlue">
                            <input type="radio" value="en" checked={this.state.languageSelected === "en"} onChange={event => this.handleChange(event)} />
                            <label>English</label>
                          </div>
                          <div className="ui checkbox radio radioBoxBlue">
                            <input type="radio" value="ar" checked={this.state.languageSelected === "ar"} onChange={event => this.handleChange(event)} />
                            <label>عربى</label>
                          </div>
                        </div>
                        <div className="item">
                          <div className="item-content" onClick={this.userLogOut}>
                            {Resources["logout"][currentLanguage]}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
              <div className="clearfix" />
            </div>
          </header>
        </div>
        {this.state.logOut ? (
          <ConfirmationModal closed={this.onCloseModal} showDeleteModal={this.state.logOut} clickHandlerCancel={this.onCloseModal}
            clickHandlerContinue={() => this.logOutHandler()} title="You Will Be Missed, Are You Sure Want to Leave US?" buttonName="submit" />
        ) : null}

      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    showLeftMenu: state.communication.showLeftMenu,
    showSelectProject: state.communication.showSelectProject,
    projectId: state.communication.projectId,
    projectName: state.communication.projectName,
    moduleName: state.communication.moduleName,
    showLeftReportMenu: state.communication.showLeftReportMenu
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(dashboardComponantActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HeaderMenu));
