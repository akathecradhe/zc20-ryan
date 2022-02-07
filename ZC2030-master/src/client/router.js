import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import About from './components/About';
import AddInput from './components/auth/admin/AddInput';
import AdminLogin from './components/auth/admin/AdminLogin';
import BuyOffset from './components/BuyOffset';
import Calculator from './components/Calculator';
import CreateAdmin from './components/auth/admin/CreateAdmin';
import CreateTrainer from './components/auth/trainer/CreateTrainer';
import EditInput from './components/auth/admin/EditInput';
import Generate from './components/auth/trainer/Generate';
import Header from './components/common/Header';
import Home from './components/Home';
import Join from './components/auth/trainer/Join';
import LinkAccount from './components/auth/participant/LinkAccount';
import Login from './components/auth/participant/Login';
import Logs from './components/Logs';
import News from './components/News';
import NotFound from './components/NotFound';
import Privacy from './components/Privacy';
import Projects from './components/Projects';
import Registry from './components/Registry';
import ResourcePage from './components/ResourcePage';
import Resources from './components/Resources';
import Signup from './components/auth/participant/Signup';
import Terms from './components/Terms';
import TrainerLogin from './components/auth/trainer/TrainerLogin';

export const Router = ({ location }) => (
  <div>
    {location.pathname !== '/' && <Header />}
    <Switch>
      <Route exact path="/">
        <Header />
        <Home />
      </Route>
      <Route path="/about" exact component={About} />
      <Route path="/add-input" exact component={AddInput} />
      <Route path="/admin-login" exact component={AdminLogin} />
      <Route path="/buy-offset" exact component={BuyOffset} />
      <Route path="/calculator" exact component={Calculator} />
      <Route path="/create-admin" exact component={CreateAdmin} />
      <Route path="/create-trainer" exact component={CreateTrainer} />
      <Route path="/edit-input" exact component={EditInput} />
      <Route path="/example" exact component={ResourcePage} />
      <Route path="/generate" exact component={Generate} />
      <Route path="/join" exact component={Join} />
      <Route path="/link" exact component={LinkAccount} />
      <Route path="/login" exact component={Login} />
      <Route path="/logs" exact component={Logs} />
      <Route path="/news" exact component={News} />
      <Route path="/privacy" exact component={Privacy} />
      <Route path="/projects" exact component={Projects} />
      <Route path="/registry" exact component={Registry} />
      <Route path="/resources" exact component={Resources} />
      <Route path="/signup" exact component={Signup} />
      <Route path="/terms" exact component={Terms} />
      <Route path="/trainer-login" exact component={TrainerLogin} />
      <Route component={NotFound} />
    </Switch>
  </div>
);

Router.propTypes = {
  location: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Router;
