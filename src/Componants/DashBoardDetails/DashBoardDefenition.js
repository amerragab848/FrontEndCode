import Resources from "../../resources.json";
let currentLanguage =
  localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

let widgets = [
  {
    title: "monthlyPo",
    key: "1-1-1",
    RouteEdit:'', 
    apiDetails: "GetTotalPoDetails",
    columns: [
      {
        key: "subject",
        name: Resources["subject"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "statusName",
        name: Resources["status"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "projectName",
        name: Resources["projectName"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "docDate",
        name: Resources["docDate"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter",
        formatter: "dateFormate"
      }
    ],
    filterApi: "",
    filters: [
      {
        field: "subject",
        name: "subject",
        type: "string",
        isCustom: true
      },
      {
        field: "statusName",
        name: "status",
        type: "toggle",
        trueLabel: "oppened",
        falseLabel: "closed",
        isCustom: true
      },
      {
        field: "projectName",
        name: "projectName",
        type: "string",
        isCustom: true
      },
      {
        field: "docDate",
        name: "docDate",
        type: "date",
        isCustom: true
      }
    ]
  },
  {
    title: "materialRequestcount",
    key: "1-1-2",
    RouteEdit:'', 
    apiDetails: "GetTotalMaterialRequestCounting",
    columns: [
      {
        key: "arrange",
        name: Resources["arrange"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "projectName",
        name: Resources["projectName"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "subject",
        name: Resources["subject"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "companyName",
        name: Resources["CompanyName"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter" 
      },
      {
        key: "disciplineName",
        name: Resources["descipline"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter" 
      },
      {
        key: "docDate",
        name: Resources["docDate"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter",
        formatter: "dateFormate"
      }
    ],
    filterApi: "",
    filters: [
      {
        field: "arrange",
        name: "arrange",
        type: "number",
        isCustom: true
      },
      {
        field: "projectName",
        name: "projectName",
        type: "string",
        isCustom: true
      },
      {
        field: "subject",
        name: "subject",
        type: "string",
        isCustom: true
      },
      {
        field: "companyName",
        name: "CompanyName",
        type: "string",
        isCustom: true
      },
      {
        field: "disciplineName",
        name: "descipline",
        type: "string",
        isCustom: true
      },
      {
        field: "docDate",
        name: "docDate",
        type: "date",
        isCustom: true
      }
    ]
  },
  {
    title: "rejectedTimeSheet",
    key: "1-1-3",
    RouteEdit:'', 
    apiDetails: "GetRejectedTimesheetBySystem-pageNumber=0&pageSize=200",
    columns: [
      {
        key: "docDate",
        name: Resources["docDate"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter",
        formatter: "dateFormate"
      },
      {
        key: "description",
        name: Resources["description"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "projectName",
        name: Resources["projectName"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "hours",
        name: Resources["hours"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter" 
      },
      {
        key: "comment",
        name: Resources["comment"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter" 
      }
    ],
    filterApi: "",
    filters: [
      {
        field: "docDate",
        name: "docDate",
        type: "date",
        isCustom: true
      },
      {
        field: "description",
        name: "description",
        type: "string",
        isCustom: true
      },
      {
        field: "projectName",
        name: "projectName",
        type: "string",
        isCustom: true
      },
      {
        field: "hours",
        name: "hours",
        type: "string",
        isCustom: true
      },
      {
        field: "comment",
        name: "comment",
        type: "string",
        isCustom: true
      }
    ]
  },
  {
    title: "monthlyPaymentRequisitions",
    key: "1-1-4",
    RouteEdit:'', 
    apiDetails: "GetTotalPaymentDetails",
    columns: [
      {
        key: "subject",
        name: Resources["subject"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter" 
      },
      {
        key: "statusName",
        name: Resources["status"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "projectName",
        name: Resources["projectName"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "contractName",
        name: Resources["contractSubject"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "totalEarned",
        name: Resources["totalEarned"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "docDate",
        name: Resources["docDate"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter",
        formatter: "dateFormate"
      }
    ],
    filterApi: "",
    filters: [
      {
        field: "subject",
        name: "subject",
        type: "string",
        isCustom: true
      },
      {
        field: "statusName",
        name: "status",
        type: "toggle",
        trueLabel: "oppened",
        falseLabel: "closed"
      },
      {
        field: "projectName",
        name: "projectName",
        type: "string",
        isCustom: true
      },
      {
        field: "contractName",
        name: "contractSubject",
        type: "string",
        isCustom: true
      },
      {
        field: "totalEarned",
        name: "totalEarned",
        type: "string",
        isCustom: true
      },
      {
        field: "docDate",
        name: "docDate",
        type: "date",
        isCustom: true
      }
    ]
  },
  {
    title: "approvalSubmittals",
    key: "1-2-1",
    apiDetails: "GetApprocalStatusDetails?status=true",
    RouteEdit:'submittalAddEdit',
    columns: [
      {
        key: "refNo",
        name: Resources["refNo"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter" 
      },
      {
        key: "statusName",
        name: Resources["statusName"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "subject",
        name: Resources["subject"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "approvalStatusName",
        name: Resources["approvalStatus"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "docDate",
        name: Resources["docDate"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter",
        formatter: "dateFormate"
      },
      {
        key: "approvedDate",
        name: Resources["approvedDate"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter",
        formatter: "dateFormate"
      },
      {
        key: "lastWorkFlow",
        name: Resources["lastWorkFlow"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "contractName",
        name: Resources["contractName"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "duration",
        name: Resources["duration"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "docCloseDate",
        name: Resources["docClosedate"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter",
        formatter: "dateFormate"
      },
      {
        key: "cycleDate",
        name: Resources["cycleDate"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter",
        formatter: "dateFormate"
      },
      {
        key: "cycleCloseDate",
        name: Resources["cycleCloseDate"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter",
        formatter: "dateFormate"
      },
      {
        key: "submittalType",
        name: Resources["submittalType"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "cyclesCount",
        name: Resources["cyclesCount"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "disciplineName",
        name: Resources["disciplineName"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "area",
        name: Resources["area"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "location",
        name: Resources["location"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      }
    ],
    filterApi: "",
    filters: [
      {
        field: "refNo",
        name: "refNo",
        type: "string",
        isCustom: true
      },
      {
        field: "statusName",
        name: "statusName",
        type: "toggle",
        trueLabel: "oppened",
        falseLabel: "closed"
      },
      {
        field: "subject",
        name: "subject",
        type: "string",
        isCustom: true
      },
      {
        field: "approvalStatusName",
        name: "approvalStatus",
        type: "toggle",
        trueLabel: "approvalModalApprove",
        falseLabel: "rejected"
      },
      {
        field: "docDate",
        name: "docDate",
        type: "date",
        isCustom: true
      },
      {
        field: "approvedDate",
        name: "approvedDate",
        type: "date",
        isCustom: true
      },
      {
        field: "lastWorkFlow",
        name: "lastWorkFlow",
        type: "string",
        isCustom: true
      },
      {
        field: "contractName",
        name: "contractName",
        type: "string",
        isCustom: true
      },
      {
        field: "duration",
        name: "duration",
        type: "string",
        isCustom: true
      },
      {
        field: "docCloseDate",
        name: "docClosedate",
        type: "date",
        isCustom: true
      },
      {
        field: "cycleDate",
        name: "cycleDate",
        type: "date",
        isCustom: true
      },
      {
        field: "cycleCloseDate",
        name: "cycleCloseDate",
        type: "date",
        isCustom: true
      },
      {
        field: "submittalType",
        name: "submittalType",
        type: "string",
        isCustom: true
      },
      {
        field: "cyclesCount",
        name: "cyclesCount",
        type: "string",
        isCustom: true
      },
      {
        field: "disciplineName",
        name: "disciplineName",
        type: "string",
        isCustom: true
      },
      {
        field: "area",
        name: "area",
        type: "string",
        isCustom: true
      },
      {
        field: "location",
        name: "location",
        type: "string",
        isCustom: true
      }
    ]
  },
  {
    title: "openedSubmittals",
    key: "1-2-2",
    RouteEdit:'submittalAddEdit',
    apiDetails: "GetOpenedDocumentsDetails?docType=42",
    columns: [
      {
        key: "subject",
        name: Resources["subject"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "statusName",
        name: Resources["status"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "projectName",
        name: Resources["projectName"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "docDate",
        name: Resources["docDate"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter",
        formatter: "dateFormate"
      }
    ],
    filterApi: "",
    filters: [
      {
        field: "subject",
        name: "subject",
        type: "string",
        isCustom: true
      },
      {
        field: "statusName",
        name: "status",
        type: "toggle",
        trueLabel: "oppened",
        falseLabel: "closed"
      },
      {
        field: "projectName",
        name: "projectName",
        type: "string",
        isCustom: true
      },
      {
        field: "docDate",
        name: "docDate",
        type: "date",
        isCustom: true
      }
    ]
  },
  {
    title: "rejectedSubmittals",
    key: "1-2-3",
    RouteEdit:'submittalAddEdit',
    apiDetails: "GetApprocalStatusDetails?status=false",
    columns: [
      {
        key: "refNo",
        name: Resources["refNo"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "statusName",
        name: Resources["statusName"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "subject",
        name: Resources["subject"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "approvalStatusName",
        name: Resources["approvalStatus"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "docDate",
        name: Resources["docDate"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter",
        formatter: "dateFormate"
      },
      {
        key: "approvedDate",
        name: Resources["approvedDate"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter",
        formatter: "dateFormate"
      },
      {
        key: "lastWorkFlow",
        name: Resources["lastWorkFlow"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "contractName",
        name: Resources["contractName"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "duration",
        name: Resources["duration"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "docCloseDate",
        name: Resources["docClosedate"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter",
        formatter: "dateFormate"
      },
      {
        key: "cycleDate",
        name: Resources["cycleDate"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter",
        formatter: "dateFormate"
      },
      {
        key: "cycleCloseDate",
        name: Resources["cycleCloseDate"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter",
        formatter: "dateFormate"
      },
      {
        key: "submittalType",
        name: Resources["submittalType"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "cyclesCount",
        name: Resources["cyclesCount"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "disciplineName",
        name: Resources["disciplineName"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "area",
        name: Resources["area"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "location",
        name: Resources["location"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      }
    ],
    filterApi: "",
    filters: [
        {
          field: "refNo",
          name: "refNo",
          type: "string",
          isCustom: true
        },
        {
          field: "statusName",
          name: "statusName",
          type: "toggle",
          trueLabel: "oppened",
          falseLabel: "closed"
        },
        {
          field: "subject",
          name: "subject",
          type: "string",
          isCustom: true
        },
        {
          field: "approvalStatusName",
          name: "approvalStatus",
          type: "toggle",
          trueLabel: "approvalModalApprove",
          falseLabel: "rejected"
        },
        {
          field: "docDate",
          name: "docDate",
          type: "date",
          isCustom: true
        },
        {
          field: "approvedDate",
          name: "approvedDate",
          type: "date",
          isCustom: true
        },
        {
          field: "lastWorkFlow",
          name: "lastWorkFlow",
          type: "string",
          isCustom: true
        },
        {
          field: "contractName",
          name: "contractName",
          type: "string",
          isCustom: true
        },
        {
          field: "duration",
          name: "duration",
          type: "string",
          isCustom: true
        },
        {
          field: "docCloseDate",
          name: "docClosedate",
          type: "date",
          isCustom: true
        },
        {
          field: "cycleDate",
          name: "cycleDate",
          type: "date",
          isCustom: true
        },
        {
          field: "cycleCloseDate",
          name: "cycleCloseDate",
          type: "date",
          isCustom: true
        },
        {
          field: "submittalType",
          name: "submittalType",
          type: "string",
          isCustom: true
        },
        {
          field: "cyclesCount",
          name: "cyclesCount",
          type: "string",
          isCustom: true
        },
        {
          field: "disciplineName",
          name: "disciplineName",
          type: "string",
          isCustom: true
        },
        {
          field: "area",
          name: "area",
          type: "string",
          isCustom: true
        },
        {
          field: "location",
          name: "location",
          type: "string",
          isCustom: true
        }
      ]
    },
  {
    title: "openedLetters",
    RouteEdit:'lettersAddEdit',
    key: "1-3-1",
    apiDetails: "GetOpenedDocumentsDetails?docType=19",
    columns: [
      {
        key: "subject",
        name: Resources["subject"][currentLanguage],
        width: 350,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter" 
      },
      {
        key: "statusName",
        name: Resources["status"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "projectName",
        name: Resources["projectName"][currentLanguage],
        width: 300,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "docDate",
        name: Resources["docDate"][currentLanguage],
        width: 200,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter",
        formatter: "dateFormate"
      }
    ],
    filterApi: "",
    filters: [
      {
        field: "subject",
        name: "subject",
        type: "string",
        isCustom: true
      },
      {
        field: "statusName",
        name: "status",
        type: "toggle",
        trueLabel: "oppened",
        falseLabel: "closed"
      },
      {
        field: "projectName",
        name: "projectName",
        type: "string",
        isCustom: true
      },
      {
        field: "docDate",
        name: "docDate",
        type: "date",
        isCustom: true
      }
    ]
  },
  {
    title: "openedIR",
    key: "1-3-2",
    RouteEdit:'inspectionRequestAddEdit',
    apiDetails: "GetOpenedDocumentsDetails?docType=25",
    columns: [
      {
        key: "subject",
        name: Resources["subject"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter" 
      },
      {
        key: "statusName",
        name: Resources["status"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "projectName",
        name: Resources["projectName"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "docDate",
        name: Resources["docDate"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter",
        formatter: "dateFormate"
      }
    ],
    filterApi: "",
    filters: [
      {
        field: "subject",
        name: "subject",
        type: "string",
        isCustom: true
      },
      {
        field: "statusName",
        name: "status",
        type: "toggle",
        trueLabel: "oppened",
        falseLabel: "closed"
      },
      {
        field: "projectName",
        name: "projectName",
        type: "string",
        isCustom: true
      },
      {
        field: "docDate",
        name: "docDate",
        type: "date",
        isCustom: true
      }
    ]
  },
  {
    title: "rfiOpen",
    key: "1-3-3",
    RouteEdit:'RfiAddEdit', 
    apiDetails: "GetRfiOpenDetails",
    columns: [
      {
        key: "statusName",
        name: Resources["statusName"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "subject",
        name: Resources["subject"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter" 
      },
      {
        key: "fromCompanyName",
        name: Resources["fromCompany"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "fromContactName",
        name: Resources["fromContact"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "toCompanyName",
        name: Resources["toCompany"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "toContactName",
        name: Resources["ToContact"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "sendDate",
        name: Resources["sendDate"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter",
        formatter: "dateFormate"
      },
      {
        key: "docCloseDate",
        name: Resources["docClosedate"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter",
        formatter: "dateFormate"
      },
      {
        key: "building",
        name: Resources["Building"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "docDate",
        name: Resources["docDate"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter",
        formatter: "dateFormate"
      },
      {
        key: "answerDate",
        name: Resources["answerDate"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter",
        formatter: "dateFormate"
      },
      {
        key: "refDoc",
        name: Resources["refDoc"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "discipline",
        name: Resources["disciplineTitle"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "requiredDate",
        name: Resources["requiredDate"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter",
        formatter: "dateFormate"
      },
      {
        key: "cycleNo",
        name: Resources["cycleNo"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "openedBy",
        name: Resources["openedBy"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "closedBy",
        name: Resources["closedBy"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "lastEditBy",
        name: Resources["lastEdit"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "lastEditDate",
        name: Resources["lastEditDate"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter",
        formatter: "dateFormate"
      }
    ],
    filterApi: "",
    filters: [
      {
        field: "statusName",
        name: "statusName",
        type: "toggle",
        trueLabel: "oppened",
        falseLabel: "closed"
      },
      {
        field: "subject",
        name: "subject",
        type: "string",
        isCustom: true
      },
      {
        field: "fromCompanyName",
        name: "fromCompany",
        type: "string",
        isCustom: true
      },
      {
        field: "fromContactName",
        name: "fromContact",
        type: "string",
        isCustom: true
      },
      {
        field: "toCompanyName",
        name: "toCompany",
        type: "string",
        isCustom: true
      },
      {
        field: "toContactName",
        name: "toContactName",
        type: "string",
        isCustom: true
      },
      {
        field: "sendDate",
        name: "sendDate",
        type: "date",
        isCustom: true
      },
      {
        field: "docCloseDate",
        name: "docClosedate",
        type: "date",
        isCustom: true
      },
      {
        field: "building",
        name: "Buildings",
        type: "string",
        isCustom: true
      },
      {
        field: "docDate",
        name: "docDate",
        type: "date",
        isCustom: true
      },
      {
        field: "answerDate",
        name: "answerDate",
        type: "date",
        isCustom: true
      },
      {
        field: "refDoc",
        name: "refDoc",
        type: "string",
        isCustom: true
      },
      {
        field: "discipline",
        name: "disciplineTitle",
        type: "string",
        isCustom: true
      },
      {
        field: "requiredDate",
        name: "requiredDate",
        type: "date",
        isCustom: true
      },
      {
        field: "cycleNo",
        name: "cycleNo",
        type: "string",
        isCustom: true
      },
      {
        field: "openedBy",
        name: "openedBy",
        type: "string",
        isCustom: true
      },
      {
        field: "closedBy",
        name: "closedBy",
        type: "string",
        isCustom: true
      },
      {
        field: "lastEditBy",
        name: "lastEdit",
        type: "string",
        isCustom: true
      },
      {
        field: "lastEditDate",
        name: "lastEditDate",
        type: "date",
        isCustom: true
      }
    ]
  },
  {
    title: "openedTransmittals",
    key: "1-3-4",
    RouteEdit:'TransmittalAddEdit', 
    apiDetails: "GetOpenedDocumentsDetails?docType=28",
    columns: [
      {
        key: "subject",
        name: Resources["subject"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "statusName",
        name: Resources["status"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "projectName",
        name: Resources["projectName"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "docDate",
        name: Resources["docDate"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter",
        formatter: "dateFormate"
      }
    ],
    filterApi: "",
    filters: [
      {
        field: "subject",
        name: "subject",
        type: "string",
        isCustom: true
      },
      {
        field: "statusName",
        name: "status",
        type: "toggle",
        trueLabel: "oppened",
        falseLabel: "closed"
      },
      {
        field: "projectName",
        name: "projectName",
        type: "string",
        isCustom: true
      },
      {
        field: "docDate",
        name: "docDate",
        type: "date",
        isCustom: true
      }
    ]
  },
  {
    title: "countinspectionPanding",
    key: "1-4-1",
    RouteEdit:'', 
    apiDetails: "GetCountInspectionDetails?status=null",
    columns: [
      {
        key: "arrange",
        name: Resources["arrange"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "projectName",
        name: Resources["projectName"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "subject",
        name: Resources["subject"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "statusName",
        name: Resources["status"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "docDate",
        name: Resources["docDate"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter",
        formatter: "dateFormate"
      }
    ],
    filterApi: "",
    filters: [
      {
        field: "arrange",
        name: "arrange",
        type: "number",
        isCustom: true
      },
      {
        field: "projectName",
        name: "projectName",
        type: "string",
        isCustom: true
      },
      {
        field: "subject",
        name: "subject",
        type: "string",
        isCustom: true
      },
      {
        field: "statusName",
        name: "status",
        type: "toggle",
        trueLabel: "oppened",
        falseLabel: "closed"
      },
      {
        field: "docDate",
        name: "docDate",
        type: "date",
        isCustom: true
      }
    ]
  },
  {
    title: "countinspectionReject",
    key: "1-4-2",
    RouteEdit:'', 
    apiDetails: "GetCountInspectionDetails?status=false",
    columns: [
      {
        key: "arrange",
        name: Resources["arrange"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "projectName",
        name: Resources["projectName"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "subject",
        name: Resources["subject"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "statusName",
        name: Resources["status"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "docDate",
        name: Resources["docDate"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter",
        formatter: "dateFormate"
      }
    ],
    filterApi: "",
    filters: [
      {
        field: "arrange",
        name: "arrange",
        type: "number",
        isCustom: true
      },
      {
        field: "projectName",
        name: "projectName",
        type: "string",
        isCustom: true
      },
      {
        field: "subject",
        name: "subject",
        type: "string",
        isCustom: true
      },
      {
        field: "statusName",
        name: "status",
        type: "toggle",
        trueLabel: "oppened",
        falseLabel: "closed"
      },
      {
        field: "docDate",
        name: "docDate",
        type: "date",
        isCustom: true
      }
    ]
  },
  {
    title: "countinspectionApproved",
    key: "1-4-3",
    RouteEdit:'', 
    apiDetails: "GetCountInspectionDetails?status=false",
    columns: [
      {
        key: "arrange",
        name: Resources["arrange"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "projectName",
        name: Resources["projectName"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "subject",
        name: Resources["subject"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "statusName",
        name: Resources["status"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter"
      },
      {
        key: "docDate",
        name: Resources["docDate"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        filterRenderer: "SingleSelectFilter",
        formatter: "dateFormate"
      }
    ],
    filterApi: "",
    filters: [
      {
        field: "arrange",
        name: "arrange",
        type: "number",
        isCustom: true
      },
      {
        field: "projectName",
        name: "projectName",
        type: "string",
        isCustom: true
      },
      {
        field: "subject",
        name: "subject",
        type: "string",
        isCustom: true
      },
      {
        field: "statusName",
        name: "status",
        type: "toggle",
        trueLabel: "oppened",
        falseLabel: "closed"
      },
      {
        field: "docDate",
        name: "docDate",
        type: "date",
        isCustom: true
      }
    ]
  }
];

export default widgets;
