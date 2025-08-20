import { useQuery } from '@tanstack/react-query'
import { savingsAPI } from '../../api/savings'
import { useState, useMemo } from 'react'

const SavingsList = () => {
    const { data: savings, isLoading } = useQuery({
        queryKey: ['savings'],
        queryFn: savingsAPI.getAll
    })

    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
    const filteredSavings = useMemo(() => {
        if (!savings?.data) return []
        return savings.data.filter(s => new Date(s.date).getFullYear() === selectedYear)
    }, [savings, selectedYear])

    const { totalWajib, totalPokok } = useMemo(() => {
        const wajib = filteredSavings.filter(s => s.type === 'wajib')
        const pokok = filteredSavings.filter(s => s.type === 'pokok')

        return {
            totalWajib: wajib.reduce((sum, s) => sum + Number(s.amount || 0), 0),
            totalPokok: pokok.reduce((sum, s) => sum + Number(s.amount || 0), 0)
        }
    }, [filteredSavings])

    const yearlyProfit = ((totalWajib * 0.93 * 0.1) / 12) * 0.6

    const availableYears = useMemo(() => {
        if (!savings?.data) return []
        return Array.from(new Set(savings.data.map(s => new Date(s.date).getFullYear())))
            .sort((a, b) => b - a)
    }, [savings])

    const formatRupiah = (amount) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount || 0)

    if (isLoading)
        return <div className="text-center mt-20 text-xl font-semibold">Loading...</div>

    return (
        <div className="p-6 space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-extrabold text-gray-800">Daftar Simpanan</h2>
                <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700">Tahun:</label>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                    >
                        {availableYears.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Kartu Statistik */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white border border-gray-200 shadow-lg rounded-xl p-6 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-700">Simpanan Wajib</h3>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{formatRupiah(totalWajib)}</p>
                    <p className="text-sm text-gray-500 mt-1">Tahun {selectedYear}</p>
                </div>

                {/* Simpanan Pokok */}
                <div className="bg-white border border-gray-200 shadow-lg rounded-xl p-6 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-700">Simpanan Pokok</h3>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{formatRupiah(totalPokok)}</p>
                    <p className="text-sm text-gray-500 mt-1">Tahun {selectedYear}</p>
                </div>

                {/* Total Simpanan */}
                <div className="bg-white border border-gray-200 shadow-lg rounded-xl p-6 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-700">Total Simpanan</h3>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">{formatRupiah(totalWajib + totalPokok)}</p>
                    <p className="text-sm text-gray-500 mt-1">Tahun {selectedYear}</p>
                </div>

                {/* Bagi Hasil */}
                <div className="bg-white border border-gray-200 shadow-lg rounded-xl p-6 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-700">Bagi Hasil Tahunan</h3>
                    </div>
                    <p className="text-2xl font-bold text-orange-600">{formatRupiah(yearlyProfit)}</p>
                    <p className="text-sm text-gray-500 mt-1">Estimasi {selectedYear}</p>
                </div>
            </div>

            {/* Detail Simpanan */}
            <div className="bg-white shadow-lg rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-700">Detail Simpanan ({selectedYear})</h3>
                    <span className="text-sm text-gray-500">Total: {filteredSavings.length} transaksi</span>
                </div>

                {filteredSavings.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        Tidak ada data simpanan untuk tahun {selectedYear}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Bulan/Tahun</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Jenis Simpanan</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Besar Simpanan</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredSavings.map((s) => (
                                    <tr key={s.id} className="hover:bg-gray-50 transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(s.date).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${s.type === 'wajib' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                                {s.type.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-700">{formatRupiah(s.amount)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(s.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-yellow-800 mb-3">Informasi Perhitungan Bagi Hasil</h4>
                <div className="text-sm text-yellow-700 space-y-1">
                    <p>• Rumus: ((Total Simpanan Wajib × 0.93 × 0.1) ÷ 12) × 0.6</p>
                    <p>• Total Simpanan Wajib: {formatRupiah(totalWajib)}</p>
                    <p>• Bagi Hasil Tahunan: {formatRupiah(yearlyProfit)}</p>
                    <p>• Perhitungan ini adalah estimasi dan dapat berubah</p>
                </div>
            </div>
        </div>
    )
}

export default SavingsList
