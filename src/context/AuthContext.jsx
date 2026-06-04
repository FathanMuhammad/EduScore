import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { 
  signInWithEmailAndPassword as fbSignIn,
  createUserWithEmailAndPassword as fbCreateUser,
  signOut as fbSignOut,
  onAuthStateChanged as fbOnAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = fbOnAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Fetch user role from Firestore 'users' collection
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            
            // If it's a pending guru, they shouldn't be logged in automatically
            if (data.status === 'pending') {
              await fbSignOut(auth);
              setCurrentUser(null);
              setUserRole(null);
              setUserData(null);
            } else {
              setCurrentUser(user);
              setUserRole(data.role);
              setUserData(data);
            }
          } else {
            // User doc doesn't exist yet (might be in the middle of registration)
            // We just set to null, register function will handle setting the state.
            setCurrentUser(null);
            setUserRole(null);
            setUserData(null);
          }
        } catch (error) {
          console.error("Error fetching user data from Firestore:", error);
          setCurrentUser(null);
          setUserRole(null);
          setUserData(null);
        }
      } else {
        setCurrentUser(null);
        setUserRole(null);
        setUserData(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await fbSignIn(auth, email, password);
      const user = userCredential.user;
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        if (data.status === 'pending') {
          await fbSignOut(auth);
          setLoading(false);
          throw new Error("Akun Anda sedang menunggu persetujuan admin.");
        }
        if (data.status === 'rejected') {
          await fbSignOut(auth);
          setLoading(false);
          throw new Error("Pendaftaran akun Anda telah ditolak.");
        }

        setUserRole(data.role);
        setUserData(data);
        setLoading(false);
        return data;
      } else {
        // Fallback if doc doesn't exist
        const defaultData = {
          uid: user.uid,
          email: user.email,
          nama: email.split('@')[0],
          role: 'siswa',
          status: 'active'
        };
        await setDoc(userDocRef, defaultData);
        setUserRole('siswa');
        setUserData(defaultData);
        setLoading(false);
        return defaultData;
      }
    } catch (error) {
      setLoading(false);
      let errorMsg = "Login gagal. Periksa kembali email dan sandi Anda.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMsg = "Email atau password salah!";
      } else if (error.message) {
        errorMsg = error.message; // Throw custom errors like pending status
      }
      throw new Error(errorMsg);
    }
  };

  const register = async (email, password, nama, role, nis, idGuru, mataPelajaran) => {
    setLoading(true);
    try {
      const userCredential = await fbCreateUser(auth, email, password);
      const user = userCredential.user;
      
      const status = role === 'guru' ? 'pending' : 'active';
      const defaultData = {
        uid: user.uid,
        email: user.email,
        nama: nama,
        role: role,
        status: status,
        ...(role === 'siswa' && nis ? { nis } : {}),
        ...(role === 'guru' ? { idGuru, mataPelajaran } : {})
      };

      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, defaultData);

      // Create corresponding record in `siswa` collection if role is siswa
      if (role === 'siswa') {
        const siswaDocRef = doc(db, 'siswa', user.uid);
        await setDoc(siswaDocRef, {
          nis: nis,
          nama: nama,
          kelas: 'Belum Ditentukan',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      // If pending, sign out immediately
      if (status === 'pending') {
        await fbSignOut(auth);
        setLoading(false);
        return { ...defaultData, requireApproval: true };
      }

      setUserRole(role);
      setUserData(defaultData);
      setLoading(false);
      return { ...defaultData, requireApproval: false };
    } catch (error) {
      setLoading(false);
      let errorMsg = "Pendaftaran gagal.";
      if (error.code === 'auth/email-already-in-use') {
        errorMsg = "Email sudah digunakan.";
      } else if (error.code === 'auth/weak-password') {
        errorMsg = "Password terlalu lemah (minimal 6 karakter).";
      }
      throw new Error(errorMsg);
    }
  }

  const logout = async () => {
    setLoading(true);
    await fbSignOut(auth);
    setCurrentUser(null);
    setUserRole(null);
    setUserData(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ currentUser, userRole, userData, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
