"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { BrandMark } from "@/components/BrandMark";
import { SiteFooter } from "@/components/Landing";
import { playEntrance } from "@/lib/motion";
import { GITHUB_APP_URL, GITHUB_WEBSITE_URL } from "@/lib/site";

const HAIRLINE = "rgba(255,255,255,0.0824)";

const monoLabel: React.CSSProperties = {
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
};

const SHORT_VERSION: ReadonlyArray<{ k: string; v: string; last?: boolean }> = [
  { k: "Data collected by Levo Studio", v: "None" },
  { k: "Account or sign-up", v: "None" },
  { k: "Cloud sync or backup servers", v: "None" },
  { k: "Analytics, tracking, ads", v: "None" },
  { k: "Third-party SDKs", v: "None" },
  { k: "Where your workouts live", v: "Your device", last: true },
];

const DETAIL: ReadonlyArray<{ h: string; p: string }> = [
  {
    h: "What Reps stores",
    p: "Your routines, exercises, and the weight and reps of each set. This is written to on-device SwiftData storage on your iPhone and never leaves it. Levo Studio cannot see it, because there is nowhere for it to be sent.",
  },
  {
    h: "No account, no sync",
    p: "There is no sign-up, no login, and no cloud sync. Reps does not create a profile or an identifier for you, and it does not talk to a Levo Studio server at any point.",
  },
  {
    h: "No analytics or tracking",
    p: "The app contains no analytics SDK, no crash-reporting SDK, no advertising, and no third-party trackers. Nothing counts your workouts or your sessions.",
  },
  {
    h: "Rest timer, widget and Siri",
    p: "The Lock Screen Live Activity, the Home Screen widget and Siri Shortcuts are handled by iOS on your device. They read your local data to show a timer or start a routine; nothing is transmitted.",
  },
  {
    h: "Photos",
    p: "If you save a session summary card, Reps asks iOS for permission to write that one image to your photo library. It does not read your library, and the card is only shared if you share it.",
  },
  {
    h: "Deleting your data",
    p: "Delete a routine inside the app, or delete the app itself. In either case the data is gone from your device, and there is no copy anywhere else to request or erase.",
  },
  {
    h: "The App Store",
    p: "Downloads and any device backups you have enabled are handled by Apple under Apple's own terms. Levo Studio receives no personal data from them.",
  },
  {
    h: "This website",
    p: "No cookies, no analytics, no tracking scripts. The site is served as static pages, and its source is public.",
  },
];

