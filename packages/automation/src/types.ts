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
}

export enum TriggerType {
  StopLossToCollateral = 1,
  StopLossToDai = 2,
  BasicBuy = 3,
  BasicSell = 4,
  AutoTakeProfitToCollateral = 7,
  AutoTakeProfitToDai = 8,
}

export enum TriggerGroupType {
  ConstantMultiple = 1,
}

export type ParamDefinition = ReadonlyArray<string | ethers.utils.ParamType>;

export type CommandTypeMapping = Record<CommandContractType, ParamDefinition>;

export interface CommandContractInfo {
  type: CommandContractType;
  overwrite?: ParamDefinition;
}
