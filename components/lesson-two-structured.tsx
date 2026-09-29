"use client";

import { useState } from "react";
import { ArrowRight, Check, Play, Volume2 } from "lucide-react";
import LessonPreviewVideo from "@/components/lesson-preview-video";

function speak(text: string, rate = 0.78) {
  window.speechSynthesis.cancel();
  const voice = new SpeechSynthesisUtterance(text);
  voice.lang = "en-US";
  voice.rate = rate;
  window.speechSynthesis.speak(voice);
}
const labels = [
  "Video",
  "Câu hỏi",
  "Ngữ pháp",
  "Luyện 1",
  "Luyện 2",
  "Luyện 3",
];

export default function LessonTwoStructured({
  finish,
}: {
  finish: () => void;
}) {
  const [step, setStep] = useState(1);
  const [choice, setChoice] = useState("");
  const [checked, setChecked] = useState(false);
  const answers: Record<number, string> = {
    2: "A boy with a similar yellow bag.",
    4: "Tom has a little yellow bag.",
    5: "little yellow bag",
    6: "has",
  };
  const correct = choice === answers[step];
  const choose = (value: string) => {
    setChoice(value);
    setChecked(false);
  };
  const next = () => {
    setStep((current) => current + 1);
    setChoice("");
    setChecked(false);
  };

  return (
    <section className="structured-lesson structured-grammar">
      <header className="structured-head">
        <div>
          <span className="pill pill-yellow">LESSON 2 · NGỮ PHÁP</span>
          <h2>The Wrong Bag · Phần 2</h2>
          <p>Xem tiếp câu chuyện và dùng tính từ đúng thứ tự.</p>
        </div>
        <span className="structured-goal">
          <Play size={16} /> 1 video · 1 bảng ngữ pháp · 3 bài luyện
        </span>
      </header>
      <Progress labels={labels} step={step} />
      {step === 1 && (
        <div className="structured-stage">
          <StageCopy
            eyebrow="BƯỚC 1/6 · VIDEO PHẦN 2"
            title="Ai đang giữ chiếc túi?"
            description="Quan sát cách các nhân vật so sánh hai chiếc túi."
          />
          <LessonPreviewVideo
            lesson={2}
            title="The Wrong Bag · Phần 2"
            description="Tập trung vào cụm little yellow bag và hành động nhận nhầm túi."
          />
          <button className="primary stage-next" onClick={next}>
            Trả lời câu hỏi video <ArrowRight size={18} />
          </button>
        </div>
      )}
      {step === 2 && (
        <Quiz
          eyebrow="BƯỚC 2/6 · CÂU HỎI VIDEO"
          title="Who took Tom’s bag by mistake?"
          prompt="Ai đã cầm nhầm túi của Tom?"
          options={[
            "A boy with a similar yellow bag.",
            "A tall woman at the fair.",
            "Tom’s teacher.",
          ]}
          choice={choice}
          checked={checked}
          correct={correct}
          choose={choose}
          check={() => setChecked(true)}
          next={next}
        />
      )}
      {step === 3 && (
        <div className="structured-stage">
          <StageCopy
            eyebrow="BƯỚC 3/6 · BẢNG NGỮ PHÁP"
            title="Size → Color → Noun"
            description="Khi có nhiều từ miêu tả, kích thước đứng trước màu sắc."
          />
          <div className="grammar-board">
            <span>
              <small>CHỦ NGỮ</small>
              <b>Tom</b>
            </span>
            <span>
              <small>ĐỘNG TỪ</small>
              <b>has</b>
            </span>
            <span className="size">
              <small>KÍCH THƯỚC</small>
              <b>a little</b>
            </span>
            <span className="color">
              <small>MÀU SẮC</small>
              <b>yellow</b>
            </span>
            <span>
              <small>DANH TỪ</small>
              <b>bag.</b>
            </span>
          </div>
          <button
            className="grammar-listen"
            onClick={() => speak("Tom has a little yellow bag.")}
          >
            <Volume2 size={18} /> Nghe câu mẫu
          </button>
          <div className="grammar-note">
            <b>Ghi nhớ:</b> He / She / Tom + <strong>has</strong>. I / You / We
            / They + <strong>have</strong>.
          </div>
          <button className="primary stage-next" onClick={next}>
            Luyện cấu trúc <ArrowRight size={18} />
          </button>
        </div>
      )}
      {step === 4 && (
        <Quiz
          eyebrow="BƯỚC 4/6 · EXERCISE 1"
          title="Choose the correct sentence"
          prompt="Chọn câu có thứ tự tính từ đúng."
          options={[
            "Tom has a yellow little bag.",
            "Tom has a little yellow bag.",
            "Tom little has a yellow bag.",
          ]}
          choice={choice}
          checked={checked}
          correct={correct}
          choose={choose}
          check={() => setChecked(true)}
          next={next}
        />
      )}
      {step === 5 && (
        <Quiz
          eyebrow="BƯỚC 5/6 · EXERCISE 2"
          title="Complete the phrase"
          prompt="Tom has a ___ ___."
          audio="Tom has a little yellow bag."
          options={[
            "yellow little bag",
            "little yellow bag",
            "tall yellow boy",
          ]}
          choice={choice}
          checked={checked}
          correct={correct}
          choose={choose}
          check={() => setChecked(true)}
          next={next}
        />
      )}
      {step === 6 && (
        <Quiz
          eyebrow="BƯỚC 6/6 · EXERCISE 3"
          title="Choose has or have"
          prompt="Tom ___ a little yellow bag."
          options={["have", "has", "is"]}
          choice={choice}
          checked={checked}
          correct={correct}
          choose={choose}
          check={() => setChecked(true)}
          finish={finish}
        />
      )}
    </section>
  );
}

