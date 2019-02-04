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
import Letter from "./Pages/Communication/Letter";
import Router from "./URLRoutes";

// let generalMenu = [];
// let communication = [];
// let procurementMenu = [];
// let siteMenu = [];
// let contractMenu = [];
// let designMenu = [];
// let timeMenu = [];
// let estimationMenu = [];
// let qualityControlMenu = [];
// let costControlMenu = [];
// let reportsMenu = [];

var renderRouter = () => {
    let rout = Router.map((r,index) => {
        if (r.settings) {
          if (r.settings.General === true) {
            return <Route path={"/:" + r.route + "/:projectId"} component={Letter} key={index} /> 
          } else if (r.settings.Communication === true) { 
              return <Route path={"/:" + r.route + "/:projectId"} component={Letter} key={index}/>
          } else if (r.settings.Procurement === true) {
              return <Route path={"/:" + r.route + "/:projectId"} component={Letter} key={index}/> 
          } else if (r.settings.Site === true) {
              return  <Route path={"/:" + r.route + "/:projectId"} component={Letter} key={index}/> 
          } else if (r.settings.Contracts === true) {
              return  <Route path={"/:" + r.route + "/:projectId"} component={Letter} key={index}/> 
          } else if (r.settings.Design === true) {
              return  <Route path={"/:" + r.route + "/:projectId"} component={Letter} key={index}/> 
          } else if (r.settings.Time === true) {
              return  <Route path={"/:" + r.route + "/:projectId"} component={Letter} key={index}/> 
          } else if (r.settings.Estimation === true) {
              return <Route path={"/:" + r + "/:projectId"} component={Letter} key={index}/> 
          } else if (r.settings.QualityControl === true) {
              return   <Route path={"/:" + r.route + "/:projectId"} component={Letter} key={index}/> 
          } else if (r.settings.CostControl === true) {
              return  <Route path={"/:" + r.route + "/:projectId"} component={Letter} key={index}/> 
          } else if (r.settings.Reports === true) {
              return  <Route path={"/:" + r.route + "/:projectId"} component={Letter} key={index}/> 
          }
        }
      });
      console.log("rout : "+rout);

      return rout;
}
 
let routes = (
  <Switch> 
    <Route exact path="/" component={DashBoard} /> 
    <Route path="/ActionBySummaryDetails" component={ActionBySummaryDetails} /> 
    <Route path="/AlertingQuantitySummaryDetails" component={AlertingQuantitySummaryDetails}/> 
    <Route path="/DocNotifyLogDetails" component={DocNotifyLogDetails} /> 
    <Route path="/ClosedSummaryDetails" component={ClosedSummaryDetails} /> 
    <Route path="/DistributionInboxListSummaryDetails" component={DistributionInboxListSummaryDetails}/> 
    <Route path="/NotCodedExpensesSummaryDetails" component={NotCodedExpensesSummaryDetails}/> 
    <Route path="/NotCodedInvoicesSummaryDetails" component={NotCodedInvoicesSummaryDetails} /> 
    <Route path="/NotCodedPaymentDetails" component={NotCodedPaymentDetails} /> 
    <Route path="/OpenedSummaryDetails" component={OpenedSummaryDetails} /> 
    <Route path="/SchedualActionByDetails" component={SchedualActionByDetails}/> 
    <Route path="/ScheduleAlertsSummaryDetails" component={ScheduleAlertsSummaryDetails} /> 
    <Route path="/TimeSheetDetails" component={TimeSheetDetails} /> 
    <Route path="/DocApprovalDetails" component={DocApprovalDetails} /> 
    <Route path="/PendingExpensesDetails" component={PendingExpensesDetails} /> 
    {/* {renderRouter()} */}
    <Route path="/:document/:projectId" component={Letter} />
  </Switch>
);

console.log("routes : "+routes);

export default routes;
