"use client";

import Image from "next/image";
import { ArrowLeft, Check, Coins, Gift, Heart, MapPinned, ShoppingBag, Sparkles } from "lucide-react";
import { useState } from "react";
import "./companion-reward-loop.css";

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
  onBack: () => void;
  onGoReview: () => void;
  onCare: (cost: number) => boolean;
  onSelectCompanion: (id: CompanionId) => void;
  onBuy: (id: string, price: number, label: string, type: "food" | "skin") => void;
};

export function MascotPortrait({ id, label, className = "" }: { id: CompanionId; label?: string; className?: string }) {
  if (id === "wolf") return <span className={`mascot-sprite mascot-wolf ${className}`} role="img" aria-label={label ?? companions[id].kind}><Image src="/starter-wolf.png" alt="" fill sizes="280px"/></span>;
  return <span className={`mascot-sprite mascot-${id} ${className}`} role="img" aria-label={label ?? companions[id].kind}/>;
}

export default function CompanionHub({ coins, companionId, collection, owned, onBack, onGoReview, onCare, onSelectCompanion, onBuy }: Props) {
  const [careMessage, setCareMessage] = useState("Chọn một hoạt động để chơi cùng bạn nhé!");
  const [mood, setMood] = useState(72);
  const companion = companions[companionId];

  function doActivity(cost: number, message: string, moodGain: number) {
    if (!onCare(cost)) {
      setCareMessage("Em chưa đủ Xu. Hãy quay lại bản đồ ôn một Unit đã học nhé!");
      return;
    }
    setMood(value => Math.min(100, value + moodGain));
    setCareMessage(message);
  }

  return <main className="companion-screen">
    <header className="companion-topbar"><button onClick={onBack}><ArrowLeft size={18}/> Về lộ trình</button><div><span>KHU VƯỜN LINH VẬT</span><b>{companion.name} đang đợi em</b></div><strong><Coins size={20} fill="currentColor"/> {coins} Xu chăm sóc</strong></header>
    <section className="companion-wrap">
      <div className="companion-main-card">
        <div className="companion-copy"><span>BẠN ĐANG ĐỒNG HÀNH</span><h1>{companion.name}</h1><b>{companion.kind}</b><p>{companion.note}</p><div className="pet-mood"><Heart size={15} fill="currentColor"/><span><b>{mood >= 90 ? "Rất vui" : "Đang vui"}</b><small>Mức thân thiết {mood}%</small></span></div></div>
        <div className="companion-stage"><span className="stage-glow"/><MascotPortrait id={companionId}/>{owned.includes("cape") && <span className="equipped-badge cape-badge">✨ Áo choàng sao</span>}{owned.includes("hat") && <span className="equipped-badge hat-badge">🎩 Mũ thám hiểm</span>}</div>
        <div className="garden-activity-panel">
          <div className="garden-activity-heading"><Sparkles size={20}/><span><b>Chơi cùng {companion.name}</b><small>Dùng Xu để chăm sóc và tăng mức thân thiết.</small></span></div>
          <div className="garden-activity-actions">
            <button onClick={() => doActivity(2, `${companion.name} ăn ngon lành và đang rất vui!`, 10)}><span>🍓</span><b>Cho ăn</b><small>2 Xu</small></button>
            <button onClick={() => doActivity(1, `${companion.name} vừa chơi bóng cùng em!`, 7)}><span>🔮</span><b>Chơi bóng</b><small>1 Xu</small></button>
            <button onClick={() => doActivity(0, `${companion.name} thích được em vuốt ve lắm!`, 3)}><span>💛</span><b>Vuốt ve</b><small>Miễn phí</small></button>
          </div>
          <p className="garden-activity-message">{careMessage}</p>
          <div className="garden-earn-note"><MapPinned size={18}/><span><b>Muốn kiếm thêm Xu?</b><small>Quay lại các Unit đã hoàn thành trên bản đồ để ôn bài.</small></span><button onClick={onGoReview}>Đến bản đồ</button></div>
        </div>
      </div>
      <aside className="companion-shop">
        <div className="companion-shop-head"><div><span>BỘ SƯU TẬP</span><h2>Chọn bạn đồng hành</h2></div><Gift size={24}/></div>
        <div className="pet-collection">{collection.map(id => <button key={id} className={id === companionId ? "active" : ""} onClick={() => onSelectCompanion(id)}><MascotPortrait id={id} className="collection-mascot"/><span><b>{companions[id].name}</b><small>{id === "wolf" ? "Linh vật cơ bản" : companions[id].kind}</small></span>{id === companionId && <Check size={16}/>}</button>)}</div>
        <div className="companion-shop-head care-shop-head"><div><span>CỬA HÀNG</span><h2>Chăm bạn đồng hành</h2></div><ShoppingBag size={24}/></div>
        <div className="companion-shop-list">{shopItems.map(item => { const isOwned = item.type === "skin" && owned.includes(item.id); const canBuy = coins >= item.price && !isOwned; return <button key={item.id} disabled={!canBuy} className={isOwned ? "owned" : ""} onClick={() => onBuy(item.id, item.price, item.name, item.type)}><span className="shop-emoji">{item.icon}</span><span className="shop-copy"><b>{item.name}</b><small>{item.note}</small></span>{isOwned ? <span className="shop-owned"><Check size={15}/> Đã có</span> : <span className="coin-price"><Coins size={15}/> {item.price}</span>}</button>; })}</div>
        <p className="companion-shop-note">Quà từ Túi Kỳ Vật và đồ mua bằng Xu đều được dùng để chăm sóc các linh vật trong vườn.</p>
      </aside>
    </section>
  </main>;
}
