"use client";

import { Play, Timer } from "lucide-react";
import { WRONG_BAG_VIDEO_URL } from "@/lib/lesson-content";
import "./lesson-preview-video.css";

type LessonPreviewVideoProps = {
  lesson: 2 | 3;
  title: string;
  description: string;
};

export default function LessonPreviewVideo({ lesson, title, description }: LessonPreviewVideoProps) {
  return <section className="lesson-preview-video" aria-label={`Video bài mới Lesson ${lesson}`}>
    <header>
      <div>
        <span><Play size={12} fill="currentColor" /> VIDEO BÀI MỚI · LESSON {lesson}</span>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <small><Timer size={14} /> Clip mục tiêu 30–40 giây</small>
    </header>
    <div className="lesson-preview-frame">
      <video src={WRONG_BAG_VIDEO_URL} controls playsInline preload="metadata" crossOrigin="anonymous" />
      <span>BẢN DEMO · VIDEO THE WRONG BAG</span>
    </div>
  </section>;
}
