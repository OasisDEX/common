import ethers from 'ethers';
import { AutomationTriggerType, CommandContractType, EthereumNetwork } from './types';

const commandAddressMapping: Record<number, Record<string, CommandContractType>> = {
  [EthereumNetwork.GOERLI]: {
    '0xd0ca9883e4918894dd517847eb3673d656ec9f2d': CommandContractType.CloseCommand, // TODO:
  },
};

const commandTypeMapping: Record<
  CommandContractType,
  ReadonlyArray<string | ethers.utils.ParamType>
> = {
  [CommandContractType.CloseCommand]: ['uint256', 'uint16', 'uint256'],
};

export function getDefinitionForCommand(
  address: string,
  network: number,
): ReadonlyArray<string | ethers.utils.ParamType> {
  const type = commandAddressToType(address, network);

  if (!(type in commandTypeMapping)) {
    throw new Error(
      `Unknown command type ${type}. Supported types: ${Object.keys(commandTypeMapping).join(
        ', ',
      )}.`,
    );
  }

  return commandTypeMapping[type];
}

function commandAddressToType(address: string, network: number): CommandContractType {
  if (!(network in commandAddressMapping)) {
    throw new Error(
      `Command addresses for network ${network} not found. Supported networks: ${Object.keys(
        commandAddressMapping,
      ).join('; ')}.`,
    );
  }

  const lowercaseAddress = address.toLowerCase();
  const mappingForNetwork = commandAddressMapping[network as EthereumNetwork];
  if (!(lowercaseAddress in mappingForNetwork)) {
    throw new Error(`Command address ${lowercaseAddress} for network ${network} not found.`);
  }

  return mappingForNetwork[lowercaseAddress];
}

export function triggerTypeToCommand(type: AutomationTriggerType): CommandContractType {
  switch (type) {
    case AutomationTriggerType.StopLossToCollateral:
    case AutomationTriggerType.StopLossToDai:
      return CommandContractType.CloseCommand;
    default:
      throw new Error(`Unknown trigger type: ${type}`);
  }
}
