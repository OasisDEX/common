# `automation`

The package provides a set of utility functions to handle
interactions with Automation smart contracts.

## Usage

### Encoding

```ts

import { encodeTriggerData } from '@oasisdex/automation'

const network = 1; // mainnet
const closeCommandAddress = '0x...';

const encodedData = encodeTriggerData(closeCommandAddress, network, [cdpId, triggerType, ...params]);

```

### Decoding

```ts

import { decodeTriggerData } from '@oasisdex/automation'

const network = 1; // mainnet
const closeCommandAddress = '0x...';
const { triggerData } = triggerInfo

const [ cdpId, triggerType, ...params ] = decodeTriggerData(closeCommandAddress, network, triggerData);

```
