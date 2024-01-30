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
    DmaAaveBasicBuyV2 = 119,
    DmaAaveBasicSellV2 = 120,
    DmaAaveStopLossToCollateralV2 = 121,
    DmaAaveStopLossToDebtV2 = 122,
    DmaSparkStopLossToCollateralV2 = 123,
    DmaSparkStopLossToDebtV2 = 124,
  }

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
