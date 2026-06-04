import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { 
  signInWithEmailAndPassword as fbSignIn,
  signOut as fbSignOut,
  onAuthStateChanged as fbOnAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext(null);

// MOCK USER DATA
const MOCK_USERS = {
  'admin@eduscore.com': { uid: 'admin-uid', email: 'admin@eduscore.com', nama: 'Admin LSP', role: 'admin' },
  'guru@eduscore.com': { uid: 'guru-uid', email: 'guru@eduscore.com', nama: 'Budi Santoso, M.Pd.', role: 'guru', idGuru: 'G001', mataPelajaran: 'Matematika' },
  'siswa@eduscore.com': { uid: 'siswa-uid', email: 'siswa@eduscore.com', nama: 'Fathan Muhammad', role: 'siswa', nis: '12345' }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const isMock = !import.meta.env.VITE_FIREBASE_API_KEY || 
                 import.meta.env.VITE_FIREBASE_API_KEY.includes('mock') ||
                 import.meta.env.VITE_FIREBASE_API_KEY === 'your_api_key_here';

  useEffect(() => {
    if (isMock) {
      // MOCK AUTHENTICATION LIFECYCLE
      console.log("EduScore running in MOCK mode.");
      const savedUser = localStorage.getItem('eduscore_mock_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setCurrentUser({ uid: parsed.uid, email: parsed.email });
        setUserRole(parsed.role);
        setUserData(parsed);
      }
      setLoading(false);
    } else {
      // REAL FIREBASE AUTHENTICATION
      const unsubscribe = fbOnAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            // Fetch user role from Firestore 'users' collection
            const userDocRef = doc(db, 'users', user.uid);
            const userDocSnap = await getDoc(userDocRef);
            
            if (userDocSnap.exists()) {
              const data = userDocSnap.data();
              setCurrentUser(user);
              setUserRole(data.role);
              setUserData(data);
            } else {
              // If not in db, default to student or prompt role selection, let's create a default admin if it matches admin email
              const role = user.email.includes('admin') ? 'admin' : (user.email.includes('guru') ? 'guru' : 'siswa');
              const defaultData = {
                uid: user.uid,
                email: user.email,
                nama: user.displayName || user.email.split('@')[0],
                role: role
              };
              await setDoc(userDocRef, defaultData);
              setCurrentUser(user);
              setUserRole(role);
              setUserData(defaultData);
            }
          } catch (error) {
            console.error("Error fetching user data from Firestore:", error);
            // Fallback
            setCurrentUser(user);
            setUserRole('siswa');
          }
        } else {
          setCurrentUser(null);
          setUserRole(null);
          setUserData(null);
        }
        setLoading(false);
      });
      return unsubscribe;
    }
  }, [isMock]);

  const login = async (email, password) => {
    setLoading(true);
    if (isMock) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const user = MOCK_USERS[email.toLowerCase().trim()];
          if (user && password === 'password123') {
            localStorage.setItem('eduscore_mock_user', JSON.stringify(user));
            setCurrentUser({ uid: user.uid, email: user.email });
            setUserRole(user.role);
            setUserData(user);
            setLoading(false);
            resolve(user);
          } else {
            setLoading(false);
            reject(new Error("Email atau password salah! (Gunakan password123 untuk mock)"));
          }
        }, 800);
      });
    } else {
      try {
        const userCredential = await fbSignIn(auth, email, password);
        const user = userCredential.user;
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setUserRole(data.role);
          setUserData(data);
          return data;
        } else {
          const role = email.includes('admin') ? 'admin' : (email.includes('guru') ? 'guru' : 'siswa');
          const defaultData = {
            uid: user.uid,
            email: user.email,
            nama: email.split('@')[0],
            role: role
          };
          await setDoc(userDocRef, defaultData);
          setUserRole(role);
          setUserData(defaultData);
          return defaultData;
        }
      } catch (error) {
        setLoading(false);
        let errorMsg = "Login gagal. Periksa kembali email dan sandi Anda.";
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
          errorMsg = "Email atau password salah!";
        }
        throw new Error(errorMsg);
      }
    }
  };

  const logout = async () => {
    setLoading(true);
    if (isMock) {
      return new Promise((resolve) => {
        setTimeout(() => {
          localStorage.removeItem('eduscore_mock_user');
          setCurrentUser(null);
          setUserRole(null);
          setUserData(null);
          setLoading(false);
          resolve();
        }, 500);
      });
    } else {
      await fbSignOut(auth);
      setCurrentUser(null);
      setUserRole(null);
      setUserData(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, userRole, userData, login, logout, loading, isMock }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
