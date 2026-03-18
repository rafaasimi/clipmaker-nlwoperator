import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  Video,
  Sparkles,
  Key,
  CheckCircle2,
  Play,
  Loader2,
  UploadCloud,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useCloudinaryWidget } from "./hooks/use-cloudinary";

export default function App() {
  const [geminiApiKey, setGeminiApiKey] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { openWidget, viralMomentUrl, status } = useCloudinaryWidget({
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
    geminiApiKey,
    onSuccess: (result) => {
      console.log("Done! Video info: ", result.info);
    },
  });

  useGSAP(
    () => {
      // Initial reveal animations
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(
        ".nav-glass",
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
      )
        .fromTo(
          ".hero-text",
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.1 },
          "-=0.6",
        )
        .fromTo(
          ".bento-item",
          { y: 60, opacity: 0, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            stagger: 0.15,
            clearProps: "all",
          },
          "-=0.8",
        );

      // Float animation for background blobs
      gsap.to(".blob-1", {
        x: "20%",
        y: "10%",
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".blob-2", {
        x: "-20%",
        y: "-10%",
        duration: 25,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 2,
      });
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-x-hidden bg-slate-50 font-sans text-slate-900 selection:bg-blue-100"
    >
      {/* Background Aesthetic Layer */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="blob-1 absolute -top-[10%] -left-[10%] h-[600px] w-[600px] rounded-full bg-blue-200/20 blur-[120px]" />
        <div className="blob-2 absolute top-[20%] -right-[5%] h-[500px] w-[500px] rounded-full bg-indigo-200/20 blur-[100px]" />
      </div>

      {/* Navbar: Glassmorphism */}
      <nav className="nav-glass sticky top-5 z-50 mx-auto mt-4 w-[95%] max-w-6xl rounded-2xl border border-white/40 bg-white/60 px-6 py-4 shadow-sm backdrop-blur-xl md:w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg ring-1 ring-white/20">
              <Video className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              ClipMaker
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="cursor-pointer text-sm font-medium text-slate-500 transition-colors hover:text-slate-900">
              Platform
            </span>
            <span className="cursor-pointer text-sm font-medium text-slate-500 transition-colors hover:text-slate-900">
              Showcase
            </span>
            <div className="h-8 w-[1px] bg-slate-200" />
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/50 px-3 py-1 text-[12px] font-semibold text-slate-600">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              BETA V1.0
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 mx-auto max-w-6xl px-6 py-24 md:py-32">
        {/* Hero Section */}
        <section className="mb-24 text-center">
          <div className="hero-text mb-6 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-600 ring-1 ring-blue-700/10 ring-inset">
              <Sparkles className="h-4 w-4" />
              Inteligência Artificial de Próxima Geração
            </span>
          </div>
          <h1 className="hero-text mb-8 text-5xl font-extrabold tracking-tight text-balance text-slate-900 md:text-7xl lg:text-8xl">
            Sua estratégia de <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Shorts no piloto automático.
            </span>
          </h1>
          <p className="hero-text mx-auto max-w-2xl text-lg leading-relaxed text-slate-500 md:text-xl">
            Extraia os momentos mais virais de vídeos longos usando modelos de
            IA avançados. Crie, edite e engaje com a velocidade da luz.
          </p>
        </section>

        {/* Bento Grid Layout - Asymmetric & Elegant */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Item 1: Gemini Key Input (4 cols) */}
          <div className="bento-item group col-span-1 flex flex-col justify-between overflow-hidden rounded-[32px] border border-slate-200 bg-white p-10 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/5 md:col-span-5">
            <div>
              <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-600 transition-colors group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-200">
                <Key className="h-7 w-7 transition-all duration-500 group-hover:rotate-12" />
              </div>
              <h3 className="mb-3 text-2xl font-bold tracking-tight text-slate-900">
                Gemini Pro API
              </h3>
              <p className="text-base leading-relaxed text-slate-500">
                Integre sua própria chave para processamento de alto desempenho
                e transcrição sem limites.
              </p>
            </div>

            <div className="mt-8 space-y-4">
              <div className="relative">
                <input
                  type="password"
                  placeholder="Insira sua API Key..."
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-4 pr-4 pl-12 text-sm font-medium transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:outline-none"
                />
                <ShieldCheck className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" />
              </div>

              <div
                className={`flex items-center gap-2 overflow-hidden text-sm font-semibold transition-all duration-500 ${geminiApiKey ? "max-h-10 opacity-100" : "max-h-0 opacity-0"}`}
              >
                <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1.5 text-emerald-600 ring-1 ring-emerald-600/10">
                  <CheckCircle2 className="h-4 w-4" />
                  Conectado com Sucesso
                </div>
              </div>
            </div>
          </div>

          {/* Item 2: Upload Actions (7 cols) */}
          <div className="bento-item group relative col-span-1 overflow-hidden rounded-[32px] border border-slate-200 bg-white p-10 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/5 md:col-span-7">
            {/* Background Texture/Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-blue-50/50" />

            <div className="relative flex h-full flex-col items-center justify-center text-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 animate-ping rounded-full bg-blue-100/50" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-600 text-white shadow-2xl shadow-blue-200">
                  <UploadCloud className="h-10 w-10" />
                </div>
              </div>

              <h3 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 uppercase">
                Prepare seu Vídeo
              </h3>
              <p className="mb-10 max-w-sm text-lg leading-relaxed text-slate-500">
                Nós transformaremos horas de conteúdo em clipes irresistíveis
                para Reels e TikTok.
              </p>

              <button
                onClick={openWidget}
                disabled={!geminiApiKey}
                className="group/btn relative flex w-full max-w-xs items-center justify-center gap-3 overflow-hidden rounded-2xl bg-slate-900 px-8 py-5 text-lg font-bold text-white shadow-xl transition-all hover:bg-slate-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-blue-600/0 via-white/10 to-blue-600/0 transition-transform duration-1000 group-hover/btn:translate-x-full" />
                <Zap className="h-5 w-5 fill-yellow-400 text-yellow-400 group-hover/btn:animate-pulse" />
                <span>Gerar Clipes</span>
              </button>

              {status && (
                <div className="mt-6 flex items-center gap-3 rounded-xl bg-indigo-50 px-5 py-3 text-sm font-bold text-indigo-600 ring-1 ring-indigo-200">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {status}
                </div>
              )}
            </div>
          </div>

          {/* Item 3: Video Preview (12 cols) - Only if URL exists */}
          {viralMomentUrl ? (
            <div className="bento-item col-span-1 mt-4 overflow-hidden rounded-[40px] border border-slate-900 bg-slate-950 p-4 shadow-2xl md:col-span-12">
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Play className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold tracking-widest text-emerald-400/70 uppercase">
                      Visualização
                    </p>
                    <h4 className="text-lg font-bold text-white">
                      Momento Viral Detectado
                    </h4>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-2 w-2 rounded-full bg-slate-700" />
                  <div className="h-2 w-2 rounded-full bg-slate-700" />
                  <div className="h-2 w-2 rounded-full bg-slate-700" />
                </div>
              </div>

              <div className="group relative aspect-video w-full overflow-hidden rounded-[28px] bg-slate-900 ring-1 ring-white/10">
                <video
                  src={viralMomentUrl}
                  controls
                  autoPlay
                  className="h-full w-full object-contain shadow-2xl"
                />
              </div>
            </div>
          ) : /* Placeholder simple card for layout balance if needed, but per rule: "Não incremente ou desenvolva nada novo, apenas os itens que eu preciso" */
          /* I'll skip adding a placeholder and just let the grid adjust */
          null}
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="mx-auto max-w-6xl px-6 py-12 text-center text-sm font-medium text-slate-400">
        &copy; 2026 ClipMaker AI. All rights reserved. Precise Vision. Elegant
        Code.
      </footer>
    </div>
  );
}
