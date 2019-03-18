
import * as types from '../../store/actions/types';

import initialState from '../initialState';

export default function (state = initialState.app.communication, action) {

    switch (action.type) {
        case types.Document_for_Edit:
            return {
                ...state,
                document: action.document,
                changeStatus: true,
                showLeftMenu: true,
                showSelectProject: false
            };

        case types.Document_Adding:
            return {
                ...state,
                showLeftMenu: true,
                showSelectProject: false,
                changeStatus: false
            };

        case types.Document_Add:
            return {
                ...state,
                document: action.document,
                changeStatus: false,
                showLeftMenu: true,
                showSelectProject: false
            };

        case types.File_Upload:
            return {
                ...state,
                files: [...state.files, action.file],
                isLoadingFiles: true
            };

        case types.Delete_File:
            let files = [...state.files];
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
            return {
                ...state,
                document: { ...state.document, ...action.arrange }
            };
        case types.RouteToDashboardProject:

            console.log('RouteToDashboardProject', action);
            return {
                ...state,
                showLeftMenu: action.showLeftMenu,
                showSelectProject: action.showSelectProject,
                projectId: action.projectId,
                projectName: action.projectName
            };
        case types.RouteToTemplate:

            console.log('RouteToTemplate', action);
            return {
                ...state,
                showLeftMenu: action.showLeftMenu,
                showSelectProject: action.showSelectProject 
            };
        case types.RouteToMainDashboard:

            console.log('RouteToMainDashboard', action);
            return {
                ...state,
                showLeftMenu: action.showLeftMenu,
                showSelectProject: action.showSelectProject,
                projectId: action.projectId,
                projectName: action.projectName
            };

        case types.AboveSelectProject:

            console.log('AboveSelectProject', action);
            return {
                ...state,
                showLeftMenu: action.showLeftMenu,
                showSelectProject: action.showSelectProject,
                projectId: action.projectId,
                projectName: action.projectName
            };

        case types.LeftMenuClick:

            console.log('LeftMenuClick', action);
            return {
                ...state,
                showLeftMenu: action.showLeftMenu,
                showSelectProject: action.showSelectProject,
                projectId: action.projectId,
                projectName: action.projectName
            };

        case types.FillGridLeftMenu:

            console.log('FillGridLeftMenu', action,state,action);
            return {
                ...state,
                showLeftMenu: action.showLeftMenu,
                showSelectProject: action.showSelectProject,
                projectId: localStorage.getItem('lastSelectedProject'),
                projectName:localStorage.getItem('lastSelectedprojectName') 
            };

        default:
            return {
                ...state
            };

    }
}
