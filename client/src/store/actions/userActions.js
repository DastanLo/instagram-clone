import {ac} from "./actionTypes";

export const authErrorReset = () => ({type: ac.AUTH_ERROR_RESET});
export const resetUserInfo = () => ({type: ac.RESET_USER_INFO});

export const registerUserSuccess = () => ({type: ac.REGISTER_USER_SUCCESS});
export const registerUserFailure = error => ({type: ac.REGISTER_USER_FAILURE, error});
export const registerUser = userData => ({type: ac.REGISTER_USER, userData});

export const loginUserSuccess = user => ({type: ac.LOGIN_USER_SUCCESS, user});
export const loginUserFailure = error => ({type: ac.LOGIN_USER_ERROR, error});
export const loginUser = userData => ({type: ac.LOGIN_USER, userData});
export const logoutUser = () => ({type: ac.LOG_OUT_USER});

export const getUserIdForChat = id => ({type: ac.GET_CHAT_USER_ID, id});
export const getUserInfo = (id) => ({type: ac.GET_USER_INFO, id});
export const getUserInfoSuccess = (user) => ({type: ac.GET_USER_INFO_SUCCESS, user});
export const getUserInfoError = (error) => ({type: ac.GET_USER_INFO_ERROR, error});

export const updateProfile = newUserData => ({type: ac.UPDATE_PROFILE, newUserData});
export const updateProfileSuccess = user => ({type: ac.UPDATE_PROFILE_SUCCESS, user});
export const updateProfileError = error => ({type: ac.UPDATE_PROFILE_ERROR, error});


export const subscribeToUser = username => ({type: ac.SUBSCRIBE_USER, username});
export const subscribeToUserSuccess = () => ({type: ac.SUBSCRIBE_USER_SUCCESS});
export const subscribeToUserError = error => ({type: ac.SUBSCRIBE_USER_ERROR, error});
export const unSubscribeToUser = id => ({type: ac.UNSUBSCRIBE_USER, id});

export const searchUser = (user) => ({type: ac.SEARCH_USER, user});
export const searchUserSuccess = (user) => ({type: ac.SEARCH_USER_SUCCESS, user});
export const searchUserReset = () => ({type: ac.SEARCH_USER_RESET});

