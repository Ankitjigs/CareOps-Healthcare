import { Activity, ShieldCheck } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "../shared/utils/utils";
import { navItems } from "../config/navigation";

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="hidden lg:flex sticky top-0 h-screen flex-col border-r border-[#cce8eb]/20 p-6 bg-linear-to-b from-[#164e63]/95 to-[#084152]/95 transition-[width] duration-300">
      <button
        className="flex items-center gap-3 w-full p-0 bg-transparent text-white text-left transition-transform duration-200 hover:-translate-y-px"
        onClick={() => navigate("/dashboard")}
        aria-label="CareOps dashboard"
      >
        <span className="grid place-items-center w-10.5 h-10.5 shrink-0 rounded-xl bg-linear-to-br from-teal to-green text-white">
          <Activity size={22} />
        </span>
        <span className="flex flex-col">
          <strong className="block text-[1.1rem] leading-[1.2]">CareOps</strong>
          <small className="block text-white/65 text-[0.78rem]">
            Clinical command
          </small>
        </span>
      </button>

      <nav className="grid gap-2 mt-8" aria-label="Primary navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.includes(item.route);
          return (
            <Link
              key={item.route}
              to={`/${item.route}`}
              className={cn(
                "flex items-center gap-3 min-h-11 rounded-[10px] px-3 bg-transparent text-white/70 text-[0.94rem] font-[780] text-left transition-all duration-200 hover:-translate-y-px hover:bg-[#ecfeff]/10",
                isActive &&
                  "bg-[#ecfeff]/15 text-white shadow-[inset_3px_0_0_#67e8f9]",
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="grid gap-2.5 mt-auto border border-white/15 rounded-[14px] p-4 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] text-white/65">
        <ShieldCheck size={20} />
        <strong className="text-[1.1rem]">HIPAA-ready UI</strong>
        <span className="text-[0.85rem] leading-normal text-white/65">
          Session state and role-aware modules are isolated for extension.
        </span>
      </div>
    </aside>
  );
};
