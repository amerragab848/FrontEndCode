import * as types from '../../store/actions/types';

import initialState from '../initialState';

export default function (state = initialState.app.expensesWorkFlow, action) {
    switch (action.type) {

        case types.AddExpensesWorkFlow:
            state.expensesWorkFlowData = action.data 
            return {
                ...state
            };

        case types.AddContactExpensesWorkFlow:
            state.contactData = action.data 
            return {
                ...state
            }
    
        default:
            return {
                ...state
            };
    }
}