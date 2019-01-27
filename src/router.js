import React from "react";
import { Route, Switch } from "react-router-dom";
import DashBoard from "./Pages/DashBoard";
import ActionBySummaryDetails from "./Componants/DashBoardDetails/actionBySummaryDetails";
import AlertingQuantitySummaryDetails from "./Componants/DashBoardDetails/alertingQuantitySummaryDetails";
import DocNotifyLogDetails from "./Componants/DashBoardDetails/docNotifyLogDetails";
import ClosedSummaryDetails from "./Componants/DashBoardDetails/closedSummaryDetails";
import DistributionInboxListSummaryDetails from "./Componants/DashBoardDetails/distributionInboxListSummaryDetails";
import NotCodedExpensesSummaryDetails from "./Componants/DashBoardDetails/notCodedExpensesSummaryDetails";
import NotCodedInvoicesSummaryDetails from "./Componants/DashBoardDetails/notCodedInvoicesSummaryDetails";
import NotCodedPaymentDetails from "./Componants/DashBoardDetails/notCodedPaymentDetails";
import OpenedSummaryDetails from "./Componants/DashBoardDetails/openedSummaryDetails";
import SchedualActionByDetails from "./Componants/DashBoardDetails/schedualActionByDetails";
import ScheduleAlertsSummaryDetails from "./Componants/DashBoardDetails/scheduleAlertsSummaryDetails";
import TimeSheetDetails from "./Componants/DashBoardDetails/timeSheetDetails";
import DocApprovalDetails from "./Componants/DashBoardDetails/docApprovalDetails";
import PendingExpensesDetails from "./Componants/DashBoardDetails/pendingExpensesDetails";


let routes = (<Switch>
<Route exact path="/" component={DashBoard} />,
<Route path="/actionBySummaryDetails" component={ActionBySummaryDetails} />,
<Route path="/alertingQuantitySummaryDetails" component={AlertingQuantitySummaryDetails} />,
<Route path="/docNotifyLogDetails" component={DocNotifyLogDetails} />,
<Route path="/closedSummaryDetails" component={ClosedSummaryDetails} />,
<Route path="/distributionInboxListSummaryDetails" component={DistributionInboxListSummaryDetails} />,
<Route path="/notCodedExpensesSummaryDetails" component={NotCodedExpensesSummaryDetails} />,
<Route path="/notCodedInvoicesSummaryDetails" component={NotCodedInvoicesSummaryDetails} />,
<Route path="/notCodedPaymentDetails" component={NotCodedPaymentDetails} />,
<Route path="/openedSummaryDetails" component={OpenedSummaryDetails} />,
<Route path="/schedualActionByDetails" component={SchedualActionByDetails} />,
<Route path="/scheduleAlertsSummaryDetails" component={ScheduleAlertsSummaryDetails} />,
<Route path="/timeSheetDetails" component={TimeSheetDetails} />,
<Route path="/docApprovalDetails" component={DocApprovalDetails} />,
<Route path="/pendingExpensesDetails" component={PendingExpensesDetails} />
</Switch>);

export default routes;
