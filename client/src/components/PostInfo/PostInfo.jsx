import React, {memo, useEffect, useState} from 'react';
import User from '../User/User';
import './postInfo.css';
import '../Post/post.css';
import Comment from '../Comment/Comment';
import {NavLink} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {likePost, likePostSync, sharePostToUser, unLikePost, unLikePostSync} from '../../store/actions/postActions';
import Modal from '../UI/Modal/Modal';
import Spinner from '../UI/Spinner/Spinner';

const PostInfo = memo(({img, likes, id, user, onSubmit, description, comments}) => {
  const [input, setInput] = useState('');
  const loading = useSelector(state => state.post.loading);
  const [open, setOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const thisUser = useSelector(state => state.user.user);
  const dispatch = useDispatch();
  const style = {
    color: '#DF2B44',
  }

  const inputChangeHandler = (e) => {
    setInput(e.target.value);
  };

  const addComment = (e) => {
    e.preventDefault();
    onSubmit(input);
    setInput('');
  };

  const sharePost = (userId) => {
    dispatch(sharePostToUser({
      users: [thisUser._id, userId],
      message: id,
      sender: thisUser._id,
      isLink: true,
    }));
    closeModal();
  };

  const likeThisPost = async () => {
    if (isLiked) {
      dispatch(unLikePostSync(thisUser._id, id, true))
      setIsLiked(false);
      return dispatch(unLikePost({id}));
    }
    dispatch(likePostSync(thisUser._id, id, true));
    setIsLiked(true);
    dispatch(likePost({id}));
  };

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (likes.includes(thisUser._id)) {
      setIsLiked(true);
    }
  }, [likes, thisUser._id]);

  return (
    <div className="post-info">
      {loading ? <Spinner show={loading}/> : null}
      <div className="post-img">
        <img src={img} alt="postInfo"/>
      </div>
      <div className="comment-block">
        <div className="comment-block-header">
          <User id={user._id} image={user.avatar} name={user.username} fullName={user.fullName}/>
        </div>
        <div className="comments_list">
          {comments.map(com => {
            return <Comment key={com._id} commentId={com._id} postId={id} user={com.user} likes={com.likes}
                            date={com.date} text={com.text}/>
          })}
        </div>
        <div>
          <div className="post_box">
            <i onClick={likeThisPost} style={isLiked ? style : null}
               className={'far fa-heart' + (isLiked ? ' fas' : '')}/>
            <NavLink to={'/post/' + id}><i className="far fa-comment"/></NavLink>
            <i onClick={openModal} className="far fa-paper-plane"/>
          </div>
          <div className="likes-number">
            {likes.length} отметок нравится
          </div>
          <div className="post_description">
          <span>
            {user.username}
          </span>
            <p>{description}</p>
          </div>
          <form onSubmit={addComment}>
            <div className="post_footer">
              <input value={input} onChange={inputChangeHandler} type="text" placeholder="Добавить Комментарий"/>
              <button type="submit">Опубликовать</button>
            </div>
          </form>
        </div>
      </div>
      <Modal show={open} close={closeModal}>
        {thisUser.follows.length ? thisUser.follows.map(user => {
            return <div key={user._id} className="share-users-list">
              <User name={user.username}
                    image={user.avatar}
                    id={user._id}
                    fullName={user.fullName}/>
              <button onClick={() => sharePost(user._id)}>Отправить</button>
            </div>
          }) :
          <div>
            Вы ни на кого не подписаны, подпишитесь чтобы делиться с друзьями
          </div>
        }
      </Modal>
    </div>
  );
});

export default PostInfo;
