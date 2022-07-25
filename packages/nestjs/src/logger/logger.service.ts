import {
  ConsoleLogger,
  Inject,
  Injectable,
  LogLevel,
  LoggerService as NestLoggerService,
  Scope,
} from '@nestjs/common';
import { GeneralLoggerOptions, HintTags, LoggerProvider } from './logger.types';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService<M = string> implements NestLoggerService {
  private readonly _console: ConsoleLogger;

  constructor(
    @Inject(LoggerProvider.GENERAL_OPTIONS)
    opts?: GeneralLoggerOptions,
  ) {
    this._console = new ConsoleLogger(opts?.context || '', { timestamp: opts?.timestamp });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public tagger = <D, T extends Record<string, any>>(_default?: Partial<D & HintTags>) => (
    tags?: Partial<T & HintTags>,
  ) => ({ ..._default, ...tags } as Partial<HintTags & D & T>);

  public setContext = (context: string): void => this._console.setContext(context);

  public log = this.define('log');
  public warn = this.define('warn');
  public error = this.define('error');
  public debug = this.define('debug');

  private define<Tags = Record<string, any> & HintTags>(level: LogLevel) {
    return (message: M, _tags?: Tags | string) => {
      // provide backwards compatibility w/ default LoggerService
      const [context, tags] =
        typeof _tags === 'string' ? [_tags, {}] : [this._console['context'], _tags || {}];
      if (process.env.LOCAL) {
        this._console[level](`${message}. ${JSON.stringify({ level, message, context, tags })}`);
        return;
      }

      // Log level does not matter because it is set in `level`
      console.log(JSON.stringify({ level, message, context, tags }));
    };
  }

  private formatLocal(tags: Record<string, any>) {
    return Object.entries(tags)
      .map(([k, v]) => `${k}: ${v}.`)
      .join(' ');
  }
}
