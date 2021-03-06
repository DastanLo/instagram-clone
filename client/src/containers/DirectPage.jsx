import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import User from '../components/User/User';
import '../components/Post/post.css';
import {getUserIdForChat} from '../store/actions/userActions';
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
import Spinner from '../components/UI/Spinner/Spinner';

const DirectPage = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const ref = useRef(null);
  const chatLoading = useSelector(state => state.message.loading);
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

  const closeModal = useCallback(() => {
    setOpen(false);
  },[]);

  const writeToUser = useCallback((writeUser) => {
    setCurrentUser(writeUser)
    dispatch(getUserIdForChat(writeUser._id));
    closeModal();
  },[dispatch, closeModal]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input) {
      return;
    }
    const message = {
      message: input,
      sender: user._id,
      users: [user._id, currentUser._id],
    };
    dispatch(sendNewMessage(message));
    dispatch(addNewMessageLocal(message));
    setInput('');
  };

  const openChat = useCallback((chat_id, selectedUser) => {
    setCurrentUser(selectedUser);
    if (chatUserId) {
      dispatch(getChats(user._id));
    }
    dispatch(resetMessages());
    dispatch(getMessages(chat_id));
  },[dispatch, user._id, chatUserId]);

  useEffect(() => {
    if (messages.length > 0) {
      try{
        ref.current.scrollIntoView({behavior: 'smooth'});
      } catch(e) {
        //do nothing
      }
    }
  }, [messages]);

  useEffect(() => {
    if (chatUserId) {
      if (userInfo._id === chatUserId) {
        setCurrentUser(userInfo);
      }
      dispatch(getChat([chatUserId, user._id]));
    }
  },[chatUserId, user._id, dispatch, userInfo]);

  useEffect(() => {
    dispatch(startChannel(user._id));
    dispatch(getChats(user._id));
    return (() => {
      dispatch(stopChannel(true));
      setCurrentUser(null);
      dispatch(resetMessages());
    });
  }, [dispatch, user._id]);
  return (
    <div className="direct_page">
      {chatLoading ? <Spinner/>: null}
      <Modal show={open} close={closeModal}>
        {user.follows.length ? user.follows.map(user => {
          return <User fullName={user.fullName}
                       id={user._id}
                       image={user.image}
                       name={user.username}
                       key={user._id} click={writeToUser.bind(null, user)}/>
        }) :
        <div>
          Вы ни на кого не подписаны, подпишитесь чтобы их имя отобразилось в списке
        </div>}
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
                           click={openChat.bind(null, chat._id, chat.users[0])}
                           key={chat._id}
                           id={chat.users[0]._id}/>
            })
          }
        </div>
      </div>
      <div className="message_window" style={{display: !currentUser ? 'flex' : 'block'}}>
        {
          currentUser ?
            <div className="message_window_header" >
              <User fullName={currentUser.fullName}
                    id={currentUser._id}
                    image={currentUser.avatar}
                    name={currentUser.username}/>
            </div>
            : <button onClick={openModal} className="btn">
              Отправить Сообщение
            </button>
        }
        {
          messages.length ?
            <div className="message_list">
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
            </div> :
            <div className="none-message"/>
        }

        <div ref={ref}/>
        {currentUser && !chatLoading ?
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
