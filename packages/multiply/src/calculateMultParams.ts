import { BigNumber } from 'bignumber.js';
import { DesiredCDPState, MarketParams, VaultInfo } from './internal/types';
import { ensureBigNumber, one } from './internal/utils';
import {
  calculateParamsIncreaseMP,
  calculateParamsDecreaseMP,
} from './internal/increaseDecreaseMP';

function calculateIncrease(
  marketParams: MarketParams,
  vaultInfo: VaultInfo,
  desiredCdp: DesiredCDPState,
  debug = false,
): {
  params: Array<BigNumber>;
  skipFL: boolean;
} {
  let debtDelta: BigNumber;
  let collateralDelta: BigNumber;
  let loanFee: BigNumber;
  let oazoFee: BigNumber;
  let skipFL: boolean;
  skipFL = false;
  [debtDelta, collateralDelta, oazoFee, loanFee] = calculateParamsIncreaseMP(
    marketParams.oraclePrice,
    marketParams.marketPrice,
    marketParams.OF,
    marketParams.FF,
    vaultInfo.currentCollateral.plus(desiredCdp.providedCollateral),
    vaultInfo.currentDebt.minus(desiredCdp.providedDai),
    desiredCdp.requiredCollRatio,
    marketParams.slippage,
    desiredCdp.providedDai,
    debug,
  );
  const newDebt = vaultInfo.currentDebt.plus(debtDelta);
  const currentCollateralValue = vaultInfo.currentCollateral.times(marketParams.oraclePrice);
  if (currentCollateralValue.dividedBy(newDebt).gt(vaultInfo.minCollRatio)) {
    skipFL = true;
    [debtDelta, collateralDelta, oazoFee, loanFee] = calculateParamsIncreaseMP(
      marketParams.oraclePrice,
      marketParams.marketPrice,
      marketParams.OF,
      new BigNumber(0), //no FL Fee
      vaultInfo.currentCollateral.plus(desiredCdp.providedCollateral),
      vaultInfo.currentDebt.minus(desiredCdp.providedDai),
      desiredCdp.requiredCollRatio,
      marketParams.slippage,
      desiredCdp.providedDai,
      debug,
    );
  }
  return {
    params: [debtDelta, collateralDelta, oazoFee, loanFee],
    skipFL,
  };
}

function calculateDecrease(
  marketParams: MarketParams,
  vaultInfo: VaultInfo,
  desiredCdp: DesiredCDPState,
  debug = false,
): {
  params: Array<BigNumber>;
  skipFL: boolean;
} {
  let debtDelta: BigNumber;
  let collateralDelta: BigNumber;
  let loanFee: BigNumber;
  let oazoFee: BigNumber;
  let skipFL: boolean;
  skipFL = false;
  //decrease multiply
  [debtDelta, collateralDelta, oazoFee, loanFee] = calculateParamsDecreaseMP(
    marketParams.oraclePrice,
    marketParams.marketPrice,
    marketParams.OF,
    marketParams.FF,
    vaultInfo.currentCollateral.minus(desiredCdp.withdrawColl),
    vaultInfo.currentDebt.plus(desiredCdp.withdrawDai),
    desiredCdp.requiredCollRatio,
    marketParams.slippage,
    desiredCdp.providedDai,
    debug,
  );

  const collateralLeft = vaultInfo.currentCollateral.minus(collateralDelta);
  const collateralLeftValue = collateralLeft.times(marketParams.oraclePrice);
  if (collateralLeftValue.dividedBy(vaultInfo.currentDebt).gt(vaultInfo.minCollRatio)) {
    skipFL = true;
    [debtDelta, collateralDelta, oazoFee, loanFee] = calculateParamsDecreaseMP(
      marketParams.oraclePrice,
      marketParams.marketPrice,
      marketParams.OF,
      new BigNumber(0), //no FL Fee
      vaultInfo.currentCollateral.minus(desiredCdp.withdrawColl),
      vaultInfo.currentDebt.plus(desiredCdp.withdrawDai),
      desiredCdp.requiredCollRatio,
      marketParams.slippage,
      desiredCdp.providedDai,
      debug,
    );
  }
  return {
    params: [debtDelta, collateralDelta, oazoFee, loanFee],
    skipFL,
  };
}

