import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Guru } from '../../classes/Guru';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function AdminGuru() {
  const { guru, addGuru, updateGuru, deleteGuru, loading } = useData();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [selectedId, setSelectedId] = useState(null);

  // Form State
  const [idGuru, setIdGuru] = useState('');
  const [namaGuru, setNamaGuru] = useState('');
  const [mataPelajaran, setMataPelajaran] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!idGuru.trim()) newErrors.idGuru = 'ID Guru wajib diisi';
    if (!namaGuru.trim()) newErrors.namaGuru = 'Nama Guru wajib diisi';
    if (!mataPelajaran.trim()) newErrors.mataPelajaran = 'Mata Pelajaran wajib diisi';

    // Check if ID Guru already exists in add mode
    if (modalMode === 'add') {
      if (!email.trim()) newErrors.email = 'Email wajib diisi';
      if (!password.trim()) newErrors.password = 'Password wajib diisi';
      if (guru.some(g => g.idGuru === idGuru.trim())) {
        newErrors.idGuru = 'ID Guru sudah terdaftar';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenAdd = () => {
    setModalMode('add');
    setSelectedId(null);
    setIdGuru('');
    setNamaGuru('');
    setMataPelajaran('');
    setEmail('');
    setPassword('');
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setModalMode('edit');
    setSelectedId(item.id);
    setIdGuru(item.idGuru || '');
    setNamaGuru(item.namaGuru || '');
    setMataPelajaran(item.mataPelajaran || '');
    setEmail('');
    setPassword('');
    setErrors({});
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!validate()) return;

    // Instantiate Guru class
    const guruInstance = new Guru({
      idGuru: idGuru.trim(),
      namaGuru: namaGuru.trim(),
      mataPelajaran: mataPelajaran.trim()
    });

    try {
      if (modalMode === 'add') {
        // Create user in Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Save to users collection
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          nama: namaGuru.trim(),
          role: 'guru',
          status: 'active', // Since Admin adds, status is directly active
          idGuru: idGuru.trim(),
          mataPelajaran: mataPelajaran.trim()
        });

        // Save to guru collection with UID as document ID
        await setDoc(doc(db, 'guru', user.uid), {
          idGuru: idGuru.trim(),
          namaGuru: namaGuru.trim(),
          mataPelajaran: mataPelajaran.trim(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        showToast("Guru berhasil ditambahkan!", "success");
      } else {
        await updateGuru(selectedId, guruInstance.toFirestore());
        showToast("Data guru berhasil diperbarui!", "success");
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      showToast("Gagal menyimpan data guru.", "error");
    }
  };

  const handleOpenDelete = (id) => {
    setSelectedId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteGuru(selectedId);
      showToast("Guru berhasil dihapus!", "success");
      setIsDeleteModalOpen(false);
    } catch (err) {
      showToast("Gagal menghapus guru.", "error");
    }
  };

  const columns = [
    { key: 'no', label: 'No', sortable: false },
    { key: 'idGuru', label: 'ID Guru', sortable: true },
    { key: 'namaGuru', label: 'Nama Guru', sortable: true },
    { key: 'mataPelajaran', label: 'Mata Pelajaran', sortable: true },
    { key: 'aksi', label: 'Aksi', sortable: false }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h2 className="text-xl font-extrabold text-navy-900">Manajemen Guru</h2>
          <p className="text-xs text-navy-500 mt-1">Kelola data tenaga pengajar beserta spesifikasi mata pelajaran mereka.</p>
        </div>
        <Button variant="primary" onClick={handleOpenAdd} icon={Plus}>
          Tambah Guru
        </Button>
      </div>

      {/* Table Data */}
      <Table
        columns={columns}
        data={guru}
        searchKeys={['idGuru', 'namaGuru', 'mataPelajaran']}
        searchPlaceholder="Cari berdasarkan nama, ID, atau mapel..."
        renderRow={(item, index) => (
          <tr key={item.id} className="hover:bg-navy-50/40 transition-colors">
            <td className="px-6 py-4 text-sm font-semibold text-navy-500">{index + 1}</td>
            <td className="px-6 py-4 text-sm font-bold text-navy-800">{item.idGuru}</td>
            <td className="px-6 py-4 text-sm font-semibold text-navy-900">{item.namaGuru}</td>
            <td className="px-6 py-4 text-sm text-navy-600 font-medium">{item.mataPelajaran}</td>
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
        title={modalMode === 'add' ? 'Tambah Guru Baru' : 'Ubah Data Guru'}
        onConfirm={handleSave}
        confirmText="Simpan"
        size="md"
      >
        <div className="space-y-4">
          <Input
            id="idGuru"
            label="ID Guru (NIP/Kode)"
            placeholder="Contoh: G001"
            value={idGuru}
            onChange={(e) => setIdGuru(e.target.value)}
            error={errors.idGuru}
            required
            disabled={modalMode === 'edit'}
          />
          <Input
            id="namaGuru"
            label="Nama Lengkap Guru"
            placeholder="Contoh: Budi Santoso, M.Pd."
            value={namaGuru}
            onChange={(e) => setNamaGuru(e.target.value)}
            error={errors.namaGuru}
            required
          />
          {modalMode === 'add' && (
            <>
              <Input
                id="email"
                type="email"
                label="Email"
                placeholder="guru@sekolah.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                required
              />
              <Input
                id="password"
                type="text"
                label="Password (Minimum 6 Karakter)"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                required
              />
            </>
          )}
          <Input
            id="mataPelajaran"
            label="Mata Pelajaran"
            placeholder="Contoh: Matematika"
            value={mataPelajaran}
            onChange={(e) => setMataPelajaran(e.target.value)}
            error={errors.mataPelajaran}
            required
          />
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Konfirmasi Hapus Guru"
        onConfirm={handleDelete}
        confirmText="Hapus"
        confirmVariant="danger"
        size="sm"
      >
        <p className="text-sm text-navy-700">
          Apakah Anda yakin ingin menghapus data guru ini? Data pengampu mata pelajaran akan dihapus.
        </p>
      </Modal>
    </div>
  );
}
