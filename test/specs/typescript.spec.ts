// tslint:disable: no-default-import match-default-export-name max-classes-per-file no-parameter-properties completed-docs
import { inspect } from "util";
import ono, { Ono } from "../../esm";

class EmptyClass {}

class CustomClass {
  // tslint:disable-next-line: no-shadowed-variable
  public constructor(public code: number, public message: string) {}
}

class CustomErrorClass extends Error {
  public constructor(public isValid: boolean) {
    super(`Onoes!`);
  }
}

const err = new Error();
const errPOJO = { message: "this is an error message" };
const emptyClass = new EmptyClass();
const customClass = new CustomClass(404, "ENOTFOUND");
const customError = new CustomErrorClass(false);
const props = { id: "NOT_FOUND", statusCode: 404 };
const message = "This message has parameters: %s %s";
const param1 = "foo";
const param2 = "bar";


export function testExtendedProperties() {
  let error = ono({ foo: 123, bar: true });

  // Error props
  error.name = "string";
  error.message = "string";
  error.stack = "string";

  // OnoError props
  error.toJSON();
  error[inspect.custom]();

  // Extended props
  error.foo = 123;
  error.bar = true;
  error.toJSON().foo = 123;
  error.toJSON().bar = true;
  error[inspect.custom]().foo = 123;
  error[inspect.custom]().bar = true;
}


export function testExtendedPropertiesWithOriginalError() {
  let error = ono(customError, { foo: 123, bar: true });

  // Error props
  error.name = "string";
  error.message = "string";
  error.stack = "string";

  // customError props
  error.isValid = true;

  // OnoError props
  error.toJSON();
  error[inspect.custom]();

  // Extended props
  error.foo = 123;
  error.bar = true;
  error.toJSON().foo = 123;
  error.toJSON().bar = true;
  error[inspect.custom]().foo = 123;
  error[inspect.custom]().bar = true;
}


export function testExtendedPropertiesWithCustomOno() {
  let customOno = new Ono(CustomErrorClass);
  let error = customOno({ foo: 123, bar: true });

  // Error props
  error.name = "string";
  error.message = "string";
  error.stack = "string";

  // CustomErrorClass props
  error.isValid = true;

  // OnoError props
  error.toJSON();
  error[inspect.custom]();

  // Extended props
  error.foo = 123;
  error.bar = true;
  error.toJSON().foo = 123;
  error.toJSON().bar = true;
  error[inspect.custom]().foo = 123;
  error[inspect.custom]().bar = true;
}


export function testOnoConstructorWithoutNew() {
  let customOno = Ono(CustomErrorClass);
  let error = customOno(message, param1, param2);

  // Error props
  error.name = "string";
  error.message = "string";
  error.stack = "string";

  // OnoError props
  error.toJSON();
  error[inspect.custom]();

  // CustomErrorClass props
  error.isValid = true;
  error.toJSON().isValid = true;
  error[inspect.custom]().isValid = true;
}


export function testOnoConstructorWithNew() {
  let customOno = new Ono(CustomErrorClass);
  let error = customOno(message, param1, param2);

  // Error props
  error.name = "string";
  error.message = "string";
  error.stack = "string";

  // OnoError props
  error.toJSON();
  error[inspect.custom]();

  // CustomErrorClass props
  error.isValid = true;
  error.toJSON().isValid = true;
  error[inspect.custom]().isValid = true;
}


export function testOnoConstructorWithNonErrorClass() {
  let customOno = new Ono(CustomClass);
  let error = customOno(message, param1, param2);

  // Error props
  error.name = "string";
  error.message = "string";
  error.stack = "string";

  // OnoError props
  error.toJSON();
  error[inspect.custom]();

  // CustomClass props
  error.code = 12345;
  error.toJSON().code = 12345;
  error[inspect.custom]().code = 12345;
}


