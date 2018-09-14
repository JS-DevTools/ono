import ono = require('../../');

const err = new Error();
const errPOJO = { message: 'this is an error message' };
const props = { id: 'NOT_FOUND', statusCode: 404 };
const message = 'This message has parameters: %s %s';
const param1 = 'foo';
const param2 = 'bar';


ono(err);
ono(errPOJO);
ono(err, props);
ono(errPOJO, props);
ono(err, message);
ono(errPOJO, message);
ono(err, message, param1, param2);
ono(errPOJO, message, param1, param2);
ono(err, props, message);
ono(errPOJO, props, message);
ono(err, props, message, param1, param2);
ono(errPOJO, props, message, param1, param2);
ono(message);
ono(message, param1, param2);
ono(props);
ono(props, message);
ono(props, message, param1, param2);


ono.error(err);
ono.error(errPOJO);
ono.error(err, props);
ono.error(errPOJO, props);
ono.error(err, message);
ono.error(errPOJO, message);
ono.error(err, message, param1, param2);
ono.error(errPOJO, message, param1, param2);
ono.error(err, props, message);
ono.error(errPOJO, props, message);
ono.error(err, props, message, param1, param2);
ono.error(errPOJO, props, message, param1, param2);
ono.error(message);
ono.error(message, param1, param2);
ono.error(props);
ono.error(props, message);
ono.error(props, message, param1, param2);


ono.eval(err);
ono.eval(errPOJO);
ono.eval(err, props);
ono.eval(errPOJO, props);
ono.eval(err, message);
ono.eval(errPOJO, message);
ono.eval(err, message, param1, param2);
ono.eval(errPOJO, message, param1, param2);
ono.eval(err, props, message);
ono.eval(errPOJO, props, message);
ono.eval(err, props, message, param1, param2);
ono.eval(errPOJO, props, message, param1, param2);
ono.eval(message);
ono.eval(message, param1, param2);
ono.eval(props);
ono.eval(props, message);
ono.eval(props, message, param1, param2);


ono.range(err);
ono.range(errPOJO);
ono.range(err, props);
ono.range(errPOJO, props);
ono.range(err, message);
ono.range(errPOJO, message);
ono.range(err, message, param1, param2);
ono.range(errPOJO, message, param1, param2);
ono.range(err, props, message);
ono.range(errPOJO, props, message);
ono.range(err, props, message, param1, param2);
ono.range(errPOJO, props, message, param1, param2);
ono.range(message);
ono.range(message, param1, param2);
ono.range(props);
ono.range(props, message);
ono.range(props, message, param1, param2);


ono.reference(err);
ono.reference(errPOJO);
ono.reference(err, props);
ono.reference(errPOJO, props);
ono.reference(err, message);
ono.reference(errPOJO, message);
ono.reference(err, message, param1, param2);
ono.reference(errPOJO, message, param1, param2);
ono.reference(err, props, message);
ono.reference(errPOJO, props, message);
ono.reference(err, props, message, param1, param2);
ono.reference(errPOJO, props, message, param1, param2);
ono.reference(message);
ono.reference(message, param1, param2);
ono.reference(props);
ono.reference(props, message);
ono.reference(props, message, param1, param2);


ono.syntax(err);
ono.syntax(errPOJO);
ono.syntax(err, props);
ono.syntax(errPOJO, props);
ono.syntax(err, message);
ono.syntax(errPOJO, message);
ono.syntax(err, message, param1, param2);
ono.syntax(errPOJO, message, param1, param2);
ono.syntax(err, props, message);
ono.syntax(errPOJO, props, message);
ono.syntax(err, props, message, param1, param2);
ono.syntax(errPOJO, props, message, param1, param2);
ono.syntax(message);
ono.syntax(message, param1, param2);
ono.syntax(props);
ono.syntax(props, message);
ono.syntax(props, message, param1, param2);


ono.type(err);
ono.type(errPOJO);
ono.type(err, props);
ono.type(errPOJO, props);
ono.type(err, message);
ono.type(errPOJO, message);
ono.type(err, message, param1, param2);
ono.type(errPOJO, message, param1, param2);
ono.type(err, props, message);
ono.type(errPOJO, props, message);
ono.type(err, props, message, param1, param2);
ono.type(errPOJO, props, message, param1, param2);
ono.type(message);
ono.type(message, param1, param2);
ono.type(props);
ono.type(props, message);
ono.type(props, message, param1, param2);


ono.uri(err);
ono.uri(errPOJO);
ono.uri(err, props);
ono.uri(errPOJO, props);
ono.uri(err, message);
ono.uri(errPOJO, message);
ono.uri(err, message, param1, param2);
ono.uri(errPOJO, message, param1, param2);
ono.uri(err, props, message);
ono.uri(errPOJO, props, message);
ono.uri(err, props, message, param1, param2);
ono.uri(errPOJO, props, message, param1, param2);
ono.uri(message);
ono.uri(message, param1, param2);
ono.uri(props);
ono.uri(props, message);
ono.uri(props, message, param1, param2);
