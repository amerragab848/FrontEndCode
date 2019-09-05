let widgets = [
    {
        "title": "monthlyPo",
        "props": {
            "permission": 10048,
            "type": "oneWidget",
            "api": "GetTotalPoForProjectId?projectId=",
            "route": "DashBoardProjectCounterLog",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "0-1-1"
        }
    },
    {
        "title": "materialRequestcount",
        "props": {
            "permission": 10049,
            "type": "oneWidget",
            "api": "GetMaterialRequestCountingForProject?projectId=",
            "route": "DashBoardProjectCounterLog",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "0-1-2"
        }
    },
    {
        "title": "monthlyPaymentRequisitions",
        "props": {
            "permission": 10050,
            "type": "oneWidget",
            "api": "GetTotalPaymentForProject?projectId=",
            "route": "DashBoardProjectCounterLog",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "0-1-3"
        }
    },
    {
        "title": "approvalSubmittals",
        "props": {
            "permission": 10051,
            "type": "twoWidget",
            "api": "GetApprocalStatusCount?status=true&projectId=",
            "route": "DashBoardProjectCounterLog",
            "value": "total-0",
            "total": "total-1",
            "action": "action",
            "key": "0-1-4"
        }
    },
    {
        "title": "openedSubmittals",
        "props": {
            "permission": 10052,
            "type": "twoWidget",
            "api": "getOpenedDocumentsCount?docType=42&projectId=",
            "route": "DashBoardProjectCounterLog",
            "value": "count-0",
            "total": "total-1",
            "action": "action",
            "key": "0-1-5"
        }
    },
    {
        "title": "rejectedSubmittals",
        "props": {
            "permission": 10053,
            "type": "twoWidget",
            "api": "GetApprocalStatusCount?status=false&projectId=",
            "route": "DashBoardProjectCounterLog",
            "value": "total-0",
            "total": "total-1",
            "action": "action",
            "key": "0-1-6"
        }
    },
    {
        "title": "openedLetters",
        "props": {
            "permission": 10054,
            "type": "twoWidget",
            "api": "getOpenedDocumentsCount?docType=19&projectId=",
            "route": "DashBoardProjectCounterLog",
            "value": "count-0",
            "total": "total-1",
            "action": "action",
            "key": "0-1-7"
        }
    },
    {
        "title": "openedIR",
        "props": {
            "permission": 10055,
            "type": "twoWidget",
            "api": "getOpenedDocumentsCount?docType=25&projectId=",
            "route": "DashBoardProjectCounterLog",
            "value": "count-0",
            "total": "total-1",
            "action": "action",
            "key": "0-1-8"
        }
    },
    {
        "title": "rfiOpen",
        "props": {
            "permission": 10056,
            "type": "twoWidget",
            "api": "GetRfiOpenCount?projectId=",
            "route": "DashBoardProjectCounterLog",
            "value": "total-0",
            "total": "total-1",
            "action": "action",
            "key": "0-1-9"
        }
    },
    {
        "title": "openedTransmittals",
        "props": {
            "permission": 10057,
            "type": "twoWidget",
            "api": "getOpenedDocumentsCount?docType=28&projectId=",
            "route": "DashBoardProjectCounterLog",
            "value": "count-0",
            "total": "total-1",
            "action": "action",
            "key": "0-2-1"
        }
    },
    {
        "title": "countinspectionPanding",
        "props": {
            "permission": 10058,
            "type": "oneWidget",
            "api": "GetCountinspectionForProject?status=null&projectId=",
            "route": "DashBoardProjectCounterLog",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "0-2-2"
        }
    },
    {
        "title": "countinspectionReject",
        "props": {
            "permission": 10059,
            "type": "oneWidget",
            "api": "GetCountinspectionForProject?status=false&projectId=",
            "route": "DashBoardProjectCounterLog",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "0-2-3"
        }
    },
    {
        "title": "countinspectionApproved",
        "props": {
            "permission": 10060,
            "type": "oneWidget",
            "api": "GetCountinspectionForProject?status=true&projectId=",
            "route": "DashBoardProjectCounterLog",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "0-2-4"
        }
    },
    {
        "title": "avgRespondTimeLetters",
        "props": {
            "permission": 10061,
            "type": "oneWidget",
            "api": "GetAvgTimeRespond?isMonthly=false&docType=19&projectId=",
            "route": "",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "0-2-5"
        }
    },
    {
        "title": "avgRespondTimeTransmittals",
        "props": {
            "permission": 10062,
            "type": "oneWidget",
            "api": "GetAvgTimeRespond?isMonthly=false&docType=28&projectId=",
            "route": "",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "0-2-6"
        }
    },
    {
        "title": "avgRespondTimeIR",
        "props": {
            "permission": 10063,
            "type": "oneWidget",
            "api": "GetAvgTimeRespond?isMonthly=false&docType=25&projectId=",
            "route": "",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "0-2-7"
        }
    },
    {
        "title": "avgRespondTimeMIR",
        "props": {
            "permission": 10064,
            "type": "oneWidget",
            "api": "GetAvgTimeRespond?isMonthly=false&docType=103&projectId=",
            "route": "",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "0-2-8"
        }
    },
    {
        "title": "avgRespondTimeRFI",
        "props": {
            "permission": 10065,
            "type": "oneWidget",
            "api": "GetAvgTimeRespond?isMonthly=false&docType=23&projectId=",
            "route": "",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "0-2-9"
        }
    },
    {
        "title": "avgRespondTimeSubmittals",
        "props": {
            "permission": 10066,
            "type": "oneWidget",
            "api": "GetAvgTimeRespond?isMonthly=false&docType=42&projectId=",
            "route": "",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "0-2-10"
        }
    },
    {
        "title": "avgRespondTimePO",
        "props": {
            "permission": 10067,
            "type": "oneWidget",
            "api": "GetAvgTimeRespond?isMonthly=false&docType=70&projectId=",
            "route": "",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "0-2-11"
        }
    }
]

let categories = {
    '1': {
        title: 'counters',
        type: 1
    },
    '2': {
        title: 'Submittal',
        type: 1
    },
    '3': {
        title: 'communication',
        type: 1
    },
    '4': {
        title: 'inspectionRequest',
        type: 1
    },
    '5': {
        title: 'respondTime',
        type: 1
    }
};

export default { widgets, categories };