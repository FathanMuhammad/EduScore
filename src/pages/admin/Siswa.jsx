import React, { useState } from 'react';
import useSiswa from '../../hooks/useSiswa';
import { Siswa } from '../../classes/Siswa';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import Badge from '../../components/Badge';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function AdminSiswa() {
  const { siswa, addSiswa, updateSiswa, deleteSiswa, loading } = useSiswa();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [selectedId, setSelectedId] = useState(null);

  // Form State
  const [nis, setNis] = useState('');
  const [nama, setNama] = useState('');
  const [kelas, setKelas] = useState('');
  const [nilaiTugas, setNilaiTugas] = useState('0');
  const [nilaiUTS, setNilaiUTS] = useState('0');
  const [nilaiUAS, setNilaiUAS] = useState('0');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!nis.trim()) newErrors.nis = 'NIS wajib diisi';
    if (!nama.trim()) newErrors.nama = 'Nama wajib diisi';
    if (!kelas.trim()) newErrors.kelas = 'Kelas wajib diisi';
    
    // Check if NIS already exists in add mode
    if (modalMode === 'add' && siswa.some(s => s.nis === nis.trim())) {
      newErrors.nis = 'NIS sudah terdaftar';
    }

    const t = parseFloat(nilaiTugas);
    if (isNaN(t) || t < 0 || t > 100) newErrors.nilaiTugas = 'Nilai Tugas harus 0-100';
    const ut = parseFloat(nilaiUTS);
    if (isNaN(ut) || ut < 0 || ut > 100) newErrors.nilaiUTS = 'Nilai UTS harus 0-100';
    const ua = parseFloat(nilaiUAS);
    if (isNaN(ua) || ua < 0 || ua > 100) newErrors.nilaiUAS = 'Nilai UAS harus 0-100';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenAdd = () => {
    setModalMode('add');
    setSelectedId(null);
    setNis('');
    setNama('');
    setKelas('');
    setNilaiTugas('0');
    setNilaiUTS('0');
    setNilaiUAS('0');
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setModalMode('edit');
    setSelectedId(item.id);
    setNis(item.nis || '');
    setNama(item.nama || '');
    setKelas(item.kelas || '');
    setNilaiTugas(String(item.nilaiTugas || 0));
    setNilaiUTS(String(item.nilaiUTS || 0));
    setNilaiUAS(String(item.nilaiUAS || 0));
    setErrors({});
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!validate()) return;

    // Instantiate Siswa class
    const siswaInstance = new Siswa({
      nis: nis.trim(),
      nama: nama.trim(),
      kelas: kelas.trim(),
      nilaiTugas: parseFloat(nilaiTugas),
      nilaiUTS: parseFloat(nilaiUTS),
      nilaiUAS: parseFloat(nilaiUAS)
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h2 className="text-xl font-extrabold text-navy-900">Manajemen Siswa</h2>
          <p className="text-xs text-navy-500 mt-1">Kelola biodata, kelas, serta nilai akumulasi umum siswa.</p>
        </div>
        <Button variant="primary" onClick={handleOpenAdd} icon={Plus}>
          Tambah Siswa
        </Button>
      </div>

      {/* Table Data */}
      <Table
        columns={columns}
        data={siswa}
        searchKeys={['nis', 'nama', 'kelas']}
        searchPlaceholder="Cari berdasarkan nama, NIS, atau kelas..."
        renderRow={(item, index) => (
          <tr key={item.id} className="hover:bg-navy-50/40 transition-colors">
            <td className="px-6 py-4 text-sm font-semibold text-navy-500">{index + 1}</td>
            <td className="px-6 py-4 text-sm font-bold text-navy-800">{item.nis}</td>
            <td className="px-6 py-4 text-sm font-semibold text-navy-900">{item.nama}</td>
            <td className="px-6 py-4 text-sm text-navy-600 font-medium">{item.kelas}</td>
            <td className="px-6 py-4 text-sm font-bold text-navy-800">{item.nilaiAkhir ?? '-'}</td>
            <td className="px-6 py-4">
              <Badge status={item.status} />
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
          
          <div className="border-t border-navy-100 pt-4 mt-2">
            <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-3">Nilai Kumulatif (Umum)</h4>
            <div className="grid grid-cols-3 gap-3">
              <Input
                id="nilaiTugas"
                type="number"
                label="Tugas (30%)"
                value={nilaiTugas}
                onChange={(e) => setNilaiTugas(e.target.value)}
                error={errors.nilaiTugas}
                min="0"
                max="100"
              />
              <Input
                id="nilaiUTS"
                type="number"
                label="UTS (30%)"
                value={nilaiUTS}
                onChange={(e) => setNilaiUTS(e.target.value)}
                error={errors.nilaiUTS}
                min="0"
                max="100"
              />
              <Input
                id="nilaiUAS"
                type="number"
                label="UAS (40%)"
                value={nilaiUAS}
                onChange={(e) => setNilaiUAS(e.target.value)}
                error={errors.nilaiUAS}
                min="0"
                max="100"
              />
            </div>
            {nis && nama && kelas && (
              <div className="p-3 bg-navy-50 border border-navy-100 rounded-lg mt-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-navy-400 font-extrabold uppercase block">Kalkulasi Nilai Akhir</span>
                  <span className="text-sm font-black text-navy-800">
                    {new Siswa({ nis, nama, kelas, nilaiTugas, nilaiUTS, nilaiUAS }).getNilaiAkhir()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-navy-400 font-extrabold uppercase block text-right">Predikat</span>
                  <Badge status={new Siswa({ nis, nama, kelas, nilaiTugas, nilaiUTS, nilaiUAS }).getStatus()} />
                </div>
              </div>
            )}
          </div>
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
