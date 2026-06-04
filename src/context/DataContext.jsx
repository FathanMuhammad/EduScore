import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  where,
  getDocs
} from 'firebase/firestore';

const DataContext = createContext(null);

// MOCK SEED DATA
const DEFAULT_SISWA = [
  { id: 's1', nis: '12345', nama: 'Fathan Muhammad', kelas: 'XII-RPL-1', nilaiTugas: 80, nilaiUTS: 75, nilaiUAS: 85, nilaiAkhir: 81, status: 'Lulus', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 's2', nis: '12346', nama: 'Budi Luhur', kelas: 'XII-RPL-1', nilaiTugas: 90, nilaiUTS: 85, nilaiUAS: 90, nilaiAkhir: 88.5, status: 'Lulus', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 's3', nis: '12347', nama: 'Citra Lestari', kelas: 'XII-RPL-2', nilaiTugas: 60, nilaiUTS: 55, nilaiUAS: 65, nilaiAkhir: 60.5, status: 'Tidak Lulus', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
];

const DEFAULT_GURU = [
  { id: 'g1', idGuru: 'G001', namaGuru: 'Budi Santoso, M.Pd.', mataPelajaran: 'Matematika', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'g2', idGuru: 'G002', namaGuru: 'Siti Rahma, S.Kom.', mataPelajaran: 'Rekayasa Perangkat Lunak', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
];

const DEFAULT_NILAI = [
  { id: 'n1', idSiswa: 's1', nis: '12345', namaSiswa: 'Fathan Muhammad', kelas: 'XII-RPL-1', mataPelajaran: 'Matematika', idGuru: 'g1', namaGuru: 'Budi Santoso, M.Pd.', tugas: 80, uts: 75, uas: 85, nilaiAkhir: 81, status: 'Lulus', isValidated: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'n2', idSiswa: 's1', nis: '12345', namaSiswa: 'Fathan Muhammad', kelas: 'XII-RPL-1', mataPelajaran: 'Rekayasa Perangkat Lunak', idGuru: 'g2', namaGuru: 'Siti Rahma, S.Kom.', tugas: 90, uts: 85, uas: 90, nilaiAkhir: 88.5, status: 'Lulus', isValidated: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'n3', idSiswa: 's2', nis: '12346', namaSiswa: 'Budi Luhur', kelas: 'XII-RPL-1', mataPelajaran: 'Matematika', idGuru: 'g1', namaGuru: 'Budi Santoso, M.Pd.', tugas: 85, uts: 80, uas: 88, nilaiAkhir: 84.7, status: 'Lulus', isValidated: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'n4', idSiswa: 's3', nis: '12347', namaSiswa: 'Citra Lestari', kelas: 'XII-RPL-2', mataPelajaran: 'Matematika', idGuru: 'g1', namaGuru: 'Budi Santoso, M.Pd.', tugas: 60, uts: 55, uas: 65, nilaiAkhir: 60.5, status: 'Tidak Lulus', isValidated: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
];

export const DataProvider = ({ children }) => {
  const { currentUser, isMock } = useAuth();
  
  const [siswa, setSiswa] = useState([]);
  const [guru, setGuru] = useState([]);
  const [nilai, setNilai] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize Local Mock DB
  const initMockDB = () => {
    if (!localStorage.getItem('eduscore_siswa')) {
      localStorage.setItem('eduscore_siswa', JSON.stringify(DEFAULT_SISWA));
    }
    if (!localStorage.getItem('eduscore_guru')) {
      localStorage.setItem('eduscore_guru', JSON.stringify(DEFAULT_GURU));
    }
    if (!localStorage.getItem('eduscore_nilai')) {
      localStorage.setItem('eduscore_nilai', JSON.stringify(DEFAULT_NILAI));
    }

    setSiswa(JSON.parse(localStorage.getItem('eduscore_siswa')));
    setGuru(JSON.parse(localStorage.getItem('eduscore_guru')));
    setNilai(JSON.parse(localStorage.getItem('eduscore_nilai')));
    setLoading(false);
  };

  // Sync state for mock changes
  const updateMockLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
    if (key === 'eduscore_siswa') setSiswa(data);
    if (key === 'eduscore_guru') setGuru(data);
    if (key === 'eduscore_nilai') setNilai(data);
  };

  useEffect(() => {
    if (isMock) {
      initMockDB();
    } else {
      if (!currentUser) {
        setSiswa([]);
        setGuru([]);
        setNilai([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      // 1. Realtime Siswa
      const unsubSiswa = onSnapshot(collection(db, 'siswa'), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSiswa(data);
      }, (err) => console.error("Error fetching siswa:", err));

      // 2. Realtime Guru
      const unsubGuru = onSnapshot(collection(db, 'guru'), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setGuru(data);
      }, (err) => console.error("Error fetching guru:", err));

      // 3. Realtime Nilai
      const unsubNilai = onSnapshot(collection(db, 'nilai'), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNilai(data);
        setLoading(false);
      }, (err) => {
        console.error("Error fetching nilai:", err);
        setLoading(false);
      });

      return () => {
        unsubSiswa();
        unsubGuru();
        unsubNilai();
      };
    }
  }, [currentUser, isMock]);

  // SISWA CRUD
  const addSiswa = async (siswaData) => {
    const payload = {
      ...siswaData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    if (isMock) {
      const current = JSON.parse(localStorage.getItem('eduscore_siswa')) || [];
      const newSiswa = { id: `siswa_${Date.now()}`, ...payload };
      updateMockLocalStorage('eduscore_siswa', [...current, newSiswa]);
      return newSiswa;
    } else {
      const docRef = await addDoc(collection(db, 'siswa'), payload);
      return { id: docRef.id, ...payload };
    }
  };

  const updateSiswa = async (id, siswaData) => {
    const payload = {
      ...siswaData,
      updatedAt: new Date().toISOString()
    };
    if (isMock) {
      const current = JSON.parse(localStorage.getItem('eduscore_siswa')) || [];
      const updated = current.map(item => item.id === id ? { ...item, ...payload } : item);
      updateMockLocalStorage('eduscore_siswa', updated);
      
      // Update matching scores student info if changed
      const nilaiCurrent = JSON.parse(localStorage.getItem('eduscore_nilai')) || [];
      const nilaiUpdated = nilaiCurrent.map(item => 
        item.idSiswa === id ? { ...item, nis: payload.nis, namaSiswa: payload.nama, kelas: payload.kelas } : item
      );
      updateMockLocalStorage('eduscore_nilai', nilaiUpdated);
    } else {
      const docRef = doc(db, 'siswa', id);
      await updateDoc(docRef, payload);
    }
  };

  const deleteSiswa = async (id) => {
    if (isMock) {
      const current = JSON.parse(localStorage.getItem('eduscore_siswa')) || [];
      const filtered = current.filter(item => item.id !== id);
      updateMockLocalStorage('eduscore_siswa', filtered);

      // Also clean up grades for this student
      const nilaiCurrent = JSON.parse(localStorage.getItem('eduscore_nilai')) || [];
      const nilaiFiltered = nilaiCurrent.filter(item => item.idSiswa !== id);
      updateMockLocalStorage('eduscore_nilai', nilaiFiltered);
    } else {
      await deleteDoc(doc(db, 'siswa', id));
      // Delete scores associated with this student manually (or let Firestore rules allow)
      // For LSP context, deleting is fine
    }
  };

  // GURU CRUD
  const addGuru = async (guruData) => {
    const payload = {
      ...guruData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    if (isMock) {
      const current = JSON.parse(localStorage.getItem('eduscore_guru')) || [];
      const newGuru = { id: `guru_${Date.now()}`, ...payload };
      updateMockLocalStorage('eduscore_guru', [...current, newGuru]);
      return newGuru;
    } else {
      const docRef = await addDoc(collection(db, 'guru'), payload);
      return { id: docRef.id, ...payload };
    }
  };

  const updateGuru = async (id, guruData) => {
    const payload = {
      ...guruData,
      updatedAt: new Date().toISOString()
    };
    if (isMock) {
      const current = JSON.parse(localStorage.getItem('eduscore_guru')) || [];
      const updated = current.map(item => item.id === id ? { ...item, ...payload } : item);
      updateMockLocalStorage('eduscore_guru', updated);

      // Update matching scores guru info if changed
      const nilaiCurrent = JSON.parse(localStorage.getItem('eduscore_nilai')) || [];
      const nilaiUpdated = nilaiCurrent.map(item => 
        item.idGuru === id ? { ...item, namaGuru: payload.namaGuru, mataPelajaran: payload.mataPelajaran } : item
      );
      updateMockLocalStorage('eduscore_nilai', nilaiUpdated);
    } else {
      const docRef = doc(db, 'guru', id);
      await updateDoc(docRef, payload);
    }
  };

  const deleteGuru = async (id) => {
    if (isMock) {
      const current = JSON.parse(localStorage.getItem('eduscore_guru')) || [];
      const filtered = current.filter(item => item.id !== id);
      updateMockLocalStorage('eduscore_guru', filtered);
    } else {
      await deleteDoc(doc(db, 'guru', id));
    }
  };

  // NILAI CRUD
  const addNilai = async (nilaiData) => {
    const payload = {
      ...nilaiData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    if (isMock) {
      const current = JSON.parse(localStorage.getItem('eduscore_nilai')) || [];
      const newNilai = { id: `nilai_${Date.now()}`, ...payload };
      updateMockLocalStorage('eduscore_nilai', [...current, newNilai]);
      return newNilai;
    } else {
      const docRef = await addDoc(collection(db, 'nilai'), payload);
      return { id: docRef.id, ...payload };
    }
  };

  const updateNilai = async (id, nilaiData) => {
    const payload = {
      ...nilaiData,
      updatedAt: new Date().toISOString()
    };
    if (isMock) {
      const current = JSON.parse(localStorage.getItem('eduscore_nilai')) || [];
      const updated = current.map(item => item.id === id ? { ...item, ...payload } : item);
      updateMockLocalStorage('eduscore_nilai', updated);
    } else {
      const docRef = doc(db, 'nilai', id);
      await updateDoc(docRef, payload);
    }
  };

  const deleteNilai = async (id) => {
    if (isMock) {
      const current = JSON.parse(localStorage.getItem('eduscore_nilai')) || [];
      const filtered = current.filter(item => item.id !== id);
      updateMockLocalStorage('eduscore_nilai', filtered);
    } else {
      await deleteDoc(doc(db, 'nilai', id));
    }
  };

  const validateNilai = async (id) => {
    if (isMock) {
      const current = JSON.parse(localStorage.getItem('eduscore_nilai')) || [];
      const updated = current.map(item => item.id === id ? { ...item, isValidated: true, updatedAt: new Date().toISOString() } : item);
      updateMockLocalStorage('eduscore_nilai', updated);
    } else {
      const docRef = doc(db, 'nilai', id);
      await updateDoc(docRef, { isValidated: true, updatedAt: new Date().toISOString() });
    }
  };

  return (
    <DataContext.Provider value={{ 
      siswa, 
      guru, 
      nilai, 
      loading,
      addSiswa, 
      updateSiswa, 
      deleteSiswa,
      addGuru, 
      updateGuru, 
      deleteGuru,
      addNilai, 
      updateNilai, 
      deleteNilai,
      validateNilai
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
export default DataContext;
