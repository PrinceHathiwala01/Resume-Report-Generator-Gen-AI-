import { useState } from 'react'
import "../auth.form.scss"
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const Register = () => {

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { loading, handelRegister } = useAuth();

  //This is used to navigate to another page
  const navigate = useNavigate();

  //This is used to remove to the inicial reload of the page on button
  const handelSubmit = async (e) => {
      e.preventDefault();
      const user = await handelRegister({ username, email, password });

      if (user) {
        navigate("/");
      }
    }
    
    if (loading) {
        return (
            <main>
                <div className='auth-loader'>
                    <div className='auth-loader__ring'></div>
                    <h1>Registering you</h1>
                    <p>Please wait while we check your details</p>
                    <div className='auth-loader__dots' aria-hidden="true">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </main>
        )
    }

  return (
    <main>
          <div className='form-container'>
              <h1>Register yourself here</h1>

              <form onSubmit={handelSubmit}>
                  <div className='input-group'>
                      <label htmlFor="username">Username</label>
                      <input
                        onChange={(e)=>{setUsername(e.target.value)}}  
                        type="text" name="username" id="username" placeholder='Enter your username' required />
                  </div>
          
                  <div className='input-group'>
                      <label htmlFor="email">Email</label>
                      <input
                        onChange={(e)=>{setEmail(e.target.value)}}  
                        type="text" name="email" id="email" placeholder='Enter your email' required />
                  </div>

                  <div className='input-group'>
                      <label htmlFor="password">Password</label>
                      <input
                        onChange={(e)=>{setPassword(e.target.value)}}
                        type="password" name="password" id="password" placeholder='Enter your password' required />
                  </div>
                  <button className='button primary-button'>Register</button>
              </form>
        <p>Already have an account? <Link to={"/login"}>Login</Link></p>
          </div>
    </main>
  )
}

export default Register
