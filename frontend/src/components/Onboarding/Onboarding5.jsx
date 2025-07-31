import React, { useState } from 'react'
import { useAppContext } from '../../context/appContext';
import { NavLink } from 'react-router-dom';
import pic1 from '../../assets/Onboarding/13.png'
import pic2 from '../../assets/Onboarding/14.png'
import pic3 from '../../assets/Onboarding/15.png'
import pic4 from '../../assets/Onboarding/16.png'
import pic5 from '../../assets/Onboarding/17.png'


const images = [pic1, pic2, pic3, pic4, pic5];


const Onboarding5 = () => {
    const { setPage, features, setFeatures, isActive4, setIsActive4 } = useAppContext(); 

    const handleNext =  () => {
        setFeatures((prev) => ({...prev, confidence : isActive4}));
        setPage((prev) => prev + 1);
    }
    console.log(features)
  
    return (
    <div className='flex flex-col space-y-[15px] sm:space-y-[20px] lg:space-y-[25px] justify-center items-center text-center p-4 sm:p-6 lg:p-8'>
        <div className='w-full max-w-[777px] items-center pt-[20px] sm:pt-[25px] lg:pt-[29px] pl-[15px] sm:pl-[20px] lg:pl-[24px] pr-[15px] sm:pr-[20px] lg:pr-[29px] pb-[20px] sm:pb-[22px] lg:pb-[24px] rounded-2xl shadow-md space-y-[10px] sm:space-y-[12px] lg:space-y-[14px] flex flex-col bg-white min-h-[360px] sm:h-[400px] lg:h-[436px]'>
        <h1 style={{fontFamily : "Poppins"}} className='text-[#34856C] leading-tight sm:leading-8 lg:leading-10 text-[20px] sm:text-[24px] lg:text-[32px] font-semibold px-2 sm:px-4 lg:px-0'>How confident do you feel while 
        making a presentation?</h1>
        <div style={{fontFamily : "Inter"}} className='grid grid-cols-1 sm:grid-cols-2 items-center text-center justify-center gap-[12px] sm:gap-[14px] lg:gap-[16px] w-full'> 
            <div onClick={() => setIsActive4("Highly confident")}  className={`flex flex-col border-[1px] border-[#D9E0E6] p-[10px] sm:p-[11px] lg:p-[12px] w-full max-w-[320px] h-[70px] sm:h-[80px] lg:h-[85px] ${isActive4 == "Highly confident" ? "bg-[#EFFDFA]" : null} space-y-[8px] sm:space-y-[9px] lg:space-y-[10px] items-center transition-colors hover:bg-gray-50 cursor-pointer`}>
                <img src={images[0]} className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
                <span className='text-[14px] sm:text-[16px] lg:text-[18px] text-[#5F6C7B] leading-tight'>Highly confident</span>
            </div>
            <div onClick={() => setIsActive4("Fairly Confident")}  className={`flex flex-col border-[1px] border-[#D9E0E6] p-[10px] sm:p-[11px] lg:p-[12px] w-full max-w-[320px] h-[70px] sm:h-[80px] lg:h-[85px] ${isActive4 == "Fairly Confident" ? "bg-[#EFFDFA]" : null} space-y-[8px] sm:space-y-[9px] lg:space-y-[10px] items-center transition-colors hover:bg-gray-50 cursor-pointer`}>
                <img src={images[1]} className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
                <span className='text-[14px] sm:text-[16px] lg:text-[18px] text-[#5F6C7B] leading-tight'>Fairly Confident</span>
            </div>
            <div onClick={() => setIsActive4("Neutral")}  className={`flex flex-col border-[1px] border-[#D9E0E6] p-[10px] sm:p-[11px] lg:p-[12px] w-full max-w-[320px] h-[70px] sm:h-[80px] lg:h-[85px] ${isActive4 == "Neutral" ? "bg-[#EFFDFA]" : null} space-y-[8px] sm:space-y-[9px] lg:space-y-[10px] items-center transition-colors hover:bg-gray-50 cursor-pointer`}>
                <img src={images[2]} className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
                <span className='text-[14px] sm:text-[16px] lg:text-[18px] text-[#5F6C7B] leading-tight'>Neutral</span>
            </div>
            <div onClick={() => setIsActive4("Slightly uncertain")}  className={`flex flex-col border-[1px] border-[#D9E0E6] p-[10px] sm:p-[11px] lg:p-[12px] w-full max-w-[320px] h-[70px] sm:h-[80px] lg:h-[85px] ${isActive4 == "Slightly uncertain" ? "bg-[#EFFDFA]" : null} space-y-[8px] sm:space-y-[9px] lg:space-y-[10px] items-center transition-colors hover:bg-gray-50 cursor-pointer`}>
                <img src={images[3]} className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
                <span className='text-[14px] sm:text-[16px] lg:text-[18px] text-[#5F6C7B] leading-tight'>Slightly uncertain</span>
            </div>
            <div onClick={() => setIsActive4("Not very confident")}  className={`flex flex-col border-[1px] border-[#D9E0E6] p-[10px] sm:p-[11px] lg:p-[12px] w-full max-w-[320px] h-[70px] sm:h-[80px] lg:h-[85px] ${isActive4 == "Not very confident" ? "bg-[#EFFDFA]" : null} space-y-[8px] sm:space-y-[9px] lg:space-y-[10px] items-center transition-colors hover:bg-gray-50 cursor-pointer`}>
                <img src={images[4]} className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
                <span className='text-[14px] sm:text-[16px] lg:text-[18px] text-[#5F6C7B] leading-tight'>Not very confident</span>
            </div>
          </div>
        </div>
        <NavLink 
          style={{fontFamily : "Poppins"}} 
          className="bg-[#FF6B5B] hover:bg-[#e55a4a] text-white text-[16px] sm:text-[17px] lg:text-[18px] w-full max-w-[199px] pt-[10px] pb-[10px] pl-[20px] sm:pl-[30px] lg:pl-[53px] pr-[20px] sm:pr-[30px] lg:pr-[53px] rounded-lg transition-colors" 
          onClick={handleNext} 
          to={'/onboarding/step6'}
        >
          Continue
        </NavLink>
    </div>
    )
}

export default Onboarding5
