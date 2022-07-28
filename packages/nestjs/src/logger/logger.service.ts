import {
  ConsoleLogger,
  Inject,
  Injectable,
  LogLevel,
  LoggerService as NestLoggerService,
  Scope,
} from '@nestjs/common';
import { HintTags, LoggerModuleOptions, LoggerProvider } from './logger.types';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService<M = string> implements NestLoggerService {
  private readonly _console: ConsoleLogger;
  private readonly _local?: boolean;

  constructor(
    @Inject(LoggerProvider.MODULE_OPTIONS)
    opts?: LoggerModuleOptions,
  ) {
    const { general, local } = opts || {};
    this._console = new ConsoleLogger(general?.context || '', { timestamp: general?.timestamp });
    this._local = local;
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
      const json = JSON.stringify({ level, message, context, tags });
      this._local ? this._console[level](`${message}. ${json}`) : console.log(json); // Log level does not matter because it is set in `level`
    };
  }
}
