import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const result = await login(credentials)
        if (result.success) {
            navigate('/')
        } else {
            setError(result.message)
        }

        setLoading(false)
    }

    const handleInputChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    const fillDemoCredentials = (role) => {
        if (role === 'admin') {
            setCredentials({ email: 'admin@koperasi.com', password: 'password' })
        } else {
            setCredentials({ email: 'karyawan@koperasi.com', password: 'password' })
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    Login
                </h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={credentials.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            placeholder="Masukan Email"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            placeholder="Masukan Password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="text-center my-4 text-gray-400 font-medium">OR</div>

                <div className="flex gap-4">
                    <button
                        className="flex-1 border border-blue-500 text-blue-500 py-2 rounded-lg font-semibold hover:bg-blue-50 transition duration-200"
                        onClick={() => fillDemoCredentials('admin')}
                    >
                        Admin Demo
                    </button>
                    <button
                        className="flex-1 border border-green-500 text-green-500 py-2 rounded-lg font-semibold hover:bg-green-50 transition duration-200"
                        onClick={() => fillDemoCredentials('karyawan')}
                    >
                        Karyawan Demo
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Login
