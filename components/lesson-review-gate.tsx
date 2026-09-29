"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Check, RotateCcw, Sparkles, Volume2 } from "lucide-react";
import "./lesson-review-gate.css";

type ReviewGateProps = {
  lesson: 2 | 3 | 4;
  onComplete: () => void;
};

const vocabulary = [
  { en: "little", vi: "nhỏ", emoji: "🤏" },
  { en: "tall", vi: "cao", emoji: "📏" },
  { en: "young", vi: "trẻ", emoji: "🧒" },
  { en: "graceful", vi: "duyên dáng", emoji: "🦢" },
];

const memoryDeck = [
  { id: "word-little", pair: "little", kind: "word" },
  { id: "meaning-young", pair: "young", kind: "meaning" },
  { id: "word-graceful", pair: "graceful", kind: "word" },
  { id: "meaning-tall", pair: "tall", kind: "meaning" },
  { id: "word-young", pair: "young", kind: "word" },
  { id: "meaning-little", pair: "little", kind: "meaning" },
  { id: "word-tall", pair: "tall", kind: "word" },
  { id: "meaning-graceful", pair: "graceful", kind: "meaning" },
] as const;

function speak(text: string) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const voice = new SpeechSynthesisUtterance(text);
  voice.lang = "en-US";
  voice.rate = 0.78;
  window.speechSynthesis.speak(voice);
}

