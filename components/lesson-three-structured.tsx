"use client";

import { useState } from "react";
import { ArrowRight, Check, Headphones, Play, RotateCcw } from "lucide-react";

function normalize(value: string) { return value.trim().toLowerCase().replace(/[.!?]/g, "").replace(/\s+/g, " "); }
function speak(text: string, rate = .72) { window.speechSynthesis.cancel(); const voice = new SpeechSynthesisUtterance(text); voice.lang = "en-US"; voice.rate = rate; window.speechSynthesis.speak(voice); }
const tasks = [
  { label: "Từ đơn", audio: "yellow", answer: "yellow", placeholder: "Gõ một từ em nghe được...", hint: "6 chữ cái · một màu sắc" },
  { label: "Cụm từ", audio: "little yellow bag", answer: "little yellow bag", placeholder: "Gõ cụm từ em nghe được...", hint: "3 từ · kích thước + màu sắc + đồ vật" },
  { label: "Một phần câu", audio: "has a little yellow bag", answer: "has a little yellow bag", placeholder: "Gõ phần câu em nghe được...", hint: "5 từ · bắt đầu bằng động từ has" },
];

export default function LessonThreeStructured({ finish }: { finish: () => void }) {
  const [step,setStep]=useState(1); const [value,setValue]=useState(""); const [checked,setChecked]=useState(false); const [reviewed,setReviewed]=useState<string[]>([]);
  const task=tasks[step-2]; const correct=task ? normalize(value)===task.answer : false;
  const next=()=>{setStep(current=>current+1);setValue("");setChecked(false)};
  return <section className="structured-lesson structured-dictation"><header className="structured-head"><div><span className="pill pill-blue"><Headphones size={13}/> LESSON 3 · DICTATION</span><h2>Nghe từng phần, viết thật chắc</h2><p>Ôn nhanh Lesson 1–2, rồi tăng dần từ một từ đến một phần của câu.</p></div><span className="structured-goal"><RotateCcw size={16}/> Nghe lại không giới hạn</span></header><ol className="structured-progress dictation-progress">{["Ôn tập","Từ đơn","Cụm từ","Phần câu"].map((label,index)=><li key={label} className={`${index+1===step?"active":""} ${index+1<step?"done":""}`}><span>{index+1<step?<Check size={13}/>:index+1}</span><b>{label}</b></li>)}</ol>
    {step===1&&<div className="structured-stage"><div className="stage-copy"><small>BƯỚC 1/4 · REVIEW LESSON 1 + 2</small><h3>Nghe và nhận ra câu đã học</h3><p>Chạm vào đủ ba mảnh để ôn lại từ vựng và mẫu câu.</p></div><div className="review-chips">{["yellow","little yellow bag","Tom has a little yellow bag."].map(item=><button key={item} className={reviewed.includes(item)?"done":""} onClick={()=>{speak(item);setReviewed(current=>current.includes(item)?current:[...current,item])}}><Play size={15} fill="currentColor"/><span><b>{reviewed.includes(item)?item:"Nghe manh mối"}</b><small>{reviewed.includes(item)?"Đã ôn":"Chạm để nghe"}</small></span></button>)}</div><button className="primary stage-next" disabled={reviewed.length<3} onClick={next}>Bắt đầu nghe – viết <ArrowRight size={18}/></button></div>}
    {step>1&&task&&<div className="structured-stage dictation-stage"><div className="stage-copy"><small>BƯỚC {step}/4 · {task.label.toUpperCase()}</small><h3>Nghe và viết lại</h3><p>{task.hint}</p></div><button className="dictation-listen" onClick={()=>speak(task.audio)}><Play size={25} fill="currentColor"/><span><b>Nghe {task.label.toLowerCase()}</b><small>Có thể nghe lại nhiều lần</small></span></button><label className="structured-input"><span>Câu trả lời của em</span><input value={value} onChange={event=>{setValue(event.target.value);setChecked(false)}} placeholder={task.placeholder} autoFocus/></label>{checked&&<div className={`structured-feedback ${correct?"correct":"retry"}`}>{correct?<><Check size={18}/><span><b>Nghe chính xác!</b> Em đã viết đúng từng từ.</span></>:<span><b>Gần đúng rồi.</b> Hãy nghe chậm lại và kiểm tra khoảng cách giữa các từ.</span>}</div>}{checked&&correct?<button className="primary stage-next" onClick={step===4?finish:next}>{step===4?"Hoàn thành Lesson 3":"Bài nghe tiếp theo"} <ArrowRight size={18}/></button>:<button className="primary stage-next" disabled={!value.trim()} onClick={()=>setChecked(true)}>Kiểm tra câu trả lời <ArrowRight size={18}/></button>}</div>}
  </section>;
}
