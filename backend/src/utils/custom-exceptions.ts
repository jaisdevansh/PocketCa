export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;
  public readonly isOperational: boolean;
  public readonly meta: any;

  constructor(
    message: string,
    statusCode: number,
    errorCode: string,
    isOperational: boolean = true,
    meta: any = null
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = isOperational;
    this.meta = meta;
    Error.captureStackTrace(this);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation Error', meta: any = null) {
    super(message, 400, 'VALIDATION_ERROR', true, meta);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication Failed') {
    super(message, 401, 'UNAUTHORIZED', true);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Permission Denied') {
    super(message, 403, 'FORBIDDEN', true);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource Not Found') {
    super(message, 404, 'NOT_FOUND', true);
  }
}

export class BusinessLogicError extends AppError {
  constructor(message: string, errorCode: string = 'BUSINESS_ERROR') {
    super(message, 422, errorCode, true);
  }
}
