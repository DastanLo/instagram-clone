import React, {memo, useCallback, useEffect, useState} from 'react';
import './post.css';
import User from '../User/User';
import {useDispatch, useSelector} from 'react-redux';
import {
  addCommentSync,
  likePost,
  likePostSync,
  sharePostToUser,
  unLikePost,
  unLikePostSync
} from '../../store/actions/postActions';
import {NavLink} from 'react-router-dom';
import Modal from '../UI/Modal/Modal';

const Post = memo(({user, comments, id, onSubmitComment, date, description, likes, img}) => {
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const thisUser = useSelector(state => state.user.user);
  const [isLiked, setIsLiked] = useState(false);
  const dispatch = useDispatch();
  const datetime = new Date(date).toLocaleDateString();
  const style = {
    color: '#DF2B44',
  }

  const addComment = (e) => {
    e.preventDefault();
    dispatch(addCommentSync({id, user: thisUser, text: input}));
    onSubmitComment(input, id);
    setInput('');
  };

  const likeThisPost = async () => {
    if (isLiked) {
      dispatch(unLikePostSync(thisUser._id, id))
      setIsLiked(false);
      return dispatch(unLikePost({id}));
    }
    dispatch(likePostSync(thisUser._id, id));
    setIsLiked(true);
    dispatch(likePost({id}));
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

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = useCallback(() => {
    setOpen(false);
  },[]);

  useEffect(() => {
    if (likes.includes(thisUser._id)) {
      setIsLiked(true);
    }
  }, [likes, thisUser._id]);

  return (
    <div className="post">
      <div className="post_header">
        <User id={user._id} image={user.avatar} name={user.username}/>
        <div className="post_settings">
          ***
        </div>
      </div>
      <div className="post_body">
        <img src={img} alt="post img"/>
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
        <div className="post_comments">
          <NavLink to={'/post/' + id}><span>Показать все комментарий ({comments.length})</span></NavLink>
          {
            comments.slice(-2).map(comment => {
              return <p key={comment._id}><b>{comment.user.username}</b> {comment.text}</p>
            })
          }
          <div className="post_date">
            {datetime}
          </div>
        </div>
      </div>
      <form className="post_footer" onSubmit={addComment}>
        <input
          type="text"
          placeholder="Добавить Комментарий"
          onChange={(e) => setInput(e.target.value)}
          value={input}/>
        <button type="submit">Опубликовать</button>
      </form>
      <Modal show={open} close={closeModal}>
        {thisUser.follows.length ? thisUser.follows.map(user => {
            return <div key={user._id} className="share-users-list">
              <User name={user.username}
                    image={user.avatar}
                    id={user._id}
                    fullName={user.fullName}/>
              <button onClick={sharePost.bind(null, user._id)}>Отправить</button>
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

export default Post;
