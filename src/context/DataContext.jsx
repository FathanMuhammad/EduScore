import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot
} from 'firebase/firestore';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const { currentUser } = useAuth();
  
  const [siswa, setSiswa] = useState([]);
  const [guru, setGuru] = useState([]);
  const [nilai, setNilai] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, [currentUser]);

  // SISWA CRUD
  const addSiswa = async (siswaData) => {
    const payload = {
      ...siswaData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, 'siswa'), payload);
    return { id: docRef.id, ...payload };
  };

  const updateSiswa = async (id, siswaData) => {
    const payload = {
      ...siswaData,
      updatedAt: new Date().toISOString()
    };
    const docRef = doc(db, 'siswa', id);
    await updateDoc(docRef, payload);
  };

  const deleteSiswa = async (id) => {
    await deleteDoc(doc(db, 'siswa', id));
  };

  // GURU CRUD
  const addGuru = async (guruData) => {
    const payload = {
      ...guruData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, 'guru'), payload);
    return { id: docRef.id, ...payload };
  };

  const updateGuru = async (id, guruData) => {
    const payload = {
      ...guruData,
      updatedAt: new Date().toISOString()
    };
    const docRef = doc(db, 'guru', id);
    await updateDoc(docRef, payload);
  };

  const deleteGuru = async (id) => {
    await deleteDoc(doc(db, 'guru', id));
  };

  // NILAI CRUD
  const addNilai = async (nilaiData) => {
    const payload = {
      ...nilaiData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, 'nilai'), payload);
    return { id: docRef.id, ...payload };
  };

  const updateNilai = async (id, nilaiData) => {
    const payload = {
      ...nilaiData,
      updatedAt: new Date().toISOString()
    };
    const docRef = doc(db, 'nilai', id);
    await updateDoc(docRef, payload);
  };

  const deleteNilai = async (id) => {
    await deleteDoc(doc(db, 'nilai', id));
  };

  const validateNilai = async (id) => {
    const docRef = doc(db, 'nilai', id);
    await updateDoc(docRef, { isValidated: true, updatedAt: new Date().toISOString() });
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
