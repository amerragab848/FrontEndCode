import React from 'react';
import { Route, Switch } from 'react-router-dom';

import ProjectSetupRoutes from './Pages/ProjectSetup/ProjectSetupRoutes';

import AsyncComponent from './Componants/AsyncComponent';

const DashBoard = AsyncComponent(() => import('./Pages/DashBoard'));

const DashboardProject = AsyncComponent(() => import('./DashboardProject'));

const Chart = AsyncComponent(() => import('./Componants/ChartsWidgets/BarChartComp'));

//Document Generator
// const DocGen = AsyncComponent(() =>
//     import('./Componants/Templates/DocumentGenerator'),
// );

//Communication

const CommonLog = AsyncComponent(() =>
    import('./Pages/Communication/CommonLog'),
);
const RfiAddEdit = AsyncComponent(() =>
    import('./Pages/Communication/RfiAddEdit'),
);
const PhoneAddEdit = AsyncComponent(() =>
    import('./Pages/Communication/phoneAddEdit'),
);
const ReportsAddEdit = AsyncComponent(() =>
    import('./Pages/Communication/reportsAddEdit'),
);
const TransmittalAddEdit = AsyncComponent(() =>
    import('../src/Pages/Communication/TransmittalAddEdit'),
);
const MeetingMinutesAddEdit = AsyncComponent(() =>
    import('../src/Pages/Communication/MeetingMinutesAddEdit'),
);
const InternalMemoAddEdit = AsyncComponent(() =>
    import('../src/Pages/Communication/InternalMemoAddEdit'),
);
const MeetingAgendaAddEdit = AsyncComponent(() =>
    import('../src/Pages/Communication/meetingAgendaAddEdit'),
);
const ClaimsAddEdit = AsyncComponent(() =>
    import('./Pages/Communication/ClaimsAddEdit'),
);
const ProjectCompanies = AsyncComponent(() =>
    import('./Pages/Communication/ProjectCompanies'),
);
const LettersAddEdit = AsyncComponent(() =>
    import('./Pages/Communication/LettersAddEdit'),
);
const TenderAnalysisAddEdit = AsyncComponent(() =>
    import('./Pages/estimation/tenderAnalysisAddEdit'),
);
const EmailAddEdit = AsyncComponent(() =>
    import('./Pages/Communication/emailAddEdit'),
);
const CorrRecievedSent = AsyncComponent(() =>
    import('./Pages/Communication/corrRecievedSent'),
);

//Report Center

const WFActivityReport = AsyncComponent(() =>
    import('./Pages/ReportsCenter/OtherReports/WFActivityReport'),
);
const DetailedFollowUpReport = AsyncComponent(() =>
    import('./Pages/ReportsCenter/OtherReports/DetailedFollowUpReport'),
);
const ReportsMenu = AsyncComponent(() =>
    import('./Pages/ReportsCenter/ReportsMenu'),
);
const TransmittalReport = AsyncComponent(() =>
    import('./Pages/ReportsCenter/OtherReports/TransmittalReport'),
);
const WFUsageReport = AsyncComponent(() =>
    import('./Pages/ReportsCenter/OtherReports/WFUsageReport'),
);
const FollowUpUsageReport = AsyncComponent(() =>
    import('./Pages/ReportsCenter/OtherReports/FollowUpUsageReport'),
);
const WFDistributionAccountReport = AsyncComponent(() =>
    import('./Pages/ReportsCenter/OtherReports/WFDistributionAccountReport'),
);
const PaymentReqStatusReport = AsyncComponent(() =>
    import('./Pages/ReportsCenter/OtherReports/PaymentReqStatusReport'),
);
const DocumentTpesReport = AsyncComponent(() =>
    import('./Pages/ReportsCenter/OtherReports/DocumentTpesReport'),
);
const DocumentAllTypesReport = AsyncComponent(() =>
    import('./Pages/ReportsCenter/OtherReports/DocumentAllTypesReport'),
);
const LoginHistoryReport = AsyncComponent(() =>
    import('./Pages/ReportsCenter/OtherReports/LoginHistoryReport'),
);
const TechnicalOfficeReport = AsyncComponent(() =>
    import('./Pages/ReportsCenter/TechnicalOffice/TechnicalOfficeReport'),
);
const SubmittalsPerNeighBorhood = AsyncComponent(() =>
    import('./Pages/ReportsCenter/TechnicalOffice/SubmittalsPerNeighBorhood'),
);
const ProgressDocuments = AsyncComponent(() =>
    import('./Pages/ReportsCenter/TechnicalOffice/ProgressDocuments'),
);
const ProjectInvoices = AsyncComponent(() =>
    import('./Pages/ReportsCenter/ContractsPOReports/ProjectInvoices'),
);
const CollectedPaymentRequisition = AsyncComponent(() =>
    import(
        './Pages/ReportsCenter/ContractsPOReports/CollectedPaymentRequisition'
    ),
);
const SiteRequestReleasedQnt = AsyncComponent(() =>
    import('./Pages/ReportsCenter/ContractsPOReports/SiteRequestReleasedQnt'),
);
const PaymentRequisition = AsyncComponent(() =>
    import('./Pages/ReportsCenter/ContractsPOReports/paymentRequisition'),
);
const InvoicesLogReport = AsyncComponent(() =>
    import('./Pages/ReportsCenter/ContractsPOReports/InvoicesLogReport'),
);
const ExecutiveSummary = AsyncComponent(() =>
    import('./Pages/ReportsCenter/ContractsPOReports/executiveSummary'),
);
const CompareApprovedQuantity = AsyncComponent(() =>
    import('./Pages/ReportsCenter/ContractsPOReports/compareApprovedQuantity'),
);
const ApprovalDocument = AsyncComponent(() =>
    import('./Pages/ReportsCenter/TechnicalOffice/approvalDocument'),
);
const ContractorsPerformance = AsyncComponent(() =>
    import('./Pages/ReportsCenter/TechnicalOffice/ContractorsPerformance'),
);
const ProjectsList = AsyncComponent(() =>
    import('./Pages/ReportsCenter/ProjectReports/ProjectsList'),
);
const CashFlowReport = AsyncComponent(() =>
    import('./Pages/ReportsCenter/ProjectReports/CashFlowReport'),
);
const ProjectDocumentStatus = AsyncComponent(() =>
    import('./Pages/ReportsCenter/ProjectReports/ProjectDocumentStatus'),
);
const ContractsStatus = AsyncComponent(() =>
    import('./Pages/ReportsCenter/ContractsPOReports/ContractsStatus'),
);
const ProjectBackLog = AsyncComponent(() =>
    import('./Pages/ReportsCenter/ProjectReports/projectBackLog'),
);
const reqPaymInvoicesRpt = AsyncComponent(() =>
    import('./Pages/ReportsCenter/ContractsPOReports/reqPaymInvoicesRpt'),
);
const ProjectsAchievements = AsyncComponent(() =>
    import('./Pages/ReportsCenter/ProjectReports/projectsAchievements'),
);
const ProjectInvoicesCollected = AsyncComponent(() =>
    import('./Pages/ReportsCenter/ProjectReports/projectInvoicesCollected'),
);
const ProjectBalanceReport = AsyncComponent(() =>
    import('./Pages/ReportsCenter/ProjectReports/ProjectBalanceReport'),
);
const ActiveProjectsReport = AsyncComponent(() =>
    import('./Pages/ReportsCenter/ProjectReports/ActiveProjectsReport'),
);
const NewprojectList = AsyncComponent(() =>
    import('./Pages/ReportsCenter/ProjectReports/NewprojectList'),
);
const MaterialStatusReport = AsyncComponent(() =>
    import('./Pages/ReportsCenter/ProjectReports/MaterialStatusReport'),
);
const BoqTemplateReport = AsyncComponent(() =>
    import('./Pages/ReportsCenter/ProjectReports/BoqTemplateReport'),
);
const InventoryDetails = AsyncComponent(() =>
    import('./Pages/ReportsCenter/ProjectReports/InventoryDetails'),
);
const DesignDrawinglistStatusReport = AsyncComponent(() =>
    import('./Pages/ReportsCenter/ProjectReports/DesignDrawinglistStatusReport'),
);
const BoqStractureCost = AsyncComponent(() =>
    import('./Pages/ReportsCenter/ProjectReports/BoqStractureCost'),
);
const AllocationOfProjectsOnCompanies = AsyncComponent(() =>
    import(
        './Pages/ReportsCenter/ProjectReports/allocationOfProjectsOnCompanies'
    ),
);
const AllocationOfUsersOnProjects = AsyncComponent(() =>
    import('./Pages/ReportsCenter/ProjectReports/allocationOfUsersOnProjects'),
);
const BudgetVarianceReport = AsyncComponent(() =>
    import('./Pages/ReportsCenter/ProjectReports/budgetVarianceReport'),
);
const ExpensesDetailsOnProjectsReport = AsyncComponent(() =>
    import('./Pages/ReportsCenter/ProjectReports/expensesDetailsOnProjectsReport'),
);
const ContractedQtyVSEarnedQtyReport = AsyncComponent(() =>
    import(
        './Pages/ReportsCenter/ProjectReports/ContractedQtyVSEarnedQty'
    ),
);
const RequestPaymentDeductionTypeReport = AsyncComponent(() =>
    import('./Pages/ReportsCenter/ContractsPOReports/RequestPaymentDeductionTypeReport'),
);

