"use client";

import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";
import type { components } from "./schema";

export type StudyOverview = components["schemas"]["StudyOverviewDto"];
export type StudyToday = components["schemas"]["StudyTodayDto"];
export type StudySubjectOption = components["schemas"]["StudySubjectOptionDto"];
export type StudyDeckOption = components["schemas"]["StudyDeckOptionDto"];
export type StudySession = components["schemas"]["StudySessionDto"];
export type StudyCard = components["schemas"]["StudyCardDto"];
export type CreateStudySessionInput = components["schemas"]["CreateStudySessionDto"];
export type ReviewRating = components["schemas"]["CreateReviewDto"]["rating"];
export type ReviewInput = components["schemas"]["CreateReviewDto"];
export type ReviewResult = components["schemas"]["ReviewResultDto"];
export type SessionSummary = components["schemas"]["StudySessionSummaryDto"];
export type SessionLimit = CreateStudySessionInput["limit"];
export type SessionOrder = CreateStudySessionInput["order"];

export function useCreateSession() {
  return useMutation({
    mutationFn: async (input: CreateStudySessionInput): Promise<StudySession> => {
      const { data } = await api.POST("/v1/study/sessions", { body: input });
      if (!data) throw new Error("criar sessão vazio");
      return data;
    },
  });
}

export function useRepeatSession() {
  return useMutation({
    mutationFn: async (sessionId: string): Promise<StudySession> => {
      const { data } = await api.POST("/v1/study/sessions/{id}/repeat", {
        params: { path: { id: sessionId } },
      });
      if (!data) throw new Error("repetir sessão vazio");
      return data;
    },
  });
}

/** A sessão como está agora na API (para não confiar numa página guardada pelo voltar do navegador). */
export async function fetchSession(sessionId: string): Promise<StudySession> {
  const { data } = await api.GET("/v1/study/sessions/{id}", { params: { path: { id: sessionId } } });
  if (!data) throw new Error("sessão vazia");
  return data;
}

export async function postReview(sessionId: string, body: ReviewInput): Promise<ReviewResult> {
  const { data } = await api.POST("/v1/study/sessions/{id}/reviews", {
    params: { path: { id: sessionId } },
    body,
  });
  if (!data) throw new Error("avaliação vazia");
  return data;
}

export async function finishSession(sessionId: string): Promise<SessionSummary> {
  const { data } = await api.POST("/v1/study/sessions/{id}/finish", {
    params: { path: { id: sessionId } },
  });
  if (!data) throw new Error("resumo vazio");
  return data;
}

/** Depois de avaliar: contador da sidebar, agenda, estatísticas e decks mudam. */
export function useInvalidateStudyData() {
  const qc = useQueryClient();
  return useCallback(() => {
    void qc.invalidateQueries({ queryKey: ["agenda"] });
    void qc.invalidateQueries({ queryKey: ["stats"] });
    void qc.invalidateQueries({ queryKey: ["decks"] });
    void qc.invalidateQueries({ queryKey: ["deck"] });
  }, [qc]);
}
