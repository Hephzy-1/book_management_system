export class ErrorResponse extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    // Ensure the name of this error is preserved
    this.name = this.constructor.name;
    // Capture the stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}
