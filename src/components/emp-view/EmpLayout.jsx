import { authContext } from '@/context/AuthProvider';
import { LogOut } from 'lucide-react'
import { useContext } from 'react';
import toast from 'react-hot-toast';
import { Outlet } from 'react-router-dom'

const EmpLayout = () => {

    const { setUser, setIsAuthenticated } = useContext(authContext)

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsAuthenticated(false);
        toast.success('Logged Out Successfully')
        setUser({});
    };




    return (
        <div className='flex flex-col min-h-screen w-full'>
            <div className='h-16 w-full border-b flex items-center justify-between px-6'>
                <div className=' '>
                    <div className="text-center bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent flex items-center justify-center font-bold text-3xl">
                        <strong>XTECH</strong>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="hover:scale-105 transition-transform"
                    title="Logout"
                >
                    <LogOut className="text-purple-800 hover:text-red-400 border-2 border-purple-400 p-2 h-9 w-9 rounded-full" />
                </button>
            </div>

            <div className=' bg-background '>
                <Outlet />
            </div>
        </div>
    )
}

export default EmpLayout
