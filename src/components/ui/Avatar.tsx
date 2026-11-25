"use client";

import { useRef, type ReactNode } from "react";
import Image from "next/image";
import { Camera, X } from "lucide-react";
import { cn } from "@/lib/cn";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

const sizes: Record<AvatarSize, { box: string; text: string }> = {
  xs: { box: "size-6", text: "text-[10px]" },
  sm: { box: "size-8", text: "text-[13px]" },
  md: { box: "size-10", text: "text-base" },
  lg: { box: "size-[72px]", text: "text-[28px]" },
  xl: { box: "size-28", text: "text-[44px]" },
};

export type AvatarProps = {
  name: string;
  src?: string | null;
  size?: AvatarSize;
  alt?: string;
  decorative?: boolean;
  className?: string;
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (first + last).toUpperCase() || "?";
}

export function Avatar({ name, src, size = "md", alt, decorative = false, className }: AvatarProps) {
  const dims = sizes[size];
  const aria = decorative ? { "aria-hidden": true as const } : undefined;
  return (
    <span
      className={cn(
        "inline-grid place-items-center shrink-0 overflow-hidden rounded-full",
        "bg-primary-soft text-on-primary-soft font-display font-bold leading-none",
        dims.box,
        dims.text,
        className,
      )}
      {...aria}
    >
      {src ? (
        <Image
          src={src}
          alt={decorative ? "" : (alt ?? name)}
          width={128}
          height={128}
          unoptimized
          className="size-full object-cover"
        />
      ) : (
        <span aria-hidden={!decorative}>{initials(name)}</span>
      )}
    </span>
  );
}

export type EditableAvatarProps = Omit<AvatarProps, "size"> & {
  size?: Extract<AvatarSize, "lg" | "xl">;
  onPick?: (file: File) => void;
  onRemove?: () => void;
  pickLabel?: string;
  removeLabel?: string;
  accept?: string;
};

export function EditableAvatar({
  name,
  src,
  size = "xl",
  onPick,
  onRemove,
  pickLabel = "Trocar foto de perfil",
  removeLabel = "Remover foto de perfil",
  accept = "image/jpeg,image/png,image/webp",
  className,
}: EditableAvatarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <span className={cn("relative inline-block", className)}>
      <Avatar name={name} src={src} size={size} decorative />
      <button
        type="button"
        aria-label={pickLabel}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "absolute right-0 bottom-0 grid place-items-center size-9 rounded-full cursor-pointer",
          "bg-primary text-on-primary border-[3px] border-surface [&_svg]:size-4",
        )}
      >
        <Camera aria-hidden strokeWidth={1.75} />
      </button>
      {src && onRemove ? (
        <button
          type="button"
          aria-label={removeLabel}
          onClick={onRemove}
          className={cn(
            "absolute left-0 top-0 grid place-items-center size-7 rounded-full cursor-pointer",
            "bg-surface text-ink border border-line-strong [&_svg]:size-[14px]",
          )}
        >
          <X aria-hidden strokeWidth={1.75} />
        </button>
      ) : null}
      {/* Só o botão da câmera abre o seletor: o input fica fora do Tab e da árvore de acessibilidade. */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        tabIndex={-1}
        aria-hidden
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && onPick) onPick(file);
          e.target.value = "";
        }}
      />
    </span>
  );
}

export function AvatarWithName({
  name,
  firstNameOnly = false,
  preposition,
  avatarProps,
  className,
}: {
  name: string;
  firstNameOnly?: boolean;
  preposition?: ReactNode;
  avatarProps?: Omit<AvatarProps, "name">;
  className?: string;
}) {
  const shown = firstNameOnly ? (name.split(/\s+/)[0] ?? name) : name;
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Avatar name={name} decorative {...avatarProps} />
      <span className="text-[13px] text-ink-muted">
        {preposition ? <>{preposition} </> : null}
        {shown}
      </span>
    </span>
  );
}
