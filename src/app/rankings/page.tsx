'use client';

import { useState } from 'react';

import { motion } from 'framer-motion';
import { Download, FileSpreadsheet } from 'lucide-react';
import { exportRankingsPDF, exportRankingsExcel } from '@/lib/export-utils';
import type { RankingStudent } from '@/lib/export-utils';

interface StudentRanking {
  rank: number;
  name: string;
  totalScore: number;
  percentage: number;
  grade: string;
}

interface DepartmentRankings {
  dataScience: StudentRanking[];
  cyberSecurity: StudentRanking[];
  artificialIntelligence: StudentRanking[];
  garmentIndustryTech: StudentRanking[];
  industrialControlSystems: StudentRanking[];
  autotronics: StudentRanking[];
  mechatronics: StudentRanking[];
}

const DEPARTMENTS = [
  { key: 'artificialIntelligence', nameAr: 'الذكاء الاصطناعي', icon: '🤖', color: 'from-blue-500 to-indigo-600' },
  { key: 'dataScience', nameAr: 'علوم البيانات', icon: '📊', color: 'from-emerald-500 to-teal-600' },
  { key: 'cyberSecurity', nameAr: 'الأمن السيبراني', icon: '🛡️', color: 'from-red-500 to-rose-600' },
  { key: 'autotronics', nameAr: 'أوتوترونكس', icon: '🚗', color: 'from-amber-500 to-orange-600' },
  { key: 'mechatronics', nameAr: 'ميكاترونكس', icon: '⚙️', color: 'from-violet-500 to-purple-600' },
  { key: 'industrialControlSystems', nameAr: 'التحكم الصناعي', icon: '🏭', color: 'from-cyan-500 to-blue-600' },
  { key: 'garmentIndustryTech', nameAr: 'تكنولوجيا الملابس', icon: '👔', color: 'from-pink-500 to-fuchsia-600' },
] as const;

const YEAR_TABS = [
  { key: 'firstYear', label: 'الفرقة الأولى' },
  { key: 'secondYear', label: 'الفرقة الثانية' },
  { key: 'thirdYear', label: 'الفرقة الثالثة' },
] as const;

type YearKey = 'firstYear' | 'secondYear' | 'thirdYear';
type DeptKey = typeof DEPARTMENTS[number]['key'];

