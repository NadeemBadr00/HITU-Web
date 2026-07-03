'use client';

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface BuildingRoom {
  name: string;
  floor: number;
}

interface Building {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  glowColor: string;
  floors: number;
  description: string;
  hours: string;
  departments?: string[];
  rooms: BuildingRoom[];
  gridArea: string;
}

const buildings: Building[] = [
  {
    id: 'admin',
    name: 'مبنى الإدارة',
    icon: '🏛️',
    color: 'text-slate-300',
    bgColor: 'bg-slate-500/15',
    borderColor: 'border-slate-400/30',
    glowColor: 'shadow-slate-400/20',
    floors: 3,
    description: 'المبنى الرئيسي للإدارة ويضم مكاتب القيادات وشؤون الطلاب',
    hours: '٨:٠٠ ص - ٤:٠٠ م',
    departments: ['مكتب العميد', 'شؤون الطلاب', 'الموارد البشرية', 'المالية'],
    rooms: [
      { name: 'مكتب العميد', floor: 3 },
      { name: 'مكتب وكيل الكلية', floor: 3 },
      { name: 'شؤون الطلاب', floor: 2 },
      { name: 'الشؤون المالية', floor: 2 },
      { name: 'الموارد البشرية', floor: 1 },
      { name: 'الاستقبال', floor: 1 },
    ],
    gridArea: 'admin',
  },
  {
    id: 'labs',
    name: 'مبنى المعامل',
    icon: '🔬',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/15',
    borderColor: 'border-blue-400/30',
    glowColor: 'shadow-blue-400/20',
    floors: 4,
    description: 'يحتوي على أحدث المعامل والمختبرات التقنية',
    hours: '٨:٠٠ ص - ٨:٠٠ م',
    departments: ['معمل الحاسبات', 'معمل الشبكات', 'معمل الروبوتات', 'معمل الإلكترونيات'],
    rooms: [
      { name: 'معمل الحاسبات (A)', floor: 1 },
      { name: 'معمل الحاسبات (B)', floor: 1 },
      { name: 'معمل الشبكات', floor: 2 },
      { name: 'معمل الأمن السيبراني', floor: 2 },
      { name: 'معمل الروبوتات', floor: 3 },
      { name: 'معمل الإلكترونيات', floor: 3 },
      { name: 'معمل الذكاء الاصطناعي', floor: 4 },
      { name: 'معمل إنترنت الأشياء', floor: 4 },
    ],
    gridArea: 'labs',
  },
  {
    id: 'lectures',
    name: 'مبنى المحاضرات',
    icon: '🎓',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/15',
    borderColor: 'border-purple-400/30',
    glowColor: 'shadow-purple-400/20',
    floors: 3,
    description: 'يضم قاعات المحاضرات الرئيسية وقاعة المؤتمرات',
    hours: '٧:٠٠ ص - ٩:٠٠ م',
    rooms: [
      { name: 'قاعة 101 - 105', floor: 1 },
      { name: 'قاعة 106 - 110', floor: 1 },
      { name: 'قاعة 201 - 205', floor: 2 },
      { name: 'قاعة 206 - 210', floor: 2 },
      { name: 'قاعة المؤتمرات الكبرى', floor: 3 },
      { name: 'قاعة الندوات', floor: 3 },
    ],
    gridArea: 'lectures',
  },
  {
    id: 'library',
    name: 'المكتبة',
    icon: '📚',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/15',
    borderColor: 'border-emerald-400/30',
    glowColor: 'shadow-emerald-400/20',
    floors: 2,
    description: 'المكتبة المركزية مع قاعات مطالعة وأقسام رقمية',
    hours: '٨:٠٠ ص - ١٠:٠٠ م',
    rooms: [
      { name: 'قاعة المطالعة الرئيسية', floor: 1 },
      { name: 'قسم الكتب العربية', floor: 1 },
      { name: 'قسم الكتب الأجنبية', floor: 1 },
      { name: 'قاعة الكمبيوتر', floor: 2 },
      { name: 'قسم الدوريات والأبحاث', floor: 2 },
      { name: 'غرف الدراسة الجماعية', floor: 2 },
    ],
    gridArea: 'library',
  },
  {
    id: 'cafeteria',
    name: 'الكافيتريا',
    icon: '☕',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/15',
    borderColor: 'border-amber-400/30',
    glowColor: 'shadow-amber-400/20',
    floors: 1,
    description: 'المطعم الرئيسي ومنطقة الاستراحة للطلاب',
    hours: '٧:٠٠ ص - ٧:٠٠ م',
    rooms: [
      { name: 'منطقة الطعام الرئيسية', floor: 1 },
      { name: 'ركن المشروبات', floor: 1 },
      { name: 'منطقة الجلوس الخارجية', floor: 1 },
      { name: 'المتجر الصغير', floor: 1 },
    ],
    gridArea: 'cafeteria',
  },
  {
    id: 'sports',
    name: 'الملاعب',
    icon: '⚽',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/15',
    borderColor: 'border-cyan-400/30',
    glowColor: 'shadow-cyan-400/20',
    floors: 1,
    description: 'المرافق الرياضية والملاعب المتعددة الأغراض',
    hours: '٦:٠٠ ص - ١٠:٠٠ م',
    rooms: [
      { name: 'ملعب كرة القدم', floor: 1 },
      { name: 'ملعب كرة السلة', floor: 1 },
      { name: 'ملعب كرة الطائرة', floor: 1 },
      { name: 'صالة الجيم', floor: 1 },
      { name: 'غرف تغيير الملابس', floor: 1 },
    ],
    gridArea: 'sports',
  },
];

