import { AssetType } from '../enums/asset-type.enum';
import { AssetDefinition } from '../models/asset-definition';
import { AssetReference } from '../models/asset-reference';

const C = AssetType.Crypto;

export const cryptoCatalogue = [
  new AssetDefinition(new AssetReference(C, 'BTC'), 'Bitcoin'),
  new AssetDefinition(new AssetReference(C, 'ETH'), 'Ethereum'),
  new AssetDefinition(new AssetReference(C, 'QRL'), 'Quanta'),
  new AssetDefinition(new AssetReference(C, 'NANO'), 'Nano'),
  new AssetDefinition(new AssetReference(C, 'XMR'), 'Monero')
];
