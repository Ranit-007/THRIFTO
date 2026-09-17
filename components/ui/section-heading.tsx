import { ArrowLink } from "@/components/ui/arrow-link";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  action?: { label: string; href: string };
  inverse?: boolean;
  headingId?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  inverse = false,
  headingId,
}: SectionHeadingProps) {
  return (
    <div className={`section-heading ${inverse ? "section-heading--inverse" : ""}`}>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={headingId}>{title}</h2>
      </div>
      <div className="section-heading__aside">
        {description ? <p>{description}</p> : null}
        {action ? (
          <ArrowLink href={action.href} tone={inverse ? "light" : "dark"}>
            {action.label}
          </ArrowLink>
        ) : null}
      </div>
    </div>
  );
}
