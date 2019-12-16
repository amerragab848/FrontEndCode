import { GET_GRID_DATA } from '../../store/actions/types';

import initialState from '../initialState';

export default function(state = initialState.app.grid, action) {
    switch (action.type) {
        case GET_GRID_DATA:
            return {
                ...state,
                data: action.data.data,
            };
        default:
            return {
                ...state,
            };
    }
}
