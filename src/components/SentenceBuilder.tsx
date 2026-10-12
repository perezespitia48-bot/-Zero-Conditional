import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, RotateCcw, CheckCircle2, ArrowRight } from 'lucide-react';
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
  // Exactly 10 sentences as requested
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
          `Teacher Ana Espitia applauds: "Masterful sentence architecture! '${currentSentence.fullSentence}' has perfect conditional structure."`
        );
      }
    } else {
      soundManager.playError();
      if (onSetTutorFeedback) {
        onSetTutorFeedback(
          `Teacher Ana Espitia advises: "Review the position of 'If' and the intermediate comma. Hint: ${currentSentence.commonMistakeTip}"`
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
    <div className="bg-[#070A14] rounded-3xl border-2 border-slate-800 p-5 sm:p-7 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h3 className="font-black text-white text-lg sm:text-2xl font-display">
              10-Sentence Syntax & Punctuation Builder
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
            Solve the 10 curated core sentences. Place the word tokens in exact order, observing capital letters and intermediate commas.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-black text-cyan-300 bg-cyan-950/60 px-3.5 py-1.5 rounded-xl border border-cyan-700/50 self-start sm:self-auto">
          <span>Completed: {completedSentenceIds.size} / 10</span>
        </div>
      </div>

      {/* 10 Sentence Quick Navigation Bubbles with Dark Glass */}
      <div className="mt-4 p-3 bg-[#0A0E1E] rounded-2xl border border-slate-800 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-400 mr-1">Sentence:</span>
        {activeSentences.map((s, idx) => {
          const isCurrent = currentIndex === idx;
          const isDone = completedSentenceIds.has(s.id);
          return (
            <button
              key={s.id}
              onClick={() => handleSelectIndex(idx)}
              className={`w-8 h-8 rounded-xl text-xs font-black transition-all flex items-center justify-center cursor-pointer shadow-xs ${
                isCurrent
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white ring-2 ring-violet-400 scale-105'
                  : isDone
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/60'
                  : 'bg-[#10162B] text-slate-300 hover:bg-[#161F3C] border border-slate-700'
              }`}
            >
              {isDone ? '✓' : idx + 1}
            </button>
          );
        })}
      </div>

      {/* Target Situation Clue */}
      <div className="my-5 p-4 sm:p-5 rounded-2xl bg-[#0A0F22] border-2 border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
        <div>
          <span className="text-xs font-black text-indigo-400 uppercase tracking-wider block mb-1">
            Sentence #{currentIndex + 1} of 10: {currentSentence.title} ({currentSentence.context})
          </span>
          <p className="text-sm sm:text-base font-bold text-white">
            Arrange the tokens to form this conditional sentence correctly.
          </p>
        </div>

        <button
          onClick={() => soundManager.speak(currentSentence.fullSentence)}
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-200 hover:text-white bg-[#0F162A] hover:bg-[#152040] px-4 py-2 rounded-xl border border-slate-700 transition-all shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <Volume2 className="w-4 h-4 text-violet-400" />
          <span>Listen Target</span>
        </button>
      </div>

      {/* Slot Drop Zone for Selected Words (Deep Black & Glowing Border) */}
      <div className="min-h-[110px] p-4 sm:p-5 rounded-2xl border-2 border-dashed border-indigo-500/40 bg-[#04060D] flex flex-wrap items-center gap-2.5 transition-colors">
        {selectedWords.length === 0 ? (
          <span className="text-xs sm:text-sm text-slate-500 font-semibold italic">
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
              className="px-3.5 py-2 rounded-xl bg-[#121932] text-white text-xs sm:text-sm font-bold border-2 border-violet-500/50 shadow-md hover:border-rose-400 hover:bg-rose-950/60 transition-all cursor-pointer"
              title="Click to remove from slot"
            >
              {word}
            </motion.button>
          ))
        )}
      </div>

      {/* Available Scrambled Words */}
      <div className="mt-5">
        <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block mb-2">
          Available Words for Sentence #{currentIndex + 1}:
        </span>
        <div className="flex flex-wrap gap-2.5 min-h-[48px]">
          {availableWords.map((word, idx) => (
            <motion.button
              key={`${word}-${idx}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleWordClick(word, idx)}
              className="px-4 py-2 rounded-xl bg-[#0D1326] hover:bg-[#151F3D] hover:border-violet-400 text-slate-200 hover:text-white text-xs sm:text-sm font-bold border border-slate-700 shadow-md transition-colors cursor-pointer"
            >
              {word}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={handleClear}
          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-[#0F1426] hover:bg-[#161F38] border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Words</span>
        </button>

        <div className="flex items-center gap-3">
          {!isEvaluated ? (
            <button
              onClick={handleCheck}
              disabled={selectedWords.length === 0}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-lg shadow-violet-500/30"
            >
              Verify Word Order
            </button>
          ) : (
            <button
              onClick={handleNextSentence}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/30"
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
            className={`mt-4 p-5 rounded-2xl border-2 shadow-xl ${
              isCorrect ? 'bg-[#061914] border-emerald-500/50' : 'bg-[#1A0A10] border-rose-500/50'
            }`}
          >
            <div className="flex items-start gap-3">
              {isCorrect ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <div className="w-6 h-6 rounded-xl bg-rose-500 text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                  ✕
                </div>
              )}

              <div>
                <p className={`font-black text-sm sm:text-base ${isCorrect ? 'text-emerald-300' : 'text-rose-300'}`}>
                  {isCorrect ? 'Terrific Syntax! Well done!' : 'Word Order Needs Adjustment'}
                </p>
                <p className="text-xs sm:text-sm text-slate-200 mt-1 font-medium">
                  Model Solution: <span className="font-bold text-white">"{currentSentence.fullSentence}"</span>
                </p>
                <p className="text-xs text-amber-300 mt-1 font-semibold">
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
