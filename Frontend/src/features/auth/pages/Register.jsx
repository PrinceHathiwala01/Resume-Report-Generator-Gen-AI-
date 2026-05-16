import React from 'react'
import { useNavigate,Link } from 'react-router'

const Register = () => {

  //This is used to navigate to another page
  const navigate = useNavigate();

  //This is used to remove to the inicial reload of the page on button
  const handelSubmit = (e) => {
      e.preventDefault();
  }

  return (
    <main>
          <div className='form-container'>
              <h1>Register yourself here</h1>

              <form onSubmit={handelSubmit}>
                  <div className='input-group'>
                      <label htmlFor="username">Username</label>
                      <input type="text" name="username" id="username" placeholder='Enter your username' required/>
                  </div>
          
                  <div className='input-group'>
                      <label htmlFor="email">Email</label>
                      <input type="text" name="email" id="email" placeholder='Enter your email' required/>
                  </div>

                  <div className='input-group'>
                      <label htmlFor="password">Password</label>
                      <input type="password" name="password" id="password" placeholder='Enter your password' required/>
                  </div>
                  <button className='button primary-button'>Register</button>
              </form>
        <p>Already have an account? <Link to={"/login"}>Login</Link></p>
          </div>
    </main>
  )
}

export default Register
