import { getValidationResult } from "../src/api/services.js";
import type { ApiRequest, ApiResponse } from "./_http.js";
import { allow } from "./_http.js";

export default function handler(request: ApiRequest, response: ApiResponse) {
  allow(response, ["GET", "POST"]);
  if (request.method !== "GET" && request.method !== "POST") {
    return response.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }
  return response.status(200).json(getValidationResult());
}
