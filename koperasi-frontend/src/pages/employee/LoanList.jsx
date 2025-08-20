import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { loansAPI } from '../../api/loans'
import SettlementModal from '../../components/SettlementModal'

const LoanList = () => {
    const [selectedLoan, setSelectedLoan] = useState(null)
    const { data: loans, isLoading } = useQuery({
        queryKey: ['loans'],
        queryFn: loansAPI.getAll
    })

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
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${config.class}`}>
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
            month: 'long',
            year: 'numeric'
        })
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto p-4">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Daftar Pinjaman</h2>
                <p className="text-gray-600">Lihat status dan kelola pinjaman Anda</p>
            </div>

            <div className="card bg-white shadow-xl rounded-lg border border-gray-100">
                <div className="card-body p-6">
                    {loans?.data?.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-600 mb-2">Belum ada pinjaman</h3>
                            <p className="text-gray-500">Anda belum mengajukan pinjaman apapun.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Pengajuan</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Besar Pinjaman</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {loans?.data?.map((loan) => (
                                        <tr key={loan.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {formatDate(loan.application_date)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-blue-600">
                                                    {formatCurrency(loan.amount)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(loan.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {loan.status === 'approved' && (
                                                    loan.settlement?.status === 'approved' ? (
                                                        <span className="px-3 py-1 rounded-lg bg-gray-200 text-gray-700 text-sm font-medium">
                                                            Lunas
                                                        </span>
                                                    ) : (
                                                        <button
                                                            className="btn bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                                                            onClick={() => setSelectedLoan(loan)}
                                                        >
                                                            Lunasi
                                                        </button>
                                                    )
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

            {selectedLoan && (
                <SettlementModal
                    loan={selectedLoan}
                    onClose={() => setSelectedLoan(null)}
                />
            )}
        </div>
    )
}

export default LoanList