export function testOnoSignatures() {
  ono(message);
  ono(message, param1, param2);

  ono(props);
  ono(props, message);
  ono(props, message, param1, param2);

  ono(err);
  ono(errPOJO);
  ono(emptyClass);
  ono(customClass);
  ono(customError);

  ono(err, props);
  ono(errPOJO, props);
  ono(emptyClass, props);
  ono(customClass, props);
  ono(customError, props);

  ono(err, message);
  ono(errPOJO, message);
  ono(emptyClass, message);
  ono(customClass, message);
  ono(customError, message);

  ono(err, message, param1, param2);
  ono(errPOJO, message, param1, param2);
  ono(emptyClass, message, param1, param2);
  ono(customClass, message, param1, param2);
  ono(customError, message, param1, param2);

  ono(err, props, message);
  ono(errPOJO, props, message);
  ono(emptyClass, props, message);
  ono(customClass, props, message);
  ono(customError, props, message);

  ono(err, props, message, param1, param2);
  ono(errPOJO, props, message, param1, param2);
  ono(emptyClass, props, message, param1, param2);
  ono(customClass, props, message, param1, param2);
  ono(customError, props, message, param1, param2);
}


export function testErrorSignatures() {
  ono.error(message);
  ono.error(message, param1, param2);

  ono.error(props);
  ono.error(props, message);
  ono.error(props, message, param1, param2);

  ono.error(err);
  ono.error(errPOJO);
  ono.error(emptyClass);
  ono.error(customClass);
  ono.error(customError);

  ono.error(err, props);
  ono.error(errPOJO, props);
  ono.error(emptyClass, props);
  ono.error(customClass, props);
  ono.error(customError, props);

  ono.error(err, message);
  ono.error(errPOJO, message);
  ono.error(emptyClass, message);
  ono.error(customClass, message);
  ono.error(customError, message);

  ono.error(err, message, param1, param2);
  ono.error(errPOJO, message, param1, param2);
  ono.error(emptyClass, message, param1, param2);
  ono.error(customClass, message, param1, param2);
  ono.error(customError, message, param1, param2);

  ono.error(err, props, message);
  ono.error(errPOJO, props, message);
  ono.error(emptyClass, props, message);
  ono.error(customClass, props, message);
  ono.error(customError, props, message);

  ono.error(err, props, message, param1, param2);
  ono.error(errPOJO, props, message, param1, param2);
  ono.error(emptyClass, props, message, param1, param2);
  ono.error(customClass, props, message, param1, param2);
  ono.error(customError, props, message, param1, param2);
}


export function testEvalSignatures() {
  ono.eval(message);
  ono.eval(message, param1, param2);

  ono.eval(props);
  ono.eval(props, message);
  ono.eval(props, message, param1, param2);

  ono.eval(err);
  ono.eval(errPOJO);
  ono.eval(emptyClass);
  ono.eval(customClass);
  ono.eval(customError);

  ono.eval(err, props);
  ono.eval(errPOJO, props);
  ono.eval(emptyClass, props);
  ono.eval(customClass, props);
  ono.eval(customError, props);

  ono.eval(err, message);
  ono.eval(errPOJO, message);
  ono.eval(emptyClass, message);
  ono.eval(customClass, message);
  ono.eval(customError, message);

  ono.eval(err, message, param1, param2);
  ono.eval(errPOJO, message, param1, param2);
  ono.eval(emptyClass, message, param1, param2);
  ono.eval(customClass, message, param1, param2);
  ono.eval(customError, message, param1, param2);

  ono.eval(err, props, message);
  ono.eval(errPOJO, props, message);
  ono.eval(emptyClass, props, message);
  ono.eval(customClass, props, message);
  ono.eval(customError, props, message);

  ono.eval(err, props, message, param1, param2);
  ono.eval(errPOJO, props, message, param1, param2);
  ono.eval(emptyClass, props, message, param1, param2);
  ono.eval(customClass, props, message, param1, param2);
  ono.eval(customError, props, message, param1, param2);
}


