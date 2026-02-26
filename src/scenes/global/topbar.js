import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../Context/UserContext';
import { 
  Sun, 
  Moon, 
  Facebook, 
  Settings, 
  Search,
  LogOut,
  HelpCircle
} from 'lucide-react';

const Topbar = () => {
  const navigate = useNavigate();
  const { handleLogout, user } = useUser();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // You can implement dark mode logic here
    document.documentElement.classList.toggle('dark');
  };

  const handleLogoutClick = () => {
    setIsAccountMenuOpen(false);
    handleLogout();
    navigate('/login');
  };

  const handleContactAdmin = () => {
    setIsAccountMenuOpen(false);
    navigate('/contact-admin');
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-[#245C93] border-b border-gray-200 dark:border-gray-800 transition-colors duration-200">
      <div className="px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Left section - Search Bar */}
          <div className="flex-1 max-w-md">
            <div 
              className={`flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg transition-all duration-300 ${
                searchFocused ? 'ring-2 ring-blue-500 shadow-lg' : ''
              }`}
            >
              <button className="p-2.5 pl-3">
                <Search size={18} className="text-gray-500 dark:text-gray-400" />
              </button>
              <input
                type="text"
                placeholder="Search articles, authors..."
                className="w-full py-2 pr-3 bg-transparent outline-none text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 text-sm"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
              {searchFocused && (
                <span className="hidden sm:inline-block pr-3 text-xs text-gray-400 dark:text-gray-500">
                  Press Enter ↵
                </span>
              )}
            </div>
          </div>

          {/* Right section - Icons */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Facebook Link */}
            <a
              href="https://www.facebook.com/people/The-Everest-News/61557594452068/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-[#1877F2] transition-colors"
              aria-label="Facebook page"
            >
              <Facebook size={20} />
            </a>

            {/* Settings */}
            <button
              onClick={() => navigate('/settings')}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
              aria-label="Settings"
            >
              <Settings size={20} />
            </button>

            {/* Account Menu */}
            <div className="relative">
              <button
                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border-2 border-transparent hover:border-blue-500"
                aria-label="Account menu"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
              </button>

              {/* Account Dropdown Menu */}
              {isAccountMenuOpen && (
                <>
                  {/* Backdrop for closing */}
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setIsAccountMenuOpen(false)}
                  />
                  
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-800 z-50 animate-fadeIn">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {user?.username || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {user?.role || 'Role'} • {user?.email || 'user@example.com'}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <button
                        onClick={handleContactAdmin}
                        className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
                      >
                        <HelpCircle size={18} className="text-gray-500" />
                        <span className="text-sm">Contact Admin</span>
                      </button>

                      <button
                        onClick={handleLogoutClick}
                        className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 text-red-600 dark:text-red-400 transition-colors"
                      >
                        <LogOut size={18} />
                        <span className="text-sm">Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add these styles to your global CSS file */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </header>
  );
};

export default Topbar;