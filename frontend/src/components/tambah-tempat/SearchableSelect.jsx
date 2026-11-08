import React, { useState, useEffect, useRef } from 'react';

export default function SearchableSelect({
  value,
  onChange,
  options = [],
  placeholder,
  searchPlaceholder = 'Ketik untuk mencari...',
  hasError = false,
  errorMessage = '',
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const safeOptions = Array.isArray(options) ? options : [];
  const filtered = safeOptions.filter((item) => {
    const text = typeof item === 'string' ? item : item.name;
    return (text || '').toLowerCase().includes(searchTerm.toLowerCase());
  });

  const selectedLabel = typeof value === 'string' ? value : value?.name || placeholder;

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (disabled) return;
          setIsOpen(!isOpen);
          setTimeout(() => inputRef.current?.focus(), 50);
        }}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all border select-none ${
          disabled
            ? 'bg-[#F8F8F6] border-[#E8E8E4] text-[#6E6E6B]/60 cursor-not-allowed opacity-75'
            : hasError
            ? 'border-red-500 bg-red-50/60 text-red-900 ring-2 ring-red-400/20 cursor-pointer'
            : isOpen
            ? 'border-[#242424] bg-white ring-2 ring-[#d4e684]/40 text-[#242424] cursor-pointer'
            : 'border-[#E8E8E4] bg-white text-[#242424] hover:border-[#242424] cursor-pointer'
        }`}
      >
        <span className={`truncate ${!value || disabled ? 'text-[#6E6E6B] font-normal' : 'text-[#242424] font-semibold'}`}>
          {value && !disabled ? selectedLabel : placeholder}
        </span>
        <span className="material-symbols-outlined text-[18px] text-[#6E6E6B] shrink-0 ml-1">
          {disabled ? 'lock' : isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-40 bg-white rounded-xl shadow-lg border border-[#E8E8E4] p-2 flex flex-col gap-1.5 animate-in fade-in duration-150">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px] text-[#6E6E6B]">
              search
            </span>
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-[#F8F8F6] text-[#242424] text-xs rounded-lg pl-8 pr-7 py-2 border border-[#E8E8E4] focus:outline-none focus:border-[#242424]"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#6E6E6B] hover:text-[#242424]"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            )}
          </div>

          <div className="max-h-56 overflow-y-auto custom-scrollbar flex flex-col gap-0.5">
            {filtered.length > 0 ? (
              filtered.map((item, idx) => {
                const label = typeof item === 'string' ? item : item.name;
                const isSelected = label === selectedLabel;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onChange(label);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#d4e684] text-[#181e00] font-bold'
                        : 'text-[#242424] hover:bg-[#F8F8F6] font-medium'
                    }`}
                  >
                    <span className="truncate">{label}</span>
                    {isSelected && (
                      <span className="material-symbols-outlined text-[16px] text-[#181e00]">check</span>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="p-3 text-center flex flex-col gap-2">
                <span className="text-xs text-[#6E6E6B]">Tidak ada hasil untuk "{searchTerm}"</span>
                <button
                  type="button"
                  onClick={() => {
                    onChange(searchTerm.trim());
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className="px-3 py-1.5 bg-[#d4e684] text-[#181e00] text-xs font-bold rounded-lg hover:opacity-90 transition-opacity"
                >
                  Gunakan "{searchTerm.trim()}"
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {hasError && errorMessage && (
        <p className="text-xs text-red-600 font-semibold flex items-center gap-1 mt-1">
          <span className="material-symbols-outlined text-[14px]">error</span>
          {errorMessage}
        </p>
      )}
    </div>
  );
}

