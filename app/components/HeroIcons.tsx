import Image from "next/image";

type IconSpec = {
  src: string;
  alt: string;
  tx: string;
  ty: string;
  rot: string;
  delay: string;
};

const SPRING_DURATION = "0.85s";

const LEFT_ICONS: IconSpec[] = [
  { src: "/icons/vscode.png", alt: "VS Code", tx: "-190px", ty: "-150px", rot: "-12deg", delay: "0.12s" },
  { src: "/icons/linux.png", alt: "Linux", tx: "-295px", ty: "-5px", rot: "0deg", delay: "0.26s" },
  { src: "/icons/github.png", alt: "GitHub", tx: "-190px", ty: "140px", rot: "12deg", delay: "0.4s" },
];

const RIGHT_ICONS: IconSpec[] = [
  { src: "/icons/docker.png", alt: "Docker", tx: "190px", ty: "-150px", rot: "12deg", delay: "0.12s" },
  { src: "/icons/arduino.png", alt: "Arduino", tx: "295px", ty: "-5px", rot: "0deg", delay: "0.26s" },
  { src: "/icons/docker-moby.png", alt: "Docker Moby", tx: "190px", ty: "140px", rot: "-12deg", delay: "0.4s" },
];

function HeroIcon({ icon }: { icon: IconSpec }) {
  const floatDelay = `calc(${icon.delay} + ${SPRING_DURATION})`;
  return (
    <span
      className="hero-icon-spring"
      style={
        {
          "--tx": icon.tx,
          "--ty": icon.ty,
          "--rot": icon.rot,
          "--d": icon.delay,
        } as React.CSSProperties
      }
    >
      <span className="hero-icon-float" style={{ "--fd": floatDelay } as React.CSSProperties}>
        <Image
          src={icon.src}
          alt={icon.alt}
          width={56}
          height={56}
          className="w-full h-full object-contain rounded-2xl bg-white border border-mist/70 shadow-[0_12px_30px_-12px_rgba(22,58,122,0.18)]"
        />
      </span>
    </span>
  );
}

export default function HeroIcons() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
    >
      <div className="relative w-0 h-0 scale-[0.45] sm:scale-[0.65] lg:scale-90 xl:scale-100">
        {[...LEFT_ICONS, ...RIGHT_ICONS].map((icon) => (
          <HeroIcon key={icon.src} icon={icon} />
        ))}
      </div>
    </div>
  );
}
