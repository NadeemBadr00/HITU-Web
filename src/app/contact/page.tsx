'use client';

import { useState } from 'react';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle, Building2, Clock } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-[#050505]">

      {/* ===== Hero Section ===== */}
      <section className="relative overflow-hidden bg-[#050505] py-32 pt-40">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-gradient-to-br from-[#14b8a6]/15 to-[#3b82f6]/15 blur-3xl animate-float" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-br from-[#3b82f6]/10 to-[#14b8a6]/10 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <div className="animate-fade-in mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-5 py-2 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#14b8a6] to-[#3b82f6] animate-pulse" />
            <span className="text-sm font-medium text-gray-300">Contact Us</span>
          </div>
          <h1 className="animate-slide-up text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 leading-tight">📞 تواصل <span className="text-gradient-brand bg-gradient-to-r from-[#14b8a6] to-[#3b82f6] bg-clip-text text-transparent">معنا</span></h1>
          <p className="animate-slide-up text-lg sm:text-xl text-gray-300/90 max-w-2xl mx-auto leading-relaxed" style={{ animationDelay: '150ms' }}>نحن هنا لمساعدتك. تواصل معنا لأي استفسار أو اقتراح</p>
        </div>
      </section>

      {/* ===== Content ===== */}
      <section className="relative bg-[#050505] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Form */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="order-2 lg:order-1">
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-6">أرسل لنا <span className="bg-gradient-to-r from-[#14b8a6] to-[#3b82f6] bg-clip-text text-transparent">رسالة</span></h2>

              {isSubmitted ? (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-12 text-center">
                  <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-emerald-400 mb-2">تم الإرسال بنجاح!</h3>
                  <p className="text-emerald-300">سنتواصل معك في أقرب وقت ممكن</p>
                  <button onClick={() => { setIsSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' }); }} className="mt-6 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-emerald-500 transition-colors">إرسال رسالة أخرى</button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">الاسم الكامل</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="محمد أحمد" className="w-full rounded-xl border border-white/[0.08] bg-[#111111] px-4 py-3 text-sm text-white placeholder-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6] transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">البريد الإلكتروني</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="example@email.com" className="w-full rounded-xl border border-white/[0.08] bg-[#111111] px-4 py-3 text-sm text-white placeholder-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6] transition-all" dir="ltr" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">الموضوع</label>
                    <select name="subject" value={formData.subject} onChange={handleChange} required className="w-full rounded-xl border border-white/[0.08] bg-[#111111] px-4 py-3 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6] transition-all">
                      <option value="">اختر الموضوع</option>
                      <option value="admission">استفسار عن القبول</option>
                      <option value="academic">استفسار أكاديمي</option>
                      <option value="technical">دعم تقني</option>
                      <option value="suggestion">اقتراح</option>
                      <option value="complaint">شكوى</option>
                      <option value="other">أخرى</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">الرسالة</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} required rows={5} placeholder="اكتب رسالتك هنا..." className="w-full rounded-xl border border-white/[0.08] bg-[#111111] px-4 py-3 text-sm text-white placeholder-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6] transition-all resize-none" />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#14b8a6] to-[#0d9488] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#14b8a6]/20 hover:shadow-xl hover:shadow-[#14b8a6]/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed">
                    {isSubmitting ? (
                      <><div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> جاري الإرسال...</>
                    ) : (
                      <><Send className="h-4 w-4" /> إرسال الرسالة</>
                    )}
                  </button>
                </form>
              )}
            </motion.div>

            {/* Contact Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="order-1 lg:order-2 space-y-6">
              {/* Location Cards */}
              <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-6 hover:-translate-y-1 hover:border-[#14b8a6]/30 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#14b8a6] to-[#0d9488] text-white shadow-lg shadow-[#14b8a6]/20">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">المقر الرئيسي</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">مجمع الأميرية التعليمي — شارع الصحراء — منطقة الأميرية — القاهرة</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-6 hover:-translate-y-1 hover:border-[#14b8a6]/30 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white shadow-lg shadow-[#3b82f6]/20">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">فرع السواح</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">شارع السواح — منطقة الزيتون — القاهرة</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-6 hover:-translate-y-1 hover:border-[#14b8a6]/30 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-500/20">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm mb-0.5">الهاتف</h3>
                      <p className="text-sm text-gray-400" dir="ltr">02-22800015</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-6 hover:-translate-y-1 hover:border-[#14b8a6]/30 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] text-white shadow-lg shadow-[#3b82f6]/20">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm mb-0.5">البريد</h3>
                      <p className="text-sm text-gray-400" dir="ltr">info@hitu.edu.eg</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-6 hover:-translate-y-1 hover:border-[#14b8a6]/30 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-lg shadow-amber-500/20">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">ساعات العمل</h3>
                    <p className="text-sm text-gray-400">الأحد — الخميس: 9:00 ص — 4:00 م</p>
                  </div>
                </div>
              </div>

              {/* Google Maps */}
              <div className="rounded-3xl border border-white/[0.08] overflow-hidden shadow-lg shadow-black/20">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3451.8!2d31.288!3d30.106!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDA2JzIxLjYiTiAzMcKwMTcnMTcuMyJF!5e0!3m2!1sar!2seg!4v1"
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="HITU Location"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>


    </div>
  );
}
