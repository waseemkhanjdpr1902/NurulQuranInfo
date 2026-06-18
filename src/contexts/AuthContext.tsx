"use client";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getFirebaseAuth, googleProvider, isFirebaseConfigured } from "@/lib/firebase";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isConfigured: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function getAuthErrorMessage(error: unknown) {
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";

  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Invalid email or password. Please check your details and try again.";
    case "auth/email-already-in-use":
      return "An account already exists with this email. Please sign in instead.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/popup-closed-by-user":
      return "Google sign-in was cancelled.";
    case "auth/unauthorized-domain":
      return "This domain is not authorized in Firebase Authentication settings.";
    default:
      return error instanceof Error ? error.message : "Authentication failed. Please try again.";
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const auth = getFirebaseAuth();
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isConfigured: isFirebaseConfigured,
      loginWithEmail: async (email, password) => {
        try {
          await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
        } catch (error) {
          throw new Error(getAuthErrorMessage(error));
        }
      },
      signupWithEmail: async (name, email, password) => {
        try {
          const credential = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
          if (name.trim()) {
            await updateProfile(credential.user, { displayName: name.trim() });
          }
        } catch (error) {
          throw new Error(getAuthErrorMessage(error));
        }
      },
      loginWithGoogle: async () => {
        try {
          await signInWithPopup(getFirebaseAuth(), googleProvider);
        } catch (error) {
          throw new Error(getAuthErrorMessage(error));
        }
      },
      logout: async () => {
        if (!isFirebaseConfigured) return;
        await signOut(getFirebaseAuth());
      },
    }),
    [loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }
  return context;
}
