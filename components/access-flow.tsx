"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, BookOpen, Check, Coins, Crown, Gift, Heart, KeyRound, LockKeyhole, Mail, Map, ShieldCheck, Sparkles, Star, UserRound, X } from "lucide-react";
import ReferralProgram from "@/components/referral-program";
import "./onboarding-story.css";

type Step = "welcome" | "login" | "forgot" | "profile" | "world" | "companion" | "keys" | "rewards" | "pricing" | "checkout" | "success";
type JourneyId = "magic-school" | "animal-forest" | "adventure-city" | "future-city";
type Props = { initial?: "welcome" | "login" | "pricing"; initialJourneyId?: JourneyId; canExit?: boolean; trialCompleted?: boolean; onExit?: () => void; onComplete: (plan: string, journeyId?: JourneyId, companionName?: string, studentName?: string) => void };

const gradeLevels = [
  { grades: [1, 2, 3], level: "Pre A1", units: 20, journeyId: "magic-school" },
  { grades: [4, 5], level: "A1", units: 27, journeyId: "animal-forest" },
  { grades: [6, 7], level: "Pre A2", units: 22, journeyId: "adventure-city" },
  { grades: [8, 9], level: "A2", units: 30, journeyId: "future-city" },
] as const;

const journeyStories: Record<JourneyId, { title: string; image: string; places: string[]; mission: string }> = {
  "magic-school": { title: "Học viện Ánh Sao", image: "/map-star-academy.png", places: ["Cổng Cầu Vồng", "Rừng Cổ Tích", "Đài Ánh Sao"], mission: "xây nền tiếng Anh đầu tiên" },
  "animal-forest": { title: "Rừng Thì Thầm", image: "/map-whispering-forest.png", places: ["Làng Gương Mặt", "Hang Kho Báu", "Cây Trí Nhớ"], mission: "giao tiếp trong những tình huống quen thuộc" },
  "adventure-city": { title: "Vương quốc Núi Pha Lê", image: "/map-crystal-mountain.png", places: ["Trạm Khởi Hành", "Làng Sườn Núi", "Đỉnh Pha Lê"], mission: "chinh phục những thử thách tiếng Anh mới" },
  "future-city": { title: "Thành phố Phiêu Lưu", image: "/map-adventure-city.png", places: ["Ga Khởi Hành", "Phố Ý Tưởng", "Tháp Chân Trời"], mission: "vận dụng tiếng Anh trong hành trình dài hơn" },
};

