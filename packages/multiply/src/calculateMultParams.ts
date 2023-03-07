import { BigNumber } from 'bignumber.js';
import {
  DesiredCDPState,
  MarketParams,
  VaultInfo,
  VaultInfoForClosing,
  CloseToParams,
} from './internal/types';
import { ensureBigNumber, one } from './internal/utils';
import {
  calculateParamsIncreaseMP,
  calculateParamsDecreaseMP,
} from './internal/increaseDecreaseMP';

export const OFFSET_MULTIPLAYER = new BigNumber(1.00001);

function calculateIncrease(
  marketParams: MarketParams,
  vaultInfo: VaultInfo,
  desiredCdp: DesiredCDPState,
  debug = false,
): {
  params: Array<BigNumber>;
  skipFL: boolean;
} {
  const [debtDelta, collateralDelta, oazoFee, loanFee] = calculateParamsIncreaseMP(
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
  return {
    params: [debtDelta, collateralDelta, oazoFee, loanFee],
    skipFL:false,
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
  //decrease multiply
  const [debtDelta, collateralDelta, oazoFee, loanFee] = calculateParamsDecreaseMP(
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

  return {
    params: [debtDelta, collateralDelta, oazoFee, loanFee],
    skipFL:false,
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

  if (desiredCdp.withdrawColl.gt(0) || desiredCdp.withdrawDai.gt(0)) {
    const params = calculateDecrease(marketParams, vaultInfo, desiredCdp, debug);

    [debtDelta, collateralDelta, oazoFee, loanFee] = params.params;
    debtDelta = debtDelta.times(-1);
    collateralDelta = collateralDelta.times(-1);
  } else {
    if (desiredCdp.providedDai.gt(0) || desiredCdp.providedCollateral.gt(0)) {
      //increase multiply

      const params = calculateIncrease(marketParams, vaultInfo, desiredCdp, debug);

      [debtDelta, collateralDelta, oazoFee, loanFee] = params.params;
    } else {
      const currentCollRat = vaultInfo.currentCollateral
        .times(marketParams.oraclePrice)
        .dividedBy(vaultInfo.currentDebt);
      if (currentCollRat.lt(desiredCdp.requiredCollRatio)) {
        const params = calculateDecrease(marketParams, vaultInfo, desiredCdp, debug);

        [debtDelta, collateralDelta, oazoFee, loanFee] = params.params;

        debtDelta = debtDelta.times(-1);
        collateralDelta = collateralDelta.times(-1);
      } else {
        const params = calculateIncrease(marketParams, vaultInfo, desiredCdp, debug);

        [debtDelta, collateralDelta, oazoFee, loanFee] = params.params;
      }
    }
  }
  return {
    debtDelta: ensureBigNumber(debtDelta),
    collateralDelta: ensureBigNumber(collateralDelta),
    loanFee: ensureBigNumber(loanFee),
    oazoFee: ensureBigNumber(oazoFee),
    skipFL: false,
  };
}

function getCloseToDaiParams(
  marketParams: MarketParams,
  vaultInfo: VaultInfoForClosing,
): CloseToParams {
  const _skipFL = false;

  const _toTokenAmount = vaultInfo.currentCollateral
    .times(marketParams.marketPrice)
    .times(one.minus(marketParams.OF));

  const _requiredDebt = vaultInfo.currentDebt.times(one.multipliedBy(OFFSET_MULTIPLAYER));
  const oazoFee = vaultInfo.currentCollateral.times(marketParams.marketPrice).minus(_toTokenAmount);
  const loanFee = vaultInfo.currentDebt.times(marketParams.FF);

  return {
    fromTokenAmount: vaultInfo.currentCollateral,
    toTokenAmount: _toTokenAmount,
    minToTokenAmount: _toTokenAmount.times(one.minus(marketParams.slippage)),
    borrowCollateral: vaultInfo.currentCollateral,
    requiredDebt: _requiredDebt,
    withdrawCollateral: new BigNumber(0),
    skipFL: _skipFL,
    loanFee: ensureBigNumber(loanFee),
    oazoFee: ensureBigNumber(oazoFee),
  };
}

function getCloseToCollateralParams(
  marketParams: MarketParams,
  vaultInfo: VaultInfoForClosing,
  debug = false,
): CloseToParams {
  const _requiredAmount = vaultInfo.currentDebt
    .times(1.00001 /* to account for not up to date value here */)
    .times(one.plus(marketParams.OF))
    .times(one.plus(marketParams.FF));
  let _skipFL = false;
  const maxCollNeeded = _requiredAmount.dividedBy(
    marketParams.marketPrice.times(one.minus(marketParams.slippage)),
  );

  if (vaultInfo.minCollRatio !== undefined) {
    const collateralLocked = vaultInfo.currentDebt
      .dividedBy(marketParams.oraclePrice)
      .multipliedBy(vaultInfo.minCollRatio);

    if (vaultInfo.currentCollateral.minus(maxCollNeeded).gt(collateralLocked)) {
      _skipFL = true;
    }
  }

  const oazoFee = _requiredAmount.multipliedBy(marketParams.OF);
  const loanFee = _requiredAmount.times(marketParams.FF);

  return {
    fromTokenAmount: maxCollNeeded,
    toTokenAmount: _requiredAmount.dividedBy(one.minus(marketParams.slippage)),
    minToTokenAmount: _requiredAmount,
    borrowCollateral: new BigNumber(0),
    requiredDebt: _skipFL
      ? new BigNumber(0)
      : vaultInfo.currentDebt.multipliedBy(OFFSET_MULTIPLAYER),
    withdrawCollateral: new BigNumber(0),
    skipFL: _skipFL,
    loanFee: ensureBigNumber(loanFee),
    oazoFee: ensureBigNumber(oazoFee),
  };
}

export type { CloseToParams };

export {
  getMultiplyParams,
  getCloseToDaiParams,
  getCloseToCollateralParams,
  DesiredCDPState,
  MarketParams,
  VaultInfo,
};
