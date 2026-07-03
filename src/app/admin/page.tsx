'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const statsCards = [
  {
    label: 'إجمالي الطلاب',
    value: '1,247',
    change: '+12%',
    positive: true,
    gradient: 'from-blue-500 to-blue-600',
    shadowColor: 'shadow-blue-500/25',
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a23.838 23.838 0 0 0-1.012 5.434c-.487.076-.97.162-1.447.257M4.26 10.147A50.3 50.3 0 0 1 12 9.67c2.69 0 5.313.238 7.84.707" />
        <path d="m12 2.25 8.25 4.5v1.5L12 12.75 3.75 8.25v-1.5L12 2.25Z" />
      </svg>
    ),
  },
  {
    label: 'الأقسام العلمية',
    value: '7',
    change: '+1',
    positive: true,
    gradient: 'from-purple-500 to-purple-600',
    shadowColor: 'shadow-purple-500/25',
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
  },
  {
    label: 'أعضاء هيئة التدريس',
    value: '89',
    change: '+5%',
    positive: true,
    gradient: 'from-emerald-500 to-emerald-600',
    shadowColor: 'shadow-emerald-500/25',
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
  },
  {
    label: 'المقررات الدراسية',
    value: '156',
    change: '+8%',
    positive: true,
    gradient: 'from-amber-500 to-amber-600',
    shadowColor: 'shadow-amber-500/25',
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
];

const departmentStats = [
  { name: 'علوم الحاسب', value: 85, color: 'from-blue-500 to-blue-400' },
  { name: 'الذكاء الاصطناعي', value: 92, color: 'from-violet-500 to-violet-400' },
  { name: 'علوم البيانات', value: 78, color: 'from-cyan-500 to-cyan-400' },
  { name: 'الأمن السيبراني', value: 88, color: 'from-red-500 to-red-400' },
  { name: 'الميكاترونكس', value: 72, color: 'from-amber-500 to-amber-400' },
  { name: 'الأوتوترونكس', value: 65, color: 'from-emerald-500 to-emerald-400' },
  { name: 'الشبكات', value: 70, color: 'from-pink-500 to-pink-400' },
];

const recentActivity = [
  { icon: '🆕', text: 'تم إضافة طالب جديد - أحمد محمد', time: 'منذ 5 دقائق' },
  { icon: '📝', text: 'تم تحديث بيانات قسم الذكاء الاصطناعي', time: 'منذ 15 دقيقة' },
  { icon: '📰', text: 'تم نشر خبر جديد', time: 'منذ ساعة' },
  { icon: '👤', text: 'تم تحديث بيانات القيادات', time: 'منذ ساعتين' },
  { icon: '📊', text: 'تم تحديث نتائج الطلاب', time: 'منذ 3 ساعات' },
  { icon: '⚙️', text: 'تم تحديث إعدادات النظام', time: 'منذ 5 ساعات' },
];

const quickActions = [
  { label: 'إضافة طالب', href: '/admin/students', icon: '🎓', gradient: 'from-blue-500 to-blue-600' },
  { label: 'إضافة خبر', href: '/admin/news', icon: '📰', gradient: 'from-purple-500 to-purple-600' },
  { label: 'إدارة الأقسام', href: '/admin/departments', icon: '🏛️', gradient: 'from-emerald-500 to-emerald-600' },
  { label: 'الإعدادات', href: '/admin/settings', icon: '⚙️', gradient: 'from-amber-500 to-amber-600' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-white mb-2">لوحة التحكم</h1>
        <p className="text-slate-400">مرحباً بك في لوحة تحكم HITU الإدارية 👋</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statsCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">{card.label}</p>
                <p className="text-3xl font-bold text-white">{card.value}</p>
                <span className={`inline-flex items-center gap-1 mt-2 text-xs font-medium px-2 py-1 rounded-lg ${
                  card.positive ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'
                }`}>
                  {card.positive ? '↑' : '↓'} {card.change}
                </span>
              </div>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} ${card.shadowColor} shadow-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                {card.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Statistics */}
        <motion.div
          variants={itemVariants}
          className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-sm">📊</span>
            إحصائيات الأقسام
          </h2>
          <div className="space-y-4">
            {departmentStats.map((dept, index) => (
              <motion.div
                key={dept.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.08 }}
                className="group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{dept.name}</span>
                  <span className="text-sm font-bold text-white">{dept.value}%</span>
                </div>
                <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dept.value}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.8, ease: 'easeOut' }}
                    className={`h-full bg-gradient-to-l ${dept.color} rounded-full relative`}
                  >
                    <div className="absolute inset-0 bg-white/20 rounded-full shimmer" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          variants={itemVariants}
          className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-sm">🕐</span>
            النشاط الأخير
          </h2>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.08 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-700/30 border border-white/5 hover:border-white/10 hover:bg-slate-700/50 transition-all cursor-default group"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">{activity.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200 truncate">{activity.text}</p>
                </div>
                <span className="text-xs text-slate-500 whitespace-nowrap">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-sm">⚡</span>
          إجراءات سريعة
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <Link
                href={action.href}
                className={`block p-6 rounded-2xl bg-gradient-to-br ${action.gradient} text-white text-center hover:scale-105 hover:shadow-xl transition-all duration-300 group`}
              >
                <span className="text-3xl block mb-3 group-hover:scale-110 transition-transform">{action.icon}</span>
                <span className="text-sm font-bold">{action.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
