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
              className="absolute right-0 z-5 mt-3 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-2xl backdrop-blur-xl"
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
                className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-[2rem] sm:rounded-[2.5rem] border border-white bg-white/95 shadow-2xl custom-scrollbar"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between bg-gradient-to-b from-teal-50/50 to-transparent p-4 sm:p-6 pb-3 sm:pb-4 relative">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-5 w-full">
                    <div className="relative">
                      {user?.photoURL ? (
                        <img
                          className="h-12 w-12 sm:h-20 sm:w-20 rounded-xl sm:rounded-2xl object-cover shadow-lg ring-2 sm:ring-4 ring-white"
                          src={user.photoURL}
                          alt={user.name}
                        />
                      ) : (
                        <div className="grid h-12 w-12 sm:h-20 sm:w-20 place-items-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-teal-600 to-teal-700 text-xl sm:text-3xl font-black text-white shadow-lg ring-2 sm:ring-4 ring-white">
                          {user?.name.charAt(0)}
                        </div>
                      )}
                      <div className="absolute -right-0.5 -bottom-0.5 h-3.5 w-3.5 sm:h-5 sm:w-5 rounded-full border-2 sm:border-4 border-white bg-emerald-500 shadow-sm" />
                    </div>
                    <div className="pt-0 sm:pt-1">
                      <h2 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 leading-tight">
                        {user?.name}
                      </h2>
                      <p className="mt-0 text-[11px] sm:text-base font-bold text-slate-400 sm:text-slate-500 truncate max-w-[200px] sm:max-w-none">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <button
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-lg bg-white/80 text-slate-400 shadow-sm transition-all hover:bg-rose-50 hover:text-rose-500 backdrop-blur-sm"
                    onClick={() => setAccountModalOpen(false)}
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="p-4 sm:p-6 pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 sm:p-4 transition-all hover:border-teal-200 hover:bg-white hover:shadow-md">
                      <div className="mb-1.5 sm:mb-2 flex items-center gap-2 text-teal-600">
                        <BrainCircuit size={12} className="sm:w-3.5 sm:h-3.5" />
                        <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider">
                          Clinical Role
                        </span>
                      </div>
                      <p className="text-[0.85rem] sm:text-[0.95rem] font-black text-slate-900">
                        Attending Physician
                      </p>
                      <small className="text-[10px] sm:text-[11px] font-bold text-slate-500">
                        Primary Care Lead
                      </small>
                    </div>

                    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 sm:p-4 transition-all hover:border-teal-200 hover:bg-white hover:shadow-md">
                      <div className="mb-1.5 sm:mb-2 flex items-center gap-2 text-teal-600">
                        <Activity size={12} className="sm:w-3.5 sm:h-3.5" />
                        <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider">
                          Department
                        </span>
                      </div>
                      <p className="text-[0.85rem] sm:text-[0.95rem] font-black text-slate-900">
                        Critical Care
                      </p>
                      <small className="text-[10px] sm:text-[11px] font-bold text-slate-500">
                        Cardiology Unit 4
                      </small>
                    </div>

                    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 sm:p-4 transition-all hover:border-teal-200 hover:bg-white hover:shadow-md">
                      <div className="mb-1.5 sm:mb-2 flex items-center gap-2 text-teal-600">
                        <HeartPulse size={12} className="sm:w-3.5 sm:h-3.5" />
                        <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider">
                          Access Level
                        </span>
                      </div>
                      <div className="inline-flex rounded-lg border border-teal-200 bg-teal-50 px-2 py-0.5 text-[9px] sm:text-[10px] font-black text-teal-700">
                        Enterprise Admin
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 sm:p-4 transition-all hover:border-teal-200 hover:bg-white hover:shadow-md">
                      <div className="mb-1.5 sm:mb-2 flex items-center gap-2 text-teal-600">
                        <ShieldCheck size={12} className="sm:w-3.5 sm:h-3.5" />
                        <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider">
                          ID Verification
                        </span>
                      </div>
                      <p className="text-[0.85rem] sm:text-[0.95rem] font-black text-slate-900">
                        Verified Practitioner
                      </p>
                      <small className="text-[10px] sm:text-[11px] font-bold text-emerald-600">
                        Credential active
                      </small>
                    </div>
                  </div>

                </div>

                <div className="flex items-center justify-center border-t border-slate-100 bg-slate-50/50 p-4 sm:p-6">
                  <button
                    className="w-full sm:w-auto min-w-[120px] rounded-lg sm:rounded-xl bg-slate-900 px-8 py-2.5 text-[0.82rem] font-black text-white shadow-lg transition-all hover:bg-black hover:shadow-slate-200 active:scale-95"
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
