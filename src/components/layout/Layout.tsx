import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, Compass, PlusCircle, BarChart2, MessageCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabaseClient';

const Layout = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20 sm:pb-0">
            <main className="max-w-[420px] mx-auto min-h-screen bg-white shadow-xl overflow-hidden sm:border-x sm:border-gray-100 flex flex-col relative">
                <header className="p-4 flex justify-between items-center border-b border-gray-50 bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs">
                            {user?.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span className="text-sm font-medium text-gray-600 truncate max-w-[120px]">
                            {user?.email?.split('@')[0]}
                        </span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-[10px] font-bold text-red-400 hover:text-red-500 uppercase tracking-tighter"
                    >
                        Log Out
                    </button>
                </header>
                <div className="flex-1 overflow-y-auto">
                    <Outlet />
                </div>

                {/* Bottom Navigation */}
                <nav className="fixed bottom-0 left-0 right-0 max-w-[420px] mx-auto bg-white border-t border-gray-100 px-6 py-2 flex justify-between items-center z-50">
                    <NavLink
                        to="/children"
                        className={({ isActive }) =>
                            cn(
                                'flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all duration-200',
                                isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:bg-gray-50'
                            )
                        }
                    >
                        <Home className="w-5 h-5" />
                        <span className="text-[10px] mt-1 font-medium">홈</span>
                    </NavLink>

                    <NavLink
                        to="/experiences"
                        className={({ isActive }) =>
                            cn(
                                'flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all duration-200',
                                isActive ? 'text-teal-600 bg-teal-50' : 'text-gray-400 hover:bg-gray-50'
                            )
                        }
                    >
                        <Compass className="w-5 h-5" />
                        <span className="text-[10px] mt-1 font-medium">기록</span>
                    </NavLink>

                    <NavLink
                        to="/experiences/new"
                        className="flex flex-col items-center justify-center -mt-6"
                    >
                        <div className="w-14 h-14 bg-indigo-600 rounded-full shadow-lg shadow-indigo-200 flex items-center justify-center text-white active:scale-95 transition-transform duration-200">
                            <PlusCircle className="w-7 h-7" />
                        </div>
                        <span className="text-[10px] mt-1 font-medium text-indigo-600">작성</span>
                    </NavLink>

                    <NavLink
                        to="/stats"
                        className={({ isActive }) =>
                            cn(
                                'flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all duration-200',
                                isActive ? 'text-purple-600 bg-purple-50' : 'text-gray-400 hover:bg-gray-50'
                            )
                        }
                    >
                        <BarChart2 className="w-5 h-5" />
                        <span className="text-[10px] mt-1 font-medium">통계</span>
                    </NavLink>

                    <NavLink
                        to="/support"
                        className={({ isActive }) =>
                            cn(
                                'flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all duration-200',
                                isActive ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400 hover:bg-gray-50'
                            )
                        }
                    >
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-[10px] mt-1 font-medium">문의</span>
                    </NavLink>
                </nav>
            </main>
        </div>
    );
};

export default Layout;
