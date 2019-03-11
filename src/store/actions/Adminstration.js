import * as types from './types';
import Api from '../../api';
import { toast } from "react-toastify";

export function deleteContact(url, ContactID) {

    return (dispatch, getState) => {
        dispatch({
            type: types.toggleLoading
        });
        return Api.post(url).then(resp => {
            dispatch({
                type: types.Delete_Contact,
                data: ContactID
            });
            toast.success("operation success");
        }).catch((ex) => {
            dispatch({
                type: types.Delete_Contact,
                data: 0
            });
            toast.error("operation error");
        });
    }
}
export function editContact(url, newContact) {

    return (dispatch, getState) => {
        dispatch({
            type: types.toggleLoading
        });
        return Api.post(url, newContact).then(resp => {
            dispatch({
                type: types.edit_Contact,
                data: resp
            });
            toast.success("operation success");
        }).catch((ex) => {
            dispatch({
                type: types.edit_Contact,
                data: 0
            });
            toast.error("operation error");
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
            toast.error("operation error");

        });
    }
}
export function GetCompaniesList(url) {
    return (dispatch, getState) => {
      
        return Api.get(url).then(resp => {
            let _data = []
            resp.forEach(element => {
                _data.push({ label: element.companyName, value: element.id })
            });
            dispatch({
                type: types.Get_Companies,
                data: _data
            });
        }).catch((ex) => {
            dispatch({
                type: types.Get_Companies,
                data: []
            });
            toast.error("operation error");
        });
    }
}
export function addContact(url, Contact) {

    return (dispatch, getState) => {
        return Api.post(url, Contact).then(resp => {
            dispatch({
                type: types.Add_Contact,
                data: resp
            });
            toast.success("operation success");
        }).catch((ex) => {
            dispatch({
                type: types.Add_Contact,
                data: {}
            });
            toast.error("operation error");
        });
    }
}
export function changeCompany(url, contactID) {

    return (dispatch, getState) => {
        dispatch({
            type: types.toggleLoading
        });
        return Api.post(url).then(resp => {
            dispatch({
                type: types.Change_Company,
                data: contactID
            });
            toast.success("operation success");
        }).catch((ex) => {
            dispatch({
                type: types.Change_Company,
                data: {}
            });
            toast.error("operation error");
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
export function makeKeyContact(url) {
    return (dispatch, getState) => {
        dispatch({
            type: types.toggleLoading
        });
        return Api.post(url).then(resp => {
            dispatch({
                type: types.makeKeyContact
            });
            toast.success("operation success");
        }).catch((ex) => {
            dispatch({
                type: types.makeKeyContact,
                data: []
            });
            toast.error("operation error");
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

export function routeToTabIndex(tabIndex) {

    return (dispatch, getState) => {
        dispatch({
            type: types.routeToTabIndex,
            data:tabIndex
        });

    }
}
