import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { MotionPreset } from "@/components/ui/motion-preset";
import { cn } from "@/lib/utils";

type WorkflowItemProps = {
  type: "input" | "hub" | "output";
  icon: ReactNode;
  title: string;
  description: string;
  meta: string;
  className?: string;
  children?: ReactNode;
  delay?: number;
};

const WorkflowItem = ({
  type,
  icon,
  title,
  description,
  meta,
  className,
  children,
  delay = 0,
}: WorkflowItemProps) => {
  return (
    <MotionPreset
      fade
      slide={{ direction: "up", offset: 16 }}
      transition={{ duration: 0.5 }}
      delay={delay}
      inView={false}
      className={cn(
        "relative z-1 w-full pt-7.5 max-md:max-w-sm md:w-64",
        className,
      )}
    >
      <div
        className={cn(
          "absolute top-0 left-0 -z-1 flex items-center gap-2.5 rounded-t-xl p-4 pt-1.5 capitalize",
          {
            "bg-[color-mix(in_oklab,var(--color-sky-600)20%,var(--background))] text-sky-600 dark:bg-[color-mix(in_oklab,var(--color-sky-400)20%,var(--background))] dark:text-sky-400":
              type === "input",
            "bg-[color-mix(in_oklab,var(--primary)20%,var(--background))] text-primary":
              type === "hub",
            "bg-[color-mix(in_oklab,var(--color-green-600)20%,var(--background))] text-green-600 dark:bg-[color-mix(in_oklab,var(--color-green-400)20%,var(--background))] dark:text-green-400":
              type === "output",
          },
        )}
      >
        <span className="text-sm font-medium">{type}</span>
      </div>

      <div
        className={cn(
          "bg-card text-card-foreground flex flex-col gap-3.5 rounded-xl border p-4 shadow-lg",
          type === "hub" && "border-primary/40",
        )}
      >
        <div className="flex flex-col gap-2">
          <div className="flex w-full items-center gap-2.5">
            <span className="[&>svg]:size-5">{icon}</span>
            <div className="grow font-medium">{title}</div>
          </div>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>

        {children}

        <div className="flex items-end justify-end">
          <Badge
            variant="outline"
            className="text-muted-foreground rounded-sm px-1.5 font-mono text-[11px] font-normal"
          >
            {meta}
          </Badge>
        </div>
      </div>
    </MotionPreset>
  );
};

export default WorkflowItem;
