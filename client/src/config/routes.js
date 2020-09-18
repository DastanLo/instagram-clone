import React, {Suspense, lazy} from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import Spinner from '../components/UI/Spinner/Spinner';

const LoginPage = lazy(() => import('../containers/LoginPage'));
const DirectPage = lazy(() => import('../containers/DirectPage'));
const MainPage = lazy(() => import('../containers/MainPage'));
const PostInfoPage = lazy(() => import('../containers/PostInfoPage'));
const ProfilePage = lazy(() => import('../containers/ProfilePage'));
const RegisterPage = lazy(() => import('../containers/RegisterPage'));
const AddPostPage = lazy(() => import('../containers/AddPostPage'));

export const useRoutes = isAuthenticated => {
  if (isAuthenticated) {
    return (
      <Suspense fallback={<Spinner show={true}/>}>
        <Switch>
          <Route path="/" exact component={MainPage}/>
          <Route path="/add-post" exact component={AddPostPage}/>
          <Route path="/user/messages" exact component={DirectPage}/>
          <Route path="/post/:id" exact component={PostInfoPage}/>
          <Route path="/profile/:id" exact component={ProfilePage}/>
          <Redirect to="/"/>
        </Switch>
      </Suspense>
    )
  }
  return (
    <Suspense fallback={<Spinner show={true}/>}>
      <Switch>
        <Route path="/" exact component={RegisterPage}/>
        <Route path="/login" exact component={LoginPage}/>
        <Redirect to="/"/>
      </Switch>
    </Suspense>
  )
};
