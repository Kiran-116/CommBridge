import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MicrophoneIcon,
  StopIcon,
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  AdjustmentsHorizontalIcon,
  StarIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { useAuthStore } from "@/store/authStore";
import { useLearningStore } from "@/store/learningStore";

interface PracticeExercise {
  id: string;
  title: string;
  type: "word" | "sentence" | "paragraph" | "conversation";
  difficulty: "beginner" | "intermediate" | "advanced";
  content: string;
  phonetic: string;
  category: string;
  targetAccuracy: number;
}

interface PronunciationResult {
  overallScore: number;
  wordScores: Array<{
    word: string;
    score: number;
    phonemes: Array<{
      phoneme: string;
      score: number;
      correct: boolean;
    }>;
  }>;
  suggestions: string[];
}

interface RecordingSession {
  id: string;
  exerciseId: string;
  recordedAt: Date;
  duration: number;
  transcription: string;
  pronunciationResult: PronunciationResult;
  audioBlob?: Blob;
}

const practiceExercises: PracticeExercise[] = [
  {
    id: "1",
    title: "Basic Vowel Sounds",
    type: "word",
    difficulty: "beginner",
    content: "cat, bet, sit, hot, cut",
    phonetic: "/kæt/, /bet/, /sɪt/, /hɒt/, /kʌt/",
    category: "Phonetics",
    targetAccuracy: 85,
  },
  {
    id: "2",
    title: "Difficult Consonants",
    type: "word",
    difficulty: "intermediate",
    content: "think, this, ship, measure, church",
    phonetic: "/θɪŋk/, /ðɪs/, /ʃɪp/, /ˈmeʒər/, /tʃɜːrtʃ/",
    category: "Consonants",
    targetAccuracy: 80,
  },
  {
    id: "3",
    title: "Business Introduction",
    type: "sentence",
    difficulty: "intermediate",
    content: "Hello, my name is Sarah and I work in marketing at TechCorp.",
    phonetic:
      "/həˈloʊ/, /maɪ/ /neɪm/ /ɪz/ /ˈsɛrə/ /ænd/ /aɪ/ /wɜːrk/ /ɪn/ /ˈmɑːrkɪtɪŋ/ /æt/ /ˈtekˌkɔːrp/",
    category: "Business",
    targetAccuracy: 90,
  },
  {
    id: "4",
    title: "Ordering at a Restaurant",
    type: "conversation",
    difficulty: "intermediate",
    content:
      "I'd like to order the grilled salmon with a side of vegetables, please.",
    phonetic:
      "/aɪd/ /laɪk/ /tuː/ /ˈɔːrdər/ /ðə/ /grɪld/ /ˈsæmən/ /wɪθ/ /ə/ /saɪd/ /ʌv/ /ˈvedʒtəbəlz/, /pliːz/",
    category: "Daily Life",
    targetAccuracy: 85,
  },
  {
    id: "5",
    title: "Stress and Intonation",
    type: "sentence",
    difficulty: "advanced",
    content: "The project deadline was unexpectedly moved to next Friday.",
    phonetic:
      "/ðə/ /ˈprɑːdʒekt/ /ˈdedˌlaɪn/ /wʌz/ /ˌʌnɪkˈspektɪdli/ /muːvd/ /tuː/ /nekst/ /ˈfraɪˌdeɪ/",
    category: "Advanced",
    targetAccuracy: 95,
  },
  {
    id: "6",
    title: "Tongue Twisters",
    type: "sentence",
    difficulty: "advanced",
    content: "She sells seashells by the seashore.",
    phonetic: "/ʃiː/ /selz/ /ˈsiːˌʃelz/ /baɪ/ /ðə/ /ˈsiːˌʃɔːr/",
    category: "Challenge",
    targetAccuracy: 90,
  },
];

