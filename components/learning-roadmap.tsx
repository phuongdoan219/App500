"use client";

import Image from "next/image";
import { ArrowRight, ClipboardCheck, Coins, Gift, KeyRound, LockKeyhole, Map, Sparkles } from "lucide-react";
import { CompanionId, MascotPortrait, companions } from "@/components/companion-hub";

const lessonCount = 4;

export const journeys = [
  {
    id: "magic-school", emoji: "✨", theme: "Học viện Ánh Sao", level: "Pre-A1", grades: "Khối 3–4",
    description: "Đi qua các địa danh nhiệm màu và xây nền tiếng Anh đầu tiên.", image: "/map-star-academy.png", accent: "school",
    assessment: { landmark: "Đài Quan sát Ánh Sao", position: [89, 23] },
    units: [
      { landmark: "Cổng Chào Kỳ Diệu", topic: "Chào hỏi & giới thiệu", position: [17, 78], lessonCount },
      { landmark: "Quảng trường Cầu Vồng", topic: "Số đếm & màu sắc", position: [30, 57], lessonCount },
      { landmark: "Làng Cây Sum Vầy", topic: "Gia đình & bạn bè", position: [51, 45], lessonCount },
      { landmark: "Lớp học Bay", topic: "Trường học & lớp học", position: [68, 28], lessonCount },
      { landmark: "Tháp Đồng hồ Ngày Mới", topic: "Hoạt động hằng ngày", position: [80, 55], lessonCount },
    ],
  },
  {
    id: "animal-forest", emoji: "🌲", theme: "Rừng Thì Thầm", level: "Pre-A1", grades: "Khối 4–5",
    description: "Khám phá khu rừng biết nói qua các tình huống nghe – nói trực quan.", image: "/map-whispering-forest.png", accent: "forest",
    assessment: { landmark: "Cây Trí Nhớ", position: [89, 25] },
    units: [
      { landmark: "Làng Gương Mặt", topic: "Mọi người quanh em", position: [18, 78], lessonCount },
      { landmark: "Hang Kho Báu", topic: "Đồ vật quanh em", position: [30, 56], lessonCount },
      { landmark: "Chợ Nấm Ngọt", topic: "Đồ ăn & thức uống", position: [47, 34], lessonCount },
      { landmark: "Hồ La Bàn", topic: "Địa điểm & vị trí", position: [63, 68], lessonCount },
      { landmark: "Sân Rừng Vận Động", topic: "Hành động & khả năng", position: [76, 41], lessonCount },
    ],
  },
  {
    id: "adventure-city", emoji: "🏔️", theme: "Vương quốc Núi Pha Lê", level: "A1", grades: "Khối 5–7",
    description: "Chinh phục tiếng Anh từ thung lũng xanh tới đỉnh núi pha lê.", image: "/map-crystal-mountain.png", accent: "city",
    assessment: { landmark: "Đỉnh Pha Lê", position: [91, 15] },
    units: [
      { landmark: "Trạm Gương Khởi Hành", topic: "Giới thiệu bản thân", position: [15, 79], lessonCount },
      { landmark: "Làng Sườn Núi", topic: "Nhà ở & trường học", position: [33, 59], lessonCount },
      { landmark: "Tháp Thời Gian", topic: "Thói quen hằng ngày", position: [48, 39], lessonCount },
      { landmark: "Chợ Đèo Kỳ Ảo", topic: "Mua sắm & đồ ăn", position: [64, 34], lessonCount },
      { landmark: "Hẻm Núi La Bàn", topic: "Du lịch & chỉ đường", position: [85, 34], lessonCount },
    ],
  },
] as const;

export type UnitProgress = Record<number, number[]>;

type Props = {
  activeJourneyId: (typeof journeys)[number]["id"];
  onChangeJourney: () => void;
  onStart: (unit: number, lesson: number) => void;
  onCompanion: () => void;
  onAssessment: () => void;
  progress: UnitProgress;
  claimedUnits: number[];
  coins: number;
  companionId: CompanionId;
};

type SelectionProps = Pick<Props, "coins" | "companionId" | "onCompanion"> & { onSelect: (journeyId: (typeof journeys)[number]["id"]) => void };

function ProfileActions({ coins, companionId, onCompanion }: Pick<Props, "coins" | "companionId" | "onCompanion">) {
  return <div className="road-profile">
    <button className="companion-stat starter-companion-stat" onClick={onCompanion} aria-label="Mở khu vườn linh vật"><MascotPortrait id={companionId} className="mini-mascot"/><span><small>Đang đồng hành</small><b>{companions[companionId].name}</b></span></button>
    <button className="coin-stat" aria-label={`${coins} Xu chăm sóc`} onClick={onCompanion}><Coins size={18}/><b>{coins}</b><span>Xu chăm sóc</span></button><span className="road-avatar">AN</span>
  </div>;
}

