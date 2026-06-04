import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { useToast } from '../../context/ToastContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Save } from 'lucide-react';

export default function ProfilSiswa() {
  const { currentUser, userData } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    nis: '',
    nama: '',
    kelas: ''
  });

  useEffect(() => {
    const fetchSiswaData = async () => {
      if (!currentUser?.uid) return;
      try {
        const docRef = doc(db, 'siswa', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            nis: data.nis || userData?.nis || '',
            nama: data.nama || userData?.nama || '',
            kelas: data.kelas || ''
          });
        }
      } catch (err) {
        console.error("Gagal mengambil data siswa:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSiswaData();
  }, [currentUser, userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Update data di koleksi siswa
      const siswaRef = doc(db, 'siswa', currentUser.uid);
      await setDoc(siswaRef, {
        nis: formData.nis,
        nama: formData.nama,
        kelas: formData.kelas,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      // Update data di koleksi users agar sinkron
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, {
        nis: formData.nis,
        nama: formData.nama
      }, { merge: true });

      showToast("Profil berhasil diperbarui!", "success");
    } catch (err) {
      console.error(err);
      showToast("Gagal memperbarui profil.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Profil Saya</h2>
        <p className="text-sm text-slate-500 mt-1">Perbarui informasi profil Anda.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="nis"
            name="nis"
            label="Nomor Induk Siswa (NIS)"
            value={formData.nis}
            onChange={handleChange}
            required
          />
          <Input
            id="nama"
            name="nama"
            label="Nama Lengkap"
            value={formData.nama}
            onChange={handleChange}
            required
          />
          <Input
            id="kelas"
            name="kelas"
            label="Kelas"
            value={formData.kelas}
            onChange={handleChange}
            required
          />

          <div className="pt-4">
            <Button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
