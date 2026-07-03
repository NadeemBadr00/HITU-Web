'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Settings {
  university: {
    name_ar: string;
    name_en: string;
    address: string;
    phone: string;
    email: string;
    website: string;
  };
  academic: {
    current_year: string;
    current_semester: string;
    semester_start: string;
    semester_end: string;
    registration_open: boolean;
  };
  social: {
    facebook: string;
    twitter: string;
    instagram: string;
    youtube: string;
    linkedin: string;
  };
}

const defaultSettings: Settings = {
  university: {
    name_ar: 'جامعة حلوان التكنولوجية الدولية',
    name_en: 'Helwan International Technology University',
    address: 'المعادي، القاهرة، مصر',
    phone: '+20 2 25240000',
    email: 'info@hitu.edu.eg',
    website: 'https://hitu.edu.eg',
  },
  academic: {
    current_year: '2024/2025',
    current_semester: 'الفصل الثاني',
    semester_start: '2025-02-01',
    semester_end: '2025-06-15',
    registration_open: true,
  },
  social: {
    facebook: 'https://facebook.com/hitu',
    twitter: 'https://x.com/hitu',
    instagram: 'https://instagram.com/hitu',
    youtube: 'https://youtube.com/hitu',
    linkedin: 'https://linkedin.com/company/hitu',
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [toast, setToast] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('hitu-admin-settings');
    if (stored) {
      setSettings(JSON.parse(stored));
    }
    setMounted(true);
  }, []);

  const handleSave = () => {
    localStorage.setItem('hitu-admin-settings', JSON.stringify(settings));
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  const updateUniversity = (key: keyof Settings['university'], value: string) => {
    setSettings({ ...settings, university: { ...settings.university, [key]: value } });
  };

  const updateAcademic = (key: keyof Settings['academic'], value: string | boolean) => {
    setSettings({ ...settings, academic: { ...settings.academic, [key]: value } });
  };

  const updateSocial = (key: keyof Settings['social'], value: string) => {
    setSettings({ ...settings, social: { ...settings.social, [key]: value } });
  };

  if (!mounted) return null;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-white">الإعدادات</h1>
        <p className="text-slate-400 mt-1">إعدادات النظام والجامعة</p>
      </motion.div>

      {/* Section 1: University Info */}
      <motion.div variants={itemVariants} className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-lg shadow-lg shadow-blue-500/25">🏛️</span>
          معلومات الجامعة
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-300 mb-2">اسم الجامعة</label>
            <input type="text" value={settings.university.name_ar} onChange={(e) => updateUniversity('name_ar', e.target.value)} className="w-full bg-slate-800/50 border border-white/10 rounded-xl text-white px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition" />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-2">الاسم بالإنجليزية</label>
            <input type="text" value={settings.university.name_en} onChange={(e) => updateUniversity('name_en', e.target.value)} className="w-full bg-slate-800/50 border border-white/10 rounded-xl text-white px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition" dir="ltr" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-slate-300 mb-2">العنوان</label>
            <input type="text" value={settings.university.address} onChange={(e) => updateUniversity('address', e.target.value)} className="w-full bg-slate-800/50 border border-white/10 rounded-xl text-white px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition" />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-2">رقم الهاتف</label>
            <input type="text" value={settings.university.phone} onChange={(e) => updateUniversity('phone', e.target.value)} className="w-full bg-slate-800/50 border border-white/10 rounded-xl text-white px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition" dir="ltr" />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-2">البريد الإلكتروني</label>
            <input type="email" value={settings.university.email} onChange={(e) => updateUniversity('email', e.target.value)} className="w-full bg-slate-800/50 border border-white/10 rounded-xl text-white px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition" dir="ltr" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-slate-300 mb-2">الموقع الإلكتروني</label>
            <input type="url" value={settings.university.website} onChange={(e) => updateUniversity('website', e.target.value)} className="w-full bg-slate-800/50 border border-white/10 rounded-xl text-white px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition" dir="ltr" />
          </div>
        </div>
      </motion.div>

      {/* Section 2: Academic Year */}
      <motion.div variants={itemVariants} className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-lg shadow-lg shadow-purple-500/25">📅</span>
          إعدادات العام الدراسي
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-300 mb-2">العام الدراسي الحالي</label>
            <input type="text" value={settings.academic.current_year} onChange={(e) => updateAcademic('current_year', e.target.value)} className="w-full bg-slate-800/50 border border-white/10 rounded-xl text-white px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition" dir="ltr" />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-2">الفصل الدراسي</label>
            <select value={settings.academic.current_semester} onChange={(e) => updateAcademic('current_semester', e.target.value)} className="w-full bg-slate-800/50 border border-white/10 rounded-xl text-white px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition">
              <option value="الفصل الأول">الفصل الأول</option>
              <option value="الفصل الثاني">الفصل الثاني</option>
              <option value="الفصل الصيفي">الفصل الصيفي</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-2">تاريخ بداية الفصل</label>
            <input type="date" value={settings.academic.semester_start} onChange={(e) => updateAcademic('semester_start', e.target.value)} className="w-full bg-slate-800/50 border border-white/10 rounded-xl text-white px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition" />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-2">تاريخ نهاية الفصل</label>
            <input type="date" value={settings.academic.semester_end} onChange={(e) => updateAcademic('semester_end', e.target.value)} className="w-full bg-slate-800/50 border border-white/10 rounded-xl text-white px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition" />
          </div>
          <div className="md:col-span-2">
            <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl border border-white/5">
              <div>
                <p className="text-white font-medium">حالة التسجيل</p>
                <p className="text-slate-400 text-sm mt-0.5">
                  {settings.academic.registration_open ? 'التسجيل مفتوح حالياً' : 'التسجيل مغلق حالياً'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => updateAcademic('registration_open', !settings.academic.registration_open)}
                className={`relative w-14 h-8 rounded-full transition-colors ${settings.academic.registration_open ? 'bg-emerald-500' : 'bg-slate-600'}`}
              >
                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all ${settings.academic.registration_open ? 'left-1' : 'left-[26px]'}`} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Section 3: Social Media */}
      <motion.div variants={itemVariants} className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center text-lg shadow-lg shadow-pink-500/25">🔗</span>
          روابط التواصل الاجتماعي
        </h2>
        <div className="space-y-4">
          {[
            { key: 'facebook' as const, label: 'فيسبوك', icon: '📘', color: 'border-blue-500/20 focus:border-blue-500' },
            { key: 'twitter' as const, label: 'تويتر / X', icon: '🐦', color: 'border-sky-500/20 focus:border-sky-500' },
            { key: 'instagram' as const, label: 'إنستجرام', icon: '📷', color: 'border-pink-500/20 focus:border-pink-500' },
            { key: 'youtube' as const, label: 'يوتيوب', icon: '🎬', color: 'border-red-500/20 focus:border-red-500' },
            { key: 'linkedin' as const, label: 'لينكد إن', icon: '💼', color: 'border-blue-600/20 focus:border-blue-600' },
          ].map((social) => (
            <div key={social.key} className="flex items-center gap-3">
              <span className="text-2xl w-10 text-center">{social.icon}</span>
              <div className="flex-1">
                <label className="block text-xs text-slate-400 mb-1">{social.label}</label>
                <input
                  type="url"
                  value={settings.social[social.key]}
                  onChange={(e) => updateSocial(social.key, e.target.value)}
                  className={`w-full bg-slate-800/50 border rounded-xl text-white px-4 py-2.5 text-sm focus:ring-1 outline-none transition ${social.color}`}
                  dir="ltr"
                  placeholder={`https://${social.key}.com/...`}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div variants={itemVariants} className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className="px-10 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-2xl font-bold text-base hover:shadow-xl hover:shadow-primary-500/25 transition-all flex items-center gap-3"
        >
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
          </svg>
          حفظ الإعدادات
        </motion.button>
      </motion.div>

      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-4 bg-emerald-500/90 backdrop-blur-xl text-white rounded-2xl shadow-xl shadow-emerald-500/25 font-medium flex items-center gap-3"
        >
          <span className="text-xl">✅</span>
          تم حفظ الإعدادات بنجاح
        </motion.div>
      )}
    </motion.div>
  );
}
