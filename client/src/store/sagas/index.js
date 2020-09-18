import {all, takeEvery, fork} from "redux-saga/effects";
import {
  getUserInfoSaga,
  loginUserSaga,
  logoutUserSaga,
  registerUserSaga,
  searchUserSaga,
  subscribeToUserSaga,
  unsubscribeToUserSaga,
  updateProfileSaga
} from "./users";
import {ac} from "../actions/actionTypes";
import {
  addCommentSaga,
  createPostSaga,
  getOnePostSaga,
  getPostsSaga,
  getUserPostsSaga,
  likeCommentSaga,
  likePostSaga,
  sharePostSaga,
  unlikeCommentSaga,
  unlikePostSaga
} from "./posts";
import {flow, getUserChatsSaga} from './messages';


export function* watchRegisterUser() {
  yield takeEvery(ac.REGISTER_USER, registerUserSaga);
}

export function* watchLoginUser() {
  yield takeEvery(ac.LOGIN_USER, loginUserSaga);
}

export function* watchLogoutUser() {
  yield takeEvery(ac.LOG_OUT_USER, logoutUserSaga);
}

export function* watchGetUserInfo() {
  yield takeEvery(ac.GET_USER_INFO, getUserInfoSaga);
}

export function* watchSearchUser() {
  yield takeEvery(ac.SEARCH_USER, searchUserSaga);
}

export function* watchUpdateProfile() {
  yield takeEvery(ac.UPDATE_PROFILE, updateProfileSaga);
}

export function* watchGetPosts() {
  yield takeEvery(ac.LOAD_POST, getPostsSaga);
}

export function* watchGetUserPosts() {
  yield takeEvery(ac.LOAD_USER_POSTS, getUserPostsSaga);
}

export function* watchGeOnePost() {
  yield takeEvery(ac.LOAD_ONE_POST, getOnePostSaga);
}

export function* watchCreatePost() {
  yield takeEvery(ac.CREATE_POST, createPostSaga);
}

export function* watchCommentPost() {
  yield takeEvery(ac.COMMENT_POST, addCommentSaga);
}

export function* watchLikePost() {
  yield takeEvery(ac.LIKE_POST, likePostSaga);
}

export function* watchUnlikePost() {
  yield takeEvery(ac.UNLIKE_POST, unlikePostSaga);
}

export function* watchLikeComment() {
  yield takeEvery(ac.LIKE_COMMENT, likeCommentSaga);
}

export function* watchUnlikeComment() {
  yield takeEvery(ac.UNLIKE_COMMENT, unlikeCommentSaga);
}

export function* watchSubscribeToUser() {
  yield takeEvery(ac.SUBSCRIBE_USER, subscribeToUserSaga);
}

export function* watchUnSubscribeToUser() {
  yield takeEvery(ac.UNSUBSCRIBE_USER, unsubscribeToUserSaga);
}

export function* watchGetUserChats() {
  yield takeEvery(ac.GET_CHATS, getUserChatsSaga)
}

export function* watchSharePosts() {
  yield takeEvery(ac.SHARE_POST, sharePostSaga)
}


export default function* rootSaga() {
  yield fork(flow);
  yield all([
    watchRegisterUser(),
    watchLoginUser(),
    watchLogoutUser(),
    watchGetUserInfo(),
    watchSearchUser(),
    watchUpdateProfile(),
    watchGetPosts(),
    watchGetUserPosts(),
    watchGeOnePost(),
    watchCreatePost(),
    watchCommentPost(),
    watchLikePost(),
    watchUnlikePost(),
    watchLikeComment(),
    watchUnlikeComment(),
    watchSubscribeToUser(),
    watchUnSubscribeToUser(),
    watchGetUserChats(),
    watchSharePosts(),
  ])
}
