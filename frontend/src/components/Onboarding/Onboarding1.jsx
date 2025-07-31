import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAppContext } from '../../context/appContext';
import { motion } from 'framer-motion';

const Onboarding1 = () => {

    const { setPage } = useAppContext(); 

  return (
    <motion.div className='flex flex-col space-y-[40px] sm:space-y-[60px] lg:space-y-[97px] justify-center items-center text-center p-4 sm:p-6 lg:p-8'>
      <div className='w-full max-w-[575px] rounded-2xl shadow-md space-y-[20px] sm:space-y-[25px] lg:space-y-[32px] pt-[20px] sm:pt-[25px] lg:pt-[29px] pl-[15px] sm:pl-[18px] lg:pl-[18px] pr-[15px] sm:pr-[18px] lg:pr-[18px] flex flex-col bg-white min-h-[200px] sm:h-[220px] lg:h-[250px]'>
        <h1 style={{fontFamily : "Poppins"}} className='text-[#34856C] leading-tight sm:leading-8 lg:leading-10 text-[28px] sm:text-[36px] lg:text-[48px] font-semibold'>Great to have you with us! </h1>
        <p style={{fontFamily : "Inter"}} className='text-[14px] sm:text-[16px] lg:text-[18px] text-[#5F6C7B]'>Let us explore a few key questions to establish baseline understanding.</p>
      </div>
      <NavLink 
        style={{fontFamily : "Poppins"}} 
        className="bg-[#FF6B5B] hover:bg-[#e55a4a] text-white text-[16px] sm:text-[17px] lg:text-[18px] w-full max-w-[199px] pt-[10px] pb-[10px] pl-[20px] sm:pl-[30px] lg:pl-[53px] pr-[20px] sm:pr-[30px] lg:pr-[53px] rounded-lg transition-colors" 
        onClick={() => setPage((prev) => prev + 1)} 
        to={'/onboarding/step2'}
      >
        Let's Begin
      </NavLink>
    </motion.div>
  )
}

export default Onboarding1
