import * as types from './types';

export const Set_Step = (stepNum) => {
    return (dispatch, getState) => {
        dispatch({
            type: types.Set_Step,
            data: stepNum 
        });
    }
}