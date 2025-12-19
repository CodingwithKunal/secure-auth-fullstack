
import { useState } from "react"
import Auth_left from "./Auth_left"
import Welcom_right from "./Welcom_right"
import { ToastContainer } from "react-toastify"




const Auth_page = () => {
   const [loading, setloading] = useState(false)
  
  return (
    <section className='bg-[url("/bg_2.jpeg")] bg-center bg-cover bg-no-repeat h-screen  py-5 md:py-10 lg:py-10 px-5 md:px-20 lg:px-20 bg-fixed'>
     
     {loading && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
           <img src="public/833 4.gif" alt="Loading..."/>
        </div>
      )}
      
      <ToastContainer toastClassName="toast-container" position="top-center" />
       
      <div className="flex mt-2 md:mt-10">

        <Auth_left setloading={setloading}/>
         <Welcom_right/>
        
      </div>
    </section>
  )
}

export default Auth_page
