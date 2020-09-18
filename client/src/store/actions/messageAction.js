import {ac} from './actionTypes';

export const startChannel = (id) => ({type: ac.START_CHANNEL, id});
export const stopChannel = (disconnect) => ({type: ac.STOP_CHANNEL, disconnect});
export const getAllMessages = messages => ({type: ac.GET_ALL_MESSAGES, messages});
export const getMessages = chat_id => ({type: ac.GET_MESSAGES, chat_id});
export const getAllChats = chats => ({type: ac.GET_ALL_CHATS, chats});
export const getChats = id => ({type: ac.GET_CHATS, id});
export const getChat = users => ({type: ac.GET_CHAT, users});
export const addNewMessage = message => ({type: ac.ADD_NEW_MESSAGE, message});
export const addNewMessageLocal = message => ({type: ac.ADD_NEW_MESSAGE_LOCAL, message});
export const resetMessages = () => ({type: ac.RESET_MESSAGES});
export const sendNewMessage = message => ({type: ac.SEND_NEW_MESSAGE, message});
