import Image from "next/image";

export function Logo() {
  return (
    <div className="flex items-center gap-2 font-[family-name:var(--font-sora)] text-xl font-semibold">
      <Image
        src="/logo/renewvan-symbol.svg"
        alt="renewvan"
        width={33}
        height={24}
      />
      renewvan
    </div>
  );
}
