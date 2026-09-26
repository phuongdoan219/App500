"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, BookOpen, Check, Headphones, Map, Mic, Trophy } from "lucide-react";

type Props = {
  onMap: () => void;
  onOpenChest: () => void;
  score: number;
};

const learningProof = [
  { label: "Listening", Icon: Headphones, tone: "blue" },
  { label: "Vocabulary", Icon: BookOpen, tone: "gold" },
  { label: "Speaking", Icon: Mic, tone: "violet" },
];

export default function LessonResult({ onMap, onOpenChest, score }: Props) {
  return <main className="result-screen level-result-screen">
    <header className="result-topbar level-result-topbar">
      <div className="road-brand"><span>E</span><div><b>ENGLISH IN</b><small>WONDERLAND</small></div></div>
      <button onClick={onMap}><ArrowLeft size={17}/> Về lộ trình</button>
    </header>

    <section className="level-complete-wrap">
      <div className="completion-meta">
        <span><Trophy size={15}/> ĐÃ HOÀN THÀNH</span>
        <strong>{score} ĐIỂM</strong>
      </div>
      <h1>Hoàn thành Level 1!</h1>
      <p className="completion-lead">Em đã sẵn sàng gặp người bạn sẽ đồng hành ở Level tiếp theo.</p>

      <div className="learning-proof" aria-label="Các kỹ năng đã hoàn thành">
        {learningProof.map(({ label, Icon, tone }) => <div key={label}>
          <span className={`proof-icon ${tone}`}><Icon size={21}/></span>
          <b>{label}</b>
          <Check size={17}/>
        </div>)}
      </div>

      <section className="chest-focus" aria-labelledby="chest-title">
        <Image className="reward-chest-image" src="/pet-reward-chest.png" alt="Rương linh vật màu xanh tím với khóa hình dấu chân" width={720} height={480} priority/>
        <div className="chest-focus-copy">
          <span id="chest-title">RƯƠNG LINH VẬT</span>
          <p>Một người bạn mới đang chờ em bên trong.</p>
        </div>
        <button className="open-chest-primary" onClick={onOpenChest}>Mở rương linh vật <ArrowRight size={20}/></button>
      </section>

      <button className="quiet-map-link" onClick={onMap}><Map size={15}/> Xem lại hành trình đã hoàn thành</button>
    </section>
  </main>;
}
