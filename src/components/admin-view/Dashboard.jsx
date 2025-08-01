import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BarChart2, Users, Settings, LayoutDashboard, ArrowRight, MoveRightIcon } from 'lucide-react';
import toast from 'react-hot-toast';

function AdminDashboard() {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate('/admin/signup');
        toast.success('Welcome to Admin Dashboard')
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1f1b2e] via-[#2a223d] to-[#3a2b58] text-white p-8 flex flex-col items-center justify-center">
            <div className="max-w-5xl w-full space-y-10">
                {/* Welcome Message */}
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-bold text-purple-400 drop-shadow-md">
                        Welcome to the Admin Panel
                    </h1>
                    <p className="text-lg text-gray-300">
                        Manage employees, assign tasks, and monitor performance with ease.
                    </p>
                </div>

                {/* Dashboard Image */}
                <div className="rounded-2xl overflow-hidden border border-purple-500 shadow-lg">
                    <img
                        src="https://img.freepik.com/premium-photo/fund-managers-team-consultation-discuss-about-analysis-investment-stock-market-office_265022-104085.jpg"
                        alt="Admin Dashboard"
                        className="w-full h-[300px] object-cover"
                    />
                </div>

                <div className="flex justify-center items-center">
                    <button
                        onClick={handleNavigate}
                        className="bg-purple-600 hover:bg-purple-700  px-6 w-60  py-3 text-lg font-medium rounded-full shadow transition duration-200 flex justify-center items-center"
                    >
                        Go to Dashboard &nbsp; <MoveRightIcon />
                    </button>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-purple-800/20 p-6 rounded-xl border border-purple-600 shadow">
                        <div className="flex items-center gap-4 mb-4">
                            <LayoutDashboard className="text-purple-400 w-6 h-6" />
                            <h3 className="text-xl font-semibold">Manage Dashboard</h3>
                        </div>
                        <p className="text-gray-300">Access key metrics, employee insights and more.</p>
                    </div>

                    <div className="bg-purple-800/20 p-6 rounded-xl border border-purple-600 shadow">
                        <div className="flex items-center gap-4 mb-4">
                            <Users className="text-purple-400 w-6 h-6" />
                            <h3 className="text-xl font-semibold">Employee Control</h3>
                        </div>
                        <p className="text-gray-300">View, add, or remove employees with full control.</p>
                    </div>

                    <div className="bg-purple-800/20 p-6 rounded-xl border border-purple-600 shadow">
                        <div className="flex items-center gap-4 mb-4">
                            <Settings className="text-purple-400 w-6 h-6" />
                            <h3 className="text-xl font-semibold">Settings</h3>
                        </div>
                        <p className="text-gray-300">Customize your panel, roles, and preferences.</p>
                    </div>

                    <div className="bg-purple-800/20 p-6 rounded-xl border border-purple-600 shadow">
                        <div className="flex items-center gap-4 mb-4">
                            <BarChart2 className="text-purple-400 w-6 h-6" />
                            <h3 className="text-xl font-semibold">Performance</h3>
                        </div>
                        <p className="text-gray-300">Track analytics and measure performance growth.</p>
                    </div>
                </div>

                {/* CTA Button */}

            </div>
        </div>
    );
}

export default AdminDashboard;
