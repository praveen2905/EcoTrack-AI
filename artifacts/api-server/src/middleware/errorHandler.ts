import type { Express, Request, Response, NextFunction } from "express";
import { logger } from "../lib/logger";

/**
 * Error response structure for consistent API error handling.
 */
export interface ErrorResponse {
  error: string;
  code: string;
  statusCode: number;
  timestamp: string;
}

/**
 * Application error class with status code and error code.
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Validation error class for input validation failures.
 */
export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, "VALIDATION_ERROR", message);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Not found error class for resource not found errors.
 */
export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, "NOT_FOUND", `${resource} not found`);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Centralized error handling middleware for Express.
 * Catches all errors and returns consistent error responses.
 */
export function errorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const timestamp = new Date().toISOString();

  if (err instanceof AppError) {
    const response: ErrorResponse = {
      error: err.message,
      code: err.code,
      statusCode: err.statusCode,
      timestamp,
    };
    logger.error(
      {
        error: err.message,
        code: err.code,
        statusCode: err.statusCode,
      },
      "Application error"
    );
    res.status(err.statusCode).json(response);
    return;
  }

  // Handle unexpected errors
  logger.error(
    {
      error: err.message,
      stack: err.stack,
    },
    "Unexpected error"
  );

  const response: ErrorResponse = {
    error: "Internal server error",
    code: "INTERNAL_ERROR",
    statusCode: 500,
    timestamp,
  };

  res.status(500).json(response);
}

/**
 * Wraps an async route handler to catch errors and pass them to error middleware.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
