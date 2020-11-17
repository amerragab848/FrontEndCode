var routes = [
    {
        route: "/",
        moduleId: "login",
        title: "Login",
        nav: true,
        settings: { Login: true }
    },
    {
        route: "/Dashboard",
        moduleId: "dashboard",
        title: "Dashboard",
        nav: true,
        settings: { Dashboard: true }
    },
    {
        route: "/search",
        moduleId: "search",
        title: "Search",
        nav: true,
        settings: { Search: true }
    },
    {
        route: "PrintPdf",
        moduleId: "printPdf",
        title: "PrintPdf",
        nav: false,
        settings: { PrintPdf: true }
    },
    {
        route: "BoqAddEditItemization/:id",
        moduleId: "contracts/boqAddEditItemization",
        title: "Itemization",
        nav: false,
        settings: { Contracts: false }
    },
    {
        route: "workspace/:id(/:routeId)",
        moduleId: "workspace/workspace",
        title: "Workspace",
        nav: true,
        settings: { Workspace: true }
    },
    {
        route: "reportsMenu",
        moduleId: "reportsMenu",
        title: "Reports Menu",
        nav: true,
        settings: { ReportsMenuTop: true }
    },
    {
        route: "quantitiesAlerting",
        moduleId: "accounts/quantitiesAlerting",
        title: "quantitiesAlerting",
        nav: true,
        settings: { Projects: true }
    },
    {
        route: "projectProperties",
        moduleId: "projects/projectProperties",
        title: "projectProperties",
        nav: true,
        settings: { General: false }
    },
    {
        route: "accountConfiguration",
        moduleId: "accounts/configration",
        title: "Configuration",
        nav: true,
        settings: { accounts: true }
    },
    {
        route: "accountingSummaryDailyJournalAudit/:id",
        moduleId: "accountingSummary/accountingSummaryDailyJournalAudit",
        title: "Accounting Daily Journal Auditing",
        nav: true
    },
    {
        route: "journalNotCoded",
        moduleId: "accountingsummary/journalNotCoded",
        title: "Journal Not Coded",
        nav: true
    },
    {
        route: "salaryCategories",
        moduleId: "accounts/salaryCategories",
        title: "salaryCategories",
        nav: true,
        settings: { Configuration: true }
    },
    {
        route: "CollectedInvoices",
        moduleId: "reports/collectedInvoicesRpt",
        title: "collectedInvoices",
        nav: true,
        settings: { Reports: true, permission: 686, order: 6 }
    }, 
    {
        route: "inventoryDetails",
        moduleId: "ProjectReports/InventoryDetails",
        title: "inventoryDetails",
        nav: true,
        settings: { ProjectReports: true, permission: 3689, order: 14 }
    }, 
    {
        route: "CostControlTreeReport",
        moduleId: "ProjectReports/CostControlTreeReport",
        title: "CostControlTreeReport",
        nav: true,
        settings: { ProjectReports: true, permission: 10072, order: 15 }
    }, 
    {
        route: "CostCodingReport",
        moduleId: "ProjectReports/CostCodingReport",
        title: "CostCodingReport",
        nav: true,
        settings: { ProjectReports: true, permission: 10073, order: 16 }
    }, 
    {
        route: "boqTemplateReport",
        moduleId: "ProjectReports/BoqTemplateReport",
        title: "boqTemplateReport",
        nav: true,
        settings: { ProjectReports: true, permission: 3690, order: 15 }
    },
    {
        route: "boqStractureCost",
        moduleId: "ProjectReports/BoqStractureCost",
        title: "boqStractureCost",
        nav: true,
        settings: { ProjectReports: true, permission: 4019, order: 16 }
    },

    {
        route: "projectBackLog",
        moduleId: "ProjectReports/projectBackLog",
        title: "projectsBackLog",
        nav: true,
        settings: { ProjectReports: true, permission: 3679, order: 4 }
    },
    {
        route: "reqPaymInvoicesRpt",
        moduleId: "ContractsPOReports/reqPaymInvoicesRpt",
        title: "reqPaymInvoicesRpt",
        nav: true,
        settings: { ContractsPo: true, permission: 3679, order: 8 }
    },
    {
        route: "projectsAchievements",
        moduleId: "ProjectReports/projectsAchievements",
        title: "projectsAchievments",
        nav: true,
        settings: { ProjectReports: true, permission: 3680, order: 5 }
    },
    {
        route: "projectInvoicesCollected",
        moduleId: "ProjectReports/projectInvoicesCollected",
        title: "projectedInvoicedCollecetd",
        nav: true,
        settings: { ProjectReports: true, permission: 3681, order: 6 }
    },

    {
        route: "materialStatusReport",
        moduleId: "ProjectReports/MaterialStatusReport",
        title: "materialStatusReport",
        nav: true,
        hash: "#materialStatusReport",
        settings: { ProjectReports: true, permission: 3688, order: 13 }
    },
    {
        route: "CashFlowReport",
        moduleId: "ProjectReports/CashFlowReport",
        title: "cashFlow",
        nav: true,
        settings: { ProjectReports: true, permission: 3678, order: 3 }
    },
    {
        route: "ProjectDocumentStatus",
        moduleId: "ProjectReports/ProjectDocumentStatus",
        title: "ProjectDocumentStatus",
        nav: true,
        settings: { ProjectReports: true, permission: 3678, order: 4 }
    },
    {
        route: "ContractsStatus",
        moduleId: "ContractsPOReports/ContractsStatus",
        title: "contractsStatus",
        nav: true,
        settings: { ProjectReports: true, permission: 3678, order: 4 }
    },
    {
        route: "ProjectBalanceReport",
        moduleId: "ProjectReports/ProjectBalanceReport",
        title: "projectBalanceReport",
        nav: true,
        settings: { ProjectReports: true, permission: 3676, order: 1 }
    },
    {
        route: "ProjectsList",
        moduleId: "ProjectReports/ProjectsList",
        title: "projectsList",
        nav: true,
        settings: { ProjectReports: true, permission: 3677, order: 2 }
    },
    {
        route: "allocationOfUsersOnProjects",
        moduleId: "ProjectReports/allocationOfUsersOnProjects",
        title: "userAllocationOnProjects",
        nav: true,
        settings: { ProjectReports: true, permission: 3683, order: 8 }
    },
    {
        route: "budgetVarianceReport",
        moduleId: "ProjectReports/budgetVarianceReport",
        title: "budgetVarianceReport",
        nav: true,
        settings: { ProjectReports: true, permission: 3684, order: 9 }
    },
    {
        route: "expensesDetailsOnProjectsReport",
        moduleId: "ProjectReports/expensesDetailsOnProjectsReport",
        title: "expensesDetailsOnProjectsReport",
        nav: true,
        settings: { ProjectReports: true, permission: 3685, order: 10 }
    },
    {
        route: "activeProjectsReport",
        moduleId: "ProjectReports/ActiveProjectsReport",
        title: "activeProjectsReport",
        nav: true,
        settings: { ProjectReports: true, permission: 3686, order: 11 }
    },
    {
        route: "newprojectList",
        moduleId: "ProjectReports/NewprojectList",
        title: "newprojectList",
        nav: true,
        settings: { ProjectReports: true, permission: 3687, order: 12 }
    },
    {
        route: "allocationOfProjectsOnCompanies",
        moduleId: "ProjectReports/allocationOfProjectsOnCompanies",
        title: "projectsAllocationOnCompanies",
        nav: true,
        settings: { ProjectReports: true, permission: 3682, order: 7 }
    },
    {
        route: "estimationBoqComparison",
        moduleId: "reports/estimationBoqComparison",
        title: "estimationBoqComparison",
        nav: true,
        settings: { Reports: true, order: 18 }
    },
    { 
        route: "timeSheetUserDetails",
        moduleId: "TimeSheet/TimeSheetUserDetails",
        title: "timeSheetUserDetails",
        nav: true,
        settings: { HumanResources: true, permission: 3718, order: 12 }
    },
    { 
        route: "boqContractCost",
        moduleId: "reports/boqContractCost",
        title: "boqContractCost",
        nav: true,
        settings: { Reports: true, permission: 3654, order: 13 }
    },
    { 
        route: "ContractedQtyVSEarnedQty",
        moduleId: "ProjectReports/ContractedQtyVSEarnedQty",
        title: "contractQtyVsEarnedQty",
        nav: true,
        settings: { ProjectReports: true, permission: 10074, order: 21 }
    },
    {
        route: "taskDetail",
        moduleId: "TimeSheet/EPSTimeSheetReport",
        title: "epsTimeSheet",
        nav: true,
        settings: { HumanResources: true, permission: 3717, order: 11 }
    },
    {
        route: "accounts",
        moduleId: "accounts/accounts",
        title: "accounts",
        nav: true,
        settings: { User: true }
    },
    {
        route: "currencyExchangeRates",
        moduleId: "accounts/currencyExchangeRates",
        title: "currencyExchangeRates",
        nav: true,
        settings: { User: true }
    },
    {
        route: "materialInventoryLog",
        moduleId: "accounts/materialInventoryLog",
        title: "materialInventory",
        nav: true,
        hash: "#materialInventoryLog",
        settings: { GeneralConfig: true }
    },
    {
        route: "expensesWorkFlow",
        moduleId: "projects/expensesWorkFlow",
        title: "expensesWorkFlow",
        nav: true,
        settings: { Projects: true }
    },
    {
        route: "accountsEdit/:param1*detail",
        moduleId: "accounts/accountsEdit",
        title: "accountsEdit",
        nav: false
    },
    {
        route: "userEps/:accountId",
        moduleId: "projects/userEps",
        title: "User Eps",
        nav: false
    },
    {
        route: "eps",
        moduleId: "projects/eps",
        title: "EPS",
        nav: true,
        settings: { EPS: true }
    },
    {
        route: "projectsEdit/:param1",
        moduleId: "projects/projectsEdit",
        title: "Project Edit",
        nav: false
    },
    {
        route: "projectsAdd/:param1",
        moduleId: "projects/projectsAdd",
        title: "Project Add",
        nav: false
    },
    {
        route: "userCompany/:param1*detail",
        moduleId: "projects/userCompany",
        title: "User Company",
        nav: false
    },
    {
        route: "projects/:param1*detail",
        moduleId: "projects/projects",
        title: "Projects",
        nav: false
    },
    {
        route: "accountsDefaultList",
        moduleId: "accounts/accountsDefaultList",
        title: "AccountsDefaultList",
        nav: true,
        settings: { Accounts: true }
    },
    {
        route: "permissionsGroups",
        moduleId: "accounts/permissionsGroups",
        title: "accountPermissionsGroups",
        nav: true,
        settings: { User: true }
    },
    {
        route: "permissionsGroupsPermissions/:param1*detail",
        moduleId: "accounts/permissionsGroupsPermissions",
        title: "Permission Groups Permissions",
        nav: false,
        settings: { Configuration: false }
    },
    {
        route: "accountsGroup/:groupId*detail",
        moduleId: "accounts/accountsGroup",
        title: "accountsGroup",
        nav: false
    },
    {
        route: "accountsGroupEdit/:groupId*detail",
        moduleId: "accounts/accountsGroupEdit",
        title: "Accounts Group Edit",
        nav: false
    },
    {
        route: "accountsAdd",
        moduleId: "accounts/accountsAdd",
        title: "Add Account",
        nav: false
    },
    {
        route: "permissionsGroupsPermissions",
        moduleId: "accounts/permissionsGroupsPermissions",
        title: "Permissions Groups Permissions",
        nav: false
    },
    {
        route: "projectCompanies",
        moduleId: "projects/projectCompanies",
        title: "Companies",
        nav: true,
        settings: { User: true }
    },
    {
        route: "projectCompaniesAddEdit/:param",
        moduleId: "projects/projectCompaniesAddEdit",
        title: "Companies",
        nav: true,
        settings: { User: true }
    },
    {
        route: "projectCompanyContacts/:param1*detail",
        moduleId: "projects/projectCompanyContacts",
        title: "ContactsLog",
        nav: false,
        settings: { Configuration: true }
    },
    {
        route: "Postit",
        moduleId: "accounts/postit",
        title: "Postit",
        nav: true,
        settings: { UserProfile: true }
    },
    {
        route: "PostitNotificationsDetail",
        moduleId: "notifications/postitNotificationsDetail",
        title: "Postit",
        nav: true,
        settings: { UserProfile: true }
    },
    {
        route: "configration",
        moduleId: "accounts/configration",
        title: "GeneralConfig",
        nav: true,
        settings: { Configuration: true }
    },
    {
        route: "supplierAnalysisSections",
        moduleId: "accounts/supplierAnalysisSections",
        title: "SupplierAnalysisSection",
        nav: true,
        settings: { Accounts: true }
    },
    {
        route: "supplierAnalysisSectionsItems",
        moduleId: "accounts/supplierAnalysisSectionsItems",
        title: "Supplier Analysis Sections Item",
        nav: true,
        settings: { Accounts: false }
    },
    {
        route: "accountsProjects/:param1*detail",
        moduleId: "accounts/accountsProjects",
        title: "accounts Projects",
        nav: true
    },
    {
        route: "userProjects/:id",
        moduleId: "projects/userProjects",
        title: "accounts Projects",
        nav: true
    },
    {
        route: "timesheet",
        moduleId: "logs/timesheet",
        title: "timeSheet",
        nav: true,
        settings: { UserProfile: true }
    },
    {
        route: "overtimeAddition",
        moduleId: "logs/overtimeAddition",
        title: "overtimeAddition",
        nav: true,
        settings: { UserProfile: true }
    },
    {
        route: "accountsContractsConditionsCategory",
        moduleId: "accounts/accountsContractsConditionsCategory",
        title: "contract",
        nav: true,
        settings: { Accounts: true }
    },
    {
        route: "accountsContractsGeneralConditions",
        moduleId: "accounts/accountsContractsGeneralConditions",
        title: "General Conditions ",
        nav: true,
        settings: { Accounts: false }
    },
    {
        route: "accountsContractsParticularConditions",
        moduleId: "accounts/accountsContractsParticularConditions",
        title: "Particular Conditions",
        nav: true,
        settings: { Accounts: false }
    },
    {
        route: "designDiscipline",
        moduleId: "accounts/designDiscipline",
        title: "designDiscipline",
        nav: true,
        settings: { Accounts: true }
    },
    {
        route: "DesignDisciplineSections",
        moduleId: "accounts/designDisciplineSections",
        title: "Design Discipline Sections",
        nav: true,
        settings: { Accounts: false }
    },
    {
        route: "tenderAnalysisSections",
        moduleId: "accounts/tenderAnalysisSections",
        title: "tenderAnalysySection",
        nav: true,
        settings: { Accounts: true }
    },
    {
        route: "tenderAnalysisSectionsItems",
        moduleId: "accounts/tenderAnalysisSectionsItems",
        title: "Tender Analysis Sections Items",
        nav: true,
        settings: { Accounts: false }
    },
    {
        route: "login",
        moduleId: "login",
        title: "Login",
        nav: true
    },
    {
        route: "peetyCash",
        moduleId: "logs/peetyCash",
        title: "peetyCash",
        nav: true,
        hash: "#peetyCash"
    },
    {
        route:
            "peetyCashAddEdit/:id(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)",
        moduleId: "logs/peetyCashAddEdit",
        title: "peetyCash",
        nav: true
    },
    {
        route:
            "peetyCashAddEditInMenu/:id(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)",
        moduleId: "logs/peetyCashAddEditInMenu",
        title: "peetyCash",
        nav: true
    },
    {
        route: "expensesPetty",
        moduleId: "logs/expensesPetty",
        title: "My Expenses",
        nav: true,
        settings: { Expenses: false }
    },
    {
        route: "expensesUser",
        moduleId: "logs/expensesUser",
        hash: "#expensesUser",
        title: "expenses",
        nav: true,
        settings: { Expenses: true }
    },
    {
        route:
            "expensesUserAddEdit/:id(/:workFlowId)(/:workFlowItemId)(/:arrange)(/:cycleId)",
        moduleId: "logs/expensesUserAddEdit",
        hash: "#expensesUserAddEdit",
        title: "expensesUserAddEdit",
        nav: true,
        settings: { Expenses: true }
    },
    {
        route: "myExpensesUser",
        moduleId: "logs/myExpensesUser",
        hash: "#myExpensesUser",
        title: "My Expenses",
        nav: true,
        settings: { Expenses: false }
    },
    {
        route: "Rfi",
        moduleId: "commonLogs",
        title: "communicationRFI",
        nav: true,
        hash: "#Rfi",
        settings: {
            Communication: true,
            permission: 79,
            caption: "procoor-icon-RFIs",
            order: 4
        }
    },
    {
        route: "invoicesDetails(/:costCodingType)",
        moduleId: "widgetsCharts/invoicesDetails",
        title: "invoices Details",
        nav: true
    },
    {
        route: "Letters",
        moduleId: "commonLogs",
        title: "lettertitle",
        nav: true,
        hash: "#Letters",
        settings: {
            Communication: true,
            permission: 52,
            caption: "procoor-icon-letters",
            order: 1
        }
    },
    {
        route:
            "rfiAddEdit/:param1(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "communication/rfiAddEdit",
        title: "Request for Information",
        nav: false,
        settings: { Communication: false }
    },
    {
        route: "rfiView/:id*detail",
        moduleId: "communication/rfiView",
        title: "rfi",
        nav: false,
        settings: { Communication: false }
    },
    {
        route: "imapEmails",
        moduleId: "projects/imapEmails",
        title: "email",
        nav: true,
        hash: "#imapEmails"
    },
    {
        route:
            "lettersAddEdit/:param1(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "communication/lettersAddEdit",
        title: "Letters Add",
        nav: false,
        settings: { Communication: false }
    },
    {
        route: "Phone",
        moduleId: "commonLogs",
        title: "phoneTitle",
        nav: true,
        hash: "#Phone",
        settings: {
            Communication: true,
            permission: 93,
            caption: "procoor-icon-telephone-records",
            order: 9
        }
    },
    {
        route:
            "phoneAddEdit/:param1(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "communication/phoneAddEdit",
        title: "Phone Add",
        nav: false,
        settings: { Communication: false }
    },
    {
        route:
            "requestProposalAddEdit/:id(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "communication/requestProposalAddEdit",
        title: "Proposal Edit",
        nav: false,
        settings: { Communication: false }
    },
    {
        route: "RequestProposal",
        moduleId: "commonLogs",
        title: "requestProposal",
        nav: true,
        hash: "#RequestProposal",
        settings: {
            Procurement: true,
            permission: 61,
            caption: "procoor-icon-proposal-request",
            order: 7
        }
    },
    {
        route: "Proposal",
        moduleId: "commonLogs",
        title: "suppliersProposal",
        nav: true,
        hash: "#Proposal",
        settings: {
            Procurement: true,
            permission: 70,
            caption: "procoor-icon-proposal",
            order: 8
        }
    },
    {
        route:
            "proposalAddEdit/:id(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "communication/proposalAddEdit",
        title: "Proposal Add",
        nav: false,
        settings: { Communication: false }
    },
    {
        route: "communicationProposalView/:id*detail",
        moduleId: "communication/proposalView",
        title: "Proposal View",
        nav: false,
        settings: { Communication: false }
    },
    {
        route:
            "proposalAddEdit/:id(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "communication/proposalAddEdit",
        title: "Proposal Edit",
        nav: false,
        settings: { Communication: false }
    },
    {
        route: "Reports",
        moduleId: "commonLogs",
        title: "Reports",
        nav: true,
        hash: "#Reports",
        settings: {
            Communication: true,
            permission: 427,
            caption: "procoor-icon-reports",
            order: 12
        }
    },
    {
        route:
            "reportsAddEdit/:id(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "communication/reportsAddEdit",
        title: "Report Add",
        nav: false,
        settings: { Communication: false }
    },
    {
        route: "reportsAddEdit/:id*detail",
        moduleId: "communication/reportsAddEdit",
        title: "Report Edit",
        nav: false,
        settings: { Communication: false }
    },
    {
        route: "InternalMemo",
        moduleId: "commonLogs",
        title: "communicationInternalMemo",
        nav: true,
        hash: "#InternalMemo",
        settings: {
            Communication: true,
            permission: 102,
            caption: "procoor-icon-internal-memo",
            order: 2
        }
    },
    {
        route: "claims",
        moduleId: "commonLogs",
        title: "claims",
        nav: true,
        hash: "#claims",
        settings: {
            Communication: true,
            permission: 52,
            caption: "procoor-icon-letters",
            order: 1
        }
    }, 
    {
        route:
            "internalMemoAddEdit/:id(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "communication/internalMemoAddEdit",
        title: "Internal Memo",
        nav: false,
        settings: { Communication: false }
    },
    {
        route: "communicationInternalMemoView/:id",
        moduleId: "communication/internalMemoView",
        title: "Internal Memo",
        nav: false,
        settings: { Communication: false }
    },
    {
        route: "communicationEmailView/:id",
        moduleId: "communication/emailView",
        title: "Email Records",
        nav: false,
        settings: { Communication: false }
    },
    {
        route:
            "emailAddEdit/:id(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "communication/emailAddEdit",
        title: "Email Records",
        nav: false,
        settings: { Communication: false }
    },
    {
        route: "Email",
        moduleId: "commonLogs",
        title: "communicationEmails",
        nav: true,
        hash: "#Email",
        settings: {
            Communication: true,
            permission: 395,
            caption: "procoor-icon-email-records",
            order: 8
        }
    }, 
    {
        route:
            "correspondenceSentAddEdit/:id(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "communication/correspondenceSentAddEdit",
        title: "Correspondence Sent",
        nav: false,
        settings: { Communication: false }
    },
    {
        route: "communicationCorrespondenceSentView/:id",
        moduleId: "communication/correspondenceSentView",
        title: "Correspondence Sent",
        nav: false,
        settings: { Communication: false }
    },
    {
        route:
            "correspondenceReceivedAddEdit/:id(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "communication/correspondenceReceivedAddEdit",
        title: "Correspondence Received Addition",
        nav: false,
        settings: { Communication: false }
    },
    {
        route:
            "projectTaskGroupAddEdit/:id(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "projects/projectTaskGroupAddEdit",
        title: "project Task Group ",
        nav: false,
        settings: { Communication: false }
    },
    {
        route: "sendByInbox/:id",
        moduleId: "panels/sendByInbox",
        title: "Send By Inbox ",
        nav: true
    },
    {
        route: "sendTask/:id",
        moduleId: "panels/sendTask",
        title: "Send Task ",
        nav: true
    },
    {
        route: "alertSummaryDetails",
        moduleId: "summary/alertSummaryDetails",
        title: "alertSummary ",
        nav: true
    },
    {
        route: "actionByContactDetails",
        moduleId: "summary/actionByContactDetails",
        title: "actionByContactSummary ",
        nav: true
    },
    {
        route: "documentApproval",
        moduleId: "panels/documentApproval",
        title: "Document Approval",
        nav: true
    },
    {
        route: "sendByEmail/:id",
        moduleId: "panels/sendByEmail",
        title: "Send By Email ",
        nav: true
    },
    {
        route:
            "autoDeskViewer/:fileName(/:path)(/:id)(/:docTypeId)(/:fileId)(/:projectId)",
        moduleId: "panels/autoDeskViewer",
        title: "Auto Desk ",
        nav: true
    },
    {
        route:
            "autoDeskPDFViewer/:fileName(/:path)(/:id)(/:docTypeId)(/:fileId)(/:projectId)",
        moduleId: "panels/autoDeskPDFViewer",
        title: "Auto Desk ",
        nav: true
    },
    {
        route:
            "autoDeskPDFViewerNew/:fileName(/:path)(/:id)(/:docTypeId)(/:fileId)(/:projectId)",
        moduleId: "panels/autoDeskPDFViewerNew",
        title: "Auto Desk ",
        nav: true
    },
    {
        route: "projectPictures",
        moduleId: "projects/projectPictures",
        title: "projectPictures",
        nav: true,
        settings: {
            Site: true,
            permission: 554,
            caption: "procoor-icon-pictures",
            order: 12
        }
    },
    {
        route: "projectPicturesAddEdit/:id",
        moduleId: "projects/projectPicturesAddEdit",
        title: "projectPictures",
        nav: false,
        settings: { Site: false }
    },
    {
        route: "ProjectCompanies",
        moduleId: "ProjectCompanies",
        title: "Companies",
        nav: true,
        settings: {
            Communication: true,
            permission: 4,
            caption: "procoor-icon-companies",
            order: 15
        }
    },
    {
        route: "projectWorkFlow",
        moduleId: "projects/projectWorkFlow",
        title: "workFlow",
        nav: true,
        settings: {
            // // General: true,
            permission: 604,
            caption: "procoor-icon-workflow",
            order: 1
        }
    },
    {
        route: "projectTaskGroups",
        moduleId: "projects/projectTaskGroups",
        title: "projectTaskGroups",
        nav: true,
        settings: {
            // General: true,
            permission: 778,
            caption: "procoor-icon-task-groups"
        }
    },
    {
        route: "projectOrganizationChart",
        moduleId: "projects/projectOrganizationChart",
        title: "organizationChart",
        nav: true,
        settings: {
            General: false,
            permission: 464,
            caption: "procoor-icon-organization-chart"
        }
    },
    {
        route: "projectDistributionList",
        moduleId: "projects/projectDistributionList",
        title: "distributionList",
        nav: true,
        settings: {
            // General: true,
            permission: 629,
            caption: "procoor-icon-distribution-list",
            order: 2
        }
    },
    {
        route: "projectProjectHeaderFooter",
        moduleId: "projects/projectProjectHeaderFooter",
        title: "headerAndFooter",
        nav: true,
        settings: {
            // General: true,
            permission: 484,
            caption: "procoor-icon-project-page-setup",
            order: 5
        }
    },
    {
        route: "budgetCashFlow",
        moduleId: "projects/budgetCashFlow",
        title: "budgetcashFlow",
        nav: true,
        settings: { CostControl: true, permission: 522, order: 3 }
    },
    {
        route:
            "projectDistributionListAddEdit/:id(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "projects/projectDistributionListAddEdit",
        title: "Project Distribution List Addition",
        nav: false,
        settings: { General: false }
    },
    {
        route: "projectCheckListAddEdit/:id",
        moduleId: "projects/projectCheckListAddEdit",
        title: "Project Check List Addition",
        nav: false,
        settings: { General: false }
    },
    {
        route: "projectsForm",
        moduleId: "projects/projectsForm",
        title: "projectsForms",
        nav: true,
        settings: {
            General: false,
            permission: 907,
            caption: "procoor-icon-general-forms"
        }
    },
    {
        route: "accountsAlerts",
        moduleId: "accounts/accountsAlerts",
        title: "docAlerts",
        nav: true,
        settings: {
            // General: true,
            permission: 108,
            caption: "procoor-icon-alerts",
            order: 6
        }
    },
    {
        route: "accountsBic",
        moduleId: "accounts/accountsBic",
        title: "bicAlerts",
        nav: true,
        settings: {
            // General: true,
            permission: 109,
            caption: "procoor-icon-BIC",
            order: 7
        }
    },
    {
        route: "CommunicationMeetingAgenda",
        moduleId: "commonLogs",
        title: "meetingAgendaLog",
        nav: true,
        hash: "#CommunicationMeetingAgenda",
        settings: {
            Communication: true,
            permission: 456,
            caption: "procoor-icon-meeting-agenda",
            order: 5
        }
    },
    {
        route:
            "meetingAgendaAddEdit/:id(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "communication/meetingAgendaAddEdit",
        title: "Meeting Agenda Addition",
        nav: false,
        settings: { Communication: false }
    },
    {
        route:
            "projectWorkFlowAddEdit/:id(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "projects/projectWorkFlowAddEdit",
        title: "project Work Flow Add",
        nav: false,
        settings: { General: false }
    },
    {
        route: "expensesWorkFlowAddEdit/:id",
        moduleId: "projects/expensesWorkFlowAddEdit",
        title: "Expenses Work Flow Add",
        nav: false,
        settings: { General: false }
    },
    {
        route: "InternalMeetingMinutes",
        moduleId: "commonLogs",
        hash: "#InternalMeetingMinutes",
        title: "internalMeetingMinutes",
        nav: true,
        settings: {
            Communication: true,
            permission: 508,
            caption: "procoor-icon-internal-meeting-minutes",
            order: 6
        }
    },
    {
        route: "CommunicationMeetingMinutesExternal",
        moduleId: "commonLogs",
        hash: "#CommunicationMeetingMinutesExternal",
        title: "externalMeetingMinutes",
        nav: true,
        settings: {
            Communication: true,
            permission: 111,
            caption: "procoor-icon-external-meeting-minutes",
            order: 7
        }
    },
    {
        route:
            "meetingMinutesAddEdit/:Id(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "communication/meetingMinutesAddEdit",
        title: "communication Meeting Minutes Addition",
        nav: false,
        settings: { Communication: false }
    },
    {
        route: "Transmittal",
        moduleId: "commonLogs",
        title: "transmittal",
        nav: true,
        hash: "#Transmittal",
        settings: {
            Communication: true,
            permission: 88,
            caption: "procoor-icon-transmittals",
            order: 3
        }
    },
    {
        route:
            "transmittalAddEdit/:Id(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "communication/transmittalAddEdit",
        title: "Transmittal Addition",
        nav: false,
        settings: { Communication: false }
    },
    {
        route: "projectSchedule",
        moduleId: "commonLogs",
        title: "schedule",
        nav: true,
        hash: "#projectSchedule",
        settings: {
            Time: true,
            permission: 33,
            caption: "procoor-icon-schedule",
            order: 3
        }
    },
    {
        route:
            "projectScheduleAddEdit/:id(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "projects/projectScheduleAddEdit",
        title: "Project Schedule Add",
        nav: false,
        settings: { Time: false }
    },
    {
        route: "projectPrimaveraSchedule",
        moduleId: "commonLogs",
        title: "primaveraSchedule",
        nav: true,
        hash: "#projectPrimaveraSchedule",
        settings: {
            Time: true,
            permission: 586,
            caption: "procoor-icon-primavera",
            order: 4
        }
    },
    {
        route:
            "projectPrimaveraScheduleAddEdit/:id(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "projects/projectPrimaveraScheduleAddEdit",
        title: "Pimavera Schedule Activities Addition",
        nav: false,
        settings: { Time: false }
    },
    {
        route: "ProjectTasks",
        moduleId: "projects/projectTask",
        title: "projectTask",
        nav: true,
        settings: {
            Time: true,
            permission: 361,
            caption: "procoor-icon-task",
            order: 1
        }
    },
    {
        route:
            "projectTaskAddEdit/:id(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "projects/projectTaskAddEdit",
        title: "projectTaskAddEdit",
        nav: false,
        settings: { Time: false }
    },
    {
        route: "copyTo/:id",
        moduleId: "panels/copyTo",
        title: "copyTo",
        nav: true,
        settings: { Time: false }
    },
    {
        route: "sendToWorkFlow/:id",
        moduleId: "panels/sendToWorkFlow",
        title: "Send To Work Flow",
        nav: true,
        settings: { General: false }
    },
    {
        route: "taskGroupPanel",
        moduleId: "panels/taskGroupPanel",
        title: "Send To Task Group",
        nav: false
    },
    {
        route: "communicationTransmittalPanel",
        moduleId: "communication/TransmittalPanel",
        title: "Send To Transmittal",
        nav: false
    },
    {
        route: "sendToDistributionList/:id",
        moduleId: "panels/sendToDistributionList",
        title: "Send To Distribution List",
        nav: false
    },
    {
        route: "boq",
        moduleId: "commonLogs",
        title: "boq",
        nav: true,
        hash: "#boq",
        settings: {
            Contracts: true,
            caption: "procoor-icon-BOQ",
            permission: 620,
            order: 1
        }
    },
    {
        route:
            "boqAddEdit/:param1(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "contracts/boqAddEdit",
        title: "BOQ Addition",
        nav: false,
        settings: { Contracts: false }
    },
    {
        route: "qs",
        moduleId: "commonLogs",
        title: "contractsQs",
        nav: true,
        hash: "#qs",
        settings: {
            Contracts: true,
            caption: "procoor-icon-qauntity-survey",
            permission: 769,
            order: 4
        }
    },
    {
        route: "contractInfo",
        moduleId: "commonLogs",
        title: "projectContracts",
        hash: "#contractInfo",
        nav: true,
        settings: {
            Contracts: true,
            caption: "procoor-icon-contracts",
            permission: 143,
            order: 2
        }
    },
    {
        route:
            "contractInfoAddEdit/:param1(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "contracts/contractInfoAddEdit",
        title: " contract Info ",
        nav: false,
        settings: { Contracts: false }
    },
    {
        route: "subContractInfoAddEdit/:param1(/:projectId)",
        moduleId: "contracts/subContractInfoAddEdit",
        title: "subContracts",
        nav: true,
        settings: { Contracts: false }
    },
    // {
    //     route: "procurement",
    //     moduleId: "commonLogs",
    //     title: "proposalsComparison",
    //     nav: true,
    //     hash: "#procurement",
    //     settings: {
    //         Procurement: true,
    //         caption: "procoor-icon-procurement",
    //         permission: 170,
    //         order: 9
    //     }
    // }, 
    {
        route: "pco",
        moduleId: "commonLogs",
        title: "pco",
        nav: true,
        hash: "#pco",
        settings: {
            Contracts: true,
            caption: "procoor-icon-PCO",
            permission: 152,
            order: 8
        }
    },
    {
        route:
            "pcoAddEdit/:param1(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "contracts/pcoAddEdit",
        title: " contract PCO ",
        nav: false,
        settings: { Contracts: false }
    },
    {
        route:
            "qsAddEdit/:param1(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "contracts/qsAddEdit",
        title: "Add contractsQs ",
        nav: false,
        settings: { Contracts: false }
    },
    {
        route: "tenderAnalysis",
        moduleId: "commonLogs",
        title: "tenderAnalysis",
        nav: true,
        hash: "#tenderAnalysis",
        settings: {
            Contracts: true,
            caption: "procoor-icon-tenderAnalysis",
            permission: 573,
            order: 10
        }
    },
    {
        route:
            "tenderAnalysisAddEdit/:param1(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "contracts/tenderAnalysisAddEdit",
        title: "Add Tender Analysis",
        nav: false,
        settings: { Contracts: false }
    },
    {
        route: "requestPayments",
        moduleId: "commonLogs",
        title: "paymentRequistionLog",
        nav: true,
        hash: "#requestPayments",
        settings: {
            Contracts: true,
            caption: "procoor-icon-payment-requisitions",
            permission: 188,
            order: 5
        }
    },
    {
        route: "requestPaymentsAddEdit/:param1(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "contracts/requestPaymentsAddEdit",
        title: "Payment Requistion Edit",
        nav: false,
        settings: { Contracts: false }
    },
    {
        route: "requestPaymentsAddEditold/:param1(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "contracts/requestPaymentsAddEditold",
        title: "Payment Requistion Edit",
        nav: false,
        settings: { Contracts: false }
    },
    {
        route: "siteRequest",
        moduleId: "commonLogs",
        title: "materialRequest",
        nav: true,
        hash: "#siteRequest",
        settings: {
            Procurement: true,
            caption: "procoor-icon-site-request",
            permission: 120,
            order: 1
        }
    },
    {
        route:
            "siteRequestAddEdit/:param1(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "contracts/siteRequestAddEdit",
        title: "Contract Site Request Edit",
        nav: false,
        settings: { Procurement: false }
    },
    {
        route: "percOfMaterialReqProDetail",
        moduleId: "widgetsCharts/percOfMaterialReqProDetail",
        title: "percentOfMaterialRequestPerProject",
        nav: true
    },
    {
        route: "percOfApprovedSubmittalDetail",
        moduleId: "widgetsCharts/percOfApprovedSubmittalDetail",
        title: "percentOfApprovedSubmittalPerProject",
        nav: true
    },
    {
        route: "pendingItemInWorkFlowDetails",
        moduleId: "widgetsCharts/pendingItemInWorkFlowDetails",
        title: "pendingItemInWorkFlowDetails",
        nav: true
    },
    {
        route: "percentageExpensesTypeDetails",
        moduleId: "widgetsCharts/percentageExpensesTypeDetails",
        title: "percentageExpensesTypeDetails",
        nav: true
    },
    {
        route: "approvedInspectionRequestDetails",
        moduleId: "widgetsCharts/approvedInspectionRequestDetails",
        title: "approvedInspectionRequestDetails",
        nav: true
    },
    {
        route: "rejectedInspectionRequestDetails",
        moduleId: "widgetsCharts/rejectedInspectionRequestDetails",
        title: "rejectedInspectionRequestDetails",
        nav: true
    },
    {
        route: "completedActivitiesCommulaiveDetail",
        moduleId: "widgetsCharts/completedActivitiesCommulaiveDetail",
        title: "completedActivitiesCommulative",
        nav: true
    },
    {
        route: "completedActivitiesThisMonthDetail",
        moduleId: "widgetsCharts/completedActivitiesThisMonthDetail",
        title: "completedActivitiesThisMonth",
        nav: true
    },
    {
        route: "contractsPerProjectDetail",
        moduleId: "widgetsCharts/contractsPerProjectDetail",
        title: "contractsPerProject",
        nav: true
    },
    {
        route: "percOfRejectedSubmittalDetail",
        moduleId: "widgetsCharts/percOfRejectedSubmittalDetail",
        title: "percentOfRejectedSubmittalPerProject",
        nav: true
    },
    {
        route: "variationRequest",
        moduleId: "commonLogs",
        title: "variationRequest",
        nav: true,
        hash: "#variationRequest",
        settings: { Contracts: true, permission: 3166, order: 7 }
    },
    {
        route:
            "variationRequestAddEdit/:param1(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "contracts/variationRequestAddEdit",
        title: "Contract Variation Request Edit",
        nav: false,
        settings: { Contracts: false }
    },
    {
        route: "changeOrder",
        moduleId: "commonLogs",
        title: "cos",
        nav: true,
        hash: "#changeOrder",
        settings: {
            Contracts: true,
            caption: "procoor-icon-change-order",
            permission: 161,
            order: 9
        }
    },
    {
        route:
            "changeOrderAddEdit/:param1(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "contracts/changeOrderAddEdit",
        title: "Change Order Addition",
        nav: false,
        settings: { Contracts: false }
    },
    {
        route: "costCodingTree",
        moduleId: "commonLogs",
        title: "costCodingTree",
        nav: true,
        hash: "#costCodingTree",
        settings: {
            Contracts: false,
            caption: "procoor-icon-cost-coding-tree",
            permission: 138
        }
    },
    {
        route: "projectCostCodingTree",
        moduleId: "Project/ProjectCostCodingTree",
        title: "costCodingTree",
        nav: true,
        settings: { CostControl: true, order: 4 }
    },
    {
        route: "projectIssuesAddEdit/:param1(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "contracts/projectIssuesAddEdit",
        title: "Issue Addition",
        nav: false,
        settings: { Contracts: false }
    },
    {
        route: "projectIssues",
        moduleId: "commonLogs",
        title: "projectIssuesLog",
        nav: true,
        hash: "#projectIssues",
        settings: { Contracts: true, caption: "procoor-icon-Issues", permission: 24 }
    },
    {
        route: "paymentCertification",
        moduleId: "commonLogs",
        title: "paymentCertificationLog",
        nav: true,
        hash: "#paymentCertification",
        settings: { Contracts: true, caption: "procoor-icon-Issues", permission: 10070 }
    },
    {
        route: "purchaseOrderAddEdit/:param1(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "contracts/purchaseOrderAddEdit",
        title: "Purchase Order Addition",
        nav: false,
        settings: { Contracts: false }
    },
    {
        route: "purchaseOrder",
        moduleId: "commonLogs",
        title: "purchaseOrder",
        nav: true,
        hash: "#purchaseOrder",
        settings: {
            Procurement: true,
            caption: "procoor-icon-purchase-order",
            permission: 179,
            order: 2
        }
    },
    {
        route:
            "invoicesForPoAddEdit/:param1(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "contracts/invoicesForPoAddEdit",
        title: "Invoices Addition",
        nav: false,
        settings: { Contracts: false }
    },
    {
        route: "invoicesForPo",
        moduleId: "commonLogs",
        title: "invoicesForPO",
        nav: true,
        hash: "#invoicesForPo",
        settings: {
            Procurement: true,
            caption: "procoor-icon-invoices-for-PO",
            permission: 197,
            order: 10
        }
    },
    {
        route:
            "dailyReportsAddEdit/:id(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "site/dailyReportsAddEdit",
        title: "Daily Reports",
        nav: false,
        settings: { Site: false }
    }, 
    {
        route: "materialInspectionRequest",
        moduleId: "commonLogs",
        title: "materialInspectionRequest",
        nav: true,
        hash: "#materialInspectionRequest",
        settings: {
            QualityControl: true,
            permission: 934,
            caption: "procoor-icon-material-inspection",
            order: 6
        }
    },
    {
        route:
            "materialInspectionRequestAddEdit/:id(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "site/materialInspectionRequestAddEdit",
        title: "Material Inspection Request",
        nav: true,
        settings: { Site: false }
    },
    {
        route: "drawing",
        moduleId: "commonLogs",
        title: "drawing",
        nav: true,
        hash: "#drawing",
        settings: {
            Design: true,
            caption: "procoor-icon-drawing",
            permission: 3520
        }
    },
    {
        route: "drawingModification",
        moduleId: "commonLogs",
        title: "drawingModification",
        nav: true,
        hash: "#drawingModification",
        settings: {
            Design: true,
            caption: "procoor-icon-drawing",
            permission: 206
        }
    },
    {
        route:
            "addEditDrawing/:id(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:projectName)",
        moduleId: "design/addEditDrawing",
        title: "Drawing Addition",
        nav: false,
        settings: { Design: false }
    },
    {
        route:
            "addEditModificationDrawing/:id(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:projectName)",
        moduleId: "design/addEditModificationDrawing",
        title: "Drawing Modification Addition",
        nav: false,
        settings: { Design: false }
    },
    {
        route: "submittal",
        moduleId: "commonLogs",
        title: "Submittal",
        nav: true,
        hash: "#submittal",
        settings: {
            Site: true,
            permission: 224,
            caption: "procoor-icon-submittal",
            order: 1
        }
    },
    {
        route: "dailyReports",
        moduleId: "commonLogs",
        title: "dailyReports",
        nav: true,
        hash: "#dailyReports",
        settings: {
            Site: true,
            permission: 269,
            caption: "procoor-icon-submittal",
            order: 1
        }
    },
    {
        route:
            "submittalAddEdit/:id(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "site/submittalAddEdit",
        title: "Site Addition",
        nav: false,
        settings: { Site: false }
    },
    {
        route:
            "submittalSetsAddEdit/:id(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "site/submittalSetsAddEdit",
        title: "Submittal Set Addition",
        nav: false,
        settings: { Site: false }
    }, 
    {
        route: "drawingList",
        moduleId: "commonLogs",
        title: "drawingList",
        nav: true,
        hash: "#drawingList",
        settings: {
            Design: true,
            caption: "procoor-icon-drawing-list",
            permission: 305
        }
    },
    {
        route: "drawingSets",
        moduleId: "commonLogs",
        title: "drawingSets",
        nav: true,
        hash: "#drawingSets",
        settings: {
            Design: true,
            caption: "procoor-icon-drawing-list",
            permission: 305
        }
    },
    {
        route: "siteInstructions",
        moduleId: "commonLogs",
        title: "siteInstructions",
        nav: true,
        hash: "#siteInstructions",
        settings: {
            Site: true,
            permission: 639,
            caption: "procoor-icon-site-instructions",
            order: 4
        }
    },
    {
        route:
            "siteInstructionsAddEdit/:id(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "site/siteInstructionsAddEdit",
        title: "Site Instructions Addition",
        nav: false,
        settings: { Site: false }
    },
    {
        route:
            "drawingListAddEdit/:id(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "design/drawingListAddEdit",
        title: "Drawing List Addition",
        nav: false,
        settings: { Design: false }
    },
    {
        route: "materialRelease",
        moduleId: "commonLogs",
        title: "materialRelease",
        nav: true,
        hash: "#materialRelease",
        settings: {
            Procurement: true,
            permission: 251,
            caption: "procoor-icon-material-release",
            order: 5
        }
    },
    {
        route: "materialReturned",
        moduleId: "commonLogs",
        title: "materialReturned",
        nav: true,
        hash: "#materialReturned",
        settings: { Procurement: true, permission: 251, order: 6 }
    },
    {
        route: "materialInventory",
        moduleId: "site/materialInventory",
        title: "materialInventory",
        nav: true,
        settings: {
            Procurement: true,
            permission: 618,
            caption: "procoor-icon-project-inventory",
            order: 4
        }
    },
    {
        route:
            "TransferInventory/:id(/:inventoryId)",
        moduleId: "site/TransferInventory",
        title: "transferToProject",
        nav: true
    },
    {
        route: "requestsTransferItems",
        moduleId: "site/requestsTransferItems",
        title: "transferToProject",
        nav: true,
        settings: {
            Procurement: true,
            permission: 618,
            caption: "procoor-icon-project-inventory",
            order: 7
        }
    },
    {
        route:
            "materialInventoryAddEdit/:id(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "site/materialInventoryAddEdit",
        title: "Project Inventory Addition",
        nav: false,
        settings: { Procurement: false }
    },
    {
        route:
            "materialReleaseAddEdit/:id(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "site/materialReleaseAddEdit",
        title: "Material Release Addition",
        nav: false,
        settings: { Procurement: false }
    },
    {
        route:
            "materialReturnedAddEdit/:id(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "site/materialReturnedAddEdit",
        title: "Material Returned Addition",
        nav: false,
        settings: { Procurement: false }
    },
    {
        route: "materialDelivery",
        moduleId: "commonLogs",
        title: "materialDelivery",
        nav: true,
        hash: "#materialDelivery",
        settings: {
            Procurement: true,
            permission: 242,
            caption: "procoor-icon-material-delivery",
            order: 3
        }
    },
    {
        route:
            "materialDeliveryAddEdit/:id(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "site/materialDeliveryAddEdit",
        title: "Material Delivery Addition",
        nav: false,
        settings: { Procurement: false }
    },
    {
        route: "inspectionRequest",
        moduleId: "commonLogs",
        title: "inspectionRequest",
        nav: true,
        hash: "#inspectionRequest",
        settings: {
            QualityControl: true,
            permission: 370,
            caption: "procoor-icon-inspection-request",
            order: 5
        }
    },
    {
        route:
            "inspectionRequestAddEdit/:id(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "site/inspectionRequestAddEdit",
        title: "Inspection Request Addition",
        nav: false,
        settings: { Site: false }
    },
    {
        route: "tenderAnalysis",
        moduleId: "commonLogs",
        title: "tenderAnalysis",
        nav: true,
        hash: "#tenderAnalysis",
        settings: {
            Estimation: true,
            permission: 573,
            caption: "procoor-icon-tender-analysis",
            order: 1
        }
    },
    {
        route:
            "tenderAnalysisAddEdit/:id(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "estimation/tenderAnalysisAddEdit",
        title: "Tender Analysis Addition",
        nav: false,
        settings: { Estimation: false }
    },
    {
        route: "budgetFile",
        moduleId: "commonLogs",
        title: "budgetFile",
        nav: true,
        hash: "#budgetFile",
        settings: {
            Estimation: false,
            permission: 689,
            caption: "procoor-icon-budget-file"
        }
    },
    {
        route: "budgetFileAddEdit/:id",
        moduleId: "estimation/budgetFileAddEdit",
        title: "Budget File Addition",
        nav: false,
        settings: { Estimation: false }
    },
    {
        route: "budgetExpenses",
        moduleId: "estimation/budgetExpenses",
        title: "budgetExpenses",
        nav: true,
        hash: "#budgetExpenses",
        settings: {
            Estimation: true,
            permission: 413,
            caption: "procoor-icon-budgeted-expenses",
            order: 4
        }
    },
    {
        route: "punchList",
        moduleId: "commonLogs",
        title: "punchList",
        nav: true,
        hash: "#punchList",
        settings: {
            QualityControl: true,
            permission: 278,
            caption: "procoor-icon-punch-list",
            order: 7
        }
    },
    {
        route:
            "punchListAddEdit/:id(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "site/punchListAddEdit",
        title: "Punch List Addition",
        nav: false,
        settings: { Site: false }
    },
    {
        route: "base",
        moduleId: "commonLogs",
        title: "estimationBase",
        nav: true,
        hash: "#base",
        settings: {
            Estimation: true,
            permission: 581,
            caption: "procoor-icon-estimation-base",
            order: 3
        }
    },
    {
        route:
            "baseAddEdit/:id(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "estimation/baseAddEdit",
        title: "Estimation Base Addition",
        nav: false,
        settings: { Estimation: false }
    },
    {
        route: "projectEstimate",
        moduleId: "commonLogs",
        title: "projectEstimationTitle",
        nav: true,
        hash: "#projectEstimate",
        settings: {
            Estimation: true,
            permission: 595,
            caption: "procoor-icon-project-estimate",
            order: 2
        }
    },
    {
        route:
            "projectEstimateAddEdit/:id(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "estimation/projectEstimateAddEdit",
        title: "Project Estimate Addition",
        nav: false,
        settings: { Estimation: false }
    },
    {
        route: "projectEstimateItemAddEdit/:id(/:estimateId)(/:projectId)",
        moduleId: "estimation/projectEstimateItemAddEdit",
        title: "Project Estimate Item Addition",
        nav: false,
        settings: { Estimation: false }
    },
    {
        route: "clientModification",
        moduleId: "commonLogs",
        title: "clientModificationLog",
        nav: true,
        hash: "#clientModification",
        settings: {
            Site: true,
            caption: "procoor-icon-invoicesforPO",
            permission: 3137,
            order: 11
        }
    },
    {
        route:
            "clientModificationAddEdit/:param1(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "contracts/clientModificationAddEdit",
        title: "Client Modification Addition",
        nav: false,
        settings: { Contracts: false }
    },
    {
        route:
            "qualityControlAddEdit/:id(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "site/qualityControlAddEdit",
        title: "Quality Control",
        nav: false,
        settings: { Site: false }
    },
    {
        route: "clientSelection",
        moduleId: "commonLogs",
        title: "clientSelectionLog",
        nav: true,
        hash: "#clientSelection",
        settings: {
            Site: true,
            permission: 3151,
            caption: "fa fa-signal",
            order: 10
        }
    },
    {
        route:
            "clientSelectionAddEdit/:id(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "site/clientSelectionAddEdit",
        title: "Client Selection Addition",
        nav: false,
        settings: { Contracts: false }
    },
    {
        route: "accountQualityControl",
        moduleId: "accounts/accountQualityControl",
        title: "qualityControl",
        nav: true,
        settings: { Accounts: true }
    },
    {
        route: "Risk",
        moduleId: "commonLogs",
        title: "risk",
        nav: true,
        hash: "#Risk",
        settings: {
            CostControl: true,
            permission: 10004,
            caption: "procoor-icon-transmittals",
            order: 1
        }
    },
    {
        route: "budgetCashFlowReports",
        moduleId: "reports/budgetCashFlowReport",
        title: "budgetCashFlowReport",
        nav: true,
        settings: { CostControl: true, permission: 3186, order: 2 }
    },
    { 
        route: "rptCostCodingTree",
        moduleId: "reports/rptCostCodingTree",
        title: "costCodingTreeReport",
        nav: true,
        settings: { CostControl: true, permission: 401, order: 10 }
    },
    { 
        route: "projectTimeSheet",
        moduleId: "reports/projectTimeSheet",
        title: "timeSheetReport",
        nav: true,
        settings: { Reports: true, permission: 407, order: 11 }
    },
    { 
        route: "taskStatus",
        moduleId: "TaskReports/TasksStatus",
        title: "taskStatus",
        nav: true,
        settings: { Tasks: true, permission: 3698, order: 1 }
    },
    {
        route: "taskTimeSheet",
        moduleId: "TaskReports/TaskTimeSheet",
        title: "taskTimeSheet",
        nav: true,
        settings: { Tasks: true, permission: 3699, order: 2 }
    },
    { 
        route: "invoiceQuantity",
        moduleId: "reports/invoiceQuantity",
        title: "invoicedQuantities",
        nav: true,
        settings: { Reports: true, permission: 691, order: 5 }
    },
    {
        route: "MyTimeSheetUser",
        moduleId: "logs/MyTimeSheetUser",
        title: "timesheetLog",
        nav: true,
        settings: { permission: 334 }
    },
    {
        route: "myOvertime",
        moduleId: "logs/myOvertime",
        title: "overtime",
        nav: true,
        settings: { permission: 3395 }
    },
    {
        route: "lateTimeSheet",
        moduleId: "logs/lateTimeSheet",
        title: "lateTimeSheet",
        nav: true,
        settings: { permission: 3349 }
    },
    {
        route: "usersWithOutTimeSheet",
        moduleId: "TimeSheet/UsersWithOutTimeSheet",
        title: "usersWithoutTimeSheet",
        nav: true,
        settings: { HumanResources: true, permission: 3712, order: 6 }
    },
    {
        route: "expensesRpt",
        moduleId: "TimeSheet/ExpensesReport",
        title: "expensesReport",
        nav: true,
        settings: { HumanResources: true, permission: 3716, order: 10 }
    },
    {
        route: "ExpnesesUserRequests",
        moduleId: "OtherReports/ExpnesesUserRequests",
        title: "expnesesUserRequests",
        nav: true,
        settings: { OtherReports: true, permission: 3719, order: 1 }
    },
    {
        route: "ExpensesStatus",
        moduleId: "OtherReports/ExpensesStatus",
        title: "expensesStatus",
        nav: true,
        settings: { OtherReports: true, permission: 3759, order: 11 }
    },
    {
        route: "WFDistributionAccountReport",
        moduleId: "OtherReports/WFDistributionAccountReport",
        title: "wokFlowDistrbutionAccountsReport",
        nav: true,
        settings: { OtherReports: true, permission: 3720, order: 2 }
    },
    {
        route: "BudgetCashFlowAll",
        moduleId: "OtherReports/BudgetCashFlowAll",
        title: "budgetCashFlowAll",
        nav: true,
        settings: { OtherReports: true, permission: 3721, order: 3 }
    },
    {
        route: "budgetCashFlowReport",
        moduleId: "OtherReports/UsersAccountsReport",
        title: "usersAccountsReport",
        nav: true,
        settings: { OtherReports: true, permission: 3722, order: 4 }
    },
    {
        route: "WFActivityReport",
        moduleId: "OtherReports/WFActivityReport",
        title: "workFlowActivity",
        nav: true,
        settings: { OtherReports: true, permission: 4017, order: 5 }
    },
    {
        route: "WFUsageReport",
        moduleId: "OtherReports/WFUsageReport",
        title: "workFlowUsageReport",
        nav: true,
        settings: { OtherReports: true, permission: 3749, order: 8 }
    },
    {
        route: "PaymentReqStatusReport",
        moduleId: "OtherReports/PaymentReqStatusReport",
        title: "paymentReqStatusReport",
        nav: true,
        settings: { OtherReports: true, permission: 3758, order: 9 }
    },
    {
        route: "FollowUpUsageReport",
        moduleId: "OtherReports/FollowUpUsageReport",
        title: "followUpsUsageReport",
        nav: true,
        settings: { OtherReports: true, permission: 3750, order: 10 }
    },
    {
        route: "companyTimeSheet",
        moduleId: "TimeSheet/CompanyTimeSheetReport",
        title: "companyTimeSheet",
        nav: true,
        settings: { HumanResources: true, permission: 3711, order: 5 }
    },
    {
        route: "timeSheetRpt",
        moduleId: "TimeSheet/TimeSheetReport",
        title: "timeSheetReport",
        nav: true,
        settings: { HumanResources: true, permission: 3709, order: 3 }
    },
    {
        route: "overTimeRpt",
        moduleId: "TimeSheet/OverTimeRpt",
        title: "overTimeRpt",
        nav: true,
        settings: { HumanResources: true, permission: 3708, order: 2 }
    },
    {
        route: "projectTotaltimeSheetRpt",
        moduleId: "TimeSheet/ProjectTotaltimeSheet",
        title: "projectTotaltimeSheetRpt",
        nav: true,
        settings: { HumanResources: true, permission: 3714, order: 8 }
    },
    {
        route: "projectContactsTimeSheetRpt",
        moduleId: "TimeSheet/ProjectContactsTimeSheetRpt",
        title: "projectContactsTimeSheetRpt",
        nav: true,
        settings: { HumanResources: true, permission: 3715, order: 9 }
    },
    {
        route: "taskEstimatedHoursVariance",
        moduleId: "TaskReports/TaskEstimatedHoursVariance",
        title: "taskEstimatedHoursVariance",
        nav: true,
        settings: { Tasks: true, permission: 3700, order: 3 }
    },
    {
        route: "taskEstimatedHours",
        moduleId: "TaskReports/TaskEstimatedHours",
        title: "taskEstimatedHours",
        nav: true,
        settings: { Tasks: true, permission: 3701, order: 4 }
    },
    {
        route: "projectsWorkingHours",
        moduleId: "TaskReports/WorkingHours",
        title: "workHours",
        nav: true,
        settings: { Tasks: true, permission: 3702, order: 5 }
    },
    { 
        route: "projectTaskTree",
        moduleId: "projects/projectTaskTree",
        title: "taskTree",
        nav: true,
        settings: {
            permission: 814,
            caption: "procoor-icon-task-tree",
            order: 2
        }
    },
    {
        route: "myTasks",
        moduleId: "projects/myTasks",
        title: "myTasks",
        nav: true,
        settings: { UserProfile: true }
    },
    {
        route: "supervisorsWithUnapprovedTimeSheets",
        moduleId: "TimeSheet/supervisorsWithUnapprovedTimeSheets",
        title: "supervisorsWithUnapprovedTimeSheets",
        nav: true,
        settings: { HumanResources: true, permission: 3713, order: 7 }
    },
    {
        route: "Ncr",
        moduleId: "commonLogs",
        title: "NCRLog",
        nav: true,
        hash: "#Ncr",
        settings: {
            QualityControl: true,
            permission: 921,
            caption: "procoor-icon-NCR",
            order: 9
        }
    },
    {
        route: "overTime",
        moduleId: "TimeSheet/OverTimeReport",
        title: "overTimeSheet",
        nav: true,
        settings: { HumanResources: true, permission: 3710, order: 4 }
    },
    {
        route:
            "NCRAddEdit/:id(/:projectId)(/:isApproval)(/:acWorkFlowId)(/:arrage)(/:projectName)(/:isInbox)(/:isDistribution)",
        moduleId: "communication/NCRAddEdit",
        title: "NCR Addition",
        nav: false,
        settings: { Site: false }
    },
    {
        route: "invoicesLogWidget",
        moduleId: "accounts/invoicesLogWidget",
        title: "invoicesLogWidget",
        nav: true
    },
    {
        route: "correspondenceReceivedRpt",
        moduleId: "accounts/correspondenceReceivedRpt",
        title: "communicationCorrespondenceReceivedRpt",
        nav: true,
        settings: { GeneralConfig: true }
    },
    {
        route: "projectTypesTimeSheet",
        moduleId: "TimeSheet/ProjectTypesTimeSheet",
        title: "projectTypesTimeSheet",
        nav: true,
        settings: { HumanResources: true, permission: 3707, order: 1 }
    },
    {
        route: "taskWorkLoad",
        moduleId: "TaskReports/TaskWorkLoad",
        title: "taskWorkLoad",
        nav: true,
        settings: { Tasks: true, permission: 3703, order: 6 }
    },
    {
        route: "userTimeSheet",
        moduleId: "TaskReports/UserTimeSheet",
        title: "userTimeSheet",
        nav: true,
        settings: { Tasks: true, permission: 3704, order: 7 }
    },
    {
        route: "taskListReport",
        moduleId: "TaskReports/TasksList",
        title: "taskList",
        nav: true,
        settings: { Tasks: true, permission: 3705, order: 8 }
    },
    {
        route: "closedTaskReport",
        moduleId: "TaskReports/ClosedTasks",
        title: "closedTasks",
        nav: true,
        settings: { Tasks: true, permission: 3706, order: 9 }
    },
    {
        route: "specSectionChild",
        moduleId: "accounts/specSectionChild",
        title: "specsSection",
        nav: true,
        settings: { Accounts: true }
    },
    {
        route: "chat",
        moduleId: "reportCenter/chat",
        title: "chat",
        nav: true,
        settings: { Chat: true }
    },
    {
        route: "termsLog",
        moduleId: "accounts/termsLog",
        title: "termsLog",
        nav: true,
        settings: { Accounts: true }
    },
    {
        route: "vacationDetails",
        moduleId: "summary/vacationDetails",
        title: "requestApproval",
        nav: true
    },
    {
        route: "loansDetails",
        moduleId: "summary/loansDetails",
        title: "requestApproval",
        nav: true
    },
    {
        route: "summaryHrVacationDetails/:isDaily",
        moduleId: "summary/summaryHrVacationDetails",
        title: "HR Vacation Details",
        nav: true
    },
    {
        route: "summaryHrExcusesDetails/:isDaily",
        moduleId: "summary/summaryHrExcusesDetails",
        title: "HR Excuses Details",
        nav: true
    },
    {
        route: "missionDetails",
        moduleId: "summary/missionDetails",
        title: "mission Details",
        nav: true
    },
    {
        route: "pOContractConfig",
        moduleId: "accounts/pOContractConfig",
        title: "pOandContractConfig",
        nav: true,
        settings: { Projects: true }
    },
    {
        route: "distbutionInboxMessage",
        moduleId: "user/distbutionInboxMessage",
        title: "distbutionMessage",
        nav: true,
        settings: { UserProfile: true }
    },
    {
        route: "internalMessages",
        moduleId: "user/internalMessages",
        title: "internalMessage",
        nav: true,
        settings: { UserProfile: true }
    },
    {
        route: "lateTimeSheet",
        moduleId: "accounts/lateTimeSheet",
        title: "lateTimeSheet",
        nav: true,
        settings: { User: true }
    },
    {
        route: "imapConfigurationSettings",
        moduleId: "projects/imapConfigurationSettings",
        title: "imap Configuration Settings",
        nav: true,
        settings: { User: true }
    },
    {
        route: "options",
        moduleId: "user/options",
        title: "Options",
        nav: true
    },
    {
        route: "security",
        moduleId: "user/security",
        title: "security",
        nav: true
    },
    {
        route: "userSettings",
        moduleId: "user/userSettings",
        title: "userSettings",
        nav: true
    },
    {
        route: "userSignature",
        moduleId: "user/userSignature",
        title: "userSignature",
        nav: true
    },
    {
        route: "taskDetails/:id",
        moduleId: "projects/taskDetails",
        title: "Task Details",
        nav: true,
        settings: { Reports: false }
    },
    {
        route: "projectsFormAddEdit/:id",
        moduleId: "projects/projectsFormAddEdit",
        title: "projectsForms",
        nav: true,
        settings: { General: false }
    },
    {
        route: "docApprovalLog/:type",
        moduleId: "summary/docApprovalLog",
        title: "doc Approval Log",
        nav: true
    },
    {
        route: "docNotifyLog",
        moduleId: "summary/docNotifyLog",
        title: "doc Notify Log",
        nav: true
    },
    {
        route: "followUpsSummaryDetails",
        moduleId: "summary/followUpsSummaryDetails",
        title: "Follow Ups Summary Details",
        nav: false
    },
    {
        route: "levelDurationAlertDetails",
        moduleId: "summary/levelDurationAlertDetails",
        title: "Level Duration Alert Details",
        nav: false
    },
    {
        route: "distributioninboxListSummary/:param1(/:item)",
        moduleId: "projects/distributioninboxListSummary",
        title: "distributioninboxListSummary",
        nav: false
    },
    {
        route: "customMIR",
        moduleId: "customLogs/customCommonLog",
        title: "materialInspectionRequest",
        nav: true,
        hash: "#customMIR",
        settings: { customLogs: true, permission: 3361, order: 1 }
    },
    {
        route: "customNCR",
        moduleId: "customLogs/customCommonLog",
        title: "NCRLog",
        nav: true,
        hash: "#customNCR",
        settings: { customLogs: true, permission: 3378, order: 2 }
    },
    {
        route: "customSiteInstruction",
        moduleId: "customLogs/customCommonLog",
        title: "siteInstructions",
        nav: true,
        hash: "#customSiteInstruction",
        settings: { customLogs: true, permission: 3400, order: 3 }
    },
    {
        route: "customIR",
        moduleId: "customLogs/customCommonLog",
        title: "inspectionRequest",
        nav: true,
        hash: "#customIR",
        settings: { customLogs: true, permission: 3418, order: 4 }
    },
    {
        route: "customInvoiceForPO",
        moduleId: "customLogs/customCommonLog",
        title: "invoicesForPO",
        nav: true,
        hash: "#customInvoiceForPO",
        settings: { customLogs: true, permission: 3436, order: 5 }
    },
    {
        route: "customeCorrespondenceSent",
        moduleId: "customLogs/customCommonLog",
        title: "correspondenceSent",
        nav: true,
        hash: "#customeCorrespondenceSent",
        settings: { customLogs: true, permission: 3454, order: 6 }
    },
    {
        route: "customeCorrespondenceReceived",
        moduleId: "customLogs/customCommonLog",
        title: "correspondenceReceived",
        nav: true,
        hash: "#customeCorrespondenceReceived",
        settings: { customLogs: true, permission: 3472, order: 7 }
    },
    {
        route: "deliveredQuantitieReport",
        moduleId: "reports/deliveredQuantitieReport",
        title: "deliveredMaterial",
        nav: true,
        hash: "#deliveredQuantitieReport",
        settings: { Reports: true, order: 17 }
    },
    {
        route: "contractsBoqQuantities",
        moduleId: "reports/contractsBoqQuantities",
        title: "boqCostReport",
        nav: true,
        hash: "#contractsBoqQuantities",
        settings: { Reports: true, order: 7 }
    },
    {
        route: "budgetVarianceSummaryDetails",
        moduleId: "widgetsCharts/budgetVarianceSummaryDetails",
        title: "budgetVarianceSummaryDetails",
        nav: true
    },
    {
        route: "InvoicesLogReport",
        moduleId: "ContractsPOReports/InvoicesLogReport",
        title: "invoicesReport",
        nav: true,
        settings: { ContractsPo: true, permission: 3694, order: 4 }
    },
    {
        route: "siteRequestReleasedQnt",
        moduleId: "ContractsPOReports/SiteRequestReleasedQnt",
        title: "siteRequestReleasedQntReport",
        nav: true,
        settings: { ContractsPo: true, permission: 3693, order: 3 }
    },
    {
        route: "collectedPaymentRequisition",
        moduleId: "ContractsPOReports/CollectedPaymentRequisition",
        title: "collectedPaymentRequisition",
        nav: true,
        settings: { ContractsPo: true, permission: 3692, order: 2 }
    },
    {
        route: "ProjectInvoices",
        moduleId: "ContractsPOReports/ProjectInvoices",
        title: "projectInvoices",
        nav: true,
        settings: { ContractsPo: true, permission: 3691, order: 1 }
    },
    {
        route: "executiveSummary",
        moduleId: "ContractsPOReports/executiveSummary",
        title: "executiveSummary",
        nav: true,
        settings: { ContractsPo: true, permission: 3697, order: 7 }
    },
    {
        route: "compareApprovedQuantity",
        moduleId: "ContractsPOReports/compareApprovedQuantity",
        title: "compareApprovedQuantity",
        nav: true,
        settings: { ContractsPo: true, permission: 3769, order: 8 }
    },
    {
        route: "paymentRequisition",
        moduleId: "ContractsPOReports/paymentRequisition",
        title: "paymentRequisition",
        nav: true,
        settings: { ContractsPo: true, permission: 3696, order: 6 }
    }, 
    {
        route: "boqStructure",
        moduleId: "projects/boqStructure",
        title: "boqStructure",
        nav: true,
        settings: {
            // General: true,
            permission: 3670,
            order: 6
        }
    }, 
    {
        route: "RequestPaymentDeductionTypeReport",
        moduleId: "ContractsPOReports/RequestPaymentDeductionTypeReport",
        title: "RequestPaymentDeductionTypeReport",
        nav: true,
        settings: {
            ContractsPo: true,
            permission: 10075,
            order: 10
        }
    }, 
    { //start inventory Items Routes
        route: "inventoryRpt",
        moduleId: "InventoryItemsReports/InventoryItems",
        title: "inventoryRpt",
        nav: true,
        settings: { inventory: true, permission: 3723, order: 1 }
    },
    {
        route: "materialsSuspended",
        moduleId: "InventoryItemsReports/SluggishMaterials",
        title: "materialsSuspended",
        nav: true,
        settings: { inventory: true, permission: 3724, order: 2 }
    },
    {
        route: "materialInventoryReport",
        moduleId: "InventoryItemsReports/MaterialInventory",
        title: "materialInventoryReport",
        nav: true,
        settings: { inventory: true, permission: 3665, order: 3 }
    },
    {
        route: "materialInventoryByInterval",
        moduleId: "InventoryItemsReports/MaterialInventoryByInterval",
        title: "materialInventoryByInterval",
        nav: true,
        settings: { inventory: true, permission: 3726, order: 4 }
    },
    {
        route: "transfarePerProject",
        moduleId: "InventoryItemsReports/TransfarePerProject",
        title: "transfarePerProject",
        nav: true,
        settings: { inventory: true, permission: 3727, order: 5 }
    },
    {
        route: "TotalsOfStockReport",
        moduleId: "InventoryItemsReports/TotalsOfStockReport",
        title: "totalsOfStockReport",
        nav: true,
        settings: { inventory: true, permission: 3728, order: 6 }
    },
    ,
    {
        route: "releaseReport",
        moduleId: "InventoryItemsReports/ReleaseReport",
        title: "releaseReport",
        nav: true,
        settings: { inventory: true, permission: 3729, order: 7 }
    },
    {
        route: "documentTpesReport",
        moduleId: "OtherReports/DocumentTpesReport",
        title: "WorkFlowWithDocumentTypeDetails",
        nav: true,
        settings: { OtherReports: true, permission: 3743, order: 6 }
    },
    {
        route: "documentAllTypesReport",
        moduleId: "OtherReports/DocumentAllTypesReport",
        title: "WorkFlowWithDocumentAllTypesDetails",
        nav: true,
        settings: { OtherReports: true, permission: 3743, order: 7 }
    },
    {
        route: "TransmittalReport",
        moduleId: "OtherReports/TransmittalReport",
        title: "transmittalReport",
        nav: true,
        settings: { OtherReports: true, permission: 4018, order: 8 }
    },
    {
        route: "TechnicalOfficeReport",
        moduleId: "TechnicalOffice/TechnicalOfficeReport",
        title: "technicalOfficeDocument",
        nav: true,
        settings: { technicalOffice: true, permission: 3760, order: 1 }
    },
    {
        route: "submittalsPerNeighBorhood",
        moduleId: "TechnicalOffice/SubmittalsPerNeighBorhood",
        title: "submittalsPerNeighBorhood",
        nav: true,
        settings: { technicalOffice: true, permission: 3761, order: 2 }
    },
    {
        route: "ProgressDocuments",
        moduleId: "TechnicalOffice/ProgressDocuments",
        title: "onProgressDocuments",
        nav: true,
        settings: { technicalOffice: true, permission: 3762, order: 3 }
    }, 
    {
        route: "contractorsPerformance",
        moduleId: "TechnicalOffice/ContractorsPerformance",
        title: "contractorsPerformance",
        nav: true,
        settings: { technicalOffice: true, permission: 3764, order: 5 }
    },
    {
        route: "Area",
        moduleId: "ProjectEPSLog",
        title: "area",
        nav: true,
        settings: {
            // General: true,
            permission: 3784,
            caption: "procoor-icon-BIC",
            order: 8
        }
    },
    {
        route: "Location",
        moduleId: "ProjectEPSLog",
        title: "location",
        nav: true,
        settings: {
            // General: true,
            permission: 3788,
            caption: "procoor-icon-BIC",
            order: 9
        }
    },
    {
        route: "Building",
        moduleId: "ProjectEPSLog",
        title: "Buildings",
        nav: true,
        settings: {
            // General: true,
            permission: 4012,
            caption: "procoor-icon-BIC",
            order: 10
        }
    },
    {
        route: "Unit",
        moduleId: "ProjectEPSLog",
        title: "unit",
        nav: true,
        settings: {
            // General: true,
            permission: 4016,
            caption: "procoor-icon-BIC",
            order: 11
        }
    },
    {
        route: "Risk",
        moduleId: "RiskReports/RiskStatus",
        title: "riskStatus",
        nav: true,
        settings: {
            RiskReport: true,
            permission: 4022,
            caption: "procoor-icon-BIC",
            order: 11
        }
    },
    {
        route: "Risk",
        moduleId: "RiskReports/RiskPriority",
        title: "riskPeriority",
        nav: true,
        settings: {
            RiskReport: true,
            permission: 4023,
            caption: "procoor-icon-BIC",
            order: 11
        }
    },
    {
        route: "Risk",
        moduleId: "RiskReports/RiskOwner",
        title: "ownerRisk",
        nav: true,
        settings: {
            RiskReport: true,
            permission: 4024,
            caption: "procoor-icon-BIC",
            order: 11
        }
    },
    {
        route: "Risk",
        moduleId: "RiskReports/RiskCategory",
        title: "riskCategory",
        nav: true,
        settings: {
            RiskReport: true,
            permission: 4025,
            caption: "procoor-icon-BIC",
            order: 11
        }
    },
    {
        route: "Risk",
        moduleId: "RiskReports/RiskReports",
        title: "riskReports",
        nav: true,
        settings: {
            RiskReport: true,
            permission: 4026,
            caption: "procoor-icon-BIC",
            order: 11
        }
    }, { //start inventory Items Routes
        route: "ExpnesesUserRequests",
        moduleId: "OtherReports/ExpnesesUserRequests",
        title: "expnesesUserRequests",
        nav: true,
        settings: { OtherReports: true, permission: 3719, order: 1 }
    },
];

export default routes;
