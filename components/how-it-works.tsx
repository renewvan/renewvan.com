"use client";

import {
  BatteryCharging,
  Droplets,
  type LucideIcon,
  MonitorSmartphone,
  Router,
  Smartphone,
  ToggleLeft,
} from "lucide-react";
import { motion } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { BackgroundPattern } from "@/components/background-pattern";
import WorkflowItem from "@/components/blocks/workflow-item";

type Node = {
  icon: LucideIcon;
  title: string;
  description: string;
  meta: string;
};

const INPUTS: Node[] = [
  {
    icon: Droplets,
    title: "Tank",
    description:
      "ADS1115 resistive sender: voltage → resistance → level_pct, calibrated per sender.",
    meta: "renewvan/tank/<fresh|grey>/*",
  },
  {
    icon: BatteryCharging,
    title: "Battery",
    description:
      "Remaps Victron's native Venus OS MQTT feed for the house battery bank — no new sensing.",
    meta: "renewvan/battery/<id>/*",
  },
  {
    icon: ToggleLeft,
    title: "Relay",
    description:
      "ESP32 running ESPHome firmware, switching a binary on/off load like a light circuit.",
    meta: "renewvan/relay/<id>/state",
  },
];

const HUB: Node = {
  icon: Router,
  title: "renewvan",
  description:
    "A Raspberry Pi running the Mosquitto MQTT broker. Every node publishes here; every consumer reads from here — nothing talks directly to anything else.",
  meta: "MQTT",
};

const OUTPUTS: Node[] = [
  {
    icon: MonitorSmartphone,
    title: "Dashboard",
    description:
      "One responsive app for the in-van kiosk touchscreens and a web browser — same live view!",
    meta: "renewvan/dashboard",
  },
  {
    icon: Smartphone,
    title: "Mobile",
    description: "Same live view on your phone, works from outside the van.",
    meta: "renewvan/mobile",
  },
];

const STROKE = "color-mix(in oklab, var(--foreground) 20%, var(--background))";
const STROKE_BG =
  "bg-[color-mix(in_oklab,var(--foreground)20%,var(--background))]";
const CORNER_RADIUS = 14;

/**
 * Rounded elbow from (x1,y1) to (x2,y2), bending at xmid — the same
 * plumbing-diagram shape meeting-prep.tsx draws by hand per fixed card,
 * built generically here since our card heights are dynamic (text-length
 * dependent), not fixed like the reference's.
 */
function elbowPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  xmid: number,
) {
  if (Math.abs(y1 - y2) < 1) {
    return `M${x1} ${y1} L${x2} ${y2}`;
  }
  const r = Math.min(
    CORNER_RADIUS,
    Math.abs(xmid - x1),
    Math.abs(x2 - xmid),
    Math.abs(y2 - y1) / 2,
  );
  const hSign1 = xmid > x1 ? 1 : -1;
  const vSign = y2 > y1 ? 1 : -1;
  const hSign2 = x2 > xmid ? 1 : -1;
  return [
    `M${x1} ${y1}`,
    `L${xmid - r * hSign1} ${y1}`,
    `Q${xmid} ${y1} ${xmid} ${y1 + r * vSign}`,
    `L${xmid} ${y2 - r * vSign}`,
    `Q${xmid} ${y2} ${xmid + r * hSign2} ${y2}`,
    `L${x2} ${y2}`,
  ].join(" ");
}

function useMeasuredStack() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [size, setSize] = useState<{
    width: number;
    height: number;
    ys: number[];
  } | null>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const containerRect = container.getBoundingClientRect();
      const ys = itemRefs.current.map((el) => {
        if (!el) return containerRect.height / 2;
        const rect = el.getBoundingClientRect();
        return rect.top - containerRect.top + rect.height / 2;
      });
      setSize({ width: containerRect.width, height: containerRect.height, ys });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    for (const el of itemRefs.current) {
      if (el) ro.observe(el);
    }
    return () => ro.disconnect();
  }, []);

  return { containerRef, itemRefs, size };
}

