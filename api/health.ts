import type { ApiRequest, ApiResponse } from "./_http.js";
import { allow } from "./_http.js";

export default function handler(request: ApiRequest, response: ApiResponse) {
  allow(response, ["GET"]);
  if (request.method !== "GET") return response.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  return response.status(200).json({
    status: "ok",
    service: "titie-bluebox",
    simulation: true,
    evidenceLabel: "Prototype Simulation"
  });
}
