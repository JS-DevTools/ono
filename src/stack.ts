// tslint:disable: no-unbound-method
import { ErrorLike } from "./types";

const newline = /\r?\n/;
const onoCall = /\bono\b/;

/**
 * The Property Descriptor of a lazily-computed `stack` property.
 */
interface LazyStack {
  configurable: true;

  /**
   * Lazily computes the error's stack trace.
   */
  get(): string | undefined;
}

/**
 * Is the property lazily computed?
 */
export function isLazyStack(stackProp: PropertyDescriptor | undefined): stackProp is LazyStack {
  return Boolean(
    stackProp &&
    stackProp.configurable &&
    typeof stackProp.get === "function"
  );
}

/**
 * Is the stack property writable?
 */
export function isWritableStack(stackProp: PropertyDescriptor | undefined): boolean {
  return Boolean(
    // If there is no stack property, then it's writable, since assigning it will create it
    !stackProp ||
    stackProp.writable ||
    typeof stackProp.set === "function"
  );
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
export function lazyJoinStacks(lazyStack: LazyStack, newError: ErrorLike, originalError?: ErrorLike): void {
  if (originalError) {
    Object.defineProperty(newError, "stack", {
      get: () => {
        let newStack = lazyStack.get.apply(newError);
        return joinStacks({ stack: newStack }, originalError);
      },
      enumerable: false,
      configurable: true
    });
  }
  else {
    lazyPopStack(newError, lazyStack);
  }
}

/**
 * Removes Ono from the stack, so that the stack starts at the original error location
 */
function popStack(stack: string | undefined): string | undefined {
  if (stack) {
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
  }

  // If we get here, then the stack doesn't contain a call to `ono`.
  // This may be due to minification or some optimization of the JS engine.
  // So just return the stack as-is.
  return stack;
}

/**
 * Calls `popStack` lazily, when the `Error.stack` property is accessed.
 */
function lazyPopStack(error: ErrorLike, lazyStack: LazyStack): void {
  Object.defineProperty(error, "stack", {
    get: () => popStack(lazyStack.get.apply(error)),
    enumerable: false,
    configurable: true
  });
}
