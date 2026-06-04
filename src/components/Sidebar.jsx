import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  FileSpreadsheet, 
  ClipboardPen, 
  LogOut, 
  Menu, 
  X,
  BookOpen,
  Award
} from 'lucide-react';

export default function Sidebar() {
  const { userData, userRole, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      showToast("Berhasil keluar dari sistem", "success");
      navigate('/login');
    } catch (err) {
      showToast("Gagal logout", "error");
    }
  };

  const getLinks = () => {
    switch (userRole) {
      case 'admin':
        return [
          { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/admin/siswa', label: 'Manajemen Siswa', icon: Users },
          { to: '/admin/guru', label: 'Manajemen Guru', icon: GraduationCap },
          { to: '/admin/laporan', label: 'Laporan Nilai', icon: FileSpreadsheet },
        ];
      case 'guru':
        return [
          { to: '/guru/dashboard', label: 'Dashboard Guru', icon: LayoutDashboard },
          { to: '/guru/input-nilai', label: 'Input Nilai Siswa', icon: ClipboardPen },
          { to: '/guru/rekap', label: 'Rekap Nilai', icon: FileSpreadsheet },
        ];
      case 'siswa':
        return [
          { to: '/siswa/dashboard', label: 'Dashboard Siswa', icon: LayoutDashboard },
          { to: '/siswa/nilai-pribadi', label: 'Nilai Pribadi', icon: Award },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <>
      {/* Mobile Topbar Toggle */}
      <div className="md:hidden bg-navy-900 text-white flex items-center justify-between p-4 shadow-md sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-6 h-6 text-navy-200" />
          <span className="font-bold text-lg tracking-wider text-white">EduScore</span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 text-navy-200 hover:text-white transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-navy-950/60 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-64 bg-navy-900 text-white flex flex-col z-50 transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="p-6 border-b border-navy-800 flex items-center space-x-3 bg-navy-950/45">
          <div className="p-2 rounded-lg bg-white/10 text-white">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-wider leading-none text-white">EduScore</h1>
            <span className="text-[10px] text-navy-400 font-semibold uppercase tracking-widest mt-1 block">Aplikasi Nilai</span>
          </div>
        </div>

        {/* User Card Profile */}
        {userData && (
          <div className="p-5 border-b border-navy-800 bg-navy-950/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-navy-700 border border-navy-600 flex items-center justify-center font-bold text-navy-100 uppercase">
                {userData.nama ? userData.nama.charAt(0) : 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate text-navy-100">{userData.nama}</p>
                <p className="text-xs text-navy-400 truncate">{userData.email}</p>
                <span className={`
                  inline-block px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full mt-1.5 border
                  ${userRole === 'admin' ? 'bg-indigo-900/40 text-indigo-200 border-indigo-700/50' : ''}
                  ${userRole === 'guru' ? 'bg-amber-900/40 text-amber-200 border-amber-700/50' : ''}
                  ${userRole === 'siswa' ? 'bg-emerald-900/40 text-emerald-200 border-emerald-700/50' : ''}
                `}>
                  {userRole}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `
                  flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
                  ${isActive 
                    ? 'bg-white text-navy-900 shadow-md transform scale-[1.02]' 
                    : 'text-navy-300 hover:bg-navy-800 hover:text-white'}
                `}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-navy-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-rose-400 hover:bg-rose-950/20 hover:text-rose-300 transition-colors"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
}
