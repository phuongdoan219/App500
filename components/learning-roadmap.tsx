"use client";

import { useState } from "react";
import { Check, Fish, Flame, Map, Sparkles, UserRound } from "lucide-react";

const journeys = [
  { id: "magic-school", emoji: "🏫", title: "Trường học kỳ diệu", level: "Pre-A1", grades: "Khối 3–4", description: "Từ quen thuộc và mẫu câu ngắn trong thế giới trường học.", image: "/map-magic-school.png", accent: "school", units: ["Hello, New Friends!", "My School Bag", "My Family", "Fun at School", "My Day", "School Festival"] },
  { id: "animal-forest", emoji: "🌳", title: "Rừng bạn bè", level: "Pre-A1", grades: "Khối 4–5", description: "Nghe – nói có hỗ trợ với động vật và hoạt động gần gũi.", image: "/map-animal-forest.png", accent: "forest", units: ["Meet the Animals", "Big or Small?", "Food Picnic", "Where Is It?", "I Can Do It!", "Forest Show"] },
  { id: "adventure-city", emoji: "🏙️", title: "Thành phố phiêu lưu", level: "A1", grades: "Khối 5–7", description: "Giao tiếp cơ bản trong tình huống quen thuộc và tạo câu đơn giản.", image: "/map-adventure-city.png", accent: "city", units: ["Around My Town", "At the Market", "A Rainy Day", "At the Café", "Let’s Take the Bus", "City Mystery"] },
] as const;

type Props = {
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

export default function LearningRoadmap({ onStart, onCat, onStreak, onModeChange, onShowAccess, completedLessons = [], fish, streak, rewardMode, activePlan }: Props) {
  const [activeJourneyId, setActiveJourneyId] = useState<(typeof journeys)[number]["id"]>("magic-school");
  const activeJourney = journeys.find(journey => journey.id === activeJourneyId) ?? journeys[0];
  const completedCount = completedLessons.filter(id => id >= 1 && id <= 4).length;
  const nextLesson = [1, 2, 3, 4].find(id => !completedLessons.includes(id)) ?? 4;
  const progress = completedCount * 25;

  return <main className="roadmap-screen">
    <header className="road-topbar">
      <div className="road-brand"><span>V</span><div><b>VUIHOC</b><small>ENGLISH ADVENTURE</small></div></div>
      <div className="road-profile"><button className="access-demo-button" onClick={onShowAccess}><UserRound size={16}/><span>Login &amp; thanh toán</span><small>{activePlan}</small></button>{rewardMode === "cat" ? <button className="fish-stat" onClick={onCat}><Fish size={19} fill="currentColor" /><b>{fish}</b><span>Cá</span></button> : <button className="streak-stat" onClick={onStreak}><Flame size={19} fill="currentColor" /><b>{streak}</b><span>ngày</span></button>}<span className="road-avatar">AN</span></div>
    </header>

    <section className="reward-demo-switch" aria-label="Chọn phương án giữ chân để xem demo">
      <span>PHƯƠNG ÁN THƯỞNG</span>
      <div><button className={rewardMode === "cat" ? "active cat" : ""} onClick={() => onModeChange("cat")}><Fish size={17} /> Cá &amp; nuôi Miu</button><button className={rewardMode === "streak" ? "active streak" : ""} onClick={() => onModeChange("streak")}><Flame size={17} /> Streak &amp; lên cấp</button></div>
    </section>

    <section className="road-heading">
      <div><span className="road-kicker"><Map size={15} /> KHỐI 3–7 · PRE-A1 ĐẾN A1</span><h1>Chọn hành trình của em</h1><p>Mỗi hành trình là một thế giới riêng, bám theo trình độ và tình huống giao tiếp quen thuộc.</p></div>
      <div className="level-progress"><span><b>{completedCount}</b>/4 Lesson đã hoàn thành</span><i><em style={{ width: `${progress}%` }} /></i><small>{completedCount === 4 ? "Unit hiện tại đã hoàn thành" : `Tiếp theo: Lesson ${nextLesson}`}</small></div>
    </section>

    <div className="road-layout road-layout-focused">
      <aside className="world-switcher">
        <p>CHỌN HÀNH TRÌNH</p>
        {journeys.map(journey => <button key={journey.id} className={activeJourney.id === journey.id ? "active" : ""} onClick={() => setActiveJourneyId(journey.id)}><span>{journey.emoji}</span><div><b>{journey.title}</b><small>{journey.grades} · {journey.level}</small></div>{activeJourney.id === journey.id ? <Check size={17} /> : <Sparkles size={15} />}</button>)}
        <div className="all-open-note"><Sparkles size={15}/><span><b>Đã mở toàn bộ</b><small>Bấm vào bất kỳ Map hoặc Unit nào để xem demo.</small></span></div>
        {rewardMode === "cat" ? <button className="cat-entry" onClick={onCat}><img src="/cat-companion.png" alt="Miu" /><div><b>Nhà của Miu</b><small>{fish} Cá đang có · Vào chăm Miu</small></div></button> : <button className="streak-entry" onClick={onStreak}><span><Flame size={25} fill="currentColor" /></span><div><b>Chuỗi học của em</b><small>{streak} ngày · Xem mốc lên cấp</small></div></button>}
      </aside>

      <section key={activeJourney.id} className={`island-map map-theme-${activeJourney.accent}`} aria-label={`Bản đồ ${activeJourney.title}`}>
        <img src={activeJourney.image} alt={`Bản đồ hành trình ${activeJourney.title}`} />
        <div className="map-title"><span>{activeJourney.grades} · {activeJourney.level}</span><b>{activeJourney.title}</b><small>{activeJourney.description}</small></div>
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
