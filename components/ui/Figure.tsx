import Image from "next/image";

import { LotusRule, Mandala } from "@/components/ui/Ornament";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import type { ImageRef } from "@/content";
import { cn } from "@/lib/cn";

/**
 * FIGURE
 *
 * One component for every picture on the site, and — importantly — for every
 * picture that does not exist yet.
 *
 * With an image it renders a lazily-loaded photograph, optionally drifting
 * against the scroll. Without one it renders an ornamental plate: a framed
 * panel carrying the mandala and a lotus rule.
 *
 * The plate is a deliberate choice, not a fallback. A real community
 * festival's site should not be padded out with stock or AI-generated
 * photographs of other people's celebrations, and an empty grey box would
 * look broken. The plate looks composed — and the day a photograph arrives it
 * drops straight in with no layout change.
 *
 * This is a server component; only the parallax variant pulls in any client
 * JavaScript, so the plates cost nothing.
 */

type Props = {
  image?: ImageRef;
  /** Small caption set beneath the frame. */
  caption?: string;
  /** Label shown inside the ornamental plate when there is no image. */
  plateLabel?: string;
  className?: string;
  /** CSS aspect-ratio, e.g. "4 / 5". */
  ratio?: string;
  /** Percent of drift against the scroll. 0 renders a plain image. */
  parallax?: number;
  priority?: boolean;
  sizes?: string;
  tone?: "cream" | "maroon";
};

export function Figure({
  image,
  caption,
  plateLabel,
  className,
  ratio = "4 / 5",
  parallax = 8,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  tone = "cream",
}: Props) {
  return (
    <figure className={className}>
      <div
        className={cn(
          "relative overflow-hidden",
          tone === "cream" ? "bg-cream" : "bg-maroon-900",
        )}
        style={{ aspectRatio: ratio }}
      >
        {!image ? (
          <OrnamentalPlate label={plateLabel} tone={tone} />
        ) : parallax > 0 ? (
          <ParallaxImage
            image={image}
            amount={parallax}
            sizes={sizes}
            priority={priority}
          />
        ) : (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover"
          />
        )}
      </div>

      {caption && (
        <figcaption
          className={cn(
            "mt-3.5 font-sans text-[0.6875rem] tracking-[0.18em] uppercase",
            tone === "cream" ? "text-char-600/85" : "text-cream/75",
          )}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function OrnamentalPlate({
  label,
  tone,
}: {
  label?: string;
  tone: "cream" | "maroon";
}) {
  const ink = tone === "cream" ? "text-maroon" : "text-gold";

  return (
    <div
      aria-hidden="true"
      className={cn(
        "grain absolute inset-0 grid place-items-center overflow-hidden",
        tone === "cream"
          ? "bg-[linear-gradient(160deg,#f1e6d0_0%,#ead9ba_58%,#dfcaa3_100%)]"
          : "bg-[linear-gradient(160deg,#6e1025_0%,#4a0a18_100%)]",
      )}
    >
      <Mandala
        className={cn(
          "absolute -right-[20%] -bottom-[26%] h-[150%] w-[150%]",
          ink,
          tone === "cream" ? "opacity-[0.22]" : "opacity-[0.28]",
        )}
      />

      {/* Inset hairline: turns a flat panel into a framed plate. */}
      <span
        className={cn(
          "absolute inset-3 border",
          tone === "cream" ? "border-maroon/12" : "border-gold/20",
        )}
      />

      <div className="relative flex flex-col items-center gap-4 px-8 text-center">
        <LotusRule
          className={cn("w-32", ink, tone === "cream" ? "opacity-70" : "opacity-80")}
        />
        {label && (
          <span
            className={cn(
              "font-sans text-[0.625rem] tracking-[0.3em] uppercase",
              tone === "cream" ? "text-maroon/80" : "text-cream/75",
            )}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
