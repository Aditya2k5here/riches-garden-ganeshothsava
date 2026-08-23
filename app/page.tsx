import { Footer } from "@/components/layout/Footer";
import { Loader } from "@/components/layout/Loader";
import { Nav } from "@/components/layout/Nav";
import { Children } from "@/components/sections/Children";
import { Committee } from "@/components/sections/Committee";
import { Contact } from "@/components/sections/Contact";
import { Donations } from "@/components/sections/Donations";
import { Hero } from "@/components/sections/Hero";
import { Journey } from "@/components/sections/Journey";
import { Programme } from "@/components/sections/Programme";
import { Welcome } from "@/components/sections/Welcome";

/**
 * One continuous scroll, in the order the festival is experienced:
 * arrival, welcome, history, this year's programme, the children's stage,
 * the people running it, how to support it, and where to find it.
 */
export default function Home() {
  return (
    <>
      <Loader />
      <Nav />
      <main id="main">
        <Hero />
        <Welcome />
        <Journey />
        <Programme />
        <Children />
        <Committee />
        <Donations />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
