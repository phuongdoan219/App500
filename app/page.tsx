"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, BookOpen, Camera, Check, ChevronLeft, ChevronRight, Coins, Flame, Gift, Headphones, LockKeyhole, Mic, NotebookTabs, Pause, Play, RotateCcw, Settings, Sparkles, Square, Trophy, Video, Volume2, Waves, X, Zap } from "lucide-react";
import VoiceLabCamera from "@/components/voice-lab-camera";
import LessonOneVideo from "@/components/lesson-one-video";
import LearningRoadmap, { JourneySelection, journeys } from "@/components/learning-roadmap";
import LessonResult from "@/components/lesson-result";
import CompanionHub, { CompanionId, companions, MascotPortrait } from "@/components/companion-hub";
import StreakHub from "@/components/streak-hub";
import AccessFlow from "@/components/access-flow";
import LevelAssessment from "@/components/level-assessment";

const units = [
  { id: 1, title: "The Wrong Bag", theme: "Ngoại hình & đồ vật", open: true },
  { id: 2, title: "A Rainy Day", theme: "Thời tiết", open: false },
  { id: 3, title: "At the School Fair", theme: "Hoạt động", open: false },
  { id: 4, title: "My Funny Robot", theme: "Miêu tả", open: false },
  { id: 5, title: "Picnic Surprise", theme: "Đồ ăn", open: false },
];
const lessonTabs = [
  { id: 1, label: "Khám phá", icon: Play, sub: "Xem & hiểu" }, { id: 2, label: "Hiểu sâu", icon: BookOpen, sub: "Từ & câu" },
  { id: 3, label: "Nghe · Viết", icon: Headphones, sub: "Bắt âm" }, { id: 4, label: "Lồng tiếng", icon: Mic, sub: "Camera & micro" },
];
const lines = [
  { who: "Ben", text: "Oh no! Where is my red kite?", vi: "Ôi không! Chiếc diều đỏ của tớ đâu rồi?", tone: "Lo lắng nhẹ · nhấn vào red kite" },
  { who: "Mai", text: "Look, Ben! It is in the tree!", vi: "Nhìn kìa, Ben! Nó ở trên cây!", tone: "Phấn khởi · lên giọng ở Look" },
  { who: "Ben", text: "You're right. Can we get it down?", vi: "Cậu nói đúng. Ta lấy nó xuống được không?", tone: "Mừng rồi chuyển sang hỏi" },
];

function say(text: string, rate = 0.82) { if (!("speechSynthesis" in window)) return; window.speechSynthesis.cancel(); const v = new SpeechSynthesisUtterance(text); v.lang = "en-US"; v.rate = rate; v.pitch = 1.08; window.speechSynthesis.speak(v); }
function Pill({ children, tone = "blue" }: { children: React.ReactNode; tone?: string }) { return <span className={"pill pill-" + tone}>{children}</span>; }

