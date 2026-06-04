import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { BookOpen, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/Button';
import Input from '../../components/Input';

export default function Login() {
  const { login, currentUser, userRole } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser && userRole) {
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else {
        if (userRole === 'admin') navigate('/admin/dashboard');
        else if (userRole === 'guru') navigate('/guru/dashboard');
        else if (userRole === 'siswa') navigate('/siswa/dashboard');
      }
    }
  }, [currentUser, userRole, navigate, location]);

  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Format email tidak valid';
    }
    if (!password) {
      newErrors.password = 'Password wajib diisi';
    } else if (password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const user = await login(email, password);
      showToast(`Selamat datang kembali, ${user.nama || 'Pengguna'}!`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (quickEmail) => {
    setEmail(quickEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-900 via-navy-800 to-slate-900 p-4 font-sans">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8 transition-all duration-300">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="p-3 bg-white text-navy-900 rounded-2xl shadow-lg mb-3">
            <BookOpen className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black tracking-wider text-white">EduScore</h2>
          <p className="text-xs text-navy-200 mt-1 font-semibold tracking-widest uppercase">Portal Nilai Siswa</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <Input
              id="email"
              type="email"
              label="Email"
              placeholder="nama@sekolah.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              error={errors.email}
              required
              className="text-white"
            />
          </div>

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
              error={errors.password}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-9.5 text-navy-400 hover:text-navy-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full py-2.5 mt-2 bg-white hover:bg-navy-50 text-navy-900 border border-transparent shadow-md hover:scale-[1.01]"
            loading={loading}
          >
            Masuk
          </Button>
        </form>

        {/* Register Link */}
        <div className="mt-6 pt-6 border-t border-white/10 text-center">
          <p className="text-sm text-navy-200">
            Belum punya akun?{' '}
            <a href="/register" className="text-white font-bold hover:underline">
              Daftar di sini
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}
