import React, {memo} from 'react';
import classes from './form.module.css';
import {NavLink} from 'react-router-dom';

const Form = memo(({children, click, title, redirect, path = ''}) => {
  return (
    <div className={classes.container}>
      <form className={classes.form} onSubmit={click}>
        <h1>{title}</h1>
        {children}
        <button className={classes.submitButton} type="submit">
          Submit
        </button>
      </form>
      <div className={classes.redirect}>
        {redirect === 'Зарегистрироваться' ? 'Уже есть аккаунт?' : 'Нет аккаунта?'}
        <NavLink to={'/' + path}>
          {redirect}
        </NavLink>
      </div>
    </div>
  );
});

export default Form;
