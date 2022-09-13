import { DataSourceOptions } from 'typeorm';

export enum DynamicConfigProvider {
  MODULE_OPTIONS = 'DYNAMIC_CONFIG_MODULE_OPTIONS',
  KEY_TYPE = 'DYNAMIC_CONFIG_KEY_TYPE',
}

export type DynamicConfigKeyType = Record<string, any>;

export interface DynamicConfigModuleOptions<
  Key extends DynamicConfigKeyType = DynamicConfigKeyType
> {
  database: DataSourceOptions;
  keyType: Key;
}

export interface DynamicConfigOpts<T, F = T> {
  transformer?: (val: string) => T;
  fallback: F;
}