//Technical Office

const ClientSelectionAddEdit = AsyncComponent(() =>
    import('./Pages/TechnicalOffice/clientSelectionAddEdit'),
);
const ClientModificationAddEdit = AsyncComponent(() =>
    import('./Pages/TechnicalOffice/clientModificationAddEdit'),
);
const SubmittalAddEdit = AsyncComponent(() =>
    import('./Pages/TechnicalOffice/SubmittalAddEdit'),
);
const SiteInstructionsAddEdit = AsyncComponent(() =>
    import('./Pages/TechnicalOffice/siteInstructionsAddEdit'),
);
const ProjectPicturesAddEdit = AsyncComponent(() =>
    import('./Pages/TechnicalOffice/projectPicturesAddEdit'),
);
const DailyReportsAddEdit = AsyncComponent(() =>
    import('./Pages/TechnicalOffice/dailyReportsAddEdit'),
);

//Contracts

const BoqAddEdit = AsyncComponent(() => import('./Pages/Contracts/boqAddEdit'));

const SubContract = AsyncComponent(() =>
    import('./Pages/Contracts/SubContract'),
);
const SubContractLog = AsyncComponent(() =>
    import('./Pages/Contracts/SubContractLog'),
);
const ContractsConditions = AsyncComponent(() =>
    import('./Pages/Contracts/ContractsConditions'),
);
const VariationOrderAddEdit = AsyncComponent(() =>
    import('./Pages/Contracts/variationOrderAddEdit'),
);

const requestPaymentsAddEdit = AsyncComponent(() =>
    import('./Pages/Contracts/requestPaymentsAddEdit'),
);

const PcoAddEdit = AsyncComponent(() => import('./Pages/Contracts/pcoAddEdit'));
const RiskAddEdit = AsyncComponent(() =>
    import('./Pages/Contracts/riskAddEdit'),
);
const VariationRequestAddEdit = AsyncComponent(() =>
    import('./Pages/Contracts/variationRequestAddEdit'),
);
// const ContractROASummaryAddEdit = AsyncComponent(() =>
//     import('./Pages/Contracts/ContractROASummaryAddEdit'),
// );
const ProjectIssuesAddEdit = AsyncComponent(() =>
    import('./Pages/Contracts/projectIssuesAddEdit'),
);
const QuestionsAddEdit = AsyncComponent(() =>
    import('./Pages/Contracts/qsAddEdit'),
);
// aly salah proc requestForm 
const ProcurmentRequestFormAddEdit = AsyncComponent(() =>
    import('./Pages/Contracts/ProcurmentRequestFormAddEdit'),
);
//
const ProjectCostCodingTree = AsyncComponent(() =>
    import('./Componants/GeneralSetting/Project/ProjectCostCodingTree'),
);
const Itemize = AsyncComponent(() => import('./Pages/Contracts/Itemize'));
const ContractInfoAddEdit = AsyncComponent(() =>
    import('./Pages/Contracts/contractInfoAddEdit'),
);
const PaymentRequisitionList = AsyncComponent(() =>
    import('./Pages/Contracts/Schedule'),
);

const PaymentCertification = AsyncComponent(() =>
    import('./Pages/Contracts/PaymentCertificationAddEdit'),
);

//Dashboard Details

