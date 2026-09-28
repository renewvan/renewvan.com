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
import { useState } from "react";
import { BackgroundPattern } from "@/components/background-pattern";
import ArrowBottom from "@/components/blocks/arrow-bottom";
import ArrowRight from "@/components/blocks/arrow-right";
import WorkflowItem from "@/components/blocks/workflow-item";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TabValue = "tanks" | "power" | "switches";

type Node = {
  icon: LucideIcon;
  title: string;
  description: string;
  meta: string;
};

const NODES: Record<TabValue, Node> = {
  tanks: {
    icon: Droplets,
    title: "node-tank",
    description:
      "ADS1115 resistive sender: voltage → resistance → level_pct, calibrated per sender.",
    meta: "renewvan/tank/<fresh|grey>/*",
  },
  power: {
    icon: BatteryCharging,
    title: "node-battery",
    description:
      "Remaps Victron's native Venus OS MQTT feed for the house battery bank — no new sensing.",
    meta: "renewvan/battery/<id>/*",
  },
  switches: {
    icon: ToggleLeft,
    title: "node-relay",
    description:
      "ESP32 running ESPHome firmware, switching a binary on/off load like a light circuit.",
    meta: "renewvan/relay/<id>/state",
  },
};

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

const TABS: { value: TabValue; label: string }[] = [
  { value: "tanks", label: "Tanks" },
  { value: "power", label: "Power" },
  { value: "switches", label: "Switches" },
];

function Pipeline({ node }: { node: Node }) {
  return (
    <div className="flex flex-col items-center gap-8 md:flex-row md:items-center md:justify-center md:gap-16">
      <WorkflowItem
        type="input"
        icon={<node.icon />}
        title={node.title}
        description={node.description}
        meta={node.meta}
        delay={0}
        className="relative"
      >
        <ArrowRight delay={0.5} />
        <ArrowBottom delay={0.5} />
      </WorkflowItem>

      <WorkflowItem
        type="hub"
        icon={<HUB.icon />}
        title={HUB.title}
        description={HUB.description}
        meta={HUB.meta}
        delay={0.9}
        className="relative"
      />

      <div className="flex flex-col items-center gap-8 md:flex-row md:items-center">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.4, ease: "easeInOut", delay: 1.5 }}
          style={{ transformOrigin: "left" }}
          className="h-8 w-0.5 origin-top bg-[color-mix(in_oklab,var(--foreground)20%,var(--background))] md:h-0.5 md:w-10"
        />
        <div className="flex flex-col gap-8 md:gap-6">
          {OUTPUTS.map((output, i) => (
            <div
              key={output.title}
              className="relative flex items-center gap-6"
            >
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut", delay: 1.7 }}
                style={{ transformOrigin: "left" }}
                className="hidden h-0.5 w-6 bg-[color-mix(in_oklab,var(--foreground)20%,var(--background))] md:block"
              />
              <WorkflowItem
                type="output"
                icon={<output.icon />}
                title={output.title}
                description={output.description}
                meta={output.meta}
                delay={1.9 + i * 0.15}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function HowItWorks() {
  const [active, setActive] = useState<TabValue>("tanks");

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
        <Tabs
          value={active}
          onValueChange={(value) => setActive(value as TabValue)}
          className="mt-12"
        >
          <TabsList className="mx-auto">
            {TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={active} className="pt-10">
            <Pipeline key={active} node={NODES[active]} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
