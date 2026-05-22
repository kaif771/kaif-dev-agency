import Navbar from "@/components/site/Navbar";
import Hero from "@/components/sections/Hero";
import Capabilities from "@/components/sections/Capabilities";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/site/Footer";

export default function Page() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4">
        <Hero />
        <Capabilities />
        <Projects />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}