const ActionBySummaryDetails = AsyncComponent(() =>
    import('./Componants/DashBoardDetails/ActionBySummaryDetails'),
);
const usersAlertSummaryDetails = AsyncComponent(() =>
    import('./Componants/DashBoardDetails/usersAlertSummaryDetails'),
);
const AlertingQuantitySummaryDetails = AsyncComponent(() =>
    import('./Componants/DashBoardDetails/AlertingQuantitySummaryDetails'),
);
const DocNotifyLogDetails = AsyncComponent(() =>
    import('./Componants/DashBoardDetails/DocNotifyLogDetails'),
);
const ClosedSummaryDetails = AsyncComponent(() =>
    import('./Componants/DashBoardDetails/ClosedSummaryDetails'),
);
const DistributionInboxListSummaryDetails = AsyncComponent(() =>
    import('./Componants/DashBoardDetails/DistributionInboxListSummaryDetails'),
);
const NotCodedExpensesSummaryDetails = AsyncComponent(() =>
    import('./Componants/DashBoardDetails/NotCodedExpensesSummaryDetails'),
);
const NotCodedInvoicesSummaryDetails = AsyncComponent(() =>
    import('./Componants/DashBoardDetails/NotCodedInvoicesSummaryDetails'),
);
const NotCodedPaymentDetails = AsyncComponent(() =>
    import('./Componants/DashBoardDetails/NotCodedPaymentDetails'),
);
const OpenedSummaryDetails = AsyncComponent(() =>
    import('./Componants/DashBoardDetails/OpenedSummaryDetails'),
);
const SchedualActionByDetails = AsyncComponent(() =>
    import('./Componants/DashBoardDetails/SchedualActionByDetails'),
);
const ScheduleAlertsSummaryDetails = AsyncComponent(() =>
    import('./Componants/DashBoardDetails/ScheduleAlertsSummaryDetails'),
);
const TimeSheetDetails = AsyncComponent(() =>
    import('./Componants/DashBoardDetails/TimeSheetDetails'),
);
const WorkFlowAlerts = AsyncComponent(() =>
    import('./Componants/DashBoardDetails/workFlowAlerts'),
);
const SendToWFToday = AsyncComponent(() =>
    import('./Componants/DashBoardDetails/SendToWFToday'),
);
const DocApprovalDetails = AsyncComponent(() =>
    import('./Componants/DashBoardDetails/DocApprovalDetails'),
);
const PendingExpensesDetails = AsyncComponent(() =>
    import('./Componants/DashBoardDetails/PendingExpensesDetails'),
);
const TimeSheetWorkFlow = AsyncComponent(() =>
    import('../src/Componants/DashBoardDetails/TimeSheetWorkFlow'),
);
const MonthlyTasksDetails = AsyncComponent(() =>
    import('./Componants/DashBoardDetails/MonthlyTasksDetails'),
);
const MonitorTasks = AsyncComponent(() =>
    import('./Componants/DashBoardDetails/MonitorTasks'),
);
const FollowUpsSummaryDetails = AsyncComponent(() =>
    import('./Componants/DashBoardDetails/FollowUpsSummaryDetails'),
);
const levelDurationAlertDetails = AsyncComponent(() =>
    import('./Componants/DashBoardDetails/levelDurationAlertDetails'),
);
const DashBoardCounterLog = AsyncComponent(() =>
    import('./Componants/DashBoardDetails/DashBoardCounterLog'),
);
const DashBoardProjectCounterLog = AsyncComponent(() =>
    import('./Componants/DashBoardDetails/DashBoardProjectCounterLog'),
);
const RejectedTimesheetsDetails = AsyncComponent(() =>
    import('./Componants/DashBoardDetails/RejectedTimesheetsDetails'),
);
const LateTimeSheet = AsyncComponent(() =>
    import('./Pages/LateTimeSheet/LateTimeSheet'),
);

//General Settings

const Companies = AsyncComponent(() =>
    import('./Componants/GeneralSetting/Companies/Index'),
);

const AddEditCompany = AsyncComponent(() =>
    import('./Componants/GeneralSetting/Companies/AddEditCompany'),
);
const Contacts = AsyncComponent(() =>
    import('./Componants/GeneralSetting/Contacts/Index'),
);
const Accounts = AsyncComponent(() =>
    import('./Componants/GeneralSetting/Accounts/Accounts'),
);
const AccountsCompaniesPermissions = AsyncComponent(() =>
    import('./Componants/GeneralSetting/Accounts/AccountsCompaniesPermissions'),
);
const AddAccount = AsyncComponent(() =>
    import('./Componants/GeneralSetting/Accounts/AddAccount'),
);
const EditAccount = AsyncComponent(() =>
    import('./Componants/GeneralSetting/Accounts/EditAccount'),
);
const UserProjects = AsyncComponent(() =>
    import('./Componants/GeneralSetting/Accounts/UserProjects'),
);
const TaskAdmin = AsyncComponent(() =>
    import('./Componants/GeneralSetting/Accounts/TaskAdmin'),
);
const corrSentView = AsyncComponent(() =>
    import('./Pages/Communication/corrSentView'),
);
const corrReceiveView = AsyncComponent(() =>
    import('./Pages/Communication/corrReceiveView'),
);
const ContractROaAddEdit = AsyncComponent(() =>
    import('./Pages/Contracts/ContractROaAddEdit'),
);
const AccountsEPSPermissions = AsyncComponent(() =>
    import('./Componants/GeneralSetting/Accounts/AccountsEPSPermissions'),
);
const TemplatesSettings = AsyncComponent(() =>
    import('./Componants/GeneralSetting/TemplatesSettings'),
);
const GeneralList = AsyncComponent(() =>
    import('./Componants/GeneralSetting/MenuDefaultData/GeneralList'),
);
const DesignDiscipline = AsyncComponent(() =>
    import('./Componants/GeneralSetting/MenuDefaultData/DesignDiscipline'),
);
const ExpensesWorkFlowLog = AsyncComponent(() =>
    import(
        './Componants/GeneralSetting/Project/ExpensesWorkFlow/ExpensesWorkFlowLog'
    ),
);
const ExpensesWorkFlowAddEdit = AsyncComponent(() =>
    import(
        './Componants/GeneralSetting/Project/ExpensesWorkFlow/ExpensesWorkFlowAddEdit'
    ),
);
const GeneralConfiguration = AsyncComponent(() =>
    import('./Componants/GeneralSetting/Project/GeneralConfiguration'),
);
const PermissionsGroups = AsyncComponent(() =>
    import(
        './Componants/GeneralSetting/Administrations/GroupsPermission/permissionsGroups'
    ),
);
const PermissionsGroupsPermissions = AsyncComponent(() =>
    import(
        './Componants/GeneralSetting/Administrations/GroupsPermission/PermissionsGroupsPermissions'
    ),
);
const AccountsGroup = AsyncComponent(() =>
    import(
        './Componants/GeneralSetting/Administrations/GroupsPermission/AccountsGroup'
    ),
);
const CurrencyExchangeRates = AsyncComponent(() =>
    import('./Componants/GeneralSetting/Administrations/currencyExchangeRates'),
);
const SpecSectionChild = AsyncComponent(() =>
    import('./Componants/GeneralSetting/MenuDefaultData/specSectionChild'),
);

