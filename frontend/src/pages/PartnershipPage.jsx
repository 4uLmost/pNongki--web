import React, { useState, useMemo, useRef } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/useAuth';
import { PARTNERSHIP_STEPS } from '../components/partnership/partnershipData';
import PartnershipHeader from '../components/partnership/PartnershipHeader';
import PartnershipStep1 from '../components/partnership/PartnershipStep1';
import PartnershipStep2 from '../components/partnership/PartnershipStep2';
import PartnershipStep3 from '../components/partnership/PartnershipStep3';
import PartnershipSuccessView from '../components/partnership/PartnershipSuccessView';

export default function PartnershipPage({
  places = [],
  onNavigate,
  isLoading = false,
  loadError = null,
  onRetry,
}) {
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const [selectedPlaceId, setSelectedPlaceId] = useState('');
  const [placeSearchQuery, setPlaceSearchQuery] = useState('');
  const searchInputRef = useRef(null);

  const [picName, setPicName] = useState(user?.user_metadata?.full_name || '');
  const [picRole, setPicRole] = useState('Owner / Pemilik');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [instagram, setInstagram] = useState('');

  const [selectedPerks, setSelectedPerks] = useState(['reservasi', 'verified_badge']);
  const [legalDocNumber, setLegalDocNumber] = useState('');
  const [proofFileUrl, setProofFileUrl] = useState('');
  const [partnershipNotes, setPartnershipNotes] = useState('');
  const [agreementChecked, setAgreementChecked] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);

  const selectedPlace = useMemo(() => {
    if (!selectedPlaceId) return null;
    return places.find((p) => String(p.id) === String(selectedPlaceId)) || null;
  }, [places, selectedPlaceId]);

  const filteredPlaces = useMemo(() => {
    if (!placeSearchQuery.trim()) return places.slice(0, 8);
    const q = placeSearchQuery.toLowerCase().trim();
    return places
      .filter((p) => {
        const nameMatch = (p.name || '').toLowerCase().includes(q);
        const addrMatch = (p.address || p.location || '').toLowerCase().includes(q);
        return nameMatch || addrMatch;
      })
      .slice(0, 10);
  }, [places, placeSearchQuery]);

  const togglePerk = (perkId) => {
    setSelectedPerks((prev) =>
      prev.includes(perkId) ? prev.filter((id) => id !== perkId) : [...prev, perkId]
    );
    if (fieldErrors.perks) {
      setFieldErrors((prev) => ({ ...prev, perks: null }));
    }
  };

  const validateCurrentStep = (stepNumber) => {
    const errs = {};
    if (stepNumber === 1) {
      if (!selectedPlaceId) {
        errs.selectedPlace = 'Pilih tempat usaha Anda dari katalog terlebih dahulu';
      }
    } else if (stepNumber === 2) {
      if (!picName.trim()) {
        errs.picName = 'Nama lengkap penanggung jawab wajib diisi';
      }
      if (!contactPhone.trim() || contactPhone.trim().length < 8) {
        errs.contactPhone = 'Nomor WhatsApp aktif wajib diisi (minimal 8 digit)';
      }
      if (!email.trim() || !email.includes('@')) {
        errs.email = 'Alamat email bisnis yang valid wajib diisi';
      }
    } else if (stepNumber === 3) {
      if (selectedPerks.length === 0) {
        errs.perks = 'Pilih minimal satu layanan kemitraan yang diajukan';
      }
      if (!agreementChecked) {
        errs.agreement = 'Anda wajib menyetujui pernyataan keabsahan data kemitraan';
      }
    }
    return errs;
  };

  const handleNextStep = () => {
    const errs = validateCurrentStep(currentStep);
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }
    setFieldErrors({});
    setCurrentStep((prev) => Math.min(totalSteps, prev + 1));
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    setFieldErrors({});
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validateCurrentStep(3);
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const generatedTicket = `PTR-${Math.floor(100000 + Math.random() * 900000)}`;

      await api.applyPartnershipForExistingPlace(selectedPlaceId, {
        ticketCode: generatedTicket,
        placeName: selectedPlace?.name || 'Bisnis Anda',
        placeCover: selectedPlace?.imageUrl || selectedPlace?.image_url,
        placeAddress: selectedPlace?.address || selectedPlace?.city,
        picName: picName.trim(),
        picRole,
        contactPhone: contactPhone.trim(),
        email: email.trim(),
        instagram: instagram.trim(),
        partnershipType: selectedPerks.join(', '),
        legalDoc: legalDocNumber.trim(),
        notes: partnershipNotes.trim(),
        userId: user?.id,
      });

      setSubmissionResult({
        ticketCode: generatedTicket,
        placeName: selectedPlace?.name || 'Bisnis Anda',
        submittedAt: new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
      });

      window.scrollTo({ top: 80, behavior: 'smooth' });
    } catch (err) {
      console.warn('Gagal memproses pengajuan kemitraan:', err);
      setSubmitError(err?.message || 'Terjadi gangguan koneksi saat mengirim formulir kemitraan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-[#F8F8F6] min-h-screen text-[#242424] antialiased">
      <PartnershipHeader
        onNavigate={onNavigate}
        submissionResult={submissionResult}
        currentStep={currentStep}
        totalSteps={totalSteps}
      />

      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 flex-1 flex flex-col gap-6">
        {!submissionResult && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {PARTNERSHIP_STEPS.map((s) => {
              const isActive = currentStep === s.step;
              const isCompleted = currentStep > s.step;
              return (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => {
                    if (s.step < currentStep) {
                      setCurrentStep(s.step);
                    } else if (s.step > currentStep) {
                      handleNextStep();
                    }
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                    isActive
                      ? 'bg-white border-[#242424] ring-2 ring-[#d4e684] text-[#242424] shadow-sm'
                      : isCompleted
                      ? 'bg-[#d4e684]/20 border-[#d4e684] text-[#242424] hover:bg-[#d4e684]/30'
                      : 'bg-white/70 border-[#E8E8E4] text-[#6E6E6B]'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                      isCompleted
                        ? 'bg-[#d4e684] text-[#181e00]'
                        : isActive
                        ? 'bg-[#242424] text-white shadow-xs'
                        : 'bg-[#F8F8F6] text-[#6E6E6B] border border-[#E8E8E4]'
                    }`}
                  >
                    {isCompleted ? (
                      <span className="material-symbols-outlined text-[18px]">check</span>
                    ) : (
                      <span>{s.step}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold block truncate text-[#242424]">{s.title}</span>
                    <span className="text-[11px] text-[#6E6E6B] block truncate">{s.subtitle}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {submitError && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-300 text-red-800 flex items-center gap-3 text-xs font-medium">
            <span className="material-symbols-outlined text-[20px] text-red-600">error</span>
            <span>{submitError}</span>
          </div>
        )}

        {!submissionResult ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {currentStep === 1 && (
              <PartnershipStep1
                selectedPlace={selectedPlace}
                selectedPlaceId={selectedPlaceId}
                setSelectedPlaceId={setSelectedPlaceId}
                placeSearchQuery={placeSearchQuery}
                setPlaceSearchQuery={setPlaceSearchQuery}
                searchInputRef={searchInputRef}
                fieldErrors={fieldErrors}
                setFieldErrors={setFieldErrors}
                isLoading={isLoading}
                loadError={loadError}
                onRetry={onRetry}
                filteredPlaces={filteredPlaces}
                onNavigate={onNavigate}
                handleNextStep={handleNextStep}
              />
            )}

            {currentStep === 2 && (
              <PartnershipStep2
                picName={picName}
                setPicName={setPicName}
                picRole={picRole}
                setPicRole={setPicRole}
                contactPhone={contactPhone}
                setContactPhone={setContactPhone}
                email={email}
                setEmail={setEmail}
                instagram={instagram}
                setInstagram={setInstagram}
                fieldErrors={fieldErrors}
                setFieldErrors={setFieldErrors}
                handlePrevStep={handlePrevStep}
                handleNextStep={handleNextStep}
              />
            )}

            {currentStep === 3 && (
              <PartnershipStep3
                selectedPerks={selectedPerks}
                togglePerk={togglePerk}
                legalDocNumber={legalDocNumber}
                setLegalDocNumber={setLegalDocNumber}
                proofFileUrl={proofFileUrl}
                setProofFileUrl={setProofFileUrl}
                partnershipNotes={partnershipNotes}
                setPartnershipNotes={setPartnershipNotes}
                agreementChecked={agreementChecked}
                setAgreementChecked={setAgreementChecked}
                fieldErrors={fieldErrors}
                setFieldErrors={setFieldErrors}
                isSubmitting={isSubmitting}
                handlePrevStep={handlePrevStep}
              />
            )}
          </form>
        ) : (
          <PartnershipSuccessView
            submissionResult={submissionResult}
            onNavigate={onNavigate}
          />
        )}
      </main>
    </div>
  );
}
