var widgets = [
  {
    widgetCategory: "mainAlerts",
    refrence: 0,
    canView: false,
    order: 1,
    checked: true,
    widgets: [
      {
        title: "docApproval",
        permission: 0,
        // key: "0-1-2",
        canView: false,
        checked: true,
        order: 2,
        type: "oneWidget",
        props: {
          api: "GetDocumentApprovalSummary",
          apiDetails: "",
          route: "DocApprovalDetails?action=2",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false,
          // key: "0-1-2"
        },
        checked: true
      },
      {
        title: "docRejected",
        permission: 0,
        // key: "0-1-4",
        canView: false,
        checked: true,
        order: 4,
        type: "oneWidget",
        props: {
          api: "GetDocumentRejectedSummary",
          apiDetails: "",
          route: "DocApprovalDetails?action=1",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false,
          // key: "0-1-4"
        }
      },
      {
        title: "docNotify",
        permission: 0,
        // key: "0-1-5",
        canView: false,
        checked: true,
        order: 5,
        type: "oneWidget",
        props: {
          api: "GetDocumentNotifySummary",
          apiDetails: "",
          route: "DocNotifyLogDetails",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false,
          // key: "0-1-5"
        }
      },
      {
        title: "workFlowAlert",
        permission: 0,
        // key: "0-1-6",
        canView: false,
        checked: true,
        order: 6,
        type: "oneWidget",
        props: {
          api: "GetWorkFlowAlertCount",
          apiDetails: "",
          route: "workFlowAlerts",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false,
          // key: "0-1-6"
        }
      },
      {
        title: "monitorTasks",
        permission: 0,
        canView: false,
        checked: true,
        order: 7,
        type: "oneWidget",
        props: {
          api: "GetCountMonitorTasks",
          apiDetails: "",
          route: "MonitorTasks",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false,
        }
      },
      {
        title: "followUpsSummary",
        permission: 0,
        canView: false,
        checked: true,
        order: 8,
        type: "oneWidget",
        props: {
          api: "SelectByAccountIdCount",
          apiDetails: "",
          route: "FollowUpsSummaryDetails",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false
        }
      },
      {
        title: "levelDurationAlert",
        permission: 0,
        canView: false,
        checked: true,
        order: 9,
        type: "oneWidget",
        props: {
          api: "GetLevelDurationDelayCount",
          apiDetails: "",
          route: "levelDurationAlertDetails",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false
        }
      },
      {
        title: "SendToWFToday",
        permission: 10139,
        // key: "0-1-6",
        canView: false,
        checked: true,
        order: 10,
        type: "oneWidget",
        props: {
          api: "GetSendToWFTodayCount",
          apiDetails: "",
          route: "SendToWFToday",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false,
          // key: "0-1-6"
        }
      }
    ]
  },
  {
    widgetCategory: "summaries",
    refrence: 0,
    canView: false,
    checked: false,
    order: 2,
    widgets: [
      {
        title: "alertingQntySummary",
        permission: 0,
        canView: false,
        checked: false,
        order: 1,
        type: "threeWidget",
        props: {
          api: "GetBoqQuantityRequestedAlert",
          apiDetails: "GetBoqQuantityRequestedAlertDetails",
          route: "AlertingQuantitySummaryDetails?action=",
          value: "total",
          listType: "item",
          action: "action",
          isModal: true,
          // key: "0-2-1"
        },
      },
      {
        title: "closedSummary",
        permission: 0,
        // key: "0-2-2",
        canView: false,
        checked: false,
        order: 2,
        type: "threeWidget",
        props: {
          api: "GetClosedDocumentsSummaryCount",
          apiDetails: "SelectDocTypeByProjectIdClosedByAction?action=",
          route: "ClosedSummaryDetails?action=",
          value: "total",
          listType: "item",
          action: "action",
          isModal: true,
          // key: "0-2-2"
        }
      },
      {
        title: "distributionInboxSummary",
        permission: 0,
        // key: "0-2-3",
        canView: false,
        checked: false,
        order: 3,
        type: "threeWidget",
        props: {
          api: "GetDistributionInboxSummary",
          apiDetails: "",
          route: "DistributionInboxListSummaryDetails?id=1&action=",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false,
          // key: "0-2-3"
        }
      },
      {
        title: "inboxSummary",
        permission: 0,
        // key: "0-2-4",
        canView: false,
        checked: false,
        order: 4,
        type: "threeWidget",
        props: {
          api: "GetInboxSummary",
          apiDetails: "",
          route: "DistributionInboxListSummaryDetails?id=0&action=",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false,
          // key: "0-2-4"
        }
      },
      {
        title: "notCodedExpensesSummary",
        permission: 0,
        // key: "0-2-5",
        canView: false,
        checked: false,
        order: 5,
        type: "threeWidget",
        props: {
          api: "GetNotCodedExpensesSummary",
          apiDetails: "GetNotCodedExpensesSummaryDetail?action=",
          route: "NotCodedExpensesSummaryDetails?action=",
          value: "total",
          listType: "item",
          action: "action",
          isModal: true,
          // key: "0-2-5"
        }
      },
      {
        title: "notCodedInvoicesSummary",
        permission: 0,
        // key: "0-2-6",
        canView: false,
        checked: false,
        order: 6,
        type: "threeWidget",
        props: {
          api: "GetNotCodedInvoicesSummary",
          apiDetails: "GetInvoicesUserByRange?action=",
          route: "NotCodedInvoicesSummaryDetails?action=",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false,
          // key: "0-2-6"
        }
      },
      {
        title: "notCodedPayment",
        permission: 0,
        // key: "0-2-7",
        canView: false,
        checked: false,
        order: 7,
        type: "threeWidget",
        props: {
          api: "GetNotCodedPaymentsSummary",
          apiDetails: "GetPaymentUserByRange?action=",
          route: "NotCodedPaymentDetails?action=",
          value: "total",
          listType: "item",
          action: "action",
          isModal: true,
          // key: "0-2-7"
        }
      },
      {
        title: "actionBySummary",
        permission: 0,
        // key: "0-2-8",
        canView: false,
        checked: false,
        order: 8,
        type: "threeWidget",
        props: {
          api: "GetActionByCount",
          apiDetails: "GetActionsBySummaryDetails?action=",
          route: "ActionBySummaryDetails?action=",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false,
          // key: "0-2-8"
        }
      },

      {
        title: "openedSummary",
        permission: 0,
        // key: "0-2-9",
        canView: 1372,
        checked: false,
        order: 9,
        type: "threeWidget",
        props: {
          api: "GetOppenedDocumentsSummaryCount",
          apiDetails: "SelectDocTypeByProjectIdOpened?action=",
          route: "OpenedSummaryDetails?action=",
          value: "total",
          listType: "item",
          action: "action",
          isModal: true,
          // key: "0-2-9"
        }
      },
      {
        title: "schedualActionBy",
        permission: 0,
        // key: "0-2-10",
        canView: false,
        checked: false,
        order: 10,
        type: "threeWidget",
        props: {
          api: "GetActionByScheduleCount",
          apiDetails: "GetActionsByScheduleSummaryDetails?action=",
          route: "SchedualActionByDetails?action=",
          value: "total",
          listType: "item",
          action: "action",
          isModal: true,
          // key: "0-2-10"
        }
      },
      {
        title: "ScheduleAlertsSummary",
        permission: 0,
        // key: "0-2-11",
        canView: false,
        checked: false,
        order: 11,
        type: "threeWidget",
        props: {
          api: "GetScheduleAlertSummaryCount",
          apiDetails: "GetScheduleAlertSummary?action=",
          route: "ScheduleAlertsSummaryDetails?action=",
          value: "total",
          listType: "item",
          action: "action",
          isModal: true,
          // key: "0-2-11"
        }
      },
      {
        title: "usersAlertSummary",
        permission: 0,
        // key: "0-2-8",
        canView: false,
        checked: false,
        order: 13,
        type: "threeWidget",
        props: {
          api: "GetusersAlertCount",
          apiDetails: "GetusersAlertSummaryDetails?action=",
          route: "usersAlertSummaryDetails?action=",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false,
          // key: "0-2-8"
        }
      },
    ]
  },
  {
    widgetCategory: "reportChart",
    refrence: 0,
    // key: "0-3",
    canView: false,
    checked: false,
    order: 3,
    widgets: [
      {
        id: 'wt-Name01',
        checked: false,
        permission: 1377,
        // key: "0-3-1",
        title: 'projectStatus',
        order: 1,
        props: {
          'api': 'GetProjectsStatusSummaryCount',
          'name': 'item',
          'y': 'total'
        },
        type: 'pie',
        seriesName: "projectStatus"
      }, {
        id: 'wt-Name02',
        permission: 3500,
        // key: "0-3-2",
        checked: true,
        title: 'percentageExpensesTypesOfTotal',
        order: 2,
        props: {
          'api': 'GetPercentageExpensesType',
          'name': 'projectName',
          'y': 'total'
        },
        type: 'pie',
        seriesName: "expensesAllProject"

      }, {
        id: 'wt-Name03',
        // key: "0-3-3",
        checked: true,
        permission: 3507,
        title: 'expensesAllProject',
        order: 3,
        props: {
          'api': 'GetExpensesByTypeForAllProjects',
          'name': 'expenseTypeName',
          'y': 'total'
        },
        type: 'pie',
        seriesName: "expensesAllProject"

      }, {
        id: 'wt-Name04',
        // key: "0-3-4",
        checked: false,
        permission: 10041,
        title: 'riskStatusYearly',
        order: 4,
        props: {
          'api': 'GetRiskDataChartLine'
        },
        topicNames: ['Opened', 'Closed'],
        type: 'line'
      }, {
        id: 'wt-Name05',
        // key: "0-3-5",
        checked: false,
        permission: 3498,
        title: 'percentOfApprovedSubmittalPerProject',
        order: 5,
        props: {
          'api': 'GetTopFiveApprovedSubmittal?status=true',
          'name': 'projectName',
          'data': 'percentage'
        },
        type: 'column',
        stack: 'normal',
        yTitle: 'total',
        catagName: 'projectName',
        multiSeries: 'no',
        barContent: []
      }, {
        id: 'wt-Name6',
        // key: "0-3-6",
        permission: 10042,
        checked: false,
        title: 'letterStatusYearly',
        order: 6,
        props: {
          'api': 'GetChartLineDataByDocType?docType=19'
        },
        topicNames: ['Opened', 'Closed'],
        type: 'line'
      }, {
        id: 'wt-Name7',
        checked: false,
        permission: 3497,
        order: 7,
        title: 'percentOfMaterialRequestPerProject',
        props: {
          'api': 'GetTopFiveRequests',
          'name': 'projectName',
          'data': 'percentage'
        },
        type: 'column',
        stack: 'normal',
        yTitle: 'total',
        catagName: 'projectName',
        multiSeries: 'no',
        barContent: []
      }, {
        id: 'wt-Name8',
        checked: false,
        permission: 10039,
        order: 8,
        title: 'submittalStatusYearly',
        props: {
          'api': 'GetChartLineDataByDocType?docType=42'
        },
        topicNames: ['Opened', 'Closed'],
        type: 'line'
      }, {
        id: 'wt-Name09',
        checked: false,
        permission: 3499,
        order: 9,
        title: 'percentOfRejectedSubmittalPerProject',
        props: {
          'api': 'GetTopFiveApprovedSubmittal?status=false',
          'name': 'projectName',
          'data': 'percentage'
        },
        type: 'column',
        stack: 'normal',
        yTitle: 'total',
        catagName: 'projectName',
        multiSeries: 'no',
        barContent: []
      }, {
        id: 'wt-Name11',
        checked: false,
        permission: 3505,
        order: 11,
        title: 'contractsPerProject',
        props: {
          'api': 'GetTopFiveContracts'
        },
        type: 'column',
        yTitle: 'total',
        catagName: 'projectName',
        multiSeries: 'yes',
        barContent: [{ name: 'Contracted', value: 'percentageContract' }, { name: 'Contracts Under Review', value: 'countUnderContract' }]

      }, {
        id: 'wt-Name10',
        checked: false,
        permission: 10043,
        order: 10,
        title: 'countinspectionApprovedChar',
        props: {
          'api': 'GetStatusIspectionRequest?status=true',
          'name': 'projectName',
          'data': 'percentage'
        },
        type: 'column',
        stack: 'normal',
        yTitle: 'sum',
        catagName: 'projectName',
        multiSeries: 'no',
        barContent: []
      }, {
        id: 'wt-Name13',
        checked: false,
        permission: 10040,
        order: 13,
        title: 'transmittalStatusYearly',
        props: {
          'api': 'GetChartLineDataByDocType?docType=28'
        },
        topicNames: ['Opened', 'Closed'],
        type: 'line'
      }, {
        id: 'wt-Name12',
        checked: false,
        title: 'budgetVariance',
        permission: 3509,
        order: 12,
        props: {
          'api': 'GetTopFiveBudgetVariance'
        },
        type: 'column',
        yTitle: 'actual',
        catagName: 'expenseTypeName',
        multiSeries: 'yes',
        barContent: [{ name: 'Actual Total', value: 'actual' }, { name: 'Budget Expenses', value: 'budgetedExpenseValue' }]
      }
    ]
  },
  {
    widgetCategory: "risk",
    refrence: 0,
    canView: false,
    checked: false,
    order: 4,
    widgets: [
      {
        id: 'wt-riskStatus01',
        checked: true,
        permission: 1377,
        title: 'riskStatus',
        order: 1,
        props: {
          'api': 'RiskByStatus',
          'name': 'item',
          'y': 'total'
        },
        type: 'pie',
        seriesName: "riskStatus"
      }, {
        id: 'wt-riskPeriority02',
        permission: 3500,
        checked: true,
        title: 'riskPeriority',
        order: 2,
        props: {
          'api': 'RiskByPriority',
          'name': 'item',
          'y': 'total'
        },
        type: 'pie',
        seriesName: "riskPeriority"
      }, {
        id: 'wt-riskType03',
        checked: true,
        permission: 3507,
        title: 'riskType',
        order: 3,
        props: {
          'api': 'RiskByRiskType',
          'name': 'item',
          'y': 'total'
        },
        type: 'pie',
        seriesName: "riskType"

      }
    ]
  },
  {
    widgetCategory: "counters",
    refrence: 1,
    canView: false,
    checked: false,
    order: 1,
    widgets: [
      {
        title: "monthlyPo",
        permission: 0,
        canView: false,
        checked: false,
        order: 1,
        type: "oneWidget",
        props: {
          api: "GetTotalPo",
          apiDetails: "",
          route: "DashBoardCounterLog",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false,
        }
      },
      {
        title: "materialRequestcount",
        permission: 3343,
        canView: false,
        checked: false,
        order: 2,
        type: "oneWidget",
        props: {
          api: "GetMaterialRequestCounting",
          apiDetails: "",
          route: "DashBoardCounterLog",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false,
        }
      },
      {
        title: "rejectedTimeSheet",
        permission: 0,
        canView: false,
        checked: false,
        order: 3,
        type: "oneWidget",
        props: {
          api: "GetRejectedTimesheetBySystemCount",
          apiDetails: "",
          route: "RejectedTimesheetsDetails",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false,
        }
      },
      {
        title: "monthlyPaymentRequisitions",
        permission: 0,
        canView: false,
        checked: false,
        order: 4,
        type: "oneWidget",
        props: {
          api: "GetTotalPayment",
          apiDetails: "",
          route: "DashBoardCounterLog",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false,
        }
      },
      {
        title: "monthlyTasks",
        permission: 0,
        canView: false,
        checked: false,
        order: 5,
        type: "oneWidget",
        props: {
          api: "GetCounMonthlyTasks",
          apiDetails: "",
          route: "MonthlyTasksDetails",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false
        }
      },
      {
        title: "timesheetLog",
        permission: 0,
        canView: false,
        order: 7,
        type: "oneWidget",
        props: {
          api: "GetTimeSheetSummary",
          apiDetails: "",
          route: "TimeSheetDetails",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false
        },
        checked: false
      },
      {
        title: "pendingExpenses",
        permission: 0,
        canView: false,
        checked: false,
        order: 8,
        type: "oneWidget",
        props: {
          api: "GetPendingExpensesSummary",
          apiDetails: "",
          route: "PendingExpensesDetails",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false,
        }
      },
    ]
  },
  {
    widgetCategory: "Submittal",
    refrence: 1,
    canView: false,
    checked: false,
    order: 2,
    widgets: [
      {
        title: "approvalSubmittals",
        permission: 3493,
        canView: false,
        checked: false,
        order: 1,
        type: "twoWidget",
        props: {
          api: "GetApprocalStatusCount?status=true",
          apiDetails: "",
          route: "DashBoardCounterLog",
          value: "total-0",
          total: "total-1",
          action: "action",
          isModal: false
        }
      }, {
        title: "openedSubmittals",
        permission: 3510,
        canView: false,
        checked: false,
        order: 2,
        type: "twoWidget",
        props: {
          api: "getOpenedDocumentsCount?docType=42",
          apiDetails: "",
          route: "DashBoardCounterLog",
          value: "count-0",
          total: "total-1",
          action: "action",
          isModal: false
        }
      },
      {
        title: "rejectedSubmittals",
        permission: 3494,
        canView: false,
        checked: false,
        order: 3,
        type: "twoWidget",
        props: {
          api: "GetApprocalStatusCount?status=false",
          apiDetails: "",
          route: "DashBoardCounterLog",
          value: "total-0",
          total: "total-1",
          action: "action",
          isModal: false,
        }
      }
    ]
  },
  {
    widgetCategory: "communication",
    refrence: 1,
    canView: false,
    checked: false,
    order: 3,
    widgets: [
      {
        title: "openedLetters",
        permission: 3512,
        canView: false,
        checked: false,
        order: 1,
        type: "twoWidget",
        props: {
          api: "getOpenedDocumentsCount?docType=19",
          apiDetails: "",
          route: "DashBoardCounterLog",
          value: "count-0",
          total: "total-1",
          action: "action",
          isModal: false,
        }
      }, {
        title: "openedIR",
        permission: 3513,
        canView: false,
        checked: false,
        order: 2,
        type: "twoWidget",
        props: {
          api: "getOpenedDocumentsCount?docType=25",
          apiDetails: "",
          route: "DashBoardCounterLog",
          value: "count-0",
          total: "total-1",
          action: "action",
          isModal: false,
        }
      },
      {
        title: "rfiOpen",
        permission: 3495,
        canView: false,
        checked: false,
        order: 3,
        type: "twoWidget",
        props: {
          api: "GetRfiOpenCount",
          apiDetails: "",
          route: "DashBoardCounterLog",
          value: "total-0",
          total: "total-1",
          action: "action",
          isModal: false,
        }
      },
      {
        title: "openedTransmittals",
        permission: 3511,
        canView: false,
        checked: false,
        order: 4,
        type: "twoWidget",
        props: {
          api: "getOpenedDocumentsCount?docType=28",
          apiDetails: "",
          route: "DashBoardCounterLog",
          value: "count-0",
          total: "total-1",
          action: "action",
          isModal: false,
        }
      }
    ]
  },
  {
    widgetCategory: "inspectionRequest",
    refrence: 1,
    canView: false,
    checked: false,
    order: 4,
    widgets: [
      {
        title: "countinspectionPanding",
        permission: 3202,
        canView: false,
        checked: false,
        order: 1,
        type: "oneWidget",
        props: {
          api: "GetCountinspection?status=null",
          apiDetails: "",
          route: "DashBoardCounterLog",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false
        }
      }, {
        title: "countinspectionReject",
        permission: 3201,
        canView: false,
        checked: false,
        order: 2,
        type: "oneWidget",
        props: {
          api: "GetCountinspection?status=false",
          apiDetails: "",
          route: "DashBoardCounterLog",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false
        }
      },
      {
        title: "countinspectionApproved",
        permission: 3200,
        canView: false,
        checked: false,
        order: 3,
        type: "oneWidget",
        props: {
          api: "GetCountinspection?status=true",
          apiDetails: "",
          route: "DashBoardCounterLog",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false
        }
      }
    ]
  },
  {
    widgetCategory: "respondTime",
    refrence: 1,
    canView: false,
    checked: false,
    order: 5,
    widgets: [
      {
        title: "avgRespondTimeLetters",
        permission: 3514,
        canView: false,
        checked: false,
        order: 1,
        type: "oneWidget",
        props: {
          api: "GetAvgTimeRespond?isMonthly=false&docType=19",
          apiDetails: "",
          route: "",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false,
        }
      }, {
        title: "avgRespondTimeTransmittals",
        permission: 3515,
        canView: false,
        checked: false,
        order: 2,
        type: "oneWidget",
        props: {
          api: "GetAvgTimeRespond?isMonthly=false&docType=28",
          apiDetails: "",
          route: "",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false,
        }
      },
      {
        title: "avgRespondTimeIR",
        permission: 10044,
        canView: false,
        checked: false,
        order: 3,
        type: "oneWidget",
        props: {
          api: "GetAvgTimeRespond?isMonthly=false&docType=25",
          apiDetails: "",
          route: "",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false
        }
      },
      {
        title: "avgRespondTimeMIR",
        permission: 3485,
        canView: false,
        checked: false,
        order: 4,
        type: "oneWidget",
        props: {
          api: "GetAvgTimeRespond?isMonthly=false&docType=103",
          apiDetails: "",
          route: "",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false
        }
      },
      {
        title: "avgRespondTimeRFI",
        permission: 10045,
        canView: false,
        checked: false,
        order: 5,
        type: "oneWidget",
        props: {
          api: "GetAvgTimeRespond?isMonthly=false&docType=23",
          apiDetails: "",
          route: "",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false
        }
      },
      {
        title: "avgRespondTimeSubmittals",
        permission: 10046,
        canView: false,
        checked: false,
        order: 6,
        type: "oneWidget",
        props: {
          api: "GetAvgTimeRespond?isMonthly=false&docType=42",
          apiDetails: "",
          route: "",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false
        }
      },
      {
        title: "avgRespondTimePO",
        permission: 10047,
        canView: false,
        checked: false,
        order: 7,
        type: "oneWidget",
        props: {
          api: "GetAvgTimeRespond?isMonthly=false&docType=70",
          apiDetails: "",
          route: "",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false,
        }
      }
    ]
  },
  {
    widgetCategory: "qualityControl",
    refrence: 1,
    canView: false,
    checked: false,
    order: 6,
    widgets: [
      {
        title: "materialRequestcount",
        permission: 3343,
        canView: false,
        checked: false,
        order: 1,
        type: "oneWidget",
        props: {
          api: "GetMaterialRequestCounting",
          apiDetails: "",
          route: "",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false,
        }
      }, {
        title: "inspectionRequestCount",
        permission: 0,
        canView: false,
        checked: false,
        order: 2,
        type: "oneWidget",
        props: {
          api: "GetInspectionRequestForCountingCustomLog",
          apiDetails: "InspectionRequestDetailsFilter",
          route: "DashBoardCounterLog",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false,
        }
      }, {
        title: "NCRCount",
        permission: 0,
        canView: false,
        checked: false,
        order: 3,
        type: "oneWidget",
        props: {
          api: "GetCommunicationNCRCountingForCustomLog",
          apiDetails: "",
          route: "",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false,
        }
      }, {
        title: "siteInstructionsCount",
        permission: 0,
        canView: false,
        checked: false,
        order: 4,
        type: "oneWidget",
        props: {
          api: "GetLogsSiteInstructionsCountingForCustomLog",
          apiDetails: "",
          route: "",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false,
        }
      }
    ]
  },
  {
    widgetCategory: "po",
    refrence: 1,
    canView: false,
    checked: false,
    order: 7,
    widgets: [
      {
        title: "InvoicesForPOCount",
        permission: 0,
        canView: false,
        checked: false,
        order: 1,
        type: "oneWidget",
        props: {
          api: "GetInvoicesForPoCountingForCustomLog",
          apiDetails: "",
          route: "",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false,
        }
      }, {
        title: "projectInventory",
        permission: 0,
        canView: false,
        checked: false,
        order: 2,
        type: "oneWidget",
        props: {
          api: "SelectAllMaterialInventoryCount",
          apiDetails: "",
          route: "",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false,
        }
      }
    ]
  },
  {
    widgetCategory: "bar",
    refrence: 2,
    canView: false,
    checked: false,
    order: 1,
    widgets: [
      {
        checked: false,
        permission: 0,
        order: 1,
        title: 'completedActivitiesCommulative',
        props: {
          'api': 'GetTopFiveCompletedActivities',
          'name': 'projectName',
          'data': 'percentage'
        },
        type: 'column',
        stack: 'normal',
        yTitle: 'total',
        catagName: 'projectName',
        multiSeries: 'no',
        barContent: []
      },
      {
        checked: false,
        permission: 0,
        order: 2,
        title: 'completedActivitiesThisMonth',
        props: {
          'api': 'GetTopFiveMonthlyCompletedActivities',
          'name': 'projectName',
          'data': 'percentage'
        },
        type: 'column',
        stack: 'normal',
        yTitle: 'total',
        catagName: 'projectName',
        multiSeries: 'no',
        barContent: []
      },
      {
        id: 'wt-Name7',
        checked: false,
        permission: 0,
        order: 3,
        title: 'percentOfMaterialRequestPerProject',
        props: {
          'api': 'GetTopFiveRequests',
          'name': 'projectName',
          'data': 'percentage'
        },
        type: 'column',
        stack: 'normal',
        yTitle: 'total',
        catagName: 'projectName',
        multiSeries: 'no',
        barContent: []
      },
      {
        id: 'wt-Name09',
        checked: false,
        permission: 0,
        order: 4,
        title: 'percentOfRejectedSubmittalPerProject',
        props: {
          'api': 'GetTopFiveApprovedSubmittal?status=false',
          'name': 'projectName',
          'data': 'percentage'
        },
        type: 'column',
        stack: 'normal',
        yTitle: 'total',
        catagName: 'projectName',
        multiSeries: 'no',
        barContent: []
      },
      {
        checked: false,
        permission: 0,
        order: 5,
        title: 'rejectedInspectionRequest',
        props: {
          'api': 'GetStatusIspectionRequest?status=false',
          'name': 'projectName',
          'data': 'percentage'
        },
        type: 'column',
        stack: 'normal',
        yTitle: 'sum',
        catagName: 'projectName',
        multiSeries: 'no',
        barContent: []
      },
      {
        checked: false,
        permission: 0,
        order: 6,
        title: 'pendingItemInWorkFlow',
        props: {
          'api': 'GetPendingItemInWorkFlowTopFive',
          'name': 'docName',
          'data': 'count'
        },
        type: 'column',
        stack: 'normal',
        yTitle: 'total',
        catagName: 'docName',
        multiSeries: 'no',
        barContent: []
      },
      {
        checked: false,
        permission: 0,
        order: 7,
        title: 'contractsSummaryAllProjectProject',
        props: {
          'api': 'GetTopFiveContractsForAllProjects' 
        },
        type: 'column',
        stack: '',
        yTitle: 'total',
        catagName: 'projectName',
        multiSeries: 'yes',
        barContent: [{ name: 'Contracts Under Review', value: 'countUnderContract' }, { name: 'Contracted', value: 'countContract' }]
      }
    ]
  },
  {
    widgetCategory: "pie",
    refrence: 2,
    canView: true,
    checked: true,
    order: 2,
    widgets: []
  },
  {
    widgetCategory: "line",
    refrence: 2,
    canView: false,
    checked: false,
    order: 3,
    widgets: []
  }
];


export default widgets;
