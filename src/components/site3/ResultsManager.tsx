import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Award, Plus, Trash2, Edit3, Check, X, Eye, EyeOff, GraduationCap, Image, Sparkles, FileText, CheckCircle2, UploadCloud, Loader2 } from 'lucide-react';
import { StudentResult } from '../../types';
import { getCrystalClearCertificateUrl } from '../site1/ResultsSection';

export const ResultsManager: React.FC = () => {
  const { db, createStudentResult, updateStudentResult, deleteStudentResult, refreshDb } = useApp();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Bulk Upload states
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isBulkUploading, setIsBulkUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0, percent: 0 });
  const [bulkSuccessMessage, setBulkSuccessMessage] = useState<string | null>(null);
  const [bulkErrorMessage, setBulkErrorMessage] = useState<string | null>(null);

  // Form states
  const [studentName, setStudentName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [certificateImageUrl, setCertificateImageUrl] = useState('');
  const [region, setRegion] = useState('Toshkent');
  const [certificateType, setCertificateType] = useState('Milliy Sertifikat A+ (Matematika)');
  const [score, setScore] = useState('98.4 ball');
  const [examDate, setExamDate] = useState('Yanvar, 2026');
  const [university, setUniversity] = useState('TATU — Dasturiy Injiniring (100% Grant)');
  const [certificateBadgeColor, setCertificateBadgeColor] = useState('from-amber-500 to-rose-600');
  const [description, setDescription] = useState('');
  const [story, setStory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper to read file as base64 string
  const readFileAsBase64 = (file: File): Promise<{ filename: string; base64: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ filename: file.name, base64: reader.result as string });
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  // Handler for multiple certificates upload (e.g. 70 images at once)
  const handleBulkFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    setIsBulkUploading(true);
    setBulkSuccessMessage(null);
    setBulkErrorMessage(null);
    setUploadProgress({ current: 0, total: files.length, percent: 0 });

    try {
      // 5 tadan to'plamlarga bo'lib navbatma-navbat yuboramiz (browser xotirasi va barqarorlik uchun)
      const BATCH_SIZE = 5;
      let uploadedCount = 0;

      for (let i = 0; i < files.length; i += BATCH_SIZE) {
        const chunk = files.slice(i, i + BATCH_SIZE);
        const base64Items = await Promise.all(chunk.map(readFileAsBase64));

        const res = await fetch('/api/owner/bulk-results', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: base64Items })
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Yuklashda server xatoligi yuz berdi');
        }

        uploadedCount += chunk.length;
        setUploadProgress({
          current: uploadedCount,
          total: files.length,
          percent: Math.round((uploadedCount / files.length) * 100)
        });
      }

      await refreshDb();
      setBulkSuccessMessage(`Muvaffaqiyatli yuklandi! (${files.length} ta sertifikat bazaga kiritildi)`);
      setTimeout(() => {
        setBulkSuccessMessage(null);
      }, 7000);
    } catch (err: any) {
      console.error('Bulk upload error:', err);
      setBulkErrorMessage(err?.message || 'Sertifikatlarni yuklashda xatolik yuz berdi');
    } finally {
      setIsBulkUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const resetForm = () => {
    setStudentName('');
    setPhotoUrl('');
    setCertificateImageUrl('');
    setRegion('Toshkent');
    setCertificateType('Milliy Sertifikat A+ (Matematika)');
    setScore('98.4 ball');
    setExamDate('Yanvar, 2026');
    setUniversity('');
    setCertificateBadgeColor('from-amber-500 to-rose-600');
    setDescription('');
    setStory('');
    setIsAdding(false);
    setEditingId(null);
  };

  const handleStartEdit = (res: StudentResult) => {
    setEditingId(res.id);
    setStudentName(res.studentName);
    setPhotoUrl(res.photoUrl || '');
    setCertificateImageUrl(res.certificateImageUrl || '');
    setRegion(res.region);
    setCertificateType(res.certificateType);
    setScore(res.score);
    setExamDate(res.examDate);
    setUniversity(res.university || '');
    setCertificateBadgeColor(res.certificateBadgeColor || 'from-amber-500 to-rose-600');
    setDescription(res.description || res.story || '');
    setStory(res.story || res.description || '');
    setIsAdding(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) return;
    setIsSubmitting(true);

    try {
      const payload: Partial<StudentResult> = {
        studentName,
        photoUrl,
        certificateImageUrl,
        region,
        certificateType,
        score,
        examDate,
        university,
        certificateBadgeColor,
        description: description || story,
        story: story || description,
        isPublished: true
      };

      if (editingId) {
        await updateStudentResult(editingId, payload);
      } else {
        await createStudentResult(payload);
      }
      resetForm();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Ushbu natijani o‘chirishni xohlaysizmi?')) {
      await deleteStudentResult(id);
    }
  };

  const handleTogglePublish = async (res: StudentResult) => {
    await updateStudentResult(res.id, { isPublished: !res.isPublished });
  };

  const badgeColorOptions = [
    { label: 'Qizil-Oltin (A+ Daraja)', value: 'from-amber-500 to-rose-600' },
    { label: 'Ko‘k-Binafsha (A Daraja)', value: 'from-blue-600 to-indigo-700' },
    { label: 'Yashil-Zumrad (100% Grant)', value: 'from-emerald-600 to-teal-700' },
    { label: 'Binafsha-Pushti (Olimpiada)', value: 'from-purple-600 to-pink-600' }
  ];

  const samplePhotoAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80'
  ];

  const sampleCertificates = [
    { label: 'A+ Milliy Sertifikat', url: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=800&auto=format&fit=crop&q=80' },
    { label: 'Turin Grant Sertifikati', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80' },
    { label: 'O‘zMU Matematika Skan', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80' },
    { label: 'Inha UzBMB Sertifikat', url: 'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=800&auto=format&fit=crop&q=80' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
              Natijalar Boshqaruvi
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-bold">
              {db.studentResults?.length || 0} ta
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Matematika Milliy Sertifikati rasmlari, o‘quvchilar ballari va tagidagi tavsiflarni kiritish va tahrirlash
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          {/* Yashirin fayl tanlash inputi (multiple - ko'p fayllarni birdaniga tanlash) */}
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleBulkFilesSelected}
          />

          {/* Barcha Sertifikatlarni Bittada Yuklash (Bulk Upload) Tugmasi */}
          <button
            type="button"
            disabled={isBulkUploading}
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 shadow-sm hover:shadow flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer active:scale-95"
            title="Kompyuteringizdan bir vaqtning o‘zida 70 ta va undan ko‘p sertifikat rasmini tanlab yuklang"
          >
            {isBulkUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Yuklanmoqda ({uploadProgress.current}/{uploadProgress.total})...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4" />
                <span>Barcha Sertifikatlarni Bittada Yuklash (Bulk Upload)</span>
              </>
            )}
          </button>

          {!isAdding && (
            <button
              onClick={() => { resetForm(); setIsAdding(true); }}
              className="px-4 py-2.5 text-xs font-semibold rounded-xl text-white bg-rose-600 hover:bg-rose-700 shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi Natija Qo‘shish</span>
            </button>
          )}
        </div>
      </div>

      {/* Bulk Upload Progress Bar Panel */}
      {isBulkUploading && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/70 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-900 dark:text-emerald-200 mb-2">
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600 dark:text-emerald-400" />
              <span>Sertifikat rasmlari serverga yuklanmoqda... ({uploadProgress.current} / {uploadProgress.total} ta)</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-200/80 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-black">
              {uploadProgress.percent}%
            </span>
          </div>
          <div className="w-full bg-emerald-200/60 dark:bg-emerald-900/50 h-3 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-300 ease-out shadow-xs"
              style={{ width: `${uploadProgress.percent}%` }}
            />
          </div>
          <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-2 font-medium">
            ⏳ Iltimos kutib turing: Tanlangan rasmlar to‘plami navbatma-navbat qayta ishlanib, serverga saqlanmoqda va o‘quvchilar ro‘yxatiga kiritilmoqda...
          </p>
        </div>
      )}

      {/* Muvaffaqiyat xabari */}
      {bulkSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-100 text-xs font-bold flex items-center justify-between gap-3 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-black text-emerald-700 dark:text-emerald-300">Muvaffaqiyatli yuklandi!</div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-normal mt-0.5">
                {bulkSuccessMessage} Natijalar ro‘yxati yangilandi.
              </div>
            </div>
          </div>
          <button
            onClick={() => setBulkSuccessMessage(null)}
            className="p-1.5 rounded-lg hover:bg-emerald-200/60 dark:hover:bg-emerald-800/60 text-emerald-800 dark:text-emerald-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Xatolik xabari */}
      {bulkErrorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-700 text-rose-900 dark:text-rose-100 text-xs font-bold flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <X className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>{bulkErrorMessage}</span>
          </div>
          <button
            onClick={() => setBulkErrorMessage(null)}
            className="p-1 rounded-lg hover:bg-rose-200/60 dark:hover:bg-rose-800/60 text-rose-800 dark:text-rose-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Add / Edit Form Card */}
      {isAdding && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-rose-600" />
              <span>{editingId ? 'Natijani Tahrirlash' : 'Yangi Matematika Sertifikati va Natijani Joylash'}</span>
            </h3>
            <button
              onClick={resetForm}
              className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                  O‘quvchi Ismi va Familiyasi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Jasurbek Oripov"
                  value={studentName}
                  onChange={e => setStudentName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-stone-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                  Viloyat / Hudud *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Farg‘ona viloyati, Qo‘qon sh."
                  value={region}
                  onChange={e => setRegion(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-stone-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                  Sertifikat Turi *
                </label>
                <select
                  value={certificateType}
                  onChange={e => setCertificateType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                >
                  <option value="Milliy Sertifikat A+ (Matematika)">Milliy Sertifikat A+ (Matematika)</option>
                  <option value="Milliy Sertifikat A (Matematika)">Milliy Sertifikat A (Matematika)</option>
                  <option value="Milliy Sertifikat B+ (Matematika)">Milliy Sertifikat B+ (Matematika)</option>
                  <option value="OTM Davlat Granti">OTM Davlat Granti</option>
                  <option value="Matematika Fan Olimpiadasi G‘olibi">Matematika Fan Olimpiadasi G‘olibi</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                  Sertifikat Bali *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: 98.4 ball (100% Grant)"
                  value={score}
                  onChange={e => setScore(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-stone-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                  Imtihon Sanasi / Sessiya
                </label>
                <input
                  type="text"
                  placeholder="Masalan: Fevral, 2026"
                  value={examDate}
                  onChange={e => setExamDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-stone-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                  O‘qishga Kirgan OTM / Grant Yo‘nalishi
                </label>
                <input
                  type="text"
                  placeholder="Masalan: TATU — Dasturiy Injiniring (100% Davlat Granti)"
                  value={university}
                  onChange={e => setUniversity(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-stone-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                  Sertifikat Belgisi Fon Rangi
                </label>
                <select
                  value={certificateBadgeColor}
                  onChange={e => setCertificateBadgeColor(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                >
                  {badgeColorOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Matematika Milliy Sertifikati Rasmi */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700 space-y-2">
              <label className="block font-bold text-stone-900 dark:text-white">
                Matematika Milliy Sertifikati Rasmi (Rasm URL yoki Skan) *
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/milliy-sertifikat-matematika.jpg"
                  value={certificateImageUrl}
                  onChange={e => setCertificateImageUrl(e.target.value)}
                  className="flex-1 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white"
                />
                {certificateImageUrl && (
                  <img
                    src={certificateImageUrl}
                    alt="Sertifikat preview"
                    className="w-12 h-12 rounded-xl object-cover border border-stone-300 dark:border-stone-600 shrink-0"
                  />
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] text-stone-500 font-medium">Namunaviy sertifikat rasmlari:</span>
                {sampleCertificates.map((cert, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCertificateImageUrl(cert.url)}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 text-[11px] hover:border-rose-500 text-stone-700 dark:text-stone-300 transition-colors"
                  >
                    {cert.label}
                  </button>
                ))}
              </div>
            </div>

            {/* O'quvchi Fotosurati */}
            <div>
              <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                O‘quvchi Fotosurati (Rasm URL manzili)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={photoUrl}
                  onChange={e => setPhotoUrl(e.target.value)}
                  className="flex-1 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-stone-900 dark:text-white"
                />
                {photoUrl && (
                  <img
                    src={photoUrl}
                    alt="Preview"
                    className="w-10 h-10 rounded-xl object-cover border border-stone-300 dark:border-stone-700 shrink-0"
                  />
                )}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[11px] text-stone-400">Namunaviy profillar:</span>
                {samplePhotoAvatars.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPhotoUrl(url)}
                    className="w-6 h-6 rounded-full overflow-hidden border border-stone-300 dark:border-stone-700 hover:scale-110 transition-transform"
                  >
                    <img src={url} alt={`avatar-${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Tagidagi Tavsif (Description) */}
            <div>
              <label className="block font-bold mb-1 text-stone-900 dark:text-white flex items-center justify-between">
                <span>Tagidagi Tavsif (O‘quvchi natijasi va muvaffaqiyati haqida to‘liq matn) *</span>
                <span className="text-[11px] font-normal text-stone-400">Sertifikat tagida ko‘rinadi</span>
              </label>
              <textarea
                rows={3}
                required
                placeholder="Masalan: Matematika fanidan Milliy Sertifikat imtihonida 98.4 ball to‘plab, A+ eng yuqori darajani qo‘lga kiritdi. Kirish imtihonida matematika blokidan 100% maksimal ball imtiyoziga ega bo‘ldi..."
                value={description}
                onChange={e => {
                  setDescription(e.target.value);
                  setStory(e.target.value);
                }}
                className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-stone-900 dark:text-white leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Saqlanmoqda...' : editingId ? 'Yangilash' : 'Natijani Joylash'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid of Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {db.studentResults?.map(res => (
          <div
            key={res.id}
            className={`p-5 rounded-2xl border transition-all ${
              res.isPublished
                ? 'bg-white dark:bg-stone-900 border-stone-200/80 dark:border-stone-800'
                : 'bg-stone-50 dark:bg-stone-900/40 border-dashed border-stone-300 dark:border-stone-700 opacity-75'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                {res.photoUrl ? (
                  <img
                    src={res.photoUrl}
                    alt={res.studentName}
                    className="w-12 h-12 rounded-xl object-cover border border-stone-200 dark:border-stone-700"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    {res.studentName.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-sm text-stone-900 dark:text-white">
                    {res.studentName}
                  </h4>
                  <div className="text-[11px] text-stone-500 flex items-center gap-1.5">
                    <span>{res.region}</span>
                    <span>·</span>
                    <span>{res.examDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleTogglePublish(res)}
                  title={res.isPublished ? "Yashirish" : "Chiqarish"}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                >
                  {res.isPublished ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleStartEdit(res)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(res.id)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Certificate Preview snippet */}
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2 p-3 rounded-xl bg-gradient-to-tr from-stone-900 to-stone-800 text-white flex flex-col justify-between">
                <div className="text-[10px] text-amber-300 font-semibold tracking-wider flex items-center justify-between">
                  <span>UZBMB MATEMATIKA</span>
                  <Award className="w-3.5 h-3.5" />
                </div>
                <div className="my-1">
                  <div className="text-base font-black text-white">{res.score}</div>
                  <div className="text-[10px] text-stone-300">{res.certificateType}</div>
                </div>
                <div className="text-[10px] text-stone-400">
                  {res.examDate || '2026'}
                </div>
              </div>

              <div className="rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 flex items-center justify-center min-h-[75px]">
                {res.certificateImageUrl ? (
                  <img
                    src={getCrystalClearCertificateUrl(res.certificateImageUrl) || `/uploads/certificates/cert_${res.id}.jpg`}
                    alt="Sertifikat"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = `/uploads/certificates/cert_${res.id}.jpg`;
                    }}
                    className="w-full h-full object-contain p-1"
                    style={{ imageRendering: 'high-quality' as any }}
                  />
                ) : (
                  <div className="p-2 text-center text-[10px] text-stone-400">
                    Sertifikat Rasmi
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
