"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setError(null);
      const auth = getFirebaseAuth();
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "حدث خطأ في تسجيل الدخول";
      setError(getArabicError(message));
      throw err;
    }
  };

  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    try {
      setError(null);
      const auth = getFirebaseAuth();
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "حدث خطأ في إنشاء الحساب";
      setError(getArabicError(message));
      throw err;
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      const auth = getFirebaseAuth();
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, provider);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "حدث خطأ في تسجيل الدخول بـ Google";
      setError(getArabicError(message));
      throw err;
    }
  };

  const signOut = async () => {
    const auth = getFirebaseAuth();
    await firebaseSignOut(auth);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{ user, loading, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut, error, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

function getArabicError(message: string): string {
  if (message.includes("user-not-found")) return "لا يوجد حساب بهذا البريد الإلكتروني";
  if (message.includes("wrong-password")) return "كلمة المرور غير صحيحة";
  if (message.includes("email-already-in-use")) return "البريد الإلكتروني مستخدم بالفعل";
  if (message.includes("weak-password")) return "كلمة المرور ضعيفة — يجب أن تكون 6 أحرف على الأقل";
  if (message.includes("invalid-email")) return "البريد الإلكتروني غير صالح";
  if (message.includes("too-many-requests")) return "محاولات كثيرة — حاول لاحقاً";
  if (message.includes("popup-closed")) return "تم إغلاق نافذة تسجيل الدخول";
  if (message.includes("network-request-failed")) return "خطأ في الاتصال — تحقق من الإنترنت";
  if (message.includes("invalid-credential")) return "بيانات الدخول غير صحيحة";
  return message;
}
