import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type Auth,
  type User,
} from "firebase/auth";
import type { SessionUser } from "../shared/types/types";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Diagnostic log for production troubleshooting (logs presence, not values)
if (import.meta.env.PROD) {
  console.log(
    "Firebase Initializing. Configured Keys:",
    Object.entries(firebaseConfig)
      .filter(([, v]) => !!v)
      .map(([k]) => k),
  );
}

const hasFirebaseConfig = Object.values(firebaseConfig).every(Boolean);

let app: FirebaseApp | undefined;
let auth: Auth | undefined;

if (hasFirebaseConfig) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
}

const mapFirebaseUser = (user: User): SessionUser => ({
  id: user.uid,
  email: user.email ?? "careops.user@health.local",
  name: user.displayName ?? user.email?.split("@")[0] ?? "CareOps User",
  photoURL: user.photoURL ?? undefined,
});

export const isFirebaseConfigured = hasFirebaseConfig;

export const getMissingConfigKeys = () => {
  return Object.entries(firebaseConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key);
};

export const loginWithGoogle = async () => {
  if (!auth) {
    throw new Error("Add Firebase config in .env to enable Google sign-in.");
  }

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  const credentials = await signInWithPopup(auth, provider);
  return mapFirebaseUser(credentials.user);
};

export const loginWithEmail = async (email: string, password: string) => {
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  if (auth) {
    const credentials = await signInWithEmailAndPassword(auth, email, password);
    return mapFirebaseUser(credentials.user);
  }

  await new Promise((resolve) => window.setTimeout(resolve, 450));
  if (email && password.length >= 8) {
    const sessionUser: SessionUser = {
      id: `user-${email.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
      email,
      name: email
        .split("@")[0]
        .replace(/[._-]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
    };
    window.localStorage.setItem(
      "careops-demo-session",
      JSON.stringify(sessionUser),
    );
    return sessionUser;
  }

  throw new Error("Invalid credentials. Please try again.");
};

export const signUpWithEmail = async (
  name: string,
  email: string,
  password: string,
) => {
  if (!name.trim() || !email || !password) {
    throw new Error("Name, email, and password are required.");
  }

  if (auth) {
    const credentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    await updateProfile(credentials.user, { displayName: name.trim() });
    return {
      id: credentials.user.uid,
      email: credentials.user.email ?? email,
      name: name.trim(),
    };
  }

  await new Promise((resolve) => window.setTimeout(resolve, 450));
  const demoSignupUser: SessionUser = {
    id: `demo-${email.toLowerCase()}`,
    email,
    name: name.trim(),
  };
  window.localStorage.setItem(
    "careops-demo-session",
    JSON.stringify(demoSignupUser),
  );
  return demoSignupUser;
};

export const logoutUser = async () => {
  if (auth) {
    await signOut(auth);
  }
  window.localStorage.removeItem("careops-demo-session");
};

export const subscribeToSession = (
  callback: (user: SessionUser | null) => void,
) => {
  if (auth) {
    return onAuthStateChanged(auth, (user) =>
      callback(user ? mapFirebaseUser(user) : null),
    );
  }

  const stored = window.localStorage.getItem("careops-demo-session");
  callback(stored ? (JSON.parse(stored) as SessionUser) : null);
  return () => undefined;
};
