import {
  CommandContractInfo,
  CommandContractType,
  EthereumNetwork,
  ParamDefinition,
  triggerTypeToCommandContractTypeMap,
  TriggerType,
} from './types';

export const commandTypeJsonMapping: Record<CommandContractType, string[]> = {
  [CommandContractType.CloseCommand]: ['cdpId', 'triggerType', 'collRatio'],
  [CommandContractType.BasicBuyCommand]: [
    'cdpId',
    'triggerType',
    'execCollRatio',
    'targetCollRatio',
    'maxBuyPrice',
    'continuous',
    'deviation',
    'maxBaseFeeInGwei',
  ],
  [CommandContractType.BasicSellCommand]: [
    'cdpId',
    'triggerType',
    'execCollRatio',
    'targetCollRatio',
    'minSellPrice',
    'continuous',
    'deviation',
    'maxBaseFeeInGwei',
  ],
  [CommandContractType.AutoTakeProfitCommand]: [
    'cdpId',
    'triggerType',
    'executionPrice',
    'maxBaseFeeInGwei',
  ],
  [CommandContractType.SimpleAAVESellCommand]: [
    'positionAddress',
    'triggerType',
    'amount',
    'interval',
    'recipient',
  ],
  [CommandContractType.AaveStopLossCommand]: [
    'positionAddress',
    'triggerType',
    'collateralToken',
    'debtToken',
    'ltv',
  ],
  [CommandContractType.AaveStopLossCommandV2]: [
    'positionAddress',
    'triggerType',
    'maxCoverage',
    'debtToken',
    'collateralToken',
    'ltv',
  ],
  [CommandContractType.SparkStopLossCommandV2]: [
    'positionAddress',
    'triggerType',
    'maxCoverage',
    'debtToken',
    'collateralToken',
    'ltv',
  ],
  [CommandContractType.MakerStopLossCommandV2]: [
    'cdpId',
    'triggerType',
    'maxCoverage',
    'collRatio',
  ],
  [CommandContractType.MakerBasicBuyCommandV2]: [
    'cdpId',
    'triggerType',
    'maxCoverage',
    'execCollRatio',
    'targetCollRatio',
    'maxBuyPrice',
    'deviation',
    'maxBaseFeeInGwei',
  ],
  [CommandContractType.MakerBasicSellCommandV2]: [
    'cdpId',
    'triggerType',
    'maxCoverage',
    'execCollRatio',
    'targetCollRatio',
    'minSellPrice',
    'deviation',
    'maxBaseFeeInGwei',
  ],
  [CommandContractType.MakerAutoTakeProfitCommandV2]: [
    'cdpId',
    'triggerType',
    'maxCoverage',
    'executionPrice',
    'maxBaseFeeInGwei',
  ],
  [CommandContractType.AaveBasicSellCommandV2]: [
    'positionAddress',
    'triggerType',
    'maxCoverage',
    'debtToken',
    'collateralToken',
    'opHash',
    'execLtv',
    'targetLtv',
    'minSellPrice',
    'deviation',
    'maxBaseFeeInGwei',
  ],
  [CommandContractType.AaveBasicBuyCommandV2]: [
    'positionAddress',
    'triggerType',
    'maxCoverage',
    'debtToken',
    'collateralToken',
    'opHash',
    'execLtv',
    'targetLtv',
    'maxBuyPrice',
    'deviation',
    'maxBaseFeeInGwei',
  ],
};

export const commandAddressMapping: Record<
  number,
  Record<string, CommandContractInfo>
