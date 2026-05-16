import React from 'react'
import "../auth.form.scss"
import { useNavigate,Link } from 'react-router'

const Login = () => {

    const handelSubmit = (e) => {
        e.preventDefault();
    }

  return (
    <main>
          <div className='form-container'>
              <h1>Login</h1>

              <form onSubmit={handelSubmit}>
                  <div className='input-group'>
                      <label htmlFor="email">Email/Username</label>
                      <input type="text" name="email" id="email" placeholder='Enter your email/username' />
                  </div>

                  <div className='input-group'>
                      <label htmlFor="password">Password</label>
                      <input type="password" name="password" id="password" placeholder='Enter your password' />
                  </div>
                  <button className='button primary-button'>Login</button>
              </form>
              <p>Does not have an account? <Link to={"/register"}>Register</Link></p>
          </div>
    </main>
  )
}

export default Login
