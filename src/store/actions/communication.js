import * as types from './types';
import Api from '../../api';

const _ = require('lodash')

export function documentForEdit(urlAction, docTypeId,docName) {
    return (dispatch, getState) => {
        return Api.get(urlAction).then(resp => {

            dispatch({
                type: types.Document_for_Edit,
                document: resp,
                docId: resp.id,
                docTypeId: docTypeId,
                showLeftReportMenu: false,
                docName:docName
            });

        }).catch((ex) => {
            dispatch({
                type: types.Document_for_Edit,
                document: [],
                docId: 0
            });
        });
    }
}
export function clearCashDocument() {
    return (dispatch, getState) => {
        dispatch({
            type: types.Clear_Cash_Document
        });
    }
}

export function showOptionPanel(show) {
    return (dispatch, getState) => {
        dispatch({
            type: types.Show_OptionPanel,
            showModal: show
        });
    }
}

export function GetDocumentCycle(urlAction) {
    return (dispatch, getState) => {
        return Api.get(urlAction).then(resp => {

            dispatch({
                type: types.GetDocumentCycle,
                data: resp
            });

        }).catch((ex) => {
            dispatch({
                type: types.GetDocumentCycle,
                data: []
            });
        });
    }
}

export function documentForAdding(doc) {
    return (dispatch, getState) => {
        dispatch({
            type: types.Document_Adding
        });
    } 
}

export function ExportingData(data) {
    return (dispatch, getState) => {
        dispatch({
            type: types.Export_Document,
            items: data.items
        });
    }
}

export function GetUploadedFiles(urlAction) {
    return (dispatch, getState) => {
        return Api.get(urlAction).then(resp => {
            dispatch({
                type: types.Get_Files,
                files: resp
            });
        }).catch((ex) => {
            dispatch({
                type: types.Get_Files,
                files: []
            });
        });
    }
}

export function deleteFile(urlDelete, file) {
    return (dispatch, getState) => {
        return Api.post(urlDelete).then(resp => {
            dispatch({
                type: types.Delete_File,
                file: file
            });
        }).catch((ex) => {
            dispatch({
                type: types.Delete_File,
                file: file
            });
        });
    }
}

export function uploadFile(BlobUpload, formData, header) {
    return (dispatch, getState) => {
        return Api.postFile(BlobUpload, formData, header).then(resp => {
            dispatch({
                type: types.File_Upload,
                file: resp[0]
            });
        }).catch((ex) => {
            dispatch({
                type: types.File_Upload,
                file: {}
            });
        });
    }
}

export function uploadFileLinks(BlobUpload, formData) {
    return (dispatch, getState) => {
        return Api.post(BlobUpload, formData).then(resp => {
            dispatch({
                type: types.File_Upload,
                file: resp[0]
            });
        }).catch((ex) => {
            dispatch({
                type: types.File_Upload,
                file: {}
            });
        });
    }
}

export function addItemDescription(item) {
    return (dispatch, getState) => {
        dispatch({
            type: types.add_item,
            item: item
        });
    }
}

export function deleteItemDescription(item) {
    return (dispatch, getState) => {
        dispatch({
            type: types.delete_item,
            data: item
        });
    }
}

export function deleteItemsDescription(item) {
    return (dispatch, getState) => {
        dispatch({
            type: types.delete_items,
            data: item
        });
    }
}

export function setItemDescriptions(items, docId) {
    return (dispatch, getState) => {
        dispatch({
            type: types.add_item,
            item: items,
            docId: docId
        });
    }
}

export function editItemDescriptions(item) {
    return (dispatch, getState) => {
        dispatch({
            type: types.edit_item,
            item: item,
        });
    }
}

export function updateField(field, value, document) {
    let oldDoc = { ...document };
    oldDoc[field] = value;

    return (dispatch, getState) => {
        dispatch({
            type: types.Update_Field,
            document: oldDoc
        });
    }
}

export function SendByEmail(url, formData) {
    return (dispatch, getState) => {
        return Api.post(url, formData).then(resp => {
            dispatch({
                type: types.SendByEmail,
                showModal: false
            });
        }).catch((ex) => {
            dispatch({
                type: types.SendByEmail,
                showModal: true
            });
        });
    }
}

export function GetNextArrange(urlAction) {
    return (dispatch, getState) => {
        return Api.get(urlAction).then(resp => {

            dispatch({
                type: types.NextArrange,
                arrange: resp
            });

        }).catch((ex) => {
            dispatch({
                type: types.NextArrange,
                arrange: 0
            });
        });
    }
}

export function SnedToWorkFlow(url, formData, urlCycle) {
    return (dispatch, getState) => {
        return Api.post(url, formData).then(resp => {
            this.GetWorkFlowCycles(urlCycle);
        }).catch((ex) => {
            dispatch({
                type: types.Send_WorkFlow,
                hasWorkflow: false,
                showModal: false
            });
        });
    }
}

