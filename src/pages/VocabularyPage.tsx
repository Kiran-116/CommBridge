import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AcademicCapIcon,
  MagnifyingGlassIcon,
  BookmarkIcon,
  PlayCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  StarIcon,
  SpeakerWaveIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowPathIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import { useAuthStore } from "@/store/authStore";
import { useLearningStore } from "@/store/learningStore";

interface VocabularyWord {
  id: string;
  word: string;
  pronunciation: string;
  definition: string;
  partOfSpeech: string;
  example: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
  synonyms: string[];
  antonyms: string[];
  imageUrl?: string;
  audioUrl?: string;
  mastered: boolean;
  reviewDate: Date;
  correctAttempts: number;
  totalAttempts: number;
}

interface StudyMode {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const studyModes: StudyMode[] = [
  {
    id: "flashcards",
    name: "Flashcards",
    description: "Review words with spaced repetition",
    icon: BookmarkIcon,
    color: "bg-blue-500",
  },
  {
    id: "quiz",
    name: "Quiz Mode",
    description: "Test your knowledge with multiple choice",
    icon: CheckCircleIcon,
    color: "bg-green-500",
  },
  {
    id: "spelling",
    name: "Spelling Test",
    description: "Practice spelling words correctly",
    icon: AcademicCapIcon,
    color: "bg-purple-500",
  },
  {
    id: "pronunciation",
    name: "Pronunciation",
    description: "Practice speaking and pronunciation",
    icon: SpeakerWaveIcon,
    color: "bg-orange-500",
  },
];

// Mock vocabulary data - would come from API/database
const mockVocabulary: VocabularyWord[] = [
  {
    id: "1",
    word: "Eloquent",
    pronunciation: "/ˈɛl.ə.kwənt/",
    definition: "Fluent or persuasive in speaking or writing",
    partOfSpeech: "adjective",
    example: "She gave an eloquent speech about climate change.",
    difficulty: "advanced",
    category: "Communication",
    synonyms: ["articulate", "fluent", "persuasive"],
    antonyms: ["inarticulate", "tongue-tied"],
    mastered: false,
    reviewDate: new Date(),
    correctAttempts: 2,
    totalAttempts: 5,
  },
  {
    id: "2",
    word: "Serendipity",
    pronunciation: "/ˌsɛr.ənˈdɪp.ɪ.ti/",
    definition: "The occurrence of events by chance in a happy way",
    partOfSpeech: "noun",
    example: "Finding this job was pure serendipity.",
    difficulty: "intermediate",
    category: "Abstract",
    synonyms: ["chance", "luck", "fortune"],
    antonyms: ["misfortune", "bad luck"],
    mastered: true,
    reviewDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    correctAttempts: 8,
    totalAttempts: 10,
  },
  {
    id: "3",
    word: "Resilient",
    pronunciation: "/rɪˈzɪl.jənt/",
    definition: "Able to recover quickly from difficult conditions",
    partOfSpeech: "adjective",
    example: "Children are remarkably resilient creatures.",
    difficulty: "intermediate",
    category: "Personal Qualities",
    synonyms: ["tough", "strong", "adaptable"],
    antonyms: ["fragile", "weak", "brittle"],
    mastered: false,
    reviewDate: new Date(),
    correctAttempts: 3,
    totalAttempts: 4,
  },
  {
    id: "4",
    word: "Ubiquitous",
    pronunciation: "/juːˈbɪk.wɪ.təs/",
    definition: "Present, appearing, or found everywhere",
    partOfSpeech: "adjective",
    example: "Smartphones have become ubiquitous in modern society.",
    difficulty: "advanced",
    category: "Description",
    synonyms: ["omnipresent", "pervasive", "universal"],
    antonyms: ["rare", "scarce", "absent"],
    mastered: false,
    reviewDate: new Date(),
    correctAttempts: 1,
    totalAttempts: 3,
  },
  {
    id: "5",
    word: "Collaborate",
    pronunciation: "/kəˈlæb.ə.reɪt/",
    definition: "To work jointly on an activity or project",
    partOfSpeech: "verb",
    example: "We need to collaborate more effectively as a team.",
    difficulty: "beginner",
    category: "Business",
    synonyms: ["cooperate", "work together", "partner"],
    antonyms: ["compete", "oppose", "hinder"],
    mastered: true,
    reviewDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    correctAttempts: 7,
    totalAttempts: 8,
  },
  {
    id: "6",
    word: "Innovative",
    pronunciation: "/ˈɪn.ə.veɪ.tɪv/",
    definition: "Featuring new methods; advanced and original",
    partOfSpeech: "adjective",
    example: "The company is known for its innovative approach to technology.",
    difficulty: "intermediate",
    category: "Business",
    synonyms: ["creative", "original", "pioneering"],
    antonyms: ["traditional", "conventional", "outdated"],
    mastered: false,
    reviewDate: new Date(),
    correctAttempts: 4,
    totalAttempts: 6,
  },
];

const VocabularyPage = () => {
  const { user } = useAuthStore();
  const { addRecentActivity } = useLearningStore();
  const [vocabulary, setVocabulary] =
    useState<VocabularyWord[]>(mockVocabulary);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [studyMode, setStudyMode] = useState<string | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const categories = [
    "all",
    ...Array.from(new Set(vocabulary.map((word) => word.category))),
  ];
  const difficulties = ["all", "beginner", "intermediate", "advanced"];

  const filteredVocabulary = vocabulary.filter((word) => {
    const matchesSearch =
      word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || word.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === "all" || word.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const wordsToReview = vocabulary.filter(
    (word) => !word.mastered && word.reviewDate <= new Date()
  );
  const masteredWords = vocabulary.filter((word) => word.mastered);

  const startStudyMode = (mode: string) => {
    setStudyMode(mode);
    setCurrentWordIndex(0);
    setShowAnswer(false);
    setShowResult(false);

    if (mode === "quiz") {
      generateQuizAnswers();
    }

    addRecentActivity({
      description: `Started ${mode} practice`,
      timestamp: new Date(),
      type: "vocabulary",
    });
  };

  const generateQuizAnswers = () => {
    const currentWord = filteredVocabulary[currentWordIndex];
    if (!currentWord) return;

    const wrongAnswers = vocabulary
      .filter(
        (w) =>
          w.id !== currentWord.id && w.difficulty === currentWord.difficulty
      )
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((w) => w.definition);

    const answers = [currentWord.definition, ...wrongAnswers].sort(
      () => Math.random() - 0.5
    );
    setQuizAnswers(answers);
  };

  const handleQuizAnswer = (answer: string) => {
    const currentWord = filteredVocabulary[currentWordIndex];
    setSelectedAnswer(answer);
    setShowResult(true);

    const isCorrect = answer === currentWord.definition;

    // Update word statistics
    setVocabulary((prev) =>
      prev.map((word) =>
        word.id === currentWord.id
          ? {
              ...word,
              totalAttempts: word.totalAttempts + 1,
              correctAttempts: isCorrect
                ? word.correctAttempts + 1
                : word.correctAttempts,
            }
          : word
      )
    );
  };

  const nextWord = () => {
    if (currentWordIndex < filteredVocabulary.length - 1) {
      setCurrentWordIndex((prev) => prev + 1);
      setShowAnswer(false);
      setShowResult(false);
      setSelectedAnswer(null);

      if (studyMode === "quiz") {
        generateQuizAnswers();
      }
    } else {
      setStudyMode(null);
      addRecentActivity({
        description: `Completed ${studyMode} practice session`,
        timestamp: new Date(),
        type: "vocabulary",
      });
    }
  };

  const markAsKnown = () => {
    const currentWord = filteredVocabulary[currentWordIndex];
    setVocabulary((prev) =>
      prev.map((word) =>
        word.id === currentWord.id
          ? {
              ...word,
              mastered: true,
              reviewDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            }
          : word
      )
    );
  };

  const markAsUnknown = () => {
    const currentWord = filteredVocabulary[currentWordIndex];
    setVocabulary((prev) =>
      prev.map((word) =>
        word.id === currentWord.id
          ? {
              ...word,
              reviewDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
            }
          : word
      )
    );
  };

  useEffect(() => {
    if (studyMode === "quiz" && filteredVocabulary.length > 0) {
      generateQuizAnswers();
    }
  }, [currentWordIndex, studyMode]);

  // Study Mode View
  if (studyMode && filteredVocabulary.length > 0) {
    const currentWord = filteredVocabulary[currentWordIndex];

    return (
      <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {studyModes.find((m) => m.id === studyMode)?.name}
              </h1>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full text-sm">
                {currentWordIndex + 1} / {filteredVocabulary.length}
              </span>
            </div>
            <button
              onClick={() => setStudyMode(null)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Exit
            </button>
          </div>
        </div>

        {/* Study Content */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <motion.div
              key={currentWordIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
            >
              {studyMode === "flashcards" && (
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    {currentWord.word}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {currentWord.pronunciation}
                  </p>

                  <AnimatePresence mode="wait">
                    {showAnswer ? (
                      <motion.div
                        key="answer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="text-left space-y-4">
                          <p className="text-lg text-gray-900 dark:text-white">
                            <span className="font-semibold">Definition:</span>{" "}
                            {currentWord.definition}
                          </p>
                          <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-semibold">Example:</span>{" "}
                            {currentWord.example}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            <span className="font-semibold">
                              Part of Speech:
                            </span>{" "}
                            {currentWord.partOfSpeech}
                          </p>
                        </div>

                        <div className="flex space-x-4 mt-8">
                          <button
                            onClick={() => {
                              markAsUnknown();
                              nextWord();
                            }}
                            className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Need to Review
                          </button>
                          <button
                            onClick={() => {
                              markAsKnown();
                              nextWord();
                            }}
                            className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            I Know This
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.button
                        key="show"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowAnswer(true)}
                        className="py-4 px-8 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg"
                      >
                        Show Definition
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {studyMode === "quiz" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                    What does "{currentWord.word}" mean?
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">
                    {currentWord.pronunciation}
                  </p>

                  <div className="space-y-3">
                    {quizAnswers.map((answer, index) => (
                      <button
                        key={index}
                        onClick={() => !showResult && handleQuizAnswer(answer)}
                        disabled={showResult}
                        className={`w-full p-4 text-left rounded-lg border transition-colors ${
                          showResult
                            ? answer === currentWord.definition
                              ? "bg-green-100 border-green-500 text-green-800 dark:bg-green-900 dark:border-green-400 dark:text-green-300"
                              : selectedAnswer === answer
                              ? "bg-red-100 border-red-500 text-red-800 dark:bg-red-900 dark:border-red-400 dark:text-red-300"
                              : "bg-gray-100 border-gray-300 text-gray-600 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400"
                            : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
                        }`}
                      >
                        {answer}
                      </button>
                    ))}
                  </div>

                  {showResult && (
                    <div className="mt-6 text-center">
                      <p className="mb-4 text-gray-700 dark:text-gray-300">
                        <span className="font-semibold">Example:</span>{" "}
                        {currentWord.example}
                      </p>
                      <button
                        onClick={nextWord}
                        className="py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {currentWordIndex < filteredVocabulary.length - 1
                          ? "Next Word"
                          : "Finish"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Main Vocabulary View
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Vocabulary Learning
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <BookmarkIcon className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {vocabulary.length}
                </p>
                <p className="text-gray-600 dark:text-gray-400">Total Words</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {masteredWords.length}
                </p>
                <p className="text-gray-600 dark:text-gray-400">Mastered</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-orange-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {wordsToReview.length}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Due for Review
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Study Modes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {studyModes.map((mode, index) => (
            <motion.button
              key={mode.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onClick={() => startStudyMode(mode.id)}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow text-left"
            >
              <div
                className={`${mode.color} text-white w-12 h-12 rounded-lg flex items-center justify-center mb-4`}
              >
                <mode.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {mode.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {mode.description}
              </p>
            </motion.button>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search vocabulary..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category === "all" ? "All Categories" : category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Difficulty
                    </label>
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      {difficulties.map((difficulty) => (
                        <option key={difficulty} value={difficulty}>
                          {difficulty === "all"
                            ? "All Difficulties"
                            : difficulty.charAt(0).toUpperCase() +
                              difficulty.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Vocabulary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredVocabulary.map((word, index) => (
            <motion.div
              key={word.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {word.word}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                    {word.pronunciation}
                  </p>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      word.difficulty === "beginner"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : word.difficulty === "intermediate"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    }`}
                  >
                    {word.difficulty}
                  </span>
                </div>

                {word.mastered && (
                  <CheckCircleIcon className="h-6 w-6 text-green-500" />
                )}
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4">
                <span className="font-semibold">Definition:</span>{" "}
                {word.definition}
              </p>

              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                <span className="font-semibold">Example:</span> {word.example}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {word.category} • {word.partOfSpeech}
                </span>

                <div className="flex space-x-1">
                  <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                    <SpeakerWaveIcon className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-yellow-500 transition-colors">
                    <StarIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>
                    Accuracy:{" "}
                    {word.totalAttempts > 0
                      ? Math.round(
                          (word.correctAttempts / word.totalAttempts) * 100
                        )
                      : 0}
                    %
                  </span>
                  <span>Attempts: {word.totalAttempts}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredVocabulary.length === 0 && (
        <div className="text-center py-12">
          <AcademicCapIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            No vocabulary words found. Try adjusting your search or filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default VocabularyPage;
