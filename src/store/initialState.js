export default {
	app: {
		communication: {
			document: {},
			files: [],
			workFlowCycles: [],
			changeStatus: false,
			hasWorkflow: false,
			docId: 0,
			doctypeId: 0,
			projectId: 0,
			isLoading: false,
			isLoadingFiles: false,
			file: {},
			arrange: 0,
			showModal: false,
			showLeftMenu: false, 
			projectName:"",
			showSelectProject:true
		}, 
		expensesWorkFlow: {
			expensesWorkFlowData:{},
			contactData:[],
			newContactElement:{},
			multiApproval:[]
		},
		adminstration:{
			popUp:false,
			notifyMessage:'',
			companyContact:[],
			getingData: false,
			companyList:[],
			tabIndex:0
		},
		// taskGroups:{
		// 	IsEditModel:false,
		// 	TaskGroupsData:[],
		// } 
	}
}
