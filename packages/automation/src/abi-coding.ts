import ethers from 'ethers';
import { commandAddressToType, getDefinitionForCommand } from './mapping';
import { CommandContractType } from './types';

export function decodeTriggerData(
  commandAddress: string,
  network: number,
  data: string,
): ethers.utils.Result {
  const type = commandAddressToType(commandAddress, network);
  const paramTypes = getDefinitionForCommand(type);
  return ethers.utils.defaultAbiCoder.decode(paramTypes, data);
}

export function decodeTriggerDataByType(
  type: CommandContractType,
  data: string,
): ethers.utils.Result {
  const paramTypes = getDefinitionForCommand(type);
  return ethers.utils.defaultAbiCoder.decode(paramTypes, data);
}

export function encodeTriggerData(
  commandAddress: string,
  network: number,
  values: readonly any[],
): string {
  const type = commandAddressToType(commandAddress, network);
  const paramTypes = getDefinitionForCommand(type);
  return ethers.utils.defaultAbiCoder.encode(paramTypes, values);
}

export function encodeTriggerDataByType(type: CommandContractType, values: readonly any[]): string {
  const paramTypes = getDefinitionForCommand(type);
  return ethers.utils.defaultAbiCoder.encode(paramTypes, values);
}
