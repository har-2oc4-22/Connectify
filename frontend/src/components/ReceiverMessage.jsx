import React, { useEffect, useRef } from 'react'
import dp from "../assets/dp.webp"
import { useSelector } from 'react-redux'

function ReceiverMessage({image, message}) {
  const scroll = useRef()
  const {selectedUser} = useSelector(state => state.user)
  
  useEffect(() => {
    scroll?.current?.scrollIntoView({behavior: "smooth"})
  }, [message, image])
  
  const handleImageScroll = () => {
    scroll?.current?.scrollIntoView({behavior: "smooth"})
  }

  return (
    <div className='flex items-end gap-3 group transition-all animate-fade-in-up duration-300'>
      <div className='w-8 h-8 rounded-full overflow-hidden shrink-0 border border-slate-100 shadow-sm mb-1'>
        <img src={selectedUser.image || dp} alt="them" className='w-full h-full object-cover'/>
      </div>

      <div 
        ref={scroll} 
        className='flex flex-col gap-2 max-w-[80%] md:max-w-[70%] lg:max-w-[500px]'
      >
        <div className='bg-white border border-slate-100 text-slate-800 px-5 py-3 rounded-2xl rounded-tl-none shadow-sm group-hover:shadow-md transition-shadow relative'>
          {image && (
            <div className='mb-2 overflow-hidden rounded-lg bg-slate-50'>
              <img 
                src={image} 
                alt="received" 
                className='w-full max-w-[280px] object-cover hover:scale-105 transition-transform duration-500' 
                onLoad={handleImageScroll}
              />
            </div>
          )}
          {message && <span className='text-[16px] leading-relaxed font-medium block break-words'>{message}</span>}
        </div>
      </div>
    </div>
  )
}

export default ReceiverMessage
