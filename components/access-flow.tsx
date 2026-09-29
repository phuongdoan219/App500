"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, BookOpen, Check, Crown, LockKeyhole, Mail, Map, ShieldCheck, Sparkles, Star, UserRound, X } from "lucide-react";

type Step = "welcome" | "login" | "forgot" | "profile" | "pricing" | "checkout" | "success";
type JourneyId = "magic-school" | "animal-forest" | "adventure-city" | "future-city";
type Props = { initial?: "welcome" | "login" | "pricing"; canExit?: boolean; onExit?: () => void; onProfileComplete: (journeyId: JourneyId) => void; onComplete: (plan: string, journeyId?: JourneyId) => void };

const gradeLevels = [
  { grades: [1, 2, 3], level: "Pre A1", units: 20, journeyId: "magic-school" },
  { grades: [4, 5], level: "A1", units: 27, journeyId: "animal-forest" },
  { grades: [6, 7], level: "Pre A2", units: 22, journeyId: "adventure-city" },
  { grades: [8, 9], level: "A2", units: 30, journeyId: "future-city" },
] as const;

const plans = [
  { id: "year", icon: "📅", name: "Gói 1 năm", price: "1.290.000đ", note: "Khoảng 108.000đ/tháng", badge: "PHỔ BIẾN", detail: "Mở toàn bộ lộ trình trong 12 tháng" },
  { id: "lifetime", icon: "👑", name: "Gói trọn đời", price: "2.990.000đ", note: "Thanh toán một lần", badge: "TIẾT KIỆM LÂU DÀI", detail: "Học không giới hạn thời gian" },
  { id: "map", icon: "🗺️", name: "Mở khóa từng Map", price: "299.000đ", note: "Cho 1 lộ trình", badge: "LINH HOẠT", detail: "Mua đúng Map bé muốn học" },
];

