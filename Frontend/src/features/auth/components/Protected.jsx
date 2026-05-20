import { useAuth } from "../hooks/useAuth";
import "../auth.form.scss"
import { Navigate } from "react-router";

const Protected = ({children}) => {
    const { user, loading } = useAuth();
    
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

    if (!user) {
        return <Navigate to="/login" />
    }

  return children
}

export default Protected
