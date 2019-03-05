 
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
                 
 
        case types.Document_Adding: 
                return {
                    ...state,
                    document: action.document, 
                    changeStatus: false
                };
                 

        case types.Document_Add:
                return {
                    ...state,
                    document: action.document,
                    changeStatus: false
                }; 
                 
            
        case types.File_Upload: 
                return {
                    ...state,
                    files: [...state.files, action.file],
                    isLoadingFiles: true
                };
                 

        case types.Delete_File: 

                let files=[...state.files];
                let index = files.indexOf(action.file);
                if (index !== -1) {
                   files.splice(index, 1); 
                }
                return {
                    ...state,
                    files: files 
                };
                 

        case types.Get_Files:
                return {
                    ...state,
                    files: [...state.files, ...action.files],
                    isLoadingFiles: true
                };
                 
  
        case types.Cycles_WorkFlow:
                
                return {
                    ...state,
                    workFlowCycles: action.workFlowCycles,
                    hasWorkflow: action.hasWorkflow
                };  
                 
 
       case types.Send_WorkFlow:
                return {
                    ...state,
                    cycles: action.cycles
                }; 
                 

       case types.SendByEmail:
                return {
                    ...state,
                    showModal: action.showModal
                }; 
                 
       case types.Update_Field:
                return {
                    ...state,
                    document: action.document 
                }; 
                 
                
       case types.NextArrange:
                let newdoc={ ...state.document,...action.arrange };
                 
                return {
                    ...state,
                    document: { ...state.document ,...action.arrange }
                }; 
                 
       
        default: 
            return {
                ...state
            };
                 
    }
}
