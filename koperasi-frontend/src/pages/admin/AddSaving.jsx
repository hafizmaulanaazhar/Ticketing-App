import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { savingsAPI } from '../../api/savings'

const AddSaving = () => {
    const [formData, setFormData] = useState({
        user_id: '',
        type: 'wajib',
        amount: '',
        date: new Date().toISOString().split('T')[0]
    })

    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: savingsAPI.create,
        onSuccess: () => {
            queryClient.invalidateQueries(['savings'])
            setFormData({
                user_id: '',
                type: 'wajib',
                amount: '',
                date: new Date().toISOString().split('T')[0]
            })
            alert('Simpanan berhasil ditambahkan!')
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
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Tambah Simpanan</h2>
                <p className="text-gray-600">Form untuk menambahkan data simpanan anggota koperasi</p>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-8">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    User ID (Untuk Karyawan ID User dimulai dari 2)
                                </label>
                                <input
                                    type="number"
                                    name="user_id"
                                    value={formData.user_id}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                    placeholder="Masukkan ID User"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">Masukkan ID anggota koperasi</p>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Jenis Simpanan
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                    required
                                >
                                    <option value="wajib">Simpanan Wajib</option>
                                    <option value="pokok">Simpanan Pokok</option>
                                    <option value="sukarela">Simpanan Sukarela</option>
                                </select>
                                <p className="text-xs text-gray-500 mt-1">Pilih jenis simpanan</p>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Besar Simpanan
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-gray-500">Rp</span>
                                    <input
                                        type="text"
                                        name="amount"
                                        value={formData.amount ? new Intl.NumberFormat('id-ID').format(formData.amount) : ''}
                                        onChange={(e) => {
                                            const rawValue = e.target.value.replace(/\D/g, '');
                                            handleChange({
                                                target: {
                                                    name: 'amount',
                                                    value: rawValue === '' ? '' : parseInt(rawValue)
                                                }
                                            });
                                        }}
                                        onFocus={(e) => {
                                            if (formData.amount) {
                                                e.target.value = formData.amount.toString();
                                            }
                                        }}
                                        onBlur={(e) => {
                                            if (formData.amount) {
                                                e.target.value = new Intl.NumberFormat('id-ID').format(formData.amount);
                                            }
                                        }}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                        placeholder="0"
                                        required
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Masukkan jumlah simpanan</p>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Tanggal
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">Tanggal transaksi simpanan</p>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={mutation.isLoading}
                                className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-colors duration-200 ${mutation.isLoading
                                    ? 'bg-blue-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                            >
                                {mutation.isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Menambahkan...
                                    </div>
                                ) : (
                                    'Tambah Simpanan'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {mutation.isSuccess && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="text-green-700 font-medium">Simpanan berhasil ditambahkan!</span>
                    </div>
                </div>
            )}

            {mutation.isError && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                        <span className="text-red-700 font-medium">Terjadi kesalahan. Silakan coba lagi.</span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AddSaving