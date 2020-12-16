import React, {memo} from 'react';
import {NavLink} from 'react-router-dom';
import './user.css';
import {defaultAvatar} from '../../config/constants';

const User = memo(({name, fullName = null, image = null, id, click = null}) => {
  return (
    <div className="user" onClick={click}>
      <NavLink to={click ? '#' : '/profile/' + id}>
        <img src={image || defaultAvatar} alt="user avatar"/>
        <span><b>{name?.length > 18 ? name.slice(0, 14) : name}</b> {fullName ? <span>{fullName}</span> : null}</span>
      </NavLink>
    </div>
  );
});

export default User;
