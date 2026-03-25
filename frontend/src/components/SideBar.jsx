import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import dp from "../assets/dp.webp"
import { IoIosSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { BiLogOutCircle } from "react-icons/bi";
import { serverUrl } from '../main';
import axios from 'axios';
import { setOtherUsers, setSearchData, setSelectedUser, setUserData } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { setToast } from '../redux/toastSlice';

function SideBar() {
  let { userData, otherUsers, selectedUser, onlineUsers, searchData } = useSelector(state => state.user)
  let [search, setSearch] = useState(false)
  let [input, setInput] = useState("")
  let dispatch = useDispatch()
  let navigate = useNavigate()

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
      localStorage.removeItem('chatify_token');
      dispatch(setUserData(null))
      dispatch(setOtherUsers(null))
      dispatch(setToast({ message: "Logged out successfully", type: "info" }))
      navigate("/login")
    } catch (error) {
      console.log(error)
    }
  }

  const handlesearch = async () => {
    try {
      if (!input) return;
      let result = await axios.get(`${serverUrl}/api/user/search?query=${input}`, { withCredentials: true })
      dispatch(setSearchData(result.data))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (input) handlesearch()
  }, [input])

  return (
    <div
      className={`lg:w-[340px] xl:w-[380px] w-full h-full overflow-hidden lg:flex flex-col relative ${!selectedUser ? "flex" : "hidden"} font-sans`}
      style={{ background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)', borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Glowing search overlay */}
      {input.length > 0 && (
        <div className='absolute top-[190px] left-0 w-full h-[calc(100vh-190px)] overflow-y-auto flex flex-col z-[150]'
          style={{ background: 'rgba(22,33,62,0.98)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className='p-4'>
            <h2 className='text-xs font-bold uppercase tracking-widest mb-3' style={{ color: 'rgba(255,255,255,0.3)' }}>Search Results</h2>
            {searchData?.map((user) => (
              <div
                key={user._id}
                className='w-full flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all group'
                style={{ marginBottom: '4px' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                onClick={() => { dispatch(setSelectedUser(user)); setInput(""); setSearch(false); }}
              >
                <div className='relative'>
                  <img src={user.image || dp} alt="" className='w-12 h-12 rounded-full object-cover' style={{ border: '2px solid rgba(124,58,237,0.4)' }} />
                  {onlineUsers?.includes(user._id) && <span className='w-3 h-3 rounded-full absolute bottom-0 right-0 bg-green-400 border-2' style={{ borderColor: '#16213e' }}></span>}
                </div>
                <div>
                  <h1 className='text-white font-bold'>{user.name || user.userName}</h1>
                  <span className='text-xs font-medium' style={{ color: 'rgba(255,255,255,0.4)' }}>Click to chat</span>
                </div>
              </div>
            ))}
            {searchData?.length === 0 && <p className='text-center py-8 text-sm' style={{ color: 'rgba(255,255,255,0.3)' }}>No users found</p>}
          </div>
        </div>
      )}

      {/* Header */}
      <div className='w-full flex-none p-5 shrink-0' style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className='w-full flex justify-between items-center mb-5'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-xl flex items-center justify-center' style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h1 className='text-white font-extrabold text-2xl tracking-tight'>Chatify</h1>
          </div>
          {/* Profile pill */}
          <div
            className='flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-all'
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
            onClick={() => navigate("/profile")}
          >
            <span className='text-sm font-bold max-w-[70px] truncate' style={{ color: 'rgba(255,255,255,0.7)' }}>{userData?.name || userData?.userName || "User"}</span>
            <img src={userData?.image || dp} alt="" className='w-7 h-7 rounded-full object-cover' style={{ border: '2px solid rgba(124,58,237,0.5)' }} />
          </div>
        </div>

        {/* Search */}
        {!search ? (
          <div
            className='w-full flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all'
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            onClick={() => setSearch(true)}
          >
            <IoIosSearch className='w-5 h-5' style={{ color: 'rgba(255,255,255,0.3)' }} />
            <span className='text-sm font-medium' style={{ color: 'rgba(255,255,255,0.3)' }}>Search people...</span>
          </div>
        ) : (
          <form
            className='w-full flex items-center gap-2 p-2 rounded-2xl'
            style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.4)' }}
            onSubmit={e => e.preventDefault()}
          >
            <IoIosSearch className='w-5 h-5 ml-1' style={{ color: '#7c3aed' }} />
            <input
              type="text" placeholder='Search users...' autoFocus
              className='w-full h-full px-2 text-sm outline-none border-0 font-medium bg-transparent'
              style={{ color: 'white', caretColor: '#7c3aed' }}
              onChange={e => setInput(e.target.value)} value={input}
            />
            <div className='p-1.5 rounded-full cursor-pointer' style={{ color: 'rgba(255,255,255,0.4)' }} onClick={() => { setSearch(false); setInput(""); }}>
              <RxCross2 className='w-4 h-4' />
            </div>
          </form>
        )}

        {/* Online avatars */}
        {!search && (
          <div className='w-full flex items-center gap-3 overflow-x-auto pb-1 mt-4 scrollbar-none'>
            {otherUsers?.filter(u => onlineUsers?.includes(u._id))?.map((user) => (
              <div key={'online-' + user._id} className='relative shrink-0 cursor-pointer transform hover:scale-110 transition-transform' onClick={() => dispatch(setSelectedUser(user))}>
                <div className='w-14 h-14 rounded-full p-0.5' style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
                  <img src={user.image || dp} alt="" className='w-full h-full rounded-full object-cover border-2' style={{ borderColor: '#1a1a2e' }} />
                </div>
                <span className='w-3.5 h-3.5 rounded-full absolute bottom-0 right-0 bg-green-400 border-2' style={{ borderColor: '#1a1a2e' }}></span>
              </div>
            ))}
            {otherUsers?.filter(u => onlineUsers?.includes(u._id))?.length === 0 && (
              <p className='text-xs font-medium py-1' style={{ color: 'rgba(255,255,255,0.25)' }}>Nobody else is online.</p>
            )}
          </div>
        )}
      </div>

      {/* Conversation List */}
      <div className='w-full flex-1 overflow-y-auto p-3 flex flex-col gap-1'>
        <h2 className='text-xs font-bold uppercase tracking-widest mx-3 my-2' style={{ color: 'rgba(255,255,255,0.25)' }}>Direct Messages</h2>
        {otherUsers?.map((user) => (
          <div
            key={user._id}
            className='w-full flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all'
            style={{
              background: selectedUser?._id === user._id ? 'rgba(124,58,237,0.15)' : 'transparent',
              border: selectedUser?._id === user._id ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent',
            }}
            onMouseEnter={e => { if (selectedUser?._id !== user._id) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.border = '1px solid rgba(255,255,255,0.06)' } }}
            onMouseLeave={e => { if (selectedUser?._id !== user._id) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.border = '1px solid transparent' } }}
            onClick={() => dispatch(setSelectedUser(user))}
          >
            <div className='relative shrink-0'>
              <img src={user.image || dp} alt="" className='w-12 h-12 rounded-full object-cover' style={{ border: selectedUser?._id === user._id ? '2px solid rgba(124,58,237,0.6)' : '2px solid rgba(255,255,255,0.08)' }} />
              {onlineUsers?.includes(user._id) && <span className='w-3 h-3 rounded-full absolute bottom-0 right-0 bg-green-400 border-2' style={{ borderColor: '#16213e' }}></span>}
            </div>
            <div className='flex-1 min-w-0'>
              <h1 className='text-white font-bold text-sm truncate'>{user.name || user.userName}</h1>
              <p className='text-xs font-medium truncate mt-0.5' style={{ color: onlineUsers?.includes(user._id) ? '#06b6d4' : 'rgba(255,255,255,0.3)' }}>
                {onlineUsers?.includes(user._id) ? "● Active now" : "○ Offline"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Logout */}
      <div
        className='absolute bottom-6 left-5 w-11 h-11 rounded-full flex justify-center items-center cursor-pointer transition-all z-50'
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
        onClick={handleLogOut}
        title="Logout"
      >
        <BiLogOutCircle className='w-5 h-5' style={{ color: 'rgba(255,255,255,0.5)' }} />
      </div>
    </div>
  )
}

export default SideBar