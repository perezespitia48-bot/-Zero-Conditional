import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, RefreshCw, ChevronRight, GraduationCap } from 'lucide-react';
import { TUTORS } from '../data/sentences';
import { TutorId, TutorMood } from '../types/grammar';
import { soundManager } from '../utils/audio';

interface InteractiveTutorProps {
  currentTutorId?: TutorId;
  onTutorChange?: (id: TutorId) => void;
  mood?: TutorMood;
  customMessage?: string;
  targetTopic?: 'zero' | 'first' | 'both';
}

const LESSON_TIPS = [
  {
    character: 'ana' as TutorId,
    title: 'Zero Conditional: Classroom Laws & Facts',
    text: 'Hello! I am Teacher Ana Espitia. We use Zero Conditional for official school rules, scientific truths, and automatic routines. Structure: If / When + Present Simple, Present Simple. Example: "If you arrive late, you sign the sheet."',
    spokenEn: 'Zero Conditional: If you arrive late to class, you sign the attendance sheet. We use Present Simple in both clauses.',
    badge: 'Core Rule',
  },
  {
    character: 'marco' as TutorId,
    title: 'First Conditional: Future Goals & Plans',
    text: 'Hey there! I am Marco. We use First Conditional for probable future situations and realistic plans. Structure: If + Present Simple, will + base verb. Example: "If you study tonight, you will pass tomorrow’s test."',
    spokenEn: 'First Conditional: If you study tonight, you will pass tomorrow\'s test. If plus Present Simple, then will plus base verb.',
    badge: 'Future Plan',
  },
  {
    character: 'ana' as TutorId,
    title: 'Teacher Ana\'s Golden Tip: Third Person (-s)',
    text: 'In level A2, the most common mistake is forgetting the "-s" or "-es" with he, she, and it! Remember: "If the teacher speaks...", "The library lends...", "The document prints...".',
    spokenEn: 'Third person reminder: He, she, and it take an S. If the teacher speaks, the library lends.',
    badge: 'A2 Alert',
  },
  {
    character: 'marco' as TutorId,
    title: 'The Comma Rule (,)',
    text: 'If your sentence starts with "If", you MUST put a comma before the result clause! But if "If" is in the middle, NO comma is needed: "You sign the sheet if you arrive late."',
    spokenEn: 'Comma rule: If at the start needs a comma. If in the middle has no comma.',
    badge: 'Punctuation',
  },
  {
    character: 'ana' as TutorId,
    title: 'When vs. If in Zero Conditional',
    text: 'In Zero Conditional, "When" and "If" can be used interchangeably because the situation is a guaranteed routine: "When the lesson ends, the professor answers questions."',
    spokenEn: 'When the lesson ends, the professor answers individual questions.',
    badge: 'Interchangeable',
  },
  {
    character: 'marco' as TutorId,
    title: 'Never Put "will" after "If"!',
    text: 'Never use "will" inside the "If" clause! Say "If you study tonight", NEVER "If you will study". The word "will" belongs only in the result clause.',
    spokenEn: 'Golden rule: Never put will directly after if. Say if you study, not if you will study.',
    badge: 'Pro Hack',
  },
];

