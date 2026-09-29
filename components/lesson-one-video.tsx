"use client";

import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  Play,
  Sparkles,
  Volume2,
} from "lucide-react";
import { WRONG_BAG_VIDEO_URL } from "@/lib/lesson-content";

const vocabulary = [
  { word: "bag", meaning: "chiếc túi", icon: "🎒" },
  { word: "yellow", meaning: "màu vàng", icon: "🟡" },
  { word: "little", meaning: "nhỏ", icon: "🤏" },
  { word: "tall", meaning: "cao", icon: "📏" },
];

function speak(text: string, rate = 0.78) {
  window.speechSynthesis.cancel();
  const voice = new SpeechSynthesisUtterance(text);
  voice.lang = "en-US";
  voice.rate = rate;
  window.speechSynthesis.speak(voice);
}

export default function LessonOneVideo({
  finish,
  rewardLabel = "Hoàn thành Lesson 1",
}: {
  finish: () => void;
  rewardLabel?: string;
}) {
  const [step, setStep] = useState(1);
  const [choice, setChoice] = useState("");
  const [checked, setChecked] = useState(false);
  const answers: Record<number, string> = {
    2: "yellow",
    4: "chiếc túi",
    5: "yellow",
    6: "little yellow bag",
  };
  const correct = choice === answers[step];
  const labels = [
    "Video",
    "Câu hỏi",
    "Từ vựng",
    "Luyện 1",
    "Luyện 2",
    "Luyện 3",
  ];
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
    <section className="structured-lesson structured-vocab">
      <header className="structured-head">
        <div>
          <span className="pill pill-coral">
            <Sparkles size={13} /> LESSON 1 · TỪ VỰNG
          </span>
          <h2>The Wrong Bag · Phần 1</h2>
          <p>Xem câu chuyện, tìm manh mối và làm chủ bốn từ khóa đầu tiên.</p>
        </div>
        <span className="structured-goal">
          <BookOpen size={16} /> 1 video · 4 từ · 3 bài luyện
        </span>
      </header>
      <Progress labels={labels} step={step} />
      {step === 1 && (
        <div className="structured-stage">
          <StageCopy
            eyebrow="BƯỚC 1/6"
            title="Xem video phần 1"
            description="Quan sát chiếc túi của Tom và chú ý màu sắc, kích thước."
          />
          <div className="structured-video">
            <video
              src={WRONG_BAG_VIDEO_URL}
              controls
              playsInline
              preload="metadata"
              crossOrigin="anonymous"
            />
            <span>THE WRONG BAG · PHẦN 1</span>
          </div>
          <button className="primary stage-next" onClick={next}>
            Em đã xem xong <ArrowRight size={18} />
          </button>
        </div>
      )}
      {step === 2 && (
        <Quiz
          eyebrow="BƯỚC 2/6 · CÂU HỎI VIDEO"
          title="What color is Tom’s bag?"
          prompt="Chiếc túi của Tom có màu gì?"
          options={["red", "yellow", "blue"]}
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
            eyebrow="BƯỚC 3/6 · BẢNG TỪ VỰNG"
            title="Bốn từ khóa trong câu chuyện"
            description="Chạm vào từng thẻ để nghe phát âm."
          />
          <div className="vocab-board">
            {vocabulary.map((item) => (
              <button key={item.word} onClick={() => speak(item.word)}>
                <i>{item.icon}</i>
                <b>{item.word}</b>
                <small>{item.meaning}</small>
                <Volume2 size={15} />
              </button>
            ))}
          </div>
          <button className="primary stage-next" onClick={next}>
            Bắt đầu luyện tập <ArrowRight size={18} />
          </button>
        </div>
      )}
      {step === 4 && (
        <Quiz
          eyebrow="BƯỚC 4/6 · EXERCISE 1"
          title="Match the word"
          prompt="Từ “bag” có nghĩa là gì?"
          options={["chiếc túi", "cái cây", "quả bóng"]}
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
          title="Choose the missing word"
          prompt="Tom has a ___ bag."
          options={["yellow", "green", "purple"]}
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
          title="Listen and choose"
          prompt="Bấm nghe rồi chọn cụm từ đúng."
          audio="little yellow bag"
          options={["tall yellow boy", "little yellow bag", "little red bag"]}
          choice={choice}
          checked={checked}
          correct={correct}
          choose={choose}
          check={() => setChecked(true)}
          finish={finish}
          finishLabel={rewardLabel}
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
  finishLabel?: string;
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
  finishLabel,
}: QuizProps) {
  return (
    <div className="structured-stage quiz-panel">
      <StageCopy eyebrow={eyebrow} title={title} description={prompt} />
      {audio && (
        <button className="audio-prompt" onClick={() => speak(audio)}>
          <Play size={18} fill="currentColor" /> Nghe câu
        </button>
      )}
      <div className="structured-options">
        {options.map((option) => (
          <button
            key={option}
            className={`${choice === option ? "selected" : ""} ${checked && option === choice ? (correct ? "correct" : "wrong") : ""}`}
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
                <b>Chính xác!</b> Em đã sẵn sàng sang bước tiếp theo.
              </span>
            </>
          ) : (
            <span>
              <b>Chưa đúng.</b> Hãy xem hoặc nghe lại manh mối nhé.
            </span>
          )}
        </div>
      )}
      {checked && correct ? (
        <button className="primary stage-next" onClick={finish ?? next}>
          {finish ? finishLabel : "Tiếp tục"} <ArrowRight size={18} />
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
