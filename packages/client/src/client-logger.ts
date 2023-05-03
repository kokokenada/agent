import safeJsonStringify from 'safe-json-stringify';

interface Timer {
  operation: string;
  start: Date;
  end?: Date;
  level: number;
}

export class ClientLogger {
  public static debug(source: string, message: string, objectOut?: any) {
    if (objectOut) {
      console.log(
        `${new Date().toISOString()}: ${source}:${message}`,
        objectOut,
      ); // eslint-disable-line no-console
    } else {
      console.log(`${new Date().toISOString()}: ${source}:${message}`); // eslint-disable-line no-console
    }
  }
  public static log(source: string, message: string): void {
    console.log(`${new Date().toISOString()}: ${source}: ${message}`); // eslint-disable-line no-console
  }
  public static warning(source: string, message: string): void {
    console.warn(`Warning: ${source} ${message}`); // eslint-disable-line no-console
  }
  public static error(source: string, message: string, e?: any) {
    console.error(`${new Date().toISOString()}: ${source}:${message} `); // eslint-disable-line no-console
    if (e) {
      console.error(ClientLogger.errorToText(e)); // eslint-disable-line no-console
    }
  }
  public static timerStart(
    operation: string,
    timerOn: boolean,
    level: number = 0,
  ): Timer | undefined {
    return timerOn ? { start: new Date(), operation, level } : undefined;
  }
  public static timerEnd(timer: Timer | undefined) {
    if (timer) {
      const seconds = (new Date().getTime() - timer.start.getTime()) / 1000;
      ClientLogger.log(
        `${' '.repeat(timer.level)} timer: ${timer.operation}`,
        `Completed in ${seconds}`,
      );
    }
  }
  public static errorToText(e: any): string {
    try {
      return JSON.stringify(e, Object.getOwnPropertyNames(e));
    } catch (_ee) {
      return ClientLogger.safeStringIfy(e);
    }
  }
  public static safeStringIfy(o: any): string {
    return safeJsonStringify(o, null, 2);
  }
}
