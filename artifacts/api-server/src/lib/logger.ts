import pino from "pino";

/**
 * Determines if the application is running in production mode.
 * Based on NODE_ENV environment variable.
 */
const isProduction = process.env.NODE_ENV === "production";

/**
 * Logger instance configured with pino.
 *
 * **Features:**
 * - Log level configurable via LOG_LEVEL env var (default: "info")
 * - Production: JSON format for log aggregation services
 * - Development: Pretty-printed output with colors
 * - Sensitive data redacted: authorization headers, cookies
 *
 * **Usage:**
 * ```ts
 * logger.info({ userId: 123 }, "User login successful");
 * logger.error({ err }, "Database error");
 * logger.warn("Deprecated API endpoint used");
 * ```
 */
export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  redact: [
    "req.headers.authorization",
    "req.headers.cookie",
    "res.headers['set-cookie']",
  ],
  ...(isProduction
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: { colorize: true },
        },
      }),
});
