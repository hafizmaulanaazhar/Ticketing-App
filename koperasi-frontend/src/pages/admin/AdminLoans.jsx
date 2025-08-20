import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { loansAPI } from '../../api/loans'

const AdminLoans = () => {
    const queryClient = useQueryClient()
    const { data: loans, isLoading } = useQuery({
        queryKey: ['loans'],
        queryFn: loansAPI.getAll
    })

    const approveMutation = useMutation({
        mutationFn: loansAPI.approve,
        onSuccess: () => {
            queryClient.invalidateQueries(['loans'])
        }
    })

    const rejectMutation = useMutation({
        mutationFn: loansAPI.reject,
        onSuccess: () => {
            queryClient.invalidateQueries(['loans'])
        }
    })

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number)
    }

    const getStatusBadge = (status) => {
        const statusClasses = {
            applied: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            approved: 'bg-green-100 text-green-800 border-green-200',
            rejected: 'bg-red-100 text-red-800 border-red-200'
        }

        const statusText = {
            applied: 'Menunggu',
            approved: 'Disetujui',
            rejected: 'Ditolak'
        }

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusClasses[status]}`}>
                {statusText[status]}
            </span>
        )
    }

    if (isLoading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    )

    return (
        <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Data Pinjaman</h2>

            <div className="bg-white rounded-lg shadow-md border border-gray-200">
                <div className="p-6">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Tanggal Pengajuan</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Nama Karyawan</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Besar Pinjaman</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">No Telepon</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Alamat</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loans?.data?.map((loan) => (
                                    <tr key={loan.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">
                                            {new Date(loan.application_date).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-b border-gray-200">
                                            {loan.user?.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">
                                            {formatRupiah(loan.amount)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">
                                            {loan.phone}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 border-b border-gray-200 max-w-xs truncate">
                                            {loan.address}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm border-b border-gray-200">
                                            {getStatusBadge(loan.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm border-b border-gray-200">
                                            {loan.status === 'applied' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        className="px-3 py-1 bg-green-600 text-white rounded-md text-xs font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        onClick={() => approveMutation.mutate(loan.id)}
                                                        disabled={approveMutation.isLoading}
                                                    >
                                                        {approveMutation.isLoading ? '...' : 'Approve'}
                                                    </button>
                                                    <button
                                                        className="px-3 py-1 bg-red-600 text-white rounded-md text-xs font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        onClick={() => rejectMutation.mutate(loan.id)}
                                                        disabled={rejectMutation.isLoading}
                                                    >
                                                        {rejectMutation.isLoading ? '...' : 'Reject'}
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminLoans