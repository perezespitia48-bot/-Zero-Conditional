import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, Check, Volume2, Printer, ShieldCheck, CalendarClock, Sparkles } from 'lucide-react';
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
    <div className="bg-white rounded-3xl border-2 border-indigo-100 p-5 sm:p-7 shadow-lg">
      {/* Top Header & Copy Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-600 animate-pulse" />
            <h3 className="font-black text-slate-900 text-lg sm:text-xl font-display">
              Teacher Ana Espitia's Official Answer Key & Reference Guide
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete grammatical breakdown, verb analysis, and bite-sized pedagogical feedback for all 20 sentences.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={copyFullKeyToClipboard}
            className="px-4 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 transition-all flex items-center gap-2 cursor-pointer shadow-md"
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
            className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Print worksheet"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Grammar Formula Comparison Cards with Vibrant Colors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        {/* Zero Conditional Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-50 via-purple-50/50 to-indigo-50 border-2 border-violet-200 shadow-sm">
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h4 className="font-black text-violet-950 text-base">
                Zero Conditional: Rules & Universal Facts
              </h4>
              <span className="text-[11px] font-bold text-violet-600 uppercase tracking-wider">
                100% Certain / Standard Policy
              </span>
            </div>
          </div>
          <p className="text-xs font-mono font-bold bg-white p-3 rounded-xl border border-violet-200 text-slate-900 shadow-inner">
            If / When + <span className="text-violet-700">Present Simple</span>,{' '}
            <span className="text-indigo-700">Present Simple</span>
          </p>
          <p className="text-xs text-slate-700 font-medium mt-2.5 leading-relaxed">
            Used for official classroom regulations, institutional routines, and natural causes. Both clauses take Present Simple.
          </p>
        </div>

        {/* First Conditional Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/50 to-emerald-50 border-2 border-emerald-200 shadow-sm">
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md">
              <CalendarClock className="w-5 h-5" />
            </span>
            <div>
              <h4 className="font-black text-emerald-950 text-base">
                First Conditional: Real Future Plans & Predictions
              </h4>
              <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                Realistic Future Consequence
              </span>
            </div>
          </div>
          <p className="text-xs font-mono font-bold bg-white p-3 rounded-xl border border-emerald-200 text-slate-900 shadow-inner">
            If + <span className="text-emerald-700">Present Simple</span>,{' '}
            <span className="text-teal-700">will / won't + Base Verb</span>
          </p>
          <p className="text-xs text-slate-700 font-medium mt-2.5 leading-relaxed">
            Used for specific future possibilities (e.g. tomorrow's test, next Monday's workshop). The condition is in Present Simple, result has will.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl self-start mb-6">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All 20 Sentences
        </button>
        <button
          onClick={() => setActiveTab('zero')}
          className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'zero'
              ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          10 Zero Conditional
        </button>
        <button
          onClick={() => setActiveTab('first')}
          className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'first'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          10 First Conditional
        </button>
      </div>

      {/* Sentences Detailed Breakdown List */}
      <div className="space-y-4">
        {displayedSentences.map((sentence, idx) => {
          const isZero = sentence.type === 'zero';
          return (
            <motion.div
              key={sentence.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.02 }}
              className={`p-5 rounded-2xl border-2 transition-all shadow-xs hover:shadow-md ${
                isZero
                  ? 'bg-gradient-to-br from-violet-50/60 to-white border-violet-200/90'
                  : 'bg-gradient-to-br from-emerald-50/60 to-white border-emerald-200/90'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-black/5">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shadow-xs ${
                      isZero
                        ? 'bg-violet-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    {sentence.title}
                  </h4>
                  <span className="text-xs text-slate-300">·</span>
                  <span className="text-xs font-bold text-slate-500">{sentence.context}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg text-white ${
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
                    className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 shadow-xs transition-colors cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4 text-indigo-600" />
                  </button>
                </div>
              </div>

              {/* Full English Sentence */}
              <p className="text-base sm:text-lg font-bold text-slate-900 leading-snug font-sans">
                "{sentence.fullSentence}"
              </p>

              {/* Verb Breakdown & Micro-feedback */}
              <div className="mt-3.5 pt-3 border-t border-black/5 grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-inner">
                  <span className="font-black text-slate-700 block mb-1">Verb Mechanics:</span>
                  <div className="font-mono text-slate-800 text-[11px] sm:text-xs font-bold">
                    <span className="text-violet-700 bg-violet-50 px-2 py-0.5 rounded border border-violet-200">
                      {sentence.verb1}
                    </span>
                    <span className="mx-2 text-slate-400">➔</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {sentence.verb2}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-inner">
                  <span className="font-black text-slate-700 block mb-1">
                    Teacher Ana Espitia's Key Insight:
                  </span>
                  <p className="text-slate-700 font-medium leading-relaxed">
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
