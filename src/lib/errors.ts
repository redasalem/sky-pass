// Small domain error types for mapping to HTTP status codes
export class DomainError extends Error {}
export class ValidationError extends DomainError {}
export class NotFoundError extends DomainError {}
export class ConflictError extends DomainError {}
export class ExternalServiceError extends DomainError {}
