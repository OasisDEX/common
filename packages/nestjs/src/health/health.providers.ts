import { Provider } from '@nestjs/common';
import {
  HealthCheckService,
  HealthIndicatorFunction,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { HealthCheckKey, HealthModuleOptions, HealthProvider } from './health.types';

export class HealthProviders {
  public static createHealthChecks(
    token: string,
    critical: boolean,
  ): Provider<HealthIndicatorFunction[]> {
    return {
      provide: token,
      useFactory: (
        opts: HealthModuleOptions,
        db: TypeOrmHealthIndicator,
        http: HttpHealthIndicator,
      ) => {
        const defaultTimeout = 1500;
        const entries = Object.entries(opts).filter(([, config]) => !!config.critical === critical);
        return entries.map(([key, config]) => {
          if (key === HealthCheckKey.DATABASE) {
            return () => db.pingCheck(key, { timeout: defaultTimeout });
          }
          if (config.url) {
            return () => http.pingCheck(key, config.url!, { timeout: defaultTimeout });
          }

          throw new Error(
            `Unsupported health check. Key: ${key}. Config: ${JSON.stringify(config)}`,
          );
        });
      },
      inject: [
        HealthProvider.MODULE_OPTIONS,
        TypeOrmHealthIndicator,
        HttpHealthIndicator,
        HealthCheckService,
      ],
    };
  }
}
