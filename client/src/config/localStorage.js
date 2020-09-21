import {ac} from "../store/actions/actionTypes";


export const saveToLocalStorage = state => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch (e) {
    console.log('Could not save state');
  }
};

export const loadFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (e) {
    return undefined;
  }
};

const actions = [ac.LOGIN_USER_SUCCESS, ac.LOG_OUT_USER, ac.UPDATE_PROFILE_SUCCESS, ac.UNSUBSCRIBE_USER, ac.SUBSCRIBE_USER];

export const localStorageMiddleware = store => next => action => {
  let result = next(action);
  if (actions.includes(action.type)) {
    saveToLocalStorage({
      user: {
        user: store.getState().user.user,
        token: store.getState().user.token,
      },
    });
  }
  return result;
};
