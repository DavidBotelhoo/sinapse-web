"use client";

import Link from "next/link";
import { Plus, Search, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Scope } from "@/lib/api/decks";

export type EmptyDecksProps = {
  scope: Scope;
  hasFilters: boolean;
  onClearFilters: () => void;
};

export function EmptyDecks({ scope, hasFilters, onClearFilters }: EmptyDecksProps) {
  if (hasFilters) {
    return (
      <EmptyState
        icon={<Search strokeWidth={1.75} />}
        title="Nenhum deck com esses filtros"
        body="Tente aumentar a busca ou remova um dos filtros."
        primaryAction={
          <Button variant="primary" onClick={onClearFilters}>
            Limpar filtros
          </Button>
        }
      />
    );
  }

  if (scope === "favorites") {
    return (
      <EmptyState
        icon={<Star strokeWidth={1.75} fill="currentColor" />}
        title="Marque decks com a estrela para achá-los aqui"
        body="Favoritos são para você achar rápido os decks que estuda mais."
        primaryAction={
          <Link
            href="/flashcards?scope=all"
            className="inline-flex items-center justify-center gap-2 h-control px-5 rounded-md bg-primary text-on-primary font-sans font-semibold text-[15px] no-underline hover:bg-primary-hover"
          >
            Ver todos
          </Link>
        }
      />
    );
  }

  if (scope === "mine") {
    return (
      <EmptyState
        icon={<Plus strokeWidth={1.75} />}
        title="Crie seu primeiro deck"
        body="Importe um PDF ou Word com perguntas e respostas para montar o deck."
        primaryAction={
          <Link
            href="/flashcards/novo"
            className="inline-flex items-center justify-center gap-2 h-control px-5 rounded-md bg-primary text-on-primary font-sans font-semibold text-[15px] no-underline hover:bg-primary-hover"
          >
            Criar deck
          </Link>
        }
      />
    );
  }

  if (scope === "community") {
    return (
      <EmptyState
        icon={<Users strokeWidth={1.75} />}
        title="Explore decks prontos da Comunidade"
        body="Salve decks publicados por outros estudantes para estudar com eles."
        primaryAction={
          <Link
            href="/comunidade"
            className="inline-flex items-center justify-center gap-2 h-control px-5 rounded-md bg-primary text-on-primary font-sans font-semibold text-[15px] no-underline hover:bg-primary-hover"
          >
            Ir para Comunidade
          </Link>
        }
      />
    );
  }

  // scope === "all"
  return (
    <EmptyState
      icon={<Plus strokeWidth={1.75} />}
      title="Seu primeiro deck começa com um arquivo"
      body="Importe um PDF ou Word, ou salve um deck da Comunidade."
      primaryAction={
        <Link
          href="/flashcards/novo"
          className="inline-flex items-center justify-center gap-2 h-control px-5 rounded-md bg-primary text-on-primary font-sans font-semibold text-[15px] no-underline hover:bg-primary-hover"
        >
          Criar deck
        </Link>
      }
      secondaryAction={
        <Link
          href="/comunidade"
          className="inline-flex items-center justify-center gap-2 h-control px-5 rounded-md border border-line-strong bg-surface text-ink font-sans font-semibold text-[15px] no-underline hover:bg-surface-2"
        >
          Explorar a Comunidade
        </Link>
      }
    />
  );
}
