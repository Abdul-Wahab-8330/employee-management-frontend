import { Navigate, Route, Routes } from 'react-router-dom'
import AuthLayout from './components/auth-view/AuthLayout'
import AuthLogin from './components/auth-view/Login'
import AdminLayout from './components/admin-view/AdminLayout'
import AdminDashboard from './components/admin-view/Dashboard'
import AuthSignup from './components/auth-view/Signup'
import EmpLayout from './components/emp-view/EmpLayout'
import EmpHome from './components/emp-view/Home'
import NotFound from './components/not-found/NotFound'
import UnauthPage from './components/unauth-page/UnauthPage'
import CheckAuth from './authentication/CheckAuth'
import { useContext, useEffect, useState } from 'react'
import { authContext } from './context/AuthProvider'
import { Toaster } from 'react-hot-toast';


function App() {
  const {isAuthenticated, user} = useContext(authContext)

  return (
    <>
      <Routes>
        <Route path='/' element={<Navigate to="/auth/login" replace />} />

        <Route path='/auth' element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AuthLayout />
          </CheckAuth>
        }>
          <Route path='login' element={<AuthLogin />} />
        </Route >
        <Route path='/admin' element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AdminLayout />
          </CheckAuth>
        }>
          <Route path='dashboard' element={<AdminDashboard />} />
          <Route path='signup' element={<AuthSignup />} />
        </Route >
        <Route path='/employee' element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <EmpLayout />
          </CheckAuth>
        }>
          <Route path='home' element={<EmpHome />} />
        </Route >

        <Route path='*' element={<NotFound />} />
        <Route path='/unauth-page' element={<UnauthPage />} />
      </Routes>
      <Toaster position="top-right" reverseOrder={false} />

    </>
  )
}

export default App
