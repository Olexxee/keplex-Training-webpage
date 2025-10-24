import { useState } from "react";
import FeatureCard from "../constants/FeatureCard";

const features = [
  {
    title: "Practical Curriculum",
    desc: "Hands-on lessons designed for real results. From resin art to lip-care formulation, our courses combine theory with practical projects you can immediately apply.",
    image: "keplex2",
  },
  {
    title: "Learning Support",
    desc: "Step-by-step guidiance, resources and feedback to ensure you fully understand each lesson and can practice with confidence.",
    image: "craft",
  },
  {
    title: "Full Mentorship",
    desc: "Personalized mentorship to help you overcome challenges, refine your skills, and achieve your creative goals.",
    image: "practical",
  },
];

export default function Features() {
  const [hovered, setHovered] = useState(null);

  return (
    <section className="w-full min-h-[60vh] py-12 md:py-20 bg-white">
      <div className="px-4 md:px-12 max-w-6xl mx-auto grid gap-8 md:grid-cols-3">
        {features.map((f) => (
          <FeatureCard
            key={f.title}
            feature={f}
            isHovered={hovered === f.title}
            setHovered={setHovered}
          />
        ))}
      </div>
    </section>
  );
}
