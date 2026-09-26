"use client";

import { ArrowRight, BookOpen, Check, Flame, Gift, Headphones, Map, Mic, RotateCcw, Sparkles, Star, Trophy } from "lucide-react";

type Props = {
  onMap: () => void;
  onReplay: () => void;
  onOpenChest: () => void;
  onStreak: () => void;
  score: number;
  streak: number;
  level: number;
  companionName: string;
};

export default function LessonResult({ onMap, onReplay, onOpenChest, onStreak, score, streak, level, companionName }: Props) {
  return <main className="result-screen level-result-screen">
    <div className="confetti confetti-a">◆</div><div className="confetti confetti-b">●</div><div className="confetti confetti-c">★</div><div className="confetti confetti-d">◆</div>
    <header className="result-topbar"><div className="road-brand"><span>E</span><div><b>ENGLISH IN</b><small>WONDERLAND</small></div></div><button onClick={onMap}><Map size={18}/> Về lộ trình</button></header>
    <section className="result-wrap">
      <div className="result-hero"><div className="trophy-halo"><span className="halo-ring"/><span className="trophy-main"><Trophy size={58} fill="currentColor"/></span><span className="paw-float">LEVEL 1 ✓</span></div><span className="result-kicker"><Sparkles size={15}/> ĐÃ VƯỢT MỐC CUỐI</span><h1>Hoàn thành bản đồ, An!</h1><p>Em đã vượt bài đánh giá năng lực của <b>Học viện Ánh Sao</b></p></div>

      <div className="result-grid">
        <section className="score-card"><div className="score-ring" style={{ background: `conic-gradient(#625be5 0 ${score}%,#e8e9f4 ${score}%)` }}><div><b>{score}</b><small>ĐIỂM</small></div></div><div className="score-copy"><span>KẾT QUẢ ĐÁNH GIÁ</span><h2>Năng lực đã được xác nhận!</h2><p>Em đã nắm được nội dung cốt lõi và sẵn sàng bước sang Level tiếp theo.</p><div className="score-chips"><span>✓ Hoàn thành Level</span><span>⭐ Mốc cuối hành trình</span></div></div></section>
        <section className="reward-card chest-reward-card"><span>RƯƠNG LINH VẬT</span><Gift size={48}/><b>1 rương</b><p>Linh vật ngẫu nhiên đang chờ</p><small>Mở ra để gặp {companionName}</small><button onClick={onOpenChest}><Sparkles size={16}/> Mở rương ngay</button></section>
      </div>

      <section className="skill-summary"><div className="summary-title"><span>Năng lực cuối Level</span><small>Kết quả từ bài đánh giá tổng hợp</small></div><div className="skill-grid"><div><span className="skill-icon blue"><Headphones/></span><b>Nghe hiểu</b><small>Nắm đúng ý chính câu chuyện</small><em><Check size={14}/> Đạt</em></div><div><span className="skill-icon yellow"><BookOpen/></span><b>Từ & mẫu câu</b><small>Dùng đúng cấu trúc đã học</small><em><Check size={14}/> Đạt</em></div><div><span className="skill-icon purple"><Mic/></span><b>Giao tiếp</b><small>Chọn câu phù hợp tình huống</small><em><Check size={14}/> Đạt</em></div><div><span className="skill-icon coral"><Star/></span><b>Sẵn sàng</b><small>Đủ điều kiện sang Level mới</small><em><Check size={14}/> Tuyệt vời</em></div></div></section>

      <section className="streak-safety-card"><Flame size={28} fill="currentColor"/><div><span>STREAK VẪN ĐƯỢC GIỮ</span><b>{streak} ngày liên tiếp · Nhà thám hiểm {level}</b><small>Streak chạy song song để bảo vệ thói quen học mỗi ngày.</small></div><button onClick={onStreak}>Xem streak</button></section>
      <div className="result-actions"><button className="result-secondary" onClick={onReplay}><RotateCcw size={18}/> Làm lại đánh giá</button><button className="result-primary" onClick={onOpenChest}>Mở rương linh vật <ArrowRight size={19}/></button></div><p className="next-note">Sau khi nhận linh vật, hãy ôn lại bài để kiếm Xu mua thức ăn và skin.</p>
    </section>
  </main>;
}
