import React from 'react';
import { AuthProvider } from '../../context/AuthContext';

export const metadata = {
  title: 'Aurelia SaaS Concierge Dashboard',
  description: 'Premium administrative suite for luxury homestays.',
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-neutral-900 text-neutral-100 selection:bg-gold-500 selection:text-white transition-colors duration-300">
        {children}
      </div>
    </AuthProvider>
  );
}
