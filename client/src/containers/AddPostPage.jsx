import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {createPost, resetPostError} from '../store/actions/postActions';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';
import Spinner from '../components/UI/Spinner/Spinner';

const AddPostPage = () => {
  const [input, setInput] = useState({
    image: '',
    description: '',
  });
  const error = useSelector(state => state.post.error);
  const loading = useSelector(state => state.post.loading);
  const dispatch = useDispatch();

  const inputFileChange = (e) => {
    setInput({...input, image: e.target.files[0]});
  };

  const addPost = () => {
    const formData = new FormData();
    Object.keys(input).forEach(key => {
      let value = input[key];
      formData.append(key, value);
    });
    dispatch(createPost(formData));
  }

  useEffect(() => {
    return (() => dispatch(resetPostError()));
  }, [dispatch]);

  return (
    <div className="add-post">
      {loading ? <Spinner show={loading}/> : null}
      <div className="input__wrapper">
        {error ? <ErrorMessage click={() => dispatch(resetPostError())} error={error.message}/> : null}
        <input type="file" onChange={inputFileChange} id="input__file" className="input input__file"/>
        <label htmlFor="input__file" className="input__file-button">
            <span className="input__file-icon-wrapper">
              <i className="fas fa-file-upload"/>
            </span>
          <span className="input__file-button-text">
                  Выберите фото
            </span>
        </label>
        <input value={input.description}
               onChange={(e) => setInput({...input, description: e.target.value})}
               type="text"
               required
               className="description_post"
               placeholder="Описание"/>
        <button className="btn-post" onClick={addPost}>Добавить фото</button>
      </div>
    </div>
  );
};

export default AddPostPage;
