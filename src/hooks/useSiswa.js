import { useData } from '../context/DataContext';

export default function useSiswa() {
  const { siswa, loading, addSiswa, updateSiswa, deleteSiswa } = useData();

  const getSiswaByKelas = (kelasName) => {
    if (!kelasName) return siswa;
    return siswa.filter(s => s.kelas === kelasName);
  };

  const getSiswaByNis = (nis) => {
    return siswa.find(s => s.nis === nis);
  };

  const getUniqueKelas = () => {
    const list = siswa.map(s => s.kelas).filter(Boolean);
    return [...new Set(list)];
  };

  return {
    siswa,
    loading,
    addSiswa,
    updateSiswa,
    deleteSiswa,
    getSiswaByKelas,
    getSiswaByNis,
    getUniqueKelas
  };
}
