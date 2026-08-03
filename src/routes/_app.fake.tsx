import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Download, ImagePlus, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button, Card, Field, buttonClass } from "@/components/ui/ds";

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
  const [roleColor, setRoleColor] = useState("#818cf8");
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
      ctx.fillStyle = "#818cf8";
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
    <div className="page-stack">
      <PageHeader
        eyebrow="utilitário"
        icon={ImagePlus}
        title="Criador de foto"
        highlight="fake"
        description="Monta um print estilo mensagem do Discord — só troll, use com juízo."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        {/* Form */}
        <Card className="space-y-4">
          <Field label="Nome de usuário">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="ds-input"
              maxLength={32}
            />
          </Field>
          <Field label="Cor do nome (cargo)">
            <input
              type="color"
              value={roleColor}
              onChange={(e) => setRoleColor(e.target.value)}
              className="h-10 w-20 cursor-pointer rounded border border-[var(--border-1)] bg-transparent"
            />
          </Field>
          <Field label="Horário">
            <input
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              className="ds-input"
            />
          </Field>
          <Field label="Mensagem">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="ds-input resize-none"
            />
          </Field>
          <Field label="Avatar (URL ou upload)">
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="ds-input flex-1"
                placeholder="https://…"
              />
              <label className={buttonClass("secondary", "md", "cursor-pointer")}>
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
            <Button variant="secondary" onClick={draw}>
              <RefreshCw className="h-4 w-4" /> Atualizar
            </Button>
            <Button variant="primary" onClick={download}>
              <Download className="h-4 w-4" /> Baixar PNG
            </Button>
          </div>
        </Card>

        {/* Preview */}
        <div className="space-y-2">
          <div className="ds-label">preview</div>
          <div className="overflow-hidden rounded-xl border border-[var(--border-1)] bg-[#313338] p-2">
            <canvas ref={canvasRef} className="h-auto w-full" />
          </div>
        </div>
      </div>
    </div>
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
