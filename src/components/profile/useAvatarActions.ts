"use client";

import { useState } from "react";
import { isApiError } from "@/lib/api/base";
import { useRemoveAvatar, useUploadAvatar } from "@/lib/api/useMe";

const MAX_BYTES = 5 * 1024 * 1024;
const TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

/** Trocar e remover a foto, com a checagem de tipo e tamanho antes de enviar. */
export function useAvatarActions() {
  const upload = useUploadAvatar();
  const remove = useRemoveAvatar();
  const [error, setError] = useState<string | null>(null);

  function pick(file: File) {
    setError(null);
    if (!TYPES.has(file.type)) return setError("Use JPG, PNG ou WebP.");
    if (file.size > MAX_BYTES) return setError("A imagem precisa ter no máximo 5 MB.");
    upload.mutate(file, {
      onError: (err) =>
        setError(
          isApiError(err) && err.code === "AVATAR_TOO_LARGE"
            ? "A imagem precisa ter no máximo 5 MB."
            : isApiError(err) && err.code === "AVATAR_FORMAT"
              ? "Use JPG, PNG ou WebP."
              : "Não foi possível enviar a foto. Tente de novo.",
        ),
    });
  }

  function removePhoto() {
    setError(null);
    remove.mutate(undefined, { onError: () => setError("Não foi possível remover a foto. Tente de novo.") });
  }

  return { pick, removePhoto, uploading: upload.isPending, removing: remove.isPending, error };
}
