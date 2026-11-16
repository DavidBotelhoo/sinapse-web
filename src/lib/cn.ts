export type ClassValue =
  | string
  | number
  | null
  | undefined
  | false
  | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];
  for (const item of inputs) {
    if (!item && item !== 0) continue;
    if (typeof item === "string" || typeof item === "number") {
      out.push(String(item));
    } else if (Array.isArray(item)) {
      const inner = cn(...item);
      if (inner) out.push(inner);
    }
  }
  return out.join(" ");
}
