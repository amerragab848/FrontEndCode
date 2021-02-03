let ThreeWidgetsData = [
    {
        id: "wt-AssessmentSummary-1",
        title: "assessmentSummary",
        key: "0-101-1001",
        props: {
            class: "red",
            api: "GetAssessmentSummary",
            apiDetails: "",
            route: ["TimeSheetDetails", "DocApprovalDetails?action=", "PendingExpensesDetails"],
            value: "total",
            listType: "item",
            action: "action",
            isModal: false
        },
        order: 0,
        permission: 1369
    },
    {
        id: "wt-InboxSummary-2",
        title: "inboxSummary",
        key: "0-101-1002",
        props: {
            class: "red",
            api: "GetInboxSummary",
            apiDetails: "",
            route: ["DistributionInboxListSummaryDetails?id=0&action="],
            value: "total",
            listType: "item",
            action: "action",
            isModal: false
        },
        order: 1,
        permission: 1367
    },
    {
        id: "wt-ClosedSummary-3",
        title: "closedSummary",
        key: "0-101-1003",
        props: {
            class: "red",
            api: "GetClosedDocumentsSummaryCount",
            apiDetails: "SelectDocTypeByProjectIdClosedByAction?action=",
            route: ["ClosedSummaryDetails?action="],
            value: "total",
            listType: "item",
            action: "action",
            isModal: true
        },
        order: 2,
        permission: 1365
    },
    {
        id: "wt-DistributionSummary-4",
        title: "distributionSummary",
        key: "0-101-1004",
        props: {
            class: "red",
            api: "GetDistributionInboxSummary",
            apiDetails: "",
            route: ["DistributionInboxListSummaryDetails?id=1&action="],
            value: "total",
            listType: "item",
            action: "action",
            isModal: false
        },
        order: 3,
        permission: 1366
    },
    {
        id: "wt-ActionBySummary-5",
        title: "actionBySummary",
        key: "0-101-1005",
        props: {
            class: "red",
            api: "GetActionByCount",
            apiDetails: "GetActionsBySummaryDetails?action=",
            route: ["ActionBySummaryDetails?action="],
            value: "total",
            listType: "item",
            action: "action",
            isModal: false
        },
        order: 4,
        permission: 1371
    },
    {
        id: "wt-NotCodedExpensesSummary-6",
        title: "notCodedExpensesSummary",
        key: "0-101-1006",
        props: {
            class: "red",
            api: "GetNotCodedExpensesSummary",
            apiDetails: "GetNotCodedExpensesSummaryDetail?action=",
            route: ["NotCodedExpensesSummaryDetails?action="],
            value: "total",
            listType: "item",
            action: "action",
            isModal: true
        },
        order: 5,
        permission: 1368
    },
    {
        id: "wt-RejecerdItem-7",
        title: "rejecerdItem",
        key: "0-102-1007",
        props: {
            class: "red",
            api: "GetWorkFlowSummary",
            apiDetails: "",
            route: ["DocApprovalDetails?action=", "DocNotifyLogDetails"],
            value: "total",
            listType: "item",
            action: "action",
            isModal: false
        },
        order: 6,
        permission: 1369
    },
    {
        id: "wt-NotCodedPayment-8",
        title: "notCodedPayment",
        key: "0-102-1008",
        props: {
            class: "red",
            api: "GetNotCodedPaymentsSummary",
            apiDetails: "GetPaymentUserByRange?action=",
            route: ["NotCodedPaymentDetails?action="],
            value: "total",
            listType: "item",
            action: "action",
            isModal: true
        },
        order: 7,
        permission: 1370
    },
    {
        id: "wt-OpenedSummary-9",
        title: "openedSummary",
        key: "0-102-1009",
        props: {
            class: "red",
            api: "GetOppenedDocumentsSummaryCount",
            apiDetails: "SelectDocTypeByProjectIdOpened?action=",
            route: ["OpenedSummaryDetails?action="],
            value: "total",
            listType: "item",
            action: "action",
            isModal: true
        },
        order: 8,
        permission: 1372
    },
    {
        id: "wt-SchedualActionBy-10",
        title: "schedualActionBy",
        key: "0-102-1010",
        props: {
            class: "red",
            api: "GetActionByScheduleCount",
            apiDetails: "GetActionsByScheduleSummaryDetails?action=",
            route: ["SchedualActionByDetails?action="],
            value: "total",
            listType: "item",
            action: "action",
            isModal: true
        },
        order: 9,
        permission: 1373
    },
    {
        id: "wt-ScheduleAlertsSummary-11",
        title: "ScheduleAlertsSummary",
        key: "0-102-1011",
        props: {
            class: "red",
            api: "GetScheduleAlertSummaryCount",
            apiDetails: "GetScheduleAlertSummary?action=",
            route: ["ScheduleAlertsSummaryDetails?action="],
            value: "total",
            listType: "item",
            action: "action",
            isModal: true
        },
        order: 10,
        permission: 1374
    },
    {
        id: "wt-AlertingQntySummary-12",
        title: "alertingQntySummary",
        key: "0-102-1012",
        props: {
            class: "red",
            api: "GetBoqQuantityRequestedAlert",
            apiDetails: "GetBoqQuantityRequestedAlertDetails",
            route: ["AlertingQuantitySummaryDetails?action="],
            value: "total",
            listType: "item",
            action: "action",
            isModal: true
        },
        order: 11,
        permission: 1362
    },
    {
        id: "wt-NotCodedInvoicesSummary-13",
        title: "notCodedInvoicesSummary",
        key: "0-102-1013",
        props: {
            class: "red",
            api: "GetNotCodedInvoicesSummary",
            apiDetails: "GetInvoicesUserByRange?action=",
            route: ["NotCodedInvoicesSummaryDetails?action="],
            value: "total",
            listType: "item",
            action: "action",
            isModal: false
        },
        order: 12,
        permission: 1369
    },
    {
        id: "wt-usersAlertSummary-14",
        title: "usersAlertSummary",
        key: "0-101-1005",
        props: {
            class: "red",
            api: "GetusersAlertSummaryCount",
            apiDetails: "GetusersAlertSummaryDetails?action=",
            route: ["usersAlertSummaryDetails?action="],
            value: "total",
            listType: "item",
            action: "action",
            isModal: false
        },
        order: 13,
        permission: 1371
    }
];

export default ThreeWidgetsData;
