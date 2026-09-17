import Link from "next/link";
import { brand } from "@/config/brand";

type LogoProps = { inverse?: boolean };

export function Logo({ inverse = false }: LogoProps) {
  return (
    <Link href="/" className={`logo ${inverse ? "logo--inverse" : ""}`} aria-label={`${brand.name} home`}>
      <span className="logo__mark" aria-hidden="true">N</span>
      <span>{brand.name}</span>
    </Link>
  );
}
