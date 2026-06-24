'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { db, Booking, Customer, Room, ActivityLog } from '../../../lib/db';
import { 
  CalendarDays, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Percent, 
  Clock,
  ArrowUpRight,
  TrendingDown,
  UserCheck
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardHome() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customersCount, setCustomersCount] = useState(0);
  const [roomsCount, setRoomsCount] = useState(0);
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      const b = await db.getBookings();
      setBookings(b);
      
      const c = await db.getCustomers();
      setCustomersCount(c.length);
      
      const r = await db.getRooms();
      setRoomsCount(r.length);

      const l = await db.getActivityLogs();
      setLogs(l.slice(0, 5));
    };
    loadDashboardData();
  }, []);

  // Compute metrics
  const totalBookings = bookings.length;
  const totalRevenue = bookings
    .filter(b => b.status_code === 'confirmed' || b.status_code === 'completed')
    .reduce((sum, b) => sum + b.total_amount, 0);
  const pendingRevenue = bookings
    .filter(b => b.status_code === 'pending')
    .reduce((sum, b) => sum + b.total_amount, 0);

  // Occupancy estimate: confirmed bookings overlapping current time.
  const occupancyRate = totalBookings > 0 ? 66 : 0; // Seeding default 66% for mockup dashboard preview

  const recentBookings = bookings.slice(0, 5);

  return (
    <AdminLayout title="Concierge Overview">
      
      {/* 1. STATS METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
        {/* Total Bookings */}
        <div className="bg-neutral-900 border border-white/5 p-6 rounded-3xl flex items-center justify-between shadow-sm">
          <div>
            <span className="block text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-2">Total Bookings</span>
            <h3 className="text-2xl font-bold font-serif text-white">{totalBookings}</h3>
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 mt-2 font-medium">
              <TrendingUp className="w-3 h-3" /> +14.2% this month
            </span>
          </div>
          <div className="p-3.5 bg-neutral-950/60 rounded-2xl text-gold-550 border border-white/5">
            <CalendarDays className="w-5 h-5" />
          </div>
        </div>

        {/* Estimated Revenue */}
        <div className="bg-neutral-900 border border-white/5 p-6 rounded-3xl flex items-center justify-between shadow-sm">
          <div>
            <span className="block text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-2">Revenue Estimate</span>
            <h3 className="text-2xl font-bold font-serif text-white">Rp {totalRevenue.toLocaleString()}</h3>
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 mt-2 font-medium">
              <TrendingUp className="w-3 h-3" /> +8.3% vs last quarter
            </span>
          </div>
          <div className="p-3.5 bg-neutral-950/60 rounded-2xl text-gold-550 border border-white/5">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-neutral-900 border border-white/5 p-6 rounded-3xl flex items-center justify-between shadow-sm">
          <div>
            <span className="block text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-2">Total Customers</span>
            <h3 className="text-2xl font-bold font-serif text-white">{customersCount}</h3>
            <span className="inline-flex items-center gap-1 text-[10px] text-neutral-450 mt-2 font-medium">
              Active world travelers
            </span>
          </div>
          <div className="p-3.5 bg-neutral-950/60 rounded-2xl text-gold-550 border border-white/5">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Occupancy Rate */}
        <div className="bg-neutral-900 border border-white/5 p-6 rounded-3xl flex items-center justify-between shadow-sm">
          <div>
            <span className="block text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-2">Occupancy Rate</span>
            <h3 className="text-2xl font-bold font-serif text-white">{occupancyRate}%</h3>
            <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 mt-2 font-medium">
              <Clock className="w-3 h-3" /> High demand season
            </span>
          </div>
          <div className="p-3.5 bg-neutral-950/60 rounded-2xl text-gold-550 border border-white/5">
            <Percent className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* 2. ANALYTICS CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        
        {/* Revenue SVG Bar Chart */}
        <div className="bg-neutral-900 border border-white/5 p-6 rounded-3xl lg:col-span-2 space-y-6 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-semibold tracking-wider uppercase text-white">Monthly Revenue Analytics</h4>
              <span className="text-[10px] text-neutral-400 font-light">Calculations in Millions of Rupiah</span>
            </div>
            <span className="text-xs font-bold text-gold-400">YTD 2026</span>
          </div>

          {/* Bespoke Bar chart layout */}
          <div className="h-64 w-full flex items-end justify-between gap-2.5 pt-6 border-b border-white/5 px-2 relative">
            
            {/* Background Grid Lines */}
            <div className="absolute inset-x-0 top-1/4 border-t border-white/5 pointer-events-none" />
            <div className="absolute inset-x-0 top-2/4 border-t border-white/5 pointer-events-none" />
            <div className="absolute inset-x-0 top-3/4 border-t border-white/5 pointer-events-none" />

            {/* Bars */}
            {[
              { m: 'Jan', val: 12 },
              { m: 'Feb', val: 15 },
              { m: 'Mar', val: 18 },
              { m: 'Apr', val: 24 },
              { m: 'May', val: 32 },
              { m: 'Jun', val: 45 },
              { m: 'Jul', val: 52 },
              { m: 'Aug', val: 48 },
              { m: 'Sep', val: 38 },
              { m: 'Oct', val: 30 },
              { m: 'Nov', val: 22 },
              { m: 'Dec', val: 65 }
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center group relative z-10">
                {/* Tooltip on hover */}
                <div className="absolute -top-10 scale-0 group-hover:scale-100 bg-gold-600 text-white text-[9px] font-bold px-2 py-1 rounded shadow-lg transition-transform z-20">
                  Rp {bar.val}M
                </div>
                
                {/* Bar */}
                <div 
                  style={{ height: `${(bar.val / 70) * 100}%` }}
                  className="w-full bg-neutral-850 hover:bg-gold-500 rounded-t-lg transition-all duration-300"
                />
                <span className="text-[9px] uppercase tracking-wider text-neutral-450 mt-3 font-semibold">
                  {bar.m}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Room Occupancy circular widget */}
        <div className="bg-neutral-900 border border-white/5 p-6 rounded-3xl flex flex-col justify-between shadow-sm">
          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white mb-1">Room Occupancy Breakdown</h4>
            <span className="text-[10px] text-neutral-400 font-light">Status distribution per active room</span>
          </div>

          <div className="my-8 flex justify-center relative">
            {/* SVG Donut Chart */}
            <svg className="w-36 h-36 transform -rotate-90">
              <circle cx="72" cy="72" r="54" className="stroke-neutral-800 fill-transparent" strokeWidth="10" />
              <circle 
                cx="72" 
                cy="72" 
                r="54" 
                className="stroke-gold-500 fill-transparent" 
                strokeWidth="10" 
                strokeDasharray={339}
                strokeDashoffset={339 - (339 * 66) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <span className="block text-2xl font-bold font-serif text-white">66%</span>
              <span className="block text-[8px] uppercase tracking-widest text-neutral-400 mt-0.5">Occupied</span>
            </div>
          </div>

          <div className="space-y-2 border-t border-white/5 pt-4">
            <div className="flex justify-between items-center text-[10px]">
              <span className="flex items-center gap-1.5 text-neutral-400">
                <span className="w-2.5 h-2.5 rounded bg-gold-500" />
                Villa Aurelia
              </span>
              <span className="font-bold text-white">Booked</span>
            </div>
            <div className="flex justify-between items-center text-[10px]">
              <span className="flex items-center gap-1.5 text-neutral-400">
                <span className="w-2.5 h-2.5 rounded bg-gold-500" />
                Ocean Suite
              </span>
              <span className="font-bold text-white">Booked</span>
            </div>
            <div className="flex justify-between items-center text-[10px]">
              <span className="flex items-center gap-1.5 text-neutral-400">
                <span className="w-2.5 h-2.5 rounded bg-neutral-800" />
                Jungle Sanctuary
              </span>
              <span className="font-bold text-neutral-500">Available</span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. RECENT BOOKINGS & ACTIVITIES TABLE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Bookings table */}
        <div className="bg-neutral-900 border border-white/5 p-6 rounded-3xl lg:col-span-2 space-y-4 shadow-sm">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white">Recent Booking Requests</h4>
            <Link href="/admin/bookings" className="text-[10px] uppercase font-bold tracking-widest text-gold-450 hover:text-gold-300">
              View All
            </Link>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs text-neutral-400 border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[9px] uppercase tracking-widest text-neutral-500">
                  <th className="py-3 px-2">Guest</th>
                  <th className="py-3 px-2">Room</th>
                  <th className="py-3 px-2">Dates</th>
                  <th className="py-3 px-2">Total Amount</th>
                  <th className="py-3 px-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-light">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-neutral-950/20">
                    <td className="py-3.5 px-2">
                      <span className="block font-semibold text-white">{b.customer_name}</span>
                      <span className="block text-[10px] text-neutral-500">{b.customer_country}</span>
                    </td>
                    <td className="py-3.5 px-2 text-neutral-300">{b.room_name}</td>
                    <td className="py-3.5 px-2">
                      <span className="block text-[10px] text-neutral-300 font-medium">{b.check_in}</span>
                      <span className="block text-[9px] text-neutral-500">{b.total_nights} Nights</span>
                    </td>
                    <td className="py-3.5 px-2 font-semibold text-gold-400">Rp {b.total_amount.toLocaleString()}</td>
                    <td className="py-3.5 px-2 text-right">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider border ${
                        b.status_code === 'confirmed'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : b.status_code === 'pending'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-neutral-850 text-neutral-450 border-white/10'
                      }`}>
                        {b.status_code}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Logs */}
        <div className="bg-neutral-900 border border-white/5 p-6 rounded-3xl space-y-4 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white mb-4">Concierge Activity logs</h4>
            
            <div className="space-y-4 font-light text-xs text-neutral-400">
              {logs.map((log) => (
                <div key={log.id} className="flex gap-3 border-b border-white/5 pb-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    log.action === 'LOGIN' 
                      ? 'bg-emerald-400' 
                      : log.action === 'CREATE' 
                      ? 'bg-sky-400' 
                      : 'bg-gold-500'
                  }`} />
                  <div>
                    <p className="text-neutral-250 leading-relaxed">
                      <strong>{log.action}:</strong> {log.details}
                    </p>
                    <span className="text-[9px] text-neutral-500 mt-1 block">
                      {new Date(log.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </AdminLayout>
  );
}
