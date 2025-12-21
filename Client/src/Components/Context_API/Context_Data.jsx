
import { createContext } from "react";


export const ContextData =  createContext()

const Context_provider = (props) => {
     
    
    
    
    const BackendUr = import.meta.env.VITE_BACKEND_URL;
    
    
    // function to check for strong password..
    const isStrongPassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        return passwordRegex.test(password);
    }


    const Value = {
        BackendUr,
        isStrongPassword
    }
    
    return (
        <ContextData.Provider value={Value}>
            {props.children}
        </ContextData.Provider>
    )
}

export default Context_provider