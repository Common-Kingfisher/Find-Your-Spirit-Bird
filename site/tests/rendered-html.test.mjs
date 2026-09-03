import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the bird personality test shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>测测你的本命鸟/);
  assert.match(html, /测测你的/);
  assert.match(html, /本命鸟/);
  assert.match(html, /15 种鸟格/);
  assert.doesNotMatch(html, /Your site is taking shape|react-loading-skeleton/);
});

test("publishes Chinese metadata and local-first copy", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(html, /lang="zh-CN"/);
  assert.match(html, /答案只在本地计算/);
  assert.match(html, /不按稀有度分配结果/);
  assert.doesNotMatch(html, /codex-preview/);
});
