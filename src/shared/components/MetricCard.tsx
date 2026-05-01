import { memo } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../utils/utils";

type MetricCardProps = {
  label: string;
  value: string;
  delta: string;
  tone: "teal" | "coral" | "mint" | "slate";
  icon: LucideIcon;
};

export const MetricCard = memo(
  ({ label, value, delta, tone, icon: Icon }: MetricCardProps) => (
    <section
      className="flex justify-between gap-4 p-5 border border-border rounded-2xl bg-white/95 shadow-soft transition-all duration-150 ease-out hover:border-teal/30 hover:-translate-y-0.5 hover:shadow-main group"
    >
      <div>
        <span className="text-muted text-xs font-bold uppercase tracking-wide">
          {label}
        </span>
        <strong className="block mt-2 mb-1 text-3xl font-black text-text leading-none">
          {value}
        </strong>
        <small className="text-muted text-sm font-semibold">{delta}</small>
      </div>
      <span className={cn(
        "grid place-items-center w-11 h-11 rounded-xl shrink-0 transition-colors",
        tone === "teal" && "bg-cyan-50 text-teal",
        tone === "coral" && "bg-orange-50 text-coral",
        tone === "mint" && "bg-mint text-green",
        tone === "slate" && "bg-slate-100 text-slate"
      )}>
        <Icon size={22} />
      </span>
    </section>
  ),
);
