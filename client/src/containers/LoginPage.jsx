import React, {useEffect, useState} from 'react';
import Form from '../components/Form/Form';
import {useDispatch, useSelector} from 'react-redux';
import {authErrorReset, loginUser} from '../store/actions/userActions';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';
import Spinner from '../components/UI/Spinner/Spinner';

const LoginPage = () => {
  const [input, setInput] = useState({
    email: '',
    password: '',
  })
  const dispatch = useDispatch();
  const error = useSelector(state => state.user.error);
  const loading = useSelector(state => state.user.loading);

  const inputChangeHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const submitData = (e) => {
    e.preventDefault();
    dispatch(loginUser(input));
  }

  useEffect(() => {
    return (() => dispatch(authErrorReset()));
  }, [dispatch]);

  if (loading) {
    return <Spinner show={loading}/>
  }

  return (
    <Form click={submitData} title="Войти" redirect="Зарегистрироваться">
      {error ? <ErrorMessage click={() => dispatch(authErrorReset())} error={error.message}/> : null}
      <input type="email" placeholder="Адрес электронной почты" name="email" value={input.email}
             onChange={inputChangeHandler}/>
      <input type="password" placeholder="Пароль" name="password" value={input.password} onChange={inputChangeHandler}/>
    </Form>
  );
};

export default LoginPage;
