import React, { useRef, useState } from 'react'
import dp from "../assets/dp.webp"
import { IoCameraOutline } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../main';
import { setUserData } from '../redux/userSlice';
import { setToast } from '../redux/toastSlice';

function Profile() {
  const {userData} = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const [name, setName] = useState(userData?.name || "")
  const [frontendImage, setFrontendImage] = useState(userData?.image || dp)
  const [backendImage, setBackendImage] = useState(null)
  const image = useRef()
  const [saving, setSaving] = useState(false)

  const handleImage = (e) => {
    let file = e.target.files[0]
    if (file) {
      setBackendImage(file)
      setFrontendImage(URL.createObjectURL(file))
    }
  }

  const handleProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      let formData = new FormData()
      formData.append("name", name)
      if (backendImage) {
        formData.append("image", backendImage) 
      }
      let result = await axios.put(`${serverUrl}/api/user/profile`, formData, {withCredentials: true})
      setSaving(false)
      dispatch(setUserData(result.data))
      dispatch(setToast({ message: "Profile updated!", type: "success" }))
      navigate("/")
    } catch (error) {
      console.log(error)
      setSaving(false)
      dispatch(setToast({ message: "Failed to update profile", type: "error" }))
    }
  }

  return (
    <div className='min-h-screen bg-slate-50 flex flex-col justify-center items-center relative overflow-hidden font-sans p-4'>
      {/* Background blobs for continuity */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Back Button */}
      <div 
        className='fixed top-8 left-8 z-50 bg-white shadow-lg rounded-full p-2.5 hover:bg-slate-50 cursor-pointer transition-all hover:scale-105 active:scale-95 border border-slate-100 group' 
        onClick={() => navigate("/")}
      >
        <IoIosArrowRoundBack className='w-8 h-8 text-slate-700 group-hover:text-cyan-600 transition-colors'/>
      </div>

      <div className='w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/50 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-10 flex flex-col items-center relative z-10'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-extrabold text-slate-800 tracking-tight'>Your Profile</h1>
          <p className='text-slate-500 font-medium mt-1'>Update your presence on <span className='text-cyan-600'>chatify</span></p>
        </div>

        {/* Avatar Section */}
        <div 
          className='relative cursor-pointer group mb-10' 
          onClick={() => image.current.click()}
        >
          <div className='w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-xl bg-slate-100 p-1 relative'>
            <img 
              src={frontendImage} 
              alt="Avatar" 
              className='w-full h-full rounded-full object-cover transition-transform duration-500 group-hover:scale-110'
            />
            {/* Overlay on hover */}
            <div className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full'>
               <IoCameraOutline className='text-white w-8 h-8 drop-shadow-md'/>
            </div>
          </div>
          
          <div className='absolute bottom-1 right-1 bg-gradient-to-tr from-cyan-500 to-blue-500 text-white p-2.5 rounded-2xl shadow-lg border-4 border-white transform group-hover:rotate-12 transition-transform'>
            <IoCameraOutline className='w-5 h-5'/>
          </div>
        </div>

        <form className='w-full flex flex-col gap-5' onSubmit={handleProfile}>
          <input type="file" accept='image/*' ref={image} hidden onChange={handleImage}/>
          
          <div className='flex flex-col gap-1.5'>
            <label className='text-xs font-bold text-slate-400 uppercase tracking-widest ml-1'>Display Name</label>
            <input 
              type="text" 
              placeholder="How should we call you?" 
              className='w-full outline-none border border-slate-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 px-5 py-3.5 bg-white/70 rounded-2xl text-slate-700 font-semibold transition-all placeholder:text-slate-400' 
              onChange={(e) => setName(e.target.value)} 
              value={name}
            />
          </div>

          <div className='flex flex-col gap-1.5 opacity-60 cursor-not-allowed'>
            <label className='text-xs font-bold text-slate-400 uppercase tracking-widest ml-1'>Username</label>
            <div className='w-full px-5 py-3.5 bg-slate-100 border border-slate-200 rounded-2xl text-slate-500 font-medium'>
              @{userData?.userName}
            </div>
          </div>

          <div className='flex flex-col gap-1.5 opacity-60 cursor-not-allowed'>
            <label className='text-xs font-bold text-slate-400 uppercase tracking-widest ml-1'>Email Address</label>
            <div className='w-full px-5 py-3.5 bg-slate-100 border border-slate-200 rounded-2xl text-slate-500 font-medium'>
              {userData?.email}
            </div>
          </div>

          <button 
            type="submit"
            className='w-full mt-4 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-2xl font-bold text-lg shadow-[0_10px_20px_rgba(6,182,212,0.2)] hover:shadow-[0_15px_25px_rgba(6,182,212,0.3)] hover:-translate-y-0.5 transition-all active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0' 
            disabled={saving}
          >
            {saving ? (
              <div className='flex items-center justify-center gap-2'>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Saving changes...</span>
              </div>
            ) : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Profile