> = Object.fromEntries(
  Object.entries({
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
      '0xf19ae4c34e0e0db13d074876a12339e86dc12f06': { type: CommandContractType.BasicBuyCommand },
      '0xd4f94e013c7f47b989ea79c6527e065c027794c7': {
        type: CommandContractType.BasicSellCommand,
        overwrite: ['uint256', 'uint16', 'uint256', 'uint256', 'uint256', 'bool', 'uint64'],
      },
      '0x6f878d8eb84e48da49900a6392b8f9ed262a50d7': { type: CommandContractType.BasicSellCommand },
      '0x3da3e38bbe1100de5247617b4554115c0e452416': { type: CommandContractType.BasicSellCommand },
      '0xb52b1c61c667d570ff62745b19a0c58011a4b32c': { type: CommandContractType.BasicSellCommand },
      '0x2ecc5086ce10194175607d0d082fc27c3416693d': { type: CommandContractType.BasicSellCommand },
      '0x940a17668197f71dcaefd77bf8c43c001c77f5ac': { type: CommandContractType.BasicSellCommand },
      '0x02b7391cdd0c8a75ecfc278d387e3dcc3d796340': {
        type: CommandContractType.AutoTakeProfitCommand,
      },
      '0x7b548daF6c7057449a57c08b9d34e352dB220E3B': {
        type: CommandContractType.SimpleAAVESellCommand,
      },
      '0xE78ACEa26B79564C4D29D8c1f5bAd3D4E0414676': {
        type: CommandContractType.AaveStopLossCommand,
      },
    },
    [EthereumNetwork.MAINNET]: {
      '0xa553c3f4e65a1fc951b236142c1f69c1bca5bf2b': { type: CommandContractType.CloseCommand },
      '0x05fb55553e54afb33a5acc1f23b1f4fffd0d1af9': { type: CommandContractType.BasicBuyCommand },
      '0xd36729c7cac24e47dc32ffd7d433f965caaeb912': { type: CommandContractType.BasicBuyCommand },
      '0x31285a87fb70a62b5aaa43199e53221c197e1e3f': { type: CommandContractType.BasicBuyCommand },
      '0xa6bd41b821972e83d30598c5683efbbe6ad70fb8': { type: CommandContractType.BasicSellCommand },
      '0xf9469da48f9d2ea87e195e3dd522226e876a1185': { type: CommandContractType.BasicSellCommand },
      '0x5588d89a3c68e5a87cafe6b79ef8caa667a702f1': { type: CommandContractType.BasicSellCommand },
      '0x7c0d6d8d6eae8bcb106afdb3a21df5c254c6c0b2': { type: CommandContractType.BasicSellCommand },
      '0xc6ccab5d277d4780998362a418a86032548132b8': {
        type: CommandContractType.AutoTakeProfitCommand,
      },
      '0xcb1e2f1df93bb5640562dad05c15f7677bf17297': {
        type: CommandContractType.AutoTakeProfitCommand,
      },
      '0xE78ACEa26B79564C4D29D8c1f5bAd3D4E0414676': {
        type: CommandContractType.AaveStopLossCommand,
      },
      '0xcEF8EB2D43DC1db1AB292Cb92F38Dd406EE5749f': {
        type: CommandContractType.AaveStopLossCommand,
      },
      '0x65127d52aaeb356b45c6dcb3da36f4fc6ff738ef': {
        type: CommandContractType.AaveStopLossCommandV2,
      },
      '0xDC1c84Aac43F21f103e9bD0B091a1B5cc6433554': {
        type: CommandContractType.AaveStopLossCommandV2,
      },
      '0xc49e905346bC68BdfB46ED1E46E0804ffDC4458a': {
        type: CommandContractType.SparkStopLossCommandV2,
      },
      '0x9F47b484E921619028eF1c6F7fE73F9921B5AC6D': {
        type: CommandContractType.SparkStopLossCommandV2,
      },
      '0x2af43189E85CEA21aa8FA5d61139b771328d8D30': {
        type: CommandContractType.SparkStopLossCommandV2,
      },
    },
  }).map(([network, mapping]) => [
    network,
    Object.fromEntries(
      Object.entries(mapping).map(([address, config]) => [address.toLowerCase(), config]),
    ),
  ]),
);

export const defaultCommandTypeMapping = {
  [CommandContractType.CloseCommand]: ['uint256', 'uint16', 'uint256'],
  [CommandContractType.SimpleAAVESellCommand]: [
    'address',
    'uint16',
    'uint256',
    'uint256',
    'address',
  ],
  [CommandContractType.AutoTakeProfitCommand]: ['uint256', 'uint16', 'uint256', 'uint32'],
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
  [CommandContractType.AaveStopLossCommand]: ['address', 'uint16', 'address', 'address', 'uint256'],
  [CommandContractType.AaveStopLossCommandV2]: [
    'address',
    'uint16',
    'uint256',
    'address',
    'address',
    'uint256',
  ],
  [CommandContractType.SparkStopLossCommandV2]: [
    'address',
    'uint16',
    'uint256',
    'address',
    'address',
    'uint256',
  ],
  [CommandContractType.MakerStopLossCommandV2]: ['uint256', 'uint16', 'uint256', 'uint256'],
  [CommandContractType.MakerAutoTakeProfitCommandV2]: ['uint256', 'uint16', 'uint256', 'uint32'],
  [CommandContractType.MakerBasicBuyCommandV2]: [
    'uint256', //cdpId
    'uint16', // triggerType
    'uint256', // maxCoverage
    'uint256', // execCollRatio
    'uint256', // targetCollRatio
    'uint256', // maxBuyPrice
    'uint64', // deviation
    'uint32', // maxBaseFeeInGwei
  ],
  [CommandContractType.MakerBasicSellCommandV2]: [
    'uint256', //cdpId
    'uint16', // triggerType
    'uint256', // maxCoverage
    'uint256', // execCollRatio
    'uint256', // targetCollRatio
    'uint256', // minSellPrice
    'uint64', // deviation
    'uint32', // maxBaseFeeInGwei
  ],
  [CommandContractType.AaveBasicBuyCommandV2]: [
    'address', //positionAddress
    'uint16', // triggerType
    'uint256', // maxCoverage
    'address', // debtToken
    'address', // collateralToken
    'bytes32', // opHash
    'uint256', // execCollRatio
    'uint256', // targetCollRatio
    'uint256', // maxBuyPrice
    'uint64', // deviation
    'uint32', // maxBaseFeeInGwei
  ],
  [CommandContractType.AaveBasicSellCommandV2]: [
    'address', //positionAddress
    'uint16', // triggerType
    'uint256', // maxCoverage
    'address', // debtToken
    'address', // collateralToken
    'bytes32', // opHash
    'uint256', // execCollRatio
    'uint256', // targetCollRatio
    'uint256', // minSellPrice
    'uint64', // deviation
    'uint32', // maxBaseFeeInGwei
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

/**
 * Retrieves the parameter definition for a given command type.
 * @param type - The command type.
 * @returns The parameter definition for the specified command type.
 * @throws Error if the command type is unknown.
 */
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

/**
 * Retrieves the parameter definition for a given trigger type.
 * @param triggerType The type of trigger.
 * @returns The parameter definition for the specified trigger type.
 * @throws Error if the command type is unknown.
 */
export function getDefinitionForTriggerType(triggerType: TriggerType): ParamDefinition {
  const type = triggerTypeToCommandContractTypeMap[triggerType];
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
