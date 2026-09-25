"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Camera, Check, Download, Mic, Play, RotateCcw, Square, Video, Volume2 } from "lucide-react";
import { WRONG_BAG_VIDEO_URL } from "@/lib/lesson-content";

const cues = [
  { who: "Tom", text: "The boy is carrying a yellow bag.", vi: "Cậu bé đang mang một chiếc túi màu vàng.", tone: "Nhấn rõ yellow bag", at: 0 },
  { who: "Tom", text: "The child is standing near the chair.", vi: "Đứa trẻ đang đứng gần chiếc ghế.", tone: "Giữ nhịp đều ở standing near", at: 4.5 },
  { who: "Tom", text: "The man is fat and has a beard.", vi: "Người đàn ông mập và có râu.", tone: "Nối âm nhẹ ở has a", at: 9 },
];

type Props = {
  support: string;
  setSupport: (value: string) => void;
  showMeaning: boolean;
  setShowMeaning: (value: boolean) => void;
  finish: () => void;
};

function speak(text: string, rate = 0.82) {
  window.speechSynthesis.cancel();
  const voice = new SpeechSynthesisUtterance(text);
  voice.lang = "en-US";
  voice.rate = rate;
  voice.pitch = 1.06;
  window.speechSynthesis.speak(voice);
}

