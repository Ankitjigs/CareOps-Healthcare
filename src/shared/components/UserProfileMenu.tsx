import {
  Activity,
  BrainCircuit,
  CircleHelp,
  HeartPulse,
  LogOut,
  Settings,
  ShieldCheck,
  User,
  UserPlus,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../../store/useAppStore";
import { logoutUser } from "../../services/firebase";

export const UserProfileMenu = () => {
  const user = useAppStore((state) => state.user);
  const [profileOpen, setProfileOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setProfileOpen(false);
    await logoutUser();
    useAppStore.getState().setUser(null);
  };

  return (
    <>
      <div className="relative" ref={profileRef}>
        <button
          className="group flex items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-1 transition-all hover:border-teal-300 hover:shadow-lg active:scale-95"
          onClick={() => setProfileOpen((prev) => !prev)}
          aria-label="Open profile menu"
          aria-expanded={profileOpen}
        >
          {user?.photoURL ? (
            <img
              className="h-9 w-9 rounded-lg object-cover"
              src={user.photoURL}
              alt={user.name}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-teal-50 text-sm font-black text-teal-700">
              {user?.name.charAt(0)}
            </div>
          )}
        </button>

        <AnimatePresence>
          {profileOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-3 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-center gap-4 border-b border-slate-100 p-5">
                {user?.photoURL ? (
                  <img
                    className="h-12 w-12 rounded-xl object-cover ring-2 ring-teal-50"
                    src={user.photoURL}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-teal-600 text-lg font-black text-white">
                    {user?.name.charAt(0)}
                  </div>
                )}
                <div className="overflow-hidden">
                  <strong className="block truncate text-sm font-black text-slate-900">
                    {user?.name}
                  </strong>
                  <small className="block truncate text-xs font-medium text-slate-500">
                    {user?.email}
                  </small>
                </div>
              </div>

              <div className="p-2">
                <button
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-teal-50 hover:text-teal-700"
                  onClick={() => {
                    setProfileOpen(false);
                    setAccountModalOpen(true);
                  }}
                >
                  <User size={16} />
                  My Account
                </button>
                <button
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-teal-50 hover:text-teal-700"
                  onClick={() => setProfileOpen(false)}
                >
                  <UserPlus size={16} />
                  Invite Team
                  <span className="ml-auto rounded-md bg-teal-100 px-1.5 py-0.5 text-[9px] font-black tracking-wider text-teal-700">
                    PRO
                  </span>
                </button>
                <button
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-teal-50 hover:text-teal-700"
                  onClick={() => setProfileOpen(false)}
                >
                  <Settings size={16} />
                  Settings
                  <span className="ml-auto rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-black tracking-wider text-slate-500">
                    SOON
                  </span>
                </button>
                <button
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-teal-50 hover:text-teal-700"
                  onClick={() => setProfileOpen(false)}
                >
                  <CircleHelp size={16} />
                  Support
                </button>
              </div>

              <div className="border-t border-slate-100 p-2">
                <button
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-bold text-rose-600 transition-colors hover:bg-rose-50"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  Log out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {createPortal(
        <AnimatePresence>
          {accountModalOpen && (
            <div
              className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6"
              onClick={() => setAccountModalOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-xl overflow-hidden rounded-[2.5rem] border border-white bg-white/95 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between bg-gradient-to-b from-teal-50/50 to-transparent p-8 pb-6">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      {user?.photoURL ? (
                        <img
                          className="h-24 w-24 rounded-3xl object-cover shadow-xl ring-4 ring-white"
                          src={user.photoURL}
                          alt={user.name}
                        />
                      ) : (
                        <div className="grid h-24 w-24 place-items-center rounded-3xl bg-gradient-to-br from-teal-600 to-teal-700 text-4xl font-black text-white shadow-xl ring-4 ring-white">
                          {user?.name.charAt(0)}
                        </div>
                      )}
                      <div className="absolute -right-1 -bottom-1 h-6 w-6 rounded-full border-4 border-white bg-emerald-500 shadow-sm" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black tracking-tight text-slate-900">
                        {user?.name}
                      </h2>
                      <p className="mt-1 text-lg font-bold text-slate-500">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <button
                    className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-500"
                    onClick={() => setAccountModalOpen(false)}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-8 pt-0">
                  <div className="grid grid-cols-2 gap-5">
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 transition-all hover:border-teal-200 hover:bg-white hover:shadow-md">
                      <div className="mb-3 flex items-center gap-2 text-teal-600">
                        <BrainCircuit size={16} />
                        <span className="text-[10px] font-black uppercase tracking-wider">
                          Clinical Role
                        </span>
                      </div>
                      <p className="text-base font-black text-slate-900">
                        Attending Physician
                      </p>
                      <small className="text-xs font-bold text-slate-500">
                        Primary Care Lead
                      </small>
                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 transition-all hover:border-teal-200 hover:bg-white hover:shadow-md">
                      <div className="mb-3 flex items-center gap-2 text-teal-600">
                        <Activity size={16} />
                        <span className="text-[10px] font-black uppercase tracking-wider">
                          Department
                        </span>
                      </div>
                      <p className="text-base font-black text-slate-900">
                        Critical Care
                      </p>
                      <small className="text-xs font-bold text-slate-500">
                        Cardiology Unit 4
                      </small>
                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 transition-all hover:border-teal-200 hover:bg-white hover:shadow-md">
                      <div className="mb-3 flex items-center gap-2 text-teal-600">
                        <HeartPulse size={16} />
                        <span className="text-[10px] font-black uppercase tracking-wider">
                          Access Level
                        </span>
                      </div>
                      <div className="inline-flex rounded-lg border border-teal-200 bg-teal-50 px-3 py-1 text-[11px] font-black text-teal-700">
                        Enterprise Admin
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 transition-all hover:border-teal-200 hover:bg-white hover:shadow-md">
                      <div className="mb-3 flex items-center gap-2 text-teal-600">
                        <ShieldCheck size={16} />
                        <span className="text-[10px] font-black uppercase tracking-wider">
                          ID Verification
                        </span>
                      </div>
                      <p className="text-base font-black text-slate-900">
                        Verified Practitioner
                      </p>
                      <small className="text-xs font-bold text-emerald-600">
                        Credential active
                      </small>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-4">
                    <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-black text-slate-700 shadow-sm">
                      <div className="relative h-2.5 w-2.5">
                        <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <div className="relative h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      </div>
                      Clinically Active
                    </div>
                    <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-black text-slate-700 shadow-sm">
                      <ShieldCheck className="text-teal-600" size={16} />
                      HIPAA Compliant Session
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 p-8">
                  <div className="space-y-1 text-[11px] font-bold tracking-tight text-slate-400">
                    <p>SYSTEM ID: 2991-A8-X90</p>
                    <p>LAST LOGIN: TODAY, 10:42 AM</p>
                  </div>
                  <button
                    className="rounded-2xl bg-slate-900 px-8 py-3 text-sm font-black text-white shadow-lg transition-all hover:bg-black hover:shadow-slate-200 active:scale-95"
                    onClick={() => setAccountModalOpen(false)}
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
};
