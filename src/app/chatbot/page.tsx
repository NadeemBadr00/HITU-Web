'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Sparkles } from 'lucide-react';
interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const SUGGESTED_QUESTIONS = [
  'ما هي أقسام الجامعة؟',
  'ما هي مصاريف الكلية؟',
  'ما هو نظام الدراسة 2+2؟',
  'من هو عميد الكلية؟',
  'ما هي شروط القبول؟',
  'ما هي مجالات العمل لقسم AI؟',
];

const SYSTEM_PROMPT = `أنت مساعد ذكي متقدم بتتكلم باللهجة المصرية العامية. مهمتك هي مساعدة طلاب جامعة حلوان التكنولوجية الدولية. جاوب على جميع الاسئلة حتى لو ملهاش علاقة بالجامعة.

**قواعد الرد:**
1. كن مختصراً ومباشراً.
2. بعد كل إجابة، اقترح 2-3 أسئلة متابعة ذات صلة.
3. لو الإجابة فيها بيانات منظمة (أسماء طلاب، مواد دراسية) استخدم تنسيق جدول ماركدوان.

**معلومات الجامعة:**
- الاسم: جامعة حلوان التكنولوجية الدولية (HITU - Helwan International Technological University)
- كان اسمها "جامعة مصر التكنولوجية الدولية" واتغير لـ"جامعة حلوان التكنولوجية الدولية"
- الإشراف اتنقل لجامعة حلوان عشان تدعمها أكاديمياً وإدارياً

**النظام الأكاديمي:**
- نظام "2+2": أول سنتين بتاخد فيهم دبلوم فوق متوسط وتقدر تشتغل بيه، وبعدين ممكن تكمل سنتين كمان عشان تاخد بكالوريوس تكنولوجي

**التخصصات (7 أقسام):**
1. الذكاء الاصطناعي (AI)
2. علوم البيانات (DS - Data Science)
3. الأمن السيبراني (CS - Cybersecurity)
4. أوتوترونكس (AUTO - Autotronics)
5. ميكاترونكس (MECH - Mechatronics)
6. أنظمة التحكم الصناعي (IAC - Industrial Automation Control)
7. تكنولوجيا صناعة الملابس الجاهزة (RGT - Garment Technology)

**المصاريف الدراسية:**
- أول سنتين (مرحلة الدبلوم): 15 ألف جنيه في السنة
- تاني سنتين (مرحلة البكالوريوس): 20 ألف جنيه في السنة
- القسط الأول للطلاب الجدد: 8200 جنيه (7500 مصروفات + 700 منصة الكتاب الإلكتروني)

**القبول:**
- بتقبل طلاب من مدارس التكنولوجيا التطبيقية بنسبة معينة
- مقرها في مجمع الأميرية التابع لجامعة حلوان
- فرع السواح: شارع السواح — منطقة الزيتون — القاهرة

**إدارة الجامعة:**
- رئيس الجامعة: د. السيد قنديل
- نائب رئيس الجامعة لشؤون التعليم والطلاب: د. حسام رفاعي
- المشرف الأكاديمي: د. أحمد بنداري
- عميد الكلية التكنولوجية: د. أسامة القبيصي
- وكيل الكلية: د. حلمي الزغبي
- رئيس اتحاد الطلاب: محمد عمرو
- نائب رئيس الاتحاد: محمود أحمد خلف

**إنجاز مهم:** فوز فريق من طلاب الكلية في مسابقة ATC الصينية في مجال تطوير تطبيقات الموبايل — المركز السادس جماعياً كجامعة ممثلة لمصر في أفريقيا.
الفريق: محمود أحمد خلف، محمود أحمد سيد، بسمة حسين. تحت إشراف م. محمد عمار.
بسمة حسين حصلت على المركز الخامس فردياً على مستوى القارة.

أجب على الأسئلة بشكل مفصل ومفيد. إذا لم تكن متأكداً من معلومة، قل ذلك بوضوح.`;

