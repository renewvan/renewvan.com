import { BackgroundPattern } from "@/components/background-pattern";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <div>
      <div className="relative bg-primary/4">
        <Navbar />
        <Hero />
        <BackgroundPattern />
      </div>
      <HowItWorks />
    </div>
  );
}
