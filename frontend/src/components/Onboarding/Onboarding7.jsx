import React from 'react'
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../../context/appContext';
const Onboarding7 = () => {
    const { setPage, features } = useAppContext(); 

    console.log(features);

    return (
    <div className='flex flex-col space-y-4 justify-center items-center text-center p-4 sm:p-6 lg:p-8'>
        <div className='w-full max-w-[777px] items-center p-2 rounded-2xl shadow-md space-y-[10px] sm:space-y-[12px] lg:space-y-[14px] flex flex-col bg-white'>
            <h1 style={{fontFamily : "Poppins"}} className='text-[#34856C] leading-tight sm:leading-8 lg:leading-10 text-[20px] sm:text-[24px] lg:text-[32px] font-semibold px-2 sm:px-4 lg:px-0'>That's done - Here is the summary!</h1>
            <div style={{fontFamily : "Inter"}} className='text-start grid space-y-[10px] sm:space-y-[12px] lg:space-y-[14px] w-full max-w-[715px]'>
                <div className='p-[10px] w-full shadow-sm rounded-lg border-[1px] border-[#D9E0E6]'>
                    <span className='text-[14px] sm:text-[16px] lg:text-[18px] font-semibold text-[#34856C]'>Goals</span>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[8px] mt-2'>
                    {features.goals.map((item, index) => {
                        return (
                            <div key={index} className='border-[1px] border-[#34856C] p-[5px] rounded-full items-center text-center text-[#5F6C7B] text-[12px] sm:text-[14px] lg:text-[16px] bg-[#EFFDFA] w-full max-w-[220px] mx-auto'>
                                {item}
                            </div>
                        )
                    })}
                    </div>
                </div>
                <div className='p-[10px] w-full shadow-sm rounded-lg border-[1px] border-[#D9E0E6]'>
                    <span className='text-[14px] sm:text-[16px] lg:text-[18px] font-semibold text-[#34856C]'>Skill Set</span>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-center gap-[8px] sm:gap-[10px] mt-2'>
                    {features.skillSet.map((item, index) => {
                        return (
                            <div key={index} className='border-[1px] border-[#34856C] p-[5px] rounded-full items-center text-center text-[#5F6C7B] text-[12px] sm:text-[14px] lg:text-[16px] bg-[#EFFDFA] w-full max-w-[220px] mx-auto'>
                                {item}
                            </div>
                        )
                    })}
                    </div>
                </div>
                <div className='p-[10px] shadow-sm rounded-lg border-[1px] border-[#D9E0E6]'>
                    <span className='text-[14px] sm:text-[16px] lg:text-[18px] font-semibold text-[#34856C]'>Duration</span>
                    <div className='border-[1px] border-[#34856C] p-[5px] rounded-full items-center text-center text-[#5F6C7B] text-[12px] sm:text-[14px] lg:text-[16px] bg-[#EFFDFA] w-full max-w-[220px] mx-auto mt-2'>
                        {features.duration}
                    </div>
                </div>
                <div className='p-[10px] shadow-sm rounded-lg border-[1px] border-[#D9E0E6]'>
                    <span className='text-[14px] sm:text-[16px] lg:text-[18px] font-semibold text-[#34856C]'>Presentation Confidence</span>
                    <div className='border-[1px] border-[#34856C] p-[5px] rounded-full items-center text-center text-[#5F6C7B] text-[12px] sm:text-[14px] lg:text-[16px] bg-[#EFFDFA] w-full max-w-[220px] mx-auto mt-2'>
                        {features.confidence}
                    </div>
                </div>
                <div className='p-[10px] shadow-sm rounded-lg border-[1px] border-[#D9E0E6]'>
                    <span className='text-[14px] sm:text-[16px] lg:text-[18px] font-semibold text-[#34856C]'>Behavior</span>
                    <div className='border-[1px] border-[#34856C] p-[5px] rounded-full items-center text-center text-[#5F6C7B] text-[12px] sm:text-[14px] lg:text-[16px] bg-[#EFFDFA] w-full max-w-[220px] mx-auto mt-2'>
                        {features.behavior}
                    </div>
                </div>
            </div>
        </div>
        <div style={{fontFamily : "Poppins"}} className='flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-[20px] w-full max-w-[500px]'>
            <NavLink  
              className="border-[#34856C] border text-[#34856C] text-[16px] sm:text-[17px] lg:text-[18px] w-full sm:w-[280px] pt-[10px] pb-[10px] pl-[20px] sm:pl-[30px] lg:pl-[53px] pr-[20px] sm:pr-[30px] lg:pr-[53px] rounded-lg transition-colors hover:bg-[#34856C] hover:text-white" 
              onClick={() => setPage((prev) => prev - 4)} 
              to={'/onboarding/step2'}
            >
              Edit my Responses
            </NavLink>
            <NavLink 
              className="bg-[#FF6B5B] hover:bg-[#e55a4a] text-white text-[16px] sm:text-[17px] lg:text-[18px] w-full sm:w-[210px] pt-[10px] pb-[10px] pl-[20px] sm:pl-[30px] lg:pl-[53px] pr-[20px] sm:pr-[30px] lg:pr-[53px] rounded-lg transition-colors" 
              onClick={() => setPage((prev) => prev + 1)} 
              to={'/onboarding/step8'}
            >
              Continue
            </NavLink>
        </div>
        
    </div>
    )
}

export default Onboarding7
