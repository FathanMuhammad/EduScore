import { useData } from '../context/DataContext';

export default function useNilai() {
  const { nilai, loading, addNilai, updateNilai, deleteNilai, validateNilai } = useData();

  const getNilaiByGuru = (idGuru) => {
    if (!idGuru) return nilai;
    return nilai.filter(n => n.idGuru === idGuru);
  };

  const getNilaiBySiswaNis = (nis) => {
    if (!nis) return [];
    return nilai.filter(n => n.nis === nis);
  };

  const getNilaiByKelas = (kelas) => {
    if (!kelas) return nilai;
    return nilai.filter(n => n.kelas === kelas);
  };

  const getStats = () => {
    if (nilai.length === 0) {
      return {
        total: 0,
        average: 0,
        lulus: 0,
        tidakLulus: 0,
        lulusPercentage: 0
      };
    }

    const total = nilai.length;
    const sum = nilai.reduce((acc, curr) => acc + (parseFloat(curr.nilaiAkhir) || 0), 0);
    const average = Math.round((sum / total) * 100) / 100;
    const lulus = nilai.filter(n => n.status === 'Lulus').length;
    const tidakLulus = total - lulus;
    const lulusPercentage = Math.round((lulus / total) * 100);

    return {
      total,
      average,
      lulus,
      tidakLulus,
      lulusPercentage
    };
  };

  return {
    nilai,
    loading,
    addNilai,
    updateNilai,
    deleteNilai,
    validateNilai,
    getNilaiByGuru,
    getNilaiBySiswaNis,
    getNilaiByKelas,
    getStats
  };
}
