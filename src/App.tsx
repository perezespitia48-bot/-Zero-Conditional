/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  BookOpen,
  Layers,
  KeyRound,
  Volume2,
  VolumeX,
  Compass,
  GraduationCap,
  ShieldCheck,
  CalendarClock,
  Flame,
} from 'lucide-react';
import { ALL_SENTENCES, CURATED_BUILDER_SENTENCES } from './data/sentences';
import { InteractiveTutor } from './components/InteractiveTutor';
import { InteractiveImageHub } from './components/InteractiveImageHub';
import { QuizGame } from './components/QuizGame';
import { SortingGame } from './components/SortingGame';
import { SentenceBuilder } from './components/SentenceBuilder';
import { AnswerKeyView } from './components/AnswerKeyView';
import { TutorId, TutorMood } from './types/grammar';
import { soundManager } from './utils/audio';

type ActiveView = 'scene' | 'quiz' | 'sorting' | 'builder' | 'answers';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('scene');
  const [currentTutorId, setCurrentTutorId] = useState<TutorId>('ana');
  const [tutorMood, setTutorMood] = useState<TutorMood>('explaining');
  const [customTutorFeedback, setCustomTutorFeedback] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Overall player stats
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    soundManager.setSoundEnabled(newState);
    if (newState) soundManager.playSuccess();
  };

  const handleQuizAnswer = (isCorrect: boolean) => {
    setTotalAttempts((prev) => prev + 1);
    if (isCorrect) {
      setTotalCorrect((prev) => prev + 1);
      setTutorMood('celebrating');
    } else {
      setTutorMood('supportive');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5EEFB] via-[#F0FDF4] to-[#FFF7ED] text-[#0F172A] flex flex-col font-sans selection:bg-[#E0E7FF] selection:text-[#3730A3]">
      {/* 1. TOP BAR CONTRACT: Zone 1 (Wordmark) - Zone 2 (Nav Links) - Zone 3 (Primary Action) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-indigo-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="/"
            className="text-lg font-black tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2.5 font-display"
          >
            <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-emerald-500 flex items-center justify-center text-white text-base shadow-md">
              ⚡
            </span>
            <span className="bg-gradient-to-r from-violet-700 via-indigo-700 to-emerald-600 bg-clip-text text-transparent font-extrabold">
              Teacher Ana Espitia
            </span>
          </a>

          {/* Zone 2: Vibrant, color-coded section buttons (exact section requested by user) */}
          <nav className="hidden md:flex items-center gap-2 text-xs font-black">
            <button
              onClick={() => setActiveView('scene')}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 border-2 ${
                activeView === 'scene'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-violet-400 shadow-md shadow-violet-500/30 scale-105'
                  : 'bg-violet-50/90 text-violet-800 border-violet-200 hover:bg-violet-100 hover:border-violet-400'
              }`}
            >
              <span>🧪</span>
              <span>Grammar Lab</span>
            </button>

            <button
              onClick={() => setActiveView('quiz')}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 border-2 ${
                activeView === 'quiz'
                  ? 'bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white border-fuchsia-400 shadow-md shadow-fuchsia-500/30 scale-105'
                  : 'bg-fuchsia-50/90 text-fuchsia-800 border-fuchsia-200 hover:bg-fuchsia-100 hover:border-fuchsia-400'
              }`}
            >
              <span>📝</span>
              <span>Interactive Quiz</span>
            </button>

            <button
              onClick={() => setActiveView('sorting')}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 border-2 ${
                activeView === 'sorting'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400 shadow-md shadow-emerald-500/30 scale-105'
                  : 'bg-emerald-50/90 text-emerald-800 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-400'
              }`}
            >
              <span>⚔️</span>
              <span>Zero vs First Arena</span>
            </button>

            <button
              onClick={() => setActiveView('builder')}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 border-2 ${
                activeView === 'builder'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white border-amber-400 shadow-md shadow-orange-500/30 scale-105'
                  : 'bg-amber-50/90 text-amber-900 border-amber-200 hover:bg-amber-100 hover:border-amber-400'
              }`}
            >
              <span>🧩</span>
              <span>Sentence Builder</span>
            </button>

            <button
              onClick={() => setActiveView('answers')}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 border-2 ${
                activeView === 'answers'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-blue-400 shadow-md shadow-blue-500/30 scale-105'
                  : 'bg-blue-50/90 text-blue-800 border-blue-200 hover:bg-blue-100 hover:border-blue-400'
              }`}
            >
              <span>🔑</span>
              <span>Answer Key</span>
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Mute audio' : 'Enable audio sound effects'}
              className="p-2.5 rounded-xl text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer shadow-xs"
              aria-label="Toggle audio"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-indigo-600" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>

            <button
              onClick={() => setActiveView('answers')}
              className="px-4 py-2 text-xs font-black text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 rounded-xl transition-all whitespace-nowrap shrink-0 shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Answer Key</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Animated Hero Section with Vibrant Styling */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white p-6 sm:p-10 shadow-2xl border-2 border-indigo-500/30">
          {/* Vibrant glowing background orbs */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-24 w-96 h-96 rounded-full bg-violet-500/25 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            {/* Clean unboxed metadata separator (Zero-Pill Discipline) */}
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-indigo-200 mb-3 font-display">
              <span>English as a Foreign Language</span>
              <span aria-hidden="true" className="text-indigo-400">·</span>
              <span className="text-emerald-300">Level A2 Adult Learning</span>
              <span aria-hidden="true" className="text-indigo-400">·</span>
              <span className="text-amber-300">Teacher Ana Espitia</span>
            </div>

            {/* Continuous Moving Title requested by user */}
            <motion.h1
              animate={{
                y: [0, -7, 0],
                rotate: [0, 0.4, -0.4, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 3.5,
                ease: 'easeInOut',
              }}
              className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] text-balance font-display inline-block"
            >
              Master{' '}
              <motion.span
                animate={{
                  y: [0, -4, 0],
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.8,
                  ease: 'easeInOut',
                }}
                className="inline-block bg-gradient-to-r from-violet-300 via-purple-200 to-pink-300 bg-clip-text text-transparent"
              >
                Zero Conditional
              </motion.span>{' '}
              &{' '}
              <motion.span
                animate={{
                  y: [0, -4, 0],
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.8,
                  delay: 0.3,
                  ease: 'easeInOut',
                }}
                className="inline-block bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent"
              >
                First Conditional
              </motion.span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-3 text-sm sm:text-base text-indigo-100/90 leading-relaxed max-w-2xl font-medium"
            >
              Join Teacher Ana Espitia in 20 authentic university and adult educational scenarios. Discover the crucial difference between permanent classroom rules and probable future consequences with interactive images, live voice audio, and bite-sized feedback.
            </motion.p>

            {/* Quick Interactive Mode Switcher with Ultra-Vibrant Colorful Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-2.5 pt-2">
              <button
                onClick={() => setActiveView('scene')}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer border-2 ${
                  activeView === 'scene'
                    ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white border-violet-300 shadow-xl shadow-violet-500/40 scale-105'
                    : 'bg-violet-950/60 hover:bg-violet-900/80 text-violet-100 border-violet-400/40'
                }`}
              >
                <span>🧪</span>
                <span>Grammar Lab (IF & WILL)</span>
              </button>

              <button
                onClick={() => setActiveView('quiz')}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer border-2 ${
                  activeView === 'quiz'
                    ? 'bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-600 text-white border-fuchsia-300 shadow-xl shadow-fuchsia-500/40 scale-105'
                    : 'bg-fuchsia-950/60 hover:bg-fuchsia-900/80 text-fuchsia-100 border-fuchsia-400/40'
                }`}
              >
                <span>📝</span>
                <span>Quiz (20 Sentences)</span>
              </button>

              <button
                onClick={() => setActiveView('sorting')}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer border-2 ${
                  activeView === 'sorting'
                    ? 'bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 text-white border-emerald-300 shadow-xl shadow-emerald-500/40 scale-105'
                    : 'bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-100 border-emerald-400/40'
                }`}
              >
                <span>⚔️</span>
                <span>Zero vs First Arena</span>
              </button>

              <button
                onClick={() => setActiveView('builder')}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer border-2 ${
                  activeView === 'builder'
                    ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-white border-amber-300 shadow-xl shadow-orange-500/40 scale-105'
                    : 'bg-amber-950/60 hover:bg-amber-900/80 text-amber-100 border-amber-400/40'
                }`}
              >
                <span>🧩</span>
                <span>Sentence Builder (10 Sentences)</span>
              </button>

              <button
                onClick={() => setActiveView('answers')}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer border-2 ${
                  activeView === 'answers'
                    ? 'bg-gradient-to-r from-blue-500 via-indigo-600 to-cyan-500 text-white border-blue-300 shadow-xl shadow-blue-500/40 scale-105'
                    : 'bg-blue-950/60 hover:bg-blue-900/80 text-blue-100 border-blue-400/40'
                }`}
              >
                <span>🔑</span>
                <span>Official Answer Key</span>
              </button>
            </div>
          </div>
        </section>

        {/* Interactive Companion / Tutor Box with Teacher Ana Espitia */}
        <InteractiveTutor
          currentTutorId={currentTutorId}
          onTutorChange={(id) => setCurrentTutorId(id)}
          mood={tutorMood}
          customMessage={customTutorFeedback}
          targetTopic="both"
        />

        {/* Dynamic Activity Workspace */}
        <section className="relative">
          <AnimatePresence mode="wait">
            {activeView === 'scene' && (
              <motion.div
                key="scene"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <InteractiveImageHub
                  onSetTeacherMessage={(msg) => setCustomTutorFeedback(msg)}
                />
              </motion.div>
            )}

            {activeView === 'quiz' && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <QuizGame
                  sentences={ALL_SENTENCES}
                  onAnswerSelected={handleQuizAnswer}
                  onSetTutorFeedback={(feedback) => setCustomTutorFeedback(feedback)}
                />
              </motion.div>
            )}

            {activeView === 'sorting' && (
              <motion.div
                key="sorting"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <SortingGame
                  sentences={ALL_SENTENCES}
                  onSetTutorFeedback={(feedback) => setCustomTutorFeedback(feedback)}
                />
              </motion.div>
            )}

            {activeView === 'builder' && (
              <motion.div
                key="builder"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <SentenceBuilder
                  sentences={CURATED_BUILDER_SENTENCES}
                  onSetTutorFeedback={(feedback) => setCustomTutorFeedback(feedback)}
                />
              </motion.div>
            )}

            {activeView === 'answers' && (
              <motion.div
                key="answers"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <AnswerKeyView />
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Pedagogical Reference Cards with Vibrant Styling */}
        <section className="p-6 rounded-3xl bg-white border-2 border-indigo-100 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-black text-slate-900 text-lg font-display">
                Teacher Ana Espitia's A2 Quick Formula Guide
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                How to distinguish conditionals in real English communication
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <span>CEFR Level A2</span>
              <span>·</span>
              <span>Classroom Context</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-50 border-2 border-violet-200">
              <span className="text-xs font-black text-violet-800 uppercase tracking-wider block mb-1">
                Zero Conditional (Universal Rules & Habits)
              </span>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                Use for events that are <strong>100% predictable, mandatory, or standard routine</strong>: classroom policies, library book loans, campus safety.
              </p>
              <div className="mt-3 text-xs font-mono font-bold text-violet-900 bg-white p-2.5 rounded-xl border border-violet-200 shadow-inner">
                If / When + Present Simple, Present Simple
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200">
              <span className="text-xs font-black text-emerald-800 uppercase tracking-wider block mb-1">
                First Conditional (Future Goals & Outcomes)
              </span>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                Use for a <strong>specific realistic situation in the future</strong>: tomorrow's test, project deadlines, discount forms.
              </p>
              <div className="mt-3 text-xs font-mono font-bold text-emerald-900 bg-white p-2.5 rounded-xl border border-emerald-200 shadow-inner">
                If + Present Simple, will / won't + Base Verb
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Clean, quiet anti-slop footer */}
      <footer className="mt-12 border-t-2 border-indigo-100 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-medium">
            <span className="font-extrabold text-slate-900">Teacher Ana Espitia ESL Academy</span>
            <span>·</span>
            <span>Gamified Conditional Grammar Activity for Adults (A2)</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500 font-medium">
            <span>10 Zero Conditional</span>
            <span>·</span>
            <span>10 First Conditional</span>
            <span>·</span>
            <span>Full Answer Key Included</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
