import {combineReducers} from "redux";
import {connectRouter} from "connected-react-router";
import {createBrowserHistory} from "history";
import userReducer from "../store/reducers/userReducer";
import postReducer from "../store/reducers/postReducer";
import messageReducer from '../store/reducers/messageReducer';


export const history = createBrowserHistory();

const rootReducer = combineReducers({
  user: userReducer,
  post: postReducer,
  message: messageReducer,
  router: connectRouter(history),
});

export default rootReducer;
