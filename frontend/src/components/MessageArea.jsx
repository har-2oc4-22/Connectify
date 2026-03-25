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
  let { selectedUser, userData, socket, onlineUsers } = useSelector(state => state.user)
  let dispatch = useDispatch()
  let [showPicker, setShowPicker] = useState(false)
  let [input, setInput] = useState("")
  let [frontendImage, setFrontendImage] = useState(null)
  let [backendImage, setBackendImage] = useState(null)
  let image = useRef()
  let messagesEndRef = useRef(null)
  let { messages } = useSelector(state => state.message)

  const handleImage = (e) => {
    let file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (input.length == 0 && backendImage == null) return
    try {
      let formData = new FormData()
      formData.append("message", input)
      if (backendImage) formData.append("image", backendImage)
      let result = await axios.post(`${serverUrl}/api/message/send/${selectedUser._id}`, formData, { withCredentials: true })
      dispatch(setMessages([...(messages || []), result.data]))
      setInput(""); setFrontendImage(null); setBackendImage(null); setShowPicker(false)
    } catch (error) {
      console.log(error)
    }
  }

  const onEmojiClick = (emojiData) => {
    setInput(prev => prev + emojiData.emoji)
  }

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    socket?.on("newMessage", (mess) => {
      dispatch(setMessages([...(messages || []), mess]))
    })
    return () => socket?.off("newMessage")
  }, [messages, socket])

  return (
    <div
      className={`lg:w-[calc(100%-340px)] xl:w-[calc(100%-380px)] relative ${selectedUser ? "flex" : "hidden"} lg:flex w-full h-[100vh] overflow-hidden flex-col font-sans`}
      style={{ background: 'linear-gradient(160deg, #0f0c29 0%, #1a1a2e 40%, #16213e 100%)' }}
    >
      {selectedUser ? (
        <>
          {/* Top Bar */}
          <div
            className='w-full h-[72px] flex items-center px-6 shrink-0 z-20'
            style={{ background: 'rgba(26,26,46,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className='cursor-pointer lg:hidden mr-4 p-2 rounded-full transition-all' style={{ color: 'rgba(255,255,255,0.6)' }} onClick={() => dispatch(setSelectedUser(null))}>
              <IoIosArrowRoundBack className='w-7 h-7' />
            </div>
            <div className='flex items-center gap-4'>
              <div className='relative'>
                <div className='w-11 h-11 rounded-full p-0.5' style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
                  <img src={selectedUser?.image || dp} alt="" className='w-full h-full rounded-full object-cover border-2' style={{ borderColor: '#1a1a2e' }} />
                </div>
                <span className='w-3 h-3 rounded-full absolute bottom-0 right-0 bg-green-400 border-2' style={{ borderColor: '#1a1a2e' }}></span>
              </div>
              <div>
                <h1 className='text-white font-bold text-base leading-tight'>{selectedUser?.name || selectedUser?.userName || "User"}</h1>
                <span className='text-xs font-medium' style={{ color: onlineUsers?.includes(selectedUser?._id) ? '#06b6d4' : 'rgba(255,255,255,0.4)' }}>
                  {onlineUsers?.includes(selectedUser?._id) ? "● Active now" : "○ Offline"}
                </span>
              </div>
            </div>
          </div>

          {/* Chat area */}
          <div className='w-full flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4' style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(124,58,237,0.3) transparent' }}>
            {/* Subtle grid background pattern */}
            <div className='fixed inset-0 z-0 opacity-[0.03]' style={{ backgroundImage: 'radial-gradient(circle, #7c3aed 1px, transparent 1px)', backgroundSize: '30px 30px', pointerEvents: 'none' }}></div>

            {messages && messages.map((mess, index) => {
              const currentDate = new Date(mess.createdAt || Date.now());
              const prevDate = index > 0 ? new Date(messages[index - 1].createdAt || Date.now()) : null;
              const showDate = index === 0 || currentDate.toDateString() !== prevDate?.toDateString();
              
              const isToday = currentDate.toDateString() === new Date().toDateString();
              const dateLabel = isToday ? "Today" : currentDate.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

              return (
                <React.Fragment key={mess._id}>
                  {showDate && (
                    <div className="flex justify-center my-4 w-full">
                      <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide text-white/50 backdrop-blur-md shadow-md border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}>
                        {dateLabel}
                      </span>
                    </div>
                  )}
                  {mess.sender === userData._id
                    ? <SenderMessage image={mess.image} message={mess.message} createdAt={mess.createdAt} />
                    : <ReceiverMessage image={mess.image} message={mess.message} createdAt={mess.createdAt} />}
                </React.Fragment>
              )
            })}
            <div className='h-[80px] w-full flex-shrink-0'></div>
            <div ref={messagesEndRef} />
          </div>

          {/* Floating Input */}
          <div className='absolute bottom-0 left-0 w-full p-4 lg:p-5 z-20 pointer-events-none'>
            {showPicker && (
              <div className='absolute bottom-[90px] left-5 pointer-events-auto rounded-2xl overflow-hidden border' style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.6)', borderColor: 'rgba(124,58,237,0.3)' }}>
                <EmojiPicker width={320} height={350} onEmojiClick={onEmojiClick} previewConfig={{ showPreview: false }} theme="dark" />
              </div>
            )}

            {frontendImage && (
              <div className='absolute bottom-[90px] right-6 pointer-events-auto p-2 rounded-xl border animate-fade-in-up' style={{ background: 'rgba(26,26,46,0.95)', border: '1px solid rgba(124,58,237,0.4)', boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }}>
                <div className='relative'>
                  <img src={frontendImage} alt="preview" className='h-28 rounded-lg object-cover' />
                  <button type="button" className='absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center rounded-full text-white text-xs' style={{ background: '#ef4444' }} onClick={() => { setFrontendImage(null); setBackendImage(null); }}>✕</button>
                </div>
              </div>
            )}

            <form
              className='w-full max-w-4xl mx-auto h-[58px] flex items-center gap-2 px-3 pointer-events-auto transition-all rounded-2xl'
              style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
              onSubmit={handleSendMessage}
            >
              <div className='p-2 rounded-full cursor-pointer transition-all' style={{ color: 'rgba(255,255,255,0.4)' }}
                onMouseEnter={e => e.currentTarget.style.color = '#7c3aed'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                onClick={() => setShowPicker(prev => !prev)}>
                <RiEmojiStickerLine className='w-5 h-5' />
              </div>

              <input type="file" accept="image/*" ref={image} hidden onChange={handleImage} />

              <input
                type="text"
                className='w-full h-full px-2 outline-none border-0 text-[15px] font-medium bg-transparent'
                placeholder='Type a message...'
                style={{ color: 'white', caretColor: '#7c3aed' }}
                onChange={e => setInput(e.target.value)}
                value={input}
                onFocus={() => setShowPicker(false)}
              />

              <div className='p-2 rounded-full cursor-pointer transition-all mr-1' style={{ color: 'rgba(255,255,255,0.4)' }}
                onMouseEnter={e => e.currentTarget.style.color = '#06b6d4'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                onClick={() => image.current.click()}>
                <FaImages className='w-5 h-5' />
              </div>

              <button
                type="submit"
                disabled={input.length === 0 && backendImage == null}
                className='w-10 h-10 shrink-0 text-white rounded-xl flex justify-center items-center transition-all hover:scale-110 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100'
                style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: '0 0 15px rgba(124,58,237,0.4)' }}
              >
                <RiSendPlane2Fill className='w-4 h-4 ml-0.5' />
              </button>
            </form>
          </div>
        </>
      ) : (
        /* Empty state */
        <div className='w-full h-full flex justify-center items-center relative'>
          <div className="absolute w-[400px] h-[400px] rounded-full opacity-10 animate-pulse" style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)' }}></div>
          <div className="absolute w-[300px] h-[300px] rounded-full opacity-10 animate-pulse" style={{ background: 'radial-gradient(circle, #06b6d4, transparent 70%)', animationDelay: '2s' }}></div>
          <div className='flex flex-col items-center z-10 text-center px-4'>
            <div className='w-24 h-24 rounded-3xl flex items-center justify-center mb-6' style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: '0 0 50px rgba(124,58,237,0.4)' }}>
              <RiSendPlane2Fill className='w-11 h-11 text-white' />
            </div>
            <h1 className='text-3xl font-extrabold text-white mb-3 tracking-tight'>Welcome to Chatify</h1>
            <p className='text-base font-medium max-w-sm' style={{ color: 'rgba(255,255,255,0.4)' }}>Select a conversation from the sidebar to start chatting.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default MessageArea