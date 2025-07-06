import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  MicrophoneIcon,
  VideoCameraIcon,
  HandRaisedIcon,
  BookOpenIcon,
  ClockIcon,
  UsersIcon,
  PlusIcon,
  XMarkIcon,
  SpeakerWaveIcon,
  HeartIcon,
  EllipsisVerticalIcon,
  AdjustmentsHorizontalIcon,
  StarIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { useAuthStore } from "@/store/authStore";
import { useLearningStore } from "@/store/learningStore";

interface DiscussionRoom {
  id: string;
  title: string;
  topic: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  language: string;
  maxParticipants: number;
  currentParticipants: number;
  hostId: string;
  hostName: string;
  createdAt: Date;
  duration: number; // in minutes
  isActive: boolean;
  tags: string[];
  participants: Participant[];
}

interface Participant {
  id: string;
  name: string;
  avatar: string;
  level: string;
  isHost: boolean;
  isModerator: boolean;
  isOnline: boolean;
  joinedAt: Date;
  hasRaisedHand: boolean;
  isMuted: boolean;
  isVideoOn: boolean;
}

interface Message {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: Date;
  type: "message" | "system" | "topic" | "poll";
  reactions: { [emoji: string]: string[] }; // emoji -> user IDs
  isTranslated?: boolean;
  originalText?: string;
  translatedText?: string;
}

interface DiscussionTopic {
  id: string;
  title: string;
  description: string;
  questions: string[];
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: number;
  tags: string[];
}

const mockDiscussionTopics: DiscussionTopic[] = [
  {
    id: "1",
    title: "Travel Experiences",
    description:
      "Share your most memorable travel experiences and cultural discoveries",
    questions: [
      "What's the most interesting place you've ever visited?",
      "How do you prepare for traveling to a new country?",
      "What cultural differences have surprised you the most?",
      "How has traveling changed your perspective on life?",
    ],
    category: "Culture & Travel",
    difficulty: "intermediate",
    estimatedTime: 30,
    tags: ["travel", "culture", "experiences"],
  },
  {
    id: "2",
    title: "Technology in Education",
    description:
      "Discuss how technology is transforming the way we learn and teach",
    questions: [
      "How has technology changed the way you learn?",
      "What are the benefits and drawbacks of online learning?",
      "How can AI help personalize education?",
      "What skills will be most important in the future?",
    ],
    category: "Education & Technology",
    difficulty: "advanced",
    estimatedTime: 45,
    tags: ["technology", "education", "future", "AI"],
  },
  {
    id: "3",
    title: "Daily Routines & Habits",
    description:
      "Share and discuss daily routines, healthy habits, and lifestyle choices",
    questions: [
      "What does your typical day look like?",
      "What healthy habits have you recently adopted?",
      "How do you stay motivated and productive?",
      "What advice would you give for better work-life balance?",
    ],
    category: "Lifestyle & Wellness",
    difficulty: "beginner",
    estimatedTime: 25,
    tags: ["daily life", "habits", "wellness", "productivity"],
  },
  {
    id: "4",
    title: "Environmental Challenges",
    description:
      "Explore environmental issues and sustainable living practices",
    questions: [
      "What environmental issues concern you most?",
      "How do you try to live more sustainably?",
      "What role should governments play in protecting the environment?",
      "How can individuals make a bigger impact?",
    ],
    category: "Environment & Sustainability",
    difficulty: "intermediate",
    estimatedTime: 40,
    tags: ["environment", "sustainability", "climate", "future"],
  },
];

const mockRooms: DiscussionRoom[] = [
  {
    id: "1",
    title: "Coffee Chat: Weekend Plans",
    topic: "Daily Routines & Habits",
    description: "Casual conversation about weekend activities and hobbies",
    level: "beginner",
    language: "English",
    maxParticipants: 6,
    currentParticipants: 4,
    hostId: "host1",
    hostName: "Sarah Johnson",
    createdAt: new Date(Date.now() - 10 * 60 * 1000),
    duration: 30,
    isActive: true,
    tags: ["casual", "weekend", "hobbies"],
    participants: [],
  },
  {
    id: "2",
    title: "Tech Talk: AI in Education",
    topic: "Technology in Education",
    description: "Deep dive into how AI is transforming learning experiences",
    level: "advanced",
    language: "English",
    maxParticipants: 8,
    currentParticipants: 6,
    hostId: "host2",
    hostName: "David Chen",
    createdAt: new Date(Date.now() - 25 * 60 * 1000),
    duration: 60,
    isActive: true,
    tags: ["technology", "AI", "education", "future"],
    participants: [],
  },
  {
    id: "3",
    title: "Travel Stories Circle",
    topic: "Travel Experiences",
    description:
      "Share your most memorable travel adventures and cultural insights",
    level: "intermediate",
    language: "English",
    maxParticipants: 10,
    currentParticipants: 3,
    hostId: "host3",
    hostName: "Maria Rodriguez",
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
    duration: 45,
    isActive: true,
    tags: ["travel", "culture", "stories", "experiences"],
    participants: [],
  },
];

