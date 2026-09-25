"use client";

import { Check, Fish, Flame, LockKeyhole, Map, UserRound } from "lucide-react";

const units = [
  { id: 1, title: "The Wrong Bag", status: "current", pos: "node-1" },
  { id: 2, title: "A Rainy Day", status: "locked", pos: "node-2" },
  { id: 3, title: "At the School Fair", status: "locked", pos: "node-3" },
  { id: 4, title: "My Funny Robot", status: "locked", pos: "node-4" },
  { id: 5, title: "Picnic Surprise", status: "locked", pos: "node-5" },
  { id: 6, title: "The Voice Stage", status: "locked", pos: "node-6" },
];

type Props = {
  onStart: (lesson: number) => void;
  onCat: () => void;
  onStreak: () => void;
  onModeChange: (mode: "cat" | "streak") => void;
  onShowAccess: () => void;
  onLockedMap: () => void;
  completedLessons?: number[];
  fish: number;
  streak: number;
  rewardMode: "cat" | "streak";
  activePlan: string;
};

export default function LearningRoadmap({ onStart, onCat, onStreak, onModeChange, onShowAccess, onLockedMap, completedLessons = [], fish, streak, rewardMode, activePlan }: Props) {
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
      <div><span className="road-kicker"><Map size={15} /> LỘ TRÌNH BEGINNER 1</span><h1>Hành trình của em</h1><p>{rewardMode === "cat" ? "Hoàn thành Lesson, nhận Cá và mở từng chặng mới." : "Mỗi ngày hoàn thành 1 Lesson để giữ lửa và lên cấp."}</p></div>
      <div className="level-progress"><span><b>{completedCount}</b>/4 Lesson đã hoàn thành</span><i><em style={{ width: `${progress}%` }} /></i><small>{completedCount === 4 ? "Unit 1 đã hoàn thành" : `Tiếp theo: Lesson ${nextLesson}`}</small></div>
    </section>

    <div className="road-layout road-layout-focused">
      <aside className="world-switcher"><p>CHỌN HÀNH TRÌNH</p><button className="active"><span>🌈</span><div><b>Beginner 1</b><small>Đang học · A1</small></div><Check size={17} /></button><button><span>🚀</span><div><b>Beginner 2</b><small>Hoàn thành B1 để mở</small></div><LockKeyhole size={16} /></button><button><span>🏰</span><div><b>Elementary</b><small>Sắp ra mắt</small></div><LockKeyhole size={16} /></button>{rewardMode === "cat" ? <button className="cat-entry" onClick={onCat}><img src="/cat-companion.png" alt="Miu" /><div><b>Nhà của Miu</b><small>{fish} Cá đang có · Vào chăm Miu</small></div></button> : <button className="streak-entry" onClick={onStreak}><span><Flame size={25} fill="currentColor" /></span><div><b>Chuỗi học của em</b><small>{streak} ngày · Xem mốc lên cấp</small></div></button>}</aside>

      <section className="island-map" aria-label="Bản đồ các Unit">
        <img src="/roadmap-island.png" alt="Hòn đảo học tiếng Anh với con đường qua nhiều khu vực" />
        <div className="map-title"><span>CHẶNG 1</span><b>Park Adventure</b><small>6 Unit · 24 Lesson</small></div>
        {units.map(unit => {
          const locked = unit.status === "locked";
          return <button key={unit.id} onClick={() => locked ? onLockedMap() : onStart(nextLesson)} className={`journey-node ${unit.pos} ${unit.status}${unit.id === 1 ? " selected" : ""}`} aria-label={locked ? `${unit.title} đang khóa, xem phương án mở khóa` : unit.title}>
            <span className="node-medal">{locked ? <LockKeyhole size={21} /> : unit.id}</span>
            <b>{unit.title}</b>
            <small>{unit.id === 1 ? (completedCount === 4 ? "Học lại Unit" : `Tiếp tục · Lesson ${nextLesson}`) : "Hoàn thành chặng trước để mở"}</small>
            {unit.id === 1 && <em>✓ {completedCount}/4 Lesson</em>}
          </button>;
        })}
        <div className="map-cloud cloud-a" /><div className="map-cloud cloud-b" />
      </section>
    </div>
  </main>;
}
