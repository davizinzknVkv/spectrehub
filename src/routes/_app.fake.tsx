import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Download, ImagePlus, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/_app/fake")({
  head: () => ({ meta: [{ title: "Foto Fake — Neighborshub" }] }),
  component: FakePage,
});

const DEFAULT_AVATAR =
  "https://cdn.discordapp.com/embed/avatars/0.png";

function FakePage() {
  const [username, setUsername] = useState("neighborshub");
  const [message, setMessage] = useState("mano acabei de ganhar nitro de graça 🤯");
  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATAR);
  const [timestamp, setTimestamp] = useState("hoje às 14:32");
  const [roleColor, setRoleColor] = useState("#5865F2");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 900;
    const H = 180;
    canvas.width = W;
    canvas.height = H;

    // Discord dark bg
    ctx.fillStyle = "#313338";
    ctx.fillRect(0, 0, W, H);

    // Avatar (circular)
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(60, 60, 40, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, 20, 20, 80, 80);
      ctx.restore();

      // Username
      ctx.fillStyle = roleColor;
      ctx.font = "600 22px 'gg sans', system-ui, sans-serif";
      const nameW = ctx.measureText(username).width;
      ctx.fillText(username, 120, 46);

      // Timestamp
      ctx.fillStyle = "#949BA4";
      ctx.font = "400 13px system-ui, sans-serif";
      ctx.fillText(timestamp, 120 + nameW + 10, 46);

      // Message (wrap simples)
      ctx.fillStyle = "#DBDEE1";
      ctx.font = "400 20px system-ui, sans-serif";
      wrapText(ctx, message, 120, 78, W - 140, 26);
    };
    img.onerror = () => {
      // fallback círculo cinza
      ctx.fillStyle = "#5865F2";
      ctx.beginPath();
      ctx.arc(60, 60, 40, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = roleColor;
      ctx.font = "600 22px system-ui, sans-serif";
      ctx.fillText(username, 120, 46);
      ctx.fillStyle = "#949BA4";
      ctx.font = "400 13px system-ui, sans-serif";
      ctx.fillText(timestamp, 120 + ctx.measureText(username).width + 10, 46);
      ctx.fillStyle = "#DBDEE1";
      ctx.font = "400 20px system-ui, sans-serif";
      wrapText(ctx, message, 120, 78, W - 140, 26);
    };
    img.src = avatarUrl;
  };

  useEffect(() => {
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, message, avatarUrl, timestamp, roleColor]);

  const onUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setAvatarUrl(String(reader.result));
    reader.readAsDataURL(file);
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `fake-${username}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast.success("imagem baixada");
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <header className="flex flex-col gap-1">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-purple">
          utilitário
        </span>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Criador de foto <span className="text-cyan">fake</span>
        </h1>
        <p className="text-sm text-ink-dim">
          Monta um print estilo mensagem do Discord — só troll, use com juízo.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        {/* Form */}
        <div className="space-y-4 rounded-2xl border border-line/60 bg-surface/50 p-4 sm:p-5">
          <Field label="Nome de usuário">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input"
              maxLength={32}
            />
          </Field>
          <Field label="Cor do nome (cargo)">
            <input
              type="color"
              value={roleColor}
              onChange={(e) => setRoleColor(e.target.value)}
              className="h-10 w-20 cursor-pointer rounded border border-line bg-transparent"
            />
          </Field>
          <Field label="Horário">
            <input
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Mensagem">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="input resize-none"
            />
          </Field>
          <Field label="Avatar (URL ou upload)">
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="input flex-1"
                placeholder="https://…"
              />
              <label className="flex cursor-pointer items-center gap-2 rounded-md border border-line px-3 py-2 text-sm text-ink-dim hover:border-cyan/50 hover:text-cyan">
                <ImagePlus className="h-4 w-4" />
                upload
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onUpload(f);
                  }}
                />
              </label>
            </div>
          </Field>

          <div className="flex gap-2 pt-2">
            <button
              onClick={draw}
              className="flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm text-ink-dim hover:border-purple/50 hover:text-purple"
            >
              <RefreshCw className="h-4 w-4" /> Atualizar
            </button>
            <button
              onClick={download}
              className="flex items-center gap-2 rounded-md border border-cyan/50 bg-cyan/10 px-3 py-2 text-sm font-medium text-cyan hover:bg-cyan/20"
            >
              <Download className="h-4 w-4" /> Baixar PNG
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-2">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-mute">
            preview
          </div>
          <div className="overflow-hidden rounded-xl border border-line/60 bg-[#313338] p-2">
            <canvas ref={canvasRef} className="h-auto w-full" />
          </div>
        </div>
      </div>

      <style>{`
        .input {
          width: 100%;
          background: color-mix(in oklab, var(--surface-2) 60%, transparent);
          border: 1px solid var(--line);
          border-radius: 6px;
          padding: 8px 10px;
          font-size: 14px;
          color: var(--ink);
          outline: none;
        }
        .input:focus { border-color: color-mix(in oklab, var(--cyan) 60%, transparent); }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-ink-mute">
        {label}
      </div>
      {children}
    </label>
  );
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(" ");
  let line = "";
  let yy = y;
  for (const word of words) {
    const test = line + word + " ";
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, yy);
      line = word + " ";
      yy += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, x, yy);
}