const GroupDiscussionPage = () => {
  const { user } = useAuthStore();
  const { addRecentActivity } = useLearningStore();
  const [selectedRoom, setSelectedRoom] = useState<DiscussionRoom | null>(null);
  const [rooms, setRooms] = useState<DiscussionRoom[]>(mockRooms);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<DiscussionTopic | null>(
    null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showTopicSuggestions, setShowTopicSuggestions] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [handRaised, setHandRaised] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [newRoomData, setNewRoomData] = useState({
    title: "",
    description: "",
    topic: "",
    level: "beginner" as const,
    maxParticipants: 6,
    duration: 30,
    tags: "",
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mock real-time functionality
  useEffect(() => {
    if (selectedRoom) {
      // Mock incoming messages
      const interval = setInterval(() => {
        if (Math.random() > 0.7) {
          const mockMessage: Message = {
            id: Date.now().toString(),
            userId: "user" + Math.floor(Math.random() * 100),
            userName: "Discussion Partner",
            userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`,
            content:
              "This is a great discussion topic! I'd love to hear more perspectives on this.",
            timestamp: new Date(),
            type: "message",
            reactions: {},
          };
          setMessages((prev) => [...prev, mockMessage]);
        }
      }, 15000);

      return () => clearInterval(interval);
    }
  }, [selectedRoom]);

  const joinRoom = (room: DiscussionRoom) => {
    setSelectedRoom(room);
    setMessages([
      {
        id: "welcome",
        userId: "system",
        userName: "System",
        userAvatar: "",
        content: `Welcome to "${room.title}"! Topic: ${room.topic}`,
        timestamp: new Date(),
        type: "system",
        reactions: {},
      },
    ]);

    // Mock participants
    const mockParticipants: Participant[] = [
      {
        id: user?.id || "current-user",
        name: user?.firstName + " " + user?.lastName || "You",
        avatar: user?.avatar || "",
        level: user?.level || "beginner",
        isHost: false,
        isModerator: false,
        isOnline: true,
        joinedAt: new Date(),
        hasRaisedHand: false,
        isMuted: false,
        isVideoOn: false,
      },
      {
        id: "host1",
        name: room.hostName,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${room.hostId}`,
        level: "advanced",
        isHost: true,
        isModerator: true,
        isOnline: true,
        joinedAt: new Date(Date.now() - 30 * 60 * 1000),
        hasRaisedHand: false,
        isMuted: false,
        isVideoOn: true,
      },
      {
        id: "participant1",
        name: "Alex Smith",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=alex`,
        level: "intermediate",
        isHost: false,
        isModerator: false,
        isOnline: true,
        joinedAt: new Date(Date.now() - 20 * 60 * 1000),
        hasRaisedHand: false,
        isMuted: true,
        isVideoOn: true,
      },
      {
        id: "participant2",
        name: "Emma Wilson",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=emma`,
        level: "beginner",
        isHost: false,
        isModerator: false,
        isOnline: true,
        joinedAt: new Date(Date.now() - 10 * 60 * 1000),
        hasRaisedHand: true,
        isMuted: false,
        isVideoOn: false,
      },
    ];

    setParticipants(mockParticipants);

    addRecentActivity({
      description: `Joined group discussion: ${room.title}`,
      timestamp: new Date(),
      type: "conversation",
    });
  };

  const leaveRoom = () => {
    setSelectedRoom(null);
    setMessages([]);
    setParticipants([]);
    setHandRaised(false);
    setIsMuted(false);
    setIsVideoOn(false);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedRoom) return;

    const message: Message = {
      id: Date.now().toString(),
      userId: user?.id || "current-user",
      userName: user?.firstName + " " + user?.lastName || "You",
      userAvatar: user?.avatar || "",
      content: newMessage,
      timestamp: new Date(),
      type: "message",
      reactions: {},
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  const createRoom = () => {
    if (!newRoomData.title || !newRoomData.topic) return;

    const room: DiscussionRoom = {
      id: Date.now().toString(),
      title: newRoomData.title,
      topic: newRoomData.topic,
      description: newRoomData.description,
      level: newRoomData.level,
      language: "English",
      maxParticipants: newRoomData.maxParticipants,
      currentParticipants: 1,
      hostId: user?.id || "host",
      hostName: user?.firstName + " " + user?.lastName || "Host",
      createdAt: new Date(),
      duration: newRoomData.duration,
      isActive: true,
      tags: newRoomData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      participants: [],
    };

    setRooms((prev) => [room, ...prev]);
    setShowCreateRoom(false);
    setNewRoomData({
      title: "",
      description: "",
      topic: "",
      level: "beginner",
      maxParticipants: 6,
      duration: 30,
      tags: "",
    });

    addRecentActivity({
      description: `Created group discussion: ${room.title}`,
      timestamp: new Date(),
      type: "conversation",
    });
  };

  const addReaction = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const reactions = { ...msg.reactions };
          const userId = user?.id || "current-user";

          if (!reactions[emoji]) {
            reactions[emoji] = [];
          }

          if (reactions[emoji].includes(userId)) {
            reactions[emoji] = reactions[emoji].filter((id) => id !== userId);
            if (reactions[emoji].length === 0) {
              delete reactions[emoji];
            }
          } else {
            reactions[emoji].push(userId);
          }

          return { ...msg, reactions };
        }
        return msg;
      })
    );
  };

  const filteredRooms = rooms.filter((room) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "active") return room.isActive;
    if (selectedFilter === "my-level") return room.level === user?.level;
    return true;
  });

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  // Room View (when user is in a discussion)
  if (selectedRoom) {
    return (
      <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <UserGroupIcon className="h-8 w-8 text-blue-500" />
                <div>
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedRoom.title}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedRoom.topic} • {participants.length} participants
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                {participants.slice(0, 5).map((participant) => (
                  <div
                    key={participant.id}
                    className="relative"
                    title={participant.name}
                  >
                    <img
                      src={participant.avatar}
                      alt={participant.name}
                      className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800"
                    />
                    {participant.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    )}
                  </div>
                ))}
                {participants.length > 5 && (
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300">
                    +{participants.length - 5}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setHandRaised(!handRaised)}
                className={`p-2 rounded-lg transition-colors ${
                  handRaised
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
                title="Raise hand"
              >
                <HandRaisedIcon className="h-5 w-5" />
              </button>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-2 rounded-lg transition-colors ${
                  isMuted
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
                title={isMuted ? "Unmute" : "Mute"}
              >
                <MicrophoneIcon className="h-5 w-5" />
              </button>

              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`p-2 rounded-lg transition-colors ${
                  isVideoOn
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
                title={isVideoOn ? "Turn off video" : "Turn on video"}
              >
                <VideoCameraIcon className="h-5 w-5" />
              </button>

              <button
                onClick={leaveRoom}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Leave
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex space-x-3 ${
                    message.type === "system" ? "justify-center" : ""
                  }`}
                >
                  {message.type === "system" ? (
                    <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-lg text-sm">
                      {message.content}
                    </div>
                  ) : (
                    <>
                      <img
                        src={message.userAvatar}
                        alt={message.userName}
                        className="w-8 h-8 rounded-full flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {message.userName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
                          <p className="text-gray-900 dark:text-white text-sm">
                            {message.content}
                          </p>

                          {/* Reactions */}
                          {Object.keys(message.reactions).length > 0 && (
                            <div className="flex items-center space-x-2 mt-2">
                              {Object.entries(message.reactions).map(
                                ([emoji, userIds]) => (
                                  <button
                                    key={emoji}
                                    onClick={() =>
                                      addReaction(message.id, emoji)
                                    }
                                    className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-1 text-xs hover:bg-gray-200 dark:hover:bg-gray-600"
                                  >
                                    <span>{emoji}</span>
                                    <span className="text-gray-600 dark:text-gray-400">
                                      {userIds.length}
                                    </span>
                                  </button>
                                )
                              )}
                            </div>
                          )}

                          {/* Quick reactions */}
                          <div className="flex items-center space-x-1 mt-2">
                            {["👍", "❤️", "😂", "🤔", "👏"].map((emoji) => (
                              <button
                                key={emoji}
                                onClick={() => addReaction(message.id, emoji)}
                                className="text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-1 transition-colors"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Participants Panel */}
          <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Participants ({participants.length})
            </h3>

            <div className="space-y-3">
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="relative">
                    <img
                      src={participant.avatar}
                      alt={participant.name}
                      className="w-10 h-10 rounded-full"
                    />
                    {participant.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-700"></div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {participant.name}
                      </p>
                      {participant.isHost && (
                        <StarIcon className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {participant.level}
                    </p>
                  </div>

                  <div className="flex items-center space-x-1">
                    {participant.hasRaisedHand && (
                      <HandRaisedIcon className="h-4 w-4 text-yellow-500" />
                    )}
                    {participant.isMuted && (
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    )}
                    {participant.isVideoOn && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Group Discussion View
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Group Discussions
            </h1>
            <button
              onClick={() => setShowCreateRoom(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Room
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Join conversations with learners from around the world
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4 mb-8">
          {["all", "active", "my-level"].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedFilter === filter
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {filter.charAt(0).toUpperCase() +
                filter.slice(1).replace("-", " ")}
            </button>
          ))}
        </div>

        {/* Discussion Rooms */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <AnimatePresence>
            {filteredRooms.map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {room.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                      {room.description}
                    </p>

                    <div className="flex items-center space-x-2 mb-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          room.level === "beginner"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : room.level === "intermediate"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {room.level}
                      </span>

                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {room.topic}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {room.isActive && (
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    )}
                    <UserGroupIcon className="h-6 w-6 text-blue-500" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span>
                    {room.currentParticipants}/{room.maxParticipants}{" "}
                    participants
                  </span>
                  <span>{room.duration} min</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${room.hostId}`}
                      alt={room.hostName}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {room.hostName}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {getTimeAgo(room.createdAt)}
                    </span>
                    <button
                      onClick={() => joinRoom(room)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Join
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Discussion Topics */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Popular Discussion Topics
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockDiscussionTopics.map((topic, index) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {topic.title}
                  </h4>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      topic.difficulty === "beginner"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : topic.difficulty === "intermediate"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    }`}
                  >
                    {topic.difficulty}
                  </span>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {topic.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{topic.category}</span>
                  <span>{topic.estimatedTime} min</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Create Room Modal */}
      <AnimatePresence>
        {showCreateRoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Create Discussion Room
                </h3>
                <button
                  onClick={() => setShowCreateRoom(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Room Title
                  </label>
                  <input
                    type="text"
                    value={newRoomData.title}
                    onChange={(e) =>
                      setNewRoomData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter room title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Topic
                  </label>
                  <select
                    value={newRoomData.topic}
                    onChange={(e) =>
                      setNewRoomData((prev) => ({
                        ...prev,
                        topic: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select a topic</option>
                    {mockDiscussionTopics.map((topic) => (
                      <option key={topic.id} value={topic.title}>
                        {topic.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newRoomData.description}
                    onChange={(e) =>
                      setNewRoomData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Describe your discussion room"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Level
                    </label>
                    <select
                      value={newRoomData.level}
                      onChange={(e) =>
                        setNewRoomData((prev) => ({
                          ...prev,
                          level: e.target.value as any,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Duration (min)
                    </label>
                    <input
                      type="number"
                      value={newRoomData.duration}
                      onChange={(e) =>
                        setNewRoomData((prev) => ({
                          ...prev,
                          duration: parseInt(e.target.value) || 30,
                        }))
                      }
                      min="15"
                      max="120"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Max Participants
                  </label>
                  <input
                    type="number"
                    value={newRoomData.maxParticipants}
                    onChange={(e) =>
                      setNewRoomData((prev) => ({
                        ...prev,
                        maxParticipants: parseInt(e.target.value) || 6,
                      }))
                    }
                    min="2"
                    max="20"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateRoom(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createRoom}
                  disabled={!newRoomData.title || !newRoomData.topic}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Create Room
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GroupDiscussionPage;
