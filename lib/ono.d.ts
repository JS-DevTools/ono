declare module 'ono' {
  var ono: {
    (error: Error): Error;
    (error: Error, props: object): Error;
    (message: string, ...params: any[]): Error;
    (error: Error, message: string, ...params: any[]): Error;
    (error: Error, props: object, message: string, ...params: any[]): Error;

    error(error: Error): Error;
    error(error: Error, props: object): Error;
    error(message: string, ...params: any[]): Error;
    error(error: Error, message: string, ...params: any[]): Error;
    error(error: Error, props: object, message: string, ...params: any[]): Error;

    eval(error: Error): EvalError;
    eval(error: Error, props: object): EvalError;
    eval(message: string, ...params: any[]): EvalError;
    eval(error: Error, message: string, ...params: any[]): EvalError;
    eval(error: Error, props: object, message: string, ...params: any[]): EvalError;

    range(error: Error): RangeError;
    range(error: Error, props: object): RangeError;
    range(message: string, ...params: any[]): RangeError;
    range(error: Error, message: string, ...params: any[]): RangeError;
    range(error: Error, props: object, message: string, ...params: any[]): RangeError;

    reference(error: Error): ReferenceError;
    reference(error: Error, props: object): ReferenceError;
    reference(message: string, ...params: any[]): ReferenceError;
    reference(error: Error, message: string, ...params: any[]): ReferenceError;
    reference(error: Error, props: object, message: string, ...params: any[]): ReferenceError;

    syntax(error: Error): SyntaxError;
    syntax(error: Error, props: object): SyntaxError;
    syntax(message: string, ...params: any[]): SyntaxError;
    syntax(error: Error, message: string, ...params: any[]): SyntaxError;
    syntax(error: Error, props: object, message: string, ...params: any[]): SyntaxError;

    type(error: Error): TypeError;
    type(error: Error, props: object): TypeError;
    type(message: string, ...params: any[]): TypeError;
    type(error: Error, message: string, ...params: any[]): TypeError;
    type(error: Error, props: object, message: string, ...params: any[]): TypeError;

    uri(error: Error): URIError;
    uri(error: Error, props: object): URIError;
    uri(message: string, ...params: any[]): URIError;
    uri(error: Error, message: string, ...params: any[]): URIError;
    uri(error: Error, props: object, message: string, ...params: any[]): URIError;

    formatter(message: string, ...params: any[]): string;
  }

  export default ono;
}
