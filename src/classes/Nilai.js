import { hitungNilaiAkhir, tentukanStatus } from '../utils/hitungNilai';

export class Nilai {
  constructor({
    idSiswa = '',
    nis = '',
    namaSiswa = '',
    kelas = '',
    mataPelajaran = '',
    idGuru = '',
    namaGuru = '',
    tugas = 0,
    uts = 0,
    uas = 0,
    isValidated = false,
    createdAt = null,
    updatedAt = null
  } = {}) {
    this.idSiswa = idSiswa;
    this.nis = nis;
    this.namaSiswa = namaSiswa;
    this.kelas = kelas;
    this.mataPelajaran = mataPelajaran;
    this.idGuru = idGuru;
    this.namaGuru = namaGuru;
    this.tugas = parseFloat(tugas) || 0;
    this.uts = parseFloat(uts) || 0;
    this.uas = parseFloat(uas) || 0;
    this.isValidated = !!isValidated;
    this.createdAt = createdAt || new Date().toISOString();
    this.updatedAt = updatedAt || new Date().toISOString();
  }

  hitung() {
    return hitungNilaiAkhir(this.tugas, this.uts, this.uas);
  }

  getStatus() {
    return tentukanStatus(this.hitung());
  }

  tampilkan() {
    return `Siswa: ${this.namaSiswa} (NIS: ${this.nis}) | Mapel: ${this.mataPelajaran} | Nilai Akhir: ${this.hitung()} | Status: ${this.getStatus()}`;
  }

  toFirestore() {
    return {
      idSiswa: this.idSiswa,
      nis: this.nis,
      namaSiswa: this.namaSiswa,
      kelas: this.kelas,
      mataPelajaran: this.mataPelajaran,
      idGuru: this.idGuru,
      namaGuru: this.namaGuru,
      tugas: this.tugas,
      uts: this.uts,
      uas: this.uas,
      nilaiAkhir: this.hitung(),
      status: this.getStatus(),
      isValidated: this.isValidated,
      createdAt: this.createdAt,
      updatedAt: new Date().toISOString()
    };
  }
}
