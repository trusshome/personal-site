'use client';

import React, { useState, useEffect, useRef, useCallback, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface GalleryItem {
  title: string;
  subtitle: string;
  label?: string;
  photo: {
    url: string;
    alt: string;
    pos?: string;
  };
  href?: string;
}

interface CircularGalleryProps extends HTMLAttributes<HTMLDivElement> {
  items: GalleryItem[];
  radius?: number;
  autoRotateSpeed?: number;
}

const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  ({ items, className, radius = 480, autoRotateSpeed = 0.03, ...props }, ref) => {
    const [rotation, setRotation] = useState(0);
    const isInteracting = useRef(false);
    const interactTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const lastPointerX = useRef(0);
    const isDragging = useRef(false);

    // Auto-rotate when not interacting
    useEffect(() => {
      const tick = () => {
        if (!isInteracting.current) {
          setRotation((prev) => prev + autoRotateSpeed);
        }
        animationFrameRef.current = requestAnimationFrame(tick);
      };
      animationFrameRef.current = requestAnimationFrame(tick);
      return () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      };
    }, [autoRotateSpeed]);

    const pauseAutoRotate = useCallback(() => {
      isInteracting.current = true;
      if (interactTimeoutRef.current) clearTimeout(interactTimeoutRef.current);
    }, []);

    const resumeAutoRotate = useCallback((delayMs = 800) => {
      if (interactTimeoutRef.current) clearTimeout(interactTimeoutRef.current);
      interactTimeoutRef.current = setTimeout(() => {
        isInteracting.current = false;
      }, delayMs);
    }, []);

    // Wheel — spin the ring in place
    const onWheel = useCallback(
      (e: React.WheelEvent) => {
        e.preventDefault();
        pauseAutoRotate();
        setRotation((prev) => prev + e.deltaY * 0.15);
        resumeAutoRotate();
      },
      [pauseAutoRotate, resumeAutoRotate],
    );

    // Pointer drag
    const onPointerDown = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        isDragging.current = true;
        lastPointerX.current = e.clientX;
        pauseAutoRotate();
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      },
      [pauseAutoRotate],
    );

    const onPointerMove = useCallback((e: React.PointerEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastPointerX.current;
      setRotation((prev) => prev - dx * 0.4);
      lastPointerX.current = e.clientX;
    }, []);

    const onPointerUp = useCallback(() => {
      if (!isDragging.current) return;
      isDragging.current = false;
      resumeAutoRotate();
    }, [resumeAutoRotate]);

    const anglePerItem = 360 / items.length;

    return (
      <div
        ref={ref}
        role="region"
        aria-label="Project gallery"
        className={cn(
          'relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing select-none',
          className,
        )}
        style={{ perspective: '2000px' }}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        {...props}
      >
        <div
          className="relative w-full h-full"
          style={{
            transform: `rotateY(${rotation}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {items.map((item, i) => {
            const itemAngle = i * anglePerItem;
            const totalRotation = rotation % 360;
            const relativeAngle = (itemAngle + totalRotation + 360) % 360;
            const normalizedAngle = Math.abs(relativeAngle > 180 ? 360 - relativeAngle : relativeAngle);
            const opacity = Math.max(0.2, 1 - normalizedAngle / 180);
            const isFront = normalizedAngle < 30;

            return (
              <div
                key={`${item.photo.url}-${i}`}
                role="group"
                aria-label={item.title}
                className="absolute w-[260px] h-[360px]"
                style={{
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  left: '50%',
                  top: '50%',
                  marginLeft: '-130px',
                  marginTop: '-180px',
                  opacity,
                  transition: 'opacity 0.3s linear',
                }}
              >
                <a
                  href={item.href ?? '#'}
                  tabIndex={isFront ? 0 : -1}
                  draggable={false}
                  className="block relative w-full h-full rounded-2xl shadow-2xl overflow-hidden border border-white/15 bg-ink/60 backdrop-blur-lg group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
                  onClick={(e) => {
                    // Prevent navigation if user was dragging
                    if (isDragging.current || !item.href) e.preventDefault();
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.photo.url}
                    alt={item.photo.alt}
                    draggable={false}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ objectPosition: item.photo.pos ?? 'center' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink/85 pointer-events-none" />
                  <div className="absolute bottom-0 inset-x-0 p-4 text-white">
                    {item.label && (
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-signal mb-1">
                        {item.label}
                      </p>
                    )}
                    <h2 className="font-display text-base font-semibold leading-snug">{item.title}</h2>
                    <p className="text-xs text-white/45 mt-0.5 italic">{item.subtitle}</p>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);

CircularGallery.displayName = 'CircularGallery';

export { CircularGallery };
