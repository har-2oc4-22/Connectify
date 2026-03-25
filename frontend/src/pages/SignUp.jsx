import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../main'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'
import { setToast } from '../redux/toastSlice'

function SignUp() {
    let navigate = useNavigate()
    let [show, setShow] = useState(false)
    let [userName, setUserName] = useState("")
    let [email, setEmail] = useState("")
    let [password, setPassword] = useState("")
    let [loading, setLoading] = useState(false)
    let [err, setErr] = useState("")
    let dispatch = useDispatch()

    const handleSignUp = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            let result = await axios.post(`${serverUrl}/api/auth/signup`, { userName, email, password }, { withCredentials: true })
            if (result.data.token) {
                localStorage.setItem('chatify_token', result.data.token);
            }
            dispatch(setUserData(result.data))
            dispatch(setToast({ message: "Account created! ✨", type: "success" }))
            navigate("/profile")
            setEmail(""); setPassword(""); setLoading(false); setErr("")
        } catch (error) {
            setLoading(false)
            const message = error?.response?.data?.message || "Registration failed"
            setErr(message)
            dispatch(setToast({ message, type: "error" }))
        }
    }

    const inputStyle = {
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)'
    }

    return (
        <div className='min-h-screen flex items-center justify-center relative overflow-hidden font-sans w-full' style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}>
            <div className="absolute top-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-20 animate-pulse" style={{ background: 'radial-gradient(circle, #06b6d4, transparent 70%)' }}></div>
            <div className="absolute bottom-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-20 animate-pulse" style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)', animationDelay: '2s' }}></div>
            <div className="absolute top-[30%] right-[55%] w-[350px] h-[350px] rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #ec4899, transparent 70%)' }}></div>

            <div className='w-full max-w-[440px] mx-4 relative z-10' style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '2rem', padding: '2.5rem', boxShadow: '0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)' }}>
                <div className='text-center mb-8'>
                    <div className='inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-5' style={{ background: 'linear-gradient(135deg, #06b6d4, #7c3aed)', boxShadow: '0 0 40px rgba(6,182,212,0.5)' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h1 className='text-white font-extrabold text-3xl tracking-tight'>Create Account</h1>
                    <p className='font-medium mt-2' style={{ color: 'rgba(255,255,255,0.5)' }}>Join <span className='font-bold' style={{ background: 'linear-gradient(90deg, #06b6d4, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Chatify</span> today</p>
                </div>

                <form className='flex flex-col gap-4' onSubmit={handleSignUp}>
                    {[
                        { label: 'Username', type: 'text', placeholder: 'johndoe', val: userName, set: setUserName },
                        { label: 'Email Address', type: 'email', placeholder: 'john@example.com', val: email, set: setEmail },
                    ].map(({ label, type, placeholder, val, set }) => (
                        <div key={label} className='flex flex-col gap-2'>
                            <label className='text-sm font-semibold' style={{ color: 'rgba(255,255,255,0.6)' }}>{label}</label>
                            <input
                                type={type} placeholder={placeholder}
                                className='w-full outline-none px-5 py-3.5 text-white font-medium rounded-xl transition-all placeholder:text-white/30'
                                style={inputStyle}
                                onFocus={e => e.target.style.borderColor = 'rgba(6,182,212,0.7)'}
                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                                onChange={e => set(e.target.value)} value={val} required
                            />
                        </div>
                    ))}

                    <div className='flex flex-col gap-2'>
                        <label className='text-sm font-semibold' style={{ color: 'rgba(255,255,255,0.6)' }}>Password</label>
                        <div className='relative'>
                            <input
                                type={show ? "text" : "password"} placeholder='••••••••'
                                className='w-full outline-none px-5 py-3.5 text-white font-medium rounded-xl transition-all placeholder:text-white/30 pr-20'
                                style={inputStyle}
                                onFocus={e => e.target.style.borderColor = 'rgba(6,182,212,0.7)'}
                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                                onChange={e => setPassword(e.target.value)} value={password} required
                            />
                            <button type="button" className='absolute top-1/2 right-4 -translate-y-1/2 text-sm font-bold' style={{ color: '#06b6d4' }} onClick={() => setShow(p => !p)}>
                                {show ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    {err && <div className='p-3 rounded-xl text-sm font-semibold' style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}>⚠️ {err}</div>}

                    <button
                        className='w-full mt-2 py-4 text-white rounded-xl font-extrabold text-lg transition-all disabled:opacity-60'
                        style={{ background: 'linear-gradient(135deg, #06b6d4, #7c3aed)', boxShadow: loading ? 'none' : '0 0 30px rgba(6,182,212,0.4)' }}
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create Account →"}
                    </button>

                    <p className='text-center text-sm font-medium' style={{ color: 'rgba(255,255,255,0.4)' }}>
                        Already have an account?{' '}
                        <span className='font-bold cursor-pointer' style={{ color: '#06b6d4' }} onClick={() => navigate("/login")}>Log in</span>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default SignUp