export function testRangeSignatures() {
  ono.range(message);
  ono.range(message, param1, param2);

  ono.range(props);
  ono.range(props, message);
  ono.range(props, message, param1, param2);

  ono.range(err);
  ono.range(errPOJO);
  ono.range(emptyClass);
  ono.range(customClass);
  ono.range(customError);

  ono.range(err, props);
  ono.range(errPOJO, props);
  ono.range(emptyClass, props);
  ono.range(customClass, props);
  ono.range(customError, props);

  ono.range(err, message);
  ono.range(errPOJO, message);
  ono.range(emptyClass, message);
  ono.range(customClass, message);
  ono.range(customError, message);

  ono.range(err, message, param1, param2);
  ono.range(errPOJO, message, param1, param2);
  ono.range(emptyClass, message, param1, param2);
  ono.range(customClass, message, param1, param2);
  ono.range(customError, message, param1, param2);

  ono.range(err, props, message);
  ono.range(errPOJO, props, message);
  ono.range(emptyClass, props, message);
  ono.range(customClass, props, message);
  ono.range(customError, props, message);

  ono.range(err, props, message, param1, param2);
  ono.range(errPOJO, props, message, param1, param2);
  ono.range(emptyClass, props, message, param1, param2);
  ono.range(customClass, props, message, param1, param2);
  ono.range(customError, props, message, param1, param2);
}


export function testReferenceSignatures() {
  ono.reference(message);
  ono.reference(message, param1, param2);

  ono.reference(props);
  ono.reference(props, message);
  ono.reference(props, message, param1, param2);

  ono.reference(err);
  ono.reference(errPOJO);
  ono.reference(emptyClass);
  ono.reference(customClass);
  ono.reference(customError);

  ono.reference(err, props);
  ono.reference(errPOJO, props);
  ono.reference(emptyClass, props);
  ono.reference(customClass, props);
  ono.reference(customError, props);

  ono.reference(err, message);
  ono.reference(errPOJO, message);
  ono.reference(emptyClass, message);
  ono.reference(customClass, message);
  ono.reference(customError, message);

  ono.reference(err, message, param1, param2);
  ono.reference(errPOJO, message, param1, param2);
  ono.reference(emptyClass, message, param1, param2);
  ono.reference(customClass, message, param1, param2);
  ono.reference(customError, message, param1, param2);

  ono.reference(err, props, message);
  ono.reference(errPOJO, props, message);
  ono.reference(emptyClass, props, message);
  ono.reference(customClass, props, message);
  ono.reference(customError, props, message);

  ono.reference(err, props, message, param1, param2);
  ono.reference(errPOJO, props, message, param1, param2);
  ono.reference(emptyClass, props, message, param1, param2);
  ono.reference(customClass, props, message, param1, param2);
  ono.reference(customError, props, message, param1, param2);
}


export function testSyntaxSignatures() {
  ono.syntax(message);
  ono.syntax(message, param1, param2);

  ono.syntax(props);
  ono.syntax(props, message);
  ono.syntax(props, message, param1, param2);

  ono.syntax(err);
  ono.syntax(errPOJO);
  ono.syntax(emptyClass);
  ono.syntax(customClass);
  ono.syntax(customError);

  ono.syntax(err, props);
  ono.syntax(errPOJO, props);
  ono.syntax(emptyClass, props);
  ono.syntax(customClass, props);
  ono.syntax(customError, props);

  ono.syntax(err, message);
  ono.syntax(errPOJO, message);
  ono.syntax(emptyClass, message);
  ono.syntax(customClass, message);
  ono.syntax(customError, message);

  ono.syntax(err, message, param1, param2);
  ono.syntax(errPOJO, message, param1, param2);
  ono.syntax(emptyClass, message, param1, param2);
  ono.syntax(customClass, message, param1, param2);
  ono.syntax(customError, message, param1, param2);

  ono.syntax(err, props, message);
  ono.syntax(errPOJO, props, message);
  ono.syntax(emptyClass, props, message);
  ono.syntax(customClass, props, message);
  ono.syntax(customError, props, message);

  ono.syntax(err, props, message, param1, param2);
  ono.syntax(errPOJO, props, message, param1, param2);
  ono.syntax(emptyClass, props, message, param1, param2);
  ono.syntax(customClass, props, message, param1, param2);
  ono.syntax(customError, props, message, param1, param2);
}


