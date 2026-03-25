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
  let {userData,otherUsers,selectedUser,onlineUsers,searchData} = useSelector(state=>state.user)
  let [search,setSearch]=useState(false)
  let [input,setInput]=useState("")
  let dispatch=useDispatch()
  let navigate=useNavigate()

  const handleLogOut=async ()=>{
      try {
          await axios.get(`${serverUrl}/api/auth/logout`,{withCredentials:true})
          dispatch(setUserData(null))
          dispatch(setOtherUsers(null))
          dispatch(setToast({ message: "Logged out successfully", type: "info" }))
          navigate("/login")
      } catch (error) {
          console.log(error)
      }
  }

  const handlesearch=async ()=>{
      try {
          if(!input) return;
          let result =await axios.get(`${serverUrl}/api/user/search?query=${input}`,{withCredentials:true})
          dispatch(setSearchData(result.data))
      }
      catch(error){
          console.log(error)
      }
  }

  useEffect(()=>{
      if(input){
          handlesearch()
      }
  },[input])

  return (
    <div className={`lg:w-[350px] xl:w-[400px] w-full h-full overflow-hidden lg:flex flex-col bg-white border-r border-slate-200 relative ${!selectedUser?"flex":"hidden"} font-sans`}>
      
      {/* Search Overlay */}
      {input.length > 0 && (
        <div className='absolute top-[180px] left-0 bg-white/95 backdrop-blur-xl w-full h-[calc(100vh-180px)] overflow-y-auto flex flex-col z-[150] shadow-2xl transition-all duration-300'>
          <div className='p-4'>
            <h2 className='text-xs font-bold text-slate-400 uppercase tracking-wider mb-2'>Search Results</h2>
            {searchData?.map((user)=>(
                <div 
                  key={user._id}
                  className='w-full flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl cursor-pointer transition-all border border-transparent hover:border-slate-100 group' 
                  onClick={()=>{
                      dispatch(setSelectedUser(user))
                      setInput("")
                      setSearch(false)
                  }}>
                  <div className='relative'>
                    <img src={user.image || dp} alt="" className='w-14 h-14 rounded-full object-cover border-2 border-slate-100 group-hover:border-cyan-200 transition-colors'/>
                    {onlineUsers?.includes(user._id) &&
                    <span className='w-3.5 h-3.5 rounded-full absolute bottom-0 right-0 bg-green-500 border-2 border-white'></span>}
                  </div>
                  <div className='flex flex-col'>
                    <h1 className='text-slate-800 font-bold text-lg'>{user.name || user.userName}</h1>
                    <span className='text-sm text-slate-400 font-medium truncate'>View profile</span>
                  </div>
                </div>
            ))}
            {searchData?.length === 0 && <p className='text-center text-slate-400 py-6 text-sm'>No users found</p>}
          </div>
        </div> 
      )}

      {/* Header Area */}
      <div className='w-full flex-none bg-white/80 backdrop-blur-xl border-b border-slate-100 z-10 p-6 flex flex-col shrink-0'>
        <div className='w-full flex justify-between items-center mb-6'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/30'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h1 className='text-slate-800 font-extrabold text-2xl tracking-tight'>Chatify</h1>
          </div>
          
          {/* User Profile Hook */}
          <div className='flex items-center gap-3 bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100 pr-1 pl-3 py-1 rounded-full cursor-pointer' onClick={()=>navigate("/profile")}>
             <span className='text-slate-600 font-bold text-sm max-w-[80px] truncate'>{userData?.name || userData?.userName  || "User"}</span>
             <img src={userData?.image || dp} alt="" className='w-8 h-8 rounded-full border border-slate-200'/>
          </div>
        </div>

        {/* Search Bar / Online avatars strip */}
        <div className='w-full flex flex-col gap-4'>
            {/* Search Toggle / Input */}
            <div className="flex-1 transition-all duration-300">
               {!search ? (
                  <div 
                    className='w-full flex items-center gap-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-400 p-3 rounded-2xl cursor-pointer transition-colors shadow-sm'
                    onClick={()=>setSearch(true)}
                  >
                    <IoIosSearch className='w-5 h-5'/>
                    <span className='text-sm font-medium'>Search people...</span>
                  </div>
               ) : (
                  <form className='w-full flex items-center gap-2 bg-white border-2 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.15)] p-2 rounded-2xl relative transition-all' onSubmit={(e)=>e.preventDefault()}>
                    <IoIosSearch className='w-5 h-5 text-cyan-500 ml-1'/>
                    <input 
                      type="text" 
                      placeholder='Search users...' 
                      autoFocus
                      className='w-full h-full px-2 text-slate-700 text-sm outline-none border-0 font-medium placeholder:font-normal placeholder:text-slate-400' 
                      onChange={(e)=>setInput(e.target.value)} 
                      value={input}
                    />
                    <div className='p-1.5 hover:bg-slate-100 rounded-full cursor-pointer text-slate-400 hover:text-slate-600 transition-colors' onClick={()=>{setSearch(false); setInput("");}}>
                      <RxCross2 className='w-5 h-5'/>
                    </div>
                  </form>
               )}
            </div>

            {/* Online users strip */}
            {!search && (
              <div className='w-full flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none'>
                  {otherUsers?.filter(u => onlineUsers?.includes(u._id))?.map((user)=>(
                      <div key={'online-'+user._id} className='relative shrink-0 cursor-pointer transform hover:scale-105 transition-transform' onClick={()=>dispatch(setSelectedUser(user))}>
                        <div className='w-[60px] h-[60px] rounded-full overflow-hidden border-2 border-cyan-400 shadow-md p-[2px] bg-gradient-to-tr from-cyan-400 to-blue-500 relative'>
                           <img src={user.image || dp} alt="" className='w-full h-full rounded-full object-cover border-2 border-white absolute top-0 left-0'/>
                        </div>
                        <span className='w-4 h-4 rounded-full absolute bottom-0 right-0 bg-green-500 border-2 border-white z-10'></span>
                      </div>
                  ))}
                  {otherUsers?.filter(u => onlineUsers?.includes(u._id))?.length === 0 && (
                      <p className='text-xs font-medium text-slate-400 py-2'>Nobody else is online.</p>
                  )}
              </div>
            )}
        </div>
      </div>

      {/* Main Conversation List */}
      <div className='w-full flex-1 overflow-y-auto p-4 flex flex-col gap-2'>
        <h2 className='text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-2 mt-2'>Direct Messages</h2>
        
        {otherUsers?.map((user)=>(
            <div 
              key={user._id}
              className={`w-full flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all border ${selectedUser?._id === user._id ? 'bg-cyan-50 border-cyan-100 shadow-[0_4px_10px_rgba(6,182,212,0.1)]' : 'bg-transparent border-transparent hover:bg-slate-50 hover:border-slate-100'}`} 
              onClick={()=>dispatch(setSelectedUser(user))}
            >
              <div className='relative shrink-0'>
                <img src={user.image || dp} alt="" className='w-14 h-14 rounded-full object-cover shadow-sm bg-slate-100'/>
                {onlineUsers?.includes(user._id) &&
                <span className='w-3.5 h-3.5 rounded-full absolute bottom-0 right-0 bg-green-500 border-2 border-white'></span>}
              </div>
              <div className='flex flex-col flex-1 min-w-0'>
                <div className='flex justify-between items-baseline mb-0.5'>
                  <h1 className='text-slate-800 font-bold text-base truncate'>{user.name || user.userName}</h1>
                </div>
                <p className={`text-sm font-medium truncate ${onlineUsers?.includes(user._id) ? 'text-cyan-600' : 'text-slate-400'}`}>
                  {onlineUsers?.includes(user._id) ? "Active now" : "Offline"}
                </p>
              </div>
            </div>
        ))}
      </div>

      {/* Logout button */}
      <div 
        className='absolute bottom-6 left-6 w-12 h-12 bg-white border border-slate-200 hover:border-red-200 hover:bg-red-50 hover:text-red-500 rounded-full flex justify-center items-center text-slate-500 cursor-pointer shadow-[0_4px_20px_rgb(0,0,0,0.05)] transition-all z-50' 
        onClick={handleLogOut}
        title="Logout"
      >
        <BiLogOutCircle className='w-6 h-6'/>
      </div>
    </div>
  )
}

export default SideBar