import { expect } from 'chai';
import { BigNumber as EthersBN, constants, utils } from 'ethers';
import {
  decodeTriggerData,
  decodeTriggerDataByType,
  encodeTriggerData,
  encodeTriggerDataByType,
} from '../src/abi-coding';
import { commandAddressMapping, getDefinitionForCommand } from '../src/mapping';
import { CommandContractType, EthereumNetwork } from '../src/types';

describe('abi-coding', () => {
  const type = CommandContractType.CloseCommand;
  const network = EthereumNetwork.GOERLI;
  const [commandAddress] = Object.keys(commandAddressMapping[network]);
  const paramTypes = getDefinitionForCommand(type);

  const validValues = [12, 1, 101];
  const data = utils.defaultAbiCoder.encode(paramTypes, validValues);

  describe('encode', () => {
    it('can encode trigger data by command address', () => {
      const result = encodeTriggerData(commandAddress, network, validValues);
      expect(result).to.eq(data);
    });

    it('can encode trigger data by command type', () => {
      const result = encodeTriggerDataByType(type, validValues);
      expect(result).to.eq(data);
    });

    it('can encode if supplied command address is not lowercase', () => {
      const result = encodeTriggerData(commandAddress, network, validValues);
      expect(result).to.eq(data);
    });

    it('throws if invalid network provided', () => {
      const invalidNetworkId = 100;
      expect(() => encodeTriggerData(commandAddress, invalidNetworkId, validValues)).to.throw(
        `Command addresses for network ${invalidNetworkId} not found`,
      );
    });

    it('throws if invalid command address provided', () => {
      const invalidAddress = constants.AddressZero;
      expect(() => encodeTriggerData(invalidAddress, network, validValues)).to.throw(
        `Command address ${invalidAddress} for network ${network} not found.`,
      );
    });

    it('throws if invalid type provided', () => {
      const invalidType = 'InvalidCommand';
      expect(() =>
        encodeTriggerDataByType(invalidType as CommandContractType, validValues),
      ).to.throw(`Unknown command type ${invalidType}`);
    });

    it('throws if invalid values are provided', () => {
      const invalidValues = ['1x2', 1, 101];
      expect(() => encodeTriggerData(commandAddress, network, invalidValues)).to.throw();
      expect(() => encodeTriggerDataByType(type, invalidValues)).to.throw();
    });
  });

  describe('decode', () => {
    it('can decode trigger data by command address', () => {
      const result = decodeTriggerData(commandAddress, network, data);
      result.forEach((value, idx) => {
        expect(EthersBN.from(value).toNumber()).to.eq(validValues[idx]);
      });
    });

    it('can decode trigger data by command address', () => {
      const result = decodeTriggerDataByType(type, data);
      result.forEach((value, idx) => {
        expect(EthersBN.from(value).toNumber()).to.eq(validValues[idx]);
      });
    });

    it('throws if invalid network provided', () => {
      const invalidNetworkId = 100;
      expect(() => decodeTriggerData(commandAddress, invalidNetworkId, data)).to.throw(
        `Command addresses for network ${invalidNetworkId} not found`,
      );
    });

    it('throws if invalid command address provided', () => {
      const invalidAddress = constants.AddressZero;
      expect(() => decodeTriggerData(invalidAddress, network, data)).to.throw(
        `Command address ${invalidAddress} for network ${network} not found.`,
      );
    });

    it('throws if invalid type provided', () => {
      const invalidType = 'InvalidCommand';
      expect(() => decodeTriggerDataByType(invalidType as CommandContractType, data)).to.throw(
        `Unknown command type ${invalidType}`,
      );
    });

    it('throws if invalid data provided', () => {
      const invalidData = '0xdead';
      expect(() => decodeTriggerData(commandAddress, network, invalidData)).to.throw();
      expect(() => decodeTriggerDataByType(type, invalidData)).to.throw();
    });
  });

  describe('e2e', () => {
    it('can encode and decode target values and they stay the same', () => {
      const targetValues = [3567, 2, 160];
      const encoded = encodeTriggerData(commandAddress, network, targetValues);
      const decoded = decodeTriggerData(commandAddress, network, encoded);
      decoded.forEach((value, idx) => {
        expect(EthersBN.from(value).toNumber()).to.eq(targetValues[idx]);
      });
    });
  });
});
