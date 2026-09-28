"use client";

import {
  ArrowRight,
  BatteryCharging,
  Droplets,
  Gauge,
  type LucideIcon,
  MonitorSmartphone,
  Radio,
  ToggleLeft,
} from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { BackgroundPattern } from "@/components/background-pattern";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type Category = "input" | "action" | "output";

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
  action:
    "bg-[color-mix(in_oklab,var(--color-amber-600)20%,var(--background))] text-amber-600 dark:bg-[color-mix(in_oklab,var(--color-amber-400)20%,var(--background))] dark:text-amber-400",
  output:
    "bg-[color-mix(in_oklab,var(--color-emerald-600)20%,var(--background))] text-emerald-600 dark:bg-[color-mix(in_oklab,var(--color-emerald-400)20%,var(--background))] dark:text-emerald-400",
};

const PIPELINES: Record<string, Step[]> = {
  tanks: [
    {
      category: "input",
      icon: Droplets,
      title: "node-tank",
      description:
        "ADS1115 resistive sender: voltage → resistance → level_pct, calibrated per sender.",
      meta: "ADS1115 · calibrated",
    },
    {
      category: "action",
      icon: Radio,
      title: "renewvan bus",
      description:
        "Retained MQTT publish, plus a status field (ok / open_circuit / short_circuit).",
      meta: "renewvan/tank/<fresh|grey>/*",
    },
    {
      category: "output",
      icon: Gauge,
      title: "Dashboard",
      description:
        "Radial gauge and liters-remaining readout on the kiosk touchscreen and phone app.",
      meta: "kiosk + phone",
    },
  ],
  power: [
    {
      category: "input",
      icon: BatteryCharging,
      title: "node-battery",
      description:
        "Remaps Victron's native Venus OS MQTT feed for the house battery bank — no new sensing.",
      meta: "Victron Venus OS",
    },
    {
      category: "action",
      icon: Radio,
      title: "renewvan bus",
      description:
        "Retained publish: state of charge, voltage, current, power, and temperature.",
      meta: "renewvan/battery/<id>/*",
    },
    {
      category: "output",
      icon: Gauge,
      title: "Dashboard",
      description:
        "SoC gauge, voltage/current/power/temperature readout, and a charge_state badge.",
      meta: "kiosk + phone",
    },
  ],
  switches: [
    {
      category: "input",
      icon: ToggleLeft,
      title: "node-relay",
      description:
        "ESP32 running ESPHome firmware, switching a binary on/off load like a light circuit.",
      meta: "ESP32 · ESPHome",
    },
    {
      category: "action",
      icon: Radio,
      title: "renewvan bus",
      description: "Retained publish of the relay's current on/off state.",
      meta: "renewvan/relay/<id>/state",
    },
    {
      category: "output",
      icon: MonitorSmartphone,
      title: "Dashboard",
      description:
        "One row per relay with a read-only on/off indicator — no tap-to-toggle in v0.",
      meta: "read-only",
    },
  ],
};

const TABS = [
  { value: "tanks", label: "Tanks" },
  { value: "power", label: "Power" },
  { value: "switches", label: "Switches" },
] as const;

function Pipeline({ steps }: { steps: Step[] }) {
  const [revealed, setRevealed] = useState(1);

  useEffect(() => {
    setRevealed(1);
    if (steps.length <= 1) return;
    const id = setInterval(() => {
      setRevealed((n) => (n >= steps.length ? 1 : n + 1));
    }, 1400);
    return () => clearInterval(id);
  }, [steps]);

  return (
    <div className="flex flex-col items-center gap-6 md:flex-row md:items-stretch md:justify-center">
      {steps.map((step, i) => (
        <Fragment key={step.title}>
          <div
            className={cn(
              "w-full max-w-sm rounded-xl border bg-card p-4 text-left text-card-foreground shadow-lg transition-opacity duration-500 md:w-72",
              i < revealed ? "opacity-100" : "opacity-30",
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
              <step.icon className="size-5" aria-hidden />
              {step.title}
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {step.description}
            </p>
            <Badge
              variant="outline"
              className="mt-3 font-mono text-[11px] font-normal text-muted-foreground"
            >
              {step.meta}
            </Badge>
          </div>
          {i < steps.length - 1 && (
            <ArrowRight
              className={cn(
                "size-5 shrink-0 rotate-90 text-muted-foreground/40 transition-opacity duration-500 md:rotate-0",
                i < revealed ? "opacity-100" : "opacity-0",
              )}
              aria-hidden
            />
          )}
        </Fragment>
      ))}
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
          Every sensor and switch in the van normalizes onto one MQTT bus, then
          shows up live on the dashboard — no cloud, no polling.
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
              <Pipeline steps={PIPELINES[tab.value]} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
