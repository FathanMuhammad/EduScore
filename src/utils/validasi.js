/**
 * Memvalidasi apakah nilai berada di rentang 0 sampai 100.
 * 
 * @param {number|string} nilai 
 * @returns {boolean}
 */
export function validasiNilai(nilai) {
  const num = parseFloat(nilai);
  if (isNaN(num)) return false;
  return num >= 0 && num <= 100;
}
