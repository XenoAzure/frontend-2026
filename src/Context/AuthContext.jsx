import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import ENVIRONMENT from "../config/environment";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext(
    {
        isLogged: false,
        user: null,
        manageLogin: (auth_token) => { },
        logout: () => { }
    }
)

export const LOCALSTORAGE_TOKEN_KEY = 'auth_token_slack'

function AuthContextProvider({ children }) {
    const navigate = useNavigate()
    const [isLogged, setIsLogged] = useState(
        Boolean(
            localStorage.getItem(LOCALSTORAGE_TOKEN_KEY)
        )
    )
    const [user, setUser] = useState(null)
    const [isLoadingUser, setIsLoadingUser] = useState(true)
    const [postLoginLoading, setPostLoginLoading] = useState(false);

    const fetchUserProfile = async (token) => {
        try {
            const response = await fetch(`${ENVIRONMENT.API_URL}/api/user/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.ok) {
                setUser(data.data.user);
            } else {
                // If token is invalid, logout
                handleLogout();
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
            // Fallback: decode token to get basic info if backend is down
            try {
                const decoded = jwtDecode(token);
                setUser({
                    id: decoded.id,
                    name: decoded.name,
                    email: decoded.email
                });
            } catch (e) {
                handleLogout();
            }
        } finally {
            setIsLoadingUser(false);
        }
    }

    const handleLogout = () => {
        localStorage.removeItem(LOCALSTORAGE_TOKEN_KEY);
        setIsLogged(false);
        setUser(null);
        navigate('/login');
    }

    useEffect(() => {
        const token = localStorage.getItem(LOCALSTORAGE_TOKEN_KEY);
        if (token) {
            fetchUserProfile(token);
        } else {
            setIsLoadingUser(false);
        }
    }, [isLogged]);

    function manageLogin(auth_token) {
        localStorage.setItem(LOCALSTORAGE_TOKEN_KEY, auth_token)
        setIsLogged(true)
        setPostLoginLoading(true)
        navigate('/home')
    }

    const finishPostLoginLoading = () => {
        setPostLoginLoading(false);
    }

    const providerValues = {
        isLogged,
        user,
        isLoadingUser,
        manageLogin,
        logout: handleLogout,
        postLoginLoading,
        finishPostLoginLoading,
        refreshUser: () => {
            const token = localStorage.getItem(LOCALSTORAGE_TOKEN_KEY);
            if (token) fetchUserProfile(token);
        }
    }

    return (
        <AuthContext.Provider value={providerValues}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider