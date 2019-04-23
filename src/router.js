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
import variationOrderAddEdit from "./Pages/Contracts/variationOrderAddEdit";
import addEditModificationDrawing from "./Pages/Design/addEditModificationDrawing";
import projectWorkFlowAddEdit from './Pages/ProjectSetup/projectWorkFlowAddEdit';
import AccountsAlerts from './Pages/ProjectSetup/AccountsAlerts';
import projectPicturesAddEdit from "./Pages/TechnicalOffice/projectPicturesAddEdit";
import GeneralConfiguration from './Componants/GeneralSetting/Project/GeneralConfiguration';
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



let setupRoutes = ProjectSetupRoutes.map((item) => {
    let path = item.moduleId === "ProjectSetup" ? "/" + item.route + "/:projectId" : "/:document/:projectId";
    let compoenet = item.moduleId === "ProjectSetup" ? ProjectSetup : CommonLog;
    return <Route path={path} component={compoenet} />
})


let originalRoutes = [
    <Route exact path="/" component={DashBoard} />
    , <Route path="/LettersAddEdit" component={LettersAddEdit} />
    , <Route path="/ActionByAlerts" component={ActionByAlerts} />
    , <Route path="/inspectionRequestAddEdit" component={inspectionRequestAddEdit} />
    , <Route path="/materialInspectionRequestAddEdit" component={materialInspectionRequestAddEdit} />
    , <Route path="/ActionBySummaryDetails" component={ActionBySummaryDetails} />
    , <Route path="/AlertingQuantitySummaryDetails" component={AlertingQuantitySummaryDetails} />
    , <Route path="/DocNotifyLogDetails" component={DocNotifyLogDetails} />
    , <Route path="/ClosedSummaryDetails" component={ClosedSummaryDetails} />
    , <Route path="/DistributionInboxListSummaryDetails" component={DistributionInboxListSummaryDetails} />
    , <Route path="/NotCodedExpensesSummaryDetails" component={NotCodedExpensesSummaryDetails} />
    , <Route path="/NotCodedInvoicesSummaryDetails" component={NotCodedInvoicesSummaryDetails} />
    , <Route path="/NotCodedPaymentDetails" component={NotCodedPaymentDetails} />
    , <Route path="/OpenedSummaryDetails" component={OpenedSummaryDetails} />
    , <Route path="/SchedualActionByDetails" component={SchedualActionByDetails} />
    , <Route path="/ScheduleAlertsSummaryDetails" component={ScheduleAlertsSummaryDetails} />
    , <Route path="/TimeSheetDetails" component={TimeSheetDetails} />
    , <Route path="/DocApprovalDetails" component={DocApprovalDetails} />
    , <Route path="/PendingExpensesDetails" component={PendingExpensesDetails} />
    , <Route path="/PrivacySetting" component={PrivacySetting} />
    , <Route path="/Companies/" component={Companies} />
    , <Route path="/Contacts/:companyID" component={Contacts} />
    , <Route path="/AddEditCompany/:companyID" component={AddEditCompany} />
    , <Route path="/TimeSheetWorkFlow" component={TimeSheetWorkFlow} />
    , <Route path="/GetExpensesUserForEdit" component={GetExpensesUserForEdit} />
    , <Route path="/Contacts/:companyID" component={Contacts} />
    , <Route path="/AddEditCompany/:companyID" component={AddEditCompany} />
    , <Route path="/ProfileSetting" component={ProfileSetting} />
    , <Route path="/TimeSheetWorkFlow" component={TimeSheetWorkFlow} />
    , <Route path="/GetExpensesUserForEdit" component={GetExpensesUserForEdit} />
    , <Route path="/MonthlyTasksDetails" component={MonthlyTasksDetails} />
    , <Route path="/MonitorTasks" component={MonitorTasks} />
    , <Route path="/AddTimeSheet" component={AddTimeSheet} />
    , <Route path="/AddOverTime" component={AddOverTime} />
    , <Route path="/AddLateTimeSheet" component={AddLateTimeSheet} />
    , <Route path="/OverTime" component={OverTime} />
    , <Route path="/Accounts" component={Accounts} />
    , <Route path="/AccountsCompaniesPermissions" component={AccountsCompaniesPermissions} />
    , <Route path="/AccountsEPSPermissions" component={AccountsEPSPermissions} />
    , <Route path="/AddAccount" component={AddAccount} />
    , <Route path="/EditAccount" component={EditAccount} />
    , <Route path="/UserProjects" component={UserProjects} />
    , <Route path="/TaskAdmin" component={TaskAdmin} />
    , <Route path="/FollowUpsSummaryDetails" component={FollowUpsSummaryDetails} />
    , <Route path="/TemplatesSettings" component={TemplatesSettings} />
    , <Route path="/GeneralList" component={GeneralList} />
    , <Route path="/ExpensesWorkFlowLog" component={ExpensesWorkFlowLog} />
    , <Route path="/ExpensesWorkFlowAddEdit" component={ExpensesWorkFlowAddEdit} />
    , <Route path="/ReportsMenu" component={ReportsMenu} />
    , <Route path="/GeneralList" component={GeneralList} />
    , <Route path="/ExpensesWorkFlowLog" component={ExpensesWorkFlowLog} />
    , <Route path="/ExpensesWorkFlowAddEdit" component={ExpensesWorkFlowAddEdit} />
    , <Route path="/DashBoardCounterLog" component={DashBoardCounterLog} />
    , <Route path="/RfiAddEdit" component={RfiAddEdit} />
    , <Route path="/DashBoardProjectCounterLog" component={DashBoardProjectCounterLog} />
    , <Route path="/phoneAddEdit" component={phoneAddEdit} />
    , <Route path="/reportsAddEdit" component={reportsAddEdit} />
    , <Route path="/TransmittalAddEdit" component={TransmittalAddEdit} />
    , <Route path="/DashboardProject" component={DashboardProject} />
    , <Route path="/TaskgroupAddEdit" component={TaskGroupsAddEdit} />
    , <Route path="/InternalMemoAddEdit" component={InternalMemoAddEdit} />
    , <Route path="/meetingMinutesAddEdit" component={meetingMinutesAddEdit} />
    , <Route path="/InternalMemoAddEdit" component={InternalMemoAddEdit} />
    , <Route path="/ProjectTasks/:projectId" component={ProjectTasks} />
    , <Route path="/ProjectTaskAddEdit" component={ProjectTaskAddEdit} />
    , <Route path="/meetingAgendaAddEdit" component={meetingAgendaAddEdit} />
    , <Route path="/projectDistributionListAddEdit" component={projectDistributionListAddEdit} />
    , <Route path="/NCRAddEdit" component={NCRAddEdit} />
    , <Route path="/clientSelectionAddEdit" component={clientSelectionAddEdit} />
    , <Route path="/clientModificationAddEdit" component={clientModificationAddEdit} />
    , <Route path="/SubmittalAddEdit" component={SubmittalAddEdit} />
    , <Route path="/siteInstructionsAddEdit" component={siteInstructionsAddEdit} />
    , <Route path="/punchListAddEdit" component={punchListAddEdit} />
    , <Route path="/boqAddEdit" component={boqAddEdit} />
    , <Route path="/changeOrderAddEdit" component={variationOrderAddEdit} />
    , <Route path="/addEditModificationDrawing" component={addEditModificationDrawing} />
    , <Route path="/addEditDrawing" component={addEditModificationDrawing} />
    , <Route path="/AccountsAlerts" component={AccountsAlerts} />
    , <Route path="/projectPicturesAddEdit" component={projectPicturesAddEdit} />
    , <Route path="/GeneralConfiguration" component={GeneralConfiguration} />
    , <Route path="/EpsPermission" component={EpsPermission} />
    , <Route path="/projectWorkFlowAddEdit" component={projectWorkFlowAddEdit} />
    , <Route path="/Projects" component={Projects} />
    , <Route path="/projectEstimateAddEdit" component={projectEstimateAddEdit} />
    , <Route path="/EpsPermission" component={EpsPermission} />
    , <Route path="/pcoAddEdit" component={pcoAddEdit} />
    , <Route path="/drawingSetsAddEdit" component={drawingSetsAddEdit} />
    , <Route path="/riskAddEdit" component={riskAddEdit} />
    , <Route path="/variationRequestAddEdit" component={variationRequestAddEdit} />
    , <Route path="/projectIssuesAddEdit" component={projectIssuesAddEdit} />
    , <Route path="/qsAddEdit" component={qsAddEdit} />
    , <Route path="/requestPaymentsAddEdit" component={RequestPaymentsAddEdit} />
    , <Route path="/projectsAddEdit" component={projectsAddEdit} />
    , <Route path="/baseAddEdit" component={baseAddEdit} />
    , <Route path="/costCodingTreeAddEdit/:projectId" component={costCodingTreeAddEdit} />
    , <Route path="/Itemize" component={Itemize} />
    , <Route path="/drawingListAddEdit" component={drawingListAddEdit} />
    , <Route path="/rptCostCodingTree" component={rptCostCodingTree} />
    , <Route path="/projectScheduleAddEdit" component={projectScheduleAddEdit} />
    , <Route path="/WFActivityReport" component={WFActivityReport} />
    , <Route path="/boqStructure" component={boqStructure} />
    , <Route path="/projectPrimaveraScheduleAddEdit" component={projectPrimaveraScheduleAddEdit} />
    , <Route path="/ClaimsAddEdit" component={ClaimsAddEdit} />
    , <Route path="/WFUsageReport" component={WFUsageReport} />
    , <Route path="/TransmittalReport" component={TransmittalReport} />
    , <Route path="/FollowUpUsageReport" component={FollowUpUsageReport} />
    , <Route path="/WFDistributionAccountReport" component={WFDistributionAccountReport} />
    , <Route path="/PaymentReqStatusReport" component={PaymentReqStatusReport} />
    , <Route path="/TechnicalOfficeReport" component={TechnicalOfficeReport} />
    , <Route path="/SubmittalsPerNeighBorhood" component={SubmittalsPerNeighBorhood} />
    , <Route path="/ProgressDocuments" component={ProgressDocuments} />
    , <Route path="/ProjectInvoices" component={ProjectInvoices} />
    , <Route path="/CollectedPaymentRequisition" component={CollectedPaymentRequisition} />
    , <Route path="/SiteRequestReleasedQnt" component={SiteRequestReleasedQnt} />
    , <Route path="/InvoicesLogReport" component={InvoicesLogReport} />
    , <Route path="/ProjectsList" component={ProjectsList} />
    , <Route path="/CashFlowReport" component={CashFlowReport} />
    , <Route path="/ProjectBalanceReport" component={ProjectBalanceReport} />
    , <Route path="/ActiveProjectsReport" component={ActiveProjectsReport} />
    , <Route path="/NewprojectList" component={NewprojectList} />
    , <Route path="/MaterialStatusReport" component={MaterialStatusReport} />
    , <Route path="/BoqTemplateReport" component={BoqTemplateReport} />
    , <Route path="/BoqStractureCost" component={BoqStractureCost} />
    , <Route path="/InventoryDetails" component={InventoryDetails} />
    




    , <Route path="/projectBackLog" component={ProjectBackLog} />
    , <Route path="/projectsAchievements" component={ProjectsAchievements} />
    , <Route path="/projectInvoicesCollected" component={projectInvoicesCollected} />
    , <Route path="/approvalDocument" component={approvalDocument} />
    , <Route path="/contractorsPerformance" component={contractorsPerformance} />
    , <Route path="/budgetCashFlow" component={budgetCashFlow} />
    , <Route path="/paymentRequisition" component={paymentRequisition} />
    , <Route path="/executiveSummary" component={executiveSummary} />
    , <Route path="/compareApprovedQuantity" component={compareApprovedQuantity} />
    , <Route path="/LeftReportMenu" component={LeftReportMenu} />

];
originalRoutes = [...originalRoutes, ...setupRoutes]
let routes = (

    <Switch >
        {originalRoutes.map((item) =>
            item
        )}
        <Route path="/:document/:projectId" component={CommonLog} />
    </Switch>
);
export default routes;
