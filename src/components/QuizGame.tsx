import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, Volume2, ArrowRight, RotateCcw, HelpCircle, Sparkles, Flame } from 'lucide-react';
import { SentenceItem, ConditionalType } from '../types/grammar';
import { soundManager } from '../utils/audio';

interface QuizGameProps {
  sentences: SentenceItem[];
  onAnswerSelected?: (isCorrect: boolean, sentence: SentenceItem) => void;
  onSetTutorFeedback?: (feedback: string) => void;
}

export const QuizGame: React.FC<QuizGameProps> = ({
  sentences,
  onAnswerSelected,
  onSetTutorFeedback,
}) => {
  const [filterType, setFilterType] = useState<'all' | ConditionalType>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const filteredSentences = sentences.filter((s) => {
    if (filterType === 'all') return true;
    return s.type === filterType;
  });

  const currentSentence = filteredSentences[currentIndex] || filteredSentences[0];

  const handleSelectOption = (idx: number) => {
    if (hasAnswered) return;
    setSelectedOption(idx);
    setHasAnswered(true);

    const isCorrect = idx === currentSentence.correctOptionIndex;
    if (isCorrect) {
      soundManager.playSuccess();
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
      if (onSetTutorFeedback) {
        onSetTutorFeedback(
          `Teacher Ana Espitia cheers: "Superb! ${currentSentence.microFeedbackEn}"`
        );
      }
    } else {
      soundManager.playError();
      setStreak(0);
      if (onSetTutorFeedback) {
        onSetTutorFeedback(
          `Teacher Ana Espitia notes: "${currentSentence.microFeedbackEn} Remember: ${currentSentence.commonMistakeTip}"`
        );
      }
    }

    if (onAnswerSelected) {
      onAnswerSelected(isCorrect, currentSentence);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setHasAnswered(false);
    setShowHint(false);
    if (currentIndex < filteredSentences.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleListenSentence = () => {
    soundManager.speak(currentSentence.fullSentence);
  };

  if (!currentSentence) return null;

  const isCorrect = selectedOption === currentSentence.correctOptionIndex;

  return (
    <div className="bg-white rounded-3xl border-2 border-indigo-100 p-5 sm:p-7 shadow-lg">
      {/* Category Filter & Progress Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl self-start">
          <button
            onClick={() => {
              setFilterType('all');
              setCurrentIndex(0);
              setHasAnswered(false);
              setSelectedOption(null);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All 20 Sentences
          </button>
          <button
            onClick={() => {
              setFilterType('zero');
              setCurrentIndex(0);
              setHasAnswered(false);
              setSelectedOption(null);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              filterType === 'zero'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Zero Conditional (10)
          </button>
          <button
            onClick={() => {
              setFilterType('first');
              setCurrentIndex(0);
              setHasAnswered(false);
              setSelectedOption(null);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              filterType === 'first'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            First Conditional (10)
          </button>
        </div>

        {/* Stats counter */}
        <div className="flex items-center gap-4 text-xs font-bold text-slate-700">
          <span className="flex items-center gap-1.5">
            <span className="text-slate-400">Progress:</span>
            <span className="font-extrabold text-slate-900 tabular-nums">
              {currentIndex + 1} / {filteredSentences.length}
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-slate-400">Correct:</span>
            <span className="font-extrabold text-emerald-600 tabular-nums">{score}</span>
          </span>
          {streak > 1 && (
            <span className="flex items-center gap-1 text-amber-700 font-extrabold bg-amber-100 px-2.5 py-0.5 rounded-lg border border-amber-300">
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              <span>Streak: {streak}</span>
            </span>
          )}
        </div>
      </div>

      {/* Progress pill indicator */}
      <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-violet-600 via-indigo-600 to-emerald-500"
          initial={{ width: 0 }}
          animate={{
            width: `${((currentIndex + 1) / filteredSentences.length) * 100}%`,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Question Card */}
      <div className="mt-6">
        {/* Context metadata */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 mb-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">{currentSentence.title}</span>
            <span>·</span>
            <span>{currentSentence.context}</span>
          </div>

          <span
            className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider text-white ${
              currentSentence.type === 'zero'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 shadow-xs'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 shadow-xs'
            }`}
          >
            {currentSentence.type === 'zero' ? 'Zero Conditional' : 'First Conditional'}
          </span>
        </div>

        {/* The Sentence with blanks */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50 border-2 border-indigo-100/90 my-3 shadow-inner">
          <p className="text-xl sm:text-2xl font-bold text-slate-900 leading-relaxed font-sans">
            {currentSentence.blankSentence}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={handleListenSentence}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 transition-colors shadow-xs cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Listen Sentence</span>
            </button>

            <button
              onClick={() => setShowHint(!showHint)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-900 bg-amber-100/90 px-3.5 py-1.5 rounded-xl border border-amber-300 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>{showHint ? 'Hide Hint' : 'Show Grammar Hint'}</span>
            </button>
          </div>

          {showHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3.5 p-3.5 bg-white rounded-xl border border-amber-300 text-xs text-slate-700 shadow-xs"
            >
              <p className="font-extrabold text-amber-900">Grammar Formula:</p>
              <p className="mt-0.5 font-mono text-indigo-700 font-bold">{currentSentence.ruleFormula}</p>
              <p className="mt-1 text-slate-600 font-medium">{currentSentence.commonMistakeTip}</p>
            </motion.div>
          )}
        </div>

        {/* Options grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {currentSentence.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isOptionCorrect = idx === currentSentence.correctOptionIndex;

            let buttonStyle = 'bg-gradient-to-r from-white to-indigo-50/50 border-3 border-indigo-200 text-slate-900 hover:border-violet-500 hover:from-violet-100 hover:to-indigo-100 shadow-sm hover:shadow-md';

            if (hasAnswered) {
              if (isOptionCorrect) {
                buttonStyle = 'bg-gradient-to-r from-emerald-100 via-teal-100 to-emerald-200 border-3 border-emerald-500 text-emerald-950 font-black shadow-lg scale-[1.01]';
              } else if (isSelected) {
                buttonStyle = 'bg-gradient-to-r from-rose-100 via-pink-100 to-red-200 border-3 border-rose-500 text-rose-950 font-black shadow-lg';
              } else {
                buttonStyle = 'bg-slate-100 border-slate-200 text-slate-400 opacity-40';
              }
            }

            return (
              <button
                key={option}
                onClick={() => handleSelectOption(idx)}
                disabled={hasAnswered}
                className={`flex items-center justify-between p-4 sm:p-5 rounded-2xl border-3 text-left font-bold text-sm sm:text-base transition-all cursor-pointer ${buttonStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-sm shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="font-extrabold text-base">{option}</span>
                </div>

                {hasAnswered && isOptionCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {hasAnswered && isSelected && !isOptionCorrect && (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Bite-Sized Micro-Feedback */}
        <AnimatePresence>
          {hasAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mt-5 p-5 rounded-2xl border-2 shadow-md ${
                isCorrect
                  ? 'bg-emerald-50/90 border-emerald-300'
                  : 'bg-rose-50/90 border-rose-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  {isCorrect ? (
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-sm font-black shadow-xs">
                      ✓
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center text-sm font-black shadow-xs">
                      ✕
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h5
                      className={`font-black text-sm sm:text-base ${
                        isCorrect ? 'text-emerald-900' : 'text-rose-900'
                      }`}
                    >
                      {isCorrect ? 'Correct! Teacher Ana Espitia approves:' : 'Not quite! Teacher Ana Espitia explains:'}
                    </h5>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-800 mt-1 font-medium leading-relaxed">
                    {currentSentence.microFeedbackEn}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-black/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-indigo-900 font-mono font-bold text-[11px] bg-white px-2.5 py-1 rounded-lg border border-indigo-200">
                      Rule: {currentSentence.ruleFormula}
                    </span>
                    <span className="text-slate-600 font-bold">
                      💡 {currentSentence.commonMistakeTip}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Next Sentence */}
              <div className="mt-4 pt-3 border-t border-black/10 flex items-center justify-end gap-3">
                <button
                  onClick={handleNext}
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-slate-900 hover:bg-slate-800 transition-all flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <span>
                    {currentIndex < filteredSentences.length - 1
                      ? 'Next Sentence'
                      : 'Restart Round'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
