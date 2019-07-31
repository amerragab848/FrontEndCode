import * as types from '../../store/actions/types';

import initialState from '../initialState';

export default function (state = initialState.app.Steps, action) {
    switch (action.type) { 
        
        case types.Set_Step:
            state.currentStep = action.data;  
            return {
                ...state
            };
            default:
                return{
                    ...state
                }
    }
}