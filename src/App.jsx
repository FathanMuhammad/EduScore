import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/admin/Dashboard';
import AdminSiswa from './pages/admin/Siswa';
import AdminGuru from './pages/admin/Guru';
import AdminPersetujuanGuru from './pages/admin/PersetujuanGuru';
import AdminLaporan from './pages/admin/Laporan';
import GuruDashboard from './pages/guru/Dashboard';
import GuruInputNilai from './pages/guru/InputNilai';
import GuruRekap from './pages/guru/Rekap';
import SiswaDashboard from './pages/siswa/Dashboard';
import SiswaNilaiPribadi from './pages/siswa/NilaiPribadi';

// Root Redirect Helper based on user role
const RootRedirect = () => {
  return <Navigate to="/login" replace />;
};

// Main Layout Wrapper
const AppLayout = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      <Sidebar />
      {/* no-print class skips sidebar on print, and pad adjustment for mobile */}
      <main className="flex-1 p-5 sm:p-8 overflow-y-auto w-full max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <DataProvider>
            <Routes>
              {/* Public Auth Route */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Private Protected App Routes */}
              <Route element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }>
                {/* Admin-only Routes */}
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/siswa" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminSiswa />
                  </ProtectedRoute>
                } />
                <Route path="/admin/guru" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminGuru />
                  </ProtectedRoute>
                } />
                <Route path="/admin/laporan" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLaporan />
                  </ProtectedRoute>
                } />
                <Route path="/admin/persetujuan-guru" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminPersetujuanGuru />
                  </ProtectedRoute>
                } />

                {/* Guru-only Routes */}
                <Route path="/guru/dashboard" element={
                  <ProtectedRoute allowedRoles={['guru']}>
                    <GuruDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/guru/input-nilai" element={
                  <ProtectedRoute allowedRoles={['guru']}>
                    <GuruInputNilai />
                  </ProtectedRoute>
                } />
                <Route path="/guru/rekap" element={
                  <ProtectedRoute allowedRoles={['guru']}>
                    <GuruRekap />
                  </ProtectedRoute>
                } />

                {/* Siswa-only Routes */}
                <Route path="/siswa/dashboard" element={
                  <ProtectedRoute allowedRoles={['siswa']}>
                    <SiswaDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/siswa/nilai-pribadi" element={
                  <ProtectedRoute allowedRoles={['siswa']}>
                    <SiswaNilaiPribadi />
                  </ProtectedRoute>
                } />
              </Route>

              {/* Fallback Redirects */}
              <Route path="/" element={<RootRedirect />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </DataProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
