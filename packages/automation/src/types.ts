import { ethers } from 'ethers';

export enum EthereumNetwork {
  MAINNET = 1,
  GOERLI = 5,
  OPTIMISM = 10,
}

export enum CommandContractType {
  CloseCommand = 'CloseCommand',
  AutoTakeProfitCommand = 'AutoTakeProfitCommand',
  BasicBuyCommand = 'BasicBuyCommand',
  BasicSellCommand = 'BasicSellCommand',
  SimpleAAVESellCommand = 'SimpleAAVESell',
  AaveStopLossCommand = 'AaveStopLossCommand',
  AaveStopLossCommandV2 = 'AaveStopLossCommandV2',
  MakerStopLossCommandV2 = 'MakerStopLossCommandV2',
  MakerAutoTakeProfitCommandV2 = 'MakerAutoTakeProfitCommandV2',
  MakerBasicBuyCommandV2 = 'MakerBasicBuyCommandV2',
  MakerBasicSellCommandV2 = 'MakerBasicSellCommandV2',
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
  MakerStopLossToCollateralV2 = 101,
  MakerStopLossToDaiV2 = 102,
  MakerBasicBuyV2 = 103,
  MakerBasicSellV2 = 104,
  MakerAutoTakeProfitToCollateralV2 = 105,
  MakerAutoTakeProfitToDaiV2 = 106,
  AaveStopLossToCollateralV2 = 107,
  AaveStopLossToDebtV2 = 108,
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
