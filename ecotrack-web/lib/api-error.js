import { NextResponse } from "next/server";

/**
 * Standardized API error handler.
 * Logs the error and returns a formatted JSON response.
 * @param {Error} error - The caught error object
 * @param {string} defaultMessage - The message to display if it's an unhandled server error
 * @param {number} [status=500] - The HTTP status code
 * @returns {NextResponse} Formatted JSON response with error details
 */
export function handleApiError(error, defaultMessage = "An internal server error occurred", status = 500) {
  console.error(`[API Error]: ${defaultMessage}`, error);
  return NextResponse.json(
    {
      error: defaultMessage,
      ...(process.env.NODE_ENV === "development" && { details: error.message })
    },
    { status }
  );
}
