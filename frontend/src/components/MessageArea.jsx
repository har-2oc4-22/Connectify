import React, { useEffect, useRef, useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import dp from "../assets/dp.webp"
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../redux/userSlice';
import { RiEmojiStickerLine } from "react-icons/ri";
import { FaImages } from "react-icons/fa6";
import { RiSendPlane2Fill } from "react-icons/ri";
import EmojiPicker from 'emoji-picker-react';
import SenderMessage from './SenderMessage';
import ReceiverMessage from './ReceiverMessage';
import axios from 'axios';
import { serverUrl } from '../main';
import { setMessages } from '../redux/messageSlice';

function MessageArea() {
  let {selectedUser,userData,socket}=useSelector(state=>state.user)
  let dispatch=useDispatch()
  let [showPicker,setShowPicker]=useState(false)
  let [input,setInput]=useState("")
  let [frontendImage,setFrontendImage]=useState(null)
  let [backendImage,setBackendImage]=useState(null)
  let image=useRef()
  let {messages}=useSelector(state=>state.message)

  const handleImage=(e)=>{
    let file=e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }

  const handleSendMessage=async (e)=>{
    e.preventDefault()
    if(input.length==0 && backendImage==null) return 
    try {
      let formData=new FormData()
      formData.append("message",input)
      if(backendImage){
        formData.append("image",backendImage)
      }
      let result=await axios.post(`${serverUrl}/api/message/send/${selectedUser._id}`,formData,{withCredentials:true})
      dispatch(setMessages([...messages,result.data]))
      setInput("")
      setFrontendImage(null)
      setBackendImage(null)
      setShowPicker(false)
    } catch (error) {
      console.log(error)
    }
  }

  const onEmojiClick =(emojiData)=>{
    setInput(prevInput=>prevInput+emojiData.emoji)
  }

  useEffect(()=>{
    socket?.on("newMessage",(mess)=>{
      dispatch(setMessages([...messages,mess]))
    })
    return ()=>socket?.off("newMessage")
  },[messages,setMessages])

  return (
    <div className={`lg:w-[calc(100%-350px)] xl:w-[calc(100%-400px)] relative ${selectedUser?"flex":"hidden"} lg:flex w-full h-[100vh] bg-[#f8fafc] overflow-hidden flex-col font-sans`}>
      
      {selectedUser ? (
        <>
          {/* Frosted Glass Top Bar */}
          <div className='w-full h-[80px] bg-white/80 backdrop-blur-xl border-b border-slate-100 z-20 flex items-center px-6 shrink-0 shadow-sm'>
             <div className='cursor-pointer lg:hidden mr-4 p-2 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center' onClick={()=>dispatch(setSelectedUser(null))}>
                 <IoIosArrowRoundBack className='w-7 h-7 text-slate-600'/>
             </div>
             <div className='flex items-center gap-4'>
                <div className='relative'>
                   <img src={ selectedUser?.image || dp} alt="" className='w-11 h-11 rounded-full object-cover border border-slate-200 shadow-sm'/>
                   <span className='w-3 h-3 rounded-full absolute bottom-0 right-0 bg-green-500 border-2 border-white'></span>
                </div>
                <div className='flex flex-col'>
                  <h1 className='text-slate-800 font-bold text-lg leading-tight'>{selectedUser?.name || selectedUser?.userName || "User"}</h1>
                  <span className='text-xs font-medium text-cyan-600'>Active now</span>
                </div>
             </div>
          </div>

          {/* Chat scrolling area */}
          <div className='w-full flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-6 relative z-0 scrollbar-thin scrollbar-thumb-slate-200 bg-slate-50/50'>
             <div className='absolute inset-0 z-[-1] opacity-30 select-none'></div>

             {messages && messages.map((mess)=>(
               mess.sender === userData._id ? 
                 <SenderMessage key={mess._id} image={mess.image} message={mess.message}/> : 
                 <ReceiverMessage key={mess._id} image={mess.image} message={mess.message}/>
             ))}
             
             {/* Empty space at bottom to not hide under the floating input */}
             <div className='h-[80px] w-full flex-shrink-0'></div>
          </div>

          {/* Floating Input Area */}
          <div className='absolute bottom-0 left-0 w-full p-4 lg:p-6 z-20 pointer-events-none'>
             {showPicker && (
                <div className='absolute bottom-[90px] left-6 pointer-events-auto shadow-2xl rounded-2xl overflow-hidden animate-fade-in-up origin-bottom-left border border-slate-100'>
                  <EmojiPicker width={320} height={350} onEmojiClick={onEmojiClick} previewConfig={{showPreview: false}}/>
                </div>
             )}
             
             {frontendImage && (
                <div className='absolute bottom-[90px] right-6 pointer-events-auto p-2 bg-white rounded-xl shadow-lg border border-slate-100 animate-fade-in-up'>
                  <div className='relative'>
                    <img src={frontendImage} alt="preview" className='h-32 rounded-lg object-cover'/>
                    <button type="button" className='absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition' onClick={()=>{setFrontendImage(null); setBackendImage(null);}}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
             )}

             <form className='w-full max-w-4xl mx-auto h-[60px] bg-white/90 backdrop-blur-xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-full flex items-center gap-2 px-3 pointer-events-auto transition-all focus-within:shadow-[0_8px_30px_rgb(34,211,238,0.15)] focus-within:border-cyan-300' onSubmit={handleSendMessage}>
               
               <div className='p-2.5 hover:bg-slate-100 rounded-full cursor-pointer transition-colors text-slate-400 hover:text-cyan-500' onClick={()=>setShowPicker(prev=>!prev)}>
                  <RiEmojiStickerLine className='w-5 h-5'/>
               </div>
               
               <input type="file" accept="image/*" ref={image} hidden onChange={handleImage}/>
               
               <input 
                 type="text" 
                 className='w-full h-full px-2 outline-none border-0 text-[15px] xl:text-[16px] text-slate-700 bg-transparent placeholder:text-slate-400 font-medium' 
                 placeholder='Type a message...' 
                 onChange={(e)=>setInput(e.target.value)} 
                 value={input}
                 onFocus={()=>setShowPicker(false)}
               />
               
               <div className='p-2.5 hover:bg-slate-100 rounded-full cursor-pointer transition-colors text-slate-400 hover:text-cyan-500 mr-1' onClick={()=>image.current.click()}>
                  <FaImages className='w-5 h-5'/>
               </div>

               <button 
                  type="submit"
                  disabled={input.length === 0 && backendImage == null}
                  className='w-10 h-10 shrink-0 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full flex justify-center items-center shadow-md shadow-cyan-500/30 hover:shadow-lg disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95'
               >
                  <RiSendPlane2Fill className='w-4 h-4 ml-0.5'/>
               </button>
             </form>
          </div>
        </>
      ) : (
        <div className='w-full h-full flex justify-center items-center relative'>
          <div className="absolute top-[20%] right-[30%] w-[400px] h-[400px] bg-blue-200 rounded-full mix-blend-multiply flex-shrink-0 filter blur-[100px] opacity-40 animate-pulse"></div>
          <div className="absolute bottom-[20%] left-[30%] w-[400px] h-[400px] bg-cyan-200 rounded-full mix-blend-multiply flex-shrink-0 filter blur-[100px] opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
          
          <div className='flex flex-col items-center justify-center z-10 text-center px-4'>
             <div className='w-24 h-24 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 rounded-3xl flex items-center justify-center mb-6 -rotate-12 transition-transform hover:rotate-0'>
                <div className='w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 shadow-inner flex items-center justify-center'>
                  <RiSendPlane2Fill className='w-8 h-8 text-white -ml-0.5 mt-0.5'/>
                </div>
             </div>
             <h1 className='text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-900 mb-3 tracking-tight'>Welcome to Chatify</h1>
             <p className='text-slate-500 font-medium text-[17px] max-w-sm'>Select a conversation from the beautiful new sidebar to start connecting.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default MessageArea