// AES-GCM encryption for Discord tokens at rest. Server-only.

function getKeyMaterial(): Uint8Array {
  const raw = process.env.DISCORD_TOKEN_ENCRYPTION_KEY;
  if (!raw) throw new Error("DISCORD_TOKEN_ENCRYPTION_KEY missing");
  // Hash to 32 bytes so any secret length works.
  return new Uint8Array(raw.split("").map((c) => c.charCodeAt(0)));
}

async function importKey(): Promise<CryptoKey> {
  const material = getKeyMaterial();
  const hash = await crypto.subtle.digest("SHA-256", material as unknown as ArrayBuffer);
  return crypto.subtle.importKey("raw", hash, { name: "AES-GCM" }, false, [
    "encrypt",
    "decrypt",
  ]);
}

function b64encode(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function b64decode(s: string): Uint8Array {
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export async function encryptToken(plain: string): Promise<{ ciphertext: string; iv: string }> {
  const key = await importKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder().encode(plain);
  const ct = new Uint8Array(
    await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv as unknown as ArrayBuffer }, key, enc as unknown as ArrayBuffer),
  );
  return { ciphertext: b64encode(ct), iv: b64encode(iv) };
}

export async function decryptToken(ciphertext: string, ivB64: string): Promise<string> {
  const key = await importKey();
  const iv = b64decode(ivB64);
  const ct = b64decode(ciphertext);
  const pt = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv as unknown as ArrayBuffer },
    key,
    ct as unknown as ArrayBuffer,
  );
  return new TextDecoder().decode(pt);
}
