import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory, useParams} from 'react-router-dom';
import {getUserPost} from '../store/actions/postActions';
import {
  getUserIdForChat,
  getUserInfo,
  logoutUser, resetUserInfo,
  subscribeToUser,
  unSubscribeToUser,
  updateProfile
} from '../store/actions/userActions';
import Spinner from '../components/UI/Spinner/Spinner';
import Modal from '../components/UI/Modal/Modal';
import User from '../components/User/User';
import {defaultAvatar} from '../config/constants';

const ProfilePage = () => {
  const [show, setShow] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const user = useSelector(state => state.user.userInfo);
  const error = useSelector(state => state.user.error);
  const thisUser = useSelector(state => state.user.user);
  const loading = useSelector(state => state.user.loading);
  const posts = useSelector(state => state.post.userPosts);
  const dispatch = useDispatch();
  const history = useHistory();
  const {id} = useParams();

  const click = (id) => {
    history.push('/post/' + id);
  };

  const getFollowers = () => {
    if (!user.followers.length) {
      return;
    }
    setShow(user.followers);
  };

  const getFollows = () => {
    if (!user.follows.length) {
      return;
    }
    setShow(user.follows);
  };

  const subscribe = () => {
    dispatch(subscribeToUser(id));
    setIsSubscribed(true);
  };

  const logout = () => {
    dispatch(logoutUser());
  }

  const unSubscribe = () => {
    dispatch(unSubscribeToUser(id));
    setIsSubscribed(false);
  }

  const writeMessage = () => {
    dispatch(getUserIdForChat(id));
    history.push('/user/messages/');
  };

  const changeButton = () => {
    if (isSubscribed) {
      return (
        <>
          <button onClick={writeMessage}>написать</button>
          <button onClick={unSubscribe} className="sub-btn">
            Отписаться
          </button>
        </>
      )
    }
    return (
      <>
        <button onClick={writeMessage}>написать</button>
        <button onClick={subscribe}>подписаться</button>
      </>
    )
  }

  const closeModal = () => {
    setShow(null);
  }

  const inputChangeHandler = (e) => {
    if (e.target.files[0]) {
      const formData = new FormData();
      formData.append('avatar', e.target.files[0]);
      dispatch(updateProfile(formData));
    }
  }

  useEffect(() => {
    dispatch(getUserInfo(id));
    dispatch(getUserPost(id));
    return (() => {
      setShow(null);
      dispatch(resetUserInfo());
    })
  }, [dispatch, id]);

  useEffect(() => {
    const userSubList = user.followers.map(u => u._id);
    if (userSubList.includes(thisUser._id)) {
      setIsSubscribed(true);
    }
    return (() => {
      setIsSubscribed(false);
    });
  }, [user, thisUser, dispatch]);

  if (error) {
    return <div className="profile">
      <p>К сожалению эта страница не доступна</p>
    </div>
  }

  return (
    <div className="profile">
      <Modal show={!!show} close={closeModal}>
        {
          show?.map(user => {
            return <User fullName={user.fullName}
                         name={user.username}
                         image={user.avatar}
                         id={user._id}
                         key={user._id}/>
          })
        }
      </Modal>
      {
        loading ? <Spinner show={loading}/> : null
      }
      <div className="profile_header">
        <div className="avatar">
          <label htmlFor="avatar">
            <img
              src={user.avatar || defaultAvatar}
              alt="avatar"/>
          </label>
          <input disabled={thisUser._id !== user._id} onChange={inputChangeHandler} type="file" id="avatar"/>
        </div>
        <div className="subscribes-block">
          <div>
            <span>{user.username}</span>
            {user._id !== thisUser._id ? changeButton()
              : <button onClick={logout}>Выход</button>}
          </div>
          <div>
            <span><b>{posts.length}</b> публикации</span>
            <span onClick={getFollowers}><b>{user.followers.length}</b> подпичисков</span>
            <span onClick={getFollows}><b>{user.follows.length}</b> подписок</span>
          </div>
          <div>
            <b>{user.fullName}</b>
          </div>
        </div>
      </div>
      <hr/>
      <div className="sub-mobile">
        <span><b>{posts.length}</b> <span>публикации</span></span>
        <span onClick={getFollowers}><b>{user.followers.length}</b> <span>подписчиков</span></span>
        <span onClick={getFollows}><b>{user.follows.length}</b> <span>подписок</span></span>
      </div>
      <div className="user_images">
        {posts.length ?
          posts.map(p => {
            return <img onClick={() => click(p._id)} src={p.image} key={p._id} alt={p.description}/>
          }) :
          <p className="user_images_text">У вас еще нет публикации</p>
        }
      </div>
    </div>
  );
};

export default ProfilePage;
