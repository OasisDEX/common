import {
  CommandContractInfo,
  CommandContractType,
  EthereumNetwork,
  ParamDefinition,
} from './types';

// The addresses must be in lowercase!
export const commandAddressMapping: Record<number, Record<string, CommandContractInfo>> = {
  [EthereumNetwork.GOERLI]: {
    '0xd0ca9883e4918894dd517847eb3673d656ec9f2d': { type: CommandContractType.CloseCommand },
    '0x31285a87fb70a62b5aaa43199e53221c197e1e3f': { type: CommandContractType.CloseCommand },
    '0x7c86781a95b7e55e6c2f7297ae6773e1dbceab13': { type: CommandContractType.BasicBuyCommand },
    '0xe3ae7218d8e4a482e212ef1cbf2fcd0fb9882cc7': { type: CommandContractType.BasicBuyCommand },
    '0xd4f94e013c7f47b989ea79c6527e065c027794c7': { type: CommandContractType.BasicSellCommand },
    '0x6f878d8eb84e48da49900a6392b8f9ed262a50d7': { type: CommandContractType.BasicSellCommand },
  },
  [EthereumNetwork.MAINNET]: {
    '0xa553c3f4e65a1fc951b236142c1f69c1bca5bf2b': { type: CommandContractType.CloseCommand },
  },
};

export const defaultCommandTypeMapping = {
  [CommandContractType.CloseCommand]: ['uint256', 'uint16', 'uint256'],
  [CommandContractType.BasicBuyCommand]: [
    'uint256',
    'uint16',
    'uint256',
    'uint256',
    'uint256',
    'bool',
    'uint64',
  ],
  [CommandContractType.BasicSellCommand]: [
    'uint256',
    'uint16',
    'uint256',
    'uint256',
    'uint256',
    'bool',
    'uint64',
  ],
} as const;

export function getDefinitionForCommandType(type: CommandContractType): ParamDefinition {
  if (!(type in defaultCommandTypeMapping)) {
    throw new Error(
      `Unknown command type ${type}. Supported types: ${Object.keys(defaultCommandTypeMapping).join(
        ', ',
      )}.`,
    );
  }

  return defaultCommandTypeMapping[type];
}

export function getDefinitionForCommandAddress(address: string, network: number): ParamDefinition {
  const info = getCommandContractInfo(address, network);
  return info.overwrite ?? getDefinitionForCommandType(info.type);
}

export function getCommandContractInfo(address: string, network: number): CommandContractInfo {
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
    throw new Error(
      `Command address ${lowercaseAddress} for network ${network} not found. Supported Addresses: ${JSON.stringify(
        mappingForNetwork,
      )}`,
    );
  }

  return mappingForNetwork[lowercaseAddress];
}
