import { applyThermalFeedback } from "../src/api/services.js";
import type { ApiRequest, ApiResponse } from "./_http.js";
import { allow, badRequest } from "./_http.js";

export default function handler(request: ApiRequest, response: ApiResponse) {
  allow(response, ["POST"]);
  if (request.method !== "POST") return response.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  try {
    return response.status(200).json(applyThermalFeedback(request.body));
  } catch (error) {
    return badRequest(response, error);
  }
}
