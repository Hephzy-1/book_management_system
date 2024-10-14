import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../utils/errorResponse";

interface ErrorWithCode extends Error {
  code?: number;
  value?: string;
  errors?: { [key: string]: { message: string } };
  statusCode?: number;
}

export const errorHandler = (err: ErrorWithCode, req: Request, res: Response, next: NextFunction): void => {
  let error = { ...err };
  error.message = err.message;

  if (err.name === "CastError") {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  if (err.code === 11000) {
    const message = "Duplicate key value entered";
    error = new ErrorResponse(message, 400);
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors || {}).map(val => val.message).join(", ");
    error = new ErrorResponse(message, 400);
  }

  // Set default status code and message
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server Error';

  // Send JSON response with status code and message
  res.status(statusCode).json({
    success: false,
    error: message
  });
};
