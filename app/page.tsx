import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Values from "@/components/sections/Values";
import Stats from "@/components/sections/Stats";
import Enrollment from "@/components/sections/Enrollment";
import Programs from "@/components/sections/Programs";
import Testimonials from "@/components/sections/Testimonials";
import Blog from "@/components/sections/Blog";
import Contact from "@/components/sections/Contact";
import Chatbot from "@/components/chatbot/Chatbot";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Values />
        <Stats />
        <Enrollment />
        <Programs />
        <Testimonials />
        <Blog />
        <Contact />
      </main>
      <Footer />
      <Chatbot />
    </>
  );
}
