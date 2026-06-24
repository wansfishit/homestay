'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { db, Booking } from '../../../lib/db';
import { useAuth } from '../../../context/AuthContext';
import { 
  Search, 
  Filter, 
  Trash2, 
  Check, 
  X as CloseIcon, 
  Download, 
  Eye,
  CheckCircle,
  FileSpreadsheet,
  FileText
} from 'lucide-react';

export default function BookingsManager() {
  const { isDemo } = useAuth();
  
  // Data States
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  
  // Alert Notifications
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const loadBookings = async () => {
    const list = await db.getBookings();
    setBookings(list);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const triggerToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage('');
    }, 4000);
  };

  const handleStatusChange = async (id: string, newStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed') => {
    if (isDemo) {
      triggerToast('Demo Mode Active. Editing is disabled.', 'error');
      return;
    }

    const success = await db.updateBookingStatus(id, newStatus);
    if (success) {
      triggerToast(`Booking status marked as: ${newStatus.toUpperCase()}`);
      loadBookings();
      // Sync modal detail
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking(prev => prev ? { ...prev, status_code: newStatus } : null);
      }
    } else {
      triggerToast('Status update failed.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (isDemo) {
      triggerToast('Demo Mode Active. Editing is disabled.', 'error');
      return;
    }

    if (window.confirm('Are you sure you want to delete this booking record?')) {
      const success = await db.deleteBooking(id);
      if (success) {
        triggerToast('Booking record deleted successfully.');
        setSelectedBooking(null);
        loadBookings();
      }
    }
  };

  // Simulated Excel/PDF Export
  const handleExport = (format: 'Excel' | 'PDF') => {
    if (isDemo) {
      triggerToast(`Demo Mode Active. Export to ${format} is disabled.`, 'error');
      return;
    }
    triggerToast(`Exporting bookings catalog to ${format}... Download will start shortly.`);
  };

  // Filters
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'all' || b.status_code === statusFilter;
    const name = b.customer_name?.toLowerCase() || '';
    const email = b.customer_email?.toLowerCase() || '';
    const whatsapp = b.customer_whatsapp || '';
    const query = searchQuery.toLowerCase();
    const matchesSearch = name.includes(query) || email.includes(query) || whatsapp.includes(query);
    return matchesStatus && matchesSearch;
  });

  return (
    <AdminLayout title="Bookings Ledger">
      
      {/* Toast Alert popup */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl border text-xs font-semibold shadow-xl flex items-center gap-2.5 transition-all ${
          toastType === 'success' 
            ? 'bg-emerald-950 border-emerald-500/30 text-emerald-400' 
            : 'bg-rose-950 border-rose-500/30 text-rose-455'
        }`}>
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ACTION BAR */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-8 bg-neutral-900 border border-white/5 p-4 rounded-3xl shadow-sm">
        
        {/* Search */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Guest name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs outline-none focus:border-gold-450 text-white"
          />
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-wrap items-center gap-3.5 w-full lg:w-auto">
          {/* Status selector */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-neutral-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-neutral-950/60 border border-white/10 rounded-xl text-xs px-3 py-2.5 outline-none text-neutral-300 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Excel Export */}
          <button
            onClick={() => handleExport('Excel')}
            className="flex items-center gap-2 px-4 py-2.5 border border-white/5 hover:border-gold-500 bg-neutral-950/30 rounded-xl text-xs font-semibold uppercase tracking-widest text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Export Excel</span>
          </button>

          {/* PDF Export */}
          <button
            onClick={() => handleExport('PDF')}
            className="flex items-center gap-2 px-4 py-2.5 border border-white/5 hover:border-gold-500 bg-neutral-950/30 rounded-xl text-xs font-semibold uppercase tracking-widest text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4 text-rose-450" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        </div>
      </div>

      {/* BOOKINGS TABLE CONTAINER */}
      <div className="bg-neutral-900 border border-white/5 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs text-neutral-400 border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[9px] uppercase tracking-widest text-neutral-500">
                <th className="py-4 px-4">Guest Info</th>
                <th className="py-4 px-4">Room Stays</th>
                <th className="py-4 px-4">Check In/Out</th>
                <th className="py-4 px-4">Financials</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-light">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-neutral-950/20">
                    <td className="py-4 px-4">
                      <span className="block font-semibold text-white">{b.customer_name}</span>
                      <span className="block text-[10px] text-neutral-500">{b.customer_email}</span>
                      <span className="block text-[9px] text-neutral-450 mt-0.5">WhatsApp: {b.customer_whatsapp}</span>
                    </td>
                    <td className="py-4 px-4 text-neutral-350">{b.room_name}</td>
                    <td className="py-4 px-4">
                      <span className="block text-[10px] text-neutral-350 font-medium">{b.check_in} &rarr; {b.check_out}</span>
                      <span className="block text-[9px] text-neutral-500 mt-0.5">{b.total_nights} Nights | {b.guest_count} Guests</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="block font-semibold text-gold-400">Rp {b.total_amount.toLocaleString()}</span>
                      {b.discount_amount > 0 && (
                        <span className="block text-[9px] text-emerald-500 mt-0.5">Discount: Rp {b.discount_amount.toLocaleString()} ({b.promo_code})</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <select
                        value={b.status_code}
                        onChange={(e) => handleStatusChange(b.id, e.target.value as 'pending' | 'confirmed' | 'cancelled' | 'completed')}
                        className={`px-3 py-1.5 rounded-full text-[9px] uppercase font-bold tracking-wider cursor-pointer bg-neutral-950 border outline-none ${
                          b.status_code === 'confirmed'
                            ? 'text-emerald-450 border-emerald-500/20'
                            : b.status_code === 'pending'
                            ? 'text-amber-450 border-amber-500/20'
                            : b.status_code === 'cancelled'
                            ? 'text-rose-455 border-rose-500/20'
                            : 'text-neutral-350 border-white/10'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="p-2 border border-white/5 hover:border-gold-500 bg-neutral-950/20 rounded-lg text-neutral-450 hover:text-white transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="p-2 border border-white/5 hover:border-rose-500 bg-neutral-950/20 hover:bg-rose-500/10 rounded-lg text-neutral-450 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-neutral-500">
                    No bookings match your query parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL PANEL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-in">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-neutral-950/20">
              <div>
                <h4 className="font-serif text-lg font-bold text-white uppercase">Reservation Details</h4>
                <span className="text-[9px] text-neutral-450 font-bold uppercase tracking-widest">{selectedBooking.id}</span>
              </div>
              <button 
                onClick={() => setSelectedBooking(null)}
                className="p-2 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-full transition-colors cursor-pointer"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 text-xs text-neutral-300">
              
              {/* Guest Details */}
              <div className="grid grid-cols-2 gap-4 border-b border-white/5 pb-4">
                <div>
                  <span className="block text-[8px] uppercase tracking-widest text-neutral-500 font-semibold mb-1">Guest Name</span>
                  <span className="font-semibold text-white">{selectedBooking.customer_name}</span>
                </div>
                <div>
                  <span className="block text-[8px] uppercase tracking-widest text-neutral-500 font-semibold mb-1">Country</span>
                  <span className="text-neutral-200">{selectedBooking.customer_country}</span>
                </div>
                <div>
                  <span className="block text-[8px] uppercase tracking-widest text-neutral-500 font-semibold mb-1">Email Coordinates</span>
                  <span>{selectedBooking.customer_email}</span>
                </div>
                <div>
                  <span className="block text-[8px] uppercase tracking-widest text-neutral-500 font-semibold mb-1">WhatsApp Mobile</span>
                  <span>{selectedBooking.customer_whatsapp}</span>
                </div>
              </div>

              {/* Room details */}
              <div className="grid grid-cols-2 gap-4 border-b border-white/5 pb-4">
                <div>
                  <span className="block text-[8px] uppercase tracking-widest text-neutral-500 font-semibold mb-1">Room selection</span>
                  <span className="text-neutral-200">{selectedBooking.room_name}</span>
                </div>
                <div>
                  <span className="block text-[8px] uppercase tracking-widest text-neutral-500 font-semibold mb-1">Tamu Count</span>
                  <span>{selectedBooking.guest_count} Guests</span>
                </div>
                <div>
                  <span className="block text-[8px] uppercase tracking-widest text-neutral-500 font-semibold mb-1">Duration Stays</span>
                  <span>{selectedBooking.total_nights} Nights ({selectedBooking.check_in} &rarr; {selectedBooking.check_out})</span>
                </div>
                <div>
                  <span className="block text-[8px] uppercase tracking-widest text-neutral-500 font-semibold mb-1">Promo Applied</span>
                  <span className="text-emerald-450 font-medium">{selectedBooking.promo_code || 'None'}</span>
                </div>
              </div>

              {/* Amount invoice */}
              <div className="bg-neutral-950/40 p-4 rounded-2xl border border-white/5 space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Total Invoice Price</span>
                  <span className="font-bold text-gold-450 text-sm">Rp {selectedBooking.total_amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-neutral-500">Discount Amount</span>
                  <span className="text-emerald-500">- Rp {selectedBooking.discount_amount.toLocaleString()}</span>
                </div>
              </div>

              {/* Client Notes */}
              <div>
                <span className="block text-[8px] uppercase tracking-widest text-neutral-500 font-semibold mb-1">Client Requests / Notes</span>
                <p className="bg-neutral-950/20 p-3 rounded-xl border border-white/5 italic text-neutral-400">
                  {selectedBooking.notes || 'No custom remarks provided.'}
                </p>
              </div>

              {/* Action statuses buttons in modal */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-[8px] uppercase tracking-widest text-neutral-500 font-bold w-full mb-1">Mark Status:</span>
                <button
                  onClick={() => handleStatusChange(selectedBooking.id, 'confirmed')}
                  className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl hover:bg-emerald-500/20 transition-all font-semibold uppercase tracking-wider text-[9px] cursor-pointer"
                >
                  Confirm Stay
                </button>
                <button
                  onClick={() => handleStatusChange(selectedBooking.id, 'completed')}
                  className="px-4 py-2 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-xl hover:bg-sky-500/20 transition-all font-semibold uppercase tracking-wider text-[9px] cursor-pointer"
                >
                  Mark Completed
                </button>
                <button
                  onClick={() => handleStatusChange(selectedBooking.id, 'cancelled')}
                  className="px-4 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl hover:bg-rose-500/20 transition-all font-semibold uppercase tracking-wider text-[9px] cursor-pointer"
                >
                  Cancel Booking
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}
