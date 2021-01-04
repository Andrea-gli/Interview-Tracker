import React, { useState, useContext } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { UserContext } from '../App.jsx';

const Signup = () => {
  let history = useHistory();
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [dob, setDOB] = useState(new Date());
  const [cur_salary, setSalary] = useState(0);

  const context = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    let responseStatus = 0;
    // check if passwords match before submit
    if (password !== password2) {
      alert('password does not match');
    } else {
      fetch('/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name,
          last_name,
          email,
          password,
          cur_salary,
          dob,
        }),
      })
        .then((resp) => {
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
        .catch((err) => console.log('err', err));
    }
  };

  return (
    <div id='wrapper'>
      <div id='sign-up' className='login-wrapper'>
        <form onSubmit={handleSubmit} id='list'>
          <h1>Create an Account</h1>
          First Name
          <li>
            <input
              type='text'
              placeholder='Ex: John'
              id='firstname'
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className='inputSignUp'
            />
          </li>
          Last Name
          <li>
            <input
              type='text'
              placeholder='Ex: Doe'
              id='lastname'
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
              required
              className='inputSignUp'
            />
          </li>
          Email Address
          <li>
            <input
              type='email'
              placeholder='Ex: johndoe@gmail.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='inputSignUp'
            />
          </li>
          Password
          <li>
            <input
              type='password'
              // placeholder="Six Characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='inputSignUp'
            />
          </li>
          Re-enter password
          <li>
            <input
              type='password'
              // placeholder="Confirm Password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
              className='inputSignUp'
            />
          </li>
          Date of Birth
          <li>
            <input
              type='date'
              value={dob}
              onChange={(e) => setDOB(e.target.value)}
              className='inputSignUp'
            />
          </li>
          Salary ($ USD)
          <li>
            <input
              type='number'
              placeholder='Salary'
              value={cur_salary}
              onChange={(e) => setSalary(e.target.value)}
              className='inputSignUp'
            />
          </li>
          {/* <li> */}
          <input type='submit' value='Create Account' />
          {/* </li> */}
          {/* <li> */}
          <button onClick={() => history.goBack()}>Back</button>
          {/* </li> */}
        </form>
      </div>
    </div>
  );
};

export default Signup;
