let Widgets = [{
    id: 'wt_pendingInspectionRequestCount_1',
    title: 'countinspectionPanding',
    api: 'GetCountinspection?status=null',
    apiDetails: '',
    isModal: 'false',
    route: 'route-to-view',
    permission: 3202
},
{
    id: 'wt_rejectInspectionRequestCount_2',
    title: 'countinspectionReject',
    api: 'GetCountinspection?status=false',
    apiDetails: '',
    isModal: 'false',
    route: 'route-to-view',
    permission: 3201
},
{
    id: 'wt_approvedInspectionRequestCount_3',
    title: 'countinspectionApproved',
    api: 'GetCountinspection?status=true',
    apiDetails: '',
    isModal: 'false',
    route: 'route-to-view',
    permission: 3200
},
{
    id: 'wt_materialRequestCounts_5',
    title: 'materialRequestcount',
    api: 'GetMaterialRequestCounting',
    apiDetails: 'GetTotalMaterialRequestCounting',
    isModal: 'true',
    route: 'route-to-view',
    permission: 3343
},
{
    id: 'wt_rejectedTimesheets_7',
    title: 'rejectedTimeSheet',
    api: 'GetRejectedTimesheetBySystemCount',
    apiDetails: 'GetRejectedTimesheetBySystem',
    isModal: 'true',
    route: 'route-to-view',
    permission: ''
},
{
    id: 'wt_avgTimeOfResponding(Letters)_8',
    title: 'avgRespondTimeLetters',
    api: 'GetAvgTimeRespond?isMonthly=false&docType=19',
    apiDetails: '',
    isModal: 'false',
    route: 'route-to-view',
    permission: 3514
},
{
    id: 'wt_avgTimeOfResponding(Transmittals)_9',
    title: 'avgRespondTimeTransmittals',
    api: 'GetAvgTimeRespond?isMonthly=false&docType=28',
    apiDetails: '',
    isModal: 'false',
    route: 'route-to-view',
    permission: 3515
},
{
    id: 'wt_avgTimeOfResponding(IR)_10',
    title: 'avgRespondTimeIR',
    api: 'GetAvgTimeRespond?isMonthly=false&docType=25',
    apiDetails: '',
    isModal: 'false',
    route: 'route-to-view',
    permission: 3514
},
{
    id: 'wt_avgTimeOfResponding(MIR)_11',
    title: 'avgRespondTimeMIR',
    api: 'GetAvgTimeRespond?isMonthly=false&docType=103',
    apiDetails: '',
    isModal: 'false',
    route: 'route-to-view',
    permission: 3515
},
{
    id: 'wt_avgTimeOfResponding(RFI)_12',
    title: 'avgRespondTimeRFI',
    api: 'GetAvgTimeRespond?isMonthly=false&docType=23',
    apiDetails: '',
    isModal: 'false',
    route: 'route-to-view',
    permission: 3515
},
{
    id: 'wt_avgTimeOfResponding(Submittals)_13',
    title: 'avgRespondTimeSubmittals',
    api: 'GetAvgTimeRespond?isMonthly=false&docType=42',
    apiDetails: '',
    isModal: 'false',
    route: 'route-to-view',
    permission: 3515
},
{
    id: 'wt_avgTimeOfResponding(PO)_14',
    title: 'avgRespondTimePO',
    api: 'GetAvgTimeRespond?isMonthly=false&docType=70',
    apiDetails: '',
    isModal: 'false',
    route: 'route-to-view',
    permission: 3515
},
{
    id: 'wt_monthlyAvgTimeOfResponding(Letters)_15',
    title: 'monthlyAvgRespondTimeLetters',
    api: 'GetAvgTimeRespond?isMonthly=true&docType=19',
    apiDetails: '',
    isModal: 'false',
    route: 'route-to-view',
    permission: 3515
},
{
    id: 'wt_monthlyAvgRespondingTime(Transmittal)_16',
    title: 'monthlyAvgRespondTimeTransmittals',
    api: 'GetAvgTimeRespond?isMonthly=true&docType=28',
    apiDetails: '',
    isModal: 'false',
    route: 'route-to-view',
    permission: 3515
},
{
    id: 'wt_monthlyAvgTimeOfResponding(IR)_17',
    title: 'monthlyAvgRespondTimeIR',
    api: 'GetAvgTimeRespond?isMonthly=true&docType=25',
    apiDetails: '',
    isModal: 'false',
    route: 'route-to-view',
    permission: 3515
},
{
    id: 'wt_monthlyAvgTimeOfResponding(MIR)_18',
    title: 'monthlyAvgRespondTimeMIR',
    api: 'GetAvgTimeRespond?isMonthly=true&docType=103',
    apiDetails: '',
    isModal: 'false',
    route: 'route-to-view',
    permission: 3515
},
{
    id: 'wt_monthlyAvgTimeOfResponding(RFI)_19',
    title: 'monthlyAvgRespondTimeRFI',
    api: 'GetAvgTimeRespond?isMonthly=true&docType=23',
    apiDetails: '',
    isModal: 'false',
    route: 'route-to-view',
    permission: 3515
},
{
    id: 'wt_monthlyAvgRespondingTime(Submittals)_20',
    title: 'monthlyAvgRespondTimeSubmittals',
    api: 'GetAvgTimeRespond?isMonthly=true&docType=42',
    apiDetails: '',
    isModal: 'false',
    route: 'route-to-view',
    permission: 3515
},
{
    id: 'wt_onthlyAvgTimeOfResponding(PO)_21',
    title: 'monthlyAvgRespondTimePO',
    api: 'GetAvgTimeRespond?isMonthly=true&docType=70',
    apiDetails: 'NULL',
    isModal: 'false',
    route: 'route-to-view',
    permission: 3515
},
{
    id: 'wt_monitorTasks_22',
    title: 'monitorTasks',
    api: 'GetCountMonitorTasks',
    apiDetails: '',
    isModal: 'true',
    route: "MonitorTasks",
    permission: 3770
},
{
    id: 'wt_monthlyTaskss_23',
    title: 'monthlyTasks',
    api: 'GetCounMonthlyTasks',
    apiDetails: '',
    isModal: 'true',
    route: "MonthlyTasksDetails",
    permission: 3771
},
];

