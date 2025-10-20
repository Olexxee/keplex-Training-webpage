import KeplexImage from "../utils/KeplexImage";

export default function VideoIntro() {
  return (
    <section
      id="video"
      className="relative w-full min-h-[70vh] py-16 md:py-24 bg-gradient-to-r from-[color:var(--neutral-dark)] to-[color:var(--brand-dark)]"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10 px-6 md:px-12">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-10">
            Introduction Videos
          </h2>

          {/* Two Video Divs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Lipcare Video */}
            <div className="rounded-xl overflow-hidden shadow-lg relative bg-neutral-900">
              {/* Label */}
              <div className="absolute top-3 left-3 bg-[color:var(--brand)] text-white px-3 py-1 text-sm rounded-md shadow-md z-20">
                Lipcare
              </div>

              {/* Thumbnail via KeplexImage */}
              <KeplexImage
                name="videoThumbLipcare"
                alt="Lipcare Video"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40"></div>

              {/* Video iframe */}
              <div className="relative w-full h-[300px] md:h-[400px]">
                <iframe
                  src="https://www.youtube.com/embed/YOUR_VIDEO_ID_1"
                  title="Keplex Lipcare Intro"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            {/* Resin Video */}
            <div className="rounded-xl overflow-hidden shadow-lg relative bg-neutral-900">
              {/* Label */}
              <div className="absolute top-3 left-3 bg-[color:var(--accent-dark)] text-white px-3 py-1 text-sm rounded-md shadow-md z-20">
                Resin
              </div>

              {/* Thumbnail via KeplexImage */}
              <KeplexImage
                name="videoThumbResin"
                alt="Resin Video"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40"></div>

              {/* Video iframe */}
              <div className="relative w-full h-[300px] md:h-[400px]">
                <iframe
                  src="https://www.youtube.com/embed/YOUR_VIDEO_ID_2"
                  title="Keplex Resin Intro"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
