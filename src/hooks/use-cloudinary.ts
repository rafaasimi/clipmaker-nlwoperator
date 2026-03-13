import { useCallback, useEffect, useRef, useState } from "react";
import type { UploadVideoResponse } from "../models/upload-video-response";

interface UseCloudinaryWidgetProps {
  cloudName: string;
  uploadPreset: string;
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
}

export function useCloudinaryWidget({
  cloudName,
  uploadPreset,
  onSuccess,
  onError,
}: UseCloudinaryWidgetProps) {
  const cloudinaryRef = useRef<any>(null);
  const widgetRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const publicIdRef = useRef<string | null>(null);
  const transcriptionUrlRef = useRef<string | null>(null);

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
        } catch (error: any) {
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
            error: any,
            result: { event: string; info: UploadVideoResponse },
          ) => {
            if (!error && result && result.event === "success") {
              if (onSuccess) {
                const { public_id } = result.info;
                publicIdRef.current = public_id;

                try {
                  const isTranscriptionReady =
                    await waitForTranscription(public_id);
                  console.log(isTranscriptionReady);
                  onSuccess(result);
                } catch (err) {
                  console.error(err);
                  if (onError) onError(err);
                }
              }
            } else if (error) {
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

  const getViralMoment = async () => {
    const transcription = await getTranscription();
  };

  return { openWidget, isLoaded, waitForTranscription };
}
