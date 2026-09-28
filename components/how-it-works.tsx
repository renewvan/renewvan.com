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
    title: "node-tank",
    description:
      "ADS1115 resistive sender: voltage → resistance → level_pct, calibrated per sender.",
    meta: "renewvan/tank/<fresh|grey>/*",
  },
  {
    icon: BatteryCharging,
    title: "node-battery",
    description:
      "Remaps Victron's native Venus OS MQTT feed for the house battery bank — no new sensing.",
    meta: "renewvan/battery/<id>/*",
  },
  {
    icon: ToggleLeft,
    title: "node-relay",
    description:
      "ESP32 running ESPHome firmware, switching a binary on/off load like a light circuit.",
    meta: "renewvan/relay/<id>/state",
  },
];

const HUB: Node = {
  icon: Router,
  title: "renewvan hub",
  description:
    "A Raspberry Pi running the Mosquitto MQTT broker. Every node publishes here; every consumer reads from here — nothing talks directly to anything else.",
  meta: "Mosquitto · retained topics",
};

const OUTPUTS: Node[] = [
  {
    icon: MonitorSmartphone,
    title: "Dashboard",
    description:
      'One responsive app for the 7" in-van kiosk touchscreen and a laptop browser — same live view.',
    meta: "renewvan/dashboard",
  },
  {
    icon: Smartphone,
    title: "Mobile",
    description:
      "Read-only phone app, checkable from outside the van without a browser.",
    meta: "renewvan/mobile",
  },
];

const CONNECTOR =
  "bg-[color-mix(in_oklab,var(--foreground)20%,var(--background))]";

function Bracket({
  items,
  side,
  delayStart,
}: {
  items: Node[];
  side: "left" | "right";
  delayStart: number;
}) {
  const stubDelay = delayStart + 0.1;

  return (
    <div className="flex flex-col items-center gap-8 md:flex-row md:items-center">
      {side === "left" && (
        <div className="flex flex-col gap-8 md:gap-6">
          {items.map((item, i) => (
            <div key={item.title} className="relative flex items-center gap-6">
              <WorkflowItem
                type="input"
                icon={<item.icon />}
                title={item.title}
                description={item.description}
                meta={item.meta}
                delay={i * 0.15}
              />
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                  delay: stubDelay,
                }}
                style={{ transformOrigin: "left" }}
                className={`hidden h-0.5 w-6 md:block ${CONNECTOR}`}
              />
            </div>
          ))}
        </div>
      )}

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.4, ease: "easeInOut", delay: delayStart }}
        style={{ transformOrigin: side === "left" ? "right" : "left" }}
        className={`h-8 w-0.5 md:h-0.5 md:w-10 ${CONNECTOR}`}
      />

      {side === "right" && (
        <div className="flex flex-col gap-8 md:gap-6">
          {items.map((item, i) => (
            <div key={item.title} className="relative flex items-center gap-6">
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                  delay: stubDelay,
                }}
                style={{ transformOrigin: "left" }}
                className={`hidden h-0.5 w-6 md:block ${CONNECTOR}`}
              />
              <WorkflowItem
                type="output"
                icon={<item.icon />}
                title={item.title}
                description={item.description}
                meta={item.meta}
                delay={delayStart + 0.3 + i * 0.15}
              />
            </div>
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

        <div className="mt-12 flex flex-col items-center gap-8 md:flex-row md:items-center md:justify-center">
          <Bracket items={INPUTS} side="left" delayStart={0.5} />

          <WorkflowItem
            type="hub"
            icon={<HUB.icon />}
            title={HUB.title}
            description={HUB.description}
            meta={HUB.meta}
            delay={0.9}
          />

          <Bracket items={OUTPUTS} side="right" delayStart={1.7} />
        </div>
      </div>
    </section>
  );
}
