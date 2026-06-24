'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { db } from '../lib/db';

export type UserRole = 'super_admin' | 'demo_user';

interface AuthUser {
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginAsDemo: () => void;
  logout: () => void;
  isDemo: boolean;
  isAdmin: boolean;
  updateAdminCredentials: (email: string, password?: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if session exists in local storage (for isomorphic mock)
    const storedAuth = localStorage.getItem('aurelia_auth_session');
    if (storedAuth) {
      try {
        setUser(JSON.parse(storedAuth));
      } catch (e) {
        localStorage.removeItem('aurelia_auth_session');
      }
    }
    
    // Listen to Supabase Auth State changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Read profile role if available
        let role: UserRole = 'demo_user';
        const adminEmail = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL || process.env.SUPER_ADMIN_EMAIL || 'admin@aurelia.com';
        if (session.user.email === adminEmail) {
          role = 'super_admin';
        }
        
        const authUser = { email: session.user.email || '', role };
        setUser(authUser);
        localStorage.setItem('aurelia_auth_session', JSON.stringify(authUser));
      } else {
        // Only clear if not mock logged in
        if (!localStorage.getItem('aurelia_auth_session')) {
          setUser(null);
        }
      }
      setLoading(false);
    });

    setLoading(false);
    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    // 1. Fallback Mock Check (in case Supabase fails or credentials match env settings)
    let adminEmail = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL || process.env.SUPER_ADMIN_EMAIL || 'admin@aurelia.com';
    let adminPass = process.env.NEXT_PUBLIC_SUPER_ADMIN_PASSWORD || process.env.SUPER_ADMIN_PASSWORD || 'admin123';
    
    // Check if custom credentials are saved in localStorage
    const storedCreds = localStorage.getItem('aurelia_admin_credentials');
    if (storedCreds) {
      try {
        const creds = JSON.parse(storedCreds);
        if (creds.email && creds.password) {
          adminEmail = creds.email;
          adminPass = creds.password;
        }
      } catch (e) {}
    }

    console.log("LOGIN CHECK:", {
      inputEmail: email,
      inputPassword: password,
      envEmail: adminEmail,
      envPass: adminPass
    });

    if (email.toLowerCase() === adminEmail.toLowerCase() && password === adminPass) {
      const authUser: AuthUser = { email, role: 'super_admin' };
      setUser(authUser);
      localStorage.setItem('aurelia_auth_session', JSON.stringify(authUser));
      db.addActivityLog('LOGIN', 'Super Admin logged in (Credentials match custom/env vars)');
      setLoading(false);
      return true;
    }

    // 2. Demo User Check
    if (email.toLowerCase() === 'demo@homestay.com' && password === 'demo123') {
      const authUser: AuthUser = { email, role: 'demo_user' };
      setUser(authUser);
      localStorage.setItem('aurelia_auth_session', JSON.stringify(authUser));
      db.addActivityLog('LOGIN', 'Demo User logged in');
      setLoading(false);
      return true;
    }

    // 3. Supabase Auth Attempt
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setLoading(false);
        return false;
      }
      if (data.user) {
        const isSuper = data.user.email === adminEmail;
        const authUser: AuthUser = { 
          email: data.user.email || '', 
          role: isSuper ? 'super_admin' : 'demo_user' 
        };
        setUser(authUser);
        localStorage.setItem('aurelia_auth_session', JSON.stringify(authUser));
        db.addActivityLog('LOGIN', `User signed in: ${data.user.email} (${authUser.role})`);
        setLoading(false);
        return true;
      }
    } catch {
      // Ignored, fallback returned false
    }

    setLoading(false);
    return false;
  };

  const loginAsDemo = () => {
    const authUser: AuthUser = { email: 'demo@homestay.com', role: 'demo_user' };
    setUser(authUser);
    localStorage.setItem('aurelia_auth_session', JSON.stringify(authUser));
    db.addActivityLog('LOGIN', 'Demo mode login initiated');
  };

  const logout = () => {
    supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('aurelia_auth_session');
    db.addActivityLog('LOGOUT', 'User logged out');
  };

  const updateAdminCredentials = async (email: string, password?: string): Promise<{ success: boolean; message: string }> => {
    if (isDemo) {
      return { success: false, message: 'Demo Mode Active. Credentials modification is disabled.' };
    }
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const updatePayload: any = { email };
        if (password) {
          updatePayload.password = password;
        }
        const { error } = await supabase.auth.updateUser(updatePayload);
        if (error) {
          return { success: false, message: error.message };
        }
      }
    } catch (e) {
      // Supabase is not configured or offline, ignore and proceed to mock fallback
    }

    // Retrieve previous credentials for preserving password if only changing email
    let currentPass = process.env.NEXT_PUBLIC_SUPER_ADMIN_PASSWORD || 'admin123';
    const storedCreds = localStorage.getItem('aurelia_admin_credentials');
    if (storedCreds) {
      try {
        const creds = JSON.parse(storedCreds);
        if (creds.password) {
          currentPass = creds.password;
        }
      } catch (e) {}
    }

    const creds = { 
      email, 
      password: password || currentPass 
    };
    localStorage.setItem('aurelia_admin_credentials', JSON.stringify(creds));

    // Update session state dynamically
    if (user && user.role === 'super_admin') {
      const updatedUser = { email, role: 'super_admin' as UserRole };
      setUser(updatedUser);
      localStorage.setItem('aurelia_auth_session', JSON.stringify(updatedUser));
    }
    
    db.addActivityLog('EDIT', `Updated Super Admin credentials to ${email}`);
    return { success: true, message: 'Credentials updated successfully.' };
  };

  const isDemo = user?.role === 'demo_user';
  const isAdmin = user?.role === 'super_admin';

  return (
    <ThemeCheck>
      <AuthContext.Provider value={{ user, loading, login, loginAsDemo, logout, isDemo, isAdmin, updateAdminCredentials }}>
        {children}
      </AuthContext.Provider>
    </ThemeCheck>
  );
};

// Sub-component to ensure admin layout starts in dark mode since dashboards look best in dark!
const ThemeCheck: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Dashboards look stunning in dark mode, set default class for admin routes
    if (window.location.pathname.startsWith('/admin')) {
      const savedTheme = localStorage.getItem('aurelia_theme');
      if (savedTheme !== 'light') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('aurelia_theme', 'dark');
      }
    }
  }, []);
  return <>{children}</>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
