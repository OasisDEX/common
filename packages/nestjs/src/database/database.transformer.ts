import { BigNumber } from 'bignumber.js';
import { isNil, isString } from 'lodash';
import { ValueTransformer } from 'typeorm';

/**
 * TypeORM transformers used to marshal properties of an arbitrary type
 * into the type supported by the database.
 */
export class DatabaseTransformer {
  /**
   * A transformer that converts array of strings to pg array
   */
  public static get array(): ValueTransformer {
    return {
      to: (values: string[]) => `{${values.map((v) => v.toString()).join(',')}}`,
      from: (values: string[]) => values,
    };
  }

  /**
   * A transformer that converts a Date to pg timestamp and vice versa
   */
  public static get timestamp(): ValueTransformer {
    return {
      to: (value: Date | string) =>
        (typeof value !== 'string' ? (<Date>value).toISOString() : value).replace('Z', ''),
      from: (value: Date | string) =>
        typeof value === 'string'
          ? new Date(value.indexOf('Z') !== -1 ? value : value + 'Z')
          : value,
    };
  }

  /**
   * A transformer that converts a string to a BigNumber and vice versa
   */
  public static get bignumber(): ValueTransformer {
    return {
      to: (value: BigNumber.Value): string => value?.toString(),
      from: (value: BigNumber.Value): BigNumber => this.toSafeBigNumber(value),
    };
  }

  /**
   * A transformer that converts a string[] to a BigNumber[] and vice versa
   */
  public static get bignumberArray(): ValueTransformer {
    return {
      to: (values: BigNumber.Value[]): string[] => values?.map((value) => value.toString()),
      from: (values: BigNumber.Value[]): BigNumber[] =>
        values?.map((value) => this.toSafeBigNumber(value)),
    };
  }

  /**
   * A transformer that converts a bignumber-like object to a string and
   * removes insignificant trailing zeros
   */
  public static get bignumberString(): ValueTransformer {
    return {
      to: (value: BigNumber.Value): string => value?.toString(),
      from: (value: BigNumber.Value): string => this.toSafeBigNumber(value)?.toString(),
    };
  }

  /**
   * A transformer that converts a string to a number and vice versa
   */
  public static get number(): ValueTransformer {
    return {
      to: (value: number): string => value?.toString(),
      from: (value: string): number => Number(value),
    };
  }

  /**
   * A transformer that converts a string to lowercase
   */
  public static get lowercase(): ValueTransformer {
    return {
      to: (value: unknown): unknown => (isString(value) ? value.toLowerCase() : value),
      from: (value: unknown): unknown => (isString(value) ? value.toLowerCase() : value),
    };
  }

  /**
   * A transformer that converts a string to uppercase
   */
  public static get uppercase(): ValueTransformer {
    return {
      to: (value: unknown): unknown => (isString(value) ? value.toUpperCase() : value),
      from: (value: unknown): unknown => (isString(value) ? value.toUpperCase() : value),
    };
  }

  /**
   * Convert a hex string to bytea and vice versa
   */
  public static get bytea(): ValueTransformer {
    return {
      to: (value: string) => this.toBytea(value),
      from: (value: any) => this.fromBytea(value),
    };
  }

  /**
   * Convert a hex string array to bytea array and vice versa
   */
  public static get byteaArray(): ValueTransformer {
    return {
      to: (values: string[]) => values?.map((value) => this.toBytea(value)),
      from: (values: any[]) => values?.map((value) => this.fromBytea(value)),
    };
  }

  /**
   * Convert a representation of a number to a bignumber if defined
   * @param value The value to convert
   */
  private static toSafeBigNumber(value: BigNumber.Value) {
    return isNil(value) ? value : new BigNumber(value);
  }

  /**
   * Convert a representation of hex string to pg compatible bytea
   * @param value The hex string to convert
   */
  private static toBytea(value: string) {
    return value.startsWith('0x') ? `\\${value.slice(1)}` : value;
  }

  /**
   * Convert a pg bytea to hex string
   * @param value The bytea
   */
  private static fromBytea(value: any) {
    return value ? Buffer.from(value, 'hex').toString('utf8') : value;
  }
}
