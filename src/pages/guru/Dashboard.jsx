import React, { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import useNilai from '../../hooks/useNilai';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Spinner from '../../components/Spinner';
import { ClipboardPen, Award, CheckCircle, Clock, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GuruDashboard() {
  const { userData } = useAuth();
  const { getNilaiByGuru, loading } = useNilai();

  const teacherId = userData?.idGuru || 'g1'; // default/fallback for mock
  const teacherName = userData?.nama || 'Guru';
  const teacherSubject = userData?.mataPelajaran || 'Matematika';

  const teacherGrades = useMemo(() => {
    return getNilaiByGuru(teacherId);
  }, [getNilaiByGuru, teacherId]);

  const stats = useMemo(() => {
    if (teacherGrades.length === 0) {
      return { total: 0, validated: 0, pending: 0, average: 0 };
    }
    const total = teacherGrades.length;
    const validated = teacherGrades.filter(g => g.isValidated).length;
    const pending = total - validated;
    const sum = teacherGrades.reduce((acc, curr) => acc + (parseFloat(curr.nilaiAkhir) || 0), 0);
    const average = Math.round((sum / total) * 100) / 100;
    return { total, validated, pending, average };
  }, [teacherGrades]);

  if (loading) {
    return <Spinner size="lg" />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-extrabold text-navy-900">Dashboard Guru</h2>
        <p className="text-xs text-navy-500 mt-1">Selamat datang kembali, {teacherName}. Kelola hasil belajar mata pelajaran Anda.</p>
      </div>

      {/* Profil Guru Card */}
      <Card bodyClassName="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 space-y-4 sm:space-y-0" hoverEffect>
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-navy-800 text-white rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-navy-900">{teacherSubject}</h3>
            <p className="text-xs text-navy-500 font-medium">Mata Pelajaran Diampu</p>
          </div>
        </div>
        <div className="flex items-center space-x-6 text-xs font-semibold text-navy-700 bg-navy-50 border border-navy-100 px-4 py-2.5 rounded-lg">
          <div>
            <span className="text-[10px] text-navy-400 font-extrabold uppercase block">ID GURU</span>
            <span>{teacherId}</span>
          </div>
          <div className="border-l border-navy-200 pl-6">
            <span className="text-[10px] text-navy-400 font-extrabold uppercase block">MATA PELAJARAN</span>
            <span>{teacherSubject}</span>
          </div>
        </div>
      </Card>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Nilai Diinput */}
        <Card bodyClassName="flex items-center space-x-4" hoverEffect>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <ClipboardPen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-navy-500 font-bold uppercase tracking-wider">Total Input</p>
            <h4 className="text-2xl font-black text-navy-900 mt-0.5">{stats.total}</h4>
          </div>
        </Card>

        {/* Rata-Rata Nilai Mapel */}
        <Card bodyClassName="flex items-center space-x-4" hoverEffect>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-navy-500 font-bold uppercase tracking-wider">Rata-Rata Kelas</p>
            <h4 className="text-2xl font-black text-navy-900 mt-0.5">{stats.average}</h4>
          </div>
        </Card>

        {/* Tervalidasi */}
        <Card bodyClassName="flex items-center space-x-4" hoverEffect>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-navy-500 font-bold uppercase tracking-wider">Tervalidasi</p>
            <h4 className="text-2xl font-black text-navy-900 mt-0.5">{stats.validated}</h4>
          </div>
        </Card>

        {/* Menunggu Validasi */}
        <Card bodyClassName="flex items-center space-x-4" hoverEffect>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-navy-500 font-bold uppercase tracking-wider">Menunggu</p>
            <h4 className="text-2xl font-black text-navy-900 mt-0.5">{stats.pending}</h4>
          </div>
        </Card>
      </div>

      {/* Recent Grades Box */}
      <Card 
        title="Daftar Nilai Mapel Terbaru" 
        subtitle="Daftar nilai terakhir yang dimasukkan oleh Anda."
        action={
          <Link to="/guru/rekap" className="text-xs font-bold text-navy-800 hover:text-navy-950 hover:underline">
            Lihat Rekap Lengkap
          </Link>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-navy-100 text-navy-500">
                <th className="py-3 font-bold uppercase text-[10px] tracking-wider">NIS</th>
                <th className="py-3 font-bold uppercase text-[10px] tracking-wider">Nama Siswa</th>
                <th className="py-3 font-bold uppercase text-[10px] tracking-wider">Kelas</th>
                <th className="py-3 font-bold uppercase text-[10px] tracking-wider text-center">Nilai Akhir</th>
                <th className="py-3 font-bold uppercase text-[10px] tracking-wider text-center">Status Kelulusan</th>
                <th className="py-3 font-bold uppercase text-[10px] tracking-wider text-center">Validasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {teacherGrades.length > 0 ? (
                teacherGrades.slice(0, 5).map((grade) => (
                  <tr key={grade.id} className="hover:bg-navy-50/20 transition-colors">
                    <td className="py-3.5 font-bold text-navy-800">{grade.nis}</td>
                    <td className="py-3.5 font-semibold text-navy-900">{grade.namaSiswa}</td>
                    <td className="py-3.5 text-navy-600">{grade.kelas}</td>
                    <td className="py-3.5 font-bold text-center text-navy-800">{grade.nilaiAkhir}</td>
                    <td className="py-3.5 text-center">
                      <Badge status={grade.status} />
                    </td>
                    <td className="py-3.5 text-center">
                      <span className={`
                        inline-block px-2 py-0.5 rounded text-[10px] font-bold border
                        ${grade.isValidated 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-rose-50 text-rose-700 border-rose-200'}
                      `}>
                        {grade.isValidated ? 'Valid' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-navy-500 font-semibold">
                    Belum ada nilai yang diinput. Mulai dengan tombol di bawah.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-end">
          <Link to="/guru/input-nilai">
            <button className="bg-navy-800 text-white font-bold text-xs px-4 py-2.5 rounded-lg hover:bg-navy-900 transition-all hover:scale-[1.01]">
              Input Nilai Baru
            </button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
