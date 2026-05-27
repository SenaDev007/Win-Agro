"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Play, Pause } from "lucide-react";

export interface Testimonial {
  text: string;
  highlight?: string;
  image: string;
  name: string;
  role: string;
  audioUrl?: string | null;
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
  speed?: number; // Duration in seconds for one full scroll
  direction?: "left" | "right"; // Scroll direction
  cardHeight?: number; // Height of the testimonial card
  className?: string;
}

export const TestimonialsCarousel: React.FC<TestimonialsCarouselProps> = ({
  testimonials,
  speed = 35,
  direction = "left",
  cardHeight = 220,
  className,
}) => {
  const loopTestimonials = [...testimonials, ...testimonials, ...testimonials];

  // Global audio states for this carousel
  const [activeUrl, setActiveUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Mobile touch pause states
  const [touchPaused, setTouchPaused] = useState(false);
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTouchStart = () => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    setTouchPaused(true);
  };

  const handleTouchEnd = () => {
    touchTimeoutRef.current = setTimeout(() => {
      setTouchPaused(false);
    }, 2500);
  };

  const handleCardPlayToggle = (url: string) => {
    if (!audioRef.current) return;

    audioRef.current.volume = 1.0;

    // Use our audio proxy to avoid cross-origin blocking
    const proxiedUrl = url.startsWith("https://")
      ? `/api/audio?src=${encodeURIComponent(url)}`
      : url;

    if (activeUrl === url) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(err => {
          console.error("Audio playback error:", err);
          setIsPlaying(false);
        });
        setIsPlaying(true);
      }
    } else {
      audioRef.current.src = proxiedUrl;
      audioRef.current.load();
      audioRef.current.play().catch(err => {
        console.error("Audio playback error:", err);
        setIsPlaying(false);
      });
      setActiveUrl(url);
      setIsPlaying(true);
      setProgress(0);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const pct = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(isNaN(pct) ? 0 : pct);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    setActiveUrl(null);
  };

  useEffect(() => {
    return () => {
      if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    };
  }, []);

  const isPaused = touchPaused || isPlaying;

  return (
    <div className={`overflow-hidden w-full ${className}`}>
      {/* Single root-level HTML5 Audio tag to prevent duplicate audio elements/mobile sound blocking */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        className="hidden"
        preload="auto"
      />

      <div
        className={`flex gap-6 w-max ${direction === "left" ? "animate-marquee-left" : "animate-marquee-right"} hover:[animation-play-state:paused] pointer-events-auto`}
        style={isPaused ? { animationPlayState: "paused" } : undefined}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {loopTestimonials.map(({ text, highlight, image, name, role, audioUrl }, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.03, y: -4, borderColor: "rgba(9, 137, 71, 0.3)" }}
            className="bg-white border border-primary-pale/60 shadow-md rounded-3xl p-6 flex flex-col justify-between flex-shrink-0 w-[340px] transition-colors duration-200 cursor-default card-shimmer"
            style={{ height: cardHeight }}
          >
            <p className="text-[13.5px] leading-relaxed text-gray-text font-sans break-words whitespace-normal overflow-hidden italic">
              {highlight
                ? text.split(highlight).map((part, idx, arr) => (
                    <React.Fragment key={idx}>
                      {part}
                      {idx !== arr.length - 1 && (
                        <span className="text-primary-deep font-bold bg-primary-pale/50 px-1.5 py-0.5 rounded-md border border-primary-green/15 shadow-sm not-italic">
                          {highlight}
                        </span>
                      )}
                    </React.Fragment>
                  ))
                : text}
            </p>

            {audioUrl && (
              <div className="flex items-center gap-2 bg-primary-pale border border-primary-green/10 rounded-full px-2.5 py-1 w-full mt-2 transition-all">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardPlayToggle(audioUrl);
                  }}
                  className="w-6 h-6 rounded-full bg-primary-green text-white flex items-center justify-center hover:scale-105 transition-all shrink-0 cursor-pointer shadow-sm"
                >
                  {activeUrl === audioUrl && isPlaying ? (
                    <Pause className="w-3 h-3 fill-white" />
                  ) : (
                    <Play className="w-3 h-3 fill-white ml-0.5" />
                  )}
                </button>
                
                <div className="flex-grow flex flex-col justify-center min-w-0">
                  <div className="h-1 w-full bg-primary-green/15 rounded-full overflow-hidden relative">
                    <div 
                      className="h-full bg-primary-green rounded-full transition-all duration-100" 
                      style={{ width: `${activeUrl === audioUrl ? progress : 0}%` }} 
                    />
                  </div>
                  <span className="text-[8px] text-primary-green/70 font-semibold uppercase tracking-wider font-sans mt-0.5 truncate">
                    {activeUrl === audioUrl && isPlaying ? "Lecture note vocale..." : "Écouter le témoignage oral"}
                  </span>
                </div>

                {activeUrl === audioUrl && isPlaying && (
                  <div className="flex items-center gap-0.5 shrink-0 px-1">
                    <span className="w-0.5 h-1.5 bg-primary-green rounded-full animate-bounce" style={{ animationDelay: "0ms", animationDuration: "0.6s" }} />
                    <span className="w-0.5 h-3 bg-primary-green rounded-full animate-bounce" style={{ animationDelay: "150ms", animationDuration: "0.6s" }} />
                    <span className="w-0.5 h-2 bg-primary-green rounded-full animate-bounce" style={{ animationDelay: "300ms", animationDuration: "0.6s" }} />
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-primary-pale/40">
              <Image
                src={image}
                alt={name}
                width={44}
                height={44}
                className="h-11 w-11 rounded-full object-cover border border-primary-green/20"
              />
              <div className="flex flex-col">
                <div className="font-serif font-bold text-primary-deep text-sm leading-tight">{name}</div>
                <div className="text-primary-green/80 font-sans font-semibold text-xs mt-0.5">{role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
