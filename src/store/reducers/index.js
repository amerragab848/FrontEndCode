import {
		combineReducers
} from 'redux';

import communication from './communication';
import Adminstration from './Adminstration';
import ProjectReducer from './ProjectReducer';
import dashboardComponant from './dashboardComponant';

export default combineReducers({
		communication,
		Adminstration ,
		ProjectReducer,
		dashboardComponant,
});
