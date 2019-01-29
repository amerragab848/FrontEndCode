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


let routes = (<Switch>
    <Route exact path="/" component={DashBoard} />,
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
    <Route path="/PendingExpensesDetails" component={PendingExpensesDetails} />
</Switch>);

export default routes;
