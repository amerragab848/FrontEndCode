import {
		combineReducers
} from 'redux';

import communication from './communication';
import companies from './Companies';

export default combineReducers({
		communication,
		companies
});
