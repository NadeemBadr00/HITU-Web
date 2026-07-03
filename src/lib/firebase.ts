// Firebase Client Configuration for HITU Web App
// Uses the existing nbrain-a654f Firebase project

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "nbrain-a654f.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "nbrain-a654f",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "nbrain-a654f.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Singleton pattern for Firebase app
let app: FirebaseApp;
let db: Firestore;
let auth: Auth;

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    const apps = getApps();
    app = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig);
  }
  return app;
}

export function getDb(): Firestore {
  if (!db) {
    db = getFirestore(getFirebaseApp());
  }
  return db;
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(getFirebaseApp());
  }
  return auth;
}

// Collection paths (multi-tenant ready)
export const COLLECTIONS = {
  institutions: "institutions",
  departments: (institutionId: string) => `institutions/${institutionId}/departments`,
  professors: (institutionId: string) => `institutions/${institutionId}/professors`,
  teachingAssistants: (institutionId: string) => `institutions/${institutionId}/teaching_assistants`,
  buildings: (institutionId: string) => `institutions/${institutionId}/buildings`,
  rooms: (institutionId: string) => `institutions/${institutionId}/rooms`,
  courses: (institutionId: string) => `institutions/${institutionId}/courses`,
  academicGroups: (institutionId: string) => `institutions/${institutionId}/academic_groups`,
  timetables: (institutionId: string) => `institutions/${institutionId}/timetables`,
  leaders: (institutionId: string) => `institutions/${institutionId}/leaders`,
  news: (institutionId: string) => `institutions/${institutionId}/news`,
  rankings: (institutionId: string) => `institutions/${institutionId}/rankings`,
  students: (institutionId: string) => `institutions/${institutionId}/students`,
  chatSessions: (institutionId: string) => `institutions/${institutionId}/chat_sessions`,
  users: "users",
} as const;

// Default institution ID for HITU
export const HITU_INSTITUTION_ID = "hitu-helwan";
