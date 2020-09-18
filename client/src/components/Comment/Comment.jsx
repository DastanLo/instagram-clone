import React, {useEffect, useState, memo} from 'react';
import User from '../User/User';
import './comment.css';
import {useDispatch, useSelector} from 'react-redux';
import {likeComment, likeCommentSync, unLikeComment, unLikeCommentSync} from '../../store/actions/postActions';

const Comment = memo(({text, user, postId, commentId, date, likes}) => {
  const thisUser = useSelector(state => state.user.user);
  const [isLiked, setIsLiked] = useState(false);
  const dispatch = useDispatch();
  const datetime = new Date(date).toLocaleDateString();
  const style = {
    color: '#DF2B44',
  }
  const likeThisComment = () => {
    if (isLiked) {
      dispatch(unLikeCommentSync(thisUser._id, commentId));
      setIsLiked(false);
      return dispatch(unLikeComment(postId, commentId));
    }
    dispatch(likeCommentSync(thisUser._id, commentId));
    setIsLiked(true);
    dispatch(likeComment(postId, commentId));
  };

  useEffect(() => {
    if (likes.includes(thisUser._id)) {
      setIsLiked(true);
    }
  }, [likes, thisUser._id]);


  return (
    <div className="comment">
      <div>
        <div>
          <User id={user._id} name={user.username} image={user.avatar}/>
          <span className="comment_text">{text}</span>
        </div>
        <i onClick={likeThisComment} style={isLiked ? style : null} className={'far fa-heart' + (isLiked ? ' fas' : '')}/>
      </div>
      <div className="comment-info">
        <span>
          {datetime}
        </span>
        <b>
          {likes.length} лайков
        </b>
      </div>
    </div>
  );
});

export default Comment;
