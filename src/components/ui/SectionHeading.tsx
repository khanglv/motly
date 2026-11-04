import clsx from "clsx";

type Props = {
  id?: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({ id, eyebrow, title, subtitle, align = "center", className }: Props) {
  return (
    <div className={clsx("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="mt-3 text-3xl leading-tight sm:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-ink-soft">{subtitle}</p>}
      <span
        aria-hidden
        className={clsx("mt-6 block h-px w-16 bg-matcha-500/60", align === "center" && "mx-auto")}
      />
    </div>
  );
}
