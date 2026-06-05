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

  // Calculate distinct student metrics based on user requirements
  const studentMetrics = React.useMemo(() => {
    let passedCount = 0;
    let failedCount = 0;
    let noInputCount = 0;

    siswa.forEach((student) => {
      const studentGrades = nilai.filter((n) => n.nis === student.nis);
      
      if (studentGrades.length === 0) {
        noInputCount++;
      } else {
        const hasPassed = studentGrades.some((n) => n.status === 'Lulus');
        if (hasPassed) {
          passedCount++;
        } else {
          failedCount++;
        }
      }
    });

    const percentPassed = totalSiswa === 0 ? 0 : Math.round((passedCount / totalSiswa) * 100);

    return {
      passedCount,
      failedCount,
      noInputCount,
      percentPassed
    };
  }, [siswa, nilai, totalSiswa]);

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

        {/* Lulus */}
        <Card bodyClassName="flex items-center space-x-4" hoverEffect>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-navy-500 font-bold uppercase tracking-wider leading-tight">
              Lulus <br/><span className="text-[8px] opacity-75 lowercase font-medium">(sudah lulus ≥ 1 matpel)</span>
            </p>
            <h4 className="text-2xl font-black text-navy-900 mt-0.5">{studentMetrics.passedCount}</h4>
          </div>
        </Card>

        {/* Belum Lulus */}
        <Card bodyClassName="flex items-center space-x-4" hoverEffect>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-navy-500 font-bold uppercase tracking-wider leading-tight">
              Belum Lulus <br/><span className="text-[8px] opacity-75 lowercase font-medium">(belum ada matpel lulus)</span>
            </p>
            <h4 className="text-2xl font-black text-navy-900 mt-0.5">{studentMetrics.failedCount}</h4>
          </div>
        </Card>

        {/* Belum Input */}
        <Card bodyClassName="flex items-center space-x-4" hoverEffect>
          <div className="p-3 bg-slate-50 text-slate-600 rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-navy-500 font-bold uppercase tracking-wider leading-tight">
              Belum Input <br/><span className="text-[8px] opacity-75 lowercase font-medium">(belum dinilai)</span>
            </p>
            <h4 className="text-2xl font-black text-navy-900 mt-0.5">{studentMetrics.noInputCount}</h4>
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
                  strokeDashoffset={`${2 * Math.PI * 68 * (1 - studentMetrics.percentPassed / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-navy-900">{studentMetrics.percentPassed}%</span>
                <span className="text-[10px] text-navy-400 font-extrabold uppercase mt-1">Lulus</span>
              </div>
            </div>

            {/* Legend and details */}
            <div className="space-y-4 w-full max-w-xs">
              <div className="flex items-center justify-between border-b border-navy-50 pb-2">
                <div className="flex items-center space-x-2">
                  <span className="w-3.5 h-3.5 rounded bg-emerald-500" />
                  <span className="text-xs font-semibold text-navy-700">Lulus (≥ 1 Matpel)</span>
                </div>
                <span className="text-sm font-bold text-navy-900">{studentMetrics.passedCount} Siswa</span>
              </div>
              <div className="flex items-center justify-between border-b border-navy-50 pb-2">
                <div className="flex items-center space-x-2">
                  <span className="w-3.5 h-3.5 rounded bg-amber-500" />
                  <span className="text-xs font-semibold text-navy-700">Belum Lulus</span>
                </div>
                <span className="text-sm font-bold text-navy-900">{studentMetrics.failedCount} Siswa</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-3.5 h-3.5 rounded bg-slate-300" />
                  <span className="text-xs font-semibold text-navy-600">Belum Input Data</span>
                </div>
                <span className="text-sm font-extrabold text-navy-900">{studentMetrics.noInputCount} Siswa</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
