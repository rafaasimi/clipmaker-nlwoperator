import { useCallback, useEffect, useRef, useState } from "react";
import type { UploadVideoResponse } from "../models/upload-video-response";
import { generateContent } from "../services/gemini";

interface UseCloudinaryWidgetProps {
  cloudName: string;
  uploadPreset: string;
  geminiApiKey: string | null;
  onSuccess?: (
    result: /* eslint-disable-next-line @typescript-eslint/no-explicit-any */ any,
  ) => void;
  onError?: (
    error: /* eslint-disable-next-line @typescript-eslint/no-explicit-any */ any,
  ) => void;
}

export function useCloudinaryWidget({
  cloudName,
  uploadPreset,
  geminiApiKey,
  onSuccess,
  onError,
}: UseCloudinaryWidgetProps) {
  const cloudinaryRef =
    useRef</* eslint-disable-next-line @typescript-eslint/no-explicit-any */ any>(
      null,
    );
  const widgetRef =
    useRef</* eslint-disable-next-line @typescript-eslint/no-explicit-any */ any>(
      null,
    );
  const [isLoaded, setIsLoaded] = useState(false);

  const publicIdRef = useRef<string | null>(null);
  const transcriptionUrlRef = useRef<string | null>(null);
  const [viralMomentUrl, setViralMomentUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const geminiApiKeyRef = useRef(geminiApiKey);

  useEffect(() => {
    geminiApiKeyRef.current = geminiApiKey;
  }, [geminiApiKey]);

  console.log("geminiApiKey", geminiApiKey);

  const waitForTranscription = useCallback(
    async (videoId?: string) => {
      const targetPublicId = videoId || publicIdRef.current;

      if (!targetPublicId) {
        throw new Error(
          "publicId não encontrado. Faça o upload do vídeo primeiro.",
        );
      }

      const maxAttempts = 30;
      const delayMs = 2000;

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
          const version = Date.now();
          const url = `https://res.cloudinary.com/${cloudName}/raw/upload/v${version}/${targetPublicId}.transcript`;

          const response = await fetch(url);

          if (response.ok) {
            transcriptionUrlRef.current = url;
            console.log("Transcrição encontrada!", url);
            const data = await response.json();
            return data;
          }

          if (response.status !== 404) {
            console.error(
              `Erro ao buscar transcrição (Status: ${response.status})`,
            );
          }
        } catch (error: /* eslint-disable-next-line @typescript-eslint/no-explicit-any */ any) {
          console.log(`Tentativa ${attempt} falhou:`, error.message);
        }

        if (attempt < maxAttempts - 1) {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }

      throw new Error(
        "Tempo limite excedido aguardando a transcrição do vídeo.",
      );
    },
    [cloudName],
  );

  useEffect(() => {
    const scriptId = "cloudinary-widget-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    const initWidget = () => {
      // @ts-ignore
      if (window.cloudinary && !widgetRef.current) {
        // @ts-ignore
        cloudinaryRef.current = window.cloudinary;
        widgetRef.current = cloudinaryRef.current.createUploadWidget(
          {
            cloudName,
            uploadPreset,
          },
          async (
            error: /* eslint-disable-next-line @typescript-eslint/no-explicit-any */ any,
            result: { event: string; info: UploadVideoResponse },
          ) => {
            if (!error && result && result.event === "success") {
              if (onSuccess) {
                const { public_id } = result.info;
                publicIdRef.current = public_id;

                try {
                  setStatus("Aguardando transcrição do vídeo...");
                  const isTranscriptionReady =
                    await waitForTranscription(public_id);

                  if (!isTranscriptionReady) {
                    throw new Error("Transcrição não encontrada");
                  }

                  setStatus("Analisando com Gemini AI...");
                  const viralMoment = await getViralMoment();
                  const newViralMomentUrl = `https://res.cloudinary.com/${cloudName}/video/upload/${viralMoment}/${public_id}.mp4`;
                  setViralMomentUrl(newViralMomentUrl);

                  setStatus("Corte viral gerado com sucesso!");

                  onSuccess(result);
                } catch (err) {
                  console.error(err);
                  setStatus("Erro durante o processamento do vídeo.");
                  if (onError) onError(err);
                }
              }
            } else if (error) {
              setStatus("Erro no upload do Cloudinary.");
              if (onError) onError(error);
            }
          },
        );
      }
    };

    const handleScriptLoad = () => {
      setIsLoaded(true);
      initWidget();
    };

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://upload-widget.cloudinary.com/latest/global/all.js";
      script.async = true;
      document.head.appendChild(script);
    }

    if (script.getAttribute("data-loaded") === "true") {
      handleScriptLoad();
    } else {
      script.addEventListener("load", () => {
        script.setAttribute("data-loaded", "true");
        handleScriptLoad();
      });
      script.addEventListener("error", () => {
        console.error("Failed to load Cloudinary script");
        if (onError) onError(new Error("Failed to load script"));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cloudName, uploadPreset, onSuccess, onError, waitForTranscription]);

  const openWidget = () => {
    if (widgetRef.current) {
      widgetRef.current.open();
    } else {
      console.warn("Cloudinary widget is not loaded yet.");
    }
  };

  const getTranscription = async () => {
    const respose = await fetch(transcriptionUrlRef.current!);
    const data = await respose.text();
    return data;
  };

  const getViralMoment = async (retries = 3, delayMs = 2000) => {
    const currentApiKey = geminiApiKeyRef.current;
    if (!currentApiKey) {
      throw new Error("Chave Gemini API não fornecida");
    }

    const transcription = await getTranscription();
    const prompt = `
        Role: You are a professional video editor specializing in viral content.
        Task: Analyze the transcription below and identify the most engaging, funny, or surprising segment.
        Constraints:
        1. Duration: Minimum 30 seconds, Maximum 60 seconds.
        2. Format: Return ONLY the start and end string for Cloudinary. Format: so_<start_seconds>,eo_<end_seconds>
        3. Examples: "so_10,eo_20" or "so_12.5,eo_45.2"
        4. CRITICAL: Do not use markdown, do not use quotes, do not explain. Return ONLY the raw string.

        Transcription:
        ${transcription}
`;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const data = await generateContent(prompt, currentApiKey);
        const rawText = data?.replace(/```/g, "").replace(/json/g, "").trim();

        return rawText;
      } catch (error) {
        console.error(
          `Erro ao obter momento viral com Gemini (Tentativa ${attempt}/${retries}):`,
          error,
        );
        if (attempt === retries) {
          throw new Error(
            "Falha ao se conectar com o Gemini após várias tentativas.",
          );
        }
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  };

  return {
    openWidget,
    isLoaded,
    waitForTranscription,
    getTranscription,
    viralMomentUrl,
    status,
  };
}
