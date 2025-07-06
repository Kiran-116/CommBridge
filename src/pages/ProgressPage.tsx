import {
  ClockIcon,
  BookmarkIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  FireIcon,
  TrophyIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { useAuthStore } from "@/store/authStore";

const iconStyle = { width: 32, height: 32, marginBottom: 8 };

// Only use this mockWeeklyData array for the static chart
const mockWeeklyData = [
  { day: "Mon", minutes: 45 },
  { day: "Tue", minutes: 60 },
  { day: "Wed", minutes: 30 },
  { day: "Thu", minutes: 75 },
  { day: "Fri", minutes: 90 },
  { day: "Sat", minutes: 40 },
  { day: "Sun", minutes: 55 },
];
const maxMinutes = Math.max(...mockWeeklyData.map((d) => d.minutes));

const streakDays = 4; // static for now

const achievements = [
  {
    id: "first_chat",
    title: "First Chat",
    description: "Complete your first AI conversation",
    icon: ChatBubbleLeftRightIcon,
    color: "#3b82f6",
    progress: 1,
    target: 1,
    unlocked: true,
  },
  {
    id: "word_wizard",
    title: "Word Wizard",
    description: "Master 50 vocabulary words",
    icon: BookmarkIcon,
    color: "#22c55e",
    progress: 23,
    target: 50,
    unlocked: false,
  },
  {
    id: "consistent_learner",
    title: "Consistent Learner",
    description: "Maintain a 7-day learning streak",
    icon: FireIcon,
    color: "#f97316",
    progress: 4,
    target: 7,
    unlocked: false,
  },
];

const activities = [
  {
    id: 1,
    type: "conversation",
    icon: ChatBubbleLeftRightIcon,
    color: "#3b82f6",
    description: "Completed Business Conversation practice",
    timestamp: "Today, 10:30 AM",
  },
  {
    id: 2,
    type: "vocabulary",
    icon: BookmarkIcon,
    color: "#22c55e",
    description: "Learned 5 new vocabulary words",
    timestamp: "Yesterday, 8:15 PM",
  },
  {
    id: 3,
    type: "achievement",
    icon: TrophyIcon,
    color: "#eab308",
    description: "Achieved 7-day streak!",
    timestamp: "2 days ago, 6:00 PM",
  },
  {
    id: 4,
    type: "pronunciation",
    icon: CheckCircleIcon,
    color: "#a21caf",
    description: "Completed pronunciation exercise",
    timestamp: "3 days ago, 9:45 AM",
  },
];

const ProgressPage = () => {
  const { user } = useAuthStore();
  const stats = user?.stats;

  return (
    <div style={{ padding: 40, background: "#fff", color: "#222" }}>
      <h1 style={{ fontSize: 32, marginBottom: 16 }}>Progress Page</h1>
      <p style={{ fontSize: 20 }}>
        This is a static test. If you see this, static content works!
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 24,
          marginTop: 40,
        }}
      >
        <div
          style={{
            background: "#f3f4f6",
            borderRadius: 12,
            padding: 24,
            textAlign: "center",
          }}
        >
          <ClockIcon style={iconStyle} />
          <div style={{ fontSize: 18, marginBottom: 8 }}>Study Time</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>
            {stats?.totalStudyTime ?? 0} min
          </div>
        </div>
        <div
          style={{
            background: "#f3f4f6",
            borderRadius: 12,
            padding: 24,
            textAlign: "center",
          }}
        >
          <BookmarkIcon style={iconStyle} />
          <div style={{ fontSize: 18, marginBottom: 8 }}>Words Learned</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>
            {stats?.wordsLearned ?? 0}
          </div>
        </div>
        <div
          style={{
            background: "#f3f4f6",
            borderRadius: 12,
            padding: 24,
            textAlign: "center",
          }}
        >
          <ChatBubbleLeftRightIcon style={iconStyle} />
          <div style={{ fontSize: 18, marginBottom: 8 }}>Conversations</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>
            {stats?.conversationsCompleted ?? 0}
          </div>
        </div>
        <div
          style={{
            background: "#f3f4f6",
            borderRadius: 12,
            padding: 24,
            textAlign: "center",
          }}
        >
          <CheckCircleIcon style={iconStyle} />
          <div style={{ fontSize: 18, marginBottom: 8 }}>Accuracy</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>87%</div>
        </div>
      </div>

      {/* Weekly Activity Chart */}
      <div
        style={{
          marginTop: 48,
          background: "#f9fafb",
          borderRadius: 12,
          padding: 32,
          maxWidth: 600,
        }}
      >
        <h2 style={{ fontSize: 24, marginBottom: 24 }}>Weekly Activity</h2>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 16,
            height: 120,
          }}
        >
          {mockWeeklyData.map((d) => (
            <div key={d.day} style={{ flex: 1, textAlign: "center" }}>
              <div
                style={{
                  background: "#3b82f6",
                  height: `${(d.minutes / maxMinutes) * 100}%`,
                  borderRadius: 8,
                  marginBottom: 8,
                  transition: "height 0.5s",
                }}
              />
              <div style={{ fontSize: 16, color: "#555" }}>{d.day}</div>
              <div style={{ fontSize: 14, color: "#888" }}>{d.minutes}m</div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Streak */}
      <div
        style={{
          marginTop: 48,
          background: "#fff7ed",
          borderRadius: 12,
          padding: 32,
          maxWidth: 600,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <FireIcon
            style={{ width: 32, height: 32, color: "#f97316", marginRight: 12 }}
          />
          <h2 style={{ fontSize: 24, color: "#ea580c", margin: 0 }}>
            Learning Streak
          </h2>
        </div>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: "#f97316",
            }}
          >
            {streakDays}
          </div>
          <div style={{ color: "#ea580c", fontSize: 18 }}>Days in a row</div>
        </div>
        {/* Calendar grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 6,
            marginBottom: 16,
          }}
        >
          {Array.from({ length: 21 }, (_, i) => {
            const isActive = i >= 21 - streakDays;
            const isToday = i === 20;
            return (
              <div
                key={i}
                style={{
                  aspectRatio: "1/1",
                  borderRadius: 6,
                  background: isActive
                    ? isToday
                      ? "#f97316"
                      : "#fed7aa"
                    : "#f3f4f6",
                  color: isActive ? (isToday ? "#fff" : "#ea580c") : "#bbb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 500,
                  fontSize: 14,
                }}
              >
                {i + 1}
              </div>
            );
          })}
        </div>
        {/* Progress bar */}
        <div
          style={{
            background: "#fed7aa",
            borderRadius: 8,
            height: 8,
            width: "100%",
          }}
        >
          <div
            style={{
              background: "#f97316",
              height: 8,
              borderRadius: 8,
              width: `${(streakDays / 7) * 100}%`,
              transition: "width 0.5s",
            }}
          />
        </div>
        <div
          style={{
            textAlign: "center",
            marginTop: 8,
            color: "#ea580c",
            fontSize: 14,
          }}
        >
          Streak Goal: 7 days
        </div>
      </div>

      {/* Achievements */}
      <div
        style={{
          marginTop: 48,
          background: "#fef9c3",
          borderRadius: 12,
          padding: 32,
          maxWidth: 900,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <TrophyIcon
            style={{ width: 32, height: 32, color: "#eab308", marginRight: 12 }}
          />
          <h2 style={{ fontSize: 24, color: "#eab308", margin: 0 }}>
            Achievements
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          {achievements.map((ach) => {
            const percent = Math.min((ach.progress / ach.target) * 100, 100);
            return (
              <div
                key={ach.id}
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: 24,
                  boxShadow: ach.unlocked
                    ? "0 0 0 2px #fde68a"
                    : "0 0 0 1px #e5e7eb",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <ach.icon
                    style={{
                      width: 28,
                      height: 28,
                      color: ach.color,
                      marginRight: 10,
                    }}
                  />
                  <div style={{ fontWeight: 600, fontSize: 18 }}>
                    {ach.title}
                  </div>
                  {ach.unlocked && (
                    <span
                      style={{
                        marginLeft: 8,
                        color: "#eab308",
                        fontWeight: 700,
                      }}
                    >
                      ✓
                    </span>
                  )}
                </div>
                <div style={{ color: "#666", fontSize: 15, marginBottom: 16 }}>
                  {ach.description}
                </div>
                <div
                  style={{
                    background: "#f3f4f6",
                    borderRadius: 8,
                    height: 8,
                    width: "100%",
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      background: ach.unlocked ? "#eab308" : ach.color,
                      height: 8,
                      borderRadius: 8,
                      width: `${percent}%`,
                      transition: "width 0.5s",
                    }}
                  />
                </div>
                <div
                  style={{ fontSize: 14, color: "#888", textAlign: "right" }}
                >
                  {ach.progress} / {ach.target}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activities */}
      <div
        style={{
          marginTop: 48,
          background: "#f3f4f6",
          borderRadius: 12,
          padding: 32,
          maxWidth: 700,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <CalendarDaysIcon
            style={{ width: 32, height: 32, color: "#64748b", marginRight: 12 }}
          />
          <h2 style={{ fontSize: 24, color: "#334155", margin: 0 }}>
            Recent Activities
          </h2>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {activities.map((act) => (
            <div
              key={act.id}
              style={{
                display: "flex",
                alignItems: "center",
                background: "#fff",
                borderRadius: 10,
                padding: 18,
                boxShadow: "0 0 0 1px #e5e7eb",
              }}
            >
              <act.icon
                style={{
                  width: 24,
                  height: 24,
                  color: act.color,
                  marginRight: 16,
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 16 }}>
                  {act.description}
                </div>
                <div style={{ color: "#888", fontSize: 14 }}>
                  {act.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
