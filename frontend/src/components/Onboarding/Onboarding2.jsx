import React, { useState } from 'react'
import { useAppContext } from '../../context/appContext';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import pic1 from '../../assets/Onboarding/1.png'
import pic2 from '../../assets/Onboarding/2.png'
import pic3 from '../../assets/Onboarding/3.png'
import pic4 from '../../assets/Onboarding/4.png'
import pic5 from '../../assets/Onboarding/5.png'
import pic6 from '../../assets/Onboarding/6.png'


const images = [pic1, pic2, pic3, pic4, pic5, pic6];

const goals = ["AI-Driven Speech Analysis", "Storytelling mastery", "Commanding authority", "Captivating presence", "Vocal charisma", "Influential personality"]

const Onboarding2 = () => {
    const { setPage, setFeatures, isActive1, setIsActive1 } = useAppContext(); 
    
    const handleNext = () => {
        const filteredGoals = goals.filter((item) => isActive1[item])
        setFeatures((prev) => ({...prev, goals : filteredGoals}));
        setPage((prev) => prev + 1);
    }

    return (
      <motion.div className='flex flex-col space-y-[10px] sm:space-y-[12px] lg:space-y-[14px] justify-center items-center text-center p-4 sm:p-6 lg:p-8'>
        <div className='w-full max-w-[777px] items-center pt-[20px] sm:pt-[25px] lg:pt-[29px] pl-[15px] sm:pl-[20px] lg:pl-[24px] pr-[15px] sm:pr-[20px] lg:pr-[29px] pb-[20px] sm:pb-[22px] lg:pb-[24px] rounded-2xl shadow-md space-y-[10px] sm:space-y-[12px] lg:space-y-[14px] flex flex-col bg-white min-h-[400px] sm:h-[450px] lg:h-[476px]'>
          <h1 style={{fontFamily : "Poppins"}} className='text-[#34856C] leading-tight sm:leading-8 lg:leading-10 text-[24px] sm:text-[28px] lg:text-[32px] font-semibold'>Why Are you here?</h1>
          <p style={{fontFamily : "Inter"}} className='text-[14px] sm:text-[16px] lg:text-[18px] w-full max-w-[631px] px-2 sm:px-4 lg:px-0'>With the aim to Empower and Excel, select the traits that resonate the most with you.</p>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-[12px] sm:gap-[14px] lg:gap-[16px] w-full'> 
            {goals.map((item, index) => {
                return (
                  <button 
                    style={{fontFamily : "Inter"}} 
                    onClick={() => setIsActive1((prev) => ({...prev, [item] : !prev[item]}))}  
                    className={`flex flex-col border-[1px] rounded-lg border-[#D9E0E6] p-[10px] sm:p-[11px] lg:p-[12px] w-full max-w-[320px] h-[70px] sm:h-[80px] lg:h-[85px] ${isActive1[item] ? "bg-[#EFFDFA]" : null} space-y-[8px] sm:space-y-[9px] lg:space-y-[10px] items-center transition-colors hover:bg-gray-50`}
                  >
                    <img src={images[index]} alt={item} className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
                    <span className='text-[14px] sm:text-[16px] lg:text-[18px] text-[#5F6C7B] leading-tight'>{item}</span>
                  </button>
                )
            })}
          </div>
          <span style={{fontFamily : "Inter"}} className='text-[12px] sm:text-[13px] lg:text-[14px] text-[#5F6C7B] italic'>You may select as many as applicable</span>
        </div>
        
        <NavLink 
          className="bg-[#FF6B5B] hover:bg-[#e55a4a] text-white text-[16px] sm:text-[17px] lg:text-[18px] w-full max-w-[199px] pt-[10px] pb-[10px] pl-[20px] sm:pl-[30px] lg:pl-[53px] pr-[20px] sm:pr-[30px] lg:pr-[53px] rounded-lg transition-colors" 
          onClick={handleNext} 
          to={'/onboarding/step3'}
        >
          Continue
        </NavLink>
      </motion.div>
    )
}

export default Onboarding2
