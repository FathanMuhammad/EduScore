import React, { useState } from 'react';
import useSiswa from '../../hooks/useSiswa';
import useNilai from '../../hooks/useNilai';
import { Siswa } from '../../classes/Siswa';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import Badge from '../../components/Badge';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function AdminSiswa() {
  const { siswa, addSiswa, updateSiswa, deleteSiswa, loading: siswaLoading } = useSiswa();
  const { nilai, loading: nilaiLoading } = useNilai();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [selectedId, setSelectedId] = useState(null);

  const [nis, setNis] = useState('');
  const [nama, setNama] = useState('');
  const [kelas, setKelas] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!nis.trim()) newErrors.nis = 'NIS wajib diisi';
    if (!nama.trim()) newErrors.nama = 'Nama wajib diisi';
    if (!kelas.trim()) newErrors.kelas = 'Kelas wajib diisi';

    if (modalMode === 'add' && siswa.some(s => s.nis === nis.trim())) {
      newErrors.nis = 'NIS sudah terdaftar';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenAdd = () => {
    setModalMode('add');
    setSelectedId(null);
    setNis('');
    setNama('');
    setKelas('');
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setModalMode('edit');
    setSelectedId(item.id);
    setNis(item.nis || '');
    setNama(item.nama || '');
    setKelas(item.kelas || '');
    setErrors({});
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!validate()) return;

    // Instantiate Siswa class
    const siswaInstance = new Siswa({
      nis: nis.trim(),
      nama: nama.trim(),
      kelas: kelas.trim()
    });

    try {
      if (modalMode === 'add') {
        await addSiswa(siswaInstance.toFirestore());
        showToast("Siswa berhasil ditambahkan!", "success");
      } else {
        await updateSiswa(selectedId, siswaInstance.toFirestore());
        showToast("Data siswa berhasil diperbarui!", "success");
      }
      setIsModalOpen(false);
    } catch (err) {
      showToast("Gagal menyimpan data siswa.", "error");
    }
  };

  const handleOpenDelete = (id) => {
    setSelectedId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteSiswa(selectedId);
      showToast("Siswa berhasil dihapus!", "success");
      setIsDeleteModalOpen(false);
    } catch (err) {
      showToast("Gagal menghapus siswa.", "error");
    }
  };

  const columns = [
    { key: 'no', label: 'No', sortable: false },
    { key: 'nis', label: 'NIS', sortable: true },
    { key: 'nama', label: 'Nama', sortable: true },
    { key: 'kelas', label: 'Kelas', sortable: true },
    { key: 'nilaiAkhir', label: 'Nilai Akhir', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'aksi', label: 'Aksi', sortable: false }
  ];

  // Calculate dynamic grades for table
  const tableData = siswa.map(item => {
    const nilaiSiswa = nilai.filter(n => n.nis === item.nis);
    let avg = 0;
    let status = 'Belum Dinilai';
    if (nilaiSiswa.length > 0) {
      const sum = nilaiSiswa.reduce((acc, curr) => acc + (parseFloat(curr.nilaiAkhir) || 0), 0);
      avg = Math.round((sum / nilaiSiswa.length) * 100) / 100;
      status = avg >= 70 ? 'Lulus' : 'Tidak Lulus';
    } else {
      avg = '-';
    }
    return {
      ...item,
      calculatedNilaiAkhir: avg,
      calculatedStatus: status
    };
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h2 className="text-xl font-extrabold text-navy-900">Manajemen Siswa</h2>
          <p className="text-xs text-navy-500 mt-1">Kelola biodata dan lihat nilai akumulasi rapor siswa.</p>
        </div>
        <Button variant="primary" onClick={handleOpenAdd} icon={Plus}>
          Tambah Siswa
        </Button>
      </div>

      {/* Table Data */}
      <Table
        columns={columns}
        data={tableData}
        searchKeys={['nis', 'nama', 'kelas']}
        searchPlaceholder="Cari berdasarkan nama, NIS, atau kelas..."
        renderRow={(item, index) => (
          <tr key={item.id} className="hover:bg-navy-50/40 transition-colors">
            <td className="px-6 py-4 text-sm font-semibold text-navy-500">{index + 1}</td>
            <td className="px-6 py-4 text-sm font-bold text-navy-800">{item.nis}</td>
            <td className="px-6 py-4 text-sm font-semibold text-navy-900">{item.nama}</td>
            <td className="px-6 py-4 text-sm text-navy-600 font-medium">{item.kelas}</td>
            <td className="px-6 py-4 text-sm font-bold text-navy-800">{item.calculatedNilaiAkhir}</td>
            <td className="px-6 py-4">
              <Badge status={item.calculatedStatus} />
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-1.5 text-navy-600 hover:text-navy-900 hover:bg-navy-50 rounded-lg transition-colors"
                  title="Ubah data"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleOpenDelete(item.id)}
                  className="p-1.5 text-rose-600 hover:text-rose-950 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Hapus data"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        )}
      />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'add' ? 'Tambah Siswa Baru' : 'Ubah Data Siswa'}
        onConfirm={handleSave}
        confirmText="Simpan"
        size="md"
      >
        <div className="space-y-4">
          <Input
            id="nis"
            label="Nomor Induk Siswa (NIS)"
            placeholder="Contoh: 12345"
            value={nis}
            onChange={(e) => setNis(e.target.value)}
            error={errors.nis}
            required
            disabled={modalMode === 'edit'} // Lock NIS on edit
          />
          <Input
            id="nama"
            label="Nama Lengkap"
            placeholder="Contoh: Fathan Muhammad"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            error={errors.nama}
            required
          />
          <Input
            id="kelas"
            label="Kelas"
            placeholder="Contoh: XII-RPL-1"
            value={kelas}
            onChange={(e) => setKelas(e.target.value)}
            error={errors.kelas}
            required
          />

        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Konfirmasi Hapus Siswa"
        onConfirm={handleDelete}
        confirmText="Hapus"
        confirmVariant="danger"
        size="sm"
      >
        <p className="text-sm text-navy-700">
          Apakah Anda yakin ingin menghapus data siswa ini? Semua data nilai yang terhubung dengan siswa ini juga akan dihapus secara permanen.
        </p>
      </Modal>
    </div>
  );
}
