import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  VocabularyWord,
  WordProgress,
  LearningSession,
  DailyChallenge,
  ConversationMessage,
  VoiceRecording,
} from "@/types";

interface LearningState {
  currentSession: LearningSession | null;
  vocabularyProgress: Record<string, WordProgress>;
  dailyChallenges: DailyChallenge[];
  recentConversations: ConversationMessage[];
  voiceRecordings: VoiceRecording[];
  studyStreak: number;
  totalStudyTime: number;
  wordsLearned: number;
  xp: number;
}

interface LearningActions {
  startSession: (type: LearningSession["type"]) => void;
  endSession: (results: LearningSession["results"]) => void;
  updateWordProgress: (wordId: string, progress: Partial<WordProgress>) => void;
  addVoiceRecording: (recording: VoiceRecording) => void;
  completeChallenge: (
    challengeId: string,
    result: DailyChallenge["result"]
  ) => void;
  addConversationMessage: (message: ConversationMessage) => void;
  updateStats: (
    updates: Partial<
      Pick<
        LearningState,
        "studyStreak" | "totalStudyTime" | "wordsLearned" | "xp"
      >
    >
  ) => void;
  resetProgress: () => void;
  getWordProgress: (wordId: string) => WordProgress | null;
  getTodaysChallenge: () => DailyChallenge | null;
}

type LearningStore = LearningState & LearningActions;

export const useLearningStore = create<LearningStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentSession: null,
      vocabularyProgress: {},
      dailyChallenges: [],
      recentConversations: [],
      voiceRecordings: [],
      studyStreak: 0,
      totalStudyTime: 0,
      wordsLearned: 0,
      xp: 0,

      // Actions
      startSession: (type) => {
        const newSession: LearningSession = {
          id: Date.now().toString(),
          userId: "current-user", // This would come from auth store
          type,
          startTime: new Date(),
          activities: [],
          results: {
            totalScore: 0,
            accuracy: 0,
            wordsLearned: 0,
            mistakesCorrected: 0,
            timeSpent: 0,
            xpGained: 0,
          },
        };

        set({ currentSession: newSession });
      },

      endSession: (results) => {
        const { currentSession, totalStudyTime, xp } = get();

        if (currentSession) {
          const updatedSession = {
            ...currentSession,
            endTime: new Date(),
            duration: results.timeSpent,
            results,
          };

          set({
            currentSession: null,
            totalStudyTime: totalStudyTime + results.timeSpent,
            xp: xp + results.xpGained,
          });
        }
      },

      updateWordProgress: (wordId, progressUpdate) => {
        const { vocabularyProgress } = get();
        const existingProgress = vocabularyProgress[wordId];

        const newProgress: WordProgress = existingProgress
          ? { ...existingProgress, ...progressUpdate }
          : {
              userId: "current-user",
              wordId,
              status: "new",
              attempts: 0,
              correctAttempts: 0,
              lastReviewed: new Date(),
              nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
              strength: 0,
              ...progressUpdate,
            };

        set({
          vocabularyProgress: {
            ...vocabularyProgress,
            [wordId]: newProgress,
          },
        });

        // Update words learned count if word status changed to mastered
        if (
          newProgress.status === "mastered" &&
          existingProgress?.status !== "mastered"
        ) {
          const { wordsLearned } = get();
          set({ wordsLearned: wordsLearned + 1 });
        }
      },

      addVoiceRecording: (recording) => {
        const { voiceRecordings } = get();
        set({
          voiceRecordings: [recording, ...voiceRecordings].slice(0, 50), // Keep last 50 recordings
        });
      },

      completeChallenge: (challengeId, result) => {
        const { dailyChallenges, xp } = get();
        const updatedChallenges = dailyChallenges.map((challenge) =>
          challenge.id === challengeId
            ? { ...challenge, isCompleted: true, result }
            : challenge
        );

        const completedChallenge = updatedChallenges.find(
          (c) => c.id === challengeId
        );
        const xpGained = completedChallenge?.points || 0;

        set({
          dailyChallenges: updatedChallenges,
          xp: xp + xpGained,
        });
      },

      addConversationMessage: (message) => {
        const { recentConversations } = get();
        set({
          recentConversations: [message, ...recentConversations].slice(0, 100), // Keep last 100 messages
        });
      },

      updateStats: (updates) => {
        set(updates);
      },

      resetProgress: () => {
        set({
          vocabularyProgress: {},
          dailyChallenges: [],
          recentConversations: [],
          voiceRecordings: [],
          studyStreak: 0,
          totalStudyTime: 0,
          wordsLearned: 0,
          xp: 0,
        });
      },

      getWordProgress: (wordId) => {
        const { vocabularyProgress } = get();
        return vocabularyProgress[wordId] || null;
      },

      getTodaysChallenge: () => {
        const { dailyChallenges } = get();
        const today = new Date().toDateString();
        return (
          dailyChallenges.find(
            (challenge) => challenge.date.toDateString() === today
          ) || null
        );
      },
    }),
    {
      name: "learning-storage",
      partialize: (state) => ({
        vocabularyProgress: state.vocabularyProgress,
        dailyChallenges: state.dailyChallenges,
        studyStreak: state.studyStreak,
        totalStudyTime: state.totalStudyTime,
        wordsLearned: state.wordsLearned,
        xp: state.xp,
      }),
    }
  )
);
