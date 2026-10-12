import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, RotateCcw, CheckCircle2, ArrowRight, Sparkles, Check } from 'lucide-react';
import { SentenceItem } from '../types/grammar';
import { soundManager } from '../utils/audio';

interface SentenceBuilderProps {
  sentences: SentenceItem[];
  onSetTutorFeedback?: (feedback: string) => void;
}

export const SentenceBuilder: React.FC<SentenceBuilderProps> = ({
  sentences,
  onSetTutorFeedback,
}) => {
  // Ensure exactly 10 sentences are used as requested by user
  const activeSentences = sentences.slice(0, 10);

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSentence = activeSentences[currentIndex] || activeSentences[0];

  const [availableWords, setAvailableWords] = useState<string[]>(() =>
    [...currentSentence.scrambledWords].sort(() => Math.random() - 0.5)
  );
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [completedSentenceIds, setCompletedSentenceIds] = useState<Set<string>>(new Set());

  const resetForSentence = (sentence: SentenceItem) => {
    setAvailableWords([...sentence.scrambledWords].sort(() => Math.random() - 0.5));
    setSelectedWords([]);
    setIsEvaluated(false);
    setIsCorrect(false);
  };

  const handleWordClick = (word: string, index: number) => {
    if (isEvaluated) return;
    setSelectedWords((prev) => [...prev, word]);
    setAvailableWords((prev) => prev.filter((_, i) => i !== index));
    soundManager.playSuccess();
  };

  const handleSelectedWordClick = (word: string, index: number) => {
    if (isEvaluated) return;
    setSelectedWords((prev) => prev.filter((_, i) => i !== index));
    setAvailableWords((prev) => [...prev, word]);
  };

  const handleCheck = () => {
    const userBuilt = selectedWords.join(' ');
    const expected = currentSentence.scrambledWords.join(' ');

    const correct = userBuilt.trim().toLowerCase() === expected.trim().toLowerCase();
    setIsCorrect(correct);
    setIsEvaluated(true);

    if (correct) {
      soundManager.playSuccess();
      setCompletedSentenceIds((prev) => new Set(prev).add(currentSentence.id));
      if (onSetTutorFeedback) {
        onSetTutorFeedback(
          `Teacher Ana Espitia applauds: "Masterful syntax! You formed Sentence #${currentIndex + 1} with exact punctuation: '${currentSentence.fullSentence}'"`
        );
      }
    } else {
      soundManager.playError();
      if (onSetTutorFeedback) {
        onSetTutorFeedback(
          `Teacher Ana Espitia advises: "Review the sequence: '${currentSentence.ruleFormula}'. Starting with 'If' requires an intermediate comma before the result clause."`
        );
      }
    }
  };

  const handleSelectIndex = (idx: number) => {
    setCurrentIndex(idx);
    resetForSentence(activeSentences[idx]);
  };

  const handleNextSentence = () => {
    const nextIdx = (currentIndex + 1) % activeSentences.length;
    setCurrentIndex(nextIdx);
    resetForSentence(activeSentences[nextIdx]);
  };

  const handleClear = () => {
    resetForSentence(currentSentence);
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-indigo-200 p-5 sm:p-7 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
            <h3 className="font-black text-slate-900 text-lg sm:text-2xl font-display">
              10-Sentence Syntax & Punctuation Builder
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            Solve the 10 curated core sentences. Place the word tokens in exact order, observing capital letters and intermediate commas.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-black text-indigo-700 bg-indigo-50 px-3.5 py-1.5 rounded-xl border border-indigo-200 self-start sm:self-auto">
          <span>Completed: {completedSentenceIds.size} / 10</span>
        </div>
      </div>

      {/* 10 Sentence Quick Navigation Bubbles */}
      <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-500 mr-1">Sentence:</span>
        {activeSentences.map((s, idx) => {
          const isCurrent = currentIndex === idx;
          const isDone = completedSentenceIds.has(s.id);
          return (
            <button
              key={s.id}
              onClick={() => handleSelectIndex(idx)}
              className={`w-8 h-8 rounded-xl text-xs font-black transition-all flex items-center justify-center cursor-pointer shadow-xs ${
                isCurrent
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white ring-2 ring-indigo-400 scale-105'
                  : isDone
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200'
              }`}
            >
              {isDone ? '✓' : idx + 1}
            </button>
          );
        })}
      </div>

      {/* Target Situation Clue */}
      <div className="my-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/50 border-2 border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
        <div>
          <span className="text-xs font-black text-indigo-700 uppercase tracking-wider block mb-1">
            Sentence #{currentIndex + 1} of 10: {currentSentence.title} ({currentSentence.context})
          </span>
          <p className="text-sm sm:text-base font-bold text-slate-900">
            Arrange the tokens to form this conditional sentence correctly.
          </p>
        </div>

        <button
          onClick={() => soundManager.speak(currentSentence.fullSentence)}
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-800 hover:text-slate-950 bg-white px-4 py-2 rounded-xl border border-slate-200 transition-all shadow-xs shrink-0 self-start sm:self-auto cursor-pointer hover:border-indigo-300"
        >
          <Volume2 className="w-4 h-4 text-indigo-600" />
          <span>Listen Target</span>
        </button>
      </div>

      {/* Slot Drop Zone for Selected Words */}
      <div className="min-h-[110px] p-4 sm:p-5 rounded-2xl border-2 border-dashed border-indigo-300 bg-indigo-50/25 flex flex-wrap items-center gap-2.5 transition-colors">
        {selectedWords.length === 0 ? (
          <span className="text-xs sm:text-sm text-slate-400 font-semibold italic">
            Tap the word cards below in correct grammatical order...
          </span>
        ) : (
          selectedWords.map((word, idx) => (
            <motion.button
              key={`${word}-${idx}`}
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={() => handleSelectedWordClick(word, idx)}
              className="px-3.5 py-2 rounded-xl bg-white text-slate-900 text-xs sm:text-sm font-bold border-2 border-indigo-200 shadow-sm hover:border-rose-400 hover:bg-rose-50 transition-all cursor-pointer"
              title="Click to remove from slot"
            >
              {word}
            </motion.button>
          ))
        )}
      </div>

      {/* Available Scrambled Words */}
      <div className="mt-5">
        <span className="text-xs font-extrabold text-slate-600 uppercase tracking-wider block mb-2">
          Available Words for Sentence #{currentIndex + 1}:
        </span>
        <div className="flex flex-wrap gap-2.5 min-h-[48px]">
          {availableWords.map((word, idx) => (
            <motion.button
              key={`${word}-${idx}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleWordClick(word, idx)}
              className="px-4 py-2 rounded-xl bg-gradient-to-br from-slate-100 to-indigo-50 hover:from-indigo-100 hover:to-indigo-200 text-slate-900 text-xs sm:text-sm font-bold border border-slate-300 shadow-xs transition-colors cursor-pointer"
            >
              {word}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={handleClear}
          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Words</span>
        </button>

        <div className="flex items-center gap-3">
          {!isEvaluated ? (
            <button
              onClick={handleCheck}
              disabled={selectedWords.length === 0}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-md"
            >
              Verify Word Order
            </button>
          ) : (
            <button
              onClick={handleNextSentence}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span>Next Sentence ({currentIndex + 1 < 10 ? `${currentIndex + 2}/10` : 'Restart'})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Result feedback */}
      <AnimatePresence>
        {isEvaluated && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-5 rounded-2xl border-2 shadow-md ${
              isCorrect ? 'bg-emerald-50 border-emerald-300' : 'bg-rose-50 border-rose-300'
            }`}
          >
            <div className="flex items-start gap-3">
              {isCorrect ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <div className="w-6 h-6 rounded-xl bg-rose-600 text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                  ✕
                </div>
              )}

              <div>
                <p className={`font-black text-sm sm:text-base ${isCorrect ? 'text-emerald-950' : 'text-rose-950'}`}>
                  {isCorrect ? 'Terrific Syntax! Well done!' : 'Word Order Needs Adjustment'}
                </p>
                <p className="text-xs sm:text-sm text-slate-800 mt-1 font-medium">
                  Model Solution: <span className="font-bold">"{currentSentence.fullSentence}"</span>
                </p>
                <p className="text-xs text-slate-600 mt-1 font-semibold">
                  💡 Teacher Ana Espitia's Rule: {currentSentence.commonMistakeTip}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
