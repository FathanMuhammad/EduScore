/**
 * Membuat rekap laporan dari daftar nilai yang ada.
 * 
 * @param {Array} daftarNilai 
 * @returns {Array}
 */
export function generateLaporan(daftarNilai) {
  if (!daftarNilai || !Array.isArray(daftarNilai)) return [];
  
  return daftarNilai.map((item, index) => {
    return {
      no: index + 1,
      id: item.id || '',
      nis: item.nis || '',
      namaSiswa: item.namaSiswa || '',
      kelas: item.kelas || '',
      mataPelajaran: item.mataPelajaran || '',
      namaGuru: item.namaGuru || '',
      tugas: parseFloat(item.tugas) || 0,
      uts: parseFloat(item.uts) || 0,
      uas: parseFloat(item.uas) || 0,
      nilaiAkhir: parseFloat(item.nilaiAkhir) || 0,
      status: item.status || 'Tidak Lulus',
      isValidated: item.isValidated ? 'Ya' : 'Belum',
      tanggal: item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('id-ID') : '-'
    };
  });
}
