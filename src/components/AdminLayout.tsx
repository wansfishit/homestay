'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Home, 
  Image as ImageIcon, 
  BookOpen, 
  HelpCircle, 
  MessageSquare, 
  Sliders, 
  Globe, 
  LogOut, 
  ExternalLink,
  Menu,
  X,
  AlertOctagon,
  ShieldCheck,
  Eye
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const { user, loading, logout, isDemo } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Route Protection: If not logged in, force login
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Bookings', href: '/admin/bookings', icon: CalendarDays },
    { name: 'Rooms', href: '/admin/rooms', icon: Home },
    { name: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
    { name: 'Journal', href: '/admin/blog', icon: BookOpen },
    { name: 'FAQs', href: '/admin/faq', icon: HelpCircle },
    { name: 'Reviews', href: '/admin/testimonials', icon: MessageSquare },
    { name: 'CMS Settings', href: '/admin/cms', icon: Sliders },
    { name: 'SEO Settings', href: '/admin/seo', icon: Globe },
  ];

  return (
    <div className="min-h-screen flex bg-neutral-950 font-sans text-neutral-100">
      
      {/* 1. SIDEBAR (Desktop and Drawer) */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-neutral-900 border-r border-white/5 flex flex-col justify-between transform transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div>
          {/* Logo Brand */}
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <div>
              <span className="font-serif text-lg font-bold tracking-widest text-white block">AURELIA</span>
              <span className="text-[9px] tracking-[0.25em] text-gold-400 font-bold uppercase block mt-0.5">Concierge SaaS</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-neutral-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile widget */}
          <div className="p-4 border-b border-white/5 bg-neutral-950/40 m-4 rounded-2xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gold-650 flex items-center justify-center text-neutral-850 font-bold font-serif text-sm shadow-inner bg-gradient-to-br from-gold-450 to-gold-600 text-white">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <span className="block text-[10px] text-neutral-400 font-bold truncate max-w-[140px]">{user.email}</span>
              {isDemo ? (
                <span className="inline-flex items-center gap-1 text-[8px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider mt-1">
                  <Eye className="w-2.5 h-2.5" /> Demo User
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider mt-1">
                  <ShieldCheck className="w-2.5 h-2.5" /> Super Admin
                </span>
              )}
            </div>
          </div>

          {/* Nav Links */}
          <nav className="px-4 py-2 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wider transition-all uppercase ${
                    isActive 
                      ? 'bg-gold-500 text-white shadow-md' 
                      : 'text-neutral-450 hover:text-neutral-200 hover:bg-neutral-850'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Options */}
        <div className="p-4 border-t border-white/5 space-y-2">
          {/* Back to homepage */}
          <Link
            href="/id"
            target="_blank"
            className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-neutral-850 transition-colors uppercase tracking-widest border border-white/5"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-gold-500" />
              Live Website
            </span>
          </Link>

          {/* Logout */}
          <button
            onClick={() => {
              logout();
              router.push('/admin/login');
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-350 hover:bg-rose-500/10 transition-colors uppercase tracking-widest cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-rose-500" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN BODY */}
      <div className="flex-1 min-h-screen flex flex-col lg:pl-64">
        
        {/* Top Header */}
        <header className="h-16 border-b border-white/5 bg-neutral-900 px-6 flex items-center justify-between sticky top-0 z-35">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-neutral-400 hover:text-white p-1 border border-white/10 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-serif text-lg md:text-xl font-bold tracking-wide text-white uppercase">{title}</h1>
          </div>

          <div className="flex items-center gap-4">
            {isDemo && (
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-amber-500/15 text-amber-400 border border-amber-500/20 rounded-full text-[10px] uppercase font-bold tracking-wider">
                <AlertOctagon className="w-3.5 h-3.5 animate-pulse" />
                Demo Mode Active
              </div>
            )}
          </div>
        </header>

        {/* Demo Notification Banner */}
        {isDemo && (
          <div className="bg-amber-500/20 border-b border-amber-500/30 text-amber-300 text-xs px-6 py-2.5 flex items-center justify-center gap-2 font-medium">
            <AlertOctagon className="w-4 h-4 shrink-0" />
            <span>Demo Mode is active. Creating, modifying, uploading, and deleting items is restricted.</span>
          </div>
        )}

        {/* Content Box */}
        <main className="p-6 md:p-8 flex-grow">
          {children}
        </main>
      </div>

    </div>
  );
};
export default AdminLayout;
