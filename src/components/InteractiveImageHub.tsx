import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Volume2,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
  BookOpen,
  Layers,
  ShieldCheck,
  CalendarClock,
  Play,
  RotateCcw,
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
    id: 'scen-exam',
    type: 'first',
    title: 'Exam Preparation & High Score',
    categoryBadge: 'First Conditional: Upcoming Test',
    imageUrl: '/src/assets/images/scenario_exam_success_1791767900485.jpg',
    themeColor: {
      badgeBg: 'bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-600',
      border: 'border-fuchsia-500',
      glowRing: 'ring-fuchsia-400',
      cardBg: 'from-fuchsia-100 via-purple-50 to-white',
      activeBorder: 'border-fuchsia-500 shadow-fuchsia-300',
      showcaseBg: 'from-slate-950 via-purple-950 to-fuchsia-950',
      conditionBorder: 'border-fuchsia-400 bg-fuchsia-950/90 text-fuchsia-200',
      resultBorder: 'border-pink-400 bg-pink-950/90 text-pink-200',
      accentGradient: 'from-fuchsia-500 via-purple-600 to-pink-600',
      highlightText: 'text-fuchsia-400',
    },
    fullSentence: 'If you review the grammar summary tonight, you will pass tomorrow’s test with a high score.',
    ifClause: 'If you review the grammar summary tonight',
    resultClause: 'you will pass tomorrow’s test with a high score',
    ifVerb: 'review (Present Simple condition)',
    resultVerb: 'will pass (Future outcome with will)',
    formula: 'If + Present Simple, will + Base Verb',
    whyThisStructure: 'Tomorrow’s test is a specific, real future event. The action happens tonight in the present, while the success will happen tomorrow.',
    exerciseTip: 'Golden Rule: Never say "If you will review". Always put Present Simple directly after "If", and reserve "will pass" for the consequence clause!',
  },
  {
    id: 'scen-laptop',
    type: 'first',
    title: 'Language Tech Workshop',
    categoryBadge: 'First Conditional: Tech Class',
    imageUrl: '/src/assets/images/scenario_laptop_workshop_1791767913147.jpg',
    themeColor: {
      badgeBg: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500',
      border: 'border-emerald-500',
      glowRing: 'ring-emerald-400',
      cardBg: 'from-emerald-100 via-teal-50 to-white',
      activeBorder: 'border-emerald-500 shadow-emerald-300',
      showcaseBg: 'from-slate-950 via-teal-950 to-emerald-950',
      conditionBorder: 'border-teal-400 bg-teal-950/90 text-teal-200',
      resultBorder: 'border-emerald-400 bg-emerald-950/90 text-emerald-200',
      accentGradient: 'from-emerald-500 via-teal-500 to-cyan-500',
      highlightText: 'text-emerald-400',
    },
    fullSentence: 'If students bring their personal laptops to the workshop tomorrow, the instructor will install the speech practice software.',
    ifClause: 'If students bring their personal laptops to the workshop tomorrow',
    resultClause: 'the instructor will install the speech practice software',
    ifVerb: 'bring (Present Simple plural)',
    resultVerb: 'will install (Future with will + base verb)',
    formula: 'If + Present Simple, will + Base Verb',
    whyThisStructure: 'A planned collaborative laboratory tomorrow morning. Bringing laptops directly enables the instructor to install the software.',
    exerciseTip: 'Comma Alert: When the sentence opens with "If", always place an intermediate comma (,) before the main clause ("the instructor will install").',
  },
  {
    id: 'scen-team',
    type: 'first',
    title: 'Team Presentation Collaboration',
    categoryBadge: 'First Conditional: Group Project',
    imageUrl: '/src/assets/images/scenario_team_presentation_1791767923081.jpg',
    themeColor: {
      badgeBg: 'bg-gradient-to-r from-orange-500 via-amber-500 to-red-500',
      border: 'border-orange-500',
      glowRing: 'ring-orange-400',
      cardBg: 'from-orange-100 via-amber-50 to-white',
      activeBorder: 'border-orange-500 shadow-orange-300',
      showcaseBg: 'from-slate-950 via-amber-950 to-orange-950',
      conditionBorder: 'border-amber-400 bg-amber-950/90 text-amber-200',
      resultBorder: 'border-orange-400 bg-orange-950/90 text-orange-200',
      accentGradient: 'from-orange-500 via-amber-500 to-rose-500',
      highlightText: 'text-amber-400',
    },
    fullSentence: 'If our study team completes the presentation this afternoon, Teacher Ana will review it before the final submission.',
    ifClause: 'If our study team completes the presentation this afternoon',
    resultClause: 'Teacher Ana will review it before the final submission',
    ifVerb: 'completes (Present Simple with 3rd-person -s)',
    resultVerb: 'will review (Future with will + base verb)',
    formula: 'If + Present Simple, will + Base Verb',
    whyThisStructure: 'Ties an immediate afternoon milestone to Teacher Ana’s scheduled future review before the deadline.',
    exerciseTip: 'Third-Person Singular: "Our study team" counts as a single unit (it), so "completes" takes an "-s" before "will review" follows.',
  },
  {
    id: 'scen-library',
    type: 'zero',
    title: 'Campus Library & Attendance Rules',
    categoryBadge: 'Zero Conditional: Campus Rule',
    imageUrl: '/src/assets/images/scenario_library_rules_1791767938572.jpg',
    themeColor: {
      badgeBg: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600',
      border: 'border-blue-500',
      glowRing: 'ring-blue-400',
      cardBg: 'from-blue-100 via-indigo-50 to-white',
      activeBorder: 'border-blue-500 shadow-blue-300',
      showcaseBg: 'from-slate-950 via-blue-950 to-indigo-950',
      conditionBorder: 'border-blue-400 bg-blue-950/90 text-blue-200',
      resultBorder: 'border-indigo-400 bg-indigo-950/90 text-indigo-200',
      accentGradient: 'from-blue-600 via-indigo-600 to-violet-600',
      highlightText: 'text-blue-400',
    },
    fullSentence: 'If you need extra books for the course, the university library lends them for two weeks.',
    ifClause: 'If you need extra books for the course',
    resultClause: 'the university library lends them for two weeks',
    ifVerb: 'need (Present Simple)',
    resultVerb: 'lends (Present Simple with -s)',
    formula: 'If + Present Simple, Present Simple',
    whyThisStructure: 'A permanent institutional borrowing regulation that applies every week. In Zero Conditional, no "will" is used because it is an automatic standing rule.',
    exerciseTip: 'Zero Conditional Check: Both verbs are in the Present Simple ("need" and "lends"). "Library" is singular, so it adds "-s".',
  },
];

