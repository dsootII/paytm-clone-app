import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AuthContext = createContext();

function AuthProvider ({children}) {

    const [token, setToken_] = useState(localStorage.getItem('token'));

    function setToken(newToken) {
        setToken_(newToken);
        console.log("setting token using auth context:\n", newToken);
    }

    useEffect(()=>{
        if (token) {
            axios.defaults.headers.common['Authorization'] = "Bearer " + token;
            localStorage.setItem('token', token);
        } else {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
        }
    }, [token]);

    const contextValue = useMemo(
        () => ({
            token, 
            setToken
        }), [token]
    );

    return (
        <AuthContext.Provider value={contextValue}>
          {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => useContext(AuthContext);

export default AuthProvider;