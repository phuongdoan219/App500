"use client";

import { ArrowRight, BookOpen, Check, Fish, Flame, Headphones, House, Map, Mic, RotateCcw, Sparkles, Star, Trophy } from "lucide-react";

type Props = { onMap: () => void; onReplay: () => void; onCat: () => void; onStreak: () => void; fish: number; streak: number; level: number; rewardMode: "cat" | "streak" };

export default function LessonResult({ onMap, onReplay, onCat, onStreak, fish, streak, level, rewardMode }: Props) {
  return <main className="result-screen">
    <div className="confetti confetti-a">◆</div><div className="confetti confetti-b">●</div><div className="confetti confetti-c">★</div><div className="confetti confetti-d">◆</div>
    <header className="result-topbar"><div className="road-brand"><span>E</span><div><b>ENGLISH IN</b><small>WONDERLAND</small></div></div><button onClick={onMap}><Map size={18} /> Về lộ trình</button></header>
    <section className="result-wrap">
      <div className="result-hero"><div className="trophy-halo"><span className="halo-ring" /><span className="trophy-main"><Trophy size={58} fill="currentColor" /></span><span className="paw-float">{rewardMode === "cat" ? "🐟 +1" : `🔥 ${streak}`}</span></div><span className="result-kicker"><Sparkles size={15} /> LESSON HOÀN THÀNH</span><h1>Xuất sắc lắm, An!</h1><p>Em đã hoàn thành phần lồng tiếng cho câu chuyện <b>The Wrong Bag</b></p></div>

      <div className="result-grid">
        <section className="score-card"><div className="score-ring"><div><b>92</b><small>ĐIỂM</small></div></div><div className="score-copy"><span>THÀNH TÍCH HÔM NAY</span><h2>Giọng kể đầy tự tin!</h2><p>Em đã giữ đúng nhịp câu và hoàn thành cả đoạn hội thoại bằng tiếng Anh.</p><div className="score-chips"><span>✓ Hoàn thành Lesson</span><span>⭐ Kỷ lục mới</span></div></div></section>
        {rewardMode === "cat" ? <section className="reward-card fish-reward-card"><span>PHẦN THƯỞNG</span><Fish className="result-fish" size={44} fill="currentColor" /><b>+1</b><p>Cá cho Miu</p><small>Hiện có {fish} Cá</small><button onClick={onCat}><House size={16} /> Đến nhà của Miu</button></section> : <section className="reward-card streak-reward-card"><span>CHUỖI HỌC</span><Flame size={44} fill="currentColor" /><b>{streak} ngày</b><p>Nhà thám hiểm {level}</p><small>{7 - (streak % 7 || 7)} ngày nữa để lên cấp</small><button onClick={onStreak}><Trophy size={16} /> Xem mốc thưởng</button></section>}
      </div>

      <section className="skill-summary"><div className="summary-title"><span>Em đã luyện được gì?</span><small>4 kỹ năng trong Lesson hôm nay</small></div><div className="skill-grid"><div><span className="skill-icon blue"><Headphones /></span><b>Nghe hiểu</b><small>Bắt đúng ý chính của video</small><em><Check size={14} /> Hoàn thành</em></div><div><span className="skill-icon yellow"><BookOpen /></span><b>Từ & mẫu câu</b><small>little · tall · young · slim</small><em><Check size={14} /> Hoàn thành</em></div><div><span className="skill-icon purple"><Mic /></span><b>Lồng tiếng</b><small>3 câu thoại đã thu hình</small><em><Check size={14} /> Đã lưu</em></div><div><span className="skill-icon coral"><Star /></span><b>Tự tin nói</b><small>Hoàn thành không bỏ cuộc</small><em><Check size={14} /> Tuyệt vời</em></div></div></section>

      <div className="result-actions"><button className="result-secondary" onClick={onReplay}><RotateCcw size={18} /> Học lại Lesson</button><button className="result-primary" onClick={onMap}>Tiếp tục hành trình <ArrowRight size={19} /></button></div><p className="next-note">{rewardMode === "cat" ? "Học thêm Lesson để nhận Cá và mở chặng tiếp theo." : "Quay lại học vào ngày mai để giữ chuỗi và tiến gần cấp mới."}</p>
    </section>
  </main>;
}
