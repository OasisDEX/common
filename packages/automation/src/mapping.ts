import ethers from 'ethers';
import { CommandContractType, EthereumNetwork } from './types';

// The addresses must be in lowercase
const commandAddressMapping: Record<number, Record<string, CommandContractType>> = {
  [EthereumNetwork.GOERLI]: {
    '0xd0ca9883e4918894dd517847eb3673d656ec9f2d': CommandContractType.CloseCommand,
  },
};

const commandTypeMapping: Record<
  CommandContractType,
  ReadonlyArray<string | ethers.utils.ParamType>
> = {
  [CommandContractType.CloseCommand]: ['uint256', 'uint16', 'uint256'],
};

export function getDefinitionForCommand(
  type: CommandContractType,
): ReadonlyArray<string | ethers.utils.ParamType> {
  if (!(type in commandTypeMapping)) {
    throw new Error(
      `Unknown command type ${type}. Supported types: ${Object.keys(commandTypeMapping).join(
        ', ',
      )}.`,
    );
  }

  return commandTypeMapping[type];
}

export function commandAddressToType(address: string, network: number): CommandContractType {
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
