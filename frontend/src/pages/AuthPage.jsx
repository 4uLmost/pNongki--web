import React, { useState } from 'react';
import { useAuth } from '../context/useAuth';
import AuthHeader from '../components/auth/AuthHeader';
import AuthBanner from '../components/auth/AuthBanner';
import AuthAlerts from '../components/auth/AuthAlerts';
import AuthLoginForm from '../components/auth/AuthLoginForm';
import AuthRegisterForm from '../components/auth/AuthRegisterForm';
import AuthForgotForm from '../components/auth/AuthForgotForm';

export default function AuthPage({ initialMode = 'login', onNavigate, requiredNotice = '' }) {
  const {
    isConfigured,
    login,
    register,
    loginWithGoogle,
    resetPassword,
    resendVerification,
    setDemoAccount,
  } = useAuth();

  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [forgotEmail, setForgotEmail] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const loginRes = await login(loginEmail, loginPassword);
      const authUser = loginRes?.user;
      const cleanEmail = (authUser?.email || loginEmail || '').trim().toLowerCase();
      const isSuperAdminLogin = authUser?.role === 'super_admin' || cleanEmail === 'superadmin@admin.pnongki';
      const isAdminLogin = isSuperAdminLogin || authUser?.role === 'admin' || cleanEmail.includes('@admin.pnongki');
      setSuccessMessage(
        isSuperAdminLogin
          ? 'Berhasil masuk sebagai Super Administrator! Mengalihkan ke Dashboard...'
          : isAdminLogin
          ? 'Berhasil masuk sebagai Administrator! Mengalihkan ke Dashboard Admin...'
          : 'Berhasil masuk! Mengalihkan ke beranda...'
      );
      const targetPage = isAdminLogin ? 'admin' : 'beranda';
      setTimeout(() => {
        if (onNavigate) {
          onNavigate(targetPage, { user: authUser });
        }
      }, 400);
    } catch (err) {
      const rawMsg = err.message || '';
      let msg = rawMsg || 'Gagal masuk. Periksa kembali email dan kata sandi Anda.';
      if (rawMsg.includes('Invalid login credentials')) {
        msg = 'Email atau kata sandi tidak cocok. Pastikan Anda sudah mendaftarkan akun dan memasukkan sandi yang tepat.';
      } else if (rawMsg.includes('Email not confirmed')) {
        msg = 'Email Anda belum dikonfirmasi! Silakan buka kotak masuk / folder spam email Anda untuk mengonfirmasi akun.';
      }
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanRegEmail = (regEmail || '').trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!cleanRegEmail || !emailRegex.test(cleanRegEmail) || cleanRegEmail.includes('@admin.pnongki')) {
      setErrorMessage('Gunakan alamat email yang valid (contoh: nama@gmail.com).');
      return;
    }

    if (regPassword !== confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok!');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('Kata sandi minimal 6 karakter.');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('Anda harus menyetujui syarat & ketentuan komunitas.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await register({
        email: regEmail,
        password: regPassword,
        fullName: fullName.trim(),
      });

      if (result?.session) {
        setSuccessMessage('Pendaftaran berhasil! Anda telah masuk. Mengalihkan ke beranda...');
        setTimeout(() => {
          if (onNavigate) onNavigate('beranda');
        }, 1000);
      } else {
        setSuccessMessage(
          'Pendaftaran berhasil! 🎉 Tautan verifikasi telah dikirimkan ke email Anda. Silakan cek inbox/spam untuk verifikasi, lalu masuk.'
        );
        setTimeout(() => {
          setMode('login');
          setLoginEmail(regEmail);
        }, 2200);
      }
    } catch (err) {
      const rawMsg = err.message || '';
      let msg = rawMsg || 'Gagal mendaftar.';
      if (rawMsg.includes('User already registered')) {
        msg = 'Email ini sudah terdaftar. Silakan beralih ke tab Masuk.';
      } else if (rawMsg.includes('email_address_invalid') || rawMsg.includes('is invalid')) {
        msg = 'Gunakan alamat email yang valid (contoh: nama@gmail.com).';
      } else if (rawMsg.includes('Password should be at least 6 characters')) {
        msg = 'Kata sandi minimal 6 karakter.';
      }
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    const targetEmail = (loginEmail || regEmail).trim();
    if (!targetEmail) {
      setErrorMessage('Silakan isi kolom email terlebih dahulu untuk mengirim ulang verifikasi.');
      return;
    }
    setIsResending(true);
    setErrorMessage('');
    try {
      await resendVerification(targetEmail);
      setSuccessMessage(`Tautan konfirmasi baru telah dikirimkan ke ${targetEmail}. Cek inbox atau folder spam.`);
    } catch (err) {
      const rawMsg = err.message || '';
      if (rawMsg.includes('security purposes') || rawMsg.includes('rate_limit')) {
        setErrorMessage('Mohon tunggu beberapa detik sebelum meminta kirim ulang email verifikasi kembali.');
      } else {
        setErrorMessage(rawMsg || 'Gagal mengirim ulang email verifikasi.');
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMessage('');
    setIsLoading(true);
    try {
      await loginWithGoogle();
      if (!isConfigured) {
        setSuccessMessage('Berhasil masuk dengan akun Google (Simulasi)!');
        setTimeout(() => {
          if (onNavigate) onNavigate('beranda');
        }, 1000);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Gagal autentikasi dengan Google.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      await resetPassword(forgotEmail);
      setSuccessMessage('Tautan instruksi pemulihan kata sandi telah dikirim ke email Anda!');
    } catch (err) {
      setErrorMessage(err.message || 'Gagal mengirim email reset kata sandi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseDemoAccount = () => {
    setDemoAccount();
    setSuccessMessage('Berhasil masuk sebagai Anak Ulama (Akun Demo)! 🚀');
    setTimeout(() => {
      if (onNavigate) onNavigate('beranda');
    }, 700);
  };

  return (
    <div className="w-full min-h-screen bg-surface flex flex-col items-center justify-center py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-[1040px] w-full flex flex-col gap-5">
        <AuthHeader onNavigate={onNavigate} />

        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          <AuthBanner onUseDemoAccount={handleUseDemoAccount} />

          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="bg-surface-card rounded-3xl p-6 sm:p-8 md:p-9 shadow-xl border border-border-hairline relative">
              <AuthAlerts
                requiredNotice={requiredNotice}
                errorMessage={errorMessage}
                successMessage={successMessage}
                handleResendVerification={handleResendVerification}
                isResending={isResending}
              />

              <div className="flex p-1 rounded-2xl bg-surface-container-low border border-border-hairline mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                    mode === 'login'
                      ? 'bg-surface-card text-on-surface shadow-xs'
                      : 'text-charcoal-subtle hover:text-on-surface'
                  }`}
                >
                  Masuk (Sign In)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                    mode === 'register'
                      ? 'bg-surface-card text-on-surface shadow-xs'
                      : 'text-charcoal-subtle hover:text-on-surface'
                  }`}
                >
                  Daftar Akun Baru
                </button>
              </div>

              {mode === 'login' && (
                <AuthLoginForm
                  loginEmail={loginEmail}
                  setLoginEmail={setLoginEmail}
                  loginPassword={loginPassword}
                  setLoginPassword={setLoginPassword}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  rememberMe={rememberMe}
                  setRememberMe={setRememberMe}
                  isLoading={isLoading}
                  handleLoginSubmit={handleLoginSubmit}
                  handleGoogleAuth={handleGoogleAuth}
                  onForgotPassword={() => setMode('forgot')}
                />
              )}

              {mode === 'register' && (
                <AuthRegisterForm
                  fullName={fullName}
                  setFullName={setFullName}
                  regEmail={regEmail}
                  setRegEmail={setRegEmail}
                  regPassword={regPassword}
                  setRegPassword={setRegPassword}
                  confirmPassword={confirmPassword}
                  setConfirmPassword={setConfirmPassword}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  showConfirmPassword={showConfirmPassword}
                  setShowConfirmPassword={setShowConfirmPassword}
                  agreeTerms={agreeTerms}
                  setAgreeTerms={setAgreeTerms}
                  isLoading={isLoading}
                  handleRegisterSubmit={handleRegisterSubmit}
                  handleGoogleAuth={handleGoogleAuth}
                />
              )}

              {mode === 'forgot' && (
                <AuthForgotForm
                  forgotEmail={forgotEmail}
                  setForgotEmail={setForgotEmail}
                  isLoading={isLoading}
                  handleForgotSubmit={handleForgotSubmit}
                  onCancel={() => {
                    setMode('login');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                />
              )}

              <div className="mt-6 pt-4 border-t border-border-hairline text-center">
                {mode === 'login' ? (
                  <p className="text-xs text-charcoal-subtle">
                    Belum punya akun?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('register');
                        setErrorMessage('');
                        setSuccessMessage('');
                      }}
                      className="font-extrabold text-primary hover:underline cursor-pointer"
                    >
                      Daftar Akun Baru
                    </button>
                  </p>
                ) : mode === 'register' ? (
                  <p className="text-xs text-charcoal-subtle">
                    Sudah memiliki akun?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('login');
                        setErrorMessage('');
                        setSuccessMessage('');
                      }}
                      className="font-extrabold text-primary hover:underline cursor-pointer"
                    >
                      Masuk di sini
                    </button>
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
