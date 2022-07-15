import { BigNumber } from 'bignumber.js';
import { DesiredCDPState, MarketParams, VaultInfo } from './types';

function logger(method: string) {
  return (entries: [string, BigNumber.Value, number | undefined][]) => {
    for (const [info, val, precision] of entries) {
      const value = new BigNumber(val);
      console.log(`${method}: ${info} - ${precision ? value.toFixed(precision) : value.toFixed()}`);
    }
  };
}

const one = new BigNumber(1);

export function calculateMultipleIncrease(
  marketParams: MarketParams,
  vault: VaultInfo,
  desiredState: DesiredCDPState,
  debug = false,
): Array<BigNumber> {
  const log = logger('calculateParamsIncreaseMP');
  const { oraclePrice, marketPrice, slippage, OF, FF } = marketParams;
  if (debug) {
    log([
      ['oraclePrice', oraclePrice, 2],
      ['marketPrice', marketPrice, 2],
      ['OF', OF, 5],
      ['FF', FF, 5],
      ['currentColl', vault.currentCollateral, 2],
      ['currentDebt', vault.currentDebt, 2],
      ['requiredCollRatio', desiredState.requiredCollRatio, 2],
      ['slippage', slippage, 2],
    ]);
  }

  const { requiredCollRatio, providedDai = 0, providedCollateral = 0 } = desiredState;
  const currentColl = new BigNumber(vault.currentCollateral).plus(providedCollateral);
  const currentDebt = new BigNumber(vault.currentDebt).minus(providedDai);

  const marketPriceWithSlippage = new BigNumber(marketPrice).times(one.plus(slippage));
  const oraclePriceWithFee = new BigNumber(oraclePrice).times(one.minus(OF));

  // ((c * op - rr * d) * mps + opf * dd) / (mps * rr * (1 + FF) - opf)
  const debt = currentColl
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

  const oasisFee = new BigNumber(providedDai).plus(debt.times(one.plus(FF))).times(OF);
  const flashLoanFee = debt.times(FF);
  const collateral = debt.times(one.minus(OF)).div(marketPriceWithSlippage);
  if (debug) {
    log([
      ['computed debt', debt, 2],
      ['compulted collateral', collateral, 2],
    ]);
  }
  return [debt, collateral, oasisFee, flashLoanFee];
}

export function calculateMultipleDecrease(
  marketParams: MarketParams,
  vault: VaultInfo,
  desiredState: DesiredCDPState,
  // currentColl: BigNumber,
  // currentDebt: BigNumber,
  // requiredCollRatio: BigNumber,
  // depositDai = new BigNumber(0),
  debug = false,
): Array<BigNumber> {
  if (debug) {
    // console.log('calculateParamsDecreaseMP.oraclePrice', oraclePrice.toFixed(2));
    // console.log('calculateParamsDecreaseMP.marketPrice', marketPrice.toFixed(2));
    // console.log('calculateParamsDecreaseMP.OF', OF.toFixed(5));
    // console.log('calculateParamsDecreaseMP.FF', FF.toFixed(5));
    // console.log('calculateParamsDecreaseMP.currentColl', currentColl.toFixed(2));
    // console.log('calculateParamsDecreaseMP.currentDebt', currentDebt.toFixed(2));
    // console.log('calculateParamsDecreaseMP.requiredCollRatio', requiredCollRatio.toFixed(2));
    // console.log('calculateParamsDecreaseMP.slippage', slippage.toFixed(2));
  }

  const { oraclePrice, marketPrice, slippage, OF, FF } = marketParams;
  const marketPriceSlippage = new BigNumber(marketPrice).times(one.minus(slippage));

  const { requiredCollRatio, providedDai = 0, withdrawColl = 0, withdrawDai = 0 } = desiredState;
  const currentColl = new BigNumber(vault.currentCollateral).minus(withdrawColl);
  const currentDebt = new BigNumber(vault.currentDebt).plus(withdrawDai);

  // mps (c * op - rr * d) / (op * (1 + FF + OF + OF * FF) - mps * rr) + dd
  const feeMultiple = one.plus(FF).times(one.plus(OF));
  const debt = marketPriceSlippage
    .times(currentColl.times(oraclePrice).minus(currentDebt.times(requiredCollRatio)))
    .div(
      new BigNumber(oraclePrice)
        .times(feeMultiple)
        .minus(marketPriceSlippage.times(requiredCollRatio)),
    )
    .plus(providedDai);

  const collateral = debt.times(one.plus(OF).plus(FF)).div(marketPriceSlippage);
  const ourFee = debt.times(one.plus(FF)).times(OF);
  const flashLoanFee = debt.times(FF);
  if (debug) {
    console.log('Computed: calculateParamsDecreaseMP.debt', debt.toFixed(4));
    console.log('Computed: calculateParamsDecreaseMP.collateral', collateral.toFixed(4));
  }
  return [debt, collateral, ourFee, flashLoanFee];
}
