"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

export interface Testimonial {
  text: string;
  highlight?: string;
  image: string;
  name: string;
  role: string;
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
  speed = 20,
  direction = "left",
  cardHeight = 220,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [carouselWidth, setCarouselWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setCarouselWidth(containerRef.current.scrollWidth / 2);
    }
  }, [testimonials]);

  const loopTestimonials = [...testimonials, ...testimonials];

  return (
    <div className={`overflow-hidden w-full ${className}`} ref={containerRef}>
      <motion.div
        animate={{
          x:
            direction === "left"
              ? [0, -carouselWidth]
              : [-carouselWidth, 0],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex gap-6 w-max"
      >
        {loopTestimonials.map(({ text, highlight, image, name, role }, index) => (
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

            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-primary-pale/40">
              <img
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
      </motion.div>
    </div>
  );
};
