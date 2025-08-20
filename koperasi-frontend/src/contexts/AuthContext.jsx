import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../api/auth'

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            authAPI.getUser()
                .then(response => {
                    setUser(response.data)
                })
                .catch(() => {
                    localStorage.removeItem('token')
                })
                .finally(() => {
                    setLoading(false)
                })
        } else {
            setLoading(false)
        }
    }, [])

    const login = async (credentials) => {
        try {
            const response = await authAPI.login(credentials)
            const { user, token } = response.data

            localStorage.setItem('token', token)
            setUser(user)

            return { success: true }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            }
        }
    }

    const logout = async () => {
        try {
            await authAPI.logout()
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            localStorage.removeItem('token')
            setUser(null)
        }
    }

    const value = {
        user,
        login,
        logout,
        loading
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}