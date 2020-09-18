import React, {useCallback, useEffect} from 'react';
import {NavLink} from 'react-router-dom';
import classes from './header.module.css';
import {useDispatch, useSelector} from 'react-redux';
import {searchUser, searchUserReset} from '../../store/actions/userActions';
import User from '../User/User';

const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);
  const foundUser = useSelector(state => state.user.foundUser);

  const inputChangeHandler = (e) => {
    if (!e.target.value.length) {
      return dispatch(searchUserReset());
    }
    dispatch(searchUser(e.target.value));
  };

  const hideSearchList = useCallback((e) => {
    if (!e.target.classList.contains(classes.search_list)) {
      dispatch(searchUserReset());
    }
  }, [dispatch]);

  useEffect(() => {
    window.addEventListener('click', hideSearchList);
    return (() => {
      window.removeEventListener('click', hideSearchList);
    })
  }, [hideSearchList]);

  return (
    <header className={classes.header}>
      <div className={classes.header_item + ' container'}>
        <NavLink to="/" className={classes.logo}/>
        <div className={classes.search}>
          <input onChange={inputChangeHandler} type="text" placeholder="Поиск"/>
          <i className="fas fa-search"/>
          {foundUser?.length > 0 ? <div className={classes.search_list}>
            {
              foundUser?.map(user => {
                return <User id={user._id}
                             key={user._id}
                             image={user.avatar}
                             name={user.username}/>
              })
            }
          </div> : null}
        </div>
        <nav>
          <ul className={classes.list}>
            <NavLink to="/">
              <li className="fas fa-home"/>
            </NavLink>
            <NavLink to="/add-post">
              <li className="fas fa-camera"/>
            </NavLink>
            <NavLink to="/user/messages">
              <li className="far fa-paper-plane"/>
            </NavLink>
            <NavLink to={'/profile/' + user._id}>
              <li className="fas fa-user"/>
            </NavLink>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
