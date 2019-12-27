"use strict";

const { Ono } = require("../../");
const { expect } = require("chai");
const { onoes, compareStacks, createFakeStack, host } = require("../utils");

for (let { name, ono, errorTypeName } of onoes) {
  describe(`${name} stack`, () => {

    it("should include the stack of the original error", () => {
      function makeOriginalError () {
        return new ReferenceError("This is the original error");
      }

      function makeOuterError (originalError) {
        return ono(originalError, "Oops, an error happened.");
      }

      let originalError = makeOriginalError();
      let outerError = makeOuterError(originalError);

      expect(outerError.stack).to.contain(originalError.stack);

      expect(outerError.stack).to.satisfy(compareStacks(
        ["makeOuterError"],
        ["makeOriginalError"]
      ));

      if (host.error.stack.includesErrorMessage) {
        expect(outerError.stack).to.match(new RegExp(`${errorTypeName}: Oops, an error happened`));
        expect(outerError.stack).to.match(/ReferenceError: This is the original error/);
      }
    });

    it("should only have the new error's stack if the original error had none", () => {
      function makeOriginalError () {
        let originalError = new ReferenceError("This is the original error");
        originalError.stack = undefined;
        return originalError;
      }

      function makeOuterError (originalError) {
        return ono(originalError, "Oops, an error happened.");
      }

      let originalError = makeOriginalError();
      let outerError = makeOuterError(originalError);

      expect(outerError.stack).not.to.contain("makeOriginalError");

      expect(outerError.stack).to.satisfy(compareStacks(
        ["makeOuterError"],
      ));

      if (host.error.stack.includesErrorMessage) {
        expect(outerError.stack).to.match(new RegExp(`${errorTypeName}: Oops, an error happened. \nThis is the original error\n`));
        expect(outerError.stack).not.to.match(/ReferenceError: This is the original error/);
      }
    });
  });
}

