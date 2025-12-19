import { Route,Routes } from "react-router"
import Auth_page from "./Components/User_Auth/Auth_page"
import Home_page from "./Components/User_home/Home_page"
import Email_page from "./Components/ResetPassword_Pages/Email_page"


const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Auth_page/>} />
        <Route path="/home" element={<Home_page/>}/>
        <Route path="/forgot_password" element = {<Email_page/>}/>
      </Routes>

     
    </>
  )
}

export default App
