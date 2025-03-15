"use client";
import React, { useState } from 'react';
import Select from 'react-select';




export default function RegisterPageOrganization() {
    const [formData, setFormData] = useState({
        organizationName: "",
        password: "",
        email: "",
        contactPerson: "",
        location: "",
        description: "",
      });
    
      // Handle input change
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      // Handle form submission
      const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Submitted:", formData);
      };
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 h-screen w-full'>
        <div className='hidden sm:block'>
            <img className='w-full h-full object-cover' src='/1.png' alt="" />
        </div>

        <div className='bg-white  flex flex-col justify-center'>
            <form onSubmit={handleSubmit}  className='max-w-[400px] w-full mx-auto rounded-lg bg-white p-8 px-8'>
                <h2 className='text-4xl dark:text-white font-bold text-center mb-4'>SIGN UP</h2>
                <p className="text-gray-500 mb-4 mt-1">
                   Already have an account? <a href="/login" className="text-teal-600 font-semibold">Sign in</a>
                </p>
                <div className='flex flex-col text-gray-400 py-2'>
                    <label className="block text-gray-400">Organization Name</label>
                    <input placeholder="Name of the organization" 
                    value={formData.organizationName}
                    onChange={handleChange}
                    className='rounded-lg w-full px-4 py-2 border rounded-md bg-white border-gray-700 focus:border-gray-400 focus:outline-none placeholder-gray-400' type="text" />
                </div>
                <div className='flex flex-col text-gray-400 py-2'>
                    <label className="block" >Password</label>
                    <input  placeholder="Password" 
                    value={formData.password}
                    onChange={handleChange}
                    className='rounded-lg w-full px-4 py-2 border rounded-md bg-white border-gray-700 focus:border-gray-400 focus:outline-none placeholder-gray-400' type="password" />
                </div>
                <div className='flex flex-col text-gray-400 py-2'>
                    <label className="block">Contact E-mail for Coordination</label>
                    <input type="email" 
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@gmail.com" 
                    className='rounded-lg w-full px-4 py-2 border rounded-md bg-white border-gray-700 focus:border-gray-400 focus:outline-none placeholder-gray-400'  />
                </div>
                <div className='flex flex-col text-gray-400 py-2'>
                    <label className="block">Contact Person</label>
                    <input type="text" 
                    value={formData.contactPerson}
                    onChange={handleChange}
                    placeholder="example@gmail.com" 
                    className='rounded-lg w-full px-4 py-2 border rounded-md bg-white border-gray-700 focus:border-gray-400 focus:outline-none placeholder-gray-400'  />
                </div>
                <div className='flex flex-col text-gray-400 py-2'>
                    <label className="block">Location</label>
                    <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md bg-white border-gray-300 focus:ring-teal-500 focus:border-teal-500"
              required
            >
              <option value="">Select organization location</option>
              <option value="Algiers">Algiers</option>
              <option value="Oran">Oran</option>
              <option value="Constantine">Constantine</option>
            </select>
                </div>
                <div className='flex flex-col text-gray-400 py-2'>
                    <label className="block">Description</label>
                    <textarea
                      name="description"
                      placeholder="Description of the organization"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md bg-white border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                      rows="3"
                      required
                   ></textarea>
                </div>

                
                <button className='w-full my-5 py-2 shadow-lg shadow-teal-500/50 hover:shadow-teal-500/40 text-white font-semibold rounded-lg' style={{ backgroundColor: '#1B7F67' }}>SIGN UP</button>
                
            </form>
        </div>
    </div>
  )
}