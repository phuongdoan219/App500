"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent, type WheelEvent } from "react";
import { ArrowRight, BarChart3, BookOpen, Check, ClipboardCheck, Coins, Gift, Headphones, KeyRound, Languages, LockKeyhole, Map, Move, RotateCcw, Sparkles, Volume2, X, ZoomIn, ZoomOut } from "lucide-react";
import { CompanionId, MascotPortrait, companions } from "@/components/companion-hub";
import "./map-review.css";

const lessonCount = 4;
const mapCanvas = { width: 2200, height: 1240 };
const preA1Positions = [
  [24, 78], [25.5, 71], [27.5, 64], [30, 57], [35, 58],
  [40, 58], [44, 53], [47, 47], [51, 43], [56, 45],
  [61, 49], [66, 50], [71, 50], [76, 52], [80, 53],
  [78, 45], [79, 37], [82, 31], [87, 27], [90, 24],
] as const;
const preA1Units = Array.from({ length: 20 }, (_, index) => {
  const unitId = index + 1;
  return { landmark: `Unit ${unitId} - Placeholder`, topic: "Nội dung đang cập nhật", position: preA1Positions[index], lessonCount };
});

export const journeys = [
  {
    id: "magic-school", emoji: "✨", theme: "Học viện Ánh Sao", level: "Pre A1", grades: "Lớp 1, 2, 3", curriculumUnits: 20,
    description: "Đi qua các địa danh nhiệm màu và xây nền tiếng Anh đầu tiên.", image: "/map-star-academy.png", accent: "school",
    assessment: { landmark: "Đài Quan sát Ánh Sao", position: [93, 20] },
    units: preA1Units,
  },
  {
    id: "animal-forest", emoji: "🌲", theme: "Rừng Thì Thầm", level: "A1", grades: "Lớp 4, 5", curriculumUnits: 27,
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
    id: "adventure-city", emoji: "🏔️", theme: "Vương quốc Núi Pha Lê", level: "Pre A2", grades: "Lớp 6, 7", curriculumUnits: 22,
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
  {
    id: "future-city", emoji: "🌆", theme: "Thành phố Phiêu Lưu", level: "A2", grades: "Lớp 8, 9", curriculumUnits: 30,
    description: "Vận dụng tiếng Anh trong học tập, đời sống và những hành trình dài hơn.", image: "/map-adventure-city.png", accent: "city",
    assessment: { landmark: "Tháp Chân Trời", position: [91, 17] },
    units: [
      { landmark: "Ga Khởi Hành", topic: "Kể về trải nghiệm", position: [15, 79], lessonCount },
      { landmark: "Phố Ý Tưởng", topic: "Nêu ý kiến & giải thích", position: [32, 58], lessonCount },
      { landmark: "Nhà hát Thành Phố", topic: "Văn hóa & giải trí", position: [49, 38], lessonCount },
      { landmark: "Trạm Công Nghệ", topic: "Khoa học & tương lai", position: [66, 61], lessonCount },
      { landmark: "Tháp Chân Trời", topic: "Dự định & mục tiêu", position: [83, 34], lessonCount },
    ],
  },
] as const;

export type UnitProgress = Record<number, number[]>;

type Props = {
  activeJourneyId: (typeof journeys)[number]["id"];
  onChangeJourney: () => void;
  onUnlock: () => void;
  onStart: (unit: number, lesson: number) => void;
  onCompanion: () => void;
  onAssessment: () => void;
  progress: UnitProgress;
  claimedUnits: number[];
  coins: number;
  companionId: CompanionId;
  companionName: string;
  studentName: string;
  reviewedUnits: number[];
  reviewReward: number;
  onReviewComplete: (unitId: number) => void;
  onProfile: () => void;
  hasPaidAccess: boolean;
  autoReviewUnit?: number | null;
  onAutoReviewOpened?: () => void;
};

type SelectionProps = Pick<Props, "coins" | "companionId" | "companionName" | "studentName" | "onCompanion" | "onProfile"> & { assignedJourneyId: (typeof journeys)[number]["id"]; onSelect: (journeyId: (typeof journeys)[number]["id"]) => void };

function ProfileActions({ coins, companionId, companionName, studentName, onCompanion, onProfile }: Pick<Props, "coins" | "companionId" | "companionName" | "studentName" | "onCompanion" | "onProfile">) {
  return <div className="road-profile">
    <button className="learning-profile-link" onClick={onProfile} aria-label="Mở hồ sơ năng lực"><BarChart3 size={17}/><span>Năng lực</span></button>
    <button className="companion-stat starter-companion-stat" onClick={onCompanion} aria-label="Mở khu vườn linh vật"><MascotPortrait id={companionId} className="mini-mascot"/><span><small>Đang đồng hành</small><b>{companionId === "wolf" ? companionName : companions[companionId].name}</b></span></button>
    <button className="coin-stat" aria-label={`${coins} Xu chăm sóc`} onClick={onCompanion}><Coins size={18}/><b>{coins}</b><span>Xu chăm sóc</span></button><span className="road-avatar">{studentName.slice(0, 2).toUpperCase()}</span>
  </div>;
}

export function JourneySelection({ assignedJourneyId, onSelect, onCompanion, onProfile, coins, companionId, companionName, studentName }: SelectionProps) {
  return <main className="roadmap-screen journey-select-screen"><header className="road-topbar"><div className="road-brand"><span>E</span><div><b>ENGLISH IN</b><small>WONDERLAND</small></div></div><ProfileActions coins={coins} companionId={companionId} companionName={companionName} studentName={studentName} onCompanion={onCompanion} onProfile={onProfile}/></header>
    <section className="journey-select-wrap"><span className="road-kicker"><Map size={15}/> BẮT ĐẦU HÀNH TRÌNH</span><h1>Em muốn khám phá vùng đất nào?</h1><p>Level phù hợp với khối lớp của em đã được mở.</p>
      <div className="journey-select-grid">{journeys.map((journey, index) => { const locked = journey.id !== assignedJourneyId; return <button key={journey.id} disabled={locked} aria-label={locked ? `${journey.level} đang khóa vì không phù hợp với khối lớp` : `Mở lộ trình ${journey.level}`} className={`journey-select-card ${journey.accent} ${locked ? "locked" : "unlocked"}`} onClick={() => onSelect(journey.id)}><span className="journey-card-number">{index + 1}</span><span className="journey-card-emoji">{journey.emoji}</span><span className="journey-card-copy"><small>{journey.level} · {journey.curriculumUnits} Units</small><b>{journey.grades}</b><em>{journey.description}</em></span><span className="journey-card-go">{locked ? <LockKeyhole size={20}/> : <ArrowRight size={21}/>}</span>{!locked && <span className="journey-card-match"><Sparkles size={13}/> PHÙ HỢP VỚI EM</span>}</button>; })}</div>
      <small className="journey-select-note"><LockKeyhole size={14}/> Các level khác sẽ được mở khi em học đến khối lớp tương ứng.</small>
    </section>
  </main>;
}

export default function LearningRoadmap({ activeJourneyId, onChangeJourney, onUnlock, onStart, onCompanion, onAssessment, progress, claimedUnits, coins, companionId, companionName, studentName, reviewedUnits, reviewReward, onReviewComplete, onProfile, hasPaidAccess, autoReviewUnit = null, onAutoReviewOpened }: Props) {
  const activeJourney = journeys.find(journey => journey.id === activeJourneyId) ?? journeys[0];
  const activeLevelNumber = journeys.findIndex(journey => journey.id === activeJourney.id) + 1;
  const mapViewportRef = useRef<HTMLElement>(null);
  const dragState = useRef<{ pointerId: number; startX: number; startY: number; offsetX: number; offsetY: number } | null>(null);
  const [mapScale, setMapScale] = useState(0.82);
  const [mapOffset, setMapOffset] = useState({ x: 0, y: -260 });
  const [reviewUnit, setReviewUnit] = useState<number | null>(null);
  const [reviewAnswer, setReviewAnswer] = useState("");
  const [reviewChecked, setReviewChecked] = useState(false);
  const [reviewFinished, setReviewFinished] = useState(false);
  const [reviewStep, setReviewStep] = useState(0);
  const [lockedUnit, setLockedUnit] = useState<number | null>(null);
  const completedUnits = activeJourney.units.filter((unit, index) => (progress[index + 1]?.length ?? 0) >= unit.lessonCount && claimedUnits.includes(index + 1)).length;
  const assessmentReady = completedUnits === activeJourney.units.length;
  const currentUnitIndex = Math.min(completedUnits, activeJourney.units.length - 1);
  const totalLessons = activeJourney.units.reduce((total, unit) => total + unit.lessonCount, 0);
  const completedLessons = Object.values(progress).reduce((total, lessons) => total + lessons.length, 0);
  const overallProgress = Math.round((completedLessons / totalLessons) * 100);
  const reviewSets = [
    { skill: "TỪ VỰNG", title: "Từ little có nghĩa là gì?", hint: "Chọn nghĩa đúng của từ đã học.", options: ["nhỏ", "cao", "trẻ"], answer: "nhỏ" },
    { skill: "TỪ VỰNG", title: "Từ yellow chỉ màu nào?", hint: "Chọn màu tương ứng với từ tiếng Anh.", options: ["màu vàng", "màu đỏ", "màu xanh"], answer: "màu vàng" },
    { skill: "NGỮ PHÁP", title: "Tom has a ___ yellow bag.", hint: "Chọn từ còn thiếu để hoàn chỉnh mẫu câu.", options: ["little", "tall", "old"], answer: "little" },
    { skill: "NGỮ PHÁP", title: "The boy ___ carrying a yellow bag.", hint: "Chọn động từ đúng để hoàn chỉnh câu.", options: ["is", "are", "am"], answer: "is" },
    { skill: "NGHE", title: "Em nghe thấy câu nào?", hint: "Bấm nghe, sau đó chọn đúng câu được đọc.", audio: "The boy is carrying a yellow bag.", options: ["The boy is carrying a yellow bag.", "The girl is carrying a red bag.", "The boy has a little kite."], answer: "The boy is carrying a yellow bag." },
    { skill: "NGHE", title: "Nhân vật đang nói về đồ vật nào?", hint: "Nghe kỹ và chọn cụm từ em vừa nghe.", audio: "little yellow bag", options: ["little yellow bag", "tall yellow boy", "little red bag"], answer: "little yellow bag" },
  ];
  const reviewSet = reviewSets[reviewStep];
  const reviewSkillStages = [
    { skill: "TỪ VỰNG", icon: <Languages size={14}/>, start: 0, end: 1 },
    { skill: "NGỮ PHÁP", icon: <BookOpen size={14}/>, start: 2, end: 3 },
    { skill: "NGHE", icon: <Headphones size={14}/>, start: 4, end: 5 },
  ];
  const alreadyReviewed = reviewUnit !== null && reviewedUnits.includes(reviewUnit);

  function getMinimumMapScale() {
    const viewport = mapViewportRef.current;
    if (!viewport) return 0.55;
    return Math.max(0.55, viewport.clientWidth / mapCanvas.width, viewport.clientHeight / mapCanvas.height);
  }

  function clampMapOffset(next: { x: number; y: number }, scale = mapScale) {
    const viewport = mapViewportRef.current;
    if (!viewport) return next;
    const minX = Math.min(0, viewport.clientWidth - mapCanvas.width * scale);
    const minY = Math.min(0, viewport.clientHeight - mapCanvas.height * scale);
    return {
      x: Math.max(minX, Math.min(0, next.x)),
      y: Math.max(minY, Math.min(0, next.y)),
    };
  }

  function resetMap() {
    const viewport = mapViewportRef.current;
    const focusUnit = activeJourney.units[currentUnitIndex] ?? activeJourney.units[0];
    if (!viewport || !focusUnit) return;
    const nextScale = Math.max(0.82, getMinimumMapScale());
    const nextOffset = {
      x: viewport.clientWidth * 0.28 - mapCanvas.width * (focusUnit.position[0] / 100) * nextScale,
      y: viewport.clientHeight * 0.68 - mapCanvas.height * (focusUnit.position[1] / 100) * nextScale,
    };
    setMapScale(nextScale);
    setMapOffset(clampMapOffset(nextOffset, nextScale));
  }

  function zoomMap(nextScale: number, anchor?: { x: number; y: number }) {
    const viewport = mapViewportRef.current;
    if (!viewport) return;
    const clampedScale = Math.max(getMinimumMapScale(), Math.min(1.6, nextScale));
    const point = anchor ?? { x: viewport.clientWidth / 2, y: viewport.clientHeight / 2 };
    const ratio = clampedScale / mapScale;
    const nextOffset = {
      x: point.x - (point.x - mapOffset.x) * ratio,
      y: point.y - (point.y - mapOffset.y) * ratio,
    };
    setMapScale(clampedScale);
    setMapOffset(clampMapOffset(nextOffset, clampedScale));
  }

  function handleMapWheel(event: WheelEvent<HTMLElement>) {
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    zoomMap(mapScale * (event.deltaY < 0 ? 1.12 : 0.89), { x: event.clientX - rect.left, y: event.clientY - rect.top });
  }

  function handlePointerDown(event: PointerEvent<HTMLElement>) {
    if ((event.target as HTMLElement).closest("button")) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragState.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, offsetX: mapOffset.x, offsetY: mapOffset.y };
    event.currentTarget.classList.add("is-dragging");
  }

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (!dragState.current || dragState.current.pointerId !== event.pointerId) return;
    setMapOffset(clampMapOffset({ x: dragState.current.offsetX + event.clientX - dragState.current.startX, y: dragState.current.offsetY + event.clientY - dragState.current.startY }));
  }

  function handlePointerEnd(event: PointerEvent<HTMLElement>) {
    if (dragState.current?.pointerId !== event.pointerId) return;
    dragState.current = null;
    event.currentTarget.classList.remove("is-dragging");
    event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function openReview(unitId: number) {
    setReviewUnit(unitId);
    setReviewAnswer("");
    setReviewChecked(false);
    setReviewFinished(false);
    setReviewStep(0);
  }

  function closeReview() {
    setReviewUnit(null);
    setReviewAnswer("");
    setReviewChecked(false);
    setReviewFinished(false);
    setReviewStep(0);
  }

  function speakReview() {
    if (!reviewSet.audio || typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(reviewSet.audio);
    utterance.lang = "en-US";
    utterance.rate = 0.78;
    window.speechSynthesis.speak(utterance);
  }

  function continueReview() {
    if (reviewStep < reviewSets.length - 1) {
      setReviewStep(step => step + 1);
      setReviewAnswer("");
      setReviewChecked(false);
      return;
    }
    claimReviewReward();
    closeReview();
  }

  function claimReviewReward() {
    if (reviewUnit === null || alreadyReviewed || reviewFinished) return;
    onReviewComplete(reviewUnit);
    setReviewFinished(true);
  }

  useEffect(() => {
    const frame = window.requestAnimationFrame(resetMap);
    return () => window.cancelAnimationFrame(frame);
  }, [activeJourneyId]);

  useEffect(() => {
    if (autoReviewUnit === null) return;
    openReview(autoReviewUnit);
    onAutoReviewOpened?.();
  }, [autoReviewUnit]);

  return <main className="roadmap-screen"><header className="road-topbar"><div className="road-brand"><span>E</span><div><b>ENGLISH IN</b><small>WONDERLAND</small></div></div><ProfileActions coins={coins} companionId={companionId} companionName={companionName} studentName={studentName} onCompanion={onCompanion} onProfile={onProfile}/></header>
    <section className="road-heading"><div><span className="road-kicker"><Map size={15}/> LEVEL {activeLevelNumber} · {activeJourney.grades.toUpperCase()} · {activeJourney.level}</span><h1>{activeJourney.theme}</h1><p>Lộ trình {activeJourney.curriculumUnits} Units · 2 Unit đầu được học miễn phí.</p><div className="road-heading-actions"><button className="change-journey" onClick={onChangeJourney}>Đổi bản đồ</button><button className="unlock-learning" onClick={onUnlock}><LockKeyhole size={14}/> Xem gói mở khóa</button></div></div><div className="level-progress"><span><b>{completedUnits}</b>/{activeJourney.units.length} Unit đã hoàn thành</span><i><em style={{ width: `${overallProgress}%` }}/></i><small>{assessmentReady ? "Mốc đánh giá năng lực đã mở" : `Đang khám phá Unit ${currentUnitIndex + 1}`}</small></div></section>
    <div className="road-layout road-layout-focused map-only-layout"><section ref={mapViewportRef} onWheel={handleMapWheel} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerEnd} onPointerCancel={handlePointerEnd} className={`island-map zoomable-map map-theme-${activeJourney.accent} ${activeJourney.units.length >= 20 ? "dense-map" : ""}`} aria-label={`Bản đồ tương tác ${activeJourney.theme}`}>
      <div className="map-title"><span>LEVEL {activeLevelNumber} · {activeJourney.level} · BẢN ĐỒ HỌC TẬP</span><b>{activeJourney.theme}</b><small>Kéo để di chuyển · cuộn để thu phóng</small></div>
      <div className="map-route-guide"><b>TIẾP THEO: UNIT {currentUnitIndex + 1}</b><small>Đi theo dải sáng · Unit 1 → {activeJourney.units.length}</small></div>
      <div className="map-control-dock" aria-label="Điều khiển bản đồ"><span className="map-drag-hint"><Move size={13}/> Kéo bản đồ</span><button onClick={() => zoomMap(mapScale * 1.15)} aria-label="Phóng to bản đồ"><ZoomIn size={15}/></button><span className="map-zoom-value">{Math.round(mapScale * 100)}%</span><button onClick={() => zoomMap(mapScale * 0.87)} aria-label="Thu nhỏ bản đồ"><ZoomOut size={15}/></button><button onClick={resetMap} aria-label="Về Unit hiện tại"><RotateCcw size={14}/></button></div>
      <div className="map-canvas" style={{ width: mapCanvas.width, height: mapCanvas.height, transform: `translate3d(${mapOffset.x}px, ${mapOffset.y}px, 0) scale(${mapScale})` }}>
        <Image src={activeJourney.image} alt={`Bản đồ chủ đề ${activeJourney.theme}`} fill sizes={`${mapCanvas.width}px`} priority/>
        {activeJourney.units.map((unit, index) => { const unitId = index + 1; const completed = (progress[unitId]?.length ?? 0) >= unit.lessonCount && claimedUnits.includes(unitId); const reached = index === 0 || index <= completedUnits; const includedInTrial = unitId <= 2; const unlocked = reached && (includedInTrial || hasPaidAccess); const doneLessons = progress[unitId]?.length ?? 0; const nextLesson = Math.min(doneLessons + 1, unit.lessonCount); const reviewedToday = reviewedUnits.includes(unitId); return <button key={unit.landmark} aria-label={!unlocked ? `Unit ${unitId} đang khóa. Bấm để xem điều kiện mở.` : undefined} style={{ left: `${unit.position[0]}%`, top: `${unit.position[1]}%` }} onClick={() => unlocked ? (completed ? openReview(unitId) : onStart(unitId, nextLesson)) : setLockedUnit(unitId)} className={`journey-node node-${unitId} ${unlocked ? "open" : "locked"} ${index === currentUnitIndex ? "selected" : ""} ${completed ? "unit-completed review-ready" : ""}`}>{index === currentUnitIndex && !completed && unlocked && <span className="next-unit-badge">TIẾP THEO</span>}<span className="node-medal">{completed ? <Gift size={23}/> : unitId}{!unlocked && <small className="node-lock-mark"><LockKeyhole size={10}/></small>}</span><b><small>UNIT {unitId}</small>{unit.landmark}</b><small>{unit.topic}</small>{completed ? <em className={reviewedToday ? "review-done" : "review-available"}>{reviewedToday ? <><Check size={10}/> ĐÃ ÔN HÔM NAY</> : <><Coins size={10}/> ÔN +{reviewReward} XU</>}</em> : unlocked && <em><KeyRound size={10}/> {doneLessons}/{unit.lessonCount} mảnh chìa khóa</em>}</button>; })}
        <button disabled={!assessmentReady} style={{ left: `${activeJourney.assessment.position[0]}%`, top: `${activeJourney.assessment.position[1]}%` }} onClick={onAssessment} className={`journey-node assessment-node node-${activeJourney.units.length + 1} ${assessmentReady ? "open selected" : "locked"}`}><span className="node-medal"><strong>{activeJourney.units.length + 1}</strong><ClipboardCheck size={14}/></span><b><small>MỐC CUỐI</small>{activeJourney.assessment.landmark}</b><small>Đánh giá năng lực cuối Level</small><em>{assessmentReady ? "Rương Linh Vật đang chờ" : `Cần hoàn thành ${activeJourney.units.length - completedUnits} Unit nữa`}</em></button>
        <div className="map-companion"><MascotPortrait id={companionId} className="map-wolf"/><span><b>{companionId === "wolf" ? companionName : companions[companionId].name}</b><small>{assessmentReady ? "Mình cùng mở rương nhé!" : "Mình đang chờ học cùng bạn!"}</small></span></div>
      </div>
    </section></div>
    {reviewUnit !== null && <div className="map-review-modal" role="dialog" aria-modal="true" aria-label={`Ôn tập Unit ${reviewUnit}`}><section>
      <button className="map-review-close" onClick={closeReview} aria-label="Đóng"><X size={18}/></button>
      <span className="map-review-kicker"><Sparkles size={16}/> TRẠM ÔN TẬP · UNIT {reviewUnit}</span>
      <div className="map-review-progress" aria-label={`Câu ${reviewStep + 1} trên ${reviewSets.length}`}>
        {reviewSkillStages.map(stage => <span key={stage.skill} className={reviewStep > stage.end ? "done" : reviewStep >= stage.start ? "active" : ""}>{stage.icon}<b>{stage.skill}</b>{reviewStep > stage.end && <Check size={12}/>}</span>)}
      </div>
      <small className="map-review-count">CÂU {reviewStep + 1}/{reviewSets.length} · {reviewSet.skill}</small>
      <h2>{reviewSet.title}</h2><p>{reviewSet.hint}</p>
      {reviewSet.audio && <button className="map-review-listen" onClick={speakReview}><span><Volume2 size={24}/></span><b>Nghe câu</b><small>Có thể nghe lại nhiều lần</small></button>}
      <div className="map-review-options">{reviewSet.options.map(option => <button key={option} className={(reviewAnswer === option ? "selected " : "") + (reviewChecked && option === reviewSet.answer ? "correct" : "") + (reviewChecked && reviewAnswer === option && option !== reviewSet.answer ? "wrong" : "")} onClick={() => { setReviewAnswer(option); setReviewChecked(false); }}>{option}</button>)}</div>
      {reviewChecked && reviewAnswer !== reviewSet.answer && <p className="map-review-feedback retry">Chưa đúng rồi. Em thử nhớ lại bài cũ và chọn lại nhé!</p>}
      {reviewChecked && reviewAnswer === reviewSet.answer && reviewStep < reviewSets.length - 1 && <div className="map-review-earned skill-complete"><Check size={24}/><span><b>Chính xác!</b><small>Còn {reviewSets.length - reviewStep - 1} câu để hoàn thành lượt ôn.</small></span></div>}
      {reviewChecked && reviewAnswer === reviewSet.answer && reviewStep === reviewSets.length - 1 && <div className="map-review-earned"><Coins size={26}/><span><b>{alreadyReviewed || reviewFinished ? "Đã ôn đủ 3 kỹ năng!" : `Hoàn thành · Nhận ${reviewReward} Xu`}</b><small>{alreadyReviewed || reviewFinished ? "Unit này đã nhận thưởng hôm nay. Em vẫn có thể luyện lại." : "Xu đã sẵn sàng để dùng trong Khu Vườn Linh Vật."}</small></span></div>}
      {(!reviewChecked || reviewAnswer !== reviewSet.answer) ? <button className="map-review-submit" disabled={!reviewAnswer} onClick={() => setReviewChecked(true)}>Kiểm tra {reviewSet.skill.toLowerCase()}</button> : <button className="map-review-submit" onClick={continueReview}>{reviewStep < reviewSets.length - 1 ? <>{reviewSets[reviewStep + 1].skill === reviewSet.skill ? "Câu tiếp theo" : `Tiếp tục: ${reviewSets[reviewStep + 1].skill.toLowerCase()}`} <ArrowRight size={17}/></> : alreadyReviewed || reviewFinished ? "Hoàn thành lượt ôn" : `Nhận ${reviewReward} Xu`}</button>}
      <button className="map-review-lessons" onClick={() => { const unit = reviewUnit; closeReview(); onStart(unit, 1); }}>Xem lại bài học của Unit {reviewUnit}</button>
      <small className="map-review-rule">Hoàn thành 6 câu gồm từ vựng, ngữ pháp và nghe để nhận thưởng. Mỗi Unit nhận Xu 1 lần/ngày.</small>
    </section></div>}
    {lockedUnit !== null && <div className="unit-lock-modal" role="dialog" aria-modal="true" aria-labelledby="unit-lock-title"><section>
      <button className="unit-lock-close" onClick={() => setLockedUnit(null)} aria-label="Đóng"><X size={18}/></button>
      <span className="unit-lock-icon"><LockKeyhole size={27}/></span>
      <small>UNIT {lockedUnit} · CHƯA MỞ</small>
      <h2 id="unit-lock-title">{lockedUnit >= 3 && !hasPaidAccess && completedUnits >= 2 ? "Bé đã đi hết chặng học thử" : "Hoàn thành chặng trước để đi tiếp"}</h2>
      <p>{lockedUnit >= 3 && !hasPaidAccess && completedUnits >= 2 ? "Hai Unit trải nghiệm đã giúp bé làm quen đủ 4 kiểu bài học. Gia đình có thể mở khóa chặng tiếp theo, hoặc để bé ôn lại miễn phí những phần đã học." : `Unit ${lockedUnit} sẽ mở sau khi bé hoàn thành Unit ${Math.max(1, lockedUnit - 1)}.`}</p>
      {lockedUnit >= 3 && !hasPaidAccess && completedUnits >= 2 ? <><button className="unit-lock-primary" onClick={() => { setLockedUnit(null); onUnlock(); }}>Xem các lựa chọn mở khóa <ArrowRight size={17}/></button><button className="unit-lock-review" onClick={() => { setLockedUnit(null); openReview(2); }}>Ôn lại Unit 2 miễn phí</button><span className="unit-lock-promise"><Check size={14}/> Tiến độ và phần thưởng đã nhận vẫn được giữ nguyên</span></> : <button className="unit-lock-primary" onClick={() => setLockedUnit(null)}>Tiếp tục học Unit hiện tại</button>}
    </section></div>}
  </main>;
}
