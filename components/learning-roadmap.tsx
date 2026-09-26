"use client";

import { ArrowRight, ClipboardCheck, Coins, Flame, Gift, Map, Sparkles, UserRound } from "lucide-react";

export const journeys = [
  {
    id: "magic-school", emoji: "✨", theme: "Học viện Ánh Sao", level: "Pre-A1", grades: "Khối 3–4",
    description: "Đi qua sáu địa danh nhiệm màu và xây nền tiếng Anh đầu tiên.", image: "/map-star-academy.png", accent: "school",
    units: [
      { landmark: "Cổng Chào Kỳ Diệu", topic: "Chào hỏi & giới thiệu", position: [17, 78] },
      { landmark: "Quảng trường Cầu Vồng", topic: "Số đếm & màu sắc", position: [30, 57] },
      { landmark: "Làng Cây Sum Vầy", topic: "Gia đình & bạn bè", position: [51, 45] },
      { landmark: "Lớp học Bay", topic: "Trường học & lớp học", position: [68, 28] },
      { landmark: "Tháp Đồng hồ Ngày Mới", topic: "Hoạt động hằng ngày", position: [80, 55] },
      { landmark: "Đài Quan sát Ánh Sao", topic: "Đánh giá năng lực cuối Level", position: [89, 23] },
    ],
  },
  {
    id: "animal-forest", emoji: "🌲", theme: "Rừng Thì Thầm", level: "Pre-A1", grades: "Khối 4–5",
    description: "Khám phá khu rừng biết nói qua các tình huống nghe – nói trực quan.", image: "/map-whispering-forest.png", accent: "forest",
    units: [
      { landmark: "Làng Gương Mặt", topic: "Mọi người quanh em", position: [18, 78] },
      { landmark: "Hang Kho Báu", topic: "Đồ vật quanh em", position: [30, 56] },
      { landmark: "Chợ Nấm Ngọt", topic: "Đồ ăn & thức uống", position: [47, 34] },
      { landmark: "Hồ La Bàn", topic: "Địa điểm & vị trí", position: [63, 68] },
      { landmark: "Sân Rừng Vận Động", topic: "Hành động & khả năng", position: [76, 41] },
      { landmark: "Cây Trí Nhớ", topic: "Đánh giá năng lực cuối Level", position: [89, 25] },
    ],
  },
  {
    id: "adventure-city", emoji: "🏔️", theme: "Vương quốc Núi Pha Lê", level: "A1", grades: "Khối 5–7",
    description: "Chinh phục tiếng Anh từ thung lũng xanh tới đỉnh núi pha lê.", image: "/map-crystal-mountain.png", accent: "city",
    units: [
      { landmark: "Trạm Gương Khởi Hành", topic: "Giới thiệu bản thân", position: [15, 79] },
      { landmark: "Làng Sườn Núi", topic: "Nhà ở & trường học", position: [33, 59] },
      { landmark: "Tháp Thời Gian", topic: "Thói quen hằng ngày", position: [48, 39] },
      { landmark: "Chợ Đèo Kỳ Ảo", topic: "Mua sắm & đồ ăn", position: [64, 34] },
      { landmark: "Hẻm Núi La Bàn", topic: "Du lịch & chỉ đường", position: [85, 34] },
      { landmark: "Đỉnh Pha Lê", topic: "Đánh giá năng lực cuối Level", position: [91, 15] },
    ],
  },
] as const;

type Props = {
  activeJourneyId: (typeof journeys)[number]["id"];
  onChangeJourney: () => void;
  onStart: (lesson: number) => void;
  onCompanion: () => void;
  onStreak: () => void;
  onAssessment: () => void;
  onShowAccess: () => void;
  onLockedMap?: () => void;
  completedLessons?: number[];
  coins: number;
  streak: number;
  companionId: "dragon" | "owl" | "fox" | null;
  activePlan: string;
};

type SelectionProps = Pick<Props, "coins" | "streak" | "companionId" | "activePlan" | "onCompanion" | "onStreak" | "onShowAccess"> & {
  onSelect: (journeyId: (typeof journeys)[number]["id"]) => void;
};

export function JourneySelection({ onSelect, onCompanion, onStreak, onShowAccess, coins, streak, companionId, activePlan }: SelectionProps) {
  return <main className="roadmap-screen journey-select-screen">
    <header className="road-topbar">
      <div className="road-brand"><span>E</span><div><b>ENGLISH IN</b><small>WONDERLAND</small></div></div>
      <div className="road-profile"><button className="access-demo-button" onClick={onShowAccess}><UserRound size={16}/><span>Login &amp; thanh toán</span><small>{activePlan}</small></button><button className="companion-stat" aria-label={companionId ? "Mở khu vườn linh vật" : "Xem rương linh vật"} onClick={onCompanion}><Gift size={18}/><b>{companionId ? "Linh vật" : "Rương"}</b></button><button className="coin-stat" aria-label={`${coins} Xu ôn luyện`} onClick={onCompanion}><Coins size={18}/><b>{coins}</b><span>Xu</span></button><button className="streak-stat" onClick={onStreak}><Flame size={18} fill="currentColor"/><b>{streak}</b><span>ngày</span></button><span className="road-avatar">AN</span></div>
    </header>
    <section className="journey-select-wrap">
      <span className="road-kicker"><Map size={15}/> BẮT ĐẦU HÀNH TRÌNH</span>
      <h1>Em đang học khối nào?</h1>
      <p>Chọn khối để nhận lộ trình và bản đồ phù hợp với em.</p>
      <div className="journey-select-grid">
        {journeys.map((journey, index) => <button key={journey.id} className={`journey-select-card ${journey.accent}`} onClick={() => onSelect(journey.id)}>
          <span className="journey-card-number">{index + 1}</span>
          <span className="journey-card-emoji">{journey.emoji}</span>
          <span className="journey-card-copy"><small>{journey.level}</small><b>{journey.grades}</b><em>{journey.description}</em></span>
          <span className="journey-card-go"><ArrowRight size={21}/></span>
        </button>)}
      </div>
      <small className="journey-select-note"><Sparkles size={14}/> Em có thể đổi khối bất cứ lúc nào trong màn lộ trình.</small>
    </section>
  </main>;
}

