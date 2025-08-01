import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './context/AuthProvider'
import UserProvider from './context/UserProvider'
createRoot(document.getElementById('root')).render(

  <AuthProvider>
    <UserProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    </UserProvider>
  </AuthProvider>

)
