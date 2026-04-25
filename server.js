import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const { Pool } = pg;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "app");
const port = Number(process.env.PORT || 80);
const maxBodyBytes = Number(process.env.MAX_BODY_BYTES || 1024 * 1024);

let pool;

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp"
};

const routes = new Map([
  ["/api/leads", handleLead],
  ["/api/consultoria", handleConsultoria],
  ["/api/perfil", handleProfile]
]);

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);

    if (request.method === "GET" && url.pathname === "/health") {
      return sendText(response, 200, "ok");
    }

    if (request.method === "GET" && url.pathname === "/api/health") {
      return handleApiHealth(response);
    }

    if (request.method === "OPTIONS" && routes.has(url.pathname)) {
      return sendJson(response, 204, null);
    }

    if (request.method === "POST" && routes.has(url.pathname)) {
      const payload = await readJsonBody(request);
      const result = await routes.get(url.pathname)(payload);
      return sendJson(response, 200, result);
    }

    if (request.method === "GET" || request.method === "HEAD") {
      return serveStatic(url.pathname, request, response);
    }

    return sendJson(response, 405, { ok: false, error: "method_not_allowed" });
  } catch (error) {
    if (error.statusCode) {
      return sendJson(response, error.statusCode, { ok: false, error: error.code || "bad_request" });
    }

    console.error("Unhandled request error", error);
    return sendJson(response, 500, { ok: false, error: "internal_error" });
  }
});

server.listen(port, () => {
  console.log(`Axon site listening on :${port}`);
});

async function handleApiHealth(response) {
  try {
    await query("select 1");
    return sendJson(response, 200, { ok: true, database: "ok" });
  } catch (error) {
    console.error("Database healthcheck failed", error);
    return sendJson(response, 503, { ok: false, database: "unavailable" });
  }
}

async function handleLead(payload) {
  requireFields(payload, ["name", "email", "consent"]);
  requireGrantedConsent(payload.consent);

  const sql = `
    insert into site_leads (
      created_at,
      form_type,
      page,
      title,
      interest,
      offer,
      name,
      email,
      phone,
      stage,
      consent,
      consent_timestamp,
      legal_notice_version,
      tracking_json,
      raw_payload_json
    ) values (
      coalesce($1::timestamptz, now()),
      $2,
      $3,
      $4,
      $5,
      $6,
      $7,
      $8,
      $9,
      $10::jsonb,
      $11,
      $12::timestamptz,
      $13,
      $14::jsonb,
      $15::jsonb
    )
    returning id
  `;

  const values = [
    nullableDate(payload.createdAt),
    payload.formType || "lead",
    nullableText(payload.page),
    nullableText(payload.title),
    nullableText(payload.interest),
    nullableText(payload.offer),
    payload.name,
    payload.email,
    nullableText(payload.phone),
    jsonValue(payload.stage ?? null),
    payload.consent,
    nullableDate(payload.consentTimestamp),
    nullableText(payload.legalNoticeVersion),
    jsonValue(payload.tracking ?? null),
    jsonValue(payload)
  ];

  const result = await query(sql, values);
  await notifyN8n("lead", payload);
  return { ok: true, id: result.rows[0].id };
}

async function handleConsultoria(payload) {
  requireFields(payload, ["name", "email", "company", "acquisition", "bottleneck", "consent"]);
  requireGrantedConsent(payload.consent);

  const sql = `
    insert into consultoria_intake (
      created_at,
      name,
      email,
      company,
      company_size,
      acquisition,
      bottleneck,
      message,
      consent,
      consent_timestamp,
      legal_notice_version,
      tracking_json,
      raw_payload_json
    ) values (
      coalesce($1::timestamptz, now()),
      $2,
      $3,
      $4,
      $5,
      $6,
      $7,
      $8,
      $9,
      $10::timestamptz,
      $11,
      $12::jsonb,
      $13::jsonb
    )
    returning id
  `;

  const values = [
    nullableDate(payload.createdAt),
    payload.name,
    payload.email,
    payload.company,
    nullableText(payload.company_size),
    payload.acquisition,
    payload.bottleneck,
    nullableText(payload.message),
    payload.consent,
    nullableDate(payload.consentTimestamp),
    nullableText(payload.legalNoticeVersion),
    jsonValue(payload.tracking ?? null),
    jsonValue(payload)
  ];

  const result = await query(sql, values);
  await notifyN8n("consultoria", payload);
  return { ok: true, id: result.rows[0].id };
}