export const InteractiveTutor: React.FC<InteractiveTutorProps> = ({
  currentTutorId = 'ana',
  onTutorChange,
  mood = 'explaining',
  customMessage,
}) => {
  const [activeTutor, setActiveTutor] = useState<TutorId>(currentTutorId);
  const [tipIndex, setTipIndex] = useState(0);
  const [isWaving, setIsWaving] = useState(false);

  const tutor = TUTORS[activeTutor] || TUTORS.ana;
  const currentTip = LESSON_TIPS[tipIndex];

  const handleSwitchTutor = (id: TutorId) => {
    setActiveTutor(id);
    if (onTutorChange) {
      onTutorChange(id);
    }
    const nextIdx = LESSON_TIPS.findIndex((t) => t.character === id);
    if (nextIdx !== -1) setTipIndex(nextIdx);
  };

  const handleNextTip = () => {
    setTipIndex((prev) => (prev + 1) % LESSON_TIPS.length);
  };

  const handleSpeakTip = () => {
    soundManager.speak(currentTip.spokenEn);
  };

  const triggerAvatarWave = () => {
    setIsWaving(true);
    setTimeout(() => setIsWaving(false), 1000);
    soundManager.playSuccess();
  };

  return (
    <div className="relative bg-[#080B14] rounded-3xl border-2 border-slate-800 p-5 sm:p-6 shadow-2xl transition-all">
      {/* Top Header with character switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-violet-400 animate-pulse shadow-sm shadow-violet-400" />
          <span className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-1.5 font-display">
            <GraduationCap className="w-4 h-4 text-violet-400" />
            Interactive Learning Mentors (A2)
          </span>
          <span className="text-xs text-slate-600">·</span>
          <span className="text-xs font-semibold text-slate-400">Live Voice & Direct Explanations</span>
        </div>

        {/* Character switch buttons with sleek dark glass */}
        <div className="flex items-center gap-1.5 bg-[#0D1222] p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => handleSwitchTutor('ana')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTutor === 'ana'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <span>👩‍🏫</span>
            <span>Teacher Ana Espitia</span>
          </button>
          <button
            onClick={() => handleSwitchTutor('marco')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTutor === 'marco'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <span>🎒</span>
            <span>Student Marco</span>
          </button>
        </div>
      </div>

      {/* Main interactive area with character avatar & speech balloon */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Character interactive avatar portrait */}
        <div className="md:col-span-4 flex flex-col items-center text-center">
          <div
            className="relative group cursor-pointer"
            onClick={triggerAvatarWave}
            title="Click me to wave and hear a tip!"
          >
            <motion.div
              animate={isWaving ? { rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.08, 1] } : {}}
              transition={{ duration: 0.6 }}
              className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-2 shadow-2xl transition-all ${
                activeTutor === 'ana'
                  ? 'border-violet-500/80 ring-4 ring-violet-500/20'
                  : 'border-emerald-500/80 ring-4 ring-emerald-500/20'
              }`}
            >
              <img
                src={tutor.avatarUrl}
                alt={tutor.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-108"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* Interactive reaction badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute -bottom-2 -right-1 px-3 py-1 rounded-full text-[11px] font-black bg-black/90 text-white shadow-xl border border-slate-700 flex items-center gap-1"
            >
              <span>✨</span>
              <span>Tap me!</span>
            </motion.div>
          </div>

          <div className="mt-3">
            <h4 className="font-black text-white text-sm sm:text-base">{tutor.name}</h4>
            <p className="text-xs text-slate-400 font-medium max-w-[200px]">{tutor.role}</p>
          </div>
        </div>

        {/* Speech Balloon with sleek black background */}
        <div className="md:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={customMessage ? `custom-${customMessage}` : `${activeTutor}-${tipIndex}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className={`relative rounded-2xl p-5 border-2 shadow-xl ${
                activeTutor === 'ana'
                  ? 'bg-[#0B1024] border-violet-500/40'
                  : 'bg-[#06171B] border-emerald-500/40'
              }`}
            >
              {/* Balloon tail indicator */}
              <div
                className={`hidden md:block absolute -left-2.5 top-9 w-4 h-4 transform rotate-45 border-l-2 border-b-2 ${
                  activeTutor === 'ana'
                    ? 'bg-[#0B1024] border-violet-500/40'
                    : 'bg-[#06171B] border-emerald-500/40'
                }`}
              />

              {/* Header inside balloon */}
              <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg text-white shadow-md ${
                      activeTutor === 'ana'
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-600'
                    }`}
                  >
                    {customMessage ? 'Live Feedback' : currentTip.badge}
                  </span>
                  {!customMessage && (
                    <span className="text-xs font-bold text-slate-200">
                      {currentTip.title}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {!customMessage && (
                    <button
                      onClick={handleSpeakTip}
                      title="Listen audio in English"
                      className="p-1.5 rounded-xl text-slate-300 hover:text-white bg-black/60 hover:bg-black/90 border border-slate-700 shadow-sm transition-colors cursor-pointer"
                      aria-label="Listen speech"
                    >
                      <Volume2 className="w-4 h-4 text-violet-400" />
                    </button>
                  )}
                  {!customMessage && (
                    <button
                      onClick={handleNextTip}
                      title="Next grammar rule"
                      className="p-1.5 rounded-xl text-slate-300 hover:text-white bg-black/60 hover:bg-black/90 border border-slate-700 shadow-sm transition-colors cursor-pointer"
                      aria-label="Next tip"
                    >
                      <RefreshCw className="w-4 h-4 text-violet-400" />
                    </button>
                  )}
                </div>
              </div>

              {/* Message text */}
              <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
                {customMessage || currentTip.text}
              </p>

              {/* Quick action bar */}
              {!customMessage && (
                <div className="mt-3.5 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium text-[11px]">
                    Tip {tipIndex + 1} of {LESSON_TIPS.length}
                  </span>
                  <button
                    onClick={handleNextTip}
                    className="inline-flex items-center gap-1 font-bold text-violet-300 hover:text-violet-200 cursor-pointer"
                  >
                    <span>Next Explanation</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
