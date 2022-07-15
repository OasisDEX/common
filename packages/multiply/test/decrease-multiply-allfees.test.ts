import { expect } from 'chai';
import { BigNumber } from 'bignumber.js';
import { getMultiplyParams } from './../src/index';
import { DesiredCDPState, MarketParams, VaultInfo } from '../src/internal/types';

function vaultCollRatio(vaultInfo: VaultInfo, marketParams: MarketParams) {
  return new BigNumber(vaultInfo.currentCollateral)
    .times(marketParams.oraclePrice)
    .dividedBy(vaultInfo.currentDebt);
}

const marketParams: MarketParams = {
  marketPrice: 1000,
  oraclePrice: 1020,
  FF: 0.0,
  OF: 0.002,
  slippage: 0.005,
};
const vaultInfo: VaultInfo = { currentDebt: 10000, currentCollateral: 20, minCollRatio: 1.5 };
const currentCollRatio = vaultCollRatio(vaultInfo, marketParams).toNumber();
const requiredCollRatio = 2.2;

describe(`decrease multiple, from ${currentCollRatio} to ${requiredCollRatio}`, () => {
  it(`should calculate amounts that leads to ${requiredCollRatio} coll ratio`, async () => {
    const desiredCdpState: DesiredCDPState = { requiredCollRatio };
    const retVal = getMultiplyParams(marketParams, vaultInfo, desiredCdpState, false);
    const oracleValueOfNewVaultCollateral = retVal.collateralDelta
      .plus(vaultInfo.currentCollateral)
      .times(marketParams.oraclePrice);

    const newVaultDebtAmount = retVal.debtDelta.plus(vaultInfo.currentDebt);
    const newVaultCollRatio = oracleValueOfNewVaultCollateral.div(newVaultDebtAmount);

    expect(newVaultCollRatio.toNumber()).to.be.greaterThan(requiredCollRatio * 0.9999);
    expect(newVaultCollRatio.toNumber()).to.be.lessThan(requiredCollRatio * 1.0001);
  });
});
