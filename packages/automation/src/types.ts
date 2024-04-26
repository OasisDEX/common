import { ethers } from 'ethers';

export enum EthereumNetwork {
  MAINNET = 1,
  GOERLI = 5,
  OPTIMISM = 10,
  BASE = 8453,
  ARBITRUM = 42161,
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
  SparkStopLossCommandV2 = 'SparkStopLossCommandV2',
  DmaAaveBasicBuyCommandV2 = 'DmaAaveV3BasicBuyCommandV2',
  DmaAaveBasicSellCommandV2 = 'DmaAaveV3BasicSellCommandV2',
  DmaSparkStopLossCommandV2 = 'DmaSparkStopLossCommandV2',
  DmaAaveStopLossCommandV2 = 'DmaAaveV3StopLossCommandV2',
  DmaAaveTrailingStopLossCommandV2 = 'DmaAaveV3TrailingStopLossCommandV2',
  DmaSparkTrailingStopLossCommandV2 = 'DmaSparkTrailingStopLossCommandV2',
  DmaSparkBasicBuyCommandV2 = 'DmaSparkBasicBuyCommandV2',
  DmaSparkBasicSellCommandV2 = 'DmaSparkBasicSellCommandV2',
  DmaAavePartialTakeProfitCommandV2 = 'DmaAaveV3PartialTakeProfitCommandV2',
  DmaSparkPartialTakeProfitCommandV2 = 'DmaSparkPartialTakeProfitCommandV2',

  DmaMorphoBlueBasicBuyCommandV2 = 'DmaMorphoBlueBasicBuyCommandV2',
  DmaMorphoBlueBasicSellCommandV2 = 'DmaMorphoBlueBasicSellCommandV2',
  DmaMorphoBluePartialTakeProfitCommandV2 = 'DmaMorphoBluePartialTakeProfitCommandV2',
  DmaMorphoBlueStopLossCommandV2 = 'DmaMorphoBlueStopLossCommandV2',
  DmaMorphoBlueTrailingStopLossCommandV2 = 'DmaMorphoBlueTrailingStopLossCommandV2',
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
  AaveStopLossToCollateralV2 = 111,
  AaveStopLossToDebtV2 = 112,
  SparkStopLossToCollateralV2 = 117,
  SparkStopLossToDebtV2 = 118,
  DmaAaveBasicBuyV2 = 121,
  DmaAaveBasicSellV2 = 122,
  DmaAaveStopLossToCollateralV2 = 127,
  DmaAaveStopLossToDebtV2 = 128,
  DmaSparkStopLossToCollateralV2 = 129,
  DmaSparkStopLossToDebtV2 = 130,
  DmaSparkBasicBuyV2 = 131,
  DmaSparkBasicSellV2 = 132,
  DmaAavePartialTakeProfitV2 = 133,
  DmaSparkPartialTakeProfitV2 = 134,
  DmaAaveTrailingStopLossV2 = 10006,
  DmaSparkTrailingStopLossV2 = 10007,
  DmaMorphoBlueBasicBuyV2 = 135,
  DmaMorphoBlueBasicSellV2 = 136,
  DmaMorphoBluePartialTakeProfitV2 = 137,
  DmaMorphoBlueStopLossV2 = 138,
  DmaMorphoBlueTrailingStopLossV2 = 10008,
}

export const TrailingStopLossTriggers = [
  TriggerType.DmaAaveTrailingStopLossV2,
  TriggerType.DmaSparkTrailingStopLossV2,
  TriggerType.DmaMorphoBlueTrailingStopLossV2,
];

