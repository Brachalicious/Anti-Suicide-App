import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import express from "express";
import { createRouter } from "../server/routes";
import { MemStorage } from "../server/storage";

type JsonValue = Record<string, unknown> | unknown[] | string | number | boolean | null;

async function withSmokeServer(run: (baseUrl: string) => Promise<void>) {
  const app = express();
  app.use(express.json({ limit: "50mb" }));
  app.use(createRouter(new MemStorage()));

  const server = app.listen(0, "127.0.0.1");
  try {
    await new Promise<void>((resolve) => server.once("listening", resolve));
    const address = server.address();
    assert(address && typeof address !== "string", "Expected local server address");
    await run(`http://127.0.0.1:${address.port}`);
  } finally {
    server.close();
  }
}

async function request(baseUrl: string, route: string, init?: RequestInit) {
  const response = await fetch(`${baseUrl}${route}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  const text = await response.text();
  let body: JsonValue = null;
  if (text) {
    body = JSON.parse(text) as JsonValue;
  }
  return { response, body };
}

function requireObject(value: JsonValue): Record<string, unknown> {
  assert(value && typeof value === "object" && !Array.isArray(value));
  return value as Record<string, unknown>;
}

function requireArray(value: JsonValue): unknown[] {
  assert(Array.isArray(value));
  return value;
}

function assertDeployConfig() {
  const netlifyConfig = fs.readFileSync(path.resolve("netlify.toml"), "utf8");
  assert.match(netlifyConfig, /command = "npm run build"/);
  assert.match(netlifyConfig, /publish = "dist"/);
  assert.match(netlifyConfig, /functions = "netlify\/functions"/);
  assert.match(netlifyConfig, /from = "\/api\/\*"/);
  assert.match(netlifyConfig, /to = "\/\.netlify\/functions\/api\/:splat"/);

  const viteConfig = fs.readFileSync(path.resolve("vite.config.ts"), "utf8");
  assert.match(viteConfig, /publicDir: '\.\.\/public'/);

  assert.ok(fs.existsSync(path.resolve("public/logo.svg")), "logo.svg must exist");
  assert.ok(fs.existsSync(path.resolve("public/favicon.svg")), "favicon.svg must exist");
  assert.ok(fs.existsSync(path.resolve("netlify/functions/api.ts")), "Netlify API function must exist");

  const appRoutes = fs.readFileSync(path.resolve("client/src/App.tsx"), "utf8");
  assert.doesNotMatch(appRoutes, /virtual-parent/i, "Removed Virtual Parent route must stay absent");

  const navigation = fs.readFileSync(path.resolve("client/src/components/Navigation.tsx"), "utf8");
  assert.doesNotMatch(navigation, /Virtual Parent|virtual-parent/i, "Removed Virtual Parent nav must stay absent");

  const serverRoutes = fs.readFileSync(path.resolve("server/routes.ts"), "utf8");
  assert.doesNotMatch(serverRoutes, /virtual-parent|GEMINI_API_KEY|GoogleGenerativeAI/i);

  const apiAudit = fs.readFileSync(path.resolve("API_FEATURE_AUDIT.md"), "utf8");
  assert.match(apiAudit, /Required for current deploy\s*\n\s*None\./);
  assert.match(apiAudit, /AI_INTEGRATIONS_OPENAI_API_KEY/);
  assert.match(apiAudit, /not active/i);

  const legacyIndex = fs.readFileSync(path.resolve("index.html"), "utf8");
  const diaryNavMatches = legacyIndex.match(/showSection\('mood'\)[^>]*>📓 My Diary<\/button>/g) ?? [];
  assert.equal(diaryNavMatches.length, 1, "My Diary should only appear under Emotional Support Tools");

  const crisisPage = fs.readFileSync(path.resolve("client/src/pages/CrisisSupport.tsx"), "utf8");
  assert.doesNotMatch(crisisPage, /tel:\$\{phoneNumber\}/, "Hotlines must not create unsanitized tel links");
  assert.match(crisisPage, /sms:741741\?body=HOME/, "Crisis Text Line must use an sms link");
  assert.match(crisisPage, /getDialHref/, "Crisis hotline calls must be dialability-checked");

  const modal = fs.readFileSync(path.resolve("client/src/components/ui/modal.tsx"), "utf8");
  assert.match(modal, /overflow-y-auto/, "Modal content must scroll vertically");

  const globalCss = fs.readFileSync(path.resolve("client/src/index.css"), "utf8");
  assert.match(globalCss, /overflow-x: hidden/, "App should prevent accidental horizontal cut-off");
}

async function assertApiSmoke(baseUrl: string) {
  const test = await request(baseUrl, "/api/test");
  assert.equal(test.response.status, 200);
  assert.equal(requireObject(test.body).status, "ok");

  const hotlines = await request(baseUrl, "/api/crisis-hotlines");
  assert.equal(hotlines.response.status, 200);
  assert.ok(
    requireArray(hotlines.body).some((entry) =>
      String((entry as Record<string, unknown>).name).includes("988")
    )
  );

  const resources = await request(baseUrl, "/api/resources?emergency=true");
  assert.equal(resources.response.status, 200);
  assert.ok(requireArray(resources.body).length > 0);

  const wellness = await request(baseUrl, "/api/wellness-activities");
  assert.equal(wellness.response.status, 200);
  assert.ok(requireArray(wellness.body).length >= 3);

  const timestamp = new Date().toISOString();
  const moodCreate = await request(baseUrl, "/api/mood-entries", {
    method: "POST",
    body: JSON.stringify({
      userId: "smoke-user",
      mood: 7,
      emoji: "ok",
      emotions: ["Calm"],
      copingStrategies: ["Breathing"],
      timestamp,
    }),
  });
  assert.equal(moodCreate.response.status, 201);
  const mood = requireObject(moodCreate.body);
  assert.equal(mood.mood, 7);

  const moodList = await request(baseUrl, "/api/mood-entries/smoke-user");
  assert.equal(moodList.response.status, 200);
  assert.equal(requireArray(moodList.body).length, 1);

  const moodDelete = await request(baseUrl, `/api/mood-entries/${mood.id}`, { method: "DELETE" });
  assert.equal(moodDelete.response.status, 204);

  const journalCreate = await request(baseUrl, "/api/journal-entries", {
    method: "POST",
    body: JSON.stringify({
      userId: "smoke-user",
      title: "Smoke",
      content: "Testing journal",
      mood: 5,
      isPrivate: true,
      tags: [],
      timestamp,
    }),
  });
  assert.equal(journalCreate.response.status, 201);
  const journal = requireObject(journalCreate.body);

  const journalList = await request(baseUrl, "/api/journal-entries/smoke-user");
  assert.equal(journalList.response.status, 200);
  assert.ok(
    requireArray(journalList.body).some((entry) => (entry as Record<string, unknown>).id === journal.id)
  );

  const journalPatch = await request(baseUrl, `/api/journal-entries/${journal.id}`, {
    method: "PATCH",
    body: JSON.stringify({ title: "Updated Smoke" }),
  });
  assert.equal(journalPatch.response.status, 200);
  assert.equal(requireObject(journalPatch.body).title, "Updated Smoke");

  const journalDelete = await request(baseUrl, `/api/journal-entries/${journal.id}`, { method: "DELETE" });
  assert.equal(journalDelete.response.status, 204);

  const contactCreate = await request(baseUrl, "/api/emergency-contacts", {
    method: "POST",
    body: JSON.stringify({
      userId: "smoke-user",
      name: "Helper",
      phoneNumber: "988",
      relationship: "hotline",
      isPrimary: true,
    }),
  });
  assert.equal(contactCreate.response.status, 201);
  const contact = requireObject(contactCreate.body);

  const contactPatch = await request(baseUrl, `/api/emergency-contacts/${contact.id}`, {
    method: "PATCH",
    body: JSON.stringify({ relationship: "support" }),
  });
  assert.equal(contactPatch.response.status, 200);
  assert.equal(requireObject(contactPatch.body).relationship, "support");

  const contactDelete = await request(baseUrl, `/api/emergency-contacts/${contact.id}`, { method: "DELETE" });
  assert.equal(contactDelete.response.status, 204);

  const missingPlan = await request(baseUrl, "/api/safety-plans/smoke-user");
  assert.equal(missingPlan.response.status, 404);

  const safetyCreate = await request(baseUrl, "/api/safety-plans", {
    method: "POST",
    body: JSON.stringify({
      userId: "smoke-user",
      warningSignals: ["isolate"],
      copingStrategies: ["breathe"],
      socialSupports: ["friend"],
      professionalContacts: ["988"],
      environmentalSafety: ["safe room"],
      lastUpdated: timestamp,
    }),
  });
  assert.equal(safetyCreate.response.status, 201);
  const safetyPlan = requireObject(safetyCreate.body);

  const safetyPatch = await request(baseUrl, `/api/safety-plans/${safetyPlan.id}`, {
    method: "PATCH",
    body: JSON.stringify({ copingStrategies: ["walk"] }),
  });
  assert.equal(safetyPatch.response.status, 200);
  assert.deepEqual(requireObject(safetyPatch.body).copingStrategies, ["walk"]);

  const userCreate = await request(baseUrl, "/api/users", {
    method: "POST",
    body: JSON.stringify({
      nickname: "Tester",
      preferences: { enableNotifications: true, darkMode: false, language: "en" },
      lastActive: timestamp,
    }),
  });
  assert.equal(userCreate.response.status, 201);
  const user = requireObject(userCreate.body);

  const userPatch = await request(baseUrl, `/api/users/${user.id}`, {
    method: "PATCH",
    body: JSON.stringify({ nickname: "Updated Tester" }),
  });
  assert.equal(userPatch.response.status, 200);
  assert.equal(requireObject(userPatch.body).nickname, "Updated Tester");
}

async function main() {
  assertDeployConfig();
  await withSmokeServer(assertApiSmoke);
  console.log("Smoke tests passed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
