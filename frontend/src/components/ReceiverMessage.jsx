import React from 'react'
import dp from "../assets/dp.webp"
import { useSelector } from 'react-redux'

function ReceiverMessage({ image, message, createdAt }) {
  const { selectedUser } = useSelector(state => state.user)

  // Format timestamp (e.g., 10:45 AM)
  const formatTime = (timeString) => {
    if (!timeString) return "Just now";
    return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className='flex items-end justify-start gap-2 group mb-1'>
      <div className='relative shrink-0 mb-5 text-center'>
        <img
          src={selectedUser?.image || dp}
          alt=""
          className='w-7 h-7 rounded-full object-cover shadow-md'
          style={{ border: '2px solid rgba(6,182,212,0.4)' }}
        />
      </div>
      <div className='flex flex-col items-start gap-1 max-w-[72%]'>
        {image && (
          <img
            src={image}
            alt="received"
            className='max-w-[260px] rounded-2xl rounded-bl-sm object-cover shadow-xl cursor-pointer hover:opacity-95 transition-opacity'
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
            onClick={() => window.open(image, '_blank')}
          />
        )}
        {message && (
          <div
            className='px-4 py-2.5 rounded-2xl rounded-bl-sm text-[15px] font-medium leading-relaxed tracking-wide'
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}
          >
            {message}
          </div>
        )}
        {/* Timestamp */}
        <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-1'>
          <span className='text-[11px] font-semibold text-slate-400'>
            {formatTime(createdAt)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ReceiverMessage
