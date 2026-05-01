import { useLocation, Link } from "react-router-dom";
import { cn } from "../shared/utils/utils";
import { navItems, pageTitle } from "../config/navigation";
import { GlobalSearch } from "../shared/components/GlobalSearch";
import { NotificationsDropdown } from "../shared/components/NotificationsDropdown";
import { UserProfileMenu } from "../shared/components/UserProfileMenu";
import type { AppRoute } from "../shared/types/types";

export const Navbar = () => {
  const location = useLocation();
  const pathname = location.pathname.replace("/", "") as AppRoute;
  const currentRoute = pathname || "dashboard";

  return (
    <>
      <header className="sticky top-0 z-10 flex flex-wrap lg:grid lg:grid-cols-[minmax(220px,1fr)_minmax(260px,440px)_auto_auto_auto] items-center gap-4 lg:gap-6 border-b border-[#d9e7e4]/78 p-4 lg:p-[20px_28px] bg-[#f8feff]/88 backdrop-blur-[14px]">
        <div className="flex-1 min-w-50">
          <p className="m-0 mb-0.75 text-teal text-[0.76rem] font-[850] uppercase">
            B2B Healthcare SaaS
          </p>
          <h1 className="m-0 text-[1.55rem] leading-[1.15] tracking-tight">
            {pageTitle[currentRoute] || pageTitle.dashboard}
          </h1>
        </div>

        <GlobalSearch />
        <NotificationsDropdown />
        <UserProfileMenu />
      </header>

      <nav
        className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-white/95 backdrop-blur-xl border-t border-teal/10 pb-2 lg:hidden shadow-[0_-4px_24px_rgba(8,145,178,0.06)]"
        aria-label="Mobile navigation"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentRoute === item.route;
          return (
            <Link
              key={item.route}
              to={`/${item.route}`}
              className={cn(
                "flex flex-col items-center gap-1 p-2.5 min-w-18 text-slate/60 transition-colors hover:text-slate",
                isActive && "text-teal hover:text-teal",
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center h-8 w-14 rounded-2xl transition-all duration-300",
                  isActive ? "bg-teal/15 text-teal" : "bg-transparent",
                )}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span
                className={cn(
                  "text-[0.65rem] font-bold tracking-wider uppercase",
                  isActive && "text-teal",
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};
