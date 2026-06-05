import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db, auth } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useToast } from '../../context/ToastContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Save } from 'lucide-react';
import { updatePassword } from 'firebase/auth';

export default function ProfilGuru() {
  const { currentUser, userData } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);

  const [formData, setFormData] = useState({
    idGuru: '',
    namaGuru: '',
    mataPelajaran: ''
  });

  useEffect(() => {
    const fetchGuruData = async () => {
      if (!currentUser?.uid) return;
      try {
        const docRef = doc(db, 'guru', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            idGuru: data.idGuru || userData?.idGuru || '',
            namaGuru: data.namaGuru || userData?.nama || '',
            mataPelajaran: data.mataPelajaran || userData?.mataPelajaran || ''
          });
        }
      } catch (err) {
        console.error("Gagal mengambil data guru:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGuruData();
  }, [currentUser, userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Update data in guru collection
      const guruRef = doc(db, 'guru', currentUser.uid);
      await setDoc(guruRef, {
        namaGuru: formData.namaGuru,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      // Update data in users collection for synchronization
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, {
        nama: formData.namaGuru
      }, { merge: true });

      showToast("Profil berhasil diperbarui!", "success");
    } catch (err) {
      console.error(err);
      showToast("Gagal memperbarui profil.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!newPassword) {
      showToast("Password baru wajib diisi", "error");
      return;
    }
    if (newPassword.length < 6) {
      showToast("Password minimal 6 karakter", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("Konfirmasi password tidak cocok", "error");
      return;
    }

    setPasswordSaving(true);
    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        showToast("Password berhasil diperbarui!", "success");
        setNewPassword('');
        setConfirmPassword('');
        sessionStorage.removeItem('needPasswordChange');
      } else {
        throw new Error('Sesi pengguna tidak valid');
      }
    } catch (err) {
      console.error(err);
      showToast(err.message || "Gagal mengubah password.", "error");
    } finally {
      setPasswordSaving(false);
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
            id="idGuru"
            name="idGuru"
            label="ID Guru (NIP/Kode)"
            value={formData.idGuru}
            disabled
            required
          />
          <Input
            id="namaGuru"
            name="namaGuru"
            label="Nama Lengkap"
            value={formData.namaGuru}
            onChange={handleChange}
            required
          />
          <Input
            id="mataPelajaran"
            name="mataPelajaran"
            label="Mata Pelajaran"
            value={formData.mataPelajaran}
            disabled
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

      {/* Password Change Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Ubah Password</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Input
            id="newPassword"
            type="password"
            label="Password Baru"
            placeholder="Minimal 6 karakter"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Input
            id="confirmPassword"
            type="password"
            label="Konfirmasi Password Baru"
            placeholder="Ulangi password baru"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <div className="pt-2">
            <Button
              type="submit"
              disabled={passwordSaving}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {passwordSaving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Ubah Password</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
