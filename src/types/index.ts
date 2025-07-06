// User and Authentication Types
export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  level: SkillLevel;
  joinDate: Date;
  lastActive: Date;
  preferences: UserPreferences;
  stats: UserStats;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    reminders: boolean;
  };
  voice: {
    speed: number;
    pitch: number;
    volume: number;
  };
  privacy: {
    shareProgress: boolean;
    allowRecordings: boolean;
  };
}

export interface UserStats {
  totalStudyTime: number; // in minutes
  wordsLearned: number;
  conversationsCompleted: number;
  streakDays: number;
  level: SkillLevel;
  xp: number;
  badges: Badge[];
}

// Skill and Level Types
export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
  category:
    | "vocabulary"
    | "conversation"
    | "pronunciation"
    | "streak"
    | "special";
}

// Vocabulary Types
export interface VocabularyWord {
  id: string;
  word: string;
  pronunciation: string;
  phonetic: string;
  definitions: Definition[];
  examples: Example[];
  level: SkillLevel;
  category: VocabularyCategory;
  tags: string[];
  difficulty: number; // 1-10
  frequency: number; // usage frequency
  audioUrl?: string;
  imageUrl?: string;
  synonyms: string[];
  antonyms: string[];
  etymology?: string;
  learningProgress?: WordProgress;
}

export interface Definition {
  partOfSpeech:
    | "noun"
    | "verb"
    | "adjective"
    | "adverb"
    | "preposition"
    | "pronoun"
    | "conjunction"
    | "interjection";
  meaning: string;
  example?: string;
}

export interface Example {
  sentence: string;
  translation?: string;
  audioUrl?: string;
  difficulty: number;
}

export interface WordProgress {
  userId: string;
  wordId: string;
  status: "new" | "learning" | "reviewing" | "mastered";
  attempts: number;
  correctAttempts: number;
  lastReviewed: Date;
  nextReview: Date;
  strength: number; // 0-1
}

export type VocabularyCategory =
  | "business"
  | "academic"
  | "daily"
  | "travel"
  | "technology"
  | "health"
  | "entertainment"
  | "sports"
  | "food"
  | "relationships";

// Conversation Types
export interface Conversation {
  id: string;
  title: string;
  description: string;
  scenario: ConversationScenario;
  level: SkillLevel;
  estimatedDuration: number; // in minutes
  participants: ConversationParticipant[];
  messages: ConversationMessage[];
  objectives: string[];
  vocabulary: string[]; // word IDs
  grammar: GrammarPoint[];
  isCompleted: boolean;
  rating?: number;
  feedback?: ConversationFeedback;
}

export type ConversationScenario =
  | "job_interview"
  | "restaurant"
  | "shopping"
  | "airport"
  | "hotel"
  | "doctor_visit"
  | "bank"
  | "school"
  | "office_meeting"
  | "small_talk"
  | "phone_call"
  | "presentation"
  | "negotiation"
  | "complaint"
  | "directions";

export interface ConversationParticipant {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  personality: "friendly" | "formal" | "casual" | "strict" | "humorous";
  background?: string;
}

export interface ConversationMessage {
  id: string;
  participantId: string;
  content: string;
  timestamp: Date;
  type: "text" | "voice" | "system";
  audioUrl?: string;
  duration?: number;
  isUserMessage: boolean;
  analysis?: MessageAnalysis;
}

export interface MessageAnalysis {
  grammar: GrammarAnalysis;
  pronunciation: PronunciationAnalysis;
  vocabulary: VocabularyAnalysis;
  fluency: FluencyAnalysis;
  confidence: number;
  overallScore: number;
}

// Voice and Audio Types
export interface VoiceRecording {
  id: string;
  userId: string;
  audioUrl: string;
  duration: number;
  transcript: string;
  createdAt: Date;
  type: "practice" | "conversation" | "pronunciation";
  analysis?: VoiceAnalysis;
}

export interface VoiceAnalysis {
  pronunciation: PronunciationAnalysis;
  fluency: FluencyAnalysis;
  emotion: EmotionAnalysis;
  pace: PaceAnalysis;
  clarity: number;
  confidence: number;
  overallScore: number;
  improvements: string[];
}

export interface PronunciationAnalysis {
  accuracy: number;
  words: WordPronunciation[];
  commonErrors: string[];
  suggestions: string[];
}

