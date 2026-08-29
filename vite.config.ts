import { defineConfig } from "vite";
import { applyThermalFeedback, evaluateThermalPreference, getValidationResult } from "./src/api/services.js";

function readBody(request: import("node:http").IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => { body += chunk; });
    request.on("end", () => {
      try { resolve(body ? JSON.parse(body) : {}); }
      catch (error) { reject(error); }
    });
    request.on("error", reject);
  });
}

function send(response: import("node:http").ServerResponse, status: number, payload: unknown) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json");
  response.setHeader("Cache-Control", "no-store");
  response.end(JSON.stringify(payload));
}

export default defineConfig({
  plugins: [{
    name: "titie-local-api",
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const path = request.url?.split("?")[0];
        if (!path?.startsWith("/api/")) return next();
        try {
          if (path === "/api/health" && request.method === "GET") return send(response, 200, { status: "ok", simulation: true, evidenceLabel: "Prototype Simulation" });
          if (path === "/api/validate" && request.method === "GET") return send(response, 200, getValidationResult());
          if (path === "/api/evaluate" && request.method === "POST") return send(response, 200, evaluateThermalPreference(await readBody(request)));
          if (path === "/api/feedback" && request.method === "POST") return send(response, 200, applyThermalFeedback(await readBody(request)));
          return send(response, 405, { error: "METHOD_NOT_ALLOWED" });
        } catch (error) {
          return send(response, 400, { error: "INVALID_REQUEST", message: error instanceof Error ? error.message : "Invalid request" });
        }
      });
    },
  }],
  build: {
    outDir: "dist/web",
    emptyOutDir: true
  }
});
