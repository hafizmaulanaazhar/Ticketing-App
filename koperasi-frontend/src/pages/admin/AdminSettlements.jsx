import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { settlementsAPI } from '../../api/settlements'

const AdminSettlements = () => {
    const queryClient = useQueryClient()
    const [previewImage, setPreviewImage] = useState(null)
    const { data: settlements, isLoading } = useQuery({
        queryKey: ['settlements'],
        queryFn: settlementsAPI.getAll
    })

    const approveMutation = useMutation({
        mutationFn: settlementsAPI.approve,
        onSuccess: () => {
            queryClient.invalidateQueries(['settlements'])
        }
    })

    const rejectMutation = useMutation({
        mutationFn: settlementsAPI.reject,
        onSuccess: () => {
            queryClient.invalidateQueries(['settlements'])
        }
    })

    // Fungsi untuk menangani preview gambar
    const handlePreview = (proofPath) => {
        // Gunakan URL lengkap ke API
        const imageUrl = `http://localhost:8000/storage/${proofPath}`
        setPreviewImage(imageUrl)
    }

    const getStatusBadge = (status) => {
        const statusConfig = {
            applied: {
                class: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                text: 'Menunggu'
            },
            approved: {
                class: 'bg-green-100 text-green-800 border-green-200',
                text: 'Disetujui'
            },
            rejected: {
                class: 'bg-red-100 text-red-800 border-red-200',
                text: 'Ditolak'
            }
        }

        const config = statusConfig[status] || statusConfig.applied

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${config.class}`}>
                {config.text}
            </span>
        )
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount)
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })
    }

    if (isLoading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    )

    return (
        <div className="max-w-7xl mx-auto">
            {/* Modal Preview Gambar */}
            {previewImage && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl max-h-full overflow-auto">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-lg font-semibold">Preview Bukti Transfer</h3>
                            <button
                                onClick={() => setPreviewImage(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-4">
                            <img
                                src={previewImage}
                                alt="Bukti Transfer"
                                className="w-full h-auto rounded"
                                onError={(e) => {
                                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjNmMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkeT0iLjM1ZW0iIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiPkJ1a3RpIHRpZGFrIGJlcmFkYTwvdGV4dD48L3N2Zz4='
                                }}
                            />
                        </div>
                        <div className="p-4 border-t">
                            <a
                                href={previewImage}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary w-full"
                            >
                                Buka di Tab Baru
                            </a>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Data Pelunasan</h2>
                <div className="text-sm text-gray-600">
                    Total Data: <span className="font-semibold">{settlements?.data?.length || 0}</span>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-gray-200">
                <div className="p-6">
                    {settlements?.data?.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-600 mb-2">Belum ada pelunasan</h3>
                            <p className="text-gray-500">Tidak ada data pelunasan yang ditemukan.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Tanggal</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Karyawan</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Jumlah</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Bukti</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {settlements?.data?.map((settlement) => (
                                        <tr key={settlement.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">
                                                {formatDate(settlement.settlement_date)}
                                            </td>
                                            <td className="px-6 py-4 border-b border-gray-200">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-8 w-8">
                                                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                                                            {settlement.loan?.user?.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                    </div>
                                                    <div className="ml-3">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {settlement.loan?.user?.name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm border-b border-gray-200">
                                                <div className="text-sm font-semibold text-blue-600">
                                                    {formatCurrency(settlement.loan?.amount)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm border-b border-gray-200">
                                                {settlement.proof && (
                                                    <button
                                                        onClick={() => handlePreview(settlement.proof)}
                                                        className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700 transition-colors"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                        Lihat Bukti
                                                    </button>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm border-b border-gray-200">
                                                {getStatusBadge(settlement.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm border-b border-gray-200">
                                                {settlement.status === 'applied' && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            className="px-3 py-1 bg-green-600 text-white rounded-md text-xs font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                            onClick={() => approveMutation.mutate(settlement.id)}
                                                            disabled={approveMutation.isLoading}
                                                        >
                                                            {approveMutation.isLoading ? (
                                                                <span className="loading loading-spinner loading-xs"></span>
                                                            ) : (
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            )}
                                                            Approve
                                                        </button>
                                                        <button
                                                            className="px-3 py-1 bg-red-600 text-white rounded-md text-xs font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                            onClick={() => rejectMutation.mutate(settlement.id)}
                                                            disabled={rejectMutation.isLoading}
                                                        >
                                                            {rejectMutation.isLoading ? (
                                                                <span className="loading loading-spinner loading-xs"></span>
                                                            ) : (
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                            )}
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AdminSettlements