export const InteractiveImageHub: React.FC<InteractiveImageHubProps> = ({
  onSetTeacherMessage,
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('scen-exam');
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
    <div className="bg-gradient-to-br from-violet-100 via-pink-50 via-emerald-50 to-amber-100 rounded-3xl border-4 border-indigo-400 p-5 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Top Header with Vibrant Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-3 border-indigo-200">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-4 h-4 rounded-full bg-gradient-to-r from-fuchsia-500 via-orange-500 to-amber-400 animate-ping" />
            <h3 className="font-black text-slate-900 text-xl sm:text-3xl font-display tracking-tight">
              Visual Grammar Studio: Illustrated Scenarios & Structure
            </h3>
          </div>
          <p className="text-xs sm:text-base text-slate-700 mt-1.5 font-bold">
            Explore colorful, representative classroom scenes with step-by-step grammatical breakdowns of <span className="bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white px-2 py-0.5 rounded-lg shadow-xs font-black">"IF"</span> and <span className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-2 py-0.5 rounded-lg shadow-xs font-black">"WILL"</span>.
          </p>
        </div>

        {/* Filter Pills with Rich Gradient Accents */}
        <div className="flex items-center gap-2 p-2 bg-white/95 backdrop-blur-md rounded-2xl border-2 border-indigo-300 shadow-md self-start sm:self-auto">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs ${
              activeFilter === 'all'
                ? 'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white shadow-md scale-105'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            All 4 Scenarios
          </button>
          <button
            onClick={() => setActiveFilter('first')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs ${
              activeFilter === 'first'
                ? 'bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-600 text-white shadow-md scale-105'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            First Conditional (IF + WILL)
          </button>
          <button
            onClick={() => setActiveFilter('zero')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs ${
              activeFilter === 'zero'
                ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-md scale-105'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            Zero Conditional (Rules)
          </button>
        </div>
      </div>

      {/* Dual Grammar Formulas Banner - Ultra Colorful & Striking */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-6">
        {/* First Conditional Formula Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-600 text-white shadow-2xl border-4 border-fuchsia-300 ring-4 ring-fuchsia-200/50 relative overflow-hidden group hover:scale-[1.01] transition-transform">
          <div className="flex items-center justify-between mb-2">
            <span className="px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider bg-white/25 text-white border border-white/40 backdrop-blur-md shadow-xs">
              ⚡ Future Prediction & Plan
            </span>
            <span className="text-xs font-black text-amber-300 font-mono bg-black/20 px-2 py-0.5 rounded-md">
              Formula #1
            </span>
          </div>

          <h4 className="text-xl font-black tracking-tight font-display mt-1">
            First Conditional (Real Future Scenarios)
          </h4>

          <div className="mt-3.5 p-3.5 bg-black/30 backdrop-blur-md rounded-2xl border-2 border-white/30 font-mono text-xs sm:text-sm font-extrabold shadow-inner leading-relaxed">
            <span className="text-amber-300 bg-amber-400/20 px-1.5 py-0.5 rounded border border-amber-300/40">IF</span> + [Present Simple] , [Subject + <span className="text-emerald-300 bg-emerald-400/20 px-1.5 py-0.5 rounded border border-emerald-300/40">WILL / WON’T</span> + Base Verb]
          </div>

          <p className="mt-2.5 text-xs text-pink-100 font-semibold leading-relaxed">
            Use for realistic future events: tomorrow’s exam, group project review, Friday deadline discounts.
          </p>
        </div>

        {/* Zero Conditional Formula Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-teal-500 via-emerald-600 to-cyan-600 text-white shadow-2xl border-4 border-emerald-300 ring-4 ring-emerald-200/50 relative overflow-hidden group hover:scale-[1.01] transition-transform">
          <div className="flex items-center justify-between mb-2">
            <span className="px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider bg-white/25 text-white border border-white/40 backdrop-blur-md shadow-xs">
              🌿 Universal Fact & Routine
            </span>
            <span className="text-xs font-black text-amber-300 font-mono bg-black/20 px-2 py-0.5 rounded-md">
              Formula #2
            </span>
          </div>

          <h4 className="text-xl font-black tracking-tight font-display mt-1">
            Zero Conditional (Classroom Rules & Truths)
          </h4>

          <div className="mt-3.5 p-3.5 bg-black/30 backdrop-blur-md rounded-2xl border-2 border-white/30 font-mono text-xs sm:text-sm font-extrabold shadow-inner leading-relaxed">
            <span className="text-amber-300 bg-amber-400/20 px-1.5 py-0.5 rounded border border-amber-300/40">IF / WHEN</span> + [Present Simple] , [Subject + <span className="text-cyan-200 bg-cyan-400/20 px-1.5 py-0.5 rounded border border-cyan-300/40">Present Simple</span>]
          </div>

          <p className="mt-2.5 text-xs text-teal-100 font-semibold leading-relaxed">
            Use for permanent classroom rules: university library lending, attendance signing, automatic printer operations.
          </p>
        </div>
      </div>

      {/* Representative Image Scenario Cards Gallery - Bursting with Color */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-3.5">
          <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="text-lg">🎯</span>
            <span>Choose a Scenario (Click to Inspect Illustrated Grammar):</span>
          </h4>
          <span className="text-xs font-black text-indigo-700 bg-white px-2.5 py-1 rounded-lg border border-indigo-200 shadow-xs">
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
                className={`group flex flex-col rounded-3xl border-4 overflow-hidden text-left transition-all cursor-pointer shadow-xl hover:-translate-y-2 ${
                  isSelected
                    ? `${scen.themeColor.activeBorder} ring-4 ${scen.themeColor.glowRing} scale-[1.03] bg-white`
                    : `${scen.themeColor.border} bg-white hover:shadow-2xl`
                }`}
              >
                {/* Visual Representative Image with Colored Scrim */}
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src={scen.imageUrl}
                    alt={scen.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  {/* Top Badge */}
                  <div className="absolute top-2.5 left-2.5">
                    <span
                      className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider text-white shadow-lg border border-white/40 ${scen.themeColor.badgeBg}`}
                    >
                      {scen.type === 'first' ? '1st Conditional' : 'Zero Conditional'}
                    </span>
                  </div>

                  {/* Highlight pill indicator */}
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 bg-white text-slate-950 px-2 py-0.5 rounded-lg text-[10px] font-black shadow-md flex items-center gap-1">
                      <span>✓</span>
                      <span>ACTIVE</span>
                    </div>
                  )}
                </div>

                {/* Card Title & Snippet with Vibrant Background */}
                <div className={`p-4 flex-1 flex flex-col justify-between bg-gradient-to-b ${scen.themeColor.cardBg}`}>
                  <div>
                    <h5 className="font-black text-slate-950 text-sm sm:text-base leading-snug group-hover:text-indigo-700 transition-colors">
                      {scen.title}
                    </h5>
                    <p className="text-xs text-slate-600 mt-1 font-semibold line-clamp-2">
                      "{scen.ifClause}..."
                    </p>
                  </div>

                  <div className="mt-3.5 pt-2.5 border-t-2 border-black/10 flex items-center justify-between text-xs font-black">
                    <span className="text-indigo-800">Inspect Deep Breakdown</span>
                    <span className="w-6 h-6 rounded-full bg-white shadow-xs flex items-center justify-center text-slate-800 group-hover:translate-x-1 transition-transform">
                      ➔
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Deep-Dive Educational Showcase - Maximum Vibrant Visual Impact */}
      <motion.div
        key={selectedScenario.id}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`mt-8 rounded-3xl bg-gradient-to-br ${selectedScenario.themeColor.showcaseBg} text-white p-6 sm:p-8 shadow-2xl border-4 ${selectedScenario.themeColor.border} relative overflow-hidden`}
      >
        {/* Dynamic Glowing Ambient Flares */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-fuchsia-500/30 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-cyan-500/30 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-7 items-center">
          {/* Representative Image Spotlight */}
          <div className="lg:col-span-5">
            <div className={`relative rounded-3xl overflow-hidden border-4 ${selectedScenario.themeColor.border} shadow-2xl group`}>
              <img
                src={selectedScenario.imageUrl}
                alt={selectedScenario.title}
                className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-2.5 left-2.5 right-2.5 p-3 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-white/30 text-xs flex items-center justify-between shadow-lg">
                <span className="font-black text-amber-300">
                  {selectedScenario.categoryBadge}
                </span>
                <button
                  onClick={() => handleSpeak(selectedScenario.fullSentence)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-white text-slate-950 hover:bg-slate-200 transition-colors flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 text-indigo-700" />
                  <span>Listen Voice</span>
                </button>
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
                <span className="text-xs font-black text-amber-300 bg-white/10 px-2.5 py-1 rounded-lg border border-white/20">
                  {selectedScenario.type === 'first' ? 'First Conditional (IF + WILL)' : 'Zero Conditional (RULE)'}
                </span>
              </div>

              <h4 className="text-xl sm:text-2xl font-black text-white font-display leading-snug">
                "{selectedScenario.fullSentence}"
              </h4>

              {/* Color-Coded Clause Analysis Cards with Glowing Borders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-5">
                {/* Condition Card */}
                <div className={`p-4 rounded-2xl border-3 ${selectedScenario.themeColor.conditionBorder} shadow-lg`}>
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 block mb-1">
                    1. Condition Clause (Present Simple)
                  </span>
                  <p className="text-sm font-black text-white">
                    "{selectedScenario.ifClause},"
                  </p>
                  <div className="mt-2 text-xs font-mono text-white bg-black/40 p-2 rounded-xl border border-white/20">
                    Verb: <span className="font-black text-amber-300">{selectedScenario.ifVerb}</span>
                  </div>
                </div>

                {/* Result Card */}
                <div className={`p-4 rounded-2xl border-3 ${selectedScenario.themeColor.resultBorder} shadow-lg`}>
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-300 block mb-1">
                    2. Result Clause ({selectedScenario.type === 'first' ? 'WILL + Base Verb' : 'Present Simple'})
                  </span>
                  <p className="text-sm font-black text-white">
                    "{selectedScenario.resultClause}."
                  </p>
                  <div className="mt-2 text-xs font-mono text-white bg-black/40 p-2 rounded-xl border border-white/20">
                    Verb: <span className="font-black text-emerald-300">{selectedScenario.resultVerb}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Teacher Ana Espitia's Advice Box - Saturated Color */}
            <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/30 via-orange-500/30 to-fuchsia-500/30 border-3 border-amber-400 text-xs shadow-xl">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-md">
                  💡
                </div>
                <div>
                  <h6 className="font-black text-amber-300 text-xs uppercase tracking-wider">
                    Teacher Ana Espitia's Strategy for Exercises:
                  </h6>
                  <p className="text-white font-bold mt-1 leading-relaxed">
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
