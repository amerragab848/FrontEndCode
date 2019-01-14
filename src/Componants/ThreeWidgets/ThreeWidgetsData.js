let ThreeWidgetsData = [
    {
        id: "wt-AssessmentSummary-1",
        title: "assessmentSummary",
        props: {
            api: "GetAssessmentSummary",
            apiDetails: "",
            route: "route-to-view",
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
        props: {
            api: "GetInboxSummary",
            apiDetails: "",
            route: "route-to-view",
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
        props: {
            api: "GetClosedDocumentsSummaryCount",
            apiDetails: "SelectDocTypeByProjectIdClosed?action=",
            route: "",
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
        props: {
            api: "GetClosedDocumentsSummaryCount",
            apiDetails: "",
            route: "route-to-view",
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
        props: {
            api: "GetActionByCount",
            apiDetails: "GetActionsBySummaryDetails?action=",
            route: "",
            value: "total",
            listType: "item",
            action: "action",
            isModal: true
        },
        order: 4,
        permission: 1371
    },
    {
        id: "wt-NotCodedExpensesSummary-6",
        title: "notCodedExpensesSummary",
        props: {
            api: "GetNotCodedExpensesSummary",
            apiDetails: "GetNotCodedExpensesSummaryDetail?action=",
            route: "",
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
        props: {
            api: "GetWorkFlowSummary",
            apiDetails: "",
            route: "route-to-view",
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
        props: {
            api: "GetNotCodedPaymentsSummary",
            apiDetails: "GetPaymentUserByRange?action=",
            route: "",
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
        props: {
            api: "GetOppenedDocumentsSummaryCount",
            apiDetails: "SelectDocTypeByProjectIdOpened?action=",
            route: "",
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
        props: {
            api: "GetActionByScheduleCount",
            apiDetails: "GetActionsByScheduleSummaryDetails?action=",
            route: "",
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
        props: {
            api: "GetScheduleAlertSummaryCount",
            apiDetails: "GetScheduleAlertSummary?action=",
            route: "",
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
        props: {
            api: "GetBoqQuantityRequestedAlert",
            apiDetails: "GetBoqQuantityRequestedAlertDetails",
            route: "",
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
        props: {
            api: "GetNotCodedInvoicesSummary",
            apiDetails: "GetInvoicesUserByRange?action=",
            route: "route-to-view",
            value: "total",
            listType: "item",
            action: "action",
            isModal: false
        },
        order: 12,
        permission: 1369
    }
];

export default ThreeWidgetsData;
