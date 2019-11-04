export default {
	app: {
		communication: {
			document: {},
			documentTitle: '',
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
			attendees: [],
			topics: [],
			viewModel: false,
			documentCycle: {},
			items: [],
			fields: [],
			columns: [],
			fieldsItems: [],
			showLeftMenu: false,
			projectName: "",
			moduleName: "",
			showSelectProject: true,
			showLeftReportMenu: false,
			//attachDocuments: [],
			docsAttachData: [],
			relatedLinkData: [],
			documentData: [],
			isReject: null,
			isLoadingFilesUpload: false,
			totalCost: 0,
			phone:{}
		},
		expensesWorkFlow: {
			expensesWorkFlowData: {},
			contactData: [],
			newContactElement: {},
			multiApproval: [],

		},
		adminstration: {
			popUp: false,
			notifyMessage: '',
			companyContact: [],
			getingData: false,
			companyList: [],
			tabIndex: 0,
			userTabIndex: 0,
			showExpensesWF: false
		},
		Steps: {
			currentStep: 0
		}
	}
}