function Progress({ labels, step }: { labels: string[]; step: number }) {
  return (
    <ol className="structured-progress">
      {labels.map((label, index) => (
        <li
          key={label}
          className={`${index + 1 === step ? "active" : ""} ${index + 1 < step ? "done" : ""}`}
        >
          <span>{index + 1 < step ? <Check size={13} /> : index + 1}</span>
          <b>{label}</b>
        </li>
      ))}
    </ol>
  );
}
function StageCopy({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="stage-copy">
      <small>{eyebrow}</small>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
type QuizProps = {
  eyebrow: string;
  title: string;
  prompt: string;
  audio?: string;
  options: string[];
  choice: string;
  checked: boolean;
  correct: boolean;
  choose: (value: string) => void;
  check: () => void;
  next?: () => void;
  finish?: () => void;
};
function Quiz({
  eyebrow,
  title,
  prompt,
  audio,
  options,
  choice,
  checked,
  correct,
  choose,
  check,
  next,
  finish,
}: QuizProps) {
  return (
    <div className="structured-stage quiz-panel">
      <StageCopy eyebrow={eyebrow} title={title} description={prompt} />
      {audio && (
        <button className="audio-prompt" onClick={() => speak(audio)}>
          <Play size={18} fill="currentColor" /> Nghe câu mẫu
        </button>
      )}
      <div className="structured-options">
        {options.map((option) => (
          <button
            key={option}
            className={`${choice === option ? "selected" : ""} ${checked && choice === option ? (correct ? "correct" : "wrong") : ""}`}
            onClick={() => choose(option)}
          >
            {option}
          </button>
        ))}
      </div>
      {checked && (
        <div className={`structured-feedback ${correct ? "correct" : "retry"}`}>
          {correct ? (
            <>
              <Check size={18} />
              <span>
                <b>Chính xác!</b> Cấu trúc đã đúng.
              </span>
            </>
          ) : (
            <span>
              <b>Thử lại nhé.</b> Nhớ: kích thước đứng trước màu sắc.
            </span>
          )}
        </div>
      )}
      {checked && correct ? (
        <button className="primary stage-next" onClick={finish ?? next}>
          {finish ? "Hoàn thành Lesson 2" : "Tiếp tục"} <ArrowRight size={18} />
        </button>
      ) : (
        <button
          className="primary stage-next"
          disabled={!choice}
          onClick={check}
        >
          Kiểm tra <ArrowRight size={18} />
        </button>
      )}
    </div>
  );
}
