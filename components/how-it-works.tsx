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
import { useEffect, useState } from "react";
import { BackgroundPattern } from "@/components/background-pattern";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type Category = "input" | "hub" | "output";

type Step = {
  category: Category;
  icon: LucideIcon;
  title: string;
  description: string;
  meta: string;
};

const CATEGORY_STYLE: Record<Category, string> = {
  input:
    "bg-[color-mix(in_oklab,var(--color-sky-600)20%,var(--background))] text-sky-600 dark:bg-[color-mix(in_oklab,var(--color-sky-400)20%,var(--background))] dark:text-sky-400",
  hub: "bg-[color-mix(in_oklab,var(--primary)20%,var(--background))] text-primary",
  output:
    "bg-[color-mix(in_oklab,var(--color-emerald-600)20%,var(--background))] text-emerald-600 dark:bg-[color-mix(in_oklab,var(--color-emerald-400)20%,var(--background))] dark:text-emerald-400",
};

const NODES: Record<string, Step> = {
  tanks: {
    category: "input",
    icon: Droplets,
    title: "node-tank",
    description:
      "ADS1115 resistive sender: voltage → resistance → level_pct, calibrated per sender.",
    meta: "renewvan/tank/<fresh|grey>/*",
  },
  power: {
    category: "input",
    icon: BatteryCharging,
    title: "node-battery",
    description:
      "Remaps Victron's native Venus OS MQTT feed for the house battery bank — no new sensing.",
    meta: "renewvan/battery/<id>/*",
  },
  switches: {
    category: "input",
    icon: ToggleLeft,
    title: "node-relay",
    description:
      "ESP32 running ESPHome firmware, switching a binary on/off load like a light circuit.",
    meta: "renewvan/relay/<id>/state",
  },
};

const HUB: Step = {
  category: "hub",
  icon: Router,
  title: "renewvan hub",
  description:
    "A Raspberry Pi running the Mosquitto MQTT broker. Every node publishes here; every consumer reads from here — nothing talks directly to anything else.",
  meta: "Mosquitto · retained topics",
};

const OUTPUTS: Step[] = [
  {
    category: "output",
    icon: MonitorSmartphone,
    title: "Dashboard",
    description:
      'One responsive app for the 7" in-van kiosk touchscreen and a laptop browser — same live view.',
    meta: "renewvan/dashboard",
  },
  {
    category: "output",
    icon: Smartphone,
    title: "Mobile",
    description:
      "Read-only phone app, checkable from outside the van without a browser.",
    meta: "renewvan/mobile",
  },
];

const TABS = [
  { value: "tanks", label: "Tanks" },
  { value: "power", label: "Power" },
  { value: "switches", label: "Switches" },
] as const;

function NodeCard({ step, visible }: { step: Step; visible: boolean }) {
  const Icon = step.icon;
  return (
    <div
      className={cn(
        "w-full max-w-sm rounded-xl border bg-card p-4 text-left text-card-foreground shadow-lg transition-opacity duration-500 md:w-64",
        step.category === "hub" && "border-primary/40",
        visible ? "opacity-100" : "opacity-30",
      )}
    >
      <span
        className={cn(
          "mb-3 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize",
          CATEGORY_STYLE[step.category],
        )}
      >
        {step.category}
      </span>
      <div className="flex items-center gap-2.5 font-medium">
        <Icon className="size-5" aria-hidden />
        {step.title}
      </div>
      <p className="mt-1.5 text-sm text-muted-foreground">{step.description}</p>
      <Badge
        variant="outline"
        className="mt-3 font-mono text-[11px] font-normal text-muted-foreground"
      >
        {step.meta}
      </Badge>
    </div>
  );
}

function Pipeline({ node }: { node: Step }) {
  const [stage, setStage] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setStage((s) => (s >= 3 ? 1 : s + 1));
    }, 1400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-center">
      <NodeCard step={node} visible={stage >= 1} />

      <div
        className={cn(
          "h-8 w-0.5 bg-[color-mix(in_oklab,var(--foreground)20%,var(--background))] transition-opacity duration-500 md:h-0.5 md:w-10",
          stage >= 2 ? "opacity-100" : "opacity-0",
        )}
      />

      <NodeCard step={HUB} visible={stage >= 2} />

      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        <div
          className={cn(
            "h-8 w-0.5 bg-[color-mix(in_oklab,var(--foreground)20%,var(--background))] transition-opacity duration-500 md:h-0.5 md:w-10",
            stage >= 3 ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          className={cn(
            "flex flex-col gap-6 transition-opacity duration-500 md:border-l-2 md:border-[color-mix(in_oklab,var(--foreground)20%,var(--background))] md:pl-6",
            stage >= 3 ? "opacity-100" : "opacity-0",
          )}
        >
          {OUTPUTS.map((output) => (
            <div key={output.title} className="relative">
              <span className="absolute top-1/2 -left-6 hidden h-0.5 w-6 bg-[color-mix(in_oklab,var(--foreground)20%,var(--background))] md:block" />
              <NodeCard step={output} visible={stage >= 3} />
            </div>
          ))}
        </div>
      </div>
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
        <Tabs defaultValue="tanks" className="mt-12">
          <TabsList className="mx-auto">
            {TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {TABS.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="pt-10">
              <Pipeline node={NODES[tab.value]} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
