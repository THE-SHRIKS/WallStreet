import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

// Smooth scrolling and scroll-linked motion. Skipped entirely for reduced motion,
// in which case the page is simply static and fully visible.
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduced) {
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({
    duration: 2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    wheelMultiplier: 0.85,
    anchors: { offset: -96 },
  });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Hero: the model drifts slower than the page, the copy lifts and fades as you leave.
  const stage = document.querySelector<HTMLElement>(".stage");
  const video = document.querySelector<HTMLElement>(".stage__model");
  const copy = document.querySelector<HTMLElement>(".stage .hero__copy");
  if (stage && video) {
    gsap.fromTo(
      video,
      { yPercent: -3 },
      { yPercent: 8, ease: "none", scrollTrigger: { trigger: stage, start: "top top", end: "bottom top", scrub: true } },
    );
  }
  if (stage && copy) {
    gsap.to(copy, {
      yPercent: -14,
      opacity: 0.15,
      ease: "none",
      scrollTrigger: { trigger: stage, start: "40% top", end: "bottom top", scrub: true },
    });
  }

  // Sections ease in as they enter; list items follow one after another.
  document.querySelectorAll<HTMLElement>(".reveal").forEach((section) => {
    const items = section.querySelectorAll<HTMLElement>(".rows li, .parts li, .reading li");
    const head = section.querySelectorAll<HTMLElement>("h2, .split__body > *, .vista__quote, .button-row");
    const targets = items.length ? [...head, ...items] : [...head];
    if (!targets.length) return;
    gsap.from(targets, {
      opacity: 0,
      y: 32,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.09,
      scrollTrigger: { trigger: section, start: "top 82%", once: true },
    });
  });

  // The saucer picture slides up slightly against the scroll.
  const vistaCanvas = document.querySelector<HTMLElement>(".vista .dither");
  if (vistaCanvas) {
    gsap.fromTo(
      vistaCanvas,
      { yPercent: 6 },
      { yPercent: -6, ease: "none", scrollTrigger: { trigger: ".vista", start: "top bottom", end: "bottom top", scrub: true } },
    );
  }
}

export {};
