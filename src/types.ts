import { inspect } from "util";

/**
 * The default export of the "ono" module.
 */
export interface OnoSingleton extends Ono<Error> {
  error: Ono<Error>;
  eval: Ono<EvalError>;
  range: Ono<RangeError>;
  reference: Ono<ReferenceError>;
  syntax: Ono<SyntaxError>;
  type: Ono<TypeError>;
  uri: Ono<URIError>;
  formatter: MessageFormatter;
}

/**
 * An `Ono` is a function that creates errors of a specific type.
 */
export interface Ono<T extends ErrorLike> {
  /**
   * Creates a new error with the message, stack trace, and properties of another error.
   *
   * @param error - The original error
   */
  <E extends ErrorLike>(error: E): T & E & OnoError<T & E>;

  /**
   * Creates a new error with the message, stack trace, and properties of another error,
   * as well as aditional properties.
   *
   * @param error - The original error
   * @param props - An object whose properties will be added to the returned error
   */
  <E extends ErrorLike, P extends object>(error: E, props: P): T & E & P & OnoError<T & E & P>;

  /**
   * Creates a new error with a formatted message and the stack trace and properties of another error.
   *
   * @param error - The original error
   * @param message - The new error message, possibly including argument placeholders
   * @param params - Optional arguments to replace the corresponding placeholders in the message
   */
  <E extends ErrorLike>(error: E, message: string, ...params: unknown[]): T & E & OnoError<T & E>;

  /**
   * Creates a new error with a formatted message and the stack trace and properties of another error,
   * as well as additional properties.
   *
   * @param error - The original error
   * @param props - An object whose properties will be added to the returned error
   * @param message - The new error message, possibly including argument placeholders
   * @param params - Optional arguments to replace the corresponding placeholders in the message
   */
  <E extends ErrorLike, P extends object>(error: E, props: P, message: string, ...params: unknown[])
  : T & E & P & OnoError<T & E & P>;

  /**
   * Creates an error with a formatted message.
   *
   * @param message - The new error message, possibly including argument placeholders
   * @param params - Optional arguments to replace the corresponding placeholders in the message
   */
  (message: string, ...params: unknown[]): T & OnoError<T>;

  /**
   * Creates an error with additional properties.
   *
   * @param props - An object whose properties will be added to the returned error
   */
  <P extends object>(props: P): T & P & OnoError<T & P>;

  /**
   * Creates an error with a formatted message and additional properties.
   *
   * @param props - An object whose properties will be added to the returned error
   * @param message - The new error message, possibly including argument placeholders
   * @param params - Optional arguments to replace the corresponding placeholders in the message
   */
  <P extends object>(props: P, message: string, ...params: unknown[]): T & P & OnoError<T & P>;
}

/**
 * All error objects returned by Ono have these properties.
 */
export interface OnoError<T> extends ErrorPOJO {
  /**
   * Returns a JSON representation of the error, including all built-in error properties,
   * as well as properties that were dynamically added.
   */
  toJSON(): ErrorPOJO & T;

  /**
   * Returns a representation of the error for Node's `util.inspect()` method.
   *
   * @see https://nodejs.org/api/util.html#util_custom_inspection_functions_on_objects
   */
  [inspect.custom](): ErrorPOJO & T;
}

/**
 * An error object that doesn't inherit from the `Error` class, such as `DOMError`, `DOMException`,
 * and some third-party error types.
 */
export interface ErrorPOJO {
  message?: string;
  stack?: string;
  name?: string;
}

/**
 * Any object that "looks like" an `Error` object.
 */
export type ErrorLike = Error | ErrorPOJO;

/**
 * A function that accepts a message template and arguments to replace template parameters.
 *
 * @example
 *  format("Hello, %s! You have %d unread messages.", "John", 5);
 */
export type MessageFormatter = (message: string, ...args: unknown[]) => string;

/**
 * Creates an `Ono` instance for a specifc error type.
 */
export interface OnoConstructor {
  new<T extends ErrorLike>(constructor: ErrorLikeConstructor<T>): Ono<T>;
  <T extends ErrorLike>(constructor: ErrorLikeConstructor<T>): Ono<T>;

  /**
   * Returns an object containing all properties of the given Error object,
   * which can be used with `JSON.stringify()`.
   */
  toJSON<E extends ErrorLike>(error: E): ErrorPOJO & E;
}

/**
 * A constructor for `ErrorLike` objects.
 */
export type ErrorLikeConstructor<T extends ErrorLike> =
  ErrorLikeConstructorFunction<T> | ErrorLikeConstructorClass<T>;


/**
 * A constructor function for `ErrorLike` objects.
 * Constructor functions can be called without the `new` keyword.
 *
 * @example
 *  throw TypeError();
 */
export interface ErrorLikeConstructorFunction<T extends ErrorLike> {
  readonly prototype: T;
  (): T;
}

/**
 * A constructor class for `ErrorLike` objects.
 * Constructor classes must be called with the `new` keyword.
 *
 * @example
 *  throw new TypeError();
 */
export interface ErrorLikeConstructorClass<T extends ErrorLike> {
  readonly prototype: T;
  new(...args: unknown[]): T;
}
