import { BigNumber } from 'bignumber.js';
import { one } from './constants';
import { logger } from './logger';
import { MultipleChangeResult, MultipleChangeParams } from './types';

export function calculateIncrease(params: MultipleChangeParams): MultipleChangeResult {
  const result = calculateMultipleIncrease(params);

  const { currentCollateral, currentDebt, minCollRatio } = params.vault;
  const newDebt = new BigNumber(currentDebt).plus(result.debtDelta);
  const currentCollateralValue = new BigNumber(currentCollateral).times(
    params.marketParams.oraclePrice,
  );
  if (!currentCollateralValue.div(newDebt).gt(minCollRatio)) {
    return { ...result, skipFL: false };
  }

  const marketParams = { ...params.marketParams, FF: new BigNumber(0) };
  return { ...calculateMultipleDecrease({ ...params, marketParams }), skipFL: true };
}

export function calculateDecrease(params: MultipleChangeParams): MultipleChangeResult {
  const result = calculateMultipleDecrease(params);

  const { currentCollateral, currentDebt, minCollRatio } = params.vault;
  const collateralLeft = new BigNumber(currentCollateral).minus(result.collateralDelta);
  const collateralLeftValue = collateralLeft.times(params.marketParams.oraclePrice);
  if (!collateralLeftValue.div(currentDebt).gt(minCollRatio)) {
    return { ...result, skipFL: false };
  }

  const marketParams = { ...params.marketParams, FF: new BigNumber(0) };
  return { ...calculateMultipleDecrease({ ...params, marketParams }), skipFL: true };
}

function calculateMultipleIncrease({
  marketParams,
  vault,
  desiredState,
  debug,
}: MultipleChangeParams): Omit<MultipleChangeResult, 'skipFL'> {
  const log = logger('calculateParamsIncreaseMP');
  debug && log([marketParams, vault, desiredState]);

  const { oraclePrice, marketPrice, slippage, OF, FF } = marketParams;
  const { requiredCollRatio, providedDai = 0, providedCollateral = 0 } = desiredState;
  const currentColl = new BigNumber(vault.currentCollateral).plus(providedCollateral);
  const currentDebt = new BigNumber(vault.currentDebt).minus(providedDai);

  const marketPriceWithSlippage = new BigNumber(marketPrice).times(one.plus(slippage));
  const oraclePriceWithFee = new BigNumber(oraclePrice).times(one.minus(OF));

  // ((c * op - rr * d) * mps + opf * dd) / (mps * rr * (1 + FF) - opf)
  const debtDelta = currentColl
    .times(oraclePrice)
    .minus(currentDebt.times(requiredCollRatio))
    .times(marketPriceWithSlippage)
    .plus(oraclePriceWithFee.times(providedDai))
    .div(
      marketPriceWithSlippage
        .times(requiredCollRatio)
        .times(one.plus(FF))
        .minus(oraclePriceWithFee),
    );

  const oazoFee = new BigNumber(providedDai).plus(debtDelta.times(one.plus(FF))).times(OF);
  const loanFee = debtDelta.times(FF);
  const collateralDelta = debtDelta.times(one.minus(OF)).div(marketPriceWithSlippage);

  debug && log([{ debtDelta, collateralDelta }]);

  return { debtDelta, collateralDelta, oazoFee, loanFee };
}

function calculateMultipleDecrease({
  marketParams,
  vault,
  desiredState,
  debug,
}: MultipleChangeParams): Omit<MultipleChangeResult, 'skipFL'> {
  const log = logger('calculateParamsDecreaseMP');
  debug && log([marketParams, vault, desiredState]);

  const { oraclePrice, marketPrice, slippage, OF, FF } = marketParams;
  const marketPriceSlippage = new BigNumber(marketPrice).times(one.minus(slippage));

  const { requiredCollRatio, providedDai = 0, withdrawColl = 0, withdrawDai = 0 } = desiredState;
  const currentColl = new BigNumber(vault.currentCollateral).minus(withdrawColl);
  const currentDebt = new BigNumber(vault.currentDebt).plus(withdrawDai);

  // mps (c * op - rr * d) / (op * (1 + FF + OF + OF * FF) - mps * rr) + dd
  const feeMultiple = one.plus(FF).times(one.plus(OF));
  const debtDelta = marketPriceSlippage
    .times(currentColl.times(oraclePrice).minus(currentDebt.times(requiredCollRatio)))
    .div(
      new BigNumber(oraclePrice)
        .times(feeMultiple)
        .minus(marketPriceSlippage.times(requiredCollRatio)),
    )
    .plus(providedDai);
  const collateralDelta = debtDelta.times(one.plus(OF).plus(FF)).div(marketPriceSlippage);
  const oazoFee = debtDelta.times(one.plus(FF)).times(OF);
  const loanFee = debtDelta.times(FF);

  debug && log([{ debtDelta, collateralDelta }]);

  return {
    debtDelta: debtDelta.negated(),
    collateralDelta: collateralDelta.negated(),
    oazoFee,
    loanFee,
  };
}
