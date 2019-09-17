import React from "react";
import { Route, Switch } from "react-router-dom";
import DashBoard from "./Pages/DashBoard";
import ActionBySummaryDetails from "./Componants/DashBoardDetails/ActionBySummaryDetails";
import AlertingQuantitySummaryDetails from "./Componants/DashBoardDetails/AlertingQuantitySummaryDetails";
import DocNotifyLogDetails from "./Componants/DashBoardDetails/DocNotifyLogDetails";
import ClosedSummaryDetails from "./Componants/DashBoardDetails/ClosedSummaryDetails";
import DistributionInboxListSummaryDetails from "./Componants/DashBoardDetails/DistributionInboxListSummaryDetails";
import NotCodedExpensesSummaryDetails from "./Componants/DashBoardDetails/NotCodedExpensesSummaryDetails";
import NotCodedInvoicesSummaryDetails from "./Componants/DashBoardDetails/NotCodedInvoicesSummaryDetails";
import NotCodedPaymentDetails from "./Componants/DashBoardDetails/NotCodedPaymentDetails";
import OpenedSummaryDetails from "./Componants/DashBoardDetails/OpenedSummaryDetails";
import SchedualActionByDetails from "./Componants/DashBoardDetails/SchedualActionByDetails";
import ScheduleAlertsSummaryDetails from "./Componants/DashBoardDetails/ScheduleAlertsSummaryDetails";
import TimeSheetDetails from "./Componants/DashBoardDetails/TimeSheetDetails";
import WorkFlowAlerts from "./Componants/DashBoardDetails/workFlowAlerts";
import DocApprovalDetails from "./Componants/DashBoardDetails/DocApprovalDetails";
import PendingExpensesDetails from "./Componants/DashBoardDetails/PendingExpensesDetails";
import CommonLog from "./Pages/Communication/CommonLog";
import PrivacySetting from '../src/Componants/User/PrivacySetting';
import ProfileSetting from "../src/Componants/User/index";
import TimeSheetWorkFlow from "../src/Componants/DashBoardDetails/TimeSheetWorkFlow";
import GetExpensesUserForEdit from "../src/Componants/User/GetExpensesUserForEdit";
import Companies from './Componants/GeneralSetting/Companies/Index';
import AddEditCompany from './Componants/GeneralSetting/Companies/AddEditCompany';
import Contacts from './Componants/GeneralSetting/Contacts/Index';
import MonthlyTasksDetails from "./Componants/DashBoardDetails/MonthlyTasksDetails";
import MonitorTasks from "./Componants/DashBoardDetails/MonitorTasks";
import AddTimeSheet from './Componants/TimeSheet/AddTimeSheet';
import AddOverTime from './Componants/TimeSheet/AddOverTime';
import AddLateTimeSheet from './Componants/TimeSheet/AddLateTimeSheet';
import OverTime from './Componants/TimeSheet/OverTime';
import Accounts from './Componants/GeneralSetting/Accounts/Accounts';
import AccountsCompaniesPermissions from './Componants/GeneralSetting/Accounts/AccountsCompaniesPermissions';
import AddAccount from './Componants/GeneralSetting/Accounts/AddAccount';
import EditAccount from './Componants/GeneralSetting/Accounts/EditAccount';
import UserProjects from './Componants/GeneralSetting/Accounts/UserProjects';
import TaskAdmin from './Componants/GeneralSetting/Accounts/TaskAdmin';
import AccountsEPSPermissions from './Componants/GeneralSetting/Accounts/AccountsEPSPermissions';
import TemplatesSettings from './Componants/GeneralSetting/TemplatesSettings';
import ReportsMenu from './Pages/ReportsCenter/ReportsMenu';
import LettersAddEdit from "./Pages/Communication/LettersAddEdit";
import emailAddEdit from "./Pages/Communication/emailAddEdit";
import corrRecievedSent from "./Pages/Communication/corrRecievedSent";
import FollowUpsSummaryDetails from "./Componants/DashBoardDetails/FollowUpsSummaryDetails";
import GeneralList from './Componants/GeneralSetting/MenuDefaultData/GeneralList';
import ExpensesWorkFlowLog from './Componants/GeneralSetting/Project/ExpensesWorkFlow/ExpensesWorkFlowLog';
import ExpensesWorkFlowAddEdit from './Componants/GeneralSetting/Project/ExpensesWorkFlow/ExpensesWorkFlowAddEdit';
import DashBoardCounterLog from './Componants/DashBoardDetails/DashBoardCounterLog';
import DashBoardProjectCounterLog from './Componants/DashBoardDetails/DashBoardProjectCounterLog';
import RfiAddEdit from "./Pages/Communication/RfiAddEdit";
import phoneAddEdit from './Pages/Communication/phoneAddEdit';
import ProjectSetupRoutes from './Pages/ProjectSetup/ProjectSetupRoutes';
import ProjectSetup from './Pages/ProjectSetup/ProjectSetup'
import reportsAddEdit from './Pages/Communication/reportsAddEdit';
//import OldAppNavigation from './OldAppNavigation';
import DashboardProject from './DashboardProject';
import TransmittalAddEdit from "../src/Pages/Communication/TransmittalAddEdit";
import meetingMinutesAddEdit from "../src/Pages/Communication/MeetingMinutesAddEdit";
import TaskGroupsAddEdit from './Pages/ProjectSetup/TaskGroupsAddEdit';
import InternalMemoAddEdit from "../src/Pages/Communication/InternalMemoAddEdit";
import ProjectTasks from "../src/Pages/TimeManagement/ProjectTasks";
import ActionByAlerts from './Pages/ProjectSetup/ActionByAlerts';
import meetingAgendaAddEdit from '../src/Pages/Communication/meetingAgendaAddEdit';
import inspectionRequestAddEdit from "./Pages/QualityControl/inspectionRequestAddEdit";
import materialInspectionRequestAddEdit from "./Pages/QualityControl/materialInspectionRequestAddEdit";
import ProjectTaskAddEdit from "./Pages/TimeManagement/ProjectTaskAddEdit";
import projectDistributionListAddEdit from './Pages/ProjectSetup/DistributionListAddEdit';
import NCRAddEdit from "./Pages/QualityControl/NCRAddEdit";
import clientSelectionAddEdit from "./Pages/TechnicalOffice/clientSelectionAddEdit";
import clientModificationAddEdit from "./Pages/TechnicalOffice/clientModificationAddEdit";
import SubmittalAddEdit from "./Pages/TechnicalOffice/SubmittalAddEdit";
import siteInstructionsAddEdit from "./Pages/TechnicalOffice/siteInstructionsAddEdit";
import punchListAddEdit from "./Pages/QualityControl/punchListAddEdit";
import boqAddEdit from "./Pages/Contracts/boqAddEdit";
import SubContract from "./Pages/Contracts/SubContract";
import SubContractLog from "./Pages/Contracts/SubContractLog";
import ContractsConditions from "./Pages/Contracts/ContractsConditions";
import variationOrderAddEdit from "./Pages/Contracts/variationOrderAddEdit";
import addEditModificationDrawing from "./Pages/Design/addEditModificationDrawing";
import projectWorkFlowAddEdit from './Pages/ProjectSetup/projectWorkFlowAddEdit';
import AccountsAlerts from './Pages/ProjectSetup/AccountsAlerts';
import projectPicturesAddEdit from "./Pages/TechnicalOffice/projectPicturesAddEdit";
import GeneralConfiguration from './Componants/GeneralSetting/Project/GeneralConfiguration';
import permissionsGroups from './Componants/GeneralSetting/Administrations/GroupsPermission/permissionsGroups';
import PermissionsGroupsPermissions from './Componants/GeneralSetting/Administrations/GroupsPermission/PermissionsGroupsPermissions';
import AccountsGroup from './Componants/GeneralSetting/Administrations/GroupsPermission/AccountsGroup';
import RequestPaymentsAddEdit from "./Pages/Contracts/requestPaymentsAddEdit";
import projectEstimateAddEdit from "./Pages/ProjectEstimation/projectEstimateAddEdit";
import projectPrimaveraScheduleAddEdit from "./Pages/TimeManagement/projectPrimaveraScheduleAddEdit";
import pcoAddEdit from "./Pages/Contracts/pcoAddEdit";
import drawingSetsAddEdit from "./Pages/Design/drawingSetsAddEdit";
import riskAddEdit from "./Pages/Contracts/riskAddEdit";
import variationRequestAddEdit from "./Pages/Contracts/variationRequestAddEdit";
import projectIssuesAddEdit from "./Pages/Contracts/projectIssuesAddEdit";
import qsAddEdit from "./Pages/Contracts/qsAddEdit";
import EpsPermission from "./Pages/Eps/EpsPermission";
import projectsAddEdit from "./Pages/Eps/Projects/projectsAddEdit";
import Projects from "./Pages/Eps/Projects/Index";
import baseAddEdit from "./Pages/estimation/baseAddEdit";
import costCodingTreeAddEdit from "./Pages/Contracts/costCodingTreeAddEdit";
import Itemize from "./Pages/Contracts/Itemize";
import drawingListAddEdit from "./Pages/Design/drawingListAddEdit";
import rptCostCodingTree from './Pages/CostControl/rptCostCodingTree';
import WFActivityReport from './Pages/ReportsCenter/OtherReports/WFActivityReport';
import boqStructure from "./Pages/ProjectSetup/boqStructure";
import TransmittalReport from './Pages/ReportsCenter/OtherReports/TransmittalReport';
import WFUsageReport from './Pages/ReportsCenter/OtherReports/WFUsageReport';
import FollowUpUsageReport from './Pages/ReportsCenter/OtherReports/FollowUpUsageReport';
import ClaimsAddEdit from "./Pages/Communication/ClaimsAddEdit";
import WFDistributionAccountReport from './Pages/ReportsCenter/OtherReports/WFDistributionAccountReport';
import PaymentReqStatusReport from './Pages/ReportsCenter/OtherReports/PaymentReqStatusReport';
import TechnicalOfficeReport from './Pages/ReportsCenter/TechnicalOffice/TechnicalOfficeReport';
import SubmittalsPerNeighBorhood from './Pages/ReportsCenter/TechnicalOffice/SubmittalsPerNeighBorhood';
import ProgressDocuments from './Pages/ReportsCenter/TechnicalOffice/ProgressDocuments';
import ProjectInvoices from './Pages/ReportsCenter/ContractsPOReports/ProjectInvoices';
import CollectedPaymentRequisition from './Pages/ReportsCenter/ContractsPOReports/CollectedPaymentRequisition';
import SiteRequestReleasedQnt from './Pages/ReportsCenter/ContractsPOReports/SiteRequestReleasedQnt';
import paymentRequisition from './Pages/ReportsCenter/ContractsPOReports/paymentRequisition';
import InvoicesLogReport from './Pages/ReportsCenter/ContractsPOReports/InvoicesLogReport';
import executiveSummary from './Pages/ReportsCenter/ContractsPOReports/executiveSummary';
import compareApprovedQuantity from './Pages/ReportsCenter/ContractsPOReports/compareApprovedQuantity';
import approvalDocument from './Pages/ReportsCenter/TechnicalOffice/approvalDocument';
import contractorsPerformance from './Pages/ReportsCenter/TechnicalOffice/ContractorsPerformance';
import ProjectsList from './Pages/ReportsCenter/ProjectReports/ProjectsList';
import CashFlowReport from './Pages/ReportsCenter/ProjectReports/CashFlowReport';
import ProjectBackLog from './Pages/ReportsCenter/ProjectReports/projectBackLog';
import ProjectsAchievements from './Pages/ReportsCenter/ProjectReports/projectsAchievements';
import projectInvoicesCollected from './Pages/ReportsCenter/ProjectReports/projectInvoicesCollected';
import ProjectBalanceReport from './Pages/ReportsCenter/ProjectReports/ProjectBalanceReport';
import projectScheduleAddEdit from './Pages/TimeManagement/projectScheduleAddEdit';
import budgetCashFlow from './Pages/CostControl/budgetCashFlow';
import LeftReportMenu from './Pages/Menu/LeftReportMenu';
import ActiveProjectsReport from './Pages/ReportsCenter/ProjectReports/ActiveProjectsReport';
import NewprojectList from './Pages/ReportsCenter/ProjectReports/NewprojectList';
import MaterialStatusReport from './Pages/ReportsCenter/ProjectReports/MaterialStatusReport';
import BoqTemplateReport from './Pages/ReportsCenter/ProjectReports/BoqTemplateReport';
import InventoryDetails from './Pages/ReportsCenter/ProjectReports/InventoryDetails';
import BoqStractureCost from './Pages/ReportsCenter/ProjectReports/BoqStractureCost';
import allocationOfProjectsOnCompanies from './Pages/ReportsCenter/ProjectReports/allocationOfProjectsOnCompanies';
import allocationOfUsersOnProjects from './Pages/ReportsCenter/ProjectReports/allocationOfUsersOnProjects';
import ProjectCompanies from "./Pages/Communication/ProjectCompanies";
import budgetVarianceReport from './Pages/ReportsCenter/ProjectReports/budgetVarianceReport';
import expensesDetailsOnProjectsReport from './Pages/ReportsCenter/ProjectReports/expensesDetailsOnProjectsReport';
import PostitNotificationsDetail from "./Pages/Menu/postitNotificationsDetail";
import taskDetails from "./Pages/Menu/taskDetails";
import myTasks from "./Pages/Menu/myTasks";
import contractInfoAddEdit from "./Pages/Contracts/contractInfoAddEdit";
import RejectedTimesheetsDetails from "./Componants/DashBoardDetails/RejectedTimesheetsDetails";
import invoicesForPoAddEdit from "./Pages/Procurement/invoicesForPoAddEdit";
import requestProposalAddEdit from "./Pages/Procurement/requestProposalAddEdit";
import proposalAddEdit from "./Pages/Procurement/proposalAddEdit";
import PaymentRequisitionList from "./Pages/Contracts/Schedule";
import purchaseOrderAddEdit from "./Pages/Procurement/purchaseOrderAddEdit";
import siteRequestAddEdit from "./Pages/Procurement/materialRequestAddEdit";
import equipmentDeliveryAddEdit from "./Pages/Procurement/equipmentDeliveryAddEdit";
import materialDeliveryAddEdit from "./Pages/Procurement/materialDeliveryAddEdit";
// import PaymentRequisitionList from "./Pages/Contracts/Schedule";
import materialInventoryAddEdit from './Pages/Procurement/materialInventoryAddEdit';
import chart from './Componants/ChartsWidgets/BarChartComp';
import requestsTransferItems from "./Pages/Procurement/requestsTransferItems";
import TransferInventory from "./Pages/Procurement/TransferInventory";
import materialReturnedAddEdit from "./Pages/Procurement/materialReturnedAddEdit";
import autoDeskViewer from "./Componants/OptionsPanels/AutoDeskViewer";
import materialReleaseAddEdit from "./Pages/Procurement/materialReleaseAddEdit";
import procurementAddEdit from "./Pages/Procurement/procurementAddEdit";
import RiskConesquence from "./Componants/publicComponants/RiskConesquence";
import GlobalSearch from "./Componants/publicComponants/GlobalSearch";
import currencyExchangeRates from './Componants/GeneralSetting/Administrations/currencyExchangeRates';
import specSectionChild from './Componants/GeneralSetting/MenuDefaultData/specSectionChild';
import RiskRealisation from './Componants/publicComponants/RiskRealisation';
import WeeklyReportsAddEdit from "./Pages/TechnicalOffice/weeklyReportsAddEdit";
import dailyReportsAddEdit from "./Pages/TechnicalOffice/dailyReportsAddEdit";
import RiskCause from './Componants/OptionsPanels/RiskCause';
import budgetCashFlowReports from './Pages/CostControl/budgetCashFlowReport';

