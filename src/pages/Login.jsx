import React from "react";

const Login = () => {
  return (
    <div className='font-montserrat min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0389c9] to-[#03a9f4]'>
      <div className='bg-white p-8 rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300'>
        <h1 className='text-4xl font-bold text-center mb-6 text-[#0389c9]'>
          Welcome
        </h1>
        <p className='text-xl text-center mb-8 text-gray-600'>
          Connect your MetaMask account to get started...
        </p>
        <button className='w-full bg-[#0389c9] hover:bg-[#026d9e] text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg'>
          Connect MetaMask
        </button>
        <p className='mt-6 text-sm text-center text-gray-500'>
          Don't have MetaMask?{" "}
          <a
            href='https://metamask.io/'
            className='text-[#0389c9] hover:underline'
          >
            Get it here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
