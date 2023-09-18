/* eslint-disable func-style */
import { Column } from 'typeorm';
import { ColumnCommonOptions } from 'typeorm/decorator/options/ColumnCommonOptions';
import { ColumnNumericOptions } from 'typeorm/decorator/options/ColumnNumericOptions';
import { ColumnWithLengthOptions } from 'typeorm/decorator/options/ColumnWithLengthOptions';
import { DatabaseTransformer } from './database.transformer';

export const Address = (
  options?: ColumnCommonOptions & ColumnWithLengthOptions,
): PropertyDecorator =>
  Column('char', {
    length: 42,
    transformer: DatabaseTransformer.lowercase,
    ...options,
  });

export const TransactionHash = (
  options?: ColumnCommonOptions & ColumnWithLengthOptions,
): PropertyDecorator =>
  Column('char', { length: 66, transformer: DatabaseTransformer.lowercase, ...options });

export const BigNumberIntColumn = (
  options?: ColumnCommonOptions & ColumnNumericOptions,
): PropertyDecorator =>
  Column('decimal', {
    transformer: DatabaseTransformer.bignumber,
    precision: 38,
    scale: 0,
    ...options,
  });

export const BigNumberDecimalColumn = (
  options?: ColumnCommonOptions & ColumnNumericOptions,
): PropertyDecorator =>
  Column('decimal', { transformer: DatabaseTransformer.bignumber, ...options });
