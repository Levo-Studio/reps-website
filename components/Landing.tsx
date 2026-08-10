"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { BrandMark } from "@/components/BrandMark";
import { playEntrance, playLandingExtras } from "@/lib/motion";
import { APP_STORE_URL, GITHUB_APP_URL, GITHUB_WEBSITE_URL } from "@/lib/site";

const HAIRLINE = "rgba(255,255,255,0.0824)";
const RULE_BG = "rgba(255,255,255,0.34)";
// The animated section divider is its own line (no static border underneath),
// so its wipe-in / wipe-out is actually visible. Kept restrained but a touch
// brighter than the 8.24% hairline so the motion reads.
const DIVIDER = "rgba(255,255,255,0.16)";

const monoLabel: React.CSSProperties = {
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
};

/**
 * Absolutely-positioned section divider that wipes in on scroll-down and
 * retracts on scroll-up. It is the only line at the section boundary — there is
 * no static border beneath it — so both directions of the wipe are visible.
 */
function Rule() {
  return (
    <span
      data-rule
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 1,
        background: DIVIDER,
        transform: "scaleX(0)",
        transformOrigin: "left center",
      }}
    />
  );
}

export function Landing() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      playEntrance(el, 18);
      playLandingExtras(el);
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      style={{ position: "relative", background: "#141416", overflowX: "clip" }}
    >
      {/* Top reading-progress bar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          zIndex: 70,
          background: HAIRLINE,
        }}
      >
        <span
          data-progress
          style={{
            display: "block",
            height: "100%",
            width: "0%",
            background: RULE_BG,
          }}
        />
      </div>

      {/* Fixed header */}
      <header
        style={{
          position: "fixed",
          top: 1,
          left: 0,
          right: 0,
          zIndex: 60,
          background: "rgba(20,20,22,0.76)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderBottom: `1px solid ${HAIRLINE}`,
        }}
      >
        <nav
          style={{
            padding: "13px clamp(20px,5vw,64px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <a
            href="#"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: "#FFFFFF",
            }}
          >
            <BrandMark size={24} animatedBar />
            <span
              style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}
            >
              Reps
            </span>
          </a>
          <a
            href={APP_STORE_URL}
            className="transition-opacity duration-300 hover:opacity-[.85]"
            style={{
              ...monoLabel,
              background: "#2EE59D",
              color: "#141416",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "9px 16px",
            }}
          >
            Download
          </a>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section
          aria-label="Hero"
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding:
              "clamp(96px,14vh,150px) clamp(20px,5vw,64px) clamp(56px,10vh,110px)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0,1fr)",
              gap: 0,
              maxWidth: 1180,
              width: "100%",
              margin: "0 auto",
            }}
          >
            <div
              data-in
              style={{
                ...monoLabel,
                display: "flex",
                alignItems: "center",
                gap: 14,
                fontSize: 11,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#8E8E93",
                marginBottom: "clamp(28px,5vh,52px)",
              }}
            >
              <span style={{ color: "#2EE59D" }}>000</span>
              <span style={{ flex: 1, height: 1, background: HAIRLINE }} />
              <span>iPhone · Free</span>
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: "clamp(2.9rem,8.4vw,7.6rem)",
                fontWeight: 700,
                lineHeight: 0.96,
                letterSpacing: "-0.045em",
              }}
            >
              <span className="mask">
                <span data-line>Track your lifts.</span>
              </span>
              <span className="mask">
                <span data-line style={{ color: "#8E8E93" }}>
                  Nothing else.
                </span>
              </span>
            </h1>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
                gap: "clamp(24px,4vw,64px)",
                alignItems: "end",
                marginTop: "clamp(36px,6vh,64px)",
              }}
            >
              <p
                data-in
                style={{
                  margin: 0,
                  maxWidth: "42ch",
                  fontSize: "clamp(1rem,1.2vw,1.12rem)",
                  lineHeight: 1.6,
                  color: "#8E8E93",
                }}
              >
                A minimal gym tracker that lives on your phone. Log weight and
                reps, let the rest timer run, and leave. No account, no cloud, no
                tracking.
              </p>
              <div
                data-in
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 22,
                }}
              >
                <a
                  href={APP_STORE_URL}
                  className="transition-opacity duration-300 hover:opacity-[.85]"
                  style={{
                    background: "#2EE59D",
                    color: "#141416",
                    fontSize: 14,
                    fontWeight: 600,
                    padding: "15px 26px",
                  }}
                >
                  Download on the App Store
                </a>
                <a
                  href="#log"
                  className="text-muted transition-colors hover:!text-white"
                  style={{
                    ...monoLabel,
                    fontSize: 11,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    borderBottom: "1px solid rgba(255,255,255,0.14)",
                    paddingBottom: 4,
                  }}
                >
                  What it does ↓
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 001 · Logging */}
        <section
          id="log"
          aria-label="Logging"
          data-row
          style={{ position: "relative" }}
        >
          <Rule />
          <div
            style={{
              maxWidth: 1180,
              margin: "0 auto",
              padding: "clamp(56px,10vh,110px) clamp(20px,5vw,64px)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))",
              gap: "clamp(28px,5vw,72px)",
              alignItems: "start",
            }}
          >
            <div>
              <p
                data-in
                style={{
                  ...monoLabel,
                  margin: "0 0 clamp(24px,4vh,44px)",
                  fontSize: 11,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#8E8E93",
                }}
              >
                <span style={{ color: "#2EE59D" }}>001</span> &nbsp;Logging
              </p>
              <h2
                style={{
                  margin: "0 0 22px",
                  fontSize: "clamp(1.7rem,3.4vw,2.9rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.035em",
                  lineHeight: 1.02,
                }}
              >
                <span className="mask">
                  <span data-line>Weight × reps,</span>
                </span>
                <span className="mask">
                  <span data-line style={{ color: "#8E8E93" }}>
                    in seconds.
                  </span>
                </span>
              </h2>
              <p
                data-in
                style={{
                  margin: 0,
                  maxWidth: "36ch",
                  fontSize: "1.02rem",
                  lineHeight: 1.65,
                  color: "#8E8E93",
                }}
              >
                Two fields, one tap, and the set is saved. Only the best weight
                and reps for each exercise come back as your baseline — there is
                no history to scroll.
              </p>
            </div>

            {/* Logging card */}
            <div
              data-in
              style={{
                minWidth: 0,
                background: "#1C1C1E",
                border: `1px solid ${HAIRLINE}`,
                padding: 24,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                  marginBottom: 20,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>
                    Bench Press
                  </p>
                  <p style={{ margin: "4px 0 0", fontSize: 13, color: "#8E8E93" }}>
                    Push Day A
                  </p>
                </div>
                <div
                  style={{
                    position: "relative",
                    width: 72,
                    height: 72,
                    flex: "none",
                  }}
                >
                  <svg
                    viewBox="0 0 76 76"
                    width={72}
                    height={72}
                    style={{ display: "block", transform: "rotate(-90deg)" }}
                    aria-hidden="true"
                  >
                    <circle
                      cx="38"
                      cy="38"
                      r="32"
                      fill="none"
                      stroke={HAIRLINE}
                      strokeWidth="4"
                    />
                    <circle
                      data-ring
                      cx="38"
                      cy="38"
                      r="32"
                      fill="none"
                      stroke="#2EE59D"
                      strokeWidth="4"
                      strokeDasharray="201"
                      strokeDashoffset="60"
                    />
                  </svg>
                  <span
                    data-ring-label
                    style={{
                      ...monoLabel,
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#2EE59D",
                    }}
                  >
                    1:30
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {[
                  { n: "1", v: "80 kg × 10", dim: false },
                  { n: "2", v: "82.5 kg × 8", dim: false },
                  { n: "3", v: "85 kg × 6", dim: false },
                  { n: "4", v: "— · —", dim: true },
                ].map((row) => (
                  <div
                    key={row.n}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "13px 0",
                      borderTop: `1px solid ${HAIRLINE}`,
                    }}
                  >
                    <span
                      style={{ ...monoLabel, fontSize: 13, color: "#8E8E93" }}
                    >
                      {row.n}
                    </span>
                    <span
                      style={{
                        ...monoLabel,
                        fontSize: 15,
                        fontWeight: row.dim ? 400 : 600,
                        color: row.dim ? "#8E8E93" : "#FFFFFF",
                      }}
                    >
                      {row.v}
                    </span>
                  </div>
                ))}
              </div>
              <p
                style={{
                  ...monoLabel,
                  margin: "18px 0 0",
                  fontSize: 12,
                  color: "#8E8E93",
                }}
              >
                best · <span style={{ color: "#2EE59D" }}>85 kg × 6</span>
              </p>
            </div>
          </div>
        </section>

        {/* 002 · Rest timer (scroll-scrubbed) */}
        <section
          aria-label="Rest timer"
          data-scrub
          style={{
            height: "230vh",
            position: "relative",
          }}
        >
          <Rule />
          <div
            style={{
              position: "sticky",
              top: 0,
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "clamp(12px,2.5vh,40px)",
              padding:
                "clamp(66px,9vh,96px) clamp(20px,5vw,64px) clamp(20px,4vh,40px)",
            }}
          >
            <p
              style={{
                ...monoLabel,
                margin: 0,
                fontSize: 11,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#8E8E93",
              }}
            >
              <span style={{ color: "#2EE59D" }}>002</span> &nbsp;Rest timer
            </p>
            <div
              style={{
                position: "relative",
                width: "min(30vh,72vw,300px)",
                height: "min(30vh,72vw,300px)",
              }}
            >
              <svg
                viewBox="0 0 300 300"
                width="100%"
                height="100%"
                style={{ display: "block", transform: "rotate(-90deg)" }}
                aria-hidden="true"
              >
                <circle
                  cx="150"
                  cy="150"
                  r="140"
                  fill="none"
                  stroke={HAIRLINE}
                  strokeWidth="2"
                />
                <circle
                  data-bigring
                  cx="150"
                  cy="150"
                  r="140"
                  fill="none"
                  stroke="#2EE59D"
                  strokeWidth="2"
                  strokeDasharray="879.6"
                  strokeDashoffset="0"
                />
              </svg>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                <span
                  data-bigcount
                  style={{
                    ...monoLabel,
                    fontSize: "clamp(2.2rem,7vw,3.6rem)",
                    fontWeight: 600,
                    letterSpacing: "-0.03em",
                    color: "#FFFFFF",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  1:30
                </span>
                <span
                  style={{
                    ...monoLabel,
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#8E8E93",
                  }}
                >
                  Rest
                </span>
              </div>
            </div>
            <p
              style={{
                margin: 0,
                maxWidth: "34ch",
                textAlign: "center",
                fontSize: "clamp(1rem,1.6vw,1.35rem)",
                lineHeight: 1.5,
                color: "#8E8E93",
              }}
            >
              The timer starts the moment you log a set — and keeps counting on
              your <span style={{ color: "#FFFFFF" }}>Lock Screen</span>.
            </p>
            {/* Lock Screen Live Activity */}
            <div
              style={{
                width: "100%",
                maxWidth: 520,
                background: "#1C1C1E",
                border: `1px solid ${HAIRLINE}`,
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <BrandMark size={32} radius={10} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    gap: 10,
                  }}
                >
                  <p style={{ margin: 0, fontSize: 12, color: "#8E8E93" }}>
                    Reps · Rest Timer
                  </p>
                  <span
                    data-live-count
                    style={{
                      ...monoLabel,
                      flex: "none",
                      fontSize: 16,
                      fontWeight: 600,
                      color: "#2EE59D",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    1:30
                  </span>
                </div>
                <p
                  style={{
                    margin: "5px 0 0",
                    fontSize: 14,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Push Day A · Next: Incline DB Press
                </p>
                <div
                  style={{
                    marginTop: 9,
                    height: 3,
                    background: HAIRLINE,
                    overflow: "hidden",
                  }}
                >
                  <div
                    data-live-bar
                    style={{
                      height: "100%",
                      width: "100%",
                      background: "#2EE59D",
                      transformOrigin: "left center",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 003 · Everything else */}
        <section
          aria-label="Everything else"
          data-row
          style={{ position: "relative" }}
        >
          <Rule />
          <div
            style={{
              maxWidth: 1180,
              margin: "0 auto",
              padding: "clamp(56px,10vh,110px) clamp(20px,5vw,64px)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
              gap: "clamp(28px,5vw,72px)",
              alignItems: "start",
            }}
          >
            <div>
              <p
                data-in
                style={{
                  ...monoLabel,
                  margin: "0 0 clamp(24px,4vh,44px)",
                  fontSize: 11,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#8E8E93",
                }}
              >
                <span style={{ color: "#2EE59D" }}>003</span> &nbsp;Everything
                else
              </p>
              <h2
                style={{
                  margin: 0,
                  fontSize: "clamp(1.7rem,3.4vw,2.9rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.035em",
                  lineHeight: 1.02,
                }}
              >
                <span className="mask">
                  <span data-line>Three more things.</span>
                </span>
                <span className="mask">
                  <span data-line style={{ color: "#8E8E93" }}>
                    Then it stops.
                  </span>
                </span>
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {[
                {
                  n: "01",
                  h: "Your best set carries over",
                  p: "Open an exercise and the top weight and reps are already there as the number to beat.",
                  last: false,
                },
                {
                  n: "02",
                  h: "Widget and Siri Shortcuts",
                  p: "Start a routine from the Home Screen widget, or just ask Siri for it.",
                  last: false,
                },
                {
                  n: "03",
                  h: "Save a summary to Photos",
                  p: "One clean card per session, saved straight to your camera roll.",
                  last: true,
                },
              ].map((item) => (
                <div
                  key={item.n}
                  data-in
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr",
                    gap: 20,
                    padding: "26px 0",
                    borderTop: `1px solid ${HAIRLINE}`,
                    ...(item.last
                      ? { borderBottom: `1px solid ${HAIRLINE}` }
                      : {}),
                  }}
                >
                  <span style={{ ...monoLabel, fontSize: 12, color: "#8E8E93" }}>
                    {item.n}
                  </span>
                  <div>
                    <h3
                      style={{
                        margin: "0 0 8px",
                        fontSize: "1.05rem",
                        fontWeight: 600,
                      }}
                    >
                      {item.h}
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.95rem",
                        lineHeight: 1.6,
                        color: "#8E8E93",
                      }}
                    >
                      {item.p}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 004 · Privacy */}
        <section
          aria-label="Privacy"
          data-row
          style={{ position: "relative" }}
        >
          <Rule />
          <div
            style={{
              maxWidth: 1180,
              margin: "0 auto",
              padding: "clamp(56px,10vh,110px) clamp(20px,5vw,64px)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))",
              gap: "clamp(28px,5vw,72px)",
              alignItems: "start",
            }}
          >
            <div>
              <p
                data-in
                style={{
                  ...monoLabel,
                  margin: "0 0 clamp(24px,4vh,44px)",
                  fontSize: 11,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#8E8E93",
                }}
              >
                <span style={{ color: "#2EE59D" }}>004</span> &nbsp;Privacy
              </p>
              <h2
                style={{
                  margin: "0 0 22px",
                  fontSize: "clamp(1.7rem,3.4vw,2.9rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.035em",
                  lineHeight: 1.02,
                }}
              >
                <span className="mask">
                  <span data-line>Nothing leaves</span>
                </span>
                <span className="mask">
                  <span data-line style={{ color: "#8E8E93" }}>
                    the device.
                  </span>
                </span>
              </h2>
              <p
                data-in
                style={{
                  margin: 0,
                  maxWidth: "36ch",
                  fontSize: "1.02rem",
                  lineHeight: 1.65,
                  color: "#8E8E93",
                }}
              >
                Every set is written to on-device SwiftData storage and stays
                there. No sign-up, no server to talk to, no analytics counting
                your workouts. Delete the app and the data goes with it.
              </p>
              <p data-in style={{ margin: "22px 0 0" }}>
                <a
                  href="/privacy"
                  className="text-muted transition-colors hover:!text-white"
                  style={{
                    ...monoLabel,
                    fontSize: 11,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    borderBottom: "1px solid rgba(255,255,255,0.14)",
                    paddingBottom: 4,
                  }}
                >
                  Read the privacy policy →
                </a>
              </p>
            </div>
            <div data-in style={{ minWidth: 0 }}>
              {[
                { k: "Account required", v: "No", last: false },
                { k: "Cloud sync", v: "No", last: false },
                { k: "Analytics or tracking", v: "No", last: false },
                { k: "Storage", v: "On device", last: false },
                { k: "Price", v: "Free", last: true },
              ].map((row) => (
                <div
                  key={row.k}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    padding: "16px 0",
                    borderTop: `1px solid ${HAIRLINE}`,
                    ...(row.last
                      ? { borderBottom: `1px solid ${HAIRLINE}` }
                      : {}),
                  }}
                >
                  <span style={{ fontSize: 15, color: "#8E8E93" }}>{row.k}</span>
                  <span
                    style={{
                      ...monoLabel,
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#2EE59D",
                    }}
                  >
                    {row.v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 005 · Summary */}
        <section
          aria-label="Summary"
          data-row
          style={{ position: "relative" }}
        >
          <Rule />
          <div
            style={{
              maxWidth: 1180,
              margin: "0 auto",
              padding: "clamp(56px,10vh,110px) clamp(20px,5vw,64px)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))",
              gap: "clamp(28px,5vw,72px)",
              alignItems: "center",
            }}
          >
            <div>
              <p
                data-in
                style={{
                  ...monoLabel,
                  margin: "0 0 clamp(24px,4vh,44px)",
                  fontSize: 11,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#8E8E93",
                }}
              >
                <span style={{ color: "#2EE59D" }}>005</span> &nbsp;Summary
              </p>
              <h2
                style={{
                  margin: "0 0 22px",
                  fontSize: "clamp(1.7rem,3.4vw,2.9rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.035em",
                  lineHeight: 1.02,
                }}
              >
                <span className="mask">
                  <span data-line>One card</span>
                </span>
                <span className="mask">
                  <span data-line style={{ color: "#8E8E93" }}>
                    per session.
                  </span>
                </span>
              </h2>
              <p
                data-in
                style={{
                  margin: 0,
                  maxWidth: "36ch",
                  fontSize: "1.02rem",
                  lineHeight: 1.65,
                  color: "#8E8E93",
                }}
              >
                When you finish, Reps totals the session into a single card you
                can save to Photos or send to whoever asks what you did today.
              </p>
            </div>

            {/* Session summary card */}
            <div
              data-in
              style={{
                minWidth: 0,
                background: "#1C1C1E",
                border: `1px solid ${HAIRLINE}`,
                padding: "clamp(22px,3vw,32px)",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: 9 }}
              >
                <span
                  style={{
                    display: "block",
                    width: 6,
                    height: 6,
                    background: "#2EE59D",
                  }}
                />
                <p
                  style={{
                    margin: 0,
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#2EE59D",
                  }}
                >
                  Push Day A
                </p>
              </div>
              <p
                style={{
                  ...monoLabel,
                  margin: "8px 0 26px",
                  fontSize: 12,
                  color: "#8E8E93",
                }}
              >
                10 AUG 2026 · 58 MIN
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: 12,
                  padding: "22px 0",
                  borderTop: `1px solid ${HAIRLINE}`,
                  borderBottom: `1px solid ${HAIRLINE}`,
                }}
              >
                {[
                  {
                    count: "4250",
                    suffix: " kg",
                    initial: "4,250 kg",
                    label: "Total volume",
                  },
                  { count: "18", initial: "18", label: "Total sets" },
                  { count: "142", initial: "142", label: "Total reps" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p
                      data-count={stat.count}
                      {...(stat.suffix ? { "data-suffix": stat.suffix } : {})}
                      style={{
                        ...monoLabel,
                        margin: 0,
                        fontSize: "clamp(17px,2.3vw,24px)",
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        whiteSpace: "nowrap",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {stat.initial}
                    </p>
                    <p
                      style={{
                        margin: "7px 0 0",
                        fontSize: 10,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#8E8E93",
                      }}
                    >
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  marginTop: 22,
                }}
              >
                <BrandMark size={18} radius={10} />
                <p
                  style={{
                    ...monoLabel,
                    margin: 0,
                    fontSize: 11,
                    color: "#8E8E93",
                  }}
                >
                  Reps · by Levo Studio
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 006 · Open source */}
        <section
          aria-label="Open source"
          data-row
          style={{ position: "relative" }}
        >
          <Rule />
          <div
            style={{
              maxWidth: 1180,
              margin: "0 auto",
              padding: "clamp(56px,10vh,110px) clamp(20px,5vw,64px)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))",
              gap: "clamp(28px,5vw,72px)",
              alignItems: "start",
            }}
          >
            <div>
              <p
                data-in
                style={{
                  ...monoLabel,
                  margin: "0 0 clamp(24px,4vh,44px)",
                  fontSize: 11,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#8E8E93",
                }}
              >
                <span style={{ color: "#2EE59D" }}>006</span> &nbsp;Open source
              </p>
              <h2
                style={{
                  margin: "0 0 22px",
                  fontSize: "clamp(1.7rem,3.4vw,2.9rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.035em",
                  lineHeight: 1.02,
                }}
              >
                <span className="mask">
                  <span data-line>The code is</span>
                </span>
                <span className="mask">
                  <span data-line style={{ color: "#8E8E93" }}>
                    public.
                  </span>
                </span>
              </h2>
              <p
                data-in
                style={{
                  margin: 0,
                  maxWidth: "36ch",
                  fontSize: "1.02rem",
                  lineHeight: 1.65,
                  color: "#8E8E93",
                }}
              >
                Both the app and this website are on GitHub. If you want to check
                that nothing is sent anywhere, you can read it yourself.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {[
                {
                  href: GITHUB_APP_URL,
                  repo: "levo-studio/reps",
                  desc: "The iOS app",
                  last: false,
                },
                {
                  href: GITHUB_WEBSITE_URL,
                  repo: "levo-studio/reps-website",
                  desc: "This website",
                  last: true,
                },
              ].map((r) => (
                <a
                  key={r.repo}
                  data-in
                  href={r.href}
                  className="text-white transition-colors hover:!text-accent"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    alignItems: "center",
                    gap: 16,
                    padding: "24px 0",
                    borderTop: `1px solid ${HAIRLINE}`,
                    ...(r.last
                      ? { borderBottom: `1px solid ${HAIRLINE}` }
                      : {}),
                  }}
                >
                  <span>
                    <span
                      style={{
                        ...monoLabel,
                        display: "block",
                        fontSize: 14,
                        fontWeight: 600,
                      }}
                    >
                      {r.repo}
                    </span>
                    <span
                      style={{
                        display: "block",
                        marginTop: 6,
                        fontSize: "0.9rem",
                        color: "#8E8E93",
                      }}
                    >
                      {r.desc}
                    </span>
                  </span>
                  <span
                    style={{ ...monoLabel, fontSize: 13, color: "#8E8E93" }}
                  >
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* 007 · Download CTA */}
        <section
          aria-label="Download"
          data-row
          style={{ position: "relative" }}
        >
          <Rule />
          <div
            style={{
              maxWidth: 1180,
              margin: "0 auto",
              padding: "clamp(80px,16vh,180px) clamp(20px,5vw,64px)",
            }}
          >
            <p
              data-in
              style={{
                ...monoLabel,
                margin: "0 0 clamp(28px,5vh,52px)",
                fontSize: 11,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#8E8E93",
              }}
            >
              <span style={{ color: "#2EE59D" }}>007</span> &nbsp;Download
            </p>
            <h2
              style={{
                margin: 0,
                fontSize: "clamp(2.2rem,6.4vw,5.2rem)",
                fontWeight: 700,
                letterSpacing: "-0.045em",
                lineHeight: 0.98,
              }}
            >
              <span className="mask">
                <span data-line>Open it, lift,</span>
              </span>
              <span className="mask">
                <span data-line style={{ color: "#8E8E93" }}>
                  close it.
                </span>
              </span>
            </h2>
            <div
              data-in
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 24,
                marginTop: "clamp(34px,6vh,56px)",
              }}
            >
              <a
                href={APP_STORE_URL}
                className="transition-opacity duration-300 hover:opacity-[.85]"
                style={{
                  background: "#2EE59D",
                  color: "#141416",
                  fontSize: 14,
                  fontWeight: 600,
                  padding: "16px 28px",
                }}
              >
                Download on the App Store
              </a>
              <span
                style={{
                  ...monoLabel,
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#8E8E93",
                }}
              >
                Free · iPhone only
              </span>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

/** Shared footer used on both the landing and privacy pages. */
export function SiteFooter({ homeHref = "#" }: { homeHref?: string }) {
  return (
    <footer style={{ borderTop: `1px solid ${HAIRLINE}` }}>
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "28px clamp(20px,5vw,64px) 44px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 24,
          fontSize: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <BrandMark size={20} />
          <span style={{ fontWeight: 600, color: "#FFFFFF" }}>Reps</span>
          <span style={{ color: "#8E8E93" }}>· A product by Levo Studio</span>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 28,
          }}
        >
          {homeHref === "#" ? (
            <a
              href="/privacy"
              className="text-muted transition-colors hover:!text-white"
            >
              Privacy
            </a>
          ) : (
            <a
              href={homeHref}
              className="text-muted transition-colors hover:!text-white"
            >
              Home
            </a>
          )}
          <a
            href={GITHUB_APP_URL}
            className="text-muted transition-colors hover:!text-white"
          >
            GitHub
          </a>
          <a
            href={APP_STORE_URL}
            className="text-muted transition-colors hover:!text-white"
          >
            App Store
          </a>
          <span style={{ ...monoLabel, color: "#8E8E93" }}>© Levo Studio</span>
        </div>
      </div>
    </footer>
  );
}
