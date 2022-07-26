import { Global, Module } from '@nestjs/common';
import { createDynamicRootModule } from '../dynamic-module';
import { LoggerModuleOptions, LoggerProvider } from './logger.types';
import { LoggerService } from './logger.service';

@Global()
@Module({})
export class LoggerModule extends createDynamicRootModule<LoggerModuleOptions>(
  LoggerProvider.MODULE_OPTIONS,
  {
    providers: [LoggerService],
    exports: [LoggerService],
  },
) {}
