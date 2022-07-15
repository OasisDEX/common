import { BigNumber } from 'bignumber.js';
import {
  DesiredCDPState,
  MarketParams,
  VaultInfo,
  VaultInfoForClosing,
  CloseToParams,
} from './internal/types';
import { one } from './internal/utils';
import { calculateMultipleIncrease, calculateMultipleDecrease } from './internal/multiple';

// to account for outdated debt value
export const DEBT_OFFSET_MULTIPLIER = new BigNumber(1.00001);

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
  [debtDelta, collateralDelta, oazoFee, loanFee] = calculateMultipleIncrease(
    marketParams,
    vaultInfo,
    desiredCdp,
    // vaultInfo.currentCollateral.plus(desiredCdp.providedCollateral),
    // vaultInfo.currentDebt.minus(desiredCdp.providedDai),
    // desiredCdp.requiredCollRatio,
    // desiredCdp.providedDai,
    debug,
  );

  const newDebt = new BigNumber(vaultInfo.currentDebt).plus(debtDelta);
  const currentCollateralValue = new BigNumber(vaultInfo.currentCollateral).times(
    marketParams.oraclePrice,
  );
  if (currentCollateralValue.dividedBy(newDebt).gt(vaultInfo.minCollRatio)) {
    skipFL = true;
    [debtDelta, collateralDelta, oazoFee, loanFee] = calculateMultipleIncrease(
      { ...marketParams, FF: new BigNumber(0) },
      vaultInfo,
      desiredCdp,
      // vaultInfo.currentCollateral.plus(desiredCdp.providedCollateral),
      // vaultInfo.currentDebt.minus(desiredCdp.providedDai),
      // desiredCdp.requiredCollRatio,
      // desiredCdp.providedDai,
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
  [debtDelta, collateralDelta, oazoFee, loanFee] = calculateMultipleDecrease(
    marketParams,
    vaultInfo,
    desiredCdp,
    // vaultInfo.currentCollateral.minus(desiredCdp.withdrawColl),
    // vaultInfo.currentDebt.plus(desiredCdp.withdrawDai),
    // desiredCdp.requiredCollRatio,
    // desiredCdp.providedDai,
    debug,
  );

  const collateralLeft = new BigNumber(vaultInfo.currentCollateral).minus(collateralDelta);
  const collateralLeftValue = collateralLeft.times(marketParams.oraclePrice);
  if (collateralLeftValue.div(vaultInfo.currentDebt).gt(vaultInfo.minCollRatio)) {
    skipFL = true;
    [debtDelta, collateralDelta, oazoFee, loanFee] = calculateMultipleDecrease(
      { ...marketParams, FF: new BigNumber(0) },
      vaultInfo,
      desiredCdp,
      // vaultInfo.currentCollateral.minus(desiredCdp.withdrawColl),
      // vaultInfo.currentDebt.plus(desiredCdp.withdrawDai),
      // desiredCdp.requiredCollRatio,
      // desiredCdp.providedDai,
      debug,
    );
  }
  return {
    params: [debtDelta, collateralDelta, oazoFee, loanFee],
    skipFL,
  };
}

export function getMultiplyParams(
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

  const { withdrawColl, withdrawDai, providedDai, providedCollateral } = desiredCdp;

  if ([withdrawColl, withdrawDai].some((x) => new BigNumber(x || 0).gt(0))) {
    const { params, skipFL } = calculateDecrease(marketParams, vaultInfo, desiredCdp, debug);
    [debtDelta, collateralDelta, oazoFee, loanFee] = params;
    debtDelta = debtDelta.times(-1);
    collateralDelta = collateralDelta.times(-1);
    return { debtDelta, collateralDelta, loanFee, oazoFee, skipFL };
  }

  if ([providedDai, providedCollateral].some((x) => new BigNumber(x || 0).gt(0))) {
    // increase multiply
    const { params, skipFL } = calculateIncrease(marketParams, vaultInfo, desiredCdp, debug);
    [debtDelta, collateralDelta, oazoFee, loanFee] = params;
    return { debtDelta, collateralDelta, loanFee, oazoFee, skipFL };
  }

  const collRatio = new BigNumber(vaultInfo.currentCollateral)
    .times(marketParams.oraclePrice)
    .div(vaultInfo.currentDebt);
  if (collRatio.lt(desiredCdp.requiredCollRatio)) {
    const { params, skipFL } = calculateDecrease(marketParams, vaultInfo, desiredCdp, debug);

    [debtDelta, collateralDelta, oazoFee, loanFee] = params;
    debtDelta = debtDelta.times(-1);
    collateralDelta = collateralDelta.times(-1);
    return { debtDelta, collateralDelta, loanFee, oazoFee, skipFL };
  }

  const { params, skipFL } = calculateIncrease(marketParams, vaultInfo, desiredCdp, debug);
  [debtDelta, collateralDelta, oazoFee, loanFee] = params;
  return { debtDelta, collateralDelta, loanFee, oazoFee, skipFL };
}

export function getCloseToDaiParams(
  marketParams: MarketParams,
  vaultInfo: VaultInfoForClosing,
): CloseToParams {
  const [collateral, debt] = [
    new BigNumber(vaultInfo.currentCollateral),
    new BigNumber(vaultInfo.currentDebt),
  ];

  const toTokenAmount = collateral
    .times(marketParams.marketPrice)
    .times(one.minus(marketParams.OF));
  const requiredDebt = debt.times(one.multipliedBy(DEBT_OFFSET_MULTIPLIER));
  const oazoFee = collateral.times(marketParams.marketPrice).minus(toTokenAmount);
  const loanFee = debt.times(marketParams.FF);

  return {
    fromTokenAmount: collateral,
    toTokenAmount,
    minToTokenAmount: toTokenAmount.times(one.minus(marketParams.slippage)),
    borrowCollateral: debt,
    requiredDebt,
    withdrawCollateral: new BigNumber(0),
    skipFL: false,
    loanFee,
    oazoFee,
  };
}

export function getCloseToCollateralParams(
  marketParams: MarketParams,
  vaultInfo: VaultInfoForClosing,
): CloseToParams {
  const [collateral, debt] = [
    new BigNumber(vaultInfo.currentCollateral),
    new BigNumber(vaultInfo.currentDebt),
  ];

  const minToTokenAmount = debt
    .times(DEBT_OFFSET_MULTIPLIER)
    .times(one.plus(marketParams.OF))
    .times(one.plus(marketParams.FF));
  const maxCollNeeded = minToTokenAmount.div(
    new BigNumber(marketParams.marketPrice).times(one.minus(marketParams.slippage)),
  );

  let skipFL = false;
  if (vaultInfo.minCollRatio !== undefined) {
    const collateralLocked = debt.div(marketParams.oraclePrice).times(vaultInfo.minCollRatio);
    skipFL = collateral.minus(maxCollNeeded).gt(collateralLocked);
  }

  const oazoFee = minToTokenAmount.times(marketParams.OF);
  const loanFee = minToTokenAmount.times(marketParams.FF);

  return {
    fromTokenAmount: maxCollNeeded,
    toTokenAmount: minToTokenAmount.div(one.minus(marketParams.slippage)),
    minToTokenAmount,
    borrowCollateral: new BigNumber(0),
    requiredDebt: skipFL ? new BigNumber(0) : debt.times(DEBT_OFFSET_MULTIPLIER),
    withdrawCollateral: new BigNumber(0),
    skipFL: skipFL,
    loanFee,
    oazoFee,
  };
}
