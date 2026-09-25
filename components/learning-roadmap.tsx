"use client";

import { ArrowRight, Fish, Flame, Map, Sparkles, UserRound } from "lucide-react";

export const journeys = [
  { id: "magic-school", emoji: "🏫", theme: "Trường học kỳ diệu", level: "Pre-A1", grades: "Khối 3–4", description: "Nhận biết từ quen thuộc và sử dụng các mẫu câu ngắn.", image: "/map-magic-school.png", accent: "school", units: ["Greetings & Introductions", "Numbers & Colours", "Family & Friends", "School & Classroom", "Daily Activities", "Review & Practice"] },
  { id: "animal-forest", emoji: "🌳", theme: "Rừng bạn bè", level: "Pre-A1", grades: "Khối 4–5", description: "Luyện nghe – nói với hướng dẫn và hỗ trợ trực quan.", image: "/map-animal-forest.png", accent: "forest", units: ["People Around Me", "Things Around Me", "Food & Drinks", "Places & Positions", "Actions & Abilities", "Review & Practice"] },
  { id: "adventure-city", emoji: "🏙️", theme: "Thành phố phiêu lưu", level: "A1", grades: "Khối 5–7", description: "Giao tiếp trong tình huống quen thuộc và tạo câu đơn giản.", image: "/map-adventure-city.png", accent: "city", units: ["About Myself", "Home & School", "Daily Routines", "Shopping & Food", "Travel & Directions", "Review & Practice"] },
] as const;

type Props = {
  activeJourneyId: (typeof journeys)[number]["id"];
  onChangeJourney: () => void;
  onStart: (lesson: number) => void;
  onCat: () => void;
  onStreak: () => void;
  onModeChange: (mode: "cat" | "streak") => void;
  onShowAccess: () => void;
  onLockedMap?: () => void;
  completedLessons?: number[];
  fish: number;
  streak: number;
  rewardMode: "cat" | "streak";
  activePlan: string;
};

type SelectionProps = Pick<Props, "fish" | "streak" | "rewardMode" | "activePlan" | "onCat" | "onStreak" | "onModeChange" | "onShowAccess"> & {
  onSelect: (journeyId: (typeof journeys)[number]["id"]) => void;
};

export function JourneySelection({ onSelect, onCat, onStreak, onModeChange, onShowAccess, fish, streak, rewardMode, activePlan }: SelectionProps) {
  return <main className="roadmap-screen journey-select-screen">
    <header className="road-topbar">
      <div className="road-brand"><span>W</span><div><b>WONDERTRAIL</b><small>ENGLISH QUEST</small></div></div>
      <div className="road-profile"><button className="access-demo-button" onClick={onShowAccess}><UserRound size={16}/><span>Login &amp; thanh toán</span><small>{activePlan}</small></button>{rewardMode === "cat" ? <button className="fish-stat" onClick={onCat}><Fish size={19} fill="currentColor" /><b>{fish}</b><span>Cá</span></button> : <button className="streak-stat" onClick={onStreak}><Flame size={19} fill="currentColor" /><b>{streak}</b><span>ngày</span></button>}<span className="road-avatar">AN</span></div>
    </header>
    <section className="reward-demo-switch" aria-label="Chọn phương án giữ chân để xem demo">
      <span>PHƯƠNG ÁN THƯỞNG</span>
      <div><button className={rewardMode === "cat" ? "active cat" : ""} onClick={() => onModeChange("cat")}><Fish size={17} /> Cá &amp; nuôi Miu</button><button className={rewardMode === "streak" ? "active streak" : ""} onClick={() => onModeChange("streak")}><Flame size={17} /> Streak &amp; lên cấp</button></div>
    </section>
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

export default function LearningRoadmap({ activeJourneyId, onChangeJourney, onStart, onCat, onStreak, onModeChange, onShowAccess, completedLessons = [], fish, streak, rewardMode, activePlan }: Props) {
  const activeJourney = journeys.find(journey => journey.id === activeJourneyId) ?? journeys[0];
  const completedCount = completedLessons.filter(id => id >= 1 && id <= 4).length;
  const nextLesson = [1, 2, 3, 4].find(id => !completedLessons.includes(id)) ?? 4;
  const progress = completedCount * 25;

  return <main className="roadmap-screen">
    <header className="road-topbar">
      <div className="road-brand"><span>W</span><div><b>WONDERTRAIL</b><small>ENGLISH QUEST</small></div></div>
      <div className="road-profile"><button className="access-demo-button" onClick={onShowAccess}><UserRound size={16}/><span>Login &amp; thanh toán</span><small>{activePlan}</small></button>{rewardMode === "cat" ? <><button className="cat-home-top" onClick={onCat} aria-label="Vào Nhà của Miu"><img src="/cat-companion.png" alt=""/><span>Nhà của Miu</span></button><button className="fish-stat" onClick={onCat}><Fish size={19} fill="currentColor" /><b>{fish}</b><span>Cá</span></button></> : <button className="streak-stat" onClick={onStreak}><Flame size={19} fill="currentColor" /><b>{streak}</b><span>ngày</span></button>}<span className="road-avatar">AN</span></div>
    </header>

    <section className="reward-demo-switch" aria-label="Chọn phương án giữ chân để xem demo">
      <span>PHƯƠNG ÁN THƯỞNG</span>
      <div><button className={rewardMode === "cat" ? "active cat" : ""} onClick={() => onModeChange("cat")}><Fish size={17} /> Cá &amp; nuôi Miu</button><button className={rewardMode === "streak" ? "active streak" : ""} onClick={() => onModeChange("streak")}><Flame size={17} /> Streak &amp; lên cấp</button></div>
    </section>

    <section className="road-heading">
      <div><span className="road-kicker"><Map size={15} /> {activeJourney.grades.toUpperCase()} · {activeJourney.level}</span><h1>{activeJourney.theme}</h1><p>{activeJourney.description}</p><button className="change-journey" onClick={onChangeJourney}>Đổi khối học</button></div>
      <div className="level-progress"><span><b>{completedCount}</b>/4 Lesson đã hoàn thành</span><i><em style={{ width: `${progress}%` }} /></i><small>{completedCount === 4 ? "Unit hiện tại đã hoàn thành" : `Tiếp theo: Lesson ${nextLesson}`}</small></div>
    </section>

    <div className="road-layout road-layout-focused map-only-layout">
      <section key={activeJourney.id} className={`island-map map-theme-${activeJourney.accent}`} aria-label={`Bản đồ ${activeJourney.grades}, ${activeJourney.level}`}>
        <img src={activeJourney.image} alt={`Bản đồ chủ đề ${activeJourney.theme}`} />
        <div className="map-title"><span>LỘ TRÌNH HỌC</span><b>{activeJourney.grades} · {activeJourney.level}</b><small>{activeJourney.description}</small></div>
        {activeJourney.units.map((title, index) => {
          const unitId = index + 1;
          return <button key={title} onClick={() => onStart(nextLesson)} className={`journey-node node-${unitId} open${unitId === 1 ? " selected" : ""}`} aria-label={`Mở Unit ${unitId}: ${title}`}>
            <span className="node-medal">{unitId}</span><b>{title}</b><small>{unitId === 1 ? (completedCount === 4 ? "Học lại Unit" : `Tiếp tục · Lesson ${nextLesson}`) : "Đã mở · Vào học ngay"}</small>{unitId === 1 && <em>✓ {completedCount}/4 Lesson</em>}
          </button>;
        })}
        <div className="map-cloud cloud-a" /><div className="map-cloud cloud-b" />
      </section>
    </div>
  </main>;
}
