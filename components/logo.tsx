import Image from "next/image";

export function Logo() {
  return (
    <div className="flex items-center gap-2 font-semibold text-xl">
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
