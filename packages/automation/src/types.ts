import { ethers } from 'ethers';

export enum EthereumNetwork {
  MAINNET = 1,
  GOERLI = 5,
}

export enum CommandContractType {
  CloseCommand = 'CloseCommand',
}

export type CommandTypeMapping = Record<
  CommandContractType,
  ReadonlyArray<string | ethers.utils.ParamType>
>;
