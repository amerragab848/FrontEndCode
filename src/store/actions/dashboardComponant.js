import * as types from './types';
  
export function RouteToDashboardProject(event) {
    return (dispatch, getState) => {
        dispatch({
            type: types.RouteToDashboardProject,
            showLeftMenu: true,
            showSelectProject: false,
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
            projectId: event.value,
            projectName: event.label
        });
    }
} 
export function LeftMenuClick(event) {
    return (dispatch, getState) => {
        dispatch({
            type: types.LeftMenuClick,
            showLeftMenu: true,
            showSelectProject: false,
            projectId: event.value,
            projectName: event.label
        });
    }
}
