import {
  applyMiddleware, 
  compose, 
  createStore
} from "redux";
import reducers from "../reducers/index";
import {routerMiddleware} from "react-router-redux";
import createHistory from "history/createBrowserHistory";
import ReduxThunk from "redux-thunk";
// import createSagaMiddleware from "redux-saga";
// import rootSaga from "../sagas/index";

const history = createHistory();
const routeMiddleware = routerMiddleware(history);
// const sagaMiddleware = createSagaMiddleware();

// const middlewares = [sagaMiddleware, routeMiddleware];

const middlewares = [ routeMiddleware, ReduxThunk];
// console.log("middlewares");
// console.log(middlewares);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore(initialState) {
  // console.log("initial state store", initialState);
  const store = createStore(reducers, initialState,
    composeEnhancers(applyMiddleware(...middlewares)));
  // console.log("my store", store);
  // sagaMiddleware.run(rootSaga);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers/index', () => {
      const nextRootReducer = require('../reducers/index');
      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
export {history};
