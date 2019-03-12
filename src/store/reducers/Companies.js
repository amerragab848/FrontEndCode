
import * as types from '../../store/actions/types';

import initialState from '../initialState';

export default function (state = initialState.app.comapnies, action) {
    switch (action.type) {

        case types.Get_Contacts:
            state.companyContact = action.data
            state.getingData = false
            return {
                ...state
            };

        case types.Delete_Contact:
            state.getingData = false;
            let _Data = [];
            _Data = state.companyContact.filter((element) => { return element.id !== action.data })
            state.companyContact = _Data
            return {
                ...state
            };

        case types.Add_Contact:
            state.companyContact.unshift(action.data)
            state.notifyMessage = true
            state.popUp = false
            // state.getingData = ! state.getingData
            state.popUp = false
            state.notifyMessage = true
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

        case types.toggleNotifyMessage:
            state.notifyMessage = !state.notifyMessage
            return {
                ...state
            };

        case types.getingData:
            state.getingData = !state.getingData
            return {
                ...state
            };

        default:
            return {
                ...state
            };

    }
}
