import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import useNilai from '../../hooks/useNilai';
import { Guru } from '../../classes/Guru';
import { validasiNilai } from '../../utils/validasi';
import { useToast } from '../../context/ToastContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Badge from '../../components/Badge';
import { Save, UserCheck, Calculator } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function GuruInputNilai() {
  const { userData } = useAuth();
  const { siswa, addNilai, updateNilai } = useData();
  const { getNilaiByGuru } = useNilai();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryNis = searchParams.get('nis');

  // Selected Student State
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [existingNilaiId, setExistingNilaiId] = useState(null);

  const teacherId = userData?.idGuru || 'g1';

  // Scores State
  const [tugas, setTugas] = useState('');
  const [uts, setUTS] = useState('');
  const [uas, setUAS] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Pre-select student if NIS is provided in URL
  React.useEffect(() => {
    if (queryNis && siswa.length > 0 && !selectedStudentId) {
      const student = siswa.find(s => s.nis === queryNis);
      if (student) {
        setSelectedStudentId(student.id);
      }
    }
  }, [queryNis, siswa, selectedStudentId]);

  // When selectedStudentId changes, check for existing grades and populate
  React.useEffect(() => {
    if (selectedStudentId) {
      const studentObj = siswa.find(s => s.id === selectedStudentId);
      if (studentObj) {
        const teacherGrades = getNilaiByGuru(teacherId);
        const existingGrade = teacherGrades.find(n => n.nis === studentObj.nis);
        
        if (existingGrade) {
          setTugas(existingGrade.tugas.toString());
          setUTS(existingGrade.uts.toString());
          setUAS(existingGrade.uas.toString());
          setExistingNilaiId(existingGrade.id);
        } else {
          setTugas('');
          setUTS('');
          setUAS('');
          setExistingNilaiId(null);
        }
      }
    } else {
      setTugas('');
      setUTS('');
      setUAS('');
      setExistingNilaiId(null);
    }
    // Hanya jalankan ketika selectedStudentId berubah, agar tidak mengganggu saat guru mengetik
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStudentId]);

  // Get selected student details
  const selectedStudent = siswa.find(s => s.id === selectedStudentId);

  // Validate form inputs
  const validate = () => {
    const newErrors = {};
    if (!selectedStudentId) {
      newErrors.siswa = 'Silakan pilih siswa terlebih dahulu';
    }

    if (!validasiNilai(tugas)) {
      newErrors.tugas = 'Nilai harus berkisar antara 0 - 100';
    }
    if (!validasiNilai(uts)) {
      newErrors.uts = 'Nilai harus berkisar antara 0 - 100';
    }
    if (!validasiNilai(uas)) {
      newErrors.uas = 'Nilai harus berkisar antara 0 - 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      // 1. Instantiate Guru from auth context
      const guruInstance = new Guru({
        idGuru: userData?.idGuru || 'g1',
        namaGuru: userData?.nama || 'Guru Budi',
        mataPelajaran: userData?.mataPelajaran || 'Matematika'
      });

      // 2. Generate new Nilai object using Guru's method
      const nilaiInstance = guruInstance.inputNilai(
        selectedStudent,
        parseFloat(tugas),
        parseFloat(uts),
        parseFloat(uas)
      );

      // 3. Save to Firestore via DataContext
      if (existingNilaiId) {
        await updateNilai(existingNilaiId, nilaiInstance.toFirestore());
        showToast(`Nilai untuk ${selectedStudent.nama} berhasil diubah!`, 'success');
      } else {
        await addNilai(nilaiInstance.toFirestore());
        showToast(`Nilai untuk ${selectedStudent.nama} berhasil disimpan!`, 'success');
      }
      
      // Reset form
      setSelectedStudentId('');
      setExistingNilaiId(null);
      setTugas('');
      setUTS('');
      setUAS('');
      setErrors({});
      
      // Redirect to rekap
      navigate('/guru/rekap');
    } catch (err) {
      showToast('Gagal menyimpan nilai.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Preview Nilai Akhir
  const previewNilai = () => {
    if (!selectedStudentId) return null;
    
    // Create temporary Guru & Nilai instance
    const tempGuru = new Guru({
      idGuru: userData?.idGuru || 'g1',
      namaGuru: userData?.nama || 'Guru Budi',
      mataPelajaran: userData?.mataPelajaran || 'Matematika'
    });
    
    const tempNilai = tempGuru.inputNilai(
      selectedStudent,
      parseFloat(tugas) || 0,
      parseFloat(uts) || 0,
      parseFloat(uas) || 0
    );

    return {
      akhir: tempNilai.hitung(),
      status: tempNilai.getStatus()
    };
  };

  const preview = previewNilai();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-extrabold text-navy-900">Input Nilai Siswa</h2>
        <p className="text-xs text-navy-500 mt-1">
          Masukkan nilai Tugas, UTS, dan UAS siswa untuk mata pelajaran <strong className="text-navy-900">{userData?.mataPelajaran || 'Matematika'}</strong>.
        </p>
      </div>

      <Card title="Formulir Penilaian Akademik">
        <form onSubmit={handleSave} className="space-y-5">
          {/* Siswa Selector */}
          <div className="flex flex-col space-y-1.5 w-full">
            <label className="text-xs font-semibold text-navy-800 flex items-center">
              Pilih Siswa
              <span className="text-rose-500 ml-0.5">*</span>
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => {
                setSelectedStudentId(e.target.value);
                if (errors.siswa) setErrors({ ...errors, siswa: '' });
              }}
              className={`
                w-full px-3.5 py-2 text-sm rounded-lg border bg-white text-navy-900 transition-all duration-200 outline-none
                focus:ring-2 focus:ring-offset-0
                ${errors.siswa ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200' : 'border-navy-200 focus:border-navy-500 focus:ring-navy-100'}
              `}
            >
              <option value="">-- Pilih Siswa --</option>
              {siswa.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nis} - {item.nama} ({item.kelas})
                </option>
              ))}
            </select>
            {errors.siswa && (
              <span className="text-xs font-medium text-rose-500">
                {errors.siswa}
              </span>
            )}
          </div>

          {/* Student Profile Peek */}
          {selectedStudent && (
            <div className="p-4 bg-navy-50 border border-navy-100 rounded-xl space-y-2 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-navy-400 font-extrabold uppercase block">Data Siswa Terpilih</span>
                <p className="text-sm font-bold text-navy-900">{selectedStudent.nama}</p>
                <p className="text-xs text-navy-500">NIS: {selectedStudent.nis} | Kelas: {selectedStudent.kelas}</p>
              </div>
              <div className="p-2 bg-white rounded-lg border border-navy-200">
                <UserCheck className="w-5 h-5 text-navy-600" />
              </div>
            </div>
          )}

          {/* Scores Entry */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              id="tugas"
              type="number"
              label="Nilai Tugas (30%)"
              placeholder="0-100"
              value={tugas}
              onChange={(e) => {
                setTugas(e.target.value);
                if (errors.tugas) setErrors({ ...errors, tugas: '' });
              }}
              error={errors.tugas}
              min="0"
              max="100"
              step="any"
              required
            />
            <Input
              id="uts"
              type="number"
              label="Nilai UTS (30%)"
              placeholder="0-100"
              value={uts}
              onChange={(e) => {
                setUTS(e.target.value);
                if (errors.uts) setErrors({ ...errors, uts: '' });
              }}
              error={errors.uts}
              min="0"
              max="100"
              step="any"
              required
            />
            <Input
              id="uas"
              type="number"
              label="Nilai UAS (40%)"
              placeholder="0-100"
              value={uas}
              onChange={(e) => {
                setUAS(e.target.value);
                if (errors.uas) setErrors({ ...errors, uas: '' });
              }}
              error={errors.uas}
              min="0"
              max="100"
              step="any"
              required
            />
          </div>

          {/* Live Preview Calculation */}
          {preview && (
            <div className="p-4 bg-white border-2 border-dashed border-navy-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-navy-50 text-navy-800 rounded-lg">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-navy-400 font-extrabold uppercase block">Preview Nilai Akhir</span>
                  <span className="text-base font-black text-navy-800">{preview.akhir}</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] text-navy-400 font-extrabold uppercase block text-right">Preview Status</span>
                <Badge status={preview.status} />
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-3 border-t border-navy-50">
            <Button
              variant="secondary"
              onClick={() => {
                setSelectedStudentId('');
                setExistingNilaiId(null);
                setTugas('');
                setUTS('');
                setUAS('');
                setErrors({});
              }}
              disabled={loading}
            >
              Reset
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              icon={Save}
            >
              Simpan Nilai
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
