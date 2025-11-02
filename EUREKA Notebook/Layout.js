import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import {
  FiHome,
  FiFolder,
  FiCheckSquare,
  FiSearch,
  FiDollarSign,
  FiBell,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { notificationAPI } from '../utils/api';
import webSocketService from '../utils/socket';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchNotificationCount();
      setupNotificationListener();
    }
  }, [user]);

  const fetchNotificationCount = async () => {
    try {
      const response = await notificationAPI.getStats();
      setNotificationCount(response.data.stats.unread);
    } catch (error) {
      console.error('Failed to fetch notification count:', error);
    }
  };

  const setupNotificationListener = () => {
    webSocketService.onNotificationReceived(() => {
      setNotificationCount(prev => prev + 1);
    });
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome },
    { name: 'Projects', href: '/projects', icon: FiFolder },
    { name: 'Tasks', href: '/tasks', icon: FiCheckSquare },
    { name: 'Search', href: '/search', icon: FiSearch },
    { name: 'Payments', href: '/payments', icon: FiDollarSign },
    { name: 'Notifications', href: '/notifications', icon: FiBell, badge: notificationCount },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
              <h1 className="ml-4 text-xl font-bold text-gray-900">
                Commercial Platform
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/notifications">
                <div className="relative p-2 text-gray-600 hover:text-gray-900 cursor-pointer">
                  <FiBell size={20} />
                  {notificationCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                      {notificationCount > 99 ? '99+' : notificationCount}
                    </span>
                  )}
                </div>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                  {user?.first_name?.[0]}{user?.last_name?.[0]}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-0'
          } bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden fixed left-0 top-16 bottom-0 z-20`}
        >
          <div className="flex flex-col h-full">
            <nav className="flex-1 px-4 py-6 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = router.pathname === item.href || router.pathname.startsWith(item.href + '/');
                
                return (
                  <Link key={item.name} href={item.href}>
                    <div
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon size={20} className="mr-3" />
                      {item.name}
                      {item.badge > 0 && (
                        <span className="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                          {item.badge > 99 ? '99+' : item.badge}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-gray-200 p-4 space-y-1">
              <Link href="/profile">
                <div
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                    router.pathname === '/profile'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <FiUser size={20} className="mr-3" />
                  Profile
                </div>
              </Link>
              <button
                onClick={logout}
                className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
              >
                <FiLogOut size={20} className="mr-3" />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? 'ml-64' : 'ml-0'
          }`}
        >
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
