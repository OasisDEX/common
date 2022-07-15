import { expect } from 'chai';
import { getMultiplyParams } from './../src/index';
import { DesiredCDPState, MarketParams, VaultInfo } from '../src/internal/types';

describe('getMultiplyParams no oazo fee, slippage, zero price divergence, FF applied - 50%', async () => {
  const marketParams: MarketParams = {
    marketPrice: 3000,
    oraclePrice: 3000,
    FF: 0.5,
    OF: 0,
    slippage: 0,
  };
  const vaultInfo: VaultInfo = { currentDebt: 10000, currentCollateral: 10, minCollRatio: 1.5 };

  describe(`multiply increase inital debt=10000 collRatio 3`, async () => {
    it('should pay FF of 6000 when changing collRatio from 3 to 1.5', async () => {
      const desiredCdpState: DesiredCDPState = { requiredCollRatio: 1.5 };
      const retVal = getMultiplyParams(marketParams, vaultInfo, desiredCdpState, false);
      expect(retVal.oazoFee.toNumber()).to.be.equal(0);
      expect(retVal.loanFee.toNumber()).to.be.equal(6000);
    });

    it('should pay FF of 0 when changing collRatio from 3 to 2.5', async () => {
      const desiredCdpState: DesiredCDPState = { requiredCollRatio: 2.5 };
      const retVal = getMultiplyParams(marketParams, vaultInfo, desiredCdpState, false);
      expect(retVal.oazoFee.toNumber()).to.be.equal(0);
      expect(retVal.loanFee.toNumber()).to.be.equal(0);
    });
  });

  describe(`multiply decrease inital debt=10000 collRatio 3`, async () => {
    it('should have FF equal to 2500 when changing collateralisation ratio to 4', async () => {
      const desiredCdpState: DesiredCDPState = { requiredCollRatio: 5 };
      const retVal = getMultiplyParams(marketParams, vaultInfo, desiredCdpState, false);
      expect(retVal.oazoFee.toNumber()).to.be.equal(0);
      expect(retVal.loanFee.toNumber()).not.be.equal(2500);
    });
  });
});
