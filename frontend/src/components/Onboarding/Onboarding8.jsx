import React from 'react'
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../../context/appContext';

const Onboarding8 = () => {
   const { setPage } = useAppContext(); 
  
    return (
      <div className='flex flex-col space-y-[40px] sm:space-y-[60px] lg:space-y-[97px] justify-center items-center text-center p-4 sm:p-6 lg:p-8'>
        <div className='w-full max-w-[774px] rounded-2xl shadow-md space-y-[20px] sm:space-y-[30px] lg:space-y-[42px] pb-[25px] sm:pb-[35px] lg:pb-[45px] pr-[15px] sm:pr-[18px] lg:pr-[18px] pt-[25px] sm:pt-[35px] lg:pt-[45px] pl-[15px] sm:pl-[18px] lg:pl-[18px] flex flex-col bg-white min-h-[200px] sm:h-[250px] lg:h-[292px]'>
          <h1 style={{fontFamily : "Poppins"}} className='text-[#34856C] w-full max-w-[738px] leading-tight sm:leading-8 lg:leading-10 text-[28px] sm:text-[36px] lg:text-[48px] font-semibold'>Time to embark on a journey with Shankh! </h1>
          <p style={{fontFamily : "Inter"}} className='text-[14px] sm:text-[16px] lg:text-[18px] text-[#5F6C7B]'>Record your speech for Shankh to establish a baseline</p>
        </div>
        <NavLink 
          style={{fontFamily : "Poppins"}} 
          className="bg-[#FF6B5B] hover:bg-[#e55a4a] text-white text-[16px] sm:text-[17px] lg:text-[18px] w-full max-w-[199px] pt-[10px] pb-[10px] pl-[20px] sm:pl-[30px] lg:pl-[53px] pr-[20px] sm:pr-[30px] lg:pr-[53px] rounded-lg transition-colors" 
          onClick={() => setPage((prev) => prev + 1)} 
          to={'/onboarding/step9'}
        >
          Let's Begin
        </NavLink>
      </div>
    )
}

export default Onboarding8
