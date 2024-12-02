import type { Metadata } from "next";

import Hero from "~/components/custom/hero";

export const metadata: Metadata = {
  title: "Home",
  description: "Home page",
};

const HERO = {
  title: "Subtitle",
  subtitle: "Subtitle",
};

export default function Home() {
  return (
    <div>
      <Hero {...HERO} />
    </div>
  );
}
