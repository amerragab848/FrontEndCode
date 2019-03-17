import * as types from '../../store/actions/types'; 
import initialState from '../initialState';

export default function (state = initialState.app.dashboardComponant, action) {

    switch (action.type) {
        case types.RouteToDashboardProject:
        
        console.log('RouteToDashboardProject',action);
            return {
                ...state,
                showLeftMenu: action.showLeftMenu,
                showSelectProject: action.showSelectProject,
                projectId: action.projectId,
                projectName: action.projectName
            };
        case types.RouteToMainDashboard:
        
        console.log('RouteToMainDashboard',action);
            return {
                ...state,
                showLeftMenu: action.showLeftMenu,
                showSelectProject: action.showSelectProject,
                projectId: action.projectId,
                projectName: action.projectName
            };

        case types.AboveSelectProject:
        
        console.log('AboveSelectProject',action);
            return {
                ...state,
                showLeftMenu: action.showLeftMenu,
                showSelectProject: action.showSelectProject,
                projectId: action.projectId,
                projectName: action.projectName
            };

        case types.LeftMenuClick:
        
        console.log('LeftMenuClick',action);
            return {
                ...state,
                showLeftMenu: action.showLeftMenu,
                showSelectProject: action.showSelectProject,
                projectId: action.projectId,
                projectName: action.projectName
            };

        default:
            return {
                ...state
            }; 
    }
}
