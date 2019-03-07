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
import Router from "./URLRoutes";
import PrivacySetting from '../src/Componants/User/PrivacySetting';
import ProfileSetting  from "../src/Componants/User/index";
import TimeSheetWorkFlow  from "../src/Componants/DashBoardDetails/TimeSheetWorkFlow";
// import ExpensesWorkFlow  from "../src/Componants/DashBoardDetails/ExpensesWorkFlow";
import GetExpensesUserForEdit from "../src/Componants/User/GetExpensesUserForEdit";
import Companies from './Componants/GeneralSetting/Companies/Index';
import AddEditCompany from './Componants/GeneralSetting/Companies/AddEditCompany';
import Contacts from './Componants/GeneralSetting/Contacts/Index';
import MonthlyTasksDetails from "./Componants/DashBoardDetails/MonthlyTasksDetails";
import MonitorTasks from "./Componants/DashBoardDetails/MonitorTasks";
import AddTimeSheet from './Componants/TimeSheet/AddTimeSheet';
import AddOverTime from './Componants/TimeSheet/AddOverTime'
import AddLateTimeSheet from './Componants/TimeSheet/AddLateTimeSheet'
import OverTime from './Componants/TimeSheet/OverTime'
import Accounts  from './Componants/GeneralSetting/Accounts/Accounts'
import AccountsCompaniesPermissions  from './Componants/GeneralSetting/Accounts/AccountsCompaniesPermissions'
import AddAccount  from './Componants/GeneralSetting/Accounts/AddAccount'
import EditAccount  from './Componants/GeneralSetting/Accounts/EditAccount'
import UserProjects  from './Componants/GeneralSetting/Accounts/UserProjects'
import TaskAdmin  from './Componants/GeneralSetting/Accounts/TaskAdmin'
import AccountsEPSPermissions  from './Componants/GeneralSetting/Accounts/AccountsEPSPermissions'
import TemplatesSettings  from './Componants/GeneralSetting/TemplatesSettings'
import LettersAddEdit from "./Pages/Communication/LettersAddEdit";
import FollowUpsSummaryDetails from "./Componants/DashBoardDetails/FollowUpsSummaryDetails"; 
import GeneralList  from './Componants/GeneralSetting/MenuDefaultData/GeneralList'
import ExpensesWorkFlowLog  from './Componants/GeneralSetting/Project/ExpensesWorkFlow/ExpensesWorkFlowLog' 
import ExpensesWorkFlow  from './Componants/GeneralSetting/Project/ExpensesWorkFlow/ExpensesWorkFlow'
import ExpensesWorkFlowAddEdit  from './Componants/GeneralSetting/Project/ExpensesWorkFlow/ExpensesWorkFlowAddEdit'

let routes = (
<Switch>
    <Route exact path="/" component={DashBoard} />, 
    <Route path="/LettersAddEdit" component={LettersAddEdit} />
    <Route path="/ActionBySummaryDetails" component={ActionBySummaryDetails} />,
    <Route path="/AlertingQuantitySummaryDetails" component={AlertingQuantitySummaryDetails} />,
    <Route path="/DocNotifyLogDetails" component={DocNotifyLogDetails} />,
    <Route path="/ClosedSummaryDetails" component={ClosedSummaryDetails} />,
    <Route path="/DistributionInboxListSummaryDetails" component={DistributionInboxListSummaryDetails} />,
    <Route path="/NotCodedExpensesSummaryDetails" component={NotCodedExpensesSummaryDetails} />,
    <Route path="/NotCodedInvoicesSummaryDetails" component={NotCodedInvoicesSummaryDetails} />,
    <Route path="/NotCodedPaymentDetails" component={NotCodedPaymentDetails} />,
    <Route path="/OpenedSummaryDetails" component={OpenedSummaryDetails} />,
    <Route path="/SchedualActionByDetails" component={SchedualActionByDetails} />,
    <Route path="/ScheduleAlertsSummaryDetails" component={ScheduleAlertsSummaryDetails} />,
    <Route path="/TimeSheetDetails" component={TimeSheetDetails} />,
    <Route path="/DocApprovalDetails" component={DocApprovalDetails} />,
    <Route path="/PendingExpensesDetails" component={PendingExpensesDetails} />,
    <Route path="/PrivacySetting" component={PrivacySetting} />,
    <Route path="/Companies/" component={Companies} /> 
    <Route path="/Contacts/:companyID" component={Contacts} />  
    <Route path="/AddEditCompany/:companyID" component={AddEditCompany} />  
    <Route path="/:document/:projectId" component={CommonLog} />, 
    <Route path="/ProfileSetting" component={ProfileSetting} />,
    <Route path="/TimeSheetWorkFlow" component={TimeSheetWorkFlow} /> 
    <Route path="/GetExpensesUserForEdit" component={GetExpensesUserForEdit} />
    {/* <Route path="/AddNewCompany" component={AddNewCompany} />    */}
    <Route path="/Contacts/:companyID" component={Contacts} /> 
    
    <Route path="/AddEditCompany/:companyID" component={AddEditCompany} /> 
    
    <Route path="/:document/:projectId" component={CommonLog} />,

    <Route path="/ProfileSetting" component={ProfileSetting} />,
    <Route path="/TimeSheetWorkFlow" component={TimeSheetWorkFlow} /> 
    <Route path="/GetExpensesUserForEdit" component={GetExpensesUserForEdit} />
     
    <Route path="/MonthlyTasksDetails" component={MonthlyTasksDetails} /> 
    <Route path="/MonitorTasks" component={MonitorTasks} /> 
    <Route path="/AddTimeSheet" component={AddTimeSheet} /> 
    <Route path="/AddOverTime" component={AddOverTime} /> 
    <Route path="/AddLateTimeSheet" component={AddLateTimeSheet} /> 
    <Route path="/OverTime" component={OverTime} />  
    <Route path="/Accounts" component={Accounts} /> 
    <Route path="/AccountsCompaniesPermissions" component={AccountsCompaniesPermissions} /> 
    <Route path="/AccountsEPSPermissions" component={AccountsEPSPermissions} /> 
    <Route path="/AddAccount" component={AddAccount} /> 
    <Route path="/EditAccount" component={EditAccount} /> 
    <Route path="/UserProjects" component={UserProjects} /> 
    <Route path="/TaskAdmin" component={TaskAdmin} /> 
    <Route path="/FollowUpsSummaryDetails" component={FollowUpsSummaryDetails} />
    <Route path="/TemplatesSettings" component={TemplatesSettings} /> 
    <Route path="/GeneralList" component={GeneralList} /> 
    <Route path="/ExpensesWorkFlowLog" component={ExpensesWorkFlowLog} />  
    <Route path="/ExpensesWorkFlowAddEdit" component={ExpensesWorkFlowAddEdit} /> 
    <Route path="/ExpensesWorkFlow" component={ExpensesWorkFlow} />  
    <Route path="/TemplatesSettings" component={TemplatesSettings} /> 
    <Route path="/GeneralList" component={GeneralList} /> 
    <Route path="/ExpensesWorkFlowLog" component={ExpensesWorkFlowLog} /> 


    <Route path="/ExpensesWorkFlowAddEdit" component={ExpensesWorkFlowAddEdit} /> 
    <Route path="/ExpensesWorkFlow" component={ExpensesWorkFlow} /> 
    
</Switch> 
); 
export default routes;
