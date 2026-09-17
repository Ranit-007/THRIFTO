import { ArrowUpRight } from "lucide-react";
import type { ComponentProps } from "react";

type ArrowLinkProps = ComponentProps<"a"> & {
  tone?: "dark" | "light";
};

export function ArrowLink({
  children,
  className = "",
  tone = "dark",
  ...props
}: ArrowLinkProps) {
  const colorClass = tone === "light" ? "arrow-link--light" : "arrow-link--dark";

  return (
    <a className={`arrow-link ${colorClass} ${className}`} {...props}>
      <span>{children}</span>
      <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.7} />
    </a>
  );
}
