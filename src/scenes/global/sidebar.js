import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser } from '../../Context/UserContext';
import axios from 'axios';
import API_URL from '../../config';

// Icons using Lucide React (popular with Tailwind)
import {
  LayoutDashboard,
  Newspaper,
  PenTool,
  Image as ImageIcon,
  Video,
  Tags,
  FolderTree,
  UserPlus,
  Users,
  Target,
  Calendar,
  Shield,
  BarChart3,
  PieChart,
  LineChart,
  Map,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  Award,
  Trophy,
  Settings
} from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const { handleLogout } = useUser();
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Set selected based on current path
    const path = location.pathname;
    if (path === '/') setSelected('Dashboard');
    else if (path.includes('/add/nepali')) setSelected('Add Nepali News');
    else if (path.includes('/update/nepali')) setSelected('Edit Nepali News');
    else if (path.includes('/add/english')) setSelected('Add English News');
    else if (path.includes('/update/english')) setSelected('Edit English News');
    // ... add more conditions as needed
  }, [location]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/user-info`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user information:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const menuSections = [
    {
      title: "Main",
      items: [
        { title: "Dashboard", icon: LayoutDashboard, path: "/" }
      ]
    },
    {
      title: "Nepali News",
      items: [
        { title: "Add Nepali News", icon: Newspaper, path: "/add/nepali" },
        { title: "Edit Nepali News", icon: PenTool, path: "/update/nepali" }
      ]
    },
    {
      title: "English News",
      items: [
        { title: "Add English News", icon: Newspaper, path: "/add/english" },
        { title: "Edit English News", icon: PenTool, path: "/update/english" }
      ]
    },
    {
      title: "Photo Gallery",
      items: [
        { title: "Add Photo", icon: ImageIcon, path: "/add/photo" },
        { title: "Edit Photo", icon: ImageIcon, path: "/update/photo" }
      ]
    },
    {
      title: "Video Gallery",
      items: [
        { title: "Add Video", icon: Video, path: "/add/video" },
        { title: "Edit Video", icon: Video, path: "/update/video" }
      ]
    },
    {
      title: "Content Management",
      items: [
        { title: "Tags", icon: Tags, path: "/tags" },
        { title: "Categories", icon: FolderTree, path: "/category" }
      ]
    },
    {
      title: "Authors",
      items: [
        { title: "Add Author", icon: UserPlus, path: "/add/author" },
        { title: "Edit Author", icon: Users, path: "/update/author" }
      ]
    },
    {
      title: "Advertisements",
      items: [
        { title: "Add Advertisement", icon: Target, path: "/add/ads" },
        { title: "Edit Advertisement", icon: Target, path: "/update/ads" }
      ]
    },
    {
      title: "Live Scores",
      items: [
        { title: "Football", icon: Trophy, path: "/add/football" },
        { title: "Cricket", icon: Award, path: "/add/cricket" }
      ]
    },
    {
      title: "Tools",
      items: [
        { title: "Calendar", icon: Calendar, path: "/calendar" },
        { title: "Admin List", icon: Shield, path: "/admin" }
      ]
    },
    {
      title: "Analytics",
      items: [
        { title: "Bar Chart", icon: BarChart3, path: "/bar" },
        { title: "Pie Chart", icon: PieChart, path: "/pie" },
        { title: "Line Chart", icon: LineChart, path: "/line" },
        { title: "Geography", icon: Map, path: "/geography" }
      ]
    }
  ];

  return (
    <div 
      className={`h-screen bg-gradient-to-b from-[#25609a] to-slate-800 text-white transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Logo and Collapse Button */}
      <div className={`flex items-center p-4 border-b border-slate-700 ${
        isCollapsed ? 'justify-center' : 'justify-between'
      }`}>
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <img 
              src="/logo.png" 
              alt="The Everest News" 
              className="h-8 w-auto"
            />
            <span className="font-bold text-lg text-white">The Everest News</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-slate-400 hover:text-white"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* User Profile Section */}
      {user && (
        <div className={`p-4 border-b border-slate-700 ${isCollapsed ? 'text-center' : ''}`}>
          <div className={`flex ${isCollapsed ? 'flex-col' : 'items-center'} space-x-3`}>
            <div className="relative">
              <img
                src="/logo.png"
                alt="Profile"
                className={`rounded-full border-2 border-blue-500 p-1 ${
                  isCollapsed ? 'w-12 h-12 mx-auto' : 'w-14 h-14'
                }`}
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></span>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.username}
                </p>
                <p className="text-xs text-blue-400 truncate">
                  {user.role}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Scrollable Menu */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 hover:scrollbar-thumb-slate-500">
        <nav className="p-3">
          {menuSections.map((section, idx) => (
            <div key={idx} className="mb-4">
              {!isCollapsed && (
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSelected(item.title)}
                    className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                      selected === item.title
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    } ${isCollapsed ? 'justify-center' : 'space-x-3'}`}
                    title={isCollapsed ? item.title : ''}
                  >
                    <item.icon 
                      size={20} 
                      className={`${selected === item.title ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}
                    />
                    {!isCollapsed && (
                      <span className="text-sm font-medium">{item.title}</span>
                    )}
                    {!isCollapsed && selected === item.title && (
                      <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="p-3 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className={`flex items-center w-full px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 ${
            isCollapsed ? 'justify-center' : 'space-x-3'
          }`}
          title={isCollapsed ? 'Logout' : ''}
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;