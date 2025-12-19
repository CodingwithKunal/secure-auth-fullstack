import React from 'react'

const Welcom_right = () => {
  return (
    <section className='Right-tablet-sec  hidden  md:block lg:block  w-1/2 lg:h-[80vh] md:h-[60vh] bg-indigo-800  rounded-tr-3xl rounded-br-3xl shadow-8xl text-white py-20 px-20'>
       <div className=' flex flex-col items-center justify-center gap-5 '>
         <h1 className=' flex-nowrap  text-6xl md:text-4xl md:px-10 font-extrabold outline-3 outline-sky-600 rounded-2xl text-center py-2 px-4 '>Let's Get Started</h1>
         <img src="3d-casual-life-chatbot-using-laptop-1.gif" alt="image" className=' bg-cover w-[25vw]  md:h-[25vh] lg:h-[33vh] bg-center md:mt-10    lg:mt-15 rounded-full md:outline-5  outline-10 outline-sky-200 '/>
       </div>
    </section>
  )
}

export default Welcom_right
