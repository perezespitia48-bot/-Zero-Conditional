export type ConditionalType = 'zero' | 'first';

export interface SentenceItem {
  id: string;
  type: ConditionalType;
  title: string;
  context: string;
  fullSentence: string;
  conditionClause: string;
  resultClause: string;
  blankSentence: string;
  options: string[];
  correctOptionIndex: number;
  verb1: string;
  verb2: string;
  ruleFormula: string;
  microFeedbackEn: string;
  commonMistakeTip: string;
  scrambledWords: string[];
}

export type TutorId = 'ana' | 'marco';

export type TutorMood = 'happy' | 'explaining' | 'celebrating' | 'supportive';

export interface TutorCharacter {
  id: TutorId;
  name: string;
  role: string;
  specialty: string;
  avatarUrl: string;
  themeColor: {
    bg: string;
    border: string;
    text: string;
    accent: string;
  };
}

export interface InteractiveHotspot {
  id: string;
  spotNumber: number;
  title: string;
  type: ConditionalType;
  xPercent: number;
  yPercent: number;
  sentenceId: string;
  description: string;
  actionPrompt: string;
  longExample: string;
  ifClauseText: string;
  willClauseText: string;
  ifVerb: string;
  willVerb: string;
  exerciseApplicationTip: string;
}

