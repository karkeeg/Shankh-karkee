import React, { useState } from 'react'
import { useAppContext } from '../../context/appContext';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';


const Onboarding4 = () => {
    const { setPage, features, setFeatures, isActive3, setIsActive3 } = useAppContext(); 
    
    const handleNext =  () => {
        setFeatures((prev) => ({...prev, duration : isActive3}));
        setPage((prev) => prev + 1);
    }

    return (
      <motion.div className='flex flex-col space-y-[15px] sm:space-y-[20px] lg:space-y-[25px] justify-center items-center text-center p-4 sm:p-6 lg:p-8'>
        <div className='w-full max-w-[777px] items-center pt-[20px] sm:pt-[25px] lg:pt-[29px] pl-[15px] sm:pl-[20px] lg:pl-[24px] pr-[15px] sm:pr-[20px] lg:pr-[29px] pb-[20px] sm:pb-[22px] lg:pb-[24px] rounded-2xl shadow-md space-y-[10px] sm:space-y-[12px] lg:space-y-[14px] flex flex-col bg-white min-h-[360px] sm:h-[400px] lg:h-[436px]'>
          <h1 style={{fontFamily : "Poppins"}} className='text-[#34856C] leading-tight sm:leading-8 lg:leading-10 text-[24px] sm:text-[28px] lg:text-[32px] font-semibold'>Time commitment</h1>
          <p style={{fontFamily : "Inter"}} className='text-[14px] sm:text-[16px] lg:text-[18px] w-full max-w-[631px] px-2 sm:px-4 lg:px-0'>Can you share how much time are you willing to spend per week?</p>
          <div style={{fontFamily : "Inter"}} className='grid grid-cols-1 sm:grid-cols-2 gap-[12px] sm:gap-[14px] lg:gap-[16px] w-full'> 
            <div onClick={() => setIsActive3("1 hour / week")}  className={`flex flex-col border-[1px] border-[#D9E0E6] p-[10px] sm:p-[11px] lg:p-[12px] w-full max-w-[320px] h-[70px] sm:h-[80px] lg:h-[85px] ${isActive3 == "1 hour / week" ? "bg-[#EFFDFA]" : null} space-y-[8px] sm:space-y-[9px] lg:space-y-[10px] items-center justify-center transition-colors hover:bg-gray-50 cursor-pointer`} >
                <span className='text-[14px] sm:text-[16px] lg:text-[18px] text-[#5F6C7B]'>1 hour / week</span>
            </div>
            <div  onClick={() => setIsActive3("2 hour / week")}  className={`flex flex-col border-[1px] border-[#D9E0E6] p-[10px] sm:p-[11px] lg:p-[12px] w-full max-w-[320px] h-[70px] sm:h-[80px] lg:h-[85px] ${isActive3 == "2 hour / week" ? "bg-[#EFFDFA]" : null} space-y-[8px] sm:space-y-[9px] lg:space-y-[10px] items-center justify-center transition-colors hover:bg-gray-50 cursor-pointer`}>
                <span className='text-[14px] sm:text-[16px] lg:text-[18px] text-[#5F6C7B]'>2 hour / week</span>
            </div>
            <div onClick={() => setIsActive3("3 hour / week")}  className={`flex flex-col border-[1px] border-[#D9E0E6] p-[10px] sm:p-[11px] lg:p-[12px] w-full max-w-[320px] h-[70px] sm:h-[80px] lg:h-[85px] ${isActive3 == "3 hour / week" ? "bg-[#EFFDFA]" : null} space-y-[8px] sm:space-y-[9px] lg:space-y-[10px] items-center justify-center transition-colors hover:bg-gray-50 cursor-pointer`}>
                <span className='text-[14px] sm:text-[16px] lg:text-[18px] text-[#5F6C7B]'>3 hour / week</span>
            </div>
            <div onClick={() => setIsActive3("4 hour / week")}  className={`flex flex-col border-[1px] border-[#D9E0E6] p-[10px] sm:p-[11px] lg:p-[12px] w-full max-w-[320px] h-[70px] sm:h-[80px] lg:h-[85px] ${isActive3 == "4 hour / week" ? "bg-[#EFFDFA]" : null} space-y-[8px] sm:space-y-[9px] lg:space-y-[10px] items-center justify-center transition-colors hover:bg-gray-50 cursor-pointer`}>
                <span className='text-[14px] sm:text-[16px] lg:text-[18px] text-[#5F6C7B]'>4 hour / week</span>
            </div>
            <div onClick={() => setIsActive3("5 hour / week")}  className={`flex flex-col border-[1px] border-[#D9E0E6] p-[10px] sm:p-[11px] lg:p-[12px] w-full max-w-[320px] h-[70px] sm:h-[80px] lg:h-[85px] ${isActive3 == "5 hour / week" ? "bg-[#EFFDFA]" : null} space-y-[8px] sm:space-y-[9px] lg:space-y-[10px] items-center justify-center transition-colors hover:bg-gray-50 cursor-pointer`}>
                <span className='text-[14px] sm:text-[16px] lg:text-[18px] text-[#5F6C7B]'>5 hour / week</span>
            </div>
            <div onClick={() => setIsActive3("6 hour / week")}  className={`flex flex-col border-[1px] border-[#D9E0E6] p-[10px] sm:p-[11px] lg:p-[12px] w-full max-w-[320px] h-[70px] sm:h-[80px] lg:h-[85px] ${isActive3 == "6 hour / week" ? "bg-[#EFFDFA]" : null} space-y-[8px] sm:space-y-[9px] lg:space-y-[10px] items-center justify-center transition-colors hover:bg-gray-50 cursor-pointer`}>
                <span className='text-[14px] sm:text-[16px] lg:text-[18px] text-[#5F6C7B]'>6 hour / week</span>
            </div>
          </div>
        </div>
        <NavLink 
          style={{fontFamily : "Poppins"}} 
          className="bg-[#FF6B5B] hover:bg-[#e55a4a] text-white text-[16px] sm:text-[17px] lg:text-[18px] w-full max-w-[199px] pt-[10px] pb-[10px] pl-[20px] sm:pl-[30px] lg:pl-[53px] pr-[20px] sm:pr-[30px] lg:pr-[53px] rounded-lg transition-colors" 
          onClick={handleNext} 
          to={'/onboarding/step5'}
        >
          Continue
        </NavLink>
      </motion.div>
    )
}

export default Onboarding4
