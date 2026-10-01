import { MenuIcon, XIcon } from "lucide-react";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import { ThemeToggle } from "./theme-toggle";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export function Navbar() {
  return (
    <div className="px-6 max-w-(--breakpoint-xl) mx-auto">
      <nav className="h-20 flex items-center justify-between w-full">
        <Logo />

        {/* Desktop navigation menu */}
        <div className="hidden md:flex md:items-center md:gap-2">
          <NavMenu />
          <ThemeToggle />
        </div>

        {/* Mobile navigation menu */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Popover modal>
            <PopoverTrigger className="group">
              <MenuIcon className="group-data-[state=open]:hidden" />
              <XIcon className="hidden group-data-[state=open]:block" />
            </PopoverTrigger>
            <PopoverContent
              sideOffset={28}
              className="bg-background h-[calc(100svh-3rem)] w-screen !animate-none rounded-none border-none"
            >
              <NavMenu orientation="vertical" />
            </PopoverContent>
          </Popover>
        </div>
      </nav>
    </div>
  );
}
