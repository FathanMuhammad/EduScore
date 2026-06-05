import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ToastProvider, useToast } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Modal from './components/Modal';
import Input from './components/Input';
import { updatePassword } from 'firebase/auth';
import { auth } from './lib/firebase';

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
import ProfilSiswa from './pages/siswa/ProfilSiswa';

// Root Redirect Helper based on user role
const RootRedirect = () => {
  return <Navigate to="/login" replace />;
};

// Main Layout Wrapper
const AppLayout = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [showPrompt, setShowPrompt] = useState(false);
  const [showChangeForm, setShowChangeForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const needChange = sessionStorage.getItem('needPasswordChange') === 'true';
    if (needChange && currentUser) {
      setShowPrompt(true);
    }
  }, [currentUser]);

  const handleDecline = () => {
    sessionStorage.setItem('needPasswordChange', 'declined');
    setShowPrompt(false);
  };

  const handleAccept = () => {
    setShowPrompt(false);
    setShowChangeForm(true);
  };

  const handleSavePassword = async () => {
    if (!newPassword) {
      setError('Password baru wajib diisi');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Konfirmasi password tidak cocok');
      return;
    }

    setSaving(true);
    setError('');
    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        showToast('Password berhasil diperbarui!', 'success');
        sessionStorage.removeItem('needPasswordChange');
        setShowChangeForm(false);
      } else {
        throw new Error('Sesi pengguna tidak valid');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Gagal mengubah password');
      showToast('Gagal mengubah password.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      <Sidebar />
      {/* no-print class skips sidebar on print, and pad adjustment for mobile */}
      <main className="flex-1 p-5 sm:p-8 overflow-y-auto w-full max-w-7xl mx-auto">
        <Outlet />
      </main>

      {/* Prompt Modal */}
      <Modal
        isOpen={showPrompt}
        onClose={handleDecline}
        title="Ubah Password Default"
        onConfirm={handleAccept}
        confirmText="Ya, Ubah"
        cancelText="Tidak"
        size="sm"
      >
        <p className="text-sm text-slate-600">
          Anda saat ini menggunakan password default (**password123**). Keamanan akun Anda berisiko. Apakah Anda ingin mengubah password Anda sekarang?
        </p>
      </Modal>

      {/* Change Password Form Modal */}
      <Modal
        isOpen={showChangeForm}
        onClose={() => setShowChangeForm(false)}
        title="Ubah Password"
        onConfirm={handleSavePassword}
        confirmText="Simpan"
        loading={saving}
        size="sm"
      >
        <div className="space-y-4 pt-2">
          <Input
            id="newPassword"
            type="password"
            label="Password Baru"
            placeholder="Minimal 6 karakter"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setError('');
            }}
            required
          />
          <Input
            id="confirmPassword"
            type="password"
            label="Konfirmasi Password Baru"
            placeholder="Ulangi password baru"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError('');
            }}
            required
          />
          {error && <p className="text-xs text-rose-500 font-semibold">{error}</p>}
        </div>
      </Modal>
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
                <Route path="/siswa/profil" element={
                  <ProtectedRoute allowedRoles={['siswa']}>
                    <ProfilSiswa />
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