export default function LearningRoadmap({ activeJourneyId, onChangeJourney, onStart, onCompanion, onStreak, onAssessment, onShowAccess, completedLessons = [], coins, streak, companionId, activePlan }: Props) {
  const activeJourney = journeys.find(journey => journey.id === activeJourneyId) ?? journeys[0];
  const completedCount = completedLessons.filter(id => id >= 1 && id <= 4).length;
  const nextLesson = [1, 2, 3, 4].find(id => !completedLessons.includes(id)) ?? 4;
  const progress = completedCount * 25;
  const assessmentReady = completedCount === 4;

  return <main className="roadmap-screen">
    <header className="road-topbar">
      <div className="road-brand"><span>E</span><div><b>ENGLISH IN</b><small>WONDERLAND</small></div></div>
      <div className="road-profile"><button className="access-demo-button" onClick={onShowAccess}><UserRound size={16}/><span>Login &amp; thanh toán</span><small>{activePlan}</small></button><button className="companion-stat" aria-label={companionId ? "Mở khu vườn linh vật" : "Xem rương linh vật"} onClick={onCompanion}><Gift size={18}/><b>{companionId ? "Linh vật" : "Rương"}</b></button><button className="coin-stat" aria-label={`${coins} Xu ôn luyện`} onClick={onCompanion}><Coins size={18}/><b>{coins}</b><span>Xu</span></button><button className="streak-stat" onClick={onStreak}><Flame size={18} fill="currentColor"/><b>{streak}</b><span>ngày</span></button><span className="road-avatar">AN</span></div>
    </header>

    <section className="road-heading">
      <div><span className="road-kicker"><Map size={15} /> LEVEL 1 · {activeJourney.grades.toUpperCase()} · {activeJourney.level}</span><h1>{activeJourney.theme}</h1><p>Mỗi bản đồ là một Level. Đi đến mốc đánh giá cuối để hoàn thành hành trình.</p><button className="change-journey" onClick={onChangeJourney}>Đổi khối học</button></div>
      <div className="level-progress"><span><b>{completedCount}</b>/4 Lesson đã hoàn thành</span><i><em style={{ width: `${progress}%` }} /></i><small>{assessmentReady ? "Mốc đánh giá năng lực đã mở" : `Tiếp theo: Lesson ${nextLesson}`}</small></div>
    </section>

    <div className="road-layout road-layout-focused map-only-layout">
      <section key={activeJourney.id} className={`island-map map-theme-${activeJourney.accent}`} aria-label={`Bản đồ ${activeJourney.grades}, ${activeJourney.level}`}>
        <img src={activeJourney.image} alt={`Bản đồ chủ đề ${activeJourney.theme}`} />
        <div className="map-title"><span>LEVEL 1 · BẢN ĐỒ HỌC TẬP</span><b>{activeJourney.theme}</b><small>Đích đến: Bài đánh giá năng lực</small></div>
        {activeJourney.units.map((unit, index) => {
          const unitId = index + 1;
          const isAssessment = unitId === activeJourney.units.length;
          const isLocked = isAssessment && !assessmentReady;
          return <button key={unit.landmark} disabled={isLocked} style={{ left: `${unit.position[0]}%`, top: `${unit.position[1]}%` }} onClick={() => isAssessment ? onAssessment() : onStart(Math.min(unitId, 4))} className={`journey-node node-${unitId} ${isAssessment ? "assessment-node " : ""}${isLocked ? "locked" : "open"}${(!isAssessment && unitId === nextLesson) || (isAssessment && assessmentReady) ? " selected" : ""}`} aria-label={isAssessment ? `Mốc cuối: Đánh giá năng lực tại ${unit.landmark}` : `Mở chặng ${unitId}: ${unit.landmark} — ${unit.topic}`}>
            <span className="node-medal">{isAssessment ? <><strong>6</strong><ClipboardCheck size={14}/></> : unitId}</span><b><small>{isAssessment ? "MỐC CUỐI" : `CHẶNG ${unitId}`}</small>{unit.landmark}</b><small>{unit.topic}</small>{isAssessment && <em>{assessmentReady ? "Sẵn sàng chinh phục" : `Cần ${4 - completedCount} Lesson nữa`}</em>}
          </button>;
        })}
        <div className="map-cloud cloud-a" /><div className="map-cloud cloud-b" />
      </section>
    </div>
  </main>;
}
