import Hero from "./components/Hero";
import Features from "./components/Features";
import VideoIntro from "./components/VideoIntro";
import About from "./components/About";
import Registration from "./components/Register";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import KeplexImage from "./utils/KeplexImage";
import TestimonialsSection from "./components/TestimonialsSection";

export default function App() {
  return (
    <div className="w-full min-h-screen font-sans text-gray-900">
      <Navbar />
      <Hero />
      <About />
      <Features />
      <VideoIntro />
      <Registration />
      <TestimonialsSection />
      <Footer />
    </div>
  );
}
