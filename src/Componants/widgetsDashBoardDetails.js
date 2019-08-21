let widgets = {
    "monthlyPo": {
        "title": "monthlyPo",
        "props": {
            "permission": 0,
            "type": "oneWidget",
            "api": "GetTotalPoForProjectId?projectId=",
            "route": "DashBoardProjectCounterLog",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "0-1-1"
        }
    },
    "materialRequestcount": {
        "title": "materialRequestcount",
        "props": {
            "permission": 0,
            "type": "oneWidget",
            "api": "GetMaterialRequestCountingForProject?projectId=",
            "route": "DashBoardProjectCounterLog",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "0-1-2"
        }
    },
    "monthlyPaymentRequisitions": {
        "title": "monthlyPaymentRequisitions",
        "props": {
            "permission": 0,
            "type": "oneWidget",
            "api": "GetTotalPaymentForProject?projectId=",
            "route": "DashBoardProjectCounterLog",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "0-1-3"
        }
    },
    "approvalSubmittals": {
        "title": "approvalSubmittals",
        "props": {
            "permission": 0,
            "type": "twoWidget",
            "api": "GetApprocalStatusCount?status=true&projectId=",
            "route": "DashBoardProjectCounterLog",
            "value": "total-0",
            "total": "total-1",
            "action": "action",
            "key": "0-1-4"
        }
    },
    "openedSubmittals": {
        "title": "openedSubmittals",
        "props": {
            "permission": 0,
            "type": "twoWidget",
            "api": "getOpenedDocumentsCount?docType=42&projectId=",
            "route": "DashBoardProjectCounterLog",
            "value": "count-0",
            "total": "total-1",
            "action": "action",
            "key": "0-1-5"
        }
    },
    "rejectedSubmittals": {
        "title": "rejectedSubmittals",
        "props": {
            "permission": 0,
            "type": "twoWidget",
            "api": "GetApprocalStatusCount?status=false&projectId=",
            "route": "DashBoardProjectCounterLog",
            "value": "total-0",
            "total": "total-1",
            "action": "action",
            "key": "0-1-6"
        }
    },
    "openedLetters": {
        "title": "openedLetters",
        "props": {
            "permission": 0,
            "type": "twoWidget",
            "api": "getOpenedDocumentsCount?docType=19&projectId=",
            "route": "DashBoardProjectCounterLog",
            "value": "count-0",
            "total": "total-1",
            "action": "action",
            "key": "0-1-7"
        }
    },
    "openedIR": {
        "title": "openedIR",
        "props": {
            "permission": 0,
            "type": "twoWidget",
            "api": "getOpenedDocumentsCount?docType=25&projectId=",
            "route": "DashBoardProjectCounterLog",
            "value": "count-0",
            "total": "total-1",
            "action": "action",
            "key": "0-1-8"
        }
    },
    "rfiOpen": {
        "title": "rfiOpen",
        "props": {
            "permission": 0,
            "type": "twoWidget",
            "api": "GetRfiOpenCount?projectId=",
            "route": "DashBoardProjectCounterLog",
            "value": "total-0",
            "total": "total-1",
            "action": "action",
            "key": "0-1-9"
        }
    },
    "openedTransmittals": {
        "title": "openedTransmittals",
        "props": {
            "permission": 0,
            "type": "twoWidget",
            "api": "getOpenedDocumentsCount?docType=28&projectId=",
            "route": "DashBoardProjectCounterLog",
            "value": "count-0",
            "total": "total-1",
            "action": "action",
            "key": "0-2-1"
        }
    },
    "countinspectionPanding": {
        "title": "countinspectionPanding",
        "props": {
            "permission": 0,
            "type": "oneWidget",
            "api": "GetCountinspectionForProject?status=null&projectId=",
            "route": "DashBoardProjectCounterLog",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "0-2-2"
        }
    },
    "countinspectionReject": {
        "title": "countinspectionReject",
        "props": {
            "permission": 0,
            "type": "oneWidget",
            "api": "GetCountinspectionForProject?status=false&projectId=",
            "route": "DashBoardProjectCounterLog",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "0-2-3"
        }
    },
    "countinspectionApproved": {
        "title": "countinspectionApproved",
        "props": {
            "permission": 0,
            "type": "oneWidget",
            "api": "GetCountinspectionForProject?status=true&projectId=",
            "route": "DashBoardProjectCounterLog",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "0-2-4"
        }
    },
    "avgRespondTimeLetters": {
        "title": "avgRespondTimeLetters",
        "props": {
            "permission": 0,
            "type": "oneWidget",
            "api": "GetAvgTimeRespond?isMonthly=false&docType=19&projectId=",
            "route": "",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "0-2-5"
        }
    },
    "avgRespondTimeTransmittals": {
        "title": "avgRespondTimeTransmittals",
        "props": {
            "permission": 0,
            "type": "oneWidget",
            "api": "GetAvgTimeRespond?isMonthly=false&docType=28&projectId=",
            "route": "",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "0-2-6"
        }
    },
    "avgRespondTimeIR": {
        "title": "avgRespondTimeIR",
        "props": {
            "permission": 0,
            "type": "oneWidget",
            "api": "GetAvgTimeRespond?isMonthly=false&docType=25&projectId=",
            "route": "",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "0-2-7"
        }
    },
    "avgRespondTimeMIR": {
        "title": "avgRespondTimeMIR",
        "props": {
            "permission": 0,
            "type": "oneWidget",
            "api": "GetAvgTimeRespond?isMonthly=false&docType=103&projectId=",
            "route": "",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "0-2-8"
        }
    },
    "avgRespondTimeRFI": {
        "title": "avgRespondTimeRFI",
        "props": {
            "permission": 0,
            "type": "oneWidget",
            "api": "GetAvgTimeRespond?isMonthly=false&docType=23&projectId=",
            "route": "",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "0-2-9"
        }
    },
    "avgRespondTimeSubmittals": {
        "title": "avgRespondTimeSubmittals",
        "props": {
            "permission": 0,
            "type": "oneWidget",
            "api": "GetAvgTimeRespond?isMonthly=false&docType=42&projectId=",
            "route": "",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "0-2-10"
        }
    },
    "avgRespondTimePO": {
        "title": "avgRespondTimePO",
        "props": {
            "permission": 0,
            "type": "oneWidget",
            "api": "GetAvgTimeRespond?isMonthly=false&docType=70&projectId=",
            "route": "",
            "value": "total",
            "listType": "item",
            "action": "action",
            "key": "0-2-11"
        }
    }
}

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