import React, { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import useNilai from '../../hooks/useNilai';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Spinner from '../../components/Spinner';
import { Award, BookOpen, GraduationCap, CheckCircle2, AlertTriangle, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SiswaDashboard() {
  const { userData } = useAuth();
  const { getNilaiBySiswaNis, loading } = useNilai();

  const studentNis = userData?.nis || '12345';
  const studentName = userData?.nama || 'Siswa';
  const studentClass = userData?.kelas || 'XII-RPL-1';

  // Get student's grades
  const studentGrades = useMemo(() => {
    return getNilaiBySiswaNis(studentNis);
  }, [getNilaiBySiswaNis, studentNis]);

  const stats = useMemo(() => {
    if (studentGrades.length === 0) {
      return { total: 0, average: 0, status: 'Tidak Lulus' };
    }
    const total = studentGrades.length;
    // Only count validated grades or all? Standard is all, but let's note validated ones.
    const sum = studentGrades.reduce((acc, curr) => acc + (parseFloat(curr.nilaiAkhir) || 0), 0);
    const average = Math.round((sum / total) * 100) / 100;
    const status = average >= 70 ? 'Lulus' : 'Tidak Lulus';
    return { total, average, status };
  }, [studentGrades]);

  if (loading) {
    return <Spinner size="lg" />;
  }

  const isLulus = stats.average >= 70;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-extrabold text-navy-900">Dashboard Siswa</h2>
        <p className="text-xs text-navy-500 mt-1">Portal akademik untuk melihat hasil studi Anda secara transparan.</p>
      </div>

      {/* Profile and Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <Card title="Profil Siswa" subtitle="Detail biodata terdaftar." className="md:col-span-1">
          <div className="flex flex-col items-center justify-center text-center space-y-4 py-4">
            <div className="w-20 h-20 bg-navy-50 text-navy-800 border-2 border-navy-100 rounded-full flex items-center justify-center text-3xl font-black">
              {studentName.charAt(0)}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-navy-900">{studentName}</h3>
              <p className="text-xs text-navy-500 font-medium">NIS: {studentNis}</p>
              <span className="inline-block mt-3 px-3 py-1 bg-navy-800 text-white rounded-full text-xs font-bold">
                Kelas {studentClass}
              </span>
            </div>
          </div>
        </Card>

        {/* Graduation Status Banner */}
        <div className={`
          md:col-span-2 rounded-xl p-6 border flex flex-col justify-between transition-all duration-300 shadow-sm
          ${isLulus 
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800' 
            : 'bg-rose-50/70 border-rose-200 text-rose-800'}
        `}>
          <div className="flex items-start space-x-4">
            <div className={`
              p-3 rounded-xl bg-white shadow-sm flex-shrink-0
              ${isLulus ? 'text-emerald-600' : 'text-rose-600'}
            `}>
              {isLulus ? <CheckCircle2 className="w-8 h-8 animate-bounce" /> : <AlertTriangle className="w-8 h-8 animate-pulse" />}
            </div>
            <div>
              <h3 className="text-lg font-black uppercase tracking-wider">Status Kelulusan Anda</h3>
              <p className="text-xs font-medium opacity-90 mt-1">
                Kriteria kelulusan didasarkan pada rata-rata nilai akhir seluruh mata pelajaran yang Anda ambil (KKM ≥ 70).
              </p>
              <div className="mt-4 flex items-baseline space-x-1.5">
                <span className="text-xs font-semibold">Rata-Rata Nilai Akhir:</span>
                <span className="text-xl font-black">{stats.average}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-0 flex items-center justify-between border-t border-current/15 pt-4">
            <span className="text-xs font-bold uppercase tracking-wider">Keputusan Akhir</span>
            <span className={`
              px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest shadow-sm border
              ${isLulus 
                ? 'bg-emerald-600 border-emerald-500 text-white animate-pulse' 
                : 'bg-rose-600 border-rose-500 text-white'}
            `}>
              {stats.status}
            </span>
          </div>
        </div>

      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card bodyClassName="flex items-center space-x-4" hoverEffect>
          <div className="p-3 bg-navy-50 text-navy-800 rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-navy-500 font-bold uppercase tracking-wider">Mata Pelajaran Diikuti</p>
            <h4 className="text-xl font-black text-navy-900 mt-0.5">{stats.total} Mapel</h4>
          </div>
        </Card>
        <Card bodyClassName="flex items-center space-x-4" hoverEffect>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-navy-500 font-bold uppercase tracking-wider">Indeks Prestasi Rata-Rata</p>
            <h4 className="text-xl font-black text-navy-900 mt-0.5">{stats.average} / 100</h4>
          </div>
        </Card>
      </div>

      {/* Quick link box */}
      <Card 
        title="Hasil Studi Terakhir" 
        subtitle="Lihat nilai terperinci untuk masing-masing mata pelajaran."
        action={
          <Link to="/siswa/nilai-pribadi" className="text-xs font-bold text-navy-800 hover:text-navy-950 hover:underline">
            Buka Nilai Pribadi
          </Link>
        }
      >
        <div className="space-y-3">
          {studentGrades.slice(0, 3).map((item) => (
            <div key={item.id} className="p-3.5 bg-navy-50/50 border border-navy-100 rounded-lg flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-navy-900">{item.mataPelajaran}</p>
                <p className="text-xs text-navy-500">Guru: {item.namaGuru}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <span className="text-[10px] text-navy-400 font-extrabold uppercase block">Nilai Akhir</span>
                  <span className="text-sm font-black text-navy-800">{item.nilaiAkhir}</span>
                </div>
                <Badge status={item.status} />
              </div>
            </div>
          ))}
          {studentGrades.length === 0 && (
            <p className="text-sm text-center text-navy-500 font-semibold py-4">Belum ada nilai yang diinput oleh Guru.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
