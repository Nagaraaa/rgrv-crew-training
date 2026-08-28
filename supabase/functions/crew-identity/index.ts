import { createClient } from 'jsr:@supabase/supabase-js@2';

const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
  auth: { persistSession: false },
});
const localOrigins = new Set(['http://localhost:5173']);
const isAllowedOrigin = (origin: string) => localOrigins.has(origin) || /^https:\/\/rgrv-crew-training(?:-[a-z0-9-]+)?\.vercel\.app$/i.test(origin);
const cors = (request: Request) => {
  const origin = request.headers.get('origin') ?? '';
  return {
    'Access-Control-Allow-Origin': isAllowedOrigin(origin) ? origin : 'null',
    'Access-Control-Allow-Headers': 'content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    Vary: 'Origin',
  };
};
const json = (request: Request, body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...cors(request), 'Content-Type': 'application/json; charset=utf-8' },
});
const encoder = new TextEncoder();
const b64url = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
const fromB64url = (value: string) => Uint8Array.from(atob(value.replaceAll('-', '+').replaceAll('_', '/') + '='.repeat((4 - value.length % 4) % 4)), (character) => character.charCodeAt(0));
async function sha256(value: string) {
  const result = await crypto.subtle.digest('SHA-256', encoder.encode(value));
  return [...new Uint8Array(result)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}
async function pinHash(pin: string, salt: string) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(pin), 'PBKDF2', false, ['deriveBits']);
  const result = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: fromB64url(salt), iterations: 210_000 }, key, 256);
  return b64url(new Uint8Array(result));
}
function sameValue(left: string, right: string) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return difference === 0;
}
function normalize(value: string) {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
}
function person(raw: unknown, label: string, maximum: number) {
  const value = String(raw ?? '').trim().replace(/\s+/g, ' ');
  if (value.length < 2 || value.length > maximum || !/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/.test(value)) return { error: `${label} invalide.` } as const;
  return { value } as const;
}
const validPin = (value: unknown) => /^\d{6}$/.test(String(value ?? '')) ? String(value) : null;
const sessionToken = () => b64url(crypto.getRandomValues(new Uint8Array(32)));
function profilePayload(profile: Record<string, unknown>) {
  return {
    id: profile.id,
    first_name: profile.first_name,
    last_name: profile.last_name,
    display_name: `${profile.first_name} ${String(profile.last_name).slice(0, 1)}.`,
    leaderboard_opt_in: profile.leaderboard_opt_in,
    xp: profile.xp,
    level: profile.level,
  };
}
async function register(request: Request, body: Record<string, unknown>) {
  const first = person(body.first_name, 'Prénom', 40);
  const last = person(body.last_name, 'Nom', 60);
  const pin = validPin(body.pin);
  if ('error' in first || 'error' in last || !pin) return json(request, { error: 'Indique ton prénom, ton nom et un code personnel à 6 chiffres.' }, 400);
  const identity = `${normalize(first.value)}.${normalize(last.value)}`;
  const salt = b64url(crypto.getRandomValues(new Uint8Array(16)));
  const token = sessionToken();
  const { data, error } = await db.from('crew_profiles').insert({
    username: `${first.value} ${last.value.slice(0, 1)}.`, username_normalized: identity,
    first_name: first.value, last_name: last.value, identity_normalized: identity,
    pin_salt: salt, pin_hash: await pinHash(pin, salt), token_hash: await sha256(token),
  }).select('*').single();
  if (error?.code === '23505') return json(request, { error: 'Un profil avec ce prénom et ce nom existe déjà. Adresse-toi au manager si c’est ton cas.' }, 409);
  if (error || !data) return json(request, { error: 'Impossible de créer le profil.' }, 500);
  return json(request, { token, profile: profilePayload(data) });
}
async function login(request: Request, body: Record<string, unknown>) {
  const first = person(body.first_name, 'Prénom', 40);
  const last = person(body.last_name, 'Nom', 60);
  const pin = validPin(body.pin);
  if ('error' in first || 'error' in last || !pin) return json(request, { error: 'Vérifie ton prénom, ton nom et ton code personnel.' }, 400);
  const identity = `${normalize(first.value)}.${normalize(last.value)}`;
  const { data: profile } = await db.from('crew_profiles').select('*').eq('identity_normalized', identity).maybeSingle();
  if (!profile?.pin_salt || !profile.pin_hash || !sameValue(await pinHash(pin, profile.pin_salt), profile.pin_hash)) return json(request, { error: 'Identifiants incorrects.' }, 401);
  const token = sessionToken();
  const { error } = await db.from('crew_profiles').update({ token_hash: await sha256(token), updated_at: new Date().toISOString() }).eq('id', profile.id);
  if (error) return json(request, { error: 'Impossible d’ouvrir la session.' }, 500);
  return json(request, { token, profile: profilePayload(profile) });
}
Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: cors(request) });
  if (request.method !== 'POST') return json(request, { error: 'Méthode non autorisée.' }, 405);
  if (!isAllowedOrigin(request.headers.get('origin') ?? '')) return json(request, { error: 'Origine non autorisée.' }, 403);
  try {
    const body = await request.json();
    if (body.action === 'register') return await register(request, body);
    if (body.action === 'login') return await login(request, body);
    return json(request, { error: 'Action inconnue.' }, 400);
  } catch (error) {
    console.error(error);
    return json(request, { error: 'Erreur serveur.' }, 500);
  }
});
