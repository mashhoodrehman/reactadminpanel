import React, { createContext, useState, useContext, useEffect } from 'react'
import * as authService from '../services/authService'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setUser({ token })
    }
    setLoading(false)
  }, [])

  const register = async (username, email, roleId, password, confirmPassword) => {
    try {
      const data = await authService.register(username, email, roleId, password, confirmPassword)
      localStorage.setItem('token', data.token)
      setUser({ token: data.token })
      navigate('/dashboard')
      return data
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  const login = async (country_code , phone, password) => {
    try {
      const data = await authService.login(country_code , phone, password)
      console.log(data ,'data')
      const token = data?.data?.token
      const userDetails = data?.data?.data

      if (token) {
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(data?.data));
        setUser({ token, ...userDetails })
      } else {
        throw new Error('Invalid response from server')
      }

      return data
    } catch (error) {
      console.error('Login failed:', error)
      // toast.error(error.message || "Login failed");
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user'); // Remove user details
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
