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
}

/**
 * Creates an `Ono` instance for a specifc error type.
 */
export interface OnoConstructor {
  <T extends ErrorLike>(constructor: ErrorLikeConstructor<T>, options?: OnoOptions): Ono<T>;
  new<T extends ErrorLike>(constructor: ErrorLikeConstructor<T>, options?: OnoOptions): Ono<T>;

  /**
   * Returns an object containing all properties of the given Error object,
   * which can be used with `JSON.stringify()`.
   */
  toJSON<T extends ErrorLike>(error: T): T & ErrorPOJO;

  /**
   * Extends the given Error object with enhanced Ono functionality, such as improved support for
   * `JSON.stringify()`.
   *
   * @param error - The error object to extend. This object instance will be modified and returned.
   */
  extend<T extends ErrorLike>(error: T): T & OnoError<T>;

  /**
   * Extends the given Error object with enhanced Ono functionality, such as additional properties
   * and improved support for `JSON.stringify()`.
   *
   * @param error - The error object to extend. This object instance will be modified and returned.
   * @param props - An object whose properties will be added to the error
   */
  extend<TError extends ErrorLike, TProps extends object>(error: TError, props?: TProps): TError & TProps & OnoError<TError & TProps>;

  /**
   * Extends the given Error object with enhanced Ono functionality, such as nested stack traces
   * and improved support for `JSON.stringify()`.
   *
   * @param error - The error object to extend. This object instance will be modified and returned.
   * @param originalError - The original error. This error's stack trace will be added to the error's stack trace.
   */
  extend<TError extends ErrorLike, TOriginal extends ErrorLike>(error: TError, originalError?: TOriginal): TError & TOriginal & OnoError<TError & TOriginal>;

  /**
   * Extends the given Error object with enhanced Ono functionality, such as nested stack traces,
   * additional properties, and improved support for `JSON.stringify()`.
   *
   * @param error - The error object to extend. This object instance will be modified and returned.
   * @param originalError - The original error. This error's stack trace will be added to the error's stack trace.
   * @param props - An object whose properties will be added to the error
   */
  extend<TError extends ErrorLike, TOriginal extends ErrorLike, TProps extends object>(error: TError, originalError?: TOriginal, props?: TProps): TError & TOriginal & TProps & OnoError<TError & TOriginal & TProps>;
}

/**
 * An `Ono` is a function that creates errors of a specific type.
 */
export interface Ono<T extends ErrorLike> {
  /**
   * The type of Error that this `Ono` function produces.
   */
  readonly [Symbol.species]: ErrorLikeConstructor<T>;

  /**
   * Creates a new error with the message, stack trace, and properties of another error.
   *
   * @param error - The original error
   */
  <TError extends ErrorLike>(error: TError): T & TError & OnoError<T & TError>;

  /**
   * Creates a new error with the message, stack trace, and properties of another error,
   * as well as aditional properties.
   *
   * @param error - The original error
   * @param props - An object whose properties will be added to the returned error
   */
  <TError extends ErrorLike, TProps extends object>(error: TError, props: TProps): T & TError & TProps & OnoError<T & TError & TProps>;

  /**
   * Creates a new error with a formatted message and the stack trace and properties of another error.
   *
   * @param error - The original error
   * @param message - The new error message, possibly including argument placeholders
   * @param params - Optional arguments to replace the corresponding placeholders in the message
   */
  <TError extends ErrorLike>(error: TError, message: string, ...params: unknown[]): T & TError & OnoError<T & TError>;

  /**
   * Creates a new error with a formatted message and the stack trace and properties of another error,
   * as well as additional properties.
   *
   * @param error - The original error
   * @param props - An object whose properties will be added to the returned error
   * @param message - The new error message, possibly including argument placeholders
   * @param params - Optional arguments to replace the corresponding placeholders in the message
   */
  <TError extends ErrorLike, TProps extends object>(error: TError, props: TProps, message: string, ...params: unknown[]): T & TError & TProps & OnoError<T & TError & TProps>;

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
  <TProps extends object>(props: TProps): T & TProps & OnoError<T & TProps>;

  /**
   * Creates an error with a formatted message and additional properties.
   *
   * @param props - An object whose properties will be added to the returned error
   * @param message - The new error message, possibly including argument placeholders
   * @param params - Optional arguments to replace the corresponding placeholders in the message
   */
  <TProps extends object>(props: TProps, message: string, ...params: unknown[]): T & TProps & OnoError<T & TProps>;
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

/**
 * Options that determine the behavior of an `Ono` instance.
 */
export interface OnoOptions {
  /**
   * When `Ono` is used to wrap an error, this setting determines whether the inner error's message
   * is appended to the new error message.
   *
   * Defaults to `true`.
   */
  concatMessages?: boolean;

  /**
   * A function that replaces placeholders like "%s" or "%d" in error messages with values.
   * If set to `false`, then error messages will be treated as literals and no placeholder replacement will occur.
   *
   * Defaults to `utils.inspect()` in Node.js.  Defaults to `Array.join()` in browsers.
   */
  format?: MessageFormatter | false;
}

/**
 * A function that accepts a message template and arguments to replace template parameters.
 *
 * @example
 *  format("Hello, %s! You have %d unread messages.", "John", 5);
 */
export type MessageFormatter = (message: string, ...args: unknown[]) => string;
