import { expect } from 'chai';
require('mocha');
import * as _chai from 'chai';
import { BigNumber } from 'bignumber.js';
import { getCloseToDaiParams } from './../src/index';
import { MarketParams, VaultInfo } from '../src/internal/types';
import { OFFSET_MULTIPLAYER } from '../src/calculateMultParams';
_chai.should();
const one = new BigNumber(1);
let marketParams: MarketParams;
let vaultInfo: VaultInfo;

describe('getCloseToDaiParams all fees', async () => {
    beforeEach(async () => {
      marketParams = new MarketParams({
        marketPrice: 3000,
        oraclePrice: 3000,
        FF: 0.0009,
        OF: 0.0003,
        slippage: 0.03,
      });
      vaultInfo = new VaultInfo(100000, 100, 1.5);
    })

    it("should return correct toTokenAmount and requiredDebt",async () => {
        const result = getCloseToDaiParams(marketParams, vaultInfo);
        expect(result.withdrawCollateral.toNumber()).to.be.equal(0);
        expect(result.requiredDebt.toNumber()).to.be.equal(vaultInfo.currentDebt.multipliedBy(OFFSET_MULTIPLAYER).toNumber())
        expect(result.toTokenAmount.toNumber()).to.be.lessThan(300000);

    })

})