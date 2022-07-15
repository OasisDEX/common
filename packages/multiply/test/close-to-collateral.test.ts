import { expect } from 'chai';
import BigNumber from 'bignumber.js';
import { getCloseToCollateralParams } from '../src/index';
import { MarketParams, VaultInfoForClosing } from '../src/internal/types';
import { DEBT_OFFSET_MULTIPLIER } from '../src/calculate-multiply-params';

describe('getCloseToCollateralParams skipFF = true', async () => {
  const marketParams: MarketParams = {
    marketPrice: 3000,
    oraclePrice: 3000,
    FF: 0.0009,
    OF: 0.0003,
    slippage: 0.03,
  };
  const vaultInfo: VaultInfoForClosing = {
    currentDebt: 100000,
    currentCollateral: 100,
    minCollRatio: 1.5,
  };

  it('should return correct toTokenAmount and requiredDebt', async () => {
    const result = getCloseToCollateralParams(marketParams, vaultInfo);
    expect(result.withdrawCollateral.toNumber()).to.be.equal(0);
    expect(result.skipFL).to.be.equal(true);
    expect(result.requiredDebt.toNumber()).to.be.equal(0);
    expect(result.toTokenAmount.toNumber()).to.be.equal(103217.55484563917);
  });
});

describe('getCloseToCollateralParams skipFF = false', async () => {
  const marketParams: MarketParams = {
    marketPrice: 3000,
    oraclePrice: 3000,
    FF: 0.0009,
    OF: 0.0003,
    slippage: 0.03,
  };
  const vaultInfo: VaultInfoForClosing = {
    currentDebt: 100000,
    currentCollateral: 83,
    minCollRatio: 1.5,
  };

  it('should return correct toTokenAmount and requiredDebt', async () => {
    const result = getCloseToCollateralParams(marketParams, vaultInfo);
    expect(result.withdrawCollateral.toNumber()).to.be.equal(0);
    expect(result.skipFL).to.be.equal(false);
    expect(result.requiredDebt.toNumber()).to.be.equal(
      new BigNumber(vaultInfo.currentDebt).times(DEBT_OFFSET_MULTIPLIER).toNumber(),
    );
    expect(result.toTokenAmount.toNumber()).to.be.equal(103217.55484563917);
  });
});