describe("Lazy stacks", () => {
  it("should only have the original error's stack if the new error had none", () => {
    function makeOriginalError () {
      return new ReferenceError("This is the original error");
    }

    function makeOuterError (originalError) {
      class MyCustomError extends Error {
        constructor (message) {
          super(message);
          this.stack = undefined;
        }
      }

      let myCustomOno = new Ono(MyCustomError);
      return myCustomOno(originalError, "Oops, an error happened.");
    }

    let originalError = makeOriginalError();
    let outerError = makeOuterError(originalError);

    expect(outerError.stack).to.equal(originalError.stack);
    expect(outerError.stack).not.to.contain("makeOuterError");

    expect(outerError.stack).to.satisfy(compareStacks(
      ["makeOriginalError"],
    ));

    if (host.error.stack.includesErrorMessage) {
      expect(outerError.stack).to.match(/^ReferenceError: This is the original error/);
      expect(outerError.stack).not.to.match(/Oops, an error happened/);
    }
  });

  it("should not pop Ono off the error's stack if it's the only line", () => {
    class MyCustomError extends Error {
      constructor (message) {
        super(message);
        this.stack = createFakeStack(
          { fn: "ono", file: "ono.js", line: 1, col: 1 }
        );
      }
    }

    let myCustomOno = new Ono(MyCustomError);
    let error = myCustomOno();

    if (host.error.stack.includesErrorMessage) {
      expect(error.stack).to.match(/^Error: This is a fake error\n/);
    }
    else {
      expect(error.stack).to.satisfy(compareStacks(
        ["ono"],
      ));
    }
  });

  it("should lazily pop Ono off the new error's stack", () => {
    function makeError () {
      class MyCustomError extends Error {
        constructor (message) {
          super(message);

          let stack = this.stack;
          delete this.stack;

          this.stackHasBeenRead = false;

          Object.defineProperty(this, "stack", {
            configurable: true,
            get () {
              this.stackHasBeenRead = true;
              return stack;
            },
          });
        }
      }

      let myCustomOno = new Ono(MyCustomError);
      return myCustomOno("Oops, an error happened.");
    }

    let error = makeError();

    // The stack property has not been read yet
    expect(error.stackHasBeenRead).to.equal(false);

    // Read the stack property
    expect(error.stack).to.satisfy(compareStacks(
      ["makeError"],
    ));

    // It has now been read
    expect(error.stackHasBeenRead).to.equal(true);

    if (host.error.stack.includesErrorMessage) {
      expect(error.stack).to.match(/Error: Oops, an error happened/);
    }
  });

  it("should lazily build the new error's stack", () => {
    function makeOriginalError () {
      return new ReferenceError("This is the original error");
    }

    function makeOuterError (originalError) {
      class MyCustomError extends Error {
        constructor (message) {
          super(message);

          let stack = this.stack;
          delete this.stack;

          this.stackHasBeenRead = false;

          Object.defineProperty(this, "stack", {
            configurable: true,
            get () {
              this.stackHasBeenRead = true;
              return stack;
            },
          });
        }
      }

      let myCustomOno = new Ono(MyCustomError);
      return myCustomOno(originalError, "Oops, an error happened.");
    }

    let originalError = makeOriginalError();
    let outerError = makeOuterError(originalError);

    // The stack property has not been read yet
    expect(outerError.stackHasBeenRead).to.equal(false);

    // Read the stack property
    expect(outerError.stack).to.contain(originalError.stack);

    // It has now been read
    expect(outerError.stackHasBeenRead).to.equal(true);

    expect(outerError.stack).to.satisfy(compareStacks(
      ["makeOuterError"],
      ["makeOriginalError"]
    ));

    if (host.error.stack.includesErrorMessage) {
      expect(outerError.stack).to.match(/Error: Oops, an error happened/);
      expect(outerError.stack).to.match(/ReferenceError: This is the original error/);
    }
  });

  it("should lazily build the new error's stack and lazily read the original error's stack", () => {
    class MyCustomError extends Error {
      constructor (message) {
        super(message);

        let stack = this.stack;
        delete this.stack;

        this.stackHasBeenRead = false;

        Object.defineProperty(this, "stack", {
          configurable: true,
          get () {
            this.stackHasBeenRead = true;
            return stack;
          },
        });
      }
    }


    function makeOriginalError () {
      return new MyCustomError("This is the original error");
    }

    function makeOuterError (originalError) {
      let myCustomOno = new Ono(MyCustomError);
      return myCustomOno(originalError, "Oops, an error happened.");
    }

    let originalError = makeOriginalError();
    let outerError = makeOuterError(originalError);

    // The stack properties have not been read yet
    expect(originalError.stackHasBeenRead).to.equal(false);
    expect(outerError.stackHasBeenRead).to.equal(false);

    // Read the stack property
    expect(outerError.stack).to.contain(originalError.stack);

    // The stack properties have now been read
    expect(originalError.stackHasBeenRead).to.equal(true);
    expect(outerError.stackHasBeenRead).to.equal(true);

    expect(outerError.stack).to.satisfy(compareStacks(
      ["makeOuterError"],
      ["makeOriginalError"]
    ));

    if (host.error.stack.includesErrorMessage) {
      expect(outerError.stack).to.match(/Error: Oops, an error happened/);
      expect(outerError.stack).to.match(/Error: This is the original error/);
    }
  });

  it("should read lazy stacks immediately if not configurable", () => {
    function makeOriginalError () {
      return new ReferenceError("This is the original error");
    }

    function makeOuterError (originalError) {
      class MyCustomError extends Error {
        constructor (message) {
          super(message);

          let stack = this.stack;
          delete this.stack;

          this.stackHasBeenRead = false;
          this.stackHasBeenWritten = false;

          Object.defineProperty(this, "stack", {
            configurable: false,                        // <-- not configurable
            get () {
              this.stackHasBeenRead = true;
              return stack;
            },
            set (value) {
              this.stackHasBeenWritten = true;
              stack = value;
            }
          });
        }
      }

      let myCustomOno = new Ono(MyCustomError);
      return myCustomOno(originalError, "Oops, an error happened.");
    }

    let originalError = makeOriginalError();
    let outerError = makeOuterError(originalError);

    // The stack property has already been read and written
    expect(outerError.stackHasBeenRead).to.equal(true);
    expect(outerError.stackHasBeenWritten).to.equal(true);

    expect(outerError.stack).to.contain(originalError.stack);

    expect(outerError.stack).to.satisfy(compareStacks(
      ["makeOuterError"],
      ["makeOriginalError"]
    ));

    if (host.error.stack.includesErrorMessage) {
      expect(outerError.stack).to.match(/Error: Oops, an error happened/);
      expect(outerError.stack).to.match(/ReferenceError: This is the original error/);
    }
  });

  it("should not concatenate stacks if not configurable or writable", () => {
    function makeOriginalError () {
      return new ReferenceError("This is the original error");
    }

    function makeOuterError (originalError) {
      class MyCustomError extends Error {
        constructor (message) {
          super(message);

          let stack = this.stack;
          delete this.stack;

          this.stackHasBeenRead = false;

          Object.defineProperty(this, "stack", {
            configurable: false,                        // <-- not configurable
            get () {
              this.stackHasBeenRead = true;
              return stack;
            },
          });
        }
      }

      let myCustomOno = new Ono(MyCustomError);
      return myCustomOno(originalError, "Oops, an error happened.");
    }

    let originalError = makeOriginalError();
    let outerError = makeOuterError(originalError);

    // The stack property has not been read yet
    expect(outerError.stackHasBeenRead).to.equal(false);

    // Read the stack property
    expect(outerError.stack).not.to.contain(originalError.stack);

    // It has now been read
    expect(outerError.stackHasBeenRead).to.equal(true);

    // Ono doesn't get popped off the stack because it's not writable
    expect(outerError.stack).to.satisfy(compareStacks(
      ["ono", "makeOuterError"],
    ));

    if (host.error.stack.includesErrorMessage) {
      expect(outerError.stack).to.match(/Error: Oops, an error happened/);
      expect(outerError.stack).not.to.match(/ReferenceError: This is the original error/);
    }
  });

});
