import React, { Component, Fragment } from "react";
import { Link, withRouter, NavLink } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Img from "../../Styles/images/avatar.png";
import CryptoJS from "crypto-js";
import config from "../../Services/Config";
import dataservice from "../../Dataservice";
import Select, { components } from "react-select";
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
import { toast } from "react-toastify";
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const DashboardArrow = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" xmlnsXlink="http://www.w3.org/1999/xlink">
      <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="Icons/Info/drop/dproimaryBtn2/16px/Black" fill="#4382F9">
          <g id="info_24pt-black">
            <path fill="#4382F9" fillRule="evenodd" d="M11.319 6c.886 0 .8.687.346 1.235-.587.705-2.28 2.757-2.728 3.224-.69.721-1.004.722-1.696 0L4.303 7.235C3.866 6.719 3.848 6 4.606 6h6.713z"></path>
          </g>
        </g>
      </g>
    </svg>
  );
};

const DropdownIndicator = props => {
  return (
    <Fragment>
      <components.DropdownIndicator {...props}>
        <DashboardArrow />
      </components.DropdownIndicator>
    </Fragment>
  );
};

let publicFonts = currentLanguage === "ar" ? 'cairo-b' : 'Muli, sans-serif'


const dashboardMenu = {
  control: (styles, { isFocused }) =>
    ({
      ...styles,
      transition: ' all 0.4s ease-in-out',
      width: '166px',
      height: '36px',
      borderRadius: '4px',
      border: isFocused ? 'solid 1px #3570e6' : 'solid 1px #5f98fa',
      backgroundColor: isFocused ? '#f7faff' : 'rgba(255, 255, 255, 0)',
      boxShadow: isFocused ? 'none' : 'none',
      cursor: 'pointer',
      '&:hover': {
        border: ' solid 1px #4382f9',
        backgroundColor: ' #fafcff',
      }
    }),
  option: (styles, { isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isDisabled ? '#fff' : isSelected ? '#e9ecf0' : isFocused ? '#f2f6fa' : "#fff",
      color: '#3e4352',
      fontSize: '14px',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      textTransform: 'capitalize',
      fontFamily: publicFonts,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    };
  },
  input: styles => ({ ...styles, maxWidth: '100%' }),
  placeholder: styles => ({ ...styles, color: '#3570e6', fontSize: '14', width: '100%', fontFamily: publicFonts, fontWeight: '700' }),
  singleValue: styles => ({ ...styles, color: '#3570e6', fontSize: '14', width: '100%', fontFamily: publicFonts, fontWeight: '700' }),
  indicatorSeparator: styles => ({ ...styles, opacity: '0.3', backgroundColor: '#83b4fc' }),
  menu: styles => ({ ...styles, zIndex: 155, boxShadow: '0 4px 6px 0 rgba(0, 0, 0, 0.2)', border: 'solid 1px #ccd2db' }),
  dropdownIndicator: styles => ({ ...styles, fill: '#83b4fc' })
};

class HeaderMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      subjectText: '',
      tabIndex: 0,
      projects: [],
      contactName: this.props.contactName,
      profilePath: this.props.profilePath ? this.props.profilePath : Img,
      activeClass: false,
      logOut: false,
      languageSelected: currentLanguage === "en" ? "en" : "ar",
      classRadio: currentLanguage === "en" ? true : false,
      selectedValue: {
        label: Resources.selectProjects[currentLanguage],
        value: "0"
      },
      viewNotification: false,
      notifications: [],
      taskes: [],
      totalNotification: 0,
      tabNotifi: true,
      tabTask: false,
      searchClass: false,
    };
    config.contactName = this.props.contactName;
    this.handleChange = this.handleChange.bind(this);
    this.handleClearCach = this.handleClearCach.bind(this);
    this.handleClearSettings = this.handleClearSettings.bind(this);
    this.handleChangeTemplate = this.handleChangeTemplate.bind(this);
    this.handleChangeSelectProject = this.handleChangeSelectProject.bind(this);
    this.ReportCenterMenu = this.ReportCenterMenu.bind(this);

    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.handleOutsideClickProfile = this.handleOutsideClickProfile.bind(this);
  }

  componentDidMount = () => {
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

  handleClearCach() {

    var res = [];

    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);

      if (key.indexOf("DFL_") > -1) {
        res.push(key);
        localStorage.removeItem(key);
      }
    }

    toast.success(Resources["operationSuccess"][currentLanguage]);

    this.setState({
      clearCach: false
    });
  }

  handleClearSettings() {

    var res = [];

    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if (key.indexOf("KO-Grid-") > -1 || key.indexOf("Widgets_Order") > -1 || key.indexOf("DFL_") > -1) {
        res.push(key);
        localStorage.removeItem(key);
      }
    }

    toast.success(Resources["operationSuccess"][currentLanguage]);

    this.setState({
      clearSettings: false
    });
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
    if (link !== "") {
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
    dataservice.addObject(`UpdateStatusPostit?id=${obj.id}`, null).then(result => {
      if (obj.description) {
        let id = obj.description.split("/")[1];

        switch (obj.description.split("/")[0]) {
          case "workspace":
            this.props.history.push(obj.description);
            break;

          case "expensesUserAddEdit":
            dataservice.GetDataGrid("GetExpensesUserForEdit?id=" + id).then(data => {
              this.routeToView(obj.description, data["projectId"], data["projectName"], data["arrange"] !== null ? data["arrange"] : undefined);
            });
            break;

          case "transmittalAddEdit":
            dataservice.GetDataGrid("GetCommunicationTransmittalForEdit?id=" + id).then(data => {
              this.routeToView(obj.description, data["projectId"], data["projectName"], data["arrange"] !== null ? data["arrange"] : undefined);
            });
            break;

          case "lettersAddEdit":
            dataservice.GetDataGrid("GetLettersById?id=" + id).then(data => {
              this.routeToView(obj.description, data["projectId"], data["projectName"], data["arrange"] !== null ? data["arrange"] : undefined);
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
                );
              });
            break;

          case "phoneAddEdit":
            dataservice.GetDataGrid("GetPhoneById?id=" + id).then(data => {
              this.routeToView(
                obj.description,
                data["projectId"],
                data["projectName"],
                data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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
                  data["arrange"] !== null ? data["arrange"] : undefined
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

  searchClick = () => {
    if (this.state.subjectText) {
      let obj = {
        subject: this.state.subjectText
      };
      let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj));
      let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);

      this.props.history.push({
        pathname: "/GlobalSearch",
        search: "?id=" + encodedPaylod
      });
    }
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
                    <li className="default__dropdown">
                      <Select key="dash-selectproject" ref="dash-selectproject" options={this.state.projects}
                        isSearchable="true" defaultValue={this.state.value} value={this.state.selectedValue}
                        isMulti={false} onChange={this.handleChangeSelectProject} styles={dashboardMenu} components={{ DropdownIndicator }} />
                    </li>
                  </Fragment>
                ) : null}

                {this.props.showLeftMenu === true ? (
                  <Fragment>
                    <li className="titleproject1"> <a href="">{this.props.moduleName} ·</a> </li>
                    <li className="titleproject2">{this.props.projectName}</li>
                  </Fragment>
                ) : null}
              </ul>
              <ul className="nav-right">
                <li ref={search => { this.search = search }}>
                  <a>
                    <div className="header__search ">
                      <span onClick={this.searchClick}>
                        <svg width="24" height="24" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                          <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                            <g id="Icons/Search/16px/Light-grey" fill="#A8B0BF" stroke="#A8B0BF">
                              <g id="search">
                                <path d="M7.26998519,1.00030679 C5.21410776,0.99945959 3.28858201,2.00665384 2.11723694,3.6959605 C0.945891873,5.38526717 0.677539882,7.54107511 1.39781093,9.46666586 C2.11892701,11.3913466 3.73811764,12.8411624 5.73044429,13.3455818 C7.72368098,13.8491778 9.83708563,13.3447346 11.3867453,11.9938981 L14.2594224,14.8715588 C14.4286998,15.0408362 14.7037795,15.0408362 14.8730461,14.8715588 C15.0423126,14.7022815 15.0423234,14.4272017 14.8730461,14.2579352 L11.9953853,11.3826579 C13.0559011,10.1672412 13.6069057,8.58950045 13.5341245,6.97895515 C13.4604897,5.36743481 12.7681351,3.84648463 11.6009718,2.73255844 C10.4346536,1.61871892 8.88321726,0.998313379 7.27007186,1.00000344 L7.26998519,1.00030679 Z M1.86827736,7.26871463 C1.86658513,5.46760367 2.76375182,3.78414723 4.25928602,2.78029194 C5.7548419,1.77647999 7.65241657,1.58350923 9.3190807,2.26737887 C10.9864599,2.95124852 12.2028083,4.42058672 12.5624888,6.18529628 C12.9230577,7.95000584 12.3796693,9.77820118 11.1134747,11.0604839 L11.0855432,11.0841838 L11.0618433,11.1121153 C10.0453341,12.1159273 8.67256799,12.6762489 7.24467972,12.6694669 C5.81596808,12.663543 4.44827213,12.092223 3.44095004,11.0791157 C2.43291292,10.0668318 1.86752117,8.6965574 1.8683662,7.26866913 L1.86827736,7.26871463 Z"
                                  id="Page-1"></path>
                              </g>
                            </g>
                          </g>
                        </svg>
                      </span>
                      <div className="ui input ">
                        <input type="text" placeholder={Resources["search"][currentLanguage]} onChange={e => this.setState({ subjectText: e.target.value })}
                          onKeyUp={e => e.keyCode === 13 ? this.searchClick() : null} />
                      </div>
                    </div>
                  </a>
                </li>
                <li>
                  <a data-modal="modal1" className="notfiUI" onClick={this.ReportCenterMenu}>
                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24">
                      <g fill="none" fillRule="evenodd" transform="translate(3 3)">
                        <g fill="#A8B0BF">
                          <path id="a" d="M16.511 11.777c.55.232.715.9.5 1.321A8.999 8.999 0 1 1 4.523 1.189c.424-.243 1.108-.132 1.46.475.35.607-.128 1.248-.506 1.475a6.836 6.836 0 1 0 9.528 9.124c.372-.685.956-.72 1.506-.486zM18 9c0 .598-.484 1.082-1.082 1.082H9A1.082 1.082 0 0 1 7.918 9V1.082C7.918.484 8.402 0 9 0a8.997 8.997 0 0 1 9 9zm-4.1-4.89A7.304 7.304 0 0 0 9.89 2.06V8.12h6.058A7.305 7.305 0 0 0 13.9 4.11z" />
                        </g>
                      </g>
                    </svg>
                  </a>
                </li>
                <li>
                  <NavLink to="/TemplatesSettings" onClick={this.handleChangeTemplate}>
                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24">
                      <g fill="none" fillRule="evenodd" transform="translate(3 3)">
                        <g fill="#A8B0BF">
                          <path id="a" d="M3.602 13.71c.604-.333 1.455-.323 2.05.024l1.386.808c.595.346 1.03 1.084 1.048 1.776l.017.663 1.794-.002.017-.66c.017-.693.452-1.43 1.048-1.778l1.386-.807c.595-.346 1.447-.357 2.047-.026l.578.317.897-1.568-.56-.346c-.586-.362-1.001-1.11-1.001-1.802l-.002-1.616c0-.691.416-1.441 1.002-1.803l.56-.346-.896-1.568-.575.315c-.604.332-1.455.322-2.05-.025l-1.386-.808c-.595-.346-1.03-1.084-1.048-1.776l-.017-.663-1.794.002-.017.66c-.017.693-.452 1.43-1.048 1.778l-1.386.807c-.595.346-1.447.357-2.047.026l-.578-.317-.897 1.568.56.346c.586.362 1.001 1.11 1.001 1.802l.002 1.616c0 .691-.416 1.441-1.002 1.803l-.56.346.896 1.568.575-.315zm-2.13 1.634L.22 13.154a1.66 1.66 0 0 1 .558-2.23l.868-.535a.27.27 0 0 1 .045-.082L1.69 8.692a.313.313 0 0 1-.045-.082l-.869-.536a1.658 1.658 0 0 1-.558-2.23l1.253-2.189a1.63 1.63 0 0 1 2.193-.627l.897.491c-.01-.006.1-.007.09-.002l1.386-.806a.317.317 0 0 1 .048-.08l.026-1.03C6.137.713 6.863.003 7.746.003L10.253 0c.881 0 1.61.71 1.635 1.602l.026 1.028c0-.01.056.084.048.08l1.386.808a.327.327 0 0 1 .093 0l.896-.49a1.628 1.628 0 0 1 2.191.628l1.251 2.19a1.66 1.66 0 0 1-.558 2.23l-.868.535a.27.27 0 0 1-.045.082l.001 1.615c0-.01.054.087.045.082l.869.536c.753.465 1 1.458.558 2.23l-1.253 2.189a1.63 1.63 0 0 1-2.193.627l-.897-.491c.01.006-.1.007-.09.002l-1.386.806a.317.317 0 0 1-.048.08l-.026 1.03c-.025.889-.751 1.599-1.634 1.599L7.747 19c-.881 0-1.61-.71-1.635-1.602l-.026-1.028a.287.287 0 0 1-.048-.08l-1.386-.808a.327.327 0 0 1-.093 0l-.896.49a1.628 1.628 0 0 1-2.191-.628zm4.334-7.72a3.676 3.676 0 0 1 5.046-1.364c1.767 1.03 2.373 3.31 1.352 5.092a3.676 3.676 0 0 1-5.046 1.363c-1.767-1.029-2.373-3.309-1.352-5.09zm2.352 3.354c.81.474 1.847.193 2.315-.627.468-.82.19-1.868-.62-2.341a1.684 1.684 0 0 0-2.315.627c-.469.82-.19 1.868.62 2.341z" />
                        </g>
                      </g>
                    </svg>
                  </NavLink>
                </li>
                <li ref={node => { this.node = node }} className="notifi-icon">
                  <a id="notiClicked" onClick={this.viewNotifications.bind(this)}>
                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24">
                      <g fill="none" fillRule="evenodd" transform="translate(4 2)">
                        <g fill="#A8B0BF" mask="url(#b)">
                          <path id="a" d="M13.714 9V7c0-2.414-1.968-4.435-4.572-4.898V0H6.858v2.102C4.252 2.565 2.285 4.586 2.285 7v2c0 5.133-.57 6-2.285 6v2h16v-2c-1.714 0-2.286-.866-2.286-6zm-9.979 6c.836-1.581.836-3.872.836-6V7c0-1.653 1.538-3 3.428-3s3.43 1.347 3.43 3v2c0 2.128 0 4.419.835 6H3.735zm1.98 3h4.571v2H5.714v-2z" />
                        </g>
                      </g>
                    </svg>
                    <div className="inboxNotif smallSquare">{totalNotification}</div>
                  </a>
                  {this.state.viewNotification ? (
                    <div id="notiClosed" className="notifiBar">
                      <div className="smallNotifiBar">
                        <div className="notifi__tabs">
                          <Tabs selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.onClickTabItem(tabIndex)}>
                            <TabList className="zero">
                              <Tab className={this.state.tabNotifi ? "active" : ""}>
                                <span className="imgWrapper not__icon">
                                  <span className="activeImg" >
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlnslink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24" style={{ transform: 'rotate(0deg)', marginTop: '5px' }}>
                                      <g fill="none" fill-rule="evenodd" transform="translate(4 2)">
                                        <g fill="#A8B0BF" mask="url(#b)">
                                          <path id="a" d="M13.714 9V7c0-2.414-1.968-4.435-4.572-4.898V0H6.858v2.102C4.252 2.565 2.285 4.586 2.285 7v2c0 5.133-.57 6-2.285 6v2h16v-2c-1.714 0-2.286-.866-2.286-6zm-9.979 6c.836-1.581.836-3.872.836-6V7c0-1.653 1.538-3 3.428-3s3.43 1.347 3.43 3v2c0 2.128 0 4.419.835 6H3.735zm1.98 3h4.571v2H5.714v-2z" />
                                        </g>
                                      </g>
                                    </svg>
                                  </span>
                                  {/* <img className="normalImg" src={notifIcon} /> */}
                                </span>
                                <span className="tabNAme">
                                  {Resources["general"][currentLanguage]}
                                </span>
                              </Tab>
                              <Tab className={this.state.tabTask ? "active" : ""}>
                                <span className="imgWrapper base__icon">
                                  <svg xmlns="http://www.w3.org/2000/svg" xmlnslink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24" style={{ transform: 'rotate(0deg)'}}>
                                    <g fill="none" fill-rule="evenodd" transform="translate(4 4)">
                                      <g fill="#A8B0BF" mask="url(#b)">
                                        <path id="a" d="M13.76 1.133h.935c.611 0 1.198.253 1.63.704.432.45.675 1.063.675 1.7v11.059C17 15.923 15.968 17 14.695 17H2.305C1.032 17 0 15.923 0 14.596V3.537C0 2.21 1.032 1.133 2.305 1.133h.882v1.834c-.865.052-1.227.408-1.227 1.391v9.45c0 1.022.493 1.362 1.472 1.362h10.194c.979 0 1.404-.34 1.404-1.362v-9.45c0-.986-.338-1.364-1.27-1.396V1.133zm-4.197 0V2.96H7.383V1.133h2.178zm2.426 4.46l1.362 1.452-5.32 5.676-3.32-3.54L6.073 7.73 8.03 9.813l3.96-4.22zM4.25.852C4.244.455 4.567 0 5.287 0s1.035.458 1.035.852v2.945c0 .48-.463.736-1.048.736s-1.03-.335-1.024-.736c.02-1.311.02-1.683 0-2.945zm6.375 0C10.62.455 10.942 0 11.662 0s1.035.458 1.035.852v2.945c0 .48-.463.736-1.048.736s-1.03-.335-1.024-.736c.02-1.311.02-1.683 0-2.945z" />
                                      </g>
                                    </g>
                                  </svg>
                                  {/* <img className="activeImg" src={baseActive} />
                                  <img className="normalImg" src={greyBase} /> */}
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
                        <path fill="#5E6475" fillRule="evenodd" d="M11.319 6c.886 0 .8.687.346 1.235-.587.705-2.28 2.757-2.728 3.224-.69.721-1.004.722-1.696 0L4.303 7.235C3.866 6.719 3.848 6 4.606 6h6.713z"
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
                        <div className="item" onClick={event => this.setState({ clearSettings: true })} >
                          <div className="item-content">
                            {Resources["clearSettings"][currentLanguage]}
                          </div>
                        </div>
                        <div className="item" onClick={event => this.setState({ clearCach: true })}>
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
              clickHandlerContinue={() => this.logOutHandler()} title="You Will Be Missed, Are You Sure Want to Leave US?" buttonName='logout' />
          ) : null
        }
        {
          this.state.clearCach ? (
            <ConfirmationModal closed={event => this.setState({ clearCach: false })} showDeleteModal={this.state.clearCach} clickHandlerCancel={event => this.setState({ clearCach: false })}
              clickHandlerContinue={() => this.handleClearCach()} title={Resources["clearSetting"][currentLanguage]} buttonName='clearCach' />
          ) : null
        }
        {
          this.state.clearSettings ? (
            <ConfirmationModal closed={event => this.setState({ clearSettings: false })} showDeleteModal={this.state.clearSettings} clickHandlerCancel={event => this.setState({ clearSettings: false })}
              clickHandlerContinue={() => this.handleClearSettings()} title={Resources["clearSetting"][currentLanguage]} buttonName='clearSettings' />
          ) : null
        }
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
