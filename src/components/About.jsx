export default function About() {
  return (
    <section className="relative w-full min-h-[40vh] py-10 md:py-16 bg-gradient-to-r from-[color:var(--brand-light)] via-[color:var(--brand)] to-[color:var(--brand-dark)]">
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-white/70 md:bg-white/80"></div>

      {/* Content */}
      <div className="relative z-10 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[color:var(--brand-dark)]">
            About <span className="text-[color:var(--brand)]">Me</span>
          </h2>

          <p className="text-lg text-[color:var(--neutral-dark)] leading-relaxed mb-4">
            Hello, I’m{" "}
            <span className="font-semibold text-[color:var(--brand)]">
              Kepemi Oluwafunke (Keplex)
            </span>{" "}
            —the creative mind behind{" "}
            <span className="text-[color:var(--accent-dark)]">
              Keplex Resin Craft Hub
            </span>{" "}
            and{" "}
            <span className="text-[color:var(--accent)]">Keplex Cosmetics</span>
            . My journey began with a deep love for beauty, self-care, and
            handmade art.
          </p>

          <p className="text-lg text-[color:var(--neutral-dark)] leading-relaxed mb-4">
            In 2023, I officially began my{" "}
            <span className="text-[color:var(--aqua)]">resin art training</span>
            , and since then, I’ve proudly tutored{" "}
            <span className="font-semibold text-[color:var(--brand-dark)]">
              1,300+ students
            </span>{" "}
            in creating stunning and personalized resin crafts. In 2024, I
            expanded my passion into{" "}
            <span className="text-[color:var(--lavender)]">
              lip-care formulation
            </span>
            , launching trainings that help people create effective, safe, and
            beautiful lip products.
          </p>

          <p className="text-lg text-[color:var(--neutral-dark)] leading-relaxed mb-4">
            My mission is simple: to{" "}
            <span className="font-semibold text-[color:var(--brand)]">
              empower others
            </span>{" "}
            to create, care, and build. That’s why I combine{" "}
            <span className="text-[color:var(--accent-dark)]">
              practical training
            </span>
            , <span className="text-[color:var(--aqua)]">mentorship</span>, and{" "}
            <span className="text-[color:var(--lavender)]">
              business support
            </span>{" "}
            —so you not only learn the craft but also gain the confidence to
            turn your skills into profit.
          </p>

          <p className="text-lg text-[color:var(--neutral-dark)] leading-relaxed">
            Here, you’ll find a space where{" "}
            <span className="font-semibold text-[color:var(--accent)]">
              creativity meets opportunity
            </span>
            . Whether you’re passionate about resin art, want to start your own
            lip-care line, or simply love learning something new, I’m here to
            guide you every step of the way.
          </p>

          <p className="text-xl font-semibold text-[color:var(--brand-dark)] mt-6">
            ✨ Let’s create, grow, and shine—together. ✨
          </p>
        </div>
      </div>
    </section>
  );
}
