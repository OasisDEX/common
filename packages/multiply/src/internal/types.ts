import { BigNumber } from 'bignumber.js';

export interface MarketParams {
  oraclePrice: BigNumber.Value;
  marketPrice: BigNumber.Value;
  FF: BigNumber.Value;
  OF: BigNumber.Value;
  slippage: BigNumber.Value;
}

interface VaultInfoBase {
  currentDebt: BigNumber.Value;
  currentCollateral: BigNumber.Value;
}

export interface VaultInfo extends VaultInfoBase {
  minCollRatio: BigNumber.Value; // minimum acceptable collateralisation ratio
}

export interface VaultInfoForClosing extends VaultInfoBase {
  minCollRatio?: BigNumber.Value;
}

export interface DesiredCDPState {
  requiredCollRatio: BigNumber.Value;
  providedCollateral?: BigNumber.Value;
  providedDai?: BigNumber.Value;
  withdrawDai?: BigNumber.Value;
  withdrawColl?: BigNumber.Value;
}

export interface CloseToParams {
  fromTokenAmount: BigNumber;
  toTokenAmount: BigNumber;
  minToTokenAmount: BigNumber;
  borrowCollateral: BigNumber;
  requiredDebt: BigNumber;
  withdrawCollateral: BigNumber;
  loanFee: BigNumber;
  oazoFee: BigNumber;
  skipFL: boolean;
}
