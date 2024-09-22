import { useState } from "react";
import { RiSearch2Line } from "react-icons/ri";
import { FiHome } from "react-icons/fi";
import { HiOutlineUserAdd, HiOutlineMoon } from "react-icons/hi";
import { FaRegMessage, FaRegBell } from "react-icons/fa6";
import { MdClose } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { recentSearch } from "../constants";
import { image1 } from "../assets";

const Navbar = () => {
  const [focused, setFocused] = useState(false);
  const [showSearchedResult, setShowSearchedResult] = useState(false);

  return (
    <header className='bg-primary text-white'>
      <nav className='mx-auto flex items-center justify-between px-4 py-3'>
        <div className='flex items-center gap-5'>
          <h1 className='text-xl font-extrabold'>Dechat</h1>

          {/* search input */}
          <div className='relative flex w-[200px] items-center justify-between rounded-md bg-[#3494cd] p-2'>
            <div className='flex items-center gap-2'>
              <RiSearch2Line size={20} />
              <input
                type='text'
                className='w-full bg-transparent text-[12px] outline-none placeholder:text-white/70'
                placeholder='Find Friends...'
                onFocus={() => {
                  setFocused(true);
                  setShowSearchedResult(true);
                }}
                onBlur={() => {
                  setFocused(false);
                  setShowSearchedResult(false);
                }}
              />
            </div>
            {focused && (
              <MdClose
                size={20}
                className='cursor-pointer'
                onClick={() => {
                  setFocused(false);
                  setShowSearchedResult(false);
                }}
              />
            )}

            {/* searched field */}
            <AnimatePresence>
              {showSearchedResult && (
                <motion.div
                  className='searched absolute left-0 top-[2.7rem] z-[99999999999999999] h-auto w-[200px] overflow-hidden rounded-md bg-white p-[12px] shadow-lg'
                  initial={{ height: 0 }} // Initial height
                  animate={{ height: "auto" }} // Animate to full height
                  exit={{ height: 0 }} // Animate back to height 0
                  transition={{ duration: 0.3 }} // Transition duration
                >
                  <p className='text-sm text-gray-400'>Recent Search</p>

                  <div className='flex flex-col gap-3 pt-3'>
                    {recentSearch.map((item, index) => (
                      <div key={index} className='flex items-center gap-3'>
                        <img
                          src={item.picture}
                          alt={item.name + "-image"}
                          className='rounded-full object-cover'
                        />

                        <div>
                          <h4 className='text-sm font-medium text-gray-700'>
                            {item.name}
                          </h4>

                          <p className='font-roboto text-[12px] font-medium text-gray-500'>
                            {item.friends} Mutual Friend
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <FiHome size={20} className='hidden lg:block' />

          <div className='relative hidden lg:block'>
            <HiOutlineUserAdd size={20} />
          </div>
        </div>

        <div className='flex items-center gap-5'>
          {/* posts */}
          <div className='hidden rounded-md bg-[#3494cd] p-2 text-sm font-medium lg:block'>
            <strong>326</strong> Total Posts
          </div>

          {/* total friends */}
          <div className='hidden rounded-md bg-[#3494cd] p-2 text-sm font-medium lg:block'>
            <strong>326</strong> Total Friends
          </div>

          {/* message-icon */}
          <div className='relative hidden md:block'>
            <FaRegMessage size={16} />

            <div className='absolute -right-1 -top-2 flex size-4 items-center justify-center rounded-full bg-green-500 text-[10px] font-semibold'>
              2
            </div>
          </div>

          <HiOutlineMoon size={16} />

          {/* bell-icon */}
          <div className='relative hidden md:block'>
            <FaRegBell size={16} />

            <div className='absolute -right-1 -top-2 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold'>
              2
            </div>
          </div>

          {/* account */}
          <div className='hidden items-center gap-2 md:flex'>
            <div className='relative'>
              <img
                src={image1}
                alt='avatar'
                className='size-[36px] rounded-full object-cover'
              />

              {/* active-icon */}
              <div className='absolute -right-1 top-0 flex size-[13px] items-center justify-center rounded-full bg-white text-[10px] font-semibold'>
                <div className='size-[7px] rounded-full bg-green-500'></div>
              </div>
            </div>

            <div>
              <h3 className='text-[12px] font-semibold leading-[1.4]'>
                Mary Thompson
              </h3>
              <p className='text-[12px] leading-[1.1]'>active now</p>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