const API_KEYS = (process.env.NEXT_PUBLIC_GEMINI_KEYS || '').split(',').filter(Boolean);
function getNextKey() {
  const randomIndex = Math.floor(Math.random() * API_KEYS.length);
  return API_KEYS[randomIndex];
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setShowSuggestions(false);
    setIsLoading(true);

    try {
      let data = null;
      let botText = 'عذراً، لم أتمكن من الإجابة. حاول مرة أخرى.';
      let fetchSuccess = false;

      // Try up to 8 different API keys randomly, skip to next if one fails
      const triedKeys = new Set<string>();
      for (let attempt = 0; attempt < API_KEYS.length; attempt++) {
        let apiKey = getNextKey();
        // Avoid retrying the same key
        while (triedKeys.has(apiKey) && triedKeys.size < API_KEYS.length) {
          apiKey = getNextKey();
        }
        triedKeys.add(apiKey);
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              systemInstruction: {
                parts: [{ text: SYSTEM_PROMPT }]
              },
              contents: (() => {
                const history = [...messages, { role: 'user' as const, content: text.trim(), id: '', timestamp: new Date() }]
                  .filter(msg => msg.content !== 'عذراً، حدث خطأ في الاتصال. تأكد من اتصالك بالإنترنت وحاول مرة أخرى.');
                
                const formatted: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];
                for (const msg of history) {
                  const role = msg.role === 'user' ? 'user' : 'model';
                  if (formatted.length === 0) {
                    if (role === 'user') formatted.push({ role, parts: [{ text: msg.content }] });
                  } else {
                    if (formatted[formatted.length - 1].role === role) {
                      formatted[formatted.length - 1].parts[0].text += '\n\n' + msg.content;
                    } else {
                      formatted.push({ role, parts: [{ text: msg.content }] });
                    }
                  }
                }
                return formatted;
              })(),
              generationConfig: {
                maxOutputTokens: 2048,
              },
            }),
          }
        );

        if (response.ok) {
          data = await response.json();
          botText = data?.candidates?.[0]?.content?.parts?.[0]?.text || botText;
          fetchSuccess = true;
          break; // Success! exit loop
        }
      }

      if (!fetchSuccess) {
        throw new Error('All API keys failed');
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: botText,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: 'عذراً، حدث خطأ في الاتصال. تأكد من اتصالك بالإنترنت وحاول مرة أخرى.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-[#050505] overflow-hidden">
{/* ===== Chat Area ===== */}
      <div className="flex-1 flex flex-col pb-0 relative overflow-hidden">
        {/* Background Glow Effects */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#8b5cf6]/[0.06] blur-[150px] rounded-full" />
          <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-[#2dd4bf]/[0.04] blur-[120px] rounded-full" />
        </div>

        {/* Messages Container */}
        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar relative z-10">
          <div className="mx-auto max-w-3xl space-y-5 pb-6">
            {/* ===== Welcome State ===== */}
            {messages.length === 0 && showSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center min-h-[60vh] text-center"
              >
                {/* AI Avatar with Glow */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                  className="relative mb-8"
                >
                  <div className="absolute inset-0 bg-white/20 dark:bg-[#14b8a6]/20 blur-2xl rounded-full animate-pulse-glow" />
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-transparent overflow-hidden shadow-2xl shadow-black/10 p-0">
                    <Image src="/logo.png" alt="HITU Logo" width={96} height={96} className="object-cover drop-shadow-md" />
                  </div>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl sm:text-4xl font-black text-white mb-3"
                >
                  المساعد الذكي{' '}
                  <span className="text-gradient-brand">HITU</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-400 text-lg mb-10 max-w-md"
                >
                  اسألني أي سؤال عن الجامعة، الأقسام، القبول، أو أي شيء آخر
                </motion.p>

                {/* Suggested Questions Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl"
                >
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + i * 0.08 }}
                      onClick={() => sendMessage(q)}
                      className="group flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm px-5 py-4 text-right text-sm text-gray-300 hover:bg-white/[0.06] hover:border-[#8b5cf6]/30 hover:text-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6]/50"
                    >
                      <Sparkles className="h-4 w-4 text-[#8b5cf6] shrink-0 group-hover:text-[#a78bfa] transition-colors" />
                      {q}
                    </motion.button>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* ===== Message Bubbles ===== */}
            <AnimatePresence mode="popLayout">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div className={`shrink-0 flex h-9 w-9 items-center justify-center shadow-lg ${
                    msg.role === 'user'
                      ? 'rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#0d9488] shadow-[#14b8a6]/20'
                      : 'rounded-full bg-transparent overflow-hidden'
                  }`}>
                    {msg.role === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Image src="/logo.png" alt="HITU" width={36} height={36} className="object-cover" />
                    )}
                  </div>

                  {/* Bubble */}
                  <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-[#14b8a6] to-[#0d9488] text-white rounded-br-md shadow-lg shadow-[#14b8a6]/15'
                      : 'bg-[#111111]/80 backdrop-blur-xl border border-white/[0.08] text-gray-100 rounded-bl-md'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    <p className={`text-[10px] mt-2 ${
                      msg.role === 'user' ? 'text-white/60' : 'text-gray-500'
                    }`}>
                      {msg.timestamp.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* ===== Typing Indicator ===== */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 flex-row"
              >
                <div className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-transparent overflow-hidden shadow-lg shadow-black/5">
                  <Image src="/logo.png" alt="HITU" width={36} height={36} className="object-cover opacity-80" />
                </div>
                <div className="rounded-2xl rounded-bl-md bg-white border border-gray-100 shadow-md shadow-black/5 dark:bg-[#111111]/80 dark:backdrop-blur-xl dark:border-white/[0.08] px-5 py-4">
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#14b8a6] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 rounded-full bg-[#14b8a6] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 rounded-full bg-[#14b8a6] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* ===== Input Area ===== */}
        <div className="sticky bottom-0 border-t border-white/[0.06] bg-[#050505]/90 backdrop-blur-2xl px-4 py-4 z-10">
          <div className="mx-auto max-w-3xl">
            <div className="relative flex items-end gap-3 rounded-2xl border border-black/10 bg-white shadow-sm dark:border-white/[0.08] dark:bg-[#111111] p-2 focus-within:border-[#14b8a6]/40 focus-within:ring-1 focus-within:ring-[#14b8a6]/20 transition-all duration-300">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="اسأل المساعد الذكي عن الأقسام، القبول، المصاريف، أو أي شيء..."
                rows={1}
                className="flex-1 resize-none bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 px-3 py-2.5 text-sm focus:outline-none max-h-32"
                style={{ direction: 'rtl' }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                aria-label="إرسال الرسالة"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] text-white shadow-lg shadow-[#8b5cf6]/25 hover:shadow-xl hover:shadow-[#8b5cf6]/30 hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6]"
              >
                <Send className="h-4 w-4 rotate-180" />
              </button>
            </div>

            {/* Quick Suggestions Strip */}
            {messages.length > 0 && (
              <div className="flex gap-2 mt-3 px-1 overflow-x-auto custom-scrollbar pb-1">
                {['اقتراح تحسين', 'مقارنة بين الأقسام', 'فرص العمل'].map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(suggestion)}
                    className="text-xs px-3 py-1.5 whitespace-nowrap rounded-full border border-white/[0.08] bg-white/[0.03] text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors focus-visible:ring-1 focus-visible:ring-[#8b5cf6] outline-none"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            <p className="mt-2 text-center text-[11px] text-gray-600">
              مدعوم بالذكاء الاصطناعي من Google Gemini — الإجابات قد لا تكون دقيقة 100%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
