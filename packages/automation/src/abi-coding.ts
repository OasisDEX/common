import { utils } from 'ethers';
import {
  commandAddressMapping,
  commandTypeJsonMapping,
  getDefinitionForCommandAddress,
  getDefinitionForCommandType,
} from './mapping';
import { CommandContractType } from './types';

export function decodeTriggerData(
  commandAddress: string,
  network: number,
  data: string,
): utils.Result {
  const paramTypes = getDefinitionForCommandAddress(commandAddress, network);
  return utils.defaultAbiCoder.decode(paramTypes, data);
}

export function decodeTriggerDataAsJson(
  commandAddress: string,
  network: number,
  data: string,
): utils.Result {
  const arr: any[] = decodeTriggerData(commandAddress, network, data) as any[];
  const type = commandAddressMapping[network][commandAddress].type;

  return arr.reduce((acc, curr, idx) => {
    acc[commandTypeJsonMapping[type][idx]] = curr.toString();
    return acc;
  }, {});
}

export function decodeTriggerDataByType(type: CommandContractType, data: string): utils.Result {
  const paramTypes = getDefinitionForCommandType(type);
  return utils.defaultAbiCoder.decode(paramTypes, data);
}

export function decodeTriggerDataByTypeAsJson(
  type: CommandContractType,
  data: string,
): utils.Result {
  const arr: any[] = decodeTriggerDataByType(type, data) as any[];

  return arr.reduce((acc, curr, idx) => {
    acc[commandTypeJsonMapping[type][idx]] = curr.toString();
    return acc;
  }, {});
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
