/**
 * Menghitung nilai akhir berdasarkan bobot:
 * - Tugas: 30% (0.3)
 * - UTS: 30% (0.3)
 * - UAS: 40% (0.4)
 * 
 * @param {number} tugas 
 * @param {number} uts 
 * @param {number} uas 
 * @returns {number}
 */
export function hitungNilaiAkhir(tugas, uts, uas) {
  const t = parseFloat(tugas) || 0;
  const ut = parseFloat(uts) || 0;
  const ua = parseFloat(uas) || 0;
  return Math.round((0.3 * t + 0.3 * ut + 0.4 * ua) * 100) / 100;
}

/**
 * Menentukan status kelulusan berdasarkan nilai akhir.
 * Lulus jika nilai akhir >= 70.
 * 
 * @param {number} nilaiAkhir 
 * @returns {"Lulus" | "Tidak Lulus"}
 */
export function tentukanStatus(nilaiAkhir) {
  const score = parseFloat(nilaiAkhir) || 0;
  return score >= 70 ? "Lulus" : "Tidak Lulus";
}
