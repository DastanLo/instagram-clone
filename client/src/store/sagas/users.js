import {put} from "redux-saga/effects";
import {push} from "connected-react-router";
import {
  getUserInfo,
  getUserInfoError,
  getUserInfoSuccess,
  loginUserFailure,
  loginUserSuccess,
  logoutUser as logOutUser,
  registerUserFailure,
  registerUserSuccess,
  searchUserSuccess,
  subscribeToUserError,
  subscribeToUserSuccess,
  updateProfileError,
  updateProfileSuccess, userError
} from "../actions/userActions";

import {
  getUserInfoApi,
  loginUser,
  logoutUser,
  registerUser,
  searchUserApi,
  subscribeToUser,
  unSubscribeToUser,
  updateProfile
} from "../../api";
import {getUserPost} from '../actions/postActions';

export function* registerUserSaga({userData}) {
  try {
    yield registerUser(userData);
    yield put(registerUserSuccess());
    yield put(push('/login'));
  } catch (e) {
    yield put(registerUserFailure(e.response.data));
  }
}

export function* loginUserSaga({userData}) {
  try {
    const response = yield loginUser(userData);
    yield put(loginUserSuccess(response.data));
    yield put(push('/'));
  } catch (e) {
    yield put(loginUserFailure(e.response.data));
  }
}

export function* logoutUserSaga() {
  try {
    yield logoutUser();
    yield put(push('/'));
  } catch (e) {
    yield put(userError(e));
  }
}

export function* searchUserSaga({user}) {
  try {
    const response = yield searchUserApi(user);
    yield put(searchUserSuccess(response.data));
  } catch (e) {
    if (e.response?.status === 401) {
      return yield put(logOutUser());
    }
    yield put(userError(e));
  }
}

export function* getUserInfoSaga({id}) {
  try {
    const response = yield getUserInfoApi(id);
    yield put(getUserInfoSuccess(response.data));
  } catch (e) {
    if (e.response?.status === 401) {
      return yield put(logOutUser());
    }
    yield put(getUserInfoError(e.response.data));
  }
}

export function* updateProfileSaga({newUserData}) {
  try {
    const response = yield updateProfile(newUserData);
    yield put(updateProfileSuccess(response.data));
  } catch (e) {
    if (e.response?.status === 401) {
      return yield put(logOutUser());
    }
    yield put(updateProfileError(e.response.data));
  }
}

export function* subscribeToUserSaga({username}) {
  try {
    yield subscribeToUser(username);
    yield put(getUserInfo(username));
    yield put(getUserPost(username));
    yield put(subscribeToUserSuccess());
  } catch (e) {
    if (e.response?.status === 401) {
      return yield put(logOutUser());
    }
    yield put(subscribeToUserError(e.response.data));
  }
}

export function* unsubscribeToUserSaga({id}) {
  try {
    yield unSubscribeToUser(id);
    yield put(subscribeToUserSuccess());
    yield put(getUserInfo(id));
    yield put(getUserPost(id));
  } catch (e) {
    if (e.response?.status === 401) {
      return yield put(logOutUser());
    }
    yield put(subscribeToUserError(e.response.data));
  }
}