export default function LessonReviewGate({ lesson, onComplete }: ReviewGateProps) {
  const [memoryOpen, setMemoryOpen] = useState<string[]>([]);
  const [memoryMatched, setMemoryMatched] = useState<string[]>([]);
  const [memoryLocked, setMemoryLocked] = useState(false);
  const [memoryMessage, setMemoryMessage] = useState("Lật 2 thẻ mỗi lượt để tìm từ và nghĩa tương ứng.");
  const [leftChoice, setLeftChoice] = useState("");
  const [rightChoice, setRightChoice] = useState("");
  const [matched, setMatched] = useState<string[]>([]);
  const [matchMessage, setMatchMessage] = useState("");
  const [sentence, setSentence] = useState<string[]>([]);
  const [sentenceChecked, setSentenceChecked] = useState(false);

  const shuffledMeanings = useMemo(
    () => [vocabulary[2], vocabulary[0], vocabulary[3], vocabulary[1]],
    [],
  );
  const sentenceWords = ["yellow", "The", "carrying", "boy", "bag.", "is", "a"];
  const targetSentence = "The boy is carrying a yellow bag.";

  const flipDone = memoryMatched.length === vocabulary.length;
  const matchDone = matched.length === vocabulary.length;
  const sentenceDone = sentence.join(" ") === targetSentence;
  const sentenceComplete = sentenceChecked && sentenceDone;

  function chooseMeaning(vi: string) {
    setRightChoice(vi);
    if (!leftChoice) {
      setMatchMessage("Chọn một từ tiếng Anh trước nhé.");
      return;
    }
    const pair = vocabulary.find((item) => item.en === leftChoice);
    if (pair?.vi === vi) {
      setMatched((current) => [...current, leftChoice]);
      setMatchMessage("Ghép đúng rồi!");
      setLeftChoice("");
      setRightChoice("");
      return;
    }
    setMatchMessage("Chưa khớp. Thử một nghĩa khác nhé!");
  }

  function flipMemoryCard(card: (typeof memoryDeck)[number]) {
    if (memoryLocked || memoryOpen.includes(card.id) || memoryMatched.includes(card.pair)) return;
    const nextOpen = [...memoryOpen, card.id];
    setMemoryOpen(nextOpen);
    if (card.kind === "word") speak(card.pair);
    if (nextOpen.length < 2) {
      setMemoryMessage("Chọn thêm 1 thẻ để tạo thành một cặp.");
      return;
    }

    const firstCard = memoryDeck.find((item) => item.id === nextOpen[0]);
    if (firstCard?.pair === card.pair && firstCard.kind !== card.kind) {
      setMemoryMatched((current) => [...current, card.pair]);
      setMemoryOpen([]);
      setMemoryMessage("Ghép đúng rồi! Tìm cặp tiếp theo nhé.");
      return;
    }

    setMemoryLocked(true);
    setMemoryMessage("Hai thẻ chưa khớp, ghi nhớ vị trí rồi thử lại nhé!");
    window.setTimeout(() => {
      setMemoryOpen([]);
      setMemoryLocked(false);
      setMemoryMessage("Lật 2 thẻ mỗi lượt để tìm từ và nghĩa tương ứng.");
    }, 850);
  }

  function resetSentence() {
    setSentence([]);
    setSentenceChecked(false);
  }

  return (
    <section className="review-gate" aria-labelledby="review-gate-title">
      <header className="review-gate-head">
        <div className="review-gate-icon"><Sparkles size={26} /></div>
        <div>
          <span>ÔN NHANH · TRƯỚC LESSON {lesson}</span>
          <h2 id="review-gate-title">
            {lesson === 2 && "Tìm cặp thẻ bí mật"}
            {lesson === 3 && "Nối từ với đúng nghĩa"}
            {lesson === 4 && "Xếp lại câu em vừa nghe"}
          </h2>
          <p>Chỉ mất khoảng 1 phút. Ôn xong, cánh cửa bài mới sẽ mở!</p>
        </div>
        <strong>{lesson === 2 ? `${memoryMatched.length}/4 cặp` : lesson === 3 ? `${matched.length}/4 cặp` : `${sentence.length}/7 từ`}</strong>
      </header>

      {lesson === 2 && <div className="review-flashcards">
        {memoryDeck.map((card, index) => {
          const word = vocabulary.find((item) => item.en === card.pair)!;
          const isFlipped = memoryOpen.includes(card.id) || memoryMatched.includes(card.pair);
          const isMatched = memoryMatched.includes(card.pair);
          return <button
            key={card.id}
            className={`${isFlipped ? "flipped" : ""} ${isMatched ? "matched" : ""}`}
            onClick={() => flipMemoryCard(card)}
            aria-label={isFlipped ? (card.kind === "word" ? `Từ ${word.en}` : `${word.emoji}, nghĩa là ${word.vi}`) : `Lật thẻ số ${index + 1}`}
          >
            <span className="review-card-inner">
              <span className="review-card-front"><em>?</em><small>THẺ {index + 1}</small></span>
              <span className="review-card-back">
                {card.kind === "meaning" && <em>{word.emoji}</em>}
                <b>{card.kind === "word" ? word.en : word.vi}</b>
                <small>{card.kind === "word" ? "TỪ TIẾNG ANH" : "NGHĨA TIẾNG VIỆT"}</small>
                {isMatched && <i><Check size={16} /></i>}
              </span>
            </span>
          </button>;
        })}
      </div>}

      {lesson === 2 && <p className={flipDone ? "review-message good" : "review-message"}>{flipDone ? "Xuất sắc! Em đã tìm đủ 4 cặp thẻ." : memoryMessage}</p>}

      {lesson === 3 && <div className="review-match">
        <div className="match-column">
          <span>TỪ TIẾNG ANH</span>
          {vocabulary.map((item) => <button
            key={item.en}
            disabled={matched.includes(item.en)}
            className={(leftChoice === item.en ? "selected " : "") + (matched.includes(item.en) ? "matched" : "")}
            onClick={() => { setLeftChoice(item.en); setRightChoice(""); setMatchMessage(""); speak(item.en); }}
          >{matched.includes(item.en) && <Check size={15} />}{item.en}<Volume2 size={14} /></button>)}
        </div>
        <div className="match-bridge"><span>CHỌN 1 TỪ</span><i>→</i><span>CHỌN 1 NGHĨA</span></div>
        <div className="match-column">
          <span>NGHĨA TIẾNG VIỆT</span>
          {shuffledMeanings.map((item) => <button
            key={item.vi}
            disabled={matched.includes(item.en)}
            className={(rightChoice === item.vi ? "selected " : "") + (matched.includes(item.en) ? "matched" : "")}
            onClick={() => chooseMeaning(item.vi)}
          >{matched.includes(item.en) && <Check size={15} />}{item.vi}</button>)}
        </div>
      </div>}

      {lesson === 3 && matchMessage && <p className={matchMessage === "Ghép đúng rồi!" ? "review-message good" : "review-message"}>{matchMessage}</p>}

      {lesson === 4 && <div className="review-sentence">
        <div className="sentence-answer" aria-label="Câu đang xếp">
          {sentence.length === 0 && <span>Chạm vào các từ bên dưới để xếp câu</span>}
          {sentence.map((word, index) => <button key={`${word}-${index}`} onClick={() => { setSentence((current) => current.filter((_, position) => position !== index)); setSentenceChecked(false); }}>{word}</button>)}
        </div>
        <div className="sentence-bank">
          {sentenceWords.map((word) => <button key={word} disabled={sentence.includes(word)} onClick={() => { setSentence((current) => [...current, word]); setSentenceChecked(false); }}>{word}</button>)}
        </div>
        {sentenceChecked && <p className={sentenceDone ? "review-message good" : "review-message"}>{sentenceDone ? "Đúng rồi! Em đã nhớ chính xác cả câu." : "Thứ tự chưa đúng. Em thử nghe lại rồi xếp lại nhé."}</p>}
        <div className="sentence-tools">
          <button onClick={() => speak(targetSentence)}><Volume2 size={16} /> Nghe lại câu</button>
          <button onClick={resetSentence}><RotateCcw size={16} /> Xếp lại</button>
          <button className="review-check" disabled={sentence.length !== sentenceWords.length || sentenceComplete} onClick={() => setSentenceChecked(true)}>Kiểm tra</button>
        </div>
      </div>}

      <footer className="review-gate-footer">
        <div><span className={(flipDone || matchDone || sentenceComplete) ? "done" : ""}><Check size={15} /></span><p><b>Gọi lại kiến thức cũ</b><small>Không tính điểm, làm sai có thể thử lại ngay.</small></p></div>
        <button className="primary" disabled={lesson === 2 ? !flipDone : lesson === 3 ? !matchDone : !sentenceComplete} onClick={onComplete}>Mở bài học mới <ArrowRight size={18} /></button>
      </footer>
    </section>
  );
}
