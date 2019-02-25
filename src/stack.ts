// tslint:disable: no-unbound-method
import { ErrorLike } from "./types";

const newline = /\r?\n/;
const onoCall = /\bono\b/;

/**
 * Does a one-time determination of whether this JavaScript engine
 * supports lazy `Error.stack` properties.
 */
export const supportsLazyStack = Boolean(
  // ES5 property descriptors must be supported
  Object.getOwnPropertyDescriptor && Object.defineProperty &&

  // Chrome on Android doesn't support lazy stacks :(
  (typeof navigator === "undefined" || !/Android/.test(navigator.userAgent))
);

/**
 * Does this error have a lazy stack property?
 */
export function hasLazyStack(error: ErrorLike): boolean {
  if (!supportsLazyStack) {
    return false;
  }

  let descriptor = Object.getOwnPropertyDescriptor(error, "stack");
  if (!descriptor) {
    return false;
  }

  return typeof descriptor.get === "function";
}

/**
 * Appends the original `Error.stack` property to the new Error's stack.
 */
export function joinStacks(newError: ErrorLike, originalError?: ErrorLike): string | undefined {
  let newStack = popStack(newError.stack);
  let originalStack = originalError ? originalError.stack : undefined;

  if (newStack && originalStack) {
    return newStack + "\n\n" + originalStack;
  }
  else {
   return newStack || originalStack;
  }
}

/**
 * Calls `joinStacks` lazily, when the `Error.stack` property is accessed.
 */
export function lazyJoinStacks(newError: ErrorLike, originalError?: ErrorLike): void {
  let descriptor = Object.getOwnPropertyDescriptor(newError, "stack");

  if (originalError && descriptor && typeof descriptor.get === "function") {
    Object.defineProperty(newError, "stack", {
      get: () => {
        let newStack = descriptor!.get!.apply(newError) as string;
        return joinStacks({ stack: newStack }, originalError);
      },
      enumerable: false,
      configurable: true
    });
  }
  else {
    lazyPopStack(newError);
  }
}

/**
 * Removes Ono from the stack, so that the stack starts at the original error location
 */
function popStack(stack?: string): string | undefined {
  if (stack === undefined) {
    return undefined;
  }

  let lines = stack.split(newline);

  if (lines.length < 2) {
    // The stack only has one line, so there's nothing we can remove
    return stack;
  }

  // Find the `ono` call in the stack, and remove it
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (onoCall.test(line)) {
      lines.splice(i, 1);
      return lines.join("\n");
    }
  }

  // If we get here, then the stack doesn't contain a call to `ono`.
  // This may be due to minification or some optimization of the JS engine.
  // So just return the stack as-is.
  return stack;
}

/**
 * Calls `popStack` lazily, when the `Error.stack` property is accessed.
 */
function lazyPopStack(error: ErrorLike): void {
  let descriptor = Object.getOwnPropertyDescriptor(error, "stack");

  if (descriptor && typeof descriptor.get === "function") {
    Object.defineProperty(error, "stack", {
      get: () => popStack(descriptor!.get!.apply(error) as string),
      enumerable: false,
      configurable: true
    });
  }
}
