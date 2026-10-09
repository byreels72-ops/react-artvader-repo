import type { CSSProperties, ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  as?: ElementType;
  text: string;
  className?: string;
  /** Delay before the first word, ms. */
  delay?: number;
  /** Delay between words, ms. */
  stagger?: number;
  children?: ReactNode;
  id?: string;
};

/**
 * Text that rises word by word out of a mask when it scrolls into view.
 * Words stay real text (selectable, read normally by screen readers).
 */
export function SplitText({ as: Tag = "span", text, className, delay = 0, stagger = 60, children, id }: Props) {
  const words = text.split(" ");
  return (
    <Tag data-reveal className={className} id={id}>
      {words.map((w, i) => (
        <span key={i}>
          <span className="mask">
            <span style={{ "--d": `${delay + i * stagger}ms` } as CSSProperties}>{w}</span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
      {children}
    </Tag>
  );
}

/** Small label + count like "(9)", set as a superscript next to a big title. */
export function Count({ n, className }: { n: number; className?: string }) {
  return <sup className={cn("ml-1 align-top text-[0.16em] font-semibold tracking-normal", className)}>({n})</sup>;
}
