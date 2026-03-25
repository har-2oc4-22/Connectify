import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearToast } from '../redux/toastSlice'
import { IoCheckmarkCircle, IoCloseCircle, IoInformationCircle } from "react-icons/io5"

function Toast() {
  const { message, type } = useSelector(state => state.toast)
  const dispatch = useDispatch()

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        dispatch(clearToast())
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [message, dispatch])

  if (!message) return null

  const getStyles = () => {
    switch (type) {
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-100',
          text: 'text-red-600',
          icon: <IoCloseCircle className="w-5 h-5" />
        }
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-100',
          text: 'text-blue-600',
          icon: <IoInformationCircle className="w-5 h-5" />
        }
      default:
        return {
          bg: 'bg-green-50',
          border: 'border-green-100',
          text: 'text-green-600',
          icon: <IoCheckmarkCircle className="w-5 h-5" />
        }
    }
  }

  const styles = getStyles()

  return (
    <div className='fixed top-6 right-6 z-[9999] animate-fade-in-up origin-top-right'>
      <div className={`${styles.bg} ${styles.border} ${styles.text} border px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 backdrop-blur-md min-w-[280px]`}>
        <div className="shrink-0">
          {styles.icon}
        </div>
        <p className='font-bold text-sm tracking-tight'>{message}</p>
        <button 
          onClick={() => dispatch(clearToast())}
          className="ml-auto hover:opacity-70 transition-opacity"
        >
          <IoCloseCircle className="w-5 h-5 opacity-40 hover:opacity-100 transition-opacity" />
        </button>
      </div>
    </div>
  )
}

export default Toast
