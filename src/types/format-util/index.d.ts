declare module "format-util" {
  type MessageFormatter = (message: string, ...args: Array<unknown>) => string;
  const format: MessageFormatter;
  export = format;
}
