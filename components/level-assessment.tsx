"use client";

import { ArrowLeft, ArrowRight, Check, ClipboardCheck, Headphones, Mic, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";

type Props = { onBack: () => void; onComplete: (score: number) => void };

const questions = [
  { skill: "Nghe hiểu", icon: Headphones, prompt: "Ben đang tìm đồ vật nào?", choices: ["A yellow bag", "A red kite", "A blue book"], correct: "A red kite" },
  { skill: "Từ & câu", icon: ClipboardCheck, prompt: "Chọn câu đúng với tranh trong câu chuyện.", choices: ["It is in the tree.", "It are in the tree.", "It is on tree."], correct: "It is in the tree." },
  { skill: "Giao tiếp", icon: Mic, prompt: "Câu nào phù hợp để nhờ bạn giúp đỡ?", choices: ["Can we get it down?", "Where you go?", "I kite red."], correct: "Can we get it down?" },
] as const;

export default function LevelAssessment({ onBack, onComplete }: Props) {
  const [answers, setAnswers] = useState<string[]>(["", "", ""]);
  const [submitted, setSubmitted] = useState(false);
  const correctCount = questions.filter((q, i) => answers[i] === q.correct).length;
  const passed = correctCount >= 2;
  const score = correctCount === 3 ? 100 : correctCount === 2 ? 82 : correctCount * 30;

  return <main className="assessment-screen">
    <header className="assessment-topbar"><button onClick={onBack}><ArrowLeft size={18}/> Về bản đồ</button><div><span>MỐC CUỐI LEVEL 1</span><b>Đánh giá năng lực</b></div><strong><ShieldCheck size={19}/> Cần đạt 70 điểm</strong></header>
    <section className="assessment-wrap">
      <div className="assessment-heading"><span className="assessment-icon"><ClipboardCheck size={35}/></span><div><span><Sparkles size={14}/> MỐC 6 · ĐIỂM CUỐI HÀNH TRÌNH</span><h1>Thử thách tổng hợp</h1><p>Vượt qua 3 câu hỏi để hoàn thành bản đồ và mở rương linh vật.</p></div></div>
      <div className="assessment-questions">{questions.map((question, index) => { const Icon = question.icon; return <section key={question.prompt} className={submitted ? (answers[index] === question.correct ? "question-correct" : "question-wrong") : ""}>
        <div className="question-number"><Icon size={19}/><span><small>{question.skill}</small><b>Câu {index + 1}/3</b></span></div><h2>{question.prompt}</h2>
        <div className="assessment-choices">{question.choices.map(choice => <button key={choice} className={answers[index] === choice ? "selected" : ""} onClick={() => { const next = [...answers]; next[index] = choice; setAnswers(next); setSubmitted(false); }}>{choice}{submitted && choice === question.correct && <Check size={16}/>}</button>)}</div>
      </section>; })}</div>
      {submitted && <div className={passed ? "assessment-feedback passed" : "assessment-feedback retry"}><span>{passed ? "🏆" : "💪"}</span><div><b>{passed ? `${score} điểm · Em đã vượt mốc cuối!` : `${score} điểm · Thử lại nhé!`}</b><small>{passed ? "Level đã hoàn thành. Rương linh vật đang chờ em mở." : "Xem lại các câu chưa đúng rồi làm lại để đạt ít nhất 70 điểm."}</small></div></div>}
      <div className="assessment-actions"><button className="assessment-back" onClick={onBack}><ArrowLeft size={17}/> Ôn lại trước</button>{submitted && passed ? <button className="assessment-submit" onClick={() => onComplete(score)}>Hoàn thành Level <ArrowRight size={18}/></button> : <button className="assessment-submit" disabled={answers.some(answer => !answer)} onClick={() => setSubmitted(true)}>Nộp bài đánh giá <ArrowRight size={18}/></button>}</div>
    </section>
  </main>;
}
