export enum LoggerProvider {
  MODULE_OPTIONS = 'LOGGER_MODULE_OPTIONS',
}

export interface LoggerModuleOptions {
  general?: GeneralLoggerOptions;
  local?: boolean;
}

export interface GeneralLoggerOptions {
  context?: string;
  timestamp?: boolean;
}

// for intellisense
export interface HintTags {
  blockNumber?: number;
  error?: string;
  count?: number;
  description?: string;
}

export type Tagger = (tags?: Record<string, any> | HintTags) => Record<string, any>;
