import { useContext, useEffect, useRef, useState } from "react";
import { MdEmail } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import axios from "axios";
import { ContextData } from "../Context_API/Context_Data";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router";


function Email_page() {

  const inputRef = useRef([])

  const { BackendUr , isStrongPassword } = useContext(ContextData);

  const nevigate = useNavigate();


  const [Step, setStep] = useState("Forgot Password")
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("")
  const [email, setemail] = useState("");

  const [loading, setloading] = useState(false);



  const handleInput = (e, index) => {
    if (e.target.value.length === 1 && index < 5) {
      inputRef.current[index + 1].focus();
    }else {
      inputRef.current[index-1].focus();
    }
  }



  const otpPaste = (e) => {
    const pasteData = e.clipboardData.getData('text');
    const pastValue = pasteData.split('').slice(0, 6);

    pastValue.forEach((value, index) => {
      if (inputRef.current[index]) {
        inputRef.current[index].value = value
      }
    })
  }



  const handleForgotpassword = async (e) => {
    e.preventDefault();

    try {


      if (Step === "Forgot Password") {
        
        setloading(true)

        const { data } = await axios.post(BackendUr + "/api/auth/forgotPass", { email });

        if (data.success) {

          localStorage.setItem("userId",data.userId);
          localStorage.setItem("otpPending", true);
          

          setStep("Email Verification");
          toast.success(data.message);

        } 

      }


      else if (Step === "Email Verification") {
        setloading(true)
        const otp = inputRef.current.map(input => input?.value || "").join('');
        const userId = localStorage.getItem("userId");

        const { data } = await axios.post(BackendUr + "/api/auth/getOtp", {otp,userId:userId });
        if (data.success) {

          localStorage.removeItem("otpPending");
          localStorage.setItem("Reset Password", true);
          setStep("Reset Password");
          toast.success(data.message);
        } 
      }


      else if (Step === "Reset Password") {

        setloading(true)
        if(!isStrongPassword(password)){
          toast.error("Password must be at least 6 characters long and include uppercase, lowercase, number, and special character.");
          setloading(false);
          return;
        }

        const userId = localStorage.getItem("userId");

        const { data } = await axios.post(BackendUr + "/api/auth/resetPassword", { userId, password, confirmPassword });

        if (data.success) {
          localStorage.removeItem("Reset Password");
          localStorage.removeItem("userId");
          setStep(nevigate("/"));
          toast.success(data.message);
        } 
      }



    } catch (error) {
      toast.error(error.response?.data?.message );
    }finally {
      setloading(false);
    }
  };



      //  This useEffect  for handling page refresh by the help of localStorage
  useEffect(() => {
    const otpPending = localStorage.getItem("otpPending");
    const resetPassword = localStorage.getItem("Reset Password");
    const userId = localStorage.getItem("userId");
    
    if (otpPending === "true" && userId) {
      setStep("Email Verification");
    }

    if (resetPassword === "true") {
      setStep("Reset Password");
    }

     localStorage.removeItem("otpPending");
      localStorage.removeItem("Reset Password");
      localStorage.removeItem("userId");

  }, [])




  const handleresendOtp = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if(!userId){
        toast.error("User not found, Please try again!");
        return;
      }
      const {data} = await axios.post(BackendUr + "/api/auth/resendOTP", { userID: userId, type: "reset"});
      if(data.success){
        localStorage.removeItem("otpPending");
        localStorage.removeItem("userId");
        toast.success(data.message);
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong!"); 
    }
  }



  return (

    <div className=' h-screen bg-[url("bg_theme_light.jpeg")] bg-no-repeat  bg-center bg-cover  flex justify-center items-center px-5'>
         

      {/* Back button if user jumb directly on Reset password without filling password or any server issue  */}
      <div className=" absolute lg:top-10 top-0 left-0  lg:left-10">
        {Step === "Reset Password" && (
          <button className="bg-black text-white py-2 px-10 rounded-full font-semibold mt-5 ml-5 " onClick={() => setStep("Forgot Password")} >Back</button>
        )
        }
      </div>


      <ToastContainer  toastClassName="toast-container" position="top-center" /> 

      <section className= 'tab-sect mobile-sect bg-white/10 backdrop-blur-xl  lg:w-[40vw] h-[50vh] px-10 py-15  lg:h-[55vh] lg:py-10 lg:px-10 rounded-3xl shadow-2xl'>

      {loading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 rounded-3xl">
           <img src="public/833 4.gif" alt="Loading..."/>
        </div>
      )}

        <h1 className='text-center mb-10 text-2xl text-blue-900 font-extrabold uppercase'>{Step === "Forgot Password" ? "Forgot Password" : Step === "Email Verification" ? "Email Verification" : "Reset password"}</h1>
        <h2 className='text-center text-lg font-semibold text-gray-700'>{Step === "Forgot Password" ? "Mail Address Here" : Step === "Email Verification" ? "Get Your Code" : "Enter New Password"}</h2>
        <p className='text-center text-sm text-gray-500'>{Step === "Forgot Password" ? "Enter the email address associated with your account." : Step === "Email Verification" ? "Please Enter the 6 digit code that sent to your Email address." : "Please make your Password in minimum 6."}</p>

        <form className='mt-7 text-center relative ' onSubmit={handleForgotpassword} >


          {Step === "Forgot Password" &&

            (<div className=' flex justify-center items-center '>
              <MdEmail className="Mobile-icon tab-icon lg:mr-4 right-64 text-2xl text-black absolute lg:left-35" />
              <input type="email" className='border border-blue-800 focus:text-gray-800 lg:pt-3 px-12 py-2.5 lg:pb-2 lg:pl-15 lg:pr-10 rounded-full font-semibold outline-none relative'

                onChange={(e) => setemail(e.target.value)}
                name="email"
                value={email}
                autoComplete="off"
                required />

              <label className='Mobile-label tab-label shadow-2xl text-gray-600 absolute -top-3 lg:left-40  right-48 lg:right-70 bg-white   px-2 lg:px-0 rounded-full text-sm'>Email</label>
            </div>)
          }



          {Step === "Email Verification" &&
            ( 
              <>
              <div className="flex justify-center items-center gap-4 lg:gap-3" onPaste={otpPaste}>
                {Array(6).fill("").map((_, index) =>
                  <div key={index}>
                    <input type="text" className=" border-b-3 outline-none border-blue-800 p-2 lg:p-2 shadow-2xl gap-3 w-[10vw] lg:w-[3vw] text-center rounded-t-lg focus:border-2 focus:rounded-lg  "
                      maxLength={1}
                      ref={(e) => inputRef.current[index] = e}
                      onInput={(e) => handleInput(e, index)}
                      required
                    />
                  </div>
                )}
              </div>
              <div>
                <p className="text-gray-600 text-sm mt-5">Didn't receive the code? <span className="text-blue-800 font-semibold cursor-pointer" onClick={()=>handleresendOtp()}>Resend</span></p>
              </div>
              </>
              
            )
          }



          {Step === "Reset Password" &&
            (
              <>

                <div className=' flex justify-center items-center '>
                  <CiLock className="Mobile-icon icon-ipad-reset-pass lg:mr-4 text-2xl text-black absolute right-63 lg:left-35" />
                  <input type="password" className='border border-blue-800 focus:text-gray-600 pt-3 pb-2 pl-15 pr-10 rounded-full font-semibold outline-none relative'
                    required minLength={5}
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    autoComplete="off"
                  />
                  <label className='Mobile-label-reset  label-ipad-reset-pass shadow-2xl text-gray-600 absolute -top-3 lg:left-40 right-43 lg:right-70 bg-white  px-2 lg:px-0 rounded-full text-sm'>Password</label>
                </div>


                <div className=' flex justify-center items-center mt-5'>
                  <CiLock className="Mobile-icon icon-ipad-reset-pass lg:mr-4 text-2xl text-black absolute right-63 lg:left-35" />
                  <input type="password" className=' border border-blue-800 focus:text-gray-600 pt-3 pb-2 pl-15 pr-10 rounded-full font-semibold outline-none relative'
                    required minLength={5}
                    onChange={(e) => setconfirmPassword(e.target.value)}
                    value={confirmPassword}
                    autoComplete="off"
                  />
                  <label className='Mobile-label-second-reset label-ipad-reset-pass-second  shadow-2xl text-gray-600 absolute top-13.5 lg:top-13.5 lg:left-40 right-30 lg:right-60 bg-white  px-2 lg:px-0 rounded-full text-sm '>Confirm Password</label>
                </div>

              </>
            )
          }



          <button type="submit" className="bg-indigo-700 text-white font-bold  mt-10 w-1/2 py-2 px-10 rounded-full active:scale-95 cursor-pointer transition-all">Submit</button>

        </form>

      </section>


    </div>

  )



}

export default Email_page
