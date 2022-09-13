import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import NodeCache from 'node-cache';
import { isNil } from 'lodash';
import { isError, tryF } from 'ts-try';
import { LoggerService } from '../logger';
import {
  DynamicConfigKeyType,
  DynamicConfigOpts,
  DynamicConfigProvider,
} from './dynamic-config.types';
import { DynamicConfigEntry } from './dynamic-config.entity';

enum Message {
  ErrorUpdatingDynamicConfig = 'ErrorUpdatingDynamicConfig',
  UpdatedDynamicConfig = 'UpdatedDynamicConfig',
}

@Injectable()
export class DynamicConfigService<Key extends DynamicConfigKeyType> implements OnModuleInit {
  private _cache = new NodeCache();

  constructor(
    @Inject(DynamicConfigProvider.KEY_TYPE)
    private readonly _keyType: Key,
    @InjectRepository(DynamicConfigEntry)
    private readonly _repo: Repository<DynamicConfigEntry>,
    @Inject(forwardRef(() => LoggerService))
    private readonly _logger: LoggerService<Message>,
  ) {
    this._logger.setContext(this.constructor.name);
  }

  async onModuleInit(): Promise<void> {
    // keep all keys in the database to display available configuration options
    const entries = await this._repo.find();
    const keysToInsert = Object.values(this._keyType).filter(
      (key) => !entries.some((e) => e.key === key),
    );
    await this._repo.save(keysToInsert.map((key) => new DynamicConfigEntry({ key, value: null })));
    await this.update(); // cache existing values
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  public async update(): Promise<void> {
    const entries = await tryF(async () => await this._repo.find());
    if (isError(entries)) {
      this._logger.error(Message.ErrorUpdatingDynamicConfig, { error: entries.message });
      return;
    }
    // set all keys in case some were accidentally from the db
    const config = Object.values(this._keyType).reduce(
      (agg, key) => ({ ...agg, [key]: entries.find((e) => e.key === key)?.value || null }),
      {},
    );
    this._cache.mset(Object.entries(config).map(([key, val]) => ({ key, val })));
    this._logger.debug(Message.UpdatedDynamicConfig, { config });
  }

  public getValue<T>(key: Key[string], opts: DynamicConfigOpts<T>): T {
    if (!opts.transformer && typeof opts.fallback !== 'string') {
      throw new Error(
        `Transformer is required for non-string dynamic entries. Key: ${key}. Fallback: ${opts.fallback}`,
      );
    }
    const { transformer = (val) => val, fallback } = opts;
    const cached = this._cache.get<string>(key);
    const value = cached ? transformer(cached) : fallback;
    if (isNil(value)) {
      throw new Error(`Could not find a value for dynamic config entry. Key: ${key}`);
    }
    return value as T;
  }

  public getValuesWithTransformer<T>(
    transformer: DynamicConfigOpts<T>['transformer'],
    entries: { key: Key[string]; fallback: DynamicConfigOpts<T>['fallback'] }[],
  ): T[] {
    return entries.map(({ key, fallback }) => this.getValue(key, { fallback, transformer }));
  }
}
