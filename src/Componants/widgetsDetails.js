let widgets = {
    "timesheetLog": {
        "title": "timesheetLog",
        "props": {
            "permission": 0,
            "type": "oneWidget",
            "api": "GetTimeSheetSummary",
            "route": "TimeSheetDetails",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "0-1-1"
        }
    },
    "docApproval": {
        "title": "docApproval",
        "props": {
            "permission": 0,
            "type": "oneWidget",
            "api": "GetDocumentApprovalSummary",
            "route": "DocApprovalDetails?action=2",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "0-1-2"
        }
    },
    "pendingExpenses": {
        "title": "pendingExpenses",
        "props": {
            "permission": 0,
            "type": "oneWidget",
            "api": "GetPendingExpensesSummary",
            "route": "PendingExpensesDetails",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "0-1-3"
        }
    },
    "docRejected": {
        "title": "docRejected",
        "props": {
            "permission": 0,
            "type": "oneWidget",
            "api": "GetDocumentRejectedSummary",
            "route": "DocApprovalDetails?action=1",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "0-1-4"
        }
    },
    "docNotify": {
        "title": "docNotify",
        "props": {
            "permission": 0,
            "type": "oneWidget",
            "api": "GetDocumentNotifySummary",
            "route": "DocNotifyLogDetails",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "0-1-5"
        }
    },
    "workFlowAlert": {
        "title": "workFlowAlert",
        "props": {
            "permission": 0,
            "type": "oneWidget",
            "api": "GetWorkFlowAlertCount",
            "route": "workFlowAlerts",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "0-1-6"
        }
    },
    "monitorTasks": {
        "title": "monitorTasks",
        "props": {
            "permission": 0,
            "type": "oneWidget",
            "api": "GetCountMonitorTasks",
            "route": "MonitorTasks",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "0-1-7"
        }
    },
    "monthlyTasks": {
        "title": "monthlyTasks",
        "props": {
            "permission": 0,
            "type": "oneWidget",
            "api": "GetCounMonthlyTasks",
            "route": "MonthlyTasksDetails",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "0-1-8"
        }
    },
    "followUpsSummary": {
        "title": "followUpsSummary",
        "props": {
            "permission": 0,
            "type": "oneWidget",
            "api": "SelectByAccountIdCount",
            "route": "FollowUpsSummaryDetails",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "0-1-9"
        }
    },
    "alertingQntySummary": {
        "title": "alertingQntySummary",
        "props": {
            "permission": 0,
            "type": "threeWidget",
            "api": "GetBoqQuantityRequestedAlert",
            "apiDetails": "GetBoqQuantityRequestedAlertDetails",
            "route": "AlertingQuantitySummaryDetails?action=",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "0-2-1"
        }
    },
    "closedSummary": {
        "title": "closedSummary",
        "props": {
            "permission": 0,
            "type": "threeWidget",
            "api": "GetClosedDocumentsSummaryCount",
            "apiDetails": "SelectDocTypeByProjectIdClosedByAction?action=",
            "route": "ClosedSummaryDetails?action=",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "0-2-2"
        }
    },
    "distributionInboxSummary": {
        "title": "distributionInboxSummary",
        "props": {
            "permission": 0,
            "type": "threeWidget",
            "api": "GetDistributionInboxSummary",
            "apiDetails": "",
            "route": "DistributionInboxListSummaryDetails?id=1&action=",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "0-2-3"
        }
    },
    "inboxSummary": {
        "title": "inboxSummary",
        "props": {
            "permission": 0,
            "type": "threeWidget",
            "api": "GetInboxSummary",
            "apiDetails": "",
            "route": "DistributionInboxListSummaryDetails?id=0&action=",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "0-2-4"
        }
    },
    "notCodedExpensesSummary": {
        "title": "notCodedExpensesSummary",
        "props": {
            "permission": 0,
            "type": "threeWidget",
            "api": "GetNotCodedExpensesSummary",
            "apiDetails": "GetNotCodedExpensesSummaryDetail?action=",
            "route": "NotCodedExpensesSummaryDetails?action=",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "0-2-5"
        }
    },
    "notCodedInvoicesSummary": {
        "title": "notCodedInvoicesSummary",
        "props": {
            "permission": 0,
            "type": "threeWidget",
            "api": "GetNotCodedInvoicesSummary",
            "apiDetails": "GetInvoicesUserByRange?action=",
            "route": "NotCodedInvoicesSummaryDetails?action=",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "0-2-6"
        }
    },
    "notCodedPayment": {
        "title": "notCodedPayment",
        "props": {
            "permission": 0,
            "type": "threeWidget",
            "api": "GetNotCodedPaymentsSummary",
            "apiDetails": "GetPaymentUserByRange?action=",
            "route": "NotCodedPaymentDetails?action=",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "0-2-7"
        }
    },
    "actionBySummary": {
        "title": "actionBySummary",
        "props": {
            "permission": 0,
            "type": "threeWidget",
            "api": "GetActionByCount",
            "apiDetails": "GetActionsBySummaryDetails?action=",
            "route": "ActionBySummaryDetails?action=",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "0-2-8"
        }
    },
    "openedSummary": {
        "title": "openedSummary",
        "props": {
            "permission": 0,
            "type": "threeWidget",
            "api": "GetOppenedDocumentsSummaryCount",
            "apiDetails": "SelectDocTypeByProjectIdOpened?action=",
            "route": "OpenedSummaryDetails?action=",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "0-2-9"
        }
    },
    "schedualActionBy": {
        "title": "schedualActionBy",
        "props": {
            "permission": 0,
            "type": "threeWidget",
            "api": "GetActionByScheduleCount",
            "apiDetails": "GetActionsByScheduleSummaryDetails?action=",
            "route": "SchedualActionByDetails?action=",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "0-2-10"
        }
    },
    "ScheduleAlertsSummary": {
        "title": "ScheduleAlertsSummary",
        "props": {
            "permission": 0,
            "type": "threeWidget",
            "api": "GetScheduleAlertSummaryCount",
            "apiDetails": "GetScheduleAlertSummary?action=",
            "route": "ScheduleAlertsSummaryDetails?action=",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "0-2-11"
        }
    },
    "projectStatus": {
        "title": "projectStatus",
        "props": {
            "id": 'wt-Name01',
            "permission": 1377,
            "type": "pie",
            "seriesName": "projectStatus",
            "api": "GetProjectsStatusSummaryCount",
            "name": "item",
            "y": "total",
            "key": "0-3-1",
        }
    },
    "percentageExpensesTypesOfTotal": {
        "title": "percentageExpensesTypesOfTotal",
        "props": {
            "id": 'wt-Name02',
            "permission": 3500,
            "type": "pie",
            "seriesName": "expensesAllProject",
            "api": "GetPercentageExpensesType",
            "name": "projectName",
            "y": "total",
            "key": "0-3-2",
        }
    },
    "expensesAllProject": {
        "title": "expensesAllProject",
        "props": {
            "id": 'wt-Name03',
            "permission": 3507,
            "type": "pie",
            "seriesName": "expensesAllProject",
            "api": "GetExpensesByTypeForAllProjects",
            "name": "expenseTypeName",
            "y": "total",
            "key": "0-3-3"
        }
    },
    "riskStatusYearly": {
        "title": "riskStatusYearly",
        "props": {
            "id": 'wt-Name04',
            "permission": 10041,
            "type": "line",
            "api": "GetRiskDataChartLine",
            "topicNames": ["Opened", "Closed"],
            "key": "0-3-4"
        }
    },
    "percentOfApprovedSubmittalPerProject": {
        "title": "percentOfApprovedSubmittalPerProject",
        "props": {
            "id": 'wt-Name05',
            "permission": 3498,
            "type": "column",
            "api": "GetTopFiveApprovedSubmittal?status=true",
            "name": "projectName",
            "data": "percentage",
            "stack": "normal",
            "yTitle": "total",
            "catagName": "projectName",
            "multiSeries": "no",
            "barContent": [],
            "key": "0-3-5"
        }
    },
    "letterStatusYearly": {
        "title": "letterStatusYearly",
        "props": {
            "id": 'wt-Name6',
            "permission": 10042,
            "type": "line",
            "api": "GetChartLineDataByDocType?docType=17",
            "topicNames": ["Opened", "Closed"],
            "key": "0-3-6"
        }
    },
    "percentOfMaterialRequestPerProject": {
        "title": "percentOfMaterialRequestPerProject",
        "props": {
            "id": 'wt-Name7',
            "permission": 3497,
            "type": "column",
            "api": "GetTopFiveRequests",
            "name": "projectName",
            "data": "percentage",
            "stack": "normal",
            "yTitle": "total",
            "catagName": "projectName",
            "multiSeries": "no",
            "barContent": [],
            "key": "0-3-7"
        }
    },
    "submittalStatusYearly": {
        "title": "submittalStatusYearly",
        "props": {
            "id": 'wt-Name8',
            "permission": 10039,
            "type": "line",
            "api": "GetChartLineDataByDocType?docType=42",
            "topicNames": ["Opened", "Closed"],
            "key": "0-3-8"
        }
    },
    "percentOfRejectedSubmittalPerProject": {
        "title": "percentOfRejectedSubmittalPerProject",
        "props": {
            "id": 'wt-Name09',
            "permission": 3499,
            "type": "column",
            "api": "GetTopFiveApprovedSubmittal?status=false",
            "name": "projectName",
            "data": "percentage",
            "stack": "normal",
            "yTitle": "total",
            "catagName": "projectName",
            "multiSeries": "no",
            "barContent": [],
            "key": "0-3-9"
        }
    },
    "countinspectionApprovedChar": {
        "title": "countinspectionApprovedChar",
        "props": {
            "id": 'wt-Name10',
            "permission": 10043,
            "type": "column",
            "api": "GetStatusIspectionRequest?status=true",
            "name": 'projectName',
            "data": 'percentage',
            "stack": 'normal',
            "yTitle": 'sum',
            "catagName": 'projectName',
            "multiSeries": 'no',
            "barContent": [],
            "key": "0-3-10"
        }
    },
    "contractsPerProject": {
        "title": "contractsPerProject",
        "props": {
            "id": 'wt-Name11',
            "permission": 3505,
            "key": "0-3-11",
            "type": "column",
            "api": "GetTopFiveContracts",
            "name": "docName",
            "data": "count",
            "stack": "",
            "yTitle": "total",
            "catagName": "projectName",
            "multiSeries": "yes",
            "barContent": [{ name: 'Contracted', value: 'percentageContract' }, { name: 'Contracts Under Review', value: 'countUnderContract' }]
        }
    },
    "budgetVariance": {
        "title": "budgetVariance",
        "props": {
            "id": 'wt-Name12',
            "permission": 3509,
            "type": "column",
            "api": "GetTopFiveBudgetVariance",
            "name": "projectName",
            "data": "total",
            "stack": "",
            "yTitle": "total",
            "catagName": "expenseTypeName",
            "multiSeries": "yes",
            "barContent": [{ "name": "Actual Total", "value": "actual" }, { "name": "Budget Expenses", "value": "budgetedExpenseValue" }],
            "key": "0-3-12"
        }
    },
    "transmittalStatusYearly": {
        "title": "transmittalStatusYearly",
        "props": {
            "id": 'wt-Name13',
            "permission": 10040,
            "type": "line",
            "api": "GetChartLineDataByDocType?docType=28",
            "topicNames": ["Opened", "Closed"],
            "key": "0-3-13"
        }
    },
    "riskStatus": {
        "title": "riskStatus",
        "props": {
            "id": "wt-riskStatus01",
            "permission": 1377,
            "type": "pie",
            "seriesName": "riskStatus",
            "api": "RiskByStatus",
            "key": "0-4-1",
            "name": "item",
            "y": "total"
        }
    },
    "riskPeriority": {
        "title": "riskPeriority",
        "props": {
            "id": 'wt-riskPeriority02',
            "permission": 3500,
            "type": 'pie',
            "seriesName": "riskPeriority",
            "api": 'RiskByPriority',
            "key": "0-4-2",
            "name": 'item',
            "y": 'total'
        }

    },
    "riskType": {
        "title": "riskType",
        "props": {
            "id": "wt-riskType03",
            "permission": 3507,
            "type": "pie",
            "seriesName": "riskType",
            "api": "RiskByRiskType",
            "key": "0-4-3",
            "name": "item",
            "y": "total"
        }

    },
    "monthlyPo": {
        "title": "monthlyPo",
        "props": {
            "permission": 0,
            "type": "oneWidget",
            "api": "GetTotalPo",
            "route": "DashBoardCounterLog",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "1-1-1"
        }
    },
    "materialRequestcount": {
        "title": "materialRequestcount",
        "props": {
            "permission": 3343,
            "type": "oneWidget",
            "api": "GetMaterialRequestCounting",
            "apiDetails": "",
            "route": "DashBoardCounterLog",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "1-1-2"
        }
    },
    "rejectedTimeSheet": {
        "title": "rejectedTimeSheet",
        "props": {
            "permission": 0,
            "type": "oneWidget",
            "api": "GetRejectedTimesheetBySystemCount",
            "route": "RejectedTimesheetsDetails",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "1-1-3"
        }
    },
    "monthlyPaymentRequisitions": {
        "title": "monthlyPaymentRequisitions",
        "props": {
            "permission": 0,
            "type": "oneWidget",
            "api": "GetTotalPayment",
            "route": "DashBoardCounterLog",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "1-1-4"
        }
    },
    "approvalSubmittals": {
        "title": "approvalSubmittals",
        "props": {
            "permission": 3493,
            "type": "twoWidget",
            "api": "GetApprocalStatusCount?status=true",
            "apiDetails": "",
            "route": "DashBoardCounterLog",
            "value": "total-0",
            "total": "total-1",
            "action": "action",
            "key": "1-2-1"
        }
    },
    "openedSubmittals": {
        "title": "openedSubmittals",
        "props": {
            "permission": 3510,
            "type": "twoWidget",
            "api": "getOpenedDocumentsCount?docType=42",
            "apiDetails": "",
            "route": "DashBoardCounterLog",
            "value": "count-0",
            "total": "total-1",
            "action": "action",
            "key": "1-2-2"
        }
    },
    "rejectedSubmittals": {
        "title": "rejectedSubmittals",
        "props": {
            "permission": 3494,
            "type": "twoWidget",
            "api": "GetApprocalStatusCount?status=false",
            "apiDetails": "",
            "route": "DashBoardCounterLog",
            "value": "total-0",
            "total": "total-1",
            "action": "action",
            "key": "1-2-3"
        }
    },
    "openedLetters": {
        "title": "openedLetters",
        "props": {
            "permission": 3512,
            "type": "twoWidget",
            "api": "getOpenedDocumentsCount?docType=19",
            "apiDetails": "",
            "route": "DashBoardCounterLog",
            "value": "count-0",
            "total": "total-1",
            "action": "action",
            "key": "1-3-1"
        }
    },
    "openedIR": {
        "title": "openedIR",
        "props": {
            "permission": 3513,
            "type": "twoWidget",
            "api": "getOpenedDocumentsCount?docType=25",
            "apiDetails": "",
            "route": "DashBoardCounterLog",
            "value": "count-0",
            "total": "total-1",
            "action": "action",
            "key": "1-3-2"
        }
    },
    "rfiOpen": {
        "title": "rfiOpen",
        "props": {
            "permission": 3495,
            "type": "twoWidget",
            "api": "GetRfiOpenCount",
            "apiDetails": "",
            "route": "DashBoardCounterLog",
            "value": "total-0",
            "total": "total-1",
            "action": "action",
            "key": "1-3-3"
        }
    },
    "openedTransmittals": {
        "title": "openedTransmittals",
        "props": {
            "permission": 3511,
            "type": "twoWidget",
            "api": "getOpenedDocumentsCount?docType=28",
            "apiDetails": "",
            "route": "DashBoardCounterLog",
            "value": "count-0",
            "total": "total-1",
            "action": "action",
            "key": "1-3-4"
        }
    },
    "countinspectionPanding": {
        "title": "countinspectionPanding",
        "props": {
            "permission": 3202,
            "type": "oneWidget",
            "api": "GetCountinspection?status=null",
            "apiDetails": "",
            "route": "DashBoardCounterLog",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "1-4-1"
        }
    },
    "countinspectionReject": {
        "title": "countinspectionReject",
        "props": {
            "permission": 3201,
            "type": "oneWidget",
            "api": "GetCountinspection?status=false",
            "apiDetails": "",
            "route": "DashBoardCounterLog",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "1-4-2"
        }
    },
    "countinspectionApproved": {
        "title": "countinspectionApproved",
        "props": {
            "permission": 3200,
            "type": "oneWidget",
            "api": "GetCountinspection?status=true",
            "apiDetails": "",
            "route": "DashBoardCounterLog",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "1-4-3"
        }
    },
    "avgRespondTimeLetters": {
        "title": "avgRespondTimeLetters",
        "props": {
            "permission": 3514,
            "type": "oneWidget",
            "api": "GetAvgTimeRespond?isMonthly=false&docType=19",
            "apiDetails": "",
            "route": "",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "1-5-1"
        }
    },
    "avgRespondTimeTransmittals": {
        "title": "avgRespondTimeTransmittals",
        "props": {
            "permission": 3515,
            "type": "oneWidget",
            "api": "GetAvgTimeRespond?isMonthly=false&docType=28",
            "apiDetails": "",
            "route": "",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "1-5-2"
        }
    },
    "avgRespondTimeIR": {
        "title": "avgRespondTimeIR",
        "props": {
            "permission": 3514,
            "type": "oneWidget",
            "api": "GetAvgTimeRespond?isMonthly=false&docType=25",
            "apiDetails": "",
            "route": "",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "1-5-3"
        }
    },
    "avgRespondTimeMIR": {
        "title": "avgRespondTimeMIR",
        "props": {
            "permission": 3515,
            "type": "oneWidget",
            "api": "GetAvgTimeRespond?isMonthly=false&docType=103",
            "apiDetails": "",
            "route": "",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "1-5-4"
        }
    },
    "avgRespondTimeRFI": {
        "title": "avgRespondTimeRFI",
        "props": {
            "permission": 3515,
            "type": "oneWidget",
            "api": "GetAvgTimeRespond?isMonthly=false&docType=23",
            "apiDetails": "",
            "route": "",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "1-5-5"
        }
    },
    "avgRespondTimeSubmittals": {
        "title": "avgRespondTimeSubmittals",
        "props": {
            "permission": 3515,
            "type": "oneWidget",
            "api": "GetAvgTimeRespond?isMonthly=false&docType=42",
            "apiDetails": "",
            "route": "",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "1-5-6"
        }
    },
    "avgRespondTimePO": {
        "title": "avgRespondTimePO",
        "props": {
            "permission": 3515,
            "type": "oneWidget",
            "api": "GetAvgTimeRespond?isMonthly=false&docType=70",
            "apiDetails": "",
            "route": "",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "1-5-7"
        }
    },
    "materialRequestcount": {
        "title": "materialRequestcount",
        "props": {
            "permission": 3343,
            "type": "oneWidget",
            "api": "GetMaterialRequestCounting",
            "apiDetails": "",
            "route": "",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "1-6-1"
        }
    },
    "inspectionRequestCount": {
        "title": "inspectionRequestCount",
        "props": {
            "permission": 0,
            "type": "oneWidget",
            "api": "GetInspectionRequestForCountingCustomLog",
            "apiDetails": "",
            "route": "",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "1-6-2"
        }
    },
    "NCRCount": {
        "title": "NCRCount",
        "props": {
            "permission": 0,
            "type": "oneWidget",
            "api": "GetCommunicationNCRCountingForCustomLog",
            "apiDetails": "",
            "route": "",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "1-6-3"
        }
    },
    "siteInstructionsCount": {
        "title": "siteInstructionsCount",
        "props": {
            "permission": 0,
            "type": "oneWidget",
            "api": "GetLogsSiteInstructionsCountingForCustomLog",
            "apiDetails": "",
            "route": "",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "1-6-4"
        }
    },
    "InvoicesForPOCount": {
        "title": "InvoicesForPOCount",
        "props": {
            "permission": 0,
            "type": "oneWidget",
            "api": "GetInvoicesForPoCountingForCustomLog",
            "apiDetails": "",
            "route": "",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "1-7-1"
        }
    },
    "projectInventory": {
        "title": "projectInventory",
        "props": {
            "permission": 0,
            "type": "oneWidget",
            "api": "selectAllMaterialInventoryCount",
            "apiDetails": "",
            "route": "",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "1-7-2"
        }
    },
    "completedActivitiesCommulative": {
        "title": "completedActivitiesCommulative",
        "props": {
            "key": "2-1-1",
            "permission": 0,
            "type": "column",
            "api": "GetTopFiveCompletedActivities",
            "name": "projectName",
            "data": "percentage",
            "stack": "normal",
            "yTitle": "total",
            "catagName": "projectName",
            "multiSeries": "no",
            "barContent": []
        }
    },
    "completedActivitiesThisMonth": {
        "title": "completedActivitiesThisMonth",
        "props": {
            "key": "2-1-2",
            "permission": 0,
            "type": "column",
            "api": "GetTopFiveMonthlyCompletedActivities",
            "name": "projectName",
            "data": "percentage",
            "stack": "normal",
            "yTitle": "total",
            "catagName": "projectName",
            "multiSeries": "no",
            "barContent": []
        }
    },
    "percentOfMaterialRequestPerProject": {
        "title": "percentOfMaterialRequestPerProject",
        "props": {
            "id": 'wt-Name7',
            "key": "2-1-3",
            "permission": 0,
            "type": "column",
            "api": "GetTopFiveRequests",
            "name": "projectName",
            "data": "percentage",
            "stack": "normal",
            "yTitle": "total",
            "catagName": "projectName",
            "multiSeries": "no",
            "barContent": []
        }
    },
    "percentOfRejectedSubmittalPerProject": {
        "title": "percentOfRejectedSubmittalPerProject",
        "props": {
            "id": 'wt-Name09',
            "key": "2-1-4",
            "permission": 0,
            "type": "column",
            "api": "GetTopFiveApprovedSubmittal?status=false",
            "name": "projectName",
            "data": "percentage",
            "stack": "normal",
            "yTitle": "total",
            "catagName": "projectName",
            "multiSeries": "no",
            "barContent": []
        }
    },
    "rejectedInspectionRequest": {
        "title": "rejectedInspectionRequest",
        "props": {
            "key": "2-1-5",
            "permission": 0,
            "type": "column",
            "api": "GetStatusIspectionRequest?status=false",
            "name": "projectName",
            "data": "percentage",
            "stack": "normal",
            "yTitle": "sum",
            "catagName": "projectName",
            "multiSeries": "no",
            "barContent": []
        }
    },
    "pendingItemInWorkFlow": {
        "title": "pendingItemInWorkFlow",
        "props": {
            "key": "2-1-6",
            "permission": 0,
            "type": "column",
            "api": "GetPendingItemInWorkFlowTopFive",
            "name": "docName",
            "data": "count",
            "stack": "normal",
            "yTitle": "total",
            "catagName": "docName",
            "multiSeries": "no",
            "barContent": []
        }
    },
    "contractsSummaryAllProjectProject": {
        "title": "contractsSummaryAllProjectProject",
        "props": {
            "key": "2-1-7",
            "permission": 0,
            "type": "column",
            "api": "GetTopFiveContractsForAllProjects",
            "name": "docName",
            "data": "count",
            "stack": "",
            "yTitle": "total",
            "catagName": "projectName",
            "multiSeries": "yes",
            "barContent": [{ name: 'Contracts Under Review', value: 'countUnderContract' }, { name: 'Contracted', value: 'countContract' }]
        }
    }
}

let categories = {
    '1': {
        title: 'mainAlerts',
        type: 1
    },
    '2': {
        title: 'summaries',
        type: 1
    },
    '3': {
        title: 'reportChart',
        type: 1
    },
    '4': {
        title: 'risk',
        type: 1
    },
    '5': {
        title: 'counters',
        type: 2
    },
    '6': {
        title: 'Submittal',
        type: 2
    },
    '7': {
        title: 'communication',
        type: 2
    },
    '8': {
        title: 'inspectionRequest',
        type: 2
    },
    '9': {
        title: 'respondTime',
        type: 2
    },
    '10': {
        title: 'qualityControl',
        type: 2
    },
    '11': {
        title: 'po',
        type: 2
    },
    '12': {
        title: 'bar',
        type: 3
    },
    '13': {
        title: 'pie',
        type: 3
    },
    '14': {
        title: 'line',
        type: 3
    }
};

export default { widgets, categories };
