"use client";

import { ArrowLeft, Check, Coins, Gift, ShoppingBag, Sparkles } from "lucide-react";
import { useState } from "react";

export const companions = {
  dragon: { name: "Mầm", kind: "Rồng Lá", note: "Gan dạ và luôn tò mò về từ mới." },
  owl: { name: "Sao", kind: "Cú Ánh Sao", note: "Nhớ rất lâu những câu em vừa ôn." },
  fox: { name: "Cam", kind: "Cáo Lửa", note: "Nhanh nhẹn và thích thử thách nghe." },
} as const;

export type CompanionId = keyof typeof companions;

const shopItems = [
  { id: "berry", icon: "🍓", name: "Bánh dâu", note: "Một món ăn vui vẻ", price: 2, type: "food" },
  { id: "cape", icon: "✨", name: "Áo choàng sao", note: "Skin lấp lánh đầu tiên", price: 6, type: "skin" },
  { id: "hat", icon: "🎩", name: "Mũ thám hiểm", note: "Skin cho chuyến đi mới", price: 8, type: "skin" },
] as const;

type Props = {
  coins: number;
  companionId: CompanionId | null;
  owned: string[];
  reviewClaimed: boolean;
  onBack: () => void;
  onReviewComplete: () => void;
  onBuy: (id: string, price: number, label: string, type: "food" | "skin") => void;
};

export function MascotPortrait({ id, label, className = "" }: { id: CompanionId; label?: string; className?: string }) {
  return <span className={`mascot-sprite mascot-${id} ${className}`} role="img" aria-label={label ?? companions[id].kind} />;
}

export default function CompanionHub({ coins, companionId, owned, reviewClaimed, onBack, onReviewComplete, onBuy }: Props) {
  const [reviewOpen, setReviewOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const correct = answer === "in the tree";
  const companion = companionId ? companions[companionId] : null;

  return <main className="companion-screen">
    <header className="companion-topbar">
      <button onClick={onBack}><ArrowLeft size={18} /> Về lộ trình</button>
      <div><span>KHU VƯỜN LINH VẬT</span><b>{companion ? `${companion.name} đang đợi em` : "Rương đầu tiên đang chờ"}</b></div>
      <strong><Coins size={20} fill="currentColor" /> {coins} Xu</strong>
    </header>

    <section className="companion-wrap">
      <div className="companion-main-card">
        {companionId && companion ? <>
          <div className="companion-copy"><span>BẠN ĐỒNG HÀNH</span><h1>{companion.name}</h1><b>{companion.kind}</b><p>{companion.note}</p></div>
          <div className="companion-stage">
            <span className="stage-glow" />
            <MascotPortrait id={companionId} />
            {owned.includes("cape") && <span className="equipped-badge cape-badge">✨ Áo choàng sao</span>}
            {owned.includes("hat") && <span className="equipped-badge hat-badge">🎩 Mũ thám hiểm</span>}
          </div>
          <div className="review-callout"><Sparkles size={20} /><span><b>Chỉ ôn bài mới nhận Xu</b><small>Dùng Xu để mua thức ăn và skin cho {companion.name}.</small></span><button disabled={reviewClaimed} onClick={() => setReviewOpen(true)}>{reviewClaimed ? <><Check size={16}/> Đã ôn hôm nay</> : "Ôn nhanh · +3 Xu"}</button></div>
        </> : <div className="companion-locked">
          <span className="locked-chest">🎁</span><small>CHƯA CÓ LINH VẬT</small><h1>Vượt mốc cuối của Level</h1><p>Hoàn thành các bài học, sau đó vượt bài đánh giá năng lực ở cuối bản đồ để mở rương linh vật ngẫu nhiên.</p><button onClick={onBack}>Đi đến mốc đánh giá</button>
        </div>}
      </div>

      <aside className="companion-shop">
        <div className="companion-shop-head"><div><span>CỬA HÀNG</span><h2>Chăm bạn đồng hành</h2></div><ShoppingBag size={24} /></div>
        {!companionId && <p className="shop-locked-note">Mở linh vật đầu tiên để bắt đầu mua đồ.</p>}
        <div className="companion-shop-list">{shopItems.map(item => {
          const isOwned = item.type === "skin" && owned.includes(item.id);
          const canBuy = Boolean(companionId) && coins >= item.price && !isOwned;
          return <button key={item.id} disabled={!canBuy} className={isOwned ? "owned" : ""} onClick={() => onBuy(item.id, item.price, item.name, item.type)}>
            <span className="shop-emoji">{item.icon}</span><span className="shop-copy"><b>{item.name}</b><small>{item.note}</small></span>
            {isOwned ? <span className="shop-owned"><Check size={15}/> Đã có</span> : <span className="coin-price"><Coins size={15}/> {item.price}</span>}
          </button>;
        })}</div>
        <p className="companion-shop-note">Không trừ Xu khi học bài mới. Xu chỉ đến từ hoạt động ôn luyện.</p>
      </aside>
    </section>

    {reviewOpen && <div className="review-modal" role="dialog" aria-modal="true" aria-label="Ôn nhanh nhận Xu"><section>
      <button className="review-close" onClick={() => setReviewOpen(false)}>×</button>
      <span className="review-kicker"><Gift size={16}/> ÔN NHANH 1 PHÚT</span><h2>Chiếc diều đỏ ở đâu?</h2><p>Chọn cụm từ đúng để ôn lại bài vừa học.</p>
      <div className="review-options">{["under the bench", "in the tree", "in the bag"].map(item => <button key={item} className={(answer === item ? "selected " : "") + (checked && item === "in the tree" ? "correct" : "")} onClick={() => { setAnswer(item); setChecked(false); }}>{item}</button>)}</div>
      {checked && !correct && <p className="review-feedback retry">Gần đúng rồi — hãy nhớ lại cảnh chiếc diều mắc trên cao.</p>}
      {checked && correct && <div className="review-earned"><Coins size={25}/><span><b>Ôn đúng rồi!</b><small>Em nhận được 3 Xu để chăm linh vật.</small></span></div>}
      {!checked || !correct ? <button className="review-submit" disabled={!answer} onClick={() => setChecked(true)}>Kiểm tra</button> : <button className="review-submit" onClick={() => { onReviewComplete(); setReviewOpen(false); }}>Nhận 3 Xu</button>}
    </section></div>}
  </main>;
}
