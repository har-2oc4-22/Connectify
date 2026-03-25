import React from 'react'
import dp from "../assets/dp.webp"
import { useSelector } from 'react-redux'
import { IoCheckmarkDoneSharp } from "react-icons/io5";

function SenderMessage({ image, message, createdAt }) {
  const { userData } = useSelector(state => state.user)

  // Format timestamp (e.g., 10:45 AM)
  const formatTime = (timeString) => {
    if (!timeString) return "Just now";
    return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className='flex items-end justify-end gap-2 group mb-1'>
      <div className='flex flex-col items-end gap-1 max-w-[72%]'>
        {image && (
          <img
            src={image}
            alt="sent"
            className='max-w-[260px] rounded-2xl rounded-br-sm object-cover shadow-xl cursor-pointer hover:opacity-95 transition-opacity'
            style={{ border: '2px solid rgba(124,58,237,0.3)' }}
            onClick={() => window.open(image, '_blank')}
          />
        )}
        {message && (
          <div
            className='px-4 py-2.5 rounded-2xl rounded-br-sm text-white text-[15px] font-medium leading-relaxed tracking-wide shadow-lg'
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              boxShadow: '0 4px 15px rgba(124,58,237,0.25)'
            }}
          >
            {message}
          </div>
        )}
        {/* Timestamp & Read Receipt */}
        <div className='flex items-center gap-1.5 mr-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
          <span className='text-[11px] font-semibold text-slate-400'>
            {formatTime(createdAt)}
          </span>
          <IoCheckmarkDoneSharp className='w-4 h-4 text-cyan-500' />
        </div>
      </div>
      <div className='relative shrink-0 mb-5'>
          <img
            src={userData?.image || dp}
            alt=""
            className='w-7 h-7 rounded-full object-cover shadow-md'
            style={{ border: '2px solid rgba(124,58,237,0.5)' }}
          />
      </div>
    </div>
  )
}

export default SenderMessage
