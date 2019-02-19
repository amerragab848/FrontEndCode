 
import * as types from '../../store/actions/types'; 

import initialState from '../initialState';

export default function(state = initialState.app.communication, action) {
     // console.log(action);
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
                console.log(action.document);
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

        default: 
            return {
                ...state
            };
                break;
    }
}
