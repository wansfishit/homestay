'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { db, FAQ } from '../../../lib/db';
import { useAuth } from '../../../context/AuthContext';
import { Plus, Edit, Trash2, Check, X as CloseIcon, ArrowUp, ArrowDown } from 'lucide-react';

export default function AdminFAQManager() {
  const { isDemo } = useAuth();
  
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [editingFaq, setEditingFaq] = useState<Partial<FAQ> | null>(null);
  const [isNew, setIsNew] = useState(false);

  // Field states
  const [questionEn, setQuestionEn] = useState('');
  const [questionId, setQuestionId] = useState('');
  const [answerEn, setAnswerEn] = useState('');
  const [answerId, setAnswerId] = useState('');
  const [sortOrder, setSortOrder] = useState(0);

  // Toast
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const loadFaqs = async () => {
    const list = await db.getFAQs();
    setFaqs(list);
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const triggerToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const handleEditClick = (f: FAQ) => {
    setEditingFaq(f);
    setIsNew(false);
    setQuestionEn(f.question_en);
    setQuestionId(f.question_id);
    setAnswerEn(f.answer_en);
    setAnswerId(f.answer_id);
    setSortOrder(f.sort_order);
  };

  const handleCreateClick = () => {
    setEditingFaq({});
    setIsNew(true);
    setQuestionEn('');
    setQuestionId('');
    setAnswerEn('');
    setAnswerId('');
    setSortOrder(faqs.length + 1);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemo) {
      triggerToast('Demo Mode Active. Editing is disabled.', 'error');
      return;
    }

    if (!questionEn || !questionId || !answerEn || !answerId) {
      triggerToast('All language fields are required.', 'error');
      return;
    }

    const payload: FAQ = {
      id: editingFaq?.id || `faq-${Date.now()}`,
      question_en: questionEn,
      question_id: questionId,
      answer_en: answerEn,
      answer_id: answerId,
      sort_order: sortOrder
    };

    try {
      await db.saveFAQ(payload);
      triggerToast(isNew ? 'FAQ item added.' : 'FAQ item updated.');
      setEditingFaq(null);
      loadFaqs();
    } catch {
      triggerToast('Save failed.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (isDemo) {
      triggerToast('Demo Mode Active. Editing is disabled.', 'error');
      return;
    }

    if (window.confirm('Delete this FAQ record?')) {
      const success = await db.deleteFAQ(id);
      if (success) {
        triggerToast('FAQ deleted.');
        loadFaqs();
      }
    }
  };

  const handleSort = async (f: FAQ, dir: 'up' | 'down') => {
    if (isDemo) {
      triggerToast('Demo Mode Active. Sorting is disabled.', 'error');
      return;
    }
    const idx = faqs.findIndex(item => item.id === f.id);
    const nextIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (nextIdx < 0 || nextIdx >= faqs.length) return;

    const reordered = [...faqs];
    const temp = reordered[idx].sort_order;
    reordered[idx].sort_order = reordered[nextIdx].sort_order;
    reordered[nextIdx].sort_order = temp;

    await db.saveFAQ(reordered[idx]);
    await db.saveFAQ(reordered[nextIdx]);
    loadFaqs();
    triggerToast('FAQ order updated.');
  };

  return (
    <AdminLayout title="FAQ Catalog">
      
      {toast.show && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl border text-xs font-semibold shadow-xl flex items-center gap-2.5 transition-all ${
          toast.type === 'success' ? 'bg-emerald-950 border-emerald-500/30 text-emerald-450' : 'bg-rose-955 border-rose-500/30 text-rose-455'
        }`}>
          <Check className="w-4 h-4" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Action */}
      <div className="flex justify-end mb-6">
        <button
          onClick={handleCreateClick}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600 text-white rounded-full text-xs font-bold uppercase tracking-widest cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4" />
          Add FAQ Item
        </button>
      </div>

      {/* List */}
      <div className="bg-neutral-900 border border-white/5 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs text-neutral-400 border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[9px] uppercase tracking-widest text-neutral-500">
                <th className="py-4 px-4 w-12 text-center">Order</th>
                <th className="py-4 px-4">Question (EN / ID)</th>
                <th className="py-4 px-4">Answer Snippet</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-light">
              {faqs.map((f, idx) => (
                <tr key={f.id} className="hover:bg-neutral-950/20">
                  <td className="py-4 px-4 text-center font-bold text-neutral-400">{f.sort_order}</td>
                  <td className="py-4 px-4">
                    <span className="block font-semibold text-white">{f.question_en}</span>
                    <span className="block text-[10px] text-neutral-500 mt-1">{f.question_id}</span>
                  </td>
                  <td className="py-4 px-4 max-w-xs truncate text-neutral-300">{f.answer_en}</td>
                  <td className="py-4 px-4 text-right space-x-2 shrink-0">
                    <button disabled={idx === 0} onClick={() => handleSort(f, 'up')} className="p-1.5 hover:bg-neutral-800 text-neutral-450 disabled:opacity-20 rounded cursor-pointer">
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button disabled={idx === faqs.length - 1} onClick={() => handleSort(f, 'down')} className="p-1.5 hover:bg-neutral-800 text-neutral-450 disabled:opacity-20 rounded cursor-pointer">
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleEditClick(f)} className="px-3 py-1.5 border border-white/5 hover:border-gold-500 bg-neutral-950/20 text-neutral-350 hover:text-white rounded-xl text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(f.id)} className="p-1.5 hover:bg-rose-500/10 text-rose-400 rounded-xl cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal */}
      {editingFaq && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-in">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-neutral-950/20">
              <h4 className="font-serif text-sm font-bold text-white uppercase">{isNew ? 'Create FAQ' : 'Edit FAQ Details'}</h4>
              <button onClick={() => setEditingFaq(null)} className="p-1.5 hover:bg-neutral-850 rounded-full cursor-pointer text-neutral-400 hover:text-white">
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1">Question (English)</label>
                <input type="text" value={questionEn} onChange={(e) => setQuestionEn(e.target.value)} placeholder="How do I get there?" className="w-full px-3 py-2 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white" required />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1">Pertanyaan (Bahasa Indonesia)</label>
                <input type="text" value={questionId} onChange={(e) => setQuestionId(e.target.value)} placeholder="Bagaimana cara saya ke sana?" className="w-full px-3 py-2 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white" required />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1">Answer Body (English)</label>
                <textarea value={answerEn} onChange={(e) => setAnswerEn(e.target.value)} rows={3} className="w-full px-3 py-2 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white resize-none" required />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1">Jawaban Lengkap (Bahasa Indonesia)</label>
                <textarea value={answerId} onChange={(e) => setAnswerId(e.target.value)} rows={3} className="w-full px-3 py-2 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white resize-none" required />
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1">Sort order key</label>
                <input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} className="w-full px-3 py-2 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white" />
              </div>

              <div className="flex gap-2 justify-end pt-4 bg-neutral-950/20 p-6 -mx-6 -mb-6 rounded-b-3xl">
                <button type="button" onClick={() => setEditingFaq(null)} className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-full font-bold uppercase tracking-wider text-[9px] cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-gold-500 hover:bg-gold-600 text-white rounded-full font-bold uppercase tracking-wider text-[9px] cursor-pointer shadow-md">Save FAQ</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}
