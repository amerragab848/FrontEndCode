import * as types from './types';
import Api from '../../api';



export function deleteContact(url,ContactID) {
   
    return (dispatch, getState) => {
        dispatch({
            type: types.toggleLoading
        }); 
        return Api.post(url).then(resp => { 
            dispatch({
                type: types.Delete_Contact,
                data: ContactID
            });
        }).catch((ex) => {
            dispatch({
                    type: types.Delete_Contact,
                    data: 0
            });
        });
    }
}
export function GetCompaniesContact(url) {
    return (dispatch, getState) => { 
        dispatch({
            type: types.toggleLoading
        }); 
        return Api.get(url).then(resp => { 
            dispatch({
                    type: types.Get_Contacts,
                    data: resp
            });
        }).catch((ex) => {
            dispatch({
                    type: types.Get_Contacts,
                    data: []
            });
        });
    }
}
 
export function addContact(url,Contact) {
   
    return (dispatch, getState) => {
        return Api.post(url,Contact).then(resp => { 
            dispatch({
                type: types.Add_Contact,
                data: resp 
            });
        }).catch((ex) => {
            dispatch({
                    type: types.Add_Contact,
                    data: {}
            });
        });
    }
}

export function TogglePopUp() {
   
    return (dispatch, getState) => {
            dispatch({
                type: types.togglePopUp
            });
       
    }
}
export function toggleLoading() {
   
    return (dispatch, getState) => {
            dispatch({
                type: types.toggleLoading
            });
       
    }
}

export function toggleNotifyMessage() {
   
    return (dispatch, getState) => {
            dispatch({
                type: types.toggleNotifyMessage
            });
       
    }
}