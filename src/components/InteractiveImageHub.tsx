import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Volume2,
  BookOpen,
  Eye,
  Flame,
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface InteractiveImageHubProps {
  onSetTeacherMessage?: (msg: string) => void;
}

interface GrammarScenarioItem {
  id: string;
  type: 'first' | 'zero';
  title: string;
  categoryBadge: string;
  imageUrl: string;
  themeColor: {
    badgeBg: string;
    border: string;
    glowRing: string;
    cardBg: string;
    activeBorder: string;
    showcaseBg: string;
    conditionBorder: string;
    resultBorder: string;
    accentGradient: string;
    highlightText: string;
  };
  fullSentence: string;
  ifClause: string;
  resultClause: string;
  ifVerb: string;
  resultVerb: string;
  formula: string;
  whyThisStructure: string;
  exerciseTip: string;
}

const RICH_SCENARIOS: GrammarScenarioItem[] = [
  {
    id: 'scen-water',
    type: 'zero',
    title: 'Scientific Law: Water & Boiling Point',
    categoryBadge: 'Zero Conditional: Scientific Fact',
    imageUrl: '/images/water_boiling.jpg',
    themeColor: {
      badgeBg: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600',
      border: 'border-cyan-500/60',
      glowRing: 'ring-cyan-500/50',
      cardBg: 'from-[#071324] via-[#050D19] to-[#02060D]',
      activeBorder: 'border-cyan-400 shadow-xl shadow-cyan-950/80',
      showcaseBg: 'from-[#061222] via-[#040C17] to-[#02050B]',
      conditionBorder: 'border-cyan-500/60 bg-cyan-950/70 text-cyan-200',
      resultBorder: 'border-blue-500/60 bg-blue-950/70 text-blue-200',
      accentGradient: 'from-blue-600 via-indigo-600 to-cyan-600',
      highlightText: 'text-cyan-300',
    },
    fullSentence: 'If you heat water to 100°C, it boils.',
    ifClause: 'If you heat water to 100°C',
    resultClause: 'it boils',
    ifVerb: 'heat (Present Simple)',
    resultVerb: 'boils (Present Simple 3rd person -s)',
    formula: 'If / When + Present Simple, Present Simple',
    whyThisStructure: 'A universal scientific physical law. It happens 100% of the time, so both clauses stay in Present Simple.',
    exerciseTip: 'Zero Conditional Rule: Both clauses use Present Simple. Never use "will" for universal scientific facts!',
  },
  {
    id: 'scen-rain',
    type: 'first',
    title: 'Weather Plan: Rain & Yellow Umbrella',
    categoryBadge: 'First Conditional: Weather & Action',
    imageUrl: '/images/rain_umbrella.jpg',
    themeColor: {
      badgeBg: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500',
      border: 'border-teal-500/60',
      glowRing: 'ring-teal-500/50',
      cardBg: 'from-[#071C1E] via-[#051314] to-[#03090A]',
      activeBorder: 'border-teal-400 shadow-xl shadow-teal-950/80',
      showcaseBg: 'from-[#051B1D] via-[#031113] to-[#020809]',
      conditionBorder: 'border-teal-500/60 bg-teal-950/70 text-teal-200',
      resultBorder: 'border-emerald-500/60 bg-emerald-950/70 text-emerald-200',
      accentGradient: 'from-emerald-500 via-teal-500 to-cyan-500',
      highlightText: 'text-teal-300',
    },
    fullSentence: 'If it rains tomorrow, I will take an umbrella.',
    ifClause: 'If it rains tomorrow',
    resultClause: 'I will take an umbrella',
    ifVerb: 'rains (Present Simple 3rd person -s)',
    resultVerb: 'will take (Future outcome with will + base verb)',
    formula: 'If + Present Simple, will + Base Verb',
    whyThisStructure: 'A realistic future possibility. The condition uses Present Simple with 3rd-person -s ("rains"), and the consequence uses "will take".',
    exerciseTip: 'Subject-Verb Agreement Alert: Because the subject is "it", add "-s" to "rains". Never say "If it will rain"!',
  },
  {
    id: 'scen-study',
    type: 'first',
    title: 'Exam Preparation & High Score',
    categoryBadge: 'First Conditional: Study Goal',
    imageUrl: '/images/study_success.jpg',
    themeColor: {
      badgeBg: 'bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-600',
      border: 'border-fuchsia-500/60',
      glowRing: 'ring-fuchsia-500/50',
      cardBg: 'from-[#140C24] via-[#0E081A] to-[#07040E]',
      activeBorder: 'border-fuchsia-400 shadow-xl shadow-fuchsia-950/80',
      showcaseBg: 'from-[#120722] via-[#0B0416] to-[#05020B]',
      conditionBorder: 'border-fuchsia-500/60 bg-fuchsia-950/70 text-fuchsia-200',
      resultBorder: 'border-pink-500/60 bg-pink-950/70 text-pink-200',
      accentGradient: 'from-fuchsia-500 via-purple-600 to-pink-600',
      highlightText: 'text-fuchsia-300',
    },
    fullSentence: 'If you study tonight, you will pass tomorrow’s test.',
    ifClause: 'If you study tonight',
    resultClause: 'you will pass tomorrow’s test',
    ifVerb: 'study (Present Simple condition)',
    resultVerb: 'will pass (Future outcome with will)',
    formula: 'If + Present Simple, will + Base Verb',
    whyThisStructure: 'Studying tonight is a realistic present condition that directly produces the positive future result on tomorrow’s test.',
    exerciseTip: 'Golden Rule: Never say "If you will study". Always put Present Simple directly after "If", and reserve "will pass" for the consequence clause!',
  },
  {
    id: 'scen-teacher',
    type: 'zero',
    title: 'Teacher Ana: Daily Speaking Routine',
    categoryBadge: 'Zero Conditional: Habit & Fluency',
    imageUrl: '/images/teacher_ana.jpg',
    themeColor: {
      badgeBg: 'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600',
      border: 'border-violet-500/60',
      glowRing: 'ring-violet-500/50',
      cardBg: 'from-[#180E2B] via-[#10081F] to-[#080410]',
      activeBorder: 'border-violet-400 shadow-xl shadow-violet-950/80',
      showcaseBg: 'from-[#150B28] via-[#0E061C] to-[#07020E]',
      conditionBorder: 'border-violet-500/60 bg-violet-950/70 text-violet-200',
      resultBorder: 'border-purple-500/60 bg-purple-950/70 text-purple-200',
      accentGradient: 'from-violet-600 via-purple-600 to-indigo-600',
      highlightText: 'text-violet-300',
    },
    fullSentence: 'If students practice speaking in class, their fluency improves quickly.',
    ifClause: 'If students practice speaking in class',
    resultClause: 'their fluency improves quickly',
    ifVerb: 'practice (Present Simple plural)',
    resultVerb: 'improves (Present Simple with -s)',
    formula: 'If + Present Simple, Present Simple',
    whyThisStructure: 'A general educational principle and habit: regular classroom practice automatically builds fluency.',
    exerciseTip: 'Both clauses represent a regular habit and reliable truth, which is the heart of Zero Conditional!',
  },
];

