import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { createDynamicRootModule } from '../dynamic-module';
import { HealthModuleOptions, HealthProvider } from './health.types';
import { HealthController } from './health.controller';
import { HealthProviders } from './health.providers';

@Module({})
export class HealthModule extends createDynamicRootModule<HealthModuleOptions>(
  HealthProvider.MODULE_OPTIONS,
  {
    imports: [TerminusModule, HttpModule.register({})],
    providers: [
      HealthProviders.createHealthChecks(HealthProvider.CRITICAL_HEALTH_CHECKS, true),
      HealthProviders.createHealthChecks(HealthProvider.NON_CRITICAL_HEALTH_CHECKS, false),
    ],
    controllers: [HealthController],
  },
) {}
