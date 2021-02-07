
import NavBar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register'
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';
import {useEffect} from 'react'

import setAuthToken from './utils/setAuthToken'

//Redux
import {Provider} from 'react-redux'
import store from './store'

import {BrowserRouter, Route, Switch} from 'react-router-dom';

import './App.css'

import {loadUser} from './actions/auth'

if(localStorage.token) {
  setAuthToken(localStorage.token)
}


const  App = () => {

useEffect(() => {
  store.dispatch(loadUser());
},[])

  return (
    <Provider store={store}>
    <BrowserRouter>
    <>
      <NavBar />
      <Route exact path="/" component={Landing}/>
      <section className="container">
        <Alert />
        <Switch>
          <Route exact path='/register' component={Register} />
          <Route exact path='/login' component={Login} />
          <PrivateRoute exact path='/dashboard' component={Dashboard} />

        </Switch>
      </section>
    </>
    </BrowserRouter>
    </Provider>
  );
}

export default App;