export const triggerTypeToCommandContractTypeMap: Record<TriggerType, CommandContractType> = {
  [TriggerType.StopLossToCollateral]: CommandContractType.CloseCommand,
  [TriggerType.StopLossToDai]: CommandContractType.CloseCommand,
  [TriggerType.BasicBuy]: CommandContractType.BasicBuyCommand,
  [TriggerType.BasicSell]: CommandContractType.BasicSellCommand,
  [TriggerType.AutoTakeProfitToCollateral]: CommandContractType.AutoTakeProfitCommand,
  [TriggerType.AutoTakeProfitToDai]: CommandContractType.AutoTakeProfitCommand,
  [TriggerType.SimpleAAVESell]: CommandContractType.SimpleAAVESellCommand,
  [TriggerType.AaveStopLossToCollateral]: CommandContractType.AaveStopLossCommand,
  [TriggerType.AaveStopLossToDebt]: CommandContractType.AaveStopLossCommand,
  [TriggerType.MakerStopLossToCollateralV2]: CommandContractType.MakerStopLossCommandV2,
  [TriggerType.MakerStopLossToDaiV2]: CommandContractType.MakerStopLossCommandV2,
  [TriggerType.MakerBasicBuyV2]: CommandContractType.MakerBasicBuyCommandV2,
  [TriggerType.MakerBasicSellV2]: CommandContractType.MakerBasicSellCommandV2,
  [TriggerType.MakerAutoTakeProfitToCollateralV2]: CommandContractType.MakerAutoTakeProfitCommandV2,
  [TriggerType.MakerAutoTakeProfitToDaiV2]: CommandContractType.MakerAutoTakeProfitCommandV2,
  [TriggerType.AaveStopLossToCollateralV2]: CommandContractType.AaveStopLossCommandV2,
  [TriggerType.AaveStopLossToDebtV2]: CommandContractType.AaveStopLossCommandV2,
  [TriggerType.SparkStopLossToCollateralV2]: CommandContractType.SparkStopLossCommandV2,
  [TriggerType.SparkStopLossToDebtV2]: CommandContractType.SparkStopLossCommandV2,
  [TriggerType.DmaAaveBasicBuyV2]: CommandContractType.DmaAaveBasicBuyCommandV2,
  [TriggerType.DmaAaveBasicSellV2]: CommandContractType.DmaAaveBasicSellCommandV2,
  [TriggerType.DmaAaveStopLossToCollateralV2]: CommandContractType.DmaAaveStopLossCommandV2,
  [TriggerType.DmaAaveStopLossToDebtV2]: CommandContractType.DmaAaveStopLossCommandV2,
  [TriggerType.DmaSparkStopLossToCollateralV2]: CommandContractType.DmaSparkStopLossCommandV2,
  [TriggerType.DmaSparkStopLossToDebtV2]: CommandContractType.DmaSparkStopLossCommandV2,
  [TriggerType.DmaAaveTrailingStopLossV2]: CommandContractType.DmaAaveTrailingStopLossCommandV2,
  [TriggerType.DmaSparkTrailingStopLossV2]: CommandContractType.DmaSparkTrailingStopLossCommandV2,
  [TriggerType.DmaSparkBasicBuyV2]: CommandContractType.DmaSparkBasicBuyCommandV2,
  [TriggerType.DmaSparkBasicSellV2]: CommandContractType.DmaSparkBasicSellCommandV2,
  [TriggerType.DmaAavePartialTakeProfitV2]: CommandContractType.DmaAavePartialTakeProfitCommandV2,
  [TriggerType.DmaSparkPartialTakeProfitV2]: CommandContractType.DmaSparkPartialTakeProfitCommandV2,

  [TriggerType.DmaMorphoBlueBasicBuyV2]: CommandContractType.DmaMorphoBlueBasicBuyCommandV2,
  [TriggerType.DmaMorphoBlueBasicSellV2]: CommandContractType.DmaMorphoBlueBasicSellCommandV2,
  [TriggerType.DmaMorphoBluePartialTakeProfitV2]:
    CommandContractType.DmaMorphoBluePartialTakeProfitCommandV2,
  [TriggerType.DmaMorphoBlueStopLossV2]: CommandContractType.DmaMorphoBlueStopLossCommandV2,
  [TriggerType.DmaMorphoBlueTrailingStopLossV2]:
    CommandContractType.DmaMorphoBlueTrailingStopLossCommandV2,
};

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
