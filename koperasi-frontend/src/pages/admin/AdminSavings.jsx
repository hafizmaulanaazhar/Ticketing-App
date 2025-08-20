import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { savingsAPI } from '../../api/savings'

const AdminSavings = () => {
    const queryClient = useQueryClient()
    const { data: savings, isLoading } = useQuery({
        queryKey: ['savings'],
        queryFn: savingsAPI.getAll
    })

    const deleteMutation = useMutation({
        mutationFn: savingsAPI.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(['savings'])
        }
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => savingsAPI.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['savings'])
            setEditingSaving(null)
            alert('Simpanan berhasil diperbarui!')
        },
        onError: (error) => {
            alert('Terjadi kesalahan saat memperbarui simpanan.')
            console.error(error)
        }
    })

    const [editingSaving, setEditingSaving] = useState(null)

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount)
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long'
        })
    }

    const getTypeBadge = (type) => {
        const typeConfig = {
            wajib: { class: 'bg-blue-100 text-blue-800 border-blue-200', text: 'Wajib' },
            pokok: { class: 'bg-purple-100 text-purple-800 border-purple-200', text: 'Pokok' }
        }
        const config = typeConfig[type] || typeConfig.wajib
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${config.class}`}>
                {config.text}
            </span>
        )
    }

    const handleEditClick = (saving) => setEditingSaving(saving)

    const handleUpdate = (e) => {
        e.preventDefault()
        updateMutation.mutate({
            id: editingSaving.id,
            data: {
                user_id: editingSaving.user_id,
                type: editingSaving.type,
                amount: editingSaving.amount,
                date: editingSaving.date
            }
        })
    }

    if (isLoading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    )

    return (
        <div className="max-w-7xl mx-auto">
            {/* Tabel Simpanan */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Daftar Simpanan</h2>
                <div className="text-sm text-gray-600">
                    Total Data: <span className="font-semibold">{savings?.data?.length || 0}</span>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-gray-200">
                <div className="p-6">
                    {savings?.data?.length === 0 ? (
                        <div className="text-center py-12">
                            <h3 className="text-lg font-medium text-gray-600 mb-2">Belum ada simpanan</h3>
                            <p className="text-gray-500">Tidak ada data simpanan yang ditemukan.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Bulan</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Karyawan</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Jenis</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Jumlah</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {savings?.data?.map((saving) => (
                                        <tr key={saving.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">{formatDate(saving.date)}</td>
                                            <td className="px-6 py-4 border-b border-gray-200">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-8 w-8">
                                                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                                                            {saving.user?.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                    </div>
                                                    <div className="ml-3">
                                                        <div className="text-sm font-medium text-gray-900">{saving.user?.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm border-b border-gray-200">{getTypeBadge(saving.type)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm border-b border-gray-200">
                                                <div className="text-sm font-semibold text-green-600">{formatCurrency(saving.amount)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm border-b border-gray-200">
                                                <div className="flex gap-2">
                                                    <button
                                                        className="px-3 py-1 bg-yellow-600 text-white rounded-md text-xs font-medium hover:bg-yellow-700 transition-colors"
                                                        onClick={() => handleEditClick(saving)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="px-3 py-1 bg-red-600 text-white rounded-md text-xs font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        onClick={() => {
                                                            if (confirm('Apakah Anda yakin ingin menghapus simpanan ini?')) {
                                                                deleteMutation.mutate(saving.id)
                                                            }
                                                        }}
                                                        disabled={deleteMutation.isLoading}
                                                    >
                                                        {deleteMutation.isLoading ? '...' : 'Hapus'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Edit */}
            {editingSaving && (
                <div className="fixed inset-0 bg-blur bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-96 shadow-lg border border-gray-200">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">Edit Simpanan</h3>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700">Jenis Simpanan</label>
                            <select
                                value={editingSaving.type}
                                onChange={(e) => setEditingSaving({ ...editingSaving, type: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                                required
                            >
                                <option value="wajib">Wajib</option>
                                <option value="pokok">Pokok</option>
                                <option value="sukarela">Sukarela</option>
                            </select>

                            <label className="block text-sm font-medium text-gray-700">Jumlah</label>
                            <input
                                type="text"
                                value={editingSaving.amount ? new Intl.NumberFormat('id-ID').format(editingSaving.amount) : ''}
                                onChange={(e) => {
                                    const numericValue = e.target.value.replace(/\D/g, '')
                                    setEditingSaving({ ...editingSaving, amount: numericValue ? parseInt(numericValue) : '' })
                                }}
                                placeholder="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                                required
                            />

                            <label className="block text-sm font-medium text-gray-700">Tanggal</label>
                            <input
                                type="date"
                                value={editingSaving.date?.split('T')[0] || new Date().toISOString().split('T')[0]}
                                onChange={(e) => setEditingSaving({ ...editingSaving, date: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                                required
                            />

                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                                    onClick={() => setEditingSaving(null)}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            )}
        </div>
    )
}

export default AdminSavings
