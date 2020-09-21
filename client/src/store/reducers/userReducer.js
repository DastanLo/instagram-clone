import {ac} from "../actions/actionTypes";

export const initialState = {
  user: null,
  token: null,
  error: null,
  loading: false,
  userInfo: {
    username: null,
    _id: null,
    foundUser: null,
    email: null,
    avatar: null,
    followers: [],
    follows: [],
  },
  foundUser: [],
};

const handlers = {
  [ac.REGISTER_USER]: (state) => ({...state, loading: true}),
  [ac.REGISTER_USER_SUCCESS]: (state) => ({...state, loading: false}),
  [ac.REGISTER_USER_FAILURE]: (state, {error}) => ({...state, error, loading: false}),
  [ac.GET_USER_INFO]: (state) => ({...state, loading: true}),
  [ac.GET_USER_INFO_ERROR]: (state, {error}) => ({...state, error, loading: false}),
  [ac.RESET_USER_INFO]: state => ({...state, userInfo: initialState.userInfo}),
  [ac.LOGIN_USER]: (state, {user}) => ({...state, user, error: null, loading: true}),
  [ac.LOGIN_USER_ERROR]: (state, {error}) => ({...state, error, loading: false}),
  [ac.LOG_OUT_USER]: () => ({...initialState}),
  [ac.USER_ERROR]: (state) => ({...state, loading: false}),
  [ac.AUTH_ERROR_RESET]: state => ({...state, error: null}),
  [ac.UPDATE_PROFILE]: state => ({...state, loading: true}),
  [ac.UPDATE_PROFILE_ERROR]: (state, {error}) => ({...state, error, loading: false}),
  [ac.UPDATE_PROFILE_SUCCESS]: (state, {user}) => ({...state, user, error: null, userInfo: user, loading: false}),
  [ac.SUBSCRIBE_USER_ERROR]: (state, {error}) => ({...state, error}),
  [ac.SUBSCRIBE_USER_SUCCESS]: state => ({...state, error: null}),
  [ac.SEARCH_USER_SUCCESS]: (state, {user}) => ({...state, foundUser: user}),
  [ac.SEARCH_USER_RESET]: (state) => ({...state, foundUser: []}),
  [ac.SUBSCRIBE_USER]: (state) => {
    const followers = [...state.userInfo.followers, state.user];
    const follows = [...state.user.follows, state.userInfo];
    return {...state, userInfo: {...state.userInfo, followers}, user: {...state.user, follows}};
  },
  [ac.UNSUBSCRIBE_USER]: (state, {id}) => {
    const follows = state.user.follows.filter(f => f._id !== id);
    const followers = state.userInfo.followers.filter(f => f._id !== state.user._id);
    return {...state, userInfo: {...state.userInfo, followers}, user: {...state.user, follows}};
  },
  [ac.LOGIN_USER_SUCCESS]: (state, {user}) => ({
    ...state,
    user: user.user,
    token: user.token,
    error: null,
    loading: false
  }),
  [ac.GET_USER_INFO_SUCCESS]: (state, {user}) => {
    if (user._id === state.user._id) {
      return {...state, userInfo: user, user, loading: false, error: null};
    }
    return {...state, userInfo: user, loading: false, error: null};
  },
  DEFAULT: (state) => state,
};

const userReducer = (state = initialState, action) => {
  const handle = handlers[action.type] || handlers.DEFAULT;
  return handle(state, action);
};

export default userReducer;
