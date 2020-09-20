import {push} from "connected-react-router";
import {put} from "redux-saga/effects";
import {
  commentPost,
  createPost,
  getOnePost,
  getPosts,
  getUserPostsApi,
  likeComment,
  likePost, sharePostToUser,
  unlikeComment,
  unlikePost
} from "../../api";
import {
  addCommentSync,
  createPostError,
  createPostSuccess,
  getAllPostsError,
  getAllPostsSuccess,
  getOnePostSuccess,
  getUserPosts, postError
} from "../actions/postActions";
import {logoutUser} from '../actions/userActions';

export function* getPostsSaga() {
  try {
    const response = yield getPosts();
    yield put(getAllPostsSuccess(response.data));
  } catch (e) {
    if (e.response?.status === 401) {
      return yield put(logoutUser());
    }
    yield put(getAllPostsError(e));
  }
}

export function* getUserPostsSaga({id}) {
  try {
    const response = yield getUserPostsApi(id);
    yield put(getUserPosts(response.data));
  } catch (e) {
    if (e.response?.status === 401) {
      return yield put(logoutUser());
    }
    yield put(getAllPostsError(e.response.data));
  }
}

export function* getOnePostSaga({id}) {
  try {
    const response = yield getOnePost(id);
    yield put(getOnePostSuccess(response.data));
  } catch (e) {
    if (e.response?.status === 401) {
      return yield put(logoutUser());
    }
    yield put(getAllPostsError(e));
  }
}

export function* createPostSaga({postData}) {
  try {
    yield createPost(postData);
    yield put(createPostSuccess());
    yield put(push('/'));
  } catch (e) {
    if (e.response?.status === 401) {
      return yield put(logoutUser());
    }
    yield put(createPostError(e.response.data));
  }
}

export function* addCommentSaga({commentData}) {
  try {
    const response = yield commentPost(commentData);
    yield put(addCommentSync({...response.data, onePost: true}));
  } catch (e) {
    if (e.response?.status === 401) {
      return yield put(logoutUser());
    }
    yield put(postError(e));
  }
}

export function* likePostSaga({id}) {
  try {
    yield likePost(id);
  } catch (e) {
    if (e.response?.status === 401) {
      return yield put(logoutUser());
    }
    yield put(postError(e));
  }
}

export function* unlikePostSaga({id}) {
  try {
    yield unlikePost(id);
  } catch (e) {
    if (e.response?.status === 401) {
      return yield put(logoutUser());
    }
    yield put(postError(e));
  }
}


export function* likeCommentSaga({postId, commentId}) {
  try {
    yield likeComment(postId, commentId);
  } catch (e) {
    if (e.response?.status === 401) {
      return yield put(logoutUser());
    }
    yield put(postError(e));
  }
}

export function* unlikeCommentSaga({postId, commentId}) {
  try {
    yield unlikeComment(postId, commentId);
  } catch (e) {
    if (e.response?.status === 401) {
      return yield put(logoutUser());
    }
    yield put(postError(e));
  }
}

export function* sharePostSaga({data}) {
  try {
    yield sharePostToUser(data);
  } catch (e) {
    if (e.response?.status === 401) {
      return yield put(logoutUser());
    }
    yield put(postError(e));
  }
}
