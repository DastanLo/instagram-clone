import {ac} from "./actionTypes";

export const createPost = postData => ({type: ac.CREATE_POST, postData});
export const createPostSuccess = () => ({type: ac.CREATE_POST_SUCCESS});
export const createPostError = error => ({type: ac.CREATE_POST_ERROR, error});

export const getPost = () => ({type: ac.LOAD_POST});
export const getOnePost = id => ({type: ac.LOAD_ONE_POST, id});
export const getOnePostSuccess = post => ({type: ac.LOAD_ONE_POST_SUCCESS, post});
export const getAllPostsSuccess = posts => ({type: ac.LOAD_POST_SUCCESS, posts});
export const getAllPostsError = error => ({type: ac.LOAD_POST_ERROR, error});
export const getUserPosts = posts => ({type: ac.LOAD_USER_POSTS_SUCCESS, posts});
export const getUserPost = (id) => ({type: ac.LOAD_USER_POSTS, id});

export const resetPostError = () => ({type: ac.RESET_POST_ERROR})

export const addComment = (commentData) => ({type: ac.COMMENT_POST, commentData});
export const addCommentSync = (id, user, text) => ({type: ac.COMMENT_POST_SYNC, id, user, text});

export const likePost = (id) => ({type: ac.LIKE_POST, id});
export const unLikePost = (id) => ({type: ac.UNLIKE_POST, id});
export const likePostSync = (userId, id, isOnePost = false) => ({type: ac.LIKE_POST_SYNC, userId, id, isOnePost})
export const unLikePostSync = (userId, id, isOnePost = false) => ({type: ac.UNLIKE_POST_SYNC, userId, id, isOnePost});

export const likeComment = (postId, commentId) => ({type: ac.LIKE_COMMENT, postId, commentId});
export const unLikeComment = (postId, commentId) => ({type: ac.UNLIKE_COMMENT, postId, commentId});
export const likeCommentSync = (userId, commentId) => ({type: ac.LIKE_COMMENT_SYNC, userId, commentId});
export const unLikeCommentSync = (userId, commentId) => ({type: ac.UNLIKE_COMMENT_SYNC, userId, commentId});

export const sharePostToUser = data => ({type: ac.SHARE_POST, data});