export default function AccessFlow({ initial = "welcome", initialJourneyId, canExit = false, trialCompleted = false, onExit, onComplete }: Props) {
  const [step, setStep] = useState<Step>(initial);
  const [name, setName] = useState("An");
  const [grade, setGrade] = useState(4);
  const [companionName, setCompanionName] = useState("Mây");
  const [profileOrigin, setProfileOrigin] = useState<"welcome" | "login">("welcome");
  const [plan, setPlan] = useState("map");
  const assignedLevel =
    (initial === "pricing" && initialJourneyId
      ? gradeLevels.find(item => item.journeyId === initialJourneyId)
      : undefined) ??
    gradeLevels.find(item => item.grades.includes(grade as never)) ??
    gradeLevels[0];
  const story = journeyStories[assignedLevel.journeyId];
  const plans = [
    { id: "five-units", Icon: KeyRound, name: "Mở 5 Unit tiếp theo", price: "59.000đ", note: "11.800đ / Unit", badge: "BẮT ĐẦU NHẸ NHÀNG", detail: "Mở 5 Unit kế tiếp trong Map đang học.", benefit: "Phù hợp để bé học tiếp ngay" },
    { id: "map", Icon: Map, name: `Trọn Map ${assignedLevel.level}`, price: "229.000đ", note: `${assignedLevel.units} Unit · Học không giới hạn`, badge: "TRỌN MỘT LEVEL", detail: `Mở toàn bộ hành trình ${story.title}.`, benefit: "Có Rương Linh Vật cuối Level" },
    { id: "lifetime", Icon: Crown, name: "Trọn bộ 4 Map", price: "799.000đ", note: "99 Unit · Sử dụng vĩnh viễn", badge: "TIẾT KIỆM NHẤT", detail: "Học từ Pre A1 đến A2, không mua thêm nội dung.", benefit: "Một lần mở khóa toàn bộ lộ trình" },
  ];
  const selectedPlan = plans.find(item => item.id === plan)!;
  const SelectedPlanIcon = selectedPlan.Icon;
  const stepNumbers: Partial<Record<Step, number>> = { login: 1, profile: 2, world: 3, companion: 4, keys: 5, rewards: 6 };
  const progress = stepNumbers[step];
  const guide = {
    login: { eyebrow: "CỔNG VÀO HÀNH TRÌNH", title: "Mừng em quay lại!", body: "Đăng nhập để tiếp tục đúng chặng học, giữ nguyên linh vật và bộ sưu tập." },
    forgot: { eyebrow: "TRỢ GIÚP PHỤ HUYNH", title: "Tìm lại chìa khóa", body: "Khôi phục tài khoản để bé không mất hành trình đang học." },
    profile: { eyebrow: "CHẶNG 1 · NHÀ THÁM HIỂM", title: "Làm quen với em", body: "Tên và khối lớp giúp hệ thống tự động xếp đúng lộ trình học." },
    success: { eyebrow: "MỞ KHÓA THÀNH CÔNG", title: "Chặng đường mới đang chờ", body: "Nội dung vừa chọn đã sẵn sàng để bé tiếp tục hành trình." },
  }[step as "login" | "forgot" | "profile" | "success"];

  const back = () => {
    const order: Step[] = ["welcome", "login", "forgot", "profile", "world", "companion", "keys", "rewards", "pricing", "checkout", "success"];
    if (step === "login") return setStep("welcome");
    if (step === "forgot") return setStep("login");
    if (step === "profile") return setStep(profileOrigin);
    const current = order.indexOf(step);
    if (current > 0) setStep(order[current - 1]);
  };

  return <main className={`access-screen${guide ? " access-panel-mode" : ""}`}>
    <header className="access-topbar">
      <div className="road-brand"><span>E</span><div><b>ENGLISH IN</b><small>WONDERLAND</small></div></div>
      {progress && <div className="onboard-progress"><span>BƯỚC {progress}/6 · KHỞI TẠO HÀNH TRÌNH</span><i><em style={{ width: `${progress / 6 * 100}%` }} /></i></div>}
      {canExit && <button className="access-close" onClick={onExit} aria-label="Đóng"><X size={19} /></button>}
    </header>

    {guide && <aside className="access-quest-guide" aria-hidden="true"><Image src="/map-magic-school.png" alt="" width={1536} height={1024}/><div className="quest-guide-shade"/><div className="quest-guide-copy"><span><Map size={15}/>{guide.eyebrow}</span><h2>{guide.title}</h2><p>{guide.body}</p><div className="quest-guide-route"><i className="done">1</i></div></div><div className="quest-guide-tip"><Sparkles size={22}/><span><b>Hành trình đang được mở</b><small>Chỉ còn một bước để vào bản đồ</small></span></div></aside>}

    {step === "welcome" && <section className="access-welcome">
      <div className="welcome-copy"><span className="access-kicker"><Sparkles size={15} /> ENGLISH IN WONDERLAND</span><h1>Mở bản đồ.<br/><em>Bắt đầu hành trình kỳ thú!</em></h1><p>Mỗi ngày một bài học ngắn, thêm một bước tiến và cùng linh vật trưởng thành.</p><div className="welcome-features"><span><Map size={18}/> Bản đồ học tập</span><span><BookOpen size={18}/> Bài học 15 phút</span><span><Star size={18}/> Linh vật đồng hành</span></div><div className="welcome-actions"><button className="access-primary" onClick={() => { setProfileOrigin("welcome"); setStep("profile"); }}>Bắt đầu hành trình <ArrowRight size={18} /></button><button className="access-secondary" onClick={() => setStep("login")}>Đăng nhập</button></div><small><ShieldCheck size={15} /> Phụ huynh quản lý tài khoản và thanh toán</small></div>
      <div className="welcome-art"><Image className="welcome-map" src="/map-magic-school.png" alt="Bản đồ trường học kỳ diệu" width={1536} height={1024} priority/><div className="welcome-art-shade"/><div className="welcome-orbit orbit-one"><BookOpen size={24}/></div><div className="welcome-orbit orbit-two"><Star size={25} fill="currentColor"/></div><div className="welcome-card"><span>CHẶNG ĐẦU TIÊN</span><b>Trường học kỳ diệu</b><small>Khối 3–4 · Pre-A1</small></div></div>
    </section>}

    {step === "login" && <section className="access-panel narrow"><button className="panel-back" onClick={back}><ArrowLeft size={17} /> Quay lại</button><span className="panel-icon"><UserRound /></span><h1>Chào mừng trở lại!</h1><p>Phụ huynh đăng nhập để thiết lập lộ trình phù hợp cho bé.</p><label><span>Email hoặc số điện thoại</span><div className="access-input"><Mail size={17}/><input placeholder="phuhuynh@example.com" /></div></label><label><span>Mật khẩu</span><div className="access-input"><LockKeyhole size={17}/><input type="password" placeholder="••••••••" /></div></label><button className="forgot-link" onClick={() => setStep("forgot")}>Quên mật khẩu?</button><button className="access-primary wide" onClick={() => { setProfileOrigin("login"); setStep("profile"); }}>Đăng nhập <ArrowRight size={18}/></button><div className="access-divider"><span>hoặc</span></div><button className="google-demo" onClick={() => { setProfileOrigin("login"); setStep("profile"); }}><b>G</b> Tiếp tục với Google</button><small className="demo-note">Bản demo không gửi hay lưu thông tin đăng nhập.</small></section>}

    {step === "forgot" && <section className="access-panel narrow"><button className="panel-back" onClick={back}><ArrowLeft size={17} /> Về đăng nhập</button><span className="panel-icon blue"><Mail /></span><h1>Lấy lại mật khẩu</h1><p>Nhập email của phụ huynh. Sản phẩm thật sẽ gửi liên kết đặt lại mật khẩu.</p><label><span>Email phụ huynh</span><div className="access-input"><Mail size={17}/><input placeholder="phuhuynh@example.com" /></div></label><button className="access-primary wide" onClick={() => setStep("login")}>Gửi liên kết bản demo <ArrowRight size={18}/></button><small className="demo-note">Không có email nào được gửi trong phiên bản demo.</small></section>}

    {step === "profile" && <section className="access-panel"><button className="panel-back" onClick={back}><ArrowLeft size={17} /> Quay lại</button><span className="panel-icon coral"><UserRound /></span><h1>Bé nào sẽ bắt đầu hành trình?</h1><p>Nhập tên và khối lớp hiện tại để hệ thống tự động xếp đúng level.</p><label><span>Tên bé muốn hiển thị</span><div className="access-input"><input value={name} onChange={e => setName(e.target.value)} placeholder="Ví dụ: An" autoFocus /></div></label><div className="choice-block"><span>Khối lớp hiện tại</span><div className="choice-grid grade-grid">{Array.from({ length: 9 }, (_, index) => index + 1).map(item => <button type="button" className={grade === item ? "selected" : ""} onClick={() => setGrade(item)} key={item}>Lớp {item}</button>)}</div></div><button className="access-primary wide" disabled={!name.trim()} onClick={() => setStep("world")}>Bắt đầu câu chuyện <ArrowRight size={18}/></button></section>}

    {step === "world" && <section className="onboarding-story world-intro"><button className="story-back" onClick={back}><ArrowLeft size={17}/> Quay lại</button><div className="story-visual"><Image src={story.image} alt={`Bản đồ ${story.title}`} fill sizes="55vw" priority/><div className="story-visual-shade"/><span className="story-map-badge"><Map size={15}/> {assignedLevel.level} · Lớp {grade}</span><div className="story-location-trail">{story.places.map((place, index) => <span key={place}><i>{index + 1}</i><b>{place}</b></span>)}</div></div><div className="story-copy"><span className="story-kicker"><Sparkles size={15}/> CHƯƠNG 1 · LỜI MỜI PHIÊU LƯU</span><h1>{name} ơi, một thế giới đang chờ em!</h1><p>Ở <b>{story.title}</b>, mỗi bài tiếng Anh là một thử thách giúp em băng qua địa điểm mới và {story.mission}.</p><div className="story-rule-cards"><span><BookOpen size={21}/><b>Học một bài ngắn</b><small>Khám phá từ, câu, nghe và nói</small></span><span><Map size={21}/><b>Tiến thêm trên bản đồ</b><small>Mỗi Unit mở một vùng đất mới</small></span></div><button className="story-primary" onClick={() => setStep("companion")}>Nhận lời phiêu lưu <ArrowRight size={18}/></button></div></section>}

    {step === "companion" && <section className="onboarding-story companion-intro"><button className="story-back" onClick={back}><ArrowLeft size={17}/> Quay lại</button><div className="companion-meet-copy"><span className="story-kicker"><Heart size={15}/> CHƯƠNG 2 · NGƯỜI BẠN ĐẦU TIÊN</span><h1>Không ai phải phiêu lưu một mình</h1><p>Sói Con sẽ nhắc em học, cùng vượt thử thách và lớn lên sau mỗi chặng đường.</p><label><span>Em muốn gọi bạn ấy là gì?</span><div><input value={companionName} onChange={event => setCompanionName(event.target.value)} maxLength={14}/><Sparkles size={18}/></div></label><button className="story-primary" disabled={!companionName.trim()} onClick={() => setStep("keys")}>Chào {companionName || "Sói Con"}! <ArrowRight size={18}/></button></div><div className="companion-meet-stage"><span className="companion-halo"/><Image src="/starter-wolf.png" alt="Sói Con, người bạn đồng hành đầu tiên" width={440} height={560}/><div className="companion-speech"><b>Xin chào {name}!</b><small>Từ hôm nay, chúng mình là một đội nhé!</small></div><div className="companion-name-tag"><span>NGƯỜI BẠN ĐỒNG HÀNH</span><b>{companionName || "Sói Con"}</b></div></div></section>}

    {step === "keys" && <section className="onboarding-story reward-intro"><button className="story-back" onClick={back}><ArrowLeft size={17}/> Quay lại</button><div className="reward-story-copy"><span className="story-kicker"><KeyRound size={15}/> CHƯƠNG 3 · CHÌA KHÓA KỲ VẬT</span><h1>Học đủ bài, mở quà lớn!</h1><p>Mỗi Unit có 4 Lesson. Hoàn thành từng Lesson để ghép đủ chìa khóa và mở Túi Kỳ Vật cuối Unit.</p><div className="key-lesson-row">{[1,2,3,4].map(number => <span key={number}><i><KeyRound size={20}/></i><b>Lesson {number}</b><small>1 mảnh chìa khóa</small></span>)}</div><div className="unit-reward-story"><span className="reward-plus">4 mảnh</span><ArrowRight size={24}/><span className="reward-bag">🎁</span><div><b>Mở Túi Kỳ Vật</b><small>Nhận đồ ăn, đồ chơi hoặc phụ kiện cho thú</small></div></div><div className="chest-story"><Image src="/pet-reward-chest.png" alt="Rương linh vật" width={130} height={110}/><span><b>Cuối Level còn có Rương Linh Vật</b><small>Hoàn thành hành trình để mở khóa một người bạn mới.</small></span></div><button className="story-primary" onClick={() => setStep("rewards")}>Hiểu rồi, tiếp tục <ArrowRight size={18}/></button></div></section>}

    {step === "rewards" && <section className="onboarding-story loop-intro"><button className="story-back" onClick={back}><ArrowLeft size={17}/> Quay lại</button><div className="loop-story-copy"><span className="story-kicker"><Coins size={15}/> CHƯƠNG 4 · CÙNG NHAU TRƯỞNG THÀNH</span><h1>Học, ôn và chăm sóc bạn đồng hành</h1><p>Sau khi học xong Unit, em có thể quay lại trạm ôn tập để luyện từ vựng, ngữ pháp, nghe và nhận Xu chăm sóc.</p><div className="gameplay-loop"><span><i>📚</i><b>Học Unit</b><small>Thu thập chìa khóa</small></span><ArrowRight/><span><i>🧠</i><b>Ôn tập</b><small>Nhận Xu</small></span><ArrowRight/><span><i>🐺</i><b>Vào Khu Vườn</b><small>Cho ăn, chơi và trang trí</small></span></div><div className="loop-promise"><Gift size={24}/><span><b>Càng học, đội của em càng lớn mạnh</b><small>Mỗi linh vật mới sẽ có hoạt động và bộ sưu tập riêng.</small></span></div><button className="story-primary final" disabled={!companionName.trim()} onClick={() => onComplete("onboarding", assignedLevel.journeyId, companionName.trim(), name.trim())}>Thẳng tiến tới {story.title} <ArrowRight size={18}/></button></div><div className="loop-characters"><Image className="loop-wolf" src="/starter-wolf.png" alt={companionName} width={330} height={420}/><div className="loop-coins"><Coins size={22}/><b>Xu chăm sóc</b></div><div className="loop-bubble"><b>{companionName} đã sẵn sàng!</b><small>Cùng bắt đầu Unit đầu tiên thôi!</small></div></div></section>}

    {step === "pricing" && <section className="pricing-wrap">
      <div className="pricing-hero">
        <div className="pricing-heading"><button className="panel-back" onClick={canExit ? onExit : back}><ArrowLeft size={17}/> {canExit ? "Về bản đồ" : "Quay lại"}</button><span className="access-kicker"><Crown size={15}/> MỞ KHÓA HÀNH TRÌNH</span><h1>{trialCompleted ? "Bé đã sẵn sàng đi tiếp?" : "Học thử trước khi quyết định"}</h1></div>
        <div className="pricing-world"><Image src={story.image} alt={`Bản đồ ${story.title}`} fill sizes="440px"/><span><small>HÀNH TRÌNH ĐANG HỌC</small><b>{story.title}</b><em>{assignedLevel.level} · {assignedLevel.units} Unit</em></span></div>
      </div>
      <div className="plan-grid">{plans.map(item => { const Icon = item.Icon; return <button key={item.id} className={`plan-card plan-${item.id} ${plan === item.id ? "selected" : ""}`} onClick={() => setPlan(item.id)}><span className="plan-badge">{item.badge}</span><span className="plan-icon"><Icon size={24}/></span><h2>{item.name}</h2><b>{item.price}</b><small>{item.note}</small><p>{item.detail}</p><span className="plan-benefit"><Check size={15}/>{item.benefit}</span><em>{plan === item.id ? <><Check size={15}/> Đang chọn</> : "Chọn gói"}</em></button>})}</div>
      <ReferralProgram variant="pricing" />
      <div className="pricing-footer"><div className="upgrade-credit"><Sparkles size={20}/><span><b>Nâng cấp sau không bị tính lại</b><small>Số tiền đã mua nội dung được trừ khi gia đình nâng lên gói lớn hơn.</small></span></div><div className="pricing-trust"><span><ShieldCheck/> Phụ huynh xác nhận</span><span><Coins/> Không bán vật phẩm</span><span><Check/> Lưu theo tài khoản</span></div><button className="access-primary pricing-next" onClick={() => setStep("checkout")}>Tiếp tục với {selectedPlan.name} · {selectedPlan.price} <ArrowRight size={18}/></button><button className="pricing-later" onClick={canExit ? onExit : back}>Để sau, bé ôn lại bài đã học</button></div>
    </section>}

    {step === "checkout" && <section className="checkout-wrap"><button className="panel-back" onClick={back}><ArrowLeft size={17}/> Chọn lại gói</button><div className="checkout-grid"><div className="checkout-main"><span className="panel-icon mint"><ShieldCheck/></span><h1>Phụ huynh xác nhận thanh toán</h1><p>Đây là màn mô phỏng. Không có giao dịch thật được tạo.</p><div className="payment-methods"><button className="selected"><span>💳</span><div><b>Thẻ ngân hàng</b><small>Visa · Mastercard · Napas</small></div><Check size={18}/></button><button><span>📱</span><div><b>Ví điện tử / QR</b><small>Quét mã để thanh toán</small></div></button><button><span>🏦</span><div><b>Chuyển khoản</b><small>Kích hoạt sau khi xác nhận</small></div></button></div><label className="parent-confirm"><input type="checkbox" defaultChecked/><span>Tôi là phụ huynh/người giám hộ và đồng ý với điều khoản sử dụng.</span></label><button className="access-primary wide" onClick={() => setStep("success")}>Xác nhận bản demo · {selectedPlan.price} <ArrowRight size={18}/></button><small className="demo-note">Không yêu cầu nhập số thẻ trong phiên bản demo.</small></div><aside className="order-summary"><span>TÓM TẮT ĐƠN HÀNG</span><div className="order-plan"><strong><SelectedPlanIcon size={27}/></strong><div><b>{selectedPlan.name}</b><small>{selectedPlan.detail}</small></div></div><div className="order-row"><span>Tạm tính</span><b>{selectedPlan.price}</b></div><div className="order-row"><span>Bù trừ gói đã mua</span><b>0đ</b></div><small className="credit-note">Nếu đã mua nội dung trước đó, hệ thống thật sẽ tự động trừ vào số tiền cần thanh toán.</small><div className="order-total"><span>Tổng thanh toán</span><b>{selectedPlan.price}</b></div><p><LockKeyhole size={14}/> Thông tin thanh toán được bảo vệ.</p></aside></div></section>}

    {step === "success" && <section className="access-panel success-panel"><div className="success-burst"><Check size={48}/></div><span className="access-kicker">MỞ KHÓA THÀNH CÔNG</span><h1>Hành trình của {name} đã sẵn sàng!</h1><p><b>{selectedPlan.name}</b> đã được kích hoạt trong bản demo.</p><div className="success-details"><span><SelectedPlanIcon size={28}/></span><div><b>{selectedPlan.name}</b><small>{selectedPlan.detail}</small></div></div><button className="access-primary wide" onClick={() => onComplete(selectedPlan.id, assignedLevel.journeyId)}>Tiếp tục học tại {story.title} <ArrowRight size={18}/></button><small className="demo-note">Biên nhận và quyền học sẽ được lưu trong tài khoản phụ huynh ở sản phẩm thật.</small></section>}
  </main>;
}
