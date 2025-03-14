"use client";
import React, { useState } from 'react';
import Select from 'react-select';



export default function LoginPage() {
    const [selectedSkills, setSelectedSkills] = useState([]);

    const handleSkillsChange = (selectedOptions) => {
      setSelectedSkills(selectedOptions);
    };
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 h-screen w-full'>
        <div className='hidden sm:block'>
            <img className='w-full h-full object-cover' src='/login.png' alt="" />
        </div>

        <div className='bg-white  flex flex-col justify-center'>
            <form className='max-w-[400px] w-full mx-auto rounded-lg bg-white p-8 px-8'>
                <h2 className='text-4xl dark:text-white font-bold text-center mb-4 '>SIGN IN</h2>
                
                        {/* Create Account Link */}
                <p className="text-gray-500 mb-4 ">
                    Don’t have an account?{" "}
                   <a href="/signup" className="text-green-600 font-medium hover:underline">
                     Create now
                   </a>
                </p>
                <div className='flex flex-col text-gray-400 py-2 '>
                    <label>Username</label>
                    <input placeholder="User’s first & last name" className='rounded-lg w-full px-4 py-2 border rounded-md bg-white border-gray-700 focus:border-gray-400 focus:outline-none placeholder-gray-400' type="text" />
                </div>
                <div className='flex flex-col text-gray-400 py-2'>
                    <label>Password</label>
                    <input  placeholder="Password" className='rounded-lg w-full px-4 py-2 border rounded-md bg-white border-gray-700 focus:border-gray-400 focus:outline-none placeholder-gray-400' type="password" />
                </div>
                          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-gray-500 text-sm">
          <label className="flex items-center space-x-2">
  <input type="checkbox" className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
  <span className="text-gray-500"> Remember </span>
</label>

            <a href="/forgot-password" className="text-green-600 hover:underline">
              Forgot Password?
            </a>
          </div>
                
                <button className='w-full my-5 py-2 shadow-lg shadow-teal-500/50 hover:shadow-teal-500/40 text-white font-semibold rounded-lg' style={{ backgroundColor: '#1B7F67' }}>SIGNIN</button>
                
            </form>
        </div>
    </div>
  )
}