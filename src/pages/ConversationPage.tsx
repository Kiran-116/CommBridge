import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  MicrophoneIcon,
  StopIcon,
} from "@heroicons/react/24/outline";
import { useAuthStore } from "@/store/authStore";
import { useLearningStore } from "@/store/learningStore";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant" | "system";
  timestamp: Date;
  feedback?: {
    grammar: number;
    vocabulary: number;
    fluency: number;
    suggestions: string[];
  };
}

interface ConversationScenario {
  id: string;
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  icon: string;
  systemPrompt: string;
  objectives: string[];
}

const conversationScenarios: ConversationScenario[] = [
  {
    id: "job_interview",
    title: "Job Interview",
    description: "Practice professional interview conversations",
    level: "intermediate",
    icon: "💼",
    systemPrompt:
      "You are an experienced HR interviewer conducting a job interview. Ask relevant questions about the candidate's experience, skills, and motivations. Be professional but friendly. Provide constructive feedback on their responses.",
    objectives: [
      "Professional communication",
      "Clear articulation",
      "Confidence building",
    ],
  },
  {
    id: "restaurant",
    title: "Restaurant Ordering",
    description: "Learn to order food and communicate with restaurant staff",
    level: "beginner",
    icon: "🍽️",
    systemPrompt:
      "You are a friendly waiter/waitress at a restaurant. Help the customer order food, answer questions about the menu, and handle any special requests. Be patient and helpful.",
    objectives: ["Food vocabulary", "Polite requests", "Question asking"],
  },
  {
    id: "business_meeting",
    title: "Business Meeting",
    description: "Practice formal business communication",
    level: "advanced",
    icon: "📊",
    systemPrompt:
      "You are a business colleague in a meeting discussing project updates and decisions. Engage in professional dialogue, ask for opinions, and discuss business strategies.",
    objectives: [
      "Business vocabulary",
      "Formal communication",
      "Decision making",
    ],
  },
  {
    id: "casual_chat",
    title: "Casual Conversation",
    description: "Practice everyday small talk and social interactions",
    level: "beginner",
    icon: "☕",
    systemPrompt:
      "You are a friendly person having a casual conversation. Talk about everyday topics like weather, hobbies, family, or current events. Keep it light and engaging.",
    objectives: ["Small talk", "Social skills", "Everyday vocabulary"],
  },
  {
    id: "shopping",
    title: "Shopping",
    description: "Learn to communicate while shopping and asking for help",
    level: "beginner",
    icon: "🛍️",
    systemPrompt:
      "You are a helpful shop assistant. Help the customer find what they're looking for, explain products, discuss prices, and handle transactions.",
    objectives: [
      "Shopping vocabulary",
      "Price discussions",
      "Product inquiries",
    ],
  },
  {
    id: "travel",
    title: "Travel & Tourism",
    description: "Practice travel-related conversations",
    level: "intermediate",
    icon: "✈️",
    systemPrompt:
      "You are a helpful travel guide or tourism information assistant. Help the traveler with directions, recommendations, bookings, and travel advice.",
    objectives: [
      "Travel vocabulary",
      "Direction asking",
      "Cultural communication",
    ],
  },
];

