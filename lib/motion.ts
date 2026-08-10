import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Format seconds as m:ss, matching the design's timer labels. */
function clock(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/**
 * Shared entrance motion used by both pages:
 * - the app-icon bar draws in on mount
 * - headings reveal line-by-line through their mask
 * - `[data-in]` blocks fade and lift into place
 * - `[data-rule]` section rules wipe in from the left, once
 *
 * Each trigger runs a single time and never reverses on scroll-up.
 */
export function playEntrance(root: HTMLElement, blockOffset = 18): void {
  const bar = root.querySelector<SVGElement>("[data-mark-bar]");
  if (bar && !prefersReducedMotion()) {
    gsap.from(bar, {
      scaleY: 0,
      rotate: -12,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out",
      transformOrigin: "20px 20px",
    });
  }

  // Reduced motion: CSS already resolves masks/blocks/rules to their resting
  // state, so we leave the DOM untouched.
  if (prefersReducedMotion()) return;

  const heads = gsap.utils
    .toArray<HTMLElement>(root.querySelectorAll("h1, h2"))
    .filter((h) => h.querySelector("[data-line]"));

  heads.forEach((head) => {
    const lines = head.querySelectorAll("[data-line]");
    gsap.set(lines, { yPercent: 135 });
    ScrollTrigger.create({
      trigger: head,
      start: "top 88%",
      once: true,
      onEnter: () =>
        gsap.to(lines, {
          yPercent: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.07,
        }),
    });
  });

  root.querySelectorAll<HTMLElement>("[data-in]").forEach((block) => {
    gsap.set(block, { opacity: 0, y: blockOffset });
    ScrollTrigger.create({
      trigger: block,
      start: "top 90%",
      once: true,
      onEnter: () =>
        gsap.to(block, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        }),
    });
  });

  root.querySelectorAll<HTMLElement>("[data-rule]").forEach((rule) => {
    gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });
    // The section divider wipes in on the way down and retracts to its
    // original state when scrolled back up past the trigger.
    ScrollTrigger.create({
      trigger: rule,
      start: "top 98%",
      onEnter: () =>
        gsap.to(rule, { scaleX: 1, duration: 0.8, ease: "power2.inOut" }),
      onLeaveBack: () =>
        gsap.to(rule, { scaleX: 0, duration: 0.6, ease: "power2.inOut" }),
    });
  });
}

/**
 * Landing-only motion: the reading-progress bar, the looping card timer ring,
 * the scroll-scrubbed rest timer, and the count-up session stats.
 */
export function playLandingExtras(root: HTMLElement): void {
  const reduce = prefersReducedMotion();

  // Top reading-progress bar — advances with furthest scroll, never rewinds.
  const progress = root.querySelector<HTMLElement>("[data-progress]");
  if (progress) {
    let maxProgress = 0;
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        maxProgress = Math.max(maxProgress, self.progress);
        progress.style.width = `${(maxProgress * 100).toFixed(2)}%`;
      },
    });
  }

  // Looping rest-timer ring inside the logging card (r=32 → circumference 201).
  const ring = root.querySelector<SVGCircleElement>("[data-ring]");
  const ringLabel = root.querySelector<HTMLElement>("[data-ring-label]");
  if (ring && ringLabel && !reduce) {
    const state = { p: 0 };
    gsap.to(state, {
      p: 1,
      duration: 6,
      ease: "none",
      repeat: -1,
      onUpdate: () => {
        ring.setAttribute("stroke-dashoffset", String(201 * state.p));
        ringLabel.textContent = clock(90 * (1 - state.p));
      },
    });
  }

  // Scroll-scrubbed rest timer: the big ring drains as you move through the
  // 230vh sticky section (r=140 → circumference 879.6).
  const scrub = root.querySelector<HTMLElement>("[data-scrub]");
  if (scrub && !reduce) {
    const bigRing = scrub.querySelector<SVGCircleElement>("[data-bigring]");
    const bigCount = scrub.querySelector<HTMLElement>("[data-bigcount]");
    const liveCount = scrub.querySelector<HTMLElement>("[data-live-count]");
    const liveBar = scrub.querySelector<HTMLElement>("[data-live-bar]");
    ScrollTrigger.create({
      trigger: scrub,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const t = self.progress;
        const label = clock(90 * (1 - t));
        if (bigRing)
          bigRing.setAttribute("stroke-dashoffset", (879.6 * t).toFixed(1));
        if (bigCount) bigCount.textContent = label;
        if (liveCount) liveCount.textContent = label;
        if (liveBar)
          liveBar.style.transform = `scaleX(${(1 - t).toFixed(3)})`;
      },
    });
  }

  // Count-up session stats — each animates from zero as its row enters.
  root.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
    const target = parseFloat(el.getAttribute("data-count") ?? "0");
    const suffix = el.getAttribute("data-suffix") ?? "";
    if (reduce) {
      el.textContent = target.toLocaleString("en-US") + suffix;
      return;
    }
    const counter = { value: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: "top 92%",
      once: true,
      onEnter: () =>
        gsap.to(counter, {
          value: target,
          duration: 1.1,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent =
              Math.round(counter.value).toLocaleString("en-US") + suffix;
          },
        }),
    });
  });
}