export function testTypeSignatures() {
  ono.type(message);
  ono.type(message, param1, param2);

  ono.type(props);
  ono.type(props, message);
  ono.type(props, message, param1, param2);

  ono.type(err);
  ono.type(errPOJO);
  ono.type(emptyClass);
  ono.type(customClass);
  ono.type(customError);

  ono.type(err, props);
  ono.type(errPOJO, props);
  ono.type(emptyClass, props);
  ono.type(customClass, props);
  ono.type(customError, props);

  ono.type(err, message);
  ono.type(errPOJO, message);
  ono.type(emptyClass, message);
  ono.type(customClass, message);
  ono.type(customError, message);

  ono.type(err, message, param1, param2);
  ono.type(errPOJO, message, param1, param2);
  ono.type(emptyClass, message, param1, param2);
  ono.type(customClass, message, param1, param2);
  ono.type(customError, message, param1, param2);

  ono.type(err, props, message);
  ono.type(errPOJO, props, message);
  ono.type(emptyClass, props, message);
  ono.type(customClass, props, message);
  ono.type(customError, props, message);

  ono.type(err, props, message, param1, param2);
  ono.type(errPOJO, props, message, param1, param2);
  ono.type(emptyClass, props, message, param1, param2);
  ono.type(customClass, props, message, param1, param2);
  ono.type(customError, props, message, param1, param2);
}


export function testURISignatures() {
  ono.uri(message);
  ono.uri(message, param1, param2);

  ono.uri(props);
  ono.uri(props, message);
  ono.uri(props, message, param1, param2);

  ono.uri(err);
  ono.uri(errPOJO);
  ono.uri(emptyClass);
  ono.uri(customClass);
  ono.uri(customError);

  ono.uri(err, props);
  ono.uri(errPOJO, props);
  ono.uri(emptyClass, props);
  ono.uri(customClass, props);
  ono.uri(customError, props);

  ono.uri(err, message);
  ono.uri(errPOJO, message);
  ono.uri(emptyClass, message);
  ono.uri(customClass, message);
  ono.uri(customError, message);

  ono.uri(err, message, param1, param2);
  ono.uri(errPOJO, message, param1, param2);
  ono.uri(emptyClass, message, param1, param2);
  ono.uri(customClass, message, param1, param2);
  ono.uri(customError, message, param1, param2);

  ono.uri(err, props, message);
  ono.uri(errPOJO, props, message);
  ono.uri(emptyClass, props, message);
  ono.uri(customClass, props, message);
  ono.uri(customError, props, message);

  ono.uri(err, props, message, param1, param2);
  ono.uri(errPOJO, props, message, param1, param2);
  ono.uri(emptyClass, props, message, param1, param2);
  ono.uri(customClass, props, message, param1, param2);
  ono.uri(customError, props, message, param1, param2);
}


export function testCustomSignatures() {
  let customOno = Ono(CustomErrorClass);

  customOno(message);
  customOno(message, param1, param2);

  customOno(props);
  customOno(props, message);
  customOno(props, message, param1, param2);

  customOno(err);
  customOno(errPOJO);
  customOno(emptyClass);
  customOno(customClass);
  customOno(customError);

  customOno(err, props);
  customOno(errPOJO, props);
  customOno(emptyClass, props);
  customOno(customClass, props);
  customOno(customError, props);

  customOno(err, message);
  customOno(errPOJO, message);
  customOno(emptyClass, message);
  customOno(customClass, message);
  customOno(customError, message);

  customOno(err, message, param1, param2);
  customOno(errPOJO, message, param1, param2);
  customOno(emptyClass, message, param1, param2);
  customOno(customClass, message, param1, param2);
  customOno(customError, message, param1, param2);

  customOno(err, props, message);
  customOno(errPOJO, props, message);
  customOno(emptyClass, props, message);
  customOno(customClass, props, message);
  customOno(customError, props, message);

  customOno(err, props, message, param1, param2);
  customOno(errPOJO, props, message, param1, param2);
  customOno(emptyClass, props, message, param1, param2);
  customOno(customClass, props, message, param1, param2);
  customOno(customError, props, message, param1, param2);
}
