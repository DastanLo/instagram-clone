import {call, cancelled, fork, put, take} from 'redux-saga/effects'
import {eventChannel} from 'redux-saga'
import io from 'socket.io-client';
import {API_URL} from '../../config/constants';
import {ac} from '../actions/actionTypes';
import {
  addNewMessage,
  getAllChats,
  getAllMessages,
  getChats,
  getUserChatsStart,
  stopChannel
} from '../actions/messageAction';
import {getUsersChats} from '../../api';
import {logoutUser} from '../actions/userActions';


function connect(id) {
  const socket = io(API_URL);
  return new Promise(resolve => {
    socket.on('connect', () => {
      socket.emit(ac.CONNECT_USER, id);
      resolve(socket);
    });
  });
}

function* read(socket) {
  const channel = yield call(subscribe, socket);
  while (true) {
    let action = yield take(channel);
    yield put(action);
  }
}

export function* subscribe(socket) {
  return yield new eventChannel(emit => {
    const updateMessages = messages => {
      emit(getAllMessages(messages));
    }
    const updateMessage = ({newMessage, id}) => {
      emit(addNewMessage(newMessage));
      emit(getChats(id));
    }
    const updateChat = chat => {
      if (chat) {
        socket.emit(ac.GET_MESSAGES, chat._id);
      }
    }
    socket.on(ac.GET_ALL_MESSAGES, updateMessages);
    socket.on(ac.SEND_MESSAGE, updateMessage);
    socket.on(ac.SEND_CHAT, updateChat);
    return () => {
      socket.off(ac.GET_ALL_MESSAGES, updateMessages);
      socket.off(ac.SEND_MESSAGE, updateMessage);
      socket.off(ac.SEND_CHAT, updateChat);
    }
  })
}


export function* getUserChatsSaga() {
  try {
    yield put(getUserChatsStart());
    const response = yield getUsersChats();
    yield put(getAllChats(response.data));
  } catch (e) {
    if (e.response?.status === 401) {
      return yield put(logoutUser());
    }
    yield put(stopChannel());
  }
}

function* getUsersAllMessages(socket) {
  while (true) {
    const {chat_id} = yield take(ac.GET_MESSAGES);
    socket.emit(ac.GET_MESSAGES, chat_id);
  }
}

function* getUserChat(socket) {
  while (true) {
    const {users} = yield take(ac.GET_CHAT);
    socket.emit(ac.GET_CHAT, users);
  }
}

function* sendToUserNewMessage(socket) {
  while (true) {
    const {message} = yield take(ac.SEND_NEW_MESSAGE);
    socket.emit(ac.NEW_MESSAGE, message);
  }
}

export function* flow() {
  const {id} = yield take(ac.START_CHANNEL);
  const socket = yield call(connect, id);
  try {
    yield fork(read, socket);
    yield fork(getUsersAllMessages, socket);
    yield fork(getUserChat, socket);
    yield fork(sendToUserNewMessage, socket);
  } catch {
    socket.close();
  } finally {
    if (yield cancelled()) {
      socket.disconnect();
    }
  }
}