export function Privacy() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (root.current) playEntrance(root.current, 16);
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      style={{
        position: "relative",
        background: "#141416",
        overflowX: "clip",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Sticky header */}
      <header
        style={{
          position: "sticky",
          top: 0,
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
            href="/"
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
            href="/"
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
            ← Back
          </a>
        </nav>
      </header>

      <main style={{ flex: 1 }}>
        {/* Intro */}
        <section
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            width: "100%",
            padding:
              "clamp(56px,12vh,130px) clamp(20px,5vw,64px) clamp(40px,7vh,80px)",
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
            <span>Updated 10 Aug 2026</span>
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(2.4rem,7vw,5.4rem)",
              fontWeight: 700,
              lineHeight: 0.98,
              letterSpacing: "-0.045em",
            }}
          >
            <span className="mask">
              <span data-line>Privacy policy.</span>
            </span>
            <span className="mask">
              <span data-line style={{ color: "#8E8E93" }}>
                It is short.
              </span>
            </span>
          </h1>
          <p
            data-in
            style={{
              margin: "clamp(32px,5vh,52px) 0 0",
              maxWidth: "44ch",
              fontSize: "clamp(1.05rem,1.5vw,1.3rem)",
              lineHeight: 1.55,
              color: "#8E8E93",
            }}
          >
            Reps stores everything on your iPhone. There is no account, nothing
            is synced, and nothing is sent anywhere. This page explains what that
            means in practice.
          </p>
        </section>

        {/* 001 · The short version */}
        <section
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            width: "100%",
            padding:
              "0 clamp(20px,5vw,64px) clamp(56px,10vh,110px)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: "clamp(28px,5vw,72px)",
            alignItems: "start",
          }}
        >
          <p
            data-in
            style={{
              ...monoLabel,
              margin: 0,
              fontSize: 11,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#8E8E93",
            }}
          >
            <span style={{ color: "#2EE59D" }}>001</span> &nbsp;The short version
          </p>
          <div>
            {SHORT_VERSION.map((row) => (
              <div
                key={row.k}
                data-in
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 20,
                  padding: "18px 0",
                  borderTop: `1px solid ${HAIRLINE}`,
                  ...(row.last
                    ? { borderBottom: `1px solid ${HAIRLINE}` }
                    : {}),
                }}
              >
                <span style={{ fontSize: "1rem", color: "#8E8E93" }}>
                  {row.k}
                </span>
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
        </section>

        {/* 002 · In detail */}
        <section style={{ borderTop: `1px solid ${HAIRLINE}` }}>
          <div
            style={{
              maxWidth: 1180,
              margin: "0 auto",
              width: "100%",
              padding: "clamp(56px,10vh,110px) clamp(20px,5vw,64px)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
              gap: "clamp(28px,5vw,72px)",
              alignItems: "start",
            }}
          >
            <p
              data-in
              style={{
                ...monoLabel,
                margin: 0,
                fontSize: 11,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#8E8E93",
              }}
            >
              <span style={{ color: "#2EE59D" }}>002</span> &nbsp;In detail
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                maxWidth: "62ch",
              }}
            >
              {DETAIL.map((item) => (
                <div
                  key={item.h}
                  data-in
                  style={{
                    padding: "26px 0",
                    borderTop: `1px solid ${HAIRLINE}`,
                  }}
                >
                  <h2
                    style={{
                      margin: "0 0 10px",
                      fontSize: "1.1rem",
                      fontWeight: 600,
                    }}
                  >
                    {item.h}
                  </h2>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "1rem",
                      lineHeight: 1.7,
                      color: "#8E8E93",
                    }}
                  >
                    {item.p}
                  </p>
                </div>
              ))}

              {/* Check it yourself */}
              <div
                data-in
                style={{
                  padding: "26px 0",
                  borderTop: `1px solid ${HAIRLINE}`,
                }}
              >
                <h2
                  style={{
                    margin: "0 0 10px",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                  }}
                >
                  Check it yourself
                </h2>
                <p
                  style={{
                    margin: "0 0 14px",
                    fontSize: "1rem",
                    lineHeight: 1.7,
                    color: "#8E8E93",
                  }}
                >
                  The app and this website are open source. You do not have to
                  take our word for any of the above.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
                  <a
                    href={GITHUB_APP_URL}
                    style={{ ...monoLabel, fontSize: 13, color: "#2EE59D" }}
                  >
                    levo-studio/reps ↗
                  </a>
                  <a
                    href={GITHUB_WEBSITE_URL}
                    style={{ ...monoLabel, fontSize: 13, color: "#2EE59D" }}
                  >
                    levo-studio/reps-website ↗
                  </a>
                </div>
              </div>

              {/* Changes and contact */}
              <div
                data-in
                style={{
                  padding: "26px 0",
                  borderTop: `1px solid ${HAIRLINE}`,
                  borderBottom: `1px solid ${HAIRLINE}`,
                }}
              >
                <h2
                  style={{
                    margin: "0 0 10px",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                  }}
                >
                  Changes and contact
                </h2>
                <p
                  style={{
                    margin: 0,
                    fontSize: "1rem",
                    lineHeight: 1.7,
                    color: "#8E8E93",
                  }}
                >
                  If this policy changes, the date at the top changes with it and
                  the edit is visible in the website repository. Questions go to
                  Levo Studio.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter homeHref="/" />
    </div>
  );
}
