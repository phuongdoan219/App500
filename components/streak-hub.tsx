"use client";

import { ArrowLeft, Check, Flame, Gift, LockKeyhole, ShieldCheck, Trophy } from "lucide-react";

type Props = {
  streak: number;
  level: number;
  onBack: () => void;
  onLearn: () => void;
};

export default function StreakHub({ streak, level, onBack, onLearn }: Props) {
  const weekProgress = Math.min(streak % 7 || (streak ? 7 : 0), 7);
  const daysToLevel = weekProgress === 7 ? 0 : 7 - weekProgress;

  return <main className="streak-screen">
    <header className="streak-topbar">
      <button onClick={onBack}><ArrowLeft size={18} /> Về lộ trình</button>
      <div><span>CHUỖI HỌC TẬP</span><b>Giữ lửa mỗi ngày</b></div>
      <strong><Flame size={21} fill="currentColor" /> {streak} ngày</strong>
    </header>

    <section className="streak-wrap">
      <div className="streak-hero-card">
        <div className="streak-flame"><Flame size={78} fill="currentColor" /></div>
        <span>CHUỖI HIỆN TẠI</span>
        <h1>{streak} ngày liên tiếp</h1>
        <p>Mỗi ngày chỉ cần hoàn thành <b>1 Lesson</b> để giữ lửa.</p>
        <div className="streak-week" aria-label={`${weekProgress} trên 7 ngày đã hoàn thành`}>
          {[1, 2, 3, 4, 5, 6, 7].map(day => <div key={day} className={day <= weekProgress ? "done" : day === weekProgress + 1 ? "today" : ""}>
            <span>{day <= weekProgress ? <Check size={16} /> : day}</span><small>Ngày {day}</small>
          </div>)}
        </div>
        <button className="streak-learn-button" onClick={onLearn}><Flame size={18} /> Học 1 Lesson hôm nay</button>
      </div>

      <aside className="streak-side">
        <section className="level-card">
          <div className="level-card-head"><span><Trophy size={25} /></span><div><small>CẤP HIỆN TẠI</small><h2>Nhà thám hiểm {level}</h2></div></div>
          <div className="level-track"><i style={{ width: `${weekProgress / 7 * 100}%` }} /></div>
          <p>{daysToLevel === 0 ? "Đã đủ điều kiện lên cấp!" : `Còn ${daysToLevel} ngày để lên cấp ${level + 1}`}</p>
        </section>

        <section className="streak-rewards">
          <span>MỐC THƯỞNG DỄ HIỂU</span>
          <h2>Học đều là có quà</h2>
          <div className={streak >= 3 ? "claimed" : ""}><b><Gift size={22} /> 3 ngày</b><p>Mở Rương Đồng</p><em>{streak >= 3 ? "Đã mở" : <LockKeyhole size={15} />}</em></div>
          <div className={streak >= 7 ? "claimed gold" : "gold"}><b><Trophy size={22} /> 7 ngày</b><p>Lên cấp + Rương Vàng</p><em>{streak >= 7 ? "Sẵn sàng" : <LockKeyhole size={15} />}</em></div>
          <div><b><ShieldCheck size={22} /> 14 ngày</b><p>1 lần bảo vệ chuỗi</p><em><LockKeyhole size={15} /></em></div>
          <small>Rương chỉ chứa quà trang trí như huy hiệu, khung avatar hoặc giao diện bài học — không thêm một loại điểm mới.</small>
        </section>
      </aside>
    </section>
  </main>;
}
