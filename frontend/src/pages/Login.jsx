import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../main'
import { useDispatch } from 'react-redux'
import { setSelectedUser, setUserData } from '../redux/userSlice'
import { setToast } from '../redux/toastSlice'

function Login() {
    let navigate = useNavigate()
    let [show, setShow] = useState(false)
    let [email, setEmail] = useState("")
    let [password, setPassword] = useState("")
    let [loading, setLoading] = useState(false)
    let [err, setErr] = useState("")
    let dispatch = useDispatch()

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            let result = await axios.post(`${serverUrl}/api/auth/login`, { email, password }, { withCredentials: true })
            if (result.data.token) {
                localStorage.setItem('chatify_token', result.data.token);
            }
            dispatch(setUserData(result.data))
            dispatch(setSelectedUser(null))
            dispatch(setToast({ message: "Welcome back! 👋", type: "success" }))
            navigate("/")
            setEmail(""); setPassword(""); setLoading(false); setErr("")
        } catch (error) {
            setLoading(false)
            const message = error?.response?.data?.message || "Login failed"
            setErr(message)
            dispatch(setToast({ message, type: "error" }))
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center relative overflow-hidden font-sans w-full' style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}>
            {/* Glowing orbs */}
            <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-20 animate-pulse" style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)' }}></div>
            <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-20 animate-pulse" style={{ background: 'radial-gradient(circle, #06b6d4, transparent 70%)', animationDelay: '2s' }}></div>
            <div className="absolute top-[40%] left-[55%] w-[350px] h-[350px] rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #ec4899, transparent 70%)' }}></div>

            <div className='w-full max-w-[440px] mx-4 relative z-10' style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '2rem', padding: '2.5rem', boxShadow: '0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)' }}>

                {/* Logo & Title */}
                <div className='text-center mb-8'>
                    <div className='inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-5' style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: '0 0 40px rgba(124,58,237,0.5)' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <h1 className='text-white font-extrabold text-3xl tracking-tight'>Welcome Back</h1>
                    <p className='font-medium mt-2' style={{ color: 'rgba(255,255,255,0.5)' }}>Login to <span className='font-bold' style={{ background: 'linear-gradient(90deg, #7c3aed, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Chatify</span></p>
                </div>

                <form className='flex flex-col gap-5' onSubmit={handleLogin}>
                    <div className='flex flex-col gap-2'>
                        <label className='text-sm font-semibold' style={{ color: 'rgba(255,255,255,0.6)' }}>Email Address</label>
                        <input
                            type="email"
                            placeholder='john@example.com'
                            className='w-full outline-none px-5 py-3.5 text-white font-medium rounded-xl transition-all placeholder:text-white/30'
                            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)' }}
                            onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.7)'}
                            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                            onChange={e => setEmail(e.target.value)}
                            value={email} required
                        />
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label className='text-sm font-semibold' style={{ color: 'rgba(255,255,255,0.6)' }}>Password</label>
                        <div className='relative'>
                            <input
                                type={show ? "text" : "password"}
                                placeholder='••••••••'
                                className='w-full outline-none px-5 py-3.5 text-white font-medium rounded-xl transition-all placeholder:text-white/30 pr-20'
                                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)' }}
                                onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.7)'}
                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                                onChange={e => setPassword(e.target.value)}
                                value={password} required
                            />
                            <button type="button" className='absolute top-1/2 right-4 -translate-y-1/2 text-sm font-bold' style={{ color: '#7c3aed' }} onClick={() => setShow(p => !p)}>
                                {show ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    {err && <div className='p-3 rounded-xl text-sm font-semibold' style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}>⚠️ {err}</div>}

                    <button
                        className='w-full mt-2 py-4 text-white rounded-xl font-extrabold text-lg transition-all disabled:opacity-60'
                        style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: loading ? 'none' : '0 0 30px rgba(124,58,237,0.4)', transform: loading ? 'scale(0.99)' : 'scale(1)' }}
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign in →"}
                    </button>

                    <p className='text-center text-sm font-medium' style={{ color: 'rgba(255,255,255,0.4)' }}>
                        Don't have an account?{' '}
                        <span className='font-bold cursor-pointer' style={{ color: '#7c3aed' }} onClick={() => navigate("/signup")}>
                            Sign up free
                        </span>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Login
