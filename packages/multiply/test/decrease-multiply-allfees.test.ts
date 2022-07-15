import { expect } from 'chai';
require('mocha');
import * as _chai from 'chai';
import { BigNumber } from 'bignumber.js';
import { getMultiplyParams } from './../src/index';
import { DesiredCDPState, MarketParams, VaultInfo } from '../src/internal/types';
_chai.should();
const one = new BigNumber(1);
const zero = new BigNumber(0);

let vaultCollRatio = (vaultInfo:VaultInfo,marketParams:MarketParams)=>{
  return vaultInfo.currentCollateral.multipliedBy(marketParams.oraclePrice).dividedBy(vaultInfo.currentDebt);
}
let marketParams: MarketParams;
let vaultInfo: VaultInfo;
let desiredCollRatio:number;

marketParams = new MarketParams({
  marketPrice: 2000,
  oraclePrice: 2200,
  FF: 0.0,
  OF: 0.002,
  slippage: 0.02,
});
vaultInfo = new VaultInfo(100000, 100, 1.5);
desiredCollRatio = 5;

describe.only(`decrease multiple, from ${vaultCollRatio(vaultInfo, marketParams).toNumber()} to ${desiredCollRatio}`,  () => {

    it(`should calculate amounts that leads to ${desiredCollRatio} coll ratio`, async () => {
        const desiredCdpState = new DesiredCDPState(new BigNumber(desiredCollRatio), 0, 0, 0, 0);
        const retVal = getMultiplyParams(marketParams, vaultInfo, desiredCdpState, false);
        const oracleValueOfNewVaultCollateralValue = retVal.collateralDelta.plus(vaultInfo.currentCollateral).multipliedBy(marketParams.oraclePrice);
        const newVaultDebtAmount = retVal.debtDelta.plus(vaultInfo.currentDebt);
        const newVaultCollRatio = oracleValueOfNewVaultCollateralValue.dividedBy(newVaultDebtAmount);
        expect(newVaultCollRatio.toNumber()).to.be.greaterThan(desiredCollRatio * 0.9999);
        expect(newVaultCollRatio.toNumber()).to.be.lessThan(desiredCollRatio * 1.0001);
      });

    });
