import type { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ValidationError } from "./errorHandler";

/**
 * Validates request body against a Zod schema.
 * Returns 400 with validation error details if validation fails.
 */
export function validateBody(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      const message = parsed.error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      throw new ValidationError(message);
    }
    req.body = parsed.data;
    next();
  };
}

/**
 * Validates request query parameters against a Zod schema.
 * Returns 400 with validation error details if validation fails.
 */
export function validateQuery(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req.query);
    if (!parsed.success) {
      const message = parsed.error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      throw new ValidationError(message);
    }
    req.query = parsed.data as Record<string, unknown>;
    next();
  };
}

/**
 * Validates request parameters against a Zod schema.
 * Returns 400 with validation error details if validation fails.
 */
export function validateParams(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req.params);
    if (!parsed.success) {
      const message = parsed.error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      throw new ValidationError(message);
    }
    req.params = parsed.data as Record<string, string>;
    next();
  };
}
