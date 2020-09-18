import React from 'react';
import {useSelector} from 'react-redux';
import {useRoutes} from './config/routes';
import Header from './components/Header/Header';

function App() {
  const isAuth = useSelector(state => state.user.token);
  const routes = useRoutes(isAuth);
  return (
    <>
      {
        isAuth ? <Header/> : null
      }
      <div className="container">
        {routes}
      </div>
    </>
  );
}

export default App;
