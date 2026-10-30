import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary tertangkap:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    localStorage.removeItem('pnongki_auth_user');
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-error/10 text-error flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-[32px]">warning</span>
          </div>
          <h1 className="text-xl font-bold text-on-surface mb-2">
            Terjadi Kendala Memuat Halaman
          </h1>
          <p className="text-sm text-charcoal-subtle max-w-md mb-6 leading-relaxed">
            Aplikasi mengalami kendala saat merender komponen. Detail error telah dicatat ke konsol pengembang.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={this.handleReload}
              className="px-5 py-2.5 rounded-xl bg-inverse-surface text-inverse-on-surface text-xs font-bold hover:bg-black transition-all cursor-pointer shadow-sm active:scale-95"
            >
              Muat Ulang Halaman
            </button>
            <button
              onClick={this.handleReset}
              className="px-5 py-2.5 rounded-xl bg-surface-card border border-border-hairline text-on-surface text-xs font-bold hover:bg-surface-container transition-all cursor-pointer shadow-2xs"
            >
              Reset ke Beranda
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