let setupRoutes = ProjectSetupRoutes.map((item, index) => {
    let path = item.moduleId === "ProjectSetup" ? "/" + item.route + "/:projectId" : "/:document/:projectId";
    let compoenet = item.moduleId === "ProjectSetup" ? ProjectSetup : CommonLog;
    return <Route key={index + 181} path={path} component={compoenet} />
})


let originalRoutes = [
    <Route key='r-1' exact path="/" component={DashBoard} />
    , <Route key='r-2' path="/LettersAddEdit" component={LettersAddEdit} />
    , <Route key='r-3' path="/ActionByAlerts" component={ActionByAlerts} />
    , <Route key='r-4' path="/inspectionRequestAddEdit" component={inspectionRequestAddEdit} />
    , <Route key='r-5' path="/materialInspectionRequestAddEdit" component={materialInspectionRequestAddEdit} />
    , <Route key='r-6' path="/ActionBySummaryDetails" component={ActionBySummaryDetails} />
    , <Route key='r-7' path="/AlertingQuantitySummaryDetails" component={AlertingQuantitySummaryDetails} />
    , <Route key='r-8' path="/DocNotifyLogDetails" component={DocNotifyLogDetails} />
    , <Route key='r-9' path="/ClosedSummaryDetails" component={ClosedSummaryDetails} />
    , <Route key='r-10' path="/DistributionInboxListSummaryDetails" component={DistributionInboxListSummaryDetails} />
    , <Route key='r-11' path="/NotCodedExpensesSummaryDetails" component={NotCodedExpensesSummaryDetails} />
    , <Route key='r-12' path="/NotCodedInvoicesSummaryDetails" component={NotCodedInvoicesSummaryDetails} />
    , <Route key='r-13' path="/NotCodedPaymentDetails" component={NotCodedPaymentDetails} />
    , <Route key='r-14' path="/OpenedSummaryDetails" component={OpenedSummaryDetails} />
    , <Route key='r-15' path="/SchedualActionByDetails" component={SchedualActionByDetails} />
    , <Route key='r-16' path="/ScheduleAlertsSummaryDetails" component={ScheduleAlertsSummaryDetails} />
    , <Route key='r-17' path="/TimeSheetDetails" component={TimeSheetDetails} />
    , <Route key='r-18' path="/WorkFlowAlerts" component={WorkFlowAlerts} />
    , <Route key='r-19' path="/DocApprovalDetails" component={DocApprovalDetails} />
    , <Route key='r-20' path="/PendingExpensesDetails" component={PendingExpensesDetails} />
    , <Route key='r-21' path="/PrivacySetting" component={PrivacySetting} />
    , <Route key='r-22' path="/Companies/" component={Companies} />
    , <Route key='r-23' path="/Contacts/:companyID" component={Contacts} />
    , <Route key='r-24' path="/AddEditCompany/:companyID" component={AddEditCompany} />
    , <Route key='r-25' path="/TimeSheetWorkFlow" component={TimeSheetWorkFlow} />
    , <Route key='r-26' path="/GetExpensesUserForEdit" component={GetExpensesUserForEdit} />
    , <Route key='r-27' path="/Contacts/:companyID" component={Contacts} />
    , <Route key='r-28' path="/AddEditCompany/:companyID" component={AddEditCompany} />
    , <Route key='r-29' path="/ProfileSetting" component={ProfileSetting} />
    , <Route key='r-30' path="/TimeSheetWorkFlow" component={TimeSheetWorkFlow} />
    , <Route key='r-31' path="/GetExpensesUserForEdit" component={GetExpensesUserForEdit} />
    , <Route key='r-32' path="/MonthlyTasksDetails" component={MonthlyTasksDetails} />
    , <Route key='r-33' path="/MonitorTasks" component={MonitorTasks} />
    , <Route key='r-34' path="/AddTimeSheet" component={AddTimeSheet} />
    , <Route key='r-35' path="/AddOverTime" component={AddOverTime} />
    , <Route key='r-36' path="/AddLateTimeSheet" component={AddLateTimeSheet} />
    , <Route key='r-37' path="/OverTime" component={OverTime} />
    , <Route key='r-38' path="/Accounts" component={Accounts} />
    , <Route key='r-39' path="/AccountsCompaniesPermissions" component={AccountsCompaniesPermissions} />
    , <Route key='r-40' path="/AccountsEPSPermissions" component={AccountsEPSPermissions} />
    , <Route key='r-41' path="/AddAccount" component={AddAccount} />
    , <Route key='r-42' path="/EditAccount" component={EditAccount} />
    , <Route key='r-43' path="/UserProjects" component={UserProjects} />
    , <Route key='r-44' path="/TaskAdmin" component={TaskAdmin} />
    , <Route key='r-45' path="/FollowUpsSummaryDetails" component={FollowUpsSummaryDetails} />
    , <Route key='r-46' path="/TemplatesSettings" component={TemplatesSettings} />
    , <Route key='r-47' path="/GeneralList" component={GeneralList} />
    , <Route key='r-48' path="/ExpensesWorkFlowLog" component={ExpensesWorkFlowLog} />
    , <Route key='r-49' path="/ExpensesWorkFlowAddEdit" component={ExpensesWorkFlowAddEdit} />
    , <Route key='r-50' path="/ReportsMenu" component={ReportsMenu} />
    , <Route key='r-51' path="/GeneralList" component={GeneralList} />
    , <Route key='r-52' path="/ExpensesWorkFlowLog" component={ExpensesWorkFlowLog} />
    , <Route key='r-53' path="/ExpensesWorkFlowAddEdit" component={ExpensesWorkFlowAddEdit} />
    , <Route key='r-54' path="/DashBoardCounterLog" component={DashBoardCounterLog} />
    , <Route key='r-55' path="/RfiAddEdit" component={RfiAddEdit} />
    , <Route key='r-56' path="/DashBoardProjectCounterLog" component={DashBoardProjectCounterLog} />
    , <Route key='r-57' path="/phoneAddEdit" component={phoneAddEdit} />
    , <Route key='r-58' path="/reportsAddEdit" component={reportsAddEdit} />
    , <Route key='r-59' path="/TransmittalAddEdit" component={TransmittalAddEdit} />
    , <Route key='r-60' path="/DashboardProject" component={DashboardProject} />
    , <Route key='r-61' path="/TaskgroupAddEdit" component={TaskGroupsAddEdit} />
    , <Route key='r-62' path="/InternalMemoAddEdit" component={InternalMemoAddEdit} />
    , <Route key='r-63' path="/meetingMinutesAddEdit" component={meetingMinutesAddEdit} />
    , <Route key='r-64' path="/InternalMemoAddEdit" component={InternalMemoAddEdit} />
    , <Route key='r-65' path="/ProjectTasks/:projectId" component={ProjectTasks} />
    , <Route key='r-66' path="/ProjectTaskAddEdit" component={ProjectTaskAddEdit} />
    , <Route key='r-67' path="/meetingAgendaAddEdit" component={meetingAgendaAddEdit} />
    , <Route key='r-68' path="/projectDistributionListAddEdit" component={projectDistributionListAddEdit} />
    , <Route key='r-69' path="/NCRAddEdit" component={NCRAddEdit} />
    , <Route key='r-70' path="/clientSelectionAddEdit" component={clientSelectionAddEdit} />
    , <Route key='r-71' path="/clientModificationAddEdit" component={clientModificationAddEdit} />
    , <Route key='r-72' path="/SubmittalAddEdit" component={SubmittalAddEdit} />
    , <Route key='r-73' path="/siteInstructionsAddEdit" component={siteInstructionsAddEdit} />
    , <Route key='r-74' path="/punchListAddEdit" component={punchListAddEdit} />
    , <Route key='r-75' path="/boqAddEdit" component={boqAddEdit} />
    , <Route key='r-76' path="/SubContract" component={SubContract} />
    , <Route key='r-78' path="/ContractsConditions" component={ContractsConditions} />
    , <Route key='r-79' path="/changeOrderAddEdit" component={variationOrderAddEdit} />
    , <Route key='r-80' path="/addEditModificationDrawing" component={addEditModificationDrawing} />
    , <Route key='r-81' path="/addEditDrawing" component={addEditModificationDrawing} />
    , <Route key='r-82' path="/AccountsAlerts" component={AccountsAlerts} />
    , <Route key='r-83' path="/projectPicturesAddEdit" component={projectPicturesAddEdit} />
    , <Route key='r-84' path="/GeneralConfiguration" component={GeneralConfiguration} />
    , <Route key='r-85' path="/EpsPermission" component={EpsPermission} />
    , <Route key='r-86' path="/projectWorkFlowAddEdit" component={projectWorkFlowAddEdit} />
    , <Route key='r-87' path="/Projects" component={Projects} />
    , <Route key='r-88' path="/projectEstimateAddEdit" component={projectEstimateAddEdit} />
    , <Route key='r-89' path="/EpsPermission" component={EpsPermission} />
    , <Route key='r-90' path="/pcoAddEdit" component={pcoAddEdit} />
    , <Route key='r-91' path="/drawingSetsAddEdit" component={drawingSetsAddEdit} />
    , <Route key='r-92' path="/riskAddEdit" component={riskAddEdit} />
    , <Route key='r-93' path="/variationRequestAddEdit" component={variationRequestAddEdit} />
    , <Route key='r-94' path="/projectIssuesAddEdit" component={projectIssuesAddEdit} />
    , <Route key='r-95' path="/qsAddEdit" component={qsAddEdit} />
    , <Route key='r-96' path="/requestPaymentsAddEdit" component={RequestPaymentsAddEdit} />
    , <Route key='r-97' path="/projectsAddEdit" component={projectsAddEdit} />
    , <Route key='r-98' path="/baseAddEdit" component={baseAddEdit} />
    , <Route key='r-99' path="/costCodingTreeAddEdit/:projectId" component={costCodingTreeAddEdit} />
    , <Route key='r-100' path="/Itemize" component={Itemize} />
    , <Route key='r-101' path="/drawingListAddEdit" component={drawingListAddEdit} />
    , <Route key='r-102' path="/rptCostCodingTree/:projectId" component={rptCostCodingTree} />
    , <Route key='r-103' path="/projectScheduleAddEdit" component={projectScheduleAddEdit} />
    , <Route key='r-104' path="/WFActivityReport" component={WFActivityReport} />
    , <Route key='r-105' path="/boqStructure" component={boqStructure} />
    , <Route key='r-106' path="/projectPrimaveraScheduleAddEdit" component={projectPrimaveraScheduleAddEdit} />
    , <Route key='r-107' path="/ClaimsAddEdit" component={ClaimsAddEdit} />
    , <Route key='r-108' path="/WFUsageReport" component={WFUsageReport} />
    , <Route key='r-109' path="/TransmittalReport" component={TransmittalReport} />
    , <Route key='r-110' path="/FollowUpUsageReport" component={FollowUpUsageReport} />
    , <Route key='r-111' path="/WFDistributionAccountReport" component={WFDistributionAccountReport} />
    , <Route key='r-112' path="/PaymentReqStatusReport" component={PaymentReqStatusReport} />
    , <Route key='r-113' path="/TechnicalOfficeReport" component={TechnicalOfficeReport} />
    , <Route key='r-114' path="/SubmittalsPerNeighBorhood" component={SubmittalsPerNeighBorhood} />
    , <Route key='r-115' path="/ProgressDocuments" component={ProgressDocuments} />
    , <Route key='r-116' path="/ProjectInvoices" component={ProjectInvoices} />
    , <Route key='r-117' path="/CollectedPaymentRequisition" component={CollectedPaymentRequisition} />
    , <Route key='r-118' path="/SiteRequestReleasedQnt" component={SiteRequestReleasedQnt} />
    , <Route key='r-119' path="/InvoicesLogReport" component={InvoicesLogReport} />
    , <Route key='r-120' path="/ProjectsList" component={ProjectsList} />
    , <Route key='r-121' path="/CashFlowReport" component={CashFlowReport} />
    , <Route key='r-122' path="/ProjectBalanceReport" component={ProjectBalanceReport} />
    , <Route key='r-123' path="/ActiveProjectsReport" component={ActiveProjectsReport} />
    , <Route key='r-124' path="/NewprojectList" component={NewprojectList} />
    , <Route key='r-125' path="/MaterialStatusReport" component={MaterialStatusReport} />
    , <Route key='r-126' path="/BoqTemplateReport" component={BoqTemplateReport} />
    , <Route key='r-127' path="/BoqStractureCost" component={BoqStractureCost} />
    , <Route key='r-128' path="/InventoryDetails" component={InventoryDetails} />
    , <Route key='r-129' path="/allocationOfProjectsOnCompanies" component={allocationOfProjectsOnCompanies} />
    , <Route key='r-130' path="/allocationOfUsersOnProjects" component={allocationOfUsersOnProjects} />
    , <Route key='r-131' path="/ProjectCompanies" component={ProjectCompanies} />
    , <Route key='r-132' path="/permissionsGroups" component={permissionsGroups} />
    , <Route key='r-133' path="/AccountsGroup/:groupId" component={AccountsGroup} />
    , <Route key='r-134' path="/PermissionsGroupsPermissions/:groupId" component={PermissionsGroupsPermissions} />
    , <Route key='r-135' path="/AccountsGroup/:groupId" component={AccountsGroup} />
    , <Route key='r-136' path="/projectBackLog" component={ProjectBackLog} />
    , <Route key='r-137' path="/projectsAchievements" component={ProjectsAchievements} />
    , <Route key='r-138' path="/projectInvoicesCollected" component={projectInvoicesCollected} />
    , <Route key='r-139' path="/approvalDocument" component={approvalDocument} />
    , <Route key='r-140' path="/contractorsPerformance" component={contractorsPerformance} />
    , <Route key='r-141' path="/budgetCashFlow" component={budgetCashFlow} />
    , <Route key='r-142' path="/paymentRequisition" component={paymentRequisition} />
    , <Route key='r-143' path="/executiveSummary" component={executiveSummary} />
    , <Route key='r-144' path="/compareApprovedQuantity" component={compareApprovedQuantity} />
    , <Route key='r-145' path="/LeftReportMenu" component={LeftReportMenu} />
    , <Route key='r-146' path="/budgetVarianceReport" component={budgetVarianceReport} />
    , <Route key='r-147' path="/expensesDetailsOnProjectsReport" component={expensesDetailsOnProjectsReport} />
    , <Route key='r-148' path="/corrRecievedSent/:projectId" component={corrRecievedSent} />
    , <Route key='r-149' path="/postitNotificationsDetail" component={PostitNotificationsDetail} />
    , <Route key='r-150' path="/taskDetails" component={taskDetails} />
    , <Route key='r-151' path="/myTasks" component={myTasks} />
    , <Route key='r-152' path="/contractInfoAddEdit" component={contractInfoAddEdit} />
    , <Route key='r-153' path="/PaymentRequisitionList" component={PaymentRequisitionList} />
    , <Route key='r-154' path="/SubContractLog" component={SubContractLog} />
    , <Route key='r-155' path="/RejectedTimesheetsDetails" component={RejectedTimesheetsDetails} />
    , <Route key='r-156' path="/invoicesForPoAddEdit" component={invoicesForPoAddEdit} />
    , <Route key='r-157' path="/requestProposalAddEdit" component={requestProposalAddEdit} />
    , <Route key='r-158' path="/proposalAddEdit" component={proposalAddEdit} />
    , <Route key='r-159' path="/purchaseOrderAddEdit" component={purchaseOrderAddEdit} />
    , <Route key='r-160' path="/siteRequestAddEdit" component={siteRequestAddEdit} />
    , <Route key='r-161' path="/materialDeliveryAddEdit" component={materialDeliveryAddEdit} />
    , <Route key='r-162' path="/BarChartComp" component={chart} />
    , <Route key='r-163' path="/equipmentDeliveryAddEdit" component={equipmentDeliveryAddEdit} />
    , <Route key='r-164' path="/TransferInventory" component={TransferInventory} />
    , <Route key='r-165' path="/requestsTransferItems" component={requestsTransferItems} />
    , <Route key='r-166' path="/materialReturnedAddEdit" component={materialReturnedAddEdit} />
    , <Route key='r-167' path="/materialReleaseAddEdit" component={materialReleaseAddEdit} />
    , <Route key='r-168' path="/procurementAddEdit" component={procurementAddEdit} />
    , <Route key='r-169' path="/RiskCause" component={RiskCause} />
    , <Route key='r-171' path="/materialInventoryAddEdit" component={materialInventoryAddEdit} />
    , <Route key='r-172' path="/autoDeskViewer" component={autoDeskViewer} />
    , <Route key='r-173' path="/RiskConesquence" component={RiskConesquence} />
    , <Route key='r-174' path="/GlobalSearch" component={GlobalSearch} />
    , <Route key='r-175' path="/currencyExchangeRates" component={currencyExchangeRates} />
    , <Route key='r-176' path="/specSectionChild" component={specSectionChild} />
    , <Route key='r-177' path="/RiskRealisation" component={RiskRealisation} />
    , <Route key='r-177' path="/WeeklyReportsAddEdit" component={WeeklyReportsAddEdit} />
    , <Route key='r-179' path="/dailyReportsAddEdit" component={dailyReportsAddEdit} />
    , <Route key='r-180' path="/budgetCashFlowReports" component={budgetCashFlowReports} />
    , <Route key='r-181' path="/emailAddEdit" component={emailAddEdit} />
];

originalRoutes = [...originalRoutes, ...setupRoutes]

let routes = (

    <Switch>
        {originalRoutes.map((item, index) =>
            item
        )}
        <Route path="/:document/:projectId" component={CommonLog} />
    </Switch>
);
export default routes;
