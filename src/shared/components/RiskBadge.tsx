import type { RiskLevel } from "../types/types";
import { cn } from "../utils/utils";

const labels: Record<RiskLevel, string> = {
  low: "Low risk",
  medium: "Medium risk",
  high: "High risk",
};

export const RiskBadge = ({ risk }: { risk: RiskLevel }) => (
  <span 
    className={cn(
      "inline-flex w-max items-center rounded-full px-[9px] py-[5px] text-[0.73rem] font-[900] uppercase whitespace-nowrap shrink-0",
      risk === "low" && "bg-mint text-[#047857]",
      risk === "medium" && "bg-[#fef3c7] text-[#92400e]",
      risk === "high" && "bg-[#fff0ee] text-[#b42318]"
    )}
  >
    {labels[risk]}
  </span>
);
