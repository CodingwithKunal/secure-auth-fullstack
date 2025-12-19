import { useNavigate } from "react-router-dom"
import { RiMenu3Fill } from "react-icons/ri";
import { HiMiniXMark } from "react-icons/hi2";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { ContextData } from "../Context_API/Context_Data";
import { toast } from 'react-toastify';
import { RxAvatar } from "react-icons/rx";


const Home_page = () => {

  const nevigate = useNavigate();
  const { BackendUr } = useContext(ContextData);

  const [menue, setmenue] = useState(false)
  const [profile, setprofile] = useState(null)

  // state to track if image failed to load
  const [imgError, setImgError] = useState(false);


  const logout = async () => {
    try {
      const { data } = await axios.post(BackendUr + "/api/auth/logout", {});
      if (data.success) {
        nevigate("/")
        

      }
    } catch (error) {
      toast.error(error.response?.data?.message|| error.message);
    }
  }

  const openMenue = () => {
    setmenue(!menue)
  }

  useEffect(() => {
    const fetchProfile = async () => {

      try {
        const res = await axios.get(BackendUr + "/api/user/profile", { withCredentials: true });
        // console.log("profile response:", res); 

        if (res.data?.success !== false && res.data?.user) {
          setprofile(res.data.user);
        } 

      } catch (err) {

        toast.error(err.response?.data?.message || err.message);
      }
    };

    fetchProfile();
  }, [BackendUr]);




  return (

    <div className="min-h-screen w-full bg-[#020617] relative">

      {/*Dark Background*/}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "#020617",
          backgroundImage: `
        linear-gradient(to right, rgba(71,85,105,0.3) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(71,85,105,0.3) 1px, transparent 1px),
        radial-gradient(circle at 50% 50%, rgba(139,92,246,0.15) 0%, transparent 70%)
      `,
          backgroundSize: "32px 32px, 32px 32px, 100% 100%",
        }}
      />

      {/* Overlay (darken main when sidebar open) */}
      <div
        className={`fixed inset-0 bg-black/40 transition-opacity duration-300 ${menue ? "opacity-100 z-20" : "opacity-0 pointer-events-none"}`}
        onClick={openMenue}
      />

      {/* Side Bar */}
      <div className={`fixed top-0 right-0 h-full w-[65vw] md:w-[40vw] lg:w-[25vw] bg-black/80 backdrop-blur text-white p-10
        transform transition-transform duration-500 ease-in-out ${menue ? "translate-x-0" : "translate-x-full"} z-30`}>

        <div className="mt-10">
          <h1 className="w-12 h-12 mb-5 rounded-full flex justify-center items-center bg-white text-black overflow-hidden">
            {profile?.profilepic && !imgError ? (
              <img
                src={profile.profilepic}
                alt="avatar"
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <RxAvatar size={40} className="text-black" />
            )}
          </h1>
          <hr/>
          <ul className="mt-10 gap-4 flex flex-col text-lg font-semibold ">
            <li>{profile?.name || "N/A"}</li>
            <hr className="w-50" />
            <li>{profile?.isvarified ? "Verified" : "Not Verified"}</li>
            <hr className="w-30" />
          </ul>
        </div>
      </div>

      <nav className="relative z-10 flex justify-between items-center py-2 px-5 md:px-20 lg:px-20 md:py-5 lg:py-5 text-white">
        <h1 className="text-3xl font-bold">
          <video src="/3d-glare-data-protection-or-internet-security-with-shield.mp4"
            autoPlay
            loop
            muted
            className="w-20 md:w-30 lg:w-30 bg-white/5 rounded-full"
          />
        </h1>

        <div className="flex justify-center items-center gap-5 lg:gap-20 md:gap-20">
          {menue ? null : (
            <h2
              className="bg-black text-white font-bold text-sm py-2 px-4.5 md:py-2.5 lg:py-2.5 md:px-5 lg:px-5 rounded-full active:bg-white active:text-blue-500 border-white border cursor-pointer"
              onClick={logout}
            >
              Logout
            </h2>
          )}

          <h1 onClick={openMenue} className="cursor-pointer">
            {menue ? null : (<RiMenu3Fill size={35} />)}
          </h1>
        </div>
      </nav>

      {/*  GIF Main  */}
      <main className="relative flex items-center justify-center w-full z-10"
        style={{ minHeight: "calc(80vh - 90px)" }}>
        <img
          src="/memphis-biometric-authentication-and-account-login.gif"
          alt="Animated display"
          className="max-w-[550px] w-full h-auto"
          draggable="false"
        />
      </main>
    </div>

  )
}

export default Home_page
