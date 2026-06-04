import React, { useState, useMemo } from 'react';
import useNilai from '../../hooks/useNilai';
import useSiswa from '../../hooks/useSiswa';
import { generateLaporan } from '../../utils/laporan';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import { Printer, Filter, RefreshCw } from 'lucide-react';

export default function AdminLaporan() {
  const { nilai, loading } = useNilai();
  const { getUniqueKelas } = useSiswa();

  const [selectedKelas, setSelectedKelas] = useState('');

  // Extract unique classes for filtering
  const kelasList = useMemo(() => {
    const list = nilai.map(n => n.kelas).filter(Boolean);
    return [...new Set(list)];
  }, [nilai]);

  // Filtered grades
  const filteredNilai = useMemo(() => {
    if (!selectedKelas) return nilai;
    return nilai.filter(n => n.kelas === selectedKelas);
  }, [nilai, selectedKelas]);

  // Transform data using generateLaporan utility
  const laporanData = useMemo(() => {
    return generateLaporan(filteredNilai);
  }, [filteredNilai]);

  const handlePrint = () => {
    window.print();
  };

  const columns = [
    { key: 'no', label: 'No', sortable: false },
    { key: 'nis', label: 'NIS', sortable: true },
    { key: 'namaSiswa', label: 'Siswa', sortable: true },
    { key: 'kelas', label: 'Kelas', sortable: true },
    { key: 'mataPelajaran', label: 'Mata Pelajaran', sortable: true },
    { key: 'namaGuru', label: 'Guru Pengampu', sortable: true },
    { key: 'tugas', label: 'Tugas', sortable: true },
    { key: 'uts', label: 'UTS', sortable: true },
    { key: 'uas', label: 'UAS', sortable: true },
    { key: 'nilaiAkhir', label: 'Nilai Akhir', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'isValidated', label: 'Valid', sortable: true }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header (Hidden on Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 no-print">
        <div>
          <h2 className="text-xl font-extrabold text-navy-900">Laporan Nilai Siswa</h2>
          <p className="text-xs text-navy-500 mt-1">Unduh, cetak, atau rekap seluruh daftar nilai akademik sekolah.</p>
        </div>
        <div className="flex items-center space-x-2">
          {/* Class Filter */}
          <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-navy-200">
            <Filter className="w-4 h-4 text-navy-400" />
            <select
              value={selectedKelas}
              onChange={(e) => setSelectedKelas(e.target.value)}
              className="text-xs font-bold text-navy-700 bg-transparent outline-none cursor-pointer"
            >
              <option value="">Semua Kelas</option>
              {kelasList.map(kelas => (
                <option key={kelas} value={kelas}>{kelas}</option>
              ))}
            </select>
          </div>

          <Button variant="secondary" onClick={handlePrint} icon={Printer}>
            Cetak / PDF
          </Button>
        </div>
      </div>

      {/* Print Only Header */}
      <div className="hidden print:block text-center space-y-2 mb-8 border-b-2 border-navy-900 pb-4">
        <h1 className="text-2xl font-black text-navy-900 uppercase">Laporan Hasil Penilaian Siswa (EduScore)</h1>
        <p className="text-sm font-semibold text-navy-600">
          Kelas: {selectedKelas || 'Semua Kelas'} | Tanggal Cetak: {new Date().toLocaleDateString('id-ID')}
        </p>
      </div>

      {/* Data Table */}
      <div className="print-table-container">
        <Table
          columns={columns}
          data={laporanData}
          searchKeys={['nis', 'namaSiswa', 'mataPelajaran', 'namaGuru']}
          searchPlaceholder="Cari siswa, NIS, mapel, atau guru..."
          renderRow={(item) => (
            <tr key={item.id} className="hover:bg-navy-50/40 transition-colors break-inside-avoid">
              <td className="px-6 py-4 text-sm font-semibold text-navy-500">{item.no}</td>
              <td className="px-6 py-4 text-sm font-bold text-navy-800">{item.nis}</td>
              <td className="px-6 py-4 text-sm font-semibold text-navy-900">{item.namaSiswa}</td>
              <td className="px-6 py-4 text-sm text-navy-600 font-medium">{item.kelas}</td>
              <td className="px-6 py-4 text-sm text-navy-700 font-medium">{item.mataPelajaran}</td>
              <td className="px-6 py-4 text-sm text-navy-600">{item.namaGuru}</td>
              <td className="px-6 py-4 text-sm text-center text-navy-800">{item.tugas}</td>
              <td className="px-6 py-4 text-sm text-center text-navy-800">{item.uts}</td>
              <td className="px-6 py-4 text-sm text-center text-navy-800">{item.uas}</td>
              <td className="px-6 py-4 text-sm font-black text-center text-navy-900">{item.nilaiAkhir}</td>
              <td className="px-6 py-4">
                <Badge status={item.status} />
              </td>
              <td className="px-6 py-4">
                <span className={`
                  inline-block px-2 py-0.5 rounded text-[10px] font-bold border
                  ${item.isValidated === 'Ya' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-amber-50 text-amber-700 border-amber-200'}
                `}>
                  {item.isValidated}
                </span>
              </td>
            </tr>
          )}
        />
      </div>

      {/* Print Footer */}
      <div className="hidden print:flex justify-between items-center mt-12 text-xs font-semibold text-navy-500 px-6">
        <div>
          <p>Kepala Sekolah,</p>
          <div className="h-16" />
          <p className="font-bold border-t border-navy-400 pt-1 text-navy-800">Drs. H. Mulyono, M.Pd.</p>
        </div>
        <div>
          <p>Admin Kurikulum,</p>
          <div className="h-16" />
          <p className="font-bold border-t border-navy-400 pt-1 text-navy-800">EduScore System</p>
        </div>
      </div>
    </div>
  );
}
