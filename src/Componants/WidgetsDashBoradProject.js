var DashBoardWidgets = [ 
  { 
    widgetCategory: "counters",
    refrence: 0,
    key: "0-1",
    canView: false,
    checked:false,
    order: 1,
    widgets: [
       { 
        title: "monthlyPo",
        key: "0-1-1",
        canView: false,
        checked:false,
        order: 1,
        type:"oneWidget",
        props: {
          api: "GetTotalPoForProjectId?projectId=",
          route: "DashBoardProjectCounterLog",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false,
          key: "0-1-1"
       }
      },  
      { 
        title: "materialRequestcount",
        key: "0-1-2",
        canView: false,
        checked:false,
        order: 2,
        type:"oneWidget",
        props: {
          api: "GetMaterialRequestCountingForProject?projectId=",
          route: "DashBoardProjectCounterLog",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false,
          key: "0-1-2"
       }
      }, 
      { 
        title: "monthlyPaymentRequisitions",
        key: "0-1-4",
        canView: false,
        checked:false,
        order: 4,
        type:"oneWidget",
        props: {
          api: "GetTotalPaymentForProject?projectId=",
          route: "DashBoardProjectCounterLog",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false,
          key: "0-1-4"
       }
      }
    ]
  },
  { 
    widgetCategory: "Submittal",
    refrence: 0,
    key: "0-2",
    canView: false,
    checked:false,
    order: 2,
    widgets: [
      { 
        title: "approvalSubmittals",
        key: "0-2-1",
        canView: false,
        checked:false,
        order: 1,
        type:"twoWidget",
        props: {
          api: "GetApprocalStatusCount?status=true&projectId=",
          route: "DashBoardProjectCounterLog",
          value: "total-0",
          total: "total-1",
          action: "action",
          isModal: false,
          key: "0-2-1"
       }
      },
      { 
        title: "openedSubmittals",
        key: "0-2-2",
        canView: false,
        checked:false,
        order: 2,
        type:"twoWidget",
        props: {
          api: "getOpenedDocumentsCount?docType=42&projectId=",
          route: "DashBoardProjectCounterLog",
          value: "count-0",
          total: "total-1",
          action: "action",
          isModal: false,
          key: "0-2-2"
       }
      },
      { 
        title: "rejectedSubmittals",
        key: "0-2-3",
        canView: false,
        checked:false,
        order: 3,
        type:"twoWidget",
        props: {
          api: "GetApprocalStatusCount?status=false&projectId=",
          route: "DashBoardProjectCounterLog",
          value: "total-0",
          total: "total-1",
          action: "action",
          isModal: false,
          key: "0-2-3"
       }
      } 
    ]
  },
  { 
    widgetCategory: "communication",
    refrence: 0,
    key: "0-3",
    canView: false,
    checked:false,
    order: 3,
    widgets: [
      { 
        title: "openedLetters",
        key: "0-3-1",
        canView: false,
        checked:false,
        order: 1,
        type:"twoWidget",
        props: {
          api: "getOpenedDocumentsCount?docType=19&projectId=",
          route: "DashBoardProjectCounterLog",
          value: "count-0",
          total: "total-1",
          action: "action",
          isModal: false,
          key: "0-3-1"
       }
      },
      { 
        title: "openedIR",
        key: "0-3-2",
        canView: false,
        checked:false,
        order: 2,
        type:"twoWidget",
        props: {
          api: "getOpenedDocumentsCount?docType=25&projectId=",
          route: "DashBoardProjectCounterLog",
          value: "count-0",
          total: "total-1",
          action: "action",
          isModal: false,
          key: "0-3-2"
       }
      },
      { 
        title: "rfiOpen",
        key: "0-3-3",
        canView: false,
        checked:false,
        order: 3,
        type:"twoWidget",
        props: {
          api: "GetRfiOpenCount?projectId=",
          route: "DashBoardProjectCounterLog",
          value: "total-0",
          total: "total-1",
          action: "action",
          isModal: false,
          key: "0-3-3"
       }
      },
      { 
        title: "openedTransmittals",
        key: "0-3-4",
        canView: false,
        checked:false,
        order: 4,
        type:"twoWidget",
        props: {
          api: "getOpenedDocumentsCount?docType=28&projectId=",
          route: "DashBoardProjectCounterLog",
          value: "count-0",
          total: "total-1",
          action: "action",
          isModal: false,
          key: "0-3-4"
       }
      } 
    ]
  },
  { 
    widgetCategory: "inspectionRequest",
    refrence: 0,
    key: "0-4",
    canView: false,
    checked:false,
    order: 4,
    widgets: [
      { 
        title: "countinspectionPanding",
        key: "0-4-1",
        canView: false,
        checked:false,
        order: 1,
        type:"oneWidget",
        props: {
          api: "GetCountinspectionForProject?status=null&projectId=",
          route: "DashBoardProjectCounterLog",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false,
          key: "0-4-1"
       }
      },
      { 
        title: "countinspectionReject",
        key: "0-4-2",
        canView: false,
        checked:false,
        order: 2,
        type:"oneWidget",
        props: {
          api: "GetCountinspectionForProject?status=false&projectId=",
          route: "DashBoardProjectCounterLog",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false,
          key: "0-4-2"
       }
      },
      { 
        title: "countinspectionApproved",
        key: "0-4-3",
        canView: false,
        checked:false,
        order: 3,
        type:"oneWidget",
        props: {
          api: "GetCountinspectionForProject?status=true&projectId=",
          route: "DashBoardProjectCounterLog",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false,
          key: "0-4-3"
       }
      } 
    ]
  },
  { 
    widgetCategory: "respondTime",
    refrence: 0,
    key: "0-5",
    canView: false,
    checked:false,
    order: 5,
    widgets: [
       { 
        title: "avgRespondTimeLetters",
        key: "0-5-1",
        canView: false,
        checked:false,
        order: 1,
        type:"oneWidget",
        props: {
          api: "GetAvgTimeRespond?isMonthly=false&docType=19&projectId=",
          route: "",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false,
          key: "0-5-1"
       }
      },{ 
        title: "avgRespondTimeTransmittals",
        key: "0-5-2",
        canView: false,
        checked:false,
        order: 2,
        type:"oneWidget",
        props: {
          api: "GetAvgTimeRespond?isMonthly=false&docType=28&projectId=",
          route: "",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false,
          key: "0-5-2"
       }
      },
      { 
        title: "avgRespondTimeIR",
        key: "0-5-3",
        canView: false,
        checked:false,
        order: 3,
        type:"oneWidget",
        props: {
          api: "GetAvgTimeRespond?isMonthly=false&docType=25&projectId=",
          route: "",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false,
          key: "0-5-3"
       }
      },
      { 
        title: "avgRespondTimeMIR",
        key: "0-5-4",
        canView: false,
        checked:false,
        order: 4,
        type:"oneWidget",
        props: {
          api: "GetAvgTimeRespond?isMonthly=false&docType=103&projectId=",
          route: "",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false,
          key: "0-5-4"
       }
      },
      { 
        title: "avgRespondTimeRFI",
        key: "0-5-5",
        canView: false,
        checked:false,
        order: 5,
        type:"oneWidget",
        props: {
          api: "GetAvgTimeRespond?isMonthly=false&docType=23&projectId=",
          route: "",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false,
          key: "0-5-5"
       }
      },
      { 
        title: "avgRespondTimeSubmittals",
        key: "0-5-6",
        canView: false,
        checked:false,
        order: 6,
        type:"oneWidget",
        props: {
          api: "GetAvgTimeRespond?isMonthly=false&docType=42&projectId=",
          route: "",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false,
          key: "0-5-6"
       }
      },
      { 
        title: "avgRespondTimePO",
        key: "0-5-7",
        canView: false,
        checked:false,
        order: 7,
        type:"oneWidget",
        props: {
          api: "GetAvgTimeRespond?isMonthly=false&docType=70&projectId=",
          route: "",
          value: "total",
          listType: "item",
          action: "action",
          isModal: false,
          key: "0-5-7"
       }
      }
    ]
  } 
];
 
  export default DashBoardWidgets;