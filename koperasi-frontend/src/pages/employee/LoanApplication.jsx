import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { loansAPI } from '../../api/loans'

const LoanApplication = () => {
    const [formData, setFormData] = useState({
        application_date: new Date().toISOString().split('T')[0],
        amount: '',
        phone: '',
        address: ''
    })

    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: loansAPI.create,
        onSuccess: () => {
            queryClient.invalidateQueries(['loans'])
            setFormData({
                application_date: new Date().toISOString().split('T')[0],
                amount: '',
                phone: '',
                address: ''
            })
            alert('Pinjaman berhasil diajukan!')
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        mutation.mutate(formData)
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Ajukan Pinjaman</h2>
                <p className="text-gray-600">Isi formulir di bawah ini untuk mengajukan pinjaman baru</p>
            </div>

            <div className="card bg-base-100 shadow-xl border border-gray-100">
                <div className="card-body p-6 md:p-8">
                    <div className="flex items-center mb-6 p-4 bg-blue-50 rounded-lg">
                        <div>
                            <h3 className="font-semibold text-blue-800">Informasi Pinjaman</h3>
                            <p className="text-sm text-blue-600">Pastikan data yang Anda isi sudah benar</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold text-gray-700">Tanggal Pengajuan</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </span>
                                    <input
                                        type="date"
                                        name="application_date"
                                        value={formData.application_date}
                                        onChange={handleChange}
                                        className="input input-bordered w-full pl-10 py-3"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold text-gray-700">Besar Pinjaman (Rp)</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </span>
                                    <input
                                        type="number"
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        className="input input-bordered w-full pl-10 py-3"
                                        placeholder="Contoh: 5000000"
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold text-gray-700">No Telepon</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </span>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="input input-bordered w-full pl-10 py-3"
                                        placeholder="081234567890"
                                        pattern="[0-9]{10,13}"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-control md:col-span-2">
                                <label className="label">
                                    <span className="label-text font-semibold text-gray-700">Alamat Lengkap</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute top-3 left-3 text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </span>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="textarea textarea-bordered w-full max-w-md pl-10 py-2 h-10"
                                        placeholder="Masukkan alamat lengkap Anda"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center mt-8 pt-6 border-t border-gray-100">
                            <>
                                <button
                                    type="submit"
                                    className="btn bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-none px-8 py-3 text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                                    disabled={mutation.isLoading}
                                >
                                    {mutation.isLoading ? (
                                        <>
                                            <span className="loading loading-spinner loading-md mr-2"></span>
                                            Sedang Mengajukan...
                                        </>
                                    ) : (
                                        "Ajukan Pinjaman"
                                    )}
                                </button>
                            </>
                        </div>
                    </form>
                </div>
            </div>

            {mutation.isError && (
                <div className="mt-6 alert alert-error shadow-lg">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Terjadi kesalahan saat mengajukan pinjaman. Silakan coba lagi.</span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default LoanApplication