// ===== EMBEDDED DATA =====
const rankingsData: Record<YearKey, DepartmentRankings> = {
  thirdYear: {
    dataScience: [
      { rank: 1, name: 'جون رزيق عزيز جرجس', totalScore: 1408, percentage: 88, grade: 'ممتاز' },
      { rank: 2, name: 'زينب محمد رضوان عبد الجواد', totalScore: 1402, percentage: 87.62, grade: 'ممتاز' },
      { rank: 3, name: 'شهد يحيي محمد عبد العال', totalScore: 1399, percentage: 87.43, grade: 'ممتاز' },
      { rank: 4, name: 'محمد ابراهيم محمد ابراهيم محمد', totalScore: 1376, percentage: 86, grade: 'ممتاز' },
      { rank: 5, name: 'ريمون فايز نسيم عيد', totalScore: 1354, percentage: 84.62, grade: 'جيدجدا' },
      { rank: 6, name: 'عمر احمد عبد المنعم عبد الوهاب', totalScore: 1354, percentage: 84.62, grade: 'جيدجدا' },
      { rank: 7, name: 'حبيبه سعيد السيد احمد', totalScore: 1341, percentage: 83.81, grade: 'جيدجدا' },
      { rank: 8, name: 'احمد محمد إبراهيم عبد الصادق', totalScore: 1336, percentage: 83.5, grade: 'جيدجدا' },
      { rank: 9, name: 'محمد ابو العال رجب محفوظ', totalScore: 1336, percentage: 83.5, grade: 'جيدجدا' },
      { rank: 10, name: 'علي موسي علي السيد العرمان', totalScore: 1325, percentage: 82.81, grade: 'جيدجدا' },
    ],
    cyberSecurity: [
      { rank: 1, name: 'ردينه محمد الهادى محمود عثمان', totalScore: 1450, percentage: 90.62, grade: 'ممتاز' },
      { rank: 2, name: 'امنيه حلمى محمد حلمى بيومى', totalScore: 1447, percentage: 90.43, grade: 'ممتاز' },
      { rank: 3, name: 'ماريز ايهاب سمير غالى', totalScore: 1447, percentage: 90.43, grade: 'ممتاز' },
      { rank: 4, name: 'شهد باهر حسين محمد', totalScore: 1433, percentage: 89.56, grade: 'ممتاز' },
      { rank: 5, name: 'ريم امين محمود اسماعيل يوسف', totalScore: 1429, percentage: 89.31, grade: 'ممتاز' },
      { rank: 6, name: 'عمر خالد ابو الفتوح عبد المجيد', totalScore: 1420, percentage: 88.75, grade: 'ممتاز' },
      { rank: 7, name: 'محمد احمد فكرى على', totalScore: 1414, percentage: 88.37, grade: 'ممتاز' },
      { rank: 8, name: 'فهد احمد فضل محمود', totalScore: 1409, percentage: 88.06, grade: 'ممتاز' },
      { rank: 9, name: 'مهند وليد الشحات احمد سيد احمد', totalScore: 1398, percentage: 87.37, grade: 'ممتاز' },
      { rank: 10, name: 'اسالم خالد رمضان عبد العزيز', totalScore: 1395, percentage: 87.18, grade: 'ممتاز' },
    ],
    artificialIntelligence: [
      { rank: 1, name: 'هاجر محمود بركات تغيان', totalScore: 1522, percentage: 95.12, grade: 'ممتاز' },
      { rank: 2, name: 'محمد عمرو محمد كامل', totalScore: 1481, percentage: 92.56, grade: 'ممتاز' },
      { rank: 3, name: 'يوستينا سامى ثابت هارون', totalScore: 1480, percentage: 92.5, grade: 'ممتاز' },
      { rank: 4, name: 'هاجر سليمان حمدان سليمان', totalScore: 1478, percentage: 92.37, grade: 'ممتاز' },
      { rank: 5, name: 'احمد وليد عبد الغفار عبد الوهاب الديب', totalScore: 1473, percentage: 92.06, grade: 'ممتاز' },
      { rank: 6, name: 'ملك محمد عبد الحميد محمد', totalScore: 1462, percentage: 91.37, grade: 'ممتاز' },
      { rank: 7, name: 'مروه احمد عبد الدايم شحاته', totalScore: 1461, percentage: 91.31, grade: 'ممتاز' },
      { rank: 8, name: 'احمد امين عبد النبى امين', totalScore: 1452, percentage: 90.75, grade: 'ممتاز' },
      { rank: 9, name: 'زياد سيد محمد احمد علي', totalScore: 1441, percentage: 90.06, grade: 'ممتاز' },
      { rank: 10, name: 'احمد محمد رمضان السيد', totalScore: 1440, percentage: 90, grade: 'ممتاز' },
    ],
    garmentIndustryTech: [
      { rank: 1, name: 'عماد صبرى عبد اللطيف محمود', totalScore: 1542, percentage: 96.37, grade: 'ممتاز' },
      { rank: 2, name: 'محمد حسن حامد عثمان سيد احمد', totalScore: 1541, percentage: 96.31, grade: 'ممتاز' },
      { rank: 3, name: 'مصطفي ايمن انبساط خليل', totalScore: 1509, percentage: 94.31, grade: 'ممتاز' },
      { rank: 4, name: 'محمد مصطفى عشرى عبد المقصود', totalScore: 1473, percentage: 92.06, grade: 'ممتاز' },
      { rank: 5, name: 'االء اشرف عبد الفتاح فرج', totalScore: 1469, percentage: 91.81, grade: 'ممتاز' },
      { rank: 6, name: 'احمد جمال احمد محمد عبد الجليل', totalScore: 1452, percentage: 90.75, grade: 'ممتاز' },
      { rank: 7, name: 'احمد محمد محمود بهنسى', totalScore: 1450, percentage: 90.62, grade: 'ممتاز' },
      { rank: 8, name: 'احمد سالمه عبد العظيم محمد', totalScore: 1449, percentage: 90.56, grade: 'ممتاز' },
      { rank: 9, name: 'عبد العزيز صبرى عبد العزيز عطيه', totalScore: 1449, percentage: 90.56, grade: 'ممتاز' },
      { rank: 10, name: 'احمد شحات على امين عبد اللطيف حمزه', totalScore: 1442, percentage: 90.12, grade: 'ممتاز' },
    ],
    industrialControlSystems: [
      { rank: 1, name: 'احمد محمود محمد فتيان', totalScore: 1445, percentage: 90.31, grade: 'ممتاز' },
      { rank: 2, name: 'عبد هللا شحاته محمود نصار', totalScore: 1431, percentage: 89.43, grade: 'ممتاز' },
      { rank: 3, name: 'احمد محمد محمود راغب', totalScore: 1401, percentage: 87.56, grade: 'ممتاز' },
      { rank: 4, name: 'احمد سمير عبد العزيز محمد الطيار', totalScore: 1398, percentage: 87.37, grade: 'ممتاز' },
      { rank: 5, name: 'عبد الرحمن رضا حسن مبروك', totalScore: 1377, percentage: 86.06, grade: 'ممتاز' },
      { rank: 6, name: 'االء سعد السيد السيد', totalScore: 1367, percentage: 85.43, grade: 'ممتاز' },
      { rank: 7, name: 'احمد عبد النبى ظاهر احمد خليل', totalScore: 1339, percentage: 83.68, grade: 'جيدجدا' },
      { rank: 8, name: 'احمد كمال مشحوت احمد', totalScore: 1335, percentage: 83.43, grade: 'جيدجدا' },
      { rank: 9, name: 'عمرو خيرى عباس شلبى', totalScore: 1333, percentage: 83.31, grade: 'جيدجدا' },
      { rank: 10, name: 'عبد الرحمن محمد محمد البوسطى', totalScore: 1329, percentage: 83.06, grade: 'جيدجدا' },
    ],
    autotronics: [
      { rank: 1, name: 'يوسف محمد حسن السيد', totalScore: 1543, percentage: 96.43, grade: 'ممتاز' },
      { rank: 2, name: 'عبد الرحمن اسامه محمد بكر', totalScore: 1512, percentage: 94.5, grade: 'ممتاز' },
      { rank: 3, name: 'مصطفي هشام جبريل محمد', totalScore: 1507, percentage: 94.18, grade: 'ممتاز' },
      { rank: 4, name: 'حسين سيد عبد المغنى عبد الهادى عبد الفتاح', totalScore: 1465, percentage: 91.56, grade: 'ممتاز' },
      { rank: 5, name: 'ماريا ماهر سعيد حبيب', totalScore: 1456, percentage: 91, grade: 'ممتاز' },
      { rank: 6, name: 'سلمى احمد عبد المنعم المزين', totalScore: 1455, percentage: 90.93, grade: 'ممتاز' },
      { rank: 7, name: 'بدور محمود ظاهر على حسن', totalScore: 1429, percentage: 89.31, grade: 'ممتاز' },
      { rank: 8, name: 'هدير خليل محمد خليل', totalScore: 1422, percentage: 88.87, grade: 'ممتاز' },
      { rank: 9, name: 'يوسف محمد احمد احمد حسين', totalScore: 1402, percentage: 87.62, grade: 'ممتاز' },
      { rank: 10, name: 'منه هللا عبد الهادي احمد عباس', totalScore: 1385, percentage: 86.56, grade: 'ممتاز' },
    ],
    mechatronics: [
      { rank: 1, name: 'عبد هللا عادل عبده عبد القادر', totalScore: 1476, percentage: 92.25, grade: 'ممتاز' },
      { rank: 2, name: 'احمد احمد زغلول على', totalScore: 1467, percentage: 91.68, grade: 'ممتاز' },
      { rank: 3, name: 'ياسمين محمود حسن ابوزيد', totalScore: 1465, percentage: 91.56, grade: 'ممتاز' },
      { rank: 4, name: 'روزان محمود احمد سليمان', totalScore: 1461, percentage: 91.31, grade: 'ممتاز' },
      { rank: 5, name: 'زياد محمد عبد ربه توفيق', totalScore: 1453, percentage: 90.81, grade: 'ممتاز' },
      { rank: 6, name: 'محمد ايمن محمد السيد', totalScore: 1449, percentage: 90.56, grade: 'ممتاز' },
      { rank: 7, name: 'ايه وحيد السيد شحاته', totalScore: 1441, percentage: 90.06, grade: 'ممتاز' },
      { rank: 8, name: 'عبد الرحمن صبرى كمال محمد', totalScore: 1441, percentage: 90.06, grade: 'ممتاز' },
      { rank: 9, name: 'اسراء اشرف صالح محمد الديب', totalScore: 1436, percentage: 89.75, grade: 'ممتاز' },
      { rank: 10, name: 'روان ابراهيم دسوقى ابراهيم على', totalScore: 1435, percentage: 89.68, grade: 'ممتاز' },
    ],
  },
  secondYear: {
    dataScience: [
      { rank: 1, name: 'مازن عبدالرحيم محمد عثمان', totalScore: 1577, percentage: 92.76, grade: 'ممتاز' },
      { rank: 2, name: 'محمد هانى مصطفى عبدالرحمن مصطفى', totalScore: 1520, percentage: 89.41, grade: 'ممتاز' },
      { rank: 3, name: 'ماركو عادل فهيم ابراهيم', totalScore: 1506, percentage: 88.58, grade: 'ممتاز' },
      { rank: 4, name: 'احمد حمدتو على مغازى', totalScore: 1489, percentage: 87.58, grade: 'ممتاز' },
      { rank: 5, name: 'احمد محمد مختار مصطفى', totalScore: 1477, percentage: 86.88, grade: 'ممتاز' },
      { rank: 6, name: 'يوحنا جورج يعقوب ابراهيم', totalScore: 1469, percentage: 86.41, grade: 'ممتاز' },
      { rank: 7, name: 'مصطفى مجدى عبدالحميد رمضان', totalScore: 1462, percentage: 86, grade: 'ممتاز' },
      { rank: 8, name: 'انجيل عاطف ميالد تكال', totalScore: 1441, percentage: 84.76, grade: 'جيدجدا' },
      { rank: 9, name: 'احمد محمد حامد الدرسي', totalScore: 1433, percentage: 84.29, grade: 'جيدجدا' },
      { rank: 10, name: 'محمد محمد احمد محمد حسن', totalScore: 1426, percentage: 83.88, grade: 'جيدجدا' },
    ],
    cyberSecurity: [
      { rank: 1, name: 'على اكرم عبدالمحسن السيد', totalScore: 1569, percentage: 92.29, grade: 'ممتاز' },
      { rank: 2, name: 'ابراهيم هشام عوض امام جويد', totalScore: 1550, percentage: 91.17, grade: 'ممتاز' },
      { rank: 3, name: 'أحمد وليد محمد محمود', totalScore: 1549, percentage: 91.11, grade: 'ممتاز' },
      { rank: 4, name: 'عبد الباسط محمد عبد الباسط سيد', totalScore: 1535, percentage: 90.29, grade: 'ممتاز' },
      { rank: 5, name: 'حسين احمد محمد دردير محمد', totalScore: 1529, percentage: 89.94, grade: 'ممتاز' },
      { rank: 6, name: 'اياد محمود على عبد الهادى حسين', totalScore: 1519, percentage: 89.35, grade: 'ممتاز' },
      { rank: 7, name: 'كريم طارق السيد محمد عبد العال', totalScore: 1510, percentage: 88.82, grade: 'ممتاز' },
      { rank: 8, name: 'حبيبة اسامة احمد مصطفي', totalScore: 1506, percentage: 88.58, grade: 'ممتاز' },
      { rank: 9, name: 'محمد السيد محمد عبد العال اسماعيل', totalScore: 1504, percentage: 88.47, grade: 'ممتاز' },
      { rank: 10, name: 'دميانه اكرم مالك حبيب عوض', totalScore: 1500, percentage: 88.23, grade: 'ممتاز' },
    ],
    artificialIntelligence: [
      { rank: 1, name: 'شهد رافت محمد على بخيت', totalScore: 1666, percentage: 95.2, grade: 'ممتاز' },
      { rank: 2, name: 'نديم محمد بدر الدين احمد', totalScore: 1655, percentage: 94.57, grade: 'ممتاز' },
      { rank: 3, name: 'يوسف هشام وليم عازر', totalScore: 1654, percentage: 94.51, grade: 'ممتاز' },
      { rank: 4, name: 'روان راضى حسن راضى عبد القادر', totalScore: 1629, percentage: 93.08, grade: 'ممتاز' },
      { rank: 5, name: 'حسن سعيد حسن علي', totalScore: 1623, percentage: 92.74, grade: 'ممتاز' },
      { rank: 6, name: 'فتحى محسن فتحى ابواليزيد', totalScore: 1620, percentage: 92.57, grade: 'ممتاز' },
      { rank: 7, name: 'احمد حسين فرج حسين', totalScore: 1619, percentage: 92.51, grade: 'ممتاز' },
      { rank: 8, name: 'جوليان اشرف كميل عبدالعالي', totalScore: 1615, percentage: 92.28, grade: 'ممتاز' },
      { rank: 9, name: 'سهيله سالمه عبدالرحمن محمد عبدالرحمن', totalScore: 1608, percentage: 91.88, grade: 'ممتاز' },
      { rank: 10, name: 'جنى هانى محمد شاكر مصطفى السواق', totalScore: 1602, percentage: 91.54, grade: 'ممتاز' },
    ],
    garmentIndustryTech: [
      { rank: 1, name: 'رودينا وائل عباس على', totalScore: 1508, percentage: 94.25, grade: 'ممتاز' },
      { rank: 2, name: 'مها جمال محمود سرحان', totalScore: 1496, percentage: 93.5, grade: 'ممتاز' },
      { rank: 3, name: 'عبدالرحمن صابر على مصلح على', totalScore: 1475, percentage: 92.18, grade: 'ممتاز' },
      { rank: 4, name: 'محمود محمد محمد على ابو هاشم', totalScore: 1462, percentage: 91.37, grade: 'ممتاز' },
      { rank: 5, name: 'عمر ممدوح محمد سنوسي', totalScore: 1422, percentage: 88.87, grade: 'ممتاز' },
      { rank: 6, name: 'هاله نسيم فؤاد عدلي', totalScore: 1418, percentage: 88.62, grade: 'ممتاز' },
      { rank: 7, name: 'يوسف محمد احمد محمد عيد', totalScore: 1398, percentage: 87.37, grade: 'ممتاز' },
      { rank: 8, name: 'عمار عبدهللا اسماعيل محمد', totalScore: 1377, percentage: 86.06, grade: 'ممتاز' },
      { rank: 9, name: 'سها هيسم احمد محمد عبدهللا', totalScore: 1376, percentage: 86, grade: 'ممتاز' },
      { rank: 10, name: 'محمد احمد سعيد سيد السمان', totalScore: 1373, percentage: 85.81, grade: 'ممتاز' },
    ],
    industrialControlSystems: [
      { rank: 1, name: 'كمال سعيد علي عيد عودة', totalScore: 1495, percentage: 93.43, grade: 'ممتاز' },
      { rank: 2, name: 'احمد عزت محمد واطفه', totalScore: 1426, percentage: 89.12, grade: 'ممتاز' },
      { rank: 3, name: 'عمر عبدالعزيز ركابى على', totalScore: 1395, percentage: 87.18, grade: 'ممتاز' },
      { rank: 4, name: 'ساره ميالد جاد هللا الجندى', totalScore: 1390, percentage: 86.87, grade: 'ممتاز' },
      { rank: 5, name: 'امنية زاهر رزق احمد االعرج', totalScore: 1370, percentage: 85.62, grade: 'ممتاز' },
      { rank: 6, name: 'محمد جمال ابووردة عليم', totalScore: 1367, percentage: 85.43, grade: 'ممتاز' },
      { rank: 7, name: 'محمد ابراهيم محمد محمد مصطفى', totalScore: 1365, percentage: 85.31, grade: 'ممتاز' },
      { rank: 8, name: 'مريم محمد عبدالعزيز محمد السيد', totalScore: 1364, percentage: 85.25, grade: 'ممتاز' },
      { rank: 9, name: 'اهداء عمرو السيد عبدالسالم خطاب', totalScore: 1361, percentage: 85.06, grade: 'ممتاز' },
      { rank: 10, name: 'يوسف محمد يوسف عبدهللا', totalScore: 1361, percentage: 85.06, grade: 'ممتاز' },
    ],
    autotronics: [
      { rank: 1, name: 'محمد ايمن عبدالمنعم محمد احمد', totalScore: 1479, percentage: 92.43, grade: 'ممتاز' },
      { rank: 2, name: 'محمد على خليل حسن', totalScore: 1455, percentage: 90.93, grade: 'ممتاز' },
      { rank: 3, name: 'اسماعيل على احمد اسماعيل', totalScore: 1407, percentage: 87.93, grade: 'ممتاز' },
      { rank: 4, name: 'عبدهللا احمد خضر محمد رمضان', totalScore: 1401, percentage: 87.56, grade: 'ممتاز' },
      { rank: 5, name: 'محمد عادل محمد صديق', totalScore: 1401, percentage: 87.56, grade: 'ممتاز' },
      { rank: 6, name: 'يوسف محمود محمد ندا محمد', totalScore: 1384, percentage: 86.5, grade: 'ممتاز' },
      { rank: 7, name: 'صبحى رفاعى صبحى رفاعى سالم شوشه', totalScore: 1382, percentage: 86.37, grade: 'ممتاز' },
      { rank: 8, name: 'محمد رضا محمد فرج فرج', totalScore: 1378, percentage: 86.12, grade: 'ممتاز' },
      { rank: 9, name: 'كيرلس سعيد رياض سعيد', totalScore: 1373, percentage: 85.81, grade: 'ممتاز' },
      { rank: 10, name: 'مينا هانى سعيد البير لطيف', totalScore: 1370, percentage: 85.62, grade: 'ممتاز' },
    ],
    mechatronics: [
      { rank: 1, name: 'مؤمن طارق خليل السيد', totalScore: 1549, percentage: 96.81, grade: 'ممتاز' },
      { rank: 2, name: 'ناصر عبدالرحمن ناصر عبدالالهى', totalScore: 1547, percentage: 96.68, grade: 'ممتاز' },
      { rank: 3, name: 'دميانه ظريف جميل غيطي', totalScore: 1540, percentage: 96.25, grade: 'ممتاز' },
      { rank: 4, name: 'مها يسري محمود ابو هنيدي', totalScore: 1535, percentage: 95.93, grade: 'ممتاز' },
      { rank: 5, name: 'رضوى وارف عبد الوهاب احمد', totalScore: 1509, percentage: 94.31, grade: 'ممتاز' },
      { rank: 6, name: 'مارينا الفونس عياد لوقا', totalScore: 1508, percentage: 94.25, grade: 'ممتاز' },
      { rank: 7, name: 'فاتن فريد شوقى على ابوشريده', totalScore: 1502, percentage: 93.87, grade: 'ممتاز' },
      { rank: 8, name: 'نوران محمد محمود ابراهيم محمد', totalScore: 1498, percentage: 93.62, grade: 'ممتاز' },
      { rank: 9, name: 'مازن احمد محمد محمد عبدالهادى', totalScore: 1495, percentage: 93.43, grade: 'ممتاز' },
      { rank: 10, name: 'كمال محمد كمال سعد عيسى', totalScore: 1488, percentage: 93, grade: 'ممتاز' },
    ],
  },
  firstYear: {
    dataScience: [
      { rank: 1, name: 'ثائر إبراهيم كامل حسن حبيب', totalScore: 1506, percentage: 94.12, grade: 'ممتاز' },
      { rank: 2, name: 'يوسف حسن عبدهللا علي احمد', totalScore: 1496, percentage: 93.5, grade: 'ممتاز' },
      { rank: 3, name: 'عمر احمد محمدى المليح', totalScore: 1465, percentage: 91.56, grade: 'ممتاز' },
      { rank: 4, name: 'احمد عماد سيد اسماعيل', totalScore: 1448, percentage: 90.5, grade: 'ممتاز' },
      { rank: 5, name: 'ايمان اشرف السيد ابوزيد حسين محمد سابق', totalScore: 1445, percentage: 90.31, grade: 'ممتاز' },
      { rank: 6, name: 'محمد جمال حسن محمد محمد ضيف', totalScore: 1445, percentage: 90.31, grade: 'ممتاز' },
      { rank: 7, name: 'يوسف محمد عبدالوهاب عثمان', totalScore: 1426, percentage: 89.12, grade: 'ممتاز' },
      { rank: 8, name: 'هاجر محمود صابر عطيه عبدالنبى', totalScore: 1422, percentage: 88.87, grade: 'ممتاز' },
      { rank: 9, name: 'رشيدى عماد رشيدى كردى', totalScore: 1400, percentage: 87.5, grade: 'ممتاز' },
      { rank: 10, name: 'زياد عبدالروؤف العبد السيد', totalScore: 1395, percentage: 87.18, grade: 'ممتاز' },
    ],
    cyberSecurity: [
      { rank: 1, name: 'فيلوباتير ميخائيل فارس اقالديوس', totalScore: 1537, percentage: 96.06, grade: 'ممتاز' },
      { rank: 2, name: 'منصور ابراهيم منصور أحمد عبدالجواد', totalScore: 1522, percentage: 95.12, grade: 'ممتاز' },
      { rank: 3, name: 'فاطمة حاتم غباشى عبدالعاطى ابوعطا', totalScore: 1502, percentage: 93.87, grade: 'ممتاز' },
      { rank: 4, name: 'مؤمن طارق الشربيني عبد المنعم الشربيني', totalScore: 1498, percentage: 93.62, grade: 'ممتاز' },
      { rank: 5, name: 'منه هللا جمعه اسماعيل ابراهيم', totalScore: 1496, percentage: 93.5, grade: 'ممتاز' },
      { rank: 6, name: 'يوسف ايمن جابر على', totalScore: 1496, percentage: 93.5, grade: 'ممتاز' },
      { rank: 7, name: 'حبيبه صالح الدين محمد شبل البيلى', totalScore: 1494, percentage: 93.37, grade: 'ممتاز' },
      { rank: 8, name: 'اياد محمد مصطفى امين', totalScore: 1492, percentage: 93.25, grade: 'ممتاز' },
      { rank: 9, name: 'زياد مصطفى عبدالفتاح ابراهيم', totalScore: 1491, percentage: 93.18, grade: 'ممتاز' },
      { rank: 10, name: 'منة هللا ماهر جوده احمد عبد الرحمن', totalScore: 1484, percentage: 92.75, grade: 'ممتاز' },
    ],
    artificialIntelligence: [
      { rank: 1, name: 'مصطفى عادل حماد ابراهيم', totalScore: 1547, percentage: 96.68, grade: 'ممتاز' },
      { rank: 2, name: 'فاطمه حسام فتحي عبد المقصود خلف هللا', totalScore: 1533, percentage: 95.81, grade: 'ممتاز' },
      { rank: 3, name: 'احمد عادل عبدالمنعم محمد سرور', totalScore: 1528, percentage: 95.5, grade: 'ممتاز' },
      { rank: 4, name: 'عبد الرحمن الحسين محمد موسى الننى', totalScore: 1527, percentage: 95.43, grade: 'ممتاز' },
      { rank: 5, name: 'ملك محمد صالح محمد داود', totalScore: 1514, percentage: 94.62, grade: 'ممتاز' },
      { rank: 6, name: 'يوسف هاني كامل ابراهيم ابو المجد', totalScore: 1511, percentage: 94.43, grade: 'ممتاز' },
      { rank: 7, name: 'عمرو الدسوقى توفيق احمد', totalScore: 1509, percentage: 94.31, grade: 'ممتاز' },
      { rank: 8, name: 'عمرو مدكور مخلوف جاد الكريم', totalScore: 1507, percentage: 94.18, grade: 'ممتاز' },
      { rank: 9, name: 'محمود محمد فؤاد عبدالغنى', totalScore: 1503, percentage: 93.93, grade: 'ممتاز' },
      { rank: 10, name: 'سدره سمير محمد ابراهيم', totalScore: 1502, percentage: 93.87, grade: 'ممتاز' },
    ],
    garmentIndustryTech: [
      { rank: 1, name: 'ملك وائل عبد المعطى ابراهيم', totalScore: 1545, percentage: 96.56, grade: 'ممتاز' },
      { rank: 2, name: 'ايه مختار مصطفى السيد محمد وهبه', totalScore: 1482, percentage: 92.62, grade: 'ممتاز' },
      { rank: 3, name: 'شروق محمد احمد حسن زغله', totalScore: 1468, percentage: 91.75, grade: 'ممتاز' },
      { rank: 4, name: 'فرح احمد محمد عبدالرحمن سالم', totalScore: 1467, percentage: 91.68, grade: 'ممتاز' },
      { rank: 5, name: 'شهد سعد علي سعد سليم', totalScore: 1456, percentage: 91, grade: 'ممتاز' },
      { rank: 6, name: 'بسنت اشرف احمد عبدالقادر فراج', totalScore: 1455, percentage: 90.93, grade: 'ممتاز' },
      { rank: 7, name: 'روان حسن ابراهيم عبدالمطلب السنتريسى', totalScore: 1444, percentage: 90.25, grade: 'ممتاز' },
      { rank: 8, name: 'مريم خالد شريف محمد', totalScore: 1437, percentage: 89.81, grade: 'ممتاز' },
      { rank: 9, name: 'مى احمد محمد احمد الكريدى', totalScore: 1428, percentage: 89.25, grade: 'ممتاز' },
      { rank: 10, name: 'ميار ابراهيم عبداللطيف ابراهيم منصور', totalScore: 1425, percentage: 89.06, grade: 'ممتاز' },
    ],
    industrialControlSystems: [
      { rank: 1, name: 'محمد احمد محمد شحاته السيد', totalScore: 1498, percentage: 93.62, grade: 'ممتاز' },
      { rank: 2, name: 'عبدالرحمن على بيومى حنفى', totalScore: 1489, percentage: 93.06, grade: 'ممتاز' },
      { rank: 3, name: 'محمد احمد فتحي علي', totalScore: 1488, percentage: 93, grade: 'ممتاز' },
      { rank: 4, name: 'حازم ياسر عبدالعال محمد محمد', totalScore: 1479, percentage: 92.43, grade: 'ممتاز' },
      { rank: 5, name: 'محمود احمد محمود محمد', totalScore: 1460, percentage: 91.25, grade: 'ممتاز' },
      { rank: 6, name: 'مريم سيد احمد سيد محمد', totalScore: 1445, percentage: 90.31, grade: 'ممتاز' },
      { rank: 7, name: 'مصطفى عيد مصطفى ابراهيم', totalScore: 1442, percentage: 90.12, grade: 'ممتاز' },
      { rank: 8, name: 'احمد سعيد سيد حامد عبدهللا', totalScore: 1434, percentage: 89.62, grade: 'ممتاز' },
      { rank: 9, name: 'يسى مكرم ناجى فؤاد جرجس', totalScore: 1432, percentage: 89.5, grade: 'ممتاز' },
      { rank: 10, name: 'ابراهيم محمد محمد محمد سيد احمد سالمه', totalScore: 1427, percentage: 89.18, grade: 'ممتاز' },
    ],
    autotronics: [
      { rank: 1, name: 'احمد جمال ممدوح حسن ابراهيم', totalScore: 1515, percentage: 94.68, grade: 'ممتاز' },
      { rank: 2, name: 'منه هللا قدرى رزق محمد رزق السيسى', totalScore: 1495, percentage: 93.43, grade: 'ممتاز' },
      { rank: 3, name: 'عمر عبدالنبى محمد محمد اللبان', totalScore: 1494, percentage: 93.37, grade: 'ممتاز' },
      { rank: 4, name: 'محمد خالد محمود عبدالعزيز محمود', totalScore: 1457, percentage: 91.06, grade: 'ممتاز' },
      { rank: 5, name: 'احمد قاسم السيد قاسم', totalScore: 1454, percentage: 90.87, grade: 'ممتاز' },
      { rank: 6, name: 'زياد محمد ناجح فرج عبدالناصر', totalScore: 1453, percentage: 90.81, grade: 'ممتاز' },
      { rank: 7, name: 'ابراهيم محمد حسن عبدالباسط', totalScore: 1449, percentage: 90.56, grade: 'ممتاز' },
      { rank: 8, name: 'معتز محمد عبدالمنعم احمد احمد هاشم', totalScore: 1431, percentage: 89.43, grade: 'ممتاز' },
      { rank: 9, name: 'عبدالرحمن محمد على حسين على', totalScore: 1424, percentage: 89, grade: 'ممتاز' },
      { rank: 10, name: 'عبدالرحمن انس مصيلحى صالح مصطفى', totalScore: 1418, percentage: 88.62, grade: 'ممتاز' },
    ],
    mechatronics: [
      { rank: 1, name: 'عبدهللا حسين عبدهللا رجب', totalScore: 1533, percentage: 95.81, grade: 'ممتاز' },
      { rank: 2, name: 'صفيه هشام مصطفى السعيد بدر', totalScore: 1529, percentage: 95.56, grade: 'ممتاز' },
      { rank: 3, name: 'زياد شعبان محمد محمد موسي', totalScore: 1523, percentage: 95.18, grade: 'ممتاز' },
      { rank: 4, name: 'لوجين هاني سيد احمد', totalScore: 1523, percentage: 95.18, grade: 'ممتاز' },
      { rank: 5, name: 'شيماء رضا عبدالمجيد عبدهللا جاد هللا', totalScore: 1521, percentage: 95.06, grade: 'ممتاز' },
      { rank: 6, name: 'عبير ايمن عيد فرج زهران', totalScore: 1506, percentage: 94.12, grade: 'ممتاز' },
      { rank: 7, name: 'يحيى خالد نعمان امين حسنين', totalScore: 1502, percentage: 93.87, grade: 'ممتاز' },
      { rank: 8, name: 'حازم نزيه على عبدالعزيز', totalScore: 1498, percentage: 93.62, grade: 'ممتاز' },
      { rank: 9, name: 'حسن عالء حسين انور', totalScore: 1497, percentage: 93.56, grade: 'ممتاز' },
      { rank: 10, name: 'جني احمد عبد النبي محمد الغوري', totalScore: 1494, percentage: 93.37, grade: 'ممتاز' },
    ],
  },
};