export default function MapPage() {
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

  return (
    <div className="min-h-screen bg-[#050505]">
{/* Hero */}
      <section className="relative pt-20 pb-10 px-4 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-1/3 w-72 h-72 bg-cyan-500/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#14b8a6]/8 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-5 py-2 mb-6"
          >
            <span className="text-2xl">🗺️</span>
            <span className="text-cyan-400 text-sm font-medium">استكشف الحرم الجامعي</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            خريطة الحرم{' '}
            <span className="bg-gradient-to-r from-[#14b8a6] to-[#3b82f6] bg-clip-text text-transparent">الجامعي</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            اضغط على أي مبنى لعرض تفاصيله ومحتوياته
          </motion.p>
        </div>
      </section>

      {/* Map + Details Layout */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Campus Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-[#111111]/80 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6 md:p-10 relative overflow-hidden">
              {/* Dot grid background */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />

              {/* Compass */}
              <div className="absolute top-6 left-6 z-10 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-red-400 font-bold leading-none">N</span>
                    <span className="text-red-400 text-sm leading-none">▲</span>
                  </div>
                </div>
                <span className="text-[10px] text-gray-600 mt-1">شمال</span>
              </div>

              {/* Campus Label */}
              <div className="text-center mb-8 relative z-10">
                <h3 className="text-sm font-semibold text-gray-500 tracking-wide">
                  الحرم الجامعي - جامعة حلوان التكنولوجية الدولية
                </h3>
              </div>

              {/* Map Grid */}
              <div className="relative z-10 grid grid-cols-3 gap-4 md:gap-5 max-w-2xl mx-auto" style={{ gridTemplateAreas: `"admin admin labs" "lectures lectures labs" "library cafeteria sports"` }}>
                {buildings.map((building) => {
                  const isSelected = selectedBuilding?.id === building.id;

                  return (
                    <motion.button
                      key={building.id}
                      onClick={() => setSelectedBuilding(isSelected ? null : building)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative rounded-2xl border-2 p-4 md:p-6 text-center transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6] ${
                        isSelected
                          ? `${building.bgColor} ${building.borderColor} shadow-xl ${building.glowColor}`
                          : 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.15]'
                      }`}
                      style={{ gridArea: building.gridArea }}
                    >
                      {/* Pulsing glow for selected */}
                      {isSelected && (
                        <motion.div
                          className={`absolute inset-0 rounded-2xl ${building.bgColor} opacity-50`}
                          animate={{ opacity: [0.3, 0.6, 0.3] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}

                      <div className="relative z-10">
                        <div className="text-3xl md:text-4xl mb-2">{building.icon}</div>
                        <h4 className={`text-xs md:text-sm font-bold ${isSelected ? building.color : 'text-white'} mb-1`}>
                          {building.name}
                        </h4>
                        <p className="text-[10px] md:text-xs text-gray-500">
                          {building.floors > 1 ? `${building.floors} طوابق` : 'طابق واحد'}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Paths visualization */}
              <div className="relative z-0 mt-6 flex justify-center gap-2">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <div className="w-8 h-0.5 bg-gray-700 rounded" />
                  <span>ممرات</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <div className="w-3 h-3 rounded-full bg-emerald-900/50 border border-emerald-700/30" />
                  <span>مساحات خضراء</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="text-sm">🅿️</span>
                  <span>مواقف</span>
                </div>
              </div>

              {/* Entrance marker */}
              <div className="flex justify-center mt-4 relative z-10">
                <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] rounded-full px-4 py-2">
                  <span className="text-lg">🚪</span>
                  <span className="text-xs text-gray-400">البوابة الرئيسية</span>
                  <span className="text-xs">↓</span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5"
            >
              <h4 className="text-sm font-semibold text-white mb-4">🏷️ دليل المباني</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {buildings.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBuilding(b)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6] ${
                      selectedBuilding?.id === b.id
                        ? `${b.bgColor} ${b.borderColor} border`
                        : 'hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-md ${b.bgColor} border ${b.borderColor}`} />
                    <span className={`text-xs ${selectedBuilding?.id === b.id ? b.color : 'text-gray-400'}`}>
                      {b.icon} {b.name}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Details Panel */}
          <div className="lg:col-span-1">
            <AnimatePresence mode="wait">
              {selectedBuilding ? (
                <motion.div
                  key={selectedBuilding.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="sticky top-24"
                >
                  <div className={`bg-white/[0.03] backdrop-blur-xl border ${selectedBuilding.borderColor} rounded-3xl overflow-hidden`}>
                    {/* Header */}
                    <div className={`${selectedBuilding.bgColor} p-8 text-center border-b ${selectedBuilding.borderColor}`}>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        className="text-6xl mb-3"
                      >
                        {selectedBuilding.icon}
                      </motion.div>
                      <h3 className={`text-xl font-bold ${selectedBuilding.color}`}>
                        {selectedBuilding.name}
                      </h3>
                      <p className="text-sm text-gray-400 mt-2">{selectedBuilding.description}</p>
                    </div>

                    {/* Info */}
                    <div className="p-6 space-y-5">
                      {/* Quick stats */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/[0.03] rounded-xl p-3 text-center">
                          <p className="text-xs text-gray-500 mb-1">الطوابق</p>
                          <p className="text-lg font-bold text-white">{selectedBuilding.floors}</p>
                        </div>
                        <div className="bg-white/[0.03] rounded-xl p-3 text-center">
                          <p className="text-xs text-gray-500 mb-1">الغرف</p>
                          <p className="text-lg font-bold text-white">{selectedBuilding.rooms.length}</p>
                        </div>
                      </div>

                      {/* Hours */}
                      <div className="flex items-center gap-2 bg-white/[0.03] rounded-xl px-4 py-3">
                        <span>🕐</span>
                        <div>
                          <p className="text-xs text-gray-500">ساعات العمل</p>
                          <p className="text-sm text-white font-medium">{selectedBuilding.hours}</p>
                        </div>
                      </div>

                      {/* Departments */}
                      {selectedBuilding.departments && (
                        <div>
                          <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                            🏢 الأقسام والمكاتب
                          </h4>
                          <div className="space-y-1.5">
                            {selectedBuilding.departments.map((dept) => (
                              <div
                                key={dept}
                                className="flex items-center gap-2 text-sm text-gray-400 bg-white/[0.03] rounded-lg px-3 py-2"
                              >
                                <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${
                                  selectedBuilding.color.includes('blue') ? 'from-blue-400 to-blue-500' :
                                  selectedBuilding.color.includes('purple') ? 'from-purple-400 to-purple-500' :
                                  selectedBuilding.color.includes('emerald') ? 'from-emerald-400 to-emerald-500' :
                                  selectedBuilding.color.includes('amber') ? 'from-amber-400 to-amber-500' :
                                  selectedBuilding.color.includes('cyan') ? 'from-cyan-400 to-cyan-500' :
                                  'from-slate-400 to-slate-500'
                                }`} />
                                {dept}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Rooms by Floor */}
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          🚪 الغرف والقاعات
                        </h4>
                        {Array.from({ length: selectedBuilding.floors }, (_, i) => i + 1).map((floor) => {
                          const floorRooms = selectedBuilding.rooms.filter((r) => r.floor === floor);
                          if (floorRooms.length === 0) return null;

                          return (
                            <div key={floor} className="mb-3">
                              <p className="text-xs text-gray-500 mb-1.5 font-medium">
                                {floor === 1 ? 'الطابق الأول' : floor === 2 ? 'الطابق الثاني' : floor === 3 ? 'الطابق الثالث' : `الطابق ${floor}`}
                              </p>
                              <div className="space-y-1">
                                {floorRooms.map((room) => (
                                  <div
                                    key={room.name}
                                    className="text-xs text-gray-400 bg-white/[0.03] rounded-lg px-3 py-2 flex items-center gap-2"
                                  >
                                    <span className="text-gray-600">•</span>
                                    {room.name}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="sticky top-24 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-12 text-center"
                >
                  <div className="text-6xl mb-4 opacity-30">🏫</div>
                  <h3 className="text-lg font-semibold text-gray-500 mb-2">اختر مبنى</h3>
                  <p className="text-sm text-gray-600">
                    اضغط على أي مبنى في الخريطة لعرض تفاصيله ومحتوياته
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
