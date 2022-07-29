import { ethers } from 'ethers';

export enum EthereumNetwork {
  MAINNET = 1,
  GOERLI = 5,
}

export enum CommandContractType {
  CloseCommand = 'CloseCommand',
  BasicBuyCommand = 'BasicBuyCommand',
  BasicSellCommand = 'BasicSellCommand',
  CMBasicBuyCommand = 'CMBasicBuyCommand',
  CMBasicSellCommand = 'CMBasicSellCommand',
}

export enum TriggerType {
  StopLossToCollateral = 1,
  StopLossToDai = 2,
  BasicBuy = 3,
  BasicSell = 4,
  CMBasicBuy = 5,
  CMBasicSell = 6,
}

export type ParamDefinition = ReadonlyArray<string | ethers.utils.ParamType>;

export type CommandTypeMapping = Record<CommandContractType, ParamDefinition>;

export interface CommandContractInfo {
  type: CommandContractType;
  overwrite?: ParamDefinition;
}
