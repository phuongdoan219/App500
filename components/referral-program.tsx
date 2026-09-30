"use client";

import { useEffect, useId, useState } from "react";
import { ArrowRight, Check, Copy, Gift, Share2, Ticket, UserPlus, X } from "lucide-react";

type ReferralProgramProps = {
  variant?: "floating" | "pricing";
};

export default function ReferralProgram({ variant = "floating" }: ReferralProgramProps) {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const titleId = useId();
  const referralCode = "EW-BANMOI";
  const referralLink = `https://app500-psi.vercel.app/?ref=${referralCode}`;

  const copyInvite = async () => {
    await navigator.clipboard.writeText(referralLink);
    setFeedback("Đã sao chép link mời!");
  };

  const shareInvite = async () => {
    const shareData = {
      title: "Cùng học English in Wonderland",
      text: "Mời bạn học English in Wonderland cùng mình. Hoàn thành Lesson 1 · Unit 1 để cả hai cùng nhận thêm cơ hội học!",
      url: referralLink,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setFeedback("Đã mở ứng dụng chia sẻ.");
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    await copyInvite();
  };

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return <>
    {variant === "floating" ? (
      <button
        type="button"
        className="referral-fab"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
      >
        <span><UserPlus size={20}/></span>
        <span><b>Mời bạn bè</b><small>Nhận 1 Unit miễn phí</small></span>
      </button>
    ) : (
      <button
        type="button"
        className="referral-pricing-option"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
      >
        <span className="referral-pricing-icon"><Ticket size={24}/></span>
        <span className="referral-pricing-copy">
          <small>LỰA CHỌN 0Đ</small>
          <b>Mời bạn học cùng · Mở miễn phí 1 Unit</b>
          <em>Bạn mới hoàn thành Lesson 1 · Unit 1, tài khoản của bạn nhận ngay 1 Unit tiếp theo.</em>
        </span>
        <span className="referral-pricing-action">Xem cách nhận <ArrowRight size={16}/></span>
      </button>
    )}

    {open && <div className="referral-modal" role="presentation" onMouseDown={() => setOpen(false)}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={event => event.stopPropagation()}
      >
        <button type="button" className="referral-modal-close" onClick={() => setOpen(false)} aria-label="Đóng thông tin giới thiệu bạn bè"><X size={18}/></button>
        <span className="referral-modal-icon"><Gift size={28}/></span>
        <small>GIỚI THIỆU BẠN BÈ</small>
        <h2 id={titleId}>Mời bạn học cùng, nhận 1 Unit miễn phí</h2>
        <p>Chia sẻ English in Wonderland với một người bạn mới. Khi bạn ấy hoàn thành bài học đầu tiên, Unit tiếp theo sẽ được mở cho tài khoản của bạn.</p>
        <div className="referral-steps">
          <span><i>1</i><b>Gửi lời mời</b><small>Chia sẻ link hoặc mã giới thiệu cá nhân.</small></span>
          <span><i>2</i><b>Bạn mới bắt đầu học</b><small>Tải ứng dụng và hoàn thành Lesson 1 · Unit 1.</small></span>
          <span><i>3</i><b>Nhận phần thưởng</b><small>Bạn được mở miễn phí 1 Unit tiếp theo.</small></span>
        </div>
        <div className="referral-rule"><Check size={16}/><span><b>Không cần thanh toán</b><small>Phần thưởng được cộng sau khi hệ thống xác nhận người bạn mới đủ điều kiện.</small></span></div>
        <div className="referral-invite-box">
          <span><small>LINK GIỚI THIỆU CỦA BẠN</small><b>{referralCode}</b></span>
          <div><input value={referralLink} readOnly aria-label="Liên kết giới thiệu"/><button type="button" onClick={copyInvite} aria-label="Sao chép liên kết giới thiệu"><Copy size={17}/></button></div>
        </div>
        {feedback && <p className="referral-feedback" role="status"><Check size={15}/>{feedback}</p>}
        <div className="referral-modal-actions">
          <button type="button" className="referral-modal-copy" onClick={copyInvite}><Copy size={17}/> Sao chép link</button>
          <button type="button" className="referral-modal-primary" onClick={shareInvite}><Share2 size={17}/> Chia sẻ lời mời</button>
        </div>
      </section>
    </div>}
  </>;
}
