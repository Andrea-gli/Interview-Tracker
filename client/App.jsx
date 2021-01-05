import React, { useState } from 'react';
import './components/Style/Style.css';
import Dashboard from '../client/components/Dashboard';
import Signup from '../client/components/Signup';
import Login from '../client/components/Login';
import Step from '../client/components/Step';
import useToken from './useToken';
import { Route, Switch, Link, BrowserRouter } from 'react-router-dom';

export const UserContext = React.createContext();

const UserProvider = ({ children }) => {
  //console.log('children==>', children);
  const [currentUser, setCurrentUser] = useState({ id: null });

  const saveUser = (id) => {
    console.log('save user', id);
    setCurrentUser({ id });
  };

  return (
    <UserContext.Provider value={{ user: currentUser, saveUser }}>
      {children}
    </UserContext.Provider>
  );
};

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={Login} />
          <Route path='/dashboard' component={Dashboard} />
          <Route path='/signup' component={Signup} />

          <Route path='/application/:id/step' component={Step} />
        </Switch>
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;
