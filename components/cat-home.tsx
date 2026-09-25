"use client";

import { ArrowLeft, Check, Fish, ShoppingBag } from "lucide-react";

const shopItems = [
  { id: "snack", icon: "🥛", name: "Sữa thưởng", note: "Cho Miu một bữa ngon", price: 1 },
  { id: "ball", icon: "🧶", name: "Cuộn len", note: "Đồ chơi mới cho Miu", price: 3 },
  { id: "scarf", icon: "🧣", name: "Khăn tím", note: "Trang phục đầu tiên", price: 5 },
];

type Props = {
  fish: number;
  owned: string[];
  mood: string;
  onBack: () => void;
  onBuy: (id: string, price: number, label: string) => void;
};

export default function CatHome({ fish, owned, mood, onBack, onBuy }: Props) {
  return <main className="cat-screen">
    <header className="cat-topbar">
      <button className="cat-back" onClick={onBack}><ArrowLeft size={18} /> Về lộ trình</button>
      <div className="cat-title"><span>NHÀ CỦA MÈO</span><b>Miu đang đợi em</b></div>
      <div className="fish-wallet"><Fish size={20} fill="currentColor" /><b>{fish}</b><span>Cá</span></div>
    </header>

    <section className="cat-home-wrap">
      <div className="cat-room-card">
        <div className="cat-room-copy"><span>BẠN ĐỒNG HÀNH</span><h1>Miu</h1><p>{mood}</p></div>
        <div className="cat-stage">
          <div className="cat-window"><span>☁️</span></div>
          <img src="/cat-companion.png" alt="Chú mèo Miu màu cam đang vui vẻ" />
          {owned.includes("ball") && <span className="room-toy" aria-label="Cuộn len của Miu">🧶</span>}
          {owned.includes("scarf") && <span className="room-scarf">Khăn tím đã mở khóa ✨</span>}
        </div>
        <div className="cat-tip"><Fish size={18} /><span><b>Học 1 Lesson = nhận 1 Cá</b><small>Em có thể dùng Cá để chăm sóc và mua đồ cho Miu.</small></span></div>
      </div>

      <aside className="cat-shop">
        <div className="cat-shop-head"><div><span>CỬA HÀNG CỦA MIU</span><h2>Em muốn tặng gì?</h2></div><ShoppingBag size={24} /></div>
        <div className="cat-shop-list">{shopItems.map(item => {
          const isOwned = item.id !== "snack" && owned.includes(item.id);
          const canBuy = fish >= item.price && !isOwned;
          return <button key={item.id} disabled={!canBuy} onClick={() => onBuy(item.id, item.price, item.name)} className={isOwned ? "owned" : ""}>
            <span className="shop-emoji">{item.icon}</span>
            <span className="shop-copy"><b>{item.name}</b><small>{item.note}</small></span>
            {isOwned ? <span className="shop-owned"><Check size={15} /> Đã có</span> : <span className="shop-price"><Fish size={15} fill="currentColor" /> {item.price}</span>}
          </button>;
        })}</div>
        <p className="cat-shop-note">Miu luôn khỏe mạnh. Đồ ăn và đồ chơi chỉ để hai bạn vui hơn thôi.</p>
      </aside>
    </section>
  </main>;
}
