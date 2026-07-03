'use client';

import Link from 'next/link';
import Image from 'next/image';

const quickLinks = [
  { href: '/departments', label: 'الأقسام العلمية' },
  { href: '/leaders', label: 'القيادات' },
  { href: '/rankings', label: 'أوائل الطلاب' },
  { href: '/chatbot', label: 'المساعد الذكي' },
  { href: '/news', label: 'الأخبار' },
  { href: '/timetable', label: 'الجداول' },
  { href: '/library', label: 'المكتبة' },
  { href: '/calendar', label: 'التقويم' },
];

const contactInfo = [
  { icon: '📍', text: 'العاشر من رمضان، الشرقية، مصر' },
  { icon: '📧', text: 'info@hitu.edu.eg' },
  { icon: '📞', text: '+20 15 1234 5678' },
];

const socialLinks = [
  {
    name: 'الصفحة الرسمية',
    href: 'https://www.facebook.com/profile.php?id=61575035922866',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: 'صفحة الجامعة',
    href: 'https://www.facebook.com/Helwan.International.Technological.University.777',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: 'اتحاد الطلاب',
    href: 'https://www.facebook.com/groups/416122154378893',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="relative bg-[#0a0a0a] border-t border-white/[0.06]">
      {/* Decorative top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-[#14b8a6]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-10 sm:mb-12">
          {/* About Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <Image
                src="/logo.png"
                alt="HITU Logo"
                width={44}
                height={44}
                className="w-11 h-11 rounded-full shadow-lg shadow-[#14b8a6]/15"
              />
              <div>
                <h3 className="text-lg font-bold text-white">HITU</h3>
                <p className="text-xs text-gray-500">جامعة حلوان التكنولوجية الدولية</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              المنصة الرقمية الرسمية لجامعة حلوان التكنولوجية الدولية. نقدم تجربة تعليمية متطورة تجمع بين التكنولوجيا والإبداع.
            </p>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400/80">النظام يعمل بكفاءة</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#14b8a6]" />
              روابط سريعة
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#2dd4bf] transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-[#14b8a6] transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
              معلومات التواصل
            </h4>
            <ul className="space-y-3.5">
              {contactInfo.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-base mt-0.5">{item.icon}</span>
                  <span className="text-sm text-gray-400">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Social + Follow */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
              تابعنا
            </h4>
            <p className="text-sm text-gray-400 mb-4">
              تابعنا على وسائل التواصل الاجتماعي لآخر الأخبار والتحديثات.
            </p>
            <div className="flex flex-col gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08]
                    hover:bg-[#14b8a6]/10 hover:border-[#14b8a6]/30 hover:text-[#2dd4bf]
                    text-gray-400 transition-all duration-200 group"
                >
                  <span className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center group-hover:bg-[#14b8a6]/15 transition-colors">
                    {social.icon}
                  </span>
                  <span className="text-sm">{social.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent mb-6" />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 text-center sm:text-start">
            © 2024-2025 جامعة حلوان التكنولوجية الدولية. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Link href="/about" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              عن الجامعة
            </Link>
            <span className="text-gray-700">•</span>
            <Link href="/contact" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              تواصل معنا
            </Link>
            <span className="text-gray-700">•</span>
            <span className="text-xs text-gray-600">
              صنع بواسطة نديم
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
