"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { FilterDef } from "@/components/ui/FilterBar";
import { useCourseQuery } from "@/lib/api/courses";

function uniq<T>(arr: ReadonlyArray<T>): ReadonlyArray<T> {
  return Array.from(new Set(arr));
}

/**
 * Busca, ano e matéria com a URL como fonte da verdade (?q=&year=&subject=). Flashcards e
 * Comunidade usam o mesmo: os links de uma lista filtrada continuam funcionando.
 */
export function useDeckFiltersUrl() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const qUrl = params.get("q") ?? "";
  const years = useMemo(
    () => uniq(params.getAll("year").map(Number).filter((v) => Number.isInteger(v) && v > 0)),
    [params],
  );
  const subjectIds = useMemo(() => uniq(params.getAll("subject")), [params]);

  const [qInput, setQInput] = useState(qUrl);
  const [q, setQ] = useState(qUrl);

  useEffect(() => {
    const t = setTimeout(() => setQ(qInput), 300);
    return () => clearTimeout(t);
  }, [qInput]);

  /** Muda a URL desta página; `push` para mudanças que valem uma entrada no histórico. */
  const changeUrl = useCallback(
    (patch: (sp: URLSearchParams) => void, mode: "push" | "replace" = "replace") => {
      const sp = new URLSearchParams(params.toString());
      patch(sp);
      const qs = sp.toString();
      const url = qs ? `${pathname}?${qs}` : pathname;
      if (mode === "push") router.push(url, { scroll: false });
      else router.replace(url, { scroll: false });
    },
    [params, pathname, router],
  );

  // A busca vai para a URL depois do debounce (replace, sem encher o histórico).
  useEffect(() => {
    if (q === qUrl) return;
    changeUrl((sp) => {
      if (q.trim()) sp.set("q", q.trim());
      else sp.delete("q");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const setYears = useCallback(
    (next: ReadonlyArray<string | number>) =>
      changeUrl((sp) => {
        sp.delete("year");
        for (const y of next) sp.append("year", String(y));
      }),
    [changeUrl],
  );
  const setSubjects = useCallback(
    (next: ReadonlyArray<string>) =>
      changeUrl((sp) => {
        sp.delete("subject");
        for (const s of next) sp.append("subject", s);
      }),
    [changeUrl],
  );
  const clearFilters = useCallback(
    () =>
      changeUrl((sp) => {
        sp.delete("year");
        sp.delete("subject");
      }),
    [changeUrl],
  );

  const course = useCourseQuery();
  const availableYears = course.data
    ? Array.from({ length: course.data.years }, (_, i) => i + 1)
    : [1, 2, 3, 4, 5, 6];
  const availableSubjects = course.data?.subjects ?? [];

  const filters: FilterDef[] = [
    {
      id: "year",
      label: "Ano do curso",
      variant: "chips",
      singleValueLabel: (v) => `${v}º ano`,
      options: availableYears.map((y) => ({ value: String(y), label: `${y}º ano`, shortLabel: `${y}º` })),
      selected: years.map(String),
      onChange: setYears,
    },
    {
      id: "subject",
      label: "Matéria",
      variant: "search",
      options: availableSubjects.map((s) => ({ value: s.id, label: s.name })),
      selected: subjectIds,
      onChange: setSubjects,
    },
  ];

  return {
    params,
    changeUrl,
    qInput,
    setQInput,
    q,
    years,
    subjectIds,
    setYears,
    setSubjects,
    clearFilters,
    availableYears,
    availableSubjects,
    filters,
    filterCount: years.length + subjectIds.length,
    hasFilters: years.length > 0 || subjectIds.length > 0 || q.trim() !== "",
  };
}

export type DeckFiltersState = ReturnType<typeof useDeckFiltersUrl>;
