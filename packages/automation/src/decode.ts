import ethers from 'ethers';
import { getDefinitionForCommand } from './mapping';

export function decodeTriggerData(
  commandAddress: string,
  network: number,
  data: string,
): ethers.utils.Result {
  const paramTypes = getDefinitionForCommand(commandAddress, network);
  return ethers.utils.defaultAbiCoder.decode(paramTypes, data);
}
