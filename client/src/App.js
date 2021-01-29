
import NavBar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register'
import Login from './components/auth/Login';

import {BrowserRouter, Route, Switch} from 'react-router-dom';

import './App.css'

const  App = () => {
  return (
    <BrowserRouter>
    <>
      <NavBar />
      <Route exact path="/" component={Landing}/>
      <section className="container">
        <Switch>
          <Route exact path='/register' component={Register} />
          <Route exact path='/login' component={Login} />

        </Switch>
      </section>
    </>
    </BrowserRouter>
  );
}

export default App;
