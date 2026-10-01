import Image from "next/image";
import { Button } from "./ui/button";

export function Hero() {
  return (
    <div className="relative min-h-[32rem] md:min-h-[38rem] py-16 overflow-hidden flex items-center">
      <Image
        src="/renewvan-dashboard-side.jpg"
        alt="renewvan dashboard"
        fill
        className="object-cover -z-20"
        priority
      />
      <div className="absolute inset-0 -z-10 bg-black/40 dark:bg-black/70" />

      <div className="w-full max-w-(--breakpoint-xl) mx-auto text-center px-6">
        <strong className="font-semibold text-white/80">
          Open-source, open-hardware campervan monitoring
        </strong>
        <h1 className="mt-5 max-w-3xl mx-auto text-4xl sm:text-5xl md:text-6xl leading-[1.1] font-semibold tracking-tighter text-balance text-white">
          Know your van, from anywhere
        </h1>
        <div className="mt-8 max-w-3xl mx-auto text-lg text-white/80 text-balance">
          <p>
            <b className="text-white">renewvan</b> puts your tanks, batteries,
            and switches on one live dashboard — in the van on a touchscreen, or
            on your phone down the street. Vendor-agnostic, open hardware, no
            subscription.
          </p>
        </div>
        <div className="mt-12 flex gap-4 justify-center">
          <Button size="lg">View the hardware</Button>
          <Button
            variant="outline"
            size="lg"
            className="bg-transparent text-white border-white/40 hover:bg-white/10 hover:text-white"
          >
            Read the docs
          </Button>
        </div>
      </div>
    </div>
  );
}
