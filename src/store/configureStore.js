import {
    createStore,
    applyMiddleware
} from 'redux';

import rootReducer from './reducers';

import thunk from 'redux-thunk';

let middleware = [thunk];

export default function configureStore(initialState) {
    return createStore(
        rootReducer,
      //  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
        initialState,
        applyMiddleware(...middleware),
       
    );
}
