import { Routes, Route } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Layout/Navbar'
import Sidebar from '../components/Layout/Sidebar'
import LoanApplication from './employee/LoanApplication'
import LoanList from './employee/LoanList'
import SavingsList from './employee/SavingsList'
import AdminLoans from './admin/AdminLoans'
import AdminSettlements from './admin/AdminSettlements'
import AdminSavings from './admin/AdminSavings'
import AddSaving from './admin/AddSaving'

const Dashboard = () => {
    const { user } = useAuth()

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1">
                <Navbar />
                <main className="p-6">
                    <Routes>
                        {/* Routes untuk Admin */}
                        {user?.role === 'admin' && (
                            <>
                                <Route path="/" element={<AdminLoans />} />
                                <Route path="/loans" element={<AdminLoans />} />
                                <Route path="/settlements" element={<AdminSettlements />} />
                                <Route path="/savings" element={<AdminSavings />} />
                                <Route path="/add-saving" element={<AddSaving />} />
                            </>
                        )}

                        {/* Routes untuk Karyawan */}
                        {user?.role === 'karyawan' && (
                            <>
                                <Route path="/" element={<LoanApplication />} />
                                <Route path="/loans" element={<LoanList />} />
                                <Route path="/savings" element={<SavingsList />} />
                            </>
                        )}
                    </Routes>
                </main>
            </div>
        </div>
    )
}

export default Dashboard