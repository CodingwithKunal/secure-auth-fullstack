import { useContext, useEffect, useRef, useState } from "react";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { LuEyeClosed } from "react-icons/lu";
import { ContextData } from "../Context_API/Context_Data";
import axios from "axios";
import { toast } from 'react-toastify';
import { IoIosArrowRoundForward } from "react-icons/io";
import { Link, useNavigate } from "react-router";




const Auth_left = ({setloading}) => {

  const [showPass, setshowPass] = useState(false)
  const [step, setstep] = useState("Sign In")

  const [name, setName] = useState("")
  const [otp, setOTP] = useState(Array(6).fill(""))
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

 


  const nevigate = useNavigate()

  const inputRef = useRef([]);
  const { BackendUr, isStrongPassword } = useContext(ContextData);
  // console.log(BackendUr)




  const handleInput = (e, index) => {
    const value = e.target.value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOTP(newOtp);

    // Move forward automatically
    if (value && index < 5) {
      inputRef.current[index + 1].focus();
    } else {
      inputRef.current[index - 1].focus();
    }
  };


  // Handle Paste event
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6).split("");
    const newOtp = [...otp];

    pasteData.forEach((value, index) => {
      if (inputRef.current[index]) {
        inputRef.current[index].value = value;
        newOtp[index] = value;
      }
    });

    setOTP(newOtp);

    // Move focus to last filled box
    const nextIndex = pasteData.length - 1;
    if (inputRef.current[nextIndex]) inputRef.current[nextIndex].focus();
  };



  const formSubmit = async (e) => {
    try {
      e.preventDefault()
      axios.defaults.withCredentials = true

      if (step === "Sign Up") {

        setloading(true)

        // check for strong password
        if (!isStrongPassword(password)) {
          toast.error("Password must be at least 6 characters long and include uppercase, lowercase, number, and special character.");
          return;
        }

        const { data } = await axios.post(BackendUr + '/api/auth/register', { name, email, password })

        if (data.success) {
          setName("")
          setEmail("")
          setPassword("")
          localStorage.setItem("userID", data.userID)
          localStorage.setItem("otpPending", "true")
          setstep("otp")
          toast.success("Enter given OTP to Verify the user")

        }

      } else if (step === "otp") {


        const userID = localStorage.getItem("userID")
        // we want this otp into string
        const stringotp = otp.join("")


        const { data } = await axios.post(BackendUr + '/api/auth/verification', { otp: stringotp, userID:userID })

        if (data.success) {
          setOTP("")
          localStorage.removeItem("userID")
          localStorage.removeItem("otpPending")
          toast.success("Account verified! Please log in.")
          setstep("Sign In")
        }

      } else if (step === "Sign In") {

        setloading(true)
        const { data } = await axios.post(BackendUr + '/api/auth/login', { email, password })

        if (data.success) {
          setEmail("")
          setPassword("")
          setstep(nevigate("/home"))
          toast.success("You Loged In Successfully.")
        }

      }


    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setloading(false)
    }


  }

  // this function help to mentain OTP page after the refres.
  useEffect(() => {
    const otpPending = localStorage.getItem("otpPending")
    const userID = localStorage.getItem("userID")
    if (otpPending === "true" && userID) {
      setstep("otp")
    } else {
      setstep("Sign In")
    }
    localStorage.removeItem("otpPending")
    localStorage.removeItem("userID")
  }, [])



  // resendOTP function
  const resendOTP = async () => {

    try {
      const userID = localStorage.getItem("userID");
      const { data } = await axios.post(BackendUr + '/api/auth/resendOTP', { userID, type: "verify" })

      if (data.success) {

        toast.success("OTP resent successfully! Check your email.")
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }

  }



  return (

      

    <section className="Left-section-tab   w-full md:w-1/2 lg:w-1/2 mt-10  md:mt-0 lg:mt-0 h-[90vh] lg:h-[80vh] md:h-[60vh] bg-black/10 shadow-8xl text-white backdrop-blur-sm   rounded-3xl lg:rounded-tr-none lg:rounded-br-none  ">


      <div className="p-10 md:pt-20 flex justify-center flex-col items-center gap-8">
        <h1 className="text-3xl font-bold  uppercase">{step}</h1>
        <h2>
          {step === "Sign Up"
            ? "Enter Your Details"
            : step === "Sign In"
              ? "Enter Your Registered Account Details"
              : "Verify Your Email Address"}
        </h2>

        <form className="w-70 md:w-80 lg:w-80 mt-5 " onSubmit={formSubmit}>
          {/* --- SIGN UP FIELDS --- */}
          {step === "Sign Up" && (
            <>
              <div className="relative mb-8">
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="peer w-full border-b-2 border-gray-300 bg-transparent py-2.5 px-2 text-white placeholder-transparent focus:border-white focus:outline-none"
                  placeholder="Your Name"
                  autoComplete="off"
                  required
                />
                <label className="absolute left-0 -top-3.5 text-sm text-gray-300 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-100 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-white">
                  Your Name
                </label>
              </div>

              <div className="relative mb-8">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="peer w-full border-b-2 border-gray-300 bg-transparent py-2.5 px-2 text-white placeholder-transparent focus:border-white focus:outline-none"
                  placeholder="Your Email"
                  autoComplete="off"
                  required
                />
                <label className="absolute left-0 -top-3.5 text-sm text-gray-300 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-100  peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-white">
                  Your Email
                </label>
              </div>

              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="peer w-full border-b-2 border-gray-300 bg-transparent py-2.5 px-2 text-white placeholder-transparent focus:border-white focus:outline-none"
                  placeholder="Create Password"
                  autoComplete="off"
                  
                  required
                />
                <label className="absolute left-0 -top-3.5 text-sm text-gray-300 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-100 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-white">
                  Create Password
                </label>

                <span
                  onClick={() => setshowPass(!showPass)}
                  className="absolute right-0 bottom-3 mx-3 text-xl cursor-pointer text-gray-300 active:text-white"
                >
                  {showPass ? <LuEyeClosed /> : <MdOutlineRemoveRedEye />}
                </span>
              </div>
            </>
          )}

          {/* --- OTP PAGE --- */}
          {step === "otp" && (
            <div className="mt-10 "  >
              <h1 className="mb-5 text-center">Enter the OTP sent to your registered email.</h1>
              <div className="flex justify-center mb-8" onPaste={handlePaste}>
                {Array(6)
                  .fill("")
                  .map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      name="otp"
                      maxLength="1"
                      ref={(el) => (inputRef.current[index] = el)}
                      value={otp[index]}
                      onChange={(e) => handleInput(e, index)}

                      className="size-8 bg-blue-950 text-center mx-1 rounded-md border-2 border-white focus:outline-none"
                    />
                  ))}

              </div>
              <div className="flex items-center cursor-pointer" onClick={resendOTP}>
                <h2 className="text-gray-200 text-md tracking-normal ">Resend verification code  </h2>
                <h3 className="text-xl mt-1 font-bold"><IoIosArrowRoundForward /></h3>
              </div>
            </div>
          )}

          {/* --- SIGN IN PAGE --- */}
          {step === "Sign In" && (
            <>
              <div className="relative mb-8">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="peer w-full border-b-2 border-gray-300 bg-transparent py-2.5 px-2 text-white placeholder-transparent focus:border-white focus:outline-none"
                  placeholder="Your Email"
                  autoComplete="off"
                  required
                />
                <label className="absolute left-0 -top-3.5 text-sm text-gray-300 transition-all peer-placeholder-shown:top-2  peer-placeholder-shown:text-gray-100 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-white">
                  Your Email
                </label>
              </div>

              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="peer w-full border-b-2 border-gray-300 bg-transparent py-2.5 px-2 text-white placeholder-transparent focus:border-white focus:outline-none"
                  placeholder="Password"
                  autoComplete="off"
                  required
                />
                <label className="absolute left-0 -top-3.5 text-sm text-gray-300 transition-all peer-placeholder-shown:top-2  peer-placeholder-shown:text-gray-100 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-white">
                  Enter Password
                </label>

                <span
                  onClick={() => setshowPass(!showPass)}
                  className="absolute right-0 bottom-3 mx-3 text-xl cursor-pointer text-gray-300 active:text-white"
                >
                  {showPass ? <LuEyeClosed /> : <MdOutlineRemoveRedEye />}
                </span>
              </div>

              <div>
                <Link to="/forgot_password" ><h2 className="mt-4 text-gray-300 cursor-pointer hover:text-white text-sm font-semibold" >Forgot Password</h2></Link>
              </div>
            </>
          )}



          {/* --- Submit Button --- */}
          <button
            type="submit"
            className="bg-indigo-800 w-full mt-10 rounded-xl font-semibold cursor-pointer hover:bg-blue-700 active:translate-y-1 py-3" >
            {step === "Sign Up"
              ? "Sign Up"
              : step === "otp"
                ? "Verify OTP"
                : "Sign In"}

          </button>

          {/* --- Switch Links --- */}
          {step === "Sign Up" && (
            <div className="flex justify-evenly mt-2">
              <h1>Already a Member?</h1>
              <h2
                className="cursor-pointer font-medium active:text-blue-700"
                onClick={() => setstep("Sign In")}
              >
                Sign In
              </h2>
            </div>
          )}

          {step === "Sign In" && (
            <div className="flex justify-evenly mt-2">
              <h1>Don’t have an Account?</h1>
              <h2
                className="cursor-pointer font-medium active:text-blue-700"
                onClick={() => setstep("Sign Up")}
              >
                Sign Up
              </h2>
            </div>
          )}
        </form>
      </div>
    </section>
  )
}

export default Auth_left
