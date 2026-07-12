export class BaseError extends Error {
  public readonly code: number;
  public readonly type: string;
  public readonly details?: Record<string, any>;

  constructor(message: string, code: number, type: string, details?: Record<string, any>) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.type = type;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends BaseError {
  constructor(message = 'Bad Request', details?: Record<string, any>) {
    super(message, 400, 'BAD_REQUEST', details);
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends BaseError {
  constructor(message = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
  }
}

export class NotFoundError extends BaseError {
  constructor(message = 'Not Found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ConflictError extends BaseError {
  constructor(message = 'Conflict') {
    super(message, 409, 'CONFLICT');
  }
}
