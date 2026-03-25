import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../main'
import { useDispatch } from 'react-redux'
import { setSelectedUser, setUserData } from '../redux/userSlice'
import { setToast } from '../redux/toastSlice'

function Login() {
    let navigate=useNavigate()
    let [show,setShow]=useState(false)
    let [email,setEmail]=useState("")
    let [password,setPassword]=useState("")
    let [loading,setLoading]=useState(false)
    let [err,setErr]=useState("")
    let dispatch=useDispatch()
    
    const handleLogin=async (e)=>{
        e.preventDefault()
        setLoading(true)
        try {
            let result =await axios.post(`${serverUrl}/api/auth/login`,{
                email,password
            },{withCredentials:true})
            dispatch(setUserData(result.data))
            dispatch(setSelectedUser(null))
            dispatch(setToast({ message: "Welcome back!", type: "success" }))
            navigate("/")
            setEmail("")
            setPassword("")
            setLoading(false)
            setErr("")
        } catch (error) {
            console.log(error)
            setLoading(false)
            const message = error?.response?.data?.message || "Login failed"
            setErr(message)
            dispatch(setToast({ message, type: "error" }))
        }
    }
    
  return (
    <div className='min-h-screen bg-slate-50 flex items-center justify-center relative overflow-hidden font-sans w-full'>
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-300 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-300 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] bg-purple-300 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-pulse" style={{ animationDelay: '4s' }}></div>

      <div className='w-full max-w-[440px] bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-10 flex flex-col items-center relative z-10 mx-4'>
        
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/30 mb-4'>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h1 className='text-gray-800 font-extrabold text-3xl tracking-tight'>Welcome Back</h1>
          <p className='text-gray-500 font-medium mt-2'>Login to <span className='text-cyan-600 font-bold'>chatify</span></p>
        </div>

        <form className='w-full flex flex-col gap-5' onSubmit={handleLogin}>
          
          <div className='flex flex-col gap-1'>
            <label className='text-sm font-semibold text-gray-600 ml-1'>Email Address</label>
            <input 
              type="email" 
              placeholder='john@example.com' 
              className='w-full outline-none border border-gray-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 px-4 py-3.5 bg-white/70 rounded-xl text-gray-700 font-medium transition-all placeholder:text-gray-400' 
              onChange={(e)=>setEmail(e.target.value)} 
              value={email}
              required
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-sm font-semibold text-gray-600 ml-1'>Password</label>
            <div className='w-full relative'>
              <input 
                type={`${show?"text":"password"}`} 
                placeholder='••••••••' 
                className='w-full outline-none border border-gray-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 px-4 py-3.5 bg-white/70 rounded-xl text-gray-700 font-medium transition-all placeholder:text-gray-400' 
                onChange={(e)=>setPassword(e.target.value)} 
                value={password}
                required
              />
              <button 
                type="button"
                className='absolute top-1/2 right-4 -translate-y-1/2 text-sm text-cyan-600 font-semibold hover:text-cyan-800 transition-colors' 
                onClick={()=>setShow(prev=>!prev)}
              >
                {show ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {err && <div className='p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium animate-pulse'>{"*" + err}</div>}
          
          <button 
            className='w-full mt-2 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl font-bold text-lg shadow-[0_4px_14px_0_rgba(6,182,212,0.39)] hover:shadow-[0_6px_20px_rgba(6,182,212,0.23)] hover:-translate-y-[1px] transition-all disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed' 
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
          
          <p className='text-center text-gray-500 text-sm font-medium mt-4'>
            Don't have an account?{' '}
            <span 
              className='text-cyan-600 font-bold cursor-pointer hover:underline decoration-2 underline-offset-4 transition-all' 
              onClick={()=>navigate("/signup")}
            >
              Sign up
            </span>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
