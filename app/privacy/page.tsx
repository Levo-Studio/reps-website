import type { Metadata } from "next";
import { Privacy } from "@/components/Privacy";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "Reps stores everything on your iPhone. No account, no cloud sync, no analytics, no third-party SDKs — nothing is sent anywhere.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy policy — Reps",
    description:
      "Reps stores everything on your iPhone. No account, no cloud sync, no analytics — nothing is sent anywhere.",
    url: "/privacy",
  },
};

export default function PrivacyPage() {
  return <Privacy />;
}
