"use client";

import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";
import { Clock, Globe, Layers, Lock, Plus, Star } from "lucide-react";
import { Tag } from "./Tag";
import { Avatar } from "./Avatar";
import { ProgressBar } from "./StatCard";
import { cn } from "@/lib/cn";

export type DeckOwnership =
  | { kind: "mine"; visibility: "public" | "private" }
  | { kind: "community"; firstName: string; avatarSrc?: string }
  | { kind: "none" };

export type DeckDue =
  | { kind: "today"; count: number }
  | { kind: "overdue"; count: number }
  | { kind: "onTrack" }
  | { kind: "updated"; relative: string };

export type DeckCardProps = {
  title: string;
  year: string;
  subjects: ReadonlyArray<string>;
  cardsCount: number;
  ownership?: DeckOwnership;
  due?: DeckDue;
  masteryPct?: number;
  favorite?: boolean;
  onToggleFavorite?: () => void;
  href?: string;
  onClick?: () => void;
  footer?: ReactNode;
  className?: string;
};

const stack =
  "shadow-[0_-8px_0_-4px_var(--color-surface-2),0_-16px_0_-8px_var(--color-line)] " +
  "hover:-translate-y-[2px] hover:shadow-[0_-8px_0_-4px_var(--color-surface-2),0_-16px_0_-8px_var(--color-line),var(--sn-shadow-md)]";

const base =
  "relative grid content-start gap-3 mt-4 p-5 rounded-lg border border-line bg-surface " +
  "transition-[transform,box-shadow] duration-(--dur-base) ease-out";

export function DeckCard({
  title,
  year,
  subjects,
  cardsCount,
  ownership,
  due,
  masteryPct,
  favorite,
  onToggleFavorite,
  href,
  onClick,
  footer,
  className,
}: DeckCardProps) {
  const shownSubjects = subjects.slice(0, 3);
  const overflow = subjects.length - shownSubjects.length;

  const body = (
    <>
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-[6px]">
          <Tag>{year}</Tag>
          {shownSubjects.map((s) => (
            <Tag key={s} tone="brand">
              {s}
            </Tag>
          ))}
          {overflow > 0 ? <Tag>+{overflow}</Tag> : null}
          {ownership?.kind === "mine" ? (
            <Tag tone="outline" icon={ownership.visibility === "public" ? <Globe strokeWidth={1.75} /> : <Lock strokeWidth={1.75} />}>
              {ownership.visibility === "public" ? "Público" : "Privado"}
            </Tag>
          ) : null}
        </div>
        {onToggleFavorite ? (
          <button
            type="button"
            aria-label={favorite ? "Desfavoritar deck" : "Favoritar deck"}
            aria-pressed={favorite}
            onClick={stop(onToggleFavorite)}
            className={cn(
              "grid place-items-center size-control-sm rounded-full bg-transparent cursor-pointer",
              favorite ? "text-accent-ink" : "text-ink-muted hover:text-ink hover:bg-surface-2",
              "[&_svg]:size-5",
            )}
          >
            <Star aria-hidden strokeWidth={1.75} fill={favorite ? "currentColor" : "none"} />
          </button>
        ) : null}
      </div>
      <h3 className="font-display font-semibold text-[18px] leading-6 text-ink text-balance m-0 line-clamp-2">
        {title}
      </h3>
      <div className="flex flex-wrap gap-x-3 gap-y-1 font-sans font-medium text-[13px] leading-[18px] text-ink-muted [&>span]:inline-flex [&>span]:items-center [&>span]:gap-1 [&_svg]:size-[15px]">
        <span>
          <Layers aria-hidden strokeWidth={1.75} />
          {cardsCount} cards
        </span>
        {due?.kind === "today" ? (
          <span>
            <Clock aria-hidden strokeWidth={1.75} />
            {due.count} para hoje
          </span>
        ) : null}
        {due?.kind === "overdue" ? (
          <span className="text-accent-ink">
            <Clock aria-hidden strokeWidth={1.75} />
            {due.count} atrasados
          </span>
        ) : null}
        {due?.kind === "onTrack" ? (
          <span>
            <Clock aria-hidden strokeWidth={1.75} />
            Em dia
          </span>
        ) : null}
        {due?.kind === "updated" ? (
          <span>
            <Clock aria-hidden strokeWidth={1.75} />
            {due.relative}
          </span>
        ) : null}
      </div>
      {typeof masteryPct === "number" ? (
        <div className="grid gap-[6px]">
          <div className="flex justify-between font-sans font-medium text-[12px] leading-4 text-ink-muted">
            <span>Domínio</span>
            <span className="tabular-nums">{masteryPct}%</span>
          </div>
          <ProgressBar value={masteryPct} label="Domínio" />
        </div>
      ) : null}
      {ownership?.kind === "community" ? (
        <div className="flex items-center justify-between gap-3 mt-1">
          <span className="flex items-center gap-2 font-sans font-medium text-[13px] leading-[18px] text-ink-muted">
            <Avatar name={ownership.firstName} src={ownership.avatarSrc} size="xs" decorative />
            por <b className="text-ink font-semibold">{ownership.firstName}</b>
          </span>
          {footer}
        </div>
      ) : footer ? (
        <div className="mt-1">{footer}</div>
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cn(base, stack, "text-inherit no-underline", className)} onClick={onClick}>
        {body}
      </Link>
    );
  }

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(base, onClick && stack, className)}
    >
      {body}
    </div>
  );
}

function stop(fn: () => void) {
  return (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fn();
  };
}

export type NewDeckCardProps = {
  href?: string;
  onClick?: () => void;
  title?: string;
  hint?: string;
  className?: string;
};

export function NewDeckCard({
  href,
  onClick,
  title = "Criar novo deck",
  hint = "Importe um PDF ou Word",
  className,
}: NewDeckCardProps) {
  const inner = (
    <>
      <span
        aria-hidden
        className="grid place-items-center size-12 rounded-full bg-primary text-on-primary [&_svg]:size-6"
      >
        <Plus strokeWidth={1.75} />
      </span>
      <span className="font-sans font-semibold text-[15px] leading-[22px]">{title}</span>
      <small className="font-sans font-medium text-[12px] leading-4">{hint}</small>
    </>
  );
  const cls = cn(
    "grid justify-items-center content-center gap-[6px] min-h-[196px] mt-4 p-5 rounded-lg",
    "border-[1.5px] border-dashed border-line-strong bg-transparent text-ink-muted text-center cursor-pointer",
    "hover:border-primary hover:bg-primary-soft hover:text-on-primary-soft",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={cn(cls, "no-underline")} onClick={onClick}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

export function DecksGrid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "grid gap-x-4 gap-y-6 [grid-template-columns:repeat(auto-fill,minmax(240px,1fr))]",
        className,
      )}
    >
      {children}
    </div>
  );
}
