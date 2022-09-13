import { BigNumber } from 'bignumber.js';

export class DynamicConfigTransformer {
  static bignumber(val: string): BigNumber {
    const bn = new BigNumber(val);
    if (bn.isNaN()) {
      throw new Error(`Failed to parse bignumber value. Value: ${val}`);
    }
    return bn;
  }

  static boolean(val: string): boolean {
    const value = val.toLowerCase().trim();
    if (!['true', 'false'].includes(value)) {
      throw new Error(`Failed to parse boolean. Value: ${val}`);
    }
    return value === 'true';
  }
}
