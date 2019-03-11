import * as types from './types';
import Api from '../../api';

const _ = require('lodash')

export let AddExpensesWorkFlow = (ApiUrl, Data) => {
    return (dispatch, getState) => {
        return (
            Api.post(ApiUrl,Data).then(
                res => {
                    dispatch({
                        type: types.AddExpensesWorkFlow,
                        //if result api Get New Data
                        data: res
                    })
                }
                
            ).catch((ex) => {
                dispatch({
                    types: types.AddExpensesWorkFlow,
                    data: {}
                })
            })
        )
    }
}