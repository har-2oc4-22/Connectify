import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from "react-redux"
import { store } from './redux/store.js'
import axios from 'axios'
const rawServerUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
export const serverUrl = rawServerUrl.endsWith('/') ? rawServerUrl.slice(0, -1) : rawServerUrl;

// Global interceptor for adding token
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('chatify_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Provider store={store}>
            <App />
        </Provider>
    </BrowserRouter>

)