const ConversationPage = () => {
  const { user } = useAuthStore();
  const { addRecentActivity } = useLearningStore();
  const [selectedScenario, setSelectedScenario] =
    useState<ConversationScenario | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startConversation = (scenario: ConversationScenario) => {
    setSelectedScenario(scenario);
    setConversationStarted(true);
    setMessages([
      {
        id: "welcome",
        content: `Welcome to the ${scenario.title} practice! I'm here to help you practice this scenario. Let's begin!`,
        role: "assistant",
        timestamp: new Date(),
      },
    ]);

    addRecentActivity({
      description: `Started ${scenario.title} conversation practice`,
      timestamp: new Date(),
      type: "conversation",
    });
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !selectedScenario) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Here you would integrate with the Gemini API
      // For now, I'll create a mock response
      const response = await mockAIResponse(inputMessage, selectedScenario);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        role: "assistant",
        timestamp: new Date(),
        feedback: response.feedback,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock AI response (replace with actual Gemini API call)
  const mockAIResponse = async (
    message: string,
    scenario: ConversationScenario
  ) => {
    // Simulate API delay
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 2000)
    );

    const responses = {
      job_interview: [
        "That's great experience! Can you tell me about a challenging project you worked on?",
        "Excellent! What motivates you in your professional career?",
        "I see. How do you handle working under pressure?",
        "That's a good answer. What are your long-term career goals?",
      ],
      restaurant: [
        "Great choice! Would you like any appetizers to start?",
        "Certainly! Our chef recommends the pasta special today. What would you prefer to drink?",
        "Perfect! How would you like your meal prepared?",
        "Excellent selection! Your order will be ready in about 15 minutes.",
      ],
      casual_chat: [
        "That sounds interesting! I love hearing about that.",
        "Oh really? That's quite fascinating. What do you think about it?",
        "I completely understand. Have you considered trying something different?",
        "That's wonderful! It's always great to discover new things.",
      ],
    };

    const scenarioResponses =
      responses[scenario.id as keyof typeof responses] || responses.casual_chat;
    const randomResponse =
      scenarioResponses[Math.floor(Math.random() * scenarioResponses.length)];

    return {
      content: randomResponse,
      feedback: {
        grammar: Math.floor(Math.random() * 30) + 70,
        vocabulary: Math.floor(Math.random() * 30) + 70,
        fluency: Math.floor(Math.random() * 30) + 70,
        suggestions: [
          "Consider using more varied vocabulary",
          "Try to speak more naturally",
          "Good job with pronunciation!",
        ],
      },
    };
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const endConversation = () => {
    setSelectedScenario(null);
    setConversationStarted(false);
    setMessages([]);
    addRecentActivity({
      description: `Completed conversation practice`,
      timestamp: new Date(),
      type: "conversation",
    });
  };

  if (!conversationStarted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <ChatBubbleLeftRightIcon className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              AI Conversation Practice
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Choose a scenario and practice real conversations with our AI
              tutor. Get instant feedback on your grammar, vocabulary, and
              fluency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {conversationScenarios.map((scenario, index) => (
              <motion.div
                key={scenario.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => startConversation(scenario)}
              >
                <div className="text-4xl mb-4">{scenario.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {scenario.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                  {scenario.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      scenario.level === "beginner"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : scenario.level === "intermediate"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    }`}
                  >
                    {scenario.level.charAt(0).toUpperCase() +
                      scenario.level.slice(1)}
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Learning objectives:
                  </p>
                  {scenario.objectives.map((objective, idx) => (
                    <p
                      key={idx}
                      className="text-xs text-gray-500 dark:text-gray-400"
                    >
                      • {objective}
                    </p>
                  ))}
                </div>

                <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Start Practice
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{selectedScenario?.icon}</div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedScenario?.title}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Practice session with AI tutor
              </p>
            </div>
          </div>
          <button
            onClick={endConversation}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            End Session
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>

                  {message.feedback && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-xs font-medium mb-2">Feedback:</p>
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        <div className="text-center">
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            Grammar
                          </div>
                          <div className="text-sm font-medium">
                            {message.feedback.grammar}%
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            Vocabulary
                          </div>
                          <div className="text-sm font-medium">
                            {message.feedback.vocabulary}%
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            Fluency
                          </div>
                          <div className="text-sm font-medium">
                            {message.feedback.fluency}%
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {message.feedback.suggestions.map((suggestion, idx) => (
                          <p
                            key={idx}
                            className="text-xs text-gray-600 dark:text-gray-400"
                          >
                            • {suggestion}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`p-3 rounded-lg transition-colors ${
                isRecording
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {isRecording ? (
                <StopIcon className="h-5 w-5" />
              ) : (
                <MicrophoneIcon className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
