"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import react-select with SSR disabled
const Select = dynamic(() => import('react-select'), {
  ssr: false
});

const skillsOptions = [
  { value: 'Cuisine', label: 'Cuisine' },
  { value: 'Nettoyage', label: 'Nettoyage' },
  { value: 'Service', label: 'Service' },
  { value: 'Gestion d\'événements', label: 'Gestion d\'événements' },
  { value: 'Aide aux personnes âgées', label: 'Aide aux personnes âgées' },
  // Add more skills as needed
];

export default function RegisterPageVolunteer() {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSkillsChange = (selectedOptions) => {
    setSelectedSkills(selectedOptions);
  };

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 h-screen w-full'>
      <div className='hidden sm:block'>
        <img className='w-full h-full object-cover' src='/1.png' alt="" />
      </div>

      <div className='bg-white flex flex-col justify-center'>
        <form className='max-w-[400px] w-full mx-auto rounded-lg bg-white p-8 px-8'>
          <h2 className='text-4xl dark:text-white font-bold text-center'>SIGN IN</h2>
          
          <div className='flex flex-col text-gray-400 py-2'>
            <label>Username</label>
            <input 
              placeholder="User's first & last name" 
              className='rounded-lg w-full px-4 py-2 border rounded-md bg-white border-gray-700 focus:border-gray-400 focus:outline-none placeholder-gray-400' 
              type="text" 
            />
          </div>
          
          <div className='flex flex-col text-gray-400 py-2'>
            <label>Password</label>
            <input 
              placeholder="Password" 
              className='rounded-lg w-full px-4 py-2 border rounded-md bg-white border-gray-700 focus:border-gray-400 focus:outline-none placeholder-gray-400' 
              type="password" 
            />
          </div>
          
          <div className='flex flex-col text-gray-400 py-2'>
            <label>E-mail</label>
            <input 
              type="email" 
              placeholder="example@gmail.com" 
              className='rounded-lg w-full px-4 py-2 border rounded-md bg-white border-gray-700 focus:border-gray-400 focus:outline-none placeholder-gray-400'  
            />
          </div>
          
          <div className='flex flex-col text-gray-400 py-2'>
            <label>Skills</label>
            {isMounted && (
              <Select
                isMulti
                options={skillsOptions}
                value={selectedSkills}
                onChange={handleSkillsChange}
                className='mt-2'
                classNamePrefix='react-select'
                placeholder='Select your skills'
              />
            )}
          </div>
          
          <button 
            className='w-full my-5 py-2 shadow-lg shadow-teal-500/50 hover:shadow-teal-500/40 text-white font-semibold rounded-lg' 
            style={{ backgroundColor: '#1B7F67' }}
          >
            SIGN IN
          </button>
        </form>
      </div>
    </div>
  );
}