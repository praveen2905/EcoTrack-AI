/**
 * @module lib/api
 * @description Centralised fetch utility for client-side data fetching.
 * Provides consistent error handling, response parsing, and timeout support.
 */

/** Default request timeout in milliseconds. */
const DEFAULT_TIMEOUT_MS = 10_000;

/**
 * Custom error class for API-related failures.
 * Carries the HTTP status code alongside the error message.
 */
export class ApiError extends Error {
  /**
   * @param {string} message - Human-readable error description.
   * @param {number} status - HTTP status code returned by the server.
   */
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    /** @type {number} */
    this.status = status;
  }
}

/**
 * Fetch JSON data from an internal API route with automatic timeout
 * and structured error handling.
 *
 * @param {string} url - The API endpoint URL (e.g. "/api/dashboard/summary").
 * @param {RequestInit} [options] - Optional fetch configuration (method, body, headers, etc.).
 * @returns {Promise<unknown>} The parsed JSON response body.
 * @throws {ApiError} When the server returns a non-2xx status code.
 * @throws {Error} When the request times out or a network error occurs.
 *
 * @example
 * const summary = await fetchApi("/api/dashboard/summary");
 *
 * @example
 * const result = await fetchApi("/api/assessments", {
 *   method: "POST",
 *   headers: { "Content-Type": "application/json" },
 *   body: JSON.stringify(formValues),
 * });
 */
export async function fetchApi(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new ApiError(
        errorBody.error || `Request failed with status ${response.status}`,
        response.status,
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error.name === "AbortError") {
      throw new ApiError("Request timed out", 408);
    }
    throw new ApiError("Network error occurred", 0);
  } finally {
    clearTimeout(timeoutId);
  }
}
