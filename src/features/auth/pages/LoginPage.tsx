import { useState } from "react";
import type { FormEvent } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  BarChart3,
  Eye,
  EyeOff,
  HeartPulse,
  LockKeyhole,
  Mail,
  Shield,
  ShieldCheck,
  UserRound,
  Users,
  Zap,
  Check,
  X,
} from "lucide-react";
import {
  loginWithEmail,
  loginWithGoogle,
  signUpWithEmail,
  isFirebaseConfigured,
  getMissingConfigKeys,
} from "../../../services/firebase";
import { cn } from "../../../shared/utils/utils";
import { useAppStore } from "../../../store/useAppStore";

type AuthIntent = "signin" | "signup";

/* ── ECG SVG path for healthcare-native background ── */
const EcgLine = () => (
  <svg
    className="ecg-line"
    viewBox="0 0 900 60"
    fill="none"
    aria-hidden="true"
    preserveAspectRatio="none"
  >
    <path
      d="M0 30 H200 L215 30 L225 8 L240 52 L255 10 L270 48 L280 30 H420 L435 30 L445 8 L460 52 L475 10 L490 48 L500 30 H640 L655 30 L665 8 L680 52 L695 10 L710 48 L720 30 H900"
      stroke="url(#ecgGrad)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <defs>
      <linearGradient id="ecgGrad" x1="0" y1="0" x2="900" y2="0">
        <stop offset="0%" stopColor="#67e8f9" stopOpacity="0" />
        <stop offset="20%" stopColor="#67e8f9" stopOpacity="0.4" />
        <stop offset="50%" stopColor="#67e8f9" stopOpacity="0.6" />
        <stop offset="80%" stopColor="#67e8f9" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#67e8f9" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

/* ── Animation variants ── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
};

const getFriendlyErrorMessage = (
  errorMsg: string,
  isSignUp: boolean = false,
): string => {
  if (errorMsg.includes("auth/popup-closed-by-user")) {
    return "Sign-in was cancelled.";
  }
  if (
    errorMsg.includes("auth/invalid-credential") ||
    errorMsg.includes("auth/user-not-found") ||
    errorMsg.includes("auth/wrong-password")
  ) {
    return "Incorrect email or password.";
  }
  if (errorMsg.includes("auth/email-already-in-use")) {
    return "An account with this email already exists.";
  }
  if (errorMsg.includes("auth/weak-password")) {
    return "Password does not meet minimum requirements.";
  }
  if (errorMsg.includes("auth/too-many-requests")) {
    return "Too many failed attempts. Please try again later.";
  }
  if (errorMsg.includes("auth/network-request-failed")) {
    return "Network error. Please check your internet connection.";
  }
  // Default fallback if we don't recognize the error code
  return `Unable to ${isSignUp ? "create account" : "sign in"}. Please try again.`;
};

export const LoginPage = () => {
  const [intent, setIntent] = useState<AuthIntent>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [authMode, setAuthMode] = useState<"email" | "google" | null>(null);
  const setUser = useAppStore((state) => state.setUser);
  const isSubmitting = authMode !== null;
  const isSignUp = intent === "signup";

  const passwordCriteria = [
    { label: "At least 6 characters", met: password.length >= 6 },
    { label: "One uppercase character", met: /[A-Z]/.test(password) },
    { label: "One special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  const unmetCriteria = passwordCriteria.filter((c) => !c.met);
  const showPasswordHints = isSignUp && password.length > 0;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (isSignUp && name.trim().length < 2) {
      setError("Enter your full name to create a workspace account.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }

    if (isSignUp && unmetCriteria.length > 0) {
      setError("Please fulfill all password requirements.");
      return;
    }

    if (!isSignUp && password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setAuthMode("email");
    try {
      const sessionUser = isSignUp
        ? await signUpWithEmail(name, email, password)
        : await loginWithEmail(email, password);
      setUser(sessionUser);
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? getFriendlyErrorMessage(loginError.message, isSignUp)
          : `Unable to ${isSignUp ? "create account" : "sign in"}.`,
      );
    } finally {
      setAuthMode(null);
    }
  };

  const handleGoogleSignIn = async () => {
    console.log("Google Sign-In Triggered");
    console.log("Firebase Configured Status:", isFirebaseConfigured);
    const missing = getMissingConfigKeys();
    console.log("Missing Keys:", missing);

    if (!isFirebaseConfigured) {
      setError(
        `Firebase config incomplete: ${missing.join(", ")}. Please ensure you have triggered a NEW deployment in Vercel.`,
      );
      return;
    }
    setError("");
    setAuthMode("google");
    try {
      console.log("Calling loginWithGoogle()...");
      const sessionUser = await loginWithGoogle();
      setUser(sessionUser);
    } catch (loginError) {
      console.error("Google Auth Error Detail:", loginError);
      setError(
        loginError instanceof Error
          ? getFriendlyErrorMessage(loginError.message, false)
          : "Unable to sign in with Google.",
      );
    } finally {
      setAuthMode(null);
    }
  };

  return (
    <main className="login-page">
      <section className="login-visual">
        <div className="hero-glow-blob hero-glow-1" aria-hidden="true" />
        <div className="hero-glow-blob hero-glow-2" aria-hidden="true" />
        <div className="hero-glow-blob hero-glow-3" aria-hidden="true" />
        <div className="login-orbit" aria-hidden="true" />
        <div className="login-orbit login-orbit-sm" aria-hidden="true" />
        <div className="ecg-container" aria-hidden="true">
          <EcgLine />
          <EcgLine />
        </div>

        <motion.div
          className="flex items-center gap-3 relative z-10"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="grid w-14 h-14 place-items-center rounded-2xl border border-white/10 bg-linear-to-br from-teal-600 to-teal-700 text-white shadow-lg">
            <Activity size={28} />
          </span>
          <div className="flex flex-col justify-center">
            <strong>CareOps</strong>
            <small>Unified Clinical Intelligence</small>
          </div>
        </motion.div>

        <div className="login-copy">
          <motion.span
            className="login-kicker"
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <Zap size={13} />
            Clinical command center
          </motion.span>

          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            Monitor, Predict, and Manage Patient Risk
            <span className="headline-accent"> — In One Place</span>
          </motion.h1>

          <motion.p
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            Track real-time vitals, predict patient risk, and coordinate care
            teams — all from a single, secure platform.
          </motion.p>
        </div>

        <div className="login-features">
          {[
            {
              icon: <HeartPulse size={18} />,
              title: "Real-time vitals",
              desc: "Monitor patient signals 24/7",
            },
            {
              icon: <Users size={18} />,
              title: "Care coordination",
              desc: "Unified team collaboration",
            },
            {
              icon: <Shield size={18} />,
              title: "HIPAA compliant",
              desc: "Enterprise-grade security",
            },
          ].map((feat, i) => (
            <motion.div
              className="login-feature"
              key={feat.title}
              custom={5 + i}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <span className="login-feature-icon">{feat.icon}</span>
              <div>
                <strong>{feat.title}</strong>
                <small>{feat.desc}</small>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Bottom trust bar ── */}
        <motion.div
          className="login-trust"
          custom={8}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <BarChart3 size={14} />
          <span>
            Trusted by <strong>200+</strong> healthcare organizations
          </span>
          <ArrowRight size={14} />
        </motion.div>
      </section>

      <section
        className="login-card"
        aria-label={isSignUp ? "Sign up form" : "Sign in form"}
      >
        <div className="mobile-brand">
          <Activity size={28} />
          <span>CareOps</span>
        </div>

        <div className="flex items-center gap-3 mb-6  ">
          <ShieldCheck size={24} className="text-teal" />
          <div>
            <span className="text-2xl">
              {isSignUp ? "Create account" : "Welcome back"}
            </span>
          </div>
        </div>

        <div
          className="auth-switch"
          role="tablist"
          aria-label="Authentication mode"
        >
          <button
            className={cn(
              "auth-switch-button",
              intent === "signin" && "active",
            )}
            type="button"
            role="tab"
            aria-selected={intent === "signin"}
            onClick={() => {
              setIntent("signin");
              setError("");
            }}
          >
            Sign in
          </button>
          <button
            className={cn(
              "auth-switch-button",
              intent === "signup" && "active",
            )}
            type="button"
            role="tab"
            aria-selected={intent === "signup"}
            onClick={() => {
              setIntent("signup");
              setError("");
            }}
          >
            Sign up
          </button>
        </div>

        <button
          className="google-button"
          type="button"
          onClick={handleGoogleSignIn}
          aria-busy={authMode === "google"}
        >
          <img src="google.svg" width={22} height={22} alt="Google" />

          {authMode === "google" ? "Opening Google..." : "Continue with Google"}
        </button>

        <div className="auth-divider">
          <span>or use email</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={cn("name-field-wrapper", !isSignUp && "collapsed")}>
            <div className="form-field">
              <label htmlFor="name">Full name</label>
              <div className="input-wrap">
                <UserRound size={17} />
                <input
                  id="name"
                  autoComplete="name"
                  placeholder="Dr. Jane Smith"
                  value={name}
                  tabIndex={isSignUp ? 0 : -1}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="email">Email</label>
            <div className="input-wrap">
              <Mail size={17} />
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@hospital.health"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>
            <div className="input-wrap">
              <LockKeyhole size={17} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete={isSignUp ? "new-password" : "current-password"}
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                className="password-toggle"
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setShowPassword((current) => !current);
                }}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {showPasswordHints && (
            <div className="password-hints" aria-live="polite">
              <p>Password must contain:</p>
              <ul>
                {passwordCriteria.map((c) => (
                  <li key={c.label} className={c.met ? "met" : "unmet"}>
                    {c.met ? <Check size={14} /> : <X size={14} />}
                    {c.label}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {error ? (
            <div className="form-error" role="alert">
              <AlertCircle size={16} />
              {error}
            </div>
          ) : (
            <div className="form-error-placeholder" aria-hidden="true" />
          )}

          <button
            className="primary-button"
            type="submit"
            disabled={isSubmitting}
          >
            {authMode === "email"
              ? isSignUp
                ? "Creating account..."
                : "Signing in..."
              : isSignUp
                ? "Create CareOps account"
                : "Sign in to CareOps"}
          </button>
        </form>
      </section>
    </main>
  );
};
