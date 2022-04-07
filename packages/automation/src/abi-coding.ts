import { utils } from 'ethers';
import { getDefinitionForCommandAddress, getDefinitionForCommandType } from './mapping';
import { CommandContractType } from './types';

export function decodeTriggerData(
  commandAddress: string,
  network: number,
  data: string,
): utils.Result {
  const paramTypes = getDefinitionForCommandAddress(commandAddress, network);
  return utils.defaultAbiCoder.decode(paramTypes, data);
}

export function decodeTriggerDataByType(type: CommandContractType, data: string): utils.Result {
  const paramTypes = getDefinitionForCommandType(type);
  return utils.defaultAbiCoder.decode(paramTypes, data);
}

export function encodeTriggerData(
  commandAddress: string,
  network: number,
  values: readonly any[],
): string {
  const paramTypes = getDefinitionForCommandAddress(commandAddress, network);
  return utils.defaultAbiCoder.encode(paramTypes, values);
}

export function encodeTriggerDataByType(type: CommandContractType, values: readonly any[]): string {
  const paramTypes = getDefinitionForCommandType(type);
  return utils.defaultAbiCoder.encode(paramTypes, values);
}
