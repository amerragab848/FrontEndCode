 
import * as types from '../../store/actions/types'; 

import initialState from '../initialState';

export default function(state = initialState.app.communication, action) {
     
    let com_state =  {};

    switch (action.type) {
        case types.Document_for_Edit: 
                return {
                    ...state,
                    document: action.document, 
                    changeStatus: true
                };
                break;
 
        case types.Document_Adding: 
                return {
                    ...state,
                    document: action.document, 
                    changeStatus: false
                };
                break;

        case types.Document_Add:
                return {
                    ...state,
                    document: action.document,
                    changeStatus: false
                }; 
                break;
            
        case types.File_Upload: 
                return {
                    ...state,
                    files: [...state.files, action.file],
                    isLoadingFiles: true
                };
                break;

        case types.Delete_File: 

                let files=[...state.files];
                let index = files.indexOf(action.file);
                if (index !== -1) {
                   files.splice(index, 1); 
                }
                return {
                    ...state,
                    files: files//[...state.files, action.file] 
                };
                break;

        case types.Get_Files:
                return {
                    ...state,
                    files: [...state.files, ...action.files],
                    isLoadingFiles: true
                };
                break;

       case types.Send_WorkFlow:
                return {
                    ...state,
                    cycles: action.cycles
                }; 
                break;

       case types.SendByEmail:
                return {
                    ...state,
                    showModal: action.showModal
                }; 
                break;
       case types.Update_Field:
                return {
                    ...state,
                    document: action.document 
                }; 
                break;
                
       case types.NextArrange:
                let newdoc={ ...state.document,...action.arrange };
                console.log(newdoc);
                return {
                    ...state,
                    document: { ...state.document ,...action.arrange }
                }; 
                break;
       
        default: 
            return {
                ...state
            };
                break;
    }
}
