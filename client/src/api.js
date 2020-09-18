import axios from 'axios';
import {API_URL} from './config/constants';

export const axiosInstance = axios.create({
  baseURL: API_URL,
});

export function registerUser(userData) {
  return axiosInstance.post('/user/register', userData);
}

export function loginUser(userData) {
  return axiosInstance.post('/user/login', userData);
}

export function logoutUser() {
  return axiosInstance.delete('/user/login');
}

export function getUserInfoApi(id) {
  return axiosInstance.get('/user/profile/' + id);
}

export function searchUserApi(user) {
  return axiosInstance.post('/user/search', {username: user});
}

export function updateProfile(newUserData) {
  return axiosInstance.put('/user/profile', newUserData);
}

export function getPosts() {
  return axiosInstance.get('/posts');
}

export function getOnePost(id) {
  return axiosInstance.get('/posts/' + id);
}

export function getUserPostsApi(id) {
  return axiosInstance.get('/posts/user-posts/' + id);
}

export function createPost(postData) {
  return axiosInstance.post('/posts', postData);
}

export function commentPost(commentData) {
  return axiosInstance.post('/posts/comment', commentData);
}

export function likePost(id) {
  return axiosInstance.post('/posts/like', id);
}

export function unlikePost(id) {
  return axiosInstance.post('/posts/unLike', id);
}

export function likeComment(postId, commentId) {
  return axiosInstance.post('/posts/comment-like', {postId, commentId});
}

export function unlikeComment(postId, commentId) {
  return axiosInstance.post('/posts/comment-unlike', {postId, commentId});
}

export function subscribeToUser(id) {
  return axiosInstance.post('/user/subscribe', {id});
}

export function unSubscribeToUser(id) {
  return axiosInstance.post('/user/unsubscribe', {id});
}

export function getUsersChats() {
  return axiosInstance.get('/user/chats');
}

export function sharePostToUser(data) {
  return axiosInstance.post('/posts/share', data)
}
