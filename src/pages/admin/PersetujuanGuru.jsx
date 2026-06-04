import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { useToast } from '../../context/ToastContext';
import { UserCheck, XCircle, CheckCircle } from 'lucide-react';
import Button from '../../components/Button';

export default function PersetujuanGuru() {
  const [pendingGurus, setPendingGurus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    const q = query(
      collection(db, 'users'),
      where('role', '==', 'guru'),
      where('status', '==', 'pending')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPendingGurus(data);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching pending gurus:", err);
      showToast("Gagal memuat data persetujuan", "error");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [showToast]);

  const handleApprove = async (id, nama, idGuru, mataPelajaran) => {
    setActionLoading(id);
    try {
      const userRef = doc(db, 'users', id);
      await updateDoc(userRef, { status: 'active' });
      
      // Add to guru collection
      const guruRef = doc(db, 'guru', id);
      await setDoc(guruRef, {
        idGuru: idGuru || `G${id.substring(0, 4).toUpperCase()}`,
        namaGuru: nama,
        mataPelajaran: mataPelajaran || 'Belum Ditentukan',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      showToast(`Akun guru ${nama} berhasil disetujui!`, 'success');
    } catch (err) {
      console.error(err);
      showToast("Gagal menyetujui akun", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id, nama) => {
    if (!window.confirm(`Apakah Anda yakin ingin menolak pendaftaran ${nama}?`)) return;
    
    setActionLoading(id);
    try {
      const userRef = doc(db, 'users', id);
      await updateDoc(userRef, { status: 'rejected' });
      showToast(`Pendaftaran ${nama} telah ditolak.`, 'info');
    } catch (err) {
      console.error(err);
      showToast("Gagal menolak akun", "error");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Persetujuan Akun Guru</h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola pendaftaran akun guru baru yang menunggu persetujuan.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="px-6 py-4 font-semibold">Nama Lengkap</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                    <div className="flex justify-center items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                      <span>Memuat data...</span>
                    </div>
                  </td>
                </tr>
              ) : pendingGurus.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                    <UserCheck className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                    <p className="text-lg font-medium text-slate-700">Tidak ada permohonan</p>
                    <p className="text-sm">Semua pendaftaran guru telah diproses.</p>
                  </td>
                </tr>
              ) : (
                pendingGurus.map((guru) => (
                  <tr key={guru.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{guru.nama}</td>
                    <td className="px-6 py-4 text-slate-600">{guru.email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        Menunggu Persetujuan
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button
                        variant="primary"
                        onClick={() => handleApprove(guru.id, guru.nama, guru.idGuru, guru.mataPelajaran)}
                        disabled={actionLoading === guru.id}
                        className="!px-3 !py-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 text-white"
                      >
                        <CheckCircle className="w-3.5 h-3.5 mr-1" />
                        Setujui
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleReject(guru.id, guru.nama)}
                        disabled={actionLoading === guru.id}
                        className="!px-3 !py-1.5 text-xs bg-rose-50 text-rose-600 hover:bg-rose-100 border-none"
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1" />
                        Tolak
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
