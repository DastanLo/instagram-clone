import React, {useEffect} from 'react';
import {useParams} from 'react-router-dom';
import PostInfo from '../components/PostInfo/PostInfo';
import {useDispatch, useSelector} from 'react-redux';
import {addComment, getOnePost} from '../store/actions/postActions';

const PostInfoPage = () => {
  const post = useSelector(state => state.post.post);
  const dispatch = useDispatch();
  const {id} = useParams();

  const addNewComment = (text) => {
    if (!text) {
      return;
    }
    dispatch(addComment({
      post: id,
      text,
    }));
  }

  useEffect(() => {
    dispatch(getOnePost(id));
  }, [dispatch, id]);

  return (
    <>
      <PostInfo likes={post.likes}
                key={post._id}
                id={post._id}
                comments={post.comments}
                description={post.description}
                img={post.image}
                onSubmit={addNewComment}
                user={post.user}/>
    </>
  );
};

export default PostInfoPage;
