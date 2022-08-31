import { Controller, Get, Inject, Injectable } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HealthIndicatorFunction,
} from '@nestjs/terminus';
import { HealthProvider } from './health.types';

@Injectable()
@Controller('health')
export class HealthController {
  constructor(
    @Inject(HealthCheckService)
    private readonly _health: HealthCheckService,
    @Inject(HealthProvider.CRITICAL_HEALTH_CHECKS)
    private readonly _critical: HealthIndicatorFunction[],
    @Inject(HealthProvider.NON_CRITICAL_HEALTH_CHECKS)
    private readonly _nonCritical: HealthIndicatorFunction[],
  ) {}

  @Get('critical')
  @HealthCheck()
  async checkCritical(): Promise<HealthCheckResult> {
    return this._health.check(this._critical);
  }

  @Get('noncritical')
  @HealthCheck()
  async checkNonCritical(): Promise<HealthCheckResult> {
    return this._health.check(this._nonCritical);
  }
}