function getMultiplyParams(
  marketParams: MarketParams,
  vaultInfo: VaultInfo,
  desiredCdp: DesiredCDPState,
  debug = false,
): {
  debtDelta: BigNumber;
  collateralDelta: BigNumber;
  loanFee: BigNumber;
  oazoFee: BigNumber;
  skipFL: boolean;
} {
  let debtDelta = new BigNumber(0);
  let collateralDelta = new BigNumber(0);
  let loanFee = new BigNumber(0);
  let oazoFee = new BigNumber(0);
  let skipFL = false;

  if (desiredCdp.withdrawColl.gt(0) || desiredCdp.withdrawDai.gt(0)) {
    const params = calculateDecrease(marketParams, vaultInfo, desiredCdp, debug);

    [debtDelta, collateralDelta, oazoFee, loanFee] = params.params;
    skipFL = params.skipFL;
    debtDelta = debtDelta.times(-1);
    collateralDelta = collateralDelta.times(-1);
  } else {
    if (desiredCdp.providedDai.gt(0) || desiredCdp.providedCollateral.gt(0)) {
      //increase multiply

      const params = calculateIncrease(marketParams, vaultInfo, desiredCdp, debug);

      [debtDelta, collateralDelta, oazoFee, loanFee] = params.params;
      skipFL = params.skipFL;
    } else {
      const currentCollRat = vaultInfo.currentCollateral
        .times(marketParams.oraclePrice)
        .dividedBy(vaultInfo.currentDebt);
      if (currentCollRat.lt(desiredCdp.requiredCollRatio)) {
        const params = calculateDecrease(marketParams, vaultInfo, desiredCdp, debug);

        [debtDelta, collateralDelta, oazoFee, loanFee] = params.params;
        skipFL = params.skipFL;

        debtDelta = debtDelta.times(-1);
        collateralDelta = collateralDelta.times(-1);
      } else {
        const params = calculateIncrease(marketParams, vaultInfo, desiredCdp, debug);

        [debtDelta, collateralDelta, oazoFee, loanFee] = params.params;
        skipFL = params.skipFL;
      }
    }
  }
  return {
    debtDelta: ensureBigNumber(debtDelta),
    collateralDelta: ensureBigNumber(collateralDelta),
    loanFee: ensureBigNumber(loanFee),
    oazoFee: ensureBigNumber(oazoFee),
    skipFL: skipFL,
  };
}

export type CloseToParams = {
  fromTokenAmount: BigNumber
  toTokenAmount: BigNumber
  minToTokenAmount: BigNumber
  oazoFee: BigNumber
  loanFee: BigNumber
  skipFL: boolean
}

function getCloseToDaiParams(
  marketPrice: BigNumber,
  OF: BigNumber, // Oazo fee
  FF: BigNumber, // Flash loan fee
  currentCollateral: BigNumber,
  slippage: BigNumber,
  currentDebt: BigNumber,
): CloseToParams {
  const fromTokenAmount = currentCollateral;
  const toTokenAmount = currentCollateral.times(marketPrice).times(one.minus(OF));
  const minToTokenAmount = currentCollateral
    .times(marketPrice)
    .times(one.minus(OF))
    .times(one.minus(slippage));

  return {
    fromTokenAmount,
    toTokenAmount,
    minToTokenAmount,
    oazoFee: currentCollateral.times(marketPrice).times(OF),
    loanFee: currentDebt.times(FF),
    skipFL: false,
  };
}

function getCloseToCollateralParams(
  marketPrice: BigNumber,
  OF: BigNumber, // Oazo fee
  FF: BigNumber, // Flash loan fee
  currentDebt: BigNumber,
  slippage: BigNumber,
  currentCollateral: BigNumber,
  minCollRatio: BigNumber,
): CloseToParams {
  const expectedFinalDebt = currentDebt.times(one.plus(FF)).times(one.plus(OF));

  const fromTokenAmount = expectedFinalDebt.div(marketPrice.times(one.minus(slippage)));

  const toTokenAmount = expectedFinalDebt.times(one.plus(slippage));

  const minToTokenAmount = expectedFinalDebt

  const skipFL = (() => {
    const requiredAmount = currentDebt
      .times(1.00001 /* to account for not up to date value here */)
      .times(one.plus(OF))
      .times(one.plus(FF));
    const maxCollNeeded = requiredAmount.dividedBy(
      marketPrice.times(one.plus(slippage)),
    );
    if (currentCollateral.dividedBy(minCollRatio).gt(maxCollNeeded)) {
      return true;
    }
    return false;
  })()

  return {
    fromTokenAmount,
    toTokenAmount,
    minToTokenAmount,
    oazoFee: currentDebt.times(one.plus(FF)).times(OF),
    loanFee: currentDebt.times(FF),
    skipFL
  }
}

export {
  getMultiplyParams,
  getCloseToDaiParams,
  getCloseToCollateralParams,
  DesiredCDPState,
  MarketParams,
  VaultInfo,
};
