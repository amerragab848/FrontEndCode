import {
		combineReducers
} from 'redux';

import communication from './communication';
import companies from './Companies';
import ProjectReducer from './ProjectReducer';

export default combineReducers({
		communication,
		companies ,
		ProjectReducer,
});
