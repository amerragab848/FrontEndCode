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

    //this.viewNotifications = this.handleClick.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.handleOutsideClickProfile = this.handleOutsideClickProfile.bind(this);
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
  };

  openProfile = () => {
    if (!this.state.activeClass) {
      // attach/remove event handler
      document.addEventListener('click', this.handleOutsideClickProfile, false);
    } else {
      document.removeEventListener('click', this.handleOutsideClickProfile, false);
    }
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
    if (!this.state.viewNotification) {
      // attach/remove event handler
      document.addEventListener('click', this.handleOutsideClick, false);
    } else {
      document.removeEventListener('click', this.handleOutsideClick, false);
    }
    this.setState({
      viewNotification: !this.state.viewNotification
    });
  }

  handleOutsideClick(e) {
    if (this.node.contains(e.target)) {
      return;
    }
    this.viewNotifications();
  }

  handleOutsideClickProfile(e) {
    if (this.profile.contains(e.target)) {
      return;
    }
    this.openProfile();
  }

  navigateLink(link, param) {
    if (link != "") {
      this.props.history.push({ pathname: "/" + link, search: "?id=" + param });
    }
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
                    {/* <img alt="" title="" src={Chart} /> */}
                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24">
                      <g fill="none" fill-rule="evenodd" transform="translate(3 3)">
                        <g fill="#A8B0BF">
                          <path id="a" d="M16.511 11.777c.55.232.715.9.5 1.321A8.999 8.999 0 1 1 4.523 1.189c.424-.243 1.108-.132 1.46.475.35.607-.128 1.248-.506 1.475a6.836 6.836 0 1 0 9.528 9.124c.372-.685.956-.72 1.506-.486zM18 9c0 .598-.484 1.082-1.082 1.082H9A1.082 1.082 0 0 1 7.918 9V1.082C7.918.484 8.402 0 9 0a8.997 8.997 0 0 1 9 9zm-4.1-4.89A7.304 7.304 0 0 0 9.89 2.06V8.12h6.058A7.305 7.305 0 0 0 13.9 4.11z"
                          />
                        </g>
                      </g>
                    </svg>
                  </a>
                </li>
                <li>
                  <NavLink to="/TemplatesSettings" onClick={this.handleChangeTemplate}>
                    {/* <img alt="" title="" src={Setting} /> */}
                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24">
                      <g fill="none" fill-rule="evenodd" transform="translate(3 3)">
                        <g fill="#A8B0BF">
                          <path id="a" d="M3.602 13.71c.604-.333 1.455-.323 2.05.024l1.386.808c.595.346 1.03 1.084 1.048 1.776l.017.663 1.794-.002.017-.66c.017-.693.452-1.43 1.048-1.778l1.386-.807c.595-.346 1.447-.357 2.047-.026l.578.317.897-1.568-.56-.346c-.586-.362-1.001-1.11-1.001-1.802l-.002-1.616c0-.691.416-1.441 1.002-1.803l.56-.346-.896-1.568-.575.315c-.604.332-1.455.322-2.05-.025l-1.386-.808c-.595-.346-1.03-1.084-1.048-1.776l-.017-.663-1.794.002-.017.66c-.017.693-.452 1.43-1.048 1.778l-1.386.807c-.595.346-1.447.357-2.047.026l-.578-.317-.897 1.568.56.346c.586.362 1.001 1.11 1.001 1.802l.002 1.616c0 .691-.416 1.441-1.002 1.803l-.56.346.896 1.568.575-.315zm-2.13 1.634L.22 13.154a1.66 1.66 0 0 1 .558-2.23l.868-.535a.27.27 0 0 1 .045-.082L1.69 8.692a.313.313 0 0 1-.045-.082l-.869-.536a1.658 1.658 0 0 1-.558-2.23l1.253-2.189a1.63 1.63 0 0 1 2.193-.627l.897.491c-.01-.006.1-.007.09-.002l1.386-.806a.317.317 0 0 1 .048-.08l.026-1.03C6.137.713 6.863.003 7.746.003L10.253 0c.881 0 1.61.71 1.635 1.602l.026 1.028c0-.01.056.084.048.08l1.386.808a.327.327 0 0 1 .093 0l.896-.49a1.628 1.628 0 0 1 2.191.628l1.251 2.19a1.66 1.66 0 0 1-.558 2.23l-.868.535a.27.27 0 0 1-.045.082l.001 1.615c0-.01.054.087.045.082l.869.536c.753.465 1 1.458.558 2.23l-1.253 2.189a1.63 1.63 0 0 1-2.193.627l-.897-.491c.01.006-.1.007-.09.002l-1.386.806a.317.317 0 0 1-.048.08l-.026 1.03c-.025.889-.751 1.599-1.634 1.599L7.747 19c-.881 0-1.61-.71-1.635-1.602l-.026-1.028a.287.287 0 0 1-.048-.08l-1.386-.808a.327.327 0 0 1-.093 0l-.896.49a1.628 1.628 0 0 1-2.191-.628zm4.334-7.72a3.676 3.676 0 0 1 5.046-1.364c1.767 1.03 2.373 3.31 1.352 5.092a3.676 3.676 0 0 1-5.046 1.363c-1.767-1.029-2.373-3.309-1.352-5.09zm2.352 3.354c.81.474 1.847.193 2.315-.627.468-.82.19-1.868-.62-2.341a1.684 1.684 0 0 0-2.315.627c-.469.82-.19 1.868.62 2.341z"
                          />
                        </g>
                      </g>
                    </svg>
                  </NavLink>
                </li>
                <li ref={node => { this.node = node }} className="notifi-icon">
                  <a id="notiClicked" onClick={this.viewNotifications.bind(this)}>
                    {/* <img alt="" title="" src={Notif} /> */}
                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24">
                      <g fill="none" fill-rule="evenodd" transform="translate(4 2)">
                        <g fill="#A8B0BF" mask="url(#b)">
                          <path id="a" d="M13.714 9V7c0-2.414-1.968-4.435-4.572-4.898V0H6.858v2.102C4.252 2.565 2.285 4.586 2.285 7v2c0 5.133-.57 6-2.285 6v2h16v-2c-1.714 0-2.286-.866-2.286-6zm-9.979 6c.836-1.581.836-3.872.836-6V7c0-1.653 1.538-3 3.428-3s3.43 1.347 3.43 3v2c0 2.128 0 4.419.835 6H3.735zm1.98 3h4.571v2H5.714v-2z"
                          />
                        </g>
                      </g>
                    </svg>
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
                    // <img alt="" title="" src={Message} />
                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24">
                          <g fill="none" fill-rule="evenodd" transform="translate(1 3)">
                              <g fill="#A8B0BF" mask="url(#b)">
                                  <path id="a" d="M5.554 9.537v2.059H4.72l-2.388 2.343a1.378 1.378 0 0 1-1.487.29A1.34 1.34 0 0 1 0 12.985V4.671C0 2.094 2.136 0 4.76 0h5.379c1.551 0 2.978.738 3.869 1.96.13.185.289.47.377.665l.187.41h-.453c-.086 0-.2.002-.837.011l-.059.001c-.475.007-.73.01-.862.01h-.132l-.087-.099a2.667 2.667 0 0 0-2.004-.898H4.759c-1.471 0-2.668 1.173-2.668 2.612v6.598l1.366-1.34c.258-.253.6-.392.964-.392l1.133-.001zm11.686-4.87c2.624 0 4.76 2.095 4.76 4.673v8.316c0 .546-.333 1.034-.844 1.24a1.377 1.377 0 0 1-1.487-.289l-2.388-2.343h-5.42c-2.578 0-4.686-2.028-4.747-4.565V9.617l-.01-.292c.008-2.57 2.14-4.656 4.757-4.655h.947l4.432-.002zm2.67 4.672c0-1.44-1.197-2.613-2.67-2.613h-5.873c-.934 0-2.175 1.35-2.175 2.613v2.254c0 1.44 1.197 2.613 2.67 2.613h5.718c.363 0 .705.139.964.392l1.365 1.34v-6.6z"></path>
                              </g>
                          </g>
                      </svg>
                  </a>
                </li> */}
                <li className="UserImg" ref={profile => { this.profile = profile; }}>
                  <div className={this.state.activeClass === false ? "dropdownContent" : "dropdownContent active"} onClick={this.openProfile} >
                    <figure className="zero avatarProfile onlineAvatar">
                      <img alt="" title="" src={this.state.profilePath} />
                      <span className="avatarStatusCircle" />
                    </figure>
                    <span className="profileName">
                      {this.state.contactName}
                    </span>
                    <div className="ui dropdown classico basic">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                        <path fill="#5E6475" fill-rule="evenodd" d="M11.319 6c.886 0 .8.687.346 1.235-.587.705-2.28 2.757-2.728 3.224-.69.721-1.004.722-1.696 0L4.303 7.235C3.866 6.719 3.848 6 4.606 6h6.713z"
                        />
                      </svg>
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
        {
          this.state.logOut ? (
            <ConfirmationModal closed={this.onCloseModal} showDeleteModal={this.state.logOut} clickHandlerCancel={this.onCloseModal}
              clickHandlerContinue={() => this.logOutHandler()} title="You Will Be Missed, Are You Sure Want to Leave US?" buttonName="submit" />
          ) : null
        }
        {/*         
        {this.state.viewNotification ? (
          <div className="notifiBar">
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
                                {currentLink[0] != "" ? <a data-toggle="tooltip" title={item.title} href={link}
                                  onClick={() => this.navigateLink(currentLink[0], encodedPaylod).bind(this)}>
                                  “{item.title}”
                                </a> : <span>“{item.title}”</span>}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      <div className="fullWidthWrapper">
                        <button className="primaryBtn-1 btn smallBtn" onClick={ this.showDetails.bind(this) }>
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

                      let link = "/taskDetails?id="+item.id; 

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
        ) : null} */}

      </div >
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