let CounterWidgetsWithDetails = [{
    id: 'wt_rejectedSubmittals_1',
    title: 'rejectedSubmittals',
    api: 'GetApprocalStatusCount?action=2',
    apiDetails: 'GetApprocalStatusDetails?action=2',
    value: "total-0",
    total: "total-1",
    isModal: 'true',
    route: 'route-to-view',
    permission: 3494
},
{
    id: 'wt_approvalSubmittals_2',
    title: 'approvalSubmittals',
    api: 'GetApprocalStatusCount?action=1',
    apiDetails: 'GetApprocalStatusDetails?action=1',
    value: "total-0",
    total: "total-1",
    isModal: 'true',
    route: 'route-to-view',
    permission: 3493
},
{
    id: 'wt_requestForInformationOpen_3',
    title: 'rfiOpen',
    api: 'GetRfiOpenCount',
    apiDetails: 'GetRfiOpenDetails',
    value: "total-0",
    total: "total-1",
    isModal: 'true',
    route: 'route-to-view',
    permission: 3495
},
{
    id: 'wt_openedSubmittal_4',
    title: 'openedSubmittals',
    api: 'getOpenedDocumentsCount?docType=42&status=true',
    apiDetails: 'GetOpenedDocumentsDetails?docType=42&status=true&projectId=',
    value: "count-0",
    total: "total-1",
    isModal: 'true',
    route: 'route-to-view',
    permission: 3510
},
{
    id: 'wt_openedTransmittals_5',
    title: 'openedTransmittals',
    api: 'getOpenedDocumentsCount?docType=28&status=true',
    apiDetails: 'GetOpenedDocumentsDetails?docType=28&status=true&projectId=',
    value: "count-0",
    total: "total-1",
    isModal: 'true',
    route: 'route-to-view',
    permission: 3511
},
{
    id: 'wt_openedLetters_6',
    title: 'openedLetters',
    api: 'getOpenedDocumentsCount?docType=19&status=true',
    apiDetails: 'GetOpenedDocumentsDetails?docType=19&status=true&projectId=',
    value: "count-0",
    total: "total-1",
    isModal: 'true',
    route: 'route-to-view',
    permission: 3512
},
{
    id: 'wt_openedInspectionRequests_7',
    title: 'openedIR',
    api: 'getOpenedDocumentsCount?docType=25&status=true',
    apiDetails: 'GetOpenedDocumentsDetails?docType=25&status=true&projectId=',
    value: "count-0",
    total: "total-1",
    isModal: 'true',
    route: 'route-to-view',
    permission: 3513
},
{
    id: 'wt_ClosedSubmittal_8',
    title: 'closedSubmittals',
    api: 'getOpenedDocumentsCount?docType=42&status=false',
    apiDetails: 'GetOpenedDocumentsDetails?docType=42&status=false&projectId=',
    value: "count-0",
    total: "total-1",
    isModal: 'true',
    route: 'route-to-view',
    permission: 10144
},
{
    id: 'wt_PendingSubmittal_9',
    title: 'pendingSubmittals',
    api: 'GetApprocalStatusCount?action=3',
    apiDetails: 'GetApprocalStatusDetails?action=3',
    value: "count-0",
    total: "total-1",
    isModal: 'true',
    route: 'route-to-view',
    permission: 10145
},
];

export default {
    Widgets,
    CounterWidgetsWithDetails
};