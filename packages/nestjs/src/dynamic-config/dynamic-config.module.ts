import { Global, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicConfigEntry } from './dynamic-config.entity';
import { createDynamicRootModule } from '../dynamic-module';
import { DynamicConfigService } from './dynamic-config.service';
import { DynamicConfigModuleOptions, DynamicConfigProvider } from './dynamic-config.types';

@Global()
@Module({})
export class DynamicConfigModule extends createDynamicRootModule<DynamicConfigModuleOptions>(
  DynamicConfigProvider.MODULE_OPTIONS,
  {
    imports: [
      ScheduleModule.forRoot(),
      TypeOrmModule.forRootAsync({
        useFactory: ({ database }: DynamicConfigModuleOptions) => database,
        inject: [DynamicConfigProvider.MODULE_OPTIONS],
      }),
      TypeOrmModule.forFeature([DynamicConfigEntry]),
    ],
    providers: [
      {
        provide: DynamicConfigProvider.KEY_TYPE,
        useFactory: ({ keyType }: DynamicConfigModuleOptions) => keyType,
        inject: [DynamicConfigProvider.MODULE_OPTIONS],
      },
      DynamicConfigService,
    ],
    exports: [DynamicConfigProvider.MODULE_OPTIONS, DynamicConfigService],
  },
) {}
