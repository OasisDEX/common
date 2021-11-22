import { expect } from 'chai';
require('mocha');
import BigNumber from 'bignumber.js'

import { getCloseToDaiParams, getCloseToCollateralParams } from './../src/index';
import { one } from '../src/internal/utils';

describe('closeTo functions', () => {
  const OAZO_FEE = new BigNumber(0.002)
  const LOAN_FEE = new BigNumber(0.0009)
  const SLIPPAGE = new BigNumber(0.005)
  
  it('Should calculate close to DAI params correctly', () => {
    const currentDebt = new BigNumber(10000)
    const currentCollateral = new BigNumber(20)
    const marketPrice = new BigNumber(1000)

    const expectedFromTokenAmount = currentCollateral
    const expectedToTokenAmount = new BigNumber(19960)
    const expectedMinToTokenAmount = new BigNumber(19860.2)

    const expectedLoanFee = new BigNumber(9)
    const expectedOazoFee = new BigNumber(40)

    const {
      loanFee,
      oazoFee,
      minToTokenAmount,
      toTokenAmount,
      fromTokenAmount,
    } = getCloseToDaiParams(
      marketPrice,
      OAZO_FEE,
      LOAN_FEE,
      currentCollateral,
      SLIPPAGE,
      currentDebt,
    )

    expect(fromTokenAmount).to.be.deep.equal(expectedFromTokenAmount)
    expect(toTokenAmount).to.be.deep.equal(expectedToTokenAmount)
    expect(minToTokenAmount).to.be.deep.equal(expectedMinToTokenAmount)

    expect(loanFee).to.be.deep.equal(expectedLoanFee)
    expect(oazoFee).to.be.deep.equal(expectedOazoFee)
  })

  it('Should calculate close to collateral params correctly', () => {
    const currentDebt = new BigNumber(10000)
    const marketPrice = new BigNumber(1000)

    const expectedFromTokenAmount = new BigNumber('10.07941507537688442211')
    const expectedToTokenAmount = new BigNumber('10079.16309')
    const expectedMinToTokenAmount = new BigNumber('10029.018')

    const expectedLoanFee = new BigNumber(9)
    const expectedOazoFee = new BigNumber(20.018)

    const {
      loanFee,
      oazoFee,
      minToTokenAmount,
      toTokenAmount,
      fromTokenAmount,
    } = getCloseToCollateralParams(
      marketPrice, 
      OAZO_FEE, 
      LOAN_FEE, 
      currentDebt, 
      SLIPPAGE,
      one,
      one
    )

    expect(fromTokenAmount).to.be.deep.equal(expectedFromTokenAmount)
    expect(toTokenAmount).to.be.deep.equal(expectedToTokenAmount)
    expect(minToTokenAmount).to.be.deep.equal(expectedMinToTokenAmount)

    expect(loanFee).to.be.deep.equal(expectedLoanFee)
    expect(oazoFee).to.be.deep.equal(expectedOazoFee)
  })
})