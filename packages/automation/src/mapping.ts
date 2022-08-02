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
    '0x7c86781a95b7e55e6c2f7297ae6773e1dbceab13': {
      type: CommandContractType.BasicBuyCommand,
      overwrite: ['uint256', 'uint16', 'uint256', 'uint256', 'uint256', 'bool', 'uint64'],
    },
    '0xe3ae7218d8e4a482e212ef1cbf2fcd0fb9882cc7': { type: CommandContractType.BasicBuyCommand },
    '0x98b2b67795171380a4bfb5b8cd2f59aea768b3ed': { type: CommandContractType.BasicBuyCommand },
    '0x2003dc19056ba986b7d10ab4704897d685dd62d9': { type: CommandContractType.BasicBuyCommand },
    '0xd4f94e013c7f47b989ea79c6527e065c027794c7': {
      type: CommandContractType.BasicSellCommand,
      overwrite: ['uint256', 'uint16', 'uint256', 'uint256', 'uint256', 'bool', 'uint64'],
    },
    '0x6f878d8eb84e48da49900a6392b8f9ed262a50d7': { type: CommandContractType.BasicSellCommand },
    '0x3da3e38bbe1100de5247617b4554115c0e452416': { type: CommandContractType.BasicSellCommand },
    '0xb52b1c61c667d570ff62745b19a0c58011a4b32c': { type: CommandContractType.BasicSellCommand },
    '0x2ecc5086ce10194175607d0d082fc27c3416693d': { type: CommandContractType.BasicSellCommand },
    '0x15c595cE24576924b2302BBcAD552E3dAdFA4469': { type: CommandContractType.CMBasicSellCommand },
    '0xcbAAAe60EeAB8B3DF33fA84f704C0c43CEC29F73': { type: CommandContractType.CMBasicBuyCommand },
  },
  [EthereumNetwork.MAINNET]: {
    '0xa553c3f4e65a1fc951b236142c1f69c1bca5bf2b': { type: CommandContractType.CloseCommand },
    '0x05fb55553e54afb33a5acc1f23b1f4fffd0d1af9': { type: CommandContractType.BasicBuyCommand },
    '0xd36729c7cac24e47dc32ffd7d433f965caaeb912': { type: CommandContractType.BasicBuyCommand },
    '0xa6bd41b821972e83d30598c5683efbbe6ad70fb8': { type: CommandContractType.BasicSellCommand },
    '0xf9469da48f9d2ea87e195e3dd522226e876a1185': { type: CommandContractType.BasicSellCommand },
    '0x5588d89a3c68e5a87cafe6b79ef8caa667a702f1': { type: CommandContractType.BasicSellCommand },
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
    'uint32',
  ],
  [CommandContractType.BasicSellCommand]: [
    'uint256',
    'uint16',
    'uint256',
    'uint256',
    'uint256',
    'bool',
    'uint64',
    'uint32',
  ],
  [CommandContractType.CMBasicSellCommand]: [
    'uint256',
    'uint16',
    'uint256',
    'uint256',
    'uint256',
    'bool',
    'uint64',
    'uint32',
  ],
  [CommandContractType.CMBasicBuyCommand]: [
    'uint256',
    'uint16',
    'uint256',
    'uint256',
    'uint256',
    'bool',
    'uint64',
    'uint32',
  ],
} as const;

export function getCommandAddresses(network: number): Record<CommandContractType, string[]> {
  if (!(network in commandAddressMapping)) {
    throw new Error(
      `Command addresses for network ${network} not found. Supported networks: ${Object.keys(
        commandAddressMapping,
      ).join(', ')}.`,
    );
  }

  const mappingForNetwork = commandAddressMapping[network as EthereumNetwork];
  return Object.entries(mappingForNetwork).reduce(
    (agg, [address, { type }]) => ({ ...agg, [type]: (agg[type] || []).concat([address]) }),
    {} as Record<CommandContractType, string[]>,
  );
}

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
      ).join(', ')}.`,
    );
  }

  const mappingForNetwork = commandAddressMapping[network as EthereumNetwork];
  const lowercaseAddress = address.toLowerCase();
  if (!(lowercaseAddress in mappingForNetwork)) {
    throw new Error(
      `Command address ${lowercaseAddress} for network ${network} not found. Supported Addresses: ${JSON.stringify(
        mappingForNetwork,
      )}`,
    );
  }

  return mappingForNetwork[lowercaseAddress];
}
