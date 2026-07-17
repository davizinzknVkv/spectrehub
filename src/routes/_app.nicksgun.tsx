import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  fetchGuilds,
  searchGuildMembers,
  listGuildMembers,
  changeMemberNick,
  type Guild,
  type GuildMember,
} from "@/lib/quest-runner";
import { useQuestStore } from "@/lib/quest-store";
import { Copy, Crosshair, Loader2, RefreshCw, Search, Pencil, Check, X } from "lucide-react";

export const Route = createFileRoute("/_app/nicksgun")({
  head: () => ({ meta: [{ title: "Nicks-Gun — Neighborshub" }] }),
  component: NicksGunPage,
});

function NicksGunPage() {
  const creds = useQuestStore((s) => s.creds);
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [guildId, setGuildId] = useState<string>("");
  const [members, setMembers] = useState<GuildMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [scanMode, setScanMode] = useState<"search" | "list">("list");

  useEffect(() => {
    if (!creds) return;
    fetchGuilds().then((g) => {
      setGuilds(g);
      if (g[0] && !guildId) setGuildId(g[0].id);
    }).catch(() => {});
  }, [creds]);

  async function scan() {
    if (!guildId) {
      toast.error("Selecione um servidor");
      return;
    }
    setLoading(true);
    setMembers([]);
    try {
      let all: GuildMember[] = [];
      if (scanMode === "search") {
        // Search endpoint: try each letter/pair to catch short nicks
        const seeds = "abcdefghijklmnopqrstuvwxyz0123456789".split("");
        const seen = new Set<string>();
        for (const s of seeds) {
          const batch = await searchGuildMembers(guildId, s, 100);
          for (const m of batch) {
            if (!seen.has(m.user.id)) {
              seen.add(m.user.id);
              all.push(m);
            }
          }
        }
      } else {
        // List endpoint (requires elevated perms usually; try full paginated)
        let after = "0";
        for (let i = 0; i < 20; i++) {
          const batch = await listGuildMembers(guildId, after, 1000);
          if (batch.length === 0) break;
          all = all.concat(batch);
          after = batch[batch.length - 1].user.id;
          if (batch.length < 1000) break;
        }
      }
      const filtered = all.filter((m) => {
        const nick = (m.nick || "").trim();
        return nick.length >= 2 && nick.length <= 3;
      });
      setMembers(filtered);
      toast.success(`${filtered.length} alvos encontrados`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha no rastreio");
    } finally {
      setLoading(false);
    }
  }

  const visible = useMemo(() => {
    if (!query) return members;
    const q = query.toLowerCase();
    return members.filter(
      (m) =>
        (m.nick || "").toLowerCase().includes(q) ||
        m.user.username.toLowerCase().includes(q) ||
        m.user.id.includes(q),
    );
  }, [members, query]);

  if (!creds) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-amber/30 bg-surface/60 p-8">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber">
          $ status --token
        </div>
        <h2 className="mt-3 text-2xl font-semibold text-ink">Token não configurado</h2>
        <p className="mt-2 text-sm text-ink-dim">
          Configure seu token na página de Login para usar o Nicks-Gun.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div
          className="grid h-11 w-11 place-items-center rounded-xl border border-cyan/50 bg-gradient-to-br from-cyan/10 to-purple/20 text-cyan"
          style={{ boxShadow: "0 0 22px -6px color-mix(in oklab, var(--cyan) 70%, transparent)" }}
        >
          <Crosshair className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Nicks-<span className="text-cyan drop-shadow-[0_0_10px_rgba(34,211,238,0.7)]">Gun</span>
          </h1>
          <p className="mt-1 text-sm text-ink-dim">
            Rastreia membros com apelidos de <span className="text-purple">2 ou 3 letras</span> e
            permite alterar nicks direto do painel.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="glass-panel space-y-4 p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
          <select
            value={guildId}
            onChange={(e) => setGuildId(e.target.value)}
            className="w-full rounded-lg border border-line bg-black/40 px-3 py-2 text-sm text-ink outline-none focus:border-cyan/60"
          >
            <option value="">— selecione um servidor —</option>
            {guilds.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name} {g.owner ? "👑" : ""}
              </option>
            ))}
          </select>
          <select
            value={scanMode}
            onChange={(e) => setScanMode(e.target.value as "search" | "list")}
            className="rounded-lg border border-line bg-black/40 px-3 py-2 text-sm text-ink outline-none focus:border-cyan/60"
            title="Modo de rastreio"
          >
            <option value="list">Listar (bot/admin)</option>
            <option value="search">Search (user token)</option>
          </select>
          <button
            onClick={scan}
            disabled={loading || !guildId}
            className="inline-flex items-center gap-2 rounded-lg border border-cyan/50 bg-gradient-to-r from-cyan/20 to-purple/20 px-4 py-2 text-sm font-semibold text-ink transition hover:border-cyan hover:shadow-[0_0_20px_-4px_rgba(34,211,238,0.7)] disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            {loading ? "Rastreando..." : "Rastrear"}
          </button>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filtrar por nick, username ou ID..."
            className="w-full rounded-lg border border-line bg-black/40 py-2 pl-9 pr-3 text-sm text-ink outline-none focus:border-purple/60"
          />
        </div>

        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-ink-mute">
          <span>alvos: <span className="text-cyan">{members.length}</span></span>
          <span>visíveis: <span className="text-purple">{visible.length}</span></span>
        </div>
      </div>

      {/* Results */}
      {visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line/60 bg-surface/40 p-10 text-center text-sm text-ink-mute">
          {loading ? "Escaneando membros..." : "Nenhum alvo. Rastreie um servidor para começar."}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((m) => (
            <MemberCard key={m.user.id} guildId={guildId} member={m} onUpdated={(newNick) => {
              setMembers((prev) => prev.map((x) => x.user.id === m.user.id ? { ...x, nick: newNick } : x));
            }} />
          ))}
        </div>
      )}
    </div>
  );
}

