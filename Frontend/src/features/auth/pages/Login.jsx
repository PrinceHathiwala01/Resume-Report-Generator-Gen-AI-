import React from 'react'
import "../auth.form.scss"

const Login = () => {
  return (
    <main>
          <div className='form-container'>
              <h1>Login</h1>

              <form>
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
          </div>
    </main>
  )
}

export default Login
