import { hitungNilaiAkhir, tentukanStatus } from '../utils/hitungNilai';

export class Siswa {
  constructor({ nis, nama, kelas, nilaiTugas = 0, nilaiUTS = 0, nilaiUAS = 0 } = {}) {
    this.nis = nis || '';
    this.nama = nama || '';
    this.kelas = kelas || '';
    this.nilaiTugas = parseFloat(nilaiTugas) || 0;
    this.nilaiUTS = parseFloat(nilaiUTS) || 0;
    this.nilaiUAS = parseFloat(nilaiUAS) || 0;
  }

  getNilaiAkhir() {
    return hitungNilaiAkhir(this.nilaiTugas, this.nilaiUTS, this.nilaiUAS);
  }

  getStatus() {
    return tentukanStatus(this.getNilaiAkhir());
  }

  toFirestore() {
    return {
      nis: this.nis,
      nama: this.nama,
      kelas: this.kelas,
      nilaiTugas: this.nilaiTugas,
      nilaiUTS: this.nilaiUTS,
      nilaiUAS: this.nilaiUAS,
      nilaiAkhir: this.getNilaiAkhir(),
      status: this.getStatus(),
      updatedAt: new Date().toISOString()
    };
  }
}