//Procurement

const InvoicesForPoAddEdit = AsyncComponent(() =>
    import('./Pages/Procurement/invoicesForPoAddEdit'),
);
const RequestProposalAddEdit = AsyncComponent(() =>
    import('./Pages/Procurement/requestProposalAddEdit'),
);
const ProposalAddEdit = AsyncComponent(() =>
    import('./Pages/Procurement/proposalAddEdit'),
);
const PurchaseOrderAddEdit = AsyncComponent(() =>
    import('./Pages/Procurement/purchaseOrderAddEdit'),
);
const SiteRequestAddEdit = AsyncComponent(() =>
    import('./Pages/Procurement/materialRequestAddEdit'),
);
const MaterialDeliveryAddEdit = AsyncComponent(() =>
    import('./Pages/Procurement/materialDeliveryAddEdit'),
);
const MaterialInventoryAddEdit = AsyncComponent(() =>
    import('./Pages/Procurement/materialInventoryAddEdit'),
);
const RequestsTransferItems = AsyncComponent(() =>
    import('./Pages/Procurement/requestsTransferItems'),
);
const TransferInventory = AsyncComponent(() =>
    import('./Pages/Procurement/TransferInventory'),
);
const MaterialReturnedAddEdit = AsyncComponent(() =>
    import('./Pages/Procurement/materialReturnedAddEdit'),
);
const MaterialReleaseAddEdit = AsyncComponent(() =>
    import('./Pages/Procurement/materialReleaseAddEdit'),
);

//Quality Control

const InspectionRequestAddEdit = AsyncComponent(() =>
    import('./Pages/QualityControl/inspectionRequestAddEdit'),
);
const MaterialInspectionRequestAddEdit = AsyncComponent(() =>
    import('./Pages/QualityControl/materialInspectionRequestAddEdit'),
);
const NCRAddEdit = AsyncComponent(() =>
    import('./Pages/QualityControl/NCRAddEdit'),
);
const PunchListAddEdit = AsyncComponent(() =>
    import('./Pages/QualityControl/punchListAddEdit'),
);

const QualityControlAddEdit = AsyncComponent(() =>
    import('./Pages/QualityControl/qualityControlAddEdit'),
);

//Cost Control

const RptCostCodingTree = AsyncComponent(() =>
    import('./Pages/CostControl/rptCostCodingTree'),
);
const BudgetCashFlow = AsyncComponent(() =>
    import('./Pages/CostControl/budgetCashFlow'),
);
const BudgetCashFlowReports = AsyncComponent(() =>
    import('./Pages/CostControl/budgetCashFlowReport'),
);

//Options Panels

const AutoDeskViewer = AsyncComponent(() =>
    import('./Componants/OptionsPanels/AutoDeskViewer'),
);
const ExportDetails = AsyncComponent(() =>
    import('./Componants/OptionsPanels/ExportDetails'),
);

//Project Setup

const TaskGroupsAddEdit = AsyncComponent(() =>
    import('./Pages/ProjectSetup/TaskGroupsAddEdit'),
);
const ProjectSetup = AsyncComponent(() =>
    import('./Pages/ProjectSetup/ProjectSetup'),
);
const ActionByAlerts = AsyncComponent(() =>
    import('./Pages/ProjectSetup/ActionByAlerts'),
);
const ProjectDistributionListAddEdit = AsyncComponent(() =>
    import('./Pages/ProjectSetup/DistributionListAddEdit'),
);
const ProjectWorkFlowAddEdit = AsyncComponent(() =>
    import('./Pages/ProjectSetup/projectWorkFlowAddEdit'),
);
const AccountsAlerts = AsyncComponent(() =>
    import('./Pages/ProjectSetup/AccountsAlerts'),
);
const UserAlerts = AsyncComponent(() =>
    import('./Pages/ProjectSetup/UserAlerts'),
);
const BoqStructure = AsyncComponent(() =>
    import('./Pages/ProjectSetup/boqStructure'),
);
const HeaderAndFooter = AsyncComponent(() =>
    import('./Pages/ProjectSetup/HeaderAndFooter'),
);
//Menu

const LeftReportMenu = AsyncComponent(() =>
    import('./Pages/Menu/LeftReportMenu'),
);

const ProcoorMeeting = AsyncComponent(() =>
    import('./Pages/Menu/ProcoorMeeting'),
);
const PostitNotificationsDetail = AsyncComponent(() =>
    import('./Pages/Menu/postitNotificationsDetail'),
);
const TaskDetails = AsyncComponent(() => import('./Pages/Menu/taskDetails'));
const MyTasks = AsyncComponent(() => import('./Pages/Menu/myTasks'));

//Public Components

const RiskConesquence = AsyncComponent(() =>
    import('./Componants/publicComponants/RiskConesquence'),
);
const GlobalSearch = AsyncComponent(() =>
    import('./Componants/publicComponants/GlobalSearch'),
);
const RiskRealisation = AsyncComponent(() =>
    import('./Componants/publicComponants/RiskRealisation'),
);

//Timesheet

const AddTimeSheet = AsyncComponent(() =>
    import('./Componants/TimeSheet/AddTimeSheet'),
);
const AddOverTime = AsyncComponent(() =>
    import('./Componants/TimeSheet/AddOverTime'),
);
const AddLateTimeSheet = AsyncComponent(() =>
    import('./Componants/TimeSheet/AddLateTimeSheet'),
);
const OverTime = AsyncComponent(() =>
    import('./Componants/TimeSheet/OverTime'),
);

// petty cash

const PettyCashAddEdit = AsyncComponent(() =>
    import('./Componants/PettyCash/PettyCashAddEdit'),
);

//Design

const AddEditModificationDrawing = AsyncComponent(() =>
    import('./Pages/Design/addEditModificationDrawing'),
);
const DrawingListAddEdit = AsyncComponent(() =>
    import('./Pages/Design/drawingListAddEdit'),
);
const DrawingSetsAddEdit = AsyncComponent(() =>
    import('./Pages/Design/drawingSetsAddEdit'),
);
//EPS

const EpsPermission = AsyncComponent(() => import('./Pages/Eps/EpsPermission'));
const ProjectsAddEdit = AsyncComponent(() =>
    import('./Pages/Eps/Projects/projectsAddEdit'),
);
const Projects = AsyncComponent(() => import('./Pages/Eps/Projects/Index'));

//Time Management

