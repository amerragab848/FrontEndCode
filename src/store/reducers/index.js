import {
		combineReducers
} from 'redux';

import communication from './communication';
import Adminstration from './Adminstration';

export default combineReducers({
		communication,
		Adminstration
});
