import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import {
  AlertTriangle,
  Clock,
  FileUp,
  Flame,
  Grid3x3,
  LayoutDashboard,
  List,
  Settings,
  Trophy,
  Users,
  X,
  Zap,
} from "lucide-react";
import React from "react";

const NAV_ITEMS = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/courts", icon: Grid3x3, label: "Courts" },
  { to: "/matches", icon: List, label: "Matches" },
  { to: "/draws", icon: FileUp, label: "Draws" },
  { to: "/players", icon: Users, label: "Players" },
  { to: "/categories", icon: Trophy, label: "Categories" },
  { to: "/settings", icon: Settings, label: "Settings" },
] as const;

interface LayoutProps {
  children: React.ReactNode;
}

function CurrentTime() {
  const [time, setTime] = React.useState(() =>
    new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
  );

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      );
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <Clock className="w-3.5 h-3.5" />
      {time}
    </span>
  );
}

function PanicSuggestionsOverlay({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  const suggestions = [
    "Shorten all remaining matches to first-to-3 games",
    "Prioritise finals and semifinals over early rounds",
    "Pause optional formats like One Point Slam",
    "Move doubles matches to the end of the schedule",
    "Use sudden-death deuce to speed up points",
    "Reduce warm-up time to 2 minutes per match",
  ];
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Flame className="w-5 h-5" />
            Panic Mode
          </DialogTitle>
          <DialogDescription>
            Emergency actions to get the tournament back on schedule.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/40 p-3">
            <p className="text-sm font-medium text-red-700 dark:text-red-400 mb-1.5">
              Emergency Suggestions
            </p>
            <ul className="space-y-1.5">
              {suggestions.map((s) => (
                <li
                  key={s}
                  className="flex items-start gap-2 text-sm text-red-700 dark:text-red-400"
                >
                  <Zap className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            data-ocid="header.panic_dialog.close_button"
          >
            <X className="w-4 h-4 mr-1" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [showPanicDialog, setShowPanicDialog] = React.useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-[220px] flex-shrink-0 bg-primary flex-col h-full">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-primary-foreground/10">
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
            data-ocid="nav.dashboard_link"
          >
            <div className="w-8 h-8 rounded-sm bg-accent flex items-center justify-center flex-shrink-0">
              <Trophy
                className="w-4.5 h-4.5 text-accent-foreground"
                strokeWidth={2.5}
              />
            </div>
            <div className="leading-none">
              <span className="font-display text-base font-bold text-primary-foreground tracking-tight block">
                CourtFlow
              </span>
              <span className="text-[10px] text-primary-foreground/50 font-medium tracking-wide uppercase">
                AI Scheduler
              </span>
            </div>
          </Link>
        </div>

        {/* Main nav */}
        <nav
          className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto"
          aria-label="Main navigation"
        >
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
            const isActive =
              to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                data-ocid={`nav.${label.toLowerCase()}_link`}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-smooth",
                  isActive
                    ? "bg-primary-foreground/15 text-primary-foreground"
                    : "text-primary-foreground/65 hover:bg-primary-foreground/10 hover:text-primary-foreground",
                )}
              >
                <Icon
                  className="w-4.5 h-4.5 flex-shrink-0"
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 pb-4 pt-4 border-t border-primary-foreground/10">
          <div className="pt-3 px-2">
            <p className="text-[11px] text-primary-foreground/35 leading-relaxed">
              © {new Date().getFullYear()}.{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary-foreground/60 transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header bar */}
        <header className="h-14 bg-card border-b border-border flex items-center px-4 md:px-6 gap-4 flex-shrink-0">
          {/* Mobile logo */}
          <div className="md:hidden flex items-center gap-2">
            <div className="w-7 h-7 rounded-sm bg-primary flex items-center justify-center">
              <Trophy
                className="w-3.5 h-3.5 text-primary-foreground"
                strokeWidth={2.5}
              />
            </div>
            <span className="font-display text-sm font-bold text-foreground">
              CourtFlow
            </span>
          </div>

          <div className="flex-1" />

          {/* Tournament name + time */}
          <div className="hidden sm:flex items-center gap-4">
            <span className="text-sm font-medium text-foreground">
              AJ Tennis Summer Open
            </span>
            <span className="text-xs text-muted-foreground">·</span>
            <CurrentTime />
          </div>

          {/* Panic Mode button */}
          <button
            type="button"
            onClick={() => setShowPanicDialog(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-semibold bg-red-50 text-red-700 hover:bg-red-100 transition-colors dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/50"
            data-ocid="header.panic_mode_button"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Panic Mode</span>
          </button>
          <PanicSuggestionsOverlay
            open={showPanicDialog}
            onClose={() => setShowPanicDialog(false)}
          />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-background pb-20 md:pb-0">
          {children}
        </main>

        {/* Mobile bottom tab nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border flex items-center justify-around z-50">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
            const isActive =
              to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                data-ocid={`nav.mobile.${label.toLowerCase()}_link`}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 w-16 h-full transition-smooth",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
