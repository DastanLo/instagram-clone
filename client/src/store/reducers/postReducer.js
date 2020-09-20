import {ac} from "../actions/actionTypes";

const initialState = {
  error: null,
  posts: [],
  userPosts: [],
  post: {
    likes: [],
    description: '',
    comments: [],
    image: '',
    user: '',
  },
  loading: false,
};

const handlers = {
  [ac.LOAD_POST]: (state) => ({...state, loading: true}),
  [ac.LOAD_ONE_POST]: state => ({...state, loading: true}),
  [ac.LOAD_USER_POSTS_SUCCESS]: (state, {posts}) => ({...state, userPosts: posts}),
  [ac.LOAD_ONE_POST_SUCCESS]: (state, {post}) => ({...state, post, loading: false}),
  [ac.LOAD_POST_SUCCESS]: (state, {posts}) => ({...state, posts, loading: false, error: false}),
  [ac.LOAD_POST_ERROR]: (state, {error}) => ({...state, error, loading: false}),
  [ac.CREATE_POST]: (state) => ({...state, loading: true}),
  [ac.CREATE_POST_ERROR]: (state, {error}) => ({...state, error, loading: false}),
  [ac.CREATE_POST_SUCCESS]: (state) => ({...state, error: null, loading: false}),
  [ac.RESET_POST_ERROR]: state => ({...state, error: null}),
  [ac.POST_ERROR]: (state, {e}) => ({...state, error: e, loading: false}),
  [ac.COMMENT_POST_SYNC]: (state, {payload}) => {
    const commentData = {
      user: payload.user,
      text: payload.text,
      likes: [],
      date: Date.now(),
      _id: payload._id,
    };
    if (payload.onePost) {
      console.log(payload);
      return {...state, post: {...state.post, comments: [...state.post.comments, commentData]}};
    } else {
      const newPosts = state.posts.map(post => {
        if (post._id === payload.id) {
          post.comments.push({...commentData, _id: Date.now()});
        }
        return post;
      });
      return {...state, posts: newPosts};
    }
    },
  [ac.LIKE_POST_SYNC]: (state, {userId, id, isOnePost}) => {
    if (!isOnePost) {
      const posts = state.posts.map(post => {
        if (post._id === id) {
          post.likes.push(userId);
        }
        return post;
      });
      return {...state, posts};
    } else {
      const likes = [...state.post.likes, userId];
      return {...state, post: {...state.post, likes}};
    }
  },
  [ac.UNLIKE_POST_SYNC]: (state, {userId, id, isOnePost}) => {
    if (!isOnePost) {
      const posts = state.posts.map(post => {
        if (post._id === id) {
          post.likes = post.likes.filter(p => p !== userId);
        }
        return post;
      });
      return {...state, posts};
    } else {
      const likes = state.post.likes.filter(l => l !== userId);
      return {...state, post: {...state.post, likes}};
    }
  },
  [ac.LIKE_COMMENT_SYNC]: (state, {userId, commentId}) => {
    let post = JSON.parse(JSON.stringify(state.post));
    post.comments = post.comments.map(comment => {
      if (comment._id === commentId) {
        comment.likes.push(userId);
      }
      return comment;
    })
    return {...state, post};
  },
  [ac.UNLIKE_COMMENT_SYNC]: (state, {userId, commentId}) => {
    let post = JSON.parse(JSON.stringify(state.post));
    post.comments = post.comments.map(comment => {
      if (comment._id === commentId) {
        comment.likes = comment.likes.filter(c => c !== userId);
      }
      return comment;
    })
    return {...state, post};
  },
  DEFAULT: (state) => state,
};

const postReducer = (state = initialState, action) => {
  const handle = handlers[action.type] || handlers.DEFAULT;
  return handle(state, action);
};

export default postReducer;