export default function VoiceLabCamera({ support, setSupport, showMeaning, setShowMeaning, finish }: Props) {
  const [cameraOn, setCameraOn] = useState(false);
  const [recording, setRecording] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [activeCue, setActiveCue] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [takeUrl, setTakeUrl] = useState("");
  const [saved, setSaved] = useState(false);
  const [permissionError, setPermissionError] = useState("");
  const previewRef = useRef<HTMLVideoElement | null>(null);
  const storyVideoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const compositeStreamRef = useRef<MediaStream | null>(null);
  const renderFrameRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutsRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  function clearTimeline() {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }

  useEffect(() => () => {
    clearTimeline();
    if (renderFrameRef.current) cancelAnimationFrame(renderFrameRef.current);
    compositeStreamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current?.getTracks().forEach(track => track.stop());
    window.speechSynthesis?.cancel();
  }, []);

  function roundedRect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
    const r = Math.min(radius, width / 2, height / 2);
    context.beginPath();
    context.moveTo(x + r, y);
    context.arcTo(x + width, y, x + width, y + height, r);
    context.arcTo(x + width, y + height, x, y + height, r);
    context.arcTo(x, y + height, x, y, r);
    context.arcTo(x, y, x + width, y, r);
    context.closePath();
  }

  function drawCover(context: CanvasRenderingContext2D, video: HTMLVideoElement, x: number, y: number, width: number, height: number) {
    const sourceWidth = video.videoWidth || width;
    const sourceHeight = video.videoHeight || height;
    const scale = Math.max(width / sourceWidth, height / sourceHeight);
    const cropWidth = width / scale;
    const cropHeight = height / scale;
    const sourceX = (sourceWidth - cropWidth) / 2;
    const sourceY = (sourceHeight - cropHeight) / 2;
    context.drawImage(video, sourceX, sourceY, cropWidth, cropHeight, x, y, width, height);
  }

  function createCompositeStream(cameraStream: MediaStream) {
    const storyVideo = storyVideoRef.current;
    const cameraVideo = previewRef.current;
    if (!storyVideo || !cameraVideo) return null;

    const canvas = document.createElement("canvas");
    canvas.width = 1280;
    canvas.height = 720;
    const context = canvas.getContext("2d");
    if (!context) return null;

    const renderFrame = () => {
      context.fillStyle = "#111827";
      context.fillRect(0, 0, canvas.width, canvas.height);
      try {
        if (storyVideo.readyState >= 2) drawCover(context, storyVideo, 0, 0, canvas.width, canvas.height);
      } catch {
        context.fillStyle = "#111827";
        context.fillRect(0, 0, canvas.width, canvas.height);
      }

      const pipWidth = 270;
      const pipHeight = 180;
      const pipX = canvas.width - pipWidth - 32;
      const pipY = canvas.height - pipHeight - 175;
      context.save();
      roundedRect(context, pipX, pipY, pipWidth, pipHeight, 24);
      context.clip();
      context.translate(pipX + pipWidth, pipY);
      context.scale(-1, 1);
      if (cameraVideo.readyState >= 2) drawCover(context, cameraVideo, 0, 0, pipWidth, pipHeight);
      context.restore();
      context.lineWidth = 6;
      context.strokeStyle = "#ffffff";
      roundedRect(context, pipX, pipY, pipWidth, pipHeight, 24);
      context.stroke();

      context.fillStyle = "rgba(17,24,39,.86)";
      roundedRect(context, 28, 24, 205, 48, 24);
      context.fill();
      context.fillStyle = "#ffffff";
      context.font = "700 20px Arial, sans-serif";
      context.fillText("▶  VIDEO TIẾNG ANH", 49, 55);

      context.fillStyle = "rgba(239,68,68,.94)";
      roundedRect(context, canvas.width - 145, 24, 117, 48, 24);
      context.fill();
      context.fillStyle = "#ffffff";
      context.font = "700 20px Arial, sans-serif";
      context.fillText("● REC", canvas.width - 119, 55);

      context.fillStyle = "rgba(17,24,39,.88)";
      roundedRect(context, pipX + 12, pipY + pipHeight - 38, 160, 27, 10);
      context.fill();
      context.fillStyle = "#ffffff";
      context.font = "700 14px Arial, sans-serif";
      context.fillText("CAMERA CỦA EM", pipX + 24, pipY + pipHeight - 19);

      if (support !== "none") {
        const time = storyVideo.currentTime;
        const cueIndex = time >= cues[2].at ? 2 : time >= cues[1].at ? 1 : 0;
        const currentCue = cues[cueIndex];
        const boxWidth = 690;
        const boxHeight = showMeaning ? 96 : 64;
        const boxX = (canvas.width - boxWidth) / 2;
        const boxY = canvas.height - boxHeight - 34;
        context.fillStyle = "rgba(17,24,39,.88)";
        roundedRect(context, boxX, boxY, boxWidth, boxHeight, 18);
        context.fill();
        context.fillStyle = "#ffffff";
        context.textAlign = "center";
        context.font = "700 27px Arial, sans-serif";
        context.fillText(`${currentCue.who}: ${currentCue.text}`, canvas.width / 2, boxY + 40);
        if (showMeaning) {
          context.font = "18px Arial, sans-serif";
          context.fillStyle = "#e5e7eb";
          context.fillText(currentCue.vi, canvas.width / 2, boxY + 72);
        }
        context.textAlign = "start";
      }

      renderFrameRef.current = requestAnimationFrame(renderFrame);
    };
    renderFrame();

    const compositeStream = canvas.captureStream(30);
    cameraStream.getAudioTracks().forEach(track => compositeStream.addTrack(track.clone()));
    compositeStreamRef.current = compositeStream;
    return compositeStream;
  }

  async function enableCamera() {
    if (streamRef.current?.active) return streamRef.current;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 960 }, height: { ideal: 540 } },
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      streamRef.current = stream;
      if (previewRef.current) {
        previewRef.current.srcObject = stream;
        await previewRef.current.play();
      }
      setCameraOn(true);
      setPermissionError("");
      return stream;
    } catch {
      setPermissionError("Hãy cho phép dùng camera và micro để bắt đầu lồng tiếng.");
      return null;
    }
  }

  function disableCamera() {
    if (recording) return;
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    if (previewRef.current) previewRef.current.srcObject = null;
    setCameraOn(false);
  }

  function queueTimeline(withVoice: boolean) {
    clearTimeline();
    setActiveCue(0);
    setPlaying(true);
    cues.forEach((cue, index) => {
      const timeout = setTimeout(() => {
        setActiveCue(index);
        if (withVoice) speak(cue.text, 0.82);
      }, cue.at * 1000);
      timeoutsRef.current.push(timeout);
    });
    timeoutsRef.current.push(setTimeout(() => setPlaying(false), 13500));
  }

  function playEnglishVideo() {
    if (recording) return;
    const video = storyVideoRef.current;
    if (!video) return;
    clearTimeline();
    video.currentTime = 0;
    video.muted = false;
    video.volume = 1;
    video.play();
    setPlaying(true);
  }

  function syncCue() {
    const time = storyVideoRef.current?.currentTime ?? 0;
    if (time >= cues[2].at) setActiveCue(2);
    else if (time >= cues[1].at) setActiveCue(1);
    else setActiveCue(0);
  }

  async function startDubbing() {
    const stream = await enableCamera();
    if (!stream) return;
    if (takeUrl) URL.revokeObjectURL(takeUrl);
    setTakeUrl("");
    setSaved(false);
    setCountdown(3);
    for (let value = 3; value > 0; value -= 1) {
      setCountdown(value);
      await new Promise(resolve => setTimeout(resolve, 700));
    }
    setCountdown(0);

    const compositeStream = createCompositeStream(stream);
    if (!compositeStream) {
      setPermissionError("Không thể tạo bản ghi tổng hợp. Hãy tải lại trang và thử lại.");
      return;
    }
    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus") ? "video/webm;codecs=vp9,opus" : MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus") ? "video/webm;codecs=vp8,opus" : "video/webm";
    const chunks: Blob[] = [];
    const recorder = new MediaRecorder(compositeStream, { mimeType, videoBitsPerSecond: 5_000_000 });
    recorderRef.current = recorder;
    recorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
    recorder.onstop = () => {
      if (renderFrameRef.current) cancelAnimationFrame(renderFrameRef.current);
      renderFrameRef.current = null;
      compositeStreamRef.current?.getTracks().forEach(track => track.stop());
      compositeStreamRef.current = null;
      const blob = new Blob(chunks, { type: mimeType });
      setTakeUrl(URL.createObjectURL(blob));
      setRecording(false);
      setPlaying(false);
      clearTimeline();
    };
    recorder.start(250);
    setSeconds(0);
    setRecording(true);
    const storyVideo = storyVideoRef.current;
    if (storyVideo) {
      storyVideo.currentTime = 0;
      storyVideo.muted = support !== "model";
      storyVideo.volume = support === "model" ? 0.18 : 1;
      storyVideo.play();
    }
    setPlaying(true);
    timerRef.current = setInterval(() => setSeconds(value => value + 1), 1000);
    timeoutsRef.current.push(setTimeout(stopDubbing, 120000));
  }

  function stopDubbing() {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    storyVideoRef.current?.pause();
    window.speechSynthesis.cancel();
    setRecording(false);
  }

  function saveTake() {
    if (!takeUrl) return;
    const link = document.createElement("a");
    link.href = takeUrl;
    link.download = "vuihoc-wrong-bag-dubbing-" + new Date().toISOString().replace(/[:.]/g, "-") + ".webm";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setSaved(true);
    finish();
  }

  const cue = cues[activeCue];

  return <div className="voice-shell camera-lab">
    <div className="voice-head">
      <div><span className="pill pill-purple"><Video size={14} /> LỒNG TIẾNG VIDEO</span><h2>Em là nhân vật trong câu chuyện</h2><p>Xem bản tiếng Anh trước, sau đó bật camera và tự đọc lời thoại theo video.</p></div>
      <div className={"privacy " + (cameraOn ? "camera-active" : "")}><span>●</span> {cameraOn ? "Camera đang bật" : "Camera chỉ bật khi em cho phép"}</div>
    </div>

    <div className="dub-steps"><span className="done"><Check size={14} /> 1. Nghe mẫu</span><span className={cameraOn ? "done" : "active"}>2. Bật camera</span><span className={recording || takeUrl ? "done" : ""}>3. Thu lồng tiếng</span><span className={takeUrl ? "active" : ""}>4. Xem lại</span></div>

    <div className="voice-grid">
      <section className={"scene-panel dub-video " + (playing ? "is-playing" : "") + (recording ? " is-recording" : "")}>
        <video ref={storyVideoRef} className="source-video" crossOrigin="anonymous" src={WRONG_BAG_VIDEO_URL} playsInline preload="metadata" onTimeUpdate={syncCue} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => { setPlaying(false); if (recording) stopDubbing(); }} />
        <div className="video-topline"><span className="english-video-label"><Play size={13} fill="currentColor" /> VIDEO TIẾNG ANH</span>{recording && <span className="rec-label">● REC {seconds}s</span>}</div>
        <div className={"camera-pip " + (cameraOn ? "on" : "off")}>
          <video ref={previewRef} muted playsInline />
          {!cameraOn && <button onClick={enableCamera}><Camera size={22} /><span>Bật camera trước</span></button>}
          {cameraOn && !recording && <button className="camera-off" onClick={disableCamera}>Tắt</button>}
          {cameraOn && <small>CAMERA CỦA EM</small>}
        </div>
        {countdown > 0 && <div className="countdown"><b>{countdown}</b><span>Chuẩn bị nhập vai!</span></div>}
        {!playing && !recording && !countdown && <button className="video-play-main" onClick={playEnglishVideo}><Play fill="currentColor" /><span>Xem video tiếng Anh</span></button>}
        {(playing || recording) && support !== "none" && <div className="line-overlay"><span><b>{cue.who}:</b> {cue.text}</span>{showMeaning && <small>{cue.vi}</small>}</div>}
        <div className="video-progress"><i style={{ width: ((activeCue + 1) / cues.length * 100) + "%" }} /></div>
      </section>

      <section className="coach-panel dub-coach">
        <div className="coach-title"><span className="coach-avatar">AI</span><div><b>Luyện trước khi thu</b><small>{cue.tone}</small></div></div>
        <button className="model-button" onClick={() => speak(cue.text, .72)}><span><Volume2 size={22} /></span><div><b>Nghe câu hiện tại</b><small>Chậm và rõ ngữ điệu</small></div><Play size={18} fill="currentColor" /></button>
        <div className="cue-list">{cues.map((item, index) => <button key={item.text} className={activeCue === index ? "active" : ""} onClick={() => { setActiveCue(index); speak(item.text, .72); }}><span>{index + 1}</span><div><b>{item.who}</b><small>{item.text}</small></div><Volume2 size={15} /></button>)}</div>
        <label className="switch-line"><span>Hiện nghĩa tiếng Việt</span><input type="checkbox" checked={showMeaning} onChange={event => setShowMeaning(event.target.checked)} /></label>
        <div className="support"><span>Trợ giúp khi video chạy</span><div>{[["model","Phụ đề + giọng nhỏ"],["captions","Chỉ phụ đề"],["none","Không trợ giúp"]].map(item => <button key={item[0]} className={support === item[0] ? "active" : ""} onClick={() => setSupport(item[0])}>{item[1]}</button>)}</div></div>
        {permissionError && <div className="camera-error">{permissionError}</div>}
        <button className={"record-button video-record " + (recording ? "recording" : "")} onClick={recording ? stopDubbing : startDubbing}>{recording ? <Square fill="currentColor" /> : <Camera />}<span><b>{recording ? "Đang thu hình và tiếng... " + seconds + "s" : cameraOn ? "Bắt đầu lồng tiếng" : "Bật camera & bắt đầu"}</b><small>{recording ? "Video sẽ tự dừng sau đoạn thoại" : "Camera trước + micro · khoảng 14 giây"}</small></span></button>
        {takeUrl && <div className="video-take"><div><b>Bản lồng tiếng của em</b><span>Video hoạt hình, camera và giọng của em đã được ghép cùng nhau</span></div><video src={takeUrl} controls playsInline /><button onClick={startDubbing}><RotateCcw size={16} /> Thu lại</button></div>}
        {saved && <div className="save-success"><Check size={18} /><span><b>Đã lưu về máy!</b> Em có thể mở file trong thư mục Downloads.</span></div>}
        <button className="primary wide" disabled={!takeUrl} onClick={saveTake}>{saved ? "Tải lại bản lồng tiếng" : "Lưu bản lồng tiếng"} {saved ? <Download size={18} /> : <ArrowRight size={18} />}</button>
      </section>
    </div>
  </div>;
}
