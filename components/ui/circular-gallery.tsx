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
  cardWidth?: number;
  cardHeight?: number;
}

// How quickly currentVelocity lerps toward autoRotateSpeed after a swipe.
// 0.06 ≈ 0.8s to settle at 60fps — feels like natural deceleration.
const MOMENTUM_LERP = 0.06;
const MAX_SWIPE_VELOCITY = 8; // degrees/frame cap so wild flicks don't overshoot

const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  ({ items, className, radius = 480, autoRotateSpeed = 0.03, cardWidth = 260, cardHeight = 360, ...props }, ref) => {
    const [rotation, setRotation] = useState(0);

    // isInteracting blocks the auto-rotate tick while a touch/pointer is active.
    const isInteracting = useRef(false);
    const interactTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    // Pointer (mouse/stylus) drag state
    const lastPointerX = useRef(0);

    // Touch drag state
    const lastTouchX = useRef(0);
    const lastTouchTime = useRef(0);
    const touchVelocity = useRef(0); // smoothed degrees/frame during swipe

    const isDragging = useRef(false);
    const touchMoved = useRef(false);

    // Running velocity used by the auto-rotate tick. Initialized to autoRotateSpeed
    // so the carousel starts moving immediately. On touch release this is set to the
    // swipe velocity and the tick lerps it back to autoRotateSpeed — that's the
    // gradual deceleration into normal auto-spin.
    const currentVelocity = useRef(autoRotateSpeed);

    const internalRef = useRef<HTMLDivElement | null>(null);

    // Auto-rotate tick — lerps currentVelocity toward autoRotateSpeed each frame
    // so swipe momentum bleeds smoothly into the background spin.
    useEffect(() => {
      const tick = () => {
        if (!isInteracting.current) {
          currentVelocity.current +=
            (autoRotateSpeed - currentVelocity.current) * MOMENTUM_LERP;
          setRotation((prev) => prev + currentVelocity.current);
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

    // Used only by wheel and pointer (mouse) handlers which don't have velocity info.
    const resumeAutoRotate = useCallback((delayMs = 800) => {
      if (interactTimeoutRef.current) clearTimeout(interactTimeoutRef.current);
      interactTimeoutRef.current = setTimeout(() => {
        isInteracting.current = false;
      }, delayMs);
    }, []);

    // Touch drag — non-passive so we can call stopPropagation + preventDefault.
    // stopPropagation prevents the document-level scroll-lock in page.tsx from
    // seeing these events. preventDefault prevents native pan. Once preventDefault
    // is called, iOS does not synthesize pointer events from the same gesture,
    // so the pointer handlers below remain mouse/stylus only.
    useEffect(() => {
      const el = internalRef.current;
      if (!el) return;

      const onTouchStart = (e: TouchEvent) => {
        isDragging.current = true;
        touchMoved.current = false;
        lastTouchX.current = e.touches[0].clientX;
        lastTouchTime.current = performance.now();
        touchVelocity.current = 0;
        pauseAutoRotate();
      };

      const onTouchMove = (e: TouchEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (!isDragging.current || e.touches.length === 0) return;

        const dx = e.touches[0].clientX - lastTouchX.current;
        if (Math.abs(dx) > 3) touchMoved.current = true;

        // Track smoothed velocity in rotation-degrees per 60fps frame.
        // Swipe right (dx > 0) → positive velocity → same direction as auto-rotate.
        const now = performance.now();
        const dt = Math.max(now - lastTouchTime.current, 1);
        const instantVel = (dx * 0.4) * (16 / dt);
        touchVelocity.current = touchVelocity.current * 0.7 + instantVel * 0.3;
        lastTouchTime.current = now;

        // Positive dx = swipe right = carousel rotates right (rotation increases).
        setRotation((prev) => prev + dx * 0.4);
        lastTouchX.current = e.touches[0].clientX;
      };

      const onTouchEnd = () => {
        isDragging.current = false;
        // Hand the swipe velocity to the tick, capped to prevent wild overshoots.
        currentVelocity.current = Math.max(
          -MAX_SWIPE_VELOCITY,
          Math.min(MAX_SWIPE_VELOCITY, touchVelocity.current),
        );
        // Release immediately so the tick picks up currentVelocity and lerps it
        // to autoRotateSpeed — this is what produces the gradual deceleration.
        isInteracting.current = false;
      };

      el.addEventListener('touchstart', onTouchStart, { passive: true });
      el.addEventListener('touchmove', onTouchMove, { passive: false });
      el.addEventListener('touchend', onTouchEnd);
      el.addEventListener('touchcancel', onTouchEnd);

      return () => {
        el.removeEventListener('touchstart', onTouchStart);
        el.removeEventListener('touchmove', onTouchMove);
        el.removeEventListener('touchend', onTouchEnd);
        el.removeEventListener('touchcancel', onTouchEnd);
      };
    }, [pauseAutoRotate]);

    const onWheel = useCallback(
      (e: React.WheelEvent) => {
        e.preventDefault();
        pauseAutoRotate();
        setRotation((prev) => prev + e.deltaY * 0.15);
        resumeAutoRotate();
      },
      [pauseAutoRotate, resumeAutoRotate],
    );

    // Pointer handlers handle mouse/stylus only; touch is covered above.
    const onPointerDown = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (e.pointerType === 'touch') return;
        isDragging.current = true;
        lastPointerX.current = e.clientX;
        pauseAutoRotate();
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      },
      [pauseAutoRotate],
    );

    const onPointerMove = useCallback((e: React.PointerEvent) => {
      if (e.pointerType === 'touch' || !isDragging.current) return;
      const dx = e.clientX - lastPointerX.current;
      setRotation((prev) => prev + dx * 0.4);
      lastPointerX.current = e.clientX;
    }, []);

    const onPointerUp = useCallback(
      (e: React.PointerEvent) => {
        if (e.pointerType === 'touch' || !isDragging.current) return;
        isDragging.current = false;
        resumeAutoRotate();
      },
      [resumeAutoRotate],
    );

    const anglePerItem = 360 / items.length;
    const halfW = cardWidth / 2;
    const halfH = cardHeight / 2;
    const isSmall = cardWidth < 200;

    return (
      <div
        ref={(node) => {
          internalRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
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
                style={{
                  position: 'absolute',
                  width: `${cardWidth}px`,
                  height: `${cardHeight}px`,
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  left: '50%',
                  top: '50%',
                  marginLeft: `-${halfW}px`,
                  marginTop: `-${halfH}px`,
                  opacity,
                  transition: 'opacity 0.3s linear',
                }}
              >
                <a
                  href={item.href ?? '#'}
                  tabIndex={isFront ? 0 : -1}
                  draggable={false}
                  className={cn(
                    'block relative w-full h-full rounded-2xl overflow-hidden bg-ink/60 backdrop-blur-lg group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal transition-[transform,border-color,box-shadow] duration-300',
                    isFront
                      ? 'border border-signal/50 scale-[1.04] shadow-[0_0_24px_rgba(47,107,255,0.45),0_0_48px_rgba(47,107,255,0.2)]'
                      : 'border border-white/15 scale-100 shadow-2xl',
                  )}
                  onClick={(e) => {
                    if (touchMoved.current || isDragging.current || !item.href) e.preventDefault();
                    touchMoved.current = false;
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
                  <div className={cn('absolute bottom-0 inset-x-0 text-white', isSmall ? 'p-2' : 'p-4')}>
                    {item.label && (
                      <p className={cn('font-mono uppercase tracking-[0.18em] text-signal', isSmall ? 'text-[8px] mb-0.5' : 'text-[10px] mb-1')}>
                        {item.label}
                      </p>
                    )}
                    <h2 className={cn('font-display font-semibold leading-snug', isSmall ? 'text-xs' : 'text-base')}>
                      {item.title}
                    </h2>
                    <p className={cn('italic text-white/45', isSmall ? 'text-[9px] mt-0' : 'text-xs mt-0.5')}>
                      {item.subtitle}
                    </p>
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
