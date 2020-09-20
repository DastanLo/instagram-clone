import React, {useEffect} from 'react';
import User from '../components/User/User';
import {useDispatch, useSelector} from 'react-redux';
import Post from '../components/Post/Post';
import {addComment, getPost} from '../store/actions/postActions';
import Spinner from '../components/UI/Spinner/Spinner';
import {getUserInfo, resetUserInfo} from '../store/actions/userActions';


const MainPage = () => {
  const user = useSelector(state => state.user.user);
  const posts = useSelector(state => state.post.posts);
  const loading = useSelector(state => state.post.loading);
  const dispatch = useDispatch();

  const sendComment = (text, id) => {
    if (!text) {
      return;
    }
    dispatch(addComment({
      post: id,
      text,
    }));
  }

  useEffect(() => {
    dispatch(getUserInfo(user._id));
    dispatch(getPost());
    return (() => dispatch(resetUserInfo()));
  }, [dispatch, user._id]);

  return (
    <div className="main-page">
      {loading ? <Spinner show={loading}/> : null}
      <div>
        {
          posts.map(post => {
            return <Post likes={post.likes}
                         onSubmitComment={sendComment}
                         key={post._id}
                         id={post._id}
                         comments={post.comments}
                         date={post.date}
                         user={post.user}
                         description={post.description}
                         img={post.image}/>
          })
        }
      </div>
      <div className="fixed-block">
        <User id={user._id} image={user.avatar} name={user.username} fullName={user.fullName}/>
        <div className="recommendation-box">
          <div>Подписчики :</div>
          {
            user.followers.length
              ? user.followers.slice(-5).map(user => {
                return <User id={user._id} image={user.avatar} key={user._id} fullName={user.fullName}
                             name={user.username}/>
              })
              : 'У вас нет подписчиков'
          }
        </div>
      </div>
    </div>
  );
};

export default MainPage;
