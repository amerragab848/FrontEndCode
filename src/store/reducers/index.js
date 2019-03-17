import {
		combineReducers
} from 'redux';

import communication from './communication';
import Adminstration from './Adminstration';
import ProjectReducer from './ProjectReducer'; 

export default combineReducers({
		communication,
		Adminstration ,
		ProjectReducer 
});
