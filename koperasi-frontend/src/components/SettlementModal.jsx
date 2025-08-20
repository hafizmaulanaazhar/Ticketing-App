import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { settlementsAPI } from '../api/settlements'

const SettlementModal = ({ loan, onClose }) => {
    const [formData, setFormData] = useState({
        settlement_date: new Date().toISOString().split('T')[0],
        proof: null
    })
    const [preview, setPreview] = useState(null)

    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: (data) => settlementsAPI.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['loans'])
            onClose()
            alert('Pengajuan pelunasan berhasil dikirim!')
        },
        onError: (err) => {
            alert('Gagal mengajukan pelunasan: ' + err.message)
        }
    })

    const formatRupiah = (amount) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount || 0)


    const handleSubmit = (e) => {
        e.preventDefault()
        const data = new FormData()
        data.append('loan_id', loan.id)
        data.append('settlement_date', formData.settlement_date)
        data.append('proof', formData.proof)
        mutation.mutate(data)
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        setFormData({ ...formData, proof: file })

        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onloadend = () => setPreview(reader.result)
            reader.readAsDataURL(file)
        } else {
            setPreview(null)
        }
    }

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                    Ajukan Pelunasan
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6">
                    <p><span className="font-medium">Jumlah:</span> {formatRupiah(loan.amount)}</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="flex flex-col">
                        <label className="font-medium text-gray-700 mb-1">Tanggal Pelunasan</label>
                        <input
                            type="date"
                            value={formData.settlement_date}
                            onChange={(e) =>
                                setFormData({ ...formData, settlement_date: e.target.value })
                            }
                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-medium text-gray-700 mb-1">Bukti Transfer</label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="border border-gray-300 rounded-md px-3 py-2"
                            accept="image/*,.pdf"
                            required
                        />
                        {preview && (
                            <img
                                src={preview}
                                alt="Preview"
                                className="mt-2 w-32 h-32 object-contain border rounded-lg shadow-sm"
                            />
                        )}
                    </div>

                    <div className="flex justify-end space-x-3 mt-4">
                        <button
                            type="button"
                            className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition"
                            onClick={onClose}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 rounded-md bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition"
                            disabled={mutation.isLoading}
                        >
                            {mutation.isLoading && (
                                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 mr-2"></span>
                            )}
                            {mutation.isLoading ? 'Mengajukan...' : 'Ajukan Pelunasan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SettlementModal
