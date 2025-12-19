
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Context_provider from './Components/Context_API/Context_Data.jsx'
import { BrowserRouter } from 'react-router-dom'


 

createRoot(document.getElementById('root')).render(
    
    <BrowserRouter>
    <Context_provider>
    <App />
    </Context_provider>
    </BrowserRouter>
     
    
)
