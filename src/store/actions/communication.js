import * as types from './types';
import Api from '../../api';

const _ = require('lodash')

export function documentForEdit(urlAction) {
    return (dispatch, getState) => { 
        return Api.get(urlAction).then(resp => { 
            
           dispatch({
                    type: types.Document_for_Edit,
                    document: resp
            });

        }).catch((ex) => {
            dispatch({
                    type: types.Document_for_Edit,
                    document: []
            });
        });
    }
} 

export function documentForAdding(doc) {
    return (dispatch, getState) => { 
           dispatch({
                    type: types.Document_Adding,
                    document: doc
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

export function deleteFile(urlDelete,file) { 
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

export function uploadFile(BlobUpload,formData,header) {
    return (dispatch, getState) => { 
        return Api.postFile(BlobUpload,formData,header).then(resp => { 
            //console.log('in uploadFile',resp); 
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
 
export function updateField(field,value, document) {
    
    //console.log('in Actions updateField '); 
    let oldDoc={...document};
    oldDoc[field]=value;

    //console.log(oldDoc);
    
    return (dispatch, getState) => { 
           dispatch({
                    type: types.Update_Field,
                    document: oldDoc
            });
    }
}

export function SendByEmail(url,formData) {
    return (dispatch, getState) => { 
        return Api.post(url,formData).then(resp => {  
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

export function GetWorkFlowCycles(urlAction) {
    return (dispatch, getState) => { 
       
        return Api.get(urlAction).then(resp => { 
            
          let result=  BuildWorkFlowCycleStracture(resp);
            //alert(result.hasWorkFlow);
           dispatch({
                    type: types.Cycles_WorkFlow,
                    workFlowCycles: result.cycles,
                    hasWorkflow: result.hasWorkFlow
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

function BuildWorkFlowCycleStracture(result) {
    let levels = [];
    let cycles = [];
    
    let workFlowCycles = _.uniqBy(result, 'subject');
    const poolLevels = _.orderBy(result, ['arrange'], 'asc');
    let returnObj={};

    let hasWorkFlow=  poolLevels.filter((t) => t.statusVal == null).length > 0 ? true: false;

    returnObj.hasWorkFlow = hasWorkFlow;

    workFlowCycles.forEach(function (item) {
        var obj = {};

        obj.subject = item.subject;
        obj.creationDate=item.creationDate;

        obj.accountDocWorkFlowId = item.accountDocWorkFlowId;

        //all levels in same subject
        levels = _.filter(poolLevels, function (i) {
            return i.accountDocWorkFlowId === item.accountDocWorkFlowId;
        });

        obj.levels = levels;

        let maxArrange=_.maxBy(levels,'arrange');
            
        obj.currentLevel= maxArrange.arrange;
        cycles.push(obj);
    });
    
    returnObj.cycles=cycles;
    return returnObj;
}; 