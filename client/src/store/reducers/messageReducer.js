import {ac} from "../actions/actionTypes";

export const initialState = {
  messages: [],
  currentChat: null,
  chats: [],
  channelStatus: false,
  chatUserId: null,
  loading: false,
};

const handlers = {
  [ac.START_CHANNEL]: state => ({...state, channelStatus: true}),
  [ac.STOP_CHANNEL]: state => ({...state, channelStatus: false, loading: false}),
  [ac.GET_CHAT_USER_ID]: (state, {id}) => ({...state, chatUserId: id}),
  [ac.RESET_MESSAGES]: (state) => ({...state, messages: [], chatUserId: null}),
  [ac.GET_ALL_CHATS_START]: state => ({...state, loading: true}),
  [ac.GET_ALL_MESSAGES]: (state, {messages}) => ({
    ...state,
    messages: messages.messages,
    currentChat: messages.chat_id
  }),
  [ac.ADD_NEW_MESSAGE_LOCAL]: (state, {message}) => ({
    ...state,
    messages: [...state.messages, {...message, _id: Date.now()}]
  }),
  [ac.ADD_NEW_MESSAGE]: (state, {message}) => {
    if (message.chat_id !== state.currentChat) {
      return state;
    }
    return {...state, messages: [...state.messages, message]};
  },
  [ac.GET_ALL_CHATS]: (state, {chats}) => {
    const newChats = chats.chats.map(chat => ({...chat, users: chat.users.filter(u => u._id !== chats.id)}));
    return {...state, chats: newChats, loading: false};
  },
  DEFAULT: state => state,
};

const messageReducer = (state = initialState, action) => {
  const handle = handlers[action.type] || handlers.DEFAULT;
  return handle(state, action);
};

export default messageReducer;
