import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import './Style/Style.css';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { UserContext } from '../App.jsx';

const Login = () => {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const history = useHistory();

  const context = useContext(UserContext);
  // console.log('user', context.user);

  const handleSubmit = (e) => {
    e.preventDefault();
    // history.push('/asdfasdf');

    let responseStatus = 0;

    fetch('/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then((resp) => {
        console.log('resp===>', resp);
        console.log(resp.status === 200 ? 'logged in' : 'NOT logged in');
        if (resp.status === 200) responseStatus = 200;
        return resp.json();
      })
      .then((data) => {
        if (responseStatus === 200) {
          console.log('data', data);
          context.saveUser(data.id);
          history.push('/dashboard');
        }
      })
      .catch((err) => console.log('login err==>', err));
  };

  return (
    <div className='outer-wrapper'>
      <div className='recent-posts'>
        {/* <h2>Recent Interviews</h2> */}
        <p align='left'>
          Get interview insights while you manage <br />
          every step in your job search, from application to offer.{' '}
        </p>
      </div>
      <div className='login-wrapper'>
        <h1>Log in:</h1>
        <form onSubmit={handleSubmit} method='POST'>
          <label>
            <p>Email</p>
            <input
              value={username}
              type='email'
              // placeholder="Email"
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </label>
          <label>
            <p>Password</p>
            <input
              password={password}
              type='password'
              // placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <div className='loginButtonWrapper'>
            <button className='loginButton' type='submit'>
              Log in
            </button>
            {/* </div> */}
            <p>or</p>
            {/* <div> */}
            <Link to='/signup'>
              <button className='signupButton' src='/Signup'>
                Sign up
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
