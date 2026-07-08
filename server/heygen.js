// Integração HeyGen — Fábrica de Vídeos (Módulo 4).
// A API key é sempre a do aluno (vem do payload/projeto), nunca env var nossa.

const HEYGEN_API_BASE = "https://api.heygen.com";

// Frase curta do vídeo de teste: já usa a "direção por pontuação" da Fábrica.
const TEST_SCRIPT =
  "Olá! Eu sou o seu novo apresentador digital... A partir de agora, eu divulgo o seu negócio — todos os dias, no automático.";

async function heygenRequest(apiKey, method, path, body) {
  let response;
  try {
    response = await fetch(`${HEYGEN_API_BASE}${path}`, {
      method,
      headers: { "X-Api-Key": apiKey, "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined
    });
  } catch (error) {
    return { ok: false, status: 0, error: "heygen_unreachable", detail: error.message };
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = data?.error?.message || data?.message || `HTTP ${response.status}`;
    return { ok: false, status: response.status, error: "heygen_request_failed", detail, data };
  }
  return { ok: true, status: response.status, data: data?.data ?? data };
}

// O aluno copia o id da URL do HeyGen. Pode ser:
//  a) um avatar da biblioteca/studio (caso padrão) — id usável direto em POST /v3/videos;
//  b) um grupo de photo avatar — precisa resolver para o id de um look do grupo.
// Valida com a key do aluno e devolve nome + thumbnail para confirmação visual.
export async function validateHeygenConfig({ apiKey, avatarId }) {
  if (!apiKey) return { ok: false, error: "heygen_key_missing" };
  if (!avatarId) return { ok: false, error: "heygen_avatar_missing" };

  const id = encodeURIComponent(avatarId);

  // a) avatar studio/biblioteca (verificado 2026-07-08: cobre públicos e instant avatars)
  const details = await heygenRequest(apiKey, "GET", `/v2/avatar/${id}/details`);
  if (details.ok) {
    const d = details.data || {};
    return {
      ok: true,
      avatarId: d.id || avatarId,
      name: d.name || "Avatar",
      thumbnail: d.preview_image_url || ""
    };
  }
  if (details.status === 401 || details.status === 403) {
    return { ok: false, error: "heygen_key_invalid" };
  }

  // b) grupo de photo avatar → resolve para o primeiro look completo do grupo
  const group = await heygenRequest(apiKey, "GET", `/v3/avatars/${id}`);
  if (!group.ok) {
    if (group.status === 401 || group.status === 403) {
      return { ok: false, error: "heygen_key_invalid" };
    }
    if (group.status === 404 || details.status === 404) {
      return { ok: false, error: "heygen_avatar_not_found" };
    }
    return { ok: false, error: "heygen_request_failed", detail: group.detail || details.detail };
  }

  const groupData = group.data || {};
  // Endpoint v2 (sunset 31/10/2026): único que lista os looks de um grupo hoje.
  const looks = await heygenRequest(apiKey, "GET", `/v2/avatar_group/${id}/avatars`);
  const list = looks.ok
    ? looks.data?.avatar_list || (Array.isArray(looks.data) ? looks.data : [])
    : [];
  const look = list.find((item) => item?.status === "completed") || list[0];

  if (!look?.id) {
    return { ok: false, error: "heygen_avatar_not_found", detail: "grupo sem look utilizavel" };
  }

  return {
    ok: true,
    avatarId: look.id,
    name: groupData.name || look.name || "Avatar",
    thumbnail: look.image_url || groupData.preview_image_url || ""
  };
}

export async function createHeygenTestVideo({ apiKey, avatarId, voiceId }) {
  if (!apiKey || !avatarId || !voiceId) return { ok: false, error: "heygen_config_incomplete" };

  const result = await heygenRequest(apiKey, "POST", "/v3/videos", {
    type: "avatar",
    avatar_id: avatarId,
    script: TEST_SCRIPT,
    voice_id: voiceId,
    aspect_ratio: "9:16",
    resolution: "1080p",
    fit: "cover",
    caption: { file_format: "srt", style: "default" },
    title: "Fabrica de Videos - teste de configuracao"
  });

  if (!result.ok) {
    if (result.status === 401 || result.status === 403) {
      return { ok: false, error: "heygen_key_invalid" };
    }
    // 4xx com mensagem de saldo aparece como moneys/credit no detail da HeyGen
    return { ok: false, error: "heygen_video_create_failed", detail: result.detail };
  }

  const videoId = result.data?.video_id || result.data?.id;
  if (!videoId) return { ok: false, error: "heygen_video_create_failed", detail: "sem video_id na resposta" };
  return { ok: true, videoId };
}

export async function getHeygenVideoStatus({ apiKey, videoId }) {
  if (!apiKey || !videoId) return { ok: false, error: "heygen_config_incomplete" };

  const result = await heygenRequest(apiKey, "GET", `/v3/videos/${encodeURIComponent(videoId)}`);
  if (!result.ok) return { ok: false, error: "heygen_status_failed", detail: result.detail };

  const d = result.data || {};
  return {
    ok: true,
    status: d.status || "processing",
    videoUrl: d.captioned_video_url || d.video_url || "",
    error: d.error || null
  };
}
