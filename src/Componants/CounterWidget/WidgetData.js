let Widgets = [{
    class: "gray",
    id: 'wt_pendingInspectionRequestCount_1',
    title: 'countinspectionPanding',
    api: 'GetCountinspection?status=null',
    apiDetails: '',
    isModal: 'false',
    route: 'route-to-view',
    permission: 3202
},
{
    class: "gray",
    id: 'wt_rejectInspectionRequestCount_2',
    title: 'countinspectionReject',
    api: 'GetCountinspection?status=false',
    apiDetails: '',
    isModal: 'false',
    route: 'route-to-view',
    permission: 3201
},
{
    class: "gray",
    id: 'wt_approvedInspectionRequestCount_3',
    title: 'countinspectionApproved',
    api: 'GetCountinspection?status=true',
    apiDetails: '',
    isModal: 'false',
    route: 'route-to-view',
    permission: 3200
},
{
    class: "gray",
    id: 'wt_materialRequestCounts_5',
    title: 'materialRequestcount',
    api: 'GetMaterialRequestCounting',
    apiDetails: 'GetTotalMaterialRequestCounting',
    isModal: 'true',
    route: 'route-to-view',
    permission: 3343
},
{
    class: "gray",
    id: 'wt_rejectedTimesheets_7',
    title: 'rejectedTimeSheet',
    api: 'GetRejectedTimesheetBySystemCount',
    apiDetails: 'GetRejectedTimesheetBySystem',
    isModal: 'true',
    route: 'route-to-view',
    permission: ''
},
{
    class: "gray",
    id: 'wt_avgTimeOfResponding(Letters)_8',
    title: 'avgRespondTimeLetters',
    api: 'GetAvgTimeRespond?isMonthly=false&docType=19',
    apiDetails: '',
    isModal: 'false',
    route: 'route-to-view',
    permission: 3514
},
{
    class: "gray",
    id: 'wt_avgTimeOfResponding(Transmittals)_9',
    title: 'avgRespondTimeTransmittals',
    api: 'GetAvgTimeRespond?isMonthly=false&docType=28',
    apiDetails: '',
    isModal: 'false',
    route: 'route-to-view',
    permission: 3515
},
{
    class: "gray",
    id: 'wt_avgTimeOfResponding(IR)_10',
    title: 'avgRespondTimeIR',
    api: 'GetAvgTimeRespond?isMonthly=false&docType=25',
    apiDetails: '',
    isModal: 'false',
    route: 'route-to-view',
    permission: 3514
},
{
    class: "gray",
    id: 'wt_avgTimeOfResponding(MIR)_11',
    title: 'avgRespondTimeMIR',
    api: 'GetAvgTimeRespond?isMonthly=false&docType=103',
    apiDetails: '',
    isModal: 'false',
    route: 'route-to-view',
    permission: 3515
},
{
    class: "gray",
    id: 'wt_avgTimeOfResponding(RFI)_12',
    title: 'avgRespondTimeRFI',
    api: 'GetAvgTimeRespond?isMonthly=false&docType=23',
    apiDetails: '',
    isModal: 'false',
    route: 'route-to-view',
    permission: 3515
},
{
    class: "gray",
    id: 'wt_avgTimeOfResponding(Submittals)_13',
    title: 'avgRespondTimeSubmittals',
    api: 'GetAvgTimeRespond?isMonthly=false&docType=42',
    apiDetails: '',
    isModal: 'false',
    route: 'route-to-view',
    permission: 3515
},
{
    class: "gray",
    id: 'wt_avgTimeOfResponding(PO)_14',
    title: 'avgRespondTimePO',
    api: 'GetAvgTimeRespond?isMonthly=false&docType=70',
    apiDetails: '',
    isModal: 'false',
    route: 'route-to-view',
    permission: 3515
},
{
    class: "gray",
    id: 'wt_monthlyAvgTimeOfResponding(Letters)_15',
    title: 'monthlyAvgRespondTimeLetters',
    api: 'GetAvgTimeRespond?isMonthly=true&docType=19',
    apiDetails: '',
    isModal: 'false',
    route: 'route-to-view',
    permission: 3515
},
{
    class: "gray",
    id: 'wt_monthlyAvgRespondingTime(Transmittal)_16',
    title: 'monthlyAvgRespondTimeTransmittals',
    api: 'GetAvgTimeRespond?isMonthly=true&docType=28',
    apiDetails: '',
    isModal: 'false',
    route: 'route-to-view',
    permission: 3515
},
{
    class: "gray",
    id: 'wt_monthlyAvgTimeOfResponding(IR)_17',
    title: 'monthlyAvgRespondTimeIR',
    api: 'GetAvgTimeRespond?isMonthly=true&docType=25',
    apiDetails: '',
    isModal: 'false',
    route: 'route-to-view',
    permission: 3515
},
{
    class: "gray",
    id: 'wt_monthlyAvgTimeOfResponding(MIR)_18',
    title: 'monthlyAvgRespondTimeMIR',
    api: 'GetAvgTimeRespond?isMonthly=true&docType=103',
    apiDetails: '',
    isModal: 'false',
    route: 'route-to-view',
    permission: 3515
},
{
    class: "gray",
    id: 'wt_monthlyAvgTimeOfResponding(RFI)_19',
    title: 'monthlyAvgRespondTimeRFI',
    api: 'GetAvgTimeRespond?isMonthly=true&docType=23',
    apiDetails: '',
    isModal: 'false',
    route: 'route-to-view',
    permission: 3515
},
{
    class: "gray",
    id: 'wt_monthlyAvgRespondingTime(Submittals)_20',
    title: 'monthlyAvgRespondTimeSubmittals',
    api: 'GetAvgTimeRespond?isMonthly=true&docType=42',
    apiDetails: '',
    isModal: 'false',
    route: 'route-to-view',
    permission: 3515
},
{
    class: "gray",
    id: 'wt_onthlyAvgTimeOfResponding(PO)_21',
    title: 'monthlyAvgRespondTimePO',
    api: 'GetAvgTimeRespond?isMonthly=true&docType=70',
    apiDetails: 'NULL',
    isModal: 'false',
    route: 'route-to-view',
    permission: 3515
},
{
    class: "gray",
    id: 'wt_monitorTasks_22',
    title: 'monitorTasks',
    api: 'GetCountMonitorTasks',
    apiDetails: '',
    isModal: 'true',
    route: "MonitorTasks",
    permission: 3770
},
{
    class: "gray",
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
    class: "gray",
    id: 'wt_rejectedSubmittals_1',
    title: 'rejectedSubmittals',
    api: 'GetApprocalStatusCount?status=false',
    apiDetails: 'GetApprocalStatusDetails?status=false',
    value: "total-0",
    total: "total-1",
    isModal: 'true',
    route: 'route-to-view',
    permission: 3494
},
{
    class: "gray",
    id: 'wt_approvalSubmittals_2',
    title: 'approvalSubmittals',
    api: 'GetApprocalStatusCount?status=true',
    apiDetails: 'GetApprocalStatusDetails?status=true',
    value: "total-0",
    total: "total-1",
    isModal: 'true',
    route: 'route-to-view',
    permission: 3493
},
{
    class: "gray",
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
    class: "gray",
    id: 'wt_openedSubmittal_4',
    title: 'openedSubmittals',
    api: 'getOpenedDocumentsCount?docType=42',
    apiDetails: 'GetOpenedDocumentsDetails?docType=42',
    value: "count-0",
    total: "total-1",
    isModal: 'true',
    route: 'route-to-view',
    permission: 3510
},
{
    class: "gray",
    id: 'wt_openedTransmittals_5',
    title: 'openedTransmittals',
    api: 'getOpenedDocumentsCount?docType=28',
    apiDetails: 'GetOpenedDocumentsDetails?docType=28',
    value: "count-0",
    total: "total-1",
    isModal: 'true',
    route: 'route-to-view',
    permission: 3511
},
{
    class: "gray",
    id: 'wt_openedLetters_6',
    title: 'openedLetters',
    api: 'getOpenedDocumentsCount?docType=19',
    apiDetails: 'GetOpenedDocumentsDetails?docType=19',
    value: "count-0",
    total: "total-1",
    isModal: 'true',
    route: 'route-to-view',
    permission: 3512
},
{
    class: "gray",
    id: 'wt_openedInspectionRequests_7',
    title: 'openedIR',
    api: 'getOpenedDocumentsCount?docType=25',
    apiDetails: 'GetOpenedDocumentsDetails?docType=25',
    value: "count-0",
    total: "total-1",
    isModal: 'true',
    route: 'route-to-view',
    permission: 3513
}
];

export default {
    class: "gray",
    Widgets,
    CounterWidgetsWithDetails
};