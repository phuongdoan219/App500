"use client";

import { useEffect, useState } from "react";
import { ArrowRight, BarChart3, BookOpen, Check, ChevronLeft, ChevronRight, Coins, Gift, Headphones, KeyRound, LockKeyhole, Mic, Play, Sparkles } from "lucide-react";
import VoiceLabCamera from "@/components/voice-lab-camera";
import LessonOneVideo from "@/components/lesson-one-video";
import LessonTwoStructured from "@/components/lesson-two-structured";
import LessonThreeStructured from "@/components/lesson-three-structured";
import LearningRoadmap, { JourneySelection, journeys, UnitProgress } from "@/components/learning-roadmap";
import LessonResult from "@/components/lesson-result";
import CompanionHub, { CompanionId, companions, MascotPortrait } from "@/components/companion-hub";
import LevelAssessment from "@/components/level-assessment";
import AccessFlow from "@/components/access-flow";
import LessonReviewGate from "@/components/lesson-review-gate";
import StudentLearningProfile from "@/components/student-learning-profile";

const lessonTabs = [
  { id: 1, label: "Khám phá", icon: Play, sub: "Xem & hiểu" }, { id: 2, label: "Hiểu sâu", icon: BookOpen, sub: "Từ & câu" },
  { id: 3, label: "Nghe · Viết", icon: Headphones, sub: "Bắt âm" }, { id: 4, label: "Lồng tiếng", icon: Mic, sub: "Camera & micro" },
];
function Pill({ children, tone = "blue" }: { children: React.ReactNode; tone?: string }) { return <span className={"pill pill-" + tone}>{children}</span>; }