const ProjectTasks = AsyncComponent(() =>
    import('../src/Pages/TimeManagement/ProjectTasks'),
);
const ProjectTaskAddEdit = AsyncComponent(() =>
    import('./Pages/TimeManagement/ProjectTaskAddEdit'),
);
const ProjectPrimaveraScheduleAddEdit = AsyncComponent(() =>
    import('./Pages/TimeManagement/projectPrimaveraScheduleAddEdit'),
);
const ProjectScheduleAddEdit = AsyncComponent(() =>
    import('./Pages/TimeManagement/projectScheduleAddEdit'),
);

//Estimation

const ProjectEstimateAddEdit = AsyncComponent(() =>
    import('./Pages/ProjectEstimation/projectEstimateAddEdit'),
);
const BaseAddEdit = AsyncComponent(() =>
    import('./Pages/estimation/baseAddEdit'),
);

//User

const PrivacySetting = AsyncComponent(() =>
    import('../src/Componants/User/PrivacySetting'),
);
const IMAPConfiguration = AsyncComponent(() =>
    import('../src/Componants/User/IMAPConfigurationSettings'),
);
const IMAPEmails = AsyncComponent(() =>
    import('../src/Componants/User/IMAPEmail'),
);
const ProfileSetting = AsyncComponent(() =>
    import('../src/Componants/User/index'),
);
const ExpensesUserAddEdit = AsyncComponent(() =>
    import('../src/Componants/User/expensesUserAddEdit'),
);

//Report Center
// const DesignDrawinglistStatusReport=AsyncComponent(() =>
// import('../src/Pages/ReportsMenu/DesignDrawinglistStatusReport')
// );
const EstimationBoqComparison = AsyncComponent(() =>
    import('../src/Pages/ReportsMenu/estimationBoqComparison'),
);
const ContractsBoqQuantities = AsyncComponent(() =>
    import('../src/Pages/ReportsMenu/contractsBoqQuantities'),
);
const InvoiceQuantity = AsyncComponent(() =>
    import('../src/Pages/ReportsMenu/invoiceQuantity'),
);
const ProjectTimeSheet = AsyncComponent(() =>
    import('../src/Pages/ReportsMenu/projectTimeSheet'),
);
const BoqContractCost = AsyncComponent(() =>
    import('../src/Pages/ReportsMenu/boqContractCost'),
);
const DeliveredQuantitieReport = AsyncComponent(() =>
    import('../src/Pages/ReportsMenu/deliveredQuantitieReport'),
);
const CollectedInvoices = AsyncComponent(() =>
    import('../src/Pages/ReportsMenu/collectedInvoices'),
);
const SubmittalDrawingStatusListReport = AsyncComponent(() =>
    import('../src/Pages/ReportsCenter/TechnicalOffice/SubmittalDrawingStatusList'),
);

let setupRoutes = ProjectSetupRoutes.map((item, index) => {
    let path = item.moduleId === 'ProjectSetup' ? '/' + item.route + '/:projectId' : '/:document/:projectId';
    let compoenet = item.moduleId === 'ProjectSetup' ? ProjectSetup : CommonLog;
    return <Route key={index + 181} path={path} component={compoenet} />;
});