function MemberCard({
  guildId,
  member,
  onUpdated,
}: {
  guildId: string;
  member: GuildMember;
  onUpdated: (nick: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(member.nick || "");
  const [busy, setBusy] = useState(false);

  const avatar = member.user.avatar
    ? `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png?size=64`
    : `https://cdn.discordapp.com/embed/avatars/${(BigInt(member.user.id) >> 22n) % 6n}.png`;

  async function submit() {
    if (!value.trim()) {
      toast.error("Nick vazio");
      return;
    }
    setBusy(true);
    const res = await changeMemberNick(guildId, member.user.id, value.trim());
    setBusy(false);
    if (res.ok) {
      toast.success(`Nick alterado → ${value.trim()}`);
      onUpdated(value.trim());
      setEditing(false);
    } else {
      toast.error(res.message);
    }
  }

  function copy(text: string, label: string) {
    navigator.clipboard.writeText(text).then(() => toast.success(`${label} copiado`));
  }

  return (
    <div
      className="group relative overflow-hidden rounded-xl border border-line/70 bg-gradient-to-br from-black/60 to-surface/30 p-4 transition hover:border-cyan/50"
      style={{ boxShadow: "inset 0 0 40px -20px rgba(139,92,246,0.15)" }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/60 to-transparent opacity-0 transition group-hover:opacity-100" />

      <div className="flex items-start gap-3">
        <img
          src={avatar}
          alt=""
          width={44}
          height={44}
          className="h-11 w-11 shrink-0 rounded-full border border-purple/40"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold text-ink">
              {member.user.global_name || member.user.username}
            </span>
            <span
              className="rounded border border-cyan/40 bg-cyan/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-cyan"
              title="Nick atual"
            >
              {member.nick}
            </span>
          </div>
          <div className="mt-0.5 truncate font-mono text-[11px] text-ink-mute">
            @{member.user.username}
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="truncate font-mono text-[10px] text-purple/80">{member.user.id}</span>
            <button
              onClick={() => copy(member.user.id, "ID")}
              className="rounded p-1 text-ink-mute hover:bg-purple/10 hover:text-purple"
              title="Copiar ID"
            >
              <Copy className="h-3 w-3" />
            </button>
            <button
              onClick={() => copy(member.user.username, "Username")}
              className="rounded p-1 text-ink-mute hover:bg-cyan/10 hover:text-cyan"
              title="Copiar username"
            >
              <Copy className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {editing ? (
        <div className="mt-3 flex items-center gap-2">
          <input
            autoFocus
            value={value}
            maxLength={32}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="novo nick"
            className="flex-1 rounded-md border border-cyan/40 bg-black/60 px-2 py-1.5 font-mono text-sm text-ink outline-none focus:border-cyan"
          />
          <button
            onClick={submit}
            disabled={busy}
            className="grid h-8 w-8 place-items-center rounded-md border border-cyan/50 bg-cyan/15 text-cyan hover:bg-cyan/25 disabled:opacity-50"
            title="Confirmar"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          </button>
          <button
            onClick={() => { setEditing(false); setValue(member.nick || ""); }}
            className="grid h-8 w-8 place-items-center rounded-md border border-line text-ink-mute hover:border-rose/50 hover:text-rose"
            title="Cancelar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md border border-purple/50 bg-purple/10 px-3 py-1.5 text-xs font-semibold text-purple transition hover:border-purple hover:bg-purple/20 hover:shadow-[0_0_16px_-4px_rgba(139,92,246,0.7)]"
        >
          <Pencil className="h-3.5 w-3.5" />
          Alterar Nick
        </button>
      )}
    </div>
  );
}