export function JourneySelection({ onSelect, onCompanion, coins, companionId }: SelectionProps) {
  return <main className="roadmap-screen journey-select-screen"><header className="road-topbar"><div className="road-brand"><span>E</span><div><b>ENGLISH IN</b><small>WONDERLAND</small></div></div><ProfileActions coins={coins} companionId={companionId} onCompanion={onCompanion}/></header>
    <section className="journey-select-wrap"><span className="road-kicker"><Map size={15}/> BẮT ĐẦU HÀNH TRÌNH</span><h1>Em muốn khám phá vùng đất nào?</h1><p>Sói Con sẽ đi cùng em từ bài học đầu tiên.</p>
      <div className="journey-select-grid">{journeys.map((journey, index) => <button key={journey.id} className={`journey-select-card ${journey.accent}`} onClick={() => onSelect(journey.id)}><span className="journey-card-number">{index + 1}</span><span className="journey-card-emoji">{journey.emoji}</span><span className="journey-card-copy"><small>{journey.level}</small><b>{journey.grades}</b><em>{journey.description}</em></span><span className="journey-card-go"><ArrowRight size={21}/></span></button>)}</div>
      <small className="journey-select-note"><Sparkles size={14}/> Mỗi bản đồ là một Level và luôn kết thúc bằng bài đánh giá năng lực.</small>
    </section>
  </main>;
}

export default function LearningRoadmap({ activeJourneyId, onChangeJourney, onStart, onCompanion, onAssessment, progress, claimedUnits, coins, companionId }: Props) {
  const activeJourney = journeys.find(journey => journey.id === activeJourneyId) ?? journeys[0];
  const completedUnits = activeJourney.units.filter((unit, index) => (progress[index + 1]?.length ?? 0) >= unit.lessonCount && claimedUnits.includes(index + 1)).length;
  const assessmentReady = completedUnits === activeJourney.units.length;
  const currentUnitIndex = Math.min(completedUnits, activeJourney.units.length - 1);
  const totalLessons = activeJourney.units.reduce((total, unit) => total + unit.lessonCount, 0);
  const completedLessons = Object.values(progress).reduce((total, lessons) => total + lessons.length, 0);
  const overallProgress = Math.round((completedLessons / totalLessons) * 100);

  return <main className="roadmap-screen"><header className="road-topbar"><div className="road-brand"><span>E</span><div><b>ENGLISH IN</b><small>WONDERLAND</small></div></div><ProfileActions coins={coins} companionId={companionId} onCompanion={onCompanion}/></header>
    <section className="road-heading"><div><span className="road-kicker"><Map size={15}/> LEVEL 1 · {activeJourney.grades.toUpperCase()} · {activeJourney.level}</span><h1>{activeJourney.theme}</h1><p>Hoàn thành từng Unit để mở Túi Kỳ Vật và tự động mở chặng tiếp theo.</p><button className="change-journey" onClick={onChangeJourney}>Đổi bản đồ</button></div><div className="level-progress"><span><b>{completedUnits}</b>/{activeJourney.units.length} Unit đã hoàn thành</span><i><em style={{ width: `${overallProgress}%` }}/></i><small>{assessmentReady ? "Mốc đánh giá năng lực đã mở" : `Đang khám phá Unit ${currentUnitIndex + 1}`}</small></div></section>
    <div className="road-layout road-layout-focused map-only-layout"><section className={`island-map map-theme-${activeJourney.accent}`} aria-label={`Bản đồ ${activeJourney.theme}`}>
      <Image src={activeJourney.image} alt={`Bản đồ chủ đề ${activeJourney.theme}`} fill sizes="(max-width: 900px) 100vw, 1200px" priority/><div className="map-title"><span>LEVEL 1 · BẢN ĐỒ HỌC TẬP</span><b>{activeJourney.theme}</b><small>Đích đến: Rương Linh Vật</small></div>
      {activeJourney.units.map((unit, index) => { const unitId = index + 1; const completed = (progress[unitId]?.length ?? 0) >= unit.lessonCount && claimedUnits.includes(unitId); const unlocked = index === 0 || index <= completedUnits; const doneLessons = progress[unitId]?.length ?? 0; const nextLesson = Math.min(doneLessons + 1, unit.lessonCount); return <button key={unit.landmark} disabled={!unlocked} style={{ left: `${unit.position[0]}%`, top: `${unit.position[1]}%` }} onClick={() => onStart(unitId, nextLesson)} className={`journey-node node-${unitId} ${unlocked ? "open" : "locked"} ${index === currentUnitIndex ? "selected" : ""} ${completed ? "unit-completed" : ""}`}><span className="node-medal">{completed ? <Gift size={23}/> : unlocked ? unitId : <LockKeyhole size={19}/>}</span><b><small>UNIT {unitId}</small>{unit.landmark}</b><small>{unit.topic}</small>{unlocked && !completed && <em><KeyRound size={10}/> {doneLessons}/{unit.lessonCount} mảnh chìa khóa</em>}</button>; })}
      <button disabled={!assessmentReady} style={{ left: `${activeJourney.assessment.position[0]}%`, top: `${activeJourney.assessment.position[1]}%` }} onClick={onAssessment} className={`journey-node assessment-node node-${activeJourney.units.length + 1} ${assessmentReady ? "open selected" : "locked"}`}><span className="node-medal"><strong>{activeJourney.units.length + 1}</strong><ClipboardCheck size={14}/></span><b><small>MỐC CUỐI</small>{activeJourney.assessment.landmark}</b><small>Đánh giá năng lực cuối Level</small><em>{assessmentReady ? "Rương Linh Vật đang chờ" : `Cần hoàn thành ${activeJourney.units.length - completedUnits} Unit nữa`}</em></button>
      <div className="map-companion"><MascotPortrait id={companionId} className="map-wolf"/><span><b>{companions[companionId].name}</b><small>{assessmentReady ? "Mình cùng mở rương nhé!" : "Mình đang chờ học cùng bạn!"}</small></span></div>
    </section></div>
  </main>;
}
