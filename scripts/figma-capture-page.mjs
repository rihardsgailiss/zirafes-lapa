/**
 * Headless Playwright: submit HTML-to-design capture then exit (viewport 1440×900).
 * captureForDesign's promise may not settle in automation; we fire, wait for network, close.
 *
 * Usage: node scripts/figma-capture-page.mjs <captureId> <path> [selector]
 */
import { chromium } from "playwright";

const captureId = process.argv[2];
const pathOrUrl = process.argv[3] || "/index.html";
const selector = process.argv[4] || "body";

if (!captureId) {
  console.error("Usage: node scripts/figma-capture-page.mjs <captureId> <path> [selector]");
  process.exit(1);
}

const base = "http://127.0.0.1:8765";
const url =
  pathOrUrl.startsWith("http") ? pathOrUrl : `${base}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;

const endpoint = `https://mcp.figma.com/mcp/capture/${captureId}/submit`;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});

page.on("pageerror", (err) => console.error("pageerror:", err.message));

await page.route("**/*", async (route) => {
  const response = await route.fetch();
  const headers = { ...response.headers() };
  delete headers["content-security-policy"];
  delete headers["content-security-policy-report-only"];
  await route.fulfill({ response, headers });
});

const submitPromise = new Promise((resolve) => {
  const onResponse = async (resp) => {
    try {
      const u = resp.url();
      if (!u.includes("/mcp/capture/") || !u.endsWith("/submit")) return;
      const text = await resp.text().catch(() => "");
      page.off("response", onResponse);
      resolve({ status: resp.status(), url: u, bodySnippet: text.slice(0, 500) });
    } catch (e) {
      page.off("response", onResponse);
      resolve({ error: String(e) });
    }
  };
  page.on("response", onResponse);
});

console.error(`Loading ${url} …`);
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120000 });

const res = await page.context().request.get("https://mcp.figma.com/mcp/html-to-design/capture.js");
const js = await res.text();
await page.evaluate((source) => {
  const el = document.createElement("script");
  el.textContent = source;
  document.head.appendChild(el);
}, js);

await page.waitForFunction(
  () => typeof window.figma?.captureForDesign === "function",
  null,
  { timeout: 60000 }
);

console.error(`Submitting capture (${selector}) …`);
await page.evaluate(
  ({ captureId: id, endpoint: ep, selector: sel }) => {
    void window.figma.captureForDesign({
      captureId: id,
      endpoint: ep,
      selector: sel,
    });
  },
  { captureId, endpoint, selector }
);

const raced = await Promise.race([
  submitPromise,
  new Promise((resolve) => setTimeout(() => resolve({ timedOut: true }), 180000)),
]);

console.log(JSON.stringify({ url, selector, submit: raced }, null, 2));
await browser.close();
