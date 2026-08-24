import { Footer } from "@/components/layout/Footer";
import { Loader } from "@/components/layout/Loader";
import { Nav } from "@/components/layout/Nav";
import { Committee } from "@/components/sections/Committee";
import { Contact } from "@/components/sections/Contact";
import { Contribute } from "@/components/sections/Contribute";
import { Hero } from "@/components/sections/Hero";
import { Journey } from "@/components/sections/Journey";
import { Programme } from "@/components/sections/Programme";
import { Stage } from "@/components/sections/Stage";

/**
 * One continuous scroll.
 *
 * Arrival, then the story — the 21-year statement and the years are a single
 * section now, not a claim followed by evidence. Then this year's three days,
 * the stage, how to chip in, and where to come.
 *
 * Committee sits last, deliberately: the festival is the subject, and the
 * people running it are the credits. Sponsors will slot in above Committee
 * once logo assets exist.
 */
export default function Home() {
  return (
    <>
      <Loader />
      <Nav />
      <main id="main">
        <Hero />
        <Journey />
        <Programme />
        <Stage />
        <Contribute />
        <Contact />
        <Committee />
      </main>
      <Footer />
    </>
  );
}