const VoicePracticePage = () => {
  const { user } = useAuthStore();
  const { addRecentActivity } = useLearningStore();
  const [selectedExercise, setSelectedExercise] =
    useState<PracticeExercise | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPhonetics, setShowPhonetics] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentRecording, setCurrentRecording] =
    useState<RecordingSession | null>(null);
  const [recordings, setRecordings] = useState<RecordingSession[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [practiceMode, setPracticeMode] = useState<
    "listen" | "practice" | "assessment"
  >("listen");

  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const categories = [
    "all",
    ...Array.from(new Set(practiceExercises.map((ex) => ex.category))),
  ];
  const difficulties = ["all", "beginner", "intermediate", "advanced"];

  const filteredExercises = practiceExercises.filter((exercise) => {
    const matchesCategory =
      selectedCategory === "all" || exercise.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === "all" ||
      exercise.difficulty === selectedDifficulty;
    return matchesCategory && matchesDifficulty;
  });

  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        processingRecording(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Please allow microphone access to use voice practice features.");
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }

    setIsRecording(false);

    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
  };

  // Mock pronunciation analysis - would integrate with speech recognition API
  const processingRecording = async (audioBlob: Blob) => {
    if (!selectedExercise) return;

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock transcription and pronunciation results
    const mockResult: PronunciationResult = {
      overallScore: Math.floor(Math.random() * 30) + 70,
      wordScores: selectedExercise.content.split(" ").map((word) => ({
        word: word.replace(/[,.]/g, ""),
        score: Math.floor(Math.random() * 40) + 60,
        phonemes: [],
      })),
      suggestions: [
        "Try to emphasize the 'th' sound more clearly",
        "Work on vowel length in 'marketing'",
        "Good intonation pattern overall",
      ],
    };

    const newRecording: RecordingSession = {
      id: Date.now().toString(),
      exerciseId: selectedExercise.id,
      recordedAt: new Date(),
      duration: recordingTime,
      transcription: selectedExercise.content,
      pronunciationResult: mockResult,
      audioBlob,
    };

    setCurrentRecording(newRecording);
    setRecordings((prev) => [newRecording, ...prev]);

    addRecentActivity({
      description: `Completed pronunciation practice: ${selectedExercise.title}`,
      timestamp: new Date(),
      type: "pronunciation",
    });
  };

  const playRecording = (recording: RecordingSession) => {
    if (!recording.audioBlob) return;

    const url = URL.createObjectURL(recording.audioBlob);
    const audio = new Audio(url);

    setIsPlaying(true);
    audio.play();

    audio.onended = () => {
      setIsPlaying(false);
      URL.revokeObjectURL(url);
    };
  };

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-yellow-600";
    if (score >= 70) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreBackground = (score: number) => {
    if (score >= 90) return "bg-green-100 dark:bg-green-900";
    if (score >= 80) return "bg-yellow-100 dark:bg-yellow-900";
    if (score >= 70) return "bg-orange-100 dark:bg-orange-900";
    return "bg-red-100 dark:bg-red-900";
  };

  if (selectedExercise) {
    return (
      <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MicrophoneIcon className="h-8 w-8 text-purple-500" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedExercise.title}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedExercise.category} • {selectedExercise.difficulty}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              {["listen", "practice", "assessment"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setPracticeMode(mode as any)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    practiceMode === mode
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
              <button
                onClick={() => setSelectedExercise(null)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        </div>

        {/* Practice Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {/* Text Display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-6"
            >
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {selectedExercise.content}
                </h2>

                <div className="flex items-center justify-center space-x-4 mb-4">
                  <button
                    onClick={() => speakText(selectedExercise.content)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <SpeakerWaveIcon className="h-5 w-5 mr-2" />
                    Listen
                  </button>

                  <button
                    onClick={() => setShowPhonetics(!showPhonetics)}
                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    {showPhonetics ? (
                      <EyeSlashIcon className="h-5 w-5 mr-2" />
                    ) : (
                      <EyeIcon className="h-5 w-5 mr-2" />
                    )}
                    {showPhonetics ? "Hide" : "Show"} Phonetics
                  </button>
                </div>

                <AnimatePresence>
                  {showPhonetics && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-lg text-gray-600 dark:text-gray-400 font-mono"
                    >
                      {selectedExercise.phonetic}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Recording Controls */}
              <div className="text-center">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-lg"
                    >
                      <MicrophoneIcon className="h-6 w-6 mr-2" />
                      Start Recording
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-lg animate-pulse"
                    >
                      <StopIcon className="h-6 w-6 mr-2" />
                      Stop Recording
                    </button>
                  )}

                  {isRecording && (
                    <div className="text-gray-600 dark:text-gray-400">
                      Recording: {formatTime(recordingTime)}
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Target accuracy: {selectedExercise.targetAccuracy}%
                </p>
              </div>
            </motion.div>

            {/* Current Recording Result */}
            {currentRecording && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Latest Recording Results
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-700 dark:text-gray-300">
                        Overall Score
                      </span>
                      <div
                        className={`text-2xl font-bold ${getScoreColor(
                          currentRecording.pronunciationResult.overallScore
                        )}`}
                      >
                        {currentRecording.pronunciationResult.overallScore}%
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
                      <div
                        className={`h-3 rounded-full transition-all duration-1000 ${
                          currentRecording.pronunciationResult.overallScore >=
                          90
                            ? "bg-green-500"
                            : currentRecording.pronunciationResult
                                .overallScore >= 80
                            ? "bg-yellow-500"
                            : currentRecording.pronunciationResult
                                .overallScore >= 70
                            ? "bg-orange-500"
                            : "bg-red-500"
                        }`}
                        style={{
                          width: `${currentRecording.pronunciationResult.overallScore}%`,
                        }}
                      ></div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => playRecording(currentRecording)}
                        disabled={isPlaying}
                        className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                      >
                        <PlayIcon className="h-4 w-4 mr-1" />
                        {isPlaying ? "Playing..." : "Play Recording"}
                      </button>

                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatTime(currentRecording.duration)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                      Suggestions
                    </h4>
                    <ul className="space-y-2">
                      {currentRecording.pronunciationResult.suggestions.map(
                        (suggestion, index) => (
                          <li
                            key={index}
                            className="text-sm text-gray-600 dark:text-gray-400 flex items-start"
                          >
                            <span className="text-blue-500 mr-2">•</span>
                            {suggestion}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>

                {/* Word-by-word breakdown */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Word Analysis
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {currentRecording.pronunciationResult.wordScores.map(
                      (wordScore, index) => (
                        <div
                          key={index}
                          className={`px-3 py-2 rounded-lg border ${getScoreBackground(
                            wordScore.score
                          )}`}
                        >
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {wordScore.word}
                          </div>
                          <div
                            className={`text-xs ${getScoreColor(
                              wordScore.score
                            )}`}
                          >
                            {wordScore.score}%
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Recording History */}
            {recordings.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Recording History
                </h3>

                <div className="space-y-4">
                  {recordings.slice(0, 5).map((recording, index) => (
                    <div
                      key={recording.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            recording.pronunciationResult.overallScore >= 90
                              ? "bg-green-500"
                              : recording.pronunciationResult.overallScore >= 80
                              ? "bg-yellow-500"
                              : recording.pronunciationResult.overallScore >= 70
                              ? "bg-orange-500"
                              : "bg-red-500"
                          }`}
                        ></div>

                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Attempt #{recordings.length - index}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {recording.recordedAt.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <span
                          className={`font-medium ${getScoreColor(
                            recording.pronunciationResult.overallScore
                          )}`}
                        >
                          {recording.pronunciationResult.overallScore}%
                        </span>

                        <button
                          onClick={() => playRecording(recording)}
                          className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                        >
                          <PlayIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main Voice Practice View
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Voice & Pronunciation Practice
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Improve your pronunciation with AI-powered speech analysis and
            feedback
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
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
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
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
        </div>

        {/* Exercise Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredExercises.map((exercise, index) => (
              <motion.div
                key={exercise.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => setSelectedExercise(exercise)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {exercise.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                      {exercise.category}
                    </p>

                    <div className="flex items-center space-x-2 mb-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          exercise.difficulty === "beginner"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : exercise.difficulty === "intermediate"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {exercise.difficulty}
                      </span>

                      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 rounded-full text-xs font-medium">
                        {exercise.type}
                      </span>
                    </div>
                  </div>

                  <MicrophoneIcon className="h-8 w-8 text-purple-500" />
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium line-clamp-3">
                    {exercise.content}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Target: {exercise.targetAccuracy}%
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speakText(exercise.content);
                    }}
                    className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                  >
                    <SpeakerWaveIcon className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredExercises.length === 0 && (
          <div className="text-center py-12">
            <MicrophoneIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No exercises found. Try adjusting your filters.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default VoicePracticePage;