function NodeGroup({
  items,
  side,
  delayStart,
}: {
  items: Node[];
  side: "left" | "right";
  delayStart: number;
}) {
  const { containerRef, itemRefs, size } = useMeasuredStack();
  const CONNECTOR_WIDTH = 64;
  const hubX = side === "left" ? CONNECTOR_WIDTH : 0;
  const stackX = side === "left" ? 0 : CONNECTOR_WIDTH;

  return (
    <div className="flex items-stretch gap-0">
      {side === "right" && (
        <div ref={containerRef} className="relative w-16 md:block hidden">
          {size &&
            items.map((item, i) => (
              <svg
                key={item.title}
                aria-hidden="true"
                className="absolute inset-0 h-full w-full overflow-visible"
                viewBox={`0 0 ${CONNECTOR_WIDTH} ${size.height}`}
              >
                <motion.path
                  d={elbowPath(
                    hubX,
                    size.height / 2,
                    stackX,
                    size.ys[i],
                    CONNECTOR_WIDTH / 2,
                  )}
                  fill="none"
                  stroke={STROKE}
                  strokeWidth={2}
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut",
                    delay: delayStart + i * 0.15,
                  }}
                />
              </svg>
            ))}
        </div>
      )}

      <div
        ref={side === "left" ? containerRef : undefined}
        className="flex flex-col justify-between gap-8 md:gap-6"
      >
        {items.map((item, i) => (
          <div key={item.title}>
            <div
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
            >
              <WorkflowItem
                type={side === "left" ? "input" : "output"}
                icon={<item.icon />}
                title={item.title}
                description={item.description}
                meta={item.meta}
                delay={side === "left" ? i * 0.15 : delayStart + 0.3 + i * 0.15}
              />
            </div>
            {i < items.length - 1 && (
              <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                  delay: delayStart + i * 0.15,
                }}
                style={{ transformOrigin: "top" }}
                className={`mx-auto h-8 w-0.5 md:hidden ${STROKE_BG}`}
              />
            )}
          </div>
        ))}
      </div>

      {side === "left" && (
        <div className="relative hidden w-16 md:block">
          {size &&
            items.map((item, i) => (
              <svg
                key={item.title}
                aria-hidden="true"
                className="absolute inset-0 h-full w-full overflow-visible"
                viewBox={`0 0 ${CONNECTOR_WIDTH} ${size.height}`}
              >
                <motion.path
                  d={elbowPath(
                    stackX,
                    size.ys[i],
                    hubX,
                    size.height / 2,
                    CONNECTOR_WIDTH / 2,
                  )}
                  fill="none"
                  stroke={STROKE}
                  strokeWidth={2}
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut",
                    delay: delayStart + i * 0.15,
                  }}
                />
              </svg>
            ))}
        </div>
      )}
    </div>
  );
}

export function HowItWorks() {
  return (
    <section id="features" className="relative py-24">
      <BackgroundPattern />
      <div className="mx-auto max-w-(--breakpoint-xl) px-6 text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          How it works
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Every sensor and switch in the van publishes to one hub. The hub is
          the only thing anything else talks to.
        </p>

        <div className="mt-12 flex flex-col items-center gap-0 md:flex-row md:items-center md:justify-center">
          <NodeGroup items={INPUTS} side="left" delayStart={0.5} />

          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.3, ease: "easeInOut", delay: 0.65 }}
            style={{ transformOrigin: "top" }}
            className={`h-8 w-0.5 md:hidden ${STROKE_BG}`}
          />

          <WorkflowItem
            type="hub"
            icon={<HUB.icon />}
            title={HUB.title}
            description={HUB.description}
            meta={HUB.meta}
            delay={0.9}
          />

          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.3, ease: "easeInOut", delay: 1.55 }}
            style={{ transformOrigin: "top" }}
            className={`h-8 w-0.5 md:hidden ${STROKE_BG}`}
          />

          <NodeGroup items={OUTPUTS} side="right" delayStart={1.7} />
        </div>
      </div>
    </section>
  );
}
