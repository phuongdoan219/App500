"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, BookOpen, CheckCircle2, Headphones, Mic, NotebookTabs, Search, Sparkles, Target, TrendingUp, Volume2 } from "lucide-react";
import type { UnitProgress } from "@/components/learning-roadmap";
import "./student-learning-profile.css";

type Tab = "overview" | "notebook";
type NotebookItem = { kind: "word" | "pattern"; text: string; meaning: string; sources: number[]; mastery: number };

const lessonContent: Record<number, Array<Omit<NotebookItem, "sources" | "mastery">>> = {
  1: [
    { kind: "word", text: "bag", meaning: "chiếc túi" },
    { kind: "word", text: "yellow", meaning: "màu vàng" },
    { kind: "word", text: "little", meaning: "nhỏ" },
    { kind: "word", text: "tall", meaning: "cao" },
  ],
  2: [
    { kind: "word", text: "little", meaning: "nhỏ" },
    { kind: "word", text: "tall", meaning: "cao" },
    { kind: "word", text: "young", meaning: "trẻ" },
    { kind: "word", text: "slim", meaning: "mảnh khảnh" },
    { kind: "pattern", text: "Tom has a little yellow bag.", meaning: "Tom có một chiếc túi nhỏ màu vàng." },
  ],
  3: [
    { kind: "word", text: "carry", meaning: "mang / cầm" },
    { kind: "word", text: "yellow bag", meaning: "chiếc túi màu vàng" },
    { kind: "pattern", text: "The boy is carrying a yellow bag.", meaning: "Cậu bé đang mang một chiếc túi màu vàng." },
  ],
  4: [
    { kind: "word", text: "standing near", meaning: "đang đứng gần" },
    { kind: "pattern", text: "The child is standing near the chair.", meaning: "Đứa trẻ đang đứng gần chiếc ghế." },
  ],
};

type Props = {
  studentName: string;
  level: string;
  journeyName: string;
  progress: UnitProgress;
  reviewedUnits: number[];
  initialTab: Tab;
  onBack: () => void;
  onOpenUnit: (unitId: number, lessonId: number) => void;
};

function speak(text: string) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.78;
  window.speechSynthesis.speak(utterance);
}

export default function StudentLearningProfile({ studentName, level, journeyName, progress, reviewedUnits, initialTab, onBack, onOpenUnit }: Props) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [filter, setFilter] = useState<"all" | "word" | "pattern">("all");
  const [query, setQuery] = useState("");
  const lessonCounts = [1, 2, 3, 4].map(lessonId => Object.values(progress).filter(lessons => lessons.includes(lessonId)).length);
  const startedUnits = Math.max(1, Object.values(progress).filter(lessons => lessons.length > 0).length);
  const completedLessons = Object.values(progress).reduce((sum, lessons) => sum + lessons.length, 0);
  const completedUnits = Object.values(progress).filter(lessons => lessons.length >= 4).length;

  function abilityScore(evidence: number, reviewBoost = 0) {
    if (evidence === 0) return 0;
    return Math.min(96, 45 + Math.round((evidence / startedUnits) * 40) + reviewBoost);
  }

  const skills = [
    { name: "Từ vựng", icon: BookOpen, score: abilityScore(Math.max(lessonCounts[0], lessonCounts[1]), reviewedUnits.length * 2), color: "violet", note: "Nhận biết và dùng từ trong ngữ cảnh" },
    { name: "Ngữ pháp", icon: Sparkles, score: abilityScore(lessonCounts[1], reviewedUnits.length * 2), color: "yellow", note: "Hoàn chỉnh và vận dụng mẫu câu" },
    { name: "Nghe", icon: Headphones, score: abilityScore(lessonCounts[2], reviewedUnits.length * 2), color: "blue", note: "Nghe câu và bắt đúng thông tin" },
    { name: "Nói", icon: Mic, score: abilityScore(lessonCounts[3]), color: "coral", note: "Phát âm và phản xạ theo câu mẫu" },
  ];
  const practicedSkills = skills.filter(skill => skill.score > 0);
  const averageScore = practicedSkills.length ? Math.round(practicedSkills.reduce((sum, skill) => sum + skill.score, 0) / practicedSkills.length) : 0;
  const focusSkill = [...skills].sort((a, b) => a.score - b.score)[0];

  const notebookItems = useMemo(() => {
    const saved = new Map<string, NotebookItem>();
    Object.entries(progress).forEach(([unitIdText, lessons]) => {
      const unitId = Number(unitIdText);
      lessons.forEach(lessonId => {
        (lessonContent[lessonId] ?? []).forEach(item => {
          const key = `${item.kind}:${item.text}`;
          const current = saved.get(key);
          const sources = current ? Array.from(new Set([...current.sources, unitId])) : [unitId];
          const mastery = Math.min(96, 55 + sources.length * 10 + (reviewedUnits.some(id => sources.includes(id)) ? 12 : 0));
          saved.set(key, { ...item, sources, mastery });
        });
      });
    });
    return Array.from(saved.values());
  }, [progress, reviewedUnits]);

  const visibleItems = notebookItems.filter(item => (filter === "all" || item.kind === filter) && `${item.text} ${item.meaning}`.toLowerCase().includes(query.toLowerCase()));
  const remembered = notebookItems.filter(item => item.mastery >= 80).length;
  const patterns = notebookItems.filter(item => item.kind === "pattern").length;

  return <main className="learning-profile-screen">
    <header className="learning-profile-topbar"><button onClick={onBack}><ArrowLeft size={18}/> Về lộ trình</button><div><span>HỒ SƠ HỌC TẬP</span><b>{journeyName} · {level}</b></div><strong><TrendingUp size={18}/> {averageScore}% tích lũy</strong></header>
    <section className="learning-profile-wrap">
      <div className="learning-profile-hero"><div><span><Sparkles size={14}/> CẬP NHẬT TỪ HOẠT ĐỘNG HỌC</span><h1>Năng lực & Sổ tay của {studentName}</h1><p>Mỗi Lesson hoàn thành và lượt ôn trên bản đồ sẽ tự động cập nhật hồ sơ này.</p></div><div className="profile-summary-ring" style={{ "--profile-score": `${averageScore * 3.6}deg` } as React.CSSProperties}><span><b>{averageScore}%</b><small>Mức tích lũy</small></span></div></div>
      <nav className="learning-profile-tabs"><button className={tab === "overview" ? "active" : ""} onClick={() => setTab("overview")}><Target size={17}/> Tổng quan năng lực</button><button className={tab === "notebook" ? "active" : ""} onClick={() => setTab("notebook")}><NotebookTabs size={17}/> Sổ tay đã học <em>{notebookItems.length}</em></button></nav>

      {tab === "overview" && <div className="ability-dashboard">
        <section className="ability-main-card"><div className="profile-section-head"><div><span>NĂNG LỰC HIỆN TẠI</span><h2>Tiến bộ theo từng kỹ năng</h2></div><small>Dựa trên {completedLessons} Lesson · {reviewedUnits.length} lượt ôn hôm nay</small></div><div className="ability-grid">{skills.map(skill => { const Icon = skill.icon; return <article key={skill.name} className={`ability-card ${skill.color}`}><div><span><Icon size={20}/></span><b>{skill.name}</b><strong>{skill.score}%</strong></div><i><em style={{ width: `${skill.score}%` }}/></i><p>{skill.score === 0 ? "Chưa có hoạt động ghi nhận" : skill.note}</p></article>; })}</div></section>
        <aside className="ability-side"><div className="focus-recommendation"><span><Target size={19}/></span><small>GỢI Ý TIẾP THEO</small><h3>Luyện thêm {focusSkill.name}</h3><p>Đây là kỹ năng có ít bằng chứng học tập nhất. Hãy hoàn thành Lesson tương ứng hoặc ôn lại Unit cũ.</p><button onClick={() => onOpenUnit(1, focusSkill.name === "Nói" ? 4 : focusSkill.name === "Nghe" ? 3 : 2)}>Đi luyện ngay</button></div><div className="learning-evidence"><h3>Dấu mốc đã ghi nhận</h3><p><CheckCircle2 size={16}/><span><b>{completedUnits} Unit hoàn thành</b><small>Đã nhận đủ quà cuối Unit</small></span></p><p><CheckCircle2 size={16}/><span><b>{completedLessons} Lesson đã học</b><small>Dữ liệu nguồn của hồ sơ năng lực</small></span></p><p><CheckCircle2 size={16}/><span><b>{notebookItems.length} mục trong sổ tay</b><small>Tự lưu sau mỗi Lesson</small></span></p></div></aside>
        <p className="profile-method-note">Mức tích lũy phản ánh số hoạt động đã hoàn thành và số lần ôn, không phải điểm thi hay chẩn đoán trình độ chính thức.</p>
      </div>}

      {tab === "notebook" && <section className="learning-notebook-card"><div className="notebook-dashboard-head"><div><span>SỔ TAY TỰ ĐỘNG</span><h2>Những gì em đã học được</h2><p>Từ và mẫu câu được thêm khi em hoàn thành Lesson tương ứng.</p></div><div className="notebook-quick-stats"><span><b>{notebookItems.length - patterns}</b>Từ vựng</span><span><b>{patterns}</b>Mẫu câu</span><span><b>{remembered}</b>Đã nhớ</span></div></div><div className="notebook-tools"><div><Search size={16}/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Tìm từ hoặc nghĩa..."/></div><nav><button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>Tất cả</button><button className={filter === "word" ? "active" : ""} onClick={() => setFilter("word")}>Từ vựng</button><button className={filter === "pattern" ? "active" : ""} onClick={() => setFilter("pattern")}>Mẫu câu</button></nav></div>
        {visibleItems.length > 0 ? <div className="saved-learning-list">{visibleItems.map(item => <article key={`${item.kind}:${item.text}`}><button onClick={() => speak(item.text)} aria-label={`Nghe ${item.text}`}><Volume2 size={17}/></button><div><span>{item.kind === "word" ? "TỪ VỰNG" : "MẪU CÂU"} · UNIT {item.sources.join(", ")}</span><b>{item.text}</b><small>{item.meaning}</small></div><aside><strong>{item.mastery}%</strong><i><em style={{ width: `${item.mastery}%` }}/></i><small>{item.mastery >= 80 ? "Đã nhớ" : "Cần ôn thêm"}</small></aside></article>)}</div> : <div className="empty-notebook"><NotebookTabs size={34}/><h3>Chưa có nội dung phù hợp</h3><p>Hoàn thành bài học hoặc thử từ khóa tìm kiếm khác.</p></div>}
      </section>}
    </section>
  </main>;
}
