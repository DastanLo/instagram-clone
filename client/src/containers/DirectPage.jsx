import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import User from '../components/User/User';
import '../components/Post/post.css';
import {getUserIdForChat, getUserInfo, resetUserInfo} from '../store/actions/userActions';
import {
  addNewMessageLocal,
  getChat,
  getChats,
  getMessages,
  resetMessages,
  sendNewMessage,
  startChannel,
  stopChannel
} from '../store/actions/messageAction';
import Modal from '../components/UI/Modal/Modal';
import {NavLink} from 'react-router-dom';

const DirectPage = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const ref = useRef(null);
  const chatUserId = useSelector(state => state.message.chatUserId);
  const messages = useSelector(state => state.message.messages);
  const chats = useSelector(state => state.message.chats);
  const userInfo = useSelector(state => state.user.userInfo);
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();

  const inputChangeHandler = (e) => {
    setInput(e.target.value);
  };

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const writeToUser = (id) => {
    dispatch(getUserIdForChat(id));
    closeModal();
  };

  const sendMessage = (e) => {
    e.preventDefault();
    const message = {
      message: input,
      sender: user._id,
      users: [user._id, userInfo._id],
    };
    dispatch(sendNewMessage(message));
    dispatch(addNewMessageLocal(message));
    setInput('');
  };

  const openChat = (chat_id, userId) => {
    dispatch(getChats(user._id));
    dispatch(getUserInfo(userId));
    dispatch(getMessages(chat_id));
  };

  useEffect(() => {
    if (userInfo.username) {
      ref.current.scrollIntoView({behavior: 'smooth'});
    }
  }, [userInfo]);

  useEffect(() => {
    dispatch(startChannel(user._id));
    dispatch(getChats(user._id));
    if (chatUserId) {
      dispatch(getUserInfo(chatUserId));
      dispatch(getChat([chatUserId, user._id]));
    }
    return (() => {
      dispatch(stopChannel(true));
      dispatch(resetMessages());
      dispatch(resetUserInfo());
    });
  }, [dispatch, user._id, chatUserId]);

  return (
    <div className="direct_page">
      <Modal show={open} close={closeModal}>
        {user.follows.map(user => {
          return <User fullName={user.fullName}
                       id={user._id}
                       image={user.image}
                       name={user.username}
                       key={user._id} click={() => writeToUser(user._id)}/>
        })}
      </Modal>
      <div className="contacts">
        <div className="direct_header">
          <b>Direct</b>
        </div>
        <div className="contacts_list">
          {
            chats.map(chat => {
              return <User name={chat.users[0].username}
                           fullName={chat.users[0].fullName}
                           image={chat.users[0].avatar}
                           click={() => openChat(chat._id, chat.users[0]._id)}
                           key={chat._id}
                           id={chat.users[0]._id}/>
            })
          }
        </div>
      </div>
      <div className="message_window">
        {
          userInfo.username ?
            <div className="message_window_header">
              <User fullName={userInfo.fullName}
                    id={userInfo._id}
                    image={userInfo.avatar}
                    name={userInfo.username}/>
            </div>
            : <button onClick={openModal} className="btn">
              Отправить Сообщение
            </button>
        }
        {
          messages.map(message => {
            if (message.sender === user._id) {
              if (message.isLink) {
                return <p key={message._id} className="from-me">
                  <NavLink to={'/post/' + message.message}>
                    Это сообщение является ссылкой на пост. Кликните чтобы увидеть
                  </NavLink>
                </p>
              } else {
                return <p key={message._id} className="from-me">
                  {message.message}
                </p>
              }
            } else {
              if (message.isLink) {
                return <p key={message._id} className="from-them">
                  <NavLink to={'/post/' + message.message}>
                    Это сообщение является ссылкой на пост. Кликните чтобы увидеть
                  </NavLink>
                </p>
              } else {
                return <p key={message._id} className="from-them">{message.message}</p>
              }
            }
          })
        }
        <div ref={ref}/>
        {userInfo.username ?
          <form className="post_footer" onSubmit={sendMessage}>
            <input
              type="text"
              placeholder="Добавить Комментарий"
              onChange={inputChangeHandler}
              value={input}/>
            <button type="submit">Опубликовать</button>
          </form>
          : null}
      </div>
    </div>
  );
};

export default DirectPage;
