import Link from "next/link";
import Image from "next/image";
import { brand } from "@/config/brand";

type LogoProps = { inverse?: boolean; width?: number };

export function Logo({ inverse = false, width = 80 }: LogoProps) {
  // Baundule logo is white/cream on a black background.
  // We can use mix-blend-mode or filter depending on inverse state.
  return (
    <Link href="/" className={`logo ${inverse ? "logo--inverse" : ""}`} aria-label={`${brand.name} home`}>
      <Image
        src="/images/brand/baundule-logo.png"
        alt={brand.name}
        width={width}
        height={width}
        className="logo__image"
        priority
      />
    </Link>
  );
}
