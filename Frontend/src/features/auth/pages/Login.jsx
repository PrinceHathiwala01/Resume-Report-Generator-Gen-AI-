import { useState } from 'react'
import "../auth.form.scss"
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const Login = () => {

    const { loading, handelLogin } = useAuth();

    const navigate = useNavigate();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handelSubmit = async (e) => {
        e.preventDefault();
        const user = await handelLogin({ email, password });

        if (user) {
            navigate("/");
        }
    }

    if (loading) {
        return (
            <main>
                <div className='auth-loader'>
                    <div className='auth-loader__ring'></div>
                    <h1>Signing you in</h1>
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
              <h1>Login</h1>

              <form onSubmit={handelSubmit}>
                  <div className='input-group'>
                      <label htmlFor="email">Email</label>
                      <input
                        onChange={(e) => setEmail(e.target.value)}
                        type="email" name="email" id="email" placeholder='Enter your email' required />
                  </div>

                  <div className='input-group'>
                      <label htmlFor="password">Password</label>
                      <input
                        onChange={(e) => setPassword(e.target.value)}  
                        type="password" name="password" id="password" placeholder='Enter your password' required />
                  </div>
                  <button className='button primary-button' disabled={loading}>Login</button>
              </form>
              <p>Does not have an account? <Link to={"/register"}>Register</Link></p>
          </div>
    </main>
  )
}

export default Login
