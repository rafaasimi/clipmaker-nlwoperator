<div align="center">
  <img src=".github/clipmaker.jpg" alt="ClipMaker AI" />
  
  <br />
  <br />

  <h1>🎬 ClipMaker AI</h1>
  <p>
    <strong>Sua estratégia de Shorts no piloto automático.</strong><br/>
    Extraia os momentos mais virais de vídeos longos usando modelos de IA avançados. Crie, edite e engaje com a velocidade da luz.
  </p>
</div>

---

## 🚀 Sobre o Projeto

O **ClipMaker AI** é uma aplicação focada em facilitar a criação de conteúdo para redes sociais curtas (como Reels, Shorts e TikTok). Através da união de Inteligência Artificial com o poder de processamento em nuvem, a plataforma recebe o upload de vídeos longos, transcreve seu conteúdo, identifica e extrai automaticamente a porção com maior potencial viral.

### ✨ Funcionalidades

- **Design Premium & Animações**: Interface desenvolvida com Tailwind CSS acompanhada de incríveis microinterações usando GSAP (agora com Glassmorphism elegante).
- **Upload Eficiente**: Utiliza o ecossistema e SDK do `Cloudinary` para tratar uploads pesados e gerar a transcrição do áudio do vídeo longo.
- **Análise Semântica via IA**: Usa a inteligência artificial generativa **Gemini** (Google GenAI) para analisar a transcrição gerada pelo Cloudinary e encontrar o trecho exato e envolvente (com duração de 30s a 60s) que garante o maior engajamento.
- **Preview Dinâmico**: Visualizador integrado do corte selecionado para pré-visualização.

## 🛠️ Tecnologias Utilizadas

A stack principal deste projeto é composta por ferramentas modernas e em alta no ecossistema de desenvolvimento web:

- **[React 19](https://react.dev/)** + **[TypeScript](https://www.typescriptlang.org/)** — Componentização tipada e segurança.
- **[Vite](https://vitejs.dev/)** — Build tool ultra veloz.
- **[Tailwind CSS v4](https://tailwindcss.com/)** — Estilização utilitária focada em alta performance.
- **[GSAP](https://gsap.com/)** + `@gsap/react` — Animações fluidas entre elementos na árvore principal.
- **[Lucide React](https://lucide.dev/)** — Biblioteca robusta de ícones.
- **[@google/genai](https://ai.google.dev/)** — Integração direta para consumir os modelos do Gemini API 2.5 Flash.
- **[Cloudinary](https://cloudinary.com/)** — Tratamento de media files, uploads na plataforma global e processamento massivo.

## ⚙️ Configurações (Ambiente)

O projeto requer que você configure os dados de autenticação e comunicação das APIs externas.

### 1. Renomeie o arquivo de exemplo
Existe um arquivo `.env.example` na raiz do projeto. Você deve criar uma cópia dele e renomeá-la para `.env.local` (este arquivo está fora do versionamento do Github para maior segurança).

### 2. Preencha o `.env.local`
Você precisa criar uma conta gratuita no [Cloudinary](https://cloudinary.com/) e inserir no seu `.env.local` as seguintes chaves (obtidas no seu Dashboard de `Upload preset` e status gerais):

```env
VITE_CLOUDINARY_CLOUD_NAME="substitua-pelo-seu-cloud-name"
VITE_CLOUDINARY_UPLOAD_PRESET="substitua-pelo-seu-upload-preset"
```

> **Atenção:** Certifique-se de que o seu **Upload Preset** no Cloudinary está sendo configurado como "Unsigned" e ativou o campo de geração automática de transcrição *(Google Speech-to-Text / AssemblyAI dependent add-ons)*.

### 3. Integração do Gemini AI
Para o Gemini, a API Key **não é necessária no arquivo `.env`**. Ela foi construída para dar uma experiência dinâmica, e o próprio usuário insere o Token dela ao invés de deixarmos ela acoplada e hard-coded.

## 💻 Como Executar na Sua Máquina

Tendo os pré-requisitos fundamentais em mãos (como Node e `pnpm`):

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seugithub/clipmaker-nlwoperator.git
   cd clipmaker-nlwoperator
   ```

2. **Instale as dependências**
   Recomendado utilizar o gerenciador de pacotes **pnpm**:
   ```bash
   pnpm install
   ```

3. **Inicie o Ambiente de Desenvolvimento**
   Subindo a engine pelo Vite:
   ```bash
   pnpm dev
   ```

4. **Acesse no Navegador**
   Por padrão, será inicializado em:
   [http://localhost:5173](http://localhost:5173)

---

Desenvolvido com 💚 sob um design altamente minimalista e poderoso.