export const InteractiveImageHub: React.FC<InteractiveImageHubProps> = ({
  onSetTeacherMessage,
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('scen-water');
  const [activeFilter, setActiveFilter] = useState<'all' | 'first' | 'zero'>('all');

  const selectedScenario =
    RICH_SCENARIOS.find((s) => s.id === selectedScenarioId) || RICH_SCENARIOS[0];

  const filteredScenarios = RICH_SCENARIOS.filter((s) => {
    if (activeFilter === 'all') return true;
    return s.type === activeFilter;
  });

  const handleSelectScenario = (scen: GrammarScenarioItem) => {
    setSelectedScenarioId(scen.id);
    soundManager.playSuccess();
    if (onSetTeacherMessage) {
      onSetTeacherMessage(
        `Teacher Ana Espitia spotlights: "${scen.title}". Notice how '${scen.ifClause}' links with '${scen.resultClause}'!`
      );
    }
  };

  const handleSpeak = (text: string) => {
    soundManager.speak(text);
  };

  return (
    <div className="bg-[#05070E] rounded-3xl border-2 border-slate-800 p-5 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Top Header with Dark Glass Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-violet-500 animate-pulse shadow-lg shadow-fuchsia-500/50" />
            <h3 className="font-black text-white text-xl sm:text-3xl font-display tracking-tight">
              Grammar Studio: Interactive Scenarios & Clause Anatomy
            </h3>
          </div>
          <p className="text-xs sm:text-base text-slate-300 mt-1.5 font-medium">
            Explore authentic university scenarios with step-by-step grammatical breakdowns of{' '}
            <span className="bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white px-2 py-0.5 rounded-lg shadow-sm font-black">
              "IF"
            </span>{' '}
            and{' '}
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-2 py-0.5 rounded-lg shadow-sm font-black">
              "WILL"
            </span>
            .
          </p>
        </div>

        {/* Filter Pills with Dark Glass Aesthetic */}
        <div className="flex items-center gap-1.5 p-1.5 bg-[#0A0E1A] rounded-2xl border border-slate-800 shadow-inner self-start sm:self-auto">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white shadow-lg shadow-fuchsia-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            All 4 Scenarios
          </button>
          <button
            onClick={() => setActiveFilter('first')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeFilter === 'first'
                ? 'bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-600 text-white shadow-lg shadow-fuchsia-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            First Conditional (IF + WILL)
          </button>
          <button
            onClick={() => setActiveFilter('zero')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeFilter === 'zero'
                ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-lg shadow-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Zero Conditional (Rules)
          </button>
        </div>
      </div>

      {/* Dual Grammar Formulas Banner - Ultra Presentable Dark Theme */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-6">
        {/* First Conditional Formula Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#120824] via-[#0C0618] to-[#06030C] text-white shadow-2xl border-2 border-fuchsia-500/40 relative overflow-hidden group hover:border-fuchsia-400 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30">
              ⚡ Future Prediction & Plan
            </span>
            <span className="text-xs font-black text-amber-400 font-mono bg-black/60 px-2 py-0.5 rounded-md border border-amber-500/30">
              Formula #1
            </span>
          </div>

          <h4 className="text-xl font-black tracking-tight font-display mt-1 text-white">
            First Conditional (Real Future Scenarios)
          </h4>

          <div className="mt-3.5 p-3.5 bg-black/80 rounded-2xl border border-fuchsia-500/30 font-mono text-xs sm:text-sm font-extrabold shadow-inner leading-relaxed">
            <span className="text-amber-300 bg-amber-400/20 px-1.5 py-0.5 rounded border border-amber-300/40">IF</span> + [Present Simple] , [Subject + <span className="text-emerald-300 bg-emerald-400/20 px-1.5 py-0.5 rounded border border-emerald-300/40">WILL / WON’T</span> + Base Verb]
          </div>

          <p className="mt-2.5 text-xs text-slate-300 font-medium leading-relaxed">
            Use for realistic future events: tomorrow’s exam, group project review, Friday deadline discounts.
          </p>
        </div>

        {/* Zero Conditional Formula Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#06181C] via-[#041014] to-[#02080A] text-white shadow-2xl border-2 border-teal-500/40 relative overflow-hidden group hover:border-teal-400 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30">
              🌿 Universal Fact & Routine
            </span>
            <span className="text-xs font-black text-amber-400 font-mono bg-black/60 px-2 py-0.5 rounded-md border border-amber-500/30">
              Formula #2
            </span>
          </div>

          <h4 className="text-xl font-black tracking-tight font-display mt-1 text-white">
            Zero Conditional (Classroom Rules & Truths)
          </h4>

          <div className="mt-3.5 p-3.5 bg-black/80 rounded-2xl border border-teal-500/30 font-mono text-xs sm:text-sm font-extrabold shadow-inner leading-relaxed">
            <span className="text-amber-300 bg-amber-400/20 px-1.5 py-0.5 rounded border border-amber-300/40">IF / WHEN</span> + [Present Simple] , [Subject + <span className="text-cyan-300 bg-cyan-400/20 px-1.5 py-0.5 rounded border border-cyan-300/40">Present Simple</span>]
          </div>

          <p className="mt-2.5 text-xs text-slate-300 font-medium leading-relaxed">
            Use for permanent classroom rules: university library lending, attendance signing, automatic printer operations.
          </p>
        </div>
      </div>

      {/* Representative Image Scenario Cards Gallery - Sleek Black & Radiant Accents */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-3.5">
          <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider flex items-center gap-2 font-display">
            <span className="text-lg">🎯</span>
            <span>Choose a Scenario (Click to Inspect Illustrated Grammar):</span>
          </h4>
          <span className="text-xs font-bold text-indigo-300 bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-700/50">
            Interactive Cards
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredScenarios.map((scen) => {
            const isSelected = selectedScenario.id === scen.id;
            return (
              <button
                key={scen.id}
                onClick={() => handleSelectScenario(scen)}
                className={`group flex flex-col rounded-3xl border-2 overflow-hidden text-left transition-all cursor-pointer shadow-xl hover:-translate-y-1.5 ${
                  isSelected
                    ? `${scen.themeColor.activeBorder} ring-2 ${scen.themeColor.glowRing} scale-[1.02] bg-[#0A0E1A]`
                    : `${scen.themeColor.border} bg-[#070A12] hover:shadow-2xl`
                }`}
              >
                {/* Visual Image Thumbnail */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-900 border-b border-slate-800">
                  <img
                    src={scen.imageUrl}
                    alt={scen.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-between p-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider text-white shadow-lg border border-white/20 ${scen.themeColor.badgeBg}`}
                      >
                        {scen.type === 'first' ? '1st Conditional' : 'Zero Conditional'}
                      </span>
                      {isSelected && (
                        <span className="bg-emerald-400 text-slate-950 px-2 py-0.5 rounded-lg text-[10px] font-black shadow-md flex items-center gap-1">
                          <span>✓</span>
                          <span>ACTIVE</span>
                        </span>
                      )}
                    </div>
                    <div className="bg-black/75 backdrop-blur-xs px-2 py-1 rounded-md border border-white/10 self-start">
                      <span className="text-[10px] font-mono font-bold text-amber-300">
                        {scen.formula}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Title & Snippet with Deep Dark Background */}
                <div className={`p-4 flex-1 flex flex-col justify-between bg-gradient-to-b ${scen.themeColor.cardBg}`}>
                  <div>
                    <h5 className="font-black text-white text-sm sm:text-base leading-snug group-hover:text-indigo-300 transition-colors">
                      {scen.title}
                    </h5>
                    <p className="text-xs text-slate-300 mt-2 font-medium line-clamp-2 italic">
                      "{scen.ifClause}..."
                    </p>
                  </div>

                  <div className="mt-3.5 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs font-black">
                    <span className="text-indigo-400">Inspect Deep Breakdown</span>
                    <span className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-200 group-hover:translate-x-1 transition-transform">
                      ➔
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Deep-Dive Educational Showcase - Maximum Sleek Dark Elegance */}
      <motion.div
        key={selectedScenario.id}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`mt-8 rounded-3xl bg-gradient-to-br ${selectedScenario.themeColor.showcaseBg} text-white p-6 sm:p-8 shadow-2xl border-2 ${selectedScenario.themeColor.border} relative overflow-hidden`}
      >
        {/* Dynamic Glowing Ambient Flares */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-fuchsia-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-7 items-center">
          {/* Spotlight Graphic Card with Full Illustrated Scene */}
          <div className="lg:col-span-5 space-y-4">
            <div className={`rounded-3xl border-2 ${selectedScenario.themeColor.border} bg-[#060A14] overflow-hidden shadow-2xl group`}>
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                <img
                  src={selectedScenario.imageUrl}
                  alt={selectedScenario.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="font-black text-[11px] text-amber-300 bg-black/85 backdrop-blur-md border border-amber-500/40 px-3 py-1 rounded-xl shadow-lg">
                    {selectedScenario.categoryBadge}
                  </span>
                  <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase text-white shadow-lg ${selectedScenario.themeColor.badgeBg}`}>
                    {selectedScenario.type === 'first' ? 'Predictive' : 'Scientific Fact'}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-b from-[#0A0F1D] to-[#060A14] border-t border-slate-800 space-y-3">
                <div className="p-3.5 rounded-2xl bg-black/80 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 block mb-0.5 uppercase tracking-wider font-bold">
                    Target Rule Blueprint:
                  </span>
                  <p className="text-xs sm:text-sm font-mono font-black text-amber-300">
                    {selectedScenario.formula}
                  </p>
                  <p className="text-xs text-slate-300 mt-1.5 font-medium leading-relaxed">
                    {selectedScenario.whyThisStructure}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                  <span className="text-xs font-semibold text-slate-400">
                    Pronunciation & Intonation
                  </span>
                  <button
                    onClick={() => handleSpeak(selectedScenario.fullSentence)}
                    className="px-3.5 py-2 rounded-xl text-xs font-black bg-white text-slate-950 hover:bg-slate-200 transition-colors flex items-center gap-1.5 shadow-md cursor-pointer shrink-0"
                  >
                    <Volume2 className="w-4 h-4 text-indigo-700" />
                    <span>Listen Voice</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Grammatical Breakdown & Explanation */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2.5">
                <span
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider text-white shadow-lg ${selectedScenario.themeColor.badgeBg}`}
                >
                  Active Visual Spotlight
                </span>
                <span className="text-xs font-black text-amber-300 bg-black/60 px-2.5 py-1 rounded-lg border border-amber-500/30">
                  {selectedScenario.type === 'first' ? 'First Conditional (IF + WILL)' : 'Zero Conditional (RULE)'}
                </span>
              </div>

              <h4 className="text-xl sm:text-2xl font-black text-white font-display leading-snug">
                "{selectedScenario.fullSentence}"
              </h4>

              {/* Color-Coded Clause Analysis Cards with Glowing Borders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-5">
                {/* Condition Card */}
                <div className={`p-4 rounded-2xl border-2 ${selectedScenario.themeColor.conditionBorder} shadow-lg`}>
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 block mb-1">
                    1. Condition Clause (Present Simple)
                  </span>
                  <p className="text-sm font-black text-white">
                    "{selectedScenario.ifClause},"
                  </p>
                  <div className="mt-2 text-xs font-mono text-white bg-black/60 p-2 rounded-xl border border-white/10">
                    Verb: <span className="font-black text-amber-300">{selectedScenario.ifVerb}</span>
                  </div>
                </div>

                {/* Result Card */}
                <div className={`p-4 rounded-2xl border-2 ${selectedScenario.themeColor.resultBorder} shadow-lg`}>
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-300 block mb-1">
                    2. Result Clause ({selectedScenario.type === 'first' ? 'WILL + Base Verb' : 'Present Simple'})
                  </span>
                  <p className="text-sm font-black text-white">
                    "{selectedScenario.resultClause}."
                  </p>
                  <div className="mt-2 text-xs font-mono text-white bg-black/60 p-2 rounded-xl border border-white/10">
                    Verb: <span className="font-black text-emerald-300">{selectedScenario.resultVerb}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Teacher Ana Espitia's Advice Box */}
            <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-[#090D1A] border-2 border-amber-500/50 text-xs shadow-xl">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-md">
                  💡
                </div>
                <div>
                  <h6 className="font-black text-amber-300 text-xs uppercase tracking-wider">
                    Teacher Ana Espitia's Strategy for Exercises:
                  </h6>
                  <p className="text-slate-200 font-medium mt-1 leading-relaxed">
                    {selectedScenario.exerciseTip}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
