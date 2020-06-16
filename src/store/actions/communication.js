import * as types from './types';
import Api from '../../api';
import dataservice from '../../Dataservice';
import { toast } from "react-toastify";
import Resources from "../../resources.json";
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const filter = require('lodash/filter')
const maxBy = require('lodash/maxBy')
const uniqBy = require('lodash/uniqBy')
const orderBy = require('lodash/orderBy')

export function documentForEdit(urlAction, docTypeId, docName) {
    return (dispatch, getState) => {
        return Api.get(urlAction).then(resp => {
            dispatch({
                type: types.Document_for_Edit,
                document: resp,
                docId: resp.id,
                docTypeId: docTypeId,
                showLeftReportMenu: false,
                docName: docName
            });

        }).catch((ex) => {
            toast.error(Resources["failError"][currentLanguage]);
            dispatch({
                type: types.Document_for_Edit,
                document: [],
                docId: 0
            });
        });
    }
}

export function getItems(urlAction) {
    return (dispatch, getState) => {
        return Api.get(urlAction).then(resp => {
            dispatch({
                type: types.GET_ITEMS,
                document: resp 
            });

        }).catch((ex) => {
            toast.error(Resources["failError"][currentLanguage]);
            dispatch({
                type: types.GET_ITEMS 
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

export function setLoadingFiles() {
    return (dispatch, getState) => {
        dispatch({
            type: types.SET_LOADING 
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

export function resetItems(items) {
    return (dispatch, getState) => {
        dispatch({
            type: types.reset_items,
            data: items
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

export function SendByEmail_Inbox(url, formData) {
    return (dispatch, getState) => {
        return Api.post(url, formData).then(resp => {
            toast.success(Resources["operationSuccess"][currentLanguage]);
            dispatch({
                type: types.SendByEmail_Inbox,
                showModal: false
            });
        }).catch((ex) => {
            toast.success(Resources["failError"][currentLanguage]);
            dispatch({
                type: types.SendByEmail_Inbox,
                showModal: true
            });
        });
    }
}

export function copyTo(url, formData) {
    return (dispatch, getState) => {
        return Api.post(url, formData).then(resp => {
            toast.success(Resources["operationSuccess"][currentLanguage]);
            dispatch({
                type: types.CopyTo,
                showModal: false
            });
        }).catch((ex) => {
            toast.success(Resources["failError"][currentLanguage]);
            dispatch({
                type: types.SendByEmail_Inbox,
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
                // showModal: false
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


function BuildWorkFlowCycleStracture(result) {
    let levels = [];
    let cycles = [];

    let workFlowCycles = uniqBy(result, 'subject');
    const poolLevels = orderBy(result, ['arrange'], 'asc');
    let returnObj = {};

    let hasWorkFlow = poolLevels.filter((t) => t.statusVal == null).length > 0 ? true : false;

    returnObj.hasWorkFlow = hasWorkFlow;

    workFlowCycles.forEach(function (item) {
        var obj = {};

        obj.subject = item.subject;
        obj.creationDate = item.creationDate;

        obj.accountDocWorkFlowId = item.accountDocWorkFlowId;

        //all levels in same subject
        levels = filter(poolLevels, function (i) {
            return i.accountDocWorkFlowId === item.accountDocWorkFlowId;
        });

        obj.levels = levels;

        let maxArrange = maxBy(levels, 'arrange');

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

//#region Add Docs Attachment Actions

export const ViewDocsAttachment = (docs) => {
    return (dispatch, getState) => {
        return (
            dispatch({
                type: types.ViewDocsAttachment,
                data: docs || []
            })
        )
    }
}

export function getCommunicationDocsAttach(projectId, docType, docId) {
    return (dispatch) => {

        return Api.get("GetCommunicationDocsAttachDoc?projectId=" + projectId + "&docTypeId=" + docType + "&docId=" + docId).then(resp => {
            dispatch({ type: types.GET_DOCS_ATTACH, data: resp });
        }).catch((ex) => {
            dispatch({ type: types.GET_DOCS_ATTACH, data: [] });
        });

    }
}

export function getCommunicationRelatedLinks(docType, docId) {
    return (dispatch) => {

        return Api.get("GetCommunicationDocsAttachDocByDocIdandDocType?docTypeId=" + docType + "&docId=" + docId).then(resp => {
            dispatch({ type: types.GET_RELATED_LINK, data: resp });

        }).catch((ex) => {
            dispatch({ type: types.GET_RELATED_LINK, data: [] });
        });

    }
}

export function deleteCommunicationDocsAttach(id) {
    return (dispatch) => {

        return Api.post("CommunicationDocsAttachDocDelete?id=" + id).then(resp => {
            dispatch({ type: types.DELETE_DOCS_ATTACH, id: id });
            toast.success(Resources["operationSuccess"][currentLanguage]);

        }).catch((ex) => {
            dispatch({ type: types.DELETE_DOCS_ATTACH });
            toast.error(Resources["operationCanceled"][currentLanguage]);
        });

    }
}

export function getCommunicationDocument(projectId, docType) {
    return (dispatch) => {

        return Api.get('GetAccountsDocAlertDocs?projectId=' + projectId + '&docType=' + docType).then(resp => {
            dispatch({ type: types.GET_DOCUMNET_DATA, data: resp });
        }).catch((ex) => {
            dispatch({ type: types.GET_DOCUMNET_DATA });
        });

    }
}

export function checkLog(value) {

    return (dispatch) => {
        dispatch({
            type: types.SET_ISREJECT,
            data: value
        });
    }
}

export function addCommunicationDocsAttach(data, projectId, docType, docId) {
    return (dispatch) => {
        let document = []
        let x = data.map(item => {
            let obj = {
                docId: docId, parentDocId: item.docId,
                parentDocTypeId: item.docType, docTypeId: docType,
                projectId: projectId,
            }
            document.push(obj);
        });
        return dataservice.addObject('AddCommunicationDocsAttachDocList', document).then(resp => {
            dispatch({ type: types.ADD_DOCS_ATTACH, resp: resp });
            toast.success(Resources["operationSuccess"][currentLanguage]);
        }).catch((ex) => {
            dispatch({ type: types.ADD_DOCS_ATTACH });
            toast.error(Resources["operationCanceled"][currentLanguage]);
        });

    }
}
// region Ahmed Yousry
export function fillProjectDropdown(){
    return (dispatch)=>{
       return Api.get('GetAccountsProjectsByIdForList').then(res=>{
         dispatch({type:types.FILL_PROJECTS_DROPDOWN,projectDropdown:res.data})
       }).catch((ex)=>{
         dispatch({type:types.FILL_PROJECTS_DROPDOWN})
       });
    }
}
export function fillTasksDropdown(){
    return(dispatch)=>{
      return Api.get().then(res=>{
        dispatch({type:types.FILL_TASKS_DROPDOWN,taskDropdown:res.data})
      }).catch((ex)=>{
        dispatch({type:types.FILL_TASKS_DROPDOWN})
      });
    }
}
export function fillLocationsDropdown(){
    return(dispatch)=>{
        return Api.get('GetAccountsDefaultList?listType=timesheetlocation&pageNumber=0&pageSize=10000').then(res=>{
          dispatch({type:types.FILL_LOCATIONS_DROPDOWN,locationDropdown:res.data})
        }).catch((ex)=>{
            dispatch({type:types.FILL_LOCATIONS_DROPDOWN})
        });
    }
}
export function fillCountriesDropdown(){
    return(dispatch)=>{
        return Api.get('GetAccountsDefaultList?listType=country&pageNumber=0&pageSize=10000').then(res=>{
            dispatch({type:types.FILL_COUNTRIES_DROPDOWN,countryDropdown:res.data})
        }).catch((ex)=>{
            dispatch({type:types.FILL_COUNTRIES_DROPDOWN})
        })
    }
}
// endregion Ahmed Yousry

export function setLoading() {
    return (dispatch) => {
        dispatch({
            type: types.SET_LOADING
        });
    }
}

export function getAttachmentsAndWFCycles(DocType,docId,projectId) {
    return(dispatch)=>{
        return Api.get('GetAttachFilesAndWFCycleByDocId?DocType='+ DocType +'&DocId='+ docId + '&projectId='+projectId).then(res=>{

            let result = BuildWorkFlowCycleStracture(res.wfCycles);

            dispatch({
                type:types.Attachments_WF_Cycles,
                files: res.attachments,
                workFlowCycles : result.cycles, 
               })
        }).catch((ex)=>{
            dispatch({
                type:types.Attachments_WF_Cycles,
                files: [],
                workFlowCycles : [] 
            })
        })
    } 
}
//#endregion

