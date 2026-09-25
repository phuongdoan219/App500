"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Check, ChevronRight, Crown, GraduationCap, LockKeyhole, Mail, Map, ShieldCheck, Sparkles, Star, UserRound, X } from "lucide-react";

type Step = "welcome" | "login" | "forgot" | "profile" | "goal" | "level" | "recommendation" | "pricing" | "checkout" | "success";
type Props = { initial?: "welcome" | "pricing"; canExit?: boolean; onExit?: () => void; onComplete: (plan: string) => void };

const plans = [
  { id: "year", icon: "📅", name: "Gói 1 năm", price: "1.290.000đ", note: "Khoảng 108.000đ/tháng", badge: "PHỔ BIẾN", detail: "Mở toàn bộ lộ trình trong 12 tháng" },
  { id: "lifetime", icon: "👑", name: "Gói trọn đời", price: "2.990.000đ", note: "Thanh toán một lần", badge: "TIẾT KIỆM LÂU DÀI", detail: "Học không giới hạn thời gian" },
  { id: "map", icon: "🗺️", name: "Mở khóa từng Map", price: "299.000đ", note: "Cho 1 lộ trình", badge: "LINH HOẠT", detail: "Mua đúng Map bé muốn học" },
];

export default function AccessFlow({ initial = "welcome", canExit = false, onExit, onComplete }: Props) {
  const [step, setStep] = useState<Step>(initial);
  const [name, setName] = useState("An");
  const [age, setAge] = useState("8–9 tuổi");
  const [goal, setGoal] = useState("Giao tiếp tự tin");
  const [level, setLevel] = useState("Mới bắt đầu");
  const [plan, setPlan] = useState("year");
  const selectedPlan = plans.find(item => item.id === plan)!;
  const progress = { profile: 1, goal: 2, level: 3, recommendation: 4 }[step as "profile" | "goal" | "level" | "recommendation"];
  const guide = {
    login: { eyebrow: "CỔNG VÀO HÀNH TRÌNH", title: "Mừng em quay lại!", body: "Đăng nhập để tiếp tục đúng chặng học và giữ nguyên phần thưởng." },
    forgot: { eyebrow: "TRỢ GIÚP PHỤ HUYNH", title: "Tìm lại chìa khóa", body: "Khôi phục tài khoản để bé không mất hành trình đang học." },
    profile: { eyebrow: "CHẶNG 1 · NHÀ THÁM HIỂM", title: "Làm quen với em", body: "Chia sẻ một chút về em để hệ thống chọn thử thách vừa sức." },
    goal: { eyebrow: "CHẶNG 2 · ĐÍCH ĐẾN", title: "Chọn điều em muốn", body: "Mỗi mục tiêu sẽ giúp hành trình ưu tiên hoạt động phù hợp hơn." },
    level: { eyebrow: "CHẶNG 3 · ĐIỂM XUẤT PHÁT", title: "Chọn thử thách vừa sức", body: "Không cần chọn thật chính xác — em luôn có thể điều chỉnh sau." },
    recommendation: { eyebrow: "CHẶNG 4 · BẢN ĐỒ ĐÃ MỞ", title: "Sẵn sàng lên đường!", body: "Lộ trình của em đã được ghép từ độ tuổi, mục tiêu và trình độ." },
    success: { eyebrow: "MỞ KHÓA THÀNH CÔNG", title: "Một thế giới mới đang chờ", body: "Tất cả Map và bài học đã sẵn sàng để em khám phá." },
  }[step as "login" | "forgot" | "profile" | "goal" | "level" | "recommendation" | "success"];

  const back = () => {
    const order: Step[] = ["welcome", "login", "forgot", "profile", "goal", "level", "recommendation", "pricing", "checkout", "success"];
    if (step === "login") return setStep("welcome");
    if (step === "forgot") return setStep("login");
    if (step === "profile") return setStep("welcome");
    const current = order.indexOf(step);
    if (current > 0) setStep(order[current - 1]);
  };

  return <main className={`access-screen${guide ? " access-panel-mode" : ""}`}>
    <header className="access-topbar">
      <div className="road-brand"><span>W</span><div><b>WONDERTRAIL</b><small>ENGLISH QUEST</small></div></div>
      {progress && <div className="onboard-progress"><span>BƯỚC {progress}/4</span><i><em style={{ width: `${progress * 25}%` }} /></i></div>}
      {canExit && <button className="access-close" onClick={onExit} aria-label="Đóng"><X size={19} /></button>}
    </header>

    {guide && <aside className="access-quest-guide" aria-hidden="true"><img src="/map-magic-school.png" alt=""/><div className="quest-guide-shade"/><div className="quest-guide-copy"><span><Map size={15}/>{guide.eyebrow}</span><h2>{guide.title}</h2><p>{guide.body}</p><div className="quest-guide-route"><i className={progress && progress >= 1 ? "done" : "current"}>1</i><em/><i className={progress && progress >= 2 ? "done" : ""}>2</i><em/><i className={progress && progress >= 3 ? "done" : ""}>3</i><em/><i className={progress && progress >= 4 ? "done" : ""}>4</i></div></div><div className="quest-guide-tip"><Sparkles size={22}/><span><b>Hành trình đang được mở</b><small>Mỗi bước chỉ mất khoảng 1 phút</small></span></div></aside>}

    {step === "welcome" && <section className="access-welcome">
      <div className="welcome-copy"><span className="access-kicker"><Sparkles size={15} /> WONDERTRAIL ENGLISH</span><h1>Mở bản đồ.<br/><em>Bắt đầu hành trình kỳ thú!</em></h1><p>Mỗi ngày một nhiệm vụ ngắn, một phần thưởng vui và thêm một bước tiến trên hành trình.</p><div className="welcome-features"><span><Map size={18}/> Bản đồ phiêu lưu</span><span><BookOpen size={18}/> Bài học 15 phút</span><span><Star size={18}/> Quà mỗi ngày</span></div><div className="welcome-actions"><button className="access-primary" onClick={() => setStep("profile")}>Bắt đầu hành trình <ArrowRight size={18} /></button><button className="access-secondary" onClick={() => setStep("login")}>Đăng nhập</button></div><small><ShieldCheck size={15} /> Phụ huynh quản lý tài khoản và thanh toán</small></div>
      <div className="welcome-art"><img className="welcome-map" src="/map-magic-school.png" alt="Bản đồ trường học kỳ diệu"/><div className="welcome-art-shade"/><div className="welcome-orbit orbit-one"><BookOpen size={24}/></div><div className="welcome-orbit orbit-two"><Star size={25} fill="currentColor"/></div><div className="welcome-card"><span>CHẶNG ĐẦU TIÊN</span><b>Trường học kỳ diệu</b><small>Khối 3–4 · Pre-A1</small></div></div>
    </section>}

    {step === "login" && <section className="access-panel narrow"><button className="panel-back" onClick={back}><ArrowLeft size={17} /> Quay lại</button><span className="panel-icon"><UserRound /></span><h1>Chào mừng trở lại!</h1><p>Phụ huynh đăng nhập để bé tiếp tục hành trình.</p><label><span>Email hoặc số điện thoại</span><div className="access-input"><Mail size={17}/><input placeholder="phuhuynh@example.com" /></div></label><label><span>Mật khẩu</span><div className="access-input"><LockKeyhole size={17}/><input type="password" placeholder="••••••••" /></div></label><button className="forgot-link" onClick={() => setStep("forgot")}>Quên mật khẩu?</button><button className="access-primary wide" onClick={() => onComplete("Gói đang hoạt động")}>Đăng nhập <ArrowRight size={18}/></button><div className="access-divider"><span>hoặc</span></div><button className="google-demo"><b>G</b> Tiếp tục với Google</button><small className="demo-note">Bản demo không gửi hay lưu thông tin đăng nhập.</small></section>}

    {step === "forgot" && <section className="access-panel narrow"><button className="panel-back" onClick={back}><ArrowLeft size={17} /> Về đăng nhập</button><span className="panel-icon blue"><Mail /></span><h1>Lấy lại mật khẩu</h1><p>Nhập email của phụ huynh. Sản phẩm thật sẽ gửi liên kết đặt lại mật khẩu.</p><label><span>Email phụ huynh</span><div className="access-input"><Mail size={17}/><input placeholder="phuhuynh@example.com" /></div></label><button className="access-primary wide" onClick={() => setStep("login")}>Gửi liên kết bản demo <ArrowRight size={18}/></button><small className="demo-note">Không có email nào được gửi trong phiên bản demo.</small></section>}

    {step === "profile" && <section className="access-panel"><button className="panel-back" onClick={back}><ArrowLeft size={17} /> Quay lại</button><span className="panel-icon coral"><UserRound /></span><h1>Bé nào sẽ bắt đầu hành trình?</h1><p>Thông tin này giúp nội dung và cách hướng dẫn phù hợp với độ tuổi.</p><label><span>Tên bé muốn hiển thị</span><div className="access-input"><input value={name} onChange={e => setName(e.target.value)} placeholder="Ví dụ: An" /></div></label><div className="choice-block"><span>Độ tuổi của bé</span><div className="choice-grid age-grid">{["6–7 tuổi","8–9 tuổi","10–11 tuổi","12+ tuổi"].map(item => <button className={age === item ? "selected" : ""} onClick={() => setAge(item)} key={item}>{item}</button>)}</div></div><button className="access-primary wide" onClick={() => setStep("goal")}>Tiếp tục <ArrowRight size={18}/></button></section>}

    {step === "goal" && <section className="access-panel"><button className="panel-back" onClick={back}><ArrowLeft size={17} /> Quay lại</button><span className="panel-icon yellow"><Star /></span><h1>Mục tiêu quan trọng nhất?</h1><p>Chọn một mục tiêu chính. Bé vẫn được luyện đủ cả bốn kỹ năng.</p><div className="option-list">{[["Giao tiếp tự tin","Nghe và nói tự nhiên hơn","🗣️"],["Học tốt trên lớp","Bám sát kiến thức theo khối lớp","📚"],["Xây nền từ đầu","Học chậm, chắc và có hướng dẫn","🌱"],["Luyện thi chứng chỉ","Làm quen dạng bài và kỹ năng thi","🎯"]].map(([title,sub,icon]) => <button key={title} className={goal === title ? "selected" : ""} onClick={() => setGoal(title)}><span>{icon}</span><div><b>{title}</b><small>{sub}</small></div>{goal === title && <Check size={18}/>}</button>)}</div><button className="access-primary wide" onClick={() => setStep("level")}>Tiếp tục <ArrowRight size={18}/></button></section>}

    {step === "level" && <section className="access-panel"><button className="panel-back" onClick={back}><ArrowLeft size={17} /> Quay lại</button><span className="panel-icon blue"><GraduationCap /></span><h1>Tiếng Anh hiện tại của bé?</h1><p>Phụ huynh có thể chọn nhanh hoặc cho bé làm bài kiểm tra sau.</p><div className="level-options">{[["Mới bắt đầu","Biết một vài từ đơn giản"],["Đã có nền tảng","Hiểu câu ngắn, giao tiếp cơ bản"],["Khá tự tin","Đọc nghe được đoạn ngắn"],["Chưa chắc","Làm bài kiểm tra 5–7 phút"]].map(([title,sub]) => <button className={level === title ? "selected" : ""} onClick={() => setLevel(title)} key={title}><span>{title === "Chưa chắc" ? "?" : ["1","2","3"][["Mới bắt đầu","Đã có nền tảng","Khá tự tin"].indexOf(title)]}</span><div><b>{title}</b><small>{sub}</small></div><ChevronRight size={18}/></button>)}</div><button className="access-primary wide" onClick={() => setStep("recommendation")}>Xem lộ trình đề xuất <ArrowRight size={18}/></button></section>}

    {step === "recommendation" && <section className="access-panel recommendation-panel"><span className="recommend-badge"><Check size={28}/></span><small>ĐÃ CÁ NHÂN HÓA CHO {name.toUpperCase()}</small><h1>Lộ trình phù hợp đã sẵn sàng!</h1><p>Dựa trên độ tuổi <b>{age}</b>, mục tiêu <b>{goal}</b> và mức <b>{level}</b>.</p><div className="recommend-card"><span>🌈</span><div><small>ĐỀ XUẤT BẮT ĐẦU</small><h2>Beginner 1 · A1 Starter</h2><p>24 Unit · 96 Lesson · khoảng 4 tháng</p></div><Check size={22}/></div><div className="recommend-points"><span><BookOpen/> Bài học 10–15 phút</span><span><Map/> Tiến trình theo bản đồ</span><span><Star/> Phần thưởng mỗi ngày</span></div><button className="access-primary wide" onClick={() => setStep("pricing")}>Chọn cách mở khóa <ArrowRight size={18}/></button><button className="skip-payment" onClick={() => onComplete("Dùng thử")}>Xem trước lộ trình miễn phí</button></section>}

    {step === "pricing" && <section className="pricing-wrap"><div className="pricing-heading">{canExit && <button className="panel-back" onClick={onExit}><ArrowLeft size={17}/> Quay lại lộ trình</button>}<span className="access-kicker"><Crown size={15}/> MỞ KHÓA HÀNH TRÌNH</span><h1>Chọn phương án phù hợp với gia đình</h1><p>Giá dưới đây dùng cho bản demo và có thể thay đổi sau.</p></div><div className="plan-grid">{plans.map(item => <button key={item.id} className={`plan-card ${plan === item.id ? "selected" : ""}`} onClick={() => setPlan(item.id)}><span className="plan-badge">{item.badge}</span><strong>{item.icon}</strong><h2>{item.name}</h2><b>{item.price}</b><small>{item.note}</small><p>{item.detail}</p><em>{plan === item.id ? <><Check size={15}/> Đã chọn</> : "Chọn gói"}</em></button>)}</div><div className="pricing-trust"><span><ShieldCheck/> Thanh toán do phụ huynh xác nhận</span><span><Check/> Không tự động mua trong bản demo</span><span><Check/> Xem rõ quyền lợi trước khi trả phí</span></div><button className="access-primary pricing-next" onClick={() => setStep("checkout")}>Tiếp tục thanh toán <ArrowRight size={18}/></button></section>}

    {step === "checkout" && <section className="checkout-wrap"><button className="panel-back" onClick={back}><ArrowLeft size={17}/> Chọn lại gói</button><div className="checkout-grid"><div className="checkout-main"><span className="panel-icon mint"><ShieldCheck/></span><h1>Phụ huynh xác nhận thanh toán</h1><p>Đây là màn mô phỏng. Không có giao dịch thật được tạo.</p><div className="payment-methods"><button className="selected"><span>💳</span><div><b>Thẻ ngân hàng</b><small>Visa · Mastercard · Napas</small></div><Check size={18}/></button><button><span>📱</span><div><b>Ví điện tử / QR</b><small>Quét mã để thanh toán</small></div></button><button><span>🏦</span><div><b>Chuyển khoản</b><small>Kích hoạt sau khi xác nhận</small></div></button></div><label className="parent-confirm"><input type="checkbox" defaultChecked/><span>Tôi là phụ huynh/người giám hộ và đồng ý với điều khoản sử dụng.</span></label><button className="access-primary wide" onClick={() => setStep("success")}>Xác nhận bản demo · {selectedPlan.price} <ArrowRight size={18}/></button><small className="demo-note">Không yêu cầu nhập số thẻ trong phiên bản demo.</small></div><aside className="order-summary"><span>TÓM TẮT ĐƠN HÀNG</span><div className="order-plan"><strong>{selectedPlan.icon}</strong><div><b>{selectedPlan.name}</b><small>{selectedPlan.detail}</small></div></div><div className="order-row"><span>Tạm tính</span><b>{selectedPlan.price}</b></div><div className="order-row"><span>Ưu đãi</span><b>0đ</b></div><div className="order-total"><span>Tổng thanh toán</span><b>{selectedPlan.price}</b></div><p><LockKeyhole size={14}/> Thông tin thanh toán được bảo vệ.</p></aside></div></section>}

    {step === "success" && <section className="access-panel success-panel"><div className="success-burst"><Check size={48}/></div><span className="access-kicker">MỞ KHÓA THÀNH CÔNG</span><h1>Hành trình của {name} đã sẵn sàng!</h1><p><b>{selectedPlan.name}</b> đã được kích hoạt trong bản demo.</p><div className="success-details"><span>🌈</span><div><b>Beginner 1 · A1 Starter</b><small>Bắt đầu với Unit “The Wrong Bag”</small></div></div><button className="access-primary wide" onClick={() => onComplete(selectedPlan.name)}>Vào lộ trình học <ArrowRight size={18}/></button><small className="demo-note">Biên nhận và hướng dẫn sử dụng sẽ được gửi cho phụ huynh ở sản phẩm thật.</small></section>}
  </main>;
}
