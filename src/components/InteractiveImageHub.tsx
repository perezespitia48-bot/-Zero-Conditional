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
    id: 'scen-exam',
    type: 'first',
    title: 'Exam Preparation & High Score',
    categoryBadge: 'First Conditional: Upcoming Test',
    imageUrl: '/src/assets/images/scenario_exam_success_1791767900485.jpg',
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
      border: 'border-amber-500/60',
      glowRing: 'ring-amber-500/50',
      cardBg: 'from-[#1C1206] via-[#140D04] to-[#0A0602]',
      activeBorder: 'border-amber-400 shadow-xl shadow-amber-950/80',
      showcaseBg: 'from-[#190F05] via-[#100A03] to-[#080501]',
      conditionBorder: 'border-amber-500/60 bg-amber-950/70 text-amber-200',
      resultBorder: 'border-orange-500/60 bg-orange-950/70 text-orange-200',
      accentGradient: 'from-orange-500 via-amber-500 to-red-500',
      highlightText: 'text-amber-300',
    },
    fullSentence: 'If the team finishes the slide deck before 5 PM today, Teacher Ana will review their speaking notes.',
    ifClause: 'If the team finishes the slide deck before 5 PM today',
    resultClause: 'Teacher Ana will review their speaking notes',
    ifVerb: 'finishes (Present Simple 3rd person singular)',
    resultVerb: 'will review (Future outcome with will)',
    formula: 'If + Present Simple, will + Base Verb',
    whyThisStructure: 'A project milestone happening this afternoon. Finishing slides by 5 PM guarantees the teacher will review their work.',
    exerciseTip: 'Subject-Verb Agreement Alert: Notice "finishes" with an -es because "the team" is treated as a collective singular unit here.',
  },
  {
    id: 'scen-library',
    type: 'zero',
    title: 'University Library Lending Policy',
    categoryBadge: 'Zero Conditional: Campus Rule',
    imageUrl: '/src/assets/images/scenario_library_rules_1791767938572.jpg',
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
    fullSentence: 'If you scan your university badge at the turnstile, the digital gate opens automatically.',
    ifClause: 'If you scan your university badge at the turnstile',
    resultClause: 'the digital gate opens automatically',
    ifVerb: 'scan (Present Simple)',
    resultVerb: 'opens (Present Simple with -s)',
    formula: 'If / When + Present Simple, Present Simple',
    whyThisStructure: 'A permanent mechanical rule & security law. It happens 100% of the time, not just tomorrow or in the future.',
    exerciseTip: 'Zero Conditional Reality: Both clauses use Present Simple. Never use "will open" for permanent automatic classroom rules!',
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
    <div className="bg-[#05070E] rounded-3xl border-2 border-slate-800 p-5 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Top Header with Dark Glass Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-violet-500 animate-pulse shadow-lg shadow-fuchsia-500/50" />
            <h3 className="font-black text-white text-xl sm:text-3xl font-display tracking-tight">
              Visual Grammar Studio: Illustrated Scenarios & Structure
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
                {/* Visual Representative Image with Colored Scrim */}
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-black">
                  <img
                    src={scen.imageUrl}
                    alt={scen.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                    referrerPolicy="no-referrer"
                  />
                  {/* Top Badge */}
                  <div className="absolute top-2.5 left-2.5">
                    <span
                      className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider text-white shadow-lg border border-white/20 ${scen.themeColor.badgeBg}`}
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

                {/* Card Title & Snippet with Deep Dark Background */}
                <div className={`p-4 flex-1 flex flex-col justify-between bg-gradient-to-b ${scen.themeColor.cardBg}`}>
                  <div>
                    <h5 className="font-black text-white text-sm sm:text-base leading-snug group-hover:text-indigo-300 transition-colors">
                      {scen.title}
                    </h5>
                    <p className="text-xs text-slate-300 mt-1 font-medium line-clamp-2">
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
          {/* Representative Image Spotlight */}
          <div className="lg:col-span-5">
            <div className={`relative rounded-3xl overflow-hidden border-2 ${selectedScenario.themeColor.border} shadow-2xl group`}>
              <img
                src={selectedScenario.imageUrl}
                alt={selectedScenario.title}
                className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-2.5 left-2.5 right-2.5 p-3 rounded-2xl bg-black/90 backdrop-blur-md border border-slate-700 text-xs flex items-center justify-between shadow-xl">
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
