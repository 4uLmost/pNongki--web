import React from 'react';

export default function AuthForgotForm({
  forgotEmail,
  setForgotEmail,
  isLoading,
  handleForgotSubmit,
  onCancel,
}) {
  return (
    <form onSubmit={handleForgotSubmit} className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-on-surface">Pulihkan Kata Sandi</h3>
        <p className="text-xs text-charcoal-subtle mt-1 leading-relaxed">
          Masukkan email akun Anda. Kami akan mengirimkan tautan reset kata sandi
          resmi melalui Supabase Auth.
        </p>
      </div>

      <div>
        <label className="block text-xs font-bold text-on-surface mb-1.5">
          Alamat Email Terdaftar <span className="text-error">*</span>
        </label>
        <input
          type="email"
          required
          value={forgotEmail}
          onChange={(e) => setForgotEmail(e.target.value)}
          placeholder="nama@gmail.com"
          className="w-full px-4 py-2.5 rounded-2xl bg-surface-container-low border border-border-hairline text-xs text-on-surface placeholder:text-charcoal-subtle/70 focus:outline-none focus:ring-2 focus:ring-on-surface/30 transition-all"
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-2xl border border-border-hairline hover:bg-surface-container text-xs font-bold text-charcoal-subtle hover:text-on-surface transition-all cursor-pointer"
        >
          Kembali ke Login
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-2.5 rounded-2xl bg-inverse-surface text-inverse-on-surface hover:bg-black font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
        >
          {isLoading ? 'Mengirim...' : 'Kirim Tautan'}
        </button>
      </div>
    </form>
  );
}

