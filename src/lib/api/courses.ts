"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "./client";
import type { components } from "./schema";

export type Course = components["schemas"]["CourseResponseDto"];
export type Subject = components["schemas"]["SubjectDto"];

export function useCourseQuery(slug: string = "medicina") {
  return useQuery<Course>({
    queryKey: ["course", slug],
    staleTime: Infinity,
    queryFn: async () => {
      const { data } = await api.GET("/v1/courses/{slug}", { params: { path: { slug } } });
      if (!data) throw new Error("curso vazio");
      return data;
    },
  });
}
