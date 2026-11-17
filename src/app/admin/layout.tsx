"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck2,
  UtensilsCrossed,
  Users2,
  Sliders,
  LogOut,
  ExternalLink,
  ShieldAlert,
  Menu as MenuIcon,
  X,
} from "lucide-react";
import { AuthService, AdminUser } from "@/lib/auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    const session = AuthService.getStoredSession();
    setCurrentUser(session);

    if (!session && !isLoginPage) {
      router.push("/admin/login");
    } else {
      setLoading(false);
    }
  }, [pathname, isLoginPage, router]);

  const handleLogout = () => {
    AuthService.clearSession();
    router.push("/admin/login");
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center text-gold">
        <div className="w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin" />
      </div>
    );
  }

  const navLinks = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Reservations", href: "/admin/reservations", icon: CalendarCheck2 },
    { name: "Menu & Cellar", href: "/admin/menu", icon: UtensilsCrossed },
    { name: "Patron Directory", href: "/admin/customers", icon: Users2 },
    { name: "Restaurant Settings", href: "/admin/settings", icon: Sliders },
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-ivory flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#121212] border-r border-white/10 shrink-0 justify-between p-6">
        <div>
          {/* Admin Header & Monogram */}
          <div className="flex items-center space-x-3 mb-10 pb-6 border-b border-white/10">
            <div className="w-10 h-10 rounded-full border border-gold/60 flex items-center justify-center bg-gold/10">
              <span className="font-serif-luxury text-lg text-gold font-light">A</span>
            </div>
            <div>
              <h2 className="font-serif-luxury text-xl tracking-wider text-ivory uppercase">
                Aurélia
              </h2>
              <span className="text-[9px] uppercase tracking-widest text-gold block font-mono">
                Operations & Maitre D'
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-sans transition-all ${
                    isActive
                      ? "bg-gold text-black font-semibold shadow-[0_0_20px_rgba(200,169,106,0.3)]"
                      : "text-ivory/60 hover:text-ivory hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="pt-6 border-t border-white/10 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <div>
              <p className="font-medium text-ivory text-xs">{currentUser?.name || "Service Manager"}</p>
              <p className="text-[10px] text-gold uppercase tracking-wider font-mono">
                {currentUser?.role || "Director"}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-ivory/40 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <Link
            href="/"
            className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl border border-white/10 text-ivory/60 hover:text-gold hover:border-gold/40 text-[11px] uppercase tracking-wider transition-colors"
          >
            <span>Live Guest Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header Bar */}
        <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-[#121212] border-b border-white/10">
          <div className="flex items-center space-x-2">
            <span className="font-serif-luxury text-lg text-gold font-light">A</span>
            <span className="font-serif-luxury text-sm tracking-wider uppercase text-ivory">
              Aurélia Portal
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="p-2 text-ivory border border-white/10 rounded-lg"
            >
              {mobileNavOpen ? <X className="w-5 h-5 text-gold" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Mobile Dropdown Nav */}
        {mobileNavOpen && (
          <div className="lg:hidden bg-[#141414] border-b border-white/10 p-6 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-sans ${
                    isActive ? "bg-gold text-black font-semibold" : "text-ivory/70 hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <Link href="/" className="text-xs text-gold flex items-center space-x-1">
                <span>View Guest Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button onClick={handleLogout} className="text-xs text-red-400">
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Content Body */}
        <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

