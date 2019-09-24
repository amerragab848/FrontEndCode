
import * as types from '../actions/types';

import initialState from '../initialState';

export default function (state = initialState.app.adminstration, action) {
    let _Data = [];
    switch (action.type) {

        case types.Get_Contacts:
            state.companyContact = action.data
            state.getingData = false
            return {
                ...state
            };

        case types.Get_Companies:
            state.companyList = action.data
            state.getingData = false
            return {
                ...state
            };

        case types.Change_Company:
            state.getingData = false;
            _Data = state.companyContact.filter((element) => { return element.id !== action.data })
            state.companyContact = _Data
            return {
                ...state
            };

        case types.makeKeyContact:
            state.getingData = false
            return {
                ...state
            };

        case types.Delete_Contact:
            state.getingData = false;
            _Data = state.companyContact.filter((element) => { return element.id !== action.data })
            state.companyContact = _Data
            return {
                ...state
            };

        case types.edit_Contact:
            state.getingData = false;
            state.popUp = false
            state.companyContact.forEach(element => {
                if (element.id == action.data.id)
                    _Data.push(action.data)
                else
                    _Data.push(element)
            })
            state.companyContact = _Data
            return {
                ...state
            };

        case types.Add_Contact:
            state.companyContact.unshift(action.data)
            state.popUp = false
            return {
                ...state
            };

        case types.togglePopUp:
            state.popUp = !state.popUp
            return {
                ...state
            };


        case types.toggleLoading:
            state.getingData = !state.getingData;
            return {
                ...state
            };

        case types.getingData:
            state.getingData = !state.getingData
            return {
                ...state
            };
        case types.routeToTabIndex:
            state.tabIndex = action.data
            return {
                ...state
            };
        case types.userSettingsTabIndex:
            state.userTabIndex = action.data
            return {
                ...state
            };
        default:
            return {
                ...state
            };

    }
}
