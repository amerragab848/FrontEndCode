import * as types from './types';
import Api from '../../api';

export function documentForEdit(urlAction) {
    return (dispatch, getState) => {
        console.log('//first step action 000000 documentForEdit');
        //'GetLettersById?id='
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

export function uploadFile(BlobUpload,formData,header) {
    return (dispatch, getState) => { 
        return Api.postFile(BlobUpload,formData,header).then(resp => { 
            console.log('in uploadFile',resp); 
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
 