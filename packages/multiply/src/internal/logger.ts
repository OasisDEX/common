import BigNumber from 'bignumber.js';

export function logger(method: string, precision = 4) {
  return (objs: any[]): void => {
    console.log(`Method: ${method}`);
    for (const [key, val] of objs.flatMap((o) => Object.entries(o))) {
      const value = BigNumber.isBigNumber(val) ? val.toFixed(precision) : val;
      console.log(`  ${key}: ${value}`);
    }
  };
}
