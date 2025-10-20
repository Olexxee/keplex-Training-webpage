import { localImages } from "./localImgHandler";

// Remote sources as fallback
const remoteImageMap = {
  hero: "https://source.unsplash.com/1600x900/?conference,training",
  features: "https://source.unsplash.com/1600x900/?workspace,team",
  video: "https://source.unsplash.com/1600x900/?learning,lecture",
  about: "https://source.unsplash.com/1600x900/?team,office",
  registration: "https://source.unsplash.com/1600x900/?office,workspace",
  footer: "https://source.unsplash.com/1600x900/?technology,network",
};

export default function KeplexImage({
  name,
  alt = "",
  className = "",
  ...props
}) {
  // Try local → remote → default hero
  const src = localImages[name] || remoteImageMap[name] || remoteImageMap.hero;

  return (
    <img
      src={src}
      alt={alt || name}
      className={`object-cover ${className}`}
      {...props}
    />
  );
}
