import { useState, useRef } from "react";
import KeplexImage from "../utils/KeplexImage";
import { localImages } from "../utils/localImgHandler";
import { Play } from "lucide-react";

export default function VideoIntro() {
  const [isPlaying, setIsPlaying] = useState({ lipcare: false, resin: false });

  const handlePlay = (key) => {
    setIsPlaying({ lipcare: key === "lipcare", resin: key === "resin" });
  };

  return (
    <section
      id="video"
      className="relative w-full min-h-[70vh] py-16 md:py-24 bg-gradient-to-r from-[color:var(--neutral-dark)] to-[color:var(--brand-dark)]"
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 px-6 md:px-12">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-10">
            Introduction Videos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <VideoCard
              label="Lipcare"
              color="var(--brand)"
              src={localImages.lipcarevid}
              thumbName="videoThumbLipcare"
              isPlaying={isPlaying.lipcare}
              onPlay={() => handlePlay("lipcare")}
            />
            <VideoCard
              label="Resin"
              color="var(--accent-dark)"
              src={localImages.resinvideo}
              thumbName="videoThumbResin"
              isPlaying={isPlaying.resin}
              onPlay={() => handlePlay("resin")}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function VideoCard({ label, color, src, thumbName, isPlaying, onPlay }) {
  const videoRef = useRef(null);

  const handlePlayClick = async () => {
    onPlay();
    if (videoRef.current) {
      try {
        await videoRef.current.play();
      } catch (err) {
        console.warn("Playback failed:", err);
      }
    }
  };

  return (
    <div className="rounded-xl overflow-hidden shadow-lg relative bg-neutral-900">
      <div
        className="absolute top-3 left-3 text-white px-3 py-1 text-sm rounded-md shadow-md z-20"
        style={{ backgroundColor: color }}
      >
        {label}
      </div>

      {!isPlaying && (
        <>
          <KeplexImage
            name={thumbName}
            alt={`${label} Thumbnail`}
            className="absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-500"
          />
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <button
            onClick={handlePlayClick}
            className="absolute inset-0 z-20 flex items-center justify-center text-white hover:scale-110 transition-transform duration-300"
          >
            <div className="p-4 bg-white/20 backdrop-blur-md rounded-full">
              <Play size={50} strokeWidth={1.5} />
            </div>
          </button>
        </>
      )}

      <div className="relative w-full h-[300px] md:h-[400px]">
        <video
          ref={videoRef}
          src={src}
          title={`${label} Intro`}
          className="w-full h-full object-cover"
          controls
          playsInline
        />
      </div>
    </div>
  );
}