export default function AccessFlow({ initial = "welcome", canExit = false, onExit, onProfileComplete, onComplete }: Props) {
  const [step, setStep] = useState<Step>(initial);
  const [name, setName] = useState("An");
  const [grade, setGrade] = useState(4);
  const [profileOrigin, setProfileOrigin] = useState<"welcome" | "login">("welcome");
  const [plan, setPlan] = useState("year");
  const selectedPlan = plans.find(item => item.id === plan)!;
  const assignedLevel = gradeLevels.find(item => item.grades.includes(grade as never)) ?? gradeLevels[0];
  const progress = step === "profile" ? 1 : undefined;
  const guide = {
    login: { eyebrow: "CỔNG VÀO HÀNH TRÌNH", title: "Mừng em quay lại!", body: "Đăng nhập để tiếp tục đúng chặng học, giữ nguyên linh vật và bộ sưu tập." },
    forgot: { eyebrow: "TRỢ GIÚP PHỤ HUYNH", title: "Tìm lại chìa khóa", body: "Khôi phục tài khoản để bé không mất hành trình đang học." },
    profile: { eyebrow: "CHẶNG 1 · NHÀ THÁM HIỂM", title: "Làm quen với em", body: "Tên và khối lớp giúp hệ thống tự động xếp đúng lộ trình học." },
    success: { eyebrow: "MỞ KHÓA THÀNH CÔNG", title: "Một thế giới mới đang chờ", body: "Tất cả Map và bài học đã sẵn sàng để em khám phá." },
  }[step as "login" | "forgot" | "profile" | "success"];

  const back = () => {
    const order: Step[] = ["welcome", "login", "forgot", "profile", "pricing", "checkout", "success"];
    if (step === "login") return setStep("welcome");
    if (step === "forgot") return setStep("login");
    if (step === "profile") return setStep(profileOrigin);
    const current = order.indexOf(step);
    if (current > 0) setStep(order[current - 1]);
  };

  return <main className={`access-screen${guide ? " access-panel-mode" : ""}`}>
    <header className="access-topbar">
      <div className="road-brand"><span>E</span><div><b>ENGLISH IN</b><small>WONDERLAND</small></div></div>
      {progress && <div className="onboard-progress"><span>THIẾT LẬP LỘ TRÌNH</span><i><em style={{ width: "100%" }} /></i></div>}
      {canExit && <button className="access-close" onClick={onExit} aria-label="Đóng"><X size={19} /></button>}
    </header>

    {guide && <aside className="access-quest-guide" aria-hidden="true"><Image src="/map-magic-school.png" alt="" width={1536} height={1024}/><div className="quest-guide-shade"/><div className="quest-guide-copy"><span><Map size={15}/>{guide.eyebrow}</span><h2>{guide.title}</h2><p>{guide.body}</p><div className="quest-guide-route"><i className="done">1</i></div></div><div className="quest-guide-tip"><Sparkles size={22}/><span><b>Hành trình đang được mở</b><small>Chỉ còn một bước để vào bản đồ</small></span></div></aside>}

    {step === "welcome" && <section className="access-welcome">
      <div className="welcome-copy"><span className="access-kicker"><Sparkles size={15} /> ENGLISH IN WONDERLAND</span><h1>Mở bản đồ.<br/><em>Bắt đầu hành trình kỳ thú!</em></h1><p>Mỗi ngày một bài học ngắn, thêm một bước tiến và cùng linh vật trưởng thành.</p><div className="welcome-features"><span><Map size={18}/> Bản đồ học tập</span><span><BookOpen size={18}/> Bài học 15 phút</span><span><Star size={18}/> Linh vật đồng hành</span></div><div className="welcome-actions"><button className="access-primary" onClick={() => { setProfileOrigin("welcome"); setStep("profile"); }}>Bắt đầu hành trình <ArrowRight size={18} /></button><button className="access-secondary" onClick={() => setStep("login")}>Đăng nhập</button></div><small><ShieldCheck size={15} /> Phụ huynh quản lý tài khoản và thanh toán</small></div>
      <div className="welcome-art"><Image className="welcome-map" src="/map-magic-school.png" alt="Bản đồ trường học kỳ diệu" width={1536} height={1024} priority/><div className="welcome-art-shade"/><div className="welcome-orbit orbit-one"><BookOpen size={24}/></div><div className="welcome-orbit orbit-two"><Star size={25} fill="currentColor"/></div><div className="welcome-card"><span>CHẶNG ĐẦU TIÊN</span><b>Trường học kỳ diệu</b><small>Khối 3–4 · Pre-A1</small></div></div>
    </section>}

    {step === "login" && <section className="access-panel narrow"><button className="panel-back" onClick={back}><ArrowLeft size={17} /> Quay lại</button><span className="panel-icon"><UserRound /></span><h1>Chào mừng trở lại!</h1><p>Phụ huynh đăng nhập để thiết lập lộ trình phù hợp cho bé.</p><label><span>Email hoặc số điện thoại</span><div className="access-input"><Mail size={17}/><input placeholder="phuhuynh@example.com" /></div></label><label><span>Mật khẩu</span><div className="access-input"><LockKeyhole size={17}/><input type="password" placeholder="••••••••" /></div></label><button className="forgot-link" onClick={() => setStep("forgot")}>Quên mật khẩu?</button><button className="access-primary wide" onClick={() => { setProfileOrigin("login"); setStep("profile"); }}>Đăng nhập <ArrowRight size={18}/></button><div className="access-divider"><span>hoặc</span></div><button className="google-demo" onClick={() => { setProfileOrigin("login"); setStep("profile"); }}><b>G</b> Tiếp tục với Google</button><small className="demo-note">Bản demo không gửi hay lưu thông tin đăng nhập.</small></section>}

    {step === "forgot" && <section className="access-panel narrow"><button className="panel-back" onClick={back}><ArrowLeft size={17} /> Về đăng nhập</button><span className="panel-icon blue"><Mail /></span><h1>Lấy lại mật khẩu</h1><p>Nhập email của phụ huynh. Sản phẩm thật sẽ gửi liên kết đặt lại mật khẩu.</p><label><span>Email phụ huynh</span><div className="access-input"><Mail size={17}/><input placeholder="phuhuynh@example.com" /></div></label><button className="access-primary wide" onClick={() => setStep("login")}>Gửi liên kết bản demo <ArrowRight size={18}/></button><small className="demo-note">Không có email nào được gửi trong phiên bản demo.</small></section>}

    {step === "profile" && <section className="access-panel"><button className="panel-back" onClick={back}><ArrowLeft size={17} /> Quay lại</button><span className="panel-icon coral"><UserRound /></span><h1>Bé nào sẽ bắt đầu hành trình?</h1><p>Nhập tên và khối lớp hiện tại để hệ thống tự động xếp đúng level.</p><label><span>Tên bé muốn hiển thị</span><div className="access-input"><input value={name} onChange={e => setName(e.target.value)} placeholder="Ví dụ: An" autoFocus /></div></label><div className="choice-block"><span>Khối lớp hiện tại</span><div className="choice-grid grade-grid">{Array.from({ length: 9 }, (_, index) => index + 1).map(item => <button type="button" className={grade === item ? "selected" : ""} onClick={() => setGrade(item)} key={item}>Lớp {item}</button>)}</div></div><button className="access-primary wide" disabled={!name.trim()} onClick={() => onProfileComplete(assignedLevel.journeyId)}>Tiếp tục <ArrowRight size={18}/></button></section>}

    {step === "pricing" && <section className="pricing-wrap"><div className="pricing-heading"><button className="panel-back" onClick={canExit ? onExit : back}><ArrowLeft size={17}/> {canExit ? "Quay lại lộ trình" : "Quay lại"}</button><span className="access-kicker"><Crown size={15}/> MỞ KHÓA HÀNH TRÌNH</span><h1>Chọn phương án phù hợp với gia đình</h1><p>Giá dưới đây dùng cho bản demo và có thể thay đổi sau.</p></div><div className="plan-grid">{plans.map(item => <button key={item.id} className={`plan-card ${plan === item.id ? "selected" : ""}`} onClick={() => setPlan(item.id)}><span className="plan-badge">{item.badge}</span><strong>{item.icon}</strong><h2>{item.name}</h2><b>{item.price}</b><small>{item.note}</small><p>{item.detail}</p><em>{plan === item.id ? <><Check size={15}/> Đã chọn</> : "Chọn gói"}</em></button>)}</div><div className="pricing-trust"><span><ShieldCheck/> Thanh toán do phụ huynh xác nhận</span><span><Check/> Không tự động mua trong bản demo</span><span><Check/> Xem rõ quyền lợi trước khi trả phí</span></div><button className="access-primary pricing-next" onClick={() => setStep("checkout")}>Tiếp tục thanh toán <ArrowRight size={18}/></button></section>}

    {step === "checkout" && <section className="checkout-wrap"><button className="panel-back" onClick={back}><ArrowLeft size={17}/> Chọn lại gói</button><div className="checkout-grid"><div className="checkout-main"><span className="panel-icon mint"><ShieldCheck/></span><h1>Phụ huynh xác nhận thanh toán</h1><p>Đây là màn mô phỏng. Không có giao dịch thật được tạo.</p><div className="payment-methods"><button className="selected"><span>💳</span><div><b>Thẻ ngân hàng</b><small>Visa · Mastercard · Napas</small></div><Check size={18}/></button><button><span>📱</span><div><b>Ví điện tử / QR</b><small>Quét mã để thanh toán</small></div></button><button><span>🏦</span><div><b>Chuyển khoản</b><small>Kích hoạt sau khi xác nhận</small></div></button></div><label className="parent-confirm"><input type="checkbox" defaultChecked/><span>Tôi là phụ huynh/người giám hộ và đồng ý với điều khoản sử dụng.</span></label><button className="access-primary wide" onClick={() => setStep("success")}>Xác nhận bản demo · {selectedPlan.price} <ArrowRight size={18}/></button><small className="demo-note">Không yêu cầu nhập số thẻ trong phiên bản demo.</small></div><aside className="order-summary"><span>TÓM TẮT ĐƠN HÀNG</span><div className="order-plan"><strong>{selectedPlan.icon}</strong><div><b>{selectedPlan.name}</b><small>{selectedPlan.detail}</small></div></div><div className="order-row"><span>Tạm tính</span><b>{selectedPlan.price}</b></div><div className="order-row"><span>Ưu đãi</span><b>0đ</b></div><div className="order-total"><span>Tổng thanh toán</span><b>{selectedPlan.price}</b></div><p><LockKeyhole size={14}/> Thông tin thanh toán được bảo vệ.</p></aside></div></section>}

    {step === "success" && <section className="access-panel success-panel"><div className="success-burst"><Check size={48}/></div><span className="access-kicker">MỞ KHÓA THÀNH CÔNG</span><h1>Hành trình của {name} đã sẵn sàng!</h1><p><b>{selectedPlan.name}</b> đã được kích hoạt trong bản demo.</p><div className="success-details"><span>🌈</span><div><b>{assignedLevel.level} · {assignedLevel.units} Units</b><small>Dành cho Lớp {assignedLevel.grades.join(", ")}</small></div></div><button className="access-primary wide" onClick={() => onComplete(selectedPlan.name, assignedLevel.journeyId)}>Vào lộ trình học <ArrowRight size={18}/></button><small className="demo-note">Biên nhận và hướng dẫn sử dụng sẽ được gửi cho phụ huynh ở sản phẩm thật.</small></section>}
  </main>;
}
