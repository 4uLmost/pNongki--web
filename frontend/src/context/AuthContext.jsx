import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AuthContext } from './useAuth';

// Akun Demo Bawaan pNongki! (Sesuai profil eksisting Anak Ulama)
const DEMO_USER = {
  id: 'demo-user-anak-ulama',
  email: 'user@pnongki.id',
  full_name: 'Anak Ulama',
  name: 'Anak Ulama',
  campus: 'User pNongki',
  phone: '',
  role: 'user', // Default: 'user'
  xpPoints: 520,
  pointsBalance: 350,
  avatar_url: null,
  isDemo: true,
};

function resolveUserRole(email, userMetaRole, dbUserRole) {
  const cleanEmail = (email || '').toLowerCase().trim();

  const isAdmin = cleanEmail.includes('@admin.pnongki') || cleanEmail.endsWith('@admin.pnongki') || userMetaRole === 'admin' || dbUserRole === 'admin';
  if (isAdmin) return 'admin';
  if (dbUserRole) {
    if (dbUserRole === 'owner') return 'owner';
    if (dbUserRole === 'user' || dbUserRole === 'mahasiswa') return 'user';
  }
  if (userMetaRole === 'owner') return 'owner';
  return dbUserRole || userMetaRole || 'user';
}

function mapSupabaseUser(supaUser) {
  if (!supaUser) return null;
  const userMeta = supaUser.user_metadata || {};
  const emailName = supaUser.email ? supaUser.email.split('@')[0] : 'User';
  const cleanEmail = (supaUser.email || '').toLowerCase().trim();
  const resolvedRole = resolveUserRole(cleanEmail, userMeta.role, null);
  const isSuper = resolvedRole === 'super_admin';
  const isAdmin = isSuper || resolvedRole === 'admin';

  return {
    id: supaUser.id,
    email: supaUser.email,
    full_name: userMeta.full_name || (isSuper ? 'Super Admin pNongki' : isAdmin ? 'Admin pNongki' : emailName),
    name: userMeta.full_name || (isSuper ? 'Super Admin pNongki' : isAdmin ? 'Admin pNongki' : emailName),
    campus: userMeta.campus || (isSuper ? 'Direksi & Operasional pNongki' : isAdmin ? 'Tim Operasional pNongki' : 'User pNongki'),
    phone: userMeta.phone || '',
    role: resolvedRole,
    xpPoints: userMeta.xp_points || 0,
    pointsBalance: userMeta.points_balance || 0,
    avatar_url: userMeta.avatar_url || null,
    isDemo: false,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('pnongki_auth_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed || null;
      } catch {
        return null;
      }
    }
    return null; // Bawaan: belum login
  });
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(() => isSupabaseConfigured);

  // Inisialisasi dan listener session Supabase Auth
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let isMounted = true;

    // 1. Cek sesi aktif Supabase yang tersimpan di browser
    supabase.auth.getSession().then(async ({ data: { session: currentSession }, error }) => {
      if (!isMounted) return;
      if (error) {
        console.error('Error fetching Supabase session:', error);
      }
      setSession(currentSession);
      if (currentSession?.user) {
        let mappedUser = mapSupabaseUser(currentSession.user);
        setUser(mappedUser);
        localStorage.setItem('pnongki_auth_user', JSON.stringify(mappedUser));

        // Sinkronkan data profil & poin terbaru dari tabel public.users
        try {
          const { data: dbUser } = await supabase
            .from('users')
            .select('*')
            .eq('id', currentSession.user.id)
            .maybeSingle();

          if (dbUser && isMounted) {
            const finalRole = resolveUserRole(
              currentSession.user.email,
              currentSession.user.user_metadata?.role,
              dbUser.role
            );
            mappedUser = {
              ...mappedUser,
              name: dbUser.full_name || dbUser.name || mappedUser.name,
              full_name: dbUser.full_name || mappedUser.full_name,
              phone: dbUser.phone_number || mappedUser.phone,
              campus: dbUser.campus || mappedUser.campus,
              role: finalRole,
              xpPoints: dbUser.xp_points ?? 0,
              pointsBalance: dbUser.points_balance ?? 0,
              avatar_url: dbUser.avatar_url || mappedUser.avatar_url,
            };
            setUser(mappedUser);
            localStorage.setItem('pnongki_auth_user', JSON.stringify(mappedUser));
          }
        } catch {
          // Fallback
        }
      } else {
        // Jika tidak ada sesi Supabase aktif, cek apakah sebelumnya pengguna masuk akun demo
        const saved = localStorage.getItem('pnongki_auth_user');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (!parsed?.isDemo) {
              setUser(null);
              localStorage.removeItem('pnongki_auth_user');
            }
          } catch {
            setUser(null);
            localStorage.removeItem('pnongki_auth_user');
          }
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });

    // 2. Listener perubahan sesi (LOGIN, LOGOUT, TOKEN_REFRESHED)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!isMounted) return;
      setSession(newSession);
      if (newSession?.user) {
        let mappedUser = mapSupabaseUser(newSession.user);
        setUser(mappedUser);
        localStorage.setItem('pnongki_auth_user', JSON.stringify(mappedUser));

        // Sinkronkan data profil & poin terbaru dari tabel public.users
        try {
          const { data: dbUser } = await supabase
            .from('users')
            .select('*')
            .eq('id', newSession.user.id)
            .maybeSingle();

          if (dbUser && isMounted) {
            const finalRole = resolveUserRole(
              newSession.user.email,
              newSession.user.user_metadata?.role,
              dbUser.role
            );
            mappedUser = {
              ...mappedUser,
              name: dbUser.full_name || dbUser.name || mappedUser.name,
              full_name: dbUser.full_name || mappedUser.full_name,
              phone: dbUser.phone_number || mappedUser.phone,
              campus: dbUser.campus || mappedUser.campus,
              role: finalRole,
              xpPoints: dbUser.xp_points ?? 0,
              pointsBalance: dbUser.points_balance ?? 0,
              avatar_url: dbUser.avatar_url || mappedUser.avatar_url,
            };
            setUser(mappedUser);
            localStorage.setItem('pnongki_auth_user', JSON.stringify(mappedUser));
          }
        } catch {
          // Fallback
        }
      } else if (event === 'SIGNED_OUT' || !newSession) {
        const saved = localStorage.getItem('pnongki_auth_user');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (!parsed?.isDemo) {
              setUser(null);
              localStorage.removeItem('pnongki_auth_user');
            }
          } catch {
            setUser(null);
            localStorage.removeItem('pnongki_auth_user');
          }
        }
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // 1. Login dengan Email & Password
  const login = async (email, password) => {
    if (isSupabaseConfigured) {
      const cleanEmail = email.trim();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });
      if (error) throw error;
      if (data?.user) {
        let mappedUser = mapSupabaseUser(data.user);
        try {
          const { data: dbUser } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .maybeSingle();

          if (dbUser) {
            const finalRole = resolveUserRole(
              data.user.email,
              data.user.user_metadata?.role,
              dbUser.role
            );
            mappedUser = {
              ...mappedUser,
              name: dbUser.full_name || dbUser.name || mappedUser.name,
              full_name: dbUser.full_name || mappedUser.full_name,
              phone: dbUser.phone_number || mappedUser.phone,
              campus: dbUser.campus || mappedUser.campus,
              role: finalRole,
              xpPoints: dbUser.xp_points ?? 0,
              pointsBalance: dbUser.points_balance ?? 0,
              avatar_url: dbUser.avatar_url || mappedUser.avatar_url,
            };
          }
        } catch {}

        setUser(mappedUser);
        setSession(data.session);
        localStorage.setItem('pnongki_auth_user', JSON.stringify(mappedUser));
        return { user: mappedUser, session: data.session, raw: data };
      }
      return data;
    } else {
      // Fallback Demo Login jika Supabase API Key belum dikonfigurasi di .env
      const cleanEmail = (email || '').trim().toLowerCase();
      const isSuperAdmin = cleanEmail === 'superadmin@admin.pnongki';
      const isAdminEmail = isSuperAdmin || cleanEmail.includes('@admin.pnongki') || cleanEmail.endsWith('@admin.pnongki');
      const resolvedRole = isSuperAdmin ? 'super_admin' : isAdminEmail ? 'admin' : DEMO_USER.role;
      const demoUser = {
        ...DEMO_USER,
        id: isSuperAdmin ? 'superadmin-demo-id' : isAdminEmail ? 'admin-demo-id' : DEMO_USER.id,
        email: cleanEmail || DEMO_USER.email,
        full_name: isSuperAdmin ? 'Super Admin pNongki' : isAdminEmail ? 'Admin pNongki' : (cleanEmail ? cleanEmail.split('@')[0] : DEMO_USER.full_name),
        name: isSuperAdmin ? 'Super Admin pNongki' : isAdminEmail ? 'Admin pNongki' : (cleanEmail ? cleanEmail.split('@')[0] : DEMO_USER.name),
        campus: isSuperAdmin ? 'Direksi & Operasional pNongki' : isAdminEmail ? 'Tim Operasional pNongki' : DEMO_USER.campus,
        role: resolvedRole,
      };
      setUser(demoUser);
      localStorage.setItem('pnongki_auth_user', JSON.stringify(demoUser));
      return { user: demoUser };
    }
  };

  // 2. Register dengan Email & Password
  const register = async ({ email, password, fullName, campus = '', phone = '' }) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail) || cleanEmail.includes('@admin.pnongki')) {
      throw new Error('Gunakan alamat email yang valid (contoh: nama@gmail.com).');
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: fullName.trim() || 'User',
            campus: (campus || '').trim() || 'User pNongki',
            phone: (phone || '').trim() || '',
            role: 'user', // Default: 'user'
            xp_points: 0,
            points_balance: 0,
          },
        },
      });
      if (error) throw error;
      if (data?.session && data?.user) {
        const mappedUser = mapSupabaseUser(data.user);
        setUser(mappedUser);
        setSession(data.session);
        localStorage.setItem('pnongki_auth_user', JSON.stringify(mappedUser));
      }
      return data;
    } else {
      // Fallback Demo Register
      const newUser = {
        id: `demo-${Date.now()}`,
        email: cleanEmail,
        full_name: fullName || 'User Baru',
        name: fullName || 'User Baru',
        campus: campus || 'User pNongki',
        phone: phone || '',
        role: 'user',
        xpPoints: 0,
        pointsBalance: 0,
        avatar_url: null,
        isDemo: true,
      };
      setUser(newUser);
      localStorage.setItem('pnongki_auth_user', JSON.stringify(newUser));
      return { user: newUser };
    }
  };

  // 3. Login / Register dengan Google OAuth (AUTH-1)
  const loginWithGoogle = async () => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      return data;
    } else {
      // Simulasi Google OAuth jika belum ada key
      const googleUser = {
        id: 'google-demo-user',
        email: 'google.user@mahasiswa.ac.id',
        full_name: 'Mahasiswa Google Demo',
        name: 'Mahasiswa Google Demo',
        campus: 'Universitas Indonesia',
        phone: '0812-3456-7890',
        role: 'mahasiswa',
        xpPoints: 50,
        pointsBalance: 100,
        avatar_url: null,
        isDemo: true,
      };
      setUser(googleUser);
      localStorage.setItem('pnongki_auth_user', JSON.stringify(googleUser));
      return { user: googleUser };
    }
  };

  // 4. Lupa Kata Sandi (Reset Password)
  const resetPassword = async (email) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}?mode=reset-password`,
      });
      if (error) throw error;
      return data;
    } else {
      return { message: 'Tautan reset kata sandi demo telah disimulasikan.' };
    }
  };

  // 5. Kirim Ulang Email Verifikasi
  const resendVerification = async (email) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
      });
      if (error) throw error;
      return data;
    }
  };

  // 6. Logout
  const logout = async () => {
    if (isSupabaseConfigured && session) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('pnongki_auth_user');
    setUser(null);
    setSession(null);
  };

  // 7. Fast switch ke akun demo Anak Ulama
  const setDemoAccount = () => {
    setUser(DEMO_USER);
    localStorage.setItem('pnongki_auth_user', JSON.stringify(DEMO_USER));
  };

  // 8. Update data profil lokal pengguna
  const updateUserData = (partialData) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...partialData };
      localStorage.setItem('pnongki_auth_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isConfigured: isSupabaseConfigured,
        login,
        register,
        loginWithGoogle,
        resetPassword,
        resendVerification,
        logout,
        setDemoAccount,
        updateUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
