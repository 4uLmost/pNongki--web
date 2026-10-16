import React from 'react';

export default function AuthLoginForm({
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  showPassword,
  setShowPassword,
  rememberMe,
  setRememberMe,
  isLoading,
  handleLoginSubmit,
  handleGoogleAuth,
  onForgotPassword,
}) {
  return (
    <form onSubmit={handleLoginSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-on-surface mb-1.5">
          Alamat Email <span className="text-error">*</span>
        </label>
        <div className="relative">
          <span className="material-symbols-outlined text-[18px] text-charcoal-subtle absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            mail
          </span>
          <input
            type="email"
            required
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            placeholder="nama@gmail.com"
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-surface-container-low border border-border-hairline text-xs text-on-surface placeholder:text-charcoal-subtle/70 focus:outline-none focus:ring-2 focus:ring-on-surface/30 transition-all"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-bold text-on-surface">
            Kata Sandi <span className="text-error">*</span>
          </label>
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-[11px] font-bold text-primary hover:underline cursor-pointer"
          >
            Lupa kata sandi?
          </button>
        </div>
        <div className="relative">
          <span className="material-symbols-outlined text-[18px] text-charcoal-subtle absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            lock
          </span>
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            placeholder="Masukkan kata sandi akun"
            className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-surface-container-low border border-border-hairline text-xs text-on-surface placeholder:text-charcoal-subtle/70 focus:outline-none focus:ring-2 focus:ring-on-surface/30 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-subtle hover:text-on-surface cursor-pointer p-1"
            aria-label="Toggle password visibility"
          >
            <span className="material-symbols-outlined text-[16px]">
              {showPassword ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs pt-1">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
          />
          <span className="text-charcoal-subtle">Ingat saya di perangkat ini</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 rounded-2xl bg-inverse-surface text-inverse-on-surface hover:bg-black font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 mt-2"
      >
        {isLoading ? (
          <span>Memproses...</span>
        ) : (
          <>
            <span>Masuk ke Akun</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </>
        )}
      </button>

      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-border-hairline"></div>
        <span className="flex-shrink mx-3 text-[11px] uppercase tracking-wider text-charcoal-subtle font-bold">
          atau
        </span>
        <div className="flex-grow border-t border-border-hairline"></div>
      </div>

      <button
        type="button"
        onClick={handleGoogleAuth}
        disabled={isLoading}
        className="w-full py-2.5 rounded-2xl border border-border-hairline bg-surface-card hover:bg-surface-container text-on-surface font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2.5 shadow-2xs active:scale-95"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>Lanjutkan dengan Google</span>
      </button>
    </form>
  );
}