const ANNOUNCEMENT = 'تتقدَّم إدارة الكلية والجامعة بخالص التهنئة والتقدير لأبنائنا المتفوقين أوائل العام الجامعي 2024 / 2025 من جميع الأقسام العلمية، الذين أثبتوا بتفوقهم وتميّزهم أن الإرادة والاجتهاد هما طريق الريادة.';

function getMedalEmoji(rank: number) {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return null;
}

export default function RankingsPage() {
  const [selectedYear, setSelectedYear] = useState<YearKey>('firstYear');
  const [selectedDept, setSelectedDept] = useState<DeptKey>('artificialIntelligence');

  const students = rankingsData[selectedYear][selectedDept];
  const deptInfo = DEPARTMENTS.find(d => d.key === selectedDept)!;

  return (
    <div className="min-h-screen bg-[#050505]">

      {/* ===== Hero Section ===== */}
      <section className="relative overflow-hidden bg-[#050505] py-32 pt-40">
        {/* Ambient glow orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-[#14b8a6]/10 blur-[120px]" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[#3b82f6]/10 blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[#f59e0b]/5 blur-[150px]" />
        </div>
        {/* Grid overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-5 py-2 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-[#f59e0b] animate-pulse" />
            <span className="text-sm font-medium text-gray-400">العام الجامعي 2024 / 2025</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            🏆 أوائل{' '}
            <span className="bg-gradient-to-r from-[#f59e0b] via-[#fbbf24] to-[#f59e0b] bg-clip-text text-transparent">
              الطلاب
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {ANNOUNCEMENT}
          </p>
        </div>
      </section>

      {/* ===== Filters & Table ===== */}
      <section className="relative bg-[#050505] py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Year Tabs */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex rounded-2xl border border-white/[0.08] bg-white/[0.03] p-1.5 gap-1 backdrop-blur-xl">
              {YEAR_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedYear(tab.key)}
                  className={`rounded-xl px-5 sm:px-8 py-2.5 text-sm font-bold transition-all duration-300 ${
                    selectedYear === tab.key
                      ? 'bg-gradient-to-r from-[#14b8a6] to-[#3b82f6] text-white shadow-lg shadow-[#14b8a6]/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Department Chips */}
          <div className="mb-10 overflow-x-auto scrollbar-hide pb-2">
            <div className="flex gap-3 justify-center flex-wrap">
              {DEPARTMENTS.map((dept) => (
                <button
                  key={dept.key}
                  onClick={() => setSelectedDept(dept.key)}
                  className={`shrink-0 inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold transition-all duration-300 border ${
                    selectedDept === dept.key
                      ? 'bg-gradient-to-r from-[#14b8a6] to-[#3b82f6] text-white border-transparent shadow-lg shadow-[#14b8a6]/20'
                      : 'border-white/[0.08] bg-white/[0.03] text-gray-400 hover:border-[#14b8a6]/30 hover:text-gray-300 hover:bg-white/[0.05]'
                  }`}
                >
                  <span className="text-lg">{dept.icon}</span>
                  {dept.nameAr}
                </button>
              ))}
            </div>
          </div>

          {/* Current Selection Header */}
          <motion.div
            key={`${selectedYear}-${selectedDept}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
              <span className="text-3xl ml-2">{deptInfo.icon}</span>
              {deptInfo.nameAr}
            </h2>
            <p className="text-gray-500">
              {YEAR_TABS.find(t => t.key === selectedYear)?.label} — أعلى 10 طلاب
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={() => exportRankingsPDF(students as RankingStudent[], deptInfo.nameAr, YEAR_TABS.find(t => t.key === selectedYear)?.label ?? '')}
                className="flex items-center gap-2 bg-gradient-to-r from-[#14b8a6] to-[#3b82f6] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#14b8a6]/25 transition-all duration-300"
              >
                <Download className="w-4 h-4" /> تصدير PDF
              </button>
              <button
                onClick={() => {
                  const yearLabel = YEAR_TABS.find(t => t.key === selectedYear)?.label ?? '';
                  const yearExportData: Record<string, { department: string; students: RankingStudent[] }[]> = {
                    [yearLabel]: DEPARTMENTS.map(d => ({
                      department: d.nameAr,
                      students: rankingsData[selectedYear][d.key] as RankingStudent[],
                    })),
                  };
                  exportRankingsExcel(yearExportData);
                }}
                className="flex items-center gap-2 bg-white/[0.05] border border-white/[0.08] text-gray-300 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-300"
              >
                <FileSpreadsheet className="w-4 h-4" /> تصدير Excel
              </button>
            </div>
          </motion.div>

          {/* Rankings Table */}
          <motion.div
            key={`table-${selectedYear}-${selectedDept}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl border border-white/[0.08] bg-[#111111]/80 backdrop-blur-xl overflow-hidden"
          >
            {/* Table Header */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 bg-gradient-to-r from-[#14b8a6] to-[#3b82f6] text-white text-sm font-bold">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-5">اسم الطالب</div>
              <div className="col-span-2 text-center">المجموع</div>
              <div className="col-span-2 text-center">النسبة المئوية</div>
              <div className="col-span-2 text-center">التقدير</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-white/[0.05]">
              {students.map((student, index) => {
                const medal = getMedalEmoji(student.rank);
                const isTopThree = student.rank <= 3;
                return (
                  <motion.div
                    key={student.rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-6 py-4 sm:py-3.5 items-center hover:bg-white/[0.03] transition-colors duration-200 ${
                      isTopThree ? 'bg-[#f59e0b]/[0.03]' : ''
                    }`}
                  >
                    {/* Rank */}
                    <div className="sm:col-span-1 flex items-center justify-center">
                      {medal ? (
                        <span className="text-2xl">{medal}</span>
                      ) : (
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.05] text-sm font-bold text-gray-400">
                          {student.rank}
                        </span>
                      )}
                    </div>

                    {/* Name */}
                    <div className="sm:col-span-5 text-center sm:text-right">
                      <span className={`font-bold ${
                        isTopThree ? 'text-white text-base' : 'text-gray-300 text-sm'
                      }`}>
                        {student.name}
                      </span>
                    </div>

                    {/* Score */}
                    <div className="sm:col-span-2 text-center">
                      <span className="inline-flex items-center rounded-lg bg-white/[0.05] px-3 py-1 text-sm font-bold text-gray-300">
                        {student.totalScore}
                      </span>
                    </div>

                    {/* Percentage */}
                    <div className="sm:col-span-2 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <div className="h-2 w-16 rounded-full bg-white/[0.08] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#14b8a6] to-[#3b82f6]"
                            style={{ width: `${student.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-gray-300">{student.percentage}%</span>
                      </div>
                    </div>

                    {/* Grade */}
                    <div className="sm:col-span-2 text-center">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
                        student.grade === 'ممتاز'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-[#3b82f6]/10 text-[#60a5fa] border border-[#3b82f6]/20'
                      }`}>
                        {student.grade}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
