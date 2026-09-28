import { BackgroundPattern } from "@/components/background-pattern";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <div className="relative bg-primary/4">
      <Navbar />
      <Hero />
      <BackgroundPattern />
    </div>
  );
}
