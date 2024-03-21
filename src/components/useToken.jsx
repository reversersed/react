import { useState } from "react"

export default function useToken() {
    const [logged, setLogged] = useState(false)
    
    if(sessionStorage.getItem("TOKEN_AUTH_KEY") && !logged)
        setLogged(true);
    const createSession = (token, local) => {
        sessionStorage.setItem("TOKEN_AUTH_KEY",token)
        if(local && !localStorage.getItem("TOKEN_AUTH_KEY"))
        {
            localStorage.setItem("TOKEN_AUTH_KEY", token)
            //create token in api
        }

        setLogged(true);
    }
    const removeSession = () => {
        sessionStorage.removeItem("TOKEN_AUTH_KEY")
        if(localStorage.getItem("TOKEN_AUTH_KEY"))
        {
            //remove session from api
            localStorage.removeItem("TOKEN_AUTH_KEY")
        }
        setLogged(false);
    }

    if(localStorage.getItem("TOKEN_AUTH_KEY") && !logged)
    {
        //check token via api
        setLogged(true);
    }
    return {
        isLogged: logged,
        saveToken: createSession,
        removeToken: removeSession
    }
}