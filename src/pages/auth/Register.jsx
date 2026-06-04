import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { BookOpen, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/Button';
import Input from '../../components/Input';

export default function Register() {
  const { register, currentUser, userRole } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('siswa');
  const [nis, setNis] = useState('');
  const [kelas, setKelas] = useState('');
  const [idGuru, setIdGuru] = useState('');
  const [mataPelajaran, setMataPelajaran] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Redirect if already logged in (active users)
  useEffect(() => {
    if (currentUser && userRole) {
      if (userRole === 'admin') navigate('/admin/dashboard');
      else if (userRole === 'guru') navigate('/guru/dashboard');
      else if (userRole === 'siswa') navigate('/siswa/dashboard');
    }
  }, [currentUser, userRole, navigate]);

  const validate = () => {
    const newErrors = {};
    if (!nama) {
      newErrors.nama = 'Nama wajib diisi';
    }
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
    if (role === 'siswa') {
      if (!nis) newErrors.nis = 'NIS wajib diisi';
      if (!kelas) newErrors.kelas = 'Kelas wajib dipilih';
    }
    if (role === 'guru') {
      if (!idGuru) newErrors.idGuru = 'ID Guru wajib diisi';
      if (!mataPelajaran) newErrors.mataPelajaran = 'Mata Pelajaran wajib diisi';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await register(email, password, nama, role, nis, kelas, idGuru, mataPelajaran);
      if (result.requireApproval) {
        showToast('Pendaftaran berhasil! Akun Anda sedang menunggu persetujuan admin.', 'info');
        navigate('/login');
      } else {
        showToast(`Selamat datang, ${result.nama}!`, 'success');
        navigate('/siswa/dashboard');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-900 via-navy-800 to-slate-900 p-4 font-sans">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8 transition-all duration-300">

        {/* Brand Header */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="p-3 bg-white text-navy-900 rounded-2xl shadow-lg mb-3">
            <BookOpen className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black tracking-wider text-white">Buat Akun Baru</h2>
          <p className="text-xs text-navy-200 mt-1 font-semibold tracking-widest uppercase">EduScore Portal</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <Input
              id="nama"
              type="text"
              label="Nama Lengkap"
              placeholder="John Doe"
              value={nama}
              onChange={(e) => {
                setNama(e.target.value);
                if (errors.nama) setErrors({ ...errors, nama: '' });
              }}
              error={errors.nama}
              required
              className="text-white"
            />
          </div>

          {role === 'siswa' && (
            <div className="grid grid-cols-2 gap-4 animate-fade-in">
              <div className="relative">
                <Input
                  id="nis"
                  type="text"
                  label="Nomor Induk Siswa (NIS)"
                  placeholder="Misal: 12345"
                  value={nis}
                  onChange={(e) => {
                    setNis(e.target.value);
                    if (errors.nis) setErrors({ ...errors, nis: '' });
                  }}
                  error={errors.nis}
                  required
                  className="text-white"
                />
              </div>
              <div className="flex flex-col space-y-1.5 w-full">
                <label className="text-xs font-semibold text-white flex items-center">
                  Kelas
                  <span className="text-rose-500 ml-0.5">*</span>
                </label>
                <select
                  id="kelas"
                  name="kelas"
                  value={kelas}
                  onChange={(e) => {
                    setKelas(e.target.value);
                    if (errors.kelas) setErrors({ ...errors, kelas: '' });
                  }}
                  required
                  className={`
                    w-full px-3.5 py-2 text-sm rounded-lg border bg-navy-900/40 text-white transition-all duration-200 outline-none
                    focus:ring-2 focus:ring-offset-0 hover:bg-navy-800/60
                    ${errors.kelas ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200' : 'border-white/20 focus:border-white/50 focus:ring-white/10'}
                  `}
                >
                  <option value="" className="text-navy-900">-- Pilih Kelas --</option>
                  <option value="X IPA 1" className="text-navy-900">X IPA 1</option>
                  <option value="X IPA 2" className="text-navy-900">X IPA 2</option>
                  <option value="X IPS 1" className="text-navy-900">X IPS 1</option>
                  <option value="X IPS 2" className="text-navy-900">X IPS 2</option>
                  <option value="XI IPA 1" className="text-navy-900">XI IPA 1</option>
                  <option value="XI IPA 2" className="text-navy-900">XI IPA 2</option>
                  <option value="XI IPS 1" className="text-navy-900">XI IPS 1</option>
                  <option value="XI IPS 2" className="text-navy-900">XI IPS 2</option>
                  <option value="XII IPA 1" className="text-navy-900">XII IPA 1</option>
                  <option value="XII IPA 2" className="text-navy-900">XII IPA 2</option>
                  <option value="XII IPS 1" className="text-navy-900">XII IPS 1</option>
                  <option value="XII IPS 2" className="text-navy-900">XII IPS 2</option>
                </select>
                {errors.kelas && (
                  <span className="text-xs font-medium text-rose-400">
                    {errors.kelas}
                  </span>
                )}
              </div>
            </div>
          )}

          {role === 'guru' && (
            <div className="grid grid-cols-2 gap-4 animate-fade-in">
              <div className="relative">
                <Input
                  id="idGuru"
                  type="text"
                  label="ID Guru"
                  placeholder="Misal: G001"
                  value={idGuru}
                  onChange={(e) => {
                    setIdGuru(e.target.value);
                    if (errors.idGuru) setErrors({ ...errors, idGuru: '' });
                  }}
                  error={errors.idGuru}
                  required
                  className="text-white"
                />
              </div>
              <div className="relative">
                <Input
                  id="mataPelajaran"
                  type="text"
                  label="Mata Pelajaran"
                  placeholder="Misal: Matematika"
                  value={mataPelajaran}
                  onChange={(e) => {
                    setMataPelajaran(e.target.value);
                    if (errors.mataPelajaran) setErrors({ ...errors, mataPelajaran: '' });
                  }}
                  error={errors.mataPelajaran}
                  required
                  className="text-white"
                />
              </div>
            </div>
          )}

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

          <div className="relative">
            <label className="block text-sm font-semibold text-white mb-2">Daftar Sebagai</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('siswa')}
                className={`py-2 px-4 rounded-lg font-bold text-sm transition-all border ${role === 'siswa'
                    ? 'bg-emerald-600/90 text-white border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'bg-navy-900/40 text-navy-200 border-navy-700/50 hover:bg-navy-800/60'
                  }`}
              >
                Siswa
              </button>
              <button
                type="button"
                onClick={() => setRole('guru')}
                className={`py-2 px-4 rounded-lg font-bold text-sm transition-all border ${role === 'guru'
                    ? 'bg-amber-600/90 text-white border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                    : 'bg-navy-900/40 text-navy-200 border-navy-700/50 hover:bg-navy-800/60'
                  }`}
              >
                Guru
              </button>
            </div>
            {role === 'guru' && (
              <p className="text-[11px] text-amber-300 mt-2 font-medium italic">
                * Pendaftaran sebagai Guru memerlukan persetujuan Admin sebelum dapat login.
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full py-2.5 mt-4 bg-navy-10 hover:bg-navy-50 text-navy-900 border border-transparent shadow-md hover:scale-[1.01]"
            loading={loading}
          >
            Daftar
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/10 text-center">
          <p className="text-sm text-navy-200">
            Sudah punya akun?{' '}
            <a href="/login" className="text-white font-bold hover:underline">
              Masuk di sini
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}