export default function Home() {
  const [screen, setScreen] = useState<"journey-select" | "roadmap" | "lesson" | "assessment" | "result" | "companion" | "streak">("journey-select");
  const [activeJourneyId, setActiveJourneyId] = useState<(typeof journeys)[number]["id"]>("magic-school");
  const [lesson, setLesson] = useState(1), [storyStep, setStoryStep] = useState(1), [playing, setPlaying] = useState(false);
  const [answer, setAnswer] = useState(""), [checked, setChecked] = useState(false), [dictation, setDictation] = useState("");
  const [lineIndex, setLineIndex] = useState(0), [support, setSupport] = useState("captions"), [showMeaning, setShowMeaning] = useState(true);
  const [notebookOpen, setNotebookOpen] = useState(false), [done, setDone] = useState<number[]>([]);
  const [sheetOnline, setSheetOnline] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [coins, setCoins] = useState(0);
  const [streak, setStreak] = useState(6);
  const [accessFlow, setAccessFlow] = useState<null | "welcome" | "pricing">("welcome");
  const [activePlan, setActivePlan] = useState("Dùng thử");
  const [owned, setOwned] = useState<string[]>([]);
  const [companionId, setCompanionId] = useState<CompanionId | null>(null);
  const [pendingCompanion, setPendingCompanion] = useState<CompanionId>("dragon");
  const [chestOpen, setChestOpen] = useState(false);
  const [assessmentScore, setAssessmentScore] = useState(0);
  const [reviewClaimed, setReviewClaimed] = useState(false);
  const [reward, setReward] = useState<{ lesson: number; earned: boolean } | null>(null);
  useEffect(() => { const saved = localStorage.getItem("english-in-wonderland-demo-progress"); if (saved) setDone(JSON.parse(saved)); }, []);
  useEffect(() => {
    const savedCoins = localStorage.getItem("english-in-wonderland-demo-coins");
    const savedOwned = localStorage.getItem("english-in-wonderland-demo-companion-items");
    const savedCompanion = localStorage.getItem("english-in-wonderland-demo-companion") as CompanionId | null;
    const savedStreak = localStorage.getItem("english-in-wonderland-demo-streak");
    const savedAccess = localStorage.getItem("english-in-wonderland-demo-access-complete");
    const savedPlan = localStorage.getItem("english-in-wonderland-demo-plan");
    if (savedCoins) setCoins(Number(savedCoins));
    if (savedOwned) setOwned(JSON.parse(savedOwned));
    if (savedCompanion && savedCompanion in companions) setCompanionId(savedCompanion);
    setReviewClaimed(localStorage.getItem("english-in-wonderland-demo-review-date") === new Date().toDateString());
    if (savedStreak) setStreak(Number(savedStreak));
    if (savedAccess === "true") setAccessFlow(null);
    if (savedPlan) setActivePlan(savedPlan);
  }, []);
  useEffect(() => { fetch("/api/curriculum").then(r => r.json()).then((data: unknown) => setSheetOnline(Boolean((data as { connected?: boolean }).connected))).catch(() => setSheetOnline(false)); }, []);
  function completeLesson(id: number) {
    const next = Array.from(new Set([...done, id]));
    setDone(next);
    localStorage.setItem("english-in-wonderland-demo-progress", JSON.stringify(next));
    const today = new Date().toDateString();
    const earned = localStorage.getItem("english-in-wonderland-demo-streak-date") !== today;
    if (earned) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      localStorage.setItem("english-in-wonderland-demo-streak", String(nextStreak));
      localStorage.setItem("english-in-wonderland-demo-streak-date", today);
    }
    setReward({ lesson: id, earned });
  }
  function continueAfterReward() {
    if (!reward) return;
    if (reward.lesson === 4) {
      setReward(null);
      setScreen("roadmap");
      return;
    }
    setLesson(reward.lesson + 1);
    setStoryStep(1);
    setAnswer("");
    setChecked(false);
    setDictation("");
    setReward(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
  function completeReview() {
    const nextCoins = coins + 3;
    setCoins(nextCoins);
    setReviewClaimed(true);
    localStorage.setItem("english-in-wonderland-demo-coins", String(nextCoins));
    localStorage.setItem("english-in-wonderland-demo-review-date", new Date().toDateString());
  }
  function completeAssessment(score: number) {
    const ids = Object.keys(companions) as CompanionId[];
    const available = companionId ? ids.filter(id => id !== companionId) : ids;
    const unlocked = available[Math.floor(Math.random() * available.length)] ?? ids[0];
    setAssessmentScore(score);
    setPendingCompanion(unlocked);
    setChestOpen(false);
    setScreen("result");
  }
  function claimCompanion() {
    setCompanionId(pendingCompanion);
    localStorage.setItem("english-in-wonderland-demo-companion", pendingCompanion);
    setChestOpen(false);
  }
  function completeAccess(plan: string) {
    setActivePlan(plan);
    setAccessFlow(null);
    localStorage.setItem("english-in-wonderland-demo-access-complete", "true");
    localStorage.setItem("english-in-wonderland-demo-plan", plan);
  }
  function toggleStory() { const video = document.getElementById("story-video") as HTMLVideoElement | null; if (!video) return; if (video.paused) { video.play(); setPlaying(true); } else { video.pause(); setPlaying(false); } }
  const level = Math.floor(streak / 7) + 1;
  if (accessFlow) return <AccessFlow key={accessFlow} initial={accessFlow} canExit={accessFlow === "pricing"} onExit={() => setAccessFlow(null)} onComplete={completeAccess} />;
  if (screen === "journey-select") return <JourneySelection coins={coins} streak={streak} companionId={companionId} activePlan={activePlan} onCompanion={() => setScreen("companion")} onStreak={() => setScreen("streak")} onShowAccess={() => setAccessFlow("welcome")} onSelect={(journeyId) => { setActiveJourneyId(journeyId); setScreen("roadmap"); }} />;
  if (screen === "roadmap") return <LearningRoadmap activeJourneyId={activeJourneyId} onChangeJourney={() => setScreen("journey-select")} coins={coins} streak={streak} companionId={companionId} activePlan={activePlan} completedLessons={done} onCompanion={() => setScreen("companion")} onStreak={() => setScreen("streak")} onShowAccess={() => setAccessFlow("welcome")} onLockedMap={() => setAccessFlow("pricing")} onAssessment={() => setScreen("assessment")} onStart={(lessonId) => { setLesson(lessonId); setScreen("lesson"); }} />;
  if (screen === "companion") return <CompanionHub coins={coins} companionId={companionId} owned={owned} reviewClaimed={reviewClaimed} onBack={() => setScreen("roadmap")} onReviewComplete={completeReview} onBuy={buyForCompanion} />;
  if (screen === "streak") return <StreakHub streak={streak} level={level} onBack={() => setScreen("roadmap")} onLearn={() => { setLesson([1, 2, 3, 4].find(id => !done.includes(id)) ?? 1); setScreen("lesson"); }} />;
  if (screen === "assessment") return <LevelAssessment onBack={() => setScreen("roadmap")} onComplete={completeAssessment} />;
  if (screen === "result") return <><LessonResult score={assessmentScore} streak={streak} level={level} companionName={companions[pendingCompanion].name} onOpenChest={() => setChestOpen(true)} onStreak={() => setScreen("streak")} onMap={() => setScreen("roadmap")} onReplay={() => setScreen("assessment")} />{chestOpen && <div className="chest-modal" role="dialog" aria-modal="true" aria-label="Rương linh vật"><section><span className="chest-rays"/><small>RƯƠNG LEVEL 1 ĐÃ MỞ</small><MascotPortrait id={pendingCompanion}/><h2>Xin chào, {companions[pendingCompanion].name}!</h2><p>Em đã mở khóa <b>{companions[pendingCompanion].kind}</b>. Từ bây giờ, ôn bài sẽ giúp em kiếm Xu để chăm người bạn mới.</p><button onClick={claimCompanion}><Gift size={18}/> Nhận linh vật</button></section></div>}</>;
  return <main className={`app-shell lesson-theme lesson-theme-${lesson}`}>
    <button className="floating-map-back" onClick={() => setScreen("roadmap")}><ChevronLeft size={17} /> Lộ trình</button>
    <header className="topbar"><div className="brand"><span className="brand-mark">E</span><span><b>ENGLISH IN</b><small>WONDERLAND</small></span></div><div className="journey"><div className="journey-copy"><span>Hành trình hôm nay</span><b>Lesson {lesson}/4</b></div><div className="journey-track"><i style={{ width: ((done.length + 1) / 4 * 100) + "%" }} /></div></div><div className="top-actions"><button className="stat coin-top" onClick={() => setScreen("companion")}><Coins size={18}/> <b>{coins}</b> Xu</button><button className="stat streak-top" onClick={() => setScreen("streak")}><Flame size={18} fill="currentColor"/> <b>{streak}</b> ngày</button><button className="avatar">AN</button></div></header>
    <div className={"workspace" + (sidebarCollapsed ? " sidebar-collapsed" : "")}><aside className={"sidebar" + (sidebarCollapsed ? " collapsed" : "")}><div className="course-head"><button className="round-btn sidebar-toggle" onClick={() => setSidebarCollapsed(value => !value)} aria-expanded={!sidebarCollapsed} aria-label={sidebarCollapsed ? "Mở rộng menu" : "Thu gọn menu"} title={sidebarCollapsed ? "Mở rộng menu" : "Thu gọn menu"}>{sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}</button><div><span>BEGINNER 1</span><h2>English Adventures</h2></div></div><div className="course-progress"><div><b>Unit 1/24</b><span>{done.length}/4 Lesson</span></div><i><em style={{ width: `${done.length * 25}%` }} /></i></div><p className="side-label">CHỌN UNIT</p><div className="unit-list">{units.map(unit => <button key={unit.id} disabled={!unit.open} title={unit.title} className={"unit-card " + (unit.id === 1 ? "active" : "")}><span className="unit-number">{unit.open ? unit.id : <LockKeyhole size={14} />}</span><span className="unit-copy"><b>{unit.title}</b><small>{unit.theme}</small></span><span className="unit-paw">{unit.id === 1 ? `✓ ${done.length}/4` : "🔒"}</span></button>)}</div><button className="notebook-btn" title="Sổ tay của em" onClick={() => setNotebookOpen(true)}><NotebookTabs size={20} /><span><b>Sổ tay của em</b><small>12 từ · 3 mẫu câu</small></span><ArrowRight size={17} /></button><div className="sheet-note"><span className={sheetOnline ? "live-dot" : "live-dot offline"} /> {sheetOnline ? "Đang đọc khung chương trình từ Google Sheets" : "Đang dùng dữ liệu mẫu nội bộ"}</div></aside>
      <section className="learning-area"><div className="unit-title-row"><div><span className="eyebrow">UNIT 1 · NGOẠI HÌNH &amp; ĐỒ VẬT</span><h1>The Wrong Bag</h1><p className="unit-flow-note">Hoàn thành Lesson hiện tại để tự mở bước tiếp theo.</p></div><div className="lesson-mission"><span><Sparkles size={14}/> NHIỆM VỤ HIỆN TẠI</span><b>{lessonTabs[lesson - 1].label}</b><small>Lesson {lesson}/4 · Tiến gần mốc đánh giá</small></div><Pill tone="mint">A1 Starter</Pill></div><nav className="lesson-tabs">{lessonTabs.map(tab => { const Icon = tab.icon; const completed = done.includes(tab.id); const canOpen = tab.id === 1 || done.includes(tab.id - 1) || completed; return <button key={tab.id} disabled={!canOpen} onClick={() => setLesson(tab.id)} className={"lesson-tab " + (lesson === tab.id ? "active " : "") + (completed ? "done " : "") + (!canOpen ? "locked" : "")}><span className="tab-icon">{canOpen ? <Icon size={23} /> : <LockKeyhole size={20} />}{completed && <i className="tab-check" aria-label="Đã hoàn thành"><Check size={11} strokeWidth={4} /></i>}</span><span className="tab-copy"><small>LESSON {tab.id}</small><b>{tab.label}</b></span><em>{canOpen ? tab.sub : "Hoàn thành bước trước"}</em></button>; })}</nav>
        {lesson === 1 && <LessonOneVideo storyStep={storyStep} setStoryStep={setStoryStep} answer={answer} setAnswer={setAnswer} checked={checked} setChecked={setChecked} finish={() => completeLesson(1)} rewardLabel="Hoàn thành Lesson" />}
        {lesson === 2 && <LessonTwo finish={() => completeLesson(2)} />}
        {lesson === 3 && <LessonThree dictation={dictation} setDictation={setDictation} finish={() => completeLesson(3)} />}
        {lesson === 4 && <VoiceLabCamera support={support} setSupport={setSupport} showMeaning={showMeaning} setShowMeaning={setShowMeaning} finish={() => completeLesson(4)} />}
      </section></div>{notebookOpen && <Notebook onClose={() => setNotebookOpen(false)} />}{reward && <div className="fish-reward-modal streak-modal" role="dialog" aria-modal="true" aria-label="Tiến trình hoàn thành Lesson"><section><span className="reward-fish-icon">{reward.lesson === 4 ? "🏁" : "✓"}</span><small>LESSON HOÀN THÀNH</small><h2>{reward.lesson === 4 ? "Mốc đánh giá đã mở!" : `Đã hoàn thành Lesson ${reward.lesson}`}</h2><p>{reward.lesson === 4 ? "Quay về bản đồ và chinh phục mốc cuối để hoàn thành Level, mở rương linh vật." : reward.earned ? `Streak vẫn an toàn: chuỗi hiện tại là ${streak} ngày.` : "Hôm nay em đã giữ streak. Học tiếp để tiến gần mốc đánh giá cuối Level."}</p><div><button className="reward-cat-button" onClick={() => { setReward(null); setScreen("streak"); }}><Flame size={18}/> Xem streak</button><button className="primary" onClick={continueAfterReward}>{reward.lesson === 4 ? "Về mốc đánh giá" : "Học Lesson tiếp theo"} <ArrowRight size={18}/></button></div></section></div>}
  </main>;
}

function LessonOne(p: any) { const { storyStep, setStoryStep, playing, toggleStory, answer, setAnswer, checked, setChecked, finish } = p; return <div className="lesson-layout"><div className="main-card story-card"><div className="card-top"><div><Pill tone="coral"><Sparkles size={13} /> Câu chuyện</Pill><h2>Chiếc diều đi đâu rồi?</h2><p>Xem câu chuyện và thử đoán điều xảy ra tiếp theo.</p></div><button className="icon-button"><Settings size={18} /></button></div><div className="story-stage"><img src="/story-park.png" alt="Hai bạn nhỏ tìm chiếc diều đỏ mắc trên cây" /><div className="story-shade" /><span className="video-empty">VIDEO SẼ ĐƯỢC THÊM SAU</span><button className="big-play" onClick={toggleStory}>{playing ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}</button><div className="caption"><b>Ben:</b> Oh no! Where is my red kite?</div><div className="player-bar"><button onClick={toggleStory}>{playing ? <Pause size={16} /> : <Play size={16} />}</button><span>0:08</span><i><em style={{ width: playing ? "52%" : "28%" }} /></i><span>0:32</span><Volume2 size={16} /><span className="cc">CC</span></div></div><div className="micro-actions"><button onClick={() => say("Where is my red kite?", .72)}><Volume2 size={17} /> Nghe chậm</button><button onClick={() => say("Where is my red kite?", .9)}><Waves size={17} /> Nghe tự nhiên</button></div></div><aside className="activity-card"><div className="activity-kicker">BƯỚC {storyStep}/4</div><h3>{storyStep === 1 ? "Sẵn sàng khám phá?" : "Diều đang ở đâu?"}</h3>{storyStep === 1 ? <><p>Hãy xem đoạn đầu. Chưa cần hiểu từng từ — chỉ cần để ý nét mặt và hành động.</p><div className="tip"><Zap size={19} /><span><b>Mẹo nhỏ</b>Em có thể nghe lại bao nhiêu lần tùy thích.</span></div><button className="primary" onClick={() => { toggleStory(); setStoryStep(2); }}>Xem & tiếp tục <ArrowRight size={18} /></button></> : <><p>Chọn câu trả lời đúng theo hình và câu chuyện.</p><div className="answers">{["It is under the bench.", "It is in the tree.", "It is in the bag."].map(item => <button key={item} className={(answer === item ? "selected " : "") + (checked && item === "It is in the tree." ? "correct" : "")} onClick={() => setAnswer(item)}>{item}</button>)}</div>{checked && <div className="success"><Check size={18} /><span><b>Chính xác!</b> “In the tree” nghĩa là ở trên cây.</span></div>}<button disabled={!answer} className="primary" onClick={() => { setChecked(true); finish(); }}>{checked ? "Hoàn thành Lesson" : "Kiểm tra"} <ArrowRight size={18} /></button></>}<div className="step-dots">{[1,2,3,4].map(i => <button key={i} className={i <= storyStep ? "on" : ""} onClick={() => setStoryStep(i)} />)}</div></aside></div>; }

function LessonTwo({ finish }: { finish: () => void }) {
  const [step, setStep] = useState(1);
  const [choice, setChoice] = useState("");
  const [result, setResult] = useState(false);
  const correct = choice === "little";
  const steps = ["Học từ", "Mẫu câu", "Luyện nhanh"];

  return <div className="deep-dive-card">
    <div className="deep-dive-head">
      <div><Pill tone="yellow"><BookOpen size={13}/> TỪ &amp; MẪU CÂU</Pill><h2>Hiểu sâu câu chuyện</h2><p>Đi lần lượt từng bước để ghi nhớ từ và cách dùng trong câu.</p></div>
      <span className="deep-dive-reward">Hoàn thành để mở mốc tiếp theo</span>
    </div>

    <ol className="deep-dive-steps" aria-label="Tiến trình Lesson 2">
      {steps.map((label, index) => {
        const number = index + 1;
        const complete = number < step;
        return <li key={label} className={(number === step ? "active " : "") + (complete ? "complete" : "")} aria-current={number === step ? "step" : undefined}>
          <span>{complete ? <Check size={15}/> : number}</span><b>{label}</b>
        </li>;
      })}
    </ol>

    {step === 1 && <section className="deep-dive-stage" aria-labelledby="vocab-title">
      <div className="stage-heading"><span>BƯỚC 1/3</span><h3 id="vocab-title">Chạm vào từng từ để nghe</h3><p>Ôn lại những từ miêu tả xuất hiện trong video.</p></div>
      <div className="word-grid">{[["little","nhỏ","🤏"],["tall","cao","📏"],["young","trẻ","🧒"],["slim","mảnh khảnh","🧍"]].map(w=><button key={w[0]} aria-label={`Nghe từ ${w[0]}, nghĩa là ${w[1]}`} onClick={()=>say(w[0])}><span>{w[2]}</span><b>{w[0]}</b><small>{w[1]}</small><Volume2 size={15}/></button>)}</div>
      <button className="primary deep-dive-next" onClick={()=>setStep(2)}>Tiếp tục: Học mẫu câu <ArrowRight size={18}/></button>
    </section>}

    {step === 2 && <section className="deep-dive-stage" aria-labelledby="pattern-title">
      <div className="stage-heading"><span>BƯỚC 2/3</span><h3 id="pattern-title">Đặt từ vào câu hoàn chỉnh</h3><p>Nghe và chú ý thứ tự của các từ miêu tả.</p></div>
      <div className="pattern lesson-two-pattern"><span>MẪU CÂU</span><h3>Tom has a <em>little yellow bag.</em></h3><p>Tom có một chiếc túi nhỏ màu vàng.</p><button onClick={()=>say("Tom has a little yellow bag.")}><Volume2 size={17}/> Nghe cả mẫu câu</button></div>
      <div className="deep-dive-actions"><button className="lesson-two-back" onClick={()=>setStep(1)}><ChevronLeft size={17}/> Ôn lại từ</button><button className="primary" onClick={()=>setStep(3)}>Tiếp tục: Luyện nhanh <ArrowRight size={18}/></button></div>
    </section>}

    {step === 3 && <section className="deep-dive-stage quiz-stage" aria-labelledby="quiz-title">
      <div className="stage-heading"><span>BƯỚC 3/3</span><h3 id="quiz-title">Chọn từ còn thiếu</h3><p>Tom has a ___ yellow bag.</p></div>
      <div className="answers compact lesson-two-answers">{["little","tall","old"].map(x=><button key={x} className={(choice===x?"selected ":"")+(result&&x==="little"?"correct":"")} onClick={()=>{setChoice(x);setResult(false);}}>{x}</button>)}</div>
      {!choice && <p className="choice-hint">Hãy chọn một đáp án để tiếp tục.</p>}
      {result&&<div className={correct?"success lesson-two-feedback":"feedback retry lesson-two-feedback"}>{correct?<><Check size={18}/><span><b>Đúng rồi!</b> A little yellow bag.</span></>:"Chưa đúng. Hãy nghe lại mẫu câu hoặc chọn đáp án khác nhé."}</div>}
      <div className="deep-dive-actions"><button className="lesson-two-back" onClick={()=>{setStep(2);setResult(false);}}><ChevronLeft size={17}/> Xem lại mẫu câu</button>{result&&correct?<button className="primary" onClick={finish}>Hoàn thành Lesson 2 <ArrowRight size={18}/></button>:<button className="primary" disabled={!choice} onClick={()=>setResult(true)}>Kiểm tra <ArrowRight size={18}/></button>}</div>
    </section>}
  </div>;
}

function LessonThree({dictation,setDictation,finish}:any){const[checked,setChecked]=useState(false);const correct=dictation.trim().toLowerCase().replace(/[.!?]/g,"")==="the boy is carrying a yellow bag";return <div className="focus-card"><div className="focus-icon"><Headphones size={28}/></div><Pill tone="blue">NGHE · VIẾT</Pill><h2>Bắt lấy từng âm</h2><p>Nghe câu trong truyện rồi viết lại. Em có thể nghe chậm từng cụm.</p><div className="listen-orb"><button onClick={()=>say("The boy is carrying a yellow bag.",.78)}><Play fill="currentColor"/></button><span><b>Nghe câu</b><small>0:04</small></span></div><div className="chunk-row"><button onClick={()=>say("The boy",.65)}>The boy</button><button onClick={()=>say("is carrying",.65)}>is carrying</button><button onClick={()=>say("a yellow bag",.65)}>a yellow bag</button></div><label className="dictation"><span>Câu em nghe được</span><input value={dictation} onChange={e=>{setDictation(e.target.value);setChecked(false);}} placeholder="Type what you hear..."/></label>{checked&&<div className={correct?"feedback good":"feedback retry"}>{correct?"Tuyệt lắm! Em đã bắt đúng cả câu.":"Gần đúng rồi. Hãy nghe từng cụm một nhé."}</div>}<button className="primary wide" disabled={!dictation} onClick={()=>{setChecked(true);if(correct)finish();}}>Kiểm tra câu trả lời <ArrowRight size={18}/></button></div>}

function VoiceLab(p:any){const{lineIndex,setLineIndex,support,setSupport,showMeaning,setShowMeaning,recording,seconds,audioUrl,startRecording,stopRecording,finish}=p;const line=lines[lineIndex];return <div className="voice-shell"><div className="voice-head"><div><Pill tone="purple"><Mic size={13}/> VOICE LAB</Pill><h2>Lồng tiếng có người dẫn đường</h2><p>Nghe mẫu → bắt chước từng cụm → thu cả câu. Giọng của em không cần hoàn hảo.</p></div><div className="privacy"><span>●</span> Camera mặc định tắt</div></div><div className="voice-grid"><section className="scene-panel"><img src="/story-park.png" alt="Cảnh hai bạn nhỏ và chiếc diều đỏ"/><div className="role-badge">Em lồng tiếng: <b>{line.who}</b></div><div className="line-overlay"><span>{line.text}</span>{showMeaning&&<small>{line.vi}</small>}</div><div className="scene-controls"><button onClick={()=>setLineIndex(Math.max(0,lineIndex-1))}><ChevronLeft size={17}/></button><span>Cảnh {lineIndex+1}/{lines.length}</span><div>{lines.map((_,i)=><i key={i} className={i===lineIndex?"on":""}/>)}</div><button onClick={()=>setLineIndex(Math.min(lines.length-1,lineIndex+1))}><ArrowRight size={17}/></button></div></section><section className="coach-panel"><div className="coach-title"><span className="coach-avatar">AI</span><div><b>Nghe mẫu trước nhé</b><small>{line.tone}</small></div></div><button className="model-button" onClick={()=>say(line.text,.76)}><span><Volume2 size={22}/></span><div><b>Nghe giọng mẫu</b><small>Chậm, rõ từng cụm</small></div><Play size={18} fill="currentColor"/></button><div className="chunks">{line.text.split(/(?<=[!?.,])/).filter(Boolean).map((chunk:string)=><button key={chunk} onClick={()=>say(chunk,.68)}>{chunk.trim()} <Volume2 size={14}/></button>)}</div><label className="switch-line"><span>Hiện nghĩa tiếng Việt</span><input type="checkbox" checked={showMeaning} onChange={e=>setShowMeaning(e.target.checked)}/></label><div className="support"><span>Mức hỗ trợ khi thu</span><div>{[["model","Có giọng mẫu"],["soft","Mẫu nhỏ"],["music","Tự nói"]].map(x=><button key={x[0]} className={support===x[0]?"active":""} onClick={()=>setSupport(x[0])}>{x[1]}</button>)}</div></div><button className={"record-button "+(recording?"recording":"")} onClick={recording?stopRecording:startRecording}>{recording?<Square fill="currentColor"/>:<Mic/>}<span><b>{recording?"Đang thu... "+seconds+"s":"Thu câu của em"}</b><small>{recording?"Bấm để dừng":"Nghe mẫu vẫn có thể phát nhỏ cùng em"}</small></span></button>{audioUrl&&<div className="take"><audio controls src={audioUrl}/><button onClick={startRecording}><RotateCcw size={16}/> Thu lại</button></div>}<button className="primary wide" disabled={!audioUrl} onClick={()=>{finish();setLineIndex(Math.min(lines.length-1,lineIndex+1));}}>{lineIndex===lines.length-1?"Hoàn thành lồng tiếng":"Giữ bản này & sang câu tiếp"}<ArrowRight size={18}/></button></section></div></div>}

function Notebook({onClose}:{onClose:()=>void}){return <div className="modal-backdrop" onClick={onClose}><section className="notebook" onClick={e=>e.stopPropagation()}><button className="close" onClick={onClose}><X/></button><div className="notebook-head"><span>📒</span><div><small>SỔ TAY CỦA EM</small><h2>Từ vựng & mẫu câu</h2><p>Từ làm đúng trên 80% sẽ vào nhóm “Đã nhớ”.</p></div></div><div className="memory-stats"><div><b>12</b><span>Đã nhớ</span></div><div><b>4</b><span>Cần ôn</span></div><div><b>3</b><span>Mẫu câu</span></div></div><h3>Ôn lại hôm nay</h3>{[["little","nhỏ",92],["tall","cao",76],["yellow bag","chiếc túi màu vàng",68]].map(w=><div className="review-row" key={w[0]}><button onClick={()=>say(String(w[0]))}><Volume2 size={16}/></button><span><b>{w[0]}</b><small>{w[1]}</small></span><i><em style={{width:w[2]+"%"}}/></i><strong>{w[2]}%</strong></div>)}<div className="review-modes"><button>Flashcard</button><button>Viết</button><button>Nghe</button><button>Nói</button></div></section></div>}
