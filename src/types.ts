export interface Word {
  id: string;
  word: string;
  ipa: string;
  meaning: string;
  example: string;
  exampleMeaning: string;
  audioUrl: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  words: Word[];
}

export interface UserProgress {
  completedTopics: string[];
  quizScores: Record<string, number>;
  learnedWords: string[];
}
