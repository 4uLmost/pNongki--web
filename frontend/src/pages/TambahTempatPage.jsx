import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/useAuth';
import { api } from '../lib/api';
import {
  DEFAULT_CITIES,
  BANDUNG_DISTRICTS_MASTER,
  getDistrictsByCity,
  CATEGORY_OPTIONS,
  FACILITY_OPTIONS,
  STEP_TITLES,
} from '../components/tambah-tempat/tambahTempatData';
import TambahTempatStep1 from '../components/tambah-tempat/TambahTempatStep1';
import TambahTempatStep2 from '../components/tambah-tempat/TambahTempatStep2';
import TambahTempatStep3 from '../components/tambah-tempat/TambahTempatStep3';
import TambahTempatStep4 from '../components/tambah-tempat/TambahTempatStep4';
import TambahTempatSuccessModal from '../components/tambah-tempat/TambahTempatSuccessModal';

export default function TambahTempatPage({ onNavigate, onAddPlace, mode = 'normal' }) {
  const { user } = useAuth();
  const cleanEmail = (user?.email || '').toLowerCase();
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin' || cleanEmail.includes('@admin.pnongki');

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const nameInputRef = useRef(null);
  const categorySectionRef = useRef(null);
  const citySectionRef = useRef(null);
  const districtSectionRef = useRef(null);
  const addressInputRef = useRef(null);

  const [fieldErrors, setFieldErrors] = useState({});

  const [name, setName] = useState('');
  const [categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState('');
  const [city, setCity] = useState('');
  const [cityOptions, setCityOptions] = useState(DEFAULT_CITIES);
  const [district, setDistrict] = useState('');
  const [districtOptions, setDistrictOptions] = useState([]);
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [pinPosition, setPinPosition] = useState(null);

  const [is24Hours, setIs24Hours] = useState(false);
  const [hoursMode, setHoursMode] = useState('everyday');
  const [weekdayOpen, setWeekdayOpen] = useState('');
  const [weekdayClose, setWeekdayClose] = useState('');
  const [weekendOpen, setWeekendOpen] = useState('');
  const [weekendClose, setWeekendClose] = useState('');
  const [facilities, setFacilities] = useState([]);
  const [customFacilityInput, setCustomFacilityInput] = useState('');
  const [customFacilities, setCustomFacilities] = useState([]);

  const [photoCategory, setPhotoCategory] = useState('indoor');
  const [uploadedPhotos, setUploadedPhotos] = useState([]);

  const [menuRecommendations, setMenuRecommendations] = useState([]);
  const [uploadedMenuBookPhotos, setUploadedMenuBookPhotos] = useState([]);
  const [contactPhone, setContactPhone] = useState('');
  const [instagram, setInstagram] = useState('');
  const [requestPartnership, setRequestPartnership] = useState(() => mode === 'partnership');
  const [picName, setPicName] = useState(() => user?.name || user?.full_name || '');
  const [picRole, setPicRole] = useState('');
  const [picEmail, setPicEmail] = useState(() => user?.email || '');
  const [legalDocNumber, setLegalDocNumber] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [partnershipServices, setPartnershipServices] = useState([]);
  const [partnershipNotes, setPartnershipNotes] = useState('');
  const [agreementChecked, setAgreementChecked] = useState(false);

  useEffect(() => {
    if (mode === 'partnership') {
      setRequestPartnership(true);
    }
  }, [mode]);

  const togglePartnershipService = (serviceId) => {
    setPartnershipServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
    );
    if (fieldErrors.services) {
      setFieldErrors((prev) => ({ ...prev, services: null }));
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [submissionId, setSubmissionId] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  useEffect(() => {
    if (!city) {
      setDistrictOptions([]);
      return;
    }
    const matched = getDistrictsByCity(city);
    setDistrictOptions(matched);
  }, [city]);

  const handleToggleCategory = (catVal) => {
    setCategories((prev) => {
      if (prev.includes(catVal)) {
        return prev.filter((c) => c !== catVal);
      } else {
        return [...prev, catVal];
      }
    });
    if (fieldErrors.categories) {
      setFieldErrors((prev) => ({ ...prev, categories: null }));
    }
  };

  const toggleFacility = (facilityId) => {
    setFacilities((prev) =>
      prev.includes(facilityId) ? prev.filter((id) => id !== facilityId) : [...prev, facilityId]
    );
    if (fieldErrors.facilities) {
      setFieldErrors((prev) => ({ ...prev, facilities: null }));
    }
  };

  const handleAddCustomFacility = () => {
    const trimmed = customFacilityInput.trim();
    if (trimmed && !customFacilities.includes(trimmed)) {
      setCustomFacilities([...customFacilities, trimmed]);
      setCustomFacilityInput('');
      showToast(`Fasilitas "${trimmed}" ditambahkan.`);
    }
  };

  const applyHourPreset = (open, close) => {
    setIs24Hours(false);
    setWeekdayOpen(open);
    setWeekdayClose(close);
    setWeekendOpen(open);
    setWeekendClose(close);
    showToast(`Jam diatur ke ${open} - ${close}`);
  };

  const handleTriggerGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(5);
          const lng = pos.coords.longitude.toFixed(5);
          setLatitude(lat);
          setLongitude(lng);
          setPinPosition({ x: 50, y: 50 });
          showToast(`GPS terdeteksi: ${lat}, ${lng}`);
        },
        () => {
          setLatitude('-6.89182');
          setLongitude('107.61194');
          setPinPosition({ x: 50, y: 50 });
          showToast('Titik default Dago Bandung dipilih (±3m).');
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setLatitude('-6.89182');
      setLongitude('107.61194');
      setPinPosition({ x: 50, y: 50 });
      showToast('Titik default Dago Bandung dipilih.');
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showToast('Ukuran gambar maksimal 10 MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const rawDataUrl = event.target.result;
        const img = new Image();
        img.onload = () => {
          const maxDim = 1280;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);

          const newPhoto = {
            id: Date.now(),
            name: file.name,
            size: `${(compressedDataUrl.length / (1024 * 1.37)).toFixed(0)} KB`,
            desc: photoCategory === 'indoor' ? 'Area Indoor' : photoCategory === 'outdoor' ? 'Area Outdoor' : 'Fasilitas',
            category: photoCategory,
            badge: photoCategory === 'indoor' ? 'Area Indoor' : photoCategory === 'outdoor' ? 'Area Outdoor' : 'Fasilitas',
            isCover: uploadedPhotos.length === 0,
            image: compressedDataUrl,
          };
          setUploadedPhotos((prev) => [...prev, newPhoto]);
          if (fieldErrors.photos) {
            setFieldErrors((prev) => ({ ...prev, photos: null }));
          }
          showToast('Foto berhasil ditambahkan & dioptimalkan!');
        };
        img.onerror = () => {
          const fallbackPhoto = {
            id: Date.now(),
            name: file.name,
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            desc: photoCategory === 'indoor' ? 'Area Indoor' : photoCategory === 'outdoor' ? 'Area Outdoor' : 'Fasilitas',
            category: photoCategory,
            badge: photoCategory === 'indoor' ? 'Area Indoor' : photoCategory === 'outdoor' ? 'Area Outdoor' : 'Fasilitas',
            isCover: uploadedPhotos.length === 0,
            image: rawDataUrl,
          };
          setUploadedPhotos((prev) => [...prev, fallbackPhoto]);
          showToast('Foto berhasil ditambahkan!');
        };
        img.src = rawDataUrl;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSetCoverPhoto = (photoId) => {
    setUploadedPhotos((prev) =>
      prev.map((p) => ({
        ...p,
        isCover: p.id === photoId,
      }))
    );
    showToast('Foto sampul utama diperbarui.');
  };

  const handleDeletePhoto = (photoId) => {
    setUploadedPhotos((prev) => {
      const filtered = prev.filter((p) => p.id !== photoId);
      if (filtered.length > 0 && !filtered.some((p) => p.isCover)) {
        filtered[0].isCover = true;
      }
      return filtered;
    });
    showToast('Foto berhasil dihapus.');
  };

  const handleAddMenuRecommendation = () => {
    setMenuRecommendations((prev) => [
      ...prev,
      { id: Date.now(), name: '', price: '', priceRaw: '', category: 'kopi', image: '' },
    ]);
  };

  const handleRemoveMenuRecommendation = (id) => {
    setMenuRecommendations((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateMenuRecommendation = (id, field, value, rawValue) => {
    setMenuRecommendations((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (field === 'price' && rawValue !== undefined) {
          updated.priceRaw = rawValue;
        }
        return updated;
      })
    );
  };

  const handleMenuPhotoUpload = (itemId, e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showToast('Ukuran gambar menu maksimal 10 MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const rawDataUrl = event.target.result;
        const img = new Image();
        img.onload = () => {
          const maxDim = 800;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.8);
          handleUpdateMenuRecommendation(itemId, 'image', compressed);
          showToast('Foto menu berhasil ditambahkan!');
        };
        img.onerror = () => {
          handleUpdateMenuRecommendation(itemId, 'image', rawDataUrl);
          showToast('Foto menu berhasil ditambahkan!');
        };
        img.src = rawDataUrl;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveMenuPhoto = (itemId) => {
    handleUpdateMenuRecommendation(itemId, 'image', '');
  };

  const handleMenuBookPhotoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showToast('Ukuran foto buku menu maksimal 10 MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const rawDataUrl = event.target.result;
        const img = new Image();
        img.onload = () => {
          const maxDim = 1280;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.82);
          setUploadedMenuBookPhotos((prev) => [
            ...prev,
            { id: Date.now(), name: file.name, image: compressed },
          ]);
          showToast('Foto buku menu berhasil diunggah!');
        };
        img.onerror = () => {
          setUploadedMenuBookPhotos((prev) => [
            ...prev,
            { id: Date.now(), name: file.name, image: rawDataUrl },
          ]);
          showToast('Foto buku menu berhasil diunggah!');
        };
        img.src = rawDataUrl;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteMenuBookPhoto = (photoId) => {
    setUploadedMenuBookPhotos((prev) => prev.filter((p) => p.id !== photoId));
    showToast('Foto buku menu dihapus.');
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      const errors = {};
      if (!name || name.trim().length < 3) {
        errors.name = 'Wajib diisi (minimal 3 karakter)';
      }
      if (!categories || categories.length === 0) {
        errors.categories = 'Wajib diisi (pilih minimal 1 kategori)';
      }
      if (!city || city.trim() === '') {
        errors.city = 'Wajib diisi (pilih kota / wilayah)';
      }
      if (!district || district.trim() === '') {
        errors.district = 'Wajib diisi (pilih kawasan / kecamatan)';
      }
      if (!address || address.trim().length < 8) {
        errors.address = 'Wajib diisi (minimal 8 karakter alamat lengkap)';
      }

      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        if (errors.name && nameInputRef.current) {
          nameInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          nameInputRef.current.focus();
        } else if (errors.categories && categorySectionRef.current) {
          categorySectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (errors.city && citySectionRef.current) {
          citySectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (errors.district && districtSectionRef.current) {
          districtSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (errors.address && addressInputRef.current) {
          addressInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          addressInputRef.current.focus();
        }
        showToast('Ada kolom wajib yang belum diisi.');
        return;
      }
    }

    if (currentStep === 2) {
      const errors = {};
      if (!is24Hours && (!weekdayOpen || !weekdayClose)) {
        errors.hours = 'Wajib diisi: tentukan jam buka dan tutup tempat.';
      }
      if (!facilities || facilities.length === 0) {
        errors.facilities = 'Wajib diisi: pilih minimal satu fasilitas tersedia.';
      }
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        showToast('Lengkapi jam dan fasilitas terlebih dahulu.');
        return;
      }
    }

    if (currentStep === 3) {
      if (!uploadedPhotos || uploadedPhotos.length < 1) {
        setFieldErrors({ photos: 'Wajib diisi: unggah minimal 1 foto tempat.' });
        showToast('Unggah minimal 1 foto tempat untuk verifikasi.');
        return;
      }
    }

    setFieldErrors({});
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setFieldErrors({});
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmitToAdmin = async (e) => {
    e.preventDefault();
    if (!agreementChecked) {
      setFieldErrors({ agreement: 'Wajib dicentang sebelum mengirim pengajuan.' });
      showToast('Setujui pedoman komunitas terlebih dahulu.');
      return;
    }

    if (requestPartnership) {
      const partnerErrs = {};
      if (!picName || !picName.trim()) {
        partnerErrs.picName = 'Nama lengkap penanggung jawab wajib diisi.';
      }
      if (!contactPhone || contactPhone.trim().length < 8) {
        partnerErrs.contactPhone = 'Nomor WhatsApp aktif wajib diisi (minimal 8 digit).';
      }
      if (!picEmail || !picEmail.includes('@')) {
        partnerErrs.picEmail = 'Alamat email bisnis aktif wajib diisi.';
      }
      if (!partnershipServices || partnershipServices.length === 0) {
        partnerErrs.services = 'Pilih minimal satu layanan kemitraan yang diajukan.';
      }
      if (Object.keys(partnerErrs).length > 0) {
        setFieldErrors(partnerErrs);
        showToast('Lengkapi data berkas kemitraan terlebih dahulu.');
        return;
      }
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const coverPhoto = uploadedPhotos.find((p) => p.isCover) || uploadedPhotos[0];
      const primaryCat = categories[0] || 'nongkrong';
      const dbCategory = primaryCat.includes('fasilitas')
        ? 'fasilitas_publik'
        : primaryCat.replace('-', '_');

      const priceLabelMap = {
        under20: '< Rp 20.000',
        '20-40': 'Rp 20.000 - Rp 45.000',
        '40-75': 'Rp 45.000 - Rp 75.000',
        above75: '> Rp 75.000',
        free: 'Gratis Akses',
      };

      const facilityLabels = facilities.map((f) => {
        const found = FACILITY_OPTIONS.find((opt) => opt.id === f);
        return found ? found.label : f;
      });
      const allFacilities = [
        ...facilityLabels,
        ...customFacilities,
      ];

      const fullHoursStr = is24Hours
        ? 'Buka 24 Jam'
        : weekdayOpen && weekdayClose
        ? `Buka ${weekdayOpen} - ${weekdayClose}`
        : 'Sesuai info pengelola';

      const venuePhotos = uploadedPhotos.map((p) => ({
        image: p.image,
        category: p.category,
        label: p.badge || (p.category === 'indoor' ? 'Area Indoor' : p.category === 'outdoor' ? 'Area Outdoor' : 'Fasilitas & Penunjang'),
      }));

      const formattedMenus = menuRecommendations
        .filter((m) => m.name && m.name.trim() !== '')
        .map((m) => {
          const priceStr = m.price || (m.priceRaw ? `Rp ${Number(m.priceRaw).toLocaleString('id-ID')}` : '');
          return {
            id: m.id,
            name: m.name.trim(),
            price: priceStr || 'Rp 20.000',
            category: m.category || 'kopi',
            image: m.image || '',
            desc: `Menu andalan di ${name.trim()}`,
          };
        });

      const menuBookImages = uploadedMenuBookPhotos.map((p) => p.image).filter(Boolean);

      const placePayload = {
        name: name.trim(),
        category: dbCategory,
        address: address.trim(),
        city: district && city ? `${district}, ${city}` : city || district || 'Bandung',
        latitude: parseFloat(latitude) || -6.89182,
        longitude: parseFloat(longitude) || 107.61194,
        cover_image_url: coverPhoto?.image || uploadedPhotos[0]?.image || '',
        price_range: priceLabelMap[priceRange] || '',
        open_status: fullHoursStr,
        status: 'pending',
        added_by: user?.id || null,
        description: description.trim(),
        facilities: allFacilities,
        opening_hours: {
          is24Hours,
          mode: hoursMode,
          weekday: weekdayOpen && weekdayClose ? `${weekdayOpen} - ${weekdayClose}` : null,
          weekend: weekendOpen && weekendClose ? `${weekendOpen} - ${weekendClose}` : null,
        },
        recommended_menu: formattedMenus[0]?.name || '',
        menus: formattedMenus,
        menu_images: menuBookImages,
        venue_photos: venuePhotos,
        contact_phone: contactPhone.trim() || null,
        instagram: instagram.trim() || null,
        is_partner: false,
        partnership_status: requestPartnership ? 'pending' : 'none',
        pic_name: requestPartnership ? picName.trim() : null,
        pic_role: requestPartnership ? picRole : null,
        pic_email: requestPartnership ? picEmail.trim() : null,
        legal_doc: requestPartnership ? legalDocNumber.trim() : null,
        proof_url: requestPartnership ? proofUrl.trim() : null,
        partnership_services: requestPartnership ? partnershipServices.join(', ') : null,
        partnership_notes: requestPartnership ? partnershipNotes.trim() : null,
      };

      const created = await api.createPlace(placePayload);

      if (onAddPlace) {
        onAddPlace(created || placePayload);
      }

      const prefix = requestPartnership ? 'PTR' : 'ADM';
      setSubmissionId(
        created?.id
          ? `${prefix}-${String(created.id).slice(0, 6).toUpperCase()}`
          : `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`
      );
      setSuccessModalOpen(true);
    } catch (err) {
      console.error('Error pengajuan tempat ke admin:', err);
      setSubmitError(err.message || 'Gagal mengirim data tempat ke database admin.');
      showToast('Pengajuan gagal terkirim. Silakan coba kembali.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#F8F8F6] min-h-screen text-[#242424] antialiased flex flex-col selection:bg-[#d4e684] selection:text-[#181e00]">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#242424] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-in fade-in duration-150 border border-white/10 text-xs font-semibold">
          <span className="material-symbols-outlined text-[18px] text-[#d4e684]">info</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-[1120px] w-full mx-auto px-4 md:px-8 py-6 md:py-10 flex flex-col gap-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#6E6E6B]">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('beranda')}
            className="hover:text-[#242424] transition-colors cursor-pointer"
          >
            Beranda
          </button>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          {requestPartnership ? (
            <>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('partnership-modal')}
                className="hover:text-[#242424] transition-colors cursor-pointer"
              >
                Kemitraan
              </button>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-[#242424] font-semibold">Tambah Tempat &amp; Kemitraan</span>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('explore')}
                className="hover:text-[#242424] transition-colors cursor-pointer"
              >
                Katalog
              </button>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-[#242424] font-semibold">Tambah Tempat</span>
            </>
          )}
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#E8E8E4]">
          <div>
            {requestPartnership && (
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#181e00] bg-[#d4e684] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">verified</span>
                  Pendaftaran &amp; Kemitraan Resmi
                </span>
              </div>
            )}
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#242424] tracking-tight">
              {requestPartnership ? 'Tambah Tempat & Pengajuan Kemitraan' : 'Tambah Rekomendasi Tempat'}
            </h1>
            <p className="text-xs md:text-sm text-[#6E6E6B] mt-1">
              {requestPartnership
                ? 'Daftarkan profil tempat usaha baru Anda sekaligus lengkapi dokumen penanggung jawab untuk menjadi Mitra Resmi pNongki!.'
                : 'Bantu mahasiswa dan komunitas menemukan spot nugas, nongki, dan fasilitas terbaik di kotamu.'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#6E6E6B] shrink-0 bg-white px-3.5 py-2 rounded-xl border border-[#E8E8E4] shadow-xs">
            <span>Tahap:</span>
            <span className="font-bold text-[#242424]">
              {currentStep} / {totalSteps}
            </span>
            <div className="w-24 bg-[#F8F8F6] rounded-full h-2 overflow-hidden border border-[#E8E8E4]">
              <div
                className="bg-[#d4e684] h-full transition-all duration-300 rounded-full"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {STEP_TITLES.map((s) => {
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

        {submitError && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-300 text-red-800 flex items-center gap-3 text-xs font-medium">
            <span className="material-symbols-outlined text-[20px] text-red-600">error</span>
            <span>{submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmitToAdmin} className="flex flex-col gap-6">
          {currentStep === 1 && (
            <TambahTempatStep1
              name={name}
              setName={setName}
              nameInputRef={nameInputRef}
              categories={categories}
              handleToggleCategory={handleToggleCategory}
              categorySectionRef={categorySectionRef}
              city={city}
              setCity={setCity}
              cityOptions={cityOptions}
              citySectionRef={citySectionRef}
              district={district}
              setDistrict={setDistrict}
              districtOptions={districtOptions}
              districtSectionRef={districtSectionRef}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              address={address}
              setAddress={setAddress}
              addressInputRef={addressInputRef}
              description={description}
              setDescription={setDescription}
              latitude={latitude}
              setLatitude={setLatitude}
              longitude={longitude}
              setLongitude={setLongitude}
              pinPosition={pinPosition}
              setPinPosition={setPinPosition}
              handleTriggerGPS={handleTriggerGPS}
              fieldErrors={fieldErrors}
              setFieldErrors={setFieldErrors}
              showToast={showToast}
            />
          )}

          {currentStep === 2 && (
            <TambahTempatStep2
              is24Hours={is24Hours}
              setIs24Hours={setIs24Hours}
              hoursMode={hoursMode}
              setHoursMode={setHoursMode}
              weekdayOpen={weekdayOpen}
              setWeekdayOpen={setWeekdayOpen}
              weekdayClose={weekdayClose}
              setWeekdayClose={setWeekdayClose}
              weekendOpen={weekendOpen}
              setWeekendOpen={setWeekendOpen}
              weekendClose={weekendClose}
              setWeekendClose={setWeekendClose}
              applyHourPreset={applyHourPreset}
              facilities={facilities}
              toggleFacility={toggleFacility}
              customFacilityInput={customFacilityInput}
              setCustomFacilityInput={setCustomFacilityInput}
              handleAddCustomFacility={handleAddCustomFacility}
              customFacilities={customFacilities}
              setCustomFacilities={setCustomFacilities}
              fieldErrors={fieldErrors}
              showToast={showToast}
            />
          )}

          {currentStep === 3 && (
            <TambahTempatStep3
              photoCategory={photoCategory}
              setPhotoCategory={setPhotoCategory}
              uploadedPhotos={uploadedPhotos}
              handlePhotoUpload={handlePhotoUpload}
              handleSetCoverPhoto={handleSetCoverPhoto}
              handleDeletePhoto={handleDeletePhoto}
              fieldErrors={fieldErrors}
            />
          )}

          {currentStep === 4 && (
            <TambahTempatStep4
              menuRecommendations={menuRecommendations}
              handleAddMenuRecommendation={handleAddMenuRecommendation}
              handleRemoveMenuRecommendation={handleRemoveMenuRecommendation}
              handleUpdateMenuRecommendation={handleUpdateMenuRecommendation}
              handleMenuPhotoUpload={handleMenuPhotoUpload}
              handleRemoveMenuPhoto={handleRemoveMenuPhoto}
              uploadedMenuBookPhotos={uploadedMenuBookPhotos}
              handleMenuBookPhotoUpload={handleMenuBookPhotoUpload}
              handleDeleteMenuBookPhoto={handleDeleteMenuBookPhoto}
              contactPhone={contactPhone}
              setContactPhone={setContactPhone}
              instagram={instagram}
              setInstagram={setInstagram}
              requestPartnership={requestPartnership}
              setRequestPartnership={setRequestPartnership}
              onNavigate={onNavigate}
              partnershipServices={partnershipServices}
              togglePartnershipService={togglePartnershipService}
              picName={picName}
              setPicName={setPicName}
              picRole={picRole}
              setPicRole={setPicRole}
              picEmail={picEmail}
              setPicEmail={setPicEmail}
              legalDocNumber={legalDocNumber}
              setLegalDocNumber={setLegalDocNumber}
              proofUrl={proofUrl}
              setProofUrl={setProofUrl}
              partnershipNotes={partnershipNotes}
              setPartnershipNotes={setPartnershipNotes}
              agreementChecked={agreementChecked}
              setAgreementChecked={setAgreementChecked}
              fieldErrors={fieldErrors}
              setFieldErrors={setFieldErrors}
            />
          )}

          <div className="p-4 rounded-2xl bg-white border border-[#E8E8E4] flex items-center justify-between gap-3 shadow-xs">
            <div>
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#242424] bg-[#F8F8F6] hover:bg-[#E8E8E4] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  <span>Sebelumnya</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Batalkan pengisian form tambah tempat?')) {
                      if (onNavigate) onNavigate('explore');
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#6E6E6B] hover:text-[#242424] transition-colors cursor-pointer"
                >
                  Batal
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-2.5 rounded-xl bg-[#242424] text-white hover:bg-black text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-98 shadow-sm"
                >
                  <span>Lanjut Tahap {currentStep + 1}</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-7 py-3 rounded-xl bg-[#242424] text-white hover:bg-black text-xs font-bold transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm active:scale-98"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Mengirimkan ke Admin...</span>
                    </>
                  ) : (
                    <>
                      <span>Kirim ke Admin untuk Verifikasi</span>
                      <span className="material-symbols-outlined text-[16px] text-[#d4e684]">send</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      <TambahTempatSuccessModal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        requestPartnership={requestPartnership}
        name={name}
        submissionId={submissionId}
        isAdmin={isAdmin}
        onNavigate={onNavigate}
      />
    </div>
  );
}
