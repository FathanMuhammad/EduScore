import React, { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import useNilai from '../../hooks/useNilai';
import { Guru } from '../../classes/Guru';
import { useToast } from '../../context/ToastContext';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';
import { Check, Trash2, ShieldAlert } from 'lucide-react';

export default function GuruRekap() {
  const { userData } = useAuth();
  const { updateNilai, deleteNilai } = useData();
  const { getNilaiByGuru, loading } = useNilai();
  const { showToast } = useToast();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const teacherId = userData?.idGuru || 'g1';

  // Get only grades matching this teacher
  const teacherGrades = useMemo(() => {
    return getNilaiByGuru(teacherId);
  }, [getNilaiByGuru, teacherId]);

  const handleValidate = async (item) => {
    try {
      // 1. Instantiate Guru
      const guruInstance = new Guru({
        idGuru: userData?.idGuru || 'g1',
        namaGuru: userData?.nama || 'Guru Budi',
        mataPelajaran: userData?.mataPelajaran || 'Matematika'
      });

      // 2. Perform OOP validation mapping
      const validatedPayload = guruInstance.validasiNilai(item);

      // 3. Persist update in DB
      await updateNilai(item.id, {
        isValidated: validatedPayload.isValidated,
        updatedAt: validatedPayload.updatedAt
      });

      showToast(`Nilai untuk ${item.namaSiswa} berhasil divalidasi!`, 'success');
    } catch (err) {
      showToast('Gagal memvalidasi nilai.', 'error');
    }
  };

  const handleOpenDelete = (id) => {
    setSelectedId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteNilai(selectedId);
      showToast('Data nilai berhasil dihapus.', 'success');
      setIsDeleteModalOpen(false);
    } catch (err) {
      showToast('Gagal menghapus data nilai.', 'error');
    }
  };

  const columns = [
    { key: 'no', label: 'No', sortable: false },
    { key: 'nis', label: 'NIS', sortable: true },
    { key: 'namaSiswa', label: 'Nama Siswa', sortable: true },
    { key: 'kelas', label: 'Kelas', sortable: true },
    { key: 'tugas', label: 'Tugas', sortable: true },
    { key: 'uts', label: 'UTS', sortable: true },
    { key: 'uas', label: 'UAS', sortable: true },
    { key: 'nilaiAkhir', label: 'Nilai Akhir', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'isValidated', label: 'Status Validasi', sortable: true },
    { key: 'aksi', label: 'Aksi', sortable: false }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-extrabold text-navy-900">Rekap Nilai Siswa</h2>
        <p className="text-xs text-navy-500 mt-1">
          Daftar seluruh nilai siswa yang telah Anda masukkan untuk mata pelajaran <strong className="text-navy-900">{userData?.mataPelajaran || 'Matematika'}</strong>.
        </p>
      </div>

      {/* Table Data */}
      <Table
        columns={columns}
        data={teacherGrades}
        searchKeys={['nis', 'namaSiswa', 'kelas']}
        searchPlaceholder="Cari siswa, NIS, atau kelas..."
        renderRow={(item, index) => (
          <tr key={item.id} className="hover:bg-navy-50/40 transition-colors">
            <td className="px-6 py-4 text-sm font-semibold text-navy-500">{index + 1}</td>
            <td className="px-6 py-4 text-sm font-bold text-navy-800">{item.nis}</td>
            <td className="px-6 py-4 text-sm font-semibold text-navy-900">{item.namaSiswa}</td>
            <td className="px-6 py-4 text-sm text-navy-600 font-medium">{item.kelas}</td>
            <td className="px-6 py-4 text-sm text-center text-navy-800">{item.tugas}</td>
            <td className="px-6 py-4 text-sm text-center text-navy-800">{item.uts}</td>
            <td className="px-6 py-4 text-sm text-center text-navy-800">{item.uas}</td>
            <td className="px-6 py-4 text-sm font-black text-center text-navy-900">{item.nilaiAkhir}</td>
            <td className="px-6 py-4">
              <Badge status={item.status} />
            </td>
            <td className="px-6 py-4">
              <span className={`
                inline-block px-2.5 py-0.5 rounded text-[10px] font-bold border
                ${item.isValidated 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-amber-50 text-amber-700 border-amber-200'}
              `}>
                {item.isValidated ? 'Tervalidasi' : 'Belum Valid'}
              </span>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center space-x-1.5">
                {!item.isValidated && (
                  <button
                    onClick={() => handleValidate(item)}
                    className="p-1.5 text-emerald-600 hover:text-emerald-900 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-200"
                    title="Validasi Nilai"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleOpenDelete(item.id)}
                  className="p-1.5 text-rose-600 hover:text-rose-950 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                  title="Hapus Nilai"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        )}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Konfirmasi Hapus Nilai"
        onConfirm={handleDelete}
        confirmText="Hapus"
        confirmVariant="danger"
        size="sm"
      >
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-rose-50 text-rose-600 rounded-lg flex-shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <p className="text-sm text-navy-700 leading-relaxed">
            Apakah Anda yakin ingin menghapus data nilai siswa ini? Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>
      </Modal>
    </div>
  );
}
