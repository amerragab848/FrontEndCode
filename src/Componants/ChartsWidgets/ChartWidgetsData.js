
let ChartWidgets = [
    {
        id: 'wt-Name03',
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
    }, {
        id: 'wt-Name04',
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
    }, {
        id: 'wt-Name05',
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
        ////////////////////////////////////
        id: 'wt-Name07',
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
    } , {
        id: 'wt-Name09',
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
    }, {
        id: 'wt-Name10',
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
    }, {
        id: 'wt-Name12',
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

];

export default ChartWidgets; 