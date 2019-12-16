import { GET_GRID_DATA } from './types';
import Api from '../../api';

export function fetchData(api, project, pageNumber, pageSize) {
    let url = `${api}?projectId=${project}&pageNumber=${pageNumber}&pageSize=${pageSize}`;

    return dispatch => {
        return Api.get(url)
            .then(resp => {
                dispatch({ type: GET_GRID_DATA, data: resp });
            })
            .catch(ex => {
                dispatch({ type: GET_GRID_DATA, data: [] });
            });
    };
}
