import { expect } from 'chai';
require('mocha');
import * as _chai from 'chai';
import BigNumber from 'bignumber.js';
import { getCloseToDaiParams } from './../src/index';
import { MarketParams, VaultInfo } from '../src/internal/types';
import { DEBT_OFFSET_MULTIPLIER } from '../src/calculateMultParams';
_chai.should();

describe('getCloseToDaiParams all fees', async () => {
  const marketParams: MarketParams = {
    marketPrice: 3000,
    oraclePrice: 3000,
    FF: 0.0009,
    OF: 0.0003,
    slippage: 0.03,
  };
  const vaultInfo: VaultInfo = { currentDebt: 100000, currentCollateral: 100, minCollRatio: 1.5 };

  it('should return correct toTokenAmount and requiredDebt', async () => {
    const result = getCloseToDaiParams(marketParams, vaultInfo);
    expect(result.withdrawCollateral.toNumber()).to.be.equal(0);
    expect(result.requiredDebt.toNumber()).to.be.equal(
      new BigNumber(vaultInfo.currentDebt).times(DEBT_OFFSET_MULTIPLIER).toNumber(),
    );
    expect(result.toTokenAmount.toNumber()).to.be.lessThan(300000);
  });
});
