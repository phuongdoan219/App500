"use client";

import { useState } from "react";
import { ArrowRight, Check, Settings, Sparkles, Volume2, Waves, Zap } from "lucide-react";
import { WRONG_BAG_VIDEO_URL } from "@/lib/lesson-content";

function speak(text: string, rate: number) {
  window.speechSynthesis.cancel();
  const voice = new SpeechSynthesisUtterance(text);
  voice.lang = "en-US";
  voice.rate = rate;
  window.speechSynthesis.speak(voice);
}

export default function LessonOneVideo({ storyStep, setStoryStep, answer, setAnswer, checked, setChecked, finish, rewardLabel = "Hoàn thành và nhận 1 Cá" }: any) {
  const [secondAnswer, setSecondAnswer] = useState("");
  const [heardWords, setHeardWords] = useState<string[]>([]);
  const firstCorrect = answer === "D. The boy opened the bag and found it was not his.";
  const secondCorrect = secondAnswer === "A boy with a similar yellow bag.";
  const practiceDone = ["little", "tall", "young", "graceful"].every(word => heardWords.includes(word));
  return <div className="lesson-layout">
    <div className="main-card story-card">
      <div className="card-top"><div><span className="pill pill-coral"><Sparkles size={13} /> Câu chuyện</span><h2>The Wrong Bag</h2><p>Xem video và tìm các manh mối miêu tả người, đồ vật.</p></div><button className="icon-button"><Settings size={18} /></button></div>
      <div className="story-stage real-video-stage">
        <video src={WRONG_BAG_VIDEO_URL} controls playsInline preload="metadata" crossOrigin="anonymous" />
        <span className="video-empty">VIDEO TIẾNG ANH</span>
      </div>
      <div className="micro-actions"><button onClick={() => speak("little, tall, young, graceful", .72)}><Volume2 size={17} /> Nghe từ khóa</button><button onClick={() => speak("The boy opened the bag and found it was not his.", .9)}><Waves size={17} /> Nghe manh mối</button></div>
    </div>
    <aside className="activity-card">
      <div className="activity-kicker">BƯỚC {storyStep}/4</div>
      {storyStep === 1 && <><h3>Sẵn sàng khám phá?</h3><p>Hãy quan sát kỹ ngoại hình các nhân vật và chiếc túi màu vàng.</p><div className="tip"><Zap size={19} /><span><b>Mẹo nhỏ</b>Em có thể bật lại video và nghe bao nhiêu lần tùy thích.</span></div><button className="primary" onClick={() => setStoryStep(2)}>Đã xem phần 1 <ArrowRight size={18} /></button></>}
      {storyStep === 2 && <><h3>Manh mối quyết định là gì?</h3><p>Which clue finally helped Tom identify the correct boy?</p><div className="answers">{["A. The boy was tall.", "B. The boy was slim.", "C. The boy had curly hair.", "D. The boy opened the bag and found it was not his."].map(item => <button key={item} className={(answer === item ? "selected " : "") + (checked && item.startsWith("D.") ? "correct" : "")} onClick={() => { setAnswer(item); setChecked(false); }}>{item}</button>)}</div>{checked && <div className={firstCorrect ? "success" : "feedback retry"}>{firstCorrect ? <><Check size={18} /><span><b>Chính xác!</b> Hành động mở nhầm túi là manh mối quyết định.</span></> : "Chưa đúng. Hãy xem lại hành động với chiếc túi."}</div>}<button disabled={!answer} className="primary" onClick={() => checked && firstCorrect ? setStoryStep(3) : setChecked(true)}>{checked && firstCorrect ? "Xem phần 2" : "Kiểm tra"} <ArrowRight size={18} /></button></>}
      {storyStep === 3 && <><h3>Ai đã lấy nhầm túi?</h3><p>Who took Tom&apos;s bag by mistake?</p><div className="answers">{["A boy with a similar yellow bag.", "A tall woman at the fair.", "Tom's teacher."].map(item => <button key={item} className={(secondAnswer === item ? "selected " : "") + (secondAnswer && item === "A boy with a similar yellow bag." ? "correct" : "")} onClick={() => setSecondAnswer(item)}>{item}</button>)}</div><button disabled={!secondCorrect} className="primary" onClick={() => setStoryStep(4)}>Tiếp tục luyện tập <ArrowRight size={18} /></button></>}
      {storyStep === 4 && <><h3>Nghe và chọn từ</h3><p>Chọn đủ bốn từ em nghe thấy.</p><button className="model-button" onClick={() => speak("little, tall, young, graceful", .68)}><span><Volume2 size={20} /></span><div><b>Nghe danh sách từ</b><small>Nghe chậm và rõ</small></div></button><div className="answers compact">{["little", "old", "tall", "young", "short", "graceful"].map(word => <button key={word} className={heardWords.includes(word) && ["little", "tall", "young", "graceful"].includes(word) ? "correct" : ""} onClick={() => setHeardWords(current => current.includes(word) ? current.filter(item => item !== word) : [...current, word])}>{word}</button>)}</div><button disabled={!practiceDone} className="primary" onClick={finish}>{rewardLabel} <ArrowRight size={18} /></button></>}
      <div className="step-dots">{[1,2,3,4].map(i => <button key={i} className={i <= storyStep ? "on" : ""} onClick={() => setStoryStep(i)} />)}</div>
    </aside>
  </div>;
}