export default function Home() {
  const [screen, setScreen] = useState<"journey-select" | "roadmap" | "lesson" | "assessment" | "result" | "companion" | "profile">("journey-select");
  const [activeJourneyId, setActiveJourneyId] = useState<(typeof journeys)[number]["id"]>("magic-school");
  const [activeUnit, setActiveUnit] = useState(1);
  const [lesson, setLesson] = useState(1);
  const [support, setSupport] = useState("captions"), [showMeaning, setShowMeaning] = useState(true);
  const [profileTab, setProfileTab] = useState<"overview" | "notebook">("overview"), [progressByJourney, setProgressByJourney] = useState<Partial<Record<(typeof journeys)[number]["id"], UnitProgress>>>({});
  const [sheetOnline, setSheetOnline] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [accessFlow, setAccessFlow] = useState<null | "login" | "pricing">("login");
  const [assignedJourneyId, setAssignedJourneyId] = useState<(typeof journeys)[number]["id"]>("magic-school");
  const [coins, setCoins] = useState(0);
  const [owned, setOwned] = useState<string[]>([]);
  const [companionId, setCompanionId] = useState<CompanionId>("wolf");
  const [wolfName, setWolfName] = useState("Sói Con");
  const [studentName, setStudentName] = useState("An");
  const [collection, setCollection] = useState<CompanionId[]>(["wolf"]);
  const [claimedUnits, setClaimedUnits] = useState<string[]>([]);
  const [pendingCompanion, setPendingCompanion] = useState<CompanionId>("dragon");
  const [chestOpen, setChestOpen] = useState(false);
  const [bagReward, setBagReward] = useState<{ id: string; icon: string; name: string; note: string } | null>(null);
  const [assessmentScore, setAssessmentScore] = useState(0);
  const [mapReviewClaims, setMapReviewClaims] = useState<string[]>([]);
  const [reward, setReward] = useState<{ lesson: number; unitComplete: boolean } | null>(null);
  const [reviewedLessons, setReviewedLessons] = useState<string[]>([]);
  const [accessPlan, setAccessPlan] = useState<string | null>(null);
  const [trialComplete, setTrialComplete] = useState(false);
  const [autoReviewUnit, setAutoReviewUnit] = useState<number | null>(null);
  useEffect(() => {
    const saved = localStorage.getItem("english-in-wonderland-journey-progress");
    const previous = localStorage.getItem("english-in-wonderland-unit-progress");
    const legacy = localStorage.getItem("english-in-wonderland-demo-progress");
    if (saved) setProgressByJourney(JSON.parse(saved));
    else if (previous) setProgressByJourney({ "magic-school": JSON.parse(previous) });
    else if (legacy) setProgressByJourney({ "magic-school": { 1: JSON.parse(legacy) } });
  }, []);
  useEffect(() => {
    const savedCoins = localStorage.getItem("english-in-wonderland-demo-coins");
    const savedOwned = localStorage.getItem("english-in-wonderland-demo-companion-items");
    const savedCompanion = localStorage.getItem("english-in-wonderland-demo-companion") as CompanionId | null;
    const savedWolfName = localStorage.getItem("english-in-wonderland-wolf-name");
    const savedStudentName = localStorage.getItem("english-in-wonderland-student-name");
    const savedCollection = localStorage.getItem("english-in-wonderland-companion-collection");
    const savedClaimedUnits = localStorage.getItem("english-in-wonderland-claimed-units");
    if (savedCoins) setCoins(Number(savedCoins));
    if (savedOwned) setOwned(JSON.parse(savedOwned));
    if (savedCompanion && savedCompanion in companions) setCompanionId(savedCompanion);
    if (savedWolfName) setWolfName(savedWolfName);
    if (savedStudentName) setStudentName(savedStudentName);
    if (savedCollection) setCollection(Array.from(new Set(["wolf", ...JSON.parse(savedCollection)])) as CompanionId[]);
    else if (savedCompanion && savedCompanion in companions) setCollection(["wolf", savedCompanion]);
    if (savedClaimedUnits) setClaimedUnits((JSON.parse(savedClaimedUnits) as Array<string | number>).map(String));
    setAccessPlan(localStorage.getItem("english-in-wonderland-access-plan"));
    const savedMapReviews = localStorage.getItem("english-in-wonderland-map-review-claims");
    if (savedMapReviews) setMapReviewClaims(JSON.parse(savedMapReviews));
  }, []);
  useEffect(() => { fetch("/api/curriculum").then(r => r.json()).then((data: unknown) => setSheetOnline(Boolean((data as { connected?: boolean }).connected))).catch(() => setSheetOnline(false)); }, []);
  function completeLesson(id: number) {
    const journeyProgress = progressByJourney[activeJourneyId] ?? {};
    const unitLessons = Array.from(new Set([...(journeyProgress[activeUnit] ?? []), id]));
    const nextProgress = { ...journeyProgress, [activeUnit]: unitLessons };
    const nextProgressByJourney = { ...progressByJourney, [activeJourneyId]: nextProgress };
    setProgressByJourney(nextProgressByJourney);
    localStorage.setItem("english-in-wonderland-journey-progress", JSON.stringify(nextProgressByJourney));
    setReward({ lesson: id, unitComplete: unitLessons.length === lessonTabs.length && !claimedUnits.includes(`${activeJourneyId}:${activeUnit}`) });
  }
  function continueAfterReward() {
    if (!reward) return;
    if (reward.unitComplete) { const prizes = [{ id: "moon-cookie", icon: "🌙", name: "Bánh Trăng Non", note: "Món ăn khiến Sói Con vui lên." }, { id: "star-ball", icon: "🔮", name: "Bóng Sao", note: "Đồ chơi mới cho khu vườn." }, { id: "violet-bow", icon: "🎀", name: "Nơ Tím Kỳ Ảo", note: "Phụ kiện dành cho mọi linh vật." }, { id: "garden-lamp", icon: "🏮", name: "Đèn Đom Đóm", note: "Vật trang trí phát sáng trong vườn." }, { id: "cloud-fragment", icon: "🧩", name: "Mảnh Mây Ước", note: "Một mảnh của món đồ bí ẩn." }]; setBagReward(prizes[Math.floor(Math.random() * prizes.length)]); return; }
    if (reward.lesson >= lessonTabs.length) { setReward(null); setScreen("roadmap"); return; }
    setLesson(reward.lesson + 1);
    setReward(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function claimUnitBag() {
    if (!bagReward) return;
    const nextOwned = Array.from(new Set([...owned, bagReward.id]));
    const nextClaimed = Array.from(new Set([...claimedUnits, `${activeJourneyId}:${activeUnit}`]));
    setOwned(nextOwned); setClaimedUnits(nextClaimed); setBagReward(null); setReward(null); setScreen("roadmap");
    if (activeUnit === 2 && !accessPlan) setTrialComplete(true);
    localStorage.setItem("english-in-wonderland-demo-companion-items", JSON.stringify(nextOwned));
    localStorage.setItem("english-in-wonderland-claimed-units", JSON.stringify(nextClaimed));
  }
  function buyForCompanion(id: string, price: number, _label: string, type: "food" | "skin") {
    if (coins < price || (type === "skin" && owned.includes(id))) return;
    const nextCoins = coins - price;
    setCoins(nextCoins);
    localStorage.setItem("english-in-wonderland-demo-coins", String(nextCoins));
    if (type === "skin") {
      const nextOwned = [...owned, id];
      setOwned(nextOwned);
      localStorage.setItem("english-in-wonderland-demo-companion-items", JSON.stringify(nextOwned));
    }
  }
  function completeMapReview(unitId: number) {
    const today = new Date().toLocaleDateString("en-CA");
    const claimKey = `${activeJourneyId}:${unitId}:${today}`;
    if (mapReviewClaims.includes(claimKey)) return;
    const firstReviewToday = !mapReviewClaims.some(key => key.endsWith(`:${today}`));
    const earned = firstReviewToday ? 5 : 3;
    const nextClaims = [...mapReviewClaims, claimKey];
    const nextCoins = coins + earned;
    setMapReviewClaims(nextClaims);
    setCoins(nextCoins);
    localStorage.setItem("english-in-wonderland-map-review-claims", JSON.stringify(nextClaims));
    localStorage.setItem("english-in-wonderland-demo-coins", String(nextCoins));
  }
  function careForCompanion(cost: number) {
    if (coins < cost) return false;
    const nextCoins = coins - cost;
    setCoins(nextCoins);
    localStorage.setItem("english-in-wonderland-demo-coins", String(nextCoins));
    return true;
  }
  function completeAssessment(score: number) {
    const ids = (Object.keys(companions) as CompanionId[]).filter(id => id !== "wolf");
    const available = ids.filter(id => !collection.includes(id));
    const unlocked = available[Math.floor(Math.random() * available.length)] ?? ids[0];
    setAssessmentScore(score);
    setPendingCompanion(unlocked);
    setChestOpen(false);
    setScreen("result");
  }
  function claimCompanion() {
    setCompanionId(pendingCompanion);
    const nextCollection = Array.from(new Set([...collection, pendingCompanion]));
    setCollection(nextCollection);
    localStorage.setItem("english-in-wonderland-demo-companion", pendingCompanion);
    localStorage.setItem("english-in-wonderland-companion-collection", JSON.stringify(nextCollection));
    setChestOpen(false);
    setScreen("companion");
  }
  function completeAccess(plan: string, journeyId?: (typeof journeys)[number]["id"], companionName?: string, nextStudentName?: string) {
    if (journeyId && journeys.some(journey => journey.id === journeyId)) {
      setAssignedJourneyId(journeyId);
      setActiveJourneyId(journeyId);
      setScreen("roadmap");
      localStorage.setItem("english-in-wonderland-assigned-journey", journeyId);
    }
    if (companionName) {
      setWolfName(companionName);
      localStorage.setItem("english-in-wonderland-wolf-name", companionName);
    }
    if (nextStudentName) {
      setStudentName(nextStudentName);
      localStorage.setItem("english-in-wonderland-student-name", nextStudentName);
    }
    setAccessFlow(null);
    if (plan !== "onboarding") {
      setAccessPlan(plan);
      localStorage.setItem("english-in-wonderland-access-plan", plan);
    }
    localStorage.setItem("english-in-wonderland-access-v2-complete", "true");
  }
  const progress = progressByJourney[activeJourneyId] ?? {};
  const claimedUnitIds = claimedUnits.filter(key => key.startsWith(`${activeJourneyId}:`)).map(key => Number(key.split(":")[1]));
  const reviewDate = new Date().toLocaleDateString("en-CA");
  const reviewedUnitIds = mapReviewClaims.filter(key => key.startsWith(`${activeJourneyId}:`) && key.endsWith(`:${reviewDate}`)).map(key => Number(key.split(":")[1]));
  const nextReviewReward = mapReviewClaims.some(key => key.endsWith(`:${reviewDate}`)) ? 3 : 5;
  const done = progress[activeUnit] ?? [];
  const activeJourney = journeys.find(item => item.id === activeJourneyId) ?? journeys[0];
  const activeCompanionName = companionId === "wolf" ? wolfName : companions[companionId].name;
  const activeLevelNumber = journeys.findIndex(item => item.id === activeJourney.id) + 1;
  const unitData = activeJourney.units[activeUnit - 1] ?? activeJourney.units[0];
  const completedUnits = activeJourney.units.filter((unit, index) => (progress[index + 1]?.length ?? 0) >= unit.lessonCount && claimedUnitIds.includes(index + 1)).length;
  const reviewKey = `${activeJourneyId}:${activeUnit}:${lesson}`;
  const needsReview = lesson > 1 && !done.includes(lesson) && !reviewedLessons.includes(reviewKey);
  if (accessFlow) return <AccessFlow initial={accessFlow} initialJourneyId={activeJourneyId} canExit={accessFlow === "pricing"} trialCompleted={completedUnits >= 2} onExit={() => setAccessFlow(null)} onComplete={completeAccess} />;
  if (screen === "journey-select") return <JourneySelection assignedJourneyId={assignedJourneyId} coins={coins} companionId={companionId} companionName={wolfName} studentName={studentName} onCompanion={() => setScreen("companion")} onProfile={() => { setProfileTab("overview"); setScreen("profile"); }} onSelect={(journeyId) => { if (journeyId !== assignedJourneyId) return; setActiveJourneyId(journeyId); setScreen("roadmap"); }} />;
  if (screen === "roadmap") return <><LearningRoadmap activeJourneyId={activeJourneyId} onChangeJourney={() => setScreen("journey-select")} onUnlock={() => setAccessFlow("pricing")} coins={coins} companionId={companionId} companionName={wolfName} studentName={studentName} progress={progress} claimedUnits={claimedUnitIds} reviewedUnits={reviewedUnitIds} reviewReward={nextReviewReward} onReviewComplete={completeMapReview} onProfile={() => { setProfileTab("overview"); setScreen("profile"); }} onCompanion={() => setScreen("companion")} onAssessment={() => setScreen("assessment")} hasPaidAccess={Boolean(accessPlan)} autoReviewUnit={autoReviewUnit} onAutoReviewOpened={() => setAutoReviewUnit(null)} onStart={(unitId, lessonId) => { setActiveUnit(unitId); setLesson(lessonId); if ((progress[unitId]?.length ?? 0) >= lessonTabs.length && !claimedUnitIds.includes(unitId)) setReward({ lesson: lessonTabs.length, unitComplete: true }); setScreen("lesson"); }} />{trialComplete && <div className="trial-complete-modal" role="dialog" aria-modal="true" aria-labelledby="trial-complete-title"><section><span className="trial-complete-mark"><Sparkles size={28}/></span><small>HOÀN THÀNH CHẶNG TRẢI NGHIỆM</small><h2 id="trial-complete-title">Bé đã chinh phục 2 Unit đầu tiên!</h2><p>Tiến độ, phần thưởng và hai Unit vừa học đã được lưu. Gia đình có thể mở chặng mới hoặc để bé ôn lại hoàn toàn miễn phí.</p><div className="trial-complete-summary"><span><Check size={17}/><b>8 Lesson đã hoàn thành</b></span><span><Gift size={17}/><b>Phần thưởng đã lưu</b></span></div><button className="trial-complete-primary" onClick={() => { setTrialComplete(false); setAccessFlow("pricing"); }}>Khám phá các gói học <ArrowRight size={17}/></button><button className="trial-complete-review" onClick={() => { setTrialComplete(false); setAutoReviewUnit(2); }}>Chưa đăng ký · Ôn lại Unit 2</button><small className="trial-complete-note">Bé vẫn có thể ôn lại Unit 1–2 bất kỳ lúc nào trên bản đồ.</small></section></div>}</>;
  if (screen === "profile") return <StudentLearningProfile studentName={studentName} level={activeJourney.level} journeyName={activeJourney.theme} progress={progress} reviewedUnits={reviewedUnitIds} initialTab={profileTab} onBack={() => setScreen("roadmap")} onOpenUnit={(unitId, lessonId) => { setActiveUnit(unitId); setLesson(lessonId); setScreen("lesson"); }} />;
  if (screen === "companion") return <CompanionHub coins={coins} companionId={companionId} companionName={wolfName} collection={collection} owned={owned} onBack={() => setScreen("roadmap")} onGoReview={() => setScreen("roadmap")} onCare={careForCompanion} onSelectCompanion={(id) => { setCompanionId(id); localStorage.setItem("english-in-wonderland-demo-companion", id); }} onBuy={buyForCompanion} />;
  if (screen === "assessment") return <LevelAssessment levelNumber={activeLevelNumber} levelName={activeJourney.level} onBack={() => setScreen("roadmap")} onComplete={completeAssessment} />;
  if (screen === "result") return <><LessonResult levelNumber={activeLevelNumber} levelName={activeJourney.level} score={assessmentScore} onOpenChest={() => setChestOpen(true)} onMap={() => setScreen("roadmap")} />{chestOpen && <div className="chest-modal" role="dialog" aria-modal="true" aria-label="Rương linh vật"><section><span className="chest-rays"/><small>RƯƠNG LEVEL {activeLevelNumber} ĐÃ MỞ</small><MascotPortrait id={pendingCompanion}/><h2>Xin chào, {companions[pendingCompanion].name}!</h2><p>Em đã mở khóa <b>{companions[pendingCompanion].kind}</b>. Em có thể chọn bạn ấy hoặc Sói Con cùng đồng hành.</p><button onClick={claimCompanion}><Gift size={18}/> Nhận linh vật</button></section></div>}</>;
  return <main className={`app-shell lesson-theme lesson-theme-${lesson}`}>
    <button className="floating-map-back" onClick={() => setScreen("roadmap")}><ChevronLeft size={17} /> Lộ trình</button>
    <header className="topbar"><div className="brand"><span className="brand-mark">E</span><span><b>ENGLISH IN</b><small>WONDERLAND</small></span></div><div className="journey"><div className="journey-copy"><span>Unit {activeUnit}</span><b>Lesson {lesson}/{lessonTabs.length}</b></div><div className="journey-track"><i style={{ width: `${Math.min((done.length + 1) / lessonTabs.length * 100, 100)}%` }}/></div></div><div className="top-actions"><button className="lesson-profile-button" onClick={() => { setProfileTab("overview"); setScreen("profile"); }}><BarChart3 size={17}/><span>Năng lực</span></button><button className="lesson-pet-button" onClick={() => setScreen("companion")}><MascotPortrait id={companionId} className="lesson-mini-wolf"/><span><small>Đồng hành</small><b>{companionId === "wolf" ? wolfName : companions[companionId].name}</b></span></button><button className="stat coin-top" onClick={() => setScreen("companion")}><Coins size={18}/> <b>{coins}</b> Xu</button><button className="avatar">{studentName.slice(0, 2).toUpperCase()}</button></div></header>
    <div className={"workspace" + (sidebarCollapsed ? " sidebar-collapsed" : "")}><aside className={"sidebar" + (sidebarCollapsed ? " collapsed" : "")}><div className="course-head"><button className="round-btn sidebar-toggle" onClick={() => setSidebarCollapsed(value => !value)} aria-expanded={!sidebarCollapsed} aria-label={sidebarCollapsed ? "Mở rộng menu" : "Thu gọn menu"} title={sidebarCollapsed ? "Mở rộng menu" : "Thu gọn menu"}>{sidebarCollapsed ? <ChevronRight size={18}/> : <ChevronLeft size={18}/>}</button><div><span>LEVEL {activeLevelNumber} · {activeJourney.level}</span><h2>{activeJourney.theme}</h2></div></div><div className="course-progress"><div><b>Unit {activeUnit}/{activeJourney.units.length}</b><span>{done.length}/{lessonTabs.length} Lesson</span></div><i><em style={{ width: `${done.length / lessonTabs.length * 100}%` }}/></i></div><p className="side-label">CÁC UNIT</p><div className="unit-list">{activeJourney.units.map((unit, index) => { const unitId = index + 1; const complete = (progress[unitId]?.length ?? 0) >= unit.lessonCount && claimedUnitIds.includes(unitId); const open = (index === 0 || index <= completedUnits) && (unitId <= 2 || Boolean(accessPlan)); return <button key={unit.landmark} disabled={!open} title={unit.landmark} className={"unit-card " + (unitId === activeUnit ? "active" : "")} onClick={() => { setActiveUnit(unitId); setLesson(Math.min((progress[unitId]?.length ?? 0) + 1, lessonTabs.length)); }}><span className="unit-number">{open ? unitId : <LockKeyhole size={14}/>}</span><span className="unit-copy"><b>{unit.landmark}</b><small>{unit.topic}</small></span><span className="unit-paw">{complete ? "🎁" : open ? `${progress[unitId]?.length ?? 0}/${unit.lessonCount}` : "🔒"}</span></button>; })}</div><div className="sheet-note"><span className={sheetOnline ? "live-dot" : "live-dot offline"}/> {sheetOnline ? "Đang đọc khung chương trình từ Google Sheets" : "Đang dùng dữ liệu mẫu nội bộ"}</div></aside>
      <section className="learning-area"><div className="unit-title-row"><div><span className="eyebrow">UNIT {activeUnit} · {unitData.topic.toUpperCase()}</span><h1>{unitData.landmark}</h1><p className="unit-flow-note">Mỗi Lesson trao 1 Mảnh Chìa Khóa để mở Túi Kỳ Vật cuối Unit.</p></div><div className="lesson-mission"><span><KeyRound size={14}/> MẢNH CHÌA KHÓA</span><b>{done.length}/{lessonTabs.length} mảnh</b><small>Đủ mảnh để mở Túi Kỳ Vật</small></div><Pill tone="mint">{activeJourney.level}</Pill></div><nav className="lesson-tabs">{lessonTabs.map(tab => { const Icon = tab.icon; const completed = done.includes(tab.id); const canOpen = tab.id === 1 || done.includes(tab.id - 1) || completed; return <button key={tab.id} disabled={!canOpen} onClick={() => setLesson(tab.id)} className={"lesson-tab " + (lesson === tab.id ? "active " : "") + (completed ? "done " : "") + (!canOpen ? "locked" : "")}><span className="tab-icon">{canOpen ? <Icon size={23}/> : <LockKeyhole size={20}/>} {completed && <i className="tab-check" aria-label="Đã hoàn thành"><Check size={11} strokeWidth={4}/></i>}</span><span className="tab-copy"><small>LESSON {tab.id}</small><b>{tab.label}</b></span><em>{completed ? "Đã có mảnh chìa khóa" : canOpen ? tab.sub : "Hoàn thành bước trước"}</em></button>; })}</nav>
        {needsReview && <LessonReviewGate key={reviewKey} lesson={lesson as 2 | 3 | 4} onComplete={() => setReviewedLessons(current => [...current, reviewKey])} />}
        {!needsReview && lesson === 1 && <LessonOneVideo finish={() => completeLesson(1)} rewardLabel="Hoàn thành Lesson 1" />}
        {!needsReview && lesson === 2 && <LessonTwoStructured finish={() => completeLesson(2)} />}
        {!needsReview && lesson === 3 && <LessonThreeStructured finish={() => completeLesson(3)} />}
        {!needsReview && lesson === 4 && <VoiceLabCamera support={support} setSupport={setSupport} showMeaning={showMeaning} setShowMeaning={setShowMeaning} finish={() => completeLesson(4)} />}
      </section></div>{reward && !bagReward && <div className="fish-reward-modal key-reward-modal" role="dialog" aria-modal="true" aria-label="Nhận Mảnh Chìa Khóa"><section><MascotPortrait id={companionId} className="reward-wolf"/><span className="reward-fish-icon"><KeyRound size={38}/></span><small>LESSON {reward.lesson} HOÀN THÀNH</small><h2>{reward.unitComplete ? "Chìa khóa đã hoàn chỉnh!" : `Nhận Mảnh Chìa Khóa ${done.length}/${lessonTabs.length}`}</h2><p>{reward.unitComplete ? `${activeCompanionName} đã tìm thấy Túi Kỳ Vật của Unit ${activeUnit}. Mở túi để nhận quà và mở khóa Unit tiếp theo.` : `${activeCompanionName} đã cất mảnh chìa khóa giúp em. Còn ${lessonTabs.length - done.length} mảnh nữa để mở Túi Kỳ Vật.`}</p><div><button className="primary" onClick={continueAfterReward}>{reward.unitComplete ? "Mở Túi Kỳ Vật" : "Học Lesson tiếp theo"} <ArrowRight size={18}/></button></div></section></div>}
      {bagReward && <div className="blind-bag-modal" role="dialog" aria-modal="true" aria-label="Túi Kỳ Vật"><section><span className="bag-burst"/><small>TÚI KỲ VẬT · UNIT {activeUnit}</small><span className="bag-prize-icon">{bagReward.icon}</span><h2>Em nhận được {bagReward.name}!</h2><p>{bagReward.note}</p><div className="bag-unlock-note"><Gift size={18}/><span><b>{activeUnit < activeJourney.units.length ? `Unit ${activeUnit + 1} đã được mở khóa` : "Mốc đánh giá đã được mở khóa"}</b><small>Quà đã được chuyển vào Khu Vườn Linh Vật.</small></span></div><button onClick={claimUnitBag}>Tiếp tục hành trình <ArrowRight size={18}/></button></section></div>}
  </main>;
}
