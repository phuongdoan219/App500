"use client";

import Image from "next/image";
import { ArrowLeft, Check, Coins, Gift, Heart, ShoppingBag, Sparkles } from "lucide-react";
import { useState } from "react";

export const companions = {
  wolf: { name: "Sói Con", kind: "Bạn đồng hành đầu tiên", note: "Luôn đi cùng, nhắc em học và vui nhất khi em quay lại đúng hẹn." },
  dragon: { name: "Mầm", kind: "Rồng Lá", note: "Gan dạ và luôn tò mò về từ mới." },
  owl: { name: "Sao", kind: "Cú Ánh Sao", note: "Nhớ rất lâu những câu em vừa ôn." },
  fox: { name: "Cam", kind: "Cáo Lửa", note: "Nhanh nhẹn và thích thử thách nghe." },
} as const;

export type CompanionId = keyof typeof companions;

const shopItems = [
  { id: "berry", icon: "🍓", name: "Bánh dâu", note: "Giúp bạn nhỏ hết đói", price: 2, type: "food" },
  { id: "cape", icon: "✨", name: "Áo choàng sao", note: "Trang phục lấp lánh", price: 6, type: "skin" },
  { id: "hat", icon: "🎩", name: "Mũ thám hiểm", note: "Sẵn sàng cho Unit mới", price: 8, type: "skin" },
] as const;

type Props = {
  coins: number;
  companionId: CompanionId;
  collection: CompanionId[];
  owned: string[];
  reviewClaimed: boolean;
  onBack: () => void;
  onReviewComplete: () => void;
  onSelectCompanion: (id: CompanionId) => void;
  onBuy: (id: string, price: number, label: string, type: "food" | "skin") => void;
};

export function MascotPortrait({ id, label, className = "" }: { id: CompanionId; label?: string; className?: string }) {
  if (id === "wolf") return <span className={`mascot-sprite mascot-wolf ${className}`} role="img" aria-label={label ?? companions[id].kind}><Image src="/starter-wolf.png" alt="" fill sizes="280px"/></span>;
  return <span className={`mascot-sprite mascot-${id} ${className}`} role="img" aria-label={label ?? companions[id].kind}/>;
}

export default function CompanionHub({ coins, companionId, collection, owned, reviewClaimed, onBack, onReviewComplete, onSelectCompanion, onBuy }: Props) {
  const [reviewOpen, setReviewOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const correct = answer === "in the tree";
  const companion = companions[companionId];

  return <main className="companion-screen">
    <header className="companion-topbar"><button onClick={onBack}><ArrowLeft size={18}/> Về lộ trình</button><div><span>KHU VƯỜN LINH VẬT</span><b>{companion.name} đang đợi em</b></div><strong><Coins size={20} fill="currentColor"/> {coins} Xu chăm sóc</strong></header>
    <section className="companion-wrap">
      <div className="companion-main-card">
        <div className="companion-copy"><span>BẠN ĐANG ĐỒNG HÀNH</span><h1>{companion.name}</h1><b>{companion.kind}</b><p>{companion.note}</p><div className="pet-mood"><Heart size={15} fill="currentColor"/><span><b>Đang vui</b><small>Hôm nay em đã ghé thăm bạn ấy</small></span></div></div>
        <div className="companion-stage"><span className="stage-glow"/><MascotPortrait id={companionId}/>{owned.includes("cape") && <span className="equipped-badge cape-badge">✨ Áo choàng sao</span>}{owned.includes("hat") && <span className="equipped-badge hat-badge">🎩 Mũ thám hiểm</span>}</div>
        <div className="review-callout"><Sparkles size={20}/><span><b>Ôn bài để nhận Xu chăm sóc</b><small>Học bài mới nhận Mảnh Chìa Khóa, ôn bài mới nhận Xu.</small></span><button disabled={reviewClaimed} onClick={() => setReviewOpen(true)}>{reviewClaimed ? <><Check size={16}/> Đã ôn hôm nay</> : "Ôn nhanh · +3 Xu"}</button></div>
      </div>
      <aside className="companion-shop">
        <div className="companion-shop-head"><div><span>BỘ SƯU TẬP</span><h2>Chọn bạn đồng hành</h2></div><Gift size={24}/></div>
        <div className="pet-collection">{collection.map(id => <button key={id} className={id === companionId ? "active" : ""} onClick={() => onSelectCompanion(id)}><MascotPortrait id={id} className="collection-mascot"/><span><b>{companions[id].name}</b><small>{id === "wolf" ? "Linh vật cơ bản" : companions[id].kind}</small></span>{id === companionId && <Check size={16}/>}</button>)}</div>
        <div className="companion-shop-head care-shop-head"><div><span>CỬA HÀNG</span><h2>Chăm bạn đồng hành</h2></div><ShoppingBag size={24}/></div>
        <div className="companion-shop-list">{shopItems.map(item => { const isOwned = item.type === "skin" && owned.includes(item.id); const canBuy = coins >= item.price && !isOwned; return <button key={item.id} disabled={!canBuy} className={isOwned ? "owned" : ""} onClick={() => onBuy(item.id, item.price, item.name, item.type)}><span className="shop-emoji">{item.icon}</span><span className="shop-copy"><b>{item.name}</b><small>{item.note}</small></span>{isOwned ? <span className="shop-owned"><Check size={15}/> Đã có</span> : <span className="coin-price"><Coins size={15}/> {item.price}</span>}</button>; })}</div>
        <p className="companion-shop-note">Quà từ Túi Kỳ Vật và đồ mua bằng Xu đều được dùng để chăm sóc các linh vật trong vườn.</p>
      </aside>
    </section>
    {reviewOpen && <div className="review-modal" role="dialog" aria-modal="true" aria-label="Ôn nhanh nhận Xu"><section><button className="review-close" onClick={() => setReviewOpen(false)}>×</button><span className="review-kicker"><Gift size={16}/> ÔN NHANH 1 PHÚT</span><h2>Chiếc diều đỏ ở đâu?</h2><p>Chọn cụm từ đúng để ôn lại bài vừa học.</p><div className="review-options">{["under the bench", "in the tree", "in the bag"].map(item => <button key={item} className={(answer === item ? "selected " : "") + (checked && item === "in the tree" ? "correct" : "")} onClick={() => { setAnswer(item); setChecked(false); }}>{item}</button>)}</div>{checked && !correct && <p className="review-feedback retry">Gần đúng rồi — hãy nhớ lại cảnh chiếc diều mắc trên cao.</p>}{checked && correct && <div className="review-earned"><Coins size={25}/><span><b>Ôn đúng rồi!</b><small>Em nhận được 3 Xu chăm sóc.</small></span></div>}{!checked || !correct ? <button className="review-submit" disabled={!answer} onClick={() => setChecked(true)}>Kiểm tra</button> : <button className="review-submit" onClick={() => { onReviewComplete(); setReviewOpen(false); }}>Nhận 3 Xu</button>}</section></div>}
  </main>;
}
