import {applyMiddleware, createStore} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import {routerMiddleware} from "connected-react-router";
import createSagaMiddleware from "redux-saga"
import rootReducer, {history} from "../../config/rootReducer";
import {axiosInstance} from "../../api";
import {loadFromLocalStorage, localStorageMiddleware} from "../../config/localStorage";
import rootSaga from "../sagas";
import {initialState} from '../reducers/userReducer';


const sagaMiddleware = createSagaMiddleware();

const middleware = [
  localStorageMiddleware,
  routerMiddleware(history),
  sagaMiddleware,
];


const persistedState = loadFromLocalStorage();
const store = createStore(rootReducer, {
    user: {
      ...initialState,
      user: persistedState?.user.user || null,
      token: persistedState?.user.token || null,
    }
  },
  composeWithDevTools(applyMiddleware(...middleware))
);
axiosInstance.interceptors.request.use(config => {
  try {
    config.headers['Authorization'] = 'Token ' + store.getState().user.token;
  } catch (e) {
    // do nothing, user is not logged in
  }
  return config;
});

sagaMiddleware.run(rootSaga);


export default store;
