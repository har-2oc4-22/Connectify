import React, { useEffect, useRef } from 'react'
import dp from "../assets/dp.webp"
import { useSelector } from 'react-redux'

function SenderMessage({image, message}) {
  const scroll = useRef()
  const {userData} = useSelector(state => state.user)
  
  useEffect(() => {
    scroll?.current?.scrollIntoView({behavior: "smooth"})
  }, [message, image])

  const handleImageScroll = () => {
    scroll?.current?.scrollIntoView({behavior: "smooth"})
  }

  return (
    <div className='flex items-end gap-3 justify-end group transition-all animate-fade-in-up duration-300'>
      <div 
        ref={scroll} 
        className='flex flex-col gap-2 max-w-[80%] md:max-w-[70%] lg:max-w-[500px]'
      >
        <div className='bg-gradient-to-br from-cyan-500 to-blue-600 text-white px-5 py-3 rounded-2xl rounded-tr-none shadow-lg shadow-cyan-500/10 relative group-hover:shadow-cyan-500/20 transition-shadow'>
          {image && (
            <div className='mb-2 overflow-hidden rounded-lg'>
              <img 
                src={image} 
                alt="sent" 
                className='w-full max-w-[280px] object-cover hover:scale-105 transition-transform duration-500' 
                onLoad={handleImageScroll}
              />
            </div>
          )}
          {message && <span className='text-[16px] leading-relaxed font-medium block break-words'>{message}</span>}
          
          {/* Subtle reflection effect */}
          <div className='absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 rounded-2xl rounded-tr-none transition-opacity pointer-events-none'></div>
        </div>
      </div>
      
      <div className='w-8 h-8 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-md mb-1'>
        <img src={userData.image || dp} alt="me" className='w-full h-full object-cover'/>
      </div>
    </div>
  )
}

export default SenderMessage
