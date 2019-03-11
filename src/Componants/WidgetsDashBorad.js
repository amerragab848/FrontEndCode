var widgets = [
    { 
      widgetCategory: "mainAlerts",
      refrence: 0,
      key: "0-1",
      canView: false,
      order: 1,
      checked: false,
      widgets: [
        {  
          title: "timesheetLog",
          key: "0-1-1",
          canView: false,
          order: 1,
          type:"oneWidget",
          props: {
            api: "GetTimeSheetSummary",
            apiDetails: "",
            route: "TimeSheetDetails",
            value: "total",
            listType: "item",
            action: "action",
            isModal: false,
            key: "0-1-1",
         },
          checked:false
        },
        { 
          title: "docApproval",
          key: "0-1-2",
          canView: false,
          order: 2,
          type:"oneWidget",
          props: {
            api: "GetDocumentApprovalSummary",
            apiDetails: "",
            route:  "DocApprovalDetails?action=2",
            value: "total",
            listType: "item",
            action: "action",
            isModal: false ,
            key: "0-1-2"
        },
          checked:false
        },
        { 
          title: "pendingExpenses",
          key: "0-1-3",
          canView: false,
          checked:false,
          order: 3,
          type:"oneWidget",
          props: {
            api: "GetPendingExpensesSummary",
            apiDetails: "",
            route: "PendingExpensesDetails",
            value: "total",
            listType: "item",
            action: "action",
            isModal: false,
            key: "0-1-3"
         }
        },
        { 
          title: "docRejected",
          key: "0-1-4",
          canView: false,
          checked:false,
          order: 4,
          type:"oneWidget",
          props: {
            api: "GetDocumentRejectedSummary",
            apiDetails: "",
            route:"DocApprovalDetails?action=1" ,
            value: "total",
            listType: "item",
            action: "action",
            isModal: false,
            key: "0-1-4"
         }
        },
        { 
          title: "docNotify",
          key: "0-1-5",
          canView: false,
          checked:false,
          order: 5,
          type:"oneWidget",
          props: {
            api: "GetDocumentNotifySummary",
            apiDetails: "",
            route:"DocNotifyLogDetails",
            value: "total",
            listType: "item",
            action: "action",
            isModal: false,
            key: "0-1-5"
         }
        },
        { 
          title: "workFlowAlert",
          key: "0-1-6",
          canView: false,
          checked:false,
          order: 6,
          type:"oneWidget",
          props: {
            api: "GetWorkFlowAlertCount",
            apiDetails: "",
            route: "",
            value: "total",
            listType: "item",
            action: "action",
            isModal: false,
            key: "0-1-6"
         }
        }, 
        { 
          title: "monitorTasks",
          key: "0-1-7",
          canView: false,
          checked:false,
          order: 7,
          type:"oneWidget",
          props: {
            api: "GetCountMonitorTasks",
            apiDetails: "",
            route: "MonitorTasks",
            value: "total",
            listType: "item",
            action: "action",
            isModal: false,
            key: "0-1-7"
         }
        },
        { 
          title: "monthlyTasks",
          key: "0-1-8",
          canView: false,
          checked:false,
          order: 8,
          type:"oneWidget",
          props: {
            api: "GetCounMonthlyTasks",
            apiDetails: "",
            route: "MonthlyTasksDetails",
            value: "total",
            listType: "item",
            action: "action",
            isModal: false,
            key: "0-1-8"
         }
        },
        { 
          title: "followUpsSummary",
          key: "0-1-9",
          canView: false,
          checked:false,
          order:9,
          type:"oneWidget",
          props: {
            api: "SelectByAccountIdCount",
            apiDetails: "",
            route:"FollowUpsSummaryDetails",
            value: "total",
            listType: "item",
            action: "action",
            isModal: false,
            key: "0-1-9"
         }
        }
      ]
    },
    { 
      widgetCategory: "summaries",
      refrence: 0,
      key: "0-2",
      canView: false,
      checked:false,
      order: 2,
      widgets: [
        { 
          title: "alertingQntySummary",
          key: "0-2-1",
          canView: false,
          checked:false,
          order: 1,
          type:"threeWidget",
          props: {
            api: "GetBoqQuantityRequestedAlert",
            apiDetails: "GetBoqQuantityRequestedAlertDetails",
            route: "AlertingQuantitySummaryDetails?action=",
            value: "total",
            listType: "item",
            action: "action",
            isModal: true,
            key: "0-2-1"
         },
        },
        { 
          title: "closedSummary",
          key: "0-2-2",
          canView: false,
          checked:false,
          order: 2,
          type:"threeWidget",
          props: {
            api: "GetClosedDocumentsSummaryCount",
            apiDetails: "SelectDocTypeByProjectIdClosedByAction?action=",
            route: "ClosedSummaryDetails?action=",
            value: "total",
            listType: "item",
            action: "action",
            isModal: true,
            key: "0-2-2"
         }
        },
        { 
          title: "distributionInboxSummary",
          key: "0-2-3",
          canView: false,
          checked:false,
          order: 3,
          type:"threeWidget",
          props: {
            api: "GetDistributionInboxSummary",
            apiDetails: "",
            route: "DistributionInboxListSummaryDetails?id=1&action=",
            value: "total",
            listType: "item",
            action: "action",
            isModal: false,
            key: "0-2-3"
         }
        },
        { 
          title: "inboxSummary",
          key: "0-2-4",
          canView: false,
          checked:false,
          order: 4,
          type:"threeWidget",
          props: {
            api: "GetInboxSummary",
            apiDetails: "",
            route: "DistributionInboxListSummaryDetails?id=0&action=",
            value: "total",
            listType: "item",
            action: "action",
            isModal: false,
            key: "0-2-4"
        }
        },
        { 
          title: "notCodedExpensesSummary",
          key: "0-2-5",
          canView: false,
          checked:false,
          order: 5,
          type:"threeWidget",
          props: {
            api: "GetNotCodedExpensesSummary",
            apiDetails: "GetNotCodedExpensesSummaryDetail?action=",
            route: "NotCodedExpensesSummaryDetails?action=",
            value: "total",
            listType: "item",
            action: "action",
            isModal: true,
            key: "0-2-5"
         }
        },
        { 
          title: "notCodedInvoicesSummary",
          key: "0-2-6",
          canView: false,
          checked:false,
          order: 6,
          type:"threeWidget",
          props: {
            api: "GetNotCodedInvoicesSummary",
            apiDetails: "GetInvoicesUserByRange?action=",
            route: "NotCodedInvoicesSummaryDetails?action=",
            value: "total",
            listType: "item",
            action: "action",
            isModal: false,
            key: "0-2-6"
         }
        },
        { 
          title: "notCodedPayment",
          key: "0-2-7",
          canView: false,
          checked:false,
          order: 7,
          type:"threeWidget",
          props: {
            api: "GetNotCodedPaymentsSummary",
            apiDetails: "GetPaymentUserByRange?action=",
            route: "NotCodedPaymentDetails?action=", 
            value: "total",
            listType: "item",
            action: "action",
            isModal: true,
            key: "0-2-7"
         }
        },
        { 
          title: "actionBySummary",
          key:"0-2-8",
          canView: false,
          checked:false,
          order: 8,
          type:"threeWidget",
          props: {
            api: "GetActionByCount",
            apiDetails: "GetActionsBySummaryDetails?action=",
            route: "ActionBySummaryDetails?action=",
            value: "total",
            listType: "item",
            action: "action",
            isModal: false,
            key:"0-2-8"
         }
        }, 
        { 
          title: "openedSummary",
          key: "0-2-9",
          canView: false,
          checked:false,
          order:9,
          type:"threeWidget",
          props: {
            api: "GetOppenedDocumentsSummaryCount",
            apiDetails: "SelectDocTypeByProjectIdOpened?action=",
            route: "OpenedSummaryDetails?action=",
            value: "total",
            listType: "item",
            action: "action",
            isModal: true,
            key: "0-2-9"
         }
        }, 
        { 
          title: "schedualActionBy",
          key: "0-2-10",
          canView: false,
          checked:false,
          order:10,
          type:"threeWidget",
          props: {
            api: "GetActionByScheduleCount",
            apiDetails: "GetActionsByScheduleSummaryDetails?action=",
            route: "SchedualActionByDetails?action=",
            value: "total",
            listType: "item",
            action: "action",
            isModal: true,
            key: "0-2-10"
         }
        },
        { 
          title: "ScheduleAlertsSummary",
          key: "0-2-11",
          canView: false,
          checked:false,
          order:11,
          type:"threeWidget",
          props: {
            api: "GetScheduleAlertSummaryCount",
            apiDetails: "GetScheduleAlertSummary?action=",
            route: "ScheduleAlertsSummaryDetails?action=",
            value: "total",
            listType: "item",
            action: "action",
            isModal: true,
            key: "0-2-11"
         }
        }
      ]
    },
    { 
      widgetCategory: "counters",
      refrence: 1,
      key: "1-1",
      canView: false,
      checked:false,
      order: 1,
      widgets: [
         { 
          title: "monthlyPo",
          key: "1-1-1",
          canView: false,
          checked:false,
          order: 1,
          type:"oneWidget",
          props: {
            api: "GetTotalPo",
            apiDetails: "",
            route: "DashBoardCounterLog",
            value: "total",
            listType: "item",
            action: "action",
            isModal: false,
            key: "1-1-1"
         }
        },  
        { 
          title: "materialRequestcount",
          key: "1-1-2",
          canView: false,
          checked:false,
          order: 2,
          type:"oneWidget",
          props: {
            api: "GetMaterialRequestCounting",
            apiDetails: "",
            route: "DashBoardCounterLog",
            value: "total",
            listType: "item",
            action: "action",
            isModal: false,
            key: "1-1-2"
         }
        },
        { 
          title: "rejectedTimeSheet",
          key: "1-1-3",
          canView: false,
          checked:false,
          order: 3,
          type:"oneWidget",
          props: {
            api: "GetRejectedTimesheetBySystemCount",
            apiDetails: "",
            route: "DashBoardCounterLog",
            value: "total",
            listType: "item",
            action: "action",
            isModal: false,
            key: "1-1-3"
         }
        },{ 
          title: "monthlyPaymentRequisitions",
          key: "1-1-4",
          canView: false,
          checked:false,
          order: 4,
          type:"oneWidget",
          props: {
            api: "GetTotalPayment",
            apiDetails: "",
            route: "DashBoardCounterLog",
            value: "total",
            listType: "item",
            action: "action",
            isModal: false,
            key: "1-1-4"
         }
        }
      ]
    },
    { 
      widgetCategory: "Submittal",
      refrence: 1,
      key: "1-2",
      canView: false,
      checked:false,
      order: 2,
      widgets: [
         { 
          title: "approvalSubmittals",
          key: "1-2-1",
          canView: false,
          checked:false,
          order: 1,
          type:"twoWidget",
          props: {
            api: "GetApprocalStatusCount?status=true",
            apiDetails: "",
            route: "DashBoardCounterLog",
            value: "total-0",
            total: "total-1",
            action: "action",
            isModal: false,
            key: "1-2-1"
         }
        },{ 
          title: "openedSubmittals",
          key: "1-2-2",
          canView: false,
          checked:false,
          order: 2,
          type:"twoWidget",
          props: {
            api: "getOpenedDocumentsCount?docType=42",
            apiDetails: "",
            route: "DashBoardCounterLog",
            value: "count-0",
            total: "total-1",
            action: "action",
            isModal: false,
            key: "1-2-2"
         }
        },
        { 
          title: "rejectedSubmittals",
          key: "1-2-3",
          canView: false,
          checked:false,
          order: 3,
          type:"twoWidget",
          props: {
            api: "GetApprocalStatusCount?status=false",
            apiDetails: "",
            route: "DashBoardCounterLog",
            value: "total-0",
            total: "total-1",
            action: "action",
            isModal: false,
            key: "1-2-3"
         }
        } 
      ]
    },
    { 
      widgetCategory: "communication",
      refrence: 1,
      key: "1-3",
      canView: false,
      checked:false,
      order: 3,
      widgets: [
         { 
          title: "openedLetters",
          key: "1-3-1",
          canView: false,
          checked:false,
          order: 1,
          type:"twoWidget",
          props: {
            api: "getOpenedDocumentsCount?docType=19",
            apiDetails: "",
            route: "DashBoardCounterLog",
            value: "count-0",
            total: "total-1",
            action: "action",
            isModal: false,
            key: "1-3-1"
         }
        },{ 
          title: "openedIR",
          key: "1-3-2",
          canView: false,
          checked:false,
          order: 2,
          type:"twoWidget",
          props: {
            api: "getOpenedDocumentsCount?docType=25",
            apiDetails: "",
            route: "DashBoardCounterLog",
            value: "count-0",
            total: "total-1",
            action: "action",
            isModal: false,
            key: "1-3-2"
         }
        },
        { 
          title: "rfiOpen",
          key: "1-3-3",
          canView: false,
          checked:false,
          order: 3,
          type:"twoWidget",
          props: {
            api: "GetRfiOpenCount",
            apiDetails: "",
            route: "DashBoardCounterLog",
            value: "total-0",
            total: "total-1",
            action: "action",
            isModal: false,
            key: "1-3-3"
         }
        },
        { 
          title: "openedTransmittals",
          key: "1-3-4",
          canView: false,
          checked:false,
          order: 4,
          type:"twoWidget",
          props: {
            api: "getOpenedDocumentsCount?docType=28",
            apiDetails: "",
            route: "DashBoardCounterLog",
            value: "count-0",
            total: "total-1",
            action: "action",
            isModal: false,
            key: "1-3-4"
         }
        } 
      ]
    },
    { 
      widgetCategory: "inspectionRequest",
      refrence: 1,
      key: "1-4",
      canView: false,
      checked:false,
      order: 4,
      widgets: [
         { 
          title: "countinspectionPanding",
          key: "1-4-1",
          canView: false,
          checked:false,
          order: 1,
          type:"oneWidget",
          props: {
            api: "GetCountinspection?status=null",
            apiDetails: "",
            route: "DashBoardCounterLog",
            value: "total",
            listType: "item",
            action: "action",
            isModal: false,
            key: "1-4-1"
         }
        },{ 
          title: "countinspectionReject",
          key: "1-4-2",
          canView: false,
          checked:false,
          order: 2,
          type:"oneWidget",
          props: {
            api: "GetCountinspection?status=false",
            apiDetails: "",
            route: "DashBoardCounterLog",
            value: "total",
            listType: "item",
            action: "action",
            isModal: false,
            key: "1-4-2"
         }
        },
        { 
          title: "countinspectionApproved",
          key: "1-4-3",
          canView: false,
          checked:false,
          order: 3,
          type:"oneWidget",
          props: {
            api: "GetCountinspection?status=true",
            apiDetails: "",
            route: "DashBoardCounterLog",
            value: "total",
            listType: "item",
            action: "action",
            isModal: false,
            key: "1-4-3"
         }
        } 
      ]
    },{ 
      widgetCategory: "respondTime",
      refrence: 1,
      key: "1-5",
      canView: false,
      checked:false,
      order: 5,
      widgets: [
         { 
          title: "avgRespondTimeLetters",
          key: "1-5-1",
          canView: false,
          checked:false,
          order: 1,
          type:"oneWidget",
          props: {
            api: "GetAvgTimeRespond?isMonthly=false&docType=19",
            apiDetails: "",
            route: "",
            value: "total",
            listType: "item",
            action: "action",
            isModal: false,
            key: "1-5-1"
         }
        },{ 
          title: "avgRespondTimeTransmittals",
          key: "1-5-2",
          canView: false,
          checked:false,
          order: 2,
          type:"oneWidget",
          props: {
            api: "GetAvgTimeRespond?isMonthly=false&docType=28",
            apiDetails: "",
            route: "",
            value: "total",
            listType: "item",
            action: "action",
            isModal: false,
            key: "1-5-2"
         }
        },
        { 
          title: "avgRespondTimeIR",
          key: "1-5-3",
          canView: false,
          checked:false,
          order: 3,
          type:"oneWidget",
          props: {
            api: "GetAvgTimeRespond?isMonthly=false&docType=25",
            apiDetails: "",
            route: "",
            value: "total",
            listType: "item",
            action: "action",
            isModal: false,
            key: "1-5-3"
         }
        },
        { 
          title: "avgRespondTimeMIR",
          key: "1-5-4",
          canView: false,
          checked:false,
          order: 4,
          type:"oneWidget",
          props: {
            api: "GetAvgTimeRespond?isMonthly=false&docType=103",
            apiDetails: "",
            route: "",
            value: "total",
            listType: "item",
            action: "action",
            isModal: false,
            key: "1-5-4"
         }
        },
        { 
          title: "avgRespondTimeRFI",
          key: "1-5-5",
          canView: false,
          checked:false,
          order: 5,
          type:"oneWidget",
          props: {
            api: "GetAvgTimeRespond?isMonthly=false&docType=23",
            apiDetails: "",
            route: "",
            value: "total",
            listType: "item",
            action: "action",
            isModal: false,
            key: "1-5-5"
         }
        },
        { 
          title: "avgRespondTimeSubmittals",
          key: "1-5-6",
          canView: false,
          checked:false,
          order: 6,
          type:"oneWidget",
          props: {
            api: "GetAvgTimeRespond?isMonthly=false&docType=42",
            apiDetails: "",
            route: "",
            value: "total",
            listType: "item",
            action: "action",
            isModal: false,
            key: "1-5-6"
         }
        },
        { 
          title: "avgRespondTimePO",
          key: "1-5-7",
          canView: false,
          checked:false,
          order: 7,
          type:"oneWidget",
          props: {
            api: "GetAvgTimeRespond?isMonthly=false&docType=70",
            apiDetails: "",
            route: "",
            value: "total",
            listType: "item",
            action: "action",
            isModal: false,
            key: "1-5-7"
         }
        }
      ]
    }, 
    { 
      widgetCategory: "qualityControl",
      refrence: 2,
      key: "2-1",
      canView: false,
      checked:false,
      order: 1,
      widgets:  [
        { 
          title: "materialRequestcount",
          key: "2-1-1",
          canView: false,
          checked:false,
          order: 1,
          type:"oneWidget",
          props: {
            api: "GetMaterialRequestCounting",
            apiDetails: "",
            route: "",
            value: "total",
            listType: "item",
            action: "action",
            isModal: false,
            key: "2-1-1"
         }
        },{ 
          title: "inspectionRequestCount",
          key: "2-1-2",
          canView: false,
          checked:false,
          order: 2,
          type:"oneWidget",
          props: {
            api: "GetInspectionRequestForCountingCustomLog",
            apiDetails: "",
            route: "",
            value: "total",
            listType: "item",
            action: "action",
            isModal: false,
            key: "2-1-2"
         }
        },{ 
          title: "NCRCount",
          key: "2-1-3",
          canView: false,
          checked:false,
          order: 3,
          type:"oneWidget",
          props: {
            api: "GetCommunicationNCRCountingForCustomLog",
            apiDetails: "",
            route: "",
            value: "total",
            listType: "item",
            action: "action",
            isModal: false,
            key: "2-1-3"
         }
        },{ 
          title: "siteInstructionsCount",
          key: "2-1-4",
          canView: false,
          checked:false,
          order: 4,
          type:"oneWidget",
          props: {
            api: "GetLogsSiteInstructionsCountingForCustomLog",
            apiDetails: "",
            route: "",
            value: "total",
            listType: "item",
            action: "action",
            isModal: false,
            key: "2-1-4"
         }
        }    
      ]   
    },
    { 
      widgetCategory: "po",
      refrence: 2,
      key: "2-2",
      canView: false,
      checked:false,
      order: 2,
      widgets:  [
        { 
          title: "InvoicesForPOCount",
          key:"2-2-1",
          canView: false,
          checked:false,
          order: 1,
          type:"oneWidget",
          props: {
            api: "GetInvoicesForPoCountingForCustomLog",
            apiDetails: "",
            route: "",
            value: "total",
            listType: "item",
            action: "action",
            isModal: false,
            key:"2-2-1"
         }
        },{ 
          title: "projectInventory",
          key:"2-2-2",
          canView: false,
          checked:false,
          order: 2,
          type:"oneWidget",
          props: {
            api: "selectAllMaterialInventoryCount",
            apiDetails: "",
            route: "",
            value: "total",
            listType: "item",
            action: "action",
            isModal: false,
            key:"2-2-2"
         }
        } 
      ]
    } 
  ];


  export default widgets;