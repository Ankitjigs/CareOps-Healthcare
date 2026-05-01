import { memo } from "react";
import { cn } from "../utils/utils";

type ChartPanelProps = {
  title: string;
  caption: string;
  data: number[];
  mode?: "bars" | "line";
  color?: string;
};

export const ChartPanel = memo(
  ({ title, caption, data, mode = "bars", color }: ChartPanelProps) => {
    const max = Math.max(...data);
    const heights = data.map((v) => Math.max(12, (v / max) * 100));

    return (
      <section className="p-6 min-h-[360px] border border-border rounded-2xl bg-white/95 shadow-soft">
        <div className="flex justify-between gap-4 mb-6">
          <div>
            <h2 className="m-0 text-lg font-bold text-text">{title}</h2>
            <p className="m-0 mt-1 text-sm text-muted">{caption}</p>
          </div>
        </div>

        <div className="h-60 rounded-xl p-5 bg-slate-50/50 relative before:absolute before:inset-0 before:bg-[repeating-linear-gradient(to_top,transparent,transparent_47px,rgba(0,0,0,0.03)_48px)]">
          {mode === "line" && (
            <div className="absolute inset-0 p-5">
              {heights.slice(0, -1).map((_, i) => {
                const h1 = heights[i];
                const h2 = heights[i + 1];
                const dx = 100 / 6;
                const dy = h1 - h2;
                const angle = Math.atan2(dy, dx);
                const length = Math.sqrt(dx * dx + dy * dy);
                const left = (i * 100) / 6 + (100 / 7 / 2);
                const top = 100 - (h1 + h2) / 2;
                return (
                  <div
                    key={i}
                    className="absolute bg-coral h-0.5"
                    style={{
                      left: `${left}%`,
                      top: `${top}%`,
                      width: `${length}%`,
                      transform: `${angle * (180 / Math.PI)}deg`,
                      transformOrigin: 'left center',
                    }}
                  />
                );
              })}
            </div>
          )}
          <div className="grid h-full grid-cols-7 items-end gap-4 relative z-10">
            {data.map((value, index) => (
              <div
                key={`${value}-${index}`}
                className="relative flex items-end justify-center group"
                style={{ height: `${heights[index]}%` }}
              >
                <div
                  className={cn(
                    "w-full transition-all duration-300 group-hover:brightness-110",
                    mode === "line"
                      ? "h-4 w-4 rounded-full bg-coral border-4 border-white shadow-[0_0_12px_rgba(220,95,79,0.3)] mb-[-8px]"
                      : color
                        ? "h-full rounded-t-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                        : "h-full rounded-t-lg bg-gradient-to-t from-teal to-cyan-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]",
                  )}
                  style={color && mode !== "line" ? { background: color } : undefined}
                />
                <span className="absolute -top-6 text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-7 gap-4 mt-4 text-[10px] font-bold text-muted uppercase tracking-wider text-center">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
      </section>
    );
  },
);
