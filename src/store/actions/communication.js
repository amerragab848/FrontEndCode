import * as types from './types';
import Api from '../../api';

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

export function deleteFile(file) {
    return (dispatch, getState) => {  
           dispatch({
                    type: types.Delete_File,
                    file: file
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