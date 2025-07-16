import { file } from "bun";

const NEXTJS_STATIC_PREFIX = "/_next/";
const STATIC_FILES_DIR = "./public";

const NEXTJS_APP_URL = "http://localhost:3000";

Bun.serve({
  port: 3031,
  async fetch(request) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    if (pathname.startsWith(NEXTJS_STATIC_PREFIX)) {
      const filePath = STATIC_FILES_DIR + pathname;
      const staticFile = Bun.file(filePath);

      if (await staticFile.exists()) {
        return new Response(staticFile);
      }
    }

    const proxiedUrl = NEXTJS_APP_URL + pathname + url.search;

    const newHeaders = new Headers(request.headers);
    newHeaders.set('X-Forwarded-For', request.headers.get('x-forwarded-for') || request.remoteAddress);
    newHeaders.set('X-Forwarded-Host', request.headers.get('x-forwarded-host') || url.host);
    newHeaders.set('X-Forwarded-Proto', request.headers.get('x-forwarded-proto') || url.protocol.replace(':', ''));

    try {
      const proxyResponse = await fetch(proxiedUrl, {
        method: request.method,
        headers: newHeaders,
        body: request.body,
        duplex: 'half',
      });
      return proxyResponse;
    } catch (error) {
      return new Response("Proxy error", { status: 500 });
    }
  },
});

console.log("Bun proxy server running on http://localhost:3031");
console.log(`Proxying requests to Next.js app at ${NEXTJS_APP_URL}`);
console.log(`Serving static files from ${STATIC_FILES_DIR} for paths starting with ${NEXTJS_STATIC_PREFIX}`);
