
let ChartWidgets = [{
    id: 'wt-Name01',
    title: 'projectStatus',
    props: {
        'api': 'GetProjectsStatusSummaryCount',
        'name': 'item',
        'y': 'total'
    },
    type: 'pie',
    seriesName:"projectStatus"
 }
, {
    id: 'wt-Name02',
    title: 'expensesAllProject',
    props: {
        'api': 'GetExpensesByTypeForAllProjects',
        'name': 'expenseTypeName',
        'y': 'total'
    },
    type: 'pie',
    seriesName:"expensesAllProject"

},{
    id: 'wt-Name03',
    title: 'completedActivitiesCommulative',
    props: {
        'api': 'GetTopFiveCompletedActivities',
        'name': 'projectName',
        'data': 'percentage'
    },
    type: 'column',
    stack:'normal',
    yTitle:'total',
    catagName:'projectName',
    multiSeries:'no',
    barContent:[]
},{
    id: 'wt-Name04',
    title: 'completedActivitiesThisMonth',
    props: {
        'api': 'GetTopFiveMonthlyCompletedActivities',
        'name': 'projectName',
        'data': 'percentage'
    },
    type: 'column',
    stack:'normal',
    yTitle:'total',
    catagName:'projectName',
    multiSeries:'no',
    barContent:[]
},{
    id: 'wt-Name05',
    title: 'percentOfMaterialRequestPerProject',
    props: {
        'api': 'GetTopFiveRequests',
        'name': 'projectName',
        'data': 'percentage'
    },
    type: 'column',
    stack:'normal',
    yTitle:'total',
    catagName:'projectName',
    multiSeries:'no',
    barContent:[]
},{
    id: 'wt-Name06',
    title: 'percentOfMaterialRequestPerProject',
    props: {
        'api': 'GetTopFiveApprovedSubmittal?status=true',
        'name': 'projectName',
        'data': 'percentage'
    },
    type: 'column',
    stack:'normal',
    yTitle:'total',
    catagName:'projectName',
    multiSeries:'no',
    barContent:[]
},{
    ////////////////////////////////////
    id: 'wt-Name07',
    title: 'percentOfRejectedSubmittalPerProject',
    props: {
        'api': 'GetTopFiveApprovedSubmittal?status=false',
        'name': 'projectName',
        'data': 'percentage'
    },
    type: 'column',
    stack:'normal',
    yTitle:'total',
    catagName:'projectName',
    multiSeries:'no',
    barContent:[]
},{
    id: 'wt-Name08',
    title: 'countinspectionApproved',
    props: {
        'api': 'GetStatusIspectionRequest?status=true',
        'name': 'projectName',
        'data': 'percentage'
    },
    type: 'column',
    stack:'normal',
    yTitle:'sum',
    catagName:'projectName',
    multiSeries:'no',
    barContent:[]
},{
    id: 'wt-Name09',
    title: 'rejectedInspectionRequest',
    props: {
        'api': 'GetStatusIspectionRequest?status=false',
        'name': 'projectName',
        'data': 'percentage'
    },
    type: 'column',
    stack:'normal',
    yTitle:'sum',
    catagName:'projectName',
    multiSeries:'no',
    barContent:[]
},{
    id: 'wt-Name10',
    title: 'pendingItemInWorkFlow',
    props: {
        'api': 'GetPendingItemInWorkFlowTopFive',
        'name': 'docName',
        'data': 'count'
    },
    type: 'column',
    stack:'normal',
    yTitle:'total',
    catagName:'docName',
    multiSeries:'no',
    barContent:[]
},{
    id: 'wt-Name11',
    title: 'contractsPerProject',
    props: {
        'api': 'GetTopFiveContracts',
        'name': 'docName',
        'data': 'count'
    },
    type: 'column',
    stack:'',
    yTitle:'total',
    catagName:'projectName',
    multiSeries:'yes',
    barContent:[{name:'Contracted' ,value:'percentageContract'},{name:'Contracts Under Review', value:'countUnderContract'}]

}
,{
    id: 'wt-Name12',
    title: 'contractsSummaryAllProjectProject',
    props: {
        'api': 'GetTopFiveContractsForAllProjects',
        'name': 'docName',
        'data': 'count'
    },
    type: 'column',
    stack:'',
    yTitle:'total',
    catagName:'projectName',
    multiSeries:'yes',
    barContent:[{name:'Contracts Under Review' ,value:'countUnderContract'},{name:'Contracted', value:'countContract'}]

},{
    id: 'wt-Name13',
    title: 'percentageExpensesTypesOfTotal',
    props: {
        'api': 'GetPercentageExpensesType',
        'name': 'projectName',
        'data': 'total'
    },
    type: 'column',
    stack:'normal',
    yTitle:'sum',
    catagName:'projectName',
    multiSeries:'no',
    barContent:[]

},{
    id: 'wt-Name14',
    title: 'budgetVariance',
    props: {
        'api': 'GetTopFiveBudgetVariance',
        'name': 'projectName',
        'data': 'total'
    },
    type: 'column',
    stack:'',
    yTitle:'total',
    catagName:'expenseTypeName',
    multiSeries:'yes',
    barContent:[{name:'Actual Total' ,value:'actual'},{name:'Budget Expenses', value:'budgetedExpenseValue'}]

}

];

export default ChartWidgets; 