let originalRoutes = [
    <Route key="r-1" exact path="/" component={DashBoard} />,
    // <Route key="r-2" path="/LettersAddEdit/:docId/:projectId/:arrange/:docApprovalId/:isApproveMode/:projectName/:perviousRoute" component={LettersAddEdit} />,
    <Route key="r-2" path="/LettersAddEdit" component={LettersAddEdit} />,
    <Route
        key="r-2"
        path="/TenderAnalysisAddEdit"
        component={TenderAnalysisAddEdit}
    />,
    <Route key="r-3" path="/ActionByAlerts" component={ActionByAlerts} />,
    <Route
        key="r-4"
        path="/inspectionRequestAddEdit"
        component={InspectionRequestAddEdit}
    />,
    <Route
        key="r-5"
        path="/materialInspectionRequestAddEdit"
        component={MaterialInspectionRequestAddEdit}
    />,
    <Route
        key="r-6"
        path="/ActionBySummaryDetails"
        component={ActionBySummaryDetails}
    />,
    <Route
        key="r-7"
        path="/AlertingQuantitySummaryDetails"
        component={AlertingQuantitySummaryDetails}
    />,
    <Route
        key="r-8"
        path="/DocNotifyLogDetails"
        component={DocNotifyLogDetails}
    />,
    <Route
        key="r-9"
        path="/ClosedSummaryDetails"
        component={ClosedSummaryDetails}
    />,
    <Route
        key="r-10"
        path="/DistributionInboxListSummaryDetails"
        component={DistributionInboxListSummaryDetails}
    />,
    <Route
        key="r-11"
        path="/NotCodedExpensesSummaryDetails"
        component={NotCodedExpensesSummaryDetails}
    />,
    <Route
        key="r-12"
        path="/NotCodedInvoicesSummaryDetails"
        component={NotCodedInvoicesSummaryDetails}
    />,
    <Route
        key="r-13"
        path="/NotCodedPaymentDetails"
        component={NotCodedPaymentDetails}
    />,
    <Route
        key="r-14"
        path="/OpenedSummaryDetails"
        component={OpenedSummaryDetails}
    />,
    <Route
        key="r-15"
        path="/SchedualActionByDetails"
        component={SchedualActionByDetails}
    />,
    <Route
        key="r-16"
        path="/ScheduleAlertsSummaryDetails"
        component={ScheduleAlertsSummaryDetails}
    />,
    <Route key="r-17" path="/TimeSheetDetails" component={TimeSheetDetails} />,
    <Route key="r-18" path="/WorkFlowAlerts" component={WorkFlowAlerts} />,
    <Route
        key="r-19"
        path="/DocApprovalDetails"
        component={DocApprovalDetails}
    />,
    <Route
        key="r-20"
        path="/PendingExpensesDetails"
        component={PendingExpensesDetails}
    />,
    <Route key="r-21" path="/PrivacySetting" component={PrivacySetting} />,
    <Route key="r-21" path="/IMAPConfiguration" component={IMAPConfiguration} />,
    <Route key="r-21" path="/imapEmails/:status" component={IMAPEmails} />,
    <Route key="r-22" path="/Companies/" component={Companies} />,
    <Route
        key="r-24"
        path="/AddEditCompany/:companyID"
        component={AddEditCompany}
    />,
    <Route
        key="r-25"
        path="/TimeSheetWorkFlow"
        component={TimeSheetWorkFlow}
    />,
    <Route
        key="r-26"
        path="/expensesUserAddEdit"
        component={ExpensesUserAddEdit}
    />,
    <Route key="r-27" path="/Contacts/:companyID" component={Contacts} />,
    <Route
        key="r-28"
        path="/AddEditCompany/:companyID"
        component={AddEditCompany}
    />,
    <Route key="r-29" path="/ProfileSetting" component={ProfileSetting} />,
    <Route
        key="r-30"
        path="/TimeSheetWorkFlow"
        component={TimeSheetWorkFlow}
    />,
    <Route
        key="r-32"
        path="/MonthlyTasksDetails"
        component={MonthlyTasksDetails}
    />,
    <Route key="r-33" path="/MonitorTasks" component={MonitorTasks} />,
    <Route key="r-34" path="/AddTimeSheet" component={AddTimeSheet} />,
    <Route
        key="r-34"
        path="/PettyCashAddEdit/:id?/:projectId?"
        component={PettyCashAddEdit}
    />,
    <Route key="r-35" path="/AddOverTime" component={AddOverTime} />,
    <Route key="r-36" path="/AddLateTimeSheet" component={AddLateTimeSheet} />,
    <Route key="r-37" path="/OverTime" component={OverTime} />,
    <Route key="r-38" path="/Accounts" component={Accounts} />,
    <Route
        key="r-39"
        path="/AccountsCompaniesPermissions"
        component={AccountsCompaniesPermissions}
    />,
    <Route
        key="r-40"
        path="/AccountsEPSPermissions"
        component={AccountsEPSPermissions}
    />,
    <Route key="r-41" path="/AddAccount" component={AddAccount} />,
    <Route key="r-42" path="/EditAccount" component={EditAccount} />,
    <Route key="r-43" path="/UserProjects" component={UserProjects} />,
    <Route key="r-44" path="/TaskAdmin" component={TaskAdmin} />,
    <Route
        key="r-45"
        path="/FollowUpsSummaryDetails"
        component={FollowUpsSummaryDetails}
    />,
    <Route
        key="r-46"
        path="/TemplatesSettings"
        component={TemplatesSettings}
    />,
    <Route key="r-47" path="/GeneralList" component={GeneralList} />,
    <Route
        key="r-48"
        path="/ExpensesWorkFlowLog"
        component={ExpensesWorkFlowLog}
    />,
    <Route
        key="r-49"
        path="/ExpensesWorkFlowAddEdit"
        component={ExpensesWorkFlowAddEdit}
    />,
    <Route key="r-50" path="/ReportsMenu" component={ReportsMenu} />,
    <Route key="r-51" path="/GeneralList" component={GeneralList} />,
    <Route
        key="r-52"
        path="/ExpensesWorkFlowLog"
        component={ExpensesWorkFlowLog}
    />,
    <Route
        key="r-53"
        path="/ExpensesWorkFlowAddEdit"
        component={ExpensesWorkFlowAddEdit}
    />,
    <Route
        key="r-54"
        path="/DashBoardCounterLog"
        component={DashBoardCounterLog}
    />,
    <Route key="r-55" path="/RfiAddEdit" component={RfiAddEdit} />,
    <Route
        key="r-56"
        path="/DashBoardProjectCounterLog"
        component={DashBoardProjectCounterLog}
    />,
    <Route key="r-57" path="/phoneAddEdit" component={PhoneAddEdit} />,
    <Route key="r-58" path="/reportsAddEdit" component={ReportsAddEdit} />,
    <Route
        key="r-59"
        path="/TransmittalAddEdit"
        component={TransmittalAddEdit}
    />,
    <Route key="r-60" path="/DashboardProject" component={DashboardProject} />,
    <Route key="r-61" path="/TaskgroupAddEdit" component={TaskGroupsAddEdit} />,
    <Route
        key="r-62"
        path="/InternalMemoAddEdit"
        component={InternalMemoAddEdit}
    />,
    <Route
        key="r-63"
        path="/meetingMinutesAddEdit"
        component={MeetingMinutesAddEdit}
    />,
    <Route
        key="r-64"
        path="/InternalMemoAddEdit"
        component={InternalMemoAddEdit}
    />,
    <Route
        key="r-65"
        path="/ProjectTasks/:projectId"
        component={ProjectTasks}
    />,
    <Route
        key="r-66"
        path="/ProjectTaskAddEdit"
        component={ProjectTaskAddEdit}
    />,
    <Route
        key="r-67"
        path="/meetingAgendaAddEdit"
        component={MeetingAgendaAddEdit}
    />,
    <Route
        key="r-68"
        path="/projectDistributionListAddEdit"
        component={ProjectDistributionListAddEdit}
    />,
    <Route key="r-69" path="/NCRAddEdit" component={NCRAddEdit} />,
    <Route
        key="r-70"
        path="/clientSelectionAddEdit"
        component={ClientSelectionAddEdit}
    />,
    <Route
        key="r-71"
        path="/clientModificationAddEdit"
        component={ClientModificationAddEdit}
    />,
    <Route key="r-72" path="/SubmittalAddEdit" component={SubmittalAddEdit} />,
    <Route
        key="r-73"
        path="/siteInstructionsAddEdit"
        component={SiteInstructionsAddEdit}
    />,
    <Route key="r-74" path="/punchListAddEdit" component={PunchListAddEdit} />,
    <Route key="r-74" path="/qualityControlAddEdit" component={QualityControlAddEdit} />,
    <Route key="r-75" path="/boqAddEdit" component={BoqAddEdit} />,
    <Route key="r-76" path="/SubContract" component={SubContract} />,
    <Route
        key="r-78"
        path="/ContractsConditions"
        component={ContractsConditions}
    />,
    <Route
        key="r-79"
        path="/changeOrderAddEdit"
        component={VariationOrderAddEdit}
    />,
    <Route
        key="r-80"
        path="/addEditModificationDrawing"
        component={AddEditModificationDrawing}
    />,
    <Route
        key="r-81"
        path="/addEditDrawing"
        component={AddEditModificationDrawing}
    />,
    <Route key="r-82" path="/AccountsAlerts" component={AccountsAlerts} />,
    <Route
        key="r-82"
        path="/HeaderAndFooter/:id"
        component={HeaderAndFooter}
    />,
    <Route
        key="r-83"
        path="/projectPicturesAddEdit"
        component={ProjectPicturesAddEdit}
    />,
    <Route
        key="r-84"
        path="/GeneralConfiguration"
        component={GeneralConfiguration}
    />,
    <Route key="r-85" path="/EpsPermission" component={EpsPermission} />,
    <Route
        key="r-86"
        path="/projectWorkFlowAddEdit"
        component={ProjectWorkFlowAddEdit}
    />,
    <Route key="r-87" path="/Projects" component={Projects} />,
    <Route
        key="r-88"
        path="/projectEstimateAddEdit"
        component={ProjectEstimateAddEdit}
    />,
    <Route key="r-89" path="/EpsPermission" component={EpsPermission} />,
    <Route key="r-90" path="/pcoAddEdit" component={PcoAddEdit} />,

    <Route key="r-92" path="/riskAddEdit" component={RiskAddEdit} />,
    <Route
        key="r-93"
        path="/variationRequestAddEdit"
        component={VariationRequestAddEdit}
    />,
    <Route
        key="r-94"
        path="/projectIssuesAddEdit"
        component={ProjectIssuesAddEdit}
    />,
    <Route key="r-95" path="/qsAddEdit" component={QuestionsAddEdit} />,
    <Route key="r-200" path="/ProcurmentRequestFormAddEdit" component={ProcurmentRequestFormAddEdit} />,
    <Route
        key="r-96"
        path="/requestPaymentsAddEdit"
        component={requestPaymentsAddEdit}
    />,
    <Route key="r-97" path="/projectsAddEdit" component={ProjectsAddEdit} />,
    <Route key="r-98" path="/baseAddEdit" component={BaseAddEdit} />,
    <Route
        key="r-99"
        path="/projectCostCodingTree/:projectId"
        component={ProjectCostCodingTree}
    />,
    <Route key="r-100" path="/Itemize" component={Itemize} />,
    <Route
        key="r-101"
        path="/drawingListAddEdit"
        component={DrawingListAddEdit}
    />,
    <Route
        key="r-101"
        path="/DrawingSetsAddEdit"
        component={DrawingSetsAddEdit}
    />,
    <Route
        key="r-102"
        path="/rptCostCodingTree/:projectId"
        component={RptCostCodingTree}
    />,
    <Route
        key="r-103"
        path="/projectScheduleAddEdit"
        component={ProjectScheduleAddEdit}
    />,
    <Route key="r-104" path="/WFActivityReport" component={WFActivityReport} />,
    
    <Route key="r-105" path="/boqStructure" component={BoqStructure} />,
    <Route
        key="r-106"
        path="/projectPrimaveraScheduleAddEdit"
        component={ProjectPrimaveraScheduleAddEdit}
    />,
    <Route key="r-107" path="/ClaimsAddEdit" component={ClaimsAddEdit} />,
    <Route key="r-108" path="/WFUsageReport" component={WFUsageReport} />,
    <Route
        key="r-109"
        path="/TransmittalReport"
        component={TransmittalReport}
    />,
    <Route
        key="r-110"
        path="/FollowUpUsageReport"
        component={FollowUpUsageReport}
    />,
    <Route
        key="r-111"
        path="/WFDistributionAccountReport"
        component={WFDistributionAccountReport}
    />,
    <Route
        key="r-112"
        path="/PaymentReqStatusReport"
        component={PaymentReqStatusReport}
    />,
    <Route
        key="r-112"
        path="/DocumentTpesReport"
        component={DocumentTpesReport}
    />,
    <Route
        key="r-113"
        path="/TechnicalOfficeReport"
        component={TechnicalOfficeReport}
    />,
    <Route
        key="r-114"
        path="/SubmittalsPerNeighBorhood"
        component={SubmittalsPerNeighBorhood}
    />,
    <Route
        key="r-115"
        path="/ProgressDocuments"
        component={ProgressDocuments}
    />,
    <Route key="r-116" path="/ProjectInvoices" component={ProjectInvoices} />,
    <Route
        key="r-117"
        path="/CollectedPaymentRequisition"
        component={CollectedPaymentRequisition}
    />,
    <Route
        key="r-118"
        path="/SiteRequestReleasedQnt"
        component={SiteRequestReleasedQnt}
    />,
    <Route
        key="r-119"
        path="/InvoicesLogReport"
        component={InvoicesLogReport}
    />,
    <Route key="r-120" path="/ProjectsList" component={ProjectsList} />,
    <Route key="r-121" path="/CashFlowReport" component={CashFlowReport} />,
    <Route
        key="r-190"
        path="/ProjectDocumentStatus"
        component={ProjectDocumentStatus}
    />,
    <Route key="r-190" path="/ContractsStatus" component={ContractsStatus} />,
    <Route
        key="r-122"
        path="/ProjectBalanceReport"
        component={ProjectBalanceReport}
    />,
    <Route
        key="r-123"
        path="/ActiveProjectsReport"
        component={ActiveProjectsReport}
    />,
    <Route key="r-124" path="/NewprojectList" component={NewprojectList} />,
    <Route
        key="r-125"
        path="/MaterialStatusReport"
        component={MaterialStatusReport}
    />,
    <Route
        key="r-126"
        path="/BoqTemplateReport"
        component={BoqTemplateReport}
    />,
    <Route key="r-127" path="/BoqStractureCost" component={BoqStractureCost} />,
    <Route key="r-128" path="/InventoryDetails" component={InventoryDetails} />,
    <Route
        key="r-129"
        path="/allocationOfProjectsOnCompanies"
        component={AllocationOfProjectsOnCompanies}
    />,
    <Route
        key="r-130"
        path="/allocationOfUsersOnProjects"
        component={AllocationOfUsersOnProjects}
    />,
    <Route key="r-131" path="/ProjectCompanies" component={ProjectCompanies} />,
    <Route
        key="r-132"
        path="/permissionsGroups"
        component={PermissionsGroups}
    />,
    <Route
        key="r-133"
        path="/AccountsGroup/:groupId"
        component={AccountsGroup}
    />,
    <Route
        key="r-134"
        path="/PermissionsGroupsPermissions/:groupId"
        component={PermissionsGroupsPermissions}
    />,
    <Route
        key="r-135"
        path="/AccountsGroup/:groupId"
        component={AccountsGroup}
    />,
    <Route key="r-136" path="/projectBackLog" component={ProjectBackLog} />,
    <Route
        key="r-137"
        path="/projectsAchievements"
        component={ProjectsAchievements}
    />,
    <Route
        key="r-138"
        path="/projectInvoicesCollected"
        component={ProjectInvoicesCollected}
    />,
    <Route key="r-139" path="/approvalDocument" component={ApprovalDocument} />,
    <Route
        key="r-140"
        path="/contractorsPerformance"
        component={ContractorsPerformance}
    />,
    <Route key="r-141" path="/budgetCashFlow" component={BudgetCashFlow} />,
    <Route
        key="r-142"
        path="/paymentRequisition"
        component={PaymentRequisition}
    />,
    <Route key="r-143" path="/executiveSummary" component={ExecutiveSummary} />,
    <Route
        key="r-144"
        path="/compareApprovedQuantity"
        component={CompareApprovedQuantity}
    />,
    <Route key="r-145" path="/LeftReportMenu" component={LeftReportMenu} />,
    <Route key="r-245" path="/ProcoorMeeting" component={ProcoorMeeting} />,
    <Route
        key="r-146"
        path="/budgetVarianceReport"
        component={BudgetVarianceReport}
    />,
    <Route
        key="r-147"
        path="/expensesDetailsOnProjectsReport"
        component={ExpensesDetailsOnProjectsReport}
    />,
    <Route
        key="r-148"
        path="/corrRecievedSent/:projectId"
        component={CorrRecievedSent}
    />,
    <Route
        key="r-149"
        path="/postitNotificationsDetail"
        component={PostitNotificationsDetail}
    />,
    <Route key="r-150" path="/taskDetails" component={TaskDetails} />,
    <Route key="r-151" path="/myTasks" component={MyTasks} />,
    <Route
        key="r-152"
        path="/contractInfoAddEdit"
        component={ContractInfoAddEdit}
    />,
    <Route
        key="r-153"
        path="/PaymentRequisitionList"
        component={PaymentRequisitionList}
    />,
    <Route key="r-154" path="/SubContractLog" component={SubContractLog} />,
    <Route
        key="r-155"
        path="/RejectedTimesheetsDetails"
        component={RejectedTimesheetsDetails}
    />,
    <Route
        key="r-156"
        path="/invoicesForPoAddEdit"
        component={InvoicesForPoAddEdit}
    />,
    <Route
        key="r-157"
        path="/requestProposalAddEdit"
        component={RequestProposalAddEdit}
    />,
    <Route key="r-158" path="/proposalAddEdit" component={ProposalAddEdit} />,
    <Route
        key="r-159"
        path="/purchaseOrderAddEdit"
        component={PurchaseOrderAddEdit}
    />,
    <Route
        key="r-160"
        path="/siteRequestAddEdit"
        component={SiteRequestAddEdit}
    />,
    <Route
        key="r-161"
        path="/materialDeliveryAddEdit"
        component={MaterialDeliveryAddEdit}
    />,
    <Route key="r-162" path="/BarChartComp" component={Chart} />,

    <Route
        key="r-164"
        path="/TransferInventory"
        component={TransferInventory}
    />,
    <Route
        key="r-165"
        path="/requestsTransferItems"
        component={RequestsTransferItems}
    />,
    <Route
        key="r-166"
        path="/materialReturnedAddEdit"
        component={MaterialReturnedAddEdit}
    />,
    <Route
        key="r-167"
        path="/materialReleaseAddEdit"
        component={MaterialReleaseAddEdit}
    />,
    <Route key="r-169" path="/ExportDetails" component={ExportDetails} />,
    <Route
        key="r-171"
        path="/materialInventoryAddEdit"
        component={MaterialInventoryAddEdit}
    />,
    <Route key="r-172" path="/autoDeskViewer" component={AutoDeskViewer} />,
    <Route key="r-173" path="/RiskConesquence" component={RiskConesquence} />,
    <Route key="r-174" path="/GlobalSearch" component={GlobalSearch} />,
    <Route
        key="r-175"
        path="/currencyExchangeRates"
        component={CurrencyExchangeRates}
    />,
    <Route key="r-176" path="/specSectionChild" component={SpecSectionChild} />,
    <Route key="r-177" path="/RiskRealisation" component={RiskRealisation} />,

    <Route
        key="r-179"
        path="/dailyReportsAddEdit"
        component={DailyReportsAddEdit}
    />,
    <Route
        key="r-180"
        path="/budgetCashFlowReports"
        component={BudgetCashFlowReports}
    />,
    <Route key="r-181" path="/emailAddEdit" component={EmailAddEdit} />,
    <Route
        key="r-182"
        path="/estimationBoqComparison"
        component={EstimationBoqComparison}
    />,
    <Route
        key="r-183"
        path="/contractsBoqQuantities"
        component={ContractsBoqQuantities}
    />,
    <Route key="r-184" path="/invoiceQuantity" component={InvoiceQuantity} />,
    <Route key="r-185" path="/projectTimeSheet" component={ProjectTimeSheet} />,
    <Route key="r-186" path="/boqContractCost" component={BoqContractCost} />,
    <Route
        key="r-187"
        path="/deliveredQuantitieReport"
        component={DeliveredQuantitieReport}
    />,
    <Route
        key="r-188"
        path="/collectedInvoices"
        component={CollectedInvoices}
    />,
    <Route key="r-188" path="/LateTimeSheet" component={LateTimeSheet} />,
    <Route
        key="r-188"
        path="/PaymentCertificationAddEdit"
        component={PaymentCertification}
    />,
    //<Route key="r-189" path="/:docType/gen/:projectId" component={DocGen} />,

    <Route key="r-190" path="Pages/ReportsCenter/ContractsPOReports/reqPaymInvoicesRpt" component={reqPaymInvoicesRpt} />,
    <Route
        key="r-191"
        path="ProjectReports/ContractedQtyVSEarnedQty"
        component={ContractedQtyVSEarnedQtyReport}
    />,
    <Route key="r-192" path="ContractsPOReports/RequestPaymentDeductionTypeReport"
        component={RequestPaymentDeductionTypeReport} />,
    <Route key="r-193" path="/levelDurationAlertDetails"
        component={levelDurationAlertDetails} />,
    <Route key="r-194" path="/UserAlerts" component={UserAlerts} />,
    <Route
        key="r-195"
        path="/usersAlertSummaryDetails"
        component={usersAlertSummaryDetails}
    />,
    <Route
        key="r-196"
        path="/DocumentAllTypesReport"
        component={DocumentAllTypesReport}
    />,
    <Route
        key="r-197"
        path="/corrSentView"
        component={corrSentView} />,
    <Route
        key="r-198"
        path="/corrReceiveView"
        component={corrReceiveView} />,
    <Route
        key="r-199"
        path="/ContractROaAddEdit"
        component={ContractROaAddEdit} />,

    <Route
        key="r-200"
        path="/submittalDrawingStatusListReport"
        component={SubmittalDrawingStatusListReport}
    />,
    <Route
        key="r-201"
        path="/SendToWFToday"
        component={SendToWFToday}
    />,
    <Route key="r-202" path="/DesignDiscipline" component={DesignDiscipline} />,
    <Route key="r-203" path="/DetailedFollowUpReport" component={DetailedFollowUpReport} />,


];

originalRoutes = [...originalRoutes, ...setupRoutes];

let routes = (
    <Switch>
        {originalRoutes.map((item, index) => item)}
        <Route
            key={'commonLog-i'}
            path="/:document/:projectId"
            component={CommonLog}
        />
    </Switch>
);
export default routes;