export interface WordPronunciation {
  word: string;
  accuracy: number;
  phonetic: string;
  actualPhonetic: string;
  feedback: string;
}

export interface FluencyAnalysis {
  score: number;
  fillerWords: string[];
  pauseCount: number;
  averagePauseLength: number;
  wordsPerMinute: number;
  rhythm: number;
}

export interface EmotionAnalysis {
  primary:
    | "confident"
    | "nervous"
    | "excited"
    | "calm"
    | "frustrated"
    | "happy"
    | "sad";
  confidence: number;
  energy: number;
  tone: "professional" | "casual" | "formal" | "friendly";
}

export interface PaceAnalysis {
  averageWpm: number;
  variations: number[];
  recommendedWpm: number;
  feedback: string;
}

// Learning and Progress Types
export interface LearningSession {
  id: string;
  userId: string;
  type: "vocabulary" | "conversation" | "pronunciation" | "grammar";
  startTime: Date;
  endTime?: Date;
  duration?: number;
  activities: LearningActivity[];
  results: SessionResults;
}

export interface LearningActivity {
  id: string;
  type: string;
  content: any;
  timeSpent: number;
  score?: number;
  completed: boolean;
}

export interface SessionResults {
  totalScore: number;
  accuracy: number;
  wordsLearned: number;
  mistakesCorrected: number;
  timeSpent: number;
  xpGained: number;
}

// Grammar Types
export interface GrammarPoint {
  id: string;
  title: string;
  description: string;
  examples: string[];
  level: SkillLevel;
  category: GrammarCategory;
}

export type GrammarCategory =
  | "tenses"
  | "articles"
  | "prepositions"
  | "conditionals"
  | "passive_voice"
  | "reported_speech"
  | "modal_verbs"
  | "gerunds";

export interface GrammarAnalysis {
  score: number;
  errors: GrammarError[];
  suggestions: GrammarSuggestion[];
}

export interface GrammarError {
  type: string;
  message: string;
  position: [number, number];
  severity: "low" | "medium" | "high";
  rule: string;
}

export interface GrammarSuggestion {
  original: string;
  suggested: string;
  explanation: string;
  confidence: number;
}

export interface VocabularyAnalysis {
  complexity: number;
  variety: number;
  appropriateness: number;
  unusedWords: string[];
  suggestions: string[];
}

// Practice and Exercise Types
export interface Exercise {
  id: string;
  type: ExerciseType;
  title: string;
  description: string;
  level: SkillLevel;
  instructions: string;
  content: any;
  timeLimit?: number;
  maxAttempts?: number;
  points: number;
}

export type ExerciseType =
  | "multiple_choice"
  | "fill_blank"
  | "pronunciation"
  | "listening"
  | "speaking"
  | "translation"
  | "matching"
  | "ordering";

// Feedback and Assessment Types
export interface ConversationFeedback {
  overallScore: number;
  pronunciation: number;
  grammar: number;
  vocabulary: number;
  fluency: number;
  confidence: number;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
}

// Challenge and Gamification Types
export interface DailyChallenge {
  id: string;
  date: Date;
  type: "vocabulary" | "pronunciation" | "conversation" | "grammar";
  title: string;
  description: string;
  difficulty: SkillLevel;
  points: number;
  timeLimit: number;
  isCompleted: boolean;
  result?: ChallengeResult;
}

export interface ChallengeResult {
  score: number;
  timeSpent: number;
  attempts: number;
  perfectScore: boolean;
  feedback: string;
}

// Group Discussion Types
export interface GroupDiscussion {
  id: string;
  title: string;
  topic: string;
  description: string;
  level: SkillLevel;
  maxParticipants: number;
  currentParticipants: User[];
  aiModerators: ConversationParticipant[];
  startTime: Date;
  duration: number;
  status: "waiting" | "active" | "completed";
  messages: GroupMessage[];
  rules: string[];
}

export interface GroupMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: "text" | "voice" | "system";
  audioUrl?: string;
  reactions: MessageReaction[];
}

export interface MessageReaction {
  userId: string;
  emoji: string;
  timestamp: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Utility Types
export interface TimeRange {
  start: Date;
  end: Date;
}

export interface ProgressData {
  period: TimeRange;
  totalTime: number;
  sessionsCompleted: number;
  averageScore: number;
  wordsLearned: number;
  improvementRate: number;
}

export interface NotificationItem {
  id: string;
  type: "achievement" | "reminder" | "update" | "social";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}
