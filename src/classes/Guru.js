import { Nilai } from './Nilai';

export class Guru {
  constructor({ idGuru = '', namaGuru = '', mataPelajaran = '' } = {}) {
    this.idGuru = idGuru;
    this.namaGuru = namaGuru;
    this.mataPelajaran = mataPelajaran;
  }

  inputNilai(siswa, tugas, uts, uas) {
    return new Nilai({
      idSiswa: siswa.id || '',
      nis: siswa.nis || '',
      namaSiswa: siswa.nama || '',
      kelas: siswa.kelas || '',
      mataPelajaran: this.mataPelajaran,
      idGuru: this.idGuru,
      namaGuru: this.namaGuru,
      tugas: tugas,
      uts: uts,
      uas: uas,
      isValidated: false
    });
  }

  validasiNilai(nilaiObj) {
    if (nilaiObj instanceof Nilai) {
      nilaiObj.isValidated = true;
      nilaiObj.updatedAt = new Date().toISOString();
      return nilaiObj;
    } else {
      // If it's a plain JS object, modify it and return
      return {
        ...nilaiObj,
        isValidated: true,
        updatedAt: new Date().toISOString()
      };
    }
  }

  toFirestore() {
    return {
      idGuru: this.idGuru,
      namaGuru: this.namaGuru,
      mataPelajaran: this.mataPelajaran,
      updatedAt: new Date().toISOString()
    };
  }
}
