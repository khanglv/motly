import { StarIcon } from "./icons";

type Props = {
  rating: number;
  /** Nhãn cho trình đọc màn hình, ví dụ "5 trên 5 sao" */
  label: string;
  size?: number;
  className?: string;
};

export function Stars({ rating, label, size = 18, className }: Props) {
  const value = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <span role="img" aria-label={label} className={`inline-flex gap-0.5 ${className ?? "text-matcha-600"}`}>
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon key={i} filled={i < value} width={size} height={size} data-filled={i < value} />
      ))}
    </span>
  );
}
