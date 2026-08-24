"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import type { ImageRef } from "@/content";

/**
 * A photograph that drifts slightly against the scroll.
 *
 * Split out of `Figure` so that the ornamental plate — which is what renders
 * everywhere until the committee supplies photographs — stays a server
 * component and ships no JavaScript at all.
 */
export function ParallaxImage({
  image,
  amount,
  sizes,
  priority,
}: {
  image: ImageRef;
  /** How far the image drifts, in percent of its own height. */
  amount: number;
  sizes: string;
  priority?: boolean;
}) {
  const frame = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: frame,
    offset: ["start end", "end start"],
  });

  // The image is oversized inside the frame, so drifting never reveals an
  // edge. Keep the range small — this should be felt, not noticed.
  const y = useTransform(scrollYProgress, [0, 1], [`-${amount}%`, `${amount}%`]);

  return (
    <div ref={frame} className="absolute inset-0">
      <motion.div className="absolute inset-x-0 -inset-y-[12%]" style={{ y }}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          quality={85}
          className="object-cover"
        />
      </motion.div>
    </div>
  );
}
