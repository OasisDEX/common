export enum HealthProvider {
  MODULE_OPTIONS = 'HEALTH_MODULE_OPTIONS',
  CRITICAL_HEALTH_CHECKS = 'HEALTH_CRITICAL_HEALTH_CHECKS',
  NON_CRITICAL_HEALTH_CHECKS = 'HEALTH_NON_CRITICAL_HEALTH_CHECKS',
}

export enum HealthCheckKey {
  DATABASE = 'database',
}

export interface BaseHealthCheckConfig {
  critical?: boolean;
  url?: string;
}

export type HealthModuleOptions<
  T extends string = string,
  C extends BaseHealthCheckConfig = BaseHealthCheckConfig
> = Record<T, C>;
