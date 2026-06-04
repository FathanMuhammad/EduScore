import React, { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import useNilai from '../../hooks/useNilai';
import { Nilai } from '../../classes/Nilai';
import Table from '../../components/Table';
import Badge from '../../components/Badge';
import Spinner from '../../components/Spinner';
import Card from '../../components/Card';
import { Info } from 'lucide-react';

export default function SiswaNilaiPribadi() {
  const { userData } = useAuth();
  const { getNilaiBySiswaNis, loading } = useNilai();

  const studentNis = userData?.nis || '12345';

  // Fetch this student's grades
  const studentGrades = useMemo(() => {
    return getNilaiBySiswaNis(studentNis);
  }, [getNilaiBySiswaNis, studentNis]);

  const columns = [
    { key: 'no', label: 'No', sortable: false },
    { key: 'mataPelajaran', label: 'Mata Pelajaran', sortable: true },
    { key: 'namaGuru', label: 'Guru Pengampu', sortable: true },
    { key: 'tugas', label: 'Tugas (30%)', sortable: true },
    { key: 'uts', label: 'UTS (30%)', sortable: true },
    { key: 'uas', label: 'UAS (40%)', sortable: true },
    { key: 'nilaiAkhir', label: 'Nilai Akhir', sortable: true },
    { key: 'status', label: 'Status Kelulusan', sortable: true },
    { key: 'isValidated', label: 'Validasi', sortable: true }
  ];

  if (loading) {
    return <Spinner size="lg" />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-extrabold text-navy-900">Hasil Penilaian Studi</h2>
        <p className="text-xs text-navy-500 mt-1">Daftar laporan hasil belajar transparan Anda untuk semester ini.</p>
      </div>

      {/* Info Alert */}
      <div className="p-4 bg-navy-50 border border-navy-100 rounded-xl flex items-start space-x-3">
        <Info className="w-5 h-5 text-navy-800 flex-shrink-0 mt-0.5" />
        <div className="text-xs font-semibold text-navy-700 leading-relaxed">
          <p className="font-bold text-navy-900 mb-1">Panduan Penilaian:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Nilai Akhir diperoleh dari kalkulasi: <strong>(30% x Tugas) + (30% x UTS) + (40% x UAS)</strong>.</li>
            <li>Status Kelulusan per mata pelajaran dinyatakan <strong>Lulus</strong> jika Nilai Akhir mencapai minimal <strong>70</strong>.</li>
            <li>Nilai berstatus <strong>Pending (Belum Valid)</strong> masih dalam proses review guru mata pelajaran dan belum dicatat dalam transkrip final.</li>
          </ul>
        </div>
      </div>

      {/* Data Table */}
      <Table
        columns={columns}
        data={studentGrades}
        searchKeys={['mataPelajaran', 'namaGuru']}
        searchPlaceholder="Cari berdasarkan mapel atau guru..."
        renderRow={(item, index) => {
          // Instantiate Nilai class for OOP demonstration
          const nilaiInstance = new Nilai(item);
          const formattedSummary = nilaiInstance.tampilkan();

          return (
            <tr key={item.id} className="hover:bg-navy-50/40 transition-colors group">
              <td className="px-6 py-4 text-sm font-semibold text-navy-500">{index + 1}</td>
              <td className="px-6 py-4">
                <div>
                  <p className="text-sm font-bold text-navy-900">{item.mataPelajaran}</p>
                  {/* Tooltip or descriptive text derived from Nilai.tampilkan() */}
                  <span className="text-[10px] text-navy-400 font-medium hidden group-hover:block transition-all mt-0.5">
                    {formattedSummary}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-navy-600 font-medium">{item.namaGuru}</td>
              <td className="px-6 py-4 text-sm text-center font-semibold text-navy-800 bg-navy-50/10">{item.tugas}</td>
              <td className="px-6 py-4 text-sm text-center font-semibold text-navy-800 bg-navy-50/20">{item.uts}</td>
              <td className="px-6 py-4 text-sm text-center font-semibold text-navy-800 bg-navy-50/30">{item.uas}</td>
              <td className="px-6 py-4 text-sm font-black text-center text-navy-900 bg-navy-50/40">{item.nilaiAkhir}</td>
              <td className="px-6 py-4">
                <Badge status={item.status} />
              </td>
              <td className="px-6 py-4">
                <span className={`
                  inline-block px-2.5 py-0.5 rounded text-[10px] font-extrabold border uppercase tracking-wider
                  ${item.isValidated 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'}
                `}>
                  {item.isValidated ? 'Valid' : 'Pending'}
                </span>
              </td>
            </tr>
          );
        }}
      />
    </div>
  );
}
