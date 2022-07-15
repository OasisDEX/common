import { BigNumber } from 'bignumber.js';
import {
  DesiredCDPState,
  MarketParams,
  VaultInfo,
  VaultInfoForClosing,
  CloseToParams,
  MultipleChangeParams,
  MultipleChangeResult,
} from './internal/types';
import { one } from './internal/constants';
import { calculateDecrease, calculateIncrease } from './internal/multiple';

// to account for outdated debt value
export const DEBT_OFFSET_MULTIPLIER = new BigNumber(1.00001);

export function getMultiplyParams(
  marketParams: MarketParams,
  vault: VaultInfo,
  desiredState: DesiredCDPState,
  debug = false,
): MultipleChangeResult {
  const { withdrawColl, withdrawDai, providedDai, providedCollateral } = desiredState;
  const params: MultipleChangeParams = { marketParams, vault, desiredState, debug };

  if ([withdrawColl, withdrawDai].some((x) => new BigNumber(x || 0).gt(0))) {
    return calculateDecrease(params);
  }

  if ([providedDai, providedCollateral].some((x) => new BigNumber(x || 0).gt(0))) {
    return calculateIncrease(params);
  }

  const collRatio = new BigNumber(vault.currentCollateral)
    .times(marketParams.oraclePrice)
    .div(vault.currentDebt);
  return collRatio.lt(desiredState.requiredCollRatio)
    ? calculateDecrease(params)
    : calculateIncrease(params);
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
