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
        permission: 0,
        key: "0-1-1",
        canView: false,
        order: 1,
        type: "oneWidget",
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
        checked: false
      },
      {
        title: "docApproval",
        permission: 0,
        key: "0-1-2",
        canView: false,
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
          key: "0-1-2"
        },
        checked: false
      },
      {
        title: "pendingExpenses",
        permission: 0,
        key: "0-1-3",
        canView: false,
        checked: false,
        order: 3,
        type: "oneWidget",
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
        permission: 0,
        key: "0-1-4",
        canView: false,
        checked: false,
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
          key: "0-1-4"
        }
      },
      {
        title: "docNotify",
        permission: 0,
        key: "0-1-5",
        canView: false,
        checked: false,
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
          key: "0-1-5"
        }
      },
      {
        title: "workFlowAlert",
        permission: 0,
        key: "0-1-6",
        canView: false,
        checked: false,
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
          key: "0-1-6"
        }
      },
      {
        title: "monitorTasks",
        permission: 0,
        key: "0-1-7",
        canView: false,
        checked: false,
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
          key: "0-1-7"
        }
      },
      {
        title: "monthlyTasks",
        permission: 0,
        key: "0-1-8",
        canView: false,
        checked: false,
        order: 8,
        type: "oneWidget",
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
        permission: 0,
        key: "0-1-9",
        canView: false,
        checked: false,
        order: 9,
        type: "oneWidget",
        props: {
          api: "SelectByAccountIdCount",
          apiDetails: "",
          route: "FollowUpsSummaryDetails",
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
    checked: false,
    order: 2,
    widgets: [
      {
        title: "alertingQntySummary",
        permission: 0,
        key: "0-2-1",
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
          key: "0-2-1"
        },
      },
      {
        title: "closedSummary",
        permission: 0,
        key: "0-2-2",
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
          key: "0-2-2"
        }
      },
      {
        title: "distributionInboxSummary",
        permission: 0,
        key: "0-2-3",
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
          key: "0-2-3"
        }
      },
      {
        title: "inboxSummary",
        permission: 0,
        key: "0-2-4",
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
          key: "0-2-4"
        }
      },
      {
        title: "notCodedExpensesSummary",
        permission: 0,
        key: "0-2-5",
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
          key: "0-2-5"
        }
      },
      {
        title: "notCodedInvoicesSummary",
        permission: 0,
        key: "0-2-6",
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
          key: "0-2-6"
        }
      },
      {
        title: "notCodedPayment",
        permission: 0,
        key: "0-2-7",
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
          key: "0-2-7"
        }
      },
      {
        title: "actionBySummary",
        permission: 0,
        key: "0-2-8",
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
          key: "0-2-8"
        }
      },
      {
        title: "openedSummary",
        permission: 0,
        key: "0-2-9",
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
          key: "0-2-9"
        }
      },
      {
        title: "schedualActionBy",
        permission: 0,
        key: "0-2-10",
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
          key: "0-2-10"
        }
      },
      {
        title: "ScheduleAlertsSummary",
        permission: 0,
        key: "0-2-11",
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
          key: "0-2-11"
        }
      }
    ]
  },
  {
    widgetCategory: "reportChart",
    refrence: 0,
    key: "0-3",
    canView: false,
    checked: false,
    order: 3,
    widgets: [
      {
        id: 'wt-Name01',
        checked: false,
        permission: 1377,
        key: "0-3-1",
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
        key: "0-3-2",
        checked: false,
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
        key: "0-3-3",
        checked: false,
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
        key: "0-3-4",
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
        key: "0-3-5",
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
        key: "0-3-6",
        permission: 10042,
        checked: false,
        title: 'letterStatusYearly',
        order: 6,
        props: {
          'api': 'GetChartLineDataByDocType?docType=17'
        },
        topicNames: ['Opened', 'Closed'],
        type: 'line'
      }, {
        id: 'wt-Name7',
        key: "0-3-7",
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
        key: "0-3-8",
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
        key: "0-3-9",
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
        id: 'wt-Name10',
        key: "0-3-10",
        checked: false,
        permission: 10043,
        order: 10,
        title: 'countinspectionApproved',
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
        id: 'wt-Name11',
        key: "0-3-11",
        checked: false,
        permission: 3505,
        order: 11,
        title: 'contractsPerProject',
        props: {
          'api': 'GetTopFiveContracts',
          'name': 'docName',
          'data': 'count'
        },
        type: 'column',
        stack: '',
        yTitle: 'total',
        catagName: 'projectName',
        multiSeries: 'yes',
        barContent: [{ name: 'Contracted', value: 'percentageContract' }, { name: 'Contracts Under Review', value: 'countUnderContract' }]

      }, {
        id: 'wt-Name12',
        key: "0-3-12",
        checked: false,
        title: 'budgetVariance',
        permission: 3509,
        order: 12,
        props: {
          'api': 'GetTopFiveBudgetVariance',
          'name': 'projectName',
          'data': 'total'
        },
        type: 'column',
        stack: '',
        yTitle: 'total',
        catagName: 'expenseTypeName',
        multiSeries: 'yes',
        barContent: [{ name: 'Actual Total', value: 'actual' }, { name: 'Budget Expenses', value: 'budgetedExpenseValue' }]
      }, {
        id: 'wt-Name13',
        key: "0-3-13",
        checked: false,
        permission: 10040,
        order: 13,
        title: 'transmittalStatusYearly',
        props: {
          'api': 'GetChartLineDataByDocType?docType=28'
        },
        topicNames: ['Opened', 'Closed'],
        type: 'line'
      }
    ]
  },
  {
    widgetCategory: "counters",
    refrence: 1,
    key: "1-1",
    canView: false,
    checked: false,
    order: 1,
    widgets: [
      {
        title: "monthlyPo",
        permission: 0,
        key: "1-1-1",
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
          key: "1-1-1"
        }
      },
      {
        title: "materialRequestcount",
        permission: 3343,
        key: "1-1-2",
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
          key: "1-1-2"
        }
      },
      {
        title: "rejectedTimeSheet",
        permission: 0,
        key: "1-1-3",
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
          key: "1-1-3"
        }
      },
      {
        title: "monthlyPaymentRequisitions",
        permission: 0,
        key: "1-1-4",
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
    checked: false,
    order: 2,
    widgets: [
      {
        title: "approvalSubmittals",
        permission: 3493,
        key: "1-2-1",
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
          isModal: false,
          key: "1-2-1"
        }
      }, {
        title: "openedSubmittals",
        permission: 3510,
        key: "1-2-2",
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
          isModal: false,
          key: "1-2-2"
        }
      },
      {
        title: "rejectedSubmittals",
        permission: 3494,
        key: "1-2-3",
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
    checked: false,
    order: 3,
    widgets: [
      {
        title: "openedLetters",
        permission: 3512,
        key: "1-3-1",
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
          key: "1-3-1"
        }
      }, {
        title: "openedIR",
        permission: 3513,
        key: "1-3-2",
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
          key: "1-3-2"
        }
      },
      {
        title: "rfiOpen",
        permission: 3495,
        key: "1-3-3",
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
          key: "1-3-3"
        }
      },
      {
        title: "openedTransmittals",
        permission: 3511,
        key: "1-3-4",
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
    checked: false,
    order: 4,
    widgets: [
      {
        title: "countinspectionPanding",
        permission: 3202,
        key: "1-4-1",
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
          isModal: false,
          key: "1-4-1"
        }
      }, {
        title: "countinspectionReject",
        permission: 3201,
        key: "1-4-2",
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
          isModal: false,
          key: "1-4-2"
        }
      },
      {
        title: "countinspectionApproved",
        permission: 3200,
        key: "1-4-3",
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
          isModal: false,
          key: "1-4-3"
        }
      }
    ]
  },
  {
    widgetCategory: "respondTime",
    refrence: 1,
    key: "1-5",
    canView: false,
    checked: false,
    order: 5,
    widgets: [
      {
        title: "avgRespondTimeLetters",
        permission: 3514,
        key: "1-5-1",
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
          key: "1-5-1"
        }
      }, {
        title: "avgRespondTimeTransmittals",
        permission: 3515,
        key: "1-5-2",
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
          key: "1-5-2"
        }
      },
      {
        title: "avgRespondTimeIR",
        permission: 3514,
        key: "1-5-3",
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
          isModal: false,
          key: "1-5-3"
        }
      },
      {
        title: "avgRespondTimeMIR",
        permission: 3515,
        key: "1-5-4",
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
          isModal: false,
          key: "1-5-4"
        }
      },
      {
        title: "avgRespondTimeRFI",
        permission: 3515,
        key: "1-5-5",
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
          isModal: false,
          key: "1-5-5"
        }
      },
      {
        title: "avgRespondTimeSubmittals",
        permission: 3515,
        key: "1-5-6",
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
          isModal: false,
          key: "1-5-6"
        }
      },
      {
        title: "avgRespondTimePO",
        permission: 3515,
        key: "1-5-7",
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
          key: "1-5-7"
        }
      }
    ]
  },
  {
    widgetCategory: "qualityControl",
    refrence: 1,
    key: "1-6",
    canView: false,
    checked: false,
    order: 6,
    widgets: [
      {
        title: "materialRequestcount",
        permission: 3343,
        key: "1-6-1",
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
          key: "1-6-1"
        }
      }, {
        title: "inspectionRequestCount",
        permission: 0,
        key: "1-6-2",
        canView: false,
        checked: false,
        order: 2,
        type: "oneWidget",
        props: {
          api: "GetInspectionRequestForCountingCustomLog",
          apiDetails: "",
          route: "",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false,
          key: "1-6-2"
        }
      }, {
        title: "NCRCount",
        permission: 0,
        key: "1-6-3",
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
          key: "1-6-3"
        }
      }, {
        title: "siteInstructionsCount",
        permission: 0,
        key: "1-6-4",
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
          key: "1-6-4"
        }
      }
    ]
  },
  {
    widgetCategory: "po",
    refrence: 1,
    key: "1-7",
    canView: false,
    checked: false,
    order: 7,
    widgets: [
      {
        title: "InvoicesForPOCount",
        permission: 0,
        key: "1-7-1",
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
          key: "1-7-1"
        }
      }, {
        title: "projectInventory",
        permission: 0,
        key: "1-7-2",
        canView: false,
        checked: false,
        order: 2,
        type: "oneWidget",
        props: {
          api: "selectAllMaterialInventoryCount",
          apiDetails: "",
          route: "",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false,
          key: "1-7-2"
        }
      }
    ]
  },
  {
    widgetCategory: "bar",
    refrence: 2,
    key: "2-1",
    canView: false,
    checked: false,
    order: 1,
    widgets: [
      {
        key: "2-1-1",
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
        key: "2-1-2",
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
        key: "2-1-3",
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
        key: "2-1-4",
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
        key: "2-1-5",
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
        key: "2-1-6",
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
        key: "2-1-7",
        checked: false,
        permission: 0,
        order: 7,
        title: 'contractsSummaryAllProjectProject',
        props: {
          'api': 'GetTopFiveContractsForAllProjects',
          'name': 'docName',
          'data': 'count'
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
    key: "2-2",
    canView: false,
    checked: false,
    order: 2,
    widgets: []
  },
  {
    widgetCategory: "line",
    refrence: 2,
    key: "2-3",
    canView: false,
    checked: false,
    order: 3,
    widgets: []
  }
];


export default widgets;