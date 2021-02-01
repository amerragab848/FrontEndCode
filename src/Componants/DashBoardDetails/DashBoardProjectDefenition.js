import Resources from "../../resources.json";
let currentLanguage =
  localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

let widgets = [
  {
    title: "monthlyPo",
    key: "0-1-1",
    apiDetails: "GetTotalPoDetails?projectId=",
    columns: [
      {
        field: 'subject',
        title: Resources['subject'][currentLanguage],
        width: 15,
        groupable: true,
        fixed: true,
        type: "text",
        sortable: true,
        classes: 'bold' 
      },
      {
        field: 'statusName',
        title: Resources['status'][currentLanguage],
        width: 6,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'projectName',
        title: Resources['projectName'][currentLanguage],
        width: 8,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'docDate',
        title: Resources['docDate'][currentLanguage],
        width: 6,
        groupable: true,
        fixed: false,
        type: "date",
        sortable: true
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
    key: "0-1-2",
    apiDetails: "GetTotalMaterialRequestCountingForProject?projectId=",
    columns: [
      {
        field: 'arrange',
        title: Resources['arrange'][currentLanguage],
        width: 6,
        groupable: true,
        fixed: true,
        type: "text",
        sortable: true
      },
      {
        field: 'projectName',
        title: Resources['projectName'][currentLanguage],
        width: 8,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'subject',
        title: Resources['subject'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'companyName',
        title: Resources['CompanyName'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'disciplineName',
        title: Resources['descipline'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'docDate',
        title: Resources['docDate'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "date",
        sortable: true
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
    title: "monthlyPaymentRequisitions",
    key: "0-1-3",
    apiDetails: "GetTotalPaymentDetailsForProject?projectId=",
    columns: [
      {
        field: 'subject',
        title: Resources['subject'][currentLanguage],
        width: 25,
        groupable: true,
        fixed: true,
        type: "text",
        sortable: true,
        classes: 'bold' 
      },
      {
        field: 'statusName',
        title: Resources['status'][currentLanguage],
        width: 6,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      }, 
      {
        field: 'contractName',
        title: Resources['contractSubject'][currentLanguage],
        width: 15,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'totalEarned',
        title: Resources['totalEarned'][currentLanguage],
        width: 12,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'docDate',
        title: Resources['docDate'][currentLanguage],
        width: 8,
        groupable: true,
        fixed: false,
        type: "date",
        sortable: true
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
    key: "0-2-1",
    apiDetails: "GetApprocalStatusDetails?status=true&projectId=",
    columns: [
      {
        field: 'refNo',
        title: Resources['refNo'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: true,
        type: "text",
        sortable: true
      },
      {
        field: 'statusName',
        title: Resources['statusName'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'subject',
        title: Resources['subject'][currentLanguage],
        width: 20,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'approvalStatusName',
        title: Resources['approvalStatus'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'docDate',
        title: Resources['docDate'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "date",
        sortable: true
      },
      {
        field: 'approvedDate',
        title: Resources['approvedDate'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "date",
        sortable: true
      },
      {
        field: 'lastWorkFlow',
        title: Resources['lastWorkFlow'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'contractName',
        title: Resources['contractName'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'duration',
        title: Resources['duration'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'docCloseDate',
        title: Resources['docClosedate'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "date",
        sortable: true
      },
      {
        field: 'cycleDate',
        title: Resources['cycleDate'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "date",
        sortable: true
      },
      {
        field: 'cycleCloseDate',
        title: Resources['cycleCloseDate'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "date",
        sortable: true
      },
      {
        field: 'submittalType',
        title: Resources['submittalType'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'cyclesCount',
        title: Resources['cyclesCount'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'disciplineName',
        title: Resources['disciplineName'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'area',
        title: Resources['area'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'location',
        title: Resources['location'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
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
    key: "0-2-2",
    apiDetails: "GetOpenedDocumentsDetails?docType=42&projectId=",
    columns: [
      {
        field: 'subject',
        title: Resources['subject'][currentLanguage],
        width: 20,
        groupable: true,
        fixed: true,
        type: "text",
        sortable: true
      },
      {
        field: 'statusName',
        title: Resources['status'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'projectName',
        title: Resources['projectName'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'docDate',
        title: Resources['docDate'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "date",
        sortable: true
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
    key: "0-2-3",
    apiDetails: "GetApprocalStatusDetails?status=false&projectId=",
    columns: [
      {
        field: 'refNo',
        title: Resources['refNo'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: true,
        type: "text",
        sortable: true
      },
      {
        field: 'statusName',
        title: Resources['statusName'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'subject',
        title: Resources['subject'][currentLanguage],
        width: 20,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'approvalStatusName',
        title: Resources['approvalStatus'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'docDate',
        title: Resources['docDate'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "date",
        sortable: true
      },
      {
        field: 'approvedDate',
        title: Resources['approvedDate'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "date",
        sortable: true
      },
      {
        field: 'lastWorkFlow',
        title: Resources['lastWorkFlow'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'contractName',
        title: Resources['contractName'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'duration',
        title: Resources['duration'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'docCloseDate',
        title: Resources['docClosedate'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "date",
        sortable: true
      },
      {
        field: 'cycleDate',
        title: Resources['cycleDate'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "date",
        sortable: true
      },
      {
        field: 'cycleCloseDate',
        title: Resources['cycleCloseDate'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "date",
        sortable: true
      },
      {
        field: 'submittalType',
        title: Resources['submittalType'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'cyclesCount',
        title: Resources['cyclesCount'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'disciplineName',
        title: Resources['disciplineName'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'area',
        title: Resources['area'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'location',
        title: Resources['location'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
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
    key: "0-3-1",
    apiDetails: "GetOpenedDocumentsDetails?docType=19&projectId=",
    columns: [
      {
        field: 'subject',
        title: Resources['subject'][currentLanguage],
        width: 20,
        groupable: true,
        fixed: true,
        type: "text",
        sortable: true
      },
      {
        field: 'statusName',
        title: Resources['status'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'projectName',
        title: Resources['projectName'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'docDate',
        title: Resources['docDate'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "date",
        sortable: true
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
    key: "0-3-2",
    apiDetails: "GetOpenedDocumentsDetails?docType=25&projectId=",
    columns: [
      {
        field: 'subject',
        title: Resources['subject'][currentLanguage],
        width: 20,
        groupable: true,
        fixed: true,
        type: "text",
        sortable: true
      },
      {
        field: 'statusName',
        title: Resources['status'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'projectName',
        title: Resources['projectName'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'docDate',
        title: Resources['docDate'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "date",
        sortable: true
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
    key: "0-3-3",
    apiDetails: "GetTotalPaymentDetailsForProject?projectId=",
    columns: [
      {
        field: 'statusName',
        title: Resources['statusName'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: true,
        type: "text",
        sortable: true
      },
      {
        field: 'subject',
        title: Resources['subject'][currentLanguage],
        width: 20,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'fromCompanyName',
        title: Resources['fromCompany'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'fromContactName',
        title: Resources['fromContact'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'toCompanyName',
        title: Resources['toCompany'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'toContactName',
        title: Resources['ToContact'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'sendDate',
        title: Resources['sendDate'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "date",
        sortable: true
      },
      {
        field: 'docCloseDate',
        title: Resources['docClosedate'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "date",
        sortable: true
      },
      {
        field: 'building',
        title: Resources['Building'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'docDate',
        title: Resources['docDate'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "date",
        sortable: true
      },
      {
        field: 'answerDate',
        title: Resources['answerDate'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'refDoc',
        title: Resources['refDoc'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'discipline',
        title: Resources['disciplineTitle'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'requiredDate',
        title: Resources['requiredDate'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "date",
        sortable: true
      },
      {
        field: 'cycleNo',
        title: Resources['cycleNo'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'openedBy',
        title: Resources['openedBy'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'closedBy',
        title: Resources['closedBy'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'lastEditBy',
        title: Resources['lastEdit'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'lastEditDate',
        title: Resources['lastEditDate'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "date",
        sortable: true
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
    key: "0-3-4",
    apiDetails: "GetOpenedDocumentsDetails?docType=28&projectId=",
    columns: [
      {
        field: 'subject',
        title: Resources['subject'][currentLanguage],
        width: 20,
        groupable: true,
        fixed: true,
        type: "text",
        sortable: true
      },
      {
        field: 'statusName',
        title: Resources['status'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'projectName',
        title: Resources['projectName'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'docDate',
        title: Resources['docDate'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "date",
        sortable: true
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
    key: "0-4-1",
    apiDetails: "GetCountInspectionDetails?status=null&projectId=",
    columns: [
      {
        field: 'arrange',
        title: Resources['arrange'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: true,
        type: "text",
        sortable: true
      },
      {
        field: 'projectName',
        title: Resources['projectName'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'subject',
        title: Resources['subject'][currentLanguage],
        width: 20,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'statusName',
        title: Resources['status'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'docDate',
        title: Resources['docDate'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "date",
        sortable: true
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
    key: "0-4-2",
    apiDetails: "GetCountInspectionDetails?status=false&projectId=",
    columns: [
      {
        field: 'arrange',
        title: Resources['arrange'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: true,
        type: "text",
        sortable: true
      },
      {
        field: 'projectName',
        title: Resources['projectName'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'subject',
        title: Resources['subject'][currentLanguage],
        width: 20,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'statusName',
        title: Resources['status'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'docDate',
        title: Resources['docDate'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "date",
        sortable: true
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
    key: "0-4-3",
    apiDetails: "GetCountInspectionDetails?status=false&projectId=",
    columns: [
      {
        field: 'arrange',
        title: Resources['arrange'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: true,
        type: "text",
        sortable: true
      },
      {
        field: 'projectName',
        title: Resources['projectName'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'subject',
        title: Resources['subject'][currentLanguage],
        width: 20,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'statusName',
        title: Resources['status'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'docDate',
        title: Resources['docDate'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "date",
        sortable: true
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
    title: "inspectionRequestCount",
    key: "1-6-2",
    RouteEdit:'', 
    apiDetails: "GetInspectionRequest",
     columns: [
      {
        field: 'subject',
        title: Resources['subject'][currentLanguage],
        width: 20,
        groupable: true,
        fixed: true,
        type: "text",
        sortable: true,
    },
    {
      field: 'statusName',
      title: Resources['status'][currentLanguage],
      width: 10,
      groupable: true,
      fixed: false,
      type: "text",
      sortable: true,
  },
  {
    field: 'projectName',
    title: Resources['projectName'][currentLanguage],
    width: 10,
    groupable: true,
    fixed: false,
    type: "text",
    sortable: true,
},
{
  field: 'docDate',
  title: Resources['docDate'][currentLanguage],
  width: 10,
  groupable: true,
  fixed: false,
  type: "date",
  sortable: true,
},
{
  field: "fromCompanyName",
  title: Resources['docDate'][currentLanguage],
  width: 10,
  groupable: true,
  fixed: false,
  type: "text",
  sortable: true,
},
{
  field: 'fromContactName',
  title: Resources['fromContact'][currentLanguage],
  width: 10,
  groupable: true,
  fixed: false,
  type: "text",
  sortable: true
},
{
  field: 'toCompanyName',
  title: Resources['toCompany'][currentLanguage],
  width: 10,
  groupable: true,
  fixed: false,
  type: "text",
  sortable: true
},
{
  field: 'toContactName',
  title: Resources['ToContact'][currentLanguage],
  width: 10,
  groupable: true,
  fixed: false,
  type: "text",
  sortable: true
},
{
  field: 'cyclesCount',
  title: Resources['cyclesCount'][currentLanguage],
  width: 10,
  groupable: true,
  fixed: false,
  type: "text",
  sortable: true
},
{
  field: 'refDoc',
  title: Resources['refDoc'][currentLanguage],
  width: 10,
  groupable: true,
  fixed: false,
  type: "text",
  sortable: true
},
{
  field: 'revisions',
  title: Resources['refDoc'][currentLanguage],
  width: 10,
  groupable: true,
  fixed: false,
  type: "text",
  sortable: true
},
{
  field: 'docCloseDate',
  title: Resources['docClosedate'][currentLanguage],
  width: 10,
  groupable: true,
  fixed: false,
  type: "date",
  sortable: true
},
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
];

export default widgets;
