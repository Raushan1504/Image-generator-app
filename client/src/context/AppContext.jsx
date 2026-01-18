import { useState, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify";
import axios from "axios";


export const AppContext = createContext();

const AppContextProvider = (props) => {

    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [creditBalance, setCreditBalance] = useState('false');

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    console.log("TOKEN VALUE:", token);

    const navigate = useNavigate()
    const loadCreditData = async () => {
        try {
            const  {data}  = await axios.get(
               backendUrl + "/api/user/credits",
                {
                    headers: {token}
                }
            );
            console.log("SENT TOKEN:", localStorage.getItem('token'));
            console.log("data:", data)
            if (data.success) {
                setCreditBalance(data.creditBalance);
                setUser(data.user);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };
    const generateImage = async (prompt) => {
        try {
            const { data } =  await axios.post(
                backendUrl + "/api/image/generate-image",
                { prompt },
                {
                    headers: {token}
                }
            );

            if (data.success) {
                loadCreditData()
                toast.success("Image Generated Successfully");
                return data.resultImage;
            } else {
                toast.error(data.message);
                loadCreditData()
                if(creditBalance === 0){
                    navigate('/buy')
                }
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken("");
        setUser(null);
        setCreditBalance(0);
    };

    useEffect(() => {
        if (token) {
            loadCreditData();
        }
    }, [token]);

    const value = {
        user,
        setUser,
        showLogin,
        setShowLogin,
        backendUrl,
        token,
        setToken,
        creditBalance,
        setCreditBalance,
        loadCreditData,
        generateImage,
        logout,
        
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
