import React from 'react';
import useSiswa from '../../hooks/useSiswa';
import useNilai from '../../hooks/useNilai';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Spinner from '../../components/Spinner';
import { Users, GraduationCap, Award, Percent, BookOpen } from 'lucide-react';

export default function AdminDashboard() {
  const { siswa, loading: loadingSiswa } = useSiswa();
  const { nilai, getStats, loading: loadingNilai } = useNilai();

  if (loadingSiswa || loadingNilai) {
    return <Spinner size="lg" />;
  }

  const stats = getStats();
  const totalSiswa = siswa.length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-extrabold text-navy-900">Dashboard Utama</h2>
        <p className="text-xs text-navy-500 mt-1">Ringkasan data akademik dan status kelulusan siswa secara realtime.</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Siswa */}
        <Card bodyClassName="flex items-center space-x-4" hoverEffect>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-navy-500 font-bold uppercase tracking-wider">Total Siswa</p>
            <h4 className="text-2xl font-black text-navy-900 mt-0.5">{totalSiswa}</h4>
          </div>
        </Card>

        {/* Rata-Rata Nilai */}
        <Card bodyClassName="flex items-center space-x-4" hoverEffect>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-navy-500 font-bold uppercase tracking-wider">Rata-Rata Nilai</p>
            <h4 className="text-2xl font-black text-navy-900 mt-0.5">{stats.average}</h4>
          </div>
        </Card>

        {/* Jumlah Lulus */}
        <Card bodyClassName="flex items-center space-x-4" hoverEffect>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-navy-500 font-bold uppercase tracking-wider">Lulus</p>
            <h4 className="text-2xl font-black text-navy-900 mt-0.5">{stats.lulus}</h4>
          </div>
        </Card>

        {/* Persentase Lulus */}
        <Card bodyClassName="flex items-center space-x-4" hoverEffect>
          <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-navy-500 font-bold uppercase tracking-wider">Persentase Lulus</p>
            <h4 className="text-2xl font-black text-navy-900 mt-0.5">{stats.lulusPercentage}%</h4>
          </div>
        </Card>
      </div>

      {/* Detailed Analysis Section */}
      <div className="w-full">
        {/* Pass/Fail Breakdown Chart/Box */}
        <Card title="Distribusi Kelulusan" subtitle="Perbandingan siswa yang lulus dan tidak lulus." className="w-full">
          <div className="flex flex-col sm:flex-row items-center justify-around py-6 space-y-6 sm:space-y-0">
            {/* Visual circle gauge */}
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="68"
                  className="stroke-navy-100"
                  strokeWidth="12"
                  fill="transparent"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="68"
                  className="stroke-emerald-500 transition-all duration-1000"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 68}`}
                  strokeDashoffset={`${2 * Math.PI * 68 * (1 - stats.lulusPercentage / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-navy-900">{stats.lulusPercentage}%</span>
                <span className="text-[10px] text-navy-400 font-extrabold uppercase mt-1">Lulus</span>
              </div>
            </div>

            {/* Legend and details */}
            <div className="space-y-4 w-full max-w-xs">
              <div className="flex items-center justify-between border-b border-navy-50 pb-2">
                <div className="flex items-center space-x-2">
                  <span className="w-3.5 h-3.5 rounded bg-emerald-500" />
                  <span className="text-xs font-semibold text-navy-700">Lulus (Koreksi KKM ≥ 70)</span>
                </div>
                <span className="text-sm font-bold text-navy-900">{stats.lulus} Siswa</span>
              </div>
              <div className="flex items-center justify-between border-b border-navy-50 pb-2">
                <div className="flex items-center space-x-2">
                  <span className="w-3.5 h-3.5 rounded bg-rose-500" />
                  <span className="text-xs font-semibold text-navy-700">Tidak Lulus (&lt; 70)</span>
                </div>
                <span className="text-sm font-bold text-navy-900">{stats.tidakLulus} Siswa</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-navy-600">Total Data Input Nilai</span>
                <span className="text-sm font-extrabold text-navy-900">{stats.total} Rekor</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