async function handleProfile(payload) {
  requireFields(payload, ["lead", "answers", "result"]);
  requireFields(payload.lead, ["name", "email", "consent"]);
  requireGrantedConsent(payload.lead.consent);

  const resultPayload = payload.result;
  requireFields(resultPayload, ["dominantOperational", "dominantMotivation", "dominantBehavior"]);

  const sql = `
    insert into entrepreneur_profile_results (
      created_at,
      lead_name,
      lead_email,
      lead_phone,
      lead_consent,
      lead_consent_timestamp,
      legal_notice_version,
      dominant_operational,
      dominant_motivation,
      dominant_behavior,
      lowest_behavior,
      composite,
      result_title,
      cta_label,
      cta_href,
      answers_json,
      tracking_json,
      raw_payload_json
    ) values (
      coalesce($1::timestamptz, now()),
      $2,
      $3,
      $4,
      $5,
      $6::timestamptz,
      $7,
      $8,
      $9,
      $10,
      $11,
      $12,
      $13,
      $14,
      $15,
      $16::jsonb,
      $17::jsonb,
      $18::jsonb
    )
    returning id
  `;

  const values = [
    nullableDate(payload.createdAt),
    payload.lead.name,
    payload.lead.email,
    nullableText(payload.lead.phone),
    payload.lead.consent,
    nullableDate(payload.lead.consentTimestamp),
    nullableText(payload.lead.legalNoticeVersion),
    resultPayload.dominantOperational,
    resultPayload.dominantMotivation,
    resultPayload.dominantBehavior,
    nullableText(resultPayload.lowestBehavior),
    nullableText(resultPayload.composite),
    nullableText(resultPayload.title),
    nullableText(resultPayload.ctaLabel),
    nullableText(resultPayload.ctaHref),
    jsonValue(payload.answers),
    jsonValue(payload.lead.tracking ?? payload.tracking ?? null),
    jsonValue(payload)
  ];

  const result = await query(sql, values);
  await notifyN8n("perfil", payload);
  return { ok: true, id: result.rows[0].id };
}

function getPool() {
  if (pool) {
    return pool;
  }

  if (process.env.DATABASE_URL) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: Number(process.env.PGPOOL_MAX || 5),
      ssl: process.env.PGSSL === "true" ? { rejectUnauthorized: false } : undefined
    });
    return pool;
  }

  pool = new Pool({
    host: process.env.PGHOST || "localhost",
    port: Number(process.env.PGPORT || 5432),
    database: process.env.PGDATABASE || "axon_ops",
    user: process.env.PGUSER || "axon_app",
    password: process.env.PGPASSWORD,
    max: Number(process.env.PGPOOL_MAX || 5)
  });
  return pool;
}

function query(sql, values = []) {
  return getPool().query(sql, values).catch((error) => {
    console.error("Database query failed", error);
    throw httpError(503, "database_unavailable");
  });
}

async function notifyN8n(kind, payload) {
  const endpoint = process.env[`N8N_${kind.toUpperCase()}_WEBHOOK_URL`];
  if (!endpoint) {
    return;
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.warn(`n8n ${kind} webhook returned ${response.status}`);
    }
  } catch (error) {
    console.warn(`n8n ${kind} webhook failed`, error);
  }
}

async function readJsonBody(request) {
  const chunks = [];
  let total = 0;

  for await (const chunk of request) {
    total += chunk.length;
    if (total > maxBodyBytes) {
      throw httpError(413, "payload_too_large");
    }
    chunks.push(chunk);
  }

  if (!chunks.length) {
    throw httpError(400, "empty_body");
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw httpError(400, "invalid_json");
  }
}

async function serveStatic(urlPathname, request, response) {
  const pathname = urlPathname === "/" ? "/index.html" : urlPathname;
  const decodedPath = decodeURIComponent(pathname);
  const safePath = path.normalize(decodedPath).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(publicDir, safePath);
  const relativePath = path.relative(publicDir, filePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return sendText(response, 403, "forbidden");
  }

  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) {
      return sendText(response, 404, "not found");
    }

    const ext = path.extname(filePath).toLowerCase();
    response.statusCode = 200;
    response.setHeader("Content-Type", contentTypes[ext] || "application/octet-stream");
    response.setHeader("Content-Length", fileStat.size);
    response.setHeader("X-Content-Type-Options", "nosniff");
    applyCacheHeaders(response, ext);

    if (request.method === "HEAD") {
      response.end();
      return;
    }

    createReadStream(filePath).pipe(response);
  } catch {
    sendText(response, 404, "not found");
  }
}

function applyCacheHeaders(response, ext) {
  if (ext === ".html") {
    response.setHeader("Cache-Control", "no-store");
    return;
  }

  if ([".css", ".js", ".png", ".jpg", ".jpeg", ".svg", ".webp", ".ico"].includes(ext)) {
    response.setHeader("Cache-Control", "public, max-age=604800, immutable");
  }
}

function requireFields(payload, fields) {
  for (const field of fields) {
    if (payload?.[field] === undefined || payload?.[field] === null || payload?.[field] === "") {
      throw httpError(422, `missing_${field}`);
    }
  }
}

function requireGrantedConsent(consent) {
  if (consent !== "granted") {
    throw httpError(422, "consent_required");
  }
}

function nullableText(value) {
  return value === undefined || value === null || value === "" ? null : String(value);
}

function nullableDate(value) {
  return value === undefined || value === null || value === "" ? null : value;
}

function jsonValue(value) {
  return JSON.stringify(value ?? null);
}

function httpError(statusCode, code) {
  const error = new Error(code);
  error.statusCode = statusCode;
  error.code = code;
  return error;
}

function sendJson(response, statusCode, payload) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (statusCode === 204) {
    response.end();
    return;
  }

  response.end(JSON.stringify(payload));
}

function sendText(response, statusCode, payload) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "text/plain; charset=utf-8");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.end(payload);
}
