import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, Check, Volume2, Printer, ShieldCheck, CalendarClock } from 'lucide-react';
import { ZERO_CONDITIONAL_SENTENCES, FIRST_CONDITIONAL_SENTENCES } from '../data/sentences';
import { ConditionalType } from '../types/grammar';
import { soundManager } from '../utils/audio';

export const AnswerKeyView: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | ConditionalType>('all');

  const copyFullKeyToClipboard = () => {
    let text = '=== OFFICIAL ANSWER KEY & PEDAGOGICAL REFERENCE SHEET ===\n';
    text += 'TEACHER: Ana Espitia | LEVEL: A2 ESL / EFL | TOPIC: Zero & First Conditional\n\n';

    text += '=================================================================\n';
    text += 'PART 1: 10 ZERO CONDITIONAL SENTENCES (CLASSROOM RULES & ROUTINES)\n';
    text += 'Structure: If / When + Present Simple, Present Simple\n';
    text += '=================================================================\n\n';
    ZERO_CONDITIONAL_SENTENCES.forEach((s, idx) => {
      text += `${idx + 1}. "${s.fullSentence}"\n`;
      text += `   • Context: ${s.context}\n`;
      text += `   • Condition Verb: ${s.verb1}\n`;
      text += `   • Result Verb: ${s.verb2}\n`;
      text += `   • Teacher Ana's Feedback: ${s.microFeedbackEn}\n\n`;
    });

    text += '=================================================================\n';
    text += 'PART 2: 10 FIRST CONDITIONAL SENTENCES (FUTURE PLANS & PREDICTIONS)\n';
    text += 'Structure: If + Present Simple, will + Base Verb\n';
    text += '=================================================================\n\n';
    FIRST_CONDITIONAL_SENTENCES.forEach((s, idx) => {
      text += `${idx + 1}. "${s.fullSentence}"\n`;
      text += `   • Context: ${s.context}\n`;
      text += `   • Condition Verb: ${s.verb1}\n`;
      text += `   • Result Verb: ${s.verb2}\n`;
      text += `   • Teacher Ana's Feedback: ${s.microFeedbackEn}\n\n`;
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    soundManager.playSuccess();
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const displayedSentences = [
    ...(activeTab === 'all' || activeTab === 'zero' ? ZERO_CONDITIONAL_SENTENCES : []),
    ...(activeTab === 'all' || activeTab === 'first' ? FIRST_CONDITIONAL_SENTENCES : []),
  ];

  return (
    <div className="bg-[#070A14] rounded-3xl border-2 border-slate-800 p-5 sm:p-7 shadow-2xl">
      {/* Top Header & Copy Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-400 animate-pulse" />
            <h3 className="font-black text-white text-lg sm:text-xl font-display">
              Teacher Ana Espitia's Official Answer Key & Reference Guide
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Complete grammatical breakdown, verb analysis, and bite-sized pedagogical feedback for all 20 sentences.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={copyFullKeyToClipboard}
            className="px-4 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-violet-500/30"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Full Key</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-[#0D1222] hover:bg-[#151D36] border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Print worksheet"
          >
            <Printer className="w-4 h-4 text-violet-400" />
            <span className="hidden sm:inline">Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Grammar Formula Comparison Cards with Sleek Black Styling */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        {/* Zero Conditional Card */}
        <div className="p-5 rounded-2xl bg-[#0F0A1E] border-2 border-violet-500/40 shadow-xl">
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h4 className="font-black text-white text-base">
                Zero Conditional: Rules & Universal Facts
              </h4>
              <span className="text-[11px] font-bold text-violet-400 uppercase tracking-wider">
                100% Certain / Standard Policy
              </span>
            </div>
          </div>
          <p className="text-xs font-mono font-bold bg-black/70 p-3 rounded-xl border border-violet-500/30 text-slate-200 shadow-inner">
            If / When + <span className="text-violet-300">Present Simple</span>,{' '}
            <span className="text-indigo-300">Present Simple</span>
          </p>
          <p className="text-xs text-slate-300 font-medium mt-2.5 leading-relaxed">
            Used for official classroom regulations, institutional routines, and natural causes. Both clauses take Present Simple.
          </p>
        </div>

        {/* First Conditional Card */}
        <div className="p-5 rounded-2xl bg-[#06181C] border-2 border-teal-500/40 shadow-xl">
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md">
              <CalendarClock className="w-5 h-5" />
            </span>
            <div>
              <h4 className="font-black text-white text-base">
                First Conditional: Real Future Plans & Predictions
              </h4>
              <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider">
                Realistic Future Consequence
              </span>
            </div>
          </div>
          <p className="text-xs font-mono font-bold bg-black/70 p-3 rounded-xl border border-teal-500/30 text-slate-200 shadow-inner">
            If + <span className="text-emerald-300">Present Simple</span>,{' '}
            <span className="text-teal-300">will / won't + Base Verb</span>
          </p>
          <p className="text-xs text-slate-300 font-medium mt-2.5 leading-relaxed">
            Used for specific future possibilities (e.g. tomorrow's test, next Monday's workshop). The condition is in Present Simple, result has will.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-[#0D1222] rounded-2xl border border-slate-800 self-start mb-6">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          All 20 Sentences
        </button>
        <button
          onClick={() => setActiveTab('zero')}
          className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'zero'
              ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          10 Zero Conditional
        </button>
        <button
          onClick={() => setActiveTab('first')}
          className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'first'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          10 First Conditional
        </button>
      </div>

      {/* Sentences Detailed Breakdown List (Sleek Obsidian Cards) */}
      <div className="space-y-4">
        {displayedSentences.map((sentence, idx) => {
          const isZero = sentence.type === 'zero';
          return (
            <motion.div
              key={sentence.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.02 }}
              className={`p-5 rounded-2xl border-2 transition-all shadow-md hover:shadow-xl ${
                isZero
                  ? 'bg-[#0B0F22] border-violet-500/30 hover:border-violet-400/60'
                  : 'bg-[#06151A] border-teal-500/30 hover:border-teal-400/60'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shadow-sm ${
                      isZero
                        ? 'bg-violet-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <h4 className="font-extrabold text-white text-sm sm:text-base">
                    {sentence.title}
                  </h4>
                  <span className="text-xs text-slate-600">·</span>
                  <span className="text-xs font-bold text-slate-400">{sentence.context}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg text-white shadow-sm ${
                      isZero
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-600'
                    }`}
                  >
                    {isZero ? 'Zero Conditional' : 'First Conditional'}
                  </span>

                  <button
                    onClick={() => soundManager.speak(sentence.fullSentence)}
                    title="Listen pronunciation"
                    className="p-1.5 rounded-xl text-slate-300 hover:text-white bg-black/60 border border-slate-700 hover:bg-black/90 shadow-sm transition-colors cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4 text-violet-400" />
                  </button>
                </div>
              </div>

              {/* Full English Sentence */}
              <p className="text-base sm:text-lg font-bold text-white leading-snug font-sans">
                "{sentence.fullSentence}"
              </p>

              {/* Verb Breakdown & Micro-feedback */}
              <div className="mt-3.5 pt-3 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                <div className="p-3 rounded-xl bg-black/60 border border-slate-800 shadow-inner">
                  <span className="font-black text-slate-300 block mb-1">Verb Mechanics:</span>
                  <div className="font-mono text-slate-200 text-[11px] sm:text-xs font-bold">
                    <span className="text-violet-300 bg-violet-950/60 px-2 py-0.5 rounded border border-violet-500/40">
                      {sentence.verb1}
                    </span>
                    <span className="mx-2 text-slate-500">➔</span>
                    <span className="text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
                      {sentence.verb2}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-black/60 border border-slate-800 shadow-inner">
                  <span className="font-black text-slate-300 block mb-1">
                    Teacher Ana Espitia's Key Insight:
                  </span>
                  <p className="text-slate-300 font-medium leading-relaxed">
                    {sentence.microFeedbackEn}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