export function SendingWorkFlow(value) {
    return (dispatch, getState) => {
        dispatch({
            type: types.Sending_WorkFlow,
            showModal: value
        });
    }
}

export function GetWorkFlowCycles(urlAction) {
    return (dispatch, getState) => {

        return Api.get(urlAction).then(resp => {

            let result = BuildWorkFlowCycleStracture(resp);

            dispatch({
                type: types.Cycles_WorkFlow,
                workFlowCycles: result.cycles,
                hasWorkflow: result.hasWorkFlow,
                showModal: false
            });

        }).catch((ex) => {
            dispatch({
                type: types.Cycles_WorkFlow,
                workFlowCycles: [],
                hasWorkflow: false
            });
        });
    }
}

export function RouteToTemplate() {
    return (dispatch, getState) => {
        dispatch({
            type: types.RouteToTemplate,
            showLeftMenu: false,
            showSelectProject: true,
            showLeftReportMenu: false
        });
    }
}
export function RouteToDashboardProject(event) {
    return (dispatch, getState) => {
        dispatch({
            type: types.RouteToDashboardProject,
            showLeftMenu: true,
            showSelectProject: false,
            showLeftReportMenu: false,
            projectId: event.value,
            projectName: event.label
        });
    }
}
export function RouteToMainDashboard(event) {
    return (dispatch, getState) => {
        dispatch({
            type: types.RouteToDashboardProject,
            showLeftMenu: false,
            showSelectProject: true,
            showLeftReportMenu: false,
            projectId: 0,
            projectName: "Select Project"
        });
    }
}
export function AboveSelectProject(event) {
    return (dispatch, getState) => {
        dispatch({
            type: types.RouteToDashboardProject,
            showLeftMenu: true,
            showSelectProject: false,
            showLeftReportMenu: false,
            projectId: event.value,
            projectName: event.label
        });
    }
}
export function LeftMenuClick(event, moduleName) {
    return (dispatch, getState) => {
        dispatch({
            type: types.LeftMenuClick,
            showLeftMenu: true,
            showSelectProject: false,
            showLeftReportMenu: false,
            projectId: event.value,
            projectName: event.label,
            moduleName: moduleName
        });
    }
}

export function ReportCenterMenuClick() {
    return (dispatch, getState) => {
        dispatch({
            type: types.ReportCenterMenu,
            showLeftMenu: false,
            showSelectProject: true,
            showLeftReportMenu: true
        });
    }
}

export function FillGridLeftMenu() {
    return (dispatch, getState) => {
        dispatch({
            type: types.FillGridLeftMenu,
            showLeftMenu: true,
            showLeftReportMenu: false,
            showSelectProject: false
        });
    }
}

export function GetAttendeesTable(urlAction) {
    return (dispatch, getState) => {
        return Api.get(urlAction).then(resp => {

            dispatch({
                type: types.Get_Attendees_Table,
                data: resp
            });

        }).catch((ex) => {
            dispatch({
                type: types.Get_Attendees_Table,
                data: []
            });
        });
    }
}
export function GetTopicsTable(urlAction) {
    return (dispatch, getState) => {
        return Api.get(urlAction).then(resp => {
            dispatch({
                type: types.Get_Topics_Table,
                data: resp
            });
        }).catch((ex) => {
            dispatch({
                type: types.Get_Topics_Table,
                data: []
            });
        });
    }
}

export const ViewDocsAttachment = (docs) => {
    return (dispatch, getState) => {
        return (
            dispatch({
                type: types.ViewDocsAttachment,
                attachDocuments: docs
            })
        )
    }
}

function BuildWorkFlowCycleStracture(result) {
    let levels = [];
    let cycles = [];

    let workFlowCycles = _.uniqBy(result, 'subject');
    const poolLevels = _.orderBy(result, ['arrange'], 'asc');
    let returnObj = {};

    let hasWorkFlow = poolLevels.filter((t) => t.statusVal == null).length > 0 ? true : false;

    returnObj.hasWorkFlow = hasWorkFlow;

    workFlowCycles.forEach(function (item) {
        var obj = {};

        obj.subject = item.subject;
        obj.creationDate = item.creationDate;

        obj.accountDocWorkFlowId = item.accountDocWorkFlowId;

        //all levels in same subject
        levels = _.filter(poolLevels, function (i) {
            return i.accountDocWorkFlowId === item.accountDocWorkFlowId;
        });

        obj.levels = levels;

        let maxArrange = _.maxBy(levels, 'arrange');

        obj.currentLevel = maxArrange.arrange;
        cycles.push(obj);
    });

    returnObj.cycles = cycles;
    
    return returnObj;
};

export function setDocId(docId) {
    return (dispatch, getState) => {
        dispatch({
            type: types.Set_DocId,
            docId: docId
        });
    }
}