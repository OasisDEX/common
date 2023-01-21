import { ethers } from 'ethers';

export enum EthereumNetwork {
  MAINNET = 1,
  GOERLI = 5,
}

export enum CommandContractType {
  CloseCommand = 'CloseCommand',
  AutoTakeProfitCommand = 'AutoTakeProfitCommand',
  BasicBuyCommand = 'BasicBuyCommand',
  BasicSellCommand = 'BasicSellCommand',
  SimpleAAVESellCommand = 'SimpleAAVESell',
  AaveStopLossCommand = 'AaveStopLossCommand',
}

export enum TriggerType {
  StopLossToCollateral = 1,
  StopLossToDai = 2,
  BasicBuy = 3,
  BasicSell = 4,
  AutoTakeProfitToCollateral = 7,
  AutoTakeProfitToDai = 8,
  SimpleAAVESell = 9,
  AaveStopLossToCollateral = 10,
  AaveStopLossToDebt = 11,
}

export enum TriggerGroupType {
  SingleTrigger = 65535,
  ConstantMultiple = 1,
}

export type ParamDefinition = ReadonlyArray<string | ethers.utils.ParamType>;

export type CommandTypeMapping = Record<CommandContractType, ParamDefinition>;

export interface CommandContractInfo {
  type: CommandContractType;
  overwrite?: ParamDefinition;
}
