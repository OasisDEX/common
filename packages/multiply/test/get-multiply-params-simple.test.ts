import { expect } from 'chai';
require('mocha');
import * as _chai from 'chai';
import { BigNumber } from 'bignumber.js';
import { getMultiplyParams } from './../src/index';
import { DesiredCDPState, MarketParams, VaultInfo } from '../src/internal/types';
_chai.should();
const one = new BigNumber(1);
describe('getMultiplyParams no fees, slippage, zero price divergence/', async () => {
  const marketParams: MarketParams = {
    marketPrice: 3000,
    oraclePrice: 3000,
    FF: 0,
    OF: 0,
    slippage: 0,
  };
  const vaultInfo: VaultInfo = { currentDebt: 10000, currentCollateral: 10, minCollRatio: 1.5 };

  it('should return object', async () => {
    const val = getMultiplyParams(
      {
        marketPrice: 100,
        oraclePrice: 100,
        FF: 0,
        OF: 0,
        slippage: 0,
      },
      { currentDebt: 100, currentCollateral: 100, minCollRatio: 1.5 },
      { requiredCollRatio: 2 },
    );
    expect(val).to.not.be.undefined;
  });

  it('should console.log stuff if used in debug mode for increase', async () => {
    let callCount = 0;
    const backup = console.log;
    console.log = () => {
      callCount = callCount + 1;
    };
    const val = getMultiplyParams(
      {
        marketPrice: 100,
        oraclePrice: 100,
        FF: 0,
        OF: 0,
        slippage: 0,
      },
      { currentDebt: 100, currentCollateral: 100, minCollRatio: 1.5 },
      { requiredCollRatio: 2 },
      true,
    );
    console.log = backup;
    expect(val).to.not.be.undefined;
    expect(callCount).to.be.greaterThan(5);
  });

  it('should console.log stuff if used in debug mode for decrease', async () => {
    let callCount = 0;
    const backup = console.log;
    console.log = () => {
      callCount = callCount + 1;
    };
    const val = getMultiplyParams(
      {
        marketPrice: 200,
        oraclePrice: 200,
        FF: 0,
        OF: 0,
        slippage: 0,
      },
      { currentDebt: 10000, currentCollateral: 10, minCollRatio: 1.5 },
      { requiredCollRatio: 7 },
      true,
    );
    console.log = backup;
    expect(val).to.not.be.undefined;
    expect(callCount).to.be.greaterThan(5);
  });

  describe(`multiply increase inital debt=10000 collRatio 3`, async () => {
    it('should draw additional 10000 debt when changing collateralisation ratio from 3 to 2', async () => {
      const desiredCdpState: DesiredCDPState = { requiredCollRatio: 2 };
      const retVal = getMultiplyParams(marketParams, vaultInfo, desiredCdpState, false);
      const finalDebt = retVal.debtDelta.plus(vaultInfo.currentDebt);
      const finalCollVal = retVal.collateralDelta
        .plus(vaultInfo.currentCollateral)
        .times(marketParams.oraclePrice);
      expect(retVal.debtDelta.toNumber()).to.be.equal(10000);
      expect(retVal.collateralDelta.toNumber()).to.be.greaterThan(3.3333);
      expect(retVal.collateralDelta.toNumber()).to.be.lessThan(3.3334);
      expect(finalCollVal.dividedBy(finalDebt).toNumber()).to.be.greaterThan(1.9999);
      expect(finalCollVal.dividedBy(finalDebt).toNumber()).to.be.lessThan(2.0001);
    });

    it.only('should end with correct collateralisation ratio when changing collateralisation ratio from 3 to 2 and providing 10000 dai', async () => {
      const desiredCdpState: DesiredCDPState = { requiredCollRatio: 2, providedDai: 10000 };
      const retVal = getMultiplyParams(marketParams, vaultInfo, desiredCdpState, true);
      const finalDebt = retVal.debtDelta.plus(vaultInfo.currentDebt);
      const finalCollVal = retVal.collateralDelta
        .plus(vaultInfo.currentCollateral)
        .times(marketParams.oraclePrice);
      console.log('Calculated finals', finalDebt.toString(), finalCollVal.toString());
      expect(finalCollVal.dividedBy(finalDebt).toNumber()).to.be.greaterThan(1.9999);
      expect(finalCollVal.dividedBy(finalDebt).toNumber()).to.be.lessThan(2.0001);
    });
  });

  describe(`multiply decrease inital debt=10000 collRatio 3`, async () => {
    it('should have collateral delta worth of 20000 DAI when withdrawing 5000 DAI and changing collateralisation ratio to 4', async () => {
      const desiredCdpState: DesiredCDPState = { requiredCollRatio: 4, withdrawDai: 5000 };
      const retVal = getMultiplyParams(marketParams, vaultInfo, desiredCdpState, false);
      const finalCollVal = retVal.collateralDelta
        .plus(vaultInfo.currentCollateral)
        .times(marketParams.oraclePrice);
      expect(finalCollVal.toNumber()).to.be.equal(20000);
    });

    it('should have debt delta equal 7500 DAI when withdrawing 10000 DAI worth of collateral and changing collateralisation ratio to 5', async () => {
      const desiredCdpState: DesiredCDPState = {
        requiredCollRatio: 4,
        withdrawColl: one.times(10000).dividedBy(marketParams.marketPrice),
      };
      const retVal = getMultiplyParams(marketParams, vaultInfo, desiredCdpState, false);
      const finalDebtVal = new BigNumber(vaultInfo.currentDebt).plus(retVal.debtDelta);
      expect(finalDebtVal.toNumber()).to.be.equal(2500);
    });

    it('should have debt delta equal 5000 DAI when changing collateralisation ratio to 5', async () => {
      const retVal = getMultiplyParams(marketParams, vaultInfo, { requiredCollRatio: 5 }, false);
      const finalDebtVal = new BigNumber(vaultInfo.currentDebt).plus(retVal.debtDelta);
      expect(finalDebtVal.toNumber()).to.be.equal(5000);
    });
  });
});
