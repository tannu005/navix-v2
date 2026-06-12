"use client";

import React, { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './scroll-float.css';

gsap.registerPlugin(ScrollTrigger);

const ScrollFloat = ({
  children,
  scrollContainerRef,
  containerClassName = '',
  textClassName = '',
  animationDuration = 1,
  ease = 'back.inOut(2)',
  scrollStart = 'top top',
  scrollEnd = '+=500',
  stagger = 0.03,
  style
}) => {
  const containerRef = useRef(null);

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    // Split by lines first
    const lines = text.split('\n');
    return lines.map((line, lineIndex) => (
      <span key={lineIndex} className="block">
        {line.split(' ').map((word, wordIndex) => (
          <span key={wordIndex} className="inline-block whitespace-nowrap">
            {word.split('').map((char, charIndex) => (
              <span className="char inline-block" key={charIndex}>
                {char}
              </span>
            ))}
            {wordIndex !== line.split(' ').length - 1 && <span className="inline-block">&nbsp;</span>}
          </span>
        ))}
      </span>
    ));
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;
    const charElements = el.querySelectorAll('.char');

    // Make the text disappear and fly down/out when scrolling starts
    gsap.fromTo(
      charElements,
      {
        willChange: 'opacity, transform',
        opacity: 1,
        yPercent: 0,
        scaleY: 1,
        scaleX: 1,
        transformOrigin: '50% 0%'
      },
      {
        duration: animationDuration,
        ease: ease,
        opacity: 0,
        yPercent: 250,
        scaleY: 1.2,
        scaleX: 0.9,
        stagger: stagger,
        scrollTrigger: {
          trigger: document.body, // Use body as trigger since element is fixed
          scroller,
          start: scrollStart,
          end: scrollEnd,
          scrub: 1.5 // Adds smoothing to the scroll scrub
        }
      }
    );
  }, [scrollContainerRef, animationDuration, ease, scrollStart, scrollEnd, stagger]);

  return (
    <div ref={containerRef} className={`scroll-float ${containerClassName}`} style={style}>
      <span className={`scroll-float-text ${textClassName}`}>{splitText}</span>
    </div>
  );
};

export default ScrollFloat;
