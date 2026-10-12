import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Volume2, ShieldCheck, CalendarClock } from 'lucide-react';
import { SentenceItem, ConditionalType } from '../types/grammar';
import { soundManager } from '../utils/audio';

interface SortingGameProps {
  sentences: SentenceItem[];
  onSetTutorFeedback?: (feedback: string) => void;
}

export const SortingGame: React.FC<SortingGameProps> = ({
  sentences,
  onSetTutorFeedback,
}) => {
  const [deck, setDeck] = useState<SentenceItem[]>(() =>
    [...sentences].sort(() => Math.random() - 0.5)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastAnswer, setLastAnswer] = useState<{
    userChoice: ConditionalType;
    isCorrect: boolean;
    item: SentenceItem;
  } | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const currentItem = deck[currentIndex];

  const handleClassify = (choice: ConditionalType) => {
    if (!currentItem || lastAnswer) return;

    const isCorrect = currentItem.type === choice;
    setLastAnswer({ userChoice: choice, isCorrect, item: currentItem });

    if (isCorrect) {
      soundManager.playSuccess();
      setScore((s) => s + 1);
      if (onSetTutorFeedback) {
        onSetTutorFeedback(
          choice === 'zero'
            ? 'Teacher Ana Espitia nods: "Well sorted! It is Zero Conditional because it describes a permanent classroom rule or habit."'
            : 'Teacher Ana Espitia smiles: "Spot on! It is First Conditional because it refers to a probable future result with will."'
        );
      }
    } else {
      soundManager.playError();
      if (onSetTutorFeedback) {
        onSetTutorFeedback(
          choice === 'zero'
            ? 'Teacher Ana Espitia clarifies: "Careful: this sentence describes a future plan or consequence with will (First Conditional)."'
            : 'Teacher Ana Espitia clarifies: "Take note: this sentence states an automatic classroom rule or general truth (Zero Conditional)."'
        );
      }
    }
  };

  const handleNext = () => {
    setLastAnswer(null);
    if (currentIndex < deck.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setDeck([...sentences].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setLastAnswer(null);
    setScore(0);
    setCompleted(false);
  };

  if (completed) {
    return (
      <div className="bg-white rounded-3xl border-2 border-indigo-200 p-8 text-center max-w-xl mx-auto shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto text-3xl font-black mb-4 border border-emerald-300">
          🏆
        </div>
        <h3 className="text-2xl font-black text-slate-900 font-display">Sorting Challenge Completed!</h3>
        <p className="text-sm text-slate-600 mt-2 font-medium">
          Teacher Ana Espitia's tally: You accurately categorized <span className="font-black text-indigo-700">{score}</span> of {deck.length} classroom situations!
        </p>

        <div className="mt-6">
          <button
            onClick={handleRestart}
            className="px-6 py-3 rounded-2xl text-sm font-black text-white bg-slate-900 hover:bg-slate-800 transition-colors inline-flex items-center gap-2 cursor-pointer shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>
        </div>
      </div>
    );
  }

  if (!currentItem) return null;

  return (
    <div className="bg-white rounded-3xl border-2 border-indigo-100 p-5 sm:p-7 shadow-lg">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-black text-slate-900 text-lg sm:text-xl font-display">
            Classification Arena: Zero vs. First Conditional
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Identify whether each educational statement is a permanent classroom rule (Zero) or a future outcome (First).
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold text-slate-700 self-start sm:self-auto">
          <span className="text-slate-400">Card:</span>
          <span className="font-black text-slate-900 tabular-nums">
            {currentIndex + 1} / {deck.length}
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-emerald-600 font-extrabold tabular-nums">
            {score} Correct
          </span>
        </div>
      </div>

      {/* Target Sentence Card */}
      <div className="my-6">
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-50 border-2 border-indigo-100 text-center relative overflow-hidden shadow-inner">
          <span className="text-xs font-black text-indigo-700 uppercase tracking-wider mb-2 block">
            Classroom Context: {currentItem.context}
          </span>

          <p className="text-xl sm:text-2xl font-bold text-slate-900 max-w-2xl mx-auto leading-relaxed font-sans">
            "{currentItem.fullSentence}"
          </p>

          <div className="mt-4 flex justify-center">
            <button
              onClick={() => soundManager.speak(currentItem.fullSentence)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 transition-colors shadow-xs cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Listen Sentence</span>
            </button>
          </div>
        </div>

        {/* Big Interactive Decision Buttons with Vibrant Colors */}
        {!lastAnswer ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {/* Zero Conditional Button */}
            <button
              onClick={() => handleClassify('zero')}
              className="p-6 rounded-3xl border-4 border-violet-400 bg-gradient-to-br from-violet-100 via-purple-50 to-indigo-100 hover:from-violet-200 hover:to-indigo-200 text-left transition-all hover:scale-[1.02] active:scale-[0.99] cursor-pointer group shadow-xl hover:shadow-2xl"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg group-hover:rotate-3 transition-transform">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-black text-violet-950 text-lg group-hover:text-violet-900">
                    Zero Conditional
                  </h4>
                  <p className="text-xs text-slate-700 font-bold mt-0.5">
                    Classroom rule, routine, or universal fact (Present Simple + Present Simple)
                  </p>
                </div>
              </div>
            </button>

            {/* First Conditional Button */}
            <button
              onClick={() => handleClassify('first')}
              className="p-6 rounded-3xl border-4 border-emerald-400 bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100 hover:from-emerald-200 hover:to-cyan-200 text-left transition-all hover:scale-[1.02] active:scale-[0.99] cursor-pointer group shadow-xl hover:shadow-2xl"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 text-white flex items-center justify-center shadow-lg group-hover:rotate-3 transition-transform">
                  <CalendarClock className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-black text-emerald-950 text-lg group-hover:text-emerald-900">
                    First Conditional
                  </h4>
                  <p className="text-xs text-slate-700 font-bold mt-0.5">
                    Probable future event, plan, or specific prediction (Present Simple + will)
                  </p>
                </div>
              </div>
            </button>
          </div>
        ) : (
          /* Feedback Box */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-5 rounded-2xl border-2 shadow-md ${
              lastAnswer.isCorrect
                ? 'bg-emerald-50/90 border-emerald-300'
                : 'bg-rose-50/90 border-rose-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0">
                {lastAnswer.isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-600" />
                )}
              </div>

              <div className="flex-1">
                <h4
                  className={`font-black text-sm sm:text-base ${
                    lastAnswer.isCorrect ? 'text-emerald-950' : 'text-rose-950'
                  }`}
                >
                  {lastAnswer.isCorrect
                    ? 'Perfect Classification!'
                    : `Incorrect. This belongs to ${
                        lastAnswer.item.type === 'zero'
                          ? 'Zero Conditional'
                          : 'First Conditional'
                      }`}
                </h4>

                <p className="text-xs sm:text-sm text-slate-800 mt-1 font-medium leading-relaxed">
                  {lastAnswer.item.microFeedbackEn}
                </p>

                <div className="mt-2.5 text-xs font-mono font-bold text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
                  Grammar Verbs: {lastAnswer.item.verb1} ➔ {lastAnswer.item.verb2}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-black/10 flex justify-end">
              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-slate-900 hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>Next Sentence</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
