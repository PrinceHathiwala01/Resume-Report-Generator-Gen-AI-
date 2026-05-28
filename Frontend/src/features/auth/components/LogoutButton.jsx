import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

const LogoutButton = () => {
    const { handelLogout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await handelLogout();
        navigate("/login", { replace: true });
    }

    return (
        <button className="logout-button" type="button" onClick={handleLogout}>
            Logout
        </button>
    )
}

export default LogoutButton;
